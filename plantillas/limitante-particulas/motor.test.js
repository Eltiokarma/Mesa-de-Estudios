// Pruebas del motor de Reactivo limitante con partículas. Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json, verificado con fracciones exactas y otro método,
//    debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Conservación: en cualquier reacción y con cualquier mezcla, los átomos de cada elemento y la masa
//    total se conservan; nada queda en negativo; el limitante se acaba (o ya no alcanza para otra vuelta).
// 3. Lo que enseña la escena: el limitante puede ser el de más gramos (ES20) o el de mayor coeficiente
//    (ES21); solo se acaban los dos en la proporción justa (ES22); si falta un reactivo igual hay
//    reacción mientras alcance (ES23); 1 a 3 en moléculas no es 1 a 3 en gramos (ES19).
// 4. Errores de entrada.
// 5. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
const CON_REACCION = new Set(['porParticulas', 'porMasas', 'gramosQueReaccionan', 'balance', 'quiebre', 'maximo', 'avance']);
function cerca(real, esperado, que, tol) {
  const t = tol === undefined ? 1e-9 : tol;
  if (Array.isArray(esperado)) { assert.equal(real.length, esperado.length, `${que}: largo`); esperado.forEach((e, k) => cerca(real[k], e, `${que}[${k}]`, t)); return; }
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
function llamar(fn, args) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  const a = CON_REACCION.has(fn) ? [motor.reaccion(args[0]), ...args.slice(1)] : args;
  return motor[fn](...a);
}
const campo = (r, k) => (k === 'valor' ? r : k.split('.').reduce((o, p) => (o == null ? o : o[p]), r));
function comprobar(fn, args, espera, que) {
  const r = llamar(fn, args);
  for (const [k, v] of Object.entries(espera)) {
    const x = campo(r, k);
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    cerca(x, v, `${que} · ${k}`);
  }
}

// 1. casos.json
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(c.fn, t.args, t.espera, c.nombre);
});

// 2. Conservación con reacciones y mezclas al azar
const REACCIONES = [
  { reactivos: [[1, 'N2'], [3, 'H2']], productos: [[2, 'NH3']] },
  { reactivos: [[2, 'H2'], [1, 'O2']], productos: [[2, 'H2O']] },
  { reactivos: [[2, 'Al'], [3, 'Cl2']], productos: [[2, 'AlCl3']] },
  { reactivos: [[1, 'CH4'], [2, 'O2']], productos: [[1, 'CO2'], [2, 'H2O']] },
  { reactivos: [[1, 'C3H8'], [5, 'O2']], productos: [[3, 'CO2'], [4, 'H2O']] },
  { reactivos: [[1, 'Fe2O3'], [3, 'CO']], productos: [[2, 'Fe'], [3, 'CO2']] },
  { reactivos: [[1, 'CaCO3'], [2, 'HCl']], productos: [[1, 'CaCl2'], [1, 'H2O'], [1, 'CO2']] },
];
function atomosDe(r, cantidades) {
  const t = {};
  for (const [f, n] of Object.entries(cantidades)) for (const [e, k] of Object.entries(motor.atomos(f))) t[e] = (t[e] || 0) + k * n;
  return t;
}
test('con partículas: se conservan los átomos, nada queda negativo y el limitante ya no alcanza', () => {
  for (const d of REACCIONES) {
    const r = motor.reaccion(d);
    for (let a = 0; a <= 12; a++) for (let b = 0; b <= 12; b++) {
      const ini = { [r.reactivos[0][1]]: a, [r.reactivos[1][1]]: b }, s = motor.porParticulas(r, ini);
      assert.deepEqual(atomosDe(r, s.finales), atomosDe(r, ini), `${JSON.stringify(d)} con ${a} y ${b}`);
      for (const v of Object.values(s.finales)) assert.ok(v >= 0);
      for (const f of s.limitantes) { const c = r.reactivos.find(x => x[1] === f)[0]; assert.ok(s.finales[f] < c, `${f} no debería alcanzar otra vuelta`); }
    }
  }
});
test('con gramos: la masa total se conserva y el limitante se acaba', () => {
  for (const d of REACCIONES) {
    const r = motor.reaccion(d);
    for (const [ga, gb] of [[1, 1], [10, 64], [54, 142], [7, 3], [100, 0.5], [0.25, 40]]) {
      const g = { [r.reactivos[0][1]]: ga, [r.reactivos[1][1]]: gb }, s = motor.porMasas(r, g);
      cerca(s.despues, s.antes, `${JSON.stringify(d)} masa`);
      for (const f of s.limitantes) cerca(s.sobran[f], 0, `${f} se acaba`, 1e-9);
      for (const v of [...Object.values(s.sobran), ...Object.values(s.forman)]) assert.ok(v >= -1e-9);
    }
  }
});

