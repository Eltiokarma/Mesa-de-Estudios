const test = require('node:test');
const assert = require('node:assert/strict');
const G = require('./geometria3d.js');

const CUBO = { a: 2, b: 2, c: 2 };
test('corte horizontal de un cubo: un cuadrado de área 4', () => {
  const s = G.seccion(CUBO, [0, 1, 0], 0);
  assert.equal(s.lados, 4); assert.equal(s.nombre, 'cuadrado');
  assert.ok(Math.abs(s.area - 4) < 1e-9);
});
test('corte por el centro perpendicular a la diagonal: hexágono regular', () => {
  const s = G.seccion(CUBO, [1, 1, 1], 0);
  assert.equal(s.lados, 6); assert.equal(s.nombre, 'hexágono regular');
  // lado √2 → área (3√3/2)·2 = 3√3
  assert.ok(Math.abs(s.area - 3 * Math.sqrt(3)) < 1e-9);
});
test('corte cerca de una esquina: triángulo', () => {
  const n = [1, 1, 1].map(x => x / Math.sqrt(3));
  const s = G.seccion(CUBO, n, 1.5 / Math.sqrt(3) * 1.6);
  assert.equal(s.lados, 3);
});
test('corte inclinado en una sola dirección: rectángulo', () => {
  const s = G.seccion(CUBO, G.normalDe(30, 0), 0);
  assert.equal(s.nombre, 'rectángulo');
});
test('plano que no toca la caja: sin corte', () => {
  assert.equal(G.seccion(CUBO, [0, 1, 0], 5).lados, 0);
});
test('moléculas: ángulos de libro y pares libres', () => {
  assert.equal(G.anguloDibujado(G.molecula('CO2')), 180);
  assert.equal(G.anguloDibujado(G.molecula('BF3')), 120);
  assert.equal(G.anguloDibujado(G.molecula('CH4')), 109.5);
  assert.equal(G.molecula('NH3').pares.length, 1);
  assert.equal(G.molecula('H2O').pares.length, 2);
  assert.equal(G.molecula('H2O').atomos.length, 3);
});

test('un plano que solo roza una arista no deja sección', () => {
  // n = (1, 1, 0)/√2 y d = √2: el plano x + y = 2 toca solo la arista x = 1, y = 1 del cubo de lado 2.
  const s = G.seccion(CUBO, [1, 1, 0], Math.SQRT2);
  assert.equal(s.lados, 0);
  assert.equal(s.area, 0);
});
