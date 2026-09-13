// bygg-flipcards.js – bygger flipcards-JSON för ett delkapitel ur doc/leveranser/{delkapitel}/flipcards.md
// och bygger om kapitlets begreppsbank.json ur ALLA delkapitels flipcards.md (grundläggande begreppskort 1:1).
// Kör: node verktyg/bygg-flipcards.js [delkapitel]     (utelämnat = repetition)
//
// Leveransens struktur:  # AVSNITT N — Titel  /  **X kort:** B begreppskort, M modellkort   (väntad räkning)
//                        ## Begreppskort — grundläggande | fördjupning / ## Modellkort — grundläggande | fördjupning
//                        **Korttitel** [formel]? [brygga]?  /  F: fråga  /  S: svar (får radbrytas)
//                        # Begreppsbanken … **Term** — omformulering utan formel
// `\ce{X}` i backticks → \(\ce{X}\). **fet** behålls (flipcards.js renderar den). Id: k{N}-b{n} / k{N}-m{n}
// i leveransens ordning (grundläggande först). [brygga] är bara en notis. Inga redogorelsekort.
//
// Begreppsbanken är EN fil per kapitel (LEVERANSGUIDE), så id och avsnittsnummer måste vara unika över
// delkapitlen: DELKAPITEL[dk].bank anger id-prefix (Historia: kU1-b1 för Upptäckterna) och avsnittsoffset
// (Historia medeltiden: avsnitt 1–12 löpande över tre delkapitel). Kortens id i flipcards-JSON:en är
// oförändrade (k1-b1) – de lever per fil.
'use strict';
const fs = require('fs'), path = require('path');
const { DELKAPITEL } = require('./bygg-avsnitt-konfig.js');
const { fyllHuvud } = require('./lib-leveranshuvud.js');
const { formler } = require('./lib-notation.js');   // Unicode-tiopotenser (10⁻¹⁴) och ⇌ utanför \ce{} → MathJax (§1)
const ROT = path.join(__dirname, '..');
const KAP = 'syror-och-baser';
const DKID = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'repetition';
if (!DELKAPITEL[DKID]) { console.error('okänt delkapitel ' + DKID); process.exit(2); }

// `\ce{X}` → \(\ce{X}\); färdig MathJax i backticks (`\(10^{-2}\)`, Baser 3) → avgränsarna behålls, backticks bort
function ce(s) { return formler(s.replace(/`\\ce\{([^}]*)\}`/g, (_, x) => '\\(\\ce{' + x + '}\\)').replace(/`(\\\([\s\S]*?\\\))`/g, '$1')); }
function avsnittInfo(dk, N) {
  const K = DELKAPITEL[dk].avsnitt[N];
  if (!K) { throw new Error(`${dk}: ingen konfiguration för avsnitt ${N}`); }
  if (!K.slug) { fyllHuvud(K, path.join(ROT, 'doc', 'leveranser', dk, `avsnitt-${N}.md`)); }
  return K;
}

