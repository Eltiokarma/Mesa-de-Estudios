// Pruebas del generador geo-analitica: un recálculo independiente en cada uno de 600 problemas
// (medianas que se cortan, ángulos con atan2, extremos de la elipse por búsqueda numérica, corte de
// parábolas por bisección), casos.json, papel.json contra calc y que salen todos los tipos.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const P = require('../../nucleo/predicciones.js');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// Número decimal → fracción con denominador pequeño (búsqueda).
function aFraccion(x) {
  for (let d = 1; d <= 2000; d++) { const nn = Math.round(x * d); if (Math.abs(nn / d - x) < 1e-9) return [nn, d]; }
  throw new Error(`no es fracción: ${x}`);
}
const claveFr = x => { const q = P.frac(aFraccion(x)); return `fr:${q.n}/${q.d}`; };
const claveVec = (x, y) => P.vector([aFraccion(x), aFraccion(y)]).clave;
// Recta por (x0, y0) con dirección (dx, dy), como clave normalizada: normal (dy, −dx).
function claveRecta(x0, y0, dx, dy) {
  const fs = [dy, -dx, -(dy * x0 - dx * y0)].map(z => aFraccion(r9(z)));
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  const L = fs.reduce((m, [, q]) => m * q / mcd(m, q), 1);
  let [p, q, r] = fs.map(([nn, dd]) => nn * L / dd);
  const g = mcd(mcd(p, q), r);
  p /= g; q /= g; r /= g;
  if (p < 0 || (p === 0 && q < 0)) { p = -p; q = -q; r = -r; }
  return `recta:${p + 0},${q + 0},${r + 0}`;
}
const corte = (p1, p2, p3, p4) => {
  const d1 = [p2[0] - p1[0], p2[1] - p1[1]], d2 = [p4[0] - p3[0], p4[1] - p3[1]], den = d1[0] * d2[1] - d1[1] * d2[0];
  const t = ((p3[0] - p1[0]) * d2[1] - (p3[1] - p1[1]) * d2[0]) / den;
  return [p1[0] + t * d1[0], p1[1] + t * d1[1]];
};
const medio = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
const r9 = x => Math.round(x * 1e9) / 1e9;

// Extremos de la elipse: para cada x, la ecuación en y tiene raíz doble en los bordes izquierdo y
// derecho; se buscan con bisección del discriminante (y lo mismo con x e y cambiados).
function extremos(G, enX) {
  const [A, C, D, E, F] = G;
  // Discriminante de C y² + E y + (A x² + D x + F) = 0 en función de x (o al revés).
  const disc = t => (enX ? E * E - 4 * C * (A * t * t + D * t + F) : D * D - 4 * A * (C * t * t + E * t + F));
  // centro aproximado por muestreo: punto de mayor discriminante
  let mejor = 0, tm = 0;
  for (let t = -60; t <= 60; t += 0.01) { const d = disc(t); if (d > mejor) { mejor = d; tm = t; } }
  const raiz = (a, b) => { for (let i = 0; i < 200; i++) { const m = (a + b) / 2; if ((disc(a) > 0) === (disc(m) > 0)) a = m; else b = m; } return (a + b) / 2; };
  return [raiz(tm, tm - 100), raiz(tm, tm + 100)];
}
function elementosElipse(G) {
  const [x1, x2] = extremos(G, true), [y1, y2] = extremos(G, false);
  const h = r9((x1 + x2) / 2), k = r9((y1 + y2) / 2), sx = r9((x2 - x1) / 2), sy = r9((y2 - y1) / 2);
  const eje = sx > sy ? 'x' : 'y', a = Math.max(sx, sy), b = Math.min(sx, sy), c = r9(Math.sqrt(a * a - b * b));
  return { h, k, a, b, c, eje };
}

