// Pruebas de llenarCaja y cuboDeLadrillos (mesas 3D de la teoría de MCD y MCM), contra un cálculo independiente:
// el MCD y el MCM se buscan probando uno por uno, y los cubos y ladrillos se cuentan por capas.
const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('./motor.js');

const mcdBruto = (...xs) => { for (let d = Math.min(...xs); d >= 1; d--) if (xs.every(x => x % d === 0)) return d; };
const mcmBruto = (...xs) => { for (let k = Math.max(...xs); ; k++) if (xs.every(x => k % x === 0)) return k; };

test('casos fijos, contados a mano', () => {
  let r = M.llenarCaja(12, 8, 6, 2);
  assert.deepEqual([r.cantidad, r.justo, r.mcd, r.esMcd], [72, true, 2, true]);
  r = M.llenarCaja(12, 8, 6, 4);
  assert.deepEqual([r.porLado, r.sobra, r.cantidad, r.justo], [[3, 2, 1], [0, 0, 2], 6, false]);
  r = M.llenarCaja(12, 6, 6, 6);
  assert.deepEqual([r.cantidad, r.esMcd, r.cantidadMcd], [2, true, 2]);
  r = M.cuboDeLadrillos(2, 3, 4, 12);
  assert.deepEqual([r.porArista, r.justo, r.mcm, r.ladrillos, r.aristas.length], [[6, 4, 3], true, 12, 72, 6 + 4 + 3 - 2]);
  r = M.cuboDeLadrillos(2, 3, 4, 10);
  assert.deepEqual([r.porArista, r.sobra, r.justo, r.ladrillos], [[5, 3, 2], [0, 1, 2], false, null]);
  r = M.cuboDeLadrillos(3, 4, 5, 60);
  assert.deepEqual([r.esMcm, r.ladrillos], [true, 3600]);
});

test('toda la grilla de la caja: el que llena justo divide a los tres y el MCD es el mayor', () => {
  for (let a = 2; a <= 12; a++) for (let b = 2; b <= 12; b++) for (let c = 2; c <= 8; c++) {
    const g = mcdBruto(a, b, c);
    for (let m = 1; m <= 12; m++) {
      const r = M.llenarCaja(a, b, c, m);
      assert.equal(r.mcd, g);
      assert.equal(r.justo, a % m === 0 && b % m === 0 && c % m === 0);
      let capas = 0; for (let z = 0; z + m <= c; z += m) capas++;
      assert.equal(r.cantidad, capas * Math.floor(a / m) * Math.floor(b / m));
      assert.equal(r.cubos.length, r.cantidad);
      assert.ok(r.cubos.every(q => q.x + m <= a && q.y + m <= b && q.z + m <= c), 'ningún cubo se sale de la caja');
      if (r.justo) assert.ok(m <= g && g % m === 0);
      assert.equal(r.cantidad <= 1200, true, 'cabe en el tope de la pieza');
    }
  }
});

test('toda la grilla de los ladrillos: cierra justo con múltiplos comunes y el MCM es el menor', () => {
  for (let a = 2; a <= 6; a++) for (let b = 2; b <= 6; b++) for (let c = 2; c <= 6; c++) {
    const L0 = mcmBruto(a, b, c);
    for (let L = 2; L <= 60; L++) {
      const r = M.cuboDeLadrillos(a, b, c, L);
      assert.equal(r.mcm, L0);
      assert.equal(r.justo, L % a === 0 && L % b === 0 && L % c === 0);
      if (r.justo) { assert.ok(L >= L0 && L % L0 === 0); assert.equal(r.ladrillos * a * b * c, L ** 3, 'el volumen cuadra'); }
      if (r.aristas.length) assert.equal(r.aristas.length, r.porArista[0] + r.porArista[1] + r.porArista[2] - 2);
      assert.ok(r.aristas.every(q => q.x + a <= L && q.y + b <= L && q.z + c <= L), 'ningún ladrillo se sale del cubo');
    }
  }
});

test('errores de entrada', () => {
  assert.throws(() => M.llenarCaja(2, 3, 0, 1));
  assert.throws(() => M.cuboDeLadrillos(2, 3, 4, 1.5));
});
