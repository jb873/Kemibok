// bilder-svg.js – genererar de text-/notationsbilder som inte går som AI-bild
// (Joachims spec 2026-09-13). Skriver till kapitel/syror-och-baser/delkapitel/repetition/img/.
// Kör: node verktyg/bilder-svg.js
//
//   periodiska-systemet-forenklat.svg   avsnitt 2 A – period 1–3, grupp 1/2/17/18 färgade
//   molekylmodeller-vatten.svg          avsnitt 3 C – fem sätt att rita H2O
//   jonbindning-natrium-klor.svg        avsnitt 3 B – Na + Cl → Na+ + Cl- (staplad layout)
//   polar-vattenmolekyl.svg             avsnitt 4 A – kulpinnmodell med δ− / δ+ och pilar
//   elektronpar-vate.svg                avsnitt 3 C – två fria väteatomer / H2 med delat elektronpar (ingen text)
//   adelgasstruktur.svg                 avsnitt 3 A – neon (2+8) mot natrium (2+8+1)
//   tre-vagar.svg                       avsnitt 3 A – avge / ta upp / dela
//   vatebindning.svg                    avsnitt 4 A – fem vattenmolekyler, fyra vätebindningar från mittmolekylen
//   tva-vagar-till-bas.svg              delkapitel Baser 1 B – NaOH-gitter / NH3 + H2O → NH4+ + OH- (baser/img/)
//   neutralisation-partiklar.svg        delkapitel Neutralisation 1 A – sur + basisk → neutral (neutralisation/img/)
//   vad-blir-kvar.svg                   delkapitel Neutralisation 1 B – före/efter, åskådarjoner kvar
//   vatejon-och-oxoniumjon.svg          delkapitel Syror 1 B – H2O + H+ → H3O+ i tre lager (skrivs till delkapitel/syror/img/)
//   ph-skalan.svg                       delkapitel Syror 2 A – skala 0–14 med exempel (syror/img/)
//   fyra-kombinationerna.svg            delkapitel Syror 4 B – stark/svag × koncentrerad/utspädd (syror/img/)
//
// Färger: linjer/text #2d4a35, rutor/väte #f5f0e4, syre #C0392B, proton #C64B3A,
// neutron #8A8A8A, elektron #3D6BA8. Transparent bakgrund. Typsnitt: Georgia-fallback
// (extern SVG i <img> når inte sidans webbfonter).
'use strict';
const fs = require('fs'), path = require('path');
const A = require('./atommodeller.js');
const UT = path.join(__dirname, '..', 'kapitel', 'syror-och-baser', 'delkapitel', 'repetition', 'img');
const INK = '#2d4a35', PAPPER = '#f5f0e4', SYRE = '#C0392B', GRA = '#8A8A8A', VARMGRA = '#9a8b7a';
const FONT = `font-family="Georgia, 'Times New Roman', serif"`;
const r2 = A.r2;
function svg(w, h, titel, inneh) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-labelledby="t">
  <title id="t">${titel}</title>
