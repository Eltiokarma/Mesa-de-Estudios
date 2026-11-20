// Pruebas de la pieza «trig-pos» (el plano de trig-plano con un objeto de fondo, para «Ángulos en posición normal»):
// cada objeto se dibuja sin NaN ni colores fijos, es puro, marcado como dibujo de prueba y con su texto alternativo. Con
// números (docs/molde-unidad.md §6): en las muestras y en todas las figuras de la teoría (con «Ahora tú» y «Así se
// resuelve» en 120 semillas, la grilla de los juegos y del laboratorio), los rótulos quedan dentro del lienzo con 4 de
// margen y ninguno pisa a otro.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../kit.js');
const T = require('../trazo.js');
const P = require('./trig-pos.js');

const MUESTRAS = [
  { ventana: { x: [-5, 5], y: [-5, 5] }, objeto: { tipo: 'plano', casa: [-3, 4] }, segmentos: [{ de: [0, 0], a: [-3, 4] }], puntos: [{ x: -3, y: 4, rotulo: 'P' }] },
  { ventana: { x: [-14, 14], y: [-14, 14] }, objeto: { tipo: 'rueda', r: 10, cabina: 135 } },
  { ventana: { x: [-64, 64], y: [-64, 64] }, objeto: { tipo: 'veleta', r: 40, flecha: 90 } },
  { ventana: { x: [-6.4, 6.4], y: [-6.4, 6.4] }, objeto: { tipo: 'reloj', r: 5 } },
  { ventana: { x: [-5.4, 5.4], y: [-5.4, 5.4] }, objeto: { tipo: 'bici', r: 4, valvula: 45 } },
];

// Las cajas de los textos de un SVG: [x0, y0, x1, y1, texto].
function cajas(svg) {
  const out = [];
  for (const m of svg.matchAll(/<text[^>]*?x="([-\d.]+)" y="([-\d.]+)"[^>]*?font-size="([\d.]+)"([^>]*)>([^<]*)<\/text>/g)) {
    const x = +m[1], y = +m[2], tam = +m[3], resto = m[4], texto = m[5].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    const peso = /font-weight="700"/.test(resto) ? 700 : 400, ancla = (resto.match(/text-anchor="(\w+)"/) || [])[1] || 'start';
    const w = T.ancho(texto, tam, peso), x0 = ancla === 'middle' ? x - w / 2 : ancla === 'end' ? x - w : x;
    out.push([x0, y - 0.72 * tam, x0 + w, y + 0.18 * tam, texto]);
  }
  return out;
}
const tamano = svg => { const m = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/); return [+m[1], +m[2]]; };
function revisarRotulos(svg) {
  const [W, H] = tamano(svg), cs = cajas(svg), malos = [];
  for (const c of cs) if (c[0] < 4 - 1e-6 || c[2] > W - 4 + 1e-6 || c[1] < 4 - 1e-6 || c[3] > H - 4 + 1e-6) malos.push(`«${c[4]}» se sale (${c.slice(0, 4).map(v => Math.round(v)).join(', ')})`);
  for (let i = 0; i < cs.length; i++) for (let j = i + 1; j < cs.length; j++) {
    const a = cs[i], b = cs[j], dx = Math.min(a[2], b[2]) - Math.max(a[0], b[0]), dy = Math.min(a[3], b[3]) - Math.max(a[1], b[1]);
    if (dx > 1 && dy > 1) malos.push(`«${a[4]}» pisa «${b[4]}»`);
  }
  return malos;
}

