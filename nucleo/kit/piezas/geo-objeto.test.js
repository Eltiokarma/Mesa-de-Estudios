// Pruebas de la pieza «geo-objeto»: cada objeto se dibuja sin NaN ni colores fijos, es puro, de alto fijo, marcado como
// dibujo de prueba y con su texto alternativo. Con números (no a ojo; docs/molde-unidad.md §6): todo cabe en el lienzo
// con 4 de margen, ningún rótulo pisa a otro ni cruza una línea (la pista, las cotas, los caminos, la regla), los
// tramos y el desvío van a una sola escala, y el color de cada tramo sale de su papel (todo y pide en tinta; los datos,
// naranja el primero y turquesa el segundo). Se revisan las muestras de abajo y todas las figuras de la teoría que usan
// la pieza (juego en toda su grilla, predicción, «Mira» paso a paso, ejemplos, «Así se resuelve» y «Ahora tú»).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../kit.js');
const T = require('../trazo.js');
const P = require('./geo-objeto.js');

const pto = (id, km, alto) => (alto ? { id, km, alto } : { id, km });
const MUESTRAS = [
  { objeto: 'carretera', vista: [-3, 13], hitos: 1, combi: 2, puntos: [pto('A', 0), pto('B', 4), pto('C', 10)],
    tramos: [{ de: 'A', a: 'B', texto: '4 km' }, { de: 'B', a: 'C', texto: '6 km', nivel: 2 }, { de: 'A', a: 'C', papel: 'todo', texto: '10 km', nivel: -1 }] },
  { objeto: 'carretera', vista: [-3, 13], hitos: 1, combi: 2, puntos: [pto('A', 0), pto('B', 0), pto('C', 10)],
    tramos: [{ de: 'A', a: 'B', texto: '0 km' }, { de: 'B', a: 'C', texto: '10 km', nivel: 2 }, { de: 'A', a: 'C', papel: 'todo', texto: '10 km', nivel: -1 }] },
  { objeto: 'carretera', vista: [-1, 11], puntos: [pto('A', 0), pto('B', 4, 3), pto('C', 10)],
    tramos: [{ de: 'A', a: 'B', texto: '5 km' }, { de: 'B', a: 'C', texto: '≈ 6,7 km' }, { de: 'A', a: 'C', papel: 'todo', texto: '10 km', nivel: -1 }],
    alturas: [{ punto: 'B', texto: '3 km' }], nota: '5 + 6,7 ≈ 11,7 km' },
  { objeto: 'carretera', vista: [-1, 11], puntos: [pto('A', 0), pto('B', 4, 3), pto('C', 10)],
    tramos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'A', a: 'C', papel: 'todo', texto: '10 km', nivel: -1 }],
    alturas: [{ punto: 'B', texto: '3 km' }], reglas: [{ de: 'A', a: 'B', texto: '5 km' }, { de: 'B', a: 'C', texto: '≈ 6,7 km' }] },
  { objeto: 'recta', puntos: [pto('A', 0), pto('B', 3), pto('C', 14), pto('D', 20)],
    tramos: [{ de: 'B', a: 'C', papel: 'pide', texto: '?' }, { de: 'A', a: 'C', texto: '14 cm', nivel: 2 }, { de: 'B', a: 'D', texto: '17 cm', nivel: 3 }, { de: 'A', a: 'D', papel: 'todo', texto: '20 cm', nivel: -2 }] },
];
const casos = () => MUESTRAS.map(d => [d, {}]);

