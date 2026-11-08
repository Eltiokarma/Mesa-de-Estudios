// Pruebas del generador «La manguera y el caño»: casos.json (verificados aparte), un recálculo independiente en cada
// uno de 600 problemas, todos los tipos, unidades parejas, «de el», y papel.json recalculado aquí.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

const g = 10, AGUA = 1000, HG = 13600;
// Camino independiente: no se usan las fórmulas cerradas del generador. El caudal se piensa como cuánto tarda el agua
// en recorrer un metro de tubo; la continuidad, como un trozo de agua que pasa de una sección a otra (con π de verdad,
// que se cancela); Bernoulli, como el teorema del trabajo y la energía sobre ese trozo; Torricelli, como una caída libre
// cuyo tiempo se busca por bisección; el barómetro, sumando capas de aire de 1 m.
function biseccion(fn, a, b) {
  let fa = fn(a);
  for (let i = 0; i < 200; i++) { const m = (a + b) / 2, fm = fn(m); if ((fm > 0) === (fa > 0)) { a = m; fa = fm; } else b = m; }
  return (a + b) / 2;
}
const tiempoCaida = y => biseccion(t => 0.5 * g * t * t - y, 0, 10);
const rapidezCaida = hh => g * tiempoCaida(hh);
const areaPi3 = Dm => 3 * (Dm / 2) * (Dm / 2);
// Un trozo de agua de volumen dV entra por A1 a v1: en la sección A2 ocupa dV/A2 de largo en el mismo tiempo.
function trozo(A1, v1, A2) { const dt = 1e-3, dV = A1 * v1 * dt; return (dV / A2) / dt; }
// Trabajo y energía sobre el trozo: (P1 − P2)·dV − ρ·g·Δh·dV = ½·ρ·dV·(v2² − v1²) → P2 (Pa).
function trabajoEnergia(P1, v1, v2, dh = 0) { const dV = 1e-3, m = AGUA * dV; const dK = 0.5 * m * (v2 * v2 - v1 * v1), dU = m * g * dh; return P1 - (dK + dU) / dV; }

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'caudal') {
    const A = areaPi3(d.D_cm / 100);
    if (d.sub === 'rapidez') { const Q = d.uQ === 'L/min' ? d.Q / 1000 / 60 : d.Q / 1000; const tUnMetro = (A * 1) / Q; return 1 / tUnMetro; }
    if (d.sub === 'ducto') { const Q = d.V_m3 / (d.t_min * 60); return 1 / ((A * 1) / Q); }
    // llenado: se suma segundo a segundo lo que entra
    const Q = A * d.v * 1000; let V = 0, s = 0;
    while (V < d.V_L - 1e-6) { V += Q; s++; }
    return s / 60;
  }
  if (d.tipo === 'continuidad') {
    const A = D => Math.PI * D * D / 4;
    if (d.sub === 'diametros') return trozo(A(d.D1_cm), d.v1, A(d.D2_cm));
    return trozo(Math.PI * d.r1_cm ** 2, d.v1, Math.PI * d.r2_cm ** 2);
  }
  if (d.tipo === 'bernoulli') {
    if (d.sub === 'velocidad') {
      const dP = (d.P1 - d.P2) * 1000, n = d.razonAreas;
      return biseccion(v2 => 0.5 * AGUA * (v2 * v2 - (v2 / n) ** 2) - dP, 0, 100);
    }
    if (d.sub === 'caudal') {
      const v1 = d.Q_Ls / 1000 / (d.A1_cm2 / 10000), v2 = trozo(d.A1_cm2, v1, d.A2_cm2);
      return trabajoEnergia(d.P1 * 1000, v1, v2) / 1000;
    }
    const n = d.sub === 'presion' && d.porDiametro ? 4 : d.razonAreas;   // diámetro a la mitad: área a la cuarta parte
    const v2 = trozo(n, d.v1, 1);
    return trabajoEnergia(d.P1 * 1000, d.v1, v2, d.sub === 'sube' ? d.dh : 0) / 1000;
  }
  if (d.tipo === 'torricelli') {
    const hh = d.H - d.y, vs = rapidezCaida(hh);
    if (d.sub === 'rapidez') return vs;
    const t = tiempoCaida(d.y);
    if (d.sub === 'alcance') return vs * t;
    if (d.sub === 'llegada') return Math.hypot(vs, g * t);
    return Math.atan2(g * t, vs) * 180 / Math.PI;
  }
  if (d.tipo === 'densidad') {
    if (d.sub === 'peso-especifico') return (d.m_g / 1000 * g) / (d.V_cm3 * 1e-6);
    return (d.W_N / g) / (d.V_L / 1000);
  }
  // barometro
  if (d.sub === 'columna') return biseccion(hc => HG * g * hc - d.P_Pa, 0, 2) * 100;
  if (d.sub === 'comparar') { let dP = 0; for (let z = 0; z < d.z_m; z++) dP += d.rhoAire * g * 1; return d.h0_cm - dP / (HG * g) * 100; }
  const Patm = HG * g * d.h_cm / 100 / 1000;
  return d.sub === 'absoluta' ? d.Pman_kPa + Patm : d.Pabs_kPa - Patm;
}
probarGenerador(gen, { semillas: 600, recalcular: p => {
  const r = recalcular(p);
  return Math.abs(r - p.respuesta.valor) < 1e-6 * Math.max(1, Math.abs(r)) ? p.respuesta.valor : r;
} });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia * Math.max(1, Math.abs(c.esperado.respuesta)), `da ${p.respuesta.valor}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

test('salen todos los tipos y subtipos; las alternativas llevan la misma unidad', () => {
  const vistos = new Set();
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s), d = p._datos;
    vistos.add(d.tipo + '/' + d.sub);
    const unidad = a => a.texto.replace(/^[−\d ,√/]+/, '');
    assert.equal(new Set(p.alternativas.map(unidad)).size, 1, `semilla ${s}: unidades distintas (${p.alternativas.map(a => a.texto)})`);
    for (const a of p.alternativas) assert.ok(!/\d,\d{4}/.test(a.texto), `semilla ${s}: demasiados decimales (${a.texto})`);
    const c = p.alternativas.find(a => a.correcta);
    assert.ok(!/\d,\d{3}/.test(c.texto), `semilla ${s}: la correcta con más de dos decimales (${c.texto})`);
  }
  const esperados = gen.TIPOS.map(([t, s]) => t + '/' + s);
  assert.deepEqual([...vistos].sort(), [...new Set(esperados)].sort());
});

test('la pregunta no dice la respuesta y cada variable tiene un solo color', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    const plano = seg => seg.map(x => (typeof x === 'string' ? x : x.t)).join('');
    const c = p.alternativas.find(a => a.correcta).texto;
    if (p._datos.sub === 'angulo') continue;   // el enunciado nombra los cuatro notables (30°, 37°, 53° y 60°), sin señalar uno
    const re = new RegExp('(^|[^\\d,√])' + c.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&'));
    assert.ok(!re.test(plano(p.enunciado)) && !re.test(plano(p.pregunta)), `semilla ${s}: el enunciado dice ${c}`);
    const colores = Object.values(p.variables).map(x => x.color);
    assert.equal(new Set(colores).size, colores.length, `semilla ${s}: dos variables con el mismo color`);
    for (const parte of [p.enunciado, p.pregunta, ...p.solucion]) for (const x of parte) if (typeof x !== 'string') assert.ok(p.variables[x.v], `semilla ${s}: variable ${x.v} sin color`);
  }
});

test('los textos no dicen «de el» ni «a el»', () => {
  const plano = seg => seg.map(x => (typeof x === 'string' ? x : x.t)).join('');
  for (let s = 0; s < 1000; s++) {
    const p = gen.generar(s);
    const todo = [plano(p.enunciado), plano(p.pregunta), ...p.solucion.map(plano), ...p.alternativas.filter(a => a.error).map(a => a.error.explicacion)].join(' ');
    assert.ok(!/\b[Dd]e el\b|\b[Aa] el\b/.test(todo), `semilla ${s}`);
  }
});

test('Bernoulli: donde el agua va más rápido la presión es menor; Torricelli: el chorro nunca sale más rápido que la caída desde la superficie', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.tipo === 'bernoulli' && (d.sub === 'presion' || d.sub === 'caudal')) assert.ok(p.respuesta.valor < d.P1, `semilla ${s}`);
    if (d.tipo === 'torricelli' && d.sub === 'rapidez') assert.ok(p.respuesta.valor < Math.sqrt(2 * g * d.H), `semilla ${s}`);
  }
});

// ---------- papel.json (regla 6) ----------
const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
// Cálculos propios de la prueba, uno por tipo de verificación.
const CALC = {
  'caudal-rapidez': a => ({ v: a.Q_m3s / (a.pi * (a.D_m / 2) ** 2) }),
  'llenado': a => ({ t_s: a.V_m3 / (a.pi * (a.D_m / 2) ** 2 * a.v) }),
  'continuidad': a => ({ v2: a.v1 * (a.D1 * a.D1) / (a.D2 * a.D2) }),
  'continuidad-areas': a => ({ v2: a.v1 * a.A1 / a.A2 }),
  'bernoulli-horizontal': a => ({ P2: a.P1 + 0.5 * a.rho * (a.v1 * a.v1 - a.v2 * a.v2) }),
  'torricelli-alcance': a => { const v = Math.sqrt(2 * a.g * a.h), t = Math.sqrt(2 * a.y / a.g); return { v, t, x: v * t }; },
  'peso-especifico': a => ({ rho: a.m_kg / a.V_m3, gamma: a.m_kg * a.g / a.V_m3 }),
  'barometro': a => ({ P: a.rho * a.g * a.h }),
  'ducto': a => ({ v: a.V_m3 / (a.t_s * a.pi * (a.D_m / 2) ** 2) }),
};
test('papel.json: entre 5 y 10 problemas, ids únicos, texto plano, pasos y verificación', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10, `${papel.problemas.length} problemas`);
  const ids = new Set();
  for (const p of papel.problemas) {
    assert.ok(p.id && !ids.has(p.id), `id repetido: ${p.id}`); ids.add(p.id);
    assert.ok(p.nivel && p.enunciado && p.respuesta && Array.isArray(p.pasos) && p.pasos.length, `${p.id}: falta texto`);
    assert.ok(Array.isArray(p.verificar) && p.verificar.length, `${p.id}: falta verificar`);
    assert.ok(!/<[a-z]/i.test(p.enunciado + p.respuesta + p.pasos.join('')), `${p.id}: sin HTML`);
  }
});
for (const p of papel.problemas) test(`papel ${p.id}: la respuesta coincide con un cálculo propio`, () => {
  for (const ver of p.verificar) {
    assert.ok(CALC[ver.tipo], `${p.id}: tipo desconocido ${ver.tipo}`);
    const r = CALC[ver.tipo](ver.args);
    for (const [k, e] of Object.entries(ver.espera)) assert.ok(Math.abs(r[k] - e) <= 1e-9 * Math.max(1, Math.abs(e)), `${p.id} · ${k}: da ${r[k]}, se esperaba ${e}`);
  }
});
