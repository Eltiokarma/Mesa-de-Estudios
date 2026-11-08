// Pruebas del generador G3 (MCUV con tres datos): casos.json (verificados aparte, a ciegas) y un
// recálculo independiente en cada uno de 600 problemas.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// Camino independiente: se simula el giro paso a paso (en rad y s) y lo que falta se busca por
// bisección, sin usar las fórmulas del MCUV. Si el freno lo detiene dentro de un paso, se corta ahí.
const PASOS = 400;
function simular(w0, alfa, T, freno = false) {
  let w = w0, th = 0;
  const dt = T / PASOS;
  for (let i = 0; i < PASOS; i++) {
    const w2 = w + alfa * dt;
    if (freno && w2 < 0) { const tau = -w / alfa; th += w * tau / 2; return { w: 0, th }; }
    th += (w + w2) / 2 * dt;
    w = w2;
  }
  return { w, th };
}
function biseccion(g, a, b) { // g(a) y g(b) con signos distintos
  let ga = g(a);
  for (let i = 0; i < 200; i++) {
    const m = (a + b) / 2, gm = g(m);
    if ((gm > 0) === (ga > 0)) { a = m; ga = gm; } else b = m;
  }
  return (a + b) / 2;
}
// Rapidez del modo a rad/s y ángulo en rad a la unidad en que se pregunta.
const aRad = (modo, x) => (modo === 'rad' ? x : modo === 'rpm' ? x * 2 * Math.PI / 60 : x * Math.PI);
const deRad = (modo, th) => (modo === 'rad' ? th : th / (2 * Math.PI));
const anguloARad = (modo, th) => (modo === 'rad' ? th : th * 2 * Math.PI);

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'angulo') {
    const w1 = aRad(d.modo, d.w1), w2 = aRad(d.modo, d.w2), dt = d.t2 - d.t1;
    const al = biseccion(a => simular(w1, a, dt).w - w2, -1e4, 1e4);
    return deRad(d.modo, simular(w1, al, dt).th);
  }
  if (d.tipo === 'frenado') {
    const w0 = aRad(d.modo, d.w0), al = d.modo === 'rad' ? d.alfa : d.alfa * Math.PI;
    return deRad(d.modo, simular(w0, -al, d.t, true).th);
  }
  if (d.tipo === 'tiempo') {
    const w1 = aRad(d.modo, d.w1), w2 = aRad(d.modo, d.w2), th = anguloARad(d.modo, d.theta);
    return biseccion(t => simular(w1, (w2 - w1) / t, t).th - th, 1e-6, 1e4);
  }
  if (d.tipo === 'alfa' && d.sub === 'intervalo') {
    const al = biseccion(a => simular(d.w1, a, d.t2 - d.t1).w - d.w2, -1e4, 1e4);
    return Math.abs(al);
  }
  if (d.tipo === 'alfa') {
    // Para cada |α|, el tiempo que tarda en pasar de ω1 a ω2 y lo que gira en ese tiempo.
    const s = Math.sign(d.w2 - d.w1);
    const giro = a => simular(d.w1, s * a, Math.abs(d.w2 - d.w1) / a).th - d.theta;
    return biseccion(giro, 1e-6, 1e5);
  }
  // tramos
  const al = d.modo === 'rad' ? d.alfa : d.alfa * Math.PI;
  const t1 = simular(0, al, d.t1), t2 = simular(t1.w, 0, d.t2), t3 = simular(t2.w, -t2.w / d.t3, d.t3);
  return deRad(d.modo, t1.th + t2.th + t3.th);
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

test('salen los cinco tipos y los tres modos, y las alternativas llevan la misma unidad', () => {
  const tipos = new Set(), modos = new Set();
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s); tipos.add(p._datos.tipo); if (p._datos.modo) modos.add(p._datos.modo);
    const alt = p.alternativas;
    const unidad = a => a.texto.replace(/^[\d ,]+/, '').replace(/^vuelta$/, 'vueltas');
    assert.equal(new Set(alt.map(unidad)).size, 1, `semilla ${s}: unidades distintas (${alt.map(a => a.texto)})`);
    assert.ok(alt.every(a => !a.texto.includes('π')), `semilla ${s}: una alternativa con π`);
    for (const a of alt) assert.ok(!/\d,\d{3}/.test(a.texto), `semilla ${s}: más de dos decimales (${a.texto})`);
  }
  assert.deepEqual([...tipos].sort(), ['alfa', 'angulo', 'frenado', 'tiempo', 'tramos']);
  assert.deepEqual([...modos].sort(), ['pi', 'rad', 'rpm']);
});

test('en el frenado, la rueda se detiene antes del tiempo que se pregunta', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.tipo === 'frenado') assert.ok(d.w0 / d.alfa < d.t, `semilla ${s}`);
  }
});
