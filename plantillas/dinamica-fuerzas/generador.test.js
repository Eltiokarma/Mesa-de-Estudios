// Pruebas del generador «La plataforma que gira»: casos.json (verificados aparte), un recálculo
// independiente en cada uno de 600 problemas y los problemas de papel.json.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// Camino independiente: no se copian las fórmulas despejadas del generador. Las condiciones límite se
// buscan por bisección sobre la ecuación de fuerzas sin despejar; la escalera se resuelve con momentos
// respecto al apoyo en la pared (el generador los toma en el pie); las cajas se simulan paso a paso;
// la gravitación usa G y las posiciones de cada cuerpo.
const g = 10, G = 6.674e-11;
const TR = { 37: [0.6, 0.8], 53: [0.8, 0.6], 60: [Math.sqrt(3) / 2, 0.5] }; // [sen, cos] notables
function biseccion(fn, a, b) {
  let fa = fn(a);
  for (let i = 0; i < 300; i++) { const m = (a + b) / 2, fm = fn(m); if ((fm > 0) === (fa > 0)) { a = m; fa = fm; } else b = m; }
  return (a + b) / 2;
}
// Verdad de cada afirmación de astro/proposiciones, escrita aparte.
const VERDAD = { 'L-masa': false, 'L-peso': true, 'L-empujar': true, 'L-levantar': true, 'L-frenar': false, 'L-balanza': true,
  'O-sin-gravedad': false, 'O-masa': true, 'O-atrae': true, 'O-balanza': true, 'O-empujar': false };

function escaleraRoce(d) {
  // Momentos respecto al punto de apoyo en la pared (ahí la normal de la pared no hace momento).
  const [s, c] = TR[d.angulo], N = (d.M + d.m) * g;
  // N·(L cos) − f·(L sen) − M g (L/2) cos − m g (L − dd) cos = 0
  return dd => (N * d.L * c - d.M * g * (d.L / 2) * c - d.m * g * (d.L - dd) * c) / (d.L * s);
}

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'plataforma') {
    if (d.sub === 'omega') return biseccion(w => w * w * d.r - d.mu * g, 0, 100);
    if (d.sub === 'mu') { const m = 3; return (m * d.w * d.w * d.r) / (m * g); }
    return biseccion(r => d.w * d.w * r - d.mu * g, 0, 100);
  }
  if (d.tipo === 'motriz') {
    if (d.sub === 'aceleracion') return d.mus * (d.fraccion * d.m * g) / d.m;
    if (d.sub === 'cuales') {
      const adelante = [d.sD > 0 ? 'D' : null, d.sT > 0 ? 'T' : null].filter(Boolean);
      return 'motriz:' + (adelante.length === 2 ? 'cuatro' : adelante[0]);
    }
    // sentido: la rueda motriz empuja el piso hacia atrás al acelerar; toda rueda frenada, hacia adelante.
    const roce = rueda => (d.frena ? -1 : (rueda === d.motriz ? 1 : -1));
    return `D${roce('D') > 0 ? '+' : '-'}T${roce('T') > 0 ? '+' : '-'}`;
  }
  if (d.tipo === 'peralte') {
    const [s, c] = TR[d.angulo], ang = Math.atan2(s, c);
    // Curva: la dirección de la fuerza neta (v²/r horizontal, g vertical) debe coincidir con la de la normal.
    if (d.sub === 'curva') return biseccion(r => Math.atan((d.v * d.v / r) / g) - ang, 1e-6, 5000);
    // Cuenco: la normal va por el radio, a ang de la vertical; el giro es en r = R·sen.
    const wCuenco = R => biseccion(w => Math.atan((w * w * R * s) / g) - ang, 0, 200);
    if (d.sub === 'cuenco') return biseccion(R => Math.atan((d.w * d.w * R * s) / g) - ang, 1e-9, 100);
    if (d.sub === 'normal') { const w = wCuenco(d.R); return Math.hypot(d.m * g, d.m * w * w * d.R * s); }
    // Embudo: la normal forma ang con la horizontal; r = h·tan(ang).
    return biseccion(hh => Math.atan(g / (d.v * d.v / (hh * s / c))) - ang, 1e-9, 100);
  }
  if (d.tipo === 'astro') {
    if (d.sub === 'aceleracion') return d.F / d.m;
    if (d.sub === 'peso') {
      const MT = 5.97e24, RT = 6.37e6, gT = G * MT / RT ** 2;
      return d.m * g * (G * d.k * MT / (d.q * RT) ** 2) / gT;
    }
    return 'vf:' + d.afirmaciones.map(id => (VERDAD[id] ? 'V' : 'F')).join('');
  }
  if (d.tipo === 'resorte') {
    if (d.sub === 'instante') {
      // Sistema entero: F − roce total = mA·aA + mB·aB (el resorte es fuerza interna).
      return (d.F - d.mu * (d.mA + d.mB) * g - d.mB * d.aB) / d.mA;
    }
    return (d.k * d.x - d.mu * d.mB * g) / d.mB;
  }
  if (d.tipo === 'tabla') {
    const dt = 1e-4;
    const res = d.cajas.map(c => { let v = 0, x = 0; for (let t = 0; t < c.t - 1e-12; t += dt) { x += v * dt + 0.5 * (c.F / c.m) * dt * dt; v += (c.F / c.m) * dt; } return d.sub === 'rapidez' ? v : x; });
    return 'caja:' + (res.indexOf(Math.max(...res)) + 1);
  }
  if (d.tipo === 'escalera') {
    const roce = escaleraRoce(d), N = (d.M + d.m) * g;
    if (d.sub === 'roce') return roce(d.d);
    if (d.sub === 'reaccion') return Math.hypot(N, roce(d.d));
    const dd = biseccion(x => roce(x) - d.mu * N, 0, d.L);
    return dd * TR[d.angulo][0];
  }
  // gravitatoria
  const fuerza = (M, xM, xP) => G * M * 1 * Math.sign(xM - xP) / (xM - xP) ** 2;
  if (d.sub === 'nulo') {
    const xP = biseccion(x => fuerza(d.MA, 0, x) + fuerza(d.MB, d.d, x), 1e-9, d.d - 1e-9);
    return d.desdeA ? xP : d.d - xP;
  }
  // neta: A en 0, B en d (en decenas de miles de km); de F_A sale G·m·M.
  const xP = d.fuera ? -d.rA : d.rA;
  const GmM = d.FA * d.rA ** 2;
  const Fa = GmM * d.MA * Math.sign(0 - xP) / (0 - xP) ** 2, Fb = GmM * d.MB * Math.sign(d.d - xP) / (d.d - xP) ** 2;
  return Math.abs(Fa + Fb);
}

