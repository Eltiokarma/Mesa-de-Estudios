// Pruebas de la pieza «alg-planos-3d»: el respaldo plano y el alt muestran lo que calcula tresPlanos
// (plantillas/matrices/motor.js): el punto, la recta común o nada; los pedazos de plano están en su plano y dentro
// del cubo; girar no cambia la figura.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./alg-planos-3d.js');

const P1 = [1, 1, 1, 3], P2 = [1, -1, 1, 1];
const caso = p3 => ({ planos: [P1, P2, p3] });

test('se registra en el kit con su parte viva', () => {
  assert.equal(Kit.piezas['alg-planos-3d'], P);
  assert.equal(typeof P.montar, 'function');
});

test('las ecuaciones se escriben como en clase', () => {
  assert.equal(P.ecuacion([1, 1, 1, 3]), 'x + y + z = 3');
  assert.equal(P.ecuacion([1, 0, -1, 0]), 'x − z = 0');
  assert.equal(P.ecuacion([-2, 1, 0, -4]), '−2x + y = −4');
  assert.equal(P.ecuacion([0, 0, 0, 2]), '0 = 2');
});

test('una solución: el punto (1; 1; 1), en el alt y en el respaldo', () => {
  const d = caso([1, 0, -1, 0]);
  assert.match(P.alt(d), /Una solución: \(1; 1; 1\)/);
  const pl = P.plano(d);
  assert.equal(pl.planos.length, 3);
  assert.ok(pl.punto);
  assert.match(P.dibujar(d), /<circle /);
});

test('una recta común: trazo grueso y sin punto', () => {
  const d = caso([1, 0, 1, 2]), pl = P.plano(d);
  assert.ok(pl.comun);
  assert.equal(pl.punto, null);
  assert.match(P.alt(d), /infinitas soluciones: una recta común/i);
});

test('prisma: tres rectas de dos en dos y nada común; paralelos: el alt lo dice', () => {
  const pr = P.plano(caso([1, 0, 1, 3]));
  assert.equal(pr.rectas.length, 3);
  assert.equal(pr.comun, null);
  assert.equal(pr.punto, null);
  assert.match(P.alt(caso([1, 1, 1, 7])), /hay planos paralelos/);
});

test('cada pedazo de plano está en su plano y dentro del cubo', () => {
  for (const p3 of [[1, 0, -1, 0], [2, -1, 1, 4], [0, 1, 2, -3]]) {
    const d = caso(p3), fg = P.figura(d);
    fg.pedazos.forEach((pts, k) => {
      const p = d.planos[k];
      assert.ok(pts.length >= 3);
      for (const q of pts) {
        assert.ok(Math.abs(p[0] * q[0] + p[1] * q[1] + p[2] * q[2] - p[3]) < 1e-9);
        assert.ok(q.every(x => Math.abs(x) <= 3 + 1e-9));
      }
    });
  }
});

test('una ecuación 0 = 2 no dibuja plano', () => {
  const fg = P.figura(caso([0, 0, 0, 2]));
  assert.equal(fg.pedazos[2].length, 0);
  assert.match(P.alt(caso([0, 0, 0, 2])), /imposible/);
});

test('girar conserva el largo (la vista no cambia la figura)', () => {
  const v = [0.7, -0.2, 1.1], g = P.girar(v, 40, -25);
  assert.ok(Math.abs(Math.hypot(...g) - Math.hypot(...v)) < 1e-12);
  assert.deepEqual(P.sistema(Object.assign(caso([1, 0, -1, 0]), { vista: { giro: 90, inclinacion: 40 } })).punto, [1, 1, 1]);
});

test('los rótulos se reparten: cada uno va al candidato más lejano de los ya puestos', () => {
  assert.deepEqual(P.rotulo([[0, 0, 0], [2, 0, 0], [1, 0, 0]], [[0, 0, 0]]), [2, 0, 0]);
  assert.deepEqual(P.rotulo([[1, 0, 0], [0, 3, 0]], []), [0, 3, 0]);
});
