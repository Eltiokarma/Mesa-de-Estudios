// Pruebas de las piezas de Álgebra (alg-tabla, alg-baldosas, alg-venn): pureza, nada de NaN ni colores fijos,
// texto de 14 o más, alto fijo entre estados, lo que aparece por pasos y la fidelidad de cada una.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const Tb = require('./alg-tabla.js');
const Bd = require('./alg-baldosas.js');
const Vn = require('./alg-venn.js');

const VERDAD = {
  columnas: ['p', 'q', 'p → q'], colorCol: ['o', 'i', 'd'],
  filas: [['V', 'V', { t: 'V', desde: 1 }], ['V', 'F', { t: 'F', desde: 1, fuerte: true, marca: 'no' }], ['F', 'V', { t: 'V', desde: 2 }], ['F', 'F', { t: 'V', desde: 2 }]],
};
const RUFFINI = {
  filas: [['', '1', '−3', '0', '4'], ['2', '', { t: '2', desde: 1 }, { t: '−2', desde: 2 }, { t: '−4', desde: 3 }], ['', '1', { t: '−1', desde: 1 }, { t: '−2', desde: 2 }, { t: '0', desde: 3, fuerte: true }]],
  separador: { fila: 2 }, flechas: [{ de: [2, 1], a: [1, 2], color: 'o', desde: 1 }],
};
const PASCAL = { triangular: true, filas: [['1'], ['1', '1'], ['1', '2', '1'], ['1', '3', '3', '1']], flechas: [{ de: [2, 0], a: [3, 1], desde: 1 }] };
const MATRIZ = { corchetes: true, filas: [['2', '1'], ['−1', '3']] };
const BALD = {
  anchos: [{ t: 'a', v: 3, color: 'o' }, { t: 'b', v: 2, color: 'i' }], altos: [{ t: 'a', v: 3, color: 'o' }, { t: 'b', v: 2, color: 'i' }],
  celdas: [[{ t: 'a²', color: 'o' }, { t: 'ab', color: 'd', desde: 1 }], [{ t: 'ab', color: 'd', desde: 1 }, { t: 'b²', color: 'i', desde: 2 }]],
  total: { t: '(a + b)²', desde: 2 },
};
const V2 = { conjuntos: [{ t: 'A', color: 'o' }, { t: 'B', color: 'i' }], universo: 'U', regiones: { '10': { t: '1, 3' }, '11': { t: '2', sombra: true, desde: 1 }, '01': { t: '4' }, '00': { t: '5' } } };
const V3 = { conjuntos: [{ t: 'A', color: 'o' }, { t: 'B', color: 'i' }, { t: 'C', color: 'd' }], regiones: { '111': { t: '7', sombra: true }, '100': { t: '1' } } };

const casos = [[Tb, [VERDAD, RUFFINI, PASCAL, MATRIZ]], [Bd, [BALD]], [Vn, [V2, V3]]];
const estados = [{}, { corte: 1 }, { corte: 2 }, { corte: 3, final: true }, { corte: 9 }, { fantasma: { f: 1, c: 2, t: 'V', rotulo: 'sin el caso F' } },
  { separar: true }, { fantasma: { celdas: [[0, 1]], rotulo: 'falta 2ab' } }, { sombra: ['10'] }, { fantasma: { regiones: ['10'], rotulo: 'solo A' } }];

test('se registran en el kit', () => {
  assert.equal(Kit.piezas['alg-tabla'], Tb); assert.equal(Kit.piezas['alg-baldosas'], Bd); assert.equal(Kit.piezas['alg-venn'], Vn);
});

