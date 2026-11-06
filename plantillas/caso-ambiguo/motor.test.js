// Pruebas del motor de «El compás del caso ambiguo». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con triángulos al azar (semilla fija): los ángulos suman 180°; a/sen A = b/sen B = c/sen C = 2R;
//    la ley de cosenos coincide con la distancia entre los vértices dibujados y con 90° es Pitágoras; el término
//    2bc·cos A resta con ángulo agudo y suma con obtuso; Herón da el mismo área que b·c·sen A/2; proyecciones y
//    tangentes; resolver rearma el mismo triángulo desde LLL, LAL, ALA, AAL y LLA. En el caso ambiguo: el número
//    de triángulos es el de cortes del compás delante de A, cada corte está a distancia a de C, las dos soluciones
//    tienen B suplementarios y c₁·c₂ = b² − a² (potencia de A respecto del compás). En la circunscrita, el ángulo
//    inscrito no cambia al mover el vértice. Ningún error típico da la respuesta correcta.
// 3. Errores de entrada.
// 4. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');
const PI = Math.PI;

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
function cerca(real, esperado, que, tol) {
  const t = tol === undefined ? 1e-9 : tol;
  if (Array.isArray(esperado)) { assert.ok(Array.isArray(real), `${que}: no es lista`); assert.equal(real.length, esperado.length, `${que}: largo`); esperado.forEach((e, k) => cerca(real[k], e, `${que}[${k}]`, t)); return; }
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
function llamar(fn, args) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  return motor[fn](...args);
}
const campo = (r, k) => (k === 'valor' ? r : k.split('.').reduce((o, p) => (o == null ? o : o[p]), r));
function comprobar(fn, args, espera, que) {
  const r = llamar(fn, args);
  for (const [k, v] of Object.entries(espera)) {
    const x = campo(r, k);
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    cerca(x, v, `${que} · ${k}`);
  }
}

// 1. casos.json
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'caso-ambiguo');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 25);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
let semilla = 2026;
const rnd = () => (semilla = (Math.imul(semilla, 1664525) + 1013904223) >>> 0) / 4294967296;
const al = (a, b) => a + (b - a) * rnd();
const N = 400;
const S = g => Math.sin(g * PI / 180), Cs = g => Math.cos(g * PI / 180);
// Un triángulo al azar desde dos ángulos y el radio de la circunscrita (así siempre existe).
function azar() {
  const A = al(5, 165), B = al(3, 175 - A - 2), C = 180 - A - B, R = al(0.5, 20);
  return { A, B, C, a: 2 * R * S(A), b: 2 * R * S(B), c: 2 * R * S(C), R };
}
function igualTri(t, u, que) {
  for (const k of ['a', 'b', 'c', 'A', 'B', 'C']) cerca(t[k], u[k], `${que} · ${k}`, 1e-7);
}

