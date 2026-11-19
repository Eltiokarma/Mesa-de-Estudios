// Pruebas de la pieza «alg-losetas» (el pedido de losetas del maestro Rubén: las tres piezas, los pedidos en columnas
// por forma, las piezas de x por y que se giran y el terreno): se dibuja sin NaN ni colores fijos, es pura, de alto
// fijo, marcada como dibujo de prueba y con su texto alternativo; es fiel (una pieza dibujada por cada pieza pedida; en
// «Juntos», la suma por forma, con el color del pedido del que vino cada una; las formas en la misma columna en todas
// las filas; la tira mide lo que el lado de la loseta y el cuadradito, un tercio); nunca usa carmín ni verde. Con
// números (no a ojo; docs/molde-unidad.md §6): todo cabe en el lienzo con 4 de margen, ningún texto pisa a otro ni a un
// objeto, y todo texto dibujado está en geometria() (auditoría de Productos notables, M5). Se revisan las muestras de
// abajo y todas las figuras de la teoría que usan la pieza.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../kit.js');
const Teoria = require('../../teoria.js');
const P = require('./alg-losetas.js');

const fila = (nombre, cuenta, color, rotulo) => ({ nombre, cuenta, color, rotulo });
const MUESTRAS = [{}, { objeto: 'piezas' }, { objeto: 'piezas', areas: true }];
// El juego entero: el pedido 1 fijo y las 75 combinaciones del pedido 2.
for (let l = 0; l <= 2; l++) for (let t = 0; t <= 4; t++) for (let c = 0; c <= 4; c++)
  MUESTRAS.push({ objeto: 'pedido', filas: [fila('Pedido 1', [2, 3, 1], 'o'), fila('Pedido 2', [l, t, c], 'i')], juntos: true, terminos: true });
MUESTRAS.push(
  { objeto: 'pedido', filas: [fila('Pedido', [2, 3, 4])] },
  { objeto: 'pedido', filas: [fila('Lunes', [0, 3, 0], 'o', false), fila('Martes', [0, 4, 0], 'i', false)] },
  { objeto: 'pedido', filas: [fila('Pedido 1', [2, 3, 4], 'o'), fila('Pedido 2', [1, 2, 1], 'i')], juntos: true, terminos: '?' },
  { objeto: 'pedido', filas: [fila('Necesita', [5, 3, 4]), fila('Ya pidió', [2, 3, 1], 'o')] },
  { objeto: 'pedido', filas: [fila('Uno', [2, 4, 6], 'o'), fila('Dos', [2, 4, 5], 'i'), fila('Tres', [1, 1, 1])], juntos: true, terminos: true },
  { objeto: 'pedido', filas: [fila('Solo cuadraditos', [0, 0, 7], 'i')], juntos: true, terminos: true },
  { objeto: 'pedido', filas: [fila('Tiras', [0, 3, 0], 'o', '3x'), fila('Losetas', [2, 0, 0], 'i', '2x²')], juntos: true, terminos: true },
  { objeto: 'pedido', columnas: false, filas: [fila('x + x', [0, 2, 0], null, false), fila('x · x', [1, 0, 0], null, false)] },
  { objeto: 'pedido', filas: [] },
  { objeto: 'giro' }, { objeto: 'giro', a: 2, b: 3, juntas: '?' }, { objeto: 'giro', a: 2, b: 3, juntas: true }, { objeto: 'giro', a: 1, b: 0 },
  { objeto: 'giro', a: 1, b: 1, igual: true }, { objeto: 'giro', a: 3, b: 3 }, { objeto: 'giro', a: 3, b: 3, juntas: true }, { objeto: 'giro', a: 2, b: 2, rotulos: false, medidas: false },
  { objeto: 'lote', largo: '(3x + 2)', ancho: '(x + 5)' }, { objeto: 'lote', largo: '(2x + 7)', ancho: '(x + 1)', unidad: 'dm', dentro: '?' }, { objeto: 'lote' },
);
// Fase 3 (19 nov): los objetos de las ideas 2 a 6. El juego de cada idea entero, más los casos extremos.
for (let a = 0; a <= 6; a++) MUESTRAS.push({ objeto: 'tamano', filas: [fila('Pedido', [2, 3, 4])], lado: a, areas: true, ladoMax: 6 }, { objeto: 'tamano', filas: [fila('Pedido', [3, 4, 5])], lado: a, total: true });
MUESTRAS.push({ objeto: 'tamano', filas: [fila('Pedido', [2, 3, 4])], lado: 'x', total: '?' }, { objeto: 'tamano', filas: [fila('P', [1, 0, 1], 'o'), fila('Q', [0, 2, 0], 'i')], lado: 3, areas: true },
  { objeto: 'tamano', filas: [fila('P', [1, 0, 1], 'o'), fila('Q', [0, 2, 0], 'i')], lado: 1, ladoMax: 3 }, { objeto: 'tamano', filas: [fila('Pedido', [1, 4, 5])], lado: 1, areas: true, total: true },
  { objeto: 'deposito' }, { objeto: 'deposito', medidas: false });
