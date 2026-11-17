// Pruebas propias de «Exponentes y radicales» y de su partición (además del validador común de
// contenido/teoria/teoria.test.js). La idea 1 (`leyes-exponentes`) es la única rehecha contra el contrato (fase 2 del
// método, 17 nov); cada idea que se rehaga se suma a IDEAS_REHECHAS.
//   - la partición (17 nov, Gerson): esta unidad conserva el id con `leyes-exponentes` y `radicales`; las ideas, mesas y
//     palabras de productos notables viven en algebra.productos-notables, el catálogo lo dice igual, y Avance.migrar las
//     mueve todas (nada queda en la unidad vieja ni se pierde);
//   - un color fijo por magnitud (docs/molde-unidad.md §5b; cabecera del archivo): cada ficha de color que lee el alumno
//     dice su magnitud (m) y lleva el color de def.colores. Primer exponente naranja, segundo turquesa, resultado violeta;
//     m siempre naranja y n siempre turquesa; nunca carmín ni verde;
//   - la idea cumple el contrato de calidad 2 aunque la unidad entera todavía no (misión, leyenda, aprendizaje,
//     actividad, datos en todo ejercicio, de 2 a 4 palabras con simple y 3 ejemplos por término);
//   - ninguna figura de Predice ni de un ejemplo delata la respuesta, y ningún ejemplo pide el valor de una potencia de
//     exponente negativo (es la predicción);
//   - «Ahora tú» trae cuatro opciones distintas en 400 semillas y su respuesta cuadra con un cálculo aparte; «Así se
//     resuelve» también, y no hace la pregunta de «Ahora tú»; la misión la cumple un solo caso.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Kit = require('../../../nucleo/kit/kit.js');
const Teoria = require('../../../nucleo/teoria.js');
const Glosario = require('../../../nucleo/glosario.js');
const Avance = require('../../../nucleo/avance.js');
const E = require('../../../nucleo/ecuacion.js');
const def = require('./exponentes-y-productos-notables.js');
const prod = require('./productos-notables.js');
for (const r of [...def.requiere, ...prod.requiere]) require(path.join(__dirname, '..', '..', '..', r));
const RAIZ = path.join(__dirname, '..', '..', '..');
const P = Kit.piezas['alg-objeto'];
const IDEAS_REHECHAS = ['leyes-exponentes'];
const idea = id => def.ideas.find(i => i.id === id);
const SEMILLAS = 400;
const plano = x => E.texto(x === undefined || x === null ? '' : x);

// ---------- La partición ----------
test('partición: cada unidad con sus ideas, sus mesas y sus palabras, sin repetir ninguna', () => {
  assert.equal(def.unidad, 'algebra.exponentes-y-productos-notables', 'la unidad vieja conserva el id');
  assert.deepEqual(def.ideas.map(i => i.id), ['leyes-exponentes', 'radicales']);
  assert.deepEqual(prod.ideas.map(i => i.id), ['cuadrado-suma', 'radicales-dobles', 'racionalizar']);
  assert.deepEqual(def.laboratorio.map(m => m.id).sort(), ['exponentes-con-signo', 'raiz-de-la-potencia']);
  assert.deepEqual(prod.laboratorio.map(m => m.id).sort(), ['cubo-se-abre', 'rectangulo-x-p-q']);
  const t1 = new Set(def.glosario.map(g => Glosario.clave(g.termino)));
  for (const g of prod.glosario) assert.ok(!t1.has(Glosario.clave(g.termino)), `«${g.termino}» en las dos unidades`);
});