test('puras, sin NaN ni colores fijos, texto de 14 o más, alto fijo y alt que cuenta la relación', () => {
  for (const [P, ds] of casos) for (const d of ds) {
    const altos = new Set();
    for (const e of estados) {
      const s = P.dibujar(d, e);
      assert.equal(s, P.dibujar(d, e));
      assert.ok(!/NaN|undefined|null|Infinity/.test(s), `${P.id} ${JSON.stringify(e)}`);
      assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
      assert.ok(!/<script|\son[a-z]+\s*=|\sid=|clipPath/i.test(s));
      for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14);
      for (const [, c] of s.matchAll(/var\(--c-([a-z])\)/g)) assert.ok(['o', 'i', 'h', 'd'].includes(c));
      altos.add(s.match(/viewBox="0 0 320 ([\d.]+)"/)[1]);
    }
    assert.equal(altos.size, 1, `${P.id}: el alto no cambia entre estados`);
    assert.ok(P.alt(d).length >= 15);
  }
});

test('tabla: lo que tiene desde > corte todavía no se ve; lo hecho se queda', () => {
  const c0 = Tb.dibujar(RUFFINI, { corte: 0 }), c3 = Tb.dibujar(RUFFINI, { corte: 3 });
  assert.ok(!/>−4</.test(c0)); assert.match(c3, />−4</); assert.match(c3, />−2</);
  assert.equal((Tb.dibujar(VERDAD, { corte: 0 }).match(/>V</g) || []).length, 4);
  assert.match(Tb.dibujar(VERDAD, { corte: 1 }), />✗</);
  assert.match(Tb.dibujar(VERDAD, { fantasma: { f: 1, c: 2, t: 'V', rotulo: 'sin el caso F' } }), /sin el caso F/);
});

test('tabla triangular: cada fila de Pascal queda centrada en el mismo eje', () => {
  const g = Tb.geometria(PASCAL);
  const centro = f => (g.cx(f, 0) + g.cx(f, PASCAL.filas[f].length - 1)) / 2;
  for (const f of [1, 2, 3]) assert.ok(Math.abs(centro(f) - centro(0)) < 1e-9);
});

test('baldosas: una sola escala; el área dibujada de cada pieza es su ancho por su alto', () => {
  const s = Bd.dibujar(BALD, { corte: 2 });
  const rects = [...s.matchAll(/<rect x="[\d.]+" y="[\d.]+" width="([\d.]+)" height="([\d.]+)" rx="4" fill="var\(--c-([a-z])\)"/g)].map(m => [+m[1], +m[2], m[3]]);
  assert.equal(rects.length, 4);
  const esc = Bd.geometria(BALD).esc;
  const area = ([w, h]) => w * h / esc / esc;
  assert.ok(Math.abs(area(rects[0]) - 9) < 0.1); assert.ok(Math.abs(area(rects[1]) - 6) < 0.1); assert.ok(Math.abs(area(rects[3]) - 4) < 0.1);
  // Separar aparta las piezas sin cambiar su tamaño.
  const sep = [...Bd.dibujar(BALD, { corte: 2, separar: true }).matchAll(/width="([\d.]+)" height="([\d.]+)" rx="4" fill="var/g)].map(m => +m[1]);
  assert.deepEqual(sep, rects.map(r => r[0]));
});

test('venn: el centro de cada región cae dentro de su región', () => {
  for (const d of [V2, V3]) for (const [cod, [x, y]] of Object.entries(Vn.centros(d))) assert.equal(Vn.codigo(d, x, y), cod, `${cod}`);
  const s = Vn.dibujar(V2, { corte: 1 });
  assert.ok((s.match(/<circle cx="\d+" cy="\d+" r="1.8"\/>/g) || []).length > 20, 'la intersección queda sombreada');
  assert.ok(!/r="1.8"/.test(Vn.dibujar(V2, { corte: 0 })), 'antes de su paso, sin sombra');
});

test('tabla: el pie va bajo la tabla y cede su lugar al rótulo del fantasma', () => {
  const d = { ...MATRIZ, pie: 'y 3 más' };
  assert.match(Tb.dibujar(d, {}), />y 3 más</);
  const conFantasma = Tb.dibujar(d, { fantasma: { f: 0, c: 0, t: '5', rotulo: 'otro valor' } });
  assert.doesNotMatch(conFantasma, />y 3 más</); assert.match(conFantasma, />otro valor</);
});
