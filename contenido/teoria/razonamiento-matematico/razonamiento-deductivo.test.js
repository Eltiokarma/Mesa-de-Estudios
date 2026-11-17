// Pruebas propias de «Razonamiento deductivo» (además del validador común de contenido/teoria/teoria.test.js), para la
// idea 1 rehecha en la etapa 3 (docs/etapa3/decisiones.md):
//   - paleta de deducción (comentario de cabecera de la unidad): en toda figura y todo texto de la idea 1, lo seguro y
//     la respuesta en violeta, lo descartado en gris, lo demás en tinta; nada en naranja, turquesa, verde ni carmín. Si un
//     papel cambia de color, la prueba falla;
//   - ninguna figura de Predice ni de un ejemplo (ni el enunciado de «Ahora tú» o «Así se resuelve») delata la respuesta:
//     sin ✓, sin repartos tachados, sin cosas en la mano;
//   - «Ahora tú» (400 semillas) se resuelve aparte: se leen las pistas de los datos con un lector propio (no usa el código
//     de la unidad), se prueban todos los repartos y la opción correcta es la única que vale;
//   - el juego, la misión y la predicción, contados aparte; el orden de las ideas es el aprobado.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../../../nucleo/kit/kit.js');
const Teoria = require('../../../nucleo/teoria.js');
const def = require('./razonamiento-deductivo.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const P = Kit.piezas['rm-objeto'];
const IDEA = def.ideas[0];
const SEMILLAS = 400;

// ---------- Un resolvedor aparte: permutaciones y un lector de pistas escrito para esta prueba ----------
const permutaciones = xs => (xs.length <= 1 ? [xs] : xs.flatMap((x, i) => permutaciones(xs.slice(0, i).concat(xs.slice(i + 1))).map(p => [x].concat(p))));
const VERBOS = ['juega', 'está en', 'vende'];
function leer(caso) {
  const pre = Teoria.plano(caso.pregunta);
  const m = pre.match(/^(.+?) (?:se inscribieron|están cada uno|venden cada uno)[^:]*: (.+?)\. (¿.*)$/);
  assert.ok(m, `no leo la pregunta: ${pre}`);
  const nombres = m[1].split(/, | y /), cosas = m[2].split(/, | o /), pregunta = m[3];
  const verbo = VERBOS.find(v => caso.datos[0].includes(v === 'está en' ? 'está en' : v));
  const reglas = [];
  for (const l of caso.datos.filter(x => /^Pista \d+: /.test(x)).map(x => x.replace(/^Pista \d+: /, '').replace(/\.$/, ''))) {
    let r;
    if ((r = l.match(new RegExp(`^Quien ${verbo} (.+?) (?:conversa|almuerza|estudia|viaja) con (\\S+) y con (\\S+)$`)))) reglas.push(a => a[r[2]] !== r[1] && a[r[3]] !== r[1]);
    else if ((r = l.match(new RegExp(`^(\\S+) (?:conversa|almuerza|estudia|viaja) con quien ${verbo} (.+)$`)))) reglas.push(a => a[r[1]] !== r[2]);
    else if ((r = l.match(new RegExp(`^(\\S+) no ${verbo} (.+?) ni (?:en )?(.+)$`)))) reglas.push(a => a[r[1]] !== r[2] && a[r[1]] !== r[3]);
    else if ((r = l.match(new RegExp(`^(\\S+) no ${verbo} (.+)$`)))) reglas.push(a => a[r[1]] !== r[2]);
    else if ((r = l.match(new RegExp(`^(\\S+) ${verbo} (.+)$`)))) reglas.push(a => a[r[1]] === r[2]);
    else assert.fail(`no leo la pista «${l}»`);
  }
  const repartos = permutaciones(cosas).map(p => Object.fromEntries(nombres.map((x, i) => [x, p[i]]))).filter(a => reglas.every(f => f(a)));
  return { nombres, cosas, pregunta, verbo, repartos };
}
// Una afirmación «X hace c» de una opción: cuántos de los repartos que quedan la cumplen.
function afirmacion(L, texto) {
  const r = texto.match(new RegExp(`^(\\S+) ${L.verbo} (.+)$`));
  assert.ok(r, `no leo la opción «${texto}»`);
  return L.repartos.filter(a => a[r[1]] === r[2]).length;
}

// ---------- Todos los dibujos y textos de la idea 1 ----------
function dibujos() {
  const out = [];
  const add = (donde, pieza, dib, antes) => { if (dib && dib.datos) out.push({ donde, pieza, datos: dib.datos, estado: dib.estado || {}, antes }); };
  const p = IDEA.pieza;
  for (const [i, t] of IDEA.lee.tarjetas.entries()) add(`lee ${i + 1}`, t.pieza || p, t.dibujo, true);
  const j = IDEA.juega;
  for (const v of Teoria.grilla(j.controles)) add(`juega ${JSON.stringify(v)}`, j.pieza || p, j.dibujo(v));
  add('predice', p, IDEA.predice.dibujo, true);
  add('revelar', p, IDEA.predice.revelar);
  for (const [i, x] of IDEA.mira.pasos.entries()) add(`mira ${i + 1}`, IDEA.mira.pieza || p, { datos: IDEA.mira.datos, estado: x.estado });
  for (const [i, e] of IDEA.ejemplos.entries()) add(`ejemplo ${i + 1}`, e.figura.pieza, e.figura, true);
  for (let s = 0; s < SEMILLAS; s++) {
    const a = IDEA.ahoraTu.generar(s), r = IDEA.resuelve.generar(s);
    add(`ahora tú ${s}`, IDEA.ahoraTu.pieza, a.dibujo, true);
    add(`ahora tú ${s} solución`, IDEA.ahoraTu.pieza, a.solucion.dibujo);
    add(`resuelve ${s}`, IDEA.resuelve.pieza, r.dibujo, true);
    for (const [k, x] of r.pasos.entries()) add(`resuelve ${s} paso ${k + 1}`, IDEA.resuelve.pieza, x.dibujo);
  }
  for (const m of def.laboratorio.filter(x => (def.laboratorioIdeas[x.id] || []).includes(IDEA.id))) {
    const casos = Teoria.grilla(m.controles);
    for (let i = 0; i < casos.length; i += Math.max(1, Math.floor(casos.length / 400))) add(`mesa ${m.id} ${i}`, m.pieza, m.dibujo(casos[i]));
  }
  return out;
}
const TODOS = dibujos();
// Las partes de color de un texto o ecuación (cualquier objeto con v).
const colores = (x, acc = []) => { if (Array.isArray(x)) x.forEach(y => colores(y, acc)); else if (x && typeof x === 'object') { if (x.v) acc.push(x.v); for (const [k, y] of Object.entries(x)) if (k !== 'v' && typeof y !== 'function') colores(y, acc); } return acc; };

test('el orden de las ideas es el aprobado y los ids no cambian', () => {
  assert.deepEqual(def.ideas.map(i => i.id), ['doble-entrada', 'conclusion-necesaria', 'si-entonces', 'parentesco']);
  assert.ok(def.laboratorio.some(m => m.id === 'pistas-a-eleccion') && def.laboratorio.some(m => m.id === 'marca-tu-cuadro'));
});

test('la idea 1 dibuja solo con rm-objeto, y hay figuras de todos sus momentos', () => {
  assert.ok(TODOS.length > 2000, `${TODOS.length}`);
  for (const d of TODOS) assert.equal(d.pieza, 'rm-objeto', d.donde);
});

test('paleta de deducción en las figuras: ✓ violeta, ✗ y descartes en gris; sin naranja, turquesa, verde ni carmín', () => {
  for (const d of TODOS) {
    const s = P.dibujar(d.datos, d.estado);
    assert.ok(!/var\(--c-[oidh]\)/.test(s), `${d.donde}: un color que no es de la paleta de la idea`);
    for (const [m] of s.matchAll(/<path data-marca="si"[^>]*>/g)) assert.match(m, /var\(--c-f\)/, d.donde);
    for (const [m] of s.matchAll(/<g data-marca="no"[^>]*>/g)) assert.match(m, /opacity="0.55"/, d.donde);
  }
});

test('paleta de deducción en los textos: solo violeta (lo seguro y la respuesta)', () => {
  const textos = [IDEA.lee, IDEA.juega.mision, IDEA.juega.leyenda, IDEA.predice, IDEA.mira.pasos, IDEA.regla, IDEA.ejemplos];
  for (const v of Teoria.grilla(IDEA.juega.controles)) textos.push(IDEA.juega.lectura(v));
  for (let s = 0; s < SEMILLAS; s++) textos.push(IDEA.ahoraTu.generar(s), IDEA.resuelve.generar(s));
  const usados = new Set(colores(textos));
  assert.deepEqual([...usados], ['c-f']);
});

test('ninguna figura de antes de responder delata la respuesta (sin ✓, sin tachados, sin cosas en la mano)', () => {
  for (const d of TODOS.filter(x => x.antes)) {
    const s = P.dibujar(d.datos, d.estado);
    assert.ok(!/data-marca="si"|data-reparto="fuera"|var\(--c-f\)/.test(s), d.donde);
    assert.ok(!(d.datos.manos || []).length, `${d.donde}: una cosa en la mano`);
  }
  // Los ejemplos y los enunciados de los ejercicios van sin ninguna marca: el planteamiento, no la respuesta.
  for (const d of TODOS.filter(x => /^(ejemplo|ahora tú \d+$|resuelve \d+$|predice)/.test(x.donde))) assert.ok(!/data-marca/.test(P.dibujar(d.datos, d.estado)), d.donde);
});

test('ejemplos: 5 por nivel, la respuesta en violeta y la letra de la alternativa en negrita violeta', () => {
  assert.deepEqual([1, 2, 3].map(n => IDEA.ejemplos.filter(e => e.nivel === n).length), [5, 5, 5]);
  for (const e of IDEA.ejemplos) {
    assert.ok(colores(e.respuesta).includes('c-f'), e.titulo);
    const alt = Teoria.plano(e.enunciado).match(/A\) .* E\) /);
    if (alt) assert.match(JSON.stringify(e.respuesta[0]), /^\{"v":"c-f","t":"[A-E]"\}$/, `${e.titulo}: la letra va sola, en violeta`);
    assert.ok(e.datos.length >= 1 && e.datos.length <= 6, e.titulo);
  }
  assert.equal(IDEA.ejemplos.filter(e => /A\) /.test(Teoria.plano(e.enunciado))).length, 5, 'los 5 de nivel 3 traen alternativas, como el examen');
});

