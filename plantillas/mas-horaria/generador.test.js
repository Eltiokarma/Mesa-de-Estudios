// Pruebas del generador «La ecuación del resorte»: casos.json (calculados aparte), un recálculo
// independiente en cada uno de 600 problemas y la hoja de lápiz y papel (papel.json).
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

const PI = Math.PI, g = 10;
const X = (A, w, fase) => t => A * Math.sin(w * t + fase * PI);
const derivada = (F, t, hh = 1e-5) => (F(t + hh) - F(t - hh)) / (2 * hh);
const segunda = (F, t, hh = 1e-3) => (F(t + hh) - 2 * F(t) + F(t - hh)) / (hh * hh);
function biseccion(F, a, b, vueltas = 200) {
  let fa = F(a);
  for (let i = 0; i < vueltas; i++) { const m = (a + b) / 2, fm = F(m); if ((fm > 0) === (fa > 0)) { a = m; fa = fm; } else b = m; }
  return (a + b) / 2;
}
// Periodo medido: dos cruces sucesivos de subida por el centro, buscados paso a paso.
function periodoMedido(F, paso = 1e-3, hasta = 60) {
  const cruces = [];
  for (let t = 0; t < hasta && cruces.length < 2; t += paso) if (F(t) < 0 && F(t + paso) >= 0) cruces.push(biseccion(F, t, t + paso));
  return cruces[1] - cruces[0];
}
// Flotador: se integra m·y'' = ρ·g·S·(hundido) − m·g con RK4 y se mide el periodo.
function periodoFlotador(m, rho, S) {
  const Sm = S / 1e4, eq = m / (rho * Sm);
  const acel = d => (m * g - rho * g * Sm * d) / m;   // d: lo hundido; el empuje sube, el peso baja
  let d = eq + 0.005, vel = 0, t = 0;
  const dt = 2 * PI * Math.sqrt(m / (rho * g * Sm)) / 4000;
  const cruces = []; let prev = d - eq;
  while (cruces.length < 3) {
    const k1v = acel(d), k1x = vel;
    const k2v = acel(d + k1x * dt / 2), k2x = vel + k1v * dt / 2;
    const k3v = acel(d + k2x * dt / 2), k3x = vel + k2v * dt / 2;
    const k4v = acel(d + k3x * dt), k4x = vel + k3v * dt;
    d += (k1x + 2 * k2x + 2 * k3x + k4x) * dt / 6; vel += (k1v + 2 * k2v + 2 * k3v + k4v) * dt / 6; t += dt;
    const y = d - eq;
    if (prev > 0 && y <= 0) cruces.push(t - dt * y / (y - prev));
    prev = y;
  }
  return cruces[2] - cruces[1];
}

// Escribir: de las condiciones iniciales x0 y v0, por la fórmula general (no por casos).
function claveEscrita(d) {
  const w = d.T ? 2 * PI / d.T : Math.sqrt(d.k / d.m);
  const A = Math.hypot(d.x0, d.v0 / w);
  let fase = Math.atan2(d.x0, d.v0 / w); if (fase < -1e-12) fase += 2 * PI; if (Math.abs(fase - 2 * PI) < 1e-9) fase = 0;
  return `mas:${+A.toFixed(6)}|${+w.toFixed(6)}|${+(fase / PI).toFixed(6)}`;
}

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'escribir') return claveEscrita(d);
  if (d.tipo === 'leer') {
    const F = X(d.A, d.w, d.fase);
    if (d.sub === 'k') { const t = [0.1, 0.37, 0.71].find(tt => Math.abs(F(tt)) > 0.01 * d.A); return -d.m * segunda(F, t) / F(t); }
    if (d.sub === 'x0') return d.A * Math.cos(d.fase * PI - PI / 2);
    const T = periodoMedido(F);
    return d.sub === 'periodo' ? T : 1 / T;
  }
  if (d.tipo === 'instante') { const F = X(d.A, d.w, d.fase); return d.sub === 'x' ? F(d.t) : derivada(F, d.t); }
  if (d.tipo === 'media') {
    if (d.sub === 'vm') { const F = X(d.A, d.w, d.fase); return (F(d.t2) - F(d.t1)) / (d.t2 - d.t1); }
    // ω tal que la velocidad media hasta la primera llegada a la meta sea la dada.
    const meta = d.meta * d.A;
    const vmDe = w => { const F = X(d.A, w, 0); const t = biseccion(tt => F(tt) - meta, 1e-9, PI / (2 * w)); return meta / t; };
    return biseccion(w => vmDe(w) - d.vm, 0.01, 100);
  }
  if (d.tipo === 'apilado') {
    if (d.sub === 'aceleracion') return d.mu * d.m * g / d.m;
    // La mayor A tal que la fuerza que necesita el bloque de arriba (m·|a| máx en un periodo) no pase de μs·m·g.
    const w = Math.sqrt(d.k / (d.m + d.M));
    const necesita = A => { let mx = 0; for (let i = 0; i <= 400; i++) mx = Math.max(mx, Math.abs(segunda(X(A, w, 0), i * 2 * PI / w / 400))); return d.m * mx; };
    return biseccion(A => necesita(A) - d.mu * d.m * g, 1e-6, 5) * 100;
  }
  if (d.sub === 'periodo') return periodoFlotador(d.m, d.rho, d.S);
  return biseccion(m => periodoFlotador(m, d.rho, d.S) - d.T, 0.01, 50, 45);
}