for (let a = 0; a <= 5; a++) for (let b = 0; b <= 5; b++) MUESTRAS.push({ objeto: 'medidas', terminos: [[3, a, b], [-2, 1, 3], [5, 2, 0]], grado: true });
MUESTRAS.push({ objeto: 'medidas', terminos: [[3, 2, 1], [-2, 1, 3], [1, 0, 0]], grado: true, mayor: '?' }, { objeto: 'medidas', terminos: [[3, 2, 1], [-2, 1, 3], [1, 0, 0]], grado: true, mayor: true, resaltar: 1 },
  { objeto: 'medidas', terminos: [[4, 5, 5], [1, 4, 4], [-7, 3, 6], [2, 0, 1]], grado: '?' });
for (let n = 0; n <= 6; n++) MUESTRAS.push({ objeto: 'casillero', grado: n, filas: [{ coef: { [n]: 1, 0: -3 } }], ceros: true, colorPot: 'o', iconos: true, escrito: 'Apuntó: x + 1' });
MUESTRAS.push({ objeto: 'casillero', grado: 5, filas: [{ coef: { 5: 1, 2: -3, 0: 1 } }], solo: [5, 2, 0] }, { objeto: 'casillero', grado: 3, orden: [1, 3, 0, 2], filas: [{ coef: { 3: 1, 2: 3, 1: 4, 0: -2 } }], iconos: true },
  { objeto: 'casillero', grado: 2, filas: [{ nombre: 'P', coef: { 2: -2, 1: 7, 0: 3 }, color: 'o' }, { nombre: 'Q', coef: { 2: 2, 1: 5, 0: 3 }, color: 'i' }], marcas: true, ceros: true },
  { objeto: 'casillero', grado: 3, orden: 'sube', filas: [{ coef: { 0: 4, 1: 1, 2: -3, 3: 2 } }], ceros: '?' });
for (let a = 1; a <= 4; a++) for (let b = 1; b <= 4; b++) MUESTRAS.push({ objeto: 'piso', largo: [2, a], ancho: [1, b], tope: [2, 4, 1, 4] });
MUESTRAS.push({ objeto: 'piso', largo: [2, 0], ancho: [1, 5] }, { objeto: 'piso', largo: [1, 2], ancho: [1, 3] }, { objeto: 'piso', largo: [2, 3], ancho: [1, 2], rotulos: false, medidas: false });

