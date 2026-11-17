// Pruebas propias de «Productos notables» (además del validador común de contenido/teoria/teoria.test.js). Por ahora
// cubren la idea 1 (`cuadrado-suma`), la única rehecha contra el contrato (fase 2 del método, 18 nov); cada idea que se
// rehaga se suma a IDEAS_REHECHAS.
//   - un color fijo por magnitud (cabecera de productos-notables.js): cada ficha de color dice su magnitud (m) y lleva el
//     color de def.colores. a naranja, b turquesa, el doble producto violeta; nunca carmín ni verde; las piezas del
//     terreno con el mismo color (a² naranja, franjas violeta, esquina turquesa);
//   - la idea cumple el contrato de calidad 2 aunque la unidad entera todavía no;
//   - nada antes de Predice delata su respuesta: ni el título ni la pregunta del Resumen, ni el glosario ni los ejemplos
//     usan el cuadrado de una resta; las figuras de Predice y de los ejemplos no muestran lo que se pide;
//   - la misión la cumple un solo caso; el gesto directo cae en la esquina y la mueve;
//   - «Ahora tú» trae cuatro opciones distintas en 400 semillas y su respuesta cuadra con un cálculo aparte; «Así se
//     resuelve» también, y no hace la pregunta de «Ahora tú»; la letra de cada alternativa es la del valor correcto.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../../../nucleo/kit/kit.js');
const Teoria = require('../../../nucleo/teoria.js');
const Glosario = require('../../../nucleo/glosario.js');
const E = require('../../../nucleo/ecuacion.js');
const def = require('./productos-notables.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const P = Kit.piezas['alg-objeto'];
const IDEAS_REHECHAS = ['cuadrado-suma'];
const idea = id => def.ideas.find(i => i.id === id);
const SEMILLAS = 400;
const plano = x => E.texto(x === undefined || x === null ? '' : x);
const fichas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(fichas)
  : typeof x.v === 'string' && /^c-/.test(x.v) ? [x] : Object.values(x).flatMap(fichas));
