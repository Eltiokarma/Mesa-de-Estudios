// Pruebas de la pieza «arit-fichas»: todas las fichas del mismo tamaño en todos los bloques (fidelidad), cuenta
// exacta de fichas y huecos, marcos de filas llenas, nada de NaN ni colores fijos, texto de 14 o más y alto fijo.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./arit-fichas.js');

const D = { bloques: [
  { n: 23, columnas: 5, color: 'o', rotulo: '23', marcoFilas: true, tramos: [{ de: 20, a: 22, color: 'h', paso: 1 }] },
  { n: 9, columnas: 3, color: 'i', rotulo: '3 × 3', huecos: 7, huecosPaso: 2, paso: 1 },
] };

test('se registra en el kit', () => assert.equal(Kit.piezas['arit-fichas'], P));

test('cuenta exacta: fichas llenas, huecos y filas enmarcadas', () => {
  const s = P.dibujar(D, { paso: 2 });
  assert.equal((s.match(/<circle[^>]*fill="var/g) || []).length, 32);
  assert.equal((s.match(/stroke-dasharray="3 3"/g) || []).length, 7);
  assert.equal((s.match(/<rect[^>]*rx/g) || []).length, 4, 'cuatro filas llenas de 5');
  assert.equal((P.dibujar(D, { paso: 1 }).match(/stroke-dasharray="3 3"/g) || []).length, 0, 'los huecos llegan en su paso');
  assert.equal((P.dibujar(D, { paso: 1 }).match(/fill="var\(--c-h\)"/g) || []).length, 3);
});

test('todas las fichas tienen el mismo radio', () => {
  const s = P.dibujar(D, { paso: 2 });
  assert.equal(new Set([...s.matchAll(/<circle[^>]* r="([\d.]+)"/g)].map(m => m[1])).size, 1);
});

test('escalera por filas', () => {
  const s = P.dibujar({ bloques: [{ filas: [1, 2, 3, 4], color: 'd' }] });
  assert.equal((s.match(/<circle/g) || []).length, 10);
});

test('sin NaN ni colores fijos; texto de 14 o más; alto fijo; puro', () => {
  const altos = new Set();
  for (const e of [{}, { paso: 1 }, { paso: 2 }, { paso: 2, fantasma: { bloque: 0, rotulo: 'sobran 3' } }]) {
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

test('alt cuenta filas y sobrante', () => assert.match(P.alt(D), /23 fichas en filas de 5: 4 filas llenas y 3 sueltas/));

test('geometria.ficha cae en el centro del círculo dibujado (manijas del gesto directo)', () => {
  const d = { bloques: [{ n: 7, columnas: 3, color: 'o' }, { filas: [1, 2, 3], color: 'i' }] };
  const s = P.dibujar(d), g = P.geometria(d);
  const centros = [...s.matchAll(/<circle[^>]*cx="([\d.]+)" cy="([\d.]+)"/g)].map(m => [+m[1], +m[2]]);
  for (const [k, n] of [[0, 7], [1, 6]]) for (let i = 0; i < n; i++) {
    const p = g.ficha(k, i);
    assert.ok(centros.some(([x, y]) => Math.abs(x - p.x) < 0.01 && Math.abs(y - p.y) < 0.01), `ficha ${k}.${i}`);
  }
  const c = g.caja(0);
  assert.ok(c.ancho > 0 && c.alto > 0 && Math.abs(c.y + c.alto - g.piso) < 1e-9);
});
