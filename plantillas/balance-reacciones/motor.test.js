// Pruebas del motor de «Balance de reacciones». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades: toda ecuación que el motor balancea queda con los mismos átomos de cada elemento y la misma carga
//    a los dos lados, y con la masa conservada (Lavoisier); los coeficientes son los menores enteros; multiplicarlos
//    no cambia el balance; el último paso del tanteo es el balance; cambiar un subíndice (ES11) cambia la sustancia;
//    la ecuación global por ion-electrón coincide con el balance directo por álgebra; en las semirreacciones la carga
//    queda igual y los electrones son el cambio del número de oxidación por los átomos del elemento central; la suma
//    de números de oxidación de una especie es su carga.
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
  assert.equal(datos.plantilla, 'balance-reacciones');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 25);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
const ECUACIONES = ['H2 + O2 -> H2O', 'N2 + H2 -> NH3', 'CH4 + O2 -> CO2 + H2O', 'C3H8 + O2 -> CO2 + H2O', 'C4H10 + O2 -> CO2 + H2O',
  'C6H12O6 + O2 -> CO2 + H2O', 'Fe + O2 -> Fe2O3', 'Zn + HCl -> ZnCl2 + H2', 'H2O2 -> H2O + O2', 'Fe + Cl2 -> FeCl3', 'N2 + O2 -> NO2',
  'NH3 + O2 -> NO + H2O', 'KClO3 -> KCl + O2', 'Al(OH)3 + H2SO4 -> Al2(SO4)3 + H2O', 'Cu + HNO3 -> Cu(NO3)2 + NO + H2O',
  'Fe2O3 + CO -> Fe + CO2', 'Zn + CuCl2 -> ZnCl2 + Cu', 'Ca3(PO4)2 + SiO2 + C -> CaSiO3 + P4 + CO', 'KMnO4 + HCl -> KCl + MnCl2 + Cl2 + H2O',
  'MnO4^- + Fe^2+ + H^+ -> Mn^2+ + Fe^3+ + H2O', 'Cr2O7^2- + Fe^2+ + H^+ -> Cr^3+ + Fe^3+ + H2O', 'CuSO4·5H2O -> CuSO4 + H2O'];
