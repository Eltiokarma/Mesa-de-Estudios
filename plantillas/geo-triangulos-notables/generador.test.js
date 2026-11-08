// Pruebas del generador de triángulos y puntos notables: casos.json (verificados aparte, a ciegas),
// papel.json contra `calc`, y un recálculo independiente en cada uno de 600 problemas.
// El recálculo NO usa las fórmulas del generador: prueba cada entero por fuerza bruta (¿existe el
// triángulo?, ¿el ángulo es obtuso según el producto escalar?), busca configuraciones con muestreo
// y arma los puntos notables con coordenadas (cortes de rectas) para medir los ángulos.
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
const punto = (p, q) => p[0] * q[0] + p[1] * q[1];
const perp = p => [-p[1], p[0]];
function corte(P, u, Q, w) { const t = cruz(sub(Q, P), w) / cruz(u, w); return sum(P, esc(u, t)); }
const angulo = (V, X, Y) => Math.acos(Math.max(-1, Math.min(1, punto(uni(sub(X, V)), uni(sub(Y, V)))))) * 180 / Math.PI;
const RAD = Math.PI / 180;
// Triángulo por sus ángulos B y C sobre BC = 1.
function porAngulos(B, C) {
  const Bp = [0, 0], Cp = [1, 0];
  const A = corte(Bp, [Math.cos(B * RAD), Math.sin(B * RAD)], Cp, [-Math.cos(C * RAD), Math.sin(C * RAD)]);
  return { A, B: Bp, C: Cp };
}
// Triángulo por sus lados (BC = a, AC = b, AB = c), o null si no existe.
function porLados(a, b, c) {
  if (!(a + b > c && a + c > b && b + c > a)) return null;
  const x = (c * c - b * b + a * a) / (2 * a);
  return { A: [x, Math.sqrt(c * c - x * x)], B: [0, 0], C: [a, 0] };
}
const bis = (V, X, Y) => sum(uni(sub(X, V)), uni(sub(Y, V)));
const bisExt = (V, X, Y) => sub(uni(sub(X, V)), uni(sub(Y, V)));
const ortocentro = T => corte(T.B, perp(sub(T.C, T.A)), T.C, perp(sub(T.B, T.A)));
function circuncentro(A, B, C) {
  return corte(esc(sum(A, B), 0.5), perp(sub(B, A)), esc(sum(A, C), 0.5), perp(sub(C, A)));
}
const pie = (P, X, Y) => { const d = uni(sub(Y, X)); return sum(X, esc(d, punto(sub(P, X), d))); };

