// Pruebas del motor de «El disco y sus flechas». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Cada problema de papel.json coincide con el motor.
// 3. Propiedades, con datos al azar (semilla fija): desde el reposo, acp/aT = 2θ sin importar R ni α
//    (CI-cociente-depende-del-radio); en el MCUV aT no cambia y acp crece (CI-at-crece); en el n-ésimo segundo
//    la razón es 2n − 1 (CI-enesimo-segundo); en el MCU |a| no cambia pero su dirección sí (CI-mcu-a-constante) y
//    |Δv| = 2v·sen(Δθ/2) (CI-delta-v-cero); la cuerda nunca es más larga que el arco; acp apunta al centro con
//    cualquier signo de ω; en la rueda que rueda, cada punto va a ω por su distancia al apoyo; el reencuentro en la
//    salida es múltiplo de los dos periodos; la gráfica ω-t da lo mismo que la ecuación horaria; y las conversiones
//    van y vuelven.
// 4. Errores de entrada.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const M = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
function cerca(real, esperado, que, tol) {
  const t = tol === undefined ? 1e-9 : tol;
  if (Array.isArray(esperado)) { assert.equal(real.length, esperado.length, `${que}: largo`); esperado.forEach((e, k) => cerca(real[k], e, `${que}[${k}]`, t)); return; }
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
const campo = (r, k) => (k === 'valor' ? r : k.split('.').reduce((o, p) => (o == null ? o : o[p]), r));
function comprobar(fn, args, espera, que) {
  assert.equal(typeof M[fn], 'function', `motor.${fn} no existe`);
  const r = M[fn](...args);
  for (const [k, v] of Object.entries(espera)) {
    const x = campo(r, k);
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    cerca(x, v, `${que} · ${k}`);
  }
}

// 1. casos.json
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'movimiento-circular');
  assert.ok(datos.casos.length >= 15);
  const nombres = new Set();
  for (const c of datos.casos) {
    assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
    assert.ok(!nombres.has(c.nombre), `nombre repetido: ${c.nombre}`); nombres.add(c.nombre);
  }
});
for (const c of datos.casos) test(c.nombre, () => comprobar(c.fn, c.args, c.espera, c.nombre));

// 2. papel.json
test('papel.json: de 8 a 10 problemas, cada uno con pasos y verificación', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 8 && papel.problemas.length <= 10);
  for (const p of papel.problemas) {
    assert.ok(p.id && p.enunciado && p.respuesta && Array.isArray(p.pasos) && p.pasos.length >= 2, p.id);
    assert.ok(Array.isArray(p.verificar) && p.verificar.length, `${p.id} sin verificar`);
  }
});
for (const p of papel.problemas) test(`papel ${p.id}`, () => { for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id); });

// 3. Propiedades
function azar(s) { return () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; }; }
const rnd = azar(2026), al = (a, b) => a + (b - a) * rnd();
const N = 300;

