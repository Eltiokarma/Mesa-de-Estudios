// Pruebas del motor de Equilibrio químico. Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json, verificado con fracciones exactas y otro método, debe salir igual del motor
//    (regla 2 de CLAUDE.md).
// 2. Coherencia: K de vuelta desde el equilibrio, Kp y Kc ida y vuelta, invertir y escalar.
// 3. Las partículas: en equilibrio las dos reacciones siguen y van a la par (EQ2 a EQ4); al agregar A solo sube la
//    directa en el instante (EQ6); el catalizador no mueve las cantidades (EQ12); comprimir 2 X ⇌ Y corre hacia Y
//    y A ⇌ B no se corre (EQ11); calentar baja K y las dos rapideces suben (EQ8 y EQ9).
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
test('casos.json: al menos 15 casos con nombre', () => { assert.ok(datos.casos.length >= 15); for (const c of datos.casos) assert.ok(c.nombre && c.fn && c.espera); });
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Coherencia
test('leer: coeficientes, estados y Δn sin sólidos', () => {
  const e = motor.leer('2 SO2(g) + O2(g) ⇌ 2 SO3(g)');
  assert.deepEqual(e.reactivos.map(x => [x.sp, x.coef, x.estado]), [['SO2', 2, 'g'], ['O2', 1, 'g']]);
  assert.equal(motor.deltaN('CaCO3(s) = CaO(s) + CO2(g)'), 1);
  assert.equal(motor.deltaN('H2(g) + I2(g) <=> 2 HI(g)'), 0);
  assert.equal(motor.leer('SO3(g) = SO2(g) + 1/2 O2(g)').productos[1].coef, 0.5);
});
test('el equilibrio calculado cumple Q = K, desde los dos lados', () => {
  const casos = [['N2(g) + 3 H2(g) = 2 NH3(g)', { N2: 1, H2: 3 }, 2, 0.5], ['N2(g) + 3 H2(g) = 2 NH3(g)', { NH3: 2 }, 2, 0.5],
    ['2 SO2(g) + O2(g) = 2 SO3(g)', { SO2: 3, O2: 1, SO3: 1 }, 1.5, 7], ['PCl5(g) = PCl3(g) + Cl2(g)', { PCl3: 1, Cl2: 2 }, 1, 0.3]];
  for (const [ec, n0, V, K] of casos) {
    const r = motor.equilibrio(ec, { moles: n0, V, K });
    cerca(motor.cociente(ec, r.conc), K, `${ec} desde ${JSON.stringify(n0)}`, 1e-9);
    for (const n of Object.values(r.moles)) assert.ok(n >= -1e-12, 'ninguna cantidad negativa');
  }
});
test('llegar desde los reactivos o desde los productos da el mismo equilibrio', () => {
  const a = motor.equilibrio('H2(g) + I2(g) = 2 HI(g)', { moles: { H2: 1, I2: 1 }, V: 1, K: 64 });
  const b = motor.equilibrio('H2(g) + I2(g) = 2 HI(g)', { moles: { HI: 2 }, V: 1, K: 64 });
  for (const k of ['H2', 'I2', 'HI']) cerca(a.moles[k], b.moles[k], k);
  assert.equal(b.sentido, 'inversa');
});
test('Kp y Kc ida y vuelta; invertir dos veces y escalar', () => {
  for (const [ec, K, T] of [['N2(g) + 3 H2(g) = 2 NH3(g)', 0.5, 700], ['CaCO3(s) = CaO(s) + CO2(g)', 0.02, 1100], ['H2(g) + I2(g) = 2 HI(g)', 50, 700]]) {
    cerca(motor.kc(ec, motor.kp(ec, K, T).valor, T).valor, K, ec);
  }
  cerca(motor.kp('H2(g) + I2(g) = 2 HI(g)', 50, 700).valor, 50, 'con Δn = 0, Kp = Kc');
  cerca(motor.invertir(motor.invertir(7)), 7, 'invertir dos veces');
  cerca(motor.escalar(motor.escalar(9, 0.5), 2), 9, 'raíz y cuadrado');
});
test('un gas que no reacciona, a volumen fijo, no mueve el equilibrio; el sentido sigue a Q contra K', () => {
  const r = motor.perturbar('2 SO2(g) + O2(g) = 2 SO3(g)', { moles: { SO2: 2, O2: 1, SO3: 2 }, V: 2, K: 2 }, { inerte: 5 });
  assert.equal(r.sentido, 'equilibrio');
  assert.equal(motor.sentido(1, 2), 'directa'); assert.equal(motor.sentido(3, 2), 'inversa'); assert.equal(motor.sentido(Infinity, 2), 'inversa');
});
test('van \'t Hoff: exotérmica baja K al calentar, endotérmica la sube; ida y vuelta', () => {
  assert.ok(motor.vantHoff(4, 300, -50000, 400) < 4); assert.ok(motor.vantHoff(4, 300, 50000, 400) > 4);
  cerca(motor.vantHoff(motor.vantHoff(4, 300, -50000, 400), 400, -50000, 300), 4, 'vuelta');
  cerca(motor.Kescena('AB', 300), 4, 'K de la escena a 300 K'); cerca(motor.Kescena('AB', 400), 1.5, 'K de la escena a 400 K');
});

