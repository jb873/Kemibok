// bilder-svg-fossila.js – de fjorton SVG-bilderna till Organisk kemi 3 "Fossila bränslen och förbränning"
// (arbetsorder 2026-09-16; specar i doc/leveranser/fossila-branslen/original/dk3-bildspecar.md). Skriver till
// kapitel/organisk-kemi/delkapitel/fossila-branslen/img/k3-{e1…j3}.svg. Kör: node verktyg/bilder-svg-fossila.js
//
//   k3-e1  Från död organism till fossilt bränsle  1.1   k3-g1  Kolserien                    3.1   k3-j1  Växthuseffekten   5.1
//   k3-e2  Det långa kretsloppet (ur k1-a10)       1.2   k3-g2  Från stenkol till järn       3.2   k3-j2  Svavlets väg      5.2
//   k3-e3  De tre fossila bränslena                1.3   (k3-g3 Torvmarken: AI-bild, nyckla-gron.js)   k3-j3  Tungmetallerna 5.3
//   k3-f1  Oljefällan                              2.1   k3-h1  Naturgasens väg              4.1
//   k3-f2  Fraktioneringstornet                    2.2   k3-h2  Tre bränslen, tre resultat   4.2
//   k3-f3  Krackning                               2.3   k3-h3  Fullständig/ofullständig     4.3
//
// Palett enligt specen: konturer/text #2d4a35, signaturfärg #5a9668, kol #3a3a3a, syre #C0392B, väte #f5f0e4 med kontur,
// kväve #3D6BA8, ljusblå vätska #a8c4d8, grått #8A8A8A, energi och ljus #e8c547. Papper ritas inte (transparent).
// Molekyler i bokstavsstil (KOMPONENTER 9.5). Kontrollerna i specen körs sist mot de skrivna filerna (data-attribut).
'use strict';
const fs = require('fs'), path = require('path');
const ROT = path.join(__dirname, '..');
const UT = path.join(ROT, 'kapitel', 'organisk-kemi', 'delkapitel', 'fossila-branslen', 'img');
fs.mkdirSync(UT, { recursive: true });
const INK = '#2d4a35', SIGN = '#5a9668', KOL = '#3a3a3a', SYRE = '#C0392B', VATE = '#f5f0e4', KVAVE = '#3D6BA8', VATSKA = '#a8c4d8', GRA = '#8A8A8A', GUL = '#e8c547';
const FONT = `font-family="Georgia, 'Times New Roman', serif"`;
const r2 = x => Math.round(x * 100) / 100;
const svg = (w, h, titel, inneh) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-labelledby="t">
  <title id="t">${titel}</title>
${inneh}</svg>
`;
const txt = (x, y, t, extra = '') => `  <text x="${r2(x)}" y="${r2(y)}" ${/fill=/.test(extra) ? '' : `fill="${INK}"`} ${/font-size=/.test(extra) ? '' : 'font-size="16"'} ${/text-anchor=/.test(extra) ? '' : 'text-anchor="middle"'} ${FONT} ${extra}>${t}</text>\n`;
const SUBT = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9', 'ₓ': 'x' };
const formel = s => s.replace(/([₀-₉ₓ]+)([^₀-₉ₓ]*)/g, (_, ix, rest) => `<tspan font-size="0.7em" dy="0.3em">${[...ix].map(c => SUBT[c]).join('')}</tspan>` + (rest ? `<tspan dy="-0.3em">${rest}</tspan>` : ''));
const linje = (x1, y1, x2, y2, farg = INK, bredd = 2, extra = '') => `  <line x1="${r2(x1)}" y1="${r2(y1)}" x2="${r2(x2)}" y2="${r2(y2)}" stroke="${farg}" stroke-width="${bredd}" stroke-linecap="round" ${extra}/>\n`;
const cirkel = (x, y, r, fyll, kontur = INK, bredd = 1.2, extra = '') => `  <circle cx="${r2(x)}" cy="${r2(y)}" r="${r}" fill="${fyll}" stroke="${kontur}" stroke-width="${bredd}" ${extra}/>\n`;
const rekt = (x, y, w, h, fyll, extra = '') => `  <rect x="${r2(x)}" y="${r2(y)}" width="${r2(w)}" height="${r2(h)}" fill="${fyll}" ${extra}/>\n`;
const pil = (x1, y1, x2, y2, farg = INK, bredd = 2.5, extra = '') => {   // fylld pilspets
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, s = bredd * 4, bx = x2 - ux * s, by = y2 - uy * s;
  return `  <line x1="${r2(x1)}" y1="${r2(y1)}" x2="${r2(bx)}" y2="${r2(by)}" stroke="${farg}" stroke-width="${bredd}" stroke-linecap="round" ${extra}/>
  <polygon points="${r2(x2)},${r2(y2)} ${r2(bx - uy * s * 0.5)},${r2(by + ux * s * 0.5)} ${r2(bx + uy * s * 0.5)},${r2(by - ux * s * 0.5)}" fill="${farg}" ${extra}/>\n`;
};
const tunnPil = (x1, y1, x2, y2, farg, bredd = 1.4, extra = '') => {   // smal konturpil: streck + öppet V-huvud
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, h = 7;
  return linje(x1, y1, x2, y2, farg, bredd, extra) + linje(x2, y2, x2 - ux * h - uy * h * 0.6, y2 - uy * h + ux * h * 0.6, farg, bredd, extra) + linje(x2, y2, x2 - ux * h + uy * h * 0.6, y2 - uy * h - ux * h * 0.6, farg, bredd, extra);
};
// vågig pil (värmestrålning i J1): sinuskurva längs sträckan + pilspets
const vagPil = (x1, y1, x2, y2, farg, bredd = 2, extra = '') => {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux, n = Math.max(2, Math.round(L / 12));
  let d = `M${r2(x1)} ${r2(y1)}`;
  for (let i = 1; i <= n; i++) { const t = i / n, a = (i % 2 ? 1 : -1) * 4 * (i < n ? 1 : 0); d += ` L${r2(x1 + ux * L * t + nx * a)} ${r2(y1 + uy * L * t + ny * a)}`; }
  const s = 8;
  return `  <path d="${d}" fill="none" stroke="${farg}" stroke-width="${bredd}" stroke-linejoin="round" ${extra}/>\n  <polygon points="${r2(x2 + ux * 4)},${r2(y2 + uy * 4)} ${r2(x2 - ux * s - nx * s * 0.5)},${r2(y2 - uy * s - ny * s * 0.5)} ${r2(x2 - ux * s + nx * s * 0.5)},${r2(y2 - uy * s + ny * s * 0.5)}" fill="${farg}" ${extra}/>\n`;
};
let antal = 0;
const skriv = (fil, w, h, titel, inneh) => { fs.writeFileSync(path.join(UT, fil), svg(w, h, titel, inneh)); antal++; };

// ---------- bokstavsstil: rak alkan med n kolatomer (som bilder-svg-kolvaten.js: DX 46, teckengrad 19) ----------
const DX = 46, DY = 34, HB = 11, HE = 23, FS = 19;
function alkan(n, x0, y) {
  const atomer = [], bind = [];
  for (let i = 0; i < n; i++) atomer.push({ typ: 'C', x: x0 + i * DX, y, c: i });
  for (let i = 0; i < n - 1; i++) bind.push({ typ: 'C-C', a: i, b: i + 1, antal: 1 });
  for (let i = 0; i < n; i++) {
    const c = atomer[i], lagg = (dx, dy) => { atomer.push({ typ: 'H', x: c.x + dx, y: c.y + dy, c: i }); bind.push({ typ: 'C-H', a: i, b: atomer.length - 1, antal: 1 }); };
    lagg(0, -DY); lagg(0, DY);
    if (i === 0) lagg(-DX, 0);
    if (i === n - 1) lagg(DX, 0);
  }
  return { atomer, bind };
}
function ritaStruktur(m, o = {}) {
  const tag = o.tag || '', fs_ = o.fontsize || FS, GAP = 7.2;
  let s = '';
  for (const b of m.bind) {
    const A = m.atomer[b.a], B = m.atomer[b.b], dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
    const k = b.typ === 'C-C' ? 13 : HB, e = b.typ === 'C-C' ? 13 : HE, farg = b.farg || INK;
    for (let j = 0; j < (b.antal || 1); j++) {
      const o2 = (j - ((b.antal || 1) - 1) / 2) * GAP;
      s += linje(A.x + ux * k + nx * o2, A.y + uy * k + ny * o2, (b.typ === 'C-C' ? B.x - ux * e : A.x + ux * e) + nx * o2, (b.typ === 'C-C' ? B.y - uy * e : A.y + uy * e) + ny * o2, farg, 2.2, `data-bind="${b.typ}" ${tag}`);
    }
  }
  for (const a of m.atomer) { s += txt(a.x, a.y + fs_ * 0.35, a.typ, `font-size="${a.typ === 'C' ? fs_ : fs_ * 0.86}" fill="${a.farg || INK}" ${a.typ === 'C' ? 'font-weight="bold"' : ''} data-atom="${a.typ}" ${tag}`); }
  return s;
}

// ================= AVSNITT 1 =================
// ---------- E1. Från död organism till fossilt bränsle (1.1) ----------
{
  const W = 780, HH = 330, PB = 232, G = 22, X0 = 16, YT = 50, HOR = 92, BOT = 250;   // panelbredd, mellanrum, panelernas topp, horisont (vattenyta), panelbotten
  let ut = '';
  const paneler = [['I dag', 'dött material sjunker till botten'], ['Efter tusentals år', 'sediment täcker materialet'], ['Efter miljontals år', 'kolväten bildas']];
  paneler.forEach(([rub, etik], i) => {
    const x = X0 + i * (PB + G), tag = `data-panel="${i + 1}"`;
    ut += txt(x + PB / 2, YT - 12, rub, 'font-size="15" font-weight="bold"');
    ut += rekt(x, YT, PB, HOR - YT, VATSKA, `data-del="vatten" ${tag}`);                                   // vatten ovanför horisonten
    ut += rekt(x, HOR, PB, BOT - HOR, KOL, `data-del="botten" ${tag}`);                                     // botten
    // sedimentlager (panel 2: fyra, panel 3: nio) i toner av grått ovanpå det organiska lagret
    const lager = [0, 4, 9][i], lh = i === 1 ? 14 : 12;
    for (let l = 0; l < lager; l++) { ut += rekt(x, HOR + l * lh, PB, lh, ['#8A8A8A', '#9a9a9a', '#7c7c7c', '#a6a6a6'][l % 4], `data-del="sediment" ${tag}`); }
    // det organiska lagret: tunt grönt band (panel 1 ovanpå botten, panel 2 under sedimenten, panel 3 djupt ner som mörk zon)
    const oy = HOR + lager * lh, oh = [14, 9, 10][i];
    if (i < 2) {
      ut += rekt(x, oy, PB, oh, SIGN, `data-del="organiskt" ${tag}`);
      for (let k = 0; k < (i === 0 ? 12 : 9); k++) { ut += `  <ellipse cx="${r2(x + 12 + k * (PB - 24) / (i === 0 ? 11 : 8))}" cy="${r2(oy + oh / 2)}" rx="7" ry="3" fill="${SIGN}" stroke="${INK}" stroke-width="0.8" ${tag}/>\n`; }
    } else {
      ut += rekt(x, oy, PB, oh, '#1f2a22', `data-del="organiskt" stroke="${SIGN}" stroke-width="1.2" ${tag}`);
      ut += pil(x + 8, oy + oh / 2, x + 44, oy + oh / 2, INK, 2.5, tag) + pil(x + PB - 8, oy + oh / 2, x + PB - 44, oy + oh / 2, INK, 2.5, tag);   // tryck från sidorna
      ut += txt(x + 26, oy - 6, 'tryck', 'font-size="12" font-weight="bold"') + txt(x + PB - 26, oy - 6, 'tryck', 'font-size="12" font-weight="bold"');
      ut += `  <path d="M${x + 60} ${oy + oh + 22} q10 -8 20 0 t20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="${GUL}" stroke-width="2.4" ${tag}/>\n` + txt(x + PB / 2, oy + oh + 40, 'värme', `font-size="12" font-weight="bold" fill="${GUL}"`);
    }
    ut += `  <rect x="${x}" y="${YT}" width="${PB}" height="${BOT - YT}" fill="none" stroke="${INK}" stroke-width="1.4" ${tag}/>\n`;
    ut += txt(x + PB / 2, BOT + 20, etik, 'font-size="13" font-style="italic"');
  });
  // gemensam tidsaxel
  ut += pil(X0, HH - 26, W - X0, HH - 26, INK, 1.6);
  paneler.forEach(([rub], i) => { const x = X0 + i * (PB + G) + PB / 2; ut += linje(x, HH - 32, x, HH - 20, INK, 1.4) + txt(x, HH - 8, rub.toLowerCase(), 'font-size="12"'); });
  skriv('k3-e1.svg', W, HH, 'Tre bilder i genomskärning av en havsbotten. I den första sjunker dött material till botten. I den andra har sediment lagt sig ovanpå. I den tredje ligger materialet djupt ner och utsätts för tryck och värme', ut);
}

