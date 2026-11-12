// Pruebas del generador de coordenadas polares: casos.json (verificados aparte, a ciegas), papel.json
// contra `calc` y un recálculo independiente en cada uno de 600 problemas.
//
// Camino independiente: se comprueban PUNTOS de la curva. Para una ecuación polar se recorren muchos θ,
// se calcula el punto (r cos θ; r sen θ) y se mira si cumple la ecuación cartesiana (la del enunciado o la
// de la respuesta). La correcta debe cumplirse en todos los puntos; cada distractor debe fallar en
// alguno (así ninguno es defendible). Los puntos se convierten con Math.cos, Math.sin y Math.atan2.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

const R = Math.PI / 180;
const fr = Number;
// Clave polar → r(θ) (o null si r^2 < 0).
function rDe(clave) {
  if (clave.startsWith('pf:')) { const [N, D0, Dc, Ds] = clave.slice(3).split('|').map(fr); return t => N / (D0 + Dc * Math.cos(t) + Ds * Math.sin(t)); }
  const [pot, resto] = [Number(clave.split(':')[1]), clave.split(':')[2]];
  const [K0, Kc, Ks] = resto.split('|').map(fr);
  return t => { const w = K0 + Kc * Math.cos(t) + Ks * Math.sin(t); return pot === 2 ? (w >= 0 ? Math.sqrt(w) : NaN) : w; };
}
const rDeDatos = q => (q.forma === 'frac' ? t => q.N / (q.D0 + q.Dc * Math.cos(t) + q.Ds * Math.sin(t)) : t => q.K0 + q.Kc * Math.cos(t) + q.Ks * Math.sin(t));
const cartF = c => (x, y) => c[0] * x * x + c[1] * y * y + c[2] * x + c[3] * y + c[4];
const cartDeClave = clave => cartF(clave.slice(5).split('|').map(fr));
// ¿Todos los puntos de r(θ) (con r finito y no muy grande) cumplen F = 0? Al menos 100 puntos válidos.
function cumple(r, F, dx = 0, dy = 0) {
  let n = 0;
  for (let i = 0; i < 720; i++) {
    const t = (i + 0.37) * 0.5 * R, rr = r(t);
    if (!Number.isFinite(rr) || Math.abs(rr) > 1e4) continue;
    n++;
    if (Math.abs(F(rr * Math.cos(t) + dx, rr * Math.sin(t) + dy)) > 1e-6 * Math.max(1, rr * rr)) return false;
  }
  return n >= 100;
}
function chequeo(d, clave) {
  if (d.tipo === 'a-polar') {
    if (d.curva === 'trayectoria') return cumple(rDe(clave), (x, y) => y - (d.k - (x - d.m) ** 2 / (4 * d.p)), d.m, d.k - d.p);
    return cumple(rDe(clave), cartF(d.cart));
  }
  if (d.tipo === 'a-cartesiana') return clave.slice(5).split('|').some(t => fr(t) !== 0) && cumple(rDeDatos(d.polar), cartDeClave(clave));
  if (d.tipo === 'punto-a-cart') {
    const [x, y] = clave.slice(3).split('|').map(Number);
    return Math.abs(x - d.r * Math.cos(d.theta * R)) < 1e-6 && Math.abs(y - d.r * Math.sin(d.theta * R)) < 1e-6;
  }
  const [r, g] = clave.slice(3).split('|').map(Number);
  const gg = ((Math.atan2(d.y, d.x) / R) % 360 + 360) % 360;
  return Math.abs(r - Math.hypot(d.x, d.y)) < 1e-6 && Math.abs(g - gg) < 1e-6 && g >= 0 && g < 360;
}
probarGenerador(gen, { semillas: 600, recalcular: p => (chequeo(p._datos, p.respuesta.valor) ? p.respuesta.valor : 'no cumple'), igual: (a, b) => a === b });
// Fugas: la correcta no se adivina por ser la central ni por estar en un extremo.
const { probarFugas } = require('../../nucleo/probar-generador.js');
probarFugas(gen, { valorNumerico: a => (typeof a.valor === 'number' ? a.valor : NaN) });

