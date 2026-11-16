// Pruebas de nucleo/flechas-texto.js: el nombre del vector sale entero, sin el carácter combinante.
const test = require('node:test');
const assert = require('node:assert/strict');
const F = require('./flechas-texto.js');

test('separa los nombres de vector del texto suelto', () => {
  assert.deepEqual(F.reemplazar('A⃗ = 3î'), [{ vec: 'A' }, { t: ' = 3î' }]);
  assert.deepEqual(F.reemplazar('2A⃗ − B⃗'), [{ t: '2' }, { vec: 'A' }, { t: ' − ' }, { vec: 'B' }]);
  assert.deepEqual(F.reemplazar('el lado AB⃗'), [{ t: 'el lado ' }, { vec: 'AB' }]);
  assert.deepEqual(F.reemplazar('… = 0⃗'), [{ t: '… = ' }, { vec: '0' }]);
  assert.deepEqual(F.reemplazar('sin flechas'), [{ t: 'sin flechas' }]);
});
