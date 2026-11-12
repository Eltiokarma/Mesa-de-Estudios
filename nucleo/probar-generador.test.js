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

test('dentroDeEscala: tope 20 para cualquier distractor y 1000 para las trampas de unidades', () => {
  const { dentroDeEscala, esTrampaDeUnidades } = require('./probar-generador.js');
  const d = (valor, id) => ({ valor, error: id && { id } });
  assert.ok(dentroDeEscala(d(20), 1) && dentroDeEscala(d(0.05), 1));
  assert.ok(!dentroDeEscala(d(21), 1) && !dentroDeEscala(d(1000, 'PR2-raiz'), 1));
  for (const id of ['U2-kilo', 'U3', 'U8-sumar-273', 'QU1-g-kg', 'AU2-cm2', 'RU1-h-min']) assert.ok(dentroDeEscala(d(1000, id), 1) && dentroDeEscala(d(-0.001, id), 1), id);
  assert.ok(!dentroDeEscala(d(1001, 'U2-kilo'), 1));
  assert.ok(!esTrampaDeUnidades(d(1, 'U12')) && !esTrampaDeUnidades(d(1, 'UX')) && !esTrampaDeUnidades(d(1, 'RMP3')) && !esTrampaDeUnidades(d(1)));
  assert.ok(dentroDeEscala(d(50, 'U1-kmh'), 1, { topeUnidades: 100 }) && !dentroDeEscala(d(500, 'U1-kmh'), 1, { topeUnidades: 100 }));
});
