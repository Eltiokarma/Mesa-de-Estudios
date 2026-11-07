// Pruebas del motor de «Las fichas en los aros». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, contra cuentas hechas de otra manera (conjuntos de JavaScript al azar y conteo directo):
//    inclusión-exclusión con 2 y 3 conjuntos; leyes de De Morgan; |P(A)| = 2ⁿ y P(A) sin repetidos; |A × B| = |A|·|B|;
//    las regiones que resuelve el motor reproducen los datos y no son negativas; el dibujo (fichas en su región, sin
//    encimarse, lejos de los bordes y del rótulo); ningún error típico da la respuesta correcta ni dos errores lo mismo.
//    Bordes: el vacío, A = B, B ⊂ A y disjuntos.
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
const campo = (r, k) => (k === 'valor' && (typeof r !== 'object' || r === null || Array.isArray(r)) ? r : k.split('.').reduce((o, p) => (o == null ? undefined : o[p]), r));
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
  assert.equal(datos.plantilla, 'conjuntos');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 22);
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
const ser = v => JSON.stringify(v);
function erroresDistintos(errores, correcta, que) {
  const vals = Object.values(errores).map(ser);
  for (const [k, e] of Object.entries(errores)) assert.notEqual(ser(e), ser(correcta), `${que}: el error ${k} da la respuesta correcta`);
  assert.equal(new Set(vals).size, vals.length, `${que}: dos errores dan lo mismo`);
}
// conjuntos al azar dentro de U = {0, …, u − 1}, contados con Set de JavaScript
const azar = (u, p) => Array.from({ length: u }, (_, i) => i).filter(() => rnd() < p);
const S = a => new Set(a);
const cuenta = (u, f) => Array.from({ length: u }, (_, i) => i).filter(f).length;

test('inclusión-exclusión con 2 y 3 conjuntos, contra el conteo directo', () => {
  for (let t = 0; t < 600; t++) {
    const u = ent(0, 25), A = azar(u, rnd()), B = azar(u, rnd()), C = azar(u, rnd()), sa = S(A), sb = S(B), sc = S(C);
    const nU2 = cuenta(u, x => sa.has(x) || sb.has(x)), nI2 = cuenta(u, x => sa.has(x) && sb.has(x));
    assert.equal(M.union(A, B).length, nU2); assert.equal(M.interseccion(A, B).length, nI2);
    assert.equal(M.alMenosUno(A.length, B.length, nI2).respuesta, nU2);
    const nU3 = cuenta(u, x => sa.has(x) || sb.has(x) || sc.has(x));
    const AB = cuenta(u, x => sa.has(x) && sb.has(x)), AC = cuenta(u, x => sa.has(x) && sc.has(x)), BC = cuenta(u, x => sb.has(x) && sc.has(x));
    const ABC = cuenta(u, x => sa.has(x) && sb.has(x) && sc.has(x));
    assert.equal(A.length + B.length + C.length - AB - AC - BC + ABC, nU3);
    const R = M.ningunoTres({ U: u, A: A.length, B: B.length, C: C.length, AB, AC, BC, ABC });
    assert.equal(R.union, nU3); assert.equal(R.respuesta, u - nU3);
    erroresDistintos(R.errores, R.respuesta, 'ningunoTres');
    // las regiones del motor, contra el conteo directo de cada región
    const reg = R.regiones;
    for (const z of M.ZONAS[3]) assert.equal(reg[z], cuenta(u, x => (sa.has(x) === z.includes('A')) && (sb.has(x) === z.includes('B')) && (sc.has(x) === z.includes('C'))), 'región ' + z);
  }
});

