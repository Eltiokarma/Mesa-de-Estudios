// Pruebas de la pieza «trig-arco» (los objetos de «Longitud de arco y sector circular»): cada objeto se dibuja sin NaN ni
// colores fijos, es puro, de alto fijo, marcado como dibujo de prueba y con su texto alternativo. Con números
// (docs/molde-unidad.md §6): todo cabe en el lienzo con 4 de margen y ningún rótulo pisa a otro, en las muestras y en todas
// las figuras de la teoría y del laboratorio que usan la pieza. Y es fiel: el arco del asiento termina en el asiento, y la
// marca de la rueda gira lo que avanza.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../kit.js');
const T = require('../trazo.js');
const P = require('./trig-arco.js');

const MUESTRAS = {
  columpio: { r: 2, t: 0.75, rot: { r: 'r = 2 m', s: 's = 1,5 m', t: 'θ = 0,75 rad' } },
  abanico: { r: 20, g: 90, rot: { r: 'r = 20 cm', s: 's = 10π cm', t: 'θ = 90°', A: 'A = 100π cm²' } },
  limpia: { r2: 60, h: 30, g: 120, rot: { r1: 'r₁ = 30 cm', r2: 'r₂ = 60 cm', h: 'h = 30 cm', s1: 's₁ = 20π cm', s2: 's₂ = 40π cm', t: '120°' } },
  rueda: { r: 0.3, n: 1.5, k: 63, rot: { r: 'r = 0,3 m', d: 'd = 0,9π m' } },
  monedas: { pos: [0, 90, 180, 270], camino: true, rot: { fija: 'fija', camino: 'camino del centro' } },
  bici: { r1: 10, r2: 5, n1: 1, rot: { r1: 'r₁ = 10 cm', r2: 'r₂ = 5 cm', n1: 'n₁ = 1', n2: 'n₂ = 2' } },
  engranajes: { r1: 3, r2: 2, g1: 60, rot: { r1: 'r₁ = 3 cm', r2: 'r₂ = 2 cm', t1: '60°', t2: '?' } },
  figura: { g: 90, r1: 0.5, area: true, rot: { r: 'r₂ = 8 cm', r1: 'r₁ = 4 cm', h: 'h', s: 's₂', s1: 's₁', t: '90°', A: 'A = ?' } },
};
const VARIANTES = [
  { objeto: 'columpio', r: 2.5, t: 1.25, rot: { r: 'r = 2,5 m', s: 's = 3,125 m', t: 'θ = 1,25 rad' } },
  { objeto: 'columpio', r: 1, t: 0.1, rot: { r: 'r = 1 m', s: 's = 0,1 m', t: 'θ = 0,1 rad' } },
  { objeto: 'abanico', r: 20, g: 180, rot: { r: 'r = 20 cm', s: 's = 20π cm', t: 'θ = 180°', A: 'A = 200π cm²' } },
  { objeto: 'abanico', r: 20, g: 90, rot: { r: 'r = 20 cm', t: 'θ' }, otro: { r: 40, rot: { r: '40 cm', s: '20π cm', A: '400π cm²' } } },
  { objeto: 'limpia', r2: 40, h: 35, g: 120, k: 2.5, rot: { r1: 'r₁ = 5 cm', r2: 'r₂ = 40 cm', h: 'h = 35 cm', s1: 's₁ = 10π/3 cm', s2: 's₂ = 80π/3 cm', t: '120°' } },
  { objeto: 'rueda', r: 0.4, n: 1.5, k: 63, rot: { r: 'r = 0,4 m', d: 'd = 1,2π m' } },
  { objeto: 'rueda', r: 0.3, n: 0.25, k: 63, rot: { r: 'r = 0,3 m', d: 'd = 0,15π m' } },
  { objeto: 'bici', r1: 10, r2: 5, n1: 1, rueda: 'punteada', r3: 30, rot: { r2: 'r₂ = 5 cm', r3: 'r₃ = 30 cm', n2: 'n₂ = 2', n3: 'n₃ = ?' } },
  { objeto: 'figura', g: 240, area: true, circulo: true, rot: { r: 'r = 3 cm', s: 's = 4π cm', t: 'θ', A: 'A = ?' } },
  { objeto: 'figura', g: 20, rot: { r: 'r = 45 cm', s: 's = ?', t: '20°' } },
];
const casos = () => Object.entries(MUESTRAS).map(([o, d]) => [Object.assign({ objeto: o }, d), {}]).concat(VARIANTES.map(d => [d, {}]));

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
  const s = P.dibujar(d, e), { W, M } = P.constantes, H = +(s.match(/viewBox="0 0 \d+ (\d+)"/) || [0, 300])[1];
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

test('registrada en el kit', () => assert.equal(Kit.piezas['trig-arco'], P));

