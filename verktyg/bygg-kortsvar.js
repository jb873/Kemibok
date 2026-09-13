// bygg-kortsvar.js – kortsvarsfiler för avsnitt 1–5 ur doc/leveranser/repetition/kortsvar.md.
// Kör: node verktyg/bygg-kortsvar.js   → kapitel/syror-och-baser/data/kortsvar/avsnitt-N-{slug}.json
// Schema: KEMI-TILLAGG §8. Leveransens format (se filens huvud):
//   # AVSNITT N — Titel / antal_per_omgang: 10 / valfri "> UTKAST …"-rad
//   ## id · typ  →  F: fråga  A: alt | alt  S: svar  E: förklaring  O: {json med valfria fält}
// Formler skrivs i Unicode i leveransen (H₂O, Li⁺) och blir \(\ce{…}\) i fråga, alternativ och förklaring;
// svar för typen formel skrivs som \ce-inmatning (Li+, SO4^2-) och behålls som de är.
// Flerval: svar är index i alternativlistan; kortsvar.js blandar alternativen.
'use strict';
const fs = require('fs'), path = require('path');
const G = require('../js/kortsvar-gradering.js');
const { formler } = require('./lib-notation.js');
const ROT = path.join(__dirname, '..');
const SLUG = { 1: 'atomer-molekyler-joner', 2: 'periodiska-systemet', 3: 'kemiska-bindningar', 4: 'vattnets-egenskaper', 5: 'losningar' };

const md = fs.readFileSync(path.join(ROT, 'doc', 'leveranser', 'repetition', 'kortsvar.md'), 'utf8').replace(/\r\n/g, '\n');

function tolkaFraga(id, typ, rader) {
  const falt = {};
  for (const r of rader) {
    const m = r.match(/^([FASEO]): (.*)$/);
    if (!m) { throw new Error(`${id}: oväntad rad "${r}"`); }
    if (falt[m[1]]) { throw new Error(`${id}: ${m[1]}: förekommer två gånger`); }
    falt[m[1]] = m[2].trim();
  }
  if (!falt.F || !falt.S || !falt.E) { throw new Error(`${id}: F:, S: och E: krävs`); }
  const f = { id, typ, fraga: formler(falt.F) };
  if (falt.A) { f.alternativ = falt.A.split(' | ').map(x => formler(x.trim())); }
  const S = falt.S;
  switch (typ) {
    case 'tal': f.svar = Number(S); break;
    case 'flerval': f.svar = Number(S); break;
    case 'tal-par': f.svar = S.split(',').map(x => Number(x.trim())); break;
    case 'markera': f.svar = S.split(',').map(x => Number(x.trim())); break;
    case 'ord': f.svar = S.split(' | ').map(x => x.trim()); break;
    case 'formel': f.svar = S.split(' | ').map(x => x.trim()); break;
    default: throw new Error(`${id}: okänd typ "${typ}"`);
  }
  if (typeof f.svar === 'number' && Number.isNaN(f.svar) || Array.isArray(f.svar) && f.svar.some(x => Number.isNaN(x))) { throw new Error(`${id}: svar "${S}" är inte ett tal`); }
  f.forklaring = formler(falt.E);
  if (falt.O) { Object.assign(f, JSON.parse(falt.O)); }
  return f;
}

for (const a of md.matchAll(/\n# AVSNITT (\d) — ([^\n]+)\n([\s\S]*?)(?=\n# AVSNITT |$)/g)) {
  const N = +a[1], titel = a[2].trim(), inneh = a[3];
  const perOmgang = +(inneh.match(/^antal_per_omgang: (\d+)$/m) || [])[1];
  if (!perOmgang) { throw new Error(`avsnitt ${N}: antal_per_omgang saknas`); }
  const utkast = (inneh.match(/^> (UTKAST[^\n]*)$/m) || [])[1] || null;
  const fragor = [];
  for (const q of inneh.matchAll(/\n## (k\d-s\d+) · ([a-z-]+)\n([\s\S]*?)(?=\n## |\n---|$)/g)) {
    fragor.push(tolkaFraga(q[1], q[2], q[3].trim().split('\n')));
  }
  if (fragor.length !== 12) { throw new Error(`avsnitt ${N}: ${fragor.length} frågor, väntade 12`); }
  fragor.forEach((f, i) => { if (f.id !== `k${N}-s${i + 1}`) { throw new Error(`avsnitt ${N}: id ${f.id} på plats ${i + 1}`); } });
  const data = { avsnitt: N, titel, delkapitel: 'repetition', version: utkast ? '0.1-utkast' : '1.0',
    _kommentar: utkast
      ? `${utkast.replace(/ – .*$/, '')} (Code 2026-09-13) härlett ur flipcardsens modell- och begreppskort, för att se komponenten i drift. Ersätts av leverans från innehållschatten efter Joachims granskning. forklaring är obligatorisk på varje fråga. Regel: frågan får inte innehålla svaret (KEMI-TILLAGG §8). Byggd ur doc/leveranser/repetition/kortsvar.md.`
      : `Kortsvar för avsnitt ${N} (${titel}), leverans 2026-09-13. ${fragor.length} frågor, ${perOmgang} per omgång. Regel: frågan får inte innehålla svaret (KEMI-TILLAGG §8). Byggd ur doc/leveranser/repetition/kortsvar.md.`,
    antal_per_omgang: perOmgang, fragor };
  const fel = G.validera(data);
  if (fel.length) { throw new Error(`avsnitt ${N}: ${fel.join('; ')}`); }
  // facit-självtest: rätt svar ska ge ratt
  const RATT = { tal: f => String(f.svar), flerval: f => String(f.svar), ord: f => f.svar[0], formel: f => f.svar[0],
    'tal-par': f => f.svar.map(String), markera: f => f.svar };
  fragor.forEach(f => { if (G.gradera(f, RATT[f.typ](f)).status !== 'ratt') { throw new Error(`avsnitt ${N} ${f.id}: facit rättas inte som rätt`); } });
  // §8: facit i frågetexten?
  fragor.forEach(f => {
    if (f.typ === 'flerval' || f.typ === 'markera') { return; }
    const facit = (Array.isArray(f.svar) ? f.svar : [f.svar]).map(String);
    const traff = facit.filter(s => new RegExp('(^|[^a-zåäö0-9])' + s.replace(/[+\-^]/g, '\\$&') + '([^a-zåäö0-9]|$)', 'i').test(f.fraga));
    if (traff.length) { console.log(`  ⚠ ${f.id} (${f.typ}): facit "${traff[0]}" förekommer i frågetexten – "${f.fraga}"`); }
  });
  const ut = path.join(ROT, 'kapitel', 'syror-och-baser', 'data', 'kortsvar', `avsnitt-${N}-${SLUG[N]}.json`);
  fs.writeFileSync(ut, JSON.stringify(data, null, 2) + '\n');
  const typer = fragor.reduce((a, f) => (a[f.typ] = (a[f.typ] || 0) + 1, a), {});
  console.log(`avsnitt ${N}: ${fragor.length} frågor`, JSON.stringify(typer), `| formler i förklaringar: ${fragor.filter(f => /\\ce\{/.test(f.forklaring)).length}${utkast ? ' | UTKAST' : ''}`);
}
