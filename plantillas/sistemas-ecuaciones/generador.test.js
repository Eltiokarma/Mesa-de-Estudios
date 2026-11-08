// Pruebas del generador «Sistemas, raíces y potencias»: casos.json (verificados aparte, a ciegas),
// un recálculo independiente en cada uno de 600 problemas, propiedades de las alternativas y el papel.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// ---------- Utilidades del recálculo (en flotantes, por otro camino que el generador) ----------
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
// Un decimal que en verdad es fracción: busca el denominador más chico (hasta 2000).
function aFraccion(x) {
  for (let d = 1; d <= 2000; d++) { const n = Math.round(x * d); if (Math.abs(n / d - x) < 1e-7) { const g = gcd(n, d) || 1; return [n / g + 0, d / g]; } }
  throw new Error(`${x} no parece una fracción`);
}
const claveNum = x => { const [n, d] = aFraccion(x); return `num:${n}/${d}`; };
// Ecuación de raíces r1 y r2 (reales): x² − (r1 + r2)x + r1·r2, llevada a enteros primitivos.
function claveEcuacion(r1, r2) {
  const s = aFraccion(r1 + r2), p = aFraccion(r1 * r2);
  const L = s[1] * p[1] / gcd(s[1], p[1]);
  let A = L, B = -s[0] * L / s[1], C = p[0] * L / p[1];
  const g = gcd(gcd(A, B), C); A /= g; B /= g; C /= g;
  return `ec:${A},${B + 0},${C + 0}`;
}
const raices = (a, b, c) => { const D = Math.sqrt(b * b - 4 * a * c); return [(-b + D) / (2 * a), (-b - D) / (2 * a)]; };
// Determinante por eliminación de Gauss (flotantes) y solución de un sistema 3 × 3.
function gauss(M, b) {
  const A = M.map((f, i) => [...f, b ? b[i] : 0]); let det = 1;
  for (let c = 0; c < 3; c++) {
    let piv = c; for (let i = c + 1; i < 3; i++) if (Math.abs(A[i][c]) > Math.abs(A[piv][c])) piv = i;
    if (piv !== c) { [A[c], A[piv]] = [A[piv], A[c]]; det = -det; }
    det *= A[c][c];
    for (let i = c + 1; i < 3; i++) { const k = A[i][c] / A[c][c]; for (let j = c; j < 4; j++) A[i][j] -= k * A[c][j]; }
  }
  const x = [0, 0, 0];
  for (let i = 2; i >= 0; i--) { let s = A[i][3]; for (let j = i + 1; j < 3; j++) s -= A[i][j] * x[j]; x[i] = s / A[i][i]; }
  return { det, x };
}

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'trabajo') {
    // Fuerza bruta: x jornadas propias, r de A en la casa de B, j de B en la casa de A.
    const sols = [];
    for (let x = 0; x <= d.T; x++) for (let j = 1; j <= 60; j++) { const r = d.T - x; if (x + j === d.H && r > 0 && d.a * r === d.b * j) sols.push({ x, r, j }); }
    assert.equal(sols.length, 1, 'trabajo: solución única');
    return d.sub === 'propia' ? sols[0].x : d.b * sols[0].j;
  }
  if (d.tipo === 'enteros') {
    const sols = [];
    for (let x = 1; x <= d.N; x++) for (let y = 1; y <= d.N; y++) for (let z = 1; z <= d.N; z++)
      if (x + y + z === d.N && d.p * x + d.q * y + d.r * z === d.S) sols.push(x);
    return d.sub === 'maximo' ? Math.max(...sols) : sols.length;
  }
  if (d.tipo === 'parametro') {
    // El producto x·y recorre, con x + y = S, los valores ≤ máximo; con x − y = S, los ≥ mínimo. Se busca en una grilla fina.
    let ext = d.sub === 'diferencia' ? Infinity : -Infinity;
    for (let i = -40000; i <= 40000; i++) {
      const x = i / 2000, k = d.sub === 'diferencia' ? x * (x - d.S) : x * (d.S - x);
      ext = d.sub === 'diferencia' ? Math.min(ext, k) : Math.max(ext, k);
    }
    const [n, den] = aFraccion((ext - d.w) / d.u);
    if (d.sub === 'unica') return `num:${n}/${den}`;
    return d.sub === 'suma' ? `int:(${n}/${den};inf)` : `int:(-inf;${n}/${den})`;
  }
  if (d.tipo === 'vieta') {
    if (d.sub === 'rectangulo') return claveEcuacion(d.L, d.W);
    const [r1, r2] = raices(d.a, d.b, d.c);
    const t = d.sub === 'cuadrados' ? z => z * z : d.sub === 'inversas' ? z => 1 / z : z => z + d.k;
    return claveEcuacion(t(r1), t(r2));
  }
  if (d.tipo === 'franja') {
    const areaVereda = (a, b, w) => (a + 2 * w) * (b + 2 * w) - a * b;
    if (d.sub === 'perimetro') {
      // Un jardín de 1 m por (s − 1) m: se busca la suma s que da esa área (el área solo depende de a + b).
      for (let s = 2; s <= 400; s++) if (Math.abs(areaVereda(1, s - 1, d.w) - d.A) < 1e-9) return 2 * s;
      throw new Error('franja sin solución');
    }
    let lo = 0, hi = 50;
    for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (areaVereda(d.L, d.W, m) < d.A) lo = m; else hi = m; }
    return Math.round(lo * 1e6) / 1e6;
  }
  if (d.tipo === 'exponencial') {
    const a = d.p ** d.m1, b = d.p ** d.m2;
    for (let x = -30; x <= 40; x++) for (let y = -30; y <= 40; y++) {
      const cond = d.sub === 'resta' ? x - y === d.d : x === d.d * y;
      if (cond && Math.abs(x * Math.log(a) + y * Math.log(b) - d.N * Math.log(d.p)) < 1e-9) return d.pide === 'xy' ? x * y : d.pide === 'suma' ? x + y : x;
    }
    throw new Error('exponencial sin solución');
  }
  if (d.tipo === 'vandermonde') {
    const M = [[1, 1, 1], [d.a, d.b, d.c], [d.a ** 2, d.b ** 2, d.c ** 2]];
    const g = gauss(M, [1, d.d, d.d ** 2]);
    return claveNum(d.sub === 'determinante' ? g.det : g.x[d.i]);
  }
  if (d.tipo === 'matriz') {
    const [[a, b], [c0, c]] = d.A;
    if (d.sub === 'entrada') {
      // Fórmulas cerradas: [1, k; 0, 1]ⁿ = [1, nk; 0, 1] y [a, 1; 0, a]ⁿ = [aⁿ, n·aⁿ⁻¹; 0, aⁿ].
      if (a === 1 && c === 1) return d.n * (b || c0);
      return d.n * a ** (d.n - 1);
    }
    const geo = r => (r === 1 ? d.n : (r ** (d.n + 1) - r) / (r - 1));
    return geo(a) + geo(c);
  }
  // valor-absoluto: se busca a (de 0,5 en 0,5) que cumple el dato, y se evalúa.
  for (let k2 = 1; k2 <= 400; k2++) {
    const a = k2 / 2, P = t => d.c + d.signo * a * Math.abs(t - d.k);
    if (Math.abs(P(d.t1) - d.v1) < 1e-9) return P(d.t2);
  }
  throw new Error('valor-absoluto sin a');
}

