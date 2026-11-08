// Pruebas del generador de fichas y piezas: casos.json, papel.json y, en cada uno de 600 problemas, un recálculo
// independiente hecho solo desde p._datos:
//   semejanza   el mayor k con k² ≤ N, contando; el perímetro de la ficha sumando sus lados
//   hexagonos   hexágonos que caben por programación dinámica fila por fila (no la búsqueda del generador)
//   contorno    lados que se tocan por solapamiento de intervalos (no por cuadritos)
//   medios      los cuadrados construidos de verdad con puntos medios (coordenadas, fórmula del área de Gauss)
//   rectangulo  otra búsqueda de embaldosados (recorriendo por columnas)
//   lineal      todas las orientaciones de las tiras en fila, con el perímetro contado por cuadritos
//   cajas, tablero  otra búsqueda de empaques (recorriendo por columnas)
//   fibonacci   la espiral armada cuadrado por cuadrado
//   malla       el camino en zigzag comprobado paso a paso (vecinos y sin repetir) y la cota de puntos − 1
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// ---------- piezas (código propio) ----------
const FORMAS = {
  D2: [[0, 0], [1, 0]], I3: [[0, 0], [1, 0], [2, 0]], L3: [[0, 0], [1, 0], [0, 1]], O4: [[0, 0], [1, 0], [0, 1], [1, 1]], I4: [[0, 0], [1, 0], [2, 0], [3, 0]],
  L4: [[0, 0], [0, 1], [0, 2], [1, 0]], T4: [[0, 0], [1, 0], [2, 0], [1, 1]], S4: [[0, 0], [1, 0], [1, 1], [2, 1]], P5: [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]], V5: [[0, 0], [0, 1], [0, 2], [1, 0], [2, 0]],
};
function variantes(cs) { // las 8 simetrías del cuadrado, normalizadas y sin repetir
  const res = new Map();
  const T = [([x, y]) => [x, y], ([x, y]) => [y, -x], ([x, y]) => [-x, -y], ([x, y]) => [-y, x], ([x, y]) => [-x, y], ([x, y]) => [y, x], ([x, y]) => [x, -y], ([x, y]) => [-y, -x]];
  for (const t of T) { const q = cs.map(t); const mx = Math.min(...q.map(c => c[0])), my = Math.min(...q.map(c => c[1])); const n = q.map(([x, y]) => [x - mx, y - my]).sort((a, b) => a[0] - b[0] || a[1] - b[1]); res.set(JSON.stringify(n), n); }
  return [...res.values()];
}
// Recorre por columnas: la primera celda libre (x menor, luego y menor) la cubre una pieza que la tiene como su celda «primera» en ese orden.
function cubre(w, h, tipos) {
  const V = tipos.map(t => variantes(FORMAS[t]));
  const g = Array.from({ length: w }, () => Array(h).fill(false)), cnt = tipos.map(() => 0);
  const rec = () => {
    let x = -1, y = -1;
    busca: for (let i = 0; i < w; i++) for (let j = 0; j < h; j++) if (!g[i][j]) { x = i; y = j; break busca; }
    if (x < 0) return cnt.every(c => c > 0);
    for (let t = 0; t < V.length; t++) for (const o of V[t]) {
      const [ax, ay] = o[0], cel = o.map(([cx, cy]) => [cx - ax + x, cy - ay + y]);
      if (!cel.every(([X, Y]) => X >= 0 && Y >= 0 && X < w && Y < h && !g[X][Y])) continue;
      cel.forEach(([X, Y]) => { g[X][Y] = true; }); cnt[t]++;
      if (rec()) return true;
      cnt[t]--; cel.forEach(([X, Y]) => { g[X][Y] = false; });
    }
    return false;
  };
  return rec();
}
function empaca(w, h, cs, tapadas = []) {
  const V = variantes(cs), A = cs.length;
  const g = Array.from({ length: w }, () => Array(h).fill(0));
  tapadas.forEach(([x, y]) => { g[x][y] = 2; });
  let mejor = 0, puestas = 0;
  const libres0 = w * h - tapadas.length;
  const rec = (k, libres) => {
    while (k < w * h && g[Math.floor(k / h)][k % h]) k++;
    if (k === w * h) { mejor = Math.max(mejor, puestas); return; }
    if (puestas + Math.floor(libres / A) <= mejor) return;
    const x = Math.floor(k / h), y = k % h;
    for (const o of V) {
      const [ax, ay] = o[0], cel = o.map(([cx, cy]) => [cx - ax + x, cy - ay + y]);
      if (!cel.every(([X, Y]) => X >= 0 && Y >= 0 && X < w && Y < h && !g[X][Y])) continue;
      cel.forEach(([X, Y]) => { g[X][Y] = 1; }); puestas++;
      rec(k + 1, libres - A);
      puestas--; cel.forEach(([X, Y]) => { g[X][Y] = 0; });
    }
    g[x][y] = 3; rec(k + 1, libres - 1); g[x][y] = 0;
  };
  rec(0, libres0);
  return mejor;
}

