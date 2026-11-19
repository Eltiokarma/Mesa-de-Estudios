// Pruebas propias de «Polinomios» (además del validador común de contenido/teoria/teoria.test.js). Etapa 5, fases 2 y 3
// (19 nov): seis ideas, todas reescritas contra el contrato. La unidad todavía no declara calidad: 2 (la marca la
// sesión después del lector en frío y del auditor); la última prueba corre el validador como si la tuviera. Al final,
// las pruebas de las ideas 2 a 6. Para la idea 1:
//   - el orden de las ideas y los ids publicados;
//   - un color fijo por magnitud (cabecera de polinomios.js): cada ficha de color de la idea 1 dice su magnitud (m) y
//     lleva el color de def.colores; primer polinomio naranja, segundo turquesa, resultado violeta; nunca carmín ni
//     verde, tampoco en sus figuras;
//   - la idea 1 cumple sola el contrato de calidad 2 y estrena sus cuatro palabras;
//   - nada antes de Predice delata su respuesta (que yx es xy): ni el título ni el Resumen, ni Lee, ni el glosario, ni
//     el juego; los ejemplos de nivel 1 tampoco; la figura de Predice no muestra las piezas ya juntas;
//   - las figuras de los ejemplos no muestran lo que se pide;
//   - la misión la cumple un solo caso y su «bien» no dice la predicción; la lectura del juego cuadra en sus 75 estados;
//   - «Ahora tú» trae cuatro opciones distintas en 400 semillas, una sola vale lo que la pregunta y ninguna otra vale lo
//     mismo; «Así se resuelve» cuadra y no hace la pregunta de «Ahora tú»; todo ejercicio trae sus datos;
//   - los 15 ejemplos: la respuesta vale lo que pide el enunciado, la letra es la de la alternativa correcta, las cinco
//     alternativas valen distinto y cada incorrecta se explica. Las cuentas se rehacen aquí con un analizador propio de
//     expresiones (valores en cinco puntos) y, aparte y sin el código de la unidad, en el scratchpad de la sesión
//     (e5-algebra/cuentas-idea1.py: 4322 comprobaciones).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../../../nucleo/kit/kit.js');
const Teoria = require('../../../nucleo/teoria.js');
const Glosario = require('../../../nucleo/glosario.js');
const E = require('../../../nucleo/ecuacion.js');
const def = require('./polinomios.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const P = Kit.piezas['alg-losetas'];
const idea = id => def.ideas.find(i => i.id === id);
const I1 = idea('terminos-semejantes');
const SEMILLAS = 400;
const plano = x => E.texto(x === undefined || x === null ? '' : x).replace(/⁠/g, '');
const fichas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(fichas)
  : typeof x.v === 'string' && /^c-/.test(x.v) ? [x] : Object.values(x).flatMap(fichas));
