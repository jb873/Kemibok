// rensa-fossila.js – tar fram leveransfilerna för Organisk kemi 3 "Fossila bränslen och förbränning" ur Joachims
// arbetsfiler (doc/leveranser/fossila-branslen/original/, arbetsorder 2026-09-16):
//   dk3-avsnitt-1-bearbetad.md, dk3-avsnitt-2-3-4-utkast.md, dk3-avsnitt-5-bearbetad.md  → avsnitt-1.md … avsnitt-5.md
//   dk3-avsnitt-1-2-/3-4-/5-enkel-fordjupning.md                                          → avsnitt-N-enkel-fordjupning.md
// Standard: texten fram till kommentarsrubrikerna (# Vad som ströks / # Vad som flyttades till bild / # Anteckningar /
// # ▸-tillägg / # Bilder som avsnittet behöver / # En anmärkning) tas med; allt därefter är anteckningar. Filen med tre
// avsnitt delas vid "# Avsnitt N". Arbetsfilens huvud före första avsnittet skalas bort; "## Avsnittsingress" blir
// avsnittets inledning (före ---). ▸-märkningarna tas bort (meningarna behålls, Joachims stående beslut).
// Nivåfiler: huvudet före "# 📗 ENKEL" skalas bort, avsnitten delas per underdelsnummer.
// Skriver ordantal per underdel och nivå (ordern §0: kontroll att inget följt med eller fallit bort).
// Kör: node verktyg/rensa-fossila.js
'use strict';
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..', 'doc', 'leveranser', 'fossila-branslen'), O = path.join(R, 'original');
const las = f => fs.readFileSync(path.join(O, f), 'utf8').replace(/\r\n/g, '\n');
const STOPP = /\n# (Vad som ströks|Vad som flyttades till bild|Anteckningar|▸-tillägg|Bilder som avsnittet behöver|En anmärkning)/;
const ord = t => t.replace(/^#+ .*$/gm, '').replace(/[*_▸|]/g, '').split(/\s+/).filter(Boolean).length;
const rad = [];
// ---- Standard ----
const std = {};
for (const f of ['dk3-avsnitt-1-bearbetad.md', 'dk3-avsnitt-2-3-4-utkast.md', 'dk3-avsnitt-5-bearbetad.md']) {
  let t = las(f);
  const s = t.search(STOPP); if (s > 0) { t = t.slice(0, s); }
  for (const m of t.matchAll(/(?:^|\n)# Avsnitt (\d) — ([^\n]+)\n([\s\S]*?)(?=\n# Avsnitt \d|$)/g)) {
    const N = +m[1], titel = m[2].trim(); let kropp = m[3];
    // arbetsfilens huvudnot (bearbetad-filerna: "Bearbetad. Allt tillagt …", "Utgångsläge …") före ## Avsnittsingress
    kropp = kropp.slice(kropp.indexOf('## Avsnittsingress'));
    const ingress = kropp.match(/## Avsnittsingress\n([\s\S]*?)\n---\n/)[1].trim();
    const rest = kropp.slice(kropp.indexOf('\n---\n', kropp.indexOf('## Avsnittsingress')) + 5);
    let ut = `# Avsnitt ${N} — ${titel}\n\n> Ur ${f} (verktyg/rensa-fossila.js): texten fram till kommentarsrubrikerna, ▸ borttagna.\n\n${ingress}\n\n---\n\n${rest.trim()}\n`;
    ut = ut.replace(/▸\s?/g, '').replace(/\n{3,}/g, '\n\n').replace(/\n---\s*$/, '\n');
    std[N] = ut;
    fs.writeFileSync(path.join(R, `avsnitt-${N}.md`), ut);
    const under = [...ut.matchAll(/\n## (\d\.\d) [^\n]*\n([\s\S]*?)(?=\n## \d\.\d |\n---\s*$|$)/g)];
    for (const u of under) { rad.push(`${u[1]} Standard ${ord(u[2].replace(/\*ca \d+ ord\*/g, ''))}`); }
  }
}
// ---- Enkel + Fördjupning ----
for (const f of ['dk3-avsnitt-1-2-enkel-fordjupning.md', 'dk3-avsnitt-3-4-enkel-fordjupning.md', 'dk3-avsnitt-5-enkel-fordjupning.md']) {
  const t = las(f);
  const enkel = t.match(/\n# 📗 ENKEL\n([\s\S]*?)\n# 📕 FÖRDJUPNING\n/)[1], fordj = t.match(/\n# 📕 FÖRDJUPNING\n([\s\S]*)$/)[1];
  const dela = del => [...del.matchAll(/\n## (\d)\.(\d) ([^\n]+)\n([\s\S]*?)(?=\n## \d\.\d |$)/g)].map(m => ({ N: +m[1], nr: +m[2], titel: m[3].trim(), text: m[4].replace(/\n---\s*$/, '').trim() }));
  const E = dela(enkel), F = dela(fordj);
  for (const N of [...new Set(E.map(x => x.N))]) {
    const e = E.filter(x => x.N === N), fd = F.filter(x => x.N === N);
    let ut = `# Fossila bränslen, avsnitt ${N} — Enkel och Fördjupning\n\n> Ur ${f} (verktyg/rensa-fossila.js): huvudet skalat, avsnittet utplockat.\n\n---\n\n# 📗 ENKEL\n\n`;
    for (const u of e) { ut += `## ${N}.${u.nr} ${u.titel}\n\n${u.text}\n\n---\n\n`; rad.push(`${N}.${u.nr} Enkel ${ord(u.text.replace(/\*ca \d+ ord\*/g, ''))}`); }
    ut += `# 📕 FÖRDJUPNING\n\n`;
    for (const u of fd) { ut += `## ${N}.${u.nr} ${u.titel}\n\n${u.text}\n\n---\n\n`; rad.push(`${N}.${u.nr} Fördjupning ${ord(u.text)}`); }
    fs.writeFileSync(path.join(R, `avsnitt-${N}-enkel-fordjupning.md`), ut.replace(/\n---\n\n$/, '\n'));
  }
}
// ordantal per underdel och nivå
const tab = {};
for (const r of rad) { const [u, n, o] = r.split(' '); (tab[u] = tab[u] || {})[n] = +o; }
console.log('underdel  Enkel  Standard  Fördjupning');
for (const u of Object.keys(tab).sort()) { console.log(`${u}       ${String(tab[u].Enkel || '-').padStart(5)}  ${String(tab[u].Standard || '-').padStart(8)}  ${String(tab[u]['Fördjupning'] || '-').padStart(11)}`); }
console.log(`${Object.keys(tab).length} underdelar; skrivna: avsnitt-1..5.md, avsnitt-1..5-enkel-fordjupning.md`);
