// rensa-livets-molekyler.js – tar fram leveransfilerna för Organisk kemi 6 "Livets molekyler" ur Joachims arbetsfiler
// (doc/leveranser/livets-molekyler/original/, arbetsorder 2026-09-19):
//   dk6-avsnitt-1-bearbetad.md, dk6-avsnitt-2-3-4-bearbetade.md → avsnitt-1.md … avsnitt-4.md (Standard; texten fram till första
//                                          kommentarsrubriken "# Vad som ströks" / "# Två nivåkrockar…" / "# Vad som flyttades till bild";
//                                          filen med tre avsnitt delas vid "# Avsnitt N", huvudet skalas bort)
//   "## Delkapitlets ingress" i avsnitt 1-filen → delkapitel-ingress.md (till delkapitelindexet, inte till avsnitt 1)
//   dk6-avsnitt-N-enkel-fordjupning.md  → avsnitt-N-enkel-fordjupning.md (huvudet skalat; "## Avsnittsingress" i Enkel = Enkel-ingress)
//   karnpunkter-livets-molekyler.md     → karnpunkter.md (kopia, kontrollräknad 12 × 5 = 60)
//   flipcards-livets-molekyler.md       → flipcards.md (kopia), kortsvar-livets-molekyler.md → kortsvar.md (kopia)
//   djupdykning-laktos.md               → djupdykning-laktos.md (kopia) + djupdykningar.md (registret i Syror-form)
// ▸-märkningarna tas bort (meningarna behålls, Joachims stående beslut). Skriver ordantal per underdel och nivå.
// Kör: node verktyg/rensa-livets-molekyler.js
'use strict';
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..', 'doc', 'leveranser', 'livets-molekyler'), O = path.join(R, 'original');
const finns = f => fs.existsSync(path.join(O, f));
const las = f => fs.readFileSync(path.join(O, f), 'utf8').replace(/\r\n/g, '\n');
const STOPP = /\n# (Vad som ströks|Vad som flyttades till bild|Två nivåkrockar att besluta om|Anteckningar|▸-tillägg|Bilder som avsnitte[nt] behöver|En anmärkning|En strukturändring|En rättelse|En nivåanmärkning)/;
const ord = t => t.replace(/^#+ .*$/gm, '').replace(/[*_▸|]/g, '').split(/\s+/).filter(Boolean).length;
const rad = [];
// ---- Standard ----
for (const f of ['dk6-avsnitt-1-bearbetad.md', 'dk6-avsnitt-2-3-4-bearbetade.md']) {
  if (!finns(f)) { console.log(`SAKNAS: original/${f}`); continue; }
  let t = las(f);
  const s = t.search(STOPP); if (s > 0) { t = t.slice(0, s); }
  // delkapitlets ingress (avsnitt 1-filen, före avsnittsingressen) → egen fil, tas bort ur avsnittstexten
  const di = t.match(/\n## Delkapitlets ingress\n([\s\S]*?)\n---\n/);
  if (di) { fs.writeFileSync(path.join(R, 'delkapitel-ingress.md'), `# Delkapitlets ingress — Livets molekyler\n\n> Ur ${f} (verktyg/rensa-livets-molekyler.js), till delkapitelindexet (ordern 2026-09-19 §0).\n\n${di[1].trim()}\n`); t = t.replace(di[0], '\n'); rad.push(`0.0 Delkapitel-ingress ${ord(di[1])}`); }
  for (const m of t.matchAll(/(?:^|\n)# Avsnitt (\d) — ([^\n]+)\n([\s\S]*?)(?=\n# Avsnitt \d|$)/g)) {
    const N = +m[1], titel = m[2].trim(); let kropp = m[3];
    if (!/## Avsnittsingress/.test(kropp)) throw new Error(`avsnitt ${N}: ## Avsnittsingress saknas`);
    kropp = kropp.slice(kropp.indexOf('## Avsnittsingress'));
    const ingress = kropp.match(/## Avsnittsingress\n([\s\S]*?)\n---\n/)[1].trim();
    const rest = kropp.slice(kropp.indexOf('\n---\n', kropp.indexOf('## Avsnittsingress')) + 5);
    let ut = `# Avsnitt ${N} — ${titel}\n\n> Ur ${f} (verktyg/rensa-livets-molekyler.js): texten fram till kommentarsrubrikerna, ▸ borttagna.\n\n${ingress}\n\n---\n\n${rest.trim()}\n`;
    ut = ut.replace(/▸\s?/g, '').replace(/\n{3,}/g, '\n\n').replace(/\n---\s*$/, '\n');
    fs.writeFileSync(path.join(R, `avsnitt-${N}.md`), ut);
    const under = [...ut.matchAll(/\n## (\d\.\d) [^\n]*\n([\s\S]*?)(?=\n## \d\.\d |\n---\s*$|$)/g)];
    if (under.length !== 3) throw new Error(`avsnitt ${N}: ${under.length} underdelar`);
    for (const u of under) { rad.push(`${u[1]} Standard ${ord(u[2].replace(/\*ca \d+ ord[^*]*\*/g, '').replace(/^\*Fyra rubriker[^\n]*$/gm, ''))}`); }
  }
}
// ---- Enkel + Fördjupning ----
for (const N of [1, 2, 3, 4]) {
  const f = `dk6-avsnitt-${N}-enkel-fordjupning.md`;
  if (!finns(f)) { console.log(`SAKNAS: original/${f}`); continue; }
  const t = las(f);
  const enkel = t.match(/\n# 📗 ENKEL\n([\s\S]*?)\n# 📕 FÖRDJUPNING\n/)[1], fordj = t.match(/\n# 📕 FÖRDJUPNING\n([\s\S]*)$/)[1];
  const ing = enkel.match(/## Avsnittsingress\n([\s\S]*?)\n---\n/);
  const dela = del => [...del.matchAll(/\n## (\d)\.(\d) ([^\n]+)\n([\s\S]*?)(?=\n## \d\.\d |$)/g)].map(m => ({ N: +m[1], nr: +m[2], titel: m[3].trim(), text: m[4].replace(/\n---\s*$/, '').replace(/▸\s?/g, '').trim() }));
  const E = dela(enkel), F = dela(fordj);
  if (E.length !== 3 || F.length !== 3 || E.some(x => x.N !== N) || F.some(x => x.N !== N)) throw new Error(`${f}: ${E.length} Enkel, ${F.length} Fördjupning`);
  let ut = `# Livets molekyler, avsnitt ${N} — Enkel och Fördjupning\n\n> Ur ${f} (verktyg/rensa-livets-molekyler.js): huvudet skalat. Avsnittsingressen under ENKEL är Enkel-ingressen (levererad i samma fil).\n\n---\n\n# 📗 ENKEL\n\n`;
  if (ing) { ut += `## Avsnittsingress\n\n${ing[1].trim()}\n\n---\n\n`; rad.push(`${N}.0 Enkel-ingress ${ord(ing[1])}`); }
  for (const u of E) { ut += `## ${N}.${u.nr} ${u.titel}\n\n${u.text}\n\n---\n\n`; rad.push(`${N}.${u.nr} Enkel ${ord(u.text.replace(/\*ca \d+ ord[^*]*\*/g, ''))}`); }
  ut += `# 📕 FÖRDJUPNING\n\n`;
  for (const u of F) { if (!/\*\*Om modellen\.\*\*/.test(u.text)) throw new Error(`${N}.${u.nr} Fördjupning: "Om modellen" saknas`); ut += `## ${N}.${u.nr} ${u.titel}\n\n${u.text}\n\n---\n\n`; rad.push(`${N}.${u.nr} Fördjupning ${ord(u.text)}`); }
  fs.writeFileSync(path.join(R, `avsnitt-${N}-enkel-fordjupning.md`), ut.replace(/\n---\n\n$/, '\n'));
}
// ---- kärnpunkter, flipcards, kortsvar (kopior) ----
if (finns('karnpunkter-livets-molekyler.md')) {
  const k = las('karnpunkter-livets-molekyler.md');
  const block = [...k.matchAll(/\n### (\d)\.(\d) [^\n]+\n\n((?:- [^\n]+(?:\n|$))+)/g)];
  const n = block.reduce((a, b) => a + b[3].trim().split('\n').length, 0);
  if (block.length !== 12 || n !== 60) throw new Error(`karnpunkter-livets-molekyler.md: ${block.length} underdelar, ${n} punkter`);
  fs.writeFileSync(path.join(R, 'karnpunkter.md'), k.endsWith('\n') ? k : k + '\n');
  console.log(`karnpunkter.md: ${block.length} underdelar × 5 = ${n}`);
} else { console.log('SAKNAS: original/karnpunkter-livets-molekyler.md'); }
for (const [f, ut] of [['flipcards-livets-molekyler.md', 'flipcards.md'], ['kortsvar-livets-molekyler.md', 'kortsvar.md']]) {
  if (finns(f)) { fs.writeFileSync(path.join(R, ut), las(f)); console.log(`${ut}: kopia av ${f}`); } else { console.log(`SAKNAS: original/${f}`); }
}
// ---- djupdykning ----
if (finns('djupdykning-laktos.md')) {
  fs.writeFileSync(path.join(R, 'djupdykning-laktos.md'), las('djupdykning-laktos.md'));
  const reg = `# Djupdykningar — delkapitel Livets molekyler

> Register i Syror-form för verktyg/bygg-djupdykning.js (verktyg/rensa-livets-molekyler.js). Titel, underrubrik, ikon och korttext ur arbetsordern 2026-09-19; brödtexten i djupdykning-laktos.md (kopia av original/).

---

# 1. Enzymet som skulle ha slutat

**Länkas från:** avsnitt 1, underdel B

**Filnamn:** \`djupdykning-laktos.html\`

**Underrubrik:** *en bindning, ett enzym och ett stycke historia*

**Korttext:** Nästan alla däggdjur slutar tillverka laktas efter avvänjningen. Att kunna dricka mjölk som vuxen är undantaget — och förklaringen ligger både i en glykosidbindning och i att människor började hålla boskap.

**Brödtext:** djupdykning-laktos.md
`;
  fs.writeFileSync(path.join(R, 'djupdykningar.md'), reg);
  console.log('djupdykningar.md + djupdykning-laktos.md skrivna');
} else { console.log('SAKNAS: original/djupdykning-laktos.md'); }
// ordantal per underdel och nivå
const tab = {};
for (const r of rad) { const [u, n, o] = r.split(' '); (tab[u] = tab[u] || {})[n] = +o; }
console.log('underdel  Enkel  Standard  Fördjupning');
for (const u of Object.keys(tab).sort()) { console.log(`${u}       ${String(tab[u].Enkel || tab[u]['Enkel-ingress'] && `(ingress ${tab[u]['Enkel-ingress']})` || '-').padStart(5)}  ${String(tab[u].Standard || '-').padStart(8)}  ${String(tab[u]['Fördjupning'] || '-').padStart(11)}`); }
