// Capturas deterministas de cada paso y experimento (movimiento reducido y rAF virtual), para comparar antes/después.
// Uso: node capturas.js <antes|despues> [escena ...]
// Guarda capturas/<version>/<escena>/<perfil>/<n>-pagina.png y <n>-cv<k>.png (el mapa de bits de cada lienzo visible).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = __dirname, BASE = 'http://localhost:4173';
const [version = 'despues', ...esc] = process.argv.slice(2);
const ESCENAS = esc.length ? esc : ['acidos-bases', 'liquidos-y-solidos'];
const PERFILES = [
  { id: 'cel-claro', viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, colorScheme: 'light' },
  { id: 'cel-oscuro', viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, colorScheme: 'dark' },
  { id: 'pc-claro', viewport: { width: 1366, height: 768 }, deviceScaleFactor: 1, colorScheme: 'light' },
  { id: 'pc-oscuro', viewport: { width: 1366, height: 768 }, deviceScaleFactor: 1, colorScheme: 'dark' },
];

// rAF virtual: los cuadros corren solo cuando se llama a __cuadros(n), con 1/60 s entre cuadros (reloj virtual).
const INIT = () => {
  // sin IntersectionObserver: «a la vista» depende solo de que el lienzo se muestre (si no, el número de cuadros variaría)
  window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
  let cola = [], id = 0;
  window.requestAnimationFrame = cb => { cola.push([++id, cb]); return id; };
  window.cancelAnimationFrame = k => { cola = cola.filter(c => c[0] !== k); };
  let t = 1000;   // reloj virtual: solo avanza 1/60 s por cuadro (si no, el dt dependería del tiempo real)
  window.__cuadros = n => {
    for (let i = 0; i < n; i++) { t += 1000 / 60; const c = cola; cola = []; for (const [, cb] of c) cb(t); }
  };
};

async function correr(browser, escena, perfil) {
  const { id, ...o } = perfil;
  const ctx = await browser.newContext({ ...o, reducedMotion: 'reduce', serviceWorkers: 'block' });
  if (version !== 'despues' && fs.existsSync(path.join(DIR, version, escena + '.html'))) await ctx.route(`**/plantillas/${escena}/index.html*`, r => r.fulfill({ contentType: 'text/html; charset=utf-8', body: fs.readFileSync(path.join(DIR, version, escena + '.html')) }));   // antes/ o un experimento
  await ctx.addInitScript(INIT);
  const page = await ctx.newPage();
  const errores = [];
  page.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  page.on('pageerror', e => errores.push(String(e)));
  const dir = path.join(DIR, 'capturas', process.env.NOMBRE || version, escena, id); fs.mkdirSync(dir, { recursive: true });
  await page.goto(`${BASE}/plantillas/${escena}/index.html?desde=app`);
  await page.waitForFunction(() => document.querySelector('#stepBody') && document.querySelector('#stepBody').innerHTML.trim().length > 0);
  await page.evaluate(() => document.fonts.ready);
  let n = 0;
  const toque = async sel => { if (o.hasTouch) await page.tap(sel); else await page.click(sel); };
  const foto = async nombre => {
    await page.waitForTimeout(600);           // timers reales (alResponder espera 380 ms en el celular)
    await page.evaluate(() => window.__cuadros(90));
    await page.waitForTimeout(100);
    // que corran los ratos libres pendientes (líquidos prepara ahí sus hojas de moléculas) antes de los últimos cuadros
    await page.evaluate(() => new Promise(r => requestIdleCallback(() => requestIdleCallback(r, { timeout: 1000 }), { timeout: 1000 })));
    await page.evaluate(() => window.__cuadros(30));
    const k = String(++n).padStart(2, '0') + '-' + nombre;
    const lienzos = await page.evaluate(() => [...document.querySelectorAll('canvas')].filter(c => c.offsetParent && c.width).map(c => c.toDataURL('image/png')));
    lienzos.forEach((u, j) => fs.writeFileSync(path.join(dir, `${k}-cv${j}.png`), Buffer.from(u.split(',')[1], 'base64')));
    await page.screenshot({ path: path.join(dir, `${k}-pagina.png`), fullPage: true, animations: 'disabled', caret: 'hide' });
  };
  // paso a paso
  for (let s = 0; s < 25; s++) {
    await foto(`p${s}a`);
    if (await page.$('#stepBody .opt:not([disabled])')) { await toque('#stepBody .opt:not([disabled])'); await foto(`p${s}b`); }
    const sig = await page.$('#next:not([disabled])');
    if (!sig || !(await sig.isVisible())) break;
    const antes = await page.evaluate(() => document.querySelector('#stepT').textContent + document.querySelector('#stepK').textContent);
    await toque('#next');
    const despues = await page.evaluate(() => document.querySelector('#stepT').textContent + document.querySelector('#stepK').textContent);
    if (antes === despues) break;
  }
  // ¿qué pasa si…?
  await toque('#tab2'); await page.waitForTimeout(300);
  for (let e = 0; e < 15; e++) {
    await foto(`e${e}a`);
    if (await page.$('#body2 .opt:not([disabled])')) { await toque('#body2 .opt:not([disabled])'); await foto(`e${e}b`); }
    const sig = await page.$('#sig2');
    if (!sig) break;
    await toque('#sig2');
  }
  await ctx.close();
  return { escena, perfil: id, fotos: n, errores };
}

(async () => {
  const browser = await chromium.launch();
  const res = [];
  for (const e of ESCENAS) for (const p of PERFILES) { const r = await correr(browser, e, p); res.push(r); console.log(JSON.stringify(r)); }
  await browser.close();
  fs.writeFileSync(path.join(DIR, 'datos', `capturas-${version}.json`), JSON.stringify(res, null, 1));
})();
