// Pruebas del motor de «El empujón magnético». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con datos al azar (semilla fija): F = q·v×B es siempre perpendicular a v y a B, vale |q|vB sen θ y
//    es cero con la carga quieta o con v paralela a B; con el signo de la carga cambia de sentido; la trayectoria
//    exacta coincide con una integración numérica (RK4) independiente, conserva la rapidez, queda a distancia r del
//    centro y vuelve al punto de partida después de un periodo T, que no depende de v; el campo del hilo baja con 1/d,
//    da vueltas alrededor del hilo (B ⊥ radio) y cumple la ley de Ampère (∮B·dl = μ₀I) por caminos distintos; el
//    campo de la espira coincide con Biot–Savart sumado tramo a tramo; las fuerzas entre dos cables son iguales
//    (I₂·L·B₁ = I₁·L·B₂) y su tipo depende solo de los sentidos; F = I·L×B coincide con BIL sen θ; la brújula se pone
//    tangente; las líneas del imán siguen el campo.
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
  assert.ok(typeof real === 'number' && Math.abs(real - esperado) <= t * Math.max(Math.abs(esperado), 1e-300) + 1e-300 * 0 + (esperado === 0 ? 1e-25 : 0),
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
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'magnetismo');
  assert.ok(datos.casos.length >= 16, 'al menos 16 casos');
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
  const nombres = datos.casos.map(c => c.nombre).join(' ');
  for (const t of ['QUIETO', 'paralela y contraria', 'ELECTRÓN', '37°', '10⁻⁵ T', 'espira', 'solenoide', '0,6 N', '0,3 N', '4 × 10⁻⁴ N/m sobre CADA uno', 'OPUESTOS'])
    assert.ok(nombres.includes(t), `falta el caso pedido: ${t}`);
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
const rnd = motor.azar(2026);
const al = (a, b) => a + (b - a) * rnd();
const N = 300;
const vAzar = (m) => ({ x: al(-1, 1) * m, y: al(-1, 1) * m, z: al(-1, 1) * m });
const mod = v => Math.hypot(v.x, v.y, v.z || 0);
const dot = (a, b) => a.x * b.x + a.y * b.y + (a.z || 0) * (b.z || 0);

