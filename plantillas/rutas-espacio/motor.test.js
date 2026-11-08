// Pruebas del motor de «La hormiga en el alambre». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con estructuras al azar (semilla fija):
//    - las rutas sin repetir punto coinciden con otro conteo (programación dinámica sobre conjuntos de nodos);
//      cada ruta es válida (tramos que unen los nodos seguidos, sin repetir nodos o tramos según el caso);
//    - las que solo avanzan: la tabla de la llegada = la lista; en una caja completa, el multinomial;
//    - con espejo, unLado + (ejeDoble − unLado)/2 = total (el lado se cuenta dos veces y el eje una);
//    - las redes por tramos: el producto de cada cadena sumado = la fuerza bruta en una red armada con esas cadenas;
//    - la franja: 2^n por la fuerza bruta y por los palitos verticales (subconjuntos impares);
//    - cilindros: la hélice medida en 3D con segmentos cortos, el tarro y los tangentes con una barrida del punto de cruce;
//    - el recorrido máximo: = total − lo mínimo a quitar, su ruta es válida y lo que sobra deja un recorrido posible;
//    - NINGÚN ERROR TÍPICO COINCIDE CON LA RESPUESTA NI CON OTRO ERROR (los que coinciden van en 'coinciden').
// 3. Errores de entrada.
// 4. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
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
// {"estructura": "ele"} es motor.estructuras.ele; {"celdas": [...], "arista": a} es motor.cubos(celdas, { arista })
const resolver = a => {
  if (a && typeof a === 'object' && !Array.isArray(a)) {
    if (typeof a.estructura === 'string' && Object.keys(a).length === 1) return motor.estructuras[a.estructura];
    if (Array.isArray(a.celdas)) return motor.cubos(a.celdas, a.arista === undefined ? {} : { arista: a.arista });
  }
  return Array.isArray(a) ? a.map(resolver) : a;
};
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
  assert.equal(datos.plantilla, 'rutas-espacio');
  assert.ok(datos.casos.length >= 16 && datos.casos.length <= 26);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
  assert.equal(datos.verificacion !== undefined, true);
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
  for (const [k, v] of Object.entries(R.errores)) assert.ok(!casi(v, correcto), `${que}: el error ${k} da la respuesta (${v})`);
  const vs = Object.values(R.errores);
  for (let i = 0; i < vs.length; i++) for (let j = i + 1; j < vs.length; j++) assert.ok(!casi(vs[i], vs[j]), `${que}: dos errores dan lo mismo`);
}
function grafoAzar(n, extra) {
  const nodos = []; for (let k = 0; k < n; k++) nodos.push([Math.cos(k), Math.sin(k), k / 10]);
  const tramos = [];
  for (let k = 1; k < n; k++) tramos.push([ent(0, k - 1), k]);   // un árbol: queda unida
  for (let q = 0; q < extra; q++) { const i = ent(0, n - 1); let j = ent(0, n - 1); if (j === i) j = (i + 1) % n; tramos.push([i, j]); }
  return { nodos, tramos };
}
// conteo independiente de rutas sin repetir punto: dp[conjunto][nodo] (los tramos dobles cuentan aparte)
function contarSimples(est, a, b) {
  const n = est.nodos.length, M = new Map();
  const ady = est.nodos.map(() => []);
  est.tramos.forEach(([i, j]) => { ady[i].push(j); ady[j].push(i); });
  const f = (mask, v) => {
    if (v === b) return 1;
    const k = mask * 32 + v; if (M.has(k)) return M.get(k);
    let s = 0; for (const w of ady[v]) if (!(mask & (1 << w))) s += f(mask | (1 << w), w);
    M.set(k, s); return s;
  };
  void n;
  return f(1 << a, a);
}
function validaRuta(est, R, desde, hasta, repetir) {
  assert.equal(R.nodos[0], desde); assert.equal(R.nodos[R.nodos.length - 1], hasta);
  assert.equal(R.tramos.length, R.nodos.length - 1);
  R.tramos.forEach((k, q) => { const [i, j] = est.tramos[k], u = R.nodos[q], v = R.nodos[q + 1]; assert.ok((i === u && j === v) || (i === v && j === u), 'tramo que no une los nodos'); });
  assert.equal(new Set(R.tramos).size, R.tramos.length, 'tramo repetido');
  if (repetir === 'punto') assert.equal(new Set(R.nodos).size, R.nodos.length, 'punto repetido');
  else if (repetir === 'tramo') assert.equal(R.nodos.slice(0, -1).indexOf(hasta), -1, 'pasó por la llegada antes del final');
}

