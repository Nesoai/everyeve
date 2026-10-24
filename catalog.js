// EveryEve — catalog shared by the storefront (index.html) and the server
// functions (functions/api/*.js). Prices here are the prices charged: the
// checkout function reads them from this file, never from the browser.
//
// To change a price, a product, or the shipping rates, edit this file and push.

import { CJ_PRODUCTS } from "./cj-products.js";

export const CONFIG = {
  storeName: "EveryEve",
  operator: "NESO HQ LLC",
  currency: "usd",
  shipping: {
    standard: { label: "Standard", cents: 595, freeOverCents: 7500, transit: [3, 7] },
    express: { label: "Express", cents: 1995, transit: [1, 3] },
  },
  maxQtyPerLine: 10,
  maxLines: 25,
  // Shown in the footer when set. Leave empty to hide.
  supportEmail: "",
};

// Days the print partner and carriers don't work. Used for arrival estimates.
export const NON_WORKING = ["2026-11-11", "2026-11-26", "2026-12-25", "2027-01-01"];

// ---------------------------------------------------------------- occasions
export const OCCASIONS = [
  { id: "halloween", name: "Halloween", date: "2026-10-31", color: "#D9621A",
    note: "Orders placed now are cutting it close. Most arrive just after Oct 31, so these are made to wear all fall." },
  { id: "diwali", name: "Diwali", date: "2026-11-08", color: "#B0306A",
    note: "The festival of lights. Order this week for the best chance of arriving by Nov 8." },
  { id: "thanksgiving", name: "Thanksgiving", date: "2026-11-26", color: "#A4471D",
    note: "For the table, the kitchen and the long weekend after." },
  { id: "hanukkah", name: "Hanukkah", date: "2026-12-04", end: "2026-12-12", color: "#2F5DA8",
    note: "Eight nights, beginning at sundown on Friday, Dec 4." },
  { id: "winter", name: "Winter", date: "2026-12-21", end: "2027-03-20", color: "#3F6E95", season: true,
    note: "Cold-weather comforts that work long after the holidays are packed away." },
  { id: "christmas", name: "Christmas", date: "2026-12-25", color: "#1F6B4A",
    note: "Sweatshirts, mugs and home pieces for the season." },
  { id: "kwanzaa", name: "Kwanzaa", date: "2026-12-26", end: "2027-01-01", color: "#B8262F",
    note: "Seven days, seven principles, Dec 26 to Jan 1." },
  { id: "newyear", name: "New Year’s Eve", date: "2026-12-31", color: "#9A7414",
    note: "For the countdown and the first morning of 2027." },
];

// ---------------------------------------------------------------- colors
export const COLORS = {
  std: { name: "Standard", hex: "#F3F3F3" },
  white: { name: "White", hex: "#F7F6F2" },
  natural: { name: "Natural", hex: "#ECE3D0" },
  heather: { name: "Heather Grey", hex: "#C6C7C4" },
  sand: { name: "Sand", hex: "#D9C7A5" },
  ice: { name: "Ice Blue", hex: "#D7E5F0" },
  blush: { name: "Blush", hex: "#F0D6D2" },
  forest: { name: "Forest", hex: "#2F4A3A", dark: true },
  navy: { name: "Navy", hex: "#1F2B45", dark: true },
  black: { name: "Black", hex: "#1C1B1A", dark: true },
  maroon: { name: "Maroon", hex: "#5E1F28", dark: true },
  rust: { name: "Rust", hex: "#94461F", dark: true },
  plum: { name: "Plum", hex: "#4A2440", dark: true },
};

