// Pruebas de «La balanza de dimensiones»: casos.json (calculados aparte), un recálculo independiente
// en cada uno de 600 problemas, todos los tipos, textos y el papel.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const P = require('../../nucleo/predicciones.js');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// ---- Camino independiente ----
// Las magnitudes se escriben aquí en unidades del SI (kg, m, s, K), sin la tabla del generador. Una
// ecuación es homogénea si sigue siendo cierta al cambiar de unidades: se cambian kg, m, s y K por
// factores al azar y se mira cómo escala cada término (en logaritmos). Los exponentes y las
// dimensiones se buscan por fuerza bruta entre todos los candidatos, sin despejar.
const SI = { // [kg, m, s, K]
  m: [1, 0, 0, 0], M: [1, 0, 0, 0], h: [0, 1, 0, 0], x: [0, 1, 0, 0], R: [0, 1, 0, 0], lam: [0, 1, 0, 0], L: [0, 1, 0, 0], d: [0, 1, 0, 0],
  S: [0, 2, 0, 0], A: [0, 2, 0, 0], V: [0, 3, 0, 0], t: [0, 0, 1, 0], Per: [0, 0, 1, 0], v: [0, 1, -1, 0], a: [0, 1, -2, 0], g: [0, 1, -2, 0],
  F: [1, 1, -2, 0], Ft: [1, 1, -2, 0], E: [1, 2, -2, 0], W: [1, 2, -2, 0], Pot: [1, 2, -3, 0], p: [1, -1, -2, 0], rho: [1, -3, 0, 0],
  f: [0, 0, -1, 0], w: [0, 0, -1, 0], Q: [0, 3, -1, 0], q: [1, 1, -1, 0], sig: [1, 0, -2, 0], K: [1, 0, -2, 0], mu: [1, -1, 0, 0],
  G: [-1, 3, -2, 0], Te: [0, 0, 0, 1], c: [0, 2, -2, -1],
};
const ESCALAS = [[1.7, 2.3, 0.6, 1.9], [0.45, 3.1, 1.35, 0.7], [2.9, 0.8, 2.2, 1.15]].map(e => e.map(Math.log));
// log del factor con que cambia una magnitud de dimensión u al cambiar las unidades
const escala = (u, s) => u.reduce((acc, e, i) => acc + e * s[i], 0);
const combinar = pares => pares.reduce((acc, [k, e]) => acc.map((x, i) => x + e * SI[k][i]), [0, 0, 0, 0]);
const iguales = (u, w) => ESCALAS.every(s => Math.abs(escala(u, s) - escala(w, s)) < 1e-9);
const MEDIOS = []; for (let k = -6; k <= 6; k++) MEDIOS.push(k / 2);
// Exponentes por fuerza bruta (múltiplos de 1/2 entre −3 y 3).
function exponentesBruta(q, fs) {
  const sol = [];
  (function rec(i, ex) {
    if (i === fs.length) { if (iguales(SI[q], combinar(fs.map((k, j) => [k, ex[j]])))) sol.push(ex.slice()); return; }
    for (const e of MEDIOS) { ex[i] = e; rec(i + 1, ex); }
  })(0, []);
  assert.equal(sol.length, 1, `${q}: ${sol.length} soluciones`);
  return sol[0];
}
// Dimensión por fuerza bruta: el único [kg, m, s, K] que hace iguales(objetivo, X + resto).
function dimensionBruta(cumple) {
  const sol = [];
  for (let a = -8; a <= 8; a++) for (let b = -8; b <= 8; b++) for (let c = -8; c <= 8; c++) for (let d = -2; d <= 2; d++)
    if (cumple([a, b, c, d])) sol.push([a, b, c, d]);
  assert.equal(sol.length, 1, `${sol.length} soluciones`);
  return sol[0];
}
const suma = (u, w, k = 1) => u.map((x, i) => x + k * w[i]);
const claveDe = u => 'dim:' + u.map(x => P.textoFraccion(P.frac(x))).join(',');
const VERDAD = { H1: true, H2: false, H3: true, S1: false, S2: true, S3: true, N1: false, N2: true, N3: false, F1: true, F2: false, F3: false, F4: true,
  A1: false, A2: false, A3: true, U1: false, U2: true,
  H4: true, H5: false, S4: false, N4: true, F5: true, F6: false, A4: false, U3: false, U4: true };

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'exponentes') {
    const e = exponentesBruta(d.q, d.fs);
    return d.sub === 'suma' ? e.reduce((s, x) => s + x, 0) : e[d.j];
  }
  if (d.tipo === 'proposiciones') return 'vf:' + d.props.map(id => (VERDAD[id] ? 'V' : 'F')).join('');
  const M = SI[d.miembro];
  const term = t => combinar(t.fs.map((k, i) => [k, t.ex[i]]));
  if (d.sub === 'suma') return claveDe(dimensionBruta(X => iguales(M, suma(X, term(d.t1)))));
  if (d.sub === 'combinada') {
    const A = dimensionBruta(X => iguales(M, suma(X, term(d.t1)))), B = dimensionBruta(X => iguales(M, suma(X, term(d.t2))));
    return claveDe(suma(A, B, -1));
  }
  // argumento: B·x^a no cambia al cambiar de unidades; A pesa lo mismo que el miembro
  const B = dimensionBruta(X => iguales([0, 0, 0, 0], suma(X, SI[d.x], d.a)));
  return claveDe(d.pide === 'B' ? B : suma(B, M));
}
probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => (typeof b === 'string' ? a === b : Math.abs(a - b) < 1e-9) });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    if (typeof c.esperado.respuesta === 'number') assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
    else assert.equal(p.respuesta.valor, c.esperado.respuesta);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

