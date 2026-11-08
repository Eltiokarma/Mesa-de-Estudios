// Pruebas del generador de proporcionalidad y semejanza: casos.json (verificados aparte, a ciegas),
// papel.json contra `calc`, y un recálculo independiente en cada uno de 600 problemas.
// El recálculo NO usa las fórmulas del generador: arma cada figura con coordenadas (rectas que se
// cortan, bisectrices como suma de vectores unitarios, la circunferencia por tres puntos) y mide.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// ---------- geometría con coordenadas ----------
const sub = (p, q) => [p[0] - q[0], p[1] - q[1]];
const sum = (p, q) => [p[0] + q[0], p[1] + q[1]];
const esc = (p, k) => [p[0] * k, p[1] * k];
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
const uni = p => esc(p, 1 / Math.hypot(p[0], p[1]));
const cruz = (p, q) => p[0] * q[1] - p[1] * q[0];
// Corte de la recta P + t·u con la recta Q + s·w.
function corte(P, u, Q, w) { const t = cruz(sub(Q, P), w) / cruz(u, w); return sum(P, esc(u, t)); }
const recta = (P, Q) => [P, sub(Q, P)];
const cortar = (r1, r2) => corte(r1[0], r1[1], r2[0], r2[1]);
// Triángulo con BC = a, AC = b, AB = c: B en el origen, C sobre el eje x.
function tri(a, b, c) {
  const x = (c * c - b * b + a * a) / (2 * a);
  return { A: [x, Math.sqrt(c * c - x * x)], B: [0, 0], C: [a, 0] };
}
const bisInt = (V, X, Y) => [V, sum(uni(sub(X, V)), uni(sub(Y, V)))];
const bisExt = (V, X, Y) => [V, sub(uni(sub(X, V)), uni(sub(Y, V)))];
const area = (p, q, r) => Math.abs(cruz(sub(q, p), sub(r, p))) / 2;
function circuncentro(A, B, C) {
  const m1 = esc(sum(A, B), 0.5), m2 = esc(sum(A, C), 0.5);
  const d1 = sub(B, A), d2 = sub(C, A);
  return corte(m1, [-d1[1], d1[0]], m2, [-d2[1], d2[0]]);
}
// Segundo corte de la recta que sale de X en la dirección u con la circunferencia (O, r).
function segundoCorte(X, u, O, r) {
  u = uni(u);
  const f = sub(X, O), b = 2 * (f[0] * u[0] + f[1] * u[1]), c = f[0] ** 2 + f[1] ** 2 - r * r;
  const disc = Math.sqrt(b * b - 4 * c), ts = [(-b - disc) / 2, (-b + disc) / 2];
  const t = Math.abs(ts[0]) > Math.abs(ts[1]) ? ts[0] : ts[1];
  return sum(X, esc(u, t));
}
const incentro = ({ A, B, C }) => cortar(bisInt(A, B, C), bisInt(B, A, C));

