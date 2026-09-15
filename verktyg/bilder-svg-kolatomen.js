// bilder-svg-kolatomen.js – de nio SVG-bilderna till Organisk kemi, delkapitel 1 "Kolatomen"
// (arbetsorder-k1-kolatomen.md, 2026-09-14). Skriver till kapitel/organisk-kemi/delkapitel/kolatomen/img/k1-a{n}.svg.
// Kör: node verktyg/bilder-svg-kolatomen.js
//
//   k1-a1  Organiskt och oorganiskt kol          1.1   k1-a5  Diamant och grafit               2.2
//   k1-a2  Metan skriven på tre sätt             1.2   k1-a7  Fulleren, nanorör och grafen     2.3
//   k1-a3  Fyra bindningar kan fördelas olika    1.2   k1-a8  Fotosyntesen                     3.1
//   k1-a4  Kedja, gren och ring                  1.3   k1-a9  Cellandningen                    3.2
//   (k1-a6 Aktivt kol är en AI-bild: platta-partiklar.js + nyckla-gron.js)   k1-a10 Kolets snabba kretslopp  3.3
//
// Palett enligt ordern: konturer/text #2d4a35, signaturfärg #5a9668, kol #3a3a3a, syre #C0392B, väte #f5f0e4
// med kontur, kväve #3D6BA8, grått #8A8A8A, ljusblå vätska #a8c4d8. Papper #ece2c8 ritas inte (transparent bakgrund).
// Varm gul #e8c547 för ljusenergi/energi i A8–A9 är kemins accentfärg för energi och ljus (KOMPONENTER 9.4, Joachim 2026-09-15). Typsnitt: Georgia-fallback (extern SVG når inte sidans webbfonter).
// k1-a10 är en grundfigur: delarna ligger i grupper med stabila id:n (atmosfar, vaxt, djur, mark, pilar, utpil) och en
// tom grupp geologisk-slinga där delkapitel 3 kan lägga till sin del utan att grundfiguren ritas om (KOMPONENTER DEL 9.1).
'use strict';
const fs = require('fs'), path = require('path');
const UT = path.join(__dirname, '..', 'kapitel', 'organisk-kemi', 'delkapitel', 'kolatomen', 'img');
fs.mkdirSync(UT, { recursive: true });
const INK = '#2d4a35', SIGN = '#5a9668', KOL = '#3a3a3a', SYRE = '#C0392B', VATE = '#f5f0e4', KVAVE = '#3D6BA8', GRA = '#8A8A8A', VATSKA = '#a8c4d8', GUL = '#e8c547';
const FONT = `font-family="Georgia, 'Times New Roman', serif"`;
const r2 = x => Math.round(x * 100) / 100;
const svg = (w, h, titel, inneh) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-labelledby="t">
  <title id="t">${titel}</title>
