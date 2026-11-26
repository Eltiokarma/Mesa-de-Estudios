#!/usr/bin/env node
/*
 * Capturas de los objetos de prueba (docs/metodo/dibujos-reconocibles.md, 26 nov 2026). Recorre la teoría, junta cada
 * pareja pieza + objeto de las piezas con data-prueba, y dibuja su primer uso (la tarjeta de «Lee» si la hay; si no, el
 * primero que encuentra) dentro de una .te-fig como en la app, a 390 px, en claro y en oscuro (y a 1280 con --ancha).
 *
 *   node herramientas/dibujos-objetos.js <carpeta> [--solo pieza|objeto,pieza|objeto] [--ancha] [--json salida.json]
 *
 * Necesita el servidor local (npm run dev, o PORT=… node herramientas/servidor.js; MESA_URL apunta a él) y Playwright.
 * Cada captura: <carpeta>/<pieza>--<objeto>[-oscuro|-ancha].webp
 */
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..');
const PZ = path.join(R, 'nucleo/kit/piezas');

function piezasDePrueba() {
  return fs.readdirSync(PZ).filter(f => /\.js$/.test(f) && !/test/.test(f))
    .filter(f => /data-prueba/.test(fs.readFileSync(path.join(PZ, f), 'utf8'))).map(f => f.replace(/\.js$/, ''));
}

// Cada pareja pieza|objeto con sus usos (unidad → ideas) y su primer dibujo.
function inventario() {
  const prueba = new Set(piezasDePrueba()), out = {};
  const raiz = path.join(R, 'contenido/teoria');
  for (const curso of fs.readdirSync(raiz)) {
    const d = path.join(raiz, curso); if (!fs.statSync(d).isDirectory()) continue;
    for (const f of fs.readdirSync(d).filter(f => f.endsWith('.js') && !f.includes('test'))) {
      const u = require(path.join(d, f)); if (!u.ideas) continue;
      const uid = `${curso}.${f.replace(/\.js$/, '')}`;
      const walk = (o, pz, idea, mom, h) => {
        if (!o || typeof o !== 'object' || h > 14) return;
        if (Array.isArray(o)) { o.forEach(x => walk(x, pz, idea, mom, h + 1)); return; }
        const p = typeof o.pieza === 'string' ? o.pieza : pz;
        const dat = o.datos && typeof o.datos === 'object' && !Array.isArray(o.datos) ? o.datos : (o.dibujo && o.dibujo.datos);
        const est = o.estado || (o.dibujo && o.dibujo.estado) || {};
        if (dat && p && prueba.has(p)) {
          const ob = typeof dat.objeto === 'string' ? dat.objeto : '-', k = `${p}|${ob}`;
          const e = out[k] || (out[k] = { pieza: p, objeto: ob, usos: 0, unidades: {}, calidad: {}, primero: null });
          e.usos++; (e.unidades[uid] = e.unidades[uid] || new Set()).add(idea); e.calidad[uid] = u.calidad;
          if (!e.primero || (mom === 'lee' && e.primero.mom !== 'lee')) e.primero = { uid, idea, mom, datos: dat, estado: est, requiere: u.requiere || [] };
        }
        for (const [kk, v] of Object.entries(o)) if (kk !== 'datos') walk(v, p, idea, mom || (['lee', 'juega', 'mira', 'ejemplos', 'predice', 'resuelve', 'ahoraTu'].includes(kk) ? kk : mom), h + 1);
      };
      u.ideas.forEach(i => walk(i, i.pieza, i.id, null, 0));
      if (u.laboratorio) walk(u.laboratorio, null, '(laboratorio)', null, 0);
    }
  }
  return Object.values(out).map(e => ({ ...e, unidades: Object.fromEntries(Object.entries(e.unidades).map(([k, v]) => [k, [...v]])) }));
}
module.exports = { inventario, piezasDePrueba };
if (require.main !== module) return;

(async () => {
  const args = process.argv.slice(2), carpeta = args[0];
  const op = n => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
  const solo = op('--solo') ? new Set(op('--solo').split(',')) : null;
  let lista = inventario();
  if (op('--json')) fs.writeFileSync(op('--json'), JSON.stringify(lista, null, 1));
  if (solo) lista = lista.filter(e => solo.has(`${e.pieza}|${e.objeto}`) || solo.has(e.pieza));
  fs.mkdirSync(carpeta, { recursive: true });
  let chromium; try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
  const BASE = process.env.MESA_URL || 'http://localhost:4173';
  const nav = await chromium.launch();
  const modos = [['', 390, 'light'], ['-oscuro', 390, 'dark']]; if (args.includes('--ancha')) modos.push(['-ancha', 1280, 'light']);
  for (const [suf, ancho, tema] of modos) {
    const pag = await nav.newPage({ viewport: { width: ancho, height: 700 }, colorScheme: tema });
    await pag.goto(`${BASE}/app/index.html#nada`, { waitUntil: 'domcontentloaded' });
    await pag.setContent(`<!doctype html><html><head><base href="${BASE}/app/"><link rel="stylesheet" href="estilos.css"><link rel="stylesheet" href="/nucleo/kit/kit.css">
      <script src="/nucleo/kit/kit.js"></script><script src="/nucleo/kit/trazo.js"></script><script src="/nucleo/kit/linea-tiempo.js"></script></head>
      <body style="margin:0;padding:12px;background:var(--bg)"><div class="te-figcaja"><figure class="te-fig kit-figura" id="f" style="min-height:0"></figure></div><p id="t" style="font:12px sans-serif;color:var(--muted)"></p></body></html>`);
    const cargados = new Set();
    for (const e of lista) {
      const nombre = `${e.pieza}--${e.objeto}${suf}.png`;
      try {
        for (const u of [...e.primero.requiere.filter(x => x.endsWith('.js')), `/nucleo/kit/piezas/${e.pieza}.js`]) {
          if (cargados.has(u)) continue; cargados.add(u); await pag.addScriptTag({ url: u }).catch(() => {});
        }
        const ok = await pag.evaluate(([p, d, s, t]) => {
          const P = Kit.piezas[p]; if (!P) return 'sin pieza';
          document.getElementById('f').innerHTML = P.dibujar(d, s || {}); document.getElementById('t').textContent = t; return 'ok';
        }, [e.pieza, e.primero.datos, e.primero.estado, `${e.pieza} · ${e.objeto}`]);
        if (ok !== 'ok') { console.error(nombre, ok); continue; }
        await pag.waitForTimeout(60);
        const svg = await pag.locator('#f svg').first().boundingBox(), t = await pag.locator('#t').boundingBox();
        const y0 = Math.max(0, svg.y - 8), y1 = t.y + t.height + 4;
        await pag.screenshot({ path: path.join(carpeta, nombre), clip: { x: 0, y: y0, width: ancho, height: Math.min(y1 - y0, 1400) } });
      } catch (err) { console.error(nombre, err.message.split('\n')[0]); }
    }
    await pag.close();
  }
  await nav.close();
})();
