// Puts every printed product into Printful and downloads real product photos for the site.
//
//   PRINTFUL_TOKEN=... SITE_URL=https://your-store node scripts/printful-sync.mjs --dry-run
//   PRINTFUL_TOKEN=... SITE_URL=https://your-store node scripts/printful-sync.mjs --only grateful-tee
//   PRINTFUL_TOKEN=... SITE_URL=https://your-store node scripts/printful-sync.mjs
//
// Flags
//   --dry-run       check every variant against Printful's catalog; create nothing
//   --only <id>     one product (use first, then look at it in Printful)
//   --photos-only   skip product creation; just (re)download photos
//   --replace       delete and recreate products that already exist in Printful
//
// Needs Node 18+. Print files must already be live at SITE_URL/print-files/ (deploy the site first).
// Each Printful variant gets external_id = the store SKU, which is what the checkout webhook orders by.
// Photos land in images/<product>/<color>-N.jpg and images/manifest.json; commit and push them.
import fs from "node:fs";
import { PRODUCTS, TYPES, COLORS, optionPrice, sku } from "../catalog.js";
import { MAP, printFile, printSvg } from "./printfiles.mjs";

const arg = (f) => process.argv.includes(f);
const only = arg("--only") ? process.argv[process.argv.indexOf("--only") + 1] : null;
const { PRINTFUL_TOKEN, PRINTFUL_STORE_ID } = process.env;
const SITE_URL = (process.env.SITE_URL || "").replace(/\/$/, "");
if (!PRINTFUL_TOKEN || !SITE_URL) { console.error("Set PRINTFUL_TOKEN and SITE_URL."); process.exit(1); }

const root = new URL("../", import.meta.url).pathname;
const H = { authorization: `Bearer ${PRINTFUL_TOKEN}`, "content-type": "application/json", ...(PRINTFUL_STORE_ID ? { "X-PF-Store-Id": PRINTFUL_STORE_ID } : {}) };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function api(path, opt = {}, tries = 0) {
  const r = await fetch("https://api.printful.com" + path, { headers: H, ...opt });
  if (r.status === 429 && tries < 8) {
    const wait = (Number(r.headers.get("retry-after")) || 30) * 1000;
    console.log(`  rate limited, waiting ${wait / 1000}s`);
    await sleep(wait); return api(path, opt, tries + 1);
  }
  const j = await r.json().catch(() => ({}));
  if (!r.ok) { const e = new Error(`${opt.method || "GET"} ${path}: ${r.status} ${JSON.stringify(j.error || j.result)}`); e.status = r.status; throw e; }
  return j.result;
}
const cache = {};
const once = (k, f) => (cache[k] ??= f());
const catalogVariants = (id) => once("v" + id, () => api(`/products/${id}`).then((r) => r.variants));
const printfiles = (id) => once("p" + id, () => api(`/mockup-generator/printfiles/${id}`));
const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, "");

// Printful catalog product + variant for one store color/option.
async function resolve(p, color, opt) {
  const m = MAP[p.type];
  const productId = m.productIdByColor ? m.productIdByColor[color] : m.productId;
  const v = m.variants && (m.variants[`${color}|${opt}`] ?? m.variants[`*|${opt}`]);
  if (v) return { productId, variantId: v };
  if (!m.colorNames || !m.colorNames[color]) return null;
  const list = await catalogVariants(productId);
  const hit = list.find((x) => norm(x.color) === norm(m.colorNames[color]) && norm(x.size) === norm(opt));
  return hit ? { productId, variantId: hit.id } : null;
}

// Where the art sits in Printful's print area: fit inside, centered; apparel art sits at the top.
async function position(p, productId, variantId, placement, fileName) {
  const pf = await printfiles(productId);
  const vp = pf.variant_printfiles.find((x) => x.variant_id === variantId);
  const f = vp && pf.printfiles.find((x) => x.printfile_id === vp.placements[placement]);
  if (!f) return null;
  const { w, h } = printSvg(fileName);
  const k = Math.min(f.width / w, f.height / h), width = Math.round(w * k), height = Math.round(h * k);
  const top = MAP[p.type].art === "garment" ? 0 : Math.round((f.height - height) / 2);
  return { area_width: f.width, area_height: f.height, width, height, top, left: Math.round((f.width - width) / 2) };
}

const manifestPath = root + "images/manifest.json";
let manifest = {};
try { manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")); } catch {}
const saveManifest = () => { fs.mkdirSync(root + "images", { recursive: true }); fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1)); };

async function download(url, rel) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`download ${r.status} ${url}`);
  fs.mkdirSync(root + rel.replace(/\/[^/]+$/, ""), { recursive: true });
  fs.writeFileSync(root + rel, Buffer.from(await r.arrayBuffer()));
  return rel;
}

