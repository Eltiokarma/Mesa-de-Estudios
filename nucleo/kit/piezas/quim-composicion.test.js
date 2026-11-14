// Pruebas de la pieza «quim-composicion»: el largo de cada tramo es proporcional a su valor, la escala común
// compara filas, las filas aparecen en su paso y las comunes del kit.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./quim-composicion.js');

function sana(svg) {
  assert.ok(!/NaN|undefined|null|Infinity/.test(svg));
  assert.ok(!/#[0-9a-f]{3,6}\b/i.test(svg), 'sin colores fijos');
  assert.ok(!/<script|\son[a-z]+\s*=|\sid=/i.test(svg));
  for (const [, t] of svg.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14, `texto de ${t}`);
  for (const [, c] of svg.matchAll(/var\(--c-([a-z])\)/g)) assert.ok(['o', 'i', 'h', 'd'].includes(c));
}
const alto = svg => svg.match(/viewBox="0 0 320 ([\d.]+)"/)[1];
const anchos = svg => [...svg.matchAll(/<rect [^>]*width="([\d.]+)" height="30"/g)].map(m => +m[1]);
const D = { escala: 'comun', filas: [
  { titulo: 'antes', tramos: [{ valor: 4, texto: 'H₂ 4 g', color: 'i' }, { valor: 32, texto: 'O₂ 32 g', color: 'h' }] },
  { titulo: 'después', tramos: [{ valor: 36, texto: 'H₂O 36 g', color: 'o' }], desde: 1 },
  { titulo: 'la mitad', tramos: [{ valor: 18, texto: '18 g', color: 'o' }], desde: 2 },
] };

test('se registra en el kit', () => assert.equal(Kit.piezas['quim-composicion'], P));
test('fidelidad: tramos proporcionales; con escala común, igual masa da igual largo', () => {
  const a = anchos(P.dibujar(D, { corte: 2 }));
  assert.ok(Math.abs(a[1] / a[0] - 8) < 0.01);
  assert.ok(Math.abs(a[0] + a[1] - a[2]) < 0.02);
  assert.ok(Math.abs(a[3] - a[2] / 2) < 0.02);
  const p = anchos(P.dibujar({ filas: [{ tramos: [{ valor: 1 }, { valor: 3 }] }] }));
  assert.deepEqual(p, [75, 225]);
});
test('las filas aparecen en su paso; el alto no cambia', () => {
  const s0 = P.dibujar(D, { corte: 0 }), s2 = P.dibujar(D, { corte: 2 });
  assert.equal(anchos(s0).length, 2); assert.equal(anchos(s2).length, 4);
  assert.equal(alto(s0), alto(s2));
});
test('comunes: sana, pura y alt', () => {
  const s = P.dibujar(D, { corte: 2 });
  sana(s); assert.equal(s, P.dibujar(D, { corte: 2 }));
  assert.match(P.alt(D), /antes: H₂ 4 g, O₂ 32 g/);
});
test('geometría: xDe y valorEn son inversas y caen en el borde de cada tramo', () => {
  const g = P.geometria(D), s = P.dibujar(D, { corte: 5 });
  for (let i = 0; i < D.filas.length; i++) {
    let acum = 0;
    for (const t of D.filas[i].tramos) {
      const x = g.xDe(i, acum);
      assert.ok(s.includes(`<rect x="${Kit.trazo.n(x)}" y="${g.y(i)}"`), `fila ${i} acumulado ${acum}`);
      assert.ok(Math.abs(g.valorEn(i, x) - acum) < 1e-9);
      acum += t.valor;
    }
  }
});
