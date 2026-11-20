// Pruebas propias de «Conectores lógico-textuales» (además del validador común de contenido/teoria/teoria.test.js).
// Miran las cinco ideas, rehechas por el contrato en la etapa 8 (19 nov; docs/etapa8/propuesta-verbal.md). Salen de las
// reglas que dejaron las auditorías de Tema e idea principal, Definiciones, Analogías y Sentido contextual
// (rutinas/auditoria/) y de las notas de la sesión sobre la idea 1:
//   R1. El glosario se lee antes de jugar: los ejemplos de los términos que estrena una idea no traen la respuesta de su
//       predicción ni copian una oración de sus figuras.
//   R2. En las hojas de examen, la respuesta nombra una alternativa; en el nivel 3 cada letra va una vez por idea, y en
//       «Así se resuelve» cada letra va cuatro veces en la unidad (lección B4 de Sentido contextual).
//   R5. La primera tarjeta de «Lee» muestra el texto en su soporte (lugar, quién escribe y para quién), y el mismo
//       soporte abre el juego.
//   R9. Solo la paleta de lectura (i, o, f): sin verde ni carmín.
//   M7. Antes de responder, ninguna figura trae marcas ni colores (el espacio o el conector va solo en negrita).
//   Verbal: la correcta no es la más larga, ni la más corta, ni está escrita dentro de otra alternativa; dos incorrectas de
//   una predicción o de un «Ahora tú» no comparten código; el lugar de la correcta se reparte en las listas de nivel 2;
//   los juegos se juegan tocando el soporte y una sola combinación cumple su misión; «Ahora tú» no repite un texto de la
//   idea y tiene voz propia; ninguna palabra de dos lecturas para un alumno peruano.
//   Cierre de Sentido contextual (M1, M3, M7, M9, B1): Datos sin nombres de trampa; «pista» y «contexto» no se usan (son
//   términos de Sentido contextual); un solo hueco «¿…?»; el cuaderno de Mira sin numerar junto; lo que el resuelto
//   pinta en turquesa está marcado en la figura.
// Las medidas se hacen sobre lo que la unidad entrega (textos, opciones, dibujos), sin usar sus funciones internas.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Teoria = require('../../../nucleo/teoria.js');
const def = require('./conectores.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const Kit = require('../../../nucleo/kit/kit.js');
const Glosario = require('../../../nucleo/glosario.js');
const codigos = require('../../razonamiento-verbal/codigos.json');

const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x == null ? '' : typeof x === 'object' ? plano(x.t !== undefined ? x.t : x.negrita !== undefined ? x.negrita : x.texto !== undefined ? x.texto : '') : String(x)).replace(/⁠/g, '');
const norm = s => plano(s).toLowerCase().replace(/[.,;:¿?¡!«»"()–]/g, ' ').replace(/\s+/g, ' ').trim();
const SEMILLAS = 60;
const svg = (pieza, d) => Kit.piezas[pieza].dibujar(d.datos, d.estado || {});
const IDEAS = def.ideas;
const porIdea = Glosario.porIdea(def);
const IDS = ['relacion-primero', 'causa-consecuencia', 'clases', 'locuciones', 'varios-espacios'];
const oracionesDe = d => (d.hojas || []).flatMap(h => h.oraciones || []);
const textoFig = d => oracionesDe(d).map(o => o.t).join(' ');

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
const negrita = d => { for (const o of oracionesDe(d)) for (const f of o.frags || []) if (f.negrita) return f.t; return null; };
// Las preguntas con alternativas de la idea, con sus textos y cuál es la correcta.
function preguntas(idea) {
  const out = [], ps = idea.predice;
  out.push({ q: 'predice', ops: ps.opciones.map(o => ({ t: o.texto, ok: !!o.correcta, error: o.error, siFuera: o.siFuera })), codigos: true, texto: textoFig(ps.dibujo.datos) });
  const vistos = new Set();
  for (let s = 0; s < SEMILLAS; s++) {
    const A = idea.ahoraTu.generar(s), k = plano(A.pregunta) + JSON.stringify(A.dibujo.datos);
    if (vistos.has(k)) continue; vistos.add(k);
    out.push({ q: `ahora tú ${s}`, texto: textoFig(A.dibujo.datos), ops: A.opciones.map(o => ({ t: o.texto, ok: !!o.correcta, error: o.error, siFuera: o.siFuera })), codigos: true });
  }
  const vr = new Set();
  for (let s = 0; s < 12; s++) {
    const R = idea.resuelve.generar(s), d = R.dibujo.datos;
    if (vr.has(R.enunciado)) continue; vr.add(R.enunciado);
    const L = plano(R.respuesta)[0];
    out.push({ q: `resuelve ${s}`, texto: textoFig(d), L, ops: d.alternativas.map(a => ({ t: a.t, ok: a.id === L })), examen: true, resuelve: true });
  }
  idea.ejemplos.forEach((e, k) => {
    const d = e.figura.datos;
    if ((d.alternativas || []).length) {
      const L = plano(e.respuesta)[0];
      out.push({ q: `ejemplo ${k + 1}`, texto: textoFig(d), L, ops: d.alternativas.map(a => ({ t: a.t, ok: a.id === L })), examen: true, nivel: e.nivel });
    } else if (e.nivel === 2) {
      const m = e.enunciado.match(/«([^»]+)», «([^»]+)» o «([^»]+)»/), r = norm(e.respuesta);
      assert.ok(m, `${idea.id} ejemplo ${k + 1}: lista «x», «y» o «z»`);
      out.push({ q: `ejemplo ${k + 1}`, texto: textoFig(d), ops: m.slice(1).map(t => ({ t, ok: norm(t) === r })), lista: true });
    }
  });
  return out;
}

test('la unidad tiene las cinco ideas en orden, y cada término del glosario trae tres ejemplos', () => {
  assert.deepEqual(IDEAS.map(i => i.id), IDS);
  for (const g of def.glosario) assert.ok((g.ejemplos || []).length >= 3, `«${g.termino}»: tres ejemplos`);
  assert.deepEqual(porIdea.map(l => l.length), [4, 2, 4, 2, 2], 'cada idea estrena sus términos');
});

test('lleva calidad 2, el validador no encuentra nada (200 semillas) y la unidad no agrega excepciones', () => {
  assert.equal(def.calidad, 2, 'cerrada el 20 nov tras el lector en frío y el auditor');
  assert.deepEqual(Teoria.problemas(Object.assign({}, def, { calidad: 2 }), { semillas: 200 }), []);
  assert.deepEqual(Teoria.pendientes(Object.assign({}, def, { calidad: 2 })), []);
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

  test(`idea ${k} · M7: antes de responder, ninguna figura trae marcas ni colores; el espacio o el conector va en negrita`, () => {
    for (const f of figs.filter(x => x.antes)) {
      const s = svg(f.pieza, f.d);
      assert.ok(!/var\(--c-[a-z]\)/.test(s), `${f.q}: la figura ya trae un color`);
      assert.ok(!/class="rv-(marca|tacha|frase|trozo rv-sub)/.test(s), `${f.q}: la figura ya trae una marca`);
    }
    for (const f of figs.filter(x => /^(predice|resuelve \d+|ahora tú \d+|ejemplo \d+)$/.test(x.q))) assert.ok(negrita(f.d.datos), `${f.q}: sin negrita`);
    assert.ok(!idea.predice.datos || !idea.predice.datos.length, 'Predice sin datos');
  });

  test(`idea ${k} · R5: la primera tarjeta de «Lee» muestra el texto en su soporte, y el mismo soporte abre el juego`, () => {
    const t = idea.lee.tarjetas[0];
    assert.equal(t.pieza, 'rv-soporte');
    const d = t.dibujo.datos;
    assert.ok(d.soporte === 'simulacro' || (d.lugar && d.hojas.every(h => h.de && h.para)), 'lugar, quién escribe y para quién');
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
    // Los botones numeran igual que la figura (lección M9 de Analogías): «Oración 2» es la oración 2; «Alternativa B», la B.
    for (const c of j.controles) {
      const id = Object.entries(d.toques).find(([, x]) => x === c.id)[0], o = oracionesDe(d).findIndex(x => x.id === id);
      if (o >= 0) assert.equal(Number(c.etiqueta.match(/\d+/)[0]), o + 1, `«${c.etiqueta}» y la oración ${o + 1}`);
      else assert.ok(c.etiqueta.endsWith(` ${id}`), `«${c.etiqueta}» y la alternativa ${id}`);
    }
  });

  test(`idea ${k} · verbal: la correcta no es la más larga, ni la más corta, ni está escrita dentro de otra`, () => {
    assert.ok(pre.length >= 15, `pocas preguntas (${pre.length})`);
    for (const p of pre) {
      const c = p.ops.filter(o => o.ok);
      assert.equal(c.length, 1, `${p.q}: ${c.length} correctas marcadas`);
      const l = p.ops.map(o => o.t.length), cl = c[0].t.length;
      assert.ok(cl < Math.max(...l) && cl > Math.min(...l), `${p.q}: «${c[0].t}» mide ${cl}; ${l}`);
      const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const dentro = (a, b) => new RegExp(`(^|\\s)${esc(a)}(\\s|$)`, 'i').test(b);
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

  test(`idea ${k} · «Ahora tú» no repite un texto de la predicción, de «Así se resuelve» ni de los ejemplos, y tiene voz propia`, () => {
    const otras = new Set(pre.filter(p => !/^ahora/.test(p.q)).map(p => norm(p.texto)));
    for (const p of pre.filter(x => /^ahora/.test(x.q))) assert.ok(!otras.has(norm(p.texto)), `${p.q}: «${p.texto}» ya está en la idea`);
    assert.ok(idea.ahoraTu.voz && !/Lee primero lo que dice/.test(idea.ahoraTu.voz), 'voz propia');
  });

  test(`idea ${k} · R1: el glosario que estrena la idea no trae la respuesta de la predicción ni copia una oración de sus figuras`, () => {
    const ok = norm(idea.predice.opciones.find(o => o.correcta).texto);
    const oraciones = [...new Set(figs.flatMap(f => oracionesDe(f.d.datos).map(o => norm(o.t))))];
    const cinco = new Set(oraciones.flatMap(o => { const w = o.split(' '); return w.slice(4).map((_, i) => w.slice(i, i + 5).join(' ')); }));
    for (const e of porIdea[k - 1]) for (const ej of [e.simple, ...(e.ejemplos || [])]) {
      const t = norm(ej), w = t.split(' ');
      assert.ok(!t.includes(ok), `«${e.termino}»: «${ej}» trae la respuesta de la predicción`);
      for (let i = 0; i + 5 <= w.length; i++) assert.ok(!cinco.has(w.slice(i, i + 5).join(' ')), `«${e.termino}»: «${ej}» copia una oración de la idea`);
    }
  });
}

test('el lugar de la correcta se reparte en las listas de nivel 2 (ninguno pasa del 40 %), y en «Así se resuelve» cada letra va cuatro veces', () => {
  const pos = [0, 0, 0], letras = {};
  for (const idea of IDEAS) for (const p of preguntas(idea)) {
    if (p.lista) pos[p.ops.findIndex(o => o.ok)]++;
    if (p.resuelve) letras[p.L] = (letras[p.L] || 0) + 1;
  }
  assert.equal(pos.reduce((a, b) => a + b, 0), 25);
  for (const c of pos) assert.ok(c > 0 && c / 25 <= 0.4, JSON.stringify(pos));
  assert.deepEqual(Object.values(letras), [4, 4, 4, 4, 4], JSON.stringify(letras));
});

test('ninguna palabra de dos lecturas para un alumno peruano', () => {
  const MALOS = /\b(caliente|calientes|vivo|viva|fresco|fresca|bravo|brava|rico|rica|jalar|jaló|palta|piña|prendido|despierto)\b/i;
  const todo = JSON.stringify(IDEAS.map(i => [i.lee, i.juega.controles, i.predice.opciones, i.ejemplos.map(e => [e.enunciado, e.figura.datos]),
    [...Array(12).keys()].map(s => [i.ahoraTu.generar(s).opciones, i.ahoraTu.generar(s).dibujo.datos, i.resuelve.generar(s).dibujo.datos])]));
  const m = todo.match(MALOS);
  assert.ok(!m, `aparece «${m && m[0]}»`);
});

test('las oraciones en trozos dicen lo mismo que su texto entero (el texto alternativo)', () => {
  let n = 0;
  for (const idea of IDEAS) for (const f of figuras(idea)) for (const o of oracionesDe(f.d.datos)) if (o.frags) {
    n++;
    const junto = o.frags.map(x => x.t).join(' ').replace(/ ([.,;:!?)»])/g, '$1');
    assert.equal(junto, o.t, `«${o.t}»`);
  }
  assert.ok(n > 300, `pocas oraciones (${n})`);
});

// ---------- Lo que dejó el cierre de Sentido contextual (rutinas/auditoria/razonamiento-verbal.sentido-contextual.md) ----------
const TODO = () => JSON.stringify(IDEAS.map(i => [i.titulo, i.temas, i.pregunta, i.actividad, i.lee, i.juega.consigna, i.juega.mision, i.juega.leyenda, i.juega.controles,
  i.predice, i.mira.pasos, i.regla, i.ejemplos.map(e => [e.enunciado, e.datos, e.figura.datos, e.solucion, e.respuesta]),
  [...Array(12).keys()].map(s => [i.resuelve.generar(s), i.ahoraTu.generar(s)])]).concat(def.glosario, def.historia));

test('cierre · ni «pista» ni «contexto» (de Sentido contextual), ni «inferencia» ni «conclusión» (de Inferencias), ni Ilave (se lee «llave»)', () => {
  const t = TODO();
  for (const r of [/\bpistas?\b/i, /\bcontextos?\b/i, /inferenc/i, /conclusi/i, /Ilave/]) assert.ok(!r.test(t), `aparece ${r}`);
});

test('cierre · Datos de los niveles 2 y 3, «Así se resuelve» y «Ahora tú»: sin nombres de trampa', () => {
  for (const i of IDEAS) {
    for (const e of i.ejemplos.filter(x => x.nivel > 1)) for (const l of e.datos) assert.ok(!/^Al revés:/.test(l), `${i.id} «${e.titulo}»: «${l}»`);
    for (let s = 0; s < 12; s++) for (const l of [...i.resuelve.generar(s).datos, ...i.ahoraTu.generar(s).datos]) assert.ok(!/^Al revés:/.test(l), `${i.id} semilla ${s}: «${l}»`);
  }
});

test('cierre · un solo hueco «¿…?» y ningún botón inicial «vacío»; ninguna oración de un soporte termina en «:», «;» o «,»', () => {
  assert.ok(!/_{3,}/.test(TODO()), 'hueco con raya');
  for (const i of IDEAS) for (const c of i.juega.controles) { assert.equal(c.opciones[0].texto, '¿…?'); for (const o of c.opciones) assert.ok(!/^(vacío|sin leer|sin marcar)$/.test(o.texto)); }
  for (const i of IDEAS) for (const f of figuras(i)) for (const o of oracionesDe(f.d.datos)) assert.ok(!/[:;,]$/.test(o.t), `«${o.t}» sigue en otro número`);
});

test('cierre · el cuaderno de Mira no numera juntas la oración y lo que se prueba', () => {
  for (const i of IDEAS.filter(x => x.mira.datos.soporte === 'cuaderno')) {
    // Lo que se estudia (las oraciones en trozos, una o dos) va sin número; lo que se prueba, con raya (cierre, 20 nov:
    // la idea 5 estudia un texto de dos oraciones).
    const os = i.mira.datos.hojas[0].oraciones;
    assert.ok(os[0].frags && os[0].num === '', `${i.id}: la oración que se estudia va sin número`);
    for (const o of os.slice(1)) assert.equal(o.num, o.frags ? '' : '–', `${i.id}: «${o.t}»`);
    assert.ok(os.some(o => !o.frags), `${i.id}: lo que se prueba`);
  }
});

test('cierre · lo que el resuelto pinta en turquesa es lo que la figura marca', () => {
  const n = s => String(s).toLowerCase().replace(/[«»"'.,;:¿?¡!]/g, '').replace(/\s+/g, ' ').trim();
  const turq = x => (Array.isArray(x) ? x.flatMap(turq) : x && typeof x === 'object' ? (x.v === 'c-i' ? [x.t] : x.texto ? turq(x.texto) : []) : []);
  for (const i of IDEAS) for (let s = 0; s < 4; s++) {
    const R = i.resuelve.generar(s);
    const ps = oracionesDe(R.dibujo.datos).flatMap(o => (o.frags || []).filter(f => /[pq]$/.test(f.id) && f.id.length === o.id.length + 1).map(f => n(f.t)));
    for (const t of turq(R.pasos)) assert.ok(ps.some(p => p.includes(n(t))), `${i.id} resuelve ${s}: «${t}» no está marcada`);
  }
});

test('cierre · cada incorrecta de «Ahora tú» y de las predicciones empieza por lo que el alumno hizo bien', () => {
  for (const i of IDEAS) for (const p of preguntas(i).filter(x => x.codigos)) for (const o of p.ops.filter(x => !x.ok))
    assert.ok(/bien/.test(o.siFuera.split(';')[0]), `${i.id} ${p.q}: «${o.siFuera}»`);
});

test('varios espacios: la correcta no se adivina por ser la que más comparte con las demás (la «central» de probarFugas)', () => {
  const dist = (a, b) => { const A = a.split(' – '), B = b.split(' – '); return A.filter((x, k) => x.toLowerCase() !== (B[k] || '').toLowerCase()).length; };
  let n = 0;
  for (const i of IDEAS) for (const p of preguntas(i).filter(x => x.ops[0].t.includes(' – '))) {
    n++;
    const sc = p.ops.map(a => p.ops.reduce((t, b) => t + dist(a.t, b.t), 0)), min = Math.min(...sc);
    const mejores = p.ops.filter((a, k) => sc[k] === min);
    assert.ok(!(mejores.length === 1 && mejores[0].ok), `${i.id} ${p.q}: «${mejores[0].t}» es la central`);
  }
  assert.ok(n >= 20, `pocas preguntas de varios espacios (${n})`);
});

// ---------- Lo que dejó el cierre de esta unidad (20 nov; rutinas/auditoria/razonamiento-verbal.conectores.md) ----------
// Tabla propia de la prueba (no la de la unidad): la relación de cada conector.
const REL_T = {};
for (const [r, cs] of Object.entries({ adición: 'además de que|además|también|asimismo|así como', contraste: 'sin embargo|pero|aun así|no obstante|en cambio',
  consecuencia: 'por eso|así que|por lo tanto|por consiguiente|de modo que|de manera que', causa: 'porque|ya que|dado que|puesto que|como',
  concesión: 'aunque|si bien|a pesar de que|aun cuando', ejemplo: 'por ejemplo', reformulación: 'es decir|o sea|en otras palabras',
  orden: 'primero|antes|después|finalmente', cierre: 'en resumen|en síntesis|en suma' })) for (const c of cs.split('|')) REL_T[c] = r;
const esConector = t => t.split(' – ').every(c => REL_T[c.toLowerCase()]);
// Cada pregunta con alternativas de conectores, con sus Datos.
function conDatos(idea) {
  const out = [];
  for (let s = 0; s < 6; s++) {
    const A = idea.ahoraTu.generar(s); out.push({ q: `ahora tú ${s}`, ops: A.opciones.map(o => o.texto), ok: A.opciones.find(o => o.correcta).texto, datos: A.datos });
    const R = idea.resuelve.generar(s); out.push({ q: `resuelve ${s}`, ops: R.dibujo.datos.alternativas.map(a => a.t), ok: plano(R.respuesta).replace(/^[A-E]: /, ''), datos: R.datos });
  }
  for (const e of idea.ejemplos.filter(x => x.nivel > 1)) {
    const d = e.figura.datos, m = e.enunciado.match(/«([^»]+)», «([^»]+)» o «([^»]+)»/);
    const ops = (d.alternativas || []).length ? d.alternativas.map(a => a.t) : m ? m.slice(1) : [];
    out.push({ q: `«${e.titulo}»`, ops, ok: plano(e.respuesta).replace(/^[A-E]: /, '').replace(/[«»]/g, ''), datos: e.datos });
  }
  return out.filter(p => p.ops.length && p.ops.every(esConector));
}

test('cierre · la puntuación junto al espacio no delata el conector: dentro de la oración va «, ¿…?» y nunca «¿…?,»', () => {
  let n = 0;
  for (const i of IDEAS) for (const f of figuras(i).filter(x => x.antes)) for (const o of oracionesDe(f.d.datos)) {
    for (const m of o.t.matchAll(/¿…\?(?: \(\d\))?/g)) {
      const antes = o.t.slice(0, m.index), despues = o.t.slice(m.index + m[0].length);
      if (/^\s*\.?\s*$/.test(despues)) continue; // el espacio del final: se completa la idea, no va un conector
      n++;
      assert.ok(!/^,/.test(despues), `${i.id} ${f.q}: «${o.t}» lleva coma después del espacio`);
      assert.ok(!antes.trim() || /\.\s*$/.test(antes) || /, $/.test(antes), `${i.id} ${f.q}: «${o.t}»: el espacio no va tras una coma`);
    }
  }
  assert.ok(n > 100, `pocos espacios (${n})`);
});

test('cierre · Datos: cada conector de cada alternativa tiene su relación en el recuadro, y no pasan de 6 líneas', () => {
  const nt = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  let n = 0;
  for (const i of IDEAS) for (const p of conDatos(i)) {
    n++;
    const D = nt(p.datos.join(' '));
    assert.ok(p.datos.length <= 6, `${i.id} ${p.q}: ${p.datos.length} líneas`);
    for (const t of p.ops) for (const c of t.split(' – ')) assert.ok(new RegExp(`[(,] ?${nt(c)}[,)]`).test(D) || D.includes(`«${nt(c)}»`), `${i.id} ${p.q}: «${c}» no está en los Datos`);
  }
  assert.ok(n > 80, `pocas preguntas (${n})`);
});

test('cierre · varios espacios: ni «la que más comparte», ni «la que menos», ni «la más repetida por lugar» aciertan más que el azar', () => {
  let n = 0;
  for (const i of IDEAS) for (const p of preguntas(i).filter(x => x.ops[0].t.includes(' – '))) {
    n++;
    const sp = p.ops.map(o => o.t.toLowerCase().split(' – ')), c = p.ops.findIndex(o => o.ok), az = 1 / sp.length + 0.15;
    const sc = sp.map(a => sp.reduce((t, b) => t + (a === b ? 0 : a.filter((x, k) => x === b[k]).length), 0));
    const prob = vals => { const m = Math.max(...vals), top = vals.map((v, k) => (v === m ? k : -1)).filter(k => k >= 0); return top.includes(c) ? 1 / top.length : 0; };
    assert.ok(prob(sc) <= az, `${i.id} ${p.q}: la correcta es de las que más comparten`);
    assert.ok(prob(sc.map(v => -v)) <= az, `${i.id} ${p.q}: la correcta es de las que menos comparten`);
    const pts = sp.map(() => 0);
    for (let k = 0; k < sp[0].length; k++) {
      const f = {}; sp.forEach(a => { f[a[k]] = (f[a[k]] || 0) + 1; });
      const m = Math.max(...Object.values(f));
      if (Object.values(f).every(v => v === m)) continue;
      sp.forEach((a, j) => { if (f[a[k]] === m) pts[j]++; });
    }
    assert.ok(prob(pts) <= az, `${i.id} ${p.q}: la correcta es la más repetida por lugar`);
  }
  assert.ok(n >= 20, `pocas preguntas (${n})`);
});

test('cierre · el cierre junta lo que el texto ya dijo: la última oración del folleto no trae nada nuevo', () => {
  const d = IDEAS[2].predice.dibujo.datos, os = oracionesDe(d), ult = os[os.length - 1];
  const antes = norm(os.slice(0, -1).map(o => o.t).join(' ')), raiz = w => w.slice(0, 4);
  const dichas = new Set(antes.split(' ').filter(w => w.length >= 4).map(raiz));
  for (const w of norm(ult.frags.filter(f => /p$/.test(f.id)).map(f => f.t).join(' ')).split(' ').filter(x => x.length >= 5))
    assert.ok(dichas.has(raiz(w)), `«${w}» no está en el folleto`);
});

test('cierre · ninguna definición de los Datos se contradice: el orden en el tiempo lista «antes» y no dice «pasa después de la primera»', () => {
  const lineas = new Set(IDEAS.flatMap(i => [...i.ejemplos.map(e => e.datos), ...[0, 1, 2, 3, 4, 5].flatMap(s => [i.resuelve.generar(s).datos, i.ahoraTu.generar(s).datos])]).flat());
  for (const l of lineas) if (/\bantes\b,/.test(l)) assert.ok(!/pasa después de la primera/.test(l), `«${l}»`);
});

test('cierre · Mira no muestra letras de alternativas (la app baraja las opciones de Predice)', () => {
  for (const i of IDEAS) assert.ok(!(i.mira.datos.alternativas || []).length, `${i.id}: Mira trae letras`);
});

test('cierre · los cuatro primeros «Ahora tú» no piden la misma respuesta que su «Así se resuelve»', () => {
  for (const i of IDEAS) for (let s = 0; s < 4; s++) {
    const A = i.ahoraTu.generar(s), R = i.resuelve.generar(s);
    const a = A.opciones.find(o => o.correcta).texto.toLowerCase(), r = plano(R.respuesta).replace(/^[A-E]: /, '').toLowerCase();
    assert.notEqual(a, r, `${i.id} semilla ${s}: las dos piden «${a}»`);
    if (REL_T[a] && REL_T[r]) assert.notEqual(REL_T[a], REL_T[r], `${i.id} semilla ${s}: las dos piden ${REL_T[a]}`);
  }
});

test('cierre · la regla de la idea 2 muestra los dos órdenes y «por eso» no se parte en dos renglones', () => {
  const e = plano(IDEAS[1].regla.ecuacion);
  assert.ok(/por eso/.test(e) && /porque/.test(e), e);
});
