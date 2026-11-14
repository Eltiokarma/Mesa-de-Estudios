const test = require('node:test');
const assert = require('node:assert/strict');
const A = require('./avance.js');

const U = { id: 'fisica.mru', teoria: { ideas: 2 } };
const base = () => ({ alumno: 'a1', vistas: {}, marcadas: {}, teoria: {}, examenes: {}, repaso: {} });

test('avance: abrir una unidad es visita, no estudio', () => {
  const est = base(); est.vistas[U.id] = '2026-11-14';
  const r = A.nivel(est, U, A.indice([], 'a1'));
  assert.equal(r.nivel, 0); assert.equal(r.nombre, 'Visitada');
  assert.equal(A.estudiadas(est, [U], {}), 0);
});

test('avance: sin nada, «sin empezar»', () => {
  assert.equal(A.nivel(base(), U, {}).nivel, -1);
});

test('avance: la estudié con la teoría completa o marcándola', () => {
  const est = base();
  est.teoria[U.id] = { ideas: { a: { hecha: true } } };
  assert.equal(A.nivel(est, U, {}).nivel, 0, 'una de dos ideas no basta');
  est.teoria[U.id].ideas.b = { hecha: true };
  assert.equal(A.nivel(est, U, {}).nivel, 1);
  const e2 = base(); e2.marcadas[U.id] = '2026-11-14';
  assert.equal(A.nivel(e2, U, {}).nivel, 1);
});

test('avance: con ayuda cuenta aciertos con retroalimentación del mismo alumno', () => {
  const ev = [
    { alumno: 'a1', unidad: U.id, tipo: 'prediccion', correcta: true },
    { alumno: 'a1', unidad: U.id, tipo: 'teoria', momento: 'ahora-tu', correcta: true },
    { alumno: 'otro', unidad: U.id, tipo: 'prediccion', correcta: true },
    { alumno: 'a1', unidad: U.id, tipo: 'prediccion', correcta: false },
  ];
  assert.equal(A.nivel(base(), U, A.indice(ev, 'a1')).nivel, 0, 'dos aciertos propios no bastan');
  ev.push({ alumno: 'a1', unidad: U.id, tipo: 'previo', correcta: true });
  assert.equal(A.nivel(base(), U, A.indice(ev, 'a1')).nivel, 2);
});

test('avance: sin ayuda con 4 de 5 en el simulacro, y la recuerdo con el repaso otro día', () => {
  const est = base();
  est.examenes[U.id] = { ultimo: { aciertos: 3, total: 5 } };
  assert.equal(A.nivel(est, U, {}).nivel, 0);
  est.examenes[U.id].ultimo.aciertos = 4;
  assert.equal(A.nivel(est, U, {}).nivel, 3);
  est.repaso[U.id] = { desde: '2026-11-10', ultimo: '2026-11-10', aciertos: 1 };
  assert.equal(A.nivel(est, U, {}).nivel, 3, 'el mismo día no es recordar');
  est.repaso[U.id].ultimo = '2026-11-14';
  assert.equal(A.nivel(est, U, {}).nivel, 4);
  assert.equal(A.nivel(est, U, {}).falta, '');
});

test('avance: migrar deja las visitas, crea marcadas y se hace una sola vez', () => {
  const est = { vistas: { x: '2026-11-01' } };
  assert.equal(A.migrar(est), true);
  assert.deepEqual(est.vistas, { x: '2026-11-01' });
  assert.deepEqual(est.marcadas, {});
  assert.equal(A.migrar(est), false);
});
