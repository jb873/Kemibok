// lib-kondensation.js – den gemensamma uppställningen för kondensationsbilderna: L9 esterbindning (Organiska syror och estrar),
// M3 glykosidbindning och M7 peptidbindning (Livets molekyler). Ordern 2026-09-19: "M3, M7 och L9 ska ha identisk uppställning …
// Samma antal steg, i samma ordning, med samma stegetiketter. Samma placering av de två utgångsämnena – det som lämnar OH till
// vänster, det som lämnar H till höger. Samma gula markering på de delar som ska lämna. Samma ruta för vattenmolekylen, på samma
// plats. Samma grön markering på den nya bindningen i sista steget. Samma bildbredd och samma höjd per steg."
//
// Alla koordinater är L9:s ursprungliga (bilder-svg-syror-estrar.js 2026-09-18), så att L9 byggs byte-identiskt genom mallen.
// Molekylerna ritas av anroparen i tre callbacks; allt annat (stegrubriker, "dessa två lämnar", vattenrutan, pilen, stegtexten,
// ordreaktionen med dubbelpil) kommer härifrån. mall() ger mallens egna element för den programmatiska jämförelsen.
'use strict';
const B = require('./lib-svg-bokstav.js');
const { INK, SIGN, GUL, txt, linje, rekt, pil, cirkel, molekyl, H, rita, formelO, DX } = B;

const W = 960, HH = 720, Y1 = 120, Y2 = 340, Y3 = 560, XS = 140, XA = 560;   // XS/XA: L9:s startpunkter för vänster/höger molekyl
const stegRub = (y, t) => txt(30, y, t, `font-size="14" font-style="italic" fill="${SIGN}" text-anchor="start"`);
// gul markering bakom en atom som ska lämna (sätts som a.bak på atomen före rita)
const lamnar = (a, tag) => cirkel(a.x, a.y, 15, GUL, 'none', 0, `fill-opacity="0.75" data-lamnar="${tag}"`);
// grön ring + etikett på den nya bindningen i steg 3 (samma stil i alla tre bilderna)
const bindRing = (x, y, etikett, tag, dy = 72) => B.ellips(x, y, 30, 20, `data-ring="${tag}" data-steg="3"`) + linje(x, y + 22, x, y + dy - 16, SIGN, 1.2) + txt(x, y + dy, etikett, `font-size="14" font-weight="bold" fill="${SIGN}"`);   // dy: etikettens avstånd (L9/M7 72; M3 längre ner, under ringarnas OH-grupper)

// delarna i mallen, i L9:s ordning; molekyldelarna kommer från callbacks
function delar(o) {
  const LX = (XS + 2 * DX + XA - DX) / 2;
  const d = [];
  d.push({ mall: true, s: stegRub(60, 'Steg 1 – utgångsämnena') });
  d.push({ mall: false, s: o.steg1 ? o.steg1(Y1) : '' });
  d.push({ mall: true, s: txt(LX + 20, Y1 - 30, 'dessa två lämnar', `font-size="13" font-style="italic" fill="${INK}"`) + linje(LX - 40, Y1 - 24, LX + 80, Y1 - 24, GUL, 3) });
  d.push({ mall: true, s: stegRub(280, 'Steg 2 – vattnet lämnar') });
  d.push({ mall: false, s: o.steg2 ? o.steg2(Y2) : '' });
  const wx = 400, wy = Y2 - 10;
  const w = molekyl(); const wo = w.atom('O', wx, wy - 8); H(w, wo, -30, 22); H(w, wo, 30, 22);
  d.push({ mall: true, s: rekt(wx - 62, wy - 48, 124, 96, GUL, 'fill-opacity="0.35" rx="8" data-del="vattenruta"') + rita(w, { tag: 'data-steg="2" data-molekyl="vatten"' }) + txt(wx, wy + 40, formelO('H₂O'), 'font-size="15" font-weight="bold"') + pil(wx + 66, wy - 30, wx + 66, wy - 90, INK, 2.2) + txt(wx + 66, wy - 98, 'lämnar', 'font-size="12" font-style="italic"') });
  d.push({ mall: false, s: txt(W / 2, Y2 + 82, o.steg2text || '', 'font-size="13" font-style="italic"') });
  d.push({ mall: true, s: stegRub(500, o.steg3etikett || 'Steg 3 – bindningen') });
  d.push({ mall: false, s: o.steg3 ? o.steg3(Y3) : '' });
  const fy = HH - 22;
  d.push({ mall: false, s: txt(W / 2 - 60, fy, o.reaktion ? o.reaktion[0] : '', 'font-size="15" font-style="italic" text-anchor="end"') + txt(W / 2 + 60, fy, o.reaktion ? o.reaktion[1] : '', 'font-size="15" font-style="italic" text-anchor="start"') });
  d.push({ mall: true, s: linje(W / 2 - 40, fy - 8, W / 2 + 40, fy - 8, INK, 1.6) + linje(W / 2 + 40, fy - 8, W / 2 + 33, fy - 13, INK, 1.6) + linje(W / 2 - 40, fy - 2, W / 2 + 40, fy - 2, INK, 1.6) + linje(W / 2 - 40, fy - 2, W / 2 - 33, fy + 3, INK, 1.6) });
  return { vatten: w, delar: d };
}
// hela bildens innehåll
function kondensation(o) { return delar(o).delar.map(x => x.s).join(''); }
// mallens egna rader (utan molekyler och utan de bildspecifika texterna) – för jämförelsen mellan L9, M3 och M7
function mallRader(steg3etikett) { return delar({ steg3etikett }).delar.filter(x => x.mall).map(x => x.s).join('').split('\n').filter(Boolean); }
// jämför tre färdiga SVG-filer: alla mallrader måste finnas ordagrant i varje fil, bredd/höjd lika; stegrubrikerna rapporteras
function jamfor(filer) {
  const rader = mallRader('Steg 3 – bindningen').filter(r => !/Steg 3/.test(r));
  const res = [];
  for (const [namn, s] of Object.entries(filer)) {
    const saknas = rader.filter(r => !s.includes(r));
    const vb = s.match(/viewBox="0 0 (\d+) (\d+)"/), steg = [...s.matchAll(/>Steg (\d) – ([^<]+)</g)].map(m => `${m[1]}: ${m[2]}`);
    res.push({ namn, ok: saknas.length === 0 && vb[1] === String(W) && vb[2] === String(HH), saknas, storlek: `${vb[1]}×${vb[2]}`, steg });
  }
  return { rader: rader.length, res };
}
module.exports = { W, HH, Y1, Y2, Y3, XS, XA, stegRub, lamnar, bindRing, kondensation, mallRader, jamfor, delar };
