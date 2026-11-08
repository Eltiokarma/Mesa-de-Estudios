// Pruebas del generador G5 (combinación lineal y condiciones): casos.json (verificados aparte, a
// ciegas) y un recálculo independiente en cada uno de 600 problemas (clave de armarTexto).
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const P = require('../../nucleo/predicciones.js');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'en-funcion') {
    // Regla de Cramer: m = det(C, B)/det(A, B) y n = det(A, C)/det(A, B).
    const det = (u, w) => u[0] * w[1] - u[1] * w[0];
    const D = det(d.A, d.B);
    return P.combinacion([[det(d.C, d.B), D], [det(d.A, d.C), D]], ['A', 'B']).clave;
  }
  if (d.tipo === 'suma-diferencia') {
    const s = d.pideA ? 1 : -1;
    return P.vector(d.S.map((x, i) => [x + s * d.D[i], 2])).clave;
  }
  // paralelo: el producto cruzado a·c − t·b = 0.
  const f = P.frac(d.a * d.c, d.b);
  return `num:${f.n}/${f.d}`;
}
probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => a === b });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(p.respuesta.texto, c.esperado.respuesta);
  });
}

test('salen los tres tipos', () => {
  const tipos = new Set(); for (let s = 0; s < 200; s++) tipos.add(gen.generar(s)._datos.tipo);
  assert.equal(tipos.size, 3);
});
