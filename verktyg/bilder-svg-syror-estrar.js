// bilder-svg-syror-estrar.js – de tio SVG-bilderna till Organisk kemi 5 "Organiska syror och estrar" (arbetsorder 2026-09-18;
// specar i doc/leveranser/syror-och-estrar/original/dk5-bildspecar.md). Skriver till kapitel/organisk-kemi/delkapitel/syror-och-estrar/img/.
// Kör: node verktyg/bilder-svg-syror-estrar.js
//
//   k5-l1  Etan, etanol och etansyra   1.1   k5-l5  Myrsyra och ättiksyra       2.1   k5-l8   Estrar och deras dofter   3.1
//   k5-l2  Karboxylgruppen             1.1   k5-l6  Syrorna efter kedjelängd    2.2   k5-l9   Esterbildningen           3.2
//   k5-l3  Etanol oxideras             1.2   k5-l7  Smörsyra i två sammanhang   2.3   k5-l10  Fettmolekylen             3.3
//   k5-l4  Svag syra i vatten          1.3
//
// Palett: konturer/text #2d4a35, signaturfärg #5a9668, kol #3a3a3a, syre #C0392B, väte #f5f0e4, vätska #a8c4d8, grått #8A8A8A,
// markering #e8c547. Bokstavsstil (KOMPONENTER 9.5). Två signaler: syre rött; karboxylgruppen inringad med tunn linje i
// signaturfärg (L1, L2, L5, L6, L7, L9). Kontrollerna sist körs på samma molekyldata som ritats (L9: syran lämnar OH, alkoholen H).
'use strict';
const fs = require('fs'), path = require('path');
const ROT = path.join(__dirname, '..');
const UT = path.join(ROT, 'kapitel', 'organisk-kemi', 'delkapitel', 'syror-och-estrar', 'img');
// primitiver och molekylmodell delade sedan 2026-09-19 (lib-svg-bokstav.js, lyfta härifrån – bilderna byggs byte-identiskt)
const B = require('./lib-svg-bokstav.js');
const { INK, SIGN, KOL, SYRE, VATE, VATSKA, GRA, GUL, FONT, r2, txt, sub, formelO, linje, cirkel, ellips, rekt, pil, DX, DY, FS, molekyl, kedja, H, OH, Odbl, rita, stub, rakna, bindTal, grannar } = B;
const SK = B.skrivare(UT); const skriv = SK.skriv;
const KOND = require('./lib-kondensation.js');
// standardmolekyler
function etan(x0, y) { const m = molekyl(); const [c1, c2] = kedja(m, 2, x0, y); H(m, c1, 0, -DY); H(m, c1, 0, DY); H(m, c1, -DX, 0); H(m, c2, 0, -DY); H(m, c2, 0, DY); H(m, c2, DX, 0); return m; }
function etanol(x0, y, extra = {}) { const m = molekyl(); const [c1, c2] = kedja(m, 2, x0, y); H(m, c1, 0, -DY); H(m, c1, 0, DY); H(m, c1, -DX, 0); H(m, c2, 0, -DY, extra.h1 || {}); H(m, c2, 0, DY, extra.h2 || {}); const [o, h] = OH(m, c2, DX, 0); m.o = o; m.oh = h; m.c2 = c2; return m; }
// etansyra CH3–C(=O)–OH: c2 med dubbelbundet O uppåt och OH åt höger
function etansyra(x0, y) { const m = molekyl(); const [c1, c2] = kedja(m, 2, x0, y); H(m, c1, 0, -DY); H(m, c1, 0, DY); H(m, c1, -DX, 0); m.od = Odbl(m, c2, 0, -DY); const [o, h] = OH(m, c2, DX, 0); m.o = o; m.oh = h; m.c2 = c2; m.c1 = c1; return m; }
function myrsyra(x0, y) { const m = molekyl(); const c = m.atom('C', x0, y); H(m, c, -DX, 0); m.od = Odbl(m, c, 0, -DY); const [o, h] = OH(m, c, DX, 0); m.o = o; m.oh = h; m.c = c; return m; }
function smorsyra(x0, y) { const m = molekyl(); const cs = kedja(m, 4, x0, y); H(m, cs[0], -DX, 0); for (let i = 0; i < 3; i++) { H(m, cs[i], 0, -DY); H(m, cs[i], 0, DY); } m.od = Odbl(m, cs[3], 0, -DY); const [o, h] = OH(m, cs[3], DX, 0); m.o = o; m.oh = h; m.ck = cs[3]; m.cs = cs; return m; }
// ester CH3–C(=O)–O–CH2–CH3: syrans kolatom c2, esterbindning c2–o (o från alkoholen), sedan CH2–CH3
function ester(x0, y) {
  const m = molekyl(); const c1 = m.atom('C', x0, y), c2 = m.atom('C', x0 + DX, y); m.bond(c1, c2);
  H(m, c1, 0, -DY); H(m, c1, 0, DY); H(m, c1, -DX, 0); m.od = Odbl(m, c2, 0, -DY);
  const o = m.atom('O', x0 + 2 * DX, y); m.bond(c2, o, 1, { farg: SIGN, bredd: 3.2, mark: 'esterbindning' });
  const c3 = m.atom('C', x0 + 3 * DX, y), c4 = m.atom('C', x0 + 4 * DX, y); m.bond(o, c3); m.bond(c3, c4);
  H(m, c3, 0, -DY); H(m, c3, 0, DY); H(m, c4, 0, -DY); H(m, c4, 0, DY); H(m, c4, DX, 0);
  m.c2 = c2; m.o = o; m.c3 = c3; return m;
}
// ring runt karboxylgruppen: kolatom c, dubbelbundet O upp, O och H åt höger → ellips
const karboxylRing = (m, c, tag = '') => { const a = m.atomer[c]; return ellips(a.x + DX, a.y - DY * 0.45, DX * 1.45, DY * 1.35, `data-ring="karboxyl" ${tag}`); };
const ohRing = (m, o, tag = '') => { const a = m.atomer[o]; return ellips(a.x + DX / 2, a.y, DX * 0.95, 20, `data-ring="hydroxyl" ${tag}`); };