${inneh}</svg>
`;
}
function pil(x1, y1, x2, y2, farg, bredd) {
  // linje med pilspets (ritad som polygon, inget marker-beroende)
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
  if (L < 1) { throw new Error(`pil utan längd vid ${x1},${y1}`); }
  const ux = dx / L, uy = dy / L;
  const s = (bredd || 2) * 4, bx = x2 - ux * s, by = y2 - uy * s;
  return `  <line x1="${r2(x1)}" y1="${r2(y1)}" x2="${r2(bx)}" y2="${r2(by)}" stroke="${farg}" stroke-width="${bredd || 2}" stroke-linecap="round"/>
  <polygon points="${r2(x2)},${r2(y2)} ${r2(bx - uy * s * 0.5)},${r2(by + ux * s * 0.5)} ${r2(bx + uy * s * 0.5)},${r2(by - ux * s * 0.5)}" fill="${farg}"/>\n`;
}

// ---------- 1. Periodiska systemet ----------
{
  const PERIODER = [
    [[1, 'H', 1], [18, 'He', 2]],
    [[1, 'Li', 3], [2, 'Be', 4], [13, 'B', 5], [14, 'C', 6], [15, 'N', 7], [16, 'O', 8], [17, 'F', 9], [18, 'Ne', 10]],
    [[1, 'Na', 11], [2, 'Mg', 12], [13, 'Al', 13], [14, 'Si', 14], [15, 'P', 15], [16, 'S', 16], [17, 'Cl', 17], [18, 'Ar', 18]]
  ];
  // fyra dämpade toner, svart/mörkgrön text läsbar på alla
  const GRUPPFARG = { 1: '#e3bfb6', 2: '#e8d6a6', 17: '#c8d8b3', 18: '#bfd2dc' };
  const C = 46, G = 4, X0 = 34, Y0 = 26;
  let ut = '';
  for (let g = 1; g <= 18; g++) {
    ut += `  <text x="${r2(X0 + (g - 1) * (C + G) + C / 2)}" y="${Y0 - 8}" text-anchor="middle" font-size="12" fill="${INK}" ${FONT}>${g}</text>\n`;
  }
  PERIODER.forEach((rad, pi) => {
    const y = Y0 + pi * (C + G);
    ut += `  <text x="${X0 - 12}" y="${r2(y + C / 2 + 4)}" text-anchor="middle" font-size="12" fill="${INK}" ${FONT}>${pi + 1}</text>\n`;
    for (const [g, sym, z] of rad) {
      const x = X0 + (g - 1) * (C + G);
      ut += `  <g class="ruta" data-grupp="${g}" data-period="${pi + 1}" data-z="${z}" data-sym="${sym}">
    <rect x="${x}" y="${y}" width="${C}" height="${C}" rx="3" fill="${GRUPPFARG[g] || PAPPER}" stroke="${INK}" stroke-width="1.5"/>
    <text x="${x + 5}" y="${y + 13}" font-size="10" fill="${INK}" ${FONT}>${z}</text>
    <text x="${r2(x + C / 2)}" y="${y + 34}" text-anchor="middle" font-size="20" fill="${INK}" ${FONT}>${sym}</text>
  </g>\n`;
    }
  });
  const W = X0 + 18 * (C + G) - G + 8, H = Y0 + 3 * (C + G) - G + 8;
  fs.mkdirSync(UT, { recursive: true });
  fs.writeFileSync(path.join(UT, 'periodiska-systemet-forenklat.svg'), svg(W, H,
    'Förenklat periodiskt system, period 1–3, med grupp 1, 2, 17 och 18 färgmarkerade', ut));
}

// ---------- gemensamt: vattenmolekyl som kulpinn/kalott ----------
const VINKEL = 105;   // H–O–H
function vatten(cx, cy, rO, rH, avst, stav) {
  // H under O, symmetriskt kring lodlinjen
  const a = (VINKEL / 2) * Math.PI / 180;
  const H = [[cx - avst * Math.sin(a), cy + avst * Math.cos(a)], [cx + avst * Math.sin(a), cy + avst * Math.cos(a)]];
  let ut = '';
  if (stav) { H.forEach(([x, y]) => { ut += `  <line x1="${cx}" y1="${cy}" x2="${r2(x)}" y2="${r2(y)}" stroke="${stav.farg}" stroke-width="${stav.bredd}" stroke-linecap="round"/>\n`; }); }
  ut += `  <circle class="syre" cx="${cx}" cy="${cy}" r="${rO}" fill="${SYRE}" stroke="${INK}" stroke-width="1.5"/>\n`;
  H.forEach(([x, y]) => { ut += `  <circle class="vate" cx="${r2(x)}" cy="${r2(y)}" r="${rH}" fill="${PAPPER}" stroke="${INK}" stroke-width="1.5"/>\n`; });
  return { ut, H };
}

// ---------- 2. Molekylmodeller ----------
{
  const P = 180, H = 190, W = 5 * P;
  let ut = '';
  for (let i = 1; i < 5; i++) { ut += `  <line x1="${i * P}" y1="16" x2="${i * P}" y2="${H - 30}" stroke="${INK}" stroke-width="1" opacity="0.5"/>\n`; }
  const cx = i => i * P + P / 2, cy = 82;
  // 1 summaformel
  ut += `  <text x="${cx(0)}" y="${cy + 14}" text-anchor="middle" font-size="44" fill="${INK}" ${FONT}>H<tspan font-size="26" dy="10">2</tspan><tspan dy="-10">O</tspan></text>\n`;
  // 2 strukturformel
  ut += `  <text x="${cx(1)}" y="${cy + 12}" text-anchor="middle" font-size="36" fill="${INK}" ${FONT}>H–O–H</text>\n`;
  // 3 punktformel: O i mitten, H i vinkel, prickpar
  {
    const ox = cx(2), oy = cy, d = 52, a = (VINKEL / 2) * Math.PI / 180;
    const Hs = [[ox - d * Math.sin(a), oy + d * Math.cos(a)], [ox + d * Math.sin(a), oy + d * Math.cos(a)]];
    ut += `  <text x="${ox}" y="${oy + 11}" text-anchor="middle" font-size="32" fill="${INK}" ${FONT}>O</text>\n`;
    Hs.forEach(([x, y]) => { ut += `  <text x="${r2(x)}" y="${r2(y + 10)}" text-anchor="middle" font-size="28" fill="${INK}" ${FONT}>H</text>\n`; });
    // bindande par: två prickar mitt emellan O och H, vinkelrätt mot bindningen
    Hs.forEach(([x, y]) => {
      const mx = (ox + x) / 2, my = (oy + y) / 2, ux = (x - ox) / d, uy = (y - oy) / d, px = -uy, py = ux;
      [-4, 4].forEach(s => { ut += `  <circle class="elektronprick" cx="${r2(mx + px * s)}" cy="${r2(my + py * s)}" r="3" fill="${INK}"/>\n`; });
    });
    // fria par: två par ovanför O (snett upp åt vänster och höger)
    [[-1, 0], [1, 0]].forEach(([sx]) => {
      const bx = ox + sx * 14, by = oy - 24;
      [-4, 4].forEach(s => { ut += `  <circle class="elektronprick" cx="${r2(bx + s)}" cy="${r2(by)}" r="3" fill="${INK}"/>\n`; });
    });
  }
  // 4 kulpinn
  ut += vatten(cx(3), cy - 12, 22, 13, 46, { farg: GRA, bredd: 6 }).ut;
  // 5 kalott
  ut += vatten(cx(4), cy - 10, 30, 19, 32, null).ut;
  ['Summaformel', 'Strukturformel', 'Punktformel', 'Kulpinnmodell', 'Kalottmodell'].forEach((n, i) => {
    ut += `  <text x="${cx(i)}" y="${H - 8}" text-anchor="middle" font-size="14" fill="${INK}" ${FONT}>${n}</text>\n`;
  });
  fs.writeFileSync(path.join(UT, 'molekylmodeller-vatten.svg'), svg(W, H,
    'Samma vattenmolekyl visad på fem sätt: summaformel, strukturformel, punktformel, kulpinnmodell och kalottmodell', ut));
}

// ---------- 3. Jonbindning natrium–klor (staplad) ----------
{
  const rK = 5.5, rE = 6, skal = [48, 74, 100];
  const M = 214;                         // en modells bredd
  const W = 2 * M + 70, X1 = M / 2 + 10, X2 = W - M / 2 - 10;
  const Y1 = 120, Y2 = 430, Y3 = 660, H = 760;
  const mod = (cx, cy, p, n, e, titel) => A.modell({ cx, cy, p, n, rK, rE, skal: skal.map((R, i) => ({ R, e: e[i], start: [-90, -67.5, 0][i] })) }, titel);
  let ut = '';
  // steg 1
  ut += mod(X1, Y1, 11, 12, [2, 8, 1], 'Natriumatom');
  ut += mod(X2, Y1, 17, 18, [2, 8, 7], 'Kloratom');
  ut += `  <text x="${X1}" y="${Y1 + 128}" text-anchor="middle" font-size="22" fill="${INK}" ${FONT}>Na</text>\n`;
  ut += `  <text x="${X2}" y="${Y1 + 128}" text-anchor="middle" font-size="22" fill="${INK}" ${FONT}>Cl</text>\n`;
  // pil: från natriums yttersta elektron (vinkel 0 = höger) till klors yttersta bana (vänster sida)
  ut += pil(X1 + skal[2] + rE + 4, Y1, X2 - skal[2] - 6, Y1, INK, 2.5);
  // pil ned mellan stegen
  ut += pil(W / 2, Y1 + 140, W / 2, Y2 - 118, INK, 3);   // 260 → 312, tydlig längd
  // steg 2
  ut += mod(X1, Y2, 11, 12, [2, 8, 0], 'Natriumjon');
  ut += mod(X2, Y2, 17, 18, [2, 8, 8], 'Kloridjon');
  const sup = (x, y, bas, tecken) => `  <text x="${x}" y="${y}" text-anchor="middle" font-size="22" fill="${INK}" ${FONT}>${bas}<tspan font-size="14" dy="-9">${tecken}</tspan></text>\n`;
  ut += sup(X1, Y2 + 128, 'Na', '+') + sup(X2, Y2 + 128, 'Cl', '−');
  // jonparet: två små joner som dras mot varandra
  const rS = 0.55;
  ut += `  <g transform="translate(${r2(W / 2 - 92)} ${Y3}) scale(${rS})">\n` + mod(0, 0, 11, 12, [2, 8, 0], 'Natriumjon (liten)') + `  </g>\n`;
  ut += `  <g transform="translate(${r2(W / 2 + 92)} ${Y3}) scale(${rS})">\n` + mod(0, 0, 17, 18, [2, 8, 8], 'Kloridjon (liten)') + `  </g>\n`;
  ut += pil(W / 2 - 92 + (skal[2] + 8) * rS, Y3, W / 2 - 6, Y3, INK, 2.5);
  ut += pil(W / 2 + 92 - (skal[2] + 8) * rS, Y3, W / 2 + 6, Y3, INK, 2.5);
  ut += sup(W / 2 - 92, Y3 + 78, 'Na', '+') + sup(W / 2 + 92, Y3 + 78, 'Cl', '−');
  fs.writeFileSync(path.join(UT, 'jonbindning-natrium-klor.svg'), svg(W, H,
    'Jonbindning: natriumatomen avger sin ytterelektron till kloratomen; natriumjonen och kloridjonen dras mot varandra', ut));
}

// ---------- 4. Polär vattenmolekyl ----------
{
  const W = 320, H = 250, cx = 160, cy = 92;
  const v = vatten(cx, cy, 40, 24, 92, { farg: VARMGRA, bredd: 10 });
  let ut = v.ut;
  const delta = (x, y, tecken) => `  <text x="${r2(x)}" y="${r2(y)}" text-anchor="middle" font-size="22" fill="${INK}" ${FONT}>δ${tecken}</text>\n`;
  ut += delta(cx + 58, cy - 34, '−');
  v.H.forEach(([x, y], i) => { ut += delta(x + (i === 0 ? -40 : 40), y + 8, '+'); });
  // pilar längs bindningarna, från H mot O, parallellförskjutna utanför staven
  v.H.forEach(([x, y]) => {
    const dx = cx - x, dy = cy - y, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, px = -uy, py = ux;
    const off = 16, sx = x + ux * 26 + px * off, sy = y + uy * 26 + py * off, ex = cx - ux * 48 + px * off, ey = cy - uy * 48 + py * off;
    ut += pil(sx, sy, ex, ey, INK, 2);
  });
  fs.writeFileSync(path.join(UT, 'polar-vattenmolekyl.svg'), svg(W, H,
    'Polär vattenmolekyl: syre märkt delta minus, väte delta plus, pilar visar att elektronerna dras mot syret', ut));
}
// ---------- 5. Elektronpar väte (två fria atomer | vätemolekyl) ----------
{
  const W = 600, H = 220, cy = 110, r = 48, prick = 5;
  const atom = (cx) => `  <circle class="vate" cx="${cx}" cy="${cy}" r="${r}" fill="${PAPPER}" stroke="${INK}" stroke-width="2"/>
