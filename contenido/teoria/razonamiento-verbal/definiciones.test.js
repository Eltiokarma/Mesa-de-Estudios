// Pruebas propias de «Definiciones» (además del validador común de contenido/teoria/teoria.test.js). Miran las cinco
// ideas, rehechas por el contrato en la etapa 5 (19 nov). Salen de las reglas que dejó
// la auditoría de la unidad modelo del curso (rutinas/auditoria/razonamiento-verbal.tema-e-idea-principal.md):
//   R1. El glosario se lee antes de jugar: los ejemplos de los términos que estrena la idea no usan una frase de un juego,
//       una predicción, un «Ahora tú» o un ejemplo resuelto, ni nombran la palabra que allí se define.
//   R2. En las hojas con letras fijas, ninguna letra es la correcta más de dos veces.
//   R5. En verbal, la primera tarjeta de «Lee» muestra el texto en su soporte (contrato, punto 1).
//   R9. Colores declarados: las figuras de la idea usan solo la paleta de lectura (i, o, f), sin verde ni carmín.
//   M7. Antes de responder, ninguna figura trae marcas (ni el ejemplo, ni «Ahora tú», ni la predicción).
//   Y de las notas de la etapa 5: la correcta nunca es la opción más larga ni la más corta; dos incorrectas de una
//   pregunta no comparten código; todo texto de la ficha cabe en su casilla; la unidad pasa el contrato (calidad 2); cada
//   «Ahora tú» y cada predicción lleva una incorrecta por código, y los códigos están en el informe de verbal.
// Las medidas se hacen sobre lo que la unidad entrega (textos, opciones, dibujos), sin usar sus funciones internas.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Teoria = require('../../../nucleo/teoria.js');
const T = require('../../../nucleo/kit/trazo.js');
const def = require('./definiciones.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const Kit = require('../../../nucleo/kit/kit.js');

const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x == null ? '' : typeof x === 'object' ? plano(x.t !== undefined ? x.t : x.negrita !== undefined ? x.negrita : '') : String(x)).replace(/⁠/g, '');
const norm = s => plano(s).toLowerCase().replace(/[.,;:¿?¡!«»"()]/g, ' ').replace(/\s+/g, ' ').trim();
const SEMILLAS = 60;
const svg = (pieza, d) => Kit.piezas[pieza].dibujar(d.datos, d.estado || {});

// Todas las figuras de la idea, con su pieza y el momento en que se ven.
function figuras(idea) {
  const out = [], j = idea.juega;
  for (const t of idea.lee.tarjetas) if (t.dibujo) out.push({ q: 'lee', pieza: t.pieza, d: t.dibujo });
  for (const v of Teoria.grilla(j.controles)) out.push({ q: `juega ${JSON.stringify(v)}`, pieza: idea.pieza, d: j.dibujo(v) });
  out.push({ q: 'predice', pieza: idea.pieza, d: idea.predice.dibujo, antes: true }, { q: 'revelar', pieza: idea.pieza, d: idea.predice.revelar });
  idea.mira.pasos.forEach((p, k) => out.push({ q: `mira ${k + 1}`, pieza: idea.pieza, d: { datos: idea.mira.datos, estado: p.estado } }));
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

// Las hojas de simulacro con letras fijas: los ejemplos con alternativas y las hojas de «Así se resuelve».
function hojas(idea) {
  const out = [];
  idea.ejemplos.forEach((e, k) => { const a = e.figura.datos.alternativas; if (a && a.length) out.push({ q: `ejemplo ${k + 1}`, L: plano(e.respuesta)[0], alts: a }); });
  const vistos = new Set();
  for (let s = 0; s < 12; s++) {
    const R = idea.resuelve.generar(s), a = R.dibujo.datos.alternativas;
    if (!a || !a.length || vistos.has(R.enunciado)) continue; vistos.add(R.enunciado);
    out.push({ q: `resuelve ${s}`, L: plano(R.respuesta)[0], alts: a });
  }
  return out;
}

const IDEAS = def.ideas;
const Glosario = require('../../../nucleo/glosario.js');
const porIdea = Glosario.porIdea(def);

test('la unidad pasa el contrato de calidad 2 y lleva la marca', () => {
  assert.deepEqual(Teoria.problemas(Object.assign({}, def, { calidad: 2 }), { semillas: SEMILLAS }), []);
  assert.equal(def.calidad, 2, 'cerrada el 19 nov tras el lector en frío y el auditor');
  assert.deepEqual(IDEAS.map(i => i.id), ['genero-diferencia', 'rasgo-necesario', 'definicion-a-palabra', 'definicion-defectuosa', 'definicion-en-texto']);
  assert.deepEqual(porIdea.map(es => es.filter(e => e.simple).length), [4, 2, 2, 2, 2], 'términos que estrena cada idea, con su aproximación (la negativa, sin «simple»: no adelanta la predicción de la idea 4)');
  for (const g of def.glosario) assert.ok((g.ejemplos || []).length >= 3, `«${g.termino}»: tres ejemplos`);
});

for (const idea of IDEAS) {
  const k = IDEAS.indexOf(idea) + 1, figs = figuras(idea);

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
      assert.ok(!/class="rv-(marca|tacha|pieza)/.test(s), `${f.q}: la figura ya trae una marca`);
    }
  });

  test(`idea ${k} · R5: la primera tarjeta de «Lee» muestra el texto en su soporte, y el mismo soporte abre el juego`, () => {
    const t = idea.lee.tarjetas[0];
    assert.equal(t.pieza, 'rv-soporte');
    const d = t.dibujo.datos, h = d.hojas[0];
    assert.ok(h.oraciones.length >= 1 && (d.soporte === 'simulacro' || (d.lugar && h.de && h.para)), 'lugar, quién escribe y para quién');
    const abre = idea.juega.dibujo(Teoria.inicio(idea.juega)).datos, base = typeof abre.soporte === 'object' ? abre.soporte : abre;
    const sinToques = x => Object.fromEntries(Object.entries(x).filter(([c]) => c !== 'toques'));
    assert.deepEqual(sinToques(base), sinToques(d));
  });

  test(`idea ${k} · la correcta no es la más larga ni la más corta; una incorrecta por código, y el código existe`, () => {
    const codigos = require('../../razonamiento-verbal/codigos.json');
    const ps = [{ q: 'predice', ops: idea.predice.opciones.map(o => ({ t: o.texto, ok: !!o.correcta, error: o.error })) }];
    const vistos = new Set();
    for (let s = 0; s < SEMILLAS; s++) {
      const A = idea.ahoraTu.generar(s);
      if (vistos.has(A.pregunta + JSON.stringify(A.dibujo.datos))) continue; vistos.add(A.pregunta + JSON.stringify(A.dibujo.datos));
      ps.push({ q: `ahora tú ${s}`, ops: A.opciones.map(o => ({ t: o.texto, ok: !!o.correcta, error: o.error })) });
    }
    assert.ok(ps.length >= 7, 'la predicción y seis «Ahora tú»');
    for (const p of ps) {
      const l = p.ops.map(o => o.t.length), c = p.ops.find(o => o.ok).t.length;
      assert.ok(c < Math.max(...l) && c > Math.min(...l), `${p.q}: la correcta mide ${c} y las opciones van de ${Math.min(...l)} a ${Math.max(...l)}`);
      const cods = p.ops.filter(o => !o.ok).map(o => o.error);
      assert.ok(cods.every(Boolean) && new Set(cods).size === cods.length, `${p.q}: códigos ${cods}`);
      for (const c2 of cods) assert.ok(codigos[c2], `${p.q}: ${c2} no está en codigos.json`);
    }
    for (const h of hojas(idea)) {
      const l = h.alts.map(a => a.t.length), c = h.alts.find(a => a.id === h.L).t.length;
      assert.ok(c < Math.max(...l) && c > Math.min(...l), `${h.q}: la correcta (${h.L}) mide ${c} y las alternativas van de ${Math.min(...l)} a ${Math.max(...l)}`);
    }
  });

  test(`idea ${k} · R2: en las hojas con letras fijas la respuesta nombra una alternativa, y la buena cambia de lugar`, () => {
    for (const h of hojas(idea)) assert.ok(h.alts.some(a => a.id === h.L), `${h.q}: la respuesta nombra la ${h.L}`);
    const n3 = idea.ejemplos.filter(e => e.nivel === 3 && e.figura.datos.alternativas).map(e => plano(e.respuesta)[0]);
    assert.equal(n3.length, 5, 'cinco ejemplos de nivel 3 con su hoja');
    assert.deepEqual([...n3].sort(), ['A', 'B', 'C', 'D', 'E'], `cada letra una vez: ${n3}`);
    const lugares = new Set();
    for (let s = 0; s < 4; s++) { const R = idea.resuelve.generar(s); lugares.add(plano(R.respuesta).slice(0, 4)); }
    assert.ok(lugares.size >= 3, [...lugares].join());
  });

  test(`idea ${k} · R1: los ejemplos del glosario de la idea no usan frases de la idea ni nombran lo que allí se define`, () => {
    const frases = new Set(), palabras = new Set();
    const sop = d => {
      const s = d && d.soporte && typeof d.soporte === 'object' ? d.soporte : d;
      for (const h of (s && s.hojas) || []) for (const o of h.oraciones || []) { frases.add(o.t); if (o.lema) palabras.add(o.lema); }
      for (const a of (s && s.alternativas) || []) frases.add(a.t);
      if (d && d.entrada) palabras.add(d.entrada.termino);
      for (const f of (d && d.casos && d.casos.filas) || []) palabras.add(f.celdas[0]);
    };
    for (const f of figs) sop(f.d.datos);
    for (const o of idea.predice.opciones) frases.add(o.texto);
    for (let s = 0; s < SEMILLAS; s++) { const A = idea.ahoraTu.generar(s); for (const o of A.opciones) frases.add(o.texto); for (const [, q] of A.pregunta.matchAll(/«([^»]+)»/g)) palabras.add(q); }
    for (const e of idea.ejemplos) for (const [, q] of (plano(e.enunciado) + ' ' + e.titulo).matchAll(/«([^»]+)»/g)) if (q.split(' ').length <= 2) palabras.add(q);
    const fs = [...frases].map(norm).filter(x => x.length >= 12), ws = [...palabras].map(norm).filter(x => x.length >= 4);
    assert.ok(fs.length > 30, 'la prueba no corre en vacío');
    const malos = [];
    for (const g of porIdea[k - 1].filter(x => x.simple)) for (const ej of g.ejemplos) {
      const n = ` ${norm(ej)} `;
      for (const f of fs) if (n.includes(f)) malos.push(`«${g.termino}»: «${ej}» copia «${f}»`);
      for (const w of ws) if (new RegExp(`[ ]${w}s?[ ]`).test(n)) malos.push(`«${g.termino}»: «${ej}» nombra «${w}», que la idea define o usa de caso`);
    }
    assert.deepEqual(malos, []);
  });
}

test('idea 1: la ficha de la predicción va con sus tres huecos, y todo texto de la ficha cabe en su casilla (ideas 1 y 2)', () => {
  const idea = IDEAS[0];
  assert.equal((svg(idea.pieza, idea.predice.dibujo).match(/class="rv-hueco"/g) || []).length, 3);
  const P = Kit.piezas['rv-definicion'];
  for (const f of [...figuras(IDEAS[0]), ...figuras(IDEAS[1])].filter(x => x.pieza === 'rv-definicion')) {
    const L = P.disponer(f.d.datos), partes = (f.d.estado && f.d.estado.partes) || {};
    for (const fila of L.ficha.filas) {
      const t = partes[fila.id] || fila.hueco;
      assert.ok(T.ancho(t, 15, 700) <= fila.tw, `${f.q}: «${t}» no cabe en la casilla (${Math.round(T.ancho(t, 15, 700))} > ${fila.tw})`);
    }
    for (const fila of L.tabla.filas) fila.celdas.forEach((c, i) => {
      const fin = i < fila.celdas.length - 1 ? fila.celdas[i + 1].x : L.tabla.x + L.tabla.w - 4;
      assert.ok(c.x + T.ancho(c.texto, 14) <= fin, `${f.q}: «${c.texto}» se sale de su columna`);
    });
    if (f.d.estado && f.d.estado.sello) assert.ok(L.tabla.sello.x + T.ancho(f.d.estado.sello.t, 14, 700) <= 312, `${f.q}: el sello «${f.d.estado.sello.t}» no cabe`);
  }
});

test('las letras correctas de los 25 ejemplos de nivel 3 se reparten: cinco veces cada una', () => {
  const cuenta = {};
  for (const i of IDEAS) for (const e of i.ejemplos) if (e.nivel === 3 && e.figura.datos.alternativas) { const L = plano(e.respuesta)[0]; cuenta[L] = (cuenta[L] || 0) + 1; }
  assert.deepEqual(cuenta, { A: 5, B: 5, C: 5, D: 5, E: 5 });
});

test('los juegos de las ideas 3, 4 y 5 se juegan tocando la hoja: cada control tiene su toque en la figura', () => {
  for (const idea of IDEAS.slice(2)) {
    const d = idea.juega.dibujo(Teoria.inicio(idea.juega)).datos, s = svg(idea.pieza, { datos: d, estado: {} });
    for (const c of idea.juega.controles) assert.ok(s.includes(`data-toque="${c.id}"`), `${idea.id}: falta el toque de «${c.id}»`);
    // Una sola combinación cumple la misión, y no al abrir.
    const cumplen = Teoria.grilla(idea.juega.controles).filter(v => idea.juega.mision.logrado(v));
    assert.equal(cumplen.length, 1, idea.id);
    assert.ok(!idea.juega.mision.logrado(Teoria.inicio(idea.juega)));
  }
});

// ---------- Auditoría y lectores en frío (19 nov; rutinas/auditoria/razonamiento-verbal.definiciones.md) ----------
// Cada prueba falla con la versión 0.4.0 y pasa con la 0.4.1.
const textoDe = x => plano(x);
const preguntasLista = () => {
  // Ejemplos de niveles 1 y 2 con la lista de candidatas en el enunciado («x», «y» o «z»).
  const out = [];
  IDEAS.forEach((idea, k) => idea.ejemplos.forEach(e => {
    const m = plano(e.enunciado).match(/((?:«[^»]+»,? )+(?:o|u) «[^»]+»)/);
    if (!m || (e.figura.datos.alternativas || []).length) return;
    const items = [...m[1].matchAll(/«([^»]+)»/g)].map(x => x[1]);
    const r = plano(e.respuesta).toLowerCase(), citas = [...r.matchAll(/«([^»]+)»/g)].map(x => x[1]);
    const ok = items.filter(x => { const w = x.toLowerCase(); return r.replace(/[«»]/g, '').startsWith(w) || citas.some(c => c === w || c.endsWith(` ${w}`)); });
    out.push({ q: `idea ${k + 1} «${e.titulo}»`, items, ok });
  }));
  return out;
};

test('A1: en «¿Cuál es muy estrecha?» solo una alternativa deja un caso fuera (antes, «hermano» dejaba fuera al medio hermano)', () => {
  const e = IDEAS[1].ejemplos.find(x => /muy estrecha\?/.test(plano(x.enunciado)));
  const alts = e.figura.datos.alternativas.map(a => a.t);
  assert.ok(!alts.some(t => /^Hermano: persona que tiene los mismos padres/.test(t)), 'un medio hermano no tiene los mismos padres y es hermano');
  // Mundo chico, escrito aparte: por palabra, un caso que es la cosa y que la definición podría dejar fuera.
  const casoRaro = { Zapato: 'cubre el pie', Mes: 'una de las doce partes', Cuchara: 'de palo', Año: 'doce meses', Vecino: 'cerca de otra', Hermano: 'medio hermano' };
  const fuera = alts.filter(t => { const w = t.split(':')[0]; return w === 'Cuchara' || w === 'Hermano'; });
  assert.deepEqual(fuera, ['Cuchara: cubierto de metal con una parte honda.'], Object.keys(casoRaro).join());
});

test('A2: en la idea 5 ningún ejemplo da un lugar como el rasgo que define (antes, «el Misti, cerca de Arequipa»)', () => {
  const r = IDEAS[4].ejemplos.map(e => plano(e.respuesta) + ' ' + plano(e.solucion.map(x => x.texto))).join(' ');
  assert.ok(!/Misti/.test(r), 'el Misti y el Chachani son volcanes cerca de Arequipa: un lugar no separa');
});

test('M1: las listas de los ejemplos de nivel 1 y 2 tienen una sola correcta, ni la más larga ni la más corta, y no siempre al final', () => {
  const ls = preguntasLista();
  assert.ok(ls.length >= 12, `${ls.length} listas`);
  let ultima = 0;
  for (const p of ls) {
    assert.equal(p.ok.length, 1, `${p.q}: ${p.ok}`);
    const l = p.items.map(x => x.length), c = p.ok[0].length;
    assert.ok(c < Math.max(...l) && c > Math.min(...l), `${p.q}: la correcta mide ${c} y las candidatas ${l}`);
    if (p.items.indexOf(p.ok[0]) === p.items.length - 1) ultima++;
  }
  assert.ok(ultima / ls.length <= 0.4, `la correcta va al final en ${ultima} de ${ls.length}`);
});

test('M1: «Así se resuelve» con definiciones numeradas: la correcta no empata con la más larga ni con la más corta', () => {
  for (const idea of IDEAS) for (let s = 0; s < 4; s++) {
    const R = idea.resuelve.generar(s), d = R.dibujo.datos;
    if ((d.alternativas || []).length) continue;
    const ors = d.hojas[0].oraciones.map(o => o.t), n = +plano(R.respuesta).match(/La (\d)/)[1], l = ors.map(t => t.length);
    assert.ok(l[n - 1] < Math.max(...l) && l[n - 1] > Math.min(...l), `${idea.id} resuelve ${s}: ${l}`);
  }
});

test('M2: en la idea 3 la correcta no se reconoce por ser la palabra que está dentro de otra alternativa', () => {
  const idea = IDEAS[2], ps = [];
  ps.push(idea.predice.opciones.map(o => ({ t: o.texto, ok: !!o.correcta })));
  ps.push(idea.juega.dibujo(Teoria.inicio(idea.juega)).datos.alternativas.map(a => ({ t: a.t, ok: a.id === 'D' })));
  for (let s = 0; s < 6; s++) ps.push(idea.ahoraTu.generar(s).opciones.map(o => ({ t: o.texto, ok: !!o.correcta })));
  for (let s = 0; s < 4; s++) { const R = idea.resuelve.generar(s), L = plano(R.respuesta)[0]; ps.push(R.dibujo.datos.alternativas.map(a => ({ t: a.t, ok: a.id === L }))); }
  for (const e of idea.ejemplos.filter(x => x.nivel === 3)) { const L = plano(e.respuesta)[0]; ps.push(e.figura.datos.alternativas.map(a => ({ t: a.t, ok: a.id === L }))); }
  const low = t => t.toLowerCase().replace(/\.$/, '');
  // La «pista» que se mide: elegir la única alternativa que está escrita dentro de otra.
  const delata = ps.filter(ops => { const dentro = ops.filter(o => ops.some(x => x !== o && low(x.t).includes(low(o.t)))); return dentro.length === 1 && dentro[0].ok; }).length;
  assert.ok(delata / ps.length <= 0.4, `la pista acierta en ${delata} de ${ps.length}`);
});

test('M3: el juego de la idea 3 no trae la palabra más específica: la predicción la estrena', () => {
  const idea = IDEAS[2], alts = idea.juega.dibujo(Teoria.inicio(idea.juega)).datos.alternativas.map(a => a.t);
  const ok = 'olla';
  assert.ok(!alts.some(t => t !== ok && t.startsWith(`${ok} `)), alts.join());
  assert.ok(idea.predice.opciones.some(o => o.error === 'RVD10'), 'la predicción trae la más específica');
});

test('M4: en la idea 5 la oración que define no está casi siempre en el mismo lugar', () => {
  const idea = IDEAS[4], pos = [];
  const lugar = (ors, termino) => ors.findIndex(o => new RegExp(`(^|\\s)${termino}( colonial)? (es|era|fue) |se llama ${termino}`, 'i').test(o)) + 1;
  for (let s = 0; s < 6; s++) { const A = idea.ahoraTu.generar(s), ors = A.dibujo.datos.hojas[0].oraciones.map(o => o.t), t = A.pregunta.match(/«([^»]+)»/)[1]; pos.push(lugar(ors, t)); }
  for (let s = 0; s < 4; s++) { const R = idea.resuelve.generar(s), ors = R.dibujo.datos.hojas[0].oraciones.map(o => o.t), t = R.dibujo.datos.pregunta.match(/«([^»]+)»/)[1]; pos.push(lugar(ors, t)); }
  for (const e of idea.ejemplos.filter(x => x.nivel === 3)) { const d = e.figura.datos; pos.push(lugar(d.hojas[0].oraciones.map(o => o.t), d.pregunta.match(/«([^»]+)»/)[1])); }
  assert.ok(pos.every(p => p > 0), `${pos}`);
  const cuenta = {}; for (const p of pos) cuenta[p] = (cuenta[p] || 0) + 1;
  assert.ok(Math.max(...Object.values(cuenta)) / pos.length <= 0.5, JSON.stringify(cuenta));
});

test('M5: el glosario de la idea 4 no adelanta su predicción (la definición negativa no sale en «Palabras de esta idea»)', () => {
  const pal = porIdea[3].filter(x => x.simple);
  const correcta = norm(IDEAS[3].predice.opciones.find(o => o.correcta).texto);
  for (const g of pal) for (const t of [g.simple, ...g.ejemplos]) {
    assert.ok(!/\bno es\b/.test(norm(t)) || !/solo dice lo que no es/.test(correcta), `«${g.termino}»: «${t}»`);
    assert.ok(!/entra (la|el) /.test(norm(t)), `«${g.termino}»: «${t}» muestra quién se cuela`);
  }
});

test('M6: Lee dice en palabras «rasgo» y «muy amplia» (idea 1) y «muy estrecha» (idea 2) antes del juego', () => {
  const lee = k => IDEAS[k].lee.tarjetas.map(t => t.texto).join(' ');
  const antes = (k, w) => { const t = lee(k); return t.indexOf(w) >= 0; };
  assert.ok(/rasgo: algo que la cosa tiene/.test(lee(0)), 'la idea 1 dice qué es un rasgo');
  assert.ok(antes(0, 'muy amplia'), 'la idea 1 dice «muy amplia»');
  assert.ok(antes(1, 'muy estrecha'), 'la idea 2 dice «muy estrecha»');
});

test('M7: si un rasgo deja aves fuera y deja entrar a otro animal, la lectura dice las dos fallas', () => {
  const j = IDEAS[1].juega;
  for (const v of Teoria.grilla(j.controles)) {
    const l = plano(j.lectura(v)), cuela = /se cuela/.test(l), fuera = /fuera/.test(l);
    if (cuela && fuera) assert.ok(/estrecha/.test(l) && /amplia/.test(l), `${JSON.stringify(v)}: «${l}»`);
  }
  assert.ok(Teoria.grilla(j.controles).some(v => /estrecha y muy amplia/.test(plano(j.lectura(v)))), 'algún rasgo falla por los dos lados');
});

test('M8: cada falla que nombra un resuelto está en sus Datos (ejemplos y «Así se resuelve»)', () => {
  const NOM = [[/muy amplia/i, 'Muy amplia:'], [/muy estrecha/i, 'Muy estrecha:'], [/define (al|a un) vecino/i, 'Define al vecino:'], [/la más general/i, 'La más general:'],
    [/la más específica/i, 'La más específica:'], [/cambia (el|un|otro) rasgo/i, 'El vecino:'], [/otra clase/i, 'Otra clase:'], [/circular/i, 'Circular:'], [/figurada/i, 'Figurada:'], [/negativa|solo niega/i, 'Negativa:']];
  const mira = (q, datos, texto) => { for (const [re, ini] of NOM) if (re.test(texto)) assert.ok(datos.some(d => d.startsWith(ini)), `${q}: nombra ${re} sin «${ini}» en Datos`); };
  IDEAS.forEach((idea, k) => {
    idea.ejemplos.forEach(e => mira(`idea ${k + 1} «${e.titulo}»`, e.datos, plano(e.solucion.map(x => x.texto))));
    for (let s = 0; s < 4; s++) { const R = idea.resuelve.generar(s); mira(`idea ${k + 1} resuelve ${s}`, R.datos, plano(R.pasos.filter(p => p.tipo === 'aplica').map(p => p.texto))); }
  });
  for (let s = 0; s < 6; s++) { const A = IDEAS[2].ahoraTu.generar(s); for (const ini of ['El vecino:', 'Otra clase:']) assert.ok(A.datos.some(d => d.startsWith(ini)), `idea 3 ahora tú ${s}: falta «${ini}»`); }
});

test('M9: «Ahora tú» de la idea 2 trae en la lámina o en Datos el hecho que hace falta (no se sabe de memoria)', () => {
  const clave = { branquias: 'branquias', leche: 'leche', 'seis patas': 'seis patas', sopla: 'sopla', doce: 'doce', 'tres lados': 'tres lados' };
  for (let s = 0; s < 6; s++) {
    const A = IDEAS[1].ahoraTu.generar(s), ok = A.opciones.find(o => o.correcta).texto.toLowerCase();
    const k = Object.keys(clave).find(w => ok.includes(w) || (w === 'sopla' && ok.includes('sopla')));
    assert.ok(k, `ahora tú ${s}: «${ok}»`);
    const visto = (A.dibujo.datos.hojas[0].oraciones.map(o => o.t).join(' ') + ' ' + A.datos.join(' ') + ' ' + A.pregunta).toLowerCase();
    if (k !== 'tres lados') assert.ok(visto.includes(clave[k]), `ahora tú ${s}: «${clave[k]}» no está en la lámina ni en Datos`);
  }
});

test('M10: el ejemplo de verbo de los Datos no es una alternativa de la idea 3', () => {
  const v = IDEAS[2].ejemplos.flatMap(e => e.datos).find(d => /empieza con un verbo/.test(d)).match(/«([^»]+)»/)[1];
  const alts = new Set();
  for (const e of IDEAS[2].ejemplos) { for (const a of e.figura.datos.alternativas || []) alts.add(a.t); for (const [, q] of plano(e.enunciado).matchAll(/«([^»]+)»/g)) alts.add(q); }
  for (let s = 0; s < 6; s++) for (const o of IDEAS[2].ahoraTu.generar(s).opciones) alts.add(o.texto);
  assert.ok(!alts.has(v), `«${v}» es una alternativa`);
});

test('B1: sin «Ilave» (la I se lee como l: «llave»), sin la línea «no es color del texto» y sin «comprensión de lectura» bajo la hoja de razonamiento verbal', () => {
  const todo = JSON.stringify(def, (k, v) => (typeof v === 'function' ? String(v) : v)) + IDEAS.map(i => [0, 1, 2, 3].map(s => JSON.stringify(i.resuelve.generar(s)))).join('');
  assert.ok(!/Ilave/.test(todo));
  for (const i of IDEAS) assert.ok(!i.juega.leyenda.some(l => /no es color/.test(plano(l.t))), i.id);
  for (let s = 0; s < 4; s++) assert.ok(!/comprensión de lectura/.test(IDEAS[4].resuelve.generar(s).enunciado));
  for (const e of IDEAS[4].ejemplos) assert.ok(!/comprensión de lectura/.test(plano(e.enunciado)), e.titulo);
});

test('B2: la regla de la idea 4 pide un rasgo que separe (la alpaca del juego tiene clase y rasgo, y no separa)', () => {
  assert.ok(/un rasgo que separe/.test(IDEAS[3].regla.texto));
  assert.ok(!/muy amplia/.test(plano(IDEAS[3].juega.lectura({ a: 0, b: 1, c: 0, d: 0 }))), 'la lectura de la alpaca habla del rasgo que no separa');
});

test('B3: en la idea 4, lo que se descarta no va en turquesa', () => {
  const malos = [];
  for (const e of IDEAS[3].ejemplos) for (const p of e.solucion) for (const x of p.texto) if (x && x.v === 'c-i' && /tejedor|no es caliente|primavera|panadero|un amigo|lector|el faro|el motor|almuerzo ni la cena/.test(x.t)) malos.push(`${e.titulo}: «${x.t}»`);
  assert.deepEqual(malos, []);
});
