// Pruebas del motor de Gases. Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json, verificado con fracciones exactas y otro método,
//    debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Coherencia: la ecuación de estado ida y vuelta; Dalton suma la presión total; en el tubo de Graham
//    las dos distancias suman el largo.
// 3. Las partículas: los choques contra las paredes crecen con √T y con n (la presión), y no cambian el
//    reparto (siguen por toda la caja al enfriar: GQ2); en la efusión el más liviano sale más (GQ11).
// 4. Errores de entrada.
// 5. Cada problema de papel.json coincide con el motor.

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
const campo = (r, k) => (k === 'valor' ? r : k.split('.').reduce((o, p) => (o == null ? o : o[p]), r));
function comprobar(fn, args, espera, que) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  const r = motor[fn](...args);
  for (const [k, v] of Object.entries(espera)) { const x = campo(r, k); assert.ok(x !== undefined, `${que}: falta ${k}`); cerca(x, v, `${que} · ${k}`); }
}

// 1. casos.json
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Coherencia
test('ecuación de estado ida y vuelta', () => {
  for (const [P, V, n, T] of [[1, 22.4, 1, 273], [2.5, 3, 0.4, 350], [0.63, 10, 0.2, 290]]) {
    cerca(motor.estado({ V, n, T }).P, n * 0.082 * T / V, 'P');
    const r = motor.estado({ P, V, T }); cerca(motor.estado({ P, V, n: r.n }).T, T, 'T de vuelta');
  }
});
test('Dalton: las presiones parciales suman la total y siguen a los moles, no a las masas', () => {
  const r = motor.dalton([{ gas: 'H2', masa: 2 }, { gas: 'N2', masa: 28 }, { gas: 'CO2', masa: 44 }], 6);
  cerca(Object.values(r.gases).reduce((s, g) => s + g.P, 0), 6, 'suma');
  for (const g of Object.values(r.gases)) cerca(g.P, 2, 'un mol de cada uno, la misma presión');
});
test('Graham: las dos distancias suman el largo y el más liviano recorre más', () => {
  for (const [a, b] of [['H2', 'O2'], ['NH3', 'Cl2'], ['He', 'CH4']]) {
    const r = motor.encuentro(120, a, b); cerca(r.desde1 + r.desde2, 120, 'suma');
    assert.ok(r.desde1 > r.desde2, `${a} es más liviano que ${b}`);
  }
});
test('Kelvin y Celsius ida y vuelta', () => { cerca(motor.celsius(motor.kelvin(-40)), -40, '°C'); });

// 3. Partículas
function choques(o, pasos) { const c = motor.caja(o); for (let i = 0; i < pasos; i++) c.paso(0.01); return c; }
test('los choques contra las paredes crecen con √T y con n', () => {
  const base = choques({ especies: [{ gas: 'O2', n: 60 }], T: 300, semilla: 3 }, 20000).choques;
  const T4 = choques({ especies: [{ gas: 'O2', n: 60 }], T: 1200, semilla: 3 }, 20000).choques;
  const n2 = choques({ especies: [{ gas: 'O2', n: 120 }], T: 300, semilla: 3 }, 20000).choques;
  cerca(T4 / base, 2, 'cuatro veces T, el doble de choques', 0.05);
  cerca(n2 / base, 2, 'el doble de partículas, el doble de choques', 0.1);
});
test('la tasa promedio de choques coincide con la contada y crece con √T y con n', () => {
  const c = motor.caja({ especies: [{ gas: 'O2', n: 60 }], T: 300, semilla: 3 }), tasa = c.tasaChoques();
  for (let i = 0; i < 40000; i++) c.paso(0.01);
  cerca(c.choques / c.t, tasa, 'contada contra promedio', 0.03);
  const T4 = motor.caja({ especies: [{ gas: 'O2', n: 60 }], T: 1200, semilla: 3 }).tasaChoques();
  cerca(T4 / tasa, 2, 'cuatro veces T, el doble');
  const ancho2 = motor.caja({ especies: [{ gas: 'O2', n: 60 }], T: 300, semilla: 3 }); ancho2.anchura(2);
  assert.ok(ancho2.tasaChoques() < tasa, 'más volumen, menos choques');
});
test('el empuje es la presión: ∝ n·T/V y no depende de la masa de cada gas (Dalton)', () => {
  const mk = (o, a) => { const c = motor.caja(o); if (a) c.anchura(a); return c; };
  const base = mk({ especies: [{ gas: 'O2', n: 400 }], T: 300, semilla: 2 }).empuje();
  cerca(mk({ especies: [{ gas: 'O2', n: 400 }], T: 600, semilla: 2 }).empuje() / base, 2, 'doble T', 1e-9);
  cerca(mk({ especies: [{ gas: 'O2', n: 400 }], T: 300, semilla: 2 }, 2).empuje() / base, 0.5, 'doble V', 1e-9);
  // Mismos factores de rapidez (misma semilla), distinto gas: el mismo empuje.
  cerca(mk({ especies: [{ gas: 'H2', n: 400 }], T: 300, semilla: 2 }).empuje() / base, 1, 'H₂ contra O₂', 1e-9);
  // Mezcla de 20 O₂ y 40 CH₄: el CH₄ empuja unas 2 veces más (por número), aunque choque unas 3 veces más.
  const m = mk({ especies: [{ gas: 'O2', n: 2000 }, { gas: 'CH4', n: 4000 }], T: 300, semilla: 21 });
  cerca(m.empuje('CH4') / m.empuje('O2'), 2, 'razón de presiones parciales', 0.08);
});
test('GQ2: al enfriar, el gas sigue repartido por toda la caja (no se junta en el fondo)', () => {
  const c = motor.caja({ especies: [{ gas: 'N2', n: 400 }], T: 300, semilla: 9 });
  c.temperatura(273);
  for (let i = 0; i < 3000; i++) c.paso(0.01);
  const abajo = c.parts.filter(p => p.y > 0.5).length, izq = c.parts.filter(p => p.x < 0.5).length;
  cerca(abajo / 400, 0.5, 'mitad abajo', 0.15); cerca(izq / 400, 0.5, 'mitad a la izquierda', 0.15);
});
test('la rapidez crece con √(T/M) y no depende de nada más', () => {
  cerca(motor.rapidez(1200, 'O2') / motor.rapidez(300, 'O2'), 2, 'T');
  cerca(motor.rapidez(300, 'H2') / motor.rapidez(300, 'O2'), 4, 'M');
});
test('GQ11: en la efusión, el H₂ sale unas 4 veces más que el O₂ al principio', () => {
  const c = motor.caja({ especies: [{ gas: 'H2', n: 3000 }, { gas: 'O2', n: 3000 }], agujero: { y: 0.5, alto: 0.06 }, semilla: 5 });
  for (let i = 0; i < 40; i++) c.paso(0.01);
  cerca(c.salieron.H2 / c.salieron.O2, 4, 'razón de efusión', 0.3);
});

// 4. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.estado({ P: 1, V: 2 }), /tres/);
  assert.throws(() => motor.estado({ P: 1, V: 2, n: 1, T: 300 }), /tres/);
  assert.throws(() => motor.estado({ P: -1, V: 2, n: 1 }), /mayor que cero/);
  assert.throws(() => motor.densidad({ P: 1, T: 300, M: 'Xe9' }), /masa molar/);
  assert.throws(() => motor.cambio({ P: 1, V: 1, T: 300 }, {}, 'Q'), /buscar/);
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
