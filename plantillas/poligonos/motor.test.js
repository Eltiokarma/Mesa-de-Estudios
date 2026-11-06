// Pruebas del motor de «El polígono que se abre». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con números al azar (semilla fija): la suma de interiores por triangulación y por ángulos medidos;
//    los exteriores suman 360°; las diagonales contadas una a una; n de ida y vuelta; el área del regular por
//    triángulos centrales y por determinante; la clasificación no cambia al girar ni al trasladar; las relaciones de
//    inclusión (todo cuadrado es rombo y rectángulo, todo rombo y rectángulo es paralelogramo); la mediana del
//    trapecio medida con coordenadas; y NINGÚN error típico da la respuesta correcta (no puede ser una opción incorrecta).
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
  if (esperado && typeof esperado === 'object') { for (const [k, v] of Object.entries(esperado)) cerca(real && real[k], v, `${que}.${k}`, t); return; }
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(typeof real === 'number' && Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
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
  return r;
}

// 1. casos.json
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'poligonos');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 22);
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
const ent = (a, b) => Math.floor(al(a, b + 1));
const N = 300;
const iguales = (a, b) => (Array.isArray(a) || Array.isArray(b))
  ? (Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, k) => iguales(v, b[k])))
  : (a === b || (Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b))));
// La regla extra: ningún error típico coincide con la respuesta correcta.
function sinErrorCorrecto(errores, correcto, que) {
  assert.ok(errores && typeof errores === 'object', `${que}: falta errores`);
  for (const [k, v] of Object.entries(errores)) assert.ok(!iguales(v, correcto), `${que}: el error ${k} da la respuesta correcta (${JSON.stringify(v)})`);
}
const angulo = (V, P, Q) => {
  const u = { x: P.x - V.x, y: P.y - V.y }, w = { x: Q.x - V.x, y: Q.y - V.y };
  return Math.acos(Math.max(-1, Math.min(1, (u.x * w.x + u.y * w.y) / Math.hypot(u.x, u.y) / Math.hypot(w.x, w.y)))) * 180 / Math.PI;
};
const areaTri = (P, Q, R) => Math.abs((Q.x - P.x) * (R.y - P.y) - (R.x - P.x) * (Q.y - P.y)) / 2;

test('polígono de n lados: la suma sale de los triángulos desde un vértice; diagonales contadas una a una; ningún error acierta', () => {
  for (let n = 3; n <= 60; n++) {
    const P = motor.poligono(n);
    const tri = motor.triangulacion(n);
    assert.equal(tri.length, n - 2);
    // cada triángulo usa vértices del polígono y juntos cubren cada ángulo interior: 180° por triángulo
    cerca(P.sumaInteriores, 180 * tri.length, `n = ${n}: suma por triángulos`);
    // diagonales: todos los pares de vértices que no son vecinos
    let d = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (j - i !== 1 && j - i !== n - 1) d++;
    assert.equal(P.diagonales, d, `n = ${n}: diagonales`);
    assert.equal(motor.listaDiagonales(n).length, d);
    assert.equal(new Set(motor.listaDiagonales(n).map(String)).size, d, 'sin repetir');
    assert.equal(P.diagonalesDesdeVertice, motor.listaDiagonales(n).filter(([i, j]) => i === 0 || j === 0).length);
    cerca(P.regular.interior + P.regular.exterior, 180, 'interior + exterior');
    cerca(P.regular.interior * n, P.sumaInteriores, 'interior · n');
    sinErrorCorrecto(P.errores.sumaInteriores, P.sumaInteriores, `n = ${n} suma`);
    sinErrorCorrecto(P.errores.sumaExteriores, P.sumaExteriores, `n = ${n} exteriores`);
    sinErrorCorrecto(P.errores.diagonales, P.diagonales, `n = ${n} diagonales`);
    sinErrorCorrecto(P.errores.diagonalesDesdeVertice, P.diagonalesDesdeVertice, `n = ${n} desde un vértice`);
    sinErrorCorrecto(P.errores.triangulosDesdeVertice, P.triangulosDesdeVertice, `n = ${n} triángulos`);
    sinErrorCorrecto(P.errores.interiorRegular, P.regular.interior, `n = ${n} interior`);
    // el cuadrilátero: 360/n = 90 es el interior, así que "comoCentral" no puede estar
    if (n === 4) assert.ok(!('comoCentral' in P.errores.interiorRegular));
    // ida y vuelta
    assert.equal(motor.nDesdeSuma(P.sumaInteriores).n, n);
    assert.equal(motor.nDesdeAngulo({ interior: P.regular.interior }).n, n);
    assert.equal(motor.nDesdeAngulo({ exterior: P.regular.exterior }).n, n);
    assert.equal(motor.nDesdeAngulo({ central: P.regular.central }).n, n);
    assert.equal(motor.nDesdeDiagonales(P.diagonales).n, n === 3 ? 3 : n);
    sinErrorCorrecto(motor.nDesdeSuma(P.sumaInteriores).errores, n, 'nDesdeSuma');
    sinErrorCorrecto(motor.nDesdeAngulo({ interior: P.regular.interior }).errores, n, 'nDesdeAngulo');
    sinErrorCorrecto(motor.nDesdeAngulo({ exterior: P.regular.exterior }).errores, n, 'nDesdeAngulo exterior');
    sinErrorCorrecto(motor.nDesdeDiagonales(P.diagonales).errores, n, 'nDesdeDiagonales');
    for (let k = 1; k <= n; k++) {
      const D = motor.diagonalesDesdeVertices(n, k);
      if (k <= n - 1) assert.equal(D.porFormula, D.diagonales, `fórmula k·n − (k + 1)(k + 2)/2 con n = ${n}, k = ${k}`);
      sinErrorCorrecto(D.errores, D.diagonales, `desde ${k} vértices`);
    }
    assert.equal(motor.diagonalesDesdeVertices(n, n).diagonales, P.diagonales);
  }
});

