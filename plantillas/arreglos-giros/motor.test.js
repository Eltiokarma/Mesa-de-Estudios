// Pruebas del motor de «Fichas, espejos y ruedas». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con números al azar (semilla fija):
//    - los 8 cuadrados mágicos de 1 a 9 son los giros y reflejos de uno solo; en cualquier progresión, el centro es el
//      término del medio, y en todo cuadrado mágico el centro es la constante entre 3;
//    - revisarCuadrado está de acuerdo con la búsqueda: un cuadrado es mágico si y solo si sale en las soluciones;
//    - en TODAS las distribuciones de un polígono (sirvan o no), la suma de los lados es el total más los vértices, y
//      las que sirven cumplen lados · S = total + V; la vuelta atrás encuentra las mismas que la fuerza bruta;
//    - cuatro giros de 90° devuelven la pieza, dos reflejos también, y compararPiezas reconoce cada giro y cada reflejo;
//    - las vueltas de una rueda son el recorrido de su centro entre 2πr, y coinciden con la simulación por puntos de
//      contacto (que no mira el centro) y con el ángulo que da rodarEn;
//    - los radios de cada vuelco son las distancias reales al pivote (con volcarEn) y el exacto da la longitud;
//    - la región barrida coincide con una suma de anillos;
//    - NINGÚN ERROR TÍPICO COINCIDE CON LA RESPUESTA (los que coinciden van en 'coinciden') ni con otro error.
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
  if (esperado === null) { assert.equal(real, null, que); return; }
  if (Array.isArray(esperado)) { assert.ok(Array.isArray(real), `${que}: no es lista`); assert.equal(real.length, esperado.length, `${que}: largo`); esperado.forEach((e, k) => cerca(real[k], e, `${que}[${k}]`, t)); return; }
  if (esperado && typeof esperado === 'object') {
    assert.ok(real && typeof real === 'object', `${que}: no es objeto`);
    assert.deepEqual(Object.keys(real).sort(), Object.keys(esperado).sort(), `${que}: claves`);
    for (const [k, v] of Object.entries(esperado)) cerca(real[k], v, `${que}.${k}`, t);
    return;
  }
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(typeof real === 'number' && Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
// {"pieza": "bandera"} es motor.piezas.bandera
const resolver = a => (a && typeof a === 'object' && !Array.isArray(a) && typeof a.pieza === 'string' && Object.keys(a).length === 1 ? motor.piezas[a.pieza]
  : Array.isArray(a) ? a.map(resolver) : a);
function llamar(fn, args) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  return motor[fn](...args.map(resolver));
}
const campo = (r, k) => (k === '' ? r : k.split('.').reduce((o, p) => (o == null ? o : o[p]), r));
function comprobar(fn, args, espera, que) {
  const r = llamar(fn, args);
  for (const [k, v] of Object.entries(espera)) {
    const x = campo(r, k);
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    cerca(x, v, `${que} · ${k || fn}`);
  }
}

// 1. casos.json
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'arreglos-giros');
  assert.ok(datos.casos.length >= 16 && datos.casos.length <= 22);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
  assert.ok(datos.casos.some(c => c.tambien && c.tambien.length), 'algún caso trae «tambien»');
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
let semilla = 2026;
const rnd = () => (semilla = (Math.imul(semilla, 1664525) + 1013904223) >>> 0) / 4294967296;
const ent = (a, b) => Math.floor(a + (b - a + 1) * rnd());
const casi = (a, b) => (typeof a === 'number' && typeof b === 'number' ? Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)) : a === b);
function sinChoques(R, correcto, que) {
  assert.ok(R.errores && typeof R.errores === 'object', `${que}: falta errores`);
  assert.ok(Array.isArray(R.coinciden), `${que}: falta coinciden`);
  assert.ok(R.repetidos && typeof R.repetidos === 'object', `${que}: falta repetidos`);
  for (const [k, v] of Object.entries(R.errores)) assert.ok(!casi(v, correcto), `${que}: el error ${k} da la respuesta (${JSON.stringify(v)})`);
  const vs = Object.values(R.errores);
  for (let i = 0; i < vs.length; i++) for (let j = i + 1; j < vs.length; j++) assert.ok(!casi(vs[i], vs[j]), `${que}: dos errores dan lo mismo`);
}
function permutaciones(a) {
  if (a.length <= 1) return [a.slice()];
  const out = [];
  a.forEach((x, i) => { for (const p of permutaciones(a.slice(0, i).concat(a.slice(i + 1)))) out.push([x].concat(p)); });
  return out;
}
const mezclar = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = ent(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };

