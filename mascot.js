// The EveryEve shop pup, drawn as an original illustration.
// puppy({ gift: true }) adds a wrapped present; head() is the small logo mark.

const FUR = `
  <radialGradient id="pupFur" cx="45%" cy="35%" r="70%"><stop offset="0" stop-color="#F2CB8F"/><stop offset=".6" stop-color="#DDA460"/><stop offset="1" stop-color="#B97A3A"/></radialGradient>
  <radialGradient id="pupHead" cx="45%" cy="38%" r="65%"><stop offset="0" stop-color="#F6D49C"/><stop offset=".65" stop-color="#E0A863"/><stop offset="1" stop-color="#BD7E3E"/></radialGradient>
  <linearGradient id="pupEar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9773A"/><stop offset="1" stop-color="#8E5526"/></linearGradient>
  <radialGradient id="pupCream" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#FFF4E0"/><stop offset="1" stop-color="#F0D3A4"/></radialGradient>
  <radialGradient id="pupEye" cx="40%" cy="35%" r="65%"><stop offset="0" stop-color="#6B3F1D"/><stop offset=".55" stop-color="#3A2111"/><stop offset="1" stop-color="#160B05"/></radialGradient>
  <radialGradient id="pupNose" cx="40%" cy="30%" r="70%"><stop offset="0" stop-color="#5A4038"/><stop offset="1" stop-color="#1E1411"/></radialGradient>`;

const eye = (x, y) =>
  `<ellipse cx="${x}" cy="${y + 2}" rx="17" ry="18" fill="#7A4A26" opacity=".35"/>` +
  `<ellipse cx="${x}" cy="${y}" rx="15" ry="16.5" fill="url(#pupEye)"/>` +
  `<circle cx="${x - 5}" cy="${y - 6}" r="5.2" fill="#fff"/><circle cx="${x + 5}" cy="${y + 5}" r="2.2" fill="#fff" opacity=".85"/>`;

function headGroup() {
  const strands = [[188, 96, 184, 84], [198, 94, 198, 80], [208, 96, 213, 84], [178, 100, 170, 90], [218, 100, 226, 91]]
    .map(([a, b, c, d]) => `<path d="M${a},${b} Q${(a + c) / 2 + 3},${(b + d) / 2} ${c},${d}" stroke="#E7B574" stroke-width="5" stroke-linecap="round" fill="none"/>`).join("");
  return `
  <path d="M120,118 C78,122 62,196 78,248 C88,276 118,272 128,244 C138,212 140,150 120,118Z" fill="url(#pupEar)"/>
  <path d="M280,118 C322,122 338,196 322,248 C312,276 282,272 272,244 C262,212 260,150 280,118Z" fill="url(#pupEar)"/>
  <path d="M112,150 C104,96 150,86 200,86 C250,86 296,96 288,150 C298,200 268,252 200,256 C132,252 102,200 112,150Z" fill="url(#pupHead)"/>
  ${strands}
  <path d="M148,122 Q165,112 180,122" stroke="#C88C4C" stroke-width="5" stroke-linecap="round" fill="none" opacity=".55"/>
  <path d="M220,122 Q235,112 252,122" stroke="#C88C4C" stroke-width="5" stroke-linecap="round" fill="none" opacity=".55"/>
  <path d="M146,214 C146,178 172,168 200,168 C228,168 254,178 254,214 C254,244 228,256 200,256 C172,256 146,244 146,214Z" fill="url(#pupCream)"/>
  ${eye(162, 154)}${eye(238, 154)}
  <ellipse cx="146" cy="200" rx="15" ry="9" fill="#F0A39A" opacity=".45"/><ellipse cx="254" cy="200" rx="15" ry="9" fill="#F0A39A" opacity=".45"/>
  <path d="M180,190 C180,178 220,178 220,190 C220,204 208,212 200,213 C192,212 180,204 180,190Z" fill="url(#pupNose)"/>
  <ellipse cx="193" cy="185" rx="7" ry="3.5" fill="#fff" opacity=".45"/>
  <path d="M200,213 L200,224" stroke="#6E432A" stroke-width="3" stroke-linecap="round"/>
  <path d="M191,229 C190,248 197,254 200,254 C203,254 210,248 209,229Z" fill="#EE8796"/><path d="M200,232 L200,248" stroke="#D86B7C" stroke-width="2"/>
  <path d="M176,222 Q188,234 200,224 Q212,234 224,222" stroke="#6E432A" stroke-width="3.2" stroke-linecap="round" fill="none"/>`;
}

export function puppy({ gift = false, label = "The EveryEve shop pup" } = {}) {
  const giftBox = gift ? `
  <g transform="translate(286,318) rotate(6)">
    <rect x="0" y="22" width="92" height="74" rx="4" fill="#C8323C"/><rect x="-6" y="8" width="104" height="22" rx="4" fill="#D9434D"/>
    <rect x="38" y="8" width="16" height="88" fill="#F2C14E"/>
    <path d="M46,8 C28,-14 8,-4 22,8Z M46,8 C64,-14 84,-4 70,8Z" fill="#F2C14E"/>
  </g>` : "";
  return `<svg viewBox="0 0 400 440" role="img" aria-label="${label}"><defs>${FUR}</defs>
  <ellipse cx="200" cy="424" rx="150" ry="13" fill="#000" opacity=".09"/>
  <path d="M280,392 C338,392 356,342 338,308" stroke="#C4843F" stroke-width="24" stroke-linecap="round" fill="none"/>
  <ellipse cx="128" cy="380" rx="56" ry="44" fill="url(#pupFur)"/><ellipse cx="272" cy="380" rx="56" ry="44" fill="url(#pupFur)"/>
  <path d="M138,236 C112,290 104,360 118,412 L282,412 C296,360 288,290 262,236Z" fill="url(#pupFur)"/>
  <path d="M164,250 C156,300 172,344 200,356 C228,344 244,300 236,250Z" fill="url(#pupCream)"/>
  <g stroke="#B9773A" stroke-width="2.5" stroke-linecap="round" opacity=".35"><path d="M140,320 l-8,10"/><path d="M262,322 l8,10"/><path d="M128,360 l-8,8"/><path d="M272,362 l8,8"/></g>
  <rect x="158" y="312" width="38" height="100" rx="18" fill="url(#pupFur)"/><rect x="204" y="312" width="38" height="100" rx="18" fill="url(#pupFur)"/>
  <ellipse cx="176" cy="412" rx="28" ry="14" fill="#F6DDB4"/><ellipse cx="224" cy="412" rx="28" ry="14" fill="#F6DDB4"/>
  <path d="M168,404 v12 M180,404 v12 M216,404 v12 M228,404 v12" stroke="#D2A876" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M138,244 Q200,276 262,244 L264,262 Q200,296 136,262Z" fill="#2F6E8F"/>
  <circle cx="200" cy="292" r="14" fill="#F2C14E" stroke="#C99A2E" stroke-width="2.5"/><circle cx="200" cy="292" r="4" fill="#C99A2E"/>
  <g transform="rotate(-7 200 175)">${headGroup()}</g>
  ${giftBox}</svg>`;
}

export function head(size = 34) {
  return `<svg width="${Math.round(size * 1.33)}" height="${size}" viewBox="60 72 280 210" aria-hidden="true"><defs>${FUR}</defs>${headGroup()}</svg>`;
}
