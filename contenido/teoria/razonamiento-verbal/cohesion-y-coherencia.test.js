// Pruebas propias de «Cohesión y coherencia textual» (además del validador común de contenido/teoria/teoria.test.js).
// Miran las cinco ideas, rehechas por el contrato en la etapa 9 (26 nov; docs/etapa9/propuesta-verbal.md). Salen de las
// reglas que dejaron las auditorías de verbal (Tema e idea principal, Definiciones, Analogías, Sentido contextual y
// Conectores; rutinas/auditoria/) y de las lecciones de docs/metodo/unidad/etapa-delegada.md:
//   R1. El glosario se lee antes de jugar: los ejemplos de los términos que estrena una idea no traen la respuesta de su
//       predicción ni copian una oración de sus figuras.
//   R2. En las hojas de examen, la respuesta nombra una alternativa; en el nivel 3 cada letra va una vez por idea, y en
//       «Así se resuelve» cada letra va cuatro veces en la unidad.
//   R5. La primera tarjeta de «Lee» muestra el texto en su soporte (lugar, quién escribe y para quién), y el mismo
//       soporte abre el juego.
//   R9. Solo la paleta de lectura (i, o, f): sin verde ni carmín.
//   M7. Antes de responder, ninguna figura trae marcas ni colores.
//   Verbal (lección 10): la correcta no es la más larga ni la más corta (un empate no delata), ni está escrita dentro de
//   otra; dos incorrectas no comparten código; el lugar de la correcta se reparte en las listas de nivel 2; cada juego se
//   juega tocando el soporte y una sola combinación cumple su misión; «Ahora tú» no repite un texto de la idea.
//   Lección 4: Predice sin Datos (las palabras de las predicciones de esta unidad se entienden sin recuadro, y un dato
//   del tiempo o del pedido le daba al alumno la relación que se predice; nota de la sesión, 26 nov).
// Las medidas se hacen sobre lo que la unidad entrega (textos, opciones, dibujos), sin usar sus funciones internas.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Teoria = require('../../../nucleo/teoria.js');
const def = require('./cohesion-y-coherencia.js');
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
const IDS = ['no-contradiccion', 'referente', 'repetir-sustituir-callar', 'conocido-y-nuevo', 'incluir'];
const oracionesDe = d => (d.hojas || []).flatMap(h => h.oraciones || []);
const textoFig = d => oracionesDe(d).map(o => o.t).join(' ') + ' ' + (d.alternativas || []).map(a => a.t).join(' ');

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
// Las preguntas con alternativas de la idea, con sus textos y cuál es la correcta.
function preguntas(idea) {
  const out = [], ps = idea.predice;
  out.push({ q: 'predice', ops: ps.opciones.map(o => ({ t: o.texto, ok: !!o.correcta, error: o.error, siFuera: o.siFuera })), codigos: true, texto: textoFig(ps.dibujo.datos) });
  const vistos = new Set();
  for (let s = 0; s < SEMILLAS; s++) {
    const A = idea.ahoraTu.generar(s), k = plano(A.pregunta) + JSON.stringify(A.dibujo.datos);
    if (vistos.has(k)) continue; vistos.add(k);
    out.push({ q: `ahora tú ${s}`, texto: textoFig(A.dibujo.datos), ops: A.opciones.map(o => ({ t: o.texto, ok: !!o.correcta, error: o.error, siFuera: o.siFuera })), codigos: true, respuesta: A.opciones.find(o => o.correcta).texto });
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
      if (m) out.push({ q: `ejemplo ${k + 1}`, texto: textoFig(d), ops: m.slice(1).map(t => ({ t, ok: r.startsWith(norm(t)) })), lista: true });
    }
  });
  return out;
}

