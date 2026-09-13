// kortsvar.js – "Testa dig själv": kortsvarsfrågor med omedelbar rättning.
//
// Monteras i <div class="kortsvar-mount" data-fil="../../data/kortsvar/avsnitt-N-{slug}.json">.
// Frågorna laddas vid sidladdning men ingenting ritas förrän window.Kortsvar.starta(mount)
// anropas (av js/ova-arbetssatt.js när eleven väljer arbetssättet). Vid "Tillbaka" skickar
// mounten händelsen 'kortsvar:stang'.
//
// Formativt: ingen localStorage, ingen progress, inget sparas. Varje omgång = slumpat urval om
// antal_per_omgang frågor i blandad ordning. Rätt → bekräftelse. Fel → facit + förklaring direkt
// (skiftlägesfel på formel får sin egen förklaring). Alla rätt → belöning.
//
// Beroenden: js/kortsvar-gradering.js (FÖRE denna fil). window.KemiFormler (valfri) typesettar
// formler i frågor, alternativ och facit; saknas den är anropet en no-op.
// Inget i filen är kemispecifikt.

(function () {
  'use strict';

  var G = window.KortsvarGradering;

  function el(tagg, klass, text) {
    var e = document.createElement(tagg);
    if (klass) { e.className = klass; }
    if (text != null) { e.textContent = text; }
    return e;
  }
  function blanda(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function typeset(node) { if (window.KemiFormler) { KemiFormler.typeset(node); } }

  function initKortsvar(mount) {
    var FIL = mount.getAttribute('data-fil');
    var data = null, laddFel = null;
    var omgang = [], index = 0, ratt = 0, svarat = false;

    var laddad = !FIL ? Promise.resolve() : fetch(FIL)
      .then(function (r) { if (!r.ok) { throw new Error('HTTP ' + r.status); } return r.json(); })
      .then(function (d) {
        var fel = G.validera(d);
        if (fel.length) { throw new Error('Ogiltig kortsvarsfil (' + FIL + '):\n' + fel.join('\n')); }
        data = d;
      })
      .catch(function (e) { laddFel = e; console.warn('Kortsvar:', e.message); });

    // ---- omgång ----
    function nyOmgang() {
      var alla = blanda(data.fragor);
      var n = data.antal_per_omgang ? Math.min(data.antal_per_omgang, alla.length) : alla.length;
      omgang = alla.slice(0, n);
      index = 0; ratt = 0;
      visaFraga();
    }

    function ram() {
      mount.innerHTML = '';
      var box = el('div', 'kortsvar');
      var huvud = el('div', 'ks-huvud');
      huvud.appendChild(el('span', 'ks-etikett', 'Testa dig själv'));
      huvud.appendChild(el('span', 'ks-raknare'));
      box.appendChild(huvud);
      var prog = el('div', 'ks-progress');
      var spar = el('div', 'ks-progress-spar'); spar.appendChild(el('div', 'ks-progress-fyll')); prog.appendChild(spar);
      box.appendChild(prog);
      box.appendChild(el('div', 'ks-scen'));
      mount.appendChild(box);
      return box;
    }
    function uppdateraHuvud() {
      var r = mount.querySelector('.ks-raknare'), f = mount.querySelector('.ks-progress-fyll');
      if (r) { r.textContent = 'Fråga ' + (index + 1) + ' av ' + omgang.length; }
      if (f) { f.style.width = Math.round((index / omgang.length) * 100) + '%'; }
    }

    // ---- fråga ----
    function visaFraga() {
      if (!mount.querySelector('.ks-scen')) { ram(); }
      var scen = mount.querySelector('.ks-scen');
      scen.innerHTML = '';
      svarat = false;
      var f = omgang[index];
      var kort = el('div', 'ks-kort typ-' + f.typ);
      kort.setAttribute('data-fraga-id', f.id);
      kort.appendChild(el('div', 'ks-fraga', f.fraga));
      var inmatning = el('div', 'ks-inmatning');
      var lasSvar = byggInmatning(f, inmatning);
      kort.appendChild(inmatning);
      var aterkoppling = el('div', 'ks-aterkoppling dold');
      kort.appendChild(aterkoppling);
      scen.appendChild(kort);

      var rad = el('div', 'ks-knapprad');
      var ratta = el('button', 'ks-knapp', 'Rätta');
      ratta.type = 'button';
      rad.appendChild(ratta);
      var nasta = el('button', 'ks-knapp dold', index + 1 < omgang.length ? 'Nästa fråga' : 'Visa resultat');
      nasta.type = 'button';
      rad.appendChild(nasta);
      scen.appendChild(rad);

      function ratt_() {
        if (svarat) { return; }
        var r = G.gradera(f, lasSvar());
        if (r.status === 'tomt') { aterkoppling.className = 'ks-aterkoppling tomt'; aterkoppling.textContent = 'Skriv eller välj ett svar först.'; return; }
        svarat = true;
        inmatning.querySelectorAll('input, button').forEach(function (i) { i.disabled = true; });
        aterkoppling.innerHTML = '';
        if (r.status === 'ratt') {
          ratt++;
          aterkoppling.className = 'ks-aterkoppling ratt';
          aterkoppling.appendChild(el('div', 'ks-status', '✓ Rätt!'));
        } else {
          aterkoppling.className = 'ks-aterkoppling fel' + (r.skiftlage ? ' skiftlage' : '');
          aterkoppling.appendChild(el('div', 'ks-status', r.skiftlage ? '✗ Nästan' : '✗ Inte riktigt'));
          var facitRad = el('div', 'ks-facit');
          facitRad.appendChild(el('span', 'ks-facit-etikett', 'Rätt svar: '));
          facitRad.appendChild(el('span', 'ks-facit-varde', r.facit));
          aterkoppling.appendChild(facitRad);
          aterkoppling.appendChild(el('div', 'ks-forklaring', r.forklaring));
        }
        typeset(aterkoppling);
        ratta.classList.add('dold');
        nasta.classList.remove('dold');
        nasta.focus();
      }
      ratta.addEventListener('click', ratt_);
      kort.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !svarat && e.target.tagName !== 'BUTTON') { e.preventDefault(); ratt_(); } });
      nasta.addEventListener('click', function () {
        index++;
        if (index < omgang.length) { visaFraga(); } else { visaResultat(); }
      });

      uppdateraHuvud();
      typeset(kort);
      var forsta = inmatning.querySelector('input[type="text"]');
      if (forsta) { forsta.focus(); }
    }

    // Bygger inmatningen för en frågetyp och returnerar en funktion som läser svaret.
    function byggInmatning(f, wrap) {
      if (f.typ === 'flerval' || f.typ === 'markera') {
        var alternativ = f.alternativ.map(function (a, i) { return { text: a, i: i }; });
        var namn = 'ks-' + f.id;
        blanda(alternativ).forEach(function (a) {
          var lbl = el('label', 'ks-alternativ');
          var inp = el('input'); inp.type = f.typ === 'flerval' ? 'radio' : 'checkbox'; inp.name = namn; inp.value = String(a.i);
          lbl.appendChild(inp);
          lbl.appendChild(el('span', null, a.text));
          wrap.appendChild(lbl);
        });
        return function () {
          var valda = Array.prototype.slice.call(wrap.querySelectorAll('input:checked')).map(function (i) { return i.value; });
          return f.typ === 'flerval' ? (valda[0] != null ? valda[0] : '') : valda;
        };
      }
      if (f.typ === 'tal-par') {
        var a1 = el('input', 'ks-text kort'), a2 = el('input', 'ks-text kort');
        a1.type = 'text'; a2.type = 'text';
        a1.setAttribute('aria-label', 'Första talet'); a2.setAttribute('aria-label', 'Andra talet');
        wrap.appendChild(a1); wrap.appendChild(el('span', 'ks-och', 'och')); wrap.appendChild(a2);
        return function () { return [a1.value, a2.value]; };
      }
      var inp = el('input', 'ks-text');
      inp.type = 'text';
      inp.setAttribute('autocomplete', 'off');
      inp.setAttribute('spellcheck', 'false');
      inp.placeholder = { tal: 'Skriv ett tal', ord: 'Skriv ett ord', formel: 'Skriv formeln, t.ex. H2O' }[f.typ] || '';
      inp.setAttribute('aria-label', 'Ditt svar');
      wrap.appendChild(inp);
      return function () { return inp.value; };
    }

    // ---- resultat ----
    function visaResultat() {
      var scen = mount.querySelector('.ks-scen');
      scen.innerHTML = '';
      var f = mount.querySelector('.ks-progress-fyll'); if (f) { f.style.width = '100%'; }
      var r = mount.querySelector('.ks-raknare'); if (r) { r.textContent = 'Klart'; }
      var allaRatt = ratt === omgang.length;
      var box = el('div', 'ks-resultat' + (allaRatt ? ' alla-ratt' : ''));
      box.appendChild(el('h3', null, allaRatt ? 'Alla rätt!' : 'Du hade ' + ratt + ' av ' + omgang.length + ' rätt'));
      box.appendChild(el('p', null, allaRatt ? 'Hela omgången utan ett enda fel. Bra jobbat.' :
        (ratt >= omgang.length * 0.7 ? 'Bra – kolla förklaringarna till de du missade, och prova igen.' : 'Läs på i Läs-fliken och prova igen. Förklaringarna visar var det brast.')));
      if (allaRatt) { box.appendChild(konfetti()); }
      var rad = el('div', 'ks-knapprad');
      var igen = el('button', 'ks-knapp', 'Försök igen'); igen.type = 'button';
      igen.addEventListener('click', nyOmgang);
      var tillbaka = el('button', 'ks-knapp sekundar', 'Tillbaka'); tillbaka.type = 'button';
      tillbaka.addEventListener('click', function () { mount.innerHTML = ''; mount.dispatchEvent(new CustomEvent('kortsvar:stang', { bubbles: true })); });
      rad.appendChild(igen); rad.appendChild(tillbaka);
      box.appendChild(rad);
      scen.appendChild(box);
    }
    function konfetti() {
      var k = el('div', 'ks-konfetti');
      k.setAttribute('aria-hidden', 'true');
      for (var i = 0; i < 36; i++) {
        var bit = el('span');
        bit.style.left = (Math.random() * 100) + '%';
        bit.style.animationDelay = (Math.random() * 0.8) + 's';
        bit.style.animationDuration = (1.6 + Math.random() * 1.2) + 's';
        bit.style.transform = 'rotate(' + Math.round(Math.random() * 360) + 'deg)';
        k.appendChild(bit);
      }
      return k;
    }

    // ---- publikt ----
    mount._kortsvar = {
      starta: function () {
        return laddad.then(function () {
          if (laddFel || !data) {
            mount.innerHTML = '';
            mount.appendChild(el('p', 'kortsvar-fel', 'Kortsvarsfrågor finns inte för detta avsnitt ännu.'));
            return;
          }
          nyOmgang();
        });
      },
      stang: function () { mount.innerHTML = ''; }
    };
  }

  document.querySelectorAll('.kortsvar-mount').forEach(initKortsvar);

  window.Kortsvar = {
    starta: function (mount) { return mount._kortsvar ? mount._kortsvar.starta() : Promise.resolve(); },
    stang: function (mount) { if (mount._kortsvar) { mount._kortsvar.stang(); } }
  };
})();
