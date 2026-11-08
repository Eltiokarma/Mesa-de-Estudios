// Pruebas del generador «El reloj que viaja»: casos.json (calculados aparte), un recálculo
// independiente en cada uno de 600 problemas y la hoja de lápiz y papel.
// Caminos independientes: el factor de Lorentz no se toma de la fórmula sino de un reloj de luz
// (un pulso que va y vuelve entre dos espejos: visto desde la estación recorre la diagonal, y el
// tic se busca por bisección); la longitud sale de transformar los extremos con la rapidez
// (cosh y senh de la rapidez φ = atanh β) en un mismo instante de la Tierra; la energía cinética, de
// integrar K = ∫ v·dp en p, con v(p) despejada de p = m·v/√(1 − v²/c²), en 20 000 pasos (Simpson); la esfera, de buscar por bisección la
// carga con la que el trabajo para llevar un electrón de la superficie al infinito es Kmax.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

const c = 3e8;
function biseccion(g, a, b) {
  let ga = g(a);
  for (let k = 0; k < 200; k++) { const m = (a + b) / 2, gm = g(m); if ((gm > 0) === (ga > 0)) { a = m; ga = gm; } else b = m; }
  return (a + b) / 2;
}
// Reloj de luz con espejos a 1 m: tic propio 2/c. Desde la estación, el pulso recorre la diagonal.
function ticRelojDeLuz(beta) {
  const d = 1, vel = beta * c;
  return biseccion(T => c * T / 2 - Math.hypot(d, vel * T / 2), 2 * d / c, 1e3 * d / c);
}
const gammaReloj = beta => ticRelojDeLuz(beta) / (2 / c);
function largoVisto(L0, beta) {
  const phi = Math.atanh(beta);
  const tPrima = -L0 * Math.tanh(phi) / c; // el extremo delantero, en el instante t = 0 de la Tierra
  return L0 * Math.cosh(phi) + c * tPrima * Math.sinh(phi);
}
function cineticaIntegral(m, beta) {
  // K = ∫ v·dp desde el reposo; se integra en p, con v(p) despejada de p = m·v/√(1 − v²/c²).
  const pf = m * beta * c / Math.sqrt(1 - beta * beta);
  const u = p => p * c / Math.sqrt(p * p + (m * c) ** 2);
  const n = 20000, hp = pf / n;
  let s = 0;
  for (let i = 0; i <= n; i++) { const w = i === 0 || i === n ? 1 : i % 2 ? 4 : 2; s += w * u(i * hp); }
  return s * hp / 3;
}
const H = 6.63e-34, hbar = H / (2 * Math.PI), e = 1.6e-19, k = 9e9;
function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'tiempo' && d.sub === 'hora') return d.inicio + d.dt0 * gammaReloj(d.beta);
  if (d.tipo === 'tiempo' && d.sub === 'propio') return d.dt / gammaReloj(d.beta);
  if (d.tipo === 'tiempo') return biseccion(b => gammaReloj(b) - d.gamma, 1e-6, 0.999999);
  if (d.tipo === 'longitud') return d.sub === 'observada' ? largoVisto(d.l, d.beta) : biseccion(L0 => largoVisto(L0, d.beta) - d.l, d.l, 10 * d.l);
  if (d.tipo === 'energia') {
    if (d.sub === 'cinetica') return cineticaIntegral(d.m, d.beta);
    if (d.sub === 'total') return cineticaIntegral(d.m, d.beta) + d.m * c * c;
    if (d.sub === 'razon') return 0.5 * (d.beta * c) ** 2 / cineticaIntegral(1, d.beta);
    return biseccion(b => cineticaIntegral(1, b) - d.k * c * c, 1e-6, 0.999);
  }
  if (d.tipo === 'incertidumbre') return d.sub === 'posicion' ? hbar / (2 * d.m * d.dv) : hbar / (2 * d.dx);
  const Kmax = (d.E - d.phi) * e; // en joules
  if (d.sub === 'potencial') return Kmax / e;
  return biseccion(Q => e * k * Q / d.r - Kmax, 0, 1e-6);
}
const relativo = (a, b) => Math.abs(a - b) <= 1e-6 * Math.max(Math.abs(a), Math.abs(b), 1e-300);
probarGenerador(gen, { semillas: 600, recalcular, igual: relativo });

