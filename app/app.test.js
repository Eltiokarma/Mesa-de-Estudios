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
  for (const p of Object.values(cat.plantillas)) for (const u of [p.url, ...p.archivos]) {
    assert.ok(fs.existsSync(deUrl(u)), `la plantilla ${p.id} apunta a ${u}, que no existe`);
  }
});

test('el manifiesto es instalable', () => {
  const m = JSON.parse(fs.readFileSync(path.join(__dirname, 'manifest.webmanifest'), 'utf8'));
  for (const k of ['name', 'short_name', 'start_url', 'display', 'icons']) assert.ok(m[k], `falta ${k}`);
  assert.ok(m.icons.some(i => i.sizes === '192x192') && m.icons.some(i => i.sizes === '512x512'), 'faltan íconos 192 y 512');
  for (const i of m.icons) assert.ok(fs.existsSync(deUrl(i.src)), `no existe el ícono ${i.src}`);
});
