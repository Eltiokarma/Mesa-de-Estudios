// Pruebas de la pieza «rm-cubitos-3d»: el respaldo plano (lo que se ve sin WebGL 2, en las miniaturas y en Node)
// dibuja los cubitos, las caras pintadas y los puntos que dan los motores; girar no cambia la figura.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./rm-cubitos-3d.js');
const Cub = require('../../../plantillas/cubitos-pintados/motor.js');
const Dad = require('../../../plantillas/dados-caras/motor.js');

const TONO = ['blanca', 'pintada', 'base'];
const cuboPintado = (n, sep = 0) => {
  const r = Cub.pintado({ dims: [n, n, n] });
  return { celdas: r.celdas.map((p, i) => ({ p, caras: r.porCara[i].map(c => ({ tono: TONO[c] })) })), separar: sep };
};

test('se registra en el kit con su parte viva', () => {
  assert.equal(Kit.piezas['rm-cubitos-3d'], P);
  assert.equal(typeof P.montar, 'function');
});

test('con los cubitos juntos, las caras que se dibujan son las expuestas que cuenta el motor', () => {
  for (const n of [2, 3, 4]) {
    const r = Cub.pintado({ dims: [n, n, n] }), cs = P.caras(cuboPintado(n));
    assert.equal(cs.length, r.expuestas);
    assert.equal(cs.filter(c => c.tono === 'pintada').length, r.caras);
  }
  const s = Cub.pintado({ alturas: [[1, 2], [0, 3]], sinPintar: ['mesa'] });
  const d = { celdas: s.celdas.map((p, i) => ({ p, caras: s.porCara[i].map(c => ({ tono: TONO[c] })) })) };
  assert.equal(P.caras(d).filter(c => c.tono === 'pintada').length, s.caras);
});

test('separados, se ven también las caras sin pintar de adentro: 6 por cubito', () => {
  const cs = P.caras(cuboPintado(3, 1));
  assert.equal(cs.length, 6 * 27);
  assert.equal(cs.filter(c => c.tono === 'pintada').length, Cub.pintado({ dims: [3, 3, 3] }).caras);
});

test('separar aleja los cubitos del centro y no cambia cuántos hay', () => {
  const a = P.centros(cuboPintado(3, 0)), b = P.centros(cuboPintado(3, 1));
  assert.equal(a.length, b.length);
  const d = (p) => Math.hypot(p[0] - 1.5, p[1] - 1.5, p[2] - 1.5);
  a.forEach((p, i) => assert.ok(d(b[i]) >= d(p) - 1e-12));
  assert.ok(Math.abs(d(b[13]) - 0) < 1e-12);         // el del centro se queda en su lugar
});

test('el respaldo de un dado muestra tantos puntos como dice cada cara que mira a la cámara', () => {
  const o = Dad.orientar(5, 1);       // arriba, abajo, frente, atrás, izquierda, derecha
  const caras = [o[4], o[5], o[2], o[3], o[1], o[0]].map(v => ({ tono: 'dado', puntos: v }));
  const d = { celdas: [{ p: [0, 0, 0], caras }], vista: { giro: -32, inclinacion: 24 } };
  const pl = P.plano(d), vis = pl.poligonos.filter(g => g.tipo === 'cara');
  assert.equal(vis.length, 3);                       // arriba, frente y derecha
  const total = vis.reduce((s, g) => s + g.puntos.length, 0);
  assert.equal(total, o[0] + o[2] + o[5]);
  assert.equal((P.dibujar(d).match(/<circle /g) || []).length, total);
});

test('las sombras de las paredes y la ruta salen en el respaldo y en el alt', () => {
  const d = { celdas: [{ p: [0, 0, 0] }, { p: [1, 0, 0] }, { p: [1, 0, 1] }], sombras: { frente: [[0, 0], [1, 0], [1, 1]], lado: [[0, 0], [0, 1]] }, piso: [2, 1] };
  const pl = P.plano(d);
  assert.equal(pl.poligonos.filter(g => g.tipo === 'frente').length, 3);
  assert.equal(pl.poligonos.filter(g => g.tipo === 'lado').length, 2);
  assert.match(P.alt(d), /3 cubitos.*vistas de frente y de lado/);
  const r = { malla: [2, 1, 1], ruta: [[0, 0, 0], [1, 0, 0], [2, 0, 0], [2, 1, 0], [2, 1, 1]], marcas: [{ p: [0, 0, 0], texto: 'A' }, { p: [2, 1, 1], texto: 'B' }] };
  const s = P.dibujar(r);
  assert.equal((s.match(/<line /g) || []).length, P.plano(r).lineas.length);
  assert.equal(P.plano(r).lineas.length, 2 * 2 * 2 + 3 * 1 * 2 + 3 * 2 * 1);   // aristas de la caja 2 × 1 × 1: 20
  assert.match(s, /<polyline/);
  assert.match(s, />A<\/text>.*>B<\/text>/);
  assert.doesNotMatch(s, /NaN|undefined/);
});

test('girar conserva el largo y el orden de dibujo pone atrás lo lejano', () => {
  const v = [0.7, -0.2, 1.1], g = P.girar(v, 40, -25);
  assert.ok(Math.abs(Math.hypot(...g) - Math.hypot(...v)) < 1e-12);
  const pl = P.plano(cuboPintado(3));
  for (let i = 1; i < pl.poligonos.length; i++) assert.ok(pl.poligonos[i].z >= pl.poligonos[i - 1].z);
});
