// Pruebas de la pieza «trig-medida» (la lupa, la rueda con sus pitas y la calculadora de tres modos): cada objeto se
// dibuja sin NaN ni colores fijos, es puro, de alto fijo, marcado como dibujo de prueba y con su texto alternativo. Con
// números (docs/molde-unidad.md §6): todo cabe en el lienzo con 4 de margen y ningún rótulo pisa a otro, en las muestras
// y en todas las figuras de la teoría que usan la pieza. Y es fiel: 27′ y 50ᵐ caen en la misma raya, y n pitas abarcan
// n radianes con cualquier rueda.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../kit.js');
const T = require('../trazo.js');
const P = require('./trig-medida.js');

const MUESTRAS = {
  lupa: { desde: 2, min: 45, rotulo: '2° 45′' },
  rueda: { radio: 30, pitas: 2, cuenta: true, rotulo: '2 rad' },
  calculadora: { modos: [{ nombre: 'DEG', valor: '63', color: 'h' }, { nombre: 'GRA', valor: '70', color: 'i' }, { nombre: 'RAD', valor: '7π/20', color: 'f' }] },
};
const VARIANTES = [
  { objeto: 'lupa', desde: 0, min: 27, rotulo: '27′', cen: true, rotuloCen: '50ᵐ' },
  { objeto: 'lupa', desde: 0, min: 0, rotulo: '0° 0′' },
  { objeto: 'lupa', desde: 3, min: 55, rotulo: '3° 55′' },
  { objeto: 'lupa', desde: 1, min: 30.6, rotulo: '1° 30′ 36″' },
  { objeto: 'lupa', desde: 0 },
  { objeto: 'rueda', radio: 20, pitas: 0.5, cuenta: true, rotulo: '0,5 rad' },
  { objeto: 'rueda', radio: 20, pitas: 2.5, cuenta: true, rotulo: '2,5 rad' },
  { objeto: 'rueda', radio: 40, pitas: 2.5, cuenta: true, rotulo: '2,5 rad' },
  { objeto: 'rueda', radio: 40, pitas: 5, cuenta: true, rotulo: '5 rad' },
  { objeto: 'rueda', radio: 30, pitas: 6.283, cuenta: true, rotulo: '2π rad' },
  { objeto: 'rueda', radio: 30, pitas: 1, rotulo: '?', colorRotulo: 'tinta', resto: true },
  { objeto: 'rueda', radio: 30, pitas: 0 },
  { objeto: 'calculadora', modos: [{ nombre: 'DEG', valor: '?', color: 'h' }, { nombre: 'GRA', valor: '?', color: 'i' }, { nombre: 'RAD', valor: '', color: 'f' }] },
];
const casos = () => Object.entries(MUESTRAS).map(([o, d]) => Object.assign({ objeto: o }, d)).concat(VARIANTES).map(d => [d, {}]);

