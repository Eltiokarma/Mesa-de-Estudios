// Pruebas de la pieza «geo-espacio-3d»: el respaldo plano y el alt muestran lo que calcula nucleo/solidos3d.js
// (sombra y altura de la varilla; PH y el pie del diedro); girar la vista no cambia la figura.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./geo-espacio-3d.js');

test('se registra en el kit con su parte viva', () => {
  assert.equal(Kit.piezas['geo-espacio-3d'], P);
  assert.equal(typeof P.montar, 'function');
});

test('varilla a 60°: la sombra es la mitad del largo, también en el alt', () => {
  const d = { modo: 'varilla', a: 60, L: 2 };
  assert.ok(Math.abs(P.figura(d).g.sombra - 1) < 1e-12);
  assert.match(P.alt(d), /sombra AH mide 1 y su altura BH, 1,73/);
  const s = P.dibujar(d);
  assert.match(s, /^<svg/);
  assert.ok(!/NaN|undefined/.test(s));
  assert.equal((s.match(/<polyline /g) || []).length, 1);                // el arco del ángulo α
});

test('varilla parada: sin sombra ni arco, y el alt lo dice', () => {
  const d = { modo: 'varilla', a: 90, L: 2.5 };
  assert.equal(P.figura(d).segs.length, 1);
  assert.doesNotMatch(P.dibujar(d), /<polyline /);
  assert.match(P.alt(d), /solo un punto/);
});

test('diedro: PH = p · sen φ y, si es obtuso, H cae fuera de la cara', () => {
  const agudo = { modo: 'diedro', phi: 30, p: 2 }, obtuso = { modo: 'diedro', phi: 150, p: 2 };
  assert.match(P.alt(agudo), /a 1 del plano del piso.*sobre la cara/);
  assert.match(P.alt(obtuso), /a 1 del plano del piso.*fuera de la cara/);
  assert.equal(P.figura(obtuso).caras.length, 3);                       // la prolongación del piso, discontinua
  assert.match(P.dibujar(obtuso), /stroke-dasharray="5 4"/);
});

test('girar la vista no cambia lo que dice la figura', () => {
  const a = { modo: 'diedro', phi: 75, p: 1.5 }, b = Object.assign({ vista: { giro: -60, inclinacion: 40 } }, a);
  assert.equal(P.alt(a), P.alt(b));
  assert.notEqual(P.dibujar(a), P.dibujar(b));
});
