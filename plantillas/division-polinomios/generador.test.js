// Pruebas del generador «division-polinomios»: casos.json (verificados aparte, a ciegas), un recálculo
// independiente en cada uno de 600 problemas y pruebas de propiedades y de papel.json.
// El recálculo NO usa las fórmulas del generador: hace la división larga de verdad (en una o dos
// variables), busca por fuerza bruta los parámetros que cumplen el enunciado y factoriza probando raíces.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// ---------- Herramientas independientes ----------
const evalP = (c, x) => { let s = 0; for (const a of c) s = s * x + a; return s; };
function mul(a, b) { const r = Array(a.length + b.length - 1).fill(0); a.forEach((x, i) => b.forEach((y, j) => { r[i + j] += x * y; })); return r; }
// División larga entre un divisor mónico (coeficientes enteros): { q, r } con r de grado menor.
function dividir(D, d) {
  assert.equal(d[0], 1, 'divisor mónico');
  const r = D.slice(), g = d.length - 1, q = [];
  for (let i = 0; i + g < r.length; i++) {
    const c = r[i]; q.push(c);
    for (let j = 0; j <= g; j++) r[i + j] -= c * d[j];
  }
  const resto = r.slice(r.length - g);
  return { q: q.length ? q : [0], r: resto };
}
// División en dos variables: dividendo y divisor como mapas 'i,j' → coeficiente (xⁱyʲ); divisor xʳ + τyˢ.
function dividir2(dividendo, r, tau, s) {
  const R = new Map(dividendo), Q = [];
  for (;;) {
    let mejor = null;
    for (const [k, c] of R) { if (!c) continue; const [i, j] = k.split(',').map(Number); if (i >= r && (!mejor || i > mejor[0])) mejor = [i, j, c]; }
    if (!mejor) break;
    const [i, j, c] = mejor; Q.push({ c, a: i - r, b: j });
    const quitar = (ii, jj, cc) => R.set(`${ii},${jj}`, (R.get(`${ii},${jj}`) || 0) - cc);
    quitar(i, j, c); quitar(i - r, j + s, c * tau);
  }
  for (const c of R.values()) assert.equal(c, 0, 'el cociente notable debe ser exacto');
  return Q; // en orden de grado de x decreciente
}
const SIG = { mm: [-1, -1], pp: [1, 1], mp: [-1, 1] };
const cn = (forma, r, s, N) => dividir2(new Map([[`${r * N},0`, 1], [`0,${s * N}`, SIG[forma][0]]]), r, SIG[forma][1], s);
// Raíces enteras con su multiplicidad, dividiendo mientras se pueda.
function factorizar(c) {
  const m = new Map(); let p = c.slice();
  for (let x = -12; x <= 12; x++) while (p.length > 1 && evalP(p, x) === 0) { p = dividir(p, [1, -x]).q; m.set(x, (m.get(x) || 0) + 1); }
  assert.equal(p.length, 1, 'se factoriza del todo con raíces enteras');
  return m;
}
const deRaices = rs => rs.reduce((p, r) => mul(p, [1, -r]), [1]);
const mcdMcm = (A, B) => {
  const fa = factorizar(A), fb = factorizar(B), raices = new Set([...fa.keys(), ...fb.keys()]);
  const mcd = [], mcm = [];
  for (const x of raices) {
    const a = fa.get(x) || 0, b = fb.get(x) || 0;
    for (let i = 0; i < Math.min(a, b); i++) mcd.push(x);
    for (let i = 0; i < Math.max(a, b); i++) mcm.push(x);
  }
  return { mcd: deRaices(mcd), mcm: deRaices(mcm) };
};
const texto = segs => segs.map(x => (typeof x === 'string' ? x : x.t)).join('');

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'cociente') {
    if (d.sub === 'exponentes') {
      // Se prueban todos los números de términos hasta encontrar el que tiene a xᴬyᴮ.
      const N = [];
      for (let k = 2; k <= 60; k++) if (cn('mm', d.r, d.s, k).some(t => t.a === d.A && t.b === d.B)) N.push(k);
      assert.equal(N.length, 1);
      return (d.r + d.s) * N[0];
    }
    if (d.sub === 'central' || d.sub === 'fila') {
      const Q = cn('mm', d.r, d.s, d.N);
      assert.equal(Q.length % 2, 1);
      const medio = (Q.length - 1) / 2;
      return d.sub === 'fila' ? medio : Q[medio].a + Q[medio].b;
    }
    if (d.sub === 'termino') { const t = cn(d.forma, d.r, d.s, d.N)[d.k - 1]; return `mono:${t.c}:${t.a}:${t.b}`; }
    // coeficiente: división larga en una variable de xᴺ ± aᴺ entre x ± a.
    const D = Array(d.N + 1).fill(0); D[0] = 1; D[d.N] = SIG[d.forma][0] * d.a ** d.N;
    const { q, r } = dividir(D, [1, SIG[d.forma][1] * d.a]);
    assert.deepEqual(r, [0]);
    return q[d.k - 1];
  }
  if (d.tipo === 'resto2') {
    const div = deRaices([d.r1, d.r2]);
    if (d.sub === 'explicito') { const { r } = dividir(d.P, div); return `pol:${r[0]},${r[1]}`; }
    // Lagrange: R(x) = R1(x − r2)/(r1 − r2) + R2(x − r1)/(r2 − r1). Se comprueba con un P concreto.
    const p = (d.R1 - d.R2) / (d.r1 - d.r2), q = (d.R2 * d.r1 - d.R1 * d.r2) / (d.r1 - d.r2);
    const P = mul(div, [1, 3, -7]); P[P.length - 2] += p; P[P.length - 1] += q;
    assert.equal(evalP(P, d.r1), d.R1); assert.equal(evalP(P, d.r2), d.R2);
    const { r } = dividir(P, div);
    return `pol:${r[0]},${r[1]}`;
  }
  if (d.tipo === 'identidad') {
    const { q, r } = dividir(d.D, d.d);
    assert.deepEqual(r, d.R.length === 2 ? d.R : r);
    return d.sub === 'independiente' ? q[q.length - 1] : q.reduce((x, y) => x + y, 0);
  }
  if (d.tipo === 'parametros') {
    const sol = [];
    if (d.sub === 'exacta') {
      const div = deRaices([d.r1, d.r2]);
      for (let a = -60; a <= 60; a++) for (let b = -60; b <= 60; b++) {
        const { r } = dividir([1, a, b, d.c], div);
        if (r.every(x => x === 0)) sol.push(a + b);
      }
    } else {
      for (let pp = -40; pp <= 40; pp++) for (let qq = -80; qq <= 80; qq++) {
        const Pp = [1, pp, qq], { q, r } = dividir(Pp, [1, -d.a]);
        if (r[0] !== d.r) continue;
        const Qk = q.slice(); Qk[Qk.length - 1] += d.k;
        if (dividir(Pp, Qk).r.every(x => x === 0)) sol.push(qq);
      }
    }
    assert.equal(sol.length, 1, `solución única (${sol})`);
    return sol[0];
  }
  if (d.tipo === 'caja') {
    const V = (A, B) => mul([1, 0], mul([-2, A], [-2, B])); // x(A − 2x)(B − 2x)
    const lin = [1, -d.k];
    const restoEntre = c => { const m = c.slice(); const k = d.k; let s = 0; for (const x of m) s = s * k + x; return s; };
    if (d.sub === 'resto') {
      // División larga por x − k (divisor mónico) con el polinomio desarrollado.
      const c = V(d.a, d.b), { r } = dividir(c, lin);
      assert.equal(r[0], restoEntre(c));
      return r[0];
    }
    const L = [];
    for (let l = 1; l <= 300; l++) if (dividir(V(d.a, l), lin).r[0] === d.R && l > 2 * d.k) L.push(l);
    assert.equal(L.length, 1);
    return L[0];
  }
  // mcdmcm
  if (d.sub === 'mcd-valor') return evalP(mcdMcm(d.A, d.B).mcd, d.x);
  if (d.sub === 'mcm-dado') {
    const ts = [];
    for (let t = -20; t <= 20; t++) if (evalP(mul(d.D, [1, -t]), 0) === d.cB) ts.push(t);
    assert.equal(ts.length, 1);
    const B = mul(d.D, [1, -ts[0]]), { mcd, mcm } = mcdMcm(d.A, B);
    assert.deepEqual(mcd, d.D, 'el MCD dado es el MCD');
    return evalP(mcm, d.x);
  }
  const arma = e => deRaices(d.raices.flatMap((r, i) => Array(e[i]).fill(r)));
  const { mcd, mcm } = mcdMcm(arma(d.eA), arma(d.eB));
  return (d.pide === 'mcd' ? mcd : mcm).length - 1;
}
probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => a === b });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    const correcta = p.alternativas.find(a => a.correcta);
    if (typeof c.esperado.respuesta === 'number') assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
    else assert.equal(p.respuesta.texto, c.esperado.respuesta);
    assert.equal(correcta.texto, c.esperado.exacta);
  });
}

