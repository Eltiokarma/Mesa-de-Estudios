// Pruebas del generador «La bomba y el ascensor»: casos.json (calculados aparte), un recálculo
// independiente en cada uno de 600 problemas y la hoja de lápiz y papel (papel.json).
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador, topeEscala } = require('../../nucleo/probar-generador.js');

const g = 10;
const SEN = { 37: 0.6, 53: 0.8 }, COS = { 37: 0.8, 53: 0.6 };

// Equilibrio en ejes horizontal y vertical (no a lo largo de la rampa): incógnitas T (cable,
// paralelo a la rampa) y N; el roce μN apunta rampa abajo. Se resuelve el sistema 2×2 por Cramer.
function cableRampa(m, ang, mu) {
  const s = SEN[ang], c = COS[ang];
  // x: T·c − N·s − μN·c = 0 ;  y: T·s + N·c − μN·s = m·g
  const a11 = c, a12 = -(s + mu * c), a21 = s, a22 = c - mu * s;
  const det = a11 * a22 - a12 * a21;
  return (0 * a22 - a12 * m * g) / det;
}
function biseccion(F, a, b) {
  let fa = F(a);
  for (let i = 0; i < 200; i++) { const mm = (a + b) / 2, fm = F(mm); if ((fm > 0) === (fa > 0)) { a = mm; fa = fm; } else b = mm; }
  return (a + b) / 2;
}
// Trabajo de la fuerza sobre el collarín: integral de F·cos(ángulo de la cuerda) a lo largo del
// avance del collarín (Simpson), sin usar lo que se acorta la cuerda.
function trabajoCuerda(b, x1, x2, F, n = 2000) {
  const fx = x => F * x / Math.sqrt(b * b + x * x);
  const hh = (x1 - x2) / n; let s = fx(x1) + fx(x2);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * fx(x2 + i * hh);
  return s * hh / 3;
}
// Pelota: se sigue la rapidez choque a choque (y tramo a tramo) y se pasa a altura al final.
function rebote(H, p, n, sub) {
  let E = g * H; // energía por kilo
  for (let i = 0; i < n; i++) {
    if (sub === 'tramo') E *= (1 - p);           // bajada
    let vel = Math.sqrt(2 * E);
    if (sub === 'choque') vel *= Math.sqrt(1 - p);
    if (sub === 'rapidez') vel *= (1 - p);
    E = vel * vel / 2;
    if (sub === 'tramo') E *= (1 - p);           // subida
  }
  return E / g;
}

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'fv') {
    if (d.sub === 'horizontal') {
      const F = d.mu === null ? d.F : d.mu * d.m * g;     // fuerza = roce si va a rapidez constante
      const metrosPorSegundo = d.vkmh * 1000 / 3600;
      return F * metrosPorSegundo / 1000;                  // trabajo en 1 s, en kJ → kW
    }
    if (d.sub === 'subida') return cableRampa(d.m, d.ang, d.mu) * d.v;
    if (d.sub === 'velocidad') { const T = cableRampa(d.m, d.ang, d.mu); return biseccion(x => T * x - d.P, 0, 1000); }
    const dt = 1e-3, W = d.eta * d.Pc * 1000 * dt, dist = d.vkmh * 1000 / 3600 * dt;
    return W / dist;
  }
  if (d.tipo === 'peso') {
    const H = d.sub === 'grua' ? d.h : (d.escalones ? d.escalones * d.e / 100 : d.H);
    if (d.largo) assert.ok(Math.abs(Math.hypot(d.H, Math.sqrt(d.largo ** 2 - d.H ** 2)) - d.largo) < 1e-9);
    const P = d.m * g * H / d.t;
    return d.sub === 'grua' ? P / 1000 : P;
  }
  if (d.tipo === 'bomba') {
    const masaHora = d.Q * 60, energiaHora = masaHora * g * d.h, util = energiaHora / 3600;
    if (d.sub === 'util') return util;
    const consumida = biseccion(x => (1 - d.perdida) * x - util, 0, 1e7);
    return consumida / (d.unidad === 'HP' ? 746 : 1000);
  }
  if (d.tipo === 'pisos') {
    // Por paquetes: la carga que baja tras j tramos ganó j pisos; la cabina, todos.
    const T = d.cantidad / d.porPiso;
    let E = d.M * g * d.h * T;
    for (let j = 1; j <= T; j++) E += d.porPiso * d.carga * g * d.h * j;
    return E / 1000;
  }
  if (d.tipo === 'rebotes') return rebote(d.h, d.p, d.n, d.sub);
  const W = trabajoCuerda(d.b, d.x1, d.x2, d.F);
  return d.sub === 'trabajo' ? W : Math.sqrt(2 * W / d.m);
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

