// bygg-djupdykning.js – bygger djupdykningssidor ur doc/leveranser/{delkapitel}/djupdykningar.md
// (scaffold: KOMPONENTER DEL 1 + Historias djupdykningssida med tidslinje-header, MathJax laddad).
// Kör: node verktyg/bygg-djupdykning.js [delkapitel]     (utelämnat = repetition; bygger alla i filen)
//
// Leveransens struktur per djupdykning:
//   # N. Titel                       (h1 på sidan; kortets titel tas ur konfigurationen i bygg-avsnitt.js)
//   **Avsnitt N — Avsnittstitel**    (vilket avsnitt kortet och tillbaka-länken hör till)
//   **Korttext:** 1–2 meningar       (fordj-kort-sammanfattning; läses av bygg-avsnitt.js)
//   ## Text  …  ---                  (### rubrik → <h2>, stycken → <p>; enkelnivå, §7.1 rapporteras)
//   eller syror-formen med **Länkas från:** / **Filnamn:** / **Underrubrik:** / **Brödtext:** fil.md
//   (texten i egen fil, oförändrad; fet reaktion → \(\ce{}\), fristående fet reaktionsrad → .formel).
//   Se lib-djupdykningar.js.
// Djupdykningarna matchas mot dd-listan i bygg-avsnitt.js via titelns början (leveransens rubrik
// kan vara längre än kortets titel, t.ex. "Varför is flyter — och varför det räddar livet").
'use strict';
const fs = require('fs'), path = require('path');
const { formler, ceify, arReaktion } = require('./lib-notation.js');
const ROT = path.join(__dirname, '..');
const DKID = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'repetition';
const TORR = process.argv.includes('--torr');
const { tolkaDjupdykningar } = require('./lib-djupdykningar.js');
const { DELKAPITEL } = require('./bygg-avsnitt-konfig.js');
if (!DELKAPITEL[DKID]) { console.error('okänt delkapitel ' + DKID); process.exit(2); }
const KAP = DELKAPITEL[DKID].kapitel || { id: 'syror-och-baser', titel: 'Syror och baser' };   // kapitel ur konfigurationen (Organisk kemi: kolatomen, kolvaten)
const DK = { id: DKID, titel: DELKAPITEL[DKID].titel };
const B4 = '../../../../';
const alla = tolkaDjupdykningar(path.join(ROT, 'doc', 'leveranser', DK.id, 'djupdykningar.md'));

function inline(s) {
  // fet reaktion i löptext ("**HCl + H₂O → H₃O⁺ + Cl⁻**") → ett enda \(\ce{…}\); övrig fetstil → <strong>
  let t = s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  t = t.replace(/\$(\\ce\{[^}]*\})\$/g, '\\($1\\)');   // "$\ce{Fe2O3}$" i löptext (grönt stål) → \(\ce{…}\); $ är inte en avgränsare i mathjax-config
  t = t.replace(/\*\*([^*]+)\*\*/g, (m, x) => arReaktion(x) ? `§§${ceify(x)}§§` : m);
  t = formler(t).replace(/§§([^§]*)§§/g, '\\(\\ce{$1}\\)');
  t = t.replace(/\d(?: \d{3})+(?!\d)/g, m => m.replace(/ /g, '&nbsp;'));   // tusentalsmellanslag ("1 200 grader", "100 000") får inte brytas över radslut
  return t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s.,;:)]|$)/g, '$1<em>$2</em>');
}

