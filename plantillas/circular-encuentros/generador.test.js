// Pruebas del generador G8 (encuentros en la circunferencia): casos.json (verificados aparte, a ciegas)
// y un recálculo independiente en cada uno de 600 problemas.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// Camino independiente: se sigue a los dos móviles en el tiempo (ángulo en vueltas, sin dar vuelta a
// cero) y se busca, avanzando a pasos y afinando por bisección, el instante en que pasa lo pedido.
// Para la salida, se cuentan las vueltas de A una por una hasta que B también esté en P.
const vps = (modo, dato) => (modo === 'pi' ? dato[0] / dato[1] / 2 : modo === 'periodo' ? 1 / dato : dato / 60);
function afinar(g, a, b) {
  let ga = g(a);
  for (let i = 0; i < 100; i++) { const m = (a + b) / 2, gm = g(m); if ((gm > 0) === (ga > 0)) { a = m; ga = gm; } else b = m; }
  return (a + b) / 2;
}
// Primer t > 0 en que g(t) cambia de signo, avanzando con paso h.
function primerCruce(g, h, tmax) {
  let t = 1e-9, gt = g(t);
  while (t < tmax) {
    const t2 = t + h, g2 = g(t2);
    if (g2 === 0) return t2;
    if ((g2 > 0) !== (gt > 0)) return afinar(g, t, t2);
    t = t2; gt = g2;
  }
  return NaN;
}
function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'salida') {
    const nA = vps(d.modo, d.A), nB = vps(d.modo, d.B);
    for (let k = 1; k < 10000; k++) {
      const t = k / nA, vB = t * nB;                 // A acaba su k-ésima vuelta: ¿B está en P?
      if (Math.abs(vB - Math.round(vB)) < 1e-9) return d.pide === 'tiempo' ? t : k;
    }
    return NaN;
  }
  // Posiciones en vueltas, medidas desde la salida de A y en el sentido de A.
  let posA, posB, h, tmax;
  if (d.tipo === 'mcuv') {
    if (d.sub === 'alcance') {
      const w = d.w[0] / d.w[1] / 2, al = d.alfaB[0] / d.alfaB[1] / 2; // en vueltas/s y vueltas/s²
      posA = t => w * t; posB = t => al * t * t / 2;
    } else {
      const aA = d.alfaA[0] / d.alfaA[1] / 2, aB = d.alfaB[0] / d.alfaB[1] / 2, s = d.sub === 'ventaja' ? 1 : -1;
      posA = t => aA * t * t / 2; posB = t => s * aB * t * t / 2;
    }
    h = 1e-3; tmax = 100;
  } else {
    const nA = vps(d.modo, d.A), nB = vps(d.modo, d.B), g0 = d.grados / 360, s = d.mismo ? 1 : -1;
    posA = t => nA * t; posB = t => g0 + s * nB * t;
    h = 0.02 / (nA + nB); tmax = 5000;
  }
  const D = t => posA(t) - posB(t);
  if (d.tipo === 'separacion') {
    const sep = t => { const x = ((D(t) % 1) + 1) % 1; return Math.min(x, 1 - x); };
    return primerCruce(t => sep(t) - d.phi / 360, h, tmax);
  }
  // Encuentros (y la vuelta de ventaja): D(t) pasa por un entero. Se cuentan los cruces uno tras otro.
  const siguiente = desde => {
    let t = desde, k = Math.floor(D(t));
    while (t < tmax) {
      const t2 = t + h, k2 = Math.floor(D(t2));
      if (k2 !== k) { const m = Math.max(k, k2); return afinar(x => D(x) - m, t, t2); }
      t = t2;
    }
    return NaN;
  };
  const n = d.n || 1;
  let t = 0;
  for (let i = 0; i < n; i++) t = siguiente(t + 1e-7);
  return d.tipo === 'vueltas' ? posA(t) : t;
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

test('salen los cinco tipos, los tres modos y los tres casos con α; las alternativas llevan la misma unidad', () => {
  const tipos = new Set(), modos = new Set(), subs = new Set();
  for (let s = 0; s < 500; s++) {
    const p = gen.generar(s), d = p._datos;
    tipos.add(d.tipo); if (d.modo) modos.add(d.modo); if (d.sub) subs.add(d.sub);
    const unidad = a => a.texto.replace(/^[\d ,]+/, '').replace(/^vuelta$/, 'vueltas');
    assert.equal(new Set(p.alternativas.map(unidad)).size, 1, `semilla ${s}: unidades distintas`);
    for (const a of p.alternativas) assert.ok(!/\d,\d{3}/.test(a.texto), `semilla ${s}: más de dos decimales (${a.texto})`);
  }
  assert.deepEqual([...tipos].sort(), ['encuentro', 'mcuv', 'salida', 'separacion', 'vueltas']);
  assert.deepEqual([...modos].sort(), ['periodo', 'pi', 'rpm']);
  assert.deepEqual([...subs].sort(), ['alcance', 'contrario', 'ventaja']);
});

test('en el alcance con α, A nunca le saca una vuelta a B antes de que B lo alcance', () => {
  for (let s = 0; s < 600; s++) {
    const d = gen.generar(s)._datos;
    if (d.tipo !== 'mcuv' || d.sub !== 'alcance') continue;
    const w = d.w[0] / d.w[1] * Math.PI, al = d.alfaB[0] / d.alfaB[1] * Math.PI;
    assert.ok(w * w / (2 * al) < 2 * Math.PI, `semilla ${s}`);
  }
});