test('ángulos que no dan un polígono: existe = false', () => {
  for (const i of [130, 145, 170.5, 100]) assert.equal(motor.nDesdeAngulo({ interior: i }).existe, false, `interior ${i}`);
  assert.equal(motor.nDesdeSuma(1000).existe, false);
  assert.equal(motor.nDesdeDiagonales(10).existe, false);
});

test('regular: área por triángulos centrales = por determinante; vértices a distancia R; apotema perpendicular al punto medio', () => {
  for (let k = 0; k < N; k++) {
    const n = ent(3, 24), lado = al(0.5, 20), giro = al(-180, 180), c = { x: al(-5, 5), y: al(-5, 5) };
    const R = motor.regular({ n, lado });
    const V = motor.verticesRegular(n, { radio: R.radio, centro: c, giro });
    const pol = motor.poligonoVertices(V);
    cerca(pol.area, R.area, 'área por determinante', 1e-8);
    cerca(pol.perimetro, R.perimetro, 'perímetro', 1e-8);
    assert.ok(pol.convexo);
    cerca(pol.sumaInteriores, 180 * (n - 2), 'suma medida', 1e-8);
    cerca(pol.sumaExteriores, 360, 'exteriores medidos', 1e-8);
    for (const a of pol.angulos) cerca(a, R.interior, 'cada ángulo', 1e-8);
    for (const p of V) cerca(Math.hypot(p.x - c.x, p.y - c.y), R.radio, 'radio', 1e-8);
    const M = { x: (V[0].x + V[1].x) / 2, y: (V[0].y + V[1].y) / 2 };
    cerca(Math.hypot(M.x - c.x, M.y - c.y), R.apotema, 'apotema', 1e-8);
    cerca(R.apotema ** 2 + (R.lado / 2) ** 2, R.radio ** 2, 'Pitágoras en el triángulo central', 1e-8);
    cerca(R.triangulo.area * n, R.area, 'n triángulos centrales', 1e-8);
    cerca(motor.regular({ n, radio: R.radio }).lado, lado, 'desde el radio', 1e-8);
    cerca(motor.regular({ n, apotema: R.apotema }).lado, lado, 'desde la apotema', 1e-8);
    sinErrorCorrecto(R.errores.apotema, R.apotema, `apotema n = ${n}`);
    sinErrorCorrecto(R.errores.area, R.area, `área n = ${n}`);
    sinErrorCorrecto(R.errores.radio, R.radio, `radio n = ${n}`);
  }
  assert.ok(!('mitadDelLado' in motor.regular({ n: 4, lado: 3 }).errores.apotema), 'en el cuadrado la apotema sí es la mitad del lado');
  assert.ok(!('comoLado' in motor.regular({ n: 6, lado: 3 }).errores.radio || false));
});

