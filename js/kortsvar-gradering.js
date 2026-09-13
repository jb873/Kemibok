// kortsvar-gradering.js – rättning av kortsvarsfrågor. Ren funktion, ingen DOM, inga beroenden.
// Portad ur matematikbokens provbyggare (gradeSub: numeric/binary/markera/ordsvar/talfoljd) och
// utökad med formel, tolerans, enhet och alternativa svar. Fungerar både i webbläsare
// (window.KortsvarGradering) och i Node (module.exports) så att den kan testas utan webbläsare.
//
// gradera(fraga, svar) → { status: 'ratt' | 'fel' | 'tomt', given, facit, forklaring, skiftlage }
//
// Typer och fält i frågan (alla har id, typ, fraga, forklaring – forklaring är obligatorisk):
//   tal      svar: 6            tolerans?: {abs: 0.1} | {rel: 0.02}   enhet?: 'strippa' (default) | 'mol/dm³' (krävs)
//   tal-par  svar: [1, 6]       oordnad?: true
//   flerval  alternativ: [...]  svar: index
//   markera  alternativ: [...]  svar: [index, ...]   (exakt mängd: alla rätta, inga fel)
//   ord      svar: ['jon', ...] (gemener, ändelser tolereras: jonen, joner, jonerna)
//   formel   svar: ['H2O', ...] (Unicode-index/laddningar normaliseras; skiftlägeskänslig om inte skiftlage:false)
(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory(); }
  else { root.KortsvarGradering = factory(); }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var SUB = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
  var SUP = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁺': '+', '⁻': '-' };
  var SKIFTLAGE_FORKLARING = 'Nästan – men grundämnen skrivs alltid med stor bokstav först och liten sedan: ' +
    'H, O, Na, Cl. Skiftläget spelar roll: CO är kolmonoxid, men Co är metallen kobolt.';

  function tomt(s) { return s === null || s === undefined || (Array.isArray(s) ? s.every(tomt) : String(s).trim() === ''); }

  // ---- tal ----
  function tillTal(s) {
    var t = String(s).replace(/[−–—]/g, '-').replace(/\s+/g, '').replace(',', '.');
    var m = t.match(/^-?\d+(?:\.\d+)?(?:[eE]-?\d+)?/);   // talet först i strängen; resten (enhet) ignoreras
    return m ? parseFloat(m[0]) : NaN;
  }
  function normEnhet(s) { return String(s).replace(/\s+/g, '').replace(/³/g, '3').replace(/²/g, '2').toLowerCase(); }
  function talOk(v, facit, tol) {
    if (isNaN(v)) { return false; }
    if (tol && typeof tol.abs === 'number') { return Math.abs(v - facit) <= tol.abs + 1e-9; }
    if (tol && typeof tol.rel === 'number') { return Math.abs(v - facit) <= Math.abs(facit) * tol.rel + 1e-9; }
    return Math.abs(v - facit) < 1e-6;
  }
  function graderaTal(f, svar) {
    var text = String(svar);
    var v = tillTal(text);
    var enhetKrav = (f.enhet && f.enhet !== 'strippa') ? f.enhet : null;
    var facitText = String(f.svar).replace('.', ',') + (enhetKrav ? ' ' + enhetKrav : '');
    if (isNaN(v)) { return res('fel', text, facitText, f.forklaring); }
    if (enhetKrav) {
      var rest = text.replace(/[−–—]/g, '-').replace(/^\s*-?\d+(?:[.,]\d+)?(?:[eE]-?\d+)?/, '');
      if (normEnhet(rest) !== normEnhet(enhetKrav)) { return res('fel', text, facitText, f.forklaring); }
    }
    return res(talOk(v, Number(f.svar), f.tolerans) ? 'ratt' : 'fel', text, facitText, f.forklaring);
  }

  // ---- tal-par ----
  function graderaTalPar(f, svar) {
    if (!Array.isArray(svar) || svar.length < 2) { return res('fel', String(svar), parText(f), f.forklaring); }
    var a = tillTal(svar[0]), b = tillTal(svar[1]), fa = Number(f.svar[0]), fb = Number(f.svar[1]);
    var exakt = talOk(a, fa, f.tolerans) && talOk(b, fb, f.tolerans);
    var bytt = f.oordnad && talOk(a, fb, f.tolerans) && talOk(b, fa, f.tolerans);
    return res((exakt || bytt) ? 'ratt' : 'fel', svar[0] + ' och ' + svar[1], parText(f), f.forklaring);
  }
  function parText(f) { return String(f.svar[0]).replace('.', ',') + ' och ' + String(f.svar[1]).replace('.', ','); }

  // ---- flerval / markera ----
  function graderaFlerval(f, svar) {
    var i = parseInt(svar, 10);
    return res(i === Number(f.svar) ? 'ratt' : 'fel', f.alternativ[i] != null ? f.alternativ[i] : String(svar), f.alternativ[f.svar], f.forklaring);
  }
  function graderaMarkera(f, svar) {
    var valt = (Array.isArray(svar) ? svar : [svar]).map(Number).sort(function (a, b) { return a - b; });
    var ratt = (f.svar || []).map(Number).sort(function (a, b) { return a - b; });
    var facit = ratt.map(function (i) { return f.alternativ[i]; }).join(', ');
    return res(valt.join(',') === ratt.join(',') ? 'ratt' : 'fel', valt.map(function (i) { return f.alternativ[i]; }).join(', ') || '(inget markerat)', facit, f.forklaring);
  }

  // ---- ord ----
  var ANDELSER = ['arna', 'erna', 'orna', 'ar', 'er', 'or', 'na', 'en', 'et', 'n', 't', 's'];
  function normOrd(s) { return String(s).toLowerCase().replace(/[^a-zåäöéü]/g, ''); }
  function ordMatchar(svar, facit) {
    var s = normOrd(svar), f = normOrd(facit);
    if (!s) { return false; }
    if (s === f) { return true; }
    return ANDELSER.some(function (a) { return s === f + a; });   // ändelse på elevens ord, aldrig på facit
  }
  function graderaOrd(f, svar) {
    var alternativ = Array.isArray(f.svar) ? f.svar : [f.svar];
    var ok = alternativ.some(function (a) { return ordMatchar(svar, a); });
    return res(ok ? 'ratt' : 'fel', String(svar).trim(), alternativ[0], f.forklaring);
  }

  // ---- formel ----
  function normFormel(s) {
    return String(s).replace(/[₀-₉]/g, function (c) { return SUB[c]; }).replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]/g, function (c) { return SUP[c]; })   // ¹²³ ligger i Latin-1, inte i U+2070-blocket
      .replace(/[−–—]/g, '-').replace(/[\s^{}_]/g, '');
  }
  function graderaFormel(f, svar) {
    var alternativ = Array.isArray(f.svar) ? f.svar : [f.svar];
    var s = normFormel(svar);
    var facitVisning = '\\(\\ce{' + alternativ[0] + '}\\)';
    var exakt = alternativ.some(function (a) { return normFormel(a) === s; });
    if (exakt) { return res('ratt', String(svar).trim(), facitVisning, f.forklaring); }
    var okanslig = alternativ.some(function (a) { return normFormel(a).toLowerCase() === s.toLowerCase(); });
    if (okanslig && f.skiftlage === false) { return res('ratt', String(svar).trim(), facitVisning, f.forklaring); }
    if (okanslig) { var r = res('fel', String(svar).trim(), facitVisning, SKIFTLAGE_FORKLARING); r.skiftlage = true; return r; }
    return res('fel', String(svar).trim(), facitVisning, f.forklaring);
  }

  function res(status, given, facit, forklaring) { return { status: status, given: given, facit: facit, forklaring: forklaring, skiftlage: false }; }

  function gradera(f, svar) {
    if (tomt(svar)) { return res('tomt', '', '', f.forklaring); }
    switch (f.typ) {
      case 'tal': return graderaTal(f, svar);
      case 'tal-par': return graderaTalPar(f, svar);
      case 'flerval': return graderaFlerval(f, svar);
      case 'markera': return graderaMarkera(f, svar);
      case 'ord': return graderaOrd(f, svar);
      case 'formel': return graderaFormel(f, svar);
      default: throw new Error('okänd frågetyp: ' + f.typ);
    }
  }

  // Validering av en hel fil – fel ska synas i bygget, inte i klassrummet.
  var TYPER = ['tal', 'tal-par', 'flerval', 'markera', 'ord', 'formel'];
  function validera(data) {
    var fel = [];
    if (!data || !Array.isArray(data.fragor)) { return ['fragor[] saknas']; }
    var ids = {};
    data.fragor.forEach(function (f, i) {
      var id = f.id || ('#' + i);
      if (!f.id) { fel.push(id + ': id saknas'); }
      if (ids[f.id]) { fel.push(id + ': dubblett-id'); } ids[f.id] = true;
      if (TYPER.indexOf(f.typ) < 0) { fel.push(id + ': okänd typ "' + f.typ + '"'); }
      if (!f.fraga) { fel.push(id + ': fraga saknas'); }
      if (!f.forklaring || !String(f.forklaring).trim()) { fel.push(id + ': forklaring saknas (obligatorisk)'); }
      if (f.svar === undefined || f.svar === null) { fel.push(id + ': svar saknas'); }
      if ((f.typ === 'flerval' || f.typ === 'markera') && !(Array.isArray(f.alternativ) && f.alternativ.length >= 2)) { fel.push(id + ': alternativ[] saknas'); }
      if (f.typ === 'flerval' && f.alternativ && !(Number.isInteger(f.svar) && f.svar >= 0 && f.svar < f.alternativ.length)) { fel.push(id + ': svar ska vara ett index i alternativ'); }
      if (f.typ === 'markera' && !Array.isArray(f.svar)) { fel.push(id + ': svar ska vara en lista med index'); }
      if ((f.typ === 'ord' || f.typ === 'formel') && !(Array.isArray(f.svar) && f.svar.length)) { fel.push(id + ': svar ska vara en lista med accepterade svar'); }
      if (f.typ === 'tal-par' && !(Array.isArray(f.svar) && f.svar.length === 2)) { fel.push(id + ': svar ska vara två tal'); }
      if (f.typ === 'tal' && typeof f.svar !== 'number') { fel.push(id + ': svar ska vara ett tal'); }
    });
    return fel;
  }

  return { gradera: gradera, validera: validera, normFormel: normFormel, tillTal: tillTal, SKIFTLAGE_FORKLARING: SKIFTLAGE_FORKLARING };
}));
