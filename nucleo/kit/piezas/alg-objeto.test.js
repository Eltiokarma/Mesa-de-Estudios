// Pruebas de la pieza «alg-objeto» (objetos de Álgebra: la hoja, los biohuertos, la caja y el terreno): se dibuja sin NaN ni colores fijos,
// es pura, de alto fijo, marcada como dibujo de prueba y con su texto alternativo; es fiel (una línea por capa de canto:
// bᵐ⁺ⁿ capas en bⁿ paquetes de bᵐ; abierta, bᵏ partes; en tres, a lo más 3 dobleces); nunca usa carmín ni verde. Con
// números (no a ojo; docs/molde-unidad.md §6): todo cabe en el lienzo con 4 de margen y ningún texto pisa a otro ni a
// un objeto. Se revisan las muestras de abajo y todas las figuras de la teoría que usan la pieza.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../kit.js');
const Teoria = require('../../teoria.js');
const P = require('./alg-objeto.js');

const MUESTRAS = [];
for (const base of [2, 3]) for (let m = 0; m <= 6; m++) for (let n = 0; n <= 3; n++) MUESTRAS.push({ objeto: 'hoja', base, m, n });
MUESTRAS.push({ objeto: 'hoja', m: 3, parte: '?' }, { objeto: 'hoja', m: 3, abierta: true, parte: '1/8' }, { objeto: 'hoja', m: 5, canto: false },
  { objeto: 'hoja', m: 4, n: 2, total: '?' }, { objeto: 'hoja', m: 2, tira: false, total: false }, { objeto: 'hoja', m: 5, abierta: true, parte: '1/32' }, {});

const solapan = (a, b, e = 0) => a.x0 < b.x1 + e && b.x0 < a.x1 + e && a.y0 < b.y1 + e && b.y0 < a.y1 + e;
function revisar(d, e, nombre, mal) {
  const s = P.dibujar(d, e), g = P.geometria(d, e), { W, H, M } = P.constantes;
  if (/NaN|undefined|Infinity/.test(s)) { mal.push(`${nombre}: NaN o undefined`); return; }
  for (const c of [...g.objetos, ...g.textos]) if (!(c.x0 >= M - 1e-9 && c.y0 >= M - 1e-9 && c.x1 <= W - M + 1e-9 && c.y1 <= H - M + 1e-9))
    mal.push(`${nombre}: se sale «${c.txt || c.que}» (${c.x0.toFixed(1)}, ${c.y0.toFixed(1)}) – (${c.x1.toFixed(1)}, ${c.y1.toFixed(1)})`);
  const t = g.textos;
  for (let i = 0; i < t.length; i++) for (let j = i + 1; j < t.length; j++) if (solapan(t[i], t[j], 1)) mal.push(`${nombre}: se pisan «${t[i].txt}» y «${t[j].txt}»`);
  // Un texto no pisa un objeto, salvo los que van adentro a propósito: la parte de la hoja y el área de una pieza del terreno.
  for (const x of t.filter(y => y.que !== 'parte' && y.que !== 'pieza')) for (const o of g.objetos) if (solapan(x, o)) mal.push(`${nombre}: «${x.txt}» pisa ${o.que}`);
  const ob = g.objetos.filter(o => o.que !== 'doblez');
  for (let i = 0; i < ob.length; i++) for (let j = i + 1; j < ob.length; j++) if (solapan(ob[i], ob[j])) mal.push(`${nombre}: se pisan ${ob[i].que} y ${ob[j].que}`);
}

test('registrada en el kit', () => assert.equal(Kit.piezas['alg-objeto'], P));

test('sin NaN ni colores fijos, sin carmín ni verde, pura, de alto fijo, marcada de prueba y con su texto alternativo', () => {
  const altos = new Set();
  for (const d of MUESTRAS) {
    const s = P.dibujar(d);
    assert.ok(!/NaN|undefined|Infinity/.test(s), JSON.stringify(d));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), 'sin colores fijos');
    assert.ok(!/var\(--c-[hd]\)/.test(s), 'sin carmín ni verde');
    assert.ok(!/\sid="|filter|<image/.test(s), 'sin ids, filtros ni imágenes');
    assert.equal(s, P.dibujar(d), 'pura');
    assert.match(s, /data-objeto="hoja" data-prueba="si"/);
    altos.add(s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)[0]);
    assert.ok(P.alt(d).length > 30 && !/undefined|NaN/.test(P.alt(d)), P.alt(d));
  }
  assert.deepEqual([...altos], ['viewBox="0 0 320 250"']);
});

