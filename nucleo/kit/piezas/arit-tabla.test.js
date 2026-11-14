// Pruebas de la pieza «arit-tabla»: celdas por pasos (su lugar se reserva), resaltes, fantasma, nada de NaN ni
// colores fijos, texto de 14 o más, alto fijo entre estados.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./arit-tabla.js');

const D = {
  columnas: [{ t: 'p', color: 'o' }, { t: 'q', color: 'i' }, { t: 'p → q', color: 'd' }],
  filas: [['V', 'V', { t: 'V', paso: 1 }], ['V', 'F', { t: 'F', paso: 2, resalta: true, color: 'h' }], ['F', 'V', { t: 'V', paso: 3 }], ['F', 'F', { t: 'V', paso: 3 }]],
  filasMax: 4,
};

test('se registra en el kit', () => assert.equal(Kit.piezas['arit-tabla'], P));

test('una celda aparece en su paso y se queda', () => {
  const n = s => (s.match(/>F</g) || []).length;
  assert.equal(n(P.dibujar(D, { paso: 1 })), 4);
  assert.equal(n(P.dibujar(D, { paso: 2 })), 5);
  assert.equal(n(P.dibujar(D, { paso: 3 })), 5);
  assert.match(P.dibujar(D, { paso: 2 }), /fill="var\(--c-h\)" fill-opacity="0.2"/);
});

test('sin NaN ni colores fijos; texto de 14 o más; alto fijo; puro', () => {
  const altos = new Set();
  for (const e of [{}, { paso: 1, fila: 1 }, { paso: 3, fila: [0, 2], columna: 2 }, { fantasma: { fila: 1, columna: 2, t: 'V' } }, { fantasma: { fila: 99, columna: 0 } }]) {
    const s = P.dibujar(D, e);
    assert.equal(s, P.dibujar(D, e));
    assert.ok(!/NaN|undefined|null|Infinity/.test(s));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
    assert.ok(!/\sid=/i.test(s));
    for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14);
    altos.add(s.match(/viewBox="0 0 320 ([\d.]+)"/)[1]);
  }
  assert.equal(altos.size, 1);
});

test('las columnas llenan el ancho sin salirse', () => {
  const g = P.geometria({ columnas: ['n', 'n²', 'n³', 'suma', 'x', 'y', 'z'], filas: [[1, 1, 1, 1000000, 2, 3, 4]] });
  assert.ok(g.xs[g.xs.length - 1] <= 316.01);
});

test('alt dice columnas y filas', () => assert.equal(P.alt(D), 'Tabla con columnas p, q, p → q y 4 filas'));

test('geometria.celda da el centro de la celda donde va su texto (gesto directo)', () => {
  const d = { columnas: [{ t: 'p' }, { t: 'q' }], filas: [['V', 'F'], ['F', 'V']] };
  const g = P.geometria(d);
  const c = g.celda(1, 1);
  assert.ok(c.x > g.xs[1] && c.x < g.xs[2]);
  assert.ok(c.y > g.filaY(1) && c.y < g.filaY(2));
});
