// Pruebas de la pieza «quim-tabla»: cada Z cae en su grupo y periodo, la barra es proporcional al valor y lo
// que no tiene dato dice «sin dato»; y las comunes del kit.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./quim-tabla.js');

// Comunes: sin NaN ni colores fijos, texto de 14 o más, solo tokens de variable, sin ids ni scripts, pura y alto fijo.
function sana(svg) {
  assert.ok(!/NaN|undefined|null|Infinity/.test(svg), svg.match(/.{30}(NaN|undefined|null|Infinity).{10}/));
  assert.ok(!/#[0-9a-f]{3,6}\b/i.test(svg), "sin colores fijos");
  assert.ok(!/<script|\son[a-z]+\s*=|\sid=/i.test(svg));
  for (const [, t] of svg.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14, `texto de ${t}`);
  for (const [, c] of svg.matchAll(/var\(--c-([a-z])\)/g)) assert.ok(["o", "i", "h", "d"].includes(c));
}
const alto = svg => svg.match(/viewBox="0 0 320 ([\d.]+)"/)[1];

const SIM = { 1: 'H', 2: 'He', 3: 'Li', 11: 'Na', 17: 'Cl', 19: 'K', 35: 'Br', 36: 'Kr' };
test('se registra en el kit', () => assert.equal(Kit.piezas['quim-tabla'], P));
test('ubicación: grupo y periodo de algunos Z', () => {
  assert.deepEqual(P.lugar(1), { col: 0, per: 1 }); assert.deepEqual(P.lugar(2), { col: 8, per: 1 });
  assert.deepEqual(P.lugar(11), { col: 0, per: 3 }); assert.deepEqual(P.lugar(17), { col: 7, per: 3 });
  assert.deepEqual(P.lugar(35), { col: 7, per: 4 }); assert.equal(P.lugar(26).transicion, true);
  assert.equal(P.bloque(2), 's'); assert.equal(P.bloque(17), 'p'); assert.equal(P.bloque(26), 'd');
});
test('fidelidad: la barra es proporcional al valor', () => {
  const s = P.dibujar({ simbolos: SIM, propiedad: { valores: { 11: 500, 17: 1000 }, max: 1000, color: 'o' } });
  const hs = [...s.matchAll(/height="([\d.]+)" fill="var\(--c-o\)"/g)].map(m => +m[1]);
  assert.deepEqual(hs, [9, 18]);
  assert.match(P.alt({ simbolos: SIM, propiedad: { valores: { 11: 500, 17: NaN }, max: 1000 } }), /Cl sin dato/);
});
test('comunes: sana, pura y alto fijo', () => {
  const d = { simbolos: SIM, marcadas: [{ Z: 11, color: 'h', desde: 1 }], bloques: true, escalera: true, rotulo: 'grupos' };
  const s0 = P.dibujar(d, { corte: 0 }), s1 = P.dibujar(d, { corte: 1 });
  sana(s0); sana(s1); assert.equal(alto(s0), alto(s1)); assert.notEqual(s0, s1);
});
