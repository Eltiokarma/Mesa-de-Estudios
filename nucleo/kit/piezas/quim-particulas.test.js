// Pruebas de la pieza «quim-particulas»: se dibuja exactamente el número de partículas pedido, el nivel del vaso es
// proporcional, lo que ya estaba no se mueve al avanzar un paso, y las comunes del kit.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./quim-particulas.js');

// Comunes: sin NaN ni colores fijos, texto de 14 o más, solo tokens de variable, sin ids ni scripts, pura y alto fijo.
function sana(svg) {
  assert.ok(!/NaN|undefined|null|Infinity/.test(svg), svg.match(/.{30}(NaN|undefined|null|Infinity).{10}/));
  assert.ok(!/#[0-9a-f]{3,6}\b/i.test(svg), "sin colores fijos");
  assert.ok(!/<script|\son[a-z]+\s*=|\sid=/i.test(svg));
  for (const [, t] of svg.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14, `texto de ${t}`);
  for (const [, c] of svg.matchAll(/var\(--c-([a-z])\)/g)) assert.ok(["o", "i", "h", "d"].includes(c));
}
const alto = svg => svg.match(/viewBox="0 0 320 ([\d.]+)"/)[1];

const D = {
  atomos: { H: { color: 'i', estilo: 'hueco', r: 5 }, O: { color: 'h', r: 7 }, Na: { color: 'o', estilo: 'punto' } },
  especies: { agua: [['O', 0, 0], ['H', -7, 6], ['H', 7, 6]] },
  flechas: true,
  cajas: [{ titulo: 'Antes', forma: 'vaso', nivel: 0.4, rotulo: '100 mL', particulas: [{ e: 'agua', n: 6 }, { e: 'Na', n: 2 }], cuenta: [{ e: 'Na', texto: '2' }] },
          { titulo: 'Después', forma: 'vaso', nivel: 1, rotulo: '250 mL', particulas: [{ e: 'agua', n: 6 }, { e: 'Na', n: 2 }, { e: 'agua', n: 4, desde: 1 }] }],
};
test('se registra en el kit', () => assert.equal(Kit.piezas['quim-particulas'], P));
test('fidelidad: tantas partículas como dicen los datos (las de desde > corte no se ven)', () => {
  const cuenta = s => (s.match(/class="kit-particula/g) || []).length;
  assert.equal(cuenta(P.dibujar(D, { corte: 0 })), 16);
  assert.equal(cuenta(P.dibujar(D, { corte: 1 })), 20);
});
test('fidelidad: el nivel del vaso es proporcional a su fracción', () => {
  const g = P.geometria(D), a = P.region(D.cajas[0], g, 0), b = P.region(D.cajas[1], g, 1);
  const h = r => g.y1 - (r.y - 4);
  assert.ok(Math.abs(h(a) / h(b) - 0.4) < 0.01);
});
test('lo que ya estaba no se mueve cuando aparece algo nuevo', () => {
  const pos = s => [...s.matchAll(/kit-particula[^"]*"><circle cx="([\d.]+)" cy="([\d.]+)"/g)].map(m => m[1] + ',' + m[2]);
  const a = pos(P.dibujar(D, { corte: 0 })), b = pos(P.dibujar(D, { corte: 1 }));
  assert.deepEqual(b.slice(0, a.length), a);
});
test('comunes: sana, pura, alto fijo y alt', () => {
  const s0 = P.dibujar(D, { corte: 0 }), s1 = P.dibujar(D, { corte: 1 });
  sana(s0); sana(s1); assert.equal(alto(s0), alto(s1)); assert.equal(s0, P.dibujar(D, { corte: 0 }));
  assert.match(P.alt(D), /no a escala/);
});
