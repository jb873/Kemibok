// satt-ihop-kolatomen.js – sätter ihop byggfiler för Organisk kemi 1 "Kolatomen" ur leveransens egna format:
//   doc/leveranser/kolatomen/avsnitt-N.md                  (Standard: "## N.X Titel", "### rubrik", bildrutor som "> **Bild A…**")
//   doc/leveranser/kolatomen/avsnitt-N-enkel-fordjupning.md ("# 📗 ENKEL" / "# 📕 FÖRDJUPNING" med "## N.X Titel")
// → doc/leveranser/kolatomen/bygg/avsnitt-N.md i bygg-avsnitt.js-format (UNDERDEL / X — ENKEL / STANDARD / FÖRDJUPNING
//   + BILDSPECIFIKATIONER ur bildrutorna). Leveransfilerna rörs inte. Kör: node verktyg/satt-ihop-kolatomen.js, sedan
//   node verktyg/bygg-avsnitt.js kolatomen N.
// Regler (arbetsorder 2, 2026-09-15): kärnpunkter ur karnpunkter.md (2026-09-15) på Enkel och Standard, inga på Fördjupning; Enkel behåller sina
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
// kärnpunkter (karnpunkter.md, Joachim 2026-09-15): fem frågor per underdel, samma lista för Enkel och Standard; inga på Fördjupning
const KP = {};
if (fs.existsSync(path.join(R, 'karnpunkter.md'))) {
  for (const m of norm('karnpunkter.md').matchAll(/\n### (\d)\.(\d) [^\n]+\n\n((?:- [^\n]+\n)+)/g)) { KP[m[1] + '.' + m[2]] = m[3].trim(); }
  const n = Object.values(KP).reduce((a, l) => a + l.split('\n').length, 0);
  if (Object.keys(KP).length !== 9 || n !== 45) throw new Error(`karnpunkter.md: ${Object.keys(KP).length} underdelar, ${n} punkter`);
}
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
    // den långa underdelsrubriken visas inte i texten (arbetsorder 3: som i Syror och baser lever den i knappen)
    const stdText = (i === 0 && intro ? intro + '\n\n' : '') + u.text;
    const enkelText = (i === 0 ? INGRESS[String(N)] + '\n\n' : '') + e.text;
    const kort = KORT[N + '.' + u.nr]; if (!kort) throw new Error('knapptitel saknas för ' + N + '.' + u.nr);
    const kp = KP[N + '.' + u.nr] ? `## Kärnpunkter (Enkel)\n\n${KP[N + '.' + u.nr]}\n\n## Kärnpunkter (Standard)\n\n${KP[N + '.' + u.nr]}\n\n` : '';
    ut += `\n# UNDERDEL ${X} — ${kort}\n\n${kp}---\n\n## ${X} — ENKEL\n\n${fetaReaktioner(enkelText)}\n\n---\n\n## ${X} — STANDARD\n\n${fetaReaktioner(stdText)}\n\n---\n\n## ${X} — FÖRDJUPNING\n\n### ${fd.titel}\n\n${fetaReaktioner(fd.text)}\n\n---\n`;
  }
  fs.writeFileSync(path.join(UT, `avsnitt-${N}.md`), ut);
  console.log(`bygg/avsnitt-${N}.md: ${titel} | underdelar ${under.map(u => u.titel.slice(0, 30) + '…').join(' / ')} | bilder ${specar.map(s => s.fil + '@' + s.underdel).join(', ')}`);
  specar.forEach(s => console.log(`   ${s.fil} standard-ankare: "${s.ankareStandard.slice(0, 70)}"`));
}
console.log(`Enkel ${totalt.enkel} + Fördjupning ${totalt.fordj} = ${totalt.enkel + totalt.fordj} texter | "Om modellen" ${totalt.omModellen} | bilder ${totalt.bilder}`);

