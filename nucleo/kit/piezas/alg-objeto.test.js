// Pruebas de la pieza «alg-objeto» (objetos de Álgebra: la hoja, los biohuertos, la caja, el terreno, el triplay, el taco,
// la mesa y la cometa): se dibuja sin NaN ni colores fijos,
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
  // Un texto no pisa un objeto, salvo los que van adentro a propósito: la parte de la hoja, el área de una pieza del
  // terreno y el área de un biohuerto (adentro, sobre su recuadro claro; ronda 2 del lector).
  for (const x of t.filter(y => y.que !== 'parte' && y.que !== 'pieza' && y.que !== 'dentro')) for (const o of g.objetos) if (solapan(x, o)) mal.push(`${nombre}: «${x.txt}» pisa ${o.que}`);
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
    if ((i.predice.pieza || i.pieza) === 'alg-objeto') out.push([`${i.id} predice`, i.predice.dibujo], [`${i.id} revelar`, i.predice.revelar]);
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

// Los objetos de Productos notables (18 nov): el triplay, el taco, la mesa y la cometa, en muestras que recorren sus
// rangos (los extremos de sus juegos y más), además de las figuras de la teoría de arriba.
const NUEVOS = [];
for (let a = 2; a <= 30; a += 2) for (const b of [1, 2, 4]) for (const f of [0, 1]) if (b < a) NUEVOS.push({ objeto: 'triplay', a, b, f, area: 'Tablero: 999 dm²', rot: { esquina: '?' } });
NUEVOS.push({ objeto: 'triplay', a: 30, b: 1, unidad: '', soloTablero: true, rot: { tablero: '?' }, area: '31 · 29 = ?' }, { objeto: 'triplay', a: 12, b: 4, f: 1, escala: 11, ladoB: '?', largo: '?', corto: '?' });
for (let a = 1; a <= 5; a++) for (let b = 1; b <= 4; b++) for (const abrir of [0, 1]) NUEVOS.push({ objeto: 'taco', a, b, abrir, total: true, arista: abrir ? false : true, rot: { a3: true, a2b: '?', ab2: true } });
NUEVOS.push({ objeto: 'taco', a: 5, b: 2, cortes: false, arista: 'arista: a + b = 7', total: 'a³ + b³ = ?' }, { objeto: 'taco', a: 4, b: 2, abrir: 1, solo: 'medio' }, { objeto: 'taco', a: 4, b: 2, abrir: 1, solo: 'esquinas' });
for (let x = 1; x <= 12; x++) for (let y = 1; y <= Math.min(x, 6); y++) NUEVOS.push({ objeto: 'mesa', x, y, total: true, lado: true, rot: x === y ? { xy: '?' } : undefined });
for (const d of [1, 2, 3, 4, 8]) for (const otro of [undefined, d, 1]) NUEVOS.push({ objeto: 'cometa', d, lado: '?', otro }, { objeto: 'cometa', d, lado: '3√2/2 m', diag: false });

test('los objetos de Productos notables: sin NaN ni colores fijos, sin carmín ni verde, puros, de prueba, con su alt', () => {
  for (const d of NUEVOS) {
    const s = P.dibujar(d), q = JSON.stringify(d);
    assert.ok(!/NaN|undefined|Infinity/.test(s), q);
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), `${q}: colores fijos`);
    assert.ok(!/var\(--c-[hd]\)/.test(s), `${q}: carmín o verde`);
    assert.ok(!/\sid="|filter|<image/.test(s), q);
    assert.equal(s, P.dibujar(d), 'pura');
    assert.match(s, new RegExp(`data-objeto="${d.objeto}" data-prueba="si"`));
    assert.match(s, /viewBox="0 0 320 250"/);
    assert.ok(P.alt(d).length > 30 && !/undefined|NaN/.test(P.alt(d)), P.alt(d));
  }
});

test('los objetos de Productos notables, con números: todo cabe con 4 de margen y nada se pisa', () => {
  const mal = [];
  NUEVOS.forEach((d, k) => revisar(d, {}, `${d.objeto} ${k + 1} ${JSON.stringify(d).slice(0, 60)}`, mal));
  assert.deepEqual(mal, []);
});