test('polígonos por vértices al azar: los ángulos medidos suman 180(n − 2) y los exteriores 360, convexos o no', () => {
  for (let k = 0; k < N; k++) {
    // polígono estrellado alrededor de un centro (simple, a veces no convexo)
    const n = ent(3, 12), pts = [];
    const angs = Array.from({ length: n }, () => al(0, 2 * Math.PI)).sort((a, b) => a - b);
    // huecos entre ángulos seguidos: ni muy chicos ni de más de media vuelta (así el centro queda dentro)
    const huecos = angs.map((a, j) => (j ? a - angs[j - 1] : 2 * Math.PI - angs[n - 1] + angs[0]));
    if (huecos.some(h => h < 0.05 || h > Math.PI - 0.05)) continue;
    for (const a of angs) { const r = al(1, 6); pts.push([r * Math.cos(a), r * Math.sin(a)]); }
    const P = motor.poligonoVertices(pts);
    if (!P.simple || P.llanos) continue;
    cerca(P.sumaInteriores, 180 * (n - 2), 'suma', 1e-8);
    cerca(P.sumaExteriores, 360, 'exteriores', 1e-8);
    // el área por triángulos desde el origen (que está dentro de un polígono estrellado)
    let A = 0; for (let j = 0; j < n; j++) A += areaTri({ x: 0, y: 0 }, { x: pts[j][0], y: pts[j][1] }, { x: pts[(j + 1) % n][0], y: pts[(j + 1) % n][1] });
    cerca(P.area, A, 'área', 1e-8);
    // en sentido horario da lo mismo
    const Q = motor.poligonoVertices(pts.slice().reverse());
    cerca(Q.area, P.area, 'área al revés'); cerca(Q.sumaInteriores, P.sumaInteriores, 'suma al revés', 1e-8);
    assert.equal(Q.convexo, P.convexo);
    assert.equal(P.convexo, P.entrantes.length === 0);
    sinErrorCorrecto(P.errores.sumaInteriores, P.sumaInteriores, 'suma de interiores');
    sinErrorCorrecto(P.errores.area, P.area, 'área');
  }
});

// Cuadriláteros de cada clase, generados al azar y luego girados y trasladados
function generar(tipo) {
  const a = ent(1, 7), b = ent(1, 7), h = ent(1, 6), s = ent(-4, 4) || 1;
  switch (tipo) {
    case 'cuadrado': return [[0, 0], [a, 0], [a, a], [0, a]];
    case 'rectángulo': return [[0, 0], [a, 0], [a, a + b], [0, a + b]];
    case 'rombo': { const P = [[3, 4], [5, 12], [8, 15], [7, 24]][ent(0, 3)], L = Math.hypot(...P); return [[0, 0], [L, 0], [L + P[0], P[1]], [P[0], P[1]]]; }
    case 'romboide': return [[0, 0], [a + 6, 0], [a + 6 + s, h], [s, h]];
    case 'trapecio isósceles': return [[0, 0], [2 * a + b, 0], [a + b, h], [a, h]];
    case 'trapecio rectángulo': return [[0, 0], [a + b, 0], [a, h], [0, h]];
    case 'trapecio escaleno': return [[0, 0], [a + b + 3, 0], [a + 1, h], [-1, h]];
    case 'trapezoide': return [[0, 0], [a + 3, 0], [a + 4, h + 2], [1, h]];
  }
}
const INCLUYE = { 'cuadrado': ['paralelogramo', 'rectángulo', 'rombo', 'cuadrado'], 'rectángulo': ['paralelogramo', 'rectángulo'], 'rombo': ['paralelogramo', 'rombo'],
  'romboide': ['paralelogramo', 'romboide'], 'trapecio isósceles': ['trapecio', 'trapecio isósceles'], 'trapecio rectángulo': ['trapecio', 'trapecio rectángulo'],
  'trapecio escaleno': ['trapecio', 'trapecio escaleno'], 'trapezoide': ['trapezoide'] };

