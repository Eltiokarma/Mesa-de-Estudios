// Pruebas de cajaDivisores (la caja 3D de divisores, mesa de la teoría de Números primos y divisores).
// Se comparan contra un cálculo independiente: recorrer 1..n, quedarse con los divisores y clasificarlos a mano.
const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('./motor.js');

const esCuadrado = x => Number.isInteger(Math.sqrt(x));
function aMano(n, filtro) {
  const ds = [];
  for (let d = 1; d <= n; d++) if (n % d === 0) ds.push(d);
  const f = { todos: () => true, pares: d => d % 2 === 0, impares: d => d % 2 === 1, cuadrados: esCuadrado, multiplos: d => d % 15 === 0 }[filtro];
  return { cantidad: ds.length, resaltados: ds.filter(f).length, divisores: ds };
}

// Casos fijos, contados a mano: 24 = 2³·3 → 8 divisores; 900 = 2²·3²·5² → 27; 360 = 2³·3²·5 → 24, de ellos 18 pares,
// 4 cuadrados (1, 4, 9, 36) y 8 múltiplos de 15 (15 · d con d divisor de 24).
const CASOS = [
  { exps: [3, 1, 0], filtro: 'todos', n: 24, cantidad: 8, resaltados: 8, plana: true },
  { exps: [2, 2, 2], filtro: 'todos', n: 900, cantidad: 27, resaltados: 27, plana: false },
  { exps: [3, 2, 1], filtro: 'pares', n: 360, cantidad: 24, resaltados: 18, plana: false },
  { exps: [3, 2, 1], filtro: 'cuadrados', n: 360, cantidad: 24, resaltados: 4, plana: false },
  { exps: [3, 2, 1], filtro: 'multiplos', n: 360, cantidad: 24, resaltados: 8, plana: false },
  { exps: [2, 1, 1], filtro: 'impares', n: 60, cantidad: 12, resaltados: 4, plana: false },
  { exps: [0, 0, 0], filtro: 'todos', n: 1, cantidad: 1, resaltados: 1, plana: true },
];

test('casos fijos de la caja de divisores', () => {
  for (const c of CASOS) {
    const r = M.cajaDivisores(c.exps, [2, 3, 5], c.filtro);
    for (const k of ['n', 'cantidad', 'resaltados', 'plana']) assert.equal(r[k], c[k], `${c.exps} ${c.filtro} · ${k}`);
  }
});

test('toda la grilla de la mesa coincide con contar a mano', () => {
  for (let a = 0; a <= 4; a++) for (let b = 0; b <= 3; b++) for (let c = 0; c <= 3; c++) for (const f of ['todos', 'pares', 'impares', 'cuadrados', 'multiplos']) {
    const r = M.cajaDivisores([a, b, c], [2, 3, 5], f), m = aMano(r.n, f);
    assert.equal(r.cantidad, m.cantidad, `${r.n}`);
    assert.equal(r.cantidad, (a + 1) * (b + 1) * (c + 1));
    assert.equal(r.resaltados, m.resaltados, `${r.n} ${f}`);
    assert.deepEqual(r.cubitos.map(x => x.valor).sort((x, y) => x - y), m.divisores, 'cada cubito es un divisor, una sola vez');
  }
});

test('el cubito (i, j, k) es 2^i · 3^j · 5^k y la caja mide (a + 1)(b + 1)(c + 1)', () => {
  const r = M.cajaDivisores([2, 1, 3], [2, 3, 5]);
  for (const c of r.cubitos) assert.equal(c.valor, 2 ** c.x * 3 ** c.y * 5 ** c.z);
  assert.deepEqual(r.lados, [3, 2, 4]);
});

test('errores de entrada', () => {
  assert.throws(() => M.cajaDivisores([1, 2]), /tres/);
  assert.throws(() => M.cajaDivisores([1, -1, 0]), /mayor o igual/);
  assert.throws(() => M.cajaDivisores([1, 1, 1], [2, 4, 5]), /no es primo/);
  assert.throws(() => M.cajaDivisores([1, 1, 1], undefined, 'raros'), /filtro/);
});
