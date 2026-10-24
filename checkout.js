// POST /api/checkout — turns a bag into a Stripe Checkout Session.
// Prices come from catalog.js on the server; the browser only sends SKUs and quantities.
//
// Environment variables (Cloudflare Pages → Settings → Variables and secrets):
//   STRIPE_SECRET_KEY   required. sk_test_... while testing, sk_live_... to go live.
//   STRIPE_TAX          optional. "on" turns on Stripe Tax, once registrations are set up in Stripe.
import { CONFIG, parseSku, TYPES, COLORS } from "../../catalog.js";

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

export async function onRequestPost({ request, env }) {
  if (!env.STRIPE_SECRET_KEY) return json({ error: "Checkout is not configured yet." }, 503);

  let items;
  try { ({ items } = await request.json()); } catch { return json({ error: "The bag could not be read." }, 400); }
  if (!Array.isArray(items) || !items.length) return json({ error: "Your bag is empty." }, 400);
  if (items.length > CONFIG.maxLines) return json({ error: `A single order can hold up to ${CONFIG.maxLines} different items.` }, 400);

  const f = new URLSearchParams();
  let i = 0, subtotal = 0;
  for (const it of items) {
    const v = parseSku(it && it.sku);
    const qty = Number(it && it.qty);
    if (!v || !Number.isInteger(qty) || qty < 1 || qty > CONFIG.maxQtyPerLine)
      return json({ error: "One item in your bag is no longer available. Remove it and try again." }, 400);
    subtotal += v.unitCents * qty;
    const k = `line_items[${i}]`;
    f.append(`${k}[quantity]`, qty);
    f.append(`${k}[price_data][currency]`, CONFIG.currency);
    f.append(`${k}[price_data][unit_amount]`, v.unitCents);
    f.append(`${k}[price_data][product_data][name]`, v.product.name);
    f.append(`${k}[price_data][product_data][description]`, `${TYPES[v.product.type].label} · ${COLORS[v.color].name} · ${v.option}`);
    f.append(`${k}[price_data][product_data][metadata][sku]`, it.sku);
    i++;
  }

  const origin = new URL(request.url).origin;
  f.append("mode", "payment");
  f.append("success_url", `${origin}/?order=success`);
  f.append("cancel_url", `${origin}/`);
  f.append("shipping_address_collection[allowed_countries][0]", "US");
  f.append("phone_number_collection[enabled]", "true");
  f.append("allow_promotion_codes", "true");
  f.append("billing_address_collection", "auto");

  // Shipping choices shown in Checkout.
  const sh = CONFIG.shipping;
  const std = subtotal >= sh.standard.freeOverCents ? 0 : sh.standard.cents;
  [["standard", std], ["express", sh.express.cents]].forEach(([key, amount], n) => {
    const s = sh[key], k = `shipping_options[${n}][shipping_rate_data]`;
    f.append(`${k}[type]`, "fixed_amount");
    f.append(`${k}[display_name]`, amount === 0 ? `${s.label} (free)` : s.label);
    f.append(`${k}[fixed_amount][amount]`, amount);
    f.append(`${k}[fixed_amount][currency]`, CONFIG.currency);
    // Includes production time, so the customer sees the real window.
    f.append(`${k}[delivery_estimate][minimum][unit]`, "business_day");
    f.append(`${k}[delivery_estimate][minimum][value]`, 2 + s.transit[0]);
    f.append(`${k}[delivery_estimate][maximum][unit]`, "business_day");
    f.append(`${k}[delivery_estimate][maximum][value]`, 6 + s.transit[1]);
    if (env.STRIPE_TAX === "on") f.append(`${k}[tax_behavior]`, "exclusive");
  });

  f.append("custom_fields[0][key]", "gift_message");
  f.append("custom_fields[0][label][type]", "custom");
  f.append("custom_fields[0][label][custom]", "Gift message (optional)");
  f.append("custom_fields[0][type]", "text");
  f.append("custom_fields[0][optional]", "true");
  f.append("custom_fields[0][text][maximum_length]", "200");

  if (env.STRIPE_TAX === "on") f.append("automatic_tax[enabled]", "true");

  const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, "content-type": "application/x-www-form-urlencoded" },
    body: f,
  });
  const s = await r.json();
  if (!r.ok) {
    console.log("stripe error", JSON.stringify(s.error || s));
    return json({ error: "Checkout could not be opened. Please try again in a minute." }, 502);
  }
  return json({ url: s.url });
}