// ---------- E2. Det långa kretsloppet (1.2) – ur grundfiguren k1-a10.svg ----------
{
  const a10 = fs.readFileSync(path.join(ROT, 'kapitel', 'organisk-kemi', 'delkapitel', 'kolatomen', 'img', 'k1-a10.svg'), 'utf8').replace(/\r\n/g, '\n');
  if (!/<g id="geologisk-slinga">/.test(a10)) { throw new Error('k1-a10.svg saknar gruppen geologisk-slinga – rita inte om grundfiguren, säg till'); }
  // utpilen: heldragen, etikett "begravning"; geologisk-slinga: lagerfält med kol/olja/naturgas, pil ner, förbränningspil upp
  const utpilNy = `  <g id="utpil">\n` + pil(640, 445, 740, 505, SIGN, 3) + txt(722, 470, 'begravning', 'font-size="14" font-style="italic" text-anchor="start"') + '  </g>\n';
  let sl = '  <g id="geologisk-slinga">\n';
  sl += rekt(200, 560, 400, 70, GRA, `fill-opacity="0.45" stroke="${GRA}" stroke-width="1" rx="8" data-del="berggrund"`) + txt(400, 583, 'berggrund', 'font-size="15" font-weight="bold"');
  [['kol', 262], ['olja', 400], ['naturgas', 538]].forEach(([n, x]) => { sl += rekt(x - 44, 592, 88, 28, KOL, `rx="5" data-del="${n}"`) + txt(x, 611, n, `font-size="13" fill="${VATE}"`); });
  sl += pil(740, 505, 640, 585, SIGN, 3, 'data-pil="ner"');                                                                           // från begravningspilen ner i fältet
  // förbränning: kraftig pil ut ur fältet, runt vänsterkanten och upp till atmosfären (utanför växten)
  sl += `  <path d="M200 598 L60 598 L60 56 L186 56" fill="none" stroke="${SIGN}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" data-pil="forbranning"/>
` + pil(186, 56, 198, 56, SIGN, 5, 'data-pil="forbranning"');
  sl += txt(72, 478, 'förbränning', 'font-size="16" font-weight="bold" text-anchor="start"');
  sl += txt(400, 650, 'miljontals år', 'font-size="14" font-style="italic"') + txt(400, 400, 'år till årtionden', 'font-size="13" font-style="italic"');
  sl += '  </g>\n';
  let ut = a10.replace(/  <g id="utpil">[\s\S]*?  <\/g>\n/, utpilNy).replace(/  <g id="geologisk-slinga">[\s\S]*?<\/g>\n/, sl);
  ut = ut.replace('viewBox="0 0 800 520" width="800" height="520"', 'viewBox="0 0 800 670" width="800" height="670"');
  ut = ut.replace(/<title id="t">[^<]*<\/title>/, '<title id="t">Kolets kretslopp med två slingor. Den inre snabba slingan går mellan atmosfär, växter, djur och nedbrytare på år till årtionden. En yttre slinga går ner i berggrunden där kol, olja och naturgas finns, och tillbaka upp genom förbränning</title>');
  fs.writeFileSync(path.join(UT, 'k3-e2.svg'), ut); antal++;
}

// ---------- E3. De tre fossila bränslena (1.3) – tabell med staplar ----------
{
  const KOLX = [0, 130, 260, 400, 760], W = KOLX[4], RH = 56, TOP = 46, HH = TOP + 3 * RH + 60;
  const mitt = i => (KOLX[i] + KOLX[i + 1]) / 2;
  let ut = '';
  ['Bränsle', 'Bildades av', 'Bildades i', 'Andel av världens energi'].forEach((t, i) => { ut += txt(i === 3 ? KOLX[3] + 12 : mitt(i), 28, t, `font-size="14" font-style="italic" fill="${SIGN}" ${i === 3 ? 'text-anchor="start"' : ''}`); });
  ut += linje(16, TOP - 8, W - 16, TOP - 8, INK, 1.4);
  const rader = [['Olja', 'plankton', 'havet', '30–35 %', 32.5], ['Naturgas', 'plankton', 'havet', '23–25 %', 24], ['Kol', 'landväxter', 'sumpmarker', 'ungefär 25 %', 25]];
  const SK = (KOLX[4] - KOLX[3] - 90) / 40;   // px per procent: 40 % fyller stapelfältet
  rader.forEach(([b, av, i, p, v], r) => {
    const y = TOP + r * RH + RH / 2;
    ut += txt(mitt(0), y + 6, b, 'font-size="17" font-weight="bold"') + txt(mitt(1), y + 6, av, 'font-size="16"') + txt(mitt(2), y + 6, i, 'font-size="16"');
    ut += rekt(KOLX[3] + 12, y - 11, v * SK, 22, SIGN, `rx="3" data-andel="${v}"`) + txt(KOLX[3] + 12 + v * SK + 8, y + 5, p, 'font-size="13" text-anchor="start"');
    if (r < 2) ut += linje(16, TOP + (r + 1) * RH, W - 16, TOP + (r + 1) * RH, INK, 0.8);
  });
  ut += linje(16, TOP + 3 * RH, W - 16, TOP + 3 * RH, INK, 1.4);
  ut += txt(W / 2, TOP + 3 * RH + 34, 'tillsammans ungefär fyra femtedelar av all energi', 'font-size="15" font-style="italic"');
  skriv('k3-e3.svg', W, HH, 'En tabell med olja, naturgas och kol. För varje bränsle står vad det bildades av, var det bildades, och hur stor andel av världens energi det står för, visat som en stapel', ut);
}

