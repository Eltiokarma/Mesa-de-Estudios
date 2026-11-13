// Pruebas de la pieza «pista»: fidelidad (el apoyo del carrito cae sobre la rayita de la regla del mismo metro),
// ruedas que giran lo que ruedan, nada de NaN ni colores fijos, texto de 14 o más y alto que no salta.
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('./pista.js');

const MRU = { largo: 30, cada: 5, carriles: [{ x: 12, marcas: [0, 4, 8, 12] }], registro: [] };
const DOS = {
  largo: 30, cada: 5,
  carriles: [{ x: 9, variante: 'a', marcas: [0, 3, 6, 9], rotulo: 'A' }, { x: 9, variante: 'b', marcas: [18, 15, 12, 9], rotulo: 'B', flecha: { a: -2 } }],
  bandera: { x: 12, rotulo: 'tu predicción' }, encuentro: { x: 9, rotulo: '9 m' },
  registro: [{ marcas: [0, 2, 4, 6], rotulo: '2 m/s' }, { marcas: [0, 6, 12], rotulo: '6 m/s' }],
};

test('fidelidad: el apoyo del carrito coincide con la regla dentro de 1 px en cinco valores', () => {
  for (const x of [0, 4.5, 12, 22.25, 30]) {
    const d = { ...MRU, carriles: [{ x }] };
    const s = P.dibujar(d);
    const m = s.match(/kit-carrito-0" transform="translate\(([\d.]+) ([\d.]+)\)/);
    assert.ok(m, 'el carrito está dibujado');
    const regla = P.escala(d, x);
    assert.ok(Math.abs(+m[1] - regla) <= 1, `x = ${x}: carrito en ${m[1]}, regla en ${regla}`);
    // La rayita entera más cercana de la regla está donde la escala dice.
    const k = Math.round(x);
    const ray = [...s.matchAll(/<line x1="([\d.]+)" y1="[\d.]+" x2="\1"/g)].map(r => +r[1]);
    assert.ok(ray.some(r => Math.abs(r - P.escala(d, k)) <= 1), `rayita de ${k} m`);
  }
});

test('las ruedas giran lo que rueda el carrito: recorrido / radio', () => {
  const { RR } = P.constantes;
  const a = P.mover(MRU, 0, 0), b = P.mover(MRU, 0, 10);
  const giro = +b.rueda.match(/rotate\(([-\d.]+)\)/)[1] - +a.rueda.match(/rotate\(([-\d.]+)\)/)[1];
  assert.ok(Math.abs(giro - (b.px - a.px) / RR * 180 / Math.PI) < 0.01);
});

test('sin NaN, undefined ni colores fijos; texto de 14 o más; el alto no salta al sumar corridas', () => {
  for (const d of [MRU, DOS, { largo: 30 }, { ...DOS, registro: [], bandera: null, encuentro: null }]) {
    const s = P.dibujar(d);
    assert.ok(!/NaN|undefined|null|Infinity/.test(s), s.match(/.{20}(NaN|undefined|null|Infinity).{20}/));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), 'colores solo con var(--c-*), var(--card) o currentColor');
    assert.ok(!/<script|\son[a-z]+\s*=|javascript:|<foreignObject|\sid=/i.test(s), 'sin código ni ids');
    for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14);
    for (const [, c] of s.matchAll(/var\(--c-([a-z])\)/g)) assert.ok(['i', 'd'].includes(c), `color ${c}`);
  }
  const alto = d => P.dibujar(d).match(/viewBox="0 0 320 ([\d.]+)"/)[1];
  assert.equal(alto({ ...DOS, registro: [] }), alto(DOS));
  assert.equal(alto({ ...DOS, registro: [{ marcas: [0] }] }), alto(DOS));
});

test('el texto alternativo cuenta la separación de las marcas, no la coreografía', () => {
  assert.match(P.alt(MRU), /marcas cada 4 m/);
  assert.match(P.alt(DOS), /se encuentran en x = 9 m/);
  assert.match(P.alt(DOS), /predicción en x = 12 m/);
});
