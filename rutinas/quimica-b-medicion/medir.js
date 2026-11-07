// Reproduce el método de docs/medicion/la2-gama-baja-2026-11-07.md para unas escenas.
// Uso: node medir.js <antes|despues> [repeticiones] [escena ...]
// Celular: 360×740, dpr 2, táctil, CPU ×6 (CDP). FPS en reposo (2 s), paso a paso (5 s) y explorador (5 s),
// contando solo los cuadros en que la escena dibujó (los que faltan para 60 se cargan a esos cuadros).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = __dirname, BASE = 'http://localhost:4173';
const [version = 'despues', repsS = '3', ...esc] = process.argv.slice(2);
const ESCENAS = esc.length ? esc : ['acidos-bases', 'liquidos-y-solidos'];
const REPS = +repsS;

// Se inyecta antes que todo: envuelve rAF (JS por cuadro), marca cuándo la escena dibuja y cuenta cuadros.
const INIT = () => {
  const raf0 = window.requestAnimationFrame.bind(window);
  const R = window.__R = { frames: [], dibujo: false, js: 0, ncb: 0 };
  window.requestAnimationFrame = cb => raf0(t => { const a = performance.now(); try { cb(t); } finally { R.js += performance.now() - a; R.ncb++; } });
  const P = CanvasRenderingContext2D.prototype;
  for (const m of ['clearRect', 'drawImage', 'putImageData']) { const f = P[m]; P[m] = function () { R.dibujo = true; return f.apply(this, arguments); }; }
  const cuenta = t => { R.frames.push([performance.now(), R.dibujo ? 1 : 0, R.js, R.ncb]); R.dibujo = false; R.js = 0; R.ncb = 0; raf0(cuenta); };
  // el contador corre en cada cuadro (como el informe: una escena quieta da 60 FPS)
  raf0(cuenta);
  // toque: de pointerdown al cuadro siguiente al click (rAF y luego una tarea)
  window.__toques = [];
  let t0 = 0;
  addEventListener('pointerdown', e => { t0 = performance.now(); }, true);
  addEventListener('click', () => { const a = t0; raf0(() => setTimeout(() => { if (a) window.__toques.push(performance.now() - a); }, 0)); }, true);
  window.__errores = [];
  addEventListener('error', e => window.__errores.push(String(e.message)));
};

function ventana(frames, t0, t1) {
  const fs_ = frames.filter(f => f[0] > t0 && f[0] <= t1);
  const T = (t1 - t0) / 1000, N = fs_.length, A = fs_.filter(f => f[1]).length;
  const falta = Math.max(0, 60 * T - N);
  const fps = A ? 60 * A / (A + falta) : 60 * Math.min(1, N / (60 * T));
  const conCb = fs_.filter(f => f[3] > 0);
  const js = conCb.length ? conCb.reduce((s, f) => s + f[2], 0) / conCb.length : 0;
  let peor = 0, tAct = 0;
  for (let i = 1; i < fs_.length; i++) { const d = fs_[i][0] - fs_[i - 1][0]; peor = Math.max(peor, d); if (fs_[i][1]) tAct += d; }
  // otra forma de contarlo: cuadros activos ÷ tiempo que duraron (intervalo hasta cada cuadro activo)
  const fpsInt = A > 1 && tAct ? Math.min(60, 1000 * (A - (fs_[0] && fs_[0][1] ? 1 : 0)) / tAct) : 60;
  return { fps: +fps.toFixed(1), fpsInt: +fpsInt.toFixed(1), cuadros: N, activos: A, js: +js.toFixed(2), peorCuadro: Math.round(peor) };
}