// ================= AVSNITT 2 =================
// ---------- F1. Oljefällan (2.1) ----------
{
  const W = 760, HH = 380;
  let ut = '';
  // poröst berg: grått fält med punktering
  ut += rekt(20, 90, 500, 270, GRA, `fill-opacity="0.35" data-del="porost"`);
  ut += `  <pattern id="porer" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="1.3" fill="${INK}" fill-opacity="0.35"/><circle cx="11" cy="10" r="1.3" fill="${INK}" fill-opacity="0.35"/></pattern>\n`;
  ut += rekt(20, 90, 500, 270, 'url(#porer)', '');
  // fällan: kupolformad lins under det täta lagret. Faserna (nedifrån): vatten, olja, gas
  ut += `  <clipPath id="lins"><path d="M120 250 Q270 110 420 250 Z"/></clipPath>\n`;
  ut += `  <path d="M120 250 Q270 110 420 250 Z" fill="${VATSKA}" data-fas="vatten" data-ordning="3"/>\n`;
  ut += `  <rect x="100" y="120" width="340" height="82" fill="${KOL}" clip-path="url(#lins)" data-fas="olja" data-ordning="2"/>\n`;
  ut += `  <rect x="100" y="100" width="340" height="70" fill="${VATE}" clip-path="url(#lins)" data-fas="naturgas" data-ordning="1"/>\n`;
  for (let i = 0; i < 14; i++) { ut += cirkel(200 + (i % 7) * 20 + (i > 6 ? 10 : 0), 150 + Math.floor(i / 7) * 10, 1.6, INK, 'none', 0, 'clip-path="url(#lins)"'); }   // glesa prickar i gasen
  // tätt berglager: kupol ovanpå linsen
  ut += `  <path d="M60 300 Q270 60 480 300" fill="none" stroke="#5a5a5a" stroke-width="16" stroke-linecap="round" data-del="tatt"/>\n`;
  ut += txt(270, 84, 'tätt berglager', 'font-size="13" font-style="italic"');
  // etiketter med utpekning
  [['naturgas', 270, 140, 560, 130], ['olja', 270, 195, 560, 190], ['vatten', 270, 238, 560, 245]].forEach(([n, x1, y1, x2, y2]) => { ut += linje(x1 + 60, y1, x2 - 6, y2, INK, 1) + txt(x2, y2 + 5, n, 'font-size="15" font-weight="bold" text-anchor="start"'); });
  // oljan rör sig uppåt: streckad pil från djupet
  ut += pil(270, 345, 270, 262, INK, 1.6, 'stroke-dasharray="5 4"') + txt(286, 320, 'oljan rör sig uppåt', 'font-size="12" font-style="italic" text-anchor="start"');
  // detaljförstoring: korn med olja i mellanrummen
  ut += `  <circle cx="650" cy="300" r="62" fill="${VATE}" stroke="${INK}" stroke-width="1.4" data-del="forstoring"/>\n`;
  ut += `  <clipPath id="lupp"><circle cx="650" cy="300" r="61"/></clipPath>\n`;
  ut += `  <rect x="588" y="238" width="124" height="124" fill="${KOL}" clip-path="url(#lupp)"/>\n`;
  const korn = [[622, 274, 17], [660, 266, 15], [694, 292, 16], [606, 310, 14], [644, 306, 15], [678, 328, 15], [626, 342, 16], [666, 352, 13], [700, 322, 10]];
  korn.forEach(([x, y, r]) => { ut += `  <circle cx="${x}" cy="${y}" r="${r}" fill="${GRA}" stroke="${INK}" stroke-width="1" clip-path="url(#lupp)" data-korn="1"/>\n`; });
  ut += linje(590, 258, 470, 200, INK, 1, 'stroke-dasharray="3 3"');
  ut += txt(650, 378, 'inga underjordiska sjöar', 'font-size="12" font-style="italic"');
  skriv('k3-f1.svg', W, HH, 'Genomskärning av berggrund. Under ett tätt berglager ligger naturgas överst, olja i mitten och vatten underst. En detaljförstoring visar att oljan sitter i små hålrum mellan bergkorn', ut);
}

// ---------- F2. Fraktioneringstornet (2.2) ----------
{
  const W = 720, HH = 620, TX = 250, TW = 150, TT = 50, TB = 500;
  let ut = '';
  ut += `  <rect x="${TX}" y="${TT}" width="${TW}" height="${TB - TT}" rx="40" fill="${VATE}" stroke="${INK}" stroke-width="2.2" data-del="torn"/>\n`;
  // ugn nedtill
  ut += rekt(TX + 20, TB + 20, TW - 40, 50, GUL, `rx="6" stroke="${INK}" stroke-width="1.6" data-del="ugn"`) + txt(TX + TW / 2, TB + 50, '400 °C', 'font-size="15" font-weight="bold"');
  ut += pil(TX + TW / 2, TB + 20, TX + TW / 2, TB - 4, SYRE, 3) + pil(90, TB + 45, TX + 18, TB + 45, INK, 2.5) + txt(88, TB + 32, 'råolja', 'font-size="15" font-weight="bold" text-anchor="end"');
  const fr = [['gaser', '1–4', 25, 1], ['bensin', '5–10', 70, 2], ['fotogen', '10–16', 150, 3], ['diesel', '10–22', 220, 4], ['smörjolja och tjockolja', '20–70', 300, 6], ['asfalt', 'över 70', 380, 9]];
  fr.forEach(([namn, kol, temp, kedja], i) => {
    const y = TT + 40 + i * ((TB - TT - 70) / (fr.length - 1));
    if (i < fr.length - 1) ut += linje(TX + 12, y + 32, TX + TW - 12, y + 32, INK, 1.2);   // hylla
    ut += pil(TX + TW, y, TX + TW + 46, y, INK, 2.2, `data-uttag="${i + 1}"`);
    ut += txt(TX + TW + 56, y + 5, namn, 'font-size="15" font-weight="bold" text-anchor="start"') + txt(TX + TW + 56, y + 21, `${kol} kolatomer`, 'font-size="12" font-style="italic" text-anchor="start"');
    // kedjelängdsmarkering: sicksack med `kedja` segment
    let d = `M${TX + TW + 236} ${y + 2}`; for (let k = 1; k <= kedja; k++) d += ` l7 ${k % 2 ? -6 : 6}`;
    ut += `  <path d="${d}" fill="none" stroke="${KOL}" stroke-width="2" stroke-linejoin="round" data-kedja="${kedja}"/>\n`;
    // temperaturskala till vänster
    ut += linje(TX - 6, y, TX, y, INK, 1.2) + txt(TX - 12, y + 5, `${temp} °C`, `font-size="12" text-anchor="end" data-temp="${temp}"`);
  });
  ut += txt(TX - 60, TT - 14, 'svalare', 'font-size="12" font-style="italic"') + txt(TX - 60, TB + 8, 'varmare', 'font-size="12" font-style="italic"');
  ut += pil(TX - 60, TB - 10, TX - 60, TT + 4, GRA, 1.4);
  ut += txt(TX + TW + 262, TT - 14, 'kedjelängd', 'font-size="12" font-style="italic"');
  skriv('k3-f2.svg', W, HH, 'Ett fraktioneringstorn i genomskärning. Råolja värms till 400 grader och leds in nedtill. Uppåt i tornet blir det kallare, och olika fraktioner tas ut på olika nivåer – gaser högst upp, sedan bensin, fotogen, diesel, smörjoljor, och asfalt i botten', ut);
}

