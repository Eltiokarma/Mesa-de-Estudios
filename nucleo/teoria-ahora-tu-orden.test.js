// El orden de las alternativas de «Ahora tú» depende de la idea, no solo de la semilla del caso (19 nov).
const test = require('node:test');
const assert = require('node:assert/strict');
const T = require('./teoria.js');

test('el primer caso de «Ahora tú» no pone la primera opción siempre en la misma letra', () => {
  const ops = ['correcta', 'b', 'c', 'd', 'e'];
  const ideas = ['arco', 'sector', 'trapecio-circular', 'vueltas-rueda', 'faja-y-eje', 'suposicion', 'negar-bien', 'criba',
    'euler', 'algoritmo', 'horner', 'ruffini', 'tres-enlaces', 'resonancia', 'diagonales', 'trapecios'];
  const letras = new Set(ideas.map(id => T.ordenAhoraTu(ops, id, 0).indexOf('correcta')));
  assert.ok(letras.size >= 3, `la correcta cae en ${letras.size} letra(s) distinta(s)`);
  // Antes: barajar con semilla + 7, igual para toda idea.
  const antes = new Set(ideas.map(() => T.barajar(ops, 0 + 7).indexOf('correcta')));
  assert.equal(antes.size, 1);
});

test('es determinista y conserva las opciones', () => {
  const ops = ['a', 'b', 'c', 'd'];
  assert.deepEqual(T.ordenAhoraTu(ops, 'arco', 3), T.ordenAhoraTu(ops, 'arco', 3));
  assert.deepEqual(T.ordenAhoraTu(ops, 'arco', 3).slice().sort(), ops);
  assert.deepEqual(ops, ['a', 'b', 'c', 'd'], 'no cambia el arreglo original');
});
