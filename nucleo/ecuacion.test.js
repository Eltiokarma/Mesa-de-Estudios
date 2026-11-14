const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('./ecuacion.js');

const v = { v: 'c-o', t: 'v' }, t = { v: 'c-h', t: 't' };
test('ecuación: variables con su color, fracciones y potencias', () => {
  const h = E.html([v, ' = ', { frac: [['Δ', v], ['Δ', t]] }, ' + ', { sup: [t, '2'] }]);
  assert.match(h, /<span class="var c-o ec-v">v<\/span>/);
  assert.match(h, /ec-frac/);
  assert.match(h, /<sup class="ec-sup">2<\/sup>/);
  assert.equal(E.texto([v, ' = ', { frac: ['d', t] }]), 'v = d / t');
  assert.equal(E.texto([{ sup: ['x', '2'] }]), 'x al cuadrado');
  assert.deepEqual([...E.colores([v, { frac: [t, '2'] }])].sort(), ['c-h', 'c-o']);
});
test('ecuación: escapa el texto y escribe el menos tipográfico', () => {
  assert.equal(E.html('a < -3'), 'a &lt; −3');
  assert.equal(E.html('x-y'), 'x-y');
});
test('ecuación: revisar rechaza colores y partes desconocidas', () => {
  assert.throws(() => E.revisar([{ v: 'rojo', t: 'x' }]), /color/);
  assert.throws(() => E.revisar([{ frac: ['1'] }]), /dos partes/);
  assert.throws(() => E.revisar([{ raro: 1 }]), /desconocida/);
  E.revisar([v, { raiz: ['2'] }, { abs: [t] }]);
});
