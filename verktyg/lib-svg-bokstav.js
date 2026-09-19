// lib-svg-bokstav.js – gemensamma SVG-primitiver och molekylmodellen i bokstavsstil (KOMPONENTER 9.5), delade av
// bilder-svg-*.js från och med Livets molekyler (2026-09-19). Lyft ordagrant ur bilder-svg-syror-estrar.js så att de tidigare
// bilderna byggs byte-identiskt (kontrollerat med git diff vid lyftet).
//
// Färgsignaler i strukturformlerna: syre #C0392B (delkapitel 4), kväve #3D6BA8 (delkapitel 6), grön ring #5a9668 runt den
// funktionella grupp som är bildens poäng (delkapitel 5, utvidgad i 6), gul markering #e8c547 på det som lämnar (L9, M3, M7).
'use strict';
const fs = require('fs'), path = require('path');
const INK = '#2d4a35', SIGN = '#5a9668', KOL = '#3a3a3a', SYRE = '#C0392B', KVAVE = '#3D6BA8', VATE = '#f5f0e4', VATSKA = '#a8c4d8', GRA = '#8A8A8A', GUL = '#e8c547';
const FONT = `font-family="Georgia, 'Times New Roman', serif"`;
const r2 = x => Math.round(x * 100) / 100;
const svg = (w, h, titel, inneh) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-labelledby="t">
  <title id="t">${titel}</title>
