// Pruebas de la pieza «ari-cubitos-3d»: el respaldo plano (sin WebGL 2, en las miniaturas y en Node) dibuja los bloques
// que le pasa el motor, uno por uno y en su grupo; el alt dice cuántos hay de cada grupo; girar no cambia la figura.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./ari-cubitos-3d.js');
const MD = require('../../../plantillas/divisores/motor.js');

const UNO = { bloques: [{ x: 0, y: 0, z: 0, g: 0 }], grupos: [{ nombre: 'cubito', color: 'c-o' }] };

test('se registra en el kit con su parte viva', () => {
  assert.equal(Kit.piezas['ari-cubitos-3d'], P);
  assert.equal(typeof P.montar, 'function');
});

test('un cubito solo: se ven tres caras (las que miran a la cámara) y el alt lo cuenta', () => {
  const s = P.dibujar(UNO);
  assert.match(s, /^<svg/);
  assert.equal((s.match(/<polygon /g) || []).length, 3);
  assert.match(P.alt(UNO), /^1 bloques: 1 cubito\./);
});

test('la caja de divisores de 360: 24 cubitos, 18 pares en verde, y las caras tapadas no se dibujan', () => {
  const r = MD.cajaDivisores([3, 2, 1], [2, 3, 5], 'pares');
  const d = { bloques: r.cubitos.map(c => ({ x: c.x, y: c.y, z: c.z, g: c.resaltado ? 0 : 1 })), grupos: [{ nombre: 'pares', color: 'c-d' }, { nombre: 'impares' }] };
  assert.deepEqual(P.cuenta(d), [18, 6]);
  assert.match(P.alt(d), /24 bloques: 18 pares, 6 impares/);
  const pl = P.plano(d);
  // Caja de 4 × 3 × 2 vista desde un lado: solo su superficie visible (3 caras de la caja), no 24 × 3 caras.
  assert.equal(pl.caras.length, 4 * 3 + 4 * 2 + 3 * 2);
  assert.ok(pl.caras.some(c => c.g === 0) && pl.caras.some(c => c.g === 1));
  assert.ok(!/NaN|undefined/.test(P.dibujar(d)));
});

test('los rótulos van en el color de su grupo o marca (regla 4)', () => {
  const d = Object.assign({}, UNO, { grupos: [{ nombre: 'cubito', color: 'c-o', rotulo: 'k³' }], marco: { x: 0, y: 0, z: 0, w: 2, h: 2, d: 2, color: 'c-d', rotulo: '2³' }, marcas: [{ p: [3, 0, 0], texto: '×2', color: 'c-i' }] });
  const s = P.dibujar(d);
  assert.match(s, /fill="var\(--c-o[^"]*"[^>]*>k³</);
  assert.match(s, /fill="var\(--c-d[^"]*"[^>]*>2³</);
  assert.match(s, /fill="var\(--c-i[^"]*"[^>]*>×2</);
  assert.equal((s.match(/<line /g) || []).length, 12, 'el marco tiene 12 aristas');
});

test('girar conserva el largo y la cuenta (la vista no cambia la figura)', () => {
  const v = [0.7, -0.2, 1.1], g = P.girar(v, 40, -25);
  assert.ok(Math.abs(Math.hypot(...g) - Math.hypot(...v)) < 1e-12);
  const d = { bloques: [{ x: 0, y: 0, z: 0, g: 0 }, { x: 1, y: 0, z: 0, g: 0 }], grupos: [{ nombre: 'a', color: 'c-o' }] };
  for (const vista of [{ giro: 0, inclinacion: 10 }, { giro: 120, inclinacion: 60 }]) assert.deepEqual(P.cuenta(Object.assign({ vista }, d)), [2]);
});

test('ladrillos (bloques de otro tamaño) y el tope de bloques', () => {
  const d = { bloques: [{ x: 0, y: 0, z: 0, w: 3, h: 2, d: 1, g: 0 }], grupos: [{ nombre: 'ladrillo', color: 'c-f' }] };
  assert.equal(P.plano(d).caras.length, 3);
  const muchos = { bloques: Array.from({ length: P.MAX + 1 }, (_, i) => ({ x: i, y: 0, z: 0, g: 0 })), grupos: [{ nombre: 'x' }] };
  assert.throws(() => P.dibujar(muchos), /tope/);
  assert.throws(() => P.dibujar({ bloques: [{ x: 0, y: 0, z: 0, g: 3 }], grupos: [] }), /grupo/);
});
