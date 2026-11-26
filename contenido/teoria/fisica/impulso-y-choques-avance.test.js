'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const Avance = require('../../../nucleo/avance.js');
const U = 'fisica.impulso-y-choques';
const anteriores = ['impulso', 'conservacion', 'elastico-inelastico', 'restitucion', 'centro-masa'];

test('Impulso y choques: conserva el estudio previo y renueva solo las predicciones sin huella', () => {
  const ideas = Object.fromEntries(anteriores.map(id => [id, { hecha: true, prediccion: 'vieja', casos: 3 }]));
  ideas.conservacion.prediccionDe = 'huella-guardada';
  const ajena = { ideas: { otra: { hecha: true, prediccion: 'x', casos: 7 } } };
  const est = { avanceV: 1, vistas: { [U]: '2026-11-10' }, marcadas: {},
    teoria: { [U]: { ideas, idea: 'restitucion' }, 'fisica.unidad-ajena': ajena } };
  const copiaAjena = JSON.stringify(ajena);
  assert.equal(Avance.migrar(est), true);
  assert.equal(est.prediccionIC9, 1);
  assert.equal(est.estudiadaIC9, 1);
  assert.equal(est.marcadas[U], '2026-11-10');
  for (const id of anteriores) {
    assert.equal(ideas[id].hecha, true);
    assert.equal(ideas[id].casos, 3);
    assert.equal(ideas[id].prediccion, id === 'conservacion' ? 'vieja' : undefined);
  }
  assert.equal(ideas.conservacion.prediccionDe, 'huella-guardada');
  assert.equal(ideas['cantidad-movimiento'], undefined, 'no regala la idea nueva');
  assert.equal(est.teoria[U].idea, 'restitucion', 'mantiene el lugar del alumno');
  assert.equal(JSON.stringify(est.teoria['fisica.unidad-ajena']), copiaAjena);
  ideas.impulso.prediccion = 'respuesta-nueva';
  assert.equal(Avance.migrar(est), false, 'la migración se aplica una sola vez');
  assert.equal(ideas.impulso.prediccion, 'respuesta-nueva');
});

test('Impulso y choques: no concede estudio a un avance parcial ni modifica una marca existente', () => {
  for (let cantidad = 0; cantidad < anteriores.length; cantidad++) {
    const ideas = Object.fromEntries(anteriores.slice(0, cantidad).map(id => [id, { hecha: true }]));
    const est = { avanceV: 1, teoria: { [U]: { ideas } }, marcadas: {} };
    Avance.migrar(est);
    assert.equal(est.marcadas[U], undefined, `${cantidad} ideas no completa las cinco`);
  }
  const est = { avanceV: 1, marcadas: { [U]: '2026-11-05' }, teoria: {} };
  Avance.migrar(est);
  assert.equal(est.marcadas[U], '2026-11-05');
  const sinFecha = { avanceV: 1, teoria: { [U]: { ideas: Object.fromEntries(anteriores.map(id => [id, { hecha: true }])) } } };
  Avance.migrar(sinFecha);
  assert.equal(sinFecha.marcadas[U], '2026-11-22');
});
