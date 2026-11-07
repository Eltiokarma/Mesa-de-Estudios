// Pruebas del motor de «Los interruptores de la lógica». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, contra cuentas hechas de otra manera (fuerza bruta con una tabla propia de esta prueba): 2ⁿ filas en
//    el orden de academia; De Morgan, la negación del condicional y la contrarrecíproca equivalentes en fórmulas al azar;
//    la recíproca no; el circuito deja pasar la corriente exactamente en las filas V de la tabla (con y sin expandir);
//    imprimir() se lee de vuelta igual (con todos los paréntesis y con los mínimos); clasificar contra fuerza bruta; y
//    para la escena: ningún error típico da la respuesta correcta ni dos errores dan lo mismo.
// 3. Errores de entrada del analizador.
// 4. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const M = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
function llamar(fn, args) { assert.equal(typeof M[fn], 'function', `motor.${fn} no existe`); return M[fn](...args); }
const campo = (r, k) => (k === 'valor' && (typeof r !== 'object' || r === null || Array.isArray(r)) ? r : k.split('.').reduce((o, p) => (o == null ? o : o[p]), r));
function comprobar(fn, args, espera, que) {
  const r = llamar(fn, args);
  for (const [k, v] of Object.entries(espera)) {
    const x = campo(r, k);
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    assert.deepEqual(x, v, `${que} · ${k}`);
  }
}

// 1. casos.json
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'logica');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 22);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
let semilla = 2026;
const rnd = () => (semilla = (Math.imul(semilla, 1664525) + 1013904223) >>> 0) / 4294967296;
const ent = (a, b) => a + Math.floor((b - a + 1) * rnd());
const VARS = ['p', 'q', 'r', 's'];
// Fórmula al azar como árbol, con hasta 'nv' variables.
function azar(prof, nv) {
  if (prof <= 0 || rnd() < 0.25) return { t: 'var', n: VARS[ent(0, nv - 1)] };
  if (rnd() < 0.2) return { t: 'no', a: azar(prof - 1, nv) };
  const t = ['y', 'o', 'ox', 'si', 'sii'][ent(0, 4)];
  return { t, a: azar(prof - 1, nv), b: azar(prof - 1, nv) };
}
// Evaluador propio de la prueba (no usa el motor) y tabla por fuerza bruta.
function ev(f, val) {
  switch (f.t) {
    case 'var': return val[f.n];
    case 'no': return !ev(f.a, val);
    case 'y': return ev(f.a, val) && ev(f.b, val);
    case 'o': return ev(f.a, val) || ev(f.b, val);
    case 'ox': return ev(f.a, val) !== ev(f.b, val);
    case 'si': return !ev(f.a, val) || ev(f.b, val);
    case 'sii': return ev(f.a, val) === ev(f.b, val);
  }
  throw new Error('nodo raro');
}
function todas(vars) {
  const out = [];
  for (let i = 0; i < 2 ** vars.length; i++) { const v = {}; vars.forEach((x, j) => { v[x] = Math.floor(i / 2 ** (vars.length - 1 - j)) % 2 === 0; }); out.push(v); }
  return out;
}
const col = (f, vars) => todas(vars).map(v => (ev(M.analizar(f), v) ? 'V' : 'F')).join('');
const usadas = (...fs) => VARS.filter(x => fs.some(f => M.variables(f).includes(x)));
function erroresDistintosTabla(errores, correcta, vars, que) {
  const c = col(correcta, vars), vistos = new Set();
  for (const [k, e] of Object.entries(errores)) {
    const m = col(e, vars);
    assert.notEqual(m, c, `${que}: el error ${k} (${e}) equivale a la respuesta correcta`);
    vistos.add(typeof e === 'string' ? e : M.imprimir(e));
  }
  assert.equal(vistos.size, Object.keys(errores).length, `${que}: dos errores tienen el mismo texto`);
}
function erroresDistintos(errores, correcta, que) {
  const ser = JSON.stringify, vals = Object.values(errores).map(ser);
  for (const [k, e] of Object.entries(errores)) assert.notEqual(ser(e), ser(correcta), `${que}: el error ${k} da la respuesta correcta`);
  assert.equal(new Set(vals).size, vals.length, `${que}: dos errores dan lo mismo`);
}

