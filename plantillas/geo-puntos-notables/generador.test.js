// Pruebas de «Puntos notables del triángulo» (práctica de geometria.puntos-notables): casos.json (calculados aparte,
// con un script que no usa el generador), un recálculo independiente en 400 problemas por tipo (leyendo el enunciado;
// con coordenadas, ángulos medidos o fuerza bruta), fugas, tipos por idea, el recuadro «Datos» en 400 semillas,
// igualdades escritas y explicaciones que dan su valor.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');

const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));
const sinDuros = t => String(t).replace(/[  ]/g, ' ');
const palabras = x => sinDuros(plano(x)).split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length;
const casi = (a, b, e = 1e-6) => Math.abs(a - b) < e;
const num = s => +String(s).replace(/ /g, '').replace(',', '.');
const nums = t => (sinDuros(t).match(/\d+(?:,\d+)?/g) || []).map(num);
const val = (t, k) => { const m = new RegExp(`(?:^|[^A-Z])${k} = (\\d+(?:,\\d+)?)`).exec(t); return m ? num(m[1]) : NaN; };
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);

// ---- Camino independiente: desde el texto del problema ----
const tri = (c, b, a) => { const x = (a * a + c * c - b * b) / (2 * a); return [[x, Math.sqrt(c * c - x * x)], [0, 0], [a, 0]]; };
function centros(A, B, C) {
  const a = dist(B, C), b = dist(A, C), c = dist(A, B);
  const D = 2 * (A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1]));
  const n2 = p => p[0] ** 2 + p[1] ** 2;
  const O = [(n2(A) * (B[1] - C[1]) + n2(B) * (C[1] - A[1]) + n2(C) * (A[1] - B[1])) / D, (n2(A) * (C[0] - B[0]) + n2(B) * (A[0] - C[0]) + n2(C) * (B[0] - A[0])) / D];
  const H = [A[0] + B[0] + C[0] - 2 * O[0], A[1] + B[1] + C[1] - 2 * O[1]];
  const s = a + b + c, w = -a + b + c;
  return { G: [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3], O, H,
    I: [(a * A[0] + b * B[0] + c * C[0]) / s, (a * A[1] + b * B[1] + c * C[1]) / s], E: [(-a * A[0] + b * B[0] + c * C[0]) / w, (-a * A[1] + b * B[1] + c * C[1]) / w] };
}
const ang = (V, P, Q) => { const u = [P[0] - V[0], P[1] - V[1]], w = [Q[0] - V[0], Q[1] - V[1]]; return Math.acos((u[0] * w[0] + u[1] * w[1]) / Math.hypot(...u) / Math.hypot(...w)) * 180 / Math.PI; };
const conAngulos = (A, B) => { const C = 180 - A - B, c = 10 * Math.sin(C * Math.PI / 180) / Math.sin(A * Math.PI / 180); return [[c * Math.cos(B * Math.PI / 180), c * Math.sin(B * Math.PI / 180)], [0, 0], [10, 0]]; };
const pie = (P, X, Y) => { const d = [Y[0] - X[0], Y[1] - X[1]], t = ((P[0] - X[0]) * d[0] + (P[1] - X[1]) * d[1]) / (d[0] ** 2 + d[1] ** 2); return [X[0] + d[0] * t, X[1] + d[1] * t]; };
const area = (P, Q, R) => Math.abs((Q[0] - P[0]) * (R[1] - P[1]) - (R[0] - P[0]) * (Q[1] - P[1])) / 2;
const r2 = x => Math.round(x * 100) / 100;
function recalcular(p) {
  const t = sinDuros(plano(p.enunciado) + ' ' + plano(p.pregunta)), N = nums(t), k = p._datos.tipo;
  const A0 = [2, 7], B0 = [0, 0], C0 = [9, 0], M0 = [4.5, 0], G0 = centros(A0, B0, C0).G;
  switch (k) {
    case 'ag': return dist(A0, G0) * N[0] / dist(A0, M0);
    case 'am': return dist(A0, M0) * val(t, 'GM') / dist(G0, M0);
    case 'area': return N[0] * (/BGC/.test(t) ? area(B0, G0, C0) : area(B0, G0, M0)) / area(A0, B0, C0);
    case 'hip': case 'rect': { const A = [0, N[0]], B = [0, 0], C = [N[1], 0], X = centros(A, B, C); return k === 'hip' ? dist(B, X.G) : dist(X.G, X.H); }
    case 'rrect': { const A = [0, N[0]], C = [N[1], 0]; return dist(centros(A, [0, 0], C).O, A); }
    case 'boc': case 'obc': case 'bhc': case 'bec': {
      const [A, B, C] = conAngulos(N[0], (180 - N[0]) / 2 + 7), X = centros(A, B, C);
      return r2({ boc: ang(X.O, B, C), obc: ang(B, X.O, C), bhc: ang(X.H, B, C), bec: ang(X.E, B, C) }[k]);
    }
    case 'treinta': { const [A, B, C] = conAngulos(30, 80); return r2(dist(centros(A, B, C).O, A) * val(t, 'BC') / dist(B, C)); }
    case 'tan': case 'at': case 'bt': {
      const [A, B, C] = tri(val(t, 'AB'), val(t, 'AC'), val(t, 'BC')), X = centros(A, B, C);
      if (k === 'tan') return r2(dist(A, pie(X.I, A, B)));
      const T = pie(X.E, A, B); return r2(k === 'at' ? dist(A, T) : dist(B, T));
    }
    case 'inradio': { const A = [0, N[0]], B = [0, 0], C = [N[1], 0], I = centros(A, B, C).I; return r2(I[1]); }
    case 'lado': {
      const bd = val(t, 'BD'), dc = val(t, 'DC'), ab = val(t, 'AB'), a = bd + dc;
      for (let i = 1; i < 4000; i++) { const b = i / 100; if (!(a < b + ab && b < a + ab && ab < a + b)) continue; const [A, B, C] = tri(ab, b, a); if (casi(dist(B, pie(centros(A, B, C).I, B, C)), bd, 1e-6)) return b; }
      return NaN;
    }
    case 'banderin': { const m = N[1] / 2, h = Math.sqrt(N[0] ** 2 - m * m); return r2(centros([m, h], [0, 0], [N[1], 0]).I[1]); }
    case 'hbc': { const C = N[0], B = C / 2 + 20, [Ap, Bp, Cp] = conAngulos(180 - C - B, B); return r2(ang(Bp, centros(Ap, Bp, Cp).H, Cp)); }
    case 'ap': return r2(Math.sqrt(val(t, 'AB') ** 2 - val(t, 'BP') ** 2));
    case 'bic': for (let i = 1; i < 1800; i++) { const a = i / 10, [A, B, C] = conAngulos(a, (180 - a) / 2 - 5); if (Math.max(ang(A, B, C), ang(B, A, C), ang(C, A, B)) >= 90) continue; const X = centros(A, B, C); if (Math.abs(ang(X.H, B, C) - N[0]) < 0.051) return r2(ang(X.I, B, C)); } return NaN;
    case 'becx': for (let i = 1; i < 1790; i++) { const a = i / 10, [A, B, C] = conAngulos(a, (180 - a) / 2), b = ang(centros(A, B, C).E, B, C); if (Math.abs(b - a - N[0]) < 0.051) return r2(b); } return NaN;
    case 'gh': return 2 * val(t, 'OG');
    case 'og': return val(t, 'OH') / 3;
    case 'nueve': { const [A, B, C] = conAngulos(70, 50), X = centros(A, B, C), esc = N[0] / dist(X.O, A), Nc = [(X.O[0] + X.H[0]) / 2, (X.O[1] + X.H[1]) / 2], r9 = dist(Nc, [5, 0]) * esc; return r2(/diámetro/.test(t) ? 2 * r9 : r9); }
    default: return NaN;
  }
}