test('fiel: una capa por línea, en bⁿ paquetes de bᵐ; abierta, bᵏ partes; en tres, a lo más 3 dobleces y por la mitad 5', () => {
  for (const d of MUESTRAS.filter(x => x.m !== undefined && x.canto !== false)) {
    const g = P.geometria(d), b = d.base === 3 ? 3 : 2, tope = b === 3 ? 3 : 5;
    const m = Math.min(d.m, tope), n = Math.min(d.n || 0, tope - m);
    assert.equal(g.L, b ** (m + n), JSON.stringify(d));
    assert.equal(g.P, b ** n);
    assert.equal(g.ys.length, g.L);
    const s = P.dibujar(d), z = s.match(/class="alg-capas" d="([^"]+)"/)[1];
    assert.equal((z.match(/H/g) || []).length, g.L, 'una línea por capa');
    if (m > 0) assert.equal((s.match(/class="alg-paquete"/g) || []).length, g.P);
    assert.equal(g.D.topado, d.m + (d.n || 0) > tope);
    if (d.tira !== false) assert.equal(g.marcas.length, m + n, 'un cuadrito por doblez');
    // Las líneas no se pegan: al menos 1,5 de separación.
    for (let j = 1; j < g.ys.length; j++) assert.ok(g.ys[j] - g.ys[j - 1] >= 1.5, `${JSON.stringify(d)}: capas pegadas`);
  }
  const ab = P.dibujar({ objeto: 'hoja', m: 3, abierta: true, parte: '1/8' });
  const pl = ab.match(/class="alg-pliegues" d="([^"]+)"/)[1];
  assert.equal((pl.match(/M/g) || []).length, 1 + 3, '2 columnas y 4 filas: 1 pliegue vertical y 3 horizontales');
  // Sin el canto (las capas se piden), no hay líneas que contar ni total.
  const sc = P.dibujar({ objeto: 'hoja', m: 5, canto: false });
  assert.ok(!/alg-capas|capas</.test(sc));
});

// Las figuras de la teoría que usan la pieza.
function figurasTeoria() {
  const defs = ['exponentes-y-productos-notables', 'productos-notables'].map(u => require(`../../../contenido/teoria/algebra/${u}.js`));
  for (const def of defs) for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
  const out = [];
  for (const i of defs.flatMap(d => d.ideas)) {
    if (i.pieza === 'alg-objeto') for (const v of Teoria.grilla(i.juega.controles)) out.push([`${i.id} juego ${JSON.stringify(v)}`, i.juega.dibujo(v)]);
    for (const [k, t] of ((i.lee && i.lee.tarjetas) || []).entries()) if (t.dibujo && t.pieza === 'alg-objeto') out.push([`${i.id} lee ${k + 1}`, t.dibujo]);
    if (i.pieza === 'alg-objeto') out.push([`${i.id} predice`, i.predice.dibujo], [`${i.id} revelar`, i.predice.revelar]);
    if (i.mira && i.mira.pieza === 'alg-objeto') i.mira.pasos.forEach((p, k) => out.push([`${i.id} mira ${k + 1}`, { datos: i.mira.datos, estado: p.estado }]));
    for (const [k, e] of (i.ejemplos || []).entries()) if (e.figura && e.figura.pieza === 'alg-objeto') out.push([`${i.id} ejemplo ${k + 1}`, e.figura]);
    // «Ahora tú» y «Así se resuelve», en 40 semillas.
    for (let s = 0; s < 40; s++) for (const g of [i.ahoraTu, i.resuelve]) {
      if (!g || g.pieza !== 'alg-objeto') continue;
      const c = g.generar(s);
      for (const f of [c.dibujo, ...((c.pasos || []).map(x => x.dibujo))]) if (f && (f.pieza || 'alg-objeto') === 'alg-objeto') out.push([`${i.id} semilla ${s}`, f]);
    }
  }
  return out;
}

test('con números: todo cabe con 4 de margen y nada se pisa (muestras y figuras de la teoría)', () => {
  const mal = [];
  MUESTRAS.forEach((d, k) => revisar(d, {}, `muestra ${k + 1}`, mal));
  const figs = figurasTeoria();
  assert.ok(figs.length > 20, `${figs.length} figuras`);
  for (const [nombre, f] of figs) revisar(f.datos, f.estado || {}, nombre, mal);
  assert.deepEqual(mal, []);
});
