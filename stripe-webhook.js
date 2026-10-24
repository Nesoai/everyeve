// POST /api/stripe-webhook — when Stripe confirms a paid order, send it to Printful.
//
// Environment variables:
//   STRIPE_SECRET_KEY        same key as checkout
//   STRIPE_WEBHOOK_SECRET    whsec_... from the Stripe webhook endpoint
//   PRINTFUL_TOKEN           Printful private token (Settings → API → private tokens)
//   PRINTFUL_STORE_ID        optional; needed when the token covers more than one store
//   PRINTFUL_AUTO_CONFIRM    "true" sends orders straight to production.
//                            Anything else creates a draft a principal confirms in Printful.
//   PRINTFUL_EXPRESS_METHOD  optional; Printful shipping method for express orders (default EXPRESS)
import { fulfilmentLine } from "../../catalog.js";

const enc = new TextEncoder();
const ok = (msg) => new Response(msg, { status: 200 });

async function verify(body, header, secret) {
  if (!header) return false;
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=")).filter((p) => p.length === 2 && p[0] !== "v1"));
  const sigs = header.split(",").filter((p) => p.startsWith("v1=")).map((p) => p.slice(3));
  const t = Number(parts.t);
  if (!t || Math.abs(Date.now() / 1000 - t) > 300) return false;
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(`${t}.${body}`)));
  const hex = [...mac].map((b) => b.toString(16).padStart(2, "0")).join("");
  return sigs.some((s) => s.length === hex.length && [...s].reduce((a, c, i) => a | (c.charCodeAt(0) ^ hex.charCodeAt(i)), 0) === 0);
}

export async function onRequestPost({ request, env }) {
  const body = await request.text();
  if (!(await verify(body, request.headers.get("stripe-signature"), env.STRIPE_WEBHOOK_SECRET || "")))
    return new Response("bad signature", { status: 400 });

  const event = JSON.parse(body);
  if (!["checkout.session.completed", "checkout.session.async_payment_succeeded"].includes(event.type)) return ok("ignored");
  if (event.data.object.payment_status !== "paid") return ok("not paid yet");

  // Fetch the full session: line items with their SKUs, and the chosen shipping rate.
  const q = new URLSearchParams();
  q.append("expand[]", "line_items.data.price.product");
  q.append("expand[]", "shipping_cost.shipping_rate");
  const sr = await fetch(`https://api.stripe.com/v1/checkout/sessions/${event.data.object.id}?${q}`, {
    headers: { authorization: `Bearer ${env.STRIPE_SECRET_KEY}` },
  });
  const s = await sr.json();
  if (!sr.ok) { console.log("stripe read failed", JSON.stringify(s)); return new Response("retry", { status: 500 }); }

  const ship = (s.collected_information && s.collected_information.shipping_details) || s.shipping_details;
  const cust = s.customer_details || {};
  if (!ship || !ship.address) { console.log("no shipping address on", s.id); return ok("no address"); }

  const items = s.line_items.data.map((li) => {
    const l = fulfilmentLine(li.price.product.metadata.sku, li.quantity);
    return { external_variant_id: l.externalVariantId, quantity: l.quantity };
  });
  const gift = (s.custom_fields || []).find((f) => f.key === "gift_message");
  const giftText = gift && gift.text && gift.text.value;
  const rate = s.shipping_cost && s.shipping_cost.shipping_rate;
  const express = rate && typeof rate === "object" && /express/i.test(rate.display_name || "");

  const order = {
    external_id: String(s.payment_intent || s.id).slice(0, 32),
    shipping: express ? env.PRINTFUL_EXPRESS_METHOD || "EXPRESS" : "STANDARD",
    recipient: {
      name: ship.name || cust.name,
      address1: ship.address.line1,
      address2: ship.address.line2 || undefined,
      city: ship.address.city,
      state_code: ship.address.state,
      country_code: ship.address.country,
      zip: ship.address.postal_code,
      email: cust.email,
      phone: cust.phone || undefined,
    },
    items,
    ...(giftText ? { gift: { subject: "A gift for you", message: giftText.slice(0, 200) } } : {}),
  };

  const confirm = env.PRINTFUL_AUTO_CONFIRM === "true" ? "true" : "false";
  const headers = { authorization: `Bearer ${env.PRINTFUL_TOKEN}`, "content-type": "application/json" };
  if (env.PRINTFUL_STORE_ID) headers["X-PF-Store-Id"] = env.PRINTFUL_STORE_ID;
  const pr = await fetch(`https://api.printful.com/orders?confirm=${confirm}`, { method: "POST", headers, body: JSON.stringify(order) });
  const pj = await pr.text();
  if (pr.ok) { console.log("printful order created", order.external_id, confirm === "true" ? "confirmed" : "draft"); return ok("sent"); }
  if (/already exists|duplicate/i.test(pj)) return ok("already sent");
  console.log("printful order failed", order.external_id, pr.status, pj);
  // A non-2xx makes Stripe retry for up to three days, and the failure shows in Stripe → Webhooks.
  return new Response("printful failed", { status: 500 });
}
