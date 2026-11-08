// Pruebas del generador geo-poligonos: un recálculo independiente con coordenadas en cada uno de
// 600 problemas, casos.json (verificados aparte), papel.json contra calc y que salen todos los tipos.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

const S3 = Math.sqrt(3);
const sub = (p, q) => [p[0] - q[0], p[1] - q[1]];
const largo = w => Math.hypot(w[0], w[1]);
const ang = (o, p, q) => { const a = sub(p, o), b = sub(q, o); return Math.acos((a[0] * b[0] + a[1] * b[1]) / (largo(a) * largo(b))) * 180 / Math.PI; };
const corte = (p1, p2, p3, p4) => {
  const d1 = sub(p2, p1), d2 = sub(p4, p3), den = d1[0] * d2[1] - d1[1] * d2[0];
  const t = ((p3[0] - p1[0]) * d2[1] - (p3[1] - p1[1]) * d2[0]) / den;
  return [p1[0] + t * d1[0], p1[1] + t * d1[1]];
};
// Vértices de un polígono regular de n lados (radio 1), en sentido antihorario.
const regular = (n, R = 1) => Array.from({ length: n }, (_, i) => [R * Math.cos(2 * Math.PI * i / n), R * Math.sin(2 * Math.PI * i / n)]);
const areaCordon = pts => Math.abs(pts.reduce((s, p, i) => { const q = pts[(i + 1) % pts.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0)) / 2;
const giro = (w, grados) => { const t = grados * Math.PI / 180; return [w[0] * Math.cos(t) - w[1] * Math.sin(t), w[0] * Math.sin(t) + w[1] * Math.cos(t)]; };
const mas = (p, w, k = 1) => [p[0] + k * w[0], p[1] + k * w[1]];
// Equilátero sobre PQ, a la izquierda de P→Q.
const equilatero = (p, q) => mas(p, giro(sub(q, p), 60));

function recalcular(pr) {
  const d = pr._datos;
  if (d.tipo === 'equiangulo') {
    // Se camina el hexágono girando 60° en cada vértice y se busca e, f que lo cierren.
    for (let e = 1; e < 60; e++) for (let f = 1; f < 60; f++) {
      let p = [0, 0], dir = [1, 0];
      for (const l of [d.a, d.b, d.c, d.d, e, f]) { p = mas(p, dir, l); dir = giro(dir, 60); }
      if (largo(p) < 1e-9) return d.pedido === 'lado' ? e : d.a + d.b + d.c + d.d + e + f;
    }
    return NaN;
  }
  if (d.tipo === 'area-regular') {
    if (d.sub === 'dodecagono-R') return areaCordon(regular(12, d.R));
    if (d.sub === 'hexagono-apotema') { const ap = d.k * S3; return areaCordon(regular(6, ap / Math.cos(Math.PI / 6))); }
    const R = d.ap / Math.cos(Math.PI / 12), A = areaCordon(regular(12, R));
    const N = Math.round(A / (2 - S3));
    assert.ok(Math.abs(N * (2 - S3) - A) < 1e-7);
    return `dod:${N}:-`;
  }
  if (d.tipo === 'soporte') {
    const V = regular(d.n), [A, B, C, D] = V;
    const F = equilatero(B, A); // del lado de C (el polígono es antihorario: el interior está a la izquierda de A→B, es decir, a la derecha de B→A)
    const Fi = mas(A, giro(sub(B, A), 60));
    const Fd = largo(sub(Fi, C)) < largo(sub(F, C)) ? Fi : F;
    return Math.round((d.pedido === 'BFC' ? ang(Fd, B, C) : ang(C, Fd, D)) * 1e6) / 1e6;
  }
  if (d.tipo === 'diagonales') {
    const [A, B, C, D, E] = regular(5), X = d.X === 'D' ? D : E;
    const Pp = corte(A, C, B, X);
    return Math.round((d.pedido === 'APB' ? ang(Pp, A, B) : ang(Pp, B, C)) * 1e6) / 1e6;
  }
  if (d.tipo === 'hexagono') {
    const [A, B, C, D, E] = regular(6);
    const Pp = corte(A, C, B, D), M = corte(A, C, B, E);
    const medida = { BP: largo(sub(B, Pp)), PD: largo(sub(Pp, D)), BM: largo(sub(B, M)), AM: largo(sub(A, M)), ME: largo(sub(M, E)) }[d.seg];
    return d.s / medida; // radio 1 → escala
  }
  if (d.tipo === 'trapecio') {
    if (d.sub === 'segmento') {
      const A = [0, 0], D = [d.B, 0], B = [3, 7], C = [3 + d.b, 7];
      const M = [(A[0] + C[0]) / 2, (A[1] + C[1]) / 2], N = [(B[0] + D[0]) / 2, (B[1] + D[1]) / 2];
      return largo(sub(M, N));
    }
    if (d.sub === 'bases') return d.m + d.s; // m + s = (AD + BC)/2 + (AD − BC)/2
    // Búsqueda numérica: B = (x, h) con AB = c y C = (x + b, h) con CD = d.
    let lo = 1e-9, hi = Math.min(d.c, d.d);
    const fdif = hh => { const x = Math.sqrt(d.c * d.c - hh * hh); return (d.B - x - d.b) ** 2 + hh * hh - d.d * d.d; };
    // fdif es monótona en h cuando el pie cae dentro; se usa bisección con muestreo.
    let mejor = NaN;
    const pasos = 20000;
    for (let i = 1; i < pasos; i++) {
      const h1 = lo + (hi - lo) * (i - 1) / pasos, h2 = lo + (hi - lo) * i / pasos;
      if (fdif(h1) * fdif(h2) <= 0) {
        let a = h1, b = h2;
        for (let k = 0; k < 80; k++) { const m = (a + b) / 2; if (fdif(a) * fdif(m) <= 0) b = m; else a = m; }
        mejor = (a + b) / 2; break;
      }
    }
    return Math.round(mejor * 1e8) / 1e8;
  }
  if (d.tipo === 'encajados') {
    // k desconocido: se arma la figura con lado exterior 7 y se escala.
    const L = 7, Pp = [4, 0], S = [0, 3];
    const lado = largo(sub(Pp, S)); // 5
    const esc = d.dato === 'exterior' ? d.valor / L : d.valor / lado;
    return 4 * (L + lado) * esc;
  }
  if (d.tipo === 'rombo') {
    const B = [0, 0], C = [1, 0], A = giro([1, 0], d.beta), D = mas(A, C);
    const E = equilatero(B, C); // sobre BC, hacia el lado de A
    const val = { EAD: ang(A, E, D), BAE: ang(A, B, E), AED: ang(E, A, D) }[d.pedido];
    return Math.round(val * 1e6) / 1e6;
  }
  if (d.tipo === 'cuadrados') {
    const A = [0, 0], B = [1, 0], C = [1, 1], D = [0, 1];
    const w = giro(sub(C, A), 90), E = mas(C, w), F = mas(A, w);
    assert.ok(largo(sub(F, D)) < 2); // F del lado de D
    const val = { BCE: ang(C, B, E), BDE: ang(D, B, E), CDE: ang(D, C, E), DEC: ang(E, D, C) }[d.pedido];
    return Math.round(val * 1e6) / 1e6;
  }
  return NaN;
}

const igual = (a, b) => (typeof b === 'string' ? a === b : Math.abs(a - b) < 1e-6);
probarGenerador(gen, { semillas: 600, recalcular, igual });

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
  for (let s = 0; s < 600; s++) { const d = gen.generar(s)._datos; vistos.add(d.tipo); if (d.sub) vistos.add(d.tipo + ':' + d.sub); }
  for (const t of gen.TIPOS) assert.ok(vistos.has(t), t);
  for (const t of ['area-regular:dodecagono-R', 'area-regular:hexagono-apotema', 'area-regular:dodecagono-apotema', 'trapecio:segmento', 'trapecio:bases', 'trapecio:altura']) assert.ok(vistos.has(t), t);
});

test('las alternativas tienen la misma forma (sin decimales sueltos en longitudes)', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    const grados = p.alternativas.filter(a => a.texto.endsWith('°')).length;
    assert.ok(grados === 0 || grados === p.alternativas.length, `semilla ${s}: mezcla ángulos y longitudes`);
    if (!grados) for (const a of p.alternativas) assert.ok(!/\d,\d/.test(a.texto), `semilla ${s}: decimal (${a.texto})`);
  }
});

function comparar(real, espera, msg) {
  if (typeof espera === 'object' && espera !== null) for (const k of Object.keys(espera)) comparar(real[k], espera[k], `${msg}.${k}`);
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