test('triangulo desde tres lados: ángulos que suman 180°, ley de senos con 2R, Herón, R = abc/(4S), r = S/p', () => {
  for (let k = 0; k < N; k++) {
    const x = azar(), t = motor.triangulo(x.a, x.b, x.c);
    igualTri(t, x, 'LLL');
    cerca(t.A + t.B + t.C, 180, 'suma');
    for (const [l, g] of [['a', 'A'], ['b', 'B'], ['c', 'C']]) cerca(t[l] / S(t[g]), 2 * x.R, `${l}/sen ${g} = 2R`, 1e-8);
    cerca(t.R, x.R, 'R', 1e-8);
    cerca(t.area, x.b * x.c * S(x.A) / 2, 'S = bc·sen A/2', 1e-8);
    cerca(motor.heron(x.a, x.b, x.c).S, t.area, 'Herón', 1e-7);
    cerca(t.R, x.a * x.b * x.c / (4 * t.area), 'R = abc/(4S)', 1e-7);
    cerca(t.r, t.area / t.p, 'r = S/p');
    cerca(t.alturas.a * x.a / 2, t.area, 'S = a·hₐ/2');
    const max = Math.max(x.A, x.B, x.C);
    assert.equal(t.tipo, Math.abs(max - 90) < 1e-9 ? 'rectángulo' : max > 90 ? 'obtusángulo' : 'acutángulo');
  }
});
test('ley de cosenos: coincide con la distancia entre B y C; con 90° es Pitágoras; el término resta si A es agudo y suma si es obtuso', () => {
  for (let k = 0; k < N; k++) {
    const b = al(0.5, 20), c = al(0.5, 20), A = al(1, 179), l = motor.leyCosenos({ b, c, A });
    const P = l.puntos;
    cerca(l.a, Math.hypot(P.C.x - P.B.x, P.C.y - P.B.y), 'a = |BC|', 1e-8);
    cerca(Math.hypot(P.C.x, P.C.y), b, '|AC| = b', 1e-9);
    cerca(l.a2, l.pitagoras - l.termino, 'a² = b² + c² − 2bc·cos A', 1e-8);
    cerca(l.termino, 2 * c * l.proyeccion, '2bc·cos A = 2·c·(b·cos A): el rectángulo de la proyección', 1e-8);
    assert.equal(l.signo, A < 90 ? 'resta' : 'suma');
    if (A < 90) assert.ok(l.a2 < l.pitagoras); else assert.ok(l.a2 > l.pitagoras);
    // el lado opuesto crece al abrir el ángulo
    assert.ok(motor.leyCosenos({ b, c, A: Math.min(179.5, A + 0.5) }).a > l.a);
    // los errores dan otra cosa
    assert.ok(Math.abs(l.errores.signoCambiado.a2 - l.a2) > 1e-6, 'signo cambiado');
    cerca(l.errores.sinTermino.a2, b * b + c * c, 'sin término');
    assert.ok(l.errores.sumaLados.a > l.a, 'b + c es más que a (desigualdad triangular)');
    // y el ángulo vuelve desde los tres lados
    cerca(motor.anguloLLL({ a: l.a, b, c }).A, A, 'anguloLLL', 1e-6);
    cerca(motor.anguloLLL({ a: l.a, b, c }).errores.signoCambiado, 180 - A, 'signo cambiado: el suplemento', 1e-6);
  }
  const p = motor.leyCosenos({ b: 3, c: 4, A: 90 });
  assert.equal(p.signo, 'nada'); assert.equal(p.a, 5); assert.equal(p.termino, 0);
});
test('proyecciones y tangentes', () => {
  for (let k = 0; k < N; k++) {
    const x = azar(), p = motor.proyecciones(x), t = motor.leyTangentes(x);
    cerca(p.a, x.a, 'a = b·cos C + c·cos B', 1e-8); cerca(p.b, x.b, 'b', 1e-8); cerca(p.c, x.c, 'c', 1e-8);
    if (Math.abs(x.A - x.B) > 1e-6) cerca(t.izquierda, t.derecha, 'ley de tangentes', 1e-7);
  }
});
test('resolver rearma el mismo triángulo desde LLL, LAL, ALA, AAL y LLA', () => {
  for (let k = 0; k < N; k++) {
    const x = azar();
    igualTri(motor.resolver({ a: x.a, b: x.b, c: x.c }).soluciones[0], x, 'LLL');
    for (const [l1, l2, g] of [['b', 'c', 'A'], ['a', 'c', 'B'], ['a', 'b', 'C']]) {
      const r = motor.resolver({ [l1]: x[l1], [l2]: x[l2], [g]: x[g] });
      assert.equal(r.caso, 'LAL'); igualTri(r.soluciones[0], x, 'LAL ' + g);
    }
    let r = motor.resolver({ c: x.c, A: x.A, B: x.B }); assert.equal(r.caso, 'ALA'); igualTri(r.soluciones[0], x, 'ALA');
    r = motor.resolver({ a: x.a, A: x.A, B: x.B }); assert.equal(r.caso, 'AAL'); igualTri(r.soluciones[0], x, 'AAL');
    // LLA: el triángulo original está entre las soluciones
    for (const [g, op, otro] of [['A', 'a', 'b'], ['B', 'b', 'c'], ['C', 'c', 'a']]) {
      r = motor.resolver({ [g]: x[g], [op]: x[op], [otro]: x[otro] });
      assert.equal(r.caso, 'LLA');
      assert.ok(r.n >= 1 && r.soluciones.length === r.n);
      assert.ok(r.soluciones.some(t => ['a', 'b', 'c', 'A', 'B', 'C'].every(q => Math.abs(t[q] - x[q]) <= 1e-6 * Math.max(1, x[q]))), 'LLA contiene el original');
    }
  }
});
test('caso ambiguo: cuántos triángulos según h = b·sen A, y los cortes del compás', () => {
  const vistos = {};
  for (let k = 0; k < 4 * N; k++) {
    const A = rnd() < 0.15 ? al(90, 170) : al(5, 89.5), b = al(1, 12), h = b * S(A);
    const a = [al(0.2, h), al(h, b), al(b, 3 * b), h, b][Math.floor(rnd() * 5)];
    const r = motor.casoAmbiguo({ A, b, a });
    vistos[r.situacion] = (vistos[r.situacion] || 0) + 1;
    cerca(r.h, h, 'h');
    // la regla de academia
    let n;
    if (A >= 90) n = a > b + 1e-9 ? 1 : 0;
    else if (Math.abs(a - h) <= 1e-9 * Math.max(1, h)) n = 1;
    else if (a < h) n = 0;
    else if (a < b - 1e-9) n = 2;
    else n = 1;
    assert.equal(r.n, n, `A=${A} b=${b} a=${a}`);
    // = los cortes delante de A
    assert.equal(r.cortes.filter(q => q.valido).length, r.n, 'cortes válidos');
    for (const q of r.cortes) {
      cerca(Math.hypot(q.x - r.C.x, r.C.y), a, 'el corte está a distancia a de C', 1e-8);
      cerca(Math.cos(q.direccion * PI / 180) * a + r.C.x, q.x, 'dirección del brazo', 1e-7);
      if (!q.valido) assert.ok(q.x <= 1e-9, 'el corte inválido cae en A o detrás');
    }
    // cada solución cumple las leyes
    for (const t of r.soluciones) {
      cerca(t.A + t.B + t.C, 180, 'suma'); cerca(t.a / S(t.A), t.b / S(t.B), 'ley de senos', 1e-8);
      cerca(motor.leyCosenos({ b: t.b, c: t.c, A: t.A }).a, a, 'ley de cosenos', 1e-7);
    }
    if (r.n === 2) {
      cerca(r.B[0] + r.B[1], 180, 'B₂ = 180° − B₁');
      cerca(r.c[0] * r.c[1], b * b - a * a, 'c₁·c₂ = b² − a²', 1e-8);
      cerca(r.c[0] + r.c[1], 2 * b * Cs(A), 'c₁ + c₂ = 2b·cos A', 1e-8);
      assert.equal(r.errores.soloAgudo.n, 1); cerca(r.errores.soloAgudo.B, r.B[0], 'solo el agudo');
    }
    if (r.n === 0 && a < h) assert.equal(r.errores.senoMayorQueUno, true);
  }
  for (const s of ['no-alcanza', 'tangente', 'dos', 'uno', 'obtuso-no', 'obtuso-uno']) assert.ok(vistos[s] > 0, `se probó ${s}`);
});
test('circunscrita: el vértice A recorre el arco y el ángulo inscrito no cambia; a/sen A = 2R', () => {
  for (let k = 0; k < N; k++) {
    const a = al(0.5, 20), A = al(5, 170), L = motor.leySenos({ a, A });
    cerca(L.diametro, 2 * L.R, '2R'); cerca(L.razon, a / S(A), 'a/sen A');
    for (const t of [0.05, 0.3, 0.5, 0.8, 0.95]) {
      const i = motor.inscrito({ a, A, t });
      cerca(i.anguloEnP, A, `ángulo inscrito en t = ${t}`, 1e-7);
      cerca(Math.hypot(i.P.x, i.P.y), L.R, '|OP| = R', 1e-8); cerca(Math.hypot(i.B.x, i.B.y), L.R, '|OB| = R', 1e-8);
      cerca(i.C.x - i.B.x, a, 'cuerda a');
    }
  }
});
test('área: S = bc·sen A/2 = c·h/2 y Herón da lo mismo; con A y 180° − A el área es la misma', () => {
  for (let k = 0; k < N; k++) {
    const b = al(0.5, 20), c = al(0.5, 20), A = al(1, 179), s = motor.areaLAL({ b, c, A });
    cerca(s.S, c * s.h / 2, 'c·h/2', 1e-8);
    cerca(motor.heron(s.ladoA, b, c).S, s.S, 'Herón', 1e-6);
    cerca(motor.areaLAL({ b, c, A: 180 - A }).S, s.S, 'suplemento', 1e-8);
    cerca(s.errores.sinMitad, 2 * s.S, 'sin el ½');
    assert.equal(s.pieFuera, A > 90);
  }
});
test('ángulos notables: valores exactos que coinciden con Math.sin y sen² + cos² = 1', () => {
  for (const g of [0, 30, motor.G37, 45, motor.G53, 60, 90, 120, 180 - motor.G53, 135, 180 - motor.G37, 150, 180]) {
    const n = motor.notable(g);
    assert.ok(n, `notable(${g})`);
    cerca(n.sen.valor, Math.sin(g * PI / 180), `sen ${g}`, 1e-12); cerca(n.cos.valor, Math.cos(g * PI / 180), `cos ${g}`, 1e-12);
    cerca(n.sen.valor ** 2 + n.cos.valor ** 2, 1, 'sen² + cos²');
  }
  assert.equal(motor.sen(30), 0.5); assert.equal(motor.cos(60), 0.5); assert.equal(motor.cos(90), 0);
  assert.equal(motor.notable(37), null, '37 a secas no es el 37° de academia: se pasa G37');
  assert.equal(motor.raizTexto(75), '5√3'); assert.equal(motor.raizTexto(2.5), null);
  assert.equal(motor.fraccionTexto(-0.5), '−1/2');
});

