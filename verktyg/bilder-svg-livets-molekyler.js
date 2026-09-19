// bilder-svg-livets-molekyler.js – de tolv SVG-bilderna till Organisk kemi 6 "Livets molekyler" (arbetsorder 2026-09-19; specar i
// doc/leveranser/livets-molekyler/original/dk6-bildspecar.md). Skriver till kapitel/organisk-kemi/delkapitel/livets-molekyler/img/.
// Kör: node verktyg/bilder-svg-livets-molekyler.js
//
//   k6-m1  Glukos, fullständigt och förenklat  1.1   k6-m5  Fettmolekylen               2.1   k6-m9   Från kedja till form        3.2
//   k6-m2  Tre sockerarter, samma formel       1.1   k6-m6  Raka och knyckiga kedjor    2.2   k6-m10  Denaturering                3.3
//   k6-m3  Två sockerringar kopplas ihop       1.2   k6-m7  Två aminosyror kopplas ihop 3.2   k6-m11  Tre nedbrytningsvägar       4.1
//   k6-m4  Stärkelse och cellulosa             1.3   k6-m8  Aminosyrans uppbyggnad      3.1   k6-m12  Fem grupper jämförda        4.3
//
// Tre färgsignaler: syre #C0392B, kväve #3D6BA8 (nytt), grön ring #5a9668 = funktionell grupp. M3 och M7 byggs på samma mall
// som L9 (lib-kondensation.js). Kontrollerna sist körs på samma data som ritats; exit 1 vid FEL.
'use strict';
const path = require('path');
const ROT = path.join(__dirname, '..');
const UT = path.join(ROT, 'kapitel', 'organisk-kemi', 'delkapitel', 'livets-molekyler', 'img');
const B = require('./lib-svg-bokstav.js');
const { INK, SIGN, KOL, SYRE, KVAVE, VATE, VATSKA, GRA, GUL, FONT, r2, txt, sub, formelO, formelON, linje, cirkel, ellips, rekt, pil, DX, DY, FS, molekyl, H, OH, Odbl, rita, stub, rakna, bindTal, grannar, valens, element, antalAtom } = B;
const SK = B.skrivare(UT); const skriv = SK.skriv;
const KOND = require('./lib-kondensation.js');
const fs = require('fs');

// ---------- förenklad sockerring (Haworth-liknande): platt sexhörning, R 38; hörn v0 0° (C1, höger) … v5 300°; ringens O i v1 (60°, uppe till höger).
// Substituenter: C1 OH åt höger, C2 (v5) OH rakt ner, C3 (v4) OH rakt ner, C4 (v3) OH åt vänster (galaktos: uppåt), C5 (v2) CH₂OH radiellt upp-vänster.
// flip speglar ringen i sin vågräta axel (cellulosa: varannan ring vänd) – ringens O hamnar nere till höger, OH-grupperna byter upp/ner.
// Väteatomer på ringens kolatomer ritas inte (spec), men räknas i data: varje ring-C bär 1 H (C1–C5), CH₂OH bär 2 H + OH.
const RR = 38, SUBL = 30;
function sockerRing(cx, cy, o = {}) {
  const flip = o.flip ? -1 : 1, tag = o.tag || '', fs_ = o.fontsize || 13;
  const v = k => ({ x: cx + RR * Math.cos(k * Math.PI / 3), y: cy - flip * RR * Math.sin(k * Math.PI / 3) });
  const V = [0, 1, 2, 3, 4, 5].map(v);
  const ringO = o.ringO === undefined ? 1 : o.ringO;   // hörn för ringens syreatom (v1; fruktos: egen ritning)
  let s = `  <path d="M${V.map(p => `${r2(p.x)} ${r2(p.y)}`).join(' L')} Z" fill="none" stroke="${INK}" stroke-width="2" stroke-linejoin="round" data-ringform="${o.hexagon === false ? 5 : 6}" ${tag}/>\n`;
  // ringens syreatom: vit bakgrund + rött O
  s += cirkel(V[ringO].x, V[ringO].y, 11, VATE, 'none', 0) + txt(V[ringO].x, V[ringO].y + 5, 'O', `font-size="${fs_ + 1}" font-weight="bold" fill="${SYRE}" data-atom="O" data-ring-o="${(flip > 0) === (ringO < 3) ? 'upp' : 'ner'}" ${tag}`);
  const data = { C: 5, H: 5, O: 1, subs: [] };   // ringens fem kolatomer med ett väte var + ringens O
  // substituenter: {hörn, typ: 'OH'|'CH2OH'|'bryggaO'|'ledig'|'ledigO', dir:[dx,dy], namn, mark}
  const subs = o.subs || [{ h: 0, typ: 'OH', dir: [1, 0], namn: 'C1-OH' }, { h: 5, typ: 'OH', dir: [0, 1], namn: 'C2-OH' }, { h: 4, typ: 'OH', dir: [0, 1], namn: 'C3-OH' }, { h: 3, typ: 'OH', dir: [-1, 0], namn: 'C4-OH' }, { h: 2, typ: 'CH2OH', dir: [-0.7, -0.7], namn: 'C5-CH2OH' }];
  for (const sb of subs) {
    const p = V[sb.h], dx = sb.dir[0], dy = sb.dir[1] * flip, ex = p.x + dx * SUBL, ey = p.y + dy * SUBL;
    const st = `data-sub="${sb.namn}" ${tag}`;
    if (sb.typ === 'OH' || sb.typ === 'bryggaO' || sb.typ === 'ledigO') {
      s += linje(p.x + dx * 4, p.y + dy * 4, ex - dx * 10, ey - dy * 10, INK, 2, `data-bind="C-O" ${st}`);
      if (sb.markO) s += cirkel(ex, ey, 13, GUL, 'none', 0, `fill-opacity="0.75" data-lamnar="${sb.markO}"`);
      if (sb.gron) s += ellips(ex + dx * 8, ey + dy * 8, 26, 16, `data-ring="hydroxyl" data-gron="${sb.namn}" ${tag}`);
      s += txt(ex, ey + 5, 'O', `font-size="${fs_}" font-weight="bold" fill="${SYRE}" data-atom="O" ${st}`);
      data.O++; data.subs.push(sb.namn);
      if (sb.typ === 'OH') {
        const hx = ex + dx * 22 + (dx === 0 ? 0 : 0), hy = ey + dy * 22;
        s += linje(ex + dx * 10, ey + dy * 10, hx - dx * 7, hy - dy * 7, INK, 2, `data-bind="O-H" ${st}`);
        if (sb.markH) s += cirkel(hx, hy, 11, GUL, 'none', 0, `fill-opacity="0.75" data-lamnar="${sb.markH}"`);
        s += txt(hx, hy + 4, 'H', `font-size="${fs_ - 1}" fill="${INK}" data-atom="H" ${st}`);
        data.H++;
      } else if (sb.typ === 'ledigO') { s += stub(ex, ey, dx * 30, dy * 30, st); }
    } else if (sb.typ === 'CH2OH') {
      s += linje(p.x + dx * 4, p.y + dy * 4, ex - dx * 14, ey - dy * 14, INK, 2, `data-bind="C-C" ${st}`);
      s += txt(ex + dx * 12, ey + 5 + dy * 12, sub('CH₂') + `<tspan fill="${SYRE}">O</tspan>H`, `font-size="${fs_}" font-weight="bold" data-grupp="CH2OH" ${st}`);
      data.C++; data.H += 3; data.O++; data.subs.push(sb.namn);
    } else if (sb.typ === 'ledig') { s += stub(p.x, p.y, dx * 34, dy * 34, st); }
    else if (sb.typ === 'brygga') { /* bindning ritas av anroparen */ }
  }
  return { svg: s, data, V, cx, cy };
}
// fruktos: femhörning, O i toppen till höger; C2 (höger) bär CH₂OH upp och OH ner, C3/C4 (nedre) OH ner, C5 (vänster) CH₂OH upp-vänster
function fruktosRing(cx, cy, tag = '') {
  const R = 36, V = [0, 1, 2, 3, 4].map(k => ({ x: cx + R * Math.cos(Math.PI / 2 - k * 2 * Math.PI / 5 + 2 * Math.PI / 5 * 0.5), y: cy - R * Math.sin(Math.PI / 2 - k * 2 * Math.PI / 5 + 2 * Math.PI / 5 * 0.5) }));
  // V[0] uppe till höger (O), V[1] nere till höger (C2), V[2] nere (C3), V[3] nere till vänster (C4), V[4] uppe till vänster (C5)
  let s = `  <path d="M${V.map(p => `${r2(p.x)} ${r2(p.y)}`).join(' L')} Z" fill="none" stroke="${INK}" stroke-width="2" stroke-linejoin="round" data-ringform="5" ${tag}/>\n`;
  s += cirkel(V[0].x, V[0].y, 11, VATE, 'none', 0) + txt(V[0].x, V[0].y + 5, 'O', `font-size="14" font-weight="bold" fill="${SYRE}" data-atom="O" data-ring-o="upp" ${tag}`);
  const data = { C: 4, H: 3, O: 1 };   // fyra ringkol: C2 utan H, C3–C5 ett H var
  const oh = (p, dx, dy, namn) => { const ex = p.x + dx * SUBL, ey = p.y + dy * SUBL, hx = ex + dx * 22, hy = ey + dy * 22; data.O++; data.H++;
    return linje(p.x + dx * 4, p.y + dy * 4, ex - dx * 10, ey - dy * 10, INK, 2, `data-bind="C-O" data-sub="${namn}" ${tag}`) + txt(ex, ey + 5, 'O', `font-size="13" font-weight="bold" fill="${SYRE}" data-atom="O" data-sub="${namn}" ${tag}`) + linje(ex + dx * 10, ey + dy * 10, hx - dx * 7, hy - dy * 7, INK, 2, `data-bind="O-H" ${tag}`) + txt(hx, hy + 4, 'H', `font-size="12" data-atom="H" data-sub="${namn}" ${tag}`); };
  const ch2oh = (p, dx, dy, namn) => { const ex = p.x + dx * SUBL, ey = p.y + dy * SUBL; data.C++; data.H += 3; data.O++;
    return linje(p.x + dx * 4, p.y + dy * 4, ex - dx * 14, ey - dy * 14, INK, 2, `data-bind="C-C" data-sub="${namn}" ${tag}`) + txt(ex, ey + 5, sub('CH₂') + `<tspan fill="${SYRE}">O</tspan>H`, `font-size="13" font-weight="bold" data-grupp="CH2OH" data-sub="${namn}" ${tag}`); };
  s += ch2oh(V[1], 0.85, -0.55, 'C2-CH2OH') + oh(V[1], 0.5, 0.85, 'C2-OH') + oh(V[2], 0, 1, 'C3-OH') + oh(V[3], -0.5, 0.85, 'C4-OH') + ch2oh(V[4], -0.85, -0.55, 'C5-CH2OH');
  return { svg: s, data, V };
}
const std = (r, ...extra) => Object.assign({ C: r.C, H: r.H, O: r.O }, ...extra);
const cnt = d => `${d.C} C, ${d.H} H, ${d.O} O`;

