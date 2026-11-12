// Pruebas del generador «El termómetro de la chacra»: casos.json (verificados aparte), un recálculo
// independiente en cada uno de 600 problemas y los problemas de papel.json.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// Camino independiente: toda escala se trata como una recta que pasa por dos puntos fijos (hielo que se
// derrite y agua que hierve), sin usar 1,8 ni 32; los cruces se buscan por bisección; la catarata se
// resuelve con un balance de energía por bisección; la dilatación de un sólido sale de su volumen
// V0·(1 + α·ΔT)³, linealizado con una derivada numérica (la aproximación de los exámenes).
const PUNTOS = { C: [0, 100], F: [32, 212], K: [273, 373] };
function conv(x, de, a, X) {
  const P = { ...PUNTOS, X };
  const [d0, d1] = P[de], [a0, a1] = P[a];
  return a0 + (x - d0) * (a1 - a0) / (d1 - d0);
}
function biseccion(fn, a, b) {
  let fa = fn(a);
  for (let i = 0; i < 300; i++) { const m = (a + b) / 2, fm = fn(m); if ((fm > 0) === (fa > 0)) { a = m; fa = fm; } else b = m; }
  return (a + b) / 2;
}
const VERDAD = { 'C-masa': false, 'C-inercia': true, 'C-densidad': true, 'C-peso': false, 'C-volumen': true,
  'F-masa': false, 'F-inercia': false, 'F-densidad': true, 'F-peso': true, 'F-volumen': true };
const deriv = (F, x, hh = 1e-3) => (F(x + hh) - F(x - hh)) / (2 * hh);
const cAgua = 1 * 4.2 * 1000; // 1 cal/(g·°C) · 4,2 J/cal · 1000 g/kg

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'conversion') {
    if (d.sub === 'k-a-c') return conv(d.K, 'K', 'C');
    if (d.sub === 'c-a-f') return conv(d.C, 'C', 'F');
    if (d.sub === 'f-a-c') return conv(d.F, 'F', 'C');
    const X = [d.fusion, d.ebullicion];
    return d.haciaX ? conv(d.lectura, 'C', 'X', X) : conv(d.lectura, 'X', 'C', X);
  }
  if (d.tipo === 'coincidencia') {
    if (d.sub === 'c-f') return biseccion(c => conv(c, 'C', 'F') - (d.n * c + d.delta), -2000, 2000);
    return biseccion(k => conv(k, 'K', 'F') - (k + d.delta), 0, 5000);
  }
  if (d.tipo === 'variacion') {
    const X = [d.fusion, d.ebullicion];
    const par = { 'f-a-c': ['F', 'C'], 'c-a-k': ['C', 'K'], 'c-a-f': ['C', 'F'], inventada: ['C', 'X'] }[d.sub];
    return conv(d.T2, par[0], par[1], X) - conv(d.T1, par[0], par[1], X);
  }
  if (d.tipo === 'joule') {
    const m = 2; // cualquier masa: se cancela
    if (d.sub === 'altura') return biseccion(hh => m * 10 * hh + 0.5 * m * d.v0 ** 2 - m * cAgua * d.deltaT, 0, 5000);
    return (m * 10 * d.altura + 0.5 * m * d.v0 ** 2) / (m * cAgua);
  }
  if (d.tipo === 'dilatacion') {
    if (d.sub === 'proposiciones') return 'vf:' + d.afirmaciones.map(id => (VERDAD[id] ? 'V' : 'F')).join('');
    if (d.sub === 'tanque') return biseccion(T1 => d.V0 * 1000 * d.gamma * (T1 - d.T2) - d.dV, d.T2, d.T2 + 500);
    // Volumen real de un sólido: cada arista crece (1 + α·ΔT), y V = arista³. El examen usa la recta
    // tangente de ese volumen en ΔT = 0 (aproximación lineal): se calcula con su derivada numérica.
    const cubo = (V0, al) => x => V0 * (1 + al * x) ** 3;
    const lineal = (F, dT) => F(0) + deriv(F, 0) * dT;
    if (d.sub === 'capacidad') return lineal(cubo(d.V0, d.alfa), d.T2 - d.T1) - d.V0;
    if (d.sub === 'aparente') return d.V0 * (1 + d.gamma * d.deltaT) - lineal(cubo(d.V0, d.alfa), d.deltaT);
    const V0 = 1, masa = d.rho0 * V0;
    const V = d.lineal ? lineal(cubo(V0, d.coef), d.deltaT) : V0 * (1 + d.coef * d.deltaT);
    return Math.round(masa / V); // el enunciado pide redondear al entero
  }
  // sudor: calor en joules, calor latente en J/g
  const Lg = 2450;
  if (d.sub === 'cuerpo') return d.M * 3500 * d.deltaT / Lg;
  return d.QkJ * 1000 / Lg;
}
const cerca = (a, b, rel) => Math.abs(a - b) <= rel * Math.max(1, Math.abs(a));
probarGenerador(gen, { semillas: 600,
  recalcular: p => { const r = recalcular(p); if (typeof r === 'string') return r; return cerca(r, p.respuesta.valor, 1e-6) ? p.respuesta.valor : r; },
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
  assert.deepEqual([...vistos].sort(), ['coincidencia/c-f', 'coincidencia/k-f', 'conversion/c-a-f', 'conversion/f-a-c', 'conversion/inventada', 'conversion/k-a-c',
    'dilatacion/aparente', 'dilatacion/capacidad', 'dilatacion/densidad', 'dilatacion/proposiciones', 'dilatacion/tanque',
    'joule/altura', 'sudor/calor', 'sudor/cuerpo', 'variacion/c-a-f', 'variacion/c-a-k', 'variacion/f-a-c', 'variacion/inventada']);
});

