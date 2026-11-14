const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('./ecuacion.js');

const v = { v: 'c-o', t: 'v' }, t = { v: 'c-h', t: 't' };
test('ecuación: variables con su color, fracciones y potencias', () => {
  const h = E.html([v, ' = ', { frac: [['Δ', v], ['Δ', t]] }, ' + ', { sup: [t, '2'] }]);
  assert.match(h, /<span class="var c-o ec-v ec-letra">v<\/span>/);
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

test('ecuación: llave con su nota, en el texto plano y en los colores', () => {
  const ll = { llave: [{ sub: ['A', '+'] }], nota: 'lo que avanzó', color: 'c-i' };
  const h = E.html(['Δx = ', ll]);
  assert.match(h, /class="ec-llave"/);
  assert.match(h, /--llave:var\(--c-i\)/);
  assert.match(h, /ec-llave-nota">lo que avanzó</);
  assert.equal(E.texto(['Δx = ', ll]), 'Δx = A+ (lo que avanzó)');
  assert.ok(E.colores([{ llave: [{ v: 'c-o', t: 'v' }], nota: 'rapidez' }]).has('c-o'));
  assert.throws(() => E.revisar([{ llave: ['x'] }]), /sin nota/);
  assert.throws(() => E.revisar([{ llave: ['x'], nota: 'n', color: 'azul' }]), /color de llave/);
  assert.match(E.html([{ v: 'c-o', t: 'x' }]), /ec-letra/);
  assert.doesNotMatch(E.html([{ v: 'c-o', t: 'lo escrito' }]), /ec-letra/);
});
