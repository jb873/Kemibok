// lib-leveranshuvud.js – titel, slug och hero-underrubrik ur en avsnittsleverans (doc/leveranser/{dk}/avsnitt-N.md):
//   # … avsnitt N — Titel  /  **Sökväg:** `…/avsnitt-N-slug.html`  /  **Underrubrik i hero:** …
// Fyller i det konfigurationen (bygg-avsnitt-konfig.js) inte anger. Delad av bygg-avsnitt.js och bygg-djupdykning.js.
'use strict';
const fs = require('fs');
function fyllHuvud(K, fil) {
  const md = fs.readFileSync(fil, 'utf8').replace(/\r\n/g, '\n');
  const rub = md.match(/^# (?:[^\n]*?[Aa]vsnitt \d+) — ([^\n]+)/), sok = md.match(/\*\*Sökväg:\*\* `[^`]*avsnitt-\d+-([a-z0-9-]+)\.html`/), sub = md.match(/\*\*Underrubrik i hero:\*\* ([^\n]+)/);
  if (!K.titel) { if (!rub) { throw new Error('titel saknas i leveransens huvud: ' + fil); } K.titel = rub[1].trim(); }
  if (!K.slug) { if (!sok) { throw new Error('**Sökväg:** saknas i leveransens huvud: ' + fil); } K.slug = sok[1]; }
  if (!K.sub) { if (!sub) { throw new Error('**Underrubrik i hero:** saknas i leveransens huvud: ' + fil); } K.sub = sub[1].trim(); }
  return K;
}
module.exports = { fyllHuvud };
