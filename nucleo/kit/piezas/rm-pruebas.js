/*
 * Ayuda común de las pruebas de las piezas de razonamiento deductivo (rm-objeto, rm-aros, rm-casos, rm-familia).
 * No es una prueba: la usan los *.test.js de esas piezas. Revisa con números (no a ojo; docs/molde-unidad.md §6) que todo
 * cabe en el lienzo con 4 de margen y que ningún rótulo pisa a otro ni a un trazo, en todas las figuras de la teoría que
 * usan la pieza (Lee, juego en toda su grilla, predicción, «Mira» paso a paso, ejemplos, laboratorio, y «Así se
 * resuelve» y «Ahora tú» en 200 semillas).
 *
 * Cajas: cada elemento del SVG con medio grosor de trazo. Los textos, con su ancho estimado (T.ancho) y su alto (de
 * y − tam·0,8 a y + tam·0,25); un texto con transform="rotate(-90 x y)" se gira (sube desde su punto). Los trazos con
 * comandos absolutos M L A Z. Se saltan las zonas tocables y lo que se marca data-caja="si" (un marco o un fondo que
 * contiene rótulos a propósito: la rejilla del cuadro, el cartel de la combi, el marco de la foto).
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const T = require('../trazo.js');
const Teoria = require('../../teoria.js');

function cajas(svg) {
  const out = [], num = (a, k) => { const m = a.match(new RegExp(`\\s${k}="(-?[\\d.]+)"`)); return m ? +m[1] : null; };
  for (const m of svg.matchAll(/<(line|rect|circle|ellipse|path|text)\b([^>]*)>([^<]*)/g)) {
    const [, tag, a, txt] = m, sw = tag === 'text' ? 0 : (num(a, 'stroke-width') || 0) / 2;
    if (/data-toque|fill="transparent"/.test(a)) continue;
    const caja = /data-caja="si"/.test(a);
    if (tag === 'line') out.push({ tag, caja, x0: Math.min(num(a, 'x1'), num(a, 'x2')) - sw, y0: Math.min(num(a, 'y1'), num(a, 'y2')) - sw, x1: Math.max(num(a, 'x1'), num(a, 'x2')) + sw, y1: Math.max(num(a, 'y1'), num(a, 'y2')) + sw });
    else if (tag === 'rect') out.push({ tag, caja, x0: num(a, 'x') - sw, y0: num(a, 'y') - sw, x1: num(a, 'x') + num(a, 'width') + sw, y1: num(a, 'y') + num(a, 'height') + sw });
    else if (tag === 'circle') { const r = num(a, 'r'); out.push({ tag, caja, x0: num(a, 'cx') - r - sw, y0: num(a, 'cy') - r - sw, x1: num(a, 'cx') + r + sw, y1: num(a, 'cy') + r + sw }); }
    else if (tag === 'ellipse') { const rx = num(a, 'rx'), ry = num(a, 'ry'); out.push({ tag, caja, x0: num(a, 'cx') - rx - sw, y0: num(a, 'cy') - ry - sw, x1: num(a, 'cx') + rx + sw, y1: num(a, 'cy') + ry + sw }); }
    else if (tag === 'path') {
      const d = (a.match(/\sd="([^"]+)"/) || [])[1] || '';
      assert.ok(!/[a-z]/.test(d), `trazo relativo en ${m[0].slice(0, 60)}`);
      const xs = [], ys = [];
      for (const seg of d.matchAll(/([MLA])([^MLAZ]*)/g)) {
        const v = seg[2].trim().split(/[\s,]+/).map(Number), ps = seg[1] === 'A' ? [v[5], v[6]] : v;
        for (let i = 0; i + 1 < ps.length; i += 2) { xs.push(ps[i]); ys.push(ps[i + 1]); }
      }
      if (xs.length) out.push({ tag, caja, x0: Math.min(...xs) - sw, y0: Math.min(...ys) - sw, x1: Math.max(...xs) + sw, y1: Math.max(...ys) + sw });
    } else {
      const tam = num(a, 'font-size') || 16, peso = num(a, 'font-weight') || 400, t = txt.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
      const w = T.ancho(t, tam, peso), x = num(a, 'x'), y = num(a, 'y');
      const anc = (a.match(/text-anchor="(\w+)"/) || [])[1] || 'start', x0 = anc === 'middle' ? x - w / 2 : anc === 'end' ? x - w : x;
      if (/transform="rotate\(-90 /.test(a)) {
        // Girado −90° alrededor de (x, y): el texto sube desde y; sus letras quedan a la izquierda de x.
        const a0 = x0 - x;
        out.push({ tag, caja, x0: x - tam * 0.8, y0: y - (a0 + w), x1: x + tam * 0.25, y1: y - a0, txt: t });
      } else out.push({ tag, caja, x0, y0: y - tam * 0.8, x1: x0 + w, y1: y + tam * 0.25, txt: t });
    }
  }
  return out;
}
const pisa = (a, b, h = 0.5) => a.x0 < b.x1 - h && b.x0 < a.x1 - h && a.y0 < b.y1 - h && b.y0 < a.y1 - h;
const altoDe = s => +s.match(/viewBox="0 0 320 ([\d.]+)"/)[1];

// Todas las figuras de la unidad que usan una pieza: { donde, datos, estado, antes }. antes: la ve el alumno antes de
// responder (Lee, el planteamiento de Predice, los ejemplos y los enunciados de los ejercicios).
function deLaTeoria(id, semillas = 200) {
  const def = require('../../../contenido/teoria/razonamiento-matematico/razonamiento-deductivo.js');
  for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
  const out = [], add = (donde, pieza, dib, antes) => { if (dib && dib.datos && pieza === id) out.push({ donde, datos: dib.datos, estado: dib.estado || {}, antes: !!antes }); };
  for (const idea of def.ideas) {
    const p = idea.pieza;
    for (const [i, t] of ((idea.lee && idea.lee.tarjetas) || []).entries()) add(`${idea.id} lee ${i + 1}`, t.pieza || p, t.dibujo, true);
    const j = idea.juega, base = Teoria.inicio(j);
    for (const v of Teoria.grilla(j.controles || [])) add(`${idea.id} juega ${JSON.stringify(v)}`, j.pieza || p, j.dibujo(Object.assign({}, base, v)));
    add(`${idea.id} predice`, idea.predice.pieza || p, idea.predice.dibujo, true);
    add(`${idea.id} revelar`, idea.predice.pieza || p, idea.predice.revelar);
    for (const [i, paso] of idea.mira.pasos.entries()) add(`${idea.id} mira ${i + 1}`, idea.mira.pieza || p, { datos: idea.mira.datos, estado: Object.assign({}, idea.mira.base || {}, paso.estado) });
    for (const [i, e] of (idea.ejemplos || []).entries()) if (e.figura) add(`${idea.id} ejemplo ${i + 1}`, e.figura.pieza, e.figura, true);
    for (let s = 0; s < semillas; s++) {
      const a = idea.ahoraTu.generar(s);
      add(`${idea.id} ahora tú ${s}`, idea.ahoraTu.pieza || p, a.dibujo, true);
      if (a.solucion) add(`${idea.id} ahora tú ${s} solución`, idea.ahoraTu.pieza || p, a.solucion.dibujo);
      if (idea.resuelve) {
        const r = idea.resuelve.generar(s);
        add(`${idea.id} resuelve ${s}`, idea.resuelve.pieza || p, r.dibujo, true);
        for (const [k, x] of r.pasos.entries()) add(`${idea.id} resuelve ${s} paso ${k + 1}`, idea.resuelve.pieza || p, x.dibujo);
      }
    }
  }
  for (const m of def.laboratorio || []) {
    if (m.pieza !== id) continue;
    const base = Teoria.inicio(m), casos = Teoria.grilla(m.controles || []);
    for (let i = 0; i < casos.length; i += Math.max(1, Math.floor(casos.length / 300))) add(`mesa ${m.id} ${JSON.stringify(casos[i])}`, m.pieza, m.dibujo(Object.assign({}, base, casos[i])));
  }
  return out;
}

// Las pruebas que valen para toda pieza de la unidad. figuras: [{ donde, datos, estado }]; o.cortes: cortes a revisar;
// o.minTeoria: cuántas figuras de la teoría se esperan como mínimo (la prueba no corre en vacío).
function comunes(P, figuras, o = {}) {
  const cortes = o.cortes || [0, 1, 2, 3, 4, 5, 6];
  const teoria = figuras.filter(f => !/^muestra/.test(f.donde)).length;
  test(`${P.id}: hay figuras de la teoría (la prueba no corre en vacío)`, () => assert.ok(teoria >= (o.minTeoria || 1), `${teoria} figuras`));

  test(`${P.id}: limpia: sin NaN, sin colores fijos, sin ids ni scripts, texto de 14 o más, pura y con texto alternativo`, () => {
    for (const { donde, datos, estado } of figuras) {
      const s = P.dibujar(datos, estado);
      assert.ok(!/NaN|undefined|null|Infinity/.test(s), donde);
      assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), `${donde}: color fijo`);
      assert.ok(!/<script|\son[a-z]+\s*=|\sid=/i.test(s), donde);
      for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14, `${donde}: texto de ${t}`);
      assert.equal(s, P.dibujar(datos, estado), `${donde}: no es pura`);
      assert.ok(P.alt(datos).length > 30, donde);
      // Ni verde ni carmín: la paleta de deducción no los usa (docs/etapa3/decisiones.md).
      assert.ok(!/var\(--c-[dh]\)/.test(s), `${donde}: verde o carmín`);
    }
  });

  test(`${P.id}: el alto no cambia con el corte; los objetos van marcados como dibujo de prueba`, () => {
    for (const { donde, datos, estado } of figuras) {
      const altos = new Set([estado.corte || 0, ...cortes].map(c => altoDe(P.dibujar(datos, Object.assign({}, estado, { corte: c })))));
      assert.equal(altos.size, 1, donde);
      if (datos.escena) assert.match(P.dibujar(datos, estado), /data-objeto="[a-z]+" data-prueba="si"/, donde);
    }
  });

  test(`${P.id}: todo cabe en el lienzo con 4 de margen, en todos los cortes`, () => {
    for (const { donde, datos, estado } of figuras) for (const c of cortes) {
      const s = P.dibujar(datos, Object.assign({}, estado, { corte: c })), alto = altoDe(s);
      for (const b of cajas(s)) assert.ok(b.x0 >= 3.99 && b.x1 <= 316.01 && b.y0 >= 3.99 && b.y1 <= alto - 3.99, `${donde} (corte ${c}): ${b.tag} ${b.txt || ''} fuera [${b.x0.toFixed(1)}, ${b.y0.toFixed(1)}, ${b.x1.toFixed(1)}, ${b.y1.toFixed(1)}] de 320 × ${alto}`);
    }
  });

  test(`${P.id}: ningún rótulo pisa a otro rótulo ni a un trazo (salvo los marcos que lo contienen)`, () => {
    for (const { donde, datos, estado } of figuras) for (const c of cortes) {
      const bs = cajas(P.dibujar(datos, Object.assign({}, estado, { corte: c }))), txt = bs.filter(b => b.tag === 'text'), otros = bs.filter(b => b.tag !== 'text' && !b.caja);
      for (let i = 0; i < txt.length; i++) {
        for (let j = i + 1; j < txt.length; j++) assert.ok(!pisa(txt[i], txt[j]), `${donde} (corte ${c}): «${txt[i].txt}» pisa «${txt[j].txt}»`);
        for (const x of otros) assert.ok(!pisa(txt[i], x), `${donde} (corte ${c}): «${txt[i].txt}» pisa un ${x.tag} [${x.x0.toFixed(1)}, ${x.y0.toFixed(1)}, ${x.x1.toFixed(1)}, ${x.y1.toFixed(1)}]`);
      }
    }
  });
}

module.exports = { cajas, pisa, altoDe, deLaTeoria, comunes };
