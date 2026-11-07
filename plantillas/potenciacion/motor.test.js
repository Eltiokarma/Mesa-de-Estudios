// Pruebas del motor de «El cuadrado de fichas». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, contra cuentas hechas de otra manera (fuerza bruta subiendo k de uno en uno, Math.sqrt donde es exacto,
//    BigInt): N = k² + r con 0 ≤ r ≤ 2k para muchos N, y lo mismo con la cúbica; k² + 2k + 1 = (k+1)² y la cáscara del
//    cubo; las terminaciones contra elevar cada número; los criterios de exclusión nunca excluyen un cuadrado verdadero
//    (todos los cuadrados hasta 10⁶ y cuadrados grandes) y excluyen lo que dicen; los multiplicadores y divisores mínimos
//    contra probar uno por uno; el conteo de cuadrados contra contarlos; las posiciones de los dibujos conservan las
//    fichas sin encimarlas. Y lo más importante para la escena: ningún error típico da la respuesta correcta ni dos
//    errores dan lo mismo. Bordes: 0, 1 y cuadrados grandes con BigInt.
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
  assert.equal(datos.plantilla, 'potenciacion');
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
const ser = v => JSON.stringify(v, (k, x) => (typeof x === 'bigint' ? 'n' + x : x));
function erroresDistintos(errores, correcta, que) {
  const vals = Object.values(errores).map(ser);
  for (const [k, e] of Object.entries(errores)) assert.notEqual(ser(e), ser(correcta), `${que}: el error ${k} da la respuesta correcta`);
  assert.equal(new Set(vals).size, vals.length, `${que}: dos errores dan lo mismo`);
}
// raíz por fuerza bruta: subir k mientras (k+1)ⁿ ≤ N
function brutaRaiz(N, n) { let k = 0; while (Math.pow(k + 1, n) <= N) k++; return k; }

test('raíz entera: N = kⁿ + r con 0 ≤ r ≤ (k+1)ⁿ − kⁿ − 1 (r ≤ 2k en la cuadrada), contra la fuerza bruta', () => {
  let kk = 0;
  for (let N = 0; N <= 20000; N++) {
    while ((kk + 1) * (kk + 1) <= N) kk++;
    const R = M.raizEntera(N);
    assert.equal(R.k, kk, `√${N}`);
    assert.equal(R.k * R.k + R.r, N);
    assert.ok(R.r >= 0 && R.r <= 2 * R.k, `resto de ${N}: ${R.r} ≤ 2·${R.k}`);
    assert.equal(R.restoMaximo, 2 * R.k);
    assert.equal(R.exceso, R.k + 1); assert.equal(R.rp, (R.k + 1) ** 2 - N); assert.ok(R.rp >= 1);
    assert.equal(R.exacta, R.r === 0); assert.equal(M.esCuadrado(N), R.r === 0);
    erroresDistintos(R.errores, R.respuesta, `√${N}`);
    if (R.errores.ladoMenor) assert.ok(R.errores.ladoMenor.r > 2 * R.errores.ladoMenor.k, 'con un lado menor el resto pasa de 2k');
    // los dos decimales: k,dd ≤ √N < k,dd + 0,01
    const dd = Number(R.decimal.slice(2)), a = R.k + dd / 100;
    assert.ok(a * a <= N + 1e-9 && (a + 0.01) * (a + 0.01) > N - 1e-9, `decimales de √${N}`);
  }
  for (let k = 0; k < 400; k++) {
    const N = k < 200 ? k : ent(0, 3e6), R = M.raizEntera(N, 3), kb = brutaRaiz(N, 3);
    assert.equal(R.k, kb, `∛${N}`); assert.equal(R.k ** 3 + R.r, N);
    assert.ok(R.r >= 0 && R.r <= 3 * R.k * R.k + 3 * R.k, `resto cúbico de ${N}`);
    assert.equal(M.esCubo(N), R.r === 0);
    erroresDistintos(R.errores, R.respuesta, `∛${N}`);
  }
  // cuadrados y cubos grandes, exactos con BigInt
  for (let j = 0; j < 200; j++) {
    const k = BigInt(ent(1, 2 ** 30)) * BigInt(ent(1, 2 ** 30)) + BigInt(j), N = k * k;
    const R = M.raizEntera(N);
    assert.equal(BigInt(R.k), k); assert.equal(R.r, 0);
    const R1 = M.raizEntera(N - 1n); assert.equal(BigInt(R1.k), k - 1n); assert.equal(BigInt(R1.r), 2n * (k - 1n));
    const R2 = M.raizEntera(N + 2n * k); assert.equal(BigInt(R2.k), k); assert.equal(BigInt(R2.r), 2n * k, 'el resto llega a 2k justo antes del cuadrado siguiente');
    const C = M.raizEntera(k * k * k, 3); assert.equal(BigInt(C.k), k); assert.equal(C.r, 0);
  }
  assert.equal(M.raizEntera(Number.MAX_SAFE_INTEGER).k, Math.floor(Math.sqrt(Number.MAX_SAFE_INTEGER)));
});

