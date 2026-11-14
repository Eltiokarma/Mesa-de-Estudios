// Pruebas de lo que el grupo A de Álgebra agregó a dos piezas para el gesto directo de la teoría:
// recta.geometria(d).v (la inversa de x) y alg-venn.ficha(d, cod) (dónde va la ficha de cada región).
// Ninguno de los dos cambia lo que la pieza dibuja: se comprueba que el SVG sigue igual con y sin usarlos.
const test = require('node:test');
const assert = require('node:assert/strict');
require('../kit.js');
const R = require('./recta.js');
const V = require('./alg-venn.js');

test('recta: v es la inversa de x en todo el tramo, con tramos enteros y decimales', () => {
  for (const d of [{ min: -8, max: 8 }, { min: 0.8, max: 1.05 }, { min: -4, max: 7, filas: 3 }]) {
    const g = R.geometria(d);
    for (let k = 0; k <= 20; k++) {
      const val = d.min + (d.max - d.min) * k / 20;
      assert.ok(Math.abs(g.v(g.x(val)) - val) < 1e-9, `v(x(${val})) en [${d.min}, ${d.max}]`);
    }
    // Los extremos caen dentro del viewBox de 320 px.
    assert.ok(g.x(d.min) >= 0 && g.x(d.max) <= 320);
  }
});

test('recta: agregar v no cambia el dibujo', () => {
  const d = { min: -5, max: 5, paso: 1, variable: 'x', color: 'o', filas: 2, elementos: [{ tipo: 'punto', x: 2, color: 'o', fila: 1 }] };
  const antes = R.dibujar(d, {});
  R.geometria(d).v(100);
  assert.equal(R.dibujar(d, {}), antes);
});

test('alg-venn: cada ficha cae dentro de su región, con margen respecto de los bordes', () => {
  const dos = { conjuntos: [{ t: 'A', color: 'o' }, { t: 'B', color: 'i' }] };
  const tres = { conjuntos: [{ t: 'A', color: 'o' }, { t: 'B', color: 'i' }, { t: 'C', color: 'd' }] };
  for (const d of [dos, tres]) {
    const cods = Object.keys(V.centros(d));
    for (const cod of cods) {
      const p = V.ficha(d, cod);
      assert.ok(p && Number.isFinite(p.x) && Number.isFinite(p.y), `ficha ${cod}`);
      assert.equal(V.codigo(d, p.x, p.y), cod, `la ficha de ${cod} cae en su región`);
      // Mover la ficha 4 px no la saca de su región: el dedo no la cambia sin querer.
      for (const [dx, dy] of [[4, 0], [-4, 0], [0, 4], [0, -4]]) assert.equal(V.codigo(d, p.x + dx, p.y + dy), cod, `${cod} con (${dx}, ${dy})`);
      assert.ok(p.x > 0 && p.x < 320 && p.y > 0 && p.y < 270, `ficha ${cod} dentro del viewBox`);
    }
    assert.equal(V.ficha(d, 'zz'), null);
  }
});

test('alg-venn: agregar ficha no cambia el dibujo', () => {
  const d = { conjuntos: [{ t: 'A', color: 'o' }, { t: 'B', color: 'i' }], universo: 'U', regiones: { '10': { t: '2, 4' }, '11': { t: '6' } } };
  const antes = V.dibujar(d, { sombra: ['11'] });
  V.ficha(d, '10');
  assert.equal(V.dibujar(d, { sombra: ['11'] }), antes);
});