const solapan = (a, b, e = 0) => a.x0 < b.x1 + e && b.x0 < a.x1 + e && a.y0 < b.y1 + e && b.y0 < a.y1 + e;
const textosSVG = s => [...s.matchAll(/<text\b[^>]*>(.*?)<\/text>/g)].map(m => m[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&'));
function revisar(d, e, nombre, mal) {
  const s = P.dibujar(d, e), g = P.geometria(d, e), { W, H, M } = P.constantes;
  if (/NaN|undefined|Infinity/.test(s)) { mal.push(`${nombre}: NaN o undefined`); return; }
  for (const c of [...g.objetos, ...g.textos]) if (!(c.x0 >= M - 1e-9 && c.y0 >= M - 1e-9 && c.x1 <= W - M + 1e-9 && c.y1 <= H - M + 1e-9))
    mal.push(`${nombre}: se sale «${c.txt || c.que}» (${c.x0.toFixed(1)}, ${c.y0.toFixed(1)}) – (${c.x1.toFixed(1)}, ${c.y1.toFixed(1)})`);
  for (const f of g.formas || []) if (!(f.x >= M && f.y >= M && f.x + f.w <= W - M && f.y + f.h <= H - M)) mal.push(`${nombre}: se sale una ${f.que}`);
  const t = g.textos;
  for (let i = 0; i < t.length; i++) for (let j = i + 1; j < t.length; j++) if (solapan(t[i], t[j], 1)) mal.push(`${nombre}: se pisan «${t[i].txt}» y «${t[j].txt}»`);
  // Un texto no pisa un objeto, salvo el que va adentro del terreno a propósito.
  for (const x of t.filter(y => y.que !== 'dentro')) for (const o of g.objetos) if (solapan(x, o)) mal.push(`${nombre}: «${x.txt}» pisa ${o.que}`);
  for (let i = 0; i < g.objetos.length; i++) for (let j = i + 1; j < g.objetos.length; j++) if (solapan(g.objetos[i], g.objetos[j])) mal.push(`${nombre}: se pisan ${g.objetos[i].que} y ${g.objetos[j].que}`);
  // Todo texto dibujado está en geometria(): el mismo número y los mismos textos.
  const enSVG = textosSVG(s).sort(), enGeo = t.map(x => x.txt).sort();
  if (JSON.stringify(enSVG) !== JSON.stringify(enGeo)) mal.push(`${nombre}: los textos del SVG no son los de geometria(): ${enSVG.join(' | ')} ≠ ${enGeo.join(' | ')}`);
}

test('registrada en el kit', () => assert.equal(Kit.piezas['alg-losetas'], P));

test('sin NaN ni colores fijos, sin carmín ni verde, pura, de alto fijo, marcada de prueba y con su texto alternativo', () => {
  const altos = new Set();
  for (const d of MUESTRAS) {
    const s = P.dibujar(d);
    assert.ok(!/NaN|undefined|Infinity/.test(s), JSON.stringify(d));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), 'sin colores fijos');
    assert.ok(!/var\(--c-[hd]\)/.test(s), 'sin carmín ni verde');
    assert.ok(!/\sid="|filter|<image/.test(s), 'sin ids, filtros ni imágenes');
    assert.equal(s, P.dibujar(d), 'pura');
    assert.match(s, /data-objeto="(piezas|pedido|giro|lote|tamano|deposito|medidas|casillero|piso)" data-prueba="si"/);
    altos.add(s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)[0]);
    assert.ok(P.alt(d).length > 30 && !/undefined|NaN/.test(P.alt(d)), P.alt(d));
  }
  assert.deepEqual([...altos], ['viewBox="0 0 320 214"']);
});

test('con números: todo cabe con 4 de margen, ningún texto pisa a otro ni a un objeto, y todo texto está en geometria()', () => {
  const mal = [];
  MUESTRAS.forEach((d, k) => revisar(d, {}, `muestra ${k} ${JSON.stringify(d).slice(0, 90)}`, mal));
  assert.deepEqual(mal, [], mal.join('\n'));
});

