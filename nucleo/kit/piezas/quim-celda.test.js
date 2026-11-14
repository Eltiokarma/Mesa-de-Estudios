// Pruebas de la pieza «quim-celda»: las flechas de electrones van solo sobre el alambre (arriba de los vasos),
// los iones solo abajo del alambre; y las comunes del kit.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./quim-celda.js');

// Comunes: sin NaN ni colores fijos, texto de 14 o más, solo tokens de variable, sin ids ni scripts, pura y alto fijo.
function sana(svg) {
  assert.ok(!/NaN|undefined|null|Infinity/.test(svg), svg.match(/.{30}(NaN|undefined|null|Infinity).{10}/));
  assert.ok(!/#[0-9a-f]{3,6}\b/i.test(svg), "sin colores fijos");
  assert.ok(!/<script|\son[a-z]+\s*=|\sid=/i.test(svg));
  for (const [, t] of svg.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14, `texto de ${t}`);
  for (const [, c] of svg.matchAll(/var\(--c-([a-z])\)/g)) assert.ok(["o", "i", "h", "d"].includes(c));
}
const alto = svg => svg.match(/viewBox="0 0 320 ([\d.]+)"/)[1];

const D = { izq: { electrodo: 'Zn', disolucion: 'Zn²⁺', rol: 'ánodo', proceso: 'oxidación', color: 'h' }, der: { electrodo: 'Cu', disolucion: 'Cu²⁺', rol: 'cátodo', proceso: 'reducción', color: 'i' },
  electrones: 'der', iones: true, medidor: '1,10 V', desde: { iones: 1, roles: 2 } };
test('se registra en el kit', () => assert.equal(Kit.piezas['quim-celda'], P));
test('fidelidad: electrones sobre el alambre, iones en el puente', () => {
  for (const tipo of ['galvanica', 'electrolitica']) {
    const s = P.dibujar(Object.assign({}, D, { tipo }), { corte: 2 });
    const ys = g => { const m = s.match(new RegExp('class="' + g + '[^"]*">(.*?)</g>(?=<g class|</svg>)')); return [...m[1].matchAll(/y[12]="([\d.]+)"/g)].map(x => +x[1]); };
    assert.ok(ys('kit-electrones').every(y => y < 34), tipo);
    assert.ok(ys('kit-iones').every(y => y > 60), tipo);
  }
  assert.ok(!/kit-iones/.test(P.dibujar(D, { corte: 0 })));
});
test('comunes: sana, pura, alto fijo y alt', () => {
  const s0 = P.dibujar(D, { corte: 0 }), s2 = P.dibujar(D, { corte: 2 });
  sana(s0); sana(s2); assert.equal(alto(s0), alto(s2)); assert.match(P.alt(D), /por el alambre/);
});
