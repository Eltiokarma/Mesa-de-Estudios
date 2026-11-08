// Pruebas del generador de triángulos oblicuángulos: casos.json (los verifica otro, a ciegas), papel.json
// contra calc, y un recálculo independiente por coordenadas en cada uno de 600 problemas.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// Camino independiente: se dibuja cada triángulo en el plano con el coseno de academia (3-4-5, 7-24-25) y se
// mide todo con coordenadas (distancias, atan2, fórmula del cordón para áreas, búsqueda numérica de raíces y de
// mínimos). El seno sale de √(1 − cos²) porque son ángulos de un triángulo.
const COS = { 16: 24 / 25, 30: Math.sqrt(3) / 2, 37: 0.8, 45: Math.SQRT1_2, 53: 0.6, 60: 0.5, 74: 7 / 25, 90: 0 };
const cosA = g => (g in COS ? COS[g] : -COS[180 - g]);
const senA = g => Math.sqrt(1 - cosA(g) ** 2);
const cerca = (a, b) => Math.abs(a - b) < 1e-7 * Math.max(1, Math.abs(b));
const dist = (P, Q) => Math.hypot(P[0] - Q[0], P[1] - Q[1]);
const area = (...V) => Math.abs(V.reduce((s, P, i) => { const Q = V[(i + 1) % V.length]; return s + P[0] * Q[1] - Q[0] * P[1]; }, 0)) / 2;
const anguloEn = (V, P, Q) => { const u = [P[0] - V[0], P[1] - V[1]], w = [Q[0] - V[0], Q[1] - V[1]]; return Math.acos((u[0] * w[0] + u[1] * w[1]) / Math.hypot(...u) / Math.hypot(...w)); };
function raices(f, x0, x1, n = 20000) {
  const r = [], paso = (x1 - x0) / n;
  for (let i = 0; i < n; i++) {
    let lo = x0 + i * paso, hi = lo + paso;
    if (f(lo) === 0) { r.push(lo); continue; }
    if (f(lo) * f(hi) < 0) { for (let k = 0; k < 80; k++) { const m = (lo + hi) / 2; if (f(lo) * f(m) <= 0) hi = m; else lo = m; } r.push((lo + hi) / 2); }
  }
  return r;
}
function minimo(f, lo, hi) { // sección áurea
  const g = (Math.sqrt(5) - 1) / 2;
  for (let k = 0; k < 300; k++) { const x1 = hi - g * (hi - lo), x2 = lo + g * (hi - lo); if (f(x1) < f(x2)) hi = x2; else lo = x1; }
  return (lo + hi) / 2;
}
// Triángulo con base BC = 1 y ángulos B y C en sus extremos (por intersección de rayos).
function porAngulos(B, C) {
  const tB = senA(B) / cosA(B), tC = senA(C) / cosA(C);
  if (Math.abs(cosA(B)) < 1e-12) return [[0, tC], [0, 0], [1, 0]];
  if (Math.abs(cosA(C)) < 1e-12) return [[1, tB], [0, 0], [1, 0]];
  const x = tC / (tB + tC);
  return [[x, x * tB], [0, 0], [1, 0]];
}

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'ceviana') {
    const B = [0, 0], C = [d.a, 0];
    const ax = (d.c * d.c - d.b2 + d.a * d.a) / (2 * d.a), A = [ax, Math.sqrt(d.c * d.c - ax * ax)];  // corte de dos circunferencias
    const r = raices(x => dist(A, [x, 0]) - d.d, 1e-9, d.a - 1e-9);
    assert.equal(r.length, 1, 'un solo punto D en BC');
    return d.pide === 'BD' ? r[0] : d.a - r[0];
  }
  if (d.tipo === 'faro') {
    let pp = d.p, q = d.q;
    if (d.sub === 'depresion') { pp = d.h / d.tA; q = d.h / d.tB; }
    if (d.sub === 'visuales') { pp = Math.sqrt(d.L1 ** 2 - d.h ** 2); q = Math.sqrt(d.L2 ** 2 - d.h ** 2); }
    return dist([pp, 0], [q * cosA(d.theta), q * senA(d.theta)]);
  }
  if (d.tipo === 'ley-tangentes') {
    if (d.sub === 'semidiferencia') {
      const C = [0, 0], B = [d.a, 0], A = [d.b * cosA(d.C), d.b * senA(d.C)];
      return Math.tan((anguloEn(A, B, C) - anguloEn(B, A, C)) / 2);
    }
    const k = d.k[0] / d.k[1];
    const a = raices(x => Math.tan((Math.atan2(x, d.s - x) - Math.atan2(d.s - x, x)) / 2) - k, d.s / 2 + 1e-9, d.s - 1e-9)[0];
    return a * (d.s - a) / 2;
  }
  if (d.tipo === 'areas') {
    const A = [0, 0], B = [d.c, 0], C = [d.b * cosA(d.A), d.b * senA(d.A)];
    if (d.sub === 'area') return area(A, B, C);
    // Bisectriz: dirección suma de los unitarios de AB y AC; se corta con BC.
    const u = [1 + cosA(d.A), senA(d.A)];
    const t = raices(s => { const P = [B[0] + s * (C[0] - B[0]), B[1] + s * (C[1] - B[1])]; return P[0] * u[1] - P[1] * u[0]; }, -1e-9, 1 + 1e-9)[0];
    return dist(A, [B[0] + t * (C[0] - B[0]), B[1] + t * (C[1] - B[1])]);
  }
  if (d.tipo === 'circunradio') {
    if (d.sub === 'lado-R') { const y0 = d.a / 2 * cosA(d.A) / senA(d.A); return Math.hypot(d.a / 2, y0); } // centro sobre la mediatriz de BC
    const C = 180 - d.A - d.B;
    if (d.sub === 'area-R') {
      const a = Math.acos(cosA(d.A)), b = Math.acos(cosA(d.B)), P = t => [d.R * Math.cos(t), d.R * Math.sin(t)];
      return area(P(0), P(2 * a), P(2 * a + 2 * b));         // ángulo inscrito = mitad del arco
    }
    const T = porAngulos(d.B, C), per = dist(T[0], T[1]) + dist(T[1], T[2]) + dist(T[2], T[0]);
    return area(...T) * (d.p / per) ** 2;
  }
  if (d.tipo === 'lado-minimo') {
    const S = d.S, f = b => { const c = 2 * S / (b * senA(d.A)); return b * b + c * c - 2 * b * c * cosA(d.A); };
    const b = minimo(f, 0.01, 1000);
    return d.sub === 'valor' ? Math.sqrt(f(b)) : b;
  }
  if (d.tipo === 'doblez') {
    const A = [0, 0], C = [d.L, d.W];
    const e = raices(x => dist([x, 0], A) - dist([x, 0], C), 1e-9, d.L)[0];
    return d.sub === 'longitud' ? e : Math.cos(anguloEn([e, 0], A, C));
  }
  throw new Error('tipo desconocido ' + d.tipo);
}
probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => Math.abs(a - b) < 1e-6 * Math.max(1, Math.abs(b)) });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

