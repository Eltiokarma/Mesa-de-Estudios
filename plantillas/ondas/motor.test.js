// Pruebas del motor de ondas. Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades físicas, comprobadas aquí por separado:
//    - la onda viajera cumple la ecuación de onda (∂²y/∂t² = v²·∂²y/∂x²) y su forma se traslada sin cambiar (ON10);
//    - la rapidez no depende de la amplitud ni de la frecuencia, solo de T y μ (ON1, ON2, ON3, ON4);
//    - cada punto de la cuerda solo sube y baja: su y-t es la misma curva con un retraso x/v (ON5);
//    - al cambiar de medio, f se conserva y la amplitud es continua en la unión (1 + r = t);
//    - la cuerda con la mano y la unión: la suma de reflexiones da una cuerda continua en la unión;
//    - dos pulsos se suman punto por punto y salen intactos (ON7);
//    - la onda estacionaria es la suma de dos viajeras opuestas y es cero en los nodos (ON8);
//    - los decibeles: dos fuentes iguales suben unos 3 dB; diez veces la intensidad, 10 dB.
// 3. Errores de entrada.
// 4. Cada problema de papel.json coincide con el motor (regla 6).

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
const TOL = datos.tolerancia;
function cerca(real, esperado, que, tol) {
  const t = tol === undefined ? TOL : tol;
  assert.ok(typeof real === 'number' && Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
const leer = (o, k) => k.split('.').reduce((x, p) => (x === null || x === undefined ? undefined : x[p]), o);
function comprobar(fn, args, espera, que, llamar) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  let r = motor[fn](...args);
  if (llamar) r = r[llamar[0]](...llamar.slice(1));
  if (espera === null || typeof espera !== 'object') {
    if (typeof espera === 'number') cerca(r, espera, que); else assert.equal(r, espera, que);
    return;
  }
  for (const [k, v] of Object.entries(espera)) {
    const x = leer(r, k);
    if (typeof v === 'number') cerca(x, v, `${que} · ${k}`);
    else assert.equal(x, v, `${que} · ${k}: el motor da ${x}, se esperaba ${v}`);
  }
}

// 1. casos.json
for (const c of datos.casos) test(c.nombre, () => comprobar(c.fn, c.args, c.espera, c.nombre));

// 2. Propiedades
const segunda = (f, z, h) => (f(z + h) - 2 * f(z) + f(z - h)) / (h * h);
test('la onda viajera cumple la ecuación de onda y su forma se traslada sin cambiar (ON10)', () => {
  for (const [A, f, T, mu] of [[0.02, 100, 100, 0.01], [0.05, 7, 40, 0.1], [0.01, 330, 900, 0.004]]) {
    const o = motor.onda({ A, f, T, mu }), v = o.v;
    for (const x of [0.1, 0.37, 1.2]) for (const t of [0.001, 0.013]) {
      const h = o.lambda / 2000, ht = o.periodo / 2000;
      const ytt = segunda(s => o.y(x, s), t, ht), yxx = segunda(s => o.y(s, t), x, h);
      cerca(ytt, v * v * yxx, `ecuación de onda f=${f}`, 2e-4);
      // La foto en t + Δt es la de t corrida v·Δt.
      for (const dt of [0.0007, 0.004]) cerca(o.y(x + v * dt, t + dt), o.y(x, t), 'traslación', 1e-9);
    }
    // u es la derivada temporal de y.
    const x = 0.3, t = 0.002, d = o.periodo / 1e5;
    cerca(o.u(x, t), (o.y(x, t + d) - o.y(x, t - d)) / (2 * d), 'u = ∂y/∂t', 1e-5);
  }
  const p = motor.pulso({ A: 0.05, ancho: 0.2, v: 30 });
  for (const t of [0, 0.01, 0.05]) cerca(p.y(p.centro(t), t), 0.05, 'el pico del pulso no se achica');
});
test('ON1 a ON4: la rapidez solo depende de T y μ; la amplitud y la frecuencia no la cambian', () => {
  for (const T of [25, 100, 400]) for (const mu of [0.005, 0.01, 0.04]) {
    const v = motor.cuerda({ T, mu }).v;
    cerca(v * v * mu, T, 'v² = T/μ');
    for (const A of [0.01, 0.1]) for (const f of [10, 50, 200]) {
      const o = motor.onda({ A, f, T, mu });
      cerca(o.v, v, 'v de la onda'); cerca(o.lambda * o.f, v, 'λ·f = v');
    }
    // Más μ con la misma T: más lenta.
    assert.ok(motor.cuerda({ T, mu: mu * 2 }).v < v);
  }
  const c = motor.carrera({ L: 3, base: { A: 0.05, ancho: 0.2, T: 100, mu: 0.01 }, cambios: [{ nombre: 'alta', cambio: { A: 0.3 } }, { nombre: 'angosta', cambio: { ancho: 0.05 } }] });
  assert.deepEqual(c.igualQueBase.sort(), ['alta', 'angosta', 'base']);
});
test('ON5: cada punto de la cuerda solo sube y baja, y repite el movimiento de la mano con un retraso x/v', () => {
  const m = motor.mano({ A: 0.02, f: 100, T: 100, mu: 0.01 });
  for (const x of [0.25, 0.5, 1.5]) {
    for (let t = 0; t < 0.03; t += 0.0013) cerca(m.y(x, t), m.h(t - x / m.v), `retraso en x=${x}`);
    // Antes de que llegue el frente, el punto está quieto.
    assert.equal(m.y(x, x / m.v * 0.99), 0);
    // Nunca pasa de la amplitud.
    for (let t = 0; t < 0.05; t += 0.0007) assert.ok(Math.abs(m.y(x, t)) <= 0.02 + 1e-12);
  }
  cerca(m.frente(0.015), 1.5, 'frente');
  // Sonido: cada capa de aire se aleja como máximo A de su lugar y vuelve.
  const s = motor.longitudinal({ A: 0.01, f: 170, v: 340 });
  for (let t = 0; t < 0.05; t += 0.0011) assert.ok(Math.abs(s.posicion(0.4, t) - 0.4) <= 0.01 + 1e-12);
});
test('cambio de medio: f se conserva, v y λ cambian, y la amplitud es continua en la unión (1 + r = t)', () => {
  for (const [v1, v2] of [[100, 50], [50, 100], [80, 80], [30, 270]]) {
    const r = motor.cambioMedio({ f: 25, v1, v2 });
    cerca(r.f2, 25, 'f'); cerca(r.lambda2 / r.lambda1, v2 / v1, 'λ ∝ v'); cerca(1 + r.r, r.t, '1 + r = t');
  }
  // La cuerda con la mano: continua en la unión y con el reflejo donde dice r.
  const g = t => (t < 0 || t > 0.004 ? 0 : Math.sin(Math.PI * t / 0.004));
  for (const [v1, v2] of [[100, 50], [50, 100]]) {
    const c = motor.cuerdaConMano({ v1, v2, d: 1, h: g });
    for (let t = 0; t < 0.12; t += 0.0017) cerca(c.y(1 - 1e-9, t), c.y(1 + 1e-9, t), `continua en la unión t=${t}`, 1e-6);
    // El pulso reflejado vuelve a x = 0,5 con el factor r.
    const tR = 1.5 / v1 + 0.002;
    cerca(c.y(0.5, tR), c.r, 'reflejado');
    // El transmitido viaja a v2.
    cerca(c.y(1 + v2 * 0.01, 1 / v1 + 0.01 + 0.002), c.t, 'transmitido');
    // En x = 0 manda la mano.
    for (let t = 0; t < 0.12; t += 0.0031) cerca(c.y(0, t), g(t), 'la mano manda', 1e-9);
  }
  // Sin unión, la cuerda es la onda de la mano.
  const m = motor.mano({ A: 0.02, f: 40, v: 20 }), c = motor.cuerdaConMano({ v1: 20, h: m.h });
  for (const x of [0, 0.3, 1.1]) for (const t of [0.01, 0.07]) cerca(c.y(x, t), m.y(x, t), 'sin unión');
});
test('ON7: dos pulsos se suman punto por punto mientras se cruzan y salen intactos', () => {
  const p = motor.dosPulsos({ A1: 0.02, A2: -0.02, ancho: 0.3, v: 1, x1: 0, x2: 4 });
  for (let x = 0; x <= 4; x += 0.25) for (const t of [1, 1.8, 2, 2.3]) cerca(p.y(x, t), p.y1(x, t) + p.y2(x, t), 'suma');
  for (let x = 0; x <= 4; x += 0.1) cerca(p.y(x, 2), 0, 'plana en el cruce', 1e-9);
  // Mucho después, cada pico vuelve a valer lo mismo que al principio.
  cerca(p.y(4, 4), 0.02, 'pulso 1 sale intacto', 1e-6);
  cerca(p.y(0, 4), -0.02, 'pulso 2 sale intacto', 1e-6);
});
test('ON8: la estacionaria es la suma de dos ondas opuestas, vale cero en los nodos y sus frecuencias crecen con √T', () => {
  for (const n of [1, 2, 3, 5]) {
    const e = motor.estacionaria({ L: 2, v: 100, n, A: 0.01 });
    const ida = motor.onda({ A: 0.01, f: e.f, v: 100, phi: Math.PI / 2 });
    for (const x of [0.13, 0.7, 1.55]) for (const t of [0.001, 0.0077]) cerca(e.y(x, t), ida.y(x, t) - ida.y(x, -t), 'suma de dos viajeras', 1e-9);
    for (const x of e.nodos) for (const t of [0.003, 0.011]) cerca(e.y(x, t), 0, `nodo en ${x}`, 1e-9);
    for (const x of e.vientres) cerca(e.amplitud(x), 0.02, 'vientre');
    assert.equal(e.nodos.length, n + 1); assert.equal(e.vientres.length, n);
    cerca(e.lambda * e.f, 100, 'λ·f = v');
  }
  for (const k of [4, 9, 16]) cerca(motor.estacionaria({ L: 2, T: 100 * k, mu: 0.01 }).f, 25 * Math.sqrt(k), `T × ${k}`);
});
test('decibeles: dos fuentes iguales suben 10·log 2; diez veces la intensidad, 10 dB; al doble de distancia, −6 dB (con log 2 = 0,3)', () => {
  for (const b of [40, 60, 80, 100]) {
    cerca(motor.sumarNiveles({ niveles: [b, b] }).beta - b, 10 * Math.log10(2), `dos de ${b}`);
    cerca(motor.sumarNiveles({ niveles: [b, b] }).betaAcademia, b + 3, `dos de ${b}, academia`);
    cerca(motor.nivel({ I: motor.intensidad({ beta: b }).I * 10 }).beta, b + 10, 'diez veces');
    cerca(motor.distancia({ beta: b, r1: 3, r2: 6 }).beta2Academia, b - 6, 'doble distancia');
    cerca(motor.nivel({ I: motor.intensidad({ beta: b }).I }).beta, b, 'ida y vuelta', 1e-9);
  }
  cerca(motor.logAcademia(8e-5), 3 * 0.3 - 5, 'log 8·10⁻⁵');
  cerca(motor.logAcademia(7), Math.log10(7), 'log 7 exacto');
});
test('Doppler: acercarse sube la frecuencia, alejarse la baja; sin movimiento no cambia', () => {
  assert.equal(motor.doppler({ f: 400, vs: 20 }).sube, true);
  assert.equal(motor.doppler({ f: 400, vo: 20 }).sube, true);
  assert.equal(motor.doppler({ f: 400, vs: -20 }).sube, false);
  cerca(motor.doppler({ f: 400 }).fp, 400, 'quietos');
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.cuerda({ T: -1, mu: 0.01 }));
  assert.throws(() => motor.cuerda({ T: 100 }));
  assert.throws(() => motor.onda({ A: 1 }));
  assert.throws(() => motor.estacionaria({ L: 0, v: 10 }));
  assert.throws(() => motor.tubo({ L: 1, tipo: 'cerrado', n: 2 }));
  assert.throws(() => motor.nivel({ I: 0 }));
  assert.throws(() => motor.doppler({ f: 100, vs: 400 }));
  assert.throws(() => motor.dosPulsos({ A1: 1, A2: 1, ancho: 1, v: 1, x1: 3, x2: 1 }));
  assert.throws(() => motor.cuerdaConMano({ v1: 10, h: 3 }));
  assert.throws(() => motor.sumarNiveles({ niveles: [] }));
});

// 4. Problemas de papel (regla 6)
const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
test('papel.json: entre 5 y 10 problemas, con respuesta, pasos y verificación', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  const ids = new Set();
  for (const p of papel.problemas) {
    assert.ok(p.id && !ids.has(p.id)); ids.add(p.id);
    assert.ok(p.enunciado && p.respuesta && p.nivel);
    assert.ok(Array.isArray(p.pasos) && p.pasos.length >= 2);
    assert.ok(Array.isArray(p.verificar) && p.verificar.length >= 1);
  }
});
for (const p of papel.problemas) test(`papel ${p.id}: la respuesta coincide con el motor`, () => {
  for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, `papel ${p.id}`, v.llamar);
});