function recalcular(pr) {
  const d = pr._datos;
  if (d.tipo === 'baricentro') {
    let A, B, C;
    if (d.sub === 'banderin') { A = [0, d.y1]; B = [0, d.y2]; C = [d.d, (d.y1 + d.y2) / 2]; }
    else if (d.sub === 'base-x') { A = [d.x1, 0]; B = [d.x2, 0]; C = [(d.x1 + d.x2) / 2, d.hgt]; }
    else ({ A, B, C } = d);
    const G = corte(A, medio(B, C), B, medio(A, C));
    return claveVec(r9(G[0]), r9(G[1]));
  }
  if (d.tipo === 'angulo') {
    if (d.sub === 'rectangulo') {
      const { A, B, C, D } = d;
      const O = corte(A, C, B, D);
      const t1 = Math.atan2(A[1] - O[1], A[0] - O[0]), t2 = Math.atan2(B[1] - O[1], B[0] - O[0]);
      let th = Math.abs(t1 - t2); if (th > Math.PI) th = 2 * Math.PI - th;
      return claveFr(r9(Math.tan(th)));
    }
    // dirección de cada recta (−b, a) llevada a [0°, 180°); θ = ángulo de L1 a L2 antihorario.
    const dir = ([a, b]) => { let t = Math.atan2(a, -b); if (t < 0) t += Math.PI; if (t >= Math.PI - 1e-12) t -= Math.PI; return t; };
    let th = dir(d.l2) - dir(d.l1); if (th < 0) th += Math.PI;
    return claveFr(r9(Math.tan(th)));
  }
  if (d.tipo === 'elipse') {
    const e = elementosElipse(d.general);
    assert.equal(e.eje, d.eje);
    const u = e.eje === 'x' ? [1, 0] : [0, 1], w = e.eje === 'x' ? [0, 1] : [1, 0];
    const pt = (s, t) => [r9(e.h + s * u[0] + t * w[0]), r9(e.k + s * u[1] + t * w[1])];
    if (d.sub === 'foco') { const F = pt(e.c, 0); return claveVec(F[0], F[1]); }
    const V1 = pt(e.a, 0), F2 = pt(-e.c, 0), B1 = pt(0, e.b);
    const dir = [B1[0] - F2[0], B1[1] - F2[1]];
    return d.rel === 'paralela' ? claveRecta(V1[0], V1[1], r9(dir[0]), r9(dir[1])) : claveRecta(V1[0], V1[1], r9(-dir[1]), r9(dir[0]));
  }
  if (d.tipo === 'parabolas') {
    const a = d.a[0] / d.a[1], b = d.b[0] / d.b[1];
    const f = x => (a * x * x + d.c1) - (d.c2 - b * x * x);
    let lo = 0, hi = 100;
    for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if ((f(lo) > 0) === (f(m) > 0)) lo = m; else hi = m; }
    const x = (lo + hi) / 2, y = a * x * x + d.c1;
    // Volumen por capas: suma de discos de radio x en la altura y (integración numérica).
    let V = 0; const N = 1000; for (let i = 0; i < N; i++) V += Math.PI * x * x * (y / N);
    return V;
  }
  return NaN;
}
const igual = (a, b) => (typeof b === 'string' ? a === b : Math.abs(a - b) < 1e-6);
probarGenerador(gen, { semillas: 600, recalcular, igual });
// Las claves «fr:n/d» son números; las rectas y los vectores no se ordenan (NaN).
const { probarFugas } = require('../../nucleo/probar-generador.js');
probarFugas(gen, { valorNumerico: a => {
  if (typeof a.valor === 'number') return a.valor;
  const m = /^fr:(-?\d+)(?:\/(\d+))?$/.exec(a.valor);
  return m ? Number(m[1]) / Number(m[2] || 1) : NaN;
} });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    if (typeof c.esperado.respuesta === 'string') assert.equal(p.respuesta.valor, c.esperado.respuesta);
    else assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

test('salen todos los tipos y subtipos', () => {
  const vistos = new Set();
  for (let s = 0; s < 600; s++) { const d = gen.generar(s)._datos; vistos.add(d.tipo); vistos.add(d.tipo + ':' + d.sub + ':' + (d.rel || '')); }
  for (const t of gen.TIPOS) assert.ok(vistos.has(t), t);
  for (const t of ['baricentro:banderin:', 'baricentro:base-x:', 'baricentro:general:', 'angulo:rectangulo:', 'angulo:rectas:', 'elipse:foco:', 'elipse:recta:paralela', 'elipse:recta:perpendicular']) assert.ok(vistos.has(t), t);
});

test('las alternativas tienen la misma forma', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), t = p.alternativas.map(a => a.texto);
    const forma = x => (x.includes('= 0') ? 'recta' : x.startsWith('(') ? 'punto' : x.includes('π') ? 'pi' : 'fraccion');
    assert.equal(new Set(t.map(forma)).size, 1, `semilla ${s}: ${t.join(' | ')}`);
  }
});

function comparar(real, espera, msg) {
  if (Array.isArray(espera) || (typeof espera === 'object' && espera !== null)) for (const k of Object.keys(espera)) comparar(real[k], espera[k], `${msg}.${k}`);
  else if (typeof espera === 'number') assert.ok(Math.abs(real - espera) < 1e-6, `${msg}: da ${real}, espera ${espera}`);
  else assert.equal(real, espera, msg);
}
test('papel.json: formato', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 6 && papel.problemas.length <= 8);
  for (const p of papel.problemas) assert.ok(p.id && p.nivel && p.enunciado && p.respuesta && p.pasos.length && p.verificar.length, p.id);
});
for (const p of papel.problemas) test(`papel ${p.id}`, () => {
  for (const v of p.verificar) comparar(gen.calc[v.fn](...v.args), v.espera, `${p.id} ${v.fn}`);
});