test('rutas sin repetir punto = otro conteo, en 60 grafos al azar (también sin repetir tramo: rutas válidas)', () => {
  for (let q = 0; q < 60; q++) {
    const est = grafoAzar(ent(3, 8), ent(0, 6)), n = est.nodos.length;
    const a = ent(0, n - 1); let b = ent(0, n - 1); if (b === a) b = (a + 1) % n;
    const R = motor.rutasSinRepetir(est, { desde: a, hasta: b });
    assert.equal(R.total, contarSimples(est, a, b));
    R.rutas.forEach(r => validaRuta(est, r, a, b, 'punto'));
    assert.equal(Object.values(R.porPasos).reduce((s, v) => s + v, 0), R.total);
    sinChoques(R, R.total, 'rutasSinRepetir');
    const T = motor.rutasSinRepetir(est, { desde: a, hasta: b, repetir: 'tramo' });
    assert.ok(T.total >= R.total);
    T.rutas.forEach(r => validaRuta(est, r, a, b, 'tramo'));
    const claves = new Set(T.rutas.map(r => r.tramos.join(',')));
    assert.equal(claves.size, T.total, 'rutas repetidas');
  }
});

test('las estructuras de la escena: las rutas sin repetir punto coinciden con el otro conteo y el espejo es coherente', () => {
  const S = motor.estructuras;
  const casos = [[S.piramide, 0, 2, [0, 3, 2, 1, 4]], [S.piramide, 0, 4, [0, 3, 2, 1, 4]], [S.tronco, 0, 6, [0, 3, 2, 1, 4, 7, 6, 5]],
    [S.tronco, 0, 2, [0, 3, 2, 1, 4, 7, 6, 5]], [S.hexagono, 0, 3, [0, 5, 4, 3, 2, 1, 6]], [S.hexagonoSolo, 0, 3, [0, 5, 4, 3, 2, 1]], [S.cubo, 0, 7, [0, 2, 1, 3, 4, 6, 5, 7]]];
  for (const [est, a, b, e] of casos) {
    const R = motor.rutasSinRepetir(est, { desde: a, hasta: b, espejo: e });
    assert.equal(R.total, contarSimples(est, a, b));
    const u = 'unLado' in R.errores ? R.errores.unLado : null, d = 'ejeDoble' in R.errores ? R.errores.ejeDoble : null;
    if (u !== null && d !== null) assert.equal(u + (d - u) / 2, R.total, 'el lado dos veces y el eje una');
  }
  // el espejo de verdad es un reflejo: manda tramos en tramos
  for (const [est, , , e] of casos) for (const [i, j] of est.tramos) assert.ok(est.tramos.some(([u, v]) => (u === e[i] && v === e[j]) || (u === e[j] && v === e[i])));
});

test('solo avanzar: la tabla de la llegada = la lista; en una caja completa, el multinomial; cada nodo suma los de atrás', () => {
  for (let q = 0; q < 25; q++) {
    const a = ent(1, 3), b = ent(1, 2), c = ent(1, 2), celdas = [];
    for (let i = 0; i < a; i++) for (let j = 0; j < b; j++) for (let k = 0; k < c; k++) celdas.push([i, j, k]);
    const est = motor.cubos(celdas), fin = est.nodos.length - 1;
    const D = motor.dirigidas(est, { desde: 0, hasta: fin });
    assert.equal(D.total, motor.multinomial([a, b, c]));
    assert.equal(D.tabla[fin], D.total);
    assert.ok(D.coinciden.includes('cajaCompleta'));
    // a una caja incompleta (se saca una celda que no tiene la salida ni la llegada) le quedan menos o igual
    if (celdas.length > 2) {
      const k = ent(1, celdas.length - 2), resto = celdas.filter((_, j) => j !== k);
      const e2 = motor.cubos(resto), f2 = e2.nodos.findIndex(p => p.join() === [a, b, c].join());
      if (f2 >= 0) {
        const D2 = motor.dirigidas(e2, { desde: 0, hasta: f2 });
        assert.ok(D2.total <= D.total);
        assert.equal(D2.rutas.length, D2.total);
        assert.equal(D2.tabla[f2], D2.total);
        D2.rutas.forEach(r => { assert.equal(r.pasos.length, a + b + c); validaRuta(e2, r, 0, f2, 'punto'); });
        sinChoques(D2, D2.total, 'dirigidas');
      }
    }
  }
  // cada nodo suma lo de los nodos que llegan a él
  const E = motor.estructuras.ele, D = motor.dirigidas(E, { desde: 0, hasta: 15 });
  E.nodos.forEach((p, v) => {
    if (v === 0) return;
    let s = 0;
    E.tramos.forEach(([i, j]) => { const w = i === v ? j : j === v ? i : -1; if (w < 0) return; const q = E.nodos[w]; const d = [p[0] - q[0], p[1] - q[1], p[2] - q[2]]; if (d.every(x => x >= 0) && d.some(x => x > 0)) s += D.tabla[w]; });
    assert.equal(D.tabla[v], s, `nodo ${v}`);
  });
});