const igual = (esperado, valor) => (typeof valor === 'string' ? esperado === valor : Math.abs(esperado - valor) < 1e-6);
probarGenerador(gen, { semillas: 600, recalcular, igual });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    if (typeof c.esperado.respuesta === 'number') assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
    else assert.equal(p.respuesta.valor, c.esperado.respuesta);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

const SUBS = { trabajo: ['pago', 'propia'], enteros: ['cuantas', 'maximo'], parametro: ['diferencia', 'suma', 'unica'],
  vieta: ['cuadrados', 'desplazadas', 'inversas', 'rectangulo'], franja: ['ancho', 'perimetro'], exponencial: ['razon', 'resta'],
  vandermonde: ['determinante', 'variable'], matriz: ['entrada', 'traza'], 'valor-absoluto': [] };
const plano = partes => partes.map(x => (typeof x === 'string' ? x : x.t)).join('');

test('salen todos los tipos y subtipos', () => {
  const vistos = {};
  for (let s = 0; s < 800; s++) { const d = gen.generar(s)._datos; (vistos[d.tipo] = vistos[d.tipo] || new Set()).add(d.sub); }
  assert.deepEqual(Object.keys(vistos).sort(), Object.keys(SUBS).sort());
  for (const [t, subs] of Object.entries(SUBS)) if (subs.length) assert.deepEqual([...vistos[t]].sort(), subs, t);
});