// ---------- F3. Krackning (2.3) ----------
{
  const W = 900, HH = 300, DXS = 46;
  let ut = '';
  // övre raden: 16 kolatomer, mindre teckengrad så att raden ryms
  const skala = 0.72;
  const g = (inre, cx, cy) => `  <g transform="translate(${r2(cx)} ${cy}) scale(${skala}) translate(${r2(-cx)} ${-cy})">\n${inre}  </g>\n`;
  const m16 = alkan(16, 450 - 7.5 * DXS, 80);
  ut += g(ritaStruktur(m16, { tag: 'data-rad="1"' }), 450, 80);
  ut += txt(450, 24, 'en lång kolvätekedja', 'font-size="15" font-weight="bold"');
  // brott vid mitten: blixt + etikett
  ut += `  <path d="M446 96 l6 12 l-8 4 l10 16" fill="none" stroke="${GUL}" stroke-width="3" stroke-linejoin="round" data-del="brott"/>\n` + txt(468, 122, 'värme och katalysator', 'font-size="12" font-style="italic" text-anchor="start"');
  ut += pil(450, 132, 450, 158, GRA, 2);
  // nedre raden: 8 + 8, den högra med dubbelbindning i brottänden (första kolatomen), ett väte färre där
  const mL = alkan(8, 230 - 3.5 * DXS, 210), mR = alkan(8, 670 - 3.5 * DXS, 210);
  mR.bind[0].antal = 2; mR.bind[0].farg = SIGN;
  // dubbelbindning i brottänden: kol 0 och 1 bär ett väte färre var (två väten som satt i övre raden sitter nu som H2 – vi visar bara kedjan)
  for (const c of [0, 1]) { const i = mR.atomer.findIndex(a => a.typ === 'H' && a.c === c && a.y > 210); const ix = mR.bind.findIndex(b => b.typ === 'C-H' && b.b === i); mR.atomer.splice(i, 1); mR.bind.splice(ix, 1); mR.bind.forEach(b => { if (b.b > i) b.b--; }); }
  mR.atomer[0].farg = SIGN; mR.atomer[1].farg = SIGN;
  ut += g(ritaStruktur(mL, { tag: 'data-rad="2" data-del="vanster"' }), 230, 210) + g(ritaStruktur(mR, { tag: 'data-rad="2" data-del="hoger"' }), 670, 210);
  ut += txt(230, 268, 'bensin', 'font-size="16" font-weight="bold"') + txt(560, 268, 'alken', `font-size="16" font-weight="bold" fill="${SIGN}"`);
  ut += linje(560, 250, 560, 232, SIGN, 1.2);
  skriv('k3-f3.svg', W, HH, 'En lång kolvätekedja som delas i två kortare. Den vänstra delen är bensin. I den högra delens brottände har det bildats en dubbelbindning', ut);
}

// ================= AVSNITT 3 =================
// ---------- G1. Kolserien (3.1) – trappa med kolhaltsstaplar ----------
{
  const W = 760, HH = 420, X0 = 60, SB = 150, SH = 46, YB = 310;   // stegbredd, steghöjd, trappans bas
  let ut = '';
  const steg = [['torv', 57.5, '55–60 %', 'pågår nu', false], ['brunkol', 65, '60–70 %', '2–65 milj. år', false], ['stenkol', 82.5, '75–90 %', '300–350 milj. år', false], ['ännu mer förkolnat', 92, 'över 90 %', '', true]];
  const SK = 1.4;   // px per procent i staplarna
  steg.forEach(([namn, halt, text, alder, blek], i) => {
    const x = X0 + i * (SB + 10), y = YB - (i + 1) * SH;
    // steget
    ut += `  <rect x="${x}" y="${y}" width="${SB}" height="${YB - y}" fill="${blek ? 'none' : KOL}" fill-opacity="${blek ? 0 : 0.85 - i * 0.12}" stroke="${INK}" stroke-width="1.4" ${blek ? 'stroke-dasharray="5 4"' : ''} data-steg="${i + 1}"/>\n`;
    ut += txt(x + SB / 2, y - 74, namn, `font-size="${blek ? 13 : 16}" ${blek ? 'font-style="italic"' : 'font-weight="bold"'} ${blek ? `fill="${GRA}"` : ''}`);
    // kolhaltsstapel ovanför steget
    ut += rekt(x + 20, y - 50, halt * SK, 14, blek ? GRA : SIGN, `rx="3" ${blek ? 'fill-opacity="0.6"' : ''} data-kolhalt="${halt}"`) + txt(x + 20 + halt * SK / 2, y - 56, text, `font-size="11" ${blek ? `fill="${GRA}"` : ''}`);
    if (alder) ut += txt(x + SB / 2, y - 22, alder, 'font-size="11" font-style="italic"');
    else ut += txt(x + SB / 2, y - 22, '(Fördjupning)', `font-size="11" font-style="italic" fill="${GRA}"`);
  });
  ut += linje(X0 - 10, YB, W - 40, YB, INK, 1.4);
  ut += pil(X0, YB + 34, W - 60, YB + 34, INK, 2) + txt(W / 2, YB + 30, 'mer tryck, mer tid', 'font-size="14" font-style="italic"');
  ut += pil(X0, YB + 76, W - 60, YB + 76, SIGN, 2) + txt(W / 2, YB + 72, 'mer kol, mindre vatten', 'font-size="14" font-style="italic"');
  ut += txt(X0 + 4, 24, 'kolhalt (stapel) och ålder', 'font-size="12" font-style="italic" text-anchor="start"');
  skriv('k3-g1.svg', W, HH, 'Fyra steg i en trappa: torv, brunkol, stenkol och ett fjärde ännu mer förkolnat steg. För varje steg visas kolhalten som en stapel, och den ökar uppåt', ut);
}

// ---------- G2. Från stenkol till järn (3.2) – torrdestillation och masugn ----------
{
  const W = 800, HH = 400;
  let ut = '';
  // vänster: sluten ugn
  ut += `  <rect x="60" y="130" width="200" height="180" rx="10" fill="${VATE}" stroke="${INK}" stroke-width="2.4" data-del="ugn"/>\n`;
  ut += `  <rect x="80" y="220" width="160" height="70" rx="6" fill="${KOL}" data-del="stenkol"/>\n` + txt(160, 262, 'stenkol', `font-size="14" fill="${VATE}"`);
  ut += txt(160, 170, '1000 °C', 'font-size="18" font-weight="bold"') + txt(160, 192, 'utan luft', 'font-size="13" font-style="italic"');
  // överkryssat luftinlopp
  ut += linje(20, 250, 56, 250, GRA, 2.5, 'stroke-dasharray="4 4" data-del="luftinlopp-stangt"') + `  <line x1="28" y1="238" x2="48" y2="262" stroke="${SYRE}" stroke-width="3"/>\n  <line x1="48" y1="238" x2="28" y2="262" stroke="${SYRE}" stroke-width="3"/>\n` + txt(38, 280, 'ingen luft', `font-size="11" font-style="italic" fill="${SYRE}"`);
  // ut: tjära och gaser
  ut += pil(160, 128, 160, 62, INK, 2.5, 'data-pil="gaser"') + txt(160, 48, 'tjära och gaser', 'font-size="15" font-weight="bold"') + txt(160, 30, 'metan och koloxid', 'font-size="12" font-style="italic"');
  // koks vidare
  ut += pil(262, 250, 340, 250, SIGN, 4, 'data-pil="koks"') + txt(300, 238, 'koks', 'font-size="16" font-weight="bold"');
  ut += txt(160, 340, 'torrdestillation', 'font-size="14" font-style="italic"');
  // höger: masugn
  ut += `  <path d="M400 80 L500 80 L500 180 L530 260 L530 320 L370 320 L370 260 L400 180 Z" fill="${VATE}" stroke="${INK}" stroke-width="2.4" data-del="masugn"/>\n`;
  ut += `  <rect x="380" y="270" width="140" height="44" fill="${GUL}" data-del="smalta"/>\n`;
  ut += pil(450, 30, 450, 76, INK, 2.5, 'data-pil="in-topp"') + txt(470, 34, 'järnmalm och koks', 'font-size="14" font-weight="bold" text-anchor="start"');
  ut += pil(600, 290, 534, 290, VATSKA, 3, 'data-del="luftinlopp"') + txt(610, 295, 'luft', 'font-size="15" font-weight="bold" text-anchor="start"');
  ut += pil(450, 322, 450, 368, GUL, 3.5, 'data-pil="jarn"') + txt(450, 388, 'smält järn', 'font-size="15" font-weight="bold"');
  ut += pil(560, 110, 640, 60, GRA, 2.5, 'data-pil="co2"') + txt(650, 56, formel('koldioxid, CO₂'), 'font-size="14" font-weight="bold" text-anchor="start"');
  ut += linje(500, 120, 560, 110, GRA, 2.5);
  ut += txt(450, 340, 'masugn', 'font-size="14" font-style="italic"');
  skriv('k3-g2.svg', W, HH, 'Till vänster en sluten ugn där stenkol hettas till 1000 grader utan luft, så att tjära och gaser drivs ut och koks blir kvar. Till höger en masugn där koks och järnmalm går in, luft blåses in nedtill, smält järn kommer ut i botten och koldioxid upptill', ut);
}

