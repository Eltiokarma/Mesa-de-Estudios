// Pruebas de tresPlanos y recortarRecta (motor de matrices, ronda 4 del 3D): la pieza alg-planos-3d y la mesa de
// sistemas de ecuaciones los usan para dibujar y para comprobar los retos (regla 1).
// 1. casos-planos.json (verificados aparte). 2. Propiedades con planos al azar: el punto cumple las tres ecuaciones, la
// recta común está en los tres planos, cada recta de dos planos está en esos dos. 3. El recorte queda en el cubo.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const M = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos-planos.json'), 'utf8'));
const cerca = (a, b, que) => assert.ok(Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b)), `${que}: ${a} contra ${b}`);
const enPlano = (p, x, que) => cerca(p[0] * x[0] + p[1] * x[1] + p[2] * x[2], p[3], que);

for (const c of datos.casos) test(`tres planos: ${c.nombre}`, () => {
  const r = M.tresPlanos({ planos: c.planos });
  for (const [k, v] of Object.entries(c.espera)) {
    if (Array.isArray(v)) v.forEach((x, i) => cerca(r[k][i], x, `${c.nombre} · ${k}[${i}]`));
    else assert.deepEqual(r[k], v, `${c.nombre} · ${k}`);
  }
});

function azar(sem) { let s = sem >>> 0; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; }
const rnd = azar(415), ent = (a, b) => a + Math.floor((b - a + 1) * rnd());

test('propiedades: punto, recta común y rectas de dos en dos están en sus planos', () => {
  let vistos = { punto: 0, recta: 0, ninguna: 0 };
  for (let k = 0; k < 600; k++) {
    const base = [[1, 1, 1, 3], [1, -1, 1, 1]];
    const p3 = [ent(-2, 2), ent(-2, 2), ent(-2, 2), ent(-3, 5)];
    const P = k % 3 ? base.concat([p3]) : Array.from({ length: 3 }, () => [ent(-3, 3), ent(-3, 3), ent(-3, 3), ent(-4, 4)]);
    const r = M.tresPlanos({ planos: P });
    vistos[r.tipo] = (vistos[r.tipo] || 0) + 1;
    if (r.tipo === 'punto') P.forEach((p, i) => enPlano(p, r.punto, `punto en el plano ${i}`));
    if (r.tipo === 'recta') for (const t of [0, 1, -2]) P.forEach((p, i) => enPlano(p, r.recta.punto.map((x, j) => x + t * r.recta.dir[j]), `recta en el plano ${i}`));
    for (const pr of r.pares) for (const t of [0, 2]) for (const i of [pr.i, pr.j]) enPlano(P[i], pr.punto.map((x, j) => x + t * pr.dir[j]), `recta ${pr.i}-${pr.j}`);
    assert.ok(r.rango <= r.rangoAmpliado && r.rangoAmpliado - r.rango <= 1);
    assert.equal(r.tipo === 'ninguna', r.rango < r.rangoAmpliado);
  }
  assert.ok(vistos.punto > 50 && vistos.recta > 5 && vistos.ninguna > 5, JSON.stringify(vistos));
});

test('prisma: los tres planos se cortan de dos en dos en rectas paralelas', () => {
  const r = M.tresPlanos({ planos: [[1, 1, 1, 3], [1, -1, 1, 1], [1, 0, 1, 5]] });
  assert.equal(r.pares.length, 3);
  const [a, b, c] = r.pares.map(p => p.dir), cruz = (u, v) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
  for (const w of [cruz(a, b), cruz(a, c)]) w.forEach(x => cerca(x, 0, 'paralelas'));
});

test('recortarRecta: los extremos están en la recta y en el borde del cubo', () => {
  const s = M.recortarRecta({ punto: [0, 1, 2], dir: [1, 0, -1], lado: 3 });
  assert.deepEqual(s, [[-1, 1, 3], [3, 1, -1]]);
  for (const q of s) assert.ok(Math.max(...q.map(Math.abs)) === 3);
  assert.equal(M.recortarRecta({ punto: [0, 5, 0], dir: [1, 0, 0], lado: 3 }), null);
});

test('entradas mal formadas lanzan', () => {
  assert.throws(() => M.tresPlanos({ planos: [[1, 1, 1, 3]] }), /tres planos/);
});