// ---------- L1. Etan, etanol och etansyra (1.1) ----------
{
  const W = 1000, HH = 330, y = 130, X = [95, 425, 770];
  let ut = '';
  const m1 = etan(X[0], y), m2 = etanol(X[1], y), m3 = etansyra(X[2], y);
  ut += rita(m1, { tag: 'data-molekyl="etan"' });
  ut += rita(m2, { tag: 'data-molekyl="etanol"' }) + ohRing(m2, m2.o, 'data-molekyl="etanol"');
  ut += rita(m3, { tag: 'data-molekyl="etansyra"' }) + karboxylRing(m3, m3.c2, 'data-molekyl="etansyra"');
  const under = (x, grupp, namn, f) => txt(x, 218, grupp, `font-size="14" font-style="italic" fill="${SIGN}"`) + txt(x, 246, namn, 'font-size="17" font-weight="bold"') + txt(x, 272, formelO(f), 'font-size="17"');
  ut += under(X[0] + DX / 2, 'kolväte', 'etan', 'C₂H₆') + under(X[1] + DX / 2, 'alkohol', 'etanol', 'C₂H₅OH') + under(X[2] + DX / 2, 'organisk syra', 'etansyra', 'CH₃COOH');
  ut += pil(X[0] + 2.2 * DX + 6, y, X[1] - 1.3 * DX - 6, y, INK, 1.6) + txt((X[0] + 2.2 * DX + X[1] - 1.3 * DX) / 2, y - 14, '+ en syreatom', 'font-size="12" font-style="italic"');
  ut += pil(X[1] + 2.4 * DX + 6, y, X[2] - 1.3 * DX - 6, y, INK, 1.6) + txt((X[1] + 2.4 * DX + X[2] - 1.3 * DX) / 2, y - 22, '+ en syreatom,', 'font-size="12" font-style="italic"') + txt((X[1] + 2.4 * DX + X[2] - 1.3 * DX) / 2, y - 8, '− två väteatomer', 'font-size="12" font-style="italic"');
  ut += txt(W / 2, HH - 14, 'samma två kolatomer – det som skiljer är hur mycket syre som sitter på', 'font-size="14" font-style="italic"');
  skriv('k5-l1.svg', W, HH, 'Tre molekyler i rad med två kolatomer vardera. Etan utan syre, etanol med en OH-grupp inringad, etansyra med en karboxylgrupp inringad där en syreatom är dubbelbunden', ut);
}

// ---------- L2. Karboxylgruppen (1.1) ----------
{
  const W = 760, HH = 380, x = 400, y = 190, S = 1.5;
  let ut = '';
  const m = molekyl(); const c = m.atom('C', x, y); const od = Odbl(m, c, 0, -DY * S); const [o, h] = OH(m, c, DX * S, 0); const r = m.atom('R', x - DX * S, y, { farg: GRA });
  m.bond(c, r, 1);
  // "resten av molekylen" som ruta i stället för R-bokstav
  const molSvg = rita(m, { tag: 'data-molekyl="karboxyl"', fontsize: FS * 1.4 }).replace(/<text[^>]*data-atom="R"[^>]*>R<\/text>\n/, '');
  ut += rekt(x - DX * S - 70, y - 22, 96, 44, VATE, `rx="6" stroke="${GRA}" stroke-width="1.4" data-del="rest"`) + txt(x - DX * S - 22, y - 2, 'resten av', `font-size="12" fill="${GRA}"`) + txt(x - DX * S - 22, y + 13, 'molekylen', `font-size="12" fill="${GRA}"`);
  ut += molSvg;
  ut += ellips(x + DX * S * 0.85, y - DY * S * 0.45, DX * S * 1.45, DY * S * 1.25, 'data-ring="karboxyl"');
  ut += linje(x + 20, y - DY * S - 6, x + 120, y - DY * S - 40, GRA, 1, 'stroke-dasharray="3 3"') + txt(x + 126, y - DY * S - 44, 'dubbelbunden syreatom', 'font-size="13" font-style="italic" text-anchor="start"');
  ut += linje(x + DX * S * 1.5, y + 18, x + DX * S * 1.5 + 30, y + 70, GRA, 1, 'stroke-dasharray="3 3"') + txt(x + DX * S * 1.5 + 34, y + 84, 'hydroxylgrupp', 'font-size="13" font-style="italic" text-anchor="start"');
  ut += txt(x - 20, y + 62, '2 + 1 + 1 = 4 bindningar', `font-size="14" font-weight="bold" fill="${SIGN}" data-raknare="4"`);
  ut += txt(W / 2, HH - 14, 'alla fyra bindningarna är upptagna – därför sitter gruppen alltid i änden', 'font-size="14" font-style="italic"');
  skriv('k5-l2.svg', W, HH, 'Karboxylgruppen förstorad. Kolatomen har två streck upp till en syreatom, ett streck till en hydroxylgrupp och ett streck till resten av molekylen', ut);
}

// ---------- L3. Etanol oxideras till etansyra (1.2) ----------
{
  const W = 900, HH = 360, y = 150;
  let ut = '';
  const m1 = etanol(150, y, { h1: { farg: GRA, mark: 'bort', streckad: true }, h2: { farg: GRA, mark: 'bort', streckad: true } });
  ut += rita(m1, { tag: 'data-molekyl="etanol"' });
  const a1 = m1.atomer[m1.c2];
  ut += cirkel(a1.x, a1.y - DY, 13, 'none', GRA, 1, 'stroke-dasharray="3 2"') + cirkel(a1.x, a1.y + DY, 13, 'none', GRA, 1, 'stroke-dasharray="3 2"');
  ut += txt(a1.x + 30, a1.y + DY + 6, '− väte', `font-size="13" font-style="italic" fill="${GRA}" text-anchor="start"`);
  ut += pil(330, y, 470, y, INK, 2.5) + txt(400, y - 14, 'oxidation', 'font-size="15" font-weight="bold"');
  const m2 = etansyra(600, y); const od = m2.atomer[m2.od]; od.bak = cirkel(od.x, od.y, 15, GUL, 'none', 0, 'fill-opacity="0.6" data-ny="syre"');
  ut += rita(m2, { tag: 'data-molekyl="etansyra"' });
  ut += txt(od.x + 24, od.y - 4, '+ syre', `font-size="13" font-style="italic" fill="${SYRE}" text-anchor="start"`);
  ut += txt(196, 262, '1 syre, 6 väte', 'font-size="15" font-weight="bold" data-rad="etanol"') + txt(646, 262, '2 syre, 4 väte', 'font-size="15" font-weight="bold" data-rad="etansyra"');
  ut += txt(196, 286, 'etanol, ' + formelO('C₂H₅OH'), 'font-size="15"') + txt(646, 286, 'etansyra (ättiksyra), ' + formelO('CH₃COOH'), 'font-size="15"');
  ut += txt(W / 2, HH - 14, 'molekylen tar upp syre och avger väte – båda sakerna samtidigt', 'font-size="14" font-style="italic"');
  skriv('k5-l3.svg', W, HH, 'Etanol till vänster och etansyra till höger, med en pil märkt oxidation emellan. Den tillkomna syreatomen och de två väteatomer som försvinner är markerade', ut);
}

