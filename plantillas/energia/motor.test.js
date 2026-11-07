// Pruebas del motor de Trabajo, energía y potencia. Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json, verificado con fracciones exactas y otro método,
//    debe salir igual del motor (regla 2 de CLAUDE.md). "lanza": true pide que el motor rechace la entrada.
// 2. Conservación: a lo largo de cualquier rampa sin roce, Ec + Ep no cambia; en la rampa con
//    resorte, la energía se reparte entre Ep, Ec, Ee y lo que se lleva el roce.
// 3. Lo que la escena enseña también vale en el motor: la rapidez abajo no depende de la masa (W9)
//    ni de la forma de la rampa; el trabajo para subir no depende del camino (W1, W2); a velocidad
//    constante, el trabajo neto es cero (W5); la rapidez al llegar no depende del ángulo (W10);
//    misma fuerza y misma distancia dan la misma energía cinética, sea cual sea la masa (W6).
// 4. Errores de entrada.
// 5. Cada problema de papel.json coincide con el motor.
// 6. Fuerza variable (gráfica F–x): área exacta por tramos, signo, aditividad, resorte, teorema trabajo-energía,
//    tiempo contra una integración independiente (RK4), W6, rapidez mínima, parada, errores de entrada y
//    opciones de las predicciones del modo «Fuerza variable» sacadas de los campos errores del motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');
const Azar = require('../../nucleo/azar.js');

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
  if (espera.lanza) { assert.throws(() => llamar(fn, args), /sale de la gráfica/, `${que}: debía rechazarse`); return null; }
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

