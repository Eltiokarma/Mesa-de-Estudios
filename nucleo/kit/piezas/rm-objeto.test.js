// Pruebas de la pieza «rm-objeto»: sin NaN ni colores fijos, pura, de alto fijo para cualquier corte, marcada como
// dibujo de prueba y con texto de 14 o más. Con números (no a ojo; docs/molde-unidad.md §6): todo cabe en el lienzo con 4
// de margen, ningún rótulo pisa a otro ni a un trazo, y las zonas tocables caen sobre su casilla. Los papeles de color
// (✓ violeta, ✗ y repartos tachados en gris) los fija la pieza. Se revisan las muestras de abajo y todas las figuras de
// la teoría que usan la pieza (juego en toda su grilla, Lee, predicción, «Mira» paso a paso, ejemplos, laboratorio, y
// «Así se resuelve» y «Ahora tú» en 200 semillas).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const T = require('../trazo.js');
const P = require('./rm-objeto.js');
const Teoria = require('../../teoria.js');

const P3 = ['Ana', 'Beto', 'Ciro'], D3 = ['fútbol', 'vóley', 'ajedrez'], I3 = ['futbol', 'voley', 'ajedrez'];
const PERM = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
const MUESTRAS = [
  { escena: 'campeonato', cuadro: false, filas: P3, columnas: D3, iconos: I3 },
  { escena: 'campeonato', filas: P3, columnas: D3, iconos: I3, repartos: PERM.map(a => ({ a })), pistas: [], lineas: 3 },
  { escena: 'campeonato', filas: P3, columnas: D3, iconos: I3, marcas: { '0,0': { m: 'si', desde: 3 }, '0,1': { m: 'no', desde: 1 }, '0,2': { m: 'no', nueva: true, desde: 1 }, '1,0': 'no', '2,0': 'no' },
    manos: [{ f: 0, c: 0, desde: 3 }], repartos: PERM.map(a => (a[0] === 0 ? { a } : { a, fuera: 2 })),
    pistas: [{ t: 'Ana no juega vóley.' }, { t: 'Ana no juega ajedrez.', nueva: true }], lineas: 3, nota: [{ t: 'Quedan 2 repartos', desde: 2 }] },
  { escena: 'campeonato', filas: P3, columnas: D3, iconos: I3, toques: { '0,0': 'm00', '2,2': 'm22' }, marcas: { '1,1': 'si' }, manos: [{ f: 1, c: 1 }] },
  { filas: ['Carla', 'Delia', 'Elsa', 'Flor'], columnas: ['médica', 'obstetra', 'dentista', 'técnica'], marcas: { '0,0': 'no', '3,2': 'si' } },
  { filas: ['Lucho', 'Maru', 'Teo'], columnas: ['picarones', 'emoliente', 'choclo'] },
  { filas: ['Raúl', 'Saúl', 'Tito', 'Uriel'], columnas: ['Gaby', 'Hilda', 'Inés', 'Julia'], pistas: [{ t: 'Una pista larga que tiene que partirse en dos renglones para caber en el ancho del cuadro.' }], lineas: 2 },
];

// Las figuras de la teoría que usan la pieza: { donde, datos }.
function deLaTeoria() {
  const def = require('../../../contenido/teoria/razonamiento-matematico/razonamiento-deductivo.js');
  for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
  const out = [], add = (donde, pieza, dib) => { if (dib && dib.datos && pieza === 'rm-objeto') out.push({ donde, datos: dib.datos, estado: dib.estado || {} }); };
  for (const idea of def.ideas) {
    const p = idea.pieza;
    for (const [i, t] of ((idea.lee && idea.lee.tarjetas) || []).entries()) add(`${idea.id} lee ${i + 1}`, t.pieza || p, t.dibujo);
    const j = idea.juega, base = Teoria.inicio(j);
    for (const v of Teoria.grilla(j.controles || [])) add(`${idea.id} juega ${JSON.stringify(v)}`, j.pieza || p, j.dibujo(Object.assign({}, base, v)));
    add(`${idea.id} predice`, idea.predice.pieza || p, idea.predice.dibujo);
    add(`${idea.id} revelar`, idea.predice.pieza || p, idea.predice.revelar);
    for (const [i, paso] of idea.mira.pasos.entries()) add(`${idea.id} mira ${i + 1}`, idea.mira.pieza || p, { datos: idea.mira.datos, estado: paso.estado });
    for (const [i, e] of (idea.ejemplos || []).entries()) if (e.figura) add(`${idea.id} ejemplo ${i + 1}`, e.figura.pieza, e.figura);
    for (let s = 0; s < 200; s++) {
      const a = idea.ahoraTu.generar(s);
      add(`${idea.id} ahora tú ${s}`, idea.ahoraTu.pieza || p, a.dibujo);
      if (a.solucion) add(`${idea.id} ahora tú ${s} solución`, idea.ahoraTu.pieza || p, a.solucion.dibujo);
      if (idea.resuelve) { const r = idea.resuelve.generar(s); add(`${idea.id} resuelve ${s}`, idea.resuelve.pieza || p, r.dibujo); for (const [k, x] of r.pasos.entries()) add(`${idea.id} resuelve ${s} paso ${k + 1}`, idea.resuelve.pieza || p, x.dibujo); }
    }
  }
  for (const m of def.laboratorio || []) {
    if (m.pieza !== 'rm-objeto') continue;
    const base = Teoria.inicio(m), casos = Teoria.grilla(m.controles || []);
    for (let i = 0; i < casos.length; i += Math.max(1, Math.floor(casos.length / 300))) add(`mesa ${m.id} ${JSON.stringify(casos[i])}`, m.pieza, m.dibujo(Object.assign({}, base, casos[i])));
  }
  return out;
}
const TEORIA = deLaTeoria();
const TODAS = MUESTRAS.map((d, k) => ({ donde: `muestra ${k + 1}`, datos: d, estado: {} })).concat(TEORIA);