// Figuras de la teoría (la unidad entera) en trig-pos.
function teoria() {
  const RAIZ = path.join(__dirname, '..', '..', '..');
  const def = require(path.join(RAIZ, 'contenido/teoria/trigonometria/angulos-en-posicion-normal.js'));
  const Teoria = require(path.join(RAIZ, 'nucleo/teoria.js'));
  const out = [];
  const add = (d, fig, pieza) => { if (fig && fig.datos && (fig.pieza || pieza) === 'trig-pos') out.push([d, fig.datos, fig.estado || {}]); };
  for (const idea of def.ideas) {
    const pz = idea.pieza;
    (idea.lee.tarjetas || []).forEach((t, k) => add(`${idea.id} lee ${k}`, t.dibujo, t.pieza || pz));
    for (const v of Teoria.grilla(idea.juega.controles)) add(`${idea.id} juego ${JSON.stringify(v)}`, idea.juega.dibujo(v), pz);
    add(`${idea.id} predice`, idea.predice.dibujo, pz); add(`${idea.id} revelar`, idea.predice.revelar, pz);
    idea.mira.pasos.forEach((p, k) => add(`${idea.id} mira ${k}`, { datos: idea.mira.datos, estado: p.estado }, pz));
    add(`${idea.id} regla`, idea.regla.dibujo, pz);
    (idea.ejemplos || []).forEach((e, k) => add(`${idea.id} ejemplo ${k + 1}`, e.figura, pz));
    for (let s = 0; s < 120; s++) {
      const r = idea.resuelve.generar(s), a = idea.ahoraTu.generar(s);
      add(`${idea.id} resuelve ${s}`, r.dibujo, pz); r.pasos.forEach(p => add(`${idea.id} resuelve ${s}`, p.dibujo, pz));
      add(`${idea.id} ahora ${s}`, a.dibujo, pz); if (a.solucion) add(`${idea.id} ahora ${s} solución`, a.solucion.dibujo, pz);
    }
  }
  for (const m of def.laboratorio.filter(m => m.pieza === 'trig-pos')) for (const v of Teoria.grilla(m.controles)) add(`mesa ${m.id} ${JSON.stringify(v)}`, m.dibujo(v), 'trig-pos');
  return out;
}

test('cada objeto: SVG sano, puro, con data-prueba y texto alternativo; solo currentColor y var(--c-*)', () => {
  assert.equal(Kit.piezas['trig-pos'], P);
  for (const d of MUESTRAS) {
    const svg = P.dibujar(d, {});
    assert.ok(!/NaN|undefined|Infinity/.test(svg), d.objeto.tipo);
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(svg), `${d.objeto.tipo}: color fijo`);
    assert.match(svg, new RegExp(`data-objeto="${d.objeto.tipo}" data-prueba="si"`));
    assert.match(svg, /role="img" aria-label="[^"]{20,}"/);
    assert.equal(svg, P.dibujar(d, {}), 'pura');
    assert.deepEqual(revisarRotulos(svg), [], d.objeto.tipo);
  }
  assert.deepEqual([...P.OBJETOS].sort(), ['bici', 'plano', 'reloj', 'rueda', 'veleta']);
});

test('el objeto va detrás: el primer hijo del SVG es la capa del objeto', () => {
  for (const d of MUESTRAS) assert.match(P.dibujar(d, {}), /^<svg[^>]*><g class="kit-objeto"/);
  const sin = P.dibujar({ ventana: { x: [-2, 2], y: [-2, 2] } }, {});
  assert.ok(!/kit-objeto/.test(sin), 'sin objeto es trig-plano tal cual');
});

test('todas las figuras de la teoría: rótulos dentro del lienzo con 4 de margen y sin pisarse', () => {
  const malos = [];
  const figs = teoria();
  assert.ok(figs.length > 1500, `${figs.length} figuras`);
  const vistos = new Set();
  for (const [donde, datos, estado] of figs) {
    const svg = P.dibujar(datos, estado);
    if (vistos.has(svg)) continue;
    vistos.add(svg);
    assert.ok(!/NaN|undefined|Infinity/.test(svg), donde);
    for (const m of revisarRotulos(svg)) malos.push(`${donde}: ${m}`);
  }
  assert.deepEqual(malos.slice(0, 40), [], `${malos.length} rótulos con problemas`);
});

module.exports = { cajas, revisarRotulos };

