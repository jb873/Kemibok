// bygg-flipcards.js – bygger flipcards-JSON för avsnitt 2–5 ur doc/leveranser/repetition/flipcards.md och
// bygger om begreppsbank.json (alla grundläggande begreppskort i kapitlet, 1:1 via kallfil).
// Kör: node verktyg/bygg-flipcards.js
//
// Leveransens struktur:  # AVSNITT N — Titel
//                        ## Begreppskort — grundläggande | fördjupning / ## Modellkort — grundläggande | fördjupning
//                        **Korttitel** [formel]?  /  F: fråga  /  S: svar (får radbrytas)
// `\ce{X}` i backticks → \(\ce{X}\). **fet** behålls (flipcards.js renderar den). Id: k{N}-b{n} / k{N}-m{n}
// i leveransens ordning (grundläggande först). Inga redogorelsekort.
'use strict';
const fs = require('fs'), path = require('path');
const ROT = path.join(__dirname, '..');
const KAP = 'syror-och-baser', DK = 'repetition';
const SLUG = { 1: 'atomer-molekyler-joner', 2: 'periodiska-systemet', 3: 'kemiska-bindningar', 4: 'vattnets-egenskaper', 5: 'losningar' };
const TITEL = { 1: 'Atomer, molekyler och joner', 2: 'Det periodiska systemet', 3: 'Kemiska bindningar', 4: 'Vattnets egenskaper', 5: 'Lösningar' };
const VANTAT = { 2: [12, 8], 3: [15, 6], 4: [7, 9], 5: [9, 8] };   // begrepp, modell enligt leveransens räkning

const md = fs.readFileSync(path.join(ROT, 'doc', 'leveranser', DK, 'flipcards.md'), 'utf8').replace(/\r\n/g, '\n');
const slut = md.indexOf('\n# Begreppsbanken');
const kropp = md.slice(0, slut);

// omformuleringar utan formel för begreppsbanken
const utanFormel = {};
for (const m of md.slice(slut).matchAll(/\n\*\*([^*]+)\*\* — ([\s\S]*?)(?=\n\n)/g)) { utanFormel[m[1].trim().toLowerCase()] = m[2].replace(/\n/g, ' ').trim(); }

function ce(s) { return s.replace(/`\\ce\{([^}]*)\}`/g, (_, x) => '\\(\\ce{' + x + '}\\)'); }