test('la unidad tiene las cinco ideas en orden, y cada término del glosario trae tres ejemplos', () => {
  assert.deepEqual(IDEAS.map(i => i.id), IDS);
  for (const g of def.glosario) assert.ok((g.ejemplos || []).length >= 3 && g.simple, `«${g.termino}»: simple y tres ejemplos`);
  assert.deepEqual(porIdea.map(l => l.length), [4, 4, 3, 2, 2], 'cada idea estrena sus términos');
});

test('con calidad 2 (simulada), el validador no encuentra nada (200 semillas) y la unidad no agrega excepciones', () => {
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

  test(`idea ${k} · M7 y lección 4: antes de responder, ninguna figura trae marcas ni colores; Predice sin Datos`, () => {
    for (const f of figs.filter(x => x.antes)) {
      const s = svg(f.pieza, f.d);
      assert.ok(!/var\(--c-[a-z]\)/.test(s), `${f.q}: la figura ya trae un color`);
      assert.ok(!/class="rv-(marca|tacha|frase|trozo rv-sub)/.test(s), `${f.q}: la figura ya trae una marca`);
    }
    assert.ok(!idea.predice.datos || !idea.predice.datos.length, 'Predice sin datos');
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
    assert.ok(Object.keys(d.toques || {}).length >= 1, 'zonas tocables');
    for (const c of Object.values(d.toques)) assert.ok(j.controles.some(x => x.id === c), `toque ${c} sin control`);
    assert.equal(Object.keys(d.toques).length, j.controles.length, 'cada control se toca en su oración');
    assert.ok(/data-toque/.test(svg(idea.pieza, j.dibujo(ini))));
    assert.ok(!j.mision.logrado(ini), 'la misión no está cumplida al abrir');
    const ok = Teoria.grilla(j.controles).filter(v => j.mision.logrado(v));
    assert.equal(ok.length, 1, `${ok.length} combinaciones cumplen la misión`);
  });

  test(`idea ${k} · verbal: la correcta no es la más larga, ni la más corta, ni está escrita dentro de otra`, () => {
    assert.ok(pre.length >= 15, `pocas preguntas (${pre.length})`);
    for (const p of pre) {
      const c = p.ops.filter(o => o.ok);
      assert.equal(c.length, 1, `${p.q}: ${c.length} correctas marcadas`);
      const l = p.ops.map(o => o.t.length), cl = c[0].t.length, max = Math.max(...l), min = Math.min(...l);
      assert.ok(!(cl === max && l.filter(x => x === max).length === 1), `${p.q}: «${c[0].t}» es la más larga; ${l}`);
      assert.ok(!(cl === min && l.filter(x => x === min).length === 1), `${p.q}: «${c[0].t}» es la más corta; ${l}`);
      const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const dentro = (a, b) => new RegExp(`(^|\\s)${esc(a)}(\\s|$)`, 'i').test(b);
      assert.ok(!p.ops.some(o => o !== c[0] && (dentro(c[0].t, o.t) || dentro(o.t, c[0].t))), `${p.q}: «${c[0].t}» y otra se contienen`);
    }
  });

  // Auditoría (26 nov): con tres «No» y un «Sí» (o al revés), la correcta se elige sin leer el texto.
  test(`idea ${k} · auditoría: la correcta no es la única que empieza distinto cuando las incorrectas empiezan igual`, () => {
    const pri = t => { const w = t.replace(/^[«"¿¡]/, '').split(/[\s:,]/)[0].toLowerCase(); return { al: 'a', del: 'de' }[w] || w; };
    for (const p of pre) {
      const c = p.ops.find(o => o.ok), ini = new Set(p.ops.filter(o => o !== c).map(o => pri(o.t)));
      assert.ok(!(ini.size === 1 && !ini.has(pri(c.t))), `${p.q}: solo «${c.t}» empieza distinto`);
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
    const ors = new Set(figs.filter(f => !/^ahora/.test(f.q)).flatMap(f => oracionesDe(f.d.datos).map(o => norm(o.t))));
    for (const p of pre.filter(x => /^ahora/.test(x.q))) for (const o of p.texto.split(/(?<=\.)\s+/).map(norm).filter(x => x.split(' ').length > 3))
      assert.ok(!ors.has(o), `${p.q}: la oración «${o}» ya está en otra figura de la idea`);
    assert.ok(idea.ahoraTu.voz, 'voz propia');
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
  const n = pos.reduce((a, b) => a + b, 0);
  assert.ok(n >= 20, `pocas listas (${n})`);
  for (const c of pos) assert.ok(c > 0 && c / n <= 0.4, JSON.stringify(pos));
  assert.deepEqual(Object.values(letras).sort(), [4, 4, 4, 4, 4], JSON.stringify(letras));
});

test('ninguna palabra de dos lecturas para un alumno peruano', () => {
  const MALOS = /\b(caliente|calientes|vivo|viva|fresco|fresca|frescos|frescas|bravo|brava|rico|rica|jalar|jaló|palta|piña|prendido|despierto)\b/i;
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

const TODO = () => JSON.stringify(IDEAS.map(i => [i.titulo, i.temas, i.pregunta, i.actividad, i.lee, i.juega.consigna, i.juega.mision, i.juega.leyenda, i.juega.controles,
  i.predice, i.mira.pasos, i.regla, i.ejemplos.map(e => [e.enunciado, e.datos, e.figura.datos, e.solucion, e.respuesta]),
  [...Array(12).keys()].map(s => [i.resuelve.generar(s), i.ahoraTu.generar(s)])]).concat(def.glosario, def.historia));

test('límites con la rama: ni «pista» ni «contexto», ni «inferencia» ni «conclusión», ni Ilave; ni ordenar ni eliminar oraciones', () => {
  const t = TODO();
  for (const r of [/\bpistas?\b/i, /\bcontextos?\b/i, /inferenc/i, /conclusi/i, /Ilave/, /\bordena/i, /\belimina/i, /redundan/i, /impertinen/i]) assert.ok(!r.test(t), `aparece ${r}`);
});

test('un solo hueco «¿…?», y ninguna oración de un soporte termina en «:», «;» o «,»', () => {
  assert.ok(!/_{3,}/.test(TODO()), 'hueco con raya');
  for (const i of IDEAS) for (const f of figuras(i)) for (const o of oracionesDe(f.d.datos)) assert.ok(!/[:;,]$/.test(o.t), `«${o.t}» sigue en otro número`);
});

test('lo que el resuelto pinta en turquesa es lo que la figura marca', () => {
  const n = s => String(s).toLowerCase().replace(/[«»"'.,;:¿?¡!…]/g, ' ').replace(/\s+/g, ' ').trim();
  const turq = x => (Array.isArray(x) ? x.flatMap(turq) : x && typeof x === 'object' ? (x.v === 'c-i' ? [x.t] : x.texto ? turq(x.texto) : []) : []);
  const mal = [];
  for (const i of IDEAS) for (let s = 0; s < 4; s++) {
    const R = i.resuelve.generar(s), paso = R.pasos.find(p => p.dibujo), marcas = Object.entries(paso.dibujo.estado.marcas).filter(([, c]) => c === 'i').map(([id]) => id);
    const ps = oracionesDe(R.dibujo.datos).flatMap(o => (o.frags || []).filter(f => marcas.includes(f.id)).map(f => n(f.t)));
    for (const t of turq(R.pasos)) if (!n(t).split(' ').every(w => ps.some(p => p.split(' ').includes(w)))) mal.push(`${i.id} resuelve ${s}: «${t}»`);
  }
  assert.deepEqual(mal, []);
});

test('cada incorrecta de «Ahora tú» y de las predicciones empieza por lo que el alumno hizo bien', () => {
  const mal = [];
  for (const i of IDEAS) for (const p of preguntas(i).filter(x => x.codigos)) for (const o of p.ops.filter(x => !x.ok))
    if (!/(^|[^a-záéíóúñ])(bien|cierto|sí|acertaste)([^a-záéíóúñ]|$)/i.test(o.siFuera.split(';')[0])) mal.push(`${i.id} ${p.q}: «${o.siFuera}»`);
  assert.deepEqual([...new Set(mal)], []);
});

test('Mira no muestra letras de alternativas (la app baraja las opciones de Predice)', () => {
  for (const i of IDEAS) assert.ok(!(i.mira.datos.alternativas || []).length, `${i.id}: Mira trae letras`);
});

test('los cuatro primeros «Ahora tú» no piden la misma respuesta que su «Así se resuelve»', () => {
  for (const i of IDEAS) for (let s = 0; s < 4; s++) {
    const A = i.ahoraTu.generar(s), R = i.resuelve.generar(s);
    const a = A.opciones.find(o => o.correcta).texto.toLowerCase(), r = plano(R.respuesta).replace(/^[A-E]: /, '').toLowerCase();
    assert.notEqual(a, r, `${i.id} semilla ${s}: las dos piden «${a}»`);
  }
});

// Las misiones las decide un mundo chico (regla 1). Aquí se rehacen por otro camino, leyendo los textos que la unidad
// muestra, y se comparan con lo que el juego marca.
test('idea 1: el horario choca justo cuando el día cerrado está entre los que abre (calendario aparte)', () => {
  const j = IDEAS[0].juega, DIAS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  const abre = t => (t === 'todos los días' ? DIAS : DIAS.slice(0, DIAS.indexOf(t.split(' a ')[1]) + 1));
  for (const v of Teoria.grilla(j.controles)) {
    const a = j.controles[0].opciones.find(o => o.valor === v.a).texto, c = j.controles[1].opciones.find(o => o.valor === v.c).texto.replace('el ', '');
    const choca = abre(a).includes(c), marca = j.dibujo(v).estado.marcas.h1p;
    assert.equal(marca === 'o', choca, `${a} / ${c}`);
    assert.equal(j.mision.logrado(v), !choca && abre(a).includes('sábado'), `${a} / ${c}: misión`);
  }
});

test('idea 2: cada pronombre bien unido concuerda con su referente, y la lectura nunca dice «undefined»', () => {
  const j = IDEAS[1].juega, G = { 'el pan': 'ms', 'el horno': 'ms', 'la mesa': 'fs', 'la canasta': 'fs', 'tu abuela': 'fs', Rosa: 'fs' }, P = { lo: 'ms', la: 'fs', ella: 'fs' };
  for (const v of Teoria.grilla(j.controles)) {
    const l = plano(j.lectura(v));
    assert.ok(!/undefined|NaN|object/.test(l), l);
    for (const c of j.controles) {
      const t = c.opciones.find(o => o.valor === v[c.id]).texto;
      if (/no concuerdan/.test(l) && l.includes(`«${t}»`) && l.toLowerCase().includes(`«${c.id}»`)) assert.notEqual(G[t], P[c.id], l);
    }
  }
});

// Auditoría (26 nov): en las ideas 1 y 5, una línea del recuadro («lo que una persona cree…», «“todos” y “ninguno”…»)
// salía solo en los ejercicios cuya respuesta la usa, y así la delataba. Ahora el recuadro es el mismo en todo ejercicio
// de la idea (ejemplos, «Así se resuelve» y «Ahora tú»).
test('auditoría: en las ideas 1 y 5, el recuadro «Datos» es el mismo en todos los ejercicios', () => {
  for (const id of ['no-contradiccion', 'incluir']) {
    const idea = IDEAS.find(i => i.id === id), vistos = new Set();
    for (const e of idea.ejemplos) vistos.add(JSON.stringify(e.datos));
    for (let s = 0; s < 12; s++) { vistos.add(JSON.stringify(idea.ahoraTu.generar(s).datos)); vistos.add(JSON.stringify(idea.resuelve.generar(s).datos)); }
    assert.equal(vistos.size, 1, `${id}: ${[...vistos].join(' | ')}`);
  }
});