let antal = 0;
for (const [N, K] of Object.entries(DELKAPITEL[DKID].avsnitt)) {
  if (!K.slug) { require('./lib-leveranshuvud.js').fyllHuvud(K, path.join(ROT, 'doc', 'leveranser', DK.id, DELKAPITEL[DKID].byggmapp || '', `avsnitt-${N}.md`)); }   // huvudet ligger i byggfilen när en byggmapp finns
  for (const d of K.dd) {
    const lev = alla.find(x => x.titel.startsWith(d.titel));
    if (!lev) { console.log(`  ${d.slug}: ingen text i leveransen – sidan lämnas orörd`); continue; }
    if (lev.avsnitt !== +N) { throw new Error(`${d.slug}: leveransen säger avsnitt ${lev.avsnitt}, konfigurationen avsnitt ${N}`); }
    if (lev.slug && lev.slug !== d.slug) { throw new Error(`${d.slug}: leveransen anger filnamnet djupdykning-${lev.slug}.html`); }
    if (lev.annatDelkapitel) { throw new Error(`${d.slug}: leveransen placerar texten i delkapitlet ${lev.annatDelkapitel}`); }
    const block = lev.text.split(/\n\s*\n/).map(b => b.trim()).filter(b => b && b !== '---');   // --- (avdelare i leveransen) ritas inte
    const enstaka = [];
    const html = block.map(b => {
      if (/^#{2,3} Om du vill veta mer$/.test(b)) { return `      <h3>Om du vill veta mer</h3>`; }   // avslutande frågor (Joachim 2026-09-15): plattformens svagare rubriknivå, ingen avdelning
      if (/^#{2,3} /.test(b)) { return `      <h2>${inline(b.replace(/^#{2,3} /, ''))}</h2>`; }   // ## (kolatomen) eller ### (repetition) → h2
      if (/^- /.test(b)) { return `      <ul>\n${b.split(/\n(?=- )/).map(l => `        <li>${inline(l.replace(/^- /, '').replace(/\n\s+/g, ' '))}</li>`).join('\n')}\n      </ul>`; }   // punktlista ("Om du vill veta mer")
      // tabell "| … |" → <table class="brodtext-tabell"> i tabell-ram (som bygg-avsnitt.js; gasledningar 2026-09-16)
      if (b.split('\n').every(r => /^\|/.test(r))) {
        const rader = b.split('\n'), celler = r => r.replace(/^\|\s*|\s*\|$/g, '').split(/\s*\|\s*/);
        const just = celler(rader[1]).map(c => /:$/.test(c) && !/^:/.test(c) ? ' class="hoger"' : '');
        const rad = (r, tag) => '<tr>' + celler(r).map((c, i) => `<${tag}${just[i] || ''}>${inline(c)}</${tag}>`).join('') + '</tr>';
        return `      <div class="tabell-ram"><table class="brodtext-tabell"><thead>${rad(rader[0], 'th')}</thead><tbody>${rader.slice(2).map(r => rad(r, 'td')).join('')}</tbody></table></div>`;
      }
      const p = b.replace(/\n/g, ' ');
      // fristående fet reaktionsrad → display-formel (som i avsnittssidorna)
      if (/^\*\*[^*]+\*\*$/.test(p) && arReaktion(p.replace(/\*\*/g, ''))) { return `      <div class="formel">\\[\\ce{${ceify(p.replace(/\*\*/g, ''))}}\\]</div>`; }
      // "$$\ce{…}$$" som eget stycke (fossila bränslen: grönt stål) → samma display-formel; $$ är inte en avgränsare i mathjax-config
      if (/^\$\$[\s\S]+\$\$$/.test(p)) { const inre = p.replace(/^\$\$|\$\$$/g, '').trim(); return `      <div class="formel">\\[${/\\ce\{/.test(inre) ? inre : '\\ce{' + inre + '}'}\\]</div>`; }
      if ((p.replace(/\*\*/g, '').match(/[.!?](\s|$)/g) || []).length <= 1) { enstaka.push(p.slice(0, 60)); }
      return `      <p>${inline(p)}</p>`;
    }).join('\n');
    const avsnittFil = `avsnitt-${N}-${K.slug}.html#${lev.underdel || 'a'}`;
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
${lev.underrubrik ? `      <p class="subtitel">— ${inline(lev.underrubrik)} —</p>` : '      <!-- ingen <p class="subtitel">: leveransen har ingen kort underrubrik (korttexten hör till fordj-kort) -->'}
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
    console.log(`${TORR ? '(torr) ' : 'skrev '}${path.basename(ut)}: "${lev.titel}" – ${block.filter(b => !/^#{2,3} /.test(b) && !/^- /.test(b)).length} stycken, ${block.filter(b => /^#{2,3} /.test(b)).length} h2, ${block.filter(b => /^- /.test(b)).length} listor, ~${ord} ord`);
    if (enstaka.length) { console.log(`  §7.1 – stycken med en mening, rapporteras men är inte fel i djupdykningar (${enstaka.length}): ${enstaka.map(e => '"' + e + '…"').join(' | ')}`); }
  }
}
console.log(`${antal} djupdykningar, ${alla.length} i leveransen`);
