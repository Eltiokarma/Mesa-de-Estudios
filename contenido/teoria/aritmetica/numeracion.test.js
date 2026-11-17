// Pruebas propias de «Sistemas de numeración» (además del validador común de contenido/teoria/teoria.test.js). Por ahora
// cubren la idea 1 (`agrupar`), la única rehecha contra el contrato (fase 2 del método, 17 nov); cada idea que se rehaga
// se suma a IDEAS_REHECHAS.
//   - un color fijo por magnitud (docs/molde-unidad.md §5b; cabecera de numeracion.js): cada ficha de color que lee el
//     alumno dice su magnitud (m) y lleva el color de la tabla def.colores; si una magnitud cambia de color, falla. La
//     cantidad en base 10 violeta, la base turquesa, las cifras naranja, la segunda base verde; nunca carmín;
//   - la idea cumple el contrato de calidad 2 aunque la unidad entera todavía no (misión, leyenda, aprendizaje,
//     actividad, datos en todo ejercicio, de 2 a 4 palabras con simple y 3 ejemplos por término);
//   - ninguna figura de Predice ni de un ejemplo delata la respuesta (lo que se pide va con «?» en tinta);
//   - la notación 23₍₅₎ no se usa antes de explicarse (tarjeta 2 de «Lee») y nunca la vieja (132)₄;
//   - los ejemplos no usan la situación de la predicción (le llega un caramelo);
//   - «Ahora tú» trae cuatro opciones distintas en 400 semillas y su respuesta cuadra con un cálculo aparte;
//   - «Así se resuelve» no hace la pregunta de «Ahora tú»; las escalas del dibujo no saltan entre pasos.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../../../nucleo/kit/kit.js');
const Teoria = require('../../../nucleo/teoria.js');
const Glosario = require('../../../nucleo/glosario.js');
const E = require('../../../nucleo/ecuacion.js');
const def = require('./numeracion.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const P = Kit.piezas['arit-puesto'];
const IDEAS_REHECHAS = ['agrupar'];
const idea = id => def.ideas.find(i => i.id === id);
const SEMILLAS = 400;

const fichas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(fichas)
  : typeof x.v === 'string' && /^c-/.test(x.v) ? [x] : Object.values(x).flatMap(fichas));
// Texto plano de partes (numerales como 23(5)).
const limpio = x => (Array.isArray(x) ? x.filter(y => y !== undefined && y !== null).map(limpio) : x);
const plano = x => E.texto(x === undefined || x === null ? '' : limpio(x));

// Todo lo que el alumno lee en una idea: { donde, partes }.
function lecturas(i) {
  const out = [], add = (donde, x) => out.push({ donde, x });
  const j = i.juega;
  for (const [k, t] of (i.lee.tarjetas || []).entries()) add(`lee ${k + 1}`, [t.titulo, t.texto, t.ecuacion]);
  add('consigna', j.consigna); add('misión', [j.mision.texto, j.mision.bien]); add('leyenda', j.leyenda.map(x => x.s));
  for (const v of Teoria.grilla(j.controles)) add(`lectura ${JSON.stringify(v)}`, j.lectura(v));
  add('predice', [i.predice.pregunta, i.predice.datos, i.predice.opciones.map(o => o.texto)]);
  for (const [k, p] of i.mira.pasos.entries()) add(`mira ${k + 1}`, [p.texto, p.ecuacion]);
  add('regla', [i.regla.texto, i.regla.ecuacion]);
  for (const [k, e] of i.ejemplos.entries()) add(`ejemplo ${k + 1}`, [e.enunciado, e.datos, e.solucion, e.respuesta]);
  for (let s = 0; s < 60; s++) {
    const a = i.ahoraTu.generar(s), r = i.resuelve.generar(s);
    add(`ahora tú ${s}`, [a.pregunta, a.datos, a.opciones.map(o => o.texto), a.solucion]);
    add(`resuelve ${s}`, [r.enunciado, r.datos, r.pasos.map(x => [x.texto, x.ecuacion]), r.respuesta]);
  }
  return out;
}

test('la tabla de colores de la unidad: cantidad violeta, base turquesa, cifras naranja, segunda base verde', () => {
  assert.deepEqual(def.colores, { cantidad: 'f', base: 'i', cifras: 'o', 'segunda base': 'd' });
  assert.ok(!Object.values(def.colores).includes('h'), 'sin carmín');
});

test('un color por magnitud: cada ficha de las ideas rehechas dice su magnitud y lleva su color', () => {
  let n = 0;
  for (const id of IDEAS_REHECHAS) for (const { donde, x } of lecturas(idea(id))) for (const f of fichas(x)) {
    n++;
    assert.ok(f.m in def.colores, `${id} ${donde}: «${f.t}» sin magnitud (m = ${f.m})`);
    assert.equal(f.v, `c-${def.colores[f.m]}`, `${id} ${donde}: «${f.t}» (${f.m}) en ${f.v}`);
  }
  assert.ok(n > 1000, `${n} fichas`);
  // Los controles: los caramelos (la cantidad) violeta y la base turquesa.
  const c = idea('agrupar').juega.controles;
  assert.equal(c.find(x => x.id === 'n').color, 'c-f');
  assert.equal(c.find(x => x.id === 'b').color, 'c-i');
});

