// Pruebas del motor de dinámica. Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json, verificado con fracciones exactas y otro método, debe salir igual del
//    motor (regla 2 de CLAUDE.md).
// 2. Segunda ley cuerpo por cuerpo: con las fuerzas que da el motor se arma el diagrama de cada bloque
//    por separado (componentes x e y escritas aquí, no en el motor) y la suma debe dar m·a.
// 3. Lo que enseña la escena: la normal no es el peso; el roce estático se ajusta; en un plano sin roce
//    la aceleración no depende de la masa; la tensión no es ningún peso; el par de acción y reacción es
//    igual aunque las masas no lo sean; sin roce el empujón no "se gasta"; la balanza no ve la velocidad.
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
  if (fn === 'empujonEstado') return motor.empujon(args[0]).estado(args[1]);
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
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(c.fn, t.args, t.espera, c.nombre);
});

// 2. Segunda ley cuerpo por cuerpo
const g = 10;
const rad = d => d * Math.PI / 180;
test('plano: la suma de las fuerzas sobre el bloque, en ejes horizontal y vertical, da m·a', () => {
  for (const m of [1, 4, 10]) for (const angulo of [10, 25, 37, 50, 70]) for (const mus of [0, 0.3, 0.8]) for (const F of [0, 15, 90]) for (const v0 of [0, 3, -3]) {
    const o = { m, angulo, mus, muk: mus * 0.75, F, v0, exacto: true };
    const r = motor.plano(o), th = rad(angulo);
    // Eje "abajo del plano": (cos θ, −sen θ) en x horizontal, y vertical; normal hacia afuera: (sen θ, cos θ).
    const abajo = [Math.cos(th), -Math.sin(th)], fuera = [Math.sin(th), Math.cos(th)];
    const fuerzas = [[0, -m * g], fuera.map(c => c * r.N), abajo.map(c => c * r.roce), abajo.map(c => -c * F)];
    const sx = fuerzas.reduce((s, f) => s + f[0], 0), sy = fuerzas.reduce((s, f) => s + f[1], 0);
    cerca(sx, m * r.a * abajo[0], `ΣFx ${JSON.stringify(o)}`, 1e-9);
    cerca(sy, m * r.a * abajo[1], `ΣFy ${JSON.stringify(o)}`, 1e-9);
    assert.ok(r.roceModulo <= Math.max(r.fsMax, r.fk) + 1e-9, 'el roce nunca pasa de su máximo');
  }
});
test('piso: la suma de fuerzas da m·a en los dos ejes (también cuando la fuerza lo levanta)', () => {
  for (const m of [2, 10]) for (const F of [0, 20, 50, 150]) for (const angulo of [-37, 0, 30, 53, 80]) for (const mus of [0, 0.25, 0.6]) {
    const r = motor.piso({ m, F, angulo, mus, exacto: true }), th = rad(angulo);
    const sx = F * Math.cos(th) + r.roce, sy = F * Math.sin(th) + r.N - m * g;
    cerca(sx, m * r.a, `ΣFx m=${m} F=${F} θ=${angulo} μ=${mus}`, 1e-9);
    cerca(sy, m * r.ay, `ΣFy m=${m} F=${F} θ=${angulo} μ=${mus}`, 1e-9);
    assert.ok(r.N >= 0);
  }
});
test('poleas: cada bloque por separado cumple su segunda ley con la misma tensión', () => {
  for (const m1 of [1, 3, 8]) for (const m2 of [1, 2, 5]) for (const angulo of [0, 30, 37, 60]) for (const mus of [0, 0.2, 0.5]) {
    const r = motor.planoPolea({ m1, m2, angulo, mus, exacto: true }), th = rad(angulo);
    // m2 cuelga: positivo hacia abajo. m1: positivo hacia arriba del plano (hacia la polea); su roce, con el signo del motor.
    cerca(m2 * g - r.T, m2 * r.a, `m2 ${m1},${m2},${angulo},${mus}`, 1e-9);
    cerca(r.T - m1 * g * Math.sin(th) + r.roce, m1 * r.a, `m1 ${m1},${m2},${angulo},${mus}`, 1e-9);
    cerca(r.N, m1 * g * Math.cos(th), 'normal de m1', 1e-9);
  }
  for (const [m1, m2] of [[3, 2], [1, 9], [5, 5], [0.5, 2.5]]) {
    const r = motor.atwood({ m1, m2 });
    cerca(m1 * g - r.T, m1 * r.a, `atwood m1 ${m1},${m2}`); cerca(r.T - m2 * g, m2 * r.a, `atwood m2 ${m1},${m2}`);
  }
});
test('contacto: cada caja cumple su segunda ley y las dos se empujan igual', () => {
  for (const [m1, m2, F, muk] of [[8, 2, 50, 0], [6, 4, 60, 0.2], [1, 9, 30, 0.1], [3, 3, 12, 0]]) {
    const r = motor.contacto({ m1, m2, F, muk });
    cerca(F - r.contacto21 - muk * m1 * g, m1 * r.a, 'caja 1');
    cerca(r.contacto12 - muk * m2 * g, m2 * r.a, 'caja 2');
    assert.equal(r.contacto12, r.contacto21);
  }
});

