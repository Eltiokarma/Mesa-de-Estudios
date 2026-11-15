// Pruebas de la pieza «fis-onda-em»: E y B en fase (crestas en la misma abscisa del eje), sin NaN ni colores fijos,
// texto de 14 o más, alto fijo, pura, y los pasos dejan rastro.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./fis-onda-em.js');

const D = { amplitud: 0.8, ciclos: 2, rotuloL: 'λ = 4 m', nota: 'vacío' };

test('se registra en el kit', () => assert.equal(Kit.piezas['fis-onda-em'], P));

test('fidelidad: la cresta de E y la de B salen del mismo punto del eje', () => {
  const { pE, pB } = P.puntos(D);
  const { EJE } = P.constantes;
  const kE = pE.reduce((m, p, k) => (p[1] < pE[m][1] ? k : m), 0);
  const kB = pB.reduce((m, p, k) => (p[1] - EJE > pB[m][1] - EJE ? k : m), 0);
  assert.equal(kE, kB, 'misma muestra: misma fase');
});

test('sin NaN ni hex; texto de 14 o más; alto fijo; puro; rastro por pasos', () => {
  const altos = new Set();
  for (const d of [D, {}, { amplitud: 0, ciclos: 4 }, { amplitud: 1, ciclos: 1 }]) for (const paso of [undefined, 1, 2, 3]) {
    const s = P.dibujar(d, { paso });
    assert.ok(!/NaN|undefined|Infinity/.test(s));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
    for (const m of s.matchAll(/font-size="(\d+)"/g)) assert.ok(+m[1] >= 14);
    altos.add(s.match(/viewBox="0 0 320 (\d+)"/)[1]);
    assert.equal(s, P.dibujar(d, { paso }));
  }
  assert.equal(altos.size, 1);
  assert.ok(!/var\(--c-i\)/.test(P.dibujar(D, { paso: 1 })), 'en el paso 1 todavía no está B');
  assert.ok(/var\(--c-o\)/.test(P.dibujar(D, { paso: 2 })), 'en el paso 2 E sigue dibujado');
});

// Ronda 5 (animación): `fase` es opcional; sin ella (o con 0) la figura es la de siempre; con ella la onda avanza.
test('fase: la onda avanza; con fase 0 o 1 es la de siempre; las crestas siguen juntas', () => {
  assert.equal(P.dibujar(Object.assign({}, D, { fase: 0 }), {}), P.dibujar(D, {}));
  assert.equal(P.dibujar(Object.assign({}, D, { fase: 1 }), {}), P.dibujar(D, {}));
  assert.notEqual(P.dibujar(Object.assign({}, D, { fase: 0.3 }), {}), P.dibujar(D, {}));
  const { pE, pB } = P.puntos(Object.assign({}, D, { fase: 0.3 })), { EJE } = P.constantes;
  const kE = pE.reduce((m, p, k) => (p[1] < pE[m][1] ? k : m), 0), maxB = Math.max(...pB.map(p => p[1] - EJE));
  assert.ok(Math.abs(pB[kE][1] - EJE - maxB) < 1e-9, 'donde E tiene su cresta, B también: misma fase');
  for (const fa of [0.1, 0.5, 0.9]) for (const ciclos of [1, 2, 4]) assert.ok(!/NaN|undefined/.test(P.dibujar({ amplitud: 0.8, ciclos, rotuloL: 'λ', fase: fa }, {})));
});
