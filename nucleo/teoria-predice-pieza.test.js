// Auditoría de la Etapa 6: el validador dibuja Predice y su revelar con la misma pieza que la app (app/teoria.js,
// dibujar): la del dibujo (dib.pieza) si la trae; si no, la del momento (p.pieza) o la de la idea.
const test = require('node:test');
const assert = require('node:assert/strict');
const T = require('./teoria.js');
const Kit = require('./kit/kit.js');
const fisica = require('../contenido/teoria/fisica/mruv-y-caida-libre.js');
for (const r of fisica.requiere) require('..' + r);

// Una pieza que muestra NaN y otra que solo sabe dibujar sus propios datos.
Kit.registrar({ id: 'prueba-predice-nan', dibujar: () => `<svg viewBox="0 0 10 10"><text>${0 / 0}</text></svg>`, alt: () => 'Un número de prueba que sale roto.' });
Kit.registrar({ id: 'prueba-predice-propia', dibujar: d => { if (!d || d.propia !== 1) throw new Error('datos ajenos'); return '<svg viewBox="0 0 10 10"><text>1</text></svg>'; }, alt: () => 'Un número de prueba con sus propios datos.' });

const idea0 = fisica.ideas[0];
// Datos que la pieza de la idea dibuja bien (los del dibujo de Predice de la unidad, hechos para esa pieza).
const datosIdea = idea0.predice.dibujo.datos;
const conPredice = cambio => {
  const ideas = fisica.ideas.map((i, k) => (k ? i : Object.assign({}, i, { predice: Object.assign({}, i.predice, cambio) })));
  return T.problemas(Object.assign({}, fisica, { ideas }), { semillas: 5 }).filter(p => / predice/.test(p));
};

test('el dibujo de referencia es sano con la pieza de la idea', () => {
  assert.equal(idea0.predice.dibujo.pieza || idea0.predice.pieza || idea0.pieza, idea0.pieza);
  assert.deepEqual(conPredice({ pieza: undefined, dibujo: { datos: datosIdea }, revelar: { datos: datosIdea } }), []);
});

test('Predice: el dibujo con pieza propia se valida con esa pieza, no con la de la idea', () => {
  const nan = { pieza: 'prueba-predice-nan', datos: datosIdea };
  assert.match(conPredice({ dibujo: nan }).join('\n'), /predice\b[^(]*NaN/, 'el dibujo de Predice se dibuja con su pieza');
  assert.match(conPredice({ revelar: nan }).join('\n'), /predice \(revelar\).*NaN/, 'el revelar se dibuja con su pieza');
  const propia = { pieza: 'prueba-predice-propia', datos: { propia: 1 } };
  assert.deepEqual(conPredice({ dibujo: propia, revelar: propia }), [], 'datos de su propia pieza: sin problemas');
});

test('Predice: sin pieza en el dibujo manda la del momento y después la de la idea, como antes', () => {
  assert.match(conPredice({ pieza: 'prueba-predice-nan', dibujo: { datos: datosIdea } }).join('\n'), /predice\b[^(]*NaN/);
  assert.deepEqual(conPredice({ pieza: undefined, dibujo: { datos: datosIdea }, revelar: { datos: datosIdea } }), []);
});
