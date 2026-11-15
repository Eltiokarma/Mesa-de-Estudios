// Pruebas de la pieza «geo-cubitos-3d»: el alt cuenta las clases con nucleo/solidos3d.js; cerrado, el respaldo solo
// dibuja las caras de afuera (3 n² en la vista de esquina); abierto, aparecen los de adentro; girar no cambia la cuenta.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./geo-cubitos-3d.js');

test('se registra en el kit con su parte viva', () => {
  assert.equal(Kit.piezas['geo-cubitos-3d'], P);
  assert.equal(typeof P.montar, 'function');
});

test('cubo de lado 3 cerrado: se ven 3 · 9 caras, todas pintadas, y el alt cuenta las clases', () => {
  const d = { n: 3, abrir: 0, ver: 'todas' };
  const pl = P.plano(d);
  assert.equal(pl.caras.length, 27);
  assert.ok(pl.caras.every(c => c.pintada));
  assert.match(P.alt(d), /8 esquinas con 3 caras pintadas, 12 con 2, 6 con 1 y 1 sin pintar; 27 en total/);
});

test('abierto, se ve el cubito del centro, sin ninguna cara pintada', () => {
  const pl = P.plano({ n: 3, abrir: 1, ver: '0' });
  assert.equal(pl.caras.length, 3);
  assert.ok(pl.caras.every(c => c.clase === 0 && !c.pintada));
  assert.match(P.alt({ n: 3, abrir: 1, ver: '0' }), /solo el único cubito sin caras pintadas \(interior\)/);
});

test('cada cubito de la clase k muestra k caras pintadas', () => {
  for (const k of [3, 2, 1]) {
    const g = P.figura({ n: 4, abrir: 1, ver: String(k) });
    assert.ok(g.vistos.length > 0 && g.vistos.every(q => q.pintadas.length === k));
    assert.equal(g.vistos.length, g.cuenta[k]);
  }
});

test('el SVG no tiene NaN y girar la vista no cambia la cuenta', () => {
  const a = { n: 5, abrir: 0.5, ver: 'todas' }, b = Object.assign({ vista: { giro: -70, inclinacion: 50 } }, a);
  assert.ok(!/NaN|undefined/.test(P.dibujar(a)));
  assert.equal(P.alt(a), P.alt(b));
  assert.notEqual(P.dibujar(a), P.dibujar(b));
});
