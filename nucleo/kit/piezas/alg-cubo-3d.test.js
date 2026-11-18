// Pruebas de la pieza «alg-cubo-3d»: el respaldo plano y el alt muestran las ocho piezas que calcula
// plantillas/cuadrado-crece/motor.js (piezasCubo); abrir separa sin cambiar volúmenes; girar no cambia la figura.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./alg-cubo-3d.js');
const M = require('../../../plantillas/cuadrado-crece/motor.js');

const C = { a: 2, b: 1, abrir: 0 };

test('se registra en el kit con su parte viva', () => {
  assert.equal(Kit.piezas['alg-cubo-3d'], P);
  assert.equal(typeof P.montar, 'function');
});

test('ocho piezas: 1, 3, 3, 1, y suman (a + b)³', () => {
  for (const [a, b] of [[2, 1], [3, 2], [1, 4], [2, 2]]) {
    const c = P.cuenta({ a, b });
    assert.deepEqual(['a3', 'a2b', 'ab2', 'b3'].map(k => c.tipos[k].n), [1, 3, 3, 1]);
    assert.equal(c.tipos.a2b.volumen, a * a * b);
    assert.equal(c.tipos.ab2.volumen, a * b * b);
    assert.equal(c.suma, (a + b) ** 3);                   // cálculo aparte: el cubo entero
    assert.equal(c.suma, M.piezasCubo({ a, b }).volumen);
  }
});

test('el alt nombra las piezas con sus volúmenes y la suma', () => {
  const t = P.alt(C);
  assert.match(t, /arista 2 \+ 1 = 3/);
  assert.match(t, /a³ = 8, tres a²b de 4, tres ab² de 2 y b³ = 1; suman 27/);
  assert.match(P.alt(Object.assign({}, C, { solo: 'ab2' })), /solo las 3 piezas ab²/);
});

test('el respaldo es un SVG con ocho piezas y de una a tres caras visibles cada una', () => {
  const s = P.dibujar(C), pl = P.plano(C);
  assert.match(s, /^<svg/);
  assert.equal(pl.piezas.length, 8);
  for (const p of pl.piezas) assert.ok(p.caras.length >= 1 && p.caras.length <= 3);
  assert.match(s, /var\(--c-d\)/);                         // a²b en su color
  assert.match(s, /var\(--c-f\)/);                         // ab² en el suyo
});

test('con un tipo solo a la vista, las demás piezas quedan tenues', () => {
  const pl = P.plano(Object.assign({}, C, { solo: 'a2b' }));
  assert.equal(pl.piezas.filter(p => !p.tenue).length, 3);
  assert.ok(pl.piezas.filter(p => !p.tenue).every(p => p.tipo === 'a2b'));
});

test('abrir separa las piezas, pero no cambia sus volúmenes', () => {
  const cerrado = M.piezasCubo({ a: 3, b: 2, hueco: 1.4, f: 0 }), abierto = M.piezasCubo({ a: 3, b: 2, hueco: 1.4, f: 1 });
  assert.deepEqual(cerrado.piezas.map(p => p.volumen), abierto.piezas.map(p => p.volumen));
  assert.notDeepEqual(cerrado.piezas.map(p => p.x), abierto.piezas.map(p => p.x));
});

test('girar conserva el largo (la vista no cambia la figura)', () => {
  const v = [0.7, -0.2, 1.1], g = P.girar(v, 40, -25);
  assert.ok(Math.abs(Math.hypot(...g) - Math.hypot(...v)) < 1e-12);
  const otra = P.cuenta(Object.assign({}, C, { vista: { giro: 120, inclinacion: -40 } }));
  assert.equal(otra.suma, 27);
});

test('una unidad puede dar su paleta: Productos notables pinta a²b violeta y ab² en tinta, sin verde', () => {
  const s = P.dibujar(Object.assign({}, C, { colores: { a3: 'c-o', a2b: 'c-f', ab2: 'ink', b3: 'c-i' } }));
  assert.ok(!/var\(--c-[hd]\)/.test(s), 'sin carmín ni verde');
  assert.match(s, /var\(--c-f\)/);
  assert.match(s, /var\(--ink\)/);
});
