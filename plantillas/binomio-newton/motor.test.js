// Pruebas del motor de «El tablero de los caminos» (binomio de Newton). Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con números al azar (semilla fija):
//    - C(n, k) = n!/(k!(n − k)!) = C(n, n − k), la regla de Pascal y que cada fila suma 2ⁿ;
//    - caminos({ n, k }) da C(n, k) palabras distintas, cada una con k letras b;
//    - el desarrollo, evaluado en números, coincide con (A + B)ⁿ calculado directo, y la suma de coeficientes con
//      el valor en 1; término, coeficiente y central coinciden con el desarrollo;
//    - la simulación de Galton reparte todas las bolitas y se repite con la misma semilla;
//    - NINGÚN ERROR TÍPICO COINCIDE CON LA RESPUESTA CORRECTA (en todos los casos y en un barrido de parámetros);
//    - las predicciones de la escena: la respuesta sale del motor, las opciones son distintas y de la misma forma.
// 3. Errores de entrada.
// 4. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
function cerca(real, esperado, que, tol) {
  const t = tol === undefined ? 1e-9 : tol;
  if (Array.isArray(esperado)) { assert.ok(Array.isArray(real), `${que}: se esperaba una lista`); assert.equal(real.length, esperado.length, `${que}: largo`); esperado.forEach((e, k) => cerca(real[k], e, `${que}[${k}]`, t)); return; }
  if (esperado && typeof esperado === 'object') { assert.ok(real && typeof real === 'object', `${que}: se esperaba un objeto`); for (const [k, v] of Object.entries(esperado)) cerca(real[k], v, `${que}.${k}`, t); return; }
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
function llamar(fn, args) { assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`); return motor[fn](...args); }
const campo = (r, k) => k.split('.').reduce((o, p) => (o == null ? o : o[p]), r);
function comprobar(fn, args, espera, que) {
  assert.ok(espera && typeof espera === 'object' && !Array.isArray(espera), `${que}: 'espera' debe ser un objeto`);
  assert.ok(Object.keys(espera).length > 0, `${que}: 'espera' vacío`);
  const r = llamar(fn, args);
  for (const [k, v] of Object.entries(espera)) { const x = campo(r, k); assert.ok(x !== undefined, `${que}: falta ${k}`); cerca(x, v, `${que} · ${k}`); }
}

// 1. casos.json
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'binomio-newton');
  assert.ok(typeof datos.verificacion === 'string', 'falta verificacion');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 22, `hay ${datos.casos.length} casos`);
  for (const c of datos.casos) {
    assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera && typeof c.espera === 'object', JSON.stringify(c).slice(0, 80));
    for (const t of c.tambien || []) assert.ok(t.espera && typeof t.espera === 'object' && !Array.isArray(t.espera), `${c.nombre}: 'espera' de 'tambien' debe ser objeto`);
  }
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
function azar(sem) { let s = (sem >>> 0) || 1; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; }
const rnd = azar(2026);
const ent = (a, b) => a + Math.floor((b - a + 1) * rnd());
const N = 300;
const big = t => BigInt(t.replace('−', '-'));
function fact(n) { let r = 1n; for (let i = 2n; i <= BigInt(n); i++) r *= i; return r; }
// número exacto de un texto de coeficiente ('−15/4') como [numerador, denominador]
const frac = t => { const [a, b] = t.replace('−', '-').split('/'); return [BigInt(a), BigInt(b || 1)]; };
const fnum = t => { const [a, b] = frac(t); return Number(a) / Number(b); };

test('combinatorio: n!/(k!(n − k)!), simetría, Pascal y filas que suman 2ⁿ', () => {
  for (let n = 0; n <= 40; n++) {
    let suma = 0n;
    for (let k = 0; k <= n; k++) {
      const c = big(motor.combinatorio({ n, k }).texto);
      assert.equal(c, fact(n) / (fact(k) * fact(n - k)), `C(${n}, ${k})`);
      assert.equal(c, big(motor.combinatorio({ n, k: n - k }).texto), 'simetría');
      if (k < n) assert.equal(big(motor.pascal({ n, k }).texto), big(motor.combinatorio({ n: n + 1, k: k + 1 }).texto), 'Pascal');
      suma += c;
    }
    assert.equal(suma, 2n ** BigInt(n), `fila ${n}`);
    assert.equal(big(motor.fila({ n }).texto), suma);
    assert.equal(motor.terminos({ n }).num, n + 1);
  }
});
test('caminos: C(n, k) palabras distintas con k letras b', () => {
  for (let n = 0; n <= 10; n++) for (let k = 0; k <= n; k++) {
    const r = motor.caminos({ n, k });
    assert.equal(r.cuantas, Number(big(motor.combinatorio({ n, k }).texto)));
    assert.equal(new Set(r.lista).size, r.lista.length);
    for (const w of r.lista) { assert.equal(w.length, n); assert.equal([...w].filter(c => c === 'b').length, k); }
  }
});
// Valor numérico de un monomio { c, v } con x = valor
const mono = () => ({ c: ent(-4, 4) || 1, v: { x: ent(-3, 3) } });
function valorBin(A, B, n, x) { return Math.pow(A.c * Math.pow(x, A.v.x || 0) + B.c * Math.pow(x, B.v.x || 0), n); }
test('desarrollo, término, coeficiente, central y suma de coeficientes coinciden con (A + B)ⁿ', () => {
  for (let i = 0; i < N; i++) {
    let A = mono(), B = mono(); while (B.v.x === A.v.x) B = mono();
    const n = ent(0, 9), x = [1.5, -0.7, 2][i % 3];
    const D = motor.desarrollo({ A, B, n });
    assert.equal(D.terminos.length, n + 1);
    let s = 0, sc = 0, escala = 0;
    for (const t of D.terminos) { const u = fnum(t.coef) * Math.pow(x, t.exponentes.x || 0); s += u; escala += Math.abs(u); sc += fnum(t.coef); }
    assert.ok(Math.abs(s - valorBin(A, B, n, x)) <= 1e-12 * Math.max(1, escala), `desarrollo n = ${n}`);
    cerca(motor.sumaCoeficientes({ A, B, n }).num, sc, 'suma de coeficientes', 1e-9);
    const L = ent(1, n + 1), T = motor.termino({ A, B, n, lugar: L });
    assert.equal(T.texto, D.terminos[L - 1].texto, 'termino = desarrollo');
    const m = D.terminos[L - 1].exponentes.x || 0, Q = motor.coeficiente({ A, B, n, m });
    assert.equal(Q.texto, D.terminos[L - 1].coef, 'coeficiente');
    assert.equal(Q.exponentes[Q.k], m);
    const Ce = motor.central({ A, B, n });
    if (n % 2 === 0) assert.equal(Ce.texto, D.terminos[n / 2].texto); else assert.deepEqual(Ce.terminos, [D.terminos[(n - 1) / 2].texto, D.terminos[(n + 1) / 2].texto]);
  }
});
test('Galton: la esperanza suma todas las bolitas; la simulación las reparte todas y se repite', () => {
  for (let n = 1; n <= 12; n++) {
    let s = 0; for (let k = 0; k <= n; k++) s += motor.galton({ n, bolitas: 1000, k }).num;
    cerca(s, 1000, `n = ${n}`);
    const a = motor.simular({ n, bolitas: 200, semilla: n }), b = motor.simular({ n, bolitas: 200, semilla: n });
    assert.deepEqual(a, b);
    assert.equal(a.casilleros.reduce((p, q) => p + q, 0), 200);
    a.caminos.forEach(w => assert.equal(w.length, n));
  }
});

function sinChoques(r, que) {
  assert.ok(r.errores && Array.isArray(r.coinciden) && Array.isArray(r.noAplica), `${que}: faltan errores, coinciden o noAplica`);
  for (const [k, e] of Object.entries(r.errores)) {
    assert.notEqual(e.texto, r.texto, `${que}: el error ${k} se escribe igual que la correcta`);
    assert.ok(/^(BN\d+|AL8|AL11)$/.test(e.id), `${que}: el error ${k} no tiene id`);
    assert.ok(e.regla, `${que}: el error ${k} no dice su regla`);
  }
  for (const k of r.coinciden) assert.ok(!(k in r.errores), `${que}: ${k} está en los dos lados`);
}
test('ningún error típico coincide con la respuesta correcta (casos y barrido)', () => {
  for (const c of datos.casos) for (const t of [c].concat(c.tambien || [])) { const r = llamar(t.fn || c.fn, t.args); if (r && r.errores) sinChoques(r, c.nombre); }
  for (let i = 0; i < N; i++) {
    const n = ent(1, 14), k = ent(0, n);
    sinChoques(motor.combinatorio({ n, k }), 'C(n, k)'); sinChoques(motor.fila({ n }), 'fila'); sinChoques(motor.terminos({ n }), 'términos');
    if (k < n) sinChoques(motor.pascal({ n, k }), 'Pascal');
    sinChoques(motor.galton({ n, bolitas: ent(1, 500), k }), 'Galton');
    let A = mono(), B = mono(); while (B.v.x === A.v.x) B = mono();
    sinChoques(motor.termino({ A, B, n, lugar: ent(1, n + 1) }), 'término');
    sinChoques(motor.coeficiente({ A, B, n, m: ent(-10, 10) }), 'coeficiente');
    sinChoques(motor.central({ A, B, n }), 'central');
    sinChoques(motor.sumaCoeficientes({ A, B, n }), 'suma de coeficientes');
  }
  // las tres perillas de la escena
  for (let n = 1; n <= 10; n++) for (let k = 0; k <= n; k++) sinChoques(motor.combinatorio({ n, k }), `C(${n}, ${k})`);
});

// Las predicciones de la escena (index.html): respuesta = motor, opciones distintas y con la misma forma.
const X = { c: 1, v: { x: 1 } }, a = { c: 1, v: { a: 1 } }, b = { c: 1, v: { b: 1 } };
const Ops = (r, ks) => [r.texto].concat(ks.map(k => { assert.ok(r.errores[k], `falta el error ${k}`); return r.errores[k].texto; }));
const ESCENA = {
  'paso1': () => Ops(motor.combinatorio({ n: 5, k: 3 }), ['variacion', 'soloK', 'todas']),
  'paso2': () => Ops(motor.pascal({ n: 7, k: 3 }), ['desfase', 'soloUno', 'multiplica']),
  'paso3': () => Ops(motor.fila({ n: 6 }), ['sumaN', 'doble', 'cuadrado']),
  'paso4': () => Ops(motor.terminos({ n: 7 }), ['nTerminos', 'reparte', 'sinJuntar']),
  'paso5': () => Ops(motor.termino({ A: a, B: b, n: 9, lugar: 4 }), ['desfase', 'kCompleto', 'alReves']),
  'paso6': () => Ops(motor.coeficiente({ A: { c: 2, v: { x: 1 } }, B: { c: 1 }, n: 6, m: 4 }), ['sinElevar', 'desfase', 'sinCoef']),
  'paso7': () => Ops(motor.termino({ A: X, B: { c: -2 }, n: 5, lugar: 4 }), ['sinSigno', 'sinElevar', 'desfase']),
  'paso8': () => Ops(motor.coeficiente({ A: { c: 1, v: { x: 2 } }, B: { c: 1, v: { x: -1 } }, n: 6, m: 0 }), ['desfase', 'central', 'exponenteSuma']),
  'suma-coeficientes': () => Ops(motor.sumaCoeficientes({ A: { c: 2, v: { x: 1 } }, B: { c: 1 }, n: 5 }), ['ignoraCoef', 'reparte', 'sumaN']),
  'termino-central': () => Ops(motor.central({ A: X, B: { c: 1, v: { y: 1 } }, n: 10 }), ['masUno', 'antes', 'desfase']),
  'n-impar': () => Ops(motor.central({ A: a, B: b, n: 7 }), ['soloAbajo', 'soloArriba', 'ninguno']),
  'galton': () => Ops(motor.galton({ n: 7, bolitas: 128, k: 3 }), ['uniforme', 'desfase', 'mitad']),
  'signos': () => Ops(motor.sumaCoeficientes({ A: X, B: { c: -2 }, n: 7 }), ['ignoraCoef', 'reparte', 'sinSigno']),
};
// en estos las opciones son frases que empiezan con el valor (la forma la da la frase)
const FRASE = new Set(['paso8', 'n-impar']);
test('las predicciones de la escena: respuesta del motor, opciones distintas y de la misma forma', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const forma = t => (/^−?\d+$/.test(t) ? 'numero' : /^−?\d*[a-z]/.test(t) ? 'monomio' : /^t[₀-₉]/.test(t) ? 'lugar' : 'otro');
  for (const [id, f] of Object.entries(ESCENA)) {
    const ops = f();
    assert.equal(new Set(ops).size, ops.length, `${id}: opciones repetidas: ${ops.join(' · ')}`);
    if (!FRASE.has(id)) {
      assert.equal(new Set(ops.map(forma)).size, 1, `${id}: opciones de distinta forma: ${ops.join(' · ')}`);
      assert.ok(!ops.map(forma).includes('otro'), `${id}: forma desconocida`);
      const largos = ops.map(t => t.length); assert.ok(Math.max(...largos) <= 3 * Math.min(...largos) + 3, `${id}: largos muy distintos`);
    }
    assert.ok(html.includes(`binomio-newton-${id}'`) || html.includes(`id:'${id}'`), `${id}: la escena no la usa`);
  }
});

