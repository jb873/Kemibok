// ova-arbetssatt.js – Öva-flikens arbetssättsväljare: ett lager OVANPÅ flipcards.js.
//
// flipcards.js rörs inte. Den initierar sig som vanligt på .flipcards-mount, bygger sin
// startskärm (radioknappar niva1/niva2/niva3/anpassa + "Börja plugga") och återvänder dit
// efter "Plugga igen"/"Avsluta". Den startskärmen döljs med CSS (kemi.css, sektion 8); i
// stället visar Öva-panelen tre arbetssätt utan inbördes ordning:
//
//   <div class="ova-valjare">
//     <button class="ova-kort" data-arbetssatt="begrepp"> …  → flipcards, läge niva1 (begreppskort)
//     <button class="ova-kort" data-arbetssatt="kortsvar"> … → js/kortsvar.js i .kortsvar-mount
//     <button class="ova-kort" data-arbetssatt="tillampa"> … → flipcards, läge niva2 (modellkort)
//   </div>
//
// Valet "begrepp"/"tillampa" markerar motsvarande radio i flipcards dolda startskärm och klickar
// "Börja plugga" – dvs. exakt det eleven hade gjort själv. En MutationObserver på mounten
// avgör läget: när flipcards visar sin startskärm igen (.flip-borja-knapp finns) är sessionen
// slut → väljaren visas. "Välkommen tillbaka"-dialogen och pågående sessioner passerar orörda.
//
// Beroenden: flipcards.js och kortsvar.js FÖRE denna fil. Inget i filen är kemispecifikt.

(function () {
  'use strict';

  var LAGE = { begrepp: 'niva1', tillampa: 'niva2' };

  function initPanel(panel) {
    var valjare = panel.querySelector('.ova-valjare');
    var flip = panel.querySelector('.flipcards-mount');
    var kortsvar = panel.querySelector('.kortsvar-mount');
    if (!valjare) { return; }
    var aktiv = null;   // null | 'flip' | 'kortsvar'

    function visa(vad) {
      aktiv = vad;
      valjare.classList.toggle('dold', vad !== null);
      if (flip) { flip.classList.toggle('dold', vad !== 'flip'); }
      if (kortsvar) { kortsvar.classList.toggle('dold', vad !== 'kortsvar'); }
    }
    function startskarmSyns() { return !!(flip && flip.querySelector('.flip-borja-knapp')); }

    function startaFlip(lage) {
      if (!flip) { return; }
      var radio = flip.querySelector('input[name="flip-lage"][value="' + lage + '"]');
      var borja = flip.querySelector('.flip-borja-knapp');
      visa('flip');
      if (radio && borja) { radio.click(); borja.click(); }
      // annars: flipcards visar redan något annat (återupptagning, felmeddelande) – låt det synas
    }

    valjare.querySelectorAll('.ova-kort').forEach(function (knapp) {
      knapp.addEventListener('click', function () {
        var vad = knapp.getAttribute('data-arbetssatt');
        if (vad === 'kortsvar') {
          visa('kortsvar');
          if (window.Kortsvar && kortsvar) { Kortsvar.starta(kortsvar); }
        } else if (LAGE[vad]) {
          startaFlip(LAGE[vad]);
        }
      });
    });

    if (kortsvar) { kortsvar.addEventListener('kortsvar:stang', function () { visa(null); }); }

    if (flip) {
      new MutationObserver(function () {
        if (aktiv === 'flip' && startskarmSyns()) { visa(null); }   // sessionen slut → tillbaka till väljaren
      }).observe(flip, { childList: true, subtree: true });
    }

    visa(null);
  }

  function start() {
    document.querySelectorAll('.flik-innehall[data-flik="ova"]').forEach(initPanel);
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', start); } else { start(); }
})();