`;
  const el = (cx) => `  <circle class="elektron" cx="${cx}" cy="${cy}" r="${prick}" fill="#3D6BA8"/>
`;
  let ut = `  <line x1="${W / 2}" y1="16" x2="${W / 2}" y2="${H - 16}" stroke="${INK}" stroke-width="2"/>
`;
  // vänster: två fria atomer med tydligt mellanrum, en elektron i mitten av varje
  const gap = 28, L1 = W / 4 - r - gap / 2, L2 = W / 4 + r + gap / 2;
  ut += atom(L1) + atom(L2) + el(L1) + el(L2);
  // höger: överlapp ≈ en fjärdedel av diametern (0.28 D så att paret ryms i zonen);
  // elektronparet vågrätt på centrumlinjen, centrerat i överlappet
  const d = 2 * r * (1 - 0.28), R1 = 3 * W / 4 - d / 2, R2 = 3 * W / 4 + d / 2, mitt = 3 * W / 4, sep = 7.5;
  ut += atom(R1) + atom(R2) + el(mitt - sep) + el(mitt + sep);
  fs.writeFileSync(path.join(UT, 'elektronpar-vate.svg'), svg(W, H,
    'Två fria väteatomer med varsin elektron, och en vätemolekyl där de två elektronerna ligger som ett gemensamt par i överlappet', ut));
}
// ---------- 6. Vätejon + vattenmolekyl → oxoniumjon, tre lager ----------
{
  const UT2 = path.join(__dirname, '..', 'kapitel', 'syror-och-baser', 'delkapitel', 'syror', 'img');
  fs.mkdirSync(UT2, { recursive: true });
  const W = 700, H = 340;
  // kolumner – samma x i alla tre lager
  const X = { vatten: 115, plus: 235, vatejon: 325, pilFran: 385, pilTill: 480, oxonium: 585 };
  const Y = { mol: 100, ord: 218, formel: 300 };
  const rO = 26, rH = 15, avst = 48, PROTON = '#C64B3A';
  const prick = (x, y) => `  <circle class="elektronprick" cx="${r2(x)}" cy="${r2(y)}" r="3.2" fill="${INK}"/>
`;
  const par = (cx, cy, vinkelGrader, R) => { const v = vinkelGrader * Math.PI / 180, px = -Math.sin(v), py = Math.cos(v); const bx = cx + R * Math.cos(v), by = cy + R * Math.sin(v); return prick(bx + px * 4.5, by + py * 4.5) + prick(bx - px * 4.5, by - py * 4.5); };
  const H_at = (cx, cy, grader) => [cx + avst * Math.cos(grader * Math.PI / 180), cy + avst * Math.sin(grader * Math.PI / 180)];
  const molekyl = (cx, cy, hVinklar, friaPar) => {
    let ut = '';
    hVinklar.forEach(g => { const [x, y] = H_at(cx, cy, g); ut += `  <line x1="${cx}" y1="${cy}" x2="${r2(x)}" y2="${r2(y)}" stroke="${VARMGRA}" stroke-width="7" stroke-linecap="round"/>
`; });
    ut += `  <circle class="syre" cx="${cx}" cy="${cy}" r="${rO}" fill="${SYRE}" stroke="${INK}" stroke-width="1.5"/>
`;
    hVinklar.forEach(g => { const [x, y] = H_at(cx, cy, g); ut += `  <circle class="vate" cx="${r2(x)}" cy="${r2(y)}" r="${rH}" fill="${PAPPER}" stroke="${INK}" stroke-width="1.5"/>
`; });
    friaPar.forEach(g => { ut += par(cx, cy, g, rO + 8); });
    return ut;
  };
  let ut = '';
  // --- lager 1: molekyler ---
  ut += `  <g aria-label="vattenmolekyl">
` + molekyl(X.vatten, Y.mol, [52.5, 127.5], [-120, -60]) + `  </g>
`;   // H nedåt, två fria par uppåt
  ut += `  <text x="${X.plus}" y="${Y.mol + 11}" text-anchor="middle" font-size="34" fill="${INK}" ${FONT}>+</text>
`;
  ut += `  <g aria-label="vätejon">
  <circle cx="${X.vatejon}" cy="${Y.mol}" r="13" fill="${PROTON}" stroke="#fff" stroke-width="1.5"/>
  <path d="M${X.vatejon - 6} ${Y.mol}H${X.vatejon + 6}M${X.vatejon} ${Y.mol - 6}V${Y.mol + 6}" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>
  </g>
`;
  ut += pil(X.pilFran, Y.mol, X.pilTill, Y.mol, INK, 3);
  // oxonium: tre H (vänster, ned-vänster, ned-höger) + ett fritt par uppåt-höger, hakparentes med +
  ut += `  <g aria-label="oxoniumjon">
` + molekyl(X.oxonium, Y.mol, [180, 60, 120], [-70]);
  const bx1 = X.oxonium - 72, bx2 = X.oxonium + 72, by1 = Y.mol - 52, by2 = Y.mol + 66;
  ut += `  <path d="M${bx1 + 10} ${by1}H${bx1}V${by2}H${bx1 + 10}" fill="none" stroke="${INK}" stroke-width="2.5"/>
  <path d="M${bx2 - 10} ${by1}H${bx2}V${by2}H${bx2 - 10}" fill="none" stroke="${INK}" stroke-width="2.5"/>
`;
  ut += `  <text x="${bx2 + 6}" y="${by1 + 4}" font-size="22" fill="${INK}" ${FONT}>+</text>
  </g>