test('leyes de De Morgan y propiedades de las operaciones', () => {
  for (let t = 0; t < 400; t++) {
    const u = ent(0, 15), U = Array.from({ length: u }, (_, i) => i), A = azar(u, rnd()), B = azar(u, rnd());
    assert.deepEqual(M.complemento(M.union(A, B), U), M.interseccion(M.complemento(A, U), M.complemento(B, U)));
    assert.deepEqual(M.complemento(M.interseccion(A, B), U), M.union(M.complemento(A, U), M.complemento(B, U)));
    assert.deepEqual(M.diferencia(A, B), M.interseccion(A, M.complemento(B, U)));
    assert.deepEqual(M.diferenciaSimetrica(A, B), M.diferencia(M.union(A, B), M.interseccion(A, B)));
    assert.ok(M.incluido(M.interseccion(A, B), A) && M.incluido(A, M.union(A, B)));
    assert.ok(M.incluido([], A), 'el vacío es subconjunto de todo conjunto');
    assert.equal(M.disjuntos(M.diferencia(A, B), B), true);
    assert.equal(M.iguales(A, B), A.length === B.length && A.every((x, i) => x === B[i]));
    // las zonas de cada operación tienen exactamente los elementos del resultado
    const L = { A, B, U }, zona = x => (A.includes(x) ? 'A' : '') + (B.includes(x) ? 'B' : '');
    for (const op of ['AuB', 'AnB', 'A-B', 'B-A', 'AdB', 'noAuB']) {
      const zs = M.zonasOperacion(op, 2), r = M.operar(op, L);
      assert.deepEqual(r.elementos, U.filter(x => zs.includes(zona(x))), op);
    }
  }
});

test('conjunto potencia: 2ⁿ subconjuntos distintos, todos incluidos; el árbol da los mismos; un elemento más duplica', () => {
  for (let n = 0; n <= 8; n++) {
    const A = Array.from({ length: n }, (_, i) => 10 + i), P = M.potencia(A);
    assert.equal(P.cantidad, 2 ** n); assert.equal(P.propios, 2 ** n - 1);
    assert.equal(P.lista.length, 2 ** n);
    assert.equal(new Set(P.lista.map(M.clave)).size, 2 ** n, 'sin repetidos');
    assert.ok(P.lista.every(s => M.incluido(s, A)));
    assert.ok(M.pertenece([], P.lista) && M.pertenece(A, P.lista), 'el vacío y A mismo');
    assert.equal(P.porTamano.reduce((a, b) => a + b, 0), 2 ** n);
    if (n <= 6) {
      const T = M.arbol(A);
      assert.equal(T.cantidad, 2 ** n);
      assert.deepEqual(M.conjunto(T.hojas), P.lista);
      assert.deepEqual(T.hojas[0], A); assert.deepEqual(T.hojas[T.hojas.length - 1], []);
      T.niveles.forEach((v, k) => assert.equal(v.length, 2 ** k));
    }
    if (n >= 1) { const Q = M.cuantosSubconjuntos(n); assert.deepEqual(Q.respuesta, [2 ** n, 2 ** n - 1]); erroresDistintos(Q.errores, Q.respuesta, 'subconjuntos ' + n); }
    const G = M.agregarElemento(n); assert.equal(G.despues, 2 * G.antes); erroresDistintos(G.errores, G.respuesta, 'agregar ' + n);
    assert.deepEqual(M.elementosPorSubconjuntos(2 ** n), { posible: true, n });
    assert.deepEqual(M.elementosPorSubconjuntos(2 ** n - 1, true), { posible: true, n });
  }
  assert.equal(M.potenciaCantidad(100).cantidadTexto.replace(/ /g, ''), (2n ** 100n).toString());
  assert.equal(M.potencia(Array.from({ length: 20 }, (_, i) => i)).lista, null, 'no lista más de 2¹² subconjuntos');
});