test('tablas: 2ⁿ filas, sin repetir, en el orden de academia (V primero) y contra fuerza bruta', () => {
  for (let n = 1; n <= 4; n++) {
    const vars = VARS.slice(0, n), f = vars.join(' ∧ ');
    const T = M.tablaVerdad(f);
    assert.equal(T.filas.length, 2 ** n);
    assert.equal(M.filasDe(f).filas, 2 ** n);
    assert.equal(new Set(T.filas.map(x => JSON.stringify(x.valores))).size, 2 ** n, 'filas distintas');
    assert.ok(vars.every(x => T.filas[0].valores[x]), 'la primera fila es toda V');
    assert.ok(vars.every(x => !T.filas[2 ** n - 1].valores[x]), 'la última fila es toda F');
    // la primera variable es V en la primera mitad
    T.filas.forEach((x, i) => assert.equal(x.valores[vars[0]], i < 2 ** (n - 1)));
    // la última alterna
    T.filas.forEach((x, i) => assert.equal(x.valores[vars[n - 1]], i % 2 === 0));
    erroresDistintos(M.filasDe(n).errores, 2 ** n, `filasDe(${n})`);
  }
  for (let t = 0; t < 400; t++) {
    const f = azar(4, 4), vars = M.variables(f);
    assert.equal(M.tablaVerdad(f).matriz, col(f, vars));
    assert.equal(M.tablaVerdad(f).cantidad, 2 ** vars.length);
  }
});

test('leyes en fórmulas al azar: De Morgan, negación del condicional y contrarrecíproca equivalen; la recíproca no', () => {
  for (let t = 0; t < 400; t++) {
    const a = azar(2, 3), b = azar(2, 3), vars = usadas(a, b);
    const A = `(${M.imprimir(a)})`, B = `(${M.imprimir(b)})`;
    assert.equal(col(`~(${A} ∧ ${B})`, vars), col(`~${A} ∨ ~${B}`, vars), 'De Morgan ∧');
    assert.equal(col(`~(${A} ∨ ${B})`, vars), col(`~${A} ∧ ~${B}`, vars), 'De Morgan ∨');
    assert.equal(col(`~(${A} → ${B})`, vars), col(`${A} ∧ ~${B}`, vars), 'negación del condicional');
    assert.equal(col(`${A} → ${B}`, vars), col(`~${B} → ~${A}`, vars), 'contrarrecíproca');
    assert.equal(col(`${A} → ${B}`, vars), col(`~${A} ∨ ${B}`, vars), 'condicional como disyunción');
    assert.ok(M.equivalentes(`${A} → ${B}`, `~${B} → ~${A}`).equivalentes);
    // la recíproca equivale solo si a y b tienen la misma tabla... o si alguna hace verdadero todo; lo comprobamos contra fuerza bruta
    const recEq = col(`${A} → ${B}`, vars) === col(`${B} → ${A}`, vars);
    assert.equal(M.equivalentes(`${A} → ${B}`, `${B} → ${A}`).equivalentes, recEq);
    // cada negación del motor equivale a ~f, y sus errores no
    const f = { t: ['y', 'o', 'si', 'sii', 'ox'][ent(0, 4)], a, b }, N = M.negar(f), vf = M.variables(f);
    assert.equal(col(N.texto, vf), col({ t: 'no', a: f }, vf), `negar(${M.imprimir(f)})`);
    erroresDistintosTabla(N.errores, N.texto, vf, `negar(${M.imprimir(f)})`);
  }
  // con variables simples, la recíproca nunca equivale y la inversa tampoco
  const F = M.formasCondicional('p', 'q');
  assert.equal(M.equivalentes(F.condicional, F.reciproca).equivalentes, false);
  assert.equal(M.equivalentes(F.condicional, F.inversa).equivalentes, false);
  assert.equal(M.equivalentes(F.reciproca, F.inversa).equivalentes, true, 'recíproca e inversa son equivalentes entre sí');
  erroresDistintosTabla(F.errores, F.respuesta, ['p', 'q'], 'formasCondicional');
});

test('circuito: deja pasar la corriente justo en las filas V (con cajas y con todo expandido)', () => {
  for (let t = 0; t < 500; t++) {
    const f = azar(4, 4), vars = M.variables(f);
    const C1 = M.circuito(f), C2 = M.circuito(f, { expandir: true });
    for (const v of todas(vars)) {
      const ok = ev(M.analizar(f), v);
      assert.equal(M.pasa(C1, v), ok, `${M.imprimir(f)} con cajas`);
      assert.equal(M.pasa(C2, v), ok, `${M.imprimir(f)} expandido`);
      assert.equal(M.corriente(C1, v).valor, ok);
    }
    // con todo expandido solo hay interruptores, serie y paralelo (y cajas inversoras)
    (function rec(c) { assert.ok(['int', 'serie', 'par', 'inv'].includes(c.k), c.k); (c.hijos || []).forEach(rec); if (c.a) rec(c.a); })(C2);
    // la disposición: un interruptor por cada aparición de una variable, todo dentro del cuadro, ids únicos
    const D = M.disposicion(C1), apariciones = JSON.stringify(M.analizar(f)).match(/"t":"var"/g).length;
    assert.equal(D.elementos.filter(e => e.tipo === 'interruptor').length, apariciones);
    for (const e of D.elementos) assert.ok(e.x >= 0 && e.y >= 0 && e.x + e.w <= D.ancho + 1e-9 && e.y + e.h <= D.alto + 1e-9, 'adentro');
    assert.equal(new Set(D.elementos.map(e => e.id)).size, D.elementos.length);
    assert.equal(D.focos.filter(x => x.principal).length, 1);
  }
  // un cable encendido siempre es de un nodo que deja pasar
  const C = M.circuito('(p ∧ q) ∨ ~r'), D = M.disposicion(C), R = M.corriente(C, { p: true, q: false, r: false });
  for (const c of D.cables) if (R.encendido[c.id]) assert.ok(R.pasa[c.id]);
  assert.equal(R.encendido[C.hijos[0].id], false, 'la rama p ∧ q está apagada');
  assert.equal(R.encendido[C.hijos[1].id], true, 'la rama ~r está encendida');
});