test('de k² a (k+1)²: la L tiene 2k + 1 fichas; de k³ a (k+1)³, la cáscara 3k² + 3k + 1', () => {
  for (let k = 0; k <= 200; k++) {
    const A = M.agregarParaSiguiente(k);
    assert.equal(A.agrega, 2 * k + 1); assert.equal(k * k + 2 * k + 1, (k + 1) ** 2);
    assert.equal(A.partes.lado + A.partes.otroLado + A.partes.esquina, A.agrega);
    erroresDistintos(A.errores, A.agrega, `L de ${k}`);
    const L = M.layoutL(k);
    assert.equal(L.cantidad, 2 * k + 1);
    // la L más el cuadrado viejo cubren exactamente el cuadrado nuevo, sin repetir
    const celdas = new Set(L.celdas.map(c => c.x + ',' + c.y));
    assert.equal(celdas.size, L.cantidad);
    L.celdas.forEach(c => { assert.ok(c.x === k || c.y === k, 'la L está fuera del cuadrado viejo'); assert.ok(c.x <= k && c.y <= k); });
    const B = M.agregarParaSiguiente(k, 3);
    assert.equal(B.agrega, 3 * k * k + 3 * k + 1); assert.equal(B.agrega, (k + 1) ** 3 - k ** 3);
    erroresDistintos(B.errores, B.agrega, `cáscara de ${k}`);
  }
  for (let k = 1; k <= 8; k++) {
    const C = M.crecerCubo(k);
    assert.equal(C.viejo, k ** 3); assert.equal(C.caras, 3 * k * k); assert.equal(C.aristas, 3 * k); assert.equal(C.esquina, 1);
    assert.equal(C.cubitos.length, (k + 1) ** 3);
    // de atrás hacia adelante
    for (let i = 1; i < C.cubitos.length; i++) { const p = C.cubitos[i - 1], q = C.cubitos[i]; assert.ok(p.x + p.y + p.z <= q.x + q.y + q.z); }
  }
});

test('terminaciones: contra elevar cada número; los cubos toman todas las cifras', () => {
  for (const n of [2, 3, 4, 5]) {
    const T = M.terminaciones(n), vistas = new Set();
    for (let k = 0; k < 2000; k++) vistas.add(Number(BigInt(k) ** BigInt(n) % 10n));
    assert.deepEqual(T.cifras, [...vistas].sort((a, b) => a - b), `terminaciones de la potencia ${n}`);
    for (let d = 0; d < 10; d++) assert.equal(T.mapa[d], Number(BigInt(d) ** BigInt(n) % 10n));
  }
  assert.deepEqual(M.terminaciones(2).nunca, [2, 3, 7, 8]);
  assert.equal(M.terminaciones(3).todas, true);
});

