// Pruebas de la pieza «arit-calculadora» (la calculadora de 8 casillas de doña Juana, idea 7 de «Las cuatro
// operaciones»): se dibuja sin NaN ni colores fijos, es pura, de alto fijo, marcada como dibujo de prueba y con su texto
// alternativo; es fiel (una casilla por cifra, las cifras desde la derecha, «E» si no caben, «?» si se pide); nunca usa
// verde ni carmín. Con números (no a ojo; docs/molde-unidad.md §6): todo cabe en el lienzo con 4 de margen, ningún texto
// pisa a otro, las cifras quedan dentro de la pantalla y la cuenta dentro de la calculadora. Se revisan las muestras de
// abajo y todas las figuras de la teoría que usan la pieza (Lee, el juego en toda su grilla, Predice, «Mira» paso a
// paso, ejemplos y «Así se resuelve» en 60 semillas).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../kit.js');
const P = require('./arit-calculadora.js');

const MUESTRAS = [
  {},
  { calcs: [{ cuenta: '24 × 7', pantalla: '168' }] },
  { calcs: [{ cuenta: 'A ÷ B', pantalla: '?' }] },
  { calcs: [{ cuenta: '10 000 × 1 000', pantalla: '10000000', rotulo: 'el menor' }, { cuenta: '99 999 × 9 999', pantalla: '999890001', rotulo: 'el mayor' }] },
  { calcs: [{ cuenta: '1 000 000 ÷ 999', pantalla: '1001', rotulo: 'el menor' }, { cuenta: '9 999 999 ÷ 100', pantalla: '99999', rotulo: 'el mayor' }] },
  { calcs: [{ cuenta: '1 × 1', pantalla: '1', rotulo: 'el menor' }, { cuenta: '9 × 9', pantalla: '81', color: false, rotulo: 'el mayor' }] },
  { casillas: 10, calcs: [{ cuenta: '6 cifras × 6 cifras', pantalla: 'E' }] },
];
const solapan = (a, b, e = 0) => a.x0 < b.x1 + e && b.x0 < a.x1 + e && a.y0 < b.y1 + e && b.y0 < a.y1 + e;
function revisar(d, nombre, mal, e = {}) {
  const s = P.dibujar(d, e), g = P.geometria(d, e), { W, H, M } = P.constantes;
  if (/NaN|undefined|Infinity/.test(s)) { mal.push(`${nombre}: NaN o undefined`); return; }
  for (const c of [...g.objetos, ...g.textos]) if (!(c.x0 >= M - 1e-9 && c.y0 >= M - 1e-9 && c.x1 <= W - M + 1e-9 && c.y1 <= H - M + 1e-9))
    mal.push(`${nombre}: se sale «${c.txt || c.que}»`);
  const t = g.textos;
  for (let i = 0; i < t.length; i++) for (let j = i + 1; j < t.length; j++) if (solapan(t[i], t[j], 0.5)) mal.push(`${nombre}: se pisan «${t[i].txt}» y «${t[j].txt}»`);
  for (const c of g.cajas) {
    const o = g.objetos.filter(x => x.que === c.dentro)[c.calc];
    if (!(o && c.x0 >= o.x0 + 2 && c.x1 <= o.x1 - 2 && c.y0 >= o.y0 + 2 && c.y1 <= o.y1 - 2)) mal.push(`${nombre}: «${c.txt}» se sale de la ${c.dentro}`);
  }
  const cs = g.objetos.filter(x => x.que === 'calculadora');
  for (let i = 0; i < cs.length; i++) for (let j = i + 1; j < cs.length; j++) if (solapan(cs[i], cs[j])) mal.push(`${nombre}: se pisan las calculadoras`);
}

test('registrada en el kit', () => assert.equal(Kit.piezas['arit-calculadora'], P));

test('sin NaN ni colores fijos ni verde ni carmín, pura, de alto fijo, marcada de prueba y con texto alternativo', () => {
  const altos = new Set();
  for (const d of MUESTRAS) {
    const s = P.dibujar(d);
    assert.ok(!/NaN|undefined|Infinity/.test(s), JSON.stringify(d));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), 'sin colores fijos');
    assert.ok(!/var\(--c-[hd]\)/.test(s), 'sin carmín ni verde');
    assert.ok(!/\sid="|filter|<image/.test(s), 'sin ids, filtros ni imágenes');
    assert.equal(s, P.dibujar(d), 'pura');
    assert.match(s, /data-objeto="calculadora" data-prueba="si"/);
    altos.add(s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)[0]);
    assert.ok(P.alt(d).length > 30 && !/undefined|NaN/.test(P.alt(d)), P.alt(d));
  }
  assert.deepEqual([...altos], ['viewBox="0 0 320 220"']);
});

