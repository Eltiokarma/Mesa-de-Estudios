// Pruebas de la pieza «quim-reaccion» (objetos de la primera pantalla e inventario de una ecuación): pura, sin NaN ni
// verde, marcada como dibujo de prueba, con texto alternativo. Con números (docs/molde-unidad.md §6): todo cabe con 4 de
// margen, ningún rótulo pisa a otro ni al objeto, la ecuación cabe en su marco y la etiqueta del frasco en la suya.
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('./quim-reaccion.js');
const T = require('../trazo.js');

const OBJS = P.OBJETOS.flatMap(objeto => [
  { vista: 'objeto', objeto, etiqueta: 'KMnO₄', nombre: 'Un nombre de tres o cuatro palabras' },
  { vista: 'objeto', objeto, titulo: 'Un título corto', nombre: 'Otro nombre' },
]);
const cf = t => ({ v: 'c-f', t });
const INVS = [
  { vista: 'inventario', ecuacion: [cf('1'), ' CH₄ + ', cf('2'), ' O₂ → ', cf('1'), ' CO₂ + ', cf('2'), ' H₂O'],
    filas: [{ et: 'C', izq: '1', der: '1', igual: true }, { et: 'H', izq: '4', der: '4', igual: true }, { et: 'O', izq: '4', der: '2 + 2', igual: true, desde: 2 }] },
  { vista: 'inventario', titulo: 'Semirreacción en medio ácido', ecuacion: ['MnO₄⁻ + ', cf('8'), ' H⁺ + ', { v: 'c-i', t: '5 e⁻' }, ' → Mn²⁺ + ', cf('4'), ' H₂O'],
    filas: [{ et: 'Mn', izq: '1', der: '1', igual: true }, { et: 'O', izq: '4', der: '4', igual: true }, { et: 'H', izq: '8', der: '8', igual: true },
      { et: 'carga', izq: '+2', der: '+2', color: 'h', igual: true }, { et: 'e⁻', izq: '?', der: '0', oculto: 'izq', igual: false }] },
  { vista: 'inventario', cabeza: ['pierde', 'gana'], ecuacion: 'Cr₂O₇²⁻ + 14 H⁺ + 6 Fe²⁺ → 2 Cr³⁺ + 7 H₂O + 6 Fe³⁺',
    filas: [{ et: 'e⁻', izq: [{ t: '6', color: 'i' }], der: [{ t: '6', color: 'i' }], igual: true }] },
];
const solapan = (a, b) => a.x0 < b.x1 - 0.5 && b.x0 < a.x1 - 0.5 && a.y0 < b.y1 - 0.5 && b.y0 < a.y1 - 0.5;

test('pura, sin NaN ni verde, con texto alternativo y los objetos marcados como dibujo de prueba', () => {
  for (const d of [...OBJS, ...INVS]) for (const estado of [{}, { corte: 2 }]) {
    const svg = P.dibujar(d, estado);
    assert.equal(svg, P.dibujar(d, estado));
    assert.ok(!/NaN|undefined|Infinity/.test(svg), JSON.stringify(d));
    assert.ok(!/--c-d\b/.test(svg), 'sin verde');
    assert.ok(P.alt(d).length > 15);
    if (d.vista === 'objeto') assert.ok(svg.includes(`data-objeto="${d.objeto}" data-prueba="si"`));
  }
  // Una fila con «desde» no se llena antes de su paso; lo oculto lleva «?»; la marca sale de `igual`.
  assert.ok(!/>2 \+ 2</.test(P.dibujar(INVS[0], { corte: 1 }))); assert.ok(/>2 \+ 2</.test(P.dibujar(INVS[0], { corte: 2 })));
  assert.ok(/>\?</.test(P.dibujar(INVS[1]))); assert.ok(/>≠</.test(P.dibujar(INVS[1]))); assert.ok(/>✓</.test(P.dibujar(INVS[0], { corte: 2 })));
  // La ecuación en la serif, con el coeficiente en violeta y la carga con el color de su fila.
  const svg = P.dibujar(INVS[1]);
  assert.ok(svg.includes(`font-family:${T.SERIF}`));
  assert.match(svg, /<tspan fill="var\(--c-f\)">8<\/tspan>/);
  assert.match(svg, /<tspan fill="var\(--c-h\)">\+2<\/tspan>/);
  assert.ok(P.dibujar(OBJS.find(d => d.objeto === 'permanganato')).includes(`font-family:${T.SERIF}`), 'la etiqueta del frasco en la serif');
});

test('todo cabe con 4 de margen y nada se pisa; la ecuación y la etiqueta caben en su marco', () => {
  for (const d of [...OBJS, ...INVS]) {
    const g = P.geometria(d), { W, H, M } = g, nombre = JSON.stringify(d).slice(0, 80);
    for (const c of [...g.textos, ...g.objetos, ...g.dentro]) assert.ok(c.x0 >= M - 1e-9 && c.x1 <= W - M + 1e-9 && c.y0 >= M - 1e-9 && c.y1 <= H - M + 1e-9, `${nombre}: se sale «${c.txt || c.que}»`);
    for (let a = 0; a < g.textos.length; a++) for (let b = a + 1; b < g.textos.length; b++) assert.ok(!solapan(g.textos[a], g.textos[b]), `${nombre}: «${g.textos[a].txt}» y «${g.textos[b].txt}»`);
    for (const t of g.textos) for (const o of g.objetos) assert.ok(!solapan(t, o), `${nombre}: «${t.txt}» pisa ${o.que}`);
    for (const t of [...g.dentro, ...g.textos.filter(x => x.marco)]) { const [x0, y0, x1, y1] = t.marco; assert.ok(t.x0 >= x0 + 2 && t.x1 <= x1 - 2 && t.y0 >= y0 + 1 && t.y1 <= y1 - 1, `${nombre}: «${t.txt}» no cabe en su marco`); }
  }
});

// Lectores en frío (26 nov): el color de la sustancia es el indicio que enseña la idea, y la flecha de la ecuación no se
// ve como un guion en la serif.
test('los objetos muestran el color de sus sustancias y la flecha va en la letra de la interfaz', () => {
  const svg = k => P.dibujar({ vista: 'objeto', objeto: k });
  assert.ok(svg('zinc').includes('#2f7fd6') && svg('zinc').includes('#b4532a'), 'zinc: solución azul y capa rojiza de cobre');
  assert.ok(svg('plata').includes('#9aa3ad') && svg('plata').includes('#b4532a'), 'plata: cristales de plata en un alambre de cobre');
  assert.ok(svg('permanganato').includes('#7a2f93'), 'permanganato: morado');
  const inv = P.dibujar({ vista: 'inventario', ecuacion: 'Cu + 2 Ag⁺ → Cu²⁺ + 2 Ag', filas: [{ et: 'e⁻', izq: '2', der: '2', igual: true }] });
  assert.match(inv, /<tspan style="font-family:system-ui,sans-serif">→<\/tspan>/);
});