test('las alternativas tienen la misma forma y ningún distractor da la correcta', () => {
  const FORMAS = {
    parametro: d => (d.sub === 'unica' ? /^−?\d+(\/\d+)?$/ : /^[⟨[](−∞|−?\d+(\/\d+)?); (\+∞|−?\d+(\/\d+)?)[⟩\]]$/),
    vieta: () => /^\d*x² ([+−] \d*x )?([+−] \d+ )?= 0$/,
    vandermonde: () => /^−?\d+(\/\d+)?$/,
  };
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos, alt = p.alternativas;
    if (FORMAS[d.tipo]) for (const a of alt) assert.match(a.texto, FORMAS[d.tipo](d), `semilla ${s}: ${a.texto}`);
    else {
      const unidad = a => a.texto.replace(/^S\/ /, 'S/').replace(/^−?[\d ]+(,\d+)? ?/, '').replace(/^(jornada|cuaderno|polo|chompa)$/, '$1s');
      const sing = u => u.replace(/^S\/.*/, 'S/').replace(/^(lápiz|par de .*)$/, '');
      assert.equal(new Set(alt.map(a => sing(unidad(a)).replace(/s$/, ''))).size, 1, `semilla ${s}: unidades distintas (${alt.map(a => a.texto)})`);
      for (const a of alt) assert.ok(!/\d,\d{3}/.test(a.texto), `semilla ${s}: más de dos decimales (${a.texto})`);
    }
    for (const a of alt.filter(a => !a.correcta)) assert.notEqual(a.valor, p.respuesta.valor, `semilla ${s}: un distractor da la correcta`);
  }
});

test('ningún texto trae undefined, NaN, −− ni guiones como signo menos', () => {
  for (let s = 0; s < 1000; s++) {
    const p = gen.generar(s);
    const todo = [plano(p.enunciado), plano(p.pregunta), ...p.solucion.map(plano), ...p.alternativas.map(a => a.texto + ' ' + (a.error ? a.error.explicacion : ''))].join(' | ');
    assert.ok(!/undefined|NaN|Infinity|null|−−|\+ −|− −|-\d|\d\.\d/.test(todo), `semilla ${s}: ${todo.match(/.{0,30}(undefined|NaN|Infinity|null|−−|\+ −|− −|-\d|\d\.\d).{0,20}/)}`);
    for (const parte of [...p.enunciado, ...p.pregunta, ...p.solucion.flat()]) if (typeof parte !== 'string') assert.ok(p.variables[parte.v], `semilla ${s}: variable ${parte.v} sin color`);
    const colores = Object.values(p.variables).map(x => x.color);
    assert.ok(colores.every(c => ['o', 'i', 'd', 'h'].includes(c)), `semilla ${s}: color raro`);
    assert.equal(new Set(colores).size, colores.length, `semilla ${s}: dos variables con el mismo color`);
  }
});

test('los datos son creíbles', () => {
  for (let s = 0; s < 800; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.tipo === 'trabajo') assert.ok(d.T <= 40 && d.H <= 40, `semilla ${s}: demasiadas jornadas`);
    if (d.tipo === 'enteros') assert.ok(d.N <= 24 && d.S <= 250, `semilla ${s}`);
    if (d.tipo === 'exponencial') assert.ok(d.N <= 30, `semilla ${s}: exponente ${d.N}`);
    if (d.tipo === 'franja') assert.ok(p.respuesta.valor > 0 && p.respuesta.valor <= 100, `semilla ${s}`);
    if (d.tipo === 'valor-absoluto') {
      const a = d.signo * (d.v1 - d.c) / Math.abs(d.t1 - d.k);
      assert.ok(a > 0, `semilla ${s}: a = ${a}`);
      for (let t = 1; t <= 20; t++) assert.ok(d.c + d.signo * a * Math.abs(t - d.k) > 0, `semilla ${s}: producción ≤ 0 en la semana ${t}`);
    }
    if (d.tipo === 'matriz') assert.ok(Math.abs(p.respuesta.valor) < 1e5, `semilla ${s}`);
  }
});

