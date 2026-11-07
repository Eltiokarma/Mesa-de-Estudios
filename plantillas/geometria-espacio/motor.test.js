// Pruebas del motor de «El cubo que gira» (rectas y planos en el espacio). Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con números al azar (semilla fija):
//    - la varilla: es perpendicular a una sola recta del piso por su pie salvo si está vertical; el ángulo con su sombra
//      es el ángulo con el piso y es el menor ángulo con las rectas del piso (por eso se mide con la proyección);
//    - la perpendicular común de dos rectas cruzadas es perpendicular a las dos y su largo es la distancia;
//    - tres perpendiculares: con PA ⊥ plano y AB ⊥ L, PB ⊥ L, y PB es la menor distancia de P a los puntos de L;
//    - el diedro no depende del punto de la arista donde se mide y coincide con la abertura de la puerta;
//    - el triedro: si existe, las aristas forman entre sí las tres caras; al cerrar el desarrollo, las dos caras se juntan;
//    - el dibujo: ángulos y distancias en el espacio no cambian al girar la vista (el ángulo del dibujo sí);
//    - NINGÚN ERROR TÍPICO COINCIDE CON LA RESPUESTA CORRECTA (los que coinciden van en 'coinciden' y sí dan lo mismo).
// 3. Las predicciones de la escena: los números que ofrece cada una son distintos entre sí.
// 4. Errores de entrada.
// 5. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');
const U = motor.util;

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
function cerca(real, esperado, que, tol) {
  const t = tol === undefined ? 1e-9 : tol;
  if (Array.isArray(esperado)) { assert.ok(Array.isArray(real), `${que}: se esperaba una lista`); assert.equal(real.length, esperado.length, `${que}: largo`); esperado.forEach((e, k) => cerca(real[k], e, `${que}[${k}]`, t)); return; }
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(typeof real === 'number' && Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
function llamar(fn, args) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  return motor[fn](...args);
}
// '' es el resultado entero (funciones que devuelven un número o un punto)
const campo = (r, k) => (k === '' ? r : k.split('.').reduce((o, p) => (o == null ? o : o[p]), r));
function comprobar(fn, args, espera, que) {
  const r = llamar(fn, args);
  for (const [k, v] of Object.entries(espera)) {
    const x = campo(r, k);
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    cerca(x, v, `${que} · ${k || 'resultado'}`, 1e-9);
  }
}

// 1. casos.json
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'geometria-espacio');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 20, `hay ${datos.casos.length} casos`);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
function azar(sem) { let s = (sem >>> 0) || 1; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; }
const rnd = azar(2026);
const ent = (a, b) => a + Math.floor((b - a + 1) * rnd());
const real = (a, b) => a + (b - a) * rnd();
const N = 300;
const casi = (a, b, t) => Math.abs(a - b) <= (t || 1e-9) * Math.max(1, Math.abs(a), Math.abs(b));
const vecAzar = () => [real(-5, 5), real(-5, 5), real(-5, 5)];
const LETRAS = 'ABCDEFGH';
function rectaAzar() { const i = ent(0, 7); let j = ent(0, 7); while (j === i) j = ent(0, 7); return LETRAS[i] + LETRAS[j]; }

// Ningún error coincide con la respuesta; los apartados sí coinciden.
function sinChoques(r, que) {
  for (const [k, g] of Object.entries(r.errores)) {
    for (const [e, v] of Object.entries(g)) assert.ok(!(typeof v === 'number' ? casi(v, r.respuestas[k]) : v === r.respuestas[k]), `${que}: el error ${k}.${e} (${v}) coincide con la respuesta`);
  }
}

