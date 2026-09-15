// bilder-svg-kolvaten.js – SVG-bilderna till Organisk kemi, delkapitel 2 "Kolväten" (avsnitt 1: B1–B4, avsnitt 2: B6–B7, avsnitt 3: C1–C3, avsnitt 4: D1–D3)
// (arbetsorder 1 Kolväten, 2026-09-15; ritade efter bildrutorna i doc/leveranser/kolvaten/avsnitt-1.md – specfilen
// dk2-avsnitt-1-bildspecar.md fanns inte i leveransen). Skriver till kapitel/organisk-kemi/delkapitel/kolvaten/img/k2-b{n}.svg.
// Kör: node verktyg/bilder-svg-kolvaten.js
//
//   k2-b1  Kolstommen och väteatomerna      1.1    k2-b3  Fyra sätt att visa samma kolväte   1.3
//   k2-b2  Alkanserien som trappa           1.2    k2-b4  Så ritar du en strukturformel      1.3
//   k2-b6  Butan i en tändare               2.2    k2-b7  Kokpunkten stiger med kedjans längd 2.3   (k2-b5 kärret: AI-bild, nyckla-gron.js)
//   k2-c1  n-butan och isobutan            3.1    k2-c2  Etan, eten och etyn (bokstavsstil) 3.2    k2-c3  Tre serier kolväten  3.3
//   k2-d1  Monomer och polymer              4.1    k2-d2  Eten polymeriserar                 4.2    k2-d3  Fyra vanliga plaster 4.3
//
// Palett enligt ordern: konturer/text #2d4a35, signaturfärg #5a9668, kol #3a3a3a, väte #f5f0e4 med kontur, grått #8A8A8A.
// Papper #ece2c8 ritas inte (transparent bakgrund, som Kolatomens bilder). Typsnitt: Georgia-fallback.
//
// Molekylerna byggs som data (atomer + bindningar) och ritas ur datan; varje atom och bindning får data-attribut
// (data-atom, data-bind, data-rad, data-ruta, data-kolumn, data-mark) så att atomantalen i ordern §3 kontrolleras
// programmatiskt mot den skrivna SVG-filen (kontrollen körs sist och avbryter med fel om något inte stämmer).
'use strict';
const fs = require('fs'), path = require('path');
const UT = path.join(__dirname, '..', 'kapitel', 'organisk-kemi', 'delkapitel', 'kolvaten', 'img');
fs.mkdirSync(UT, { recursive: true });
const INK = '#2d4a35', SIGN = '#5a9668', KOL = '#3a3a3a', VATE = '#f5f0e4', GRA = '#8A8A8A';
const FONT = `font-family="Georgia, 'Times New Roman', serif"`;
const r2 = x => Math.round(x * 100) / 100;
const svg = (w, h, titel, inneh) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-labelledby="t">
  <title id="t">${titel}</title>
