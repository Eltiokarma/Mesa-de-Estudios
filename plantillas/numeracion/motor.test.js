// Pruebas del motor de «Las fichas que se agrupan». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con números al azar (semilla fija) y contra cuentas hechas de otra manera (toString de JavaScript,
//    BigInt, fuerza bruta): ida y vuelta entre aBase y aDecimal; agrupar, desagrupar, reagrupar y cada cuadro de la
//    animación conservan las fichas y terminan con cada cuenta menor que la base; los capicúas, los numerales de
//    k cifras y las cifras de las páginas coinciden con contarlos uno por uno; la base desconocida, la comparación,
//    sumar uno, multiplicar por la base y juntar cifras coinciden con hacerlo pasando por base 10. Y lo más
//    importante para la escena: ningún error típico da la respuesta correcta ni dos errores dan lo mismo.
//    Bordes: N = 0, b = 2, b = 10 y números grandes con BigInt.
// 3. Errores de entrada.
// 4. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const M = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
function cerca(real, esperado, que) {
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(Math.abs(real - esperado) <= 1e-9 * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
function llamar(fn, args) { assert.equal(typeof M[fn], 'function', `motor.${fn} no existe`); return M[fn](...args); }
const campo = (r, k) => (k === 'valor' && (typeof r !== 'object' || r === null || Array.isArray(r)) ? r : k.split('.').reduce((o, p) => (o == null ? o : o[p]), r));
function comprobar(fn, args, espera, que) {
  const r = llamar(fn, args);
  for (const [k, v] of Object.entries(espera)) {
    const x = campo(r, k);
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    cerca(x, v, `${que} · ${k}`);
  }
}

// 1. casos.json
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'numeracion');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 20);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
let semilla = 2026;
const rnd = () => (semilla = (Math.imul(semilla, 1664525) + 1013904223) >>> 0) / 4294967296;
const ent = (a, b) => a + Math.floor((b - a + 1) * rnd());
const N = 500;
const bruto = (n, b) => n.toString(b).toUpperCase();
function erroresDistintos(errores, correcta, que) {
  const vals = Object.values(errores);
  for (const [k, e] of Object.entries(errores)) assert.notDeepEqual(e, correcta, `${que}: el error ${k} da la respuesta correcta`);
  for (let i = 0; i < vals.length; i++) for (let j = i + 1; j < vals.length; j++) assert.notDeepEqual(vals[i], vals[j], `${que}: dos errores dan lo mismo`);
}
const numeralAlAzar = (b, L) => { const c = [ent(1, b - 1)]; for (let i = 1; i < L; i++) c.push(ent(0, b - 1)); return M.texto(c); };
const suma = c => c.reduce((s, x) => s + x, 0);
const fichas = (cuentas, b) => cuentas.reduce((s, x, k) => s + x * Math.pow(b, k), 0);

test('ida y vuelta: aBase y aDecimal coinciden con toString y parseInt, en muchas bases', () => {
  for (let k = 0; k < N; k++) {
    const b = ent(2, 36), n = k < 40 ? k : ent(0, 2e6);
    const A = M.aBase(n, b);
    assert.equal(A.texto, bruto(n, b), `${n} en base ${b}`);
    assert.equal(M.aDecimal(A.texto, b).valor, n, `${A.texto} en base ${b} vuelve a ${n}`);
    assert.equal(parseInt(A.texto, b), n);
    // cada división: dividendo = cociente · b + resto, con resto < b
    A.divisiones.forEach(d => { assert.equal(d.cociente * b + d.resto, d.dividendo); assert.ok(d.resto < b); });
    erroresDistintos(A.errores, A.texto, `aBase ${n} ${b}`);
    if (A.errores.omiteCeros) { assert.equal(A.errores.omiteCeros, A.texto.replace(/0/g, '')); assert.ok(M.valido(A.errores.omiteCeros, b).valido, 'omitir ceros da un numeral que existe'); }
    if (A.errores.olvidaUltimoCociente) assert.equal(M.valor(A.errores.olvidaUltimoCociente, b), n % Math.pow(b, A.cifras.length - 1), 'sin el último cociente queda n mod b^(k−1)');
    const D = M.aDecimal(A.texto, b);
    assert.equal(suma(D.terminos.map(t => t.producto)), n, 'la suma de los términos es el valor');
    assert.equal(D.horner[D.horner.length - 1], n, 'Horner termina en el valor');
    erroresDistintos(D.errores, D.valor, `aDecimal ${A.texto} ${b}`);
    if (b <= 10) { const b2 = ent(2, 10), C = M.cambiarBase(A.texto, b, b2); assert.equal(C.texto, bruto(n, b2)); }
  }
  // bordes
  for (let b = 2; b <= 36; b++) { assert.equal(M.aBase(0, b).texto, '0'); assert.equal(M.aBase(b, b).texto, '10'); assert.equal(M.aBase(b - 1, b).texto, M.SIMBOLOS[b - 1]); }
  for (let n = 0; n <= 1100; n++) { assert.equal(M.aBase(n, 10).texto, String(n), 'en base 10 queda igual'); assert.equal(M.aBase(n, 2).texto, n.toString(2)); }
  // números grandes con BigInt: exactos hasta 2⁵³ − 1
  const g = 2n ** 53n - 1n;
  assert.equal(M.aBase(g, 2).texto, '1'.repeat(53));
  assert.equal(M.valor('1'.repeat(53), 2), Number.MAX_SAFE_INTEGER);
  assert.equal(M.aBase(123456789012345n, 7).texto, (123456789012345n).toString(7));
});

