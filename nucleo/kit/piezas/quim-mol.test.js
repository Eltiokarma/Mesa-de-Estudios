// Pruebas de la pieza «quim-mol» (objetos de la primera pantalla y tarjeta de conteo): pura, sin NaN ni verde, marcada
// como dibujo de prueba, con texto alternativo. Con números (docs/molde-unidad.md §6): todo cabe con 4 de margen, ningún
// rótulo pisa a otro ni al objeto, y lo que va dentro de una etiqueta (o del cuadro de la tabla) cabe en su marco.
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('./quim-mol.js');
const T = require('../trazo.js');

const ETQ = { balanza: '90,0 g', tiza: 'CaCO₃', sal: 'NaCl', vinagre: 'Vinagre', frasco: '250,0 g' };
const OBJS = P.OBJETOS.flatMap(objeto => [
  { vista: 'objeto', objeto, etiqueta: ETQ[objeto], celda: { z: '17', simbolo: 'Cl', masa: '35,45', color: 'i' }, nombre: 'Un nombre de tres o cuatro palabras' },
  { vista: 'objeto', objeto, titulo: 'Un título', celda: { z: '12', simbolo: 'Mg', masa: '?' }, nombre: 'Otro nombre' },
]);
const CUENTAS = [
  { vista: 'cuenta', formula: [{ t: '2 mol', color: 'f' }, { t: ' de Al₂(SO₄)₃' }], cabeza: ['por unidad', 'en 2 mol'],
    filas: [{ el: 'Al', por: '2', total: '4 mol', color: 'f' }, { el: 'S', por: '3', total: '6 mol', color: 'f', desde: 2 }, { el: 'O', por: '3 × 4 = 12', oculto: true }] },
  { vista: 'cuenta', titulo: 'Una tiza', formula: 'CaCO₃', filas: [{ el: 'Ca', por: '1', total: '1' }, { el: 'C', por: '1', total: '1' }, { el: 'O', por: '3', total: '3' },
    { el: 'Cl', por: '2', total: '1,20 × 10²⁴', color: 'h' }, { el: 'H', por: '12', total: '?' }] },
];
const solapan = (a, b) => a.x0 < b.x1 - 0.5 && b.x0 < a.x1 - 0.5 && a.y0 < b.y1 - 0.5 && b.y0 < a.y1 - 0.5;

test('pura, sin NaN ni verde, con texto alternativo y los objetos marcados como dibujo de prueba', () => {
  for (const d of [...OBJS, ...CUENTAS]) for (const estado of [{}, { corte: 2 }]) {
    const svg = P.dibujar(d, estado);
    assert.equal(svg, P.dibujar(d, estado));
    assert.ok(!/NaN|undefined|Infinity/.test(svg), JSON.stringify(d));
    assert.ok(!/--c-d\b/.test(svg), 'sin verde');
    assert.ok(P.alt(d).length > 15);
    if (d.vista === 'objeto') assert.ok(svg.includes(`data-objeto="${d.objeto}" data-prueba="si"`));
  }
  // Un total con «desde» no se dibuja antes de su paso; lo oculto lleva «?».
  assert.ok(!/>6 mol</.test(P.dibujar(CUENTAS[0], { corte: 1 }))); assert.ok(/>6 mol</.test(P.dibujar(CUENTAS[0], { corte: 2 })));
  assert.ok(/>\?</.test(P.dibujar(CUENTAS[0])));
  // Los símbolos y la fórmula en la serif de las ecuaciones; el total con el color de su magnitud.
  const svg = P.dibujar(CUENTAS[0]);
  assert.ok(svg.includes(`font-family:${T.SERIF}`));
  assert.match(svg, /<tspan fill="var\(--c-f\)">4 mol<\/tspan>/);
  assert.ok(P.dibujar(OBJS[0]).includes(`font-family:${T.SERIF}`), 'el símbolo del cuadro en la serif');
});

test('todo cabe con 4 de margen y nada se pisa; las etiquetas caben en su marco', () => {
  for (const d of [...OBJS, ...CUENTAS]) {
    const g = P.geometria(d), { W, H, M } = g, nombre = JSON.stringify(d).slice(0, 80);
    for (const c of [...g.textos, ...g.objetos, ...g.dentro]) assert.ok(c.x0 >= M - 1e-9 && c.x1 <= W - M + 1e-9 && c.y0 >= M - 1e-9 && c.y1 <= H - M + 1e-9, `${nombre}: se sale «${c.txt || c.que}»`);
    for (let a = 0; a < g.textos.length; a++) for (let b = a + 1; b < g.textos.length; b++) assert.ok(!solapan(g.textos[a], g.textos[b]), `${nombre}: «${g.textos[a].txt}» y «${g.textos[b].txt}»`);
    for (const t of g.textos) for (const o of g.objetos) assert.ok(!solapan(t, o), `${nombre}: «${t.txt}» pisa ${o.que}`);
    for (let a = 0; a < g.dentro.length; a++) for (let b = a + 1; b < g.dentro.length; b++) assert.ok(!solapan(g.dentro[a], g.dentro[b]), `${nombre}: «${g.dentro[a].txt}» y «${g.dentro[b].txt}»`);
    for (const t of g.dentro) { const [x0, y0, x1, y1] = t.marco; assert.ok(t.x0 >= x0 + 2 && t.x1 <= x1 - 2 && t.y0 >= y0 + 1 && t.y1 <= y1 - 1, `${nombre}: «${t.txt}» no cabe en su marco`); }
  }
});
