// Pruebas del motor de «El gráfico que no miente». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con números al azar (semilla fija):
//    - barras: la razón real no depende del inicio del eje; la dibujada sube al subir el inicio y es altoA/altoB;
//    - líneas: el tramo «mayor» es el de mayor porcentaje en una búsqueda aparte; sobre el valor final siempre sale menos;
//    - sectores: los grados suman 360 y los porcentajes 100; grados → cantidad → grados vuelve al mismo número;
//    - campeonato: una tabla armada con resultados al azar es coherente, sus puntos son 3·partidos − empates, y
//      deducirTabla, con una fila borrada, la deja entre las opciones (y la recupera si la solución es única);
//    - suficiencia: la clave coincide con un conteo hecho aparte con funciones de JavaScript, NO cambia al reordenar
//      las condiciones de una información, y al cambiar I por II solo se cambian «solo-I» y «solo-II»;
//    - NINGÚN ERROR TÍPICO COINCIDE CON LA RESPUESTA (los que coinciden van en 'coinciden') y no hay dos errores iguales.
// 3. Errores de entrada.
// 4. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
function cerca(real, esperado, que, tol) {
  const t = tol === undefined ? 1e-9 : tol;
  if (Array.isArray(esperado)) { assert.ok(Array.isArray(real), `${que}: no es lista`); assert.equal(real.length, esperado.length, `${que}: largo`); esperado.forEach((e, k) => cerca(real[k], e, `${que}[${k}]`, t)); return; }
  if (esperado && typeof esperado === 'object') {
    assert.ok(real && typeof real === 'object', `${que}: no es objeto`);
    assert.deepEqual(Object.keys(real).sort(), Object.keys(esperado).sort(), `${que}: claves`);
    for (const [k, v] of Object.entries(esperado)) cerca(real[k], v, `${que}.${k}`, t);
    return;
  }
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(typeof real === 'number' && Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
function llamar(fn, args) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  const r = motor[fn](...args);
  return r !== null && typeof r === 'object' ? r : { valor: r };
}
const campo = (r, k) => k.split('.').reduce((o, p) => (o == null ? o : o[p]), r);
function comprobar(fn, args, espera, que) {
  const r = llamar(fn, args);
  for (const [k, v] of Object.entries(espera)) {
    const x = k in r ? r[k] : campo(r, k);
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    cerca(x, v, `${que} · ${k}`);
  }
}

// 1. casos.json
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'tablas-graficos');
  assert.ok(datos.casos.length >= 16 && datos.casos.length <= 22);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
  assert.ok(datos.casos.some(c => c.tambien && c.tambien.length), 'algún caso trae «tambien»');
  assert.equal(new Set(datos.casos.map(c => c.nombre)).size, datos.casos.length, 'nombres repetidos');
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
let semilla = 2026;
const rnd = () => (semilla = (Math.imul(semilla, 1664525) + 1013904223) >>> 0) / 4294967296;
const ent = (a, b) => Math.floor(a + (b - a + 1) * rnd());
const N = 300;
const casi = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
const mismo = (a, b) => (typeof a === 'number' && typeof b === 'number' ? casi(a, b) : JSON.stringify(a) === JSON.stringify(b));
function sinChoques(R, correcto, que, igual) {
  igual = igual || mismo;
  assert.ok(R.errores && typeof R.errores === 'object', `${que}: falta errores`);
  assert.ok(Array.isArray(R.coinciden), `${que}: falta coinciden`);
  for (const [k, v] of Object.entries(R.errores)) assert.ok(!igual(v, correcto), `${que}: el error ${k} da la respuesta (${JSON.stringify(v)})`);
  const vs = Object.values(R.errores);
  for (let i = 0; i < vs.length; i++) for (let j = i + 1; j < vs.length; j++) assert.ok(!mismo(vs[i], vs[j]), `${que}: dos errores dan lo mismo`);
}