// ================= AVSNITT 4 =================
// ---------- H1. Naturgasens väg (4.1) ----------
{
  const W = 800, HH = 330, M = 400;
  let ut = '';
  // vänster: schematisk karta med två landmassor och ett hav, rörledning över havsbotten
  ut += rekt(20, 60, 360, 190, VATSKA, 'rx="8" data-del="hav"');
  ut += `  <path d="M20 60 L120 60 Q140 120 100 170 Q80 220 20 250 Z" fill="${GRA}" data-del="land"/>\n  <path d="M380 60 L280 60 Q270 130 300 180 Q330 230 380 250 Z" fill="${GRA}" data-del="land"/>\n`;
  ut += `  <path d="M112 150 Q200 200 292 150" fill="none" stroke="${SIGN}" stroke-width="5" stroke-linecap="round" data-del="rorledning"/>\n`;
  ut += txt(200, 272, 'rörledning', 'font-size="17" font-weight="bold"') + txt(200, 292, 'går bara mellan två bestämda punkter', 'font-size="12" font-style="italic"');
  // skiljelinje
  ut += linje(M, 40, M, 300, INK, 1.2);
  // höger: kylanläggning, fartyg, mottagning
  ut += rekt(420, 60, 360, 190, VATSKA, 'rx="8" data-del="hav2"');
  ut += `  <path d="M420 60 L500 60 L500 250 L420 250 Z" fill="${GRA}"/>\n  <path d="M700 60 L780 60 L780 250 L700 250 Z" fill="${GRA}"/>\n`;
  ut += rekt(440, 120, 44, 60, VATE, `stroke="${INK}" stroke-width="1.5" data-del="kylning"`) + `  <path d="M448 120 V100 h8 V120 M468 120 V96 h8 V120" fill="${VATE}" stroke="${INK}" stroke-width="1.5"/>\n`;
  ut += pil(462, 196, 462, 236, INK, 1.8) + txt(462, 254, 'kylning till −162 °C', 'font-size="11" font-style="italic"');
  // fartyg
  ut += `  <path d="M540 190 L660 190 L645 212 L555 212 Z" fill="${INK}" data-del="fartyg"/>\n  <rect x="566" y="170" width="70" height="20" rx="10" fill="${VATE}" stroke="${INK}" stroke-width="1.5"/>\n`;
  ut += pil(500, 160, 535, 190, GRA, 1.8) + pil(665, 190, 700, 160, GRA, 1.8);
  ut += rekt(716, 120, 44, 60, VATE, `stroke="${INK}" stroke-width="1.5" data-del="mottagning"`) + `  <circle cx="738" cy="110" r="14" fill="${VATE}" stroke="${INK}" stroke-width="1.5"/>\n`;
  ut += txt(600, 272, 'flytande naturgas', 'font-size="17" font-weight="bold"') + txt(600, 292, 'kan gå vart som helst, men kostar mer', 'font-size="12" font-style="italic"');
  ut += txt(W / 2, HH - 10, 'en gas tar 600 gånger större plats än samma mängd vätska', 'font-size="13" font-style="italic"');
  skriv('k3-h1.svg', W, HH, 'Till vänster en rörledning över en havsbotten mellan två landmassor. Till höger en anläggning som kyler gasen till minus 162 grader, ett fartyg som fraktar den, och en mottagningsanläggning', ut);
}

// ---------- H2. Tre bränslen, tre resultat (4.2) – tre reaktioner med färgade C och H ----------
{
  const W = 860, HH = 400, RH = 120, TOP = 20;
  let ut = '';
  // molekyler i bokstavsstil, varje atom med data-atom och färgkodning: C fylld kol-ruta, H väteruta med kontur
  const atom = (x, y, t, tag) => (t === 'C' ? `  <rect x="${x - 12}" y="${y - 12}" width="24" height="24" rx="5" fill="${KOL}" data-atom="C" ${tag}/>\n` + txt(x, y + 6, 'C', `font-size="${FS}" font-weight="bold" fill="${VATE}"`) : t === 'H' ? `  <rect x="${x - 10}" y="${y - 10}" width="20" height="20" rx="5" fill="${VATE}" stroke="${INK}" stroke-width="1.2" data-atom="H" ${tag}/>\n` + txt(x, y + 5, 'H', `font-size="${FS * 0.86}"`) : txt(x, y + 6, t, `font-size="${FS}" font-weight="bold" fill="${SYRE}" data-atom="O" ${tag}`));
  const bond = (x1, y1, x2, y2, n = 1, extra = '') => { let s = ''; for (let j = 0; j < n; j++) { const o = (j - (n - 1) / 2) * 6; const v = x1 === x2; s += linje(x1 + (v ? o : 0), y1 + (v ? 0 : o), x2 + (v ? o : 0), y2 + (v ? 0 : o), INK, 2, extra); } return s; };
  const rader = [
    { br: 'vätgas', formel: '2 H₂ + O₂ → 2 H₂O', kol: false, vate: true },
    { br: 'rent kol', formel: 'C + O₂ → CO₂', kol: true, vate: false },
    { br: 'metan', formel: 'CH₄ + 2 O₂ → CO₂ + 2 H₂O', kol: true, vate: true }];
  rader.forEach((r, i) => {
    const y = TOP + i * RH + 44, tag = `data-rad="${i + 1}"`, tv = `data-rad="${i + 1}" data-sida="in"`, th = `data-rad="${i + 1}" data-sida="ut"`;
    ut += txt(60, y + 6, r.br, 'font-size="15" font-weight="bold" text-anchor="end"');
    // vänstra sidan (bränsle + syre) och högra (produkter)
    if (i === 0) {   // 2 H2 + O2 → 2 H2O
      [[100, y], [160, y]].forEach(([x, yy]) => { ut += bond(x - 4, yy, x + 4, yy) + atom(x - 14, yy, 'H', tv) + atom(x + 14, yy, 'H', tv); });
      ut += txt(130, y + 6, '+', 'font-size="18"') + txt(212, y + 6, '+', 'font-size="18"') + bond(232, y, 250, y, 2) + atom(224, y, 'O', tv) + atom(258, y, 'O', tv);
      [[330, y], [400, y]].forEach(([x, yy]) => { ut += bond(x - 8, yy - 8, x - 22, yy - 26) + bond(x + 8, yy - 8, x + 22, yy - 26) + atom(x, yy, 'O', th) + atom(x - 28, yy - 30, 'H', th) + atom(x + 28, yy - 30, 'H', th); });
      ut += txt(366, y + 6, '+', 'font-size="18"');
    } else if (i === 1) {   // C + O2 → CO2
      ut += atom(110, y, 'C', tv) + txt(150, y + 6, '+', 'font-size="18"') + bond(182, y, 200, y, 2) + atom(174, y, 'O', tv) + atom(208, y, 'O', tv);
      ut += atom(300, y, 'O', th) + bond(312, y, 330, y, 2) + atom(342, y, 'C', th) + bond(354, y, 372, y, 2) + atom(384, y, 'O', th);
    } else {   // CH4 + 2 O2 → CO2 + 2 H2O
      ut += atom(110, y, 'C', tv) + bond(110, y - 12, 110, y - 22) + bond(110, y + 12, 110, y + 22) + bond(98, y, 88, y) + bond(122, y, 132, y);
      ut += atom(110, y - 32, 'H', tv) + atom(110, y + 32, 'H', tv) + atom(78, y, 'H', tv) + atom(142, y, 'H', tv);
      ut += txt(170, y + 6, '+', 'font-size="18"');
      [[210, y], [262, y]].forEach(([x, yy]) => { ut += bond(x - 4, yy, x + 4, yy, 2) + atom(x - 14, yy, 'O', tv) + atom(x + 14, yy, 'O', tv); });
      ut += atom(330, y, 'O', th) + bond(342, y, 360, y, 2) + atom(372, y, 'C', th) + bond(384, y, 402, y, 2) + atom(414, y, 'O', th);
      ut += txt(438, y + 6, '+', 'font-size="18"');
      [[480, y], [550, y]].forEach(([x, yy]) => { ut += bond(x - 8, yy - 8, x - 22, yy - 26) + bond(x + 8, yy - 8, x + 22, yy - 26) + atom(x, yy, 'O', th) + atom(x - 28, yy - 30, 'H', th) + atom(x + 28, yy - 30, 'H', th); });
    }
    // pil mellan sidorna
    ut += pil(i === 0 ? 278 : i === 1 ? 236 : 292, y, i === 0 ? 298 : i === 1 ? 276 : 312, y, INK, 2.2, tag);
    // reaktionsformel under raden
    ut += txt(i === 1 ? 250 : 320, y + 52, formel(r.formel), 'font-size="15"');
    // rutorna till höger
    const rx = 640;
    ut += rekt(rx, y - 22, 190, 20, r.kol ? SIGN : 'none', `rx="4" stroke="${INK}" stroke-width="1" ${r.kol ? '' : 'stroke-dasharray="3 3"'} data-ruta="kol" ${tag}`) + txt(rx + 95, y - 8, 'kol → koldioxid', `font-size="12" ${r.kol ? `fill="${VATE}"` : `fill="${GRA}"`}`);
    ut += rekt(rx, y + 4, 190, 20, r.vate ? SIGN : 'none', `rx="4" stroke="${INK}" stroke-width="1" ${r.vate ? '' : 'stroke-dasharray="3 3"'} data-ruta="vate" ${tag}`) + txt(rx + 95, y + 18, 'väte → vatten', `font-size="12" ${r.vate ? `fill="${VATE}"` : `fill="${GRA}"`}`);
    if (i < 2) ut += linje(30, TOP + (i + 1) * RH - 4, W - 30, TOP + (i + 1) * RH - 4, INK, 0.8);
  });
  skriv('k3-h2.svg', W, HH, 'Tre reaktioner under varandra. Vätgas plus syre ger bara vatten. Kol plus syre ger bara koldioxid. Metan plus syre ger både koldioxid och vatten. Kolatomer och väteatomer är färgmarkerade så att de går att följa', ut);
}

