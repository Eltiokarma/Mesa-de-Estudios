// Pruebas de la pieza «fis-espacio-3d»: el respaldo plano (sin WebGL 2, en las miniaturas y en Node) dibuja lo que
// calculan las escenas de nucleo/fisica3d.js con los motores; el alt lo dice con sus números; girar no cambia la figura;
// cada escena cabe en el presupuesto de docs/3d.md (60 mallas).
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./fis-espacio-3d.js');
const F = require('../../fisica3d.js');

test('se registra en el kit con su parte viva', () => {
  assert.equal(Kit.piezas['fis-espacio-3d'], P);
  assert.equal(typeof P.montar, 'function');
});

test('el respaldo dibuja una flecha por vector no nulo, con su rótulo del color de su variable', () => {
  const d = F.lorentz({ th: 90, fi: 0, q: 1 }).datos;
  const s = P.dibujar(d);
  assert.match(s, /^<svg/);
  assert.equal((s.match(/class="kit-flecha"/g) || []).length, d.flechas.length);
  assert.match(s, /fill="var\(--c-d, #4f7a17\)"[^>]*>F</);         // F en verde
  assert.match(s, /fill="var\(--c-o, #b85a06\)"[^>]*>v</);         // v en naranja
  const sin = P.dibujar(F.lorentz({ th: 0, fi: 0, q: 1 }).datos);
  assert.doesNotMatch(sin, />F</);                                   // v paralela a B: sin fuerza
});

test('el alt cuenta lo que calcula el motor', () => {
  assert.match(P.alt(F.vectores({ ax: 2, ay: 2, az: 1, b: 'x', ver: 'comp' }).datos), /mide 3\./);
  assert.match(P.alt(F.espira({ th: 60, B: 1, A: 0.16 }).datos), /Φ = 0,08 Wb/);
  assert.match(P.alt(F.ondaEM({ lam: 3, E0: 3, t: 2.5 }).datos), /E vale −3 V\/m/);
  assert.match(P.dibujar(F.tiro({ v0: 20, ang: 30, t: 1 }).datos), /aria-label="[^"]*y = 5 m/);
});

test('la proyección respeta la geometría: girar conserva largos y la flecha A apunta a su punta', () => {
  const v = [0.4, -1.2, 0.7];
  for (const [g, i] of [[0, 0], [35, 22], [-80, 60]]) casi(Math.hypot(...P.girar(v, g, i)), Math.hypot(...v));
  const d = F.vectores({ ax: 2, ay: 0, az: 0, b: 'x', ver: 'comp' }).datos;
  const pl = P.plano(Object.assign({}, d, { vista: { giro: 0, inclinacion: 0 } }));
  const a = pl.flechas[0];
  casi(a.a[0] - a.de[0], 2 * 52 * d.escala); casi(a.a[1] - a.de[1], 0);    // de frente, A = 2x̂ es horizontal y mide 2 · escala
  // x̂ × ŷ = ẑ también en la escena: la pieza conserva la mano derecha al pasar a three.js
  const [x, y, z] = [P.aTres([1, 0, 0]), P.aTres([0, 1, 0]), P.aTres([0, 0, 1])];
  const cr = [x[1] * y[2] - x[2] * y[1], x[2] * y[0] - x[0] * y[2], x[0] * y[1] - x[1] * y[0]];
  assert.deepEqual(cr.map(c => c + 0), z.map(c => c + 0));
});

test('cada escena de física cabe en el presupuesto (60 mallas) y no tiene NaN', () => {
  const escenas = [F.vectores({ ax: -2, ay: 2, az: 2, b: 'xy', ver: 'cruz' }), F.vectores({ ax: 2, ay: -2, az: -2, b: 'x', ver: 'comp' }),
    F.lorentz({ th: 45, fi: 135, q: -1 }), F.espira({ th: 30, B: 1, A: 0.16 }), F.ondaEM({ lam: 1.5, E0: 6, t: 3 }),
    F.tiro({ v0: 30, ang: 60, t: 6 }), F.orbita({ r: 'dia', inc: 60, t: 5 })];
  for (const e of escenas) {
    assert.ok(P.mallas(e.datos) <= 60, `${e.datos.escena}: ${P.mallas(e.datos)} mallas`);
    assert.doesNotMatch(P.dibujar(e.datos), /NaN|undefined|Infinity/);
  }
});

function casi(a, b) { assert.ok(Math.abs(a - b) < 1e-9, `${a} ≠ ${b}`); }