test('barras: la razón real no depende del eje; la dibujada crece al subir el inicio', () => {
  for (let k = 0; k < N; k++) {
    const b = ent(5, 200), a = b + ent(1, 150), i1 = ent(0, b - 1), i2 = ent(i1, b - 1);
    const R1 = motor.razonBarras({ a, b, inicio: i1 }), R2 = motor.razonBarras({ a, b, inicio: i2 });
    cerca(R1.razon, a / b, 'razón'); cerca(R2.razon, R1.razon, 'razón con otro eje');
    cerca(R1.dibujada, R1.altoA / R1.altoB, 'dibujada = altoA/altoB');
    assert.ok(R2.dibujada >= R1.dibujada - 1e-12, 'subir el inicio exagera la diferencia');
    assert.ok(R1.dibujada >= R1.razon - 1e-12, 'el eje truncado nunca achica la razón dibujada');
    sinChoques(R1, R1.razon, `razonBarras ${a}/${b} desde ${i1}`);
    if (i1 === 0) assert.ok(R1.coinciden.includes('alturas'), 'con el eje desde 0, las alturas dicen la verdad');
    const B = motor.barras({ valores: [a, b], inicio: i1, tope: a + 5 });
    cerca(B.barras[0].alto / B.barras[1].alto, R1.dibujada, 'barras y razonBarras dibujan lo mismo');
  }
});

test('líneas: el mayor porcentaje sale igual en una búsqueda aparte; sobre el valor final siempre es menos', () => {
  let probados = 0;
  for (let k = 0; k < N; k++) {
    const v = Array.from({ length: ent(3, 7) }, () => ent(10, 150));
    let R;
    try { R = motor.crecimientos({ valores: v }); } catch (e) { assert.match(e.message, /ningún tramo sube|empatados/); continue; }
    probados++;
    let mejor = -1, p = -Infinity;
    for (let i = 0; i + 1 < v.length; i++) if (v[i + 1] > v[i] && (v[i + 1] - v[i]) / v[i] > p) { p = (v[i + 1] - v[i]) / v[i]; mejor = i; }
    assert.equal(R.mayor, mejor); cerca(R.porcentaje, 100 * p, 'porcentaje');
    for (const t of R.tramos) if (t.cambio > 0) assert.ok(t.porcentajeFinal < t.porcentaje, 'sobre el valor final sale menos');
    const correcto = { tramo: R.mayor, porcentaje: R.porcentaje };
    sinChoques(R, correcto, `crecimientos ${v}`, (e, c) => (e.indice !== undefined ? e.indice === c.tramo + 1 : e.tramo === c.tramo && casi(e.porcentaje, c.porcentaje)));
  }
  assert.ok(probados > N / 2);
});

test('sectores: suman 360° y 100 %; grados → cantidad → grados vuelve igual', () => {
  for (let k = 0; k < N; k++) {
    const c = Array.from({ length: ent(2, 7) }, () => ent(0, 90));
    if (c.every(x => x === 0)) continue;
    const S = motor.sectores({ cantidades: c });
    cerca(S.sumaGrados, 360, 'suma de grados'); cerca(S.sumaPorcentajes, 100, 'suma de porcentajes');
    cerca(S.sectores.reduce((s, x) => s + x.grados, 0), 360, 'grados uno por uno');
    for (const s of S.sectores) {
      cerca(s.grados, s.porcentaje * 3.6, 'grados = 3,6 · porcentaje');
      if (!s.cantidad) continue;
      const G = motor.gradosDeSector({ total: S.total, cantidad: s.cantidad });
      cerca(G.grados, s.grados, 'gradosDeSector');
      const C = motor.cantidadDeSector({ total: S.total, grados: G.grados });
      cerca(C.cantidad, s.cantidad, 'ida y vuelta');
      sinChoques(G, G.grados, 'gradosDeSector'); sinChoques(C, C.cantidad, 'cantidadDeSector');
    }
    const p = ent(1, 100), q = ent(1, 100), A = motor.sectorAnidado({ total: 200, porcentaje: p, parte: q });
    cerca(A.grados, p * q / 100 * 3.6, 'porcentaje del porcentaje'); sinChoques(A, A.grados, 'sectorAnidado');
  }
});

