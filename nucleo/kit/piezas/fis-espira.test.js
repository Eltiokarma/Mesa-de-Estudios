// Pruebas de la pieza «fis-espira»: los tres montajes dibujan sin NaN ni colores fijos, el texto mide 14 o más,
// el alto no cambia, la barra cae sobre su metro de la regla y los cortes de la corriente siguen el sentido pedido.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./fis-espira.js');

const IMAN = s => ({ modo: 'iman', iman: { x: 0.5, polo: 'N', mueve: 'acerca' }, corriente: s, inducido: 'izq' });
const BARRA = x => ({ modo: 'barra', barra: { largo: 10, x, l: 0.5, sentido: 'entra', v: 2, corriente: 'arriba', brillo: 0.5 }, rotulo: 'ε = 1 V' });
const TRAFO = { modo: 'transformador', bobinas: { np: 100, ns: 400, vp: '220 V', vs: '880 V' } };

test('se registra en el kit', () => assert.equal(Kit.piezas['fis-espira'], P));

test('sin NaN, undefined ni hex; texto de 14 o más; alto fijo; puro', () => {
  const altos = new Set();
  for (const d of [IMAN('horario'), IMAN(null), BARRA(0), BARRA(10), TRAFO, { modo: 'iman' }, { modo: 'barra' }, { modo: 'transformador' }]) {
    const s = P.dibujar(d, {});
    assert.ok(!/NaN|undefined|Infinity/.test(s));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), 'solo tokens de color');
    for (const m of s.matchAll(/font-size="(\d+)"/g)) assert.ok(+m[1] >= 14);
    altos.add(s.match(/viewBox="0 0 320 (\d+)"/)[1]);
    assert.equal(s, P.dibujar(d, {}));
    assert.ok(P.alt(d).length > 20);
  }
  assert.equal(altos.size, 1);
});

test('fidelidad: la barra cae sobre la rayita de su metro', () => {
  for (const x of [0, 2, 4, 10]) {
    const s = P.dibujar(BARRA(x));
    const xb = +s.match(/<rect x="([\d.]+)" y="38" width="8"/)[1] + 4;
    const reg = s.match(/<g class="kit-regla">(.*?)<\/g>/)[1];
    const ray = [...reg.matchAll(/<line x1="([\d.]+)" y1="[\d.]+" x2="\1"/g)].map(m => +m[1]);
    assert.ok(ray.some(r => Math.abs(r - xb) < 1), `x = ${x}`);
  }
});

test('horario visto desde el imán: ⊙ arriba y ⊗ abajo; antihorario al revés', () => {
  const punto = s => [...s.matchAll(/<circle cx="236" cy="([\d.]+)" r="2.4"/g)].map(m => +m[1]);
  assert.deepEqual(punto(P.dibujar(IMAN('horario'))), [48]);
  assert.deepEqual(punto(P.dibujar(IMAN('antihorario'))), [152]);
});
