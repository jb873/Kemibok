// rensa-alkoholer.js – tar fram leveransfilerna för Organisk kemi 4 "Alkoholer" ur Joachims arbetsfiler
// (doc/leveranser/alkoholer/original/, arbetsorder 2026-09-18):
//   dk4-bearbetade-texter.md            → avsnitt-1.md … avsnitt-3.md (Standard; texten fram till "# Vad som ströks")
//   dk4-omskrivet-och-bildspecar.md     → underdelarna 1.2 och 3.2 ersätts helt av de omskrivna versionerna (ordern §1)
//   dk4-avsnitt-N-enkel-fordjupning.md  → avsnitt-N-enkel-fordjupning.md (huvudet skalat; "## Avsnittsingress" i Enkel behålls
//                                          som Enkel-ingress)
//   karnpunkter-alkoholer.md            → karnpunkter.md (oförändrad kopia, kontrollräknad 9 × 5 = 45)
//   djupdykning-nobel.md                → djupdykning-nobel.md (kopia) + djupdykningar.md (registret i Syror-form)
// ▸-märkningarna tas bort (meningarna behålls, Joachims stående beslut). Skriver ordantal per underdel och nivå.
// Saknas dk4-bearbetade-texter.md rapporteras det och Standard-filerna lämnas oskrivna (ordern: rapportera, bygg inte runt).
// Kör: node verktyg/rensa-alkoholer.js
'use strict';
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..', 'doc', 'leveranser', 'alkoholer'), O = path.join(R, 'original');
const finns = f => fs.existsSync(path.join(O, f));
const las = f => fs.readFileSync(path.join(O, f), 'utf8').replace(/\r\n/g, '\n');
const STOPP = /\n# (Vad som ströks|Vad som flyttades till bild|Anteckningar|▸-tillägg|Bilder som avsnittet behöver|En anmärkning)/;
const ord = t => t.replace(/^#+ .*$/gm, '').replace(/[*_▸|]/g, '').split(/\s+/).filter(Boolean).length;
const rad = [];
// rättelse-k9-hanvisning.md (Joachim 2026-09-18): K9 ligger i 3.3 och syns inte från 3.2 – meningen byts, ingen tionde bild.
// Enkel 3.2 har ordernas exakta mening; den omskrivna Standard-texten 3.2 har en variant – samma ersättning (rapporterad).
const K9_NY = 'Du ser molekylen utritad i bilden i nästa underdel.';
const K9_GAMLA = [/Titta på bilden så ser du samma molekyl utritad\./, /Bilden bredvid visar samma molekyl utritad, så att du kan jämföra\./];
let k9Traffar = 0;
const k9 = t => t.replace(K9_GAMLA[0], () => { k9Traffar++; return K9_NY; }).replace(K9_GAMLA[1], () => { k9Traffar++; return K9_NY; })
  .replace(/`\(OH\)`/g, '**(OH)**');   // omskriven Standard 3.2 skriver parentesen som kodspann (`(OH)`); byggverktyget saknar kodspann, Enkel skriver **(OH)** – samma här (rapporterat 2026-09-18)
// ---- omskrivna underdelar (1.2, 3.2) ----
const OM = las('dk4-omskrivet-och-bildspecar.md');
const omskrivna = {};
for (const m of OM.matchAll(/\n# Omskriven: (\d)\.(\d) ([^\n]+)\n([\s\S]*?)(?=\n---\n)/g)) {
  const kropp = k9(m[4]).replace(/^\*Fyra rubriker[^\n]*\*\s*$/gm, '').replace(/^\*ca \d+ ord[^\n]*\*\s*$/gm, '').replace(/▸\s?/g, '').replace(/\n{3,}/g, '\n\n').trim();
  omskrivna[m[1] + '.' + m[2]] = { titel: m[3].trim(), kropp };
}
if (Object.keys(omskrivna).length !== 2) throw new Error(`omskrivna underdelar: ${Object.keys(omskrivna).join(', ')} (väntat 1.2 och 3.2)`);
// ---- Standard ----
if (finns('dk4-bearbetade-texter.md')) {
  let t = las('dk4-bearbetade-texter.md');
  const s = t.search(STOPP); if (s > 0) { t = t.slice(0, s); }
  const avsnitt = [...t.matchAll(/(?:^|\n)# Avsnitt (\d) — ([^\n]+)\n([\s\S]*?)(?=\n# Avsnitt \d|$)/g)];
  if (avsnitt.length !== 3) throw new Error(`dk4-bearbetade-texter.md: ${avsnitt.length} avsnitt (väntat 3)`);
  for (const m of avsnitt) {
    const N = +m[1], titel = m[2].trim(); let kropp = m[3];
    if (!/## Avsnittsingress/.test(kropp)) throw new Error(`avsnitt ${N}: ## Avsnittsingress saknas`);
    kropp = kropp.slice(kropp.indexOf('## Avsnittsingress'));
    const ingress = kropp.match(/## Avsnittsingress\n([\s\S]*?)\n---\n/)[1].trim();
    let rest = kropp.slice(kropp.indexOf('\n---\n', kropp.indexOf('## Avsnittsingress')) + 5);
    // ersätt 1.2 och 3.2 helt (rubriken från arbetsfilen behålls om den är samma; annars den omskrivnas)
    rest = rest.replace(/\n## (\d\.\d) ([^\n]+)\n([\s\S]*?)(?=\n## \d\.\d |\n---\s*$|$)/g, (hel, nr, rub, kropp2) => {
      if (!omskrivna[nr]) return hel;
      omskrivna[nr].anvand = true;
      return `\n## ${nr} ${omskrivna[nr].titel}\n\n${omskrivna[nr].kropp}\n`;
    });
    let ut = `# Avsnitt ${N} — ${titel}\n\n> Ur dk4-bearbetade-texter.md (verktyg/rensa-alkoholer.js): texten fram till "# Vad som ströks", ▸ borttagna; 1.2 och 3.2 ersatta av dk4-omskrivet-och-bildspecar.md.\n\n${ingress}\n\n---\n\n${rest.trim()}\n`;
    ut = ut.replace(/▸\s?/g, '').replace(/\n{3,}/g, '\n\n').replace(/\n---\s*$/, '\n');
    fs.writeFileSync(path.join(R, `avsnitt-${N}.md`), ut);
    const under = [...ut.matchAll(/\n## (\d\.\d) [^\n]*\n([\s\S]*?)(?=\n## \d\.\d |\n---\s*$|$)/g)];
    for (const u of under) { rad.push(`${u[1]} Standard ${ord(u[2].replace(/\*ca \d+ ord\*/g, '').replace(/^\*Djupdykning härifrån[^\n]*$/gm, ''))}`); }
  }
  for (const nr of Object.keys(omskrivna)) { if (!omskrivna[nr].anvand) throw new Error(`omskriven ${nr} hittade ingen underdel att ersätta`); }
} else {
  console.log('SAKNAS: original/dk4-bearbetade-texter.md – Standard-filerna (avsnitt-1..3.md) inte skrivna');
}
// ---- Enkel + Fördjupning ----
for (const N of [1, 2, 3]) {
  const f = `dk4-avsnitt-${N}-enkel-fordjupning.md`;
  if (!finns(f)) { console.log(`SAKNAS: original/${f}`); continue; }
  const t = las(f);
  const enkel = t.match(/\n# 📗 ENKEL\n([\s\S]*?)\n# 📕 FÖRDJUPNING\n/)[1], fordj = t.match(/\n# 📕 FÖRDJUPNING\n([\s\S]*)$/)[1];
  const ing = enkel.match(/## Avsnittsingress\n([\s\S]*?)\n---\n/);
  const dela = del => [...del.matchAll(/\n## (\d)\.(\d) ([^\n]+)\n([\s\S]*?)(?=\n## \d\.\d |$)/g)].map(m => ({ N: +m[1], nr: +m[2], titel: m[3].trim(), text: k9(m[4]).replace(/\n---\s*$/, '').replace(/▸\s?/g, '').trim() }));
  const E = dela(enkel), F = dela(fordj);
  if (E.length !== 3 || F.length !== 3 || E.some(x => x.N !== N) || F.some(x => x.N !== N)) throw new Error(`${f}: ${E.length} Enkel, ${F.length} Fördjupning`);
  let ut = `# Alkoholer, avsnitt ${N} — Enkel och Fördjupning\n\n> Ur ${f} (verktyg/rensa-alkoholer.js): huvudet skalat. Avsnittsingressen under ENKEL är Enkel-ingressen (levererad i samma fil).\n\n---\n\n# 📗 ENKEL\n\n`;
  if (ing) { ut += `## Avsnittsingress\n\n${ing[1].trim()}\n\n---\n\n`; rad.push(`${N}.0 Enkel-ingress ${ord(ing[1])}`); }
  for (const u of E) { ut += `## ${N}.${u.nr} ${u.titel}\n\n${u.text}\n\n---\n\n`; rad.push(`${N}.${u.nr} Enkel ${ord(u.text.replace(/\*ca \d+ ord\*/g, ''))}`); }
  ut += `# 📕 FÖRDJUPNING\n\n`;
  for (const u of F) { if (!/\*\*Om modellen\.\*\*/.test(u.text)) throw new Error(`${N}.${u.nr} Fördjupning: "Om modellen" saknas`); ut += `## ${N}.${u.nr} ${u.titel}\n\n${u.text}\n\n---\n\n`; rad.push(`${N}.${u.nr} Fördjupning ${ord(u.text)}`); }
  fs.writeFileSync(path.join(R, `avsnitt-${N}-enkel-fordjupning.md`), ut.replace(/\n---\n\n$/, '\n'));
}
// ---- kärnpunkter ----
if (finns('karnpunkter-alkoholer.md')) {
  const k = las('karnpunkter-alkoholer.md');
  const block = [...k.matchAll(/\n### (\d)\.(\d) [^\n]+\n\n((?:- [^\n]+(?:\n|$))+)/g)];
  const n = block.reduce((a, b) => a + b[3].trim().split('\n').length, 0);
  if (block.length !== 9 || n !== 45) throw new Error(`karnpunkter-alkoholer.md: ${block.length} underdelar, ${n} punkter`);
  fs.writeFileSync(path.join(R, 'karnpunkter.md'), k.endsWith('\n') ? k : k + '\n');
  console.log(`karnpunkter.md: ${block.length} underdelar × 5 = ${n}`);
} else { console.log('SAKNAS: original/karnpunkter-alkoholer.md'); }
// ---- djupdykning ----
if (finns('djupdykning-nobel.md')) {
  fs.writeFileSync(path.join(R, 'djupdykning-nobel.md'), las('djupdykning-nobel.md'));
  const reg = `# Djupdykningar — delkapitel Alkoholer

> Register i Syror-form för verktyg/bygg-djupdykning.js (verktyg/rensa-alkoholer.js). Titel, underrubrik, ikon och korttext ur arbetsordern 2026-09-18; brödtexten i djupdykning-nobel.md (kopia av original/).

---

# 1. Mannen som gjorde sprängämnet säkert

**Länkas från:** avsnitt 3, underdel B

**Filnamn:** \`djupdykning-nobel.html\`

**Underrubrik:** *samma molekyl, tre öden*

**Korttext:** Nitroglycerin var så instabilt att det knappt gick att använda. Alfred Nobel ändrade inte molekylen — han ändrade vad den låg i. Och samma ämne som spränger berg finns i dag som tablett mot kärlkramp.

**Brödtext:** djupdykning-nobel.md
`;
  fs.writeFileSync(path.join(R, 'djupdykningar.md'), reg);
  console.log('djupdykningar.md + djupdykning-nobel.md skrivna');
} else { console.log('SAKNAS: original/djupdykning-nobel.md'); }
// ordantal per underdel och nivå
const tab = {};
for (const r of rad) { const [u, n, o] = r.split(' '); (tab[u] = tab[u] || {})[n] = +o; }
console.log(`K9-hänvisningen: ${k9Traffar} mening(ar) ersatta (väntat 2: Enkel 3.2 och omskriven Standard 3.2)`);
console.log('underdel  Enkel  Standard  Fördjupning');
for (const u of Object.keys(tab).sort()) { console.log(`${u}       ${String(tab[u].Enkel || tab[u]['Enkel-ingress'] && `(ingress ${tab[u]['Enkel-ingress']})` || '-').padStart(5)}  ${String(tab[u].Standard || '-').padStart(8)}  ${String(tab[u]['Fördjupning'] || '-').padStart(11)}`); }
