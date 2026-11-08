// Pruebas del generador de sucesiones, divisores y numerales: casos.json (verificados aparte, a
// ciegas), un recálculo independiente en cada uno de 600 problemas y el papel.json.
// El recálculo va por otro camino que el generador: arma las sucesiones término a término, cuenta
// los comunes con conjuntos, suma con bucles, enumera los divisores uno por uno, prueba primos por
// división, lee los numerales con parseInt en su base y escribe los cubos en base b con toString.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');
const P = x => require('../../nucleo/predicciones.js').formatear(x);

const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const reducida = (n, d) => { const g = gcd(n, d); return `${n / g}/${d / g}`; };
const primo = x => { if (x < 2) return false; for (let d = 2; d * d <= x; d++) if (x % d === 0) return false; return true; };

// ---- recálculos por tipo ----
function intercalada({ sub, a1, r1, b1, r2, q, k }) {
  const seq = []; let x = a1, y = b1;
  while (seq.length < k) { seq.push(x); x += r1; seq.push(y); y = sub === 'pa-pa' ? y + r2 : y * q; }
  return seq[k - 1];
}
function paPg({ S, sumandos: [al, be, ga] }) {
  // (m − d + al)(m + d + ga) = (m + be)² → d² + (ga − al)d + (m + be)² − (m + al)(m + ga) = 0
  const m = S / 3, B = ga - al, C = (m + be) ** 2 - (m + al) * (m + ga);
  const disc = B * B - 4 * C, rz = Math.sqrt(disc);
  const raices = [(-B + rz) / 2, (-B - rz) / 2].filter(d => Number.isInteger(d) && d > 0 && m - d >= 1);
  assert.equal(new Set(raices).size, 1, `pa-pg: raíces ${raices}`);
  return m + raices[0];
}
function fracciones({ a, r, b, s, k }) {
  let n = a, d = b; for (let i = 1; i < k; i++) { n += r; d += s; }
  return 'frac:' + reducida(n, d);
}
function comunes({ a1, r1, LA, b1, r2, LB }) {
  const A = new Set(); for (let x = a1; x <= LA; x += r1) A.add(x);
  let c = 0; for (let y = b1; y <= LB; y += r2) if (A.has(y)) c++;
  return c;
}
function sumatoria(d) {
  let S = 0;
  if (d.sub === 'cuadratica') for (let k = 1; k <= d.n; k++) S += d.p * k * k + d.q * k + d.c;
  else if (d.sub === 'producto') for (let k = 1; k <= d.n; k++) S += k * (k + d.p);
  else for (let k = d.m; k <= d.n; k++) S += k ** 3;
  return S;
}
function grupos({ grupos: gs, varones, mujeres }) {
  const T = gs.reduce((a, b) => a + b, 0);
  const sirven = gs.filter(g => { for (let t = 0; (varones + mujeres) * t <= T - g; t++) if ((varones + mujeres) * t === T - g) return true; return false; });
  assert.equal(sirven.length, 1, `grupos: sirven ${sirven}`);
  return sirven[0];
}
const BASES = { 6: 6, 10: 10, 12: 12, 15: 15, 18: 18, 20: 20, 45: 45, 50: 50, 75: 75 };
function divisoresDe(N) {
  // factoriza por división y arma todos los divisores multiplicando
  const fs = []; let x = N;
  for (let p = 2; p * p <= x; p++) { let e = 0; while (x % p === 0) { x /= p; e++; } if (e) fs.push([p, e]); }
  if (x > 1) fs.push([x, 1]);
  let ds = [1];
  for (const [p, e] of fs) { const nuevos = []; for (const d of ds) { let pot = 1; for (let i = 0; i <= e; i++) { nuevos.push(d * pot); pot *= p; } } ds = nuevos; }
  return ds;
}
function contar(N, q, m) {
  const ds = divisoresDe(N);
  const cuadrado = d => { const r = Math.round(Math.sqrt(d)); return r * r === d; };
  if (q === 'total') return ds.length;
  if (q === 'mult') return ds.filter(d => d % m === 0).length;
  if (q === 'impares') return ds.filter(d => d % 2 === 1).length;
  if (q === 'cuadrados') return ds.filter(cuadrado).length;
  if (q === 'propios') return ds.filter(d => d !== N).length;
  return ds.filter(d => d > 1 && !primo(d)).length;
}
function valorN(d) {
  const N = d.forma === 'directa' ? 2 ** d.ex[0] * 3 ** d.ex[1] * 5 ** d.ex[2] : BASES[d.b1] ** d.p * BASES[d.b2] ** d.q;
  assert.ok(Number.isSafeInteger(N));
  return N;
}
function divisores(d) {
  const N = valorN(d);
  if (d.sub === 'cuenta') return contar(N, d.pide, d.m);
  return d.afirmaciones.filter(([q, dice]) => contar(N, q, d.m) === dice).length;
}
function primosPa({ m, r, L }) {
  const sols = [];
  for (let x = 2; x + (m - 1) * r < L; x++) { let ok = true; for (let i = 0; i < m; i++) if (!primo(x + i * r)) ok = false; if (ok) sols.push(x + (m - 1) * r); }
  assert.equal(sols.length, 1, `primos-pa: ${sols}`);
  return sols[0];
}
function cifras(d) {
  if (d.sub === 'fraccion') {
    let mejor = -1;
    for (let a = 1; a <= 9; a++) for (let b = 1; b <= 9; b++) if (Number(`${a}${a}`) * d.F[1] === Number(`${b}${b}${b}`) * d.F[0]) mejor = Math.max(mejor, Number(`${a}${b}`));
    return mejor;
  }
  let c = 0;
  for (let a = 1; a <= 9; a++) for (let b = 1; b <= 9; b++) if (Number(`${a}${b}`) + Number(`${b}${a}`) === d.N) c++;
  return c;
}
function grifos({ numerales }) {
  const ok = [];
  for (let a = 0; a <= 9; a++) for (let n = 0; n <= 9; n++) {
    const val = s => (s === 'a' ? a : s === 'n' ? n : s);
    const bien = numerales.every(({ cifras: c, base }) => { const B = val(base); return B >= 2 && val(c[0]) !== 0 && c.every(s => val(s) < B); });
    if (bien) ok.push(numerales.map(({ cifras: c, base }) => parseInt(c.map(val).join(''), val(base))));
  }
  assert.equal(ok.length, 1, 'grifos: las cifras no quedan únicas');
  const [x, y, z] = ok[0];
  return 'h:' + reducida(x * y * z, y * z + x * z - x * y);
}
function cubos({ sub, b, k }) {
  const R = [];
  for (let r = 1; r ** 3 < b ** (k + 1); r++) if ((r ** 3).toString(b).length === k) R.push(r);
  return sub === 'cuenta' ? R.length : R.reduce((s, r) => s + r, 0);
}
const RECALC = { intercalada, 'pa-pg': paPg, fracciones, comunes, sumatoria, grupos, divisores, 'primos-pa': primosPa, cifras, grifos, cubos };
const recalcular = p => RECALC[p._datos.tipo](p._datos);
const igual = (a, b) => (typeof b === 'string' ? a === b : Math.abs(a - b) < 1e-9);
probarGenerador(gen, { semillas: 600, recalcular, igual });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(igual(c.esperado.respuesta, p.respuesta.valor), `da ${p.respuesta.valor}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

const textos = p => {
  const seg = l => l.map(x => (typeof x === 'string' ? x : x.t)).join('');
  return [seg(p.enunciado), seg(p.pregunta), ...p.solucion.map(seg), ...p.alternativas.map(a => a.texto + ' ' + (a.error ? a.error.explicacion : ''))];
};

test('salen todos los tipos y subtipos', () => {
  const vistos = new Set();
  for (let s = 0; s < 600; s++) { const d = gen.generar(s)._datos; vistos.add(d.tipo + (d.sub ? '/' + d.sub : '')); }
  assert.deepEqual([...vistos].sort(), ['comunes', 'cifras/fraccion', 'cifras/suma-invertida', 'cubos/cuenta', 'cubos/suma', 'divisores/afirmaciones', 'divisores/cuenta',
    'fracciones', 'grifos', 'grupos', 'intercalada/pa-pa', 'intercalada/pa-pg', 'pa-pg', 'primos-pa', 'sumatoria/cuadratica', 'sumatoria/cubos', 'sumatoria/producto'].sort());
});

test('alternativas con la misma forma y ningún distractor da la correcta', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    const forma = d.tipo === 'fracciones' ? /^\d+(\/\d+)?$/ : d.tipo === 'grifos' ? /^\d+(\/\d+)? h$/ : /^\d{1,3}( \d{3})*$/;
    for (const a of p.alternativas) assert.match(a.texto, forma, `semilla ${s}: «${a.texto}»`);
    for (const a of p.alternativas.filter(x => !x.correcta)) {
      assert.ok(!igual(a.valor, p.respuesta.valor), `semilla ${s}: el error ${a.error.id} da la correcta`);
      // el distractor tampoco cumple el problema por otro camino
      if (typeof a.valor === 'number') assert.notEqual(a.valor, recalcular(p), `semilla ${s}`);
    }
  }
});

test('colores: cada segmento usa una variable definida, con un color de la app', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    for (const [k, x] of Object.entries(p.variables)) assert.ok(['o', 'i', 'd', 'h'].includes(x.color) && x.nombre, `semilla ${s}: ${k}`);
    const colores = Object.values(p.variables).map(x => x.color);
    assert.equal(new Set(colores).size, colores.length, `semilla ${s}: dos variables con el mismo color`);
    for (const campo of ['enunciado', 'pregunta']) for (const x of p[campo]) if (typeof x !== 'string') assert.ok(p.variables[x.v], `semilla ${s}: falta ${x.v}`);
    for (const paso of p.solucion) for (const x of paso) if (typeof x !== 'string') assert.ok(p.variables[x.v], `semilla ${s}: falta ${x.v}`);
  }
});

test('textos limpios: sin undefined, NaN, null ni dobles signos', () => {
  for (let s = 0; s < 600; s++) for (const t of textos(gen.generar(s))) assert.ok(!/undefined|NaN|null|−−|\+ −|- |-\d|\[object/.test(t), `semilla ${s}: «${t}»`);
});

test('los datos son creíbles', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.tipo === 'grupos') assert.ok(d.grupos.every(g => g >= 12 && g <= 45));
    if (d.tipo === 'grifos') {
      const h = p.respuesta.valor.split(':')[1].split('/').map(Number);
      assert.ok(h[1] === 1 && h[0] <= 60, `semilla ${s}: ${p.respuesta.valor}`);
    }
    if (d.tipo === 'primos-pa') assert.ok(d.L <= 180);
    if (d.tipo === 'sumatoria' || d.tipo === 'intercalada') assert.ok(p.respuesta.valor < 2e5, `semilla ${s}: ${p.respuesta.valor}`);
    if (d.tipo === 'divisores') assert.ok(valorN(d) < 2 ** 53);
    if (d.tipo === 'comunes') assert.ok(p.respuesta.valor >= 4 && p.respuesta.valor <= 40);
  }
});

test('papel.json: 8 a 10 problemas bien formados', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 8 && papel.problemas.length <= 10);
  for (const pr of papel.problemas) {
    assert.ok(pr.id && pr.enunciado && pr.respuesta && Array.isArray(pr.pasos) && pr.pasos.length >= 2, pr.id);
    assert.ok(['básico', 'intermedio', 'avanzado'].includes(pr.nivel), pr.id);
  }
});

test('papel.json: cada respuesta se recalcula', () => {
  const R = Object.fromEntries(papel.problemas.map(p => [p.id, p.respuesta]));
  const tiene = (id, ...xs) => { for (const x of xs) assert.ok(R[id].includes(x), `${id}: la respuesta no dice ${x}`); };
  tiene('p1', String(intercalada({ sub: 'pa-pg', a1: 4, r1: 5, b1: 3, q: 2, k: 20 })), String(intercalada({ sub: 'pa-pg', a1: 4, r1: 5, b1: 3, q: 2, k: 31 })));
  tiene('p2', fracciones({ a: 2, r: 3, b: 4, s: 3, k: 25 }).slice(5));
  tiene('p3', String(paPg({ S: 30, sumandos: [1, 2, 9] })));
  tiene('p4', String(comunes({ a1: 5, r1: 6, LA: 599, b1: 1, r2: 8, LB: 497 })));
  tiene('p5', P(sumatoria({ sub: 'cuadratica', p: 2, q: -3, c: 1, n: 20 })));
  tiene('p6', String(divisores({ forma: 'potencias', b1: 12, p: 2, b2: 15, q: 3, sub: 'afirmaciones', m: 6,
    afirmaciones: [['total', 120], ['mult', 80], ['impares', 23], ['cuadrados', 12]] })));
  tiene('p7', String(primosPa({ m: 5, r: 12, L: 60 })));
  tiene('p8', String(cifras({ sub: 'fraccion', F: [11, 37] })));
  tiene('p9', grifos({ numerales: [{ cifras: [4, 0], base: 'a' }, { cifras: ['a', 0], base: 'n' }, { cifras: ['n', 6], base: 7 }] }).slice(2).replace('/1', ''));
  tiene('p10', String(cubos({ sub: 'cuenta', b: 7, k: 4 })), String(cubos({ sub: 'suma', b: 7, k: 4 })));
});