// Photos for one product color: Printful's mockup generator, front shot first, then up to 3 alternates.
async function photos(p, color, rows) {
  const first = rows[0];
  const files = [];
  for (const pl of MAP[p.type].placements) {
    const file = { placement: pl, image_url: `${SITE_URL}/print-files/${first.file}` };
    const pos = await position(p, first.productId, first.variantId, pl, first.file).catch(() => null);
    if (pos) file.position = pos;
    files.push(file);
  }
  const task = await api(`/mockup-generator/create-task/${first.productId}`, { method: "POST", body: JSON.stringify({ variant_ids: [first.variantId], format: "jpg", files }) });
  let res;
  for (let i = 0; i < 60; i++) {
    await sleep(4000);
    res = await api(`/mockup-generator/task?task_key=${encodeURIComponent(task.task_key)}`);
    if (res.status !== "pending") break;
  }
  if (!res || res.status !== "completed") throw new Error(`mockup task ${res ? res.status : "timed out"} ${res && res.error ? res.error : ""}`);
  const urls = [];
  for (const m of res.mockups) { urls.push(m.mockup_url); for (const x of m.extra || []) urls.push(x.url); }
  const keep = [...new Set(urls)].slice(0, 4);
  const saved = [];
  for (let i = 0; i < keep.length; i++) saved.push(await download(keep[i], `images/${p.id}/${color}-${i + 1}.jpg`));
  manifest[`${p.id}.${color}`] = saved;
  saveManifest();
  return saved.length;
}

let made = 0, problems = [];
for (const p of PRODUCTS) {
  if (p.supplier !== "printful" || (only && p.id !== only)) continue;
  const rows = [];
  for (const color of p.colors) for (const opt of TYPES[p.type].options) {
    if ((TYPES[p.type].pack || {})[opt]) continue; // packs are ordered as N singles
    const r = await resolve(p, color, opt);
    if (!r) { problems.push(`${p.id}: no Printful variant for ${COLORS[color].name} / ${opt}`); continue; }
    rows.push({ ...r, color, opt, file: printFile(p, color, opt) });
  }
  if (!rows.length) continue;
  if (arg("--dry-run")) { console.log(`ok   ${p.id}: ${rows.length} variants`); continue; }

  // One Printful product per catalog item (mugs come from two: white and black).
  const groups = {};
  for (const r of rows) (groups[r.productId] ??= []).push(r);
  const ids = Object.keys(groups);
  if (!arg("--photos-only")) for (const pid of ids) {
    const ext = ids.length === 1 ? p.id : `${p.id}--${pid}`;
    const exists = await api(`/store/products/@${ext}`).then(() => true, (e) => (e.status === 404 ? false : Promise.reject(e)));
    if (exists && !arg("--replace")) { console.log(`skip ${ext}: already in Printful (use --replace to rebuild)`); continue; }
    if (exists) await api(`/store/products/@${ext}`, { method: "DELETE" });
    const variants = [];
    for (const r of groups[pid]) {
      const files = [];
      for (const pl of MAP[p.type].placements) {
        const f = { type: pl, url: `${SITE_URL}/print-files/${r.file}` };
        const pos = await position(p, r.productId, r.variantId, pl, r.file).catch(() => null);
        if (pos) f.position = pos;
        files.push(f);
      }
      variants.push({ external_id: sku(p.id, r.color, r.opt), variant_id: r.variantId, retail_price: optionPrice(p, r.opt).toFixed(2), files });
    }
    const body = (withPos) => JSON.stringify({ sync_product: { name: p.name + (ids.length > 1 ? ` (${groups[pid][0].color})` : ""), external_id: ext },
      sync_variants: withPos ? variants : variants.map((v) => ({ ...v, files: v.files.map(({ position, ...f }) => f) })) });
    let res;
    try { res = await api("/store/products", { method: "POST", body: body(true) }); }
    catch (e) { if (!/position/i.test(e.message)) throw e; res = await api("/store/products", { method: "POST", body: body(false) }); }
    console.log(`made ${ext} → Printful product ${res.id} (${variants.length} variants)`);
    made++;
  }

  for (const color of p.colors) {
    const cr = rows.filter((r) => r.color === color);
    if (!cr.length) continue;
    try { console.log(`  photos ${p.id} ${color}: ${await photos(p, color, cr)}`); }
    catch (e) { problems.push(`${p.id} ${color} photos: ${e.message}`); }
  }
}
console.log(`\n${made} Printful products created.`);
if (problems.length) { console.log(`\nNeeds a look (${problems.length}):`); for (const x of problems) console.log("  " + x); }
