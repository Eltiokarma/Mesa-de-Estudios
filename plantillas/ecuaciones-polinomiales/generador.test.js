// Pruebas del generador «ecuaciones-polinomiales»: casos.json (verificados aparte, a ciegas), papel.json y un
// recálculo independiente en cada uno de 600 problemas. El recálculo no usa las relaciones de Cardano-Vieta que
// usa el generador: halla las raíces numéricamente (Durand-Kerner, en complejos) o por búsqueda entre enteros y
// racionales, sustituyendo en el polinomio.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// ---------- herramientas independientes ----------
const C = (re, im = 0) => ({ re, im });
const cmul = (a, b) => C(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
const cdiv = (a, b) => { const d = b.re * b.re + b.im * b.im; return C((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d); };
const csub = (a, b) => C(a.re - b.re, a.im - b.im);
const cabs = a => Math.hypot(a.re, a.im);
function horner(coefs, z) { let r = C(0); for (const c of coefs) r = C(cmul(r, z).re + c, cmul(r, z).im); return r; }
// Todas las raíces (complejas) de un polinomio de coeficientes reales, por Durand-Kerner.
function raices(coefs) {
  const a0 = coefs[0], m = coefs.map(c => c / a0), n = m.length - 1;
  let z = Array.from({ length: n }, (_, k) => { const w = cmul(C(0.4, 0.9), C(1)); let p = C(1); for (let j = 0; j < k; j++) p = cmul(p, w); return cmul(p, C(1 + k * 0.1)); });
  for (let it = 0; it < 3000; it++) {
    const nuevo = z.map((zi, i) => { let d = C(1); z.forEach((zj, j) => { if (j !== i) d = cmul(d, csub(zi, zj)); }); return csub(zi, cdiv(horner(m, zi), d)); });
    const paso = Math.max(...nuevo.map((w, i) => cabs(csub(w, z[i]))));
    z = nuevo;
    if (paso < 1e-14) break;
  }
  return z;
}
const evalR = (coefs, x) => coefs.reduce((r, c) => r * x + c, 0);
const enteros = (coefs, lim = 200) => { const l = []; for (let x = -lim; x <= lim; x++) if (evalR(coefs, x) === 0) l.push(x); return l; };
const valorClave = clave => { const [n, d] = clave.slice(4).split('/').map(Number); return n / d; };

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'vieta' && d.sub === 'cuadrados') return raices([d.a, d.b, d.c, d.d]).reduce((s, z) => s + cmul(z, z).re, 0);
  if (d.tipo === 'vieta' && d.sub === 'cubos') {
    // Busca ternas enteras con la suma y la suma de productos dadas (cualquier orden), con una el doble de otra.
    const halladas = new Set();
    for (let x = -30; x <= 30; x++) for (let y = x; y <= 30; y++) {
      const z = d.S - x - y; if (z < y) continue;
      if (x * y + x * z + y * z !== d.Q) continue;
      const t = [x, y, z];
      if (t.some(a => t.some((b, j) => t.indexOf(a) !== j && b === 2 * a))) halladas.add(x ** 3 + y ** 3 + z ** 3);
    }
    assert.equal(halladas.size, 1, 'cubos: más de una respuesta');
    return [...halladas][0];
  }
  if (d.tipo === 'vieta' && d.sub === 'tercera') {
    // P(r1) = P(r2) = 0 es un sistema lineal en m y n; luego se hallan las tres raíces y se quita r1 y r2.
    const f = r => [r * r, 1, -(d.a * r ** 3 + d.c * r)];   // m·r² + n = −(a r³ + c r)
    const [a1, b1, c1] = f(d.r1), [a2, b2, c2] = f(d.r2);
    const det = a1 * b2 - a2 * b1, m = (c1 * b2 - c2 * b1) / det, n = (a1 * c2 - a2 * c1) / det;
    const zs = raices([d.a, m, d.c, n]).map(z => z.re);
    zs.sort((x, y) => Math.min(Math.abs(x - d.r1), Math.abs(x - d.r2)) - Math.min(Math.abs(y - d.r1), Math.abs(y - d.r2)));
    return zs[2];
  }
  if (d.tipo === 'vieta' && d.sub === 'progresion') {
    // Busca k entero tal que las tres raíces sean reales y equiespaciadas.
    for (let k = -300; k <= 300; k++) {
      const b = -d.S, c = k, e = -d.R;   // discriminante de la cúbica: ≥ 0 si las tres raíces son reales
      if (18 * b * c * e - 4 * b ** 3 * e + b * b * c * c - 4 * c ** 3 - 27 * e * e < 0) continue;
      const zs = raices([1, -d.S, k, -d.R]);
      if (zs.some(z => Math.abs(z.im) > 1e-6)) continue;
      const x = zs.map(z => z.re).sort((u, w) => u - w);
      if (Math.abs((x[1] - x[0]) - (x[2] - x[1])) < 1e-6) return k;
    }
    return NaN;
  }
  if (d.tipo === 'caja' && d.sub === 'dimensiones') {
    const xs = []; for (let x = 1; x <= 100; x++) if (x * (x + d.al) * (x + d.be) === d.V) xs.push(x);
    assert.equal(xs.length, 1); return Math.max(xs[0], xs[0] + d.al, xs[0] + d.be);
  }
  if (d.tipo === 'caja' && d.sub === 'recorte') {
    const xs = []; for (let x = 1; 2 * x < d.W; x++) if (x * (d.L - 2 * x) * (d.W - 2 * x) === d.V) xs.push(x);
    assert.equal(xs.length, 1);
    const x = xs[0], a = d.L - 2 * x, b = d.W - 2 * x;
    return a * b + 2 * a * x + 2 * b * x;            // fondo + cuatro caras
  }
  if (d.tipo === 'bicuadrada' && d.sub === 'consecutivos') {
    for (let a = 1; a < 100; a++) if (a ** 4 + (a + 2) ** 4 === d.K) return a + 2;
    return NaN;
  }
  if (d.tipo === 'bicuadrada' && d.sub === 'precio') {
    const ps = []; for (let p = 1; p <= 100; p++) if (p ** 4 + d.K === d.M * p * p) ps.push(p);
    return Math.max(...ps) - Math.min(...ps);
  }
  if (d.tipo === 'bicuadrada' && d.sub === 'imaginarias') {
    const zs = raices([1, 0, d.B, 0, d.C]);
    assert.ok(zs.every(z => Math.abs(z.im) > 1e-6), 'imaginarias: hay una raíz real');
    return zs.reduce((s, z) => s + cabs(z), 0);
  }
  if (d.tipo === 'igualar') {
    for (let t = 0.5; t <= 50; t += 0.5) if (Math.abs(evalR(d.A, t) - evalR(d.B, t)) < 1e-9) return t;
    return NaN;
  }
  if (d.tipo === 'parametro' && d.sub === 'mayor') {
    const k = -(d.r ** 3 - d.S * d.r ** 2 - d.R) / d.r;
    return Math.max(...enteros([1, -d.S, k, -d.R]));
  }
  if (d.tipo === 'parametro' && d.sub === 'valor') {
    const k = -(d.r ** 3 + d.b * d.r ** 2 + d.d) / d.r;
    const xs = []; for (let x = -100; x <= 100; x++) if (evalR([1, d.b, k, d.d], x) === d.d) xs.push(x);
    return 'set:' + xs.join(',');
  }
  if (d.tipo === 'multiple') {
    // P'(r) = P''(r) = 0 (no dependen de m) y luego m = −(r⁴ + A r³ + B r² + C r).
    const sols = [];
    for (let r = -50; r <= 50; r++) {
      if (4 * r ** 3 + 3 * d.A * r * r + 2 * d.B * r + d.C === 0 && 12 * r * r + 6 * d.A * r + 2 * d.B === 0) sols.push(-(r ** 4 + d.A * r ** 3 + d.B * r * r + d.C * r));
    }
    assert.equal(sols.length, 1); return sols[0];
  }
  if (d.tipo === 'conjugada') {
    // La raíz dada anula P: dos ecuaciones reales (parte real e imaginaria, o parte racional y la de √b) lineales en m y n.
    let m, n;
    if (d.sub === 'compleja') {
      const z = C(d.a, d.b), z2 = cmul(z, z), z3 = cmul(z2, z);
      const det = z2.re * z.im - z2.im * z.re;
      m = (-(z3.re + d.p) * z.im + z3.im * z.re) / det;
      n = (-z3.im * z2.re + (z3.re + d.p) * z2.im) / det;
    } else {
      // (a + √b)ᵏ = uₖ + vₖ√b
      const mul = ([u1, v1], [u2, v2]) => [u1 * u2 + v1 * v2 * d.b, u1 * v2 + u2 * v1];
      const w1 = [d.a, 1], w2 = mul(w1, w1), w3 = mul(w2, w1);
      const det = w2[0] * w1[1] - w2[1] * w1[0];
      m = (-(w3[0] + d.p) * w1[1] + w3[1] * w1[0]) / det;
      n = (-w3[1] * w2[0] + (w3[0] + d.p) * w2[1]) / det;
    }
    assert.ok(Number.isInteger(Math.round(m * 1e9) / 1e9) && Math.abs(m - Math.round(m)) < 1e-9, 'm no es entero');
    const reales = raices([1, m, n, d.p]).filter(z => Math.abs(z.im) < 1e-6).map(z => z.re);
    if (d.sub === 'compleja') { assert.equal(reales.length, 1); return reales[0]; }
    // Racional: la que no es a ± √b.
    return reales.find(x => Math.abs(Math.abs(x - d.a) - Math.sqrt(d.b)) > 1e-6);
  }
  if (d.tipo === 'divisores') {
    // Candidatos ±p/q y sustitución exacta con enteros: P(p/q)·q³ = 0.
    const [a3, a2, a1, a0] = d.coef, sol = [];
    for (let q = 1; q <= Math.abs(a3); q++) for (let pp = -Math.abs(a0); pp <= Math.abs(a0); pp++) {
      if (pp === 0 || Math.abs(a3) % q || a0 % pp || q === 1) continue;
      if (Math.abs(pp) % q === 0) continue;
      if (a3 * pp ** 3 + a2 * pp * pp * q + a1 * pp * q * q + a0 * q ** 3 === 0) sol.push(pp / q);
    }
    const unicos = [...new Set(sol.map(x => Math.round(x * 1e9)))];
    assert.equal(unicos.length, 1); return sol[0];
  }
  throw new Error('tipo desconocido ' + d.tipo);
}
const igual = (esperado, clave) => (typeof esperado === 'string' ? esperado === clave : Math.abs(esperado - valorClave(clave)) < 1e-6);
probarGenerador(gen, { semillas: 600, recalcular, igual });

