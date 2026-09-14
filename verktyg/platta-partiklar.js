// platta-partiklar.js – ersätter röda partiklar med glansdagrar i en AI-bild med jämnt fyllda cirklar
// (platt stil, KOMPONENTER DEL 9), och kan ta bort den partikel som ligger längst till höger.
// Körs i headless Chromium via verktyg/verifiera.js (canvas), ingen npm. Körs FÖRE nyckla-gron.js
// (den borttagna partikeln fylls med omgivningens färg – grön bakgrund där den stack ut, kol där den låg inne).
// Kör: node verktyg/platta-partiklar.js <in.webp|png> [ut.webp] [--farg #C0392B] [--ta-bort-hoger]
//
// Metod: rödaktiga pixlar (R hög, G och B låga) flödesfylls till komponenter; varje komponent ersätts av en
// cirkel med bounding-boxens centrum och halva största sida som radie, fylld i --farg med 1 px mjuk kant.
// Glansdagrarna ligger inne i cirkeln och målas över. --ta-bort-hoger: komponenten med störst x tas bort
// i stället – varje pixel i dess cirkel får färgen från pixeln rakt utanför cirkelkanten i samma riktning.
'use strict';
const fs = require('fs'), path = require('path');
const { spawnSync } = require('child_process');
const argv = process.argv.slice(2);
const fi = argv.indexOf('--farg');
const FARG = fi >= 0 ? argv[fi + 1] : '#C0392B';
const TA_BORT = argv.includes('--ta-bort-hoger');
const filer = argv.filter((a, i) => !a.startsWith('--') && !(fi >= 0 && i === fi + 1));
const inFil = filer[0], utFil = filer[1] || filer[0];
if (!inFil || !fs.existsSync(inFil)) { console.error('användning: node verktyg/platta-partiklar.js <in.webp> [ut.webp] [--farg #rrggbb] [--ta-bort-hoger]'); process.exit(2); }
const abs = path.resolve(inFil);
const sida = path.join(path.dirname(abs), `_platta-${process.pid}.html`);
fs.writeFileSync(sida, '<!DOCTYPE html><html><body></body></html>');
const probe = path.join(path.dirname(abs), `_platta-${process.pid}.js`);
fs.writeFileSync(probe, `(async () => {
  const img = new Image(); img.src = ${JSON.stringify(path.basename(abs))}; await img.decode();
  const w = img.naturalWidth, h = img.naturalHeight, c = document.createElement('canvas'); c.width = w; c.height = h;
  const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0); const im = ctx.getImageData(0, 0, w, h), d = im.data;
  const rod = i => d[i] > 110 && d[i] > d[i + 1] * 1.7 && d[i] > d[i + 2] * 1.7;
  const sedd = new Uint8Array(w * h); const komp = [];
  for (let p = 0; p < w * h; p++) {
    if (sedd[p] || !rod(p * 4)) continue;
    const stack = [p]; sedd[p] = 1; let n = 0, x0 = w, x1 = -1, y0 = h, y1 = -1;
    while (stack.length) {
      const q = stack.pop(); n++; const x = q % w, y = (q - x) / w;
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue; const r = ny * w + nx; if (!sedd[r] && rod(r * 4)) { sedd[r] = 1; stack.push(r); } }
    }
    if (n >= 60) komp.push({ n, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, r: Math.max(x1 - x0, y1 - y0) / 2 + 1 });
  }
  komp.sort((a, b) => a.cx - b.cx);
  const borttagen = ${TA_BORT} && komp.length ? komp.pop() : null;
  const orig = new Uint8ClampedArray(d);
  if (borttagen) {
    const { cx, cy, r } = borttagen, R = r + 2;
    for (let y = Math.floor(cy - R - 1); y <= cy + R + 1; y++) for (let x = Math.floor(cx - R - 1); x <= cx + R + 1; x++) {
      const dx = x - cx, dy = y - cy, dist = Math.hypot(dx, dy); if (dist > R || x < 0 || y < 0 || x >= w || y >= h) continue;
      const k = (R + 3) / (dist || 1); const sx = Math.round(cx + dx * k), sy = Math.round(cy + dy * k);
      const sxc = Math.min(w - 1, Math.max(0, sx)), syc = Math.min(h - 1, Math.max(0, sy));
      const i = (y * w + x) * 4, j = (syc * w + sxc) * 4; d[i] = orig[j]; d[i + 1] = orig[j + 1]; d[i + 2] = orig[j + 2]; d[i + 3] = orig[j + 3];
    }
  }
  ctx.putImageData(im, 0, 0);
  ctx.fillStyle = ${JSON.stringify(FARG)};
  for (const k of komp) { ctx.beginPath(); ctx.arc(k.cx, k.cy, k.r, 0, Math.PI * 2); ctx.fill(); }
  return { w, h, partiklar: komp.map(k => ({ x: Math.round(k.cx), y: Math.round(k.cy), r: Math.round(k.r * 10) / 10 })), borttagen: borttagen && { x: Math.round(borttagen.cx), y: Math.round(borttagen.cy), r: Math.round(borttagen.r) }, data: c.toDataURL('image/webp', 0.92) };
})()`);
const res = spawnSync('node', [path.join(__dirname, 'verifiera.js'), 'file:///' + sida.replace(/\\/g, '/').replace(/ /g, '%20'), probe, '--wait', '300', '--timeout', '120000'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
fs.unlinkSync(sida); fs.unlinkSync(probe);
const ut = res.stdout || '';
let o;
try { o = JSON.parse(ut.slice(ut.indexOf('{'))); } catch (e) { console.error('verifiera gav inget resultat:', ut.slice(0, 500), res.stderr); process.exit(1); }
const p = o.probe;
if (!p || p.FEL) { console.error('misslyckades:', JSON.stringify(p)); process.exit(1); }
fs.writeFileSync(utFil, Buffer.from(p.data.split(',')[1], 'base64'));
console.log(`${path.basename(utFil)}: ${p.w}x${p.h}, ${p.partiklar.length} partiklar plattade i ${FARG}` + (p.borttagen ? `, borttagen: (${p.borttagen.x}, ${p.borttagen.y}) r ${p.borttagen.r}` : '') + ` → ${fs.statSync(utFil).size} byte`);
p.partiklar.forEach(k => console.log(`  (${k.x}, ${k.y}) r ${k.r}`));