test('analizador: imprimir se lee de vuelta igual (con todos los paréntesis y con los mínimos)', () => {
  for (let t = 0; t < 800; t++) {
    const f = azar(5, 4);
    const t1 = M.imprimir(f), t2 = M.imprimir(f, { minimo: true });
    assert.deepEqual(M.analizar(t1), f, t1);
    assert.deepEqual(M.analizar(t2), f, t2);
    assert.ok(t2.length <= t1.length);
    assert.equal(typeof M.leer(f), 'string');
    assert.ok(!/[~∧∨→↔Δ()]/.test(M.leer(f)), 'el lector de pantalla no lee símbolos');
  }
  // otras escrituras aceptadas
  assert.equal(M.imprimir('¬p & q -> r <=> {s}'), '((~p ∧ q) → r) ↔ s');
  assert.equal(M.imprimir('p ⊕ q'), 'p Δ q');
});

test('clasificar contra fuerza bruta, y sus errores distintos', () => {
  for (let t = 0; t < 600; t++) {
    const f = azar(4, 3), vars = M.variables(f), m = col(f, vars);
    const C = M.clasificar(f);
    assert.equal(C.matriz, m);
    assert.equal(C.tipo, /^V+$/.test(m) ? 'tautologia' : /^F+$/.test(m) ? 'contradiccion' : 'contingencia');
    assert.equal(C.falsas, (m.match(/F/g) || []).length);
    erroresDistintos(Object.fromEntries(Object.entries(C.errores).map(([k, x]) => [k, `${x.tipo}/${x.falsas}`])), `${C.tipo}/${C.falsas}`, M.imprimir(f));
    // una fórmula y su negación: una tautología pasa a contradicción y al revés
    const N = M.clasificar({ t: 'no', a: M.analizar(f) });
    if (C.tipo === 'tautologia') assert.equal(N.tipo, 'contradiccion');
    if (C.tipo === 'contingencia') assert.equal(N.tipo, 'contingencia');
  }
});

test('errores de las predicciones: nunca la respuesta correcta, nunca dos iguales', () => {
  for (let t = 0; t < 600; t++) {
    const f = azar(4, 3), vars = M.variables(f), val = todas(vars)[ent(0, 2 ** vars.length - 1)];
    const P = M.valorConPartes(f, val);
    erroresDistintos(P.erroresTexto, P.texto, `valorConPartes(${M.imprimir(f)})`);
    assert.equal(P.valor, ev(M.analizar(f), val));
    const a = azar(2, 3), b = azar(2, 3), c = { t: 'si', a, b };
    const FF = M.filasFalsas(c);
    erroresDistintos(FF.errores, FF.falsas, `filasFalsas(${M.imprimir(c)})`);
    if (col(a, M.variables(c)).includes('F')) {
      const AF = M.conAntecedenteFalso(c);
      assert.equal(AF.respuesta, 'siempreV');
      erroresDistintos(AF.errores, AF.respuesta, 'conAntecedenteFalso');
    }
    const CC = M.condicionalComoCircuito(a, b);
    assert.ok(CC.equivalentes);
    erroresDistintosTabla(CC.errores, CC.respuesta, M.variables(c).length ? M.variables(c) : ['p'], `condicionalComoCircuito(${M.imprimir(c)})`);
  }
  for (let n = 1; n <= 5; n++) erroresDistintos(M.masFilas(n).errores, M.masFilas(n).despues, `masFilas(${n})`);
  const D = M.diferencias('p Δ q', 'p ∨ q');
  erroresDistintos(D.errores, D.filas, 'diferencias');
});