for (const cs of casos.casos) {
  test(`casos.json: semilla ${cs.semilla}`, () => {
    const p = gen.generar(cs.semilla);
    assert.deepEqual(p._datos, cs.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(Math.abs(p.respuesta.valor - cs.esperado.respuesta) <= casos.tolerancia * Math.abs(cs.esperado.respuesta), `da ${p.respuesta.valor}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, cs.esperado.exacta);
  });
}

test('salen todos los tipos y subtipos', () => {
  const vistos = new Set();
  for (let s = 0; s < 600; s++) { const d = gen.generar(s)._datos; vistos.add(d.tipo + '/' + d.sub); }
  assert.deepEqual([...vistos].sort(), ['energia/cinetica', 'energia/igual', 'energia/razon', 'energia/total', 'esfera/carga', 'esfera/potencial',
    'incertidumbre/momento', 'incertidumbre/posicion', 'longitud/observada', 'longitud/propia', 'tiempo/hora', 'tiempo/propio', 'tiempo/rapidez']);
});

test('todas las alternativas llevan la misma unidad', () => {
  const unidad = t => t.replace(/^[−\d ,:×()/√⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/, '');
  for (let s = 0; s < 600; s++) {
    const alt = gen.generar(s).alternativas;
    assert.equal(new Set(alt.map(a => unidad(a.texto))).size, 1, `semilla ${s}: ${alt.map(a => a.texto)}`);
    for (const a of alt) assert.ok(!/,\d{5}/.test(a.texto), `semilla ${s}: ${a.texto}`);
  }
});

test('los textos no dicen «de el» ni «a el», y no hay «undefined», «null» ni «NaN»', () => {
  const plano = seg => seg.map(x => (typeof x === 'string' ? x : x.t)).join('');
  for (let s = 0; s < 1000; s++) {
    const p = gen.generar(s);
    const todo = [plano(p.enunciado), plano(p.pregunta), ...p.solucion.map(plano), ...p.alternativas.map(a => a.texto), ...p.alternativas.filter(a => a.error).map(a => a.error.explicacion)].join(' ');
    assert.ok(!/\b[Dd]e el\b|\b[Aa] el\b|undefined|null|NaN/.test(todo), `semilla ${s}`);
  }
});

test('la pregunta no revela la respuesta y cada variable usada tiene color', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    const plano = p.pregunta.map(x => (typeof x === 'string' ? x : x.t)).join('');
    assert.ok(!plano.includes(p.respuesta.texto), `semilla ${s}`);
    for (const seg of [...p.enunciado, ...p.pregunta, ...p.solucion.flat()]) if (typeof seg !== 'string') assert.ok(p.variables[seg.v] && p.variables[seg.v].color, `semilla ${s}: ${seg.v} sin color`);
  }
});

// ---------- lápiz y papel ----------
const gamma = b => 1 / Math.sqrt(1 - b * b);
const CALC = {
  dilatacion: ([dt0, b]) => dt0 * gamma(b),
  propio: ([dt, b]) => dt / gamma(b),
  contraccion: ([L0, b]) => L0 / gamma(b),
  rapidez: ([g]) => Math.sqrt(1 - 1 / (g * g)),
  cinetica: ([m, b]) => (gamma(b) - 1) * m * c * c,
  razon: ([b]) => 0.5 * b * b / (gamma(b) - 1),
  incertidumbre: ([dp]) => H / (4 * Math.PI * dp),
  potencial: ([E, phi]) => E - phi,
  carga: ([R, V]) => R * V / k,
};
test('papel.json: 5 a 10 problemas bien armados y verificados', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  assert.equal(new Set(papel.problemas.map(q => q.id)).size, papel.problemas.length);
  for (const q of papel.problemas) {
    for (const kk of ['id', 'nivel', 'enunciado', 'respuesta']) assert.ok(q[kk] !== undefined && q[kk] !== '', `${q.id}: falta ${kk}`);
    assert.ok(Array.isArray(q.pasos) && q.pasos.length, `${q.id}: sin pasos`);
    assert.ok(Array.isArray(q.verificar) && q.verificar.length, `${q.id}: sin verificar`);
    for (const t of [q.enunciado, q.respuesta, ...q.pasos]) assert.ok(!/<[a-z/][^>]*>/i.test(t), `${q.id}: tiene HTML`);
    for (const ver of q.verificar) {
      assert.ok(CALC[ver.tipo], `${q.id}: tipo ${ver.tipo} desconocido`);
      const x = CALC[ver.tipo](ver.args);
      assert.ok(Math.abs(x - ver.espera) <= 1e-3 * Math.abs(ver.espera), `${q.id}: ${ver.tipo} da ${x}, espera ${ver.espera}`);
    }
  }
});
