// Pruebas del motor de «El imán, la espira y el foquito». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con datos al azar (semilla fija): la fem de Faraday crece con N y con ΔΦ, baja con Δt y es cero si
//    el flujo no cambia, valga lo que valga; el sentido de Lenz coincide con el campo que crea esa corriente sumado
//    tramo a tramo (Biot–Savart) y siempre se opone al CAMBIO del flujo; la espira repele al imán que se acerca y
//    atrae al que se aleja, con cualquier polo; la fem del imán es −N por la derivada numérica del flujo, su integral
//    da −N·ΔΦ y no depende de lo rápido que se recorra el camino; la barra cumple P = F·v = ε·I; el generador da una
//    fem que es −N·dΦ/dt y cuyo valor cuadrático medio es εmax/√2; el transformador conserva la potencia y con
//    continua no da nada; el flujo con el ángulo desde el plano es el del complemento.
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
  if (Array.isArray(esperado)) { assert.ok(Array.isArray(real), `${que}: no es lista`); assert.equal(real.length, esperado.length, `${que}: largo`); esperado.forEach((e, k) => cerca(real[k], e, `${que}[${k}]`, t)); return; }
  if (esperado && typeof esperado === 'object') { for (const [k, v] of Object.entries(esperado)) cerca(real[k], v, `${que}.${k}`, t); return; }
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(typeof real === 'number' && Math.abs(real - esperado) <= t * Math.abs(esperado) + (esperado === 0 ? 1e-15 : 0),
    `${que}: el motor da ${real}, se esperaba ${esperado}`);
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
test('casos.json: formato y casos pedidos', () => {
  assert.equal(datos.plantilla, 'induccion');
  assert.ok(datos.casos.length >= 16, 'al menos 16 casos');
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
  const nombres = datos.casos.map(c => c.nombre).join(' ');
  for (const t of ['QUIETO', '−1/125 Wb', 'ε = 4 V', 'ε = 2 V', '55 V e Is = 2 A', 'PILA', 'ELEVADOR', '60°', '37°', 'eficaz', 'ACERCA', 'ALEJA', 'polo S', 'CORTADA', 'Área que cambia', 'mitad del tiempo'])
    assert.ok(nombres.includes(t), `falta el caso pedido: ${t}`);
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
const rnd = motor.azar(2026);
const al = (a, b) => a + (b - a) * rnd();
const N_ = 300;

test('Faraday: |ε| = N·|ΔΦ|/Δt, proporcional a N y a ΔΦ, inversa a Δt; cero si el flujo no cambia, por grande que sea', () => {
  for (let k = 0; k < N_; k++) {
    const N = Math.round(al(1, 500)), P0 = al(-1, 1) * 1e-2, P1 = al(-1, 1) * 1e-2, dt = al(0.01, 2), R = al(1, 50);
    const r = motor.faraday(N, P0, P1, dt, R);
    cerca(r.femModulo, N * Math.abs(P1 - P0) / dt, '|ε|', 1e-9);
    cerca(motor.faraday(2 * N, P0, P1, dt).femModulo, 2 * r.femModulo, '2N', 1e-9);
    cerca(motor.faraday(N, P0, P0 + 2 * (P1 - P0), dt).femModulo, 2 * r.femModulo, '2ΔΦ', 1e-8);
    cerca(motor.faraday(N, P0, P1, dt / 2).femModulo, 2 * r.femModulo, 'Δt/2', 1e-9);
    cerca(r.I, r.femModulo / R, 'I = ε/R', 1e-9);
    assert.equal(Math.sign(r.fem), -Math.sign(P1 - P0) || 0, 'signo de Lenz: ε contra ΔΦ');
    const q = motor.faraday(N, P0, P0, dt, R);
    assert.equal(q.fem, 0); assert.equal(q.I, 0);
    assert.equal(motor.faraday(N, P0, P1, dt, 'abierta').I, 0, 'espira cortada: sin corriente');
  }
});

// Campo en el centro de una espira circular (plano yz, centro en el origen) por Biot–Savart, con la corriente que
// gira en 'sentido' visto desde el lado del imán (x < 0, mirando hacia +x). Devuelve el signo de Bx.
function bxEspira(sentido) {
  // Visto desde x < 0 mirando hacia +x, la derecha del observador es −y... se arma con la regla: el observador mira
  // hacia +x con «arriba» = +z; su derecha es −y. Antihorario para él: de arriba (+z) hacia su izquierda (+y).
  const n = 720, R = 0.02; let Bx = 0;
  for (let k = 0; k < n; k++) {
    const a = k / n * 2 * Math.PI, a2 = (k + 1) / n * 2 * Math.PI;
    // punto en la espira: (0, y, z) = (0, R sen a, R cos a): con a creciente va de +z hacia +y (antihorario para él)
    const P = { y: R * Math.sin(a), z: R * Math.cos(a) }, Q = { y: R * Math.sin(a2), z: R * Math.cos(a2) };
    let dl = { x: 0, y: Q.y - P.y, z: Q.z - P.z };
    if (sentido === 'horario') dl = { x: 0, y: -dl.y, z: -dl.z };
    const r = { x: 0, y: -P.y, z: -P.z };   // del tramo al centro
    Bx += dl.y * r.z - dl.z * r.y;            // (dl × r)_x
  }
  return Math.sign(Bx);
}
test('Lenz: el sentido «visto desde el imán» crea, por Biot–Savart, el campo inducido que dice el motor; siempre contra el CAMBIO del flujo', () => {
  assert.equal(bxEspira('antihorario'), -1, 'antihorario visto desde el imán: el campo apunta hacia el imán (−x)');
  for (let k = 0; k < N_; k++) {
    const s = rnd() < 0.5 ? -1 : 1, P0 = s * al(1e-6, 1e-4), P1 = s * al(1e-6, 1e-4), r = motor.lenz(P0, P1);
    assert.equal(bxEspira(r.sentido), r.Binducido, 'Biot–Savart');
    assert.equal(r.Binducido, -Math.sign(P1 - P0), 'contra ΔΦ');
    assert.equal(r.refuerza, Math.abs(P1) < Math.abs(P0), 'refuerza si el flujo disminuye');
    assert.equal(r.fuerza, Math.abs(P1) > Math.abs(P0) ? 'repele' : 'atrae', 'se opone al movimiento del imán');
    assert.equal(r.polo, s > 0 ? 'N' : 'S');
    assert.notEqual(r.errores.alReves.sentido, r.sentido);
    if (r.refuerza) assert.notEqual(r.errores.contraElCampo.sentido, r.sentido, 'MG9 falla justo cuando el flujo disminuye');
    else assert.equal(r.errores.contraElCampo.sentido, r.sentido, 'MG9 acierta por casualidad cuando el flujo aumenta');
    // el signo de la fem de Faraday dice lo mismo: ε < 0 ⇔ antihorario visto desde el imán
    const f = motor.faraday(1, P0, P1, 1);
    assert.equal(f.fem < 0, r.sentido === 'antihorario');
  }
  assert.equal(motor.lenz(5e-5, 5e-5).sentido, 'ninguno');
});

const MOV = { d0: 0.15, d1: 0.03, t0: 0.2, T: 1.5 };
test('imán: ε es −N·dΦ/dt (derivada numérica), quieto da cero y la integral de ε da −N·ΔΦ', () => {
  const N = 200;
  for (let k = 0; k < 200; k++) {
    const t = al(0, 2.4), h = 1e-4, a = motor.movimientoIman(t - h, MOV), b = motor.movimientoIman(t + h, MOV), m = motor.movimientoIman(t, MOV);
    if (t - h < MOV.t0 && t + h > MOV.t0) continue;
    const num = -N * (motor.flujoIman(b.d, {}) - motor.flujoIman(a.d, {})) / (2 * h);
    const e = motor.femIman(m.d, m.vd, {}, N).fem;
    assert.ok(Math.abs(e - num) <= 1e-4 * Math.abs(num) + 1e-6, `ε(${t}): ${e} contra ${num}`);
    if (t > MOV.t0 + MOV.T || t < MOV.t0) assert.equal(motor.femIman(m.d, m.vd, {}, N).fem, 0, 'quieto: cero');
  }
  const s = motor.serieIman(MOV, {}, N, 20, 2.6, 2600);
  let integral = 0;
  for (let j = 1; j < s.puntos.length; j++) integral += (s.puntos[j].fem + s.puntos[j - 1].fem) / 2 * (s.puntos[j].t - s.puntos[j - 1].t);
  cerca(integral, -N * s.dPhi, '∫ε dt = −NΔΦ', 1e-4);
  assert.ok(s.puntos.every(p => p.t < MOV.t0 + MOV.T || p.fem === 0), 'después de detenerse, ε = 0');
  // el pico no está donde el flujo es mayor (al final) ni donde el imán va más rápido (a la mitad)
  assert.ok(s.tMax > MOV.t0 + MOV.T / 2 + 0.2 && s.tMax < MOV.t0 + MOV.T - 0.05, `pico en ${s.tMax}`);
  // femEntre para pasos chicos coincide con femIman
  const m = motor.movimientoIman(1.5, MOV), m2 = motor.movimientoIman(1.5 + 1e-5, MOV);
  cerca(motor.femEntre(m.d, m2.d, 1e-5, {}, N).fem, motor.femIman(m.d, m.vd, {}, N).fem, 'femEntre', 1e-3);
  // con el polo S, todo cambia de signo
  cerca(motor.femIman(0.05, -0.2, { polo: 'S' }, N).fem, -motor.femIman(0.05, -0.2, {}, N).fem, 'polo S');
});
test('el mismo recorrido f veces más rápido: el pico se multiplica por f, ΔΦ no cambia', () => {
  for (const f of [0.5, 1.5, 2, 3, 4]) {
    const r = motor.cambioRapidez(MOV, {}, 200, f);
    cerca(r.razon, f, `razón con f = ${f}`, 1e-6); cerca(r.dPhi1, r.dPhi0, 'ΔΦ igual');
  }
});
test('barra: ε = B·L·v coincide con −ΔΦ/Δt del área que crece; F = B·I·L frena y P = F·v = ε·I', () => {
  for (let k = 0; k < N_; k++) {
    const B = al(0.05, 2), L = al(0.05, 1), v = al(0.1, 20), R = al(0.5, 30), x0 = al(0, 1), dt = al(1e-3, 0.5);
    const r = motor.femMovimiento(B, L, v, R, { campo: rnd() < 0.5 ? 'entra' : 'sale' });
    const e = motor.barraEntre(B, L, x0, x0 + v * dt, dt, R);
    cerca(e.femModulo, r.fem, 'ε', 1e-8); cerca(e.F, r.F, 'F', 1e-8);
    cerca(r.P, r.Pelectrica, 'P = εI', 1e-9); cerca(r.F, B * B * L * L * v / R, 'B²L²v/R', 1e-9);
    assert.equal(r.fuerza, 'frena');
  }
  assert.equal(motor.femMovimiento(0.5, 0.4, 10, 4, { campo: 'sale' }).sentido, 'horario');
  assert.equal(motor.femMovimiento(0.5, 0.4, 10, 4, { campo: 'entra', haciaDerecha: false }).sentido, 'horario');
});
test('generador: ε = −N·dΦ/dt y su valor cuadrático medio en un periodo es εmax/√2', () => {
  for (let k = 0; k < 40; k++) {
    const N = Math.round(al(1, 300)), B = al(0.05, 1), A = al(0.001, 0.1), w = al(10, 400), g = motor.generador(N, B, A, w);
    const t = al(0, g.T), h = g.T * 1e-6;
    const num = -N * (motor.femGenerador(N, B, A, w, t + h).Phi - motor.femGenerador(N, B, A, w, t - h).Phi) / (2 * h);
    cerca(motor.femGenerador(N, B, A, w, t).fem, num, 'ε = −NdΦ/dt', 1e-5 * Math.max(1, g.femMax / Math.max(1e-9, Math.abs(num))));
    let s = 0; const n = 4000;
    for (let j = 0; j < n; j++) { const e = motor.femGenerador(N, B, A, w, (j + 0.5) / n * g.T).fem; s += e * e; }
    cerca(Math.sqrt(s / n), g.eficaz, 'eficaz', 1e-6);
  }
});
test('transformador: Vp·Ip = Vs·Is, Vs/Vp = Ns/Np; con continua, nada', () => {
  for (let k = 0; k < N_; k++) {
    const Np = Math.round(al(10, 3000)), Ns = Math.round(al(10, 3000)), Vp = al(1, 500), Ip = al(0.01, 10);
    const r = motor.transformador(Np, Ns, Vp, Ip);
    cerca(r.Vs / Vp, Ns / Np, 'razón', 1e-9); cerca(r.Pp, r.Ps, 'potencia', 1e-9);
    assert.equal(r.tipo, Ns > Np ? 'elevador' : Ns < Np ? 'reductor' : 'igual');
    const c = motor.transformador(Np, Ns, Vp, Ip, { continua: true });
    assert.equal(c.Vs, 0); assert.equal(c.Is, 0);
  }
});
test('flujo: el ángulo desde el plano es el complemento; cosenos de academia exactos', () => {
  for (let k = 0; k < N_; k++) {
    const B = al(0, 2), A = al(0, 0.5), a = al(0, 90);
    cerca(motor.flujoPlano(B, A, a).Phi, motor.flujo(B, A, 90 - a).Phi, 'complemento', 1e-9);
    cerca(motor.flujo(B, A, a).Phi, motor.flujo(B, A, -a).Phi, 'simétrico', 1e-9);
  }
  assert.equal(motor.cosGrados(60), 0.5); assert.equal(motor.cosGrados(37), 0.8); assert.equal(motor.cosGrados(53), 0.6);
  assert.equal(motor.cosGrados(90), 0); assert.equal(motor.senGrados(30), 0.5);
});
test('líneas del imán: salen del norte y siguen el campo', () => {
  const im = { x: -0.1, y: 0, largo: 0.08, ang: 0 };
  const ls = motor.lineasIman(im, 10, { x0: -0.3, x1: 0.2, y0: -0.12, y1: 0.12 });
  assert.ok(ls.length >= 6);
  for (const l of ls) {
    assert.ok(Math.hypot(l[0].x + 0.06, l[0].y) < 0.01, 'empieza junto al norte');
    for (let k = 3; k < l.length - 1; k += 15) {
      const B = motor.campoIman(im, l[k]), t = { x: l[k + 1].x - l[k].x, y: l[k + 1].y - l[k].y };
      assert.ok((B.x * t.x + B.y * t.y) / (B.modulo * Math.hypot(t.x, t.y)) > 0.98, 'tangente al campo');
    }
  }
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.flujo('1', 1), /número/);
  assert.throws(() => motor.flujo(1, -1), /negativo/);
  assert.throws(() => motor.faraday(0, 0, 1, 1), /mayor que cero/);
  assert.throws(() => motor.faraday(10, 0, 1, 0), /mayor que cero/);
  assert.throws(() => motor.faraday(10, 0, 1, 1, -2), /mayor que cero/);
  assert.throws(() => motor.lenz(0, 0), /distinto de cero/);
  assert.throws(() => motor.femMovimiento(0.5, 0, 1), /mayor que cero/);
  assert.throws(() => motor.flujoIman(-1, {}), /negativo/);
  assert.throws(() => motor.flujoIman(0.1, { polo: 'X' }), /polo/);
  assert.throws(() => motor.movimientoIman(1, null), /movimiento/);
  assert.throws(() => motor.generador(10, 0.1, 0.1, 0), /mayor que cero/);
  assert.throws(() => motor.transformador(0, 10, 220), /mayor que cero/);
  assert.throws(() => motor.campoIman({ x: 0, y: 0, largo: 0.1 }, { x: 0.05, y: 0 }), /polo/);
  assert.equal(motor.transformador(100, 50, 220).Is, null, 'sin Ip no hay Is');
});

// 4. Problemas de papel (regla 6)
const rutaPapel = path.join(__dirname, 'papel.json');
const papel = fs.existsSync(rutaPapel) ? JSON.parse(fs.readFileSync(rutaPapel, 'utf8')) : null;
test('papel.json: entre 8 y 10 problemas, con respuesta, pasos y verificación', () => {
  assert.ok(papel, 'falta papel.json');
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 8 && papel.problemas.length <= 10);
  const ids = new Set();
  for (const p of papel.problemas) {
    assert.ok(p.id && !ids.has(p.id)); ids.add(p.id);
    assert.ok(p.enunciado && p.respuesta && Array.isArray(p.pasos) && p.pasos.length, `${p.id}: falta texto`);
    assert.ok(Array.isArray(p.verificar) && p.verificar.length, `${p.id}: falta verificar`);
    assert.ok(!/<[a-z]/i.test(p.enunciado + p.respuesta + p.pasos.join('')), `${p.id}: la app muestra texto plano, sin HTML`);
    assert.ok(!/\d\.\d/.test(p.enunciado + p.respuesta + p.pasos.join('')), `${p.id}: se escribe con coma decimal`);
  }
});
for (const p of (papel && papel.problemas) || []) test(`papel ${p.id}: la respuesta coincide con el motor`, () => {
  for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id);
});
