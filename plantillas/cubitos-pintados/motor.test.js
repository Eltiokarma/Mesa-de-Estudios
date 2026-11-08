// Pruebas del motor de «El cubo que se pinta y se perfora». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con sólidos al azar (semilla fija), contra cuentas hechas de otra manera:
//    - pintado: las fórmulas del cubo y del bloque; Σ cuenta = N; Σ j·n_j = caras; 6N = expuestas + 2·(pares pegados);
//      pintar de más nunca baja una cuenta de caras;
//    - agujereado: inclusión-exclusión completa; quedan + quitados = n³; sin cruces, sinCruces coincide;
//    - barras: caras = 2·Σ largos; atravesados por inclusión-exclusión;
//    - sucesion: las fórmulas cerradas de la escalera, la pirámide y la fila;
//    - diseccion: el plan arma el cubo sin huecos ni encimes, y cada etapa duplica las piezas;
//    - mayorCubo: búsqueda propia con todas las cantidades posibles de bloques grandes;
//    - NINGÚN ERROR COINCIDE CON LA RESPUESTA (los que coinciden van a 'coinciden') ni repite a otro.
// 3. Las predicciones de la escena: las cuatro opciones de cada una son distintas.
// 4. Errores de entrada.
// 5. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const M = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
const campo = (r, k) => (k === '' ? r : k.split('.').reduce((o, p) => (o == null ? o : o[p]), r));
function comprobar(fn, args, espera, que) {
  assert.equal(typeof M[fn], 'function', `motor.${fn} no existe`);
  const r = M[fn](...args);
  for (const [k, v] of Object.entries(espera)) {
    const x = campo(r, k);
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    assert.deepEqual(x, v, `${que} · ${k}`);
  }
}

// 1. casos.json
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'cubitos-pintados');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 25, `hay ${datos.casos.length} casos`);
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
const N = 250;

// Ningún error coincide con la respuesta ni repite a otro; los apartados sí.
function sinChoques(r, que) {
  for (const [k, g] of Object.entries(r.errores)) {
    const vals = Object.values(g);
    for (const [e, v] of Object.entries(g)) assert.notDeepEqual(v, r.respuestas[k], `${que}: el error ${k}.${e} (${v}) coincide con la respuesta`);
    assert.equal(new Set(vals.map(String)).size, vals.length, `${que}: errores repetidos en ${k}`);
    for (const e of r.coinciden[k] || []) assert.ok(!(e in g));
    for (const e of Object.keys(r.repetidos[k] || {})) assert.ok(!(e in g) && g[r.repetidos[k][e]] !== undefined);
  }
}
const SIN = ['mesa', 'atras', 'frente', 'izquierda', 'derecha'];
function sinAzar() { return SIN.filter(() => rnd() < 0.35); }
function alturasAzar() {
  const f = ent(1, 3), c = ent(1, 4);
  const a = Array.from({ length: f }, () => Array.from({ length: c }, () => ent(0, 3)));
  a[0][0] = Math.max(1, a[0][0]);
  return a;
}
// pares de cubitos pegados (contados de otra manera: por cada celda, solo hacia +x, +y, +z)
function pegados(celdas) {
  const S = new Set(celdas.map(c => c.join(',')));
  let p = 0;
  for (const [x, y, z] of celdas) for (const d of [[1, 0, 0], [0, 1, 0], [0, 0, 1]]) if (S.has([x + d[0], y + d[1], z + d[2]].join(','))) p++;
  return p;
}