// ---------- H3. Fullständig och ofullständig förbränning (4.3) – två lågor ----------
{
  const W = 760, HH = 360, K = W / 2;
  let ut = '';
  const laga = (cx, farg, tag) => `  <path d="M${cx} 240 C${cx - 44} 200 ${cx - 40} 150 ${cx - 6} 100 C${cx + 4} 130 ${cx + 22} 140 ${cx + 14} 160 C${cx + 40} 180 ${cx + 40} 220 ${cx} 240 Z" fill="${farg}" stroke="${INK}" stroke-width="2" data-laga="${tag}"/>\n`;
  [[K * 0.5 + 40, VATSKA, 'bla', 'gott om syre', 'het', ['CO₂', 'H₂O'], 'syre (gott om)'], [K * 1.5 + 40, GUL, 'gul', 'för lite syre', 'svalare', ['CO', 'sot', 'CO₂'], 'syre (för lite)']].forEach(([cx, farg, tag, etik, temp, ut_, syre]) => {
    ut += laga(cx, farg, tag);
    ut += rekt(cx - 30, 240, 60, 10, GRA, 'rx="3"');   // brännare
    ut += txt(cx, 268, etik, 'font-size="14" font-style="italic"') + txt(cx + 52, 120, temp, 'font-size="13" font-style="italic"');
    ut += pil(cx - 110, 245, cx - 40, 245, INK, 2, `data-in="bransle" data-laga="${tag}"`) + txt(cx - 112, 250, 'bränsle', 'font-size="13" font-weight="bold" text-anchor="end"');
    ut += pil(cx - 110, 215, cx - 44, 228, INK, 2, `data-in="syre" data-laga="${tag}"`) + txt(cx - 112, 212, syre, 'font-size="13" font-weight="bold" text-anchor="end"');
    ut_.forEach((p, k) => { const x = cx - 40 + k * 40; ut += pil(cx - 10 + k * 8, 100, x, 58, INK, 1.8, `data-ut="${p}" data-laga="${tag}"`) + txt(x, 46, p === 'sot' ? 'sot' : formel(p), 'font-size="14" font-weight="bold"'); });
    if (tag === 'gul') { [[cx - 20, 80], [cx + 10, 70], [cx + 26, 92], [cx - 4, 62]].forEach(([x, y]) => { ut += cirkel(x, y, 3, KOL, 'none', 0, `data-sot="1" data-laga="${tag}"`); }); }
  });
  ut += txt(K * 0.5 + 40, 300, 'fullständig förbränning', 'font-size="15" font-weight="bold"') + txt(K * 1.5 + 40, 300, 'ofullständig förbränning', 'font-size="15" font-weight="bold"');
  ut += linje(60, 318, W - 60, 318, INK, 1) + txt(W / 2, HH - 20, 'samma bränsle, olika mycket syre', 'font-size="15" font-style="italic"');
  skriv('k3-h3.svg', W, HH, 'Två lågor. Den vänstra är blå, har gott om syre och ger koldioxid och vatten. Den högra är gul och sotande, har för lite syre och ger kolmonoxid, sot och koldioxid', ut);
}

// ================= AVSNITT 5 =================
// ---------- J1. Växthuseffekten (5.1) – absorption och återutstrålning, ingen kupa ----------
{
  const W = 800, HH = 480, JY = 400;
  let ut = '';
  // atmosfär som fält utan övre kant: lodrät gradient som tonar ut uppåt
  ut += `  <defs><linearGradient id="atm" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${VATSKA}" stop-opacity="0"/><stop offset="0.55" stop-color="${VATSKA}" stop-opacity="0.35"/><stop offset="1" stop-color="${VATSKA}" stop-opacity="0.5"/></linearGradient></defs>\n`;
  ut += rekt(0, 60, W, JY - 60, 'url(#atm)', 'stroke="none" data-del="atmosfar"');
  // jordyta
  ut += `  <path d="M0 ${JY} Q200 ${JY - 14} 400 ${JY} T800 ${JY} L800 ${HH} L0 ${HH} Z" fill="${SIGN}" data-del="jordyta"/>\n` + rekt(0, JY + 40, W, HH - JY - 40, GRA, 'fill-opacity="0.6"');
  ut += txt(W / 2, HH - 12, 'jordytan värms och strålar ut värme', 'font-size="13" font-style="italic"');
  ut += txt(60, 30, 'rymden', `font-size="13" font-style="italic" fill="${GRA}" text-anchor="start"`);
  // 1. solstrålning in: raka gula pilar, oavbrutna
  [[40, 20, 170, JY - 8], [110, 20, 240, JY - 8], [180, 20, 310, JY - 8]].forEach(([x1, y1, x2, y2]) => { ut += pil(x1, y1, x2, y2, GUL, 3, 'data-stralning="sol"'); });
  ut += txt(70, 130, 'solstrålning passerar', `font-size="13" font-style="italic" text-anchor="start" fill="${INK}"`);
  // 2. värmestrålning upp: röda vågiga pilar. Två träffar molekyler, två lämnar bilden
  const mol = [[430, 200, 'CO₂'], [640, 250, 'CH₄']];
  ut += vagPil(380, JY - 6, 380, 20, SYRE, 2, 'data-stralning="varme" data-traff="ingen"');   // rakt ut i rymden
  ut += vagPil(740, JY - 6, 740, 20, SYRE, 2, 'data-stralning="varme" data-traff="ingen"');
  ut += vagPil(455, JY - 6, 436, 224, SYRE, 2, 'data-stralning="varme" data-traff="1"');
  ut += vagPil(610, JY - 6, 634, 274, SYRE, 2, 'data-stralning="varme" data-traff="2"');
  // 3. molekyler som absorberar och sänder ut åt alla håll (bokstavsstil)
  mol.forEach(([x, y, f], i) => {
    const tag = `data-molekyl="${i + 1}"`;
    ut += `  <rect x="${x - 34}" y="${y - 16}" width="68" height="32" rx="8" fill="${VATE}" stroke="${INK}" stroke-width="1.4" ${tag}/>\n` + txt(x, y + 6, formel(f), `font-size="17" font-weight="bold"`);
    // pilar ut: upp, ner, snett – minst tre, varav en uppåt och en nedåt
    const ut_ = [[0, -1], [0, 1], [-1, -0.4], [1, 0.5], [0.8, -0.8]];
    ut_.forEach(([dx, dy]) => { const L = 70 + Math.hypot(dx, dy) * 6; const nx = dx / Math.hypot(dx, dy), ny = dy / Math.hypot(dx, dy); ut += vagPil(x + nx * 36, y + ny * 20, x + nx * L, y + ny * L, SYRE, 1.6, `data-ut="1" data-riktning="${dy < 0 ? 'upp' : dy > 0 ? 'ner' : 'sida'}" ${tag}`); });
  });
  ut += txt(540, 130, 'växthusgaser tar upp värmestrålning', 'font-size="13" font-style="italic" text-anchor="start"') + txt(540, 148, 'och sänder ut den åt alla håll', 'font-size="13" font-style="italic" text-anchor="start"');
  skriv('k3-j1.svg', W, HH, 'Solstrålning passerar genom atmosfären och värmer jordytan. Jordytan sänder ut värmestrålning uppåt. En del av den tas upp av växthusgasmolekyler, som sedan sänder ut strålning åt alla håll – en del uppåt mot rymden och en del tillbaka mot jorden. Annan värmestrålning lämnar atmosfären utan att tas upp', ut);
}