// Caja de cada elemento del SVG, con medio grosor de trazo. Los textos, con su ancho estimado (T.ancho) y su alto (de
// y − tam·0,8 a y + tam·0,25, porque y es la línea base). Los trazados, por sus puntos (M, L, Q y Z absolutos).
function cajas(svg) {
  const out = [], num = (a, k) => { const m = a.match(new RegExp(`\\s${k}="(-?[\\d.]+)"`)); return m ? +m[1] : null; };
  for (const m of svg.matchAll(/<(line|rect|circle|path|text)\b([^>]*)>([^<]*)/g)) {
    const [, tag, a, txt] = m, sw = tag === 'text' ? 0 : (num(a, 'stroke-width') || 0) / 2;
    if (tag === 'line') out.push({ tag, p: [num(a, 'x1'), num(a, 'y1')], q: [num(a, 'x2'), num(a, 'y2')], x0: Math.min(num(a, 'x1'), num(a, 'x2')) - sw, y0: Math.min(num(a, 'y1'), num(a, 'y2')) - sw, x1: Math.max(num(a, 'x1'), num(a, 'x2')) + sw, y1: Math.max(num(a, 'y1'), num(a, 'y2')) + sw, el: m[0] });
    else if (tag === 'rect') out.push({ tag, x0: num(a, 'x') - sw, y0: num(a, 'y') - sw, x1: num(a, 'x') + num(a, 'width') + sw, y1: num(a, 'y') + num(a, 'height') + sw, el: m[0] });
    else if (tag === 'circle') { const r = num(a, 'r'); out.push({ tag, x0: num(a, 'cx') - r - sw, y0: num(a, 'cy') - r - sw, x1: num(a, 'cx') + r + sw, y1: num(a, 'cy') + r + sw, el: m[0] }); }
    else if (tag === 'path') {
      const d = (a.match(/\sd="([^"]+)"/) || [])[1] || '';
      assert.ok(!/[a-z]/.test(d), `trazo relativo en ${m[0].slice(0, 60)}`);
      const xs = [], ys = [];
      for (const seg of d.matchAll(/([MLQ])([^MLQZ]*)/g)) { const v = seg[2].trim().split(/[\s,]+/).map(Number); for (let i = 0; i + 1 < v.length; i += 2) { xs.push(v[i]); ys.push(v[i + 1]); } }
      if (xs.length) out.push({ tag, pts: xs.map((x, i) => [x, ys[i]]), x0: Math.min(...xs) - sw, y0: Math.min(...ys) - sw, x1: Math.max(...xs) + sw, y1: Math.max(...ys) + sw, el: m[0] });
    } else if (tag === 'text') {
      const tam = num(a, 'font-size') || 16, peso = num(a, 'font-weight') || 400, t = txt.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      const w = T.ancho(t, tam, peso), x = num(a, 'x'), y = num(a, 'y');
      const anc = (a.match(/text-anchor="(\w+)"/) || [])[1] || 'start', x0 = anc === 'middle' ? x - w / 2 : anc === 'end' ? x - w : x;
      out.push({ tag, x0, y0: y - tam * 0.8, x1: x0 + w, y1: y + tam * 0.25, el: m[0], txt: t });
    }
  }
  return out;
}
// ¿El segmento p–q cruza la caja c (agrandada en e)? Recorte de Liang-Barsky.
function cruza(p, q, c, e = 1) {
  const x0 = c.x0 - e, x1 = c.x1 + e, y0 = c.y0 - e, y1 = c.y1 + e;
  let t0 = 0, t1 = 1;
  const dx = q[0] - p[0], dy = q[1] - p[1];
  for (const [pp, qq] of [[-dx, p[0] - x0], [dx, x1 - p[0]], [-dy, p[1] - y0], [dy, y1 - p[1]]]) {
    if (pp === 0) { if (qq < 0) return false; continue; }
    const r = qq / pp;
    if (pp < 0) { if (r > t1) return false; if (r > t0) t0 = r; } else { if (r < t0) return false; if (r < t1) t1 = r; }
  }
  return true;
}
const choca = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;

function revisar(d, e, nombre, mal) {
  const s = P.dibujar(d, e), { W, M, TOP, BOT } = P.constantes;
  const vb = s.match(/viewBox="0 ([\d.]+) ([\d.]+) ([\d.]+)"/), y0v = +vb[1], H = +vb[3];
  if (/NaN|undefined|Infinity/.test(s)) { mal.push(`${nombre}: NaN o undefined`); return; }
  const cs = cajas(s);
  for (const c of cs) if (!(c.x0 >= M - 1e-9 && c.y0 >= y0v + M - 1e-9 && c.x1 <= W - M + 1e-9 && c.y1 <= y0v + H - M + 1e-9))
    mal.push(`${nombre}: se sale (${c.x0.toFixed(1)}, ${c.y0.toFixed(1)}) – (${c.x1.toFixed(1)}, ${c.y1.toFixed(1)}) en ${c.el.slice(0, 80)}`);
  const txt = cs.filter(c => c.tag === 'text');
  for (let i = 0; i < txt.length; i++) for (let j = i + 1; j < txt.length; j++) if (choca(txt[i], txt[j])) mal.push(`${nombre}: se pisan «${txt[i].txt}» y «${txt[j].txt}»`);
  // Ningún rótulo dentro de la pista ni encima de una línea (cotas y sus topes, caminos, alturas, reglas, bordes).
  for (const t of txt) {
    if (d.objeto !== 'recta' && t.y1 > TOP && t.y0 < BOT) mal.push(`${nombre}: «${t.txt}» cae dentro de la pista`);
    for (const l of cs.filter(c => c.tag === 'line')) if (cruza(l.p, l.q, t, 0.5)) mal.push(`${nombre}: «${t.txt}» cruza una línea (${l.el.slice(0, 70)})`);
    for (const c of cs.filter(x => x.tag === 'circle')) if (choca(t, c)) mal.push(`${nombre}: «${t.txt}» pisa un punto`);
    // La combi y la regla son figuras cerradas: el rótulo no cruza su borde ni queda adentro.
    for (const c of cs.filter(x => x.tag === 'path')) {
      const ps = c.pts, centro = [(t.x0 + t.x1) / 2, (t.y0 + t.y1) / 2];
      let dentro = false;
      for (let i = 0, j = ps.length - 1; i < ps.length; j = i++) {
        if (cruza(ps[j], ps[i], t, 0.5)) { mal.push(`${nombre}: «${t.txt}» cruza la combi o la regla`); break; }
        if ((ps[i][1] > centro[1]) !== (ps[j][1] > centro[1]) && centro[0] < (ps[j][0] - ps[i][0]) * (centro[1] - ps[i][1]) / (ps[j][1] - ps[i][1]) + ps[i][0]) dentro = !dentro;
      }
      if (dentro) mal.push(`${nombre}: «${t.txt}» queda dentro de la combi o la regla`);
    }
  }
}