// 3. Errores de entrada
test('entradas inválidas', () => {
  assert.throws(() => motor.combinatorio({ n: 5, k: 6 }), /entre 0 y 5/);
  assert.throws(() => motor.combinatorio({ n: 2.5, k: 1 }), /entero/);
  assert.throws(() => motor.factorial({ n: -1 }), /entre/);
  assert.throws(() => motor.pascal({ n: 4, k: 4 }), /menor que n/);
  assert.throws(() => motor.caminos({ n: 13, k: 2 }), /hasta 12/);
  assert.throws(() => motor.termino({ A: X, B: { c: 0 }, n: 3, lugar: 1 }), /distintos de 0/);
  assert.throws(() => motor.termino({ A: X, B: { c: 1 }, n: 3, lugar: 5 }), /entre 1 y 4/);
  assert.throws(() => motor.termino({ A: { c: 'dos', v: { x: 1 } }, B: { c: 1 }, n: 3, lugar: 1 }), /fracción/);
  assert.throws(() => motor.termino({ A: { c: 1.5, v: { x: 1 } }, B: { c: 1 }, n: 3, lugar: 1 }), /fracción/);
  assert.throws(() => motor.coeficiente({ A: X, B: { c: 1, v: { y: 1 } }, n: 3, m: 1 }), /solo puede haber/);
  assert.throws(() => motor.coeficiente({ A: X, B: { c: 2, v: { x: 1 } }, n: 3, m: 1 }), /misma potencia/);
  assert.throws(() => motor.coeficiente({ A: X, B: { c: 1 }, n: 3, m: 1.5 }), /entero/);
  assert.throws(() => motor.galton({ n: 0, bolitas: 10, k: 0 }), /entre 1/);
  assert.throws(() => motor.monomio({ c: 1, v: { X: 1 } }), /no vale/);
});

// 4. papel.json
const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
test('papel.json: entre 8 y 10 problemas, con respuesta, pasos y verificación', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 8 && papel.problemas.length <= 10);
  const ids = new Set();
  for (const p of papel.problemas) {
    assert.ok(p.id && !ids.has(p.id), p.id); ids.add(p.id);
    assert.ok(p.enunciado && p.respuesta && Array.isArray(p.pasos) && p.pasos.length, `${p.id}: falta texto`);
    assert.ok(Array.isArray(p.verificar) && p.verificar.length, `${p.id}: falta verificar`);
    assert.ok(!/<[a-z]/i.test([p.enunciado, p.respuesta].concat(p.pasos).join(' ')), `${p.id}: texto plano, sin HTML`);
    assert.ok(!/\d\.\d/.test([p.enunciado, p.respuesta].concat(p.pasos).join(' ')), `${p.id}: se escribe con coma decimal`);
  }
});
for (const p of papel.problemas) test(`papel ${p.id}: ${p.enunciado.slice(0, 60)}`, () => {
  for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id);
});
