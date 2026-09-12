// Serverar en flipcards-fixtur för avsnitt 1 genom att patcha fetch – inget skrivs i repot.
(function () {
  var FIXTUR = {
    avsnitt: 1, titel: "Atomer, molekyler och joner", delkapitel: "syror-och-baser", version: "0",
    begreppskort: [
      { id: "k1-b1", type: "begrepp", niva: "grundlaggande",
        fraga: "Vad visar formeln \\(\\ce{NaCl -> Na+ + Cl-}\\)?",
        svar: "Att **koksalt** delas upp i joner: \\(\\ce{Na+}\\) och \\(\\ce{Cl-}\\).\n\n\\[\\ce{H2SO4 + 2 NaOH -> Na2SO4 + 2 H2O}\\]" },
      { id: "k1-b2", type: "begrepp", niva: "grundlaggande", fraga: "Kort utan formel", svar: "Svar utan formel." }
    ],
    modellkort: [
      { id: "k1-m1", type: "modell", niva: "fordjupning", fraga: "Jämvikt: \\(\\ce{CH3COOH + H2O <=> CH3COO- + H3O+}\\) – vad betyder pilen?", svar: "Reaktionen går åt båda håll." }
    ]
  };
  var orig = window.fetch;
  window.fetch = function (u) {
    if (typeof u === 'string' && u.indexOf('flipcards/avsnitt-1-') >= 0) {
      return Promise.resolve(new Response(JSON.stringify(FIXTUR), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    }
    return orig.apply(this, arguments);
  };
})();
