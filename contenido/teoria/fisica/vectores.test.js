// Pruebas propias de «Vectores» (además del validador común de contenido/teoria/teoria.test.js):
//   - un color fijo por magnitud en toda la unidad (docs/molde-unidad.md §5b; Gerson, 17 nov): cada ficha de color que
//     lee el alumno (juego, leyenda, lectura, Predice, Mira, regla, ejemplos, «Así se resuelve», «Ahora tú») dice su
//     magnitud (campo m) y lleva el color de la tabla de la cabecera de vectores.js; cada letra, un solo color;
//   - los controles, los arrastres y las figuras (flechas, fis-fuerzas, fis-dron) pintan cada flecha con el color de su
//     letra: A⃗, F⃗ y P⃗ naranja; B⃗ turquesa; C⃗ verde; R⃗, d⃗ y û violeta; los ángulos carmín;
//   - el verde nunca hace de resultante ni de desplazamiento, y la distancia recorrida va en tinta.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../../../nucleo/kit/kit.js');
const Teoria = require('../../../nucleo/teoria.js');
const def = require('./vectores.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));

// La tabla de la cabecera: magnitud → color. Si alguna cambia de color, esta prueba falla.
const COLOR = { primero: 'c-o', segundo: 'c-i', tercero: 'c-d', pedido: 'c-f', 'ángulo': 'c-h' };
// Cada letra con su color, en toda la unidad.
const LETRA = { A: 'c-o', F: 'c-o', P: 'c-o', B: 'c-i', C: 'c-d', R: 'c-f', d: 'c-f', 'Δx': 'c-f', 'û': 'c-f', 'θ': 'c-h' };
// El mismo color en las piezas (sin el «c-»), por la letra del rótulo de la flecha.
const PIEZA = Object.fromEntries(Object.entries(LETRA).map(([k, v]) => [k, v.slice(2)]));

const fichas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(fichas)
  : typeof x.v === 'string' && /^c-/.test(x.v) ? [x] : Object.values(x).flatMap(fichas));

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

test('la prueba no corre en vacío: hay fichas de color en cada idea', () => {
  for (const i of def.ideas) assert.ok(LEIDO.filter(x => x.donde.startsWith(`${i.id} `)).length > 20, i.id);
});

test('un color por magnitud en toda la unidad: cada ficha dice su magnitud y lleva su color', () => {
  const visto = {};
  for (const { donde, f } of LEIDO) {
    assert.ok(f.m in COLOR, `${donde}: «${f.t}» sin magnitud conocida (m = ${f.m})`);
    assert.equal(f.v, COLOR[f.m], `${donde}: «${f.t}» (${f.m}) en ${f.v}, no en ${COLOR[f.m]}`);
    if (typeof f.t === 'string' && f.t in LETRA) {
      assert.equal(f.v, LETRA[f.t], `${donde}: la letra ${f.t} en ${f.v}`);
      (visto[f.t] = visto[f.t] || new Set()).add(f.v);
    }
  }
  for (const l of ['A', 'B', 'C', 'R', 'd', 'F', 'P', 'θ', 'û']) assert.ok(visto[l], `no salió la letra ${l}`);
});

test('el desplazamiento y la distancia: d⃗ violeta en toda la unidad, la distancia recorrida en tinta', () => {
  const i = def.ideas.find(x => x.id === 'escalar-vector');
  for (const [k, e] of i.ejemplos.entries()) {
    // Lo que se escribe junto a «Recorrió» o «recorrió» es la distancia: va sin color.
    const r = e.respuesta;
    for (let n = 0; n < r.length - 1; n++) if (typeof r[n] === 'string' && /[Rr]ecorrió\s*$|caminó\s*$/.test(r[n])) assert.equal(typeof r[n + 1], 'string', `ejemplo ${k + 1}: la distancia lleva color`);
  }
});

