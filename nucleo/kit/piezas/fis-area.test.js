// Pruebas de la pieza «fis-area»: la cuadrícula tiene tantas líneas como cuadraditos caben, la fila resaltada, el cubo
// con su cuadrícula, nada de NaN ni colores fijos, alto fijo, pureza y texto alternativo.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./fis-area.js');

const lineas = s => (s.match(/stroke-width="0.8"/g) || []).length;

test('registrada en el kit', () => assert.equal(Kit.piezas['fis-area'], P));

test('un cuadrado de 2 m con cuadros de 1 m tiene una línea por lado; con cuadros de 1 dm, 19', () => {
  assert.equal(lineas(P.dibujar({ cuadros: [{ lado: 2, max: 3, celdas: 1 }] })), 2);
  assert.equal(lineas(P.dibujar({ cuadros: [{ lado: 2, max: 3, celdas: 10 }] })), 2 * 19);
});

test('si los cuadraditos no se verían, la cuadrícula no se dibuja', () => {
  assert.equal(lineas(P.dibujar({ cuadros: [{ lado: 1, celdas: 100 }] })), 0);
});

test('la fila resaltada y los rótulos salen', () => {
  const s = P.dibujar({ cuadros: [{ lado: 1, celdas: 10, fila: true, arriba: '1 m = 10 dm', abajo: '100 dm²', nombre: 'cuadros de 1 dm' }] });
  assert.match(s, /fill-opacity="0.3"/);
  for (const t of ['1 m = 10 dm', '100 dm²', 'cuadros de 1 dm']) assert.ok(s.includes(`>${t}<`), t);
});

test('el cubo lleva cuadrícula en sus tres caras', () => {
  const s = P.dibujar({ cubo: { n: 10, arriba: '1 dm', abajo: '1000 cm³ = 1 L' } });
  assert.equal((s.match(/stroke-width="0.7"/g) || []).length, 9 * 6);
  assert.match(s, />1000 cm³ = 1 L</);
});

test('sin NaN ni colores fijos, alto fijo, puro y con texto alternativo', () => {
  const altos = new Set();
  for (const d of [{}, { cuadros: [{ lado: 2.5, max: 3, celdas: 1 }, { lado: 2.5, max: 3, celdas: 10 }] }, { cuadros: [{ lado: 0 }] }, { cubo: { n: 4 } }]) {
    const s = P.dibujar(d);
    assert.ok(!/NaN|undefined|Infinity/.test(s));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
    assert.equal(s, P.dibujar(d));
    altos.add(s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)[2]);
    assert.ok(P.alt(d).length > 8 && !/NaN/.test(P.alt(d)));
  }
  assert.equal(altos.size, 1);
});

test('un lado de 2,5 m con cuadros de 1 m deja cuadros enteros y un borde partido', () => {
  assert.equal(lineas(P.dibujar({ cuadros: [{ lado: 2.5, max: 3, celdas: 1 }] })), 2 * 2);
});

test('las vistas: estado.vista elige la figura', () => {
  const d = { vistas: [{ cuadros: [{ lado: 1, celdas: 10 }] }, { cubo: { n: 10 } }] };
  assert.equal(lineas(P.dibujar(d, { vista: 0 })), 18);
  assert.match(P.dibujar(d, { vista: 1 }), /kit-cubo/);
});


test('cubo sin «abajo»: no escribe el volumen ni lo dice el texto alternativo', () => {
  const d = { color: 'i', cubo: { n: 2, arriba: '2 dm', nombre: 'cada cubito: 1 dm de lado' } };
  const s = P.dibujar(d);
  assert.ok(!/NaN|undefined/.test(s));
  assert.ok(!/dm³|= 8/.test(s));
  assert.equal(P.alt(d), 'Un cubo de 2 dm de lado con una cuadrícula en sus caras (cada cubito: 1 dm de lado).');
});
