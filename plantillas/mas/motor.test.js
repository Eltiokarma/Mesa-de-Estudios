// Pruebas del motor del MAS. Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Física de verdad, comprobada aquí por separado: la energía Ec + Ep se conserva en todo instante; v es la
//    derivada de x (y a la de v), calculadas por diferencias; a = −ω²x; el movimiento se repite cada T; la sombra del
//    punto del círculo de referencia es x y el punto gira a ω.
// 3. Lo que enseña la escena: el período no depende de la amplitud (O1); el del péndulo no depende de la masa (O3);
//    T crece como √m y como √L, no como m o L; el resorte vertical tiene el mismo período que el horizontal y el
//    ascensor no se lo cambia, pero al péndulo sí; en x = A/2 la cinética es 3/4 de E; en serie la k equivalente es
//    menor que cualquiera y en paralelo mayor.
// 4. Errores de entrada.
// 5. Cada problema de papel.json coincide con el motor.

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
// Atajos para casos.json: resorte(o).enPosicion(x) y resorte(o).estado(t).
const ATAJOS = {
  enPosicionResorte: (o, x) => motor.resorte(o).enPosicion(x),
  estadoResorte: (o, t) => motor.resorte(o).estado(t),
  instantes: o => { const r = motor.resorte(o); return { maximo0: r.proximo(90, 0), maximoDespues: r.proximo(90, 1e-6), centroSubiendo: r.proximo(0, 0), oscilaciones: r.oscilaciones(7 * Math.PI / 10) }; },
};
function llamar(fn, args) {
  if (ATAJOS[fn]) return ATAJOS[fn](...args);
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  return motor[fn](...args);
}
function comprobar(fn, args, espera, que) {
  const r = llamar(fn, args);
  for (const [k, v] of Object.entries(espera)) {
    const x = leer(r, k);
    if (typeof v === 'number') cerca(x, v, `${que} · ${k}`);
    else assert.equal(x, v, `${que} · ${k}: el motor da ${x}, se esperaba ${v}`);
  }
}

// 1. casos.json
test('casos.json tiene el campo verificacion y casos', () => {
  assert.ok('verificacion' in datos);
  assert.ok(datos.casos.length >= 15);
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(c.fn, t.args, t.espera, c.nombre);
});

// 2. Física de verdad
const OSC = [];
for (const m of [0.1, 0.4, 2.5]) for (const k of [10, 40, 250]) for (const A of [0.02, 0.1, 0.35]) for (const phi of [0, 37, 90, 143, 200, 270]) OSC.push({ m, k, A, phi, exacto: true });
test('resorte: Ec + Ep = ½kA² en todo instante, también en vertical', () => {
  for (const o of OSC) for (const orientacion of ['horizontal', 'vertical']) {
    const r = motor.resorte(Object.assign({ orientacion }, o));
    for (let j = 0; j <= 20; j++) {
      const e = r.estado(r.T * j / 13);
      cerca(e.Ec + e.Ep, o.k * o.A * o.A / 2, `E en t = ${e.t}`, 1e-9);
      if (orientacion === 'vertical') {
        // Elástica + gravitatoria = ½kx² + constante (½k·deq²).
        cerca(e.Epe + e.Epg, e.Ep + o.k * r.deq * r.deq / 2, 'Epe + Epg', 1e-9);
      }
    }
  }
});
test('resorte: v es la derivada de x, a la de v, y a = −ω²x; se repite cada T', () => {
  for (const o of OSC) {
    const r = motor.resorte(o), h = r.T * 1e-6;
    for (const f of [0.03, 0.27, 0.5, 0.81]) {
      const t = r.T * f;
      cerca((r.x(t + h) - r.x(t - h)) / (2 * h), r.v(t), 'dx/dt', 1e-6);
      cerca((r.v(t + h) - r.v(t - h)) / (2 * h), r.a(t), 'dv/dt', 1e-6);
      cerca(r.a(t), -r.omega * r.omega * r.x(t), 'a = −ω²x', 1e-9);
      cerca(r.x(t + r.T), r.x(t), 'x(t + T)', 1e-9);
      cerca(r.x(t + 3 * r.T), r.x(t), 'x(t + 3T)', 1e-9);
    }
    cerca(Math.max(...Array.from({ length: 400 }, (_, j) => Math.abs(r.v(r.T * j / 400)))), r.vmax, 'vmax = Aω', 1e-3);
  }
});
test('círculo de referencia: la sombra del punto es x, el punto está a distancia A y gira a ω en sentido antihorario', () => {
  for (const o of OSC) {
    const r = motor.resorte(o), h = r.T * 1e-6;
    for (const f of [0, 0.1, 0.4, 0.66]) {
      const t = r.T * f, P = r.circulo(t);
      cerca(P.px, r.x(t), 'sombra', 1e-9);
      cerca(Math.hypot(P.px, P.py), o.A, 'radio', 1e-9);
      // Rapidez angular: ángulo recorrido en 2h.
      const P1 = r.circulo(t - h), P2 = r.circulo(t + h);
      const giro = Math.atan2(P1.px * P2.py - P1.py * P2.px, P1.px * P2.px + P1.py * P2.py);
      cerca(giro / (2 * h), r.omega, 'ω del punto (positivo: antihorario)', 1e-5);
      // La componente horizontal de la velocidad del punto es v.
      cerca((P2.px - P1.px) / (2 * h), r.v(t), 'velocidad de la sombra', 1e-6);
    }
  }
});
test('soltar desde x0 en reposo: A = |x0| y arranca en el extremo; desde el centro con v0: A = v0/ω', () => {
  for (const x0 of [0.05, -0.12]) {
    const r = motor.resorte({ m: 0.4, k: 40, x0, v0: 0 });
    cerca(r.A, Math.abs(x0), 'A'); cerca(r.x(0), x0, 'x(0)'); cerca(r.v(0), 0, 'v(0)');
  }
  const r = motor.resorte({ m: 0.4, k: 40, x0: 0, v0: -2 });
  cerca(r.A, 0.2, 'A'); cerca(r.v(0), -2, 'v(0)');
  for (const [x0, v0] of [[0.03, 0.4], [-0.07, -0.2], [0.01, -0.9]]) {
    const q = motor.resorte({ m: 1.2, k: 30, x0, v0, exacto: true });
    cerca(q.x(0), x0, 'x(0)'); cerca(q.v(0), v0, 'v(0)');
  }
});

