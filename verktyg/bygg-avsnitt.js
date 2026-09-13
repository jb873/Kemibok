// bygg-avsnitt.js – bygger en avsnittssida ur en leveransfil (doc/avsnitt-N-komplett.md)
// enligt KOMPONENTER DEL 1-scaffolden. Kör: node verktyg/bygg-avsnitt.js <N> [--torr]
//
// Leveransfilens struktur (samma i avsnitt 2–5):
//   # UNDERDEL X — Titel
//   ## Kärnpunkter (Enkel) / ## Kärnpunkter (Standard) / ## Titta efter (endast Enkel)
//   ## X — ENKEL / ## X — STANDARD / ## X — FÖRDJUPNING   (### rubrik → <h2>, stycken → <p>)
//   "*Ingen fördjupning skriven …*" → nivåblocket utelämnas helt (avsnitt.js disablar knappen)
//   ## BILDSPECIFIKATIONER → <!-- BILD: … -->-kommentarer med färdig figure-markup (beslut C)
//
// Konvertering (KEMI-TILLAGG §1): Unicode-formler (H₂O, Na⁺, SO₄²⁻, "Na → Na⁺ + e⁻") → \(\ce{…}\);
// fristående fetstilt reaktionsrad → <div class="formel">\[\ce{…}\]</div>. Ensamma beteckningar
// (H, O, NaCl) och enheter (°C) lämnas som text. **fet** → <strong>, *kursiv* → <em>.
//
// Bildplacering: leveransen anger bara underdel + nivå, så ANKARE nedan pekar på det stycke
// (delsträng) som bilden ska följa. Varje ankare måste träffa exakt ett stycke.
'use strict';
const fs = require('fs'), path = require('path');
const ROT = path.join(__dirname, '..');
const N = parseInt(process.argv[2], 10);
const TORR = process.argv.includes('--torr');
if (!N) { console.error('användning: node verktyg/bygg-avsnitt.js <avsnittsnummer> [--torr]'); process.exit(2); }

