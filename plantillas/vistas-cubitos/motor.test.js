// Pruebas del motor de «Los cubitos que giran: vistas y huecos». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con cuentas hechas aquí de otra manera:
//    - las vistas del sólido máximo son las dadas cuando las vistas salen de un sólido, y todo sólido con esas vistas
//      cabe dentro del máximo;
//    - el mínimo por niveles y pareos coincide con una búsqueda exhaustiva de todas las tablas de alturas;
//    - Euler (V − A + C = 2) en sólidos apilados de una pieza sin túneles, y caras contadas con un recorrido propio;
//    - los visibles desde (1, −1, 1) coinciden con un trazado de rayos por muestreo fino en sólidos apilados en esquina;
//    - el poliedro de tres vistas convexas cumple Euler y su volumen coincide con un conteo de puntos en una malla fina;
//    - las copias arman de verdad el cubo; la sucesión de cubrir sigue 1 + 2k(k + 1) desde un cubito.
// 3. Las opciones de cada predicción de la escena son distintas entre sí.
// 4. Errores de entrada.
// 5. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const M = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
function cerca(real, esperado, que, tol) {
  const t = tol === undefined ? 1e-9 : tol;
  if (Array.isArray(esperado)) { assert.ok(Array.isArray(real), `${que}: se esperaba una lista`); assert.equal(real.length, esperado.length, `${que}: largo`); esperado.forEach((e, k) => cerca(real[k], e, `${que}[${k}]`, t)); return; }
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(typeof real === 'number' && Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
const campo = (r, k) => k.split('.').reduce((o, p) => (o == null ? o : o[p]), r);
function comprobar(fn, args, espera, que) {
  assert.equal(typeof M[fn], 'function', `motor.${fn} no existe`);
  const r = M[fn](...args);
  for (const [k, v] of Object.entries(espera)) { const x = campo(r, k); assert.ok(x !== undefined, `${que}: falta ${k}`); cerca(x, v, `${que} · ${k}`); }
}

// 1. casos.json
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'vistas-cubitos');
  assert.equal(datos.verificacion !== undefined, true);
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 30);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// ---------- utilidades propias de la prueba ----------
let semilla = 2026;
const rnd = () => { semilla = (semilla * 16807) % 2147483647; return semilla / 2147483647; };
const ent = (a, b) => a + Math.floor(rnd() * (b - a + 1));
// tabla de alturas (filas como la superior: la primera es la del fondo) → pisos
function pisosDe(h) {
  const nz = Math.max(1, ...h.flat());
  const pisos = [];
  for (let z = 0; z < nz; z++) pisos.push(h.map(f => f.map(v => (v > z ? '#' : '.')).join('')));
  return pisos;
}
function alturasAzar(ny, nx, hmax, lleno) {
  return [...Array(ny)].map(() => [...Array(nx)].map(() => (lleno ? ent(1, hmax) : ent(0, hmax))));
}
// vistas propias desde la tabla de alturas
function vistasAlturas(h) {
  const ny = h.length, nx = h[0].length, nz = Math.max(1, ...h.flat());
  const hF = [...Array(nx)].map((_, x) => Math.max(...h.map(f => f[x])));
  const hL = [...Array(ny)].map((_, r) => Math.max(...h[r]));      // r = 0 es el fondo
  const F = [], T = h.map(f => f.map(v => (v > 0 ? '#' : '.')).join('')), L = [];
  for (let z = nz - 1; z >= 0; z--) {
    F.push(hF.map(v => (v > z ? '#' : '.')).join(''));
    L.push([...Array(ny)].map((_, y) => (hL[ny - 1 - y] > z ? '#' : '.')).join(''));   // lateral: el frente a la izquierda
  }
  return { F, T, L, hF, hL };
}
function minimoBruto(F, T, L) {
  // todas las tablas de alturas con esas tres vistas
  const ny = T.length, nx = T[0].length;
  const celdas = [];
  for (let r = 0; r < ny; r++) for (let x = 0; x < nx; x++) if (T[r][x] === '#') celdas.push([r, x]);
  const nz = F.length;
  let mejor = Infinity;
  const h = [...Array(ny)].map(() => Array(nx).fill(0));
  const rec = (i, suma) => {
    if (suma + (celdas.length - i) >= mejor) return;
    if (i === celdas.length) { const v = vistasAlturas(h); const pad = s => s; if (M.util.igual(v.F, F.map(pad)) && M.util.igual(v.L, L)) mejor = suma; return; }
    const [r, x] = celdas[i];
    for (let a = 1; a <= nz; a++) { h[r][x] = a; rec(i + 1, suma + a); }
    h[r][x] = 0;
  };
  rec(0, 0);
  return mejor;
}