// Caja de cada elemento del SVG, con medio grosor de trazo; los textos, con su ancho estimado (T.ancho).
function cajas(svg) {
  const out = [], num = (a, k) => { const m = a.match(new RegExp(`\\s${k}="(-?[\\d.]+)"`)); return m ? +m[1] : null; };
  for (const m of svg.matchAll(/<(line|circle|rect|path|text)\b([^>]*)>([^<]*)/g)) {
    const [, tag, a, txt] = m, sw = tag === 'text' ? 0 : (num(a, 'stroke-width') || 0) / 2;
    if (tag === 'line') out.push({ tag, x0: Math.min(num(a, 'x1'), num(a, 'x2')) - sw, y0: Math.min(num(a, 'y1'), num(a, 'y2')) - sw, x1: Math.max(num(a, 'x1'), num(a, 'x2')) + sw, y1: Math.max(num(a, 'y1'), num(a, 'y2')) + sw, el: m[0] });
    else if (tag === 'circle') { const r = num(a, 'r'); out.push({ tag, x0: num(a, 'cx') - r - sw, y0: num(a, 'cy') - r - sw, x1: num(a, 'cx') + r + sw, y1: num(a, 'cy') + r + sw, el: m[0] }); }
    else if (tag === 'rect') out.push({ tag, x0: num(a, 'x') - sw, y0: num(a, 'y') - sw, x1: num(a, 'x') + num(a, 'width') + sw, y1: num(a, 'y') + num(a, 'height') + sw, el: m[0] });
    else if (tag === 'path') {
      const d = (a.match(/\sd="([^"]+)"/) || [])[1] || '';
      assert.ok(!/[a-zA-KN-Y]/.test(d), `solo M, L y Z absolutos en ${m[0].slice(0, 60)}`);
      const v = d.replace(/[MLZ]/g, ' ').trim().split(/[\s,]+/).map(Number), xs = [], ys = [];
      for (let i = 0; i + 1 < v.length; i += 2) { xs.push(v[i]); ys.push(v[i + 1]); }
      if (xs.length) out.push({ tag, x0: Math.min(...xs) - sw, y0: Math.min(...ys) - sw, x1: Math.max(...xs) + sw, y1: Math.max(...ys) + sw, el: m[0] });
    } else {
      const tam = num(a, 'font-size') || 16, peso = num(a, 'font-weight') || 400, t = txt.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      const w = T.ancho(t, tam, peso), x = num(a, 'x'), y = num(a, 'y');
      const anc = (a.match(/text-anchor="(\w+)"/) || [])[1] || 'start', x0 = anc === 'middle' ? x - w / 2 : anc === 'end' ? x - w : x;
      out.push({ tag, x0, y0: y - tam * 0.8, x1: x0 + w, y1: y + tam * 0.25, el: m[0], txt: t });
    }
  }
  return out;
}
function revisar(d, e, nombre, mal) {
  const s = P.dibujar(d, e), { W, H, M } = P.constantes;
  if (/NaN|undefined|Infinity/.test(s)) { mal.push(`${nombre}: NaN o undefined`); return; }
  const cs = cajas(s);
  for (const c of cs) if (!(c.x0 >= M - 1e-9 && c.y0 >= M - 1e-9 && c.x1 <= W - M + 1e-9 && c.y1 <= H - M + 1e-9))
    mal.push(`${nombre}: se sale (${c.x0.toFixed(1)}, ${c.y0.toFixed(1)}) – (${c.x1.toFixed(1)}, ${c.y1.toFixed(1)}) en ${c.el.slice(0, 80)}`);
  const txt = cs.filter(c => c.tag === 'text' && c.txt.trim());
  for (let i = 0; i < txt.length; i++) for (let j = i + 1; j < txt.length; j++) {
    const a = txt[i], b = txt[j];
    if (a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1) mal.push(`${nombre}: se pisan «${a.txt}» y «${b.txt}»`);
  }
}

test('registrada en el kit', () => assert.equal(Kit.piezas['trig-medida'], P));

test('cada objeto: sin NaN ni colores fijos, puro, alto fijo, marcado de prueba, con su texto alternativo', () => {
  assert.deepEqual([...P.OBJETOS].sort(), Object.keys(MUESTRAS).sort());
  for (const [d, e] of casos()) {
    const s = P.dibujar(d, e);
    assert.ok(!/NaN|undefined|Infinity/.test(s), d.objeto);
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), `${d.objeto}: sin colores fijos`);
    assert.ok(!/\sid="|filter|<image/.test(s), `${d.objeto}: sin ids, filtros ni imágenes`);
    assert.equal(s, P.dibujar(d, e), `${d.objeto}: puro`);
    assert.match(s, /data-objeto="[a-z]+" data-prueba="si"/);
    assert.match(s, /viewBox="0 0 320 300"/);
    assert.ok(P.alt(d).length > 20 && !/undefined|NaN/.test(P.alt(d)), d.objeto);
  }
});

test('la lupa es fiel: 60 minutos en el grado sexagesimal, 100 en el centesimal, y 27′ cae donde 50ᵐ', () => {
  const k = P.constantes;
  // 27′ = 0,45° = 0,5ᵍ = 50ᵐ: la misma raya. El grado centesimal mide 9/10 del sexagesimal.
  assert.ok(Math.abs(P.xMin(27) - (k.LX0 + k.LARGO * 0.9 * 50 / 100)) < 1e-9);
  const s = P.dibujar({ objeto: 'lupa', desde: 0, cen: true });
  assert.equal((s.match(/stroke="var\(--c-h\)"/g) || []).length, 1 + 13, 'la línea y 13 rayitas: una cada 5′');
  assert.equal((s.match(/stroke="var\(--c-i\)"/g) || []).length, 1 + 11, 'la línea y 11 rayitas: una cada 10ᵐ');
  // La aguja está donde dicen sus minutos, y la fila centesimal solo se dibuja si la lupa empieza en 0.
  assert.ok(Math.abs(P.geometria({ objeto: 'lupa', desde: 2, min: 45 }).aguja[0] - P.xMin(45)) < 1e-9);
  assert.ok(!P.dibujar({ objeto: 'lupa', desde: 2, cen: true }).includes('var(--c-i)'));
});

