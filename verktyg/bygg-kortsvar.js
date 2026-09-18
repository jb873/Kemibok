// bygg-kortsvar.js – kortsvarsfiler för ett delkapitel ur doc/leveranser/{delkapitel}/kortsvar.md.
// Kör: node verktyg/bygg-kortsvar.js [delkapitel]   (utelämnat = repetition)
//      → kapitel/syror-och-baser/data/kortsvar/avsnitt-N-{slug}.json
// Schema: KEMI-TILLAGG §8. Två leveransformer per "# AVSNITT N — Titel":
//   blockform (repetition): antal_per_omgang: 10 / valfri "> UTKAST …" / ## id · typ  →  F: A: S: E: O:
//     (A: alt | alt; S: ord/formel-alternativ med |, markera/tal-par med komma; O: {json med tolerans, enhet, oordnad, skiftlage})
//   tabellform (syror): | # | Typ | Fråga | Svar |  +  ### Förklaringar (numrerade, får radbrytas)
//     +  **Flerval N:** alt · alt · alt (får radbrytas; första alternativet = rätt och ska vara tabellens svar);
//     +  **Tolerans N:** x  → tolerans: {abs: x} (tal);
//     ord-alternativ i tabellen med komma ("stark, stark syra").
// Formler skrivs i Unicode i leveransen (H₂O, Li⁺, 10⁻¹⁴, ⇌) och blir MathJax i fråga, alternativ och förklaring;
// `\ce{…}` i backticks i förklaringar → \(\ce{…}\); svar för typen formel skrivs som \ce-inmatning (Li+, SO4^2-).
// Flerval: svar är index i alternativlistan; kortsvar.js blandar alternativen.
'use strict';
const fs = require('fs'), path = require('path');
const G = require('../js/kortsvar-gradering.js');
const { formler } = require('./lib-notation.js');
const { DELKAPITEL } = require('./bygg-avsnitt-konfig.js');
const { fyllHuvud } = require('./lib-leveranshuvud.js');
const ROT = path.join(__dirname, '..');
const DKID = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'repetition';
if (!DELKAPITEL[DKID]) { console.error('okänt delkapitel ' + DKID); process.exit(2); }
const KAP = (DELKAPITEL[DKID].kapitel || { id: 'syror-och-baser' }).id;   // kapitel ur konfigurationen
const LEV = path.join(ROT, 'doc', 'leveranser', DKID, DELKAPITEL[DKID].byggmapp || '');   // ev. undermapp med sammansatta byggfiler
const md = fs.readFileSync(path.join(LEV, 'kortsvar.md'), 'utf8').replace(/\r\n/g, '\n');

const ce = s => s.replace(/`\\ce\{([^}]*)\}`/g, (_, x) => '\\(\\ce{' + x + '}\\)');
const text = s => formler(ce(s.replace(/\s*\n\s*/g, ' ').trim())).replace(/\*\*([^*]+)\*\*/g, '$1');   // kortsvar.js sätter texten som textContent: fetstil kan inte återges, markörerna tas bort ("**inte**", kolatomen/kolväten)
const talet = (id, s) => { const n = Number(String(s).replace(',', '.')); if (Number.isNaN(n)) { throw new Error(`${id}: svar "${s}" är inte ett tal`); } return n; };
const talen = (id, s) => { const l = String(s).split('|').map(x => talet(id, x.trim())); return l.length === 1 ? l[0] : l; };   // "15 | 12": flera exakt godkända värden (kortsvar-gradering tal-lista, 2026-09-18)

// ---------- blockform ----------
function tolkaBlock(id, typ, rader) {
  const falt = {};
  for (const r of rader) {
    const m = r.match(/^([FASEO]): (.*)$/);
    if (!m) { throw new Error(`${id}: oväntad rad "${r}"`); }
    if (falt[m[1]]) { throw new Error(`${id}: ${m[1]}: förekommer två gånger`); }
    falt[m[1]] = m[2].trim();
  }
  if (!falt.F || !falt.S || !falt.E) { throw new Error(`${id}: F:, S: och E: krävs`); }
  const f = { id, typ, fraga: text(falt.F) };
  if (falt.A) { f.alternativ = falt.A.split(' | ').map(x => text(x)); }
  const S = falt.S;
  switch (typ) {
    case 'tal': case 'flerval': f.svar = talen(id, S); break;
    case 'tal-par': case 'markera': f.svar = S.split(',').map(x => talet(id, x.trim())); break;
    case 'ord': case 'formel': f.svar = S.split(' | ').map(x => x.trim()); break;
    default: throw new Error(`${id}: okänd typ "${typ}"`);
  }
  f.forklaring = text(falt.E);
  if (falt.O) { Object.assign(f, JSON.parse(falt.O)); }
  return f;
}

