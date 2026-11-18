// Pruebas de la pieza «quim-objeto» (el hueso de la llama con dos átomos de su carbono) y de la paleta 'zne' de
// quim-atomo que compone: sin NaN ni colores fijos, sin verde ni paleta de elementos, pura, de alto fijo, marcada como
// dibujo de prueba y con su texto alternativo. Con números (no a ojo; docs/molde-unidad.md §6): todo cabe en el lienzo
// con 4 de margen, ningún texto pisa a otro ni a un objeto, las líneas de la lupa no cruzan ningún texto, el número del
// núcleo cabe en el núcleo y lo que se pide («?») va en tinta. Se revisan las muestras de abajo y todas las figuras de
// la teoría que usan las dos piezas (contenido/teoria/quimica/estructura-atomica.js).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../kit.js');
const Teoria = require('../../teoria.js');
const P = require('./quim-objeto.js');
const QA = require('./quim-atomo.js');

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
const solapan2 = (a, b, e = 0) => a.x0 < b.x1 + e && b.x0 < a.x1 + e && a.y0 < b.y1 + e && b.y0 < a.y1 + e;
// Encuadre (todo dentro con 4 de margen) y rótulos que no se pisan entre sí ni pisan las cajas o los objetos.
function revisarCajas(g, nombre, mal, { dentroDe = () => false } = {}) {
  const { W, H, M } = g;
  for (const c of [...g.objetos.filter(o => !o.marco), ...g.textos]) if (!(c.x0 >= M - 1e-9 && c.y0 >= M - 1e-9 && c.x1 <= W - M + 1e-9 && c.y1 <= H - M + 1e-9))
    mal.push(`${nombre}: se sale «${c.txt || c.que}» (${c.x0.toFixed(1)}, ${c.y0.toFixed(1)}) – (${c.x1.toFixed(1)}, ${c.y1.toFixed(1)}) de ${W} × ${H}`);
  const t = g.textos;
  for (let i = 0; i < t.length; i++) for (let j = i + 1; j < t.length; j++) if (solapan2(t[i], t[j], 1)) mal.push(`${nombre}: se pisan «${t[i].txt}» y «${t[j].txt}»`);
  for (const x of t) for (const o of g.objetos) if (!o.marco && !dentroDe(x, o) && solapan2(x, o)) mal.push(`${nombre}: «${x.txt}» pisa ${o.que}`);
}

const C12 = { Z: 6, N: 6, titulo: 'carbono-12', rotulo: 'A = 12' }, C14 = { Z: 6, N: 8, titulo: 'carbono-14', rotulo: 'A = 14' };
const MUESTRAS = [
  { objeto: 'hueso', atomos: [C12, C14] },
  { objeto: 'hueso', atomos: [C12, { Z: 7, N: 7, titulo: 'nitrógeno-14', rotulo: 'A = 14' }], flecha: true },
  { objeto: 'hueso', atomos: [Object.assign({ oculto: ['Z', 'N', 'e'] }, C12), Object.assign({ oculto: ['Z', 'N', 'e'] }, C14)] },
  { objeto: 'hueso', atomos: [C12, { Z: 12, N: 14, titulo: 'Tu átomo', rotulo: 'A = 26' }] },
  { objeto: 'hueso', titulo: '', atomos: [C12, { Z: 1, N: 0, titulo: 'Tu átomo', rotulo: 'A = 1' }] },
];

// Figuras de la unidad que usan estas piezas.
function deLaUnidad() {
  const def = require('../../../contenido/teoria/quimica/estructura-atomica.js');
  for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
  const out = [], con = (donde, f, pieza) => { if (f && f.datos && ['quim-objeto', 'quim-atomo'].includes(f.pieza || pieza)) out.push({ donde, pieza: f.pieza || pieza, datos: f.datos, estado: f.estado || {} }); };
  const i = def.ideas.find(x => x.id === 'nucleo-identidad');
  for (const v of Teoria.grilla(i.juega.controles)) con(`juego ${JSON.stringify(v)}`, i.juega.dibujo(v), i.juega.pieza);
  i.lee.tarjetas.forEach((t, k) => con(`lee ${k + 1}`, t.dibujo, t.pieza));
  con('predice', i.predice.dibujo, i.predice.pieza); con('revelar', i.predice.revelar, i.predice.pieza);
  for (const c of [0, 1, 2, 3]) con(`mira corte ${c}`, { datos: i.mira.datos, estado: { corte: c } }, i.mira.pieza);
  i.ejemplos.forEach((e, k) => con(`ejemplo ${k + 1}`, e.figura));
  for (let s = 0; s < 40; s++) { const r = i.resuelve.generar(s); con(`resuelve ${s}`, r.dibujo, 'quim-atomo'); r.pasos.forEach(p => con(`resuelve ${s}`, p.dibujo, 'quim-atomo')); }
  const mesa = def.laboratorio.find(m => m.id === 'arma-ion');
  for (const v of Teoria.grilla(mesa.controles)) con(`mesa ${JSON.stringify(v)}`, mesa.dibujo(v), mesa.pieza);
  return out;
}

