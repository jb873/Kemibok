// bilder-svg-alkoholer.js – de nio SVG-bilderna till Organisk kemi 4 "Alkoholer" (arbetsorder 2026-09-18; specar i
// doc/leveranser/alkoholer/original/dk4-omskrivet-och-bildspecar.md). Skriver till kapitel/organisk-kemi/delkapitel/alkoholer/img/.
// Kör: node verktyg/bilder-svg-alkoholer.js
//
//   k4-k1  Metan blir metanol        1.1   k4-k4  Kokpunkt: alkan mot alkohol   1.3   k4-k7  Etanolens två ändar        2.3
//   k4-k2  Alkaner och alkoholer     1.2   k4-k5  Metanol → myrsyra             2.1   k4-k8  Glykol och iskristallen    3.1
//   k4-k3  Tre sätt att skriva etanol 1.2  k4-k6  Jäsningen                     2.2   k4-k9  Etanol, glykol, glycerol   3.3
//
// Palett: konturer/text #2d4a35, signaturfärg #5a9668, kol #3a3a3a, syre #C0392B, väte #f5f0e4, vätska #a8c4d8, grått #8A8A8A,
// energi #e8c547. Bokstavsstil (KOMPONENTER 9.5). Genomgående: syreatomen (och OH i formler) i #C0392B – kontrolleras sist.
'use strict';
const fs = require('fs'), path = require('path');
const ROT = path.join(__dirname, '..');
const UT = path.join(ROT, 'kapitel', 'organisk-kemi', 'delkapitel', 'alkoholer', 'img');
fs.mkdirSync(UT, { recursive: true });
const INK = '#2d4a35', SIGN = '#5a9668', KOL = '#3a3a3a', SYRE = '#C0392B', VATE = '#f5f0e4', VATSKA = '#a8c4d8', GRA = '#8A8A8A', GUL = '#e8c547';
const FONT = `font-family="Georgia, 'Times New Roman', serif"`;
const r2 = x => Math.round(x * 100) / 100;
const svg = (w, h, titel, inneh) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-labelledby="t">
  <title id="t">${titel}</title>
