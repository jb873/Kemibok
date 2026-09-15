// satt-ihop-kolatomen.js – sätter ihop byggfiler för Organisk kemi 1 "Kolatomen" ur leveransens egna format:
//   doc/leveranser/kolatomen/avsnitt-N.md                  (Standard: "## N.X Titel", "### rubrik", bildrutor som "> **Bild A…**")
//   doc/leveranser/kolatomen/avsnitt-N-enkel-fordjupning.md ("# 📗 ENKEL" / "# 📕 FÖRDJUPNING" med "## N.X Titel")
// → doc/leveranser/kolatomen/bygg/avsnitt-N.md i bygg-avsnitt.js-format (UNDERDEL / X — ENKEL / STANDARD / FÖRDJUPNING
//   + BILDSPECIFIKATIONER ur bildrutorna). Leveransfilerna rörs inte. Kör: node verktyg/satt-ihop-kolatomen.js, sedan
//   node verktyg/bygg-avsnitt.js kolatomen N.
// Regler (arbetsorder 2, 2026-09-15): kärnpunkter saknas tills order 3 (byggaren utelämnar blocket); Enkel behåller sina
// fler mellanrubriker; Fördjupningens egen underdelsrubrik blir första mellanrubrik; "**Om modellen.**" är ett vanligt
// stycke med fet inledning (samma som Syror och baser); anteckningsrader (*ca N ord*, *…undantaget…*, "Djupdykning
// härifrån", blockcitat-noter "> …") tas bort; avsnittets inledning (före "## N.1") läggs som Standard-inledning i underdel A (rapporterat).
// Fristående reaktionsrader utan fetstil fetmarkeras så att byggaren gör display-formler av dem.
'use strict';
const fs = require('fs'), path = require('path');
const { arReaktion } = require('./lib-notation.js');
const R = path.join(__dirname, '..', 'doc', 'leveranser', 'kolatomen');
const UT = path.join(R, 'bygg');
fs.mkdirSync(UT, { recursive: true });
const norm = f => fs.readFileSync(path.join(R, f), 'utf8').replace(/\r\n/g, '\n');
// slug per avsnitt (Code, godkända 2026-09-15); hero-underrubriker, knapptitlar och Enkel-ingresser ur knapptitlar-och-ingresser.md (Joachim)
const SLUG = { 1: 'kol-bildar-fler-foreningar', 2: 'samma-kolatomer-olika-amnen', 3: 'kol-mellan-luften-och-det-levande' };
const KI = norm('knapptitlar-och-ingresser.md');
const KORT = Object.fromEntries([...KI.matchAll(/^\| (\d)\.(\d) \| ([^|]+) \|$/gm)].map(m => [m[1] + '.' + m[2], m[3].trim()]));
const SUB = Object.fromEntries([...KI.matchAll(/^\| (\d) \| ([^|]+) \|$/gm)].map(m => [m[1], m[2].trim()]));
const INGRESS = Object.fromEntries([...KI.matchAll(/### Avsnitt (\d)\n\n([\s\S]*?)(?=\n\n###|\n\n## |$)/g)].map(m => [m[1], m[2].trim()]));
if (Object.keys(KORT).length !== 9 || Object.keys(SUB).length !== 3 || Object.keys(INGRESS).length !== 3) throw new Error(`knapptitlar-och-ingresser.md: ${Object.keys(KORT).length} knapptitlar, ${Object.keys(SUB).length} underrubriker, ${Object.keys(INGRESS).length} ingresser`);
const BOK = ['A', 'B', 'C'];
const rensa = t => t.split('\n').filter(l => !/^> /.test(l) && !/^\*ca \d+ ord\*$/.test(l.trim()) && !/^\*[^*]+undantaget[^*]*\*$/.test(l.trim()) && !/^\*\*Djupdykning härifrån:\*\*/.test(l)).join('\n')
  .replace(/\n{3,}/g, '\n\n').trim();
// fristående reaktionsrad (egen paragraf, ingen fetstil) → **…** så att bygg-avsnitt gör en display-formel
const fetaReaktioner = t => t.split(/\n\n+/).map(p => (!/\n/.test(p) && !/\*\*/.test(p) && arReaktion(p.trim())) ? `**${p.trim()}**` : p).join('\n\n');
let totalt = { enkel: 0, fordj: 0, omModellen: 0, bilder: 0 };
for (const N of [1, 2, 3]) {
  const std = norm(`avsnitt-${N}.md`), ef = norm(`avsnitt-${N}-enkel-fordjupning.md`);
  const titel = std.match(/^# Avsnitt \d — ([^\n]+)/)[1].trim();
  const intro = rensa(std.slice(std.indexOf('\n') + 1, std.search(/\n---\n/)));
  // Standard-underdelar
  const under = [...std.matchAll(/\n## (\d)\.(\d) ([^\n]+)\n([\s\S]*?)(?=\n## \d\.\d |$)/g)].map(m => ({ nr: +m[2], titel: m[3].trim(), text: m[4] }));
  if (under.length !== 3) throw new Error(`avsnitt ${N}: ${under.length} underdelar i Standard`);
  // bildrutor → bildspec + ankare (stycket före rutan)
  const specar = [];
  for (const u of under) {
    const delar = u.text.split(/\n(?=> \*\*Bild A\d+)/);
    let text = delar[0];
    for (const d of delar.slice(1)) {
      const ruta = d.match(/^((?:>[^\n]*\n?)+)/)[1]; const rest = d.slice(ruta.length);
      const k = ruta.split('\n').map(l => l.replace(/^> ?/, '')).join('\n');
      const h = k.match(/^\*\*Bild (A\d+) — ([^*]+)\*\* \(([^)]+)\)/);
      const f = (rub) => { const x = k.match(new RegExp('\\*\\*' + rub + ':\\*\\* ([\\s\\S]*?)(?=\\n\\n|\\n\\*\\*|$)')); return x[1].replace(/\s*\n\s*/g, ' ').trim(); };
      const punkter = [...k.matchAll(/^- (.+)$/gm)].map(x => x[1].trim());
      const fil = 'k1-' + h[1].toLowerCase() + (h[3].startsWith('AI') ? '.webp' : '.svg');
      // ankare: sista raden i stycket före rutan
      const fore = text.trim().split(/\n\n+/).pop().split('\n').pop().trim();
      specar.push({ fil, underdel: BOK[u.nr - 1], namn: h[2].trim(), alt: f('Alt'), enkel: f('Bildtext Enkel'), standard: f('Bildtext Standard'), punkter, ankareStandard: fore });
      text += rest;
    }
    u.text = rensa(text);
  }
  totalt.bilder += specar.length;
  // Enkel och Fördjupning
  const enkelDel = ef.match(/\n# 📗 ENKEL\n([\s\S]*?)\n# 📕 FÖRDJUPNING\n/)[1], fordjDel = ef.match(/\n# 📕 FÖRDJUPNING\n([\s\S]*)$/)[1];
  const dela = del => [...del.matchAll(/\n## (\d)\.(\d) ([^\n]+)\n([\s\S]*?)(?=\n## \d\.\d |$)/g)].map(m => ({ nr: +m[2], titel: m[3].trim(), text: rensa(m[4].replace(/\n---\s*$/, '')) }));
  const enkel = dela(enkelDel), fordj = dela(fordjDel);
  if (enkel.length !== 3 || fordj.length !== 3) throw new Error(`avsnitt ${N}: ${enkel.length} enkel, ${fordj.length} fördjupning`);
  fordj.forEach(u => { if (!/\*\*Om modellen\.\*\*/.test(u.text)) throw new Error(`avsnitt ${N}.${u.nr}: "Om modellen" saknas`); totalt.omModellen++; });
  totalt.enkel += enkel.length; totalt.fordj += fordj.length;
  // byggfil
  let ut = `# Kolatomen, avsnitt ${N} — ${titel}
## Byggfil, sammansatt av verktyg/satt-ihop-kolatomen.js ur avsnitt-${N}.md och avsnitt-${N}-enkel-fordjupning.md – redigera inte här

**Sökväg:** \`kapitel/organisk-kemi/delkapitel/kolatomen/avsnitt-${N}-${SLUG[N]}.html\`
**AVSNITT_ID:** \`a${N}_${SLUG[N]}\`
**Underrubrik i hero:** ${SUB[N]}

---

## BILDSPECIFIKATIONER

`;
  for (const s of specar) {
    ut += `### \`${s.fil}\` — underdel ${s.underdel}, alla nivåer\n\n${s.namn}. Placering enligt bildrutan i avsnitt-${N}.md.\n\n**Alt-text:** ${s.alt}\n\n**Bildtext Enkel:** ${s.enkel}\n\n**Bildtext Standard:** ${s.standard}\n\n### Bildguide (endast Enkel)\n${s.punkter.map(p => '- ' + p).join('\n')}\n\n`;
  }
  ut += '---\n';
  for (let i = 0; i < 3; i++) {
    const X = BOK[i], u = under[i], e = enkel[i], fd = fordj[i];
    if (e.nr !== u.nr || fd.nr !== u.nr) throw new Error('underdelsnummer stämmer inte');
    // ingress (bara underdel A: Standard ur avsnitt-N.md, Enkel ur Joachims leverans), sedan den långa rubriken som första mellanrubrik
    const stdText = (i === 0 && intro ? intro + '\n\n' : '') + '### ' + u.titel + '\n\n' + u.text;
    const enkelText = (i === 0 ? INGRESS[String(N)] + '\n\n' : '') + '### ' + e.titel + '\n\n' + e.text;
    const kort = KORT[N + '.' + u.nr]; if (!kort) throw new Error('knapptitel saknas för ' + N + '.' + u.nr);
    ut += `\n# UNDERDEL ${X} — ${kort}\n\n---\n\n## ${X} — ENKEL\n\n${fetaReaktioner(enkelText)}\n\n---\n\n## ${X} — STANDARD\n\n${fetaReaktioner(stdText)}\n\n---\n\n## ${X} — FÖRDJUPNING\n\n### ${fd.titel}\n\n${fetaReaktioner(fd.text)}\n\n---\n`;
  }
  fs.writeFileSync(path.join(UT, `avsnitt-${N}.md`), ut);
  console.log(`bygg/avsnitt-${N}.md: ${titel} | underdelar ${under.map(u => u.titel.slice(0, 30) + '…').join(' / ')} | bilder ${specar.map(s => s.fil + '@' + s.underdel).join(', ')}`);
  specar.forEach(s => console.log(`   ${s.fil} standard-ankare: "${s.ankareStandard.slice(0, 70)}"`));
}
console.log(`Enkel ${totalt.enkel} + Fördjupning ${totalt.fordj} = ${totalt.enkel + totalt.fordj} texter | "Om modellen" ${totalt.omModellen} | bilder ${totalt.bilder}`);