test('salen todos los tipos y subtipos, y la trampa del lote', () => {
  const vistos = new Set(), ids = new Set();
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    vistos.add(d.tipo + '/' + d.sub + (d.pide ? '/' + d.pide : ''));
    for (const a of p.alternativas) if (a.error) ids.add(a.error.id);
  }
  assert.deepEqual([...vistos].sort(), ['constante/argumento/AB', 'constante/argumento/B', 'constante/combinada', 'constante/suma', 'exponentes/suma', 'exponentes/uno', 'proposiciones/vf']);
  for (const id of ['AD-no-detecta', 'AD-homogenea-es-correcta', 'AD-numeros-con-dimension', 'AD-suma-distintas', 'AD-fundamental-derivada', 'AD-constante-igual-al-miembro', 'AD-todos-uno', 'PR2-raiz'])
    assert.ok(ids.has(id), `no sale ${id}`);
});

test('las constantes no comparten letra con las magnitudes y las dimensiones no se disparan', () => {
  const plano = seg => seg.map(x => (typeof x === 'string' ? x : x.t)).join('');
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.tipo !== 'constante') continue;
    assert.ok(!/ A es | B es /.test(plano(p.enunciado)), `semilla ${s}: ${plano(p.enunciado)}`);
    for (const a of p.alternativas) assert.ok(!/[⁷⁸⁹]/.test(a.texto), `semilla ${s}: ${a.texto}`);
  }
});

test('los textos no dicen «de el» ni «a el»', () => {
  const plano = seg => seg.map(x => (typeof x === 'string' ? x : x.t)).join('');
  for (let s = 0; s < 1000; s++) {
    const p = gen.generar(s);
    const todo = [plano(p.enunciado), plano(p.pregunta), ...p.solucion.map(plano), ...p.alternativas.filter(a => a.error).map(a => a.error.explicacion)].join(' ');
    assert.ok(!/\b[Dd]e el\b|\b[Aa] el\b/.test(todo), `semilla ${s}`);
  }
});

test('600 semillas: en los exponentes la correcta no es la única entera ni la única fracción, y ningún distractor se dispara', () => {
  const frac = t => t.includes('/');
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    if (p._datos.tipo !== 'exponentes') continue;
    const c = p.alternativas.find(a => a.correcta), otras = p.alternativas.filter(a => !a.correcta);
    assert.ok(otras.some(a => frac(a.texto) === frac(c.texto)), `semilla ${s}: la correcta se reconoce por su forma (${p.alternativas.map(a => a.texto)})`);
    for (const a of otras) assert.ok(Math.abs(a.valor) <= 6, `semilla ${s}: exponente desmedido ${a.texto}`);
  }
});

test('nunca se queda sin cuatro alternativas (semillas 0 a 2000 y de texto)', () => {
  for (let s = 0; s <= 2000; s++) gen.generar(s);
  for (const s of ['entrada-1', 'entrada-2', 'salida-1', 'salida-3', 'alternativas-7']) gen.generar(s);
});

// ---- Papel: estructura y cada «verificar» recalculado con funciones propias del test ----
const PAPEL = {
  exponente: ([q, fs, j]) => exponentesBruta(q, fs)[j],
  'suma-exponentes': ([q, fs, ex]) => { assert.ok(iguales(SI[q], combinar(fs.map((k, i) => [k, ex[i]]))), 'no es homogénea'); return ex.reduce((s, x) => s + x, 0); },
  constante: ([q, pares]) => dimensionBruta(X => iguales(SI[q], suma(X, combinar(pares)))),
  argumento: ([k, a]) => dimensionBruta(X => iguales([0, 0, 0, 0], suma(X, SI[k], a))),
  cociente: ([q, t1, t2]) => suma(dimensionBruta(X => iguales(SI[q], suma(X, combinar(t1)))), dimensionBruta(X => iguales(SI[q], suma(X, combinar(t2)))), -1),
  homogenea: ([izq, der]) => iguales(combinar(izq), combinar(der)),
};
test('papel.json: estructura y respuestas recalculadas', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  assert.equal(new Set(papel.problemas.map(p => p.id)).size, papel.problemas.length);
  for (const p of papel.problemas) {
    for (const campo of ['enunciado', 'respuesta']) assert.ok(typeof p[campo] === 'string' && p[campo].length, `${p.id}: falta ${campo}`);
    assert.ok(Array.isArray(p.pasos) && p.pasos.length, `${p.id}: faltan pasos`);
    assert.ok(Array.isArray(p.verificar) && p.verificar.length, `${p.id}: falta verificar`);
    assert.ok(!/<[a-z\/]/i.test(JSON.stringify(p)), `${p.id}: tiene HTML`);
    for (const v of p.verificar) {
      assert.ok(PAPEL[v.tipo], `${p.id}: tipo desconocido ${v.tipo}`);
      const r = PAPEL[v.tipo](v.args);
      if (Array.isArray(v.espera)) assert.deepEqual(r.map(x => x + 0), v.espera, `${p.id}: ${v.tipo}`);
      else if (typeof v.espera === 'boolean') assert.equal(r, v.espera, `${p.id}: ${v.tipo}`);
      else assert.ok(Math.abs(r - v.espera) < 1e-9, `${p.id}: ${v.tipo} da ${r}, espera ${v.espera}`);
    }
  }
});
