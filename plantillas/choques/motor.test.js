// Pruebas del motor de choques. Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json, verificado aparte, debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Leyes que no dependen de los números: en todo choque se conserva p del sistema y la Ec nunca crece;
//    el coeficiente e es la razón de alejamiento a acercamiento; los impulsos son iguales y opuestos; el
//    centro de masa no cambia de velocidad (tampoco en una explosión); el impulso es el área bajo F-t.
// 3. Lo que enseña la escena: plástico pierde m2/(m1 + m2) de la Ec con el 2 quieto; solo con masas
//    iguales intercambian velocidades; la pelota que rebota empuja el doble que la que se pega; el mismo
//    Δp con más tiempo da menos fuerza; el péndulo balístico pierde M/(m + M); cada error del campo
//    'errores' da un número distinto de la respuesta.
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
  if (fn === 'escenarioEstado') return motor.escenario(args[0]).estado(args[1]);
  if (fn === 'explosionEstado') return motor.explosion(args[0]).estado(args[1], args[2], args[3]);
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  return motor[fn](...args);
}
function comprobar(fn, args, espera, que) {
  const r = llamar(fn, args);
  if (typeof espera !== 'object' || espera === null) { cerca(r, espera, que); return; }
  for (const [k, v] of Object.entries(espera)) {
    const x = leer(r, k);
    if (typeof v === 'number') cerca(x, v, `${que} · ${k}`);
    else assert.equal(x, v, `${que} · ${k}: el motor da ${x}, se esperaba ${v}`);
  }
}

