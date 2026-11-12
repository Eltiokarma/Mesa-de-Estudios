// Pruebas de las fugas de nucleo/probar-generador.js con generadores de juguete.
const test = require('node:test');
const assert = require('node:assert/strict');
const { medirFugas, distancia } = require('./probar-generador.js');

const juguete = (fabrica) => ({ id: 'juguete', generar: s => fabrica(s) });
const alt = (valores, correcta) => valores.map((v, i) => ({ letra: 'ABCDE'[i], valor: v, texto: String(v), correcta: i === correcta }));

test('distancia: cuenta trozos distintos', () => {
  assert.equal(distancia('2p/(1 + sen θ)', '2p/(1 + sen θ)'), 0);
  assert.ok(distancia('2p/(1 + sen θ)', '4p/(1 − cos θ)') >= 3);
});

test('extremo: la correcta siempre la menor se detecta', () => {
  const g = juguete(s => ({ _datos: { tipo: 't' }, alternativas: alt([5 + s, 6 + s, 7 + s, 8 + s], 0) }));
  const o = medirFugas(g, { semillas: 30 })['t/'];
  assert.equal(o.extremo, 30);
});

test('extremo: la correcta en medio no se cuenta', () => {
  const g = juguete(s => ({ _datos: { tipo: 't' }, alternativas: alt([5, 6, 7, 8], 1 + (s % 2)) }));
  assert.equal(medirFugas(g, { semillas: 30 })['t/'].extremo, 0);
});

test('central: un solo rasgo cambiado por distractor se detecta', () => {
  const textos = ['r = 2p/(1 + sen θ)', 'r = p/(1 + sen θ)', 'r = 2p/(1 − sen θ)', 'r = 2p/(1 + cos θ)', 'r = 4p/(1 + sen θ)'];
  const g = juguete(() => ({ _datos: { tipo: 't' }, alternativas: textos.map((t, i) => ({ letra: 'ABCDE'[i], valor: t, texto: t, correcta: i === 0 })) }));
  assert.equal(medirFugas(g, { semillas: 5 })['t/'].central, 5);
});
