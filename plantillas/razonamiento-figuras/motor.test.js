// Pruebas del motor de «El reflector de figuras». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades: la fuerza bruta y las fórmulas de academia coinciden (segmentos C(n, 2), abanico k·n(n + 1)/2,
//    trapecios C(k, 2)·n(n + 1)/2, cuadrados Σ(m − k + 1)(n − k + 1), rectángulos C(m + 1, 2)·C(n + 1, 2)); las piezas
//    cumplen Euler (caras = aristas − puntos + 1 en una figura conexa); el tamaño de cada figura es su área entre el
//    área de una pieza cuando todas las piezas miden lo mismo; girar, agrandar o correr la figura no cambia la cuenta;
//    en las pilas, total = suma de alturas, ocultos + visibles = total y la vista nunca tapa una cara expuesta.
// 3. Ningún error típico coincide con la respuesta en las predicciones de la escena, con muchos parámetros, y las
//    cuatro opciones de cada predicción son distintas.
// 4. Errores de entrada.
// 5. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
function cerca(real, esperado, que, tol) {
  const t = tol === undefined ? 1e-9 : tol;
  if (Array.isArray(esperado)) { assert.ok(Array.isArray(real), `${que}: se esperaba una lista`); assert.equal(real.length, esperado.length, `${que}: largo`); esperado.forEach((e, k) => cerca(real[k], e, `${que}[${k}]`, t)); return; }
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(typeof real === 'number' && Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
// { fig: [nombre, …] } en los argumentos se arma con el constructor del motor (convención de casos.json)
function resolver(a) {
  if (a && typeof a === 'object' && Array.isArray(a.fig)) { const [n, ...r] = a.fig; assert.equal(typeof motor[n], 'function', `no hay figura ${n}`); return motor[n](...r); }
  return a;
}
function llamar(fn, args) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  return motor[fn](...args.map(resolver));
}
const campo = (r, k) => k.split('.').reduce((o, p) => (o == null ? o : o[p]), r);
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
  assert.equal(datos.plantilla, 'razonamiento-figuras');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 25);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
const rnd = motor.azar(2026);
const ent = (a, b) => a + Math.floor(rnd() * (b - a + 1));
const C2 = n => n * (n - 1) / 2;

