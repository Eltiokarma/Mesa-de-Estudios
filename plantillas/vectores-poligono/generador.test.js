// Pruebas del generador G7 (polígono regular): casos.json (verificados aparte, a ciegas) y un
// recálculo independiente con el radio del polígono en cada uno de 600 problemas.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// Radio de la circunferencia circunscrita: L/√3, L/√2 o L (no se usa el seno).
const RADIO = { 3: L => L / Math.sqrt(3), 4: L => L / Math.SQRT2, 6: L => L };
function recalcular(p) {
  const { tipo, n, L } = p._datos;
  if (tipo === 'desde-vertice') return n * RADIO[n](L);
  if (tipo === 'lados-menos-uno') return L;
  return RADIO[n](L);
}
probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => Math.abs(a - b) < 1e-7 });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
  });
}

test('los módulos se escriben como entero o k√n', () => {
  for (let s = 0; s < 300; s++) for (const a of gen.generar(s).alternativas) assert.ok(!/,\d/.test(a.texto), a.texto);
});
