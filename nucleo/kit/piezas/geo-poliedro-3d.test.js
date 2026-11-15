// Pruebas de la pieza «geo-poliedro-3d»: el alt cuenta C, V y A con nucleo/solidos3d.js; el respaldo dibuja una cara por
// cara; armado, los vértices dibujados son los V del sólido; abierto, hay más (los que el pliegue junta).
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./geo-poliedro-3d.js');

test('se registra en el kit con su parte viva', () => {
  assert.equal(Kit.piezas['geo-poliedro-3d'], P);
  assert.equal(typeof P.montar, 'function');
});

test('cubo armado: 6 caras en el SVG, 8 vértices y Euler en el alt', () => {
  const d = { solido: 'cubo', t: 1 };
  const s = P.dibujar(d);
  assert.equal((s.match(/<polygon /g) || []).length, 6);
  assert.equal((s.match(/<circle /g) || []).length, 8);
  assert.match(P.alt(d), /Cubo armado: 6 caras, 8 vértices y 12 aristas\. 6 \+ 8 = 12 \+ 2/);
});

test('abierto, el desarrollo tiene más vértices sueltos que el sólido; Euler no cambia', () => {
  for (const [solido, V] of [['cubo', 8], ['tetraedro', 4], ['icosaedro', 12], ['dodecaedro', 20]]) {
    const g = P.figura({ solido, t: 0 });
    assert.ok(g.vertices.length > V, solido);
    assert.equal(P.figura({ solido, t: 1 }).vertices.length, V, solido);
    assert.match(P.alt({ solido, t: 0 }), /abierto en su desarrollo plano/);
  }
});

test('el desarrollo cabe en el cuadro a cualquier pliegue y sin NaN', () => {
  for (const t of [0, 0.3, 0.7, 1]) {
    const s = P.dibujar({ solido: 'dodecaedro', t });
    assert.ok(!/NaN|undefined/.test(s));
    for (const [, x, y] of s.matchAll(/cx="([-\d.]+)" cy="([-\d.]+)"/g)) assert.ok(+x > 0 && +x < 320 && +y > 0 && +y < 260, `t = ${t}`);
  }
});

test('girar la vista no cambia el conteo', () => {
  const a = { solido: 'octaedro', t: 0.5 }, b = Object.assign({ vista: { giro: 100, inclinacion: -20 } }, a);
  assert.equal(P.alt(a), P.alt(b));
  assert.notEqual(P.dibujar(a), P.dibujar(b));
});