// ---------- M1. Glukos, fullständigt och förenklat (1.1) ----------
const M = {};
{
  const W = 900, HH = 420, cy = 190;
  let ut = '';
  // vänster: fullständig strukturformel som explicit molekyl (ring R 78, C i hörnen, H inåt, OH/CH₂OH utåt)
  const cx = 230, R = 78, m = molekyl();
  const v = k => ({ x: cx + R * Math.cos(k * Math.PI / 3), y: cy - R * Math.sin(k * Math.PI / 3) });
  const C = {}; C[1] = m.atom('C', v(0).x, v(0).y); const Or = m.atom('O', v(1).x, v(1).y); C[5] = m.atom('C', v(2).x, v(2).y); C[4] = m.atom('C', v(3).x, v(3).y); C[3] = m.atom('C', v(4).x, v(4).y); C[2] = m.atom('C', v(5).x, v(5).y);
  m.bond(C[1], Or); m.bond(Or, C[5]); m.bond(C[5], C[4]); m.bond(C[4], C[3]); m.bond(C[3], C[2]); m.bond(C[2], C[1]);
  const rad = (i, f) => { const a = m.atomer[i]; const dx = (a.x - cx) / R, dy = (a.y - cy) / R; return { dx: dx * f, dy: dy * f }; };
  for (const k of [1, 2, 3, 4, 5]) { const { dx, dy } = rad(C[k], 1); H(m, C[k], -dx * 30, -dy * 30); }   // H inåt
  for (const k of [1, 2, 3, 4]) { const { dx, dy } = rad(C[k], 1); OH(m, C[k], dx * 34, dy * 34); }     // OH utåt
  { const { dx, dy } = rad(C[5], 1); const c6 = m.atom('C', m.atomer[C[5]].x + dx * 40, m.atomer[C[5]].y + dy * 40); m.bond(C[5], c6);
    H(m, c6, -dy * 28, dx * 28); H(m, c6, dy * 28, -dx * 28); OH(m, c6, dx * 34, dy * 34); }
  ut += rita(m, { tag: 'data-del="fullstandig"', fontsize: 14 });
  M.m1full = m;
  ut += txt(cx, 336, 'fullständig strukturformel', 'font-size="15" font-weight="bold"') + txt(cx, 356, 'korrekt men svårläst', 'font-size="13" font-style="italic"');
  ut += pil(400, cy, 490, cy, INK, 2.2) + txt(445, cy - 12, 'samma molekyl', 'font-size="13" font-style="italic"');
  // höger: förenklad
  const r = sockerRing(660, cy, { tag: 'data-del="forenklad"', fontsize: 14 }); ut += r.svg; M.m1enkel = r.data;
  const o = r.V[1];
  ut += linje(o.x + 12, o.y - 10, o.x + 60, o.y - 60, GRA, 1, 'stroke-dasharray="3 3"') + txt(o.x + 64, o.y - 66, 'ringens enda syreatom', 'font-size="12" font-style="italic" text-anchor="start"');
  ut += txt(660, 336, 'förenklad strukturformel', 'font-size="15" font-weight="bold"') + txt(660, 356, 'visar formen och grupperna', 'font-size="13" font-style="italic"');
  ut += txt(W / 2, HH - 14, 'glukos, ' + formelO('C₆H₁₂O₆'), 'font-size="15" font-weight="bold"');
  skriv('k6-m1.svg', W, HH, 'Glukos ritad på två sätt. Till vänster fullständigt med alla atomer, till höger förenklat som en sexhörning där ett hörn är en röd syreatom och OH-grupper sticker ut', ut);
}

// ---------- M2. Tre sockerarter med samma formel (1.1) ----------
{
  const W = 960, HH = 360, cy = 150, X = [160, 480, 800];
  let ut = '';
  const g = sockerRing(X[0], cy, { tag: 'data-molekyl="glukos"', subs: [{ h: 0, typ: 'OH', dir: [1, 0], namn: 'C1-OH' }, { h: 5, typ: 'OH', dir: [0, 1], namn: 'C2-OH' }, { h: 4, typ: 'OH', dir: [0, 1], namn: 'C3-OH' }, { h: 3, typ: 'OH', dir: [-1, 0], namn: 'C4-OH', gron: true }, { h: 2, typ: 'CH2OH', dir: [-0.7, -0.7], namn: 'C5-CH2OH' }] });
  const ga = sockerRing(X[1], cy, { tag: 'data-molekyl="galaktos"', subs: [{ h: 0, typ: 'OH', dir: [1, 0], namn: 'C1-OH' }, { h: 5, typ: 'OH', dir: [0, 1], namn: 'C2-OH' }, { h: 4, typ: 'OH', dir: [0, 1], namn: 'C3-OH' }, { h: 3, typ: 'OH', dir: [-0.85, -0.5], namn: 'C4-OH', gron: true }, { h: 2, typ: 'CH2OH', dir: [0, -1], namn: 'C5-CH2OH' }] });
  const f = fruktosRing(X[2], cy, 'data-molekyl="fruktos"');
  ut += g.svg + ga.svg + f.svg; M.m2 = { glukos: g.data, galaktos: ga.data, fruktos: f.data };
  ut += txt((X[0] + X[1]) / 2, cy + 70, 'enda skillnaden', `font-size="12" font-style="italic" fill="${SIGN}"`) + linje((X[0] + X[1]) / 2 - 40, cy + 62, X[0] - 82, cy + 8, SIGN, 1, 'stroke-dasharray="3 3"') + linje((X[0] + X[1]) / 2 + 40, cy + 62, X[1] - 76, cy - 32, SIGN, 1, 'stroke-dasharray="3 3"');
  ['glukos', 'galaktos', 'fruktos'].forEach((n, i) => { ut += txt(X[i], 262, n, 'font-size="16" font-weight="bold"') + txt(X[i], 288, formelO('C₆H₁₂O₆'), `font-size="16" data-formel="${n}"`); });
  ut += txt(W / 2, HH - 14, 'samma formel, tre olika ämnen – de är isomerer', 'font-size="14" font-style="italic"');
  skriv('k6-m2.svg', W, HH, 'Tre sockerringar. Glukos och galaktos som sexhörningar, fruktos som femhörning. Under alla tre står samma formel C6H12O6', ut);
}