// 1. casos.json
test('casos.json tiene formato y al menos 15 casos', () => {
  assert.equal(datos.plantilla, 'choques');
  assert.ok(datos.casos.length >= 15);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera !== undefined, c.nombre);
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Leyes generales
const MASAS = [0.5, 1, 2, 3, 7.5];
const VELS = [-8, -3, 0, 2.5, 6, 10];
const ES = [0, 0.2, 0.5, 0.8, 1];
function* choques() {
  for (const m1 of MASAS) for (const m2 of MASAS) for (const v1 of VELS) for (const v2 of VELS) for (const e of ES) yield { m1, m2, v1, v2, e };
}
test('en todo choque en una recta se conserva p del sistema y la Ec nunca crece', () => {
  for (const o of choques()) {
    const r = motor.choque(o);
    cerca(o.m1 * r.v1f + o.m2 * r.v2f, o.m1 * o.v1 + o.m2 * o.v2, `p ${JSON.stringify(o)}`, 1e-9);
    const antes = o.m1 * o.v1 ** 2 / 2 + o.m2 * o.v2 ** 2 / 2, despues = o.m1 * r.v1f ** 2 / 2 + o.m2 * r.v2f ** 2 / 2;
    assert.ok(despues <= antes + 1e-9, `Ec crece ${JSON.stringify(o)}`);
    cerca(r.EcPerdida, antes - despues, 'Ec perdida', 1e-9);
    if (r.chocan) {
      // e = alejamiento / acercamiento, y después del choque ya no se acercan.
      cerca(r.v2f - r.v1f, o.e * (o.v1 - o.v2), `e ${JSON.stringify(o)}`, 1e-9);
      assert.ok(r.v2f >= r.v1f - 1e-9, 'después del choque, el 1 no atraviesa al 2');
      if (o.e === 1) cerca(despues, antes, 'elástico conserva Ec', 1e-9);
      if (o.e === 0) cerca(r.v1f, r.v2f, 'plástico: quedan juntos', 1e-9);
    } else { assert.equal(r.v1f, o.v1); assert.equal(r.v2f, o.v2); }
    // Impulsos iguales y opuestos; el centro de masa no cambia de velocidad.
    cerca(r.J1 + r.J2, 0, 'J1 + J2 = 0', 1e-9);
    cerca(r.J1, o.m1 * (r.v1f - o.v1), 'J1 = Δp1', 1e-9);
    cerca((o.m1 * r.v1f + o.m2 * r.v2f) / (o.m1 + o.m2), r.vcm, 'vcm', 1e-9);
  }
});
test('la Ec que se pierde, vista desde el centro de masa, es (1 − e²) de la Ec relativa', () => {
  for (const o of choques()) {
    const r = motor.choque(o); if (!r.chocan) continue;
    const mu = o.m1 * o.m2 / (o.m1 + o.m2), rel = mu * (o.v1 - o.v2) ** 2 / 2;
    cerca(r.EcPerdida, (1 - o.e * o.e) * rel, `pérdida ${JSON.stringify(o)}`, 1e-9);
  }
});
test('el escenario mueve el centro de masa a velocidad constante, antes y después del choque', () => {
  for (const o of [{ m1: 2, v1: 6, m2: 1, v2: 0, e: 0 }, { m1: 1, v1: 6, m2: 2, v2: 0, e: 1 }, { m1: 3, v1: 2, m2: 1, v2: -4, e: 0.5 }]) {
    const s = motor.escenario(Object.assign({ x1: -1, x2: 2, d: 0.5 }, o));
    for (let t = 0; t <= 2; t += 0.1) cerca(s.estado(t).xcm, s.xcm0 + s.vcm * t, `xcm a t = ${t}`, 1e-9);
    const c = s.estado(s.tChoque);
    cerca(c.x2 - c.x1, 0.5, 'en el instante del choque se tocan');
    for (let t = 0; t <= 2; t += 0.05) { const e = s.estado(t); assert.ok(e.x2 - e.x1 >= 0.5 - 1e-9, `no se atraviesan a t = ${t}`); }
  }
});
test('choque en un plano: p se conserva en x y en y, y la Ec no crece si quedan juntos', () => {
  for (const m1 of [1, 2, 5]) for (const m2 of [1, 3]) for (const ang1 of [0, 30, 37, 120]) for (const ang2 of [90, 180, 233, 300]) {
    const o = { m1, v1: 4, ang1, m2, v2: 6, ang2 }, r = motor.choque2D(o);
    const t1 = motor.trig(ang1), t2 = motor.trig(ang2);
    cerca((m1 + m2) * r.vx, m1 * 4 * t1.cos + m2 * 6 * t2.cos, 'px', 1e-9);
    cerca((m1 + m2) * r.vy, m1 * 4 * t1.sen + m2 * 6 * t2.sen, 'py', 1e-9);
    assert.ok(r.EcDespues <= r.EcAntes + 1e-9);
    const s = motor.choque2D(Object.assign({ w1: 2, angw1: 53 }, o)), w = motor.trig(53);
    cerca(m1 * 2 * w.cos + m2 * s.w2x, r.px, 'px con w1', 1e-9);
    cerca(m1 * 2 * w.sen + m2 * s.w2y, r.py, 'py con w1', 1e-9);
  }
});
test('el impulso es el área bajo F-t: cualquier forma de pulso da J, y la fuerza media es J/Δt', () => {
  for (const forma of ['triangulo', 'rectangulo', 'seno']) for (const J of [2, 10, 37]) for (const dt of [0.01, 0.2, 1.5]) {
    const p = motor.pulso({ J, dt, forma, t0: 0.3 });
    cerca(motor.areaFt(p.puntos(2000)), J, `área ${forma}`, forma === 'seno' ? 1e-6 : 1e-9);
    cerca(p.Fmedia, J / dt, 'F media');
    assert.ok(p.Fmax >= p.Fmedia - 1e-9, 'el pico nunca es menor que la media');
    assert.equal(p.F(0.2), 0); assert.equal(p.F(0.3 + dt + 0.01), 0);
  }
});
test('explosión: el centro de masa sigue a V y p no cambia', () => {
  for (const m1 of [1, 2.5, 60]) for (const m2 of [0.5, 3]) for (const v2 of [-5, 2, 9]) for (const V of [0, 1.5, -2]) {
    const r = motor.explosion({ m1, m2, v2, V });
    cerca(m1 * r.v1 + m2 * v2, (m1 + m2) * V, 'p', 1e-9);
    for (const t of [0, 0.4, 3]) { const s = r.estado(t, -1, 1); cerca(s.xcm, (m1 * -1 + m2 * 1) / (m1 + m2) + V * t, 'xcm', 1e-9); }
    assert.ok(r.EcDespues >= r.EcAntes - 1e-9, 'una explosión no le quita Ec al sistema');
  }
});

// 3. Lo que enseña la escena
test('plástico con el 2 quieto: se pierde la fracción m2/(m1 + m2) de la Ec', () => {
  for (const m1 of MASAS) for (const m2 of MASAS) {
    cerca(motor.choque({ m1, v1: 5, m2, v2: 0, e: 0 }).fraccionPerdida, m2 / (m1 + m2), `m1 = ${m1}, m2 = ${m2}`);
  }
});
test('elástico: solo con masas iguales intercambian velocidades', () => {
  for (const m1 of MASAS) for (const m2 of MASAS) {
    const r = motor.choque({ m1, v1: 6, m2, v2: 0, e: 1 });
    const intercambian = Math.abs(r.v1f) < 1e-9 && Math.abs(r.v2f - 6) < 1e-9;
    assert.equal(intercambian, m1 === m2, `m1 = ${m1}, m2 = ${m2}`);
    if (m1 < m2) assert.ok(r.v1f < 0, 'el liviano rebota');
    if (m1 > m2) assert.ok(r.v1f > 0, 'el pesado sigue');
  }
});
test('la pelota que rebota empuja más a la pared que la que se pega: (1 + e) veces', () => {
  for (const e of ES) {
    const r = motor.pared({ m: 0.5, v: 10, e, dt: 0.02 }), pega = motor.pared({ m: 0.5, v: 10, e: 0, dt: 0.02 });
    cerca(r.Fpared, (1 + e) * pega.Fpared, `e = ${e}`);
  }
});
test('el mismo cambio de p con más tiempo de contacto da menos fuerza, y el mismo impulso', () => {
  let antes = Infinity;
  for (const dt of [0.001, 0.01, 0.1, 0.5, 2]) {
    const r = motor.impulso({ m: 2, v1: 5, v2: 0, dt });
    cerca(r.dp, -10, 'Δp'); assert.ok(r.FmediaModulo < antes); antes = r.FmediaModulo;
  }
});
test('péndulo balístico: se pierde M/(m + M) de la Ec, la altura crece con v² y el inverso deshace al directo', () => {
  for (const mb of [0.005, 0.02, 0.1]) for (const M of [0.5, 2, 5]) for (const v of [50, 200, 400]) {
    const r = motor.pendulo({ mb, v, M });
    cerca(r.fraccionPerdida, M / (mb + M), 'fracción');
    cerca(r.Ep, r.EcJuntos, 'la Ec después del choque se vuelve Ep arriba');
    cerca(motor.penduloInverso({ mb, M, h: r.h }).v, v, 'inverso', 1e-9);
    cerca(motor.pendulo({ mb, v: 2 * v, M }).h, 4 * r.h, 'doble rapidez, cuatro veces la altura');
    assert.ok(r.errores.hSoloEnergia > r.h, 'solo energía exagera la altura');
  }
  const conHilo = motor.pendulo({ mb: 0.02, v: 200, M: 1.98, L: 1 });
  cerca(conHilo.subida(0), 0, 'subida al inicio'); cerca(conHilo.subida(1), conHilo.theta, 'subida al final');
});
test('cada error de las predicciones de la escena da un número distinto de la respuesta', () => {
  const pl = motor.choque({ m1: 2, v1: 6, m2: 1, v2: 0, e: 0 });
  for (const x of [pl.errores.sigueIgual, pl.errores.promedioSinMasas, pl.errores.conservaEc]) assert.notEqual(x, pl.v1f);
  for (const x of [pl.errores.EcSiSeConservara, pl.errores.EcSoloDe1, pl.errores.perdidaComoFinal]) assert.notEqual(x, pl.EcDespues);
  const el = motor.choque({ m1: 1, v1: 6, m2: 2, v2: 0, e: 1 });
  assert.notEqual(el.errores.intercambian1, el.v1f); assert.notEqual(el.errores.comoPlastico, el.v1f); assert.notEqual(el.errores.rebotaComoPared1, el.v1f);
  const go = motor.pared({ m: 0.5, v: 10, e: 1, dt: 0.02 });
  assert.notEqual(go.errores.comoSiSePegara, go.Fpared);
  const im = motor.impulso({ m: 0.5, v1: 10, v2: -6, dt: 0.02 });
  for (const x of [im.errores.FRestaRapideces, im.errores.FSoloFrenado, im.errores.FSinDividir]) assert.notEqual(x, im.FmediaModulo);
  const pe = motor.pendulo({ mb: 0.02, v: 200, M: 1.98 });
  for (const x of [pe.errores.hSoloEnergia, pe.errores.hSinMedio, pe.errores.hIgualV]) assert.notEqual(x, pe.h);
  const ex = motor.explosion({ m1: 1, m2: 3, v2: 2 });
  for (const x of [ex.errores.vcmPuntoMedio, ex.errores.vcmSigue1, ex.errores.vcmSigue2]) assert.notEqual(x, ex.vcm);
});
test('los ángulos notables coinciden con el seno de verdad a menos de 0,4°, en los cuatro cuadrantes', () => {
  for (const k of Object.keys(motor.NOTABLES)) for (const base of [0, 180, 360]) for (const s of [1, -1]) {
    const a = base + s * +k, t = motor.trig(a);
    assert.ok(Math.abs(t.sen - Math.sin(a * Math.PI / 180)) < 0.007, `sen ${a}°`);
    assert.ok(Math.abs(t.cos - Math.cos(a * Math.PI / 180)) < 0.007, `cos ${a}°`);
  }
});

// 4. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.choque({ m1: 0, v1: 2, m2: 1 }), /mayor que cero/);
  assert.throws(() => motor.choque({ m1: 1, v1: 2, m2: 1, e: 1.5 }), /restitución/);
  assert.throws(() => motor.choque({ m1: 1, m2: 1 }), /inválido/);
  assert.throws(() => motor.escenario({ m1: 1, v1: 2, m2: 1, x1: 0, x2: 0.2, d: 0.5 }), /encimados/);
  assert.throws(() => motor.pared({ m: 1, v: 0, dt: 0.1 }), /mayor que cero/);
  assert.throws(() => motor.impulso({ m: 1, v1: 2, v2: 3, dt: 0 }), /mayor que cero/);
  assert.throws(() => motor.pulso({ J: 2, dt: 0.1, forma: 'cuadrado' }), /desconocida/);
  assert.throws(() => motor.areaFt([[0, 0]]), /dos puntos/);
  assert.throws(() => motor.centroMasa([]), /al menos un cuerpo/);
  assert.throws(() => motor.pendulo({ mb: 0.02, v: 2000, M: 0.2, L: 1 }), /vuelta completa/);
  assert.throws(() => motor.rebotePiso({ h1: 1, h2: 2 }), /rebote/);
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
