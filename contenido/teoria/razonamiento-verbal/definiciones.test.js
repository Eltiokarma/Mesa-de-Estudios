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

test('la unidad pasa el contrato como si ya fuera de calidad 2, y no lleva la marca', () => {
  assert.deepEqual(Teoria.problemas(Object.assign({}, def, { calidad: 2 }), { semillas: SEMILLAS }), []);
  assert.equal(def.calidad, undefined, 'la unidad no se marca calidad 2: la sesión lo hace después del lector en frío y el auditor');
  assert.deepEqual(IDEAS.map(i => i.id), ['genero-diferencia', 'rasgo-necesario', 'definicion-a-palabra', 'definicion-defectuosa', 'definicion-en-texto']);
  assert.deepEqual(porIdea.map(es => es.filter(e => e.simple).length), [4, 2, 2, 3, 2], 'términos que estrena cada idea, con su aproximación');
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
