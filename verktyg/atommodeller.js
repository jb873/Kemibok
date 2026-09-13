// atommodeller.js – genererar img/repetition/atommodell-kol.svg och atom-och-jon.svg
// Bohr-modeller som SVG (AI-bildgeneratorn klarar inte entydig elektronplacering).
// Kör: node verktyg/atommodeller.js   Färger och regler enligt Joachims spec 2026-09-12:
// proton #C64B3A med vitt +, neutron #8A8A8A, elektron #3D6BA8 med vitt −,
// banor #2d4a35 3px utan fyllning, transparent bakgrund, elektroner med lika vinkelsteg.
// Verifiering: verktyg/skarmbilder/atommodeller-900px.png (Chromium, 900 px bredd).
//
// STATUS 2026-09-13: de genererade SVG-filerna togs bort ur repot (commit 79841c2) –
// avsnittens atommodeller är AI-genererade webp i delkapitel/repetition/img/. Ingen sida
// använder generatorns utdata just nu. Behålls för framtida atommodeller där
// elektronplacering måste vara entydig; skriver till img/repetition/ vid körning.
'use strict';
const fs = require('fs'), path = require('path');
const UT = path.join(__dirname, '..', 'img', 'repetition');   // körs från valfri cwd
const F = { proton: '#C64B3A', neutron: '#8A8A8A', elektron: '#3D6BA8', bana: '#2d4a35' };
const r2 = n => Math.round(n * 100) / 100;

// Hexagonal tätpackning: de N gitterpunkter som ligger närmast mitten – ger en
// kompakt klump utan spikar. Partiklarna ritas med lätt överlapp (gitteravstånd 1.8·r – hålen i packningen stängs, tecknen förblir fria).
function packning(antal, r) {
  const d = 1.8 * r, pts = [];
  for (let i = -5; i <= 5; i++) for (let j = -5; j <= 5; j++) {
    const x = d * (i + j / 2), y = d * j * Math.sqrt(3) / 2;
    pts.push({ x, y, dist: Math.hypot(x, y), v: Math.atan2(y, x) });
  }
  pts.sort((a, b) => (a.dist - b.dist) || (a.v - b.v));
  return pts.slice(0, antal);
}

function karna(cx, cy, protoner, neutroner, r) {
  // typ tilldelas i närhetsordning (blandad klump), men ritas UTIFRÅN OCH IN så att
  // inre partiklar ligger överst och inget tecken täcks av en granne
  const pos = packning(protoner + neutroner, r);
  let p = protoner, n = neutroner, ut = '';
  const typer = pos.map((q, i) => { let typ; if (p && n) { typ = (i % 2 === 0) ? 'p' : 'n'; } else { typ = p ? 'p' : 'n'; } if (typ === 'p') { p--; } else { n--; } return typ; });
  pos.map((q, i) => ({ q, typ: typer[i] })).reverse().forEach(({ q, typ }) => {
    const x = r2(cx + q.x), y = r2(cy + q.y);
    ut += `    <circle class="${typ === 'p' ? 'proton' : 'neutron'}" cx="${x}" cy="${y}" r="${r}" fill="${typ === 'p' ? F.proton : F.neutron}" stroke="#fff" stroke-width="1.5"/>\n`;
    if (typ === 'p') {
      const a = r * 0.5;
      ut += `    <path d="M${r2(x - a)} ${y}H${r2(x + a)}M${x} ${r2(y - a)}V${r2(y + a)}" stroke="#fff" stroke-width="2" stroke-linecap="round"/>\n`;
    }
  });
  return ut;
}

function elektroner(cx, cy, R, antal, r, startGrader) {
  let ut = '';
  for (let i = 0; i < antal; i++) {
    const v = ((startGrader + (360 / antal) * i) * Math.PI) / 180;
    const x = r2(cx + R * Math.cos(v)), y = r2(cy + R * Math.sin(v)), a = r * 0.5;
    ut += `    <circle class="elektron" data-bana="${R}" cx="${x}" cy="${y}" r="${r}" fill="${F.elektron}" stroke="#fff" stroke-width="1.5"/>\n`;
    ut += `    <path d="M${r2(x - a)} ${y}H${r2(x + a)}" stroke="#fff" stroke-width="2" stroke-linecap="round"/>\n`;
  }
  return ut;
}

function banor(cx, cy, radier) {
  return radier.map(R => `    <circle class="bana" cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${F.bana}" stroke-width="3"/>\n`).join('');
}

// Modell: {cx, cy, p, n, rK (kärnpartikelradie), skal: [{R, e, start}], rE}
function modell(m, titel) {
  return `  <g aria-label="${titel}">\n` + banor(m.cx, m.cy, m.skal.map(s => s.R)) +
    karna(m.cx, m.cy, m.p, m.n, m.rK) +
    m.skal.map(s => elektroner(m.cx, m.cy, s.R, s.e, m.rE, s.start)).join('') + `  </g>\n`;
}

module.exports = { packning, karna, elektroner, banor, modell, F, r2 };

if (require.main === module) {
// ---------- Kol ----------
{
  const W = 260, c = 130;
  const kol = { cx: c, cy: c, p: 6, n: 6, rK: 9, rE: 8, skal: [{ R: 62, e: 2, start: -90 }, { R: 112, e: 4, start: -45 }] };
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${W}" width="${W}" height="${W}" role="img" aria-labelledby="t">
  <title id="t">Kolatom: kärna med 6 protoner och 6 neutroner, 2 elektroner på inre banan och 4 på yttre</title>
${modell(kol, 'Kolatom')}</svg>
`;
  fs.mkdirSync(UT, { recursive: true });
  fs.writeFileSync(path.join(UT, 'atommodell-kol.svg'), svg);
}

// ---------- Natriumatom och natriumjon ----------
{
  const H = 350, halv = 350, c = 175;
  const skalNa = [{ R: 80, e: 2, start: -90 }, { R: 122, e: 8, start: -67.5 }, { R: 162, e: 1, start: -90 }];
  const skalJon = [{ R: 80, e: 2, start: -90 }, { R: 122, e: 8, start: -67.5 }, { R: 162, e: 0, start: -90 }];
  const bas = { p: 11, n: 12, rK: 9.5, rE: 8 };
  const na = Object.assign({ cx: c, cy: c, skal: skalNa }, bas);
  const jon = Object.assign({ cx: halv + c, cy: c, skal: skalJon }, bas);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${2 * halv} ${H}" width="${2 * halv}" height="${H}" role="img" aria-labelledby="t">
  <title id="t">Natriumatom (vänster) och natriumjon (höger): samma kärna med 11 protoner och 12 neutroner; atomen har 2, 8 och 1 elektroner på tre banor, jonen har 2 och 8 och en tom yttersta bana</title>
  <line class="delare" x1="${halv}" y1="12" x2="${halv}" y2="${H - 12}" stroke="${F.bana}" stroke-width="3"/>
${modell(na, 'Natriumatom')}${modell(jon, 'Natriumjon')}</svg>
`;
  fs.writeFileSync(path.join(UT, 'atom-och-jon.svg'), svg);
}
console.log('skrivet');
}
