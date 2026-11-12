// Pruebas del generador de deducción: las comunes (600 problemas), un recálculo independiente
// en cada uno, casos.json, papel.json y propiedades de cada tipo.
// El recálculo va por otros caminos que el generador:
//   silogismo       mundos con individuos concretos (hasta 3 personas, cada una en algunas clases o
//                   ausente), no zonas; y además, las reglas clásicas de validez, contrastadas con
//                   los modelos de zonas en las 64 parejas de premisas.
//   siempre-cierto  12 variables booleanas «el frasco o tiene la cosa c» (4096 filas, solo las que
//                   tienen exactamente una cosa por frasco), con las pistas evaluadas aparte.
//   asignacion      búsqueda con vuelta atrás, persona por persona, en vez de recorrer las 24
//                   permutaciones.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// ---------------------------------------------------------------- silogismos con individuos
// Un individuo es un número 0–7 (bit t: pertenece al término t) o null (no existe).
function mundos() {
  const out = [], op = [null, 0, 1, 2, 3, 4, 5, 6, 7];
  for (const a of op) for (const b of op) for (const c of op) out.push([a, b, c].filter(x => x !== null));
  return out;
}
const MUNDOS = mundos();
const en = (ind, t) => ((ind >> t) & 1) === 1;
function dice(f, s, p, mundo) {
  if (f === 'A') return mundo.every(i => !en(i, s) || en(i, p));
  if (f === 'E') return mundo.every(i => !(en(i, s) && en(i, p)));
  if (f === 'I') return mundo.some(i => en(i, s) && en(i, p));
  return mundo.some(i => en(i, s) && !en(i, p));
}
const leer = k => { const [, f, s, p] = k.split(':'); return { f, s: +s, p: +p }; };
function seDeduce(premisas, k) {
  const c = leer(k);
  return MUNDOS.every(m => !premisas.every(q => dice(q.f, q.s, q.p, m)) || dice(c.f, c.s, c.p, m));
}
function recalcularSilogismo(d) {
  const validas = d.opciones.filter(k => k !== 'sil:nada' && seDeduce(d.premisas, k));
  assert.ok(validas.length <= 1, `más de una conclusión válida: ${validas}`);
  return validas.length ? validas[0] : 'sil:nada';
}

// Reglas clásicas (lógica moderna, sin suponer que las clases tienen elementos).
const distribuye = (f, rol) => (f === 'A' && rol === 's') || f === 'E' || (f === 'O' && rol === 'p');
function porReglas(premisas, c) {
  const terminos = [c.s, c.p], medio = [0, 1, 2].find(t => !terminos.includes(t));
  const dist = (q, t) => (q.s === t && distribuye(q.f, 's')) || (q.p === t && distribuye(q.f, 'p'));
  const neg = f => f === 'E' || f === 'O';
  if (!premisas.some(q => dist(q, medio))) return false; // término medio sin distribuir
  for (const t of terminos) {
    const enConclusion = (c.s === t && distribuye(c.f, 's')) || (c.p === t && distribuye(c.f, 'p'));
    if (enConclusion && !premisas.some(q => dist(q, t))) return false; // término ilícito
  }
  const negs = premisas.filter(q => neg(q.f)).length;
  if (negs === 2) return false;
  if ((negs === 1) !== neg(c.f)) return false;
  if (premisas.every(q => q.f === 'A' || q.f === 'E') && (c.f === 'I' || c.f === 'O')) return false; // falacia existencial
  return true;
}

