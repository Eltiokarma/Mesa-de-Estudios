// Pruebas de la pieza «geo-simetria-3d»: el respaldo plano y el alt dicen lo que calcula nucleo/solidos3d.js (si el
// reflejo coincide, cuántos planos de simetría hay); girar la vista no cambia la figura.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./geo-simetria-3d.js');
const S = require('../../solidos3d.js');

test('se registra en el kit con su parte viva', () => {
  assert.equal(Kit.piezas['geo-simetria-3d'], P);
  assert.equal(typeof P.montar, 'function');
});

test('plano horizontal del cubo: el reflejo coincide y el alt lo dice', () => {
  const d = { solido: 'cubo', normal: [0, 1, 0] };
  assert.equal(P.figura(d).sim, true);
  assert.match(P.alt(d), /es un plano de simetría/);
  const s = P.dibujar(d);
  assert.match(s, /^<svg/);
  assert.equal((s.match(/stroke-dasharray/g) || []).length, 12);          // las 12 aristas del reflejo
  assert.equal((s.match(/<polygon /g) || []).length, 1);                  // el plano
});

test('un plano oblicuo de la pirámide no es de simetría: el reflejo queda corrido', () => {
  const d = { solido: 'piramide-4', normal: S.normalDe(30, 0) };
  assert.equal(P.figura(d).sim, false);
  assert.match(P.alt(d), /no es un plano de simetría/);
});

test('con «todos», el respaldo dibuja tantos planos como cuenta el motor', () => {
  for (const [solido, n] of [['cubo', 9], ['prisma-6', 7], ['piramide-4', 4], ['ortoedro', 3]]) {
    const d = { solido, normal: [0, 1, 0], todos: true };
    assert.equal((P.dibujar(d).match(/<polygon /g) || []).length, n, solido);
    assert.match(P.alt(d), new RegExp(`sus ${n} planos`));
  }
});

test('girar la vista no cambia la figura ni lo que dice', () => {
  const a = { solido: 'tetraedro', normal: S.normalDe(45, 270) }, b = Object.assign({ vista: { giro: 80, inclinacion: -30 } }, a);
  assert.equal(P.alt(a), P.alt(b));
  assert.equal(P.figura(a).sim, true);
  assert.notEqual(P.dibujar(a), P.dibujar(b));
  assert.ok(!/NaN|undefined/.test(P.dibujar(b)));
});
