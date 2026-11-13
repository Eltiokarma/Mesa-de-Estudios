// Pruebas de la app (PWA): que el catálogo publicado esté al día y que todo lo que el
// service worker guarda para usar sin internet exista de verdad.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { texto, SALIDA } = require('../herramientas/construir-catalogo');

const raiz = path.join(__dirname, '..');
const deUrl = u => path.join(raiz, u.replace(/^\//, '').replace(/\/$/, '/index.html'));

test('app/datos/catalogo.json está al día con catalogo/ (si falla: npm run catalogo)', () => {
  assert.equal(fs.readFileSync(SALIDA, 'utf8'), texto());
});

test('el service worker guarda archivos que existen', () => {
  const sw = fs.readFileSync(path.join(__dirname, 'sw.js'), 'utf8');
  const lista = JSON.parse(sw.match(/const CASCARA = (\[[\s\S]*?\]);/)[1].replace(/'/g, '"'));
  for (const u of lista) assert.ok(fs.existsSync(deUrl(u)), `sw.js guarda ${u}, que no existe`);
  const cat = JSON.parse(fs.readFileSync(SALIDA, 'utf8'));
  for (const p of Object.values(cat.plantillas)) for (const u of [...(p.formato === 'escena' ? [p.url] : []), ...p.archivos]) {
    assert.ok(fs.existsSync(deUrl(u)), `la plantilla ${p.id} apunta a ${u}, que no existe`);
  }
});

test('el service worker sirve sin conexión todo lo que guarda', () => {
  // Si una ruta no pasa el filtro del fetch, el archivo se guarda al instalar pero no se sirve sin red
  // (pasó con el banco de lectura, que vive en /contenido/).
  const sw = fs.readFileSync(path.join(__dirname, 'sw.js'), 'utf8');
  const filtro = new RegExp(sw.match(/if \(!\/(.+)\/\.test\(url\.pathname\)\) return;/)[1]);
  const lista = JSON.parse(sw.match(/const CASCARA = (\[[\s\S]*?\]);/)[1].replace(/'/g, '"'));
  const cat = JSON.parse(fs.readFileSync(SALIDA, 'utf8'));
  for (const u of [...lista, ...Object.values(cat.plantillas).flatMap(p => p.archivos)]) assert.ok(filtro.test(u), `sw.js no sirve ${u} sin conexión`);
  // La app carga los scripts de cada formato; deben estar en la cáscara.
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  for (const [, src] of html.matchAll(/<script src="([^"]+)"/g)) {
    const u = src.startsWith('/') ? src : '/app/' + src;
    assert.ok(lista.includes(u), `sw.js no guarda ${u}, que carga index.html`);
  }
  // Y los que app.js carga al entrar a cada ruta (MODULOS).
  const app = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
  const modulos = app.match(/const MODULOS = \{([\s\S]*?)\n\};/);
  assert.ok(modulos, 'app.js ya no tiene MODULOS');
  for (const [, u] of modulos[1].matchAll(/'(\/[^']+\.js)'/g)) assert.ok(lista.includes(u), `sw.js no guarda ${u}, que carga app.js`);
});

// Simula la instalación del service worker con una caché anterior: la cáscara se baja de nuevo, los archivos
// de plantilla que ya estaban se copian (sin red) y solo se bajan los nuevos. Después, stale-while-revalidate
// guarda la versión nueva de una plantilla bajo su dirección sin «?…», que es la que se sirve.
test('al subir VERSION, el service worker reutiliza la caché anterior', async () => {
  const vm = require('node:vm');
  const ORIGEN = 'http://x';
  const abs = u => new URL(typeof u === 'string' ? u : u.url, ORIGEN).href;
  const sinQ = u => { const x = new URL(u); return x.origin + x.pathname; };
  class Resp { constructor(url, cuerpo) { this.url = url; this.cuerpo = cuerpo; this.ok = true; } clone() { return new Resp(this.url, this.cuerpo); } async json() { return JSON.parse(this.cuerpo); } }
  class Cache {
    constructor() { this.e = []; }
    async matchAll(q, o = {}) { const u = abs(q); return this.e.filter(([k]) => (o.ignoreSearch ? sinQ(k) === sinQ(u) : k === u)).map(([, r]) => r.clone()); }
    async match(q, o) { return (await this.matchAll(q, o))[0]; }
    async put(q, r) { const u = abs(q); this.e = this.e.filter(([k]) => k !== u); this.e.push([u, r]); }
    async add(q) { await this.put(q, await fetch(q)); }
    async addAll(l) { for (const q of l) await this.add(q); }
  }
  const almacen = new Map();
  const caches = { open: async k => { if (!almacen.has(k)) almacen.set(k, new Cache()); return almacen.get(k); }, keys: async () => [...almacen.keys()], delete: async k => almacen.delete(k) };
  const cat = { plantillas: { a: { archivos: ['/plantillas/a/index.html', '/plantillas/a/motor.js'] }, b: { archivos: ['/plantillas/b/index.html'] } } };
  const pedidos = [];
  const fetch = async (q, o) => { const u = abs(q); pedidos.push({ u, cache: (o && o.cache) || (q && q.cache) }); return new Resp(u, u.endsWith('catalogo.json') ? JSON.stringify(cat) : 'nuevo'); };
  // Caché anterior: la plantilla a (con una copia vieja sin «?» y otra más reciente con ?desde=app) y una cáscara vieja.
  const vieja = await caches.open('lab-v0');
  await vieja.put('/plantillas/a/index.html', new Resp('', 'a-vieja'));
  await vieja.put('/plantillas/a/index.html?desde=app', new Resp('', 'a-reciente'));
  await vieja.put('/plantillas/a/motor.js', new Resp('', 'motor-a'));
  await vieja.put('/app/app.js', new Resp('', 'app-vieja'));
  const oyentes = {};
  const self = { addEventListener: (t, f) => { oyentes[t] = f; }, skipWaiting: async () => {}, clients: { claim: async () => {} } };
  class Request { constructor(u, o = {}) { this.url = abs(u); this.cache = o.cache; } }
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'sw.js'), 'utf8'), { self, caches, fetch, Request, URL, location: { origin: ORIGEN }, console });
  const esperar = async (tipo, ev) => { let p; oyentes[tipo]({ ...ev, waitUntil: x => { p = x; }, respondWith: x => { p = x; } }); return p; };
  await esperar('install', {});
  const VERSION = fs.readFileSync(path.join(__dirname, 'sw.js'), 'utf8').match(/const VERSION = '([^']+)'/)[1];
  const nueva = almacen.get(`lab-${VERSION}`);
  const cuerpo = async u => (await nueva.match(u, { ignoreSearch: true })).cuerpo;
  assert.equal(await cuerpo('/plantillas/a/index.html'), 'a-reciente', 'debe copiar la copia más reciente de la caché anterior');
  assert.equal(await cuerpo('/plantillas/a/motor.js'), 'motor-a');
  assert.equal(await cuerpo('/plantillas/b/index.html'), 'nuevo', 'lo que no estaba se baja');
  assert.equal(await cuerpo('/app/app.js'), 'nuevo', 'la cáscara se baja siempre de nuevo');
  const bajados = pedidos.map(p => new URL(p.u).pathname);
  assert.ok(!bajados.includes('/plantillas/a/index.html') && !bajados.includes('/plantillas/a/motor.js'), 'no debe bajar lo que ya tenía');
  assert.ok(pedidos.filter(p => new URL(p.u).pathname === '/app/app.js').every(p => p.cache === 'no-cache'), 'la cáscara se revalida (no-cache)');
  await esperar('activate', {});
  assert.deepEqual([...almacen.keys()], [`lab-${VERSION}`], 'al activar se borran las cachés anteriores');
  // stale-while-revalidate: responde lo guardado y guarda lo nuevo bajo la dirección sin «?».
  let extra;
  const r = await new Promise(ok => oyentes.fetch({ request: { url: ORIGEN + '/plantillas/a/index.html?desde=app', method: 'GET', mode: 'navigate' },
    respondWith: p => ok(p), waitUntil: p => { extra = p; } }));
  assert.equal(r.cuerpo, 'a-reciente');
  await extra;
  assert.equal(await cuerpo('/plantillas/a/index.html?desde=app'), 'nuevo', 'la próxima visita debe ver la plantilla renovada');
  assert.equal((await nueva.matchAll('/plantillas/a/index.html', { ignoreSearch: true })).length, 1, 'una sola copia por archivo');
});

test('el manifiesto es instalable', () => {
  const m = JSON.parse(fs.readFileSync(path.join(__dirname, 'manifest.webmanifest'), 'utf8'));
  for (const k of ['name', 'short_name', 'start_url', 'display', 'icons']) assert.ok(m[k], `falta ${k}`);
  assert.ok(m.icons.some(i => i.sizes === '192x192') && m.icons.some(i => i.sizes === '512x512'), 'faltan íconos 192 y 512');
  for (const i of m.icons) assert.ok(fs.existsSync(deUrl(i.src)), `no existe el ícono ${i.src}`);
});

test('el service worker descarga el catálogo con una sola dirección', () => {
  // Protege contra una edición que rompió el fetch del catálogo y dejó las escenas sin guardar.
  const sw = fs.readFileSync(path.join(__dirname, 'sw.js'), 'utf8');
  assert.match(sw, /fetch\('\/app\/datos\/catalogo\.json', \{ cache: 'no-store' \}\)/);
});

// Dibujos de unidad (app/dibujos/): cada curso de Dibujos.CURSOS tiene su archivo guardado sin conexión y un dibujo
// por cada unidad; los dibujos son SVG cerrados, sin colores de variables (son de las escenas) ni hex sueltos.
test('los dibujos de unidad están completos, guardados sin conexión y con los colores de la cáscara', () => {
  const vm = require('node:vm');
  const ctx = { self: {} }; vm.createContext(ctx);
  const leer = f => vm.runInContext(fs.readFileSync(path.join(__dirname, 'dibujos', f), 'utf8'), ctx);
  leer('comun.js');
  const D = ctx.self.Dibujos;
  const sw = fs.readFileSync(path.join(__dirname, 'sw.js'), 'utf8');
  const lista = JSON.parse(sw.match(/const CASCARA = (\[[\s\S]*?\]);/)[1].replace(/'/g, '"'));
  assert.ok(lista.includes('/app/dibujos/comun.js'), 'sw.js no guarda app/dibujos/comun.js');
  const cat = JSON.parse(fs.readFileSync(SALIDA, 'utf8'));
  for (const c of D.CURSOS) {
    assert.ok(lista.includes(`/app/dibujos/${c}.js`), `sw.js no guarda app/dibujos/${c}.js`);
    leer(`${c}.js`);
    const curso = cat.cursos.find(x => x.id === c);
    assert.ok(curso, `Dibujos.CURSOS nombra ${c}, que no está en el catálogo`);
    for (const u of curso.unidades) {
      const svg = D.svg(c, u.id);
      assert.ok(svg, `falta el dibujo de ${u.id}`);
      assert.match(svg, /^<svg class="dib" viewBox="0 0 160 120"[^>]*>[\s\S]*<\/svg>$/);
      assert.doesNotMatch(svg, /--c-[oihdf]|#[0-9a-f]{3,6}\b|NaN|undefined/i, `${u.id}: color de variable, hex suelto o número roto`);
    }
    for (const id of Object.keys(D.porCurso[c])) assert.ok(curso.unidades.some(u => u.id === id), `dibujo de ${id}, que no es una unidad de ${c}`);
  }
});