probarGenerador(gen, { semillas: 600, recalcular: p => {
  const r = recalcular(p);
  if (typeof r === 'string') return r === p.respuesta.valor ? p.respuesta.valor : r;
  const tol = p._datos.tipo === 'flotante' || p._datos.tipo === 'apilado' || p._datos.sub === 'periodo' || p._datos.sub === 'frecuencia' || p._datos.sub === 'k' ? 1e-4 : 1e-6;
  return Math.abs(r - p.respuesta.valor) < tol * Math.max(1, Math.abs(r)) ? p.respuesta.valor : r;
}, igual: (a, b) => (typeof a === 'string' ? a === b : Math.abs(a - b) < 1e-9) });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    const correcta = p.alternativas.find(a => a.correcta).texto;
    assert.equal(correcta, c.esperado.exacta);
    if (typeof c.esperado.respuesta === 'number') assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia * Math.max(1, Math.abs(c.esperado.respuesta)), `da ${p.respuesta.valor}`);
    else assert.equal(p.respuesta.valor, c.esperado.respuesta);
  });
}

const SUBTIPOS = ['apilado/aceleracion', 'apilado/amplitud', 'escribir/centro', 'escribir/extremo', 'flotante/masa', 'flotante/periodo', 'instante/v', 'instante/x',
  'leer/frecuencia', 'leer/k', 'leer/periodo', 'leer/x0', 'media/omega', 'media/vm'];

test('salen todos los tipos y subtipos; las alternativas numéricas llevan la misma unidad; salen negativos', () => {
  const vistos = new Set(); let negativas = 0, comprime = 0, estira = 0, izq = 0, der = 0, conT = 0;
  for (let s = 0; s < 800; s++) {
    const p = gen.generar(s), d = p._datos;
    vistos.add(d.tipo + '/' + d.sub);
    if (d.tipo === 'escribir') {
      if (d.sub === 'extremo') (d.x0 < 0 ? comprime++ : estira++); else (d.v0 < 0 ? izq++ : der++);
      if (d.T) conT++;
      for (const a of p.alternativas) assert.match(a.texto, /^x = [\d,]+ sen\(([\d,]*π?t(\/\d+)?)( \+ \d*π(\/\d+)?)?\) m$/, `semilla ${s}: ${a.texto}`);
      continue;
    }
    if (p.respuesta.valor < 0) negativas++;
    const unidad = a => a.texto.replace(/^[−\d ,π√/]+/, '');
    assert.equal(new Set(p.alternativas.map(unidad)).size, 1, `semilla ${s}: unidades distintas (${p.alternativas.map(a => a.texto)})`);
    for (const a of p.alternativas) assert.ok(!/\d,\d{4}/.test(a.texto) && !/−0 /.test(a.texto), `semilla ${s}: ${a.texto}`);
  }
  assert.deepEqual([...vistos].sort(), SUBTIPOS);
  assert.ok(negativas > 20, `solo ${negativas} negativas`);
  for (const [n, c] of Object.entries({ comprime, estira, izq, der, conT })) assert.ok(c > 3, `pocos casos de ${n}`);
});

