// lib-djupdykningar.js – läser doc/leveranser/{delkapitel}/djupdykningar.md (delad av
// bygg-djupdykning.js och bygg-avsnitt.js, som hämtar korttexten till fordj-kort).
// Två leveransformer per djupdykning ("# N. Titel" + fält):
//   repetition: **Avsnitt N — Titel** / **Korttext:** … / ## Text … (brödtexten i filen)
//   syror:      **Länkas från:** avsnitt N, underdel A / **Filnamn:** `djupdykning-slug.html` /
//               **Underrubrik:** *…* / **Korttext:** … / **Brödtext:** fil.md (texten i egen fil,
//               dokumentets egen "# Titel"-rad skalas bort; sökväg relativt djupdykningar.md)
// Returnerar [{ nr, titel, avsnitt, underdel, slug, underrubrik, korttext, text, textFil }].
'use strict';
const fs = require('fs'), path = require('path');
function tolkaDjupdykningar(fil) {
  if (!fs.existsSync(fil)) { return []; }
  const md = fs.readFileSync(fil, 'utf8').replace(/\r\n/g, '\n');
  const ut = [];
  // "# 1. Titel" (repetition/syror) eller "## Titel" (neutralisation) – block utan **Korttext:** hoppas över
  for (const m of md.matchAll(/\n#{1,2} (?:(\d+)\. )?([^\n]+)\n([\s\S]*?)(?=\n---\n|$)/g)) {
    const nr = m[1] ? +m[1] : ut.length + 1, titel = m[2].trim(), block = m[3];
    const falt = re => { const x = block.match(re); return x ? x[1].trim() : null; };
    const d = { nr, titel, avsnitt: null, underdel: 'a', slug: null, underrubrik: null, korttext: null, text: null, textFil: null };
    const avs = falt(/^\*\*Avsnitt (\d+) — [^*]+\*\*$/m);
    const lank = falt(/^\*\*Länkas från:\*\* ([^\n]+)$/m);
    if (avs) { d.avsnitt = +avs; }
    else if (lank) {
      const a = lank.match(/avsnitt (\d+)(?:, underdel ([A-D]))?/i);
      if (/delkapitel \*\*/.test(lank)) { d.annatDelkapitel = (lank.match(/delkapitel \*\*([^*]+)\*\*/) || [])[1]; }
      if (a) { d.avsnitt = +a[1]; if (a[2]) { d.underdel = a[2].toLowerCase(); } }
    }
    const filnamn = falt(/^\*\*Filnamn:\*\* `djupdykning-([a-z0-9-]+)\.html`$/m);
    if (filnamn) { d.slug = filnamn; }
    const under = falt(/^\*\*Underrubrik:\*\* \*?([^*\n]+?)\*?$/m);
    if (under) { d.underrubrik = under; }
    const kort = block.match(/\*\*Korttext:\*\*\s*([\s\S]*?)(?:\n\n|$)/);
    if (!kort) { continue; }   // rubrik utan Korttext (t.ex. "## Varför den länkas från …") är prosa, inte en djupdykning
    d.korttext = kort[1].replace(/\n/g, ' ').trim();
    const inline = block.match(/\n## Text\n([\s\S]*)$/);
    const brod = falt(/^\*\*Brödtext:\*\* ([^\n]+)$/m);
    if (inline) { d.text = inline[1].trim(); }
    else if (brod) {
      d.textFil = path.resolve(path.dirname(fil), brod);
      if (!fs.existsSync(d.textFil)) { throw new Error(`djupdykning "${titel}": brödtextfilen ${brod} saknas`); }
      let t = fs.readFileSync(d.textFil, 'utf8').replace(/\r\n/g, '\n').replace(/^# [^\n]+\n+/, '');
      // leveranshuvud före första rubriken (kolatomen: "**Delkapitel 1 … · länkas från 2.2**" + not, avslutat med ---) skalas bort
      const hr = t.indexOf('\n---\n'), h2 = t.search(/\n## /);
      if (hr >= 0 && h2 > hr && t.slice(0, hr).trim().split(/\n\s*\n/).length <= 2) { t = t.slice(hr + 5); }
      d.text = t.trim();
    }
    ut.push(d);
  }
  return ut;
}
module.exports = { tolkaDjupdykningar };