test('casos.json: entre 12 y 30 casos, con todos los tipos y subtipos, entrada-1 y salida-1', () => {
  assert.ok(casos.casos.length >= 12 && casos.casos.length <= 30);
  const subs = new Set(casos.casos.map(c => `${c.entrada.tipo}/${c.entrada.sub}`));
  assert.equal(subs.size, 16);
  assert.ok(casos.casos.some(c => c.semilla === 'entrada-1') && casos.casos.some(c => c.semilla === 'salida-1'));
});

test('salen todos los tipos y subtipos', () => {
  const vistos = new Set();
  for (let s = 0; s < 600; s++) { const d = gen.generar(s)._datos; vistos.add(`${d.tipo}/${d.sub}`); }
  assert.equal(vistos.size, 16, [...vistos].join(' '));
});

test('alternativas con la misma forma, ningún distractor da la correcta y textos limpios', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos, alt = p.alternativas;
    const correcta = alt.find(a => a.correcta);
    const textual = typeof p.respuesta.valor === 'string';
    for (const a of alt) {
      if (textual) {
        assert.equal(typeof a.valor, 'string');
        const forma = x => x.split(':')[0];
        assert.equal(forma(a.valor), forma(correcta.valor), `semilla ${s}: formas distintas`);
        if (d.tipo === 'cociente') assert.match(a.texto, /^−?[xy⁰¹²³⁴⁵⁶⁷⁸⁹]+$/, `semilla ${s}: ${a.texto}`);
        else assert.match(a.texto, /^−?([\d ]+|[\d ]*x( [+−] [\d ]+)?)$/, `semilla ${s}: ${a.texto}`);
      } else {
        assert.ok(Number.isInteger(a.valor), `semilla ${s}: ${a.valor} no es entero`);
        assert.equal(a.texto.replace(/^−?[\d ]+/, ''), correcta.texto.replace(/^−?[\d ]+/, ''), `semilla ${s}: unidades distintas`);
      }
      if (!a.correcta) assert.notEqual(a.valor, correcta.valor);
    }
    const todo = [p.enunciado, p.pregunta, ...p.solucion].map(texto).join(' ') + alt.map(a => a.texto + (a.error ? a.error.explicacion : '')).join(' ');
    assert.ok(!/undefined|NaN|−−|\+ −|− −|\[object/.test(todo), `semilla ${s}: ${todo.match(/.{0,30}(undefined|NaN|−−|\+ −|− −|\[object).{0,30}/)}`);
    for (const seg of [...p.enunciado, ...p.pregunta, ...p.solucion.flat()]) if (typeof seg !== 'string') assert.ok(p.variables[seg.v], `semilla ${s}: variable ${seg.v} sin declarar`);
    for (const [, x] of Object.entries(p.variables)) assert.ok(['o', 'i', 'd', 'h'].includes(x.color));
    assert.equal(new Set(Object.values(p.variables).map(x => x.color)).size, Object.keys(p.variables).length, `semilla ${s}: dos variables con el mismo color`);
  }
});

