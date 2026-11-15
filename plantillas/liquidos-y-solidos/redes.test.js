// Pruebas de las redes cúbicas (motor.js, sección «Redes cristalinas»), para la mesa 3D «La celda que se repite».
const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('./motor.js');

test('cada sitio de la celda vale 1/2 por cada cara del cubo en la que está, y apunta hacia adentro', () => {
  for (const k of M.REDES_ORDEN) {
    for (const s of M.celda(k).sitios) {
      const borde = s.p.filter(x => x === 0 || x === 1).length;
      assert.equal(s.fraccion, Math.pow(0.5, borde));
      s.dentro.forEach((d, i) => assert.equal(d, s.p[i] === 0 ? 1 : s.p[i] === 1 ? -1 : 0));
    }
  }
});

test('las esferas de radio r solo se tocan con sus vecinos: ninguna se encima con otra', () => {
  for (const k of M.REDES_ORDEN) {
    const c = M.celda(k), b = M.bloqueRed(k, 2);
    for (let i = 0; i < b.puntos.length; i++) for (let j = i + 1; j < b.puntos.length; j++) {
      const d = Math.hypot(...b.puntos[i].map((x, q) => x - b.puntos[j][q]));
      assert.ok(d >= 2 * c.radio - 1e-9, `${k}: ${b.puntos[i]} y ${b.puntos[j]}`);
    }
  }
});

test('el bloque de 2 × 2 × 2: el centro es un vértice y tiene tantos vecinos como la coordinación', () => {
  for (const k of M.REDES_ORDEN) {
    const b = M.bloqueRed(k, 2), c = M.celda(k);
    assert.deepEqual(b.puntos[b.centro], [1, 1, 1]);
    assert.equal(b.vecinos.length, c.coordinacion);
    assert.ok(b.vecinos.every(i => i >= 0));
    assert.equal(new Set(b.puntos.map(p => p.join())).size, b.puntos.length, 'sin repetidos');
  }
  assert.deepEqual(M.REDES_ORDEN.map(k => M.bloqueRed(k).puntos.length), [27, 35, 63]);
});

test('más empaquetada, más vecinos: CS < BCC < FCC', () => {
  const c = M.REDES_ORDEN.map(M.celda);
  assert.ok(c[0].empaquetamiento < c[1].empaquetamiento && c[1].empaquetamiento < c[2].empaquetamiento);
  assert.ok(c[0].coordinacion < c[1].coordinacion && c[1].coordinacion < c[2].coordinacion);
  assert.throws(() => M.celda('hcp'), /no conozco/);
});