probarGenerador(gen, { recalcular, igual: (a, b) => casi(a, b, 0.006) });
probarFugas(gen);

test('tipos por idea: las seis ideas de la teoría, todos los tipos generan y caen en su idea; niveles 1 a 3', () => {
  const teoria = require('../../contenido/teoria/geometria/puntos-notables.js');
  assert.deepEqual(Object.keys(gen.TIPOS_POR_IDEA), teoria.ideas.map(i => i.id), 'las mismas ideas que la teoría');
  for (const [idea, tipos] of Object.entries(gen.TIPOS_POR_IDEA)) {
    const vistos = new Set();
    for (let s = 0; s < 300; s++) { const p = gen.generar(s, { idea }); assert.equal(p._datos.idea, idea); vistos.add(p._datos.tipo); }
    assert.deepEqual([...vistos].sort(), [...tipos].sort(), idea);
  }
  const niveles = new Set(); for (let s = 0; s < 400; s++) niveles.add(gen.generar(s)._datos.nivel);
  assert.deepEqual([...niveles].sort(), [1, 2, 3]);
});

test('casos.json: cada caso da el enunciado, el valor y el texto esperados (calculados aparte)', () => {
  assert.equal(casos.casos.length, gen.TIPOS.length);
  for (const c of casos.casos) {
    const p = gen.generar(c.semilla, c.opciones);
    assert.equal(sinDuros(plano(p.enunciado) + ' ' + plano(p.pregunta)), c.enunciado);
    assert.ok(casi(p.respuesta.valor, c.esperado.valor, casos.tolerancia), `${c.opciones.tipo}: ${p.respuesta.valor}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.texto);
  }
});

test('una sola correcta y la respuesta rehecha desde el texto: 400 semillas por tipo', () => {
  for (const tipo of gen.TIPOS) for (let s = 0; s < 400; s++) {
    const p = gen.generar(`t${s}`, { tipo }), r = recalcular(p);
    assert.ok(casi(r, p.respuesta.valor, 0.006), `${tipo} ${s}: ${r} contra ${p.respuesta.valor}`);
    const iguales = p.alternativas.filter(a => casi(a.valor, r, 0.006));
    assert.equal(iguales.length, 1, `${tipo} ${s}: ${iguales.length} alternativas valen ${r}`);
  }
});

test('el recuadro «Datos»: lista de líneas cortas, sin la respuesta, sin consejos (400 semillas)', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    assert.ok(Array.isArray(p.datos) && p.datos.length, `semilla ${s}: sin datos`);
    for (const d of p.datos) {
      assert.ok(palabras(d) <= 22, `semilla ${s}: dato largo «${d}»`);
      assert.ok(!/^(Recuerda|Ojo|Cuidado|No olvides|Ten en cuenta|Fíjate|Conviene|Primero)/.test(d), `semilla ${s}: consejo «${d}»`);
      const c = p.alternativas.find(a => a.correcta).texto;
      assert.ok(!sinDuros(d).includes(`= ${c}`), `semilla ${s}: el dato trae la respuesta «${c}»`);
    }
  }
});

test('igualdades escritas: toda cuenta «a op b = c» de la solución es cierta (400 semillas)', () => {
  const re = /(\d+(?:,\d+)?)\s*([+−·÷])\s*(\d+(?:,\d+)?)\s*=\s*(\d+(?:,\d+)?)/g;
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), t = sinDuros(p.solucion.map(plano).join(' ')).replace(/°/g, '');
    for (const m of t.matchAll(re)) {
      const a = num(m[1]), b = num(m[3]), c = num(m[4]);
      const r = { '+': a + b, '−': a - b, '·': a * b, '÷': a / b }[m[2]];
      // «90 − x ÷ 2» y similares se leen por partes: solo se mira una cuenta suelta (sin letra pegada antes).
      const antes = t.slice(Math.max(0, m.index - 3), m.index);
      if (/[a-zA-Z(+−÷·]\s*$/.test(antes)) continue;
      assert.ok(Math.abs(r - c) < 0.006, `semilla ${s}: «${m[0]}» es falsa`);
    }
  }
});

test('las explicaciones que empiezan con un número dan el valor de su alternativa (400 semillas)', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas.filter(x => !x.correcta)) {
      const m = /^(\d+(?:,\d+)?)\s*(?:cm²?|°)(?!\s*[+−])/.exec(a.error.explicacion);
      if (m) assert.ok(casi(num(m[1]), a.valor, 0.006), `semilla ${s}: «${a.error.explicacion}» con la alternativa ${a.texto}`);
    }
  }
});

test('cierre del 26 nov: los Datos de BHC y BEC dan herramientas, no la relación ya armada; R se dice qué es', () => {
  for (let s = 0; s < 200; s++) {
    for (const [tipo, mal] of [['bhc', /180° − m∠A/], ['bec', /90° − m∠A ÷ 2/]]) {
      const p = gen.generar(`cierre-${s}`, { tipo }), d = p.datos.map(plano).join(' ');
      assert.ok(!mal.test(d), `${tipo} ${s}: ${d}`);
    }
    const n = gen.generar(`cierre-${s}`, { tipo: 'nueve' });
    assert.match(n.datos.map(plano).join(' '), /radio de la circunscrita/);
  }
});