// ---------- recálculos ----------
function hexDP(k) { // máximo de puntos interiores sin dos vecinos, fila por fila
  const filas = []; for (let i = 2; i <= k - 1; i++) filas.push(i - 1); // fila i tiene i − 1 puntos interiores (j = 1 … i − 1)
  let dp = new Map([[0, 0]]), anterior = 0;
  for (const n of filas) {
    const nuevo = new Map();
    for (let m = 0; m < (1 << n); m++) {
      if (m & (m << 1)) continue; // dos vecinos en la fila
      const bits = m.toString(2).split('').filter(b => b === '1').length;
      for (const [ma, val] of dp) {
        // Punto j de la fila de arriba (bit j − 1, con anterior puntos) toca a los j y j + 1 de esta fila (bits j − 1 y j).
        if ((ma & m) || ((ma << 1) & m)) continue;
        nuevo.set(m, Math.max(nuevo.get(m) ?? 0, val + bits));
      }
    }
    dp = nuevo; anterior = n;
  }
  return Math.max(...dp.values());
}
function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'semejanza') {
    let k = 1; while ((k + 1) * (k + 1) <= d.N) k++;
    const lados = d.ficha === 'triangulo' ? [d.L, d.L, d.L] : d.ficha === 'rectangulo' ? [d.a, d.b, d.a, d.b] : [d.L, d.L, d.L, 2 * d.L];
    return k * lados.reduce((s, x) => s + x, 0);
  }
  if (d.tipo === 'hexagonos') {
    for (let k = 12; k >= 1; k--) for (let h = Math.min(d.H, hexDP(k)); h >= 1; h--) { const t = k * k - 6 * h; if (t >= 1 && t <= d.T) return 3 * k * d.L; }
    return NaN;
  }
  if (d.tipo === 'contorno') {
    const per = b => {
      const fs = gen.calc.formaFichas(d, d.a, b);
      let s = fs.length * 2 * (d.a + b);
      for (let i = 0; i < fs.length; i++) for (let j = i + 1; j < fs.length; j++) {
        const [x1, y1, w1, h1] = fs[i], [x2, y2, w2, h2] = fs[j];
        const ox = Math.min(x1 + w1, x2 + w2) - Math.max(x1, x2), oy = Math.min(y1 + h1, y2 + h2) - Math.max(y1, y2);
        if (ox > 0 && oy > 0) return NaN; // se superponen
        if (ox === 0 && oy > 0) s -= 2 * oy; else if (oy === 0 && ox > 0) s -= 2 * ox;
      }
      return s;
    };
    if (d.pide === 'perimetro') return per(d.b);
    const bs = []; for (let b = d.a + 1; b <= 40; b++) if (per(b) === d.P) bs.push(b);
    return bs.length === 1 ? bs[0] : NaN;
  }
  if (d.tipo === 'medios') {
    let Q = [[0, 0], [d.L, 0], [d.L, d.L], [0, d.L]];
    const P1 = 4 * d.L;
    for (let k = 1; k < d.n; k++) Q = Q.map((q, i) => { const r = Q[(i + 1) % 4]; return [(q[0] + r[0]) / 2, (q[1] + r[1]) / 2]; });
    const area = Math.abs(Q.reduce((s, q, i) => { const r = Q[(i + 1) % 4]; return s + q[0] * r[1] - r[0] * q[1]; }, 0)) / 2;
    const per = Q.reduce((s, q, i) => { const r = Q[(i + 1) % 4]; return s + Math.hypot(r[0] - q[0], r[1] - q[1]); }, 0);
    return d.pide === 'area' ? area : d.pide === 'perimetro' ? per : P1 / per;
  }
  if (d.tipo === 'rectangulo') {
    const c = [];
    for (let w = 1; w <= 12; w++) for (let h = w; h <= 30; h++) if (w * h <= 60) c.push([w, h]);
    const med = ([w, h]) => (d.pide === 'area' ? w * h : 2 * (w + h));
    c.sort((x, y) => med(x) - med(y));
    for (const r of c) if (r[0] * r[1] >= FORMAS[d.piezas[0]].length + FORMAS[d.piezas[1]].length && cubre(r[0], r[1], d.piezas)) return med(r);
    return NaN;
  }
  if (d.tipo === 'lineal') {
    const p = d.W / d.n, q = d.H;
    let mejor = 0;
    for (let m = 0; m < (1 << d.n); m++) {
      const cel = new Set(); let x = 0;
      for (let i = 0; i < d.n; i++) { const [w, h] = (m >> i) & 1 ? [q, p] : [p, q]; for (let a = 0; a < w; a++) for (let b = 0; b < h; b++) cel.add(`${x + a},${b}`); x += w; }
      let per = 0; for (const k of cel) { const [a, b] = k.split(',').map(Number); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (!cel.has(`${a + dx},${b + dy}`)) per++; }
      mejor = Math.max(mejor, per);
    }
    return mejor;
  }
  if (d.tipo === 'cajas') return empaca(d.W, d.L, Array.from({ length: d.p * d.q }, (_, i) => [i % d.p, Math.floor(i / d.p)]));
  if (d.tipo === 'tablero') return empaca(d.c, d.r, FORMAS[d.pieza], d.bloqueadas);
  if (d.tipo === 'fibonacci') {
    const lados = [1, 1]; while (lados.length < d.n + 1) lados.push(lados[lados.length - 1] + lados[lados.length - 2]);
    let x0 = 0, y0 = 0, x1 = 1, y1 = 1;
    for (let i = 1; i < d.n; i++) { const s = lados[i], dir = (i - 1) % 4; if (dir === 0) x1 += s; else if (dir === 1) y1 += s; else if (dir === 2) x0 -= s; else y0 -= s; }
    const area = lados.slice(0, d.n).reduce((s, l) => s + l * l, 0);
    assert.equal(area, (x1 - x0) * (y1 - y0), 'los cuadrados llenan el rectángulo');
    return d.pide === 'area' ? area * d.u * d.u : 2 * ((x1 - x0) + (y1 - y0)) * d.u;
  }
  // malla
  const M = gen.calc.malla(d.n);
  const vecinos = ([i, j], [a, b]) => (a === i && Math.abs(b - j) === 1) || (a === i + 1 && (b === j || b === j + 1)) || (a === i - 1 && (b === j || b === j - 1));
  const vistos = new Set(M.camino.map(([i, j]) => `${i},${j}`));
  assert.equal(vistos.size, d.n * (d.n + 1) / 2, 'el camino pasa una vez por cada punto');
  assert.deepEqual(M.camino[0], [1, 1], 'empieza arriba');
  for (let k = 1; k < M.camino.length; k++) assert.ok(vecinos(M.camino[k - 1], M.camino[k]), 'cada paso es a un vecino');
  return (vistos.size - 1) * d.t;
}
probarGenerador(gen, { semillas: 600, recalcular });