test('criterios de exclusión: nunca excluyen un cuadrado verdadero y cada razón es cierta', () => {
  for (let k = 0; k <= 1000; k++) { const C = M.criterios(k * k); assert.equal(C.excluido, false, `${k}² = ${k * k} quedó excluido: ${JSON.stringify(C.razones)}`); assert.equal(C.esCuadrado, true); }
  for (let j = 0; j < 300; j++) { const k = ent(1000, 9e7); assert.equal(M.criterios(k * k).excluido, false, `${k}²`); }
  let excluidos = 0;
  for (let N = 0; N <= 50000; N++) {
    const C = M.criterios(N);
    if (C.excluido) { excluidos++; assert.equal(Number.isInteger(Math.sqrt(N)), false); }
    for (const r of C.razones) {
      const t = String(N);
      if (r.id === 'ultima-cifra') assert.ok('2378'.includes(t[t.length - 1]));
      if (r.id === 'ceros-impares') assert.equal((t.match(/0+$/)[0].length) % 2, 1);
      if (r.id === 'termina-en-5') assert.ok(t.endsWith('5') && !t.endsWith('25'));
      if (r.id === 'entre-4') assert.ok(N % 4 >= 2);
      if (r.id === 'entre-9') assert.ok(![0, 1, 4, 7].includes(N % 9));
    }
  }
  assert.ok(excluidos > 35000, 'los criterios excluyen a la mayoría de los números');
  // una lista con un solo candidato: los errores son números de la lista que los criterios sí excluyen
  for (let j = 0; j < 300; j++) {
    const k = ent(30, 300), lista = [k * k];
    while (lista.length < 4) { const x = ent(1000, 99999); if (M.criterios(x).excluido) lista.push(x); }
    const P = M.puedeSerCuadrado(lista);
    assert.deepEqual(P.pueden, [k * k]);
    erroresDistintos(P.errores, P.pueden[0], `lista ${lista}`);
    Object.values(P.errores).forEach(e => assert.ok(lista.includes(e) && M.criterios(e).excluido));
  }
});

test('menor multiplicador y menor divisor: contra probar uno por uno', () => {
  // potencia exacta con números de JavaScript (los productos de la prueba no pasan de 10¹³)
  const es = (x, n) => { const r = Math.round(Math.pow(x, 1 / n)); return [r - 1, r, r + 1].some(y => y >= 0 && Math.pow(y, n) === x); };
  for (let N = 1; N <= 1500; N++) for (const n of [2, 3]) {
    if (n === 3 && N > 400) continue;
    const A = M.menorMultiplicador(N, n);
    let m = 1; while (!es(N * m, n)) m++;
    assert.equal(A.m, m, `multiplicar ${N} para una potencia ${n}`); assert.equal(A.resultado, N * m); assert.equal(A.raiz ** n, N * m);
    erroresDistintos(A.errores, A.m, `mult ${N} ${n}`);
    const D = M.menorDivisor(N, n);
    let d = 1; while (N % d || !es(N / d, n)) d++;
    assert.equal(D.d, d, `dividir ${N} para una potencia ${n}`); assert.equal(D.resultado * D.d, N); assert.equal(D.raiz ** n, D.resultado);
    erroresDistintos(D.errores, D.d, `div ${N} ${n}`);
    // el producto de los factores es N
    assert.equal(A.factores.reduce((s, { p, e }) => s * p ** e, 1), N);
  }
});

test('cuadrados entre a y b, de c cifras y cifras de la raíz: contra contarlos', () => {
  const cuad = [];
  for (let k = 0; k * k <= 20000; k++) cuad.push(k * k);
  for (let j = 0; j < 2000; j++) {
    const a = ent(0, 15000), b = a + ent(0, 5000), C = M.cuadradosEntre(a, b);
    assert.equal(C.cantidad, cuad.filter(x => x >= a && x <= b).length, `de ${a} a ${b}`);
    erroresDistintos(C.errores, C.cantidad, `de ${a} a ${b}`);
  }
  for (let c = 1; c <= 5; c++) {
    let n = 0; for (let k = 1; k <= 400; k++) if (String(k * k).length === c) n++;
    assert.equal(M.cuadradosDeCifras(c).cantidad, n, `cuadrados de ${c} cifras`);
  }
  for (let c = 1; c <= 16; c++) {
    const R = M.cifrasRaiz(c);
    assert.equal(R.cifras, Math.ceil(c / 2));
    assert.equal(String(R.menor).length, R.cifras); assert.equal(String(R.mayor).length, R.cifras);
    erroresDistintos(R.errores, R.cifras, `cifras de ${c}`);
  }
});