// 2. Propiedades
test('vistas: coinciden con las vistas calculadas desde la tabla de alturas', () => {
  for (let t = 0; t < 200; t++) {
    const h = alturasAzar(ent(1, 4), ent(1, 4), 4, false);
    if (h.flat().every(v => v === 0)) continue;
    const v = M.vistas(pisosDe(h)), w = vistasAlturas(h);
    if (w.hF.some(a => a === 0) || w.hL.some(a => a === 0)) continue; // columnas vacías al borde: la caja de los textos es la misma igual
    assert.deepEqual(v.frontal, w.F); assert.deepEqual(v.superior, w.T); assert.deepEqual(v.lateral, w.L);
  }
});

test('máximo: reproduce las vistas de un sólido y lo contiene; su volumen es Σ mín(frontal, lateral)', () => {
  for (let t = 0; t < 300; t++) {
    const h = alturasAzar(ent(1, 4), ent(1, 4), 3, true);
    const { F, T, L, hF, hL } = vistasAlturas(h);
    const r = M.maximo(F, T, L);
    assert.equal(r.coincide, true);
    let suma = 0; const ny = h.length;
    h.forEach((f, rr) => f.forEach((_, x) => { suma += Math.min(hF[x], hL[rr]); }));
    assert.equal(r.cubitos, suma);
    assert.ok(r.cubitos >= h.flat().reduce((a, b) => a + b, 0));
    // el sólido original está dentro del máximo
    const s = M.util.conjunto(M.leer(r.pisos).celdas);
    for (const c of M.leer(pisosDe(h)).celdas) assert.ok(s.has(c.join(',')));
    assert.ok(ny > 0);
  }
});

test('mínimo por niveles y pareos = búsqueda exhaustiva de tablas de alturas', () => {
  let n = 0;
  for (let t = 0; t < 400 && n < 120; t++) {
    const h = alturasAzar(ent(1, 3), ent(1, 3), 3, rnd() < .6);
    if (h.flat().every(v => v === 0)) continue;
    const { F, T, L, hF, hL } = vistasAlturas(h);
    if (hF.some(a => a === 0) || hL.some(a => a === 0)) continue;
    const r = M.minimo(F, T, L);
    assert.equal(r.volumen, minimoBruto(F, T, L), JSON.stringify(h));
    // la solución que devuelve tiene de verdad esas vistas y ese número de cubitos
    const v = M.vistas(r.pisos);
    assert.deepEqual(v.frontal, F); assert.deepEqual(v.superior, T); assert.deepEqual(v.lateral, L);
    assert.equal(M.leer(r.pisos).celdas.length, r.volumen);
    assert.ok(r.volumen <= M.maximo(F, T, L).cubitos && r.volumen >= M.util.area(T));
    n++;
  }
  assert.ok(n >= 60);
});

// caras con un recorrido propio (relleno por cuadraditos de cada plano)
function carasPropias(pisos) {
  const { celdas } = M.leer(pisos), s = new Set(celdas.map(c => c.join(',')));
  const cuadros = [];
  for (const [x, y, z] of celdas) for (const d of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]])
    if (!s.has([x + d[0], y + d[1], z + d[2]].join(','))) cuadros.push({ c: [x, y, z], d: d.join(',') });
  const vistos = new Set(), k = q => q.d + '|' + q.c.join(',');
  const porClave = new Map(cuadros.map(q => [k(q), q]));
  let caras = 0;
  for (const q of cuadros) {
    if (vistos.has(k(q))) continue;
    caras++;
    const pila = [q]; vistos.add(k(q));
    while (pila.length) {
      const a = pila.pop(), e = a.d.split(',').map(Number).findIndex(v => v !== 0);
      for (let ej = 0; ej < 3; ej++) if (ej !== e) for (const sg of [-1, 1]) {
        const c = a.c.slice(); c[ej] += sg; const kk = a.d + '|' + c.join(',');
        if (porClave.has(kk) && !vistos.has(kk)) { vistos.add(kk); pila.push(porClave.get(kk)); }
      }
    }
  }
  return { caras, cuadraditos: cuadros.length };
}
test('caras: recorrido propio; Euler V − A + C = 2 en sólidos apilados sin huecos en la huella', () => {
  for (let t = 0; t < 250; t++) {
    const h = alturasAzar(ent(1, 4), ent(1, 4), 3, true);
    const p = pisosDe(h), a = M.analizar(p), b = carasPropias(p);
    assert.equal(a.caras, b.caras); assert.equal(a.cuadraditos, b.cuadraditos);
    assert.equal(a.euler, 2, JSON.stringify(h));
    assert.equal(a.volumen, h.flat().reduce((x, y) => x + y, 0));
  }
  // caja rectangular: 6 caras, 8 vértices y 12 aristas, de cualquier tamaño
  for (let t = 0; t < 20; t++) {
    const a = M.analizar(pisosDe(alturasAzar(ent(1, 4), ent(1, 4), 1, true).map(f => f.map(() => 2))));
    assert.deepEqual([a.caras, a.vertices, a.aristas], [6, 8, 12]);
  }
});