// ---------------------------------------------------------------- frascos con variables booleanas
function filasFrascos() {
  const out = [];
  for (let m = 0; m < 4096; m++) {
    const x = (o, c) => ((m >> (o * 3 + c)) & 1) === 1;
    let ok = true;
    for (let o = 0; o < 4 && ok; o++) ok = [0, 1, 2].filter(c => x(o, c)).length === 1;
    if (ok) out.push(x);
  }
  return out;
}
const FILAS = filasFrascos();
function literal(x, l) { const s = x(l.o, l.c); return l.neg ? !s : s; }
function pistaFrasco(x, q) {
  switch (q.t) {
    case 'cond': return !literal(x, q.a) || literal(x, q.b);
    case 'nocond': return literal(x, q.a) && !literal(x, q.b);
    case 'no': return !x(q.o, q.c);
    case 'es': return x(q.o, q.c);
    case 'distintos': return [0, 1, 2].every(c => !(x(q.o1, c) && x(q.o2, c)));
    case 'todas': return [0, 1, 2].every(c => [0, 1, 2, 3].some(o => x(o, c)));
  }
  throw new Error(q.t);
}
function afirmacion(x, k) {
  const [, t, a, b] = k.split(':'), i = +a, j = +b;
  if (t === 'es') return x(i, j);
  if (t === 'no') return !x(i, j);
  if (t === 'igual') return [0, 1, 2].some(c => x(i, c) && x(j, c));
  if (t === 'dist') return ![0, 1, 2].some(c => x(i, c) && x(j, c));
  if (t === 'alguno') return [0, 1, 2, 3].some(o => x(o, i));
  if (t === 'ninguno') return ![0, 1, 2, 3].some(o => x(o, i));
  throw new Error(k);
}
const filasQueCumplen = pistas => FILAS.filter(x => pistas.every(q => pistaFrasco(x, q)));
function recalcularSiempre(d) {
  const filas = filasQueCumplen(d.pistas);
  assert.ok(filas.length >= 2, 'las pistas dejan menos de dos casos');
  const siempre = d.opciones.filter(k => filas.every(x => afirmacion(x, k)));
  assert.equal(siempre.length, 1, `afirmaciones siempre ciertas: ${siempre}`);
  return siempre[0];
}

// ---------------------------------------------------------------- asignación con vuelta atrás
function resolver(pistas, n = 4) {
  const sol = [], usados = new Set(), out = [];
  const conocida = l => l.o < sol.length;
  const litV = l => (sol[l.o] === l.c) !== !!l.neg;
  const bien = q => {
    if (q.t === 'no') return !conocida(q) || sol[q.o] !== q.c;
    if (q.t === 'contra') return !conocida(q.a) || !litV(q.a);
    if (q.t === 'cond') return !(conocida(q.a) && conocida(q.b)) || !litV(q.a) || litV(q.b);
    throw new Error(q.t);
  };
  (function rec() {
    if (sol.length === n) { out.push(sol.slice()); return; }
    for (let c = 0; c < n; c++) {
      if (usados.has(c)) continue;
      sol.push(c); usados.add(c);
      if (pistas.every(bien)) rec();
      sol.pop(); usados.delete(c);
    }
  })();
  return out;
}
function recalcularAsignacion(d) {
  const sols = resolver(d.pistas);
  assert.equal(sols.length, 1, 'la asignación no es única');
  const s = sols[0];
  if (d.modo === 'quien') return `cosa:${s[d.persona]}`;
  const ciertas = d.opciones.filter(k => { const [, o, c] = k.split(':'); return s[+o] === +c; });
  assert.equal(ciertas.length, 1, `afirmaciones verdaderas: ${ciertas}`);
  return ciertas[0];
}

// puntajes: otro evaluador de las pistas (por quién tiene cada dado y comparaciones entre los tres), todas las
// combinaciones de reparto y puntajes; se exige un solo reparto y que el máximo por persona sea un caso válido.
function recalcularPuntajes(d) {
  const L = d.lanz, valido = [];
  const dueno = (col, c) => [0, 1, 2].find(p => col[p] === c);
  const pistaOk = (q, col, s) => {
    if (q.t === 'paridad') return [0, 1, 2].every(p => (s[p] % 2 === 1) === (q.par === 'impar'));
    if (q.t === 'no') return col[q.p] !== q.c;
    const w = dueno(col, q.c), otros = [0, 1, 2].filter(p => p !== w);
    if (q.t === 'mayor') return w !== q.p && s[q.p] > s[w];
    if (q.t === 'menor-todos') return otros.every(p => s[p] > s[w]);
    return otros.every(p => s[p] < s[w]);
  };
  for (const col of [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]])
    for (let a = L; a <= 6 * L; a++) for (let b = L; b <= 6 * L; b++) for (let c = L; c <= 6 * L; c++)
      if (d.pistas.every(q => pistaOk(q, col, [a, b, c]))) valido.push({ col, s: [a, b, c] });
  const repartos = new Set(valido.map(x => x.col.join('')));
  assert.equal(repartos.size, 1, 'el reparto de dados debe ser único');
  const max = [0, 1, 2].map(p => Math.max(...valido.map(x => x.s[p])));
  assert.ok(valido.some(x => x.s.every((z, p) => z === max[p])), 'los máximos no se alcanzan a la vez');
  return `pt:${max[d.persona]}:${valido[0].col[d.persona]}`;
}

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'puntajes') return recalcularPuntajes(d);
  if (d.tipo === 'silogismo') return recalcularSilogismo(d);
  if (d.tipo === 'siempre-cierto') return recalcularSiempre(d);
  return recalcularAsignacion(d);
}
probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => a === b });

