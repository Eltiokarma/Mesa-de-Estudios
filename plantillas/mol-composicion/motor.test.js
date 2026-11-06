// Pruebas del motor de Mol, masa molar y composición. Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json, verificado con fracciones exactas y otro método, debe salir igual del motor
//    (regla 2 de CLAUDE.md).
// 2. Coherencia: los porcentajes suman 100; la empírica devuelve los porcentajes de los que salió; moles ida y vuelta;
//    la molecular es múltiplo de la empírica; Proust en cualquier muestra.
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
  assert.ok(Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
const campo = (r, k) => (k === 'valor' && (r === null || typeof r !== 'object') ? r : k.split('.').reduce((o, p) => (o == null ? o : o[p]), r));
function comprobar(fn, args, espera, que) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  const r = motor[fn](...args);
  for (const [k, v] of Object.entries(espera)) {
    const x = campo(r, k); assert.ok(x !== undefined, `${que}: falta ${k}`);
    if (typeof v === 'string') assert.equal(x, v, `${que} · ${k}`); else cerca(x, v, `${que} · ${k}`);
  }
}

// 1. casos.json
test('casos.json: al menos 12 casos con nombre', () => { assert.ok(datos.casos.length >= 12); for (const c of datos.casos) assert.ok(c.nombre && c.fn && c.espera); });
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Coherencia
const FORMULAS = ['H2O', 'CO2', 'CaCO3', 'H2SO4', 'NH4NO3', 'Ca(OH)2', 'Al2(SO4)3', 'C6H12O6', 'Fe2O3', 'CuSO4·5H2O', 'KMnO4'];
test('los porcentajes de cada compuesto suman 100', () => {
  for (const f of FORMULAS) cerca(Object.values(motor.composicion(f).porcentajes).reduce((s, x) => s + x, 0), 100, f);
});
test('la fórmula empírica sale de vuelta de sus propios porcentajes', () => {
  for (const [f, emp] of [['CH4', 'CH4'], ['C2H6', 'CH3'], ['C6H12O6', 'CH2O'], ['Fe2O3', 'Fe2O3'], ['Fe3O4', 'Fe3O4'], ['C3H8', 'C3H8'], ['Na2CO3', 'Na2CO3'], ['P4O10', 'P2O5'], ['C2H4O2', 'CH2O']]) {
    assert.equal(motor.empirica(motor.composicion(f).porcentajes).formula, emp, f);
  }
});
test('moles ida y vuelta: gramos → moles → moléculas → moles → gramos', () => {
  for (const f of FORMULAS) {
    const a = motor.moles(f, { gramos: 7.3 }), b = motor.moles(f, { moleculas: a.moleculas });
    cerca(b.gramos, 7.3, f);
    cerca(a.atomos / a.moleculas, motor.totalAtomos(f), `${f}: átomos por molécula`);
  }
});
test('la molecular es k veces la empírica y tiene la misma composición', () => {
  const r = motor.molecular('CH2O', 180);
  for (const [e, p] of Object.entries(motor.composicion('CH2O').porcentajes)) cerca(motor.composicion(r.formula).porcentajes[e], p, e);
});
test('Proust: la razón entre los elementos es la misma en cualquier muestra', () => {
  for (const g of [1, 9, 250]) { const r = motor.masasElementos('H2O', g); cerca(r.O / r.H, 8, `${g} g`); cerca(r.H + r.O, g, 'suma'); }
});
test('a igual masa, la sustancia más liviana tiene más partículas; a igual número de moles, el mismo número', () => {
  assert.ok(motor.moles('H2', { gramos: 10 }).moleculas > motor.moles('O2', { gramos: 10 }).moleculas);
  cerca(motor.moles('H2', { moles: 1 }).moleculas, motor.moles('H2O', { moles: 1 }).moleculas, 'mismos moles');
  assert.ok(motor.moles('H2O', { moles: 1 }).atomos > motor.moles('H2', { moles: 1 }).atomos, 'pero no los mismos átomos');
});
test('la masa de una partícula en u es la masa molar: Nₐ partículas pesan M gramos', () => {
  for (const f of ['C', 'H2O', 'CO2']) cerca(motor.masaParticula(f) * motor.NA, motor.masaMolar(f).valor, f);
});
test('escribir fórmulas: orden de Hill solo en orgánicos', () => {
  assert.equal(motor.escribir({ C: 2, H: 6 }), 'C2H6'); assert.equal(motor.escribir({ Na: 2, C: 1, O: 3 }), 'Na2CO3'); assert.equal(motor.escribir({ H: 2, O: 1 }), 'H2O');
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.atomos('Xx2'), /elemento/);
  assert.throws(() => motor.atomos('Ca(OH2'), /falta/);
  assert.throws(() => motor.atomos('CaOH)2'), /sobra/);
  assert.throws(() => motor.moles('H2O', {}), /da gramos/);
  assert.throws(() => motor.moles('H2O', { gramos: -1 }), /mayor que cero/);
  assert.throws(() => motor.promedio([{ masa: 35, abundancia: 70 }]), /suman/);
  assert.throws(() => motor.molecular('CH2O', 100), /múltiplo/);
  assert.throws(() => motor.empirica({ C: 1, H: 1.37 }), /enteros/);
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