test('pintado: fórmulas del cubo n × n × n y del bloque a × b × c pintados enteros', () => {
  for (let n = 2; n <= 9; n++) {
    const r = M.pintado({ dims: [n, n, n] });
    assert.deepEqual(r.cuenta, [(n - 2) ** 3, 6 * (n - 2) ** 2, 12 * (n - 2), 8, 0, 0, 0], `n = ${n}`);
    assert.equal(r.caras, 6 * n * n);
  }
  for (let k = 0; k < N; k++) {
    const a = ent(2, 8), b = ent(2, 8), c = ent(2, 8), r = M.pintado({ dims: [a, b, c] });
    assert.deepEqual(r.cuenta.slice(0, 4), [(a - 2) * (b - 2) * (c - 2), 2 * ((a - 2) * (b - 2) + (b - 2) * (c - 2) + (a - 2) * (c - 2)), 4 * (a + b + c - 6), 8]);
  }
  // sobre la mesa y contra la pared de atrás: ninguna cara pintada = (a − 2)(b − 1)(c − 1)
  for (let k = 0; k < N; k++) {
    const a = ent(2, 8), b = ent(2, 8), c = ent(2, 8);
    assert.equal(M.pintado({ dims: [a, b, c], sinPintar: ['mesa', 'atras'], k: 0 }).respuestas.k, (a - 2) * (b - 1) * (c - 1));
    assert.equal(M.pintado({ dims: [a, b, c], sinPintar: ['mesa', 'atras', 'izquierda'], k: 0 }).respuestas.k, (a - 1) * (b - 1) * (c - 1));
  }
});

test('pintado: Σ cuenta = N, Σ j·n_j = caras, 6N = expuestas + 2·pegados; sin choques entre errores', () => {
  for (let k = 0; k < N; k++) {
    const spec = rnd() < 0.5 ? { dims: [ent(1, 5), ent(1, 5), ent(1, 5)] } : { alturas: alturasAzar() };
    const sin = sinAzar(), kk = ent(0, 6);
    let r; try { r = M.pintado(Object.assign({ sinPintar: sin, k: kk }, spec)); } catch (e) { continue; }
    const n = r.cubitos;
    assert.equal(r.cuenta.reduce((s, v) => s + v, 0), n);
    assert.equal(r.cuenta.reduce((s, v, j) => s + j * v, 0), r.caras);
    assert.equal(r.pintadas.reduce((s, v) => s + v, 0), r.caras);
    r.porCara.forEach((f, i) => { assert.equal(f.filter(v => v === 1).length, r.pintadas[i]); assert.equal(f.filter(v => v > 0).length + f.filter(v => v === 0).length, 6); });
    assert.equal(r.porCara.flat().filter(v => v > 0).length, r.expuestas);
    assert.equal(6 * n, r.expuestas + 2 * pegados(r.celdas));
    assert.equal(r.porPiso.reduce((s, p) => s + p.cuenta.reduce((a, b) => a + b, 0), 0), n);
    const todo = M.pintado(Object.assign({ k: kk }, spec));
    assert.ok(todo.caras >= r.caras, 'pintar sin apoyos no baja las caras');
    assert.equal(todo.caras, r.expuestas);
    sinChoques(r, JSON.stringify(spec) + sin);
  }
});

test('agujereado: inclusión-exclusión completa; quedan + quitados = n³', () => {
  for (let k = 0; k < N; k++) {
    const n = ent(2, 6), T = ent(0, 6), tun = [], vistos = new Set();
    for (let j = 0; j < T; j++) { const t = { eje: 'xyz'[ent(0, 2)], en: [ent(0, n - 1), ent(0, n - 1)] }; const c = t.eje + t.en; if (!vistos.has(c)) { vistos.add(c); tun.push(t); } }
    const r = M.agujereado({ n, tuneles: tun, masa: ent(1, 9) });
    // cada celda: ¿está en algún túnel? (contado celda por celda)
    let q = 0;
    for (let x = 0; x < n; x++) for (let y = 0; y < n; y++) for (let z = 0; z < n; z++)
      if (tun.some(t => (t.eje === 'x' && t.en[0] === y && t.en[1] === z) || (t.eje === 'y' && t.en[0] === x && t.en[1] === z) || (t.eje === 'z' && t.en[0] === x && t.en[1] === y))) q++;
    assert.equal(r.quitados, q);
    assert.equal(r.quedan + r.quitados, n ** 3);
    assert.equal(r.quedanCeldas.length, r.quedan);
    assert.equal(r.cruceCeldas.length, r.cruces);
    if (r.cruces === 0 && tun.length) assert.ok(r.coinciden.quedan.includes('sinCruces'));
    if (r.triples === 0 && tun.length) assert.ok(r.coinciden.quedan.includes('parejas'));
    sinChoques(r, `n ${n} ${JSON.stringify(tun)}`);
  }
});

