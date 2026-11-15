// Pruebas de la pieza «trig-campo-3d»: el respaldo plano y el alt muestran lo que calcula el motor del campo
// (plantillas/trig-angulos-verticales/motor.js); girar no cambia la figura.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./trig-campo-3d.js');
const M = require('../../../plantillas/trig-angulos-verticales/motor.js');

const DOS = { h: 12, obs: [{ id: 'A', az: 180, d: 16, ang: 'α' }, { id: 'B', az: 90, d: 9, ang: 'β' }], par: true, pie: true };

test('se registra en el kit con su parte viva', () => {
  assert.equal(Kit.piezas['trig-campo-3d'], P);
  assert.equal(typeof P.montar, 'function');
});

test('el alt dice las elevaciones y AB que da el motor', () => {
  const c = M.campo(DOS);
  const a = P.alt(DOS);
  assert.match(a, /Torre de 12 m/);
  assert.match(a, new RegExp(`elevación de ${Kit.formatear(c.obs[0].elev, 1)}°`));
  assert.match(a, /A, al S, a 16 m/);
  assert.match(a, new RegExp(`AB mide ${Kit.formatear(c.pares[0].distancia, 1)} m`));
  assert.match(a, /ángulo en el pie de 90°/);
});

test('el respaldo es un SVG sin NaN: torre, dos distancias, dos visuales, AB y los arcos', () => {
  const s = P.dibujar(DOS, {});
  assert.match(s, /^<svg/);
  assert.doesNotMatch(s, /NaN|undefined|Infinity/);
  assert.equal((s.match(/var\(--c-d/g) || []).length, 2, 'dos visuales');
  assert.equal((s.match(/var\(--c-i/g) || []).length, 2, 'dos distancias al pie');
  assert.equal((s.match(/var\(--c-f/g) || []).length, 1, 'AB');
  assert.equal((s.match(/<polyline/g) || []).length, 3, 'dos elevaciones y el ángulo en el pie');
  const sin = P.dibujar(DOS, { visuales: false });
  assert.equal((sin.match(/var\(--c-d/g) || []).length, 0, 'sin visuales');
});

test('la escena respeta el motor: las distancias en el piso salen a escala', () => {
  const e = P.escena(DOS);
  const ab = Math.hypot(e.obs[0].pie[0] - e.obs[1].pie[0], e.obs[0].pie[2] - e.obs[1].pie[2]) / e.k;
  assert.ok(Math.abs(ab - M.campo(DOS).pares[0].distancia) < 1e-9);
  assert.ok(Math.abs(e.punta[1] / e.k - 12) < 1e-9);
  // B al este: x positiva; A al sur: z positiva (el norte queda al fondo).
  assert.ok(e.obs[1].pie[0] > 0 && Math.abs(e.obs[1].pie[2]) < 1e-9);
  assert.ok(e.obs[0].pie[2] > 0);
});

test('girar conserva el largo (la vista no cambia la figura)', () => {
  const v = [1.2, 0.7, -0.4], g = P.girar(v, 70, -30);
  assert.ok(Math.abs(Math.hypot(...g) - Math.hypot(...v)) < 1e-12);
  const otra = Object.assign({}, DOS, { vista: { giro: 120, inclinacion: 50 } });
  assert.notEqual(P.dibujar(otra), P.dibujar(DOS));
  assert.equal(P.alt(otra), P.alt(DOS));
});
