// probe-bilder.js – bildkontroll på en avsnittssida (via verktyg/verifiera.js):
// alla bilder laddar, varje Enkel-figur har en .bildguide direkt före sig, ingen bildguide på
// Standard/Fördjupning, alt-text identisk mellan nivåer för samma bildfil, bildtext finns.
(async function () {
  const qa = s => Array.from(document.querySelectorAll(s));
  await new Promise(r => setTimeout(r, 1200));
  const figs = qa('.niva-innehall figure').map(f => {
    const img = f.querySelector('img'), niva = f.closest('.niva-innehall').dataset.niva, u = f.closest('.underdel-text').dataset.underdel;
    const fore = f.previousElementSibling;
    return { u, niva, src: img.getAttribute('src'), laddad: img.complete && img.naturalWidth > 0, alt: img.getAttribute('alt') || '',
      bildtext: (f.querySelector('figcaption') || {}).textContent || '', guideFore: !!(fore && fore.classList.contains('bildguide')), klass: f.className };
  });
  const fel = [];
  figs.forEach(f => {
    if (!f.laddad) { fel.push(`laddar inte: ${f.src} (${f.u}/${f.niva})`); }
    if (!f.bildtext.trim()) { fel.push(`bildtext saknas: ${f.src} (${f.u}/${f.niva})`); }
    if (!f.alt.trim()) { fel.push(`alt saknas: ${f.src} (${f.u}/${f.niva})`); }
    if (f.niva === 'enkel' && !f.guideFore) { fel.push(`bildguide saknas före: ${f.src} (${f.u}/enkel)`); }
    if (!f.klass.includes(f.niva)) { fel.push(`figure-klass matchar inte nivå: ${f.src} (${f.u}/${f.niva}) ${f.klass}`); }
  });
  // bildguider på fel nivå
  qa('.niva-innehall .bildguide').forEach(g => { const n = g.closest('.niva-innehall').dataset.niva; if (n !== 'enkel') { fel.push(`bildguide på ${n}`); } });
  // alt identisk per bildfil
  const perSrc = {};
  figs.forEach(f => { (perSrc[f.src] = perSrc[f.src] || []).push(f); });
  Object.entries(perSrc).forEach(([src, l]) => { if (new Set(l.map(f => f.alt)).size > 1) { fel.push(`alt skiljer mellan nivåer: ${src}`); } });
  return { figurer: figs.length, bildfiler: Object.keys(perSrc).length, perNiva: { enkel: figs.filter(f => f.niva === 'enkel').length, standard: figs.filter(f => f.niva === 'standard').length, fordjupning: figs.filter(f => f.niva === 'fordjupning').length },
    bildguider: qa('.bildguide').length, fel, bildkommentarerKvar: (document.documentElement.innerHTML.match(/<!-- BILD: /g) || []).length };
})()
