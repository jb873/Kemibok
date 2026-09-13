// test-gradering.js – Node-tester för js/kortsvar-gradering.js. Kör: node verktyg/test-gradering.js
'use strict';
const G = require('../js/kortsvar-gradering.js');
let antal = 0, fel = 0;
function t(namn, fraga, svar, vantat, extra) {
  antal++;
  const r = G.gradera(Object.assign({ id: 'x', fraga: '?', forklaring: 'F' }, fraga), svar);
  const ok = r.status === vantat && (!extra || Object.keys(extra).every(k => r[k] === extra[k]));
  if (!ok) { fel++; console.log('FEL:', namn, '→', JSON.stringify(r), 'väntat', vantat, extra || ''); }
}
const F = 'F';

// tal
t('tal exakt', { typ: 'tal', svar: 6 }, '6', 'ratt');
t('tal decimalkomma', { typ: 'tal', svar: 2.5 }, '2,5', 'ratt');
t('tal minus-varianter', { typ: 'tal', svar: -7 }, '−7', 'ratt');
t('tal fel', { typ: 'tal', svar: 6 }, '7', 'fel');
t('tal tomt', { typ: 'tal', svar: 6 }, '  ', 'tomt');
t('tal text', { typ: 'tal', svar: 6 }, 'sex', 'fel');
t('tal tolerans abs ok', { typ: 'tal', svar: 6.02, tolerans: { abs: 0.05 } }, '6', 'ratt');
t('tal tolerans abs utanför', { typ: 'tal', svar: 6.02, tolerans: { abs: 0.01 } }, '6', 'fel');
t('tal tolerans rel ok', { typ: 'tal', svar: 100, tolerans: { rel: 0.02 } }, '101,5', 'ratt');
t('tal tolerans rel utanför', { typ: 'tal', svar: 100, tolerans: { rel: 0.02 } }, '103', 'fel');
t('tal enhet strippas (default)', { typ: 'tal', svar: 2.5 }, '2,5 mol/dm³', 'ratt');
t('tal enhet krävs – finns', { typ: 'tal', svar: 2.5, enhet: 'mol/dm³' }, '2,5 mol/dm3', 'ratt');
t('tal enhet krävs – saknas', { typ: 'tal', svar: 2.5, enhet: 'mol/dm³' }, '2,5', 'fel');
t('tal enhet krävs – fel enhet', { typ: 'tal', svar: 2.5, enhet: 'mol/dm³' }, '2,5 g', 'fel');
t('tal med mellanslag', { typ: 'tal', svar: 1500 }, '1 500', 'ratt');

// tal-par
t('tal-par ordnad rätt', { typ: 'tal-par', svar: [1, 6] }, ['1', '6'], 'ratt');
t('tal-par ordnad fel ordning', { typ: 'tal-par', svar: [1, 6] }, ['6', '1'], 'fel');
t('tal-par oordnad', { typ: 'tal-par', svar: [1, 6], oordnad: true }, ['6', '1'], 'ratt');
t('tal-par ett tomt', { typ: 'tal-par', svar: [1, 6] }, ['1', ''], 'fel');
t('tal-par båda tomma', { typ: 'tal-par', svar: [1, 6] }, ['', ''], 'tomt');

// flerval / markera
t('flerval rätt', { typ: 'flerval', alternativ: ['a', 'b', 'c'], svar: 1 }, '1', 'ratt');
t('flerval fel', { typ: 'flerval', alternativ: ['a', 'b', 'c'], svar: 1 }, 2, 'fel');
t('markera exakt', { typ: 'markera', alternativ: ['O2', 'H2O', 'N2', 'CO2'], svar: [0, 2] }, [2, 0], 'ratt');
t('markera en saknas', { typ: 'markera', alternativ: ['O2', 'H2O', 'N2', 'CO2'], svar: [0, 2] }, [0], 'fel');
t('markera en för mycket', { typ: 'markera', alternativ: ['O2', 'H2O', 'N2', 'CO2'], svar: [0, 2] }, [0, 2, 3], 'fel');
t('markera inget', { typ: 'markera', alternativ: ['O2', 'H2O'], svar: [0] }, [], 'tomt');