test('F = q·v×B: siempre perpendicular a v y a B, de módulo |q|vB sen θ; cambia de sentido con el signo de q', () => {
  for (let k = 0; k < N; k++) {
    const q = al(-5, 5) * 1e-6 || 1e-6, v = vAzar(1e5), B = vAzar(2);
    const r = motor.fuerzaCarga(q, v, B);
    const esc = Math.abs(q) * mod(v) * mod(B);
    assert.ok(Math.abs(dot(r.F, v)) <= 1e-9 * esc * mod(v), 'F·v = 0');
    assert.ok(Math.abs(dot(r.F, B)) <= 1e-9 * esc * mod(B), 'F·B = 0');
    assert.ok(r.perpendicular);
    const th = Math.acos(dot(v, B) / (mod(v) * mod(B)));
    cerca(r.modulo, esc * Math.sin(th), 'módulo', 1e-7);
    cerca(r.theta, th * 180 / Math.PI, 'θ', 1e-7);
    const o = motor.fuerzaCarga(-q, v, B);
    cerca(o.F.x, -r.F.x, 'opuesta x'); cerca(o.F.y, -r.F.y, 'opuesta y'); cerca(o.F.z, -r.F.z, 'opuesta z');
    cerca(r.errores.sinSigno.x, Math.abs(q) / q * r.F.x, 'sinSigno');
  }
});
test('sin fuerza con la carga quieta o con v paralela (o contraria) a B, por intenso que sea el campo', () => {
  for (let k = 0; k < N; k++) {
    const B = vAzar(al(0.1, 10)), q = al(0.1, 5) * 1e-6, s = al(-3e5, 3e5);
    assert.equal(motor.fuerzaCarga(q, { x: 0, y: 0, z: 0 }, B).modulo, 0);
    const r = motor.fuerzaCarga(q, { x: B.x * s, y: B.y * s, z: B.z * s }, B);
    assert.equal(r.modulo, 0); assert.ok(r.paralela || s === 0);
  }
});
// RK4 independiente para dv/dt = (q/m) v × B con B = Bz ẑ
function rk4(q, m, v0, Bz, tFin, pasos) {
  let x = 0, y = 0, vx = v0.x, vy = v0.y; const h = tFin / pasos, k = q * Bz / m;
  const f = (vx, vy) => [vx, vy, k * vy, -k * vx];
  for (let i = 0; i < pasos; i++) {
    const a = f(vx, vy), b = f(vx + h / 2 * a[2], vy + h / 2 * a[3]), c = f(vx + h / 2 * b[2], vy + h / 2 * b[3]), d = f(vx + h * c[2], vy + h * c[3]);
    x += h / 6 * (a[0] + 2 * b[0] + 2 * c[0] + d[0]); y += h / 6 * (a[1] + 2 * b[1] + 2 * c[1] + d[1]);
    const nvx = vx + h / 6 * (a[2] + 2 * b[2] + 2 * c[2] + d[2]), nvy = vy + h / 6 * (a[3] + 2 * b[3] + 2 * c[3] + d[3]); vx = nvx; vy = nvy;
  }
  return { x, y, vx, vy };
}
test('trayectoria: coincide con RK4, la rapidez no cambia, queda a r del centro y vuelve al inicio tras un periodo T que no depende de v', () => {
  for (let k = 0; k < 60; k++) {
    const q = (rnd() < 0.5 ? -1 : 1) * 1.6e-19, m = al(1, 10) * 1e-27, Bz = (rnd() < 0.5 ? -1 : 1) * al(0.05, 1);
    const v0 = { x: al(-1, 1) * 1e6, y: al(-1, 1) * 1e6 }, v = Math.hypot(v0.x, v0.y);
    const mc = motor.movimientoCircular(q, m, v, Math.abs(Bz));
    const t = al(0, 1) * mc.T, p = motor.trayectoria(q, m, v0, Bz, t), n = rk4(q, m, v0, Bz, t, 4000);
    cerca(p.x, n.x, 'x contra RK4', 1e-6 * Math.max(1, mc.r / Math.max(1e-30, Math.abs(n.x)))); cerca(p.y, n.y, 'y contra RK4', 1e-6 * Math.max(1, mc.r / Math.max(1e-30, Math.abs(n.y))));
    cerca(Math.hypot(p.vx, p.vy), v, 'rapidez constante', 1e-9);
    cerca(Math.hypot(p.x - p.centro.x, p.y - p.centro.y), mc.r, 'radio', 1e-9);
    const fin = motor.trayectoria(q, m, v0, Bz, mc.T);
    assert.ok(Math.hypot(fin.x, fin.y) <= 1e-9 * mc.r, 'vuelve al inicio');
    const doble = motor.movimientoCircular(q, m, 2 * v, Math.abs(Bz));
    assert.equal(doble.T, mc.T); cerca(doble.r, 2 * mc.r, 'radio doble');
    // una carga positiva con B que entra gira antihorario
    assert.equal(p.sentido, q * Bz > 0 ? 'horario' : 'antihorario');
  }
});
test('hilo: B baja con 1/d, da vueltas alrededor (B ⊥ radio) y cumple Ampère: ∮B·dl = μ₀I por una circunferencia y por un cuadrado', () => {
  for (let k = 0; k < N; k++) {
    const I = al(-50, 50) || 1, d = al(0.01, 2), f = al(0.2, 5);
    cerca(motor.campoHilo(I, d).B * d, 2e-7 * Math.abs(I), 'B·d');
    cerca(motor.cambioDistanciaHilo(I, d, f).B1, motor.campoHilo(I, d).B / f, '1/d');
    const h = { I, x: al(-1, 1), y: al(-1, 1) }, a = al(0, 2 * Math.PI), P = { x: h.x + d * Math.cos(a), y: h.y + d * Math.sin(a) };
    const B = motor.campoHilos([h], P);
    assert.ok(Math.abs(B.x * (P.x - h.x) + B.y * (P.y - h.y)) <= 1e-9 * B.modulo * d, 'tangente');
  }
  const I = 7, h = [{ I, x: 0.03, y: -0.02 }];
  let circ = 0; const n = 4000, R = 0.3;
  for (let k = 0; k < n; k++) { const a = (k + 0.5) / n * 2 * Math.PI, P = { x: R * Math.cos(a), y: R * Math.sin(a) }, B = motor.campoHilos(h, P); circ += (-B.x * Math.sin(a) + B.y * Math.cos(a)) * R * 2 * Math.PI / n; }
  cerca(circ, motor.MU0 * I, 'Ampère circunferencia', 1e-6);
  let cuad = 0; const L = 0.5;
  for (const [x0, y0, dx, dy] of [[-L, -L, 1, 0], [L, -L, 0, 1], [L, L, -1, 0], [-L, L, 0, -1]])
    for (let k = 0; k < n; k++) { const s = (k + 0.5) / n * 2 * L, P = { x: x0 + dx * s, y: y0 + dy * s }, B = motor.campoHilos(h, P); cuad += (B.x * dx + B.y * dy) * 2 * L / n; }
  cerca(cuad, motor.MU0 * I, 'Ampère cuadrado', 1e-5);
  // un hilo fuera del camino no aporta circulación
  let fuera = 0; const h2 = [{ I: 9, x: 1.2, y: 0 }];
  for (let k = 0; k < n; k++) { const a = (k + 0.5) / n * 2 * Math.PI, P = { x: R * Math.cos(a), y: R * Math.sin(a) }, B = motor.campoHilos(h2, P); fuera += (-B.x * Math.sin(a) + B.y * Math.cos(a)) * R * 2 * Math.PI / n; }
  assert.ok(Math.abs(fuera) < 1e-12, 'hilo de afuera: circulación cero');
});
test('superposición: punto medio entre hilos opuestos suma, iguales resta; coincide con campoHilos', () => {
  for (let k = 0; k < N; k++) {
    const I1 = al(1, 40), I2 = al(1, 40) * (rnd() < 0.5 ? -1 : 1), d = al(0.02, 1);
    const pm = motor.puntoMedio(I1, I2, d), ch = motor.campoHilos([{ I: I1, x: -d / 2, y: 0 }, { I: I2, x: d / 2, y: 0 }], { x: 0, y: 0 });
    cerca(pm.B, ch.modulo, 'mismo B');
    const esperado = 2e-7 * (I2 < 0 ? I1 + Math.abs(I2) : Math.abs(I1 - I2)) / (d / 2);
    cerca(pm.B, esperado, 'suma o resta', 1e-8);
  }
});
test('espira: μ₀I/(2R) coincide con Biot–Savart sumado tramo a tramo', () => {
  for (const [I, R] of [[10, 0.1], [3, 0.05], [0.5, 1.2]]) {
    let B = 0; const n = 2000;
    for (let k = 0; k < n; k++) { const dl = 2 * Math.PI * R / n; B += 1e-7 * I * dl / (R * R); }   // μ₀/(4π) · I dl × r̂ / r², con dl ⊥ r̂
    cerca(motor.espira(I, R).B, B, 'Biot–Savart', 1e-9);
  }
});
test('cables paralelos: fuerzas iguales (I₂·B₁ = I₁·B₂) y el tipo depende solo de los sentidos; F = I·L×B coincide con BIL sen θ', () => {
  for (let k = 0; k < N; k++) {
    const I1 = al(-50, 50) || 2, I2 = al(-50, 50) || 3, d = al(0.01, 1), L = al(0.1, 5);
    const c = motor.cablesParalelos(I1, I2, d, L);
    cerca(Math.abs(I2) * L * c.B1en2, c.sobre2, 'sobre 2'); cerca(Math.abs(I1) * L * c.B2en1, c.sobre1, 'sobre 1');
    assert.equal(c.sobre1, c.sobre2);
    assert.equal(c.tipo, I1 * I2 > 0 ? 'atraccion' : 'repulsion');
    const Lv = vAzar(1), Bv = vAzar(1), I = al(-10, 10) || 1;
    const fv = motor.fuerzaConductorVector(I, Lv, Bv), th = Math.acos(dot(Lv, Bv) / (mod(Lv) * mod(Bv))) * 180 / Math.PI;
    cerca(fv.modulo, motor.fuerzaConductor(I, mod(Lv), mod(Bv), th).F, 'BIL sen θ', 1e-7);
  }
});
test('brújula tangente al campo del hilo; se da vuelta con la corriente', () => {
  for (let k = 0; k < 100; k++) {
    const I = al(1, 20), a = al(0, 360), P = { x: 0.3 * Math.cos(a * Math.PI / 180), y: 0.3 * Math.sin(a * Math.PI / 180) };
    const b1 = motor.brujula([{ I, x: 0, y: 0 }], P), b2 = motor.brujula([{ I: -I, x: 0, y: 0 }], P);
    cerca(((b1.angulo - a) % 360 + 360) % 360, 90, 'antihorario si sale', 1e-7);
    cerca(((b2.angulo - b1.angulo) % 360 + 360) % 360, 180, 'media vuelta', 1e-7);
  }
});
test('senos de academia exactos y suplementos', () => {
  assert.equal(motor.senGrados(37), 0.6); assert.equal(motor.senGrados(53), 0.8); assert.equal(motor.senGrados(143), 0.6);
  assert.equal(motor.cosGrados(37), 0.8); assert.equal(motor.senGrados(30), 0.5); assert.equal(motor.senGrados(210), -0.5);
  assert.equal(motor.senGrados(180), 0); cerca(motor.senGrados(20), Math.sin(20 * Math.PI / 180), 'otro');
});
test('imán: las líneas siguen el campo y salen del norte', () => {
  const im = { x: 0, y: 0, largo: 0.2, ang: 0 };
  const ls = motor.lineasIman(im, 8, { x0: -1, x1: 1, y0: -1, y1: 1 });
  assert.ok(ls.length >= 6);
  for (const l of ls) {
    assert.ok(Math.hypot(l[0].x - 0.1, l[0].y) < 0.02, 'empieza junto al norte');
    for (let k = 5; k < l.length - 1; k += 20) {
      const B = motor.campoIman(im, l[k]), t = { x: l[k + 1].x - l[k].x, y: l[k + 1].y - l[k].y };
      assert.ok((B.x * t.x + B.y * t.y) / (B.modulo * Math.hypot(t.x, t.y)) > 0.98, 'tangente al campo');
    }
  }
  cerca(motor.campoIman({ ...im, B0: 0.2, a: 0.05 }, { x: 0.15, y: 0 }).modulo, 0.2, 'escala B0');
  const m = motor.mapaHilos([{ I: 5, x: 0, y: 0 }], { x0: -1, x1: 1, y0: -1, y1: 1 }, 8);
  assert.ok(m.puntos.length > 40 && m.puntos.every(p => p.nivel >= 0 && p.nivel <= 1));
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.fuerzaCarga('1', { x: 1, y: 0 }, { x: 0, y: 1 }), /número/);
  assert.throws(() => motor.fuerzaCarga(1, null, { x: 0, y: 1 }), /vector/);
  assert.throws(() => motor.movimientoCircular(0, 1, 1, 1), /distinta de cero/);
  assert.throws(() => motor.movimientoCircular(1, 1, 1, 1, 0), /paralela/);
  assert.throws(() => motor.movimientoCircular(1, -1, 1, 1), /mayor que cero/);
  assert.throws(() => motor.campoHilo(10, 0), /mayor que cero/);
  assert.throws(() => motor.campoHilo(0, 1), /distinta de cero/);
  assert.throws(() => motor.campoHilos([], { x: 0, y: 0 }), /lista/);
  assert.throws(() => motor.campoHilos([{ I: 1, x: 0, y: 0 }], { x: 0, y: 0 }), /sobre un hilo/);
  assert.throws(() => motor.trayectoria(1, 1, { x: 1, y: 0, z: 1 }, 1, 0), /plano/);
  assert.throws(() => motor.solenoide(1, 0), /mayor que cero/);
  assert.throws(() => motor.cablesParalelos(1, 0, 1), /distinta de cero/);
  assert.throws(() => motor.anguloEntre({ x: 0, y: 0 }, { x: 1, y: 0 }), /distintos de cero/);
  assert.throws(() => motor.mapaHilos([{ I: 1, x: 0, y: 0 }], { x0: 1, x1: 0, y0: 0, y1: 1 }), /caja/);
  // acepta el punto como [x, y]
  cerca(motor.campoHilos([{ I: 10, x: 0, y: 0 }], [0.2, 0]).modulo, 1e-5, 'punto como lista');
  assert.deepEqual(motor.trayectoria(1, 1, { x: 2, y: 0 }, 0, 3), { x: 6, y: 0, vx: 2, vy: 0, centro: null, sentido: 'recta' });
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
