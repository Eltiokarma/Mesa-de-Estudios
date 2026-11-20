// Pruebas de la pieza «alg-caja» (la caja de cartón de Rubén, unidad «Ecuaciones polinomiales»): se dibuja sin NaN ni
// colores fijos, es pura, está marcada como dibujo de prueba y trae su texto alternativo; nunca usa carmín ni verde. Es
// fiel: las tres aristas dibujadas guardan la proporción de sus medidas. Con números (docs/molde-unidad.md §6): todo cabe
// en el lienzo con 4 de margen y ningún texto pisa a otro. Se revisan las muestras de abajo (las 125 cajas del juego y
// las de los ejemplos) y todas las figuras de la teoría que usan la pieza.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('../kit.js');
const P = require('./alg-caja.js');

const MUESTRAS = [{}, { objeto: 'caja' }];
for (let l = 1; l <= 5; l++) for (let w = 1; w <= 5; w++) for (let h = 1; h <= 5; h++) MUESTRAS.push({ objeto: 'caja', medidas: [l, w, h], color: 'f', tope: [5, 5, 5], arriba: [['volumen: ', null, 400], [`${l * w * h} dm³`, null, 700]] });
MUESTRAS.push({ objeto: 'caja', medidas: [3, 4, 5], rotulos: ['x', 'x + 1', 'x + 2'], arriba: [['volumen: ', null, 400], ['60 dm³', null, 700]] },
  { objeto: 'caja', medidas: [2, 3, 5], rotulos: ['?', '?', '?'], arriba: [['volumen: ?', null, 700]] },
  { objeto: 'caja', medidas: [1, 3, 4], rotulos: ['x + 10', 'x + 12', '?'], nombres: false });
const def = require('../../../contenido/teoria/algebra/ecuaciones-polinomiales.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const Teoria = require('../../teoria.js');
const deTeoria = [];
for (const i of def.ideas) {
  const add = (fg, pieza) => { if (fg && (fg.pieza || pieza) === 'alg-caja') deTeoria.push({ datos: fg.datos, estado: fg.estado || {} }); };
  i.lee.tarjetas.forEach(t => add(t.dibujo, t.pieza));
  for (const v of Teoria.grilla(i.juega.controles)) add(i.juega.dibujo(v), i.juega.pieza || i.pieza);
  i.ejemplos.forEach(e => add(e.figura));
}
const TODAS = [...MUESTRAS.map(datos => ({ datos, estado: {} })), ...deTeoria];

test('se dibuja puro, sin NaN, marcado como prueba, con texto alternativo y sin carmín ni verde', () => {
  for (const { datos, estado } of TODAS) {
    const a = P.dibujar(datos, estado), b = P.dibujar(datos, estado);
    assert.equal(a, b, 'pura');
    assert.ok(!/NaN|undefined|Infinity/.test(a), JSON.stringify(datos).slice(0, 120));
    assert.ok(/data-prueba="si"/.test(a));
    assert.ok(/aria-label="[^"]{20,}"/.test(a));
    assert.ok(!/var\(--c-[hd]\)/.test(a));
    assert.ok(!/#[0-9a-f]{3,6}/i.test(a), 'sin colores fijos');
  }
  assert.ok(deTeoria.length >= 125 + 4, `figuras de la teoría: ${deTeoria.length}`);
});

test('todo cabe en el lienzo con su margen y ningún texto pisa a otro ni a la caja', () => {
  for (const { datos, estado } of TODAS) {
    assert.ok(P.cabe(datos, estado), `no cabe: ${JSON.stringify(datos).slice(0, 140)}`);
    const g = P.geometria(datos, estado), t = g.textos;
    for (let i = 0; i < t.length; i++) for (let j = i + 1; j < t.length; j++) {
      const a = t[i], b = t[j], pisa = a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
      assert.ok(!pisa, `«${a.txt}» pisa a «${b.txt}»: ${JSON.stringify(datos).slice(0, 100)}`);
    }
    // El rótulo del largo va debajo de la caja, el del alto a su izquierda y la línea de arriba sobre ella.
    const caja = g.objetos[0];
    for (const x of t) {
      if (x.que === 'largo') assert.ok(x.y0 >= caja.y1, 'largo debajo');
      if (x.que === 'alto') assert.ok(x.x1 <= caja.x0, 'alto a la izquierda');
      if (x.que === 'arriba') assert.ok(x.y1 <= caja.y0, 'arriba sobre la caja');
    }
  }
});

test('fiel: las aristas dibujadas guardan la proporción de las medidas, a la misma escala en todo el juego', () => {
  const g1 = P.geometria({ medidas: [1, 2, 3], tope: [5, 5, 5] }), g2 = P.geometria({ medidas: [5, 4, 2], tope: [5, 5, 5] });
  assert.equal(g1.s, g2.s, 'misma escala con el mismo tope');
  for (const g of [g1, g2]) {
    const ancho = g.P.fd[0] - g.P.fi[0], alto = g.P.fi[1] - g.P.si[1];
    assert.ok(Math.abs(ancho / alto - g.L / g.Al) < 1e-9);
  }
});
