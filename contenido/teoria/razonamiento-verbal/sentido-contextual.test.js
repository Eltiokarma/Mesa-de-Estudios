// Pruebas propias de «Precisión léxica y sentido contextual» (además del validador común de
// contenido/teoria/teoria.test.js). Miran las cinco ideas, rehechas por el contrato en la etapa 7 (19 nov). Salen de las
// reglas que dejaron las auditorías de Tema e idea principal, Definiciones y Analogías (rutinas/auditoria/) y de las
// notas de la etapa:
//   R1. El glosario se lee antes de jugar: los ejemplos de los términos que estrena una idea no copian una palabra en
//       negrita ni una alternativa de su juego, su predicción, su «Así se resuelve», su «Ahora tú» o sus ejemplos.
//   R2. En las hojas de examen, la respuesta nombra una alternativa; en el nivel 3 cada letra va una vez por idea.
//   R5. La primera tarjeta de «Lee» muestra el texto en su soporte (lugar, quién escribe y para quién), y el mismo
//       soporte abre el juego.
//   R9. Solo la paleta de lectura (i, o, f): sin verde ni carmín.
//   M7. Antes de responder, ninguna figura trae marcas ni colores (la palabra va solo en negrita).
//   Verbal (Analogías): la correcta no es la más larga, ni la más corta, ni está escrita dentro de otra alternativa;
//   dos incorrectas de una predicción o de un «Ahora tú» no comparten código; el lugar de la correcta se reparte también
//   en las listas de nivel 2; los juegos se juegan tocando el soporte y una sola combinación cumple su misión; «Ahora
//   tú» no repite una palabra de la idea; `ahoraTu.voz` propia; ninguna palabra de dos lecturas para un alumno peruano.
// Las medidas se hacen sobre lo que la unidad entrega (textos, opciones, dibujos), sin usar sus funciones internas.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Teoria = require('../../../nucleo/teoria.js');
const def = require('./sentido-contextual.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const Kit = require('../../../nucleo/kit/kit.js');
const Glosario = require('../../../nucleo/glosario.js');
const codigos = require('../../razonamiento-verbal/codigos.json');

const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x == null ? '' : typeof x === 'object' ? plano(x.t !== undefined ? x.t : x.negrita !== undefined ? x.negrita : x.texto !== undefined ? x.texto : '') : String(x)).replace(/⁠/g, '');
const norm = s => plano(s).toLowerCase().replace(/[.,;:¿?¡!«»"()]/g, ' ').replace(/\s+/g, ' ').trim();
const SEMILLAS = 60;
const svg = (pieza, d) => Kit.piezas[pieza].dibujar(d.datos, d.estado || {});
const IDEAS = def.ideas;
const porIdea = Glosario.porIdea(def);
const IDS = ['acepcion', 'denota-connota', 'palabra-precisa', 'sentido-figurado', 'inferir-significado'];

// Todas las figuras de la idea, con el momento en que se ven; `antes`: antes de responder.
function figuras(idea) {
  const out = [], j = idea.juega;
  for (const t of idea.lee.tarjetas) if (t.dibujo) out.push({ q: 'lee', pieza: t.pieza, d: t.dibujo, antes: true });
  for (const v of Teoria.grilla(j.controles)) out.push({ q: `juega ${JSON.stringify(v)}`, pieza: idea.pieza, d: j.dibujo(v) });
  out.push({ q: 'predice', pieza: idea.pieza, d: idea.predice.dibujo, antes: true }, { q: 'revelar', pieza: idea.pieza, d: idea.predice.revelar });
  idea.mira.pasos.forEach((p, k) => out.push({ q: `mira ${k + 1}`, pieza: idea.mira.pieza || idea.pieza, d: { datos: idea.mira.datos, estado: p.estado } }));
  for (let s = 0; s < 12; s++) {
    const R = idea.resuelve.generar(s);
    out.push({ q: `resuelve ${s}`, pieza: idea.resuelve.pieza, d: R.dibujo, antes: true });
    for (const p of R.pasos) if (p.dibujo) out.push({ q: `resuelve ${s} paso`, pieza: idea.resuelve.pieza, d: p.dibujo });
    const A = idea.ahoraTu.generar(s);
    out.push({ q: `ahora tú ${s}`, pieza: idea.ahoraTu.pieza, d: A.dibujo, antes: true }, { q: `ahora tú ${s} solución`, pieza: idea.ahoraTu.pieza, d: A.solucion.dibujo });
  }
  idea.ejemplos.forEach((e, k) => out.push({ q: `ejemplo ${k + 1}`, pieza: e.figura.pieza, d: e.figura, antes: true }));
  return out;
}
// La palabra en negrita de un soporte.
const negrita = d => { for (const h of d.hojas || []) for (const o of h.oraciones || []) for (const f of o.frags || []) if (f.negrita) return f.t; return null; };
// Las preguntas con alternativas de la idea, con sus textos y cuál es la correcta.
function preguntas(idea) {
  const out = [], ps = idea.predice;
  out.push({ q: 'predice', ops: ps.opciones.map(o => ({ t: o.texto, ok: !!o.correcta, error: o.error })), codigos: true });
  const vistos = new Set();
  for (let s = 0; s < SEMILLAS; s++) {
    const A = idea.ahoraTu.generar(s), k = plano(A.pregunta) + JSON.stringify(A.dibujo.datos);
    if (vistos.has(k)) continue; vistos.add(k);
    out.push({ q: `ahora tú ${s}`, w: negrita(A.dibujo.datos), ops: A.opciones.map(o => ({ t: o.texto, ok: !!o.correcta, error: o.error })), codigos: true });
  }
  const vr = new Set();
  for (let s = 0; s < 12; s++) {
    const R = idea.resuelve.generar(s), d = R.dibujo.datos;
    if (vr.has(R.enunciado)) continue; vr.add(R.enunciado);
    const L = plano(R.respuesta)[0];
    out.push({ q: `resuelve ${s}`, w: negrita(d), L, ops: d.alternativas.map(a => ({ t: a.t, ok: a.id === L })), examen: true });
  }
  idea.ejemplos.forEach((e, k) => {
    const d = e.figura.datos;
    if ((d.alternativas || []).length) {
      const L = plano(e.respuesta)[0];
      out.push({ q: `ejemplo ${k + 1}`, w: negrita(d), L, ops: d.alternativas.map(a => ({ t: a.t, ok: a.id === L })), examen: true, nivel: e.nivel });
    } else if (e.nivel === 2) {
      const m = e.enunciado.match(/«([^»]+)», «([^»]+)» o «([^»]+)»/), r = norm(e.respuesta);
      assert.ok(m, `${idea.id} ejemplo ${k + 1}: lista «x», «y» o «z»`);
      out.push({ q: `ejemplo ${k + 1}`, w: negrita(d), ops: m.slice(1).map(t => ({ t, ok: norm(t) === r })), lista: true });
    }
  });
  return out;
}

test('la unidad tiene las cinco ideas en orden, y cada término del glosario trae tres ejemplos', () => {
  assert.deepEqual(IDEAS.map(i => i.id), IDS);
  for (const g of def.glosario) assert.ok((g.ejemplos || []).length >= 3, `«${g.termino}»: tres ejemplos`);
  assert.deepEqual(porIdea.map(l => l.length), [4, 2, 2, 2, 2], 'cada idea estrena sus términos');
});

test('con calidad 2 simulada, el validador no encuentra nada (200 semillas)', () => {
  assert.deepEqual(Teoria.problemas(Object.assign({}, def, { calidad: 2 }), { semillas: 200 }), []);
  assert.deepEqual(Teoria.pendientes(Object.assign({}, def, { calidad: 2 })), [], 'una unidad nueva no agrega excepciones');
});

for (const idea of IDEAS) {
  const k = IDEAS.indexOf(idea) + 1, figs = figuras(idea), pre = preguntas(idea);

  test(`idea ${k} (${idea.id}) · R9: solo la paleta de lectura (turquesa, naranja, violeta); sin verde ni carmín`, () => {
    assert.ok(figs.length > 30, 'la prueba no corre en vacío');
    for (const f of figs) for (const [, c] of svg(f.pieza, f.d).matchAll(/var\(--c-([a-z])\)/g)) assert.ok(['i', 'o', 'f'].includes(c), `${f.q}: color ${c}`);
    const textos = JSON.stringify([idea.juega.leyenda, Teoria.grilla(idea.juega.controles).map(v => idea.juega.lectura(v)), idea.mira.pasos.map(p => p.ecuacion), idea.regla.ecuacion,
      idea.ejemplos.map(e => [e.solucion, e.respuesta]), [...Array(12).keys()].map(s => idea.resuelve.generar(s)), [...Array(12).keys()].map(s => idea.ahoraTu.generar(s).solucion)]);
    assert.ok(!/"c-[dh]"/.test(textos), 'sin verde (c-d) ni carmín (c-h) en los textos de la idea');
  });

  test(`idea ${k} · M7: antes de responder, ninguna figura trae marcas ni colores; la palabra va en negrita`, () => {
    for (const f of figs.filter(x => x.antes)) {
      const s = svg(f.pieza, f.d);
      assert.ok(!/var\(--c-[a-z]\)/.test(s), `${f.q}: la figura ya trae un color`);
      assert.ok(!/class="rv-(marca|tacha|frase|trozo rv-sub)/.test(s), `${f.q}: la figura ya trae una marca`);
    }
    for (const f of figs.filter(x => /^(predice|resuelve \d+|ahora tú \d+|ejemplo \d+)$/.test(x.q))) assert.ok(negrita(f.d.datos), `${f.q}: sin palabra en negrita`);
  });

  test(`idea ${k} · R5: la primera tarjeta de «Lee» muestra el texto en su soporte, y el mismo soporte abre el juego`, () => {
    const t = idea.lee.tarjetas[0];
    assert.equal(t.pieza, 'rv-soporte');
    const d = t.dibujo.datos;
    assert.ok(d.lugar && d.hojas.every(h => h.de && h.para), 'lugar, quién escribe y para quién');
    const abre = idea.juega.dibujo(Teoria.inicio(idea.juega)).datos, sinToques = x => Object.fromEntries(Object.entries(x).filter(([c]) => c !== 'toques'));
    assert.deepEqual(sinToques(abre), d, 'el juego abre con el mismo soporte que «Lee»');
  });

  test(`idea ${k} · el juego se juega tocando el soporte, y una sola combinación de la grilla cumple la misión`, () => {
    const j = idea.juega, ini = Teoria.inicio(j), d = j.dibujo(ini).datos;
    assert.ok(Object.keys(d.toques || {}).length >= 2, 'zonas tocables');
    for (const c of Object.values(d.toques)) assert.ok(j.controles.some(x => x.id === c), `toque ${c} sin control`);
    assert.ok(/data-toque/.test(svg(idea.pieza, j.dibujo(ini))));
    assert.ok(!j.mision.logrado(ini), 'la misión no está cumplida al abrir');
    const ok = Teoria.grilla(j.controles).filter(v => j.mision.logrado(v));
    assert.equal(ok.length, 1, `${ok.length} combinaciones cumplen la misión`);
    // Las etiquetas de los botones numeran igual que la figura (lección M9 de Analogías).
    const nums = j.controles.map(c => Number((c.etiqueta.match(/\d+/) || [])[0]));
    for (const [n, c] of j.controles.entries()) {
      const id = Object.entries(d.toques).find(([, x]) => x === c.id)[0], h = d.hojas.flatMap(x => x.oraciones), o = h.findIndex(x => x.id === id);
      if (d.hojas.length === 1) assert.equal(nums[n], o + 1, `«${c.etiqueta}» y la oración ${o + 1}`);
    }
  });

  test(`idea ${k} · verbal: la correcta no es la más larga, ni la más corta, ni está escrita dentro de otra`, () => {
    assert.ok(pre.length >= 15, `pocas preguntas (${pre.length})`);
    for (const p of pre) {
      const c = p.ops.filter(o => o.ok);
      assert.equal(c.length, 1, `${p.q}: ${c.length} correctas marcadas`);
      const l = p.ops.map(o => o.t.length), cl = c[0].t.length;
      assert.ok(cl < Math.max(...l) && cl > Math.min(...l), `${p.q}: «${c[0].t}» mide ${cl}; ${l}`);
      const dentro = (a, b) => new RegExp(`(^|\\s)${a}(\\s|$)`, 'i').test(b);
      assert.ok(!p.ops.some(o => o !== c[0] && (dentro(c[0].t, o.t) || dentro(o.t, c[0].t))), `${p.q}: «${c[0].t}» y otra se contienen`);
    }
  });

  test(`idea ${k} · dos incorrectas de una predicción o de un «Ahora tú» no comparten código, y todos están registrados`, () => {
    for (const p of pre.filter(x => x.codigos)) {
      const cs = p.ops.filter(o => !o.ok).map(o => o.error);
      assert.equal(new Set(cs).size, cs.length, `${p.q}: ${cs}`);
      for (const c of cs) assert.ok(codigos[c], `${p.q}: ${c} no está en codigos.json`);
    }
  });

  test(`idea ${k} · R2: en el nivel 3, la respuesta nombra su alternativa y cada letra va una vez`, () => {
    const n3 = pre.filter(p => p.examen && p.nivel === 3);
    assert.equal(n3.length, 5);
    assert.deepEqual(n3.map(p => p.L).sort().join(''), 'ABCDE');
    for (const p of pre.filter(x => x.examen)) assert.ok('ABCDE'.includes(p.L), `${p.q}: la respuesta empieza por su letra`);
  });

  test(`idea ${k} · «Ahora tú» no repite una palabra de la predicción, de «Así se resuelve» ni de los ejemplos, y tiene voz propia`, () => {
    const otras = new Set(pre.filter(p => !/^ahora/.test(p.q)).map(p => p.w).filter(w => w && w !== '______'));
    for (const p of pre.filter(x => /^ahora/.test(x.q))) if (p.w !== '______') assert.ok(!otras.has(p.w), `${p.q}: «${p.w}» ya está en la idea`);
    assert.ok(idea.ahoraTu.voz && !/Lee primero lo que dice/.test(idea.ahoraTu.voz), 'voz propia');
  });

  test(`idea ${k} · R1: el glosario que estrena la idea no copia palabras ni alternativas de la idea`, () => {
    const usadas = new Set();
    for (const p of pre) { if (p.w && p.w !== '______') usadas.add(norm(p.w)); for (const o of p.ops) usadas.add(norm(o.t)); }
    for (const c of idea.juega.controles) for (const o of c.opciones || []) if (String(o.texto).length > 3) usadas.add(norm(o.texto));
    for (const e of porIdea[k - 1]) for (const ej of [e.simple, ...(e.ejemplos || [])]) {
      const t = ` ${norm(ej)} `;
      for (const u of usadas) if (u.length >= 4 && !['sin marcar', 'vacío', 'sin leer', 'pista', 'literal', 'figurado', 'no ayuda'].includes(u)) assert.ok(!t.includes(` ${u} `), `«${e.termino}»: «${ej}» usa «${u}»`);
    }
  });
}

test('el lugar de la correcta se reparte en las listas de nivel 2 (ninguno pasa del 40 %)', () => {
  const pos = [0, 0, 0];
  for (const idea of IDEAS) for (const p of preguntas(idea).filter(x => x.lista)) pos[p.ops.findIndex(o => o.ok)]++;
  const n = pos.reduce((a, b) => a + b, 0);
  assert.equal(n, 25);
  for (const c of pos) assert.ok(c > 0 && c / n <= 0.4, JSON.stringify(pos));
});

test('ninguna palabra de dos lecturas para un alumno peruano', () => {
  // «caliente» (enojado), «vivo» (astuto), «fresco» (descarado), «bravo», «rico», «jalar», «palta» (vergüenza), «piña»
  // (mala suerte), «prendido», «despierto» (listo): en una oración sin contexto se leen de dos maneras.
  const MALOS = /\b(caliente|calientes|vivo|viva|fresco|fresca|bravo|brava|rico|rica|jalar|jaló|piña|prendido|despierto)\b/i;
  const todo = JSON.stringify(IDEAS.map(i => [i.lee, i.juega.controles, i.predice.opciones, i.ejemplos.map(e => [e.enunciado, e.figura.datos]),
    [...Array(12).keys()].map(s => [i.ahoraTu.generar(s).opciones, i.ahoraTu.generar(s).dibujo.datos, i.resuelve.generar(s).dibujo.datos])]));
  const m = todo.match(MALOS);
  assert.ok(!m, `aparece «${m && m[0]}»`);
});

test('las oraciones en trozos dicen lo mismo que su texto entero (el texto alternativo)', () => {
  let n = 0;
  const ver = d => { for (const h of (d && d.hojas) || []) for (const o of h.oraciones || []) if (o.frags) {
    n++;
    const junto = o.frags.map(f => f.t).join(' ').replace(/ ([.,;:!?)»])/g, '$1');
    assert.equal(junto, o.t, `«${o.t}»`);
  } };
  for (const idea of IDEAS) for (const f of figuras(idea)) ver(f.d.datos);
  assert.ok(n > 300, `pocas oraciones (${n})`);
});