`;
  // --- lager 2: ord ---
  const ord = (x, t) => `  <text x="${x}" y="${Y.ord + 7}" text-anchor="middle" font-size="20" fill="${INK}" ${FONT}>${t}</text>
`;
  ut += ord(X.vatten, 'vattenmolekyl') + `  <text x="${X.plus}" y="${Y.ord + 9}" text-anchor="middle" font-size="28" fill="${INK}" ${FONT}>+</text>
` + ord(X.vatejon, 'vätejon') + pil(X.pilFran, Y.ord, X.pilTill, Y.ord, INK, 2.5) + ord(X.oxonium, 'oxoniumjon');
  // --- lager 3: formel ---
  const F = (x, inner) => `  <text x="${x}" y="${Y.formel + 9}" text-anchor="middle" font-size="30" fill="${INK}" ${FONT}>${inner}</text>
`;
  const sub = n => `<tspan font-size="19" dy="8">${n}</tspan><tspan dy="-8">`;
  ut += F(X.vatten, `H${sub(2)}O</tspan>`);
  ut += `  <text x="${X.plus}" y="${Y.formel + 9}" text-anchor="middle" font-size="30" fill="${INK}" ${FONT}>+</text>
`;
  ut += F(X.vatejon, `H<tspan font-size="18" dy="-12">+</tspan>`);
  ut += pil(X.pilFran, Y.formel, X.pilTill, Y.formel, INK, 2.5);
  ut += F(X.oxonium, `H${sub(3)}O</tspan><tspan font-size="18" dy="-12">+</tspan>`);
  fs.writeFileSync(path.join(UT2, 'vatejon-och-oxoniumjon.svg'), svg(W, H,
    'Vattenmolekyl plus vätejon ger oxoniumjon, i tre lager: molekylbilder, ord och formeln H2O + H+ → H3O+', ut));
}

// ---------- 7. pH-skalan (delkapitel Syror, avsnitt 2 A) ----------
// Färger: skalans övergång är inte hex-specificerad i leveransen ("djupt röd … mörkblå").
// FÖRSLAG (ej godkända 2026-09-13): rött = SYRE #C0392B, orange #E07B39, gult #E8C547,
// grönt = patina #5a9668, ljusblått #a8c4d8 (Joachims vätskefärg), mörkblått #2F4F8F.
{
  const UT2 = path.join(__dirname, '..', 'kapitel', 'syror-och-baser', 'delkapitel', 'syror', 'img');
  const W = 760, H = 300;
  const X0 = 50, X1 = 710, Y = 150, HOJD = 34;
  const px = ph => r2(X0 + (X1 - X0) * ph / 14);
  const STOPP = [[0, '#C0392B'], [3, '#E07B39'], [5, '#E8C547'], [7, '#5a9668'], [9, '#a8c4d8'], [14, '#2F4F8F']];
  let ut = `  <defs>
    <linearGradient id="ph" x1="0" x2="1" y1="0" y2="0">
${STOPP.map(([ph, f]) => `      <stop offset="${r2(ph / 14 * 100)}%" stop-color="${f}"/>`).join('\n')}
    </linearGradient>
  </defs>
  <rect x="${X0}" y="${Y}" width="${X1 - X0}" height="${HOJD}" rx="4" fill="url(#ph)" stroke="${INK}" stroke-width="1.5"/>
`;
  for (let ph = 0; ph <= 14; ph++) {
    ut += `  <line x1="${px(ph)}" y1="${Y + HOJD}" x2="${px(ph)}" y2="${Y + HOJD + 7}" stroke="${INK}" stroke-width="1.5"/>
  <text x="${px(ph)}" y="${Y + HOJD + 24}" text-anchor="middle" font-size="15" fill="${INK}" ${FONT}>${ph}</text>
`;
  }
  // etiketter ovanför med linjer ner till rätt position (växlande höjd så att texterna inte krockar)
  const ETIK = [[1.5, 'Magsyra', 1], [2.5, 'Citronsaft', 0], [5, 'Kaffe', 1], [7, 'Rent vatten', 0], [9.5, 'Tvållösning', 1]];
  for (const [ph, namn, rad] of ETIK) {
    const ty = rad ? 62 : 96;
    ut += `  <line x1="${px(ph)}" y1="${ty + 8}" x2="${px(ph)}" y2="${Y - 4}" stroke="${INK}" stroke-width="1.5"/>
  <circle cx="${px(ph)}" cy="${Y - 4}" r="3" fill="${INK}"/>
  <text x="${px(ph)}" y="${ty}" text-anchor="middle" font-size="17" fill="${INK}" ${FONT}>${namn}</text>
`;
  }
  // SURT / NEUTRALT / BASISKT
  const ordY = Y + HOJD + 62;
  ut += `  <text x="${px(3.5)}" y="${ordY}" text-anchor="middle" font-size="19" letter-spacing="2" fill="${INK}" ${FONT}>SURT</text>
  <text x="${px(7)}" y="${ordY}" text-anchor="middle" font-size="19" letter-spacing="2" fill="${INK}" ${FONT}>NEUTRALT</text>
  <text x="${px(10.5)}" y="${ordY}" text-anchor="middle" font-size="19" letter-spacing="2" fill="${INK}" ${FONT}>BASISKT</text>
`;
  fs.mkdirSync(UT2, { recursive: true });
  fs.writeFileSync(path.join(UT2, 'ph-skalan.svg'), svg(W, H,
    'pH-skalan från 0 till 14, färglagd från rött till blått, med magsyra, citronsaft, kaffe, rent vatten och tvållösning utsatta', ut));
}

// ---------- 8. De fyra kombinationerna (delkapitel Syror, avsnitt 4 B) ----------
// Färger enligt leveransen: ljusblått #a8c4d8, tegelröd #C64B3A, grått #8A8A8A, konturer/text #2d4a35.
{
  const UT2 = path.join(__dirname, '..', 'kapitel', 'syror-och-baser', 'delkapitel', 'syror', 'img');
  const VATSKA = '#a8c4d8', PROTON = '#C64B3A';
  const W = 640, H = 560, GB = 220, GH = 190;   // glasets bredd/höjd
  const KOL = [80, 340], RAD = [30, 300];
  // deterministisk spridning (LCG) så att bilden blir densamma vid varje bygge
  let seed = 7;
  const slump = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const glas = (x, y, roda, graa, etikett) => {
    const vTop = y + 55, vBot = y + GH - 3, vX = x + 3, vB = GB - 6;
    // vätskan följer glasets innerkontur (samma rundning som konturen, 3 px innanför)
    let ut = `  <g aria-label="${etikett}">
  <path d="M${vX} ${vTop}H${vX + vB}V${vBot - 9}Q${vX + vB} ${vBot} ${vX + vB - 9} ${vBot}H${vX + 9}Q${vX} ${vBot} ${vX} ${vBot - 9}Z" fill="${VATSKA}"/>
