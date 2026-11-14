// Pruebas de la pieza «rm-plano»: una sola escala (un nodo en (x, y) cae donde dice), el corte deja lo hecho, el
// fantasma va discontinuo, ruedas con dientes y giro, alto fijo, sin NaN ni colores fijos y texto de 14 o más.
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('./rm-plano.js');

const d = {
  ancho: 10, alto: 5, cuadricula: 1, norte: true,
  nodos: [{ id: 'a', x: 0, y: 0, t: 'A' }, { id: 'b', x: 10, y: 5, t: 'B', desde: 1 }],
  aristas: [{ de: 'a', a: 'b', flecha: true, rotulo: '3', desde: 1 }],
  circulos: [{ x: 5, y: 2.5, r: 2, dientes: 12, giro: -1, marca: 90, rotulo: '20' }],
  poligonos: [{ puntos: [[1, 1], [3, 1], [3, 3]], color: 'o', rotulo: 'P' }],
  lineas: [{ de: [0, 5], a: [4, 5], color: 'i', flecha: true }],
  textos: [{ x: 8, y: 1, t: 'hola' }], pie: 'Un plano',
};
const limpio = s => {
  assert.ok(!/NaN|undefined|null|Infinity/.test(s));
  assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
  assert.ok(!/<script|\son[a-z]+\s*=|\sid=/i.test(s));
  for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14);
};

test('escala única: el nodo de (10, 5) queda a la misma razón horizontal y vertical', () => {
  const s = P.dibujar(d, { corte: 1 });
  const cs = [...s.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)" r="15"/g)].map(m => [+m[1], +m[2]]);
  assert.equal(cs.length, 2);
  const kx = (cs[1][0] - cs[0][0]) / 10, ky = (cs[1][1] - cs[0][1]) / 5;
  assert.ok(Math.abs(kx - ky) < 0.02);
});

test('corte, fantasma y alto fijo', () => {
  const altos = new Set();
  for (const e of [{ corte: 0 }, { corte: 1 }, { corte: 1, fantasma: { lineas: [{ de: [0, 0], a: [5, 5] }], rotulo: 'Así no' } }]) {
    const s = P.dibujar(d, e);
    limpio(s);
    altos.add(s.match(/viewBox="0 0 320 ([\d.]+)"/)[1]);
  }
  assert.equal(altos.size, 1);
  assert.ok(!/>B</.test(P.dibujar(d, { corte: 0 })));
  assert.match(P.dibujar(d, { corte: 1, fantasma: { lineas: [{ de: [0, 0], a: [5, 5] }], rotulo: 'Así no' } }), /kit-fantasma[^]*stroke-dasharray/);
  assert.match(P.alt(d), /A→B 3/);
});