// ---------- per-avsnitt konfiguration (det leveransen inte säger maskinläsbart) ----------
const AVSNITT = {
  2: { slug: 'periodiska-systemet', titel: 'Det periodiska systemet', sub: 'hur atomslagen hänger ihop',
       dd: [{ slug: 'adelgaser-som-reagerar', titel: 'Ädelgaser som ändå reagerar', ikon: '💡' }],
       bilder: {
         // leveransen saknar bildspec; spec från Joachim 2026-09-13, bilden är en genererad SVG (verktyg/bilder-svg.js)
         'periodiska-systemet-forenklat.svg': { aktiv: ['enkel', 'standard'], enkel: 'siffra som kallas **atomnummer**', standard: 'och dess **atomnummer**',
           spec: { underdel: 'a', alt: 'Ett förenklat periodiskt system med de tre första perioderna. Väte och helium står ensamma i första raden. Grupp 1, 2, 17 och 18 är färgmarkerade, och varje ruta visar atomnummer och kemisk beteckning.',
             enkel: 'De tre första perioderna. Raderna är perioder, kolumnerna är grupper. De fyra färgade kolumnerna är de som har egna namn.',
             standard: 'Ett förenklat periodiskt system. Lägg märke till luckan i period 2 och 3 — i det fullständiga systemet sitter övergångsmetallerna där, men de tillkommer först i period 4.' } }
       } },
  3: { slug: 'kemiska-bindningar', titel: 'Kemiska bindningar', sub: 'vad som håller ihop ämnen',
       dd: [{ slug: 'koksalt-ofarligt', titel: 'Varför koksalt är ofarligt', ikon: '🧂' }],
       bilder: {
         'jonbindning-natrium-klor.webp': { fil: 'jonbindning-natrium-klor.svg', aktiv: ['enkel', 'standard'], enkel: 'Möts de passar det perfekt', standard: 'kallas\n**jonbindning**' },
         'elektronpar-vate.webp': { enkel: 'Resultatet är en vätemolekyl', standard: 'det är paret som håller samman' },
         'enkel-dubbel-trippel.webp': { enkel: 'där varje atom saknar tre', standard: 'finns en\ntrippelbindning' },
         'molekylmodeller-vatten.webp': { fil: 'molekylmodeller-vatten.svg', aktiv: ['enkel', 'standard'], enkel: 'vilken man väljer beror på vad man vill visa', standard: 'Valet beror på vad som ska framgå', fordjupning: 'Bindningen är **polär**' },
         'metallbindning.webp': { enkel: 'jonerna ligger i ett hav av elektroner', standard: 'håller på så sätt samman metallen' }
       } },
  4: { slug: 'vattnets-egenskaper', titel: 'Vattnets egenskaper', sub: 'därför beter sig vatten som det gör',
       dd: [{ slug: 'varfor-is-flyter', titel: 'Varför is flyter', ikon: '🧊' }, { slug: 'ytspanning', titel: 'Ytspänning i verkligheten', ikon: '💧' }],
       bilder: {
         'polar-vattenmolekyl.webp': { fil: 'polar-vattenmolekyl.svg', aktiv: ['enkel', 'standard'], enkel: 'medan vätesidorna blir **svagt positiva**', standard: 'mindre laddningsskillnader inom molekylen' },
         'vatebindning.webp': { enkel: 'Den attraktionen\nkallas **vätebindning**', standard: 'Attraktionen mellan vattenmolekylerna kallas **vätebindning**' },
         'is-och-vatten.webp': { enkel: 'plats som is än som flytande vatten.', standard: '**flyter därför på vatten**' }
       } },
  5: { slug: 'losningar', titel: 'Lösningar', sub: 'vad som händer när något löser sig', dd: [],
       bilder: {
         'jon-loses-i-vatten.webp': { enkel: 'lossnar jonen\noch sprids ut i vattnet', standard: 'skiljas\nfrån varandra och spridas ut i vattnet' },
         'polart-och-opolart.webp': { enkel: 'oljan trängs undan till ett\neget lager', standard: 'Därför blandas olja och vatten dåligt' },
         'mattad-losning.webp': { enkel: 'oavsett hur mycket du\nrör om', standard: 'Om mer av ämnet tillsätts kommer det att bli kvar' }
       } }
};
const K = AVSNITT[N];
if (!K) { console.error('ingen konfiguration för avsnitt ' + N); process.exit(2); }
const KAP = { id: 'syror-och-baser', titel: 'Syror och baser' }, DK = { id: 'repetition', titel: 'Bakgrund och repetition' };
const B4 = '../../../../';