test('proximo(fase, desde) cae en un instante con esa fase y no hay otro antes', () => {
  for (const o of OSC.slice(0, 60)) {
    const r = motor.resorte(o);
    for (const fase of [0, 90, 180, 270]) for (const desde of [0, r.T * 0.3, r.T * 2.7]) {
      const t = r.proximo(fase, desde);
      assert.ok(t >= desde - 1e-12 && t < desde + r.T + 1e-9);
      const d = Math.abs(((r.estado(t).fase - fase) % 360 + 540) % 360 - 180);
      assert.ok(d < 1e-6, `fase ${r.estado(t).fase} en vez de ${fase}`);
    }
  }
});

test('proximo(fase, desde) cae en un instante con esa fase y no hay otro antes', () => {
  for (const o of OSC.slice(0, 60)) {
    const r = motor.resorte(o);
    for (const fase of [0, 90, 180, 270]) for (const desde of [0, r.T * 0.3, r.T * 2.7]) {
      const t = r.proximo(fase, desde);
      assert.ok(t >= desde - 1e-12 && t < desde + r.T + 1e-9);
      const d = Math.abs(((r.estado(t).fase - fase) % 360 + 540) % 360 - 180);
      assert.ok(d < 1e-6, `fase ${r.estado(t).fase} en vez de ${fase}`);
    }
  }
});

