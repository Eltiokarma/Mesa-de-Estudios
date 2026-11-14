// Pruebas de lo que el grupo B de álgebra (teoría, ronda 2) agregó a piezas comunes: balanza.platillos y
// balanza.geometria, para las manijas del gesto directo. Lo que ya dibujaba la balanza no cambia.
const test = require('node:test');
const assert = require('node:assert/strict');
require('../kit.js');
const B = require('./balanza.js');

const ECU = (izq, der, pesos = { x: 4 }) => ({ unidad: 'kg', colores: { x: 'o' }, incognitas: ['x'], pesos, balanzas: [], trabajo: [{ izq, der }] });
// Las líneas de los platos: de 2 px en tinta, de largo 2 · PLATO = 108.
const platos = s => [...s.matchAll(/<line x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)" stroke="currentColor" stroke-width="2"/g)]
  .map(m => m.slice(1).map(Number)).filter(([x1, y1, x2, y2]) => Math.abs(y1 - y2) < 1e-6 && Math.abs(x2 - x1 - 108) < 0.02);

test('balanza.platillos coincide con los platos dibujados', () => {
  for (const d of [ECU({ x: 3, pesa: 4 }, { x: 1, pesa: 12 }), ECU({ x: 3, pesa: 4 }, { pesa: 12 }), ECU({ pesa: 4 }, { x: 1, pesa: 12 })]) {
    const p = B.platillos(d), dib = platos(B.dibujar(d, { vista: 0 }));
    assert.equal(dib.length, 2);
    for (const [lado, [x1, y1]] of [['izq', dib[0]], ['der', dib[1]]]) {
      assert.ok(Math.abs(p[lado].x - (x1 + 54)) < 0.02, `${lado} x`);
      assert.ok(Math.abs(p[lado].y - y1) < 0.02, `${lado} y`);
    }
  }
});

test('balanza.platillos: en equilibrio los platos están a la misma altura; el que pesa más baja', () => {
  const eq = B.platillos(ECU({ x: 3, pesa: 4 }, { x: 1, pesa: 12 }));
  assert.equal(eq.grados, 0);
  assert.ok(Math.abs(eq.izq.y - eq.der.y) < 1e-9);
  const izqPesa = B.platillos(ECU({ x: 3, pesa: 4 }, { pesa: 12 }));
  assert.ok(izqPesa.izq.y > izqPesa.der.y && izqPesa.grados > 0);
  assert.ok(izqPesa.izq.y < izqPesa.alto && izqPesa.der.y > 0);
});

test('balanza.platillos usa la balanza del enunciado pedida y la geometría exportada', () => {
  const d = { unidad: 'kg', colores: {}, pesos: null, balanzas: [{ izq: { circulo: 1 }, der: { circulo: 1 }, estado: 'equilibrio' }, { izq: { circulo: 2 }, der: { circulo: 1 }, estado: 'izq-baja' }], trabajo: [] };
  const g = B.geometria(d);
  const p0 = B.platillos(d, { balanza: 0 }), p1 = B.platillos(d, { balanza: 1 });
  assert.ok(Math.abs(p1.giro.y - p0.giro.y - g.filaH) < 1e-9);
  assert.ok(p1.izq.y > p1.der.y);
  assert.equal(B.platillos(d), null);
});