test('producto cartesiano: |A × B| = |A|·|B|, pares distintos y ordenados', () => {
  for (let t = 0; t < 200; t++) {
    const A = azar(8, rnd()), B = azar(8, rnd()), C = M.cartesiano(A, B);
    assert.equal(C.n, A.length * B.length);
    assert.equal(new Set(C.pares.map(M.clave)).size, C.n);
    assert.ok(C.pares.every(p => A.includes(p.par[0]) && B.includes(p.par[1])));
    if (C.n) { const Q = M.cuantosPares(A, B); assert.equal(Q.respuesta, C.n); erroresDistintos(Q.errores, Q.respuesta, 'pares'); }
  }
  assert.equal(M.parIgual({ par: [2, 3] }, { par: [3, 2] }), false);
  assert.equal(M.parIgual({ par: [2, 3] }, { par: [2, 3] }), true);
  assert.equal(M.cartesiano([], [1, 2]).n, 0);
});

test('regiones desde datos de academia: reproducen los datos y nunca son negativas', () => {
  const claves2 = ['A', 'B', 'AB', 'U', 'soloA', 'soloB', 'ninguno', 'union', 'exactamenteUno', 'noA', 'noB', 'AmenosB'];
  const claves3 = ['A', 'B', 'C', 'AB', 'AC', 'BC', 'ABC', 'U', 'ninguno', 'union', 'exactamenteUno', 'exactamenteDos', 'soloA', 'soloBC', 'noAB'];
  for (let t = 0; t < 800; t++) {
    const n = rnd() < 0.5 ? 2 : 3, reg = {}; M.ZONAS[n].forEach(z => { reg[z] = ent(0, 12); });
    const ks = (n === 2 ? claves2 : claves3).filter(() => rnd() < 0.6);
    if (!ks.length) continue;
    const d = { conjuntos: n }; ks.forEach(k => { d[k] = M.contar(reg, k); });
    const R = M.regiones(d);
    assert.ok(R.posible, JSON.stringify(d));
    for (const z of M.ZONAS[n]) if (R.regiones[z] !== null) { assert.equal(R.regiones[z], reg[z], 'región fija ' + z); assert.ok(R.regiones[z] >= 0); }
    if (R.determinado) ks.forEach(k => assert.equal(R.cardinales[k] !== undefined ? R.cardinales[k] : M.contar(R.regiones, k), d[k]));
    // con todas las regiones dadas como datos, queda todo determinado
    const todo = { conjuntos: n }; M.ZONAS[n].forEach(z => { todo[z === '' ? 'ninguno' : 'solo' + z] = reg[z]; });
    assert.ok(M.regiones(todo).determinado);
    // un dato cambiado a un valor que deja una región negativa → imposible, con la razón
    const malo = M.regiones({ conjuntos: n, A: 3, AB: 4 });
    assert.equal(malo.posible, false); assert.match(malo.razon, /imposible/);
  }
});

test('errores de las predicciones con datos al azar: distintos entre sí y de la correcta', () => {
  for (let t = 0; t < 2000; t++) {
    const ab = ent(0, 20), a = ab + ent(0, 30), b = ab + ent(0, 30), fuera = ent(0, 15);
    const R1 = M.alMenosUno(a, b, ab); assert.equal(R1.respuesta, a + b - ab); erroresDistintos(R1.errores, R1.respuesta, 'alMenosUno');
    const R2 = M.soloUno(a, b, ab); assert.equal(R2.respuesta, a - ab); erroresDistintos(R2.errores, R2.respuesta, 'soloUno');
    const U = a + b - ab + fuera, R3 = M.interseccionPorComplemento(U, a, b, fuera); assert.equal(R3.respuesta, ab); erroresDistintos(R3.errores, R3.respuesta, 'complemento');
    const A = azar(9, rnd()), B = azar(9, rnd()), R4 = M.diferencias(A, B);
    assert.deepEqual(R4.respuesta, M.diferencia(B, A)); erroresDistintos(Object.fromEntries(Object.entries(R4.errores).map(([k, v]) => [k, M.clave(v)])), M.clave(R4.respuesta), 'diferencias');
  }
});

