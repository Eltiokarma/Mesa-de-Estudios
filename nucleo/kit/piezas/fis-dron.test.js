// Pruebas de la pieza «fis-dron»: el dron cae donde dicen el largo y el rumbo, el círculo tiene el radio de la
// distancia, nada de NaN ni colores fijos, alto fijo, pureza, vistas y texto alternativo.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./fis-dron.js');

const { CX, CY, RPX } = P.constantes;

test('registrada en el kit', () => assert.equal(Kit.piezas['fis-dron'], P));

test('el largo y el rumbo dicen dónde cae: mismo largo, otro lugar', () => {
  const ne = P.punto({ max: 400 }, 300, 'NE'), no = P.punto({ max: 400 }, 300, 'NO');
  const r = RPX * 300 / 400;
  assert.ok(Math.abs(Math.hypot(ne[0] - CX, ne[1] - CY) - r) < 1e-9);
  assert.ok(Math.abs(Math.hypot(no[0] - CX, no[1] - CY) - r) < 1e-9);
  assert.ok(ne[0] > CX && no[0] < CX && ne[1] < CY && no[1] < CY, 'noreste a la derecha y arriba; noroeste a la izquierda');
  const n = P.punto({ max: 400 }, 200, 'N');
  assert.ok(Math.abs(n[0] - CX) < 1e-9 && n[1] < CY);
  assert.deepEqual(P.punto({ max: 400 }, 200, 90).map(x => Math.round(x * 1e6)), n.map(x => Math.round(x * 1e6)));
});

test('el círculo punteado tiene el radio de la distancia y su rótulo', () => {
  const s = P.dibujar({ circulo: 300, textoCirculo: 'Todos a 300 m de la plaza' });
  const r = +s.match(/class="kit-circulo"[^>]* r="([\d.]+)"/)[1];
  assert.ok(Math.abs(r - RPX * 300 / 400) < 0.01);
  assert.match(s, />Todos a 300 m de la plaza</);
  assert.ok(!/kit-circulo/.test(P.dibujar({})));
});

test('el dron se dibuja como objeto de prueba, con su flecha y su módulo', () => {
  const s = P.dibujar({ drones: [{ largo: 300, rumbo: 'NO', valor: '300 m' }], lugares: [{ nombre: 'Mercado', largo: 300, rumbo: 'NO' }] });
  assert.match(s, /data-objeto="dron" data-prueba="si"/);
  assert.match(s, /kit-vector/);
  assert.match(s, />300 m</);
  assert.match(s, />Mercado</);
  assert.match(s, />N</);
});

test('sin NaN ni colores fijos, alto fijo, puro y con texto alternativo', () => {
  const altos = new Set();
  for (const d of [{}, { drones: [{ largo: 100, rumbo: 'S' }, { largo: 400, rumbo: 'SO', fantasma: true }], circulo: 250 }, { lugares: [{ nombre: 'Colegio', largo: 300, rumbo: 'NE' }] }]) {
    const s = P.dibujar(d);
    assert.ok(!/NaN|undefined|Infinity/.test(s));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
    assert.equal(s, P.dibujar(d));
    altos.add(s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)[2]);
    assert.ok(P.alt(d).length > 20 && !/NaN|undefined/.test(P.alt(d)));
  }
  assert.equal(altos.size, 1);
});

test('las vistas: estado.vista elige la figura', () => {
  const d = { vistas: [{ circulo: 300 }, { drones: [{ largo: 300, rumbo: 'E' }] }] };
  assert.match(P.dibujar(d, { vista: 0 }), /kit-circulo/);
  assert.match(P.dibujar(d, { vista: 1 }), /data-objeto="dron"/);
  assert.ok(!/data-objeto="dron"/.test(P.dibujar(d, { vista: 0 })));
});
