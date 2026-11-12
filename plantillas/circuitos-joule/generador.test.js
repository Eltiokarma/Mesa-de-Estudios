// Pruebas del generador «El foco que calienta»: casos.json (calculados aparte), un recálculo
// independiente en 600 problemas y papel.json. El recálculo va por otro camino: la energía se
// suma segundo a segundo como V·I (con V de Ohm), las incógnitas se buscan por bisección, el agua
// se calienta paso a paso y los cables se resuelven con el motor nodal de plantillas/circuitos-cc/.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const motor = require('../circuitos-cc/motor.js');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

const SI = { mA: 1e-3, A: 1, s: 1, min: 60, h: 3600, J: 1, kJ: 1e3, mm: 1e-3, mm2: 1e-6 };
function biseccion(g, a, b) {
  let ga = g(a);
  for (let i = 0; i < 300; i++) { const m = (a + b) / 2, gm = g(m); if ((gm > 0) === (ga > 0)) { a = m; ga = gm; } else b = m; }
  return (a + b) / 2;
}
// Energía de una corriente constante I por R durante t: se suma V·I en cada segundo (V = I·R).
const energia = (I, R, t) => { let E = 0; const n = Math.round(t); for (let k = 0; k < n; k++) E += (I * R) * I; return E + (t - n) * I * I * R; };
const PI = 3;
const areaCirculo = radio => PI * radio * radio;

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'joule') {
    if (d.sub === 'energia') return energia(d.ImA * SI.mA, d.R, d.tmin * SI.min) / SI[d.unidad];
    if (d.sub === 'corriente') { const E = d.E * (d.kilo ? SI.kJ : 1), t = d.t * SI[d.ut]; return biseccion(I => I * I * d.R * t - E, 0, 100); }
    if (d.sub === 'escala') {
      // Un caso concreto con esa energía inicial: I = 1 A, R = 1 Ω, t = Q0·1000 s; luego se escalan R y t.
      const t0 = d.Q0 * 1000; return energia(1, d.a, d.b * t0) / 1000;
    }
    if (d.sub === 'kwh') return d.P * d.hd * d.dias * SI.h / 3.6e6;
    return energia(d.I, d.R, d.t * SI[d.ut]) * 0.24;
  }
  if (d.tipo === 'agua') {
    // Se calienta en pasos de 0,01 s hasta llegar a T2; potencia útil η·V²/R; c = 4,2 J/(g·°C).
    const Pu = d.eta / 100 * d.V * d.V / d.R, mc = d.m * 1000 * 4.2;
    return biseccion(t => d.T1 + Pu * t / mc - d.T2, 0, 1e6) / 60;
  }
  if (d.tipo === 'resistividad') {
    if (d.sub === 'estirado' || d.sub === 'doblado') {
      // Alambre concreto: L = 1 m, A = 1 m², ρ = R0. Volumen fijo en el estirado; tramos lado a lado en el doblado.
      const L = d.sub === 'estirado' ? d.n : 1 / d.n, A = d.sub === 'estirado' ? 1 / d.n : d.n;
      return d.R0 * L / A;
    }
    // R como suma de rebanadas de 1 cm de largo en serie, cada una de resistencia ρ·dx/A.
    const rebanadas = (rho, L, A) => { let R = 0; const dx = 0.01, n = Math.round(L / dx); for (let k = 0; k < n; k++) R += rho * dx / A; return R; };
    if (d.sub === 'comparar') {
      // Se halla ρ con el primer alambre y se arma el segundo.
      const A = x => (d.diametro ? areaCirculo(x / 2 * SI.mm) : x * SI.mm2);
      const rho = d.R1 * A(d.x1) / d.L1;
      return rebanadas(rho, d.L2, A(d.x2));
    }
    if (d.sub === 'diametro') return rebanadas(d.rho, d.L, areaCirculo(d.d / 2 * SI.mm));
    return biseccion(rho => rebanadas(rho, d.L, areaCirculo(d.r * SI.mm)) - d.R, 0, 1e-3);
  }
  if (d.tipo === 'cables') {
    const Rhilo = d.rho * d.L / (d.Amm * SI.mm2);
    const s = motor.resolver({ tierra: 'n', ramas: [
      { id: 'red', tipo: 'pila', a: 'n', b: 'p', fem: d.V },
      { id: 'ida', tipo: 'resistencia', a: 'p', b: 'x', R: Rhilo },
      { id: 'ap', tipo: 'resistencia', a: 'x', b: 'y', R: d.Rc },
      { id: 'vuelta', tipo: 'resistencia', a: 'y', b: 'n', R: Rhilo }] });
    return d.sub === 'calentador' ? s.ramas.ap.P : s.ramas.ida.P + s.ramas.vuelta.P;
  }
  // carga
  if (d.sub === 'carga') { let Q = 0; for (let k = 0; k < d.tmin * 60; k++) Q += d.ImA * SI.mA; return Q; }
  if (d.sub === 'tiempo') return biseccion(t => d.ImA * SI.mA * t * 60 - d.Q, 0, 1e6);
  const ramas = [];
  for (let k = 0; k < d.n; k++) ramas.push({ id: 'p' + k, tipo: 'pila', a: k === 0 ? 'n' : 'm' + k, b: k === d.n - 1 ? 'p' : 'm' + (k + 1), fem: d.E });
  ramas.push({ id: 'R', tipo: 'resistencia', a: 'p', b: 'n', R: d.R });
  const I = motor.resolver({ tierra: 'n', ramas }).ramas.R.I;
  return d.Q / I / SI.h;
}
probarGenerador(gen, { semillas: 600, recalcular: p => {
  const r = recalcular(p);
  return Math.abs(r - p.respuesta.valor) < 1e-6 * Math.max(1e-12, Math.abs(r)) ? p.respuesta.valor : r;
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
  const unidad = a => a.texto.replace(/^[−\d ,]+(× 10[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+ )?/, '');
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    vistos.add(d.tipo + '/' + d.sub);
    assert.equal(new Set(p.alternativas.map(unidad)).size, 1, `semilla ${s}: unidades distintas (${p.alternativas.map(a => a.texto)})`);
    assert.ok(p.alternativas.every(a => a.valor > 0), `semilla ${s}`);
    if (d.sub === 'rho') assert.ok(p.alternativas.every(a => / × 10/.test(a.texto)), `semilla ${s}: ρ sin notación científica`);
  }
  assert.deepEqual([...vistos].sort(), ['agua/agua', 'cables/calentador', 'cables/perdida', 'carga/carga', 'carga/duracion', 'carga/tiempo',
    'joule/calorias', 'joule/corriente', 'joule/energia', 'joule/escala', 'joule/kwh',
    'resistividad/comparar', 'resistividad/diametro', 'resistividad/doblado', 'resistividad/estirado', 'resistividad/rho']);
});

test('las trampas de unidades aparecen: mA, minutos, diámetro, calorías y el cable de ida y vuelta; ningún distractor fuera de escala', () => {
  const ids = new Set();
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), c = p.respuesta.valor;
    for (const a of p.alternativas) {
      if (a.error) ids.add(a.error.id);
    }
    const vals = p.alternativas.map(a => a.valor);
    assert.ok(Math.max(...vals) / Math.min(...vals) < 60, `semilla ${s}: alternativas fuera de escala (${p.alternativas.map(a => a.texto)})`);
    const sci = p.alternativas.map(a => / × 10/.test(a.texto));
    assert.ok(sci.every(x => x === sci[0]), `semilla ${s}: notaciones mezcladas`);
    for (const a of p.alternativas) assert.ok(!/^0,0?\d? /.test(a.texto) || a.valor >= 0.01, `semilla ${s}: ${a.texto} redondeado de más`);
  }
  for (const id of ['U2-mA', 'U6-min', 'U6-cien', 'U5-al-reves', 'PR6-diametro', 'U5-sin-convertir', 'CAB-un-tramo', 'PR1-cuadrado', 'PR4-seccion', 'PI-no-suma-fem', 'JO-voltaje-fijo'])
    assert.ok(ids.has(id), `no sale ${id}`);
});