// ---------- casos.json ----------
for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(p.respuesta.texto, c.esperado.exacta);
    if (typeof c.esperado.respuesta === 'number') assert.ok(Math.abs(valorClave(p.respuesta.valor) - c.esperado.respuesta) <= casos.tolerancia);
    else assert.equal(p.respuesta.valor, c.esperado.respuesta);
  });
}

// ---------- propiedades ----------
const COMBOS = ['vieta/cuadrados', 'vieta/cubos', 'vieta/tercera', 'vieta/progresion', 'caja/dimensiones', 'caja/recorte',
  'bicuadrada/consecutivos', 'bicuadrada/precio', 'bicuadrada/imaginarias', 'igualar', 'parametro/mayor', 'parametro/valor',
  'multiple', 'conjugada/compleja', 'conjugada/irracional', 'divisores'];
const plano = partes => partes.map(x => (typeof x === 'string' ? x : x.t)).join('');

test('salen todos los tipos y subtipos', () => {
  const vistos = new Set();
  for (let s = 0; s < 600; s++) { const d = gen.generar(s)._datos; vistos.add(d.sub ? `${d.tipo}/${d.sub}` : d.tipo); }
  assert.deepEqual([...vistos].sort(), [...COMBOS].sort());
});

test('alternativas con la misma forma: todas números con la misma unidad, o todas conjuntos', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), alt = p.alternativas;
    const formas = new Set(alt.map(a => (a.valor.startsWith('set:') ? 'set' : 'num')));
    assert.equal(formas.size, 1, `semilla ${s}: mezcla formas`);
    const unidad = a => a.texto.replace(/^[−\d /]+/, '').replace(/^sol$/, 'soles');
    if (formas.has('num')) assert.equal(new Set(alt.map(unidad)).size, 1, `semilla ${s}: unidades distintas (${alt.map(a => a.texto)})`);
    for (const a of alt) assert.ok(!/\d,\d{3}/.test(a.texto), `semilla ${s}: decimales largos`);
  }
});