// ---------------------------------------------------------------- product types
// prod = production business days [min, max]. up = upcharge in dollars by option.
// pack = an option that is fulfilled as N of another option.
export const TYPES = {
  tee: { label: "Unisex tee", options: ["S", "M", "L", "XL", "2XL", "3XL"], up: { "2XL": 2, "3XL": 4 }, prod: [2, 5],
    spec: "Soft ring-spun cotton, relaxed unisex fit. Printed direct-to-garment." },
  kidstee: { label: "Kids tee", options: ["S", "M", "L", "XL"], optionLabel: "Youth size", prod: [2, 5],
    spec: "Youth sizes in soft cotton. Printed direct-to-garment." },
  sweatshirt: { label: "Crewneck sweatshirt", options: ["S", "M", "L", "XL", "2XL", "3XL"], up: { "2XL": 3, "3XL": 5 }, prod: [2, 5],
    spec: "Cotton-blend fleece with ribbed collar, cuffs and hem." },
  hoodie: { label: "Hoodie", options: ["S", "M", "L", "XL", "2XL", "3XL"], up: { "2XL": 3, "3XL": 5 }, prod: [2, 5],
    spec: "Midweight fleece, drawstring hood, front pouch pocket." },
  mug: { label: "Ceramic mug", options: ["11 oz", "15 oz"], up: { "15 oz": 3 }, prod: [2, 5],
    spec: "Glossy ceramic. Dishwasher and microwave safe." },
  tote: { label: "Tote bag", options: ["One size"], prod: [2, 5],
    spec: "Sturdy cotton canvas with long shoulder handles." },
  pillow: { label: "Throw pillow", options: ["18 × 18 in", "22 × 22 in"], up: { "22 × 22 in": 6 }, prod: [2, 5],
    spec: "Printed cover with insert and a hidden zipper." },
  blanket: { label: "Throw blanket", options: ["50 × 60 in", "60 × 80 in"], up: { "60 × 80 in": 20 }, prod: [3, 6],
    spec: "Plush fleece, printed on one side." },
  apron: { label: "Apron", options: ["One size"], prod: [2, 5],
    spec: "Adjustable neck strap and long waist ties." },
  poster: { label: "Poster", options: ["12 × 18 in", "18 × 24 in"], up: { "18 × 24 in": 8 }, prod: [2, 5],
    spec: "Matte archival paper. Frame not included." },
  cards: { label: "Greeting cards", options: ["Single card", "Pack of 10"], up: { "Pack of 10": 39 }, pack: { "Pack of 10": ["Single card", 10] }, prod: [2, 5],
    spec: "Folded card, blank inside, envelope included." },
  candle: { label: "Soy candle", options: ["Christmas Warmth", "Cinnamon Vanilla", "Apple Harvest", "Unscented"], optionLabel: "Scent", prod: [3, 5],
    spec: "9 oz scented soy wax candle in a glass jar." },
  socks: { label: "Socks", options: ["S", "M", "L"], prod: [2, 5],
    spec: "Cushioned crew socks with the design printed around the leg." },
  puzzle: { label: "Jigsaw puzzle", options: ["520 pieces"], prod: [3, 6],
    spec: "Glossy 520-piece puzzle, boxed." },
  stickers: { label: "Sticker sheet", options: ["One sheet"], prod: [2, 4],
    spec: "Kiss-cut vinyl stickers, water resistant." },
  // Ready-made items stocked in CJdropshipping's US warehouses (see cj-products.js).
  cj: { label: "Home & decor", options: ["Standard"], prod: [1, 3], spec: "" },
  beanie: { label: "Embroidered beanie", options: ["One size"], prod: [3, 6],
    spec: "Cuffed knit beanie with an embroidered patch design." },
};

// ---------------------------------------------------------------- designs
// Each design is an original drawing on a 1000 × 1000 canvas.
// c.ink is the text/outline color chosen for the background it sits on;
// c.dark is true on dark backgrounds.
const SERIF = "Gloock, Georgia, 'Times New Roman', serif";
const HAND = "Caveat, 'Segoe Print', 'Comic Sans MS', cursive";
const SANS = "'Bricolage Grotesque', 'Arial Black', Arial, sans-serif";
const T = (x, y, size, txt, font, fill, extra = "") =>
  `<text x="${x}" y="${y}" font-size="${size}" font-family="${font}" fill="${fill}" text-anchor="middle"${font === SANS ? ' font-weight="800"' : font === HAND ? ' font-weight="700"' : ""} ${extra}>${txt}</text>`;
const flame = (x, y, s) =>
  `<path d="M${x},${y - s * 1.6} C${x + s * 0.9},${y - s * 0.5} ${x + s * 0.7},${y + s * 0.6} ${x},${y + s * 0.6} C${x - s * 0.7},${y + s * 0.6} ${x - s * 0.9},${y - s * 0.5} ${x},${y - s * 1.6}Z" fill="#F4A63B"/>` +
  `<path d="M${x},${y - s * 0.9} C${x + s * 0.45},${y - s * 0.2} ${x + s * 0.35},${y + s * 0.45} ${x},${y + s * 0.45} C${x - s * 0.35},${y + s * 0.45} ${x - s * 0.45},${y - s * 0.2} ${x},${y - s * 0.9}Z" fill="#FFE39A"/>`;
const diya = (cx, cy, s) => {
  const p = (x, y) => `${cx + x * s},${cy + y * s}`;
  let d = `<path d="M${p(-220, 0)} C${p(-200, 140)} ${p(-80, 180)} ${p(0, 180)} C${p(80, 180)} ${p(200, 140)} ${p(220, 0)} Z" fill="#C8641E"/>`;
  d += `<ellipse cx="${cx}" cy="${cy}" rx="${220 * s}" ry="${40 * s}" fill="#8E4012"/>`;
  for (let i = -3; i <= 3; i++) d += `<circle cx="${cx + i * 40 * s}" cy="${cy + 80 * s}" r="${9 * s}" fill="#F2B632"/>`;
  d += `<path d="M${p(-150, 120)} Q${p(0, 150)} ${p(150, 120)}" stroke="#F2B632" stroke-width="${6 * s}" fill="none"/>`;
  return d + flame(cx + 20 * s, cy - 40 * s, 70 * s);
};
const leaf = (x, y, rot, len, color) =>
  `<path transform="translate(${x},${y}) rotate(${rot})" d="M0,0 C${len * 0.3},${-len * 0.28} ${len * 0.7},${-len * 0.28} ${len},0 C${len * 0.7},${len * 0.28} ${len * 0.3},${len * 0.28} 0,0Z" fill="${color}"/>`;
