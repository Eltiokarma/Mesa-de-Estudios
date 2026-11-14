// Pruebas del grupo C de la teoría de Álgebra (ronda 2): lo que se agregó a alg-baldosas para el gesto directo.
// - `escala` es opcional: sin ella el dibujo es el mismo de antes (nada cambia en las unidades que no la usan).
// - geometria(datos, estado) exporta x0, y0 y los tramos xs, ys: la esquina de cada pieza cae donde la pieza la dibuja.
const test = require('node:test');
const assert = require('node:assert/strict');
const Bd = require('./alg-baldosas.js');

const lado = (a, b) => ({
  anchos: [{ t: 'a', v: a, color: 'o' }, { t: 'b', v: b, color: 'i' }], altos: [{ t: 'a', v: a, color: 'o' }, { t: 'b', v: b, color: 'i' }],
  celdas: [[{ t: 'a²', color: 'o' }, null], [null, { t: 'b²', color: 'i' }]],
});

test('alg-baldosas: sin escala, el SVG y la escala son los de siempre', () => {
  const d = lado(3, 2), g = Bd.geometria(d);
  assert.equal(g.esc, 190 / 5);
  assert.equal(g.A, 5);
  assert.equal(Bd.dibujar(d), Bd.dibujar(Object.assign({}, d, { escala: undefined })));
});

test('alg-baldosas: con escala fija, el rectángulo crece con a y b (y no pasa de lo que cabe)', () => {
  const chico = Bd.geometria(Object.assign(lado(2, 1), { escala: 19 }));
  const grande = Bd.geometria(Object.assign(lado(6, 4), { escala: 19 }));
  assert.equal(chico.esc, 19);
  assert.equal(grande.esc, 19);
  assert.ok(chico.xs[1][1] < grande.xs[1][1]);
  const enorme = Bd.geometria(Object.assign(lado(20, 20), { escala: 19 }));
  assert.ok(enorme.esc < 19 && enorme.xs[1][1] <= 56 + 200);
});

test('alg-baldosas: xs e ys marcan las esquinas que dibuja la pieza', () => {
  const d = Object.assign(lado(4, 2), { escala: 19 });
  const g = Bd.geometria(d), svg = Bd.dibujar(d);
  assert.equal(g.x0, 56);
  assert.equal(g.y0, 40);
  assert.deepEqual(g.xs[0], [56, 56 + 4 * 19]);
  assert.deepEqual(g.ys[1], [40 + 4 * 19, 40 + 6 * 19]);
  // La casilla a² empieza en (x0, y0) y mide a · esc de lado.
  assert.match(svg, /x="56" y="40" width="76" height="76"/);
  // Separadas, los tramos se corren el hueco y la escala no cambia.
  const s = Bd.geometria(d, { separar: true });
  assert.equal(s.esc, g.esc);
  assert.equal(s.xs[1][0], g.xs[1][0] + 10);
});

test('alg-baldosas: con escala fija, el total va bajo el rectángulo; sin ella, donde siempre', () => {
  const conTotal = (a, b, escala) => Object.assign(lado(a, b), { total: { t: 'T' }, escala });
  assert.match(Bd.dibujar(conTotal(3, 2)), /y="266"[^>]*>T</);
  assert.match(Bd.dibujar(conTotal(3, 2, 20)), new RegExp(`y="${40 + 5 * 20 + 26}"[^>]*>T<`));
});
