// Re-renders print-files/ from the designs in catalog.js.
// npm i @resvg/resvg-js, then: FONT_FILES=Gloock.ttf,Caveat-Bold.ttf,BricolageGrotesque-ExtraBold.ttf node scripts/render-print-files.mjs
import { Resvg } from "@resvg/resvg-js";
import fs from "node:fs";
const { DESIGNS, designSvg, PRODUCTS, COLORS } = await import("../catalog.js");
const map = JSON.parse(fs.readFileSync(new URL("./printful-map.json", import.meta.url)));
const fontFiles = (process.env.FONT_FILES || "fonts/Gloock.ttf,fonts/Caveat.ttf,fonts/Bricolage.ttf").split(",");
const out = new URL("../print-files", import.meta.url).pathname; fs.mkdirSync(out, { recursive: true });
const png = (svg, w) => new Resvg(svg, { font: { fontFiles, loadSystemFonts: false, defaultFontFamily: "Gloock" }, fitTo: { mode: "width", value: w } }).render().asPng();
const wrap = (inner, bg) => `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 1000 1000">${bg ? `<rect width="1000" height="1000" fill="${bg}"/><g transform="translate(80,80) scale(.84)">${inner}</g>` : inner}</svg>`;
let n = 0;
for (const id of Object.keys(DESIGNS)) for (const dark of [false, true]) { fs.writeFileSync(`${out}/${id}-${dark ? "for-dark" : "for-light"}.png`, png(wrap(designSvg(id, dark)), 4500)); n++; }
const done = new Set();
for (const p of PRODUCTS) if (!map[p.type].auto) for (const c of p.colors) {
  const k = `${p.design}-on-${c}`; if (done.has(k)) continue; done.add(k);
  fs.writeFileSync(`${out}/${k}.png`, png(wrap(designSvg(p.design, !!COLORS[c].dark), COLORS[c].hex), 3600)); n++;
}
console.log(n, "files");
