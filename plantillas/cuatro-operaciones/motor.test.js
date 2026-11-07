// Pruebas del motor de «El tablero de las llevadas». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con números al azar (semilla fija) y contra cuentas hechas de otra manera (parseInt y toString de
//    JavaScript, BigInt, fuerza bruta): sumas, restas y multiplicaciones en columnas en muchas bases coinciden con la
//    aritmética directa, y cada columna cumple «lo que entra = cifra + b · llevada»; los cuadros de la animación no
//    pierden piezas; CA(N) + N = 10ᵏ y la regla de academia da lo mismo; D = d·q + r con 0 ≤ r < d y r + r′ = d; las
//    sumatorias coinciden con sumar término a término; la cantidad de cifras de un producto, con probarlo; las
//    cifras que faltan y las criptos de la escena tienen una sola solución. Y lo más importante para la escena:
//    ningún error típico da la respuesta correcta ni dos errores dan lo mismo.
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
  assert.equal(datos.plantilla, 'cuatro-operaciones');
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
const N = 600;
const bruto = (n, b) => n.toString(b).toUpperCase();
function erroresDistintos(errores, correcta, que) {
  const vals = Object.values(errores);
  for (const [k, e] of Object.entries(errores)) assert.notDeepEqual(e, correcta, `${que}: el error ${k} da la respuesta correcta`);
  for (let i = 0; i < vals.length; i++) for (let j = i + 1; j < vals.length; j++) assert.notDeepEqual(vals[i], vals[j], `${que}: dos errores dan lo mismo`);
}
// Los errores que son numerales deben existir en la base (lección: todos los distractores «existen»).
function existen(errores, b, que) {
  for (const [k, e] of Object.entries(errores)) if (typeof e === 'string' && e !== 'nunca') assert.ok([...e].every(ch => M.SIMBOLOS.indexOf(ch) < b && M.SIMBOLOS.indexOf(ch) >= 0), `${que}: el error ${k} (${e}) no existe en base ${b}`);
}
const piezas = (cuentas, b) => cuentas.reduce((s, x, k) => s + (x || 0) * Math.pow(b, k), 0);

test('suma en columnas: coincide con la suma directa en muchas bases, y cada columna cumple entra = cifra + b·llevada', () => {
  for (let i = 0; i < N; i++) {
    const b = i < 30 ? 10 : ent(2, 16), ns = Array.from({ length: i % 7 === 0 ? 3 : 2 }, () => ent(0, Math.pow(b, ent(1, 4)) - 1));
    const R = M.sumaColumnas(ns.map(n => bruto(n, b)), b), total = ns.reduce((s, n) => s + n, 0);
    assert.equal(R.texto, bruto(total, b), `${ns} en base ${b}`);
    assert.equal(R.valor, total);
    let ll = 0;
    R.columnas.forEach(c => {
      assert.equal(c.llevadaEntra, ll);
      assert.equal(c.total, c.entran.reduce((s, x) => s + x, 0) + c.llevadaEntra);
      assert.equal(c.total, c.cifra + b * c.llevadaSale); assert.ok(c.cifra < b);
      ll = c.llevadaSale;
    });
    assert.equal(ll, 0, 'la última columna no deja llevada suelta');
    erroresDistintos(R.errores, R.texto, `suma ${ns} b${b}`); existen(R.errores, b, `suma ${ns} b${b}`);
    // cada cuadro de la animación conserva las piezas (las que bajan, las del resultado, la llevada y la que sube)
    for (let t = 0; t <= R.K; t += 0.125) {
      const q = M.cuadroColumnas(R, t);
      let p = q.filas.reduce((s, f) => s + piezas(f, b), 0) + piezas(q.resultado.map(x => x || 0), b) + piezas(q.llevada, b) + q.llevadaFuera * Math.pow(b, R.K);
      if (q.moviendo && q.moviendo.tipo === 'subir') p += q.moviendo.paquetes * Math.pow(b, q.moviendo.orden + 1);
      assert.equal(p, total, `cuadro ${t} de ${ns} en base ${b}`);
    }
    assert.deepEqual(M.cuadroColumnas(R, R.K).resultado, R.cuentas);
  }
});