test('cuadriláteros: la clase y sus nombres no cambian al girar ni al trasladar; inclusión de clases; ningún error de nombres acierta', () => {
  for (let k = 0; k < N; k++) {
    const tipo = Object.keys(INCLUYE)[k % 8];
    let V = generar(tipo);
    if (tipo === 'trapecio escaleno') {
      // a veces sale isósceles o con ángulo recto por azar: se salta
      const c0 = motor.cuadrilatero(...V); if (c0.tipo !== tipo) continue;
    }
    const g = al(-180, 180), t = [al(-9, 9), al(-9, 9)];
    V = motor.girar(V, g).map(p => ({ x: p.x + t[0], y: p.y + t[1] }));
    const C = motor.cuadrilatero(...V);
    assert.equal(C.tipo, tipo, `${tipo} girado ${g.toFixed(1)}°`);
    assert.deepEqual(C.nombres, INCLUYE[tipo]);
    cerca(C.sumaAngulos, 360, 'suma de ángulos', 1e-8);
    if (C.esCuadrado) assert.ok(C.esRombo && C.esRectangulo && C.esParalelogramo, 'el cuadrado es rombo, rectángulo y paralelogramo');
    if (C.esRombo || C.esRectangulo) assert.ok(C.esParalelogramo);
    if (C.esParalelogramo) assert.ok(C.diagonales.seCortanEnSuPuntoMedio, 'las diagonales del paralelogramo se bisecan');
    if (C.esRombo) assert.ok(C.diagonales.perpendiculares);
    if (C.esRectangulo) assert.ok(C.diagonales.iguales);
    if (tipo === 'trapecio isósceles') assert.ok(C.diagonales.iguales);
    sinErrorCorrecto(C.errores.nombres, C.nombres, `nombres de ${tipo}`);
    // los vértices en otro orden de partida dan la misma figura
    const R = motor.cuadrilatero(V[1], V[2], V[3], V[0]);
    assert.equal(R.tipo, tipo, `${tipo} empezando en otro vértice`);
    if (C.trapecio) {
      // la mediana medida con coordenadas: une los puntos medios de los laterales
      const [M1, M2] = C.trapecio.extremosMediana;
      cerca(Math.hypot(M1.x - M2.x, M1.y - M2.y), C.trapecio.mediana, 'mediana medida', 1e-8);
      cerca(C.trapecio.mediana, (C.trapecio.baseMayor + C.trapecio.baseMenor) / 2, 'semisuma', 1e-8);
      const [N1, N2] = C.trapecio.extremosSegmentoDiagonales;
      cerca(Math.hypot(N1.x - N2.x, N1.y - N2.y), C.trapecio.segmentoDiagonales, 'segmento entre puntos medios de las diagonales', 1e-8);
      cerca(C.area, C.trapecio.mediana * C.trapecio.altura, 'área = mediana · altura', 1e-8);
      sinErrorCorrecto(C.trapecio.errores.mediana, C.trapecio.mediana, 'mediana');
    }
  }
});

test('rombo(lado, ángulo): lados iguales en todo ángulo; con 90° es cuadrado', () => {
  for (let a = 5; a < 180; a += 5) {
    const V = motor.rombo(4, a), C = motor.cuadrilatero(...V);
    assert.ok(C.esRombo, `ángulo ${a}`); cerca(C.angulos.A, a, 'ángulo en A', 1e-8);
    assert.equal(C.esCuadrado, a === 90);
  }
  assert.throws(() => motor.rombo(4, 180), /menor que 180/);
});

test('el cuadrado «de punta» (diagonales horizontal y vertical) trae el error de posición; con un lado horizontal, no', () => {
  for (let a = 1; a <= 6; a++) {
    const D = motor.cuadrilatero([0, -a], [a, 0], [0, a], [-a, 0]);
    assert.equal(D.tipo, 'cuadrado'); assert.deepEqual(D.errores.nombres.porPosicion, ['paralelogramo', 'rombo']);
    assert.ok(!('porPosicion' in motor.cuadrilatero([0, 0], [a, 0], [a, a], [0, a]).errores.nombres));
  }
});