`;
    // partiklar i ett rutnät med jitter, roda först, sedan graa ovaler
    const celler = [];
    const NC = 5, NR = 4, cw = (vB - 30) / NC, ch = (vBot - vTop - 30) / NR;
    for (let r = 0; r < NR; r++) { for (let c = 0; c < NC; c++) { celler.push([vX + 15 + c * cw + cw / 2, vTop + 15 + r * ch + ch / 2]); } }
    for (let i = celler.length - 1; i > 0; i--) { const j = Math.floor(slump() * (i + 1)); [celler[i], celler[j]] = [celler[j], celler[i]]; }
    let k = 0;
    for (let i = 0; i < roda; i++, k++) {
      const [cx, cy] = celler[k]; const jx = r2(cx + (slump() - 0.5) * 10), jy = r2(cy + (slump() - 0.5) * 10);
      ut += `  <circle cx="${jx}" cy="${jy}" r="9" fill="${PROTON}" stroke="#fff" stroke-width="1"/>
  <path d="M${r2(jx - 4.5)} ${jy}H${r2(jx + 4.5)}M${jx} ${r2(jy - 4.5)}V${r2(jy + 4.5)}" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
`;
    }
    for (let i = 0; i < graa; i++, k++) {
      const [cx, cy] = celler[k]; const jx = r2(cx + (slump() - 0.5) * 6), jy = r2(cy + (slump() - 0.5) * 6);
      ut += `  <ellipse cx="${jx}" cy="${jy}" rx="12" ry="8" fill="${GRA}" transform="rotate(${r2((slump() - 0.5) * 40)} ${jx} ${jy})"/>
`;
    }
    // bägarglasets kontur: öppen upptill med liten pip, rundade nedre hörn
    ut += `  <path d="M${x - 10} ${y + 8} L${x} ${y + 14} V${y + GH - 12} Q${x} ${y + GH} ${x + 12} ${y + GH} H${x + GB - 12} Q${x + GB} ${y + GH} ${x + GB} ${y + GH - 12} V${y + 14}" fill="none" stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
  <text x="${x + GB / 2}" y="${y + GH + 34}" text-anchor="middle" font-size="19" font-style="italic" fill="${INK}" ${FONT}>${etikett}</text>
  </g>
`;
    return ut;
  };
  let ut = '';
  ut += glas(KOL[0], RAD[0], 14, 0, 'Stark och koncentrerad');
  ut += glas(KOL[1], RAD[0], 3, 0, 'Stark och utspädd');
  ut += glas(KOL[0], RAD[1], 3, 10, 'Svag och koncentrerad');
  ut += glas(KOL[1], RAD[1], 1, 3, 'Svag och utspädd');
  fs.writeFileSync(path.join(UT2, 'fyra-kombinationerna.svg'), svg(W, H,
    'Fyra bägarglas: stark och koncentrerad, stark och utspädd, svag och koncentrerad, svag och utspädd – röda vätejoner och gråa hela syrapartiklar', ut));
}


// ---------- 9. Ädelgasstruktur: neon mot natrium (repetition avsnitt 3 A) ----------
// Joachims spec 2026-09-13: neon 10p/10n, elektroner 2+8; natrium 11p/12n, elektroner 2+8+1; namn under.
{
  const W = 720, H = 400, CY = 178;
  const rK = 7, rE = 8;
  let ut = '';
  ut += A.modell({ cx: 190, cy: CY, p: 10, n: 10, rK, rE, skal: [{ R: 58, e: 2, start: -90 }, { R: 108, e: 8, start: -90 }] }, 'neonatom: fullt yttersta skal med åtta elektroner');
  ut += A.modell({ cx: 530, cy: CY, p: 11, n: 12, rK, rE, skal: [{ R: 58, e: 2, start: -90 }, { R: 108, e: 8, start: -90 }, { R: 158, e: 1, start: -90 }] }, 'natriumatom: en ensam elektron i yttersta skalet');
  ut += `  <text x="190" y="${CY + 190}" text-anchor="middle" font-size="24" fill="${INK}" ${FONT}>Neon</text>
  <text x="530" y="${CY + 190}" text-anchor="middle" font-size="24" fill="${INK}" ${FONT}>Natrium</text>
`;
  fs.writeFileSync(path.join(UT, 'adelgasstruktur.svg'), svg(W, H,
    'Neonatom med fullt yttersta skal bredvid natriumatom med en ensam elektron i yttersta skalet', ut));
}

// ---------- 10. Tre vägar till fullt skal: avge, ta upp, dela (repetition avsnitt 3 A) ----------
// Joachims spec 2026-09-13: tre rutor med lodräta skiljelinjer; vänster atom med ensam ytterelektron
// som lämnar (litium), mitten atom som saknar en elektron och tar upp en (fluor), höger två atomer
// som överlappar med delat elektronpar (två väteatomer). Ord under: avge, ta upp, dela.
{
  const P = 240, W = 3 * P, H = 300, CY = 128, rK = 5, rE = 6;
  const ELEK = A.F.elektron;
  let ut = '';
  for (let i = 1; i < 3; i++) { ut += `  <line x1="${i * P}" y1="16" x2="${i * P}" y2="${H - 16}" stroke="${INK}" stroke-width="1" opacity="0.5"/>\n`; }
  const elektron = (x, y) => `    <circle class="elektron" cx="${r2(x)}" cy="${r2(y)}" r="${rE}" fill="${ELEK}" stroke="#fff" stroke-width="1.5"/>
    <path d="M${r2(x - rE * 0.5)} ${r2(y)}H${r2(x + rE * 0.5)}" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
`;
  // 1 avge: litium, ytterelektronen rakt upp, pil från den och uppåt-höger ut ur skalet
  {
    const cx = P / 2, cy = CY;
    ut += A.modell({ cx, cy, p: 3, n: 4, rK, rE, skal: [{ R: 30, e: 2, start: -90 }, { R: 60, e: 1, start: -90 }] }, 'litiumatom som avger sin ensamma ytterelektron');
    ut += pil(cx + 7, cy - 60 - 7, cx + 62, cy - 60 - 42, ELEK, 2.5);
  }
  // 2 ta upp: fluor, sju ytterelektroner med luckan rakt upp, en elektron utanför med pil in i luckan
  {
    const cx = P + P / 2, cy = CY;
    ut += A.modell({ cx, cy, p: 9, n: 10, rK, rE, skal: [{ R: 30, e: 2, start: -90 }, { R: 60, e: 7, start: -90 + 360 / 14 }] }, 'fluoratom som tar upp en elektron i luckan i yttersta skalet');
    // luckan mellan sista och första elektronen centreras rakt upp (start = -90° + halva steget); elektronen kommer uppifrån
    ut += elektron(cx + 44, cy - 60 - 46);
    ut += pil(cx + 34, cy - 60 - 36, cx + 8, cy - 60 - 8, ELEK, 2.5);
  }
  // 3 dela: två väteatomer vars skal överlappar, ett elektronpar i överlappet
  {
    const cx = 2 * P + P / 2, cy = CY, R = 46, d = 34;
    ut += `  <g aria-label="två väteatomer som delar ett elektronpar">
    <circle class="bana" cx="${cx - d}" cy="${cy}" r="${R}" fill="none" stroke="${INK}" stroke-width="3"/>
    <circle class="bana" cx="${cx + d}" cy="${cy}" r="${R}" fill="none" stroke="${INK}" stroke-width="3"/>
