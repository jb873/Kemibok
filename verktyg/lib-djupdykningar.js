// lib-djupdykningar.js – läser doc/leveranser/{delkapitel}/djupdykningar.md (delad av
// bygg-djupdykning.js och bygg-avsnitt.js, som hämtar korttexten till fordj-kort).
// Returnerar [{ nr, titel, avsnitt, avsnittTitel, korttext, text }] i leveransens ordning.
'use strict';
const fs = require('fs');
function tolkaDjupdykningar(fil) {
  if (!fs.existsSync(fil)) { return []; }
  const md = fs.readFileSync(fil, 'utf8').replace(/\r\n/g, '\n');
  const ut = [];
  for (const m of md.matchAll(/\n# (\d+)\. ([^\n]+)\n\*\*Avsnitt (\d+) — ([^*]+)\*\*\n([\s\S]*?)\n## Text\n([\s\S]*?)(?=\n---\n|$)/g)) {
    const huvud = m[5], kort = huvud.match(/\*\*Korttext:\*\*\s*([\s\S]*?)(?:\n\n|$)/);
    if (!kort) { throw new Error(`djupdykning "${m[2]}": **Korttext:** saknas`); }
    ut.push({ nr: +m[1], titel: m[2].trim(), avsnitt: +m[3], avsnittTitel: m[4].trim(), korttext: kort[1].replace(/\n/g, ' ').trim(), text: m[6].trim() });
  }
  return ut;
}
module.exports = { tolkaDjupdykningar };
