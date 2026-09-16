// satt-ihop-kolvaten.js – sätter ihop byggfiler för Organisk kemi 2 "Kolväten" ur leveransens egna format (samma som Kolatomen):
//   doc/leveranser/kolvaten/avsnitt-N.md                    (Standard: "## N.X Titel", "### rubrik", bildrutor som "> **Bild B…**")
//   doc/leveranser/kolvaten/avsnitt-N-enkel-fordjupning.md  (valfri: "# 📗 ENKEL" / "# 📕 FÖRDJUPNING" med "## N.X Titel")
//   doc/leveranser/kolvaten/knapptitlar-och-ingresser.md    (valfri: knapptitlar, hero-underrubriker, Enkel-ingresser – Joachims beslut)
//   doc/leveranser/kolvaten/karnpunkter.md                  (valfri: fem frågor per underdel, Enkel + Standard)
// → doc/leveranser/kolvaten/bygg/avsnitt-N.md i bygg-avsnitt.js-format. Leveransfilerna rörs inte.
// Kör: node verktyg/satt-ihop-kolvaten.js [N…], sedan node verktyg/bygg-avsnitt.js kolvaten N.
//
// Förhandsbygge (arbetsorder 1 Kolväten, 2026-09-15): bara Standard är levererad. Saknas avsnitt-N-enkel-fordjupning.md skrivs
// inga "## X — ENKEL"/"## X — FÖRDJUPNING"-block alls, så bygg-avsnitt.js utelämnar nivåblocken (rapporterar "UTELÄMNAD") och
// avsnitt.js disablar nivåknapparna – plattformens befintliga "nivå som saknas"-mekanism, ingen ny konstruktion. När texterna
// kommer läggs filen i leveransmappen och verktyget körs om; inget i byggfilen eller sidan behöver rivas.
// Saknas knapptitlar-och-ingresser.md används den långa underdelsrubriken som knapptitel (som i Kolatomens första bygge) och
// hero-underrubriken tas ur HUVUD nedan (Codes förslag, rapporterat). Saknas karnpunkter.md utelämnas kärnpunktsblocket.
// Övriga regler som i satt-ihop-kolatomen.js: "Om modellen." vanligt stycke; anteckningsrader tas bort; avsnittets inledning
// (före "## N.1") läggs som Standard-inledning i underdel A; fristående reaktionsrader fetmarkeras → display-formler.
'use strict';
const fs = require('fs'), path = require('path');
const { arReaktion } = require('./lib-notation.js');
const R = path.join(__dirname, '..', 'doc', 'leveranser', 'kolvaten');
const UT = path.join(R, 'bygg');
fs.mkdirSync(UT, { recursive: true });
const finns = f => fs.existsSync(path.join(R, f));
const norm = f => fs.readFileSync(path.join(R, f), 'utf8').replace(/\r\n/g, '\n');
// slug och hero-underrubrik per avsnitt (ordern anger inga; förslag av Code 2026-09-15, rapporterade – ersätts av
// knapptitlar-och-ingresser.md när Joachim beslutar, som för Kolatomen)
const HUVUD = {
  1: { slug: 'kolvaten-bestar-av-kol-och-vate', sub: 'alkanerna, molekylformeln och tre sätt att visa en molekyl' },
  2: { slug: 'de-forsta-kolvatena', sub: 'metan, etan, propan och butan – och varför kedjans längd avgör' },
  3: { slug: 'samma-formel-olika-struktur', sub: 'isomerer, dubbel- och trippelbindningar, alkener och alkyner' },
  4: { slug: 'polymerer', sub: 'hur små molekyler kopplas samman till plast och andra jättemolekyler' }
};
const BOK = ['A', 'B', 'C'];
let KORT = {}, SUB = {}, INGRESS = {};
if (finns('knapptitlar-och-ingresser.md')) {
  const KI = norm('knapptitlar-och-ingresser.md');
  KORT = Object.fromEntries([...KI.matchAll(/^\| (\d)\.(\d) \| ([^|]+) \|$/gm)].map(m => [m[1] + '.' + m[2], m[3].trim()]));
  SUB = Object.fromEntries([...KI.matchAll(/^\| (\d) \| ([^|]+) \|$/gm)].map(m => [m[1], m[2].trim()]));
  INGRESS = Object.fromEntries([...KI.matchAll(/### Avsnitt (\d)\n\n([\s\S]*?)(?=\n\n###|\n\n## |$)/g)].map(m => [m[1], m[2].trim()]));
}
const KP = {};
if (finns('karnpunkter.md')) {
  for (const m of norm('karnpunkter.md').matchAll(/\n### (\d)\.(\d) [^\n]+\n\n((?:- [^\n]+\n)+)/g)) { KP[m[1] + '.' + m[2]] = m[3].trim(); }
  const n = Object.values(KP).reduce((x, l) => x + l.split('\n').length, 0);   // arbetsorder 6: 12 underdelar × 5 = 60
  if (Object.keys(KP).length !== 12 || n !== 60) throw new Error(`karnpunkter.md: ${Object.keys(KP).length} underdelar, ${n} punkter (väntat 12 × 5 = 60)`);
  console.log(`karnpunkter.md: ${Object.keys(KP).length} underdelar × 5 = ${n} frågor`);
}
const rensa = t => t.split('\n').filter(l => !/^> /.test(l) && !/^\*ca \d+ ord\*$/.test(l.trim()) && !/^\*[^*]+undantaget[^*]*\*$/.test(l.trim()) && !/^\*{1,2}Djupdykning härifrån:/.test(l) && !/^Bildspecarna ligger inbakade i bildrutorna/.test(l)).join('\n')   // även kursiv djupdykningsrad (avsnitt 3, djupdykningen inte skriven) och leveransnoten om bildspecar
  .replace(/\n{3,}/g, '\n\n').trim();
const fetaReaktioner = t => t.split(/\n\n+/).map(p => (!/\n/.test(p) && !/\*\*/.test(p) && arReaktion(p.trim())) ? `**${p.trim()}**` : p).join('\n\n');

const AVSNITT = process.argv.slice(2).map(Number).filter(Boolean);
if (!AVSNITT.length) { for (let n = 1; finns(`avsnitt-${n}.md`); n++) { AVSNITT.push(n); } }
for (const N of AVSNITT) {
  if (!HUVUD[N]) throw new Error(`avsnitt ${N}: slug/underrubrik saknas i HUVUD`);
  const std = norm(`avsnitt-${N}.md`);
  const titel = std.match(/^# Avsnitt \d — ([^\n]+)/)[1].trim();
  const intro = rensa(std.slice(std.indexOf('\n') + 1, std.search(/\n## \d\.1 /)).replace(/^---\s*$/gm, ''));   // allt före ## N.1; --- och leveransnot tas bort
  const under = [...std.matchAll(/\n## (\d)\.(\d) ([^\n]+)\n([\s\S]*?)(?=\n## \d\.\d |$)/g)].map(m => ({ nr: +m[2], titel: m[3].trim(), text: m[4] }));
  if (under.length !== 3) throw new Error(`avsnitt ${N}: ${under.length} underdelar i Standard`);
  // bildrutor → bildspec + ankare (sista raden i stycket före rutan)
  const specar = [];
  for (const u of under) {
    // bildrutor i två format: "> **Bild B1 — Namn** (SVG)" (avsnitt 1–2) och "> ### Bild C1 — Namn" + "> **SVG · placering: …**" (avsnitt 3, specen inbakad)
    const delar = u.text.split(/\n(?=> (?:\*\*|### )Bild [A-Z]\d+)/);
    let text = delar[0];
    for (const d of delar.slice(1)) {
      const ruta = d.match(/^((?:>[^\n]*\n?)+)/)[1]; const rest = d.slice(ruta.length);
      const k = ruta.split('\n').map(l => l.replace(/^> ?/, '')).join('\n');
      const h = k.match(/^\*\*Bild ([A-Z]\d+) — ([^*]+)\*\* \(([^)]+)\)/) || k.match(/^### Bild ([A-Z]\d+) — ([^\n]+)\n\*\*(SVG|AI)[^*]*\*\*/);
      const f = (rub) => { const x = k.match(new RegExp('\\*\\*' + rub + ':\\*\\* ([\\s\\S]*?)(?=\\n\\n|\\n\\*\\*|$)')); return x[1].replace(/\s*\n\s*/g, ' ').trim(); };
      const punkter = [...k.matchAll(/^- (.+)$/gm)].map(x => x[1].trim());
      const fil = 'k2-' + h[1].toLowerCase() + (h[3].startsWith('AI') ? '.webp' : '.svg');
      const fore = text.trim().split(/\n\n+/).pop().split('\n').pop().trim();
      specar.push({ fil, underdel: BOK[u.nr - 1], namn: h[2].trim(), alt: f('Alt'), enkel: f('Bildtext Enkel'), standard: f('Bildtext Standard'), punkter, ankareStandard: fore, rubriker: (text.match(/^### /gm) || []).length });
      text += rest;
    }
    u.text = rensa(text);
    u.rubriker = (u.text.match(/^### /gm) || []).length;
  }
  // Enkel och Fördjupning (valfria i förhandsbygget)
  let enkel = null, fordj = null;
  if (finns(`avsnitt-${N}-enkel-fordjupning.md`)) {
    const ef = norm(`avsnitt-${N}-enkel-fordjupning.md`);
    const enkelDel = ef.match(/\n# 📗 ENKEL\n([\s\S]*?)\n# 📕 FÖRDJUPNING\n/)[1], fordjDel = ef.match(/\n# 📕 FÖRDJUPNING\n([\s\S]*)$/)[1];
    const dela = del => [...del.matchAll(/\n## (\d)\.(\d) ([^\n]+)\n([\s\S]*?)(?=\n## \d\.\d |$)/g)].map(m => ({ nr: +m[2], titel: m[3].trim(), text: rensa(m[4].replace(/\n---\s*$/, '')) }));
    enkel = dela(enkelDel); fordj = dela(fordjDel);
    if (enkel.length !== 3 || fordj.length !== 3) throw new Error(`avsnitt ${N}: ${enkel.length} enkel, ${fordj.length} fördjupning`);
    fordj.forEach(u => { if (!/\*\*Om modellen\.\*\*/.test(u.text)) throw new Error(`avsnitt ${N}.${u.nr}: "Om modellen" saknas`); });
  }
  const sub = SUB[String(N)] || HUVUD[N].sub;
  let ut = `# Kolväten, avsnitt ${N} — ${titel}
## Byggfil, sammansatt av verktyg/satt-ihop-kolvaten.js ur avsnitt-${N}.md${enkel ? ` och avsnitt-${N}-enkel-fordjupning.md` : ' (bara Standard levererad – Enkel och Fördjupning utelämnade)'} – redigera inte här

**Sökväg:** \`kapitel/organisk-kemi/delkapitel/kolvaten/avsnitt-${N}-${HUVUD[N].slug}.html\`
**AVSNITT_ID:** \`a${N}_${HUVUD[N].slug}\`
**Underrubrik i hero:** ${sub}

---

## BILDSPECIFIKATIONER

`;
  for (const s of specar) {
    ut += `### \`${s.fil}\` — underdel ${s.underdel}, alla nivåer\n\n${s.namn}. Placering enligt bildrutan i avsnitt-${N}.md.\n\n**Alt-text:** ${s.alt}\n\n**Bildtext Enkel:** ${s.enkel}\n\n**Bildtext Standard:** ${s.standard}\n\n### Bildguide (endast Enkel)\n${s.punkter.map(p => '- ' + p).join('\n')}\n\n`;
  }
  ut += '---\n';
  for (let i = 0; i < 3; i++) {
    const X = BOK[i], u = under[i];
    const stdText = (i === 0 && intro ? intro + '\n\n' : '') + u.text;
    const kort = KORT[N + '.' + u.nr] || u.titel;
    const kp = KP[N + '.' + u.nr] ? `## Kärnpunkter (Enkel)\n\n${KP[N + '.' + u.nr]}\n\n## Kärnpunkter (Standard)\n\n${KP[N + '.' + u.nr]}\n\n` : '';
    ut += `\n# UNDERDEL ${X} — ${kort}\n\n${kp}---\n\n`;
    if (enkel) {
      const e = enkel[i]; if (e.nr !== u.nr) throw new Error('underdelsnummer stämmer inte');
      const enkelText = (i === 0 && INGRESS[String(N)] ? INGRESS[String(N)] + '\n\n' : '') + e.text;
      ut += `## ${X} — ENKEL\n\n${fetaReaktioner(enkelText)}\n\n---\n\n`;
    }
    ut += `## ${X} — STANDARD\n\n${fetaReaktioner(stdText)}\n\n---\n`;
    if (fordj) {
      const fd = fordj[i]; if (fd.nr !== u.nr) throw new Error('underdelsnummer stämmer inte');
      ut += `\n## ${X} — FÖRDJUPNING\n\n### ${fd.titel}\n\n${fetaReaktioner(fd.text)}\n\n---\n`;
    }
  }
  fs.writeFileSync(path.join(UT, `avsnitt-${N}.md`), ut);
  // kontrollräkning (ordern §0): underdelar, mellanrubriker per underdel, bilder per underdel och typ
  const perU = under.map(u => u.rubriker), bilderPerU = under.map(u => specar.filter(s => s.underdel === BOK[u.nr - 1]).length);
  const svg = specar.filter(s => s.fil.endsWith('.svg')).length;
  console.log(`bygg/avsnitt-${N}.md: ${titel} | nivåer: ${enkel ? 'Enkel + ' : ''}Standard${fordj ? ' + Fördjupning' : ''} | kärnpunkter: ${Object.keys(KP).length ? 'ja' : 'nej'} | knapptitlar: ${Object.keys(KORT).length ? 'ur knapptitlar-och-ingresser.md' : 'långa rubriker (provisoriskt)'}`);
  console.log(`   underdelar ${under.length} | mellanrubriker ${perU.reduce((a, b) => a + b, 0)} (${perU.join(' + ')}) | bilder ${specar.length} (${bilderPerU.join(' + ')}) = ${svg} SVG + ${specar.length - svg} AI`);
  specar.forEach(s => console.log(`   ${s.fil} (${s.underdel}) standard-ankare: "${s.ankareStandard.slice(0, 70)}"`));
}

// ---------- Öva (arbetsorder 6, 2026-09-16): flipcards.md → bygg/flipcards.md; kortsvar.md → bygg/kortsvar.md när den finns ----------
// Samma leveransformat som Kolatomen (satt-ihop-kolatomen.js): "# Avsnitt N — Titel", "## Begreppskort, grundlaggande" osv.,
// "**N. Term**" + definition (+ "**[formel]**", "*Bankformulering:* **Bankterm** — text"). Leveransens italic-noter
// "*Kontrollera mot banken …*" tas bort. Begreppskortens framsida = termen, baksida = definitionen.
if (finns('flipcards.md')) {
  const fc = norm('flipcards.md');
  const TITLAR = {}; for (const N of [1, 2, 3, 4]) { if (finns(`avsnitt-${N}.md`)) TITLAR[N] = norm(`avsnitt-${N}.md`).match(/^# Avsnitt \d — ([^\n]+)/)[1].trim(); }
  let fut = `# Flipcards — delkapitel Kolväten (byggfil)\n\n> Sammansatt av verktyg/satt-ihop-kolvaten.js ur flipcards.md – redigera inte här.\n> Framsidan på begreppskorten är termen; baksidan definitionen. Bankformuleringar under Begreppsbanken.\n`;
  const bankRader = []; const fcAntal = { b: 0, m: 0, bg: 0, bf: 0, mg: 0, mf: 0, formel: 0 }; const perAvsnitt = {};
  for (const a of fc.matchAll(/\n# Avsnitt (\d)(?: — [^\n]*)?\n([\s\S]*?)(?=\n# Avsnitt |\n---\n\n## Att kontrollera|$)/g)) {
    const N = +a[1]; let ut = ''; let nb = 0, nm = 0; perAvsnitt[N] = { bg: 0, bf: 0, mg: 0, mf: 0 };
    for (const s of a[2].matchAll(/\n## (Begreppskort|Modellkort), (grundlaggande|fordjupning)\n([\s\S]*?)(?=\n## |\n---|$)/g)) {
      const typ = s[1], niva = s[2] === 'grundlaggande' ? 'grundläggande' : 'fördjupning';
      ut += `\n## ${typ} — ${niva}\n\n`;
      const block = s[3].replace(/^\*Kontrollera mot banken[^\n]*\*\s*$/gm, '');
      for (const k of block.matchAll(/\*\*(\d+)\. ([^*]+)\*\*\n([\s\S]*?)(?=\n\n\*\*\d+\. |\n*$(?![\s\S]))/g)) {
        const titel = k[2].replace(/\n/g, ' ').trim(); let kropp = k[3].trim();
        const formel = /\*\*\[formel\]\*\*/.test(kropp); kropp = kropp.replace(/\n?\*\*\[formel\]\*\*/, '');
        const bm = kropp.match(/\n?\*Bankformulering:\* \*\*([^*]+)\*\* — ([\s\S]*)$/);
        if (bm) { kropp = kropp.slice(0, bm.index).trim(); bankRader.push({ titel, term: bm[1].trim(), def: bm[2].replace(/\s*\n\s*/g, ' ').trim() }); }
        const svar = kropp.replace(/\s*\n\s*/g, ' ').trim();
        const nyckel = (typ === 'Begreppskort' ? 'b' : 'm') + (s[2] === 'grundlaggande' ? 'g' : 'f');
        if (typ === 'Begreppskort') { nb++; fcAntal.b++; } else { nm++; fcAntal.m++; }
        fcAntal[nyckel]++; perAvsnitt[N][nyckel]++;
        if (formel) fcAntal.formel++;
        ut += `**${titel}**${formel ? ' [formel]' : ''}\nF: ${titel}\nS: ${svar}\n\n`;
      }
    }
    fut += `\n---\n\n# AVSNITT ${N} — ${TITLAR[N]}\n**${nb + nm} kort:** ${nb} begreppskort, ${nm} modellkort\n${ut}`;
  }
  fut += `\n---\n\n## Begreppsbanken\n\nEndast grundläggande begreppskort. Bankformuleringar (kortets term → bankterm) ur leveransen:\n\n`;
  for (const b of bankRader) { fut += `**${b.titel}** → **${b.term}** — ${b.def}\n\n`; }
  fs.writeFileSync(path.join(UT, 'flipcards.md'), fut);
  console.log(`bygg/flipcards.md: ${fcAntal.b + fcAntal.m} kort = begrepp ${fcAntal.b} (grund ${fcAntal.bg}, fördj ${fcAntal.bf}) + modell ${fcAntal.m} (grund ${fcAntal.mg}, fördj ${fcAntal.mf}); [formel] ${fcAntal.formel}; bankformuleringar ${bankRader.length}`);
  console.log('   per avsnitt: ' + Object.entries(perAvsnitt).map(([N, p]) => `A${N} ${p.bg}+${p.bf}+${p.mg}+${p.mf}=${p.bg + p.bf + p.mg + p.mf}`).join(' | '));
}

// ---------- kortsvar (arbetsorder 7, 2026-09-16): kortsvar.md → bygg/kortsvar.md, blockform (KEMI-TILLAGG §8) ----------
// "**N.** `typ`" + fråga (+ "A) … D) …") + "**Svar:**" + "*Förklaring:*" → "## kN-sn · typ" med F/A/S/E. Formelsvar som
// \ce-inmatning (ceify); reaktioner godtar samma varianter som Kolatomen (->, →, märkt pil); ord med "(x)" → alternativ.
// Allmän formel som svar (fråga 32, CₙH₂ₙ): första alternativet är mhchem-formen C_{$n$}H_{$2n$} (facit renderar 2n nedsänkt
// med kursivt n – kontrollerat 2026-09-16), andra alternativet den skrivbara formen CnH2n som rättningen jämför mot.
if (finns('kortsvar.md')) {
  const { ceify, arAllmanFormel } = require('./lib-notation.js');
  const SUBN = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9', 'ₙ': 'n', '₊': '+', '₋': '-' };
  const allmanCe = t => t.replace(/([A-Z][a-z]?)([₀-₉ₙ₊₋]*)/g, (_, el, ix) => el + (ix ? `_{$${[...ix].map(c => SUBN[c]).join('')}$}` : ''));
  const allmanPlain = t => t.replace(/[₀-₉ₙ₊₋]/g, c => SUBN[c]);
  const ks = norm('kortsvar.md');
  const TITLAR = {}; for (const N of [1, 2, 3, 4]) { if (finns(`avsnitt-${N}.md`)) TITLAR[N] = norm(`avsnitt-${N}.md`).match(/^# Avsnitt \d — ([^\n]+)/)[1].trim(); }
  let kut = `# Kortsvar — delkapitel Kolväten (byggfil)\n\n> Sammansatt av verktyg/satt-ihop-kolvaten.js ur kortsvar.md – redigera inte här. Blockform (KEMI-TILLAGG §8).\n`;
  const ksAntal = {}, perAvsnitt = {};
  for (const a of ks.matchAll(/\n# Avsnitt (\d)(?: — [^\n]*)?\n([\s\S]*?)(?=\n# Avsnitt |\n---\n\n## Att kontrollera|$)/g)) {
    const N = +a[1]; let n = 0; perAvsnitt[N] = {};
    kut += `\n---\n\n# AVSNITT ${N} — ${TITLAR[N]}\nantal_per_omgang: 10\n`;
    for (const q of a[2].matchAll(/\*\*(\d+)\.\*\* `([a-z-]+)`\n([\s\S]*?)\n\*\*Svar:\*\* ([^\n]+)\n\*Förklaring:\* ([\s\S]*?)(?=\n\n\*\*\d+\.\*\*|\n*$(?![\s\S]))/g)) {
      n++; const typ = q[2], svarRaa = q[4].trim(), forkl = q[5].replace(/\s*\n\s*/g, ' ').trim();
      let ftext = q[3].replace(/\s*\n\s*/g, ' ').trim(); let alt = null;
      if (typ === 'flerval') { const i = ftext.search(/\sA\) /); if (i < 0) throw new Error(`fråga ${q[1]}: alternativ saknas`); alt = ftext.slice(i).trim().split(/\s*[A-D]\)\s*/).filter(Boolean).map(x => x.trim()); ftext = ftext.slice(0, i).trim(); if (alt.length !== 4) throw new Error(`fråga ${q[1]}: ${alt.length} alternativ`); }
      let S;
      if (typ === 'flerval') { S = String('ABCD'.indexOf(svarRaa)); if (S === '-1') throw new Error(`fråga ${q[1]}: svar ${svarRaa}`); }
      else if (typ === 'formel' && arAllmanFormel(svarRaa)) { S = `${allmanCe(svarRaa)} | ${allmanPlain(svarRaa)}`; }
      else if (typ === 'formel') { const c = ceify(svarRaa); S = /->/.test(c) ? [...new Set([c, c.replace(/->\[[^\]]+\]/, '->'), c.replace(/->\[[^\]]+\]|->/, '→'), c.replace(/->(\[[^\]]+\])/, '→$1')])].join(' | ') : c; }
      else if (typ === 'ord') { const m = svarRaa.match(/^(.+?) \((.+)\)$/); S = m ? `${m[1]} | ${m[2]}` : svarRaa; }
      else { S = svarRaa; }
      ksAntal[typ] = (ksAntal[typ] || 0) + 1; perAvsnitt[N][typ] = (perAvsnitt[N][typ] || 0) + 1;
      kut += `\n## k${N}-s${n} · ${typ}\nF: ${ftext}\n${alt ? 'A: ' + alt.join(' | ') + '\n' : ''}S: ${S}\nE: ${forkl}\n`;
    }
    if (n !== 12) throw new Error(`kortsvar avsnitt ${N}: ${n} frågor`);
  }
  fs.writeFileSync(path.join(UT, 'kortsvar.md'), kut);
  const tot = Object.values(ksAntal).reduce((a, b) => a + b, 0);
  console.log(`bygg/kortsvar.md: ${tot} frågor ${JSON.stringify(ksAntal)} | per avsnitt: ${Object.entries(perAvsnitt).map(([N, p]) => `A${N} ${Object.values(p).reduce((a, b) => a + b, 0)} (${['tal', 'ord', 'formel', 'flerval'].map(t => p[t] || 0).join('/')})`).join(', ')}`);
}
