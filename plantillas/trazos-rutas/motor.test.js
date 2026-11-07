// Pruebas del motor de «El lápiz y la hormiga». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con figuras y números al azar (semilla fija):
//    - la regla de los impares coincide con la búsqueda por vuelta atrás, y el recorrido hallado es válido;
//    - con trazos − 1 líneas falsas entre impares, la figura sale de un solo trazo (alcanzan esos trazos);
//    - el cartero coincide con otra búsqueda (Dijkstra sobre «nodo y tramos ya recorridos») y su ruta mide lo que dice;
//    - los caminos por la recurrencia = el combinatorio = la lista por fuerza bruta, también con cruces cerrados;
//    - cerrar un cruce quita justo los caminos que pasan por él; en el espacio, el multinomial;
//    - el perímetro de una escalera o una chakana sin entrantes es el del rectángulo; un entrante suma sus dos paredes;
//    - la ruta de la hormiga no baja de la recta por dentro, no supera las aristas y coincide con una barrida;
//    - los semicírculos chicos miden lo mismo que el grande;
//    - NINGÚN ERROR TÍPICO COINCIDE CON LA RESPUESTA (los que coinciden van en 'coinciden').
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
// {"figura": "casita"} es motor.figuras.casita
const resolver = a => (a && typeof a === 'object' && !Array.isArray(a) && typeof a.figura === 'string' && Object.keys(a).length === 1 ? motor.figuras[a.figura]
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
  assert.equal(datos.plantilla, 'trazos-rutas');
  assert.ok(datos.casos.length >= 16 && datos.casos.length <= 22);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
  assert.ok(datos.casos.some(c => c.tambien && c.tambien.length), 'algún caso trae «tambien»');
  for (const f of Object.values(motor.figuras)) motor.grados(f);
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
  for (const [k, v] of Object.entries(R.errores)) assert.ok(!casi(v, correcto), `${que}: el error ${k} da la respuesta (${JSON.stringify(v)})`);
  const vs = Object.values(R.errores);
  for (let i = 0; i < vs.length; i++) for (let j = i + 1; j < vs.length; j++) assert.ok(!casi(vs[i], vs[j]), `${que}: dos errores dan lo mismo`);
}
// figura al azar: n nodos en un círculo, tramos al azar (con algún tramo doble), longitudes enteras
function figuraAzar(n, t, conLongitud, sinDobles) {
  const nodos = Array.from({ length: n }, (_, k) => [Math.round(100 * Math.cos(2 * Math.PI * k / n)), Math.round(100 * Math.sin(2 * Math.PI * k / n))]);
  const tramos = [], ya = new Set();
  for (let k = 0; k < t; k++) {
    const i = ent(0, n - 1); let j = ent(0, n - 2); if (j >= i) j++;
    const clave = Math.min(i, j) + '-' + Math.max(i, j);
    if (sinDobles && ya.has(clave)) continue;
    ya.add(clave);
    tramos.push(conLongitud ? [i, j, ent(1, 9)] : [i, j]);
  }
  return { nodos, tramos };
}
function conexa(f) {
  const n = f.nodos.length, ady = Array.from({ length: n }, () => []);
  for (const [i, j] of f.tramos) { ady[i].push(j); ady[j].push(i); }
  const con = [...Array(n).keys()].filter(v => ady[v].length);
  if (!con.length) return false;
  const vis = new Set([con[0]]), pila = [con[0]];
  while (pila.length) { const v = pila.pop(); for (const w of ady[v]) if (!vis.has(w)) { vis.add(w); pila.push(w); } }
  return con.every(v => vis.has(v));
}