test('resta en columnas con préstamos: coincide con la resta directa; los préstamos y cada cuadro conservan las piezas', () => {
  for (let i = 0; i < N; i++) {
    const b = i < 40 ? 10 : ent(2, 16), a = ent(0, Math.pow(b, ent(1, 5)) - 1), s = ent(0, a);
    const ta = i % 9 === 0 ? bruto(Math.pow(b, ent(2, 4)) * ent(1, b - 1) + ent(0, b - 1), b) : bruto(a, b);
    const va = parseInt(ta, b), vs = Math.min(s, va), R = M.restaColumnas(ta, bruto(vs, b), b);
    assert.equal(R.texto, bruto(va - vs, b), `${ta} − ${bruto(vs, b)} en base ${b}`);
    assert.equal(piezas(R.tras, b), va, 'los préstamos no cambian el minuendo');
    R.tras.forEach((x, k) => { assert.ok(x >= R.abajo[k], 'después de prestar, arriba alcanza'); assert.ok(x <= 2 * b - 1); });
    R.prestamos.forEach(p => { for (let j = p.para + 1; j < p.desde; j++) assert.equal(R.arriba[j], 0, 'el préstamo solo salta ceros'); });
    erroresDistintos(R.errores, R.texto, `resta ${ta} ${vs} b${b}`); existen(R.errores, b, `resta ${ta} b${b}`);
    for (let t = 0; t <= R.acciones.length; t += 0.25) {
      const q = M.cuadroResta(R, t);
      const quitado = R.acciones.slice(0, Math.floor(t)).filter(x => x.tipo === 'quitar').reduce((s2, x) => s2 + x.quita * Math.pow(b, x.orden), 0);
      assert.equal(piezas(q.arriba, b) + piezas(q.resultado.map(x => x || 0), b) + quitado, va, `cuadro ${t}`);
      assert.equal(piezas(q.abajo, b) + quitado, vs);
    }
  }
});

test('multiplicar por una cifra: coincide con el producto directo y las copias se juntan de b en b', () => {
  for (let i = 0; i < N; i++) {
    const b = ent(2, 12), n = ent(0, Math.pow(b, ent(1, 4)) - 1), m = ent(0, b - 1);
    const R = M.multiplicaPorCifra(bruto(n, b), m, b);
    assert.equal(R.texto, bruto(n * m, b)); assert.equal(R.valor, n * m);
    assert.equal(piezas(R.filas[0], b), n * m, 'las copias son m veces cada pieza');
    erroresDistintos(R.errores, R.texto, `${n}·${m} b${b}`); existen(R.errores, b, `${n}·${m} b${b}`);
    for (let t = 0; t <= R.K; t += 0.25) {
      const q = M.cuadroColumnas(R, t);
      let p = piezas(q.filas[0], b) + piezas(q.resultado.map(x => x || 0), b) + piezas(q.llevada, b) + q.llevadaFuera * Math.pow(b, R.K);
      if (q.moviendo && q.moviendo.tipo === 'subir') p += q.moviendo.paquetes * Math.pow(b, q.moviendo.orden + 1);
      assert.equal(p, n * m);
    }
  }
});

test('complemento: CA(N) + N = bᵏ, la regla de academia da lo mismo y el relleno sube en cadena', () => {
  for (let i = 0; i < N; i++) {
    const b = i < 300 ? 10 : ent(2, 10), k = ent(1, 6);
    let n = ent(Math.pow(b, k - 1), Math.pow(b, k) - 1);
    if (i % 5 === 0) n = Math.floor(n / (b * b)) * b * b || n;                 // con ceros al final
    const t = bruto(n, b), C = M.complemento(t, b);
    assert.equal(C.valor + n, Math.pow(b, t.length), `CA(${t}) en base ${b}`);
    assert.equal(parseInt(C.regla.map(d => M.SIMBOLOS[d]).join(''), b), C.valor, 'la regla');
    assert.equal(C.relleno.texto, '1' + '0'.repeat(t.length), 'N + CA es 1 seguido de k ceros');
    C.relleno.columnas.slice(C.cerosFinales, t.length).forEach(c => assert.equal(c.total, b, 'cada columna desde la última significativa llega justo a b'));
    erroresDistintos(C.errores, C.texto, `CA ${t} b${b}`); existen(C.errores, b, `CA ${t} b${b}`);
  }
  // fuerza bruta en base 10, del 1 al 2000
  for (let n = 1; n <= 2000; n++) assert.equal(M.complemento(String(n)).valor, Math.pow(10, String(n).length) - n);
});

