// Pruebas del generador «El rayo que cambia de medio»: casos.json (calculados aparte), un recálculo
// independiente en cada uno de 600 problemas y la hoja de lápiz y papel.
// Camino independiente: no se usa n₁·sen i = n₂·sen r. El rayo refractado se busca con el principio
// de Fermat: entre un punto del primer medio y otro del segundo, la luz cruza la superficie donde el
// tiempo de viaje (n·distancia, o distancia/v) es mínimo; se busca por bisección el ángulo de salida
// que hace mínimo el tiempo en el punto de incidencia. La convención de sen 37° = 3/5 entra solo en
// la tabla de senos y cosenos de los datos.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const P = require('../../nucleo/predicciones.js');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

const S = { 30: 0.5, 37: 0.6, 45: Math.SQRT1_2, 53: 0.8, 60: Math.sqrt(3) / 2 };
const C = { 30: Math.sqrt(3) / 2, 37: 0.8, 45: Math.SQRT1_2, 53: 0.6, 60: 0.5 };
function biseccion(g, a, b) {
  let ga = g(a);
  for (let k = 0; k < 200; k++) { const m = (a + b) / 2, gm = g(m); if ((gm > 0) === (ga > 0)) { a = m; ga = gm; } else b = m; }
  return (a + b) / 2;
}
// Derivada del tiempo de viaje al mover el punto de cruce x, en x = 0. El rayo llega desde
// A = (−tan i, 1) en el medio de «lentitud» w1 y sigue hasta B = (tan r, −1) en el de lentitud w2
// (lentitud = n, o 1/v). Con el ángulo r correcto, el tiempo es estacionario en x = 0.
function dTiempo(si, ci, w1, w2, sr) {
  const A = [-si / ci, 1], cr = Math.sqrt(1 - sr * sr), B = [sr / cr, -1];
  // T(h) − T(−h) escrito sin restar números grandes: d(h) − d(−h) = (d(h)² − d(−h)²)/(d(h) + d(−h)) = −4·h·p/(d(h) + d(−h)).
  const hh = 1e-6;
  const dif = (p, q) => { const a = Math.hypot(hh - p, q), b = Math.hypot(-hh - p, q); return -4 * hh * p / (a + b); };
  return (w1 * dif(A[0], A[1]) + w2 * dif(B[0], B[1])) / (2 * hh);
}
// Seno del ángulo de refracción, o null si ningún ángulo hace estacionario el tiempo (reflexión total).
function fermat(si, ci, w1, w2) {
  const g = sr => dTiempo(si, ci, w1, w2, sr);
  const lo = 1e-9, hi = 1 - 1e-12;
  if ((g(lo) > 0) === (g(hi) > 0)) return null;
  return biseccion(g, lo, hi);
}
// El índice del segundo medio (desde el aire) que hace estacionario el tiempo con i y r dados.
const indiceFermat = (i, r) => biseccion(n => dTiempo(S[i], C[i], 1, n, S[r]), 1.0001, 10);
const ff = x => P.formatear(x, 2);

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'angulo' || (d.tipo === 'limite' && d.sub === 'sale')) { const s = fermat(S[d.i], C[d.i], d.n1, d.n2); return s === null ? 'total' : 'sen:' + s; }
  if (d.tipo === 'indice') return 'n:' + indiceFermat(d.i, d.r);
  if (d.tipo === 'ensayos') {
    const ns = indiceFermat(d.i1, d.r1);
    const n1 = d.desde ? ns : d.n1, n2 = d.desde ? d.n2 : ns;
    const s = fermat(S[d.i], C[d.i], n1, n2); return s === null ? 'total' : 'sen:' + s;
  }
  if (d.tipo === 'rapidez' && d.sub === 'angulo') { const s = fermat(S[d.i], C[d.i], 1 / d.v1, 1 / d.v2); return s === null ? 'total' : 'sen:' + s; }
  if (d.tipo === 'rapidez') {
    // La frecuencia es la de la fuente; la rapidez en el medio es c/n y λ = v/f.
    const c = 3e8, f0 = c / (d.l0 * 1e-9), vm = c / d.n;
    return `f=1;l=${ff(vm / f0 * 1e9)}`;
  }
  if (d.tipo === 'limite') {
    // Ángulo de incidencia en el que el rayo refractado deja de existir: se barre el seno de i.
    const s = biseccion(si => (fermat(si, Math.sqrt(1 - si * si), d.n1, d.n2) === null ? 1 : -1), 1e-6, 1 - 1e-9);
    return 'sen:' + s;
  }
  if (d.sub === 'circulo') {
    // Radio x en el que el rayo desde la linterna llega con el ángulo en que ya no sale (Fermat sin solución).
    const x = biseccion(x => (fermat(x / Math.hypot(x, d.h), d.h / Math.hypot(x, d.h), d.n, 1) === null ? 1 : -1), 1e-6, 100);
    return 'x:' + x;
  }
  // Profundidad aparente: un rayo casi vertical sale al aire; se prolonga hacia atrás.
  const th = 1e-4, sf = fermat(Math.sin(th), Math.cos(th), d.n, 1);
  return 'x:' + d.h * Math.tan(th) / Math.tan(Math.asin(sf));
}
function igual(a, b) {
  const [pa, va] = String(a).split(':'), [pb, vb] = String(b).split(':');
  if (va === undefined || vb === undefined || pa === 'f=1;l=' || pa.startsWith('f=')) return a === b;
  return pa === pb && Math.abs(Number(va) - Number(vb)) < 1e-5 * Math.max(1, Math.abs(Number(vb)));
}
probarGenerador(gen, { semillas: 600, recalcular, igual });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    const clave = p.respuesta.valor;
    if (typeof c.esperado.respuesta === 'number') assert.ok(Math.abs(Number(clave.split(':')[1]) - c.esperado.respuesta) <= casos.tolerancia, `da ${clave}`);
    else assert.equal(clave, c.esperado.respuesta);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