test('las fichas no se pierden: agrupar, desagrupar, reagrupar y cada cuadro de la animación', () => {
  for (let k = 0; k < N; k++) {
    const b = ent(2, 10), n = k < 20 ? k : ent(0, 2000), A = M.agrupar(n, b);
    assert.equal(A.texto, bruto(n, b)); assert.equal(A.fichas, n);
    assert.equal(fichas(A.cuentas, b), n);
    A.cuentas.forEach(x => assert.ok(x < b, 'al final, ninguna cuenta llega a la base'));
    // las etapas son las divisiones sucesivas
    const Dv = M.aBase(n, b).divisiones;
    A.etapas.forEach((e, j) => { assert.equal(e.grupos, Dv[j].cociente); assert.equal(e.quedan, Dv[j].resto); assert.equal(fichas(e.despues, b), n); });
    const plan = { b, inicio: A.inicio, etapas: A.etapas };
    for (let t = 0; t <= A.etapas.length; t += 0.125) { const q = M.cuadro(plan, t); assert.equal(fichas(q.cuentas, b), n, `cuadro ${t} de ${n} en base ${b}`); q.cuentas.forEach(x => assert.ok(x >= 0)); }
    const D = M.desagrupar(A.texto, b);
    assert.equal(D.sueltas, n);
    const pd = { b, inicio: D.inicio, etapas: D.etapas };
    for (let t = 0; t <= D.etapas.length; t += 0.25) assert.equal(fichas(M.cuadro(pd, t).cuentas, b), n);
    const b2 = ent(2, 10), R = M.reagrupar(n, b, b2);
    assert.equal(R.hasta, bruto(n, b2)); assert.equal(R.fichas, n); assert.equal(R.desarmar.sueltas, n);
    // agregar fichas a cualquier cuenta se lleva en cadena
    const cu = A.cuentas.slice(); cu[0] += ent(1, 3 * b);
    const Nz = M.normalizar(cu, b); assert.equal(Nz.fichas, fichas(cu, b)); assert.equal(Nz.texto, bruto(fichas(cu, b), b));
  }
});