function torneoAlAzar(n, r) {
  const res = [];
  for (let v = 0; v < r; v++) for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) res.push([i, j, ent(0, 4), ent(0, 4)]);
  return res;
}
test('campeonato: tabla coherente, puntos = 3·partidos − empates y deducirTabla la recupera', () => {
  for (let k = 0; k < 120; k++) {
    const n = ent(2, 5), r = n <= 3 ? ent(1, 2) : 1;
    const T = motor.tablaDesdeResultados({ equipos: n, resultados: torneoAlAzar(n, r) });
    const P = motor.partidos({ equipos: n, ruedas: r });
    assert.equal(T.partidos, P.partidos); sinChoques(P, P.partidos, 'partidos');
    assert.deepEqual(motor.revisarTabla({ equipos: n, ruedas: r, filas: T.filas }), { coherente: true, fallas: [] });
    assert.equal(T.puntos, 3 * T.partidos - T.empates);
    const E = motor.empates({ equipos: n, ruedas: r, puntos: T.filas.map(f => f.Pts) });
    assert.equal(E.empates, T.empates); sinChoques(E, E.empates, 'empates');
    const borrada = ent(0, n - 1);
    const filas = T.filas.map((f, j) => (j === borrada ? { PJ: f.PJ, PG: null, PE: null, PP: null, GF: f.GF, GC: null, Pts: null } : f));
    const D = motor.deducirTabla({ equipos: n, ruedas: r, filas });
    assert.ok(D.posibles >= 1);
    for (const c of ['PG', 'PE', 'PP', 'Pts']) assert.ok(D.opciones[`${borrada}.${c}`].includes(T.filas[borrada][c]), `la fila verdadera está entre las opciones (${c})`);
    assert.equal(D.filas[borrada].GC, T.filas[borrada].GC, 'los goles en contra salen de ΣGF = ΣGC');
    // con las demás filas completas, la que falta queda fija: victorias = derrotas y la columna PE es par no siempre bastan,
    // pero las victorias, empates y derrotas que tuvo cada equipo contra ella sí se leen de las otras filas
    if (D.unica) for (const c of ['PG', 'PE', 'PP', 'Pts']) assert.equal(D.filas[borrada][c], T.filas[borrada][c]);
    const mal = T.filas.map((f, j) => (j === 0 ? Object.assign({}, f, { Pts: f.Pts + 1 }) : f));
    assert.ok(!motor.revisarTabla({ equipos: n, ruedas: r, filas: mal }).coherente);
  }
});

