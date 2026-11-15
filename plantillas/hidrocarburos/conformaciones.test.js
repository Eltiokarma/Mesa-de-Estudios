// Pruebas de las conformaciones en 3D (motor.js, sección «Conformaciones»), para la mesa 3D «El enlace que gira».
const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('./motor.js');

const dist = (a, b) => Math.hypot(...a.pos.map((x, i) => x - b.pos[i])) * 154;
const por = c => new Map(c.atomos.map(a => [a.id, a]));

test('largos de enlace y ángulos ideales con cualquier giro', () => {
  for (const mol of Object.keys(M.CONFORMABLES)) for (let phi = 0; phi < 360; phi += 30) {
    const c = M.conformacion(mol, phi), A = por(c);
    for (const e of c.enlaces) {
      const a = A.get(e.a), b = A.get(e.b), d = dist(a, b);
      const esperado = a.t === 'H' || b.t === 'H' ? 109 : e.orden === 2 ? 134 : 154;
      assert.ok(Math.abs(d - esperado) < 1e-9, `${mol} ${phi}: ${a.t}–${b.t} ${d}`);
    }
    // Cada carbono: 4 vecinos a 109,47° (sp³) o 3 a 120° (sp²).
    for (const a of c.atomos.filter(x => x.t === 'C')) {
      const v = c.enlaces.filter(e => e.a === a.id || e.b === a.id).map(e => A.get(e.a === a.id ? e.b : e.a));
      const dobles = c.enlaces.filter(e => (e.a === a.id || e.b === a.id) && e.orden === 2).length;
      assert.equal(v.length, dobles ? 3 : 4, `${mol}: valencia`);
      const ang = dobles ? 120 : Math.acos(-1 / 3) * 180 / Math.PI;
      for (let i = 0; i < v.length; i++) for (let j = i + 1; j < v.length; j++) {
        const p = v[i].pos.map((x, k) => x - a.pos[k]), q = v[j].pos.map((x, k) => x - a.pos[k]);
        const g = Math.acos(p.reduce((s, x, k) => s + x * q[k], 0) / Math.hypot(...p) / Math.hypot(...q)) * 180 / Math.PI;
        assert.ok(Math.abs(g - ang) < 1e-6, `${mol} ${phi}: ángulo ${g}`);
      }
    }
  }
});

test('el diedro medido C1–C2–C3–C4 es el φ pedido; el doble enlace no gira', () => {
  for (let phi = 0; phi < 360; phi += 30) {
    const c = M.conformacion('butano', phi), C = c.atomos.filter(a => a.t === 'C');
    assert.ok(Math.abs(M.diedro(C[2].pos, C[0].pos, C[1].pos, C[3].pos) - phi) < 1e-9 || phi === 0);
    const cis = M.conformacion('cis-but-2-eno', phi);
    assert.equal(cis.phi, 0);
    assert.deepEqual(cis.atomos, M.conformacion('cis-but-2-eno', 0).atomos);
  }
});

test('anti es la de CH₃ más lejanos; φ y 360° − φ dan la misma distancia', () => {
  const max = M.distanciaMaxima('butano');
  assert.equal(M.conformacion('butano', 180).distancia, max);
  for (let phi = 0; phi < 360; phi += 30) {
    assert.ok(Math.abs(M.conformacion('butano', phi).distancia - M.conformacion('butano', 360 - phi).distancia) < 1e-9);
  }
  assert.ok(M.conformacion('trans-but-2-eno').distancia > M.conformacion('cis-but-2-eno').distancia);
  assert.throws(() => M.conformacion('propano', 0), /no conozco/);
});

test('ningún átomo choca con otro (ninguna distancia menor que un C–H)', () => {
  for (const mol of Object.keys(M.CONFORMABLES)) for (let phi = 0; phi < 360; phi += 30) {
    const a = M.conformacion(mol, phi).atomos;
    for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) assert.ok(dist(a[i], a[j]) >= 109 - 1e-9, `${mol} ${phi}`);
  }
});
