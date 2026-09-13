// bygg-avsnitt.js – bygger en avsnittssida ur en leveransfil (doc/leveranser/{delkapitel}/avsnitt-N.md)
// enligt KOMPONENTER DEL 1-scaffolden. Kör: node verktyg/bygg-avsnitt.js [delkapitel] <N> [--torr]
// (delkapitel utelämnat = repetition). Titel, slug och hero-underrubrik läses ur leveransens huvud
// (# … — Titel / **Sökväg:** / **Underrubrik i hero:**) om konfigurationen inte anger dem.
//
// Leveransfilens struktur:
//   # UNDERDEL X — Titel
//   ## Kärnpunkter (Enkel) / ## Kärnpunkter (Standard) / ## Titta efter (endast Enkel)
//   ## X — ENKEL / ## X — STANDARD / ## X — FÖRDJUPNING   (### rubrik → <h2>, stycken → <p>,
//   "- "-block → <ul>, "| … |"-block → <table class="brodtext-tabell">, "**Term** — …"-rader → egna <p>)
//   "*Ingen fördjupning …*" → nivåblocket utelämnas helt (avsnitt.js disablar knappen)
//   ## BILDSPECIFIKATION(ER) → figure-markup; "### Bildguide (endast Enkel)" inuti specen används som
//   bildguide (prioritet: bildguider.md > specens bildguide > "Titta efter"). Inaktiv bild (konfig
//   aktiv) → <!-- BILD: … --> med färdig markup (beslut C).
//   # FAKTARUTA (underdel X, nivåer: enkel, standard | endast Standard | alla nivåer) → <aside class="faktaruta">
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
const ARG = process.argv.slice(2).filter(a => !a.startsWith('--'));
const DKID = /^\d+$/.test(ARG[0] || '') ? 'repetition' : ARG[0];
const N = parseInt(/^\d+$/.test(ARG[0] || '') ? ARG[0] : ARG[1], 10);
const TORR = process.argv.includes('--torr');
if (!DKID || !N) { console.error('användning: node verktyg/bygg-avsnitt.js [delkapitel] <avsnittsnummer> [--torr]'); process.exit(2); }

const { DELKAPITEL } = require('./bygg-avsnitt-konfig.js');   // per-avsnitt konfiguration (bildankare m.m.)
if (!DELKAPITEL[DKID]) { console.error('okänt delkapitel ' + DKID); process.exit(2); }
const K = DELKAPITEL[DKID].avsnitt[N];
if (!K) { console.error('ingen konfiguration för avsnitt ' + N); process.exit(2); }
const KAP = { id: 'syror-och-baser', titel: 'Syror och baser' }, DK = { id: DKID, titel: DELKAPITEL[DKID].titel };
const B4 = '../../../../';