// Suficiencia: un conteo hecho aparte, con funciones de JavaScript en vez del intérprete del motor.
function claveAparte(rango, pregunta, fI, fII) {
  const vI = new Set(), vII = new Set(), vJ = new Set();
  for (let x = rango[0]; x <= rango[1]; x++) for (let y = rango[0]; y <= rango[1]; y++) {
    const q = pregunta(x, y), a = fI(x, y), b = fII(x, y);
    if (a) vI.add(q); if (b) vII.add(q); if (a && b) vJ.add(q);
  }
  if (!vI.size || !vII.size || !vJ.size) return null;
  const bI = vI.size === 1, bII = vII.size === 1;
  return bI && bII ? 'cada-una' : bI ? 'solo-I' : bII ? 'solo-II' : vJ.size === 1 ? 'juntas' : 'faltan';
}
const CAMBIO = { 'solo-I': 'solo-II', 'solo-II': 'solo-I', juntas: 'juntas', 'cada-una': 'cada-una', faltan: 'faltan' };
test('suficiencia: coincide con un conteo aparte, no cambia al reordenar y al cambiar I por II solo cambian solo-I y solo-II', () => {
  const vistas = new Set();
  for (let k = 0; k < 250; k++) {
    const a = ent(1, 4), b = ent(1, 4), s = ent(5, 30), t = ent(2, 12), m = ent(2, 5), c = ent(1, 9);
    // I: a·x + b·y = s (y además, a veces, x es múltiplo de m); II: x + y = t o x > c
    const conM = rnd() < 0.4, conMayor = rnd() < 0.5, preg = rnd() < 0.5 ? 'x' : 'x + y';
    const I = [`${a}*x + ${b}*y == ${s}`].concat(conM ? [`x % ${m} == 0`] : []);
    const II = conMayor ? [`x > ${c}`] : [`x + y == ${t}`];
    const fI = (x, y) => a * x + b * y === s && (!conM || x % m === 0), fII = (x, y) => (conMayor ? x > c : x + y === t);
    const fp = preg === 'x' ? (x) => x : (x, y) => x + y;
    const esperado = claveAparte([1, 12], fp, fI, fII);
    const o = { variables: { x: [1, 12], y: [1, 12] }, pregunta: preg, I, II };
    if (esperado === null) { assert.throws(() => motor.suficiencia(o), /contradice|contradicen/); continue; }
    const R = motor.suficiencia(o);
    assert.equal(R.clave, esperado, JSON.stringify(o)); vistas.add(R.clave);
    sinChoques(R, R.clave, JSON.stringify(o));
    assert.equal(motor.suficiencia(Object.assign({}, o, { I: I.slice().reverse() })).clave, R.clave, 'reordenar las condiciones de I');
    assert.equal(motor.suficiencia(Object.assign({}, o, { I: II, II: I })).clave, CAMBIO[R.clave], 'cambiar I por II');
    for (const [cl, nombre] of Object.entries(R.porClave)) {
      assert.notEqual(cl, R.clave);
      if (nombre) assert.equal(R.errores[nombre], cl);
    }
    assert.equal(Object.keys(R.porClave).length, 4);
  }
  for (const c of motor.CLAVES) assert.ok(vistas.has(c), `la prueba al azar no llegó a la clave ${c}`);
});

test('pictograma y dosCrecimientos: ningún error da la respuesta', () => {
  for (let k = 0; k < N; k++) {
    const f = ent(2, 5) / ent(1, 2);
    if (f === 1) continue;
    const P = motor.pictograma({ factor: f }); cerca(P.area, f * f, 'área'); sinChoques(P, P.area, 'pictograma');
    const d1 = ent(10, 90), d2 = ent(10, 90), D = motor.dosCrecimientos({ uno: [d1, d1 + ent(1, 30)], otro: [d2, d2 + ent(1, 30)] });
    sinChoques(D, D.mayor, 'dosCrecimientos');
  }
});