async function medirUna(browser, escena) {
  const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, serviceWorkers: 'block' });
  if (version !== 'despues' && fs.existsSync(path.join(DIR, version, escena + '.html'))) await ctx.route(`**/plantillas/${escena}/index.html*`, r => r.fulfill({ contentType: 'text/html; charset=utf-8', body: fs.readFileSync(path.join(DIR, version, escena + '.html')) }));   // antes/ o un experimento
  await ctx.addInitScript(INIT);
  const page = await ctx.newPage();
  const consola = [];
  page.on('console', m => { if (m.type() === 'error') consola.push(m.text()); });
  page.on('pageerror', e => consola.push(String(e)));
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 });
  await page.goto(`${BASE}/plantillas/${escena}/index.html?desde=app`);
  await page.waitForFunction(() => document.querySelector('#stepBody') && document.querySelector('#stepBody').innerHTML.trim().length > 0);
  await page.waitForTimeout(1500);
  const now = () => page.evaluate(() => performance.now());
  const out = { escena };
  // reposo
  let a = await now(); await page.waitForTimeout(2000); let b = await now();
  const fr = async () => page.evaluate(() => window.__R.frames);
  out.reposo = ventana(await fr(), a, b);
  // paso a paso: «Siguiente» hasta la primera predicción
  for (let i = 0; i < 15; i++) {
    const hay = await page.$('#stepBody .opt:not([disabled])');
    if (hay) break;
    await page.tap('#next'); await page.waitForTimeout(400);
  }
  await page.evaluate(() => { window.__toques = []; });
  await page.tap('#stepBody .opt:not([disabled])');
  a = await now(); await page.waitForTimeout(5000); b = await now();
  out.paso = ventana(await fr(), a, b);
  out.toquePaso = Math.round((await page.evaluate(() => window.__toques))[0] || NaN);
  // explorador
  await page.tap('#tab2'); await page.waitForTimeout(800);
  await page.evaluate(() => { window.__toques = []; });
  await page.tap('#body2 .opt:not([disabled])');
  a = await now(); await page.waitForTimeout(5000); b = await now();
  out.explorador = ventana(await fr(), a, b);
  out.toqueExp = Math.round((await page.evaluate(() => window.__toques))[0] || NaN);
  // reposo largo al final: el explorador quieto (¿se duerme?). Se mira el lienzo visible 2 s más tarde.
  await page.waitForTimeout(3000);
  a = await now(); await page.waitForTimeout(2000); b = await now();
  out.reposoFinal = ventana(await fr(), a, b);
  out.errores = consola.concat(await page.evaluate(() => window.__errores));
  out.peor = Math.min(out.reposo.fps, out.paso.fps, out.explorador.fps);
  out.jsMax = Math.max(out.reposo.js, out.paso.js, out.explorador.js);
  out.toque = Math.max(out.toquePaso || 0, out.toqueExp || 0);
  await ctx.close();
  return out;
}

const med = xs => { const s = [...xs].sort((p, q) => p - q); return s[Math.floor(s.length / 2)]; };
(async () => {
  const browser = await chromium.launch();
  const todo = {};
  for (const e of ESCENAS) {
    todo[e] = [];
    for (let r = 0; r < REPS; r++) { const o = await medirUna(browser, e); todo[e].push(o); console.error(e, r, JSON.stringify(o)); }
  }
  await browser.close();
  const res = {};
  for (const e of ESCENAS) {
    const xs = todo[e], m = f => med(xs.map(f));
    res[e] = {
      reposoInt: m(x => x.reposo.fpsInt), pasoInt: m(x => x.paso.fpsInt), exploradorInt: m(x => x.explorador.fpsInt),
      reposo: m(x => x.reposo.fps), paso: m(x => x.paso.fps), explorador: m(x => x.explorador.fps), peor: m(x => x.peor),
      jsPaso: m(x => x.paso.js), jsExp: m(x => x.explorador.js), jsMax: m(x => x.jsMax), toque: m(x => x.toque),
      peorCuadro: m(x => Math.max(x.paso.peorCuadro, x.explorador.peorCuadro)),
      activosReposo2s: m(x => x.reposo.activos), activosReposoFinal2s: m(x => x.reposoFinal.activos),
      errores: [...new Set(xs.flatMap(x => x.errores))],
    };
  }
  const f = path.join(DIR, 'datos', `medir-${version}-${Date.now()}.json`);
  fs.writeFileSync(f, JSON.stringify({ version, reps: REPS, crudo: todo, mediana: res }, null, 1));
  console.log(JSON.stringify(res, null, 1));
  console.log('crudo:', f);
})();
