// Pruebas de la mesa (mesa.js) y de las lentes (lentes.js) de la tabla viva.
const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('./mesa.js');
const L = require('./lentes.js');

const fila = (...zs) => ({ columnas: 4, celdas: [...zs, ...Array(8 + 4 - zs.length % 4).fill(null)].slice(0, Math.ceil(zs.length / 4) * 4 + 8) });
const llenas = m => m.celdas.filter(c => c !== null);

test('crear: mezcla con semilla, todas las cartas una vez, y dos filas libres al final', () => {
  const zs = Array.from({ length: 20 }, (_, i) => i + 1);
  const a = M.crear(zs, { columnas: 8, semilla: 7 }), b = M.crear(zs, { columnas: 8, semilla: 7 });
  assert.deepEqual(a, b);
  assert.notDeepEqual(llenas(a), zs);
  assert.deepEqual(llenas(a).slice().sort((x, y) => x - y), zs);
  assert.equal(M.filas(a), 3 + M.FILAS_LIBRES);
  assert.ok(a.celdas.slice(24).every(c => c === null));
  assert.throws(() => M.crear(zs, { columnas: 1 }));
});

test('mover a una celda vacía: la carta queda ahí y deja su hueco', () => {
  const m = fila(1, 2, 3, 4, 5);
  const r = M.mover(m, 2, 10);
  assert.equal(r.celdas[10], 2);
  assert.equal(r.celdas[1], null);
  assert.deepEqual(m.celdas.slice(0, 5), [1, 2, 3, 4, 5], 'no cambia la mesa de entrada');
});

test('soltar sobre otra carta: se mete y corre las de después hasta el primer hueco (como una lista)', () => {
  // [1 2 3 4 | 5 _ _ _]: el 5 sobre el 2 → [1 5 2 3 | 4 _ …]
  const r = M.mover(fila(1, 2, 3, 4, 5), 5, 1);
  assert.deepEqual(r.celdas.slice(0, 6), [1, 5, 2, 3, 4, null]);
  // Hacia adelante: el 1 sobre el 4 → el hueco del 1 no se cierra solo: [_ 2 3 1 | 4 5]
  const r2 = M.mover(fila(1, 2, 3, 4, 5), 1, 3);
  assert.deepEqual(r2.celdas.slice(0, 6), [null, 2, 3, 1, 4, 5]);
  // El corrimiento para en el primer hueco: [1 2 _ 4] y el 4 sobre el 1 → [4 1 2 _]
  const m = { columnas: 4, celdas: [1, 2, null, 4, null, null, null, null, null, null, null, null] };
  assert.deepEqual(M.mover(m, 4, 0).celdas.slice(0, 4), [4, 1, 2, null]);
});

test('mover nunca pierde ni repite cartas, y siempre deja filas libres', () => {
  let m = M.crear(Array.from({ length: 36 }, (_, i) => i + 1), { columnas: 8, semilla: 3 });
  const r = M.azar(11);
  for (let k = 0; k < 500; k++) {
    const zs = llenas(m);
    const z = zs[Math.floor(r() * zs.length)];
    m = M.mover(m, z, Math.floor(r() * m.celdas.length));
    assert.deepEqual(llenas(m).slice().sort((a, b) => a - b), Array.from({ length: 36 }, (_, i) => i + 1));
    assert.ok(m.celdas.slice(-M.FILAS_LIBRES * 8).every(c => c === null));
  }
  assert.throws(() => M.mover(m, 99, 0));
  assert.throws(() => M.mover(m, 1, -1));
});

test('reancho conserva el orden de lectura', () => {
  const m = M.crear([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], { columnas: 4, semilla: 2 });
  const r = M.reancho(m, 8);
  assert.deepEqual(llenas(r), llenas(m));
  assert.equal(r.columnas, 8);
  assert.deepEqual(M.lugar(r, 9), { x: 1, y: 1 });
});

test('lentes: valores, barras desde cero y tipo de cada valor', () => {
  const na = L.valor(11, 'ei');
  assert.equal(na.corto, '496');
  assert.equal(na.texto, '496 kJ/mol');
  assert.equal(na.tipo, 'medido');
  assert.ok(Math.abs(na.fraccion - 496 / 2372) < 1e-9);
  assert.equal(L.valor(1, 'ei').texto, '1 312 kJ/mol (calculado)');
  assert.equal(L.valor(59, 'ei').tipo, 'extrapolado');
  assert.equal(L.valor(9, 'en').corto, '3,98');
  assert.equal(L.valor(9, 'en').fraccion, 1);
  assert.equal(L.valor(26, 'masa').corto, '56');
  assert.equal(L.valor(26, 'masa').texto, '55,845 u');
  assert.equal(L.valor(11, 'radio').texto, '227 pm');
});

test('lentes: «sin dato» donde no hay valor con fuente, nunca un estimado', () => {
  for (const [z, lente] of [[118, 'ei'], [95, 'en'], [87, 'en'], [2, 'en'], [110, 'radio'], [110, 'clase'], [110, 'estado']]) {
    const v = L.valor(z, lente);
    assert.equal(v.sinDato, true, `${z} ${lente}`);
    assert.equal(v.corto, '—');
    assert.equal(v.fraccion, null);
  }
  // El número másico no es una masa atómica: se muestra entre corchetes y sin barra.
  const tc = L.valor(43, 'masa');
  assert.equal(tc.tipo, 'masico');
  assert.equal(tc.fraccion, null);
  assert.equal(tc.corto, '[97]');
  for (let z = 1; z <= 118; z++) for (const lente of L.ORDEN) {
    const v = L.valor(z, lente);
    assert.ok(!/NaN|undefined|null/.test(v.texto + v.corto), `${z} ${lente}`);
    assert.ok(v.corto.length <= 6, `${z} ${lente}: «${v.corto}» no cabe en la carta`);
    if (v.fraccion !== null) assert.ok(v.fraccion > 0 && v.fraccion <= 1);
  }
});

test('lentes de categoría: clase con cuatro familias y estado', () => {
  assert.deepEqual([L.valor(11, 'clase').corto, L.valor(11, 'clase').grupo], ['alc', 'metal']);
  assert.equal(L.valor(14, 'clase').grupo, 'semimetal');
  assert.equal(L.valor(17, 'clase').grupo, 'no-metal');
  assert.equal(L.valor(18, 'clase').grupo, 'noble');
  assert.equal(L.valor(35, 'estado').corto, 'líq');
  assert.equal(L.valor(1, 'estado').grupo, 'gas');
});

test('comparar: diferencia con unidad, y nada si falta un valor', () => {
  assert.equal(L.comparar(11, 12, 'ei'), 'Mg tiene 242 kJ/mol más que Na');
  assert.equal(L.comparar(9, 17, 'en'), 'F tiene 0,82 más que Cl');
  assert.equal(L.comparar(18, 19, 'masa'), 'Ar tiene 0,852 u más que K');
  assert.equal(L.comparar(1, 2, 'ei'), 'He tiene 1 060 kJ/mol más que H');
  assert.equal(L.comparar(1, 118, 'ei'), null);
  assert.equal(L.comparar(1, 2, 'clase'), null);
});
