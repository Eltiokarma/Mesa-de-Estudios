// Pruebas propias de «Ecuaciones polinomiales» (además del validador común de contenido/teoria/teoria.test.js). Etapa 8
// (19 nov 2026; docs/etapa8/propuesta-algebra.md): seis ideas reescritas contra el contrato, con calidad: 2 desde el
// cierre (lector en frío y auditor); la primera prueba corre el validador con esa marca.
// Lo que se comprueba aquí:
//   - el orden de las ideas y los ids publicados (los seis de la versión anterior se conservan);
//   - un color fijo por magnitud (cabecera): cada ficha de color dice su magnitud (m) y lleva el color de def.colores;
//     nunca carmín ni verde, tampoco en las figuras;
//   - cada misión: no está cumplida al abrir y la cumple un solo caso de su grilla (en la caja, una sola caja: las
//     permutaciones de sus tres aristas);
//   - nada antes de Predice trae la respuesta de su predicción (Lee, consigna, misión, leyenda y el glosario de la idea);
//   - «Ahora tú» en 400 semillas por idea: cuatro opciones distintas, una sola correcta, sin texto roto ni signos de
//     teclado; y la correcta rehecha aquí por otro camino (raíces numéricas con Durand-Kerner, evaluación con fracciones
//     y números con √ o i): vale lo que se pide y ningún distractor lo vale;
//   - toda igualdad entre polinomios en x escrita en ecuaciones (Lee, Mira, regla, ejemplos, «Así se resuelve»,
//     soluciones) es cierta: un evaluador propio la mira en varios valores de x;
//   - los ejemplos de nivel 3: cinco alternativas distintas, la letra de la respuesta es la de la alternativa con su
//     valor, y las letras se reparten (una vez cada una por idea);
//   - no se adelanta «Números complejos» (ni módulo, ni plano complejo, ni forma polar, ni De Moivre).
// Las cuentas de los 90 ejemplos y de «Ahora tú» se rehicieron además con sympy, sin el código de la unidad (scratchpad
// de la sesión, e8-algebra/scripts/cuentas.py y cuentas-ejemplos.py).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../../../nucleo/kit/kit.js');
const Teoria = require('../../../nucleo/teoria.js');
const Glosario = require('../../../nucleo/glosario.js');
const def = require('./ecuaciones-polinomiales.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const cat = require('../../../catalogo/cursos/algebra.json');
const E = require('../../../nucleo/ecuacion.js');
const limpia = x => (Array.isArray(x) ? x.filter(y => y !== undefined && y !== null).map(limpia) : x);
const plano = x => E.texto(x === undefined || x === null ? '' : limpia(x)).replace(/⁠/g, '');
const fichas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(fichas)
  : typeof x.v === 'string' && /^c-/.test(x.v) ? [x] : Object.values(x).flatMap(fichas));
const SEMILLAS = 400;
const IDS = ['grado-raices', 'viete', 'raices-racionales', 'conjugadas', 'cambio-de-variable', 'binomica'];
const idea = id => def.ideas.find(i => i.id === id);

