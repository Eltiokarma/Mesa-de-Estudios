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
  assert.equal(E.html('a < -3').replace(/\u00a0/g, ' '), 'a &lt; −3');
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

test('no se parte antes de < > ≤ ≥ ni después del «=» de una igualdad corta', () => {
  assert.ok(!/ &gt;/.test(E.html(['a⁶ > b⁶'])), 'antes de >');
  assert.ok(!/ <span class="ec-op">≥/.test(E.html(['x ≥ 3'])), 'antes de ≥');
  const h = E.html([{ v: 'c-o', t: 'a' }, ' = ', { v: 'c-o', t: 'x' }, ' y ', { v: 'c-i', t: 'b' }, ' = 2']);
  assert.ok(!/= </.test(h) && !/= 2/.test(h), h);
  // Una igualdad larga se sigue pudiendo partir después del «=».
  assert.match(E.html(['AC = 13 + 5 = 18 cm']), /= 13/);
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

// Raíz con índice (auditoría de Exponentes y radicales, A1 y M2, 18 nov): el índice va en su caja chica antes del signo,
// el signo es un trazo SVG que se estira (no el glifo √) y el índice puede llevar el color de su variable.
test('raíz: índice en su caja, signo que se estira y el índice con color', () => {
  const simple = E.html([{ raiz: ['a'] }]);
  assert.doesNotMatch(simple, /ec-ind|√/, 'sin índice no hay caja de índice, y el signo ya no es el glifo');
  assert.match(simple, /^<span class="ec-raiz"><span class="ec-rad" aria-hidden="true"><svg [^>]*preserveAspectRatio="none"[^>]*><path [^>]*vector-effect="non-scaling-stroke"\/><\/svg><\/span><span class="ec-bajo">a<\/span><\/span>$/);
  const n = { v: 'c-i', t: 'n' };
  const h = E.html([{ raiz: ['a'], indice: n }]);
  assert.match(h, /^<span class="ec-raiz con-ind"><span class="ec-ind"><span class="ec-ind-n"><span class="var c-i ec-v ec-letra">n<\/span><\/span><\/span><span class="ec-rad"/);
  assert.match(E.html([{ raiz: ['x'], indice: '3' }]), /<span class="ec-ind-n">3<\/span>/, 'el índice de texto sigue igual');
  assert.equal(E.texto([{ raiz: ['a'], indice: n }]), 'raíz n de a');
  assert.equal(E.texto([{ raiz: ['x'], indice: '3' }]), 'raíz 3 de x');
  assert.ok(E.colores([{ raiz: ['a'], indice: n }]).has('c-i'), 'el color del índice cuenta');
  // Anidada: la de adentro queda entera dentro del .ec-bajo de la de afuera.
  const an = E.html([{ raiz: [{ raiz: ['x'], indice: '3' }] }]);
  assert.match(an, /^<span class="ec-raiz"><span class="ec-rad"[\s\S]*?<span class="ec-bajo"><span class="ec-raiz con-ind">[\s\S]*<\/span><\/span><\/span>$/);
  E.revisar([{ raiz: ['a'], indice: n }, { raiz: ['a'], indice: '3' }, { raiz: ['a'], indice: 4 }, { raiz: ['a'], indice: [n, '+1'] }]);
  assert.throws(() => E.revisar([{ raiz: ['a'], indice: { v: 'rojo', t: 'n' } }]), /color/);
  assert.throws(() => E.revisar([{ raiz: ['a'], indice: { frac: ['1', '2'] } }]), /índice de raíz/);
  assert.throws(() => E.revisar([{ raiz: ['a'], indice: '' }]), /índice de raíz/);
  assert.throws(() => E.revisar([{ raiz: ['a'], indice: null }]), /índice de raíz/);
});

// Negrita sin color (Productos notables, 18 nov): la letra de una alternativa donde el violeta ya tiene otro papel.
test('negrita: en tinta, sin color de variable, y se lee tal cual', () => {
  const p = ['La ', { negrita: 'B⁠' }, ' suma 5 + 3.'];
  E.revisar(p);
  assert.match(E.html(p), /<b class="ec-negrita" style="font-weight:800">B⁠<\/b>/);
  assert.equal(E.texto(p), 'La B⁠ suma 5 + 3.');
  assert.equal(E.colores(p).size, 0);
  assert.throws(() => E.revisar([{ negrita: [{ v: 'rojo', t: 'a' }] }]), /color/);
});

// «¹⁰» se leía «1o» (lector en frío de Estructura atómica, 18 nov): varias serif del sistema traen ¹ ² ³ y no ⁰ ni ⁻,
// y cada cifra salía de una fuente distinta. Los superíndices de Unicode se pintan como <sup>, con cifras normales.
test('los superíndices de Unicode se pintan como <sup> con cifras normales', () => {
  const h = E.html(['[Kr] 5s² 4d¹⁰ 5p⁵']);
  assert.doesNotMatch(h, /[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿ]/, h);
  assert.equal(h, '[Kr] 5s<sup class="ec-sup">2</sup> 4d<sup class="ec-sup">10</sup> 5p<sup class="ec-sup">5</sup>');
  assert.equal(E.html(['6,02 × 10⁻²³']).replace(/ /g, ' '), '6,02 × 10<sup class="ec-sup">−23</sup>', 'el menos del exponente es el tipográfico');
  assert.equal(E.html(['Fe³⁺ y xⁿ']), 'Fe<sup class="ec-sup">3+</sup> y x<sup class="ec-sup">n</sup>');
  // También dentro de una ficha de color, y sin tocar lo que se lee en voz alta ni el texto plano.
  assert.equal(E.html([{ v: 'c-o', t: 'x²' }]), '<span class="var c-o ec-v">x<sup class="ec-sup">2</sup></span>');
  assert.equal(E.texto(['4d¹⁰ ', { v: 'c-o', t: 'x²' }]), '4d¹⁰ x²');
  // Lo que ya iba con { sup } sigue igual, y no se parte antes de «>» aunque la potencia vaya en Unicode.
  assert.equal(E.html([{ sup: ['x', '2'] }]), 'x<sup class="ec-sup">2</sup>');
  assert.ok(!/ &gt;/.test(E.html(['a⁶ > b⁶'])));
});