// 3. Partículas
const correr = (c, s) => { for (let i = 0; i < Math.round(s * 60); i++) c.paso(1 / 60); return c; };
test('EQ2 a EQ4: en equilibrio las dos reacciones siguen, a la par, y las cantidades no se mueven', () => {
  const c = correr(motor.caja({ tipo: 'AB', nA: 2, nB: 8, semilla: 3 }), 5);
  let min = Infinity, max = -Infinity, d = 0, i = 0;
  for (let k = 0; k < 600; k++) { c.paso(1 / 60); const n = c.cuenta().A; min = Math.min(min, n); max = Math.max(max, n); }
  const v = c.cambios(10); d = v.directa; i = v.inversa;
  assert.equal(min, 2); assert.equal(max, 2);
  assert.ok(d > 10 && Math.abs(d - i) <= 1, `cambios en 10 s: ${d} y ${i}`);
});
test('EQ6: al agregar A, en el instante solo sube la directa; después las dos quedan iguales y mayores que antes', () => {
  const c = correr(motor.caja({ tipo: 'AB', nA: 2, nB: 8, semilla: 5 }), 3);
  const antes = c.rapidez(); cerca(antes.directa, antes.inversa, 'antes, iguales', 1e-6);
  c.agregar('A', 10);
  const r = c.rapidez(); cerca(r.directa, 12, 'directa al instante'); cerca(r.inversa, antes.inversa, 'la inversa no cambia al instante');
  correr(c, 12);
  assert.deepEqual(c.cuenta(), { A: 4, B: 16 });
  const f = c.rapidez(); cerca(f.directa, f.inversa, 'después, iguales', 1e-3); assert.ok(f.directa > antes.directa * 1.9);
});
test('quitar B: parte del A pasa a B y K sigue igual', () => {
  const c = correr(motor.caja({ tipo: 'AB', nA: 4, nB: 16, semilla: 7 }), 2);
  c.quitar('B', 10); correr(c, 12);
  assert.deepEqual(c.cuenta(), { A: 2, B: 8 }); cerca(c.K(), 4, 'K');
});
test('EQ12: el catalizador acelera los dos sentidos por igual y no cambia las cantidades', () => {
  const c = correr(motor.caja({ tipo: 'AB', nA: 4, nB: 16, semilla: 9 }), 3);
  const r0 = c.rapidez(); c.catalizador(true); const r1 = c.rapidez();
  cerca(r1.directa / r0.directa, 3, 'directa ×3'); cerca(r1.inversa / r0.inversa, 3, 'inversa ×3');
  correr(c, 8); assert.deepEqual(c.cuenta(), { A: 4, B: 16 }); cerca(c.K(), 4, 'K');
});
test('el catalizador hace llegar antes al mismo equilibrio', () => {
  const lenta = motor.caja({ tipo: 'AB', nA: 12, nB: 8, semilla: 2 }), rapida = motor.caja({ tipo: 'AB', nA: 12, nB: 8, semilla: 2 });
  rapida.catalizador(true); correr(lenta, 1); correr(rapida, 1);
  assert.ok(rapida.cuenta().A < lenta.cuenta().A, 'a 1 s, la catalizada va más avanzada');
  correr(lenta, 15); correr(rapida, 15); assert.deepEqual(lenta.cuenta(), rapida.cuenta());
});
test('EQ11: comprimir 2 X ⇌ Y corre hacia Y (6 X y 9 Y); comprimir A ⇌ B no lo corre', () => {
  const c = correr(motor.caja({ tipo: 'A2B', nA: 8, nB: 8, semilla: 4 }), 3);
  assert.deepEqual(c.cuenta(), { X: 8, Y: 8 });
  c.volumen(0.5); cerca(c.Q(), 1 / 16, 'Q al instante'); correr(c, 15);
  assert.deepEqual(c.cuenta(), { X: 6, Y: 9 }); cerca(c.Q(), 1 / 8, 'Q = K');
  const d = correr(motor.caja({ tipo: 'AB', nA: 4, nB: 16, semilla: 4 }), 2); d.volumen(0.5); correr(d, 10);
  assert.deepEqual(d.cuenta(), { A: 4, B: 16 });
});
test('EQ8 y EQ9: al calentar la exotérmica, las dos rapideces suben, la inversa más, y K baja a 3/2', () => {
  const c = correr(motor.caja({ tipo: 'AB', nA: 4, nB: 16, semilla: 6 }), 2);
  const r0 = c.rapidez(); c.temperatura(400); const r1 = c.rapidez();
  assert.ok(r1.directa > r0.directa && r1.inversa > r0.inversa, 'las dos más rápidas');
  assert.ok(r1.inversa / r0.inversa > r1.directa / r0.directa, 'la que absorbe calor sube más');
  correr(c, 10); assert.deepEqual(c.cuenta(), { A: 8, B: 12 }); cerca(c.K(), 1.5, 'K a 400 K');
});
test('las partículas siguen dentro de la caja, también al comprimir', () => {
  const c = correr(motor.caja({ tipo: 'A2B', nA: 8, nB: 8, semilla: 8 }), 2); c.volumen(0.5); correr(c, 5);
  for (const p of c.parts) assert.ok(p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1);
});
test('la caja calcula su equilibrio con el mismo motor de cálculo', () => {
  const c = motor.caja({ tipo: 'AB', nA: 12, nB: 8 }); const e = c.equilibrio();
  cerca(e.A, 4, 'A'); cerca(e.B, 16, 'B');
});

// 4. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.leer('A + B'), /=/);
  assert.throws(() => motor.equilibrio('A(g) = B(g)', { moles: { A: 1 }, V: 0, K: 4 }), /mayor que cero/);
  assert.throws(() => motor.equilibrio('A(g) = B(g)', { moles: {}, V: 1, K: 4 }), /sustancia/);
  assert.throws(() => motor.perturbar('A(g) = B(g)', { moles: { A: 1, B: 4 }, V: 1, K: 4 }, { quitar: { A: 2 } }), /quitar/);
  assert.throws(() => motor.kp('A(g) = B(g)', -1, 300), /mayor que cero/);
  assert.throws(() => motor.caja({ tipo: 'ZZ' }), /desconocida/);
  assert.throws(() => motor.caja({ tipo: 'AB', nA: 1 }).agregar('Q', 1), /desconocida/);
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