test('barras: caras = 2·Σ largos; atravesados = la unión de las filas', () => {
  for (let k = 0; k < N; k++) {
    const dims = [ent(1, 5), ent(1, 5), ent(1, 5)], B = ent(1, 5), bs = [], vistos = new Set();
    for (let j = 0; j < B; j++) {
      const e = ent(0, 2), otros = [0, 1, 2].filter(i => i !== e), t = { eje: 'xyz'[e], en: otros.map(i => ent(0, dims[i] - 1)) };
      const c = t.eje + t.en; if (!vistos.has(c)) { vistos.add(c); bs.push(t); }
    }
    const r = M.barras({ dims, barras: bs });
    assert.equal(r.caras, 2 * r.largos.reduce((s, v) => s + v, 0));
    assert.equal(r.atravesados, r.celdas.length);
    assert.equal(r.perforadas.reduce((s, p) => s + p.length, 0), r.caras, 'las caras perforadas, cubito por cubito');
    assert.equal(r.atravesados + r.libres, dims[0] * dims[1] * dims[2]);
    assert.ok(r.atravesados <= r.largos.reduce((s, v) => s + v, 0));
    sinChoques(r, JSON.stringify(bs));
  }
});

test('sucesion: escalera n² + 4n (con base n² + 5n), pirámide 3n² + 2n (4n² + 2n), fila 3n + 2 (4n + 2)', () => {
  for (let n = 1; n <= 25; n++) {
    assert.equal(M.sucesion({ tipo: 'escalera', n }).area, n * n + 4 * n);
    assert.equal(M.sucesion({ tipo: 'escalera', n, base: true }).area, n * n + 5 * n);
    assert.equal(M.sucesion({ tipo: 'escalera', n }).cubitos, n * (n + 1) / 2);
    assert.equal(M.sucesion({ tipo: 'fila', n }).area, 3 * n + 2);
    assert.equal(M.sucesion({ tipo: 'fila', n, base: true }).area, 4 * n + 2);
    if (n <= 15) {
      assert.equal(M.sucesion({ tipo: 'piramide', n }).area, 3 * n * n + 2 * n);
      assert.equal(M.sucesion({ tipo: 'piramide', n, base: true }).area, 4 * n * n + 2 * n);
    }
    for (const tipo of ['escalera', 'piramide', 'fila']) if (n >= 3 && n <= 15) { const r = M.sucesion({ tipo, n, base: rnd() < .5, desde: 1 }); sinChoques(r, tipo + n); }
  }
});

