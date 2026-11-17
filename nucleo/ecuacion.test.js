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

test('una unidad tachada se dibuja tachada y se lee en voz alta', () => {
  const E2 = require('./ecuacion.js');
  const eq = ['72 ', { tacha: 'km' }, ' × ', { frac: ['1000 m', ['1 ', { tacha: 'km' }]] }];
  E2.revisar(eq, 'prueba');
  assert.match(E2.html(eq), /<span class="ec-tacha">km<\/span>/);
  assert.match(E2.texto(eq), /km \(tachado\)/);
});

test('una cuenta solo se parte después de un «=»: nunca junto a + − × ÷', () => {
  const h = E.html(['AC = 13 + 5 = 18 cm   ·   ', { v: 'c-o', t: 'a' }, ' ÷ 2 − 9']);
  assert.ok(!/ [+−×÷]|[+−×÷] /.test(h), h);
  assert.ok(/ = /.test(h), 'se puede partir después de «=»');
});

test('raya: un numeral con letras lleva raya encima, sin cambiar las demás partes', () => {
  // Lo que ya existía se ve igual (la raya es una parte nueva, 17 nov).
  const antes = [{ v: 'c-o', t: 'v' }, ' = ', { frac: ['d', 't'] }, ' + ', { sub: ['A', 'x'] }, { par: ['2'] }, { tacha: 'km' }];
  assert.equal(E.html(antes).replace(/ /g, ' '), '<span class="var c-o ec-v ec-letra">v</span> = <span class="ec-frac"><span class="ec-num">d</span><span class="ec-den">t</span></span> + A<sub class="ec-sub">x</sub><span class="ec-par">(2)</span><span class="ec-tacha">km</span>');
  // a̅b̅c̅₍ₙ₎: las cifras naranja, la base turquesa, la raya en tinta sobre las cifras.
  const num = [{ sub: [{ raya: [{ v: 'c-o', t: 'abc' }] }, { v: 'c-i', t: '(n)' }] }];
  E.revisar(num, 'prueba');
  const h = E.html(num);
  assert.match(h, /<span class="ec-raya" style="text-decoration:overline[^"]*"><span class="var c-o ec-v">abc<\/span><\/span><sub class="ec-sub">/);
  assert.equal(E.texto(num), 'abc(n)');
  assert.deepEqual([...E.colores(num)].sort(), ['c-i', 'c-o']);
  assert.equal(E.texto([{ raya: '2a3' }]), '2a3');
  assert.throws(() => E.revisar([{ raya: [{ v: 'rojo', t: 'a' }] }]), /color/);
});