// ¿Qué enteros x de 1 a 200 cumplen la condición? (la condición recibe el triángulo armado con lados)
const enteros = cond => { const r = []; for (let x = 1; x <= 200; x++) if (cond(x)) r.push(x); return r; };
const resumen = xs => ({ min: Math.min(...xs), max: Math.max(...xs), cuantos: xs.length });

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'desigualdad') {
    if (['max', 'min', 'cuantos'].includes(d.sub)) return resumen(enteros(x => porLados(x, d.a, d.b)))[d.sub];
    if (d.sub === 'diagonal') return resumen(enteros(x => porLados(x, d.p, d.q) && porLados(x, d.r, d.s)))[d.pide];
    if (d.sub === 'contar') {
      const vistos = new Set();
      for (let a = 1; a < d.N; a++) for (let b = 1; a + b < d.N; b++) { const c = d.N - a - b; if (porLados(a, b, c)) vistos.add([a, b, c].sort((x, y) => x - y).join(',')); }
      return vistos.size;
    }
    if (d.sub === 'doble-angulo') {
      // Ley de senos con C muestreado: BC/AB = sen(2C)/sen C, con B = 180° − 3C > 0.
      let lo = Infinity, hi = -Infinity;
      for (let C = 0.01; C < 60; C += 0.01) { const x = d.c * Math.sin(2 * C * RAD) / Math.sin(C * RAD); lo = Math.min(lo, x); hi = Math.max(hi, x); }
      return d.pide === 'max' ? Math.ceil(hi) - 1 : Math.floor(lo) + 1;
    }
    // punto interior: se busca C que deje a P dentro y dé el menor perímetro.
    const A = [0, 0], B = [d.c, 0], x = (d.p * d.p - d.q * d.q + d.c * d.c) / (2 * d.c), Pp = [x, Math.sqrt(d.p * d.p - x * x)];
    const dentro = C => { const s1 = cruz(sub(B, A), sub(Pp, A)), s2 = cruz(sub(C, B), sub(Pp, B)), s3 = cruz(sub(A, C), sub(Pp, C)); return (s1 > 0 && s2 > 0 && s3 > 0) || (s1 < 0 && s2 < 0 && s3 < 0); };
    let mejor = Infinity;
    for (const eps of [1e-4, 1e-3, 1e-2, 0.1, 1, 3]) for (let k = 0; k < 720; k++) {
      const C = sum(Pp, esc([Math.cos(k * Math.PI / 360), Math.sin(k * Math.PI / 360)], eps));
      if (dentro(C)) mejor = Math.min(mejor, d.c + dist(C, A) + dist(C, B));
    }
    assert.ok(mejor > d.c + d.p + d.q && mejor < d.c + d.p + d.q + 1);
    return Math.floor(mejor) + 1;
  }
  if (d.tipo === 'obtusangulo') {
    // Lados: AB = a, AC = b, BC = x. El ángulo entre a y b está en A; el opuesto a b, en B.
    const T = x => porLados(x, d.b, d.a);
    const obtusoEnA = x => { const t = T(x); return t && punto(sub(t.B, t.A), sub(t.C, t.A)) < 0; };
    if (d.sub === 'opuesto-cuantos') return enteros(x => { const t = T(x); return t && punto(sub(t.A, t.B), sub(t.C, t.B)) < 0; }).length;
    if (d.sub === 'acutangulo') return enteros(x => { const t = T(x); return t && [[t.A, t.B, t.C], [t.B, t.A, t.C], [t.C, t.A, t.B]].every(([V, X, Y]) => punto(sub(X, V), sub(Y, V)) > 1e-9); }).length;
    const r = resumen(enteros(obtusoEnA));
    if (d.sub === 'perimetros') return d.k * ((d.a + d.b + r.max) - (d.a + d.b + r.min));
    return r[{ 'entre-cuantos': 'cuantos', 'entre-max': 'max', 'entre-min': 'min' }[d.sub]];
  }
  if (d.tipo === 'angulos') {
    if (d.sub === 'pies-alturas') {
      const T = porAngulos(d.B, d.C), E = pie(T.B, T.A, T.C), F = pie(T.C, T.A, T.B), O = circuncentro(T.A, T.B, T.C);
      if (d.pide === 'AEF') return Math.round(angulo(E, T.A, F) * 1e9) / 1e9;
      const c = Math.abs(punto(uni(sub(O, T.A)), uni(sub(F, E))));
      return Math.round(Math.acos(c) / RAD * 1e9) / 1e9;
    }
    const A = d.sub === 'orto-incentro' ? 180 - d.theta : d.A;
    const B = (180 - A) * 0.5 + (180 - A) * 0.07, C = 180 - A - B;
    const T = porAngulos(B, C);
    assert.ok(Math.abs(angulo(T.A, T.B, T.C) - A) < 1e-9);
    let X;
    if (d.sub === 'incentro' || d.sub === 'orto-incentro') X = corte(T.B, bis(T.B, T.A, T.C), T.C, bis(T.C, T.A, T.B));
    if (d.sub === 'excentro') X = corte(T.B, bisExt(T.B, T.A, T.C), T.C, bisExt(T.C, T.A, T.B));
    if (d.sub === 'int-ext') X = corte(T.B, bis(T.B, T.A, T.C), T.C, bisExt(T.C, T.A, T.B));
    if (d.sub === 'ortocentro') X = ortocentro(T);
    if (d.sub === 'circuncentro') X = circuncentro(T.A, T.B, T.C);
    if (d.sub === 'orto-incentro') assert.ok(Math.abs(angulo(ortocentro(T), T.B, T.C) - d.theta) < 1e-7);
    return Math.round(angulo(X, T.B, T.C) * 1e7) / 1e7;
  }
  if (d.tipo === 'ortocentro') {
    // Sin suponer que CF es altura: se busca C (por bisección) para que la recta CH corte AB en F.
    const A = [0, 0], B = [d.AF + d.FB, 0];
    const centro = d.pide === 'CF' ? A : B, radio = d.pide === 'CF' ? d.AC : d.BC;
    const corteCH = fi => {
      const C = sum(centro, esc([Math.cos(fi), Math.sin(fi)], radio));
      const H = ortocentro({ A, B, C });
      return { C, x: corte(C, sub(H, C), A, [1, 0])[0] };
    };
    let lo = 0.01, hi = Math.PI - 0.01;
    const s = fi => corteCH(fi).x - d.AF;
    for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (Math.sign(s(m)) === Math.sign(s(lo))) lo = m; else hi = m; }
    const { C } = corteCH((lo + hi) / 2), F = [d.AF, 0];
    return d.pide === 'CF' ? dist(C, F) : dist(C, A);
  }
  if (d.tipo === 'mitades') {
    const TAN = { 37: 3 / 4, 53: 4 / 3, 60: Math.sqrt(3) };    // notables de academia (triángulo 3-4-5)
    const H = [0, 0], B = [0, d.h], A = [-d.h / TAN[d.A], 0], C = [d.h / TAN[d.C], 0];
    const P = corte(A, bis(A, B, C), H, [0, 1]), Q = corte(C, bis(C, A, B), H, [0, 1]);
    return dist(P, Q);
  }
  // arco: isósceles con sen(A/2) = 1/(1 + p/q), que da AI/IM = p/q; luego se escala.
  const A2 = Math.asin(1 / (1 + d.p / d.q)), Bg = 90 - A2 / RAD;
  const T = porAngulos(Bg, Bg), O = circuncentro(T.A, T.B, T.C), R = dist(O, T.A);
  const I = corte(T.B, bis(T.B, T.A, T.C), T.C, bis(T.C, T.A, T.B));
  const E = corte(T.B, bisExt(T.B, T.A, T.C), T.C, bisExt(T.C, T.A, T.B));
  const u = uni(sub(I, T.A)), f = sub(T.A, O), t = -2 * punto(f, u), M = sum(T.A, esc(u, t));
  const k = d.p / dist(T.A, I);
  assert.ok(Math.abs(k * dist(I, M) - d.q) < 1e-7);
  assert.ok(Math.abs(dist(O, M) - R) < 1e-9);
  return k * (d.pide === 'AE' ? dist(T.A, E) : dist(I, E));
}
probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => Math.abs(a - b) < 1e-6 * Math.max(1, Math.abs(b)) });