test('un solo trazo: la regla de los impares coincide con la búsqueda por vuelta atrás', () => {
  let si = 0, no = 0;
  for (let k = 0; k < 400; k++) {
    const f = figuraAzar(ent(2, 6), ent(1, 9));
    if (!f.tramos.length) continue;
    const U = motor.unTrazo(f), G = motor.grados(f);
    const regla = conexa(f) && (G.numImpares === 0 || G.numImpares === 2);
    assert.equal(U.sePuede, regla, `figura ${JSON.stringify(f.tramos)}: la regla dice ${regla} y la búsqueda ${U.sePuede}`);
    assert.equal(U.regla !== 'no', regla);
    assert.equal(G.grados.reduce((s, g) => s + g, 0), 2 * f.tramos.length, 'la suma de grados es el doble de los tramos');
    assert.equal(G.numImpares % 2, 0, 'siempre hay un número par de impares');
    if (U.sePuede) {
      si++;
      assert.ok(motor.revisarTrazo(f, U.recorrido).completo, 'el recorrido hallado pasa por todo una sola vez');
      if (G.numImpares === 2) { const ext = [U.recorrido[0], U.recorrido[U.recorrido.length - 1]].sort((a, b) => a - b); assert.deepEqual(ext, G.impares, 'empieza y termina en los impares'); }
      else assert.equal(U.recorrido[0], U.recorrido[U.recorrido.length - 1], 'circuito: vuelve al inicio');
      for (const v of U.empiezaEn) assert.ok(motor.buscarRecorrido(f, { inicio: v }).recorrido, 'se puede empezar donde dice');
    } else no++;
    sinChoques(U, U.trazos, 'trazos');
  }
  assert.ok(si > 30 && no > 30, `hubo figuras de los dos tipos (${si} y ${no})`);
});
test('trazos: con trazos − 1 líneas falsas entre impares, la figura conexa sale de un solo trazo', () => {
  for (let k = 0; k < 200; k++) {
    const f = figuraAzar(ent(3, 6), ent(3, 9));
    if (!f.tramos.length || !conexa(f)) continue;
    const U = motor.unTrazo(f);
    assert.equal(U.trazos, Math.max(1, U.numImpares / 2));
    const imp = U.impares.slice(), extra = [];
    for (let q = 0; q + 3 < imp.length + 0 && extra.length < U.trazos - 1; q += 2) extra.push([imp[q + 2], imp[q + 3]]);
    if (U.trazos > 1) { assert.equal(extra.length, U.trazos - 1); assert.ok(motor.unTrazo({ nodos: f.nodos, tramos: f.tramos.concat(extra) }).sePuede); }
  }
});
// otra búsqueda del cartero: Dijkstra sobre (nodo, tramos ya recorridos), caminar un tramo cuesta su longitud
function carteroDijkstra(f, volver) {
  const n = f.nodos.length, T = f.tramos, todos = (1 << T.length) - 1;
  const ady = Array.from({ length: n }, () => []);
  T.forEach(([i, j, L], k) => { ady[i].push([j, k, L]); ady[j].push([i, k, L]); });
  let mejor = Infinity;
  for (let s = 0; s < n; s++) {
    if (!ady[s].length) continue;
    const dist = new Map(), cola = [[0, s, 0]];
    dist.set(s + ':0', 0);
    while (cola.length) {
      cola.sort((a, b) => a[0] - b[0]);
      const [d, v, m] = cola.shift();
      if (d > dist.get(v + ':' + m)) continue;
      if (m === todos && (!volver || v === s)) { mejor = Math.min(mejor, d); break; }
      for (const [w, k, L] of ady[v]) {
        const m2 = m | (1 << k), c = v + ':' + m;
        const clave = w + ':' + m2, nd = d + L;
        if (!(dist.has(clave)) || nd < dist.get(clave)) { dist.set(clave, nd); cola.push([nd, w, m2]); }
        void c;
      }
    }
  }
  return mejor;
}
test('cartero: coincide con Dijkstra sobre los estados, abierto y cerrado; la ruta mide el mínimo', () => {
  let hechos = 0;
  for (let k = 0; k < 120 && hechos < 60; k++) {
    const f = figuraAzar(ent(3, 5), ent(3, 7), true, true);
    if (!conexa(f)) continue;
    hechos++;
    for (const volver of [false, true]) {
      const C = motor.cartero(f, { volver });
      cerca(C.minimo, carteroDijkstra(f, volver), `cartero ${volver ? 'cerrado' : 'abierto'} ${JSON.stringify(f.tramos)}`);
      // la ruta pasa por todos los tramos y mide el mínimo
      const largo = (u, v) => Math.min(...f.tramos.filter(([i, j]) => (i === u && j === v) || (i === v && j === u)).map(t => t[2]));
      let L = 0; for (let q = 1; q < C.ruta.length; q++) L += largo(C.ruta[q - 1], C.ruta[q]);
      cerca(L, C.minimo, 'la ruta mide el mínimo');
      const pisados = new Set(); for (let q = 1; q < C.ruta.length; q++) pisados.add(Math.min(C.ruta[q - 1], C.ruta[q]) + '-' + Math.max(C.ruta[q - 1], C.ruta[q]));
      for (const [i, j] of f.tramos) assert.ok(pisados.has(Math.min(i, j) + '-' + Math.max(i, j)), 'la ruta pasa por cada tramo');
      if (volver) assert.equal(C.ruta[0], C.ruta[C.ruta.length - 1]);
      assert.ok(C.minimo >= C.suma - 1e-9 && C.minimo <= 2 * C.suma + 1e-9);
      sinChoques(C, C.minimo, 'cartero');
    }
  }
  assert.ok(hechos >= 30);
});
test('caminos: recurrencia = combinatorio = fuerza bruta, también con cruces cerrados', () => {
  for (let k = 0; k < 150; k++) {
    const m = ent(0, 6), n = ent(0, 6);
    if (m + n < 1) continue;
    const C = motor.caminos({ m, n });
    assert.equal(C.caminos, motor.combinatorio(m + n, m));
    assert.equal(C.caminos, motor.enumerarCaminos({ m, n }).total);
    for (let y = 0; y <= n; y++) for (let x = 0; x <= m; x++) assert.equal(C.tabla[y][x], motor.combinatorio(x + y, x));
    sinChoques(C, C.caminos, `caminos ${m} × ${n}`);
    const cerrados = [];
    for (let q = 0; q < 3; q++) { const c = [ent(0, m), ent(0, n)]; if ((c[0] || c[1]) && !(c[0] === m && c[1] === n)) cerrados.push(c); }
    const Cc = motor.caminos({ m, n, cerrados });
    assert.equal(Cc.caminos, motor.enumerarCaminos({ m, n, cerrados }).total, 'con cruces cerrados');
    sinChoques(Cc, Cc.caminos, 'caminos cerrados');
    if (m >= 1 && n >= 1) {
      const x = ent(0, m), y = ent(0, n);
      if ((x || y) && !(x === m && y === n)) {
        const X = motor.cerrarCruce({ m, n, x, y });
        assert.equal(X.quedan, motor.caminos({ m, n, cerrados: [[x, y]] }).caminos);
        assert.equal(X.quedan, X.total - X.hasta * X.desde);
        sinChoques(X, X.quedan, 'cerrar');
      }
    }
  }
});
test('caminos en el espacio: la recurrencia de tres vecinos da el multinomial', () => {
  const fact = n => (n <= 1 ? 1 : n * fact(n - 1));
  for (let a = 0; a <= 3; a++) for (let b = 0; b <= 3; b++) for (let c = 0; c <= 3; c++) {
    if (a + b + c < 1) continue;
    const E = motor.caminosEspacio({ a, b, c });
    assert.equal(E.caminos, fact(a + b + c) / (fact(a) * fact(b) * fact(c)));
    if (c === 0) assert.equal(E.caminos, motor.caminos({ m: a, n: b }).caminos, 'con alto 0 es la cuadrícula plana');
    sinChoques(E, E.caminos, 'espacio');
  }
});
test('perímetro: escaleras y chakanas sin entrantes miden lo del rectángulo; un entrante suma sus dos paredes', () => {
  for (let k = 0; k < 200; k++) {
    const q = ent(1, 6), anchos = Array.from({ length: q }, () => ent(1, 5)), altos = Array.from({ length: q }, () => ent(1, 5));
    const E = motor.escalera({ anchos, altos }), P = motor.perimetro(E);
    const W = anchos.reduce((s, v) => s + v, 0), H = altos.reduce((s, v) => s + v, 0);
    assert.ok(P.sinEntrantes); cerca(P.perimetro, 2 * (W + H), 'escalera'); cerca(P.caja, P.perimetro, 'caja');
    cerca(P.horizontales, 2 * W, 'horizontales'); cerca(P.verticales, 2 * H, 'verticales');
    // el área es la suma de las columnas
    cerca(P.area, anchos.reduce((s, a, j) => s + a * altos.slice(j).reduce((t, v) => t + v, 0), 0), 'área');
    sinChoques(P, P.perimetro, 'escalera');
    // correr cada lado hasta su destino cubre el rectángulo justo una vez por lado
    for (const eje of ['h', 'v']) {
      const tot = P.lados.filter(l => l.eje === eje).reduce((s, l) => s + l.longitud, 0);
      cerca(tot, eje === 'h' ? 2 * P.ancho : 2 * P.alto, `lados ${eje}`);
    }
    const md = [], al = [];
    let a0 = 0, b0 = 20;
    for (let j = 0; j < q; j++) { a0 += ent(1, 3); b0 -= ent(1, 3); if (b0 <= 0) break; md.push(a0); al.push(b0); }
    if (md.length) {
      const C = motor.chakana({ medias: md, alturas: al }), PC = motor.perimetro(C);
      assert.ok(PC.sinEntrantes); cerca(PC.perimetro, PC.caja, 'chakana');
    }
    const ancho = ent(4, 12), alto = ent(3, 9), desde = ent(1, ancho - 3), hasta = ent(desde + 1, ancho - 1), e = ent(1, alto - 1);
    const M = motor.perimetro(motor.muesca({ ancho, alto, desde, hasta, profundidad: e }));
    assert.ok(!M.sinEntrantes); cerca(M.perimetro, 2 * (ancho + alto) + 2 * e, 'muesca'); cerca(M.exceso, 2 * e, 'exceso');
    sinChoques(M, M.perimetro, 'muesca');
  }
});
test('hormiga: no baja de la recta por dentro, no supera las aristas y coincide con una barrida de las seis parejas de caras', () => {
  for (let k = 0; k < 300; k++) {
    const x = ent(1, 12), y = ent(1, 12), z = ent(1, 12), H = motor.hormiga({ x, y, z });
    assert.ok(H.minimo > H.diagonal + 1e-9, 'más que la diagonal interior');
    assert.ok(H.minimo <= x + y + z + 1e-9, 'no más que las aristas');
    assert.ok(H.minimo <= H.errores.caraYArista + 1e-9 || H.coinciden.includes('caraYArista'), 'no más que cara y arista');
    // barrida: de A a un punto del borde común y de ahí a G, para las seis parejas de caras
    const P = 4000, d = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]), A = [0, 0, 0], G = [x, y, z];
    const bordes = [t => [t * x, 0, z], t => [x, 0, t * z], t => [x, t * y, 0], t => [0, t * y, z], t => [t * x, y, 0], t => [0, y, t * z]];
    let m = Infinity;
    for (const b of bordes) for (let i = 0; i <= P; i++) { const q = b(i / P); m = Math.min(m, d(A, q) + d(q, G)); }
    assert.ok(m >= H.minimo - 1e-9, 'nadie baja del mínimo');
    assert.ok(m <= H.minimo + 1e-3, 'la barrida llega al mínimo');
    for (const D of H.desarrollos) { const c = [D.cruce.x, D.cruce.y, D.cruce.z]; cerca(d(A, c) + d(c, G), D.longitud, `cruce de ${D.id}`); }
    sinChoques(H, H.minimo, 'hormiga');
  }
});
test('semicírculos: los chicos miden lo mismo que el grande', () => {
  for (let k = 0; k < 100; k++) {
    const D = ent(1, 40), n = ent(1, 12), S = motor.semicirculos({ diametro: D, partes: n });
    cerca(S.chicos, S.grande, 'iguales'); cerca(S.grande, Math.PI * D / 2, 'grande');
    sinChoques(S, S.chicos, 'semicírculos');
  }
});
test('las opciones de las predicciones de la escena son distintas entre sí y de la correcta', () => {
  const F = motor.figuras;
  const distintas = (xs, que) => assert.equal(new Set(xs.map(x => JSON.stringify(x))).size, xs.length, `${que}: ${JSON.stringify(xs)}`);
  const P1 = motor.compararFiguras([F.sobre, F.casita, F.ventanas]); distintas([P1.correcta, P1.errores.menosLineas, P1.errores.sinCruces, P1.errores.todas], 'paso 1');
  const P3 = motor.cartero(F.parque); distintas([P3.minimo, P3.errores.sinRepetir, P3.errores.cerrar, P3.errores.todoDoble], 'paso 3');
  const P4 = motor.perimetro(motor.escalera({ anchos: [3, 3, 2], altos: [2, 2, 2] })); distintas([P4.perimetro, P4.errores.soloConNumero, P4.errores.diagonal, P4.errores.area], 'paso 4');
  const P6 = motor.caminos({ m: 4, n: 3 }); distintas([P6.caminos, P6.errores.producto, P6.errores.aMano, P6.errores.potencia], 'paso 6');
  const P8 = motor.hormiga({ x: 8, y: 4, z: 2 }); distintas([P8.minimo, P8.errores.diagonalInterior, P8.errores.porAristas, P8.errores.caraYArista], 'paso 8');
  const E1 = motor.unTrazo(F.ventanal); distintas([E1.trazos, E1.errores.unoPorImpar, E1.errores.unSoloTrazo, E1.errores.dosSiempre], 'experimento 1');
  const E2 = motor.semicirculos({ diametro: 12, partes: 3 }); distintas([E2.chicos, E2.errores.cadaUnoComoElGrande, E2.errores.comoElArea, E2.errores.comoLaRecta], 'experimento 2');
  const E3 = motor.cerrarCruce({ m: 3, n: 3, x: 1, y: 1 }); distintas([E3.quedan, E3.errores.restarUno, E3.errores.restarHasta, E3.errores.sinCambio], 'experimento 3');
  const E4 = motor.hormiga({ x: 2, y: 2, z: 2 }); distintas([E4.minimo, E4.errores.diagonalInterior, E4.errores.porAristas, E4.errores.caraYArista], 'experimento 4');
  const E5 = motor.caminosEspacio({ a: 2, b: 2, c: 1 }); distintas([E5.caminos, E5.errores.producto, E5.errores.conOrden, E5.errores.potencia], 'experimento 5');
  // las longitudes del paso 3 y el perímetro del paso 4 son enteros
  for (const v of [P3.minimo, ...Object.values(P3.errores), P4.perimetro, ...Object.values(P4.errores)]) assert.ok(Number.isInteger(v), `entero: ${v}`);
});

