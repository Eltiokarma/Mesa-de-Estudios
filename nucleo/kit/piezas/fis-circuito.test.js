// Pruebas de la pieza «fis-circuito»: dibuja cada elemento y cada lectura pegada, el halo del foco crece con el
// brillo, el corte esconde lecturas, nada de NaN ni colores fijos, texto de 14 o más, alto fijo y pieza pura.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./fis-circuito.js');

const SERIE = { fuente: { rotulo: 'ε = 12 V', color: 'o' }, serie: [{ tipo: 'A', lectura: '2 A' }, { tipo: 'foco', rotulo: 'R = 6 Ω', brillo: 0.5, color: 'h', lectura: '24 W', desde: 1 }, { tipo: 'A', lectura: '2 A' }] };
const PAR = { fuente: { rotulo: 'ε = 12 V', r: 'r = 1 Ω', voltimetro: '10 V', color: 'o' }, serie: [{ tipo: 'R', rotulo: 'R₁', color: 'i' }],
  ramas: [{ tipo: 'R', rotulo: 'R₂', lectura: '4 A', corriente: { texto: '4 A', color: 'h' } }, { tipo: 'foco', brillo: 1 }, { tipo: 'C', rotulo: 'C', voltimetro: '6 V' }] };

test('se registra en el kit', () => assert.equal(Kit.piezas['fis-circuito'], P));

test('cada lectura está en el dibujo y el corte las esconde', () => {
  const s = P.dibujar(SERIE, {});
  assert.equal((s.match(/>A</g) || []).length, 2, 'dos amperímetros');
  assert.match(s, />24 W</);
  assert.doesNotMatch(P.dibujar(SERIE, { corte: 0 }), />24 W</);
  const q = P.dibujar(PAR, {});
  assert.match(q, />10 V</); assert.match(q, />6 V</); assert.match(q, />4 A</);
  assert.match(q, /stroke-dasharray="3 4"/, 'la pila real lleva su caja');
});

test('el halo del foco crece con el brillo y no existe apagado', () => {
  const r = b => { const m = P.dibujar({ serie: [{ tipo: 'foco', brillo: b }] }).match(/kit-halo" cx="[\d.]+" cy="[\d.]+" r="([\d.]+)"/); return m ? +m[1] : 0; };
  assert.equal(r(0), 0);
  assert.ok(r(1) > r(0.25) && r(0.25) > 0);
});

test('sin NaN ni colores fijos; texto de 14 o más; dos altos (malla simple o con ramas), fijos entre estados; pura', () => {
  const altos = new Set();
  for (const d of [SERIE, PAR, { fuente: {} }, { serie: [], ramas: [], abierto: true }]) {
    const s = P.dibujar(d, {});
    assert.equal(s, P.dibujar(d, {}));
    assert.ok(!/NaN|undefined|null|Infinity/.test(s));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
    for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14);
    altos.add(s.match(/viewBox="0 0 320 ([\d.]+)"/)[1]);
  }
  assert.deepEqual([...altos].sort(), ['200', '262']);
  for (const d of [SERIE, PAR]) assert.equal(P.dibujar(d, { corte: 0 }).match(/viewBox="0 0 320 ([\d.]+)"/)[1], P.dibujar(d, {}).match(/viewBox="0 0 320 ([\d.]+)"/)[1]);
  assert.match(P.alt(PAR), /en paralelo/);
});
