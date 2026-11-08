// Pruebas del generador G2 (componentes con notables): casos.json (verificados aparte, a ciegas)
// y un recálculo independiente con la tabla de academia en cada uno de 600 problemas.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// Seno y coseno de academia por cuadrante: se reduce al primer cuadrante y se usa la tabla.
const T = { 0: [1, 0], 30: [Math.sqrt(3) / 2, 0.5], 37: [0.8, 0.6], 45: [Math.SQRT1_2, Math.SQRT1_2], 53: [0.6, 0.8], 60: [0.5, Math.sqrt(3) / 2], 90: [0, 1] };
function cs(t) {
  const q = Math.floor(t / 90), r = t % 90;
  let [c, s] = T[r];
  for (let k = 0; k < q; k++) [c, s] = [-s, c];
  return [c, s];
}
function resultante(d) {
  let x = 0, y = 0;
  d.vectores.forEach((w, i) => { const [c, s] = cs(w.angulo); x += d.coef[i] * w.m * c; y += d.coef[i] * w.m * s; });
  return [x, y];
}
function recalcular(p) {
  const d = p._datos, [x, y] = resultante(d);
  if (d.tipo !== 'angulo') return Math.hypot(x, y);
  // El ángulo notable cuyo seno y coseno de academia apuntan como (x, y).
  const R = Math.hypot(x, y);
  for (let t = 0; t < 360; t++) {
    const r = t % 90; if (!T[r]) continue;
    const [c, s] = cs(t);
    if (Math.abs(c - x / R) < 1e-9 && Math.abs(s - y / R) < 1e-9) return t;
  }
  return NaN;
}
probarGenerador(gen, { semillas: 600, recalcular });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
  });
}

test('salen los tres tipos, las cuatro familias y los puntos cardinales', () => {
  const tipos = new Set(), fams = new Set(); let card = 0, eq = 0;
  for (let s = 0; s < 400; s++) {
    const d = gen.generar(s)._datos; tipos.add(d.tipo); fams.add(d.fam); card += d.cardinal; eq += d.equilibrio;
  }
  assert.equal(tipos.size, 3); assert.equal(fams.size, 4); assert.ok(card > 10 && eq > 10);
});

test('los módulos se escriben como entero o k√n, sin decimales', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    if (p._datos.tipo === 'angulo') continue;
    for (const a of p.alternativas) assert.ok(!/,\d/.test(a.texto), `semilla ${s}: ${a.texto}`);
  }
});