test('fiel: una casilla por cifra, las cifras desde la derecha, «E» si no caben y «?» si se pide', () => {
  const casillas = s => (s.match(/class="ac-casilla"/g) || []).length;
  assert.equal(casillas(P.dibujar({ calcs: [{ pantalla: '1' }] })), 8);
  assert.equal(casillas(P.dibujar({ casillas: 10, calcs: [{ pantalla: '1' }, { pantalla: '2' }] })), 20);
  // 99 899 001 llena las 8; las cifras van en casillas vecinas, la última en la de la derecha.
  const g = P.geometria({ calcs: [{ pantalla: '99899001' }] }), c = g.calcs[0];
  assert.deepEqual(c.items.map(x => x.txt).join(''), '99899001');
  const ult = c.casilla(7);
  assert.ok(Math.abs(c.items[7].x - (ult.x0 + ult.x1) / 2) < 1e-9);
  // 168 ocupa las tres de la derecha.
  const h = P.geometria({ calcs: [{ pantalla: '168' }] }).calcs[0];
  assert.ok(Math.abs(h.items[0].x - (h.casilla(5).x0 + h.casilla(5).x1) / 2) < 1e-9);
  // Nueve cifras no caben: «E».
  assert.equal(P.geometria({ calcs: [{ pantalla: '999890001' }] }).calcs[0].items.map(x => x.txt).join(''), 'E');
  assert.match(P.alt({ calcs: [{ pantalla: '999890001' }] }), /no cabe/);
  // Lo que se pide, «?» en tinta; el resultado, en violeta; las casillas, en turquesa.
  const pide = P.dibujar({ calcs: [{ cuenta: 'A ÷ B', pantalla: '?' }] });
  assert.ok(!/var\(--c-f\)/.test(pide), 'nada en violeta si se pide');
  assert.match(P.dibujar({ calcs: [{ pantalla: '168' }] }), /fill="var\(--c-f\)"[^>]*>1</);
  assert.match(pide, /class="ac-casilla"[^>]*stroke="var\(--c-i\)"/);
});

test('muestras: todo cabe con 4 de margen y ningún texto pisa a otro', () => {
  const mal = [];
  for (const d of MUESTRAS) revisar(d, JSON.stringify(d).slice(0, 60), mal);
  assert.deepEqual(mal, []);
});

test('todas las figuras de la teoría que usan la pieza: caben y sus textos no se pisan', () => {
  const Teoria = require('../../teoria.js');
  const U = require(path.join(__dirname, '../../../contenido/teoria/aritmetica/cuatro-operaciones.js'));
  for (const r of U.requiere || []) require(path.join(__dirname, '../../..', r));
  const figs = [], mal = [];
  const toma = (nombre, dib, pieza) => { if (dib && dib.datos && pieza === 'arit-calculadora') figs.push([nombre, dib.datos, dib.estado || {}]); };
  for (const idea of U.ideas) {
    const pz = idea.pieza;
    for (const [k, t] of ((idea.lee && idea.lee.tarjetas) || []).entries()) toma(`${idea.id} lee ${k + 1}`, t.dibujo, t.pieza || pz);
    for (const v of Teoria.grilla(idea.juega.controles || [])) toma(`${idea.id} juego ${JSON.stringify(v)}`, idea.juega.dibujo(v), idea.juega.pieza || pz);
    toma(`${idea.id} predice`, idea.predice.dibujo, idea.predice.pieza || pz);
    toma(`${idea.id} revelar`, idea.predice.revelar, idea.predice.pieza || pz);
    idea.mira.pasos.forEach((ps, i) => toma(`${idea.id} mira ${i + 1}`, { datos: idea.mira.datos, estado: ps.estado || {} }, idea.mira.pieza || pz));
    for (const [k, e] of (idea.ejemplos || []).entries()) if (e.figura) toma(`${idea.id} ejemplo ${k + 1}`, e.figura, e.figura.pieza);
    for (let s = 0; s < 60; s++) if (idea.resuelve) { const c = idea.resuelve.generar(s); toma(`${idea.id} resuelve ${s}`, c.dibujo, idea.resuelve.pieza || pz); }
  }
  assert.ok(figs.length > 30, `${figs.length} figuras`);
  for (const [nombre, d, e] of figs) revisar(d, nombre, mal, e);
  assert.deepEqual(mal.slice(0, 20), []);
});