` + A.karna(cx - d - 8, cy, 1, 0, 7) + A.karna(cx + d + 8, cy, 1, 0, 7) + elektron(cx, cy - 9) + elektron(cx, cy + 9) + `  </g>
`;
  }
  ['avge', 'ta upp', 'dela'].forEach((ord, i) => { ut += `  <text x="${i * P + P / 2}" y="${H - 34}" text-anchor="middle" font-size="24" fill="${INK}" ${FONT}>${ord}</text>\n`; });
  fs.writeFileSync(path.join(UT, 'tre-vagar.svg'), svg(W, H,
    'Tre vägar till fullt yttersta skal: avge en elektron, ta upp en elektron eller dela ett elektronpar', ut));
}


// ---------- 11. Vätebindningar: fem vattenmolekyler, mittmolekylen binder två åt varje håll ----------
// Joachims spec 2026-09-13 (ersätter AI-bilden vatebindning.webp, som hade tre väteatomer per molekyl):
// varje molekyl exakt en syreatom + två väteatomer i ~105°; från mittmolekylen fyra streckade linjer i INK –
// två från dess väteatomer till grannars syreatomer, två från dess syreatom till grannars väteatomer.
{
  const W = 400, H = 340, rO = 22, rH = 13, BIND = 44, AVST = 92;   // tät ram kring figuren; AVST = avstånd mellan bundna atomers mittpunkter
  const rad = g => g * Math.PI / 180, HALV = VINKEL / 2;
  // molekyl med H-bisektris i riktning `bis` (grader, 0 = höger, 90 = nedåt); returnerar H-positioner
  const molekyl = (cx, cy, bis, namn) => {
    const Hs = [bis - HALV, bis + HALV].map(g => [cx + BIND * Math.cos(rad(g)), cy + BIND * Math.sin(rad(g))]);
    let ut = `  <g class="molekyl" aria-label="${namn}">\n`;
    Hs.forEach(([x, y]) => { ut += `    <line x1="${cx}" y1="${cy}" x2="${r2(x)}" y2="${r2(y)}" stroke="${VARMGRA}" stroke-width="7" stroke-linecap="round"/>\n`; });
    ut += `    <circle class="syre" cx="${cx}" cy="${cy}" r="${rO}" fill="${SYRE}" stroke="${INK}" stroke-width="1.5"/>\n`;
    Hs.forEach(([x, y]) => { ut += `    <circle class="vate" cx="${r2(x)}" cy="${r2(y)}" r="${rH}" fill="${PAPPER}" stroke="${INK}" stroke-width="1.5"/>\n`; });
    ut += `  </g>\n`;
    return { ut, Hs };
  };
  const streck = (x1, y1, x2, y2, rFran, rTill) => {   // från kant till kant, streckad
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
    return `  <line class="vatebindning" x1="${r2(x1 + ux * rFran)}" y1="${r2(y1 + uy * rFran)}" x2="${r2(x2 - ux * rTill)}" y2="${r2(y2 - uy * rTill)}" stroke="${INK}" stroke-width="2.5" stroke-dasharray="7 6" stroke-linecap="round"/>\n`;
  };
  const cx = W / 2, cy = H / 2;
  let ut = '', linjer = '';
  const mitt = molekyl(cx, cy, 90, 'vattenmolekyl i mitten');   // H nedåt: -52.5° och +52.5° kring lodlinjen
  // två grannar nedanför: syreatomen i förlängningen av var sin O–H-riktning från mittmolekylen
  [90 - HALV, 90 + HALV].forEach((g, i) => {
    const [hx, hy] = mitt.Hs[i];
    const ox = hx + AVST * Math.cos(rad(g)), oy = hy + AVST * Math.sin(rad(g));
    const m = molekyl(r2(ox), r2(oy), g, `vattenmolekyl ${i === 0 ? 'nere till vänster' : 'nere till höger'}`);   // H bort från mitten
    ut += m.ut;
    linjer += streck(hx, hy, ox, oy, rH, rO);
  });
  // två grannar ovanför: en av deras väteatomer pekar mot mittmolekylens syreatom (fria elektronparens riktningar)
  [-90 - HALV, -90 + HALV].forEach((g, i) => {
    const hx = cx + AVST * Math.cos(rad(g)), hy = cy + AVST * Math.sin(rad(g));   // grannens H
    const mot = g + 180;                                                          // riktning från H mot dess O
    const ox = hx + BIND * Math.cos(rad(g)), oy = hy + BIND * Math.sin(rad(g));   // grannens O längre ut
    // H1 ska ligga i riktning `mot` från O; bisektrisen = mot ± HALV så att H2 vrids utåt/uppåt
    const bis = i === 0 ? mot - HALV : mot + HALV;
    const m = molekyl(r2(ox), r2(oy), bis, `vattenmolekyl ${i === 0 ? 'uppe till vänster' : 'uppe till höger'}`);
    ut += m.ut;
    linjer += streck(cx, cy, hx, hy, rO, rH);
  });
  ut = linjer + ut + mitt.ut;   // streck under, mittmolekylen överst
  fs.writeFileSync(path.join(UT, 'vatebindning.svg'), svg(W, H,
    'Fem vattenmolekyler. Från molekylen i mitten går fyra streckade vätebindningar: två från dess väteatomer till grannars syreatomer och två från dess syreatom till grannars väteatomer', ut));
}


// ---------- 12. Två vägar till en basisk lösning (delkapitel Baser, avsnitt 1 B) ----------
// Joachims spec 2026-09-13: vänster natriumhydroxid – jongitter (röda + / blå −) och två lossnade joner
// Na⁺, OH⁻; höger ammoniak – NH3 + H2O, en vätejon flyttar, resultat NH4⁺ (hakparentes, +) och OH⁻.
// Färger ur bokens palett: positiv jon #C64B3A, negativ jon/kväve #3D6BA8 (bokens blå – FÖRSLAG för N,
// CPK-blått #3050F8 är inte dämpat), syre #C0392B, väte #f5f0e4, konturer/text #2d4a35. Transparent.
{
  const UT3 = path.join(__dirname, '..', 'kapitel', 'syror-och-baser', 'delkapitel', 'baser', 'img');
  fs.mkdirSync(UT3, { recursive: true });
  const W = 800, H = 360, MITT = 400, PLUS = '#C64B3A', MINUS = '#3D6BA8', KVAVE = '#3D6BA8';
  const rJ = 15, rN = 22, rO = 22, rH = 13, BIND = 42;
  const jon = (x, y, tecken) => `  <circle cx="${r2(x)}" cy="${r2(y)}" r="${rJ}" fill="${tecken === '+' ? PLUS : MINUS}" stroke="#fff" stroke-width="1.5"/>
  <path d="${tecken === '+' ? `M${r2(x - 6)} ${r2(y)}H${r2(x + 6)}M${r2(x)} ${r2(y - 6)}V${r2(y + 6)}` : `M${r2(x - 6)} ${r2(y)}H${r2(x + 6)}`}" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>
`;
  const etikett = (x, y, bas, tecken, sub) => `  <text x="${r2(x)}" y="${r2(y)}" text-anchor="middle" font-size="20" fill="${INK}" ${FONT}>${bas}${sub ? `<tspan font-size="13" dy="6">${sub}</tspan><tspan dy="-6"></tspan>` : ''}<tspan font-size="13" dy="-9">${tecken}</tspan></text>
