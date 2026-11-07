// Pruebas del motor de «El árbol de las funciones: nomenclatura inorgánica». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades: la suma de estados de oxidación por los átomos es la carga de la especie; la fórmula que sale de
//    dos fichas tiene carga cero, con la proporción más simple (el peróxido cuenta como una ficha); el árbol da la
//    función que dice y el estado que se le pidió; el oxácido tiene los átomos del óxido más el agua; cada nombre
//    vuelve a su fórmula (y ningún nombre sirve para dos fórmulas); los errores de cada predicción nunca son un
//    nombre o una fórmula correctos de la misma sustancia.
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
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
const campo = (r, k) => (k === 'valor' ? r : k.split('.').reduce((o, p) => (o == null ? o : o[p]), r));
function comprobar(fn, args, espera, que) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  const r = motor[fn](...args);
  for (const [k, v] of Object.entries(espera)) {
    const x = campo(r, k);
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    cerca(x, v, `${que} · ${k}`);
  }
}

// 1. casos.json
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'nomenclatura-inorganica');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 25);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
const U = motor.universo();
const iones = [...motor.cationes(), ...motor.aniones()];
test('la suma de estados de oxidación por los átomos es la carga, en todo lo que el motor forma y en sus iones', () => {
  for (const f of [...U, ...iones.map(i => i.formula), 'Fe3O4', 'Na2S2O3', 'OF2', 'NH4NO3', 'CuSO4·5H2O', 'FeSO4·7H2O']) {
    const o = motor.oxidacion(f), s = motor.especie(f);
    let n = 0, d = 1;   // suma exacta en fracciones
    for (const [e, [a, b]] of Object.entries(o.porElemento)) { const k = s.atomos[e]; n = n * b + a * k * d; d *= b; const g = motor.mcd(n, d) || 1; n /= g; d /= g; }
    assert.equal(n / d, s.carga, f);
  }
});
test('cada ion de un elemento tiene su estado como carga; cada oxoanión, el estado de su elemento central', () => {
  for (const i of iones) {
    const o = motor.oxidacion(i.formula).valor;
    if (i.tipo === 'metal') assert.equal(o[i.central], i.carga, i.formula);
    if (i.tipo === 'oxoanion') assert.equal(o[i.central], i.estado, i.formula);
  }
});
test('dos fichas: carga cero, proporción más simple y átomos que cuadran; los errores no son la fórmula', () => {
  const cats = motor.cationes().filter(c => c.tipo !== 'proton'), ans = motor.aniones();
  for (const C of cats) for (const A of ans) {
    const r = motor.formulaDeIones(C, A);
    assert.equal(r.nCation * C.carga + r.nAnion * A.carga, 0, r.formula);
    assert.equal(motor.mcd(r.nCation, r.nAnion), 1, `${r.formula}: más simple`);
    const at = motor.atomos(r.formula), esp = {};
    for (const [e, k] of Object.entries(C.atomos)) esp[e] = (esp[e] || 0) + k * r.nCation;
    for (const [e, k] of Object.entries(A.atomos)) esp[e] = (esp[e] || 0) + k * r.nAnion;
    assert.deepEqual(at, esp, r.formula);
    for (const [k, v] of Object.entries(r.errores)) if (v) assert.notEqual(v, r.formula, `${r.formula}: ${k}`);
    // El error de "uno a uno" y el cruce invertido nunca dan carga cero.
    for (const k of ['unoAUno', 'cruceInvertido']) if (r.errores[k]) assert.ok(r.errores[k] !== r.formula);
  }
});
test('el árbol: cada rama da la función que dice, con el estado pedido', () => {
  for (const [e, t] of Object.entries(motor.ESTADOS)) {
    for (const v of t.m || []) {
      const o = motor.formar('oxido', e, v), h = motor.formar('hidroxido', e, v);
      assert.equal(motor.clasificar(o.formula).funcion, 'óxido básico', o.formula);
      assert.equal(motor.oxidacion(o.formula).valor[e], v, o.formula);
      assert.equal(motor.clasificar(h.formula).funcion, 'hidróxido', h.formula);
      assert.equal(motor.oxidacion(h.formula).valor[e], v, h.formula);
    }
    if (e === 'H' || e === 'O') continue;
    for (const v of t.nm || []) {
      const o = motor.oxido(e, v);
      assert.equal(motor.oxidacion(o.formula).valor[e], v, o.formula);
      if ((t.neutros || []).includes(v)) { assert.equal(motor.clasificar(o.formula).funcion, 'óxido neutro'); continue; }
      const a = motor.formar('oxacido', e, v);
      assert.equal(motor.clasificar(a.formula).funcion, 'oxácido', a.formula);
      assert.equal(motor.oxidacion(a.formula).valor[e], v, a.formula);
      // óxido + agua: los átomos del ácido son múltiplo de los del óxido más el agua.
      const ox = motor.atomos(a.oxido), ac = motor.atomos(a.formula), k = ox[e] / ac[e];
      assert.equal(ac.H * k, 2 * a.agua, a.formula); assert.equal(ac.O * k, ox.O + a.agua, a.formula);
    }
  }
});
test('la tradicional: -oso al menor e -ico al mayor; con cuatro estados, hipo-…-oso, -oso, -ico y per-…-ico', () => {
  for (const [e, t] of Object.entries(motor.ESTADOS)) for (const como of ['m', 'nm']) {
    const l = t[como] || []; if (!l.length || (como === 'nm' && t.trad)) continue;
    const ts = l.map(v => motor.terminacion(e, v, como));
    if (l.length === 2) assert.deepEqual(ts.map(x => x.sufijo), ['oso', 'ico'], e);
    if (l.length === 4) assert.deepEqual(ts.map(x => x.prefijo + x.sufijo), ['hipooso', 'oso', 'ico', 'perico'], e);
  }
});
test('cada nombre vuelve a su fórmula y ningún nombre sirve para dos fórmulas', () => {
  const visto = new Map();
  for (const f of U) {
    const n = motor.nombrar(f);
    for (const k of ['sistematica', 'stock', 'tradicional', 'comun']) {
      if (!n[k]) continue;
      const clave = n[k].toLowerCase();
      if (visto.has(clave)) assert.equal(visto.get(clave), f, `«${n[k]}» nombra a ${visto.get(clave)} y a ${f}`);
      visto.set(clave, f);
      assert.equal(motor.formulaDeNombre(n[k]).formula, f, `${k} de ${f}: «${n[k]}»`);
    }
    // Las partes de colores, juntas, son el nombre.
    for (const k of ['sistematica', 'stock', 'tradicional']) if (n[k]) assert.equal(n.partes[k].map(p => p.t).join('').replace(/\s+/g, ' ').trim(), n[k], f);
  }
});
test('los nombres con error nunca son un nombre correcto de la misma sustancia', () => {
  for (const f of [...U, 'FeSO4·7H2O', 'CuSO4·5H2O']) {
    const n = motor.nombrar(f), buenos = [n.sistematica, n.stock, n.tradicional, n.comun].filter(Boolean).map(x => x.toLowerCase());
    for (const [k, v] of Object.entries(n.errores)) if (v) assert.ok(!buenos.includes(v.toLowerCase()), `${f}: ${k} = «${v}»`);
  }
});
test('estado de oxidación: los errores no dan el valor correcto', () => {
  for (const [f, e] of [['Fe2O3', 'Fe'], ['Fe3O4', 'Fe'], ['Al2O3', 'Al'], ['Cl2O7', 'Cl'], ['N2O5', 'N'], ['NH4^+', 'N'], ['SO4^2-', 'S'], ['Cr2O7^2-', 'Cr'], ['PbO2', 'Pb']]) {
    const r = motor.estado(f, e);
    for (const [k, v] of Object.entries(r.errores)) if (v) assert.notEqual(v, r.texto, `${f}: ${k}`);
  }
});
test('descomponer: las fichas de una sal dan sus átomos y su carga cero', () => {
  for (const f of U) {
    const d = motor.descomponer(f); if (!d) continue;
    const C = motor.ion(d.cation), A = motor.ion(d.anion);
    assert.equal(d.nCation * C.carga + d.nAnion * A.carga - d.hidroxidos, 0, f);
  }
});
test('neutralizar: la ecuación tiene los mismos átomos a los dos lados', () => {
  const ac = ['H2SO4', 'HNO3', 'H3PO4', 'H2CO3', 'HClO4', 'HCl', 'H2S'], ba = ['NaOH', 'Ca(OH)2', 'Al(OH)3', 'Fe(OH)3', 'KOH'];
  for (const a of ac) for (const b of ba) {
    const r = motor.neutralizar(a, b), [c1, c2, c3, c4] = r.coefs, tot = (f, c, o) => { for (const [e, k] of Object.entries(motor.atomos(f))) o[e] = (o[e] || 0) + c * k; return o; };
    const izq = tot(b, c2, tot(a, c1, {})), der = tot('H2O', c4, tot(r.sal, c3, {}));
    assert.deepEqual(izq, der, r.ecuacion);
  }
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.atomos('Xx2'), /elemento/);
  assert.throws(() => motor.atomos('Ca(OH2'), /falta/);
  assert.throws(() => motor.formar('oxacido', 'S', 5), /oxácido/);
  assert.throws(() => motor.formar('oxacido', 'C', 2), /neutro/);
  assert.throws(() => motor.formar('hidroxido', 'S', 6), /hidróxido/);
  assert.throws(() => motor.formulaDeIones('SO4^2-', 'Cl^-'), /catión/);
  assert.throws(() => motor.ion('Fe^5+'), /ion/);
  assert.throws(() => motor.formulaDeNombre('óxido de kriptonita'), /nombre/);
  assert.throws(() => motor.estado('Fe2O3', 'S'), /no hay/);
});

// 4. Problemas de papel (regla 6)
const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
test('papel.json: entre 8 y 10 problemas, con respuesta, pasos y verificación', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 8 && papel.problemas.length <= 10);
  const ids = new Set();
  for (const p of papel.problemas) {
    assert.ok(p.id && !ids.has(p.id)); ids.add(p.id);
    assert.ok(p.enunciado && p.respuesta && Array.isArray(p.pasos) && p.pasos.length, `${p.id}: falta texto`);
    assert.ok(Array.isArray(p.verificar) && p.verificar.length, `${p.id}: falta verificar`);
    assert.ok(!/<[a-z]/i.test(p.enunciado + p.respuesta + p.pasos.join('')), `${p.id}: la app muestra texto plano, sin HTML`);
  }
});
for (const p of papel.problemas) test(`papel ${p.id}: la respuesta coincide con el motor`, () => {
  for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id);
});
