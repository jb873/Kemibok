// servera.js – lokal HTTP-server för att läsa boken som eleverna kommer att göra.
//
// Sidorna hämtar JSON (flipcards, frågor, föreläsningar) med fetch(), vilket webbläsare
// blockerar för file://-sidor. Öppnas en avsnittssida direkt från filsystemet visar Öva
// "Flipcards finns inte för detta avsnitt ännu" och Elevboken "Kunde inte ladda frågor".
// Över HTTP fungerar allt. Node inbyggd http – ingen npm.
//
// Kör från valfri mapp:  node verktyg/servera.js [port]     (default 8080)
// Öppna sedan            http://localhost:8080/
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const ROT = path.join(__dirname, '..');
const PORT = parseInt(process.argv[2], 10) || 8080;
const TYP = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.md': 'text/plain; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.ico': 'image/x-icon' };

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) { p += 'index.html'; }
  const fil = path.normalize(path.join(ROT, p));
  if (!fil.startsWith(ROT)) { res.writeHead(403); res.end('403'); return; }
  fs.readFile(fil, (fel, data) => {
    if (fel) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('404 ' + p); return; }
    res.writeHead(200, { 'Content-Type': TYP[path.extname(fil).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`Kemibok serveras på http://localhost:${PORT}/  (Ctrl+C avslutar)`);
  console.log(`Pilot: http://localhost:${PORT}/kapitel/syror-och-baser/delkapitel/repetition/index.html`);
});