test('«Ahora tú» se resuelve aparte: la correcta es la única que vale (400 semillas, con un lector de pistas propio)', () => {
  const tipos = new Set();
  for (let s = 0; s < SEMILLAS; s++) {
    const c = IDEA.ahoraTu.generar(s), L = leer(c), ops = c.opciones;
    assert.equal(ops.filter(o => o.correcta).length, 1, `semilla ${s}`);
    assert.equal(new Set(ops.map(o => Teoria.plano(o.texto))).size, ops.length, `semilla ${s}: opciones repetidas`);
    assert.ok(L.repartos.length >= 1, `semilla ${s}: ningún reparto cumple las pistas`);
    if (/¿Qué es seguro\?|necesariamente verdadera/.test(L.pregunta)) {
      tipos.add('seguro');
      for (const o of ops) {
        if (/^Nada/.test(o.texto)) { assert.ok(!o.correcta, `semilla ${s}`); continue; }
        const n = afirmacion(L, o.texto);
        assert.equal(n === L.repartos.length, !!o.correcta, `semilla ${s}: «${o.texto}» vale en ${n} de ${L.repartos.length}`);
      }
    } else {
      tipos.add('persona');
      const quien = L.nombres.find(x => L.pregunta.includes(` ${x}?`));
      const valores = new Set(L.repartos.map(a => a[quien]));
      assert.equal(valores.size, 1, `semilla ${s}: ${quien} no queda determinado`);
      const ok = ops.find(o => o.correcta);
      assert.equal(ok.texto, [...valores][0], `semilla ${s}`);
    }
    // Los datos traen las pistas y la regla del reparto, nunca la respuesta.
    const correcta = Teoria.plano(ops.find(o => o.correcta).texto);
    if (/ /.test(correcta)) assert.ok(!c.datos.some(x => x.includes(correcta)), `semilla ${s}: los datos dicen «${correcta}»`);
  }
  assert.deepEqual([...tipos].sort(), ['persona', 'seguro']);
});