test('cada objeto: sin NaN ni colores fijos, puro, alto fijo, marcado de prueba, con su texto alternativo y sin verde', () => {
  assert.deepEqual([...P.OBJETOS].sort(), Object.keys(MUESTRAS).sort());
  for (const [d, e] of casos()) {
    const s = P.dibujar(d, e);
    assert.ok(!/NaN|undefined|Infinity/.test(s), d.objeto);
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), `${d.objeto}: sin colores fijos`);
    assert.ok(!/var\(--c-d\)/.test(s), `${d.objeto}: sin verde`);
    assert.ok(!/\sid="|filter|<image/.test(s), `${d.objeto}: sin ids, filtros ni imágenes`);
    assert.equal(s, P.dibujar(d, e), `${d.objeto}: puro`);
    assert.match(s, /data-objeto="[a-z]+" data-prueba="si"/);
    assert.match(s, d.objeto === 'rueda' ? /viewBox="0 0 320 160"/ : /viewBox="0 0 320 300"/);
    assert.ok(P.alt(d).length > 20 && !/undefined|NaN/.test(P.alt(d)), d.objeto);
  }
});

test('es fiel: el asiento está al final de la cadena y del arco; la marca gira n vueltas; la rueda avanza 2πr por vuelta', () => {
  const RAD = Math.PI / 180;
  for (const r of [1.5, 2, 2.5]) for (const t of [0.25, 0.75, 1.25]) {
    const g = P.geometria({ objeto: 'columpio', r, t });
    const esp = [g.centro[0] + g.R * Math.sin(t), g.centro[1] + g.R * Math.cos(t)];
    assert.ok(Math.hypot(g.asiento[0] - esp[0], g.asiento[1] - esp[1]) < 1e-9, `columpio ${r} m, ${t} rad`);
    assert.ok(Math.abs(g.R - r * P.constantes.KC) < 1e-9, 'una sola escala para las cadenas');
  }
  for (const r of [0.3, 0.35, 0.4]) for (const n of [0.25, 1, 1.5]) {
    const g = P.geometria({ objeto: 'rueda', r, n, k: 63 });
    assert.ok(Math.abs((g.centro[0] - g.inicio[0]) - n * 2 * Math.PI * r * 63) < 1e-9, 'avanza 2πr por vuelta');
    const a = Math.atan2(g.centro[1] - g.marca[1], g.marca[0] - g.centro[0]) / RAD;
    assert.ok(Math.abs((((a - (-90 - n * 360)) % 360) + 360) % 360) < 1e-6 || Math.abs((((a - (-90 - n * 360)) % 360) + 360) % 360 - 360) < 1e-6, `la marca gira ${n} vueltas`);
  }
  const b = P.geometria({ objeto: 'bici', r1: 10, r2: 5, n1: 1 });
  assert.ok(Math.abs(b.g2 / b.g1 - 2) < 1e-9, 'el piñón de la mitad del radio gira el doble');
});

test('muestras: todo cabe con 4 de margen y ningún rótulo pisa a otro', () => {
  const mal = [];
  for (const [d, e] of casos()) revisar(d, e, d.objeto, mal);
  assert.deepEqual(mal, []);
});

test('todas las figuras de la teoría y del laboratorio que usan la pieza: caben y sus rótulos no se pisan', () => {
  const U = require(path.join(__dirname, '../../../contenido/teoria/trigonometria/longitud-de-arco-y-sector.js'));
  const Teoria = require('../../teoria.js');
  const mal = [], figs = [];
  const toma = (nombre, dib, pieza) => { if (dib && (dib.pieza || pieza) === 'trig-arco') figs.push([nombre, dib.datos, dib.estado || {}]); };
  for (const idea of U.ideas) {
    const pz = idea.pieza, j = idea.juega;
    for (const v of Teoria.grilla(j.controles || [])) toma(`${idea.id} juego ${JSON.stringify(v)}`, j.dibujo(Object.assign({}, Teoria.inicio(j), v)), j.pieza || pz);
    for (const t of (idea.lee && idea.lee.tarjetas) || []) toma(`${idea.id} lee`, t.dibujo, t.pieza || pz);
    toma(`${idea.id} predice`, idea.predice.dibujo, idea.predice.pieza || pz); toma(`${idea.id} revelar`, idea.predice.revelar, idea.predice.pieza || pz);
    idea.mira.pasos.forEach((ps, i) => toma(`${idea.id} mira ${i + 1}`, { datos: idea.mira.datos, estado: ps.estado || {} }, idea.mira.pieza || pz));
    if (idea.regla.dibujo) toma(`${idea.id} regla`, idea.regla.dibujo, pz);
    for (const [k, ej] of (idea.ejemplos || []).entries()) if (ej.figura) toma(`${idea.id} ejemplo ${k + 1}`, ej.figura, ej.figura.pieza);
    for (let s = 0; s < 120; s++) {
      const c = idea.resuelve.generar(s); toma(`${idea.id} resuelve ${s}`, c.dibujo, idea.resuelve.pieza || pz);
      for (const [i, p] of c.pasos.entries()) toma(`${idea.id} resuelve ${s} paso ${i + 1}`, p.dibujo, idea.resuelve.pieza || pz);
      const a = idea.ahoraTu.generar(s); toma(`${idea.id} ahora tú ${s}`, a.dibujo, idea.ahoraTu.pieza || pz);
    }
  }
  for (const m of U.laboratorio || []) for (const v of Teoria.grilla(m.controles || [])) toma(`mesa ${m.id} ${JSON.stringify(v)}`, m.dibujo(v), m.pieza);
  assert.ok(figs.length > 500, `${figs.length} figuras`);
  for (const [nombre, d, e] of figs) revisar(d, e, nombre, mal);
  assert.deepEqual(mal.slice(0, 30), [], `${mal.length} faltas`);
});
