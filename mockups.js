// Product mockups: each product type drawn with the design placed on it.
import { COLORS, designSvg } from "./catalog.js";

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16), t = amt < 0 ? 0 : 255, p = Math.abs(amt);
  const ch = (v) => Math.round((t - v) * p + v);
  return "#" + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(ch).map((v) => v.toString(16).padStart(2, "0")).join("");
}

export function mockup(p, colorKey) {
  const c = COLORS[colorKey], dark = !!c.dark, f = c.hex, e = shade(f, dark ? 0.22 : -0.16), e2 = shade(f, dark ? 0.1 : -0.1);
  const d = designSvg(p.design, dark);
  const art = (x, y, w) => `<svg x="${x}" y="${y}" width="${w}" height="${w}" viewBox="0 0 1000 1000">${d}</svg>`;
  const shadow = (y = 362, rx = 120) => `<ellipse cx="200" cy="${y}" rx="${rx}" ry="10" fill="#000" opacity=".08"/>`;
  const teePath = "M140,58 L104,72 L52,112 L80,168 L112,152 L112,352 L288,352 L288,152 L320,168 L348,112 L296,72 L260,58 C250,80 228,92 200,92 C172,92 150,80 140,58Z";
  const sweatPath = "M140,58 L102,72 L66,108 L44,300 L84,306 L112,176 L112,340 L288,340 L288,176 L316,306 L356,300 L334,108 L298,72 L260,58 C250,78 228,88 200,88 C172,88 150,78 140,58Z";
  const collar = `<path d="M140,58 C150,80 172,92 200,92 C228,92 250,80 260,58" fill="none" stroke="${e}" stroke-width="6"/>`;
  let s;
  switch (p.type) {
    case "tee": s = shadow() + `<path d="${teePath}" fill="${f}" stroke="${e}" stroke-width="2"/>` + collar + art(140, 118, 120); break;
    case "kidstee": s = shadow(352, 100) + `<g transform="translate(40,44) scale(.8)"><path d="${teePath}" fill="${f}" stroke="${e}" stroke-width="2"/>${collar}${art(140, 118, 120)}</g>`; break;
    case "sweatshirt": s = shadow(356, 150) + `<path d="${sweatPath}" fill="${f}" stroke="${e}" stroke-width="2"/><rect x="112" y="326" width="176" height="20" rx="4" fill="${e2}"/>` + collar + art(142, 116, 116); break;
    case "hoodie": s = shadow(356, 150) + `<path d="M140,70 C130,12 270,12 260,70Z" fill="${e2}"/><path d="${sweatPath}" fill="${f}" stroke="${e}" stroke-width="2"/>` +
      `<path d="M154,62 C160,98 240,98 246,62 C232,40 168,40 154,62Z" fill="${shade(f, dark ? 0.3 : -0.28)}"/><path d="M186,92 L183,140 M214,92 L217,140" stroke="${e}" stroke-width="3"/>` +
      `<path d="M150,268 L250,268 L268,322 L132,322Z" fill="none" stroke="${e}" stroke-width="3"/><rect x="112" y="326" width="176" height="20" rx="4" fill="${e2}"/>` + art(150, 140, 100); break;
    case "mug": s = shadow(350, 100) + `<path d="M272,170 C338,170 338,290 272,290" fill="none" stroke="${e}" stroke-width="30"/><path d="M272,170 C338,170 338,290 272,290" fill="none" stroke="${f}" stroke-width="22"/>` +
      `<path d="M108,118 L272,118 L272,318 Q272,340 250,340 L130,340 Q108,340 108,318Z" fill="${f}" stroke="${e}" stroke-width="2"/><ellipse cx="190" cy="118" rx="82" ry="14" fill="${shade(f, dark ? 0.15 : -0.22)}"/>` +
      art(122, 160, 136) + `<rect x="114" y="134" width="8" height="190" rx="4" fill="#fff" opacity=".22"/>`; break;
    case "tote": s = shadow(364) + `<path d="M145,150 C145,60 185,60 185,150 M215,150 C215,60 255,60 255,150" fill="none" stroke="${e}" stroke-width="12"/>` +
      `<rect x="98" y="140" width="204" height="214" rx="3" fill="${f}" stroke="${e}" stroke-width="2"/>` + art(122, 168, 156); break;
    case "pillow": s = shadow(340, 130) + `<path d="M78,88 Q200,66 322,88 Q344,200 322,316 Q200,338 78,316 Q56,200 78,88Z" fill="${f}" stroke="${e}" stroke-width="2"/>` + art(106, 108, 188); break;
    case "blanket": s = shadow(356, 140) + `<rect x="66" y="66" width="268" height="240" rx="6" fill="${f}" stroke="${e}" stroke-width="2"/><path d="M66,300 L334,300 L322,346 L78,346Z" fill="${e2}" stroke="${e}" stroke-width="2"/>` + art(98, 80, 204); break;
    case "apron": s = shadow(364) + `<path d="M156,64 C156,18 244,18 244,64 M104,156 L58,204 M296,156 L342,204" fill="none" stroke="${e}" stroke-width="8" stroke-linecap="round"/>` +
      `<path d="M152,60 L248,60 L250,128 L300,154 L292,352 L108,352 L100,154 L150,128Z" fill="${f}" stroke="${e}" stroke-width="2"/>` + art(140, 152, 120); break;
    case "poster": s = shadow(364, 110) + `<rect x="92" y="40" width="216" height="316" rx="3" fill="#3A2E25"/><rect x="102" y="50" width="196" height="296" fill="${f}"/>` + art(110, 92, 180); break;
    case "cards": s = shadow(350, 130) + `<g transform="rotate(8 245 205)"><rect x="150" y="130" width="190" height="150" rx="3" fill="#CDB28A"/><path d="M150,130 L245,200 L340,130" fill="none" stroke="#B0946C" stroke-width="3"/></g>` +
      `<g transform="rotate(-4 171 198)"><rect x="86" y="78" width="170" height="240" rx="3" fill="${f}" stroke="${e}" stroke-width="2"/>${art(96, 112, 150)}</g>`; break;
    case "candle": s = shadow(346, 90) + `<rect x="128" y="86" width="144" height="28" rx="6" fill="#A57A4E"/><rect x="122" y="110" width="156" height="226" rx="22" fill="#EEEAE3" stroke="#D3CCC0" stroke-width="2"/>` +
      `<rect x="134" y="160" width="132" height="132" rx="4" fill="${f}"/>` + art(140, 166, 120); break;
    case "socks": {
      const sock = "M150,60 L226,60 L226,244 Q226,298 182,318 L112,334 Q74,338 70,304 Q68,276 104,262 L150,244Z";
      s = shadow(356, 130) + `<g transform="translate(66,24)"><path d="${sock}" fill="${shade(f, -0.07)}" stroke="${e}" stroke-width="2"/><rect x="150" y="60" width="76" height="22" fill="${e2}"/></g>` +
        `<path d="${sock}" fill="${f}" stroke="${e}" stroke-width="2"/><rect x="150" y="60" width="76" height="22" fill="${e2}"/>` + art(156, 96, 64); break; }
    case "puzzle": {
      let g = "";
      for (const v of [159, 241]) g += `<line x1="${v}" y1="76" x2="${v}" y2="324"/><line x1="76" y1="${v}" x2="324" y2="${v}"/>`;
      for (const v of [159, 241]) for (const m of [117, 200, 283]) g += `<circle cx="${v + 6}" cy="${m}" r="7"/><circle cx="${m}" cy="${v - 6}" r="7"/>`;
      s = shadow(344, 130) + `<rect x="76" y="76" width="248" height="248" rx="4" fill="${f}"/>` + art(86, 86, 228) + `<g stroke="#000" stroke-opacity=".16" stroke-width="2" fill="none">${g}</g>`; break; }
    case "stickers": s = shadow(356, 110) + `<rect x="90" y="56" width="220" height="290" rx="8" fill="#FFFFFF" stroke="#DAD6CE" stroke-width="2"/>` +
      [[148, 124, 50], [254, 134, 40], [156, 236, 40], [250, 250, 52]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#BFB9AE" stroke-width="1.5" stroke-dasharray="4 3"/>` + art(x - r * 0.82, y - r * 0.82, r * 1.64)).join(""); break;
    case "beanie": {
      let rib = "";
      for (let x = 112; x < 300; x += 12) rib += `<line x1="${x}" y1="232" x2="${x}" y2="306"/>`;
      s = shadow(330, 110) + `<path d="M108,236 C108,92 292,92 292,236Z" fill="${f}" stroke="${e}" stroke-width="2"/><rect x="96" y="226" width="208" height="86" rx="14" fill="${e2}"/>` +
        `<g stroke="${e}" stroke-opacity=".5" stroke-width="2">${rib}</g><rect x="164" y="232" width="72" height="72" rx="10" fill="${f}"/>` + art(166, 234, 68); break; }
  }
  return `<svg viewBox="0 0 400 400" role="img" aria-label="${esc(p.name)} in ${esc(c.name)}">${s}</svg>`;
}
