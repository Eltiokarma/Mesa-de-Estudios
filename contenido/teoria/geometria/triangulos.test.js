// Pruebas propias de «Triángulos y líneas notables» (además del validador común de contenido/teoria/teoria.test.js).
// Etapa 4, fase 2 (18 nov): la idea 1, «Suma de ángulos interiores», está rehecha con el contrato; las ideas 2 a 6 se
// escriben en la fase 3. Aquí:
//   - las seis ideas de la propuesta en orden, con los id de antes; la idea 1, sola, pasa el validador con calidad 2 (400
//     semillas) y estrena de 2 a 4 palabras con simple, cada término con 3 ejemplos o más;
//   - el juego de la idea 1 se mueve con b y c (ax y ay salieron del juego), la misión no está cumplida al abrir y la
//     lectura suma 180° en toda la grilla;
//   - regla de colores de la unidad en la idea 1: todo ángulo en carmín; en los ejercicios, lo dado en carmín y lo pedido
//     con «?» en tinta; nunca violeta en una figura ni en un enunciado;
//   - fidelidad: cada ángulo mide en el dibujo lo que dice su rótulo o su valor (mide), con 0,5° de tolerancia;
//   - rótulos: caben, no pisan nada (geo-objeto) y cada uno queda más cerca de su vértice que de otro vértice con ángulo;
//   - «Ahora tú»: cuatro opciones distintas y una correcta, datos sin la respuesta, y la respuesta rehecha aparte leyendo
//     el enunciado (sin el código de la unidad);
//   - ninguna figura de la predicción, de un ejemplo ni de «Ahora tú» trae la respuesta;
//   - notación: x sin «°», m∠ dicho en palabras antes de usarse, nunca C(x) ni S(x).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../../../nucleo/kit/kit.js');
const Teoria = require('../../../nucleo/teoria.js');
const Glosario = require('../../../nucleo/glosario.js');
const def = require('./triangulos.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const P = Kit.piezas['geo-objeto'], G = Kit.piezas['geo-figura'];
const SEMILLAS = 400;
const idea = def.ideas[0];
const plano = x => Teoria.plano(x);

test('las seis ideas de la propuesta, en orden; la idea 1 cumple el contrato con calidad 2 (400 semillas)', () => {
  assert.deepEqual(def.ideas.map(i => i.id), ['suma-de-angulos', 'angulo-exterior', 'isosceles', 'desigualdad', 'lineas-notables', 'angulo-de-bisectrices']);
  assert.deepEqual(def.ideas.map(i => i.titulo), ['Suma de ángulos interiores', 'El ángulo exterior', 'Triángulo isósceles y equilátero', 'Desigualdad triangular', 'Líneas notables', 'Ángulos entre bisectrices']);
  const porIdea = Glosario.porIdea(def);
  const sub = Object.assign({}, def, { calidad: 2, estado: 'borrador', ideas: [idea], glosario: porIdea[0], laboratorio: undefined, laboratorioIdeas: undefined });
  const p = Teoria.problemas(sub, { semillas: SEMILLAS });
  assert.deepEqual(p, [], p.join('\n'));
  const n = porIdea[0].filter(e => e.simple).length;
  assert.ok(n >= 2 && n <= 4, `${n} palabras con simple`);
  for (const e of porIdea[0]) assert.ok(Glosario.ejemplosDe(e).length >= 3, `«${e.termino}»: ${Glosario.ejemplosDe(e).length} ejemplos`);
  assert.ok(def.glosario.length <= 30);
  assert.equal(idea.ejemplos.length, 15);
});

test('el juego de la idea 1: b y c (sin ax ni ay), misión sin cumplir al abrir y lectura que suma 180° en toda la grilla', () => {
  const j = idea.juega;
  assert.deepEqual(j.controles.map(c => c.id), ['b', 'c']);
  for (const c of j.controles) assert.equal(c.paso, 5);
  assert.ok(!j.mision.logrado(Teoria.inicio(j)), 'la misión ya está cumplida al abrir');
  let cumplen = 0;
  for (const v of Teoria.grilla(j.controles)) {
    const t = plano(j.lectura(v)), ns = [...t.matchAll(/(\d+)°/g)].map(m => +m[1]);
    assert.equal(ns.length, 4, t);
    assert.equal(ns[0] + ns[1] + ns[2], ns[3], t);
    assert.equal(ns[3], 180, t);
    if (j.mision.logrado(v)) { cumplen++; assert.equal(180 - v.b - v.c, 90); }
    // La manija está donde dicen sus valores: soltarla en su lugar no cambia nada.
    const ar = j.arrastres[0], q = ar.mover(ar.donde(v), v);
    for (const c of j.controles) assert.equal(Teoria.ajustar ? Teoria.ajustar(c, q[c.id]) : Math.round(q[c.id] / 5) * 5, v[c.id]);
  }
  assert.ok(cumplen >= 2, 'la misión tiene varias soluciones');
});

// Todas las figuras de la idea 1: { donde, ejercicio, figura, estado, textos, respuesta }.
function figuras() {
  const out = [], j = idea.juega;
  const add = (donde, ejercicio, dib, textos = [], extra = {}) => out.push(Object.assign({ donde, ejercicio, figura: dib && dib.datos, estado: (dib && dib.estado) || {}, textos }, extra));
  for (const v of Teoria.grilla(j.controles)) add(`juego ${JSON.stringify(v)}`, false, j.dibujo(v));
  idea.lee.tarjetas.forEach((t, i) => t.dibujo && add(`lee ${i + 1}`, false, t.dibujo));
  add('predice', false, idea.predice.dibujo, [idea.predice.pregunta, ...idea.predice.datos], { respuesta: idea.predice.opciones.find(o => o.correcta).texto });
  add('revelar', false, idea.predice.revelar);
  idea.mira.pasos.forEach((ps, i) => add(`mira ${i + 1}`, false, { datos: idea.mira.datos, estado: ps.estado }));
  idea.ejemplos.forEach((e, i) => e.figura && add(`ejemplo ${i + 1} «${e.titulo}»`, true, e.figura, [e.enunciado, ...e.datos], { respuesta: e.respuesta }));
  for (let s = 0; s < SEMILLAS; s++) {
    const a = idea.ahoraTu.generar(s);
    if (a.dibujo) add(`ahora tú ${s}`, true, a.dibujo, [a.pregunta, ...a.datos], { respuesta: a.opciones.find(o => o.correcta).texto });
    const r = idea.resuelve.generar(s);
    add(`resuelve ${s}`, true, r.dibujo, [r.enunciado, ...r.datos], { respuesta: r.respuesta });
  }
  return out;
}
const FIGS = figuras();
const cortes = it => (it.figura.objeto === 'cartulina' && it.figura.recorte !== undefined ? [0, 1, 2, 3, 4] : [it.estado.corte || 0]);
function angulosDe(d) {
  const fig = P.escena(d).fig, g = G.geometria(fig);
  return (fig.angulos || []).map(an => ({ an, m: G.util.angulo(g.P(an.en), g.P(an.de), g.P(an.a)), texto: an.texto === undefined || an.texto === null ? '' : String(an.texto), color: an.color || 'tinta' }));
}

test('hay figuras de sobra (la prueba no corre en vacío)', () => assert.ok(FIGS.length > 600, `${FIGS.length}`));

test('colores: todo ángulo en carmín; en los ejercicios, lo dado en carmín y lo pedido («?») en tinta; nunca violeta ni otro color', () => {
  const mal = [];
  for (const it of FIGS) {
    for (const corte of cortes(it)) if (/var\(--c-[fiod]\)/.test(P.dibujar(it.figura, { corte }))) mal.push(`${it.donde}: color fuera de la regla (violeta, turquesa, naranja o verde)`);
    for (const z of angulosDe(it.figura)) {
      if (!['h', 'tinta'].includes(z.color)) mal.push(`${it.donde}: «${z.texto}» en ${z.color}`);
      if (z.texto === '?' && z.color !== 'tinta') mal.push(`${it.donde}: lo pedido va en ${z.color}`);
      if (z.texto && z.texto !== '?' && z.color !== 'h') mal.push(`${it.donde}: «${z.texto}» no va en carmín`);
      if (!it.ejercicio && z.color !== 'h') mal.push(`${it.donde}: un ángulo sin carmín fuera de los ejercicios`);
    }
  }
  assert.deepEqual([...new Set(mal)].slice(0, 20), []);
  // Y en los textos: sin violeta en enunciados ni datos.
  const conV = x => JSON.stringify(x).includes('"c-f"');
  for (const e of idea.ejemplos) { assert.ok(!conV(e.enunciado) && !conV(e.datos), e.titulo); assert.ok(conV(e.respuesta), `${e.titulo}: la respuesta va en violeta`); }
  for (let s = 0; s < 60; s++) { const a = idea.ahoraTu.generar(s), r = idea.resuelve.generar(s); assert.ok(!conV(a.pregunta) && !conV(a.datos) && !conV(r.enunciado) && !conV(r.datos)); assert.ok(conV(r.respuesta)); }
});

test('fidelidad: cada ángulo mide en el dibujo lo que dice su rótulo o su valor (±0,5°)', () => {
  const mal = [];
  // Las figuras sin escala (sinEscala, ronda 2 del lector) tienen su propia prueba, al final.
  for (const it of FIGS) if (!it.figura.sinEscala) for (const z of angulosDe(it.figura)) {
    const num = /^(\d+)°$/.exec(z.texto), esp = num ? +num[1] : z.an.mide;
    if (esp === undefined) { mal.push(`${it.donde}: «${z.texto}» sin medida`); continue; }
    if (Math.abs(z.m - esp) > 0.5) mal.push(`${it.donde}: «${z.texto || '(arco)'}» mide ${z.m.toFixed(2)}° y debería medir ${esp}°`);
  }
  assert.deepEqual([...new Set(mal)].slice(0, 20), []);
});

test('rótulos: caben, no pisan nada y cada uno queda más cerca de su vértice que de otro vértice con ángulo', () => {
  const mal = [];
  for (const it of FIGS) for (const corte of cortes(it)) {
    if (!P.escenaCabe(it.figura, corte)) mal.push(`${it.donde} corte ${corte}: un rótulo no cabe o pisa algo`);
    if (it.figura.objeto !== 'angulos') continue;
    const { rot, vertice } = P.rotulos(it.figura, corte), ids = [...new Set((it.figura.figura.angulos || []).map(a => a.en))];
    for (const z of rot) {
      const cx = (z.caja.x0 + z.caja.x1) / 2, cy = (z.caja.y0 + z.caja.y1) / 2, d = id => Math.hypot(cx - vertice(id)[0], cy - vertice(id)[1]);
      for (const id of ids) if (id !== z.an.en && !(d(z.an.en) < 0.72 * d(id))) mal.push(`${it.donde}: «${z.an.texto}» queda casi tan cerca de ${id} como de ${z.an.en}`);
    }
  }
  assert.deepEqual([...new Set(mal)].slice(0, 20), []);
});

test('ninguna figura de la predicción, de un ejemplo, de «Así se resuelve» ni de «Ahora tú» trae la respuesta', () => {
  const nums = x => [...plano(x).matchAll(/\d+/g)].map(m => m[0]);
  for (const it of FIGS) {
    if (it.respuesta === undefined) continue;
    const svg = P.dibujar(it.figura, it.estado), dice = new Set(it.textos.flatMap(nums));
    for (const n of nums(it.respuesta)) if (!dice.has(n)) assert.ok(!new RegExp(`>${n}°?<`).test(svg), `${it.donde}: la figura dice ${n}`);
  }
  // La predicción: las dos esquinas sueltas, sin el 195 ni nada que diga si se montan.
  assert.ok(!/195/.test(P.dibujar(idea.predice.dibujo.datos)));
});

// La respuesta de «Ahora tú», rehecha leyendo el enunciado (sin el código de la unidad).
function rehacer(q) {
  const t = plano(q).replace(/[  ⁠]/g, ' ');
  const val = e => { const m = /^(\d*)x(?: ([+−]) (\d+)°)?$/.exec(e.trim()); return m ? { a: m[1] ? +m[1] : 1, b: m[2] ? (m[2] === '−' ? -m[3] : +m[3]) : 0 } : null; };
  let m;
  if ((m = /razón (\d+) : (\d+) : (\d+)\. ¿Cuánto mide el ángulo (mayor|menor)\?/.exec(t))) {
    const p = [+m[1], +m[2], +m[3]], k = 180 / (p[0] + p[1] + p[2]);
    return `${(m[4] === 'mayor' ? Math.max(...p) : Math.min(...p)) * k}°`;
  }
  if ((m = /se cortan en O\. (.*)\. ¿Cuánto mide el ángulo ([ABCD])\?/.exec(t))) {
    const v = {}; for (const z of m[1].matchAll(/m∠([ABCD]) = (\d+)°/g)) v[z[1]] = +z[2];
    const L = m[2], izq = ['A', 'B'], der = ['C', 'D'], suyo = izq.includes(L) ? izq : der, otro = izq.includes(L) ? der : izq;
    return `${v[otro[0]] + v[otro[1]] - v[suyo.find(x => x !== L)]}°`;
  }
  if ((m = /m∠A = (.+?), m∠B = (.+?) y m∠C = (.+?)\. ¿Cuánto (vale x|mide el ángulo ([ABC]))\?/.exec(t)) && /x/.test(m[1] + m[2] + m[3])) {
    const e = [m[1], m[2], m[3]].map(val), x = (180 - e.reduce((s, z) => s + z.b, 0)) / e.reduce((s, z) => s + z.a, 0);
    if (m[4] === 'vale x') return `${x}`;
    const z = e['ABC'.indexOf(m[5])]; return `${z.a * x + z.b}°`;
  }
  if ((m = /m∠([ABC]) = (\d+)° y m∠([ABC]) = (\d+)°\. ¿(Cuánto mide el ángulo [ABC]|Qué clase de triángulo es, por sus ángulos)\?/.exec(t))) {
    const x = 180 - +m[2] - +m[4];
    if (/^Cuánto/.test(m[5])) return `${x}°`;
    return x === 90 ? 'Rectángulo' : x > 90 ? 'Obtusángulo' : 'Acutángulo';
  }
  return null;
}

test('«Ahora tú»: cuatro opciones distintas, una correcta, datos sin la respuesta y la respuesta rehecha aparte (400 semillas)', () => {
  const tipos = {};
  for (let s = 0; s < SEMILLAS; s++) {
    const a = idea.ahoraTu.generar(s), ok = a.opciones.filter(o => o.correcta);
    assert.equal(a.opciones.length, 4, `${s}`);
    assert.equal(ok.length, 1);
    assert.equal(new Set(a.opciones.map(o => plano(o.texto))).size, 4, `${s}: opciones repetidas`);
    assert.equal(new Set(a.opciones.filter(o => !o.correcta).map(o => o.error)).size, 3, `${s}: dos opciones con el mismo código de error`);
    const bien = plano(ok[0].texto), esp = rehacer(a.pregunta);
    assert.ok(esp !== null, `${s}: no se pudo leer «${plano(a.pregunta)}»`);
    assert.equal(bien, esp, `${s}: «${plano(a.pregunta)}» → ${bien}, y rehecho da ${esp}`);
    if (/\d/.test(bien)) for (const d of a.datos) assert.ok(!new RegExp(`(?<![\\d,])${bien.replace('°', '')}°?(?![\\d,])`).test(plano(d)) || /180/.test(bien), `${s}: los datos dicen ${bien}`);
    tipos[s % 5] = (tipos[s % 5] || 0) + 1;
  }
  assert.equal(Object.keys(tipos).length, 5);
});

// «x sin °» (decisiones de la etapa 3, cuarta ronda; propuesta §5): una letra vale un número y se escribe sin «°».
const GRADO_LETRA = /^\d*[a-z]$/, GRADO_CON = /^\d+(?:,\d+)?°$/, GRADO_OP = /^[+−·-]$/;
const termino = t => GRADO_LETRA.test(t) || /^\d+$/.test(t) || GRADO_CON.test(t);
function expresion(tokens) {
  const out = [];
  for (let i = 0; i < tokens.length; i += 2) { if (!termino(tokens[i])) break; out.push(tokens[i]); if (!GRADO_OP.test(tokens[i + 1] || '') || !termino(tokens[i + 2] || '')) break; }
  return out;
}
function gradosMal(texto) {
  const s = String(texto).replace(/[  ⁠]/g, ' '), mal = [];
  for (const m of s.matchAll(/(?<![A-Za-zÀ-ÿ∠])[a-z]°/g)) mal.push(m[0]);
  const soloLetra = e => e.length > 0 && e.some(t => GRADO_LETRA.test(t)) && !e.some(t => GRADO_CON.test(t)), soloGrados = e => e.length > 0 && e.every(t => GRADO_CON.test(t));
  for (const trozo of s.split(/[:;?¿→()«»]|[,.](?=\s|$)|\s{2,}| y | o /)) {
    const lados = trozo.split(/\s*[=<>≤≥]\s*/);
    for (let i = 0; i + 1 < lados.length; i++) {
      const L = expresion(lados[i].trim().split(/\s+/).filter(Boolean).reverse()), R = expresion(lados[i + 1].trim().split(/\s+/).filter(Boolean));
      if ((soloLetra(L) && soloGrados(R)) || (soloGrados(L) && soloLetra(R))) mal.push(trozo.trim());
    }
  }
  return mal;
}
function cadenas(o, out = [], visto = new Set()) {
  if (o === null || o === undefined || typeof o === 'function') return out;
  if (typeof o === 'string') { out.push(o); return out; }
  if (typeof o !== 'object' || visto.has(o)) return out;
  visto.add(o);
  if (Array.isArray(o) && !o.some(Array.isArray)) out.push(plano(o));
  for (const v of Object.values(o)) cadenas(v, out, visto);
  return out;
}

test('notación: x sin «°», m∠ dicho en palabras antes de usarse y nunca C(x) ni S(x) (idea 1, 400 semillas)', () => {
  assert.ok(gradosMal('x = 17°').length && gradosMal('3x = 90°').length && gradosMal('x°').length && !gradosMal('3x + 29° = 80°').length);
  const textos = cadenas(idea);
  for (let s = 0; s < SEMILLAS; s++) { cadenas(idea.ahoraTu.generar(s), textos); cadenas(idea.resuelve.generar(s), textos); }
  const mal = new Set();
  for (const t of textos) { for (const m of gradosMal(t)) mal.add(`${m} en «${t.slice(0, 80)}»`); if (/\b[CS]\(/.test(t)) mal.add(`C(x) o S(x) en «${t.slice(0, 80)}»`); }
  assert.deepEqual([...mal].slice(0, 20), []);
  assert.ok(idea.lee.tarjetas.some(t => /m∠A/.test(plano(t.texto)) && /la medida del ángulo/.test(plano(t.texto))), 'Lee no dice cómo se lee m∠A');
  assert.ok(idea.juega.leyenda.some(l => /m∠/.test(plano(l.s))), 'la leyenda no explica m∠');
});

test('el objeto de la primera pantalla es la cartulina (dibujo de prueba), y «Lee» trae el tijeral', () => {
  const s = P.dibujar(idea.juega.dibujo(Teoria.inicio(idea.juega)).datos);
  assert.match(s, /data-objeto="cartulina" data-prueba="si"/);
  assert.match(P.dibujar(idea.lee.tarjetas[0].dibujo.datos), /data-objeto="tijeral" data-prueba="si"/);
  // «Mira»: en el corte 2 las tres esquinas están sobre la regla; en el 4, la paralela por A con las copias de B y C.
  const m = idea.mira.datos, rot = c => P.rotulos(m, c).rot.map(z => z.an.texto).sort().join(' ');
  assert.equal(rot(2), '50° 60° 70°');
  assert.equal(rot(4), '50° 50° 50° 60° 60° 60° 70° 70°');
});

// ---------- Fase 3 (18 nov): las ideas 2 a 6 ----------
// La unidad entera declara calidad: 2 y pasa el validador con 400 semillas. Para las seis ideas: colores de la regla de
// la unidad, fidelidad de cada ángulo, rótulos que caben y quedan más cerca de su vértice, ninguna figura con la respuesta, datos sin la respuesta, «Ahora tú»
// rehecho aparte leyendo el enunciado y la notación (x sin «°», nunca C(x) ni S(x)). Los rótulos, más cerca de su vértice
// que de cualquier otro vértice con ángulo (en la figura de examen la unidad elige 0,85 al armar cada caso).
const C = require('../../../catalogo/cursos/geometria.json');
const TEMAS = C.unidades.find(u => u.id === def.unidad).temas;

test('la unidad entera: calidad 2, el validador con 400 semillas y cada idea con 15 ejemplos', () => {
  assert.equal(def.calidad, 2);
  const p = Teoria.problemas(def, { temas: TEMAS, semillas: SEMILLAS });
  assert.deepEqual(p, [], p.join('\n'));
  for (const i of def.ideas) assert.equal(i.ejemplos.length, 15, i.id);
  // Los id que guardan avance: las ideas y las mesas.
  assert.deepEqual(def.laboratorio.map(m => m.id), ['triangulo-libre', 'bisagra-libre', 'bisectrices']);
  assert.deepEqual(def.ideas[5].juega.controles.map(c => c.id), ['b', 'c']);
  assert.deepEqual(def.ideas[3].juega.controles.map(c => c.id), ['g']);
  assert.deepEqual(def.ideas[4].juega.controles.map(c => c.id), ['ax']);
});

// Todas las figuras de una idea: { donde, ejercicio, figura, estado, textos, respuesta }.
function figurasDe(id, N = SEMILLAS) {
  const out = [], j = id.juega;
  const add = (donde, ejercicio, dib, textos = [], extra = {}) => dib && out.push(Object.assign({ donde, ejercicio, figura: dib.datos, estado: dib.estado || {}, textos }, extra));
  for (const v of Teoria.grilla(j.controles)) add(`juego ${JSON.stringify(v)}`, false, j.dibujo(v));
  (id.lee.tarjetas || []).forEach((t, i) => add(`lee ${i + 1}`, false, t.dibujo));
  add('predice', false, id.predice.dibujo, [plano(id.predice.pregunta), ...id.predice.datos], { respuesta: id.predice.opciones.find(o => o.correcta).texto });
  add('revelar', false, id.predice.revelar);
  id.mira.pasos.forEach((ps, i) => add(`mira ${i + 1}`, false, { datos: id.mira.datos, estado: ps.estado }));
  if (id.regla.dibujo) add('regla', false, id.regla.dibujo);
  id.ejemplos.forEach((e, i) => add(`ejemplo ${i + 1} «${e.titulo}»`, true, e.figura, [e.enunciado, ...e.datos], { respuesta: e.respuesta }));
  for (let s = 0; s < N; s++) {
    const a = id.ahoraTu.generar(s);
    add(`ahora tú ${s}`, true, a.dibujo, [a.pregunta, ...a.datos], { respuesta: a.opciones.find(o => o.correcta).texto });
    const r = id.resuelve.generar(s);
    add(`resuelve ${s}`, true, r.dibujo, [r.enunciado, ...r.datos], { respuesta: r.respuesta });
  }
  return out;
}
const IDEAS = def.ideas.slice(1);
const FIGS2 = IDEAS.map(i => [i, figurasDe(i)]);
const angulosDe2 = d => { const fig = P.escena(d).fig, g = G.geometria(fig); return (fig.angulos || []).map(an => ({ an, m: G.util.angulo(g.P(an.en), g.P(an.de), g.P(an.a)), texto: an.texto === undefined || an.texto === null ? '' : String(an.texto), color: an.color || 'tinta' })); };
const CORTES = [0, 1, 2, 3, 4, 9];

test('ideas 2 a 6: los objetos de la primera pantalla son dibujos de prueba de geo-objeto', () => {
  const OBJ = { 'angulo-exterior': 'plaza', isosceles: 'compas', desigualdad: 'lampara', 'lineas-notables': 'caserio', 'angulo-de-bisectrices': 'parque' };
  for (const i of IDEAS) {
    const s = P.dibujar(i.juega.dibujo(Teoria.inicio(i.juega)).datos);
    assert.match(s, new RegExp(`data-objeto="${OBJ[i.id]}" data-prueba="si"`), i.id);
    assert.equal(i.pieza, 'geo-objeto');
  }
  assert.match(P.dibujar(def.ideas[1].juega.dibujo(Teoria.inicio(def.ideas[1].juega)).datos), /data-objeto="mototaxi" data-prueba="si"/);
  assert.match(P.dibujar(def.ideas[2].predice.dibujo.datos), /data-objeto="tijeral" data-prueba="si"/, 'el techo a dos aguas');
});

test('ideas 2 a 6, colores: en los ejercicios lo dado en carmín y lo pedido («?») en tinta; nunca violeta en una figura ni en un enunciado', () => {
  const mal = [];
  for (const [i, figs] of FIGS2) for (const it of figs) {
    if (/var\(--c-[fd]\)/.test(P.dibujar(it.figura, it.estado))) mal.push(`${i.id} ${it.donde}: violeta o verde en la figura`);
    for (const z of angulosDe2(it.figura)) {
      if (z.texto === '?' && z.color !== 'tinta') mal.push(`${i.id} ${it.donde}: lo pedido va en ${z.color}`);
      if (it.ejercicio && z.texto && z.texto !== '?' && z.color !== 'h') mal.push(`${i.id} ${it.donde}: «${z.texto}» dado en ${z.color}, no en carmín`);
      if (!['h', 'i', 'o', 'tinta'].includes(z.color)) mal.push(`${i.id} ${it.donde}: ángulo en ${z.color}`);
    }
  }
  assert.deepEqual([...new Set(mal)].slice(0, 20), []);
  const conV = x => JSON.stringify(x).includes('"c-f"');
  for (const i of IDEAS) {
    for (const e of i.ejemplos) { assert.ok(!conV(e.enunciado) && !conV(e.datos), `${i.id}: ${e.titulo}`); assert.ok(conV(e.respuesta), `${i.id}: ${e.titulo}: la respuesta va en violeta`); }
    for (let s = 0; s < 60; s++) { const a = i.ahoraTu.generar(s), r = i.resuelve.generar(s); assert.ok(!conV(a.pregunta) && !conV(a.datos) && !conV(r.enunciado) && !conV(r.datos), `${i.id} ${s}`); assert.ok(conV(r.respuesta), `${i.id} resuelve ${s}`); }
  }
  // Fuera de los ejercicios: el exterior en turquesa (idea 2) y los interiores en carmín.
  const J2 = angulosDe2(def.ideas[1].juega.dibujo(Teoria.inicio(def.ideas[1].juega)).datos);
  assert.ok(J2.some(z => z.an.en === 'C' && z.color === 'i' && z.texto === '130°'), 'el giro en C, en turquesa');
  assert.ok(J2.filter(z => z.color === 'h').length === 3, 'los tres interiores en carmín');
});

test('ideas 2 a 6, fidelidad: cada ángulo mide en el dibujo lo que dice su rótulo o su valor (±0,5°)', () => {
  const mal = [];
  for (const [i, figs] of FIGS2) for (const it of figs) if (!it.figura.sinEscala) for (const z of angulosDe2(it.figura)) {
    const num = /^(\d+)°$/.exec(z.texto), esp = num ? +num[1] : z.an.mide;
    if (esp === undefined) { mal.push(`${i.id} ${it.donde}: «${z.texto}» sin medida`); continue; }
    if (Math.abs(z.m - esp) > 0.5) mal.push(`${i.id} ${it.donde}: «${z.texto || '(arco)'}» mide ${z.m.toFixed(2)}° y debería medir ${esp}°`);
  }
  assert.deepEqual([...new Set(mal)].slice(0, 20), []);
});

test('ideas 2 a 6, rótulos: caben, no pisan nada ni tocan una línea, y quedan más cerca de su vértice que de otro', () => {
  const mal = [];
  for (const [i, figs] of FIGS2) for (const it of figs) for (const corte of (it.donde.startsWith('mira') ? [it.estado.corte || 0] : CORTES)) {
    if (!P.escenaCabe(it.figura, corte)) mal.push(`${i.id} ${it.donde} corte ${corte}: un rótulo no cabe, pisa algo o toca una línea`);
    const { rot, vertice, fig } = P.rotulos(it.figura, corte), ids = [...new Set((fig.angulos || []).map(a => a.en))];
    for (const z of rot) {
      const cx = (z.caja.x0 + z.caja.x1) / 2, cy = (z.caja.y0 + z.caja.y1) / 2, d = id => Math.hypot(cx - vertice(id)[0], cy - vertice(id)[1]);
      for (const id of ids) if (id !== z.an.en && !(d(z.an.en) < d(id))) mal.push(`${i.id} ${it.donde}: «${z.an.texto}» queda casi tan cerca de ${id} como de ${z.an.en}`);
    }
  }
  assert.deepEqual([...new Set(mal)].slice(0, 20), []);
});

test('ideas 2 a 6: ninguna figura de la predicción, de un ejemplo, de «Así se resuelve» ni de «Ahora tú» trae la respuesta', () => {
  const nums = x => [...plano(x).matchAll(/\d+(?:,\d+)?/g)].map(m => m[0]);
  const mal = [];
  for (const [i, figs] of FIGS2) for (const it of figs) {
    if (it.respuesta === undefined) continue;
    const txt = Teoria.textoSVG(P.dibujar(it.figura, it.estado)), dice = new Set(it.textos.flatMap(nums));
    for (const n of nums(it.respuesta)) if (!dice.has(n) && new RegExp(`(^|[^\\d,])${n}(°| cm|$|[^\\d,])`).test(txt)) mal.push(`${i.id} ${it.donde}: la figura dice ${n}`);
  }
  assert.deepEqual([...new Set(mal)].slice(0, 20), []);
});

// La respuesta de «Ahora tú», rehecha leyendo el enunciado (y, en el tipo de reconocer la línea, la figura): sin el
// código de la unidad.
const gra = n => `${String(n).replace('.', ',')}°`;
function lineal(e) { const m = /^\s*(\d*)x(?:\s*([+−])\s*(\d+)°?)?\s*$/.exec(e); return m ? { a: m[1] ? +m[1] : 1, b: m[2] ? (m[2] === '−' ? -m[3] : +m[3]) : 0 } : null; }
function rehacer2(id, a) {
  const t = plano(a.pregunta).replace(/[  ⁠]/g, ' ');
  let m;
  if (id === 'angulo-exterior') {
    if ((m = /m∠A = (\d+)° y m∠B = (\d+)°\. Se prolonga BC/.exec(t))) return gra(+m[1] + +m[2]);
    if ((m = /m∠A = (.+?), m∠B = (.+?) y m∠ACD = (.+?)\. ¿(Cuánto vale x|Cuánto mide el ángulo ACD)\?/.exec(t))) {
      const [A, B, E] = [m[1], m[2], m[3]].map(lineal), x = (A.b + B.b - E.b) / (E.a - A.a - B.a);
      return m[4] === 'Cuánto vale x' ? String(x) : gra(E.a * x + E.b);
    }
    if ((m = /exterior ACD mide (\d+)° y m∠A = (\d+)°/.exec(t))) return gra(m[1] - m[2]);
    if ((m = /exterior en A mide (\d+)° y el exterior en B mide (\d+)°/.exec(t))) return gra(360 - m[1] - m[2]);
    if ((m = /m∠BAC = (\d+)°, m∠ABD = (\d+)° y m∠ACD = (\d+)°/.exec(t))) return gra(+m[1] + +m[2] + +m[3]);
  }
  if (id === 'isosceles') {
    if ((m = /AB = AC y m∠A = (\d+)°/.exec(t))) return gra((180 - m[1]) / 2);
    if ((m = /AB = AC y m∠B = (\d+)°/.exec(t))) return gra(180 - 2 * m[1]);
    if ((m = /AB = \((.+?)\) cm, AC = \((.+?)\) cm/.exec(t))) { const p = lineal(m[1].replace(/ − (\d+)$/, ' − $1')), q = lineal(m[2]); const x = (q.b - p.b) / (p.a - q.a); return `${p.a * x + p.b} cm`; }
    if ((m = /m∠A = (\d+)° y m∠B = (\d+)°\. ¿Cuál es su lado mayor\?/.exec(t))) { const v = { A: +m[1], B: +m[2], C: 180 - m[1] - m[2] }, k = Object.keys(v).sort((x, y) => v[y] - v[x])[0]; return { A: 'BC', B: 'AC', C: 'AB' }[k]; }
    if ((m = /AB = BD = DC\. Si m∠C = (\d+)°, ¿cuánto mide el ángulo (A|ABC)\?/.exec(t))) return gra(m[2] === 'A' ? 2 * m[1] : 180 - 3 * m[1]);
  }
  if (id === 'desigualdad') {
    if ((m = /miden (\d+) cm y (\d+) cm\. ¿Cuántos valores/.exec(t))) return `${2 * Math.min(+m[1], +m[2]) - 1} valores`;
    if ((m = /miden (\d+) cm y (\d+) cm\. Si el tercero, x, mide un número entero de cm, ¿cuál es su (mayor|menor) valor\?/.exec(t))) return `${m[3] === 'mayor' ? +m[1] + +m[2] - 1 : Math.abs(m[1] - m[2]) + 1} cm`;
    if ((m = /isósceles tiene un lado de (\d+) cm y otro de (\d+) cm/.exec(t))) { const [p, q] = [+m[1], +m[2]], c = 2 * p > q ? null : 2 * q + p; return `${c} cm`; }
    if ((m = /AB = (\d+) cm, BC = (\d+) cm, CD = (\d+) cm y DA = (\d+) cm/.exec(t))) { const [p, q, r, s] = m.slice(1).map(Number); let n = 0; for (let x = 1; x < 50; x++) if (x > Math.abs(p - q) && x < p + q && x > Math.abs(r - s) && x < r + s) n++; return `${n} valores`; }
  }
  if (id === 'lineas-notables') {
    if (/mira las marcas de la línea/.test(t)) return { h: 'altura', m: 'mediana', b: 'bisectriz', z: 'mediatriz' }[Object.keys(a.dibujo.datos.lineas)[0]];
    if ((m = /m∠B = (\d+)° y m∠C = (\d+)°\. ¿Dónde cae/.exec(t))) return +m[1] > 90 ? 'Fuera, en la prolongación de CB' : +m[1] === 90 ? 'Justo en B: AB es la altura' : 'Dentro del lado BC';
    if ((m = /m∠B = (\d+)° y AH es la altura desde A/.exec(t))) return gra(Math.abs(90 - m[1]));
    if ((m = /m∠B = (\d+)°, m∠C = (\d+)° y AF es la bisectriz/.exec(t))) return gra(+m[1] + (180 - m[1] - m[2]) / 2);
    if ((m = /m∠B = (\d+)° y m∠C = (\d+)°\. AH es la altura y AF/.exec(t))) return gra((m[1] - m[2]) / 2);
  }
  if (id === 'angulo-de-bisectrices') {
    if ((m = /m∠A = (\d+)°\. Las bisectrices interiores de B y C se cortan en I\./.exec(t))) return gra(90 + m[1] / 2);
    if ((m = /m∠A = (\d+)°\. La bisectriz interior de B y la exterior de C/.exec(t))) return gra(m[1] / 2);
    if ((m = /m∠A = (\d+)°\. Las bisectrices de los ángulos exteriores/.exec(t))) return gra(90 - m[1] / 2);
    if ((m = /m∠B = (\d+)° y m∠C = (\d+)°\. Las bisectrices interiores/.exec(t))) return gra(180 - (+m[1] + +m[2]) / 2);
    if ((m = /m∠BIC = (\d+)°\. ¿Cuánto mide el ángulo A\?/.exec(t))) return gra(2 * (m[1] - 90));
  }
  return null;
}

test('ideas 2 a 6, «Ahora tú»: cuatro opciones distintas, códigos distintos, datos sin la respuesta y la respuesta rehecha aparte (400 semillas)', () => {
  for (const i of IDEAS) {
    const tipos = new Set();
    for (let s = 0; s < SEMILLAS; s++) {
      const a = i.ahoraTu.generar(s), ok = a.opciones.filter(o => o.correcta);
      assert.equal(a.opciones.length, 4, `${i.id} ${s}`);
      assert.equal(ok.length, 1);
      assert.equal(new Set(a.opciones.map(o => plano(o.texto))).size, 4, `${i.id} ${s}: opciones repetidas`);
      assert.equal(new Set(a.opciones.filter(o => !o.correcta).map(o => o.error)).size, 3, `${i.id} ${s}: dos opciones con el mismo código`);
      const bien = plano(ok[0].texto), esp = rehacer2(i.id, a);
      assert.ok(esp !== null, `${i.id} ${s}: no se pudo leer «${plano(a.pregunta)}»`);
      assert.equal(bien, esp, `${i.id} ${s}: «${plano(a.pregunta)}» → ${bien}, y rehecho da ${esp}`);
      const n = /^(\d+)/.exec(bien);
      if (n && !['90', '180', '360'].includes(n[1])) for (const d of a.datos) assert.ok(!new RegExp(`(?<![\\d,])${n[1]}(?![\\d,])`).test(plano(d)), `${i.id} ${s}: los datos dicen ${n[1]}`);
      tipos.add(s % 5);
    }
    assert.equal(tipos.size, 5);
  }
});

test('ideas 2 a 6, notación: x sin «°», nunca C(x) ni S(x); m∠ y ∠ACD como en la propuesta', () => {
  const mal = new Set();
  for (const i of IDEAS) {
    const textos = cadenas(i);
    for (let s = 0; s < 120; s++) { cadenas(i.ahoraTu.generar(s), textos); cadenas(i.resuelve.generar(s), textos); }
    for (const t of textos) { for (const m of gradosMal(t)) mal.add(`${i.id}: ${m} en «${t.slice(0, 80)}»`); if (/\b[CS]\(/.test(t)) mal.add(`${i.id}: C(x) o S(x) en «${t.slice(0, 80)}»`); }
  }
  assert.deepEqual([...mal].slice(0, 20), []);
  assert.ok(def.ideas[1].juega.leyenda.some(l => /∠ACD/.test(plano(l.s))), 'el exterior en C se llama ∠ACD');
  // Los nombres que vienen después: «incentro» y «excentro» solo como cruces, con «se explican en Puntos notables».
  const lee6 = def.ideas[5].lee.tarjetas.map(x => plano(x.texto)).join(' ');
  assert.match(lee6, /incentro/); assert.match(lee6, /excentro/); assert.match(lee6, /Puntos notables/);
  assert.ok(!def.glosario.some(g => /^(incentro|excentro)$/.test(g.termino)), 'incentro y excentro se definen en otras unidades');
});

test('ideas 2 a 6: la lectura del juego enuncia la relación (el giro en C suma A y B; BIC sale de las dos mitades)', () => {
  const j2 = def.ideas[1].juega;
  for (const v of Teoria.grilla(j2.controles)) { const n = [...plano(j2.lectura(v)).matchAll(/(\d+)°/g)].map(m => +m[1]); assert.equal(n[0] + n[1], n[2]); assert.equal(n[2], 180 - v.c); }
  const j6 = def.ideas[5].juega;
  // m∠BIC = 180° − B/2 − C/2 = …; m∠A = …: la cuenta con las mitades (la regla 90° + A/2 llega después, en «Mira»).
  for (const v of Teoria.grilla(j6.controles)) { const n = [...plano(j6.lectura(v)).matchAll(/(\d+)°/g)].map(m => +m[1]); assert.deepEqual([n[0], n[1], n[2]], [180, v.b / 2, v.c / 2]); assert.equal(n[0] - n[1] - n[2], n[3]); assert.equal(n[4], 180 - v.b - v.c); }
  const j4 = def.ideas[3].juega;
  for (const v of Teoria.grilla(j4.controles)) { const x = +/AC ≈ ([\d,]+)/.exec(plano(j4.lectura(v)))[1].replace(',', '.'); assert.ok(x > 15 && x < 65); }
});

// ---------- Correcciones (18 nov, auditoría y lector en frío) ----------
// M6: en un ejercicio, el carmín dice «dato». Un arco carmín sin rótulo tiene su valor en el enunciado (un número, una
// expresión «m∠X = …» o «recto»); un arco en tinta sin rótulo no es un dato numérico del enunciado. Las mitades de una
// bisectriz (rayitas) y el cuadradito de una altura no cuentan.
test('correcciones, arcos: en los ejercicios, carmín sin rótulo solo si es dato; un dato numérico nunca en tinta (400 semillas)', () => {
  const mal = [];
  def.ideas.forEach(id => {
    const items = [];
    id.ejemplos.forEach((e, i) => e.figura && items.push([`ejemplo ${i + 1}`, e.figura.datos, [e.enunciado, ...e.datos]]));
    for (let s = 0; s < SEMILLAS; s++) {
      const a = id.ahoraTu.generar(s), r = id.resuelve.generar(s);
      if (a.dibujo) items.push([`ahora tú ${s}`, a.dibujo.datos, [a.pregunta, ...a.datos]]);
      if (r.dibujo) items.push([`resuelve ${s}`, r.dibujo.datos, [r.enunciado, ...r.datos]]);
    }
    for (const [donde, d, tx] of items) {
      const t = tx.map(plano).join(' ').replace(/[  ⁠]/g, ' ');
      for (const an of P.escena(d).fig.angulos || []) {
        if (an.rayita || (an.texto !== undefined && an.texto !== null && an.texto !== '')) continue;
        const n = Math.round(an.mide), suyo = new RegExp(`m∠[A-Z]{0,2}${an.en}[A-Z]{0,2} =`);
        if (an.color === 'h' && !(new RegExp(`(^|[^\\d,])${n}°`).test(t) || suyo.test(t) || (n === 90 && /recto/.test(t))))
          mal.push(`${id.id} ${donde}: arco carmín en ${an.en} (${n}°) sin rótulo ni valor en el enunciado`);
        if (!an.color && n !== 90 && new RegExp(`m∠${an.en} = ${n}°`).test(t)) mal.push(`${id.id} ${donde}: m∠${an.en} = ${n}° es dato y va en tinta`);
      }
    }
  });
  assert.deepEqual([...new Set(mal)].slice(0, 20), []);
});

// ---------- Correcciones de la ronda 2 del lector en frío (18 nov, noche) ----------
// Las figuras a escala de los ejemplos se medían con transportador y daban la respuesta (tarjetas 01, 07 y 13). Una
// figura con sinEscala: true dice «El dibujo no está a escala.» en el enunciado, y ningún ángulo dibujado mide la
// respuesta (más de 7° de diferencia), para que el transportador no la dé. Las que eran el problema (el tijeral, la señal
// y «Partir el ángulo», y «La mediana que mide la mitad», que estrena figura) van así.
test('ronda 2: las figuras sin escala lo dicen y no dejan medir la respuesta con transportador', () => {
  const ej = (i, titulo) => def.ideas[i].ejemplos.find(e => e.titulo === titulo);
  for (const [i, ti] of [[0, 'La punta del tijeral'], [2, 'La señal de tránsito'], [4, 'Partir el ángulo'], [4, 'La mediana que mide la mitad']]) {
    const e = ej(i, ti);
    assert.ok(e && e.figura && e.figura.datos.sinEscala, `${ti}: sin escala`);
  }
  let n = 0;
  for (const i of def.ideas) for (const e of i.ejemplos) {
    if (!e.figura || !e.figura.datos.sinEscala) continue;
    n++;
    assert.match(plano(e.enunciado), /El dibujo no está a escala\.$/, `${e.titulo}: el enunciado no lo dice`);
    const r = /(\d+)°/.exec(plano(e.respuesta)), medidos = angulosDe2(e.figura.datos).map(z => z.m);
    if (r) for (const m of medidos) assert.ok(Math.abs(m - +r[1]) > 7, `${e.titulo}: un ángulo dibujado mide ${m.toFixed(1)}°, casi la respuesta (${r[1]}°)`);
    // Y el texto alternativo no da medidas del dibujo que contradigan el enunciado: dice que es sin escala.
    assert.match(P.escena(e.figura.datos).fig.alt, /sin escala/, `${e.titulo}: el alt no dice «sin escala»`);
  }
  assert.ok(n >= 4);
});

// Idea 6: el alumno elige la regla, así que un ejercicio que usa una trae las tres, y cada cruce dicho en palabras (I, E
// y Q; tarjetas 16 y 17: «I y E sin definir»). Vale en todos los ejemplos, «Así se resuelve» y «Ahora tú» (400 semillas).
test('ronda 2: en la idea 6, si los datos traen una regla de cruce, traen las tres, con I, E y Q dichos en palabras', () => {
  const id = def.ideas[5], REGLA = /m∠B[IEQ]C = .*÷ 2/;
  const CRUCES = [/^I es el cruce de las bisectrices interiores de B y de C: m∠BIC = 90° \+ \(m∠A ÷ 2\)\.$/,
    /^E es el cruce de la bisectriz interior de B con la exterior de C: m∠BEC = m∠A ÷ 2\.$/,
    /^Q es el cruce de las bisectrices exteriores de B y de C: m∠BQC = 90° − \(m∠A ÷ 2\)\.$/];
  const revisar = (donde, datos) => {
    const ls = datos.map(plano);
    if (!ls.some(l => REGLA.test(l))) return 0;
    for (const re of CRUCES) assert.ok(ls.some(l => re.test(l)), `${donde}: falta ${re}`);
    assert.equal(ls.filter(l => REGLA.test(l)).length, 3, `${donde}: reglas de cruce de más`);
    return 1;
  };
  let con = 0;
  id.ejemplos.forEach((e, k) => { con += revisar(`ejemplo ${k + 1} «${e.titulo}»`, e.datos); });
  for (let s = 0; s < SEMILLAS; s++) { revisar(`ahora tú ${s}`, id.ahoraTu.generar(s).datos); revisar(`resuelve ${s}`, id.resuelve.generar(s).datos); }
  assert.ok(con >= 8, `${con} ejemplos con reglas`);
  for (const ti of ['Dos exteriores', 'De E al ángulo A']) assert.equal(revisar(ti, id.ejemplos.find(e => e.titulo === ti).datos), 1, ti);
  // Q se presenta antes de la regla: en «Lee» y en «Mira».
  assert.match(id.lee.tarjetas.map(x => plano(x.texto)).join(' '), /en Q/);
  assert.ok(id.mira.pasos.some(ps => /Q/.test(plano(ps.texto))), '«Mira» no llega a Q');
});

// Ideas 1, 2 y 6: A se mueve arrastrando la punta o con los controles de B y C; la consigna y la misión lo dicen.
test('ronda 2: la consigna y la misión dicen cómo se mueve A (arrastrar o controles)', () => {
  for (const k of [0, 1, 5]) {
    const j = def.ideas[k].juega;
    assert.ok(j.arrastres && j.arrastres.length && j.controles.length, def.ideas[k].id);
    assert.match(plano(j.mision.texto), /^Arrastra la (punta|esquina) A, o usa los controles/, def.ideas[k].id);
    assert.match(plano(j.consigna), /A se arrastra o se mueve con los controles/, def.ideas[k].id);
  }
});

// ---------- Cabos de la Etapa 4 (19 nov): líneas guía ----------
// Pendiente de la auditoría y del lector en frío: «rótulos que solo van en el enunciado en cuñas angostas». Donde hay un
// hueco libre y la guía no cruza ningún trazo, el rótulo va en la figura unido a su arco (conGuia, en la unidad). La
// prueba mide cada guía en pantalla: nace junto a su propio arco (no en el vértice), no cruza ni toca ningún otro trazo,
// su rótulo está pegado a su punta, cabe con todo lo demás (escenaCabe) y dice un dato del enunciado, nunca la respuesta.
test('cabos: cada línea guía nace en su arco, no cruza ningún trazo, lleva su rótulo en la punta y dice un dato del enunciado', () => {
  const cruza = (p, q, r, s) => {   // ¿se cortan los tramos pq y rs? (con 1 px de aire)
    const o = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    const d1 = o(p, q, r), d2 = o(p, q, s), d3 = o(r, s, p), d4 = o(r, s, q);
    if (d1 * d2 < 0 && d3 * d4 < 0) return true;
    const dist = (a, b, c) => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, t = Math.max(0, Math.min(1, ((c[0] - a[0]) * (b[0] - a[0]) + (c[1] - a[1]) * (b[1] - a[1])) / (L * L))); return Math.hypot(c[0] - a[0] - t * (b[0] - a[0]), c[1] - a[1] - t * (b[1] - a[1])); };
    return Math.min(dist(p, q, r), dist(p, q, s), dist(r, s, p), dist(r, s, q)) < 1;
  };
  const con = [];
  for (const i of def.ideas) for (const e of i.ejemplos) if (e.figura && e.figura.datos.guias) con.push([i, e]);
  assert.deepEqual(con.map(([, e]) => e.titulo), ['La mariposa', 'Dos triángulos encadenados', 'Isósceles con x afuera', 'De E al ángulo A']);
  for (const [i, e] of con) {
    const d = e.figura.datos, donde = `${i.id} «${e.titulo}»`;
    assert.ok(P.escenaCabe(d, Infinity), `${donde}: con la guía, un rótulo no cabe o pisa algo`);
    const { g, fig, ex, rot, letrasC, lineas } = P.rotulos(d, Infinity);
    const libres = (d.libres || []).map((l, k) => ({ l, caja: ex.cajas[ex.cajas.length - d.libres.length + k] }));
    for (const gu of d.guias) {
      const [p1, p2] = gu.puntas.map(id => g.S(id)), V = g.S(gu.en);
      // Nace 3 px más allá de su arco, dentro de su ángulo, y más cerca de su vértice que de cualquier otro punto con letra.
      assert.ok(Math.abs(Math.hypot(p1[0] - V[0], p1[1] - V[1]) - (gu.radio + 3)) < 0.6, `${donde}: la guía de «${gu.texto}» no nace junto a su arco`);
      const arco = (fig.angulos || []).find(a => a.en === gu.en && a.de === gu.de && a.a === gu.a);
      // El radio de la guía es el del arco de más afuera (cada arco de más va 5 px más allá).
      const listo = P.angulosListos(d).find(a => a.en === gu.en && a.de === gu.de && a.a === gu.a);
      assert.ok(arco && listo && (listo.radio || 26) + 5 * (Math.min(3, listo.marcas || 1) - 1) === gu.radio && !arco.texto, `${donde}: el ángulo de la guía lleva su arco, con ese radio y sin otro rótulo`);
      const abre = G.util.angulo(V, g.S(gu.de), g.S(gu.a)), a1 = G.util.angulo(V, g.S(gu.de), p1), a2 = G.util.angulo(V, p1, g.S(gu.a));
      assert.ok(Math.abs(a1 + a2 - abre) < 0.5, `${donde}: la guía de «${gu.texto}» nace fuera de su ángulo`);
      for (const q of fig.puntos) if (q.rotulo && q.id !== gu.en) { const s = g.S(q.id); assert.ok(Math.hypot(p1[0] - V[0], p1[1] - V[1]) < Math.hypot(p1[0] - s[0], p1[1] - s[1]), `${donde}: la guía nace más cerca de ${q.id}`); }
      // No cruza ni toca ningún otro trazo de la figura (lados, cevianas, punteadas, llaves).
      // `lineas` son todos los trazos de la escena en pantalla (los de geo-figura y los que pone geo-objeto); la guía
      // misma es el que va de p1 a p2.
      const igual = (u, v) => Math.hypot(u[0] - v[0], u[1] - v[1]) < 0.01;
      const otros = lineas.filter(([r, s]) => !((igual(r, p1) && igual(s, p2)) || (igual(r, p2) && igual(s, p1))));
      assert.equal(otros.length, lineas.length - 1, `${donde}: la guía es un trazo de la figura`);
      for (const [r, s] of otros) assert.ok(!cruza(p1, p2, r, s), `${donde}: la guía de «${gu.texto}» cruza o toca un trazo`);
      // Tampoco pasa por encima de una letra ni de otro rótulo.
      const enCaja = (c, p) => p[0] > c.x0 - 1 && p[0] < c.x1 + 1 && p[1] > c.y0 - 1 && p[1] < c.y1 + 1;
      const cajas = letrasC.concat(rot.map(z => z.caja), ex.cajas);
      for (let k = 0; k <= 20; k++) { const p = [p1[0] + (p2[0] - p1[0]) * k / 20, p1[1] + (p2[1] - p1[1]) * k / 20]; assert.ok(!cajas.some(c => enCaja(c, p)), `${donde}: la guía de «${gu.texto}» pasa sobre un rótulo`); }
      // Su rótulo: el suelto que cuelga de la punta, a 4 px, en carmín y con el mismo texto.
      const suyo = libres.find(x => x.l.en === gu.puntas[1]);
      assert.ok(suyo && suyo.l.texto === gu.texto && suyo.l.color === 'h' && suyo.l.dist === 4, `${donde}: la guía de «${gu.texto}» sin su rótulo`);
      const c = suyo.caja, dx = Math.max(c.x0 - p2[0], 0, p2[0] - c.x1), dy = Math.max(c.y0 - p2[1], 0, p2[1] - c.y1);
      // (geo-objeto deja 4 px de aire en la dirección del rótulo; con una caja ancha y una guía en diagonal, la esquina
      // más cercana queda algo más lejos.)
      assert.ok(Math.hypot(dx, dy) >= 2.5 && Math.hypot(dx, dy) <= 16, `${donde}: el rótulo «${gu.texto}» a ${Math.hypot(dx, dy).toFixed(1)} px de la punta de su guía`);
      // Es un dato del enunciado y no la respuesta.
      assert.ok(plano(e.enunciado).includes(gu.texto), `${donde}: «${gu.texto}» no está en el enunciado`);
      assert.ok(!plano(e.respuesta).includes(gu.texto), `${donde}: «${gu.texto}» es la respuesta`);
      // La guía es fina y del color del rótulo; se dibuja de verdad.
      const seg = fig.segmentos.find(l => l.de === gu.puntas[0] && l.a === gu.puntas[1]);
      assert.ok(seg && seg.grosor === 'fino' && seg.color === 'h' && !seg.discontinua);
    }
    assert.ok(Teoria.textoSVG(P.dibujar(d, {})).includes(d.guias[0].texto), `${donde}: el rótulo se dibuja`);
  }
  // «2x» de la mariposa va junto a su arco, sin guía, más cerca de C que de cualquier otro vértice.
  const m = def.ideas[0].ejemplos.find(e => e.titulo === 'La mariposa').figura.datos, r = P.rotulos(m, Infinity), z = r.rot.find(x => x.an.texto === '2x');
  assert.ok(z && z.an.en === 'C');
});

// Cabos de la Etapa 4 (19 nov): los códigos de error (hipótesis) de la unidad están en su informe de docs/investigacion/,
// que trae la sección «Hipótesis de la Etapa 4 (sin estudio)» con el índice de los que estrenó la etapa.
test('cabos: todo código de error de la unidad está en su informe, con la sección «Hipótesis de la Etapa 4 (sin estudio)»', () => {
  const fsI = require('node:fs'), pathI = require('node:path');
  const leeInforme = n => fsI.readFileSync(pathI.join(__dirname, '..', '..', '..', 'docs', 'investigacion', n), 'utf8');
  // «GE-TRI6 a GE-TRI8» nombra también GE-TRI7: los rangos se expanden.
  const expande = t => t.replace(/([A-Z][A-Za-z0-9-]*?[A-Z-])(\d+) a \1(\d+)/g, (m, pre, x, y) => { const l = []; for (let k = +x; k <= +y; k++) l.push(pre + k); return l.join(', '); });
  const informe = expande(leeInforme('geometria-ideas-erroneas.md')), transversal = leeInforme('fisica-calculo-transversal-ideas-erroneas.md');
  const nombra = (t, c) => new RegExp(`(^|[^A-Za-z0-9-])${c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^A-Za-z0-9-]|$)`).test(t);
  assert.match(informe, /^## Hipótesis de la Etapa 4 \(sin estudio\)$/m);
  const seccion = informe.slice(informe.indexOf('## Hipótesis de la Etapa 4 (sin estudio)'));
  assert.ok(seccion.includes('contenido/teoria/geometria/triangulos.js'), 'la sección nombra esta unidad');
  assert.ok(!/\(\d{4}\)|et al\.|doi/i.test(seccion.slice(0, seccion.indexOf('\n## ', 5))), 'la sección no trae citas');
  const codigos = new Set();
  for (const u of [def]) for (const i of u.ideas) {
    for (const o of i.predice.opciones) if (o.error) codigos.add(o.error);
    for (let s = 0; s < 400; s++) for (const o of i.ahoraTu.generar(s).opciones) if (o.error) codigos.add(o.error);
  }
  assert.ok(codigos.size >= 30, `${codigos.size} códigos`);
  const faltan = [...codigos].filter(c => !nombra(informe, c) && !nombra(transversal, c)).sort();
  assert.deepEqual(faltan, [], `códigos sin describir en geometria-ideas-erroneas.md: ${faltan.join(', ')}`);
});