`;
  const bildtext = (x, t) => `  <text x="${x}" y="${H - 22}" text-anchor="middle" font-size="19" font-style="italic" fill="${INK}" ${FONT}>${t}</text>
`;
  // en molekyl: centralatom + väteatomer i givna vinklar (grader, 0 = höger, 90 = nedåt)
  const molekyl = (cx, cy, farg, rC, vinklar, namn) => {
    let ut = `  <g aria-label="${namn}">\n`;
    const Hs = vinklar.map(g => [cx + BIND * Math.cos(g * Math.PI / 180), cy + BIND * Math.sin(g * Math.PI / 180)]);
    Hs.forEach(([x, y]) => { ut += `    <line x1="${cx}" y1="${cy}" x2="${r2(x)}" y2="${r2(y)}" stroke="${VARMGRA}" stroke-width="7" stroke-linecap="round"/>\n`; });
    ut += `    <circle cx="${cx}" cy="${cy}" r="${rC}" fill="${farg}" stroke="${INK}" stroke-width="1.5"/>\n`;
    Hs.forEach(([x, y]) => { ut += `    <circle class="vate" cx="${r2(x)}" cy="${r2(y)}" r="${rH}" fill="${PAPPER}" stroke="${INK}" stroke-width="1.5"/>\n`; });
    ut += `  </g>\n`;
    return { ut, Hs };
  };
  let ut = `  <line x1="${MITT}" y1="18" x2="${MITT}" y2="${H - 18}" stroke="${INK}" stroke-width="2"/>\n`;
  // --- vänster: jongitter 3×3 uppe till vänster ---
  const G0x = 60, G0y = 60, steg = 36;
  for (let r = 0; r < 3; r++) { for (let c = 0; c < 3; c++) { ut += jon(G0x + c * steg, G0y + r * steg, (r + c) % 2 === 0 ? '+' : '−'); } }
  ut += pil(G0x + 2 * steg + rJ + 14, G0y + steg, 262, G0y + steg, INK, 2.5);
  // lossnade joner med etiketter
  ut += jon(300, G0y + steg - 22, '+') + etikett(300, G0y + steg + 26, 'Na', '+', '');
  ut += jon(352, G0y + steg + 30, '−') + etikett(352, G0y + steg + 78, 'OH', '−', '');
  ut += `  <text x="${G0x + steg}" y="${G0y + 3 * steg + 8}" text-anchor="middle" font-size="15" fill="${INK}" ${FONT}>natriumhydroxid, fast</text>\n`;
  ut += bildtext(MITT / 2, 'Hydroxidjonerna fanns redan');
  // --- höger: NH3 + H2O → NH4+ + OH- ---
  const y0 = 150;
  const nh3 = molekyl(455, y0, KVAVE, rN, [200, 90, 340], 'ammoniakmolekyl');           // tre H, lucka uppåt
  const h2o = molekyl(566, y0 - 34, SYRE, rO, [95, 200], 'vattenmolekyl');   // H-vinkel 105°: en H nedåt, en mot ammoniaken
  ut += nh3.ut + h2o.ut;
  // vätejonen som flyttar: från vattnets vänstra H mot kväveatomens lucka (uppåt)
  const [hx, hy] = h2o.Hs[1];   // vätet som pekar mot ammoniaken → luckan ovanför kväveatomen
  ut += pil(hx - rH - 2, hy - 4, 455 + 6, y0 - rN - 10, PLUS, 2.5);
  ut += `  <text x="${r2((hx + 455) / 2 - 4)}" y="${r2(hy - 30)}" text-anchor="middle" font-size="14" fill="${PLUS}" ${FONT}>H<tspan font-size="10" dy="-6">+</tspan></text>\n`;
  ut += pil(612, y0 + 10, 656, y0 + 10, INK, 3);
  // resultat: ammoniumjon med fyra H och hakparentes, hydroxidjon
  const nh4 = molekyl(715, y0 + 8, KVAVE, rN, [225, 315, 45, 135], 'ammoniumjon');
  ut += nh4.ut;
  const bx1 = 715 - 64, bx2 = 715 + 64, by1 = y0 + 8 - 60, by2 = y0 + 8 + 60;
  ut += `  <path d="M${bx1 + 10} ${by1}H${bx1}V${by2}H${bx1 + 10}" fill="none" stroke="${INK}" stroke-width="2.5"/>
  <path d="M${bx2 - 10} ${by1}H${bx2}V${by2}H${bx2 - 10}" fill="none" stroke="${INK}" stroke-width="2.5"/>
  <text x="${bx2 + 5}" y="${by1 + 4}" font-size="20" fill="${INK}" ${FONT}>+</text>\n`;
  const oh = molekyl(650, y0 + 92, SYRE, rO - 4, [0], 'hydroxidjon');
  ut += oh.ut + etikett(650, y0 + 92 + 46, 'OH', '−', '');
  ut += `  <text x="455" y="${y0 + 70}" text-anchor="middle" font-size="15" fill="${INK}" ${FONT}>ammoniak</text>
  <text x="596" y="${y0 - 34 - 34}" text-anchor="middle" font-size="15" fill="${INK}" ${FONT}>vatten</text>\n`;
  ut += bildtext(MITT + MITT / 2, 'Hydroxidjonen bildades');
  fs.writeFileSync(path.join(UT3, 'tva-vagar-till-bas.svg'), svg(W, H,
    'Två vägar till en basisk lösning: natriumhydroxid frigör natriumjoner och hydroxidjoner ur ett jongitter; ammoniak tar upp en vätejon från vatten och bildar ammoniumjon och hydroxidjon', ut));
}


// ---------- 13–14. Neutralisation (delkapitel Neutralisation, avsnitt 1 A och B) ----------
// Joachims spec 2026-09-13. Gemensamma delar: bägarglas som kontur i INK, vätska #a8c4d8, positiv jon #C64B3A
// med +, negativ jon #3D6BA8 med −, vattenmolekyl = syre #C0392B med två väte #f5f0e4.
// vad-blir-kvar: åskådarjoner Na⁺ #9b7cc4 och Cl⁻ #6a9e4f (Joachim 2026-09-13: dämpade CPK-färger; patina är
// bokens signaturfärg och ska inte betyda ett ämne). Etiketterna som teckenförklaring under glasen.
{
  const UT4 = path.join(__dirname, '..', 'kapitel', 'syror-och-baser', 'delkapitel', 'neutralisation', 'img');
  fs.mkdirSync(UT4, { recursive: true });
  const VATSKA = '#a8c4d8', PLUS = '#C64B3A', MINUS = '#3D6BA8', NA = '#9b7cc4', CL = '#6a9e4f';
  const GB = 190, GH = 170;
  let seed = 11;
  const slump = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  // bägarglas med vätska; returnerar cellpositioner (rutnät med jitter) för partiklar
  const glas = (x, y, namn, NR = 3) => {
    const vTop = y + 50, vBot = y + GH - 3, vX = x + 3, vB = GB - 6;
    let ut = `  <g aria-label="${namn}">
  <path d="M${vX} ${vTop}H${vX + vB}V${vBot - 9}Q${vX + vB} ${vBot} ${vX + vB - 9} ${vBot}H${vX + 9}Q${vX} ${vBot} ${vX} ${vBot - 9}Z" fill="${VATSKA}"/>
  <path d="M${x - 9} ${y + 8} L${x} ${y + 14} V${y + GH - 12} Q${x} ${y + GH} ${x + 12} ${y + GH} H${x + GB - 12} Q${x + GB} ${y + GH} ${x + GB} ${y + GH - 12} V${y + 14}" fill="none" stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
  </g>
