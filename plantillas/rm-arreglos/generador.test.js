// Pruebas del generador de arreglos numéricos: casos.json, papel.json y, en cada uno de 600 problemas, un
// recálculo independiente hecho solo desde p._datos:
//   multiplicativo  exponentes por eliminación de Gauss con fracciones (sin el molde del cuadrado mágico) y signos
//                   probando las 2^k combinaciones de las casillas vacías
//   vertices        las 9! formas de llenar el cuadro
//   piramide        sumando piso por piso (y probando x de −50 a 200)
//   fila            probando los números de las casillas que faltan del patrón
//   latino          otra búsqueda (fila por fila con permutaciones)
//   crecientes      todas las formas de repartir los números en filas crecientes
//   paridad         programación dinámica por filas sobre las paridades
//   asientos        numerando las butacas una por una
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

const LINEAS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

// ---------- multiplicativo ----------
const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
function gaussFracciones(filas, nvar) { // filas: [coefs..., rhs] enteros; devuelve solución única o null
  let M = filas.map(r => r.map(x => [x, 1]));
  const sub = (p, q) => { const n = p[0] * q[1] - q[0] * p[1], d = p[1] * q[1]; const g = mcd(n, d) || 1; return [n / g, d / g]; };
  const mul = (p, q) => { const n = p[0] * q[0], d = p[1] * q[1]; const g = mcd(n, d) || 1; return d < 0 ? [-n / g, -d / g] : [n / g, d / g]; };
  const div = (p, q) => mul(p, [q[1], q[0]]);
  let fila = 0; const piv = [];
  for (let col = 0; col < nvar; col++) {
    let k = fila; while (k < M.length && M[k][col][0] === 0) k++;
    if (k === M.length) return null;
    [M[fila], M[k]] = [M[k], M[fila]];
    for (let r = 0; r < M.length; r++) if (r !== fila && M[r][col][0] !== 0) { const q = div(M[r][col], M[fila][col]); M[r] = M[r].map((x, t) => sub(x, mul(q, M[fila][t]))); }
    piv.push(col); fila++;
  }
  for (let r = nvar; r < M.length; r++) if (M[r][nvar][0] !== 0) return null;
  return piv.map((col, r) => div(M[r][nvar], M[r][col]));
}
function recalcularMultiplicativo(d) {
  const libres = [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(i => !d.dados.includes(i));
  const idx = new Map(libres.map((i, k) => [i, k])); const nv = libres.length + 1; // + S
  const ex = i => Math.round(Math.log(Math.abs(d.signos[i] * Math.pow(d.base, d.exps[i]))) / Math.log(d.base));
  const filas = LINEAS.map(l => { const r = Array(nv + 1).fill(0); let cte = 0; l.forEach(i => { if (idx.has(i)) r[idx.get(i)] += 1; else cte += ex(i); }); r[nv - 1] = -1; r[nv] = -cte; return r; });
  const sol = gaussFracciones(filas, nv);
  if (!sol || sol.some(([n, q]) => q !== 1)) return NaN;
  const e = Array(9); d.dados.forEach(i => { e[i] = d.exps[i]; }); libres.forEach((i, k) => { e[i] = sol[k][0]; });
  // Signos: todas las combinaciones de las vacías; deben dar una sola que cumpla.
  const buenos = [];
  for (let m = 0; m < (1 << libres.length); m++) {
    const s = Array(9); d.dados.forEach(i => { s[i] = d.signos[i]; }); libres.forEach((i, k) => { s[i] = (m >> k) & 1 ? -1 : 1; });
    const pr = LINEAS.map(l => s[l[0]] * s[l[1]] * s[l[2]]);
    if (pr.every(x => x === pr[0])) buenos.push(s);
  }
  // Más de un patrón de signos posible = el problema no tiene una sola respuesta.
  if (buenos.length !== 1) return NaN;
  const val = e.map((x, i) => buenos[0][i] * Math.pow(d.base, x));
  return d.pide === 'x' ? val[d.x] : libres.reduce((s, i) => s + val[i], 0);
}

// ---------- vertices ----------
const CACHE_V = new Map();
function recalcularVertices(d) {
  const k = d.numeros.join(',');
  if (!CACHE_V.has(k)) {
    const S = new Set(), a = d.numeros.slice(), g = Array(9), usado = Array(9).fill(false);
    const rec = t => {
      if (t === 9) { const b = [[0, 1, 3, 4], [1, 2, 4, 5], [3, 4, 6, 7], [4, 5, 7, 8]].map(B => B.reduce((s, i) => s + g[i], 0)); if (b.every(x => x === b[0])) S.add(b[0]); return; }
      for (let i = 0; i < 9; i++) if (!usado[i]) { usado[i] = true; g[t] = a[i]; rec(t + 1); usado[i] = false; }
    };
    rec(0);
    CACHE_V.set(k, [...S]);
  }
  const S = CACHE_V.get(k);
  return d.pide === 'max' ? Math.max(...S) : Math.min(...S);
}

// ---------- piramide ----------
function cimaPisos(base) { let f = base.slice(); while (f.length > 1) { const g = []; for (let i = 0; i + 1 < f.length; i++) g.push(f[i] + f[i + 1]); f = g; } return f[0]; }
function recalcularPiramide(d) {
  if (d.pide === 'cima') return cimaPisos(d.base);
  const T = cimaPisos(d.base), r = [];
  for (let x = -50; x <= 200; x++) { const b = d.base.slice(); b[d.x] = x; if (cimaPisos(b) === T) r.push(x); }
  return r.length === 1 ? r[0] : NaN;
}

// ---------- fila ----------
function recalcularFila(d) {
  const { n, k, periodo, total } = d;
  const primero = periodo[0], ultimo = periodo[(n - 1) % k];
  const Ss = new Set();
  const p = Array(k).fill(null);
  const rec = i => {
    if (i === k) {
      const celdas = Array.from({ length: n }, (_, t) => p[t % k]);
      if (celdas[0] === primero && celdas[n - 1] === ultimo && celdas.reduce((a, b) => a + b, 0) === total) Ss.add(p.reduce((a, b) => a + b, 0));
      return;
    }
    for (let x = 0; x <= 40; x++) { p[i] = x; rec(i + 1); }
  };
  rec(0);
  return Ss.size === 1 ? [...Ss][0] : NaN;
}

// ---------- latino ----------
function permutaciones(n) { const r = []; const per = (a, rest) => { if (!rest.length) r.push(a); rest.forEach((x, i) => per([...a, x], rest.filter((_, j) => j !== i))); }; per([], Array.from({ length: n }, (_, i) => i + 1)); return r; }
function recalcularLatino(d) {
  const { n, diag, sol, dados, marcas, expr } = d;
  const fijo = Array.from({ length: n }, () => Array(n).fill(0));
  dados.forEach(([r, c]) => { fijo[r][c] = sol[r][c]; });
  const perms = permutaciones(n);
  const porFila = fijo.map(fl => perms.filter(p => fl.every((x, c) => !x || p[c] === x)));
  const sols = [];
  const g = [];
  const rec = r => {
    if (sols.length > 1) return;
    if (r === n) {
      if (diag) { const d1 = new Set(g.map((fl, i) => fl[i])), d2 = new Set(g.map((fl, i) => fl[n - 1 - i])); if (d1.size < n || d2.size < n) return; }
      sols.push(g.map(fl => fl.slice())); return;
    }
    for (const p of porFila[r]) { if (g.some(fl => fl.some((x, c) => x === p[c]))) continue; g.push(p); rec(r + 1); g.pop(); }
  };
  rec(0);
  if (sols.length !== 1) return NaN;
  const [a, b, c] = marcas.map(([r, cc]) => sols[0][r][cc]);
  return { 'a + b + c': a + b + c, 'a × b + c': a * b + c, 'a × b − c': a * b - c, '(a + b) × c': (a + b) * c, 'a × b × c': a * b * c, 'a + b × c': a + b * c }[expr];
}

// ---------- crecientes ----------
const CACHE_C = new Map();
function recalcularCrecientes(d) {
  const { r, c, j, pide, m } = d, N = r * c;
  const k = [r, c, j, pide].join(',');
  if (!CACHE_C.has(k)) {
    // Repartir 1…N en r filas de c (cada fila es un conjunto; ordenada crece sola). Las filas se toman en orden
    // por su menor elemento para no repetir.
    let mejor = pide === 'max' ? -Infinity : Infinity;
    const usado = Array(N + 1).fill(false), filas = [];
    const combos = (desde, falta, acc, fn) => { if (!falta) return fn(acc); for (let x = desde; x <= N; x++) if (!usado[x]) { usado[x] = true; acc.push(x); combos(x + 1, falta - 1, acc, fn); acc.pop(); usado[x] = false; } };
    const rec = () => {
      if (filas.length === r) { const s = filas.reduce((t, fl) => t + fl[j - 1], 0); mejor = pide === 'max' ? Math.max(mejor, s) : Math.min(mejor, s); return; }
      let primero = 1; while (usado[primero]) primero++;
      usado[primero] = true;
      combos(primero + 1, c - 1, [primero], acc => { filas.push(acc.slice()); rec(); filas.pop(); });
      usado[primero] = false;
    };
    rec();
    CACHE_C.set(k, mejor);
  }
  const s = CACHE_C.get(k);
  return m * r + (s - r) * d.d;
}

// ---------- paridad ----------
function recalcularParidad(d) {
  const { r, c, bloqueadas } = d;
  const bl = new Set(bloqueadas.map(([a, b]) => a * c + b));
  let dp = new Map([[-1, 0]]); // máscara de pares de la fila anterior (−1: no hay fila) → máximo de pares
  for (let i = 0; i < r; i++) {
    const nuevo = new Map();
    for (let m = 0; m < (1 << c); m++) {
      let ok = true, cuenta = 0;
      for (let j = 0; j < c; j++) {
        const libre = !bl.has(i * c + j), par = (m >> j) & 1;
        if (!libre && par) { ok = false; break; }
        if (libre && par) cuenta++;
        if (j > 0 && libre && !bl.has(i * c + j - 1) && ((m >> (j - 1)) & 1) === par) { ok = false; break; }
      }
      if (!ok) continue;
      for (const [ma, val] of dp) {
        if (ma >= 0) {
          let bien = true;
          for (let j = 0; j < c; j++) if (!bl.has(i * c + j) && !bl.has((i - 1) * c + j) && ((ma >> j) & 1) === ((m >> j) & 1)) { bien = false; break; }
          if (!bien) continue;
        }
        nuevo.set(m, Math.max(nuevo.get(m) ?? -1, val + cuenta));
      }
    }
    dp = nuevo;
  }
  return Math.max(...dp.values());
}

// ---------- asientos ----------
function recalcularAsientos(d) {
  const { c, n, pide } = d, filas = Math.ceil(n / c) + 2;
  const lugar = {}; let k = 1;
  for (let f = 1; f <= filas; f++) { const orden = f % 2 ? [...Array(c).keys()] : [...Array(c).keys()].reverse(); for (const p of orden) lugar[k++] = [f, p]; }
  const [f, p] = lugar[n], meta = pide === 'detras' ? f + 1 : f - 1;
  return Number(Object.keys(lugar).find(x => lugar[x][0] === meta && lugar[x][1] === p));
}

function recalcular(p) {
  const d = p._datos;
  return { multiplicativo: recalcularMultiplicativo, vertices: recalcularVertices, piramide: recalcularPiramide, fila: recalcularFila,
    latino: recalcularLatino, crecientes: recalcularCrecientes, paridad: recalcularParidad, asientos: recalcularAsientos }[d.tipo](d);
}
probarGenerador(gen, { semillas: 600, recalcular });

test('salen los ocho tipos en 200 semillas', () => {
  const tipos = new Set(); for (let s = 0; s < 200; s++) tipos.add(gen.generar(s)._datos.tipo);
  assert.equal(tipos.size, 8);
});

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(p.respuesta.valor, c.esperado.respuesta);
  });
}

