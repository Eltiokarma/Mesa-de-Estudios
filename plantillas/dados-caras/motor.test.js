// Pruebas del motor del dado común (plantillas/dados-caras/motor.js). Se corren desde la raíz con: node --test
// Todo se contrasta con cuentas hechas de otra manera: la quiralidad con un producto vectorial, las 24 orientaciones
// con las del generador y las sumas de la pila con la fórmula 7k − arriba (que el motor no usa).
const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('./motor.js');
const G = require('./generador.js');

// Dirección de cada cara: arriba +z, abajo −z, frente −y, atrás +y, izquierda −x, derecha +x.
const DIR = [[0, 0, 1], [0, 0, -1], [0, -1, 0], [0, 1, 0], [-1, 0, 0], [1, 0, 0]];
const donde = (o, n) => DIR[o.indexOf(n)];
const det = (a, b, c) => a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0]);

test('hay 24 orientaciones, todas distintas, con las opuestas sumando 7', () => {
  const os = M.orientaciones();
  assert.equal(os.length, 24);
  assert.equal(new Set(os.map(o => o.join())).size, 24);
  for (const o of os) {
    assert.deepEqual(o.slice().sort(), [1, 2, 3, 4, 5, 6]);
    assert.equal(o[0] + o[1], 7); assert.equal(o[2] + o[3], 7); assert.equal(o[4] + o[5], 7);
  }
});

test('todas giran el mismo dado: el 1, el 2 y el 3 tienen la misma quiralidad', () => {
  const signos = new Set(M.orientaciones().map(o => Math.sign(det(donde(o, 1), donde(o, 2), donde(o, 3)))));
  assert.equal(signos.size, 1);
});

test('las orientaciones son las mismas que usa el generador de dados', () => {
  const g = new Set(G._interno.DADO.map(o => o.join()));
  for (const o of M.orientaciones()) assert.ok(g.has(o.join()), o.join());
});

test('orientar: con el 1 arriba y el 2 al frente, el 4 a la derecha; sin frente posible, null', () => {
  assert.deepEqual(M.orientar(1, 2), [1, 6, 2, 5, 3, 4]);
  assert.equal(M.orientar(3, 4), null);
  assert.equal(M.orientar(3, 3), null);
  for (let a = 1; a <= 6; a++) for (let f = 1; f <= 6; f++) {
    const o = M.orientar(a, f);
    if (f === a || f === 7 - a) assert.equal(o, null); else assert.ok(o && o[0] === a && o[2] === f);
  }
});

test('frentes y girar: un cuarto de vuelta deja la cara de arriba y pasa el frente a la izquierda', () => {
  for (let a = 1; a <= 6; a++) {
    const fs = M.frentes(a);
    assert.equal(fs.length, 4);
    assert.deepEqual(fs.slice().sort(), [1, 2, 3, 4, 5, 6].filter(x => x !== a && x !== 7 - a));
    const o = M.orientar(a, fs[0]), g = M.girarVertical(o, 1);
    assert.equal(g[0], a); assert.equal(g[4], o[2]); assert.equal(g[2], o[5]);
    assert.deepEqual(M.girarVertical(o, 4), o);
  }
});

// Casos de la pila, verificados aparte con la fórmula: las tapadas son el arriba y el abajo de cada dado (7 por dado)
// menos la cara de arriba del dado 1, que se ve. Lo visible es el resto de las 21 · k.
const CASOS = [
  { k: 1, a: 6, ocultas: 1, visibles: 20 },
  { k: 2, a: 5, ocultas: 9, visibles: 33 },
  { k: 3, a: 1, ocultas: 20, visibles: 43 },
  { k: 3, a: 6, ocultas: 15, visibles: 48 },
  { k: 4, a: 2, ocultas: 26, visibles: 58 },
];
test('pila: casos verificados aparte', () => {
  for (const c of CASOS) {
    const p = M.pila(c.k, c.a);
    assert.equal(p.ocultas, c.ocultas, `k=${c.k} a=${c.a}`);
    assert.equal(p.visibles, c.visibles, `k=${c.k} a=${c.a}`);
  }
});

test('pila: en toda la grilla, ocultas = 7k − arriba, sin importar el giro, y ocultas + visibles = 21k', () => {
  for (let k = 1; k <= 6; k++) for (let a = 1; a <= 6; a++) for (let g = 0; g <= 3; g++) {
    const p = M.pila(k, a, g);
    assert.equal(p.dados.length, k);
    assert.equal(p.dados[0].caras[0], a);
    assert.equal(p.ocultas, 7 * k - a);
    assert.equal(p.ocultas + p.visibles, 21 * k);
    assert.equal(p.tapadas.length, 2 * k - 1);
    assert.equal(p.tapadas.filter(t => t.toca === 'mesa').length, 1);
    p.dados.forEach((d, i) => assert.equal(d.z, k - 1 - i));
  }
});

test('el giro cambia lo que se ve al frente de los dados de abajo', () => {
  const a = M.pila(3, 2, 0), b = M.pila(3, 2, 1);
  assert.notEqual(a.dados[1].caras[2], b.dados[1].caras[2]);
  assert.equal(a.dados[1].caras[0], b.dados[1].caras[0]);
});

test('errores de entrada', () => {
  assert.throws(() => M.pila(0, 1));
  assert.throws(() => M.pila(2, 7));
  assert.throws(() => M.pila(2, 3, 4));
  assert.throws(() => M.orientar(0, 2));
});