test('fieles: el tablero mide a + b por a − b; el taco son 8 piezas que suman (a + b)³; la mesa, x + y + 2√(xy)', () => {
  for (const d of NUEVOS.filter(x => x.objeto === 'triplay' && x.f === 1)) {
    const g = P.geometria(d), t = g.objetos.find(o => o.que === 'tablero');
    assert.ok(Math.abs((t.x1 - t.x0) / g.k - (d.a + d.b)) < 1e-9 && Math.abs((t.y1 - t.y0) / g.k - (d.a - d.b)) < 1e-9, JSON.stringify(d));
  }
  for (const d of NUEVOS.filter(x => x.objeto === 'taco' && x.cortes !== false)) {
    const g = P.geometria(d), cuenta = {};
    for (const p of g.piezas) cuenta[p.tipo] = (cuenta[p.tipo] || 0) + 1;
    assert.deepEqual(cuenta, { a3: 1, a2b: 3, ab2: 3, b3: 1 });
    assert.ok(Math.abs(g.piezas.reduce((s, p) => s + p.w * p.h * p.p, 0) - (d.a + d.b) ** 3) < 1e-9);
  }
  for (const d of NUEVOS.filter(x => x.objeto === 'mesa')) {
    const g = P.geometria(d), area = g.piezas.reduce((s, p) => s + p.w * p.h, 0) / g.k ** 2;
    assert.ok(Math.abs(area - (d.x + d.y + 2 * Math.sqrt(d.x * d.y))) < 1e-9, JSON.stringify(d));
  }
  // La cometa: la varilla mide d, el lado d/√2.
  const g = P.geometria({ objeto: 'cometa', d: 2 });
  assert.ok(Math.abs((2 * g.h) / g.k - 2) < 1e-9 && Math.abs(Math.hypot(g.h, g.h) / g.k - 2 / Math.SQRT2) < 1e-9);
});

// Correcciones de Exponentes y radicales (18 nov; rutinas/auditoria/algebra.exponentes-y-productos-notables.md).
test('M7: un biohuerto solo va al centro y ocupa medio lienzo; con dos o tres, la misma escala', () => {
  for (const a of [1, 25, 36, 49, 50, 100]) {
    const g = P.geometria({ objeto: 'huertos', a, b: 0, junto: false, ladoA: '?' }), q = g.cuad[0];
    assert.ok(q.x1 - q.x0 >= 0.5 * P.constantes.W - 1e-9, `${a} m²: ${q.x1 - q.x0} px de ancho`);
    assert.ok(Math.abs((q.x0 + q.x1) / 2 - P.constantes.W / 2) < 1e-9, `${a} m²: no está al centro`);
  }
  const g = P.geometria({ objeto: 'huertos', a: 36, b: 64 }), [qa, qb, qj] = g.cuad;
  assert.ok(Math.abs((qa.x1 - qa.x0) / 6 - (qb.x1 - qb.x0) / 8) < 1e-9 && Math.abs((qj.x1 - qj.x0) / 10 - (qa.x1 - qa.x0) / 6) < 1e-9);
});

test('M8: con pocas capas, las líneas del canto van a 8 px o más (que 4 capas no se vean como 2 tiras)', () => {
  for (const base of [2, 3]) for (let m = 0; m <= 3; m++) for (let n = 0; n <= 3; n++) {
    const g = P.geometria({ objeto: 'hoja', base, m, n });
    if (g.L > 8 || g.L < 2) continue;
    for (let j = 1; j < g.ys.length; j++) assert.ok(g.ys[j] - g.ys[j - 1] >= 8, `base ${base}, m ${m}, n ${n}: ${g.ys[j] - g.ys[j - 1]} px`);
  }
});

// Ronda 2 del lector en frío (18 nov; rutinas/frio/algebra.exponentes-y-productos-notables.md, «Ronda 2»).
test('ronda 2: el canto dice «vista de lado»; el área de un biohuerto va adentro y no pisa a otro biohuerto', () => {
  for (const d of MUESTRAS.filter(x => x.m !== undefined)) {
    const g = P.geometria(d);
    assert.equal(!!g.vista, d.canto !== false, JSON.stringify(d));
    if (g.vista) assert.match(P.dibujar(d), />vista de lado</);
  }
  assert.equal(P.geometria({ objeto: 'hoja', m: 3, vista: false }).vista, null);
  for (const [a, b] of [[36, 0], [36, 49], [49, 50], [100, 100], [1, 1], [81, 144]]) {
    const g = P.geometria({ objeto: 'huertos', a, b, junto: b > 0 });
    for (const t of g.textos.filter(x => x.que === 'dentro')) {
      const q = g.cuad.find(c => c.cx === t.x);
      assert.ok(q && t.x0 >= q.x0 && t.x1 <= q.x1 && t.y0 >= q.y0 && t.y1 <= q.y1, `${a}, ${b}: «${t.txt}» no queda adentro de su biohuerto`);
    }
    // Ningún área queda pegada debajo de un biohuerto que la tiene adentro (no se lee como la medida del borde).
    for (const q of g.cuad) assert.ok(g.textos.filter(x => x.x === q.cx && (x.que === 'dentro' || x.que === 'area')).length === 1, `${a}, ${b}: ${q.que}`);
  }
  assert.equal(P.geometria({ objeto: 'huertos', a: 36, b: 0, junto: false }).textos.find(x => /36 m²/.test(x.txt)).que, 'dentro');
});

