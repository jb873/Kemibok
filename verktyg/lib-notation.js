// lib-notation.js – Unicode-formler ↔ \ce{} (KEMI-TILLAGG §1), delad av byggverktygen.
//   formler('H₂O och Na⁺')      → 'H\\(\\ce{H2O}\\) …'   (leverans → sida)
//   unicode('\\(\\ce{SO4^2-}\\)') → 'SO₄²⁻'                (sida → leverans, för återskapade leveransfiler)
// Ensamma beteckningar (H, O, NaCl) och enheter (°C, mol/dm³, g/mol) rörs inte.
// Matematiska uttryck (DEL 8.1, vanlig MathJax): 10⁻⁷ → \(10^{-7}\), 6,02 · 10²³ → \(6{,}02 \cdot 10^{23}\).
// Jämviktspilen ⇌ → <=> i reaktioner (ceify) och \(\ce{<=>}\) ensam i löptext (formler).
// En hel reaktion i löptext (t.ex. fet "HCl + H₂O → H₃O⁺ + Cl⁻") känns igen av arReaktion() och
// blir ett enda \(\ce{…}\); pilar i vanlig text ("partiklar → mol → gram") blir \(\rightarrow\).
'use strict';
const SUB = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
const SUBI = Object.fromEntries(Object.entries(SUB).map(([u, d]) => [d, u]));
const SUP = { '2': '²', '3': '³' };
const SUPD = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };

function ceify(s) {
  // decimalindex med komma (icke-stökiometrisk formel, salter 1 C: Fe₀,₉₅O) → explicit index med {,} utan mellanrum
  s = s.replace(/([₀-₉]+),([₀-₉]+)/g, (_, a, b) => '_{' + [...a].map(c => SUB[c]).join('') + '{,}' + [...b].map(c => SUB[c]).join('') + '}');
  return s.replace(/[₀-₉]/g, c => SUB[c]).replace(/²([⁺⁻])/g, '^2$1').replace(/³([⁺⁻])/g, '^3$1')
    .replace(/⁺/g, '+').replace(/⁻/g, '-').replace(/→/g, '->').replace(/⇌/g, '<=>').replace(/\s+/g, ' ').trim();
}
// element med index, ev. parentesgrupper (Ca(OH)₂), ev. laddning; samt elektronen e⁻
const FORMELTOKEN = /(?:[A-Z][a-z]?(?:[₀-₉]+(?:,[₀-₉]+)?)?|\((?:[A-Z][a-z]?[₀-₉]*)+\)[₀-₉]+)+(?:[²³]?[⁺⁻])?|\be[⁺⁻]/g;   // index får vara decimalt med komma (Fe₀,₉₅O)
// tiopotens med valfri mantissa: "6,02 · 10²³", "1 · 10⁻⁷", "10⁻¹⁴"; inte föregånget av bokstav/siffra (dm³ lämnas)
const TIOPOTENS = /(?<![\p{L}\d])(?:(\d+(?:,\d+)?) · )?(\d+)(⁻?)([⁰¹²³⁴-⁹]+)/gu;
// en reaktion: bara formeltokens, koefficienter, +, →/⇌ och parenteser – "HCl + H₂O → H₃O⁺ + Cl⁻"
function arReaktion(s) {
  const t = s.trim();
  if (!/[→⇌]/.test(t)) { return false; }
  return t.split(/\s+/).every(w => /^(\d+|\+|→|⇌|e⁻|(?:[A-Z][a-z]?[₀-₉]*|\((?:[A-Z][a-z]?[₀-₉]*)+\)[₀-₉]*)+(?:[²³]?[⁺⁻])?)$/.test(w));
}
// enskilda tokens med index/laddning → \(\ce{…}\); hela reaktionsrader hanteras av anroparen
function formler(s) {
  s = s.replace(/\b([A-Z][a-z]?(?:O|H)?)ₓ/g, (_, b) => `\\(\\ce{${b}_x}\\)`);   // NOₓ, SOₓ – obestämt index x
  return s.replace(FORMELTOKEN, t => /[₀-₉⁺⁻]/.test(t) ? `\\(\\ce{${ceify(t)}}\\)` : t)
    .replace(TIOPOTENS, (_, mant, bas, minus, exp) => `\\(${mant ? mant.replace(',', '{,}') + ' \\cdot ' : ''}${bas}^{${minus ? '-' : ''}${[...exp].map(c => SUPD[c]).join('')}}\\)`)
    .replace(/⇌/g, '\\(\\ce{<=>}\\)').replace(/→/g, '\\(\\rightarrow\\)');
}
// inversen för ett \ce-innehåll: H2O → H₂O, SO4^2- → SO₄²⁻, Li+ → Li⁺, -> → →
function unicodeCe(x) {
  return x.replace(/\^(\d)([+-])/g, (_, d, t) => SUP[d] + (t === '+' ? '⁺' : '⁻'))
    .replace(/([A-Za-z\)])(\d+)/g, (_, a, d) => a + d.split('').map(c => SUBI[c]).join(''))
    .replace(/->/g, '→').replace(/<=>/g, '⇌').replace(/([A-Za-z₀-₉])([+-])(?![A-Za-z0-9])/g, (_, a, t) => a + (t === '+' ? '⁺' : '⁻'));
}
function unicode(s) { return s.replace(/\\\(\\ce\{([^}]*)\}\\\)/g, (_, x) => unicodeCe(x)); }

module.exports = { ceify, formler, unicode, unicodeCe, arReaktion, FORMELTOKEN };
