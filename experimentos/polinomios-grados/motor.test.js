const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('./motor.js');
const casos = require('./casos.json');
const ejercicios = require('./ejercicios.js');
const papel = require('./papel.json').ejercicios;
for (const c of casos.polinomios) test(c.id, () => {
  const entrada = structuredClone(c.entrada), r = M.analizar(entrada);
  for (const [k, v] of Object.entries(c.esperado)) assert.deepEqual(r[k], v);
  assert.deepEqual(entrada, c.entrada);
  assert.deepEqual(M.analizar([...entrada].reverse()), r);
});
test('familia: dominio y grados, sin redondeo', () => {
  const c = casos.familia, r = M.explorar(c.entrada, c.desde, c.hasta);
  assert.deepEqual(r.valores, c.valores);
  assert.deepEqual(r.filas.filter(f => f.admisible).map(f => f.analisis.grado), c.grados);
  assert.equal(r.filas[0].analisis, null);
  assert.ok(r.filas[0].motivos.some(m => m.includes('negativo')));
  assert.ok(r.filas[5].motivos.some(m => m.includes('no es entero')));
});
test('entrada inválida y límites exactos', () => {
  for (const x of [-1, 0.5, NaN, Infinity, '2', 1001]) assert.throws(() => M.analizar([{ c: 1, x, y: 0 }]));
  assert.throws(() => M.analizar([{ c: Number.MAX_SAFE_INTEGER, x: 0, y: 0 },{ c: 1, x: 0, y: 0 }]));
  assert.throws(() => M.explorar(casos.familia.entrada, 0, 501));
  assert.throws(() => M.explorar([{...casos.familia.entrada[0], c: -1}], 0, 12));
  assert.throws(() => M.explorar([{ c: 1, x: { a: 1, b: 0, d: 0 }, y: { a: 0, b: 0, d: 1 } }], 0, 1));
});
test('los tres ejercicios usan el motor y resultados propios independientes', () => {
  assert.equal(M.analizar(ejercicios[0].terminos).grado, 6);
  assert.equal(M.analizar(ejercicios[1].terminos).grado, 4);
  assert.equal(M.explorar(ejercicios[2].familia, 0, 12).valores.length, 5);
});
for (const p of papel) test(p.id, () => {
  if (p.terminos) assert.equal(M.analizar(p.terminos).grado, p.grado);
  else assert.deepEqual(M.explorar(p.familia, p.desde, p.hasta).valores, p.valores);
});