test('registrada en el kit', () => assert.equal(Kit.piezas['geo-objeto'], P));

test('cada objeto: sin NaN ni colores fijos, puro, alto fijo, marcado de prueba, con su texto alternativo', () => {
  assert.deepEqual([...P.OBJETOS].sort(), [...new Set(MUESTRAS.map(d => d.objeto))].sort());
  for (const [d, e] of casos()) {
    const s = P.dibujar(d, e);
    assert.ok(!/NaN|undefined|Infinity/.test(s), d.objeto);
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), `${d.objeto}: sin colores fijos`);
    assert.ok(!/\sid="|filter|<image/.test(s), `${d.objeto}: sin ids, filtros ni imágenes`);
    assert.equal(s, P.dibujar(d, e), `${d.objeto}: puro`);
    if (d.objeto === 'carretera') assert.match(s, /data-objeto="carretera" data-prueba="si"/);
    if (d.combi !== undefined) assert.match(s, /data-objeto="combi" data-prueba="si"/);
    if (d.reglas) assert.match(s, /data-objeto="regla" data-prueba="si"/);
    const vb = s.match(/viewBox="0 ([\d.]+) ([\d.]+) ([\d.]+)"/);
    assert.equal(+vb[2], 320);
    assert.ok(+vb[1] >= 0 && +vb[1] + +vb[3] <= 240 + 1e-9, vb[0]);
    assert.ok(P.alt(d).length > 30 && !/undefined|NaN/.test(P.alt(d)), d.objeto);
  }
  // El alto sale de la forma de los datos, no del estado: el juego no cambia de alto al correr B.
  const alto = bx => P.dibujar(Object.assign({}, MUESTRAS[0], { puntos: [pto('A', 0), pto('B', bx), pto('C', 10)] })).match(/viewBox="[^"]+"/)[0];
  assert.equal(alto(-2), alto(12));
  const mira = Object.assign({}, MUESTRAS[3], { reglas: MUESTRAS[3].reglas.map(r => Object.assign({ paso: 1 }, r)) });
  assert.equal(P.dibujar(mira, { paso: 0 }).match(/viewBox="[^"]+"/)[0], P.dibujar(mira, { final: true }).match(/viewBox="[^"]+"/)[0]);
  assert.ok(!/NaN/.test(P.dibujar({})));
});

test('fiel: una sola escala para lo largo de la carretera y para el desvío', () => {
  const g = P.geometria(MUESTRAS[2]);
  const L = (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]);
  assert.ok(Math.abs(L(g.P.A, g.P.B) / g.s - 5) < 1e-9, 'AB mide 5 km a escala');
  assert.ok(Math.abs(L(g.P.B, g.P.C) / g.s - Math.hypot(6, 3)) < 1e-9, 'BC mide √45 km a escala');
  assert.ok(Math.abs((g.BOT - g.P.B[1]) / g.s - 3) < 1e-9, 'B está a 3 km de la carretera');
  // Con vista fija, la escala no cambia al correr B (la manija del juego sigue al dedo), y km() invierte a X().
  const v = bx => P.geometria({ objeto: 'carretera', vista: [-3, 13], puntos: [pto('A', 0), pto('B', bx), pto('C', 10)] });
  assert.equal(v(-2).s, v(12).s);
  for (const bx of [-2, 0, 4.5, 12]) assert.ok(Math.abs(v(bx).km(v(bx).P.B[0]) - bx) < 1e-9);
});