const SUBTIPOS = ['bomba/consumida', 'bomba/util', 'cuerda/rapidez', 'cuerda/trabajo', 'fv/eficiencia', 'fv/horizontal', 'fv/subida', 'fv/velocidad',
  'peso/escalera', 'peso/grua', 'pisos', 'rebotes/choque', 'rebotes/rapidez', 'rebotes/tramo'];

test('salen todos los tipos y subtipos; las alternativas llevan la misma unidad', () => {
  const vistos = new Set();
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    vistos.add(d.tipo + (d.sub ? '/' + d.sub : ''));
    const unidad = a => a.texto.replace(/^[−\d ,]+/, '');
    assert.equal(new Set(p.alternativas.map(unidad)).size, 1, `semilla ${s}: unidades distintas (${p.alternativas.map(a => a.texto)})`);
    assert.equal(unidad(p.alternativas[0]), p.respuesta.unidad, `semilla ${s}`);
    for (const a of p.alternativas) assert.ok(!/\d,\d{3}/.test(a.texto), `semilla ${s}: más de dos decimales (${a.texto})`);
  }
  assert.deepEqual([...vistos].sort(), SUBTIPOS);
});

test('las variantes internas salen: con μ y con fuerza, km/h, minutos, escalones y rampa, kW y HP, pileta y pozo, personas y sacos', () => {
  const marcas = new Set();
  for (let s = 0; s < 1500; s++) {
    const d = gen.generar(s)._datos;
    if (d.sub === 'horizontal') marcas.add(d.mu === null ? 'fuerza' : 'mu');
    if (d.sub === 'subida' && d.enKmh) marcas.add('kmh');
    if (d.sub === 'escalera') marcas.add(d.escalones ? 'escalones' : 'rampa');
    if (d.sub === 'consumida') marcas.add(d.unidad);
    if (d.sub === 'util') marcas.add(d.contexto);
    if (d.tipo === 'pisos') marcas.add(d.carga >= 60 ? 'personas' : 'sacos');
  }
  for (const m of ['fuerza', 'mu', 'kmh', 'escalones', 'rampa', 'kW', 'HP', 'surtidor', 'pozo', 'personas', 'sacos']) assert.ok(marcas.has(m), `no sale ${m}`);
});

test('hay variedad: en 600 semillas casi no se repiten los datos', () => {
  const vistos = new Set(); let repetidos = 0;
  for (let s = 0; s < 600; s++) { const k = JSON.stringify(gen.generar(s)._datos); if (vistos.has(k)) repetidos++; vistos.add(k); }
  assert.ok(repetidos < 35, `${repetidos} repetidos`);
});

test('los textos no dicen «de el» ni «a el»', () => {
  const plano = seg => seg.map(x => (typeof x === 'string' ? x : x.t)).join('');
  for (let s = 0; s < 1000; s++) {
    const p = gen.generar(s);
    const todo = [plano(p.enunciado), plano(p.pregunta), ...p.solucion.map(plano), ...p.alternativas.filter(a => a.error).map(a => a.error.explicacion)].join(' ');
    assert.ok(!/\b[Dd]e el\b|\b[Aa] el\b/.test(todo), `semilla ${s}`);
    assert.ok(!/undefined|NaN|null/.test(todo), `semilla ${s}: ${todo}`);
  }
});

test('cada variable pintada tiene nombre y color, y la pregunta no dice la respuesta', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    for (const seg of [...p.enunciado, ...p.pregunta, ...p.solucion.flat()]) {
      if (typeof seg === 'string') continue;
      const va = p.variables[seg.v];
      assert.ok(va && va.nombre && ['o', 'i', 'h', 'd'].includes(va.color), `semilla ${s}: variable ${seg.v} sin color`);
    }
    const preg = p.pregunta.map(x => (typeof x === 'string' ? x : x.t)).join('');
    const correcta = p.alternativas.find(a => a.correcta).texto;
    assert.ok(!preg.includes(correcta), `semilla ${s}: la pregunta trae la respuesta`);
  }
});

