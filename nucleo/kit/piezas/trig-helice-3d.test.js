// Pruebas de la pieza «trig-helice-3d»: el respaldo plano y el alt muestran lo que calcula
// plantillas/circunferencia-trig/motor.js (helice); la sombra en la pared es la onda; girar no cambia la figura.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./trig-helice-3d.js');
const M = require('../../../plantillas/circunferencia-trig/motor.js');

const D = { A: 2, B: 1, g: 90 };

test('se registra en el kit con su parte viva', () => {
  assert.equal(Kit.piezas['trig-helice-3d'], P);
  assert.equal(typeof P.montar, 'function');
});

test('el alt dice vueltas, periodo y la altura de P que da el motor', () => {
  assert.match(P.alt(D), /da 2 vueltas en 720°/);
  assert.match(P.alt(D), /periodo 360°/);
  assert.match(P.alt(D), /a la altura 2\./);
  assert.match(P.alt({ A: 1.5, B: 2, g: 60 }), new RegExp(`altura ${Kit.formatear(M.helice({ A: 1.5, B: 2, g: 60 }).P.alto, 2)}`));
});

test('la sombra de la pared tiene la altura de la hélice y el fondo de la pared', () => {
  const e = P.escena({ A: 1.5, B: 2.5, g: 30 });
  e.helice.forEach((p, k) => { assert.equal(e.pared[k][1], p[1]); assert.equal(e.pared[k][0], p[0]); });
  assert.ok(new Set(e.pared.map(p => p[2])).size === 1, 'toda la sombra está en la pared');
  assert.equal(e.sombraP[1], e.P[1]);
});

test('el respaldo es un SVG sin NaN, con la onda roja y la llave verde', () => {
  const s = P.dibujar(D, {});
  assert.match(s, /^<svg/);
  assert.doesNotMatch(s, /NaN|undefined|Infinity/);
  assert.equal((s.match(/var\(--c-h/g) || []).length, 2, 'la onda y la sombra de P');
  assert.equal((s.match(/var\(--c-d/g) || []).length, 1, 'la llave del periodo');
  assert.equal((P.dibujar(D, { piso: false }).match(/stroke-dasharray="5 4"/g) || []).length, 0);
});

test('girar conserva el largo (la vista no cambia la figura)', () => {
  const v = [0.4, 1.3, -0.6], g = P.girar(v, -60, 25);
  assert.ok(Math.abs(Math.hypot(...g) - Math.hypot(...v)) < 1e-12);
  const otra = Object.assign({ vista: { giro: 90, inclinacion: 0 } }, D);
  assert.notEqual(P.dibujar(otra), P.dibujar(D));
  assert.equal(P.alt(otra), P.alt(D));
});
