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
test('geometría: el centro y los radios de capa son los del dibujo', () => {
  const s = P.dibujar(NA), g = P.geometria(NA);
  for (const k of [0, 1]) {
    const a = g.atomo(k);
    assert.ok(s.includes(`<circle cx="${Kit.trazo.n(a.cx)}" cy="${a.cy}" r="${a.rn}"`));
    for (let i = 0; i < a.capas; i++) assert.ok(s.includes(`<circle cx="${Kit.trazo.n(a.cx)}" cy="${a.cy}" r="${Kit.trazo.n(a.radio(i))}"`), `capa ${i}`);
  }
});

// Paleta 'zne' (18 nov, Estructura atómica rehecha): opción nueva; lo de arriba no cambia. El encuadre y los rótulos de
// todas sus figuras se revisan con números en quim-objeto.test.js.
test('zne: núcleo «Zp⁺ / Nn⁰», electrones violeta, carga carmín y «?» en tinta; sin los colores viejos', () => {
  const d = { paleta: 'zne', atomos: [{ Z: 11, N: 12, titulo: 'sodio' }, { Z: 11, N: 12, e: 10, titulo: 'Na', carga: 1, sale: { n: 1 }, oculto: ['N'] }] };
  const s = P.dibujar(d);
  assert.equal((s.match(/class="kit-electron/g) || []).length, 21);
  assert.match(s, />11p⁺</); assert.match(s, />12n⁰</); assert.match(s, /fill="currentColor"[^>]*>\?n⁰</);
  assert.match(s, /<tspan fill="var\(--c-h\)">⁺<\/tspan>/);
  assert.ok(!/var\(--c-d\)/.test(s) && !/kit-electron"><circle[^>]*var\(--c-i\)/.test(s));
  assert.ok(!/stroke-dasharray="3 4"/.test(s), 'sin capas: los niveles se enseñan después');
  assert.equal(s, P.dibujar(d)); assert.equal(alto(s), '220');
  assert.match(P.alt(d), /no a escala/);
  // Sin electrones cuando el dato no los da (e: null) y con «? e⁻» cuando se piden.
  const sin = P.dibujar({ paleta: 'zne', atomos: [{ Z: 29, N: 34, e: null }] });
  assert.equal((sin.match(/class="kit-electron/g) || []).length, 0); assert.ok(!/\? e⁻/.test(sin));
  assert.match(P.dibujar({ paleta: 'zne', atomos: [{ Z: 20, N: null, e: 18, oculto: ['e'] }] }), /\? e⁻/);
  // La vieja sigue igual: sin paleta, protones en carmín y capas discontinuas.
  assert.match(P.dibujar(NA), /var\(--c-h\)[^>]*>11p</);
});
