// Pruebas del motor de tiro parabólico y movimiento circular. Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json, verificado con fracciones exactas y otro método, debe salir igual del
//    motor (regla 2 de CLAUDE.md).
// 2. Coherencia: la velocidad es la derivada de la posición (diferencias numéricas); la trayectoria es la
//    parábola y = y0 + x·tan θ − g·x²/(2·v0²·cos²θ); la rapidez al llegar sale también de la energía.
// 3. Lo que enseña la escena: el movimiento vertical no depende del horizontal (P1, P2); el avance
//    horizontal es igual cada segundo (P3); en la cima a = −g (C1); ángulos complementarios dan el mismo
//    alcance y 45° el máximo; en el MCU la aceleración apunta al centro; al soltarse, sigue tangente (D9).
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
function llamar(fn, args) {
  if (fn === 'estadoEn') return motor.proyectil(args[0]).estado(args[1]);
  if (fn === 'cuandoEn') return motor.proyectil(args[0]).cuando(args[1]);
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  return motor[fn](...args);
}
function comprobar(fn, args, espera, que) {
  const r = llamar(fn, args);
  for (const [k, v] of Object.entries(espera)) {
    const x = k === 'valor' ? r : k === 'largo' ? r.length : leer(r, k);
    if (typeof v === 'number') cerca(x, v, `${que} · ${k}`);
    else assert.equal(x, v, `${que} · ${k}: el motor da ${x}, se esperaba ${v}`);
  }
}

// 1. casos.json
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Coherencia
const TIROS = [{ v0: 50, angulo: 37 }, { v0: 50, angulo: 53 }, { vx: 15, y0: 80 }, { v0: 25, angulo: 37, y0: 20 }, { v0: 10, angulo: -37, y0: 32 },
  { v0: 18, angulo: 62, y0: 4, exacto: true }, { v0: 7.5, angulo: 12, y0: 0.6, exacto: true }];
test('la velocidad es la derivada de la posición y la aceleración, la de la velocidad', () => {
  for (const o of TIROS) {
    const p = motor.proyectil(o), h = 1e-5;
    for (const f of [0.1, 0.35, 0.5, 0.8]) {
      const t = p.tVuelo * f, a = p.estado(t - h), b = p.estado(t + h), e = p.estado(t);
      cerca((b.x - a.x) / (2 * h), e.vx, `vx ${JSON.stringify(o)}`, 1e-6);
      cerca((b.y - a.y) / (2 * h), e.vy, `vy ${JSON.stringify(o)}`, 1e-6);
      cerca((b.vy - a.vy) / (2 * h), e.ay, `ay ${JSON.stringify(o)}`, 1e-6);
    }
  }
});
test('la trayectoria es la parábola y = y0 + x·tan θ − g·x²/(2·v0²·cos²θ)', () => {
  for (const o of TIROS) {
    const p = motor.proyectil(o);
    if (p.vx === 0) continue;
    for (const e of p.puntos(30)) {
      const x = e.x - p.x0, y = p.y0 + x * p.vy / p.vx - p.g * x * x / (2 * p.vx * p.vx);
      cerca(e.y, y, `parábola ${JSON.stringify(o)}`, 1e-9);
    }
    cerca(p.estado(p.tVuelo).y, 0, 'llega al suelo en tVuelo');
  }
});
test('la rapidez al llegar coincide con la conservación de la energía: v² = v0² + 2·g·y0', () => {
  for (const o of TIROS) {
    const p = motor.proyectil(o);
    cerca(p.vFinal.modulo ** 2, p.v0 ** 2 + 2 * p.g * p.y0, `energía ${JSON.stringify(o)}`, 1e-9);
  }
});