test('numerales válidos, base mínima, comparación y base desconocida', () => {
  for (let k = 0; k < N; k++) {
    const b = ent(2, 10), L = ent(1, 5);
    const lista = Array.from({ length: 5 }, () => { const c = [ent(1, 9)]; for (let i = 1; i < L; i++) c.push(ent(0, 9)); return M.texto(c); });
    const V = M.validos(lista, b);
    assert.equal(V.cantidad, lista.filter(t => t.split('').every(d => +d < b)).length);
    erroresDistintos(V.errores, V.cantidad, `válidos ${lista} ${b}`);
    for (const t of lista) {
      const v = M.valido(t, b); assert.equal(v.valido, !Number.isNaN(parseInt(t, b)) && parseInt(t, b).toString(b) === t, `${t} en base ${b}`);
      const bm = M.baseMinima(t).base;
      assert.ok(M.valido(t, bm).valido); if (bm > 2) assert.ok(!M.valido(t, bm - 1).valido);
    }
    const bA = ent(2, 10), bB = ent(2, 10), A = numeralAlAzar(bA, ent(1, 4)), B = numeralAlAzar(bB, ent(1, 4));
    const C = M.comparar(A, bA, B, bB), va = parseInt(A, bA), vb = parseInt(B, bB);
    assert.equal(C.mayor, va > vb ? 'A' : va < vb ? 'B' : 'iguales');
    erroresDistintos(C.errores, C.mayor, `comparar ${A}_${bA} ${B}_${bB}`);
    const bx = ent(2, 12), t = numeralAlAzar(bx, ent(2, 4)), x = parseInt(t, bx);
    if (M.baseMinima(t).base <= bx) {
      const Q = M.baseDesconocida(t, x);
      assert.equal(Q.base, bx, `${t} vale ${x} en base ${bx}`);
      erroresDistintos(Q.errores, Q.base, `base desconocida ${t} = ${x}`);
      Object.values(Q.errores).forEach(e => assert.notEqual(parseInt(t, e), x, `el error ${e} no es otra solución`));
    }
    const S = M.leerEnBases(t, [M.baseMinima(t).base, M.baseMinima(t).base + 1, M.baseMinima(t).base + 2]);
    erroresDistintos(S.errores, S.valores, `leer ${t}`);
  }
  // 121 leído en cualquier base es (b + 1)²
  for (let b = 3; b <= 36; b++) assert.equal(M.valor('121', b), (b + 1) * (b + 1));
});

test('sumar uno, multiplicar por la base y juntar cifras coinciden con pasar por base 10', () => {
  for (let k = 0; k < N; k++) {
    const b = ent(2, 10), t = k < 30 ? M.texto(Array(ent(1, 4)).fill(b - 1)) : numeralAlAzar(b, ent(1, 5)), v = parseInt(t, b);
    const S = M.sumarUno(t, b);
    assert.equal(S.texto, bruto(v + 1, b)); assert.equal(S.valor, v + 1);
    erroresDistintos(S.errores, S.texto, `sumar uno a ${t}_${b}`);
    // llevadas: tantas como nueves… de la base al final
    let ll = 0; for (let i = t.length - 1; i >= 0 && +t[i] === b - 1; i--) ll++;
    assert.equal(S.llevadas, ll, `llevadas de ${t}_${b}`);
    const P = M.porLaBase(t, b);
    assert.equal(P.texto, bruto(v * b, b)); erroresDistintos(P.errores, P.texto, `por la base ${t}_${b}`);
    const kk = ent(2, 3), bb = Math.pow(2, kk), bin = (ent(1, 5000)).toString(2), G = M.agruparCifras(bin, 2, kk);
    assert.equal(G.texto, parseInt(bin, 2).toString(bb).toUpperCase(), `${bin}₂ a base ${bb}`);
    erroresDistintos(G.errores, G.texto, `juntar ${bin}`);
    const b3 = ent(2, 3), G3 = M.agruparCifras(numeralAlAzar(b3, ent(1, 8)), b3, 2);
    assert.equal(G3.texto, G3.valor.toString(b3 * b3).toUpperCase());
  }
});