const igual = (a, b) => (typeof a === 'string' ? a === b : Math.abs(a - b) < 1e-6 * Math.max(1, Math.abs(a)));
probarGenerador(gen, { semillas: 600, recalcular: p => { const r = recalcular(p); return igual(r, p.respuesta.valor) ? p.respuesta.valor : r; },
  igual: (a, b) => (typeof a === 'string' ? a === b : Math.abs(a - b) < 1e-9) });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    if (typeof c.esperado.respuesta === 'number') assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
    else assert.equal(p.respuesta.valor, c.esperado.respuesta);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

test('salen todos los tipos y subtipos; las alternativas numéricas llevan la misma unidad', () => {
  const vistos = new Set();
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s), d = p._datos;
    vistos.add(d.tipo + '/' + d.sub);
    if (typeof p.respuesta.valor !== 'number') continue;
    const unidad = a => a.texto.replace(/^[−\d ,]+/, '');
    assert.equal(new Set(p.alternativas.map(unidad)).size, 1, `semilla ${s}: unidades distintas (${p.alternativas.map(a => a.texto)})`);
  }
  assert.deepEqual([...vistos].sort(), ['astro/aceleracion', 'astro/peso', 'astro/proposiciones', 'escalera/maximo', 'escalera/reaccion', 'escalera/roce',
    'gravitatoria/neta', 'gravitatoria/nulo', 'motriz/aceleracion', 'motriz/cuales', 'motriz/sentido', 'peralte/cuenco', 'peralte/curva', 'peralte/embudo',
    'peralte/normal', 'plataforma/mu', 'plataforma/omega', 'plataforma/radio', 'resorte/estiramiento', 'resorte/instante', 'tabla/distancia', 'tabla/rapidez']);
});