test('ronda 2: sin escala dada, el biohuerto más grande llena su casilla y el junto de 85 m² se ve más grande que el de 49', () => {
  const g = P.geometria({ objeto: 'huertos', a: 36, b: 49 }), [, qb, qj] = g.cuad;
  assert.ok(qj.x1 - qj.x0 >= 88, `el junto mide ${qj.x1 - qj.x0} px`);
  assert.ok((qj.x1 - qj.x0) - (qb.x1 - qb.x0) >= 20, 'la diferencia de lado se ve');
  for (let a = 1; a <= 100; a += 9) for (let b = 1; b <= 100; b += 9) {
    const h = P.geometria({ objeto: 'huertos', a, b });
    for (const q of h.cuad) { const [c0, c1] = P.constantes.HU.casillas[{ a: 0, b: 1, junto: 2 }[q.que]]; assert.ok(q.x0 >= c0 - 1e-9 && q.x1 <= c1 + 1e-9, `${a}, ${b}: ${q.que} se sale de su casilla`); }
  }
});

// Correcciones de Productos notables (18 nov; rutinas/auditoria/algebra.productos-notables.md).
test('M5: todo texto del dibujo está en geometria().textos (la prueba de encuadre lo mide); la esquina del terreno cabe', () => {
  const cuenta = (d, e = {}) => [(P.dibujar(d, e).match(/<text\b/g) || []).length, P.geometria(d, e).textos.length];
  const casos = [...MUESTRAS.map(d => [JSON.stringify(d), d, {}]), ...NUEVOS.map(d => [JSON.stringify(d), d, {}]), ...figurasTeoria().map(([n, f]) => [n, f.datos, f.estado || {}])];
  for (const a of [5, 6, 7]) for (const b of [1, 2, 3]) for (const esquina of ['doble', 'devuelta']) {
    const d = { objeto: 'terreno', modo: 'cede', a, b, escala: 22, costado: true, fondo: true, esquina, piezas: true, resto: '?', total: false };
    casos.push([`terreno cede ${a} ${b} ${esquina}`, d, {}]);
  }
  const mal = [];
  for (const [n, d, e] of casos) { const [k, g] = cuenta(d, e); if (k !== g) mal.push(`${n}: ${k} textos dibujados, ${g} medidos`); }
  assert.deepEqual(mal, []);
  const mal2 = [];
  casos.filter(c => c[1].objeto === 'terreno').forEach(([n, d, e]) => revisar(d, e, n, mal2));
  assert.deepEqual(mal2, []);
  // El rótulo de la esquina va en renglones cortos que caben enteros (antes: «esquina: se devuelv…»).
  const g = P.geometria({ objeto: 'terreno', modo: 'cede', a: 7, b: 2, escala: 22, costado: true, fondo: true, esquina: 'devuelta' });
  assert.deepEqual(g.textos.filter(t => t.que === 'esquina').map(t => t.txt), ['esquina:', 'se', 'devuelve']);
});

test('M9: el taco va en cm y la cometa dice su unidad; ninguna dice «la varilla larga» (las dos diagonales son iguales)', () => {
  assert.match(P.dibujar({ objeto: 'taco', a: 3, b: 2, abrir: 1, total: true }), />3 cm<.*>2 cm<|125 cm³/s);
  assert.ok(!/dm/.test(P.dibujar({ objeto: 'taco', a: 3, b: 2, abrir: 1, total: true, rot: { a3: true } })));
  assert.match(P.dibujar({ objeto: 'cometa', d: 9, unidad: 'dm' }), />9 dm</);
  assert.ok(!/larga/.test(P.alt({ objeto: 'cometa', d: 1 })));
});
