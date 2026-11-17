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

test('agita (ronda 5): sin el campo el dibujo no cambia; con él, las partículas tiemblan sin cambiar su número', () => {
  const cuenta = s => (s.match(/class="kit-particula/g) || []).length;
  const base = P.dibujar(D, { corte: 1 });
  const a = P.dibujar(Object.assign({}, D, { agita: 0.3 }), { corte: 1 }), b = P.dibujar(Object.assign({}, D, { agita: 0.7 }), { corte: 1 });
  sana(a); sana(b);
  assert.equal(cuenta(a), cuenta(base)); assert.equal(cuenta(b), cuenta(base));
  assert.notEqual(a, b); assert.notEqual(a, base);
  assert.equal(a, P.dibujar(Object.assign({}, D, { agita: 0.3 }), { corte: 1 }), 'pura: mismo t, mismo dibujo');
  assert.equal(alto(a), alto(base));
  // El temblor no pasa de la amplitud pedida.
  const xs = s => [...s.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)"/g)].map(m => [+m[1], +m[2]]);
  const quieto = xs(P.dibujar(Object.assign({}, D, { agita: 0, agitaAmp: 0 }), { corte: 1 })), movido = xs(P.dibujar(Object.assign({}, D, { agita: 0.45, agitaAmp: 2 }), { corte: 1 }));
  movido.forEach(([x, y], j) => { assert.ok(Math.abs(x - quieto[j][0]) <= 2.01 && Math.abs(y - quieto[j][1]) <= 2.01); });
});

// Paleta de elementos (17 nov): un átomo con `el` se pinta con var(--el-<Símbolo>) y nunca con un token de variable;
// sin `el`, el dibujo es el mismo de antes (las unidades que ya usan la pieza no cambian).
test('paleta de elementos: con el, var(--el-*) y ningún color de variable; sin el, nada cambia', () => {
  const E = require('../../elementos.js');
  const conEl = Object.assign({}, D, {
    atomos: { H: { el: 'H', estilo: 'hueco', r: 5 }, O: { el: 'O', r: 7 }, Na: { el: 'Na', estilo: 'punto' } } });
  const s = P.dibujar(conEl, { corte: 1 });
  sana(s);
  assert.ok(!/var\(--c-/.test(s), 'un dibujo de partículas no usa colores de variable');
  const usados = [...new Set([...s.matchAll(/var\(--el-([A-Za-z]+)\)/g)].map(m => m[1]))].sort();
  assert.deepEqual(usados, ['H', 'Na', 'O']);
  for (const e of usados) assert.ok(E.COLORES[e], `${e} está en nucleo/elementos.js`);
  // La misma geometría: solo cambia el color.
  const sinColor = x => x.replace(/var\(--(c|el)-[A-Za-z]+\)/g, 'C');
  assert.equal(sinColor(s), sinColor(P.dibujar(D, { corte: 1 })));
  // Un `el` que no es un símbolo no inyecta nada raro: cae en el color de siempre.
  const raro = P.dibujar(Object.assign({}, D, { atomos: { H: { el: 'h2"', color: 'i' } } }), { corte: 0 });
  assert.ok(!/--el-/.test(raro));
  assert.equal(typeof P.especieSVG, 'function');
});