test('evaluar: precedencia, resto y comparaciones', () => {
  const ev = motor.evaluar;
  assert.equal(ev('2 + 3 * 4', {}), 14);
  assert.equal(ev('(2 + 3) * 4', {}), 20);
  assert.equal(ev('2 ^ 3 ^ 2', {}), 512);
  assert.equal(ev('-2 ^ 2', {}), -4);
  assert.equal(ev('10 % 4', {}), 2);
  assert.equal(ev('-7 % 3', {}), 2);
  assert.equal(ev('1 / 3 * 3 == 1', {}), true);
  assert.equal(ev('x >= 3 && !(x == 4) || y < 0', { x: 4, y: -1 }), true);
  assert.equal(ev('edad + 5 == 17', { edad: 12 }), true);
  assert.equal(ev('año + 1', { 'año': 2026 }), 2027);
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.razonBarras({ a: 40, b: 50 }), /mayor que b/);
  assert.throws(() => motor.razonBarras({ a: 50, b: 40, inicio: 40 }), /inicio del eje/);
  assert.throws(() => motor.razonBarras(), /objeto/);
  assert.throws(() => motor.barras({ valores: [50, 30], inicio: 35 }), /entre el inicio y el tope/);
  assert.throws(() => motor.crecimientos({ valores: [50, 40, 30] }), /ningún tramo sube/);
  assert.throws(() => motor.crecimientos({ valores: [40, 50, 40, 50] }), /empatados/);
  assert.throws(() => motor.crecimientos({ valores: [0, 5] }), /mayor que cero/);
  assert.throws(() => motor.sectores({ cantidades: [0, 0] }), /total/);
  assert.throws(() => motor.cantidadDeSector({ total: 200, grados: 400 }), /como mucho 360/);
  assert.throws(() => motor.gradosDeSector({ total: 20, cantidad: 30 }), /pasar del total/);
  assert.throws(() => motor.pictograma({ factor: 1 }), /distinto de 1/);
  assert.throws(() => motor.partidos({ equipos: 1 }), /al menos 2/);
  assert.throws(() => motor.partidos({ equipos: 4, ruedas: 3 }), /como mucho 2/);
  assert.throws(() => motor.empates({ equipos: 4, puntos: [9, 9, 9, 9] }), /no cuadran/);
  assert.throws(() => motor.empates({ equipos: 4, puntos: [7, 4, 4] }), /al menos 4|un puntaje por equipo/);
  assert.throws(() => motor.tablaDesdeResultados({ equipos: 3, resultados: [[1, 1, 0, 0]] }), /sí mismo/);
  assert.throws(() => motor.deducirTabla({ equipos: 3, filas: [{ PJ: 2, PG: 2, PE: 0, PP: 0, GF: 0, GC: 0, Pts: 6 }, { PJ: 2, PG: 2, PE: 0, PP: 0, GF: 0, GC: 0, Pts: 6 }, { PJ: 2, PG: null, PE: null, PP: null, GF: 0, GC: 0, Pts: null }] }), /no es coherente/);
  assert.throws(() => motor.deducirTabla({ equipos: 6, filas: Array(6).fill({ PJ: 5, PG: null, PE: null, PP: null, GF: 0, GC: 0, Pts: null }) }), /10 partidos/);
  assert.throws(() => motor.evaluar('2 +', {}), /antes de tiempo/);
  assert.throws(() => motor.evaluar('2 $ 3', {}), /no se entiende/);
  assert.throws(() => motor.evaluar('z + 1', { x: 1 }), /no conozco/);
  assert.throws(() => motor.evaluar('(1 + 2', {}), /falta «\)»/);
  const base = { variables: { x: [1, 10] }, pregunta: 'x' };
  assert.throws(() => motor.suficiencia(Object.assign({}, base, { I: 'x == 20', II: 'x > 2' })), /I contradice/);
  assert.throws(() => motor.suficiencia(Object.assign({}, base, { I: 'x == 1', II: 'x == 2' })), /se contradicen/);
  assert.throws(() => motor.suficiencia(Object.assign({}, base, { variables: { x: [1, 1000], y: [1, 1000] }, I: 'x == 1', II: 'y == 1' })), /demasiadas/);
  assert.throws(() => motor.suficiencia(Object.assign({}, base, { I: [], II: 'x > 2' })), /al menos una condición/);
  assert.equal(motor.fraccion(Math.SQRT2), null);
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
    assert.ok(!/<[a-z]/i.test(p.enunciado + p.respuesta + p.pasos.join(' ')), `${p.id}: la app muestra texto plano, sin HTML`);
    assert.ok(!/\d\.\d/.test(p.enunciado + p.respuesta + p.pasos.join(' ')), `${p.id}: se escribe con coma decimal`);
  }
});
for (const p of (papel && papel.problemas) || []) test(`papel ${p.id}: la respuesta coincide con el motor`, () => {
  for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id);
});