const ghost = (cx, top, w, h, ink, mouth) => {
  const r = w / 2, b = top + h;
  return `<path d="M${cx - r},${b} L${cx - r},${top + r} A${r},${r} 0 0 1 ${cx + r},${top + r} L${cx + r},${b} Q${cx + w / 3},${b - 40} ${cx + w / 6},${b} Q${cx},${b - 40} ${cx - w / 6},${b} Q${cx - w / 3},${b - 40} ${cx - r},${b}Z" fill="#FBFAF5" stroke="${ink}" stroke-width="12" stroke-linejoin="round"/>` +
    `<ellipse cx="${cx - w * 0.16}" cy="${top + w * 0.48}" rx="${w * 0.06}" ry="${w * 0.09}" fill="#231C17"/>` +
    `<ellipse cx="${cx + w * 0.16}" cy="${top + w * 0.48}" rx="${w * 0.06}" ry="${w * 0.09}" fill="#231C17"/>` +
    (mouth ? `<ellipse cx="${cx}" cy="${top + w * 0.72}" rx="${w * 0.06}" ry="${w * 0.08}" fill="#231C17"/>` : "");
};
const star = (cx, cy, r, fill) => {
  let pts = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r;
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`);
  }
  return `<polygon points="${pts.join(" ")}" fill="${fill}"/>`;
};
const flute = (x, y, rot, ink) =>
  `<g transform="translate(${x},${y}) rotate(${rot})">` +
  `<path d="M-46,-280 L46,-280 L38,-120 Q0,-85 -38,-120Z" fill="#E9C46A"/>` +
  `<path d="M-50,-330 L50,-330 L38,-120 Q0,-85 -38,-120Z" fill="none" stroke="${ink}" stroke-width="12" stroke-linejoin="round"/>` +
  `<line x1="0" y1="-95" x2="0" y2="0" stroke="${ink}" stroke-width="12"/>` +
  `<ellipse cx="0" cy="0" rx="62" ry="13" fill="${ink}"/></g>`;

export const DESIGNS = {
  spooky: { name: "Spooky Season", draw: (c) => {
    const o = "#B4500F";
    return T(500, 200, 170, "Spooky", HAND, c.ink) +
      `<path d="M480,330 C470,290 490,260 525,250 L535,275 C512,285 505,305 512,330Z" fill="#4E5B2A"/>` +
      `<ellipse cx="395" cy="530" rx="170" ry="200" fill="#E8701E" stroke="${o}" stroke-width="8"/>` +
      `<ellipse cx="605" cy="530" rx="170" ry="200" fill="#E8701E" stroke="${o}" stroke-width="8"/>` +
      `<ellipse cx="500" cy="530" rx="175" ry="215" fill="#F0832B" stroke="${o}" stroke-width="8"/>` +
      `<polygon points="395,500 465,500 430,440" fill="#2A1405"/><polygon points="535,500 605,500 570,440" fill="#2A1405"/>` +
      `<polygon points="485,560 515,560 500,530" fill="#2A1405"/>` +
      `<polygon points="385,600 425,600 440,625 460,600 540,600 560,625 575,600 615,600 595,660 560,685 440,685 405,660" fill="#2A1405"/>` +
      T(500, 905, 110, "SEASON", SANS, c.ink, 'letter-spacing="28"');
  } },
  boo: { name: "Boo Crew", draw: (c) =>
    ghost(270, 330, 190, 300, c.ink) + ghost(730, 330, 190, 300, c.ink) + ghost(500, 200, 240, 400, c.ink, true) +
    T(500, 870, 130, "BOO CREW", SANS, c.ink, 'letter-spacing="10"') },
  diwali: { name: "Happy Diwali", draw: (c) => {
    const cols = ["#E2483D", "#F2B632", "#2E9C8F", "#8E3FA3"];
    let dots = "";
    for (let i = 0; i <= 14; i++) {
      const a = ((200 + i * 10) * Math.PI) / 180;
      dots += `<circle cx="${(500 + 285 * Math.cos(a)).toFixed(1)}" cy="${(565 + 285 * Math.sin(a)).toFixed(1)}" r="${i % 2 ? 11 : 17}" fill="${cols[i % 4]}"/>`;
    }
    return T(500, 205, 130, "Happy", HAND, c.ink) + dots + diya(500, 565, 1) + T(500, 900, 150, "DIWALI", SERIF, c.ink, 'letter-spacing="10"');
  } },
  lights: { name: "Festival of Lights", draw: (c) =>
    T(500, 240, 150, "Festival", SERIF, c.ink) +
    [[160, 520], [330, 490], [500, 475], [670, 490], [840, 520]].map(([x, y]) => diya(x, y, 0.36)).join("") +
    T(500, 790, 160, "of Lights", HAND, c.ink) },
  grateful: { name: "Grateful", draw: (c) => {
    const cols = ["#B5451B", "#D98A2B", "#7A6A2C", "#C9682A", "#8C2F1B"];
    let s = "";
    for (let i = 0; i < 24; i++) {
      const a = (i * 15 * Math.PI) / 180;
      s += leaf((500 + 330 * Math.cos(a)).toFixed(1), (500 + 330 * Math.sin(a)).toFixed(1), i * 15 + 90 + (i % 2 ? 30 : -30), 110, cols[i % 5]);
    }
    for (let i = 0; i < 12; i++) {
      const a = ((i * 30 + 7) * Math.PI) / 180;
      s += `<circle cx="${(500 + 310 * Math.cos(a)).toFixed(1)}" cy="${(500 + 310 * Math.sin(a)).toFixed(1)}" r="11" fill="#8C2F1B"/>`;
    }
    return s + T(500, 530, 170, "Grateful", HAND, c.ink) + T(500, 610, 38, "GIVE THANKS", SANS, c.ink, 'letter-spacing="14"');
  } },
  pie: { name: "Pass the Pie", draw: (c) => {
    let sc = "";
    for (let i = 0; i <= 8; i++) {
      const t = i / 8, x = (1 - t) * (1 - t) * 300 + 2 * (1 - t) * t * 500 + t * t * 700, y = (1 - t) * (1 - t) * 380 + 2 * (1 - t) * t * 300 + t * t * 380;
      sc += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="26" fill="#C88A4A"/>`;
    }
    return T(500, 210, 78, "PASS THE", SANS, c.ink, 'letter-spacing="18"') +
      `<path d="M500,660 L300,380 Q500,300 700,380Z" fill="#D9822E"/>` +
      `<path d="M300,380 Q500,300 700,380" stroke="#B9783C" stroke-width="44" fill="none" stroke-linecap="round"/>` + sc +
      `<g fill="#FFF8EC" stroke="#E2D2B4" stroke-width="5"><circle cx="465" cy="455" r="42"/><circle cx="535" cy="455" r="42"/><circle cx="500" cy="420" r="46"/></g>` +
      T(500, 905, 250, "Pie", SERIF, c.ink);
  } },
  gather: { name: "Gather", draw: (c) => {
    const stalk = (x1, y1, x2, y2) => {
      let s = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#B88A3A" stroke-width="10" stroke-linecap="round"/>`;
      const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
      for (let k = 0; k < 7; k++) {
        const t = 0.45 + k * 0.08, x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t;
        s += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="34" ry="15" transform="rotate(${(ang + (k % 2 ? 38 : -38)).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="#D3A04A"/>`;
      }
      return s;
    };
    return T(500, 190, 100, "come &amp;", HAND, c.ink) + stalk(330, 720, 610, 260) + stalk(670, 720, 390, 260) +
      `<path d="M440,620 Q500,660 560,620" stroke="#8C2F1B" stroke-width="18" fill="none" stroke-linecap="round"/>` +
      T(500, 890, 210, "Gather", SERIF, c.ink);
  } },
  menorah: { name: "Happy Hanukkah", draw: (c) => {
    let s = "", g = "#C9A24A";
    for (const r of [60, 120, 180, 240]) s += `<path d="M${500 - r},450 A${r},${r} 0 0 0 ${500 + r},450" fill="none" stroke="${g}" stroke-width="16"/>`;
    s += `<line x1="500" y1="400" x2="500" y2="720" stroke="${g}" stroke-width="18"/><rect x="400" y="715" width="200" height="34" rx="12" fill="${g}"/>`;
    for (let k = -4; k <= 4; k++) {
      const x = 500 + k * 60, top = k === 0 ? 300 : 360, bottom = k === 0 ? 400 : 450;
      s += `<rect x="${x - 13}" y="${top}" width="26" height="${bottom - top}" rx="4" fill="#6B9BE0"/>` + flame(x, top - 30, 20);
    }
    return s + T(500, 880, 104, "Happy Hanukkah", SERIF, c.ink);
  } },
  latke: { name: "Latke Season", draw: (c) => {
    let s = "";
    for (const y of [650, 605, 560, 515]) {
      s += `<ellipse cx="500" cy="${y}" rx="230" ry="58" fill="#D9A441" stroke="#9C6A1E" stroke-width="8"/>`;
      for (let i = 0; i < 6; i++) s += `<circle cx="${380 + i * 48}" cy="${y - 8 + (i % 2) * 14}" r="6" fill="#9C6A1E"/>`;
    }
    s += `<ellipse cx="470" cy="488" rx="96" ry="34" fill="#F1D49A"/><ellipse cx="560" cy="478" rx="62" ry="26" fill="#FBF6EC" stroke="#E6DBC6" stroke-width="5"/>`;
    return T(500, 300, 170, "LATKE", SANS, c.ink, 'letter-spacing="10"') + s + T(500, 860, 150, "season", HAND, c.ink);
  } },
  tree: { name: "Merry & Bright", draw: (c) => {
    let s = `<rect x="470" y="735" width="60" height="55" fill="#6B4426"/>`;
    s += `<polygon points="500,235 335,470 665,470" fill="#1F6B4A"/><polygon points="500,330 290,600 710,600" fill="#1F6B4A"/><polygon points="500,440 250,745 750,745" fill="#1F6B4A"/>`;
    const lights = [[420, 430], [500, 400], [580, 430], [380, 560], [460, 540], [540, 540], [620, 560], [330, 700], [420, 680], [510, 670], [600, 680], [690, 700]];
    const lc = ["#D9363E", "#F2C14E", "#FBFAF5"];
    lights.forEach(([x, y], i) => (s += `<circle cx="${x}" cy="${y}" r="15" fill="${lc[i % 3]}"/>`));
    return s + star(500, 220, 58, "#F2C14E") + T(500, 900, 130, "Merry &amp; Bright", HAND, c.ink);
  } },
  holly: { name: "Deck the Halls", draw: (c) => {
    const pts = ["0,0"];
    for (const t of [0.2, 0.4, 0.6, 0.8]) pts.push(`${300 * t - 30},-38`, `${300 * t},-64`);
    pts.push("300,0");
    for (const t of [0.8, 0.6, 0.4, 0.2]) pts.push(`${300 * t},64`, `${300 * t - 30},38`);
    const lf = (rot) => `<g transform="translate(500,500) rotate(${rot})"><polygon points="${pts.join(" ")}" fill="#2F7A4E"/><line x1="10" y1="0" x2="285" y2="0" stroke="#1E5535" stroke-width="7"/></g>`;
    return T(500, 230, 90, "fa la la la la", HAND, c.ink) + lf(205) + lf(-25) + lf(80) +
      `<circle cx="500" cy="478" r="34" fill="#C8323C"/><circle cx="462" cy="520" r="34" fill="#C8323C"/><circle cx="540" cy="522" r="34" fill="#C8323C"/>` +
      `<circle cx="490" cy="466" r="9" fill="#F4B7B9"/><circle cx="452" cy="508" r="9" fill="#F4B7B9"/><circle cx="530" cy="510" r="9" fill="#F4B7B9"/>` +
      T(500, 890, 112, "Deck the Halls", SERIF, c.ink);
  } },
  kinara: { name: "Happy Kwanzaa", draw: (c) => {
    let s = `<polygon points="420,650 580,650 625,745 375,745" fill="#6B4426"/><rect x="225" y="600" width="550" height="52" rx="12" fill="#7C5230"/>`;
    const col = ["#B8262F", "#B8262F", "#B8262F", "#1B1B1B", "#1E7A3E", "#1E7A3E", "#1E7A3E"];
    for (let i = 0; i < 7; i++) {
      const x = 260 + i * 80, top = i === 3 ? 380 : 420;
      s += `<rect x="${x - 20}" y="${top}" width="40" height="${600 - top}" rx="5" fill="${col[i]}"${i === 3 && c.dark ? ' stroke="#F6F1E7" stroke-width="4"' : ""}/>` + flame(x, top - 34, 22);
    }
    return T(500, 215, 96, "Habari Gani?", HAND, c.ink) + s + T(500, 880, 110, "Happy Kwanzaa", SERIF, c.ink);
  } },
  nguzo: { name: "Seven Principles", draw: (c) => {
    const rows = [["Umoja", "Unity"], ["Kujichagulia", "Self-Determination"], ["Ujima", "Collective Work"], ["Ujamaa", "Cooperative Economics"], ["Nia", "Purpose"], ["Kuumba", "Creativity"], ["Imani", "Faith"]];
    const dc = ["#B8262F", "#1B1B1B", "#1E7A3E"];
    let s = T(500, 185, 116, "Nguzo Saba", SERIF, c.ink) + T(500, 245, 34, "THE SEVEN PRINCIPLES", SANS, c.ink, 'letter-spacing="10"');
    rows.forEach(([sw, en], i) => {
      const y = 345 + i * 84;
      s += `<circle cx="150" cy="${y - 16}" r="17" fill="${dc[i % 3]}"${i % 3 === 1 && c.dark ? ' stroke="#F6F1E7" stroke-width="4"' : ""}/>`;
      s += `<text x="190" y="${y}" font-size="52" font-family="${SERIF}" fill="${c.ink}">${sw}</text>`;
      s += `<text x="870" y="${y}" font-size="46" font-weight="700" font-family="${HAND}" fill="${c.ink}" text-anchor="end">${en}</text>`;
    });
    return s;
  } },
  cheers: { name: "Cheers to 2027", draw: (c) => {
    let s = "";
    [[500, 300, 16], [455, 250, 11], [540, 230, 9], [500, 180, 7], [610, 300, 8], [395, 300, 8]].forEach(([x, y, r]) => (s += `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#E9C46A" stroke-width="5"/>`));
    return T(500, 160, 150, "Cheers", HAND, c.ink) + s + flute(415, 720, -16, c.ink) + flute(585, 720, 16, c.ink) +
      star(330, 330, 26, "#E9C46A") + star(680, 360, 20, "#E9C46A") + T(500, 890, 110, "TO 2027", SANS, c.ink, 'letter-spacing="16"');
  } },
  countdown: { name: "Countdown Crew", draw: (c) => {
    const cols = ["#E9C46A", "#E76F51", "#2A9D8F", "#F08FB0"];
    let s = "";
    for (let i = 0; i < 24; i++) {
      const a = (i * 15 * Math.PI) / 180, r1 = i % 2 ? 90 : 60, r2 = i % 2 ? 190 : 225;
      s += `<line x1="${(500 + r1 * Math.cos(a)).toFixed(1)}" y1="${(370 + r1 * Math.sin(a)).toFixed(1)}" x2="${(500 + r2 * Math.cos(a)).toFixed(1)}" y2="${(370 + r2 * Math.sin(a)).toFixed(1)}" stroke="${cols[i % 4]}" stroke-width="12" stroke-linecap="round"/>`;
      s += `<circle cx="${(500 + (r2 + 30) * Math.cos(a)).toFixed(1)}" cy="${(370 + (r2 + 30) * Math.sin(a)).toFixed(1)}" r="8" fill="${cols[(i + 1) % 4]}"/>`;
    }
    return s + T(500, 800, 230, "2027", SERIF, c.ink) + T(500, 905, 56, "COUNTDOWN CREW", SANS, c.ink, 'letter-spacing="12"');
  } },
  snowflake: { name: "Snow Day", draw: (c) => {
    const st = c.dark ? "#A9CDEA" : "#4F86B5";
    let arm = `<line x1="0" y1="0" x2="270" y2="0"/>`;
    for (const [k, b] of [[110, 70], [190, 55]]) arm += `<line x1="${k}" y1="0" x2="${k + b}" y2="${-b}"/><line x1="${k}" y1="0" x2="${k + b}" y2="${b}"/>`;
    let s = `<g transform="translate(500,430)" stroke="${st}" stroke-width="22" stroke-linecap="round" fill="none">`;
    for (let i = 0; i < 6; i++) s += `<g transform="rotate(${i * 60})">${arm}</g>`;
    return s + `<circle r="34" fill="${st}"/></g>` + T(500, 890, 160, "Snow Day", HAND, c.ink);
  } },
  cocoa: { name: "Hot Cocoa Club", draw: (c) => {
    const steam = (x) => `<path d="M${x},400 C${x - 30},360 ${x + 30},330 ${x},290 C${x - 30},250 ${x + 30},220 ${x},180" stroke="${c.ink}" stroke-opacity=".55" stroke-width="12" fill="none" stroke-linecap="round"/>`;
    return steam(420) + steam(500) + steam(580) +
      `<path d="M630,500 C735,500 735,650 630,650" stroke="#B5523B" stroke-width="36" fill="none"/>` +
      `<rect x="330" y="430" width="300" height="270" rx="34" fill="#B5523B"/>` +
      `<ellipse cx="480" cy="432" rx="150" ry="30" fill="#5A3220"/>` +
      `<g fill="#FFFDF6" stroke="#E5DCCB" stroke-width="4"><rect x="410" y="400" width="54" height="40" rx="10" transform="rotate(-12 437 420)"/><rect x="480" y="395" width="54" height="40" rx="10" transform="rotate(10 507 415)"/><rect x="530" y="410" width="48" height="36" rx="10" transform="rotate(-6 554 428)"/></g>` +
      `<path d="M380,600 L580,600" stroke="#F2E2D6" stroke-width="8" stroke-dasharray="2 22" stroke-linecap="round"/>` +
      T(500, 830, 104, "HOT COCOA", SANS, c.ink, 'letter-spacing="8"') + T(500, 935, 110, "club", HAND, c.ink);
  } },
};

