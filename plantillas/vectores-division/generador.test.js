// Pruebas del generador G6 (un vector en función de otros): casos.json (verificados aparte, a
// ciegas) y un recálculo independiente con las fórmulas de academia en cada uno de 600 problemas.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const P = require('../../nucleo/predicciones.js');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

const ab = (p, q) => P.combinacion([p, q], ['a', 'b']).clave;
const uw = (p, q) => P.combinacion([p, q], ['u', 'w']).clave;
const PARALELOGRAMO = { // A(0), B(a), C(a + b), D(b)
  'AM-CD': ab([1, 2], 1), 'AM-BC': ab(1, [1, 2]), 'BM-CD': ab([-1, 2], 1), 'DM-BC': ab(1, [-1, 2]), 'AM-tercio': ab(1, [1, 3]),
};
function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'division') return ab([d.n, d.m + d.n], [d.m, d.m + d.n]); // pesos cruzados
  if (d.tipo === 'baricentro') return d.variante === 'AG' ? uw([1, 3], [1, 3]) : d.variante === 'GM' ? uw([1, 6], [1, 6]) : uw([1, 2], [1, 2]);
  if (d.tipo === 'trapecio') return d.diagonales ? ab([1, 2], [-1, 2]) : ab([1, 2], [1, 2]);
  return PARALELOGRAMO[d.caso];
}
probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => a === b });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(p.respuesta.texto, c.esperado.respuesta);
  });
}

test('pesos derechos y semisuma salen como distractores cuando corresponde', () => {
  let derechos = 0, semisuma = 0;
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas) {
      if (a.error && a.error.id === 'VE-pesos-derechos') derechos++;
      if (a.error && a.error.id === 'VE-semisuma-por-semidiferencia') semisuma++;
    }
  }
  assert.ok(derechos > 20 && semisuma > 20);
});