// ---------- M3. Två sockerringar kopplas ihop (1.2) – gemensam uppställning med L9 och M7 ----------
{
  const { XS, XA } = KOND;
  const stdSubs = (c1, c4) => [c1, { h: 5, typ: 'OH', dir: [0, 1], namn: 'C2-OH' }, { h: 4, typ: 'OH', dir: [0, 1], namn: 'C3-OH' }, c4, { h: 2, typ: 'CH2OH', dir: [0, -1], namn: 'C5-CH2OH' }];   // CH₂OH rakt upp: går fri från stegrubriken
  const LC = XS + 100, RC = XA + 110;   // ringcentra
  const steg1 = y => {
    const l = sockerRing(LC, y, { tag: 'data-steg="1" data-molekyl="glukos-v"', subs: stdSubs({ h: 0, typ: 'OH', dir: [1, 0], namn: 'C1-OH', markO: 'vanster-OH', markH: 'vanster-OH' }, { h: 3, typ: 'OH', dir: [-1, 0], namn: 'C4-OH' }) });
    const r = sockerRing(RC, y, { tag: 'data-steg="1" data-molekyl="glukos-h"', subs: stdSubs({ h: 0, typ: 'OH', dir: [1, 0], namn: 'C1-OH' }, { h: 3, typ: 'OH', dir: [-1, 0], namn: 'C4-OH', markH: 'hoger-H' }) });
    M.m3s1 = { v: l.data, h: r.data };
    return l.svg + r.svg + txt(LC, y + 112, 'glukos', 'font-size="14" font-weight="bold"') + txt(RC, y + 112, 'glukos', 'font-size="14" font-weight="bold"');
  };
  const steg2 = y => {
    const l = sockerRing(LC, y, { tag: 'data-steg="2" data-molekyl="glukos-v"', subs: stdSubs({ h: 0, typ: 'ledig', dir: [1, 0], namn: 'C1-ledig' }, { h: 3, typ: 'OH', dir: [-1, 0], namn: 'C4-OH' }) });
    const r = sockerRing(RC, y, { tag: 'data-steg="2" data-molekyl="glukos-h"', subs: stdSubs({ h: 0, typ: 'OH', dir: [1, 0], namn: 'C1-OH' }, { h: 3, typ: 'ledigO', dir: [-1, 0], namn: 'C4-O' }) });
    M.m3s2 = { v: l.data, h: r.data };
    return l.svg + r.svg;
  };
  const steg3 = y => {
    const ox = 480, lc = ox - 46 - RR, rc = ox + 46 + RR;
    const l = sockerRing(lc, y, { tag: 'data-steg="3" data-molekyl="maltos"', subs: stdSubs({ h: 0, typ: 'brygga', dir: [1, 0], namn: 'C1-brygga' }, { h: 3, typ: 'OH', dir: [-1, 0], namn: 'C4-OH' }) });
    const r = sockerRing(rc, y, { tag: 'data-steg="3" data-molekyl="maltos"', subs: stdSubs({ h: 0, typ: 'OH', dir: [1, 0], namn: 'C1-OH' }, { h: 3, typ: 'brygga', dir: [-1, 0], namn: 'C4-brygga' }) });
    M.m3s3 = { v: l.data, h: r.data };
    let s = l.svg + r.svg;
    s += linje(lc + RR + 4, y, ox - 12, y, SIGN, 3.2, 'data-bind="C-O" data-mark="glykosidbindning" data-steg="3"') + linje(ox + 12, y, rc - RR - 4, y, SIGN, 3.2, 'data-bind="O-C" data-mark="glykosidbindning" data-steg="3"');
    s += txt(ox, y + 5, 'O', `font-size="14" font-weight="bold" fill="${SYRE}" data-atom="O" data-brygga="1" data-steg="3"`);
    s += KOND.bindRing(ox, y, 'glykosidbindning', 'glykosidbindning', 108);
    s += txt(rc + RR + 100, y + 5, 'maltos, ' + formelO('C₁₂H₂₂O₁₁'), 'font-size="15" font-weight="bold" text-anchor="start"');
    return s;
  };
  const ut = KOND.kondensation({ steg1, steg2, steg3, steg2text: 'OH från den ena och H från den andra bildar vatten', steg3etikett: 'Steg 3 – glykosidbindningen', reaktion: ['två monosackarider', 'en disackarid + vatten'] });
  skriv('k6-m3.svg', KOND.W, KOND.HH, 'Två glukosringar kopplas ihop i tre steg. Först är en OH-grupp och en väteatom markerade, sedan bildar de en vattenmolekyl som lämnar, och sist sitter ringarna ihop med en glykosidbindning', ut);
}

// ---------- M4. Stärkelse och cellulosa (1.3) ----------
{
  const W = 960, HH = 480, X0 = 215, STEG = 2 * RR + 92;
  let ut = '';
  const kedjaRingar = (y, flipVar, namn, boj) => {
    let s = ''; const d = [];
    for (let i = 0; i < 4; i++) {
      const cx = X0 + i * STEG, cy = y + (boj ? [0, -8, -8, 0][i] : 0), flip = flipVar && i % 2 === 1;
      const c1 = i < 3 ? { h: 0, typ: 'brygga', dir: [1, 0], namn: 'C1-brygga' } : { h: 0, typ: 'OH', dir: [1, 0], namn: 'C1-OH' };
      const c4 = i > 0 ? { h: 3, typ: 'brygga', dir: [-1, 0], namn: 'C4-brygga' } : { h: 3, typ: 'OH', dir: [-1, 0], namn: 'C4-OH' };
      const r = sockerRing(cx, cy, { flip, tag: `data-kedja="${namn}" data-enhet="${i + 1}"`, subs: [c1, { h: 5, typ: 'OH', dir: [0, 1], namn: 'C2-OH', gron: true }, { h: 4, typ: 'OH', dir: [0, 1], namn: 'C3-OH' }, c4, { h: 2, typ: 'CH2OH', dir: [-0.7, -0.7], namn: 'C5-CH2OH' }] });
      s += r.svg; d.push(r.data);
      if (i < 3) { const ncy = y + (boj ? [0, -8, -8, 0][i + 1] : 0), ox = cx + RR + 46; s += linje(cx + RR + 4, cy, ox - 12, cy + (ncy - cy) / 2, INK, 2, `data-bind="C-O" data-kedja="${namn}"`) + linje(ox + 12, cy + (ncy - cy) / 2, cx + STEG - RR - 4, ncy, INK, 2, `data-bind="O-C" data-kedja="${namn}"`) + txt(ox, cy + (ncy - cy) / 2 + 5, 'O', `font-size="13" font-weight="bold" fill="${SYRE}" data-atom="O" data-brygga="1" data-kedja="${namn}"`); }
    }
    return { svg: s, d };
  };
  const st = kedjaRingar(120, false, 'starkelse', true), ce = kedjaRingar(320, true, 'cellulosa', false);
  ut += st.svg + ce.svg; M.m4 = { st: st.d, ce: ce.d };
  ut += txt(24, 112, 'stärkelse', 'font-size="16" font-weight="bold" text-anchor="start"') + txt(24, 130, 'alla ringar', 'font-size="12" font-style="italic" text-anchor="start"') + txt(24, 145, 'åt samma håll', 'font-size="12" font-style="italic" text-anchor="start"');
  ut += txt(24, 312, 'cellulosa', 'font-size="16" font-weight="bold" text-anchor="start"') + txt(24, 330, 'varannan', 'font-size="12" font-style="italic" text-anchor="start"') + txt(24, 345, 'ring vänd', 'font-size="12" font-style="italic" text-anchor="start"');
  // vätebindningar till nästa kedja under cellulosan
  [1, 2, 3].forEach(i => { const x = X0 + (i - 0.5) * STEG + 20; ut += linje(x, 404, x, 440, GRA, 1.4, 'stroke-dasharray="4 4" data-vatebindning="1"'); });
  ut += txt(X0 + 1.5 * STEG + 20, 458, 'kedjorna kan ligga tätt', `font-size="12" font-style="italic" fill="${GRA}"`);
  ut += txt(W - 30, HH - 14, 'röd = ringens syreatom · grön ring = samma OH-grupp i varje ring', `font-size="12" font-style="italic" text-anchor="end" fill="${GRA}"`);
  skriv('k6-m4.svg', W, HH, 'Två kedjor av fyra sockerringar. I den övre är alla ringar vända åt samma håll. I den nedre är varannan ring vänd ett halvt varv, och kedjan blir rakare', ut);
}