test('la rueda es fiel: n pitas abarcan n radianes, con cualquier radio', () => {
  const { RC, UNO } = P.constantes, ang = p => ((Math.atan2(RC[1] - p[1], p[0] - RC[0]) * 180 / Math.PI) + 360) % 360;
  for (const cm of [20, 30, 40]) for (const n of [0.5, 1, 2, 2.5, 5]) {
    const g = P.geometria({ objeto: 'rueda', radio: cm, pitas: n });
    assert.ok(Math.abs(ang(g.punta) - n * UNO) < 1e-6, `${n} pitas en la rueda de ${cm} cm`);
    // Cada pita mide un radio: el largo del arco de n pitas, sobre la llanta, es n veces el radio del dibujo.
    assert.ok(Math.abs(n * UNO * Math.PI / 180 * g.R - n * g.R) < 1e-9);
  }
  assert.ok(P.tamRueda(40) > P.tamRueda(20), 'la rueda de 40 cm se dibuja más grande');
});

test('pasos: los valores con pasos muestran el último cuyo paso ya llegó', () => {
  const d = { objeto: 'calculadora', modos: [{ nombre: 'DEG', valor: [{ t: '?' }, { t: '27', paso: 2 }], color: 'h' }] };
  assert.ok(P.dibujar(d, { paso: 1 }).includes('>?<') && P.dibujar(d, { paso: 2 }).includes('>27<'));
  const r = { objeto: 'rueda', radio: 30, pitas: [{ v: 1 }, { v: 3.1416, paso: 2 }], rotulo: [{ t: '1 rad' }, { t: 'π rad', paso: 2 }] };
  assert.ok(P.dibujar(r, { paso: 0 }).includes('>1 rad<') && P.dibujar(r, { paso: 2 }).includes('>π rad<'));
});

test('muestras: todo cabe con 4 de margen y ningún rótulo pisa a otro', () => {
  const mal = [];
  for (const [d, e] of casos()) revisar(d, e, d.objeto, mal);
  assert.deepEqual(mal, []);
});

test('todas las figuras de la teoría y del laboratorio que usan la pieza: caben y sus rótulos no se pisan', () => {
  const U = require(path.join(__dirname, '../../../contenido/teoria/trigonometria/angulo-trigonometrico.js'));
  const Teoria = require('../../teoria.js');
  const mal = [], figs = [];
  const toma = (nombre, dib, pieza) => { if (dib && (dib.pieza || pieza) === 'trig-medida') figs.push([nombre, dib.datos, dib.estado || {}]); };
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
    for (let s = 0; s < 60; s++) {
      if (idea.resuelve) { const c = idea.resuelve.generar(s); toma(`${idea.id} resuelve ${s}`, c.dibujo, idea.resuelve.pieza || pz); for (const [i, p] of c.pasos.entries()) toma(`${idea.id} resuelve ${s} paso ${i + 1}`, p.dibujo, idea.resuelve.pieza || pz); }
      if (idea.ahoraTu) { const c = idea.ahoraTu.generar(s); toma(`${idea.id} ahora tú ${s}`, c.dibujo, idea.ahoraTu.pieza || pz); }
    }
  }
  // Las mesas del laboratorio que usan la pieza, en toda su grilla.
  for (const m of U.laboratorio || []) for (const v of Teoria.grilla(m.controles || [])) toma(`mesa ${m.id} ${JSON.stringify(v)}`, m.dibujo(v), m.pieza);
  assert.ok(figs.length > 150, `${figs.length} figuras`);
  for (const [nombre, d, e] of figs) revisar(d, e, nombre, mal);
  assert.deepEqual(mal, []);
});