test('salen los siete tipos y sus subtipos', () => {
  const vistos = new Set();
  for (let s = 0; s < 600; s++) { const d = gen.generar(s)._datos; vistos.add(d.tipo); vistos.add(`${d.tipo}/${d.sub || d.pide}`); }
  for (const t of ['ceviana/BD', 'ceviana/DC', 'faro/directo', 'faro/depresion', 'faro/visuales', 'ley-tangentes/semidiferencia', 'ley-tangentes/rectangulo',
    'areas/area', 'areas/bisectriz', 'circunradio/area-R', 'circunradio/lado-R', 'circunradio/perimetro', 'lado-minimo/valor', 'lado-minimo/lados',
    'doblez/coseno', 'doblez/longitud']) assert.ok(vistos.has(t), `no sale ${t}`);
});

test('alternativas sin decimales, con una sola unidad y colores válidos', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas) assert.ok(!/,\d/.test(a.texto), `semilla ${s}: decimal en ${a.texto}`);
    const unidades = new Set(p.alternativas.map(a => (a.texto.match(/[a-z²]+$/) || [''])[0]));
    assert.equal(unidades.size, 1, `semilla ${s}: mezcla unidades`);
    const colores = Object.values(p.variables).map(x => x.color);
    assert.ok(colores.length <= 4 && new Set(colores).size === colores.length && colores.every(c => 'oihd'.includes(c)), `semilla ${s}: colores`);
  }
});

test('doblez: el coseno del ángulo obtuso sale negativo', () => {
  for (let s = 0; s < 600; s++) { const p = gen.generar(s); if (p._datos.tipo === 'doblez' && p._datos.sub === 'coseno') assert.ok(p.respuesta.valor < 0); }
});

function campo(o, k) { return k.split('.').reduce((x, c) => (x == null ? undefined : x[c]), o); }
test('papel.json: entre 6 y 8 problemas con respuesta, pasos y verificación', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 6 && papel.problemas.length <= 8);
  for (const q of papel.problemas) {
    assert.ok(q.id && q.enunciado && q.respuesta && q.pasos.length && q.verificar.length, q.id);
    assert.ok(['básico', 'intermedio', 'avanzado'].includes(q.nivel), q.id);
    assert.ok(!/\d\.\d/.test(q.enunciado + q.respuesta + q.pasos.join('')), `${q.id}: coma decimal`);
  }
});
for (const q of papel.problemas) test(`papel ${q.id}`, () => {
  for (const vf of q.verificar) {
    const r = gen.calc[vf.fn](...vf.args);
    if (typeof vf.espera === 'number') assert.ok(cerca(r, vf.espera), `${q.id}: ${vf.fn} da ${r}`);
    else for (const [k, x] of Object.entries(vf.espera)) assert.ok(cerca(campo(r, k), x), `${q.id}: ${vf.fn}.${k} da ${campo(r, k)}`);
  }
});
