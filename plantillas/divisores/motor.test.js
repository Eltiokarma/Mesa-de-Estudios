// Pruebas del motor de «El rectángulo de fichas». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con números al azar (semilla fija) y contra cuentas hechas de otra manera (fuerza bruta):
//    la descomposición vuelve a dar el número; la cantidad de divisores es (a+1)(b+1)… y coincide con contar los
//    rectángulos exactos; la tabla tiene cada divisor una sola vez; la suma de divisores por fórmula es la suma de
//    la lista; los divisores múltiplos de k son los de n/k; la criba coincide con esPrimo; φ coincide con contar
//    con el MCD; los criterios coinciden con dividir; el resto de una potencia por el ciclo coincide con BigInt;
//    las diofánticas son todas las soluciones. Y lo más importante para la escena: ningún error típico da la
//    respuesta correcta ni dos errores dan lo mismo.
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
  assert.equal(datos.plantilla, 'divisores');
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
const N = 400;
const bruta = n => { const l = []; for (let d = 1; d <= n; d++) if (n % d === 0) l.push(d); return l; };
const primoBruto = n => n >= 2 && bruta(n).length === 2;
const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };
function erroresDistintos(errores, correcta, que) {
  const vals = Object.values(errores);
  for (const [k, e] of Object.entries(errores)) assert.notDeepEqual(e, correcta, `${que}: el error ${k} da la respuesta correcta`);
  for (let i = 0; i < vals.length; i++) for (let j = i + 1; j < vals.length; j++) assert.notDeepEqual(vals[i], vals[j], `${que}: dos errores dan lo mismo`);
}

