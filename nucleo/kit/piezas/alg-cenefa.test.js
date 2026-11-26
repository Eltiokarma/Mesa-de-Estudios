// Pruebas de la pieza «alg-cenefa» (las cenefas de Rubén, unidad «Binomio de Newton»): se dibuja sin NaN ni colores
// fijos, es pura, está marcada como dibujo de prueba y trae su texto alternativo; nunca usa carmín. Es fiel: dibuja una
// loseta por elección, con la letra de su término, y patrones(n, k, r) da todas las cenefas sin repetir. Con números
// (docs/molde-unidad.md §6): todo cabe en el lienzo con 4 de margen y ningún texto pisa a otro ni a una loseta. Se
// revisan las muestras de abajo y todas las figuras de la teoría que usan la pieza (juegos en su grilla, Lee, Predice,
// Mira paso a paso, la regla y los ejemplos).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('../kit.js');
const P = require('./alg-cenefa.js');
const Teoria = require('../../teoria.js');
const def = require('../../../contenido/teoria/algebra/binomio-de-newton.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));

const MUESTRAS = [{}, { objeto: 'cenefas' }, { objeto: 'grupos' }, { objeto: 'parentesis' }];
for (let n = 1; n <= 6; n++) for (let k = 0; k <= n; k++) MUESTRAS.push({ objeto: 'cenefas', patrones: P.patrones(n, k), abajo: [['20 cenefas', 'f', 700], [': 20a³b³', null, 700]] });
for (let n = 1; n <= 6; n++) MUESTRAS.push({ objeto: 'grupos', filas: Array.from({ length: n + 1 }, (_, k) => ({ patron: P.patrones(n, k)[0], rotulo: `${k} turquesas`, cuenta: `× ${k + 1}` })), abajo: [['64 cenefas', 'f', 700]] });
for (let n = 1; n <= 5; n++) MUESTRAS.push({ objeto: 'parentesis', eleccion: Array.from({ length: n }, (_, i) => i % 2), terminos: ['2x', '−1'], arriba: 'lugar 3', abajo: [['C(5, 2) · (2x)³ · (−1)² = ', null, 400], ['80x³', 'f', 700]] });
const deTeoria = [];
const add = (fg, pieza) => { if (fg && (fg.pieza || pieza) === 'alg-cenefa') deTeoria.push({ datos: fg.datos, estado: fg.estado || {} }); };
for (const i of def.ideas) {
  i.lee.tarjetas.forEach(t => add(t.dibujo, t.pieza));
  if ((i.juega.pieza || i.pieza) === 'alg-cenefa') for (const v of Teoria.grilla(i.juega.controles)) add(i.juega.dibujo(v), 'alg-cenefa');
  add(i.predice.dibujo, i.pieza); add(i.predice.revelar, i.pieza);
  if ((i.mira.pieza || i.pieza) === 'alg-cenefa') i.mira.pasos.forEach(p => deTeoria.push({ datos: i.mira.datos, estado: p.estado || {} }));
  add(i.regla.dibujo, i.pieza);
  i.ejemplos.forEach(e => add(e.figura));
}
const TODAS = [...MUESTRAS.map(datos => ({ datos, estado: {} })), ...deTeoria];

test('se dibuja puro, sin NaN, marcado como prueba, con texto alternativo y sin carmín ni colores fijos', () => {
  for (const { datos, estado } of TODAS) {
    const a = P.dibujar(datos, estado), b = P.dibujar(datos, estado);
    assert.equal(a, b, 'pura');
    assert.ok(!/NaN|undefined|Infinity/.test(a), JSON.stringify(datos).slice(0, 120));
    assert.ok(/data-prueba="si"/.test(a));
    assert.ok(/aria-label="[^"]{12,}"/.test(a));
    assert.ok(!/var\(--c-h\)/.test(a), 'sin carmín');
    assert.ok(!/#[0-9a-f]{3,6}/i.test(a), 'sin colores fijos');
  }
  assert.ok(deTeoria.length >= 60, `figuras de la teoría: ${deTeoria.length}`);
});

test('todo cabe en el lienzo con su margen, ningún texto pisa a otro y ninguna loseta pisa un texto ni a otra', () => {
  for (const { datos, estado } of TODAS) {
    assert.ok(P.cabe(datos, estado), `no cabe: ${JSON.stringify(datos).slice(0, 140)}`);
    const g = P.geometria(datos, estado), t = g.textos, o = g.objetos;
    const pisa = (a, b) => a.x0 < b.x1 - 1e-9 && b.x0 < a.x1 - 1e-9 && a.y0 < b.y1 - 1e-9 && b.y0 < a.y1 - 1e-9;
    for (let i = 0; i < t.length; i++) for (let j = i + 1; j < t.length; j++) assert.ok(!pisa(t[i], t[j]), `«${t[i].txt}» pisa a «${t[j].txt}»`);
    for (const x of t) for (const l of o) assert.ok(!pisa(x, l), `«${x.txt}» pisa una loseta: ${JSON.stringify(datos).slice(0, 100)}`);
    for (let i = 0; i < o.length; i++) for (let j = i + 1; j < o.length; j++) assert.ok(!pisa(o[i], o[j]), 'dos losetas encimadas');
  }
});

test('fiel: una loseta por elección, con su letra; las cenefas de patrones(n, k, r) son todas y distintas', () => {
  const g = P.geometria({ objeto: 'cenefas', patrones: P.patrones(4, 2) });
  assert.equal(g.objetos.length, 6 * 4);
  assert.equal(g.objetos.filter(x => x.j === 1).length, 12, 'dos turquesas por cenefa');
  const svg = P.dibujar({ objeto: 'cenefas', patrones: [[0, 1, 2]], letras: ['a', 'b', 'c'] });
  for (const l of ['>a<', '>b<', '>c<']) assert.ok(svg.includes(l), `la loseta lleva su letra ${l}`);
  const comb = (n, k) => { let r = 1; for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1); return Math.round(r); };
  for (let n = 1; n <= 7; n++) for (let k = 0; k <= n; k++) {
    const ps = P.patrones(n, k);
    assert.equal(ps.length, comb(n, k));
    assert.equal(new Set(ps.map(p => p.join())).size, ps.length);
    assert.ok(ps.every(p => p.length === n && p.filter(x => x === 1).length === k));
  }
  assert.equal(P.patrones(6, 2, 2).length, 90, '6!/(2! 2! 2!)');
  const par = P.geometria({ objeto: 'parentesis', eleccion: [0, 1, 1], terminos: ['a', 'b'] });
  assert.deepEqual(par.objetos.map(x => x.j), [0, 1, 1], 'debajo de cada paréntesis, la loseta de su elección');
});