// 3. Lo que enseña la escena
test('O1: el período del resorte no depende de la amplitud; vmax y amax crecen en proporción a A', () => {
  for (const A of [0.01, 0.05, 0.1, 0.3]) {
    const c = motor.comparar('resorte', { m: 0.4, k: 40, A: 0.1 }, { m: 0.4, k: 40, A });
    cerca(c.razonT, 1, 'razón de T'); cerca(c.razonVmax, A / 0.1, 'razón de vmax'); cerca(c.razonE, (A / 0.1) ** 2, 'razón de E');
  }
});
test('T del resorte crece como √m y baja como 1/√k (no como m)', () => {
  for (const n of [2, 4, 9]) {
    cerca(motor.comparar('resorte', { m: 0.5, k: 20 }, { m: 0.5 * n, k: 20 }).razonT, Math.sqrt(n), `m × ${n}`);
    cerca(motor.comparar('resorte', { m: 0.5, k: 20 }, { m: 0.5, k: 20 * n }).razonT, 1 / Math.sqrt(n), `k × ${n}`);
  }
});
test('O3: el período del péndulo no depende de la masa ni (en ángulo pequeño) de la amplitud; crece como √L', () => {
  for (const m of [0.05, 0.1, 0.4, 3]) for (const th of [2, 5, 8]) cerca(motor.pendulo({ L: 2.5, m, theta0: th }).T, Math.PI, `m = ${m}, θ = ${th}°`);
  for (const n of [4, 9, 16]) cerca(motor.comparar('pendulo', { L: 1 }, { L: n }).razonT, Math.sqrt(n), `L × ${n}`);
  assert.ok(motor.pendulo({ L: 1, theta0: 10 }).cambioPorAmplitud < 0.002);
  assert.ok(motor.pendulo({ L: 1, theta0: 60 }).cambioPorAmplitud > 0.06, 'con ángulos grandes sí cambia');
});
test('péndulo: la energía del MAS se conserva y vmaxMAS se acerca a la vmax exacta en ángulos pequeños', () => {
  const p = motor.pendulo({ L: 2.5, m: 0.2, theta0: 6 });
  for (let j = 0; j < 12; j++) { const e = p.estado(p.T * j / 11); cerca(e.Ec + e.Ep, p.E, 'E', 1e-9); }
  assert.ok(Math.abs(p.vmaxMAS / p.vmax - 1) < 0.001);
});
test('resorte vertical: mismo período que el horizontal, con cualquier g y en un ascensor; el péndulo sí cambia', () => {
  for (const g of [1.6, 9.8, 10, 25]) for (const ay of [-3, 0, 4]) {
    const h = motor.resorte({ m: 0.7, k: 35, A: 0.04 }), v = motor.resorte({ m: 0.7, k: 35, A: 0.04, orientacion: 'vertical', g, ay });
    cerca(v.T, h.T, `g = ${g}, ay = ${ay}`);
    cerca(v.deq, 0.7 * (g + ay) / 35, 'deq');
  }
  assert.ok(motor.pendulo({ L: 2.5, ay: 2.5 }).T < motor.pendulo({ L: 2.5 }).T, 'acelerando hacia arriba, el péndulo va más rápido');
  assert.ok(motor.pendulo({ L: 2.5, ay: -2.5 }).T > motor.pendulo({ L: 2.5 }).T, 'acelerando hacia abajo, más lento');
  cerca(motor.pendulo({ L: 2.5, ax: 3 }).gef, Math.hypot(10, 3), 'gef con aceleración horizontal');
});
test('energía en x = A/2: siempre 3/4 de cinética y 1/4 de potencial, sin importar m, k ni A', () => {
  for (const o of OSC.slice(0, 40)) {
    const r = motor.resorte(o), e = r.enPosicion(o.A / 2);
    cerca(e.fEc, 0.75, 'fEc'); cerca(e.fEp, 0.25, 'fEp'); cerca(e.v, r.vmax * Math.sqrt(3) / 2, 'v');
    cerca(e.Ec + e.Ep, r.E, 'E');
  }
});
test('serie y paralelo: en serie keq es menor que cada k y en paralelo mayor; en serie cada resorte aguanta la fuerza entera', () => {
  for (const ks of [[10, 40], [25, 25, 50], [7, 3]]) {
    const s = motor.resortes({ k: ks, modo: 'serie', F: 6 }), p = motor.resortes({ k: ks, modo: 'paralelo', F: 6 });
    assert.ok(s.keq < Math.min(...ks)); assert.ok(p.keq > Math.max(...ks));
    cerca(s.cada.reduce((t, q) => t + q.x, 0), s.estiramiento, 'en serie los estiramientos se suman');
    s.cada.forEach(q => cerca(q.F, 6, 'misma fuerza'));
    cerca(p.cada.reduce((t, q) => t + q.F, 0), 6, 'en paralelo las fuerzas se suman');
  }
});

// 4. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.resorte({ m: 0, k: 40, A: 0.1 }), /mayor que cero/);
  assert.throws(() => motor.resorte({ m: 0.4, k: -1, A: 0.1 }), /mayor que cero/);
  assert.throws(() => motor.resorte({ m: 0.4, k: 40, A: -0.1 }), /negativo/);
  assert.throws(() => motor.resorte({ m: 'mucha', k: 40 }), /inválido/);
  assert.throws(() => motor.resorte({ m: 0.4, k: 40, A: 0.1, x0: 0.1 }), /no las dos/);
  assert.throws(() => motor.resorte({ m: 0.4, k: 40, A: 0.1, orientacion: 'diagonal' }), /desconocida/);
  assert.throws(() => motor.resorte({ m: 0.4, k: 40, A: 0.1 }).enPosicion(0.2), /fuera de la amplitud/);
  assert.throws(() => motor.pendulo({ L: 0 }), /mayor que cero/);
  assert.throws(() => motor.pendulo({ L: 1, theta0: 95 }), /menor que 90/);
  assert.throws(() => motor.pendulo({ L: 1, ay: -10 }), /no oscila/);
  assert.throws(() => motor.pendulo({ L: 1, hilo: 0.9 }), /no las dos/);
  assert.throws(() => motor.comparar('cuerda', {}, {}), /desconocido/);
  assert.throws(() => motor.resortes({ k: [], modo: 'serie' }), /al menos un/);
  assert.throws(() => motor.resortes({ k: [10, 20], modo: 'cruzado' }), /desconocido/);
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
