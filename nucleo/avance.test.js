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

test('al partir «Magnitudes y vectores», el avance de los vectores pasa a fisica.vectores', () => {
  const est = { avanceV: 1, vistas: { 'fisica.magnitudes-y-vectores': '2026-11-10' }, marcadas: { 'fisica.magnitudes-y-vectores': '2026-11-11' },
    teoria: { 'fisica.magnitudes-y-vectores': { idea: 'resultante', ideas: { unidades: { hecha: true }, resultante: { hecha: true }, componentes: { casos: 2 } } } },
    coleccion: [{ id: 'c1', unidad: 'fisica.magnitudes-y-vectores', mesa: 'suma-libre' }, { id: 'c2', unidad: 'fisica.magnitudes-y-vectores', mesa: 'otra' }] };
  assert.equal(A.migrar(est), true);
  assert.deepEqual(Object.keys(est.teoria['fisica.magnitudes-y-vectores'].ideas), ['unidades']);
  assert.deepEqual(est.teoria['fisica.vectores'].ideas, { resultante: { hecha: true }, componentes: { casos: 2 } });
  assert.equal(est.teoria['fisica.vectores'].idea, 'resultante');
  assert.equal(est.coleccion[0].unidad, 'fisica.vectores');
  assert.equal(est.coleccion[1].unidad, 'fisica.magnitudes-y-vectores');
  assert.equal(est.vistas['fisica.vectores'], '2026-11-10');
  assert.equal(est.marcadas['fisica.vectores'], '2026-11-11', '«Ya la estudié» incluía los vectores');
  assert.equal(A.migrar(est), false, 'la segunda vez no cambia nada');
});

test('al partir «Exponentes, radicales y productos notables», el avance de los productos pasa a algebra.productos-notables', () => {
  const V = 'algebra.exponentes-y-productos-notables', N = 'algebra.productos-notables';
  const est = { avanceV: 1, partidoV: 1, vistas: { [V]: '2026-11-12' }, marcadas: { [V]: '2026-11-13' },
    teoria: { [V]: { idea: 'racionalizar', ideas: { 'leyes-exponentes': { hecha: true }, radicales: { casos: 3 }, 'cuadrado-suma': { hecha: true }, racionalizar: { casos: 1 } } } },
    coleccion: [{ id: 'c1', unidad: V, mesa: 'cubo-se-abre' }, { id: 'c2', unidad: V, mesa: 'rectangulo-x-p-q' }, { id: 'c3', unidad: V, mesa: 'exponentes-con-signo' }],
    glosario: { [V]: { potencia: 'sabe', conjugado: 'repasa', 'producto notable': 'sabe' } } };
  assert.equal(A.migrar(est), true);
  assert.deepEqual(Object.keys(est.teoria[V].ideas).sort(), ['leyes-exponentes', 'radicales']);
  assert.deepEqual(est.teoria[N].ideas, { 'cuadrado-suma': { hecha: true }, racionalizar: { casos: 1 } });
  assert.equal(est.teoria[N].idea, 'racionalizar', 'la idea en curso se va con su unidad');
  assert.equal(est.teoria[V].idea, undefined);
  assert.deepEqual(est.coleccion.map(c => c.unidad), [N, N, V], 'las mesas del cubo y del rectángulo se van; la de exponentes se queda');
  assert.deepEqual(est.glosario[V], { potencia: 'sabe' });
  assert.deepEqual(est.glosario[N], { conjugado: 'repasa', 'producto notable': 'sabe' });
  assert.equal(est.vistas[N], '2026-11-12');
  assert.equal(est.marcadas[N], '2026-11-13', '«Ya la estudié» incluía los productos notables');
  assert.equal(A.migrar(est), false, 'la segunda vez no cambia nada');
  // Quien nunca abrió la unidad: solo queda la marca.
  const nuevo = { avanceV: 1, partidoV: 1 };
  assert.equal(A.migrar(nuevo), true);
  assert.equal(nuevo.partidoExp, 1);
  assert.equal(nuevo.teoria, undefined);
});

test('al partir «MRU, MRUV y caída libre», el avance del MRUV y la caída libre pasa a fisica.mruv-y-caida-libre', () => {
  const V = 'fisica.movimiento-rectilineo', N = 'fisica.mruv-y-caida-libre';
  const est = { avanceV: 1, partidoV: 1, partidoExp: 1, vistas: { [V]: '2026-11-12' }, marcadas: { [V]: '2026-11-13' },
    teoria: { [V]: { idea: 'caida-libre', ideas: { mru: { hecha: true }, 'desplazamiento-distancia': { casos: 2 }, encuentro: { casos: 1 },
      'pendiente-aceleracion': { hecha: true, prediccion: 'c' }, 'caida-libre': { casos: 3 } } } },
    coleccion: [{ id: 'c1', unidad: V, mesa: 'pista-libre' }, { id: 'c2', unidad: V, mesa: 'ida-vuelta' }, { id: 'c3', unidad: V, mesa: 'recta-vt' },
      { id: 'c4', unidad: V, mesa: 'encuentro-libre' }],
    glosario: { [V]: { posicion: 'sabe', aceleracion: 'repasa', 'caida libre': 'sabe', gravedad: 'sabe', 'velocidad relativa': 'repasa' } } };
  assert.equal(A.migrar(est), true);
  assert.deepEqual(Object.keys(est.teoria[V].ideas).sort(), ['desplazamiento-distancia', 'encuentro', 'mru']);
  assert.deepEqual(est.teoria[N].ideas, { 'pendiente-aceleracion': { hecha: true, prediccion: 'c' }, 'caida-libre': { casos: 3 } });
  assert.equal(est.teoria[N].idea, 'caida-libre', 'la idea en curso se va con su unidad');
  assert.equal(est.teoria[V].idea, undefined);
  assert.deepEqual(est.coleccion.map(c => c.unidad), [N, N, N, V], 'la pista, la ida y vuelta en v–t y la recta v–t se van; el encuentro se queda');
  assert.deepEqual(est.glosario[V], { posicion: 'sabe', 'velocidad relativa': 'repasa' });
  assert.deepEqual(est.glosario[N], { aceleracion: 'repasa', 'caida libre': 'sabe', gravedad: 'sabe' });
  assert.equal(est.vistas[N], '2026-11-12');
  assert.equal(est.marcadas[N], '2026-11-13', '«Ya la estudié» incluía el MRUV y la caída libre');
  assert.equal(A.migrar(est), false, 'la segunda vez no cambia nada');
  // Quien nunca abrió la unidad: solo queda la marca.
  const nuevo = { avanceV: 1, partidoV: 1, partidoExp: 1 };
  assert.equal(A.migrar(nuevo), true);
  assert.equal(nuevo.partidoMRU, 1);
  assert.equal(nuevo.teoria, undefined);
});