// ---------- J2. Svavlets väg (5.2) – fem steg, pH-skala som i Syror och baser ----------
{
  const W = 900, HH = 310, ST = 160, X0 = 20, CY = 150;
  let ut = '';
  const mitt = i => X0 + i * (ST + 12) + ST / 2;
  // steg 1: kolbit med gula prickar
  ut += `  <path d="M${mitt(0) - 40} 140 L${mitt(0) - 20} 110 L${mitt(0) + 30} 118 L${mitt(0) + 42} 160 L${mitt(0) + 10} 182 L${mitt(0) - 36} 172 Z" fill="${KOL}" stroke="${INK}" stroke-width="1.5" data-steg="1"/>\n`;
  [[-18, 140], [4, 128], [20, 156], [-8, 166]].forEach(([dx, dy]) => { ut += cirkel(mitt(0) + dx, dy, 3, GUL, INK, 0.8); });
  // steg 2: skorsten med rök
  ut += rekt(mitt(1) - 16, 110, 32, 80, GRA, `stroke="${INK}" stroke-width="1.5" data-steg="2"`) + `  <path d="M${mitt(1)} 108 c-14 -14 4 -28 -6 -40 c14 8 20 -8 10 -20" fill="none" stroke="${GRA}" stroke-width="5" stroke-linecap="round"/>\n`;
  // steg 3: moln
  ut += `  <path d="M${mitt(2) - 40} 150 a18 18 0 0 1 22 -26 a24 24 0 0 1 44 -4 a18 18 0 0 1 18 30 Z" fill="${VATE}" stroke="${INK}" stroke-width="1.5" data-steg="3"/>\n`;
  // steg 4: regndroppar från moln
  ut += `  <path d="M${mitt(3) - 40} 130 a18 18 0 0 1 22 -26 a24 24 0 0 1 44 -4 a18 18 0 0 1 18 30 Z" fill="${VATE}" stroke="${INK}" stroke-width="1.5" data-steg="4"/>\n`;
  [-28, -8, 12, 32].forEach((dx, k) => { ut += `  <path d="M${mitt(3) + dx} ${142 + (k % 2) * 8} q-5 10 0 16 q5 -6 0 -16 Z" fill="${VATSKA}" stroke="${INK}" stroke-width="1"/>\n`; });
  // steg 5: sjö med fisk och pH-skala i miniatyr (samma färgstopp som ph-skalan.svg)
  ut += `  <ellipse cx="${mitt(4)}" cy="160" rx="66" ry="22" fill="${VATSKA}" stroke="${INK}" stroke-width="1.5" data-steg="5"/>\n  <path d="M${mitt(4) - 24} 160 l22 -9 v18 Z M${mitt(4) - 4} 160 l16 -8 l6 8 l-6 8 Z" fill="${INK}"/>\n`;
  const STOPP = [[0, '#C0392B'], [3, '#E07B39'], [5, '#E8C547'], [7, '#5a9668'], [9, '#a8c4d8'], [14, '#2F4F8F']];
  ut += `  <defs><linearGradient id="ph" x1="0" x2="1" y1="0" y2="0">${STOPP.map(([ph, f]) => `<stop offset="${r2(ph / 14 * 100)}%" stop-color="${f}"/>`).join('')}</linearGradient></defs>\n`;
  const px0 = mitt(4) - 60, pxw = 120, py = 100;
  ut += `  <rect x="${px0}" y="${py}" width="${pxw}" height="10" rx="2" fill="url(#ph)" stroke="${INK}" stroke-width="1" data-del="ph-skala"/>\n`;
  [0, 7, 14].forEach(v => { ut += txt(px0 + pxw * v / 14, py + 24, String(v), 'font-size="10"'); });
  ut += pil(px0 + pxw * 7 / 14, py - 4, px0 + pxw * 4.5 / 14, py - 4, SYRE, 1.6, 'data-del="ph-pil"');
  // etiketter under stegen
  [['svavel i bränslet'], [formel('SO₂ bildas')], ['reagerar med syre', 'och vatten'], [formel('H₂SO₄ i nederbörden')], ['pH sjunker']].forEach((rader, i) => { rader.forEach((t, k) => { ut += txt(mitt(i), 222 + k * 17, t, 'font-size="13" font-weight="bold"'); }); });
  // pilar mellan stegen (fyra) och vindpil
  for (let i = 0; i < 4; i++) { ut += pil(mitt(i) + 54, 160, mitt(i + 1) - 54, 160, INK, 2, 'data-pil="steg"'); }
  ut += pil(mitt(1) - 30, 60, mitt(3) + 30, 60, GRA, 1.4, 'data-pil="vind"') + txt(mitt(2), 48, 'kan spridas hundratals kilometer', `font-size="12" font-style="italic" fill="${GRA}"`);
  skriv('k3-j2.svg', W, HH, 'Fem steg i rad. Svavel i bränslet blir svaveldioxid i skorstenen, sprids med vinden, reagerar i molnet till svavelsyra, faller som surt regn och sänker pH-värdet i en sjö', ut);
}

// ---------- J3. Tungmetallerna (5.3) – tabell + näringskedjetrappa ----------
{
  const W = 800, HH = 300, KOLX = [0, 130, 250, 400], RH = 40, TOP = 46;
  let ut = '';
  const mitt = i => (KOLX[i] + KOLX[i + 1]) / 2;
  ['Ämne', 'Beteckning', 'Finns i'].forEach((t, i) => { ut += txt(mitt(i), 28, t, `font-size="14" font-style="italic" fill="${SIGN}"`); });
  ut += linje(16, TOP - 8, KOLX[3] + 10, TOP - 8, INK, 1.4);
  const rader = [['Kvicksilver', 'Hg', 'kol, torv'], ['Bly', 'Pb', 'kol'], ['Kadmium', 'Cd', 'kol, torv'], ['Arsenik', 'As', 'kol']];
  rader.forEach(([a, b, c], r) => {
    const y = TOP + r * RH + RH / 2;
    ut += txt(mitt(0), y + 6, a, `font-size="16" data-kolumn="amne" data-rad="${r + 1}"`) + txt(mitt(1), y + 6, b, `font-size="16" font-weight="bold" data-kolumn="beteckning" data-rad="${r + 1}"`) + txt(mitt(2), y + 6, c, `font-size="15" data-kolumn="finns" data-rad="${r + 1}"`);
    if (r < 3) ut += linje(16, TOP + (r + 1) * RH, KOLX[3] + 10, TOP + (r + 1) * RH, INK, 0.8);
  });
  ut += linje(16, TOP + 4 * RH, KOLX[3] + 10, TOP + 4 * RH, INK, 1.4);
  ut += rekt(16, TOP + 4 * RH + 14, KOLX[3] - 6, 30, SIGN, 'rx="5" data-del="markerad-rad"') + txt((KOLX[3] + 10) / 2, TOP + 4 * RH + 34, 'kan inte brytas ner — atomerna finns kvar för alltid', `font-size="13" font-weight="bold" fill="${VATE}"`);
  // näringskedja: fyra steg med växande antal prickar
  const NX = 460, steg = [['plankton', 1], ['småfisk', 3], ['större fisk', 6], ['rovfågel', 10]];
  steg.forEach(([namn, n], i) => {
    const x = NX + i * 80, y = 230 - i * 44;
    ut += rekt(x, y, 70, 230 - y + 20, VATE, `stroke="${INK}" stroke-width="1.2" data-trappsteg="${i + 1}" data-prickar="${n}"`);
    for (let k = 0; k < n; k++) { ut += cirkel(x + 12 + (k % 4) * 15, y + 12 + Math.floor(k / 4) * 12, 3.2, KOL, 'none', 0, `data-prick="${i + 1}"`); }
    ut += txt(x + 35, 268, namn, 'font-size="12"');
  });
  ut += txt(NX + 160, 290, 'halten ökar uppåt i näringskedjan', 'font-size="13" font-style="italic"');
  skriv('k3-j3.svg', W, HH, 'En tabell med kvicksilver, bly, kadmium och arsenik, deras kemiska beteckningar och vilka bränslen de finns i. Bredvid visar en trappa hur halten ökar uppåt i näringskedjan', ut);
}

