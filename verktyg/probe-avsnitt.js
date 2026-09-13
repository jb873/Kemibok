// probe-avsnitt.js – generell kontroll av en avsnittssida i Chromium (via verktyg/verifiera.js):
// alla nivåblock per underdel (ord, formler, tomma MathJax-containrar), rått \ce{ kvar,
// disabled-knappar per underdel, aktiva bilder som saknas, och fallback-sekvensen när en
// nivå saknas (A-Fördjupning → underdel utan fördjupning → Standard → tillbaka).
(async function () {
  const q = s => document.querySelector(s), qa = s => Array.from(document.querySelectorAll(s));
  const sl = ms => new Promise(r => setTimeout(r, ms));
  await MathJax.startup.promise; await sl(400);
  const R = { underdelar: qa('.underdel-text').map(u => u.dataset.underdel), nivaer: [], disabled: {}, fallback: null };
  const nivaer = ['enkel', 'standard', 'fordjupning'];
  for (const u of R.underdelar) for (const n of nivaer) {
    const b = q(`.underdel-text[data-underdel="${u}"] .niva-innehall[data-niva="${n}"]`);
    if (!b) { R.nivaer.push({ u, n, saknas: true }); continue; }
    R.nivaer.push({ u, n, ord: b.textContent.trim().split(/\s+/).length, mjx: b.querySelectorAll('mjx-container').length,
      tomma: b.querySelectorAll('mjx-container:not(:has(mjx-math))').length, formelDiv: b.querySelectorAll('.formel').length,
      raw: /\\ce\{/.test(b.innerText), figurer: b.querySelectorAll('figure').length, karnpunkter: b.querySelectorAll('.karnpunkter').length });
  }
  // disabled-läge per underdel
  for (const u of R.underdelar) {
    q(`.underdel-knapp[data-underdel="${u}"]`).click(); await sl(80);
    R.disabled[u] = qa('.niva-knapp[disabled]').map(k => k.dataset.niva);
  }
  // fallback-sekvens om någon underdel saknar fördjupning
  const utan = R.underdelar.find(u => R.disabled[u].includes('fordjupning'));
  const med = R.underdelar.find(u => !R.disabled[u].includes('fordjupning'));
  if (utan && med) {
    q(`.underdel-knapp[data-underdel="${med}"]`).click(); await sl(50);
    q('.niva-knapp[data-niva="fordjupning"]').click(); await sl(50);
    const steg1 = { underdel: med, aktiv: q('.niva-knapp.aktiv').dataset.niva, synligt: qa('.underdel-text:not(.dold) .niva-innehall:not(.dold)').map(b => b.dataset.niva) };
    q(`.underdel-knapp[data-underdel="${utan}"]`).click(); await sl(50);
    const steg2 = { underdel: utan, aktiv: q('.niva-knapp.aktiv').dataset.niva, synligt: qa('.underdel-text:not(.dold) .niva-innehall:not(.dold)').map(b => b.dataset.niva), fordjDisabled: q('.niva-knapp[data-niva="fordjupning"]').disabled, aria: q('.niva-knapp[data-niva="fordjupning"]').getAttribute('aria-disabled'), sparat: localStorage.getItem(q('.niva-valjare').dataset.nivaNyckel) };
    q(`.underdel-knapp[data-underdel="${med}"]`).click(); await sl(50);
    const steg3 = { underdel: med, aktiv: q('.niva-knapp.aktiv').dataset.niva, synligt: qa('.underdel-text:not(.dold) .niva-innehall:not(.dold)').map(b => b.dataset.niva), fordjDisabled: q('.niva-knapp[data-niva="fordjupning"]').disabled };
    R.fallback = { steg1, steg2, steg3 };
    q('.niva-knapp[data-niva="standard"]').click();
  }
  q(`.underdel-knapp[data-underdel="${R.underdelar[0]}"]`).click();
  R.aktivaBilderSomSaknas = qa('figure img').filter(i => !(i.complete && i.naturalWidth > 0)).map(i => i.getAttribute('src'));
  R.bildkommentarer = (document.documentElement.innerHTML.match(/<!-- BILD: /g) || []).length;
  R.forelasningDisabled = q('.flik[data-flik="forelasning"]').disabled;
  return R;
})()