test('partición: el catálogo pone «Productos notables» después de «Exponentes y radicales» y la pide donde hace falta', () => {
  const c = JSON.parse(fs.readFileSync(path.join(RAIZ, 'catalogo', 'cursos', 'algebra.json'), 'utf8'));
  const u = id => c.unidades.find(x => x.id === id);
  const viejo = u('algebra.exponentes-y-productos-notables'), nuevo = u('algebra.productos-notables');
  assert.equal(viejo.nombre, 'Exponentes y radicales');
  assert.equal(nuevo.nombre, 'Productos notables');
  assert.deepEqual(nuevo.requiere, ['algebra.exponentes-y-productos-notables']);
  const rama = c.ramas.find(r => r.unidades.includes(viejo.id)).unidades;
  assert.equal(rama.indexOf(nuevo.id), rama.indexOf(viejo.id) + 1);
  // Los temas de cada idea son temas de su unidad (y las ideas que faltan escribir todavía no traen tema).
  for (const [d, x] of [[def, viejo], [prod, nuevo]]) for (const i of d.ideas) for (const t of i.temas) assert.ok(x.temas.includes(t), `${i.id}: ${t}`);
  // Piden los productos notables las unidades que los usan; polinomios sigue pidiendo exponentes.
  for (const id of ['algebra.ecuaciones-lineales-y-cuadraticas', 'algebra.factorizacion', 'algebra.binomio-de-newton']) assert.ok(u(id).requiere.includes(nuevo.id), id);
  assert.ok(u('algebra.polinomios').requiere.includes(viejo.id));
  for (const x of c.unidades) if (x.id !== nuevo.id) assert.ok(!(x.requiere.includes(viejo.id) && x.requiere.includes(nuevo.id)), `${x.id}: requisito de más`);
  // La prueba del curso: el cuadrado de un binomio es de productos notables; la raíz de una suma, de radicales.
  const pr = JSON.parse(fs.readFileSync(path.join(RAIZ, 'catalogo', 'pruebas', 'algebra.json'), 'utf8'));
  const par = id => (pr.pares || []).find(x => x.par === id);
  assert.equal(par('cc-01').unidad, nuevo.id);
  assert.equal(par('cc-02').unidad, viejo.id);
});

test('partición: Avance.migrar pasa a la unidad nueva todo lo de sus ideas, mesas y palabras, y nada de lo que se queda', () => {
  const V = def.unidad, N = prod.unidad;
  const ideas = Object.fromEntries([...def.ideas, ...prod.ideas].map((i, k) => [i.id, { casos: k + 1 }]));
  const est = { avanceV: 1, partidoV: 1, teoria: { [V]: { ideas: JSON.parse(JSON.stringify(ideas)) } },
    coleccion: [...def.laboratorio, ...prod.laboratorio].map((m, k) => ({ id: `c${k}`, unidad: V, mesa: m.id })),
    glosario: { [V]: Object.fromEntries([...def.glosario, ...prod.glosario].map(g => [Glosario.clave(g.termino), 'sabe'])) } };
  assert.equal(Avance.migrar(est), true);
  assert.deepEqual(Object.keys(est.teoria[V].ideas).sort(), def.ideas.map(i => i.id).sort());
  assert.deepEqual(Object.keys(est.teoria[N].ideas).sort(), prod.ideas.map(i => i.id).sort());
  for (const c of est.coleccion) assert.equal(c.unidad, prod.laboratorio.some(m => m.id === c.mesa) ? N : V, c.mesa);
  assert.deepEqual(Object.keys(est.glosario[V]).sort(), def.glosario.map(g => Glosario.clave(g.termino)).sort());
  assert.deepEqual(Object.keys(est.glosario[N]).sort(), prod.glosario.map(g => Glosario.clave(g.termino)).sort());
});

// ---------- La idea 1 ----------
const fichas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(fichas)
  : typeof x.v === 'string' && /^c-/.test(x.v) ? [x] : Object.values(x).flatMap(fichas));
// Todo lo que el alumno lee en una idea: { donde, x }.
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

test('la tabla de colores de la unidad: primer exponente naranja, segundo turquesa, resultado violeta', () => {
  assert.deepEqual(def.colores, { 'primer exponente': 'o', 'segundo exponente': 'i', resultado: 'f' });
  assert.ok(!Object.values(def.colores).some(c => c === 'h' || c === 'd'), 'sin carmín ni verde');
});

test('un color por magnitud: cada ficha de las ideas rehechas dice su magnitud y lleva su color; m naranja y n turquesa', () => {
  let n = 0;
  for (const id of IDEAS_REHECHAS) for (const { donde, x } of lecturas(idea(id))) for (const f of fichas(x)) {
    n++;
    assert.ok(f.m in def.colores, `${id} ${donde}: «${f.t}» sin magnitud (m = ${f.m})`);
    assert.equal(f.v, `c-${def.colores[f.m]}`, `${id} ${donde}: «${f.t}» (${f.m}) en ${f.v}`);
    if (f.t === 'm') assert.equal(f.v, 'c-o', `${donde}: m`);
    if (f.t === 'n') assert.equal(f.v, 'c-i', `${donde}: n`);
    assert.ok(!/^[xy]$/.test(f.t), `${donde}: x e y van en tinta`);
  }
  assert.ok(n > 1000, `${n} fichas`);
  const c = idea('leyes-exponentes').juega.controles;
  assert.equal(c.find(x => x.id === 'm').color, 'c-o');
  assert.equal(c.find(x => x.id === 'n').color, 'c-i');
  assert.equal(c.find(x => x.id === 'a').color, undefined, 'la base va en tinta');
});

