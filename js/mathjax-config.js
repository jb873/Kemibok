// mathjax-config.js – konfiguration för självhostad MathJax 3.2.2 + mhchem.
//
// Laddas FÖRE js/mathjax/tex-mml-chtml.js (som laddas async). MathJax läser
// window.MathJax vid start. Sökvägarna [mathjax] och [tex] härleds av MathJax
// själv ur skriptets src (js/mathjax/), så typsnitt och mhchem hittas utan
// egen konfiguration så länge mapplayouten speglar npm-paketets es5/.
//
// Tre sorters notation (KOMPONENTER DEL 8):
//   \(\ce{H3O+ + OH- -> 2 H2O}\)   reaktion/jon  → mhchem
//   \(1 \cdot 10^{-7}\)             matematik     → vanlig TeX
//   mol/dm³, °C, pH 7               enhet i text  → rörs inte (ingen $-syntax)
//
// Omkörning: innehåll som ritas av JS efter sidladdning (flipcards) finns inte
// när MathJax gör sin första genomgång. Sådan kod anropar
//   window.KemiFormler.typeset(element)
// som typesettar elementet – direkt om MathJax är klar, annars köat tills
// MathJax rapporterar pageReady. Anropet är säkert att göra i böcker utan
// MathJax: de definierar inte KemiFormler och anropande kod guardar på det.

(function () {
  'use strict';

  var ko = [];   // element som väntar på att MathJax ska bli klar

  function klar() {
    return !!(window.MathJax && typeof MathJax.typesetPromise === 'function');
  }

  function kor(el) {
    return MathJax.startup.promise
      .then(function () { return MathJax.typesetPromise(el ? [el] : undefined); })
      .catch(function (e) { console.warn('KemiFormler: typesetting misslyckades', e); });
  }

  window.KemiFormler = {
    // Typesettar el (eller hela sidan om el utelämnas). Returnerar alltid ett Promise.
    typeset: function (el) {
      if (klar()) { return kor(el); }
      ko.push(el);
      return Promise.resolve();
    }
  };

  window.MathJax = {
    loader: { load: ['[tex]/mhchem'] },
    tex: {
      packages: { '[+]': ['mhchem'] },
      inlineMath: [['\\(', '\\)']],     // inte $…$ – kronor och priser ska inte bli formler
      displayMath: [['\\[', '\\]']],
      processEscapes: true
    },
    options: {
      enableMenu: false,                          // annars lazy-laddas ui/menu + sre från nätet
      skipHtmlTags: { '[+]': ['textarea'] }       // elevens egna svar rörs aldrig
    },
    chtml: {
      // MathJax skalar formler efter omgivande texts x-höjd (matchFontHeight).
      // I ett dolt element (display:none – Enkel/Fördjupning vid laddning,
      // dolda underdelar) kan x-höjden inte mätas och MathJax faller tillbaka
      // på exFactor (default 0.5 → 25 % för stora formler i EB Garamond).
      // EB Garamond har ex/em = 0.40 (mätt i Chromium 2026-09-12), så med 0.4
      // renderas dold och synlig text identiskt. Byts brödtextfonten: mät om.
      exFactor: 0.4
    },
    startup: {
      pageReady: function () {
        return MathJax.startup.defaultPageReady().then(function () {
          ko.splice(0).forEach(kor);
        });
      }
    }
  };
})();