test('los controles y los arrastres llevan el color de su magnitud', () => {
  const esperado = c => (/^θ$/.test(c.etiqueta) ? 'c-h' : /^A\b|^A en|punta de A/.test(c.etiqueta) ? 'c-o' : /^B\b|^punta de B$/.test(c.etiqueta) && c.id !== 'giro-b' ? 'c-i'
    : /vuela|dron/.test(c.etiqueta) ? 'c-f' : c.id === 'giro-b' ? 'c-h' : null);
  const todos = def.ideas.flatMap(i => [...(i.juega.controles || []), ...(i.juega.arrastres || [])])
    .concat((def.laboratorio || []).flatMap(m => [...(m.controles || []), ...(m.arrastres || [])]));
  let vistos = 0;
  for (const c of todos) if (c.color) { const e = esperado(c); if (e) { vistos++; assert.equal(c.color, e, `${c.id} «${c.etiqueta}»`); } }
  assert.ok(vistos >= 10);
});

// Las figuras: Lee, el juego en cada estado, Predice, Mira, los ejemplos, «Así se resuelve» y las mesas del laboratorio.
function figuras() {
  const out = [];
  const add = (donde, pieza, dib) => { if (pieza && dib && dib.datos) out.push({ donde, pieza, datos: dib.datos, estado: dib.estado || {} }); };
  for (const i of def.ideas) {
    const p = i.pieza, j = i.juega;
    for (const [k, t] of ((i.lee && i.lee.tarjetas) || []).entries()) add(`${i.id} lee ${k + 1}`, t.pieza || p, t.dibujo);
    for (const v of Teoria.grilla(j.controles || [])) add(`${i.id} juega`, j.pieza || p, j.dibujo(v));
    add(`${i.id} predice`, i.predice.pieza || p, i.predice.dibujo);
    add(`${i.id} revelar`, i.predice.pieza || p, i.predice.revelar);
    for (const [k, paso] of i.mira.pasos.entries()) add(`${i.id} mira ${k + 1}`, i.mira.pieza || p, { datos: i.mira.datos, estado: paso.estado || {} });
    for (const [k, e] of i.ejemplos.entries()) if (e.figura) add(`${i.id} ejemplo ${k + 1}`, e.figura.pieza, e.figura);
    for (let s = 0; s < 30; s++) {
      const r = i.resuelve.generar(s), a = i.ahoraTu.generar(s);
      if (r.dibujo) add(`${i.id} resuelve ${s}`, i.resuelve.pieza || p, r.dibujo);
      for (const x of r.pasos) if (x.dibujo) add(`${i.id} resuelve ${s}`, i.resuelve.pieza || p, x.dibujo);
      if (a.dibujo) add(`${i.id} ahoraTu ${s}`, i.ahoraTu.pieza || p, a.dibujo);
    }
  }
  for (const m of def.laboratorio || []) if (m.pieza !== 'fis-espacio-3d') for (const v of Teoria.grilla(m.controles || [])) add(`laboratorio ${m.id}`, m.pieza, m.dibujo(v));
  return out;
}
const FIGURAS = figuras();
// La letra de un rótulo: «A⃗», «A_x», «R⃗ = 7î + 3ĵ», «d⃗», «θ = ?».
const letra = r => { const m = String(r || '').match(/^−?\d*\s*(Δx|[A-Za-zθû])(?:⃗|_|\s|=|$)/); return m ? m[1] : null; };

test('las figuras pintan cada flecha con el color de su letra, y el verde nunca es la resultante', () => {
  let flechas = 0;
  for (const d of FIGURAS) {
    const vs = Array.isArray(d.datos.vistas) ? d.datos.vistas : [d.datos];
    for (const x of vs) {
      if (d.pieza === 'fis-dron') for (const v of x.drones || []) assert.ok(!v.color || v.color === 'f', `${d.donde}: el vuelo del dron en ${v.color}`);
      for (const fl of [...(x.flechas || []), ...(x.resultante ? [x.resultante] : [])]) {
        const l = letra(fl.rotulo);
        if (l && l in PIEZA && fl.color) { flechas++; assert.equal(fl.color, PIEZA[l], `${d.donde}: ${fl.rotulo} en ${fl.color}`); }
      }
      if (x.resultante && x.resultante.color) assert.notEqual(x.resultante.color, 'd', `${d.donde}: resultante verde`);
      for (const a of x.angulos || []) assert.ok(!a.color || a.color === 'h', `${d.donde}: ángulo «${a.texto}» en ${a.color}`);
    }
  }
  assert.ok(flechas > 300, `solo ${flechas} flechas con letra`);
});

