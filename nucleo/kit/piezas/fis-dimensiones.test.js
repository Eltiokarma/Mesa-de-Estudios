// Pruebas de la pieza «fis-dimensiones»: una ficha por unidad de exponente (llena si es positivo, hueca si es
// negativo), la incógnita se ve como «?» hasta su paso, ida y vuelta da el mismo SVG, sin NaN, colores solo de
// variable, texto de 14 o más y alto fijo.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./fis-dimensiones.js');

const X = { columnas: [
  { nombre: 'x', color: 'i', exps: [0, 1, 0] },
  { nombre: 'A', color: 'h', exps: [0, 1, -2], oculta: 2, signo: '=' },
  { nombre: 't²', color: 'o', exps: [0, 0, 2], signo: '·', desde: 1 },
] };
const llenas = s => (s.match(/<rect [^>]*rx="2" fill="var/g) || []).length;
const huecas = s => (s.match(/stroke-dasharray="3 2"/g) || []).length;

test('registrada en el kit y con texto de dimensión', () => {
  assert.equal(Kit.piezas['fis-dimensiones'], P);
  assert.equal(P.texto([1, 1, -2]), 'M L T⁻²');
  assert.equal(P.texto([1, 2, -3]), 'M L² T⁻³');
  assert.equal(P.texto([0, 0, 0]), '1');
});

test('fichas: una por unidad de exponente; la incógnita es «?» hasta su paso', () => {
  const antes = P.dibujar(X, { corte: 1 }), despues = P.dibujar(X, { corte: 2 });
  assert.equal(llenas(antes), 1 + 2, 'L de x y T² de t²');
  assert.equal(huecas(antes), 0);
  assert.match(antes, />\?</);
  assert.equal(llenas(despues), 1 + 1 + 2);
  assert.equal(huecas(despues), 2, 'T⁻² de A');
  assert.doesNotMatch(despues, />\?</);
  assert.doesNotMatch(P.dibujar(X, { corte: 0 }), />t²</, 't² aparece en el paso 1');
});

test('puro, sin NaN, colores solo de variable, texto ≥ 14 y alto fijo', () => {
  const altos = new Set();
  for (const e of [{}, { corte: 1 }, { corte: 2, resalta: [0, 1] }, { final: true }]) {
    const s = P.dibujar(X, e);
    assert.equal(s, P.dibujar(X, e));
    assert.ok(!/NaN|undefined|Infinity/.test(s));
    assert.ok(!/#[0-9a-f]{3,6}/i.test(s), 'sin colores fijos');
    for (const m of s.matchAll(/font-size="(\d+)"/g)) assert.ok(+m[1] >= 14);
    altos.add(s.match(/height="([\d.]+)"/)[1]);
  }
  assert.equal(altos.size, 1);
  assert.ok(P.alt(X).length > 30);
});