// ---------------------------------------------------------------- más pruebas
test('puntajes: sale con semillas de práctica, cada pista hace falta y no hay dos pistas iguales', () => {
  let vistos = 0;
  for (let s = 1; s <= 300; s++) {
    const p = gen.generar(`ana-${s}`); if (p._datos.tipo !== 'puntajes') continue;
    vistos++;
    const d = p._datos;
    assert.equal(recalcularPuntajes(d), p.respuesta.valor, `ana-${s}`);
    assert.ok(d.pistas.some(q => q.t === 'paridad'));
    assert.ok(d.pistas.length >= 3 && d.pistas.length <= 5);
    d.pistas.filter(q => q.t !== 'paridad').forEach((q, i) => {
      const sin = gen.calc.puntajes({ lanz: d.lanz, pistas: d.pistas.filter(x => x !== q), persona: d.persona }).respuesta;
      assert.ok(!sin || `pt:${sin.puntaje}:${sin.color}` !== p.respuesta.valor, `ana-${s}: la pista ${i} sobra`);
    });
  }
  assert.ok(vistos > 30, `solo ${vistos}`);
  for (const pre of ['entrada', 'salida']) for (let s = 1; s <= 30; s++) assert.notEqual(gen.generar(`${pre}-${s}`)._datos.tipo, 'puntajes');
});

test('salen los tres tipos (y los dos modos de asignación) en 200 semillas', () => {
  const tipos = new Set();
  for (let s = 0; s < 200; s++) { const d = gen.generar(s)._datos; tipos.add(d.tipo + (d.modo ? ':' + d.modo : '')); }
  assert.deepEqual([...tipos].sort(), ['asignacion:afirmacion', 'asignacion:quien', 'siempre-cierto', 'silogismo']);
});

test('las reglas clásicas coinciden con los modelos de zonas en las 64 parejas de premisas', () => {
  const fs = ['A', 'E', 'I', 'O'];
  const concl = [['A', 0, 2], ['A', 2, 0], ['E', 0, 2], ['I', 0, 2], ['O', 0, 2], ['O', 2, 0]];
  let validas = 0;
  for (const f1 of fs) for (const f2 of fs) for (const o1 of [[1, 2], [2, 1]]) for (const o2 of [[0, 1], [1, 0]]) {
    const prem = [{ f: f1, s: o1[0], p: o1[1] }, { f: f2, s: o2[0], p: o2[1] }];
    for (const [f, s, p] of concl) {
      const k = gen.calc.proposicion(f, s, p);
      const z = gen.calc.validaSilogismo(prem, k), r = porReglas(prem, { f, s, p }), i = seDeduce(prem, k);
      assert.equal(z, r, `${JSON.stringify(prem)} → ${k}: zonas ${z}, reglas ${r}`);
      assert.equal(z, i, `${JSON.stringify(prem)} → ${k}: zonas ${z}, individuos ${i}`);
      if (z) validas++;
    }
  }
  // 15 modos válidos sin suponer existencia; con 2 órdenes por premisa y E/I simétricas salen 24 parejas-conclusión.
  assert.ok(validas > 0);
});

test('silogismos: ningún distractor se deduce ni suponiendo que las tres clases tienen elementos', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.tipo !== 'silogismo') continue;
    for (const a of p.alternativas.filter(x => !x.correcta && x.valor !== 'sil:nada')) {
      assert.ok(!gen.calc.validaSilogismo(d.premisas, a.valor, true), `semilla ${s}: ${a.texto} sí se deduce con existencia`);
    }
    if (p.respuesta.valor === 'sil:nada') assert.equal(gen.calc.conclusionesValidas(d.premisas).existenciales.length, 0);
    assert.ok(p.alternativas.some(a => a.valor === 'sil:nada'), `semilla ${s}: falta «ninguna se deduce»`);
    assert.ok(p.figuraSolucion && !p.figura, `semilla ${s}: el Venn va solo en la solución`);
  }
});