// Tres paralelas (dirección w) por A, B, C de la primera secante; la segunda secante sale de D en L1
// con un ángulo elegido para que su tramo entre L1 y Lk mida `largo`. Devuelve sus cortes con L1, L2, L3.
function dosSecantes(a, b, largo, hasta) {
  const w = [1, 0];
  const alfa = Math.asin(0.4 * Math.min(1, largo / (hasta === 2 ? a : a + b)));
  const s1 = [Math.cos(alfa), Math.sin(alfa)];
  const A = [0, 0], B = esc(s1, a), C = esc(s1, a + b);
  const yk = hasta === 2 ? B[1] : C[1];
  const fi = Math.PI - Math.asin(yk / largo);
  const D = [5, 0], s2 = [Math.cos(fi), Math.sin(fi)];
  return { D, E: corte(D, s2, B, w), F: corte(D, s2, C, w) };
}

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'thales') {
    if (d.sub === 'tres') { const { D, E, F } = dosSecantes(d.a, d.b, d.c, 2); assert.ok(Math.abs(dist(D, E) - d.c) < 1e-9); return dist(E, F); }
    if (d.sub === 'total') { const { D, E, F } = dosSecantes(d.a, d.b, d.d, 3); assert.ok(Math.abs(dist(D, F) - d.d) < 1e-9); return dist(E, F); }
    const AB = d.a + d.b, T = tri(d.L, Math.hypot(AB, d.L), AB); // ángulo recto en B: siempre existe
    const M = sum(T.A, esc(uni(sub(T.B, T.A)), d.a));
    if (d.sub === 'triangulo') return dist(M, corte(M, sub(T.C, T.B), T.A, sub(T.C, T.A)));
    const Q = corte(M, sub(T.C, T.B), T.A, sub(T.C, T.A));
    const R = corte(Q, sub(T.B, T.A), T.B, sub(T.C, T.B));
    return dist(R, T.C);
  }
  if (d.tipo === 'bisectriz') {
    if (d.sub === 'segmento') { const T = tri(d.a, d.b, d.c); return dist(T.B, cortar(bisInt(T.A, T.B, T.C), recta(T.B, T.C))); }
    if (d.sub === 'exterior') { const T = tri(d.a, d.b, d.c); return dist(T.C, cortar(bisExt(T.A, T.B, T.C), recta(T.B, T.C))); }
    // perímetro: se busca AC (por bisección) para que la bisectriz caiga a d.m de B.
    const a = d.m + d.n, BD = b => { const T = tri(a, b, d.c); return dist(T.B, cortar(bisInt(T.A, T.B, T.C), recta(T.B, T.C))); };
    let lo = Math.abs(a - d.c) + 1e-9, hi = a + d.c - 1e-9;
    for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (BD(mid) > d.m) lo = mid; else hi = mid; }
    return d.c + (lo + hi) / 2 + a;
  }
  if (d.tipo === 'incentro') {
    const T = tri(d.a, d.b, d.c), I = incentro(T);
    if (d.sub === 'razon') { const D = cortar(bisInt(T.A, T.B, T.C), recta(T.B, T.C)); return dist(T.A, I) / dist(I, D); }
    const M = corte(I, sub(T.C, T.B), T.A, sub(T.B, T.A));
    if (d.sub === 'paralela') {
      const N = corte(I, sub(T.C, T.B), T.A, sub(T.C, T.A));
      return d.pide === 'MN' ? dist(M, N) : dist(T.A, M) + dist(M, N) + dist(N, T.A);
    }
    const N = corte(I, sub(T.B, T.A), T.B, sub(T.C, T.B));
    return dist(T.B, M) + dist(M, I) + dist(I, N) + dist(N, T.B);
  }
  if (d.tipo === 'bis-semejanza') {
    if (d.sub === 'cuadrado') {
      const L = d.L, A = [0, 0], B = [L, 0], D = [0, L], E = [L, d.p];
      const F = corte(A, sub(E, A), B, sub(D, B));
      return d.pide === 'razon' ? dist(A, F) / dist(F, E) : dist(A, F);
    }
    // DE no depende de BC: se mide con dos BC distintos y deben coincidir.
    const medir = a => { const T = tri(a, d.b, d.c), D = cortar(bisInt(T.A, T.B, T.C), recta(T.B, T.C)); return dist(D, corte(D, sub(T.B, T.A), T.A, sub(T.C, T.A))); };
    const x1 = medir(Math.max(d.b, d.c)), x2 = medir((Math.abs(d.b - d.c) + Math.max(d.b, d.c)) / 2 + 0.3);
    assert.ok(Math.abs(x1 - x2) < 1e-9);
    return x1;
  }
  if (d.tipo === 'cuerdas') {
    if (d.sub === 'producto') {
      const P = [0, 0], A = [-d.PA, 0], B = [d.PB, 0], C = esc([Math.cos(1.1), Math.sin(1.1)], d.PC);
      const O = circuncentro(A, B, C), r = dist(O, A);
      return dist(P, segundoCorte(C, sub(P, C), O, r));
    }
    if (d.sub === 'iguales') {
      const R = d.s * d.s / d.e, O = [0, 0], A = [0, R], th = 2 * Math.asin(d.s / (2 * R));
      const B = [R * Math.sin(th), R * Math.cos(th)];
      assert.ok(Math.abs(dist(A, B) - d.s) < 1e-9);
      const y = B[1], x = Math.sqrt(d.e * d.e - (R - y) ** 2), E = [x, y];
      const D = segundoCorte(A, sub(E, A), O, R);
      return dist(E, D);
    }
    const A = [0, d.h], B = [-Math.sqrt(d.c ** 2 - d.h ** 2), 0], C = [Math.sqrt(d.b ** 2 - d.h ** 2), 0];
    return dist(circuncentro(A, B, C), A);
  }
  if (d.tipo === 'raices-areas') {
    // Se ubica P y se miden las tres áreas de verdad; luego se escala el dibujo.
    const A = [0, 0], B = [1, 0], C = [0.3, 0.8], T0 = area(A, B, C);
    const r = d.sub === 'total' ? [d.S1, d.S2, d.S3].map(Math.sqrt) : (() => { const q = [Math.sqrt(d.S1), Math.sqrt(d.S2)]; return [...q, Math.sqrt(d.S) - q[0] - q[1]]; })();
    const s = r[0] + r[1] + r[2], Pp = sum(sum(esc(A, r[0] / s), esc(B, r[1] / s)), esc(C, r[2] / s));
    const chico = (X, Y, Z) => { // triángulo pegado al lado YZ (opuesto a X)
      const p1 = corte(Pp, sub(Y, X), Y, sub(Z, Y)), p2 = corte(Pp, sub(Z, X), Y, sub(Z, Y));
      return area(Pp, p1, p2);
    };
    const medidas = [chico(A, B, C), chico(B, C, A), chico(C, A, B)].sort((x, y) => x - y);
    if (d.sub === 'total') {
      const dadas = [d.S1, d.S2, d.S3].sort((x, y) => x - y), k = dadas[2] / medidas[2];
      for (let i = 0; i < 3; i++) assert.ok(Math.abs(medidas[i] * k - dadas[i]) < 1e-6);
      return T0 * k;
    }
    const k = d.S / T0, esc3 = medidas.map(x => x * k);
    for (const sv of [d.S1, d.S2]) { const i = esc3.findIndex(x => Math.abs(x - sv) < 1e-6); assert.ok(i >= 0); esc3.splice(i, 1); }
    return esc3[0];
  }
  // mástil: la punta en 3D sobre D.
  const T = tri(d.a, d.b, d.c), D = cortar(bisInt(T.A, T.B, T.C), recta(T.B, T.C));
  return Math.hypot(D[0] - T.B[0], D[1] - T.B[1], d.H);
}
probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => Math.abs(a - b) < 1e-7 * Math.max(1, Math.abs(b)) });

