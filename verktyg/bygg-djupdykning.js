// bygg-djupdykning.js – bygger djupdykningssidor ur doc/leveranser/{delkapitel}/djupdykningar.md
// (scaffold: KOMPONENTER DEL 1 + Historias djupdykningssida med tidslinje-header, MathJax laddad).
// Kör: node verktyg/bygg-djupdykning.js [delkapitel]     (utelämnat = repetition; bygger alla i filen)
//
// Leveransens struktur per djupdykning:
//   # N. Titel                       (h1 på sidan; kortets titel tas ur konfigurationen i bygg-avsnitt.js)
//   **Avsnitt N — Avsnittstitel**    (vilket avsnitt kortet och tillbaka-länken hör till)
//   **Korttext:** 1–2 meningar       (fordj-kort-sammanfattning; läses av bygg-avsnitt.js)
//   ## Text  …  ---                  (### rubrik → <h2>, stycken → <p>; enkelnivå, §7.1 rapporteras)
// Djupdykningarna matchas mot dd-listan i bygg-avsnitt.js via titelns början (leveransens rubrik
// kan vara längre än kortets titel, t.ex. "Varför is flyter — och varför det räddar livet").
'use strict';
const fs = require('fs'), path = require('path');
const { formler } = require('./lib-notation.js');
const ROT = path.join(__dirname, '..');
const DKID = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'repetition';
const TORR = process.argv.includes('--torr');
const KAP = { id: 'syror-och-baser', titel: 'Syror och baser' };
const { tolkaDjupdykningar } = require('./lib-djupdykningar.js');
const { DELKAPITEL } = require('./bygg-avsnitt-konfig.js');
if (!DELKAPITEL[DKID]) { console.error('okänt delkapitel ' + DKID); process.exit(2); }
const DK = { id: DKID, titel: DELKAPITEL[DKID].titel };
const B4 = '../../../../';
const alla = tolkaDjupdykningar(path.join(ROT, 'doc', 'leveranser', DK.id, 'djupdykningar.md'));

function inline(s) {
  let t = s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  t = formler(t);
  return t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s.,;:)]|$)/g, '$1<em>$2</em>');
}

let antal = 0;
for (const [N, K] of Object.entries(DELKAPITEL[DKID].avsnitt)) {
  for (const d of K.dd) {
    const lev = alla.find(x => x.titel.startsWith(d.titel));
    if (!lev) { console.log(`  ${d.slug}: ingen text i leveransen – sidan lämnas orörd`); continue; }
    if (lev.avsnitt !== +N) { throw new Error(`${d.slug}: leveransen säger avsnitt ${lev.avsnitt}, konfigurationen avsnitt ${N}`); }
    const block = lev.text.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
    const enstaka = [];
    const html = block.map(b => {
      if (/^### /.test(b)) { return `      <h2>${inline(b.replace(/^### /, ''))}</h2>`; }
      const p = b.replace(/\n/g, ' ');
      if ((p.replace(/\*\*/g, '').match(/[.!?](\s|$)/g) || []).length <= 1) { enstaka.push(p.slice(0, 60)); }
      return `      <p>${inline(p)}</p>`;
    }).join('\n');
    const avsnittFil = `avsnitt-${N}-${K.slug}.html#a`;
    const sida = `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lev.titel} — Kemi</title>
  <link rel="stylesheet" href="${B4}css/geografi.css">
  <link rel="stylesheet" href="${B4}css/kemi.css">
  <link rel="stylesheet" href="${B4}css/fonts.css">
</head>
<body>
  <header class="tidslinje-header djupdykning">
    <div class="tidslinje-inner">
      <a class="tidslinje-tillbaka" href="${avsnittFil}">← Tillbaka till ${K.titel}</a>
    </div>
  </header>

  <header class="hero-banner">
    <div class="hero-inner">
      <nav class="brodsmulor" aria-label="Brödsmulor">
        <a href="${B4}index.html">Kemi</a>
        <span class="skiljare" aria-hidden="true">›</span>
        <a href="../../index.html">${KAP.titel}</a>
        <span class="skiljare" aria-hidden="true">›</span>
        <a href="index.html">${DK.titel}</a>
        <span class="skiljare" aria-hidden="true">›</span>
        <a href="${avsnittFil}">${N}. ${K.titel}</a>
        <span class="skiljare" aria-hidden="true">›</span>
        <span class="aktuell" aria-current="page">${d.titel}</span>
      </nav>
      <span class="avsnitt-label">Djupdykning</span>
      <h1>${inline(lev.titel)}</h1>
      <!-- ingen <p class="subtitel">: leveransen har ingen kort underrubrik (korttexten hör till fordj-kort) -->
    </div>
  </header>

  <div class="sida">

    <article class="brodtext fordjupning-artikel">

${html}

      <p class="tillbaka-lank"><a href="${avsnittFil}">← Tillbaka till ${K.titel}</a></p>

    </article>

  </div>

  <!-- MathJax även här: kemins djupdykningar kan innehålla formler (avviker från Historia,
       som bara laddar elevfeedback.js) -->
  <script src="${B4}js/mathjax-config.js"></script>
  <script src="${B4}js/mathjax/tex-mml-chtml.js" id="MathJax-script" async></script>
  <script src="${B4}js/elevfeedback.js" defer></script>
</body>
</html>
`;
    const ut = path.join(ROT, 'kapitel', KAP.id, 'delkapitel', DK.id, `djupdykning-${d.slug}.html`);
    if (!TORR) { fs.writeFileSync(ut, sida); }
    antal++;
    const ord = lev.text.replace(/[#*]/g, '').split(/\s+/).filter(Boolean).length;
    console.log(`${TORR ? '(torr) ' : 'skrev '}${path.basename(ut)}: "${lev.titel}" – ${block.filter(b => !/^### /.test(b)).length} stycken, ${block.filter(b => /^### /.test(b)).length} h2, ~${ord} ord`);
    if (enstaka.length) { console.log(`  §7.1 – stycken med en mening (${enstaka.length}): ${enstaka.map(e => '"' + e + '…"').join(' | ')}`); }
  }
}
console.log(`${antal} djupdykningar, ${alla.length} i leveransen`);
