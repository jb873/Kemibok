// bilder-svg-kolvaten.js – SVG-bilderna till Organisk kemi, delkapitel 2 "Kolväten" (avsnitt 1: B1–B4, avsnitt 2: B6–B7)
// (arbetsorder 1 Kolväten, 2026-09-15; ritade efter bildrutorna i doc/leveranser/kolvaten/avsnitt-1.md – specfilen
// dk2-avsnitt-1-bildspecar.md fanns inte i leveransen). Skriver till kapitel/organisk-kemi/delkapitel/kolvaten/img/k2-b{n}.svg.
// Kör: node verktyg/bilder-svg-kolvaten.js
//
//   k2-b1  Kolstommen och väteatomerna      1.1    k2-b3  Fyra sätt att visa samma kolväte   1.3
//   k2-b2  Alkanserien som trappa           1.2    k2-b4  Så ritar du en strukturformel      1.3
//   k2-b6  Butan i en tändare               2.2    k2-b7  Kokpunkten stiger med kedjans längd 2.3   (k2-b5 kärret: AI-bild, nyckla-gron.js)
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
console.log(`${antal} SVG skrivna till ${path.relative(path.join(__dirname, '..'), UT)}`);
console.log(rapport.join('\n'));
