// Pruebas de la pieza «quim-nomenclatura» (objetos de la primera pantalla y tarjeta de nombres): pura, sin NaN ni verde,
// marcada como dibujo de prueba, con texto alternativo. Con números (docs/molde-unidad.md §6): todo cabe con 4 de margen,
// ningún rótulo pisa a otro ni al objeto, y la etiqueta cabe en su marco.
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('./quim-nomenclatura.js');
const T = require('../trazo.js');

const ETQ = { permanganato: 'KMnO₄', 'agua-oxigenada': 'H₂O₂', magnesia: 'Mg(OH)₂', salero: 'NH₄NO₃', bicarbonato: 'NaHCO₃' };
const OBJS = P.OBJETOS.flatMap(objeto => [
  { vista: 'objeto', objeto, etiqueta: ETQ[objeto], nombre: 'Un nombre de tres o cuatro palabras' },
  { vista: 'objeto', objeto, titulo: 'Un título', nombre: 'Otro nombre' },
]);
const NOMS = [
  { vista: 'nombres', titulo: 'Óxido básico', formula: [{ t: 'Fe₂', color: 'o' }, { t: 'O₃', color: 'i' }],
    filas: [{ sistema: 'Sistemática', nombre: 'trióxido de dihierro' }, { sistema: 'Stock', nombre: ['óxido de hierro', { t: '(III)', color: 'f' }] },
      { sistema: 'Tradicional', nombre: 'óxido férrico', desde: 2 }] },
  { vista: 'nombres', formula: 'CuSO₄·5H₂O', filas: [{ sistema: 'Stock', nombre: 'sulfato de cobre(II) pentahidratado' }, { sistema: 'Tradicional', oculto: true }] },
  { vista: 'nombres', oculta: true, filas: [{ sistema: 'Stock', nombre: 'hidrogenocarbonato de sodio' }, { sistema: 'Sistemática', nombre: 'dióxido de plomo' },
    { sistema: 'Tradicional', nombre: 'sulfato de hierro(III) heptahidratado' }, { sistema: 'Común', nombre: 'bicarbonato de sodio' }] },
];
const solapan = (a, b) => a.x0 < b.x1 - 0.5 && b.x0 < a.x1 - 0.5 && a.y0 < b.y1 - 0.5 && b.y0 < a.y1 - 0.5;

test('pura, sin NaN ni verde, con texto alternativo y los objetos marcados como dibujo de prueba', () => {
  for (const d of [...OBJS, ...NOMS]) for (const estado of [{}, { corte: 2 }]) {
    const svg = P.dibujar(d, estado);
    assert.equal(svg, P.dibujar(d, estado));
    assert.ok(!/NaN|undefined|Infinity/.test(svg), JSON.stringify(d));
    assert.ok(!/--c-d\b/.test(svg), 'sin verde');
    assert.ok(P.alt(d).length > 15);
    if (d.vista === 'objeto') assert.ok(svg.includes(`data-objeto="${d.objeto}" data-prueba="si"`));
  }
  // Una fila con «desde» no se dibuja antes de su paso; lo oculto lleva «?».
  assert.ok(!/>óxido férrico</.test(P.dibujar(NOMS[0], { corte: 1 }))); assert.ok(/>óxido férrico</.test(P.dibujar(NOMS[0], { corte: 2 })), 'la fila aparece en su paso');
  assert.ok(/>\?</.test(P.dibujar(NOMS[1])) && !/>\?</.test(P.dibujar(NOMS[0])));
  // El romano lleva el violeta del estado de oxidación; la fórmula, la serif de las ecuaciones.
  const svg = P.dibujar(NOMS[0]);
  assert.match(svg, /<tspan fill="var\(--c-f\)">\(III\)<\/tspan>/);
  assert.ok(svg.includes(`font-family:${T.SERIF}`));
});

test('todo cabe con 4 de margen y nada se pisa; la etiqueta cabe en su marco', () => {
  for (const d of [...OBJS, ...NOMS]) {
    const g = P.geometria(d), { W, H, M } = g, nombre = JSON.stringify(d).slice(0, 80);
    for (const c of [...g.textos, ...g.objetos, ...g.dentro]) assert.ok(c.x0 >= M - 1e-9 && c.x1 <= W - M + 1e-9 && c.y0 >= M - 1e-9 && c.y1 <= H - M + 1e-9, `${nombre}: se sale «${c.txt || c.que}»`);
    for (let a = 0; a < g.textos.length; a++) for (let b = a + 1; b < g.textos.length; b++) assert.ok(!solapan(g.textos[a], g.textos[b]), `${nombre}: «${g.textos[a].txt}» y «${g.textos[b].txt}»`);
    for (const t of g.textos) for (const o of g.objetos) assert.ok(!solapan(t, o), `${nombre}: «${t.txt}» pisa ${o.que}`);
    for (const t of g.dentro) { const [x0, y0, x1, y1] = t.marco; assert.ok(t.x0 >= x0 + 2 && t.x1 <= x1 - 2 && t.y0 >= y0 + 1 && t.y1 <= y1 - 1, `${nombre}: la etiqueta «${t.txt}» no cabe`); }
  }
});