// Todas las figuras de la idea 1 (juego en toda su grilla, Lee, Predice, Mira, ejemplos).
function figuras(i) {
  const out = [];
  for (const v of Teoria.grilla(i.juega.controles)) out.push([`juego ${JSON.stringify(v)}`, i.juega.dibujo(v)]);
  for (const [k, t] of i.lee.tarjetas.entries()) if (t.dibujo) out.push([`lee ${k + 1}`, t.dibujo]);
  out.push(['predice', i.predice.dibujo], ['revelar', i.predice.revelar]);
  i.mira.pasos.forEach((p, k) => out.push([`mira ${k + 1}`, { datos: i.mira.datos, estado: p.estado }]));
  i.ejemplos.forEach((e, k) => { if (e.figura) out.push([`ejemplo ${k + 1}`, e.figura]); });
  return out;
}
test('las figuras de la idea 1 son la hoja, sin carmín ni verde, y con los colores de su magnitud', () => {
  for (const [donde, f] of figuras(idea('leyes-exponentes'))) {
    const s = P.dibujar(f.datos, f.estado || {});
    assert.ok(!/var\(--c-[hd]\)/.test(s), `${donde}: carmín o verde`);
    assert.match(s, /data-objeto="hoja"/, donde);
    // Los dobleces que ya tiene, en naranja; los que se hacen después, en turquesa.
    const g = P.geometria(f.datos, f.estado || {});
    for (const [k, mk] of g.marcas.entries()) assert.equal(mk.color, k < g.D.m ? 'o' : 'i', `${donde}: doblez ${k + 1}`);
  }
});

test('la idea 1 cumple el contrato de calidad 2 (validador común con calidad: 2, sola)', () => {
  const i = idea('leyes-exponentes'), glos = Glosario.porIdea(def)[0];
  assert.deepEqual(glos.map(g => g.termino).sort(), ['base', 'exponente', 'potencia']);
  const sub = Object.assign({}, def, { calidad: 2, estado: 'borrador', ideas: [i], glosario: glos, laboratorio: undefined, laboratorioIdeas: undefined });
  const p = Teoria.problemas(sub, { semillas: 60 });
  assert.deepEqual(p, [], p.join('\n'));
});