// ---------- M5. Fettmolekylen (2.1) ----------
{
  const W = 960, HH = 500, GX = 120, GY0 = 80, GDY = 120;
  let ut = '';
  const g = molekyl(); const cs = [];
  for (let i = 0; i < 3; i++) { cs.push(g.atom('C', GX, GY0 + i * GDY)); if (i) g.bond(cs[i - 1], cs[i]); }
  H(g, cs[0], -DX, 0); H(g, cs[0], 0, -DY); H(g, cs[1], -DX, 0); H(g, cs[2], -DX, 0); H(g, cs[2], 0, DY);
  const os = cs.map(c => { const o = g.atom('O', GX + DX, g.atomer[c].y); g.bond(c, o); return o; });
  ut += rita(g, { tag: 'data-molekyl="glycerol"' }) + txt(GX - 10, GY0 + 2 * GDY + DY + 34, 'glycerol', 'font-size="15" font-weight="bold"');
  const langd = [12, 16, 18], knyck = [false, true, false];
  os.forEach((o, i) => {
    const oa = g.atomer[o], cx = oa.x + DX, cy = oa.y, f = molekyl(); const c = f.atom('C', cx, cy); Odbl(f, c, 0, -DY);
    ut += linje(oa.x + 13, oa.y, cx - 13, cy, SIGN, 3.2, `data-bind="O-C" data-mark="esterbindning" data-fettsyra="${i + 1}"`) + rita(f, { tag: `data-fettsyra="${i + 1}"` });
    ut += ellips(cx + 6, cy - 12, 30, 30, `data-ring="karboxyl" data-fettsyra="${i + 1}"`);
    // kedjan: n − 1 segment om 20 px; den mellersta med en knyck (dubbelbindning) vid segment 7
    let x = cx + 14, y = cy, d = `M${x} ${y}`, ang = 0, dbl = '';
    for (let k = 0; k < langd[i] - 1; k++) {
      if (knyck[i] && k === 7) { ang = -0.38; dbl = `  <line x1="${r2(x - 6)}" y1="${r2(y + 7)}" x2="${r2(x + 6)}" y2="${r2(y + 7)}" stroke="${SIGN}" stroke-width="2.2" data-dubbel="1"/>\n`; }
      const seg = 20, up = k % 2 ? 10 : -10; const ddx = seg * Math.cos(ang) + (-up) * Math.sin(ang), ddy = up * Math.cos(ang) + seg * Math.sin(ang);
      x += ddx; y += ddy; d += ` L${r2(x)} ${r2(y)}`;
    }
    ut += `  <path d="${d}" fill="none" stroke="${KOL}" stroke-width="2.4" stroke-linejoin="round" data-kedja="${i + 1}" data-kol="${langd[i]}" data-knyck="${knyck[i] ? 1 : 0}"/>\n` + dbl;
    ut += txt(x + 10, y + 5, `fettsyra ${i + 1} · ${langd[i]} C`, 'font-size="13" font-style="italic" text-anchor="start"');
    ut += ellips((oa.x + cx) / 2, cy, 34, 18, `data-ring="esterbindning" data-fettsyra="${i + 1}"`);
  });
  ut += txt(GX + 2 * DX, GY0 + 2 * GDY + DY + 60, 'tre esterbindningar', `font-size="15" font-weight="bold" fill="${SIGN}"`);
  ut += txt(W / 2, HH - 18, 'glycerol + tre fettsyror → fett + tre vattenmolekyler', 'font-size="15" font-style="italic"');
  skriv('k6-m5.svg', W, HH, 'En fettmolekyl. Till vänster glycerol med tre bindningar ut, till höger tre fettsyror av olika längd. Den mellersta har en knyck. De tre esterbindningarna är inringade', ut);
}

// ---------- M6. Raka och knyckiga kedjor (2.2) ----------
{
  const W = 960, HH = 440, PW = 430;
  let ut = '';
  const panel = (x0, knyck, tag) => {
    let s = rekt(x0, 40, PW, 270, VATE, `rx="8" stroke="${INK}" stroke-width="1.2" data-panel="${tag}"`);
    const pts = []; const gap = knyck ? 29 : 28, y0 = knyck ? 60 : 84;
    for (let i = 0; i < 6; i++) {
      let x = x0 + 30, y = y0 + i * gap, d = `M${x} ${y}`, ang = 0; const p = [[x, y]];
      for (let k = 0; k < 16; k++) { if (knyck && k === 8 - i) { /* knycken förskjuten per kedja (nedre först) så att mellanrummen öppnar sig efter knycken */ ang = 0.32; s += `  <line x1="${r2(x - 5)}" y1="${r2(y + 6)}" x2="${r2(x + 5)}" y2="${r2(y + 6)}" stroke="${SIGN}" stroke-width="2.2" data-dubbel="1" data-panel="${tag}"/>\n`; }
        const up = k % 2 ? 7 : -7, ddx = 22 * Math.cos(ang) + (-up) * Math.sin(ang), ddy = up * Math.cos(ang) + 22 * Math.sin(ang); x += ddx; y += ddy; d += ` L${r2(x)} ${r2(y)}`; p.push([x, y]); }
      s += `  <path d="${d}" fill="none" stroke="${KOL}" stroke-width="2.2" stroke-linejoin="round" data-kedja="${i + 1}" data-panel="${tag}"/>\n`; pts.push(p);
    }
    // van der Waals-krafter: korta streckade linjer mellan grannkedjor där de ligger nära (< 34 px)
    let n = 0;
    for (let i = 0; i < 5; i++) for (let k = 1; k < 16; k += 2) { const a = pts[i][k], b = pts[i + 1][k]; const dist = Math.hypot(a[0] - b[0], a[1] - b[1]); if (dist < 34) { s += linje(a[0], a[1] + 4, b[0], b[1] - 4, GRA, 1.2, `stroke-dasharray="3 3" data-vdw="1" data-panel="${tag}"`); n++; } }
    return { svg: s, n };
  };
  const m = panel(40, false, 'mattade'), o = panel(490, true, 'omattade'); ut += m.svg + o.svg; M.m6 = { m: m.n, o: o.n };
  ut += txt(255, 340, 'mättade', 'font-size="16" font-weight="bold"') + txt(255, 360, 'raka kedjor, packas tätt', 'font-size="13" font-style="italic"') + txt(255, 384, 'fast vid rumstemperatur', `font-size="14" font-weight="bold" fill="${GRA}"`);
  ut += txt(705, 340, 'omättade', 'font-size="16" font-weight="bold"') + txt(705, 360, 'knyckiga kedjor, packas glest', 'font-size="13" font-style="italic"') + txt(705, 384, 'flytande vid rumstemperatur', `font-size="14" font-weight="bold" fill="${VATSKA}"`);
  ut += txt(W / 2, HH - 14, 'fler kontaktpunkter betyder starkare attraktion och högre smältpunkt', 'font-size="14" font-style="italic"');
  skriv('k6-m6.svg', W, HH, 'Till vänster sex raka fettsyrekedjor som ligger tätt packade med många attraktionslinjer mellan sig. Till höger sex kedjor med en knyck var, som inte kan packas lika tätt och har färre attraktionslinjer', ut);
}