test('en media/vm, media/omega, instante/v y flotante/periodo todas las alternativas van en el mismo formato (con π o sin π)', () => {
  const conPi = { 'media/vm': false, 'media/omega': false, 'instante/v': true, 'flotante/periodo': true };
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s), k = p._datos.tipo + '/' + p._datos.sub;
    if (!(k in conPi)) continue;
    for (const a of p.alternativas) {
      if (a.texto.startsWith('0 ')) continue;
      assert.equal(a.texto.includes('π'), conPi[k], `semilla ${s} (${k}): ${p.alternativas.map(x => x.texto)}`);
    }
    if (k === 'flotante/periodo') assert.ok(!p.alternativas.some(a => a.error && a.error.id === 'MAS-gravedad-como-k'));
  }
});

test('hay variedad: en 600 semillas casi no se repiten los datos', () => {
  const vistos = new Map(); let repetidos = 0;
  for (let s = 0; s < 600; s++) { const k = JSON.stringify(gen.generar(s)._datos); if (vistos.has(k)) repetidos++; vistos.set(k, s); }
  assert.ok(repetidos < 30, `${repetidos} repetidos`);
});

test('en «escribir/extremo» comprimido, la fase es 3π/2 y φ = 0 siempre sale como trampa', () => {
  for (let s = 0; s < 800; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.tipo !== 'escribir' || d.sub !== 'extremo' || d.x0 > 0) continue;
    assert.ok(p.respuesta.texto.endsWith('+ 3π/2) m'), `semilla ${s}: ${p.respuesta.texto}`);
    assert.ok(p.alternativas.some(a => a.error && a.error.id === 'MAS-fase-cero'), `semilla ${s}`);
  }
});

test('los textos no dicen «de el» ni «a el» ni muestran undefined', () => {
  const plano = seg => seg.map(x => (typeof x === 'string' ? x : x.t)).join('');
  for (let s = 0; s < 1000; s++) {
    const p = gen.generar(s);
    const todo = [plano(p.enunciado), plano(p.pregunta), ...p.solucion.map(plano), ...p.alternativas.map(a => a.texto), ...p.alternativas.filter(a => a.error).map(a => a.error.explicacion)].join(' ');
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
    assert.ok(!preg.includes(p.alternativas.find(a => a.correcta).texto), `semilla ${s}: la pregunta trae la respuesta`);
  }
});

// ---------- Lápiz y papel ----------
const VERIFICAR = {
  k: ({ m, w }) => { const F = X(1, w, 0); return -m * segunda(F, 0.3) / F(0.3); },
  x0: ({ A, fase }) => X(A, 1, fase)(0),
  periodo: ({ w }) => periodoMedido(X(1, w, 0)),
  fase: ({ x0, v0, w }) => { let f = Math.atan2(x0, v0 / w); if (f < 0) f += 2 * PI; return f / PI; },
  amplitud: ({ x0, v0, w }) => Math.hypot(x0, v0 / w),
  velocidad: ({ A, w, fase, t }) => derivada(X(A, w, fase), t),
  media: ({ A, w, fase, t1, t2 }) => { const F = X(A, w, fase); return (F(t2) - F(t1)) / (t2 - t1); },
  apilado: ({ mu, m, M, k }) => recalcular({ _datos: { tipo: 'apilado', sub: 'amplitud', mu, m, M, k } }),
  flotador: ({ m, rho, S }) => periodoFlotador(m, rho, S),
};

test('papel.json: 5 a 10 problemas bien armados, sin HTML, y cada verificación se recalcula', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  assert.equal(new Set(papel.problemas.map(q => q.id)).size, papel.problemas.length);
  for (const q of papel.problemas) {
    assert.ok(q.enunciado && q.respuesta && q.nivel, q.id);
    assert.ok(Array.isArray(q.pasos) && q.pasos.length >= 2, q.id);
    assert.ok(Array.isArray(q.verificar) && q.verificar.length >= 1, q.id);
    assert.ok(!/<[a-z/][^>]*>/i.test([q.enunciado, q.respuesta, ...q.pasos].join(' ')), `${q.id}: tiene HTML`);
    for (const ver of q.verificar) {
      assert.ok(VERIFICAR[ver.tipo], `${q.id}: tipo ${ver.tipo} sin verificador`);
      const r = VERIFICAR[ver.tipo](ver.args);
      assert.ok(Math.abs(r - ver.espera) < 1e-4 * Math.max(1, Math.abs(ver.espera)), `${q.id}: ${ver.tipo} da ${r}, espera ${ver.espera}`);
    }
  }
});