test('la varilla: perpendicular a una sola recta del piso salvo si está vertical; con su sombra forma el ángulo con el piso, el menor de todos', () => {
  for (let k = 0; k < N; k++) {
    const incl = ent(5, 90), dir = ent(-180, 180);
    const V = motor.varilla({ incl, dir, largo: real(1, 9) });
    sinChoques(V, `varilla ${incl}, ${dir}`);
    const angulos = [];
    for (let phi = 0; phi < 180; phi += 1) angulos.push([phi, motor.anguloConRecta({ incl, dir, phi })]);
    const rectos = angulos.filter(([, g]) => casi(g, 90, 1e-9));
    if (incl === 90) { assert.equal(rectos.length, 180); assert.equal(V.respuestas.cuantas, 'todas'); }
    else {
      assert.ok(rectos.length <= 1, 'a lo más una recta (con paso de 1°)');
      assert.ok(casi(motor.anguloConRecta({ incl, dir, phi: V.perpendicularA }), 90), 'perpendicular a la recta que dice el motor');
      assert.equal(V.respuestas.cuantas, 1);
    }
    const conSombra = motor.anguloConRecta({ incl, dir, phi: dir });
    assert.ok(casi(conSombra, incl), 'con la sombra forma el ángulo con el piso');
    for (const [, g] of angulos) assert.ok(g >= conSombra - 1e-9, 'ninguna recta del piso forma un ángulo menor que la sombra');
    assert.ok(casi(V.sombra ** 2 + V.altura ** 2, (U.norma(U.sub(V.punta, V.O))) ** 2), 'Pitágoras con la sombra y la altura');
  }
});

test('rectas cruzadas: la perpendicular común es perpendicular a las dos y mide la distancia; ninguna otra pareja de puntos queda más cerca', () => {
  for (let k = 0; k < N; k++) {
    const P1 = vecAzar(), d1 = vecAzar(), P2 = vecAzar(), d2 = vecAzar();
    const R = motor.posicionRectas(P1, d1, P2, d2);
    if (R.tipo !== 'cruzadas') continue;
    const w = U.sub(R.pies[1], R.pies[0]);
    assert.ok(Math.abs(U.dot(w, d1)) < 1e-7 * U.norma(d1) * Math.max(1, U.norma(w)), 'perpendicular a la primera');
    assert.ok(Math.abs(U.dot(w, d2)) < 1e-7 * U.norma(d2) * Math.max(1, U.norma(w)), 'perpendicular a la segunda');
    assert.ok(casi(U.norma(w), R.distancia, 1e-7), 'su largo es la distancia');
    for (let j = 0; j < 20; j++) {
      const X = U.add(P1, U.mul(d1, real(-5, 5))), Y = U.add(P2, U.mul(d2, real(-5, 5)));
      assert.ok(U.norma(U.sub(X, Y)) >= R.distancia - 1e-9, 'ninguna pareja más cerca');
    }
    assert.ok(R.angulo >= 0 && R.angulo <= 90);
  }
});

test('rectas del cubo: posición coherente y simétrica; las aristas que no se tocan ni son paralelas son cruzadas', () => {
  for (let k = 0; k < N; k++) {
    const a = ent(1, 10), r1 = rectaAzar(), r2 = rectaAzar();
    const A = motor.rectasCubo(a, r1, r2), B = motor.rectasCubo(a, r2, r1);
    assert.equal(A.tipo, B.tipo); assert.ok(casi(A.angulo, B.angulo)); assert.ok(casi(A.distancia, B.distancia));
    const comun = [...r1].some(x => r2.includes(x));
    if (comun && A.tipo !== 'coincidentes') assert.equal(A.tipo, 'secantes', `${r1} y ${r2} comparten un vértice`);
    if (A.tipo === 'cruzadas') { assert.ok(!comun); assert.ok(A.distancia > 0); }
  }
  const C = motor.cubo(4);
  let cruzadas = 0;
  for (let i = 0; i < 12; i++) for (let j = i + 1; j < 12; j++) {
    const r = motor.rectasCubo(4, C.aristas[i].join(''), C.aristas[j].join(''));
    if (r.tipo === 'cruzadas') { cruzadas++; assert.ok(casi(r.distancia, 4)); assert.equal(r.angulo, 90); }
  }
  assert.equal(cruzadas, 24, 'cada arista del cubo se cruza con otras 4: 12 · 4 / 2 = 24 parejas');
});

