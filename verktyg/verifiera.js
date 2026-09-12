/* verifiera.js — kör en probe i en RIKTIG sida via Chrome DevTools Protocol (headless).
   Mönster från Matematik/verktyg/cdp-kor.js. Node ≥22 (inbyggd WebSocket), ingen npm.
   Rör aldrig källfiler; Chrome-profilen skapas i OS-temp och raderas efteråt.

   KÖR (från repo-roten):
     node verktyg/verifiera.js <file://-url> <probe.js> [--pre pre.js] [--wait ms] [--shot fil.png] [--width px] [--height px]
   Exempel – formelverifiering på avsnitt 1 med flipcards-fixtur (KOMPONENTER DEL 8.5):
     node verktyg/verifiera.js "file:///C:/Arkiv%20-%20webbbok/Kemibok/kapitel/syror-och-baser/delkapitel/repetition/avsnitt-1-atomer-molekyler-joner.html" verktyg/probe-formler.js --pre verktyg/pre-flipcards-fixtur.js --wait 3000

   Skriver JSON på stdout: { probe, natverk: { antal, externa, misslyckade, filer }, konsol }
   - natverk.externa ska vara [] (plattformsregel: allt självhostat)
   - natverk.misslyckade ska vara [] (saknad fil, t.ex. MathJax-typsnitt)
   - konsol: error/warning/exception från sidan */
'use strict';
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path'), os = require('os'), http = require('http');

const args = process.argv.slice(2);
const url = args[0], probeFil = args[1];
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const WAIT = parseInt(opt('--wait', 2500), 10);
const PRE = opt('--pre', null) ? fs.readFileSync(opt('--pre'), 'utf8') : null;
const SHOT = opt('--shot', null);
const WIDTH = parseInt(opt('--width', 1366), 10);
const HEIGHT = parseInt(opt('--height', 900), 10);
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9300 + Math.floor(Math.random() * 500);
const probe = fs.readFileSync(probeFil, 'utf8');

const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'kemi-verif-'));
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--allow-file-access-from-files',
  '--no-first-run', '--hide-scrollbars', `--window-size=${WIDTH},${HEIGHT}`,
  '--remote-debugging-port=' + PORT, '--user-data-dir=' + prof, 'about:blank'], { stdio: 'ignore' });

function getJson(p, method) {
  return new Promise((res, rej) => {
    const rq = http.request({ host: '127.0.0.1', port: PORT, path: p, method: method || 'GET' }, r => {
      let s = ''; r.on('data', d => s += d); r.on('end', () => { try { res(JSON.parse(s)); } catch (e) { rej(e); } });
    }); rq.on('error', rej); rq.end();
  });
}
async function waitPort() {
  for (let i = 0; i < 200; i++) { try { return await getJson('/json/version'); } catch (e) { await new Promise(r => setTimeout(r, 100)); } }
  throw new Error('Chrome svarade inte');
}

(async () => {
  let code = 0;
  try {
    await waitPort();
    const target = await getJson('/json/new?about:blank', 'PUT').catch(() => null)
      || (await getJson('/json')).find(t => t.type === 'page');
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
    let id = 0; const pending = {};
    const natverk = { antal: 0, externa: [], misslyckade: [], filer: [] };
    const konsol = [];
    ws.onmessage = ev => {
      const m = JSON.parse(ev.data);
      if (m.id && pending[m.id]) { pending[m.id](m); delete pending[m.id]; return; }
      if (m.method === 'Network.requestWillBeSent') {
        const u = m.params.request.url; natverk.antal++;
        natverk.filer.push(u);
        if (!u.startsWith('file://') && !u.startsWith('about:') && !u.startsWith('data:')) natverk.externa.push(u);
      }
      if (m.method === 'Network.loadingFailed') natverk.misslyckade.push(m.params.errorText + ' ' + (m.params.requestId));
      if (m.method === 'Runtime.consoleAPICalled' && (m.params.type === 'error' || m.params.type === 'warning'))
        konsol.push(m.params.type + ': ' + m.params.args.map(a => a.value || a.description || '').join(' ').slice(0, 300));
      if (m.method === 'Runtime.exceptionThrown')
        konsol.push('exception: ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text).slice(0, 300));
    };
    const send = (method, params) => new Promise(res => { const i = ++id; pending[i] = res; ws.send(JSON.stringify({ id: i, method, params: params || {} })); });
    await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1, mobile: false });
    if (PRE) await send('Page.addScriptToEvaluateOnNewDocument', { source: PRE });
    await send('Page.navigate', { url });
    await new Promise(r => setTimeout(r, WAIT));
    const r = await send('Runtime.evaluate', { expression: probe, awaitPromise: true, returnByValue: true, timeout: 60000 });
    let resultat = null;
    if (r.result && r.result.exceptionDetails) { resultat = { FEL: JSON.stringify(r.result.exceptionDetails.exception || r.result.exceptionDetails).slice(0, 800) }; code = 1; }
    else resultat = r.result && r.result.result ? r.result.result.value : null;
    if (SHOT) {
      const s = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      fs.writeFileSync(SHOT, Buffer.from(s.result.data, 'base64'));
    }
    // mapp-filtrerad lista: bara sökvägar under repot, relativa
    natverk.filer = natverk.filer.map(u => u.replace(/^file:\/\/\/C:\/Arkiv%20-%20webbbok\/Kemibok\//, ''));
    console.log(JSON.stringify({ probe: resultat, natverk: { antal: natverk.antal, externa: natverk.externa, misslyckade: natverk.misslyckade, filer: natverk.filer }, konsol }, null, 1));
    ws.close();
  } catch (e) { console.error('verifiera:', e.message); code = 1; }
  finally { try { chrome.kill(); } catch (e) {} setTimeout(() => { try { fs.rmSync(prof, { recursive: true, force: true }); } catch (e) {} process.exit(code); }, 300); }
})();