test('bordes: el vacío, A = B, B ⊂ A y disjuntos', () => {
  const A = [1, 2, 3];
  assert.deepEqual(M.union([], A), A); assert.deepEqual(M.interseccion([], A), []);
  assert.deepEqual(M.union(A, A), A); assert.deepEqual(M.interseccion(A, A), A); assert.deepEqual(M.diferencia(A, A), []); assert.deepEqual(M.diferenciaSimetrica(A, A), []);
  assert.ok(M.incluido(A, A) && M.iguales([3, 1, 2, 2], A));
  assert.deepEqual(M.union(A, [2]), A); assert.deepEqual(M.interseccion(A, [2]), [2]);
  assert.ok(M.disjuntos([1, 2], [3, 4]) && !M.disjuntos(A, [3]));
  assert.equal(M.texto([]), '∅'); assert.equal(M.texto([[]]), '{∅}'); assert.equal(M.texto([2, 1, [3]]), '{1, 2, {3}}');
  assert.equal(M.potencia([]).cantidad, 1); assert.equal(M.potencia([]).propios, 0);
  assert.equal(M.alMenosUno(8, 8, 8).respuesta, 8);   // A = B
  assert.equal(M.alMenosUno(20, 8, 8).respuesta, 20); // B ⊂ A
  assert.equal(M.alMenosUno(14, 11, 0).respuesta, 25);// disjuntos
  assert.equal(M.afirmar(4, '⊂', A), false, 'un número no es un conjunto');
  assert.equal(M.nombreZona('', 2), 'fuera de los dos aros'); assert.equal(M.nombreZona('AB', 2), 'dentro de A y de B');
  assert.equal(M.nombreZona('A', 3), 'dentro de A, fuera de B y de C');
  assert.deepEqual(M.deFichas([{ en: ['B', 'A'] }, { en: [] }, 'A'], 2), { A: 1, B: 0, AB: 1, '': 1 });
});