test('diseccion: el plan arma el cubo sin huecos ni encimes y cada etapa duplica las piezas', () => {
  const ejemplos = [[32, 2, 1], [2, 2, 16], [1, 4, 16], [2, 4, 8], [1, 1, 64], [16, 1, 4], [3, 3, 3], [2, 1, 32], [1, 8, 64]];
  for (const dims of ejemplos) {
    const r = M.diseccion({ dims });
    assert.equal(r.lado ** 3, dims[0] * dims[1] * dims[2]);
    assert.equal(r.cortes, r.piezas === 1 ? 0 : Math.ceil(Math.log2(r.piezas) - 1e-12));
    assert.ok(2 ** r.cortes >= r.piezas && (r.cortes === 0 || 2 ** (r.cortes - 1) < r.piezas), 'el mínimo: cada corte a lo más duplica');
    assert.equal(r.plan.length, r.cortes + 1);
    r.plan.forEach((e, j) => assert.equal(e.length, 2 ** j));
    const ult = r.plan[r.plan.length - 1], S = new Set();
    for (const c of ult) for (let x = 0; x < c.d[0]; x++) for (let y = 0; y < c.d[1]; y++) for (let z = 0; z < c.d[2]; z++) {
      const p = [c.o[0] + x, c.o[1] + y, c.o[2] + z];
      assert.ok(p.every(v => v >= 0 && v < r.lado), `${dims}: pieza fuera del cubo`);
      const k = p.join(','); assert.ok(!S.has(k), `${dims}: piezas encimadas`); S.add(k);
    }
    assert.equal(S.size, r.lado ** 3, `${dims}: el cubo queda lleno`);
    sinChoques(r, String(dims));
  }
  assert.equal(M.diseccion({ dims: [1, 1, 27] }).plan, null, 'sin plan si k no es potencia de 2');
});

test('mayorCubo: búsqueda propia probando todas las cantidades de bloques grandes', () => {
  for (let k = 0; k < N; k++) {
    const g = ent(2, 3), G = ent(0, 12), C = ent(0, 130);
    const r = M.mayorCubo({ g, grandes: G, chicos: C });
    const puede = L => { for (let b = 0; b <= Math.min(G, Math.floor(L / g) ** 3); b++) { const ch = L ** 3 - b * g ** 3; if (ch >= 0 && ch <= C) return true; } return false; };
    let L = 0; for (let l = 1; l ** 3 <= C + G * g ** 3; l++) if (puede(l)) L = l;
    assert.equal(r.lado, L, `g ${g}, ${G} grandes, ${C} chicos`);
    assert.equal(r.usaGrandes * g ** 3 + r.usaChicos, L ** 3);
    assert.ok(r.usaChicos <= C && r.usaGrandes <= G);
    // usar los más grandes posibles da el menor número de bloques
    let menor = Infinity;
    for (let b = 0; b <= Math.min(G, Math.floor(L / g) ** 3); b++) { const ch = L ** 3 - b * g ** 3; if (ch >= 0 && ch <= C) menor = Math.min(menor, b + ch); }
    assert.equal(r.bloques, L ? menor : 0);
    sinChoques(r, `${g} ${G} ${C}`);
  }
});

