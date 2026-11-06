// Pruebas del motor de Cinética química. Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json, verificado con fracciones exactas y otro método, debe salir igual del motor
//    (regla 2 de CLAUDE.md).
// 2. Coherencia: leyes integradas contra la ley diferencial, vidas medias encadenadas, Arrhenius ida y vuelta.
// 3. Las partículas: la fracción de choques A–B eficaces sigue a p·e^(−Ea/RT) (teoría de colisiones); más
//    temperatura, más concentración o catalizador dan más producto en el mismo tiempo; la energía media es R·T
//    (en dos dimensiones); los átomos se conservan.
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
test('casos.json: al menos 12 casos con nombre', () => { assert.ok(datos.casos.length >= 12); for (const c of datos.casos) assert.ok(c.nombre && c.fn && c.espera); });
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Coherencia
test('las leyes integradas cumplen la ley diferencial d[A]/dt = −k[A]ⁿ', () => {
  for (const n of [0, 1, 2]) {
    const k = 0.07, C0 = 0.9; let C = C0; const h = 1e-4;
    for (let t = 0; t < 5 - 1e-9; t += h) { const k1 = -k * C ** n, k2 = -k * (C + h / 2 * k1) ** n, k3 = -k * (C + h / 2 * k2) ** n, k4 = -k * (C + h * k3) ** n; C += h / 6 * (k1 + 2 * k2 + 2 * k3 + k4); }
    cerca(motor.concentracion(n, k, C0, 5), C, `orden ${n}`, 1e-8);
  }
});
test('vida media: en orden 1 no depende de [A]₀; en orden 2 la siguiente dura el doble; en orden 0, la mitad', () => {
  cerca(motor.vidaMedia(1, 0.3, 1), motor.vidaMedia(1, 0.3, 0.01), 'orden 1');
  cerca(motor.vidaMedia(2, 0.3, 0.5) / motor.vidaMedia(2, 0.3, 1), 2, 'orden 2');
  cerca(motor.vidaMedia(0, 0.3, 0.5) / motor.vidaMedia(0, 0.3, 1), 0.5, 'orden 0');
  for (const n of [0, 1, 2]) cerca(motor.concentracion(n, 0.2, 0.8, motor.vidaMedia(n, 0.2, 0.8)), 0.4, `mitad en orden ${n}`);
});
test('tiempo y concentración ida y vuelta', () => {
  for (const n of [0, 1, 2]) cerca(motor.tiempo(n, 0.05, 1, motor.concentracion(n, 0.05, 1, 7)), 7, `orden ${n}`);
});
test('Arrhenius: Ea de vuelta desde dos k y la razón de k', () => {
  const Ea = 62000, k1 = motor.arrhenius(1e10, Ea, 300), k2 = motor.arrhenius(1e10, Ea, 330);
  cerca(motor.energiaActivacion(k1, 300, k2, 330), Ea, 'Ea', 1e-9);
  cerca(k2 / k1, motor.razonK(Ea, 300, 330), 'razón');
  assert.ok(motor.razonK(0, 300, 400) === 1, 'sin barrera, la temperatura no cambia k');
});
test('el orden se lee de los datos, no de los coeficientes', () => {
  const r = motor.ordenes([{ conc: { A: 0.2, B: 0.5 }, v: 1 }, { conc: { A: 0.4, B: 0.5 }, v: 1 }, { conc: { A: 0.2, B: 1 }, v: 4 }]);
  assert.equal(r.ordenes.A, 0); assert.equal(r.ordenes.B, 2); assert.equal(r.unidades, 'L/(mol·s)');
});

