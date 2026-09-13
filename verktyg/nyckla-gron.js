// nyckla-gron.js – nycklar bort ren grön bakgrund (#00ff00, KOMPONENTER 9.0) ur en AI-bild och skriver
// en webp med transparens. Körs i headless Chromium via verktyg/verifiera.js (canvas), ingen npm.
// Kör: node verktyg/nyckla-gron.js <in.webp|png> [ut.webp]     (ut utelämnat = skriver över in-filen)
//
// Metod: pixlar nära ren grön (låg R och B, hög G) → alfa 0; en smal övergångszon får mjuk kant, och
// grönstick i kantpixlar tas bort (G begränsas till max(R, B)) så att konturerna inte får grön halo.
// Kontroll efteråt: andel genomskinligt, kvarvarande gröna pixlar, och att motivet inte innehåller
// ren grön (då hade den nycklats bort – motivet får aldrig innehålla färgen).
'use strict';
const fs = require('fs'), path = require('path');
const { spawnSync } = require('child_process');
const inFil = process.argv[2], utFil = process.argv[3] || process.argv[2];
if (!inFil || !fs.existsSync(inFil)) { console.error('användning: node verktyg/nyckla-gron.js <in.webp> [ut.webp]'); process.exit(2); }
const abs = path.resolve(inFil);
const url = 'file:///' + abs.replace(/\\/g, '/').replace(/ /g, '%20');
// tom sida i samma mapp som bilden så att canvas får läsa pixlarna (samma "origin" under --allow-file-access-from-files)
const sida = path.join(path.dirname(abs), `_nyckla-${process.pid}.html`);
fs.writeFileSync(sida, '<!DOCTYPE html><html><body></body></html>');
const probe = path.join(path.dirname(abs), `_nyckla-${process.pid}.js`);
fs.writeFileSync(probe, `(async () => {
  const img = new Image(); img.src = ${JSON.stringify(path.basename(abs))}; await img.decode();
  const w = img.naturalWidth, h = img.naturalHeight, c = document.createElement('canvas'); c.width = w; c.height = h;
  const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0); const im = ctx.getImageData(0, 0, w, h), d = im.data;
  // "grönhet": hur mycket G överstiger max(R, B); ren #00ff00 ger 255, motiv utan grönt ≤ 0
  const gron = i => d[i + 1] - Math.max(d[i], d[i + 2]);
  const T0 = 120, T1 = 60;   // ≥ T0 → helt bort; T1..T0 → mjuk kant
  let bort = 0, mjuk = 0, kvarGron = 0;
  for (let i = 0; i < d.length; i += 4) {
    const g = gron(i);
    if (g >= T0) { d[i + 3] = 0; bort++; }
    else if (g > T1) { d[i + 3] = Math.round(d[i + 3] * (T0 - g) / (T0 - T1)); mjuk++; d[i + 1] = Math.max(d[i], d[i + 2]); }
    else if (g > 25 && d[i + 3] > 0) { d[i + 1] = Math.max(d[i], d[i + 2]) + 25; kvarGron++; }   // grönstick i kantpixlar
  }
  ctx.putImageData(im, 0, 0);
  // hörnkontroll: var bakgrunden verkligen grön?
  const horn = [[0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1]].map(([x, y]) => { const i = (y * w + x) * 4; return [d[i], d[i + 1], d[i + 2], d[i + 3]]; });
  return { w, h, bort: Math.round(bort / (w * h) * 1000) / 10, mjuk: Math.round(mjuk / (w * h) * 1000) / 10, grönstickKorrigerade: kvarGron, hornAlfa: horn.map(p => p[3]), data: c.toDataURL('image/webp', 0.92) };
})()`);
const res = spawnSync('node', [path.join(__dirname, 'verifiera.js'), 'file:///' + sida.replace(/\\/g, '/').replace(/ /g, '%20'), probe, '--wait', '300', '--timeout', '120000'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
fs.unlinkSync(sida); fs.unlinkSync(probe);
const ut = res.stdout || '';
const start = ut.indexOf('{');
let o;
try { o = JSON.parse(ut.slice(start)); } catch (e) { console.error('verifiera gav inget resultat:', ut.slice(0, 500), res.stderr); process.exit(1); }
const p = o.probe;
if (!p || p.FEL) { console.error('nyckling misslyckades:', JSON.stringify(p)); process.exit(1); }
if (p.hornAlfa.some(a => a !== 0)) { console.error(`hörnen är inte genomskinliga efter nyckling (alfa ${p.hornAlfa.join(',')}) – var bakgrunden verkligen #00ff00?`); process.exit(1); }
fs.writeFileSync(utFil, Buffer.from(p.data.split(',')[1], 'base64'));
console.log(`${path.basename(utFil)}: ${p.w}x${p.h}, ${p.bort}% bort, ${p.mjuk}% mjuk kant, ${p.grönstickKorrigerade} kantpixlar avgrönade → ${fs.statSync(utFil).size} byte webp med alfa`);