test('ningún distractor da la respuesta correcta (recalculada por el otro camino)', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), esperado = recalcular(p);
    for (const a of p.alternativas.filter(a => !a.correcta)) assert.ok(!igual(esperado, a.valor), `semilla ${s}: ${a.texto} (${a.error.id}) también es correcta`);
  }
});

test('los textos están limpios: sin undefined, NaN, «−−», «+ −» ni guion ASCII delante de un número', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    const textos = [plano(p.enunciado), plano(p.pregunta), ...p.solucion.map(plano), ...p.alternativas.map(a => a.texto + ' ' + (a.error ? a.error.explicacion : ''))];
    for (const t of textos) {
      assert.ok(!/undefined|NaN|Infinity|−−|\+ −|− −|-\d/.test(t), `semilla ${s}: «${t}»`);
    }
  }
});

test('cada segmento de enunciado, pregunta y solución es texto o {v, t} con t texto y v en variables', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    const partes = [...p.enunciado, ...p.pregunta];
    for (const paso of p.solucion) { assert.ok(Array.isArray(paso), `semilla ${s}: paso que no es lista`); partes.push(...paso); }
    for (const x of partes) {
      if (typeof x === 'string') continue;
      assert.ok(x && typeof x === 'object' && typeof x.t === 'string' && typeof x.v === 'string' && p.variables[x.v], `semilla ${s}: segmento inválido ${JSON.stringify(x)}`);
    }
  }
});

