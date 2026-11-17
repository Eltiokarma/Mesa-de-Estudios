// Pruebas propias de «Materia y energía» (además del validador común de contenido/teoria/teoria.test.js):
//   - un dibujo de partículas usa la paleta de elementos y ningún color de variable (docs/etapa2/decisiones.md, 17 nov);
//   - ningún dibujo junta dos elementos que no se distinguen (Elementos.CERCANOS: N–Fe, C–Na…), y cada combinación de
//     elementos que sale junta está en Elementos.VISTAS (donde nucleo/elementos.test.js mide su separación);
//   - las lupas de quim-vasos no recortan partículas (caben todas las que piden los datos);
//   - la idea 1 da sus clasificaciones con el motor de la escena, y «Así se resuelve» no repite el caso de «Ahora tú».
// Se recorren todos los dibujos: Lee, el juego en cada opción y cada instante, Predice, Mira, «Ahora tú» y «Así se
// resuelve» en 60 semillas, los ejemplos y las mesas del laboratorio.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../../../nucleo/kit/kit.js');
const E = require('../../../nucleo/elementos.js');
const Teoria = require('../../../nucleo/teoria.js');
const def = require('./materia-y-energia.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const V = Kit.piezas['quim-vasos'];

// Todos los dibujos de la unidad: { donde, pieza, datos, estado }.
function dibujos() {
  const out = [];
  const add = (donde, pieza, dib) => { if (dib && dib.datos) out.push({ donde, pieza, datos: dib.datos, estado: dib.estado || {} }); };
  for (const idea of def.ideas) {
    const p = idea.pieza;
    for (const [k, t] of ((idea.lee && idea.lee.tarjetas) || []).entries()) add(`${idea.id} lee ${k + 1}`, t.pieza || p, t.dibujo);
    const j = idea.juega, ctr = j.controles || [];
    let casos = [Teoria.inicio(j)];
    for (const c of ctr) casos = casos.flatMap(v => (c.opciones ? c.opciones.map(o => o.valor) : Array.from({ length: Math.round((c.max - c.min) / c.paso) + 1 }, (_, i) => c.min + i * c.paso)).map(x => Object.assign({}, v, { [c.id]: x })));
    for (const v of casos) add(`${idea.id} juega ${JSON.stringify(v)}`, j.pieza || p, j.dibujo(v));
    add(`${idea.id} predice`, idea.predice.pieza || p, idea.predice.dibujo);
    add(`${idea.id} revelar`, idea.predice.pieza || p, idea.predice.revelar);
    for (const [k, paso] of idea.mira.pasos.entries()) add(`${idea.id} mira ${k + 1}`, idea.mira.pieza || p, { datos: idea.mira.datos, estado: Object.assign({}, idea.mira.base || {}, paso.estado || {}) });
    for (let s = 0; s < 60; s++) {
      const a = idea.ahoraTu.generar(s); if (a.dibujo) add(`${idea.id} ahoraTu ${s}`, idea.ahoraTu.pieza || p, a.dibujo);
      if (idea.resuelve) { const r = idea.resuelve.generar(s); if (r.dibujo) add(`${idea.id} resuelve ${s}`, idea.resuelve.pieza || p, r.dibujo); for (const x of r.pasos) if (x.dibujo) add(`${idea.id} resuelve ${s}`, idea.resuelve.pieza || p, x.dibujo); }
    }
    for (const [k, e] of (idea.ejemplos || []).entries()) if (e.figura) add(`${idea.id} ejemplo ${k + 1}`, e.figura.pieza, e.figura);
  }
  return out;
}
const TODOS = dibujos();
const DE_PARTICULAS = TODOS.filter(d => d.pieza === 'quim-particulas' || d.pieza === 'quim-vasos');
// Los elementos que pinta un dibujo de partículas (por su `el`, o por el símbolo si no lo trae).
function elementos(d) {
  const svg = Kit.piezas[d.pieza].dibujar(d.datos, d.estado);
  return [...new Set([...svg.matchAll(/var\(--el-([A-Za-z]+)\)/g)].map(m => m[1]))].sort();
}

test('hay dibujos de partículas en la unidad (la prueba no corre en vacío)', () => assert.ok(DE_PARTICULAS.length > 100));

test('un dibujo de partículas usa la paleta de elementos y ningún color de variable', () => {
  for (const d of DE_PARTICULAS) {
    const svg = Kit.piezas[d.pieza].dibujar(d.datos, d.estado);
    assert.ok(!/var\(--c-/.test(svg), `${d.donde}: colores de variable en un dibujo de partículas`);
    for (const e of elementos(d)) assert.ok(E.COLORES[e], `${d.donde}: «${e}» no está en nucleo/elementos.js`);
  }
});

test('ningún dibujo junta elementos que no se distinguen, y cada combinación está en Elementos.VISTAS', () => {
  const cerca = new Set(E.CERCANOS.map(([a, b]) => [a, b].sort().join('-')));
  const vistas = E.VISTAS.map(([, els]) => new Set(els));
  for (const d of DE_PARTICULAS) {
    const els = elementos(d);
    for (let i = 0; i < els.length; i++) for (let j = i + 1; j < els.length; j++)
      assert.ok(!cerca.has([els[i], els[j]].sort().join('-')), `${d.donde}: ${els[i]} y ${els[j]} no se distinguen (CERCANOS)`);
    if (els.length > 1) assert.ok(vistas.some(v => els.every(e => v.has(e))), `${d.donde}: agrega [${els.join(', ')}] a Elementos.VISTAS`);
  }
});

test('las lupas no recortan partículas: caben todas las que piden los datos', () => {
  for (const d of TODOS.filter(x => x.pieza === 'quim-vasos')) {
    (d.datos.recipientes || []).forEach((r, k) => {
      if (!r.lupa || r.lupa.vacia) return;
      const cap = V.capacidad(d.datos, k);
      r.lupa.capas.forEach((c, ci) => {
        const n = (c.particulas || []).reduce((a, p) => a + (p.n || 0), 0);
        assert.ok(n <= cap[ci], `${d.donde}: lupa ${k + 1}, capa ${ci + 1}: ${n} partículas y caben ${cap[ci]}`);
      });
    });
  }
});

test('idea 1: la misión la cumple solo una mezcla de una fase, y no al abrir', () => {
  const idea = def.ideas.find(i => i.id === 'sustancia-mezcla'), m = idea.juega.mision;
  assert.equal(m.logrado(Teoria.inicio(idea.juega)), false);
  assert.equal(m.logrado({ echa: 'azucar', t: 30 }), true);
  assert.equal(m.logrado({ echa: 'sal', t: 20 }), true);
  assert.equal(m.logrado({ echa: 'sal', t: 10 }), false, 'con sal sin disolver hay dos fases');
  for (const echa of ['aceite', 'arena', 'nada']) assert.equal(m.logrado({ echa, t: 30 }), false, echa);
});

test('idea 1: «Así se resuelve» no repite el caso de «Ahora tú» con la misma semilla', () => {
  const idea = def.ideas.find(i => i.id === 'sustancia-mezcla');
  let iguales = 0;
  const caso = (q, ds) => q + ' | ' + JSON.stringify(ds);
  for (let s = 0; s < 60; s++) { const a = idea.ahoraTu.generar(s), r = idea.resuelve.generar(s); if (s % 5 !== 0 && caso(a.pregunta, a.datos) === caso(r.enunciado, r.datos)) iguales++; }
  assert.ok(iguales <= 3, `${iguales} semillas con el mismo caso (enunciado y datos)`);
  // En el tipo de la lupa la pregunta es la misma: lo que cambia es la muestra dibujada.
  for (let s = 0; s < 60; s += 5) assert.notEqual(JSON.stringify(idea.ahoraTu.generar(s).dibujo), JSON.stringify(idea.resuelve.generar(s).dibujo), `semilla ${s}`);
});

test('idea 1: los ejemplos no usan el hielo (es la predicción de la idea) y su respuesta va en violeta', () => {
  const Ecuacion = require('../../../nucleo/ecuacion.js');
  const idea = def.ideas.find(i => i.id === 'sustancia-mezcla');
  for (const [k, e] of idea.ejemplos.entries()) {
    const todo = [e.enunciado, ...(e.datos || []), ...e.solucion.map(x => x.texto), e.respuesta].map(x => Ecuacion.texto(Array.isArray(x) ? x : [x])).join(' ');
    assert.ok(!/hielo|cubito/i.test(todo), `ejemplo ${k + 1} usa el hielo`);
    assert.ok(e.respuesta.some(x => x && x.v === 'c-f'), `ejemplo ${k + 1}: la respuesta va en violeta (c-f)`);
    if (e.figura) assert.ok(!JSON.stringify(e.figura).includes(Ecuacion.texto(e.respuesta)), `ejemplo ${k + 1}: la figura muestra la respuesta`);
  }
});