test('fiel: una pieza dibujada por cada pieza pedida; en «Juntos», la suma por forma y cada pieza con el color de su pedido', () => {
  const FORMA = ['loseta', 'tira', 'cuadradito'];
  for (const d of MUESTRAS.filter(x => x.objeto === 'pedido')) {
    const g = P.geometria(d), s = P.dibujar(d), nombre = JSON.stringify(d).slice(0, 100);
    d.filas.forEach((f, k) => FORMA.forEach((que, j) => {
      const suyas = g.formas.filter(x => x.fila === `fila ${k + 1}` && x.que === que);
      assert.equal(suyas.length, f.cuenta[j], `${nombre}: ${que}s de la fila ${k + 1}`);
      assert.ok(suyas.every(x => x.color === (f.color || null)), `${nombre}: color de la fila ${k + 1}`);
    }));
    const total = [0, 1, 2].map(j => d.filas.reduce((a, f) => a + f.cuenta[j], 0));
    assert.deepEqual(g.total, total, nombre);
    if (d.juntos && d.filas.length) {
      FORMA.forEach((que, j) => {
        const js = g.formas.filter(x => x.fila === 'juntos' && x.que === que);
        assert.equal(js.length, total[j], `${nombre}: ${que}s juntas`);
        // Primero las del primer pedido, después las del segundo: cada una conserva su color.
        assert.deepEqual(js.map(x => x.color), d.filas.flatMap(f => Array(f.cuenta[j]).fill(f.color || null)), `${nombre}: colores de ${que}`);
      });
      // El término de cada montón dice su cantidad: «3x²», «7x», «5» (el 1 delante de la letra no se escribe).
      const ts = g.textos.filter(x => x.que === 'termino').map(x => x.txt);
      const espera = d.terminos === '?' ? total.filter(n => n > 0).map(() => '?') : total.map((n, j) => (n > 0 ? (j === 2 ? String(n) : `${n === 1 ? '' : n}${['x²', 'x'][j]}`) : null)).filter(Boolean);
      assert.deepEqual(ts, espera, nombre);
      if (d.terminos === true) assert.ok(g.textos.filter(x => x.que === 'termino').every(x => x.segs[0][1] === 'f'), 'el término que resulta, en violeta');
      if (d.terminos === '?') assert.ok(g.textos.filter(x => x.que === 'termino').every(x => !x.segs[0][1]), 'lo que se pide, en tinta');
    }
    assert.equal((s.match(/class="alg-pieza /g) || []).length, g.formas.length, `${nombre}: piezas dibujadas`);
    // Las formas, en columnas: la misma x de arranque para la misma forma en todas las filas, y columnas que no se pisan.
    if (d.columnas === false) {
      // Sin columnas: cada fila arranca en el mismo borde, sea cual sea su forma.
      const bordes = d.filas.map((f, k) => Math.min(...g.formas.filter(x => x.fila === `fila ${k + 1}`).map(x => x.x)));
      assert.equal(new Set(bordes).size, 1, `${nombre}: cada fila arranca en el borde`);
    } else FORMA.forEach((que, j) => {
      const xs = g.formas.filter(x => x.que === que);
      if (xs.length) assert.ok(Math.abs(Math.min(...xs.map(x => x.x)) - g.xs[j]) < 1e-9, `${nombre}: columna de ${que}`);
    });
    const [l, t, c] = FORMA.map(que => g.formas.filter(x => x.que === que));
    if (d.columnas !== false && l.length && t.length) assert.ok(Math.max(...l.map(x => x.x + x.w)) < Math.min(...t.map(x => x.x)), `${nombre}: losetas y tiras`);
    if (d.columnas !== false && t.length && c.length) assert.ok(Math.max(...t.map(x => x.x + x.w)) < Math.min(...c.map(x => x.x)), `${nombre}: tiras y cuadraditos`);
    // Una sola escala: la loseta mide 3u por 3u, la tira u por 3u y el cuadradito u por u; la unidad se lee (≥ 6).
    assert.ok(g.u >= 6 && g.u <= 18, `${nombre}: u = ${g.u}`);
    for (const x of g.formas) assert.deepEqual([x.w, x.h], x.que === 'loseta' ? [3 * g.u, 3 * g.u] : x.que === 'tira' ? [g.u, 3 * g.u] : [g.u, g.u], nombre);
    // Dos piezas no se pisan.
    for (let i = 0; i < g.formas.length; i++) for (let k = i + 1; k < g.formas.length; k++) {
      const a = g.formas[i], b = g.formas[k];
      assert.ok(!(a.x < b.x + b.w - 1e-9 && b.x < a.x + a.w - 1e-9 && a.y < b.y + b.h - 1e-9 && b.y < a.y + a.h - 1e-9), `${nombre}: se pisan dos piezas`);
    }
  }
  // El juego: con los dos pedidos y «Juntos», la unidad es 12 en las 75 combinaciones (la figura no cambia de escala).
  const us = new Set(MUESTRAS.slice(3, 78).map(d => P.geometria(d).u));
  assert.deepEqual([...us], [12]);
  // Con tope, las columnas quedan reservadas: en las 75 combinaciones del juego nada se corre ni cambia de escala, y
  // cada término va centrado bajo las piezas que hay (no bajo la columna reservada).
  const conTope = MUESTRAS.slice(3, 78).map(d => P.geometria(Object.assign({}, d, { tope: [4, 7, 5] })));
  assert.equal(new Set(conTope.map(g => `${g.u}|${g.xs.join(',')}`)).size, 1);
  for (const g of conTope) {
    const FORMAS = ['loseta', 'tira', 'cuadradito'], ts = g.textos.filter(x => x.que === 'termino');
    FORMAS.filter((q, j) => g.total[j] > 0).forEach((q, k) => {
      const js = g.formas.filter(x => x.fila === 'juntos' && x.que === q), x0 = Math.min(...js.map(x => x.x)), x1 = Math.max(...js.map(x => x.x + x.w));
      assert.ok(Math.abs(ts[k].x - (x0 + x1) / 2) < 1e-9, `término de ${q} centrado bajo su montón`);
    });
    assert.ok([...g.objetos, ...g.textos].every(c => c.x0 >= 4 && c.x1 <= 316 && c.y0 >= 4 && c.y1 <= 210));
  }
  assert.equal(P.polinomio([2, 3, 1]), '2x² + 3x + 1');
  assert.equal(P.polinomio([1, 1, 0]), 'x² + x');
  assert.equal(P.polinomio([0, 0, 0]), '0');
});

test('capacidad: lo que no cabe no se recorta ni se le quitan piezas; cabe() lo dice', () => {
  for (const d of MUESTRAS) assert.ok(P.cabe(d), JSON.stringify(d).slice(0, 100));
  const mucho = { objeto: 'pedido', filas: [fila('Uno', [3, 6, 9], 'o'), fila('Dos', [3, 6, 9], 'i'), fila('Tres', [1, 1, 1])], juntos: true, terminos: true };
  assert.equal(P.cabe(mucho), false);
  assert.equal(P.geometria(mucho).formas.filter(f => f.fila === 'juntos').length, 7 + 13 + 19, 'no se quita ninguna pieza');
});

test('las tres piezas: la tira mide el lado de la loseta por el del cuadradito, y los rótulos dicen sus medidas', () => {
  const g = P.geometria({ objeto: 'piezas', areas: true }), por = Object.fromEntries(g.formas.map(f => [f.que, f]));
  assert.equal(por.loseta.w, por.loseta.h);
  assert.deepEqual([por.tira.w, por.tira.h], [por.cuadradito.w, por.loseta.h]);
  assert.equal(por.cuadradito.w, por.cuadradito.h);
  assert.equal(por.loseta.w, 3 * por.cuadradito.w);
  // Las tres apoyadas en la misma línea.
  assert.equal(new Set(g.formas.map(f => f.y + f.h)).size, 1);
  const ts = g.textos.map(t => t.txt);
  for (const t of ['loseta', 'tira', 'cuadradito', 'x · x = x²', 'x · 1 = x', '1 · 1 = 1']) assert.ok(ts.includes(t), t);
  assert.equal(ts.filter(t => t === 'x dm').length, 3, 'x dm: dos lados de la loseta y el largo de la tira');
  assert.equal(ts.filter(t => t === '1 dm').length, 3, '1 dm: el ancho de la tira y los dos lados del cuadradito');
  assert.ok(!P.geometria({ objeto: 'piezas' }).textos.some(t => t.que === 'area'), 'sin áreas si no se piden');
});

test('las piezas de x por y: la girada es la misma pieza (x por y contra y por x); juntas, todas echadas; lo pedido con «?»', () => {
  const g = P.geometria({ objeto: 'giro', a: 2, b: 3 });
  const e = g.formas.filter(f => f.que === 'echada'), gi = g.formas.filter(f => f.que === 'girada');
  assert.equal(e.length, 2); assert.equal(gi.length, 3);
  for (const f of e) assert.deepEqual([f.w, f.h, f.color], [P.constantes.GI.w, P.constantes.GI.h, 'o']);
  for (const f of gi) assert.deepEqual([f.w, f.h, f.color], [P.constantes.GI.h, P.constantes.GI.w, 'i']);
  assert.deepEqual(g.textos.filter(t => t.que === 'termino').map(t => t.txt), ['2xy', '3yx']);
  // Sin «juntas», la figura no dice nada de la suma (es la de Predice).
  assert.ok(!/Juntas|5xy|\?/.test(textosSVG(P.dibujar({ objeto: 'giro', a: 2, b: 3 })).join(' ')));
  const j = P.geometria({ objeto: 'giro', a: 2, b: 3, juntas: true });
  const fila = j.formas.slice(-5);
  assert.ok(fila.every(f => f.que === 'echada' && f.w === P.constantes.GI.w && f.y === fila[0].y), 'las cinco echadas, en una fila');
  assert.deepEqual(fila.map(f => f.color), ['o', 'o', 'i', 'i', 'i']);
  assert.ok(j.textos.some(t => t.txt === '5xy' && t.segs[0][1] === 'f'));
  const q = P.geometria({ objeto: 'giro', a: 2, b: 3, juntas: '?' });
  assert.ok(q.textos.some(t => t.txt === '?' && !t.segs[0][1]) && !q.textos.some(t => t.txt === '5xy'));
  // Una sola pieza: sin grupo de giradas.
  assert.equal(P.geometria({ objeto: 'giro', a: 1, b: 0 }).formas.length, 1);
});

test('«Mira» puede cambiar de objeto en un paso; el estado elige el paso', () => {
  const d = { objeto: 'giro', a: 2, b: 3, pasos: [{ a: 1, b: 0 }, { objeto: 'pedido', filas: [fila('Tiras', [0, 3, 0], 'o', '3x'), fila('Losetas', [2, 0, 0], 'i', '2x²')], juntos: true, terminos: true }] };
  assert.match(P.dibujar(d, { paso: 0 }), /data-objeto="giro"/);
  assert.match(P.dibujar(d, { paso: 1 }), /data-objeto="pedido"/);
  assert.deepEqual(P.geometria(d, { paso: 1 }).textos.filter(t => t.que === 'termino').map(t => t.txt), ['2x²', '3x']);
  assert.notEqual(P.alt(d, { paso: 0 }), P.alt(d, { paso: 1 }));
});

test('todas las figuras de la teoría que usan la pieza: caben y no se pisan', () => {
  const def = require('../../../contenido/teoria/algebra/polinomios.js');
  for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
  const mal = []; let n = 0;
  const ver = (fig, piezaDe, nombre) => {
    if (!fig || (fig.pieza || piezaDe) !== 'alg-losetas') return;
    n++; revisar(fig.datos, fig.estado || {}, nombre, mal);
  };
  for (const i of def.ideas) {
    const pz = i.pieza;
    for (const [k, t] of ((i.lee && i.lee.tarjetas) || []).entries()) if (t.dibujo) ver(Object.assign({ pieza: t.pieza }, t.dibujo), pz, `${i.id} lee ${k + 1}`);
    if (i.juega && (i.juega.pieza || pz) === 'alg-losetas') for (const v of Teoria.grilla(i.juega.controles)) ver(i.juega.dibujo(v), i.juega.pieza || pz, `${i.id} juega ${JSON.stringify(v)}`);
    if (i.predice) { ver(i.predice.dibujo, i.predice.pieza || pz, `${i.id} predice`); ver(i.predice.revelar, i.predice.pieza || pz, `${i.id} revelar`); }
    if (i.mira && (i.mira.pieza || pz) === 'alg-losetas') for (const [k, p] of i.mira.pasos.entries()) ver({ datos: i.mira.datos, estado: p.estado }, 'alg-losetas', `${i.id} mira ${k + 1}`);
    if (i.regla && i.regla.dibujo) ver(i.regla.dibujo, i.regla.pieza || (i.mira && i.mira.pieza) || pz, `${i.id} regla`);
    for (const [k, e] of (i.ejemplos || []).entries()) ver(e.figura, pz, `${i.id} ejemplo ${k + 1}`);
    for (let s = 0; s < 60; s++) {
      if (i.resuelve) { const r = i.resuelve.generar(s); ver(r.dibujo, i.resuelve.pieza || pz, `${i.id} resuelve ${s}`); for (const p of r.pasos) ver(p.dibujo, i.resuelve.pieza || pz, `${i.id} resuelve ${s} paso`); }
      if (i.ahoraTu) { const a = i.ahoraTu.generar(s); ver(a.dibujo, i.ahoraTu.pieza || pz, `${i.id} ahora tú ${s}`); ver(a.solucion && a.solucion.dibujo, i.ahoraTu.pieza || pz, `${i.id} ahora tú ${s} solución`); }
    }
  }
  assert.ok(n >= 100, `figuras revisadas: ${n}`);
  assert.deepEqual(mal, [], mal.join('\n'));
});


// ---------- Fase 3: los objetos de las ideas 2 a 6 ----------
test('tamano: la loseta mide el lado elegido y la tira, el lado por 1; con ladoMax la escala no cambia; con lado 0 no cubren', () => {
  const us = new Set();
  for (let a = 1; a <= 6; a++) {
    const g = P.geometria({ objeto: 'tamano', filas: [fila('Pedido', [2, 3, 4])], lado: a, areas: true, ladoMax: 6 });
    us.add(g.u);
    const por = q => g.formas.filter(f => f.que === q);
    assert.equal(por('loseta').length, 2); assert.equal(por('tira').length, 3); assert.equal(por('cuadradito').length, 4);
    for (const f of por('loseta')) assert.deepEqual([f.w, f.h], [a * g.u, a * g.u]);
    for (const f of por('tira')) assert.deepEqual([f.w, f.h], [g.u, a * g.u]);
    for (const f of por('cuadradito')) assert.deepEqual([f.w, f.h], [g.u, g.u]);
    // Bajo cada grupo, lo que cubre: «2 · 4² = 32», «3 · 4 = 12» y «4», con las cuentas bien hechas.
    const ar = g.textos.filter(t => t.que === 'area').map(t => t.txt);
    assert.deepEqual(ar, [`2 · ${a}² = ${2 * a * a}`, `3 · ${a} = ${3 * a}`, '4']);
    assert.ok(g.textos.some(t => t.que === 'lado' && t.txt === `${a} dm` && t.segs[0][1] === 'o'), 'el lado, en naranja');
  }
  assert.equal(us.size, 1, 'la misma escala con cualquier lado');
  const cero = P.geometria({ objeto: 'tamano', filas: [fila('Pedido', [2, 3, 4])], lado: 0, total: true });
  assert.equal(cero.formas.filter(f => f.que !== 'cuadradito').length, 0); assert.equal(cero.vacios.length, 5);
  assert.ok(cero.textos.some(t => t.que === 'total' && t.txt === 'Cubre: 4 dm²'));
  const q = P.geometria({ objeto: 'tamano', filas: [fila('Pedido', [2, 3, 4])], lado: 'x', total: '?' });
  assert.ok(q.textos.some(t => t.txt === 'Cubre: ? dm²' && t.segs.every(s => !s[1])), 'lo pedido, en tinta');
});

test('medidas: una ficha por letra que se multiplica (x naranja, y turquesa) y el grado de cada fila', () => {
  for (let a = 0; a <= 5; a++) for (let b = 0; b <= 5; b++) {
    const g = P.geometria({ objeto: 'medidas', terminos: [[3, a, b], [-2, 1, 3], [5, 2, 0]], grado: true });
    assert.equal(g.fichas.filter(f => f.fila === 0).length, a + b);
    assert.equal(g.fichas.filter(f => f.fila === 0 && f.letra === 'x').length, a);
    const gr = g.textos.filter(t => t.que === 'grado').map(t => t.txt);
    assert.deepEqual(gr, [`grado ${a + b}`, 'grado 4', 'grado 2']);
    assert.ok(g.textos.filter(t => t.que === 'dentro').every(t => t.segs[0][1] === (t.txt === 'x' ? 'o' : 'i')));
  }
  const m = P.geometria({ objeto: 'medidas', terminos: [[3, 2, 1], [-2, 1, 3], [1, 0, 0]], grado: true, mayor: true });
  assert.ok(m.textos.some(t => t.txt === 'Grado del polinomio: 4'));
  assert.ok(P.geometria({ objeto: 'medidas', terminos: [[3, 2, 1]], mayor: '?' }).textos.some(t => t.txt === 'Grado del polinomio: ?'));
  assert.equal(P.terminoXY(-2, 1, 3), '−2xy³'); assert.equal(P.terminoXY(1, 0, 0), '1'); assert.equal(P.terminoXY(3, 2, 1), '3x²y');
});

test('casillero: una casilla por potencia, de xⁿ a x⁰; las vacías, punteadas o con 0 violeta; las marcas comparan', () => {
  for (let n = 0; n <= 6; n++) {
    const g = P.geometria({ objeto: 'casillero', grado: n, filas: [{ coef: { [n]: 1 } }], ceros: true });
    assert.equal(g.celdas.length, n + 1);
    assert.deepEqual(g.exps, Array.from({ length: n + 1 }, (_, k) => n - k));
    assert.equal(g.textos.filter(t => t.txt === '0' && t.segs[0][1] === 'f').length, n, 'los ceros, en violeta');
  }
  const solo = P.geometria({ objeto: 'casillero', grado: 5, filas: [{ coef: { 5: 1, 2: -3, 0: 1 } }], solo: [5, 2, 0] });
  assert.deepEqual(solo.exps, [5, 2, 0], 'antes de completar, solo las casillas escritas');
  assert.deepEqual(P.geometria({ objeto: 'casillero', grado: 3, orden: 'sube', filas: [{ coef: {} }] }).exps, [0, 1, 2, 3]);
  assert.deepEqual(P.geometria({ objeto: 'casillero', grado: 3, orden: [1, 3, 0, 2], filas: [{ coef: {} }] }).exps, [1, 3, 0, 2]);
  const dos = P.geometria({ objeto: 'casillero', grado: 2, filas: [{ nombre: 'P', coef: { 2: -2, 1: 7, 0: 3 }, color: 'o' }, { nombre: 'Q', coef: { 2: 2, 1: 5, 0: 3 }, color: 'i' }], marcas: true });
  assert.deepEqual(dos.textos.filter(t => t.que === 'marca').map(t => t.txt), ['✗', '✗', '✓']);
});

test('piso: cada tramo del largo por cada tramo del ancho es una pieza; con tope, nada se corre', () => {
  const ref = new Set();
  for (let a = 1; a <= 4; a++) for (let b = 1; b <= 4; b++) {
    const g = P.geometria({ objeto: 'piso', largo: [2, a], ancho: [1, b], tope: [2, 4, 1, 4] }), c = q => g.formas.filter(f => f.que === q).length;
    assert.deepEqual([c('loseta'), c('tira'), c('cuadradito')], [2, 2 * b + a, a * b], `(2x + ${a})(x + ${b})`);
    assert.equal(g.formas.length, (2 + a) * (1 + b));
    ref.add(`${g.u}|${g.objetos[0].x0}|${g.objetos[0].y0}|${g.textos.filter(t => t.que === 'medida').map(t => t.y).join(',')}`);
    for (const f of g.formas) assert.deepEqual([f.w, f.h].map(v => v / g.u).sort(), f.que === 'loseta' ? [3, 3] : f.que === 'tira' ? [1, 3] : [1, 1]);
  }
  assert.equal(ref.size, 1, 'la misma escala y el mismo lugar con cualquier tramo');
});

// ---------- Correcciones del 19 nov (lector en frío y auditoría de Polinomios) ----------
test('piso con piezas: false: solo el borde y las marcas de los tramos, sin piezas ni cuentas en el texto alternativo', () => {
  const d = { objeto: 'piso', largo: [2, 3], ancho: [1, 2], piezas: false }, s = P.dibujar(d), g = P.geometria(d);
  assert.ok(!/alg-pieza/.test(s) && g.formas.length === 0);
  assert.equal(g.cortes.length, 2 * 4 + 2 * 2, 'una marca arriba y abajo por cada corte del largo, y a los dos lados por cada corte del ancho');
  assert.ok(!/losetas|tiras|cuadraditos/.test(P.alt(d)));
  assert.ok(P.cabe(d));
});
test('giro: cada pieza apilada lleva su propio «y dm» (con uno solo parecía que las dos juntas medían y)', () => {
  for (const a of [1, 2, 3]) assert.equal(P.geometria({ objeto: 'giro', a, b: 3 }).textos.filter(t => t.que === 'medida' && t.txt === 'y dm').length, a + 1);
});
test('tamaño con dos filas: el rótulo de cada fila queda más cerca de sus piezas que de las de la otra', () => {
  for (const extra of [{}, { ladoMax: 3 }, { lado: 3, areas: true }]) {
    const g = P.geometria(Object.assign({ objeto: 'tamano', filas: [{ nombre: 'P', cuenta: [1, 0, 1], color: 'o' }, { nombre: 'Q', cuenta: [0, 2, 0], color: 'i' }], lado: 1 }, extra));
    const rq = g.textos.find(t => t.que === 'rotulo' && /^Q/.test(t.txt)), deP = g.formas.filter(f => f.fila === 'fila 1'), deQ = g.formas.filter(f => f.fila === 'fila 2');
    const arribaQ = Math.min(...deQ.map(f => f.y)), abajoP = Math.max(...deP.map(f => f.y + f.h));
    assert.ok(arribaQ - rq.y1 < rq.y0 - abajoP, JSON.stringify({ arribaQ, rq: [rq.y0, rq.y1], abajoP }));
  }
});
test('medidas: un término se puede escribir tal como lo dice el enunciado («4²x⁵y⁴»), con sus fichas de letras', () => {
  const g = P.geometria({ objeto: 'medidas', terminos: [[2, 5, 4, '4²x⁵y⁴']], grado: '?' });
  assert.equal(g.textos.find(t => t.que === 'termino').txt, '4²x⁵y⁴');
  assert.equal(g.fichas.length, 9);
});
