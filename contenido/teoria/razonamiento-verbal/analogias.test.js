// Pruebas propias de «Analogías» (además del validador común de contenido/teoria/teoria.test.js). Miran las cinco ideas,
// rehechas por el contrato en la etapa 6 (19 nov). Salen de las reglas que dejaron las auditorías de Tema e idea principal
// y de Definiciones (rutinas/auditoria/razonamiento-verbal.*.md) y de las notas de la etapa:
//   R1. El glosario se lee antes de jugar: los ejemplos de los términos que estrena una idea no copian un par ni una
//       frase de su juego, su predicción, su «Ahora tú» o sus ejemplos.
//   R2. En las hojas con letras fijas, la respuesta nombra una alternativa; en el nivel 3 cada letra va una vez por idea.
//   R5. La primera tarjeta de «Lee» muestra el texto en su soporte, y el mismo soporte abre el juego.
//   R9. Solo la paleta de lectura (i, o, f): sin verde ni carmín.
//   M7. Antes de responder, ninguna figura trae marcas ni colores.
//   Verbal (etapa 6): la correcta no es la más larga, ni la más corta, ni la única escrita dentro de otra alternativa,
//   ni la única que no repite una palabra del par base; en las hojas de examen ninguna alternativa repite una palabra
//   del par base; dos incorrectas de una pregunta no comparten código; la buena cambia de lugar; los juegos se juegan
//   tocando la hoja y una sola combinación cumple su misión; «Ahora tú» no repite un caso de la idea.
// Las medidas se hacen sobre lo que la unidad entrega (textos, opciones, dibujos), sin usar sus funciones internas.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Teoria = require('../../../nucleo/teoria.js');
const def = require('./analogias.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const Kit = require('../../../nucleo/kit/kit.js');
const Glosario = require('../../../nucleo/glosario.js');

const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x == null ? '' : typeof x === 'object' ? plano(x.t !== undefined ? x.t : x.negrita !== undefined ? x.negrita : '') : String(x)).replace(/⁠/g, '');
const norm = s => plano(s).toLowerCase().replace(/[.,;:¿?¡!«»"()]/g, ' ').replace(/\s+/g, ' ').trim();
const SEMILLAS = 60;
const svg = (pieza, d) => Kit.piezas[pieza].dibujar(d.datos, d.estado || {});
const IDEAS = def.ideas;
const porIdea = Glosario.porIdea(def);
const NUEVAS = ['relacion-no-tema', 'parte-o-clase', 'clase-y-causa', 'sinonimo-antonimo', 'puente-justa'];
const listas = IDEAS.filter(i => NUEVAS.includes(i.id));

// Todas las figuras de la idea, con su pieza y el momento en que se ven.
function figuras(idea) {
  const out = [], j = idea.juega;
  for (const t of idea.lee.tarjetas) if (t.dibujo) out.push({ q: 'lee', pieza: t.pieza, d: t.dibujo });
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
// El soporte de una figura (rv-definicion lo trae dentro).
const sopDe = d => (d && d.soporte && typeof d.soporte === 'object' ? d.soporte : d);
// El par base de una hoja: el renglón «X : Y ::».
const baseDe = d => { const s = sopDe(d), o = s && s.hojas && s.hojas[0].oraciones && s.hojas[0].oraciones.find(x => /::$/.test(x.t)); return o ? o.t.replace(/::$/, '').toLowerCase().split(' : ').map(w => w.trim()) : null; };
const palabras = t => norm(t).split(' ').filter(w => w.length >= 3);

// Las preguntas con alternativas de la idea: la predicción, los «Ahora tú» distintos, las hojas de «Así se resuelve» y
// de los ejemplos de nivel 3. Cada una con su par base, sus textos y cuál es la correcta.
function preguntas(idea) {
  const out = [];
  const ps = idea.predice;
  out.push({ q: 'predice', base: baseDe(ps.dibujo.datos), ops: ps.opciones.map(o => ({ t: o.texto, ok: !!o.correcta, error: o.error })), codigos: true });
  const vistos = new Set();
  for (let s = 0; s < SEMILLAS; s++) {
    const A = idea.ahoraTu.generar(s), k = plano(A.pregunta) + JSON.stringify(A.dibujo.datos);
    if (vistos.has(k)) continue; vistos.add(k);
    out.push({ q: `ahora tú ${s}`, base: baseDe(A.dibujo.datos), ops: A.opciones.map(o => ({ t: o.texto, ok: !!o.correcta, error: o.error })), codigos: true });
  }
  const vr = new Set();
  for (let s = 0; s < 12; s++) {
    const R = idea.resuelve.generar(s), d = sopDe(R.dibujo.datos);
    if (vr.has(R.enunciado)) continue; vr.add(R.enunciado);
    if (!(d.alternativas || []).length) continue;
    const L = plano(R.respuesta)[0];
    out.push({ q: `resuelve ${s}`, base: baseDe(R.dibujo.datos), L, ops: d.alternativas.map(a => ({ t: a.t, ok: a.id === L })), examen: true });
  }
  idea.ejemplos.forEach((e, k) => {
    const d = sopDe(e.figura.datos);
    if (!(d.alternativas || []).length) return;
    const L = plano(e.respuesta)[0];
    out.push({ q: `ejemplo ${k + 1}`, base: baseDe(e.figura.datos), L, ops: d.alternativas.map(a => ({ t: a.t, ok: a.id === L })), examen: true, nivel: e.nivel });
  });
  return out;
}

test('la unidad tiene las cinco ideas en orden, y cada término del glosario trae tres ejemplos', () => {
  assert.deepEqual(IDEAS.map(i => i.id), NUEVAS);
  for (const g of def.glosario) assert.ok((g.ejemplos || []).length >= 3, `«${g.termino}»: tres ejemplos`);
});

test('la unidad lleva calidad 2 y pasa el validador', () => {
  assert.equal(def.calidad, 2, 'cerrada el 19 nov tras el lector en frío y el auditor');
  assert.deepEqual(Teoria.problemas(Object.assign({}, def, { calidad: 2 }), { semillas: SEMILLAS }), []);
});

for (const idea of listas) {
  const k = IDEAS.indexOf(idea) + 1, figs = figuras(idea), pre = preguntas(idea);

  test(`idea ${k} (${idea.id}) · R9: solo la paleta de lectura (turquesa, naranja, violeta); sin verde ni carmín`, () => {
    assert.ok(figs.length > 30, 'la prueba no corre en vacío');
    for (const f of figs) for (const [, c] of svg(f.pieza, f.d).matchAll(/var\(--c-([a-z])\)/g)) assert.ok(['i', 'o', 'f'].includes(c), `${f.q}: color ${c}`);
    const textos = JSON.stringify([idea.juega.leyenda, Teoria.grilla(idea.juega.controles).map(v => idea.juega.lectura(v)), idea.mira.pasos.map(p => p.ecuacion), idea.regla.ecuacion,
      idea.ejemplos.map(e => [e.solucion, e.respuesta]), [...Array(12).keys()].map(s => idea.resuelve.generar(s)), [...Array(12).keys()].map(s => idea.ahoraTu.generar(s).solucion)]);
    assert.ok(!/"c-[dh]"/.test(textos), 'sin verde (c-d) ni carmín (c-h) en los textos de la idea');
  });

  test(`idea ${k} · M7: antes de responder, ninguna figura trae marcas ni colores de la paleta`, () => {
    for (const f of figs.filter(x => x.antes)) {
      const s = svg(f.pieza, f.d);
      assert.ok(!/var\(--c-[a-z]\)/.test(s), `${f.q}: la figura ya trae un color`);
      assert.ok(!/class="rv-(marca|tacha|pieza|frase)/.test(s), `${f.q}: la figura ya trae una marca`);
    }
  });

  test(`idea ${k} · R5: la primera tarjeta de «Lee» muestra el texto en su soporte, y el mismo soporte abre el juego`, () => {
    const t = idea.lee.tarjetas[0];
    assert.equal(t.pieza, 'rv-soporte');
    const d = t.dibujo.datos, h = d.hojas[0];
    assert.ok(h.oraciones.length >= 1 && (d.soporte === 'simulacro' || (d.lugar && h.de && h.para)), 'lugar, quién escribe y para quién');
    const abre = sopDe(idea.juega.dibujo(Teoria.inicio(idea.juega)).datos);
    const sinToques = x => Object.fromEntries(Object.entries(x).filter(([c]) => c !== 'toques'));
    assert.deepEqual(sinToques(abre), sinToques(d));
  });

  test(`idea ${k} · la correcta no es la más larga, ni la más corta, ni la única escrita dentro de otra; un código por incorrecta`, () => {
    const codigos = require('../../razonamiento-verbal/codigos.json');
    assert.ok(pre.filter(p => p.codigos).length >= 7, 'la predicción y seis «Ahora tú»');
    for (const p of pre) {
      const l = p.ops.map(o => o.t.length), c = p.ops.find(o => o.ok).t.length;
      assert.ok(c < Math.max(...l) && c > Math.min(...l), `${p.q}: la correcta mide ${c} y las opciones van de ${Math.min(...l)} a ${Math.max(...l)}`);
      const dentro = p.ops.filter(o => p.ops.some(x => x !== o && x.t.toLowerCase().includes(o.t.toLowerCase())));
      assert.ok(!(dentro.length === 1 && dentro[0].ok), `${p.q}: la correcta es la única escrita dentro de otra`);
      if (!p.codigos) continue;
      const cods = p.ops.filter(o => !o.ok).map(o => o.error);
      assert.ok(cods.every(Boolean) && new Set(cods).size === cods.length, `${p.q}: códigos ${cods}`);
      for (const c2 of cods) assert.ok(codigos[c2], `${p.q}: ${c2} no está en codigos.json`);
    }
  });

  test(`idea ${k} · el par base no delata: en las hojas de examen ninguna alternativa repite una palabra suya, y la correcta nunca es la única que no la repite`, () => {
    for (const p of pre) {
      assert.ok(p.base, `${p.q}: la hoja trae su par base`);
      const repite = o => palabras(o.t).some(w => p.base.some(b => norm(b) === w));
      if (p.examen) assert.ok(!p.ops.some(repite), `${p.q}: ${p.ops.filter(repite).map(o => o.t)} repite el par base`);
      const limpias = p.ops.filter(o => !repite(o));
      assert.ok(!(limpias.length === 1 && limpias[0].ok && p.ops.length > 1), `${p.q}: la correcta es la única sin palabras del par base`);
    }
  });

  test(`idea ${k} · R2: en las hojas con letras fijas la respuesta nombra una alternativa, y la buena cambia de lugar`, () => {
    const hs = pre.filter(p => p.examen);
    for (const h of hs) assert.ok(h.ops.some(o => o.ok), `${h.q}: la respuesta nombra la ${h.L}`);
    const n3 = hs.filter(h => h.nivel === 3).map(h => h.L);
    assert.equal(n3.length, 5, 'cinco ejemplos de nivel 3 con su hoja');
    assert.deepEqual([...n3].sort(), ['A', 'B', 'C', 'D', 'E'], `cada letra una vez: ${n3}`);
    const lugares = new Set(hs.filter(h => /resuelve/.test(h.q)).map(h => h.L));
    assert.ok(lugares.size >= 3, [...lugares].join());
  });

  test(`idea ${k} · «Ahora tú» no repite un par base ni una respuesta de la predicción, «Así se resuelve» o los ejemplos`, () => {
    const otros = pre.filter(p => !/ahora/.test(p.q)), ya = new Set();
    for (const p of otros) { ya.add(`base:${p.base.join(':')}`); ya.add(`ok:${norm(p.ops.find(o => o.ok).t)}`); }
    for (const e of idea.ejemplos) { const b = baseDe(e.figura.datos); if (b) ya.add(`base:${b.join(':')}`); }
    for (const p of pre.filter(x => /ahora/.test(x.q))) {
      assert.ok(!ya.has(`base:${p.base.join(':')}`), `${p.q}: el par base ${p.base} ya salió`);
      assert.ok(!ya.has(`ok:${norm(p.ops.find(o => o.ok).t)}`), `${p.q}: la respuesta ya salió`);
    }
  });

  test(`idea ${k} · R1: los ejemplos del glosario de la idea no copian pares ni frases de la idea`, () => {
    const frases = new Set();
    for (const f of figs) {
      const s = sopDe(f.d.datos);
      for (const h of (s && s.hojas) || []) for (const o of h.oraciones || []) frases.add(o.t.replace(/::$/, ''));
      for (const a of (s && s.alternativas) || []) frases.add(a.t);
      for (const fl of (f.d.datos && f.d.datos.casos && f.d.datos.casos.filas) || []) frases.add(fl.celdas[0]);
    }
    for (const p of pre) for (const o of p.ops) frases.add(o.t);
    const fs = [...frases].map(norm).filter(x => x.length >= 9);
    assert.ok(fs.length > 20, 'la prueba no corre en vacío');
    const malos = [];
    for (const g of porIdea[k - 1].filter(x => x.simple)) for (const ej of [g.simple, ...g.ejemplos]) {
      const n = ` ${norm(ej)} `;
      for (const f of fs) if (n.includes(` ${f} `)) malos.push(`«${g.termino}»: «${ej}» copia «${f}»`);
    }
    assert.deepEqual(malos, []);
  });

  test(`idea ${k} · el juego se juega tocando la hoja, y una sola combinación cumple la misión`, () => {
    const j = idea.juega, d = j.dibujo(Teoria.inicio(j)).datos, s = svg(idea.pieza, { datos: d, estado: {} });
    for (const c of j.controles) assert.ok(s.includes(`data-toque="${c.id}"`), `falta el toque de «${c.id}»`);
    const cumplen = Teoria.grilla(j.controles).filter(v => j.mision.logrado(v));
    assert.equal(cumplen.length, 1);
    assert.ok(!j.mision.logrado(Teoria.inicio(j)));
  });

  test(`idea ${k} · las listas de los ejemplos de nivel 1 y 2 tienen una sola correcta, ni la más larga ni la más corta`, () => {
    for (const e of idea.ejemplos.filter(x => x.nivel < 3)) {
      const m = plano(e.enunciado).match(/((?:«[^»]+»,? )+(?:o|u) «[^»]+»)/);
      if (!m) continue;
      const items = [...m[1].matchAll(/«([^»]+)»/g)].map(x => x[1]), r = plano(e.respuesta).toLowerCase();
      const ok = items.filter(x => r.includes(x.toLowerCase()));
      assert.equal(ok.length, 1, `${e.titulo}: ${ok}`);
      const l = items.map(x => x.length), c = ok[0].length;
      assert.ok(c < Math.max(...l) && c > Math.min(...l), `${e.titulo}: la correcta mide ${c} y las candidatas ${l}`);
    }
  });
}

test('las listas de candidatas de los ejemplos no ponen la correcta al final más de 4 de cada 10 veces', () => {
  let n = 0, ultima = 0;
  for (const idea of listas) for (const e of idea.ejemplos.filter(x => x.nivel < 3)) {
    const m = plano(e.enunciado).match(/((?:«[^»]+»,? )+(?:o|u) «[^»]+»)/);
    if (!m) continue;
    const items = [...m[1].matchAll(/«([^»]+)»/g)].map(x => x[1]), r = plano(e.respuesta).toLowerCase();
    n++; if (r.includes(items[items.length - 1].toLowerCase())) ultima++;
  }
  assert.ok(n >= 5 && ultima / n <= 0.4, `al final en ${ultima} de ${n}`);
});

// ---------- Correcciones de la auditoría y del lector en frío (19 nov; rutinas/auditoria/razonamiento-verbal.analogias.md) ----------
// Cada prueba falla con la versión de antes de las correcciones.
const idea = id => IDEAS.find(i => i.id === id);
// Todos los pares que ve el alumno: bases y alternativas de las preguntas, y las fichas de los juegos.
const todosLosPares = () => {
  const out = new Set();
  for (const i of IDEAS) for (const p of preguntas(i)) { out.add(p.base.join(' : ')); for (const o of p.ops) out.add(o.t.toLowerCase()); }
  for (const i of IDEAS) for (const e of i.ejemplos) {
    const m = plano(e.enunciado).match(/«([^»]+ : [^»]+)»/g) || [];
    for (const x of m) out.add(x.slice(1, -1).toLowerCase());
  }
  return out;
};
// La explicación de cada incorrecta: su `siFuera` o, en una hoja, el trozo del resuelto que empieza con su letra.
function explicaciones(i) {
  const out = [];
  const corta = (txt, L) => (txt.split(/(?:^|(?<=\.)\s?)(?=[A-E](?:\s|:))/).find(x => x.startsWith(L)) || '');
  out.push(...i.predice.opciones.filter(o => !o.correcta).map(o => ({ base: baseDe(i.predice.dibujo.datos), t: o.texto, e: o.siFuera })));
  for (let s = 0; s < 12; s++) {
    const R = i.resuelve.generar(s), d = sopDe(R.dibujo.datos), sol = plano(R.pasos.filter(p => p.tipo === 'aplica').map(p => p.texto));
    for (const a of d.alternativas || []) out.push({ base: baseDe(R.dibujo.datos), t: a.t, e: corta(sol, a.id) });
    const A = i.ahoraTu.generar(s);
    out.push(...A.opciones.filter(o => !o.correcta).map(o => ({ base: baseDe(A.dibujo.datos), t: o.texto, e: o.siFuera })));
  }
  for (const e of i.ejemplos) {
    const sol = plano(e.solucion.map(x => x.texto)), d = sopDe(e.figura.datos);
    if (d.alternativas && d.alternativas.length) for (const a of d.alternativas) out.push({ base: baseDe(e.figura.datos), t: a.t, e: corta(sol, a.id) });
    const m = plano(e.enunciado).match(/Par base: «([^»]+)»\. ¿Qué par guarda su relación: (.*)\?$/);
    if (m) for (const [, t] of m[2].matchAll(/«([^»]+)»/g)) out.push({ base: m[1].split(' : '), t, e: sol.split(/(?<=\.)\s?/).find(x => x.toLowerCase().includes(`«${t.toLowerCase()}»`)) || '' });
  }
  return out;
}
// Un verbo en infinitivo (salvo los sustantivos que terminan igual).
const NO_VERBO = new Set(['taller', 'collar', 'celular', 'azúcar', 'militar', 'chofer', 'lugar', 'hogar', 'mar', 'altar', 'alfiler', 'mujer', 'telar', 'escolar', 'lunar', 'familiar']);
const verbo = w => /(ar|er|ir)$/.test(w) && !w.includes(' ') && !NO_VERBO.has(w);

test('A1 · Predice de la idea 2 da con qué descartar «parte»: las pruebas de clase y de parte, sin la de grupo', () => {
  const d = (idea('parte-o-clase').predice.datos || []).join(' ');
  assert.match(d, /Clase/);
  assert.match(d, /Parte.*piezas de otro tipo/);
  assert.doesNotMatch(d, /Grupo|conjunto|muchos iguales/);
});

test('M1 · un solo nombre por relación: los Datos de la idea 2 dicen «Clase», «Parte» y «Grupo», como el resuelto; «clase» no nombra la unión de la oración puente', () => {
  const D = idea('parte-o-clase').ejemplos.flatMap(e => e.datos).filter(l => /forma|nombra/.test(l) && /:/.test(l));
  assert.ok(D.length > 10);
  for (const l of D) assert.match(l, /^(Clase|Parte|Grupo) \(/, l);
  for (const i of [idea('relacion-no-tema'), idea('puente-justa')]) {
    const t = JSON.stringify([i.lee, i.juega.leyenda, i.juega.controles.map(c => c.etiqueta), i.regla, i.ejemplos.map(e => e.solucion), i.juega.dibujo(Teoria.inicio(i.juega)).datos]);
    assert.doesNotMatch(t, /"Clase"|negrita":"clase"|su clase dice|la clase de la relación|da su clase/, `${i.id}: «clase» para la unión de la oración puente`);
  }
});

test('M2 · la correcta cambia de lugar: en las predicciones ninguna letra va más de 2 veces, y en las listas de nivel 2 ningún lugar pasa de la mitad', () => {
  const L = IDEAS.map(i => i.predice.opciones.findIndex(o => o.correcta));
  for (const k of new Set(L)) assert.ok(L.filter(x => x === k).length <= 2, `predicciones: ${L.map(x => 'ABCD'[x])}`);
  const lugar = [0, 0, 0];
  for (const i of IDEAS) for (const e of i.ejemplos.filter(x => x.nivel === 2)) {
    const m = plano(e.enunciado).match(/((?:«[^»]+»,? )+(?:o|u) «[^»]+»)/), items = [...m[1].matchAll(/«([^»]+)»/g)].map(x => x[1].toLowerCase());
    lugar[items.findIndex(x => plano(e.respuesta).toLowerCase().includes(x))]++;
  }
  assert.ok(Math.max(...lugar) <= 13, `primera, segunda y tercera: ${lugar}`);
});

test('M3 · «al revés» es de verdad el revés: dado vuelta, el par tiene la categoría del par base (un verbo donde el par base tiene un verbo)', () => {
  let n = 0;
  for (const i of IDEAS) for (const x of explicaciones(i).filter(y => /al revés/.test(y.e))) {
    const [a, b] = x.t.toLowerCase().split(' : '), [a0, b0] = x.base;
    n++;
    assert.equal(verbo(b), verbo(a0), `${i.id}: «${x.t}» dado vuelta no se une como «${x.base.join(' : ')}»`);
    assert.equal(verbo(a), verbo(b0), `${i.id}: «${x.t}» dado vuelta no se une como «${x.base.join(' : ')}»`);
  }
  assert.ok(n > 30, `la prueba no corre en vacío (${n})`);
});

test('M4 · ningún par se lee de dos maneras: sin «helado», «fresco», «temblor» ni «metro», y sin piezas que también se leen como «muchos iguales»', () => {
  const MALOS = [/\bhelado\b/, /\bfresco\b/, /\btemblor\b/, /(^|[\s:])metro\b/, /contemplar/, /frecuente : raro/, /hielo : frío/, /fuerte : cansado/, /enojado : molesto/,
    /página : libro/, /escalón : escalera/, /hoja : cuaderno/, /diente : peine/, /vigilante : puerta/];
  const malos = [...todosLosPares()].filter(p => MALOS.some(re => re.test(p)));
  assert.deepEqual(malos, []);
});

test('M5 · los Datos no regalan la correcta: la glosa de una palabra no nombra la otra palabra de la correcta', () => {
  const raiz = w => w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').slice(0, 5);
  const casos = [];
  for (const i of IDEAS) {
    for (const e of i.ejemplos) { const r = plano(e.respuesta).replace(/^[A-E]: /, ''); casos.push({ q: e.titulo, datos: e.datos, ok: r }); }
    for (let s = 0; s < 4; s++) { const R = i.resuelve.generar(s); casos.push({ q: `resuelve ${s}`, datos: R.datos, ok: plano(R.respuesta).replace(/^[A-E]: /, '') }); }
  }
  let n = 0;
  for (const c of casos.filter(x => / : /.test(x.ok))) for (const l of c.datos) {
    const m = l.match(/^([A-Za-zÁÉÍÓÚáéíóúñÑ]+): (.*)$/); if (!m || /[A-Z][a-z]+ [a-z]/.test(m[1])) continue;
    const def2 = m[2].toLowerCase().split(/[^a-záéíóúñ]+/).filter(w => w.length >= 4).map(raiz);
    const otras = c.ok.toLowerCase().split(/[^a-záéíóúñ]+/).filter(w => w.length >= 4 && raiz(w) !== raiz(m[1]));
    n++;
    for (const w of otras) assert.ok(!def2.includes(raiz(w)), `${c.q}: «${l}» nombra «${w}», de la correcta «${c.ok}»`);
  }
  assert.ok(n > 10, `la prueba no corre en vacío (${n})`);
});

test('M6 · la voz de «Ahora tú» habla de la hoja, no de un texto', () => {
  for (const i of IDEAS) { assert.ok(i.ahoraTu.voz, `${i.id}: sin voz propia`); assert.doesNotMatch(i.ahoraTu.voz, /texto/i); }
});

test('M7 · en el mural de la idea 3, cada botón lleva el número del renglón de su ficha', () => {
  const j = idea('clase-y-causa').juega, d = sopDe(j.dibujo(Teoria.inicio(j)).datos), filas = d.hojas[0].oraciones.map(o => o.id);
  for (const c of j.controles) assert.equal(c.etiqueta, `Ficha ${filas.indexOf(c.id) + 1}`);
});