test('por tramos: la red armada con esas cadenas da lo mismo por fuerza bruta', () => {
  for (let q = 0; q < 30; q++) {
    const cadenas = Array.from({ length: ent(1, 3) }, () => Array.from({ length: ent(1, 3) }, () => ent(1, 3)));
    // red: salida 0, llegada 1; cada cadena con sus nodos intermedios y tramos dobles
    const nodos = [[0, 0, 0], [9, 0, 0]], tramos = [];
    cadenas.forEach((c, ci) => {
      let antes = 0;
      c.forEach((m, k) => {
        let sig;
        if (k === c.length - 1) sig = 1; else { nodos.push([k + 1, ci + 1, 0]); sig = nodos.length - 1; }
        for (let r = 0; r < m; r++) tramos.push([antes, sig, 1 + r]);
        antes = sig;
      });
    });
    const T = motor.porTramos({ cadenas });
    assert.equal(T.total, motor.rutasSinRepetir({ nodos, tramos }, { desde: 0, hasta: 1 }).total);
    sinChoques(T, T.total, 'porTramos');
  }
});

test('la franja de 1 × n: 2^n por la fuerza bruta y por los palitos verticales', () => {
  const S = motor.franjaSucesion({ hasta: 8 });
  S.valores.forEach((v, k) => {
    const n = k + 1;
    let impares = 0; for (let m = 0; m < (1 << (n + 1)); m++) { let c = 0; for (let t = m; t; t >>= 1) c += t & 1; if (c % 2) impares++; }
    assert.equal(v, impares);
    const f = motor.franja({ n });
    assert.equal(v, contarSimples(f, 0, f.nodos.length - 1));
  });
  assert.equal(S.formula, '2^n'); assert.equal(S.razon, 2);
  for (let n = 3; n <= 8; n++) { const P = motor.franjaPrediccion({ n }); sinChoques(P, P.total, 'franja ' + n); }
  const F2 = motor.franjaSucesion({ hasta: 4, filas: 2 }); assert.equal(F2.formula, null);
  const f = motor.franja({ n: 3, filas: 2 }); assert.equal(F2.valores[2], contarSimples(f, 0, f.nodos.length - 1));
});

