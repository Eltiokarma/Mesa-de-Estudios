// Pruebas de la pieza «alg-techo-3d»: los postes miden Z en cada vértice (optimizar de
// plantillas/programacion-lineal/motor.js, comprobado aparte con px + qy) y el punto más alto es el óptimo; el respaldo
// plano y el alt lo muestran; girar no cambia la figura.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./alg-techo-3d.js');

const R = [[1, 1, '<=', 6], [1, 0, '<=', 4], [-1, 2, '<=', 6]];
const C = { restricciones: R, objetivo: [3, 2], k: 10 };

test('se registra en el kit con su parte viva', () => {
  assert.equal(Kit.piezas['alg-techo-3d'], P);
  assert.equal(typeof P.montar, 'function');
});

test('cada poste mide px + qy en su vértice (cálculo aparte) y el más alto es el óptimo', () => {
  for (const [p, q] of [[3, 2], [0, 1], [-2, 1], [4, 4]]) {
    const fg = P.figura(Object.assign({}, C, { objetivo: [p, q] }));
    assert.deepEqual(fg.vs.map(v => v.p), [[0, 0], [4, 0], [4, 2], [2, 4], [0, 3]]);
    for (const v of fg.vs) assert.equal(v.z, p * v.p[0] + q * v.p[1]);
    assert.equal(fg.alto, Math.max(...fg.vs.map(v => p * v.p[0] + q * v.p[1])));
  }
  assert.deepEqual(P.figura(C).arriba.map(v => v.texto), ['(4; 2)']);
});

test('el alt dice el punto más alto, o el lado entero, y si el plano k corta el techo', () => {
  assert.match(P.alt(C), /más alto es \(4; 2\), con Z = 16/);
  assert.match(P.alt(C), /k = 10 corta el techo/);
  assert.match(P.alt(Object.assign({}, C, { objetivo: [1, 1] })), /lado de \(4; 2\) a \(2; 4\)/);
  assert.match(P.alt(Object.assign({}, C, { k: 20 })), /pasa por encima/);
  assert.match(P.alt(Object.assign({}, C, { objetivo: [0, 0] })), /Z = 0 en toda la región/);
});

test('el respaldo es un SVG con piso, techo y un poste por vértice', () => {
  const s = P.dibujar(C), pl = P.plano(C);
  assert.match(s, /^<svg/);
  assert.equal(pl.postes.length, 5);
  assert.equal(pl.postes.filter(p => p.arriba).length, 1);
  assert.match(s, /kit-region/);
  assert.match(s, /kit-techo/);
});

test('Z se escribe como en clase', () => {
  assert.equal(P.zTexto(3, 2), 'Z = 3x + 2y');
  assert.equal(P.zTexto(-1, 2), 'Z = −x + 2y');
  assert.equal(P.zTexto(0, 1), 'Z = y');
  assert.equal(P.zTexto(2, -1), 'Z = 2x − y');
  assert.equal(P.zTexto(0, 0), 'Z = 0');
});

test('girar conserva el largo (la vista no cambia la figura)', () => {
  const v = [0.7, -0.2, 1.1], g = P.girar(v, 40, -25);
  assert.ok(Math.abs(Math.hypot(...g) - Math.hypot(...v)) < 1e-12);
  assert.equal(P.figura(Object.assign({}, C, { vista: { giro: 90, inclinacion: 50 } })).alto, 16);
});