// ord
t('ord exakt', { typ: 'ord', svar: ['jon'] }, 'jon', 'ratt');
t('ord versaler + mellanslag', { typ: 'ord', svar: ['jon'] }, '  Jon ', 'ratt');
t('ord bestämd form', { typ: 'ord', svar: ['jon'] }, 'jonen', 'ratt');
t('ord plural', { typ: 'ord', svar: ['jon'] }, 'joner', 'ratt');
t('ord plural bestämd', { typ: 'ord', svar: ['jon'] }, 'jonerna', 'ratt');
t('ord kärna/kärnan', { typ: 'ord', svar: ['atomkärna'] }, 'atomkärnan', 'ratt');
t('ord alternativ', { typ: 'ord', svar: ['syre', 'O'] }, 'o', 'ratt');
t('ord fel ord', { typ: 'ord', svar: ['jon'] }, 'atom', 'fel');
t('ord kloridjon ≠ klorjon', { typ: 'ord', svar: ['kloridjon'] }, 'klorjon', 'fel');
t('ord kortare än facit nekas', { typ: 'ord', svar: ['jonen'] }, 'jon', 'fel');

// formel
t('formel exakt', { typ: 'formel', svar: ['H2O'] }, 'H2O', 'ratt');
t('formel unicode-index', { typ: 'formel', svar: ['H2O'] }, 'H₂O', 'ratt');
t('formel laddning unicode', { typ: 'formel', svar: ['Na+'] }, 'Na⁺', 'ratt');
t('formel sulfat varianter 1', { typ: 'formel', svar: ['SO4^2-'] }, 'SO₄²⁻', 'ratt');
t('formel sulfat varianter 2', { typ: 'formel', svar: ['SO4^2-'] }, 'SO4 2-', 'ratt');
t('formel sulfat varianter 3', { typ: 'formel', svar: ['SO4^2-'] }, 'SO42-', 'ratt');
t('formel minus-tecken', { typ: 'formel', svar: ['Cl-'] }, 'Cl−', 'ratt');
t('formel fel formel', { typ: 'formel', svar: ['H2O'] }, 'HO2', 'fel', { skiftlage: false });
t('formel skiftläge → fel + egen förklaring', { typ: 'formel', svar: ['H2O'] }, 'h2o', 'fel', { skiftlage: true, forklaring: G.SKIFTLAGE_FORKLARING });
t('formel CO vs Co är skiftläge', { typ: 'formel', svar: ['CO'] }, 'Co', 'fel', { skiftlage: true });
t('formel skiftlage:false accepterar', { typ: 'formel', svar: ['H2O'], skiftlage: false }, 'h2o', 'ratt');
t('formel alternativ', { typ: 'formel', svar: ['NaCl', 'ClNa'] }, 'ClNa', 'ratt');
t('formel tomt', { typ: 'formel', svar: ['H2O'] }, '', 'tomt');

// validering
const v = G.validera({ fragor: [
  { id: 'a', typ: 'tal', fraga: '?', svar: 1, forklaring: 'x' },
  { id: 'b', typ: 'tal', fraga: '?', svar: 1 },
  { id: 'c', typ: 'flerval', fraga: '?', alternativ: ['x', 'y'], svar: 5, forklaring: 'x' },
  { id: 'a', typ: 'ord', fraga: '?', svar: 'jon', forklaring: 'x' },
  { id: 'd', typ: 'bild', fraga: '?', svar: 1, forklaring: 'x' }
] });
antal++; if (v.length !== 5) { fel++; console.log('FEL: validering gav', v); }
antal++; if (!v.some(x => /forklaring saknas/.test(x))) { fel++; console.log('FEL: forklaring-kravet fångas inte'); }

console.log(`${antal - fel}/${antal} tester OK`);
process.exit(fel ? 1 : 0);