test('¿qué pasa si…?: impares, terminados en 5 y restos', () => {
  for (let n = 1; n <= 200; n++) {
    let s = 0; for (let i = 1; i <= 2 * n - 1; i += 2) s += i;
    const S = M.sumaImpares(n); assert.equal(S.suma, s); assert.equal(s, n * n);
    erroresDistintos(S.errores, S.suma, `impares ${n}`);
  }
  for (let a = 0; a <= 300; a++) {
    const x = 10 * a + 5, T = M.terminaEn5(x);
    assert.equal(T.cuadrado, x * x); assert.equal(T.cuadrado, a * (a + 1) * 100 + 25);
    erroresDistintos(T.errores, T.cuadrado, `${x}²`);
  }
  for (let m = 2; m <= 30; m++) {
    const R = M.restosCuadrados(m), vistos = new Set();
    for (let k = 0; k < 500; k++) vistos.add((k * k) % m);
    assert.deepEqual(R.restos, [...vistos].sort((a, b) => a - b));
    erroresDistintos(R.errores, R.restos, `restos entre ${m}`);
  }
});

test('posiciones de los dibujos: conservan las fichas, sin encimarlas', () => {
  for (let N = 0; N <= 400; N++) {
    const R = M.raizEntera(N);
    for (const k of [Math.max(0, R.k - 2), R.k, R.k + 1, R.k + 2]) {
      const L = M.layoutCuadrado(N, k);
      assert.equal(L.fichas.length, N, `N = ${N} con lado ${k}`);
      assert.equal(L.usadas + L.sobran, N); assert.equal(L.usadas + L.faltan, k * k);
      const todas = L.fichas.concat(L.huecos).map(c => c.x + ',' + c.y);
      assert.equal(new Set(todas).size, todas.length, `encimadas en ${N}, ${k}`);
      L.fichas.concat(L.huecos).forEach(c => assert.ok(c.x < L.ancho && c.y < L.alto));
    }
    if (R.r) {
      const L = M.layoutCuadrado(N, R.k, 'L');
      assert.equal(L.fichas.length, N);
      const pos = L.fichas.map(c => c.x + ',' + c.y); assert.equal(new Set(pos).size, N);
    }
  }
  for (let n = 1; n <= 20; n++) {
    const F = M.filasImpares(n), C = M.capasL(n);
    assert.equal(F.fichas.length, n * n); assert.equal(C.fichas.length, n * n);
    F.fichas.forEach((f, i) => assert.equal(f.capa, C.fichas[i].capa, 'la fila j se dobla en la L j'));
    const pos = new Set(C.fichas.map(c => c.x + ',' + c.y)); assert.equal(pos.size, n * n);
    C.fichas.forEach(c => assert.ok(c.x < n && c.y < n));
  }
  const R = M.reacomodar(72, [9, 8, 1], [6, 6, 2]);
  const mitad = M.interpolar(R.desde, R.hasta, 0.5);
  assert.equal(mitad.length, 72);
  assert.deepEqual(M.interpolar(R.desde, R.hasta, 1).map(c => [c.x, c.y, c.z]), R.hasta.map(c => [c.x, c.y, c.z]));
});

test('fichas de los factores, filas, tabla de restos y la cáscara separada', () => {
  for (let N = 1; N <= 3000; N++) for (const n of [2, 3]) {
    const F = M.fichasFactores(N, n);
    assert.equal(F.lista.reduce((a, p) => a * p, 1), N, 'la lista de primos multiplica N');
    assert.equal(F.grupos.flat().length + F.sueltos.length, F.lista.length, 'cada primo está en un grupo o suelto');
    F.grupos.forEach(g => { assert.equal(g.length, n); assert.ok(g.every(p => p === g[0])); });
    assert.equal(F.sueltos.reduce((a, p) => a * p, 1), M.menorDivisor(N, n).d, 'los sueltos son el menor divisor');
    assert.equal(F.faltan.reduce((a, p) => a * p, 1), M.menorMultiplicador(N, n).m, 'los que faltan son el menor multiplicador');
  }
  for (let N = 0; N <= 300; N++) { const L = M.layoutFilas(N, 15); assert.equal(L.fichas.length, N); assert.equal(new Set(L.fichas.map(f => f.x + ',' + f.y)).size, N); }
  M.tablaRestos(4, 30).forEach(t => assert.ok(M.restosCuadrados(4).restos.includes(t.resto)));
  for (let k = 1; k <= 6; k++) {
    const C = M.crecerCubo(k), Sp = C.separados;
    assert.equal(Sp.length, C.cubitos.length);
    Sp.forEach((q, i) => { const c = C.cubitos[i]; assert.equal(q.parte, c.parte); if (c.parte === 'viejo') assert.deepEqual([q.x, q.y, q.z], [c.x, c.y, c.z]); });
    assert.equal(new Set(Sp.map(q => q.x + ',' + q.y + ',' + q.z)).size, Sp.length, 'separados, sin encimarse');
  }
});

