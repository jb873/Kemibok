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
  3: { slug: 'samma-formel-olika-struktur', sub: 'isomerer, dubbel- och trippelbindningar, alkener och alkyner' }
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