export function designSvg(designId, dark) {
  const ink = dark ? "#F6F1E7" : "#231C17";
  return DESIGNS[designId].draw({ ink, dark: !!dark });
}

// ---------------------------------------------------------------- products
const P = (id, occasion, design, type, price, colors, name, blurb, extra = {}) =>
  ({ id, occasion, design, type, price, colors, name, blurb, ...extra });



const PRINTED = [
  // Halloween
  P("spooky-tee", "halloween", "spooky", "tee", 28, ["black", "natural", "rust"], "Spooky Season Tee", "A grinning jack-o’-lantern in hand lettering. Made to order, so it lands for the tail end of October and every cold evening after."),
  P("spooky-mug", "halloween", "spooky", "mug", 18, ["black", "white"], "Spooky Season Mug", "For cider, coffee, or the candy you said you were saving for trick-or-treaters."),
  P("boo-crew-tote", "halloween", "boo", "tote", 24, ["natural"], "Boo Crew Tote", "Three friendly ghosts on heavy canvas. Big enough for a haul of candy or a week of groceries."),
  // Diwali
  P("diwali-mug", "diwali", "diwali", "mug", 18, ["white", "black"], "Happy Diwali Mug", "A lit diya ringed with rangoli dots. A small gift for chai on the five days of the festival."),
  P("lights-cards", "diwali", "lights", "cards", 6, ["natural", "plum"], "Festival of Lights Cards", "Five diyas in a row. Blank inside for your own wishes; a pack of ten covers the whole family list."),
  P("lights-pillow", "diwali", "lights", "pillow", 36, ["plum", "natural"], "Festival of Lights Pillow", "Brings the glow of the diya row to the sofa for the season and beyond."),
  P("diwali-candle", "diwali", "diwali", "candle", 32, ["natural"], "Happy Diwali Candle", "A soy candle with the diya label. A modern stand-in for the hostess gift."),
  // Thanksgiving
  P("grateful-tee", "thanksgiving", "grateful", "tee", 28, ["natural", "rust", "forest"], "Grateful Tee", "An autumn leaf wreath around one word. Easy to wear from the parade to the second helping."),
  P("grateful-crew", "thanksgiving", "grateful", "sweatshirt", 44, ["sand", "maroon", "forest"], "Grateful Crewneck", "Warm fleece for a long Thursday and the cold football games that follow."),
  P("pie-apron", "thanksgiving", "pie", "apron", 34, ["natural", "black"], "Pass the Pie Apron", "For whoever is in charge of dessert. Adjustable strap fits most cooks."),
  P("gather-poster", "thanksgiving", "gather", "poster", 24, ["natural", "forest"], "Gather Poster", "Crossed wheat and a single word for the dining room wall or the front hall."),
  P("grateful-mug", "thanksgiving", "grateful", "mug", 18, ["white", "black"], "Grateful Mug", "The morning-after coffee mug, while the leftovers are still being divided."),
  P("gather-tote", "thanksgiving", "gather", "tote", 24, ["natural"], "Gather Tote", "Carries pies to the host and leftovers home again."),
  // Hanukkah
  P("hanukkah-mug", "hanukkah", "menorah", "mug", 18, ["white", "black"], "Happy Hanukkah Mug", "A nine-branch menorah with the shamash raised above the eight. Hot cocoa for all eight nights."),
  P("hanukkah-crew", "hanukkah", "menorah", "sweatshirt", 44, ["navy", "heather", "white"], "Happy Hanukkah Crewneck", "Gold menorah, blue candles, soft fleece. A gift for the first night."),
  P("latke-apron", "hanukkah", "latke", "apron", 34, ["natural", "navy"], "Latke Season Apron", "For whoever is standing over the frying pan. Applesauce and sour cream both represented."),
  P("hanukkah-cards", "hanukkah", "menorah", "cards", 6, ["white", "navy"], "Happy Hanukkah Cards", "Blank inside with envelopes. Pick the pack of ten for the whole list."),
  P("hanukkah-blanket", "hanukkah", "menorah", "blanket", 64, ["navy", "white"], "Happy Hanukkah Blanket", "Plush fleece throw for the couch after candle lighting."),
  P("latke-tee", "hanukkah", "latke", "tee", 28, ["heather", "navy", "white"], "Latke Season Tee", "A tall stack of latkes for the person who makes them every year."),
  // Christmas
  P("merry-crew", "christmas", "tree", "sweatshirt", 44, ["forest", "maroon", "heather"], "Merry & Bright Crewneck", "A strung-up tree and a gold star. Christmas morning in a sweatshirt."),
  P("merry-mug", "christmas", "tree", "mug", 18, ["white", "black"], "Merry & Bright Mug", "A stocking-sized gift that gets used every day until spring."),
  P("holly-pillow", "christmas", "holly", "pillow", 36, ["natural", "maroon"], "Deck the Halls Pillow", "Holly leaves and berries for the armchair by the tree."),
  P("holly-candle", "christmas", "holly", "candle", 32, ["natural"], "Deck the Halls Candle", "Soy candle with the holly label. An easy gift for teachers, neighbors and hosts."),
  P("merry-cards", "christmas", "tree", "cards", 6, ["natural", "forest"], "Merry & Bright Cards", "Blank inside with envelopes. The pack of ten handles the card list."),
  P("merry-puzzle", "christmas", "tree", "puzzle", 34, ["natural"], "Merry & Bright Puzzle", "A 520-piece puzzle for the quiet afternoon between Christmas and New Year’s."),
  P("holly-socks", "christmas", "holly", "socks", 18, ["white"], "Deck the Halls Socks", "Cushioned crew socks. A dependable stocking stuffer."),
  P("merry-hoodie", "christmas", "tree", "hoodie", 54, ["forest", "black", "heather"], "Merry & Bright Hoodie", "Heavier and warmer than the crewneck, with a pouch for cold hands."),
  // Kwanzaa
  P("kwanzaa-mug", "kwanzaa", "kinara", "mug", 18, ["white", "black"], "Happy Kwanzaa Mug", "A kinara with three red, one black and three green candles, as they stand on the mkeka."),
  P("nguzo-poster", "kwanzaa", "nguzo", "poster", 24, ["natural", "black"], "Seven Principles Poster", "The Nguzo Saba in Swahili with their English meanings, one for each day."),
  P("kwanzaa-tee", "kwanzaa", "kinara", "tee", 28, ["black", "natural", "forest"], "Happy Kwanzaa Tee", "The kinara and the traditional greeting. Wear it to the Karamu."),
  P("nguzo-tote", "kwanzaa", "nguzo", "tote", 24, ["natural"], "Seven Principles Tote", "All seven principles on canvas. A useful gift for Imani, the last day."),
  P("kwanzaa-cards", "kwanzaa", "kinara", "cards", 6, ["natural", "black"], "Happy Kwanzaa Cards", "Blank inside with envelopes. Pick the pack of ten for the whole list."),
  // New Year's Eve
  P("cheers-crew", "newyear", "cheers", "sweatshirt", 44, ["black", "navy", "sand"], "Cheers to 2027 Crewneck", "Two clinking flutes for the countdown and the slow first morning of the year."),
  P("countdown-tee", "newyear", "countdown", "tee", 28, ["black", "navy", "white"], "Countdown Crew Tee", "A firework burst over 2027. Matching shirts for the whole party."),
  P("cheers-stickers", "newyear", "cheers", "stickers", 8, ["white"], "Cheers to 2027 Stickers", "Kiss-cut stickers for invitations, party favors and the new planner."),
  P("countdown-poster", "newyear", "countdown", "poster", 24, ["black", "navy"], "Countdown Crew Poster", "Hang it by the bar for the party, then in the office for the year."),
  P("cheers-tote", "newyear", "cheers", "tote", 24, ["natural"], "Cheers to 2027 Tote", "Carries the bottle to the party and the shoes home after."),
  // Winter
  P("snow-beanie", "winter", "snowflake", "beanie", 26, ["navy", "heather", "forest"], "Snow Day Beanie", "Cuffed knit with an embroidered snowflake. Embroidery takes a day or two longer."),
  P("cocoa-mug", "winter", "cocoa", "mug", 18, ["white", "black"], "Hot Cocoa Club Mug", "Membership is open. Marshmallows strongly encouraged."),
  P("snow-blanket", "winter", "snowflake", "blanket", 64, ["ice", "navy"], "Snow Day Blanket", "A plush throw for the days school is called off."),
  P("cocoa-socks", "winter", "cocoa", "socks", 18, ["white"], "Hot Cocoa Club Socks", "Cushioned crew socks for cold floors."),
  P("snow-puzzle", "winter", "snowflake", "puzzle", 34, ["ice"], "Snow Day Puzzle", "A 520-piece puzzle for a long indoor afternoon."),
  P("cocoa-kids", "winter", "cocoa", "kidstee", 22, ["blush", "natural", "white"], "Hot Cocoa Club Kids Tee", "Youth sizes for the club’s youngest members."),
];
for (const p of PRINTED) p.supplier = "printful";
export const PRODUCTS = [...PRINTED, ...CJ_PRODUCTS];

