// Pruebas de «La patada en la gráfica»: casos.json (calculados aparte), un recálculo independiente
// en cada uno de 600 problemas, todos los tipos, unidades, textos y el papel.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador, topeEscala } = require('../../nucleo/probar-generador.js');

// ---- Camino independiente ----
// No se calcula el área con fórmulas: se simula el movimiento. F(t) se interpola entre los vértices
// y se integra paso a paso dv = F/m·dt y dW = F·v·dt (el trabajo como ∫F·v dt, no como cambio de
// energía cinética). En el rebote, la subida se simula con pasos de tiempo hasta que la rapidez es 0.
function fuerza(pts, t) {
  for (let i = 1; i < pts.length; i++) {
    const [t0, F0] = pts[i - 1], [t1, F1] = pts[i];
    if (t1 > t0 && t >= t0 && t <= t1) return F0 + (F1 - F0) * (t - t0) / (t1 - t0);
  }
  return 0;
}
function simular(pts, m, v0, n = 252000) { // 252000 es múltiplo de 1 a 10: los saltos caen en un borde de paso
  const ta = pts[0][0], tb = pts[pts.length - 1][0], dt = (tb - ta) / n;
  let vel = v0, W = 0;
  for (let i = 0; i < n; i++) {
    const tm = ta + (i + 0.5) * dt, F = fuerza(pts, tm), nueva = vel + F / m * dt;
    W += F * (vel + nueva) / 2 * dt;
    vel = nueva;
  }
  return { vel, W };
}
function subida(vel, g = 10, n = 1000) {
  // Lanzamiento vertical en pasos de tiempo (MRUV en cada paso) hasta que la rapidez llega a 0.
  const dt = vel / g / n; let y = 0, u = vel;
  while (u > 1e-12) { const paso = Math.min(dt, u / g); y += u * paso - g * paso * paso / 2; u -= g * paso; }
  return y;
}
function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'rapidez') return simular(d.puntos, d.m, d.v0).vel;
  if (d.tipo === 'trabajo') return simular(d.puntos, d.m, d.sub === 'contra' ? -d.v0 : d.v0).W;
  // rebote: energía al llegar al piso, rapidez, bote, subida simulada y lo que quita el aire al subir
  const vSuelo = Math.sqrt(2 * 10 * d.H * (1 - d.p / 100));
  return subida(d.e * vSuelo) * (1 - d.q / 100);
}
probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => Math.abs(a - b) <= 1e-5 * Math.max(1, Math.abs(a)) });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

test('salen todos los tipos, subtipos y formas de gráfica; las alternativas llevan la misma unidad', () => {
  const vistos = new Set(), formas = new Set();
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    vistos.add(d.tipo + '/' + d.sub);
    if (d.puntos) { const q = d.puntos, n = q.length; formas.add(q[0][1] > 0 ? 'escalon' : n === 3 ? 'triangulo' : q[n - 1][0] === q[n - 2][0] ? 'rampa' : 'trapecio'); }
    const unidad = a => a.texto.replace(/^[−\d ,]+/, '');
    assert.equal(new Set(p.alternativas.map(unidad)).size, 1, `semilla ${s}: unidades distintas (${p.alternativas.map(a => a.texto)})`);
    for (const a of p.alternativas) assert.ok(!/\d,\d{3}/.test(a.texto), `semilla ${s}: más de dos decimales (${a.texto})`);
  }
  assert.deepEqual([...vistos].sort(), ['rapidez/inicial', 'rapidez/reposo', 'rebote/ambas', 'rebote/bajada', 'rebote/solo-e', 'trabajo/contra', 'trabajo/mismo']);
  assert.deepEqual([...formas].sort(), ['escalon', 'rampa', 'trapecio', 'triangulo']);
});

test('las trampas del lote salen como alternativa', () => {
  const ids = new Set();
  for (let s = 0; s < 600; s++) for (const a of gen.generar(s).alternativas) if (a.error) ids.add(a.error.id);
  for (const id of ['IG-fmax-por-tiempo', 'IG-v0-nula', 'CH-e-en-la-altura', 'G4-lee-eje', 'M2-sin-signo', 'CH-sin-aire']) assert.ok(ids.has(id), `no sale ${id}`);
});