test('los datos son creíbles', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    if (typeof p.respuesta.valor === 'number') assert.ok(Math.abs(p.respuesta.valor) <= 5000, `semilla ${s}: ${p.respuesta.valor}`);
    if (d.tipo === 'cociente' && d.N) assert.ok(d.N <= 25, `semilla ${s}: ${d.N} términos`);
    if (d.tipo === 'caja' && d.sub === 'lado') assert.ok(p.respuesta.valor <= 60 && p.respuesta.valor > d.a, `semilla ${s}: largo ${p.respuesta.valor}`);
    if (d.tipo === 'caja' && d.sub === 'resto') assert.ok(2 * d.k < d.b, `semilla ${s}`);
  }
});

// ---------- papel.json: cada respuesta se recalcula aquí ----------
test('papel.json: de 8 a 10 problemas bien formados', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 8 && papel.problemas.length <= 10);
  assert.equal(new Set(papel.problemas.map(q => q.id)).size, papel.problemas.length);
  for (const q of papel.problemas) {
    assert.ok(q.id && q.enunciado && q.respuesta && Array.isArray(q.pasos) && q.pasos.length >= 2, q.id);
    assert.ok(['básico', 'intermedio', 'avanzado'].includes(q.nivel), q.id);
  }
});

test('papel.json: respuestas recalculadas', () => {
  const R = Object.fromEntries(papel.problemas.map(q => [q.id, q.respuesta]));
  const tiene = (id, t) => assert.ok(R[id].includes(t), `${id}: se esperaba «${t}» en «${R[id]}»`);
  // p1: término de lugar 4 de (x²⁰ + y¹⁵)/(x⁴ + y³): 5 términos, signo −.
  { const t = cn('pp', 4, 3, 5)[3]; assert.deepEqual([t.c, t.a, t.b], [-1, 4, 9]); tiene('p1', '−x⁴y⁹'); }
  // p2: (x³⁶ − y⁴⁵)/(x⁴ − y⁵): 9 términos; central de lugar 5, grado 16 + 20.
  { const Q = cn('mm', 4, 5, 9); assert.equal(Q.length, 9); assert.equal(Q[4].a + Q[4].b, 36); tiene('p2', '9 términos'); tiene('p2', '36'); }
  // p3: coeficiente del lugar 5 de (x⁸ − 3⁸)/(x + 3).
  { const D = [1, 0, 0, 0, 0, 0, 0, 0, -(3 ** 8)]; const { q, r } = dividir(D, [1, 3]); assert.deepEqual(r, [0]); assert.equal(q[4], 81); tiene('p3', '81'); }
  // p4: restos 5 entre x − 1 y −7 entre x + 2: resto 4x + 1.
  { const P = mul(deRaices([1, -2]), [1, 0, 2]); P[P.length - 2] += 4; P[P.length - 1] += 1;
    assert.equal(evalP(P, 1), 5); assert.equal(evalP(P, -2), -7); assert.deepEqual(dividir(P, deRaices([1, -2])).r, [4, 1]); tiene('p4', '4x + 1'); }
  // p5: x⁵ + 2x² − 3 entre x² − x − 2.
  { const { r } = dividir([1, 0, 0, 2, 0, -3], [1, -1, -2]); assert.deepEqual(r, [13, 11]); tiene('p5', '13x + 11'); }
  // p6: término independiente del cociente de 2x⁴ − x³ + 5x² + 3x − 1 entre x² + x − 3, sabiendo el resto.
  { const { q, r } = dividir([2, -1, 5, 3, -1], [1, 1, -3]); assert.deepEqual(r, [-20, 41]); assert.equal(q[q.length - 1], 14); tiene('p6', '14'); }
  // p7: x³ + ax² + bx + 18 divisible entre x² − x − 6.
  { const sol = []; for (let a = -40; a <= 40; a++) for (let b = -40; b <= 40; b++) if (dividir([1, a, b, 18], [1, -1, -6]).r.every(x => x === 0)) sol.push([a, b]);
    assert.deepEqual(sol, [[-4, -3]]); tiene('p7', 'a = −4'); tiene('p7', 'b = −3'); }
  // p8: caja de 20 cm de ancho, resto 1 200 entre x − 5: largo.
  { const L = []; for (let l = 11; l <= 200; l++) if (dividir(mul([1, 0], mul([-2, 20], [-2, l])), [1, -5]).r[0] === 1200) L.push(l); assert.deepEqual(L, [34]); tiene('p8', '34 cm'); }
  // p9: MCD y MCM de x³ − 3x² + 4 y x³ − 4x² + 4x.
  { const { mcd, mcm } = mcdMcm([1, -3, 0, 4], [1, -4, 4, 0]); assert.deepEqual(mcd, [1, -4, 4]); assert.equal(mcm.length - 1, 4); assert.equal(evalP(mcm, 1), 2);
    tiene('p9', '(x − 2)²'); tiene('p9', 'grado 4'); tiene('p9', 'MCM(1) = 2'); }
  // p10: fila con tantas personas como términos de (x⁶⁰ − y⁹⁰)/(x⁴ − y⁶): 15 términos, delante del central: 7.
  { const Q = cn('mm', 4, 6, 15); assert.equal(Q.length, 15); tiene('p10', '7 personas'); }
});