test('casos.json: formato', () => {
  assert.equal(casos.plantilla, 'geo-triangulos-notables');
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
  for (let s = 0; s < 2000; s++) {
    const p = gen.generar(s), d = p._datos;
    vistos.add([d.tipo, d.sub, d.pide].filter(Boolean).join('/'));
    const alt = p.alternativas;
    for (const a of alt) assert.ok(!/\d,\d/.test(a.texto), `semilla ${s}: decimal (${a.texto})`);
    const conRaiz = alt.find(a => a.correcta).texto.includes('√');
    if (!conRaiz) for (const a of alt) assert.ok(!a.texto.includes('√'), `semilla ${s}: raíz entre racionales`);
    const unidad = a => a.texto.replace(/[\d√/ ]+/g, '');
    assert.equal(new Set(alt.map(unidad)).size, 1, `semilla ${s}: unidades distintas (${alt.map(a => a.texto)})`);
    if (p.respuesta.unidad === '°') for (const a of alt) assert.ok(parseFloat(a.texto) < 180, `semilla ${s}: ángulo de 180° o más`);
    if (d.tipo === 'desigualdad' || d.tipo === 'obtusangulo') for (const a of alt) assert.ok(Number.isInteger(a.valor), `semilla ${s}: valor no entero`);
    assert.ok(Object.keys(p.variables).length <= 4, `semilla ${s}: más de 4 colores`);
    assert.equal(new Set(Object.values(p.variables).map(x => x.color)).size, Object.keys(p.variables).length);
    for (const g of [...p.enunciado, ...p.pregunta, ...p.solucion.flat()]) if (typeof g === 'object') assert.ok(p.variables[g.v], `semilla ${s}: color sin variable (${g.v})`);
  }
  const esperados = ['desigualdad/max', 'desigualdad/min', 'desigualdad/cuantos', 'desigualdad/diagonal/max', 'desigualdad/diagonal/min',
    'desigualdad/diagonal/cuantos', 'desigualdad/punto-interior', 'desigualdad/doble-angulo/max', 'desigualdad/doble-angulo/min',
    'desigualdad/contar', 'obtusangulo/entre-cuantos', 'obtusangulo/entre-max', 'obtusangulo/entre-min', 'obtusangulo/perimetros',
    'obtusangulo/opuesto-cuantos', 'obtusangulo/acutangulo', 'angulos/incentro', 'angulos/excentro', 'angulos/int-ext',
    'angulos/ortocentro', 'angulos/circuncentro', 'angulos/orto-incentro', 'angulos/pies-alturas/AEF', 'angulos/pies-alturas/AO-EF',
    'ortocentro/CF', 'ortocentro/AC', 'mitades', 'arco/AE', 'arco/IE'];
  assert.deepEqual([...vistos].sort(), esperados.sort());
});

test('la trampa del valor límite y la de la condición de obtusángulo salen como alternativas', () => {
  let limite = 0, sinObtuso = 0;
  for (let s = 0; s < 600; s++) {
    const ids = gen.generar(s).alternativas.filter(a => a.error).map(a => a.error.id);
    if (ids.includes('GT-limite-incluido')) limite++;
    if (ids.includes('GT-sin-condicion-obtuso')) sinObtuso++;
  }
  assert.ok(limite > 60 && sinObtuso > 20, `${limite} y ${sinObtuso}`);
});
