// Creates this store's products in Printful so paid orders can be fulfilled automatically.
// Each Printful variant gets external_id = the store SKU, which is what the webhook orders by.
//
//   PRINTFUL_TOKEN=... SITE_URL=https://your-store-host node scripts/printful-sync.mjs --dry-run
//   PRINTFUL_TOKEN=... SITE_URL=https://your-store-host node scripts/printful-sync.mjs --only grateful-tee
//   PRINTFUL_TOKEN=... SITE_URL=https://your-store-host node scripts/printful-sync.mjs
//
// Run --only on one product first and check its mockup in Printful before running everything.
// Print files must already be live at SITE_URL/print-files/ (deploy the site first).
import fs from "node:fs";
import { PRODUCTS, TYPES, COLORS, optionPrice, sku } from "../catalog.js";

const map = JSON.parse(fs.readFileSync(new URL("./printful-map.json", import.meta.url)));
const dry = process.argv.includes("--dry-run");
const only = process.argv.includes("--only") ? process.argv[process.argv.indexOf("--only") + 1] : null;
const { PRINTFUL_TOKEN, PRINTFUL_STORE_ID, SITE_URL } = process.env;
if (!PRINTFUL_TOKEN || !SITE_URL) { console.error("Set PRINTFUL_TOKEN and SITE_URL."); process.exit(1); }

const H = { authorization: `Bearer ${PRINTFUL_TOKEN}`, "content-type": "application/json", ...(PRINTFUL_STORE_ID ? { "X-PF-Store-Id": PRINTFUL_STORE_ID } : {}) };
const api = async (path, opt = {}) => {
  const r = await fetch("https://api.printful.com" + path, { headers: H, ...opt });
  const j = await r.json();
  if (!r.ok) throw new Error(`${path}: ${r.status} ${JSON.stringify(j.error || j.result)}`);
  return j.result;
};
const catalogCache = {};
const variantsOf = async (id) => (catalogCache[id] ??= (await api(`/products/${id}`)).variants);
const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, "");

const manual = [];
for (const p of PRODUCTS) {
  if (only && p.id !== only) continue;
  const m = map[p.type];
  if (!m || !m.auto) { manual.push(p); continue; }
  const sync_variants = [];
  let missing = [];
  for (const color of p.colors) {
    const dark = !!COLORS[color].dark;
    const pid = p.type === "mug" && color === "black" ? m.productIdBlack : m.productId;
    if (!pid) { missing.push(`${p.type}${p.type === "mug" && color === "black" ? " (black)" : ""}: productId not set`); continue; }
    const vs = await variantsOf(pid);
    for (const opt of TYPES[p.type].options) {
      const wantColor = m.colorNames ? m.colorNames[color] : null;
      const wantSize = (m.optionNames || {})[opt] || opt;
      const v = vs.find((x) => (!wantColor || norm(x.color) === norm(wantColor)) && (TYPES[p.type].options.length === 1 || norm(x.size) === norm(wantSize)));
      if (!v) { missing.push(`${color} / ${opt}`); continue; }
      sync_variants.push({
        external_id: sku(p.id, color, opt),
        variant_id: v.id,
        retail_price: optionPrice(p, opt).toFixed(2),
        files: [{ type: m.placement, url: `${SITE_URL}/print-files/${p.design}-${dark ? "for-dark" : "for-light"}.png` }],
      });
    }
  }
  if (missing.length) console.log(`! ${p.id}: no Printful match for ${missing.join(", ")}`);
  if (!sync_variants.length) continue;
  const body = { sync_product: { name: p.name, external_id: p.id }, sync_variants };
  if (dry) { console.log(`would create ${p.id} with ${sync_variants.length} variants`); continue; }
  const res = await api("/store/products", { method: "POST", body: JSON.stringify(body) });
  console.log(`created ${p.id} → Printful product ${res.id} (${sync_variants.length} variants)`);
}
if (manual.length) {
  console.log(`\nSet up by hand in Printful's designer (external IDs must match exactly):`);
  for (const p of manual) for (const c of p.colors) for (const o of TYPES[p.type].options) {
    const pack = (TYPES[p.type].pack || {})[o];
    if (pack) continue; // packs are fulfilled as N single cards
    console.log(`  ${sku(p.id, c, o)}   ${p.name}, ${COLORS[c].name} ${COLORS[c].hex}, ${o}, print file ${p.design}-on-${c}.png`);
  }
}
