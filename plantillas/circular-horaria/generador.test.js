// Pruebas del generador G6 (ecuaciones horarias): casos.json (verificados aparte, a ciegas) y un
// recálculo independiente en cada uno de 600 problemas.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// Camino independiente: no se comparan coeficientes. Se evalúa θ(t) (o S(t)) como función y se
// deriva con diferencias centrales (exactas para un polinomio de segundo grado); el instante en que
// ω = 0 se busca por bisección; lo recorrido se suma en pasos muy cortos, en valor absoluto.
const pos = c => t => c[0] + c[1] * t + c[2] * t * t;
const derivada = (F, t, hh = 1e-3) => (F(t + hh) - F(t - hh)) / (2 * hh);
const segunda = (F, t, hh = 1e-2) => (F(t + hh) - 2 * F(t) + F(t - hh)) / (hh * hh);
function biseccion(g, a, b) {
  let ga = g(a);
  for (let i = 0; i < 200; i++) { const m = (a + b) / 2, gm = g(m); if ((gm > 0) === (ga > 0)) { a = m; ga = gm; } else b = m; }
  return (a + b) / 2;
}
function recorridoNumerico(F, t1, t2, n = 200000) {
  let s = 0, prev = F(t1);
  for (let i = 1; i <= n; i++) { const x = F(t1 + (t2 - t1) * i / n); s += Math.abs(x - prev); prev = x; }
  return s;
}
function recalcular(p) {
  const d = p._datos, F = pos(d.coef);
  if (d.tipo === 'omega') return derivada(F, d.t);
  if (d.tipo === 'alfa') return d.sub === 'theta' ? segunda(F, 1) : segunda(F, 1) / d.r;
  if (d.tipo === 'parada') return biseccion(t => derivada(F, t), 0, 50);
  if (d.tipo === 'girado') return F(d.t2) - F(d.t1);
  if (d.tipo === 'recorrido') return d.sub === 'neto' ? F(d.t2) - F(d.t1) : recorridoNumerico(F, d.t1, d.t2);
  const vel = derivada(F, d.t);
  return vel * vel / d.r;
}
probarGenerador(gen, { semillas: 600, recalcular: p => {
  const r = recalcular(p);
  return Math.abs(r - p.respuesta.valor) < 1e-6 * Math.max(1, Math.abs(r)) ? p.respuesta.valor : r;
} });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

test('salen los seis tipos con sus variantes; las alternativas llevan la misma unidad y salen respuestas negativas', () => {
  const vistos = new Set();
  let negativas = 0;
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    vistos.add(d.tipo + (d.sub ? '/' + d.sub : ''));
    if (p.respuesta.valor < 0) negativas++;
    const alt = p.alternativas;
    const unidad = a => a.texto.replace(/^[−\d ,]+/, '');
    assert.equal(new Set(alt.map(unidad)).size, 1, `semilla ${s}: unidades distintas (${alt.map(a => a.texto)})`);
    for (const a of alt) assert.ok(!/\d,\d{3}/.test(a.texto), `semilla ${s}: más de dos decimales (${a.texto})`);
    if (['parada', 'girado', 'acp'].includes(d.tipo) || d.sub === 'recorrido') assert.ok(alt.every(a => a.valor > 0), `semilla ${s}: magnitud con signo`);
  }
  assert.deepEqual([...vistos].sort(), ['acp', 'alfa/s', 'alfa/theta', 'girado', 'omega', 'parada', 'recorrido/neto', 'recorrido/recorrido']);
  assert.ok(negativas > 20, `solo ${negativas} respuestas negativas`);
});

test('en «girado» no se detiene dentro del intervalo; en «recorrido», sí', () => {
  for (let s = 0; s < 600; s++) {
    const d = gen.generar(s)._datos;
    if (d.tipo !== 'girado' && d.tipo !== 'recorrido') continue;
    const [, b, c] = d.coef, tp = -b / (2 * c);
    const dentro = tp > d.t1 && tp < d.t2;
    assert.equal(dentro, d.tipo === 'recorrido', `semilla ${s}`);
  }
});

test('los textos contraen «de» con el artículo («del punto») y no dicen «de el»', () => {
  const plano = seg => seg.map(x => (typeof x === 'string' ? x : x.t)).join('');
  for (let s = 0; s < 1000; s++) {
    const p = gen.generar(s);
    const todo = [plano(p.enunciado), plano(p.pregunta), ...p.solucion.map(plano), ...p.alternativas.filter(a => a.error).map(a => a.error.explicacion)].join(' ');
    assert.ok(!/\b[Dd]e el\b|\b[Aa] el\b/.test(todo), `semilla ${s}`);
  }
});