const textosSVG = s => [...s.matchAll(/<text\b[^>]*>(.*?)<\/text>/g)].map(m => m[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim());

function lecturas(i) {
  const out = [], add = (donde, x) => out.push({ donde, x });
  const j = i.juega;
  for (const [k, t] of i.lee.tarjetas.entries()) add(`lee ${k + 1}`, [t.titulo, t.texto, t.ecuacion]);
  add('consigna', j.consigna); add('misión', [j.mision.texto, j.mision.bien]); add('leyenda', j.leyenda.map(x => x.s));
  for (const v of Teoria.grilla(j.controles)) add(`lectura ${JSON.stringify(v)}`, j.lectura(v));
  add('predice', [i.predice.pregunta, i.predice.datos, i.predice.opciones.map(o => o.texto)]);
  for (const [k, p] of i.mira.pasos.entries()) add(`mira ${k + 1}`, [p.texto, p.ecuacion]);
  add('regla', [i.regla.texto, i.regla.ecuacion]);
  for (const [k, e] of i.ejemplos.entries()) add(`ejemplo ${k + 1}`, [e.enunciado, e.alternativas, e.datos, e.solucion, e.respuesta]);
  for (let s = 0; s < 60; s++) {
    const a = i.ahoraTu.generar(s), r = i.resuelve.generar(s);
    add(`ahora tú ${s}`, [a.pregunta, a.datos, a.opciones.map(o => o.texto), a.solucion]);
    add(`resuelve ${s}`, [r.enunciado, r.datos, r.pasos.map(x => [x.texto, x.ecuacion]), r.respuesta]);
  }
  return out;
}

test('la tabla de colores: a naranja, b turquesa, el doble producto violeta; sin carmín ni verde', () => {
  assert.deepEqual(def.colores, { 'primer término': 'o', 'segundo término': 'i', 'doble producto': 'f', 'letra de alternativa': 'f' });
});

test('un color por magnitud: cada ficha de la idea 1 dice su magnitud y lleva su color; a naranja y b turquesa', () => {
  let n = 0;
  for (const id of IDEAS_REHECHAS) for (const { donde, x } of lecturas(idea(id))) for (const f of fichas(x)) {
    n++;
    assert.ok(f.m in def.colores, `${donde}: «${f.t}» sin magnitud (m = ${f.m})`);
    assert.equal(f.v, `c-${def.colores[f.m]}`, `${donde}: «${f.t}» (${f.m}) en ${f.v}`);
    if (f.t === 'a') assert.equal(f.v, 'c-o', donde);
    if (f.t === 'b') assert.equal(f.v, 'c-i', donde);
  }
  assert.ok(n > 1000, `${n} fichas`);
  const c = idea('cuadrado-suma').juega.controles;
  assert.equal(c.find(x => x.id === 'a').color, 'c-o');
  assert.equal(c.find(x => x.id === 'b').color, 'c-i');
});

// Todas las figuras de la idea, con su pieza.
function figuras(i) {
  const out = [], con = (donde, f) => out.push([donde, f]);
  for (const v of Teoria.grilla(i.juega.controles)) con(`juego ${JSON.stringify(v)}`, i.juega.dibujo(v));
  for (const [k, t] of i.lee.tarjetas.entries()) if (t.dibujo) con(`lee ${k + 1}`, t.dibujo);
  con('predice', i.predice.dibujo); con('revelar', i.predice.revelar);
  i.mira.pasos.forEach((p, k) => con(`mira ${k + 1}`, { datos: i.mira.datos, estado: p.estado }));
  i.ejemplos.forEach((e, k) => { if (e.figura) con(`ejemplo ${k + 1}`, e.figura); });
  for (let s = 0; s < 60; s++) { const a = i.ahoraTu.generar(s), r = i.resuelve.generar(s); if (a.dibujo) con(`ahora tú ${s}`, a.dibujo); if (r.dibujo) con(`resuelve ${s}`, r.dibujo); }
  return out;
}
test('las figuras: el terreno, sin carmín ni verde; a² naranja, las franjas violeta y la esquina turquesa', () => {
  const COLOR = { a2: 'var(--c-o)', ab: 'var(--c-f)', b2: 'var(--c-i)', costado: 'var(--c-f)', fondo: 'var(--c-f)' };
  for (const [donde, f] of figuras(idea('cuadrado-suma'))) {
    const s = P.dibujar(f.datos, f.estado || {});
    assert.match(s, /data-objeto="terreno"/, donde);
    assert.ok(!/var\(--c-[hd]\)/.test(s), `${donde}: carmín o verde`);
    for (const m of s.matchAll(/data-pieza="(\w+)"[^>]*stroke="([^"]+)"/g)) if (!f.datos.comprar || m[1] === 'a2') assert.equal(m[2], COLOR[m[1]], `${donde}: pieza ${m[1]}`);
  }
  assert.equal(idea('cuadrado-suma').lee.tarjetas[0].pieza, 'alg-objeto');
});

test('la idea 1 cumple el contrato de calidad 2 (validador común con calidad: 2, sola) y estrena sus palabras', () => {
  const i = idea('cuadrado-suma'), glos = Glosario.porIdea(def)[0];
  assert.deepEqual(glos.map(g => g.termino).sort(), ['binomio', 'distributiva', 'doble producto', 'producto notable']);
  const sub = Object.assign({}, def, { calidad: 2, estado: 'borrador', ideas: [i], glosario: glos, laboratorio: undefined, laboratorioIdeas: undefined });
  const p = Teoria.problemas(sub, { semillas: 60 });
  assert.deepEqual(p, [], p.join('\n'));
});

test('nada antes de Predice delata su respuesta: título, Resumen, Lee, glosario y ejemplos no usan el cuadrado de una resta', () => {
  const i = idea('cuadrado-suma'), resta = /\(\s*\w+\s*−\s*\w+\s*\)\s*(²|al cuadrado)|cede|vereda|25 m/;
  for (const t of [i.titulo, i.pregunta, i.actividad]) assert.ok(!resta.test(t), t);
  for (const t of i.lee.tarjetas) assert.ok(!resta.test(plano([t.titulo, t.texto, t.ecuacion || ''])), t.titulo);
  for (const g of Glosario.porIdea(def)[0]) assert.ok(!resta.test([g.def, g.simple, ...(g.ejemplos || [])].join(' ')), g.termino);
  for (const [k, e] of i.ejemplos.entries()) {
    const t = plano([e.enunciado, e.alternativas || '', e.datos, e.solucion.map(x => [x.texto, x.ecuacion || '']), e.respuesta]);
    assert.ok(!resta.test(t) && !/ − 2/.test(plano(e.datos)), `ejemplo ${k + 1}: ${t}`);
    if (e.figura) assert.notEqual(e.figura.datos.modo, 'cede', `ejemplo ${k + 1}`);
  }
  // La predicción: lo que queda va con «?» en tinta; la figura no rotula su lado (5 m) ni la esquina.
  const pd = P.dibujar(i.predice.dibujo.datos), ts = textosSVG(pd).join(' | ');
  assert.ok(!/25|5 m(?!²)|\b5\b/.test(ts.replace(/2 m|7 m/g, '')), ts);
  assert.ok(ts.includes('?'));
  assert.ok(!/alg-esquina/.test(pd), 'la esquina no se marca antes de responder');
});

test('las figuras de los ejemplos no muestran lo que se pide', () => {
  for (const [k, e] of idea('cuadrado-suma').ejemplos.entries()) {
    if (!e.figura) continue;
    const ts = textosSVG(P.dibujar(e.figura.datos)).join(' | ');
    const pide = plano(e.respuesta).replace(/^[A-E]⁠?, /, '').replace(/^Compra /, '');
    const num = pide.match(/\d+(,\d+)?/)[0];
    assert.ok(!new RegExp(`(^|[^0-9,])${num}([^0-9,]|$)`).test(ts), `ejemplo ${k + 1}: la figura muestra «${num}»: ${ts}`);
  }
});

test('la misión la cumple solo el terreno de 10 m con franjas de 2 m; su «bien» no dice la predicción; el gesto mueve la esquina', () => {
  const j = idea('cuadrado-suma').juega;
  assert.deepEqual(Teoria.grilla(j.controles).filter(v => j.mision.logrado(v)), [{ a: 10, b: 2 }]);
  assert.ok(!/25|cede|resta|quita/.test(j.mision.bien));
  // El juego solo amplía: ninguna lectura tiene una resta.
  for (const v of Teoria.grilla(j.controles)) assert.ok(!/−/.test(plano(j.lectura(v))));
  // La manija de a está en la esquina del terreno de antes, y moverla 11 px en diagonal suma 1 m.
  const [ea, eb] = j.arrastres, v = { a: 8, b: 2 }, pa = ea.donde(v), pb = eb.donde(v);
  assert.ok(Math.abs(ea.mover({ x: pa.x + 11, y: pa.y + 11 }, v).a - 9) < 1e-9);
  assert.ok(Math.abs(eb.mover({ x: pb.x + 11, y: pb.y + 11 }, v).b - 3) < 1e-9);
});

const poli = t => { // «4x² + 28x + 49» → [4, 28, 49]
  const c = [0, 0, 0];
  for (const m of t.replace(/\s/g, '').replace(/−/g, '-').matchAll(/([+-]?)(\d*)(x²|x)?/g)) {
    if (!m[0]) continue;
    const k = (m[1] === '-' ? -1 : 1) * (m[2] ? Number(m[2]) : 1);
    c[m[3] === 'x²' ? 0 : m[3] === 'x' ? 1 : 2] += m[3] || m[2] ? k : 0;
  }
  return c;
};
test('«Ahora tú»: cuatro opciones distintas, una correcta, y la respuesta cuadra con un cálculo aparte (400 semillas)', () => {
  const i = idea('cuadrado-suma'), vistos = new Set();
  for (let s = 0; s < SEMILLAS; s++) {
    const a = i.ahoraTu.generar(s), ops = a.opciones, bien = ops.find(o => o.correcta);
    assert.equal(ops.length, 4, `semilla ${s}`);
    assert.equal(new Set(ops.map(o => plano(o.texto))).size, 4, `semilla ${s}`);
    const q = plano(a.pregunta), r = plano(bien.texto);
    vistos.add(s % 5);
    let m;
    if (s % 5 === 0 || s % 5 === 1) {
      m = q.match(/^Desarrolla \((\d*)x ([+−]) (\d+)\)²\./);
      assert.ok(m, q);
      const p = m[1] ? +m[1] : 1, k = (m[2] === '−' ? -1 : 1) * +m[3];
      assert.deepEqual(poli(r), [p * p, 2 * p * k, k * k], `semilla ${s}: ${q} → ${r}`);
    } else if (s % 5 === 2) {
      m = q.match(/^¿Cuánto vale (\d+)²/); assert.equal(Number(r), Number(m[1]) ** 2, `semilla ${s}`);
    } else if (s % 5 === 3) {
      m = q.match(/a \+ b = (\d+) y ab = (\d+)/); const S = +m[1], Pp = +m[2];
      const raices = [...Array(10).keys()].flatMap(x => [...Array(10).keys()].filter(y => x + y === S && x * y === Pp).map(y => x * x + y * y));
      assert.ok(raices.length && raices.every(v => v === Number(r)), `semilla ${s}`);
    } else {
      m = q.match(/suman (\d+) m² y cada rectángulo mide (\d+) m²/); assert.equal(r, `${Math.sqrt(+m[1] + 2 * +m[2])} m`, `semilla ${s}`);
    }
  }
  assert.equal(vistos.size, 5);
});

test('«Así se resuelve» pide lo que compra Juan; cuadra aparte, y «Ahora tú» nunca pide eso', () => {
  const i = idea('cuadrado-suma');
  for (let s = 0; s < SEMILLAS; s++) {
    const r = i.resuelve.generar(s), m = plano(r.enunciado).match(/mide (\d+) m de lado\. Compra una franja de (\d+) m/);
    assert.ok(m, plano(r.enunciado));
    const [A, B] = [+m[1], +m[2]];
    assert.equal(plano(r.respuesta), `Compra ${(A + B) ** 2 - A * A} m²`);
    assert.ok(!/Compra/.test(plano(i.ahoraTu.generar(s).pregunta)));
  }
});

test('ejemplos: cuentas rehechas aparte y la letra de cada alternativa', () => {
  const ej = idea('cuadrado-suma').ejemplos, v = k => plano(ej[k].respuesta).replace(/⁠/g, '');
  assert.equal((8 + 3) ** 2, 121); assert.match(v(0), /121/);
  assert.match(v(1), /x² \+ 8x \+ 16/); assert.match(v(2), /14x/); assert.equal(31 ** 2, 961); assert.match(v(3), /961/);
  assert.equal((5 + 3) ** 2 - 5 ** 2 - 3 ** 2, 30); assert.match(v(4), /30/);
  assert.match(v(5), /9x² \+ 12x \+ 4/); assert.match(v(6), /25/); assert.equal(9 ** 2 - 40, 41); assert.match(v(7), /41/);
  assert.ok(Math.abs(2.1 ** 2 - 4.41) < 1e-9); assert.equal(15 ** 2 - 12 ** 2, 81); assert.match(v(9), /81/);
  assert.equal(Math.sqrt(34 + 30), 8); assert.equal(Math.sqrt(34 + 15), 7); assert.equal(7 ** 2 - 24, 25);
  assert.ok(Math.abs((Math.sqrt(3) + Math.sqrt(2)) ** 2 - (5 + 2 * Math.sqrt(6))) < 1e-9);
  const x = (5 + Math.sqrt(21)) / 2; assert.ok(Math.abs(x * x + 1 / (x * x) - 23) < 1e-9);
  assert.equal(13 ** 2 - 10 ** 2, 69);
  for (const [k, e] of ej.entries()) {
    if (e.nivel !== 3) continue;
    const [L, ...resto] = v(k).split(', ');
    assert.ok(Array.isArray(e.alternativas), `ejemplo ${k + 1}`);
    assert.equal(plano(e.alternativas['ABCDE'.indexOf(L)]), resto.join(', '), `ejemplo ${k + 1}: ${L}`);
  }
});