test('ninguna semilla de 0 a 2000 (ni «alternativas-N») deja de generar', () => {
  for (const pre of ['', 'alternativas-']) for (let s = 0; s <= 2000; s++) assert.doesNotThrow(() => gen.generar(pre + s), `semilla ${pre}${s}`);
});

test('hay variedad: muchos enunciados distintos', () => {
  const plano = seg => seg.map(x => (typeof x === 'string' ? x : x.t)).join('');
  const vistos = new Set();
  for (let s = 0; s < 600; s++) vistos.add(plano(gen.generar(s).enunciado));
  assert.ok(vistos.size > 540, `solo ${vistos.size} enunciados distintos en 600`);
});

test('la pregunta no dice la respuesta, y los textos no dicen «de el» ni «a el»', () => {
  const plano = seg => seg.map(x => (typeof x === 'string' ? x : x.t)).join('');
  for (let s = 0; s < 1000; s++) {
    const p = gen.generar(s);
    assert.ok(!plano(p.pregunta).includes(p.alternativas.find(a => a.correcta).texto), `semilla ${s}`);
    const todo = [plano(p.enunciado), plano(p.pregunta), ...p.solucion.map(plano), ...p.alternativas.filter(a => a.error).map(a => a.error.explicacion)].join(' ');
    assert.ok(!/\b[Dd]e el\b|\b[Aa] el\b/.test(todo), `semilla ${s}`);
  }
});

