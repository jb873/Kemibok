// rensa-syror-estrar.js – tar fram leveransfilerna för Organisk kemi 5 "Organiska syror och estrar" ur Joachims arbetsfiler
// (doc/leveranser/syror-och-estrar/original/, arbetsorder 2026-09-18):
//   dk5-avsnitt-1-bearbetad.md, dk5-avsnitt-2-3-bearbetade.md → avsnitt-1.md … avsnitt-3.md (Standard; texten fram till
//                                          "# Vad som ströks"; filen med två avsnitt delas vid "# Avsnitt N", huvudet skalas bort)
//   dk5-avsnitt-N-enkel-fordjupning.md  → avsnitt-N-enkel-fordjupning.md (huvudet skalat; "## Avsnittsingress" i Enkel = Enkel-ingress)
//   karnpunkter-syror-estrar.md         → karnpunkter.md (kopia, kontrollräknad 9 × 5 = 45)
//   flipcards-syror-estrar.md           → flipcards.md (kopia), kortsvar-syror-estrar.md → kortsvar.md (kopia)
//   djupdykning-aspirin.md              → djupdykning-aspirin.md (kopia) + djupdykningar.md (registret i Syror-form)
// ▸-märkningarna tas bort (meningarna behålls, Joachims stående beslut). Skriver ordantal per underdel och nivå.
// Kör: node verktyg/rensa-syror-estrar.js
'use strict';
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..', 'doc', 'leveranser', 'syror-och-estrar'), O = path.join(R, 'original');
const finns = f => fs.existsSync(path.join(O, f));
const las = f => fs.readFileSync(path.join(O, f), 'utf8').replace(/\r\n/g, '\n');
const STOPP = /\n# (Vad som ströks|Vad som flyttades till bild|Anteckningar|▸-tillägg|Bilder som avsnitte[nt] behöver|En anmärkning|En strukturändring|En rättelse)/;
const ord = t => t.replace(/^#+ .*$/gm, '').replace(/[*_▸|]/g, '').split(/\s+/).filter(Boolean).length;
const rad = [];
// ---- Standard ----
for (const f of ['dk5-avsnitt-1-bearbetad.md', 'dk5-avsnitt-2-3-bearbetade.md']) {
  if (!finns(f)) { console.log(`SAKNAS: original/${f}`); continue; }
  let t = las(f);
  const s = t.search(STOPP); if (s > 0) { t = t.slice(0, s); }
  for (const m of t.matchAll(/(?:^|\n)# Avsnitt (\d) — ([^\n]+)\n([\s\S]*?)(?=\n# Avsnitt \d|$)/g)) {
    const N = +m[1], titel = m[2].trim(); let kropp = m[3];
    if (!/## Avsnittsingress/.test(kropp)) throw new Error(`avsnitt ${N}: ## Avsnittsingress saknas`);
    kropp = kropp.slice(kropp.indexOf('## Avsnittsingress'));
    const ingress = kropp.match(/## Avsnittsingress\n([\s\S]*?)\n---\n/)[1].trim();
    const rest = kropp.slice(kropp.indexOf('\n---\n', kropp.indexOf('## Avsnittsingress')) + 5);
    let ut = `# Avsnitt ${N} — ${titel}\n\n> Ur ${f} (verktyg/rensa-syror-estrar.js): texten fram till kommentarsrubrikerna, ▸ borttagna.\n\n${ingress}\n\n---\n\n${rest.trim()}\n`;
    ut = ut.replace(/▸\s?/g, '').replace(/\n{3,}/g, '\n\n').replace(/\n---\s*$/, '\n');
    fs.writeFileSync(path.join(R, `avsnitt-${N}.md`), ut);
    const under = [...ut.matchAll(/\n## (\d\.\d) [^\n]*\n([\s\S]*?)(?=\n## \d\.\d |\n---\s*$|$)/g)];
    if (under.length !== 3) throw new Error(`avsnitt ${N}: ${under.length} underdelar`);
    for (const u of under) { rad.push(`${u[1]} Standard ${ord(u[2].replace(/\*ca \d+ ord[^*]*\*/g, '').replace(/^\*Fyra rubriker[^\n]*$/gm, ''))}`); }
  }
}
// ---- Enkel + Fördjupning ----
for (const N of [1, 2, 3]) {
  const f = `dk5-avsnitt-${N}-enkel-fordjupning.md`;
  if (!finns(f)) { console.log(`SAKNAS: original/${f}`); continue; }
  const t = las(f);
  const enkel = t.match(/\n# 📗 ENKEL\n([\s\S]*?)\n# 📕 FÖRDJUPNING\n/)[1], fordj = t.match(/\n# 📕 FÖRDJUPNING\n([\s\S]*)$/)[1];
  const ing = enkel.match(/## Avsnittsingress\n([\s\S]*?)\n---\n/);
  const dela = del => [...del.matchAll(/\n## (\d)\.(\d) ([^\n]+)\n([\s\S]*?)(?=\n## \d\.\d |$)/g)].map(m => ({ N: +m[1], nr: +m[2], titel: m[3].trim(), text: m[4].replace(/\n---\s*$/, '').replace(/▸\s?/g, '').trim() }));
  const E = dela(enkel), F = dela(fordj);
  if (E.length !== 3 || F.length !== 3 || E.some(x => x.N !== N) || F.some(x => x.N !== N)) throw new Error(`${f}: ${E.length} Enkel, ${F.length} Fördjupning`);
  let ut = `# Organiska syror och estrar, avsnitt ${N} — Enkel och Fördjupning\n\n> Ur ${f} (verktyg/rensa-syror-estrar.js): huvudet skalat. Avsnittsingressen under ENKEL är Enkel-ingressen (levererad i samma fil).\n\n---\n\n# 📗 ENKEL\n\n`;
  if (ing) { ut += `## Avsnittsingress\n\n${ing[1].trim()}\n\n---\n\n`; rad.push(`${N}.0 Enkel-ingress ${ord(ing[1])}`); }
  for (const u of E) { ut += `## ${N}.${u.nr} ${u.titel}\n\n${u.text}\n\n---\n\n`; rad.push(`${N}.${u.nr} Enkel ${ord(u.text.replace(/\*ca \d+ ord[^*]*\*/g, ''))}`); }
  ut += `# 📕 FÖRDJUPNING\n\n`;
  for (const u of F) { if (!/\*\*Om modellen\.\*\*/.test(u.text)) throw new Error(`${N}.${u.nr} Fördjupning: "Om modellen" saknas`); ut += `## ${N}.${u.nr} ${u.titel}\n\n${u.text}\n\n---\n\n`; rad.push(`${N}.${u.nr} Fördjupning ${ord(u.text)}`); }
  fs.writeFileSync(path.join(R, `avsnitt-${N}-enkel-fordjupning.md`), ut.replace(/\n---\n\n$/, '\n'));
}
// ---- kärnpunkter, flipcards, kortsvar (kopior) ----
if (finns('karnpunkter-syror-estrar.md')) {
  const k = las('karnpunkter-syror-estrar.md');
  const block = [...k.matchAll(/\n### (\d)\.(\d) [^\n]+\n\n((?:- [^\n]+(?:\n|$))+)/g)];
  const n = block.reduce((a, b) => a + b[3].trim().split('\n').length, 0);
  if (block.length !== 9 || n !== 45) throw new Error(`karnpunkter-syror-estrar.md: ${block.length} underdelar, ${n} punkter`);
  fs.writeFileSync(path.join(R, 'karnpunkter.md'), k.endsWith('\n') ? k : k + '\n');
  console.log(`karnpunkter.md: ${block.length} underdelar × 5 = ${n}`);
} else { console.log('SAKNAS: original/karnpunkter-syror-estrar.md'); }
for (const [f, ut] of [['flipcards-syror-estrar.md', 'flipcards.md'], ['kortsvar-syror-estrar.md', 'kortsvar.md']]) {
  if (finns(f)) { fs.writeFileSync(path.join(R, ut), las(f)); console.log(`${ut}: kopia av ${f}`); } else { console.log(`SAKNAS: original/${f}`); }
}
// ---- djupdykning ----
if (finns('djupdykning-aspirin.md')) {
  fs.writeFileSync(path.join(R, 'djupdykning-aspirin.md'), las('djupdykning-aspirin.md'));
  const reg = `# Djupdykningar — delkapitel Organiska syror och estrar

> Register i Syror-form för verktyg/bygg-djupdykning.js (verktyg/rensa-syror-estrar.js). Titel, underrubrik, ikon och korttext ur arbetsordern 2026-09-18; brödtexten i djupdykning-aspirin.md (kopia av original/). Ordern: "texten säger att Hoffmann arbetade med problemet, inte att han ensam löste det … formuleringen ska inte ändras."

---

# 1. Barken som blev en tablett

**Länkas från:** avsnitt 2, underdel B

**Filnamn:** \`djupdykning-aspirin.html\`

**Underrubrik:** *en ester som skyddar magen*

**Korttext:** Pilbark har använts mot värk i fyra tusen år. När kemisterna till slut fick fram det verksamma ämnet visade det sig förstöra magen — tills någon förestrade det. Och sedan tog det sjuttio år att förstå varför det fungerade.

**Brödtext:** djupdykning-aspirin.md
`;
  fs.writeFileSync(path.join(R, 'djupdykningar.md'), reg);
  console.log('djupdykningar.md + djupdykning-aspirin.md skrivna');
} else { console.log('SAKNAS: original/djupdykning-aspirin.md'); }
// ordantal per underdel och nivå
const tab = {};
for (const r of rad) { const [u, n, o] = r.split(' '); (tab[u] = tab[u] || {})[n] = +o; }
console.log('underdel  Enkel  Standard  Fördjupning');
for (const u of Object.keys(tab).sort()) { console.log(`${u}       ${String(tab[u].Enkel || tab[u]['Enkel-ingress'] && `(ingress ${tab[u]['Enkel-ingress']})` || '-').padStart(5)}  ${String(tab[u].Standard || '-').padStart(8)}  ${String(tab[u]['Fördjupning'] || '-').padStart(11)}`); }