test('conteos: numerales de k cifras, capicúas y cifras de las páginas, contra la fuerza bruta', () => {
  for (let b = 2; b <= 10; b++) for (let kk = 1; kk <= 4; kk++) {
    if (Math.pow(b, kk) > 20000) continue;
    let cuenta = 0, capi = 0, mayor = -1, menor = Infinity; const lista = [];
    for (let n = 0; n < Math.pow(b, kk); n++) {
      const t = n.toString(b);
      if (t.length !== kk) continue;
      cuenta++; mayor = Math.max(mayor, n); menor = Math.min(menor, n);
      if (t === t.split('').reverse().join('')) { capi++; lista.push(t.toUpperCase()); }
    }
    const R = M.numerales(kk, b);
    assert.equal(R.cantidad, cuenta, `numerales de ${kk} cifras en base ${b}`); assert.equal(R.mayor, mayor); assert.equal(R.menor, menor);
    assert.equal(R.mayor, Math.pow(b, kk) - 1);
    erroresDistintos(R.errores, R.mayor, `mayor de ${kk} cifras en base ${b}`);
    erroresDistintos(R.erroresCantidad, R.cantidad, `cantidad de ${kk} cifras en base ${b}`);
    if (kk >= 2) {
      const C = M.capicuas(kk, b);
      assert.equal(C.cantidad, capi, `capicúas de ${kk} cifras en base ${b}`);
      if (C.lista) assert.deepEqual(C.lista, lista);
      erroresDistintos(C.errores, C.cantidad, `capicúas ${kk} ${b}`);
    }
  }
  let total = 0;
  for (let n = 1; n <= 3000; n++) {
    total += String(n).length;
    if (n % 7 && n > 120) continue;
    const P = M.cifrasPaginas(n);
    assert.equal(P.total, total, `cifras de 1 a ${n}`); assert.equal(P.formula, total);
    erroresDistintos(P.errores, P.total, `páginas ${n}`);
    assert.equal(M.paginasConCifras(total).paginas, n);
  }
  assert.equal(M.capicuas(30, 10).cantidad, 9 * 1e14, 'exacto aunque sea grande');
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => M.aBase(-1, 5), /mayor o igual/);
  assert.throws(() => M.aBase(2.5, 5), /entero/);
  assert.throws(() => M.aBase(10, 1), /base va de 2 a 36/);
  assert.throws(() => M.aBase(10, 37), /base va de 2 a 36/);
  assert.throws(() => M.aBase(2 ** 60, 2), /demasiado grande/);
  assert.throws(() => M.aDecimal('507', 6), /no existe en base 6/);
  assert.throws(() => M.aDecimal('3416', 6), /no existe en base 6/);
  assert.throws(() => M.aDecimal('', 6), /numeral/);
  assert.throws(() => M.aDecimal('2-1', 6), /numeral/);
  assert.throws(() => M.baseDesconocida('7', 7), /una sola cifra/);
  assert.throws(() => M.capicuas(1, 5), /mayor o igual/);
  assert.throws(() => M.cifrasPaginas(0), /mayor o igual que 1/);
  assert.throws(() => M.cuadro({}, 0), /plan/);
  assert.throws(() => M.normalizar([], 5), /cuentas/);
  assert.throws(() => M.valor('1'.repeat(60), 2), /demasiado grande/);
  assert.throws(() => M.agruparCifras('1012', 2, 2), /no existe en base 2/);
});

// 4. Problemas de papel (regla 6)
const rutaPapel = path.join(__dirname, 'papel.json');
const papel = fs.existsSync(rutaPapel) ? JSON.parse(fs.readFileSync(rutaPapel, 'utf8')) : null;
test('papel.json: entre 8 y 10 problemas, con respuesta, pasos y verificación', () => {
  assert.ok(papel, 'falta papel.json');
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 8 && papel.problemas.length <= 10);
  const ids = new Set();
  for (const p of papel.problemas) {
    assert.ok(p.id && !ids.has(p.id)); ids.add(p.id);
    assert.ok(p.enunciado && p.respuesta && Array.isArray(p.pasos) && p.pasos.length, `${p.id}: falta texto`);
    assert.ok(Array.isArray(p.verificar) && p.verificar.length, `${p.id}: falta verificar`);
    assert.ok(!/<[a-z]/i.test([p.enunciado, p.respuesta, ...p.pasos].join(' ')), `${p.id}: la app muestra texto plano, sin HTML`);
    assert.ok(!/\d\.\d/.test([p.enunciado, p.respuesta, ...p.pasos].join(' ')), `${p.id}: se escribe con coma decimal`);
  }
  const todo = papel.problemas.map(p => p.enunciado).join(' ');
  assert.ok(/capicúa/i.test(todo), 'hay un problema de capicúas');
  assert.ok(/numerar/i.test(todo), 'hay un problema de conteo de cifras');
});
for (const p of (papel && papel.problemas) || []) test(`papel ${p.id}: la respuesta coincide con el motor`, () => {
  for (const x of p.verificar) comprobar(x.fn, x.args, x.espera, p.id);
});