test('colores por papel: todo y pide en tinta; los datos, naranja el primero y turquesa el segundo; nunca violeta', () => {
  assert.deepEqual(P.colores(MUESTRAS[0]), { AB: 'o', BC: 'i', AC: null });
  // B antes de A: AB empieza antes que BC, sigue naranja.
  assert.deepEqual(P.colores({ puntos: [pto('A', 0), pto('B', -2), pto('C', 10)], tramos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }] }), { AB: 'o', BC: 'i' });
  // Un solo dato: naranja, aunque sea el tramo de la derecha.
  assert.deepEqual(P.colores({ puntos: [pto('A', 0), pto('B', 1.5), pto('C', 2.4)], tramos: [{ de: 'A', a: 'B', papel: 'pide', texto: '?' }, { de: 'B', a: 'C' }] }), { AB: null, BC: 'o' });
  assert.equal(P.colorDe(MUESTRAS[0], 'BA'), 'o', 'el nombre al revés es el mismo tramo');
  const s = P.dibujar(MUESTRAS[4]);
  assert.ok(!/var\(--c-f\)/.test(s), 'sin violeta');
  assert.ok(/fill="currentColor"[^>]*>\?</.test(s), 'lo que se pide, en tinta');
});

test('los pasos: un tramo o una regla aparecen en su paso; un texto con pasos muestra el último que llegó', () => {
  const d = Object.assign({}, MUESTRAS[3], { reglas: [{ de: 'A', a: 'B', texto: '5 km', paso: 1 }], tramos: [{ de: 'A', a: 'B', texto: [{ t: null }, { t: '5 km', paso: 2 }] }] });
  assert.ok(!P.dibujar(d, { paso: 0 }).includes('data-objeto="regla"'));
  assert.ok(P.dibujar(d, { paso: 1 }).includes('data-objeto="regla"'));
  assert.equal((P.dibujar(d, { paso: 1 }).match(/>5 km</g) || []).length, 1, 'en el paso 1, solo la lectura de la regla');
  assert.equal((P.dibujar(d, { final: true }).match(/>5 km</g) || []).length, 2);
});

test('muestras: todo cabe con 4 de margen y ningún rótulo pisa a otro ni cruza una línea', () => {
  const mal = [];
  for (const [d, e] of casos()) revisar(d, e, `${d.objeto} ${JSON.stringify(d.puntos.map(p => p.km))}`, mal);
  assert.deepEqual(mal, []);
});

test('todas las figuras de la teoría que usan la pieza: caben y sus rótulos no se pisan', () => {
  const U = require(path.join(__dirname, '../../../contenido/teoria/geometria/segmentos-y-angulos.js'));
  const Teoria = require('../../teoria.js');
  const mal = [], figs = [];
  const toma = (nombre, dib, pieza) => { if (dib && pieza === 'geo-objeto') figs.push([nombre, dib.datos, dib.estado || {}]); };
  for (const idea of U.ideas) {
    const pz = idea.pieza;
    if (idea.juega) {
      const j = idea.juega, base = Teoria.inicio(j);
      for (const v of Teoria.grilla(j.controles || [])) toma(`${idea.id} juego ${JSON.stringify(v)}`, j.dibujo(Object.assign({}, base, v)), j.pieza || pz);
    }
    for (const t of (idea.lee && idea.lee.tarjetas) || []) toma(`${idea.id} lee`, t.dibujo, t.pieza || pz);
    if (idea.predice) { toma(`${idea.id} predice`, idea.predice.dibujo, idea.predice.pieza || pz); toma(`${idea.id} revelar`, idea.predice.revelar, idea.predice.pieza || pz); }
    if (idea.mira) idea.mira.pasos.forEach((ps, i) => toma(`${idea.id} mira ${i + 1}`, { datos: idea.mira.datos, estado: Object.assign({}, idea.mira.base || {}, ps.estado || {}) }, idea.mira.pieza || pz));
    for (const [k, ej] of (idea.ejemplos || []).entries()) if (ej.figura) toma(`${idea.id} ejemplo ${k + 1}`, ej.figura, ej.figura.pieza);
    for (let s = 0; s < 120; s++) {
      if (idea.resuelve) { const c = idea.resuelve.generar(s); toma(`${idea.id} resuelve ${s}`, c.dibujo, idea.resuelve.pieza || pz); }
      if (idea.ahoraTu) { const c = idea.ahoraTu.generar(s); toma(`${idea.id} ahora tú ${s}`, c.dibujo, idea.ahoraTu.pieza || pz); }
    }
  }
  assert.ok(figs.length > 100, `${figs.length} figuras`);
  for (const [nombre, d, e] of figs) revisar(d, e, nombre, mal);
  assert.deepEqual(mal.slice(0, 20), []);
});