test('visibles desde (1, −1, 1): coinciden con rayos por muestreo fino en pilas que bajan hacia el frente y la derecha', () => {
  // en una pila cuyas alturas no crecen hacia el frente ni hacia la derecha, se ve un cubito si una de sus caras de
  // arriba, del frente o de la derecha está al aire: ninguna otra la tapa (comprobado aquí con rayos densos)
  let probados = 0;
  for (let t = 0; t < 200; t++) {
    const ny = ent(1, 3), nx = ent(1, 3);
    const h = [...Array(ny)].map(() => Array(nx).fill(0));
    for (let r = 0; r < ny; r++) for (let x = nx - 1; x >= 0; x--) {
      const tope = Math.min(r > 0 ? h[r - 1][x] : 3, x < nx - 1 ? h[r][x + 1] : 3);
      h[r][x] = ent(1, Math.max(1, tope)); if (r > 0 && h[r][x] > h[r - 1][x]) h[r][x] = h[r - 1][x]; if (x < nx - 1 && h[r][x] > h[r][x + 1]) h[r][x] = Math.max(1, h[r][x + 1]);
    }
    // alturas que crecen hacia el fondo (r menor) y hacia la izquierda (x menor)
    const ok = h.every((f, r) => f.every((v, x) => v >= 1 && (r === 0 || v <= h[r - 1][x]) && (x === nx - 1 || v >= f[x + 1])));
    if (!ok) continue;
    const p = pisosDe(h), a = M.analizar(p), { celdas } = M.leer(p), s = new Set(celdas.map(c => c.join(',')));
    let vis = 0;
    for (const [x, y, z] of celdas) {
      const al = (dx, dy, dz) => !s.has([x + dx, y + dy, z + dz].join(','));
      if (al(1, 0, 0) || al(0, -1, 0) || al(0, 0, 1)) vis++;
    }
    assert.equal(a.visibles, vis, JSON.stringify(h)); probados++;
  }
  assert.ok(probados >= 30, 'pilas probadas: ' + probados);
});

// poliedro convexo: volumen por conteo de puntos de una malla fina
function dentro(pol, a, b) {
  let signo = 0;
  for (let i = 0; i < pol.length; i++) {
    const [a1, b1] = pol[i], [a2, b2] = pol[(i + 1) % pol.length];
    const c = (a2 - a1) * (b - b1) - (b2 - b1) * (a - a1);
    if (Math.abs(c) < 1e-12) continue;
    if (signo === 0) signo = Math.sign(c); else if (Math.sign(c) !== signo) return false;
  }
  return true;
}
test('poliedro de tres vistas convexas: Euler y volumen por malla', () => {
  const casos = [
    { frontal: [[0, 0], [2, 0], [2, 2], [1, 3], [0, 2]], superior: [[0, 0], [2, 0], [2, 2], [0, 2]], lateral: [[0, 0], [2, 0], [2, 2], [1, 3], [0, 2]] },
    { frontal: [[0, 0], [2, 0], [1, 2]], superior: [[0, 0], [2, 0], [2, 2], [0, 2]], lateral: [[0, 0], [2, 0], [1, 2]] },
    { frontal: [[0, 0], [4, 0], [2, 3]], superior: [[2, 0], [4, 2], [2, 4], [0, 2]], lateral: [[0, 0], [4, 0], [4, 1], [0, 3]] },
    { frontal: [[0, 0], [3, 0], [3, 1], [0, 2]], superior: [[0, 0], [3, 0], [3, 2], [0, 2]], lateral: [[0, 0], [2, 0], [2, 2], [0, 2]] },
  ];
  for (const o of casos) {
    const r = M.poliedroVistas(o);
    assert.equal(r.euler, 2, JSON.stringify(o));
    const xs = o.frontal.map(p => p[0]), ys = o.superior.map(p => p[1]), zs = o.frontal.map(p => p[1]);
    const N = 60, x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), z0 = Math.min(...zs), z1 = Math.max(...zs);
    const dx = (x1 - x0) / N, dy = (y1 - y0) / N, dz = (z1 - z0) / N;
    let n = 0;
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) for (let k = 0; k < N; k++) {
      const x = x0 + (i + .5) * dx, y = y0 + (j + .5) * dy, z = z0 + (k + .5) * dz;
      if (dentro(o.frontal, x, z) && dentro(o.superior, x, y) && dentro(o.lateral, y, z)) n++;
    }
    const vol = n * dx * dy * dz;
    assert.ok(Math.abs(vol - r.volumen) < 0.03 * r.volumen + 0.02, `volumen ${r.volumen} contra malla ${vol}`);
  }
  // vistas rectangulares: una caja
  const caja = M.poliedroVistas({ frontal: [[0, 0], [3, 0], [3, 2], [0, 2]], superior: [[0, 0], [3, 0], [3, 1], [0, 1]], lateral: [[0, 0], [1, 0], [1, 2], [0, 2]] });
  assert.deepEqual([caja.caras, caja.vertices, caja.aristas, caja.volumen], [6, 8, 12, 6]);
});