// ---------- L4. Svag syra i vatten (1.3) ----------
{
  const W = 900, HH = 470, BX = 90, BY = 40, BW = 440, BH = 300;
  let ut = '';
  // bägare
  ut += `  <path d="M${BX} ${BY} L${BX} ${BY + BH} Q${BX} ${BY + BH + 18} ${BX + 18} ${BY + BH + 18} L${BX + BW - 18} ${BY + BH + 18} Q${BX + BW} ${BY + BH + 18} ${BX + BW} ${BY + BH} L${BX + BW} ${BY}" fill="none" stroke="${INK}" stroke-width="2.4"/>\n`;
  ut += `  <path d="M${BX + 3} ${BY + 50} L${BX + 3} ${BY + BH} Q${BX + 3} ${BY + BH + 15} ${BX + 18} ${BY + BH + 15} L${BX + BW - 18} ${BY + BH + 15} Q${BX + BW - 3} ${BY + BH + 15} ${BX + BW - 3} ${BY + BH} L${BX + BW - 3} ${BY + 50} Z" fill="${VATSKA}" fill-opacity="0.45" data-del="vatska"/>\n`;
  // små figurer: hel molekyl = CH₃ + inringat COOH; jon = CH₃ + inringat COO⁻; oxonium = H₃O⁺
  const hel = (x, y) => `  <g data-part="hel" transform="translate(${x} ${y})">\n    <text x="-14" y="5" font-size="11" fill="${INK}" text-anchor="middle" ${FONT}>${sub('CH₃')}</text>\n    <ellipse cx="18" cy="0" rx="22" ry="10" fill="none" stroke="${SIGN}" stroke-width="1"/>\n    <text x="18" y="4" font-size="11" text-anchor="middle" ${FONT}><tspan fill="${INK}">C</tspan><tspan fill="${SYRE}">OOH</tspan></text>\n  </g>\n`;
  const jon = (x, y) => `  <g data-part="jon" transform="translate(${x} ${y})">\n    <text x="-14" y="5" font-size="11" fill="${INK}" text-anchor="middle" ${FONT}>${sub('CH₃')}</text>\n    <ellipse cx="16" cy="0" rx="20" ry="10" fill="none" stroke="${SIGN}" stroke-width="1"/>\n    <text x="16" y="4" font-size="11" text-anchor="middle" ${FONT}><tspan fill="${INK}">C</tspan><tspan fill="${SYRE}">OO</tspan><tspan font-size="8" dy="-5">−</tspan></text>\n  </g>\n`;
  const oxo = (x, y) => `  <g data-part="oxonium" transform="translate(${x} ${y})">\n    <text x="0" y="4" font-size="11" text-anchor="middle" ${FONT}><tspan fill="${INK}">H</tspan><tspan font-size="8" dy="4">3</tspan><tspan fill="${SYRE}" dy="-4">O</tspan><tspan font-size="8" dy="-5">+</tspan></text>\n  </g>\n`;
  const pos = [[150, 120], [230, 105], [310, 125], [400, 110], [470, 135], [170, 175], [260, 165], [350, 180], [440, 185], [140, 230], [220, 225], [300, 240], [390, 230], [480, 245], [160, 290], [250, 300], [340, 295], [430, 310], [200, 330], [290, 340]];
  pos.forEach(([x, y]) => { ut += hel(x, y); });
  ut += jon(490, 290) + oxo(120, 320);
  // förklaringsruta
  ut += rekt(600, 120, 250, 90, VATE, `rx="8" stroke="${INK}" stroke-width="1.2"`) + txt(725, 156, 'hela molekyler: de flesta', 'font-size="15" font-weight="bold"') + txt(725, 186, 'joner: några få', 'font-size="15" font-weight="bold"');
  ut += txt(725, 236, '20 hela molekyler', `font-size="13" font-style="italic" fill="${GRA}"`) + txt(725, 254, '1 etanoatjon + 1 oxoniumjon', `font-size="13" font-style="italic" fill="${GRA}"`);
  // reaktionsformeln med dubbelpil
  const dubbelpil = (x, y) => linje(x - 16, y - 4, x + 16, y - 4, INK, 1.6) + linje(x + 16, y - 4, x + 10, y - 9, INK, 1.6) + linje(x - 16, y + 4, x + 16, y + 4, INK, 1.6) + linje(x - 16, y + 4, x - 10, y + 9, INK, 1.6);
  const fy = 405;
  ut += txt(220, fy + 6, formelO('CH₃COOH') + ' + ' + formelO('H₂O'), 'font-size="20" data-formel="vanster"') + dubbelpil(345, fy) + txt(500, fy + 6, formelO('CH₃COO⁻') + ' + ' + sub('H₃') + `<tspan fill="${SYRE}">O</tspan><tspan font-size="0.7em" dy="-0.45em">+</tspan>`, 'font-size="20" data-formel="hoger"');
  ut += linje(345, fy + 14, 345, fy + 34, GRA, 1, 'stroke-dasharray="3 3"') + txt(345, fy + 50, 'går åt båda hållen samtidigt', `font-size="12" font-style="italic" fill="${GRA}"`);
  skriv('k5-l4.svg', W, HH, 'Ett bägarglas med ättiksyra i vatten. Tjugo hela syramolekyler simmar omkring, och bara en har avgett sin vätejon. Bredvid står reaktionsformeln med dubbelpil', ut);
}

