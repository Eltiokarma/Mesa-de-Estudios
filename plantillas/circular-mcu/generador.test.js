// Pruebas del generador G1 (MCU, conversiones y puntos de un mismo cuerpo): casos.json (verificados
// aparte, a ciegas) y un recálculo independiente en cada uno de 600 problemas.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// Camino independiente: todo se lleva a grados por segundo y a metros, y se vuelve a radianes al
// final. La aceleración centrípeta sale de |Δv|/Δt entre dos instantes muy cercanos (cuerda de las
// dos velocidades), y la latitud, de la posición del punto en la esfera (su distancia al eje).
const RAD = Math.PI / 180;
function gradosPorSegundo(d) {
  if (d.modo === 'rpm') return (d.rpm ?? d.dato) * 360 / 60;
  if (d.modo === 'periodo') return 360 / d.dato;
  return d.n * 360 / (d.minutos ? 60 * d.t : d.t);
}
function acpPorDeltaV(v, r) {
  const w = v / r, dt = 1e-6, dth = w * dt;
  const v1 = [0, v], v2 = [-v * Math.sin(dth), v * Math.cos(dth)];
  return Math.hypot(v2[0] - v1[0], v2[1] - v1[1]) / dt;
}
function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'omega') return gradosPorSegundo(d) * RAD;
  if (d.tipo === 'v') {
    const vueltasPorSeg = gradosPorSegundo(d) / 360, r = d.r / 100;
    return vueltasPorSeg * (2 * Math.PI * r);              // una circunferencia por vuelta
  }
  if (d.tipo === 'acp') return d.sub === 'v' ? acpPorDeltaV(d.v, d.r) : acpPorDeltaV(d.omega * d.rcm / 100, d.rcm / 100);
  if (d.tipo === 'vueltas') {
    if (d.modo === 'pi-min') return d.k * Math.PI / RAD * 60 * d.minutos / 360;
    return d.rpm / 60 * d.t;
  }
  if (d.tipo === 'rigido') {
    // En 1 s, cada marca recorre un arco de la misma fracción de su circunferencia.
    if (d.sub === 'rapidez') { const frac = d.vA / (2 * Math.PI * d.rA / 100); return frac * 2 * Math.PI * d.rB / 100; }
    if (d.sub === 'razon') return (2 * Math.PI * d.R) / (2 * Math.PI * (d.R - d.dB));
    // diferencia: el radio de A sale de la proporción vA/rA = vB/(rA + d); luego ω = vA/rA.
    const rA = d.vA * (d.d / 100) / (d.vB - d.vA);
    return d.vA / rA;
  }
  // latitud: posición del punto en la esfera y su distancia al eje (z).
  const x = d.R * Math.cos(d.lambda * RAD), y = 0, z = d.R * Math.sin(d.lambda * RAD);
  assert.ok(Math.abs(Math.hypot(x, y, z) - d.R) < 1e-9);
  return 2 * Math.PI * Math.hypot(x, y) / d.T;
}
// Los notables de academia (cos 37° = 0,8) no son los exactos: la latitud se compara con ellos.
const NOT = { 37: 0.8, 53: 0.6, 60: 0.5 };
probarGenerador(gen, { semillas: 600, recalcular: p => {
  let r = recalcular(p);
  const d = p._datos;
  if (d.tipo === 'latitud') r = r / Math.cos(d.lambda * RAD) * NOT[d.lambda];
  return Math.abs(r - p.respuesta.valor) < 1e-7 * Math.max(1, Math.abs(r)) ? p.respuesta.valor : r;
} });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

test('salen los seis tipos y las alternativas tienen la misma forma (todas con π o ninguna) y la misma unidad', () => {
  const tipos = new Set(), subs = new Set();
  for (let s = 0; s < 500; s++) {
    const p = gen.generar(s), d = p._datos; tipos.add(d.tipo); if (d.sub) subs.add(d.sub);
    const alt = p.alternativas;
    const conPi = alt.filter(a => a.texto.includes('π')).length;
    assert.ok(conPi === 0 || conPi === alt.length, `semilla ${s}: mezcla π con números (${alt.map(a => a.texto)})`);
    assert.equal(conPi > 0, ['omega', 'v', 'latitud'].includes(d.tipo), `semilla ${s}: π donde no va`);
    const unidad = a => a.texto.replace(/^[\d ,π/]+/, '').replace(/^vuelta$/, 'vueltas');
    assert.equal(new Set(alt.map(unidad)).size, 1, `semilla ${s}: unidades distintas (${alt.map(a => a.texto)})`);
    for (const a of alt) assert.ok(!/\d,\d{3}/.test(a.texto), `semilla ${s}: más de dos decimales (${a.texto})`);
  }
  assert.deepEqual([...tipos].sort(), ['acp', 'latitud', 'omega', 'rigido', 'v', 'vueltas']);
  assert.deepEqual([...subs].sort(), ['diferencia', 'omega', 'rapidez', 'razon', 'v']);
});

test('los datos son creíbles: a lo más 1200 rpm y un borde a menos de 26 m/s', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.rpm) assert.ok(d.rpm <= 1200, `semilla ${s}`);
    if (d.tipo === 'v') assert.ok(p.respuesta.valor < 26, `semilla ${s}: ${p.respuesta.valor} m/s`);
  }
});
