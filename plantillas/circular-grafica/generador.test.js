// Pruebas del generador G7 (la gráfica ω-t): casos.json (verificados aparte, a ciegas) y un
// recálculo independiente en cada uno de 600 problemas.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// Camino independiente: no se arman triángulos ni trapecios. Se interpola ω(t) entre los puntos y se
// integra con la regla del trapecio en una malla muy fina (ω con signo para el desplazamiento; |ω|
// para lo recorrido), como haría una simulación paso a paso del giro.
function omega(pts, t) {
  let k = 1;
  while (k < pts.length - 1 && t > pts[k][0]) k++;
  const [a, wa] = pts[k - 1], [b, wb] = pts[k];
  return wa + (wb - wa) * (t - a) / (b - a);
}
function integrar(pts, t1, t2, g, n = 100000) {
  const hh = (t2 - t1) / n;
  let s = 0, prev = g(omega(pts, t1));
  for (let i = 1; i <= n; i++) { const x = g(omega(pts, t1 + i * hh)); s += (prev + x) / 2 * hh; prev = x; }
  return s;
}
function recalcular(p) {
  const d = p._datos;
  const neto = integrar(d.puntos, d.t1, d.t2, w => w), rec = integrar(d.puntos, d.t1, d.t2, Math.abs);
  if (d.tipo === 'neto' || d.tipo === 'angulo') return neto;
  if (d.tipo === 'recorrido') return rec;
  return rec * Math.PI / (2 * Math.PI);        // ω en múltiplos de π: el área en π rad, entre 2π
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

test('salen los cuatro tipos; las alternativas llevan la misma unidad; neto con signo y lo demás positivo', () => {
  const tipos = new Set();
  let negativas = 0;
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos; tipos.add(d.tipo);
    const alt = p.alternativas;
    const unidad = a => a.texto.replace(/^[−\d ,]+/, '').replace(/^vuelta$/, 'vueltas');
    assert.equal(new Set(alt.map(unidad)).size, 1, `semilla ${s}: unidades distintas (${alt.map(a => a.texto)})`);
    assert.ok(alt.every(a => !a.texto.includes('π')), `semilla ${s}: una alternativa con π`);
    for (const a of alt) assert.ok(!/\d,\d{3}/.test(a.texto), `semilla ${s}: más de dos decimales (${a.texto})`);
    if (d.tipo !== 'neto') assert.ok(alt.every(a => a.valor > 0), `semilla ${s}: magnitud con signo`);
    if (d.tipo === 'neto' && p.respuesta.valor < 0) negativas++;
    // La gráfica del enunciado trae todos los puntos.
    const texto = p.enunciado.map(x => (typeof x === 'string' ? x : x.t)).join('');
    for (const [t] of d.puntos) assert.ok(texto.includes(`(${t} s;`), `semilla ${s}: falta el punto de t = ${t}`);
  }
  assert.deepEqual([...tipos].sort(), ['angulo', 'neto', 'recorrido', 'vueltas']);
  assert.ok(negativas > 5, `solo ${negativas} desplazamientos negativos`);
});

test('en «recorrido» y «neto» la gráfica cruza el eje dentro del intervalo; en «angulo», nunca es negativa', () => {
  for (let s = 0; s < 600; s++) {
    const d = gen.generar(s)._datos;
    const dentro = []; for (let i = 0; i <= 1000; i++) dentro.push(omega(d.puntos, d.t1 + (d.t2 - d.t1) * i / 1000));
    if (d.tipo === 'recorrido' || d.tipo === 'neto') assert.ok(dentro.some(w => w > 0) && dentro.some(w => w < 0), `semilla ${s}`);
    if (d.tipo === 'angulo') assert.ok(d.puntos.every(([, w]) => w >= 0), `semilla ${s}`);
  }
});
