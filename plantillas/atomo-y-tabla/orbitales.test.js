// Pruebas de los orbitales del hidrógeno (motor.js, sección «Orbitales»), para la mesa 3D «La nube del orbital».
// Los radios del 90 % se recalcularon aparte en Python con la fórmula general de R_nl (polinomios de Laguerre
// asociados) e integración trapezoidal fina; aquí se comparan con tolerancia de 1e-3 a₀ (el motor integra con Simpson).
const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('./motor.js');

const R90 = { '1s': 2.66116, '2s': 9.125385, '2p': 7.99359, '3s': 19.439095, '3p': 18.384922, '3d': 15.798108 };

test('el r90 de cada subnivel coincide con el cálculo independiente', () => {
  for (const id of M.ORBITALES) {
    const o = M.orbital(id);
    assert.ok(Math.abs(o.r90 - R90[o.subnivel]) < 1e-3, `${id}: ${o.r90}`);
  }
});

test('cada R_nl está normalizada: la probabilidad total es 1', () => {
  for (const [n, l] of [[1, 0], [2, 0], [2, 1], [3, 0], [3, 1], [3, 2]]) {
    assert.ok(Math.abs(M.dentroDe(n, l, 80, 20000) - 1) < 1e-6, `n = ${n}, l = ${l}`);
  }
});

test('nodos: n − l − 1 esféricos, l angulares y n − 1 en total; ψ vale 0 en cada nodo', () => {
  for (const id of M.ORBITALES) {
    const o = M.orbital(id);
    assert.equal(o.nodosRadiales, o.n - o.l - 1, id);
    assert.equal(o.nodosRadiales + o.nodosAngulares, o.n - 1, id);
    assert.equal(o.planos.length + 2 * o.conos.length, o.l, id);
    for (const r of o.radiales) assert.ok(Math.abs(M.psi(id, 0.6 * r, 0.48 * r, 0.64 * r)) < 1e-12, `${id}: nodo en ${r}`);
    for (const p of o.planos) {                   // un punto cualquiera del plano: perpendicular a la normal
      const u = Math.abs(p[2]) < 0.9 ? [p[1], -p[0], 0] : [0, p[2], -p[1]], k = 3 / Math.hypot(...u);
      assert.ok(Math.abs(M.psi(id, u[0] * k, u[1] * k, u[2] * k + (Math.abs(p[2]) < 0.9 ? 1.5 : 0))) < 1e-12, `${id}: plano ${p}`);
    }
  }
});

test('la nube: 90 % de los puntos dentro del r90, signo de ψ correcto y siempre los mismos puntos', () => {
  for (const id of M.ORBITALES) {
    const o = M.orbital(id), nb = M.nube(id);
    assert.equal(nb.puntos.length, 1600);
    const dentro = nb.puntos.filter(p => Math.hypot(p[0], p[1], p[2]) <= o.r90).length / 1600;
    assert.ok(Math.abs(dentro - 0.9) < 0.03, `${id}: ${dentro}`);
    for (const p of nb.puntos) assert.equal(p[3], M.psi(id, p[0], p[1], p[2]) >= 0 ? 1 : -1, id);
    assert.deepEqual(M.nube(id, { semilla: 7 }).puntos.slice(0, 5), nb.puntos.slice(0, 5));
  }
});

test('el 2pz: los puntos de arriba son «+» y los de abajo «−»', () => {
  for (const p of M.nube('2pz').puntos) assert.equal(p[3], p[2] >= 0 ? 1 : -1);
});

test('el corte del 2s deja ver su nodo: casi no hay puntos cerca de r = 2 a₀', () => {
  const c = M.nube('2s', { corte: true });
  assert.equal(c.corte, 'y');
  for (const p of c.puntos) assert.ok(Math.abs(p[1]) <= c.grosor / 2 + 1e-12);
  const r = p => Math.hypot(p[0], p[1], p[2]);
  const nodo = c.puntos.filter(p => r(p) > 1.8 && r(p) < 2.2).length, afuera = c.puntos.filter(p => r(p) > 4.8 && r(p) < 5.2).length;
  assert.ok(nodo * 4 < afuera, `${nodo} cerca del nodo, ${afuera} en r ≈ 5`);
});

test('el orbital más grande de la lista es el 3s; errores de entrada', () => {
  assert.equal(M.mayorOrbital(), '3s');
  assert.throws(() => M.orbital('2d'), /no conozco/);
  assert.throws(() => M.orbital('4f'), /no conozco/);
});

test('lobulos: un rótulo por signo, donde ψ tiene ese signo; los p van sobre su eje', () => {
  for (const id of M.ORBITALES) {
    const L = M.lobulos(id), o = M.orbital(id);
    assert.equal(L.length, id === '1s' ? 1 : 2, id);
    for (const l of L) assert.equal(Math.sign(M.psi(id, ...l.pos)), l.signo, id);
    if (o.l === 1) for (const l of L) assert.ok(Math.abs(l.pos['xyz'.indexOf(o.eje)]) > 0.99 * Math.hypot(...l.pos), id);
  }
  // 2s: el «+» adentro del nodo (r < 2) y el «−» afuera
  const [mas, menos] = M.lobulos('2s');
  assert.ok(Math.hypot(...mas.pos) < 2 && Math.hypot(...menos.pos) > 2);
});
