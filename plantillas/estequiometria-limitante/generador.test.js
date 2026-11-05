// Pruebas del generador de reactivo limitante: casos.json (verificados aparte con
// fracciones exactas) y un recálculo independiente en cada uno de 400 problemas.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// Camino independiente: el limitante es el reactivo que daría menos producto.
function recalcular(p) {
  const r = gen.REACCIONES.find(x => x.id === p._datos.reaccion);
  const porA = p._datos.mA / r.A.M / r.A.c * r.P.c * r.P.M;
  const porB = p._datos.mB / r.B.M / r.B.c * r.P.c * r.P.M;
  return Math.min(porA, porB);
}
probarGenerador(gen, { recalcular });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(Math.abs(p.respuesta.valor - c.esperado.masa_producto) <= casos.tolerancia);
    assert.equal(p.respuesta.limitante, c.esperado.limitante);
  });
}

test('las reacciones están balanceadas (se conserva la masa)', () => {
  for (const r of gen.REACCIONES) {
    const reac = r.A.c * r.A.M + r.B.c * r.B.M;
    const prod = [r.P, ...r.otros].reduce((s, x) => s + x.c * x.M, 0);
    assert.equal(reac, prod, `${r.id}: ${reac} ≠ ${prod}`);
  }
});

test('el error ES20 aparece: a veces el limitante es el que tiene más gramos', () => {
  let n = 0;
  for (let s = 0; s < 200; s++) if (gen.generar(s).alternativas.some(a => a.error && a.error.id === 'ES20')) n++;
  assert.ok(n > 50, `ES20 solo apareció en ${n} de 200 problemas`);
});

test('la solución paso a paso usa los mismos números que el enunciado (2000 problemas)', () => {
  for (let s = 0; s < 2000; s++) {
    const p = gen.generar(s), r = gen.REACCIONES.find(x => x.id === p._datos.reaccion);
    const m = p.solucion[1].join('').match(/para ([\d,]+) veces.*para ([\d,]+) veces/);
    const kA = p._datos.mA / r.A.M / r.A.c, kB = p._datos.mB / r.B.M / r.B.c;
    assert.ok(Math.abs(parseFloat(m[1].replace(',', '.')) - kA) < 0.01 && Math.abs(parseFloat(m[2].replace(',', '.')) - kB) < 0.01, `semilla ${s}`);
  }
});
