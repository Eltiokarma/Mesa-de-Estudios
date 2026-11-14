// Pruebas de la pieza «quim-molecula»: un enlace doble son dos líneas, un par libre son dos puntos, el encuadre
// no salta entre pasos; y las comunes del kit.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./quim-molecula.js');

// Comunes: sin NaN ni colores fijos, texto de 14 o más, solo tokens de variable, sin ids ni scripts, pura y alto fijo.
function sana(svg) {
  assert.ok(!/NaN|undefined|null|Infinity/.test(svg), svg.match(/.{30}(NaN|undefined|null|Infinity).{10}/));
  assert.ok(!/#[0-9a-f]{3,6}\b/i.test(svg), "sin colores fijos");
  assert.ok(!/<script|\son[a-z]+\s*=|\sid=/i.test(svg));
  for (const [, t] of svg.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14, `texto de ${t}`);
  for (const [, c] of svg.matchAll(/var\(--c-([a-z])\)/g)) assert.ok(["o", "i", "h", "d"].includes(c));
}
const alto = svg => svg.match(/viewBox="0 0 320 ([\d.]+)"/)[1];

const CO2 = { atomos: [{ id: 'c', t: 'C', x: 0, y: 0 }, { id: 'o1', t: 'O', x: -1, y: 0, color: 'h' }, { id: 'o2', t: 'O', x: 1, y: 0, color: 'h', desde: 1 }],
  enlaces: [{ a: 'c', b: 'o1', orden: 2, dipolo: 'b' }, { a: 'c', b: 'o2', orden: 2, desde: 1 }], pares: [{ en: 'o1', ang: 180 }], textos: [{ x: 0, y: 1, t: 'lineal', desde: 2 }] };
test('se registra en el kit', () => assert.equal(Kit.piezas['quim-molecula'], P));
test('fidelidad: doble enlace = dos líneas; par libre = dos puntos', () => {
  const s = P.dibujar(CO2, { corte: 0 });
  assert.equal((s.match(/<g class="kit-enlace"><line/g) || []).length, 1);
  assert.equal((s.match(/kit-enlace"><line[^>]*\/><line/g) || []).length, 1);
  assert.equal((s.match(/<circle [^>]*r="2.2"/g) || []).length, 2);
});
test('el encuadre no salta: el C está en el mismo lugar en todos los pasos', () => {
  const x = s => s.match(/<text[^>]*x="([\d.]+)"[^>]*>C</)[1];
  assert.equal(x(P.dibujar(CO2, { corte: 0 })), x(P.dibujar(CO2, { corte: 2 })));
});
test('comunes: sana, pura, alto fijo y alt', () => {
  const s0 = P.dibujar(CO2, { corte: 0 }), s2 = P.dibujar(CO2, { corte: 2 });
  sana(s0); sana(s2); assert.equal(alto(s0), alto(s2)); assert.match(P.alt(CO2), /C=O/);
});