// 3. Lo que enseña la escena
test('ES20 y ES21: el limitante puede tener más gramos y el mayor coeficiente', () => {
  const agua = motor.reaccion(REACCIONES[1]);
  const s = motor.porMasas(agua, { H2: 10, O2: 64 });
  assert.deepEqual(s.limitantes, ['O2']); // 64 g > 10 g, y su coeficiente (1) es el menor: limita igual
  const al = motor.reaccion(REACCIONES[2]);
  assert.deepEqual(motor.porMasas(al, { Al: 54, Cl2: 142 }).limitantes, ['Cl2']); // coeficiente 3, el mayor
});
test('ES22: solo se acaban los dos en la proporción justa', () => {
  const r = motor.reaccion(REACCIONES[0]);
  for (let n = 1; n <= 6; n++) for (let h = 1; h <= 18; h++) {
    const s = motor.porParticulas(r, { N2: n, H2: h });
    assert.equal(s.limitantes.length === 2, h === 3 * n, `${n} N₂ y ${h} H₂`);
  }
});
test('ES23: aunque falte un reactivo para la mezcla completa, reacciona lo que alcance', () => {
  const s = motor.porParticulas(motor.reaccion(REACCIONES[0]), { N2: 2, H2: 3 });
  assert.equal(s.veces, 1); assert.equal(s.finales.NH3, 2);
});
test('ES19: 1 a 3 en moléculas no es 1 a 3 en gramos', () => {
  const r = motor.reaccion(REACCIONES[0]);
  assert.notEqual(motor.gramosQueReaccionan(r, 'N2', 28, 'H2'), 84);
});
test('el producto crece en recta con un reactivo y se aplana en el quiebre', () => {
  const r = motor.reaccion(REACCIONES[0]), q = motor.quiebre(r, { N2: 4 }, 'H2', 'NH3');
  for (const h of [0, 3, 6, 11.9, 12, 15, 30]) {
    const s = motor.porMasas(r, { N2: 4 * 28, H2: h * 2 });
    cerca(s.molesFinales.NH3, Math.min(h, q.cantidad) / 3 * 2, `NH₃ con ${h} mol de H₂`);
  }
});

// 4. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.reaccion({ reactivos: [[1, 'N2'], [1, 'H2']], productos: [[2, 'NH3']] }), /balanceada/);
  assert.throws(() => motor.masaMolar('Xx2'), /inválida|sin masa/);
  assert.throws(() => motor.masaMolar('Ca(OH2'), /cerrada/);
  assert.throws(() => motor.reaccion({ reactivos: [[1.5, 'N2'], [3, 'H2']], productos: [[2, 'NH3']] }), /coeficiente/);
  assert.throws(() => motor.porParticulas(motor.reaccion(REACCIONES[0]), { N2: 1.5, H2: 3 }), /enteros/);
  assert.throws(() => motor.reaccion({ reactivos: [[1, 'N2'], [3, 'H2']], productos: [] }), /faltan/);
});

// 5. Problemas de papel (regla 6)
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