test('las figuras de las ideas rehechas no usan el carmín y pintan la base en turquesa', () => {
  const i = idea('agrupar'), figs = [i.predice.dibujo, i.predice.revelar, ...i.ejemplos.filter(e => e.figura).map(e => e.figura)];
  for (const v of Teoria.grilla(i.juega.controles)) figs.push(i.juega.dibujo(v));
  for (const f of figs) {
    const s = Kit.piezas[f.pieza || i.pieza].dibujar(f.datos, f.estado || {});
    assert.ok(!/var\(--c-h\)/.test(s), 'carmín en una figura');
    if (/class="ar-bolsita"/.test(s)) assert.match(s, /class="ar-bolsita"><path[^>]*stroke="var\(--c-i\)"/);
  }
});

test('la idea 1 cumple el contrato de calidad 2 (validador común con calidad: 2, sola)', () => {
  const i = idea('agrupar'), glos = Glosario.porIdea(def)[0];
  assert.deepEqual(glos.map(g => g.termino).sort(), ['base de numeración', 'cifra', 'numeral', 'orden']);
  const sub = Object.assign({}, def, { calidad: 2, estado: 'borrador', ideas: [i], glosario: glos, laboratorio: undefined, laboratorioIdeas: undefined });
  const p = Teoria.problemas(sub, { semillas: 60 });
  assert.deepEqual(p, [], p.join('\n'));
});

