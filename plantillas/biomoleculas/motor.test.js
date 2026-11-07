// Pruebas del motor de El taller de las piezas (biomoléculas). Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades: la condensación conserva la masa contando el agua (Σ Mᵢ = M + 18(n − 1)) y los átomos; la hidrólisis
//    devuelve las piezas; la cadena de n tiene n − 1 uniones; el polisacárido tiende a 162 por glucosa; el triglicérido es
//    una cadena de 4 piezas; el índice de saponificación baja con la masa y el de yodo es cero sin dobles enlaces; la
//    hidrogenación no cambia los carbonos; el plegado solo tiene atracciones débiles plegado y sus vecinos están a 1;
//    en la celulosa cada glucosa va girada; ningún error típico coincide con la respuesta en las predicciones de la escena.
// 3. Errores de entrada.
// 4. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
const TOL = datos.tolerancia;
function cerca(real, esperado, que) {
  assert.ok(Math.abs(real - esperado) <= TOL * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
const campo = (r, k) => (k === 'valor' && typeof r === 'number' ? r : k.split('.').reduce((o, p) => (o == null ? o : o[p]), r));
function igual(x, v, que) {
  if (typeof v === 'number') { assert.equal(typeof x, 'number', que); cerca(x, v, que); }
  else if (Array.isArray(v)) { assert.ok(Array.isArray(x) && x.length === v.length, `${que}: largo`); v.forEach((e, i) => igual(x[i], e, `${que}[${i}]`)); }
  else assert.deepEqual(x, v, que);
}
function comprobar(fn, args, espera, que) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  const r = motor[fn](...args);
  for (const [k, v] of Object.entries(espera)) {
    const x = campo(r, k);
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    igual(x, v, `${que} · ${k}`);
  }
}

// 1. casos.json
test('casos.json: al menos 20 casos con nombre y la verificación pendiente o hecha', () => {
  assert.ok(datos.casos.length >= 20);
  assert.equal(typeof datos.verificacion, 'string');
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && c.espera && Array.isArray(c.args));
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
const AZ = ['glucosa', 'fructosa', 'galactosa'], AA = ['Gly', 'Ala', 'Ser', 'Val', 'Cys', 'Leu', 'Phe'];
const AG = ['palmitico', 'estearico', 'oleico', 'linoleico', 'linolenico'];
function azar(semilla) { let a = semilla >>> 0; return () => { a = (a * 1664525 + 1013904223) >>> 0; return a / 4294967296; }; }
const elegir = (rnd, xs, n) => Array.from({ length: n }, () => xs[Math.floor(rnd() * xs.length)]);

test('condensar: Σ Mᵢ = M + 18(n − 1), y los átomos cuadran (cada unión saca 2 H y 1 O)', () => {
  const rnd = azar(7);
  for (let k = 0; k < 200; k++) {
    const ps = elegir(rnd, k % 2 ? AA : AZ, 1 + Math.floor(rnd() * 12));
    const r = motor.condensar(ps);
    assert.equal(r.uniones, ps.length - 1); assert.equal(r.aguas, r.uniones);
    cerca(r.masaPiezas, r.M + 18 * r.uniones, 'masa');
    const suma = {};
    for (const p of ps) for (const [e, n] of Object.entries(motor.formula(motor.PIEZAS[p].formula))) suma[e] = (suma[e] || 0) + n;
    assert.equal(r.formula.H, suma.H - 2 * r.uniones); assert.equal(r.formula.O, suma.O - r.uniones);
    assert.equal(r.formula.C, suma.C); assert.equal(r.formula.N || 0, suma.N || 0);
    cerca(motor.masa(r.formula), r.M, 'la masa sale de la fórmula');
  }
});
test('hidrólisis: devuelve las piezas y consume un agua por unión; con gramos, la masa se conserva', () => {
  const rnd = azar(11);
  for (let k = 0; k < 100; k++) {
    const ps = elegir(rnd, AZ, 2 + Math.floor(rnd() * 8)), g = 10 + Math.floor(rnd() * 900);
    const h = motor.hidrolisis(ps, g), c = motor.condensar(ps);
    assert.deepEqual(h.productos.map(p => p.id), ps);
    cerca(h.masaProductos, c.masaPiezas, 'masa por mol');
    cerca(h.gramosProductos, g + h.gramosAgua, 'masa en gramos');
  }
});
test('la cadena de n tiene n − 1 enlaces, sea de azúcares o de aminoácidos', () => {
  for (let n = 1; n <= 30; n++) {
    assert.equal(motor.enlacesCadena(n).enlaces, n - 1);
    assert.equal(motor.peptido(Array(n).fill('Gly')).enlacesPeptidicos, n - 1);
    assert.equal(motor.sacarido(Array(n).fill('glucosa')).aguas, n - 1);
  }
  assert.equal(motor.peptido(Array(11).fill('Ala')).tipo, 'polipéptido');
  assert.equal(motor.sacarido(Array(11).fill('glucosa')).tipo, 'polisacárido');
});
test('polisacárido: M = 162n + 18, coincide con la cadena de glucosas y se acerca a 162n', () => {
  for (const n of [2, 3, 7, 20, 50]) cerca(motor.polisacarido(n).M, motor.sacarido(Array(n).fill('glucosa')).M, `n ${n}`);
  for (const n of [100, 1000, 10000]) { const p = motor.polisacarido(n); assert.ok((p.M - p.Mformula) / p.M < 0.002); }
});
test('triglicérido = cadena de glicerol y 3 ácidos; los índices bajan con la masa; yodo cero sin dobles enlaces', () => {
  for (const a of AG) {
    const t = motor.trigliceridoDe(a);
    cerca(t.M, motor.condensar(['glicerol', a, a, a]).M, a);
    cerca(t.indiceSaponificacion * t.M, 3 * 56 * 1000, a);
    if (motor.PIEZAS[a].dobles === 0) assert.equal(t.indiceYodo, 0); else assert.ok(t.indiceYodo > 0);
    const s = motor.saponificacion(a); assert.ok(s.conserva, a);
    const h = motor.hidrogenar(a);
    assert.equal(h.Mdespues - h.Mantes, h.masaGanada); assert.equal(h.yodoDespues, 0);
    assert.equal(motor.trigliceridoDe(a).formula.C, motor.trigliceridoDe(h.producto === 'tripalmitina' ? 'palmitico' : 'estearico').formula.C);
  }
  const ordenM = AG.map(a => motor.trigliceridoDe(a)).sort((p, q) => p.M - q.M);
  for (let i = 1; i < ordenM.length; i++) assert.ok(ordenM[i].indiceSaponificacion <= ordenM[i - 1].indiceSaponificacion);
  const y = ['estearico', 'oleico', 'linoleico', 'linolenico'].map(a => motor.trigliceridoDe(a).indiceYodo);
  for (let i = 1; i < y.length; i++) assert.ok(y[i] > y[i - 1], 'más dobles enlaces, más yodo');
});
test('plegado: vecinos de cadena a distancia 1; contactos solo plegada, a distancia 1 y no consecutivos', () => {
  for (let n = 4; n <= 20; n++) {
    for (const p of [0, 0.3, 1]) {
      const g = motor.plegado(n, p);
      if (p === 0 || p === 1) for (const [i, j] of g.enlaces) cerca(Math.hypot(g.pos[i].x - g.pos[j].x, g.pos[i].y - g.pos[j].y), 1, `n ${n}`);
      if (p > 0) assert.equal(g.contactos.length, 0);
    }
    const g = motor.plegado(n, 0);
    for (const [i, j] of g.contactos) { assert.ok(j - i >= 2); cerca(Math.hypot(g.pos[i].x - g.pos[j].x, g.pos[i].y - g.pos[j].y), 1, 'contacto'); }
    assert.equal(motor.desnaturalizar(n).antes.debiles, g.contactos.length);
  }
});
test('almidón y celulosa: mismas glucosas; en la celulosa cada una va girada media vuelta y la cadena es recta', () => {
  const a = motor.cadenaPolisacarido('almidon', 8), c = motor.cadenaPolisacarido('celulosa', 8);
  assert.ok(a.every(u => u.giro === 0)); assert.ok(a.some(u => Math.abs(u.y) > 0.1));
  c.forEach((u, i) => { assert.equal(u.y, 0); assert.equal(u.giro, i % 2 ? Math.PI : 0); });
  assert.equal(motor.digerir('almidon').monomero, motor.digerir('celulosa').monomero);
  assert.notEqual(motor.digerir('almidon').corta, motor.digerir('celulosa').corta);
});

// Las predicciones de la escena: ningún error típico da la respuesta correcta, y las opciones son distintas.
test('predicciones de la escena: cada error da algo distinto de la respuesta', () => {
  const s = motor.sacarido(['glucosa', 'fructosa']);
  assert.equal(new Set([s.M, s.errores['no-resta-agua'], s.errores['n-aguas'], s.errores['fusion-mismo-tamano']]).size, 4, 'sacarosa');
  const p = motor.peptido(['Gly', 'Ala', 'Ser']), par = o => `${o.enlaces}/${o.aguas}`;
  assert.equal(new Set([par({ enlaces: p.enlacesPeptidicos, aguas: p.aguas }), par(p.errores['n-enlaces']), par(p.errores['sin-agua']), par(p.errores.mezcla)]).size, 4, 'tripéptido');
  const d = motor.desnaturalizar(12);
  assert.equal(d.despues.peptidicos, d.antes.peptidicos); assert.equal(d.despues.debiles, 0);
  assert.notEqual(d.errores['separa-aminoacidos'].piezas, d.despues.piezas); assert.equal(d.errores['proteina-rigida'].cambia, false);
  const dg = motor.digerir('celulosa');
  assert.equal(dg.corta, false); assert.equal(dg.monomero, 'glucosa'); assert.equal(dg.errores['misma-glucosa-se-digiere'], true);
  // ¿Qué pasa si…?
  const h = motor.hidrolisis(['glucosa', 'fructosa'], 342);
  assert.equal(new Set([h.productos[0].gramos, h.errores['sin-agua'], h.errores['resta-agua'], h.errores['todo-glucosa']]).size, 4, 'hidrólisis');
  const q = motor.polisacarido(1000), e = q.errores;
  assert.equal(new Set([`${q.aguas}/${q.M}`, `${e['n-aguas'].aguas}/${e['n-aguas'].M}`, `${e['sin-agua'].aguas}/${e['sin-agua'].M}`, `${e['un-agua'].aguas}/${e['un-agua'].M}`]).size, 4, '1000 glucosas');
  const c = motor.compararSaponificacion('palmitico', 'estearico');
  assert.equal(new Set([c.mayor, c.errores['crece-con-M'], c.errores['iguales-por-mol'], c.errores['confunde-con-yodo']]).size, 4, 'saponificación');
  const g = motor.hidrogenar('oleico'), ge = g.errores;
  assert.equal(new Set([`${g.H2}/${g.yodoDespues}`, `${ge['cuenta-H-como-H2'].H2}/${ge['cuenta-H-como-H2'].yodo}`, `${ge['yodo-mide-masa'].H2}/${ge['yodo-mide-masa'].yodo}`, `${ge['yodo-sube-con-masa'].H2}/${ge['yodo-sube-con-masa'].yodo}`]).size, 4, 'hidrogenación');
  const v = motor.porcion('vitaminas');
  assert.equal(v.kcal, 0); assert.ok(v.errores['se-queman-como-azucar'] > 0);
  assert.ok(motor.porcion('azucar').kcal > 0);
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.pieza('sacarosa'), /desconocida/);
  assert.throws(() => motor.formula('c6h12o6'), /no entiendo/);
  assert.throws(() => motor.formula('C6Xx2'), /sin masa/);
  assert.throws(() => motor.condensar([]), /lista/);
  assert.throws(() => motor.sacarido(['glucosa', 'Gly']), /monosacáridos/);
  assert.throws(() => motor.peptido(['Gly', 'glucosa']), /aminoácidos/);
  assert.throws(() => motor.polisacarido(1), /al menos 2/);
  assert.throws(() => motor.polisacarido(10, 'quitina'), /desconocido/);
  assert.throws(() => motor.hidrolisis(['glucosa', 'glucosa'], -3), /positivos/);
  assert.throws(() => motor.trigliceridoDe(['oleico', 'oleico']), /tres/);
  assert.throws(() => motor.trigliceridoDe('glucosa'), /ácido graso/);
  assert.throws(() => motor.saponificacion('oleico', 10, 'LiOH'), /NaOH o KOH/);
  assert.throws(() => motor.secuencias(3, 4), /no puede pasar/);
  assert.throws(() => motor.desnaturalizar(2), /al menos 4/);
  assert.throws(() => motor.digerir('almidon', 'pepsina'), /desconocida/);
  assert.throws(() => motor.energia({ fibra: 3 }), /desconocido/);
});

// 4. Problemas de papel (regla 6)
const rutaPapel = path.join(__dirname, 'papel.json');
const papel = fs.existsSync(rutaPapel) ? JSON.parse(fs.readFileSync(rutaPapel, 'utf8')) : null;
test('papel.json: entre 5 y 10 problemas, con respuesta, pasos y verificación', () => {
  assert.ok(papel, 'falta papel.json');
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  const ids = new Set();
  for (const p of papel.problemas) {
    assert.ok(p.id && !ids.has(p.id)); ids.add(p.id);
    assert.ok(p.enunciado && p.respuesta && Array.isArray(p.pasos) && p.pasos.length, `${p.id}: falta texto`);
    assert.ok(Array.isArray(p.verificar) && p.verificar.length, `${p.id}: falta verificar`);
    assert.ok(!/<[a-z]/i.test(p.enunciado + p.respuesta + p.pasos.join('')), `${p.id}: la app muestra texto plano, sin HTML`);
  }
});
for (const p of (papel && papel.problemas) || []) test(`papel ${p.id}: la respuesta coincide con el motor`, () => {
  for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id);
});