test('salen los diez tipos en 200 semillas', () => {
  const tipos = new Set(); for (let s = 0; s < 200; s++) tipos.add(gen.generar(s)._datos.tipo);
  assert.equal(tipos.size, 10);
});

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) < 1e-9);
  });
}

test('papel.json: entre 5 y 10 problemas con respuesta, pasos y verificación', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  for (const p of papel.problemas) {
    assert.ok(p.id && p.enunciado && p.respuesta && p.pasos.length && p.verificar.length, p.id);
    assert.ok(!/\d\.\d/.test(p.enunciado + ' ' + p.respuesta + ' ' + p.pasos.join(' ')), `${p.id}: coma decimal`);
  }
});
for (const p of papel.problemas) test(`papel ${p.id}`, () => {
  for (const v of p.verificar) {
    const r = gen.calc[v.fn](...v.args);
    if (v.espera !== null && typeof v.espera === 'object' && !Array.isArray(v.espera)) for (const k of Object.keys(v.espera)) assert.deepEqual(r[k], v.espera[k], `${p.id}: ${v.fn}.${k}`);
    else assert.deepEqual(r, v.espera, `${p.id}: ${v.fn}`);
  }
});

// Propiedades.
test('trapecio: k² trapecios de tres triángulos arman el trapecio de lado k (k de 1 a 7)', () => {
  for (let k = 1; k <= 7; k++) {
    const t = gen.calc.trapecioTeselado(k);
    assert.ok(t, `k = ${k}`);
    assert.equal(t.length, k * k);
    assert.equal(new Set(t.flat()).size, 3 * k * k, 'sin superponerse');
  }
});
test('hexágonos: la búsqueda del generador coincide con la programación dinámica (lado 3 a 10)', () => {
  for (let k = 3; k <= 10; k++) assert.equal(gen.calc.hmax(k).max, hexDP(k), `lado ${k}`);
});
test('rectángulo: el embaldosado de la solución usa las dos piezas y cubre todo', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    if (p._datos.tipo !== 'rectangulo') continue;
    const r = gen.calc.minRectangulo(p._datos.piezas, p._datos.pide);
    const cel = r.teselas.flatMap(t => t.celdas.map(c => c.join(',')));
    assert.equal(new Set(cel).size, r.w * r.h);
    assert.equal(cel.length, r.w * r.h);
    assert.deepEqual([...new Set(r.teselas.map(t => t.t))].sort(), [0, 1]);
  }
});
test('cajas y tablero: el empaque de la solución no se superpone ni toca casillas tapadas', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.tipo !== 'cajas' && d.tipo !== 'tablero') continue;
    const M = d.tipo === 'cajas' ? gen.calc.maxEmpaque(d.W, d.L, Array.from({ length: d.p * d.q }, (_, i) => [i % d.p, Math.floor(i / d.p)])) : gen.calc.maxEmpaque(d.c, d.r, gen.calc.PIEZAS[d.pieza].celdas, d.bloqueadas);
    const cel = M.piezas.flat().map(c => c.join(','));
    assert.equal(new Set(cel).size, cel.length);
    if (d.tipo === 'tablero') for (const [x, y] of d.bloqueadas) assert.ok(!cel.includes(`${x},${y}`));
  }
});