// Los textos de un SVG (cada <text> con sus <tspan> juntos).
const textosSVG = s => [...s.matchAll(/<text\b[^>]*>(.*?)<\/text>/g)].map(m => m[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim());
// Lo que se pide, en una respuesta: los numerales (23(5)) y las cantidades en violeta.
function pedidos(resp) {
  const out = [];
  const ir = x => {
    if (!x || typeof x !== 'object') return;
    if (Array.isArray(x)) { x.forEach(ir); return; }
    if (x.sub) { out.push(plano([x])); return; }
    if (x.v === 'c-f') out.push(String(x.t));
    Object.values(x).forEach(ir);
  };
  ir(resp);
  return out;
}

test('ninguna figura de Predice ni de un ejemplo delata la respuesta: lo pedido va con «?», en tinta', () => {
  const i = idea('agrupar');
  const pd = P.dibujar(i.predice.dibujo.datos);
  assert.ok(!textosSVG(pd).some(t => /100/.test(t)), 'la predicción no muestra 100₍₅₎');
  assert.ok(textosSVG(pd).includes('?(5)'), 'la etiqueta de la predicción va con «?»');
  assert.match(pd, /<tspan fill="currentColor">\?<\/tspan>/);
  for (const [k, e] of i.ejemplos.entries()) {
    if (!e.figura) continue;
    const ts = textosSVG(P.dibujar(e.figura.datos));
    for (const q of pedidos(e.respuesta)) assert.ok(!ts.some(t => t === q || new RegExp(`(^|\\s)${q.replace(/[()]/g, '\\$&')}(\\s|$)`).test(t)), `ejemplo ${k + 1}: la figura muestra «${q}»`);
  }
  // Y «Ahora tú»: si trae figura, la etiqueta va con «?».
  for (let s = 0; s < SEMILLAS; s++) {
    const a = i.ahoraTu.generar(s);
    if (a.dibujo) assert.equal(a.dibujo.datos.etiqueta.cifras, '?', `ahora tú ${s}`);
  }
});

test('notación: 23₍₅₎ recién desde la tarjeta 2 de «Lee», y nunca la vieja (132)₄', () => {
  const i = idea('agrupar'), t1 = i.lee.tarjetas[0];
  const txt1 = plano(t1.texto) + JSON.stringify(t1.dibujo.datos);
  assert.ok(!/₍|\(\d\)|etiqueta/.test(txt1), 'la tarjeta 1 no usa la escritura con base');
  assert.ok(/23₍₅₎/.test(plano(i.lee.tarjetas[1].texto)), 'la tarjeta 2 la presenta');
  const todo = lecturas(i).map(l => plano(l.x)).join('\n') + JSON.stringify(i.ejemplos);
  assert.ok(!/\(\d+\)[₀-₉]/.test(todo), 'la escritura vieja (132)₄');
});

test('los ejemplos no usan la situación de la predicción (un caramelo que llega)', () => {
  for (const [k, e] of idea('agrupar').ejemplos.entries()) {
    assert.ok(!/llega|agregan|un caramelo más/i.test(plano(e.enunciado)), `ejemplo ${k + 1}`);
    if (e.figura) assert.ok(!e.figura.datos.llega, `ejemplo ${k + 1}: figura con caramelos que llegan`);
  }
});

test('la misión no está cumplida al abrir, la cumple solo 24 caramelos en bolsitas de 6, y su «bien» no dice la predicción', () => {
  const j = idea('agrupar').juega, buenos = Teoria.grilla(j.controles).filter(v => j.mision.logrado(v));
  assert.deepEqual(buenos, [{ n: 24, b: 6 }]);
  assert.ok(!/100|caja/.test(j.mision.bien));
});

// Cálculo aparte (sin el código de la unidad): un número en base n y de vuelta.
const aBase = (N, n) => { let s = ''; do { s = (N % n) + s; N = Math.floor(N / n); } while (N > 0); return s; };
const deBase = (t, n) => [...t].reduce((a, c) => a * n + Number(c), 0);
test('«Ahora tú»: cuatro opciones distintas, una correcta, y la respuesta cuadra con un cálculo aparte (400 semillas)', () => {
  const i = idea('agrupar');
  const vistos = new Set();
  for (let s = 0; s < SEMILLAS; s++) {
    const a = i.ahoraTu.generar(s), ops = a.opciones, bien = ops.find(o => o.correcta);
    assert.equal(ops.length, 4, `semilla ${s}`);
    assert.equal(new Set(ops.map(o => plano(o.texto))).size, 4, `semilla ${s}: opciones repetidas`);
    assert.equal(ops.filter(o => o.correcta).length, 1);
    const q = plano(a.pregunta), r = plano(bien.texto);
    vistos.add(s % 5);
    if (s % 5 === 0) {   // mal escrito: la correcta tiene una cifra ≥ su base; las demás no
      const val = t => { const m = t.match(/^(\d+)\((\d+)\)$/); return m ? [...m[1]].every(c => +c < +m[2]) && m[1][0] !== '0' : /^\d+$/.test(t); };
      assert.ok(!val(r), `semilla ${s}: ${r} está bien escrito`);
      for (const o of ops.filter(x => !x.correcta)) assert.ok(val(plano(o.texto)), `semilla ${s}: ${plano(o.texto)} está mal escrito`);
    } else if (s % 5 === 1) {   // menor base: la cifra mayor + 1
      const cif = q.match(/numeral (\d+)/)[1];
      assert.equal(r, `base ${Math.max(...[...cif].map(Number)) + 1}`, `semilla ${s}`);
    } else if (s % 5 === 2) {   // el que sigue: +1
      const m = q.match(/(\d+)\((\d)\)/), n = +m[2];
      assert.equal(r, `${aBase(deBase(m[1], n) + 1, n)}(${n})`, `semilla ${s}`);
    } else if (s % 5 === 3) {   // llegan k caramelos
      const m = q.match(/(\d+)\((\d)\)\. Le agregan (\d+)/), n = +m[2];
      assert.equal(r, `${aBase(deBase(m[1], n) + +m[3], n)}(${n})`, `semilla ${s}`);
    } else if (/misma base/.test(q)) {   // menor base común
      const cifras = [...q.matchAll(/\b(\d{3,})\b/g)].flatMap(x => [...x[1]].map(Number));
      assert.equal(r, `base ${Math.max(...cifras) + 1}`, `semilla ${s}`);
    } else {   // cuántas bases menores que 10
      const cif = q.match(/numeral (\d+)/)[1], m = Math.max(...[...cif].map(Number));
      assert.equal(r, `${9 - m} ${9 - m === 1 ? 'base' : 'bases'}`, `semilla ${s}`);
    }
  }
  assert.equal(vistos.size, 5);
});

test('«Así se resuelve» empaca un montón; «Ahora tú» nunca pide eso, y la etiqueta cuadra con un cálculo aparte', () => {
  const i = idea('agrupar');
  for (let s = 0; s < SEMILLAS; s++) {
    const r = i.resuelve.generar(s), q = plano(r.enunciado), m = q.match(/tiene (\d+) caramelos sueltos.*bolsitas de (\d)/);
    assert.ok(m, `resuelve ${s}`);
    assert.equal(plano(r.respuesta), `La etiqueta es ${aBase(+m[1], +m[2])}(${m[2]})`);
    assert.ok(!/caramelos sueltos\. Los empaca/.test(plano(i.ahoraTu.generar(s).pregunta)), `ahora tú ${s}`);
  }
});

test('el dibujo no cambia de escala dentro del juego ni entre los pasos de «Mira»', () => {
  const i = idea('agrupar');
  const esc = new Set(Teoria.grilla(i.juega.controles).map(v => P.geometria(i.juega.dibujo(v).datos).s));
  assert.equal(esc.size, 1);
  const em = new Set(i.mira.pasos.map(p => P.geometria(i.mira.datos, p.estado).s).concat([P.geometria(i.predice.dibujo.datos).s, P.geometria(i.predice.revelar.datos).s]));
  assert.equal(em.size, 1, [...em].join(', '));
});