test('regla 4: cada clave de color usada existe en variables y usa colores de la app', () => {
  for (let s = 0; s < 300; s++) {
    const p = gen.generar(s);
    const colores = Object.values(p.variables).map(x => x.color);
    assert.ok(colores.every(c => ['o', 'i', 'd', 'h'].includes(c)), `semilla ${s}`);
    assert.equal(new Set(colores).size, colores.length, `semilla ${s}: dos variables con el mismo color`);
    for (const parte of [...p.enunciado, ...p.pregunta, ...p.solucion.flat()]) if (typeof parte !== 'string') assert.ok(p.variables[parte.v], `semilla ${s}: clave ${parte.v} sin variable`);
    assert.ok(p.pregunta.some(x => typeof x !== 'string' && x.v === 'X'), `semilla ${s}: la pregunta no pinta lo pedido`);
  }
});

test('los datos son creíbles', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos, r = valorClave(p.respuesta.valor.startsWith('num:') ? p.respuesta.valor : 'num:0/1');
    if (d.tipo === 'bicuadrada' && d.sub === 'precio') assert.ok(Math.sqrt(d.M) < 13, `semilla ${s}: precio alto`);
    if (d.tipo === 'caja') assert.ok(d.V > 0 && d.V < 2000, `semilla ${s}: volumen ${d.V}`);
    if (d.tipo === 'igualar') { assert.ok(r > 0 && r <= 6); for (let t = 0; t <= r; t += 0.1) assert.ok(evalR(d.A, t) > 0 && evalR(d.B, t) > 0, `semilla ${s}: volumen negativo`); }
    if (d.tipo === 'parametro' && d.sub === 'mayor') assert.ok(r > 0 && r < 10);
    if (d.tipo === 'divisores') assert.ok(d.coef.every(c => Math.abs(c) <= 80));
  }
});

// ---------- papel.json ----------
test('papel.json: 8 a 10 problemas bien formados, con título que no regala el método', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 8 && papel.problemas.length <= 10);
  for (const pr of papel.problemas) {
    for (const campo of ['id', 'nivel', 'enunciado', 'respuesta', 'pasos']) assert.ok(pr[campo], `${pr.id}: falta ${campo}`);
    assert.ok(['básico', 'intermedio', 'avanzado'].includes(pr.nivel));
    assert.ok(Array.isArray(pr.pasos) && pr.pasos.length >= 2);
  }
  assert.equal(new Set(papel.problemas.map(p => p.id)).size, papel.problemas.length);
});

