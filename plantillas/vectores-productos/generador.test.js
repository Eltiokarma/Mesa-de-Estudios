// Pruebas del generador G3 (producto escalar y vectorial): casos.json (verificados aparte, a ciegas)
// y un recálculo independiente en cada uno de 600 problemas.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// Productos con la regla del determinante 3 × 3 (otro camino que el del generador).
const cruz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const largo = a => Math.hypot(...a);
const COS = { 37: 0.8, 53: 0.6, 127: -0.6, 143: -0.8, 60: 0.5, 120: -0.5, 30: Math.sqrt(3) / 2, 150: -Math.sqrt(3) / 2 };
function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'escalar') return largo([d.a[0] + d.b[0], d.a[1] + d.b[1], d.a[2] + d.b[2]]) ** 2 / 2 - (largo(d.a) ** 2 + largo(d.b) ** 2) / 2; // polarización
  if (d.tipo === 'angulo') {
    const c = 1 - largo([d.a[0] - d.b[0], d.a[1] - d.b[1], d.a[2] - d.b[2]]) ** 2 / (2 * largo(d.a) * largo(d.b)) + (largo(d.a) - largo(d.b)) ** 2 / (2 * largo(d.a) * largo(d.b));
    for (const [t, v] of Object.entries(COS)) if (Math.abs(v - c) < 1e-9) return Number(t);
    return NaN;
  }
  if (d.tipo === 'perpendicular') return -(d.a[0] * d.b[0] + d.a[2] * d.b[2]) / d.b[1];
  if (d.tipo === 'vectorial-z') return cruz(d.a, d.b)[2];
  if (d.tipo === 'modulo-cruz') return d.A * d.B * Math.sqrt(1 - COS[d.t] ** 2);
  // área por la fórmula de Herón
  const [P0, Q, S] = d.pts;
  const l = (u, w) => Math.hypot(u[0] - w[0], u[1] - w[1]);
  const x = l(P0, Q), y = l(Q, S), z = l(S, P0), s = (x + y + z) / 2;
  return Math.sqrt(Math.max(0, s * (s - x) * (s - y) * (s - z)));
}
probarGenerador(gen, { semillas: 600, recalcular: p => {
  const r = recalcular(p);
  return Math.abs(r - p.respuesta.valor) < 1e-6 ? p.respuesta.valor : r; // Herón pierde precisión
} });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
  });
}

test('salen los seis tipos y hay respuestas negativas', () => {
  const tipos = new Set(); let neg = 0;
  for (let s = 0; s < 300; s++) { const p = gen.generar(s); tipos.add(p._datos.tipo); if (p.respuesta.valor < 0) neg++; }
  assert.equal(tipos.size, 6); assert.ok(neg > 10);
});
