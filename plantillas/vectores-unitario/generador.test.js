// Pruebas del generador G4 (vector unitario): casos.json (verificados aparte, a ciegas) y un
// recálculo independiente en cada uno de 600 problemas. La respuesta es una clave de armarTexto.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const P = require('../../nucleo/predicciones.js');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// El módulo entero se busca probando, no con Math.hypot.
function moduloEntero(c) {
  const s = c.reduce((t, x) => t + x * x, 0);
  for (let r = 1; r * r <= s; r++) if (r * r === s) return r;
  throw new Error('módulo no entero: ' + c);
}
const sobre = (c, d) => P.vector(c.map(x => [x, d])).clave;
function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'unitario') return sobre(d.c, moduloEntero(d.c));
  if (d.tipo === 'con-modulo') return sobre(d.c.map(x => (d.anti ? -1 : 1) * d.k * x), moduloEntero(d.c));
  if (d.tipo === 'constante') { const f = P.frac(1, moduloEntero(d.c)); return `num:${f.n}/${f.d}`; }
  if (d.tipo === 'unitario-suma') { const s = d.a.map((x, i) => x + d.b[i]); return sobre(s, moduloEntero(s)); }
  return sobre([d.q, d.p], moduloEntero([d.q, d.p])); // recta: dirección (1; p/q) escalada por q
}
probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => a === b });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(p.respuesta.texto, c.esperado.respuesta);
  });
}

test('salen los cinco tipos, y el unitario de la suma muestra la suma de unitarios cuando se puede', () => {
  const tipos = new Set(); let sumaUnit = 0;
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s); tipos.add(p._datos.tipo);
    if (p.alternativas.some(a => a.error && a.error.id === 'VE-suma-de-unitarios')) sumaUnit++;
  }
  assert.equal(tipos.size, 5); assert.ok(sumaUnit > 0);
});