${inneh}</svg>
`;
const txt = (x, y, t, extra = '') => `  <text x="${r2(x)}" y="${r2(y)}" ${/fill=/.test(extra) ? '' : `fill="${INK}"`} ${/font-size=/.test(extra) ? '' : 'font-size="16"'} ${/text-anchor=/.test(extra) ? '' : 'text-anchor="middle"'} ${FONT} ${extra}>${t}</text>\n`;
const SUBT = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
// molekylformel i Unicode → tspans med nedsänkta index
const formel = s => s.replace(/([₀-₉]+)([^₀-₉]*)/g, (_, ix, rest) => `<tspan font-size="0.7em" dy="0.3em">${[...ix].map(c => SUBT[c]).join('')}</tspan>` + (rest ? `<tspan dy="-0.3em">${rest}</tspan>` : ''));
const linje = (x1, y1, x2, y2, farg = INK, bredd = 2, extra = '') => `  <line x1="${r2(x1)}" y1="${r2(y1)}" x2="${r2(x2)}" y2="${r2(y2)}" stroke="${farg}" stroke-width="${bredd}" stroke-linecap="round" ${extra}/>\n`;
const cirkel = (x, y, r, fyll, kontur = INK, bredd = 1.2, extra = '') => `  <circle cx="${r2(x)}" cy="${r2(y)}" r="${r}" fill="${fyll}" stroke="${kontur}" stroke-width="${bredd}" ${extra}/>\n`;
let antal = 0;
const skriv = (fil, w, h, titel, inneh) => { fs.writeFileSync(path.join(UT, fil), svg(w, h, titel, inneh)); antal++; };

// ---------- strukturformel med bokstäver: rak alkan med n kolatomer, kolatom i som centrum (x0 + i·DX, y) ----------
// Returnerar { atomer: [{typ, x, y, c}], bind: [{typ:'C-C'|'C-H', a, b}] } – c = index på den kolatom vätet sitter på.
const DX = 46, DY = 34, HB = 11, HE = 23;   // avstånd mellan kolatomer, avstånd till väte, streckets start/slut från centrum
function alkan(n, x0, y, medVate = true) {
  const atomer = [], bind = [];
  for (let i = 0; i < n; i++) atomer.push({ typ: 'C', x: x0 + i * DX, y, c: i });
  for (let i = 0; i < n - 1; i++) bind.push({ typ: 'C-C', a: i, b: i + 1 });
  if (medVate) {
    for (let i = 0; i < n; i++) {
      const c = atomer[i], lagg = (dx, dy) => { atomer.push({ typ: 'H', x: c.x + dx, y: c.y + dy, c: i }); bind.push({ typ: 'C-H', a: i, b: atomer.length - 1 }); };
      lagg(0, -DY); lagg(0, DY);                       // upp och ner: alla kolatomer
      if (i === 0) lagg(-DX, 0);                       // ändarna: ett väte utåt
      if (i === n - 1) lagg(DX, 0);
    }
  }
  return { atomer, bind };
}
// ritar en alkan-data: strecken mellan atomcentrum (kortade med HB/HE), bokstäverna ovanpå. färger per atomtyp/bindningstyp
function ritaStruktur(m, o = {}) {
  const fC = o.fC || INK, fH = o.fH || INK, fCC = o.fCC || INK, fCH = o.fCH || INK, tag = o.tag || '', fs = o.fontsize || 22;
  let s = '';
  for (const b of m.bind) {
    const A = m.atomer[b.a], B = m.atomer[b.b], dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
    const k = b.typ === 'C-C' ? 13 : HB, e = b.typ === 'C-C' ? 13 : HE;
    const markS = o.mark && o.mark(B) && (b.typ === 'C-H' || B.typ === 'C'), farg = markS ? SIGN : (b.typ === 'C-C' ? fCC : fCH);
    s += linje(A.x + ux * k, A.y + uy * k, b.typ === 'C-C' ? B.x - ux * e : A.x + ux * e, b.typ === 'C-C' ? B.y - uy * e : A.y + uy * e, farg, 2.2, `data-bind="${b.typ}" ${markS ? 'data-mark="1" ' : ''}${tag}`);
  }
  for (const a of m.atomer) {
    const mark = o.mark && o.mark(a);
    s += txt(a.x, a.y + fs * 0.35, a.typ, `font-size="${a.typ === 'C' ? fs : fs * 0.86}" fill="${mark ? SIGN : (a.typ === 'C' ? fC : fH)}" ${a.typ === 'C' ? 'font-weight="bold"' : ''} data-atom="${a.typ}" ${mark ? 'data-mark="1"' : ''} ${tag}`);
  }
  return s;
}
const bredd = n => (n - 1) * DX + 2 * DX;   // strukturformelns bredd inkl. ändväten

// ---------- kulmodell: vinklad (sicksack) kolkedja med väten fördelade i de lediga riktningarna ----------
// Kolatomerna ligger i sicksack (±VY), varje kolatom får sina väten i de vinklar där den inte har någon kolgranne.
function modell(n, cx, cy, o = {}) {
  const CC = o.cc || 34, CH = o.ch || 28, VY = o.vy || 14, rC = o.rc || 15, rH = o.rh || 9.5, tag = o.tag || '';
  const kol = [];
  const x0 = cx - (n - 1) * CC * 0.92 / 2;
  for (let i = 0; i < n; i++) kol.push({ x: x0 + i * CC * 0.92, y: cy + (n === 1 ? 0 : (i % 2 ? -VY : VY)) });
  const vaten = [];
  for (let i = 0; i < n; i++) {
    const c = kol[i], grannar = [];
    if (i > 0) grannar.push(Math.atan2(kol[i - 1].y - c.y, kol[i - 1].x - c.x));
    if (i < n - 1) grannar.push(Math.atan2(kol[i + 1].y - c.y, kol[i + 1].x - c.x));
    let vinklar;
    if (grannar.length === 0) { vinklar = [-Math.PI / 2, Math.PI / 6, 5 * Math.PI / 6, Math.PI / 2 + 0.35]; }              // metan: tre runt om + ett framför
    else if (grannar.length === 1) { const a = grannar[0] + Math.PI; vinklar = [a - 1.15, a, a + 1.15]; }               // ändkol: tre väten bort från grannen
    else { let a = grannar[0], b = grannar[1]; let mitt = Math.atan2(Math.sin(a) + Math.sin(b), Math.cos(a) + Math.cos(b)) + Math.PI; vinklar = [mitt - 0.75, mitt + 0.75]; }   // mittkol: två i den stora luckan
    for (const v of vinklar) vaten.push({ x: c.x + Math.cos(v) * CH, y: c.y + Math.sin(v) * CH, c: i, fram: grannar.length === 0 && v > Math.PI / 2 });
  }
  let s = '';
  for (const h of vaten.filter(h => !h.fram)) s += cirkel(h.x, h.y, rH, VATE, INK, 1.2, `data-atom="H" ${tag}`);
  for (let i = 0; i < n - 1; i++) s += linje(kol[i].x, kol[i].y, kol[i + 1].x, kol[i + 1].y, INK, 3, `data-bind="C-C" ${tag}`);
  for (const c of kol) s += cirkel(c.x, c.y, rC, KOL, INK, 1.2, `data-atom="C" ${tag}`);
  for (const h of vaten.filter(h => h.fram)) s += cirkel(h.x, h.y, rH, VATE, INK, 1.2, `data-atom="H" ${tag}`);
  return { svg: s, kol, vaten };
}

// ---------- B1. Kolstommen och väteatomerna ----------
{
  const W = 760, HH = 260;
  let ut = '';
  // metan till vänster, butan till höger; kolstomme (C + C–C) i signaturfärg, väte (H + C–H) i grått
  const m1 = alkan(1, 120, 110), m4 = alkan(4, 330, 110);
  const stil = { fC: SIGN, fCC: SIGN, fH: GRA, fCH: GRA };
  ut += ritaStruktur(m1, { ...stil, tag: 'data-molekyl="metan"' });
  ut += ritaStruktur(m4, { ...stil, tag: 'data-molekyl="butan"' });
  // antal väten per kolatom i butan
  m4.atomer.filter(a => a.typ === 'C').forEach(c => { const n = m4.atomer.filter(a => a.typ === 'H' && a.c === c.c).length; ut += `  <rect x="${c.x - 11}" y="${c.y + 44}" width="22" height="22" rx="4" fill="${SIGN}" fill-opacity="0.15" stroke="none"/>\n` + txt(c.x, c.y + 60, String(n), `font-size="14" fill="${SIGN}" font-weight="bold" data-antal="${n}"`); });
  ut += txt(120, 200, 'metan, ' + formel('CH₄'), 'font-size="17"') + txt(330 + 1.5 * DX, 200, 'butan, ' + formel('C₄H₁₀'), 'font-size="17"');
  ut += txt(W / 2, HH - 18, 'Grön stomme av kol – grått väte fyller ut de bindningar som blir över.', 'font-size="17" font-weight="bold"');
  skriv('k2-b1.svg', W, HH, 'Metan och butan som strukturformler. Kolatomerna och strecken mellan dem är gröna, väteatomerna gråa. Under varje kolatom i butan står hur många väteatomer den bär: tre, två, två, tre', ut);
}

// ---------- B2. Alkanserien som trappa (omritad efter rättelse 2026-09-15, doc/leveranser/kolvaten/rattelse-b2.md) ----------
// Strukturformlerna ritas med samma rutin och samma värden som B3 (alkan(): DX 46, ritaStruktur(): fontsize 19). Den
// tillkomna kolatomen, dess två väten och de tre strecken som hör till dem i signaturfärg – ingen ruta, ingen platta.
// Tre kolumner: namn, strukturformel, molekylformel. Ingen "+ CH₂", ingen fetad rad. Metanraden utan markering.
{
  const W = 760, RH = 92, HH = 4 * RH + 16;
  let ut = '';
  const namn = ['metan', 'etan', 'propan', 'butan'], form = ['CH₄', 'C₂H₆', 'C₃H₈', 'C₄H₁₀'];
  for (let r = 0; r < 4; r++) {
    const n = r + 1, y = 50 + r * RH, x0 = 250;
    const m = alkan(n, x0, y);
    const sista = n - 1;   // den tillkomna kolatomen med sina två väten upp och ner
    const arMark = a => r > 0 && ((a.typ === 'C' && a.c === sista) || (a.typ === 'H' && a.c === sista && a.x === m.atomer[sista].x));
    ut += ritaStruktur(m, { tag: `data-rad="${r}"`, mark: arMark, fontsize: 19 });
    ut += txt(150, y + 7, namn[r], 'font-size="18" text-anchor="end"');
    ut += txt(W - 60, y + 7, formel(form[r]), 'font-size="22" text-anchor="end"');
  }
  skriv('k2-b2.svg', W, HH, 'Fyra strukturformler under varandra som en trappa: metan, etan, propan, butan. I varje rad utom den översta är den tillkomna kolatomen med sina två väteatomer markerad med grönt. Till höger står molekylformlerna', ut);
}

// ---------- B3. Fyra sätt att visa samma kolväte (tabell) ----------
{
  const KOLX = [0, 110, 240, 500, 780], W = KOLX[4], RH = 100, TOP = 44, HH = TOP + 4 * RH + 10;
  let ut = '';
  const rubrik = ['Namn', 'Molekylformel', 'Strukturformel', 'Molekylmodell'];
  rubrik.forEach((t, i) => { ut += txt((KOLX[i] + KOLX[i + 1]) / 2, 28, t, 'font-size="15" font-style="italic"'); });
  ut += linje(20, TOP - 6, W - 20, TOP - 6, INK, 1.4);
  const namn = ['metan', 'etan', 'propan', 'butan'], form = ['CH₄', 'C₂H₆', 'C₃H₈', 'C₄H₁₀'];
  for (let r = 0; r < 4; r++) {
    const n = r + 1, y = TOP + r * RH + RH / 2;
    ut += txt((KOLX[0] + KOLX[1]) / 2, y + 6, namn[r], 'font-size="18"');
    ut += txt((KOLX[1] + KOLX[2]) / 2, y + 7, formel(form[r]), 'font-size="22"');
    const m = alkan(n, (KOLX[2] + KOLX[3]) / 2 - (n - 1) * DX / 2, y);
    ut += ritaStruktur(m, { tag: `data-rad="${r}" data-kolumn="struktur"`, fontsize: 19 });
    ut += modell(n, (KOLX[3] + KOLX[4]) / 2, y, { tag: `data-rad="${r}" data-kolumn="modell"` }).svg;
    if (r < 3) ut += linje(20, TOP + (r + 1) * RH, W - 20, TOP + (r + 1) * RH, INK, 0.8);
  }
  skriv('k2-b3.svg', W, HH, 'Tabell med fyra rader: metan, etan, propan och butan. Kolumnerna visar namn, molekylformel, strukturformel med streck och molekylmodell med kulor, där kolkedjan är vinklad', ut);
}

// ---------- B4. Så ritar du en strukturformel (fyra rutor) ----------
{
  const RB = 205, G = 14, W = 4 * RB + 3 * G + 2 * 16, HH = 262;
  let ut = '';
  const steg = ['Rita kolatomerna', 'Sätt ut bindningarna', 'Fyll på med väte', 'Räkna ihop'];
  const under = ['butan = fyra kolatomer', 'ett streck mellan varje par', 'fyra streck på varje kolatom', '4 kolatomer, 10 väteatomer'];
  for (let i = 0; i < 4; i++) {
    const x = 16 + i * (RB + G), cx = x + RB / 2, y = 22;
    ut += `  <rect x="${x}" y="${y}" width="${RB}" height="${HH - 44}" rx="8" fill="none" stroke="${INK}" stroke-width="1.2" data-ruta="${i + 1}"/>\n`;
    ut += cirkel(x + 20, y + 20, 13, SIGN, SIGN, 1) + txt(x + 20, y + 25, String(i + 1), 'font-size="15" fill="#ffffff" font-weight="bold"');
    ut += txt(cx + 12, y + 25, steg[i], 'font-size="15" font-weight="bold"');
    const my = 128, x0 = cx - 1.5 * DX, tag = `data-ruta="${i + 1}"`;
    // strukturformlerna skalas ner (0.8) kring rutans mitt så att ändvätena ryms i rutan
    const g = inre => `  <g transform="translate(${r2(cx)} ${my}) scale(0.8) translate(${r2(-cx)} ${-my})">\n${inre}  </g>\n`;
    if (i === 0) { const m = alkan(4, x0, my, false); m.bind = []; ut += g(ritaStruktur(m, { tag })); }
    else if (i === 1) { ut += g(ritaStruktur(alkan(4, x0, my, false), { tag })); }
    else if (i === 2) { ut += g(ritaStruktur(alkan(4, x0, my), { tag, mark: a => a.typ === 'H' })); }
    else { ut += txt(cx, my + 14, formel('C₄H₁₀'), `font-size="44" ${tag}`); }
    ut += txt(cx, HH - 40, under[i], `font-size="${i === 3 ? 15 : 14}" font-style="italic"`);
  }
  skriv('k2-b4.svg', W, HH, 'Fyra numrerade rutor. Ett: fyra kolatomer i rad. Två: streck mellan dem. Tre: gröna väteatomer på alla lediga platser, tio stycken. Fyra: molekylformeln C4H10', ut);
}

// ---------- B6. Butan i en tändare (avsnitt 2, arbetsorder 2 2026-09-15) ----------
// Genomskinlig tändare i genomskärning: flytande butan nedtill (ljusblå vätska #a8c4d8, som i Kolatomens palett), gas
// ovanför (pappret), små pilar vid vätskeytan (förångning) och en pil upptill genom ventilen. Ingen låga (ordern §4).
const VATSKA = '#a8c4d8';
const tunnPil = (x1, y1, x2, y2, farg, bredd = 1.4, extra = '') => {   // smal konturpil: streck + öppet V-huvud
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, h = 6;
  return linje(x1, y1, x2, y2, farg, bredd, extra) + linje(x2, y2, x2 - ux * h - uy * h * 0.6, y2 - uy * h + ux * h * 0.6, farg, bredd, extra) + linje(x2, y2, x2 - ux * h + uy * h * 0.6, y2 - uy * h - ux * h * 0.6, farg, bredd, extra);
};
{
  const W = 520, HH = 340, X = 190, BW = 120, TOP = 78, BOT = 312, YTA = 196;   // tändarkroppen och vätskeytan
  let ut = '';
  // vätska (under den vågiga ytan) – ritas först, kroppen klipps med rundade hörn via clipPath
  ut += `  <defs><clipPath id="kropp"><rect x="${X}" y="${TOP}" width="${BW}" height="${BOT - TOP}" rx="14"/></clipPath></defs>\n`;
  ut += `  <path d="M${X} ${YTA + 4} C${X + 25} ${YTA - 4} ${X + 45} ${YTA + 8} ${X + 65} ${YTA + 1} C${X + 85} ${YTA - 6} ${X + 105} ${YTA + 6} ${X + BW} ${YTA} L${X + BW} ${BOT} L${X} ${BOT} Z" fill="${VATSKA}" stroke="none" clip-path="url(#kropp)" data-del="vatska"/>\n`;
  ut += `  <path d="M${X} ${YTA + 4} C${X + 25} ${YTA - 4} ${X + 45} ${YTA + 8} ${X + 65} ${YTA + 1} C${X + 85} ${YTA - 6} ${X + 105} ${YTA + 6} ${X + BW} ${YTA}" fill="none" stroke="${INK}" stroke-width="1.4" data-del="yta"/>\n`;
  // kroppen (genomskinlig): kontur
  ut += `  <rect x="${X}" y="${TOP}" width="${BW}" height="${BOT - TOP}" rx="14" fill="none" stroke="${INK}" stroke-width="2.2" data-del="kropp"/>\n`;
  // ventil och munstycke upptill
  ut += `  <rect x="${X + BW / 2 - 14}" y="${TOP - 22}" width="28" height="22" rx="3" fill="${GRA}" fill-opacity="0.35" stroke="${INK}" stroke-width="1.6" data-del="ventil"/>\n`;
  ut += `  <rect x="${X + BW / 2 + 16}" y="${TOP - 14}" width="34" height="10" rx="3" fill="none" stroke="${INK}" stroke-width="1.4"/>\n`;   // tryckspak
  // gas som strömmar ut genom ventilen
  ut += tunnPil(X + BW / 2, TOP - 4, X + BW / 2, TOP - 44, INK, 1.6, 'data-pil="ut"') + txt(X + BW / 2 - 22, TOP - 40, 'gas ut', 'font-size="13" font-style="italic" text-anchor="end"');
  // förångning: små pilar från vätskeytan uppåt
  [X + 22, X + 60, X + 98].forEach(x => { ut += tunnPil(x, YTA - 8, x, YTA - 30, INK, 1.2, 'data-pil="forangning"'); });
  // etiketter
  ut += txt(X + BW + 24, 140, 'gas', 'font-size="15" text-anchor="start"') + linje(X + BW + 2, 140, X + BW + 18, 140, GRA, 1);
  ut += txt(X + BW + 24, 186, 'vätska förångas', 'font-size="12" font-style="italic" text-anchor="start"') + linje(X + BW + 2, 176, X + BW + 18, 182, GRA, 1);
  ut += txt(X + BW + 24, 258, 'flytande butan', 'font-size="15" text-anchor="start"') + linje(X + BW + 2, 258, X + BW + 18, 258, GRA, 1);
  ut += txt(X - 14, TOP - 8, 'ventil', 'font-size="12" font-style="italic" text-anchor="end"') + linje(X - 10, TOP - 12, X + BW / 2 - 16, TOP - 12, GRA, 1);
  skriv('k2-b6.svg', W, HH, 'En genomskinlig tändare i genomskärning. Nedre delen är fylld med flytande butan, övre delen med gas. Små pilar vid vätskeytan visar att vätska förångas, och en pil upptill visar gas som strömmar ut genom ventilen', ut);
}

// ---------- B7. Kokpunkten stiger med kedjans längd (avsnitt 2, arbetsorder 2 2026-09-15) ----------
// Tio kokpunkter (ordern §4, tabellen), rumstemperaturlinje 20 °C mellan butan och pentan, färgfält gas 1–4 /
// vätska 5–10 / fast "18 och uppåt" (utan punkt). Varje punkt bär data-amne/data-c/data-kp så att värdena läses ur filen.
const KOKPUNKTER = [['metan', -162], ['etan', -89], ['propan', -42], ['butan', -0.5], ['pentan', 36], ['hexan', 69], ['heptan', 98], ['oktan', 126], ['nonan', 151], ['dekan', 174]];
{
  const W = 780, HH = 400, X0 = 96, DXP = 54, XF = X0 + 10 * DXP + 40, YT = 36, YB = 318, TMIN = -190, TMAX = 200;
  const px = i => X0 + (i - 1) * DXP, py = t => YB - (t - TMIN) * (YB - YT) / (TMAX - TMIN);
  const tal = t => String(t).replace('-', '−').replace('.', ',');
  let ut = '';
  // färgfält under axeln: gas (grått), vätska (ljusblå), fast (kol, svag)
  const FY = YB + 30, FH = 24;
  ut += `  <rect x="${px(1) - 24}" y="${FY}" width="${px(4) - px(1) + 48}" height="${FH}" rx="4" fill="${GRA}" fill-opacity="0.22" stroke="none" data-falt="gas"/>\n` + txt((px(1) + px(4)) / 2, FY + 17, 'gas', 'font-size="13" font-style="italic"');
  ut += `  <rect x="${px(5) - 24}" y="${FY}" width="${px(10) - px(5) + 48}" height="${FH}" rx="4" fill="${VATSKA}" fill-opacity="0.5" stroke="none" data-falt="vatska"/>\n` + txt((px(5) + px(10)) / 2, FY + 17, 'vätska', 'font-size="13" font-style="italic"');
  ut += `  <rect x="${XF - 30}" y="${FY}" width="60" height="${FH}" rx="4" fill="${KOL}" fill-opacity="0.22" stroke="none" data-falt="fast"/>\n` + txt(XF, FY + 17, 'fast', 'font-size="13" font-style="italic"');
  // axlar, y-skala
  ut += linje(X0 - 40, YB, XF + 34, YB, INK, 1.4) + linje(X0 - 40, YT - 6, X0 - 40, YB, INK, 1.4);
  for (let t = -150; t <= 150; t += 50) { ut += linje(X0 - 44, py(t), X0 - 40, py(t), INK, 1) + txt(X0 - 48, py(t) + 4, tal(t) + ' °C', 'font-size="11" text-anchor="end"'); }
  ut += txt(X0 - 40, YT - 14, 'kokpunkt', 'font-size="13" font-style="italic"');
  // avbrott mellan dekan och "18 och uppåt"
  ut += `  <path d="M${px(10) + 30} ${YB + 6} l6 -12 l6 12" fill="none" stroke="${INK}" stroke-width="1.2"/>\n` + `  <path d="M${px(10) + 42} ${YB + 6} l6 -12 l6 12" fill="none" stroke="${INK}" stroke-width="1.2"/>\n`;
  // rumstemperatur 20 °C – streckad linje över hela plottytan
  ut += linje(X0 - 40, py(20), XF + 34, py(20), INK, 1.2, `stroke-dasharray="6 5" data-rumstemperatur="20"`) + txt(XF + 34, py(20) - 6, 'rumstemperatur 20 °C', 'font-size="12" font-style="italic" text-anchor="end"');
  // kurva och punkter
  ut += `  <polyline points="${KOKPUNKTER.map(([, t], i) => `${r2(px(i + 1))},${r2(py(t))}`).join(' ')}" fill="none" stroke="${SIGN}" stroke-width="2.2" stroke-linejoin="round"/>\n`;
  KOKPUNKTER.forEach(([namn, t], i) => {
    const x = px(i + 1), y = py(t);
    ut += cirkel(x, y, 5, SIGN, INK, 1.2, `data-amne="${namn}" data-c="${i + 1}" data-kp="${t}"`);
    ut += txt(x + (i < 4 ? 10 : 0), y - (i < 4 ? -4 : 11), tal(t), `font-size="11" ${i < 4 ? 'text-anchor="start"' : ''}`);
    ut += txt(x, YB + 16, namn, 'font-size="12"') + linje(x, YB, x, YB + 4, INK, 1);
    ut += txt(x, YB - 8, String(i + 1), `font-size="10" fill="${GRA}"`);
  });
  ut += txt(XF, YB + 16, '18 och uppåt', 'font-size="12"') + linje(XF, YB, XF, YB + 4, INK, 1) + txt(XF, YB - 8, '18+', `font-size="10" fill="${GRA}"`);
  ut += txt((px(1) + XF) / 2, HH - 6, 'antal kolatomer', 'font-size="13" font-style="italic"');
  skriv('k2-b7.svg', W, HH, 'En kurva som visar kokpunkten för de tio första alkanerna. Kokpunkten stiger stadigt från metan vid minus 162 grader till dekan vid 174 grader. En streckad linje vid 20 grader markerar rumstemperatur. Under axeln visar färgfält att de fyra första är gaser och de följande vätskor, och längst till höger att alkaner med arton kolatomer eller fler är fasta', ut);
}

// ---------- C1. n-butan och isobutan (avsnitt 3, arbetsorder 3 2026-09-15; spec i bildrutan) ----------
// Samma ritrutin och värden som B3/B4 (alkan()/ritaStruktur(), DX 46, fontsize 19). Isobutan: tre kolatomer i rad och
// den fjärde som gren uppåt från MITTENKOLATOMEN (ordern §3), väten 3-1-3 på raden och 3 på grenen.
function isobutan(x0, y) {
  const atomer = [], bind = [];
  for (let i = 0; i < 3; i++) atomer.push({ typ: 'C', x: x0 + i * DX, y, c: i });
  atomer.push({ typ: 'C', x: x0 + DX, y: y - 2 * DY, c: 3 });   // grenen ovanför mittenkolatomen (index 1); 2·DY upp så att grenens sidoväten inte krockar med ändkolens övre väten
  bind.push({ typ: 'C-C', a: 0, b: 1 }, { typ: 'C-C', a: 1, b: 2 }, { typ: 'C-C', a: 1, b: 3 });
  const lagg = (i, dx, dy) => { const c = atomer[i]; atomer.push({ typ: 'H', x: c.x + dx, y: c.y + dy, c: i }); bind.push({ typ: 'C-H', a: i, b: atomer.length - 1 }); };
  lagg(0, 0, -DY); lagg(0, 0, DY); lagg(0, -DX, 0);          // vänster ändkol: 3 H
  lagg(1, 0, DY);                                            // mittenkol: 1 H (nedåt; uppåt sitter grenen)
  lagg(2, 0, -DY); lagg(2, 0, DY); lagg(2, DX, 0);           // höger ändkol: 3 H
  lagg(3, 0, -DY); lagg(3, -DX, 0); lagg(3, DX, 0);          // grenkol: 3 H
  return { atomer, bind };
}
{
  const W = 760, HH = 340, K = W / 2, y = 168;
  let ut = '';
  const m1 = alkan(4, K * 0.5 - 1.5 * DX, y), m2 = isobutan(K * 1.5 - DX, y);
  ut += ritaStruktur(m1, { tag: 'data-molekyl="n-butan"', fontsize: 19 });
  ut += ritaStruktur(m2, { tag: 'data-molekyl="isobutan"', fontsize: 19 });
  ut += linje(K, 30, K, HH - 20, SIGN, 1.2, 'data-skiljelinje="1"');
  [['n-butan', 'C₄H₁₀', '0 °C', K * 0.5], ['isobutan', 'C₄H₁₀', '−12 °C', K * 1.5]].forEach(([namn, f, kp, x]) => {
    ut += txt(x, 246, namn, `font-size="17" font-weight="bold" fill="${SIGN}" data-etikett="${namn}"`);
    ut += txt(x, 280, formel(f), 'font-size="22" data-formel="' + namn + '"');
    ut += txt(x, 310, 'kokpunkt ' + kp, 'font-size="14" font-style="italic" data-kokpunkt="' + namn + '"');
  });
  skriv('k2-c1.svg', W, HH, 'Två strukturformler. Till vänster butan som en rak kedja av fyra kolatomer, till höger som en grenad kedja där den fjärde kolatomen sitter som en gren på mitten. Under båda står molekylformeln C4H10', ut);
}

// ---------- C2. Etan, eten och etyn (avsnitt 3; omritad i bokstavsstil, Joachim 2026-09-15) ----------
// Delkapitel 2 använder bokstavsstil genomgående (C och H som bokstäver, streck som bindningar) – KOMPONENTER 9.5;
// cirkelstilen (A3) hör till delkapitel 1. Samma teckengrad (19) och bindningslängd (DX 46) som C1/D2. Enkel-, dubbel- och
// trippelstreck med 7,2 px mellan centrumlinjerna. Molekylerna byggs som data så att bindningarna per kolatom kan räknas.
{
  const W = 760, HH = 260, K = W / 3, Y = 96, FS = 19, GAP = 7.2;
  let ut = '';
  const bokstav = (x, y, t, tag) => txt(x, y + FS * 0.35, t, `font-size="${t === 'C' ? FS : FS * 0.86}" ${t === 'C' ? 'font-weight="bold"' : ''} data-atom="${t}" ${tag}`);
  [['etan', 'C₂H₆', 1], ['eten', 'C₂H₄', 2], ['etyn', 'C₂H₂', 3]].forEach(([namn, f, n], i) => {
    const tag = `data-molekyl="${i + 1}"`, xa = K * (i + 0.5) - DX / 2, xb = xa + DX;
    // n streck mellan kolatomerna, jämnt fördelade kring mittlinjen
    for (let k = 0; k < n; k++) { const o = (k - (n - 1) / 2) * GAP; ut += linje(xa + 13, Y + o, xb - 13, Y + o, INK, 2.2, `data-bind="C-C" ${tag}`); }
    // väten: 4 − n per kolatom – upp/ner först, sedan utåt
    for (const [x, ut_] of [[xa, -1], [xb, 1]]) {
      const platser = [[0, -DY], [0, DY], [ut_ * DX, 0]].slice(n === 3 ? 2 : 0, n === 3 ? 3 : 4 - n);
      for (const [dx, dy] of platser) {
        const L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
        ut += linje(x + ux * HB, Y + uy * HB, x + ux * HE, Y + uy * HE, INK, 2.2, `data-bind="C-H" data-c="${r2(x)}" ${tag}`) + bokstav(x + dx, Y + dy, 'H', tag);
      }
      ut += bokstav(x, Y, 'C', tag);
    }
    ut += txt(K * (i + 0.5), 200, namn, `font-size="18" font-weight="bold" data-namn="${namn}"`) + txt(K * (i + 0.5), 232, formel(f), `font-size="20" data-formel="${namn}" data-h="${f.match(/H([₀-₉]+)/)[1].replace(/[₀-₉]/g, c => SUBT[c])}"`);
  });
  skriv('k2-c2.svg', W, HH, 'Tre molekyler med två kolatomer vardera. Etan har ett streck mellan kolatomerna och tre väteatomer på var, eten har två streck och två väteatomer, etyn har tre streck och en väteatom. Under varje molekyl står namnet och molekylformeln', ut);
}

// ---------- C3. Tre serier kolväten (avsnitt 3; tabell) ----------
// Fem kolumner: serie, ändelse, bindning (ritad: två små fyllda cirklar med 1/2/3 streck – samma synliga strecklängd och
// mellanrum som i A3/C2: enkel 56 px, dubbel/trippel 48 px, mellanrum 5 px, streckbredd 2,4), allmän formel (SVG-text med
// nedsänkta index och kursivt n – MathJax når inte in i en extern SVG; löptextens formler sätts med \(…\)), exempel med två
// kolatomer där väteantalet 6, 4, 2 är fetare och kolumnen har en tunn lodrät markering i signaturfärg.
{
  const KOLX = [0, 130, 230, 380, 540, 760], W = KOLX[5], RH = 64, TOP = 46, HH = TOP + 3 * RH + 12;
  let ut = '';
  const mitt = i => (KOLX[i] + KOLX[i + 1]) / 2;
  ['Serie', 'Ändelse', 'Bindning mellan kolatomerna', 'Allmän formel', 'Exempel, två kolatomer'].forEach((t, i) => { ut += txt(mitt(i), 28, t, `font-size="14" font-style="italic" fill="${SIGN}"`); });
  ut += linje(16, TOP - 8, W - 16, TOP - 8, INK, 1.4);
  // allmän formel: C<sub>n</sub>H<sub>2n+2</sub> med kursivt n
  const allman = ix => `C<tspan font-size="0.7em" dy="0.3em" font-style="italic">n</tspan><tspan dy="-0.3em">H</tspan><tspan font-size="0.7em" dy="0.3em">${ix.replace(/n/g, '<tspan font-style="italic">n</tspan>')}</tspan>`;
  const streckMellan = (x1, x2, y, n, tag) => {   // som streck() i A3 (bilder-svg-kolatomen.js): r 6, inset 4 vid fler streck, mellanrum 5 px
    const r = 6, SB = 2.4, inn = n > 1 ? 4 : 0, gap = SB + 5; let s = '';
    for (let k = 0; k < n; k++) { const o = (k - (n - 1) / 2) * gap; s += linje(x1 + r + inn, y + o, x2 - r - inn, y + o, INK, SB, tag); }
    return s + cirkel(x1, y, r, KOL, INK, 1, tag) + cirkel(x2, y, r, KOL, INK, 1, tag);
  };
  const rader = [['Alkaner', '-an', 1, '2n+2', 'etan', 'C₂H₆', 6], ['Alkener', '-en', 2, '2n', 'eten', 'C₂H₄', 4], ['Alkyner', '-yn', 3, '2n−2', 'etyn', 'C₂H₂', 2]];
  // lodrät markering längs exempelkolumnens väteantal
  const HX = mitt(4) + 10;
  ut += linje(HX + 56, TOP - 2, HX + 56, TOP + 3 * RH - 6, SIGN, 1.2, 'data-markering="vate"');   // strax till höger om väteantalet
  rader.forEach(([serie, and, n, ix, namn, f, h], r) => {
    const y = TOP + r * RH + RH / 2, tag = `data-rad="${r + 1}"`;
    ut += txt(mitt(0), y + 6, serie, `font-size="17" ${tag}`) + txt(mitt(1), y + 6, and, `font-size="17" ${tag}`);
    ut += streckMellan(mitt(2) - 34, mitt(2) + 34, y, n, `data-bind="C-C" ${tag}`);
    ut += txt(mitt(3), y + 6, allman(ix), `font-size="20" data-allman="${ix}" ${tag}`);
    ut += txt(HX - 14, y + 6, namn + ',', `font-size="17" text-anchor="end" ${tag}`) + txt(HX, y + 6, `C<tspan font-size="0.7em" dy="0.3em">2</tspan><tspan dy="-0.3em">H</tspan><tspan font-size="0.75em" dy="0.3em" font-weight="bold">${h}</tspan>`, `font-size="20" text-anchor="start" data-exempel="${namn}" data-h="${h}" ${tag}`);
    if (r < 2) ut += linje(16, TOP + (r + 1) * RH, W - 16, TOP + (r + 1) * RH, INK, 0.8);
  });
  skriv('k2-c3.svg', W, HH, 'En tabell med tre rader för alkaner, alkener och alkyner. Kolumnerna visar namnändelse, bindningen mellan kolatomerna ritad som ett, två eller tre streck, den allmänna formeln, och ett exempel med två kolatomer', ut);
}

// ---------- D1. Monomer och polymer (avsnitt 4, arbetsorder 4 2026-09-15; spec i bildrutan) ----------
// Ingen kemi: fem identiska rundade sexkanter (ritade ur EN mall via <use>) med lediga bindningar åt sidorna; nedre raden
// sammankopplad, tre punkter till höger, grå pil mellan raderna.
{
  const W = 760, HH = 270, EB = 64, R = 26, B = 22, Y1 = 78, Y2 = 200;   // enhetsbredd, sexkantens radie, bindningslängd
  let ut = '';
  // mall: rundad sexkant (spets uppåt/nedåt) centrerad i origo
  const P = [0, 1, 2, 3, 4, 5].map(i => [r2(R * Math.cos(Math.PI / 6 + i * Math.PI / 3)), r2(R * Math.sin(Math.PI / 6 + i * Math.PI / 3))]);
  ut += `  <defs><path id="enhet" d="M${P.map(p => p.join(' ')).join(' L')} Z" fill="${SIGN}" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/></defs>\n`;
  // övre raden: fristående, med lediga bindningar åt båda håll
  const G1 = EB + 2 * B + 16, X0 = W / 2 - 2 * G1 + 64;   // steg mellan fristående enheter; raden centrerad (etiketten till vänster)
  for (let i = 0; i < 5; i++) {
    const x = X0 + i * G1;
    ut += linje(x - R - B, Y1, x - R, Y1, INK, 2.2, `data-bindning="ledig" data-rad="1"`) + linje(x + R, Y1, x + R + B, Y1, INK, 2.2, `data-bindning="ledig" data-rad="1"`);
    ut += `  <use href="#enhet" x="${x}" y="${Y1}" data-enhet="${i + 1}" data-rad="1"/>\n`;
  }
  ut += txt(X0 - R - B - 24, Y1 + 6, 'monomerer', 'font-size="17" font-weight="bold" text-anchor="end"');
  // pil nedåt
  ut += linje(W / 2, Y1 + 46, W / 2, Y2 - 46, GRA, 2, 'data-pil="ner"') + `  <polygon points="${W / 2},${Y2 - 38} ${W / 2 - 6},${Y2 - 48} ${W / 2 + 6},${Y2 - 48}" fill="${GRA}" data-pil="ner"/>\n`;
  // nedre raden: sammankopplade – de lediga bindningarna möts, ett streck mellan varje par; ledig i vardera änden; …
  const G2 = 2 * R + B, X2 = W / 2 - 2 * G2 + 64;   // steg så att ett streck av längd B binder ihop grannarna
  for (let i = 0; i < 5; i++) {
    const x = X2 + i * G2;
    if (i === 0) ut += linje(x - R - B, Y2, x - R, Y2, INK, 2.2, `data-bindning="ledig" data-rad="2"`);
    if (i < 4) ut += linje(x + R, Y2, x + R + B, Y2, INK, 2.2, `data-bindning="mellan" data-rad="2"`);
    else ut += linje(x + R, Y2, x + R + B, Y2, INK, 2.2, `data-bindning="ledig" data-rad="2"`);
    ut += `  <use href="#enhet" x="${x}" y="${Y2}" data-enhet="${i + 1}" data-rad="2"/>\n`;
  }
  ut += txt(X2 + 4 * G2 + R + B + 18, Y2 + 6, '…', 'font-size="22" text-anchor="start"');
  ut += txt(X2 - R - B - 24, Y2 + 6, 'polymer', 'font-size="17" font-weight="bold" text-anchor="end"');
  skriv('k2-d1.svg', W, HH, 'Överst fem likadana fristående enheter med lediga bindningar åt sidorna, märkta monomerer. Under dem samma fem enheter sammankopplade till en kedja som fortsätter åt höger, märkt polymer', ut);
}

// ---------- D2. Eten polymeriserar (avsnitt 4; avsnittets viktigaste bild) ----------
// Övre raden: tre etenmolekyler, dubbelbindning där det ena strecket är grönt. Nedre raden: samma sex kolatomer i en kedja,
// enkelstreck inom molekylerna, GRÖNA streck mellan dem och en grön ledig bindning i vänster ände (3 + 3 gröna). Samma
// teckengrad (19) och bindningslängd (DX 46) som C1/C2. Molekylerna byggs som data så att bindningarna per kolatom räknas.
{
  const W = 760, HH = 400, Y1 = 96, Y2 = 296, FS = 19;
  let ut = '';
  const bokstav = (x, y, t, tag) => txt(x, y + FS * 0.35, t, `font-size="${t === 'C' ? FS : FS * 0.86}" ${t === 'C' ? 'font-weight="bold"' : ''} data-atom="${t}" ${tag}`);
  const CH = (cx, cy, dy, tag) => linje(cx, cy + Math.sign(dy) * HB, cx, cy + Math.sign(dy) * HE, INK, 2.2, `data-bind="C-H" ${tag}`) + bokstav(cx, cy + dy, 'H', tag);
  const CC = (x1, x2, y, farg, tag, off = 0) => linje(x1 + 13, y + off, x2 - 13, y + off, farg, 2.2, `data-bind="C-C" ${farg === SIGN ? 'data-gron="1"' : ''} ${tag}`);
  const GAP = 3.6;   // dubbelstreckets halva mellanrum (7,2 px mellan centrumlinjerna ≥ streckbredden 2,2)
  // övre raden: tre fristående molekyler
  const T1 = 'data-rad="1"', AV1 = 2 * DX + 38, X1 = W / 2 - AV1 - DX / 2;
  for (let m = 0; m < 3; m++) {
    const xa = X1 + m * AV1, xb = xa + DX;
    ut += CC(xa, xb, Y1, INK, T1, -GAP) + CC(xa, xb, Y1, SIGN, T1, GAP);
    for (const x of [xa, xb]) { ut += CH(x, Y1, -DY, T1) + CH(x, Y1, DY, T1) + bokstav(x, Y1, 'C', T1); }
  }
  ut += txt(W / 2, Y1 - 62, 'tre etenmolekyler', 'font-size="16" font-weight="bold"');
  // pil nedåt med text
  ut += linje(W / 2, Y1 + 62, W / 2, Y2 - 70, GRA, 2, 'data-pil="ner"') + `  <polygon points="${W / 2},${Y2 - 62} ${W / 2 - 6},${Y2 - 72} ${W / 2 + 6},${Y2 - 72}" fill="${GRA}" data-pil="ner"/>\n`;
  ut += txt(W / 2 + 14, (Y1 + Y2) / 2 + 2, 'dubbelbindningen öppnas', 'font-size="14" font-style="italic" text-anchor="start"');
  // nedre raden: sex kolatomer i rad
  const T2 = 'data-rad="2"', X2 = W / 2 - 2.5 * DX;
  for (let i = 0; i < 6; i++) {
    const x = X2 + i * DX;
    if (i < 5) ut += CC(x, x + DX, Y2, i % 2 === 0 ? INK : SIGN, T2);   // inom molekylen (0–1, 2–3, 4–5) svart, mellan molekylerna grönt
    ut += CH(x, Y2, -DY, T2) + CH(x, Y2, DY, T2) + bokstav(x, Y2, 'C', T2);
  }
  ut += linje(X2 - 13, Y2, X2 - DX + 13, Y2, SIGN, 2.2, `data-bind="ledig" data-gron="1" ${T2}`) + txt(X2 - DX - 2, Y2 + 7, '…', 'font-size="22" text-anchor="end"');
  ut += linje(X2 + 5 * DX + 13, Y2, X2 + 6 * DX - 13, Y2, INK, 2.2, `data-bind="ledig" ${T2}`) + txt(X2 + 6 * DX + 2, Y2 + 7, '…', 'font-size="22" text-anchor="start"');
  ut += txt(W / 2, Y2 + 74, 'en bit av en polyetenkedja', 'font-size="16" font-weight="bold"');
  skriv('k2-d2.svg', W, HH, 'Överst tre etenmolekyler, var och en med en dubbelbindning där det ena strecket är grönt. Under dem samma tre molekyler sammankopplade till en kedja, där de gröna strecken nu sitter mellan molekylerna i stället för inom dem', ut);
}

// ---------- D3. Fyra vanliga plaster (avsnitt 4; tabell, ren text) ----------
{
  const KOLX = [0, 175, 275, 395, 760], W = KOLX[4], RH = 44, TOP = 46, HH = TOP + 4 * RH + 44;
  let ut = '';
  const mitt = i => (KOLX[i] + KOLX[i + 1]) / 2;
  ['Plast', 'Förkortning', 'Monomer', 'Används till'].forEach((t, i) => { ut += txt(i === 3 ? KOLX[3] + 12 : mitt(i), 28, t, `font-size="14" font-style="italic" fill="${SIGN}" ${i === 3 ? 'text-anchor="start"' : ''}`); });
  ut += linje(16, TOP - 8, W - 16, TOP - 8, INK, 1.4);
  const rader = [['Polyeten', 'PE', 'eten', 'plastpåsar, flaskor, plastfilm, förpackningar'], ['Polypropen', 'PP', 'propen', 'matförpackningar, plastlådor, rep, textilfibrer'], ['Polystyren', 'PS', 'styren', 'engångsprodukter, isolering, skyddsförpackningar'], ['Polyvinylklorid', 'PVC', 'vinylklorid', 'rör, golv, kabelisolering']];
  rader.forEach(([plast, fk, mono, anv], r) => {
    const y = TOP + r * RH + RH / 2, tag = `data-rad="${r + 1}"`;
    if (fk === 'PVC') ut += `  <rect x="16" y="${TOP + r * RH + 3}" width="${W - 32}" height="${RH - 6}" rx="4" fill="${SIGN}" fill-opacity="0.10" stroke="none" data-markering="pvc"/>\n` + linje(19, TOP + r * RH + 4, 19, TOP + (r + 1) * RH - 4, SIGN, 3, 'data-markering="pvc"');
    ut += txt(mitt(0), y + 6, plast, `font-size="16" data-kolumn="plast" ${tag}`) + txt(mitt(1), y + 6, fk, `font-size="16" data-kolumn="forkortning" ${tag}`) + txt(mitt(2), y + 6, mono, `font-size="16" data-kolumn="monomer" ${tag}`) + txt(KOLX[3] + 12, y + 6, anv, `font-size="14" text-anchor="start" data-kolumn="anvands" ${tag}`);
    if (r < 3) ut += linje(16, TOP + (r + 1) * RH, W - 16, TOP + (r + 1) * RH, INK, 0.8);
  });
  ut += linje(16, TOP + 4 * RH, W - 16, TOP + 4 * RH, INK, 1.4);
  ut += txt(30, TOP + 4 * RH + 26, 'PVC innehåller även klor.', `font-size="13" font-style="italic" fill="${SIGN}" text-anchor="start" data-not="klor"`);
  skriv('k2-d3.svg', W, HH, 'En tabell med fyra plaster. För varje plast står förkortningen, vilken monomer den tillverkas av, och vad den används till. PVC-raden är markerad och innehåller även klor', ut);
}

// ---------- kontroll mot de skrivna filerna (ordern §3) ----------
const las = f => fs.readFileSync(path.join(UT, f), 'utf8');
const element = (s, filter) => [...s.matchAll(/<(text|circle|line|rect|path)\b([^>]*)>/g)].map(m => { const at = {}; for (const a of m[2].matchAll(/([a-z0-9-]+)="([^"]*)"/g)) at[a[1]] = a[2]; at._tag = m[1]; return at; }).filter(filter);
const antalAtom = (els, typ) => els.filter(e => e['data-atom'] === typ).length;
const rapport = [];
function kolla(namn, villkor, text) { rapport.push(`${villkor ? 'OK ' : 'FEL'} ${namn}: ${text}`); if (!villkor) process.exitCode = 1; }
{ // B1
  const s = las('k2-b1.svg');
  const me = element(s, e => e['data-molekyl'] === 'metan'), bu = element(s, e => e['data-molekyl'] === 'butan');
  kolla('B1 metan', antalAtom(me, 'C') === 1 && antalAtom(me, 'H') === 4, `${antalAtom(me, 'C')} C + ${antalAtom(me, 'H')} H`);
  kolla('B1 butan', antalAtom(bu, 'C') === 4 && antalAtom(bu, 'H') === 10, `${antalAtom(bu, 'C')} C + ${antalAtom(bu, 'H')} H`);
  const ford = [...s.matchAll(/data-antal="(\d)"/g)].map(m => m[1]).join('-');
  kolla('B1 fördelning', ford === '3-2-2-3', ford);
  // fyra streck per kolatom: räkna ur datan (samma data som ritats)
  for (const [n, m] of [[1, alkan(1, 0, 0)], [4, alkan(4, 0, 0)]]) {
    const per = m.atomer.filter(a => a.typ === 'C').map(c => m.bind.filter(b => b.a === c.c || (b.typ === 'C-C' && b.b === c.c)).length);
    kolla(`B1 streck per kolatom (${n} C)`, per.every(x => x === 4), per.join(', '));
    const ritade = element(s, e => e['data-molekyl'] === (n === 1 ? 'metan' : 'butan') && e['data-bind']).length;
    kolla(`B1 ritade streck (${n} C)`, ritade === m.bind.length && ritade === (n === 1 ? 4 : 13), `${ritade} streck i filen (${n - 1} C–C + ${m.bind.length - (n - 1)} C–H)`);
  }
}
{ // B2
  const s = las('k2-b2.svg');
  for (let r = 0; r < 4; r++) {
    const els = element(s, e => e['data-rad'] === String(r));
    kolla(`B2 rad ${r + 1}`, antalAtom(els, 'C') === r + 1 && antalAtom(els, 'H') === 2 * (r + 1) + 2, `${antalAtom(els, 'C')} C + ${antalAtom(els, 'H')} H`);
    const mark = els.filter(e => e['data-mark'] === '1'), markStreck = mark.filter(e => e['data-bind']).length;
    kolla(`B2 markering rad ${r + 1}`, r === 0 ? mark.length === 0 : (antalAtom(mark, 'C') === 1 && antalAtom(mark, 'H') === 2 && markStreck === 3), r === 0 ? `ingen markering (${mark.length} gröna element)` : `${antalAtom(mark, 'C')} C + ${antalAtom(mark, 'H')} H + ${markStreck} streck i grönt`);
  }
  kolla('B2 inga rutor/plattor', element(s, e => e._tag === 'rect').length === 0, `${element(s, e => e._tag === 'rect').length} rect-element`);
  kolla('B2 ingen + CH₂, ingen fetad rad', !/\+ <tspan|\+ CH|Varje steg/.test(s), 'text i filen: namn, formler och atombokstäver');
  // samma ritvärden som B3: teckengrad på C och H, C–C-streckens längd
  const s3 = las('k2-b3.svg');
  const varden = t => { const e = element(t, x => (x['data-atom'] || x['data-bind'] === 'C-C') && x['data-kolumn'] !== 'modell'); return { C: [...new Set(e.filter(x => x['data-atom'] === 'C' && x._tag === 'text').map(x => x['font-size']))], H: [...new Set(e.filter(x => x['data-atom'] === 'H' && x._tag === 'text').map(x => x['font-size']))], CC: [...new Set(e.filter(x => x['data-bind'] === 'C-C' && x._tag === 'line').map(x => Math.round(Math.hypot(+x.x2 - +x.x1, +x.y2 - +x.y1))))] }; };
  const v2 = varden(s), v3 = varden(s3);
  kolla('B2 = B3 teckengrad och bindningslängd', JSON.stringify(v2) === JSON.stringify(v3), `B2 ${JSON.stringify(v2)} / B3 ${JSON.stringify(v3)}`);
}
{ // B3
  const s = las('k2-b3.svg');
  for (let r = 0; r < 4; r++) {
    for (const k of ['struktur', 'modell']) {
      const els = element(s, e => e['data-rad'] === String(r) && e['data-kolumn'] === k);
      const cc = els.filter(e => e['data-bind'] === 'C-C').length;
      kolla(`B3 rad ${r + 1} ${k}`, antalAtom(els, 'C') === r + 1 && antalAtom(els, 'H') === 2 * (r + 1) + 2 && cc === r, `${antalAtom(els, 'C')} C + ${antalAtom(els, 'H')} H, ${cc} C–C`);
    }
    // vinklad kedja i modellkolumnen: kolkulornas y-värden växlar (inte alla lika) från etan och uppåt
    const ys = element(s, e => e['data-rad'] === String(r) && e['data-kolumn'] === 'modell' && e['data-atom'] === 'C').map(e => +e.cy);
    if (r > 0) kolla(`B3 rad ${r + 1} modell vinklad`, new Set(ys).size === 2 && ys.every((y, i) => i === 0 || y !== ys[i - 1]), `kol-y: ${ys.join(', ')}`);
  }
}
{ // B4
  const s = las('k2-b4.svg');
  const r3 = element(s, e => e['data-ruta'] === '3');
  kolla('B4 ruta 3', antalAtom(r3, 'C') === 4 && antalAtom(r3, 'H') === 10, `${antalAtom(r3, 'C')} C + ${antalAtom(r3, 'H')} H`);
  const m = alkan(4, 0, 0), ford = m.atomer.filter(a => a.typ === 'C').map(c => m.atomer.filter(a => a.typ === 'H' && a.c === c.c).length).join('-');
  kolla('B4 fördelning', ford === '3-2-2-3', ford);
  kolla('B4 gröna väten i ruta 3', r3.filter(e => e['data-mark'] === '1' && e['data-atom'] === 'H').length === 10, `${r3.filter(e => e['data-mark'] === '1').length} markerade`);
  const r4 = s.match(/<text[^>]*data-ruta="4"[^>]*>(.*?)<\/text>/s)[1].replace(/<[^>]+>/g, '').replace(/\s+/g, '');
  kolla('B4 ruta 4', r4 === 'C4H10', `formeln läser "${r4}"`);
  kolla('B4 ruta 1', antalAtom(element(s, e => e['data-ruta'] === '1'), 'C') === 4 && element(s, e => e['data-ruta'] === '1' && e['data-bind']).length === 0, 'fyra C, inga streck');
  kolla('B4 ruta 2', element(s, e => e['data-ruta'] === '2' && e['data-bind'] === 'C-C').length === 3 && antalAtom(element(s, e => e['data-ruta'] === '2'), 'H') === 0, 'tre C–C-streck, inga väten');
}
{ // B6: ingen låga, vätska + yta + ventil + pilar
  const s = las('k2-b6.svg');
  kolla('B6 ingen låga', !/låga|flame|#e8c547|#C0392B/i.test(s), 'ingen lågform, ingen gul/röd färg i filen');
  const delar = element(s, e => e['data-del']).map(e => e['data-del']);
  kolla('B6 delar', ['vatska', 'yta', 'kropp', 'ventil'].every(d => delar.includes(d)) && element(s, e => e['data-pil'] === 'forangning').length === 9 && element(s, e => e['data-pil'] === 'ut').length === 3, `vätska, yta, kropp, ventil; 3 förångningspilar, 1 pil ut`);
}
{ // B7: tio kokpunkter ur filen, rumstemperaturlinjen mellan butan och pentan, fälten 1–4 och 5–10, "18 och uppåt" utan punkt
  const s = las('k2-b7.svg');
  const p = element(s, e => e['data-amne']).map(e => ({ amne: e['data-amne'], c: +e['data-c'], kp: +e['data-kp'], cx: +e.cx, cy: +e.cy }));
  const facit = [['metan', 1, -162], ['etan', 2, -89], ['propan', 3, -42], ['butan', 4, -0.5], ['pentan', 5, 36], ['hexan', 6, 69], ['heptan', 7, 98], ['oktan', 8, 126], ['nonan', 9, 151], ['dekan', 10, 174]];
  kolla('B7 tio kokpunkter', p.length === 10 && facit.every(([a, c, t], i) => p[i].amne === a && p[i].c === c && p[i].kp === t), p.map(x => `${x.amne} ${x.c} ${String(x.kp).replace('-', '−').replace('.', ',')}`).join(', '));
  const rum = element(s, e => e['data-rumstemperatur'] === '20')[0], yr = +rum.y1;
  const butan = p.find(x => x.amne === 'butan'), pentan = p.find(x => x.amne === 'pentan');
  kolla('B7 rumstemperaturlinjen mellan butan och pentan', butan.cy > yr && yr > pentan.cy && p.slice(0, 4).every(x => x.cy > yr) && p.slice(4).every(x => x.cy < yr), `y: butan ${butan.cy} (under), linje ${yr}, pentan ${pentan.cy} (över); alla 1–4 under, 5–10 över`);
  const falt = n => element(s, e => e['data-falt'] === n)[0];
  const inom = (f, x) => +f.x <= x && x <= +f.x + +f.width;
  const gas = falt('gas'), vat = falt('vatska'), fast = falt('fast');
  kolla('B7 gasfält 1–4, vätskefält 5–10', p.slice(0, 4).every(x => inom(gas, x.cx) && !inom(vat, x.cx)) && p.slice(4).every(x => inom(vat, x.cx) && !inom(gas, x.cx)) && p.every(x => !inom(fast, x.cx)), `gas x ${gas.x}–${+gas.x + +gas.width} täcker ${p.slice(0, 4).map(x => x.c).join(',')}; vätska x ${vat.x}–${+vat.x + +vat.width} täcker ${p.slice(4).map(x => x.c).join(',')}`);
  kolla('B7 "18 och uppåt" utan punkt', />18 och uppåt</.test(s) && !p.some(x => x.c >= 18) && !element(s, e => e['data-amne']).some(e => inom(fast, +e.cx)), 'etikett finns, ingen punkt i fast-fältet');
}
{ // C1: 4 C + 10 H i båda, fyra streck per kolatom, grenen på mittenkolatomen
  const s = las('k2-c1.svg');
  for (const [namn, m] of [['n-butan', alkan(4, 0, 0)], ['isobutan', isobutan(0, 0)]]) {
    const els = element(s, e => e['data-molekyl'] === namn);
    const per = m.atomer.filter(a => a.typ === 'C').map(c => m.bind.filter(b => b.a === c.c || (b.typ === 'C-C' && b.b === c.c)).length);
    kolla(`C1 ${namn}`, antalAtom(els, 'C') === 4 && antalAtom(els, 'H') === 10 && per.every(x => x === 4) && els.filter(e => e['data-bind']).length === 13, `${antalAtom(els, 'C')} C + ${antalAtom(els, 'H')} H, streck per kolatom ${per.join(', ')}, ${els.filter(e => e['data-bind']).length} streck i filen`);
  }
  const iso = isobutan(0, 0), rad = iso.atomer.filter(a => a.typ === 'C' && a.c < 3), gren = iso.atomer.find(a => a.typ === 'C' && a.c === 3);
  const granne = iso.bind.find(b => b.typ === 'C-C' && b.b === 3).a;
  kolla('C1 grenkolatom', granne === 1 && gren.x === rad[1].x && rad[1].x > rad[0].x && rad[1].x < rad[2].x, `grenen bunden till kolatom ${granne + 1} av 3 (mitten), rakt ovanför den (x ${gren.x} = ${rad[1].x}); mittenkolatomen bär ${iso.atomer.filter(a => a.typ === 'H' && a.c === 1).length} H`);
  kolla('C1 etiketter', /data-etikett="n-butan"/.test(s) && /data-etikett="isobutan"/.test(s) && (s.match(/data-formel=/g) || []).length === 2 && /−12 °C/.test(s) && /0 °C/.test(s), 'n-butan, isobutan, två C₄H₁₀, kokpunkter 0 °C och −12 °C (U+2212)');
}
{ // C2: bokstavsstil – 2 C + 6/4/2 H, 1/2/3 streck, fyra bindningar per kolatom, namn + formel; ingen koppling till A3
  const s = las('k2-c2.svg');
  for (let i = 1; i <= 3; i++) {
    const m = element(s, e => e['data-molekyl'] === String(i)), cc = m.filter(e => e['data-bind'] === 'C-C').length, h = antalAtom(m, 'H');
    const per = m.filter(e => e['data-atom'] === 'C' && e._tag === 'text').map(c => m.filter(l => l['data-bind'] === 'C-H' && l['data-c'] === c.x).length + cc);
    const f = element(s, e => e['data-formel'] && +e['data-h'] === h).length;
    kolla(`C2 molekyl ${i}`, antalAtom(m, 'C') === 2 && h === 8 - 2 * i && cc === i && per.every(p => p === 4) && f === 1, `2 C + ${h} H + ${cc} streck; bindningar per kolatom ${per.join(', ')}; formeln under visar H${h}`);
  }
  kolla('C2 bokstavsstil', element(s, e => e['data-atom'] && e._tag === 'text').length === 18 && element(s, e => e['data-atom'] && e._tag === 'circle').length === 0 && element(s, e => e._tag === 'rect').length === 0, '18 atombokstäver, inga cirklar, inga rutor');
}
{ // C3: tre rader, 1/2/3 streck i bindningskolumnen, 6/4/2 väten i exempelkolumnen, tre allmänna formler med kursivt n
  const s = las('k2-c3.svg');
  const streck = [1, 2, 3].map(r => element(s, e => e['data-rad'] === String(r) && e['data-bind'] === 'C-C' && e._tag === 'line').length);
  const h = [1, 2, 3].map(r => +element(s, e => e['data-rad'] === String(r) && e['data-exempel'])[0]['data-h']);
  kolla('C3 bindningskolumnen', streck.join(',') === '1,2,3', `${streck.join(', ')} streck uppifrån och ner`);
  kolla('C3 exempelkolumnen', h.join(',') === '6,4,2', `${h.join(', ')} väteatomer`);
  const allm = element(s, e => e['data-allman']).map(e => e['data-allman']);
  kolla('C3 allmänna formler', allm.join(' ') === '2n+2 2n 2n−2' && (s.match(/font-style="italic">n<\/tspan>/g) || []).length === 6, `C_n H_${allm.join(', C_n H_')}; n kursivt (6 förekomster)`);
  // samma synliga strecklängd som A3/C2: enkel 56, dubbel/trippel 48
  const L = r => element(s, e => e['data-rad'] === String(r) && e['data-bind'] === 'C-C' && e._tag === 'line').map(e => Math.round(+e.x2 - +e.x1));
  kolla('C3 strecklängd (cirkelstilen, som A3)', L(1)[0] === 56 && L(2).every(x => x === 48) && L(3).every(x => x === 48), `enkel ${L(1)}, dubbel ${L(2)}, trippel ${L(3)} px (A3/C2: 56 / 48)`);
}
{ // D1: fem enheter per rad ur samma mall, lediga/mellan-bindningar, ingen kemi
  const s = las('k2-d1.svg');
  const use = [...s.matchAll(/<use href="#enhet"[^>]*data-rad="(\d)"/g)].map(m => m[1]);
  const mall = (s.match(/<path id="enhet"[^>]*>/g) || []).length;
  kolla('D1 enheter', use.filter(r => r === '1').length === 5 && use.filter(r => r === '2').length === 5 && mall === 1, `5 + 5 enheter, alla ritade med <use> ur en och samma mall (${mall} <path id="enhet">) – identisk form och mått`);
  const b = (rad, typ) => element(s, e => e['data-rad'] === rad && e['data-bindning'] === typ).length;
  kolla('D1 bindningar', b('1', 'ledig') === 10 && b('1', 'mellan') === 0 && b('2', 'mellan') === 4 && b('2', 'ledig') === 2, `övre raden ${b('1', 'ledig')} lediga, 0 anslutna; nedre raden ${b('2', 'mellan')} mellan enheterna + ${b('2', 'ledig')} lediga i ändarna`);
  kolla('D1 ingen kemi', !/data-atom|[₀-₉]|>C<|>H</.test(s), 'inga atomer, formler eller bokstäver i enheterna');
}
{ // D2: 6 C + 12 H per rad, 3 gröna streck per rad, fyra bindningar per kolatom
  const s = las('k2-d2.svg');
  for (const r of ['1', '2']) {
    const e = element(s, x => x['data-rad'] === r), gron = e.filter(x => x['data-gron'] === '1').length;
    const C = e.filter(x => x['data-atom'] === 'C'), H = e.filter(x => x['data-atom'] === 'H').length;
    const cc = e.filter(x => x['data-bind'] === 'C-C').length, ledig = e.filter(x => x['data-bind'] === 'ledig').length;
    // bindningar per kolatom: C–H med samma x, C–C-streck vars ändar ligger vid kolatomen (x±13), lediga likaså
    const per = C.map(c => { const x = +c.x; return e.filter(x1 => x1['data-bind'] === 'C-H' && +x1.x1 === x).length + e.filter(l => (l['data-bind'] === 'C-C' || l['data-bind'] === 'ledig') && (Math.abs(+l.x1 - x) === 13 || Math.abs(+l.x2 - x) === 13)).length; });
    kolla(`D2 rad ${r}`, C.length === 6 && H === 12 && gron === 3 && per.every(p => p === 4) && (r === '1' ? cc === 6 : cc === 5 && ledig === 2), `6 C, ${H} H, ${gron} gröna streck; ${r === '1' ? cc / 2 + ' dubbelbindningar' : cc + ' C–C-streck + ' + ledig + ' lediga'}; bindningar per kolatom ${per.join(', ')}`);
  }
  const g1 = element(s, x => x['data-rad'] === '1' && x['data-gron'] === '1').length, g2 = element(s, x => x['data-rad'] === '2' && x['data-gron'] === '1').length;
  kolla('D2 gröna streck lika många', g1 === g2, `övre raden ${g1}, nedre raden ${g2}`);
}
{ // D3: fyra rader, monomer- och förkortningskolumnerna, PVC markerad + not
  const s = las('k2-d3.svg');
  const kol = k => [1, 2, 3, 4].map(r => (s.match(new RegExp(`<text[^>]*data-kolumn="${k}" data-rad="${r}"[^>]*>([^<]*)<`)) || [])[1]);
  kolla('D3 rader', element(s, e => e['data-kolumn'] === 'plast').length === 4, `${element(s, e => e['data-kolumn'] === 'plast').length} rader: ${kol('plast').join(', ')}`);
  kolla('D3 monomer', kol('monomer').join(',') === 'eten,propen,styren,vinylklorid', kol('monomer').join(', '));
  kolla('D3 förkortning', kol('forkortning').join(',') === 'PE,PP,PS,PVC', kol('forkortning').join(', '));
  kolla('D3 PVC markerad', element(s, e => e['data-markering'] === 'pvc').length === 2 && /data-not="klor"[^>]*>PVC innehåller även klor\./.test(s), 'markering (platta + kant i signaturfärg) på rad 4, not under tabellen');
}
console.log(`${antal} SVG skrivna till ${path.relative(path.join(__dirname, '..'), UT)}`);
console.log(rapport.join('\n'));
