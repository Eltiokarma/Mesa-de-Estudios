// Pruebas de la pieza «alg-columnas-3d»: el determinante que muestra (det3 de plantillas/matrices/motor.js) es el
// volumen con signo de la caja, comprobado aparte con el triple producto u · (v × w); el respaldo plano y el alt lo
// muestran; girar no cambia la figura.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./alg-columnas-3d.js');

const triple = (u, v, w) => u[0] * (v[1] * w[2] - v[2] * w[1]) - u[1] * (v[0] * w[2] - v[2] * w[0]) + u[2] * (v[0] * w[1] - v[1] * w[0]);
const C = { u: [2, 0, 0], v: [1, 2, 0], w: [0, 1, 1] };

test('se registra en el kit con su parte viva', () => {
  assert.equal(Kit.piezas['alg-columnas-3d'], P);
  assert.equal(typeof P.montar, 'function');
});

test('det A es el triple producto de las columnas (cálculo aparte), también con signo', () => {
  const casos = [C, { u: [1, 2, 3], v: [0, 1, 4], w: [5, 6, 0] }, { u: [2, 0, 0], v: [-1, 3, 0], w: [2, 1, -2] }, { u: [1, 1, 0], v: [2, 2, 0], w: [0, 0, 3] }];
  for (const d of casos) assert.equal(P.det(d), triple(d.u, d.v, d.w));
  assert.equal(P.det(C), 4);
});

test('inclinar v o w sin cambiar su altura no cambia el volumen', () => {
  for (const [vx, wx] of [[-2, 2], [0, -1], [2, 0]]) assert.equal(P.det({ u: [2, 0, 0], v: [vx, 2, 0], w: [wx, 1, 1] }), 4);
});

test('el alt dice el volumen y el det; si las columnas caen en un plano, la caja se aplasta', () => {
  assert.match(P.alt(C), /volumen 4; det A = 4/);
  assert.match(P.alt({ u: [2, 0, 0], v: [1, 2, 0], w: [0, 1, 0] }), /aplastada.*det A = 0/);
  assert.match(P.alt({ u: [2, 0, 0], v: [1, 2, 0], w: [0, 1, -1] }), /volumen 4; det A = −4/);
});

test('el respaldo es un SVG con seis caras, doce aristas y tres flechas de colores', () => {
  const s = P.dibujar(C), pl = P.plano(C);
  assert.match(s, /^<svg/);
  assert.equal(pl.caras.length, 6);
  assert.equal(pl.aristas.length, 12);
  assert.equal(pl.flechas.length, 3);
  for (const c of ['c-o', 'c-i', 'c-d']) assert.match(s, new RegExp(`var\\(--${c}\\)`));
});

test('la esquina opuesta al origen es u + v + w', () => {
  assert.deepEqual(P.esquinas(C)[7], [3, 3, 1]);
});

test('girar conserva el largo (la vista no cambia la figura)', () => {
  const v = [0.7, -0.2, 1.1], g = P.girar(v, 40, -25);
  assert.ok(Math.abs(Math.hypot(...g) - Math.hypot(...v)) < 1e-12);
  assert.equal(P.det(Object.assign({}, C, { vista: { giro: 100, inclinacion: 60 } })), 4);
});
