// Pruebas de la pieza «trig-cono-3d»: el respaldo plano y el alt muestran el corte que calcula plantillas/conicas/motor.js
// (corte3d); girar no cambia la figura.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./trig-cono-3d.js');
const M = require('../../../plantillas/conicas/motor.js');

const ELIPSE = { inclinacion: 30, generatriz: 60, altura: 1 };

test('se registra en el kit con su parte viva', () => {
  assert.equal(Kit.piezas['trig-cono-3d'], P);
  assert.equal(typeof P.montar, 'function');
});

test('el alt nombra la curva que da el motor', () => {
  assert.match(P.alt(ELIPSE), /el corte es una elipse/);
  assert.match(P.alt({ inclinacion: 60, generatriz: 60, altura: 1 }), /una parábola/);
  assert.match(P.alt({ inclinacion: 70, generatriz: 45, altura: 0 }), /pasa por el vértice: el corte es dos rectas/);
});

test('el respaldo dibuja un trazo rojo por tramo: uno en la elipse, dos en la hipérbola', () => {
  for (const [d, n] of [[ELIPSE, 1], [{ inclinacion: 75, generatriz: 45, altura: 1 }, 2], [{ inclinacion: 70, generatriz: 45, altura: 0 }, 2]]) {
    const s = P.dibujar(d, {});
    assert.match(s, /^<svg/);
    assert.doesNotMatch(s, /NaN|undefined|Infinity/);
    assert.equal((s.match(/<polyline/g) || []).length, n);
    assert.equal(n, M.corte3d(Object.assign({ alto: 2 }, d)).tramos.length);
  }
  const punto = P.dibujar({ inclinacion: 20, generatriz: 45, altura: 0 }, {});
  assert.equal((punto.match(/<circle/g) || []).length, 1, 'el punto del vértice');
  assert.doesNotMatch(P.dibujar(ELIPSE, { plano: false }), /fill-opacity="0.12"/);
});

test('girar conserva el largo (la vista no cambia la figura)', () => {
  const v = [0.3, -1.1, 0.8], g = P.girar(v, 50, 35);
  assert.ok(Math.abs(Math.hypot(...g) - Math.hypot(...v)) < 1e-12);
  const otra = Object.assign({ vista: { giro: 90, inclinacion: 40 } }, ELIPSE);
  assert.notEqual(P.dibujar(otra), P.dibujar(ELIPSE));
  assert.equal(P.alt(otra), P.alt(ELIPSE));
});