// ---------- aminosyror (bokstavsstil, explicit molekyl): N–Cα(H)(R)–C(=O)–OH; R som ruta i signaturfärg ----------
const rutaR = (x, y) => rekt(x - 15, y - 13, 30, 26, SIGN, 'fill-opacity="0.18" rx="4" stroke="' + SIGN + '" stroke-width="1.2" data-sidokedja="1"');
function aminosyra(x0, y, o = {}) {
  const m = molekyl(); const n = m.atom('N', x0, y); const ca = m.atom('C', x0 + DX, y); const c = m.atom('C', x0 + 2 * DX, y); m.bond(n, ca); m.bond(ca, c);
  const h1 = H(m, n, -0.75 * DX, -0.7 * DY, o.hN1 || {}); const h2 = H(m, n, -0.75 * DX, 0.7 * DY);
  H(m, ca, 0, DY); const r = m.atom('R', x0 + DX, y - DY, { farg: SIGN, bak: rutaR(x0 + DX, y - DY) }); m.bond(ca, r);
  const od = Odbl(m, c, 0, -DY); const [oo, oh] = OH(m, c, DX, 0, o.OH || {});
  Object.assign(m, { n, ca, c, h1, h2, od, o: oo, oh, r }); return m;
}
const aminoRing = (m, tag = '') => { const a = m.atomer[m.n]; return ellips(a.x - 14, a.y, 44, 38, `data-ring="amino" ${tag}`); };
const karboxylRing = (m, tag = '') => { const a = m.atomer[m.c]; return ellips(a.x + DX * 0.85, a.y - DY * 0.45, DX * 1.4, DY * 1.3, `data-ring="karboxyl" ${tag}`); };
const M7 = {};
// ---------- M7. Två aminosyror kopplas ihop (3.2) – gemensam uppställning ----------
{
  const { XS, XA } = KOND, XL = XS - 30, XR = XA + 10;
  const steg1 = y => {
    const l = aminosyra(XL, y), r = aminosyra(XR, y);
    for (const i of [l.o, l.oh]) { const a = l.atomer[i]; a.bak = KOND.lamnar(a, 'vanster-OH'); a.mark = 'vanster-OH'; }
    { const a = r.atomer[r.h1]; a.bak = KOND.lamnar(a, 'hoger-H'); a.mark = 'hoger-H'; }
    M7.steg1 = { v: l, h: r };
    return rita(l, { tag: 'data-steg="1" data-molekyl="aminosyra-v"' }) + karboxylRing(l, 'data-steg="1"') + rita(r, { tag: 'data-steg="1" data-molekyl="aminosyra-h"' }) + aminoRing(r, 'data-steg="1"')
      + txt(XL + DX, y + 76, 'aminosyra', 'font-size="14" font-weight="bold"') + txt(XR + DX, y + 76, 'aminosyra', 'font-size="14" font-weight="bold"');
  };
  const steg2 = y => {
    const l = aminosyra(XL, y), r = aminosyra(XR, y); const lc = l.atomer[l.c], rn = r.atomer[r.n];
    l.ta([l.o, l.oh]); r.ta([r.h1]); M7.steg2 = { v: l, h: r };
    return rita(l, { tag: 'data-steg="2" data-molekyl="aminosyra-v"' }) + stub(lc.x, lc.y, DX, 0, 'data-steg="2" data-molekyl="aminosyra-v"') + rita(r, { tag: 'data-steg="2" data-molekyl="aminosyra-h"' }) + stub(rn.x, rn.y, -0.75 * DX, -0.7 * DY, 'data-steg="2" data-molekyl="aminosyra-h"');
  };
  const steg3 = y => {
    const x0 = 250, m = molekyl();
    const n1 = m.atom('N', x0, y), ca1 = m.atom('C', x0 + DX, y), c1 = m.atom('C', x0 + 2 * DX, y); m.bond(n1, ca1); m.bond(ca1, c1);
    H(m, n1, -0.75 * DX, -0.7 * DY); H(m, n1, -0.75 * DX, 0.7 * DY); H(m, ca1, 0, DY); const r1 = m.atom('R', x0 + DX, y - DY, { farg: SIGN, bak: rutaR(x0 + DX, y - DY) }); m.bond(ca1, r1); Odbl(m, c1, 0, -DY);
    const n2 = m.atom('N', x0 + 3 * DX, y); m.bond(c1, n2, 1, { farg: SIGN, bredd: 3.2, mark: 'peptidbindning' }); H(m, n2, 0, DY);
    const ca2 = m.atom('C', x0 + 4 * DX, y), c2 = m.atom('C', x0 + 5 * DX, y); m.bond(n2, ca2); m.bond(ca2, c2); H(m, ca2, 0, DY); const r2_ = m.atom('R', x0 + 4 * DX, y - DY, { farg: SIGN, bak: rutaR(x0 + 4 * DX, y - DY) }); m.bond(ca2, r2_); Odbl(m, c2, 0, -DY); OH(m, c2, DX, 0);
    M7.steg3 = { peptid: m, c1, n2 };
    return rita(m, { tag: 'data-steg="3" data-molekyl="peptid"' }) + KOND.bindRing(x0 + 2.5 * DX, y, 'peptidbindning', 'peptidbindning') + txt(x0 + 3 * DX, y + 100, 'dipeptid – två aminosyror i kedja', 'font-size="15" font-weight="bold"');
  };
  const ut = KOND.kondensation({ steg1, steg2, steg3, steg2text: 'OH från karboxylgruppen och H från aminogruppen bildar vatten', steg3etikett: 'Steg 3 – peptidbindningen', reaktion: ['aminosyra + aminosyra', 'peptid + vatten'] });
  skriv('k6-m7.svg', KOND.W, KOND.HH, 'Två aminosyror kopplas ihop i tre steg. Den vänstra lämnar en OH-grupp från sin karboxylgrupp, den högra en väteatom från sin aminogrupp. De bildar vatten, och kvar blir en peptidbindning mellan kolatomen och kväveatomen', ut);
}

// ---------- M8. Aminosyrans uppbyggnad (3.1) ----------
{
  const W = 900, HH = 420, S = 1.5, x = 450, y = 200;
  let ut = '';
  const m = molekyl(); const ca = m.atom('C', x, y); const n = m.atom('N', x - DX * S, y); m.bond(ca, n); H(m, n, -DX * 0.7 * S, -DY * 0.6 * S); H(m, n, -DX * 0.7 * S, DY * 0.6 * S);
  const c = m.atom('C', x + DX * S, y); m.bond(ca, c); Odbl(m, c, 0, -DY * S); OH(m, c, DX * S, 0);
  H(m, ca, 0, DY * S); const r = m.atom('R', x, y - DY * S, { farg: SIGN, bak: rekt(x - 22, y - DY * S - 19, 44, 38, SIGN, `fill-opacity="0.18" rx="5" stroke="${SIGN}" stroke-width="1.4" data-sidokedja="1"`) }); m.bond(ca, r);
  M.m8 = m;
  ut += rita(m, { tag: 'data-molekyl="aminosyra"', fontsize: FS * 1.3 });
  ut += ellips(x - DX * S - 18, y, 62, 52, 'data-ring="amino"') + ellips(x + DX * S * 1.9, y - DY * S * 0.4, DX * S * 1.4, DY * S * 1.2, 'data-ring="karboxyl"');
  ut += txt(x - DX * S - 18, y + 78, 'aminogrupp –NH₂'.replace('NH₂', formelON('NH₂')), 'font-size="14" font-weight="bold"') + txt(x - DX * S - 18, y + 96, 'kan ta upp en vätejon – basisk', 'font-size="12" font-style="italic"');
  ut += txt(x + DX * S * 1.9, y + 78, 'karboxylgrupp –COOH'.replace('COOH', formelO('COOH')), 'font-size="14" font-weight="bold"') + txt(x + DX * S * 1.9, y + 96, 'kan avge en vätejon – sur', 'font-size="12" font-style="italic"');
  ut += linje(x + 26, y - DY * S - 4, x + 120, y - DY * S - 44, GRA, 1, 'stroke-dasharray="3 3"') + txt(x + 124, y - DY * S - 48, 'sidokedja R – det enda som skiljer aminosyrorna åt', 'font-size="12" font-style="italic" text-anchor="start"');
  ut += txt(W / 2, HH - 14, 'alla tjugo aminosyror ser likadana ut – utom i rutan', 'font-size="14" font-style="italic"');
  skriv('k6-m8.svg', W, HH, 'En aminosyra. I mitten en kolatom med fyra bindningar: en aminogrupp till vänster med blå kväveatom, en karboxylgrupp till höger med röda syreatomer, en sidokedja märkt R uppåt och en väteatom nedåt', ut);
}

// ---------- M9/M10: aminosyror som rutor; veckad form på samma koordinater i båda ----------
const ENH = [['G', '#a8c4d8'], ['A', '#e8c547'], ['L', '#5a9668'], ['S', '#c9a1a1'], ['K', '#8A8A8A']];
const enhet = (x, y, i, tag) => rekt(x - 16, y - 14, 32, 28, ENH[i][1], `fill-opacity="0.55" rx="5" stroke="${INK}" stroke-width="1.3" data-enhet="${i + 1}" ${tag}`) + txt(x, y + 5, ENH[i][0], `font-size="14" font-weight="bold" ${tag}`);
const VECK = [[0, 0], [44, -38], [92, -8], [70, 44], [22, 56]];   // veckad form: fem rutor längs en följbar slinga
const veckad = (x0, y0, tag, svaga) => { let s = ''; const P = VECK.map(([dx, dy]) => [x0 + dx, y0 + dy]);
  for (let i = 0; i < 4; i++) s += linje(P[i][0], P[i][1], P[i + 1][0], P[i + 1][1], SIGN, 3, `data-bind="peptid" ${tag}`);
  if (svaga) { s += linje(P[0][0] + 10, P[0][1] - 6, P[2][0] - 10, P[2][1] - 2, GRA, 1.2, `stroke-dasharray="3 3" data-svag="1" ${tag}`) + linje(P[1][0] + 8, P[1][1] + 10, P[3][0] - 6, P[3][1] - 8, GRA, 1.2, `stroke-dasharray="3 3" data-svag="1" ${tag}`) + linje(P[0][0] + 6, P[0][1] + 12, P[4][0] - 4, P[4][1] - 10, GRA, 1.2, `stroke-dasharray="3 3" data-svag="1" ${tag}`); }
  P.forEach(([x, y], i) => { s += enhet(x, y, i, tag); }); return s; };