test('las trampas de la admisión salen como alternativas: sumar 273, restar 32 en una variación, el −40 y el recipiente olvidado', () => {
  const ids = new Set();
  for (let s = 0; s < 1500; s++) for (const a of gen.generar(s).alternativas) if (a.error) ids.add(a.error.id);
  for (const id of ['U8-sumar-273', 'U8-restar-32', 'U8-sumar-32', 'CE-coincidencia-cf', 'CE-sin-cinetica', 'CE-sin-recipiente', 'Q11-sin-triplicar', 'Q7-sin-latente', 'U8-fahrenheit', 'CE-orden-latente', 'CE-masa-cambia'])
    assert.ok(ids.has(id), `no sale ${id}`);
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
    for (const a of p.alternativas.filter(x => !x.correcta)) assert.ok(decs(a.valor) <= Math.max(2, dc), `semilla ${s}: ${a.texto} con más de 2 decimales`);
  }
  assert.ok(parejo / n >= 0.8, `solo ${parejo} de ${n}`);
});
test('sin distractores absurdos: escala, kelvin, «subió», mediodía, densidad y sudor', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    if (typeof p.respuesta.valor !== 'number') continue;
    for (const a of p.alternativas.filter(x => !x.correcta)) {
      const r = Math.abs(a.valor) / Math.abs(p.respuesta.valor), msg = `semilla ${s} (${d.tipo}/${d.sub}): ${a.texto}`;
      assert.ok(r >= 1 / 20 && r <= 20, msg);
      if (p.respuesta.unidad === 'K') assert.ok(a.valor >= 0, msg);
      if (d.tipo === 'variacion') assert.ok(a.valor > 0, msg);
      if (d.sub === 'tanque') assert.ok(a.valor <= 60, msg);
      if (d.sub === 'densidad') assert.ok(a.valor >= 0.5 * d.rho0 && a.valor <= 1.5 * d.rho0, msg);
      if (d.tipo === 'sudor') assert.ok(a.valor <= 5000, msg);
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
  conv: ({ x, de, a, fusion, ebullicion }) => conv(x, de, a, [fusion, ebullicion]),
  'cruce-k-f': ({ delta }) => biseccion(k => conv(k, 'K', 'F') - (k + delta), 0, 5000),
  variacion: ({ T1, T2, de, a }) => conv(T2, de, a) - conv(T1, de, a),
  'joule-dT': ({ h, v0 }) => (10 * h + v0 * v0 / 2) / cAgua,
  'joule-h': ({ dT, v0 }) => biseccion(hh => 10 * hh + v0 * v0 / 2 - cAgua * dT, 0, 5000),
  aparente: ({ V0, gamma, alfa, dT }) => V0 * (1 + gamma * dT) - V0 * (1 + alfa * dT) ** 3,
  capacidad: ({ V0, alfa, dT }) => V0 * ((1 + alfa * dT) ** 3 - 1),
  densidad: ({ rho0, gamma, dT }) => rho0 / (1 + gamma * dT),
  sudor: ({ M, dT }) => M * 3500 * dT / 2450,
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
    assert.ok(Math.abs(r - v.espera) < 2e-3 * Math.max(1, Math.abs(v.espera)), `${q.id} (${v.tipo}): da ${r}, espera ${v.espera}`);
  }
});