// 3. Lo que enseña la escena
test('la normal en el plano es mg·cos θ, menor que el peso, y no depende de F, de v0 ni del roce', () => {
  for (const angulo of [16, 30, 37, 53]) {
    const base = motor.plano({ m: 10, angulo }).N;
    assert.ok(base < 100);
    for (const o of [{ F: 70 }, { v0: -4, mus: 0.4 }, { mus: 0.9 }]) cerca(motor.plano(Object.assign({ m: 10, angulo }, o)).N, base, 'N');
  }
});
test('sin roce, la aceleración en el plano no depende de la masa', () => {
  for (const angulo of [20, 37, 45]) {
    const a = motor.plano({ m: 1, angulo }).a;
    for (const m of [0.5, 3, 80]) cerca(motor.plano({ m, angulo }).a, a, `a con m = ${m}`);
  }
});
test('el roce estático crece con el ángulo hasta μs·N y recién ahí el bloque desliza', () => {
  const mus = 0.5, lim = motor.plano({ m: 10, angulo: 1, mus }).anguloLimite;
  let anterior = -1;
  for (let angulo = 1; angulo < 60; angulo += 0.5) {
    const r = motor.plano({ m: 10, angulo, mus, muk: 0.4, exacto: true });
    if (angulo < lim - 1e-6) {
      assert.equal(r.sentido, 'quieto', `a ${angulo}° no desliza`);
      cerca(r.roceModulo, r.Ppar, 'roce estático = componente del peso');
      assert.ok(r.roceModulo > anterior); anterior = r.roceModulo;
      assert.ok(r.roceModulo <= r.fsMax + 1e-9);
    } else if (angulo > lim + 1e-6) assert.equal(r.sentido, 'baja', `a ${angulo}° desliza`);
  }
});
test('la tensión en Atwood queda entre los dos pesos, nunca igual a uno si las masas difieren', () => {
  for (const [m1, m2] of [[3, 2], [6, 4], [1, 9], [2.5, 2]]) {
    const r = motor.atwood({ m1, m2 }), lo = Math.min(m1, m2) * g, hi = Math.max(m1, m2) * g;
    assert.ok(r.T > lo && r.T < hi, `${r.T} entre ${lo} y ${hi}`);
  }
});
test('tercera ley: el empujón entre las cajas es igual en los dos sentidos aunque las masas sean distintas', () => {
  const r = motor.contacto({ m1: 8, m2: 2, F: 50 });
  assert.equal(r.contacto12, r.contacto21);
  assert.notEqual(r.neta1, r.neta2, 'pero las fuerzas netas sí son distintas');
});
test('sin roce, al soltar el empujón la velocidad se queda constante; con roce, frena y se detiene', () => {
  const libre = motor.empujon({ m: 2, F: 10, dur: 2 });
  for (const t of [2, 3, 7, 20]) cerca(libre.v(t), 10, `v a ${t} s sin roce`);
  assert.equal(libre.tParada, null);
  const roce = motor.empujon({ m: 2, F: 10, dur: 2, muk: 0.25 });
  for (let t = 2; t < 4; t += 0.25) assert.ok(roce.v(t + 0.25) < roce.v(t));
  cerca(roce.v(9), 0, 'quieto'); cerca(roce.x(9), roce.xFinal, 'posición final');
  // Si el empuje no vence el roce estático, no se mueve.
  const nada = motor.empujon({ m: 2, F: 4, dur: 2, muk: 0.25 });
  cerca(nada.x(5), 0, 'no se movió');
});
test('la balanza del ascensor depende de la aceleración, no de la velocidad', () => {
  for (const a of [-3, 0, 2]) {
    const N = motor.ascensor({ m: 60, a }).N;
    for (const v of [-6, 0, 4]) cerca(motor.ascensor({ m: 60, a, v }).N, N, `a = ${a}, v = ${v}`);
  }
});
test('un bloque lanzado hacia arriba del plano: el tiempo de parada y la distancia salen de la cinemática', () => {
  const r = motor.plano({ m: 2, angulo: 37, mus: 0.5, v0: -10 });
  cerca(r.tParada, 10 / r.a, 'tParada');
  // ¿Se queda arriba si el roce estático alcanza? Con μs = 0,8 a 37°, sí.
  assert.equal(motor.plano({ m: 2, angulo: 37, mus: 0.8, muk: 0.5, v0: -10 }).despues.sentido, 'quieto');
});
test('los ángulos notables coinciden con el seno de verdad a menos de 0,4°', () => {
  for (const k of Object.keys(motor.NOTABLES)) {
    const t = motor.trig(+k), d = Math.abs(Math.asin(t.sen) * 180 / Math.PI - +k);
    assert.ok(d < 0.4, `${k}°: ${d}`);
    cerca(t.sen * t.sen + t.cos * t.cos, 1, `sen² + cos² en ${k}°`);
  }
});

// 4. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.plano({ m: 0, angulo: 30 }), /mayor que cero/);
  assert.throws(() => motor.plano({ m: 2, angulo: 120 }), /0° a 90°/);
  assert.throws(() => motor.plano({ m: 2, angulo: 30, mus: 0.2, muk: 0.5 }), /μk no puede/);
  assert.throws(() => motor.plano({ m: 2, angulo: 'empinado' }), /inválido/);
  assert.throws(() => motor.piso({ m: 2, F: -5 }), /negativo/);
  assert.throws(() => motor.atwood({ m1: 2 }), /inválido|mayor que cero/);
  assert.throws(() => motor.centripeta({ m: 1, v: 2, r: 0 }), /mayor que cero/);
  assert.throws(() => motor.empujon({ m: 1, F: 2, dur: 0 }), /mayor que cero/);
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
