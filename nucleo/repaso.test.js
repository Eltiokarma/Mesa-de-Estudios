// Cola de repaso: entrada a la cola, intervalos, tope diario, mezcla, pregunta del tipo y unión.
const test = require('node:test');
const assert = require('node:assert/strict');
const R = require('./repaso.js');
const Azar = require('./azar.js');

const fechaUTC = t => String(t).slice(0, 10);
const conGen = u => u !== 'sin-gen';
const ev = (tipo, unidad, t, extra = {}) => ({ tipo, unidad, t, alumno: 'a1', ...extra });

test('fechas: sumar y contar días cruzando meses y años', () => {
  assert.equal(R.sumarDias('2026-12-30', 2), '2027-01-01');
  assert.equal(R.sumarDias('2026-02-27', 2), '2026-03-01');
  assert.equal(R.entre('2026-11-13', '2026-12-04'), 21);
});

test('sembrar: entra con un ejercicio terminado, no con abrir la unidad ni con las pruebas', () => {
  const est = { alumno: 'a1', vistas: { 'u-vista': '2026-11-01' } };
  const nuevas = R.sembrar(est, [
    ev('prediccion', 'u1', '2026-11-10T15:00:00Z'),
    ev('prediccion', 'u1', '2026-11-09T15:00:00Z'), // el primero manda
    ev('examen-item', 'u2', '2026-11-11T15:00:00Z'),
    ev('prueba', 'u3', '2026-11-11T15:00:00Z', { fase: 'entrada' }),
    ev('prediccion', 'u4', '2026-11-11T15:00:00Z', { fase: 'entrada' }),
    ev('lectura', 'u5', '2026-11-11T15:00:00Z'),
    ev('prediccion', 'sin-gen', '2026-11-11T15:00:00Z'),
    ev('prediccion', 'u6', '2026-11-11T15:00:00Z', { alumno: 'otro' }),
  ], conGen, fechaUTC);
  assert.deepEqual(nuevas, ['u1', 'u2']);
  assert.deepEqual(est.repaso.u1, { desde: '2026-11-09', paso: 0, toca: '2026-11-11', hechos: 0, aciertos: 0, ultimo: null });
  assert.equal(est.repaso['u-vista'], undefined);
  // La segunda vez no toca lo que ya estaba.
  est.repaso.u1.paso = 2;
  assert.deepEqual(R.sembrar(est, [ev('prediccion', 'u1', '2026-11-01T15:00:00Z')], conGen, fechaUTC), []);
  assert.equal(est.repaso.u1.paso, 2);
});

test('intervalos 2, 7, 21 y 45; un fallo o «No sé» vuelve a 2 días', () => {
  const est = { repaso: { u: R.nueva('2026-11-01') } };
  assert.equal(est.repaso.u.toca, '2026-11-03');
  R.anotar(est, 'u', { correcta: true }, '2026-11-03');
  assert.equal(est.repaso.u.toca, '2026-11-10');
  R.anotar(est, 'u', { correcta: true }, '2026-11-10');
  assert.equal(est.repaso.u.toca, '2026-12-01');
  R.anotar(est, 'u', { correcta: true }, '2026-12-01');
  assert.equal(est.repaso.u.toca, R.sumarDias('2026-12-01', 45));
  R.anotar(est, 'u', { correcta: true }, '2027-01-15');
  assert.equal(est.repaso.u.toca, R.sumarDias('2027-01-15', 45)); // el último se repite
  R.anotar(est, 'u', { correcta: false }, '2027-03-01');
  assert.equal(est.repaso.u.paso, 0);
  assert.equal(est.repaso.u.toca, '2027-03-03');
  R.anotar(est, 'u', { correcta: true, nose: true }, '2027-03-03');
  assert.equal(est.repaso.u.paso, 0);
  assert.equal(est.repaso.u.hechos, 6);
  assert.equal(est.repaso.u.aciertos, 4);
  assert.equal(est.repaso.u.ultimo, '2027-03-03');
});

test('tope diario de 4 y pendientes de la más atrasada a la menos', () => {
  const est = { repaso: {} };
  ['a', 'b', 'c', 'd', 'e', 'f'].forEach((u, i) => { est.repaso[u] = R.nueva(`2026-11-0${i + 1}`); });
  est.repaso.f.toca = '2026-12-01'; // todavía no toca
  assert.deepEqual(R.pendientes(est, '2026-11-20'), ['a', 'b', 'c', 'd', 'e']);
  assert.equal(R.quedanHoy(est, '2026-11-20'), 4);
  R.anotar(est, 'a', { correcta: true }, '2026-11-20');
  assert.equal(R.quedanHoy(est, '2026-11-20'), 3);
  assert.equal(R.quedanHoy(est, '2026-11-21'), 4); // otro día, tope nuevo
  assert.equal(R.elegir(est, '2026-11-20', () => 'x').length, 3);
  assert.equal(R.proxima(est, '2026-11-20'), '2026-11-27'); // la de «a», que acertó hoy
});

