// Pruebas del generador de cortes: casos.json (para verificar aparte, a ciegas), papel.json y un recálculo
// independiente en cada uno de 600 problemas, sin las fórmulas ni la búsqueda del generador:
//   plancha sin límite: altura mínima del árbol de cortes, probando todas las formas de partir cada pieza;
//   plancha con límite: búsqueda en anchura sin cota sobre todos los montones posibles;
//   arreglo: programación dinámica de abajo hacia arriba sobre todos los subrectángulos;
//   progresión: se prueban todas las cantidades de tramos; estacas: se cuentan los puntos uno por uno;
//   esquinas: se arma el polígono, se suma su perímetro con decimales y se busca el p + q√2 que da lo mismo.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

const memoAlto = new Map();
function altoSinLimite(a, b) {
  if (a > b) [a, b] = [b, a];
  if (a * b === 1) return 0;
  const k = a + 'x' + b;
  if (memoAlto.has(k)) return memoAlto.get(k);
  let mejor = Infinity;
  for (let i = 1; i < b; i++) mejor = Math.min(mejor, 1 + Math.max(altoSinLimite(a, i), altoSinLimite(a, b - i)));
  for (let i = 1; i < a; i++) mejor = Math.min(mejor, 1 + Math.max(altoSinLimite(i, b), altoSinLimite(a - i, b)));
  memoAlto.set(k, mejor);
  return mejor;
}

// Búsqueda en anchura: un estado es la lista ordenada de piezas que aún tienen más de un cuadradito.
function anchura(m, n, c) {
  const norm = l => l.map(([a, b]) => (a <= b ? [a, b] : [b, a])).filter(([a, b]) => a * b > 1).sort((p, q) => (p[0] - q[0]) || (p[1] - q[1]));
  const clave = l => JSON.stringify(l);
  let frente = [norm([[m, n]])];
  const visto = new Set(frente.map(clave));
  for (let d = 0; ; d++) {
    if (frente.some(s => !s.length)) return d;
    const sig = [];
    for (const s of frente) {
      // cada pieza: se queda (null) o se parte de alguna forma; a lo más c piezas partidas
      const opciones = s.map(([a, b]) => {
        const o = [null];
        for (let i = 1; i < b; i++) o.push([[a, i], [a, b - i]]);
        for (let i = 1; i < a; i++) o.push([[i, b], [a - i, b]]);
        return o;
      });
      (function rec(i, partidas, acc) {
        if (i === s.length) {
          if (!partidas) return;
          const t = norm(acc), k = clave(t);
          if (!visto.has(k)) { visto.add(k); sig.push(t); }
          return;
        }
        for (const o of opciones[i]) {
          if (o && partidas === c) continue;
          rec(i + 1, partidas + (o ? 1 : 0), o ? acc.concat(o) : acc.concat([s[i]]));
        }
      })(0, 0, []);
    }
    frente = sig;
  }
}

function altoArreglo(celdas) {
  const F = celdas.length, C = celdas[0].length, A = new Map();
  const key = (f0, f1, k0, k1) => `${f0},${f1},${k0},${k1}`;
  for (let alto = 1; alto <= F; alto++) for (let ancho = 1; ancho <= C; ancho++) {
    for (let f0 = 0; f0 + alto <= F; f0++) for (let k0 = 0; k0 + ancho <= C; k0++) {
      const f1 = f0 + alto, k1 = k0 + ancho;
      const ids = new Set(); for (let i = f0; i < f1; i++) for (let k = k0; k < k1; k++) ids.add(celdas[i][k]);
      let v = ids.size === 1 ? 0 : Infinity;
      if (v) {
        for (let k = k0 + 1; k < k1; k++) {
          let limpia = true; for (let i = f0; i < f1; i++) if (celdas[i][k - 1] === celdas[i][k]) limpia = false;
          if (limpia) v = Math.min(v, 1 + Math.max(A.get(key(f0, f1, k0, k)), A.get(key(f0, f1, k, k1))));
        }
        for (let i = f0 + 1; i < f1; i++) {
          let limpia = true; for (let k = k0; k < k1; k++) if (celdas[i - 1][k] === celdas[i][k]) limpia = false;
          if (limpia) v = Math.min(v, 1 + Math.max(A.get(key(f0, i, k0, k1)), A.get(key(i, f1, k0, k1))));
        }
      }
      A.set(key(f0, f1, k0, k1), v);
    }
  }
  return A.get(key(0, F, 0, C));
}