// ---------- M9. Från kedja till form (3.2) ----------
{
  const W = 960, HH = 360;
  let ut = '';
  ut += txt(30, 50, 'Steg 1 – aminosyror', `font-size="14" font-style="italic" fill="${SIGN}" text-anchor="start"`);
  [0, 1, 2, 3, 4].forEach(i => { ut += enhet(70 + i * 46 + (i % 2 ? 6 : -6), 140 + (i % 2 ? 22 : -22), i, 'data-steg="1"'); });
  ut += txt(160, 230, 'tjugo att välja mellan', 'font-size="14" font-weight="bold"');
  ut += pil(300, 140, 340, 140, INK, 2);
  ut += txt(360, 50, 'Steg 2 – kedja', `font-size="14" font-style="italic" fill="${SIGN}" text-anchor="start"`);
  [0, 1, 2, 3, 4].forEach(i => { const x = 380 + i * 50; if (i) ut += linje(x - 50 + 16, 140, x - 16, 140, SIGN, 3, 'data-bind="peptid" data-steg="2"'); ut += enhet(x, 140, i, 'data-steg="2"'); });
  ut += txt(480, 230, 'polypeptid', 'font-size="14" font-weight="bold"') + txt(480, 250, 'ordningen bestämmer vilket protein det blir', 'font-size="12" font-style="italic"');
  ut += pil(620, 140, 660, 140, INK, 2);
  ut += txt(680, 50, 'Steg 3 – veckad form', `font-size="14" font-style="italic" fill="${SIGN}" text-anchor="start"`);
  ut += veckad(720, 120, 'data-steg="3"', true);
  ut += txt(790, 230, 'protein', 'font-size="14" font-weight="bold"') + txt(790, 250, 'formen avgör funktionen', 'font-size="12" font-style="italic"') + txt(790, 272, 'svaga bindningar håller formen', `font-size="12" font-style="italic" fill="${GRA}"`);
  ut += txt(W / 2, HH - 14, 'samma fem enheter i alla tre stegen', 'font-size="14" font-style="italic"');
  skriv('k6-m9.svg', W, HH, 'Tre steg. Först fem lösa aminosyror, sedan samma fem hopkopplade till en rak kedja, sist kedjan vikt till en tredimensionell form med streckade linjer som visar var den hålls ihop', ut);
}
// ---------- M10. Denaturering (3.3) ----------
{
  const W = 960, HH = 380;
  let ut = '';
  ut += veckad(150, 150, 'data-lage="veckat"', true) + txt(210, 262, 'fungerar', 'font-size="16" font-weight="bold"');
  // pilen: värme eller ändrat pH, med termometer och pH
  ut += pil(370, 150, 560, 150, INK, 2.6) + txt(465, 128, 'värme eller ändrat pH', 'font-size="14" font-weight="bold"');
  ut += rekt(430, 160, 8, 34, VATE, `rx="4" stroke="${INK}" stroke-width="1.3" data-symbol="termometer"`) + cirkel(434, 198, 7, SYRE, INK, 1.3) + rekt(432, 172, 4, 24, SYRE) + txt(500, 196, 'pH', `font-size="15" font-weight="bold" fill="${VATSKA}" data-symbol="ph"`);
  // uppveckad kedja: samma fem enheter, oregelbunden men hel
  const P = [[640, 110], [700, 168], [760, 118], [820, 176], [880, 134]];
  for (let i = 0; i < 4; i++) ut += linje(P[i][0], P[i][1], P[i + 1][0], P[i + 1][1], SIGN, 3, 'data-bind="peptid" data-lage="denaturerat"');
  P.forEach(([x, y], i) => { ut += enhet(x, y, i, 'data-lage="denaturerat"'); });
  ut += txt(760, 262, 'fungerar inte', 'font-size="16" font-weight="bold"');
  // tillbaka: streckad, överkryssad
  ut += linje(560, 300, 370, 300, GRA, 1.6, 'stroke-dasharray="6 5" data-pil="tillbaka"') + `  <polygon points="370,300 384,294 384,306" fill="${GRA}" data-pil="tillbaka"/>\n` + linje(458, 290, 472, 310, SYRE, 2.4) + linje(472, 290, 458, 310, SYRE, 2.4) + txt(465, 326, 'går oftast inte', `font-size="12" font-style="italic" fill="${GRA}"`);
  ut += txt(W / 2, HH - 14, 'kedjan är hel – det är formen som är borta', 'font-size="15" font-weight="bold"');
  skriv('k6-m10.svg', W, HH, 'Till vänster ett veckat protein som fungerar, till höger samma kedja uppveckad och utan form. Kedjan är hel i båda bilderna. En överkryssad pil tillbaka visar att det oftast inte går att ångra', ut);
}

// ---------- M11. Tre näringsämnen, tre nedbrytningsvägar (4.1) ----------
{
  const W = 960, HH = 400, Y = [80, 180, 280];
  let ut = '';
  const atom = (x, y, t, tag) => cirkel(x, y, 12, t === 'C' ? KOL : t === 'H' ? VATE : t === 'O' ? SYRE : KVAVE, INK, 1.2, `data-atomslag="${t}" ${tag}`) + txt(x, y + 5, t, `font-size="13" font-weight="bold" fill="${t === 'C' || t === 'O' || t === 'N' ? '#fff' : INK}" ${tag}`);
  [['kolhydrat', ['C', 'H', 'O']], ['fett', ['C', 'H', 'O']], ['protein', ['C', 'H', 'O', 'N']]].forEach(([namn, at], r) => {
    const y = Y[r], tag = `data-rad="${r + 1}"`;
    ut += txt(60, y + 5, namn, `font-size="16" font-weight="bold" text-anchor="start" ${tag}`);
    at.forEach((t, i) => { ut += atom(200 + i * 34, y, t, tag); });
    ut += pil(340, y - 12, 420, y - 12, INK, 2, `data-pil="co2" ${tag}`) + txt(432, y - 7, formelO('CO₂'), `font-size="16" text-anchor="start" ${tag}`);
    ut += pil(340, y + 12, 420, y + 12, INK, 2, `data-pil="h2o" ${tag}`) + txt(432, y + 17, formelO('H₂O'), `font-size="16" text-anchor="start" ${tag}`);
    if (r === 2) { ut += pil(340, y + 40, 480, y + 40, SIGN, 3.4, `data-pil="urea" ${tag}`) + txt(492, y + 45, 'urea, ' + formelON('CO(NH₂)₂'), `font-size="16" font-weight="bold" text-anchor="start" ${tag}`) + txt(492, y + 63, 'lämnar med urinen', `font-size="12" font-style="italic" text-anchor="start" ${tag}`);
      ut += linje(302, y + 12, 290, y + 50, GRA, 1, 'stroke-dasharray="3 3"') + txt(200, y + 66, 'kan varken bli koldioxid eller vatten', 'font-size="12" font-style="italic" text-anchor="start"'); }
  });
  ut += txt(W / 2, HH - 14, 'kvävet behöver en egen väg ut', 'font-size="15" font-weight="bold"');
  skriv('k6-m11.svg', W, HH, 'Tre rader som visar hur kolhydrat, fett och protein bryts ner. De två första ger koldioxid och vatten. Proteinet innehåller dessutom kväve och ger därför också urea, som lämnar med urinen', ut);
}