// ---------- L5. Myrsyra och ättiksyra (2.1) ----------
{
  const W = 860, HH = 330, y = 130;
  let ut = '';
  const m1 = myrsyra(200, y); ut += rita(m1, { tag: 'data-molekyl="myrsyra"' });
  ut += ellips(200 + DX * 0.5, y - DY * 0.45, DX * 2.1, DY * 1.45, 'data-ring="karboxyl" data-molekyl="myrsyra"');
  const m2 = etansyra(560, y); ut += rita(m2, { tag: 'data-molekyl="attiksyra"' }) + karboxylRing(m2, m2.c2, 'data-molekyl="attiksyra"');
  ut += `  <ellipse cx="554" cy="${y}" rx="${DX * 0.92}" ry="${DY * 1.4}" fill="none" stroke="${GRA}" stroke-width="1.2" stroke-dasharray="5 4" data-ring="kolkedja"/>\n` + txt(560 - DX * 0.2, y + DY * 1.4 + 18, 'kolkedja', `font-size="12" font-style="italic" fill="${GRA}"`);
  ut += txt(220, 232, 'metansyra', 'font-size="17" font-weight="bold"') + txt(220, 254, 'myrsyra · HC' + `<tspan fill="${SYRE}">OOH</tspan>`, 'font-size="15"');
  ut += txt(583, 232, 'etansyra', 'font-size="17" font-weight="bold"') + txt(583, 254, 'ättiksyra · ' + formelO('CH₃COOH'), 'font-size="15"');
  ut += txt(W / 2, HH - 14, 'hos myrsyra finns ingen kolkedja alls', 'font-size="14" font-style="italic"');
  skriv('k5-l5.svg', W, HH, 'Myrsyra till vänster med en enda kolatom som helt ligger inom den inringade karboxylgruppen. Ättiksyra till höger där en kolatom ligger utanför ringen', ut);
}

// ---------- L6. Syrorna efter kedjelängd (2.2) ----------
{
  const W = 960, HH = 400, AY = 150, SEG = 12, X = [80, 240, 400, 560, 700];
  let ut = '';
  const syror = [['myrsyra', 1, 'vätska', 'försvar hos myror och nässlor'], ['ättiksyra', 2, 'vätska', 'vinäger, konservering'], ['propansyra', 3, 'vätska', 'mögelhämmare'], ['smörsyra', 4, 'vätska', 'lukt'], ['stearinsyra', 18, 'fast', 'stearinljus']];
  // skalan med avbrott mellan 4 och 5
  ut += linje(40, AY + 60, X[3] + 90, AY + 60, INK, 1.4) + linje(X[4] - 30, AY + 60, W - 30, AY + 60, INK, 1.4);
  ut += linje(X[3] + 100, AY + 68, X[3] + 110, AY + 52, INK, 1.4, 'data-avbrott="1"') + linje(X[3] + 110, AY + 68, X[3] + 120, AY + 52, INK, 1.4, 'data-avbrott="1"');
  syror.forEach(([namn, n, till, anv], i) => {
    const x = X[i];
    // karboxylgruppen: inringad symbol COOH (identisk i alla fem)
    ut += ellips(x, AY, 30, 15, `data-ring="karboxyl" data-syra="${namn}"`) + txt(x, AY + 5, `<tspan fill="${INK}">C</tspan><tspan fill="${SYRE}">OOH</tspan>`, `font-size="14" data-syra="${namn}"`);
    // kolkedjan som sicksack: n − 1 segment om SEG px (proportion mot kolantalet)
    let d = `M${x + 30} ${AY}`; for (let k = 1; k < n; k++) { d += ` l${SEG} ${k % 2 ? -8 : 8}`; }
    if (n > 1) ut += `  <path d="${d}" fill="none" stroke="${KOL}" stroke-width="2.4" stroke-linejoin="round" data-kedja="${namn}" data-kol="${n}"/>\n`;
    ut += txt(x, AY + 90, namn, 'font-size="15" font-weight="bold"') + txt(x, AY + 116, `${n} kolatom${n > 1 ? 'er' : ''}`, 'font-size="13"');
    ut += rekt(x - 34, AY + 128, 68, 22, till === 'fast' ? GRA : VATSKA, `rx="11" data-tillstand="${till}"`) + txt(x, AY + 143, till, `font-size="13" fill="${till === 'fast' ? '#fff' : INK}"`);
    const rader = anv.length > 18 ? [anv.slice(0, anv.lastIndexOf(' ', 18)), anv.slice(anv.lastIndexOf(' ', 18) + 1)] : [anv];
    rader.forEach((r, k) => { ut += txt(x, AY + 172 + k * 16, r, 'font-size="12" font-style="italic"'); });
  });
  ut += txt(W / 2, HH - 14, 'karboxylgruppen är densamma i alla fem', 'font-size="14" font-style="italic"');
  skriv('k5-l6.svg', W, HH, 'Fem organiska syror ordnade efter kedjelängd, från myrsyra med en kolatom till stearinsyra med arton. Karboxylgruppen ser likadan ut i alla fem, medan kolkedjan blir allt längre', ut);
}

// ---------- L7. Smörsyra i två sammanhang (2.3) ----------
{
  const W = 960, HH = 400, y = 160, x0 = 380;
  let ut = '';
  const m = smorsyra(x0, y); ut += rita(m, { tag: 'data-molekyl="smorsyra"' }) + karboxylRing(m, m.ck, 'data-molekyl="smorsyra"');
  ut += txt(x0 + 1.5 * DX, 232, 'smörsyra (butansyra)', 'font-size="15" font-weight="bold"');
  const PL = 110;
  ut += pil(x0 - DX - 30, y + 70, x0 - DX - 30 - PL, y + 70, INK, 3, 'data-pil="vanster"') + pil(x0 + 5 * DX + 30, y + 70, x0 + 5 * DX + 30 + PL, y + 70, INK, 3, 'data-pil="hoger"');
  // vänster ruta: härsket smör (näsa + smörklick)
  ut += rekt(20, 250, 300, 110, GRA, 'fill-opacity="0.18" rx="8" data-ruta="smor"');
  ut += `  <path d="M60 300 q6 -26 10 -34 q16 -6 22 12 q4 14 -8 22 q-10 6 -24 0 Z" fill="${VATE}" stroke="${INK}" stroke-width="1.5" data-symbol="nasa"/>\n` + `  <path d="M100 292 q-4 -10 0 -18 M110 292 q-4 -10 0 -18" fill="none" stroke="${GRA}" stroke-width="1.6" stroke-linecap="round"/>\n`;
  ut += txt(200, 288, 'i härsket smör', 'font-size="15" font-weight="bold"') + txt(200, 310, 'luktar illa – en varning', 'font-size="12" font-style="italic"') + txt(200, 326, 'om nedbrytning', 'font-size="12" font-style="italic"');
  // höger ruta: tarmvägg med celler
  ut += rekt(640, 250, 300, 110, SIGN, 'fill-opacity="0.18" rx="8" data-ruta="tarm"');
  for (let i = 0; i < 5; i++) ut += rekt(660 + i * 26, 268, 22, 34, VATE, `rx="5" stroke="${INK}" stroke-width="1.2" data-symbol="cell"`) + cirkel(671 + i * 26, 285, 4, SIGN, 'none', 0);
  ut += txt(840, 288, 'i tjocktarmen', 'font-size="15" font-weight="bold"') + txt(840, 310, 'energikälla åt', 'font-size="12" font-style="italic"') + txt(840, 326, 'slemhinnans celler', 'font-size="12" font-style="italic"');
  ut += txt(W / 2, HH - 14, 'samma molekyl', 'font-size="17" font-weight="bold"');
  skriv('k5-l7.svg', W, HH, 'Smörsyramolekylen i mitten med två lika stora pilar ut. Den vänstra leder till härsket smör, den högra till tjocktarmens slemhinna', ut);
}