test('trapecio por sus bases: mediana entre las dos bases; ningún error acierta (B = 3b quita B − b)', () => {
  for (let k = 0; k < N; k++) {
    const b = ent(1, 20), B = b + ent(1, 30), T = motor.trapecio({ B, b });
    assert.ok(T.mediana > b && T.mediana < B);
    cerca(T.mediana - T.segmentoDiagonales, b, 'mediana − segmento = base menor');
    sinErrorCorrecto(T.errores.mediana, T.mediana, `mediana ${B}, ${b}`);
    sinErrorCorrecto(T.errores.segmentoDiagonales, T.segmentoDiagonales, `segmento ${B}, ${b}`);
    assert.equal('resta' in T.errores.mediana, B !== 3 * b);
  }
});

test('las opciones de las predicciones son distintas entre sí', () => {
  const distintos = l => assert.equal(new Set(l.map(x => Math.round(x * 1e6))).size, l.length, JSON.stringify(l));
  const H = motor.poligono(6); distintos([H.sumaInteriores, H.errores.sumaInteriores.con180n, H.errores.sumaInteriores.siempre360, H.errores.sumaInteriores.conNmenos1]);
  const O = motor.poligono(8); distintos([O.diagonales, O.errores.diagonales.conLados, O.errores.diagonales.sinDividir, O.errores.diagonales.soloDesdeUnVertice]);
  const A = motor.nDesdeAngulo({ interior: 150 }); distintos([A.n, A.errores.con180, A.errores.interiorComoCentral]);
  const T = motor.trapecio({ B: 10, b: 4 }); distintos([T.mediana, T.errores.mediana.resta, T.errores.mediana.suma, T.errores.mediana.mitadDeLaResta]);
  const R = motor.regular({ n: 6, lado: 6 }); distintos([R.apotema, R.errores.apotema.mitadDelLado, R.errores.apotema.comoRadio, R.errores.apotema.distanciaEntreLados]);
  const C = motor.poligonoVertices([[0, 0], [6, 0], [6, 5], [3, 2], [0, 5]]); distintos([C.sumaInteriores, C.errores.sumaInteriores.entranteMedidoPorFuera, C.errores.sumaInteriores.con180n]);
  const X = motor.poligono(10); distintos([X.sumaExteriores, X.errores.sumaExteriores.comoInteriores, X.errores.sumaExteriores.con180n]);
  const Z = motor.poligono(3); distintos([Z.diagonales, Z.errores.diagonales.conLados, Z.errores.diagonales.conLadosSinDividir]);
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.poligono(2), /al menos 3/);
  assert.throws(() => motor.poligono(5.5), /entero/);
  assert.throws(() => motor.poligono('6'), /número/);
  assert.throws(() => motor.nDesdeAngulo({ interior: 190 }), /menor que 180/);
  assert.throws(() => motor.nDesdeAngulo({ interior: -10 }), /positivo/);
  assert.throws(() => motor.nDesdeAngulo({}), /falta el ángulo/);
  assert.throws(() => motor.nDesdeDiagonales(-1), /no negativo/);
  assert.throws(() => motor.diagonalesDesdeVertices(6, 7), /tantos vértices/);
  assert.throws(() => motor.regular({ n: 6 }), /falta el lado/);
  assert.throws(() => motor.regular({ n: 6, lado: 0 }), /positivo/);
  assert.throws(() => motor.poligonoVertices([[0, 0], [1, 1]]), /al menos 3/);
  assert.throws(() => motor.poligonoVertices([[0, 0], [1, 1], [2, 2]]), /no encierran/);
  assert.throws(() => motor.poligonoVertices([[0, 0], ['a', 1], [2, 0]]), /coordenadas/);
  assert.throws(() => motor.cuadrilatero([0, 0], [0, 0], [1, 1], [0, 1]), /coinciden/);
  assert.equal(motor.cuadrilatero([0, 0], [4, 0], [0, 4], [4, 4]).tipo, 'cuadrilátero cruzado');
  assert.equal(motor.cuadrilatero([0, 0], [2, 0], [4, 0], [2, 3]).tipo, 'tres vértices alineados');
  assert.equal(motor.cuadrilatero([0, 0], [4, 0], [1, 1], [0, 4]).tipo, 'cuadrilátero no convexo');
  assert.throws(() => motor.trapecio({ B: 4, b: 6 }), /no puede ser mayor/);
  assert.throws(() => motor.trapecio({ B: 4, b: 4 }), /paralelogramo/);
  assert.throws(() => motor.girar([[0, 0]], 'x'), /grados/);
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
