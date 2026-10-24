// Which print file each Printful product variant uses, and how each shape is drawn.
// Shared by render-print-files.mjs (makes the PNGs) and printful-sync.mjs (sends their URLs).
import fs from "node:fs";
import { COLORS, TYPES, designSvg } from "../catalog.js";

export const MAP = JSON.parse(fs.readFileSync(new URL("./printful-map.json", import.meta.url)));

const ink = (color) => (COLORS[color].dark ? "light" : "dark");
const red = ([w, h]) => { const g = (a, b) => (b ? g(b, a % b) : a); const k = g(w, h); return `${w / k}x${h / k}`; };

// File name (inside print-files/) for one product, color and option.
export function printFile(p, color, option) {
  const m = MAP[p.type];
  if (m.art === "mug") return `${p.design}-mug-${ink(color)}.png`;
  if (m.art === "fill") return `${p.design}-on-${color}-${red(m.ratio[option])}.png`;
  if (m.art === "stickers") return `${p.design}-stickers.png`;
  // Transparent art; "for-dark" means light ink for dark fabric.
  return `${p.design}-for-${COLORS[color].dark ? "dark" : "light"}.png`;
}

// SVG for a print file name produced by printFile().
export function printSvg(name) {
  let m;
  const art = (id, dark) => designSvg(id, dark);
  if ((m = name.match(/^(.+)-for-(light|dark)\.png$/))) {
    return { w: 4500, h: 4500, svg: wrap(1000, 1000, art(m[1], m[2] === "dark")) };
  }
  if ((m = name.match(/^(.+)-mug-(light|dark)\.png$/))) {
    // Full mug wrap, design on both sides of the handle.
    const W = 2700, H = 1050, s = 940, y = (H - s) / 2, d = art(m[1], m[2] === "light");
    const one = (cx) => `<svg x="${cx - s / 2}" y="${y}" width="${s}" height="${s}" viewBox="0 0 1000 1000">${d}</svg>`;
    return { w: W, h: H, svg: wrap(W, H, one(W * 0.25) + one(W * 0.75)) };
  }
  if ((m = name.match(/^(.+)-on-([a-z]+)-(\d+)x(\d+)\.png$/))) {
    const [, id, color, rw, rh] = m, c = COLORS[color];
    const scale = 3600 / Math.max(+rw, +rh), W = Math.round(+rw * scale), H = Math.round(+rh * scale);
    const s = Math.min(W, H) * 0.8;
    const inner = `<rect width="${W}" height="${H}" fill="${c.hex}"/><svg x="${(W - s) / 2}" y="${(H - s) / 2}" width="${s}" height="${s}" viewBox="0 0 1000 1000">${art(id, !!c.dark)}</svg>`;
    return { w: W, h: H, svg: wrap(W, H, inner) };
  }
  if ((m = name.match(/^(.+)-stickers\.png$/))) {
    // A5 sheet (5.83 × 8.27 in), four round stickers so each one cuts as a single piece.
    const W = 1749, H = 2481, d = art(m[1], false);
    const badge = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFFFFF" stroke="#E6E1D8" stroke-width="6"/>` +
      `<svg x="${cx - r * 0.82}" y="${cy - r * 0.82}" width="${r * 1.64}" height="${r * 1.64}" viewBox="0 0 1000 1000">${d}</svg>`;
    return { w: W, h: H, svg: wrap(W, H, badge(875, 700, 560) + badge(470, 1740, 380) + badge(1290, 1700, 330) + badge(1250, 2240, 180)) };
  }
  throw new Error("unknown print file " + name);
}
const wrap = (w, h, inner) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${inner}</svg>`;

// Every print file the Printful catalog needs.
export function allPrintFiles(products) {
  const set = new Set();
  for (const p of products) if (p.supplier === "printful")
    for (const c of p.colors) for (const o of TYPES[p.type].options)
      if (!(TYPES[p.type].pack || {})[o]) set.add(printFile(p, c, o));
  return [...set].sort();
}