// ---------------------------------------------------------------- pricing + SKUs
export const optionsOf = (p) => p.options || TYPES[p.type].options;
export const optionLabel = (p) => p.optionLabel || TYPES[p.type].optionLabel || (p.type === "cards" ? "Quantity" : "Size");
export const specOf = (p) => p.spec || TYPES[p.type].spec;
export const typeLabel = (p) => p.typeLabel || TYPES[p.type].label;
export const optionPrice = (p, opt) =>
  p.prices && p.prices[opt] != null ? p.prices[opt] : p.price + ((TYPES[p.type].up || {})[opt] || 0);
// SKUs are plain ASCII (product.color.option-slug) so every fulfillment system accepts them.
const slug = (o) => o.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const sku = (pid, color, opt) => `${pid}.${color}.${slug(opt)}`;
export function parseSku(s) {
  const [pid, color, os] = String(s).split(".");
  const p = PRODUCTS.find((x) => x.id === pid);
  const opt = p && optionsOf(p).find((o) => slug(o) === os);
  if (!p || !opt || !p.colors.includes(color)) return null;
  return { product: p, color, option: opt, unitCents: Math.round(optionPrice(p, opt) * 100) };
}
// What a supplier is asked to send for one sold line.
// Printful lines name the store SKU (set as the variant's external ID by the sync script);
// CJ lines name CJ's variant ID.
export function fulfilmentLine(s, qty) {
  const v = parseSku(s);
  if (v.product.supplier === "cj") return { supplier: "cj", vid: v.product.vids[v.option], quantity: qty };
  const pack = (TYPES[v.product.type].pack || {})[v.option];
  if (pack) return { supplier: "printful", externalVariantId: sku(v.product.id, v.color, pack[0]), quantity: qty * pack[1] };
  return { supplier: "printful", externalVariantId: s, quantity: qty };
}

