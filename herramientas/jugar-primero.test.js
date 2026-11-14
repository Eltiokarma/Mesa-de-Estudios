// Regla 3 (decisión 20 de Gerson, 14 nov 2026): en toda escena, el alumno juega antes de cualquier pregunta.
// Una escena cumple si carga nucleo/jugar.js y monta JugarPrimero. Las que todavía no, están en
// herramientas/jugar-primero-pendientes.json; la lista solo puede achicarse.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const J = require('../nucleo/jugar.js');

const RAIZ = path.join(__dirname, '..');
const pendientes = new Set(JSON.parse(fs.readFileSync(path.join(__dirname, 'jugar-primero-pendientes.json'), 'utf8')).pendientes);
const escenas = fs.readdirSync(path.join(RAIZ, 'plantillas')).filter(id => {
  const f = path.join(RAIZ, 'plantillas', id, 'plantilla.json');
  return fs.existsSync(f) && JSON.parse(fs.readFileSync(f, 'utf8')).formato === 'escena';
});
const cumple = id => {
  const p = JSON.parse(fs.readFileSync(path.join(RAIZ, 'plantillas', id, 'plantilla.json'), 'utf8'));
  const html = fs.readFileSync(path.join(RAIZ, 'plantillas', id, p.escena || 'index.html'), 'utf8');
  return /nucleo\/jugar\.js/.test(html) && /JugarPrimero\.montar\(/.test(html);
};

test('toda escena que no está en la lista de pendientes deja jugar antes de preguntar', () => {
  for (const id of escenas) if (!pendientes.has(id)) assert.ok(cumple(id), `${id}: carga nucleo/jugar.js y monta JugarPrimero antes de la primera pregunta (o vuelve a la lista)`);
});

test('la lista de pendientes solo tiene escenas que existen y que todavía no cumplen', () => {
  for (const id of pendientes) {
    assert.ok(escenas.includes(id), `${id} no es una escena`);
    assert.ok(!cumple(id), `${id} ya cumple: sácala de herramientas/jugar-primero-pendientes.json`);
  }
});

test('qué cuenta como jugar', () => {
  for (const t of ['pointerdown', 'input', 'change']) assert.ok(J.cuenta({ type: t }));
  assert.ok(J.cuenta({ type: 'keydown', key: 'ArrowRight' }));
  assert.ok(!J.cuenta({ type: 'keydown', key: 'ArrowRight', repeat: true }));
  assert.ok(!J.cuenta({ type: 'keydown', key: 'Tab' }));
  assert.ok(!J.cuenta({ type: 'mousemove' }));
  assert.ok(!J.cuenta(null));
});