test('un número de 3 cifras menos su reverso es siempre 99·(primera − última); la que empieza con L es única', () => {
  for (let a = 1; a <= 9; a++) for (let m = 0; m <= 9; m++) for (let c = 1; c < a; c++) {
    const R = M.conSuReverso(`${a}${m}${c}`);
    assert.equal(R.diferencia, 99 * (a - c)); assert.equal(R.diferencia % 99, 0);
    assert.equal(R.diferencia, (100 * a + 10 * m + c) - (100 * c + 10 * m + a));
  }
  for (let L = 1; L <= 7; L++) {
    const D = M.diferenciaInvertida(L);
    const todas = new Set(); for (let k = 1; k <= 8; k++) todas.add(99 * k);   // primera − última de 1 a 8
    assert.deepEqual([...todas].filter(x => String(x).length === 3 && String(x)[0] === String(L)), [D.diferencia], `la que empieza con ${L}`);
    erroresDistintos(D.errores, D.texto, `L ${L}`);
    Object.values(D.errores).forEach(e => assert.ok(!todas.has(+e), `${e} no es una diferencia posible`));
    D.ejemplos.forEach(e => assert.equal(M.conSuReverso(e).diferencia, D.diferencia));
  }
});

test('cifras que faltan y criptos: fuerza bruta propia, una sola solución en la escena y errores distintos', () => {
  const F = M.cifrasFaltantes(['?85', '6??'], '1282');
  let cuenta = 0;
  for (let x = 1; x <= 9; x++) for (let y = 0; y <= 9; y++) for (let z = 0; z <= 9; z++) if (x * 100 + 85 + 600 + y * 10 + z === 1282) cuenta++;
  assert.equal(cuenta, 1); assert.equal(F.soluciones.length, 1);
  assert.equal(F.deduccion, F.suma, 'deducir columna por columna con las llevadas da lo mismo que la fuerza bruta');
  erroresDistintos(F.errores, F.suma, 'faltantes del paso 4');
  // al azar: se borran cifras de una suma verdadera; la solución verdadera siempre está entre las que encuentra
  for (let i = 0; i < 200; i++) {
    const a = ent(100, 999), b2 = ent(100, 999), r = String(a + b2), A = String(a).split(''), B = String(b2).split('');
    for (let k = 0; k < 3; k++) { if (rnd() < .5) A[k] = '?'; else B[k] = '?'; }
    const Q = M.cifrasFaltantes([A.join(''), B.join('')], r);
    assert.ok(Q.soluciones.some(s => s.filas[0] === String(a) && s.filas[1] === String(b2)), `${A.join('')} + ${B.join('')} = ${r}`);
    Q.soluciones.forEach(s => assert.equal(+s.filas[0] + +s.filas[1], +r));
    if (Q.unica && Q.deduccion !== undefined) { assert.equal(Q.deduccion, Q.suma); erroresDistintos(Q.errores, Q.suma, `${A.join('')} + ${B.join('')}`); }
  }
  // XY + YX = N: fuerza bruta propia
  for (let n = 22; n <= 198; n++) {
    const pares = [];
    for (let x = 1; x <= 9; x++) for (let y = 1; y <= 9; y++) if (x !== y && 11 * (x + y) === n) pares.push(`${x}${y}`);
    const I = M.invertidos(n);
    assert.deepEqual(I.pares.slice().sort(), pares.sort(), `XY + YX = ${n}`);
    if (I.unica) { assert.equal(I.suma * 11, n); erroresDistintos(I.errores, I.suma, `invertidos ${n}`); }
  }
  const Z = M.cripto(['XY', 'YX'], 'ZYZ'); assert.ok(Z.unica);
  assert.equal(M.cripto(['XY', 'YX'], 'ZYZ', { distintas: false }).soluciones.length >= 1, true);
});

test('sumatorias: coinciden con sumar término a término, y los errores no dan la suma', () => {
  for (let i = 0; i < 300; i++) {
    const r = ent(1, 5), p = ent(0, 120), n = ent(1, 200), u = p + (n - 1) * r;
    const A = M.sumaAritmetica(p, u, r);
    let s = 0; for (let x = p; x <= u; x += r) s += x;
    assert.equal(A.S, s); assert.equal(A.n, n); assert.equal(A.rectangulo.area, 2 * s, 'la escalera y su copia: el doble');
    erroresDistintos(A.errores, A.S, `${p}..${u} de ${r} en ${r}`);
  }
  for (let n = 1; n <= 60; n++) {
    let a = 0, pa = 0, im = 0, cu = 0, cb = 0;
    for (let k = 1; k <= n; k++) { a += k; pa += 2 * k; im += 2 * k - 1; cu += k * k; cb += k * k * k; }
    assert.equal(M.sumatoria('naturales', n).S, a); assert.equal(M.sumatoria('pares', n).S, pa); assert.equal(M.sumatoria('impares', n).S, im);
    assert.equal(M.sumatoria('cuadrados', n).S, cu); assert.equal(M.sumatoria('cubos', n).S, cb);
  }
});