// 3. Partículas
const correr = (c, s) => { for (let i = 0; i < Math.round(s * 60); i++) c.paso(1 / 60); return c; };
test('teoría de colisiones: la fracción de choques A–B eficaces es p·e^(−Ea/RT)', () => {
  for (const [T, Ea, orientacion] of [[300, 5000, false], [600, 5000, false], [300, 2500, true]]) {
    let ab = 0, ef = 0, teo = 0;
    for (const semilla of [1, 2, 3, 4]) {
      const c = correr(motor.caja({ nA: 40, nB: 40, T, Ea, orientacion, reaccionar: false, semilla }), 2);
      c.reiniciarCuenta(); correr(c, 30);
      ab += c.cuenta.choquesAB; ef += c.cuenta.eficaces; teo = c.fraccionTeorica();
    }
    // Con discos que chocan de verdad y un paso de tiempo finito queda una diferencia de unos pocos por ciento.
    cerca(ef / ab, teo, `T = ${T}, Ea = ${Ea}, orientación ${orientacion}`, 0.08);
  }
});
test('con orientación y sin barrera, dos tercios de los choques A–B están mal orientados', () => {
  const c = correr(motor.caja({ nA: 40, nB: 40, Ea: 0, reaccionar: false, semilla: 4 }), 40);
  cerca(c.cuenta.malOrientados / c.cuenta.choquesAB, 2 / 3, 'mal orientados', 0.08);
});
test('la energía media de traslación es R·T (en dos dimensiones) y sube con T', () => {
  const c = correr(motor.caja({ nA: 60, nB: 60, T: 300, reaccionar: false, semilla: 6 }), 5);
  let s = 0; for (let i = 0; i < 40; i++) { correr(c, 0.25); s += c.energiaMedia(); }
  cerca(s / 40, motor.R * 300, 'E media', 0.1);
});
const producto = (o, s) => { let t = 0; for (const semilla of [1, 2, 3, 4, 5, 6]) { const c = motor.caja({ ...o, semilla }); if (o.cat) c.catalizador(o.cat); t += correr(c, s).contar().C; } return t / 6; };
test('más temperatura, más producto en el mismo tiempo', () => {
  assert.ok(producto({ nA: 30, nB: 30, T: 500 }, 5) > producto({ nA: 30, nB: 30, T: 300 }, 5) * 1.25);
});
test('el catalizador (menos Ea) da más producto en el mismo tiempo', () => {
  assert.ok(producto({ nA: 30, nB: 30, cat: 2000 }, 2) > producto({ nA: 30, nB: 30 }, 2) * 1.6); // a los 2 s, antes de que se gasten
});
test('el doble de A, cerca del doble de choques A–B', () => {
  let a = 0, b = 0;
  for (const semilla of [1, 2, 3]) {
    a += correr(motor.caja({ nA: 20, nB: 20, reaccionar: false, semilla }), 20).cuenta.choquesAB;
    b += correr(motor.caja({ nA: 40, nB: 20, reaccionar: false, semilla }), 20).cuenta.choquesAB;
  }
  cerca(b / a, 2, 'razón de choques', 0.2);
});
test('la caja que reacciona no se enfría: la energía media sigue cerca de R·T', () => {
  const c = correr(motor.caja({ nA: 30, nB: 30, T: 400, semilla: 3 }), 2);
  let s = 0; for (let i = 0; i < 40; i++) { correr(c, 0.25); s += c.energiaMedia(); }
  cerca(s / 40, motor.R * 400, 'E media reaccionando', 0.1);
  assert.ok(c.contar().C > 5, 'reaccionó');
});
test('los discos nacen sin encimarse', () => {
  const c = motor.caja({ nA: 30, nB: 30, semilla: 9 }), l = c.parts;
  for (let i = 0; i < l.length; i++) for (let j = i + 1; j < l.length; j++) assert.ok(Math.hypot(l[i].x - l[j].x, l[i].y - l[j].y) >= 2 * c.r - 1e-12);
});
test('se conserva la materia: A + C y B + C no cambian; todo sigue dentro de la caja', () => {
  const c = correr(motor.caja({ nA: 25, nB: 20, T: 450, semilla: 8 }), 20), n = c.contar();
  assert.equal(n.A + n.C, 25); assert.equal(n.B + n.C, 20); assert.ok(n.C > 0);
  for (const p of c.parts) assert.ok(p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1);
});
test('calentar a mano escala las rapideces con √T', () => {
  const c = motor.caja({ nA: 10, nB: 10, reaccionar: false, semilla: 2 }), e0 = c.energiaMedia();
  c.temperatura(600); cerca(c.energiaMedia() / e0, 2, 'energía al doble de T');
});

// 4. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.velocidad({ k: 1, ordenes: { A: 1 } }, {}), /falta/);
  assert.throws(() => motor.ordenes([{ conc: { A: 1 }, v: 1 }]), /dos experimentos/);
  assert.throws(() => motor.ordenes([{ conc: { A: 1, B: 1 }, v: 1 }, { conc: { A: 2, B: 2 }, v: 4 }]), /solo cambie/);
  assert.throws(() => motor.concentracion(3, 1, 1, 1), /orden/);
  assert.throws(() => motor.tiempo(1, 1, 0.5, 0.8), /mayor/);
  assert.throws(() => motor.perfil({ Ea: 50, dH: -20, EaCat: 60 }), /no sube/);
  assert.throws(() => motor.energiaActivacion(1, 300, 2, 300), /distintas/);
  assert.throws(() => motor.caja({ nA: 1 }).agregar('C', 1), /solo/);
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
