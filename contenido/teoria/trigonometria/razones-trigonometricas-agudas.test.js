// Pruebas propias de «Razones trigonométricas de ángulos agudos» (además del validador común de
// contenido/teoria/teoria.test.js), de la auditoría del 17 nov (rutinas/auditoria/trigonometria.razones-trigonometricas-agudas.md):
//   - regla de colores de la unidad (molde §5b; comentario de cabecera de la unidad): en cada figura de la pieza
//     trig-objeto, cada lado lleva el color de su nombre desde el ángulo de la figura (CO naranja, CA turquesa, H en tinta;
//     los lados que no son de un triángulo, en tinta; nunca violeta). Si un lado cambia de color, o si su color señala
//     otro nombre (el de un distractor), la prueba falla. Qué es cada lado lo calcula la pieza (trig-objeto, papeles);
//   - los ejercicios de la idea 1 (ejemplos, «Así se resuelve» y «Ahora tú») van en tinta: ahí se practica nombrar;
//   - la señal y la escuadra se pintan siempre desde 30°, en todas sus figuras;
//   - «Ahora tú» trae siempre cuatro opciones distintas, en 400 semillas;
//   - los datos dan herramientas, no la respuesta: ni «cos 37° = 4/5» cuando se pide cos 37°, ni «mide 16,26°» cuando se
//     pide el ángulo, ni la hipotenusa ya dicha en partes («5k»), en «Ahora tú» (400 semillas) y en los 75 ejemplos.
// Se recorren todos los dibujos: Lee, el juego en toda su grilla, Predice, Mira paso a paso, «Ahora tú» y «Así se
// resuelve» en 400 semillas y los ejemplos.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../../../nucleo/kit/kit.js');
const Teoria = require('../../../nucleo/teoria.js');
const def = require('./razones-trigonometricas-agudas.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const P = Kit.piezas['trig-objeto'];
const SEMILLAS = 400;

// Todos los dibujos de la pieza: { donde, idea (índice), ejercicio (ejemplo, «Así se resuelve» o «Ahora tú»), datos }.
function dibujos() {
  const out = [];
  const add = (donde, k, ejercicio, pieza, dib) => { if (dib && dib.datos && pieza === 'trig-objeto') out.push({ donde, idea: k, ejercicio, datos: dib.datos }); };
  def.ideas.forEach((idea, k) => {
    const p = idea.pieza;
    for (const [i, t] of ((idea.lee && idea.lee.tarjetas) || []).entries()) add(`${idea.id} lee ${i + 1}`, k, false, t.pieza || p, t.dibujo);
    const j = idea.juega, base = Teoria.inicio(j);
    for (const v of Teoria.grilla(j.controles || [])) add(`${idea.id} juega ${JSON.stringify(v)}`, k, false, j.pieza || p, j.dibujo(Object.assign({}, base, v)));
    add(`${idea.id} predice`, k, false, idea.predice.pieza || p, idea.predice.dibujo);
    add(`${idea.id} revelar`, k, false, idea.predice.pieza || p, idea.predice.revelar);
    add(`${idea.id} mira`, k, false, idea.mira.pieza || p, { datos: idea.mira.datos });
    for (const [i, e] of (idea.ejemplos || []).entries()) if (e.figura) add(`${idea.id} ejemplo ${i + 1} «${e.titulo}»`, k, true, e.figura.pieza, e.figura);
    for (let s = 0; s < SEMILLAS; s++) {
      const a = idea.ahoraTu.generar(s);
      if (a.dibujo) add(`${idea.id} ahora tú ${s}`, k, true, a.dibujo.pieza || idea.ahoraTu.pieza || p, a.dibujo);
      if (idea.resuelve) { const r = idea.resuelve.generar(s); if (r.dibujo) add(`${idea.id} resuelve ${s}`, k, true, r.dibujo.pieza || idea.resuelve.pieza || p, r.dibujo); }
    }
  });
  return out;
}
const TODOS = dibujos();
const COLOR = { co: 'o', ca: 'i' };

test('hay figuras de la pieza en todas las ideas (la prueba no corre en vacío)', () => {
  assert.ok(TODOS.length > 1000, `${TODOS.length} figuras`);
  for (let k = 0; k < def.ideas.length; k++) assert.ok(TODOS.some(d => d.idea === k && d.ejercicio), `idea ${k + 1} sin ejercicios con figura`);
});

test('colores: cada lado lleva el color de su nombre desde el ángulo de la figura (CO naranja, CA turquesa, H en tinta)', () => {
  const mal = [];
  for (const d of TODOS) {
    const { desde, papel } = P.papeles(d.datos), cs = P.coloresDe(d.datos);
    for (const [k, colores] of Object.entries(cs)) for (const c of colores) {
      const esperado = COLOR[papel[k]];
      if (c !== esperado) mal.push(`${d.donde}: el lado ${k} (${papel[k] || 'fuera del triángulo'} desde ${desde}) va en ${c}; le toca ${esperado || 'tinta'}`);
    }
  }
  assert.deepEqual(mal.slice(0, 20), []);
});

test('la idea 1 practica nombrar: sus ejercicios van en tinta (ningún lado con color)', () => {
  for (const d of TODOS.filter(x => x.idea === 0 && x.ejercicio)) {
    const svg = P.dibujar(d.datos, { final: true });
    assert.ok(!/var\(--c-[oifd]\)/.test(svg), `${d.donde}: un lado con color en un ejercicio de la idea 1`);
  }
});

test('la señal y la escuadra no cambian de colores: siempre desde 30°', () => {
  const vistos = { senal: 0, escuadras: 0 };
  for (const d of TODOS.filter(x => x.datos.objeto === 'senal' || x.datos.objeto === 'escuadras')) {
    const cs = P.coloresDe(d.datos);
    if (!Object.keys(cs).length) continue;
    vistos[d.datos.objeto]++;
    assert.equal(P.papeles(d.datos).desde, d.datos.objeto === 'senal' ? 'b' : 'a', `${d.donde}: no se pinta desde 30°`);
  }
  assert.ok(vistos.senal > 5 && vistos.escuadras > 5, JSON.stringify(vistos));
});

test('«Ahora tú» trae siempre cuatro opciones distintas y una sola correcta (400 semillas)', () => {
  for (const idea of def.ideas) for (let s = 0; s < SEMILLAS; s++) {
    const c = idea.ahoraTu.generar(s), ops = c.opciones;
    assert.equal(ops.length, 4, `${idea.id} ahora tú ${s}: ${ops.length} opciones`);
    assert.equal(new Set(ops.map(o => o.texto)).size, 4, `${idea.id} ahora tú ${s}: opciones repetidas`);
    assert.equal(ops.filter(o => o.correcta).length, 1, `${idea.id} ahora tú ${s}`);
  }
});

// Texto plano de una parte de la teoría (fracciones como a/b).
const plano = x => (x === null || x === undefined ? '' : typeof x === 'string' || typeof x === 'number' ? String(x)
  : Array.isArray(x) ? x.map(plano).join('') : x.t !== undefined ? plano(x.t) : x.frac ? `${plano(x.frac[0])}/${plano(x.frac[1])}`
    : x.sup ? `${plano(x.sup[0])}${plano(x.sup[1]) === '2' ? '²' : plano(x.sup[1])}` : x.raiz ? `√(${plano(x.raiz)})` : x.par ? `(${plano(x.par)})` : x.sub ? plano(x.sub) : '')
  .replace(/ /g, ' ');
// Las relaciones «sen 37° = 3/5» de una línea de datos: [lado izquierdo, valor].
const relaciones = l => [...l.matchAll(/\b((?:sen|cos|tan|cot|sec|csc)²? \d+(?:,\d+)?°) = ([^;,(]+?)(?=\s*(?:;|,| y |\(|$))/g)].map(m => [m[1], m[2].trim()]);
// ¿Los datos traen la respuesta? pide: el texto de la pregunta; resp: los textos de la respuesta.
function trae(datos, pide, resp) {
  const ls = (datos || []).map(plano);
  for (const l of ls) {
    for (const [izq, val] of relaciones(l)) if (pide.includes(izq) && resp.includes(val)) return `«${l}» da ${izq} = ${val}`;
    for (const r of resp) if (/\d/.test(r) && l.includes(`mide ${r}`)) return `«${l}» dice que mide ${r}`;
    if (/(hipotenusa|cateto)[^.;]*\b\d+k\b/i.test(l)) return `«${l}» da el lado en partes (el paso hecho)`;
  }
  return null;
}

test('los datos de «Ahora tú» no traen la respuesta (400 semillas)', () => {
  for (const idea of def.ideas) for (let s = 0; s < SEMILLAS; s++) {
    const c = idea.ahoraTu.generar(s), bien = c.opciones.find(o => o.correcta).texto;
    const m = trae(c.datos, plano(c.pregunta), [bien]);
    assert.equal(m, null, `${idea.id} ahora tú ${s}: ${m}`);
  }
  // La lista de la convención (auditoría, M2): nunca sen o cos de 37° o 16°, que están en los datos.
  const conv = def.ideas.find(i => i.id === 'aproximados');
  for (let s = 1; s < SEMILLAS; s += 3) assert.ok(!/(sen|cos) (37|16)°/.test(plano(conv.ahoraTu.generar(s).pregunta)), `semilla ${s}`);
});

test('los datos de los ejemplos no traen la respuesta ni el paso hecho', () => {
  for (const idea of def.ideas) for (const e of idea.ejemplos) {
    const resp = [].concat(e.respuesta).filter(x => x && typeof x === 'object' && x.v === 'c-f').map(x => plano(x.t))
      .flatMap(t => [t, ...t.split(/ = | ≈ /).map(z => z.trim())]);
    const m = trae(e.datos, plano(e.enunciado), resp);
    assert.equal(m, null, `${idea.id} «${e.titulo}»: ${m}`);
  }
});