test('cuantificadores: la negación es lo contrario en todas las listas; los errores no', () => {
  for (const tipo of ['todos', 'alguno', 'ninguno', 'algunoNo']) {
    const N = M.negarCuantificador(tipo);
    erroresDistintos(N.errores, N.respuesta, tipo);
    for (let n = 1; n <= 5; n++) for (let i = 0; i < 2 ** n; i++) {
      const L = Array.from({ length: n }, (_, j) => Math.floor(i / 2 ** j) % 2 === 0);
      assert.equal(M.cuantificador(N.respuesta, L), !M.cuantificador(tipo, L), `${tipo} ${L}`);
    }
    // cada error falla en alguna lista de 5
    for (const [k, e] of Object.entries(N.errores)) {
      let falla = false;
      for (let i = 0; i < 32; i++) { const L = Array.from({ length: 5 }, (_, j) => Math.floor(i / 2 ** j) % 2 === 0); if (M.cuantificador(e, L) === M.cuantificador(tipo, L)) falla = true; }
      assert.ok(falla, `${tipo}: el error ${k} no debería ser la negación`);
    }
  }
});

test('cuadros de la animación: uno por fila, en el mismo orden que la tabla', () => {
  for (let t = 0; t < 100; t++) {
    const f = azar(3, 3), T = M.tablaVerdad(f), Q = M.cuadrosTabla(f);
    assert.equal(Q.length, T.filas.length);
    Q.forEach((q, j) => { assert.equal(q.llenas, j + 1); assert.deepEqual(q.valores, T.filas[j].valores); assert.equal(q.valor, T.filas[j].valor); });
  }
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => M.analizar(''), /vacía/);
  assert.throws(() => M.analizar('   '), /vacía/);
  assert.throws(() => M.analizar('p ∧ q ∨ r'), /sin paréntesis/);
  assert.throws(() => M.analizar('p Δ q ∧ r'), /sin paréntesis/);
  assert.throws(() => M.analizar('p → q → r'), /dos «→»/);
  assert.throws(() => M.analizar('(p ∧ q'), /falta cerrar/);
  assert.throws(() => M.analizar('(p ∧ q]'), /se cierra con/);
  assert.throws(() => M.analizar('p ∧ q)'), /sobra/);
  assert.throws(() => M.analizar('p ∧'), /falta una proposición/);
  assert.throws(() => M.analizar('∧ p'), /falta una proposición antes/);
  assert.throws(() => M.analizar('p q'), /falta un conectivo/);
  assert.throws(() => M.analizar('pq'), /falta un conectivo/);
  assert.throws(() => M.analizar('x ∧ p'), /no conozco/);
  assert.throws(() => M.analizar('p v q'), /no se usa/);
  assert.throws(() => M.analizar('pato'), /no es una variable/);
  assert.throws(() => M.analizar(42), /texto/);
  assert.throws(() => M.evaluar('p ∧ q', { p: true }), /falta el valor de q/);
  assert.throws(() => M.filasDe(0), /entero/);
  assert.throws(() => M.conAntecedenteFalso('p ∧ q'), /condicional/);
  assert.throws(() => M.conAntecedenteFalso('(p ∨ ~p) → q'), /nunca es falso/);
  assert.throws(() => M.cuantificador('casi', [true]), /desconocido/);
  assert.throws(() => M.cuantificador('todos', []), /al menos/);
});

// 4. Problemas de papel (regla 6)
const rutaPapel = path.join(__dirname, 'papel.json');
const papel = fs.existsSync(rutaPapel) ? JSON.parse(fs.readFileSync(rutaPapel, 'utf8')) : null;
test('papel.json: entre 8 y 10 problemas, con respuesta, pasos y verificación', () => {
  assert.ok(papel, 'falta papel.json');
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 8 && papel.problemas.length <= 10);
  const ids = new Set();
  for (const p of papel.problemas) {
    assert.ok(p.id && !ids.has(p.id)); ids.add(p.id);
    assert.ok(p.enunciado && p.respuesta && Array.isArray(p.pasos) && p.pasos.length, `${p.id}: falta texto`);
    assert.ok(Array.isArray(p.verificar) && p.verificar.length, `${p.id}: falta verificar`);
    const todo = [p.enunciado, p.respuesta, ...p.pasos].join(' ');
    assert.ok(!/<[a-z]/i.test(todo), `${p.id}: la app muestra texto plano, sin HTML`);
    assert.ok(!/ v /.test(todo), `${p.id}: la disyunción se escribe ∨, no v`);
    // las fórmulas del enunciado se pueden leer con el analizador
  }
  // la indicación y el título no adelantan las reglas que miden las predicciones
  assert.ok(!/2ⁿ|2\^|ocho|8|antecedente|contrarrec|morgan|tautolog|solo es falso|algún/i.test(papel.indicacion));
  assert.ok(!/morgan|tautolog|contrarrec|antecedente/i.test(papel.titulo));
});
for (const p of (papel && papel.problemas) || []) test(`papel ${p.id}: la respuesta coincide con el motor`, () => {
  for (const x of p.verificar) comprobar(x.fn, x.args, x.espera, p.id);
});