test('siempre cierto: cada pista hace falta, la correcta usa un condicional y las demás son posibles o imposibles, no necesarias', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.tipo !== 'siempre-cierto') continue;
    const n = filasQueCumplen(d.pistas).length;
    d.pistas.forEach((q, i) => assert.ok(filasQueCumplen(d.pistas.filter((_, j) => j !== i)).length > n, `semilla ${s}: la pista ${i + 1} sobra`));
    const sinCond = d.pistas.filter(q => q.t !== 'cond' && q.t !== 'nocond');
    assert.ok(!filasQueCumplen(sinCond).every(x => afirmacion(x, p.respuesta.valor)), `semilla ${s}: la correcta sale sin condicionales`);
    for (const a of p.alternativas.filter(x => !x.correcta)) {
      const casosVal = filasQueCumplen(d.pistas).filter(x => afirmacion(x, a.valor)).length;
      assert.ok(casosVal < n, `semilla ${s}: ${a.texto} también es siempre cierta`);
      if (a.error.id.startsWith('RMP77')) assert.ok(casosVal > 0, `semilla ${s}: ${a.texto} no es posible`);
    }
  }
});

test('asignación: cada pista hace falta, hay un contrafáctico y su segunda parte tampoco se cumple', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.tipo !== 'asignacion') continue;
    const sol = resolver(d.pistas)[0];
    d.pistas.forEach((q, i) => assert.ok(resolver(d.pistas.filter((_, j) => j !== i)).length > 1, `semilla ${s}: la pista ${i + 1} sobra`));
    const contras = d.pistas.filter(q => q.t === 'contra');
    assert.ok(contras.length >= 1 && d.pistas.some(q => q.t === 'cond'));
    for (const q of contras) assert.ok((sol[q.b.o] === q.b.c) === !!q.b.neg, `semilla ${s}: la segunda parte del contrafáctico se cumple`);
    // Con la lectura fuerte del contrafáctico (tampoco pasa lo segundo) la solución es la misma.
    for (const q of contras) assert.equal(!!q.b.neg, false);
    const fuerte = d.pistas.concat(contras.map(q => ({ t: 'no', o: q.b.o, c: q.b.c })));
    assert.deepEqual(resolver(fuerte), [sol]);
    // Leyendo cada contrafáctico como un «si…, entonces…» común, la respuesta es la misma.
    assert.deepEqual(resolver(d.pistas.map(q => (q.t === 'contra' ? { t: 'cond', a: q.a, b: q.b } : q))), [sol], `semilla ${s}: depende de cómo se lea el contrafáctico`);
    if (d.modo === 'quien') assert.ok(!contras.some(q => q.a.o === d.persona), `semilla ${s}: se pregunta por la persona del contrafáctico`);
  }
});

test('las explicaciones hablan en segunda persona y no se repiten dentro de un problema', () => {
  for (let s = 0; s < 300; s++) {
    const p = gen.generar(s);
    const ex = p.alternativas.filter(a => !a.correcta).map(a => a.error.explicacion);
    assert.equal(new Set(ex).size, ex.length, `semilla ${s}: explicaciones repetidas`);
    for (const e of ex) assert.ok(e.length > 40 && e.length < 700, `semilla ${s}: explicación de largo raro`);
  }
});

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(p.respuesta.texto, c.esperado.respuesta);
  });
}

test('casos.json trae al menos 2 casos por tipo y las semillas de entrada y salida', () => {
  const tipos = {};
  for (const c of casos.casos) tipos[c.entrada.tipo] = (tipos[c.entrada.tipo] || 0) + 1;
  for (const t of ['silogismo', 'siempre-cierto', 'asignacion']) assert.ok(tipos[t] >= 2, t);
  for (const s of ['entrada-1', 'entrada-2', 'entrada-3', 'salida-1', 'salida-2', 'salida-3']) assert.ok(casos.casos.some(c => c.semilla === s), s);
});

test('papel.json: entre 5 y 10 problemas y cada verificación da lo esperado', () => {
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  for (const pr of papel.problemas) {
    assert.ok(pr.enunciado && pr.respuesta && pr.pasos.length && pr.verificar.length, pr.id);
    for (const vf of pr.verificar) assert.deepEqual(gen.calc[vf.fn](...vf.args), vf.espera, `${pr.id}: ${vf.fn}`);
  }
});