// ---------- Öva (arbetsorder 3, 2026-09-15): flipcards-kolatomen.md → bygg/flipcards.md, kortsvar-kolatomen.md → bygg/kortsvar.md ----------
// Flipcards: "**N. Term**" + definition (+ "**[formel]**", "*Bankformulering:* **Bankterm** — text") under
// "## Begreppskort, grundlaggande" osv. → standardformatet (# AVSNITT / ## Begreppskort — grundläggande / **Term** [formel]
// / F: / S:). Begreppskortens framsida = termen (leveransen har ingen egen fråga), baksida = definitionen.
// Kortsvar: "**N.** `typ`" + fråga + ev. "A) … D) …" + "**Svar:**" + "*Förklaring:*" → blockform (## kN-sn · typ, F/A/S/E),
// formel-svar som \ce-inmatning (ceify), reaktioner med accepterade varianter (märkt pil, vanlig pil), ord med "(x)" → alternativ.
{
  const { ceify } = require('./lib-notation.js');
  const TITLAR = {};
  for (const N of [1, 2, 3]) { TITLAR[N] = norm(`avsnitt-${N}.md`).match(/^# Avsnitt \d — ([^\n]+)/)[1].trim(); }
  // ---- flipcards ----
  const fc = norm('flipcards-kolatomen.md');
  let fut = `# Flipcards — delkapitel Kolatomen (byggfil)\n\n> Sammansatt av verktyg/satt-ihop-kolatomen.js ur flipcards-kolatomen.md – redigera inte här.\n> Framsidan på begreppskorten är termen; baksidan definitionen. Bankformuleringar under Begreppsbanken.\n`;
  const bankRader = []; let fcAntal = { b: 0, m: 0, bg: 0, bf: 0, mg: 0, mf: 0, formel: 0 };
  for (const a of fc.matchAll(/\n# Avsnitt (\d)\n([\s\S]*?)(?=\n# Avsnitt |\n---\n\n## Att kontrollera|$)/g)) {
    const N = +a[1]; let ut = ''; let nb = 0, nm = 0;
    for (const s of a[2].matchAll(/\n## (Begreppskort|Modellkort), (grundlaggande|fordjupning)\n([\s\S]*?)(?=\n## |\n---|$)/g)) {
      const typ = s[1], niva = s[2] === 'grundlaggande' ? 'grundläggande' : 'fördjupning';
      ut += `\n## ${typ} — ${niva}\n\n`;
      for (const k of s[3].matchAll(/\*\*(\d+)\. ([^*]+)\*\*\n([\s\S]*?)(?=\n\n\*\*\d+\. |\n*$(?![\s\S]))/g)) {
        const nr = +k[1], titel = k[2].replace(/\n/g, ' ').trim(); let kropp = k[3].trim();
        const formel = /\*\*\[formel\]\*\*/.test(kropp); kropp = kropp.replace(/\n?\*\*\[formel\]\*\*/, '');
        const bm = kropp.match(/\n?\*Bankformulering:\* \*\*([^*]+)\*\* — ([\s\S]*)$/);
        if (bm) { kropp = kropp.slice(0, bm.index).trim(); bankRader.push({ titel, term: bm[1].trim(), def: bm[2].replace(/\s*\n\s*/g, ' ').trim() }); }
        const svar = kropp.replace(/\s*\n\s*/g, ' ').trim();
        if (typ === 'Begreppskort') { nb++; fcAntal.b++; fcAntal[s[2] === 'grundlaggande' ? 'bg' : 'bf']++; } else { nm++; fcAntal.m++; fcAntal[s[2] === 'grundlaggande' ? 'mg' : 'mf']++; }
        if (formel) fcAntal.formel++;
        ut += `**${titel}**${formel ? ' [formel]' : ''}\nF: ${typ === 'Begreppskort' ? titel : titel}\nS: ${svar}\n\n`;
      }
    }
    fut += `\n---\n\n# AVSNITT ${N} — ${TITLAR[N]}\n**${nb + nm} kort:** ${nb} begreppskort, ${nm} modellkort\n${ut}`;
  }
  fut += `\n---\n\n## Begreppsbanken\n\nEndast grundläggande begreppskort. Bankformuleringar (kortets term → bankterm) ur leveransen:\n\n`;
  for (const b of bankRader) { fut += `**${b.titel}** → **${b.term}** — ${b.def}\n\n`; }
  fs.writeFileSync(path.join(UT, 'flipcards.md'), fut);
  console.log(`bygg/flipcards.md: ${fcAntal.b + fcAntal.m} kort = begrepp ${fcAntal.b} (grund ${fcAntal.bg}, fördj ${fcAntal.bf}) + modell ${fcAntal.m} (grund ${fcAntal.mg}, fördj ${fcAntal.mf}); [formel] ${fcAntal.formel}; bankformuleringar ${bankRader.length}`);
  // ---- kortsvar ----
  const ks = norm('kortsvar-kolatomen.md');
  let kut = `# Kortsvar — delkapitel Kolatomen (byggfil)\n\n> Sammansatt av verktyg/satt-ihop-kolatomen.js ur kortsvar-kolatomen.md – redigera inte här. Blockform (KEMI-TILLAGG §8).\n`;
  const ksAntal = {};
  for (const a of ks.matchAll(/\n# Avsnitt (\d)\n([\s\S]*?)(?=\n# Avsnitt |\n---\n\n## Att kontrollera|$)/g)) {
    const N = +a[1]; let n = 0;
    kut += `\n---\n\n# AVSNITT ${N} — ${TITLAR[N]}\nantal_per_omgang: 10\n`;
    for (const q of a[2].matchAll(/\*\*(\d+)\.\*\* `([a-z-]+)`\n([\s\S]*?)\n\*\*Svar:\*\* ([^\n]+)\n\*Förklaring:\* ([\s\S]*?)(?=\n\n\*\*\d+\.\*\*|\n*$(?![\s\S]))/g)) {
      n++; const typ = q[2], svarRaa = q[4].trim(), forkl = q[5].replace(/\s*\n\s*/g, ' ').trim();
      let ftext = q[3].replace(/\s*\n\s*/g, ' ').trim(); let alt = null;
      if (typ === 'flerval') { const i = ftext.search(/\sA\) /); if (i < 0) throw new Error(`fråga ${q[1]}: alternativ saknas`); alt = ftext.slice(i).trim().split(/\s*[A-D]\)\s*/).filter(Boolean).map(x => x.trim()); ftext = ftext.slice(0, i).trim(); if (alt.length !== 4) throw new Error(`fråga ${q[1]}: ${alt.length} alternativ`); }
      let S;
      if (typ === 'flerval') { S = String('ABCD'.indexOf(svarRaa)); if (S === '-1') throw new Error(`fråga ${q[1]}: svar ${svarRaa}`); }
      else if (typ === 'formel') { const c = ceify(svarRaa); S = /->/.test(c) ? [...new Set([c, c.replace(/->\[[^\]]+\]/, '->'), c.replace(/->\[[^\]]+\]|->/, '→'), c.replace(/->(\[[^\]]+\])/, '→$1')])].join(' | ') : c; }   // reaktioner: märkt pil, ->, → godtas
      else if (typ === 'ord') { const m = svarRaa.match(/^(.+?) \((.+)\)$/); S = m ? `${m[1]} | ${m[2]}` : svarRaa; }
      else { S = svarRaa; }
      ksAntal[typ] = (ksAntal[typ] || 0) + 1;
      kut += `\n## k${N}-s${n} · ${typ}\nF: ${ftext}\n${alt ? 'A: ' + alt.join(' | ') + '\n' : ''}S: ${S}\nE: ${forkl}\n`;
    }
    if (n !== 12) throw new Error(`kortsvar avsnitt ${N}: ${n} frågor`);
  }
  fs.writeFileSync(path.join(UT, 'kortsvar.md'), kut);
  console.log('bygg/kortsvar.md: 36 frågor', JSON.stringify(ksAntal));
}
