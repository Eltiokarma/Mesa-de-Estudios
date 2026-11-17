// Pruebas propias de «Magnitudes y unidades» (además del validador común de contenido/teoria/teoria.test.js):
//   - un color fijo por magnitud en toda la unidad (docs/molde-unidad.md §5b; Gerson, 17 nov): cada ficha de color que
//     lee el alumno (juego, leyenda, lectura, Predice, Mira, regla, ejemplos, «Así se resuelve» y «Ahora tú») dice su
//     magnitud (campo m) y lleva el color de la tabla de la cabecera de magnitudes-y-vectores.js;
//   - las figuras pintan cada magnitud con ese mismo color, y ningún rótulo va en verde ni carmín (no hay ángulos, y el
//     verde junto al naranja no se distingue con protanopía);
//   - la respuesta de cada ejemplo lleva el color de su magnitud.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../../../nucleo/kit/kit.js');
const Teoria = require('../../../nucleo/teoria.js');
const def = require('./magnitudes-y-vectores.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));

// La tabla de la cabecera: magnitud → color. Si alguna cambia de color, esta prueba falla.
const COLOR = {
  dada: 'c-o', factor: 'c-i', pedida: 'c-f',          // ideas 1 y 2: lo que te dan, el factor que vale 1, lo que se pide
  magnitud: 'c-o', 'área': 'c-f', 'incógnita': 'c-f', veredicto: 'c-f',   // idea 3
};
// Las letras que salen con color, con su magnitud: una letra, un color.
const LETRA = { h: 'c-o', A: 'c-f', k: 'c-f', 'k₁': 'c-f', 'k₂': 'c-f', G: 'c-f', x: 'c-f', y: 'c-f' };

const idea = id => def.ideas.find(i => i.id === id);
const fichas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(fichas)
  : typeof x.v === 'string' && /^c-/.test(x.v) ? [x] : Object.values(x).flatMap(fichas));

// Todo lo que lee el alumno, con dónde está.
function lecturas() {
  const out = [];
  const add = (donde, x) => { for (const f of fichas(x)) out.push({ donde, f }); };
  for (const i of def.ideas) {
    const j = i.juega;
    for (const [k, e] of (i.ejemplos || []).entries()) add(`${i.id} ejemplo ${k + 1}`, [e.enunciado, e.datos, e.solucion, e.respuesta]);
    for (const [k, p] of i.mira.pasos.entries()) add(`${i.id} mira ${k + 1}`, [p.texto, p.ecuacion]);
    add(`${i.id} regla`, [i.regla.texto, i.regla.ecuacion, i.regla.condicion]);
    add(`${i.id} leyenda`, (j.leyenda || []).map(x => x.s));
    for (const v of Teoria.grilla(j.controles || [])) add(`${i.id} lectura`, j.lectura(v));
    add(`${i.id} predice`, [i.predice.pregunta, i.predice.datos, i.predice.opciones]);
    for (let s = 0; s < 60; s++) {
      const a = i.ahoraTu.generar(s), r = i.resuelve.generar(s);
      add(`${i.id} ahoraTu ${s}`, [a.pregunta, a.datos, a.opciones, a.solucion]);
      add(`${i.id} resuelve ${s}`, [r.enunciado, r.datos, r.pasos, r.respuesta]);
    }
  }
  return out;
}
const LEIDO = lecturas();

test('la prueba no corre en vacío: hay fichas de color en las tres ideas', () => {
  for (const i of def.ideas) assert.ok(LEIDO.filter(x => x.donde.startsWith(i.id)).length > 20, i.id);
});

test('un color por magnitud en toda la unidad: cada ficha dice su magnitud y lleva su color', () => {
  const visto = {};
  for (const { donde, f } of LEIDO) {
    assert.ok(f.m in COLOR, `${donde}: «${f.t}» sin magnitud conocida (m = ${f.m})`);
    assert.equal(f.v, COLOR[f.m], `${donde}: «${f.t}» (${f.m}) en ${f.v}, no en ${COLOR[f.m]}`);
    (visto[f.m] = visto[f.m] || new Set()).add(f.v);
    if (typeof f.t === 'string' && f.t in LETRA) assert.equal(f.v, LETRA[f.t], `${donde}: la letra ${f.t} en ${f.v}`);
  }
  for (const m of Object.keys(COLOR)) assert.ok(visto[m], `no salió ninguna ficha de «${m}»`);
});