// ---------- Números complejos mínimos y el valor de un texto ----------
const C = (re, im = 0) => ({ re, im });
const sum = (a, b) => C(a.re + b.re, a.im + b.im), res = (a, b) => C(a.re - b.re, a.im - b.im);
const mul = (a, b) => C(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
const div = (a, b) => { const d = b.re * b.re + b.im * b.im; return C((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d); };
const cerca = (a, b, tol = 1e-6) => Math.abs(a.re - b.re) < tol * Math.max(1, Math.abs(b.re)) && Math.abs(a.im - b.im) < tol * Math.max(1, Math.abs(b.im));
const SUP = { '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9 };
// Valor de una expresión como la ve el alumno: enteros (miles con espacio), x, i, √n, potencias, «·», «/», paréntesis
// y producto implícito. Devuelve un complejo o null si no la entiende.
function valor(texto, x) {
  texto = texto.replace(/(\d)[  ](?=\d{3}(?!\d))/g, '$1');
  const t = [];
  for (let k = 0; k < texto.length;) {
    const c = texto[k];
    if (/\s/.test(c)) { k++; continue; }
    if (/[0-9]/.test(c)) { let j = k; while (j < texto.length && /[0-9]/.test(texto[j])) j++; t.push(['n', +texto.slice(k, j)]); k = j; continue; }
    if (c in SUP) { let v = 0; while (k < texto.length && texto[k] in SUP) v = v * 10 + SUP[texto[k++]]; t.push(['^', v]); continue; }
    if (c === 'x' && x !== undefined) { t.push(['v', 'x']); k++; continue; }
    if (c === 'i') { t.push(['v', 'i']); k++; continue; }
    if (c === '√') { t.push(['r', '√']); k++; continue; }
    if ('+−·/()'.includes(c)) { t.push([c, c]); k++; continue; }
    return null;
  }
  let k = 0;
  const ver = () => (k < t.length ? t[k][0] : null);
  const factor = () => {
    const a = ver(); let b;
    if (a === 'n') b = C(t[k++][1]);
    else if (a === 'v') { b = t[k++][1] === 'x' ? x : C(0, 1); }
    else if (a === 'r') { k++; if (ver() !== 'n') throw new Error('√'); b = C(Math.sqrt(t[k++][1])); }
    else if (a === '(') { k++; b = expr(); if (ver() !== ')') throw new Error(')'); k++; } else throw new Error('factor');
    if (ver() === '^') { const e = t[k++][1]; let p = C(1); for (let j = 0; j < e; j++) p = mul(p, b); b = p; }
    return b;
  };
  const junto = () => { let v = factor(); while (['n', 'v', 'r', '('].includes(ver())) v = mul(v, factor()); return v; };
  const term = () => {
    let neg = false; if (ver() === '−') { k++; neg = true; }
    let v = junto();
    for (;;) { const a = ver(); if (a === '·') { k++; v = mul(v, junto()); } else if (a === '/') { k++; v = div(v, junto()); } else break; }
    return neg ? C(-v.re, -v.im) : v;
  };
  function expr() { let v = term(); while (ver() === '+' || ver() === '−') { const op = t[k++][0], w = term(); v = op === '+' ? sum(v, w) : res(v, w); } return v; }
  try { const v = expr(); return k === t.length ? v : null; } catch (e) { return null; }
}
const num = s => valor(String(s).replace(/ (soles|dm)$/, ''));
// Coeficientes de un polinomio en x escrito como texto (por interpolación en 0..n).
function coefs(texto, n) {
  const ys = []; for (let j = 0; j <= n; j++) { const v = valor(texto, C(j)); if (!v) return null; ys.push(v.re); }
  // Vandermonde, por eliminación
  const A = []; for (let j = 0; j <= n; j++) { const fila = []; for (let q = n; q >= 0; q--) fila.push(j ** q); fila.push(ys[j]); A.push(fila); }
  for (let c = 0; c <= n; c++) { let p = c; while (Math.abs(A[p][c]) < 1e-12) p++; [A[c], A[p]] = [A[p], A[c]]; for (let r = 0; r <= n; r++) if (r !== c) { const m = A[r][c] / A[c][c]; for (let q = c; q <= n + 1; q++) A[r][q] -= m * A[c][q]; } }
  return A.map((fila, c) => Math.round(fila[n + 1] / fila[c] * 1e6) / 1e6);
}
// Raíces de un polinomio con coeficientes reales (Durand-Kerner).
function raices(cs) {
  const n = cs.length - 1, a = cs.map(c => c / cs[0]);
  let z = Array.from({ length: n }, (_, k) => { let p = C(1); for (let j = 0; j <= k; j++) p = mul(p, C(0.4, 0.9)); return p; });
  const P = w => a.reduce((acc, c) => sum(mul(acc, w), C(c)), C(0));
  for (let it = 0; it < 800; it++) z = z.map((w, k) => { let d = C(1); z.forEach((u, j) => { if (j !== k) d = mul(d, res(w, u)); }); return res(w, div(P(w), d)); });
  return z;
}
// Raíces enteras con su repetición (división sintética exacta); si no alcanzan el grado, Durand-Kerner.
function raicesExactas(cs) {
  let q = cs.map(c => Math.round(c)); const out = [];
  for (let r = -30; r <= 30 && q.length > 1; r++) {
    for (;;) { const b = []; q.forEach((c, k) => b.push(k ? c + r * b[k - 1] : c)); if (b[b.length - 1] !== 0 || q.length < 2) break; out.push(C(r)); q = b.slice(0, -1); if (q.length < 2) break; }
  }
  return q.length > 1 ? out.concat(raices(q)) : out;
}
const reales = zs => zs.filter(w => Math.abs(w.im) < 1e-5);
const distintasR = zs => { const r = reales(zs).map(w => w.re).sort((p, q) => p - q), o = []; for (const v of r) if (!o.length || Math.abs(v - o[o.length - 1]) > 1e-4) o.push(v); return o; };

// ---------- Recorridos ----------
function textosAntesDePredice(i) {
  const g = Glosario.porIdea(def)[def.ideas.indexOf(i)] || [];
  return [...i.lee.tarjetas.flatMap(t => [t.titulo, t.texto, t.ecuacion]), i.juega.consigna, i.juega.mision.texto, i.juega.mision.bien,
    ...(i.juega.leyenda || []).flatMap(l => [l.s, l.t]), ...g.flatMap(e => [e.def, e.simple, ...(e.ejemplos || [])]), i.titulo, i.pregunta].map(plano).join(' · ');
}

test('lleva calidad 2 y el validador no encuentra nada (60 semillas)', () => {
  assert.equal(def.calidad, 2, 'cerrada el 20 nov tras el lector en frío y el auditor');
  const u = cat.unidades.find(x => x.id === def.unidad);
  const p = Teoria.problemas(Object.assign({}, def, { calidad: 2 }), { temas: u.temas, semillas: 60 });
  assert.deepEqual(p, [], p.join('\n'));
});

test('las seis ideas, en orden y con sus ids publicados', () => {
  assert.deepEqual(def.ideas.map(i => i.id), IDS);
  for (const i of def.ideas) assert.equal(i.ejemplos.length, 15);
});

test('un color fijo por magnitud; ni carmín ni verde (fichas y figuras)', () => {
  const todo = [def.ideas, def.glosario, def.laboratorio.map(m => m.controles)];
  for (const i of def.ideas) for (let s = 0; s < 40; s++) todo.push(i.ahoraTu.generar(s), i.resuelve.generar(s));
  for (const fi of fichas(todo)) {
    assert.ok(!/c-[hd]$/.test(fi.v), `ficha en carmín o verde: ${JSON.stringify(fi)}`);
    if (fi.m) assert.equal(fi.v, `c-${def.colores[fi.m]}`, `la magnitud «${fi.m}» va en ${def.colores[fi.m]}: ${fi.t}`);
  }
  const figs = [];
  const add = fg => { if (fg && fg.datos) figs.push(fg); };
  for (const i of def.ideas) {
    i.lee.tarjetas.forEach(t => add(t.dibujo && Object.assign({ pieza: t.pieza }, t.dibujo)));
    for (const v of Teoria.grilla(i.juega.controles)) add(Object.assign({ pieza: i.juega.pieza || i.pieza }, i.juega.dibujo(v)));
    add(Object.assign({ pieza: i.pieza }, i.predice.dibujo)); add(Object.assign({ pieza: i.pieza }, i.predice.revelar));
    if (i.regla.dibujo) add(i.regla.dibujo);
    i.ejemplos.forEach(e => add(e.figura));
    for (let s = 0; s < 12; s++) { const r = i.resuelve.generar(s); add(r.dibujo); r.pasos.forEach(p => add(p.dibujo)); }
  }
  for (const fg of figs) {
    const svg = Kit.piezas[fg.pieza].dibujar(fg.datos, fg.estado || {});
    assert.ok(!/var\(--c-[hd]\)/.test(svg), `figura con carmín o verde: ${fg.pieza} ${JSON.stringify(fg.datos).slice(0, 120)}`);
    assert.ok(!/NaN|undefined|Infinity/.test(svg), `figura rota: ${fg.pieza}`);
  }
  assert.ok(figs.length > 300, `figuras revisadas: ${figs.length}`);
});

test('cada misión: no está cumplida al abrir y la cumple un solo caso (una sola caja en la idea 2)', () => {
  for (const i of def.ideas) {
    const m = i.juega.mision, v0 = Teoria.inicio(i.juega);
    assert.ok(!m.logrado(v0), `${i.id}: cumplida al abrir`);
    const ok = Teoria.grilla(i.juega.controles).filter(v => m.logrado(v));
    if (i.id === 'viete') assert.deepEqual([...new Set(ok.map(v => [v.l, v.w, v.h].sort().join()))], ['2,3,4']);
    else if (i.id === 'cambio-de-variable') assert.deepEqual([...new Set(ok.map(v => [v.u1, v.u2].sort((p, q) => p - q).join()))], ['4,9']);
    else assert.equal(ok.length, 1, `${i.id}: ${ok.length} casos cumplen la misión`);
  }
});

test('nada antes de Predice trae su respuesta (Lee, juego, misión, leyenda, glosario de la idea)', () => {
  for (const i of def.ideas) {
    const resp = plano(i.predice.opciones.find(o => o.correcta).texto);
    if (resp.length < 2) continue;   // una cifra la mira el auditor
    const antes = textosAntesDePredice(i);
    assert.ok(!new RegExp(`(^|[^0-9/√i])${resp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^0-9/√i])`).test(antes), `${i.id}: «${resp}» aparece antes de Predice`);
  }
});

test('no se adelanta «Números complejos»: ni módulo, ni plano complejo, ni forma polar', () => {
  const todo = def.ideas.map(i => [i.lee.tarjetas.map(t => [t.texto, t.ecuacion]), i.juega.consigna, i.mira.pasos.map(p => [p.texto, p.ecuacion]), i.regla.texto, i.regla.condicion,
    i.ejemplos.map(e => [e.enunciado, e.datos, e.solucion.map(x => [x.texto, x.ecuacion]), e.respuesta])].map(plano).join(' ')).join(' ');
  assert.ok(!/módulo|plano complejo|forma polar|Moivre|argumento/i.test(todo));
});

// Comprueba un caso de «Ahora tú» por otro camino. Devuelve true si lo pudo comprobar.
function comprobar(id, c) {
  const q = plano(c.pregunta), ops = c.opciones.map(o => ({ t: plano(o.texto), ok: !!o.correcta })), bien = ops.find(o => o.ok).t, otras = ops.filter(o => !o.ok).map(o => o.t);
  const soloUno = (esperado, igual) => { assert.ok(igual(bien, esperado), `${id}: «${q}» correcta ${bien}, debía ${JSON.stringify(esperado)}`); for (const o of otras) assert.ok(!igual(o, esperado), `${id}: «${q}» el distractor ${o} también vale`); return true; };
  const igualNum = (t, v) => { const w = num(t); return !!w && cerca(w, typeof v === 'number' ? C(v) : v); };
  let m;
  // P factorizado con raíces enteras y un x² + c: el grado es el número de raíces; las reales distintas son los enteros
  // que lo anulan (evaluación exacta), porque x² + c no se anula con x real.
  if ((m = q.match(/^P\(x\) = (.+)\. ¿Cuántas raíces tiene P/))) { const cs = coefs(m[1], 8); return soloUno(cs.length - 1 - cs.findIndex(v => Math.abs(v) > 1e-3), igualNum); }
  if ((m = q.match(/^P\(x\) = (.+)\. ¿Cuántas raíces reales distintas/))) { let n = 0; for (let r = -20; r <= 20; r++) if (cerca(valor(m[1], C(r)), C(0), 1e-12)) n++; return soloUno(n, igualNum); }
  if ((m = q.match(/^¿Cuántas raíces no reales tiene (.+) = 0\?$/))) { const cs = coefs(m[1], 3); const z = raices(cs); return soloUno(z.length - reales(z).length, igualNum); }
  if ((m = q.match(/^P\(x\) = \((.+)\)³\(x − k\) tiene la raíz triple (.+) y su término independiente es (.+)\. /))) { const a = num(m[2]).re, d = num(m[3]).re; return soloUno(d / a ** 3, igualNum); }
  if ((m = q.match(/raíces de (.+) = 0\?$/)) && /suman las tres|producto de las tres/.test(q)) { const z = raicesExactas(coefs(m[1], 3)); return soloUno(/suman/.test(q) ? z.reduce(sum, C(0)) : z.reduce(mul, C(1)), igualNum); }
  if ((m = q.match(/raíces de (.+) = 0\. ¿Cuánto vale 1\/x₁/))) { const z = raicesExactas(coefs(m[1], 3)); return soloUno(z.map(w => div(C(1), w)).reduce(sum, C(0)), igualNum); }
  if ((m = q.match(/^La ecuación (.+) = 0 tiene las raíces (.+) y (.+)\. ¿Cuánto vale k\?$/))) {
    const r1 = num(m[2]).re, P0 = valor(m[1].replace('kx', '0x'), C(r1)).re, k = -P0 / r1;
    const P = m[1].replace('kx', `${k < 0 ? '(−' + -k + ')' : k}x`);
    assert.ok(cerca(valor(P, C(num(m[3]).re)), C(0)), `${id}: k no sirve para las dos raíces`);
    return soloUno(k, igualNum);
  }
  if ((m = q.match(/coeficiente principal (\d+) y término independiente (−?\d+)\./))) {
    const L = +m[1], Cc = Math.abs(+m[2].replace('−', '-'));
    const puede = t => { const [p, d = '1'] = t.replace('−', '').split('/'); return Cc % +p === 0 && L % +d === 0; };
    assert.ok(!puede(bien), `${id}: ${bien} sí puede`); for (const o of otras) assert.ok(puede(o), `${id}: ${o} tampoco puede`); return true;
  }
  if ((m = q.match(/^¿Cuántos candidatos a raíz racional tiene (.+) = 0\?$/))) {
    const cs = coefs(m[1], 3), L = Math.abs(cs[0]), Cc = Math.abs(cs[3]), vistos = new Set();
    for (let p = 1; p <= Cc; p++) for (let d = 1; d <= L; d++) if (Cc % p === 0 && L % d === 0) for (const sg of [1, -1]) vistos.add(String(sg * p / d));
    return soloUno(vistos.size, igualNum);
  }
  if ((m = q.match(/^x = (.+) es raíz de (.+) = 0\. ¿Cuáles son las otras dos/))) {
    const P = m[2], anula = t => cerca(valor(P, num(t)), C(0), 1e-9);
    assert.ok(anula(m[1]), `${id}: la dada no anula`);
    assert.ok(bien.split(' y ').every(anula), `${id}: ${bien} no son raíces`);
    for (const o of otras) assert.ok(!o.split(' y ').every(t => anula(t) && t !== m[1]), `${id}: ${o} también son raíces`);
    return true;
  }
  if ((m = q.match(/\(x \+ (\d+)\) dm de ancho y \(x \+ (\d+)\) dm de alto, y guarda (.+) dm³/))) {
    const a = +m[1], b = +m[2], V = num(m[3]).re; let x0 = null;
    for (let x = 1; x < 30; x++) if (x * (x + a) * (x + b) === V) x0 = x;
    return soloUno(x0 + Math.max(a, b), igualNum);
  }
  if ((m = q.match(/^(.+) es raíz de un polinomio con coeficientes enteros\. ¿Cuál/))) {
    const z = num(m[1]);
    const entero = w => { const s1 = sum(z, w), p1 = mul(z, w); return Math.abs(s1.im) < 1e-9 && Math.abs(p1.im) < 1e-9 && Math.abs(s1.re - Math.round(s1.re)) < 1e-9 && Math.abs(p1.re - Math.round(p1.re)) < 1e-9; };
    assert.ok(entero(num(bien)), `${id}: ${bien} no da coeficientes enteros`);
    for (const o of otras) assert.ok(!entero(num(o)), `${id}: ${o} también da coeficientes enteros`); return true;
  }
  if ((m = q.match(/^(.+) es raíz de P, que tiene coeficientes enteros\. ¿Qué factor/))) {
    const z = num(m[1]), fac = t => [valor(t, C(0)), valor(t, C(1)), valor(t, C(2))];
    const anula = t => cerca(valor(t, z), C(0), 1e-9);
    assert.ok(anula(bien), `${id}: ${bien} no se anula en ${m[1]}`); for (const o of otras) assert.ok(!anula(o), `${id}: ${o} también`); return true;
  }
  if (/menor grado/.test(q)) { const l = q.match(/entre sus raíces, (.+)\. ¿Cuál/)[1].replace(' y ', ', ').split(', '); return soloUno(l.reduce((a, t) => a + (/[√i]/.test(t) ? 2 : 1), 0), igualNum); }
  if ((m = q.match(/^La ecuación x³ \+ bx² \+ cx ([+−]) (\d+) = 0, con b y c enteros, tiene la raíz (.+)\. ¿Cuál/))) {
    const d = (m[1] === '+' ? 1 : -1) * +m[2], z = num(m[3]); return soloUno(-d / mul(z, C(z.re, -z.im)).re, igualNum);
  }
  if ((m = q.match(/^¿Cuántas raíces reales tiene (x⁴.+) = 0\?$/))) return soloUno(reales(raices(coefs(m[1], 4))).length, igualNum);
  if ((m = q.match(/^¿Cuál es la mayor raíz de (.+) = 0\?$/))) return soloUno(Math.max(...reales(raices(coefs(m[1], 4))).map(w => w.re)), igualNum);
  if ((m = q.match(/^En (.+) = 0 se divide entre x² y se cambia x \+ 1\/x por t\./))) {
    const cs = coefs(m[1], 4), vale = t => { const e = coefs(t.replace(' = 0', '').replace(/t/g, 'x'), 2); return e && e[0] === 1 && e[1] === cs[1] && e[2] === cs[2] - 2; };
    assert.ok(vale(bien), `${id}: ${bien}`); for (const o of otras) assert.ok(!vale(o), `${id}: ${o} también`); return true;
  }
  if ((m = q.match(/cumple (.+) = 0\. ¿Cuánto es la diferencia/))) { const r = reales(raices(coefs(m[1], 4))).map(w => w.re).filter(v => v > 0); return soloUno(Math.max(...r) - Math.min(...r), igualNum); }
  if ((m = q.match(/raíces (reales|no reales) tiene x([⁰¹²³⁴⁵⁶⁷⁸⁹]+) = (.+)\?$/))) {
    const n = SUP[m[2]], c = num(m[3]).re, cs = [1, ...Array(n - 1).fill(0), -c], z = raices(cs);
    return soloUno(m[1] === 'reales' ? reales(z).length : z.length - reales(z).length, igualNum);
  }
  if ((m = q.match(/producto de las dos raíces no reales de x³ = (.+)\?$/))) { const z = raices([1, 0, 0, -num(m[1]).re]).filter(w => Math.abs(w.im) > 1e-5); return soloUno(mul(z[0], z[1]), igualNum); }
  if ((m = q.match(/producto de las cuatro raíces de x⁴ = (.+), contando/))) return soloUno(raices([1, 0, 0, 0, -num(m[1]).re]).reduce(mul, C(1)), igualNum);
  return false;
}

test('«Ahora tú» en 400 semillas: cuatro opciones, una correcta, sin texto roto, y la correcta rehecha por otro camino', () => {
  let comprobados = 0;
  for (const i of def.ideas) {
    for (let s = 0; s < SEMILLAS; s++) {
      const c = i.ahoraTu.generar(s), t = [c.pregunta, c.datos, c.opciones.map(o => [o.texto, o.siFuera]), c.solucion.texto, c.solucion.ecuacion].map(plano).join(' ');
      assert.equal(c.opciones.length, 4, `${i.id} ${s}`);
      assert.equal(new Set(c.opciones.map(o => plano(o.texto))).size, 4, `${i.id} ${s}: opciones repetidas`);
      assert.equal(c.opciones.filter(o => o.correcta).length, 1);
      assert.ok(!/NaN|undefined|Infinity|\[object|\+ -|− −|· -|\+ −\d|= -/.test(t), `${i.id} ${s}: texto roto o signo de teclado: ${t.slice(0, 200)}`);
      try { if (comprobar(i.id, c)) comprobados++; } catch (e) { throw new Error(`${i.id} ${s} «${plano(c.pregunta)}»: ${e.message}`); }
    }
  }
  assert.equal(comprobados, SEMILLAS * def.ideas.length, `comprobados ${comprobados}`);
});

// Igualdades entre polinomios en x: «A = B» con solo x, números, √, i y operaciones; se evalúan en varios x.
function igualdadesDe(partes) {
  const t = plano(partes);
  const out = [];
  for (const trozo of t.split(/;|  ⇒  |: (?=[^:]*=)/)) {
    if (/[A-Z]\(/.test(trozo)) continue;   // P(x) = …: el nombre de un polinomio, no una identidad
    const lados = trozo.split(' = ').map(s => s.trim().replace(/^[^0-9x(−√]+/, '').replace(/[.,:]$/, ''));
    if (lados.length < 2 || !lados.every(l => /x/.test(l))) continue;   // «… = 0» o «x = 3» son ecuaciones, no identidades
    if (lados.some(l => /[a-hj-wyzA-Z₀-₉]/.test(l) || l === '')) continue;
    out.push(lados);
  }
  return out;
}
test('toda igualdad entre polinomios en x que se lee es cierta', () => {
  let n = 0;
  const revisar = (partes, donde) => {
    for (const lados of igualdadesDe(partes)) {
      const vals = [C(2), C(-3), C(0.5), C(7)].map(x => lados.map(l => valor(l, x)));
      if (vals.some(vs => vs.some(v => v === null))) continue;
      for (const vs of vals) for (const v of vs.slice(1)) assert.ok(cerca(v, vs[0], 1e-9), `${donde}: «${lados.join(' = ')}»`);
      n++;
    }
  };
  for (const i of def.ideas) {
    i.lee.tarjetas.forEach((t, k) => { revisar(t.texto, `${i.id} Lee ${k + 1}`); revisar(t.ecuacion, `${i.id} Lee ${k + 1}`); });
    i.mira.pasos.forEach((p, k) => revisar(p.ecuacion, `${i.id} Mira ${k + 1}`));
    revisar(i.regla.ecuacion, `${i.id} regla`);
    i.ejemplos.forEach((e, k) => { revisar(e.enunciado, `${i.id} ejemplo ${k + 1}`); e.solucion.forEach(x => revisar(x.ecuacion, `${i.id} ejemplo ${k + 1}`)); });
    for (let s = 0; s < 60; s++) { i.resuelve.generar(s).pasos.forEach(p => revisar(p.ecuacion, `${i.id} resuelve ${s}`)); revisar(i.ahoraTu.generar(s).solucion.ecuacion, `${i.id} ahoraTu ${s}`); }
  }
  assert.ok(n > 150, `igualdades revisadas: ${n}`);
});

test('ejemplos de nivel 3: cinco alternativas, la letra de la respuesta es la suya y las letras se reparten', () => {
  for (const i of def.ideas) {
    const letras = [];
    for (const e of i.ejemplos.filter(x => x.nivel === 3)) {
      assert.equal(e.alternativas.length, 5); assert.equal(new Set(e.alternativas).size, 5);
      const L = e.respuesta[0].negrita.replace('⁠', ''), k = 'ABCDE'.indexOf(L);
      const val = plano(e.respuesta.slice(2)).replace(/^[a-zx]+ = /, '');
      assert.equal(e.alternativas[k].replace(/ = 0$/, ''), val.replace(/ = 0$/, ''), `${i.id} «${e.titulo}»: ${L} no es ${val}`);
      letras.push(L);
    }
    assert.deepEqual(letras.slice().sort(), ['A', 'B', 'C', 'D', 'E'], `${i.id}: ${letras}`);
  }
});

// ---------- Correcciones del 20 nov (cierre: auditoría y lectores en frío A y B) ----------
// Todas fallan con la versión anterior (copia en el scratchpad de la sesión, e8-cierre-ep/antes/).
const ejercicios = () => def.ideas.flatMap(i => [
  ...i.ejemplos.map(e => ({ donde: `${i.id} «${e.titulo}»`, datos: e.datos || [], texto: plano([e.enunciado, ...(e.alternativas || []), ...e.solucion.flatMap(s => [s.texto, s.ecuacion]), e.respuesta]) })),
  ...Array.from({ length: 80 }, (_, s) => { const a = i.ahoraTu.generar(s); return { donde: `${i.id} ahoraTu ${s}`, datos: a.datos || [], texto: plano([a.pregunta, ...a.opciones.map(o => o.texto), a.solucion.texto, a.solucion.ecuacion]) }; }),
  ...Array.from({ length: 40 }, (_, s) => { const c = i.resuelve.generar(s); return { donde: `${i.id} resuelve ${s}`, datos: c.datos || [], texto: plano([c.enunciado, ...c.pasos.flatMap(p => [p.texto, p.ecuacion]), c.respuesta]) }; }),
]);

test('bicuadradas: la recta es la de x; cada u es una cota turquesa entre sus dos raíces ±√u, nunca un punto del eje', () => {
  const i5 = idea('cambio-de-variable');
  const figuras = [...Teoria.grilla(i5.juega.controles).map(v => [v, i5.juega.dibujo(v).datos]), [{ u1: 1, u2: -4 }, i5.predice.revelar.datos], [{ u1: 1, u2: 9 }, i5.mira.datos]];
  for (const [v, d] of figuras) {
    const us = [v.u1, v.u2];
    for (const e of d.elementos) {
      if (e.tipo === 'punto') assert.ok(us.some(u => u >= 0 && Math.abs(e.x * e.x - u) < 1e-9) && e.color === 'f', `punto en ${e.x} con u = ${us}`);
      else { assert.equal(e.tipo, 'distancia'); assert.equal(e.color, 'i'); assert.ok(Math.abs(e.a + e.b) < 1e-9 && us.some(u => Math.abs(u - e.b * e.b) < 1e-9) && /^u = /.test(e.rotulo)); }
    }
    for (const u of us.filter(u => u < 0)) assert.ok(!d.elementos.some(e => (e.rotulo || '').includes(`u = ${Kit.formatear(u, 0)}`)), `u = ${u} no va en la recta de x`);
    // la lectura dice qué da cada u
    const l = plano(i5.juega.lectura({ u1: v.u1, u2: v.u2 }));
    for (const u of us) assert.ok(u < 0 ? l.includes(`u = ${Kit.formatear(u, 0)}: ninguna real`) : l.includes(`u = ${Kit.formatear(u, 0)} da`), l);
  }
});

test('«parte entera» no se usa para el número sin √ ni i (la parte entera de 2 + √3 es 3); ningún «1u» ni «−(10)»', () => {
  const todo = JSON.stringify(def.ideas.map(i => [i.lee, i.juega.consigna, i.juega.voz, i.predice, i.mira.pasos, i.regla, i.ejemplos])) + ejercicios().map(e => e.texto).join(' ');
  assert.ok(!/parte entera/.test(todo));
  assert.ok(!/[−+] 1[a-z]\b/.test(todo), '«1u»');
  assert.ok(!/−\(\d+\)/.test(todo), '«−(10)»: el menos va pegado si el número es positivo');
});

test('lo que viene de «Ecuaciones de primer y segundo grado» va como dato: Δ y la i, en todo ejercicio que los usa', () => {
  for (const e of ejercicios()) {
    if (/Δ/.test(e.texto)) assert.ok(e.datos.some(d => /Δ/.test(plano(d))), `${e.donde}: usa Δ sin el dato`);
    if (/(^|[\d\s(+−])i(?![\p{L}])/u.test(e.texto.replace(/√ (ni|o) i/g, ''))) assert.ok(e.datos.some(d => /i²/.test(plano(d))), `${e.donde}: escribe con i sin el dato i² = −1`);
  }
});

test('bicuadrada con los dos u negativos: ninguna explicación alaba un «u positivo» ni «raíces opuestas»', () => {
  const i5 = idea('cambio-de-variable');
  let vistos = 0;
  for (let s = 0; s < 4 * SEMILLAS; s += 4) {
    const a = i5.ahoraTu.generar(s), c = a.opciones.find(o => o.correcta);
    if (!/Cuántas raíces reales/.test(plano(a.pregunta)) || c.texto !== '0') continue;
    vistos++;
    for (const o of a.opciones) assert.ok(!/u positivo|raíces opuestas/.test(plano(o.siFuera || '')), plano(o.siFuera));
  }
  assert.ok(vistos > 5);
});

test('notas de los lectores: «Vale si» de la idea 1, Lee y consigna de la caja, juego de la caja, Mira con su tabla, voz de «Ahora tú»', () => {
  assert.match(idea('grado-raices').regla.condicion, /factor de grado 2/);
  const i2 = idea('viete');
  assert.ok(![plano(i2.lee.tarjetas[0].texto), plano(i2.juega.consigna)].some(t => /vale 0 (justo )?en (sus|las) tres aristas/.test(t)));
  const ini = Object.fromEntries(i2.juega.controles.map(c => [c.id, c.inicio])), rs = [ini.l, ini.w, ini.h];
  assert.notEqual(rs[0] + rs[1] + rs[2], rs[0] * rs[1] * rs[2], 'al abrir, la suma y el producto no valen lo mismo');
  assert.ok(i2.mira.datos.columnas[0] && i2.mira.datos.filas.every(f => !f[0].desde), 'Mira 2: la tabla dice qué fila es desde el principio');
  assert.ok(idea('raices-racionales').mira.datos.filas.every(f => !f[0].desde), 'Mira 3: los números de la tabla se ven desde el principio');
  assert.ok(!/−b\/a|c\/a|−d\/a/.test(i2.ahoraTu.voz), 'la voz no repite las tres fórmulas');
  assert.match(plano(idea('raices-racionales').juega.consigna), /arriba, divisores del 3; abajo, del 2/);
  assert.match(plano(idea('cambio-de-variable').regla.texto), /recíproca/);
});

test('ejemplos corregidos: la diagonal no trae √50 en los datos, la B de «Una pareja con √» da −2, el producto de grado 4 pide «… = 0», el pasadizo dibujado es el del enunciado', () => {
  const ej = t => def.ideas.flatMap(i => i.ejemplos).find(e => e.titulo === t);
  assert.ok(!ej('La diagonal de la caja').datos.some(d => /√50/.test(plano(d))));
  assert.match(plano(ej('Una pareja con √').solucion[2].texto), /b = −2/);
  for (const e of def.ideas.flatMap(i => i.ejemplos)) for (const d of e.datos || []) if (/grado 4/.test(plano(d))) assert.match(plano(d), /= 0/);
  const p = ej('El largo del pasadizo');
  assert.deepEqual(p.figura.datos.largo, [1, 1]); assert.match(plano(p.enunciado), /\(x \+ 1\) dm de largo/);
});

test('«Así se resuelve» de la idea 1: escala fija de ±40, los rótulos del eje y caben', () => {
  for (let s = 0; s < 50; s++) { const d = idea('grado-raices').resuelve.generar(s).dibujo.datos; assert.equal(d.y.max, 40); assert.equal(d.y.min, -40); }
});