test('descomposición, divisores, rectángulos y tabla coinciden con la fuerza bruta', () => {
  for (let k = 0; k < N; k++) {
    const n = ent(1, 5000), F = M.factores(n);
    assert.equal(F.reduce((s, x) => s * Math.pow(x.p, x.e), 1), n, `${n}: la descomposición`);
    F.forEach(x => assert.ok(primoBruto(x.p) && x.e >= 1));
    const D = M.divisores(n), L = bruta(n);
    assert.deepEqual(D.lista, L, `${n}: lista`);
    assert.equal(D.cantidad, F.reduce((s, x) => s * (x.e + 1), 1), `${n}: (a+1)(b+1)…`);
    assert.equal(D.suma, L.reduce((s, d) => s + d, 0));
    erroresDistintos(D.errores, D.cantidad, `divisores ${n}`);
    const R = M.rectangulos(n);
    assert.equal(R.cantidad, D.cantidad); assert.equal(R.impar, Number.isInteger(Math.sqrt(n)), `${n}: impar solo si es cuadrado`);
    R.exactos.forEach(([f, c]) => assert.equal(f * c, n));
    erroresDistintos(R.errores, R.cantidad, `rectángulos ${n}`);
    for (let f = 1; f <= Math.min(n, 40); f++) { const r = M.rectangulo(n, f); assert.equal(r.filas * r.columnas + r.sobran, n); assert.ok(r.sobran < f); assert.equal(r.exacto, L.includes(f)); }
    if (F.length <= 3) {
      const T = M.tabla(n), vals = T.celdas.map(c => c.valor).sort((a, b) => a - b);
      assert.deepEqual(vals, L, `${n}: la tabla tiene cada divisor una vez`);
      assert.equal(T.filas * T.columnas * T.paneles, D.cantidad);
    }
    const S = M.sumaDivisores(n); assert.equal(S.suma, D.suma, `${n}: suma por fórmula`); erroresDistintos(S.errores, S.suma, `suma ${n}`);
    if (n >= 2) { const A = M.arbol(n); assert.equal(A.hojas.reduce((s, p) => s * p, 1), n); A.hojas.forEach(p => assert.ok(primoBruto(p))); }
    const kk = ent(1, 30), Mk = M.divisoresMultiplosDe(n, kk);
    assert.deepEqual(Mk.lista, L.filter(d => d % kk === 0));
    if (n % kk === 0) assert.equal(Mk.cantidad, M.divisores(n / kk).cantidad, `${n}, ${kk}: son los divisores de n/k`);
    erroresDistintos(Mk.errores, Mk.cantidad, `múltiplos ${n} ${kk}`);
  }
});
test('criba, primos, PESI, Euler y Wilson', () => {
  const C = M.criba(2000);
  for (let n = 1; n <= 2000; n++) assert.equal(C.tachadoPor[n] === 0, primoBruto(n), `criba ${n}`);
  for (let n = 0; n <= 2000; n++) assert.equal(M.esPrimo(n), primoBruto(n));
  for (const o of C.orden) { assert.ok(o.p * o.p <= 2000); o.tacha.forEach(m => assert.equal(m % o.p, 0)); }
  assert.ok(C.paraPor * C.paraPor > 2000);
  for (let Nc = 2; Nc <= 120; Nc++) erroresDistintos(M.criba(Nc).errores, M.criba(Nc).cantidad, `criba ${Nc}`);
  for (let k = 0; k < N; k++) {
    const a = ent(1, 300), b = ent(1, 300), P = M.pesi(a, b);
    assert.equal(P.mcd, gcd(a, b)); assert.equal(P.pesi, gcd(a, b) === 1);
    // puntos de la cuadrícula que toca la diagonal del rectángulo a × b, sin contar los extremos
    let toca = 0; for (let x = 1; x < b; x++) if ((a * x) % b === 0) toca++;
    assert.equal(P.puntosDiagonal, toca, `${a} × ${b}: puntos de la diagonal`);
    const n = ent(2, 600), E = M.euler(n);
    let cuenta = 0; for (let j = 1; j <= n; j++) if (gcd(j, n) === 1) cuenta++;
    assert.equal(E.phi, cuenta, `φ(${n})`); assert.equal(E.formula.reduce((s, x) => s * x.factor, 1), cuenta);
    erroresDistintos(E.errores, E.phi, `euler ${n}`);
  }
  for (let p = 2; p <= 200; p++) { const w = M.wilson(p); assert.equal(w.menosUno, primoBruto(p), `Wilson ${p}`); }
  const pares = Array.from({ length: 4 }, () => [ent(2, 30), ent(2, 30)]);
  const PP = M.parejasPesi(pares); erroresDistintos(PP.errores, PP.cantidad, 'parejas');
});
test('criterios de divisibilidad, cifras sobrantes y la cifra que falta', () => {
  for (let k = 0; k < N; k++) {
    const n = ent(0, 999999);
    for (const d of [2, 3, 4, 5, 8, 9, 10, 11, 25]) {
      const c = M.criterio(n, d);
      assert.equal(c.divisible, n % d === 0, `${n} entre ${d}`);
      if (d === 3 || d === 9) assert.equal(c.dato % d === 0, c.divisible, `${n}: la suma de cifras decide`);
      if (d === 11) assert.equal(((c.alterna % 11) + 11) % 11 === 0, c.divisible, `${n}: la suma alternada decide`);
      for (const v of Object.values(c.errores)) assert.notEqual(v, c.divisible, `${n} entre ${d}: una regla errónea que coincide no se lista`);
    }
    if (n >= 1) { const z = M.cifrasNueve(n); assert.equal(z.resto, n % 9); assert.equal(z.resto3, n % 3);
      assert.equal(z.lugares.reduce((s, l) => s + l.cifra * l.potencia, 0), n); z.lugares.forEach(l => assert.equal(l.nueves % 9, 0)); }
  }
  for (let k = 0; k < 100; k++) {
    const pat = String(ent(1, 9)) + 'a' + String(ent(0, 99)).padStart(2, '0'), d = ent(2, 13), f = M.cifraFaltante(pat, d);
    for (let a = 0; a <= 9; a++) assert.equal(f.cifras.includes(a), Number(pat.replace('a', a)) % d === 0, `${pat} entre ${d}`);
  }
});
test('restos: producto y suma por la esquina; potencias por el ciclo coinciden con BigInt', () => {
  for (let k = 0; k < N; k++) {
    const a = ent(0, 5000), b = ent(0, 5000), n = ent(2, 40);
    const p = M.restoProducto(a, b, n); assert.equal(p.resto, (a * b) % n); assert.equal(p.directo, p.resto);
    assert.equal(p.qa * n + p.ra, a); assert.equal(p.qb * n + p.rb, b); erroresDistintos(p.errores, p.resto, `producto ${a}·${b} mod ${n}`);
    const s = M.restoSuma(a, b, n); assert.equal(s.resto, (a + b) % n); erroresDistintos(s.errores, s.resto, `suma ${a}+${b} mod ${n}`);
    const base = ent(0, 60), e = ent(1, 3000), r = M.restoPotencia(base, e, n);
    assert.equal(r.resto, Number((BigInt(base) ** BigInt(e)) % BigInt(n)), `${base}^${e} mod ${n}`);
    erroresDistintos(r.errores, r.resto, `potencia ${base}^${e} mod ${n}`);
    const R = M.restosPotenciales(base, n);
    R.secuencia.forEach((x, j) => assert.equal(x, Number((BigInt(base) ** BigInt(j + 1)) % BigInt(n))));
    assert.equal(R.anteperiodo.length + R.ciclo.length, R.secuencia.length);
    const rl = M.reloj(base, n, 12); rl.posiciones.forEach(q => assert.equal(q.hora, Number((BigInt(base) ** BigInt(q.k)) % BigInt(n))));
  }
});
test('diofánticas: todas las soluciones y ninguna más', () => {
  for (let k = 0; k < N; k++) {
    const a = ent(1, 12), b = ent(1, 12), c = ent(0, 200), m = ent(0, 1), D = M.diofantica(a, b, c, m);
    const todas = []; for (let x = m; a * x <= c; x++) for (let y = m; a * x + b * y <= c; y++) if (a * x + b * y === c) todas.push([x, y]);
    assert.deepEqual(D.soluciones, todas, `${a}x + ${b}y = ${c}`);
    assert.equal(D.tiene, c % gcd(a, b) === 0);
    for (let j = 1; j < todas.length; j++) assert.deepEqual([todas[j][0] - todas[j - 1][0], todas[j - 1][1] - todas[j][1]], D.paso);
    erroresDistintos(D.errores, D.cantidad, `diofántica ${a} ${b} ${c}`);
  }
  for (let n = 0; n <= 8; n++) { const r = M.numeroConDivisores(2, 3, 2 * (n + 1)); assert.equal(r.n, n); assert.equal(M.divisores(r.numero).cantidad, 2 * (n + 1)); }
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => M.factores(0), /mayor o igual/);
  assert.throws(() => M.divisores(2.5), /entero/);
  assert.throws(() => M.tabla(2 * 3 * 5 * 7), /tres primos/);
  assert.throws(() => M.rectangulo(12, 0), /filas/);
  assert.throws(() => M.criterio(120, 7), /criterio/);
  assert.throws(() => M.cifraFaltante('7b42', 11), /patrón/);
  assert.throws(() => M.restoPotencia(2, 0, 7), /mayor o igual/);
  assert.throws(() => M.numeroConDivisores(4, 3, 12), /primo/);
  assert.throws(() => M.numeroConDivisores(2, 6, 12), /múltiplo/);
  assert.throws(() => M.criba(1), /mayor o igual/);
  assert.throws(() => M.parejasPesi([]), /lista/);
  assert.throws(() => M.divisores(1e9), /grande/);
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
});
for (const p of (papel && papel.problemas) || []) test(`papel ${p.id}: la respuesta coincide con el motor`, () => {
  for (const x of p.verificar) comprobar(x.fn, x.args, x.espera, p.id);
});