test('lo que el motor balancea tiene los mismos átomos, la misma carga y la misma masa a los dos lados', () => {
  for (const e of ECUACIONES) {
    const b = motor.balancear(e), c = motor.contar(e, b.coefs);
    assert.ok(c.balanceada, e);
    for (const el of c.elementos) assert.equal(c.izq[el], c.der[el], `${e}: ${el}`);
    cerca(c.masaIzq, c.masaDer, `${e}: masa`);
    assert.ok(b.coefs.every(x => Number.isInteger(x) && x > 0), `${e}: enteros positivos`);
    assert.equal(b.coefs.reduce((a, x) => motor.mcd(a, x), 0), 1, `${e}: menores enteros`);
    assert.equal(b.ecuacion, motor.escribir(e, b.coefs));
    assert.ok(motor.contar(b.ecuacion).balanceada, `${e}: el texto también`);
  }
});
test('multiplicar todos los coeficientes no cambia el balance; cambiar uno solo, sí', () => {
  for (const e of ECUACIONES) {
    const b = motor.balancear(e);
    for (const k of [2, 3, 7]) assert.ok(motor.contar(e, b.coefs.map(x => x * k)).balanceada, `${e} × ${k}`);
    b.coefs.forEach((_, i) => { const c = b.coefs.slice(); c[i] += 1; assert.ok(!motor.contar(e, c).balanceada, `${e}: +1 en ${i}`); });
  }
});
test('tanteo: tras cada paso su elemento queda igual a los dos lados, y el último paso es el balance', () => {
  for (const e of ECUACIONES) {
    const b = motor.balancear(e), hechos = [];
    for (const p of b.pasos) { hechos.push(p.elemento); const c = motor.contar(e, p.coefs); for (const h of hechos) assert.equal(c.izq[h], c.der[h], `${e}: ${h}`); }
    assert.deepEqual(b.pasos[b.pasos.length - 1].coefs, b.coefs, e);
    const o = b.pasos.map(p => p.elemento); if (o.includes('O')) assert.equal(o[o.length - 1], 'O', `${e}: el O al final`);
  }
});
test('ES11: cambiar un subíndice "balancea" los átomos pero cambia la sustancia', () => {
  for (const e of ECUACIONES) for (const s of motor.balancear(e).errores.subindices) {
    assert.notDeepEqual(motor.atomos(s.cambiada), motor.atomos(s.formula), `${e}: ${s.cambiada}`);
    assert.ok(motor.contar(s.ecuacion).atomosBalanceados);
  }
});
test('ES12: los errores de un solo coeficiente o de olvidar un elemento nunca quedan balanceados', () => {
  for (const e of ECUACIONES) {
    const r = motor.balancear(e).errores;
    for (const u of r.unSoloCoeficiente) assert.ok(!u.balanceada, `${e}: ${u.ecuacion}`);
    for (const [el, o] of Object.entries(r.olvida)) { const c = motor.contar(e, o.coefs); assert.ok(!c.atomosBalanceados && c.izq[el] !== c.der[el], `${e}: sin ${el}`); }
  }
});
test('frasco: se conservan los átomos de cada elemento y la masa; lo que sobra no reacciona', () => {
  const pruebas = [['H2 + O2 -> H2O', { H2: 5, O2: 2 }], ['N2 + H2 -> NH3', { N2: 4, H2: 9 }], ['CH4 + O2 -> CO2 + H2O', { CH4: 3, O2: 5 }], ['Fe + O2 -> Fe2O3', { Fe: 7, O2: 6 }]];
  for (const [e, ini] of pruebas) {
    const r = motor.frasco(e, ini), antes = {}, desp = {};
    for (const [f, n] of Object.entries(ini)) for (const [el, k] of Object.entries(motor.atomos(f))) antes[el] = (antes[el] || 0) + n * k;
    for (const [f, n] of Object.entries(r.final)) for (const [el, k] of Object.entries(motor.atomos(f))) desp[el] = (desp[el] || 0) + n * k;
    assert.deepEqual(desp, antes, e); cerca(r.masaAntes, r.masaDespues, e);
    assert.ok(!motor.contar(r.errores.conCantidades).balanceada || Object.keys(r.sobrante).length === 0, e);
  }
});
test('números de oxidación: la suma por los subíndices es la carga de la especie', () => {
  for (const f of ['KMnO4', 'MnO4^-', 'Cr2O7^2-', 'H2SO4', 'CuSO4', 'Cu(NO3)2', 'NH4^+', 'NaH', 'H2O2', 'Fe2O3', 'Fe3O4', 'KClO3', 'HClO', 'C6H12O6', 'Al2(SO4)3', 'OH^-', 'NO2', 'ZnCl2']) {
    const o = motor.oxidacion(f), a = motor.atomos(f);
    cerca(Object.entries(o.porElemento).reduce((s, [e, v]) => s + v * a[e], 0), motor.especie(f).carga, f);
  }
});
test('redox: lo que pierde el reductor es lo que gana el oxidante', () => {
  for (const e of ['Zn + CuCl2 -> ZnCl2 + Cu', 'Fe2O3 + CO -> Fe + CO2', 'Fe + O2 -> Fe2O3', 'Cu + HNO3 -> Cu(NO3)2 + NO + H2O', 'Zn + HCl -> ZnCl2 + H2']) {
    const b = motor.balancear(e), r = motor.redox(e), fs = [...motor.ecuacion(e).reactivos, ...motor.ecuacion(e).productos].map(t => t.f);
    assert.ok(r.esRedox, e);
    let gana = 0;
    for (const el of r.seReduce) for (const f of r.agenteOxidante) { const k = fs.indexOf(f), v = motor.oxidacion(f).porElemento[el], fin = Math.min(...r.estados[el].der);
      // En HNO3 solo se reduce la parte que pasa a NO: se cuenta con el producto que tiene el N reducido.
      if (e.startsWith('Cu + HNO3')) gana = b.coefs[3] * (v - fin); else gana += b.coefs[k] * motor.atomos(f)[el] * (v - fin); }
    assert.equal(gana, r.electrones, e);
  }
  assert.equal(motor.redox('AgNO3 + NaCl -> AgCl + NaNO3').esRedox, false);
});
test('ion-electrón: cada semirreacción queda balanceada en átomos y carga, con los electrones del cambio de número de oxidación', () => {
  const semis = [['MnO4^-', 'Mn^2+', 'acido'], ['MnO4^-', 'MnO2', 'basico'], ['Cr2O7^2-', 'Cr^3+', 'acido'], ['Fe^2+', 'Fe^3+', 'acido'], ['I^-', 'I2', 'basico'],
    ['NO3^-', 'NO', 'acido'], ['SO3^2-', 'SO4^2-', 'basico'], ['ClO3^-', 'Cl^-', 'acido'], ['CrO4^2-', 'Cr(OH)3', 'basico']];
  for (const [A, B, m] of semis) {
    const s = motor.semirreaccion(A, B, m), c = motor.contar(s.texto);
    assert.ok(c.balanceada, s.texto);
    assert.equal(s.cargaIzq, s.cargaDer, s.texto);
    const nA = motor.atomos(A)[s.central], nB = motor.atomos(B)[s.central], k = s.izq.concat(s.der).find(([, f]) => f === A)[0];
    assert.equal(s.electrones, k * nA * Math.abs(s.eoA - s.eoB), `${s.texto}: electrones`);
    assert.ok(!s.texto.includes(m === 'acido' ? 'OH^-' : 'H^+'), `${s.texto}: medio`);
    assert.ok(nB > 0);
  }
});
test('ion-electrón: la ecuación global es la misma que el balance directo por álgebra', () => {
  const pares = [[['Fe^2+', 'Fe^3+'], ['MnO4^-', 'Mn^2+'], 'acido'], [['Fe^2+', 'Fe^3+'], ['Cr2O7^2-', 'Cr^3+'], 'acido'], [['I^-', 'I2'], ['MnO4^-', 'MnO2'], 'basico'],
    [['I^-', 'I2'], ['Cr2O7^2-', 'Cr^3+'], 'acido'], [['Cu', 'Cu^2+'], ['NO3^-', 'NO'], 'acido'], [['SO3^2-', 'SO4^2-'], ['MnO4^-', 'MnO2'], 'basico']];
  for (const [o, r, m] of pares) {
    const g = motor.ionElectron(o, r, m);
    assert.ok(g.ecuacionBalanceada, g.texto);
    const d = motor.balancear(g.texto.replace(/(^|\s)\d+/g, '$1'));
    assert.equal(d.suma, g.suma, g.texto);
    assert.ok(!/e\^-/.test(g.texto), `${g.texto}: sin electrones sueltos`);
    assert.ok(g.errores.sinIgualar.suma !== g.suma || g.electrones === Math.max(g.oxidacion.electrones, g.reduccion.electrones));
  }
});
test('clasificar: cada ecuación de la lista tiene un tipo conocido', () => {
  for (const e of ECUACIONES.filter(x => !x.includes('^'))) assert.ok(['combustión', 'adición', 'descomposición', 'desplazamiento simple', 'doble desplazamiento', 'otra'].includes(motor.clasificar(e).tipo), e);
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.atomos('Xx2'), /elemento/);
  assert.throws(() => motor.atomos('Ca(OH2'), /falta/);
  assert.throws(() => motor.ecuacion('H2 + O2'), /flecha/);
  assert.throws(() => motor.balancear('H2 -> O2'), /no se puede/);
  assert.throws(() => motor.balancear('H2 + O2 -> H2O + H2O2'), /más de una/);
  assert.throws(() => motor.contar('H2 + O2 -> H2O', [1, 1]), /coeficiente/);
  assert.throws(() => motor.semirreaccion('MnO4^-', 'Mn^2+', 'neutro'), /medio/);
  assert.throws(() => motor.ionElectron(['MnO4^-', 'Mn^2+'], ['Fe^2+', 'Fe^3+'], 'acido'), /oxidación/);
  assert.throws(() => motor.conservacion('Zn + HCl -> ZnCl2 + H2', 'H2', 1, 'H2', 10), /reactivo/);
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
