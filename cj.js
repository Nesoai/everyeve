// CJdropshipping order hand-off, used by the Stripe webhook.
// API reference: https://developers.cjdropshipping.com/en/api/api2/api/shopping.html
const BASE = "https://developers.cjdropshipping.com/api2.0/v1";

const STATES = { AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California", CO: "Colorado", CT: "Connecticut", DE: "Delaware", DC: "District of Columbia", FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming", PR: "Puerto Rico" };

async function call(path, token, init = {}) {
  const r = await fetch(BASE + path, { ...init, headers: { "content-type": "application/json", ...(token ? { "CJ-Access-Token": token } : {}), ...(init.headers || {}) } });
  const j = await r.json().catch(() => ({}));
  return { ok: r.ok && (j.result === true || j.code === 200), j };
}

export async function cjToken(apiKey) {
  const { ok, j } = await call("/authentication/getAccessToken", null, { method: "POST", body: JSON.stringify({ apiKey }) });
  if (!ok || !j.data || !j.data.accessToken) throw new Error("CJ sign-in failed: " + (j.message || "no token"));
  return j.data.accessToken;
}

// Shipping days from a CJ aging string like "2-5" (the slow end).
const maxDays = (a) => { const n = String(a || "").match(/\d+/g); return n ? Math.max(...n.map(Number)) : 99; };

// Cheapest US-warehouse route that arrives as fast as any other, or env.CJ_LOGISTIC when it is offered.
export async function cjPickShipping(token, zip, products, preferred) {
  const { ok, j } = await call("/logistic/freightCalculate", token, { method: "POST",
    body: JSON.stringify({ startCountryCode: "US", endCountryCode: "US", zip, products }) });
  if (!ok || !Array.isArray(j.data) || !j.data.length) throw new Error("CJ has no US shipping route for these items: " + (j.message || ""));
  if (preferred) { const hit = j.data.find((x) => x.logisticName === preferred); if (hit) return hit; }
  return [...j.data].sort((a, b) => maxDays(a.logisticAging) - maxDays(b.logisticAging) || a.logisticPrice - b.logisticPrice)[0];
}

// Creates the CJ order. payType 3 creates it unpaid (a principal pays it in CJ); 2 pays from the CJ balance.
export async function cjOrder(env, { orderNumber, ship, email, phone, lines }) {
  const token = await cjToken(env.CJ_API_KEY);
  const products = lines.map((l) => ({ vid: l.vid, quantity: l.quantity }));
  const route = await cjPickShipping(token, ship.address.postal_code, products, env.CJ_LOGISTIC);
  const body = {
    orderNumber,
    shippingCountryCode: "US", shippingCountry: "United States",
    shippingProvince: STATES[ship.address.state] || ship.address.state,
    shippingCity: ship.address.city,
    shippingAddress: ship.address.line1,
    shippingAddress2: ship.address.line2 || "",
    shippingZip: ship.address.postal_code,
    shippingCustomerName: ship.name,
    shippingPhone: phone || "",
    email: email || "",
    logisticName: route.logisticName,
    fromCountryCode: "US",
    payType: env.CJ_AUTO_PAY === "true" ? 2 : 3,
    products,
  };
  const { ok, j } = await call("/shopping/order/createOrderV2", token, { method: "POST", body: JSON.stringify(body) });
  if (ok) return { created: true, orderId: j.data && j.data.orderId, route: route.logisticName, paid: body.payType === 2 };
  if (/exist|duplicate|repeat/i.test(j.message || "")) return { created: false, duplicate: true };
  throw new Error(`CJ order failed: ${j.code} ${j.message}`);
}
