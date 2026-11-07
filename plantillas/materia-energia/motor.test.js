// Pruebas del motor de «La lupa y la balanza: materia y energía». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades: en un cambio químico se conservan los átomos de cada elemento y la masa (Lavoisier), y en uno físico
//    las sustancias; en frasco cerrado la balanza no se mueve nunca; una sustancia pura tiene un solo componente aunque
//    tenga varias fases; un elemento tiene un solo tipo de átomo; E = mc² y su inverso son inversos; cada error típico de
//    una predicción da algo distinto de la respuesta; un método que «separa» deja al menos dos partes; lo que se usa en
//    la escena (las cajas y el vaso) da lo que dice el paso.
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
  assert.equal(datos.plantilla, 'materia-energia');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 25);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
const masaDe = l => l.reduce((s, p) => s + p.n * motor.especie(p.formula).masaMolar, 0);
test('cambios: en uno químico se conservan los átomos y la masa; en uno físico, las sustancias; en uno nuclear cambian los elementos', () => {
  for (const id of Object.keys(motor.FENOMENOS)) {
    const f = motor.FENOMENOS[id], r = motor.fenomeno(id);
    if (r.tipo === 'nuclear') { assert.notDeepEqual(r.elementosAntes, r.elementosDespues, id); continue; }
    assert.ok(r.conservaAtomos, id);
    assert.ok(Math.abs(masaDe(f.antes) - masaDe(f.despues)) < 1e-9, `${id}: masa`);
    if (r.tipo === 'físico') { assert.deepEqual([...r.sustanciasAntes].sort(), [...r.sustanciasDespues].sort(), id); assert.deepEqual(r.nuevas, [], id); }
    else assert.ok(r.nuevas.length > 0, id);
  }
});
test('balanza: en frasco cerrado la masa no cambia nunca; en abierto baja lo que sale y sube lo que entra', () => {
  for (const rec of [0, 150, 300]) for (const m of [0.5, 2, 20]) for (const fr of [0, 0.25, 0.5, 1]) {
    const c = motor.evaporar({ recipiente: rec, masa: m, fraccion: fr, cerrado: true }), a = motor.evaporar({ recipiente: rec, masa: m, fraccion: fr, cerrado: false });
    assert.equal(c.despues, c.antes);
    assert.ok(Math.abs(a.antes - a.despues - c.vapor) < 1e-9);
    if (fr > 0) assert.notEqual(c.errores.vaporNoPesa, c.despues);
  }
  for (const [met, ox] of [['Fe', 'Fe2O3'], ['Fe', 'FeO'], ['Mg', 'MgO'], ['Cu', 'CuO'], ['Al', 'Al2O3']]) for (const m of [1, 5.6, 24]) {
    const c = motor.quemarMetal({ metal: met, masa: m, oxido: ox, recipiente: 100, cerrado: true }), a = motor.quemarMetal({ metal: met, masa: m, oxido: ox, cerrado: false });
    assert.equal(c.despues, c.antes, `${met} cerrado`);
    assert.ok(a.despues > a.antes, `${met} abierto sube`);
    // El O que se une sale de la fórmula: átomos de O por átomo de metal.
    const at = motor.atomos(ox), esperado = (m / motor.MASAS[met]) * (at.O / at[met]) * 16;
    assert.ok(Math.abs(a.oxigeno - esperado) < 1e-3, `${met} → ${ox}: ${a.oxigeno} contra ${esperado}`);
  }
});
test('cajas: una sustancia pura tiene un componente aunque tenga varias fases; un elemento, un solo tipo de átomo', () => {
  for (const f of ['H2', 'O2', 'O3', 'He', 'Fe', 'S8', 'C', 'H2O', 'CO2', 'NaCl', 'C12H22O11', 'SiO2']) {
    const r = motor.clasificarCaja([{ formula: f, n: 3, fase: 'a' }, { formula: f, n: 2, fase: 'b' }]);
    assert.ok(r.pura && r.nSustancias === 1, f);
    assert.equal(r.sistema, 'heterogéneo', f);
    assert.equal(r.tipo, Object.keys(motor.atomos(f)).length === 1 ? 'elemento' : 'compuesto', f);
    assert.equal(motor.especie(f).tipo, r.tipo, f);
  }
  for (const [a, b] of [['H2', 'O2'], ['O2', 'O3'], ['H2O', 'C2H5OH'], ['N2', 'O2']]) {
    const r = motor.clasificarCaja([{ formula: a, n: 3 }, { formula: b, n: 3 }]);
    assert.equal(r.tipo, 'mezcla'); assert.equal(r.nombre, 'mezcla homogénea');
  }
  for (const m of Object.keys(motor.MATERIALES)) assert.ok(/^(sustancia pura \((elemento|compuesto)\)|mezcla (homogénea|heterogénea))$/.test(motor.material(m).nombre), m);
});
test('lo que usa la escena: solo la caja 2 es compuesto; el vaso da 4 fases y 4 componentes, y cada error da otra cuenta', () => {
  const tipos = Object.fromEntries(Object.entries(motor.CAJAS).map(([k, l]) => [k, motor.clasificarCaja(l).tipo]));
  assert.deepEqual(tipos, { 1: 'elemento', 2: 'compuesto', 3: 'elemento', 4: 'mezcla' });
  const v = motor.contarSistema(motor.VASO);
  assert.equal(v.nFases, 4); assert.equal(v.nComponentes, 4);
  const pares = new Set([`${v.nFases}-${v.nComponentes}`, `${v.errores.cadaCosaUnaFase}-${v.errores.cadaCosaUnComponente}`, `${v.nFases}-${v.errores.hieloOtroComponente}`, `${v.errores.disueltoEsFase}-${v.nComponentes}`]);
  assert.equal(pares.size, 4, 'las cuatro opciones son distintas');
});
test('E = mc²: energia y masaDeEnergia son inversas; cada error se aleja de la respuesta por la potencia de 10 que dice', () => {
  for (const m of [1e-6, 0.001, 0.5, 2, 1000]) {
    const r = motor.energia(m, 'kg');
    cerca(motor.masaDeEnergia(r.E).kg, m, `m = ${m}`);
    cerca(motor.energia(m * 1000, 'g').E, r.E, `g = ${m * 1000}`);
    cerca(motor.energia(m * 1000, 'g').errores.gramosSinConvertir / r.E, 1000, 'gramos ×1000');
    cerca(r.errores.cEnKmPorS / r.E, 1e-6, 'km/s ÷10⁶');
    cerca(r.errores.sinCuadrado / r.E, 1 / 3e8, 'sin cuadrado ÷c');
    cerca(r.kWh * 3.6e6, r.E, 'kWh');
  }
  for (const E of [9e13, 4.5e13, 1.8e14]) {
    const b = motor.balanzaNuclear(E);
    assert.ok(b.baja > 0 && b.errores.conservaMasa === 0 && b.errores.kgComoGramos !== b.baja && b.errores.cEnKmPorS !== b.baja);
  }
  const d = motor.defectoMasa([2.0141, 3.016], [4.0026, 1.0087]);
  cerca(d.E, d.dmKg * 9e16, 'defecto');
  assert.ok(d.MeV > 17 && d.MeV < 18);
});
test('separación: un método que separa deja al menos dos partes; los adecuados separan; el mismo componente nunca queda en dos fracciones', () => {
  for (const m of Object.keys(motor.MEZCLAS)) {
    const p = motor.metodoPara(m);
    assert.ok(p.adecuados.length > 0, m);
    for (const k of Object.keys(motor.METODOS)) {
      const r = motor.separar(m, k), todos = [...r.fracciones.flat(), ...r.pierde];
      assert.equal(new Set(todos).size, todos.length, `${m} ${k}: repetido`);
      assert.equal(todos.length, motor.MEZCLAS[m].partes.length, `${m} ${k}: falta un componente`);
      if (r.separa) assert.ok(r.fracciones.filter(f => f.length).length + (r.pierde.length ? 1 : 0) >= 2, `${m} ${k}`);
      if (p.adecuados.includes(k)) assert.ok(r.separa && r.adecuado, `${m} ${k}: el adecuado separa`);
      assert.ok(r.razon.length > 10, `${m} ${k}: razón`);
    }
  }
});
test('propiedades: las químicas son intensivas; una partícula sola no tiene color ni temperatura de fusión', () => {
  for (const [n, p] of Object.entries(motor.PROPIEDADES)) { if (p[1] === 'química') assert.equal(p[0], 'intensiva', n); }
  const r = motor.particula('S8', ['color', 'temperatura de fusión', 'dureza', 'densidad', 'masa', 'combustibilidad']);
  assert.deepEqual(r.tiene, ['masa', 'combustibilidad']);
});
test('meseta: mientras hierve, la temperatura no sube aunque entre calor', () => {
  for (const Teb of [100, 87]) for (const min of [1, 5, 10]) {
    const r = motor.hervir({ masa: 500, Teb, minutos: min, potencia: 2000 });
    assert.equal(r.T, Teb); assert.ok(r.errores.sigueSubiendo > Teb); cerca(r.vapor * 540, r.Q, 'calor latente');
  }
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.atomos('Xx2'), /elemento/);
  assert.throws(() => motor.atomos('Ca(OH2'), /falta/);
  assert.throws(() => motor.clasificarCaja([]), /vacía/);
  assert.throws(() => motor.clasificarCaja([{ formula: 'H2O', n: 0 }]), /cantidad/);
  assert.throws(() => motor.contarSistema([{ nombre: 'agua', sustancia: 'H2O' }]), /fase/);
  assert.throws(() => motor.cambio([{ formula: 'H2', n: 2 }, { formula: 'O2', n: 2 }], [{ formula: 'H2O', n: 2 }]), /mismos átomos/);
  assert.throws(() => motor.fenomeno('magia'), /desconocido/);
  assert.throws(() => motor.separar('agua-sal', 'tamizado'), /método/);
  assert.throws(() => motor.separar('lodo', 'filtracion'), /mezcla/);
  assert.throws(() => motor.evaporar({ recipiente: 1, masa: 1, fraccion: 2, cerrado: true }), /fracción/);
  assert.throws(() => motor.quemarMetal({ metal: 'Fe', masa: 1, oxido: 'CuO' }), /óxido/);
  assert.throws(() => motor.propiedad('belleza'), /propiedad/);
  assert.throws(() => motor.hervir({ masa: 10, Teb: 100, minutos: 10, potencia: 2000 }), /agua/);
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