// Caja de cada elemento del SVG, con medio grosor de trazo. Los textos, con su ancho estimado (T.ancho) y su alto (de
// y − tam·0,8 a y + tam·0,25: y es la línea base). Trazos con comandos absolutos M L A Z (los que usa la pieza).
function cajas(svg) {
  const out = [], num = (a, k) => { const m = a.match(new RegExp(`\\s${k}="(-?[\\d.]+)"`)); return m ? +m[1] : null; };
  for (const m of svg.matchAll(/<(line|rect|circle|path|text)\b([^>]*)>([^<]*)/g)) {
    const [, tag, a, txt] = m, sw = tag === 'text' ? 0 : (num(a, 'stroke-width') || 0) / 2;
    if (/data-toque|fill="transparent"/.test(a)) continue;
    if (tag === 'line') out.push({ tag, x0: Math.min(num(a, 'x1'), num(a, 'x2')) - sw, y0: Math.min(num(a, 'y1'), num(a, 'y2')) - sw, x1: Math.max(num(a, 'x1'), num(a, 'x2')) + sw, y1: Math.max(num(a, 'y1'), num(a, 'y2')) + sw });
    else if (tag === 'rect') out.push({ tag, x0: num(a, 'x') - sw, y0: num(a, 'y') - sw, x1: num(a, 'x') + num(a, 'width') + sw, y1: num(a, 'y') + num(a, 'height') + sw, cuadro: /fill="var\(--card\)" stroke="currentColor" stroke-opacity="0.45"/.test(a) || /data-marca="fila-segura"|stroke-opacity="0.3"/.test(a) });
    else if (tag === 'circle') { const r = num(a, 'r'); out.push({ tag, x0: num(a, 'cx') - r - sw, y0: num(a, 'cy') - r - sw, x1: num(a, 'cx') + r + sw, y1: num(a, 'cy') + r + sw }); }
    else if (tag === 'path') {
      const d = (a.match(/\sd="([^"]+)"/) || [])[1] || '';
      assert.ok(!/[a-z]/.test(d), `trazo relativo en ${m[0].slice(0, 60)}`);
      const xs = [], ys = [];
      for (const seg of d.matchAll(/([MLA])([^MLAZ]*)/g)) {
        const v = seg[2].trim().split(/[\s,]+/).map(Number), ps = seg[1] === 'A' ? [v[5], v[6]] : v;
        for (let i = 0; i + 1 < ps.length; i += 2) { xs.push(ps[i]); ys.push(ps[i + 1]); }
      }
      if (xs.length) out.push({ tag, x0: Math.min(...xs) - sw, y0: Math.min(...ys) - sw, x1: Math.max(...xs) + sw, y1: Math.max(...ys) + sw });
    } else {
      const tam = num(a, 'font-size') || 16, peso = num(a, 'font-weight') || 400, t = txt.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
      const w = T.ancho(t, tam, peso), x = num(a, 'x'), y = num(a, 'y');
      const anc = (a.match(/text-anchor="(\w+)"/) || [])[1] || 'start', x0 = anc === 'middle' ? x - w / 2 : anc === 'end' ? x - w : x;
      out.push({ tag, x0, y0: y - tam * 0.8, x1: x0 + w, y1: y + tam * 0.25, txt: t });
    }
  }
  return out;
}
const pisa = (a, b, h = 0.5) => a.x0 < b.x1 - h && b.x0 < a.x1 - h && a.y0 < b.y1 - h && b.y0 < a.y1 - h;
// Los cortes que usa una figura (estado del caso y todos los desde/hasta de sus datos).
const cortes = (d, e) => [...new Set([e.corte || 0, 0, 1, 2, 3, 4, 5])];

test('hay figuras de la teoría (la prueba no corre en vacío)', () => assert.ok(TEORIA.length > 800, `${TEORIA.length} figuras`));

test('limpia: sin NaN, sin colores fijos, sin ids ni scripts, texto de 14 o más, pura y con texto alternativo', () => {
  for (const { donde, datos, estado } of TODAS) {
    const s = P.dibujar(datos, estado);
    assert.ok(!/NaN|undefined|null|Infinity/.test(s), donde);
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), `${donde}: color fijo`);
    assert.ok(!/<script|\son[a-z]+\s*=|\sid=/i.test(s), donde);
    for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14, `${donde}: texto de ${t}`);
    assert.equal(s, P.dibujar(datos, estado), `${donde}: no es pura`);
    assert.ok(P.alt(datos).length > 30, donde);
  }
});