test('tres perpendiculares: PB ⊥ L y PB es la menor distancia de P a los puntos de L', () => {
  for (let k = 0; k < N; k++) {
    const h = real(0.5, 10), m = real(0.5, 10), largo = real(0.5, 10);
    const T = motor.tresPerpendiculares({ h, m, largo });
    sinChoques(T, 'tres perpendiculares');
    const PB = U.sub(T.B, T.P), L = U.sub(T.extremo, T.B);
    assert.ok(Math.abs(U.dot(PB, L)) < 1e-9 * Math.max(1, U.norma(PB) * U.norma(L)), 'PB ⊥ L');
    const D = motor.distanciaPuntoRecta(T.P, T.B, L);
    assert.ok(casi(D.distancia, T.distancia)); cerca(D.pie, T.B, 'el pie es B', 1e-9);
    for (let j = 0; j < 20; j++) { const X = U.add(T.B, U.mul(L, real(-3, 3))); assert.ok(U.norma(U.sub(T.P, X)) >= T.distancia - 1e-9); }
  }
});

test('el diedro: no depende del punto de la arista ni de los puntos elegidos en cada semiplano; la puerta abierta φ forma φ con el piso', () => {
  for (let k = 0; k < N; k++) {
    const a = ent(1, 10), abre = ent(1, 179), ancho = real(0.5, 12);
    const P = motor.puerta({ a, ancho, abre });
    const [A, B, B2, A2] = P.esquinas;
    const piso = U.add(A, [real(-3, 3), real(0.2, 5), 0]);
    const D1 = motor.diedro(A, B, piso, A2), D2 = motor.diedro(A, B, piso, B2), D3 = motor.diedro(B, A, U.add(piso, [real(-3, 3), real(0, 2), 0]), U.lerp(A2, B2, rnd()));
    for (const D of [D1, D2, D3]) { assert.ok(casi(D.diedro, abre, 1e-9), `diedro ${D.diedro} y puerta ${abre}`); sinChoques(D, 'diedro'); }
    assert.ok(Math.abs(U.dot(D1.perpC, U.sub(B, A))) < 1e-9 && Math.abs(U.dot(D1.perpD, U.sub(B, A))) < 1e-9, 'se mide con perpendiculares a la arista');
  }
});

test('el triedro: si existe, sus aristas forman las tres caras y el desarrollo se cierra; si no, falla un criterio', () => {
  let existen = 0;
  for (let k = 0; k < N; k++) {
    const caras = [ent(5, 175), ent(5, 175), ent(5, 175)];
    const T = motor.triedro({ caras });
    sinChoques(T, `triedro ${caras}`);
    assert.equal(T.existe, T.criterios.cadaCara && T.criterios.suma && T.criterios.desigualdad);
    if (!T.existe) { assert.throws(() => motor.desarrolloTriedro({ caras, f: 0.5 }), /no existe/); motor.desarrolloTriedro({ caras, f: 0 }); continue; }
    existen++;
    const [e1, e2, e3] = T.aristas;
    assert.ok(casi(motor.anguloVectores(e2, e3), caras[0], 1e-7), 'α entre e2 y e3');
    assert.ok(casi(motor.anguloVectores(e1, e3), caras[1], 1e-7), 'β entre e1 y e3');
    assert.ok(casi(motor.anguloVectores(e1, e2), caras[2], 1e-7), 'γ entre e1 y e2');
    const D = motor.desarrolloTriedro({ caras, f: 1 });
    assert.ok(U.norma(U.sub(D.libres[0], D.libres[1])) < 1e-7, 'las dos caras se juntan al cerrar');
    assert.ok(U.norma(U.sub(D.libres[0], e3)) < 1e-7, 'y se juntan en la tercera arista');
    const abierto = motor.desarrolloTriedro({ caras, f: 0 });
    for (const c of abierto.caras) for (const p of c.puntos) assert.ok(Math.abs(p[2]) < 1e-9, 'abierto, todo queda en el piso');
    const medio = motor.desarrolloTriedro({ caras, f: 0.5 });
    for (const c of medio.caras) for (const p of c.puntos) assert.ok(p[2] > -1e-9, 'las caras se doblan hacia arriba');
    // el diedro de cada arista con la fórmula general
    const dd = motor.diedro([0, 0, 0], e1, e2, e3);
    assert.ok(casi(dd.diedro, T.diedros[0], 1e-7), 'el diedro en e1');
  }
  assert.ok(existen > 20, 'la muestra trae triedros que existen');
});

