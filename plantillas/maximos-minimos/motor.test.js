// Pruebas del motor de «El cordel que encierra». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con números al azar (semilla fija):
//    - el máximo (o mínimo) que da el motor no lo supera una barrida fina: corrales, pared, producto, suma, río, precio;
//    - en el máximo, los sumandos valen lo mismo (a·x = b·y); el corral contra la pared es la mitad de un cuadrado;
//    - el reflejo da lo mismo que la barrida, y AP + PB nunca baja de AB' (desigualdad triangular); ángulos iguales;
//    - el ingreso es simétrico alrededor del mejor precio, que está a la mitad entre los dos ceros;
//    - mapas: la pintura de ejemplo es válida y otra búsqueda (con vuelta atrás) confirma que con un color menos no se puede;
//    - NINGÚN ERROR TÍPICO COINCIDE CON LA RESPUESTA (los que coinciden van en 'coinciden' y sí dan lo mismo).
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
  if (esperado && typeof esperado === 'object') {
    assert.ok(real && typeof real === 'object', `${que}: no es objeto`);
    assert.deepEqual(Object.keys(real).sort(), Object.keys(esperado).sort(), `${que}: claves`);
    for (const [k, v] of Object.entries(esperado)) cerca(real[k], v, `${que}.${k}`, t);
    return;
  }
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(typeof real === 'number' && Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
function llamar(fn, args) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  return motor[fn](...args);
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
  assert.equal(datos.plantilla, 'maximos-minimos');
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
const N = 300, PASOS = 4000;
const casi = (a, b) => {
  if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
  if (a && b && typeof a === 'object') return casi(a.area !== undefined ? a.area : a.producto, b.area !== undefined ? b.area : b.producto) && (a.x === undefined || casi(a.x, b.x));
  return a === b;
};
function sinChoques(R, correcto, que) {
  assert.ok(R.errores && typeof R.errores === 'object', `${que}: falta errores`);
  assert.ok(Array.isArray(R.coinciden), `${que}: falta coinciden`);
  for (const [k, v] of Object.entries(R.errores)) assert.ok(!casi(v, correcto), `${que}: el error ${k} da la respuesta (${JSON.stringify(v)})`);
  const vs = Object.values(R.errores);
  for (let i = 0; i < vs.length; i++) for (let j = i + 1; j < vs.length; j++) assert.ok(!casi(vs[i], vs[j]), `${que}: dos errores dan lo mismo`);
}
// el mayor valor de f en (a, b), barriendo
function barrida(f, a, b) { let m = -Infinity; for (let k = 1; k < PASOS; k++) m = Math.max(m, f(a + (b - a) * k / PASOS)); return m; }

test('corral: ningún rectángulo del mismo perímetro supera al cuadrado; compararRectangulos elige el de mayor área', () => {
  for (let k = 0; k < N; k++) {
    const P = ent(4, 200);
    const M = motor.productoMaximo({ a: 2, b: 2, total: P });
    cerca(M.x, P / 4, 'lado del cuadrado'); cerca(M.producto, P * P / 16, 'área');
    const B = barrida(x => motor.rectangulo({ perimetro: P, ancho: x }).area, 0, P / 2);
    assert.ok(B <= M.producto + 1e-9, `barrida ${B} > ${M.producto}`);
    assert.ok(B >= M.producto * (1 - 1e-5), 'la barrida llega cerca del máximo');
    const anchos = [...new Set([ent(1, 9), ent(10, 19), ent(20, 29)].map(a => a * P / 60))];
    if (anchos.some(a => casi(a, P / 4))) continue;
    let C;
    try { C = motor.compararRectangulos({ tipo: 'perimetro', valor: P, anchos }); } catch (e) { assert.match(e.message, /empatados/); continue; }
    const mejor = C.rectangulos.reduce((m, r) => (r.area > m.area ? r : m));
    assert.equal(C.mejor, mejor.ancho);
    for (const r of C.rectangulos) { cerca(r.ancho + r.largo, P / 2, 'semiperímetro'); cerca(r.perimetro, P, 'perímetro'); }
    sinChoques(C, C.mejor, `corral ${P}`);
  }
});
test('producto máximo con a·x + b·y fijo: la barrida no lo supera y en el máximo a·x = b·y', () => {
  for (let k = 0; k < N; k++) {
    const a = ent(1, 6), b = ent(1, 6), t = ent(1, 300);
    const M = motor.productoMaximo({ a, b, total: t });
    cerca(a * M.x, b * M.y, 'sumandos iguales'); cerca(a * M.x + b * M.y, t, 'la restricción');
    const B = barrida(x => x * (t - a * x) / b, 0, t / a);
    assert.ok(B <= M.producto + 1e-9);
    sinChoques(M, { producto: M.producto }, 'producto máximo');
    if (a === b) assert.deepEqual(M.coinciden, ['factoresIguales']);
    else assert.ok(M.errores.factoresIguales.producto < M.producto);
  }
});
test('suma mínima con producto fijo: la barrida no baja de 2√P', () => {
  for (let k = 0; k < N; k++) {
    const P = ent(1, 400) / ent(1, 4), S = motor.sumaMinima({ producto: P });
    cerca(S.x * S.y, P, 'producto');
    const B = -barrida(x => -(x + P / x), Math.sqrt(P) / 50, Math.sqrt(P) * 50);
    assert.ok(B >= S.suma - 1e-9);
    cerca(motor.rectanguloArea({ area: P, ancho: S.x }).perimetro, 2 * S.suma, 'el cuadrado de área P');
    sinChoques(S, S.suma, 'suma mínima');
  }
});
test('contra la pared: la barrida no supera el máximo; el paralelo es la mitad de la malla; reflejo = cuadrado', () => {
  for (let k = 0; k < N; k++) {
    const L = ent(6, 300), n = ent(2, 4), M = motor.paredMaxima({ malla: L, tramos: n });
    cerca(M.paralelo, L / 2, 'paralelo'); cerca(n * M.x, M.paralelo, 'tramos = paralelo');
    const B = barrida(x => motor.pared({ malla: L, x, tramos: n }).area, 0, L / n);
    assert.ok(B <= M.area + 1e-9);
    for (const [nom, e] of Object.entries(M.errores)) {
      assert.ok(e.area < M.area, `${nom} encierra menos`);
      assert.ok(n * e.x + e.paralelo <= L + 1e-9, `${nom} cabe en la malla`);
    }
    sinChoques(M, { x: M.x, area: M.area }, 'pared');
    if (n === 2) {
      cerca(M.reflejo.alto, M.reflejo.largo, 'el corral y su reflejo forman un cuadrado');
      cerca(M.reflejo.area, motor.productoMaximo({ a: 2, b: 2, total: 2 * L }).producto, 'área del cuadrado de perímetro 2L');
    }
  }
});
test('río: el reflejo da lo mismo que la barrida; AP + PB ≥ AB\'; ángulos iguales con la orilla', () => {
  for (let k = 0; k < N; k++) {
    const a = ent(1, 20), b = ent(1, 20), d = ent(0, 30);
    const M = motor.recorridoMinimo({ a, b, d });
    const B = -barrida(p => -motor.recorrido({ a, b, d, p }).total, -d - 5, 2 * d + 5);
    assert.ok(B >= M.minimo - 1e-9, 'nadie baja del mínimo');
    assert.ok(B <= M.minimo + 1e-3 * (d + 5), 'la barrida llega al mínimo');
    cerca(motor.recorrido({ a, b, d, p: M.p }).total, M.minimo, 'en p* se alcanza');
    if (d > 0) cerca(a / M.p, b / (d - M.p), 'mismo ángulo a los dos lados');
    for (let j = 0; j < 5; j++) { const p = (rnd() - 0.3) * 2 * d; const R = motor.recorrido({ a, b, d, p }); assert.ok(R.total >= R.ABprima - 1e-9); assert.ok(R.total >= R.directo - 1e-9); }
    sinChoques(M, M.minimo, `río ${a} ${b} ${d}`);
    for (const k2 of Object.keys(M.errores)) assert.ok(k2 in M.exactos);
    const b2 = ent(1, 20);
    if (d > 0) {
      const V = motor.moverPunto({ a, b, d, b2 });
      assert.equal(V.sentido, b2 > b ? 'A' : b2 < b ? 'B' : 'quieto');
      sinChoques(V, V.sentido, 'mover');
    }
  }
});
test('precio: la barrida no supera el ingreso máximo, que está a la mitad entre los ceros y es simétrico', () => {
  for (let k = 0; k < N; k++) {
    const p0 = ent(1, 50), q0 = ent(5, 500), dp = ent(1, 5) / ent(1, 2), dq = ent(1, 30);
    const M = motor.ingresoMaximo({ p0, q0, dp, dq });
    cerca(M.u, (M.ceros.precio + M.ceros.cantidad) / 2, 'a la mitad de los ceros');
    const R = u => motor.ingreso({ p0, q0, dp, dq, u }).ingreso;
    const B = barrida(R, M.ceros.precio, M.ceros.cantidad);
    assert.ok(B <= M.ingreso + 1e-6 * Math.max(1, M.ingreso));
    const h = rnd() * 5; cerca(R(M.u + h), R(M.u - h), 'simetría');
    assert.ok(M.precio > 0 && M.cantidad > 0);
    sinChoques(M, M.precio, 'precio');
    for (const [nom, pr] of Object.entries(M.errores)) assert.ok(M.erroresIngreso[nom] <= M.ingreso + 1e-9, `${nom} no gana más`);
  }
});
// otra búsqueda: ¿se puede pintar con k colores? (vuelta atrás, independiente de la del motor)
function sePuede(n, vecinos, k) {
  const ady = Array.from({ length: n }, () => []);
  for (const [i, j] of vecinos) { ady[i].push(j); ady[j].push(i); }
  const col = new Array(n).fill(-1);
  const ir = i => { if (i === n) return true; for (let c = 0; c < k; c++) { if (ady[i].some(j => col[j] === c)) continue; col[i] = c; if (ir(i + 1)) return true; col[i] = -1; } return false; };
  return ir(0);
}
test('mapas: la pintura de ejemplo es válida y con un color menos no se puede (otra búsqueda)', () => {
  for (let n = 3; n <= 9; n++) {
    const G = motor.rueda(n), C = motor.minimoColores(G);
    assert.equal(C.colores, n % 2 ? 4 : 3, `rueda de ${n}`);
  }
  for (let k = 0; k < 80; k++) {
    const n = ent(2, 8), vecinos = [];
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (rnd() < 0.45) vecinos.push([i, j]);
    const C = motor.minimoColores({ regiones: n, vecinos });
    assert.ok(motor.revisarPintura({ regiones: n, vecinos, colores: C.ejemplo }).valida, 'el ejemplo es válido');
    assert.ok(sePuede(n, vecinos, C.colores));
    if (C.colores > 1) assert.ok(!sePuede(n, vecinos, C.colores - 1), 'con un color menos no se puede');
    cerca(C.probadas, Math.pow(C.colores - 1, n), 'probadas');
    sinChoques(C, C.colores, 'mapa');
  }
  const T = motor.tablero({ filas: 3, columnas: 4, esquinas: true });
  assert.equal(motor.minimoColores(T).colores, 4);
});
test('cordel multiplicado: el área crece con el cuadrado del factor', () => {
  for (let k = 0; k < N; k++) {
    const P = ent(1, 100), f = ent(2, 5), E = motor.escalarCorral({ perimetro: P, factor: f });
    cerca(E.areaNueva, E.area * f * f, 'cuadrado del factor');
    sinChoques(E, E.areaNueva, 'escalar');
  }
});
test('las opciones de las predicciones de la escena son distintas entre sí y de la correcta', () => {
  const distintas = (xs, que) => assert.equal(new Set(xs.map(x => JSON.stringify(x))).size, xs.length, `${que}: ${JSON.stringify(xs)}`);
  const C1 = motor.compararRectangulos({ tipo: 'perimetro', valor: 24, anchos: [11, 6, 8] }); distintas([C1.mejor, C1.errores.masAlargado, C1.errores.intermedio, C1.errores.todosIguales], 'paso 1');
  const P3 = motor.paredMaxima({ malla: 40 }); distintas([P3, P3.errores.cuadrado, P3.errores.comoCorralLibre, P3.errores.alReves].map(r => [r.x, r.paralelo]), 'paso 3');
  const R5 = motor.recorridoMinimo({ a: 3, b: 5, d: 6 }); distintas([R5.minimo, R5.errores.sumaPerpendiculares, R5.errores.perpendicularA, R5.errores.porLaOrilla], 'paso 5');
  const I7 = motor.ingresoMaximo({ p0: 10, q0: 66, dp: 1, dq: 3 }); distintas([I7.precio, I7.errores.noCambiar, I7.errores.hastaLaMitad, I7.errores.igualarFactores], 'paso 7');
  const M8 = motor.minimoColores(motor.rueda(5)); distintas([M8.colores, M8.errores.alternarDos, M8.errores.tresBastan, M8.errores.unoPorRegion], 'paso 8');
  // el menú del paso 7: todo entero
  for (const v of [I7.u, I7.precio, I7.cantidad, I7.ingreso, ...Object.values(I7.errores), ...Object.values(I7.erroresIngreso)]) assert.ok(Number.isInteger(v), `paso 7 entero: ${v}`);
  const E1 = motor.escalarCorral({ perimetro: 24, factor: 2 }); distintas([E1.areaNueva, E1.errores.lineal, E1.errores.aditiva], 'experimento 1');
  const E2 = motor.compararRectangulos({ tipo: 'area', valor: 36, anchos: [18, 9, 6] }); distintas([E2.mejor, E2.errores.masAlargado, E2.errores.intermedio, E2.errores.todosIguales], 'experimento 2');
  const E3 = motor.moverPunto({ a: 3, b: 5, d: 6, b2: 9 }); distintas([E3.sentido, E3.errores.quieto, E3.errores.contrario, E3.errores.puntoMedio], 'experimento 3');
  const E4 = motor.ingresoMaximo({ p0: 40, q0: 30, dp: 2, dq: 3 }); distintas([E4.precio, E4.errores.noCambiar, E4.errores.igualarFactores, E4.errores.hastaLaMitad], 'experimento 4');
  const E5 = motor.minimoColores(motor.rueda(6)); distintas([E5.colores, E5.errores.alternarDos, E5.errores.siempreCuatro, E5.errores.unoPorRegion], 'experimento 5');
  // en el paso 3 el «corral libre» de 10 × 10 tiene el mismo fondo que la respuesta: la opción se distingue por el paralelo
  assert.equal(P3.errores.comoCorralLibre.x, P3.x); assert.notEqual(P3.errores.comoCorralLibre.paralelo, P3.paralelo);
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.rectangulo({ perimetro: 24, ancho: 12 }), /mitad del perímetro/);
  assert.throws(() => motor.rectangulo({ perimetro: 24, ancho: 0 }), /mayor que cero/);
  assert.throws(() => motor.rectangulo({ perimetro: '24', ancho: 3 }), /número/);
  assert.throws(() => motor.rectangulo(), /objeto/);
  assert.throws(() => motor.productoMaximo({ a: 0, b: 1, total: 4 }), /mayor que cero/);
  assert.throws(() => motor.compararRectangulos({ tipo: 'volumen', valor: 3, anchos: [1, 2] }), /tipo/);
  assert.throws(() => motor.compararRectangulos({ tipo: 'perimetro', valor: 24, anchos: [6] }), /2 a 6/);
  assert.throws(() => motor.compararRectangulos({ tipo: 'perimetro', valor: 24, anchos: [4, 4] }), /distintos/);
  assert.throws(() => motor.compararRectangulos({ tipo: 'perimetro', valor: 24, anchos: [4, 8] }), /empatados/);
  assert.throws(() => motor.pared({ malla: 40, x: 20 }), /menor que la malla/);
  assert.throws(() => motor.pared({ malla: 40, x: 5, tramos: 1 }), /al menos 2/);
  assert.throws(() => motor.recorrido({ a: 0, b: 5, d: 6, p: 1 }), /mayor que cero/);
  assert.throws(() => motor.recorrido({ a: 3, b: 5, d: -1, p: 1 }), /negativo/);
  assert.throws(() => motor.moverPunto({ a: 3, b: 5, d: 0, b2: 4 }), /d debe ser mayor/);
  assert.throws(() => motor.ingreso({ p0: 10, q0: 60, dp: 1, dq: 3 }), /número/);
  assert.throws(() => motor.ingresoMaximo({ p0: -1, q0: 60, dp: 1, dq: 3 }), /mayor que cero/);
  assert.throws(() => motor.rueda(2), /al menos 3/);
  assert.throws(() => motor.tablero({ filas: 4, columnas: 4 }), /12 casillas/);
  assert.throws(() => motor.minimoColores({ regiones: 3, vecinos: [[0, 3]] }), /inválido/);
  assert.throws(() => motor.minimoColores({ regiones: 3, vecinos: [[1, 1]] }), /sí misma/);
  assert.throws(() => motor.minimoColores({ regiones: 13, vecinos: [] }), /como mucho 12/);
  assert.throws(() => motor.revisarPintura({ regiones: 2, vecinos: [[0, 1]], colores: [0] }), /un valor por región/);
  assert.equal(motor.radical(2.5), null);
  assert.equal(motor.fraccion(Math.SQRT2), null);
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
