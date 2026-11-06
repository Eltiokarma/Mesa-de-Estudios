// Pruebas del motor de MRUV y gráficas. Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json, verificado con fracciones exactas y otro método,
//    debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Coherencia entre gráficas: la velocidad es la pendiente de x-t y el desplazamiento es el área
//    bajo v-t (se comprueba con diferencias y sumas numéricas, otro método que el del motor).
// 3. Lo que enseña la escena: misma posición no es misma velocidad (K1); en la cima, a = −g (C1);
//    al frenar no se retrocede; el tiempo de caída no depende de la masa (no entra) ni de vx.
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
function llamar(fn, args) {
  if (fn === 'recorrido') { const m = motor.movil(args[0]); return { distancia: m.distancia(args[1], args[2]), desplazamiento: m.desplazamiento(args[1], args[2]) }; }
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  return motor[fn](...args);
}
function comprobar(fn, args, espera, que, tol) {
  const r = llamar(fn, args);
  for (const [k, v] of Object.entries(espera)) {
    const x = k === 'valor' ? r : k === 'largo' ? r.length : r[k];
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    cerca(x, v, `${que} · ${k}`, tol);
  }
}

// 1. casos.json
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre, c.tolerancia);
  for (const t of c.tambien || []) comprobar(c.fn, t.args, t.espera, c.nombre, c.tolerancia);
});

// 2. Coherencia entre gráficas
const MOVILES = [{ v0: 4, a: 2 }, { v0: 20, a: -4, frena: true }, { v0: 30, a: -10 }, { x0: -5, v0: 3, tramos: [{ dur: 2, a: 1.5 }, { dur: 3, a: 0 }, { dur: 2, a: -4 }, { a: 0.5 }] },
  { tramos: [{ dur: 3, a: 2 }, { dur: 4, a: 0 }, { a: -2 }], frena: true }];
test('la velocidad es la pendiente de x-t y la aceleración, la de v-t', () => {
  for (const o of MOVILES) {
    const m = motor.movil(o), h = 1e-5;
    for (const t of [0.3, 1.7, 2.9, 4.4, 6.1, 8.8, 11.2]) {
      // Evita los instantes de cambio de tramo, donde la pendiente cambia de golpe.
      if (m.segmentos.some(s => Math.abs(s.t0 - t) < 1e-3)) continue;
      cerca((m.x(t + h) - m.x(t - h)) / (2 * h), m.v(t), `${JSON.stringify(o)} pendiente de x en ${t}`, 1e-5);
      cerca((m.v(t + h) - m.v(t - h)) / (2 * h), m.a(t), `${JSON.stringify(o)} pendiente de v en ${t}`, 1e-5);
    }
  }
});
test('el desplazamiento es el área bajo v-t y la distancia, el área bajo |v|', () => {
  for (const o of MOVILES) {
    const m = motor.movil(o), n = 40000, T = 12;
    let area = 0, absA = 0;
    for (let k = 0; k < n; k++) { const t = (k + 0.5) * T / n, v = m.v(t); area += v * T / n; absA += Math.abs(v) * T / n; }
    cerca(m.desplazamiento(0, T), area, `${JSON.stringify(o)} desplazamiento`, 1e-6);
    cerca(m.distancia(0, T), absA, `${JSON.stringify(o)} distancia`, 1e-6);
  }
});
test('la posición y la velocidad son continuas en los cambios de tramo', () => {
  for (const o of MOVILES) {
    const m = motor.movil(o);
    for (const s of m.segmentos) if (s.t0 > 0) {
      cerca(m.x(s.t0 - 1e-9), m.x(s.t0 + 1e-9), 'x continua', 1e-6);
      cerca(m.v(s.t0 - 1e-9), m.v(s.t0 + 1e-9), 'v continua', 1e-6);
    }
  }
});

// 3. Lo que enseña la escena
test('K1: en el cruce las velocidades son distintas; con igual velocidad, las posiciones son distintas', () => {
  const A = { v0: 4, a: 2 }, B = { v0: 10 };
  const [, tc] = motor.cruces(A, B, 10), [tv] = motor.igualVelocidad(A, B, 10);
  assert.notEqual(motor.estado(A, tc).v, motor.estado(B, tc).v);
  assert.ok(Math.abs(motor.estado(A, tv).x - motor.estado(B, tv).x) > 1);
});
test('C1: en el punto más alto la velocidad es cero y la aceleración no', () => {
  for (const v0 of [5, 12, 30]) {
    const lv = motor.lanzamientoVertical({ v0 }), m = motor.movil(lv.movil);
    cerca(m.v(lv.tSubida), 0, 'v en la cima'); cerca(m.a(lv.tSubida), -10, 'a en la cima');
    cerca(m.x(lv.tSubida), lv.H, 'altura máxima');
  }
});
test('al frenar no se retrocede: con frena, x nunca baja; sin frena, sí', () => {
  const c = motor.movil({ v0: 20, a: -4, frena: true }), s = motor.movil({ v0: 20, a: -4 });
  let prev = -Infinity;
  for (let t = 0; t <= 12; t += 0.25) { assert.ok(c.x(t) >= prev - 1e-12); prev = c.x(t); }
  assert.ok(s.x(12) < s.x(5));
});
test('cruces encontrados son cruces de verdad', () => {
  const pares = [[{ v0: 4, a: 2 }, { v0: 10 }], [{ x0: 100, v0: -10 }, { a: 2 }], [{ x0: 5, v0: 8, a: -2 }, { x0: 0, v0: 3, a: 0.5 }]];
  for (const [a, b] of pares) for (const t of motor.cruces(a, b, 15)) cerca(motor.estado(a, t).x, motor.estado(b, t).x, 'mismo lugar', 1e-7);
});

// 4. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.movil({ tramos: [] }), /al menos/);
  assert.throws(() => motor.movil({ tramos: [{ dur: -1, a: 1 }] }), /más de cero/);
  assert.throws(() => motor.movil({ tramos: [{ a: 1 }, { dur: 2, a: 0 }] }), /último tramo/);
  assert.throws(() => motor.movil({ v0: 'rápido' }), /inválido/);
  assert.throws(() => motor.pendiente(1, 2, 1, 5), /mismo tiempo/);
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