// ---------- L8. Estrar och deras dofter (3.1) ----------
{
  const rader = [['Etylformiat', 'rom', 'hallon'], ['Pentylacetat', 'banan', 'banan'], ['Propylacetat', 'päron', 'päron'], ['Etylbutanoat', 'ananas', 'ananas'], ['Oktylacetat', 'apelsin', 'apelsin'], ['Metylsalicylat', 'vintergröna', 'björk, vissa salvor']];
  const KX = [40, 300, 540, 820], RH = 40, TOP = 30, W = 860, HH = TOP + 7 * RH + 60;
  let ut = '';
  ut += rekt(KX[0], TOP, KX[3] - KX[0], RH, SIGN, 'data-del="rubrikrad"');
  ['Ester', 'Doften påminner om', 'Finns naturligt i'].forEach((t, i) => { ut += txt(KX[i] + 14, TOP + 26, t, 'font-size="15" font-weight="bold" fill="#fff" text-anchor="start"'); });
  rader.forEach((r, i) => {
    const y = TOP + (i + 1) * RH;
    ut += linje(KX[0], y + RH, KX[3], y + RH, INK, 0.8);
    r.forEach((c, k) => { ut += txt(KX[k] + 14, y + 26, c, `font-size="15" text-anchor="start" data-rad="${i + 1}" data-kolumn="${k + 1}"`); });
  });
  ut += linje(KX[0], TOP, KX[0], TOP + 7 * RH, INK, 1) + linje(KX[3], TOP, KX[3], TOP + 7 * RH, INK, 1);
  ut += txt(W / 2, TOP + 7 * RH + 36, 'en riktig frukt innehåller många estrar samtidigt', `font-size="15" font-weight="bold" fill="${SIGN}"`);
  skriv('k5-l8.svg', W, HH, 'En tabell med sex estrar, vad deras doft påminner om och var de finns naturligt', ut);
}

// ---------- L9. Esterbildningen (3.2) – gemensam uppställning med M3 och M7 (lib-kondensation.js) ----------
const L9 = {};
{
  const { XS, XA } = KOND;
  const steg1 = y1 => {
    const s1 = etansyra(XS, y1), a1 = etanol(XA, y1);
    // markera syrans OH (o + oh) och alkoholens H på syret med gul fylld cirkel bakom
    for (const i of [s1.o, s1.oh]) { const at = s1.atomer[i]; at.bak = KOND.lamnar(at, 'syra-OH'); at.mark = 'syra-OH'; }
    { const at = a1.atomer[a1.oh]; at.bak = KOND.lamnar(at, 'alkohol-H'); at.mark = 'alkohol-H'; }
    L9.steg1 = { syra: s1, alkohol: a1 };
    return rita(s1, { tag: 'data-steg="1" data-molekyl="etansyra"' }) + karboxylRing(s1, s1.c2, 'data-steg="1"')
      + rita(a1, { tag: 'data-steg="1" data-molekyl="etanol"' }) + ohRing(a1, a1.o, 'data-steg="1"')
      + txt(XS + DX / 2, y1 + 72, 'etansyra', 'font-size="14" font-weight="bold"') + txt(XA + DX / 2, y1 + 72, 'etanol', 'font-size="14" font-weight="bold"');
  };
  const steg2 = y2 => {
    const s2 = etansyra(XS, y2), a2 = etanol(XA, y2);
    const s2c = s2.atomer[s2.c2], a2o = a2.atomer[a2.o];
    s2.ta([s2.o, s2.oh]); a2.ta([a2.oh]);
    L9.steg2 = { syra: s2, alkohol: a2 };
    return rita(s2, { tag: 'data-steg="2" data-molekyl="etansyra"' }) + stub(s2c.x, s2c.y, DX, 0, 'data-steg="2" data-molekyl="etansyra"')
      + rita(a2, { tag: 'data-steg="2" data-molekyl="etanol"' }) + stub(a2o.x, a2o.y, DX, 0, 'data-steg="2" data-molekyl="etanol"');
  };
  const steg3 = y3 => {
    const e = ester(300, y3); L9.steg3 = { ester: e };
    const eb = e.atomer[e.c2], eo = e.atomer[e.o];
    return rita(e, { tag: 'data-steg="3" data-molekyl="ester"' }) + KOND.bindRing((eb.x + eo.x) / 2, y3, 'esterbindning', 'esterbindning')
      + txt(300 + 2 * DX, y3 + 100, 'etyletanoat (etylacetat), ' + sub('CH₃') + '–C' + `<tspan fill="${SYRE}">OO</tspan>` + '–' + sub('CH₂') + '–' + sub('CH₃'), 'font-size="15" font-weight="bold"');
  };
  const ut = KOND.kondensation({ steg1, steg2, steg3, steg2text: 'OH från syran och H från alkoholen bildar vatten', steg3etikett: 'Steg 3 – esterbindningen', reaktion: ['alkohol + organisk syra', 'ester + vatten'] });
  L9.steg2.vatten = KOND.delar({}).vatten;
  skriv('k5-l9.svg', KOND.W, KOND.HH, 'Esterbildningen i tre steg. Först etansyra och etanol med de delar markerade som ska lämna: en OH-grupp från syran och en väteatom från alkoholen. Sedan bildar de tillsammans en vattenmolekyl som lämnar. Sist sitter molekylerna ihop med en esterbindning', ut);
}