const textosSVG = s => [...s.matchAll(/<text\b[^>]*>(.*?)<\/text>/g)].map(m => m[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim());
test('ninguna figura de Predice ni de un ejemplo delata la respuesta', () => {
  const i = idea('leyes-exponentes');
  const pd = P.dibujar(i.predice.dibujo.datos);
  assert.ok(!/1\/8/.test(textosSVG(pd).join(' ')), 'la predicción no muestra 1/8');
  assert.ok(textosSVG(pd).includes('?'), 'la cara de arriba va con «?»');
  assert.match(pd, /<tspan fill="currentColor"[^>]*>\?<\/tspan>/, 'el «?» va en tinta');
  assert.ok(!/class="alg-pliegues"/.test(pd), 'sin los pliegues que dan las 8 partes');
  for (const [k, e] of i.ejemplos.entries()) {
    if (!e.figura) continue;
    const s = P.dibujar(e.figura.datos), ts = textosSVG(s).join(' | ');
    // Lo que se pide (los números violeta de la respuesta) no aparece en la figura, ni se pueden contar las capas.
    for (const f of fichas(e.respuesta).filter(x => x.v === 'c-f')) assert.ok(!new RegExp(`(^|[^0-9])${f.t}([^0-9]|$)`).test(ts), `ejemplo ${k + 1}: la figura muestra «${f.t}»`);
    if (/capas/.test(plano(e.enunciado))) assert.ok(!/class="alg-capas"/.test(s), `ejemplo ${k + 1}: las capas se cuentan en la figura`);
  }
});

test('los ejemplos no piden el valor de una potencia de exponente negativo (es la predicción)', () => {
  for (const [k, e] of idea('leyes-exponentes').ejemplos.entries()) {
    const r = plano(e.respuesta);
    assert.ok(!/elevado a −|\/|⁻/.test(r), `ejemplo ${k + 1}: ${r}`);
    assert.ok(!/2 elevado a −3|2⁻³/.test(plano([e.enunciado, e.solucion.map(x => [x.texto, x.ecuacion || ''])])), `ejemplo ${k + 1}: usa 2⁻³`);
  }
});

test('la misión no está cumplida al abrir, la cumple solo la hoja por la mitad con 3 + 2 dobleces, y su «bien» no dice la predicción', () => {
  const j = idea('leyes-exponentes').juega, buenos = Teoria.grilla(j.controles).filter(v => j.mision.logrado(v));
  assert.deepEqual(buenos, [{ a: 2, m: 3, n: 2 }]);
  assert.ok(!/1\/8|negativ|−/.test(j.mision.bien));
  // El juego no tiene exponentes negativos ni fracciones.
  for (const v of Teoria.grilla(j.controles)) assert.ok(!/−|\//.test(plano(j.lectura(v))), JSON.stringify(v));
});

// ---------- Cálculo aparte (sin el código de la unidad) ----------
// Lee una potencia «B elevado a e» (o «al cuadrado», «al cubo») del texto plano.
const exp = t => (t === 'al cuadrado' ? 2 : t === 'al cubo' ? 3 : Number(t.replace(/^elevado a /, '').replace('−', '-')));
const POT = '(\\d+) (al cuadrado|al cubo|elevado a −?\\d+)';
const mcd = (u, w) => (w ? mcd(w, u % w) : Math.abs(u));
test('«Ahora tú»: cuatro opciones distintas, una correcta, y la respuesta cuadra con un cálculo aparte (400 semillas)', () => {
  const i = idea('leyes-exponentes'), vistos = new Set();
  for (let s = 0; s < SEMILLAS; s++) {
    const a = i.ahoraTu.generar(s), ops = a.opciones, bien = ops.find(o => o.correcta);
    assert.equal(ops.length, 4, `semilla ${s}`);
    assert.equal(new Set(ops.map(o => plano(o.texto))).size, 4, `semilla ${s}: opciones repetidas`);
    assert.equal(ops.filter(o => o.correcta).length, 1);
    const q = plano(a.pregunta), r = plano(bien.texto);
    vistos.add(s % 5);
    let m;
    const ok = x => assert.ok(x, `semilla ${s}: ${q}`);
    if (s % 5 === 0) {   // B^p · B^q ÷ B^t
      m = q.match(new RegExp(`^Escribe ${POT} · ${POT} ÷ ${POT} como`)); ok(m);
      assert.equal(r, plano([{ sup: [m[1], String(exp(m[2]) + exp(m[4]) - exp(m[6])).replace('-', '−')] }]), `semilla ${s}`);
    } else if (s % 5 === 1) {   // (B^p)^q · B^w
      m = q.match(new RegExp(`^Escribe \\(${POT}\\) (al cuadrado|al cubo|elevado a \\d+) · ${POT} como`)); ok(m);
      assert.equal(r, plano([{ sup: [m[1], String(exp(m[2]) * exp(m[3]) + exp(m[5])).replace('-', '−')] }]), `semilla ${s}`);
    } else if (s % 5 === 2) {   // B^p · B^q, con p + q < 0: 1/B^k
      m = q.match(new RegExp(`^¿Cuánto vale ${POT} · ${POT}\\?`)); ok(m);
      const e = exp(m[2]) + exp(m[4]);
      assert.ok(e < 0);
      assert.equal(r, `1 / ${Number(m[1]) ** -e}`, `semilla ${s}`);
    } else if (s % 5 === 3 && /^Si /.test(q)) {   // B^x = K → B^(x+j)
      m = q.match(/^Si (\d+) elevado a x = (\d+), ¿cuánto vale \d+ elevado a x \+ (\d+)\?/); ok(m);
      assert.equal(Number(r), Number(m[2]) * Number(m[1]) ** Number(m[3]), `semilla ${s}`);
    } else if (s % 5 === 3) {   // (B^(x+p) − B^(x+q)) / B^x
      m = q.match(/^Simplifica \((\d+) elevado a x \+ (\d+) − \d+ elevado a x \+ (\d+)\)/); ok(m);
      assert.equal(Number(r), Number(m[1]) ** Number(m[2]) - Number(m[1]) ** Number(m[3]), `semilla ${s}`);
    } else {   // A^x · c = p^N: se busca x probando
      m = q.match(new RegExp(`^Halla x si (\\d+) elevado a x · (\\d+) = ${POT}\\.`)); ok(m);
      const [A, c, p, N] = [Number(m[1]), Number(m[2]), Number(m[3]), exp(m[4])];
      const x = [0, 1, 2, 3, 4, 5, 6].find(t => Math.abs(A ** t * c - p ** N) < 1e-9);
      assert.equal(r, `x = ${x}`, `semilla ${s}`);
      for (const o of ops.filter(y => !y.correcta)) assert.match(plano(o.texto), /^x = −?\d+(\/\d+)?$/, 'enteros o fracciones, sin decimales cortados');
    }
  }
  assert.equal(vistos.size, 5);
});

test('«Así se resuelve» calcula el valor de una expresión; cuadra aparte, y «Ahora tú» nunca pide eso', () => {
  const i = idea('leyes-exponentes');
  for (let s = 0; s < SEMILLAS; s++) {
    const r = i.resuelve.generar(s), q = plano(r.enunciado);
    const m = q.match(new RegExp(`^Calcula el valor de \\(${POT}\\) (al cuadrado|al cubo) · ${POT} ÷ ${POT}\\.$`));
    assert.ok(m, `resuelve ${s}: ${q}`);
    const B = Number(m[1]), e = exp(m[2]) * exp(m[3]) + exp(m[5]) - exp(m[7]);
    const val = e >= 0 ? String(B ** e) : `1/${B ** -e}`;
    assert.equal(plano(r.respuesta), `La expresión vale ${val}`, `resuelve ${s}`);
    assert.ok(!/^Calcula el valor/.test(plano(i.ahoraTu.generar(s).pregunta)), `ahora tú ${s}`);
  }
});

test('ejemplos: las cuentas de las respuestas, rehechas aparte', () => {
  const ej = idea('leyes-exponentes').ejemplos, resp = k => plano(ej[k].respuesta).replace(/\u2060/g, '');
  assert.equal(2 ** 4, 16); assert.match(resp(0), /16 capas/);
  assert.match(resp(1), /125/); assert.equal(5 ** 3, 125);
  assert.match(resp(2), /3 elevado a 6/); assert.match(resp(3), /7 elevado a 4/); assert.match(resp(4), /2 elevado a 12/);
  assert.equal(2 ** 5 / 2 ** 2, 8); assert.match(resp(5), /^8 capas/);
  assert.equal((5 ** 2) ** 3 * 5 ** 4 / 5 ** 8, 25); assert.match(resp(6), /25/);
  assert.match(resp(7), /Vale 1/);
  assert.equal(3 ** 5 * 3 ** -2, 27); assert.match(resp(8), /27/);
  assert.equal(4 ** 3 * 2 ** 5, 2 ** 11); assert.match(resp(9), /2 elevado a 11/);
  assert.equal(5 * 2 ** 3, 40); assert.match(resp(10), /^C, 40/);
  assert.equal((2 ** 7 - 2 ** 5) / 2 ** 4, 6); assert.match(resp(11), /^B, 6/);
  assert.equal(4 ** 4 * 8, 2 ** 11); assert.match(resp(12), /^B, x = 4/);
  assert.equal(-(2 ** 4) + (-2) ** 4 + (-2) ** 3, -8); assert.match(resp(13), /^B, −8/);
  assert.ok(9 ** 3 === 27 ** 2 && 3 + 2 === 5); assert.match(resp(14), /^B, x = 3/);
  // Las alternativas: la letra de la respuesta es la del valor correcto.
  for (const k of [10, 11, 12, 13, 14]) {
    const en = plano(ej[k].enunciado), [L, v] = resp(k).split(', ');
    assert.ok(en.includes(`${L}) ${v.replace('x = ', '')} `) || en.endsWith(`${L}) ${v.replace('x = ', '')}`), `ejemplo ${k + 1}: ${L} no es ${v}`);
  }
});