test('ningún error típico coincide con la respuesta correcta (si coincide, el motor lo deja en null)', () => {
  const dif = (x, y, que) => assert.ok(Math.abs(x - y) > 1e-9 * Math.max(1, Math.abs(y)), `${que}: el error da ${x}, igual que la correcta`);
  const notables = [30, 45, 60, 90, 120, 135, 150, motor.G37, motor.G53];
  for (let k = 0; k < 4 * N; k++) {
    const A = rnd() < 0.4 ? notables[Math.floor(rnd() * notables.length)] : al(5, 170), b = Math.round(al(1, 12)), c = Math.round(al(1, 12));
    const h = b * S(A), a = [Math.round(al(1, 14)), h, b, al(h, b)][Math.floor(rnd() * 4)];
    // caso ambiguo: ningún error da el mismo número de triángulos con los mismos B
    const K = motor.casoAmbiguo({ A, b, a }), E = K.errores;
    const igualSol = (n, Bs) => n === K.n && Bs.length === K.B.length && Bs.every((x, j) => Math.abs(x - K.B[j]) < 1e-9);
    if (E.soloAgudo) assert.ok(!igualSol(E.soloAgudo.n, [E.soloAgudo.B]), 'soloAgudo');
    if (E.siempreDos) assert.ok(!igualSol(E.siempreDos.n, E.siempreDos.B), 'siempreDos');
    if (E.rectanguloEnB) assert.ok(!(K.n === 1 && Math.abs(K.B[0] - 90) < 1e-9 && Math.abs(K.c[0] - E.rectanguloEnB.c) < 1e-9), 'rectanguloEnB');
    if (E.senoEnRadianes !== null) dif(E.senoEnRadianes, K.senB, 'senoEnRadianes');
    // ley de cosenos
    const L = motor.leyCosenos({ b, c, A });
    for (const [q, v] of Object.entries(L.errores)) if (v) dif(v.a2, L.a2, 'leyCosenos.' + q);
    // ángulo desde tres lados
    if (L.a < b + c && b < L.a + c && c < L.a + b && Math.abs(L.a - b - c) > 1e-6) {
      const T = motor.anguloLLL({ a: L.a, b, c });
      for (const [q, v] of Object.entries(T.errores)) if (v !== null) dif(v, T.A, 'anguloLLL.' + q);
    }
    // ley de senos y área
    const LS = motor.leySenos({ a: b, A });
    for (const [q, v] of Object.entries(LS.errores)) if (v !== null) dif(v, LS.R, 'leySenos.' + q);
    const AR = motor.areaLAL({ b, c, A });
    for (const [q, v] of Object.entries(AR.errores)) if (v !== null) dif(v, AR.S, 'areaLAL.' + q);
  }
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.triangulo(1, 2, 3), /no se forma/);
  assert.throws(() => motor.triangulo(1, 2, 5), /no se forma/);
  assert.throws(() => motor.triangulo(0, 2, 2), /mayor que cero/);
  assert.throws(() => motor.casoAmbiguo({ A: 0, b: 2, a: 1 }), /entre 0° y 180°/);
  assert.throws(() => motor.casoAmbiguo({ A: 180, b: 2, a: 1 }), /entre 0° y 180°/);
  assert.throws(() => motor.casoAmbiguo({ A: 30, b: '8', a: 1 }), /número/);
  assert.throws(() => motor.leyCosenos({ b: 3, c: -4, A: 30 }), /mayor que cero/);
  assert.throws(() => motor.anguloLLL({ a: 10, b: 3, c: 5 }), /no se forma/);
  assert.throws(() => motor.resolver({ A: 30, B: 60, C: 90 }), /al menos un lado/);
  assert.throws(() => motor.resolver({ a: 3, b: 4 }), /tres datos/);
  assert.throws(() => motor.resolver({ a: 3, A: 100, B: 90 }), /menos de 180/);
  assert.throws(() => motor.heron(1, 1, 3), /no se forma/);
  assert.throws(() => motor.tan(90), /no existe/);
});

// 4. Problemas de papel (regla 6)
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
    assert.ok(!/\d\.\d/.test(p.enunciado + p.respuesta + p.pasos.join('')), `${p.id}: se escribe con coma decimal`);
  }
});
for (const p of (papel && papel.problemas) || []) test(`papel ${p.id}: la respuesta coincide con el motor`, () => {
  for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id);
});
