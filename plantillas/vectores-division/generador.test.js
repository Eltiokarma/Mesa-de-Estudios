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

// Recuadro «Datos» (docs/plan-calidad.md, contrato, punto 13): datos y fórmulas en una lista, una por línea, en texto
// plano y cortas (22 palabras o menos). El generador dice qué se puede usar; el alumno decide qué usa.
test('datos: una lista de líneas cortas en texto plano, en todos los tipos', () => {
  const palabras = t => t.split(/\s+/).filter(w => /\p{L}/u.test(w)).length;
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    assert.ok(Array.isArray(p.datos) && p.datos.length, `semilla ${s}: datos debe ser una lista no vacía`);
    for (const l of p.datos) {
      assert.ok(typeof l === 'string' && l.trim() === l && l.length, `semilla ${s}: línea vacía o con espacios`);
      assert.ok(palabras(l) <= 22, `semilla ${s}: «${l}» tiene ${palabras(l)} palabras`);
      assert.ok(!/<[a-z/]|\bnull\b|\bNaN\b|\bundefined\b|\d\.\d/i.test(l), `semilla ${s}: «${l}»`);
    }
    assert.equal(new Set(p.datos).size, p.datos.length, `semilla ${s}: líneas repetidas`);
    revisarDatos(p, p.datos.join('\n'), s);
  }
});

function revisarDatos(p, d, s) {
  const x = p._datos;
  if (x.tipo === 'division') assert.ok(d.includes('m/(m + n)'), `semilla ${s}: falta cómo se parte el segmento`);
  if (x.tipo === 'baricentro') assert.ok(d.includes('2/3'), `semilla ${s}: falta dónde está el baricentro`);
  // Nunca la respuesta: la combinación pedida no aparece en los datos.
  assert.ok(!d.includes(p.respuesta.texto), `semilla ${s}: los datos dicen la respuesta`);
}
