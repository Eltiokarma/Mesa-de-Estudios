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
  for (const it of FIGS) for (const z of angulosDe(it.figura)) {
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