// ---------- M12. Fem grupper jämförda (4.3) ----------
{
  const rader = [['Kolhydrater', 'sockerenheter', 'glykosidbindning', 'ja'], ['Fetter', 'glycerol + fettsyror', 'esterbindning', 'ja'], ['Proteiner', 'aminosyror', 'peptidbindning', 'ja'], ['Vitaminer', 'varierande', 'varierande', 'ja'], ['Mineralämnen', 'enskilda atomer', 'inga', 'nej']];
  const KX = [40, 240, 470, 700, 900], RH = 40, TOP = 30, W = 940, HH = TOP + 6 * RH + 80;
  let ut = rekt(KX[0], TOP, KX[4] - KX[0], RH, SIGN, 'data-del="rubrikrad"');
  ['Grupp', 'Byggd av', 'Bindning', 'Innehåller kol'].forEach((t, i) => { ut += txt(KX[i] + 14, TOP + 26, t, 'font-size="15" font-weight="bold" fill="#fff" text-anchor="start"'); });
  rader.forEach((r, i) => {
    const y = TOP + (i + 1) * RH, mineral = i === 4;
    if (mineral) ut += rekt(KX[0], y, KX[4] - KX[0], RH, GRA, 'fill-opacity="0.22" data-del="mineralrad"');
    ut += linje(KX[0], y + RH, KX[4], y + RH, INK, 0.8);
    r.forEach((c, k) => { ut += txt(KX[k] + 14, y + 26, c, `font-size="15" text-anchor="start" ${mineral && k > 0 ? 'font-weight="bold"' : ''} data-rad="${i + 1}" data-kolumn="${k + 1}"`); });
  });
  ut += linje(KX[2] + 4, TOP + RH + 4, KX[2] + 4, TOP + 4 * RH - 4, SIGN, 2.4, 'data-del="kondensation"') + txt(KX[2] + 12, TOP + 4 * RH + 2 + 10, '', 'font-size="1"');
  ut += linje(KX[0], TOP, KX[0], TOP + 6 * RH, INK, 1) + linje(KX[4], TOP, KX[4], TOP + 6 * RH, INK, 1);
  ut += txt(W / 2, TOP + 6 * RH + 30, 'de fyra översta byggs och bryts ner', 'font-size="14" font-style="italic"') + txt(W / 2, TOP + 6 * RH + 52, 'den nedersta ska bara finnas på plats', 'font-size="14" font-style="italic"');
  skriv('k6-m12.svg', W, HH, 'En tabell med fem grupper av näringsämnen. Kolhydrater, fetter och proteiner byggs av enheter med varsin bindningstyp. Vitaminer varierar. Mineralämnen består av enskilda atomer, har inga bindningar och innehåller inget kol', ut);
}