function perimetro(pts) { let s = 0; for (let i = 0; i < pts.length; i++) { const [a, b] = pts[i], [c, d] = pts[(i + 1) % pts.length]; s += Math.hypot(c - a, d - b); } return s; }
function comoRaiz(P, tope) {
  for (let q = -tope; q <= tope; q++) { const p = Math.round(P - q * Math.SQRT2); if (Math.abs(p + q * Math.SQRT2 - P) < 1e-7) return { p, q }; }
  return null;
}

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'plancha') return d.c ? anchura(d.m, d.n, d.c) : altoSinLimite(d.m, d.n);
  if (d.tipo === 'arreglo') return altoArreglo(d.celdas);
  if (d.tipo === 'progresion') {
    if (d.pide === 'cortes') {
      for (let n = 2; n < 200; n++) { const paso = (d.b - d.a) / (n - 1); let s = 0; for (let i = 0; i < n; i++) s += d.a + i * paso; if (Math.abs(s - d.L) < 1e-9) return n - 1; }
      return NaN;
    }
    // bisección sobre el tramo mayor: la suma de los c + 1 tramos crece con él
    const n = d.c + 1, suma = b => { let s = 0; for (let i = 0; i < n; i++) s += d.a + i * (b - d.a) / (n - 1); return s; };
    let lo = d.a, hi = d.L;
    for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (suma(mid) < d.L) lo = mid; else hi = mid; }
    return Math.round(lo * 1e6) / 1e6;
  }
  if (d.tipo === 'estacas') {
    let g = 1; for (let t = 1; t <= Math.min(d.A, d.B); t++) if (d.A % t === 0 && d.B % t === 0) g = t;
    const paso = d.pide === 'vertices' ? g : d.e;
    let n = 0;
    for (let X = 0; X <= d.A; X += paso) for (let Y = 0; Y <= d.B; Y += paso) if (X % g === 0 || Y % g === 0) n++;
    if (d.pide === 'vertices') { n = 0; for (let X = 0; X <= d.A; X += g) for (let Y = 0; Y <= d.B; Y += g) n++; }
    return n;
  }
  if (d.tipo === 'esquinas') {
    const { L, W, a } = d;
    let pts;
    if (d.corte === 'cuadrado') pts = [[a, 0], [L - a, 0], [L - a, a], [L, a], [L, W - a], [L - a, W - a], [L - a, W], [a, W], [a, W - a], [0, W - a], [0, a], [a, a]];
    else {
      const c = d.corte === 'octogono' ? L / (2 + Math.SQRT2) : a;
      pts = [[c, 0], [L - c, 0], [L, c], [L, W - c], [L - c, W], [c, W], [0, W - c], [0, c]];
      if (d.corte === 'octogono') { // los ocho lados iguales
        const lados = pts.map((q, i) => Math.hypot(pts[(i + 1) % 8][0] - q[0], pts[(i + 1) % 8][1] - q[1]));
        assert.ok(lados.every(z => Math.abs(z - lados[0]) < 1e-9));
      }
    }
    const P = perimetro(pts);
    if (d.corte === 'cuadrado') return `num:${Math.round(P * 1e9) / 1e9}`;
    const r = comoRaiz(P, 20 * L);
    return `rad:${r.p}:${r.q}`;
  }
  throw new Error('tipo desconocido');
}

probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => typeof a === 'number' && typeof b === 'number' ? Math.abs(a - b) < 1e-6 : a === b });

test('salen los cinco tipos en 200 semillas (y la plancha con y sin límite de capas)', () => {
  const tipos = new Set(); let con = 0, sin = 0;
  for (let s = 0; s < 200; s++) { const d = gen.generar(s)._datos; tipos.add(d.tipo); if (d.tipo === 'plancha') d.c ? con++ : sin++; }
  assert.equal(tipos.size, 5);
  assert.ok(con > 5 && sin > 5);
});

test('plancha: la búsqueda del generador es de verdad mínima en todas las planchas chicas (contra búsqueda en anchura)', () => {
  for (let m = 1; m <= 3; m++) for (let n = Math.max(m, 2); n <= 6; n++) for (const c of [null, 2, 3, 4]) {
    const r = gen.calc.plancha({ m, n, c }).respuesta;
    assert.equal(r, anchura(m, n, c || Infinity), `${m}×${n}, c = ${c}`);
  }
});

test('plancha: sin límite da ⌈log₂ m⌉ + ⌈log₂ n⌉, y con límite coincide con la cota que se explica', () => {
  for (let m = 1; m <= 6; m++) for (let n = Math.max(m, 2); n <= 12; n++) {
    assert.equal(gen.calc.plancha({ m, n, c: null }).respuesta, gen.calc.log2arriba(m) + gen.calc.log2arriba(n));
    if (m * n <= 24) for (const c of [2, 3, 4]) { const R = gen.calc.plancha({ m, n, c }); assert.equal(R.respuesta, R.cota, `${m}×${n}, c = ${c}`); }
  }
});

test('plancha: el plan del generador separa todo, con a lo más c piezas por corte', () => {
  for (const [m, n, c] of [[3, 5, 2], [4, 6, 3], [2, 7, 2], [1, 13, 3], [4, 4, null]]) {
    const R = gen.calc.plancha({ m, n, c });
    let piezas = [[m, n]];
    for (const corte of R.plan) {
      if (c) assert.ok(corte.length <= c);
      for (const e of corte) {
        const i = piezas.findIndex(([a, b]) => (a === e.de[0] && b === e.de[1]) || (a === e.de[1] && b === e.de[0]));
        assert.ok(i >= 0, 'el plan corta una pieza que no hay');
        piezas.splice(i, 1, ...e.en);
        assert.equal(e.en[0][0] * e.en[0][1] + e.en[1][0] * e.en[1][1], e.de[0] * e.de[1]);
      }
    }
    assert.ok(piezas.length === m * n && piezas.every(([a, b]) => a * b === 1));
    assert.equal(R.plan.length, R.respuesta);
  }
});

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(p.respuesta.valor, c.esperado.respuesta);
  });
}

test('papel.json: formato', () => {
  assert.ok(papel.titulo && papel.indicacion && papel.problemas.length >= 5 && papel.problemas.length <= 10);
  for (const q of papel.problemas) assert.ok(q.id && q.nivel && q.enunciado && q.respuesta && q.pasos.length && q.verificar.length, q.id);
});
for (const q of papel.problemas) {
  test(`papel ${q.id}`, () => {
    for (const vf of q.verificar) {
      const r = gen.calc[vf.fn](...vf.args);
      for (const [k, e] of Object.entries(vf.espera)) assert.deepEqual(r[k], e, `${q.id}: ${vf.fn}.${k}`);
    }
  });
}
