// Pruebas del motor de dinámica. Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json, verificado con fracciones exactas y otro método, debe salir igual del
//    motor (regla 2 de CLAUDE.md).
// 2. Segunda ley cuerpo por cuerpo: con las fuerzas que da el motor se arma el diagrama de cada bloque
//    por separado (componentes x e y escritas aquí, no en el motor) y la suma debe dar m·a.
// 3. Lo que enseña la escena: la normal no es el peso; el roce estático se ajusta; en un plano sin roce
//    la aceleración no depende de la masa; la tensión no es ningún peso; el par de acción y reacción es
//    igual aunque las masas no lo sean; sin roce el empujón no "se gasta"; la balanza no ve la velocidad.
//    Para las funciones nuevas (vertical, loma, curva, tren, apilados, poleaMovil): componentes escritas aquí,
//    cada cuerpo por separado, la energía en la polea móvil y lo que enseña cada experimento.
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

// 2 y 3 (funciones nuevas): segunda ley por componentes, escrita aquí, y lo que enseña cada experimento.
test('vertical: la cuerda más la parte radial del peso dan m·v²/r; abajo jala 2mg más que arriba (6mg con la energía)', () => {
  for (const m of [0.5, 2, 30]) for (const r of [0.5, 1, 2.5]) for (const v of [1, 3, 6]) {
    for (let theta = 0; theta < 360; theta += 15) {
      const o = { m, v, r, theta }, x = motor.vertical(o), c = Math.cos(rad(theta));
      assert.equal(x.floja, v * v < -g * r * c - 1e-9, `floja ${JSON.stringify(o)}`);
      if (!x.floja) cerca(x.S - m * g * c, m * v * v / r, `radial ${JSON.stringify(o)}`, 1e-6);
      assert.ok(x.S >= 0);
    }
    const abajo = motor.vertical({ m, v, r, theta: 0 }), arriba = motor.vertical({ m, v, r, theta: 180 });
    if (!arriba.floja) cerca(abajo.S - arriba.S, 2 * m * g, `misma rapidez ${m},${r},${v}`);
    const vb = Math.sqrt(v * v + 4 * g * r), conEnergia = motor.vertical({ m, v: vb, r, theta: 0 });
    if (!arriba.floja) cerca(conEnergia.S - arriba.S, 6 * m * g, `con energía ${m},${r},${v}`, 1e-9);
  }
});
test('columpio: con v > 0, en el punto más bajo las cadenas jalan más que el peso', () => {
  for (const v of [0.5, 2, 5, 7]) { const x = motor.vertical({ m: 30, v, r: 2.5, theta: 0 }); assert.ok(x.T > x.P); }
  cerca(motor.vertical({ m: 30, v: 0, r: 2.5, theta: 0 }).T, 300, 'quieta, T = P');
});
test('loma: N baja con la rapidez, llega a 0 justo en √(g·r); desde el reposo despega en arccos(2/3) con cualquier m y r', () => {
  for (const r of [5, 40]) for (const phi of [0, 16, 37]) {
    let antes = Infinity;
    for (let v = 0; v <= 30; v += 0.5) { const N = motor.loma({ m: 800, r, phi, v }).N; assert.ok(N <= antes + 1e-9); antes = N; }
  }
  for (const r of [5, 40]) {
    const vc = Math.sqrt(g * r);
    cerca(motor.loma({ m: 3, r, phi: 0, v: vc }).N, 0, 'N = 0 en √(gr)', 1e-6);
    assert.equal(motor.loma({ m: 3, r, phi: 0, v: vc * 1.01 }).despega, true);
    assert.equal(motor.loma({ m: 3, r, phi: 0, v: vc * 0.99 }).despega, false);
  }
  for (const m of [1, 5, 70]) for (const r of [1, 5, 40]) {
    for (let phi = 1; phi < 48.18; phi += 1) assert.ok(motor.loma({ m, r, phi, desdeReposo: true }).N > 0, `N > 0 en ${phi}°`);
    for (let phi = 48.2; phi <= 90; phi += 1) assert.equal(motor.loma({ m, r, phi, desdeReposo: true }).despega, true, `despega en ${phi}°`);
  }
  for (const v of [1, 10, 19]) { const x = motor.loma({ m: 800, r: 40, phi: 0, v }); assert.ok(x.N < x.P, 'en la cima, N < P si v > 0'); }
});
test('loma: el auto que sale de la cima sigue la pista hasta que N = 0 y luego cae con g', () => {
  const x = motor.loma({ m: 800, r: 40, phi: 0, v: 15 }), fd = Math.acos(225 / 400), td = fd * 40 / 15;
  const p = x.desdeCima(td * 0.5); assert.equal(p.enPista, true); cerca(Math.hypot(p.x, p.y + 40), 40, 'sobre el círculo', 1e-9);
  const q = x.desdeCima(td + 0.3), q2 = x.desdeCima(td + 0.31), q3 = x.desdeCima(td + 0.32);
  assert.equal(q.enPista, false); cerca((q3.y - 2 * q2.y + q.y) / (0.01 * 0.01), -g, 'cae con g', 1e-6);
  assert.equal(motor.loma({ m: 800, r: 40, phi: 0, v: 25 }).desdeCima(0.01).enPista, false, 'a 25 m/s vuela desde la cima');
});
test('curva: por componentes, N y f dan m·v²/r hacia el centro y equilibran el peso; vMax no depende de m', () => {
  for (const m of [500, 1000]) for (const peralte of [0, 16, 37, 53]) for (const v of [5, 12, 20]) for (const r of [30, 50]) {
    // Con los senos de academia (16° = 7/25, 37° = 3/5, …), que son los que usa el examen; trig ya se prueba aparte.
    const x = motor.curva({ m, v, r, peralte, mus: 0.3 }), { sen, cos } = motor.trig(peralte);
    cerca(x.N * sen + x.f * cos, m * v * v / r, `horizontal ${m},${peralte},${v},${r}`, 1e-6);
    cerca(x.N * cos - x.f * sen, m * g, `vertical ${m},${peralte},${v},${r}`, 1e-6);
  }
  cerca(motor.curva({ m: 500, v: 1, r: 50, mus: 0.5 }).vMax, motor.curva({ m: 2000, v: 1, r: 50, mus: 0.5 }).vMax, 'vMax');
  for (const peralte of [16, 37, 53]) { const vi = motor.curva({ m: 1, v: 1, r: 30, peralte }).vIdeal; cerca(motor.curva({ m: 1000, v: vi, r: 30, peralte }).f, 0, `f en vIdeal ${peralte}°`, 1e-6); }
});
test('tren: cada carrito cumple su segunda ley; las tensiones bajan hacia atrás y son F·(masa detrás)/M con cualquier μk', () => {
  for (const masas of [[4, 4, 2], [2, 4, 4], [6, 4], [1, 2, 3, 4], [5, 1, 1, 3]]) for (const F of [12, 50, 90]) for (const muk of [0, 0.1, 0.2]) {
    const x = motor.tren({ masas, F, muk }), M = masas.reduce((s, v) => s + v, 0);
    if (x.sentido === 'quieto') { assert.equal(x.tensiones, null); continue; }
    const T = [F, ...x.tensiones, 0];
    masas.forEach((m, k) => cerca(T[k] - T[k + 1] - muk * m * g, m * x.a, `carrito ${k} ${masas},${F},${muk}`, 1e-9));
    for (let k = 1; k < T.length; k++) assert.ok(T[k] < T[k - 1]);
    x.tensiones.forEach((t, k) => cerca(t / F, masas.slice(k + 1).reduce((s, v) => s + v, 0) / M, 'proporción', 1e-9));
    cerca(motor.tren({ masas: [...masas].reverse(), F, muk }).a, x.a, 'invertir no cambia a');
    cerca(x.tensiones[x.tensiones.length - 1], masas[masas.length - 1] * (x.a + muk * g), 'la última cuerda jala solo al último');
  }
});
test('apilados: cada bloque cumple su segunda ley con el par de roce; juntos si y solo si F ≤ Fmax', () => {
  for (const en of ['abajo', 'arriba']) for (const [mus, muk] of [[0.4, 0.3], [0.5, 0.5], [0.6, 0.2]]) for (const muPiso of [0, 0.1, 0.5]) {
    const mA = 2, mB = 3, M = 5;
    for (let F = 0; F <= 50; F += 0.5) {
      const o = { mA, mB, F, en, mus, muk, muPiso }, x = motor.apilados(o), FA = en === 'arriba' ? F : 0, FB = F - FA;
      cerca(FA + x.roceA, mA * x.aA, `A ${JSON.stringify(o)}`, 1e-9);
      cerca(FB + x.roceB + x.rocePiso, mB * x.aB, `B ${JSON.stringify(o)}`, 1e-9);
      assert.equal(x.roceB, -x.roceA || 0);
      assert.ok(Math.abs(x.rocePiso) <= muPiso * M * g + 1e-9, 'el piso no da más que su máximo');
      if (x.juntos) assert.ok(Math.abs(x.roceA) <= x.fsMax + 1e-9); else cerca(Math.abs(x.roceA), muk * mA * g, 'cinético', 1e-9);
      assert.equal(x.juntos, F <= x.Fmax + 1e-9, `juntos ⇔ F ≤ Fmax ${JSON.stringify(o)}`);
      if (!x.juntos) assert.ok(en === 'abajo' ? x.aB > x.aA : x.aA > x.aB, 'al resbalar, el jalado se adelanta');
    }
  }
  for (const en of ['abajo', 'arriba']) {
    const o = { mA: 2, mB: 3, en, mus: 0.4, muk: 0.4 }, Fm = motor.apilados(Object.assign({ F: 1 }, o)).Fmax;
    const a = motor.apilados(Object.assign({ F: Fm }, o)), b = motor.apilados(Object.assign({ F: Fm + 1e-7 }, o));
    cerca(a.aA, b.aA, `aA continua en Fmax (${en})`, 1e-5); cerca(a.aB, b.aB, `aB continua en Fmax (${en})`, 1e-5);
  }
});
test('polea móvil: cada cuerpo cumple su ecuación; equilibrio solo con m1 = 2·m2; T entre m2·g y m1·g/2; la energía cierra', () => {
  for (const m1 of [1, 2, 4, 6, 10]) for (const m2 of [0.5, 1, 2, 3, 5, 10]) {
    const x = motor.poleaMovil({ m1, m2 });
    cerca(m2 * g - x.T, m2 * x.a2, `m2 ${m1},${m2}`, 1e-9);
    cerca(2 * x.T - m1 * g, m1 * x.a1, `m1 ${m1},${m2}`, 1e-9);
    cerca(x.a1, x.a2 / 2, 'ligadura');
    assert.equal(x.equilibrio, m1 === 2 * m2); assert.equal(x.a2 === 0, m1 === 2 * m2);
    if (!x.equilibrio) { const lo = Math.min(m2 * g, m1 * g / 2), hi = Math.max(m2 * g, m1 * g / 2); assert.ok(x.T > lo && x.T < hi, `${x.T} entre ${lo} y ${hi}`); }
    const d = x.recorrido(1), v2 = x.a2, v1 = x.a1;
    cerca(m2 * g * d.y2 - m1 * g * d.y1, m2 * v2 * v2 / 2 + m1 * v1 * v1 / 2, `energía ${m1},${m2}`, 1e-9);
  }
});

// 4. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.vertical({ m: 1, v: 2, r: 0, theta: 0 }), /mayor que cero/);
  assert.throws(() => motor.vertical({ m: 1, v: 2, r: 1, theta: 360 }), /0° a menos de 360°/);
  assert.throws(() => motor.vertical({ m: 1, v: 2, r: 1, theta: -10 }), /0° a menos de 360°/);
  assert.throws(() => motor.loma({ m: 1, r: 5, phi: 95, v: 1 }), /0° a 90°/);
  assert.throws(() => motor.tren({ masas: [4], F: 10 }), /al menos 2/);
  assert.throws(() => motor.tren({ masas: [4, 0], F: 10 }), /mayor que cero/);
  assert.throws(() => motor.apilados({ mA: 2, mB: 3, F: 5, en: 'medio' }), /'abajo' o 'arriba'/);
  assert.throws(() => motor.apilados({ mA: 2, mB: 3, F: 5, mus: 0.2, muk: 0.3 }), /μk no puede/);
  assert.throws(() => motor.poleaMovil({ m1: 4 }), /inválido|mayor que cero/);
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