const resultat = {};
for (const a of kropp.matchAll(/\n# AVSNITT (\d) — [^\n]+\n([\s\S]*?)(?=\n# AVSNITT |$)/g)) {
  const N = +a[1], inneh = a[2];
  const kort = { begreppskort: [], modellkort: [] };
  const termer = [];   // grundläggande begrepp → banken
  for (const s of inneh.matchAll(/\n## (Begreppskort|Modellkort) — (grundläggande|fördjupning)\n([\s\S]*?)(?=\n## |$)/g)) {
    const typ = s[1] === 'Begreppskort' ? 'begrepp' : 'modell', niva = s[2] === 'grundläggande' ? 'grundlaggande' : 'fordjupning';
    for (const k of s[3].matchAll(/\*\*([^*\n]+)\*\*( \[formel\])?\nF: ([\s\S]*?)\nS: ([\s\S]*?)(?=\n\n\*\*|\n\n---|\n*$)/g)) {
      const titel = k[1].trim(), formel = !!k[2];
      const fraga = ce(k[3].replace(/\n/g, ' ').trim()), svar = ce(k[4].replace(/\n/g, ' ').trim());
      if (formel && !/\\ce\{/.test(fraga + svar)) { throw new Error(`avsnitt ${N} "${titel}": märkt [formel] men ingen \\ce{} hittad`); }
      if (!formel && /\\ce\{/.test(fraga + svar)) { throw new Error(`avsnitt ${N} "${titel}": \\ce{} utan [formel]-märkning`); }
      const lista = typ === 'begrepp' ? kort.begreppskort : kort.modellkort;
      const id = `k${N}-${typ === 'begrepp' ? 'b' : 'm'}${lista.length + 1}`;
      lista.push({ id, type: typ, niva, fraga, svar });
      if (typ === 'begrepp' && niva === 'grundlaggande') { termer.push({ id, term: titel.toLowerCase(), svar }); }
    }
  }
  const [vb, vm] = VANTAT[N];
  if (kort.begreppskort.length !== vb || kort.modellkort.length !== vm) { throw new Error(`avsnitt ${N}: fann ${kort.begreppskort.length} begrepp + ${kort.modellkort.length} modell, väntade ${vb} + ${vm}`); }
  const data = {
    avsnitt: N, titel: TITEL[N], delkapitel: DK, version: '1.0',
    kort_totalt: vb + vm,
    _kommentar: `Flipcards för avsnitt ${N} (${TITEL[N]}). ${vb} begreppskort + ${vm} modellkort = ${vb + vm} kort; inga redogörelsekort (KEMI-TILLAGG §2). Formler som \\(\\ce{...}\\) renderas via KemiFormler-hooken i flipcards.js. Byggd ur doc/leveranser/repetition/flipcards.md.`,
    begreppskort: kort.begreppskort, modellkort: kort.modellkort
  };
  const ut = path.join(ROT, 'kapitel', KAP, 'data', 'flipcards', `avsnitt-${N}-${SLUG[N]}.json`);
  fs.writeFileSync(ut, JSON.stringify(data, null, 2) + '\n');
  resultat[N] = { termer, formelkort: [...kort.begreppskort, ...kort.modellkort].filter(k => /\\ce\{/.test(k.fraga + k.svar)).map(k => k.id) };
  console.log(`avsnitt ${N}: ${vb} begrepp (${termer.length} till banken) + ${vm} modell, formelkort: ${resultat[N].formelkort.join(' ') || '–'}`);
}

// ---------- begreppsbank: avsnitt 1 (befintlig) + 2–5 ----------
const bankFil = path.join(ROT, 'kapitel', KAP, 'data', 'begreppsbank.json');
const bank = JSON.parse(fs.readFileSync(bankFil, 'utf8'));
const a1 = bank.begrepp.filter(b => b.avsnitt === '1');
if (a1.length !== 13) { throw new Error('väntade 13 begrepp från avsnitt 1 i banken, fann ' + a1.length); }
const nya = [];
for (const N of [2, 3, 4, 5]) {
  for (const t of resultat[N].termer) {
    let def = utanFormel[t.term] || t.svar.replace(/\*\*/g, '');
    if (/\\ce\{|\\\(/.test(def)) { throw new Error(`begrepp "${t.term}" har formel kvar och saknar omformulering`); }
    nya.push({ id: t.id, avsnitt: String(N), avsnitt_titel: TITEL[N], term: t.term, expertdefinition: def, kallfil: `kapitel/${KAP}/data/flipcards/avsnitt-${N}-${SLUG[N]}.json` });
  }
}
bank.begrepp = [...a1, ...nya];
bank.version = 2;
bank.skapad = '2026-09-13';
bank.kommentar = 'Begreppsbank för kapitlet Syror och baser. Begreppen härleds 1:1 ur flipcardsens grundläggande begreppskort (kallfil); fördjupningsbegrepp finns bara som flipcards. Begreppsbanken renderar ren text: definitioner med formler (molekyl, grundämne, kemisk förening, sammansatt jon, dubbelbindning, trippelbindning, summaformel) är omformulerade utan formler här, flipcardsen behåller sina. Avsnitt 1 (13) + 2 (11) + 3 (12) + 4 (5) + 5 (7) = 48.';
fs.writeFileSync(bankFil, JSON.stringify(bank, null, 2) + '\n');
console.log('begreppsbank:', bank.begrepp.length, 'begrepp | omformulerade utan formel:', Object.keys(utanFormel).join(', '));
