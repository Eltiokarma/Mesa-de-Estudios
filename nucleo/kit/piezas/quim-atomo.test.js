// Pruebas de la pieza «quim-atomo»: los electrones dibujados son los de las capas, los que salen van afuera y
// el núcleo dice protones y neutrones; y las comunes del kit.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./quim-atomo.js');

// Comunes: sin NaN ni colores fijos, texto de 14 o más, solo tokens de variable, sin ids ni scripts, pura y alto fijo.
function sana(svg) {
  assert.ok(!/NaN|undefined|null|Infinity/.test(svg), svg.match(/.{30}(NaN|undefined|null|Infinity).{10}/));
  assert.ok(!/#[0-9a-f]{3,6}\b/i.test(svg), "sin colores fijos");
  assert.ok(!/<script|\son[a-z]+\s*=|\sid=/i.test(svg));
  for (const [, t] of svg.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14, `texto de ${t}`);
  for (const [, c] of svg.matchAll(/var\(--c-([a-z])\)/g)) assert.ok(["o", "i", "h", "d"].includes(c));
}
const alto = svg => svg.match(/viewBox="0 0 320 ([\d.]+)"/)[1];

const NA = { atomos: [{ simbolo: 'Na', Z: 11, N: 12, capas: [2, 8, 1] }, { simbolo: 'Na⁺', Z: 11, N: 12, capas: [2, 8], sale: { n: 1, desde: 1 } }] };
test('se registra en el kit', () => assert.equal(Kit.piezas['quim-atomo'], P));
test('fidelidad: un punto por electrón y el que sale va afuera (desde su paso)', () => {
  const s0 = P.dibujar(NA, { corte: 0 }), s1 = P.dibujar(NA, { corte: 1 });
  assert.equal((s0.match(/class="kit-electron/g) || []).length, 21);
  assert.ok(!/kit-sale/.test(s0)); assert.match(s1, /kit-sale/);
  assert.match(s0, />11p</); assert.match(s0, />12n</);
});
test('comunes: sana, pura, alto fijo y alt que dice que es un modelo', () => {
  const s0 = P.dibujar(NA, { corte: 0 }), s1 = P.dibujar(NA, { corte: 1 });
  sana(s0); sana(s1); assert.equal(alto(s0), alto(s1)); assert.equal(s0, P.dibujar(NA, { corte: 0 }));
  assert.match(P.alt(NA), /no trayectorias/);
});
