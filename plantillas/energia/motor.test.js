// Pruebas del motor de Trabajo, energía y potencia. Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json, verificado con fracciones exactas y otro método,
//    debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Conservación: a lo largo de cualquier rampa sin roce, Ec + Ep no cambia; en la rampa con
//    resorte, la energía se reparte entre Ep, Ec, Ee y lo que se lleva el roce.
// 3. Lo que la escena enseña también vale en el motor: la rapidez abajo no depende de la masa (W9)
//    ni de la forma de la rampa; el trabajo para subir no depende del camino (W1, W2); a velocidad
//    constante, el trabajo neto es cero (W5); la rapidez al llegar no depende del ángulo (W10);
//    misma fuerza y misma distancia dan la misma energía cinética, sea cual sea la masa (W6).
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
  if (typeof esperado === 'boolean') { assert.equal(real, esperado, que); return; }
  assert.ok(Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)),
    `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
// Llama a motor[fn](...args); recorrido recibe { perfil: [forma, h, L] }.
function llamar(fn, args) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  if (fn === 'recorrido') return motor.recorrido(motor.perfil(...args[0].perfil), args[0].n);
  return motor[fn](...args);
}
const campo = (r, k) => (k === 'valor' ? r : k.split('.').reduce((o, p) => (o == null ? o : o[p]), r));
function comprobar(fn, args, espera, que, tol) {
  const r = llamar(fn, args);
  for (const [k, v] of Object.entries(espera)) {
    const x = campo(r, k);
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    cerca(x, v, `${que} · ${k}`, tol);
  }
  return r;
}

// 1. casos.json
for (const c of datos.casos) {
  test(c.nombre, () => {
    comprobar(c.fn, c.args, c.espera, c.nombre, c.tolerancia);
    for (const t of c.tambien || []) comprobar(c.fn, t.args, t.espera, c.nombre, c.tolerancia);
  });
}

// 2. Conservación
test('en cualquier rampa sin roce, Ec + Ep se conserva punto a punto', () => {
  for (const forma of ['recta', 'curva', 'lomas']) for (const [m, h] of [[2, 1], [5, 3]]) {
    const r = motor.recorrido(motor.perfil(forma, h, 4));
    assert.ok(r.llega, `${forma}: el bloque debe llegar abajo`);
    for (const p of r.puntos) {
      const e = motor.energias({ m, y: p.y, v: p.v });
      cerca(e.Ep + e.Ec, m * motor.G * h, `${forma}, m = ${m}: energía en x = ${p.x}`);
    }
    // El tiempo crece y la rapidez final es la misma con cualquier forma.
    assert.ok(r.puntos.every((p, k) => k === 0 || p.t > r.puntos[k - 1].t));
    cerca(r.vFinal ** 2, 2 * motor.G * h, `${forma}: v² abajo`);
  }
});

test('rampa con resorte y roce: la energía inicial = roce + elástica', () => {
  for (const [mu, d] of [[0, 0], [0.2, 1], [0.5, 1.5]]) {
    const r = motor.rampaResorte({ m: 3, h: 2, k: 800, mu, d });
    cerca(r.E, -r.Wroce + 0.5 * 800 * r.x2, `μ = ${mu}, d = ${d}`);
  }
});

test('movimiento: en cada instante Ep + Ec + Ee + roce = mgh, y termina donde dice rampaResorte', () => {
  for (const o of [{ m: 2, h: 1, k: 1000 }, { m: 4, h: 2, k: 600, forma: 'lomas' }, { m: 3, h: 1.5, k: 900, mu: 0.3, d: 1.2, forma: 'recta' }, { m: 2, h: 1, k: 1000, mu: 0.5, d: 3 }]) {
    const mv = motor.movimiento(o), r = motor.rampaResorte(o);
    for (let j = 0; j <= 200; j++) {
      const e = mv.en(mv.duracion * j / 200);
      cerca(e.Ep + e.Ec + e.Ee + e.Eroce, r.E, `${JSON.stringify(o)} en t = ${e.X}`, 1e-6);
    }
    const fin = mv.en(mv.duracion);
    cerca(fin.v, 0, 'termina quieto', 1e-6);
    if (r.seDetiene) { assert.ok(mv.para); cerca(mv.d, r.dDetiene, 'se detiene donde dice rampaResorte'); }
    else cerca(fin.comp ** 2, r.x2, 'compresión máxima', 1e-9);
  }
});

// 3. Lo que enseña la escena
test('W9: la rapidez al pie de la rampa no depende de la masa', () => {
  const v = [1, 2, 4, 50].map(m => motor.rampaResorte({ m, h: 1.8, k: 500 }).v2);
  v.forEach(x => cerca(x, v[0], 'v²'));
});

test('W1 y W2: el trabajo para subir a velocidad constante es el mismo por cualquier plano', () => {
  for (const ang of [30, 37, 45, 53, 60, 90]) {
    const { sen } = motor.notable(ang);
    const r = motor.trabajos({ m: 10, d: 3 / sen, angulo: ang, F: 'constante' });
    cerca(r.WF, 300, `plano de ${ang}°`);
    assert.ok(r.F <= 100 + 1e-9, 'la fuerza nunca es mayor que el peso');
  }
});

test('W5: a velocidad constante, el trabajo neto es cero y la fuerza iguala al roce', () => {
  for (const [m, mu, d] of [[5, 0.4, 10], [12, 0.25, 3], [1, 0.9, 7]]) {
    const r = motor.trabajos({ m, d, mu, F: 'constante' });
    cerca(r.Wneto, 0, 'trabajo neto'); cerca(r.WF, -r.Wroce, 'WF = −Wroce'); cerca(r.F, r.roce, 'F = roce');
  }
});

test('W6: misma fuerza y misma distancia, misma energía cinética final', () => {
  const ec = [1, 3, 9].map(m => { const r = motor.trabajos({ m, d: 4, F: 15, v0: 0 }); return 0.5 * m * r.v2; });
  ec.forEach(e => cerca(e, 60, 'Ec final'));
});

test('W10: la rapidez al llegar al suelo no depende del ángulo de lanzamiento', () => {
  for (const ang of [-60, -37, 0, 15, 37, 53, 80]) {
    const r = motor.lanzamiento({ v0: 12, angulo: ang, h0: 15 });
    cerca(r.vFinal, Math.hypot(r.vxFinal, r.vyFinal), `${ang}°: rapidez por componentes`);
    cerca(r.vFinal ** 2, 144 + 300, `${ang}°: v²`);
    cerca(r.puntos[r.puntos.length - 1][1], 0, 'termina en el suelo');
  }
});

test('potencia: P = F·v y la eficiencia divide', () => {
  const r = motor.potencia({ m: 75, h: 20, t: 8, eficiencia: 0.6 });
  cerca(r.Putil, r.F * r.v, 'P = F·v'); cerca(r.Pconsumida * 0.6, r.Putil, 'útil = eficiencia × consumida');
});

test('trabajoResorte coincide con el área bajo F = kx', () => {
  cerca(motor.trabajoResorte(200, 0.1, 0.3), motor.trabajoArea([[0, 0], [0.3, 60]], 0.1, 0.3), 'área del trapecio');
});

// 4. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.perfil('espiral', 1, 3), /desconocida/);
  assert.throws(() => motor.rampaResorte({ m: -1, h: 1, k: 10 }), /inválid/);
  assert.throws(() => motor.trabajos({ m: 1, d: 1, sentido: 'de lado' }), /sentido/);
  assert.throws(() => motor.potencia({ m: 1, h: 1, t: 1, eficiencia: 1.5 }), /eficiencia/);
  assert.throws(() => motor.potencia({ m: 1, h: 1, t: 0 }), /tiempo/);
  assert.throws(() => motor.trabajoArea([[0, 1]]), /dos puntos/);
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
for (const p of (papel && papel.problemas) || []) {
  test(`papel ${p.id}: la respuesta coincide con el motor`, () => {
    for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id);
  });
}
