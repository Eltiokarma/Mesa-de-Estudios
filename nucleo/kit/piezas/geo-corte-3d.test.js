// Pruebas de la pieza «geo-corte-3d»: el respaldo plano (lo que se ve sin WebGL 2, en las miniaturas y en Node) dibuja la
// caja y la sección que calcula nucleo/geometria3d.js; el alt nombra la sección con su área.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./geo-corte-3d.js');
const G = require('../../geometria3d.js');

const CUBO = { caja: { a: 2, b: 2, c: 2 }, normal: [0, 1, 0], d: 0 };

test('se registra en el kit con su parte viva', () => {
  assert.equal(Kit.piezas['geo-corte-3d'], P);
  assert.equal(typeof P.montar, 'function');
});

test('corte horizontal del cubo: un cuadrado de área 4, también en el alt', () => {
  assert.equal(P.corte(CUBO).nombre, 'cuadrado');
  assert.match(P.alt(CUBO), /cuadrado de área 4/);
  const s = P.dibujar(CUBO);
  assert.match(s, /^<svg/);
  assert.equal((s.match(/<line /g) || []).length, 12);          // las 12 aristas
  assert.equal((s.match(/<polygon /g) || []).length, 1);         // la sección
});

test('la sección del respaldo tiene tantos vértices como lados', () => {
  const hex = { caja: { a: 2, b: 2, c: 2 }, normal: [1, 1, 1], d: 0 };
  assert.equal(P.plano(hex).seccion.length, 6);
  assert.equal(P.corte(hex).nombre, 'hexágono regular');
});

test('si el plano no toca la caja, no hay polígono y el alt lo dice', () => {
  const lejos = Object.assign({}, CUBO, { d: 5 });
  assert.equal(P.plano(lejos).seccion.length, 0);
  assert.doesNotMatch(P.dibujar(lejos), /<polygon/);
  assert.match(P.alt(lejos), /no lo corta/);
});

test('girar conserva el largo (la vista no cambia la figura)', () => {
  const v = [0.7, -0.2, 1.1], g = P.girar(v, 40, -25);
  assert.ok(Math.abs(Math.hypot(...g) - Math.hypot(...v)) < 1e-12);
  assert.ok(Math.abs(G.seccion(CUBO.caja, CUBO.normal, 0).area - 4) < 1e-9);
});