test('«Ahora tú» llega al nivel del examen: 4 personas, pistas de dos personas y «¿cuál es necesariamente verdadera?»', () => {
  let examen = 0, conDos = 0;
  for (let s = 0; s < SEMILLAS; s++) {
    const c = IDEA.ahoraTu.generar(s), L = leer(c);
    if (L.nombres.length === 4 && /necesariamente verdadera/.test(L.pregunta)) examen++;
    if (c.datos.some(x => / con quien | y con /.test(x))) conDos++;
  }
  assert.ok(examen >= SEMILLAS / 5 && conDos >= SEMILLAS / 3, `examen ${examen}, con dos personas ${conDos}`);
});

test('«Así se resuelve» llega a un solo reparto y no repite la pregunta de «Ahora tú»', () => {
  for (let s = 0; s < 100; s++) {
    const r = IDEA.resuelve.generar(s), L = leer({ pregunta: r.enunciado, datos: r.datos });
    assert.equal(L.repartos.length, 1, `semilla ${s}`);
    const txt = Teoria.plano(r.respuesta);
    for (const [x, c] of Object.entries(L.repartos[0])) assert.ok(txt.includes(`${x} ${c}`), `semilla ${s}: ${txt}`);
    assert.notEqual(Teoria.plano(r.enunciado), Teoria.plano(IDEA.ahoraTu.generar(s).pregunta));
    assert.match(Teoria.plano(r.enunciado), /¿Quién /);
  }
});