test('papel.json: entre 5 y 10 problemas con respuesta, pasos y verificación', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  for (const p of papel.problemas) {
    assert.ok(p.id && p.enunciado && p.respuesta && p.pasos.length && p.verificar.length, p.id);
    assert.ok(!/\d\.\d/.test(p.enunciado + p.respuesta + p.pasos.join('')), `${p.id}: coma decimal`);
  }
});
for (const p of papel.problemas) test(`papel ${p.id}`, () => {
  for (const v of p.verificar) {
    const r = gen.calc[v.fn](...v.args);
    if (v.espera !== null && typeof v.espera === 'object' && !Array.isArray(v.espera)) for (const k of Object.keys(v.espera)) assert.deepEqual(r[k], v.espera[k], `${p.id}: ${v.fn}.${k}`);
    else assert.deepEqual(r, v.espera, `${p.id}: ${v.fn}`);
  }
});

test('multiplicativo: los números dados dejan una sola forma de completar', () => {
  for (let s = 0; s < 300; s++) {
    const p = gen.generar(s);
    if (p._datos.tipo === 'multiplicativo') assert.equal(gen.calc.completarMultiplicativo(p._datos).length, 1);
  }
});
test('latino: el cuadro dado tiene una sola solución y la figura no la muestra', () => {
  for (let s = 0; s < 300; s++) {
    const p = gen.generar(s);
    if (p._datos.tipo !== 'latino') continue;
    const d = p._datos;
    assert.equal(gen.calc.resolverLatino(d.n, d.diag, d.dados.map(([r, c]) => [r, c, d.sol[r][c]])).length, 1);
    for (const [r, c] of d.marcas) assert.ok(!d.dados.some(([a, b]) => a === r && b === c));
  }
});
test('vertices: el arreglo de la solución cumple y usa los nueve números', () => {
  for (let s = 0; s < 300; s++) {
    const p = gen.generar(s);
    if (p._datos.tipo !== 'vertices') continue;
    const arr = gen.calc.sumasVertices(p._datos.numeros)[p.respuesta.valor];
    assert.deepEqual(arr.slice().sort((a, b) => a - b), p._datos.numeros.slice().sort((a, b) => a - b));
  }
});