test('en «contra» la pelota sale más rápido de lo que llegó (trabajo positivo)', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.sub === 'contra') assert.ok(simular(d.puntos, d.m, -d.v0).vel > d.v0, `semilla ${s}`);
  }
});

test('los textos no dicen «de el» ni «a el»', () => {
  const plano = seg => seg.map(x => (typeof x === 'string' ? x : x.t)).join('');
  for (let s = 0; s < 1000; s++) {
    const p = gen.generar(s);
    const todo = [plano(p.enunciado), plano(p.pregunta), ...p.solucion.map(plano), ...p.alternativas.filter(a => a.error).map(a => a.error.explicacion)].join(' ');
    assert.ok(!/\b[Dd]e el\b|\b[Aa] el\b|sobre él/.test(todo), `semilla ${s}`);
  }
});

test('600 semillas: la correcta no es la única redonda y ningún distractor sale de 1/20 a 20 veces la correcta', () => {
  const dec = t => { const m = t.match(/,(\d+)/); return m ? m[1].length : 0; };
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    if (typeof p.respuesta.valor !== 'number') continue;
    const c = p.alternativas.find(a => a.correcta), otras = p.alternativas.filter(a => !a.correcta);
    assert.ok(dec(c.texto) >= Math.min(...otras.map(a => dec(a.texto))), `semilla ${s}: solo la correcta es redonda (${p.alternativas.map(a => a.texto)})`);
    for (const a of otras) assert.ok(a.valor / c.valor <= topeEscala(a) && a.valor / c.valor >= 1 / topeEscala(a), `semilla ${s}: ${a.texto} es absurdo frente a ${c.texto}`);
  }
});

test('nunca se queda sin cuatro alternativas (semillas 0 a 2000 y de texto)', () => {
  for (let s = 0; s <= 2000; s++) gen.generar(s);
  for (const s of ['entrada-1', 'entrada-2', 'salida-1', 'salida-3', 'alternativas-7']) gen.generar(s);
});

// ---- Papel: estructura y cada «verificar» recalculado con funciones propias del test ----
const PAPEL = {
  area: ([pts]) => simular(pts, 1, 0).vel,             // con m = 1 kg, Δv = J
  rapidez: ([pts, m, v0]) => simular(pts, m, v0).vel,
  trabajo: ([pts, m, v0]) => simular(pts, m, v0).W,
  rebote: ([H, e, p, q]) => subida(e * Math.sqrt(2 * 10 * H * (1 - p / 100))) * (1 - q / 100),
  'e-alturas': ([H, hh]) => Math.sqrt(2 * 10 * hh) / Math.sqrt(2 * 10 * H),
};
test('papel.json: estructura y respuestas recalculadas', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  assert.equal(new Set(papel.problemas.map(p => p.id)).size, papel.problemas.length);
  for (const p of papel.problemas) {
    for (const campo of ['enunciado', 'respuesta']) assert.ok(typeof p[campo] === 'string' && p[campo].length, `${p.id}: falta ${campo}`);
    assert.ok(Array.isArray(p.pasos) && p.pasos.length, `${p.id}: faltan pasos`);
    assert.ok(Array.isArray(p.verificar) && p.verificar.length, `${p.id}: falta verificar`);
    assert.ok(!/<[a-z\/]/i.test(JSON.stringify(p)), `${p.id}: tiene HTML`);
    for (const v of p.verificar) {
      assert.ok(PAPEL[v.tipo], `${p.id}: tipo desconocido ${v.tipo}`);
      const r = PAPEL[v.tipo](v.args);
      assert.ok(Math.abs(r - v.espera) <= 1e-4 * Math.max(1, Math.abs(v.espera)), `${p.id}: ${v.tipo} da ${r}, espera ${v.espera}`);
    }
  }
});
