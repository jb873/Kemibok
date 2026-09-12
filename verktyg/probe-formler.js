// probe-formler.js — körs i avsnitt 1 via verktyg/verifiera.js. Kontrollerar MathJax+mhchem
// (löptext, dold nivå, flipcard fram/bak), disabled-nivåknapp, faktaruta-CSS, fonter, hero.
// Kräver --pre verktyg/pre-flipcards-fixtur.js så länge ingen riktig flipcards-JSON finns.
(async function () {
  const R = {};
  const q = s => document.querySelector(s), qa = s => Array.from(document.querySelectorAll(s));
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const mjInfo = c => c ? { finns: true, harMath: !!c.querySelector('mjx-math'), bredd: Math.round(c.getBoundingClientRect().width), hojd: Math.round(c.getBoundingClientRect().height), fontPx: getComputedStyle(c).fontSize, raatext: /\\ce\{/.test(c.textContent) } : { finns: false };

  // 0. MathJax klar?
  await MathJax.startup.promise; await sleep(300);
  R.mathjax = { version: MathJax.version, mhchemLaddad: !!(MathJax._ && MathJax._.input && MathJax._.input.tex && MathJax._.input.tex.mhchem), typesetPromise: typeof MathJax.typesetPromise, menu: !!MathJax.startup.document.menu };

  // 1. Formel i löptext (synlig standard-nivå)
  const std = q('.underdel-text[data-underdel="a"] .niva-innehall[data-niva="standard"]');
  R.fall1_lopText = { antalContainers: std.querySelectorAll('mjx-container').length, inline: mjInfo(std.querySelector('p mjx-container')), display: mjInfo(std.querySelector('.formel mjx-container')), raaCeKvar: /\\ce\{/.test(std.innerText) };
  const pStd = std.querySelector('p'); R.fall1_lopText.brodtextFontPx = getComputedStyle(pStd).fontSize;

  // 3. Formel i dold nivå (Enkel) – före och efter visning
  const enk = q('.underdel-text[data-underdel="a"] .niva-innehall[data-niva="enkel"]');
  R.fall3_doldNiva = { doldVidLaddning: enk.classList.contains('dold'), typesattMedanDold: mjInfo(enk.querySelector('mjx-container')) };
  q('.niva-knapp[data-niva="enkel"]').click(); await sleep(100);
  R.fall3_doldNiva.efterVisning = mjInfo(enk.querySelector('mjx-container'));
  R.fall3_doldNiva.jamforStandardInline = mjInfo(std.querySelector('p mjx-container'));
  q('.niva-knapp[data-niva="standard"]').click();

  // 5. Nivå-disabled: alla nivåer finns på denna sida → inget disabled
  R.fall5_disabled = { allaFinns_disabled: qa('.niva-knapp[disabled]').length };
  // simulera saknad fördjupning i underdel B
  q('.underdel-text[data-underdel="b"] .niva-innehall[data-niva="fordjupning"]').remove();
  q('.niva-knapp[data-niva="fordjupning"]').click(); await sleep(50);
  R.fall5_disabled.aktivNivaA = q('.niva-knapp.aktiv').dataset.niva;
  q('.underdel-knapp[data-underdel="b"]').click(); await sleep(50);
  R.fall5_disabled.underdelB = { fordjKnappDisabled: q('.niva-knapp[data-niva="fordjupning"]').disabled, ariaDisabled: q('.niva-knapp[data-niva="fordjupning"]').getAttribute('aria-disabled'), aktivNiva: q('.niva-knapp.aktiv').dataset.niva, synligtBlock: qa('.underdel-text[data-underdel="b"] .niva-innehall:not(.dold)').map(b => b.dataset.niva), sparatVal: localStorage.getItem(q('.niva-valjare').dataset.nivaNyckel) };
  q('.underdel-knapp[data-underdel="a"]').click(); await sleep(50);
  R.fall5_disabled.tillbakaA = { fordjKnappDisabled: q('.niva-knapp[data-niva="fordjupning"]').disabled, aktivNiva: q('.niva-knapp.aktiv').dataset.niva, synligtBlock: qa('.underdel-text[data-underdel="a"] .niva-innehall:not(.dold)').map(b => b.dataset.niva) };
  q('.niva-knapp[data-niva="standard"]').click(); q('.underdel-knapp[data-underdel="a"]').click();

  // 6. Faktaruta – CSS träffar?
  const fr = q('.faktaruta'); const cs = getComputedStyle(fr); const h3 = getComputedStyle(fr.querySelector('h3'));
  R.fall6_faktaruta = { tag: fr.tagName, borderLeft: cs.borderLeftWidth + ' ' + cs.borderLeftColor, maxWidth: cs.maxWidth, bredd: Math.round(fr.getBoundingClientRect().width), brodtextBredd: Math.round(pStd.getBoundingClientRect().width), h3Font: h3.fontFamily.split(',')[0], h3Size: h3.fontSize, h3Color: h3.color, strongColor: getComputedStyle(fr.querySelector('p > strong')).color, sammanfattningBorderTop: getComputedStyle(fr.querySelector('.faktaruta-sammanfattning')).borderTopWidth };

  // 7. Fonter + hero + karnpunkter-rubrik
  await document.fonts.ready;
  R.fonter = { ebGaramond: document.fonts.check('19px "EB Garamond"'), marcellus: document.fonts.check('19px "Marcellus SC"'), laddade: Array.from(document.fonts).filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.style + ' ' + f.weight) };
  R.hero = { bg: getComputedStyle(q('.hero-banner')).backgroundImage, labelColor: getComputedStyle(q('.hero-banner .avsnitt-label')).color, h1Font: getComputedStyle(q('.hero-banner h1')).fontFamily.split(',')[0] };
  R.karnpunkterRubrik = { fontSize: getComputedStyle(q('.karnpunkter-rubrik')).fontSize, color: getComputedStyle(q('.karnpunkter-rubrik')).color };
  R.forelasningFlik = { disabled: q('.flik[data-flik="forelasning"]').disabled };

  // 2. Flipcards: Öva → Börja plugga (niva1 = begreppskort) → fram → vänd → bak
  q('.flik[data-flik="ova"]').click(); await sleep(300);
  const mount = q('.flipcards-mount');
  R.fall2_flipcard = { startskarm: !!mount.querySelector('.flip-borja-knapp') };
  mount.querySelector('.flip-borja-knapp').click(); await sleep(600);
  const fraga = mount.querySelector('.flip-fraga');
  R.fall2_flipcard.fram = { text: fraga.textContent.slice(0, 60), mj: mjInfo(fraga.querySelector('mjx-container')), raaCeKvar: /\\ce\{/.test(fraga.innerText) };
  mount.querySelector('.flip-vand-knapp').click(); await sleep(800);
  const svar = mount.querySelector('.flip-svar');
  R.fall2_flipcard.bak = { antalContainers: svar.querySelectorAll('mjx-container').length, inline: mjInfo(svar.querySelector('p mjx-container')), display: mjInfo(svar.querySelector('mjx-container[display="true"]')), strongFinns: !!svar.querySelector('strong'), raaCeKvar: /\\ce\{/.test(svar.innerText) };
  mount.querySelector('.flip-vand-knapp').click(); await sleep(400);
  const f2 = mount.querySelector('.flip-fraga');
  R.fall2_flipcard.kort2 = { text: f2 ? f2.textContent : null, containers: mount.querySelectorAll('.flip-fraga mjx-container').length };
  return R;
})()