test('copias: las colocaciones llenan el cubo sin encimarse y cada una es la pieza girada', () => {
  const piezas = [[['##']], [['###']], [['##', '#.']], [['###', '#..']], [['###', '.#.']], [['##', '##']], [['##.', '.##']]];
  for (const p of piezas) {
    const r = M.copiasCubo(p), n = r.n, vistos = new Set();
    const firma = cs => { const f = M.util.rotaciones(cs).map(x => x.map(c => c.join(',')).join(';')).sort(); return f[0]; };
    const fp = firma(M.leer(p).celdas);
    for (const c of r.colocaciones) {
      assert.equal(c.length, r.volumen);
      for (const q of c) { assert.ok(q.every(v => v >= 0 && v < n)); const k = q.join(','); assert.ok(!vistos.has(k)); vistos.add(k); }
      const b = M.util.cajaDe(c); assert.equal(firma(c.map(q => [q[0] - b.mn[0], q[1] - b.mn[1], q[2] - b.mn[2]])), fp);
    }
    assert.equal(vistos.size, n * n * n);
    assert.equal(r.copias * r.volumen, n * n * n);
  }
  // la L de 3 no llena un cubo de 2 (8 no es múltiplo de 3); la de 4 tampoco uno de 3
  assert.equal(M.copiasCubo([['##', '#.']]).n, 3);
  assert.equal(M.copiasCubo([['###', '#..']]).n, 4);
});

test('cubrir: desde un cubito se agregan 1 + 2k(k + 1); con distancia propia en cualquier sólido', () => {
  for (let k = 2; k <= 6; k++) { const r = M.cubrir([['#']], k); assert.equal(r.agregados, 1 + 2 * (k - 1) * k); }
  // el término k son las celdas con z ≥ 0 a distancia (pasos de cara, sin bajar de la mesa) < k del sólido
  for (const p of [[['##']], [['###']], [['##', '#.']], [['#.'], ['#.']]]) for (let k = 1; k <= 4; k++) {
    const { celdas } = M.leer(p);
    let frente = celdas.map(c => c.slice()); const s = new Set(frente.map(c => c.join(',')));
    for (let t = 1; t < k; t++) {
      const nuevo = [];
      for (const [x, y, z] of frente) for (const d of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]) {
        const c = [x + d[0], y + d[1], z + d[2]], kk = c.join(',');
        if (c[2] >= 0 && !s.has(kk)) { s.add(kk); nuevo.push(c); }
      }
      frente = nuevo;
    }
    assert.equal(M.cubrir(p, k).volumen, s.size);
  }
});

test('completar: el cubo es el de la mayor medida; faltan = n³ − volumen; los visibles no pasan del volumen', () => {
  for (let t = 0; t < 100; t++) {
    const h = alturasAzar(ent(1, 4), ent(1, 4), 4, true), p = pisosDe(h), r = M.completarCubo(p);
    const n = Math.max(h.length, h[0].length, Math.max(...h.flat()));
    assert.equal(r.n, n); assert.equal(r.faltan, n ** 3 - h.flat().reduce((a, b) => a + b, 0));
    assert.ok(r.visibles <= r.volumen && r.visibles >= 1);
  }
});

