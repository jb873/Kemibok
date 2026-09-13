// bilder-svg.js – genererar de fyra text-/notationsbilder som inte går som AI-bild
// (Joachims spec 2026-09-13). Skriver till kapitel/syror-och-baser/delkapitel/repetition/img/.
// Kör: node verktyg/bilder-svg.js
//
//   periodiska-systemet-forenklat.svg   avsnitt 2 A – period 1–3, grupp 1/2/17/18 färgade
//   molekylmodeller-vatten.svg          avsnitt 3 C – fem sätt att rita H2O
//   jonbindning-natrium-klor.svg        avsnitt 3 B – Na + Cl → Na+ + Cl- (staplad layout)
//   polar-vattenmolekyl.svg             avsnitt 4 A – kulpinnmodell med δ− / δ+ och pilar
//   elektronpar-vate.svg                avsnitt 3 C – två fria väteatomer / H2 med delat elektronpar (ingen text)
//   vatejon-och-oxoniumjon.svg          delkapitel Syror – H2O + H+ → H3O+ i tre lager (skrivs till delkapitel/syror/img/)
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
console.log('skrev 6 svg (5 till repetition/img, 1 till syror/img)', path.relative(path.join(__dirname, '..'), UT));
