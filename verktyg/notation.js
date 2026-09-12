// notation.js – kontroll enligt LEVERANSGUIDE-KEMI-TILLAGG §1 innan en avsnittssida
// levereras: inga Unicode-formler kvar, varje \ce{} inom \(…\) eller \[…\].
// Kör: node verktyg/notation.js <html-fil>
'use strict';
const fs = require('fs');
const fil = process.argv[2];
if (!fil) { console.error('användning: node verktyg/notation.js <html-fil>'); process.exit(2); }
const s = fs.readFileSync(fil, 'utf8');

// Unicode-tecken som tyder på okonverterad formel (₀–₉, ⁺, ⁻, →). Enheter som mol/dm³
// får finnas (³ = U+00B3 ingår inte), så listan är just formeltecknen i §1.
const unicode = s.match(/[₀-₉⁺⁻→]/g) || [];

const alla = s.match(/\\ce\{[^}]*\}/g) || [];
const inline = s.match(/\\\(\\ce\{[^}]*\}\\\)/g) || [];
const display = s.match(/\\\[\\ce\{[^}]*\}\\\]/g) || [];
const losa = alla.filter(x => !s.includes('\\(' + x + '\\)') && !s.includes('\\[' + x + '\\]'));
const markdown = (s.match(/\*\*|`/g) || []).length;

console.log('Unicode-formeltecken kvar:', unicode.length, unicode.length ? JSON.stringify([...new Set(unicode)]) : '');
console.log('\\ce{} totalt:', alla.length, '| inline \\(…\\):', inline.length, '| display \\[…\\]:', display.length);
console.log('\\ce{} utan avgränsare:', losa.length, losa.length ? losa : '');
console.log('markdown-rester (** eller `):', markdown);
const ok = unicode.length === 0 && losa.length === 0 && markdown === 0;
console.log(ok ? 'OK' : 'FEL');
process.exit(ok ? 0 : 1);
