// Pruebas de la pieza «fis-combi»: la combi queda donde dicen los metros, un tramo por segundo, el corte de «Mira»,
// nada de NaN ni colores fijos, alto fijo, pureza y texto alternativo con la rapidez.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./fis-combi.js');

test('registrada en el kit', () => assert.equal(Kit.piezas['fis-combi'], P));

test('un tramo por segundo, cada uno de v metros, y la combi firme en v · t', () => {
  const s = P.dibujar({ v: 20, segundos: 5 });
  assert.equal((s.match(/stroke="var\(--c-o\)" stroke-width="3"/g) || []).length, 5);
  assert.equal((s.match(/data-objeto="combi"/g) || []).length, 6);
  assert.equal((s.match(/kit-fantasma/g) || []).length, 5, 'las de los segundos anteriores son tenues');
  assert.match(s, />20 m</);
  assert.match(s, />5 s</);
  const X = P.escala({ v: 20 });
  const tramo = s.match(/<line x1="([\d.]+)" y1="[\d.]+" x2="([\d.]+)" y2="[\d.]+" stroke="var\(--c-o\)" stroke-width="3"/);
  assert.ok(Math.abs(+tramo[2] - +tramo[1] - (X(20) - X(0))) < 0.02);
});

test('el corte dibuja solo hasta ese segundo', () => {
  const s = P.dibujar({ v: 20, segundos: 5 }, { corte: 2 });
  assert.equal((s.match(/stroke="var\(--c-o\)" stroke-width="3"/g) || []).length, 2);
  assert.ok(!/>3 s</.test(s));
});

test('la combi es un dibujo de prueba marcado', () => assert.match(P.dibujar({}), /data-objeto="combi" data-prueba="si"/));

test('sin NaN ni colores fijos, alto fijo, puro y con texto alternativo', () => {
  const altos = new Set();
  for (const d of [{}, { v: 20, segundos: 5 }, { v: 12.5, segundos: 3, max: 60 }, { v: 40, segundos: 5, max: 200, rotulos: false }]) {
    const s = P.dibujar(d);
    assert.ok(!/NaN|undefined|Infinity/.test(s));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
    assert.equal(s, P.dibujar(d));
    altos.add(s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)[2]);
    assert.ok(P.alt(d).length > 30 && !/NaN|undefined/.test(P.alt(d)));
  }
  assert.equal(altos.size, 1);
});