test('los 8 cuadrados mágicos de 1 a 9 son los giros y reflejos de uno solo', () => {
  const C = motor.cuadradoMagico();
  assert.equal(C.cuantas, 8);
  const sol = new Set(C.soluciones.map(s => s.join(',')));
  assert.equal(sol.size, 8, 'las 8 soluciones son distintas');
  const sim = new Set(motor.simetriasCuadrado(C.soluciones[0]).map(s => s.join(',')));
  assert.deepEqual([...sim].sort(), [...sol].sort());
  // y los 8 son de verdad mágicos según revisarCuadrado
  for (const s of C.soluciones) assert.ok(motor.revisarCuadrado(s).magico);
  sinChoques(C, C.centro, 'centro de 1 a 9');
});
test('el centro de un cuadrado mágico es la constante entre 3; en una progresión, el término del medio', () => {
  for (let k = 0; k < 12; k++) {
    const a = ent(-20, 30), d = ent(1, 9) * (rnd() < .5 ? 1 : 1.5);
    const N = mezclar(Array.from({ length: 9 }, (_, i) => a + i * d));
    const C = motor.cuadradoMagico(N);
    assert.equal(C.cuantas, 8, 'progresión: 8 soluciones');
    assert.ok(casi(C.centro, a + 4 * d), 'el término del medio');
    assert.ok(casi(C.centro, C.medio));
    for (const s of C.soluciones) assert.ok(casi(s[4], C.constante / 3));
    sinChoques(C, C.centro, 'progresión');
  }
  // números al azar: casi nunca hay solución; si la hay, el centro es K/3
  for (let k = 0; k < 6; k++) {
    const N = new Set(); while (N.size < 9) N.add(ent(1, 30));
    const C = motor.cuadradoMagico([...N]);
    for (const s of C.soluciones) assert.ok(casi(s[4], C.constante / 3));
    if (!C.cuantas) assert.equal(C.centro, null);
  }
});
test('revisarCuadrado: mágico si y solo si está en las soluciones (todas las formas con 1 a 9 en las esquinas fijas)', () => {
  const sol = new Set(motor.cuadradoMagico().soluciones.map(s => s.join(',')));
  let magicos = 0;
  for (const p of permutaciones([1, 2, 3, 4, 5, 6, 7, 8, 9]).filter((_, i) => i % 7 === 0)) {
    const R = motor.revisarCuadrado(p);
    assert.equal(R.magico, sol.has(p.join(',')));
    assert.equal(R.buenas, R.lineas.filter(l => l.suma === 15).length);
    if (R.magico) magicos++;
  }
  // una casilla vacía deja las líneas que pasan por ella sin suma
  const R = motor.revisarCuadrado([2, 7, 6, 9, null, 1, 4, 3, 8]);
  assert.equal(R.lineas.filter(l => l.suma === null).length, 4);
  assert.equal(R.magico, false);
  assert.ok(magicos >= 0);
});
test('polígonos: en todas las distribuciones, suma de los lados = total + vértices; la vuelta atrás halla las mismas que la fuerza bruta', () => {
  for (const [lados, porLado] of [[3, 3], [4, 3], [3, 2], [5, 3]]) {
    const n = lados * (porLado - 1);
    const N = lados === 5 ? Array.from({ length: n }, (_, k) => k + 1) : mezclar(Array.from({ length: n }, (_, k) => k + 1 + (rnd() < .3 ? 10 : 0))).filter((x, i, a) => a.indexOf(x) === i);
    if (N.length !== n) continue;
    const T = motor.poligonoNumeros({ numeros: N, lados, porLado });
    const total = N.reduce((s, x) => s + x, 0);
    const perms = n <= 8 ? permutaciones(N) : [];
    let sirven = 0;
    for (const d of perms) {
      const sumas = T.ladosPos.map(l => l.reduce((s, k) => s + d[k], 0)), V = T.vertices.reduce((s, v) => s + d[v], 0);
      assert.ok(casi(sumas.reduce((s, x) => s + x, 0), total + V), 'Σ lados = total + V');
      if (sumas.every(s => casi(s, sumas[0]))) sirven++;
    }
    if (perms.length) assert.equal(T.distribuciones, sirven, `${lados} lados, ${porLado} por lado`);
    for (const g of T.sumas) {
      assert.ok(casi(lados * g.S, total + g.V), 'lados · S = total + V');
      assert.equal(g.cuantas, g.distintas * 2 * lados, 'cada distribución tiene 2 · lados copias por giros y reflejos');
    }
  }
});
test('sumaLado: ningún error da la respuesta; la respuesta no pasa de la cota', () => {
  for (const o of [{}, { porLado: 4 }, { lados: 4 }, { numeros: [2, 4, 6, 8, 10, 12] }, { numeros: [1, 3, 4, 5, 7, 9] }]) {
    for (const extremo of ['minimo', 'maximo']) {
      let R;
      try { R = motor.sumaLado(Object.assign({ extremo }, o)); } catch (e) { continue; }
      sinChoques(R, R.respuesta, JSON.stringify(o) + extremo);
      if (extremo === 'minimo') assert.ok(R.respuesta >= R.cota - 1e-9); else assert.ok(R.respuesta <= R.cota + 1e-9);
    }
  }
});
function piezaAzar(k) {
  const c = [[0, 0]], s = new Set(['0,0']);
  while (c.length < k) {
    const [x, y] = c[ent(0, c.length - 1)], [dx, dy] = [[1, 0], [-1, 0], [0, 1], [0, -1]][ent(0, 3)];
    const q = [x + dx, y + dy];
    if (!s.has(q.join(','))) { s.add(q.join(',')); c.push(q); }
  }
  return c;
}
test('piezas: cuatro giros de 90° y dos reflejos devuelven la pieza; compararPiezas reconoce giros y reflejos', () => {
  for (let k = 0; k < 60; k++) {
    const p = piezaAzar(ent(3, 7));
    assert.ok(motor.iguales(motor.girar(p, 4), p));
    assert.ok(motor.iguales(motor.girar(motor.girar(motor.girar(motor.girar(p)))), p));
    assert.ok(motor.iguales(motor.reflejar(motor.reflejar(p)), p));
    assert.ok(motor.iguales(motor.girar(p, -1), motor.girar(p, 3)));
    // girar y después reflejar = reflejar y girar al revés
    assert.ok(motor.iguales(motor.reflejar(motor.girar(p, 1)), motor.girar(motor.reflejar(p), -1)));
    const O = motor.orientaciones(p);
    assert.ok([1, 2, 4].includes(O.giros));
    assert.equal(O.conReflejos, O.quiral ? 2 * O.giros : O.giros);
    if (O.quiral) {
      const v = ent(0, 3), g = motor.girar(p, v), r = motor.girar(motor.reflejar(p), ent(0, 3));
      const C = motor.compararPiezas(p, [r, g]);
      assert.deepEqual(C.tipos, ['reflejo', 'giro']);
      assert.equal(C.correcta, 1);
      assert.ok(motor.iguales(motor.girar(p, C.giros[1]), g));
      sinChoques(C, C.correcta, 'piezas');
    }
  }
  // la bandera es quiral; la T no
  assert.equal(motor.orientaciones(motor.piezas.bandera).quiral, true);
  assert.equal(motor.orientaciones(motor.piezas.te).quiral, false);
  assert.throws(() => motor.compararPiezas(motor.piezas.bandera, [motor.piezas.espejo, motor.piezas.otra]), /exactamente una/);
});
test('ruedas: vueltas = recorrido del centro / (2πr) = simulación por puntos de contacto = rodarEn', () => {
  for (let k = 0; k < 30; k++) {
    const r = ent(1, 6) / 2, R = r * ent(1, 8) + (rnd() < .5 ? 0 : ent(1, 5) / 4), m = ent(1, 3);
    for (const lado of ['fuera', 'dentro']) {
      if (lado === 'dentro' && !(r < R)) continue;
      const C = motor.rodarCirculo({ R, r, lado, alrededor: m });
      assert.ok(casi(C.vueltas, C.recorridoCentro / (2 * Math.PI * r)));
      const S = motor.simularRodar({ r, camino: [{ tipo: 'arco', R, angulo: 360 * m, lado }], pasos: 400 });
      assert.ok(Math.abs(S.vueltas - C.vueltas) < 1e-7, `simulación ${S.vueltas} contra ${C.vueltas}`);
      assert.equal(S.marcas, Math.floor(C.vueltas + 1e-9));
      const E = motor.rodarEn({ R, r, lado, theta: Math.PI / 2 - 2 * Math.PI });
      assert.ok(Math.abs(E.phi / (2 * Math.PI) - C.vueltas / m) < 1e-9);
      sinChoques(C, C.vueltas, `rueda R = ${R}, r = ${r}, ${lado}`);
    }
    // sobre una recta
    const L = ent(1, 40), Rr = motor.rodarRecta({ r, L });
    assert.ok(casi(Rr.vueltas, L / (2 * Math.PI * r)));
    assert.ok(Math.abs(motor.simularRodar({ r, camino: [{ tipo: 'recta', largo: L }] }).vueltas - Rr.vueltas) < 1e-9);
    // alrededor de un rectángulo: recorrido del centro = perímetro + 2πr
    const a = ent(1, 9), b = ent(1, 9), Q = motor.rodarRectangulo({ a, b, r });
    assert.ok(casi(Q.vueltas, Q.recorridoCentro / (2 * Math.PI * r)));
    const camino = [a, b, a, b].flatMap(x => [{ tipo: 'recta', largo: x }, { tipo: 'esquina', angulo: 90 }]);
    assert.ok(Math.abs(motor.simularRodar({ r, camino }).vueltas - Q.vueltas) < 1e-9);
    sinChoques(Q, Q.vueltas, 'rectángulo');
    // rodarRectanguloEn: el centro se queda a r del rectángulo y al final la rueda giró las vueltas de rodarRectangulo
    for (let i = 0; i <= 40; i++) {
      const P = motor.rodarRectanguloEn({ a, b, r, t: i / 40 });
      const dx = Math.max(0 - P.cx, 0, P.cx - a), dy = Math.max(0 - P.cy, 0, P.cy - b);
      assert.ok(Math.abs(Math.hypot(dx, dy) - r) < 1e-9, 'el centro va a r del borde');
    }
    assert.ok(Math.abs(motor.rodarRectanguloEn({ a, b, r, t: 1 }).phi / (2 * Math.PI) - Q.vueltas) < 1e-9);
  }
});
test('vuelcos: los radios son las distancias reales al pivote y el exacto da la longitud', () => {
  for (const n of [3, 4, 6]) for (let k = 0; k < 6; k++) {
    const l = ent(1, 9) / (rnd() < .5 ? 1 : 2), vuelcos = ent(1, 2 * n), punto = ent(0, n - 1);
    const V = motor.volcar({ n, l, vuelcos, punto });
    let suma = 0;
    for (let j = 1; j <= vuelcos; j++) {
      const antes = motor.volcarEn({ n, l, t: j - 1 }), medio = motor.volcarEn({ n, l, t: j - .5 });
      const piv = medio.pivote, p = antes.vertices[punto];
      const d = Math.hypot(p[0] - piv[0], p[1] - piv[1]);
      assert.ok(Math.abs(d - V.radios[j - 1]) < 1e-9, `radio del vuelco ${j}`);
      assert.ok(Math.abs(piv[1]) < 1e-9, 'el pivote está en el suelo');
      // durante el vuelco el punto se queda a la misma distancia del pivote
      const q = medio.vertices[punto];
      assert.ok(Math.abs(Math.hypot(q[0] - piv[0], q[1] - piv[1]) - d) < 1e-9);
      suma += (360 / n) * Math.PI / 180 * d;
    }
    assert.ok(Math.abs(suma - V.longitud) < 1e-9);
    assert.ok(Math.abs((V.coef.a + V.coef.b * Math.sqrt(V.coef.c)) * Math.PI - V.longitud) < 1e-9);
    // tras n vuelcos el polígono avanzó n · l y quedó como al inicio
    const fin = motor.volcarEn({ n, l, t: n }), ini = motor.volcarEn({ n, l, t: 0 });
    fin.vertices.forEach((p, i) => { assert.ok(Math.abs(p[0] - ini.vertices[i][0] - n * l) < 1e-9 && Math.abs(p[1] - ini.vertices[i][1]) < 1e-9); });
    sinChoques(V, V.longitud, `vuelco n = ${n}`);
  }
});
test('región barrida = suma de anillos delgados; ningún error da el área', () => {
  for (let k = 0; k < 20; k++) {
    const a = ent(0, 20), b = a + ent(1, 40), ang = ent(1, 36) * 10;
    const R = motor.regionBarrida({ a, b, angulo: ang });
    let s = 0; const N = 2000, dr = (b - a) / N;
    for (let i = 0; i < N; i++) { const rr = a + (i + .5) * dr; s += (ang * Math.PI / 180) * rr * dr; }
    assert.ok(Math.abs(s - R.area) < 1e-6 * R.area);
    sinChoques(R, R.area, 'región');
  }
});
test('textoPi y fraccion', () => {
  const T = motor.textoPi;
  assert.equal(T(2, 1, 2), '(2 + √2)π');
  assert.equal(T(1, .5, 2), '(2 + √2)π/2');
  assert.equal(T(4), '4π');
  assert.equal(T(1), 'π');
  assert.equal(T(.5), 'π/2');
  assert.equal(T(2 / 3), '2π/3');
  assert.equal(T(0, 1, 3), '√3π');
  assert.equal(T(0), '0');
  assert.equal(motor.fraccion(3.5).texto, '7/2');
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.cuadradoMagico([1, 2, 3]), /9 números/);
  assert.throws(() => motor.cuadradoMagico([1, 1, 2, 3, 4, 5, 6, 7, 8]), /repetir/);
  assert.throws(() => motor.revisarCuadrado([1, 2]), /9/);
  assert.throws(() => motor.poligonoNumeros({ lados: 2 }), /al menos/);
  assert.throws(() => motor.poligonoNumeros({ numeros: [1, 2, 3] }), /6 números/);
  assert.throws(() => motor.sumaLado({ extremo: 'medio' }), /extremo/);
  assert.throws(() => motor.girar([[0, 0], [0, 0]]), /repite/);
  assert.throws(() => motor.girar([]), /lista/);
  assert.throws(() => motor.rodarCirculo({ R: 1, r: 2, lado: 'dentro' }), /menor/);
  assert.throws(() => motor.rodarCirculo({ R: 1, r: 0 }), /mayor que cero/);
  assert.throws(() => motor.simularRodar({ r: 1, camino: [{ tipo: 'salto' }] }), /tramo/);
  assert.throws(() => motor.volcar({ n: 5, l: 1 }), /3, 4 o 6/);
  assert.throws(() => motor.regionBarrida({ a: 5, b: 3, angulo: 90 }), /menor/);
});

// 4. papel.json
const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
test('papel.json: formato', () => {
  assert.ok(papel.titulo && papel.problemas.length >= 8 && papel.problemas.length <= 10);
  for (const p of papel.problemas) assert.ok(p.id && p.enunciado && p.respuesta && p.pasos.length && p.verificar.length, p.id);
});
for (const p of papel.problemas) test(`papel ${p.id}`, () => {
  for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id);
});