test('elegir mezcla cursos y nunca repite unidad', () => {
  const est = { repaso: {} };
  const curso = { f1: 'fis', f2: 'fis', f3: 'fis', q1: 'qui', m1: 'mat' };
  Object.keys(curso).forEach((u, i) => { est.repaso[u] = R.nueva('2026-11-01'); est.repaso[u].toca = `2026-11-1${i}`; });
  const t = R.elegir(est, '2026-11-30', u => curso[u], 4);
  assert.equal(new Set(t).size, 4);
  assert.deepEqual(t, ['f1', 'q1', 'f2', 'f3']); // f1, f2, f3 y q1 son las 4 más atrasadas
  for (let i = 1; i < t.length - 1; i++) assert.notEqual(curso[t[i]], curso[t[i - 1]]);
});

test('opciones del tipo: la correcta más dos, primero estudiadas del mismo curso', () => {
  const curso = { f1: 'fis', f2: 'fis', f3: 'fis', q1: 'qui' };
  const ops = R.opcionesTipo('f1', { cursoDe: u => curso[u], estudiadas: ['f1', 'f2', 'q1'], delCurso: () => ['f1', 'f2', 'f3'], rng: Azar.crear('s') });
  assert.equal(ops.length, 3);
  assert.ok(ops.includes('f1') && ops.includes('f2'));
  assert.equal(new Set(ops).size, 3);
  // Sin estudiadas, completa con el catálogo del curso.
  const solo = R.opcionesTipo('f1', { cursoDe: u => curso[u], estudiadas: [], delCurso: () => ['f1', 'f2', 'f3'], rng: Azar.crear('t') });
  assert.deepEqual([...solo].sort(), ['f1', 'f2', 'f3']);
  // Misma semilla, mismo orden.
  const otra = R.opcionesTipo('f1', { cursoDe: u => curso[u], estudiadas: [], delCurso: () => ['f1', 'f2', 'f3'], rng: Azar.crear('t') });
  assert.deepEqual(solo, otra);
});

test('opciones del tipo: antes el catálogo del mismo curso que una estudiada de otro curso', () => {
  const curso = { f1: 'fis', f2: 'fis', f3: 'fis', q1: 'qui' };
  const ops = R.opcionesTipo('f1', { cursoDe: u => curso[u], estudiadas: ['f1', 'q1'], delCurso: () => ['f1', 'f2', 'f3'], rng: Azar.crear('z') });
  assert.deepEqual([...ops].sort(), ['f1', 'f2', 'f3']);
  const pocas = R.opcionesTipo('f1', { cursoDe: u => curso[u], estudiadas: ['f1', 'q1'], delCurso: () => ['f1', 'f2'], rng: Azar.crear('z') });
  assert.deepEqual([...pocas].sort(), ['f1', 'f2', 'q1']);
});

test('opciones del tipo: no pone de distractor una unidad que el mismo generador también cubre', () => {
  const ops = R.opcionesTipo('a1', { cursoDe: () => 'alg', estudiadas: ['a1', 'a2', 'a3', 'a4'], excluir: ['a2', 'a3'], delCurso: () => ['a1', 'a2', 'a3', 'a4', 'a5'], rng: Azar.crear('x') });
  assert.deepEqual([...ops].sort(), ['a1', 'a4', 'a5']);
});

test('semilla distinta en cada repaso de la unidad', () => {
  assert.notEqual(R.semilla('a', 'u', { hechos: 0 }), R.semilla('a', 'u', { hechos: 1 }));
  assert.match(R.semilla('a', 'u', { hechos: 3 }, 2), /^repaso-a-u-3-2$/);
});

test('unir: más hechos gana; empate, el último más reciente; desde el más antiguo', () => {
  const s = { u1: { desde: '2026-11-01', paso: 2, toca: '2026-12-01', hechos: 3, aciertos: 3, ultimo: '2026-11-10' },
    u2: { desde: '2026-11-05', paso: 0, toca: '2026-11-07', hechos: 1, aciertos: 0, ultimo: '2026-11-05' },
    u3: { desde: '2026-11-02', paso: 0, toca: '2026-11-04', hechos: 0, aciertos: 0, ultimo: null } };
  const c = { u1: { desde: '2026-10-30', paso: 0, toca: '2026-11-03', hechos: 1, aciertos: 0, ultimo: '2026-11-01' },
    u2: { desde: '2026-11-05', paso: 1, toca: '2026-11-13', hechos: 1, aciertos: 1, ultimo: '2026-11-06' },
    u4: { desde: '2026-11-08', paso: 0, toca: '2026-11-10', hechos: 0, aciertos: 0, ultimo: null } };
  const u = R.unir(s, c);
  assert.equal(u.u1.hechos, 3); assert.equal(u.u1.paso, 2); assert.equal(u.u1.desde, '2026-10-30');
  assert.equal(u.u2.paso, 1);
  assert.deepEqual(u.u3, s.u3);
  assert.deepEqual(u.u4, c.u4);
  assert.deepEqual(R.unir(null, undefined), {});
});
