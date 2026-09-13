// lib-notation.js – Unicode-formler ↔ \ce{} (KEMI-TILLAGG §1), delad av byggverktygen.
//   formler('H₂O och Na⁺')      → 'H\\(\\ce{H2O}\\) …'   (leverans → sida)
//   unicode('\\(\\ce{SO4^2-}\\)') → 'SO₄²⁻'                (sida → leverans, för återskapade leveransfiler)
// Ensamma beteckningar (H, O, NaCl) och enheter (°C, mol/dm³) rörs inte.
'use strict';
const SUB = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
const SUBI = Object.fromEntries(Object.entries(SUB).map(([u, d]) => [d, u]));
const SUP = { '2': '²', '3': '³' };

function ceify(s) {
  return s.replace(/[₀-₉]/g, c => SUB[c]).replace(/²([⁺⁻])/g, '^2$1').replace(/³([⁺⁻])/g, '^3$1')
    .replace(/⁺/g, '+').replace(/⁻/g, '-').replace(/→/g, '->').replace(/\s+/g, ' ').trim();
}
const FORMELTOKEN = /(?:[A-Z][a-z]?[₀-₉]*)+(?:[²³]?[⁺⁻])?|\be[⁺⁻]/g;
// enskilda tokens med index/laddning → \(\ce{…}\); hela reaktionsrader (→) hanteras av anroparen
function formler(s) {
  return s.replace(FORMELTOKEN, t => /[₀-₉⁺⁻]/.test(t) ? `\\(\\ce{${ceify(t)}}\\)` : t);
}
// inversen för ett \ce-innehåll: H2O → H₂O, SO4^2- → SO₄²⁻, Li+ → Li⁺, -> → →
function unicodeCe(x) {
  return x.replace(/\^(\d)([+-])/g, (_, d, t) => SUP[d] + (t === '+' ? '⁺' : '⁻'))
    .replace(/([A-Za-z\)])(\d+)/g, (_, a, d) => a + d.split('').map(c => SUBI[c]).join(''))
    .replace(/->/g, '→').replace(/([A-Za-z₀-₉])([+-])(?![A-Za-z0-9])/g, (_, a, t) => a + (t === '+' ? '⁺' : '⁻'));
}
function unicode(s) { return s.replace(/\\\(\\ce\{([^}]*)\}\\\)/g, (_, x) => unicodeCe(x)); }

module.exports = { ceify, formler, unicode, unicodeCe, FORMELTOKEN };