// 3. Errores de entrada
test('errores de entrada', () => {
  const F = motor.figuras;
  assert.throws(() => motor.unTrazo({ nodos: [[0, 0]], tramos: [] }), /no tiene tramos/);
  assert.throws(() => motor.grados({ nodos: [[0, 0], [1, 0]], tramos: [[0, 0]] }), /distintos/);
  assert.throws(() => motor.grados({ nodos: [[0, 0], [1, 0]], tramos: [[0, 2]] }), /inválido/);
  assert.throws(() => motor.grados({ nodos: [], tramos: [] }), /nodos/);
  assert.throws(() => motor.grados(), /objeto/);
  assert.throws(() => motor.cartero({ nodos: [[0, 0], [1, 0], [2, 0], [3, 0]], tramos: [[0, 1], [2, 3]] }), /una sola pieza/);
  assert.throws(() => motor.compararFiguras([F.sobre, F.ventanas]), /exactamente una/);
  assert.throws(() => motor.compararFiguras([F.casita]), /2 a 4/);
  assert.throws(() => motor.revisarTrazo(F.casita, [0, 9]), /como mucho/);
  assert.throws(() => motor.perimetro({ vertices: [[0, 0], [2, 1], [2, 2], [0, 2]] }), /horizontal o vertical/);
  assert.throws(() => motor.perimetro({ vertices: [[0, 0], [0, 2], [2, 2], [2, 0]] }), /contrario/);
  assert.throws(() => motor.escalera({ anchos: [1, 2], altos: [1] }), /mismo largo/);
  assert.throws(() => motor.muesca({ ancho: 10, alto: 6, desde: 4, hasta: 11, profundidad: 3 }), /dentro del lado/);
  assert.throws(() => motor.muesca({ ancho: 10, alto: 6, desde: 4, hasta: 7, profundidad: 6 }), /menor que el alto/);
  assert.throws(() => motor.chakana({ medias: [2, 1], alturas: [3, 1] }), /crecer/);
  assert.throws(() => motor.caminos({ m: 3, n: 3, cerrados: [[0, 0]] }), /salida/);
  assert.throws(() => motor.caminos({ m: 3, n: 3, cerrados: [[4, 0]] }), /inválido/);
  assert.throws(() => motor.caminos({ m: 0, n: 0 }), /al menos una/);
  assert.throws(() => motor.cerrarCruce({ m: 3, n: 3, x: 3, y: 3 }), /salida/);
  assert.throws(() => motor.hormiga({ x: 0, y: 2, z: 2 }), /mayor que cero/);
  assert.throws(() => motor.semicirculos({ diametro: 12, partes: 1.5 }), /entero/);
  assert.throws(() => motor.combinatorio(3, 5), /mayor/);
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
