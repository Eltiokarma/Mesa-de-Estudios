// Pruebas de la pieza «quim-hotel» (el hotel del electrón, ideas 3 y 4 de Estructura atómica): sana, pura, marcada de
// prueba, fiel (una flecha violeta por electrón; precios n + ℓ) y, con números (docs/molde-unidad.md §6), todo dentro del
// lienzo con 4 de margen y ningún rótulo que pise a otro ni a las cajas, en las muestras y en toda la unidad.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../kit.js');
const Teoria = require('../../teoria.js');
const P = require('./quim-hotel.js');

// Todas las figuras de «Estructura atómica» que usan una pieza (juego en toda su grilla, Lee, Predice, Mira, la regla,
// los ejemplos, «Así se resuelve», «Ahora tú» y las mesas del laboratorio).
function figurasUnidad(pieza) {
  const def = require('../../../contenido/teoria/quimica/estructura-atomica.js');
  for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
  const out = [], con = (donde, f, pz) => { const p = f && (f.pieza || pz); if (f && f.datos && p === pieza) out.push({ donde, datos: f.datos, estado: f.estado || {} }); };
  for (const i of def.ideas) {
    const d = i.id;
    for (const v of Teoria.grilla(i.juega.controles)) con(`${d} juego ${JSON.stringify(v)}`, i.juega.dibujo(v), i.juega.pieza || i.pieza);
    i.lee.tarjetas.forEach((t, k) => con(`${d} lee ${k + 1}`, t.dibujo, t.pieza));
    con(`${d} predice`, i.predice.dibujo, i.predice.pieza || i.pieza); con(`${d} revelar`, i.predice.revelar, i.predice.pieza || i.pieza);
    for (let c = 0; c <= 6; c++) con(`${d} mira corte ${c}`, { datos: i.mira.datos, estado: { corte: c } }, i.mira.pieza || i.pieza);
    if (i.regla.dibujo) con(`${d} regla`, i.regla.dibujo, i.regla.dibujo.pieza || i.mira.pieza || i.pieza);
    i.ejemplos.forEach((e, k) => con(`${d} ejemplo ${k + 1}`, e.figura));
    for (let s = 0; s < 40; s++) {
      const r = i.resuelve.generar(s), a = i.ahoraTu.generar(s);
      con(`${d} resuelve ${s}`, r.dibujo, i.resuelve.pieza || i.pieza); r.pasos.forEach((p, k) => con(`${d} resuelve ${s} paso ${k + 1}`, p.dibujo, i.resuelve.pieza || i.pieza));
      con(`${d} ahora tú ${s}`, a.dibujo, i.ahoraTu.pieza || i.pieza); if (a.solucion) con(`${d} solución ${s}`, a.solucion.dibujo, i.ahoraTu.pieza || i.pieza);
    }
  }
  for (const m of def.laboratorio) if (m.pieza === pieza) for (const v of Teoria.grilla(m.controles)) con(`mesa ${m.id} ${JSON.stringify(v)}`, m.dibujo(v), m.pieza);
  return out;
}
const solapan = (a, b, e = 0) => a.x0 < b.x1 + e && b.x0 < a.x1 + e && a.y0 < b.y1 + e && b.y0 < a.y1 + e;
// Encuadre (todo dentro con 4 de margen) y rótulos que no se pisan entre sí ni pisan las cajas o los objetos.
function revisar(g, nombre, mal, { dentroDe = () => false } = {}) {
  const { W, H, M } = g;
  for (const c of [...g.objetos.filter(o => !o.marco), ...g.textos]) if (!(c.x0 >= M - 1e-9 && c.y0 >= M - 1e-9 && c.x1 <= W - M + 1e-9 && c.y1 <= H - M + 1e-9))
    mal.push(`${nombre}: se sale «${c.txt || c.que}» (${c.x0.toFixed(1)}, ${c.y0.toFixed(1)}) – (${c.x1.toFixed(1)}, ${c.y1.toFixed(1)}) de ${W} × ${H}`);
  const t = g.textos;
  for (let i = 0; i < t.length; i++) for (let j = i + 1; j < t.length; j++) if (solapan(t[i], t[j], 1)) mal.push(`${nombre}: se pisan «${t[i].txt}» y «${t[j].txt}»`);
  for (const x of t) for (const o of g.objetos) if (!o.marco && !dentroDe(x, o) && solapan(x, o)) mal.push(`${nombre}: «${x.txt}» pisa ${o.que}`);
}

function sana(s, nombre) {
  assert.ok(!/NaN|undefined|Infinity|null/.test(s), nombre);
  assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), `${nombre}: sin colores fijos`);
  assert.ok(!/var\(--c-d\)|var\(--el-|var\(--c-i\)/.test(s), `${nombre}: sin verde, turquesa ni paleta de elementos`);
  assert.ok(!/<script|\son[a-z]+\s*=|\sid=/i.test(s), nombre);
  for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14, `${nombre}: texto de ${t}`);
}
const MUESTRAS = [
  { filas: [{ nombre: '1s', e: 2 }, { nombre: '2s', e: 2 }, { nombre: '2p', e: 4 }], cuenta: true },
  { filas: ['1s', '2s', '2p', '3s', '3p', '3d', '4s', '4p'].map(nombre => ({ nombre, e: 0, vacia: true })), precios: true, rotulo: '1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p⁶' },
  { filas: ['4s', '4p', '4d', '4f'].map(nombre => ({ nombre, e: 0, vacia: true, oculto: true })), cuenta: true, precios: true, piso: 4 },
];

test('registrada en el kit', () => assert.equal(Kit.piezas['quim-hotel'], P));
test('sana, pura, marcada de prueba y con su texto alternativo', () => {
  for (const [k, d] of MUESTRAS.entries()) {
    const s = P.dibujar(d);
    sana(s, `muestra ${k}`); assert.equal(s, P.dibujar(d));
    assert.match(s, /data-objeto="hotel" data-prueba="si"/);
    assert.match(P.alt(d), /analogía: piso = nivel/);
  }
});
test('fiel: una flecha violeta por electrón; el precio de cada pasillo es n + ℓ; los pisos de arriba abajo', () => {
  const d = MUESTRAS[0], s = P.dibujar(d);
  assert.equal((s.match(/<line[^>]*var\(--c-f\)/g) || []).length, 8);
  const p = P.dibujar(MUESTRAS[1]);
  for (const [nom, precio] of [['1s', 1], ['2p', 3], ['3d', 5], ['4s', 4], ['4p', 5]]) assert.ok(p.includes(`>S/ ${precio}<`), nom);
  const g = P.geometria(MUESTRAS[1]), y = nom => g.textos.find(t => t.que === 'nombre' && t.txt === nom).y0;
  assert.ok(y('4s') < y('3d') && y('3d') < y('3p') && y('3p') < y('3s') && y('3s') < y('1s'), 'piso 4 arriba, piso 1 abajo; en un piso, ℓ mayor arriba');
  assert.ok(P.dibujar(MUESTRAS[2]).includes('>? e⁻<'));
});
test('encuadre y rótulos, con números, en las muestras y en toda la unidad', () => {
  const mal = [];
  MUESTRAS.forEach((d, k) => revisar(P.geometria(d), `muestra ${k}`, mal));
  const figs = figurasUnidad('quim-hotel');
  assert.ok(figs.length > 100, `${figs.length} figuras`);
  for (const f of figs) { sana(P.dibujar(f.datos, f.estado), f.donde); revisar(P.geometria(f.datos, f.estado), f.donde, mal); }
  assert.deepEqual(mal.slice(0, 20), [], `${mal.length} problemas`);
});