// ---------- läs och dela upp leveransen ----------
const md = fs.readFileSync(path.join(ROT, 'doc', `avsnitt-${N}-komplett.md`), 'utf8').replace(/\r\n/g, '\n');
const stopp = md.search(/\n# (Volym|Vad jag ändrat|Djupdykningar|Repetitionsdelkapitlet)/);
const kropp = stopp > 0 ? md.slice(0, stopp) : md;

// bildspecifikationer
const bildspec = {};
const bsBlock = kropp.match(/## BILDSPECIFIKATIONER([\s\S]*?)(?=\n# UNDERDEL)/);
if (bsBlock) {
  for (const m of bsBlock[1].matchAll(/### `([^`]+)` — underdel ([A-D]), ([^\n]+)\n([\s\S]*?)(?=\n### `|$)/g)) {
    const f = m[1], text = m[4];
    const ta = re => { const x = text.match(re); return x ? x[1].replace(/\n/g, ' ').trim() : null; };
    bildspec[f] = { underdel: m[2].toLowerCase(), nivaer: m[3].trim(), alt: ta(/\*\*Alt-text:\*\*\s*([\s\S]*?)\n\n/), enkel: ta(/\*\*Bildtext Enkel:\*\*\s*([\s\S]*?)\n\n/), standard: ta(/\*\*Bildtext Standard:\*\*\s*([\s\S]*?)(?:\n\n|$)/) };
  }
}
for (const f of Object.keys(K.bilder)) {
  if (K.bilder[f].spec) { bildspec[f] = K.bilder[f].spec; }
  if (!bildspec[f]) { throw new Error('bildspec saknas i leveransen för ' + f); }
}
for (const f of Object.keys(bildspec)) { if (!K.bilder[f]) { throw new Error('ankare saknas i konfigurationen för ' + f); } }

// underdelar
const underdelar = [];
for (const m of kropp.matchAll(/\n# UNDERDEL ([A-D]) — ([^\n]+)\n([\s\S]*?)(?=\n# UNDERDEL |$)/g)) {
  const bok = m[1].toLowerCase(), titel = m[2].trim(), inneh = m[3];
  const sek = {};
  for (const s of inneh.matchAll(/\n## ([^\n]+)\n([\s\S]*?)(?=\n## |$)/g)) { sek[s[1].trim()] = s[2].replace(/\n---\s*$/, '').trim(); }
  underdelar.push({ bok, titel, sek });
}
if (!underdelar.length) { throw new Error('inga underdelar hittade'); }

// ---------- inline-konvertering ----------
const SUB = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
function ceify(s) {
  return s.replace(/[₀-₉]/g, c => SUB[c]).replace(/²([⁺⁻])/g, '^2$1').replace(/³([⁺⁻])/g, '^3$1')
    .replace(/⁺/g, '+').replace(/⁻/g, '-').replace(/→/g, '->').replace(/\s+/g, ' ').trim();
}
const FORMELTOKEN = /(?:[A-Z][a-z]?[₀-₉]*)+(?:[²³]?[⁺⁻])?|\be[⁺⁻]/g;
function formler(s) {
  // hela reaktionsrader (innehåller →) hanteras av anroparen; här bara enskilda tokens
  return s.replace(FORMELTOKEN, t => /[₀-₉⁺⁻]/.test(t) ? `\\(\\ce{${ceify(t)}}\\)` : t);
}
function inline(s) {
  let t = s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  t = formler(t);
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s.,;:)]|$)/g, '$1<em>$2</em>');
  return t;
}

// ---------- nivåtext → HTML-block ----------
function nivaHtml(text, niva) {
  if (!text || /^\*Ingen fördjupning/m.test(text)) { return null; }
  const block = text.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  const ut = []; let forsta = true;
  for (const b of block) {
    if (/^### /.test(b)) { ut.push({ typ: 'h2', html: `<h2>${inline(b.replace(/^### /, ''))}</h2>` }); continue; }
    const rader = b.split('\n');
    // fristående fetstilt reaktionsrad → display-formel
    if (rader.length === 1 && /^\*\*[^*]+\*\*$/.test(b) && /→/.test(b)) {
      ut.push({ typ: 'formel', html: `<div class="formel">\\[\\ce{${ceify(b.replace(/\*\*/g, ''))}}\\]</div>` }); continue;
    }
    // flera rader som börjar med **Ord** → egna stycken (modellistan i avsnitt 3 C);
    // en radbruten fortsättning (utan **) hör till raden före
    const starter = rader.filter(r => /^\*\*[^*]+\*\*/.test(r)).length;
    if (rader.length > 1 && starter >= 2 && /^\*\*/.test(rader[0])) {
      const poster = [];
      rader.forEach(r => { if (/^\*\*/.test(r)) { poster.push(r); } else { poster[poster.length - 1] += ' ' + r; } });
      poster.forEach(r => ut.push({ typ: 'p', html: `<p>${inline(r)}</p>`, kalla: r })); continue;
    }
    const klass = (niva === 'standard' && forsta) ? ' class="inledning"' : '';
    ut.push({ typ: 'p', html: `<p${klass}>${inline(b.replace(/\n/g, ' '))}</p>`, kalla: b });
    forsta = false;
  }
  return ut;
}
function lista(text) {
  return text.split('\n').filter(r => /^- /.test(r)).map(r => `              <li>${inline(r.replace(/^- /, ''))}</li>`).join('\n');
}
function figur(f, niva, spec, cfg, titta) {
  const fil = cfg.fil || f;
  const cap = niva === 'enkel' ? spec.enkel : spec.standard;
  const aktiv = Array.isArray(cfg.aktiv) ? cfg.aktiv.includes(niva) : !!cfg.aktiv;
  if (aktiv) {
    let guide = '';
    if (niva === 'enkel') {
      guide = titta ? `<div class="bildguide">
            <div class="bildguide-rubrik">👁 Titta efter</div>
            <ul>
${lista(titta)}
            </ul>
          </div>
          ` : `<!-- BILDGUIDE SAKNAS i leveransen för ${fil} (Enkel ska ha 2–5 "Titta efter"-punkter före bilden) -->
          `;
    }
    return `${guide}<figure class="brodtext-bild ${niva}">
            <img src="img/${fil}" alt="${inline(spec.alt)}">
            <figcaption>${inline(cap)}</figcaption>
          </figure>`;
  }
  const guide = niva === 'enkel' ? `<div class="bildguide">
            <div class="bildguide-rubrik">👁 Titta efter</div>
            <ul><li>{{bildguide saknas i leveransen – 2–5 punkter}}</li></ul>
          </div>
          ` : '';
  const not = niva === 'fordjupning' ? ' OBS: bildtext för fördjupning saknas i leveransen – Standard-texten använd' : '';
  return `<!-- BILD: ${fil} – levereras senare, avkommentera när filen finns i img/.${not}
          ${guide}<figure class="brodtext-bild ${niva}">
            <img src="img/${fil}" alt="${inline(spec.alt)}">
            <figcaption>${inline(cap)}</figcaption>
          </figure>
          -->`;
}

// ---------- bygg underdelar ----------
const rapport = { nivaer: [], ankare: [], enstaka: [] };
function underdelHtml(u, i) {
  const dold = i === 0 ? '' : ' dold';
  const nivaer = ['enkel', 'standard', 'fordjupning'];
  const namn = { enkel: `${u.bok.toUpperCase()} — ENKEL`, standard: `${u.bok.toUpperCase()} — STANDARD`, fordjupning: `${u.bok.toUpperCase()} — FÖRDJUPNING` };
  let ut = `      <!-- ==================== UNDERDEL ${u.bok.toUpperCase()} — ${u.titel} ==================== -->\n      <div class="underdel-text${dold}" data-underdel="${u.bok}">\n`;
  for (const n of nivaer) {
    const block = nivaHtml(u.sek[namn[n]], n);
    if (!block) { rapport.nivaer.push(`${u.bok}/${n}: UTELÄMNAD`); continue; }
    // bilder: infoga efter ankarstycket
    for (const [f, ank] of Object.entries(K.bilder)) {
      const spec = bildspec[f];
      if (spec.underdel !== u.bok || !ank[n]) { continue; }
      const traff = block.map((b, ix) => (b.kalla && b.kalla.includes(ank[n])) ? ix : -1).filter(ix => ix >= 0);
      if (traff.length !== 1) { throw new Error(`ankare för ${f} (${n}) träffar ${traff.length} stycken`); }
      const tittaHar = n === 'enkel' ? u.sek['Titta efter (endast Enkel)'] : null;
      const arAktiv = Array.isArray(ank.aktiv) ? ank.aktiv.includes(n) : !!ank.aktiv;
      block.splice(traff[0] + 1, 0, { typ: 'bild', html: figur(f, n, spec, ank, tittaHar), aktiv: arAktiv });
      if (arAktiv && tittaHar) { u.tittaAnvand = true; }
      rapport.ankare.push(`${f} ${u.bok}/${n} → efter "${ank[n].replace(/\n/g, ' ').slice(0, 40)}…"${arAktiv ? ' [AKTIV]' : ''}`);
    }
    // §7.1: stycken med en mening på Enkel
    if (n === 'enkel') {
      block.filter(b => b.typ === 'p').forEach(b => {
        const men = (b.kalla.replace(/\*\*/g, '').match(/[.!?](\s|$)/g) || []).length;
        if (men <= 1) { rapport.enstaka.push(`${u.bok}: "${b.kalla.replace(/\n/g, ' ').slice(0, 60)}…"`); }
      });
    }
    const karn = u.sek[`Kärnpunkter (${n === 'enkel' ? 'Enkel' : 'Standard'})`];
    const titta = (n === 'enkel' && !u.tittaAnvand) ? u.sek['Titta efter (endast Enkel)'] : null;
    const emoji = { enkel: '📗', standard: '📘', fordjupning: '📕' }[n];
    ut += `\n        <!-- ${emoji} ${n.toUpperCase()} -->\n        <div class="niva-innehall brodtext${n === 'standard' ? '' : ' dold'}" data-niva="${n}">\n`;
    if (karn && n !== 'fordjupning') {
      ut += `\n          <div class="karnpunkter">\n            <div class="karnpunkter-rubrik">🎯 Kärnpunkter</div>\n            <ul>\n${lista(karn)}\n            </ul>\n          </div>\n`;
    }
    if (titta) {
      ut += `\n          <!-- TITTA EFTER (levererad bildguide – bilden kommer separat; aktivera tillsammans med figuren)\n          <div class="bildguide">\n            <div class="bildguide-rubrik">👁 Titta efter</div>\n            <ul>\n${lista(titta)}\n            </ul>\n          </div>\n          -->\n`;
    }
    ut += '\n' + block.map(b => '          ' + b.html).join('\n') + '\n        </div>\n';
    rapport.nivaer.push(`${u.bok}/${n}: ${block.filter(b => b.typ === 'p').length} stycken, ${block.filter(b => b.typ === 'h2').length} h2, ${block.filter(b => b.typ === 'bild' && b.aktiv).length} aktiva bilder, ${block.filter(b => b.typ === 'bild' && !b.aktiv).length} bildkommentar(er)`);
  }
  ut += `\n      </div>\n`;
  return ut;
}

// ---------- hela sidan ----------
const id = `a${N}_${K.slug}`;
const knappar = underdelar.map((u, i) => `        <button type="button" class="underdel-knapp${i === 0 ? ' aktiv' : ''}" data-underdel="${u.bok}" role="tab">
          <span class="underdel-bokstav">${u.bok.toUpperCase()}</span>
          <span class="underdel-titel">${u.titel}</span>
        </button>`).join('\n');
const dd = K.dd.length ? `
      <!-- DJUPDYKNINGAR -->
      <section class="djupdykningar">
        <span class="sektion-label">Vill du veta mer?</span>
        <div class="fordj-kort-grid">
${K.dd.map(d => `          <a class="fordj-kort" href="djupdykning-${d.slug}.html">
            <span class="fordj-kort-ikon" aria-hidden="true">${d.ikon}</span>
            <span class="fordj-kort-text">
              <span class="fordj-kort-titel">${d.titel}</span>
              <span class="fordj-kort-sammanfattning">{{1-2 meningar.}}</span>
            </span>
          </a>`).join('\n')}
        </div>
      </section>
` : '';

const html = `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${K.titel} – ${DK.titel} – Kemi</title>
  <link rel="stylesheet" href="${B4}css/geografi.css">
  <link rel="stylesheet" href="${B4}css/kemi.css">
  <link rel="stylesheet" href="${B4}css/flipcards.css">
  <link rel="stylesheet" href="${B4}css/fonts.css">
</head>
<body>

  <!-- ===== HERO-BANNER (mörk, patina-accent) ===== -->
  <header class="hero-banner">
    <div class="hero-inner">
      <nav class="brodsmulor" aria-label="Brödsmulor">
        <a href="${B4}index.html">Kemi</a>
        <span class="skiljare" aria-hidden="true">›</span>
        <a href="../../index.html">${KAP.titel}</a>
        <span class="skiljare" aria-hidden="true">›</span>
        <a href="index.html">${DK.titel}</a>
        <span class="skiljare" aria-hidden="true">›</span>
        <span class="aktuell" aria-current="page">${N}. ${K.titel}</span>
      </nav>
      <span class="avsnitt-label">Avsnitt ${N}</span>
      <h1>${K.titel}</h1>
      <p class="subtitel">— ${K.sub} —</p>
    </div>
  </header>

  <main class="sida">

    <!-- ===== FLIKRAD ===== -->
    <div class="flikar-rad" role="tablist">
      <button type="button" class="flik" data-flik="forelasning" role="tab">Föreläsning</button>
      <button type="button" class="flik aktiv" data-flik="las" role="tab">Läs</button>
      <button type="button" class="flik" data-flik="ova" role="tab">Öva</button>
      <button type="button" class="flik" data-flik="elevboken" role="tab">Elevboken</button>
    </div>

    <!-- ===== FÖRELÄSNING — tom mount, JS fyller på från data/forelasningar.json.
         Flikknappen sätts disabled av JS om inga föreläsningar finns. ===== -->
    <section class="flik-innehall dold" data-flik="forelasning" role="tabpanel">
      <div class="forelasningar-lista"></div>
    </section>

    <!-- ===== LÄS (aktiv panel = utan dold) ===== -->
    <section class="flik-innehall" data-flik="las" role="tabpanel">

      <!-- Underdelsväljare -->
      <div class="underdel-valjare" role="tablist" aria-label="Textval">
${knappar}
      </div>

      <!-- EN delad nivåväljare — EFTER underdel-valjare, UTANFÖR underdel-text -->
      <div class="niva-valjare" role="group" aria-label="Textnivå"
           data-niva-nyckel="kemi-niva-${KAP.id}-${K.slug}">
        <button type="button" class="niva-knapp" data-niva="enkel">📗 Enkel</button>
        <button type="button" class="niva-knapp aktiv" data-niva="standard">📘 Standard</button>
        <button type="button" class="niva-knapp" data-niva="fordjupning">📕 Fördjupning</button>
      </div>

${underdelar.map(underdelHtml).join('\n')}${dd}
    </section>

    <!-- ===== ÖVA ===== -->
    <section class="flik-innehall dold" data-flik="ova" role="tabpanel">
      <div class="flipcards-mount"
           data-fil="../../data/flipcards/avsnitt-${N}-${K.slug}.json"
           data-avsnitt="${id}">
        <p class="flipcards-laddar">Laddar övningskort…</p>
      </div>
    </section>

    <!-- ===== ELEVBOKEN ===== -->
    <section class="flik-innehall dold" data-flik="elevboken" role="tabpanel">
      <div class="elevbok-fragor">
        <p class="laddar-fragor">Laddar frågor ...</p>
      </div>
    </section>

  </main>

  <!-- AVSNITT_ID-block FÖRE de externa skripten -->
  <script>
    const AVSNITT_ID = '${id}';
    const KAPITEL_ID = '${KAP.id}';
    const DELKAPITEL_ID = '${DK.id}';
  </script>

  <!-- MathJax + mhchem — SJÄLVHOSTAD, se KOMPONENTER DEL 8 -->
  <script src="${B4}js/mathjax-config.js"></script>
  <script src="${B4}js/mathjax/tex-mml-chtml.js" id="MathJax-script" async></script>

  <script src="${B4}js/elevbok.js"></script>
  <script src="${B4}js/avsnitt.js"></script>
  <script src="${B4}js/bildmodal.js" defer></script>
  <script src="${B4}js/egna-fragor.js" defer></script>
  <script src="${B4}js/avsnitt-elevbok.js" defer></script>
  <script src="${B4}js/textbyggar-stodlarare.js" defer></script>
  <script src="${B4}js/flipcards.js" defer></script>
  <script src="${B4}js/forelasningar.js" defer></script>
  <script src="${B4}js/elevfeedback.js" defer></script>
</body>
</html>
`;

const ut = path.join(ROT, 'kapitel', KAP.id, 'delkapitel', DK.id, `avsnitt-${N}-${K.slug}.html`);
if (!TORR) { fs.writeFileSync(ut, html); }
console.log((TORR ? '(torrkörning) ' : 'skrev ') + path.relative(ROT, ut));
console.log('underdelar:', underdelar.map(u => u.bok.toUpperCase() + ' ' + u.titel).join(' | '));
rapport.nivaer.forEach(r => console.log('  ' + r));
rapport.ankare.forEach(r => console.log('  bild: ' + r));
console.log('§7.1 – Enkel-stycken med en mening (' + rapport.enstaka.length + '):');
rapport.enstaka.forEach(r => console.log('  ' + r));
const kvar = (html.replace(/<!--[\s\S]*?-->/g, '').match(/[₀-₉⁺⁻→]/g) || []);
console.log('Unicode-formeltecken kvar utanför kommentarer:', kvar.length, kvar.length ? JSON.stringify([...new Set(kvar)]) : '');
