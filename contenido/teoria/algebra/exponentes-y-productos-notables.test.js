// Pruebas propias de «Exponentes y radicales» y de su partición (además del validador común de
// contenido/teoria/teoria.test.js). Las tres ideas están rehechas contra el contrato: `leyes-exponentes` (17 nov, visto
// bueno de Gerson), `radicales` y `exponente-fraccionario` (18 nov); la unidad declara calidad: 2.
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
const IDEAS_REHECHAS = ['leyes-exponentes', 'radicales', 'exponente-fraccionario'];
const idea = id => def.ideas.find(i => i.id === id);
const SEMILLAS = 400;
const plano = x => E.texto(x === undefined || x === null ? '' : x);

// ---------- La partición ----------
test('partición: cada unidad con sus ideas, sus mesas y sus palabras, sin repetir ninguna', () => {
  assert.equal(def.unidad, 'algebra.exponentes-y-productos-notables', 'la unidad vieja conserva el id');
  assert.deepEqual(def.ideas.map(i => i.id), ['leyes-exponentes', 'radicales', 'exponente-fraccionario']);
  // Las tres ideas que vinieron de la unidad vieja, más las dos nuevas de la propuesta (fase 3, 18 nov), en su orden.
  assert.deepEqual(prod.ideas.map(i => i.id), ['cuadrado-suma', 'suma-por-diferencia', 'cubo-binomio', 'radicales-dobles', 'racionalizar']);
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

// Palabras e ideas que Productos notables estrenó después de la partición (18 nov): no estaban en la unidad vieja, así
// que nadie puede tener marcas viejas de ellas. («binomio» volvió a Binomio de Newton: ya no es de ninguna de las dos.)
const NUEVAS = ['doble producto', 'suma de cubos', 'radical simple'];
const IDEAS_NUEVAS = ['suma-por-diferencia', 'cubo-binomio'];
test('partición: Avance.migrar pasa a la unidad nueva todo lo de sus ideas, mesas y palabras, y nada de lo que se queda', () => {
  const V = def.unidad, N = prod.unidad;
  const viejas = prod.ideas.filter(i => !IDEAS_NUEVAS.includes(i.id));
  const ideas = Object.fromEntries([...def.ideas, ...viejas].map((i, k) => [i.id, { casos: k + 1 }]));
  const est = { avanceV: 1, partidoV: 1, teoria: { [V]: { ideas: JSON.parse(JSON.stringify(ideas)) } },
    coleccion: [...def.laboratorio, ...prod.laboratorio].map((m, k) => ({ id: `c${k}`, unidad: V, mesa: m.id })),
    // Las palabras que la unidad vieja ya tenía (las nuevas de Productos notables no pueden tener marcas viejas).
    glosario: { [V]: Object.fromEntries([...def.glosario, ...prod.glosario.filter(g => !NUEVAS.includes(g.termino))].map(g => [Glosario.clave(g.termino), 'sabe'])) } };
  assert.equal(Avance.migrar(est), true);
  assert.deepEqual(Object.keys(est.teoria[V].ideas).sort(), def.ideas.map(i => i.id).sort());
  assert.deepEqual(Object.keys(est.teoria[N].ideas).sort(), viejas.map(i => i.id).sort());
  for (const c of est.coleccion) assert.equal(c.unidad, prod.laboratorio.some(m => m.id === c.mesa) ? N : V, c.mesa);
  assert.deepEqual(Object.keys(est.glosario[V]).sort(), def.glosario.map(g => Glosario.clave(g.termino)).sort());
  assert.deepEqual(Object.keys(est.glosario[N]).sort(), prod.glosario.filter(g => !NUEVAS.includes(g.termino)).map(g => Glosario.clave(g.termino)).sort());
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

test('la tabla de colores de la unidad: primer dato naranja, segundo turquesa, resultado violeta', () => {
  // El índice y el exponente de adentro, magnitudes propias desde la ronda 2 del lector (18 nov).
  assert.deepEqual(def.colores, { 'primer exponente': 'o', 'segundo exponente': 'i', resultado: 'f', 'primer radicando': 'o', 'segundo radicando': 'i', 'exponente de adentro': 'o', 'índice': 'i' });
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

// Todas las figuras de una idea (juego en toda su grilla, Lee, Predice, Mira, ejemplos y «Ahora tú»), con su pieza.
function figuras(i) {
  const out = [], con = (donde, f, pieza) => out.push([donde, f, f.pieza || pieza || i.pieza]);
  for (const v of Teoria.grilla(i.juega.controles)) con(`juego ${JSON.stringify(v)}`, i.juega.dibujo(v), i.juega.pieza);
  for (const [k, t] of i.lee.tarjetas.entries()) if (t.dibujo) con(`lee ${k + 1}`, t.dibujo, t.pieza);
  con('predice', i.predice.dibujo, i.predice.pieza); con('revelar', i.predice.revelar, i.predice.pieza);
  i.mira.pasos.forEach((p, k) => con(`mira ${k + 1}`, { datos: i.mira.datos, estado: p.estado }, i.mira.pieza));
  i.ejemplos.forEach((e, k) => { if (e.figura) con(`ejemplo ${k + 1}`, e.figura); });
  for (let s = 0; s < 60; s++) { const a = i.ahoraTu.generar(s); if (a.dibujo) con(`ahora tú ${s}`, a.dibujo, i.ahoraTu.pieza); }
  return out;
}
test('las figuras de las ideas rehechas: sin carmín ni verde; la hoja con m naranja y n turquesa; el objeto de cada idea', () => {
  const OBJ = { 'leyes-exponentes': 'hoja', radicales: 'huertos', 'exponente-fraccionario': 'caja' };
  for (const id of IDEAS_REHECHAS) {
    let objeto = 0;
    for (const [donde, f, pieza] of figuras(idea(id))) {
      const s = Kit.piezas[pieza].dibujar(f.datos, f.estado || {});
      assert.ok(!/var\(--c-[hd]\)/.test(s), `${id} ${donde}: carmín o verde`);
      if (pieza !== 'alg-objeto') continue;
      objeto++;
      assert.match(s, new RegExp(`data-objeto="${OBJ[id]}"`), `${id} ${donde}`);
      if (OBJ[id] === 'hoja') { const g = P.geometria(f.datos, f.estado || {}); for (const [k, mk] of g.marcas.entries()) assert.equal(mk.color, k < g.D.m ? 'o' : 'i', `${donde}: doblez ${k + 1}`); }
      // En los biohuertos, el primero naranja y el segundo turquesa; el junto, en tinta.
      if (OBJ[id] === 'huertos') for (const m of s.matchAll(/data-huerto="(\w+)"><rect[^>]*stroke="([^"]+)"/g)) assert.equal(m[2], { a: 'var(--c-o)', b: 'var(--c-i)', junto: 'currentColor' }[m[1]], `${donde}: biohuerto ${m[1]}`);
    }
    assert.ok(objeto > 5, `${id}: la idea casi no usa su objeto (${objeto})`);
  }
  // La primera pantalla de cada idea (Lee) es su objeto.
  for (const id of IDEAS_REHECHAS) assert.equal(idea(id).lee.tarjetas[0].pieza, 'alg-objeto', id);
});

test('cada idea rehecha cumple el contrato de calidad 2 (validador común con calidad: 2, sola) y estrena sus palabras', () => {
  // «índice» se estrena en la idea 2 desde las correcciones del 18 nov (M9: la raíz cúbica se presenta en su «Mira»).
  const ESPERA = [['base', 'exponente', 'potencia'], ['radicando', 'raíz cuadrada', 'área', 'índice'], ['exponente fraccionario', 'radical']];
  const porIdea = Glosario.porIdea(def);
  def.ideas.forEach((i, k) => {
    assert.deepEqual(porIdea[k].map(g => g.termino).sort(), ESPERA[k], i.id);
    const sub = Object.assign({}, def, { calidad: 2, estado: 'borrador', ideas: [i], glosario: porIdea[k], laboratorio: undefined, laboratorioIdeas: undefined, glosarioSin: undefined });
    const p = Teoria.problemas(sub, { semillas: 60 });
    assert.deepEqual(p, [], `${i.id}:\n${p.join('\n')}`);
  });
  // La unidad entera ya tiene todas sus ideas rehechas: todo término de su glosario trae simple y 3 ejemplos.
  for (const g of def.glosario) assert.ok(g.simple && Array.isArray(g.ejemplos) && g.ejemplos.length >= 3, g.termino);
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

test('ideas 2 y 3: ninguna figura de Predice ni de un ejemplo delata la respuesta', () => {
  // Idea 2 (M6): un cuadrado de 25 m² con su lado «?», sin el 5 ni el violeta del resultado (antes, un plano con y = x).
  const p2 = idea('radicales').predice, s2 = P.dibujar(p2.dibujo.datos), txt2 = textosSVG(s2).join(' ');
  assert.equal(p2.pieza, undefined, 'la figura de Predice es el objeto de la idea');
  assert.match(s2, /data-objeto="huertos"/);
  assert.ok(!/(^|[^0-9−])5( m|$)/.test(txt2) && txt2.includes('? m') && !/var\(--c-f\)/.test(s2), `idea 2: la predicción delata: ${txt2}`);
  const p3 = P.dibujar(idea('exponente-fraccionario').predice.dibujo.datos), txt3 = textosSVG(p3).join(' ');
  assert.ok(!/(^|\D)9(\D|$)/.test(txt3) && !/var\(--c-f\)/.test(p3), `idea 3: la predicción delata: ${txt3}`);
  assert.match(txt3, /tapa: \?/);
  // Con algo que se pide, la caja y la loseta van sin cuadrícula (contar cuadritos daría la respuesta).
  const sinCuadricula = d => !/stroke-opacity="0\.(35|3)" stroke-width="1"/.test(P.dibujar(d));
  assert.ok(sinCuadricula(idea('exponente-fraccionario').predice.dibujo.datos), 'idea 3: la tapa que se pide trae cuadrícula');
  for (const e of idea('exponente-fraccionario').ejemplos) if (e.figura) assert.ok(sinCuadricula(e.figura.datos), e.titulo);
  for (const id of ['radicales', 'exponente-fraccionario']) for (const [k, e] of idea(id).ejemplos.entries()) {
    if (!e.figura) continue;
    const s = P.dibujar(e.figura.datos), ts = textosSVG(s).join(' | ');
    for (const f of fichas(e.respuesta).filter(x => x.v === 'c-f')) {
      const num = String(f.t).replace(/\s*(m|dm)$/, '');
      assert.ok(!new RegExp(`(^|[^0-9,])${num.replace(/[()?√]/g, '\\$&')}([^0-9,]|$)`).test(ts), `${id} ejemplo ${k + 1}: la figura muestra «${f.t}»: ${ts}`);
    }
    assert.ok(!/var\(--c-f\)/.test(s), `${id} ejemplo ${k + 1}: violeta en la figura`);
  }
});

test('ideas 2 y 3: los ejemplos no usan la situación de la predicción', () => {
  for (const [k, e] of idea('radicales').ejemplos.entries()) {
    const t = plano([e.enunciado, e.solucion.map(x => [x.texto, x.ecuacion || '']), e.respuesta]);
    assert.ok(!/raíz de \(−\d+\)|√\(\(−|\(−\d+\)²|\|−?\d|valor absoluto|\|x\|/.test(t), `radicales ejemplo ${k + 1}: ${t}`);
  }
  for (const [k, e] of idea('exponente-fraccionario').ejemplos.entries()) {
    const t = plano([e.enunciado, e.solucion.map(x => [x.texto, x.ecuacion || '']), e.respuesta]);
    assert.ok(!/tapa|27 elevado a 2\/3/.test(t), `exponente-fraccionario ejemplo ${k + 1}: ${t}`);
    if (e.figura) assert.ok(e.figura.datos.tapa === undefined, `ejemplo ${k + 1}: figura con tapa`);
  }
});

test('ideas 2 y 3: la misión no está cumplida al abrir y se cumple solo con lo que pide', () => {
  const j2 = idea('radicales').juega, b2 = Teoria.grilla(j2.controles).filter(v => j2.mision.logrado(v));
  assert.ok(b2.length > 10 && b2.every(v => v.a + v.b === 100));
  assert.ok(!/5|negativ/.test(j2.mision.bien), 'el «bien» no dice la predicción');
  const j3 = idea('exponente-fraccionario').juega;
  assert.deepEqual(Teoria.grilla(j3.controles).filter(v => j3.mision.logrado(v)), [{ e: '1/3', V: 64 }]);
  // El juego de la idea 3 no tiene exponentes como 2/3 (son la predicción), ni el de la idea 2 negativos.
  for (const v of Teoria.grilla(j3.controles)) assert.ok(!/2\/3|tapa/.test(plano(j3.lectura(v))));
  for (const v of Teoria.grilla(j2.controles)) assert.ok(!/−/.test(plano(j2.lectura(v))));
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
  // Las alternativas (en su campo, en su propia línea): la letra de la respuesta es la del valor correcto.
  for (const k of [10, 11, 12, 13, 14]) {
    const [L, v] = resp(k).split(', '), a = ej[k].alternativas;
    assert.ok(Array.isArray(a), `ejemplo ${k + 1}: sin alternativas`);
    assert.equal(plano(a['ABCDE'.indexOf(L)]), v.replace('x = ', ''), `ejemplo ${k + 1}: ${L} no es ${v}`);
    assert.ok(!/A\)/.test(plano(ej[k].enunciado)), `ejemplo ${k + 1}: alternativas pegadas al enunciado`);
  }
});

// ---------- Ideas 2 y 3: cálculo aparte ----------
const valorRaiz = t => { // «7», «6√2», «π − 3», «√2 − 1»… → número
  const r = t.replace(/π/g, String(Math.PI)).replace(/(\d*)√(\d+)/g, (_, c, n) => `(${c || 1}*Math.sqrt(${n}))`).replace(/−/g, '-');
  return Function(`return ${r}`)();
};
test('idea 2, «Ahora tú»: cuatro opciones distintas, una correcta, y la respuesta cuadra con un cálculo aparte (400 semillas)', () => {
  const i = idea('radicales'), vistos = new Set();
  for (let s = 0; s < SEMILLAS; s++) {
    const a = i.ahoraTu.generar(s), ops = a.opciones, bien = ops.find(o => o.correcta);
    assert.equal(ops.length, 4, `semilla ${s}`);
    assert.equal(new Set(ops.map(o => plano(o.texto))).size, 4, `semilla ${s}`);
    const q = plano(a.pregunta), r = plano(bien.texto);
    vistos.add(s % 6);
    let m;
    if (s % 6 === 5) { m = q.match(/^¿Cuánto vale raíz 3 de (−?\d+)\?$/); assert.ok(m, q); assert.equal(Number(r.replace('−', '-')), Math.round(Math.cbrt(Number(m[1].replace('−', '-')))), `semilla ${s}`); }
    else if (s % 6 === 0) { m = q.match(/^Si x = (−?\d+)/); assert.equal(Number(r), Math.abs(Number(m[1].replace('−', '-'))), `semilla ${s}`); }
    else if (s % 6 === 1) { m = q.match(/de (\d+) m² y otro de (\d+) m²/); assert.equal(r, `${Math.sqrt(+m[1] + +m[2])} m`, `semilla ${s}`); }
    else if (s % 6 === 2) { m = q.match(/raíz de (\d+) · raíz de (\d+)/); assert.equal(Number(r), Math.sqrt(m[1] * m[2]), `semilla ${s}`); }
    else if (s % 6 === 3) { m = q.match(/raíz de \((\d) − (π|√\d+)\)²/); assert.ok(m, q); const v = valorRaiz(m[1]) - valorRaiz(m[2]); assert.ok(Math.abs(valorRaiz(r) - Math.abs(v)) < 1e-9, `semilla ${s}: ${r}`); }
    else { m = q.match(/raíz de (\d+) \+ raíz de (\d+) − raíz de (\d+)/); const v = Math.sqrt(+m[1]) + Math.sqrt(+m[2]) - Math.sqrt(+m[3]); assert.ok(Math.abs(valorRaiz(r) - v) < 1e-9, `semilla ${s}: ${r} contra ${v}`);
      for (const o of ops.filter(x => !x.correcta)) assert.ok(Math.abs(valorRaiz(plano(o.texto)) - v) > 1e-6, `semilla ${s}: un distractor vale lo mismo`); }
  }
  assert.equal(vistos.size, 6);
});

test('idea 2, «Así se resuelve» simplifica una raíz; cuadra aparte, y «Ahora tú» nunca pide eso', () => {
  const i = idea('radicales');
  for (let s = 0; s < SEMILLAS; s++) {
    const r = i.resuelve.generar(s), m = plano(r.enunciado).match(/simplifica √(\d+)\.$/), N = +m[1], resp = plano(r.respuesta).split(' = ')[1];
    const [c, t] = resp.split('√').map(Number);
    assert.equal(c * c * t, N, `resuelve ${s}`);
    for (let k = 2; k * k <= t; k++) assert.ok(t % (k * k) !== 0, `resuelve ${s}: ${t} todavía tiene un cuadrado`);
    assert.ok(!/Saca de la raíz/.test(plano(i.ahoraTu.generar(s).pregunta)));
  }
});

// Una potencia de x con exponente fraccionario, del texto plano: «x elevado a 5/6» → 5/6.
const expX = t => { const m = t.match(/elevado a (−?\d+)(?:\/(\d+))?|al (cuadrado|cubo)/); return m[3] ? (m[3] === 'cuadrado' ? 2 : 3) : Number(m[1].replace('−', '-')) / (m[2] ? Number(m[2]) : 1); };
test('idea 3, «Ahora tú»: cuatro opciones distintas, una correcta, y la respuesta cuadra con un cálculo aparte (400 semillas)', () => {
  const i = idea('exponente-fraccionario'), vistos = new Set();
  for (let s = 0; s < SEMILLAS; s++) {
    const a = i.ahoraTu.generar(s), ops = a.opciones, bien = ops.find(o => o.correcta);
    assert.equal(ops.length, 4, `semilla ${s}`);
    assert.equal(new Set(ops.map(o => plano(o.texto))).size, 4, `semilla ${s}`);
    const q = plano(a.pregunta), r = plano(bien.texto);
    vistos.add(s % 5);
    let m;
    if (s % 5 === 0) { m = q.match(/raíz (\d) de x(?: elevado a (\d+)| (al cuadrado|al cubo))?/); const n = +m[1], e = m[2] ? +m[2] : m[3] ? (m[3] === 'al cuadrado' ? 2 : 3) : 1; assert.ok(Math.abs(expX(r) - e / n) < 1e-9, `semilla ${s}: ${q} → ${r}`); }
    else if (s % 5 === 1) { m = q.match(/(\d+) elevado a (\d+)\/(\d+)/); assert.ok(Math.abs(Number(r) - Number(m[1]) ** (m[2] / m[3])) < 1e-9, `semilla ${s}`); }
    else if (s % 5 === 2) { const ps = [...q.matchAll(/(\d+) elevado a (\d+)\/(\d+)/g)].map(x => Number(x[1]) ** (x[2] / x[3])); assert.ok(Math.abs(Number(r.replace('−', '-')) - (ps[0] + ps[1] - ps[2])) < 1e-9, `semilla ${s}`); }
    else if (s % 5 === 3) { m = q.match(/raíz de x (?:elevado a (\d)|al (cuadrado|cubo)) · raíz 3 de x (?:elevado a (\d)|al (cuadrado|cubo))?/) || q.match(/raíz de x elevado a 1/);
      const ex = q.match(/raíz de x( elevado a \d| al cuadrado| al cubo)? · raíz 3 de x( elevado a \d| al cuadrado| al cubo)?/), A = ex[1] ? expX(ex[1]) : 1, B = ex[2] ? expX(ex[2]) : 1;
      assert.ok(Math.abs(expX(r) - (A + B / 3) / 2) < 1e-9, `semilla ${s}: ${q} → ${r}`); }
    else { m = q.match(/de 2 elevado a x = (\d+)/); const n = /raíz 3/.test(q) ? 3 : /raíz 4/.test(q) ? 4 : 2; assert.equal(r, `x = ${n * Math.log2(+m[1])}`, `semilla ${s}`); }
  }
  assert.equal(vistos.size, 5);
});

test('idea 3, «Así se resuelve» junta dos raíces de x en una potencia; cuadra aparte, y «Ahora tú» nunca pide eso', () => {
  const i = idea('exponente-fraccionario');
  for (let s = 0; s < SEMILLAS; s++) {
    const r = i.resuelve.generar(s), q = plano(r.enunciado);
    const rs = [...q.matchAll(/raíz (?:(\d) )?de x(?: (elevado a \d+|al cuadrado|al cubo))?/g)].map(x => (x[2] ? expX(x[2]) : 1) / (x[1] ? Number(x[1]) : 2));
    assert.equal(rs.length, 2, q);
    assert.ok(Math.abs(expX(plano(r.respuesta)) - (rs[0] + rs[1])) < 1e-9, `resuelve ${s}: ${q} → ${plano(r.respuesta)}`);
    assert.ok(!/una sola potencia de x, con x > 0/.test(plano(i.ahoraTu.generar(s).pregunta)));
  }
});

test('ideas 2 y 3, ejemplos: cuentas rehechas aparte y la letra de cada alternativa', () => {
  const v = (id, k) => plano(idea(id).ejemplos[k].respuesta).replace(/\u2060/g, '');
  assert.equal(Math.sqrt(49), 7); assert.equal(Math.sqrt(1600), 40); assert.equal(Math.sqrt(4 * 25), 10);
  assert.equal(Math.cbrt(-27), -3); assert.equal(Math.sqrt(81 + 144), 15); assert.equal(Math.sqrt(12 * 3), 6);
  assert.ok(Math.abs(4 * Math.sqrt(50) - 20 * Math.SQRT2) < 1e-9 && Math.abs(Math.sqrt(12) + Math.sqrt(27) - 5 * Math.sqrt(3)) < 1e-9);
  assert.ok(Math.abs(Math.sqrt(50) + Math.sqrt(18) - Math.sqrt(8) - 6 * Math.SQRT2) < 1e-9 && Math.abs(Math.sqrt(72) - Math.sqrt(32) - 2 * Math.SQRT2) < 1e-9);
  assert.equal(Math.cbrt(-64) + Math.sqrt(81) - Math.cbrt(8), 3); assert.equal(Math.sqrt(4 * 36), 12);
  assert.ok(Math.sqrt(48) > Math.sqrt(45) && Math.sqrt(45) > Math.sqrt(44));
  assert.match(v('radicales', 0), /7 m/); assert.match(v('radicales', 6), /15 m/); assert.match(v('radicales', 9), /5√3/);
  assert.ok(Math.abs(125 ** (1 / 3) - 5) < 1e-9 && Math.abs(81 ** 0.25 - 3) < 1e-9 && Math.abs(32 ** 0.4 - 4) < 1e-9 && Math.abs(64 ** (2 / 6) - 4) < 1e-9);
  assert.equal(16 ** 0.5 + 16 ** 0.25 + 16 ** 0.75, 14);
  assert.ok(Math.abs(8 ** (2 / 3) + 16 ** 0.75 - 27 ** (1 / 3) - 9) < 1e-9 && 3 ** 2 > 2 ** 3 && Math.abs((2 ** 3.5) ** 0.25 - 2 ** (7 / 8)) < 1e-12);
  assert.ok(Math.abs(Math.cbrt(2 ** 15) - 32) < 1e-9);
  assert.match(v('exponente-fraccionario', 0), /5 dm/); assert.match(v('exponente-fraccionario', 9), /14/);
  for (const id of ['radicales', 'exponente-fraccionario']) idea(id).ejemplos.forEach((e, k) => {
    if (e.nivel !== 3) return;
    const a = e.alternativas, [L, ...resto] = v(id, k).split(', '), val = resto.join(', ');
    assert.ok(Array.isArray(a) && a.length >= 4, `${id} ejemplo ${k + 1}: sin alternativas`);
    assert.ok(val.replace(/^x = /, '').startsWith(plano(a['ABCDE'.indexOf(L)])), `${id} ejemplo ${k + 1}: ${L} es «${plano(a['ABCDE'.indexOf(L)])}», la respuesta «${val}»`);
  });
});

// ---------- Correcciones del 18 nov (rutinas/auditoria/algebra.exponentes-y-productos-notables.md) ----------
// Cada prueba nombra el hallazgo que habría detectado.
test('M1: ninguna leyenda de Juega escribe un número de la misión cumplida (la regla común, en la unidad entera)', () => {
  const p = Teoria.problemas(def, { semillas: 12 }).filter(x => /leyenda/.test(x));
  assert.deepEqual(p, []);
  for (const i of def.ideas) for (const x of i.juega.leyenda) assert.ok(!/\d/.test(plano([x.s])) || /^(dm|Por la mitad)/.test(plano([x.s])), `${i.id}: ${plano([x.s])}`);
});

// Todas las raíces con índice de una idea (ecuaciones, datos, ejemplos y 60 casos de «Ahora tú» y «Así se resuelve»).
function indices(x, out = []) {
  if (Array.isArray(x)) x.forEach(y => indices(y, out));
  else if (x && typeof x === 'object') { if ('raiz' in x && x.indice !== undefined) out.push(x.indice); Object.values(x).forEach(y => indices(y, out)); }
  return out;
}
test('M2: el índice de una raíz lleva el color de n (turquesa), como en el exponente 1/n', () => {
  let n = 0;
  for (const i of def.ideas) {
    const todo = [i.lee, i.mira, i.regla, i.ejemplos, i.predice.pregunta];
    for (let s = 0; s < 60; s++) todo.push(i.ahoraTu.generar(s), i.resuelve.generar(s));
    for (const ind of indices(todo)) { n++; assert.ok(ind && ind.v === 'c-i' && ind.m === 'índice', `${i.id}: índice ${JSON.stringify(ind)}`); }
  }
  assert.ok(n > 100, `${n} índices`);
});

test('M3 y regla 3: nada antes de Predice de la idea 2 dice que la raíz «no es negativa»', () => {
  const i = idea('radicales'), k = def.ideas.indexOf(i), re = /negativ|±|−5/;
  for (const t of [i.titulo, i.pregunta, i.actividad]) assert.ok(!re.test(t), t);
  for (const t of i.lee.tarjetas) assert.ok(!re.test(plano([t.titulo, t.texto, t.ecuacion || ''])), t.titulo);
  for (const g of Glosario.porIdea(def)[k]) assert.ok(!re.test([g.def, g.simple, ...(g.ejemplos || [])].join(' ')), g.termino);
});

test('M5 y B6, B7: los datos dan herramientas, no el paso hecho', () => {
  const ej = id => idea(id).ejemplos;
  const datosDe = e => plano(e.datos);
  assert.ok(!/\(−2\)⁴|−2⁴/.test(datosDe(ej('leyes-exponentes').find(e => e.titulo === 'El signo y la base'))));
  assert.ok(!/⁶/.test(datosDe(ej('exponente-fraccionario').find(e => e.titulo === 'Cuál es mayor'))));
  assert.match(datosDe(ej('exponente-fraccionario').find(e => e.titulo === 'Una raíz dentro de otra')), /índice 2/);
  for (const t of ['A la misma base', 'Dos potencias iguales']) assert.match(datosDe(ej('leyes-exponentes').find(e => e.titulo === t)), /^Potencias de \d: /);
  for (let s = 4; s < 400; s += 5) assert.match(plano(idea('leyes-exponentes').ahoraTu.generar(s).datos), /^Potencias de \d: /, `semilla ${s}`);
  // M10: el ejercicio de √((k − t)²) trae la fórmula que se aplica.
  for (let s = 3; s < 400; s += 6) assert.match(plano(idea('radicales').ahoraTu.generar(s).datos[0]), /√\(x²\) = /, `semilla ${s}`);
});

test('M9: la raíz cúbica se presenta en «Mira» de la idea 2 y «Ahora tú» la practica', () => {
  const i = idea('radicales');
  assert.ok(i.mira.pasos.some(p => /raíz cúbica/.test(p.texto) && indices(p.ecuacion).length), 'Mira presenta ∛');
  const cub = Array.from({ length: 60 }, (_, s) => i.ahoraTu.generar(s)).filter(a => indices(a.pregunta).length);
  assert.ok(cub.length >= 8 && cub.some(a => /−/.test(plano(a.pregunta))), `${cub.length} casos con ∛`);
});

test('B1: cada ejemplo de nivel 3 explica todas sus alternativas incorrectas', () => {
  for (const i of def.ideas) for (const [k, e] of i.ejemplos.entries()) {
    if (e.nivel !== 3) continue;
    const L = plano(e.respuesta).replace(/⁠/g, '').split(', ')[0], letras = 'ABCDE'.slice(0, e.alternativas.length).split('').filter(x => x !== L);
    const nombradas = new Set(fichas(e.solucion).filter(f => f.m === 'resultado' && /^[A-E]⁠$/.test(f.t)).map(f => f.t[0]));
    for (const x of letras) assert.ok(nombradas.has(x), `${i.id} ejemplo ${k + 1}: no explica la ${x}`);
  }
});

test('B2, B14 y B15: n llega a 3 (la misión no es el tope), la lectura concuerda en número y x¹ no se escribe', () => {
  const j = idea('leyes-exponentes').juega;
  assert.equal(j.controles.find(c => c.id === 'n').max, 3);
  assert.deepEqual(j.controles.find(c => c.id === 'e'), undefined);
  for (const v of Teoria.grilla(j.controles)) assert.ok(!/\b1 (capas|dobleces)\b/.test(plano(j.lectura(v))), JSON.stringify(v));
  assert.equal(idea('exponente-fraccionario').juega.controles.find(c => c.id === 'e').opciones.length, 5);
  for (let s = 0; s < 400; s++) assert.ok(!/x elevado a 1(?![/\d])/.test(plano(idea('exponente-fraccionario').ahoraTu.generar(s).pregunta)), `semilla ${s}`);
});

test('B12 y B13: «Cuál es mayor» ordena las alternativas como la pregunta, y ningún título se repite', () => {
  const e = idea('exponente-fraccionario').ejemplos.find(x => x.titulo === 'Cuál es mayor');
  assert.deepEqual(e.alternativas.slice(0, 2), ['∛3', '√2']);
  const titulos = def.ideas.flatMap(i => i.ejemplos.map(x => x.titulo));
  assert.equal(new Set(titulos).size, titulos.length);
});

// ---------- Ronda 2 del lector en frío (18 nov; rutinas/frio/algebra.exponentes-y-productos-notables.md, «Ronda 2») ----------
const ej = (id, t) => idea(id).ejemplos.find(e => e.titulo === t);
const datosP = e => plano(e.datos);
const resuelto = e => e.solucion.map(x => [x.texto, x.ecuacion || '']);
const limpia = x => (Array.isArray(x) ? x.filter(y => y !== undefined && y !== null).map(limpia) : x);
test('ronda 2, prioridad 1: en la idea 3, n es solo el índice; ninguna ficha de la idea 3 es un exponente de la idea 1', () => {
  const i = idea('exponente-fraccionario');
  for (const { donde, x } of lecturas(i)) for (const f of fichas(x)) {
    assert.ok(!['primer exponente', 'segundo exponente'].includes(f.m), `${donde}: «${f.t}» es ${f.m}`);
    if (f.t === 'n') assert.equal(f.m, 'índice', donde);
    if (f.t === 'm') assert.equal(f.m, 'exponente de adentro', donde);
  }
  // Las leyes de exponentes de la idea 3 van con r y s (sin n), y la suma de fracciones, en palabras (sin p, q, r, s sueltas).
  for (let s = 0; s < 60; s++) for (const c of [i.ahoraTu.generar(s), i.resuelve.generar(s)]) for (const d of c.datos) {
    const t = plano(d);
    if (/r \+ s|r · s/.test(t)) assert.ok(!/(^|[^\p{L}])n([^\p{L}]|$)/u.test(t), `semilla ${s}: ${t}`);
    assert.ok(!/p\/q/.test(t), `semilla ${s}: ${t}`);
  }
  assert.match(plano(i.lee.tarjetas[2].texto), /siempre el índice/);
  assert.match(i.regla.texto, /^Aquí n es el índice/);
});

test('ronda 2, prioridad 2: ningún texto de la idea 3 dice «arriba» o «abajo» de la fracción', () => {
  const i = idea('exponente-fraccionario');
  const re = /arriba|abajo/i;
  for (const { donde, x } of lecturas(i)) assert.ok(!re.test(plano(limpia(x))), `${donde}: ${plano(limpia(x))}`);
  for (const t of [i.regla.voz, i.ahoraTu.voz, i.predice.voz, i.mira.voz]) assert.ok(!re.test(t), t);
  for (let s = 0; s < 60; s++) for (const o of i.ahoraTu.generar(s).opciones) assert.ok(!re.test(o.siFuera || ''), o.siFuera);
  for (const o of i.predice.opciones) assert.ok(!re.test(o.siFuera || ''), o.siFuera);
  for (const g of def.glosario.filter(x => /fraccionario|índice/.test(x.termino))) assert.ok(!re.test([g.def, g.simple].join(' ')), g.termino);
  assert.match(i.regla.voz, /numerador/);
  assert.match(plano(ej('exponente-fraccionario', 'De potencia a raíz').solucion[0].texto), /denominador, 7/);
  // La práctica tampoco (sus explicaciones y soluciones de la idea 3).
  const G = require('../../../plantillas/exponentes-radicales/generador.js');
  for (let s = 0; s < 200; s++) {
    const p = G.generar(s, { idea: 'exponente-fraccionario' });
    if (!p) continue;
    const t = plano(limpia([p.enunciado, p.pregunta, p.solucion || []])) + ' ' + p.alternativas.map(o => (o.error && o.error.explicacion) || '').join(' ');
    assert.ok(p.solucion && p.alternativas.length >= 4, `práctica, semilla ${s}`);
    assert.ok(!re.test(t), `práctica, semilla ${s}: ${t}`);
  }
});

test('ronda 2, prioridad 3: los pasos que se daban por sabidos se dicen, y los datos no regalan la respuesta', () => {
  const anid = ej('exponente-fraccionario', 'Una raíz dentro de otra');
  assert.ok(datosP(anid).includes('x = x elevado a 1') || datosP(anid).includes('x = x¹'), datosP(anid));
  assert.match(plano(resuelto(anid)), /x es x¹/);
  const mayor = ej('exponente-fraccionario', 'Cuál es mayor'), rm = plano(resuelto(mayor));
  assert.match(rm, /entre 3 y entre 2/); assert.match(rm, /1\/3 · 6 = 2/); assert.match(rm, /1\/2 · 6 = 3/);
  const signo = ej('leyes-exponentes', 'El signo y la base');
  assert.ok(!/toca|base/.test(datosP(signo)), `los datos explican la trampa: ${datosP(signo)}`);
  assert.match(plano(resuelto(signo)), /toca solo su base/);
  const cero = ej('leyes-exponentes', 'El exponente cero');
  assert.ok(!/entre sí mismo|da 1/.test(datosP(cero)), datosP(cero));
  assert.ok(fichas(cero.respuesta).some(f => f.t === '0' && f.m === 'resultado'), 'el 0 de 2⁰ con color en la respuesta');
  // Ya no es la misma cuenta que «Juntar dos potencias»: dos leyes y la cuenta aparte.
  assert.ok(cero.solucion.length >= 3 && /2⁷ = 128/.test(plano(resuelto(cero))));
  assert.equal(2 ** 3 * 2 ** 4 / 2 ** 7, 1); assert.equal(3 + 4 - 7, 0);
  // La regla de la idea 1 pone (−2)⁴ = 16 al lado de −2⁴ = −16.
  assert.match(idea('leyes-exponentes').regla.condicion, /−2⁴ = −16; \(−2\)⁴ = 16/);
  assert.equal(-(2 ** 4), -16); assert.equal((-2) ** 4, 16);
});

test('ronda 2, prioridad 4: los colores que se perdían', () => {
  // «Ahora tú» 1: los tres exponentes con color (el del divisor es la n de aᵐ ÷ aⁿ).
  for (let s = 0; s < 400; s += 5) {
    const q = idea('leyes-exponentes').ahoraTu.generar(s).pregunta;
    assert.equal(fichas(q).length, 3, `semilla ${s}: ${plano(q)}`);
  }
  const sinX = ej('radicales', 'Sin hallar x');
  assert.ok(fichas(sinX.solucion).some(f => f.t === '4' && f.m === 'primer radicando') && fichas(sinX.solucion).some(f => f.t === '√x' && f.m === 'segundo radicando'));
  const pr = ej('exponente-fraccionario', 'De potencia a raíz');
  assert.deepEqual(fichas(pr.respuesta).map(f => [f.t, f.m]), [['4', 'exponente de adentro'], ['7', 'índice']]);
  for (const t of ['Una raíz dentro de otra', 'Cuál es mayor']) {
    const e = ej('exponente-fraccionario', t);
    assert.ok(e.solucion.slice(0, 2).every(x => fichas(x.ecuacion).length >= 2), `${t}: pasos sin color`);
  }
});

test('ronda 2, prioridad 5: lo demás del lector', () => {
  const i1 = idea('leyes-exponentes'), i2 = idea('radicales'), i3 = idea('exponente-fraccionario');
  assert.match(i1.lee.tarjetas[0].texto, /vista de lado: cada línea es una capa/);
  assert.ok(i2.juega.leyenda.some(x => x.s === 'radicando'), 'radicando en la leyenda');
  assert.match(i2.mira.pasos[0].texto, /punteada es y = x/);
  assert.match(i2.regla.condicion, /para todo x/);
  assert.ok(!/^a, b ≥ 0\.$|^a, b ≥ 0\. /.test(i2.regla.condicion));
  assert.match(plano(i3.regla.ecuacion), /8 elevado a 2\/6 = .*8 elevado a 1\/3/);
  assert.ok(Math.abs(8 ** (2 / 6) - 2) < 1e-12);
  assert.match(i3.lee.tarjetas[0].texto, /fracción de exponente/);
  // El juego de la idea 2 se reajusta de escala (el junto de 85 m² se ve más grande que el de 49 m²).
  const g = P.geometria(i2.juega.dibujo({ a: 36, b: 49 }).datos), [, qb, qj] = g.cuad;
  assert.ok((qj.x1 - qj.x0) - (qb.x1 - qb.x0) >= 20);
  // El área del biohuerto de Lee va adentro, no pegada al borde de abajo.
  assert.equal(P.geometria(i2.lee.tarjetas[0].dibujo.datos).textos.find(x => /36 m²/.test(x.txt)).que, 'dentro');
});

// ---------- igualdad-falsa (Etapa 6, 19 nov) ----------
// Falla con la versión de antes: SUPI[2] es '' y `SUPI[n] || n` escribía el índice 2 delante de la raíz.
test('igualdad-falsa: el siFuera de TAL-FRAC-MEDIO escribe la raíz cuadrada sin un 2 delante («√9 = 3», no «2√9 = 3»)', () => {
  const i = idea('exponente-fraccionario'), EXP = { '': 2, '³': 3, '⁴': 4, '⁵': 5 };
  let cuadradas = 0;
  for (let s = 1; s < SEMILLAS; s += 5) {
    const o = i.ahoraTu.generar(s).opciones.find(x => x.error === 'TAL-FRAC-MEDIO');
    const m = o.siFuera.match(/^Bien la raíz: ([³⁴⁵]?)√(\d+) = (\d+)\./);
    assert.ok(m, `semilla ${s}: ${o.siFuera}`);
    assert.equal(Number(m[3]) ** EXP[m[1]], Number(m[2]), `semilla ${s}: ${o.siFuera}`);
    if (m[1] === '') cuadradas++;
  }
  assert.ok(cuadradas > 0, 'alguna semilla saca una raíz cuadrada');
  const falsas = Teoria.pendientes(def, { semillas: 200 }).concat(Teoria.problemas(def, { semillas: 200 })).filter(x => /\[igualdad-falsa\]/.test(x));
  assert.deepEqual(falsas, []);
});