test('fuerza bruta = fórmula: segmentos, abanicos, cuadrados y rectángulos', () => {
  for (let n = 2; n <= 12; n++) assert.equal(motor.contar(motor.recta(n), 'segmentos').total, C2(n));
  for (let n = 1; n <= 7; n++) for (let k = 1; k <= 3; k++) {
    const t = motor.triangulosAbanico(n, k); assert.equal(t.bruta, t.total, `abanico ${n}, ${k}`); assert.equal(t.total, k * n * (n + 1) / 2);
    if (k >= 2) { const q = motor.cuadrilaterosAbanico(n, k); assert.equal(q.bruta, q.total, `trapecios ${n}, ${k}`); }
  }
  for (let m = 1; m <= 5; m++) for (let n = 1; n <= 5; n++) {
    const c = motor.cuadradosCuadricula(m, n), r = motor.rectangulosCuadricula(m, n);
    assert.equal(c.bruta, c.total, `cuadrados ${m} × ${n}`); assert.equal(r.bruta, r.total, `rectángulos ${m} × ${n}`);
    assert.equal(r.total, C2(m + 1) * C2(n + 1));
    if (m === n) assert.equal(c.total, motor.sumaCuadrados(n));
    // los cuadrados son rectángulos: aparecen en las dos listas
    const fig = motor.cuadricula(m, n), cl = motor.contar(fig, 'cuadrados'), rl = motor.contar(fig, 'rectangulos');
    const clave = f => f.pts.map(p => p.x + ',' + p.y).sort().join(' ');
    const rs = new Set(rl.lista.map(clave));
    for (const f of cl.lista) assert.ok(rs.has(clave(f)));
    // segmentos de la cuadrícula: (m + 1) horizontales con n + 1 puntos y (n + 1) verticales con m + 1 puntos
    assert.equal(motor.contar(fig, 'segmentos').total, (m + 1) * C2(n + 1) + (n + 1) * C2(m + 1));
  }
});
test('piezas: Euler (caras = aristas − puntos + 1) y el tamaño es el área entre la de una pieza en la cuadrícula', () => {
  const figs = [motor.abanico(4), motor.abanico(3, 2), motor.cuadricula(3, 4), motor.cuadradoDiagonales(2), motor.dosCevianas(), motor.tresMedianas(), motor.cuadradoCompleto(2)];
  for (const f of figs) {
    const G = motor.armar(f);
    assert.equal(G.caras.length, G.aristas.length - G.puntos.length + 1, f.nombre);
    let s = 0; for (const c of G.caras) s += motor.area(c.map(i => G.puntos[i]));
    const borde = motor.contar(f, 'triangulos');
    assert.ok(s > 0 && borde.caras === G.caras.length);
  }
  for (let k = 0; k < 20; k++) {
    const m = ent(1, 4), n = ent(1, 4), r = motor.contar(motor.cuadricula(m, n), 'rectangulos');
    for (const f of r.lista) cerca(f.tamano, Math.abs(motor.area(f.pts)), 'tamaño = área');
  }
});
test('la cuenta no cambia al girar, agrandar o correr la figura', () => {
  const figs = [motor.abanico(4, 2), motor.cuadradoCompleto(2), motor.dosCevianas(), motor.tresMedianas(), motor.cuadricula(2, 3)];
  const tipos = ['segmentos', 'triangulos', 'cuadrilateros', 'cuadrados', 'rectangulos'];
  for (const f of figs) {
    const base = tipos.map(t => motor.contar(f, t).total);
    for (let k = 0; k < 4; k++) {
      const a = rnd() * Math.PI * 2, e = 0.5 + rnd() * 3, dx = ent(-5, 5), dy = ent(-5, 5);
      const T = P => ({ x: e * (P.x * Math.cos(a) - P.y * Math.sin(a)) + dx, y: e * (P.x * Math.sin(a) + P.y * Math.cos(a)) + dy });
      const g = { lineas: f.lineas.map(([P, Q]) => [T(P), T(Q)]), puntos: (f.puntos || []).map(T) };
      assert.deepEqual(tipos.map(t => motor.contar(g, t).total), base, f.nombre);
    }
  }
});
test('cada figura de la lista tiene sus lados dibujados y el tamaño cuenta las piezas de adentro', () => {
  const f = motor.abanico(5, 2), G = motor.armar(f);
  for (const t of ['triangulos', 'cuadrilateros']) {
    const r = motor.contar(f, t);
    const piezas = G.caras.length;
    for (const x of r.lista) {
      for (let i = 0; i < x.vertices.length; i++) assert.ok(G.conecta(x.vertices[i], x.vertices[(i + 1) % x.vertices.length]));
      assert.ok(x.tamano >= 1 && x.tamano <= piezas);
      assert.ok(motor.area(x.pts) > 0, 'en sentido antihorario');
    }
    // orden del reflector: por tamaño
    for (let i = 1; i < r.lista.length; i++) assert.ok(r.lista[i].tamano >= r.lista[i - 1].tamano);
  }
});
test('pilas: total = suma de alturas, ocultos + visibles = total, y nada tapa una cara expuesta', () => {
  for (let k = 0; k < 60; k++) {
    // alturas que no crecen hacia adelante ni a la derecha
    const filas = ent(1, 4), cols = ent(1, 4), alt = [];
    for (let i = 0; i < filas; i++) { alt.push([]); for (let j = 0; j < cols; j++) { const tope = Math.min(i ? alt[i - 1][j] : 5, j ? alt[i][j - 1] : 5); alt[i].push(ent(0, tope)); } }
    const p = motor.pila(alt), suma = alt.flat().reduce((s, v) => s + v, 0);
    assert.equal(p.total, suma); assert.equal(p.visibles + p.ocultos, p.total);
    const lleno = new Set(p.cubos.map(c => c.x + ',' + c.y + ',' + c.z));
    for (const c of p.cubos) for (const cara of c.caras) {
      // desde el centro de la cara, hacia el observador (1, 1, 1): no hay cubos
      const o = { '+x': [1, 0.5, 0.5], '+y': [0.5, 1, 0.5], '+z': [0.5, 0.5, 1] }[cara];
      for (let t = 0.01; t < 12; t += 0.05) {
        const q = [c.x + o[0] + t, c.y + o[1] + t, c.z + o[2] + t].map(Math.floor);
        assert.ok(!lleno.has(q.join(',')), `cara ${cara} del cubo ${c.x},${c.y},${c.z} tapada`);
      }
    }
    assert.ok(p.caja >= p.total);
  }
  for (let n = 1; n <= 7; n++) { const q = motor.piramideEsquina(n); assert.equal(q.total, motor.sumaCuadrados(n)); assert.equal(q.visibles, n * n); assert.equal(q.caras, n * n + n * (n + 1)); }
});