// 6. Fuerza variable
const azar = Azar.crear('energia-fuerza-variable');
function graficaAzar(r, n) {
  const pts = []; let x = r.entero(-3, 3);
  for (let k = 0; k < n; k++) { pts.push([x, r.entero(-40, 40)]); x += r.entero(1, 4) * 0.5; }
  return pts;
}
function simpson(f, a, b, n) {
  const h = (b - a) / n; let s = f(a) + f(b);
  for (let k = 1; k < n; k++) s += (k % 2 ? 4 : 2) * f(a + k * h);
  return s * h / 3;
}
test('fuerza variable: el área por tramos coincide con Simpson en cada tramo recto', () => {
  for (let j = 0; j < 200; j++) {
    const p = graficaAzar(azar, azar.entero(2, 6));
    let S = 0;
    for (let k = 1; k < p.length; k++) {
      const [xa, Fa] = p[k - 1], [xb, Fb] = p[k];
      S += simpson(x => Fa + (Fb - Fa) * (x - xa) / (xb - xa), xa, xb, 2000);
    }
    cerca(motor.areaPartes(p).W, S, `gráfica ${JSON.stringify(p)}`);
    cerca(motor.trabajoArea(p), S, 'trabajoArea');
  }
});
test('fuerza variable: signo de las partes y cambio de F por −F', () => {
  for (let j = 0; j < 100; j++) {
    const p = graficaAzar(azar, azar.entero(2, 6)), r = motor.areaPartes(p);
    assert.ok(r.positiva >= 0 && r.negativa <= 0);
    cerca(r.positiva + r.negativa, r.W, 'positiva + negativa = W');
    for (const t of r.tramos) assert.ok(t.Fa * t.Fb >= 0, 'cada tramo tiene un solo signo');
    const q = motor.areaPartes(p.map(([x, F]) => [x, -F]));
    cerca(q.positiva, -r.negativa, 'se intercambian'); cerca(q.negativa, -r.positiva, 'se intercambian');
    const arriba = motor.areaPartes(p.map(([x, F]) => [x, Math.abs(F)]));
    cerca(arriba.negativa, 0, 'toda sobre el eje'); assert.ok(motor.areaPartes(p.map(([x, F]) => [x, -Math.abs(F) - 1])).W < 0);
  }
});
test('fuerza variable: W(a, b) + W(b, c) = W(a, c) y W(b, a) = −W(a, b)', () => {
  for (let j = 0; j < 100; j++) {
    const p = graficaAzar(azar, azar.entero(2, 6)), x0 = p[0][0], xn = p[p.length - 1][0];
    const [a, b, c] = [azar.sig(), azar.sig(), azar.sig()].map(u => x0 + u * (xn - x0));
    cerca(motor.trabajoArea(p, a, b) + motor.trabajoArea(p, b, c), motor.trabajoArea(p, a, c), 'aditividad');
    cerca(motor.trabajoArea(p, b, a), -motor.trabajoArea(p, a, b), 'orientación');
  }
});
test('fuerza variable: una fuerza constante da F·d, como trabajos()', () => {
  for (const [F, d, m] of [[20, 4, 2], [-7, 3, 1], [12.5, 10, 6]]) cerca(motor.trabajoArea([[0, F], [d, F]]), motor.trabajos({ m, d, F }).WF, `F = ${F}`);
});
test('resorte: resorteArea = trabajoResorte = área bajo F = kx = grande − chico; de 0 a x, la mitad de F·x', () => {
  for (const [k, x1, x2] of [[600, 0.1, 0.3], [200, 0, 0.25], [500, -0.2, 0.2], [80, 0.3, 0.05]]) {
    const r = motor.resorteArea(k, x1, x2);
    cerca(r.W, motor.trabajoResorte(k, x1, x2), 'trabajoResorte');
    cerca(r.W, motor.trabajoArea([[Math.min(x1, x2), k * Math.min(x1, x2)], [Math.max(x1, x2), k * Math.max(x1, x2)]], x1, x2), 'área');
    cerca(r.W, r.grande - r.chico, 'grande − chico');
    cerca(motor.resorteArea(k, 0, x2).W, motor.resorteArea(k, 0, x2).errores.FPorX / 2, 'el ½ del triángulo');
  }
});
const graficasQueLlegan = [];
while (graficasQueLlegan.length < 20) {
  const p = graficaAzar(azar, azar.entero(2, 5)), m = azar.entero(1, 8), v0 = azar.entero(2, 8);
  const r = motor.fuerzaVariable({ puntos: p, m, v0 });
  if (!r.seDetiene && r.Ecmin > 0.5) graficasQueLlegan.push({ puntos: p, m, v0 });
}
test('teorema trabajo-energía: en cada punto del recorrido, ½mv² − ½mv0² = W(x)', () => {
  for (const o of graficasQueLlegan) {
    const rc = motor.recorridoFuerza(o);
    for (const q of rc.puntos) cerca(0.5 * o.m * q.v * q.v - 0.5 * o.m * o.v0 * o.v0, motor.trabajoHasta(o.puntos, q.x), `x = ${q.x}`);
    assert.ok(rc.puntos.every((q, k) => k === 0 || q.t > rc.puntos[k - 1].t), 'el tiempo crece');
  }
});
// RK4 de x″ = F(x)/m escrito aquí, sin usar el motor, con dt = 1e-4 s.
function fuerzaPropia(p, x) {
  for (let k = 1; k < p.length; k++) { const [xa, Fa] = p[k - 1], [xb, Fb] = p[k]; if (xb > xa && x <= xb) return Fa + (Fb - Fa) * (Math.max(x, xa) - xa) / (xb - xa); }
  return p[p.length - 1][1];
}
function tiempoRK4(p, m, v0) {
  let x = p[0][0], v = v0, t = 0; const dt = 1e-4, xn = p[p.length - 1][0], a = x => fuerzaPropia(p, x) / m;
  while (x < xn) {
    const k1x = v, k1v = a(x), k2x = v + dt / 2 * k1v, k2v = a(x + dt / 2 * k1x), k3x = v + dt / 2 * k2v, k3v = a(x + dt / 2 * k2x), k4x = v + dt * k3v, k4v = a(x + dt * k3x);
    const nx = x + dt / 6 * (k1x + 2 * k2x + 2 * k3x + k4x), nv = v + dt / 6 * (k1v + 2 * k2v + 2 * k3v + k4v);
    if (nx >= xn) return t + dt * (xn - x) / (nx - x);
    x = nx; v = nv; t += dt;
  }
  return t;
}
test('el tiempo de recorridoFuerza coincide con un RK4 independiente (error < 1e-4 s)', () => {
  for (const o of graficasQueLlegan) {
    const t = motor.recorridoFuerza(o).tiempo, tr = tiempoRK4(o.puntos, o.m, o.v0);
    assert.ok(Math.abs(t - tr) < 1e-4, `${JSON.stringify(o)}: motor ${t}, RK4 ${tr}`);
  }
});
test('W6 con fuerza variable: misma F(x) desde el reposo, misma Ec final; el tiempo crece como √m', () => {
  const p = [[0, 10], [2, 25], [4, 40]], t1 = motor.recorridoFuerza({ puntos: p, m: 1 }).tiempo;
  for (const m of [1, 2, 5, 8]) {
    cerca(motor.fuerzaVariable({ puntos: p, m }).Ec, 100, `Ec con ${m} kg`);
    cerca(motor.recorridoFuerza({ puntos: p, m }).tiempo, t1 * Math.sqrt(m), `tiempo con ${m} kg`, 1e-6);
  }
});
test('rapidez mínima: si F pasa de negativa a positiva, la Ec mínima está en el cero de F', () => {
  for (const [p, v0] of [[[[0, -8], [4, 0], [8, 20]], 5], [[[0, -30], [4, 10]], 7], [[[0, -10], [3, -2], [5, 6]], 6]]) {
    const r = motor.fuerzaVariable({ puntos: p, m: 2, v0 }), z = motor.areaPartes(p).ceros[0];
    cerca(r.xEcmin, z, 'x de la Ec mínima'); cerca(r.Ecmin, r.Ec0 + motor.trabajoHasta(p, z), 'Ec mínima');
  }
});
test('parada: si se detiene, Ec0 + W(xDetiene) = 0 y ahí F ≤ 0; si no, v² > 0 en todo el recorrido', () => {
  let paradas = 0;
  for (let j = 0; j < 150; j++) {
    const p = graficaAzar(azar, azar.entero(2, 5)), m = azar.entero(1, 8), v0 = azar.entero(0, 6);
    const r = motor.fuerzaVariable({ puntos: p, m, v0 });
    if (!r.arranca) { assert.ok(v0 === 0 && p[0][1] <= 0); continue; }
    if (r.seDetiene) {
      paradas++;
      cerca(r.Ec0 + motor.trabajoHasta(p, r.xDetiene), 0, 'energía al detenerse', 1e-7);
      assert.ok(motor.fuerzaEn(p, r.xDetiene) <= 1e-9, 'la fuerza lo regresa');
    } else {
      for (const q of motor.recorridoFuerza({ puntos: p, m, v0 }).puntos.slice(1)) assert.ok(q.v > 0, 'sigue andando');
    }
  }
  assert.ok(paradas > 5, 'el azar debe probar paradas');
});
test('fuerza variable: errores de entrada', () => {
  assert.throws(() => motor.areaPartes([[0, 1]]), /dos puntos/);
  assert.throws(() => motor.areaPartes([[0, 1], [2, 3], [1, 4]]), /menor a mayor/);
  assert.throws(() => motor.areaPartes([[0, 1], [2, NaN]]), /inválido/);
  assert.throws(() => motor.areaPartes([[2, 1], [2, 3]]), /tramo de x/);
  assert.throws(() => motor.trabajoArea([[0, 0], [4, 10]], 0, 4.5), /sale de la gráfica/);
  assert.throws(() => motor.fuerzaEn([[0, 0], [4, 10]], -0.1), /sale de la gráfica/);
  assert.throws(() => motor.fuerzaVariable({ puntos: [[0, 0], [4, 10]], m: 0 }), /masa/);
  assert.throws(() => motor.fuerzaVariable({ puntos: [[0, 0], [4, 10]], m: 2, x1: 3, x2: 1 }), /mayor/);
  assert.throws(() => motor.resorteArea(-5, 0, 1), /constante/);
});
test('fuerza variable: v0 = 0 con F ≤ 0 al inicio no arranca (sin tiempo infinito)', () => {
  for (const p of [[[0, 0], [4, 20]], [[0, -5], [4, 20]]]) {
    const r = motor.recorridoFuerza({ puntos: p, m: 2 });
    assert.equal(r.arranca, false); assert.equal(r.tiempo, 0);
  }
});
// Opciones de las predicciones del modo «Fuerza variable» (index.html): salen de errores, son distintas dos a dos
// y solo una coincide con la respuesta.
test('predicciones del modo Fuerza variable: cuatro valores distintos y uno solo correcto', () => {
  const a = motor.fuerzaVariable({ puntos: [[0, 10], [4, 40]], m: 2 }), e = a.errores;
  const s = motor.fuerzaVariable({ puntos: [[0, -8], [4, 0], [8, 20]], m: 2, v0: 5 }), es = s.errores;
  const k = motor.resorteArea(600, 0.1, 0.3), ek = k.errores;
  for (const [ops, bien, que] of [[[e.FfinalPorD, a.W, e.pendiente, e.FinicialPorD], a.W, 'P1'],
                                   [[es.sumaSinSigno, es.soloPositiva, es.FfinalPorD, s.W], s.W, 'P3'],
                                   [[ek.mitadDeltaCuadrado, ek.FfinalPorDelta, k.W, ek.desdeCero], k.W, 'P4']]) {
    assert.equal(new Set(ops.map(v => Math.round(v * 1e6))).size, 4, `${que}: opciones repetidas`);
    assert.equal(ops.filter(v => Math.abs(v - bien) < 1e-9).length, 1, `${que}: una sola correcta`);
  }
  // P2: con 2 kg y 8 kg, la misma Ec, distinta rapidez y distinto tiempo.
  const b = motor.fuerzaVariable({ puntos: [[0, 10], [4, 40]], m: 8 });
  cerca(a.Ec, b.Ec, 'misma Ec'); assert.ok(a.v > b.v);
  assert.ok(motor.recorridoFuerza({ puntos: [[0, 10], [4, 40]], m: 8 }).tiempo > motor.recorridoFuerza({ puntos: [[0, 10], [4, 40]], m: 2 }).tiempo);
});