test('desde el reposo, acp/aT = 2θ: el ángulo en que valen una razón no depende de R ni de α', () => {
  for (let k = 0; k < N; k++) {
    const razon = al(0.1, 5), r = al(0.05, 20), alfa = al(0.1, 30), r2 = al(0.05, 20), alfa2 = al(0.1, 30);
    const a = M.desdeReposo({ r, alfa, razon }), b = M.desdeReposo({ r: r2, alfa: alfa2, razon });
    cerca(a.theta, razon / 2, 'θ = razón/2'); cerca(b.theta, a.theta, 'mismo θ en otro disco');
    cerca(a.acp / a.at, razon, 'acp/aT');
    // Con mcuv, en el instante t: lo girado es θ y acp/aT es la razón.
    const m = M.mcuv({ r, omega0: 0, alfa, t: a.t });
    cerca(m.theta, a.theta, 'θ por mcuv'); cerca(m.ac / m.at, razon, 'razón por mcuv', 1e-8);
    cerca(M.razonDesdeReposo(m.theta), razon, 'razonDesdeReposo');
  }
});
test('MCUV: aT no cambia con el tiempo y acp crece (CI-at-crece)', () => {
  for (let k = 0; k < N; k++) {
    const r = al(0.1, 5), alfa = al(0.5, 10), t1 = al(0.1, 3), t2 = t1 + al(0.1, 3);
    const a = M.mcuv({ r, omega0: 0, alfa, t: t1 }), b = M.mcuv({ r, omega0: 0, alfa, t: t2 });
    cerca(a.at, b.at, 'aT igual'); assert.ok(b.ac > a.ac, 'acp crece');
    const x = M.aceleracionTotal({ r, omega: a.omega, alfa });
    cerca(x.a, a.a, '|a|'); assert.ok(x.errores.aSuma > x.a, 'sumar sin Pitágoras da de más');
    cerca(x.anguloAV + x.anguloAR, 90, 'ángulos complementarios');
  }
});
test('el triángulo de aceleraciones con un notable reproduce el ángulo', () => {
  for (const ang of [16, 30, 37, 45, 53, 60, 74]) {
    const r = al(0.5, 5), v = al(1, 10), x = M.aceleracionTotal({ r, v, anguloAV: ang });
    const y = M.aceleracionTotal({ r, v, at: x.at });
    cerca(y.anguloAV, Math.atan2(M.trig(ang).sen, M.trig(ang).cos) * 180 / Math.PI, `ángulo ${ang}`);
    cerca(x.a * M.trig(ang).sen, x.acp, 'acp = a·sen'); cerca(x.a * M.trig(ang).cos, x.at, 'aT = a·cos');
  }
});
test('n-ésimo segundo: desde el reposo lo girado en el segundo n es (2n − 1) veces lo del primero', () => {
  for (let k = 0; k < N; k++) {
    const n = 1 + Math.floor(rnd() * 12), alfa = al(0.2, 20), e = M.enesimoSegundo({ alfa, n });
    cerca(e.razon, 2 * n - 1, 'razón'); cerca(e.thetaHasta / e.theta1, n * n, 'n²');
    cerca(e.segundos.reduce((s, x) => s + x, 0), e.thetaHasta, 'suma de los segundos');
    const d = M.entre({ alfa, t1: n - 1, t2: n }); cerca(d.theta, e.thetaN, 'entre(n − 1, n)');
  }
});
test('MCU vectorial: |a| constante, dirección distinta; |Δv| = 2v·sen(Δθ/2); la cuerda no pasa del arco', () => {
  for (let k = 0; k < N; k++) {
    const r = al(0.2, 5), omega = (rnd() < 0.5 ? -1 : 1) * al(0.3, 6), th0 = al(-180, 180), t1 = al(0, 2), dt = al(0.05, 1.5) / Math.abs(omega);
    const x = M.vectorial({ r, omega, theta0: th0, t1, t2: t1 + dt });
    cerca(Math.hypot(x.a1.x, x.a1.y), Math.hypot(x.a2.x, x.a2.y), 'mismo |a|');
    assert.ok(x.difA > 1e-6, 'la aceleración cambió (no es constante)');
    // acp apunta al centro: a = −ω²·r⃗, con cualquier signo de ω
    cerca(x.a1.x, -omega * omega * x.p1.x, 'acp.x'); cerca(x.a1.y, -omega * omega * x.p1.y, 'acp.y');
    // v perpendicular a r
    cerca(x.v1.x * x.p1.x + x.v1.y * x.p1.y, 0, 'v ⟂ r', 1e-8);
    const dth = Math.abs(omega) * dt;
    cerca(x.modDv, 2 * x.v * Math.abs(Math.sin(dth / 2)), '|Δv|'); cerca(x.cuerda, 2 * r * Math.abs(Math.sin(dth / 2)), 'cuerda');
    assert.ok(x.cuerda <= x.arco + 1e-12, 'cuerda ≤ arco'); assert.ok(x.modDv > 0, 'Δv no es cero');
    cerca(x.modAMedia, x.modDv / dt, 'a media');
  }
});
test('rueda que rueda: cada punto va a ω por su distancia al apoyo; lo más alto va al doble', () => {
  for (let k = 0; k < N; k++) {
    const r = al(0.1, 1), v = al(0.5, 30), ang = al(0, 360), b = rnd() < 0.5 ? undefined : al(0.3, 1) * r;
    const x = M.rodadura({ r, v, rApoyo: b, angulo: ang });
    cerca(x.punto.modulo, x.omega * x.punto.distanciaApoyo, 'v = ω·d', 1e-8);
    if (b === undefined) { cerca(x.arriba.modulo, 2 * v, 'arriba 2v'); cerca(x.abajo.modulo, 0, 'apoyo quieto'); }
  }
});
test('reencuentro en la salida: múltiplo de los dos periodos, el menor', () => {
  for (let k = 0; k < N; k++) {
    const T1 = 1 + Math.floor(rnd() * 30), T2 = 1 + Math.floor(rnd() * 30);
    const x = M.reencuentroSalida({ periodo1: T1, periodo2: T2 });
    const g = (a, b) => (b ? g(b, a % b) : a);
    cerca(x.t, T1 * T2 / g(T1, T2), 'mcm'); assert.ok(Number.isInteger(x.vueltas1) && Number.isInteger(x.vueltas2));
    if (T1 !== T2) assert.ok(x.tEncuentro <= x.t + 1e-9, 'el primer alcance no llega después');
  }
});
test('la gráfica ω-t de una recta da lo mismo que la ecuación horaria (neto y recorrido)', () => {
  for (let k = 0; k < N; k++) {
    const w0 = al(-10, 10), alfa = al(-5, 5), T = al(0.5, 6);
    const g = M.grafica({ puntos: [[0, w0], [T, w0 + alfa * T]] }), h = M.horaria({ theta0: al(-3, 3), omega0: w0, alfa, t1: 0, t2: T });
    cerca(g.neto, h.neto, 'neto', 1e-8); cerca(g.recorrido, h.recorrido, 'recorrido', 1e-8);
    assert.ok(g.recorrido >= Math.abs(g.neto) - 1e-12);
  }
});
test('tramos: suman lo mismo que mcuvDatos tramo por tramo', () => {
  for (let k = 0; k < N; k++) {
    const a1 = al(0.5, 5), t1 = al(0.5, 4), t2 = al(0.5, 4), x = M.mcuvTramos({ omega0: 0, tramos: [{ alfa: a1, t: t1 }, { alfa: 0, t: t2 }] });
    const d = M.mcuvDatos({ omega0: 0, alfa: a1, t: t1 });
    cerca(x.tramos[0].theta, d.theta, 'tramo 1'); cerca(x.tramos[1].theta, d.omega * t2, 'tramo 2');
    cerca(x.estado(t1 + t2).theta, x.theta, 'estado al final'); cerca(x.estado(t1).omega, d.omega, 'ω entre tramos');
  }
});
test('conversiones de ida y vuelta, y la bala: ω·t es media vuelta', () => {
  for (let k = 0; k < N; k++) {
    const rpm = al(1, 3000), c = M.convertir({ rpm }), d = M.convertir({ omega: c.omega });
    cerca(d.rpm, rpm, 'rpm'); cerca(M.convertir({ periodo: c.periodo }).omega, c.omega, 'periodo'); cerca(c.errores.omegaSin2pi * 2 * Math.PI, c.omega, 'sin 2π');
    const L = al(0.1, 3), v = al(50, 900), b = M.atraviesa({ L, v, modo: 'cascaron' });
    cerca(b.omega * b.t, Math.PI, 'media vuelta'); cerca(b.errores.vueltaEntera, 2 * b.omega, 'una vuelta da el doble');
  }
});
test('transmisión en MCUV: con faja se conserva aT; en el eje, α. Polea móvil: semisuma', () => {
  for (let k = 0; k < N; k++) {
    const r1 = al(0.05, 1), r2 = al(0.05, 1), alfa1 = al(-10, 10);
    const f = M.transmisionMCUV({ r1, r2, alfa1, tipo: 'faja' }), e = M.transmisionMCUV({ r1, r2, alfa1, tipo: 'eje' });
    cerca(f.at1, f.at2, 'aT igual en la faja'); cerca(e.alfa2, alfa1, 'α igual en el eje');
    const v1 = al(-5, 5), v2 = al(-5, 5); cerca(M.poleaMovil({ v1, v2 }).vBloque, (v1 + v2) / 2, 'semisuma');
  }
});
test('la gota de la rueda: el vuelo dura lo que la rueda tarda en dar sus vueltas; la bolita sale por la tangente', () => {
  for (let k = 0; k < N; k++) {
    const r = al(0.2, 3), n = 1 + Math.floor(rnd() * 3), x = M.gotaDeRueda({ r, vueltas: n });
    cerca(x.omega * x.t, 2 * Math.PI * n, 'ω·t = 2πn');
    const R = al(0.2, 2), d = al(0.05, 0.95) * R, b = M.despegaDelDisco({ R, d, omega: al(0.5, 5) });
    cerca(Math.cos(b.anguloSalida * Math.PI / 180) * R, d, 'cos = d/R'); cerca(b.camino ** 2 + d * d, R * R, 'Pitágoras');
  }
});

// 4. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => M.convertir({ rpm: 60, f: 1 }), /una sola/);
  assert.throws(() => M.convertir({ rpm: 60, r: 1, d: 2 }), /no los dos/);
  assert.throws(() => M.desdeReposo({ r: 1, alfa: 0, razon: 1 }), /mayor que cero/);
  assert.throws(() => M.aceleracionTotal({ r: 1, v: 2, anguloAV: 90 }), /entre 0° y 90°/);
  assert.throws(() => M.enesimoSegundo({ alfa: 1, n: 0 }), /n debe/);
  assert.throws(() => M.grafica({ puntos: [[0, 1], [0, 2]] }), /crecer/);
  assert.throws(() => M.atraviesa({ L: 1, v: 100, modo: 'otro' }), /modo/);
  assert.throws(() => M.despegaDelDisco({ R: 1, d: 2, omega: 1 }), /dentro/);
  assert.throws(() => M.dosMoviles({ omega01: 1, alfa1: 1, omega02: 2, alfa2: 1 }), /nunca/);
  assert.throws(() => M.vectorial({ r: 1, omega: 0, t1: 0, t2: 1 }), /no gira/);
  assert.throws(() => M.mcuvDatos({ omega0: 1, omega: 2 }), /exactamente tres/);
});