// Redondez pareja y nada fuera de escala (revisión del 8 nov 2026).
const decs = x => { for (let k = 0; k <= 6; k++) if (Math.abs(x * 10 ** k - Math.round(x * 10 ** k)) < 1e-6) return k; return 99; };
test('la correcta no se reconoce por redonda: en el 80 % o más, ninguna incorrecta tiene más decimales', () => {
  let n = 0, parejo = 0;
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    if (typeof p.respuesta.valor !== 'number') continue;
    n++;
    const dc = decs(p.respuesta.valor);
    if (!p.alternativas.some(a => !a.correcta && decs(a.valor) > dc)) parejo++;
    for (const a of p.alternativas) assert.ok(decs(a.valor) <= Math.max(2, dc), `semilla ${s}: ${a.texto} con más de 2 decimales`);
  }
  assert.ok(parejo / n >= 0.8, `solo ${parejo} de ${n}`);
});
test('sin distractores absurdos: entre 1/20 y 20 veces la correcta, radios dentro del plato, μs ≤ 1,5', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    if (typeof p.respuesta.valor !== 'number') continue;
    for (const a of p.alternativas.filter(x => !x.correcta)) {
      const r = a.valor / p.respuesta.valor;
      assert.ok(r >= 1 / 20 && r <= 20, `semilla ${s}: ${a.texto} contra ${p.respuesta.valor}`);
      if (d.tipo === 'plataforma' && d.sub === 'radio') assert.ok(a.valor <= d.radioPlataforma + 1e-9, `semilla ${s}: radio ${a.texto} mayor que el plato`);
      if (d.tipo === 'plataforma' && d.sub === 'mu') assert.ok(a.valor <= 1.5, `semilla ${s}: μs = ${a.texto}`);
    }
  }
});
test('los textos del alumno no dicen «trampa»', () => {
  const plano = seg => seg.map(x => (typeof x === 'string' ? x : x.t)).join('');
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    const todo = [plano(p.enunciado), plano(p.pregunta), ...p.solucion.map(plano), ...p.alternativas.map(a => a.texto + (a.error ? a.error.explicacion : ''))].join(' ');
    assert.ok(!/trampa/i.test(todo), `semilla ${s}`);
  }
});
test('nunca lanza, tampoco con semillas de texto', () => {
  for (let s = 0; s <= 2000; s++) gen.generar(s);
  for (const s of ['entrada-1', 'entrada-2', 'salida-1', 'salida-3', 'x']) gen.generar(s);
});
test('la escalera no resbala en «roce»: el roce que hace falta es menor que μs·N', () => {
  for (let s = 0; s < 1500; s++) {
    const d = gen.generar(s)._datos;
    if (d.tipo === 'escalera' && d.sub === 'roce') assert.ok(escaleraRoce(d)(d.d) < d.mu * (d.M + d.m) * g, `semilla ${s}`);
  }
});

test('los textos no dicen «de el» ni «a el»', () => {
  const plano = seg => seg.map(x => (typeof x === 'string' ? x : x.t)).join('');
  for (let s = 0; s < 1000; s++) {
    const p = gen.generar(s);
    const todo = [plano(p.enunciado), plano(p.pregunta), ...p.solucion.map(plano), ...p.alternativas.filter(a => a.error).map(a => a.error.explicacion)].join(' ');
    const malo = todo.match(/.{0,20}(?<!\p{L})(de|a) el(?!\p{L}).{0,20}/iu);
    assert.ok(!malo, `semilla ${s}: ${malo}`);
  }
});

// ---------- papel.json: estructura y recálculo de cada «verificar» con funciones propias ----------
const VERIFICAR = {
  'radio-plataforma': ({ w, mu }) => biseccion(r => w * w * r - mu * g, 0, 100),
  'aceleracion-motriz': ({ mus, fraccion }) => mus * fraccion * g,
  peralte: ({ r, angulo }) => { const [s, c] = TR[angulo]; return biseccion(v => Math.atan(v * v / (r * g)) - Math.atan2(s, c), 0, 200); },
  'cuenco-omega': ({ R, angulo }) => { const [s, c] = TR[angulo]; return biseccion(w => Math.atan(w * w * R * s / g) - Math.atan2(s, c), 0, 200); },
  'cuenco-normal': ({ m, angulo }) => { const [s, c] = TR[angulo]; return Math.hypot(m * g, m * g * s / c); },
  peso: ({ m, gLugar }) => m * gLugar,
  aceleracion: ({ F, m }) => F / m,
  resorte: ({ mA, mB, mu, F, aB }) => (F - mu * (mA + mB) * g - mB * aB) / mA,
  'rapidez-final': ({ F, m, t }) => { let v = 0; const dt = 1e-4; for (let x = 0; x < t - 1e-12; x += dt) v += F / m * dt; return v; },
  'escalera-roce': d => escaleraRoce(d)(d.d),
  nulo: ({ MA, MB, d }) => biseccion(x => MA / (x * x) - MB / ((d - x) ** 2), 1e-9, d - 1e-9),
};
test('papel.json: entre 5 y 10 problemas bien formados, en texto plano', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  assert.equal(new Set(papel.problemas.map(q => q.id)).size, papel.problemas.length, 'ids repetidos');
  for (const q of papel.problemas) {
    assert.ok(q.enunciado && q.respuesta && Array.isArray(q.pasos) && q.pasos.length && Array.isArray(q.verificar) && q.verificar.length, q.id);
    for (const t of [q.enunciado, q.respuesta, ...q.pasos]) assert.ok(!/<[a-z/]/i.test(t), `${q.id}: tiene HTML`);
  }
});
test('papel.json: cada «verificar» coincide con un cálculo propio', () => {
  for (const q of papel.problemas) for (const v of q.verificar) {
    assert.ok(VERIFICAR[v.tipo], `${q.id}: tipo desconocido ${v.tipo}`);
    const r = VERIFICAR[v.tipo](v.args);
    assert.ok(Math.abs(r - v.espera) < 1e-3 * Math.max(1, Math.abs(v.espera)), `${q.id} (${v.tipo}): da ${r}, espera ${v.espera}`);
  }
});