// ================= KONTROLLER mot de skrivna filerna (specens "Kontroller" + ordern §2) =================
const las = f => fs.readFileSync(path.join(UT, f), 'utf8');
const element = (s, filter) => [...s.matchAll(/<(text|circle|line|rect|path|ellipse|polygon|g)\b([^>]*)>/g)].map(m => { const at = { _tag: m[1] }; for (const a of m[2].matchAll(/([a-z0-9-]+)="([^"]*)"/g)) at[a[1]] = a[2]; return at; }).filter(filter);
const rapport = [];
function kolla(namn, villkor, text) { rapport.push(`${villkor ? 'OK ' : 'FEL'} ${namn}: ${text}`); if (!villkor) process.exitCode = 1; }
const monoton = (a, upp = true) => a.every((v, i) => i === 0 || (upp ? v > a[i - 1] : v < a[i - 1]));
{ // E1
  const s = las('k3-e1.svg');
  const vatten = element(s, e => e['data-del'] === 'vatten'), org = element(s, e => e['data-del'] === 'organiskt');
  kolla('E1 paneler', vatten.length === 3 && new Set(vatten.map(v => v.width)).size === 1 && new Set(vatten.map(v => v.y)).size === 1 && new Set(vatten.map(v => v.height)).size === 1, `3 paneler, samma bredd ${vatten[0].width} och samma horisont y=${+vatten[0].y + +vatten[0].height}`);
  kolla('E1 organiskt lager', org.length === 3 && monoton(org.map(o => +o.y)), `gröna lagret i alla tre, allt djupare: y ${org.map(o => o.y).join(' → ')}`);
}
{ // E2: grundfigurens grupper byte-identiska med A10, slingan inom gruppen, förbränningspilen kraftigast
  const s = las('k3-e2.svg'), a10 = fs.readFileSync(path.join(ROT, 'kapitel', 'organisk-kemi', 'delkapitel', 'kolatomen', 'img', 'k1-a10.svg'), 'utf8').replace(/\r\n/g, '\n');
  const grupp = (t, id) => (t.match(new RegExp(`  <g id="${id}">[\\s\\S]*?  </g>\\n`)) || [''])[0];
  const lika = ['atmosfar', 'vaxt', 'djur', 'mark', 'pilar'].filter(id => grupp(s, id) && grupp(s, id) === grupp(a10, id));
  kolla('E2 grundfigur', lika.length === 5, `grupperna ${lika.join(', ')} byte-identiska med k1-a10.svg; utpil ändrad (heldragen, "begravning"), geologisk-slinga fylld`);
  const sl = grupp(s, 'geologisk-slinga');
  kolla('E2 slingan', /berggrund/.test(sl) && ['kol', 'olja', 'naturgas'].every(n => new RegExp(`data-del="${n}"`).test(sl)) && /data-pil="ner"/.test(sl) && /data-pil="forbranning"/.test(sl) && /miljontals år/.test(sl) && /år till årtionden/.test(sl), 'berggrund med kol/olja/naturgas, pil ner, förbränningspil, båda tidsangivelserna – allt inom gruppen');
  const fb = element(sl, e => e['data-pil'] === 'forbranning' && e['stroke-width'])[0], ovriga = element(grupp(s, 'pilar'), e => e['stroke-width']).map(e => +e['stroke-width']);
  kolla('E2 förbränningspilen', fb && +fb['stroke-width'] > Math.max(...ovriga), `förbränning ${fb['stroke-width']} px mot kretsloppspilarnas ${Math.max(...ovriga)} px`);
  kolla('E2 A10 orörd', !/data-del="berggrund"/.test(a10) && /<g id="geologisk-slinga"><!--/.test(a10), 'k1-a10.svg har fortfarande den tomma reserverade gruppen');
}
{ // E3
  const s = las('k3-e3.svg');
  const st = element(s, e => e['data-andel']).map(e => ({ p: +e['data-andel'], w: +e.width }));
  const k = st.map(x => x.w / x.p);
  kolla('E3 staplar', st.length === 3 && Math.max(...k) - Math.min(...k) < 0.01, `bredd/procent lika (${k[0].toFixed(2)} px per %): ${st.map(x => x.p + ' % → ' + x.w.toFixed(0) + ' px').join(', ')}; summan ${st.reduce((a, x) => a + x.p, 0)} % av 100`);
}
{ // F1
  const s = las('k3-f1.svg');
  const fas = element(s, e => e['data-fas']).sort((a, b) => +a['data-ordning'] - +b['data-ordning']).map(e => e['data-fas']);
  kolla('F1 faser', fas.join(',') === 'naturgas,olja,vatten', `uppifrån och ner: ${fas.join(', ')}`);
  kolla('F1 förstoring', element(s, e => e['data-korn']).length >= 6, `${element(s, e => e['data-korn']).length} korn med mellanrum i förstoringen`);
}
{ // F2
  const s = las('k3-f2.svg');
  const t = element(s, e => e['data-temp']).map(e => +e['data-temp']), k = element(s, e => e['data-kedja']).map(e => +e['data-kedja']);
  kolla('F2 temperatur', t.length === 6 && monoton(t, true), `uppifrån och ner ${t.join(' < ')} °C (sjunker monotont uppåt)`);
  kolla('F2 kedjelängd', k.length === 6 && monoton(k, true), `kedjemarkeringar ${k.join(' < ')} segment (växer monotont nedåt)`);
  kolla('F2 uttag', element(s, e => e['data-uttag']).length / 2 === 6, '6 uttag');
}
{ // F3
  const s = las('k3-f3.svg');
  const r1 = element(s, e => e['data-rad'] === '1'), r2 = element(s, e => e['data-rad'] === '2');
  const C = r => r.filter(e => e['data-atom'] === 'C').length, H = r => r.filter(e => e['data-atom'] === 'H').length;
  kolla('F3 kolatomer', C(r1) === 16 && C(r2) === 16, `övre raden ${C(r1)} C = nedre ${C(r2)} C (8 + 8)`);
  kolla('F3 väteatomer', H(r1) === H(r2), `övre raden ${H(r1)} H = nedre ${H(r2)} H`);
  // fyra bindningar per kolatom ur datan: i verktyget byggs kedjorna av alkan(); dubbelbindningen ersätter två väten
  kolla('F3 dubbelbindning', element(s, e => e['data-del'] === 'hoger' && e['data-bind'] === 'C-C' && e.stroke === SIGN).length === 2, 'två gröna streck (dubbelbindning) i högra delens brottände');
}
{ // G1
  const s = las('k3-g1.svg');
  const h = element(s, e => e['data-kolhalt']).map(e => +e.width), st = element(s, e => e['data-steg']).map(e => +e.y);
  kolla('G1 staplar', h.length === 4 && monoton(h), `kolhaltsstaplar ${h.map(x => x.toFixed(0)).join(' < ')} px`);
  kolla('G1 trappan', monoton(st, false), `stegen stiger: y ${st.join(' > ')}`);
  kolla('G1 antracit utan namn', !/antracit/i.test(s) && /ännu mer förkolnat/.test(s), 'fjärde steget märkt "ännu mer förkolnat", streckad kontur');
}
{ // G2
  const s = las('k3-g2.svg');
  kolla('G2 luft', element(s, e => e['data-del'] === 'luftinlopp-stangt').length === 1 && element(s, e => e['data-del'] === 'luftinlopp').length === 2, 'torrdestillationsugnen: överkryssat inlopp; masugnen: luftpil in');
}
{ // H2
  const s = las('k3-h2.svg');
  for (let r = 1; r <= 3; r++) {
    const n = (sida, t) => element(s, e => e['data-rad'] === String(r) && e['data-sida'] === sida && e['data-atom'] === t).length;
    kolla(`H2 rad ${r}`, n('in', 'C') === n('ut', 'C') && n('in', 'H') === n('ut', 'H') && n('in', 'O') === n('ut', 'O'), `in: ${n('in', 'C')} C, ${n('in', 'H')} H, ${n('in', 'O')} O – ut: ${n('ut', 'C')} C, ${n('ut', 'H')} H, ${n('ut', 'O')} O`);
  }
}
{ // H3
  const s = las('k3-h3.svg');
  const sot = l => element(s, e => e['data-sot'] === '1' && e['data-laga'] === l).length, ut_ = l => element(s, e => e['data-ut'] && e['data-laga'] === l && e._tag === 'line').map(e => e['data-ut']);
  kolla('H3 lågor', sot('bla') === 0 && sot('gul') > 0 && ut_('gul').includes('CO') && ut_('gul').includes('sot') && !ut_('bla').includes('CO'), `blå: 0 sotprickar, ut ${[...new Set(ut_('bla'))].join('/')}; gul: ${sot('gul')} sotprickar, ut ${[...new Set(ut_('gul'))].join('/')}`);
}
{ // J1
  const s = las('k3-j1.svg');
  for (let m = 1; m <= 2; m++) {
    const ut_ = element(s, e => e['data-molekyl'] === String(m) && e['data-ut'] === '1' && e._tag === 'path');
    const r = ut_.map(e => e['data-riktning']);
    kolla(`J1 molekyl ${m}`, ut_.length >= 3 && r.includes('upp') && r.includes('ner'), `${ut_.length} pilar ut (${r.join(', ')})`);
  }
  kolla('J1 rakt ut', element(s, e => e['data-traff'] === 'ingen' && e._tag === 'path').length >= 1, `${element(s, e => e['data-traff'] === 'ingen' && e._tag === 'path').length} värmestrålningspilar lämnar bilden utan att träffa något`);
  const solpilar = element(s, e => e['data-stralning'] === 'sol' && e._tag === 'line');
  kolla('J1 solstrålning', solpilar.length === 3 && solpilar.every(l => +l.y2 > 380), 'tre raka gula pilar hela vägen ner till jordytan');
  // ingen heldragen linje/kant i atmosfärens övre del: inga <line>/<rect>-konturer som sträcker sig över bredden ovanför jordytan
  const kanter = element(s, e => (e._tag === 'line' && Math.abs(+e.y1 - +e.y2) < 2 && Math.abs(+e.x2 - +e.x1) > 400) || (e['data-del'] === 'atmosfar' && e.stroke && e.stroke !== 'none'));
  kolla('J1 ingen kupa', kanter.length === 0, 'inga vågräta linjer eller konturer som avgränsar atmosfären uppåt; fältet tonar ut med gradient');
}
{ // J2
  const s = las('k3-j2.svg');
  kolla('J2 steg och pilar', element(s, e => e['data-steg']).length === 5 && element(s, e => e['data-pil'] === 'steg' && e._tag === 'line').length === 4, '5 steg, 4 pilar');
  kolla('J2 pH-skala', /data-del="ph-skala"/.test(s) && /id="ph"/.test(s) && /#C0392B/.test(s) && /#2F4F8F/.test(s), 'pH-skala 0–14 med ph-skalan.svg:s färgstopp, pil som visar sjunkande pH');
  kolla('J2 formler som SVG-text', /SO<tspan[^>]*>2<\/tspan>/.test(s) && />SO<\/tspan><tspan[^>]*>4<\/tspan>/.test(s) && !/\\\(/.test(s), 'SO₂ och H₂SO₄ med nedsänkta siffror i tspan, ingen MathJax');
}
{ // J3
  const s = las('k3-j3.svg');
  const p = element(s, e => e['data-trappsteg']).map(e => +e['data-prickar']), verkliga = [1, 2, 3, 4].map(i => element(s, e => e['data-prick'] === String(i)).length);
  kolla('J3 näringskedjan', monoton(p) && p.join(',') === verkliga.join(','), `prickar ${verkliga.join(' < ')} uppåt i trappan`);
  const bet = [1, 2, 3, 4].map(r => (s.match(new RegExp(`data-kolumn="beteckning" data-rad="${r}"[^>]*>([^<]*)<`)) || [])[1]);
  kolla('J3 beteckningar', bet.join(',') === 'Hg,Pb,Cd,As', bet.join(', '));
}
console.log(`${antal} SVG skrivna till ${path.relative(ROT, UT)}`);
console.log(rapport.join('\n'));