test('el alto no cambia con el corte y la escena va marcada como dibujo de prueba', () => {
  for (const { donde, datos, estado } of TODAS) {
    const altos = new Set(cortes(datos, estado).map(c => P.dibujar(datos, { corte: c }).match(/viewBox="0 0 320 ([\d.]+)"/)[1]));
    assert.equal(altos.size, 1, donde);
    if (datos.escena) assert.match(P.dibujar(datos, estado), /data-objeto="campeonato" data-prueba="si"/, donde);
  }
});

test('todo cabe en el lienzo con 4 de margen, en todos los cortes', () => {
  for (const { donde, datos, estado } of TODAS) for (const c of cortes(datos, estado)) {
    const s = P.dibujar(datos, { corte: c }), alto = +s.match(/viewBox="0 0 320 ([\d.]+)"/)[1];
    for (const b of cajas(s)) assert.ok(b.x0 >= 3.99 && b.x1 <= 316.01 && b.y0 >= 3.99 && b.y1 <= alto - 3.99, `${donde} (corte ${c}): ${b.tag} ${b.txt || ''} fuera [${b.x0.toFixed(1)}, ${b.y0.toFixed(1)}, ${b.x1.toFixed(1)}, ${b.y1.toFixed(1)}] de 320 × ${alto}`);
  }
});

test('ningún rótulo pisa a otro rótulo ni a un trazo (salvo la rejilla y los marcos que lo contienen)', () => {
  for (const { donde, datos, estado } of TODAS) for (const c of cortes(datos, estado)) {
    const bs = cajas(P.dibujar(datos, { corte: c })), txt = bs.filter(b => b.tag === 'text'), otros = bs.filter(b => b.tag !== 'text' && !b.cuadro);
    for (let i = 0; i < txt.length; i++) {
      for (let j = i + 1; j < txt.length; j++) assert.ok(!pisa(txt[i], txt[j]), `${donde} (corte ${c}): «${txt[i].txt}» pisa «${txt[j].txt}»`);
      for (const o of otros) assert.ok(!pisa(txt[i], o), `${donde} (corte ${c}): «${txt[i].txt}» pisa un ${o.tag} [${o.x0.toFixed(1)}, ${o.y0.toFixed(1)}, ${o.x1.toFixed(1)}, ${o.y1.toFixed(1)}]`);
    }
  }
});

test('papeles de color fijos: ✓ violeta, ✗ y repartos tachados en gris (tinta al 55 %), y ni verde ni carmín', () => {
  assert.deepEqual(P.PAPELES, { seguro: 'f', descartado: 'tenue', amarra: 'tinta', nueva: 'tinta' });
  for (const { donde, datos } of TODAS) for (const c of [0, 5]) {
    const s = P.dibujar(datos, { corte: c });
    assert.ok(!/var\(--c-[dh]\)/.test(s), `${donde}: verde o carmín`);
    for (const [m] of s.matchAll(/<path data-marca="si"[^>]*>/g)) assert.match(m, /stroke="var\(--c-f\)"/, donde);
    for (const [m] of s.matchAll(/<g data-marca="no"[^>]*>(?:<line[^>]*>){2}/g)) { assert.match(m, /opacity="0.55"/, donde); assert.ok(!/var\(--c-/.test(m), `${donde}: ✗ con color`); }
    for (const [m] of s.matchAll(/<g data-reparto="fuera"[^>]*>/g)) assert.match(m, /opacity="0.55"/, donde);
    // El violeta solo marca lo seguro: la ✓ y su fila en el panel de repartos.
    const violetas = (s.match(/var\(--c-f\)/g) || []).length, marcas = (s.match(/data-marca="(si|fila-segura)"/g) || []).length;
    assert.equal(violetas, marcas, `${donde}: violeta fuera de lo seguro`);
  }
});

test('las zonas tocables caen sobre su casilla y nombran su control', () => {
  const d = MUESTRAS[3], g = P.geometria(d), s = P.dibujar(d);
  for (const [k, ctl] of Object.entries(d.toques)) {
    const [f, c] = k.split(',').map(Number), p = g.centro(f, c);
    const m = s.match(new RegExp(`data-toque="${ctl}" x="([\\d.]+)" y="([\\d.]+)" width="([\\d.]+)" height="([\\d.]+)"`));
    assert.ok(m, ctl);
    assert.ok(p.x > +m[1] && p.x < +m[1] + +m[3] && p.y > +m[2] && p.y < +m[2] + +m[4], `${ctl} no cae en su casilla`);
  }
});

test('los textos de la cabecera caben en su columna en 14 px (cuadros de 4 columnas)', () => {
  for (const { donde, datos } of TODAS) {
    if (datos.iconos || !datos.columnas) continue;
    const g = P.geometria(datos);
    for (const t of datos.columnas) assert.ok(T.ancho(t, 14, 700) <= g.cw + 4, `${donde}: «${t}» no cabe en ${g.cw.toFixed(1)}`);
  }
});