test('las figuras se dibujan y no usan el carmín fuera de los ángulos en la idea 1', () => {
  for (const d of FIGURAS.filter(x => x.donde.startsWith('escalar-vector'))) {
    const svg = Kit.piezas[d.pieza].dibujar(d.datos, d.estado);
    assert.ok(!/var\(--c-h\)/.test(svg), `${d.donde}: carmín en la idea 1, que no tiene ángulos`);
  }
});

// La práctica de la unidad (plantillas/vectores-*) usa los mismos colores: cada variable de cada problema con el color
// de su magnitud. A⃗ naranja, B⃗ turquesa, C⃗ y el tercer dato (k, la razón m:n) verde, el cuarto vector en tinta,
// R⃗ y lo que se pide violeta, los ángulos carmín; la componente m de A⃗, naranja como su vector.
test('la práctica de Vectores usa el color de cada magnitud', () => {
  const CLAVE = { A: 'o', a: 'o', L: 'o', B: 'i', b: 'i', C: 'd', k: 'd', r: 'd', D: 't', t: 'h', R: 'f', X: 'f' };
  const especial = v => (/^razón entre/.test(v.nombre) ? 'i' : /^módulo de C⃗/.test(v.nombre) ? 'd' : /^m, componente de A⃗/.test(v.nombre) ? 'o' : null);
  const GEN = ['vectores-componentes', 'vectores-productos', 'vectores-unitario', 'vectores-ley-cosenos', 'vectores-combinacion', 'vectores-division', 'vectores-poligono'];
  let n = 0;
  for (const id of GEN) {
    const g = require(path.join(__dirname, '..', '..', '..', 'plantillas', id, 'generador.js'));
    for (let s = 0; s < 200; s++) for (const [k, v] of Object.entries(g.generar(s).variables || {})) {
      n++;
      assert.ok(k in CLAVE, `${id} semilla ${s}: variable ${k} sin color en la tabla`);
      assert.equal(v.color, especial(v) || CLAVE[k], `${id} semilla ${s}: ${k} («${v.nombre}») en ${v.color}`);
    }
  }
  assert.ok(n > 2000);
});

// Verificación de la pasada de redacción (26 nov 2026).
//   - «Así se resuelve» del unitario decía «0,38² + 0,92² = 1», que da 0,9908: una suma de cuadrados escrita con «=»
//     tiene que ser cierta tal como se lee.
//   - En el ángulo desde el producto escalar, el distractor `directo` (150° cuando el ángulo es 120°) no decía qué
//     error modela: es tomar el cociente como seno y buscar el ángulo obtuso de ese seno.
test('redacción: las sumas de cuadrados son ciertas y el distractor del ángulo nombra su error', () => {
  const plano = x => (x == null ? '' : typeof x === 'string' ? x : Array.isArray(x) ? x.map(plano).join('') : typeof x === 'object' ? plano(x.t ?? x.texto ?? '') : String(x));
  const num = t => Number(t.replace(',', '.'));
  const idea = id => def.ideas.find(i => i.id === id);
  for (let s = 0; s < 200; s++) {
    for (const p of idea('componentes').resuelve.generar(s).pasos) {
      for (const m of plano(p.texto).matchAll(/(\d+(?:,\d+)?)² \+ (\d+(?:,\d+)?)² = (\d+(?:,\d+)?)(?![\d/])/g)) {
        assert.ok(Math.abs(num(m[1]) ** 2 + num(m[2]) ** 2 - num(m[3])) < 1e-9, `semilla ${s}: «${m[0]}» es falso`);
      }
    }
    const a = idea('productos').ahoraTu.generar(s);
    for (const o of a.opciones || []) {
      if (o.id !== 'directo') continue;
      assert.equal(o.texto, '150°', `semilla ${s}: ${o.texto}`);
      assert.match(o.siFuera, /seno/, `semilla ${s}: ${o.siFuera}`);
      assert.match(o.siFuera, /obtuso/, `semilla ${s}: ${o.siFuera}`);
    }
  }
});