// Control contra la estrategia «elige la alternativa más parecida a las demás» (Hamming sobre las partes
// de la clave; con empate se reparte). No debe acertar más del 40 %.
test('la alternativa central no delata la correcta', () => {
  const partes = c => c.split(/[:|]/);
  const ham = (a, b) => { const x = partes(a), y = partes(b); let d = Math.abs(x.length - y.length); for (let i = 0; i < Math.min(x.length, y.length); i++) if (x[i] !== y[i]) d++; return d; };
  let aciertos = 0;
  for (let s = 0; s < 600; s++) {
    const alt = gen.generar(s).alternativas;
    const suma = alt.map(a => alt.reduce((t, b) => t + ham(a.valor, b.valor), 0)), min = Math.min(...suma);
    const centrales = alt.filter((a, i) => suma[i] === min);
    if (centrales.some(a => a.correcta)) aciertos += 1 / centrales.length;
  }
  assert.ok(aciertos / 600 <= 0.4, `la central acierta el ${Math.round(aciertos / 6)} %`);
});

test('ningún distractor cumple la condición (ninguno es defendible)', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas.filter(x => !x.correcta)) assert.ok(!chequeo(p._datos, a.valor), `semilla ${s}: ${a.texto} (${a.error.id}) también cumple`);
  }
});

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(p.respuesta.valor, c.esperado.respuesta);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

test('salen todos los tipos y curvas; textos limpios', () => {
  const vistos = new Set();
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s); vistos.add(p._datos.tipo + '/' + (p._datos.curva || ''));
    const todo = [...p.enunciado, ...p.pregunta, ...p.solucion.flat(), ...p.alternativas.map(a => a.texto)].map(x => (typeof x === 'string' ? x : x.t)).join(' ');
    assert.ok(!/undefined|NaN|null|(^|[^\w])-\d|\d,\d/.test(todo), `semilla ${s}: texto roto o con decimales: ${todo}`);
    const col = Object.values(p.variables).map(x => x.color);
    assert.ok(col.length <= 4 && new Set(col).size === col.length);
  }
  for (const t of ['a-polar/recta-x', 'a-polar/recta', 'a-polar/circ-polo', 'a-polar/circ-cos', 'a-polar/parabola', 'a-polar/trayectoria',
    'a-cartesiana/recta-y', 'a-cartesiana/circ-sen', 'a-cartesiana/parabola', 'punto-a-cart/', 'punto-a-polar/']) assert.ok(vistos.has(t), `no sale ${t}`);
});

const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
const campo = (o, k) => k.split('.').reduce((x, c) => (x == null ? undefined : x[c]), o);
test('papel.json: 6 a 8 problemas, con respuesta, pasos y verificación', () => {
  assert.ok(papel.titulo && papel.indicacion && papel.problemas.length >= 6 && papel.problemas.length <= 8);
  for (const p of papel.problemas) {
    assert.ok(p.id && p.enunciado && p.respuesta && p.pasos.length && p.verificar.length && ['básico', 'intermedio', 'avanzado'].includes(p.nivel), p.id);
    assert.ok(!/\d\.\d/.test([p.enunciado, p.respuesta, ...p.pasos].join(' ')), `${p.id}: coma decimal`);
  }
});
for (const p of papel.problemas) test(`papel ${p.id}: coincide con calc`, () => {
  for (const v of p.verificar) {
    const r = gen.calc[v.fn](...v.args);
    for (const [k, e] of Object.entries(v.espera)) {
      const x = campo(r, k);
      if (typeof e === 'number') assert.ok(Math.abs(x - e) < 1e-6, `${p.id} · ${k}: ${x}`); else assert.equal(x, e, `${p.id} · ${k}`);
    }
  }
});
