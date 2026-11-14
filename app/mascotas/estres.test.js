// Cuentas de la prueba de estrés de Rive (app/mascotas/estres.js), verificadas a mano.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const C = require('./estres.js');

test('percentil con interpolación lineal', () => {
  assert.strictEqual(C.percentil([1, 2, 3, 4, 5], 50), 3);
  assert.strictEqual(C.percentil([10, 20], 95), 19.5);   // 10 + 0,95 · 10
  assert.strictEqual(C.percentil([5, 1, 3], 0), 1);
  assert.ok(Number.isNaN(C.percentil([], 50)));
});

test('el intervalo nominal se lleva a 60, 90, 120 o 144 Hz si está cerca', () => {
  assert.strictEqual(C.intervaloNominal([16.5, 16.8, 16.6, 17.1]), 1000 / 60);
  assert.strictEqual(C.intervaloNominal([8.4, 8.3, 8.4]), 1000 / 120);
  assert.strictEqual(C.intervaloNominal([11.2, 11.1, 11.0]), 1000 / 90);
  assert.strictEqual(C.intervaloNominal([25, 25, 25]), 25);   // 40 Hz: se queda como está
  assert.strictEqual(C.intervaloNominal([]), 1000 / 60);
});

test('ventana a 60 Hz sin tropiezos: 60 cuadros/s y nada perdido', () => {
  const d = Array(300).fill(1000 / 60);
  const v = C.resumirVentana(d, 5000, 1000 / 60);
  assert.deepStrictEqual(v, { cuadros: 300, fpsMedia: 60, fpsP5: 60, perdidos: 0, peorMs: 16.7 });
});

test('ventana con tropiezos: cada intervalo de k periodos pierde k − 1 cuadros', () => {
  const p = 1000 / 60;
  // 270 cuadros normales, 20 de doble periodo (20 perdidos) y 2 de triple (4 perdidos): 270p + 40p + 6p = 316p.
  const d = [...Array(270).fill(p), ...Array(20).fill(2 * p), ...Array(2).fill(3 * p)];
  const v = C.resumirVentana(d, 316 * p, p);
  assert.strictEqual(v.perdidos, 24);
  assert.strictEqual(v.cuadros, 292);
  assert.strictEqual(v.fpsMedia, 55.4);   // 292 cuadros en 316/60 s
  // 22 de 292 intervalos (7,5 %) son lentos: el percentil 95 cae en los de doble periodo, 30 cuadros/s.
  assert.strictEqual(v.fpsP5, 30);
  // Con solo 12 lentos (4,1 %), el percentil 95 sigue en los normales: el percentil 5 no ve tropiezos tan raros,
  // por eso también se cuentan los perdidos y la peor pausa.
  const d2 = [...Array(280).fill(p), ...Array(10).fill(2 * p), ...Array(2).fill(3 * p)];
  assert.strictEqual(C.resumirVentana(d2, 306 * p, p).fpsP5, 60);
  assert.strictEqual(v.peorMs, 50);
});

test('el escenario une ventanas: media de medias, peor percentil 5, suma de perdidos; descarta las no válidas', () => {
  const s = C.resumirEscenario([
    { cuadros: 290, fpsMedia: 58, fpsP5: 40, perdidos: 10, peorMs: 50, memoriaMB: 12 },
    { cuadros: 300, fpsMedia: 60, fpsP5: 55, perdidos: 2, peorMs: 33.4, memoriaMB: 14 },
    { cuadros: 100, fpsMedia: 20, fpsP5: 5, perdidos: 200, peorMs: 900, memoriaMB: 99, valida: false },
  ]);
  assert.deepStrictEqual(s, { fpsMedia: 59, fpsP5: 40, perdidos: 12, peorMs: 50, memoriaMB: 14 });
  assert.strictEqual(C.resumirEscenario([]), null);
});

test('escenarios: 1, 2 y 3 lienzos, chicos y grandes, y uno que sigue el dedo', () => {
  const n = new Set(C.ESCENARIOS.map(e => e.lienzos.length));
  for (const k of [0, 1, 2, 3]) assert.ok(n.has(k), k);
  const todos = C.ESCENARIOS.flatMap(e => e.lienzos);
  assert.ok(todos.some(([a]) => a === 'dedo'));
  assert.ok(todos.some(([, t]) => t === 'chica') && todos.some(([, t]) => t === 'grande'));
  assert.strictEqual(new Set(C.ESCENARIOS.map(e => e.id)).size, C.ESCENARIOS.length);
});
