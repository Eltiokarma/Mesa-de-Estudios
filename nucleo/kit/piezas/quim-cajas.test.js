// Pruebas de la pieza «quim-cajas»: Hund llena una por caja antes de aparear, las flechas son las de los datos,
// los desapareados se marcan; y las comunes del kit.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./quim-cajas.js');

// Comunes: sin NaN ni colores fijos, texto de 14 o más, solo tokens de variable, sin ids ni scripts, pura y alto fijo.
function sana(svg) {
  assert.ok(!/NaN|undefined|null|Infinity/.test(svg), svg.match(/.{30}(NaN|undefined|null|Infinity).{10}/));
  assert.ok(!/#[0-9a-f]{3,6}\b/i.test(svg), "sin colores fijos");
  assert.ok(!/<script|\son[a-z]+\s*=|\sid=/i.test(svg));
  for (const [, t] of svg.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14, `texto de ${t}`);
  for (const [, c] of svg.matchAll(/var\(--c-([a-z])\)/g)) assert.ok(["o", "i", "h", "d"].includes(c));
}
const alto = svg => svg.match(/viewBox="0 0 320 ([\d.]+)"/)[1];

const O = { filas: [{ nombre: '1s', e: 2, cajas: 1 }, { nombre: '2s', e: 2, cajas: 1 }, { nombre: '2p', e: 4, cajas: 3, desde: 1 }], desapareados: true, rotulo: '2 desapareados' };
test('se registra en el kit', () => assert.equal(Kit.piezas['quim-cajas'], P));
test('Hund: 4 electrones en 3 cajas dejan una caja llena y dos con una flecha', () => {
  assert.deepEqual(P.llenar(4, 3), [[1, 1], [1, 0], [1, 0]]);
  assert.deepEqual(P.llenar(3, 3), [[1, 0], [1, 0], [1, 0]]);
});
test('fidelidad: una flecha por electrón y dos cajas marcadas como desapareadas', () => {
  const s = P.dibujar(O, { corte: 1 });
  assert.equal((s.match(/<line x1="\d+" y1="[\d.]+" x2="\d+"[^>]*var\(--c-i\)/g) || []).length, 8);
  assert.equal((s.match(/stroke-dasharray="3 2"/g) || []).length, 2);
});
test('comunes: sana, pura, alto fijo y alt', () => {
  const s0 = P.dibujar(O, { corte: 0 }), s1 = P.dibujar(O, { corte: 1 });
  sana(s0); sana(s1); assert.equal(alto(s0), alto(s1)); assert.match(P.alt(O), /2p: 4 electrones/);
});
