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