const solapan = (a, b, e = 0) => a.x0 < b.x1 + e && b.x0 < a.x1 + e && a.y0 < b.y1 + e && b.y0 < a.y1 + e;
const cruza = (sg, b) => { for (let k = 0; k <= 50; k++) { const t = k / 50, x = sg.x0 + (sg.x1 - sg.x0) * t, y = sg.y0 + (sg.y1 - sg.y0) * t; if (x > b.x0 - 1 && x < b.x1 + 1 && y > b.y0 - 1 && y < b.y1 + 1) return true; } return false; };
function revisar(g, nombre, mal) {
  const { W, H, M } = g;
  for (const c of [...g.objetos, ...g.textos]) if (!(c.x0 >= M - 1e-9 && c.y0 >= M - 1e-9 && c.x1 <= W - M + 1e-9 && c.y1 <= H - M + 1e-9))
    mal.push(`${nombre}: se sale «${c.txt || c.que}» (${c.x0.toFixed(1)}, ${c.y0.toFixed(1)}) – (${c.x1.toFixed(1)}, ${c.y1.toFixed(1)})`);
  const t = g.textos;
  for (let i = 0; i < t.length; i++) for (let j = i + 1; j < t.length; j++) if (solapan(t[i], t[j], 1)) mal.push(`${nombre}: se pisan «${t[i].txt}» y «${t[j].txt}»`);
  // Los números del núcleo y el «? e⁻» van dentro de la zona a propósito; los títulos y rótulos no tocan ningún objeto.
  for (const x of t.filter(y => y.que === 'titulo' || y.que === 'rotulo')) for (const o of g.objetos) if (solapan(x, o)) mal.push(`${nombre}: «${x.txt}» pisa ${o.que}`);
  const zonas = g.objetos.filter(o => o.que === 'zona');
  for (let i = 0; i < zonas.length; i++) for (let j = i + 1; j < zonas.length; j++) if (Math.hypot(zonas[i].cx - zonas[j].cx, zonas[i].cy - zonas[j].cy) < zonas[i].r + zonas[j].r + 4) mal.push(`${nombre}: se pisan dos zonas`);
  for (const o of g.objetos.filter(x => x.que === 'sale' || x.que === 'flecha')) for (const z of zonas) {
    const dx = Math.max(o.x0 - z.cx, 0, z.cx - o.x1), dy = Math.max(o.y0 - z.cy, 0, z.cy - o.y1);
    if (o.que === 'flecha' && Math.hypot(dx, dy) < z.r) mal.push(`${nombre}: la flecha pisa una zona`);
    if (o.que === 'sale' && Math.hypot(dx, dy) < z.r - 1 && Math.abs((o.x0 + o.x1) / 2 - z.cx) > z.r) mal.push(`${nombre}: un electrón que sale pisa la otra zona`);
  }
  for (const sg of g.segmentos || []) for (const x of t) if (cruza(sg, x)) mal.push(`${nombre}: la lupa cruza «${x.txt}»`);
  // El número del núcleo cabe en el núcleo (radio 26).
  for (const x of t.filter(y => y.que === 'dentro')) {
    const z = zonas.find(o => Math.abs(o.cx - (x.x0 + x.x1) / 2) < 1), dy = Math.max(Math.abs(x.y0 - z.cy), Math.abs(x.y1 - z.cy));
    if (x.x1 - x.x0 > 2 * Math.sqrt(Math.max(0, 26 * 26 - dy * dy)) + 1) mal.push(`${nombre}: «${x.txt}» no cabe en el núcleo`);
  }
}
function sano(s, nombre) {
  assert.ok(!/NaN|undefined|Infinity|null/.test(s), nombre);
  assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), `${nombre}: sin colores fijos`);
  assert.ok(!/var\(--c-d\)|var\(--el-/.test(s), `${nombre}: sin verde ni paleta de elementos`);
  assert.ok(!/<script|\son[a-z]+\s*=|\sid=/i.test(s), nombre);
  for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14, `${nombre}: texto de ${t}`);
  // Un «?» va siempre en tinta.
  for (const m of s.matchAll(/<text[^>]*fill="([^"]+)"[^>]*>([^<]*\?[^<]*)<\/text>/g)) assert.equal(m[1], 'currentColor', `${nombre}: «${m[2]}» en ${m[1]}`);
}

test('registrada en el kit', () => assert.equal(Kit.piezas['quim-objeto'], P));

test('quim-objeto: sana, pura, de alto fijo, marcada de prueba y con su texto alternativo', () => {
  const altos = new Set();
  for (const [k, d] of MUESTRAS.entries()) {
    const s = P.dibujar(d);
    sano(s, `muestra ${k}`);
    assert.equal(s, P.dibujar(d), 'pura');
    assert.match(s, /data-objeto="hueso" data-prueba="si"/);
    altos.add(s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)[0]);
    assert.ok(P.alt(d).length > 60 && /hueso de llama/.test(P.alt(d)), P.alt(d));
  }
  assert.deepEqual([...altos], ['viewBox="0 0 320 304"']);
});

