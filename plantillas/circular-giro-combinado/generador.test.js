// Pruebas del generador G9 (el giro con otro movimiento): casos.json (verificados aparte, a ciegas)
// y un recálculo independiente en cada uno de 600 problemas.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// Camino independiente: se pregunta, para cada ω candidata, dónde queda el agujero (o la marca)
// cuando la bala o la bolita llega, y se busca por bisección la menor ω que lo deja en su lugar.
// El vuelo de la bolita se halla como la raíz de y(t) = v0·t − g·t²/2, también por bisección.
function biseccion(g, a, b) {
  let ga = g(a);
  for (let i = 0; i < 300; i++) { const m = (a + b) / 2, gm = g(m); if ((gm > 0) === (ga > 0)) { a = m; ga = gm; } else b = m; }
  return (a + b) / 2;
}
const vuelta = 2 * Math.PI;
// Lo que falta girar (en rad, entre 0 y una vuelta) hasta que la marca buscada llegue al lugar,
// después de girar ω·t. Es negativo mientras no llega y cruza cero cuando llega por primera vez.
const giroQueFalta = (objetivo, w, t) => w * t - objetivo;
function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'discos' && d.sub === 'v') {
    const w = d.rpm ? d.rpm * vuelta / 60 : d.omegaPi * Math.PI;
    // La bala más rápida que llega cuando los discos giraron justo el desfase (menos de una vuelta).
    return biseccion(vb => giroQueFalta(d.phi / 360 * vuelta, w, d.L / vb), 1e-3, 1e5);
  }
  if (d.tipo === 'discos') return biseccion(w => giroQueFalta(d.phi / 360 * vuelta, w, d.t), 0, 1e5);
  if (d.tipo === 'cascaron') {
    // La bala entra por el punto (R, 0) y sale por (−R, 0): el agujero tiene que llegar al lado opuesto.
    const t = Math.hypot(2 * d.R, 0) / d.v;
    return biseccion(w => giroQueFalta(vuelta / 2, w, t), 0, 1e5);
  }
  // Con la altura máxima, la rapidez de lanzamiento sale de la altura en que v se anula (v² = v0² − 2gy).
  const v0 = d.H !== undefined ? biseccion(u => u * u / 20 - d.H, 0, 1e3) : d.v0;
  const t = biseccion(t => v0 * t - 10 * t * t / 2, 1e-6, 100);   // la raíz positiva del vuelo
  return biseccion(w => giroQueFalta(d.phi / 360 * vuelta, w, t), 0, 1e5);
}
probarGenerador(gen, { semillas: 600, recalcular: p => {
  const r = recalcular(p);
  return Math.abs(r - p.respuesta.valor) < 1e-8 * Math.max(1, Math.abs(r)) ? p.respuesta.valor : r;
} });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

test('salen los tres tipos y las variantes; las ω llevan π en todas sus alternativas y la rapidez, en ninguna', () => {
  const vistos = new Set();
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos; vistos.add(d.tipo + (d.sub ? '/' + d.sub : ''));
    const alt = p.alternativas;
    const conPi = alt.filter(a => a.texto.includes('π')).length;
    assert.equal(conPi, d.sub === 'v' ? 0 : alt.length, `semilla ${s}: ${alt.map(a => a.texto)}`);
    const unidad = a => a.texto.replace(/^[\d ,π/]+/, '');
    assert.equal(new Set(alt.map(unidad)).size, 1, `semilla ${s}: unidades distintas (${alt.map(a => a.texto)})`);
    for (const a of alt) assert.ok(!/\d,\d{3}/.test(a.texto), `semilla ${s}: más de dos decimales (${a.texto})`);
  }
  assert.deepEqual([...vistos].sort(), ['cascaron', 'discos/ms', 'discos/omega', 'discos/v', 'plataforma']);
});

test('datos creíbles: ω mínima de a lo más 200π rad/s y balas de 100 a 900 m/s', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.sub === 'v') assert.ok(p.respuesta.valor >= 100 && p.respuesta.valor <= 900, `semilla ${s}`);
    if (d.tipo === 'cascaron') assert.ok(d.v >= 100, `semilla ${s}`);
    if (d.tipo === 'discos' && d.sub === 'omega') assert.ok(d.L / d.t >= 100, `semilla ${s}`);
    if (d.sub === 'ms') assert.equal(d.L, undefined, `semilla ${s}: con ms no se da la separación`);
    else assert.ok(p.respuesta.valor <= 200 * Math.PI + 1e-9, `semilla ${s}: ${p.respuesta.valor}`);
  }
});

test('si sale CI-no-minima, la pregunta pide la menor o el enunciado dice «menos de una vuelta»; sin grados junto a π', () => {
  const plano = seg => seg.map(x => (typeof x === 'string' ? x : x.t)).join('');
  for (let s = 0; s < 1000; s++) {
    const p = gen.generar(s);
    const ids = p.alternativas.filter(a => a.error).map(a => a.error.id);
    assert.ok(!ids.includes('CI-grados-sin-radianes'), `semilla ${s}`);
    if (ids.includes('CI-no-minima')) assert.ok(/menor/.test(plano(p.pregunta)) || /menos de una vuelta/.test(plano(p.enunciado)), `semilla ${s}`);
    if (p._datos.phi === 360) assert.ok(/distinta de cero/.test(plano(p.pregunta)), `semilla ${s}: misma marca sin «distinta de cero»`);
  }
});
