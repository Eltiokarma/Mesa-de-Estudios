// Pruebas de la pieza «quim-fichas»: un cuadrito por carga, la neta es la diferencia y lo sin pareja se marca;
// y las comunes del kit.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./quim-fichas.js');

// Comunes: sin NaN ni colores fijos, texto de 14 o más, solo tokens de variable, sin ids ni scripts, pura y alto fijo.
function sana(svg) {
  assert.ok(!/NaN|undefined|null|Infinity/.test(svg), svg.match(/.{30}(NaN|undefined|null|Infinity).{10}/));
  assert.ok(!/#[0-9a-f]{3,6}\b/i.test(svg), "sin colores fijos");
  assert.ok(!/<script|\son[a-z]+\s*=|\sid=/i.test(svg));
  for (const [, t] of svg.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14, `texto de ${t}`);
  for (const [, c] of svg.matchAll(/var\(--c-([a-z])\)/g)) assert.ok(["o", "i", "h", "d"].includes(c));
}
const alto = svg => svg.match(/viewBox="0 0 320 ([\d.]+)"/)[1];

const D = { fichas: [{ t: 'Al³⁺', carga: 3, n: 1, color: 'o' }, { t: 'O²⁻', carga: -2, n: 1, color: 'i' }, { t: 'O²⁻', carga: -2, n: 2, color: 'i', desde: 1 }] };
test('se registra en el kit', () => assert.equal(Kit.piezas['quim-fichas'], P));
test('fidelidad: cuadritos por carga y carga neta', () => {
  const s0 = P.dibujar(D, { corte: 0 }), s1 = P.dibujar(D, { corte: 1 });
  assert.equal((s0.match(/<rect [^>]*width="14" height="14"/g) || []).length, 5);
  assert.match(s0, /carga neta: \+1/); assert.match(s1, /carga neta: −3/);
  assert.match(P.alt(D), /Carga neta: −3/);
});
test('comunes: sana, pura y alto fijo', () => {
  const s0 = P.dibujar(D, { corte: 0 }), s1 = P.dibujar(D, { corte: 1 });
  sana(s0); sana(s1); assert.equal(alto(s0), alto(s1)); assert.equal(s0, P.dibujar(D, { corte: 0 }));
});
test('geometría: una caja por copia, en orden y dentro de la figura', () => {
  const g = P.geometria(D);
  assert.equal(g.cajas.length, 4);
  for (let i = 1; i < g.cajas.length; i++) assert.ok(g.cajas[i].x > g.cajas[i - 1].x + g.cajas[i - 1].w - 1e-9);
  assert.ok(g.cajas[0].x >= 0 && g.cajas[3].x + g.cajas[3].w <= 320);
  const s = P.dibujar(D, { corte: 1 }), q = g.cuadrito(0, '+');
  assert.ok(s.includes(`<rect x="${q.x - 7}" y="${q.y - 7}"`));
});