// ---------- läs och dela upp leveransen ----------
const LEV = path.join(ROT, 'doc', 'leveranser', DK.id);   // leveransfiler per delkapitel
const md = fs.readFileSync(path.join(LEV, `avsnitt-${N}.md`), 'utf8').replace(/\r\n/g, '\n');
const stopp = md.search(/\n# (Volym|Vad jag ändrat|Vad jag gjort|Djupdykningar|Repetitionsdelkapitlet|Anmärkningar|Om nivåuppdelningen|Att bestämma|Delkapitlet|Bearbetningar)/);
const kropp = stopp > 0 ? md.slice(0, stopp) : md;
require('./lib-leveranshuvud.js').fyllHuvud(K, path.join(LEV, `avsnitt-${N}.md`));   // titel/slug/underrubrik ur huvudet om konfigurationen saknar dem

// bildspecifikationer
const bildspec = {};
const bsBlock = kropp.match(/## BILDSPECIFIKATION(?:ER)?([\s\S]*?)(?=\n# UNDERDEL)/);
if (bsBlock) {
  for (const m of bsBlock[1].matchAll(/### `([^`]+)` — underdel ([A-D]), ([^\n]+)\n([\s\S]*?)(?=\n### `|$)/g)) {
    const f = m[1], text = m[4];
    const ta = re => { const x = text.match(re); return x ? x[1].replace(/\n/g, ' ').trim() : null; };
    const guide = text.match(/### Bildguide \(endast Enkel\)\n([\s\S]*?)(?=\n---|\n### |$)/);
    bildspec[f] = { underdel: m[2].toLowerCase(), nivaer: m[3].trim(), alt: ta(/\*\*Alt-text:\*\*\s*([\s\S]*?)\n\n/), enkel: ta(/\*\*Bildtext Enkel:\*\*\s*([\s\S]*?)\n\n/), standard: ta(/\*\*Bildtext Standard:\*\*\s*([\s\S]*?)(?:\n\n|$)/), guide: guide ? guide[1].trim() : null };
  }
}
for (const f of Object.keys(K.bilder)) {
  if (K.bilder[f].spec) { bildspec[f] = K.bilder[f].spec; }
  if (!bildspec[f]) { throw new Error('bildspec saknas i leveransen för ' + f); }
}
for (const f of Object.keys(bildspec)) { if (!K.bilder[f]) { throw new Error('ankare saknas i konfigurationen för ' + f); } }

// bildguider (doc/leveranser/{delkapitel}/bildguider.md): "## Underdel X — `fil`" följt av punktlista, per bildfil
const bildguider = {};
const bgFil = path.join(LEV, 'bildguider.md');
if (fs.existsSync(bgFil)) {
  const bg = fs.readFileSync(bgFil, 'utf8').replace(/\r\n/g, '\n');
  for (const m of bg.matchAll(/## Underdel [A-D] — `([^`]+)`\n([\s\S]*?)(?=\n## |\n# |\n---|$)/g)) {
    bildguider[m[1]] = m[2].trim();
  }
}

// faktaruta: "## FAKTARUTA (underdel A, nivåer: enkel, standard)" + **Rubrik:** + prosa + **Sammanfattning:**-lista
let faktaruta = null;
const frM = kropp.match(/\n#{1,2} FAKTARUTA \(underdel ([A-D]), ([^)]+)\)\n([\s\S]*?)(?=\n## |\n# |$)/);
if (frM) {
  const md = frM[3].replace(/\n---\s*$/, '').trim();
  const rubrik = (md.match(/\*\*Rubrik:\*\* ([^\n]+)/) || [])[1];
  const [prosaDel, sammDel] = md.split(/\n\*\*Sammanfattning:\*\*\n/);
  const prosa = prosaDel.split(/\n\s*\n/).map(x => x.trim()).filter(x => x && !/^\*\*Rubrik:/.test(x));
  let samm = (sammDel || '').split('\n').filter(r => /^- /.test(r)).map(r => r.replace(/^- /, ''));
  // utan **Sammanfattning:**-rubrik: avslutande stycke(n) där varje rad är helfet = sammanfattningen
  while (!sammDel && prosa.length > 1 && prosa[prosa.length - 1].split('\n').every(r => /^\*\*[^*]+\*\*$/.test(r.trim()))) {
    samm = [...prosa.pop().split('\n').map(r => r.trim().replace(/^\*\*|\*\*$/g, '')), ...samm];
  }
  const nivM = frM[2].trim();
  const nivaer = /^nivåer:/.test(nivM) ? nivM.replace(/^nivåer:/, '').split(',').map(x => x.trim().toLowerCase())
    : /^endast /.test(nivM) ? [nivM.replace(/^endast /, '').trim().toLowerCase().replace('fördjupning', 'fordjupning')]
    : /^alla/.test(nivM) ? ['enkel', 'standard', 'fordjupning'] : null;
  if (!nivaer) { throw new Error('FAKTARUTA: okänd nivåangivelse "' + nivM + '"'); }
  if (!rubrik || !prosa.length) { throw new Error('FAKTARUTA: rubrik eller prosa saknas'); }
  faktaruta = { underdel: frM[1].toLowerCase(), nivaer, rubrik, prosa, samm };
  if (!K.faktaruta) { throw new Error('leveransen har en FAKTARUTA men konfigurationen saknar ankare'); }
}
function faktarutaHtml() {
  return `<aside class="faktaruta">
            <h3>${inline(faktaruta.rubrik)}</h3>
${faktaruta.prosa.map(p => '            <p>' + inline(p.replace(/\n/g, ' ')) + '</p>').join('\n')}
            <div class="faktaruta-sammanfattning">
${faktaruta.samm.map(r => '              <p><strong>' + inline(r) + '</strong></p>').join('\n')}
            </div>
          </aside>`;
}

// underdelar
const underdelar = [];
for (const m of kropp.matchAll(/\n# UNDERDEL ([A-D]) — ([^\n]+)\n([\s\S]*?)(?=\n# |$)/g)) {
  const bok = m[1].toLowerCase(), titel = m[2].trim(), inneh = m[3];
  const sek = {};
  for (const s of inneh.matchAll(/\n## ([^\n]+)\n([\s\S]*?)(?=\n## |$)/g)) { if (/^FAKTARUTA/.test(s[1])) { continue; } sek[s[1].trim()] = s[2].replace(/\n---\s*$/, '').trim(); }
  underdelar.push({ bok, titel, sek });
}
if (!underdelar.length) { throw new Error('inga underdelar hittade'); }

// ---------- inline-konvertering ----------
const { ceify, formler, arReaktion } = require('./lib-notation.js');   // Unicode → \ce (tokens, tiopotenser, ⇌); reaktionsrader via ceify
function inline(s) {
  let t = s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  // fet reaktion i löptext → ett enda \(\ce{…}\) (lib-notation.arReaktion); övrig fetstil → <strong>
  t = t.replace(/\*\*([^*]+)\*\*/g, (m, x) => arReaktion(x) ? `§§${ceify(x)}§§` : m);
  t = formler(t).replace(/§§([^§]*)§§/g, '\\(\\ce{$1}\\)');
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
    if (rader.length === 1 && /^\*\*[^*]+\*\*$/.test(b) && arReaktion(b.replace(/\*\*/g, ''))) {
      ut.push({ typ: 'formel', html: `<div class="formel">\\[\\ce{${ceify(b.replace(/\*\*/g, ''))}}\\]</div>`, kalla: b }); continue;
    }
    // punktlista → <ul> (plattformens .brodtext ul); tabell → <table class="brodtext-tabell"> (kemi.css)
    if (rader.every(r => /^- /.test(r))) {
      ut.push({ typ: 'lista', html: '<ul>' + rader.map(r => '<li>' + inline(r.replace(/^- /, '')) + '</li>').join('') + '</ul>', kalla: b }); continue;
    }
    if (rader.every(r => /^\|/.test(r))) {
      const celler = r => r.replace(/^\|\s*|\s*\|$/g, '').split(/\s*\|\s*/);
      const just = celler(rader[1]).map(c => /:$/.test(c) && !/^:/.test(c) ? ' class="hoger"' : '');
      const rad = (r, tag) => '<tr>' + celler(r).map((c, i) => `<${tag}${just[i] || ''}>${inline(c)}</${tag}>`).join('') + '</tr>';
      ut.push({ typ: 'tabell', html: `<div class="tabell-ram"><table class="brodtext-tabell"><thead>${rad(rader[0], 'th')}</thead><tbody>${rader.slice(2).map(r => rad(r, 'td')).join('')}</tbody></table></div>`, kalla: b }); continue;
    }
    // flera rader av formen "**Term** — …" → egna stycken (modellistan i repetition 3 C);
    // en radbruten fortsättning (utan **) hör till raden före. Fet inledning på flera rader i ett
    // vanligt stycke ("**Citronsyra** är … **avkalkning** …") ska däremot förbli ett stycke.
    const starter = rader.filter(r => /^\*\*[^*]+\*\* — /.test(r)).length;
    if (rader.length > 1 && starter >= 2 && /^\*\*[^*]+\*\* — /.test(rader[0])) {
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
  return text.split('\n').filter(r => /^- /.test(r)).map(r => `              <li>${inline(punktReaktion(r.replace(/^- /, '')))}</li>`).join('\n');
}
// punkt som är (eller slutar med "…: ") en ren reaktion utan fetstil → fetmarkera så att inline() gör ett \(\ce{}\) av den
function punktReaktion(r) {
  const m = r.match(/^(.*?: )?([^:*]+)$/);
  return m && arReaktion(m[2]) ? (m[1] || '') + '**' + m[2].trim() + '**' : r;
}
function figur(f, niva, spec, cfg, titta) {
  const fil = cfg.fil || f;   // får innehålla sökväg relativt img/ när bilden ligger i ett annat delkapitel
  const cap = niva === 'enkel' ? spec.enkel : spec.standard;
  const aktiv = Array.isArray(cfg.aktiv) ? cfg.aktiv.includes(niva) : !!cfg.aktiv;
  if (aktiv) {
    let guide = '';
    if (niva === 'enkel') {
      const punkter = bildguider[fil] || spec.guide || titta;
      guide = punkter ? `<div class="bildguide">
            <div class="bildguide-rubrik">👁 Titta efter</div>
            <ul>
${lista(punkter)}
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
  const punkter = bildguider[fil] || spec.guide || titta;
  const guide = niva === 'enkel' ? `<div class="bildguide">
            <div class="bildguide-rubrik">👁 Titta efter</div>
            <ul>${punkter ? '\n' + lista(punkter) + '\n            ' : '<li>{{bildguide saknas i leveransen – 2–5 punkter}}</li>'}</ul>
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
const rapport = { nivaer: [], ankare: [], enstaka: [], bildguide: [] };
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
      if (arAktiv && tittaHar && !bildguider[ank.fil || f]) { u.tittaAnvand = true; }
      if (n === 'enkel') { rapport.bildguide.push(`${ank.fil || f}${arAktiv ? '' : ' (kommentar)'}: ${bildguider[ank.fil || f] ? 'bildguide ur doc/bildguider' : spec.guide ? 'bildguide ur leveransens bildspec' : (tittaHar ? 'bildguide ur leveransens Titta efter' : 'BILDGUIDE SAKNAS')}`); }
      rapport.ankare.push(`${f} ${u.bok}/${n} → efter "${ank[n].replace(/\n/g, ' ').slice(0, 40)}…"${arAktiv ? ' [AKTIV]' : ''}`);
    }
    // faktaruta efter ankarstycket och den figur som följer det
    if (faktaruta && faktaruta.underdel === u.bok && faktaruta.nivaer.includes(n) && K.faktaruta[n]) {
      const traff = block.map((b, ix) => (b.kalla && b.kalla.includes(K.faktaruta[n])) ? ix : -1).filter(ix => ix >= 0);
      if (traff.length !== 1) { throw new Error(`faktaruta-ankare (${n}) träffar ${traff.length} stycken`); }
      let pos = traff[0] + 1;
      while (block[pos] && block[pos].typ === 'bild') { pos++; }
      block.splice(pos, 0, { typ: 'faktaruta', html: faktarutaHtml() });
      rapport.ankare.push(`faktaruta ${u.bok}/${n} → efter "${K.faktaruta[n].slice(0, 40)}…" (+ figur)`);
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
    rapport.nivaer.push(`${u.bok}/${n}: ${block.filter(b => b.typ === 'p').length} stycken, ${block.filter(b => b.typ === 'h2').length} h2, ${block.filter(b => b.typ === 'lista' || b.typ === 'tabell').length} listor/tabeller, ${block.filter(b => b.typ === 'bild' && b.aktiv).length} aktiva bilder, ${block.filter(b => b.typ === 'bild' && !b.aktiv).length} bildkommentar(er)`);
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
// korttexter ur doc/leveranser/{dk}/djupdykningar.md (lib-djupdykningar.js); saknas texten står platshållaren kvar
const djup = require('./lib-djupdykningar.js').tolkaDjupdykningar(path.join(LEV, 'djupdykningar.md'));
const korttext = d => { const x = djup.find(y => y.titel.startsWith(d.titel)); return x ? inline(x.korttext) : '{{1-2 meningar.}}'; };
const dd = K.dd.length ? `
      <!-- DJUPDYKNINGAR -->
      <section class="djupdykningar">
        <span class="sektion-label">Vill du veta mer?</span>
        <div class="fordj-kort-grid">
${K.dd.map(d => `          <a class="fordj-kort" href="djupdykning-${d.slug}.html">
            <span class="fordj-kort-ikon" aria-hidden="true">${d.ikon}</span>
            <span class="fordj-kort-text">
              <span class="fordj-kort-titel">${d.titel}</span>
              <span class="fordj-kort-sammanfattning">${korttext(d)}</span>
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

    <!-- ===== ÖVA — tre arbetssätt (js/ova-arbetssatt.js) ovanpå flipcards.js + kortsvar.js ===== -->
    <section class="flik-innehall dold" data-flik="ova" role="tabpanel">
      <div class="ova-valjare" role="group" aria-label="Arbetssätt">
        <span class="sektion-label">Hur vill du öva?</span>
        <button type="button" class="ova-kort" data-arbetssatt="begrepp">
          <span class="ova-kort-ikon" aria-hidden="true">🟢</span>
          <span class="ova-kort-titel">Plugga begrepp</span>
          <span class="ova-kort-beskr">Vänd kort. Ett begrepp i taget, snabb repetition.</span>
        </button>
        <button type="button" class="ova-kort" data-arbetssatt="kortsvar">
          <span class="ova-kort-ikon" aria-hidden="true">✍️</span>
          <span class="ova-kort-titel">Testa dig själv</span>
          <span class="ova-kort-beskr">Kortsvar med rättning. Du får veta direkt vad som stämde och varför.</span>
        </button>
        <button type="button" class="ova-kort" data-arbetssatt="tillampa">
          <span class="ova-kort-ikon" aria-hidden="true">🔵</span>
          <span class="ova-kort-titel">Tillämpa</span>
          <span class="ova-kort-beskr">Vänd kort. Frågor där du måste använda det du kan.</span>
        </button>
      </div>
      <div class="flipcards-mount"
           data-fil="../../data/flipcards/avsnitt-${N}-${K.slug}.json"
           data-avsnitt="${id}">
        <p class="flipcards-laddar">Laddar övningskort…</p>
      </div>
      <div class="kortsvar-mount"
           data-fil="../../data/kortsvar/avsnitt-${N}-${K.slug}.json"></div>
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
  <script src="${B4}js/kortsvar-gradering.js" defer></script>
  <script src="${B4}js/kortsvar.js" defer></script>
  <script src="${B4}js/ova-arbetssatt.js" defer></script>
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
rapport.bildguide.forEach(r => console.log('  guide: ' + r));
console.log('§7.1 – Enkel-stycken med en mening (' + rapport.enstaka.length + '):');
rapport.enstaka.forEach(r => console.log('  ' + r));
const kvar = (html.replace(/<!--[\s\S]*?-->/g, '').match(/[₀-₉⁺⁻→]/g) || []);
console.log('Unicode-formeltecken kvar utanför kommentarer:', kvar.length, kvar.length ? JSON.stringify([...new Set(kvar)]) : '');
