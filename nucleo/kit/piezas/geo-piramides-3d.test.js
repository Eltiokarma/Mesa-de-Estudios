// Pruebas de la pieza «geo-piramides-3d»: el alt dice el volumen de cada pirámide (un tercio de la caja) calculado por
// nucleo/solidos3d.js; el respaldo dibuja las 5 caras de cada pirámide a la vista; girar no cambia lo que dice.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./geo-piramides-3d.js');

test('se registra en el kit con su parte viva', () => {
  assert.equal(Kit.piezas['geo-piramides-3d'], P);
  assert.equal(typeof P.montar, 'function');
});

test('cubo de arista 2: tres pirámides de volumen 2,67, quince caras en el respaldo', () => {
  const d = { caja: { a: 2, b: 2, c: 2 }, separar: 0, ver: 'todas' };
  assert.match(P.alt(d), /Cubo de arista 2, de volumen 8, con tres pirámides.*volumen 2,67, un tercio/);
  assert.equal((P.dibujar(d).match(/<polygon /g) || []).length, 15);
});

test('una sola pirámide de la caja: 5 caras y el mismo tercio, aunque tenga otra forma', () => {
  for (const ver of ['0', '1', '2']) {
    const d = { caja: { a: 3, b: 1.6, c: 2 }, separar: 0.5, ver };
    assert.equal((P.dibujar(d).match(/<polygon /g) || []).length, 5);
    assert.match(P.alt(d), /volumen 3,2, un tercio/);
  }
});

test('separar no cambia los volúmenes y el SVG no tiene NaN', () => {
  const a = { caja: { a: 2, b: 2, c: 2 }, separar: 1, ver: 'todas' }, b = Object.assign({ vista: { giro: 0, inclinacion: 60 } }, a);
  assert.ok(!/NaN|undefined/.test(P.dibujar(a)));
  assert.equal(P.alt(a), P.alt(b));
  assert.notEqual(P.dibujar(a), P.dibujar(b));
});