test('papel.json: cada respuesta se recalcula', () => {
  const R = Object.fromEntries(papel.problemas.map(p => [p.id, p.respuesta]));
  const raicesReales = c => raices(c).filter(z => Math.abs(z.im) < 1e-7).map(z => z.re).sort((a, b) => a - b);
  // p1: x³ − 4x² + 2x + 5 = 0: x₁² + x₂² + x₃² = 16 − 4 = 12.
  assert.ok(Math.abs(raices([1, -4, 2, 5]).reduce((s, z) => s + cmul(z, z).re, 0) - 12) < 1e-7); assert.match(R.p1, /^12\b/);
  // p2: 2x³ + mx² + 22x + n = 0 con raíces 1 y 3: la tercera es 2 (el polinomio es 2(x − 1)(x − 2)(x − 3)).
  { const c = [2, -12, 22, -12]; assert.deepEqual(enteros(c), [1, 2, 3]); assert.equal(c[2], 22); assert.match(R.p2, /^2\b/); }
  // p3: aristas x, x + 2, x + 4 con volumen 192: x = 4, arista mayor 8.
  { const xs = enteros([1, 6, 8, -192]); assert.deepEqual(xs.filter(x => x > 0), [4]); assert.match(R.p3, /^8 cm/); }
  // p4: lámina 20 × 14, x entero, V = 288: x = 4 → cartón 280 − 64 = 216.
  { const xs = []; for (let x = 1; 2 * x < 14; x++) if (x * (20 - 2 * x) * (14 - 2 * x) === 288) xs.push(x); assert.deepEqual(xs, [4]); assert.equal(12 * 6 + 2 * 4 * 12 + 2 * 4 * 6, 216); assert.match(R.p4, /^216 cm²/); }
  // p5: p² + 144/p² = 25 → p = 3 o 4: diferencia 1 sol.
  { const ps = []; for (let p = 1; p < 50; p++) if (p ** 4 + 144 === 25 * p * p) ps.push(p); assert.deepEqual(ps, [3, 4]); assert.match(R.p5, /^1 sol/); }
  // p6: x⁴ + 10x² + 9 = 0: módulos 1, 1, 3, 3 → 8.
  assert.ok(Math.abs(raices([1, 0, 10, 0, 9]).reduce((s, z) => s + cabs(z), 0) - 8) < 1e-7); assert.match(R.p6, /^8\b/);
  // p7: P(x) = x³ − 7x² + kx − 4 con P(1) = 0 → k = 10; P(x) = −4 da {0; 2; 5}.
  { const k = -(1 - 7 - 4); assert.equal(k, 10); const xs = []; for (let x = -50; x <= 50; x++) if (evalR([1, -7, k, -4], x) === -4) xs.push(x); assert.deepEqual(xs, [0, 2, 5]); assert.match(R.p7, /\{0; 2; 5\}/); }
  // p8: x⁴ − 2x³ − 12x² + 40x + m con raíz triple entera: (x − 2)³(x + 4), m = −32.
  { const c = [1, -2, -12, 40, -32]; assert.equal(evalR(c, 2), 0); assert.equal(evalR(c, -4), 0); assert.equal(4 * 8 - 6 * 4 - 24 * 2 + 40, 0); assert.match(R.p8, /−32/); }
  // p9: x³ + mx² + nx − 30 = 0 con raíz 1 + 2i: (x² − 2x + 5)(x − 6) → raíz real 6.
  { const zs = raicesReales([1, -8, 17, -30]); assert.equal(zs.length, 1); assert.ok(Math.abs(zs[0] - 6) < 1e-7); assert.ok(cabs(horner([1, -8, 17, -30], C(1, 2))) < 1e-9); assert.match(R.p9, /^6\b/); }
  // p10: 2x³ − 5x² − 4x + 3 = (x + 1)(x − 3)(2x − 1): raíz no entera 1/2.
  { assert.equal(evalR([2, -5, -4, 3], -1), 0); assert.equal(evalR([2, -5, -4, 3], 3), 0); assert.equal(evalR([2, -5, -4, 3], 0.5), 0); assert.match(R.p10, /^1\/2/); }
});