// ================= KONTROLLER =================
const las = SK.las;
const rapport = []; function kolla(n, ok, t) { rapport.push(`${ok ? 'OK ' : 'FEL'} ${n}: ${t}`); if (!ok) process.exitCode = 1; }
{ // syre rött, kväve blått, gröna ringar
  for (let i = 1; i <= 12; i++) {
    const s = las(`k6-m${i}.svg`);
    const o = element(s, e => e['data-atom'] === 'O' || e['data-o'] === '1' || e['data-atomslag'] === 'O'), oR = o.filter(e => e.fill === SYRE).length;
    const n = element(s, e => e['data-atom'] === 'N' || e['data-n'] === '1' || e['data-atomslag'] === 'N'), nB = n.filter(e => e.fill === KVAVE).length;
    kolla(`M${i} syre rött / kväve blått`, o.length === oR && n.length === nB, `${oR}/${o.length} syre röda, ${nB}/${n.length} kväve blå`);
  }
  for (const [i, vantat] of [[7, ['karboxyl', 'amino']], [8, ['amino', 'karboxyl']], [11, []]]) { const s = las(`k6-m${i}.svg`); const r = element(s, e => e['data-ring']).map(e => e['data-ring']); if (vantat.length) kolla(`M${i} gröna ringar`, vantat.every(v => r.includes(v)) && element(s, e => e['data-ring']).every(e => e.stroke === SIGN), r.join(', ')); }
  kolla('M7/M8/M11 kväve finns', [7, 8, 11].every(i => element(las(`k6-m${i}.svg`), e => (e['data-atom'] === 'N' || e['data-atomslag'] === 'N') && e.fill === KVAVE).length > 0), 'blå kväveatomer i alla tre');
}
{ // M1
  const r = rakna(M.m1full); kolla('M1 fullständig', r.C === 6 && r.H === 12 && r.O === 6 && valens(M.m1full), `${r.C} C, ${r.H} H, ${r.O} O; alla valenser rätt`);
  const e = M.m1enkel; const s = las('k6-m1.svg'); const horn = element(s, x => x['data-del'] === 'forenklad' && x['data-ringform'])[0];
  kolla('M1 förenklad', e.C === 6 && e.H === 12 && e.O === 6 && horn['data-ringform'] === '6' && e.subs.filter(x => /OH$/.test(x)).length === 5 && e.subs.includes('C5-CH2OH'), `${cnt(e)} (data); sexhörning med ringens O; ${e.subs.filter(x => /OH$/.test(x)).length} OH-grupper, C6 utanför ringen`);
}
{ // M2
  const { glukos, galaktos, fruktos } = M.m2; const s = las('k6-m2.svg');
  const form = n => element(s, e => e['data-molekyl'] === n && e['data-ringform'])[0]['data-ringform'];
  kolla('M2 tre isomerer', [glukos, galaktos, fruktos].every(d => d.C === 6 && d.H === 12 && d.O === 6) && form('glukos') === '6' && form('galaktos') === '6' && form('fruktos') === '5', `${cnt(glukos)} · ${cnt(galaktos)} · ${cnt(fruktos)}; hörn 6/6/5`);
  const gr = element(s, e => e['data-gron']); kolla('M2 markerad OH', gr.length === 2 && gr.every(e => e['data-gron'] === 'C4-OH'), `markerad: ${gr.map(e => e['data-gron']).join(', ')} – samma kolatom, olika riktning`);
}
{ // M3
  const s = las('k6-m3.svg'), v = M.m3s1.v, h = M.m3s1.h, pv = M.m3s3.v, ph = M.m3s3.h;
  const prod = { C: pv.C + ph.C, H: pv.H + ph.H, O: pv.O + ph.O + 1 };   // + bryggans O
  kolla('M3 atombalans', v.C === 6 && v.H === 12 && v.O === 6 && h.H === 12 && prod.C === 12 && prod.H === 22 && prod.O === 11, `steg 1: ${cnt(v)} + ${cnt(h)}; steg 3 maltos ${cnt(prod)} + vatten 2 H, 1 O`);
  const lam = element(s, e => e['data-lamnar']); const vO = lam.filter(e => e['data-lamnar'] === 'vanster-OH').length, hH = lam.filter(e => e['data-lamnar'] === 'hoger-H').length;
  kolla('M3 vänster lämnar OH, höger H', vO === 2 && hH === 1 && element(s, e => e['data-sub'] === 'C1-ledig').length > 0 && element(s, e => e['data-sub'] === 'C4-O' && e['data-atom'] === 'O').length === 1, `${vO} gula markeringar i vänstra ringen (O + H på C1), ${hH} i högra (H på C4-OH); steg 2: ledig bindning på vänster C1, syret kvar på höger C4`);
  kolla('M3 glykosidbindning', element(s, e => e['data-ring'] === 'glykosidbindning').length === 1 && element(s, e => e['data-brygga'] === '1' && e.fill === SYRE).length === 1, 'grön ring på bryggan, bryggans syre rött');
}
{ // M4
  const s = las('k6-m4.svg'); const os = n => element(s, e => e['data-kedja'] === n && e['data-ring-o']).map(e => e['data-ring-o']);
  const st = os('starkelse'), ce = os('cellulosa'), gr = n => element(s, e => e['data-kedja'] === n && e['data-gron']).length;
  kolla('M4 stärkelse', st.length === 4 && st.every(x => x === 'upp') && M.m4.st.every(d => d.C === 6), `fyra ringar, ringens O: ${st.join(' ')}; ${gr('starkelse')} gröna markeringar på rad`);
  kolla('M4 cellulosa', ce.length === 4 && ce.join(' ') === 'upp ner upp ner' && M.m4.ce.every(d => d.C === 6), `fyra ringar, ringens O: ${ce.join(' ')}; ${gr('cellulosa')} gröna markeringar växlar`);
  kolla('M4 vätebindningar', element(s, e => e['data-vatebindning']).length === 3, '3 streckade linjer under cellulosan');
}
{ // M5
  const s = las('k6-m5.svg'); const k = element(s, e => e['data-kedja']); const ringar = element(s, e => e['data-ring'] === 'esterbindning').length, kb = element(s, e => e['data-ring'] === 'karboxyl').length;
  const g = element(s, e => e['data-molekyl'] === 'glycerol');
  kolla('M5 fettmolekylen', ringar === 3 && kb === 3 && k.length === 3 && k.map(e => e['data-kol']).join('/') === '12/16/18' && k.filter(e => e['data-knyck'] === '1').length === 1 && k[1]['data-knyck'] === '1' && antalAtom(g, 'C') === 3 && antalAtom(g, 'O') === 3 && k.every(e => (e.d.match(/ L/g) || []).length === +e['data-kol'] - 1), `3 esterbindningar, 3 karboxylringar; fettsyror ${k.map(e => e['data-kol']).join('/')} C (segment = kol − 1), knyck på den mellersta; glycerol 3 C, 3 O`);
}
{ // M6
  const s = las('k6-m6.svg'); const n = t => element(s, e => e['data-panel'] === t && e['data-kedja']).length, v = t => element(s, e => e['data-panel'] === t && e['data-vdw']).length, d = element(s, e => e['data-dubbel'] && e['data-panel'] === 'omattade').length;
  kolla('M6 packning', n('mattade') === 6 && n('omattade') === 6 && v('mattade') >= 2 * v('omattade') && d === 6, `6 + 6 kedjor; attraktionslinjer ${v('mattade')} mot ${v('omattade')}; ${d} dubbelbindningar markerade vid knyckarna`);
}
{ // M7 – den kritiska
  const s = las('k6-m7.svg'); const { v, h } = M7.steg1;
  const vl = v.atomer.map((a, i) => ({ a, i })).filter(x => x.a && x.a.mark === 'vanster-OH'), hl = h.atomer.map((a, i) => ({ a, i })).filter(x => x.a && x.a.mark === 'hoger-H');
  const vO = vl.find(x => x.a.t === 'O'), vH = vl.find(x => x.a.t === 'H');
  const vOk = vl.length === 2 && vO && vH && grannar(v, vO.i).includes(v.c) && grannar(v, vH.i).includes(vO.i) && bindTal(v, vO.i) === 2;
  const hOk = hl.length === 1 && hl[0].a.t === 'H' && h.atomer[grannar(h, hl[0].i)[0]].t === 'N';
  kolla('M7 vänster lämnar OH (karboxyl)', vOk, `markerat: ${vl.map(x => x.a.t).join(' + ')} – syret enkelbundet till karboxylkolet, vätet på det syret`);
  kolla('M7 höger lämnar H (amino)', hOk, `markerat: ${hl.map(x => x.a.t).join(' + ')} – vätet sitter på kväveatomen`);
  const p = M7.steg3.peptid, rp = rakna(p), r1 = rakna(v), r2s = rakna(h);
  const pb = p.bind.find(b => b.mark === 'peptidbindning'), pC = p.atomer[pb.a].t === 'C' ? pb.a : pb.b, pN = pb.a === pC ? pb.b : pb.a;
  kolla('M7 steg 3', valens(p) && p.atomer[pN].t === 'N' && p.bind.some(b => b.n === 2 && (b.a === pC || b.b === pC)) && r1.C + r2s.C === rp.C && r1.H + r2s.H === rp.H + 2 && r1.O + r2s.O === rp.O + 1 && r1.N + r2s.N === rp.N, `peptidbindningen C–N från karboxylkolet (med =O) till kvävet; alla valenser (C 4, N 3, O 2); atombalans (${r1.C + r2s.C} C, ${r1.H + r2s.H} H, ${r1.O + r2s.O} O, ${r1.N + r2s.N} N) = dipeptid (${rp.C}, ${rp.H}, ${rp.O}, ${rp.N}) + H₂O`);
  kolla('M7 steg 2', rakna(M7.steg2.v).O === r1.O - 1 && rakna(M7.steg2.v).H === r1.H - 1 && rakna(M7.steg2.h).H === r2s.H - 1 && element(s, e => e['data-stub']).length === 2, 'vänster förlorar O + H, höger H; två lediga bindningar');
}
{ // M8
  const m = M.m8; const ca = 0; const gr = grannar(m, ca).map(i => m.atomer[i].t).sort().join('');
  kolla('M8 fyra bindningar', bindTal(m, ca) === 4 && gr === 'CHNR' && rakna(m).N === 1 && rakna(m).O === 2 && valens(m), `mittkolatomen: ${gr.split('').join(', ')} (4); 1 N, 2 O; ${element(las('k6-m8.svg'), e => e['data-ring']).length} gröna ringar`);
}
{ // M9, M10
  const s9 = las('k6-m9.svg'), s10 = las('k6-m10.svg');
  const enh = (s, f) => element(s, e => e['data-enhet'] && f(e)).map(e => e['data-enhet']).join('');
  kolla('M9 fem enheter', enh(s9, e => e['data-steg'] === '1') === '12345' && enh(s9, e => e['data-steg'] === '2') === '12345' && enh(s9, e => e['data-steg'] === '3') === '12345' && element(s9, e => e['data-bind'] === 'peptid' && e['data-steg'] === '2').length === 4 && element(s9, e => e['data-svag']).length === 3, 'samma fem i samma ordning i alla tre stegen; 4 peptidbindningar i kedjan; 3 svaga bindningar i veckningen');
  const vk = enh(s10, e => e['data-lage'] === 'veckat'), dn = enh(s10, e => e['data-lage'] === 'denaturerat');
  const bv = element(s10, e => e['data-bind'] === 'peptid' && e['data-lage'] === 'veckat').length, bd = element(s10, e => e['data-bind'] === 'peptid' && e['data-lage'] === 'denaturerat').length;
  kolla('M10 kedjan hel i båda lägena', vk === '12345' && dn === '12345' && bv === 4 && bd === 4 && element(s10, e => e['data-svag'] && e['data-lage'] === 'veckat').length === 3 && element(s10, e => e['data-svag'] && e['data-lage'] === 'denaturerat').length === 0, `veckat ${vk.length} enheter / ${bv} bindningar, denaturerat ${dn.length} / ${bd}; svaga bindningar bara i det veckade`);
  const v9 = element(s9, e => e['data-steg'] === '3' && e['data-enhet']).map(e => e.x + ',' + e.y), v10 = element(s10, e => e['data-lage'] === 'veckat' && e['data-enhet']).map(e => e.x + ',' + e.y);
  kolla('M10 = M9 steg 3', v9.map((p, i) => { const [a, b] = p.split(','), [c, d] = v10[i].split(','); return (a - c) === (v9[0].split(',')[0] - v10[0].split(',')[0]) && (b - d) === (v9[0].split(',')[1] - v10[0].split(',')[1]); }).every(Boolean), 'samma veckade form (samma inbördes koordinater)');
}
{ // M11
  const s = las('k6-m11.svg'); const pil = r => element(s, e => e['data-rad'] === String(r) && e['data-pil'] && e._tag === 'line').map(e => e['data-pil']);
  const nb = element(s, e => e['data-atomslag'] === 'N');
  kolla('M11 tre rader', pil(1).join(',') === pil(2).join(',') && pil(3).length === pil(1).length + 1 && pil(3).includes('urea') && nb.length === 1 && nb[0]['data-rad'] === '3' && nb[0].fill === KVAVE, `rad 1 och 2: ${pil(1).join('+')}; rad 3: ${pil(3).join('+')}; kväve bara i rad 3, blått`);
  kolla('M11 urea', /CO\(NH/.test(s.replace(/<[^>]+>/g, '')), 'CO(NH₂)₂ med parentes i etiketten');
}
{ // M12
  const s = las('k6-m12.svg'); const b = [1, 2, 3].map(r => element(s, e => e['data-rad'] === String(r) && e['data-kolumn'] === '3')[0]);
  const nej = element(s, e => e['data-kolumn'] === '4');
  kolla('M12 tabell', b.length === 3 && element(s, e => e['data-del'] === 'mineralrad').length === 1 && (s.match(/data-rad="\d" data-kolumn="1"/g) || []).length === 5 && nej.length === 5, `5 rader; bindningskolumnen glykosid/ester/peptid; mineralraden ensam med grå bakgrund och "nej"`);
}
{ // gemensam uppställning M3 / M7 / L9
  const j = KOND.jamfor({ L9: fs.readFileSync(path.join(ROT, 'kapitel', 'organisk-kemi', 'delkapitel', 'syror-och-estrar', 'img', 'k5-l9.svg'), 'utf8'), M3: las('k6-m3.svg'), M7: las('k6-m7.svg') });
  for (const r of j.res) kolla(`uppställning ${r.namn}`, r.ok, `${r.storlek}; ${j.rader} mallrader (stegrubriker 1–2, "dessa två lämnar", vattenrutan med molekyl, pil och text, dubbelpilen) ordagrant på plats${r.saknas.length ? ' – SAKNAS: ' + r.saknas.length : ''}; steg: ${r.steg.join(' | ')}`);
  // steg 3-rubriken får skilja sig (Joachim 2026-09-19, beslut b): bilden ska lära ut vad bindningen heter – esterbindning,
  // glykosidbindning, peptidbindning. Likheten bärs av allt annat. Rapporteras, kontrolleras inte.
  rapport.push(`--  uppställning steg 3-rubriker (avsiktligt olika): ${j.res.map(r => r.steg[2]).join(' / ')}`);
}
console.log(`${SK.antal} SVG skrivna till ${path.relative(ROT, UT)}`);
console.log(rapport.join('\n'));