// 3. Lo que enseña la escena
test('P1 y P2: el tiempo de caída no depende de la velocidad horizontal', () => {
  for (const y0 of [5, 20, 80, 125]) {
    const t = motor.proyectil({ vx: 0, y0 }).tVuelo;
    for (const vx of [1, 15, 30, 300]) {
      const p = motor.proyectil({ vx, y0 });
      cerca(p.tVuelo, t, `vx = ${vx}, y0 = ${y0}`);
      for (const f of [0.2, 0.6, 0.9]) cerca(p.estado(t * f).y, motor.proyectil({ vx: 0, y0 }).estado(t * f).y, 'misma altura en cada instante');
    }
  }
});
test('P3: el avance horizontal es el mismo cada segundo; la caída, no', () => {
  const p = motor.proyectil({ vx: 15, y0: 80 });
  for (let t = 0; t < 3; t++) {
    cerca(p.estado(t + 1).x - p.estado(t).x, 15, `avance en el segundo ${t + 1}`);
    cerca(p.estado(t).y - p.estado(t + 1).y, 5 + 10 * t, `caída en el segundo ${t + 1}`);
  }
});
test('C1: en la cima vy = 0, la rapidez es vx y la aceleración sigue siendo −g', () => {
  for (const o of TIROS.filter(q => (q.angulo || 0) > 0)) {
    const p = motor.proyectil(o), e = p.estado(p.tSubida);
    cerca(e.vy, 0, 'vy en la cima'); cerca(e.v, p.vx, 'rapidez en la cima'); cerca(e.ay, -10, 'a en la cima'); cerca(e.y, p.H, 'altura máxima');
  }
});
test('desde el suelo, ángulos complementarios dan el mismo alcance y 45° da el máximo', () => {
  for (const v0 of [10, 30, 50]) {
    for (const a of [15, 20, 30, 37, 40]) cerca(motor.proyectil({ v0, angulo: a, exacto: true }).alcance, motor.proyectil({ v0, angulo: 90 - a, exacto: true }).alcance, `${a}° y ${90 - a}°`);
    const max = motor.alcanceMaximo(v0);
    for (let a = 5; a < 90; a += 2.5) assert.ok(motor.proyectil({ v0, angulo: a, exacto: true }).alcance <= max + 1e-9);
    cerca(motor.proyectil({ v0, angulo: 45 }).alcance, max, '45°');
  }
});
test('la masa no aparece: el motor no la pide ni la usa', () => {
  const a = motor.proyectil({ v0: 50, angulo: 37 }), b = motor.proyectil({ v0: 50, angulo: 37, m: 1000 });
  cerca(a.alcance, b.alcance, 'alcance'); cerca(a.tVuelo, b.tVuelo, 'tiempo');
});
test('MCU: ac = v²/r = ω²·r, y apunta al centro (Δv entre dos instantes cercanos)', () => {
  for (const o of [{ r: 2, v: 4 }, { r: 0.5, rpm: 120 }, { r: 50, v: 10 }, { r: 3, periodo: 2 }]) {
    const m = motor.mcu(o);
    cerca(m.ac, m.v ** 2 / m.r, 'v²/r'); cerca(m.ac, m.omega ** 2 * m.r, 'ω²r'); cerca(m.v, m.omega * m.r, 'v = ωr');
    // Δv/Δt en θ = 0: la velocidad pasa de (0, v) a (−v·sen ωh, v·cos ωh); el cambio apunta hacia −x, al centro.
    // Diferencia centrada: v(−h) = (v·sen ωh, v·cos ωh) y v(h) = (−v·sen ωh, v·cos ωh).
    const h = 1e-6, w = m.omega, ax = (-2 * m.v * Math.sin(w * h)) / (2 * h), ay = (m.v * Math.cos(w * h) - m.v * Math.cos(-w * h)) / (2 * h);
    cerca(ax, -m.ac, 'a hacia el centro', 1e-4); cerca(ay, 0, 'sin componente tangencial', 1e-4);
  }
});
test('D9: al soltarse sigue en línea recta tangente: la velocidad es perpendicular al radio y se aleja del círculo', () => {
  for (const theta of [0, 30, 90, 200]) for (const w of [3, -2]) {
    const s0 = motor.soltarDelCirculo({ r: 2, omega: w, theta, t: 0 });
    cerca(s0.suelta.x * s0.vx + s0.suelta.y * s0.vy, 0, 'tangente', 1e-9);
    let antes = 2;
    for (const t of [0.2, 0.5, 1, 2]) {
      const s = motor.soltarDelCirculo({ r: 2, omega: w, theta, t });
      cerca(s.distanciaAlCentro, Math.sqrt(4 + (w * 2 * t) ** 2), 'distancia al centro');
      assert.ok(s.distanciaAlCentro > antes); antes = s.distanciaAlCentro;
    }
  }
});
test('MCUV frenando: ω² = ω0² − 2·|α|·θ y a tParada, ω = 0', () => {
  const o = { r: 1, omega0: 10, alfa: -2 };
  for (const t of [1, 2.5, 4]) { const m = motor.mcuv(Object.assign({ t }, o)); cerca(m.omega ** 2, 100 - 4 * m.theta, `t = ${t}`); }
  cerca(motor.mcuv(Object.assign({ t: 5 }, o)).omega, 0, 'ω en tParada');
});
test('transmisión: con faja la rueda chica gira más rápido; en el eje, el borde grande va más rápido', () => {
  const f = motor.transmision({ r1: 0.1, r2: 0.3, omega1: 30, tipo: 'faja' }), e = motor.transmision({ r1: 0.3, r2: 0.5, omega1: 10, tipo: 'eje' });
  cerca(f.v1, f.v2, 'misma v'); assert.ok(f.omega2 < 30);
  cerca(e.omega2, 10, 'misma ω'); assert.ok(e.v2 > e.v1);
  assert.throws(() => motor.transmision({ r1: 1, r2: 1, omega1: 1, tipo: 'cadena' }), /faja/);
});
test('MCUV: el ángulo es el área bajo ω-t', () => {
  const o = { r: 0.5, omega0: 2, alfa: 1 };
  let area = 0; const n = 40000, T = 4;
  for (let k = 0; k < n; k++) area += motor.mcuv(Object.assign({ t: (k + 0.5) * T / n }, o)).omega * T / n;
  cerca(motor.mcuv(Object.assign({ t: T }, o)).theta, area, 'θ', 1e-6);
});

// 4. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.proyectil({ v0: 10, angulo: 120 }), /−90° a 90°/);
  assert.throws(() => motor.proyectil({ v0: 10, angulo: -20 }), /hacia arriba/);
  assert.throws(() => motor.proyectil({ vx: 5, y0: -3 }), /negativo/);
  assert.throws(() => motor.proyectil({ v0: 'rápido', angulo: 30 }), /inválido/);
  assert.throws(() => motor.mcu({ r: 2 }), /falta/);
  assert.throws(() => motor.mcu({ r: 0, v: 3 }), /mayor que cero/);
  assert.throws(() => motor.mcuv({ r: 1, omega0: 1, alfa: 1, t: -1 }), /negativo/);
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