// ---- papel.json (regla 6): estructura y recálculo propio de cada «verificar» ----
const CALC = {
  joule: ({ I, R, t }) => energia(I, R, t),                         // en J, con I en A y t en s
  corriente: ({ E, R, t }) => biseccion(I => I * I * R * t - E, 0, 100),
  tiempoAgua: ({ m, dT, Pu }) => biseccion(t => Pu * t - m * 1000 * 4.2 * dT, 0, 1e7), // en s
  resistencia: ({ rho, L, A }) => rho * L / A,                      // todo en el SI
  circulo: ({ radio }) => areaCirculo(radio),
  cables: ({ V, Rc, Rhilo, pide }) => {
    const s = motor.resolver({ tierra: 'n', ramas: [{ id: 'red', tipo: 'pila', a: 'n', b: 'p', fem: V },
      { id: 'ida', tipo: 'resistencia', a: 'p', b: 'x', R: Rhilo }, { id: 'ap', tipo: 'resistencia', a: 'x', b: 'y', R: Rc }, { id: 'vuelta', tipo: 'resistencia', a: 'y', b: 'n', R: Rhilo }] });
    return pide === 'aparato' ? s.ramas.ap.P : s.ramas.ida.P + s.ramas.vuelta.P;
  },
  producto: ({ a, b }) => a * b,
  cociente: ({ a, b }) => a / b,
};
test('papel.json: entre 5 y 10 problemas propios, bien armados y sin HTML', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  assert.equal(new Set(papel.problemas.map(p => p.id)).size, papel.problemas.length);
  for (const p of papel.problemas) {
    assert.ok(p.id && p.nivel && p.enunciado && p.respuesta, p.id);
    assert.ok(Array.isArray(p.pasos) && p.pasos.length >= 2, p.id);
    assert.ok(Array.isArray(p.verificar) && p.verificar.length >= 1, p.id);
    for (const t of [p.enunciado, p.respuesta, ...p.pasos]) assert.ok(!/<[a-z/][^>]*>/i.test(t), `${p.id}: HTML`);
  }
});
for (const p of papel.problemas) {
  test(`papel ${p.id}: cada «verificar» coincide con un cálculo propio`, () => {
    for (const v of p.verificar) {
      assert.ok(CALC[v.tipo], `tipo desconocido ${v.tipo}`);
      const r = CALC[v.tipo](v.args);
      assert.ok(Math.abs(r - v.espera) < 1e-6 * Math.max(1e-9, Math.abs(v.espera)), `${p.id}: ${v.tipo} da ${r}, se espera ${v.espera}`);
    }
  });
}