// ---------- L10. Fettmolekylen (3.3) ----------
{
  const W = 960, HH = 470, GX = 140, GY0 = 90, GDY = 90;
  let ut = '';
  // glycerolen: lodrät stam, tre kolatomer, varje med ett O åt höger (esterbundet)
  const g = molekyl(); const cs = [];
  for (let i = 0; i < 3; i++) { cs.push(g.atom('C', GX, GY0 + i * GDY)); if (i) g.bond(cs[i - 1], cs[i]); }
  H(g, cs[0], -DX, 0); H(g, cs[0], 0, -DY); H(g, cs[1], -DX, 0); H(g, cs[2], -DX, 0); H(g, cs[2], 0, DY);
  const os = cs.map(c => { const o = g.atom('O', GX + DX, g.atomer[c].y); g.bond(c, o); return o; });
  ut += rita(g, { tag: 'data-molekyl="glycerol"' });
  ut += txt(GX - 10, GY0 + 3 * GDY - 40 + 60, 'glycerol', 'font-size="15" font-weight="bold"');
  ut += txt(GX - 10, GY0 + 3 * GDY + 44, 'tre hydroxylgrupper,', 'font-size="12" font-style="italic"') + txt(GX - 10, GY0 + 3 * GDY + 60, 'tre platser att binda på', 'font-size="12" font-style="italic"');
  // tre fettsyror: karboxylkol med =O uppåt, bundet till glycerolens O, sedan sicksackkedja av olika längd
  const langd = [14, 10, 17];
  os.forEach((o, i) => {
    const oa = g.atomer[o], cx = oa.x + DX, cy = oa.y;
    const f = molekyl(); const c = f.atom('C', cx, cy); const od = Odbl(f, c, 0, -DY);
    ut += linje(oa.x + 13, oa.y, cx - 13, cy, SIGN, 3.2, `data-bind="O-C" data-mark="esterbindning" data-fettsyra="${i + 1}"`);
    ut += rita(f, { tag: `data-fettsyra="${i + 1}"` });
    let d = `M${cx + 14} ${cy}`; for (let k = 0; k < langd[i]; k++) { d += ` l22 ${k % 2 ? 10 : -10}`; }
    ut += `  <path d="${d}" fill="none" stroke="${KOL}" stroke-width="2.4" stroke-linejoin="round" data-kedja="${i + 1}" data-kol="${langd[i] + 1}"/>\n`;
    ut += ellips((oa.x + cx) / 2, cy - 4, 46, 30, `data-ring="esterbindning" data-fettsyra="${i + 1}"`);
    ut += txt(cx + 14 + langd[i] * 22 + 8, cy + 5, `fettsyra ${i + 1}`, 'font-size="13" font-style="italic" text-anchor="start"');
  });
  ut += txt(GX + 2 * DX, GY0 + 2 * GDY + 62, 'tre esterbindningar', `font-size="15" font-weight="bold" fill="${SIGN}"`);
  ut += txt(W / 2, HH - 40, 'glycerol + tre fettsyror → fett + vatten', 'font-size="15" font-style="italic"') + txt(W / 2, HH - 18, 'tre vattenmolekyler lämnar, en per bindning', `font-size="12" font-style="italic" fill="${GRA}"`);
  skriv('k5-l10.svg', W, HH, 'En fettmolekyl schematiskt. Glycerolen till vänster med tre bindningar ut, och tre fettsyror av olika längd till höger. De tre esterbindningarna är inringade', ut);
}