test('dibujo: cada ficha en su región, sin encimarse, lejos de los bordes de los aros y del rótulo', () => {
  const geos = [];
  for (const W of [300, 336, 420, 700]) {
    geos.push(M.aros(2, W, 290, {}), M.aros(2, W, 312, { banca: 44 }), M.aros(2, W, 290, { relacion: 'dentro' }), M.aros(2, W, 290, { relacion: 'separados' }),
      M.aros(3, W, 350, {}), M.aros(3, W, 380, { abajo: 30 }), M.carroll(2, W, 270, {}), M.carroll(3, W, 300, { abajo: 30 }));
  }
  for (const g of geos) for (let t = 0; t < 12; t++) {
    const cuentas = {}; g.zonas.forEach(z => { cuentas[z] = ent(0, t < 6 ? 6 : 14); });
    if (g.tipo === 'venn' && g.aros[1] && g.aros[1].r < g.aros[0].r) cuentas.B = 0; // B dentro de A: no hay «solo B»
    if (g.tipo === 'venn' && Math.hypot(g.aros[0].x - g.aros[1].x, 0) > g.aros[0].r + g.aros[1].r && g.n === 2) cuentas.AB = 0; // separados
    const L = M.layout(g, cuentas, { rotulos: true, radio: 11, radioRotulo: 11 });
    const todos = [];
    for (const [z, ps] of Object.entries(L.pos)) {
      if (L.ok) assert.equal(ps.length, cuentas[z] || 0, `${g.tipo} ${g.W}: cantidad en ${z}`);
      for (const p of ps) {
        assert.equal(M.zonaDe(g, p), z, 'en su región');
        assert.ok(M.libre(g, p, L.radio), 'lejos de los bordes');
        todos.push(p);
        for (const r of Object.values(L.rotulo)) assert.ok(Math.hypot(p.x - r.x, p.y - r.y) >= L.radio + r.r - 1e-9, 'lejos del rótulo');
      }
    }
    for (let i = 0; i < todos.length; i++) for (let j = i + 1; j < todos.length; j++)
      assert.ok(Math.hypot(todos[i].x - todos[j].x, todos[i].y - todos[j].y) >= 2 * L.radio - 1e-9, 'fichas encimadas');
  }
  // las cuentas de las predicciones caben a 336 px (el celular)
  assert.ok(M.layout(M.aros(2, 336, 290, {}), { A: 18, AB: 7, B: 11 }, { rotulos: true }).ok);
  assert.ok(M.layout(M.aros(2, 336, 342, { banca: 44, abajo: 30 }), { '': 6, A: 18, AB: 10, B: 11 }, { rotulos: true }).ok);
  assert.ok(M.layout(M.aros(3, 336, 380, { abajo: 30 }), { A: 15, B: 12, C: 9, AB: 7, AC: 5, BC: 3, ABC: 3, '': 6 }, { rotulos: true, radio: 8 }).ok);
  assert.ok(M.layout(M.aros(2, 336, 320, { relacion: 'dentro', abajo: 30 }), { A: 12, AB: 8 }, { rotulos: true }).ok);
  assert.ok(M.layout(M.aros(2, 336, 320, { relacion: 'separados', abajo: 30 }), { A: 14, B: 11 }, { rotulos: true }).ok);
  assert.ok(M.layout(M.aros(2, 336, 312, { banca: 44 }), { '': 8 }, { rotulos: true }).ok);
  assert.equal(M.zonaDe(M.aros(2, 336, 290, {}), { x: -5, y: 10 }), null);
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => M.regiones({}), /faltan los datos/);
  assert.throws(() => M.regiones({ A: -1 }), /mayor o igual que 0/);
  assert.throws(() => M.regiones({ A: 2.5 }), /entero/);
  assert.throws(() => M.regiones({ X: 2 }), /desconocido/);
  assert.throws(() => M.regiones({ conjuntos: 2, C: 2 }), /no hay conjunto C/);
  assert.throws(() => M.alMenosUno(5, 3, 6), /imposible/);
  assert.throws(() => M.complemento([10], [1, 2]), /universo/);
  assert.throws(() => M.conjunto('abc'), /lista/);
  assert.throws(() => M.clave({}), /no válido/);
  assert.throws(() => M.clave(NaN), /finito/);
  assert.throws(() => M.afirmar(1, '≈', [1]), /relación/);
  assert.throws(() => M.cuantosSubconjuntos(0), /entre 1 y 20/);
  assert.throws(() => M.aros(4, 300, 300), /2 o 3/);
  assert.throws(() => M.layout(M.aros(2, 300, 300), { X: 3 }), /zona desconocida/);
  assert.throws(() => M.zonasOperacion('AnBnC', 2), /desconocida/);
  assert.throws(() => M.arbol([1, 2, 3, 4, 5, 6, 7]), /hasta con 6/);
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
    const todo = [p.enunciado, p.respuesta, ...p.pasos].join(' ');
    assert.ok(!/<[a-z]/i.test(todo), `${p.id}: la app muestra texto plano, sin HTML`);
    assert.ok(!/\d\.\d/.test(todo), `${p.id}: se escribe con coma decimal`);
    assert.ok(!/·/.test(todo), `${p.id}: un solo signo de producto (×)`);
  }
  // la indicación y el título no adelantan lo que miden las predicciones
  assert.ok(!/dos veces|rest|sum|2ⁿ|potencia|vac|orden|solo|al menos|intersecc/i.test(papel.indicacion));
  assert.ok(!/dos veces|rest|sum|2ⁿ|vac|orden/i.test(papel.titulo));
});
for (const p of (papel && papel.problemas) || []) test(`papel ${p.id}: la respuesta coincide con el motor`, () => {
  for (const x of p.verificar) comprobar(x.fn, x.args, x.espera, p.id);
});