${inneh}</svg>
`;
const txt = (x, y, t, extra = '') => `  <text x="${r2(x)}" y="${r2(y)}" ${/fill=/.test(extra) ? '' : `fill="${INK}"`} ${/font-size=/.test(extra) ? '' : 'font-size="16"'} ${/text-anchor=/.test(extra) ? '' : 'text-anchor="middle"'} ${FONT} ${extra}>${t}</text>\n`;
const SUBT = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
const sub = s => s.replace(/([₀-₉]+)([^₀-₉]*)/g, (_, ix, rest) => `<tspan font-size="0.7em" dy="0.3em">${[...ix].map(c => SUBT[c]).join('')}</tspan>` + (rest ? `<tspan dy="-0.3em">${rest}</tspan>` : ''));
// formel med syret i syrefärg: varje O-följd (med ev. H eller ⁻ efter) röd – C₂H₅OH → …<tspan>OH</tspan>, CH₃COOH → CH₃C<tspan>OOH</tspan>
// (tspan-baslinjen följs explicit: index 0.3em ner, laddning 0.45em upp, och återställs i nästa segment – tomma tspan ignoreras)
const formelO = s => {
  const seg = []; for (const c of s) { const typ = SUBT[c] ? 'sub' : /[⁺⁻]/.test(c) ? 'sup' : 'bas', t = SUBT[c] || (c === '⁻' ? '−' : c === '⁺' ? '+' : c), rod = /[O⁻]/.test(c) || (c === 'H' && seg.length && seg[seg.length - 1].rod && /O$/.test(seg[seg.length - 1].t));
    const f = seg[seg.length - 1]; if (f && f.typ === typ && f.rod === rod) { f.t += t; } else { seg.push({ typ, t, rod }); } }
  let dy = 0, ut = '';
  for (const x of seg) { const mal = x.typ === 'sub' ? 0.3 : x.typ === 'sup' ? -0.45 : 0, d = mal - dy; dy = mal;
    ut += `<tspan${x.typ !== 'bas' ? ' font-size="0.7em"' : ''}${d ? ` dy="${r2(d)}em"` : ''}${x.rod ? ` fill="${SYRE}" data-o="1"` : ''}>${x.t}</tspan>`; }
  return ut + (dy ? `<tspan dy="${r2(-dy)}em">​</tspan>` : '');
};
// formel med syre rött och kväve blått (Livets molekyler: NH₂, CO(NH₂)₂)
const formelON = s => {
  const seg = []; for (const c of s) { const typ = SUBT[c] ? 'sub' : /[⁺⁻]/.test(c) ? 'sup' : 'bas', t = SUBT[c] || (c === '⁻' ? '−' : c === '⁺' ? '+' : c);
    const f = seg[seg.length - 1], farg = /[O⁻]/.test(c) || (c === 'H' && f && f.farg === 'O' && /O$/.test(f.t)) ? 'O' : c === 'N' ? 'N' : '';
    if (f && f.typ === typ && f.farg === farg) { f.t += t; } else { seg.push({ typ, t, farg }); } }
  let dy = 0, ut = '';
  for (const x of seg) { const mal = x.typ === 'sub' ? 0.3 : x.typ === 'sup' ? -0.45 : 0, d = mal - dy; dy = mal;
    ut += `<tspan${x.typ !== 'bas' ? ' font-size="0.7em"' : ''}${d ? ` dy="${r2(d)}em"` : ''}${x.farg === 'O' ? ` fill="${SYRE}" data-o="1"` : x.farg === 'N' ? ` fill="${KVAVE}" data-n="1"` : ''}>${x.t}</tspan>`; }
  return ut + (dy ? `<tspan dy="${r2(-dy)}em">​</tspan>` : '');
};
const linje = (x1, y1, x2, y2, farg = INK, bredd = 2, extra = '') => `  <line x1="${r2(x1)}" y1="${r2(y1)}" x2="${r2(x2)}" y2="${r2(y2)}" stroke="${farg}" stroke-width="${bredd}" stroke-linecap="round" ${extra}/>\n`;
const cirkel = (x, y, r, fyll, kontur = INK, bredd = 1.2, extra = '') => `  <circle cx="${r2(x)}" cy="${r2(y)}" r="${r}" fill="${fyll}" stroke="${kontur}" stroke-width="${bredd}" ${extra}/>\n`;
const ellips = (x, y, rx, ry, extra = '') => `  <ellipse cx="${r2(x)}" cy="${r2(y)}" rx="${r2(rx)}" ry="${r2(ry)}" fill="none" stroke="${SIGN}" stroke-width="1.4" ${extra}/>\n`;
const rekt = (x, y, w, h, fyll, extra = '') => `  <rect x="${r2(x)}" y="${r2(y)}" width="${r2(w)}" height="${r2(h)}" fill="${fyll}" ${extra}/>\n`;
const pil = (x1, y1, x2, y2, farg = INK, bredd = 2.5, extra = '') => {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, s = bredd * 4, bx = x2 - ux * s, by = y2 - uy * s;
  return `  <line x1="${r2(x1)}" y1="${r2(y1)}" x2="${r2(bx)}" y2="${r2(by)}" stroke="${farg}" stroke-width="${bredd}" stroke-linecap="round" ${extra}/>
  <polygon points="${r2(x2)},${r2(y2)} ${r2(bx - uy * s * 0.5)},${r2(by + ux * s * 0.5)} ${r2(bx + uy * s * 0.5)},${r2(by - ux * s * 0.5)}" fill="${farg}" ${extra}/>\n`;
};
// skrivare för en bildmapp: skriv(fil, w, h, titel, inneh) + räknare
function skrivare(UT) { fs.mkdirSync(UT, { recursive: true }); const S = { antal: 0 }; S.skriv = (fil, w, h, titel, inneh) => { fs.writeFileSync(path.join(UT, fil), svg(w, h, titel, inneh)); S.antal++; }; S.las = f => fs.readFileSync(path.join(UT, f), 'utf8'); return S; }

// ---------- bokstavsstil: molekyl som data (atomer {t, x, y, …}, bindningar {a, b, n, …}) ----------
const DX = 46, DY = 34, FS = 19, GAP = 7.2;
function molekyl() {
  const m = { atomer: [], bind: [] };
  m.atom = (t, x, y, extra = {}) => { m.atomer.push(Object.assign({ t, x, y }, extra)); return m.atomer.length - 1; };
  m.bond = (a, b, n = 1, extra = {}) => { m.bind.push(Object.assign({ a, b, n }, extra)); return m; };
  m.ta = (ix) => { // ta bort atomer (index) och deras bindningar
    const bort = new Set(ix); m.atomer = m.atomer.map((a, i) => bort.has(i) ? null : a); m.bind = m.bind.filter(b => !bort.has(b.a) && !bort.has(b.b)); return m;
  };
  return m;
}
function kedja(m, n, x0, y) { const ix = []; for (let i = 0; i < n; i++) { ix.push(m.atom('C', x0 + i * DX, y)); if (i) m.bond(ix[i - 1], ix[i]); } return ix; }
const H = (m, c, dx, dy, extra = {}) => { const a = m.atomer[c]; const i = m.atom('H', a.x + dx, a.y + dy, extra); m.bond(c, i, 1, extra); return i; };
const OH = (m, c, dx, dy, extra = {}) => { const a = m.atomer[c]; const o = m.atom('O', a.x + dx, a.y + dy, extra); m.bond(c, o, 1, extra); const h = m.atom('H', a.x + 2 * dx, a.y + 2 * dy, extra); m.bond(o, h, 1, extra); return [o, h]; };
const Odbl = (m, c, dx, dy, extra = {}) => { const a = m.atomer[c]; const o = m.atom('O', a.x + dx, a.y + dy, extra); m.bond(c, o, 2, extra); return o; };
const atomFarg = t => t === 'O' ? SYRE : t === 'N' ? KVAVE : INK;
function rita(m, o = {}) {
  const tag = o.tag || '', fs_ = o.fontsize || FS, farg = atomFarg;
  let s = '';
  for (const b of m.bind) {
    const A = m.atomer[b.a], B = m.atomer[b.b], dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
    const kA = A.t === 'H' ? 9 : 13, kB = B.t === 'H' ? 9 : 13;
    for (let j = 0; j < b.n; j++) { const o2 = (j - (b.n - 1) / 2) * GAP; s += linje(A.x + ux * kA + nx * o2, A.y + uy * kA + ny * o2, B.x - ux * kB + nx * o2, B.y - uy * kB + ny * o2, b.farg || INK, b.bredd || 2.2, `data-bind="${A.t}-${B.t}" ${b.mark ? `data-mark="${b.mark}"` : ''} ${b.streckad ? 'stroke-dasharray="4 3"' : ''} ${tag}`); }
  }
  for (const a of m.atomer) { if (!a) continue; if (a.bak) s += a.bak; s += txt(a.x, a.y + fs_ * 0.35, a.t, `font-size="${a.t === 'H' ? fs_ * 0.86 : fs_}" fill="${a.farg || farg(a.t)}" ${a.t !== 'H' ? 'font-weight="bold"' : ''} data-atom="${a.t}" ${a.mark ? `data-mark="${a.mark}"` : ''} ${tag}`); }
  return s;
}
// stub: ledig bindning som slutar i tomma intet (steg 2 i kondensationsbilderna)
const stub = (x, y, dx, dy, tag) => linje(x + dx * 0.3, y + dy * 0.3, x + dx * 0.8, y + dy * 0.8, GUL, 2.6, `data-stub="1" ${tag}`);
const rakna = m => ({ C: m.atomer.filter(a => a && a.t === 'C').length, H: m.atomer.filter(a => a && a.t === 'H').length, O: m.atomer.filter(a => a && a.t === 'O').length, N: m.atomer.filter(a => a && a.t === 'N').length });
const bindTal = (m, i) => m.bind.filter(b => b.a === i || b.b === i).reduce((s, b) => s + b.n, 0);
const grannar = (m, i) => m.bind.filter(b => b.a === i || b.b === i).map(b => b.a === i ? b.b : b.a);
const VALENS = { C: 4, O: 2, H: 1, N: 3 };
const valens = m => m.atomer.every((a, i) => !a || !(a.t in VALENS) || bindTal(m, i) === VALENS[a.t]);
// element ur en SVG-fil (för kontrollerna)
const element = (s, filter) => [...s.matchAll(/<(text|circle|line|rect|path|ellipse|polygon|tspan|g)\b([^>]*)>/g)].map(m => { const at = { _tag: m[1] }; for (const a of m[2].matchAll(/([a-z0-9-]+)="([^"]*)"/g)) at[a[1]] = a[2]; return at; }).filter(filter);
const antalAtom = (els, t) => els.filter(e => e['data-atom'] === t).length;

module.exports = { INK, SIGN, KOL, SYRE, KVAVE, VATE, VATSKA, GRA, GUL, FONT, r2, svg, txt, SUBT, sub, formelO, formelON, linje, cirkel, ellips, rekt, pil, skrivare,
  DX, DY, FS, GAP, molekyl, kedja, H, OH, Odbl, atomFarg, rita, stub, rakna, bindTal, grannar, valens, element, antalAtom };
