// Pruebas de la pieza «quim-cadena»: una flecha por relación (y la tachada se ve), los textos largos se parten
// en líneas que caben; y las comunes del kit.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./quim-cadena.js');

// Comunes: sin NaN ni colores fijos, texto de 14 o más, solo tokens de variable, sin ids ni scripts, pura y alto fijo.
function sana(svg) {
  assert.ok(!/NaN|undefined|null|Infinity/.test(svg), svg.match(/.{30}(NaN|undefined|null|Infinity).{10}/));
  assert.ok(!/#[0-9a-f]{3,6}\b/i.test(svg), "sin colores fijos");
  assert.ok(!/<script|\son[a-z]+\s*=|\sid=/i.test(svg));
  for (const [, t] of svg.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14, `texto de ${t}`);
  for (const [, c] of svg.matchAll(/var\(--c-([a-z])\)/g)) assert.ok(["o", "i", "h", "d"].includes(c));
}
const alto = svg => svg.match(/viewBox="0 0 320 ([\d.]+)"/)[1];

const D = { columnas: [{ titulo: 'Filtrar', color: 'i', nodos: [{ texto: 'agua turbia' }, { texto: 'filtro de arena' }, { texto: 'agua clara, con microbios', desde: 1 }] },
  { titulo: 'Desinfectar', color: 'o', nodos: [{ texto: 'agua clara' }, { texto: 'cloro' }], flechas: [{ de: 0, a: 1, no: true }] }] };
test('se registra en el kit', () => assert.equal(Kit.piezas['quim-cadena'], P));
test('fidelidad: flechas de los datos y la tachada', () => {
  const s0 = P.dibujar(D, { corte: 0 }), s1 = P.dibujar(D, { corte: 1 });
  assert.equal((s0.match(/class="kit-flecha/g) || []).length, 2);
  assert.equal((s1.match(/class="kit-flecha/g) || []).length, 3);
  assert.equal((s0.match(/var\(--c-h\)/g) || []).length, 2);
});
test('las líneas caben en su caja', () => {
  for (const l of P.lineas('el cloro destruye microbios que el filtro deja pasar', 130)) assert.ok(require('../trazo.js').ancho(l, 15, 600) <= 130 || !l.includes(' '));
});
test('comunes: sana, pura, alto fijo y alt', () => {
  const s0 = P.dibujar(D, { corte: 0 }), s1 = P.dibujar(D, { corte: 1 });
  sana(s0); sana(s1); assert.equal(alto(s0), alto(s1)); assert.match(P.alt(D), /agua turbia → filtro/);
});
test('geometría: exporta la misma que usa el dibujo', () => {
  const d = { columnas: [{ titulo: 'a', nodos: [{ texto: 'uno' }, { texto: 'dos' }] }] };
  const g = P.geometria(d), s = P.dibujar(d);
  assert.equal(svgAlto(s), String(g.alto));
});
function svgAlto(s) { return s.match(/viewBox="0 0 320 ([\d.]+)"/)[1]; }