test('división entera: D = d·q + r con 0 ≤ r < d, D = d·(q + 1) − r′ y r + r′ = d cuando no es exacta', () => {
  for (let i = 0; i < 2000; i++) {
    const d = ent(1, 60), D = ent(0, 3000), X = M.division(D, d);
    assert.equal(X.d * X.q + X.r, D); assert.ok(X.r >= 0 && X.r < d);
    assert.equal(X.q, Math.floor(D / d));
    if (X.r === 0) { assert.ok(X.exacta); assert.equal(X.rExceso, null); }
    else {
      assert.equal(d * X.qExceso - X.rExceso, D); assert.equal(X.r + X.rExceso, d); assert.ok(X.rExceso > 0 && X.rExceso < d);
      erroresDistintos(X.errores, X.rExceso, `${D} ÷ ${d}`);
    }
    assert.equal(X.filas.llenas * d + X.filas.sobran, D);
  }
  for (let d = 2; d <= 40; d++) {
    const RM = M.residuoMaximo(d); assert.equal(RM.maximo, d - 1); erroresDistintos(RM.errores, RM.maximo, `máximo ${d}`);
    let mx = 0; for (let D = 0; D < 5 * d; D++) mx = Math.max(mx, D % d); assert.equal(mx, d - 1);
    const I = M.residuosIguales(d);
    const iguales = new Set(); for (let D = d; D <= 6 * d; D++) { const x = M.division(D, d); if (!x.exacta && x.r === x.rExceso) iguales.add(x.r); }
    assert.deepEqual([...iguales], I.existe ? [I.residuo] : []);
    erroresDistintos(I.errores, I.residuo, `iguales ${d}`);
  }
});

test('cantidad de cifras de un producto: entre m + n − 1 y m + n, probándolo', () => {
  for (let m = 1; m <= 4; m++) for (let n = 1; n <= 3; n++) {
    const C = M.cifrasProducto(m, n), vistas = new Set();
    for (let i = 0; i < 400; i++) { const a = ent(Math.pow(10, m - 1), Math.pow(10, m) - 1), b = ent(Math.pow(10, n - 1), Math.pow(10, n) - 1); vistas.add(String(a * b).length); }
    vistas.add(String(C.menor.producto).length); vistas.add(String(C.mayor.producto).length);
    assert.deepEqual([...vistas].sort((x, y) => x - y), C.cifras, `${m} cifras por ${n} cifras`);
    erroresDistintos(C.errores, C.cifras, `cifras ${m} ${n}`);
  }
  assert.equal(M.cifrasProducto(15, 15).mayor.texto.length, 30, 'exacto aunque sea grande');
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => M.sumaColumnas(['12'], 10), /al menos dos/);
  assert.throws(() => M.sumaColumnas(['17', '3'], 5), /no existe en base 5/);
  assert.throws(() => M.sumaColumnas(['1', '2'], 1), /base va de 2 a 36/);
  assert.throws(() => M.restaColumnas('12', '30'), /no puede ser mayor/);
  assert.throws(() => M.multiplicaPorCifra('34', 5, 5), /menor o igual/);
  assert.throws(() => M.complemento('0'), /mayor que 0/);
  assert.throws(() => M.complemento('0123'), /empezar con 0/);
  assert.throws(() => M.division(10, 0), /mayor o igual que 1/);
  assert.throws(() => M.division(-1, 3), /mayor o igual que 0/);
  assert.throws(() => M.division(2.5, 3), /entero/);
  assert.throws(() => M.sumaAritmetica(2, 61, 2), /no está/);
  assert.throws(() => M.sumaAritmetica(10, 2, 1), /mayor o igual/);
  assert.throws(() => M.sumatoria('primos', 3), /tipo/);
  assert.throws(() => M.cifrasFaltantes(['12', '34'], '46'), /no hay casillas/);
  assert.throws(() => M.cripto(['ab', 'ba'], '132'), /mayúsculas/);
  assert.throws(() => M.conSuReverso('257'), /primera mayor/);
  assert.throws(() => M.diferenciaInvertida(8), /menor o igual/);
  assert.throws(() => M.cuadroColumnas({}, 0), /plan/);
  assert.throws(() => M.cuadroResta({}, 0), /restaColumnas/);
  assert.throws(() => M.division(2 ** 60, 3), /demasiado grande/);
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
  assert.ok(/complemento/i.test(todo), 'hay un problema de complemento aritmético');
  assert.ok(/residuo/i.test(todo), 'hay un problema de división por exceso');
  assert.ok(/base/i.test(todo), 'hay operaciones en otra base');
});
for (const p of (papel && papel.problemas) || []) test(`papel ${p.id}: la respuesta coincide con el motor`, () => {
  for (const x of p.verificar) comprobar(x.fn, x.args, x.espera, p.id);
});
