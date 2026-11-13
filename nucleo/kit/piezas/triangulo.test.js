// Pruebas de la pieza «triangulo»: el final dibuja la respuesta, ida y vuelta da el mismo SVG, nada de NaN,
// colores solo de variable, alto fijo, y fidelidad: los ángulos y los largos dibujados se miden en el SVG.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const Tr = require('./triangulo.js');
const LT = require('../linea-tiempo.js');

// Torre de 12 m vista desde P (37°, tan = 3/4) y desde Q (53°, tan = 4/3): x = 9, d = 7.
const TORRE = {
  suelo: true,
  puntos: [{ id: 'B', x: 0, y: 0, rotulo: 'B' }, { id: 'T', x: 0, y: 12, rotulo: 'T' }, { id: 'Q', x: 9, y: 0, rotulo: 'Q' }, { id: 'P', x: 16, y: 0, rotulo: 'P' }],
  lados: [
    { de: 'B', a: 'T', color: 'h', grosor: 'variable', texto: 'H = ?', final: 'H = 12 m' },
    { de: 'P', a: 'T', color: 'o', visual: true }, { de: 'Q', a: 'T', color: 'i', visual: true },
  ],
  angulos: [{ en: 'P', de: 'B', a: 'T', texto: '37°', color: 'o' }, { en: 'Q', de: 'B', a: 'T', texto: '53°', color: 'i' },
    { en: 'B', de: 'Q', a: 'T', paso: 1 }],
  cotas: [{ de: 'Q', a: 'P', texto: '7 m', color: 'd' }, { de: 'B', a: 'Q', texto: 'x = H·cot 53°', color: 'h', paso: 1 }],
};
// Triángulo 30-60-90 de hipotenusa 10, sin suelo.
const NOTABLE = {
  puntos: [{ id: 'A', x: 0, y: 0, rotulo: 'A' }, { id: 'B', x: 5 * Math.sqrt(3), y: 0, rotulo: 'B' }, { id: 'C', x: 5 * Math.sqrt(3), y: 5, rotulo: 'C' }],
  lados: [{ de: 'A', a: 'B', texto: '5√3' }, { de: 'B', a: 'C', texto: 'x', final: 'x = 5', color: 'h' }, { de: 'A', a: 'C', texto: '10', color: 'o' }],
  angulos: [{ en: 'A', de: 'B', a: 'C', texto: '30°', color: 'i' }, { en: 'B', de: 'A', a: 'C' }],
};
const PASOS = [{ estado: { paso: 1 } }, { estado: { paso: 1, final: true } }];

test('se registra en el catálogo del kit', () => {
  assert.equal(Kit.piezas.triangulo, Tr);
});

test('el final cambia la incógnita por su valor y cada paso deja su rastro', () => {
  const s0 = Tr.dibujar(TORRE, {}), s1 = Tr.dibujar(TORRE, LT.estado(PASOS, 1)), s2 = Tr.dibujar(TORRE, LT.estado(PASOS, 2));
  assert.match(s0, />H = \?</); assert.ok(!/H·cot/.test(s0));
  assert.match(s1, />x = H·cot 53°</); assert.match(s1, />H = \?</);
  assert.match(s2, />H = 12 m</); assert.match(s2, />x = H·cot 53°</);
  assert.match(Tr.dibujar(NOTABLE, { final: true }), />x = 5</);
});

test('fidelidad: el ángulo de 37° se dibuja con tan = 3/4 y los largos van a una sola escala', () => {
  const g = Tr.geometria(TORRE);
  const P = g.P('P'), T = g.P('T'), B = g.P('B'), Q = g.P('Q');
  const ang = Math.atan2(P[1] - T[1], P[0] - B[0]) * 180 / Math.PI;
  assert.ok(Math.abs(ang - Math.atan(0.75) * 180 / Math.PI) < 0.05);
  assert.ok(Math.abs((P[0] - Q[0]) / (B[1] - T[1]) - 7 / 12) < 1e-6, 'misma escala en x y en y');
  // El arco del ángulo en P termina sobre la visual PT.
  const s = Tr.dibujar(TORRE, {});
  const m = [...s.matchAll(/<path d="M([\d.]+) ([\d.]+)A30 30 0 0 [01] ([\d.]+) ([\d.]+)"/g)][0];
  const fin = Math.atan2(P[1] - +m[4], P[0] - +m[3]) * 180 / Math.PI;
  assert.ok(Math.abs(Math.abs(fin) - 36.87) < 0.3 || Math.abs(Math.atan2(P[1] - +m[2], P[0] - +m[1]) * 180 / Math.PI - 36.87) < 0.3);
  // El ángulo recto va con cuadradito.
  assert.match(Tr.dibujar(NOTABLE, {}), /<path d="M[\d. ]+L[\d. ]+L[\d. ]+" fill="none"/);
});

test('ida y vuelta: el mismo paso da el mismo SVG', () => {
  for (const d of [TORRE, NOTABLE]) {
    const base = { fantasma: { rotulo: 'un solo ángulo', texto: '9 m' } };
    const ida = [1, 2].map(i => Tr.dibujar(d, LT.estado(PASOS, i, base)));
    const vuelta = [2, 1].map(i => Tr.dibujar(d, LT.estado(PASOS, i, base))).reverse();
    assert.deepEqual(ida, vuelta);
  }
});

test('sin NaN ni colores fijos; texto de 14 o más dentro del lienzo; alto fijo', () => {
  const estados = [{}, { corte: 0 }, { paso: 1 }, { paso: 1, final: true, fantasma: { rotulo: 'x', texto: '3 m' } }, { paso: 9 }, { fantasma: {} }];
  for (const d of [TORRE, NOTABLE]) {
    const altos = new Set();
    for (const e of estados) {
      const s = Tr.dibujar(d, e);
      assert.ok(!/NaN|undefined|null|Infinity/.test(s));
      assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
      assert.ok(!/<script|\son[a-z]+\s*=|javascript:|<foreignObject|\sid=/i.test(s));
      for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14);
      for (const [, x] of s.matchAll(/<text[^>]* x="([\d.-]+)"/g)) assert.ok(+x >= 0 && +x <= 320);
      altos.add(s.match(/viewBox="0 0 320 ([\d.]+)"/)[1]);
    }
    assert.equal(altos.size, 1);
  }
  assert.match(Tr.dibujar(TORRE, { fantasma: { rotulo: 'un solo ángulo', texto: '9 m' } }), /un solo ángulo: 9 m/);
});

test('alt cuenta la figura', () => {
  assert.match(Tr.alt(TORRE), /^Figura a escala con los puntos B, T, Q, P; BT: H = \?; QP: 7 m; ángulos de 37° en P y 53° en Q$/);
});