test('papel.json: entre 8 y 10 problemas bien formados', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 8 && papel.problemas.length <= 10);
  for (const q of papel.problemas) {
    for (const campo of ['id', 'nivel', 'enunciado', 'respuesta', 'pasos']) assert.ok(q[campo], `${q.id}: falta ${campo}`);
    assert.ok(['básico', 'intermedio', 'avanzado'].includes(q.nivel), q.id);
    assert.ok(Array.isArray(q.pasos) && q.pasos.length >= 2, q.id);
  }
  assert.ok(!/regalo|es la inversa/i.test(papel.titulo));
});

test('papel.json: cada respuesta se recalcula', () => {
  const R = Object.fromEntries(papel.problemas.map(q => [q.id, q.respuesta]));
  // p1: lados con suma 17 y producto 60 (búsqueda).
  const lados = []; for (let a = 1; a <= 34; a++) for (let b = 1; b <= a; b++) if (a * b === 60 && 2 * (a + b) === 34) lados.push([a, b]);
  assert.deepEqual(lados, [[12, 5]]); assert.ok(R.p1.includes('x² − 17x + 60 = 0') && R.p1.includes('12 m') && R.p1.includes('5 m'));
  // p2: vereda de 1,5 m con 75 m².
  assert.equal(recalcular({ _datos: { tipo: 'franja', sub: 'perimetro', w: 1.5, A: 75 } }), 44); assert.equal(R.p2, '44 m.');
  // p3: jornadas y deuda.
  assert.equal(recalcular({ _datos: { tipo: 'trabajo', sub: 'propia', a: 90, b: 120, T: 18, H: 16 } }), 10);
  assert.equal(recalcular({ _datos: { tipo: 'trabajo', sub: 'pago', a: 90, b: 120, T: 18, H: 16 } }), 720); assert.equal(R.p3, '10 jornadas; S/ 720.');
  // p4: frutas.
  const f4 = { tipo: 'enteros', p: 6, q: 4, r: 1, N: 20, S: 70 };
  assert.equal(recalcular({ _datos: { ...f4, sub: 'cuantas' } }), 3); assert.equal(recalcular({ _datos: { ...f4, sub: 'maximo' } }), 7);
  assert.equal(R.p4, 'De 3 maneras; a lo más 7 mangos.');
  // p5: x + y = 6, xy = m + 1.
  assert.equal(recalcular({ _datos: { tipo: 'parametro', sub: 'suma', S: 6, u: 1, w: 1 } }), 'int:(8/1;inf)'); assert.equal(R.p5, 'm ∈ ⟨8; +∞⟩.');
  // p6: cuadrados de las raíces de x² − 3x − 2.
  assert.equal(recalcular({ _datos: { tipo: 'vieta', sub: 'cuadrados', a: 1, b: -3, c: -2 } }), 'ec:1,-13,4'); assert.equal(R.p6, 'x² − 13x + 4 = 0.');
  // p7: 4ˣ·8ʸ = 2¹⁸, x = 3y.
  assert.equal(recalcular({ _datos: { tipo: 'exponencial', sub: 'razon', p: 2, m1: 2, m2: 3, N: 18, d: 3, pide: 'suma' } }), 8); assert.equal(R.p7, '8.');
  // p8: Vandermonde con 2, 3, 4 y d = 5; se comprueba también x = 1, y = −3.
  assert.equal(recalcular({ _datos: { tipo: 'vandermonde', sub: 'variable', a: 2, b: 3, c: 4, d: 5, i: 2 } }), 'num:3/1'); assert.equal(R.p8, 'z = 3.');
  const [x, y, z] = [1, -3, 3]; assert.deepEqual([x + y + z, 2 * x + 3 * y + 4 * z, 4 * x + 9 * y + 16 * z], [1, 5, 25]);
  // p9: traza de A + A² + A³ + A⁴ con A = [1, 4; 0, 2].
  assert.equal(recalcular({ _datos: { tipo: 'matriz', sub: 'traza', A: [[1, 4], [0, 2]], n: 4 } }), 34); assert.equal(R.p9, '34.');
  // p10: P(t) = 300 − a|t − 8|, P(2) = 252, P(13).
  assert.equal(recalcular({ _datos: { tipo: 'valor-absoluto', signo: -1, c: 300, k: 8, t1: 2, v1: 252, t2: 13 } }), 260); assert.equal(R.p10, '260 chompas.');
});
