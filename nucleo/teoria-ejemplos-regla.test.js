// Mesa del 18 nov (docs/teoria.md, 4i): la pestaña «Ejemplos» de una idea se abre después de su «Predice»
// (Teoria.ejemplosAbiertos) y la regla puede traer su propio dibujo (regla.dibujo, Teoria.figuraRegla y el validador).
const test = require('node:test');
const assert = require('node:assert/strict');
const T = require('./teoria.js');
const Kit = require('./kit/kit.js');
// La mesa «pista-libre» y la idea sin dibujo propio en la regla viven desde el 18 nov en MRUV y caída libre.
const fisica = require('../contenido/teoria/fisica/mruv-y-caida-libre.js');
for (const r of fisica.requiere) require('..' + r);

// Piezas de prueba: una que muestra NaN y otra que no es pura.
Kit.registrar({ id: 'prueba-nan', dibujar: d => `<svg viewBox="0 0 10 10"><circle r="${d.r / 0}"/><text>${0 / 0}</text></svg>`, alt: () => 'Un círculo de prueba con un radio roto.' });
let vez = 0;
Kit.registrar({ id: 'prueba-impura', dibujar: () => `<svg viewBox="0 0 10 10"><text>${vez++}</text></svg>`, alt: () => 'Un número de prueba que cambia cada vez.' });

const conRegla = (cambio) => {
  const ideas = fisica.ideas.map((i, k) => (k ? i : Object.assign({}, i, { regla: Object.assign({}, i.regla, cambio) })));
  return T.problemas(Object.assign({}, fisica, { ideas })).filter(p => /regla/.test(p));
};

test('Ejemplos: una idea con Predice se abre recién con la predicción respondida', () => {
  const idea = fisica.ideas[0];
  assert.ok(idea.predice, 'la idea de referencia trae predice');
  assert.equal(T.ejemplosAbiertos(idea, undefined), false, 'sin estado: bloqueada');
  assert.equal(T.ejemplosAbiertos(idea, { casos: 3, momento: 'juega' }), false, 'jugó pero no predijo: bloqueada');
  assert.equal(T.ejemplosAbiertos(idea, { momento: 'predice', prediccion: null }), false, 'en Predice sin responder: bloqueada');
  assert.equal(T.ejemplosAbiertos(idea, { prediccion: idea.predice.opciones[1].id }), true, 'predijo (aunque no coincida): abierta');
  assert.equal(T.ejemplosAbiertos(idea, { hecha: true }), true, 'idea terminada: abierta');
});

test('Ejemplos: una idea sin Predice no se bloquea', () => {
  const sinPredice = Object.assign({}, fisica.ideas[0], { predice: undefined });
  assert.equal(T.ejemplosAbiertos(sinPredice, undefined), true);
  assert.equal(T.ejemplosAbiertos(sinPredice, {}), true);
});

test('Ejemplos: el avance guardado de quien ya predijo sigue abriéndolos (Numeración)', () => {
  const num = require('../contenido/teoria/aritmetica/numeracion.js');
  const conEj = num.ideas.filter(i => Array.isArray(i.ejemplos) && i.ejemplos.length);
  assert.ok(conEj.length >= 1, 'Numeración trae ejemplos');
  // Un avance como los que ya están guardados: { casos, momento, prediccion } por idea (app/teoria.js).
  const guardado = { ideas: Object.fromEntries(conEj.map(i => [i.id, { casos: 4, momento: 'mira', prediccion: i.predice.opciones[0].id }])) };
  for (const i of conEj) {
    assert.equal(T.ejemplosAbiertos(i, guardado.ideas[i.id]), true, `${i.id}: ya predijo`);
    assert.equal(T.ejemplosAbiertos(i, { casos: 4, momento: 'juega' }), false, `${i.id}: todavía no predice`);
  }
});

test('Regla: sin dibujo propio va la figura del último paso de Mira', () => {
  const idea = fisica.ideas[0], m = idea.mira;
  const f = T.figuraRegla(idea);
  assert.equal(f.pieza, m.pieza || idea.pieza);
  assert.deepEqual(f.datos, m.datos);
  assert.deepEqual(f.estado, Object.assign({}, m.base || {}, m.pasos[m.pasos.length - 1].estado || {}));
});

test('Regla: con dibujo propio muestra ese dibujo (la pieza sale de la regla, de Mira o de la idea)', () => {
  const idea = fisica.ideas[0], dib = { datos: idea.mira.datos, estado: { hasta: 1 } };
  const conDib = Object.assign({}, idea, { regla: Object.assign({}, idea.regla, { dibujo: dib }) });
  assert.deepEqual(T.figuraRegla(conDib), { pieza: idea.mira.pieza || idea.pieza, datos: dib.datos, estado: { hasta: 1 } });
  const otra = Object.assign({}, idea, { regla: Object.assign({}, idea.regla, { dibujo: Object.assign({ pieza: 'pista' }, dib) }) });
  assert.equal(T.figuraRegla(otra).pieza, 'pista');
  const sinEstado = Object.assign({}, idea, { regla: Object.assign({}, idea.regla, { dibujo: { datos: dib.datos } }) });
  assert.deepEqual(T.figuraRegla(sinEstado).estado, {});
});

test('Regla: el validador acepta un dibujo puro y rechaza NaN, impuros, piezas que faltan y formas malas', () => {
  const idea = fisica.ideas[0];
  assert.deepEqual(conRegla({ dibujo: { pieza: idea.mira.pieza, datos: idea.mira.datos, estado: {} } }), [], 'un dibujo sano no da problemas');
  assert.deepEqual(conRegla({}), [], 'sin dibujo, como hoy');
  assert.match(conRegla({ dibujo: { pieza: 'prueba-nan', datos: { r: 1 } } }).join('\n'), /regla \(dibujo\).*NaN/);
  assert.match(conRegla({ dibujo: { pieza: 'prueba-impura', datos: {} } }).join('\n'), /regla \(dibujo\).*no es pura/);
  assert.match(conRegla({ dibujo: { pieza: 'no-existe', datos: {} } }).join('\n'), /regla \(dibujo\).*no registrada/);
  assert.match(conRegla({ dibujo: null }).join('\n'), /regla \(dibujo\)/);
  assert.match(conRegla({ dibujo: { pieza: 'pista' } }).join('\n'), /regla \(dibujo\)/, 'sin datos');
});