// 3. Las predicciones de la escena (las mismas que usa index.html): cuatro opciones distintas
test('predicciones de la escena: opciones distintas', () => {
  const P = [
    (r => [r.respuestas.k, r.errores.k.yLaSiguiente, r.errores.k.restaUna, r.errores.k.sinRestar])(M.pintado({ dims: [4, 4, 4], k: 2 })),
    (r => [r.respuestas.k, r.errores.k.conTodas, r.errores.k.olvidaMesa, r.errores.k.olvidaPared])(M.pintado({ dims: [5, 4, 3], sinPintar: ['mesa', 'atras'], k: 0 })),
    (r => [r.respuestas.caras, r.errores.caras.pegadas, r.errores.caras.conTodas, r.errores.caras.todas])(M.pintado({ alturas: [[3, 2, 1], [2, 2, 1], [1, 1, 1]], sinPintar: ['mesa'] })),
    (r => [r.respuestas.quedan, r.errores.quedan.sinCruces, r.errores.quedan.parejas, r.errores.quedan.soloVisibles])(M.agujereado({ n: 5, tuneles: [{ eje: 'x', en: [2, 2] }, { eje: 'y', en: [2, 2] }, { eje: 'z', en: [2, 2] }] })),
    (r => [r.respuestas.caras, r.errores.caras.cubos, r.errores.caras.paredes, r.errores.caras.cruceDos])(M.barras({ dims: [4, 3, 3], barras: [{ eje: 'x', en: [1, 1] }, { eje: 'y', en: [1, 1] }, { eje: 'z', en: [1, 1] }] })),
    (r => [r.respuestas.area, r.errores.area.otraBase, r.errores.area.lineal, r.errores.area.objetoEntero])(M.sucesion({ tipo: 'escalera', n: 20, desde: 10 })),
    (r => [r.respuestas.k, r.errores.k.conTodas, r.errores.k.olvidaMesa, r.errores.k.olvidaPared])(M.pintado({ dims: [3, 3, 3], sinPintar: ['mesa', 'atras', 'izquierda'], k: 3 })),
    (r => [r.respuestas.k, r.errores.k.yLaSiguiente, r.errores.k.otra, r.errores.k.conTodas])(M.pintado({ alturas: [[3, 2, 2], [2, 1, 1], [1, 0, 0]], sinPintar: ['mesa'], k: 2 })),
    (r => [r.respuestas.peso, r.errores.peso.sinCruces, r.errores.peso.parejas, r.errores.peso.soloVisibles])(M.agujereado({ n: 4, masa: 5, tuneles: [{ eje: 'x', en: [1, 2] }, { eje: 'y', en: [1, 2] }, { eje: 'z', en: [1, 1] }, { eje: 'z', en: [2, 2] }] })),
    (r => [r.respuestas.cortes, r.errores.cortes.piezas, r.errores.cortes.sinApilar, r.errores.cortes.mitad])(M.diseccion({ dims: [32, 2, 1] })),
    (r => [r.respuestas.bloques, r.errores.bloques.porVolumen, r.errores.bloques.unidades, r.errores.bloques.soloChicos])(M.mayorCubo({ g: 3, grandes: 3, chicos: 60 })),
  ];
  P.forEach((o, j) => { assert.ok(o.every(Number.isFinite), `predicción ${j + 1}: ${o}`); assert.equal(new Set(o).size, 4, `predicción ${j + 1}: ${o}`); });
});

// 4. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => M.pintado({}));
  assert.throws(() => M.pintado({ dims: [2, 0, 2] }));
  assert.throws(() => M.pintado({ dims: [2, 2, 2], sinPintar: ['techo'] }));
  assert.throws(() => M.pintado({ dims: [2, 2, 2], k: 7 }));
  assert.throws(() => M.pintado({ celdas: [[0, 0, 0], [0, 0, 0]] }));
  assert.throws(() => M.pintado({ alturas: [[0, 0]] }));
  assert.throws(() => M.agujereado({ n: 3, tuneles: [{ eje: 'w', en: [0, 0] }] }));
  assert.throws(() => M.agujereado({ n: 3, tuneles: [{ eje: 'x', en: [3, 0] }] }));
  assert.throws(() => M.agujereado({ n: 3, tuneles: [{ eje: 'x', en: [1, 1] }, { eje: 'x', en: [1, 1] }] }));
  assert.throws(() => M.agujereado({ n: 3, masa: -1, tuneles: [] }));
  assert.throws(() => M.barras({ dims: [2, 2], barras: [] }));
  assert.throws(() => M.sucesion({ tipo: 'torre', n: 3 }));
  assert.throws(() => M.sucesion({ tipo: 'escalera', n: 7, desde: 2 }));
  assert.throws(() => M.diseccion({ dims: [2, 3, 4] }), /cubo perfecto/);
  assert.throws(() => M.diseccion({ dims: [8, 8, 1] }), /un lado mayor/);
  assert.throws(() => M.diseccion({ dims: [4, 9, 6] }), /dividir/);
  assert.throws(() => M.mayorCubo({ g: 1, grandes: 2, chicos: 3 }));
});

// 5. papel.json
const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
test('papel.json: formato', () => {
  assert.ok(papel.titulo && papel.indicacion && papel.problemas.length >= 5 && papel.problemas.length <= 10);
  for (const p of papel.problemas) assert.ok(p.id && p.enunciado && p.respuesta && p.pasos.length && p.verificar.length, p.id);
});
for (const p of papel.problemas) test(`papel ${p.id}`, () => { for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id); });
