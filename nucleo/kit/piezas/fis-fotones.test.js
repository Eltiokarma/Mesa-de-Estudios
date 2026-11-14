// Pruebas de la pieza «fis-fotones»: dibuja tantos paquetes como pide (proporcional al flujo), las flechas de los
// electrones crecen con k, sin NaN ni colores fijos, texto de 14 o más, alto fijo y pura.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./fis-fotones.js');

const D = (fotones, electrones, k) => ({ fotones, onda: 12, electrones, k, rotulos: { foton: 'hf = 3 eV', placa: 'φ = 2,3 eV', e: 'Kmax = 0,7 eV', nota: 'no salen' } });
const paquetes = s => (s.match(/stroke-width="2.5" stroke-linecap="round"/g) || []).length;
const flechas = s => [...s.matchAll(/<line x1="([\d.]+)" y1="[\d.]+" x2="([\d.]+)" y2="[\d.]+" stroke="var\(--c-o\)" stroke-width="3"/g)].map(m => +m[2] - +m[1]);

test('se registra en el kit', () => assert.equal(Kit.piezas['fis-fotones'], P));

test('la cantidad de paquetes es la pedida y el largo de las flechas crece con k', () => {
  for (const n of [0, 3, 12]) assert.equal(paquetes(P.dibujar(D(n, 2, 0.5))), n);
  const a = flechas(P.dibujar(D(6, 2, 0.2))), b = flechas(P.dibujar(D(6, 2, 0.8)));
  assert.equal(a.length, 2);
  assert.ok(b[0] > a[0]);
  assert.equal(flechas(P.dibujar(D(6, 0, 0.8))).length, 0);
});

test('sin NaN ni hex; texto de 14 o más; alto fijo; puro', () => {
  const altos = new Set();
  for (const d of [D(5, 3, 0.4), D(0, 0, 0), { fotones: 12, placa: false, onda: 30 }, {}]) for (const paso of [undefined, 1, 2, 3]) {
    const s = P.dibujar(d, { paso });
    assert.ok(!/NaN|undefined|Infinity/.test(s));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
    for (const m of s.matchAll(/font-size="(\d+)"/g)) assert.ok(+m[1] >= 14);
    altos.add(s.match(/viewBox="0 0 320 (\d+)"/)[1]);
    assert.equal(s, P.dibujar(d, { paso }));
    assert.ok(P.alt(d).length > 20);
  }
  assert.equal(altos.size, 1);
});
