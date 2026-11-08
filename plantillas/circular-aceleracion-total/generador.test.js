// Pruebas del generador G5 (aceleración total): casos.json (verificados aparte, a ciegas) y un
// recálculo independiente en cada uno de 600 problemas.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// Camino independiente: en vez de despejar con seno, coseno y tangente, se busca por bisección el
// valor que hace que el vector a = (aT, acp) forme con la velocidad, (1, 0), el ángulo dado (con
// atan2). Los ángulos de 37° y 53° son los de academia: los del triángulo 3-4-5. En los tipos
// cinemáticos, se busca el instante por bisección en las ecuaciones de movimiento.
const ANG = { 37: Math.atan2(3, 4), 53: Math.atan2(4, 3), 30: Math.PI / 6, 45: Math.PI / 4, 60: Math.PI / 3 };
function biseccion(g, a, b) {
  let ga = g(a);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2, gm = g(m);
    if ((gm > 0) === (ga > 0)) { a = m; ga = gm; } else b = m;
  }
  return (a + b) / 2;
}
function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'radio') return biseccion(R => Math.atan2(d.v * d.v / R, d.at) - ANG[d.angulo], 1e-3, 1e5);
  if (d.tipo === 'componentes') {
    const acp = d.v * d.v / d.r;
    const at = biseccion(x => Math.atan2(acp, x) - ANG[d.angulo], 1e-9, 1e6);
    return d.pide === 'at' ? at : Math.hypot(at, acp);
  }
  if (d.tipo === 'reposo') {
    const R = d.r, al = d.alfa;
    const omega = t => al * t, theta = t => al * t * t / 2;
    if (d.sub === 'theta') { const t = biseccion(t => omega(t) ** 2 * R - d.razon * al * R, 0, 1e3); return theta(t); }
    const t = biseccion(t => theta(t) - d.theta, 0, 1e3);
    return omega(t) ** 2 * R / (al * R);
  }
  if (d.sub === 'instante') {
    let w = d.omega0; const n = 1000, dt = d.t / n;
    for (let i = 0; i < n; i++) w += d.alfa * dt;
    return w * w * d.r;
  }
  // inicial: el auto avanza por el arco; se busca el instante en que recorrió s = θ·r.
  const s = t => d.v0 * t + d.at * t * t / 2;
  const t = biseccion(t => s(t) - d.theta * d.r, 0, 1e3);
  const vel = d.v0 + d.at * t, acp = vel * vel / d.r;
  return d.sub === 'modulo' ? Math.hypot(d.at, acp) : acp;
}
probarGenerador(gen, { semillas: 600, recalcular: p => {
  const r = recalcular(p);
  return Math.abs(r - p.respuesta.valor) < 1e-8 * Math.max(1, Math.abs(r)) ? p.respuesta.valor : r;
} });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

test('salen los cuatro tipos con sus variantes y los cinco ángulos; las alternativas llevan la misma unidad', () => {
  const vistos = new Set(), angulos = new Set();
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    vistos.add(d.tipo + '/' + (d.sub || d.pide || '')); if (d.angulo) angulos.add(d.angulo);
    const alt = p.alternativas;
    assert.ok(alt.every(a => !a.texto.includes('π')), `semilla ${s}: una alternativa con π`);
    const unidad = a => a.texto.replace(/^[\d ,√/]+/, '');
    assert.equal(new Set(alt.map(unidad)).size, 1, `semilla ${s}: unidades distintas (${alt.map(a => a.texto)})`);
    for (const a of alt) assert.ok(!/\d,\d{3}/.test(a.texto), `semilla ${s}: más de dos decimales (${a.texto})`);
  }
  assert.deepEqual([...vistos].sort(), ['componentes/a', 'componentes/at', 'inicial/acp', 'inicial/instante', 'inicial/modulo', 'radio/', 'reposo/tangente', 'reposo/theta']);
  assert.deepEqual([...angulos].sort(), [30, 37, 45, 53, 60]);
});

test('con 37° y 53° no salen raíces; con raíces, todas son exactas', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.angulo === 37 || d.angulo === 53) assert.ok(p.alternativas.every(a => !a.texto.includes('√')), `semilla ${s}`);
    for (const a of p.alternativas) if (a.texto.includes('√')) assert.ok(Math.abs(a.valor ** 2 * 4 - Math.round(a.valor ** 2 * 4)) < 1e-6, `semilla ${s}: ${a.texto}`);
  }
});
