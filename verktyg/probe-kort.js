// probe-kort.js – vänder ALLA flipcards på en avsnittssida via Öva-flikens arbetssätt
// (Plugga begrepp = begreppskort, Tillämpa = modellkort). Kontrollerar per kort: formler typesatta
// på fram- och baksida (inga tomma containrar, inget rått \ce{), och räknar korten mot JSON:en.
(async function () {
  const q = s => document.querySelector(s), qa = s => Array.from(document.querySelectorAll(s));
  const sl = ms => new Promise(r => setTimeout(r, ms));
  await MathJax.startup.promise; await sl(600);
  q('.flik[data-flik=ova]').click(); await sl(400);
  const flip = q('.flipcards-mount');
  const data = await (await fetch(flip.getAttribute('data-fil'))).json();
  const raw = /\\ce\{/;
  const R = { json: { begrepp: data.begreppskort.length, modell: data.modellkort.length, formelIJson: [...data.begreppskort, ...data.modellkort].filter(k => raw.test(k.fraga + k.svar)).length }, kort: [], fel: [] };
  async function lage(arbetssatt) {
    q('.ova-kort[data-arbetssatt=' + arbetssatt + ']').click(); await sl(600);
    for (let i = 0; i < 60; i++) {
      const fr = flip.querySelector('.flip-fraga'); if (!fr) { break; }
      const fram = { mjx: fr.querySelectorAll('mjx-container').length, tomma: fr.querySelectorAll('mjx-container:not(:has(mjx-math))').length, raw: raw.test(fr.innerText) };
      flip.querySelector('.flip-vand-knapp').click(); await sl(650);
      const sv = flip.querySelector('.flip-svar');
      const bak = { mjx: sv ? sv.querySelectorAll('mjx-container').length : -1, tomma: sv ? sv.querySelectorAll('mjx-container:not(:has(mjx-math))').length : -1, raw: sv ? raw.test(sv.innerText) : true };
      R.kort.push({ lage: arbetssatt, nr: i + 1, fram, bak });
      if (fram.raw || bak.raw) { R.fel.push(`${arbetssatt}#${i + 1}: rått \\ce{ kvar`); }
      if (fram.tomma || bak.tomma > 0) { R.fel.push(`${arbetssatt}#${i + 1}: tom MathJax-container`); }
      const knapp = flip.querySelector('.flip-vand-knapp'), sista = /Avsluta/.test(knapp.textContent);
      knapp.click(); await sl(350);
      if (sista) { break; }
      if (flip.querySelector('.flip-interstitial')) { flip.querySelector('.flip-interstitial .flip-knapp').click(); await sl(350); }
    }
    const igen = qa('.flipcards .flip-knapp').find(b => /Plugga igen/.test(b.textContent)); if (igen) { igen.click(); await sl(400); }
  }
  await lage('begrepp');
  await lage('tillampa');
  const vanda = { begrepp: R.kort.filter(k => k.lage === 'begrepp').length, tillampa: R.kort.filter(k => k.lage === 'tillampa').length };
  if (vanda.begrepp !== R.json.begrepp) { R.fel.push(`begreppskort: vände ${vanda.begrepp}, JSON har ${R.json.begrepp}`); }
  if (vanda.tillampa !== R.json.modell) { R.fel.push(`modellkort: vände ${vanda.tillampa}, JSON har ${R.json.modell}`); }
  R.summering = { vanda, medFormel: R.kort.filter(k => k.fram.mjx || k.bak.mjx > 0).length, formelIJson: R.json.formelIJson, valjareTillbaka: !!(q('.ova-valjare') && q('.ova-valjare').offsetParent) };
  return R;
})()
