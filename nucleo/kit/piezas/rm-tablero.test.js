// Pruebas de la pieza «rm-tablero»: cada marca cae en su casilla, el corte muestra solo lo hecho, null no dibuja
// casilla, el alto no cambia con el estado, sin NaN ni colores fijos y con texto de 14 o más.
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('./rm-tablero.js');

const d = {
  columnas: ['1', '2', '3'], filas: ['Ana', 'Beto'],
  celdas: [[{ marca: 'si', color: 'd' }, { marca: 'no', desde: 1 }, ''], [null, { t: '7', color: 'o', desde: 2 }, 'x']],
  marcos: [{ f: 0, c: 0, ancho: 3, color: 'i', desde: 2 }], notas: [{ t: 'Suma 15', desde: 2 }],
};
const limpio = s => {
  assert.ok(!/NaN|undefined|null|Infinity/.test(s));
  assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
  assert.ok(!/<script|\son[a-z]+\s*=|\sid=/i.test(s));
  for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14);
};

test('el corte muestra lo hecho y el alto no cambia', () => {
  const altos = new Set();
  for (const corte of [0, 1, 2]) {
    const s = P.dibujar(d, { corte });
    limpio(s);
    altos.add(s.match(/viewBox="0 0 320 ([\d.]+)"/)[1]);
    assert.equal(s.includes('>7<'), corte >= 2);
  }
  altos.add(P.dibujar(d, { corte: 2, fantasma: { celdas: { '0,2': '9' }, rotulo: 'Otra opción' } }).match(/viewBox="0 0 320 ([\d.]+)"/)[1]);
  assert.equal(altos.size, 1);
});

test('null no dibuja casilla: 5 casillas en la rejilla', () => {
  const s = P.dibujar(d, { corte: 2 });
  const rej = s.match(/<g class="kit-cuadricula">(.*?)<\/g>/)[1];
  assert.equal((rej.match(/<rect/g) || []).length, 5);
});

test('el fantasma va discontinuo y el texto alternativo nombra filas y columnas', () => {
  const s = P.dibujar(d, { corte: 2, fantasma: { celdas: { '0,2': '9' }, rotulo: 'Otra opción' } });
  assert.match(s, /kit-fantasma/); assert.match(s, /stroke-dasharray/);
  assert.match(P.alt(d), /Ana y 1: sí/);
});
