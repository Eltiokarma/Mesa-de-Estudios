// Pruebas de la pieza «fis-cuentas»: el largo de cada barra es su valor a una sola escala (1 px), el signo decide
// arriba o abajo, nada de NaN ni colores fijos, texto de 14 o más, alto fijo y pieza pura.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./fis-cuentas.js');
const { CERO, MEDIA } = P.constantes;

const D = { max: 500, barras: [{ rotulo: 'Q', valor: 500, texto: '+500 J', color: 'o' }, { rotulo: 'W', valor: -200, texto: '−200 J', color: 'i', desde: 1 }, { rotulo: 'ΔU', valor: 300, texto: '+300 J', color: 'd', desde: 2 }], igual: 2 };
const rects = s => [...s.matchAll(/<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"[^>]*stroke="var\(--c-([a-z])\)"/g)].map(m => ({ y: +m[2], h: +m[4], c: m[5] }));

test('se registra en el kit', () => assert.equal(Kit.piezas['fis-cuentas'], P));

test('fidelidad: el largo es el valor por la escala y el signo decide el lado', () => {
  const r = rects(P.dibujar(D, {}));
  assert.equal(r.length, 3);
  assert.ok(Math.abs(r[0].h - MEDIA) <= 1 && Math.abs(r[0].y + r[0].h - CERO) <= 1, 'Q = +500 sube desde el cero');
  assert.ok(Math.abs(r[1].h - MEDIA * 200 / 500) <= 1 && Math.abs(r[1].y - CERO) <= 1, 'W = −200 baja desde el cero');
  assert.ok(Math.abs(r[2].h - MEDIA * 300 / 500) <= 1);
});

test('el corte esconde lo que viene y deja lo hecho', () => {
  assert.equal(rects(P.dibujar(D, { corte: 0 })).length, 1);
  assert.equal(rects(P.dibujar(D, { corte: 1 })).length, 2);
  assert.match(P.dibujar(D, { corte: 0 }), />\?</);
});

test('sin NaN ni colores fijos; texto de 14 o más; alto fijo; pura; fantasma a trazos', () => {
  const altos = new Set();
  for (const [d, e] of [[D, {}], [D, { fantasma: { indice: 2, valor: 700, rotulo: 'sumar Q y W' } }], [{ barras: [{ rotulo: 'U', valor: 0, texto: '0 J', color: 'h' }] }, {}], [{ barras: [] }, {}]]) {
    const s = P.dibujar(d, e);
    assert.equal(s, P.dibujar(d, e));
    assert.ok(!/NaN|undefined|null|Infinity/.test(s));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
    for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14);
    altos.add(s.match(/viewBox="0 0 320 ([\d.]+)"/)[1]);
  }
  assert.equal(altos.size, 1);
  assert.match(P.dibujar(D, { fantasma: { indice: 2, valor: 700, rotulo: 'x' } }), /stroke-dasharray/);
  assert.match(P.alt(D), /Q \+500 J/);
});