// Cierre (20 nov): el rótulo de un ángulo no pisa los ejes, el lado final, los tramos x e y ni los rayos; el arco se ve
// (20 px de radio o más) y termina en su ángulo; la rueda no tiene líneas que salgan del centro hacia abajo (sus patas
// parecían lados finales) y la veleta escribe los puntos cardinales en palabras (la «O» se leía como cero).
test('cierre: rótulos de ángulos fuera de los ejes y las líneas, y arcos que se ven, en todas las figuras de la teoría', () => {
  const TP = require('./trig-plano.js'), malos = [];
  const corta = (x1, y1, x2, y2, c) => {
    const [l, t, r, b] = c, dentro = (x, y) => x >= l && x <= r && y >= t && y <= b;
    if (dentro(x1, y1) || dentro(x2, y2)) return true;
    const cr = (ax, ay, bx, by, cx, cy, dx, dy) => { const d = (bx - ax) * (dy - cy) - (by - ay) * (dx - cx); if (Math.abs(d) < 1e-12) return false; const u = ((cx - ax) * (dy - cy) - (cy - ay) * (dx - cx)) / d, v = ((cx - ax) * (by - ay) - (cy - ay) * (bx - ax)) / d; return u >= 0 && u <= 1 && v >= 0 && v <= 1; };
    return [[l, t, r, t], [r, t, r, b], [r, b, l, b], [l, b, l, t]].some(q => cr(x1, y1, x2, y2, ...q));
  };
  for (const [d, datos, estado] of teoria()) {
    const svg = P.dibujar(datos, estado), g = TP.geometria(datos), corte = estado.corte || 0, ve = e => (e.desde || 0) <= corte && !(e.hasta < corte);
    const lineas = [[g.x0 - 4, g.Y(0), g.x1 + 12, g.Y(0)], [g.X(0), g.y1 + 4, g.X(0), g.y0 - 12]]
      .concat((datos.segmentos || []).filter(ve).map(s => [g.X(s.de[0]), g.Y(s.de[1]), g.X(s.a[0]), g.Y(s.a[1])]))
      .concat((datos.rayos || []).filter(ve).map(r => [g.X(0), g.Y(0), g.X((r.largo || 1) * Math.cos(r.ang * Math.PI / 180)), g.Y((r.largo || 1) * Math.sin(r.ang * Math.PI / 180))]));
    for (const m of svg.matchAll(/<text[^>]*x="([-\d.]+)" y="([-\d.]+)" fill="var\(--c-h\)" font-size="([\d.]+)"([^>]*)>([^<]*)<\/text>/g)) {
      const ancla = (m[4].match(/text-anchor="(\w+)"/) || [])[1] || 'start', w = T.ancho(m[5], +m[3], 700), x0 = ancla === 'middle' ? +m[1] - w / 2 : ancla === 'end' ? +m[1] - w : +m[1];
      const c = [x0 - 1, +m[2] - 0.72 * +m[3] - 1, x0 + w + 1, +m[2] + 0.18 * +m[3] + 1];
      if (lineas.some(l => corta(...l, c))) malos.push(`${d}: «${m[5]}» pisa una línea`);
    }
    for (const p of svg.matchAll(/<path class="kit-aparece[^"]*" d="M([-\d.]+) ([-\d.]+)L[^"]*" fill="none" stroke="var\(--c-h\)"/g))
      if (Math.hypot(+p[1] - g.X(0), +p[2] - g.Y(0)) < 19.5 && !/lab|mesa/.test(d)) malos.push(`${d}: arco de ${Math.hypot(+p[1] - g.X(0), +p[2] - g.Y(0)).toFixed(1)} px`);
  }
  assert.deepEqual(malos.slice(0, 12), [], `${malos.length} problemas`);
});

test('cierre: la rueda no saca líneas del centro hacia abajo y la veleta escribe los puntos cardinales', () => {
  const rueda = P.dibujar(MUESTRAS[1], {}), g = require('./trig-plano.js').geometria(MUESTRAS[1]);
  const X0 = g.X(0), Y0 = g.Y(0);
  for (const l of rueda.matchAll(/<line x1="([-\d.]+)" y1="([-\d.]+)" x2="([-\d.]+)" y2="([-\d.]+)"[^>]*stroke-width="3"/g))
    assert.ok(Math.hypot(+l[1] - X0, +l[2] - Y0) > 20, 'una pata sale del centro');
  assert.ok(!/<path d="M[-\d.]+ [-\d.]+L[-\d.]+ [-\d.]+L[-\d.]+ [-\d.]+"[^>]*stroke-width="3"/.test(rueda), 'patas en V desde el centro');
  const veleta = P.dibujar(MUESTRAS[2], {});
  for (const w of ['norte', 'este', 'sur', 'oeste']) assert.match(veleta, new RegExp(`>${w}</text>`));
  assert.ok(!/>O<\/text>/.test(veleta));
});