test('cilindros: la hélice medida en 3D, y el tarro y los tangentes con una barrida del punto de cruce', () => {
  for (let q = 0; q < 40; q++) {
    const r = ent(1, 6), h = ent(1, 20), k = ent(1, 4);
    const H = motor.helice({ radio: r, altura: h, vueltas: k });
    let L = 0, prev = [r, 0, 0];
    const N = 20000;
    for (let s = 1; s <= N; s++) { const t = s / N, a = 2 * Math.PI * k * t, p = [r * Math.cos(a), r * Math.sin(a), h * t]; L += Math.hypot(p[0] - prev[0], p[1] - prev[1], p[2] - prev[2]); prev = p; }
    assert.ok(Math.abs(L - H.L) < 1e-6 * H.L, `hélice ${L} vs ${H.L}`);
    assert.ok(H.L <= h + 2 * Math.PI * r * k + 1e-9 && H.L >= Math.hypot(h, 2 * Math.PI * r) - 1e-9);
    sinChoques(H, H.L, 'hélice');
    const exacto = H.exacto;
    // el texto exacto vale lo mismo que L
    const m = exacto.match(/^(\d*)√\((\d+) \+ (\d*)π²\)$/);
    if (m) { const g = m[1] ? +m[1] : 1, A = +m[2], B = m[3] ? +m[3] : 1; assert.ok(Math.abs(g * Math.sqrt(A + B * Math.PI * Math.PI) - H.L) < 1e-9 * H.L); }
    // tarro: cruza el borde en un punto; se barre ese punto
    const C = ent(4, 30), a = ent(0, 8), b = ent(0, 8), f = [0.5, 0.25, 0.125][ent(0, 2)];
    if (a + b === 0) continue;
    const T = motor.tarro({ contorno: C, afuera: a, adentro: b, fraccion: f });
    let mejor = Infinity;
    for (let s = 0; s <= 4000; s++) { const x = s / 4000 * C; const d1 = Math.min(Math.abs(x), C - Math.abs(x)); const d2 = Math.min(Math.abs(f * C - x), C - Math.abs(f * C - x)); mejor = Math.min(mejor, Math.hypot(d1, a) + Math.hypot(d2, b)); }
    assert.ok(Math.abs(mejor - T.L) < 1e-3, `tarro ${mejor} vs ${T.L}`);
    sinChoques(T, T.L, 'tarro');
    const r2 = ent(1, 5), G = motor.tangentes({ radio: r, radio2: r2, altura: h });
    let m2 = Infinity;
    for (let s = 0; s <= 4000; s++) { const z = s / 4000 * h; m2 = Math.min(m2, Math.hypot(Math.PI * r, z) + Math.hypot(Math.PI * r2, h - z)); }
    assert.ok(Math.abs(m2 - G.L) < 1e-3);
    sinChoques(G, G.L, 'tangentes');
  }
});

test('recorrido máximo: total − lo mínimo a quitar; la ruta es válida y lo que sobra deja un recorrido posible', () => {
  const S = motor.estructuras;
  const lista = [[S.cubo, 0, 7], [S.cubo, 0, 1], [S.cubo, 0, 3], [S.dosCubos, 0, 11], [S.dosCubos, 0, 5], [S.piramide, 0, 2], [S.piramide, 0, 4], [S.tronco, 0, 6],
    [motor.cubos([[0, 0, 0], [1, 0, 0]], { arista: 2 }), 0, 11], [S.hexagono, 0, 3], [S.cuboArista3, 0, 7]];
  for (let q = 0; q < 15; q++) { const e = grafoAzar(ent(4, 7), ent(2, 6)); e.tramos = e.tramos.map(t => [t[0], t[1], ent(1, 5)]); lista.push([e, 0, e.nodos.length - 1]); }
  for (const [est, a, b] of lista) {
    const M = motor.maximoSinRepetir(est, { desde: a, hasta: b });
    validaRuta(est, { nodos: M.ruta.nodos, tramos: M.ruta.tramos }, a, M.ruta.nodos[M.ruta.nodos.length - 1], 'cualquiera');
    assert.equal(M.ruta.nodos[M.ruta.nodos.length - 1], b);
    const largo = M.ruta.tramos.reduce((s, k) => s + motor.longitud(est, k), 0);
    assert.ok(Math.abs(largo - M.maximo) < 1e-9);
    assert.ok(M.maximo <= M.total - M.quitarMinimo + 1e-9, 'no se puede pasar del límite de los impares');
    const R = motor.revisarQuitar(est, { desde: a, hasta: b, quitados: M.sobran });
    assert.ok(R.sePuede); assert.ok(Math.abs(R.longitud - M.maximo) < 1e-9);
    sinChoques(M, M.maximo, 'máximo');
  }
  // en las estructuras de alambre de la escena, el límite se alcanza
  for (const [est, a, b] of lista.slice(0, 11)) { const M = motor.maximoSinRepetir(est, { desde: a, hasta: b }); assert.ok(Math.abs(M.maximo - (M.total - M.quitarMinimo)) < 1e-9); }
});