test('fichas de los factores, filas, tabla de restos y la cáscara separada', () => {
  for (let N = 1; N <= 3000; N++) for (const n of [2, 3]) {
    const F = M.fichasFactores(N, n);
    assert.equal(F.lista.reduce((a, p) => a * p, 1), N, 'la lista de primos multiplica N');
    assert.equal(F.grupos.flat().length + F.sueltos.length, F.lista.length, 'cada primo está en un grupo o suelto');
    F.grupos.forEach(g => { assert.equal(g.length, n); assert.ok(g.every(p => p === g[0])); });
    assert.equal(F.sueltos.reduce((a, p) => a * p, 1), M.menorDivisor(N, n).d, 'los sueltos son el menor divisor');
    assert.equal(F.faltan.reduce((a, p) => a * p, 1), M.menorMultiplicador(N, n).m, 'los que faltan son el menor multiplicador');
  }
  for (let N = 0; N <= 300; N++) { const L = M.layoutFilas(N, 15); assert.equal(L.fichas.length, N); assert.equal(new Set(L.fichas.map(f => f.x + ',' + f.y)).size, N); }
  M.tablaRestos(4, 30).forEach(t => assert.ok(M.restosCuadrados(4).restos.includes(t.resto)));
  for (let k = 1; k <= 6; k++) {
    const C = M.crecerCubo(k), Sp = C.separados;
    assert.equal(Sp.length, C.cubitos.length);
    Sp.forEach((q, i) => { const c = C.cubitos[i]; assert.equal(q.parte, c.parte); if (c.parte === 'viejo') assert.deepEqual([q.x, q.y, q.z], [c.x, c.y, c.z]); });
    assert.equal(new Set(Sp.map(q => q.x + ',' + q.y + ',' + q.z)).size, Sp.length, 'separados, sin encimarse');
  }
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => M.raizEntera(-1), /mayor o igual/);
  assert.throws(() => M.raizEntera(2.5), /entero/);
  assert.throws(() => M.raizEntera(10, 4), /n debe ser 2/);
  assert.throws(() => M.raizEntera(2 ** 60), /demasiado grande/);
  assert.throws(() => M.factores(0), /mayor o igual que 1/);
  assert.throws(() => M.menorMultiplicador(0, 2), /mayor o igual que 1/);
  assert.throws(() => M.cuadradosEntre(10, 5), /b debe ser mayor/);
  assert.throws(() => M.terminaEn5(64), /terminar en 5/);
  assert.throws(() => M.layoutCuadrado(5000), /demasiado grande/);
  assert.throws(() => M.layoutCuadrado(40, 3, 'L'), /no caben/);
  assert.throws(() => M.reacomodar(72, [9, 8, 1], [6, 6, 3]), /bloques/);
  assert.throws(() => M.interpolar([1], [1, 2], 0), /mismas fichas/);
  assert.throws(() => M.restosCuadrados(1), /mayor o igual/);
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
  // la indicación no adelanta las reglas que miden las predicciones
  assert.ok(!/2k|terminan? en|par de ceros|exponente/i.test(papel.indicacion));
});
for (const p of (papel && papel.problemas) || []) test(`papel ${p.id}: la respuesta coincide con el motor`, () => {
  for (const x of p.verificar) comprobar(x.fn, x.args, x.espera, p.id);
});
