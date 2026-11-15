// Pruebas de cuboConResto (mesa 3D «El cubo de cubitos» de la teoría de Potenciación y radicación), contra un cálculo
// independiente: la raíz cúbica entera se busca subiendo k de uno en uno, y la cáscara se cuenta como (k+1)³ − k³.
const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('./motor.js');

const raizBruta = N => { let k = 0; while ((k + 1) ** 3 <= N) k++; return k; };

test('casos fijos, contados a mano', () => {
  let r = M.cuboConResto(50);
  assert.deepEqual([r.k, r.r, r.falta, r.cubo.length, r.resto.length, r.caras, r.aristas, r.esquina], [3, 23, 14, 27, 23, 23, 0, 0]);
  r = M.cuboConResto(54);                       // 27 + 3 · 9: las tres caras justas
  assert.deepEqual([r.r, r.caras, r.aristas, r.esquina, r.falta], [27, 27, 0, 0, 10]);
  r = M.cuboConResto(63);                       // falta solo la esquina
  assert.deepEqual([r.r, r.caras, r.aristas, r.esquina, r.falta, r.hueco.length], [36, 27, 9, 0, 1, 1]);
  assert.equal(r.hueco[0].parte, 'esquina');
  r = M.cuboConResto(64);
  assert.deepEqual([r.k, r.r, r.exacto, r.cubo.length], [4, 0, true, 64]);
});

test('de 1 a 250: cubo, residuo y hueco suman (k+1)³, y el residuo llena la cáscara en orden', () => {
  for (let N = 1; N <= 250; N++) {
    const k = raizBruta(N), r = M.cuboConResto(N);
    assert.equal(r.k, k);
    assert.equal(r.cubo.length, k ** 3);
    assert.equal(r.resto.length, N - k ** 3);
    assert.equal(r.cubo.length + r.resto.length + r.hueco.length, (k + 1) ** 3);
    assert.equal(r.falta, (k + 1) ** 3 - N);
    // Orden: ninguna arista antes de completar las tres caras, ni la esquina antes de las aristas.
    if (r.aristas > 0) assert.equal(r.caras, 3 * k * k);
    if (r.esquina > 0) assert.equal(r.aristas, 3 * k);
    // Sin cubitos repetidos.
    const todos = r.cubo.concat(r.resto, r.hueco).map(c => `${c.x},${c.y},${c.z}`);
    assert.equal(new Set(todos).size, todos.length);
  }
});

test('separar aparta la cáscara pero no cambia las cuentas', () => {
  const a = M.cuboConResto(90), b = M.cuboConResto(90, true);
  assert.deepEqual([a.k, a.r, a.caras, a.aristas], [b.k, b.r, b.caras, b.aristas]);
  assert.deepEqual(a.cubo, b.cubo, 'el cubo viejo no se mueve');
  assert.ok(b.resto.some(c => c.x > a.k || c.y > a.k || c.z > a.k));
});

test('fuera de rango', () => {
  assert.throws(() => M.cuboConResto(13 ** 3));
  assert.equal(M.cuboConResto(0).k, 0);
});