// 3. Ningún error típico coincide con la respuesta (predicciones de la escena) y las opciones son distintas
function distintas(ops, que) { assert.equal(new Set(ops).size, ops.length, `${que}: opciones repetidas ${ops}`); }
test('ningún error típico coincide con la respuesta', () => {
  // paso 1 (recta de 6) y cualquier n ≥ 3
  for (let n = 4; n <= 20; n++) { const r = motor.segmentosRecta(n); distintas([r.total, r.errores.soloPiezas, r.errores.piezasYTotal, r.errores.conOrden], `recta ${n}`); }
  // paso 2 (abanico de 4) y cualquier abanico de 3 o más piezas
  for (let n = 3; n <= 12; n++) { const r = motor.triangulosAbanico(n); distintas([r.total, r.errores.soloPiezas, r.errores.piezasYTotal, r.errores.dobleCuenta], `abanico ${n}`); }
  // experimentos 1 y 2: abanico con cuerdas
  for (let n = 3; n <= 8; n++) for (let k = 2; k <= 4; k++) {
    const t = motor.triangulosAbanico(n, k); distintas([t.total, t.errores.soloPiezas, t.errores.unNivel, t.errores.unNivelYPiezas], `abanico ${n}, ${k}`);
    // con 3 líneas horizontales, C(3, 2) = 3 y el error «como los triángulos» coincide: la escena usa solo una cuerda
    if (k === 2) { const q = motor.cuadrilaterosAbanico(n, k); distintas([q.total, q.errores.soloPiezas, q.errores.piezasYTotal, q.errores.comoTriangulos], `trapecios ${n}, ${k}`); }
  }
  // paso 4: cuadrado con diagonales
  const d = motor.triangulosCuadradoDiagonales(); distintas([d.total, d.errores.soloPiezas, d.errores.unaDiagonal, d.errores.compuestasDosVeces], 'diagonales');
  // paso 5: cuadrados de n × n (n ≥ 3) y experimento 3: m × n con m < n (m ≥ 2)
  for (let n = 3; n <= 10; n++) { const c = motor.cuadradosCuadricula(n, n); distintas([c.total, c.errores.soloPiezas, c.errores.piezasYGrande, c.errores.soloDiagonal], `cuadrados ${n}`); }
  for (let m = 2; m <= 6; m++) for (let n = m + 1; n <= 8; n++) { const c = motor.cuadradosCuadricula(m, n); distintas([c.total, c.errores.soloPiezas, c.errores.comoCuadrada, c.errores.ladoLargo], `cuadrados ${m} × ${n}`); }
  // paso 6: rectángulos de m × n (al menos 2 filas y 2 columnas; en 2 × 2 «sin los cuadrados» da 4, como las piezas)
  for (let m = 2; m <= 6; m++) for (let n = 2; n <= 6; n++) if (m * n > 4) { const r = motor.rectangulosCuadricula(m, n); distintas([r.total, r.errores.soloPiezas, r.errores.sinCuadrados, r.errores.suma], `rectángulos ${m} × ${n}`); }
  // experimento 5
  const e = motor.triangulosDosCevianas(); distintas([e.total, e.errores.soloPiezas, e.errores.piezasYTotal, e.errores.dobleCuenta], 'cevianas');
  // paso 7 y experimento 4: pilas
  // (con 5 capas, las caras que se ven, 25 + 30 = 55, coinciden con el total: la escena usa 3)
  for (const n of [2, 3, 4, 6, 7]) { const p = motor.piramideEsquina(n); distintas([p.total, p.errores.soloVisibles, p.errores.carasVisibles, p.errores.caja], `pirámide ${n}`); }
  const es = motor.escaleraCubos([4, 3, 2, 1], 2); distintas([es.total, es.errores.soloVisibles, es.errores.carasVisibles, es.errores.caja], 'escalera');
});

// 4. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.armar({}), /lineas/);
  assert.throws(() => motor.armar({ lineas: [[{ x: 0, y: 0 }, { x: 0, y: 0 }]] }), /coinciden/);
  assert.throws(() => motor.armar({ lineas: [[{ x: 0, y: '1' }, { x: 2, y: 0 }]] }), /número/);
  assert.throws(() => motor.armar({ lineas: [[{ x: 0, y: 0 }, { x: 2, y: 0 }]], puntos: [{ x: 1, y: 1 }] }), /no está sobre/);
  assert.throws(() => motor.contar(motor.cuadrado(), 'pentagonos'), /desconocido/);
  assert.throws(() => motor.recta(1), /entero de 2 o más/);
  assert.throws(() => motor.abanico(0), /entero de 1 o más/);
  assert.throws(() => motor.cuadricula(2, 1.5), /entero/);
  assert.throws(() => motor.cuadrilaterosAbanico(3, 1), /entero de 2 o más/);
  assert.throws(() => motor.pila([[1, 2]]), /no deben crecer/);
  assert.throws(() => motor.pila([[2], [3]]), /no deben crecer/);
  assert.throws(() => motor.pila([[-1]]), /entero de 0 o más/);
  assert.throws(() => motor.pila('3'), /lista de filas/);
  assert.throws(() => motor.escaleraCubos([3, 2], 0), /fondo/);
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
    assert.ok(!/\d\.\d/.test(p.enunciado + p.respuesta + p.pasos.join('')), `${p.id}: se escribe con coma decimal`);
  }
});
for (const p of (papel && papel.problemas) || []) test(`papel ${p.id}: la respuesta coincide con el motor`, () => {
  for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id);
});
