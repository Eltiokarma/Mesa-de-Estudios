// Pruebas del generador de porcentajes: casos.json (verificados aparte con fracciones exactas)
// y un recálculo independiente en cada uno de 400 problemas.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// Camino independiente: lo que queda tras cada cambio, multiplicado.
function recalcular(p) {
  const { tipo, precio, a, b } = p._datos;
  if (tipo === 'dos-descuentos') return precio * ((100 - a) * (100 - b)) / 10000;
  if (tipo === 'aumento-descuento') return precio * ((100 + a) * (100 - b)) / 10000;
  return 100 - ((100 - a) * (100 - b)) / 100;
}
probarGenerador(gen, { recalcular });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia);
  });
}

test('salen los tres tipos de problema', () => {
  const tipos = new Set(); for (let s = 0; s < 100; s++) tipos.add(gen.generar(s)._datos.tipo);
  assert.equal(tipos.size, 3);
});
