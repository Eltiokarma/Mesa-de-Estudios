// Pruebas de la pieza «geo-revolucion-3d»: el alt y el respaldo plano dicen el volumen de nucleo/solidos3d.js (Pappus);
// con la vuelta entera, nombra el sólido; girar la vista no cambia la figura.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./geo-revolucion-3d.js');

test('se registra en el kit con su parte viva', () => {
  assert.equal(Kit.piezas['geo-revolucion-3d'], P);
  assert.equal(typeof P.montar, 'function');
});

test('semicírculo pegado al eje, vuelta entera: esfera de volumen 4,19', () => {
  const d = { region: 'semicirculo', d: 0, grados: 360 };
  assert.match(P.alt(d), /barre una esfera/);
  assert.match(P.alt(d), /volumen 4,19/);
  const s = P.dibujar(d);
  assert.match(s, /^<svg/);
  assert.ok(!/NaN|undefined/.test(s));
});

test('sin girar no hay superficie ni camino; con 90°, un cuarto del volumen completo', () => {
  const cero = P.dibujar({ region: 'rectangulo', d: 1, grados: 0 });
  assert.doesNotMatch(cero, /<polyline /);
  assert.equal((cero.match(/<polygon /g) || []).length, 1);
  const cuarto = P.figura({ region: 'rectangulo', d: 1, grados: 90 }).R, entero = P.figura({ region: 'rectangulo', d: 1, grados: 360 }).R;
  assert.ok(Math.abs(4 * cuarto.volumen - entero.volumen) < 1e-9);
  assert.match(P.alt({ region: 'rectangulo', d: 1, grados: 90 }), /Gira 90° de 360°/);
});

test('el camino del centroide termina donde llegó la región', () => {
  const g = P.figura({ region: 'triangulo', d: 0.5, grados: 210 }), fin = g.camino[g.camino.length - 1];
  const r = Math.hypot(fin[0], fin[2]);
  assert.ok(Math.abs(r - g.R.rc) < 1e-9 && Math.abs(fin[1] - g.R.yc) < 1e-9);
  assert.ok(Math.abs(Math.atan2(-fin[2], fin[0]) - (210 - 360) * Math.PI / 180) < 1e-9);
});

test('girar la vista no cambia lo que dice', () => {
  const a = { region: 'circulo', d: 1, grados: 270 }, b = Object.assign({ vista: { giro: -50, inclinacion: 60 } }, a);
  assert.equal(P.alt(a), P.alt(b));
  assert.notEqual(P.dibujar(a), P.dibujar(b));
});
