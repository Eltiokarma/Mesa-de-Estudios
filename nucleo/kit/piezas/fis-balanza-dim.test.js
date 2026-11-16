// Pruebas de la pieza «fis-balanza-dim»: la balanza queda derecha solo si los dos lados tienen la misma dimensión,
// la incógnita no la inclina, las dimensiones se escriben en letras, nada de NaN ni colores fijos, alto fijo y pureza.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./fis-balanza-dim.js');

const L = [0, 1, 0], V = [0, 1, -1], A = [0, 1, -2];
const brazo = s => s.match(/<line x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)" stroke="currentColor" stroke-width="4"/).slice(1).map(Number);

test('registrada en el kit', () => assert.equal(Kit.piezas['fis-balanza-dim'], P));

test('las dimensiones se escriben en letras', () => {
  assert.equal(P.texto(L), 'L');
  assert.equal(P.texto(V), 'L T⁻¹');
  assert.equal(P.texto([1, 2, -2]), 'M L² T⁻²');
  assert.equal(P.texto([0, 0, 0]), '1');
});

test('derecha si cuadra, inclinada si no', () => {
  const ok = P.dibujar({ izq: { nombre: 'd', exps: L }, der: { nombre: 'v · t', exps: L } });
  const [, y1, , y2] = brazo(ok);
  assert.equal(y1, y2);
  assert.match(ok, /Cuadra/);
  const mal = P.dibujar({ izq: { nombre: 'd', exps: L }, der: { nombre: 'v / t', exps: A } });
  const [, z1, , z2] = brazo(mal);
  assert.ok(z2 > z1, 'baja el lado derecho');
  assert.match(mal, /No cuadra/);
});

test('con la incógnita oculta no se inclina ni dice nada', () => {
  const s = P.dibujar({ izq: { nombre: 'x', exps: L }, der: { nombre: 'k · t²', oculta: true } });
  const [, y1, , y2] = brazo(s);
  assert.equal(y1, y2);
  assert.ok(!/Cuadra|No cuadra/.test(s));
  assert.match(s, />\?</);
});

test('sin NaN ni colores fijos, alto fijo, puro y con texto alternativo', () => {
  const altos = new Set();
  for (const d of [{}, { izq: { nombre: 'F', exps: [1, 1, -2] }, der: { nombre: 'm · a', exps: [1, 1, -2] } }, { izq: { nombre: 'x', exps: L }, der: { oculta: true } }]) {
    const s = P.dibujar(d);
    assert.ok(!/NaN|undefined|Infinity/.test(s));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
    assert.equal(s, P.dibujar(d));
    altos.add(s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)[2]);
    assert.ok(P.alt(d).length > 15 && !/NaN|undefined/.test(P.alt(d)));
  }
  assert.equal(altos.size, 1);
});

test('las vistas: estado.vista elige la balanza', () => {
  const d = { vistas: [{ izq: { nombre: 'x', exps: L }, der: { nombre: 'k · t²', oculta: true } }, { izq: { nombre: 'x', exps: L }, der: { nombre: 'k · t²', exps: L } }] };
  assert.ok(!/Cuadra/.test(P.dibujar(d, { vista: 0 })));
  assert.match(P.dibujar(d, { vista: 1 }), /Cuadra/);
});