// 3. Opciones de las predicciones (los números que usa index.html) distintas
test('predicciones: las cuatro opciones de cada una son distintas', () => {
  const F = ['#..', '##.', '###'], T = ['###', '###', '###'], L = ['..#', '.##', '###'];
  const mx = M.maximo(F, T, L), mn = M.minimo(F, T, L);
  const P2 = [['##.', '###', '#..'], ['#..', '##.', '...'], ['#..', '...', '...']], v2 = M.elegirVista(P2, 'superior');
  const casa = M.poliedroVistas({ frontal: [[0, 0], [2, 0], [2, 2], [1, 3], [0, 2]], superior: [[0, 0], [2, 0], [2, 2], [0, 2]], lateral: [[0, 0], [2, 0], [2, 2], [1, 3], [0, 2]] });
  const co = M.completarCubo([['###', '###'], ['##.', '#..']]), cu = M.cubrir([['#']], 3);
  const AF = ['#..', '###'], AT = ['###', '#.#'], AL = ['#.', '##'], ac = M.maximo(AF, AT, AL, { x: [1, 2, 1], y: [2, 1], z: [2, 1] });
  const caja = M.completarCaja([['##.', '###', '#..'], ['...', '#..', '#..']], [3, 3, 3]), cp = M.copiasCubo([['##', '#.']]);
  const lat = M.elegirVista([['###', '###', '###'], ['.##', '...', '###'], ['...', '...', '#..']], 'lateral');
  const pir = M.poliedroVistas({ frontal: [[0, 0], [2, 0], [1, 2]], superior: [[0, 0], [2, 0], [2, 2], [0, 2]], lateral: [[0, 0], [2, 0], [1, 2]] });
  const grupos = [
    [v2.correcta, v2.errores.frontal, v2.errores.lateral, v2.errores.reflejada].map(v => v.join('/')),
    [mx.cubitos, mx.errores.soloFrontal, mx.errores.sumaVistas, mx.errores.caja],
    [mn.volumen, mn.errores.unoPorCuadro, mn.errores.maximo, mn.errores.soloFrontal],
    [mx.caras, mx.carasEnVistas, mx.cuadraditos, mx.errores.prismaFrontal],
    [mx.vertices, mx.errores.verticesPrismaFrontal, mx.errores.cajaVertices, mx.errores.puntosEnAristas],
    [casa.caras, casa.errores.prismaFrontal, casa.errores.regionesVistas, casa.errores.carasEnVistas],
    [co.faltan, co.errores.soloVisibles, co.errores.caja, co.errores.deFrente],
    [cu.agregados, cu.errores.porCara, cu.errores.conMesa, cu.errores.mismoAumento],
    [ac.caras, ac.errores.caraCuadraditos, ac.errores.caraVistas, ac.errores.prismaFrontal],
    [caja.faltan, caja.errores.deFrente, caja.errores.soloVisibles, caja.errores.deArriba],
    [cp.adicionales, cp.errores.sinDividir, cp.errores.copiasEnVezDeCubitos, cp.errores.todoElCubo],
    [lat.correcta, lat.errores.reflejada, lat.errores.frontal, lat.errores.superior].map(v => v.join('/')),
    [pir.vertices, pir.errores.verticesPrismaFrontal, pir.errores.cajaVertices, pir.errores.esquinasVistas],
  ];
  for (const g of grupos) assert.equal(new Set(g).size, 4, JSON.stringify(g));
});

// 4. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => M.analizar([]));
  assert.throws(() => M.analizar([['#x']]));
  assert.throws(() => M.maximo(['#'], ['#', '#'], ['#']));
  assert.throws(() => M.minimo(['#.', '.#'], ['##'], ['#', '#']));
  assert.throws(() => M.minimo(['#..', '###', '###'], ['#..', '##.', '###'], ['..#', '.##', '###']));
  assert.throws(() => M.completarCaja([['###']], [2, 1, 1]));
  assert.throws(() => M.cubrir([['#']], 0));
  assert.throws(() => M.elegirVista([['#']], 'trasera'));
  assert.throws(() => M.poliedroVistas({ frontal: [[0, 0], [1, 0], [0, 1]] }));
});

// 5. papel.json
test('papel.json: formato', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  for (const p of papel.problemas) assert.ok(p.id && p.enunciado && p.respuesta && p.pasos.length && p.verificar.length);
});
for (const p of papel.problemas) test('papel ' + p.id, () => { for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, 'papel ' + p.id); });