// ---------- läs ett delkapitels flipcards.md → { avsnitt: {N: {titel, kort, termer, vb, vm}}, utanFormel } ----------
function lasLeverans(dk) {
  const fil = path.join(ROT, 'doc', 'leveranser', dk, 'flipcards.md');
  if (!fs.existsSync(fil)) { return null; }
  const md = fs.readFileSync(fil, 'utf8').replace(/\r\n/g, '\n');
  const slut = md.search(/\n#{1,2} Begreppsbanken/);   // # eller ## (neutralisation)
  const kropp = slut > 0 ? md.slice(0, slut) : md;
  const utanFormel = {};
  // bara Begreppsbanken-sektionen (fram till nästa rubrik) – "**Term** — …" i t.ex. "Dubbletter att kontrollera" ska inte räknas
  const bankSek = slut > 0 ? md.slice(slut).replace(/^\n#{1,2} [^\n]+\n/, '').split(/\n#{1,2} /)[0] : '';
  if (slut > 0) { for (const m of bankSek.matchAll(/\n\*\*([^*]+)\*\* — ([\s\S]*?)(?=\n\n|\n*$(?![\s\S]))/g)) { utanFormel[m[1].trim().toLowerCase()] = m[2].replace(/\n/g, ' ').trim(); } }
  const avsnitt = {};
  for (const a of kropp.matchAll(/\n# AVSNITT (\d) — ([^\n]+)\n\*\*(\d+) kort:\*\* (\d+) begreppskort, (\d+) modellkort\n([\s\S]*?)(?=\n# AVSNITT |\n#{1,2} Räkning|$)/g)) {
    const N = +a[1], inneh = a[6], vb = +a[4], vm = +a[5];
    if (+a[3] !== vb + vm) { throw new Error(`${dk} avsnitt ${N}: ${a[3]} kort ≠ ${vb} + ${vm}`); }
    const kort = { begreppskort: [], modellkort: [] }, termer = [], varningar = [];
    for (const s of inneh.matchAll(/\n## (Begreppskort|Modellkort) — (grundläggande|fördjupning)\n([\s\S]*?)(?=\n## |$)/g)) {
      const typ = s[1] === 'Begreppskort' ? 'begrepp' : 'modell', niva = s[2] === 'grundläggande' ? 'grundlaggande' : 'fordjupning';
      for (const k of s[3].matchAll(/\*\*([^*\n]+)\*\*((?: \[[a-z]+\])*)\nF: ([\s\S]*?)\nS: ([\s\S]*?)(?=\n\n\*\*|\n\n---|\n*$)/g)) {
        const titel = k[1].trim(), markning = k[2] || '', formel = /\[formel\]/.test(markning);
        const fraga = ce(k[3].replace(/\n/g, ' ').trim()), svar = ce(k[4].replace(/\n/g, ' ').trim());
        const harCe = /\\ce\{/.test(fraga + svar), harMath = /\\\(/.test(fraga + svar);
        if (formel && !harCe) { throw new Error(`${dk} avsnitt ${N} "${titel}": märkt [formel] men ingen \\ce{} hittad`); }
        if (!formel && harCe) { varningar.push(`"${titel}" har \\ce{} utan [formel]-märkning – byggt som formelkort`); }
        if (!formel && !harCe && harMath) { varningar.push(`"${titel}": Unicode-tiopotens/pil konverterad till MathJax`); }
        const lista = typ === 'begrepp' ? kort.begreppskort : kort.modellkort;
        const id = `k${N}-${typ === 'begrepp' ? 'b' : 'm'}${lista.length + 1}`;
        lista.push({ id, type: typ, niva, fraga, svar });
        if (typ === 'begrepp' && niva === 'grundlaggande') { termer.push({ id, term: titel.toLowerCase(), svar, svarRaa: k[4].replace(/\n/g, ' ').trim() }); }   // svarRaa: råtexten (Unicode) till banken
      }
    }
    // leveransens egen räkning kontrolleras men stoppar inte bygget – det byggda antalet är sanningen
    if (kort.begreppskort.length !== vb || kort.modellkort.length !== vm) { varningar.push(`leveransen säger ${vb} begrepp + ${vm} modell, filen innehåller ${kort.begreppskort.length} + ${kort.modellkort.length}`); }
    avsnitt[N] = { titel: a[2].trim(), kort, termer, vb: kort.begreppskort.length, vm: kort.modellkort.length, varningar };
  }
  return { avsnitt, utanFormel };
}

// ---------- flipcards-JSON för valt delkapitel ----------
const lev = lasLeverans(DKID);
if (!lev) { console.error(`doc/leveranser/${DKID}/flipcards.md saknas`); process.exit(2); }
for (const [N, a] of Object.entries(lev.avsnitt)) {
  const K = avsnittInfo(DKID, N);
  const data = {
    avsnitt: +N, titel: K.titel, delkapitel: DKID, version: '1.0',
    kort_totalt: a.vb + a.vm,
    _kommentar: `Flipcards för avsnitt ${N} (${K.titel}), delkapitel ${DELKAPITEL[DKID].titel}. ${a.vb} begreppskort + ${a.vm} modellkort = ${a.vb + a.vm} kort; inga redogörelsekort (KEMI-TILLAGG §2). Formler som \\(\\ce{...}\\) renderas via KemiFormler-hooken i flipcards.js. Byggd ur doc/leveranser/${DKID}/flipcards.md.`,
    begreppskort: a.kort.begreppskort, modellkort: a.kort.modellkort
  };
  const ut = path.join(ROT, 'kapitel', KAP, 'data', 'flipcards', `avsnitt-${N}-${K.slug}.json`);
  fs.writeFileSync(ut, JSON.stringify(data, null, 2) + '\n');
  const formelkort = [...a.kort.begreppskort, ...a.kort.modellkort].filter(k => /\\ce\{/.test(k.fraga + k.svar)).map(k => k.id);
  console.log(`${DKID} avsnitt ${N}: ${a.vb} begrepp (${a.termer.length} till banken) + ${a.vm} modell, formelkort: ${formelkort.join(' ') || '–'}`);
  a.varningar.forEach(v => console.log('  ⚠ ' + v));
}

// ---------- begreppsbank: alla delkapitel med flipcards.md, i DELKAPITEL-ordning ----------
const bankFil = path.join(ROT, 'kapitel', KAP, 'data', 'begreppsbank.json');
const bank = JSON.parse(fs.readFileSync(bankFil, 'utf8'));   // kapitel_id, titel, upplasning m.m. behålls
const nya = [], summering = [];
for (const dk of Object.keys(DELKAPITEL)) {
  const L = dk === DKID ? lev : lasLeverans(dk);
  if (!L) { continue; }
  const B = DELKAPITEL[dk].bank || { idPrefix: '', avsnittOffset: 0 };
  let antal = 0;
  for (const [N, a] of Object.entries(L.avsnitt)) {
    const K = avsnittInfo(dk, N);
    for (const t of a.termer) {
      if (B.uteslut && B.uteslut[t.term]) { console.log(`  ${dk} avsnitt ${N}: "${t.term}" utesluten ur banken – ${B.uteslut[t.term]}`); continue; }
      // banken renderar ren text: leveransens omformulering, annars kortets råtext (Unicode-pilar och -index går bra, ce-formler inte)
      let def = L.utanFormel[t.term] || t.svarRaa.replace(/\*\*/g, '');
      if (/\\ce\{|\\\(/.test(def)) { throw new Error(`${dk} begrepp "${t.term}" har formel kvar och saknar omformulering`); }
      nya.push({ id: t.id.replace(/^k/, 'k' + B.idPrefix), avsnitt: String(+N + B.avsnittOffset), avsnitt_titel: K.titel, delkapitel_titel: DELKAPITEL[dk].titel,
        term: t.term, expertdefinition: def, kallfil: `kapitel/${KAP}/data/flipcards/avsnitt-${N}-${K.slug}.json` });
      antal++;
    }
  }
  summering.push(`${DELKAPITEL[dk].titel} ${antal}`);
}
const ids = new Set(nya.map(b => b.id));
if (ids.size !== nya.length) { throw new Error('begreppsbank: dubblerade id'); }
bank.begrepp = nya;
bank.version = 3;
bank.skapad = '2026-09-13';
bank.kommentar = `Begreppsbank för kapitlet Syror och baser. Begreppen härleds 1:1 ur flipcardsens grundläggande begreppskort (kallfil); fördjupningsbegrepp finns bara som flipcards. Begreppsbanken renderar ren text: definitioner med formler är omformulerade utan formler här (leveransens avsnitt Begreppsbanken), flipcardsen behåller sina. Id och avsnittsnummer är unika över delkapitlen (id-prefix och löpande avsnittsnummer per delkapitel, som Historias begreppsbanker); delkapitel_titel grupperar. ${summering.join(' + ')} = ${nya.length}.`;
fs.writeFileSync(bankFil, JSON.stringify(bank, null, 2) + '\n');
console.log('begreppsbank:', nya.length, 'begrepp |', summering.join(' + '));