// ================= KONTROLLER =================
const las = SK.las;
const element = (s, filter) => [...s.matchAll(/<(text|circle|line|rect|path|ellipse|polygon|tspan|g)\b([^>]*)>/g)].map(m => { const at = { _tag: m[1] }; for (const a of m[2].matchAll(/([a-z0-9-]+)="([^"]*)"/g)) at[a[1]] = a[2]; return at; }).filter(filter);
const rapport = []; function kolla(n, ok, t) { rapport.push(`${ok ? 'OK ' : 'FEL'} ${n}: ${t}`); if (!ok) process.exitCode = 1; }
const antalAtom = (els, t) => els.filter(e => e['data-atom'] === t).length;
const fmt = m => { const r = rakna(m); return `${r.C} C, ${r.H} H, ${r.O} O`; };
const valens = m => m.atomer.every((a, i) => !a || (a.t === 'C' ? bindTal(m, i) === 4 : a.t === 'O' ? bindTal(m, i) === 2 : a.t === 'H' ? bindTal(m, i) === 1 : true));
{ // syre rött och karboxylring i alla bilder där de förekommer
  for (let i = 1; i <= 10; i++) {
    const s = las(`k5-l${i}.svg`);
    const alla = element(s, e => e['data-atom'] === 'O' || e['data-o'] === '1'), roda = alla.filter(e => e.fill === SYRE).length;
    const tsp = (s.match(/<tspan fill="#C0392B"[^>]*>O+[^<]*<\/tspan>/g) || []).length;
    kolla(`L${i} syre i #C0392B`, alla.length === roda, `${roda} av ${alla.length} syreatomer/O-markeringar röda${tsp ? `, ${tsp} O-tspan i rött` : ''}`);
  }
  for (const [i, vantat] of [[1, 1], [2, 1], [5, 2], [6, 5], [7, 1], [9, 1]]) {
    const s = las(`k5-l${i}.svg`); const r = element(s, e => e['data-ring'] === 'karboxyl');
    kolla(`L${i} karboxylring`, r.length === vantat && r.every(e => e.stroke === SIGN), `${r.length} ring(ar) i signaturfärg (väntat ${vantat})`);
  }
}
{ // L1
  const s = las('k5-l1.svg'); const M = { etan: etan(0, 0), etanol: etanol(0, 0), etansyra: etansyra(0, 0) }, V = { etan: '2 C, 6 H, 0 O', etanol: '2 C, 6 H, 1 O', etansyra: '2 C, 4 H, 2 O' };
  for (const [n, m] of Object.entries(M)) { const e = element(s, x => x['data-molekyl'] === n); kolla(`L1 ${n}`, `${antalAtom(e, 'C')} C, ${antalAtom(e, 'H')} H, ${antalAtom(e, 'O')} O` === V[n] && valens(m), `${antalAtom(e, 'C')} C, ${antalAtom(e, 'H')} H, ${antalAtom(e, 'O')} O; kol 4 streck, syre 2 (data)`); }
  const dbl = element(s, x => x['data-molekyl'] === 'etansyra' && x['data-bind'] === 'C-O').length;
  kolla('L1 dubbelbindning', dbl === 3, `etansyra: ${dbl} C–O-streck (2 i dubbelbindningen + 1 till hydroxylgruppen)`);
}
{ // L2
  const s = las('k5-l2.svg'); const e = element(s, x => x['data-molekyl'] === 'karboxyl');
  const co = e.filter(x => x['data-bind'] === 'C-O').length, cr = e.filter(x => x['data-bind'] === 'C-R').length, oh = e.filter(x => x['data-bind'] === 'O-H').length;
  kolla('L2 fyra streck 2-1-1', co === 3 && cr === 1 && oh === 1 && antalAtom(e, 'O') === 2 && antalAtom(e, 'H') === 1, `från kolatomen: ${co} streck till syre (2 + 1) + ${cr} till resten = 4; ${antalAtom(e, 'O')} O, ${antalAtom(e, 'H')} H (på syret: ${oh} O–H-streck, 0 C–H)`);
}
{ // L3
  const s = las('k5-l3.svg'); const e1 = element(s, x => x['data-molekyl'] === 'etanol'), e2 = element(s, x => x['data-molekyl'] === 'etansyra');
  const bort = e1.filter(x => x['data-atom'] === 'H' && x['data-mark'] === 'bort').length, ny = element(s, x => x['data-ny'] === 'syre').length;
  kolla('L3 markeringar', bort === 2 && ny === 1 && antalAtom(e2, 'O') - antalAtom(e1, 'O') === 1 && antalAtom(e1, 'H') - antalAtom(e2, 'H') === 2, `${bort} väteatomer markerade som bortgående, ${ny} tillkommen syreatom; syre ${antalAtom(e1, 'O')} → ${antalAtom(e2, 'O')}, väte ${antalAtom(e1, 'H')} → ${antalAtom(e2, 'H')}`);
  const rad = k => (s.match(new RegExp(`data-rad="${k}"[^>]*>([^<]*)<`)) || [])[1];
  kolla('L3 räknerader', rad('etanol') === `${antalAtom(e1, 'O')} syre, ${antalAtom(e1, 'H')} väte` && rad('etansyra') === `${antalAtom(e2, 'O')} syre, ${antalAtom(e2, 'H')} väte`, `"${rad('etanol')}" / "${rad('etansyra')}" stämmer med de ritade atomerna`);
}
{ // L4
  const s = las('k5-l4.svg'); const n = t => element(s, e => e['data-part'] === t);
  const p = [...n('jon'), ...n('oxonium')].map(e => e.transform.match(/translate\(([\d.]+) ([\d.]+)\)/).slice(1).map(Number));
  const avst = Math.hypot(p[0][0] - p[1][0], p[0][1] - p[1][1]);
  kolla('L4 proportion', n('hel').length === 20 && n('jon').length === 1 && n('oxonium').length === 1 && avst > 150, `${n('hel').length} hela molekyler, ${n('jon').length} etanoatjon, ${n('oxonium').length} oxoniumjon; jonerna ${Math.round(avst)} px isär`);
  kolla('L4 dubbelpil', /data-formel="vanster"/.test(s) && /data-formel="hoger"/.test(s), 'reaktionsformeln med dubbelpil under bägaren');
}
{ // L5
  const s = las('k5-l5.svg'); const m1 = myrsyra(200, 130), ring = element(s, e => e['data-ring'] === 'karboxyl' && e['data-molekyl'] === 'myrsyra')[0];
  const inne = m1.atomer.every(a => ((a.x - +ring.cx) / +ring.rx) ** 2 + ((a.y - +ring.cy) / +ring.ry) ** 2 <= 1);
  const e1 = element(s, x => x['data-molekyl'] === 'myrsyra'), e2 = element(s, x => x['data-molekyl'] === 'attiksyra');
  kolla('L5 myrsyra', fmt(m1) === '1 C, 2 H, 2 O' && inne && e1.filter(x => x['data-bind'] === 'C-H').length === 1 && e1.filter(x => x['data-bind'] === 'O-H').length === 1, `${fmt(m1)}; ringen omfattar alla ${m1.atomer.length} atomer; ett väte på kolet, ett på syret`);
  const m2 = etansyra(560, 130), ring2 = element(s, e => e['data-ring'] === 'karboxyl' && e['data-molekyl'] === 'attiksyra')[0];
  const ute = m2.atomer.filter(a => ((a.x - +ring2.cx) / +ring2.rx) ** 2 + ((a.y - +ring2.cy) / +ring2.ry) ** 2 > 1);
  kolla('L5 ättiksyra', fmt(m2) === '2 C, 4 H, 2 O' && ute.length === 4 && ute.filter(a => a.t === 'C').length === 1 && element(s, e => e['data-ring'] === 'kolkedja').length === 1, `${fmt(m2)}; utanför karboxylringen: ${ute.map(a => a.t).join('')} (CH₃), markerad med grå ring`);
}
{ // L6
  const s = las('k5-l6.svg'); const ked = element(s, e => e['data-kedja']);
  const segs = ked.map(e => ({ n: +e['data-kol'], seg: (e.d.match(/ l/g) || []).length }));
  const ringar = element(s, e => e['data-ring'] === 'karboxyl');
  const lika = new Set(ringar.map(e => e.rx + '/' + e.ry + '/' + e.stroke)).size === 1;
  const avbrott = element(s, e => e['data-avbrott']).map(e => +e.x1);
  kolla('L6 kedjor', segs.every(x => x.seg === x.n - 1) && segs.length === 4 && lika, `segment per kolatom: ${segs.map(x => `${x.n} C → ${x.seg}`).join(', ')} (myrsyra 0); fem identiska karboxylringar: ${lika}`);
  kolla('L6 avbrott', avbrott.length === 2 && avbrott.every(x => x > 560 && x < 700), `avbrottet vid x ${avbrott.join('/')} – mellan position 4 (x 560) och 5 (x 700)`);
  const till = element(s, e => e['data-tillstand']).map(e => e['data-tillstand'] + ':' + e.fill);
  kolla('L6 tillstånd', till.join(' ') === `vätska:${VATSKA} vätska:${VATSKA} vätska:${VATSKA} vätska:${VATSKA} fast:${GRA}`, till.join(' '));
}
{ // L7
  const s = las('k5-l7.svg'); const e = element(s, x => x['data-molekyl'] === 'smorsyra');
  const pv = element(s, x => x['data-pil'] === 'vanster' && x._tag === 'line')[0], ph = element(s, x => x['data-pil'] === 'hoger' && x._tag === 'line')[0];
  const lv = Math.abs(+pv.x2 - +pv.x1), lh = Math.abs(+ph.x2 - +ph.x1);
  kolla('L7 en molekyl, två lika pilar', antalAtom(e, 'C') === 4 && antalAtom(e, 'H') === 8 && antalAtom(e, 'O') === 2 && valens(smorsyra(0, 0)) && lv === lh && pv['stroke-width'] === ph['stroke-width'], `${antalAtom(e, 'C')} C, ${antalAtom(e, 'H')} H, ${antalAtom(e, 'O')} O; pilar ${lv} och ${lh} px, bredd ${pv['stroke-width']}/${ph['stroke-width']}`);
}
{ // L8
  const s = las('k5-l8.svg'); const rader = new Set(element(s, e => e['data-rad']).map(e => e['data-rad'])).size;
  kolla('L8 tabell', rader === 6 && !/<image/.test(s) && element(s, e => e['data-del'] === 'rubrikrad')[0].fill === SIGN, `${rader} rader, rubrikrad i signaturfärg, inga bilder`);
}
{ // L9 – den kritiska
  const s = las('k5-l9.svg');
  const { syra, alkohol } = L9.steg1;
  // vad lämnar syran? de atomer med mark syra-OH: måste vara exakt ett O bundet till karboxylkolet och ett H bundet till det O:et
  const sl = syra.atomer.map((a, i) => ({ a, i })).filter(x => x.a.mark === 'syra-OH');
  const sO = sl.filter(x => x.a.t === 'O'), sH = sl.filter(x => x.a.t === 'H');
  const syraOk = sO.length === 1 && sH.length === 1 && grannar(syra, sO[0].i).includes(syra.c2) && grannar(syra, sH[0].i).includes(sO[0].i) && bindTal(syra, sO[0].i) === 2;
  const al = alkohol.atomer.map((a, i) => ({ a, i })).filter(x => x.a.mark === 'alkohol-H');
  const alkOk = al.length === 1 && al[0].a.t === 'H' && alkohol.atomer[grannar(alkohol, al[0].i)[0]].t === 'O';
  kolla('L9 syran lämnar OH', syraOk, `markerat i syran: ${sl.map(x => x.a.t).join(' + ')} – syret enkelbundet till karboxylkolet, vätet bundet till det syret`);
  kolla('L9 alkoholen lämnar H', alkOk, `markerat i alkoholen: ${al.map(x => x.a.t).join(' + ')} – vätet sitter på syret, inte på kolet`);
  const svgS = element(s, e => e['data-lamnar'] === 'syra-OH').length, svgA = element(s, e => e['data-lamnar'] === 'alkohol-H').length;
  kolla('L9 markeringar i SVG', svgS === 2 && svgA === 1, `${svgS} gula markeringar i syran (O + H), ${svgA} i alkoholen (H)`);
  const s2 = L9.steg2, r1s = rakna(syra), r2s = rakna(s2.syra), r1a = rakna(alkohol), r2a = rakna(s2.alkohol), rw = rakna(s2.vatten);
  kolla('L9 steg 2', r1s.O - r2s.O === 1 && r1s.H - r2s.H === 1 && r1a.H - r2a.H === 1 && r1a.O === r2a.O && rw.H === 2 && rw.O === 1 && element(s, e => e['data-stub']).length === 2, `syran förlorar 1 O + 1 H, alkoholen 1 H, vattnet ${rw.H} H + ${rw.O} O; två lediga bindningar`);
  const e = L9.steg3.ester, re = rakna(e);
  const eb = e.bind.find(b => b.mark === 'esterbindning'), ebC = e.atomer[eb.a].t === 'C' ? eb.a : eb.b, ebO = eb.a === ebC ? eb.b : eb.a;
  const cHarDubbelO = e.bind.some(b => b.n === 2 && (b.a === ebC || b.b === ebC)), oTillCH2 = grannar(e, ebO).filter(i => i !== ebC).every(i => e.atomer[i].t === 'C');
  kolla('L9 steg 3', re.C === 4 && re.H === 8 && re.O === 2 && valens(e) && cHarDubbelO && oTillCH2 && r1s.C + r1a.C === re.C && r1s.H + r1a.H === re.H + rw.H && r1s.O + r1a.O === re.O + rw.O, `estern ${fmt(e)}, kol 4 streck, syre 2; esterbindningen går från karboxylkolet (med dubbelbundet O) till alkoholens syre (vidare till CH₂); atombalans: ${fmt(syra)} + ${fmt(alkohol)} = ester + ${fmt(s2.vatten)}`);
  kolla('L9 dubbelpil', /alkohol \+ organisk syra/.test(s) && /ester \+ vatten/.test(s), 'ordreaktionen med dubbelpil under bilden');
}
{ // L10
  const s = las('k5-l10.svg'); const ringar = element(s, e => e['data-ring'] === 'esterbindning'), bind = element(s, e => e['data-mark'] === 'esterbindning'), ked = element(s, e => e['data-kedja']);
  const g = element(s, e => e['data-molekyl'] === 'glycerol');
  kolla('L10 tre esterbindningar', ringar.length === 3 && bind.length === 3 && ked.length === 3 && new Set(ked.map(e => e['data-kol'])).size === 3 && antalAtom(g, 'C') === 3 && antalAtom(g, 'O') === 3, `${ringar.length} ringar, ${bind.length} markerade bindningar, ${ked.length} fettsyror med ${ked.map(e => e['data-kol']).join('/')} kolatomer (olika långa); glycerol ${antalAtom(g, 'C')} C, ${antalAtom(g, 'O')} O`);
}
console.log(`${SK.antal} SVG skrivna till ${path.relative(ROT, UT)}`);
console.log(rapport.join('\n'));