const textosSVG = s => [...s.matchAll(/<text\b[^>]*>(.*?)<\/text>/g)].map(m => m[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim());

// ---------- Cálculo aparte: el valor de una expresión escrita como la ve el alumno ----------
// Números, x, y, m, n, superíndices, + − ·, paréntesis, corchetes y producto implícito (2xy, 3(x + 1)).
const SUP = { '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9 };
function valor(texto, env) {
  const t = [];
  for (let i = 0; i < texto.length;) {
    const c = texto[i];
    if (/\s/.test(c)) { i++; continue; }
    if (/[0-9]/.test(c)) { let j = i; while (j < texto.length && /[0-9]/.test(texto[j])) j++; t.push(['n', +texto.slice(i, j)]); i = j; continue; }
    if (c in SUP) { let v = 0; while (i < texto.length && texto[i] in SUP) v = v * 10 + SUP[texto[i++]]; t.push(['^', v]); continue; }
    if ('xymn'.includes(c)) { t.push(['v', c]); i++; continue; }
    if ('+−·()[]'.includes(c)) { t.push([c, c]); i++; continue; }
    throw new Error(`no entiendo «${c}» en «${texto}»`);
  }
  let k = 0;
  const ver = () => (k < t.length ? t[k][0] : null);
  const factor = () => {
    const a = ver();
    if (a === '−') { k++; return -factor(); }
    let b;
    if (a === 'n') b = t[k++][1];
    else if (a === 'v') b = env[t[k++][1]];
    else if (a === '(' || a === '[') { k++; b = expr(); assert.ok(ver() === ')' || ver() === ']', texto); k++; }
    else throw new Error(`factor inesperado en «${texto}»`);
    if (ver() === '^') b = b ** t[k++][1];
    return b;
  };
  const term = () => { let v = factor(); for (;;) { const a = ver(); if (a === '·') { k++; v *= factor(); } else if (a === 'n' || a === 'v' || a === '(' || a === '[') v *= factor(); else return v; } };
  function expr() { let v = term(); while (ver() === '+' || ver() === '−') { const op = t[k++][0], w = term(); v = op === '+' ? v + w : v - w; } return v; }
  const v = expr();
  assert.equal(k, t.length, `sobra algo en «${texto}»`);
  return v;
}
const PUNTOS = [{ x: 2, y: 3, m: 5, n: 7 }, { x: -3, y: 5, m: 2, n: -1 }, { x: 7, y: -2, m: 1, n: 4 }, { x: 11, y: 13, m: 3, n: 9 }, { x: -5, y: 4, m: -2, n: 6 }];
const vals = s => PUNTOS.map(p => valor(s, p));
const igual = (a, b) => JSON.stringify(vals(a)) === JSON.stringify(vals(b));

// ---------- La unidad ----------
test('seis ideas en el orden de la propuesta; los ids publicados se conservan y la unidad aún no declara calidad 2', () => {
  assert.deepEqual(def.ideas.map(i => i.id), ['terminos-semejantes', 'valor-numerico', 'grados', 'completo-ordenado', 'igualdad', 'operaciones']);
  assert.equal(def.calidad, undefined, 'calidad: 2 la marca la sesión después del lector en frío y el auditor');
  assert.ok(def.ideas.length <= 6 && def.septimaIdea === undefined);
  const u = require('../../../catalogo/cursos/algebra.json').unidades.find(x => x.id === 'algebra.polinomios');
  assert.deepEqual(Teoria.problemas(def, { temas: u.temas, semillas: 60 }), []);
  assert.deepEqual(I1.temas, ['Operaciones con polinomios']);
  // Las mesas siguen colgadas de ideas que existen.
  for (const ids of Object.values(def.laboratorioIdeas)) for (const id of ids) assert.ok(idea(id), id);
});

// ---------- Colores ----------
test('la tabla de colores: primer polinomio naranja, segundo turquesa, resultado violeta; sin carmín ni verde', () => {
  assert.deepEqual(def.colores, { 'primer polinomio': 'o', 'segundo polinomio': 'i', resultado: 'f', 'valor de x': 'o', 'exponente de x': 'o', 'exponente de y': 'i', 'lo que se olvida': 'f' });
  assert.ok(Object.values(def.colores).every(c => ['o', 'i', 'f'].includes(c)), 'ni carmín ni verde');
});

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
test('idea 1: cada ficha de color dice su magnitud y lleva su color; ninguna en carmín ni en verde', () => {
  let n = 0;
  for (const { donde, x } of lecturas(I1)) for (const fch of fichas(x)) {
    n++;
    assert.ok(fch.m in def.colores, `${donde}: ficha «${fch.t}» sin magnitud`);
    assert.equal(fch.v, `c-${def.colores[fch.m]}`, `${donde}: «${fch.t}» (${fch.m})`);
  }
  assert.ok(n > 300, `fichas revisadas: ${n}`);
  const llaves = x => (x === null || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(llaves) : ('llave' in x ? [x] : []).concat(Object.values(x).flatMap(llaves)));
  for (const { donde, x } of lecturas(I1)) for (const l of llaves(x)) assert.ok(!l.color || l.color === 'c-f', `${donde}: llave en ${l.color}`);
  for (const c of I1.juega.controles) assert.equal(c.color, 'c-i', 'los controles son del pedido 2');
});

test('idea 1: sus figuras, sin carmín ni verde, y todas de la pieza alg-losetas', () => {
  const figs = [];
  for (const t of I1.lee.tarjetas) if (t.dibujo) figs.push(t.dibujo);
  for (const v of Teoria.grilla(I1.juega.controles)) figs.push(I1.juega.dibujo(v));
  figs.push(I1.predice.dibujo, I1.predice.revelar, I1.regla.dibujo);
  for (const p of I1.mira.pasos) figs.push({ pieza: I1.mira.pieza, datos: I1.mira.datos, estado: p.estado });
  for (const e of I1.ejemplos) if (e.figura) figs.push(e.figura);
  for (let s = 0; s < 30; s++) figs.push(I1.resuelve.generar(s).dibujo);
  for (const fg of figs) {
    assert.equal(fg.pieza, 'alg-losetas');
    const s = P.dibujar(fg.datos, fg.estado || {});
    assert.ok(!/var\(--c-[hd]\)/.test(s) && /data-prueba="si"/.test(s));
    assert.ok(P.cabe(fg.datos, fg.estado || {}), JSON.stringify(fg.datos).slice(0, 120));
  }
  assert.ok(figs.length > 100);
});

// ---------- Contrato ----------
test('la idea 1 cumple sola el contrato de calidad 2 y estrena sus cuatro palabras', () => {
  const porIdea = Glosario.porIdea(def);
  assert.deepEqual(porIdea[0].map(g => g.termino).sort(), ['parte literal', 'polinomio', 'semejante', 'término']);
  const sub = Object.assign({}, def, { calidad: 2, ideas: [I1], glosario: porIdea[0], laboratorio: undefined, laboratorioIdeas: undefined });
  const q = Teoria.problemas(sub, { semillas: 60 });
  assert.deepEqual(q, [], q.join('\n'));
  for (const g of porIdea[0]) assert.ok(g.simple && Array.isArray(g.ejemplos) && g.ejemplos.length >= 3, g.termino);
  for (const k of ['aprendizaje', 'actividad', 'pregunta']) assert.ok(typeof I1[k] === 'string' && I1[k].length > 20, k);
  // «binomio» se define en Binomio de Newton y «valor absoluto» en Valor absoluto y radicales (decisiones escritas);
  // «coeficiente» y «término independiente», por ahora, en Ecuaciones lineales y cuadráticas (propuesta, decisión 6).
  for (const t of ['binomio', 'valor absoluto', 'coeficiente', 'término independiente']) assert.ok(!def.glosario.some(g => g.termino === t), t);
  assert.ok(/coeficiente/.test(Glosario.texto(def)));
  assert.ok(def.glosario.length <= 30);
});

// Lo que delataría la predicción de la idea 1 (2xy + 3yx = 5xy), si apareciera antes de Predice.
const DELATA = /yx|y · x|girad|cualquier orden|orden de las letras|5xy/;
test('idea 1: nada antes de Predice delata su respuesta: título, Resumen, Lee, glosario y el juego', () => {
  const j = I1.juega;
  for (const t of [I1.titulo, I1.pregunta, I1.actividad]) assert.ok(!DELATA.test(t), t);
  for (const t of I1.lee.tarjetas) assert.ok(!DELATA.test(plano([t.titulo, t.texto, t.ecuacion || ''])), t.titulo);
  for (const g of Glosario.porIdea(def)[0]) assert.ok(!DELATA.test([g.def, g.simple, ...(g.ejemplos || [])].join(' ')), g.termino);
  for (const t of [j.consigna, plano(j.mision.texto), j.mision.bien, j.voz, plano(j.leyenda.map(l => [l.s, ' ', l.t, ' ']))]) assert.ok(!DELATA.test(t) && !/\by\b/.test(t.replace(/ y /g, ' ')), t);
  // El juego solo tiene una letra: ninguna lectura ni figura trae «y».
  for (const v of Teoria.grilla(j.controles)) {
    assert.ok(!/y/.test(plano(j.lectura(v))), plano(j.lectura(v)));
    assert.ok(!textosSVG(P.dibujar(j.dibujo(v).datos)).some(t => /y/.test(t) && !/Pedido/.test(t)));
  }
  // Las tarjetas de Lee no dicen qué se junta con qué (es el juego): ninguna suma dos pedidos.
  for (const t of I1.lee.tarjetas) assert.ok(!/semejante/.test(plano([t.texto])), `Lee no adelanta la palabra de la regla: ${t.titulo}`);
});

test('idea 1: los ejemplos de nivel 1 no usan la situación de la predicción (dos letras en otro orden)', () => {
  for (const e of I1.ejemplos.filter(x => x.nivel === 1)) {
    const t = plano([e.enunciado, e.datos, e.solucion.map(x => [x.texto, x.ecuacion || '']), e.respuesta]);
    assert.ok(!DELATA.test(t), t);
  }
});

test('idea 1: la figura de Predice no junta las piezas ni dice la suma; la de revelar, sí', () => {
  const antes = textosSVG(P.dibujar(I1.predice.dibujo.datos)).join(' | '), despues = textosSVG(P.dibujar(I1.predice.revelar.datos)).join(' | ');
  assert.ok(!/5xy|Juntas|\b5\b/.test(antes), antes);
  assert.ok(/2xy/.test(antes) && /3yx/.test(antes));
  assert.ok(/5xy/.test(despues) && /Juntas/.test(despues));
  assert.equal(P.geometria(I1.predice.dibujo.datos).formas.length, 5, 'las 2 echadas y las 3 giradas');
  // Predice lleva datos sin fórmula: ni «=» ni la regla.
  for (const d of I1.predice.datos) assert.ok(!/=|semejante/.test(plano(d)), plano(d));
  assert.equal(new Set(I1.predice.opciones.filter(o => !o.correcta).map(o => o.error)).size, 3, 'ningún código repetido');
  assert.ok(igual(plano(I1.predice.opciones.find(o => o.correcta).texto), '2xy + 3yx'));
});

test('idea 1: las figuras de los ejemplos no muestran lo que se pide', () => {
  for (const [k, e] of I1.ejemplos.entries()) {
    if (!e.figura) continue;
    const ts = textosSVG(P.dibujar(e.figura.datos, e.figura.estado || {}));
    const pide = plano(e.respuesta).replace(/^[A-E], /, '').replace(/ (dm²|m)$/, '');
    assert.ok(!ts.some(t => t.includes(pide)), `ejemplo ${k + 1}: la figura muestra «${pide}»: ${ts.join(' | ')}`);
    // Sin la fila de «Juntos»: el dibujo muestra lo que cada dato marca por sí solo, no lo que sale de juntarlos.
    assert.ok(e.figura.datos.juntos !== true, `ejemplo ${k + 1}: la figura ya junta los pedidos`);
    assert.ok(!ts.some(t => /^Juntos/.test(t)));
  }
  assert.ok(I1.ejemplos.filter(e => e.figura).length >= 5, 'al menos cinco ejemplos con su dibujo');
});

test('idea 1: la misión la cumple un solo caso, no está cumplida al abrir, y la lectura cuadra en los 75 estados', () => {
  const j = I1.juega, g = Teoria.grilla(j.controles);
  assert.equal(g.length, 75);
  assert.deepEqual(g.filter(v => j.mision.logrado(v)), [{ l: 1, t: 4, c: 4 }]);
  const inicio = Object.fromEntries(j.controles.map(c => [c.id, c.inicio]));
  assert.ok(!j.mision.logrado(inicio));
  assert.ok(!DELATA.test(j.mision.bien));
  for (const v of g) {
    const t = plano(j.lectura(v)), m = t.match(/^\((.+)\) \+ \((.+)\) = (.+)$/);
    assert.ok(m, t);
    assert.ok(igual(m[1], '2x² + 3x + 1') && igual(m[2], `${v.l}x² + ${v.t}x + ${v.c}`), t);
    assert.ok(igual(`(${m[1]}) + (${m[2]})`, m[3]), t);
    assert.equal(j.mision.logrado(v), igual(m[3], '3x² + 7x + 5'), t);
    // La figura dice lo mismo que la lectura: los términos de «Juntos».
    const ts = P.geometria(j.dibujo(v).datos).textos.filter(x => x.que === 'termino').map(x => x.txt).join(' + ');
    assert.ok(igual(ts, m[3]), `${t} contra ${ts}`);
  }
  // Los rótulos de la leyenda existen al abrir el juego (no dicen la misión cumplida).
  const alAbrir = textosSVG(P.dibujar(j.dibujo(inicio).datos)).join(' ') + plano(j.lectura(inicio));
  for (const s of ['2x²', '3x', 'Pedido 2', 'Juntos']) assert.ok(alAbrir.includes(s), s);
});

test('idea 1: «Mira» y la regla, rehechos aparte', () => {
  const ecs = I1.mira.pasos.map(p => plano(p.ecuacion));
  for (const k of [0, 1, 3]) { const ps = ecs[k].split(' = '); for (let i = 1; i < ps.length; i++) assert.ok(igual(ps[i - 1], ps[i]), ecs[k]); }
  assert.equal(ecs[4], '3x + 2x² no es 5x³'); assert.ok(!igual('3x + 2x²', '5x³'));
  assert.ok(igual('−(2x² − x)', '−2x² + x') && plano(I1.regla.ecuacion).includes('−(2x² − x) = −2x² + x'));
  // Cada letra de la regla se dice en palabras (en la regla o en su condición): a, b y xⁿ.
  for (const s of ['a y b', 'xⁿ']) assert.ok(I1.regla.condicion.includes(s), s);
  assert.equal(I1.mira.pasos.length, 5);
  // El dibujo de la regla es el juego con la misión cumplida.
  assert.deepEqual(P.geometria(I1.regla.dibujo.datos).total, [3, 7, 5]);
});

// ---------- «Ahora tú» y «Así se resuelve» ----------
test('idea 1: «Ahora tú» trae cuatro opciones distintas en 400 semillas; una sola vale lo que pide la pregunta', () => {
  const porTipo = [0, 0, 0, 0, 0], errores = new Set(), preguntas = new Set();
  for (let s = 0; s < SEMILLAS; s++) {
    const a = I1.ahoraTu.generar(s), q = plano(a.pregunta).replace(/ al cuadrado/g, ' elevado a 2').replace(/ al cubo/g, ' elevado a 3'), ops = a.opciones.map(o => plano(o.texto));
    preguntas.add(q); porTipo[s % 5]++;
    assert.equal(ops.length, 4, q); assert.equal(new Set(ops).size, 4, `${q}: ${ops.join(' ; ')}`);
    assert.equal(a.opciones.filter(o => o.correcta).length, 1);
    assert.ok(Array.isArray(a.datos) && a.datos.length >= 1, `${q}: sin datos`);
    for (const o of a.opciones.filter(x => !x.correcta)) { assert.ok(o.error && o.siFuera, q); errores.add(o.error); assert.match(o.siFuera, /^(Bien|Esos|\d)/, o.siFuera); }
    // La conjunción «y» nunca va pegada a un término con la letra y (se leería como parte de la cuenta).
    assert.ok(!/[xy²³⁴⁵⁶⁷⁸⁹] y [−\dxy]/.test(q), q);
    assert.equal(new Set(a.opciones.filter(o => !o.correcta).map(o => o.error)).size, 3, `${q}: código repetido`);
    let pide;
    const exps = q.match(/^Si (\d+)x elevado a m \+ (\d+)y elevado a (\d+) es semejante a −(\d+)x elevado a (\d+)y elevado a n − (\d+), ¿cuánto vale m \+ n\?$/);
    if (exps) { const [, , p, ey, , ex, r] = exps.map(Number); pide = String((ex - p) + (ey + r)); assert.ok(ey >= 2 && ex >= 2 && ex - p >= 1, q); }
    else {
      const m = q.match(/^(?:Reduce |Suma: |Resta: )(.+)\.$/);
      assert.ok(m, q); pide = m[1];
    }
    const bien = plano(a.opciones.find(o => o.correcta).texto);
    assert.ok(igual(bien, pide), `${q} → ${bien}`);
    for (const o of a.opciones.filter(x => !x.correcta)) assert.ok(!igual(plano(o.texto), pide), `${q}: «${plano(o.texto)}» también vale lo correcto`);
    // La solución escrita llega a la respuesta.
    const sol = plano(a.solucion.ecuacion);
    assert.ok(sol.endsWith(bien), `${q}: ${sol}`);
    if (!exps) { const ps = sol.split(' = '); assert.ok(igual(ps[0], pide), `${q}: ${sol}`); }
    // Ningún caso es el de la predicción ni la misión del juego.
    assert.ok(!/2xy \+ 3yx/.test(q) && !/\(2x² \+ 3x \+ 1\) \+ \(x² \+ 4x \+ 4\)/.test(q), q);
  }
  assert.deepEqual(porTipo, [80, 80, 80, 80, 80]);
  assert.ok(preguntas.size >= 350, `casos distintos: ${preguntas.size}`);
  for (const e of ['TAL-NO-SEMEJ', 'TAL-SUMA-POT', 'TAL-SIGNO', 'PO21', 'TAL-RESTA-PRIMERO', 'TAL-RESTA-ORDEN', 'TAL-EXP-CRUZ', 'TAL-ORDEN', 'AL16', 'TAL-EXP-DIRECTO']) assert.ok(errores.has(e), e);
});

test('idea 1: «Así se resuelve» cuadra aparte, trae sus datos, y «Ahora tú» nunca hace esa pregunta', () => {
  const enunciados = new Set();
  for (let s = 0; s < 60; s++) {
    const r = I1.resuelve.generar(s), q = plano(r.enunciado);
    enunciados.add(q);
    const m = q.match(/^Rubén hace (\d) pedidos iguales de (.+) dm² y uno más de (.+) dm²\. ¿Qué polinomio dice cuánto cubren todos juntos\?$/);
    assert.ok(m, q);
    const total = `${m[1]}·(${m[2]}) + (${m[3]})`, resp = plano(r.respuesta);
    assert.ok(/ dm²$/.test(resp) && igual(resp.replace(/ dm²$/, ''), total), `${q} → ${resp}`);
    for (const parte of plano(r.pasos.find(p => p.tipo === 'cuentas').ecuacion).split(' = ')) assert.ok(igual(parte, total), `${q}: ${parte}`);
    assert.deepEqual(r.pasos.map(p => p.tipo), ['pide', 'regla', 'cuentas', 'sentido']);
    assert.ok(Array.isArray(r.datos) && r.datos.length >= 1);
    assert.ok(P.cabe(r.dibujo.datos));
    // El paso «sentido» cuenta piezas: k veces las del pedido más las del otro, igual a la suma de coeficientes.
    const n = r.pasos.find(p => p.tipo === 'sentido').texto.match(/(\d) · (\d+) \+ (\d+) = (\d+) piezas, y los coeficientes del resultado suman (\d+) \+ (\d+) \+ (\d+) = (\d+)\./).slice(1).map(Number);
    assert.equal(n[0] * n[1] + n[2], n[3]); assert.equal(n[4] + n[5] + n[6], n[7]); assert.equal(n[3], n[7]);
    assert.equal(valor(resp.replace(/ dm²$/, ''), { x: 1 }), n[7], 'con x = 1, cada pieza cubre 1 dm²');
  }
  assert.ok(enunciados.size >= 20);
  for (let s = 0; s < SEMILLAS; s++) assert.ok(!/pedidos iguales/.test(plano(I1.ahoraTu.generar(s).pregunta)));
});

// ---------- Ejemplos ----------
// Lo que pide cada ejemplo, escrito aquí a mano (no sale del código de la unidad).
const PIDE = [
  '3x + 4x', null, null, null, '9x² − 4x²',
  '3x² + 5x − x² + 2x', '(2x² + 3x + 4) + (x² + 2x + 1)', '(5x² + 4x − 6) − (2x² − x + 3)', '4xy + 3x − xy + 2x', '(5x² + 3x + 4) − (2x² + 3x + 1)',
  '(6 − 2) + (5 + 1)', '5x − [2x − (3x − 4)]', '2·(3x + 2) + 2·(x + 5)', '2·(3x²y − 2xy² + 4) − (−x²y + 5xy² − 6)', '3·(2x² + x + 4) − (x² + 3x + 5)',
];
// De qué error sale cada alternativa incorrecta de nivel 3 (escrito aquí a mano).
const TRAMPAS = {
  10: { C: '(6 + 2) + (5 − 1)', A: '(6 − 2) + (5 − 1)', D: '6 + 5', E: '(6 − 2)·(5 + 1)' },
  11: { C: '5x − [2x − 3x − 4]', A: '5x − 2x − (3x − 4)', B: '5x − 2x − 3x − 4', E: '5x + 2x + 3x − 4' },
  12: { A: '(3x + 2) + (x + 5)', D: '2·(3x + x) + (2 + 5)', C: '(8 + 14)x', E: '(3x + 2)(x + 5)' },
  13: { A: '2·(3x²y − 2xy² + 4) + (−x²y + 5xy² − 6)', B: '6x²y − 4xy² + 8 + x²y − 5xy² − 6', D: '(3x²y − 2xy² + 4) − (−x²y + 5xy² − 6)', E: '6x²y − 4xy² + 4 + x²y − 5xy² + 6' },
  14: { A: '6x² − x² + 3x + 3x + 12 + 5', D: '(5 + 7)x²', C: '(2x² + x + 4) − (x² + 3x + 5)', E: '6x² + x + 4 − x² − 3x − 5' },
};
test('idea 1: los 15 ejemplos, rehechos aparte: respuesta, letra, alternativas y cada trampa explicada', () => {
  const ej = I1.ejemplos;
  assert.deepEqual(ej.map(e => e.nivel), [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3]);
  assert.equal(new Set(ej.map(e => e.titulo)).size, 15, 'títulos sin repetir');
  ej.forEach((e, k) => {
    assert.ok(Array.isArray(e.datos) && e.datos.length >= 1, `ejemplo ${k + 1}: sin datos`);
    const resp = plano(e.respuesta), sol = e.solucion.map(s => plano([s.texto, ' ', s.ecuacion || ''])).join(' ');
    assert.ok(fichas(e.respuesta).some(fch => fch.m === 'resultado') || k === 1 || k === 3, `ejemplo ${k + 1}: la respuesta lleva el color del resultado`);
    if (e.nivel < 3) {
      assert.equal(e.alternativas, undefined);
      if (PIDE[k]) assert.ok(igual(resp.replace(/ dm²$/, ''), PIDE[k]), `ejemplo ${k + 1}: ${resp}`);
      return;
    }
    assert.equal(e.alternativas.length, 5);
    const letra = resp[0], cual = 'ABCDE'.indexOf(letra);
    assert.match(resp, /^[A-E], /);
    assert.ok(fichas(e.respuesta).length >= 1 && e.respuesta[0].negrita, `ejemplo ${k + 1}: la letra, en negrita y en tinta`);
    assert.ok(igual(e.alternativas[cual], PIDE[k]), `ejemplo ${k + 1}: la ${letra} no vale lo que se pide`);
    assert.ok(igual(resp.slice(3).replace(/ (dm²|m)$/, ''), PIDE[k]), `ejemplo ${k + 1}: ${resp}`);
    assert.equal(new Set(e.alternativas.map(a => JSON.stringify(vals(a)))).size, 5, `ejemplo ${k + 1}: dos alternativas valen lo mismo`);
    assert.deepEqual(Object.keys(TRAMPAS[k]).sort(), 'ABCDE'.replace(letra, '').split(''), `ejemplo ${k + 1}`);
    for (const [L, expr] of Object.entries(TRAMPAS[k])) {
      assert.ok(igual(e.alternativas['ABCDE'.indexOf(L)], expr), `ejemplo ${k + 1}: la ${L} («${e.alternativas['ABCDE'.indexOf(L)]}») no sale de ${expr}`);
      assert.ok(sol.includes(`La ${L} `), `ejemplo ${k + 1}: el resuelto no explica la ${L}`);
    }
  });
  // En los ejemplos con la letra y, la conjunción «y» no va entre dos términos ni entre dos cuentas.
  for (const k of [8, 10, 13]) {
    const t = plano([ej[k].enunciado, ej[k].solucion.map(x => [x.texto, ' '])]);
    assert.ok(!/[xy²³⁴⁵⁶⁷⁸⁹\d] y [−\dxyPQmn]/.test(t), `ejemplo ${k + 1}: ${t}`);
  }
  // Lo que no es una cuenta de polinomios, comprobado a mano.
  assert.equal(plano(ej[1].respuesta), 'Coeficiente: −7. Parte literal: x²y');
  assert.equal(plano(ej[2].respuesta), 'No: x + x = 2x y x · x = x²');
  assert.deepEqual([-3, -1, 0, 1, 2, 3, 5].filter(x => 2 * x === x * x), [0, 2], 'x + x = x · x solo si x es 0 o 2');
  assert.equal(plano(ej[3].respuesta), 'Solo 4x³ y −9x³ son semejantes');
  // Niveles que suben: ningún enunciado de un nivel repite el de otro con otros números.
  const forma = e => plano(e.enunciado).replace(/\d+/g, '#');
  for (const a of ej) for (const b of ej) if (a.nivel !== b.nivel) assert.notEqual(forma(a), forma(b), `${a.titulo} y ${b.titulo}`);
});


// ---------- Ideas 2 a 6 (fase 3) ----------
// Las cuentas de sus ejemplos, de «Ahora tú», de «Así se resuelve», de las lecturas y de «Mira» se rehacen aparte, sin el
// código de la unidad, en el scratchpad de la sesión (e5-algebra/cuentas-fase3.py: 8789 comprobaciones). Aquí, lo que
// el validador común no mira: colores, misiones, glosario por idea, lo que se lee antes de Predice y las alternativas.
const RESTO = def.ideas.slice(1);
test('ideas 2 a 6: cada ficha de color dice su magnitud y lleva su color; ninguna figura usa carmín ni verde', () => {
  let n = 0;
  for (const i of RESTO) for (const { donde, x } of lecturas(i)) for (const fch of fichas(x)) {
    n++;
    assert.ok(fch.m in def.colores, `${i.id} ${donde}: ficha «${fch.t}» sin magnitud`);
    assert.equal(fch.v, `c-${def.colores[fch.m]}`, `${i.id} ${donde}: «${fch.t}» (${fch.m})`);
  }
  assert.ok(n > 1000, `fichas revisadas: ${n}`);
  const figs = [];
  for (const i of RESTO) {
    for (const t of i.lee.tarjetas) if (t.dibujo) figs.push(t.dibujo);
    for (const v of Teoria.grilla(i.juega.controles)) figs.push(i.juega.dibujo(v));
    figs.push(i.predice.dibujo, i.predice.revelar, i.regla.dibujo);
    for (const p of i.mira.pasos) figs.push({ pieza: i.mira.pieza, datos: i.mira.datos, estado: p.estado });
    for (const e of i.ejemplos) if (e.figura) figs.push(e.figura);
    for (let s = 0; s < 30; s++) { const r = i.resuelve.generar(s); figs.push(r.dibujo, ...r.pasos.map(x => x.dibujo).filter(Boolean)); }
  }
  for (const fg of figs) {
    const pz = Kit.piezas[fg.pieza || 'alg-losetas'], svg = pz.dibujar(fg.datos, fg.estado || {});
    assert.ok(!/var\(--c-[hd]\)/.test(svg), `${fg.pieza}: ${JSON.stringify(fg.datos).slice(0, 100)}`);
  }
  assert.ok(figs.length > 300);
});

test('ideas 2 a 6: la misión la cumple un solo caso y no está cumplida al abrir', () => {
  for (const i of RESTO) {
    const j = i.juega, g = Teoria.grilla(j.controles), si = g.filter(v => j.mision.logrado(v));
    assert.equal(si.length, 1, `${i.id}: ${JSON.stringify(si)}`);
    assert.ok(!j.mision.logrado(Teoria.inicio(j)), `${i.id}: cumplida al abrir`);
  }
});

test('ideas 2 a 6: cada una estrena sus palabras, con simple y tres ejemplos', () => {
  const porIdea = Glosario.porIdea(def).map(l => l.map(g => g.termino).sort());
  assert.deepEqual(porIdea.slice(1), [['evaluar', 'valor numérico', 'variable'], ['grado', 'grado absoluto', 'grado relativo'],
    ['completo', 'homogéneo', 'ordenado'], ['idénticamente nulo', 'idéntico'], ['monomio', 'producto de polinomios']]);
  for (const g of def.glosario) assert.ok(g.simple && Array.isArray(g.ejemplos) && g.ejemplos.length >= 3, g.termino);
});

// Lo que respondería cada Predice si apareciera antes de ella (en Lee, el juego, su misión, su leyenda o el glosario de la idea).
const DELATA_I = {
  'valor-numerico': /(^|[^\d])9 dm²|suma de (los )?coeficientes|P\(1\)/,
  grados: /el mayor de|GA = 4|grado absoluto es/,
  'completo-ordenado': /6 términos|n \+ 1|seis casillas|6 casillas/,
  igualdad: /no basta|un (solo )?valor|cualquier loseta/,
  operaciones: /se suman|suma de los grados|x⁵|grado 5/,
};
test('ideas 2 a 6: nada antes de Predice la responde (Lee, juego, misión, leyenda y glosario de la idea)', () => {
  const glo = Glosario.porIdea(def);
  RESTO.forEach((i, k) => {
    const re = DELATA_I[i.id], j = i.juega;
    const antes = [...i.lee.tarjetas.map(t => plano([t.titulo, ' ', t.texto, ' ', t.ecuacion || ''])), plano(j.consigna), plano(j.mision.texto), j.mision.bien, j.voz,
      plano(j.leyenda.map(l => [l.s, ' ', l.t, ' '])), ...glo[k + 1].map(g => [g.def, g.simple, ...g.ejemplos].join(' '))];
    for (const t of antes) assert.ok(!re.test(t), `${i.id}: «${t}»`);
    for (const v of Teoria.grilla(j.controles)) assert.ok(!re.test(plano(j.lectura(v))) || i.id === 'operaciones', `${i.id}: ${plano(j.lectura(v))}`);
    // Predice: los distractores tienen tres códigos distintos y ninguno es el de la correcta.
    const malas = i.predice.opciones.filter(o => !o.correcta);
    assert.equal(new Set(malas.map(o => o.error)).size, malas.length, `${i.id}: código repetido en Predice`);
  });
  // El juego de la idea 6 multiplica grado 1 por grado 1: nunca muestra un grado 5.
  for (const v of Teoria.grilla(def.ideas[5].juega.controles)) assert.ok(!/x⁵|x³/.test(plano(def.ideas[5].juega.lectura(v))));
});

test('ideas 2 a 6: «Ahora tú» trae cuatro opciones distintas en 400 semillas, sus datos y un código por distractor', () => {
  for (const i of RESTO) {
    const preguntas = new Set();
    for (let s = 0; s < SEMILLAS; s++) {
      const a = i.ahoraTu.generar(s), q = plano(a.pregunta), ops = a.opciones.map(o => plano(o.texto));
      preguntas.add(q);
      assert.ok(ops.length >= 4 && new Set(ops).size === ops.length, `${i.id} ${s}: ${q}: ${ops.join(' ; ')}`);
      assert.equal(a.opciones.filter(o => o.correcta).length, 1);
      assert.ok(Array.isArray(a.datos) && a.datos.length >= 1, `${i.id}: ${q}: sin datos`);
      const malas = a.opciones.filter(o => !o.correcta);
      assert.ok(malas.every(o => o.error && o.siFuera), q);
      assert.equal(new Set(malas.map(o => o.error)).size, malas.length, `${i.id}: ${q}: código repetido`);
      assert.ok(!/NaN|undefined|Infinity|-\d/.test(q + ops.join(' ')), `${i.id}: ${q}: ${ops}`);
      const bien = plano(a.opciones.find(o => o.correcta).texto);
      assert.ok(plano(a.solucion.ecuacion).endsWith(bien), `${i.id}: ${q}: la solución no llega a ${bien}`);
    }
    assert.ok(preguntas.size >= 200, `${i.id}: casos distintos ${preguntas.size}`);
  }
});

test('ideas 2 a 6: los 15 ejemplos suben de nivel; en el nivel 3, la letra correcta es la de su valor y cada trampa se explica', () => {
  const letras = [];
  for (const i of RESTO) {
    assert.deepEqual(i.ejemplos.map(e => e.nivel), [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3], i.id);
    assert.equal(new Set(i.ejemplos.map(e => e.titulo)).size, 15, `${i.id}: títulos repetidos`);
    i.ejemplos.forEach((e, k) => {
      assert.ok(Array.isArray(e.datos) && e.datos.length >= 1, `${i.id} ejemplo ${k + 1}: sin datos`);
      assert.ok(fichas(e.respuesta).some(f => f.m === 'resultado'), `${i.id} ejemplo ${k + 1}: la respuesta lleva el color del resultado`);
      if (e.nivel < 3) { assert.equal(e.alternativas, undefined); return; }
      const resp = plano(e.respuesta), L = resp[0], sol = e.solucion.map(x => plano(x.texto)).join(' ');
      assert.match(resp, /^[A-E], /); assert.ok(e.respuesta[0].negrita, 'la letra, en negrita y en tinta');
      assert.equal(e.alternativas.length, 5); assert.equal(new Set(e.alternativas).size, 5);
      const valor = resp.replace(/^[A-E], (grado |b = )?/, '');
      assert.ok(e.alternativas['ABCDE'.indexOf(L)].replace(/^grado /, '') === valor || e.alternativas['ABCDE'.indexOf(L)] === valor.replace(/ valores$/, ''), `${i.id} ejemplo ${k + 1}: «${valor}» no es la ${L}`);
      for (const o of 'ABCDE'.replace(L, '')) assert.ok(new RegExp(`(La|la) ${o}\\b`).test(sol), `${i.id} ejemplo ${k + 1}: no explica la ${o}`);
      letras.push(L);
      // Una figura de un ejemplo no escribe la respuesta.
      if (e.figura) { const pz = Kit.piezas[e.figura.pieza || 'alg-losetas']; assert.ok(!pz.dibujar(e.figura.datos, e.figura.estado || {}).includes(`>${valor}<`), `${i.id} ejemplo ${k + 1}: la figura muestra ${valor}`); }
    });
  }
  // Con los de la idea 1, las letras correctas se reparten: ninguna pasa del 40 % y ninguna falta.
  const todas = [...letras, ...I1.ejemplos.filter(e => e.nivel === 3).map(e => plano(e.respuesta)[0])];
  for (const L of 'ABCDE') { const n = todas.filter(x => x === L).length; assert.ok(n >= 1 && n / todas.length <= 0.4, `${L}: ${n} de ${todas.length}`); }
});

test('la unidad entera pasaría el validador con calidad 2 (formato y reglas de nucleo/teoria-reglas.js)', () => {
  const q = Teoria.problemas(Object.assign({}, def, { calidad: 2 }), { semillas: 60 });
  assert.deepEqual(q, [], q.join('\n'));
  assert.deepEqual(Teoria.pendientes(Object.assign({}, def, { calidad: 2 })), [], 'una unidad nueva no agrega excepciones');
});