${inneh}</svg>
`;
const txt = (x, y, t, extra = '') => `  <text x="${r2(x)}" y="${r2(y)}" fill="${INK}" ${/font-size=/.test(extra) ? '' : 'font-size="16"'} ${/text-anchor=/.test(extra) ? '' : 'text-anchor="middle"'} ${FONT} ${extra}>${t}</text>\n`;
// formel i Unicode → tspans (index/laddning)
const SUBT = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' }, SUPT = { '⁺': '+', '⁻': '−', '²': '2', '³': '3' };
const formel = s => {
  let ut = '', kvar = s;
  while (kvar) {
    const m = kvar.match(/^([₀-₉]+|[⁺⁻²³]+)/);
    if (m) {
      const sub = /[₀-₉]/.test(m[1]), t = [...m[1]].map(c => SUBT[c] || SUPT[c]).join('');
      ut += `<tspan font-size="0.7em" dy="${sub ? '0.35em' : '-0.6em'}">${t}</tspan>`; kvar = kvar.slice(m[1].length);
      const rest = kvar.match(/^[^₀-₉⁺⁻²³]+/); if (rest) { ut += `<tspan dy="${sub ? '-0.35em' : '0.6em'}">${rest[0]}</tspan>`; kvar = kvar.slice(rest[0].length); }
    } else { const rest = kvar.match(/^[^₀-₉⁺⁻²³]+/); ut += rest[0]; kvar = kvar.slice(rest[0].length); }
  }
  return ut;
};
const linje = (x1, y1, x2, y2, farg = INK, bredd = 2, extra = '') => `  <line x1="${r2(x1)}" y1="${r2(y1)}" x2="${r2(x2)}" y2="${r2(y2)}" stroke="${farg}" stroke-width="${bredd}" stroke-linecap="round" ${extra}/>\n`;
const cirkel = (x, y, r, fyll, kontur = INK, bredd = 1.5) => `  <circle cx="${r2(x)}" cy="${r2(y)}" r="${r}" fill="${fyll}" stroke="${kontur}" stroke-width="${bredd}"/>\n`;
const pil = (x1, y1, x2, y2, farg = INK, bredd = 2.5, extra = '') => {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, s = bredd * 4, bx = x2 - ux * s, by = y2 - uy * s;
  return `  <line x1="${r2(x1)}" y1="${r2(y1)}" x2="${r2(bx)}" y2="${r2(by)}" stroke="${farg}" stroke-width="${bredd}" stroke-linecap="round" ${extra}/>
  <polygon points="${r2(x2)},${r2(y2)} ${r2(bx - uy * s * 0.5)},${r2(by + ux * s * 0.5)} ${r2(bx + uy * s * 0.5)},${r2(by - ux * s * 0.5)}" fill="${farg}" ${extra}/>\n`;
};
// bred pil (polygon) för A8/A9: från (x1,y1) till (x2,y2), bredd b – kan innehålla kolprickar längs mittlinjen
const bredPil = (x1, y1, x2, y2, b, farg, prickar = 0) => {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux, hs = b * 1.1, hl = b * 1.3;
  const bx = x2 - ux * hl, by = y2 - uy * hl;
  const P = [[x1 + nx * b / 2, y1 + ny * b / 2], [bx + nx * b / 2, by + ny * b / 2], [bx + nx * hs, by + ny * hs], [x2, y2], [bx - nx * hs, by - ny * hs], [bx - nx * b / 2, by - ny * b / 2], [x1 - nx * b / 2, y1 - ny * b / 2]];
  let s = `  <polygon points="${P.map(p => r2(p[0]) + ',' + r2(p[1])).join(' ')}" fill="${farg}" stroke="${INK}" stroke-width="1.2" stroke-linejoin="round"/>\n`;
  for (let i = 0; i < prickar; i++) { const t = 0.12 + 0.72 * i / (prickar - 1); s += `  <circle cx="${r2(x1 + ux * (L - hl) * t)}" cy="${r2(y1 + uy * (L - hl) * t)}" r="4" fill="${KOL}"/>\n`; }
  return s;
};
const H = (x, y, r = 9) => cirkel(x, y, r, VATE, INK, 1.2);
const C = (x, y, r = 12) => cirkel(x, y, r, KOL, INK, 1.2);
const O = (x, y, r = 11) => cirkel(x, y, r, SYRE, INK, 1.2);
const bind = (x1, y1, x2, y2) => linje(x1, y1, x2, y2, INK, 2.5);
let antal = 0;
const skriv = (fil, w, h, titel, inneh) => { fs.writeFileSync(path.join(UT, fil), svg(w, h, titel, inneh)); antal++; };

// ---------- A1. Organiskt och oorganiskt kol ----------
{
  const W = 760, HH = 330, MITT = 470;
  let ut = linje(MITT, 20, MITT, 262, SIGN, 2);
  ut += txt(MITT / 2, 40, 'Organiska ämnen', 'font-size="19" font-weight="bold"') + txt((MITT + W) / 2, 40, 'Räknas som oorganiska', 'font-size="19" font-weight="bold"');
  // metan: C med fyra H
  { const cx = 70, cy = 140; [[0, -34], [34, 0], [0, 34], [-34, 0]].forEach(([dx, dy]) => { ut += bind(cx, cy, cx + dx, cy + dy) + H(cx + dx, cy + dy); }); ut += C(cx, cy); ut += txt(cx, 210, 'metan', 'font-size="14"'); }
  // etanol: C–C–O–H med väten
  { const y = 140, x0 = 150; ut += bind(x0, y, x0 + 40, y) + bind(x0 + 40, y, x0 + 78, y) + bind(x0 + 78, y, x0 + 104, y);
    [[x0, y - 30], [x0 - 22, y + 20], [x0 + 40, y - 30], [x0 + 40, y + 30]].forEach(([hx, hy]) => { ut += bind(hx < x0 + 20 ? x0 : x0 + 40, y, hx, hy) + H(hx, hy); });
    ut += H(x0 + 104, y) + C(x0, y) + C(x0 + 40, y) + O(x0 + 78, y); ut += txt(x0 + 45, 210, 'etanol', 'font-size="14"'); }
  // socker: sexring med ett syre, tre OH markerade
  { const cx = 320, cy = 140, R = 32; const P = [0, 1, 2, 3, 4, 5].map(i => [cx + R * Math.cos(Math.PI / 6 + i * Math.PI / 3), cy + R * Math.sin(Math.PI / 6 + i * Math.PI / 3)]);
    for (let i = 0; i < 6; i++) { const a = P[i], b = P[(i + 1) % 6]; ut += bind(a[0], a[1], b[0], b[1]); }
    [1, 3, 5].forEach(i => { const [px, py] = P[i]; const ox = cx + (px - cx) * 1.75, oy = cy + (py - cy) * 1.75; ut += bind(px, py, ox, oy) + O(ox, oy, 8); });
    P.forEach(([px, py], i) => { ut += i === 4 ? O(px, py, 10) : C(px, py, 10); });
    ut += txt(cx, 210, 'socker', 'font-size="14"'); }
  // fettkedja: sicksack av sex kol med en syreände
  { let x = 40, y = 250; const pts = []; for (let i = 0; i < 6; i++) { pts.push([x + i * 30, y + (i % 2 ? -14 : 0)]); }
    for (let i = 0; i < 5; i++) { ut += bind(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]); }
    const [lx, ly] = pts[5]; ut += bind(lx, ly, lx + 26, ly - 10) + bind(lx, ly, lx + 26, ly + 12) + O(lx + 26, ly - 10, 8) + O(lx + 26, ly + 12, 8);
    pts.forEach(([px, py]) => { ut += C(px, py, 9); });
    ut += txt(130, 292, 'en bit av en fettkedja', 'font-size="14"'); }
  // koldioxid: O=C=O
  { const cx = 560, cy = 120; ut += linje(cx - 44, cy - 4, cx, cy - 4, INK, 2.5) + linje(cx - 44, cy + 4, cx, cy + 4, INK, 2.5) + linje(cx, cy - 4, cx + 44, cy - 4, INK, 2.5) + linje(cx, cy + 4, cx + 44, cy + 4, INK, 2.5);
    ut += O(cx - 44, cy) + O(cx + 44, cy) + C(cx, cy); ut += txt(cx, 165, 'koldioxid', 'font-size="14"'); }
  // karbonatjon: C med tre O i hakparentes, 2−
  { const cx = 690, cy = 120; [[0, -36], [31, 18], [-31, 18]].forEach(([dx, dy]) => { ut += bind(cx, cy, cx + dx, cy + dy) + O(cx + dx, cy + dy); }); ut += C(cx, cy);
    ut += `  <path d="M${cx - 46} ${cy - 56}H${cx - 56}V${cy + 44}H${cx - 46}" fill="none" stroke="${INK}" stroke-width="1.5"/>\n  <path d="M${cx + 46} ${cy - 56}H${cx + 56}V${cy + 44}H${cx + 46}" fill="none" stroke="${INK}" stroke-width="1.5"/>\n`;
    ut += txt(cx + 66, cy - 50, '2−', 'font-size="15" font-weight="bold"'); ut += txt(cx, 190, 'karbonatjon', 'font-size="14"'); }
  ut += linje(30, 272, W - 30, 272, INK, 1) + txt(W / 2, HH - 14, 'Alla innehåller kol.', 'font-size="19" font-weight="bold"');
  skriv('k1-a1.svg', W, HH, 'Två grupper av molekyler. Till vänster metan, etanol, socker och fett, märkta organiska ämnen. Till höger koldioxid och karbonat, märkta oorganiska. Under båda står att alla innehåller kol.', ut);
}

// ---------- A2. Metan skriven på tre sätt ----------
{
  const W = 720, HH = 300, K = W / 3;
  let ut = '';
  ut += txt(K / 2, 130, 'CH<tspan font-size="0.55em" dy="0.25em">4</tspan>', 'font-size="64"');
  { const cx = K * 1.5, cy = 115; [[0, -48], [48, 0], [0, 48], [-48, 0]].forEach(([dx, dy]) => { ut += bind(cx + dx * 0.32, cy + dy * 0.32, cx + dx * 0.72, cy + dy * 0.72) + txt(cx + dx, cy + dy + 7, 'H', 'font-size="22"'); });
    ut += `  <rect x="${cx - 14}" y="${cy - 14}" width="28" height="28" fill="none"/>\n` + txt(cx, cy + 8, 'C', 'font-size="24" font-weight="bold"'); }
  { const cx = K * 2.5, cy = 118; [[0, -50], [46, 20], [-46, 20], [0, 42]].forEach(([dx, dy], i) => { if (i < 3) ut += cirkel(cx + dx, cy + dy, 17, VATE, INK, 1.5); }); ut += cirkel(cx, cy, 34, KOL, INK, 1.5); ut += cirkel(cx, cy + 42, 17, VATE, INK, 1.5); }
  ['Molekylformel', 'Strukturformel', 'Modell'].forEach((t, i) => { ut += txt(K * (i + 0.5), 225, t, 'font-size="17" font-style="italic"'); });
  ut += linje(30, 245, W - 30, 245, INK, 1) + txt(W / 2, HH - 20, 'Samma molekyl, tre sätt att visa den.', 'font-size="18" font-weight="bold"');
  skriv('k1-a2.svg', W, HH, 'Metan visad som formeln CH4, som strukturformel med fyra streck från kolatomen till fyra väteatomer, och som modell med en stor mörk kula och fyra små ljusa', ut);
}

// ---------- A3. Fyra bindningar kan fördelas olika ----------
{
  const W = 760, HH = 260, K = W / 3, cy = 100, L = 52;
  let ut = '';
  const tom = (x, y) => cirkel(x, y, 9, 'none', INK, 1.8);
  const multi = (cx, cy, dx, dy, n) => { let s = ''; const nx = -dy / L * 5, ny = dx / L * 5; for (let k = 0; k < n; k++) { const off = (k - (n - 1) / 2); s += linje(cx + nx * off * 1.2, cy + ny * off * 1.2, cx + dx + nx * off * 1.2, cy + dy + ny * off * 1.2, INK, 2.2); } return s; };
  // 1: fyra enkla
  { const cx = K * 0.5; [[0, -L], [L, 0], [0, L], [-L, 0]].forEach(([dx, dy]) => { ut += multi(cx, cy, dx, dy, 1) + tom(cx + dx, cy + dy); }); ut += C(cx, cy, 14); }
  // 2: två enkla + en dubbel
  { const cx = K * 1.5; ut += multi(cx, cy, -L * 0.87, -L * 0.5, 1) + tom(cx - L * 0.87, cy - L * 0.5) + multi(cx, cy, -L * 0.87, L * 0.5, 1) + tom(cx - L * 0.87, cy + L * 0.5) + multi(cx, cy, L, 0, 2) + tom(cx + L, cy); ut += C(cx, cy, 14); }
  // 3: en enkel + en trippel
  { const cx = K * 2.5; ut += multi(cx, cy, -L, 0, 1) + tom(cx - L, cy) + multi(cx, cy, L, 0, 3) + tom(cx + L, cy); ut += C(cx, cy, 14); }
  ['1+1+1+1 = 4', '1+1+2 = 4', '1+3 = 4'].forEach((t, i) => { const x = K * (i + 0.5); ut += `  <rect x="${x - 58}" y="182" width="116" height="30" rx="5" fill="none" stroke="${INK}" stroke-width="1.2"/>\n` + txt(x, 203, t, 'font-size="16"'); });
  ['fyra enkelbindningar', 'två enkla + en dubbel', 'en enkel + en trippel'].forEach((t, i) => { ut += txt(K * (i + 0.5), HH - 16, t, 'font-size="14" font-style="italic"'); });
  skriv('k1-a3.svg', W, HH, 'Tre kolatomer med olika bindningar. Den första har fyra enkla streck, den andra två enkla och ett dubbelt, den tredje ett enkelt och ett trippelt. Vid varje står en uträkning som ger fyra', ut);
}

// ---------- A4. Kedja, gren och ring ----------
{
  const W = 760, HH = 250, K = W / 3;
  let ut = txt(W / 2, 34, 'Sex kolatomer, tre olika ämnen.', 'font-size="18" font-weight="bold"');
  const kol = (x, y) => cirkel(x, y, 9, KOL, INK, 1.2);
  const kedja = (pts) => { let s = ''; for (let i = 0; i < pts.length - 1; i++) s += bind(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]); pts.forEach(([x, y]) => { s += kol(x, y); }); return s; };
  // 1: rak sicksack, sex kol
  { const x0 = K * 0.5 - 75, y = 130; const pts = []; for (let i = 0; i < 6; i++) pts.push([x0 + i * 30, y + (i % 2 ? -16 : 16)]); ut += kedja(pts); ut += txt(K * 0.5, 200, 'rak kedja', 'font-size="15" font-style="italic"'); }
  // 2: grenad – fem i kedjan, gren på tredje atomen = sex
  { const x0 = K * 1.5 - 60, y = 140; const pts = []; for (let i = 0; i < 5; i++) pts.push([x0 + i * 30, y + (i % 2 ? -16 : 16)]); ut += kedja(pts); const [gx, gy] = pts[2]; ut += bind(gx, gy, gx, gy - 40) + kol(gx, gy - 40); ut += txt(K * 1.5, 200, 'grenad kedja', 'font-size="15" font-style="italic"'); }
  // 3: ring, sex kol, insidan i signaturfärg
  { const cx = K * 2.5, cy = 130, R = 38; const P = [0, 1, 2, 3, 4, 5].map(i => [cx + R * Math.cos(Math.PI / 6 + i * Math.PI / 3), cy + R * Math.sin(Math.PI / 6 + i * Math.PI / 3)]);
    ut += `  <polygon points="${P.map(p => r2(p[0]) + ',' + r2(p[1])).join(' ')}" fill="${SIGN}" fill-opacity="0.18" stroke="none"/>\n`;
    for (let i = 0; i < 6; i++) { const a = P[i], b = P[(i + 1) % 6]; ut += bind(a[0], a[1], b[0], b[1]); } P.forEach(([x, y]) => { ut += kol(x, y); });
    ut += txt(K * 2.5, 200, 'ring', 'font-size="15" font-style="italic"'); }
  skriv('k1-a4.svg', W, HH, 'Tre strukturer av sex kolatomer vardera: en rak kedja, en grenad kedja och en ring. Över dem står att det är sex kolatomer i alla tre', ut);
}

// ---------- gemensamt: honeycomb-nät (hexagoner med sida a), hörn och kanter utan dubbletter ----------
// celler (i, j): centrum cx = i·1,5a, cy = j·√3a + (i udda ? √3a/2 : 0). Returnerar { horn: [[x,y]], kanter: [[h1,h2]] } i planet.
function honeycomb(a, kolumner, rader) {
  const horn = [], index = new Map(), kanter = new Set();
  const id = (x, y) => { const k = r2(x) + ',' + r2(y); if (!index.has(k)) { index.set(k, horn.length); horn.push([x, y]); } return index.get(k); };
  for (let i = 0; i < kolumner; i++) for (let j = 0; j < rader; j++) {
    const cx = i * 1.5 * a, cy = j * Math.sqrt(3) * a + (i % 2 ? Math.sqrt(3) * a / 2 : 0);
    const P = [0, 1, 2, 3, 4, 5].map(k => id(cx + a * Math.cos(k * Math.PI / 3), cy + a * Math.sin(k * Math.PI / 3)));
    for (let k = 0; k < 6; k++) { const p = P[k], q = P[(k + 1) % 6]; kanter.add(p < q ? p + '-' + q : q + '-' + p); }
  }
  return { horn, kanter: [...kanter].map(s => s.split('-').map(Number)) };
}

// ---------- A5. Diamant och grafit ----------
{
  const W = 820, HH = 400, MITT = 410;
  let ut = linje(MITT, 20, MITT, HH - 20, SIGN, 2);
  ut += txt(MITT / 2, 38, 'Diamant', 'font-size="20" font-weight="bold"') + txt((MITT + W) / 2, 38, 'Grafit', 'font-size="20" font-weight="bold"');
  // diamant: kluster ur diamantgittret – centrum, fyra grannar, tre yttre per granne = 17 atomer (ordern sa 12–16; Joachim
  // 2026-09-15: behåll 17, med 16 får en granne bara tre bindningar och bildens poäng är fyra per atom); sned projektion
  {
    const t = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]];
    const atomer = [[0, 0, 0]], bindn = [], inre = [0];
    t.forEach((d, i) => { const n = d.slice(); atomer.push(n); const ni = atomer.length - 1; inre.push(ni); bindn.push([0, ni]);
      t.filter((_, j) => j !== i).forEach(e => { atomer.push(n.map((x, k) => x - e[k])); bindn.push([ni, atomer.length - 1]); }); });
    // rotera lite kring y och x så att inga bindningar täcker varandra, projicera ortografiskt
    const ry = 0.55, rx = 0.35;
    const proj = ([x, y, z]) => { const x1 = x * Math.cos(ry) + z * Math.sin(ry), z1 = -x * Math.sin(ry) + z * Math.cos(ry); const y2 = y * Math.cos(rx) - z1 * Math.sin(rx), z2 = y * Math.sin(rx) + z1 * Math.cos(rx); return [MITT / 2 + x1 * 46, 178 - y2 * 46, z2]; };
    const P = atomer.map(proj);
    // bakre bindningar först
    bindn.sort((a, b) => (P[a[0]][2] + P[a[1]][2]) - (P[b[0]][2] + P[b[1]][2]));
    bindn.forEach(([i, j]) => { ut += linje(P[i][0], P[i][1], P[j][0], P[j][1], INK, 3); });
    P.map((p, i) => [p, i]).sort((a, b) => a[0][2] - b[0][2]).forEach(([p]) => { ut += cirkel(p[0], p[1], 10, KOL, INK, 1.2); });
    ut += txt(MITT / 2, 322, 'fyra bindningar per kolatom', 'font-size="15" font-style="italic"');
    ut += txt(MITT / 2, HH - 22, 'hårt, leder inte ström', 'font-size="17" font-weight="bold"');
    if (atomer.length !== 17) throw new Error('diamant: ' + atomer.length + ' atomer');
    // kontroll: inre atomer (centrum + fyra grannar) har fyra bindningar var
    const grad = atomer.map(() => 0); bindn.forEach(([i, j]) => { grad[i]++; grad[j]++; });
    if (inre.some(i => grad[i] !== 4)) throw new Error('diamant: inre atomer utan fyra bindningar ' + inre.map(i => grad[i]));
  }
  // grafit: tre skikt av honeycomb i sned projektion, prickade linjer mellan skikten
  {
    const a = 16, hc = honeycomb(a, 5, 3);
    const bx = MITT + 70, dy = 80;
    const proj = ([x, y], lag) => [bx + x + y * 0.55, 92 + lag * dy + y * 0.42];
    for (let lag = 0; lag < 3; lag++) {
      const P = hc.horn.map(p => proj(p, lag));
      if (lag < 2) { [3, 11, 19, 27, 35].forEach(k => { if (P[k]) ut += linje(P[k][0], P[k][1] + 5, P[k][0], P[k][1] + dy - 5, GRA, 1.5, 'stroke-dasharray="2 4"'); }); }
    }
    for (let lag = 0; lag < 3; lag++) {
      const P = hc.horn.map(p => proj(p, lag));
      hc.kanter.forEach(([i, j]) => { ut += linje(P[i][0], P[i][1], P[j][0], P[j][1], INK, 1.8); });
      P.forEach(p => { ut += cirkel(p[0], p[1], 3.6, KOL, INK, 0.8); });
    }
    ut += txt((MITT + W) / 2, 322, 'tre bindningar per kolatom', 'font-size="15" font-style="italic"') + txt((MITT + W) / 2, 344, 'svaga krafter mellan skikten', 'font-size="15" font-style="italic"');
    ut += txt((MITT + W) / 2, HH - 22, 'mjukt, leder ström', 'font-size="17" font-weight="bold"');
  }
  skriv('k1-a5.svg', W, HH, 'Till vänster diamantens nätverk där varje kolatom binder åt fyra håll. Till höger grafitens skikt av sexkantiga ringar med prickade linjer mellan skikten som visar svaga krafter', ut);
}

// ---------- A7. Fulleren, nanorör och grafen ----------
{
  const W = 800, HH = 320, K = W / 3;
  let ut = '';
  // fulleren: Schlegel-diagram av C60 sett ovanifrån en sexkant – alla 12 femkanter (fyllda) och 20 sexkanter syns
  {
    const phi = (1 + Math.sqrt(5)) / 2;
    const bas = [[0, 1, 3 * phi], [1, 2 + phi, 2 * phi], [phi, 2, 2 * phi + 1]];
    const V = []; const nyckel = new Set();
    for (const b of bas) for (const p of [[0, 1, 2], [1, 2, 0], [2, 0, 1]]) for (const s of [[1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1], [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1]]) {
      const v = [b[p[0]] * s[0], b[p[1]] * s[1], b[p[2]] * s[2]]; const k = v.map(x => r2(x)).join(','); if (!nyckel.has(k)) { nyckel.add(k); V.push(v); } }
    if (V.length !== 60) throw new Error('C60: ' + V.length + ' hörn');
    const d = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
    const E = []; const N = V.map(() => []);
    for (let i = 0; i < 60; i++) for (let j = i + 1; j < 60; j++) if (Math.abs(d(V[i], V[j]) - 2) < 1e-6) { E.push([i, j]); N[i].push(j); N[j].push(i); }
    if (E.length !== 90) throw new Error('C60: ' + E.length + ' kanter');
    const ytor = new Map();
    const sokCykel = (start, langd) => { const res = []; const dfs = (stig) => { const s = stig[stig.length - 1]; if (stig.length === langd) { if (N[s].includes(start)) res.push([...stig]); return; } for (const n of N[s]) { if (!stig.includes(n)) dfs([...stig, n]); } }; dfs([start]); return res; };
    const plan = cyk => { const c = [0, 1, 2].map(k => cyk.reduce((a, i) => a + V[i][k], 0) / cyk.length); const n = c.map(x => x / Math.hypot(...c)); return cyk.every(i => Math.abs((V[i][0] - c[0]) * n[0] + (V[i][1] - c[1]) * n[1] + (V[i][2] - c[2]) * n[2]) < 1e-6); };
    for (let v = 0; v < 60; v++) for (const L of [5, 6]) for (const cyk of sokCykel(v, L)) { if (plan(cyk)) { const k = [...cyk].sort((a, b) => a - b).join('-'); if (!ytor.has(k)) ytor.set(k, cyk); } }
    const Y = [...ytor.values()];
    const fem = Y.filter(y => y.length === 5), sex = Y.filter(y => y.length === 6);
    if (fem.length !== 12 || sex.length !== 20) throw new Error(`C60: ${fem.length} femkanter, ${sex.length} sexkanter`);
    const femKant = new Set(); fem.forEach(y => { for (let i = 0; i < 5; i++) { const a = y[i], b = y[(i + 1) % 5]; const k = a < b ? a + '-' + b : b + '-' + a; if (femKant.has(k)) throw new Error('två femkanter delar kant'); femKant.add(k); } });
    // rotera så att en sexkant ligger överst, projicera stereografiskt från en punkt ovanför – den sexkanten blir yttre rand
    const top = sex[0]; const c = [0, 1, 2].map(k => top.reduce((a, i) => a + V[i][k], 0) / 6); const cn = Math.hypot(...c); const z = c.map(x => x / cn);
    const tmp = Math.abs(z[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]; const xax = [tmp[1] * z[2] - tmp[2] * z[1], tmp[2] * z[0] - tmp[0] * z[2], tmp[0] * z[1] - tmp[1] * z[0]]; const xn = Math.hypot(...xax); const X = xax.map(a => a / xn); const Yax = [z[1] * X[2] - z[2] * X[1], z[2] * X[0] - z[0] * X[2], z[0] * X[1] - z[1] * X[0]];
    const rot = v => [v[0] * X[0] + v[1] * X[1] + v[2] * X[2], v[0] * Yax[0] + v[1] * Yax[1] + v[2] * Yax[2], v[0] * z[0] + v[1] * z[1] + v[2] * z[2]];
    const R = Math.hypot(...V[0]); const z0 = R * 1.45; const cx = K * 0.5, cy = 150;
    let P2 = V.map(v => { const r = rot(v); const k = 1 / (z0 - r[2]); return [r[0] * k, r[1] * k]; });
    const maxr = Math.max(...P2.map(p => Math.hypot(p[0], p[1]))); const skala = 108 / maxr;
    P2 = P2.map(p => [cx + p[0] * skala, cy + p[1] * skala]);
    const yta = (y, fyll) => `  <polygon points="${y.map(i => r2(P2[i][0]) + ',' + r2(P2[i][1])).join(' ')}" fill="${fyll}" stroke="${INK}" stroke-width="1.3" stroke-linejoin="round"/>\n`;
    ut += `  <circle cx="${cx}" cy="${cy}" r="118" fill="none" stroke="${INK}" stroke-width="1" stroke-dasharray="3 4" opacity="0.6"/>\n`;
    sex.forEach(y => { ut += yta(y, 'none'); }); fem.forEach(y => { ut += yta(y, SIGN); });
    ut += txt(cx, 290, formel('C₆₀'), 'font-size="20"') + txt(cx, 312, 'fulleren', 'font-size="15" font-style="italic"');
    fs.writeFileSync(path.join(UT, '_c60-kontroll.json'), JSON.stringify({ horn: V.length, kanter: E.length, femkanter: fem.length, sexkanter: sex.length, femkanterDelarKant: false }));
  }
  // nanorör: honeycomb-ark rullat till en cylinder (n hexagoner runt), bara framsidan ritas; öppet i högra änden
  {
    const a = 11, n = 6, kol = 11, hc = honeycomb(a, kol, n);
    const omkrets = n * Math.sqrt(3) * a, Rr = omkrets / (2 * Math.PI) * 1.9;
    const cx = K * 1.5, cy = 150, x0 = cx - (kol * 1.5 * a) / 2;
    const P = hc.horn.map(([x, y]) => { const th = (y / omkrets) * 2 * Math.PI; return [x0 + x, cy - Rr * Math.sin(th), Math.cos(th)]; });
    hc.kanter.forEach(([i, j]) => { if (P[i][2] > -0.02 && P[j][2] > -0.02) ut += linje(P[i][0], P[i][1], P[j][0], P[j][1], INK, 1.6); });
    ut += `  <ellipse cx="${r2(x0 + kol * 1.5 * a - a * 0.5)}" cy="${cy}" rx="${r2(Rr * 0.28)}" ry="${r2(Rr)}" fill="none" stroke="${INK}" stroke-width="1.8"/>\n`;
    ut += `  <ellipse cx="${r2(x0 - a * 0.5)}" cy="${cy}" rx="${r2(Rr * 0.28)}" ry="${r2(Rr)}" fill="none" stroke="${INK}" stroke-width="1.2" stroke-dasharray="3 3"/>\n`;
    ut += txt(cx, 312, 'nanorör', 'font-size="15" font-style="italic"');
  }
  // grafen: honeycomb-ark i sned projektion, uppböjt i övre högra hörnet
  {
    const a = 12, hc = honeycomb(a, 9, 4);
    const cx = K * 2.5, cy = 150, x0 = cx - 95, y0 = cy - 20;
    const P = hc.horn.map(([x, y]) => { const lyft = Math.max(0, x - 6 * 1.5 * a) * Math.max(0, (1.5 * Math.sqrt(3) * a - y)) * 0.012; return [x0 + x + y * 0.5, y0 + y * 0.45 - lyft]; });
    hc.kanter.forEach(([i, j]) => { ut += linje(P[i][0], P[i][1], P[j][0], P[j][1], INK, 1.6); });
    ut += linje(cx + 30, cy + 66, cx + 30, cy + 40, INK, 1) + txt(cx + 30, cy + 84, 'ett atomlager tjockt', 'font-size="13" font-style="italic"');
    ut += txt(cx, 312, 'grafen', 'font-size="15" font-style="italic"');
  }
  skriv('k1-a7.svg', W, HH, 'Tre former av kol. En klotformad bur av fem- och sexkanter märkt C60, ett rör av sexkantigt nät, och ett plant ark av sexkanter märkt ett atomlager tjockt', ut);
}

// ---------- A8. Fotosyntesen ----------
{
  const W = 800, HH = 420;
  let ut = '';
  // markfält
  ut += `  <rect x="430" y="330" width="330" height="60" rx="6" fill="${GRA}" fill-opacity="0.35" stroke="${GRA}" stroke-width="1"/>\n` + txt(700, 372, 'mark', 'font-size="14" font-style="italic"');
  // stam och blad i genomskärning
  ut += `  <path d="M600 330 V240" stroke="${SIGN}" stroke-width="10" stroke-linecap="round" fill="none"/>\n`;
  ut += `  <path d="M600 240 C560 240 470 220 450 160 C520 130 640 130 720 175 C700 225 640 245 600 240Z" fill="${SIGN}" fill-opacity="0.22" stroke="${SIGN}" stroke-width="3"/>\n`;
  ut += `  <path d="M470 175 C540 165 640 170 700 185" stroke="${SIGN}" stroke-width="1.5" fill="none" stroke-dasharray="4 4"/>\n`;
  // glukosruta inne i bladet med sex kolprickar
  ut += `  <rect x="530" y="176" width="130" height="46" rx="6" fill="${VATE}" stroke="${INK}" stroke-width="1.5"/>\n` + txt(595, 196, formel('C₆H₁₂O₆'), 'font-size="17" font-weight="bold"');
  for (let i = 0; i < 6; i++) ut += `  <circle cx="${548 + i * 19}" cy="211" r="4" fill="${KOL}"/>\n`;
  // pil in: 6 CO2 från luften (vänster) med sex prickar
  ut += bredPil(120, 160, 445, 160, 26, VATSKA, 6) + txt(80, 166, formel('6 CO₂'), 'font-size="18" font-weight="bold"') + txt(200, 138, 'från luften', 'font-size="13" font-style="italic"');
  // pil in: 6 H2O från marken upp genom stammen
  ut += bredPil(560, 340, 560, 252, 22, VATSKA) + txt(500, 300, formel('6 H₂O'), 'font-size="18" font-weight="bold"') + txt(500, 320, 'från marken', 'font-size="13" font-style="italic"');
  // ljusenergi uppifrån
  ut += bredPil(540, 40, 540, 122, 26, GUL) + txt(540, 28, 'ljusenergi', 'font-size="16" font-weight="bold"');
  // pil ut: 6 O2
  ut += bredPil(700, 150, 760, 90, 22, VATE) + txt(760, 74, formel('6 O₂'), 'font-size="18" font-weight="bold"');
  ut += txt(W / 2, HH - 12, '6 kolatomer in → 6 kolatomer i glukosen.', 'font-size="17" font-weight="bold"');
  skriv('k1-a8.svg', W, HH, 'Ett blad som tar upp koldioxid från luften och vatten från marken, med ljusenergi uppifrån. Ut går syrgas. Inuti bladet bildas glukos. Sex kolatomer följs från koldioxiden in i glukosen', ut);
}

// ---------- A9. Cellandningen – spegelvänd A8 ----------
{
  const W = 800, HH = 420;
  let ut = '';
  // cell i mitten (oregelbunden blob) med kärna
  ut += `  <path d="M400 110 C470 100 520 150 515 210 C510 270 460 300 400 295 C340 290 285 250 290 200 C295 150 335 118 400 110Z" fill="${SIGN}" fill-opacity="0.18" stroke="${SIGN}" stroke-width="3"/>\n`;
  ut += `  <circle cx="420" cy="215" r="22" fill="${SIGN}" fill-opacity="0.35" stroke="${SIGN}" stroke-width="2"/>\n` + txt(400, 135, 'cell', 'font-size="15" font-style="italic"');
  // in: glukosruta med sex prickar + pil in
  ut += `  <rect x="40" y="136" width="130" height="46" rx="6" fill="${VATE}" stroke="${INK}" stroke-width="1.5"/>\n` + txt(105, 156, formel('C₆H₁₂O₆'), 'font-size="17" font-weight="bold"');
  for (let i = 0; i < 6; i++) ut += `  <circle cx="${58 + i * 19}" cy="171" r="4" fill="${KOL}"/>\n`;
  ut += bredPil(178, 160, 300, 160, 26, VATSKA, 6);
  ut += bredPil(120, 240, 300, 240, 22, VATE) + txt(80, 246, formel('6 O₂'), 'font-size="18" font-weight="bold"');
  // ut: 6 CO2 med sex prickar, 6 H2O, energi (gul)
  ut += bredPil(510, 160, 690, 160, 26, VATSKA, 6) + txt(735, 166, formel('6 CO₂'), 'font-size="18" font-weight="bold"');
  ut += bredPil(510, 240, 690, 240, 22, VATSKA) + txt(735, 246, formel('6 H₂O'), 'font-size="18" font-weight="bold"');
  ut += bredPil(460, 292, 540, 372, 26, GUL) + txt(600, 380, 'energi', 'font-size="16" font-weight="bold" text-anchor="start"');
  skriv('k1-a9.svg', W, HH, 'En cell som tar in glukos och syrgas. Ut går koldioxid, vatten och energi. Sex kolatomer följs från glukosen till koldioxiden', ut);
}

// ---------- A10. Kolets snabba kretslopp – grundfigur med stabila id:n ----------
{
  const W = 800, HH = 520;
  let ut = '';
  ut += `  <g id="atmosfar">\n  <rect x="200" y="24" width="400" height="64" rx="12" fill="${VATSKA}" stroke="${INK}" stroke-width="1.5"/>\n` + txt(400, 52, 'atmosfären', 'font-size="18" font-weight="bold"') + txt(400, 74, 'koldioxid', 'font-size="14" font-style="italic"') + '  </g>\n';
  // växt (vänster)
  ut += `  <g id="vaxt">\n  <path d="M150 330 V230" stroke="${SIGN}" stroke-width="6" stroke-linecap="round" fill="none"/>\n  <path d="M150 280 C110 270 95 240 100 215 C130 220 150 245 150 280Z" fill="${SIGN}" fill-opacity="0.35" stroke="${SIGN}" stroke-width="2.5"/>\n  <path d="M150 255 C190 245 205 215 200 190 C170 195 150 220 150 255Z" fill="${SIGN}" fill-opacity="0.35" stroke="${SIGN}" stroke-width="2.5"/>\n` + txt(150, 356, 'växt', 'font-size="16" font-weight="bold"') + '  </g>\n';
  // djur (höger): enkel siluett
  ut += `  <g id="djur">\n  <ellipse cx="640" cy="270" rx="58" ry="30" fill="${INK}"/>\n  <circle cx="700" cy="245" r="18" fill="${INK}"/>\n  <path d="M598 292 V330 M626 296 V330 M654 296 V330 M682 292 V330" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>\n  <path d="M582 262 C560 255 555 275 575 285" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>\n` + txt(650, 356, 'djur', 'font-size="16" font-weight="bold"') + '  </g>\n';
  // mark med nedbrytarruta
  ut += `  <g id="mark">\n  <rect x="200" y="410" width="400" height="70" rx="8" fill="${GRA}" fill-opacity="0.35" stroke="${GRA}" stroke-width="1"/>\n  <rect x="300" y="422" width="200" height="46" rx="6" fill="${VATE}" stroke="${INK}" stroke-width="1.5"/>\n` + txt(400, 441, 'nedbrytare', 'font-size="15" font-weight="bold"') + txt(400, 460, 'svamp och bakterier', 'font-size="13" font-style="italic"') + '  </g>\n';
  // pilar
  ut += '  <g id="pilar">\n';
  ut += pil(250, 88, 165, 205, SIGN, 3) + txt(170, 140, 'fotosyntes', 'font-size="14" font-style="italic" text-anchor="end"');
  ut += pil(215, 300, 570, 300, SIGN, 3) + txt(392, 292, 'näringskedja', 'font-size="14" font-style="italic"');
  ut += pil(215, 220, 300, 92, SIGN, 3) + txt(300, 150, 'cellandning', 'font-size="14" font-style="italic" text-anchor="start"');
  ut += pil(620, 232, 520, 92, SIGN, 3) + txt(590, 150, 'cellandning', 'font-size="14" font-style="italic" text-anchor="start"');
  ut += pil(180, 340, 300, 425, SIGN, 3) + pil(620, 340, 500, 425, SIGN, 3);
  ut += pil(400, 410, 400, 92, SIGN, 3, 'stroke-dasharray="none"') + txt(414, 380, 'nedbrytning', 'font-size="14" font-style="italic" text-anchor="start"');
  ut += '  </g>\n';
  // blek streckad pil ut ur cirkeln, nedre högra kanten – utan etikett
  ut += `  <g id="utpil">\n` + pil(640, 445, 740, 500, SIGN, 3, 'stroke-dasharray="6 6" opacity="0.45"') + '  </g>\n';
  ut += `  <g id="geologisk-slinga"><!-- reserverad: delkapitel 3 lägger sin del här, i utrymmet nere till höger --></g>\n`;
  skriv('k1-a10.svg', W, HH, 'En sluten cirkel där kol går från atmosfären till växter genom fotosyntes, vidare till djur genom näringskedjan, och tillbaka till atmosfären genom cellandning och nedbrytning. En blek streckad pil pekar ut ur cirkeln', ut);
}

console.log(`skrev ${antal} svg → ${path.relative(path.join(__dirname, '..'), UT)}`);
