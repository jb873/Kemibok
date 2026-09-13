// probe-ova.js – Öva-flikens tre arbetssätt + kortsvar, körs via verktyg/verifiera.js på en avsnittssida
// med flipcards- och kortsvars-JSON. Kontrollerar: väljaren syns och plattformens startskärm är dold,
// Plugga begrepp → begreppskort, Tillämpa → modellkort, Avsluta → väljaren igen, dolda lägen i
// dropdown, kortsvar: rätt/fel/skiftläge/förklaring/tomt, formler typesatta, belöning vid alla rätt.
(async function () {
  const q = s => document.querySelector(s), qa = s => Array.from(document.querySelectorAll(s));
  const sl = ms => new Promise(r => setTimeout(r, ms));
  const synlig = e => !!(e && e.offsetParent !== null);
  await MathJax.startup.promise; await sl(800);
  q('.flik[data-flik=ova]').click(); await sl(400);
  const panel = q('.flik-innehall[data-flik=ova]'), valj = q('.ova-valjare'), flip = q('.flipcards-mount'), ks = q('.kortsvar-mount');
  const R = { start: { valjareSynlig: synlig(valj), kort: qa('.ova-kort .ova-kort-titel').map(t => t.textContent), flipDold: !synlig(flip), plattformStartskarmIDom: !!flip.querySelector('.flip-borja-knapp'), plattformStartskarmSynlig: synlig(flip.querySelector('.flip-borja-knapp')) } };

  // Plugga begrepp
  q('.ova-kort[data-arbetssatt=begrepp]').click(); await sl(600);
  R.begrepp = { flipSynlig: synlig(flip), valjareDold: !synlig(valj), etikett: (flip.querySelector('.flip-etikett') || {}).textContent, lage: (flip.querySelector('.flip-lage-vald') || {}).textContent,
    dropdownDolda: qa('.flip-lage-dropdown button').filter(b => !synlig(b) && /niva3|anpassa/.test(b.dataset.lage)).length, dropdownSynliga: qa('.flip-lage-dropdown button').filter(b => synlig(b)).map(b => b.dataset.lage) };
  // avsluta → väljaren
  qa('.flipcards .flip-knapp').find(b => /Vänd kortet/.test(b.textContent)).click(); await sl(500);   // Avsluta finns på baksidan
  qa('.flipcards .flip-knapp').find(b => /^Avsluta$/.test(b.textContent.trim())).click(); await sl(300);
  const igen = qa('.flipcards .flip-knapp').find(b => /Plugga igen/.test(b.textContent)); if (igen) { igen.click(); await sl(300); }
  R.efterAvsluta = { valjareSynlig: synlig(valj), flipDold: !synlig(flip) };

  // Tillämpa
  q('.ova-kort[data-arbetssatt=tillampa]').click(); await sl(600);
  R.tillampa = { etikett: (flip.querySelector('.flip-etikett') || {}).textContent, lage: (flip.querySelector('.flip-lage-vald') || {}).textContent.trim() };
  qa('.flipcards .flip-knapp').find(b => /Vänd kortet/.test(b.textContent)).click(); await sl(500);
  qa('.flipcards .flip-knapp').find(b => /^Avsluta$/.test(b.textContent.trim())).click(); await sl(300);
  const igen2 = qa('.flipcards .flip-knapp').find(b => /Plugga igen/.test(b.textContent)); if (igen2) { igen2.click(); await sl(300); }

  // Testa dig själv
  q('.ova-kort[data-arbetssatt=kortsvar]').click(); await sl(600);
  R.kortsvar = { synlig: synlig(ks), valjareDold: !synlig(valj), raknare: (ks.querySelector('.ks-raknare') || {}).textContent, mjxIFraga: ks.querySelectorAll('mjx-container').length, steg: [] };
  const G = window.KortsvarGradering;
  // hitta frågorna i omgången via UI: vi svarar fel på första, rätt på resten, plus tomt-test
  const data = await (await fetch(ks.getAttribute('data-fil'))).json();
  const byId = {}; data.fragor.forEach(f => { byId[f.id] = f; });
  const aktuell = () => byId[ks.querySelector('.ks-kort').getAttribute('data-fraga-id')];
  const RATT = { tal: f => String(f.svar), 'tal-par': f => f.svar.map(String), flerval: f => String(f.svar), markera: f => f.svar, ord: f => f.svar[0], formel: f => f.svar[0] };
  const ratta = f => RATT[f.typ](f);
  async function svara(varde) {
    const kort = ks.querySelector('.ks-kort');
    if (kort.querySelector('input[type=radio], input[type=checkbox]')) {
      const v = Array.isArray(varde) ? varde.map(String) : [String(varde)];
      kort.querySelectorAll('input').forEach(i => { if (v.includes(i.value)) { i.click(); } });
    } else {
      const ins = kort.querySelectorAll('input[type=text]');
      const v = Array.isArray(varde) ? varde : [varde];
      ins.forEach((i, k) => { i.value = v[k] != null ? v[k] : ''; });
    }
    qa('.ks-knapp').find(b => /Rätta/.test(b.textContent)).click(); await sl(300);
  }
  const antal = parseInt((ks.querySelector('.ks-raknare').textContent.match(/av (\d+)/) || [])[1], 10);
  for (let i = 0; i < antal; i++) {
    const f = aktuell();
    const steg = { typ: f ? f.typ : '?', mjx: ks.querySelectorAll('.ks-fraga mjx-container, .ks-alternativ mjx-container').length };
    if (i === 0) {   // tomt → sedan fel
      qa('.ks-knapp').find(b => /Rätta/.test(b.textContent)).click(); await sl(200);
      steg.tomt = (ks.querySelector('.ks-aterkoppling') || {}).className;
      await svara(f.typ === 'flerval' ? String((f.svar + 1) % f.alternativ.length) : (f.typ === 'markera' ? [] : (f.typ === 'tal-par' ? ['0', '0'] : 'xyz999')));
      if (f.typ === 'markera') { await svara([String((f.svar[0] + 1) % f.alternativ.length)]); }
    } else if (f && f.typ === 'formel' && !steg.skiftlageTestat) {
      await svara(f.svar[0].toLowerCase());   // skiftlägesfel
      steg.skiftlageTestat = true;
    } else {
      await svara(ratta(f));
    }
    const ak = ks.querySelector('.ks-aterkoppling');
    steg.aterkoppling = ak.className.replace('ks-aterkoppling ', '');
    steg.forklaringVisad = !!ak.querySelector('.ks-forklaring');
    steg.forklaringText = (ak.querySelector('.ks-forklaring') || {}).textContent;
    steg.facitMjx = ak.querySelectorAll('mjx-container').length;
    R.kortsvar.steg.push(steg);
    qa('.ks-knapp').find(b => /Nästa fråga|Visa resultat/.test(b.textContent)).click(); await sl(300);
  }
  R.kortsvar.resultat = { rubrik: (ks.querySelector('.ks-resultat h3') || {}).textContent, allaRatt: !!ks.querySelector('.ks-resultat.alla-ratt'), konfetti: ks.querySelectorAll('.ks-konfetti span').length };
  // ny omgång: svara rätt på allt → belöning
  qa('.ks-knapp').find(b => /Försök igen/.test(b.textContent)).click(); await sl(300);
  const antal2 = parseInt((ks.querySelector('.ks-raknare').textContent.match(/av (\d+)/) || [])[1], 10);
  for (let i = 0; i < antal2; i++) {
    const f = aktuell();
    await svara(ratta(f));
    qa('.ks-knapp').find(b => /Nästa fråga|Visa resultat/.test(b.textContent)).click(); await sl(250);
  }
  R.kortsvar.allaRatt = { rubrik: (ks.querySelector('.ks-resultat h3') || {}).textContent, allaRatt: !!ks.querySelector('.ks-resultat.alla-ratt'), konfetti: ks.querySelectorAll('.ks-konfetti span').length, antal: antal2 };
  qa('.ks-knapp').find(b => /Tillbaka/.test(b.textContent)).click(); await sl(200);
  R.efterKortsvar = { valjareSynlig: synlig(valj), kortsvarDold: !synlig(ks) };
  R.localStorageKortsvar = Object.keys(localStorage).filter(k => /kortsvar|ks-/.test(k)).length;
  return R;
})()
