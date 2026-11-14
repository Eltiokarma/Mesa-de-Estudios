// Pruebas de la pieza «fis-riel»: las flechas de velocidad están a la misma escala (el largo dibujado es |v| por la
// escala), el carrito cae donde la regla del riel dice, nada de NaN ni colores fijos, alto fijo y filas que aparecen.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./fis-riel.js');

const D = {
  largo: 10, escalaV: 12, colores: { v: 'o' },
  filas: [
    { rotulo: 'Antes', nota: 'p = 8 kg·m/s', carros: [{ x: 2, m: 2, v: 4, rotulo: 'A' }, { x: 7, m: 2, v: 0, rotulo: 'B', variante: 'b' }] },
    { rotulo: 'Después', desde: 1, carros: [{ x: 5, m: 2, v: 2, rotulo: 'A' }, { x: P.pegado({ largo: 10 }, 5), m: 2, v: 2, rotulo: 'B', variante: 'b' }] },
  ],
};
const flechas = s => [...s.matchAll(/<line x1="([\d.-]+)" y1="([\d.-]+)" x2="([\d.-]+)" y2="[\d.-]+" stroke="var\(--c-o\)" stroke-width="3"/g)].map(m => [+m[1], +m[3]]);

test('registrada en el kit', () => assert.equal(Kit.piezas['fis-riel'], P));

test('fidelidad: el largo de cada flecha es |v| por la escala (la punta cuenta)', () => {
  const s = P.dibujar(D, { corte: 1 });
  const puntas = [...s.matchAll(/<path d="M([\d.-]+) [\d.-]+L/g)].map(m => +m[1]);
  const lineas = flechas(s);
  assert.equal(lineas.length, 2, 'A antes y, después, una sola flecha para A y B pegados (B quieto no tiene flecha)');
  const largos = lineas.map(([x1], i) => Math.abs(puntas[i] - x1)).sort((a, b) => a - b);
  assert.ok(Math.abs(largos[1] - 4 * 12) < 1, `4 m/s → 48 px (medido ${largos[1]})`);
  assert.ok(Math.abs(largos[0] - 2 * 12) < 1);
  assert.match(s, /A y B: 2 m\/s/);
});

test('las filas con desde > corte no dibujan carritos; v = 0 se escribe', () => {
  const s0 = P.dibujar(D, { corte: 0 }), s1 = P.dibujar(D, { corte: 1 });
  assert.equal((s0.match(/kit-carro/g) || []).length, 2);
  assert.equal((s1.match(/kit-carro/g) || []).length, 4);
  assert.match(s0, /B: v = 0/);
});

test('sin NaN ni colores fijos, alto que no cambia con el estado, texto alternativo con la relación', () => {
  const altos = new Set();
  for (const e of [{}, { corte: 0 }, { corte: 1 }]) {
    const s = P.dibujar(D, e);
    assert.ok(!/NaN|undefined|Infinity/.test(s));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
    altos.add(s.match(/height="([\d.]+)"/)[1]);
    assert.equal(s, P.dibujar(D, e), 'pura');
  }
  assert.equal(altos.size, 1);
  assert.match(P.alt(D), /A de 2 kg a 4 m\/s/);
  assert.ok(P.dibujar({}).includes('<svg'));
});