`;
    const celler = [];
    const NC = 4, cw = (vB - 24) / NC, ch = (vBot - vTop - 24) / NR;
    for (let r = 0; r < NR; r++) { for (let c = 0; c < NC; c++) { celler.push([vX + 12 + c * cw + cw / 2, vTop + 12 + r * ch + ch / 2]); } }
    for (let i = celler.length - 1; i > 0; i--) { const j = Math.floor(slump() * (i + 1)); [celler[i], celler[j]] = [celler[j], celler[i]]; }
    return { ut, celler: celler.map(([cx, cy]) => [r2(cx + (slump() - 0.5) * 4), r2(cy + (slump() - 0.5) * 4)]) };
  };
  const jon = (x, y, farg, tecken) => `  <circle cx="${x}" cy="${y}" r="10" fill="${farg}" stroke="#fff" stroke-width="1"/>
` + (tecken === '+' ? `  <path d="M${r2(x - 5)} ${y}H${r2(x + 5)}M${x} ${r2(y - 5)}V${r2(y + 5)}" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
` : tecken === '−' ? `  <path d="M${r2(x - 5)} ${y}H${r2(x + 5)}" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
` : '');
  const vatten = (x, y) => {   // liten vattenmolekyl: syre med två väten i 105°
    const a = 52.5 * Math.PI / 180, d = 11;
    const H = [[x - d * Math.sin(a), y + d * Math.cos(a)], [x + d * Math.sin(a), y + d * Math.cos(a)]];
    return `  <circle cx="${x}" cy="${y}" r="7" fill="${SYRE}" stroke="${INK}" stroke-width="1"/>
` + H.map(([hx, hy]) => `  <circle cx="${r2(hx)}" cy="${r2(hy)}" r="5" fill="${PAPPER}" stroke="${INK}" stroke-width="1"/>
`).join('');
  };
  const etikett = (x, y, t) => `  <text x="${x}" y="${y}" text-anchor="middle" font-size="18" font-style="italic" fill="${INK}" ${FONT}>${t}</text>
`;
  // ----- 13. neutralisation-partiklar.svg: sur + basisk → neutral -----
  {
    const W = 760, H = 250, Y = 20;
    const X = [40, 300, 560];
    let ut = '';
    const g1 = glas(X[0], Y, 'sur lösning med sex positiva joner'); ut += g1.ut; g1.celler.slice(0, 6).forEach(([x, y]) => { ut += jon(x, y, PLUS, '+'); });
    ut += `  <text x="${X[0] + GB + 30}" y="${Y + GH / 2 + 12}" text-anchor="middle" font-size="40" fill="${INK}" ${FONT}>+</text>\n`;
    const g2 = glas(X[1], Y, 'basisk lösning med sex negativa joner'); ut += g2.ut; g2.celler.slice(0, 6).forEach(([x, y]) => { ut += jon(x, y, MINUS, '−'); });
    ut += pil(X[1] + GB + 14, Y + GH / 2, X[2] - 14, Y + GH / 2, INK, 3);
    const g3 = glas(X[2], Y, 'neutral lösning med sex vattenmolekyler'); ut += g3.ut; g3.celler.slice(0, 6).forEach(([x, y]) => { ut += vatten(x, y - 4); });
    ut += etikett(X[0] + GB / 2, Y + GH + 34, 'Sur lösning') + etikett(X[1] + GB / 2, Y + GH + 34, 'Basisk lösning') + etikett(X[2] + GB / 2, Y + GH + 34, 'Neutral lösning');
    fs.writeFileSync(path.join(UT4, 'neutralisation-partiklar.svg'), svg(W, H,
      'Tre bägarglas: sur lösning med sex positiva joner plus basisk lösning med sex negativa joner ger neutral lösning med sex vattenmolekyler', ut));
  }
  // ----- 14. vad-blir-kvar.svg: före/efter, åskådarjoner kvar -----
  {
    const W = 600, H = 300, Y = 20;
    const X = [50, 360];
    let ut = '';
    const f = glas(X[0], Y, 'före neutralisationen: oxoniumjoner, hydroxidjoner, natriumjoner och kloridjoner', 4); ut += f.ut;   // 4×4 celler = fyra av varje sort
    const sorter = [[PLUS, '+'], [MINUS, '−'], [NA, ''], [CL, '']];
    f.celler.slice(0, 16).forEach(([x, y], i) => { const [farg, t] = sorter[i % 4]; ut += jon(x, y, farg, t); });
    ut += pil(X[0] + GB + 16, Y + GH / 2, X[1] - 16, Y + GH / 2, INK, 3);
    const e = glas(X[1], Y, 'efter neutralisationen: vattenmolekyler, natriumjoner och kloridjoner', 4); ut += e.ut;
    // samma celler som före (samma slumpföljd ger olika – använd f-cellerna förskjutna i x) så att åskådarjonerna sitter kvar på sina platser
    f.celler.slice(0, 16).forEach(([x, y], i) => { const dx = X[1] - X[0]; if (i % 4 === 2) { ut += jon(r2(x + dx), y, NA, ''); } else if (i % 4 === 3) { ut += jon(r2(x + dx), y, CL, ''); } });
    // fyra vattenmolekyler där oxonium- och hydroxidjonerna var (par ihop: 8 joner → 4 molekyler, placerade på oxoniumjonernas platser)
    f.celler.slice(0, 16).forEach(([x, y], i) => { if (i % 4 === 0) { ut += vatten(r2(x + X[1] - X[0]), y - 4); } });
    ut += etikett(X[0] + GB / 2, Y + GH + 30, 'Före') + etikett(X[1] + GB / 2, Y + GH + 30, 'Efter');
    // teckenförklaring
    const ly = Y + GH + 68;
    const namn = [`H<tspan font-size="11" dy="5">3</tspan><tspan dy="-5">O</tspan><tspan font-size="11" dy="-7">+</tspan>`, `OH<tspan font-size="11" dy="-7">−</tspan>`, `Na<tspan font-size="11" dy="-7">+</tspan>`, `Cl<tspan font-size="11" dy="-7">−</tspan>`];
    [[PLUS, '+'], [MINUS, '−'], [NA, ''], [CL, '']].forEach(([farg, t], i) => {
      const lx = 70 + i * 135;
      ut += jon(lx, ly, farg, t) + `  <text x="${lx + 18}" y="${ly + 6}" font-size="17" fill="${INK}" ${FONT}>${namn[i]}</text>\n`;
    });
    fs.writeFileSync(path.join(UT4, 'vad-blir-kvar.svg'), svg(W, H,
      'Två bägarglas före och efter neutralisation: oxonium- och hydroxidjonerna har blivit vattenmolekyler, natrium- och kloridjonerna finns kvar', ut));
  }
}

console.log('skrev 14 svg (8 repetition, 3 syror, 1 baser, 2 neutralisation)', path.relative(path.join(__dirname, '..'), UT));