${inneh}</svg>
`;
const txt = (x, y, t, extra = '') => `  <text x="${r2(x)}" y="${r2(y)}" ${/fill=/.test(extra) ? '' : `fill="${INK}"`} ${/font-size=/.test(extra) ? '' : 'font-size="16"'} ${/text-anchor=/.test(extra) ? '' : 'text-anchor="middle"'} ${FONT} ${extra}>${t}</text>\n`;
const SUBT = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
const sub = s => s.replace(/([₀-₉]+)([^₀-₉]*)/g, (_, ix, rest) => `<tspan font-size="0.7em" dy="0.3em">${[...ix].map(c => SUBT[c]).join('')}</tspan>` + (rest ? `<tspan dy="-0.3em">${rest}</tspan>` : ''));
// formel med OH-delen i syrefärg: "C₂H₅OH" → …<tspan fill=SYRE>OH</tspan>
const formelOH = s => { const i = s.lastIndexOf('OH'); return i < 0 ? sub(s) : sub(s.slice(0, i)) + `<tspan fill="${SYRE}" data-oh="1">OH</tspan>` + sub(s.slice(i + 2)); };
const linje = (x1, y1, x2, y2, farg = INK, bredd = 2, extra = '') => `  <line x1="${r2(x1)}" y1="${r2(y1)}" x2="${r2(x2)}" y2="${r2(y2)}" stroke="${farg}" stroke-width="${bredd}" stroke-linecap="round" ${extra}/>\n`;
const cirkel = (x, y, r, fyll, kontur = INK, bredd = 1.2, extra = '') => `  <circle cx="${r2(x)}" cy="${r2(y)}" r="${r}" fill="${fyll}" stroke="${kontur}" stroke-width="${bredd}" ${extra}/>\n`;
const rekt = (x, y, w, h, fyll, extra = '') => `  <rect x="${r2(x)}" y="${r2(y)}" width="${r2(w)}" height="${r2(h)}" fill="${fyll}" ${extra}/>\n`;
const pil = (x1, y1, x2, y2, farg = INK, bredd = 2.5, extra = '') => {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, s = bredd * 4, bx = x2 - ux * s, by = y2 - uy * s;
  return `  <line x1="${r2(x1)}" y1="${r2(y1)}" x2="${r2(bx)}" y2="${r2(by)}" stroke="${farg}" stroke-width="${bredd}" stroke-linecap="round" ${extra}/>
  <polygon points="${r2(x2)},${r2(y2)} ${r2(bx - uy * s * 0.5)},${r2(by + ux * s * 0.5)} ${r2(bx + uy * s * 0.5)},${r2(by - ux * s * 0.5)}" fill="${farg}" ${extra}/>\n`;
};
let antal = 0;
const skriv = (fil, w, h, titel, inneh) => { fs.writeFileSync(path.join(UT, fil), svg(w, h, titel, inneh)); antal++; };

// ---------- bokstavsstil: molekyl som data (atomer {t, x, y}, bindningar {a, b, n}) – DX 46, teckengrad 19 som Kolväten ----------
const DX = 46, DY = 34, FS = 19, GAP = 7.2;
function molekyl() {
  const m = { atomer: [], bind: [] };
  m.atom = (t, x, y, extra = {}) => { m.atomer.push(Object.assign({ t, x, y }, extra)); return m.atomer.length - 1; };
  m.bond = (a, b, n = 1, extra = {}) => { m.bind.push(Object.assign({ a, b, n }, extra)); return m; };
  return m;
}
// rak kedja: n kolatomer i rad (x0 + i·DX), returnerar index på kolatomerna
function kedja(m, n, x0, y) { const ix = []; for (let i = 0; i < n; i++) { ix.push(m.atom('C', x0 + i * DX, y)); if (i) m.bond(ix[i - 1], ix[i]); } return ix; }
const H = (m, c, dx, dy, extra) => { const a = m.atomer[c]; const i = m.atom('H', a.x + dx, a.y + dy, extra); m.bond(c, i, 1, extra); return i; };
// OH-grupp på kolatom c i riktning (dx, dy): syreatom + väte vidare i samma riktning
const OH = (m, c, dx, dy, extra = {}) => { const a = m.atomer[c]; const o = m.atom('O', a.x + dx, a.y + dy, extra); m.bond(c, o, 1, extra); const h = m.atom('H', a.x + 2 * dx, a.y + 2 * dy, extra); m.bond(o, h, 1, extra); return [o, h]; };
function rita(m, o = {}) {
  const tag = o.tag || '', fs_ = o.fontsize || FS, farg = t => t === 'O' ? SYRE : INK;
  let s = '';
  for (const b of m.bind) {
    const A = m.atomer[b.a], B = m.atomer[b.b], dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
    const kA = A.t === 'H' ? 9 : 13, kB = B.t === 'H' ? 9 : 13;
    for (let j = 0; j < b.n; j++) { const o2 = (j - (b.n - 1) / 2) * GAP; s += linje(A.x + ux * kA + nx * o2, A.y + uy * kA + ny * o2, B.x - ux * kB + nx * o2, B.y - uy * kB + ny * o2, b.farg || INK, 2.2, `data-bind="${A.t}-${B.t}" ${b.mark ? 'data-mark="1"' : ''} ${tag}`); }
  }
  for (const a of m.atomer) { s += txt(a.x, a.y + fs_ * 0.35, a.t, `font-size="${a.t === 'H' ? fs_ * 0.86 : fs_}" fill="${a.farg || farg(a.t)}" ${a.t !== 'H' ? 'font-weight="bold"' : ''} data-atom="${a.t}" ${a.mark ? 'data-mark="1"' : ''} ${tag}`); }
  return s;
}
// standardmolekyler
function etanol(x0, y) { const m = molekyl(); const [c1, c2] = kedja(m, 2, x0, y); H(m, c1, 0, -DY); H(m, c1, 0, DY); H(m, c1, -DX, 0); H(m, c2, 0, -DY); H(m, c2, 0, DY); OH(m, c2, DX, 0); return m; }
function glykol(x0, y) { const m = molekyl(); const [c1, c2] = kedja(m, 2, x0, y); H(m, c1, 0, -DY); H(m, c1, 0, DY); OH(m, c1, -DX, 0); H(m, c2, 0, -DY); H(m, c2, 0, DY); OH(m, c2, DX, 0); return m; }
function glycerol(x0, y) { const m = molekyl(); const [c1, c2, c3] = kedja(m, 3, x0, y); H(m, c1, 0, -DY); H(m, c1, 0, DY); OH(m, c1, -DX, 0); H(m, c2, 0, DY); OH(m, c2, 0, -DY); H(m, c3, 0, -DY); H(m, c3, 0, DY); OH(m, c3, DX, 0); return m; }
function metanol(x0, y) { const m = molekyl(); const c = m.atom('C', x0, y); H(m, c, 0, DY); H(m, c, -DX, 0); H(m, c, DX, 0); OH(m, c, 0, -DY); return m; }
const ring = (x, y, r, tag = '') => cirkel(x, y, r, 'none', SIGN, 1.4, `data-ring="1" ${tag}`);

// ---------- K1. Metan blir metanol (1.1) ----------
{
  const W = 760, HH = 300, y = 150;
  let ut = '';
  const m1 = molekyl(); const c = m1.atom('C', 170, y); H(m1, c, 0, DY); H(m1, c, -DX, 0); H(m1, c, DX, 0); H(m1, c, 0, -DY, { farg: SIGN, mark: true });
  ut += rita(m1, { tag: 'data-molekyl="metan"' }) + ring(170, y - DY, 15, 'data-molekyl="metan"');
  ut += txt(170, 232, 'metan, ' + sub('CH₄'), 'font-size="17" font-weight="bold"');
  ut += pil(300, y, 420, y, INK, 2.5) + txt(360, y - 14, 'en väteatom byts ut', 'font-size="13" font-style="italic"');
  const m2 = metanol(560, y);
  ut += rita(m2, { tag: 'data-molekyl="metanol"' }) + `  <ellipse cx="560" cy="${y - 1.5 * DY}" rx="26" ry="40" fill="none" stroke="${SIGN}" stroke-width="1.4" data-ring="1" data-molekyl="metanol"/>\n`;
  ut += txt(560, 232, 'metanol, ' + formelOH('CH₃OH'), 'font-size="17" font-weight="bold"');
  ut += txt(W / 2, HH - 16, 'hydroxylgruppen sitter där en väteatom suttit', 'font-size="15" font-style="italic"');
  skriv('k4-k1.svg', W, HH, 'Till vänster metan med fyra väteatomer, varav en är markerad. Till höger metanol, där den markerade väteatomen ersatts av en OH-grupp med syreatomen i rött', ut);
}

// ---------- K2. Alkanerna och alkoholerna sida vid sida (1.2) ----------
{
  const KOLX = [0, 150, 300, 470, 640], W = KOLX[4], RH = 44, TOP = 46, HH = TOP + 4 * RH + 44;
  const mitt = i => (KOLX[i] + KOLX[i + 1]) / 2;
  let ut = '';
  ['Alkan', 'Formel', 'Alkohol', 'Formel'].forEach((t, i) => { ut += txt(mitt(i), 28, t, `font-size="14" font-style="italic" fill="${SIGN}"`); });
  ut += linje(16, TOP - 8, W - 16, TOP - 8, INK, 1.4) + linje(KOLX[2], TOP - 10, KOLX[2], TOP + 4 * RH + 2, SIGN, 1.6, 'data-skiljelinje="1"');
  const rader = [['metan', 'CH₄', 'metanol', 'CH₃OH'], ['etan', 'C₂H₆', 'etanol', 'C₂H₅OH'], ['propan', 'C₃H₈', 'propanol', 'C₃H₇OH'], ['butan', 'C₄H₁₀', 'butanol', 'C₄H₉OH']];
  rader.forEach(([alk, f1, alko, f2], r) => {
    const y = TOP + r * RH + RH / 2 + 6, tag = `data-rad="${r + 1}"`;
    ut += txt(mitt(0), y, alk, `font-size="17" ${tag} data-kolumn="alkan"`) + txt(mitt(1), y, sub(f1), `font-size="18" ${tag} data-kolumn="alkanformel"`);
    ut += txt(mitt(2), y, alko.slice(0, -2) + `<tspan fill="${SIGN}" data-ol="1">ol</tspan>`, `font-size="17" ${tag} data-kolumn="alkohol"`) + txt(mitt(3), y, formelOH(f2), `font-size="18" ${tag} data-kolumn="alkoholformel"`);
    if (r < 3) ut += linje(16, TOP + (r + 1) * RH, W - 16, TOP + (r + 1) * RH, INK, 0.8);
  });
  ut += linje(16, TOP + 4 * RH, W - 16, TOP + 4 * RH, INK, 1.4);
  ut += txt(W / 2, TOP + 4 * RH + 30, 'samma stam, ny ändelse, en OH-grupp', 'font-size="14" font-style="italic"');
  skriv('k4-k2.svg', W, HH, 'En tabell med de fyra första alkanerna till vänster och motsvarande alkoholer till höger. I alkoholnamnen är ändelsen -ol markerad och i formlerna är OH-gruppen markerad i rött', ut);
}

// ---------- K3. Tre sätt att skriva etanol (1.2) ----------
{
  const W = 780, HH = 340, K = W / 3;
  let ut = '';
  [['Molekylformel', sub('C₂H₆O'), 'räknar atomerna'], ['Kondenserad formel', formelOH('C₂H₅OH'), 'visar gruppen'], ['Utskriven formel', sub('CH₃') + '–' + sub('CH₂') + '–' + `<tspan fill="${SYRE}" data-oh="1">OH</tspan>`, 'visar ordningen']].forEach(([rub, f, under], i) => {
    const x = K * (i + 0.5);
    ut += txt(x, 34, rub, `font-size="14" font-style="italic" fill="${SIGN}"`) + txt(x, 90, f, `font-size="30" data-skrivsatt="${i + 1}"`) + txt(x, 122, under, 'font-size="13" font-style="italic"');
  });
  ut += linje(40, 150, W - 40, 150, INK, 1);
  const m = etanol(W / 2 - 1.5 * DX, 232);
  ut += rita(m, { tag: 'data-skrivsatt="4"' });
  ut += txt(W / 2, 178, 'Strukturformel', `font-size="14" font-style="italic" fill="${SIGN}"`);
  ut += txt(W / 2, 316, 'och så här ser den ut utritad – alla atomer och alla bindningar', 'font-size="13" font-style="italic"');
  skriv('k4-k3.svg', W, HH, 'Etanol visad på fyra sätt: molekylformeln C2H6O, den kondenserade formeln C2H5OH, den utskrivna formeln CH3–CH2–OH, och längst ner den fullständiga strukturformeln utritad med alla atomer', ut);
}

// ---------- K4. Kokpunkt: alkan mot alkohol (1.3) ----------
{
  const W = 820, HH = 430, Y0 = 250, SK = 0.8, X0 = 70, PAR = 140, SB = 40;   // nollinjen, px per grad
  let ut = '';
  const par = [['metan', -162, 'metanol', 65], ['etan', -89, 'etanol', 78], ['propan', -42, 'propanol', 97], ['butan', -0.5, 'butanol', 118]];
  const tal = v => String(v).replace('-', '−').replace('.', ',');
  ut += linje(40, Y0 - 20 * SK, W - 40, Y0 - 20 * SK, GRA, 1.4, 'stroke-dasharray="6 5" data-rumstemperatur="20"') + txt(W - 44, Y0 - 20 * SK - 6, 'rumstemperatur 20 °C', `font-size="12" font-style="italic" text-anchor="end" fill="${GRA}"`);
  par.forEach(([alk, t1, alko, t2], i) => {
    const x = X0 + i * PAR;
    ut += rekt(x, Y0, SB, -t1 * SK, GRA, `data-alkan="${alk}" data-kp="${t1}"`) + txt(x + SB / 2, Y0 - t1 * SK + 16, tal(t1), 'font-size="12"') + txt(x + SB / 2, Y0 - t1 * SK + 32, alk, 'font-size="13" font-weight="bold"');
    ut += rekt(x + SB + 8, Y0 - t2 * SK, SB, t2 * SK, SIGN, `data-alkohol="${alko}" data-kp="${t2}"`) + txt(x + SB + 8 + SB / 2, Y0 - t2 * SK - 8, tal(t2), 'font-size="12"') + txt(x + SB + 8 + SB / 2, Y0 - t2 * SK - 24, alko, 'font-size="13" font-weight="bold"');
  });
  ut += linje(40, Y0, W - 40, Y0, INK, 2.2, 'data-nollinje="1"') + txt(44, Y0 - 6, '0 °C', 'font-size="12" text-anchor="start"');
  ut += txt(W / 2, HH - 12, 'kokpunkt: alkan (grå) och alkohol (grön) med lika många kolatomer', 'font-size="13" font-style="italic"');
  skriv('k4-k4.svg', W, HH, 'Fyra stapelpar som jämför kokpunkten hos en alkan och motsvarande alkohol. Alla alkaner ligger under noll grader, alla alkoholer långt över', ut);
}

// ---------- K5. Metanol bryts ner till myrsyra (2.1) ----------
{
  const W = 820, HH = 300, y = 130;
  let ut = '';
  ut += rita(metanol(120, y), { tag: 'data-molekyl="metanol"' }) + txt(120, 232, 'metanol, ' + formelOH('CH₃OH'), 'font-size="15" font-weight="bold"');
  ut += pil(215, y, 300, y, INK, 2.5) + txt(257, y - 14, 'i levern', 'font-size="13" font-style="italic"');
  // myrsyra HCOOH: H–C(=O)–O–H
  const m = molekyl(); const c = m.atom('C', 400, y); H(m, c, -DX, 0); const o1 = m.atom('O', 400, y - DY); m.bond(c, o1, 2); const o2 = m.atom('O', 400 + DX, y); m.bond(c, o2); const h = m.atom('H', 400 + 2 * DX, y); m.bond(o2, h);
  ut += rita(m, { tag: 'data-molekyl="myrsyra"' }) + txt(420, 232, 'myrsyra, HCOOH', 'font-size="15" font-weight="bold"');
  ut += pil(520, y, 600, y, INK, 2.5) + txt(560, y - 14, 'angriper', 'font-size="13" font-style="italic"');
  // öga med synnerv i signaturfärg
  ut += `  <path d="M640 ${y} Q700 ${y - 46} 760 ${y} Q700 ${y + 46} 640 ${y} Z" fill="${VATE}" stroke="${INK}" stroke-width="2" data-del="oga"/>\n` + cirkel(700, y, 17, VATSKA, INK, 1.6) + cirkel(700, y, 8, KOL, 'none', 0);
  ut += `  <path d="M760 ${y} q20 8 34 30" fill="none" stroke="${SIGN}" stroke-width="5" stroke-linecap="round" data-del="synnerv"/>\n`;
  ut += txt(700, 232, 'synnerven och näthinnan', 'font-size="15" font-weight="bold"');
  ut += txt(W / 2, HH - 14, 'metanol och etanol går inte att skilja åt med lukt eller syn', `font-size="14" font-style="italic" fill="${SYRE}"`);
  skriv('k4-k5.svg', W, HH, 'Tre steg. Metanolmolekylen, en pil märkt i levern, myrsyramolekylen, och sist ett öga där synnerven är markerad', ut);
}

// ---------- K6. Jäsningen (2.2) ----------
{
  const W = 800, HH = 340, R = 5, AV = 16;
  let ut = '';
  const prickar = (x, y, n, tag) => { let s = ''; for (let i = 0; i < n; i++) s += cirkel(x + i * AV, y, R, KOL, 'none', 0, `data-kol="${tag}"`); return s; };
  // glukos in
  ut += rekt(40, 120, 150, 60, 'none', `rx="6" stroke="${INK}" stroke-width="1.3"`) + txt(115, 143, sub('C₆H₁₂O₆'), 'font-size="17" font-weight="bold"') + prickar(115 - 2.5 * AV, 166, 6, 'in');
  ut += txt(115, 108, 'glukos', 'font-size="13" font-style="italic"') + pil(196, 150, 290, 150, INK, 2.5);
  // jästcell
  ut += `  <ellipse cx="400" cy="150" rx="100" ry="70" fill="${SIGN}" fill-opacity="0.15" stroke="${SIGN}" stroke-width="2.4" data-del="cell"/>\n` + txt(400, 146, 'jästcell', 'font-size="16" font-weight="bold"') + txt(400, 168, 'utan syre', 'font-size="13" font-style="italic"');
  // ut: etanol (4 prickar), koldioxid (2), energi
  ut += pil(505, 118, 590, 80, INK, 2.5) + rekt(600, 50, 170, 60, 'none', `rx="6" stroke="${INK}" stroke-width="1.3"`) + txt(685, 73, '2 ' + formelOH('C₂H₅OH'), 'font-size="17" font-weight="bold"') + prickar(685 - 1.5 * AV, 96, 4, 'ut-etanol');
  ut += pil(505, 160, 590, 175, INK, 2.5) + rekt(600, 145, 170, 60, 'none', `rx="6" stroke="${INK}" stroke-width="1.3"`) + txt(685, 168, '2 ' + sub('CO₂'), 'font-size="17" font-weight="bold"') + prickar(685 - 0.5 * AV, 191, 2, 'ut-co2');
  ut += pil(490, 200, 585, 250, GUL, 3) + txt(605, 258, 'energi', `font-size="15" font-weight="bold" fill="${GUL}" text-anchor="start"`);
  ut += txt(W / 2, HH - 14, '6 kolatomer in → 4 + 2 kolatomer ut', 'font-size="15" font-weight="bold"');
  skriv('k4-k6.svg', W, HH, 'En jästcell som tar in en glukosmolekyl och avger två etanolmolekyler, två koldioxidmolekyler och energi. Sex kolatomer följs som mörka prickar från glukosen till produkterna', ut);
}

// ---------- K7. Etanolens två ändar (2.3) ----------
{
  const W = 760, HH = 330, y = 150, x0 = 250;
  let ut = '';
  const DEL = x0 + DX + 23;   // mellan andra kolatomen och syreatomen
  ut += rekt(80, 60, DEL - 80, 180, GRA, 'fill-opacity="0.18" rx="8" data-falt="kolvate"') + rekt(DEL, 60, 260, 180, VATSKA, 'fill-opacity="0.3" rx="8" data-falt="hydroxyl"');
  ut += linje(DEL, 50, DEL, 250, INK, 1.4, 'stroke-dasharray="6 4" data-skiljelinje="1"');
  ut += rita(etanol(x0, y), { tag: 'data-molekyl="etanol"' });
  // vattenmolekyler (V-former) som dras mot hydroxylgruppen
  const vatten = (x, y, v) => `  <path d="M${x - 12} ${y - 8} L${x} ${y} L${x + 12} ${y - 8}" fill="none" stroke="${VATSKA}" stroke-width="3.5" stroke-linecap="round" transform="rotate(${v} ${x} ${y})" data-vatten="1"/>\n`;
  [[440, 80, 200], [470, 200, -30], [420, 230, 40]].forEach(([x, yy, v]) => { ut += vatten(x, yy, v) + linje(x, yy, x0 + 2.4 * DX, y + (yy > y ? 10 : -10), VATSKA, 1.2, 'stroke-dasharray="3 3"'); });
  ut += txt((80 + DEL) / 2, 270, 'kolvätedel', 'font-size="15" font-weight="bold"') + txt((80 + DEL) / 2, 290, 'löser fett och opolära ämnen', 'font-size="12" font-style="italic"');
  ut += txt(DEL + 130, 270, 'hydroxylgrupp', 'font-size="15" font-weight="bold"') + txt(DEL + 130, 290, 'löser vatten och polära ämnen', 'font-size="12" font-style="italic"');
  ut += txt(W / 2, HH - 12, 'det är kombinationen som gör etanol till ett så bra lösningsmedel', 'font-size="13" font-style="italic"');
  skriv('k4-k7.svg', W, HH, 'En etanolmolekyl delad av en streckad linje. Till vänster kolvätedelen mot grått fält, till höger hydroxylgruppen mot blått fält, med vattenmolekyler som dras mot den', ut);
}

// ---------- K8. Glykol och iskristallen (3.1) ----------
{
  const W = 800, HH = 360, PB = 360;
  let ut = '';
  const vatten = (x, y, v, extra = '') => `  <path d="M${r2(x - 10)} ${r2(y - 7)} L${r2(x)} ${r2(y)} L${r2(x + 10)} ${r2(y - 7)}" fill="none" stroke="${VATSKA}" stroke-width="3.2" stroke-linecap="round" transform="rotate(${r2(v)} ${r2(x)} ${r2(y)})" data-vatten="1" ${extra}/>\n`;
  // vänster: hexagonalt gitter
  ut += rekt(20, 40, PB, 220, VATE, `rx="8" stroke="${INK}" stroke-width="1.2" data-panel="is"`);
  const a = 40; let n = 0;
  for (let rad = 0; rad < 5; rad++) for (let k = 0; k < 8; k++) { const x = 50 + k * a + (rad % 2 ? a / 2 : 0), y = 70 + rad * a * 0.866; if (x < 20 + PB - 20) { ut += vatten(x, y, (rad + k) % 2 ? 180 : 0, 'data-panel="is"'); n++; } }
  ut += txt(20 + PB / 2, 286, 'is bildas vid 0 °C', 'font-size="15" font-weight="bold"') + txt(20 + PB / 2, 306, 'molekylerna kan ordna sig regelbundet', 'font-size="12" font-style="italic"');
  // höger: oordnat, tre glykolmolekyler emellan
  const X2 = 420;
  ut += rekt(X2, 40, PB, 220, VATE, `rx="8" stroke="${INK}" stroke-width="1.2" data-panel="glykol"`);
  const slump = [[448, 70, 20], [500, 68, 200], [560, 62, 300], [620, 84, 140], [700, 66, 40], [750, 100, 250], [445, 150, 110], [640, 172, 330], [740, 172, 70], [470, 236, 160], [530, 240, 20], [660, 240, 280], [740, 226, 190], [452, 200, 15], [510, 170, 95]];
  slump.forEach(([x, y, v]) => { ut += vatten(x, y, v, 'data-panel="glykol"'); });
  const g = (x0, y) => { const m = glykol(x0, y); return `  <g transform="translate(${x0} ${y}) scale(0.55) translate(${-x0} ${-y})">\n${rita(m, { tag: 'data-glykol="1"' })}  </g>\n`; };
  ut += g(510, 118) + g(680, 130) + g(590, 204);
  ut += txt(X2 + PB / 2, 286, 'fryser först långt under 0 °C', 'font-size="15" font-weight="bold"') + txt(X2 + PB / 2, 306, 'glykolen kommer i vägen', 'font-size="12" font-style="italic"');
  ut += txt(W / 2, HH - 14, 'fryspunktsnedsättning', 'font-size="16" font-weight="bold"');
  skriv('k4-k8.svg', W, HH, 'Till vänster vattenmolekyler ordnade i ett regelbundet mönster som bildar is. Till höger samma molekyler med glykolmolekyler emellan, så att mönstret bryts', ut);
}

// ---------- K9. Etanol, glykol och glycerol (3.3) ----------
{
  const W = 940, HH = 400, y = 150, K = W / 3;
  let ut = '';
  const mols = [['etanol', etanol(K * 0.5 - DX, y), sub('CH₃') + '–' + sub('CH₂') + `–<tspan fill="${SYRE}">OH</tspan>`, 1, '78 °C'], ['glykol', glykol(K * 1.5 - 0.5 * DX, y), `<tspan fill="${SYRE}">HO</tspan>–` + sub('CH₂') + '–' + sub('CH₂') + `–<tspan fill="${SYRE}">OH</tspan>`, 2, '197 °C'], ['glycerol', glycerol(K * 2.5 - DX, y), `<tspan fill="${SYRE}">HO</tspan>–` + sub('CH₂') + `–CH(<tspan fill="${SYRE}">OH</tspan>)–` + sub('CH₂') + `–<tspan fill="${SYRE}">OH</tspan>`, 3, '290 °C']];
  mols.forEach(([namn, m, f, oh, kp], i) => {
    const tag = `data-molekyl="${namn}"`;
    ut += rita(m, { tag });
    // ring runt varje OH-grupp (syre + dess väte)
    m.atomer.forEach((a, ix) => { if (a.t === 'O') { const h = m.bind.find(b => b.a === ix && m.atomer[b.b].t === 'H'); const hb = m.atomer[h.b]; ut += `  <ellipse cx="${r2((a.x + hb.x) / 2)}" cy="${r2((a.y + hb.y) / 2)}" rx="${Math.abs(hb.x - a.x) > 0 ? 40 : 18}" ry="${Math.abs(hb.y - a.y) > 0 ? 36 : 16}" fill="none" stroke="${SIGN}" stroke-width="1.4" data-ring="1" ${tag}/>\n`; } });
    ut += txt(K * (i + 0.5), 262, f, `font-size="16" data-formel="${namn}"`);
    ut += txt(K * (i + 0.5), 296, namn, 'font-size="17" font-weight="bold"') + txt(K * (i + 0.5), 326, `${oh} OH-grupp${oh > 1 ? 'er' : ''}`, `font-size="14" data-antal-oh="${oh}"`) + txt(K * (i + 0.5), 350, 'kokpunkt ' + kp, 'font-size="14" font-style="italic"');
  });
  ut += txt(W / 2, HH - 14, 'fler OH-grupper, högre kokpunkt', 'font-size="14" font-style="italic"');
  skriv('k4-k9.svg', W, HH, 'Tre alkoholer i rad – etanol med en OH-grupp, glykol med två och glycerol med tre. Under varje står den skrivna formeln, antalet OH-grupper och kokpunkten', ut);
}

// ================= KONTROLLER =================
const las = f => fs.readFileSync(path.join(UT, f), 'utf8');
const element = (s, filter) => [...s.matchAll(/<(text|circle|line|rect|path|ellipse|polygon|tspan)\b([^>]*)>/g)].map(m => { const at = { _tag: m[1] }; for (const a of m[2].matchAll(/([a-z0-9-]+)="([^"]*)"/g)) at[a[1]] = a[2]; return at; }).filter(filter);
const rapport = []; function kolla(n, ok, t) { rapport.push(`${ok ? 'OK ' : 'FEL'} ${n}: ${t}`); if (!ok) process.exitCode = 1; }
const antalAtom = (els, t) => els.filter(e => e['data-atom'] === t).length;
// bindningar per kolatom ur datan (samma data som ritats)
const perC = m => m.atomer.map((a, i) => a.t === 'C' ? m.bind.filter(b => b.a === i || b.b === i).reduce((s, b) => s + b.n, 0) : null).filter(x => x !== null);
const perO = m => m.atomer.map((a, i) => a.t === 'O' ? m.bind.filter(b => b.a === i || b.b === i).reduce((s, b) => s + b.n, 0) : null).filter(x => x !== null);
const rakna = m => ({ C: m.atomer.filter(a => a.t === 'C').length, H: m.atomer.filter(a => a.t === 'H').length, O: m.atomer.filter(a => a.t === 'O').length });
{ // syre rött i alla nio
  for (let i = 1; i <= 9; i++) { const s = las(`k4-k${i}.svg`); const o = element(s, e => e['data-atom'] === 'O' || e['data-oh'] === '1' || (e._tag === 'tspan' && /^(OH|HO)$/.test('')));
    const roda = element(s, e => (e['data-atom'] === 'O' || e['data-oh'] === '1') && e.fill === SYRE).length, alla = element(s, e => e['data-atom'] === 'O' || e['data-oh'] === '1').length;
    const tsp = (s.match(/<tspan fill="#C0392B"[^>]*>(OH|HO)<\/tspan>/g) || []).length;
    kolla(`K${i} syre i #C0392B`, alla === roda, `${roda} av ${alla} syreatomer/OH-markeringar röda${tsp ? `, ${tsp} OH/HO-tspan i rött` : ''}`); }
}
{ // K1
  const s = las('k4-k1.svg'); const me = element(s, e => e['data-molekyl'] === 'metan'), mo = element(s, e => e['data-molekyl'] === 'metanol');
  kolla('K1 metan', antalAtom(me, 'C') === 1 && antalAtom(me, 'H') === 4, `${antalAtom(me, 'C')} C + ${antalAtom(me, 'H')} H`);
  kolla('K1 metanol', antalAtom(mo, 'C') === 1 && antalAtom(mo, 'H') === 4 && antalAtom(mo, 'O') === 1, `${antalAtom(mo, 'C')} C + ${antalAtom(mo, 'H')} H + ${antalAtom(mo, 'O')} O`);
  const mH = me.find(e => e['data-mark'] === '1' && e['data-atom'] === 'H'), mO = mo.find(e => e['data-atom'] === 'O'), cMe = me.find(e => e['data-atom'] === 'C'), cMo = mo.find(e => e['data-atom'] === 'C');
  kolla('K1 samma plats', +mH.y - +cMe.y === +mO.y - +cMo.y && +mH.x - +cMe.x === +mO.x - +cMo.x, `markerat väte och syreatom sitter båda ${+cMe.y - +mH.y} px rakt ovanför kolatomen`);
  kolla('K1 fyra streck', perC(metanol(0, 0)).every(x => x === 4), 'metanol: kolatomen 4 bindningar (data)');
}
{ // K2
  const s = las('k4-k2.svg');
  const f = k => [1, 2, 3, 4].map(r => (s.match(new RegExp(`data-rad="${r}" data-kolumn="${k}"[^>]*>(.*?)</text>`)) || [])[1].replace(/<[^>]+>/g, ''));
  kolla('K2 formler', f('alkanformel').join(' ') === 'CH4 C2H6 C3H8 C4H10' && f('alkoholformel').join(' ') === 'CH3OH C2H5OH C3H7OH C4H9OH', f('alkanformel').join(', ') + ' | ' + f('alkoholformel').join(', '));
  kolla('K2 markeringar', (s.match(/data-oh="1">OH<\/tspan>/g) || []).length === 4 && (s.match(/data-ol="1">ol<\/tspan>/g) || []).length === 4, '4 × OH i rött, 4 × -ol i signaturfärg');
}
{ // K3
  const s = las('k4-k3.svg'); const e4 = element(s, e => e['data-skrivsatt'] === '4');
  const t = k => (s.match(new RegExp(`data-skrivsatt="${k}"[^>]*>(.*?)</text>`)) || [])[1].replace(/<[^>]+>/g, '');
  const rak = txt_ => { const c = (txt_.match(/C(\d*)/g) || []).reduce((a, x) => a + (+x.slice(1) || 1), 0), h = (txt_.match(/H(\d*)/g) || []).reduce((a, x) => a + (+x.slice(1) || 1), 0), o = (txt_.match(/O(\d*)/g) || []).reduce((a, x) => a + (+x.slice(1) || 1), 0); return `${c} C, ${h} H, ${o} O`; };
  kolla('K3 fyra skrivsätt', [1, 2, 3].every(k => rak(t(k)) === '2 C, 6 H, 1 O') && antalAtom(e4, 'C') === 2 && antalAtom(e4, 'H') === 6 && antalAtom(e4, 'O') === 1, `${t(1)} → ${rak(t(1))}; ${t(2)} → ${rak(t(2))}; ${t(3)} → ${rak(t(3))}; utritad ${antalAtom(e4, 'C')} C, ${antalAtom(e4, 'H')} H, ${antalAtom(e4, 'O')} O`);
  kolla('K3 bindningar', perC(etanol(0, 0)).every(x => x === 4) && perO(etanol(0, 0)).every(x => x === 2), 'kolatomer 4 streck, syreatom 2 (data)');
}
{ // K4
  const s = las('k4-k4.svg'); const y0 = +element(s, e => e['data-nollinje'])[0].y1, rum = +element(s, e => e['data-rumstemperatur'])[0].y1;
  const al = element(s, e => e['data-alkan']), ko = element(s, e => e['data-alkohol']);
  kolla('K4 värden', al.map(e => e['data-kp']).join(',') === '-162,-89,-42,-0.5' && ko.map(e => e['data-kp']).join(',') === '65,78,97,118', `alkaner ${al.map(e => e['data-kp']).join(', ')} | alkoholer ${ko.map(e => e['data-kp']).join(', ')}`);
  kolla('K4 lägen', al.every(e => +e.y === y0 && +e.height > 0) && ko.every(e => +e.y < y0 && +e.y + +e.height === y0) && ko.every(e => +e.y < rum), 'alla alkanstaplar under nollinjen, alla alkoholstaplar över; rumstemperaturlinjen under alla alkoholstaplar');
}
{ // K5
  const s = las('k4-k5.svg'); const me = element(s, e => e['data-molekyl'] === 'metanol'), my = element(s, e => e['data-molekyl'] === 'myrsyra');
  kolla('K5 molekyler', antalAtom(me, 'C') === 1 && antalAtom(me, 'H') === 4 && antalAtom(me, 'O') === 1 && antalAtom(my, 'C') === 1 && antalAtom(my, 'H') === 2 && antalAtom(my, 'O') === 2, `metanol ${antalAtom(me, 'C')} C + ${antalAtom(me, 'H')} H + ${antalAtom(me, 'O')} O; myrsyra ${antalAtom(my, 'C')} C + ${antalAtom(my, 'H')} H + ${antalAtom(my, 'O')} O`);
  kolla('K5 fyra streck', my.filter(e => e['data-bind'] && e._tag === 'line').length === 5, `myrsyra: ${my.filter(e => e['data-bind'] && e._tag === 'line').length} streck (H–C, C=O ×2, C–O, O–H) = 4 vid kolatomen`);
}
{ // K6
  const s = las('k4-k6.svg'); const n = t => element(s, e => e['data-kol'] === t);
  const alla = [...n('in'), ...n('ut-etanol'), ...n('ut-co2')];
  kolla('K6 prickar', n('in').length === 6 && n('ut-etanol').length === 4 && n('ut-co2').length === 2 && new Set(alla.map(e => e.r)).size === 1 && new Set(alla.map(e => e.fill)).size === 1, `6 in, 4 + 2 ut; radie ${alla[0].r}, färg ${alla[0].fill} överallt`);
}
{ // K7
  const s = las('k4-k7.svg'); const e = element(s, x => x['data-molekyl'] === 'etanol');
  const del = +element(s, x => x['data-skiljelinje'])[0].x1, c2 = e.filter(x => x['data-atom'] === 'C').map(x => +x.x).sort((a, b) => a - b)[1], o = +e.find(x => x['data-atom'] === 'O').x;
  kolla('K7 etanol', antalAtom(e, 'C') === 2 && antalAtom(e, 'H') === 6 && antalAtom(e, 'O') === 1 && c2 < del && del < o, `2 C + 6 H + 1 O; skiljelinjen (x ${del}) mellan andra kolatomen (${c2}) och syreatomen (${o})`);
}
{ // K8
  const s = las('k4-k8.svg');
  const is = element(s, e => e['data-panel'] === 'is' && e['data-vatten']), gl = element(s, e => e['data-panel'] === 'glykol' && e['data-vatten']);
  const vink = els => els.map(e => +e.transform.match(/rotate\(([-\d.]+)/)[1]);
  const glm = element(s, e => e['data-glykol'] === '1');
  kolla('K8 mönster', new Set(vink(is)).size === 2 && new Set(vink(gl)).size >= 10, `vänster: ${is.length} molekyler i ${new Set(vink(is)).size} riktningar (gitter); höger: ${gl.length} molekyler i ${new Set(vink(gl)).size} riktningar (oordnat)`);
  kolla('K8 glykol', antalAtom(glm, 'C') === 6 && antalAtom(glm, 'H') === 18 && antalAtom(glm, 'O') === 6, `tre glykolmolekyler: ${antalAtom(glm, 'C') / 3} C, ${antalAtom(glm, 'H') / 3} H, ${antalAtom(glm, 'O') / 3} O var`);
}
{ // K9
  const s = las('k4-k9.svg');
  const M = { etanol: etanol(0, 0), glykol: glykol(0, 0), glycerol: glycerol(0, 0) };
  for (const [namn, m] of Object.entries(M)) {
    const e = element(s, x => x['data-molekyl'] === namn), r = rakna(m), ringar = e.filter(x => x['data-ring'] === '1').length;
    const vant = { etanol: '2 C + 6 H + 1 O', glykol: '2 C + 6 H + 2 O', glycerol: '3 C + 8 H + 3 O' }[namn];
    kolla(`K9 ${namn}`, `${antalAtom(e, 'C')} C + ${antalAtom(e, 'H')} H + ${antalAtom(e, 'O')} O` === vant && perC(m).every(x => x === 4) && perO(m).every(x => x === 2) && ringar === r.O, `${antalAtom(e, 'C')} C + ${antalAtom(e, 'H')} H + ${antalAtom(e, 'O')} O; kolatomer ${perC(m).join('/')} streck, syreatomer ${perO(m).join('/')}; ${ringar} ringmarkering(ar)`);
  }
}
console.log(`${antal} SVG skrivna till ${path.relative(ROT, UT)}`);
console.log(rapport.join('\n'));
