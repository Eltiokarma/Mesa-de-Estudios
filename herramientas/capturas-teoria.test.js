// Pruebas de herramientas/capturas-teoria.js sin navegador: detecta el aviso «No se pudo cargar el catálogo» (Etapa 6:
// salieron 35 capturas iguales del aviso) y comprueba el catálogo antes de empezar, con reintentos.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const C = require('./capturas-teoria.js');

test('detecta el aviso del catálogo, el mismo texto que pinta app/app.js', () => {
  const app = fs.readFileSync(path.join(__dirname, '..', 'app', 'app.js'), 'utf8');
  const aviso = app.match(/<p class="vacio">(No se pudo cargar el catálogo[^<]*)<\/p>/);
  assert.ok(aviso, 'app/app.js todavía pinta el aviso del catálogo');
  assert.equal(C.muestraAvisoCatalogo(`Inicio\n${aviso[1]}\nPerfil`), true);
  assert.equal(C.muestraAvisoCatalogo('Juega\nMueve el control y mira qué pasa.'), false);
  assert.equal(C.muestraAvisoCatalogo(''), false);
  assert.equal(C.muestraAvisoCatalogo(undefined), false);
});

const respuesta = (status, texto) => ({ status, text: async () => texto });

test('catálogo: 200 con JSON válido pasa al primer intento', async () => {
  const urls = [];
  const ok = await C.comprobarCatalogo('http://x:1', { espera: 0, pedir: async u => { urls.push(u); return respuesta(200, '{"cursos":[]}'); } });
  assert.equal(ok, true);
  assert.deepEqual(urls, ['http://x:1/app/datos/catalogo.json']);
});

test('catálogo: reintenta mientras el servidor arranca', async () => {
  let k = 0;
  const pedir = async () => { k++; if (k === 1) throw new Error('fetch failed'); if (k === 2) return respuesta(404, 'no'); return respuesta(200, '{}'); };
  assert.equal(await C.comprobarCatalogo('http://x:1', { intentos: 4, espera: 0, pedir }), true);
  assert.equal(k, 3);
});

test('catálogo: sin 200 o sin JSON válido falla con un mensaje claro', async () => {
  await assert.rejects(C.comprobarCatalogo('http://x:1', { intentos: 3, espera: 0, pedir: async () => respuesta(500, '') }),
    e => /catalogo\.json respondió 500 tras 3 intentos/.test(e.message) && /No se pudo cargar el catálogo/.test(e.message));
  await assert.rejects(C.comprobarCatalogo('http://x:1', { intentos: 2, espera: 0, pedir: async () => respuesta(200, '<html>') }),
    /no es JSON válido/);
  let k = 0;
  await assert.rejects(C.comprobarCatalogo('http://x:1', { intentos: 2, espera: 0, pedir: async () => { k++; throw new Error('fetch failed'); } }),
    /no respondió/);
  assert.equal(k, 2);
});
