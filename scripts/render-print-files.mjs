// Re-renders print-files/ from the designs in catalog.js.
//   npm i @resvg/resvg-js
//   node scripts/render-print-files.mjs
import { Resvg } from "@resvg/resvg-js";
import fs from "node:fs";
import { PRODUCTS } from "../catalog.js";
import { allPrintFiles, printSvg } from "./printfiles.mjs";

const fonts = ["Gloock-Regular.ttf", "Caveat-Bold.ttf", "BricolageGrotesque-ExtraBold.ttf"].map((f) => new URL("./fonts/" + f, import.meta.url).pathname);
const out = new URL("../print-files/", import.meta.url).pathname;
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const names = allPrintFiles(PRODUCTS);
for (const n of names) {
  const { svg, w } = printSvg(n);
  const png = new Resvg(svg, { font: { fontFiles: fonts, loadSystemFonts: false, defaultFontFamily: "Gloock" }, fitTo: { mode: "width", value: w } }).render().asPng();
  fs.writeFileSync(out + n, png);
}
console.log(`${names.length} print files written to print-files/`);
