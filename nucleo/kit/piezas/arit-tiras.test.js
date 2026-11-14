// Pruebas de la pieza «arit-tiras»: una sola escala para todas las tiras (fidelidad), rastro por pasos, nada de
// NaN ni colores fijos, texto de 14 o más y alto fijo entre estados.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./arit-tiras.js');

const D = {
  max: 12, regla: { paso: 1, cada: 3 },
  tiras: [
    { rotulo: 'A', color: 'o', fin: '12', tramos: [{ valor: 4, color: 'o', texto: '4', partes: 4 }, { valor: 8, color: 'i', texto: '8', paso: 1 }] },
    { rotulo: 'B', color: 'i', fin: '6', tramos: [{ valor: 6, texto: '6' }], paso: 2 },
  ],
  filas: 2,
};

test('se registra en el kit', () => assert.equal(Kit.piezas['arit-tiras'], P));

test('fidelidad: el ancho de cada tramo es su valor por la misma escala', () => {
  const s = P.dibujar(D, { paso: 2 });
  const anchos = [...s.matchAll(/<rect class="kit-crece[^"]*" x="[\d.]+" y="[\d.]+" width="([\d.]+)"/g)].map(m => +m[1]);
  assert.equal(anchos.length, 3);
  const k = 300 / 12;
  assert.ok(Math.abs(anchos[0] - 4 * k) < 0.02 && Math.abs(anchos[1] - 8 * k) < 0.02 && Math.abs(anchos[2] - 6 * k) < 0.02);
});

test('cada paso deja su rastro y lo que viene después no se ve', () => {
  const s0 = P.dibujar(D, { paso: 0 }), s2 = P.dibujar(D, { paso: 2 });
  assert.ok(!/>8</.test(s0) && !/>B</.test(s0));
  assert.match(s2, />8</); assert.match(s2, />B</); assert.match(s2, />4</);
  assert.equal(P.dibujar(D, { corte: 2 }), s2, 'corte y paso son lo mismo');
});

test('sin NaN, undefined ni colores fijos; texto de 14 o más; alto fijo; puro', () => {
  const altos = new Set();
  for (const e of [{}, { paso: 1 }, { paso: 2 }, { paso: 9 }, { paso: 1, fantasma: { tira: 0, valor: 5, rotulo: 'sin la base' } }, { fantasma: { tira: 7, valor: NaN } }]) {
    const s = P.dibujar(D, e);
    assert.equal(s, P.dibujar(D, e));
    assert.ok(!/NaN|undefined|null|Infinity/.test(s));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
    assert.ok(!/<script|\son[a-z]+\s*=|\sid=/i.test(s));
    for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14);
    for (const [, c] of s.matchAll(/var\(--c-([a-z])\)/g)) assert.ok(['o', 'i', 'h', 'd'].includes(c));
    altos.add(s.match(/viewBox="0 0 320 ([\d.]+)"/)[1]);
  }
  assert.equal(altos.size, 1);
});

test('alt cuenta las tiras', () => assert.equal(P.alt(D), 'Tiras a la misma escala: A (12): 4, 8; B (6): 6'));