test('los distractores de las predicciones de la escena no coinciden con la respuesta ni entre sí', () => {
  const S = motor.estructuras;
  const R = [
    [motor.dirigidas(S.ele, { desde: 0, hasta: 15 }), 'total'],
    [motor.rutasSinRepetir(S.piramide, { desde: 0, hasta: 2, espejo: [0, 3, 2, 1, 4] }), 'total'],
    [motor.rutasSinRepetir(S.hexagono, { desde: 0, hasta: 3, espejo: [0, 5, 4, 3, 2, 1, 6] }), 'total'],
    [motor.porTramos({ cadenas: [[2, 2, 2], [2, 2, 2], [1]] }), 'total'],
    [motor.franjaPrediccion({ n: 6 }), 'total'],
    [motor.helice({ radio: 2, altura: 12, vueltas: 2 }), 'L'],
    [motor.maximoSinRepetir(S.cuboArista3, { desde: 0, hasta: 7 }), 'maximo'],
    [motor.soltarDireccion(S.cubo, { desde: 0, hasta: 7 }), 'total'],
    [motor.pasoObligado(S.unidosVertice, { desde: 0, paso: 7, hasta: 18, dirigido: true }), 'total'],
    [motor.hamiltonianos(S.cubo, { desde: 0, hasta: 7 }), 'total'],
    [motor.tarro({ contorno: 24, afuera: 3, adentro: 6 }), 'L'],
    [motor.compararRepetir(S.tronco, { desde: 0, hasta: 6 }), 'total'],
    [motor.tangentes({ radio: 3, altura: 8 }), 'L'],
  ];
  for (const [r, k] of R) { sinChoques(r, r[k], k); assert.equal(r.coinciden.length, 0, 'ningún error de la escena coincide'); assert.equal(r.repetidos, undefined); }
  const P = motor.pasoObligado(S.unidosVertice, { desde: 0, paso: 7, hasta: 18, dirigido: true });
  assert.ok(P.todasPasan); assert.equal(P.producto, P.total);
});

test('exactos con π', () => {
  assert.equal(motor.exactoPi(144, 64), '4√(9 + 4π²)');
  assert.equal(motor.exactoPi(20, 0), '2√5');
  assert.equal(motor.exactoPi(0, 4), '2π');
  assert.equal(motor.exactoPi(9, 1), '√(9 + π²)');
  assert.equal(motor.tapa({ radio: 3, altura: 10 }).L, 13);
});

// 3. Errores de entrada
test('errores de entrada', () => {
  const S = motor.estructuras;
  assert.throws(() => motor.cubos([]));
  assert.throws(() => motor.cubos([[0, 0]]));
  assert.throws(() => motor.rutasSinRepetir(S.cubo, { desde: 0, hasta: 0 }));
  assert.throws(() => motor.rutasSinRepetir(S.cubo, { desde: 0, hasta: 9 }));
  assert.throws(() => motor.rutasSinRepetir(S.cubo, { desde: 0, hasta: 7, repetir: 'nada' }));
  assert.throws(() => motor.rutasSinRepetir(S.cubo, { desde: 0, hasta: 7, espejo: [1, 0, 2, 3, 4, 5, 6, 7] }));
  assert.throws(() => motor.dirigidas(S.cubo, { desde: 0, hasta: 7, direcciones: [[1, 0, 0], [-1, 0, 0]] }));
  assert.throws(() => motor.tronco({ abajo: 2, arriba: 3, altura: 1 }));
  assert.throws(() => motor.helice({ radio: 1, contorno: 3, altura: 2, vueltas: 1 }));
  assert.throws(() => motor.helice({ radio: 1, altura: 2, vueltas: 1.5 }));
  assert.throws(() => motor.tarro({ contorno: 10, afuera: 1, adentro: 1, fraccion: 0.7 }));
  assert.throws(() => motor.franjaPrediccion({ n: 2 }));
  assert.throws(() => motor.maximoSinRepetir(S.cubo, { desde: 3, hasta: 3 }));
  assert.throws(() => motor.revisarQuitar(S.cubo, { desde: 0, hasta: 7, quitados: [40] }));
  assert.throws(() => motor.porTramos({ cadenas: [[0]] }));
  assert.throws(() => motor.piramide({ lado: -1, altura: 1 }));
});

// 4. papel.json
test('papel.json: formato', () => {
  assert.ok(papel.titulo && papel.problemas.length >= 5 && papel.problemas.length <= 10);
  for (const p of papel.problemas) assert.ok(p.id && p.enunciado && p.respuesta && p.pasos.length >= 2 && p.verificar.length >= 1);
});
for (const p of papel.problemas) test(`papel ${p.id}`, () => { for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id); });