test('el dibujo: girar la vista cambia el ángulo que se ve, nunca el ángulo en el espacio', () => {
  for (let k = 0; k < 60; k++) {
    const az = ent(-180, 180), el = ent(5, 60);
    const A = motor.anguloEnVertice({ a: 6, v: 'B', p: 'E', q: 'C', vista: { az, el } });
    assert.equal(A.respuestas.angulo, 90);
    const R = motor.anguloRectasCubo({ a: 6, r1: 'AE', r2: 'BD', vista: { az, el } });
    assert.equal(R.respuestas.angulo, 90);
    sinChoques(A, 'ángulo en vértice'); sinChoques(R, 'ángulo entre rectas');
    const g = motor.anguloEnDibujo([0, 0, 0], [1, 0, 0], [0, 1, 0], { az, el });
    assert.ok(g >= 0 && g <= 180);
  }
  // vista de frente (az = 0, el = 0): el piso se ve de canto y la cara del frente, en verdadera magnitud
  assert.ok(casi(motor.anguloEnDibujo([0, 0, 0], [1, 0, 0], [0, 0, 1], { az: 0, el: 0 }), 90));
});

test('ningún error típico coincide con la respuesta, con muchos datos', () => {
  for (let k = 0; k < N; k++) {
    const a = ent(1, 12);
    sinChoques(motor.anguloDiagonal({ largo: ent(1, 12), ancho: ent(1, 12), alto: ent(1, 12) }), 'diagonal');
    sinChoques(motor.proyeccion({ largo: ent(2, 20), h1: 0, h2: ent(0, 1) }), 'proyección');
    sinChoques(motor.varilla({ incl: ent(5, 90), dir: ent(0, 359), vista: { az: ent(-60, 60), el: ent(5, 50) } }), 'varilla');
    let r1 = rectaAzar(), r2 = rectaAzar();
    sinChoques(motor.anguloRectasCubo({ a, r1, r2, vista: { az: ent(-60, 60), el: ent(5, 50) } }), `ángulo ${r1} ${r2}`);
    const T = motor.rectasCubo(a, r1, r2);
    if (T.tipo === 'cruzadas') sinChoques(motor.distanciaCruzadas({ a, r1, r2 }), `cruzadas ${r1} ${r2}`);
    const v = LETRAS[ent(0, 7)];
    if (!r1.includes(v)) sinChoques(motor.distanciaVerticeRecta({ a, v, r: r1 }), `de ${v} a ${r1}`);
  }
  // los apartados sí dan lo mismo
  assert.deepEqual(motor.anguloRectasCubo({ a: 6, r1: 'AE', r2: 'BD' }).coinciden.angulo, ['recto']);
  assert.deepEqual(motor.varilla({ incl: 45, dir: 0 }).coinciden.conM, ['complemento']);
});

// 3. Las predicciones de la escena: lo que se ofrece son números distintos
test('predicciones de la escena: las opciones son distintas y la correcta está entre ellas', () => {
  const V0 = motor.VISTA0;
  const grupos = [
    ['varilla', motor.varilla({ incl: 60, dir: 90, largo: 4, O: [3, 3, 0], vista: V0 }), 'cuantas'],
    ['diagonal', motor.anguloDiagonal({ largo: 6, ancho: 6, alto: 6 }), 'angulo'],
    ['tres', motor.tresPerpendiculares({ h: 6, m: 6, largo: 6 }), 'distancia'],
    ['diedro', motor.diedro([0, 0, 0], [6, 0, 0], [6, 6, 0], [6, 6, 6]), 'diedro'],
    ['cruzadas', motor.distanciaCruzadas({ a: 6, r1: 'AG', r2: 'BF' }), 'distancia'],
    ['sombra', motor.proyeccion({ largo: 10, h2: 6 }), 'proyeccion'],
    ['AE-BD', motor.anguloRectasCubo({ a: 6, r1: 'AE', r2: 'BD', vista: V0 }), 'angulo'],
    ['FAH', motor.anguloEnVertice({ a: 6, v: 'A', p: 'F', q: 'H', vista: V0 }), 'angulo'],
    ['EBC', motor.anguloEnVertice({ a: 6, v: 'B', p: 'E', q: 'C', vista: { az: -40, el: 15 } }), 'angulo'],
    ['B-AG', motor.distanciaVerticeRecta({ a: 6, v: 'B', r: 'AG' }), 'distancia'],
    ['triedro', motor.triedro({ caras: [100, 120, 150] }), 'razon'],
  ];
  for (const [que, r, k] of grupos) {
    const valores = [r.respuestas[k], ...Object.values(r.errores[k])].map(v => (typeof v === 'number' ? v.toFixed(1) : String(v)));
    const unicos = new Set(valores);
    // la de la varilla tiene 3 opciones; la del triedro, 4 frases (dos dicen «sí existe» con razones distintas)
    assert.ok(unicos.size >= (que === 'varilla' || que === 'triedro' ? 3 : 4), `${que}: faltan opciones distintas (${valores})`);
    assert.equal(valores.filter(v => v === valores[0]).length, 1, `${que}: la correcta no se repite`);
  }
});