test('nunca falla: semillas 0 a 2000 y de texto', () => {
  for (let s = 0; s <= 2000; s++) assert.doesNotThrow(() => gen.generar(s), `semilla ${s}`);
  for (const s of ['entrada-1', 'entrada-2', 'salida-1', 'salida-3', 'práctica-7']) assert.doesNotThrow(() => gen.generar(s), s);
});

test('sin distractores absurdos y la correcta no se reconoce por redonda (600 semillas)', () => {
  const dec = t => { const m = t.match(/,(\d+)/); return (m ? m[1].length : 0) + (/√/.test(t) ? 1 : 0); };
  const por = {}; let total = 0, sola = 0;
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    if (typeof p.respuesta.valor !== 'number') continue;
    const c = p.respuesta.valor, k = p._datos.tipo + '/' + p._datos.sub;
    for (const a of p.alternativas.filter(x => !x.correcta)) {
      if (Math.abs(a.valor) < 1e-9) continue; // el cero, donde tiene sentido (equilibrio, reposo)
      const r = Math.abs(a.valor / c);
      assert.ok(r >= 1 / topeEscala(a) && r <= topeEscala(a), `semilla ${s}: ${a.texto} frente a ${c} (${a.error.id})`);
    }
    const correcta = p.alternativas.find(a => a.correcta), otras = p.alternativas.filter(a => !a.correcta);
    por[k] = por[k] || [0, 0]; por[k][0]++; total++;
    if (otras.every(a => dec(a.texto) > dec(correcta.texto))) { por[k][1]++; sola++; }
  }
  assert.ok(sola / total < 0.15, `la correcta es la única más redonda en ${sola} de ${total}`);
  for (const [k, [n, m]] of Object.entries(por)) assert.ok(n < 10 || m / n <= 0.35, `${k}: la correcta es la más redonda en ${m} de ${n}`);
});

// ---------- Lápiz y papel ----------
const VERIFICAR = {
  fv: ({ F, vkmh }) => F * (vkmh * 1000 / 3600) / 1000,
  peso: ({ m, h, t }) => m * g * h / t,
  rampa: ({ m, ang, mu, v }) => cableRampa(m, ang, mu) * v,
  bomba: ({ Q, h, eta }) => (Q / 60) * g * h / eta,
  eficiencia: ({ Pc, eta, vkmh }) => eta * Pc * 1000 / (vkmh * 1000 / 3600),
  pisos: ({ M, carga, cantidad, porPiso, h }) => recalcular({ _datos: { tipo: 'pisos', M, carga, cantidad, porPiso, h } }) * 1000,
  rebote: ({ h, queda, veces }) => { let x = h; for (let i = 0; i < veces; i++) x *= queda; return x; },
  cuerda: ({ b, x1, x2, F, m }) => Math.sqrt(2 * trabajoCuerda(b, x1, x2, F) / m),
};

test('papel.json: 5 a 10 problemas bien armados, sin HTML, y cada verificación se recalcula', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  assert.equal(new Set(papel.problemas.map(q => q.id)).size, papel.problemas.length);
  for (const q of papel.problemas) {
    assert.ok(q.enunciado && q.respuesta && q.nivel, q.id);
    assert.ok(Array.isArray(q.pasos) && q.pasos.length >= 2, q.id);
    assert.ok(Array.isArray(q.verificar) && q.verificar.length >= 1, q.id);
    const texto = [q.enunciado, q.respuesta, ...q.pasos].join(' ');
    assert.ok(!/<[a-z/][^>]*>/i.test(texto), `${q.id}: tiene HTML`);
    for (const ver of q.verificar) {
      assert.ok(VERIFICAR[ver.tipo], `${q.id}: tipo ${ver.tipo} sin verificador`);
      const r = VERIFICAR[ver.tipo](ver.args);
      assert.ok(Math.abs(r - ver.espera) < 1e-6 * Math.max(1, Math.abs(ver.espera)), `${q.id}: ${ver.tipo} da ${r}, espera ${ver.espera}`);
    }
  }
});