test('juego, misión y predicción, contados aparte', () => {
  // Pistas del juego: Ana no vóley, Ana no ajedrez, Ciro no vóley (deportes: 0 fútbol, 1 vóley, 2 ajedrez).
  const todos = permutaciones([0, 1, 2]);
  const J = [a => a[0] !== 1, a => a[0] !== 2, a => a[2] !== 1];
  const quedan = n => todos.filter(a => J.slice(0, n).every(f => f(a)));
  assert.deepEqual([0, 1, 2, 3].map(n => quedan(n).length), [6, 4, 2, 1]);
  const conSeguro = n => [0, 1, 2].some(q => new Set(quedan(n).map(a => a[q])).size === 1);
  const primera = [0, 1, 2, 3].find(conSeguro);
  assert.equal(primera, 2);
  const m = IDEA.juega.mision;
  assert.deepEqual([0, 1, 2, 3].map(n => m.logrado({ n })), [0, 1, 2, 3].map(n => n === primera));
  assert.match(Teoria.plano(IDEA.juega.lectura({ n: 2 })), /Quedan 2 repartos; en ambos, Ana juega fútbol/);
  // Predicción: Ana no ajedrez y Beto no ajedrez → en los 2 repartos que quedan, Ciro juega ajedrez.
  const P2 = todos.filter(a => a[0] !== 2 && a[1] !== 2);
  assert.ok(P2.length === 2 && P2.every(a => a[2] === 2));
  assert.equal(IDEA.predice.opciones.find(o => o.correcta).texto, 'Ciro juega ajedrez');
});

test('la mesa de marcar a mano: tocar cada casilla cambia su control, y los retos los cumple solo el cuadro correcto', () => {
  const m = def.laboratorio.find(x => x.id === 'marca-tu-cuadro'), base = Teoria.inicio(m);
  const s = P.dibujar(m.dibujo(base).datos);
  for (const c of m.controles) assert.ok(s.includes(`data-toque="${c.id}"`), c.id);
  // El cuadro completo y correcto (Ana fútbol, Beto ajedrez, Ciro vóley, contado aparte) cumple el último reto.
  const sol = [0, 2, 1], lleno = Object.fromEntries(m.controles.map(c => [c.id, sol[+c.id[1]] === +c.id[2] ? 'si' : 'no']));
  assert.equal(m.invitaciones[2].logrado(lleno), true);
  assert.equal(m.invitaciones[2].logrado(Object.assign({}, lleno, { m00: 'no', m01: 'si' })), false);
});