// ---------- tabellform ----------
function tolkaTabell(N, inneh) {
  const rader = [...inneh.matchAll(/^\| (\d+) \| ([a-z-]+) \| (.+?) \| (.+?) \|$/gm)].map(m => ({ nr: +m[1], typ: m[2], fraga: m[3].trim(), svar: m[4].trim() }));
  const forkl = {};
  const fBlock = inneh.match(/\n### Förklaringar\n([\s\S]*?)(?=\n\*\*Flerval|\n---|$)/);
  // radbrutna förklaringar/alternativ: avsluta bara vid nästa post, tom rad eller filslut – inte vid radslut
  if (fBlock) { for (const m of fBlock[1].matchAll(/^(\d+)\. ([\s\S]*?)(?=\n\d+\. |\n\n|\n\*\*|(?![\s\S]))/gm)) { forkl[+m[1]] = m[2]; } }
  const alt = {};
  for (const m of inneh.matchAll(/^\*\*Flerval (\d+):\*\* ([\s\S]*?)(?=\n\*\*Flerval|\n\*\*Tolerans|\n\n|\n---|(?![\s\S]))/gm)) { alt[+m[1]] = m[2].replace(/\s*\n\s*/g, ' ').split(' · ').map(x => x.trim()); }   // radbrytning först, sedan dela vid ·
  const tol = {};
  for (const m of inneh.matchAll(/^\*\*Tolerans (\d+):\*\* ([\d.,]+)/gm)) { tol[+m[1]] = Number(m[2].replace(',', '.')); }
  // eller "**Tolerans A:N:** x" var som helst i filen (försurning: i Räkning-avsnittet), A = avsnitt
  for (const m of md.matchAll(/^\*\*Tolerans (\d+):(\d+):\*\* ([\d.,]+)/gm)) { if (+m[1] === N) { tol[+m[2]] = Number(m[3].replace(',', '.')); } }
  return rader.map(r => {
    const id = `k${N}-s${r.nr}`;
    if (!forkl[r.nr]) { throw new Error(`${id}: förklaring saknas`); }
    const f = { id, typ: r.typ, fraga: text(r.fraga) };
    switch (r.typ) {
      case 'tal': f.svar = talen(id, r.svar); if (tol[r.nr] !== undefined) { f.tolerans = { abs: tol[r.nr] }; } break;
      case 'ord': f.svar = r.svar.split(',').map(x => x.trim()); break;
      case 'formel': f.svar = [r.svar]; break;
      case 'flerval': {
        if (!alt[r.nr]) { throw new Error(`${id}: **Flerval ${r.nr}:** saknas`); }
        f.alternativ = alt[r.nr].map(x => text(x));
        const ix = alt[r.nr].findIndex(x => x === r.svar);
        if (ix < 0) { throw new Error(`${id}: tabellens svar "${r.svar}" finns inte bland alternativen`); }
        if (ix !== 0) { console.log(`  ⚠ ${id}: rätt svar står inte först bland alternativen`); }
        f.svar = ix; break;
      }
      default: throw new Error(`${id}: typen "${r.typ}" stöds inte i tabellform`);
    }
    f.forklaring = text(forkl[r.nr]);
    return f;
  });
}

for (const a of md.matchAll(/\n# AVSNITT (\d) — ([^\n]+)\n([\s\S]*?)(?=\n# AVSNITT |\n# Räkning|\n# Kontroll|$)/g)) {
  const N = +a[1], inneh = a[3];
  const K = DELKAPITEL[DKID].avsnitt[N];
  if (!K) { throw new Error(`${DKID}: ingen konfiguration för avsnitt ${N}`); }
  if (!K.slug) { fyllHuvud(K, path.join(LEV, `avsnitt-${N}.md`)); }
  const perOmgang = +(inneh.match(/^antal_per_omgang: (\d+)$/m) || [])[1] || +(md.match(/`antal_per_omgang: (\d+)`/) || [])[1];
  if (!perOmgang) { throw new Error(`avsnitt ${N}: antal_per_omgang saknas`); }
  const utkast = (inneh.match(/^> (UTKAST[^\n]*)$/m) || [])[1] || null;
  const fragor = /\n## k\d-s\d+ · /.test(inneh)
    ? [...inneh.matchAll(/\n## (k\d-s\d+) · ([a-z-]+)\n([\s\S]*?)(?=\n## |\n---|$)/g)].map(q => tolkaBlock(q[1], q[2], q[3].trim().split('\n')))
    : tolkaTabell(N, inneh);
  if (fragor.length !== 12) { throw new Error(`avsnitt ${N}: ${fragor.length} frågor, väntade 12`); }
  fragor.forEach((f, i) => { if (f.id !== `k${N}-s${i + 1}`) { throw new Error(`avsnitt ${N}: id ${f.id} på plats ${i + 1}`); } });
  const data = { avsnitt: N, titel: K.titel, delkapitel: DKID, version: utkast ? '0.1-utkast' : '1.0',
    _kommentar: utkast
      ? `${utkast.replace(/ – .*$/, '')} (Code 2026-09-13) härlett ur flipcardsens modell- och begreppskort, för att se komponenten i drift. Ersätts av leverans från innehållschatten efter Joachims granskning. forklaring är obligatorisk på varje fråga. Regel: frågan får inte innehålla svaret (KEMI-TILLAGG §8). Byggd ur doc/leveranser/${DKID}/kortsvar.md.`
      : `Kortsvar för avsnitt ${N} (${K.titel}), delkapitel ${DELKAPITEL[DKID].titel}, leverans 2026-09-13. ${fragor.length} frågor, ${perOmgang} per omgång. Regel: frågan får inte innehålla svaret (KEMI-TILLAGG §8). Byggd ur doc/leveranser/${DKID}/kortsvar.md.`,
    antal_per_omgang: perOmgang, fragor };
  const fel = G.validera(data);
  if (fel.length) { throw new Error(`avsnitt ${N}: ${fel.join('; ')}`); }
  // facit-självtest: rätt svar ska ge ratt
  const RATT = { tal: f => String(Array.isArray(f.svar) ? f.svar[0] : f.svar), flerval: f => String(f.svar), ord: f => f.svar[0], formel: f => f.svar[0],
    'tal-par': f => f.svar.map(String), markera: f => f.svar };
  fragor.forEach(f => { if (G.gradera(f, RATT[f.typ](f)).status !== 'ratt') { throw new Error(`avsnitt ${N} ${f.id}: facit rättas inte som rätt`); } });
  // §8: facit i frågetexten?
  fragor.forEach(f => {
    if (f.typ === 'flerval' || f.typ === 'markera') { return; }
    const facit = (Array.isArray(f.svar) ? f.svar : [f.svar]).map(String);
    const traff = facit.filter(s => new RegExp('(^|[^a-zåäö0-9])' + s.replace(/[+\-^]/g, '\\$&') + '([^a-zåäö0-9]|$)', 'i').test(f.fraga));
    if (traff.length) { console.log(`  ⚠ ${f.id} (${f.typ}): facit "${traff[0]}" förekommer i frågetexten – "${f.fraga}"`); }
  });
  const ut = path.join(ROT, 'kapitel', KAP, 'data', 'kortsvar', `avsnitt-${N}-${K.slug}.json`);
  fs.mkdirSync(path.dirname(ut), { recursive: true });
  fs.writeFileSync(ut, JSON.stringify(data, null, 2) + '\n');
  const typer = fragor.reduce((a, f) => (a[f.typ] = (a[f.typ] || 0) + 1, a), {});
  console.log(`${DKID} avsnitt ${N}: ${fragor.length} frågor`, JSON.stringify(typer), `| formler i förklaringar: ${fragor.filter(f => /\\ce\{/.test(f.forklaring)).length}${utkast ? ' | UTKAST' : ''}`);
}