test('casos.json: formato', () => {
  assert.equal(casos.plantilla, 'geo-proporcionalidad');
  assert.ok(casos.casos.length >= 12 && casos.casos.length <= 25);
});
for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

// papel.json: cada problema se verifica contra calc.
const campo = (r, k) => k.split('.').reduce((o, x) => (o == null ? undefined : o[x]), r);
test('papel.json: formato', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 6 && papel.problemas.length <= 8);
  const ids = new Set();
  for (const q of papel.problemas) {
    assert.ok(q.id && !ids.has(q.id)); ids.add(q.id);
    assert.ok(['básico', 'intermedio', 'avanzado'].includes(q.nivel));
    assert.ok(q.enunciado && q.respuesta && q.pasos.length && q.verificar.length);
    assert.ok(!/\d\.\d/.test([q.enunciado, q.respuesta, ...q.pasos].join(' ')), `${q.id}: coma decimal`);
  }
});
for (const q of papel.problemas) {
  test(`papel ${q.id}: coincide con calc`, () => {
    for (const ver of q.verificar) {
      assert.ok(typeof gen.calc[ver.fn] === 'function', `no existe calc.${ver.fn}`);
      const r = gen.calc[ver.fn](...ver.args);
      if (typeof ver.espera === 'number') assert.ok(Math.abs(r - ver.espera) < 1e-9, `${q.id}: ${ver.fn} da ${r}`);
      else for (const [k, val] of Object.entries(ver.espera)) assert.ok(Math.abs(campo(r, k) - val) < 1e-9, `${q.id}: ${k} da ${campo(r, k)}`);
    }
  });
}

test('salen todos los tipos y subtipos; misma forma y misma unidad en las alternativas', () => {
  const vistos = new Set();
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s), d = p._datos;
    vistos.add([d.tipo, d.sub, d.pide].filter(Boolean).join('/'));
    const alt = p.alternativas;
    for (const a of alt) assert.ok(!/,/.test(a.texto), `semilla ${s}: decimal (${a.texto})`);
    const conRaiz = alt.find(a => a.correcta).texto.includes('√');
    if (!conRaiz) for (const a of alt) assert.ok(!a.texto.includes('√'), `semilla ${s}: raíz entre racionales`);
    const unidad = a => a.texto.replace(/^[\d√/ ]+/, '');
    assert.equal(new Set(alt.map(unidad)).size, 1, `semilla ${s}: unidades distintas (${alt.map(a => a.texto)})`);
    assert.ok(Object.keys(p.variables).length <= 4, `semilla ${s}: más de 4 colores`);
    assert.equal(new Set(Object.values(p.variables).map(x => x.color)).size, Object.keys(p.variables).length);
  }
  const esperados = ['thales/tres', 'thales/total', 'thales/triangulo', 'thales/cometa', 'bisectriz/segmento', 'bisectriz/perimetro',
    'bisectriz/exterior', 'incentro/razon', 'incentro/paralela/MN', 'incentro/paralela/perimetro', 'incentro/rombo',
    'bis-semejanza/cuadrado/AF', 'bis-semejanza/cuadrado/razon', 'bis-semejanza/paralela-vertice', 'cuerdas/producto',
    'cuerdas/iguales', 'cuerdas/diametro-altura', 'raices-areas/total', 'raices-areas/tercera', 'mastil'];
  assert.deepEqual([...vistos].sort(), esperados.sort());
});

test('los segmentos de colores del enunciado y la solución usan variables declaradas', () => {
  for (let s = 0; s < 300; s++) {
    const p = gen.generar(s);
    const segs = [...p.enunciado, ...p.pregunta, ...p.solucion.flat()];
    for (const g of segs) if (typeof g === 'object') assert.ok(p.variables[g.v], `semilla ${s}: color sin variable (${g.v})`);
  }
});