test('quim-objeto y quim-atomo (zne): encuadre y rótulos, con números, en las muestras y en toda la unidad', () => {
  const mal = [];
  MUESTRAS.forEach((d, k) => revisar(P.geometria(d), `muestra ${k}`, mal));
  const figs = deLaUnidad();
  assert.ok(figs.length > 200, `${figs.length} figuras`);
  for (const f of figs) {
    const s = Kit.piezas[f.pieza].dibujar(f.datos, f.estado);
    sano(s, f.donde);
    if (f.pieza === 'quim-objeto') revisar(P.geometria(f.datos, f.estado), f.donde, mal);
    else revisar(Object.assign({ segmentos: [] }, QA.cajasZNE(f.datos, f.estado)), f.donde, mal);
  }
  assert.deepEqual(mal.slice(0, 20), [], `${mal.length} problemas`);
});

test('fiel: los puntos violetas son los electrones de los datos; los números del núcleo, los de los datos', () => {
  const d = { objeto: 'hueso', atomos: [C12, { Z: 11, N: 12, e: 10, titulo: 'Na', carga: 1, sale: { n: 1 } }] }, s = P.dibujar(d);
  assert.equal((s.match(/class="kit-electron/g) || []).length, 16);
  assert.match(s, />6p⁺</); assert.match(s, />11p⁺</); assert.match(s, />12n⁰</);
  assert.match(s, /<tspan fill="var\(--c-h\)">⁺<\/tspan>/, 'la carga en carmín');
  assert.match(s, /class="kit-sale"/);
  // Mira: con corte 1 y 2, carbono-12 y carbono-14; con 3, carbono-14 → nitrógeno-14 con la flecha.
  const m = { objeto: 'hueso', lugares: 2, flecha: { desde: 3 }, atomos: [Object.assign({ desde: 1, hasta: 2, lugar: 0 }, C12), Object.assign({ desde: 1, hasta: 2, lugar: 1 }, C14),
    Object.assign({ desde: 3, lugar: 0 }, C14), { Z: 7, N: 7, titulo: 'nitrógeno-14', lugar: 1, desde: 3 }] };
  assert.match(P.dibujar(m, { corte: 1 }), /carbono-12/); assert.ok(!/kit-flecha/.test(P.dibujar(m, { corte: 2 })));
  assert.match(P.dibujar(m, { corte: 3 }), /nitrógeno-14/); assert.match(P.dibujar(m, { corte: 3 }), /kit-flecha/);
  assert.ok(!/>carbono-12</.test(P.dibujar(m, { corte: 3 })));
});

// Salero, frasco y combi (ideas 5 y 6): el objeto arriba y las cajas debajo.
const OTROS = [
  { objeto: 'salero', cajas: { filas: [{ nombre: '3s', e: 2, cajas: 1 }, { nombre: '3p', e: 6, cajas: 3, llega: 1 }], rotulo: 'Cl⁻: [Ne] 3s² 3p⁶' } },
  { objeto: 'frasco', cajas: { ml: true, desapareados: true, filas: [{ nombre: '3d', e: 6, cajas: 5 }], rotulo: 'Fe²⁺: 4 electrones solos' } },
  { objeto: 'combi', cajas: { ml: true, desapareados: true, filas: [{ nombre: '2p', cajas: 3, flechas: [[1, 1], [1, 0], [1, 0]] }] } },
];
test('salero, frasco y combi: sanos, puros, de prueba; la combi lleva un pasajero por flecha, alineado con su caja', () => {
  for (const d of OTROS) {
    const s = P.dibujar(d);
    sano(s, d.objeto); assert.equal(s, P.dibujar(d));
    assert.match(s, new RegExp(`data-objeto="${d.objeto}" data-prueba="si"`));
    assert.ok(P.alt(d).length > 60, P.alt(d));
  }
  const s = P.dibujar(OTROS[2]), pas = [...s.matchAll(/class="kit-pasajero" cx="([\d.]+)" cy="([\d.]+)"/g)].map(m => [+m[1], +m[2]]);
  assert.equal(pas.length, 4);
  const C = Kit.piezas['quim-cajas'], g = C.geometria(Object.assign({ paleta: 'zne' }, OTROS[2].cajas));
  for (const [x] of pas) assert.ok([0, 1, 2].some(k => Math.abs(g.caja(0, k).cx - x) < 1e-6), `pasajero en x = ${x} sin su caja`);
  assert.equal(pas.filter(([x]) => Math.abs(x - g.caja(0, 0).cx) < 1e-6).length, 2, 'la primera fila va con pareja');
});
test('salero, frasco y combi: encuadre y rótulos, con números, en las muestras y en toda la unidad', () => {
  const mal = [];
  OTROS.forEach((d, k) => revisarCajas(P.geometria(d), `muestra ${k}`, mal));
  const figs = figurasUnidad('quim-objeto').filter(f => f.datos.objeto !== 'hueso');
  assert.ok(figs.length > 200, `${figs.length} figuras`);
  for (const f of figs) { sano(P.dibujar(f.datos, f.estado), f.donde); revisarCajas(P.geometria(f.datos, f.estado), f.donde, mal); }
  assert.deepEqual(mal.slice(0, 20), [], `${mal.length} problemas`);
});