test('los controles del juego llevan el color de lo que te dan', () => {
  for (const i of def.ideas) for (const c of i.juega.controles || []) if (c.color) assert.equal(c.color, COLOR.dada, `${i.id}: ${c.etiqueta}`);
});

test('la respuesta de cada ejemplo lleva el color de su magnitud', () => {
  for (const i of def.ideas) for (const [k, e] of i.ejemplos.entries()) {
    const fs = fichas(e.respuesta);
    assert.ok(fs.length, `${i.id} ejemplo ${k + 1}: respuesta sin color`);
    // En las conversiones, la respuesta es lo que se pide; en las dimensiones, la magnitud, el área, la incógnita o el veredicto.
    for (const f of fs) assert.ok(i.id === 'homogeneidad' ? f.m !== 'dada' && f.m !== 'factor' : f.m === 'pedida', `${i.id} ejemplo ${k + 1}: «${f.t}» es ${f.m}`);
  }
});

// Las figuras de la unidad: Lee, el juego en cada estado, Predice, Mira, los ejemplos y «Así se resuelve».
function figuras() {
  const out = [];
  const add = (donde, pieza, dib) => { if (pieza && dib && dib.datos) out.push({ donde, pieza, datos: dib.datos, estado: dib.estado || {} }); };
  for (const i of def.ideas) {
    const p = i.pieza, j = i.juega;
    for (const v of Teoria.grilla(j.controles || [])) add(`${i.id} juega`, j.pieza || p, j.dibujo(v));
    add(`${i.id} predice`, i.predice.pieza || p, i.predice.dibujo);
    add(`${i.id} revelar`, i.predice.pieza || p, i.predice.revelar);
    for (const [k, paso] of i.mira.pasos.entries()) add(`${i.id} mira ${k + 1}`, i.mira.pieza || p, { datos: i.mira.datos, estado: paso.estado || {} });
    for (const [k, e] of i.ejemplos.entries()) if (e.figura) add(`${i.id} ejemplo ${k + 1}`, e.figura.pieza, e.figura);
    for (let s = 0; s < 30; s++) {
      const r = i.resuelve.generar(s);
      if (r.dibujo) add(`${i.id} resuelve ${s}`, i.resuelve.pieza || p, r.dibujo);
      for (const x of r.pasos) if (x.dibujo) add(`${i.id} resuelve ${s}`, i.resuelve.pieza || p, x.dibujo);
    }
  }
  return out;
}
const FIGURAS = figuras();

test('las figuras pintan cada magnitud con su color: el poste y la combi naranja, el área violeta', () => {
  assert.ok(FIGURAS.length > 80);
  for (const d of FIGURAS) {
    const x = d.datos;
    if (d.pieza === 'fis-medida' || d.pieza === 'fis-combi') assert.equal(x.color, 'o', `${d.donde}: lo que te dan, naranja`);
    if (d.pieza === 'fis-area') for (const v of [x, ...(x.vistas || [])]) assert.equal(v.color || x.color, 'f', `${d.donde}: el área y el volumen, violeta`);
    if (d.pieza === 'fis-objeto' && /homogeneidad/.test(d.donde)) {
      // Idea 3: F, P y las demás magnitudes, naranja; el área A, violeta.
      assert.notEqual(x.colorFuerza, 'f', `${d.donde}: F en violeta`);
      assert.notEqual(x.colorP, 'f', `${d.donde}: P en violeta`);
      if (x.objeto === 'terreno') assert.equal(x.colorTexto, 'f', `${d.donde}: el área A, violeta`);
      if (x.area) assert.equal(x.colorArea, 'f', `${d.donde}: el área A, violeta`);
    }
  }
});

// Los rellenos de los objetos (el pasto de la cancha, la chacra) pueden ser verdes muy claros: son el objeto, no una
// variable. Lo que se lee (rótulos, valores, veredictos) nunca va en verde ni en carmín.
test('en la unidad ningún rótulo de figura va en verde ni en carmín', () => {
  let rotulos = 0;
  for (const d of FIGURAS) {
    const svg = Kit.piezas[d.pieza].dibujar(d.datos, d.estado);
    for (const t of svg.match(/<text[^>]*>[^<]*/g) || []) {
      rotulos++;
      assert.ok(!/var\(--c-[dh]\)/.test(t), `${d.donde} (${d.pieza}): ${t}`);
    }
  }
  assert.ok(rotulos > 300);
});