// 4. Errores de entrada
test('entradas inválidas', () => {
  assert.throws(() => motor.cubo(0), /mayor que cero/);
  assert.throws(() => motor.puntoCubo(4, 'K'), /vértice desconocido/);
  assert.throws(() => motor.rectasCubo(4, 'AA', 'BC'), /dos letras distintas/);
  assert.throws(() => motor.rectasCubo(4, 'ABC', 'BC'), /dos letras distintas/);
  assert.throws(() => motor.varilla({ incl: 95 }), /0° a 90°/);
  assert.throws(() => motor.varilla({ incl: 0 }), /mayor que cero/);
  assert.throws(() => motor.varilla({ incl: 'mucho' }), /número/);
  assert.throws(() => motor.anguloConRecta({ incl: 30, dir: 0 }), /azimut/);
  assert.throws(() => motor.anguloDiagonal({ largo: 2, ancho: 2 }), /alto/);
  assert.throws(() => motor.tresPerpendiculares({ h: 0, m: 2 }), /mayor que cero/);
  assert.throws(() => motor.proyeccion({ largo: 5, h1: 0, h2: 7 }), /no puede pasar del largo/);
  assert.throws(() => motor.proyeccion({ largo: 5, h1: -1, h2: 2 }), /no puede ser negativo/);
  assert.throws(() => motor.posicionRectas([0, 0, 0], [0, 0, 0], [1, 0, 0], [0, 1, 0]), /dirección distinta de cero/);
  assert.throws(() => motor.posicionRectas([0, 0], [1, 0, 0], [1, 0, 0], [0, 1, 0]), /punto/);
  assert.throws(() => motor.diedro([0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 1, 0]), /en la arista/);
  assert.throws(() => motor.anguloEnVertice({ a: 6, v: 'A', p: 'A', q: 'B' }), /tres vértices distintos/);
  assert.throws(() => motor.distanciaVerticeRecta({ a: 6, v: 'A', r: 'AG' }), /no puede estar en la recta/);
  assert.throws(() => motor.triedro({ caras: [90, 90] }), /tres caras/);
  assert.throws(() => motor.triedro({ caras: [90, 0, 90] }), /mayor que cero/);
  assert.throws(() => motor.desarrolloTriedro({ caras: [90, 90, 90], f: 2 }), /de 0 a 1/);
  assert.throws(() => motor.puerta({ a: 6, abre: 200 }), /0° a 180°/);
  assert.equal(motor.radical(Math.PI), null);
  assert.deepEqual(motor.radical(Math.sqrt(72)), [6, 2]);
  assert.deepEqual(motor.radical(Math.sqrt(27) / 1), [3, 3]);
  assert.deepEqual(motor.radical(9), [9, 1]);
  // cara de 180° o más: no hay triedro, y lo dice el primer criterio
  assert.equal(motor.triedro({ caras: [180, 90, 100] }).respuestas.razon, 'cadaCara');
});

// 5. papel.json
const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
test('papel.json: formato', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 8 && papel.problemas.length <= 10, `hay ${papel.problemas.length} problemas`);
  for (const p of papel.problemas) assert.ok(p.id && p.enunciado && p.respuesta && p.pasos.length && p.verificar.length, p.id);
  assert.equal(new Set(papel.problemas.map(p => p.id)).size, papel.problemas.length, 'ids distintos');
});
for (const p of papel.problemas) test(`papel ${p.id}: ${p.enunciado.slice(0, 60)}`, () => {
  for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id);
});
