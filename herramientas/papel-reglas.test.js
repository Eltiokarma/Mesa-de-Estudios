// Reglas del papel de las unidades con calidad 2 (herramientas/papel-reglas.js, Etapa 5, 19 nov 2026): cada regla con un
// caso que la viola y uno que la cumple, y todas contra los papel.json del repo (los escritos a mano y los generados).
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('./papel-reglas.js');

const C2 = new Set(['fisica.prueba']);
const ficha = (extra = {}) => Object.assign({ id: 'prueba', formato: 'predicciones', unidades: ['fisica.prueba'] }, extra);
const problema = (extra = {}) => Object.assign({
  id: 'p1', nivel: 'básico', enunciado: 'Una combi recorre 100 m en 4 s. ¿Qué rapidez lleva? Datos: Rapidez: lo que recorre entre el tiempo que tarda.',
  respuesta: 'A) 25 m/s', pasos: ['v = 100 m ÷ 4 s', 'v = 25 m/s'],
}, extra);
const de = (regla, problemas, f = ficha(), c2 = C2) => P.revisar({ id: 'prueba', ficha: f, papel: { problemas: [].concat(problemas) } }, c2).filter(h => h.regla === regla);

test('papel-unidad: la respuesta lleva su unidad cuando la solución la escribe', () => {
  assert.deepEqual(de('papel-unidad', problema()), []);
  assert.match(de('papel-unidad', problema({ respuesta: 'A) 25' }))[0].que, /dice «25» sin unidad y la solución termina en «25 m\/s»/);
  assert.equal(de('papel-unidad', problema({ respuesta: 'Tarda 4 s y avanza 100.', pasos: ['t = 4 s', 'd = 100 m'] })).length, 1, 'también en una respuesta escrita a mano');
  // Un número sin magnitud (una cuenta, una cifra, una letra que vale un número) no pide unidad.
  assert.deepEqual(de('papel-unidad', problema({ respuesta: '9801.', pasos: ['99² = (100 − 1)²', '= 10 000 − 200 + 1 = 9801'] })), []);
  assert.deepEqual(de('papel-unidad', problema({ respuesta: 'C) 2√2 m', pasos: ['√8 = 2√2', 'El lado mide 2√2 m'] })), [], 'el 2 de 2√2 es un coeficiente');
  assert.deepEqual(de('papel-unidad', problema({ respuesta: '[Ar] 3d⁶, con 4 electrones desapareados.', pasos: ['Pierde los dos 4s', 'Quedan 4 solos'] })), [], '«4s» es un orbital');
});

test('papel-datos: todo problema da sus datos, en el campo datos o tras «Datos:»', () => {
  assert.deepEqual(de('papel-datos', problema()), []);
  assert.deepEqual(de('papel-datos', problema({ enunciado: 'Una combi recorre 100 m en 4 s. ¿Qué rapidez lleva?', datos: ['Rapidez: lo que recorre entre el tiempo que tarda.'] })), []);
  assert.equal(de('papel-datos', problema({ enunciado: 'Una combi recorre 100 m en 4 s. ¿Qué rapidez lleva?' })).length, 1);
  assert.equal(de('papel-datos', problema({ enunciado: 'Una combi recorre 100 m en 4 s. ¿Qué rapidez lleva?', datos: [] })).length, 1);
});

test('papel-unidades: con dos unidades o más, cada problema dice de cuáles es', () => {
  const dos = ficha({ unidades: ['fisica.prueba', 'fisica.otra'] });
  assert.equal(de('papel-unidades', problema(), dos).length, 1);
  assert.deepEqual(de('papel-unidades', problema({ unidades: ['fisica.prueba'] }), dos), []);
  assert.match(de('papel-unidades', problema({ unidades: ['fisica.ajena'] }), dos)[0].que, /no es una unidad de la plantilla/);
  assert.deepEqual(de('papel-unidades', problema()), [], 'con una sola unidad no hace falta');
});

test('solo entran las plantillas y los problemas de una unidad con calidad 2; lectura y «rehacer» quedan fuera', () => {
  const sin = problema({ enunciado: '¿Qué rapidez lleva?', respuesta: '25', unidades: undefined });
  const todas = (f, ps = sin, c2 = C2) => P.revisar({ id: 'prueba', ficha: f, papel: { problemas: [].concat(ps) } }, c2);
  assert.equal(todas(ficha()).length, 2, 'sin datos y sin unidad');
  assert.deepEqual(todas(ficha(), sin, new Set()), [], 'ninguna unidad con calidad 2');
  assert.deepEqual(todas(ficha({ formato: 'lectura' })), []);
  assert.deepEqual(todas(ficha({ rehacer: true })), [], 'una escena que espera rehacerse');
  // En una plantilla de dos unidades, el problema de la otra unidad no se revisa.
  const dos = ficha({ unidades: ['fisica.prueba', 'fisica.otra'] });
  assert.deepEqual(todas(dos, Object.assign({}, sin, { unidades: ['fisica.otra'] })), []);
  assert.equal(todas(dos, Object.assign({}, sin, { unidades: ['fisica.prueba'] })).length, 2);
});

test('el papel de las unidades con calidad 2 cumple las reglas (o está en la lista de pendientes)', t => {
  const c2 = P.unidadesCalidad2();
  assert.ok(c2.size >= 15, 'hay unidades con calidad 2');
  const fallan = [], vivas = new Set();
  for (const x of P.plantillasConPapel()) {
    const r = P.aplicar(x, c2);
    fallan.push(...r.fallan.map(h => `plantillas/${h.plantilla}/papel.json ${h.problema}: [${h.regla}] ${h.que}`));
    for (const h of r.pendientes) vivas.add(P.EXCEPCIONES.find(e => e.regla === h.regla && e.plantilla === h.plantilla && (e.problema === '*' || e.problema === h.problema)));
  }
  assert.deepEqual(fallan, [], fallan.join('\n'));
  // Una excepción que ya no cubre nada no rompe la prueba (otra sesión pudo corregir el papel): se avisa para borrarla.
  for (const e of P.EXCEPCIONES) if (!vivas.has(e)) t.diagnostic(`excepción que ya no hace falta (bórrala de herramientas/papel-reglas.js): ${e.regla} ${e.plantilla} ${e.problema}`);
});

test('cada excepción del papel nombra su regla, su plantilla, su unidad, su motivo y su fecha', () => {
  for (const x of P.EXCEPCIONES) {
    assert.ok(P.REGLAS[x.regla], JSON.stringify(x));
    assert.ok(x.plantilla && x.problema && x.unidad && typeof x.motivo === 'string' && x.motivo.length >= 10, JSON.stringify(x));
    assert.match(x.fecha || '', /^\d{4}-\d{2}-\d{2}$/, JSON.stringify(x));
  }
});