// ---------------------------------------------------------------- arrival estimates
const iso = (d) => d.toISOString().slice(0, 10);
export const parseDate = (s) => new Date(s + "T12:00:00Z");
const isWorkday = (d) => d.getUTCDay() % 6 !== 0 && !NON_WORKING.includes(iso(d));
export function addWorkdays(from, n) {
  const d = new Date(from);
  let k = 0;
  while (k < n) { d.setUTCDate(d.getUTCDate() + 1); if (isWorkday(d)) k++; }
  return d;
}
export function subWorkdays(to, n) {
  const d = new Date(to);
  let k = 0;
  while (k < n) { d.setUTCDate(d.getUTCDate() - 1); if (isWorkday(d)) k++; }
  return d;
}
// Today as a noon-UTC date in the shopper's local calendar.
export const todayLocal = () => { const n = new Date(); return new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate(), 12)); };

export function arrival(type, speed = "standard", today = todayLocal()) {
  const [pmin, pmax] = TYPES[type].prod, [tmin, tmax] = CONFIG.shipping[speed].transit;
  return { early: addWorkdays(today, pmin + tmin), late: addWorkdays(today, pmax + tmax) };
}
// "in" = arrives by the date even at the slow end; "tight" = might; "late" = won't.
export function fitFor(type, target, speed = "standard", today) {
  const a = arrival(type, speed, today);
  return a.late <= target ? "in" : a.early <= target ? "tight" : "late";
}
// Last day to order with standard shipping so the slowest typical item arrives in time.
export const orderBy = (occasion) => subWorkdays(parseDate(occasion.date), 5 + CONFIG.shipping.standard.transit[1]);