test('salen todos los tipos y subtipos', () => {
  const vistos = new Set();
  for (let s = 0; s < 600; s++) { const d = gen.generar(s)._datos; vistos.add(d.tipo + (d.sub ? '/' + d.sub : '')); }
  assert.deepEqual([...vistos].sort(), ['angulo/entra', 'angulo/sale', 'angulo/superficie', 'ensayos', 'fondo/aparente', 'fondo/circulo',
    'indice/normal', 'indice/superficie', 'limite/angulo', 'limite/sale', 'rapidez/angulo', 'rapidez/lambda']);
});

test('alternativas comparables: longitudes en m, ángulos en grados o frases; sin más de dos decimales', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos, alt = p.alternativas.map(a => a.texto);
    if (d.tipo === 'fondo') assert.ok(alt.every(t => /^\d+(,\d{1,2})? m$/.test(t)), `semilla ${s}: ${alt}`);
    if (d.tipo === 'indice') assert.ok(alt.every(t => /^[\d√/,]+$/.test(t)), `semilla ${s}: ${alt}`);
    if (d.sub === 'lambda') assert.ok(alt.every(t => /^f = [\d,]+ × 10¹⁴ Hz y λ = \d+(,\d+)? nm$/.test(t)), `semilla ${s}: ${alt}`);
    if (d.tipo === 'angulo' || d.tipo === 'ensayos' || (d.tipo === 'rapidez' && d.sub === 'angulo'))
      assert.ok(alt.every(t => /^(\d+°|arcsen\([\d√/]+\)|No pasa al otro medio.*|No entra.*)$/.test(t)), `semilla ${s}: ${alt}`);
    for (const t of alt) assert.ok(!/\d,\d{3}/.test(t), `semilla ${s}: ${t}`);
  }
});

test('los textos no dicen «de el» ni «a el», y no hay «undefined» ni «null»', () => {
  const plano = seg => seg.map(x => (typeof x === 'string' ? x : x.t)).join('');
  for (let s = 0; s < 1000; s++) {
    const p = gen.generar(s);
    const todo = [plano(p.enunciado), plano(p.pregunta), ...p.solucion.map(plano), ...p.alternativas.map(a => a.texto), ...p.alternativas.filter(a => a.error).map(a => a.error.explicacion)].join(' ');
    assert.ok(!/\b[Dd]e el\b|\b[Aa] el\b|undefined|null|NaN/.test(todo), `semilla ${s}: ${todo.match(/.{30}(de el|a el|undefined|null|NaN).{10}/)}`);
  }
});

test('la pregunta no revela la respuesta', () => {
  const plano = seg => seg.map(x => (typeof x === 'string' ? x : x.t)).join('');
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    assert.ok(!plano(p.pregunta).includes(p.respuesta.texto), `semilla ${s}`);
  }
});

// ---------- lápiz y papel ----------
const CALC = {
  snell: ([n1, n2, i]) => n1 * S[i] / n2,                               // seno del ángulo de refracción
  indice: ([i, r]) => S[i] / S[r],
  limite: ([n1, n2]) => n2 / n1,                                          // seno del ángulo límite
  sale: ([n1, n2, i]) => (n1 * S[i] > n2 ? 0 : 1),                        // 1 si sale, 0 si hay reflexión total
  rapidez: ([n]) => 3e8 / n,
  lambda: ([l0, n]) => l0 / n,
  circulo: ([h, n]) => { const s = 1 / n; return h * s / Math.sqrt(1 - s * s); },
  aparente: ([h, n]) => h / n,
};
test('papel.json: 5 a 10 problemas bien armados y verificados', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  assert.equal(new Set(papel.problemas.map(q => q.id)).size, papel.problemas.length);
  for (const q of papel.problemas) {
    for (const k of ['id', 'nivel', 'enunciado', 'respuesta']) assert.ok(q[k] !== undefined && q[k] !== '', `${q.id}: falta ${k}`);
    assert.ok(Array.isArray(q.pasos) && q.pasos.length, `${q.id}: sin pasos`);
    assert.ok(Array.isArray(q.verificar) && q.verificar.length, `${q.id}: sin verificar`);
    for (const t of [q.enunciado, q.respuesta, ...q.pasos]) assert.ok(!/<[a-z/][^>]*>/i.test(t), `${q.id}: tiene HTML`);
    for (const ver of q.verificar) {
      assert.ok(CALC[ver.tipo], `${q.id}: tipo ${ver.tipo} desconocido`);
      const x = CALC[ver.tipo](ver.args);
      assert.ok(Math.abs(x - ver.espera) <= 1e-6 * Math.max(1, Math.abs(ver.espera)), `${q.id}: ${ver.tipo} da ${x}, espera ${ver.espera}`);
    }
  }
});
