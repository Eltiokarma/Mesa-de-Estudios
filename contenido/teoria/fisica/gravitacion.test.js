'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Teoria = require('../../../nucleo/teoria.js');
const Glosario = require('../../../nucleo/glosario.js');
const def = require('./gravitacion.js');
for (const p of def.requiere) require(path.join(__dirname, '../../..', p));

test('Gravitación conserva sus cuatro ideas y añade energía antes de órbitas y escape al final', () => {
  assert.deepEqual(def.ideas.map(i => i.id), ['cuadrado-inverso', 'campo-gravitatorio', 'energia-gravitatoria', 'orbita-circular', 'leyes-de-kepler', 'escape']);
  assert.equal(def.ideas.reduce((n, i) => n + i.ejemplos.length, 0), 90);
  for (const idea of def.ideas) for (const nivel of [1, 2, 3]) assert.equal(idea.ejemplos.filter(e => e.nivel === nivel).length, 5);
  const porIdea = Glosario.porIdea(def);
  for (const [n, entradas] of porIdea.entries()) assert.ok(entradas.length >= 2 && entradas.length <= 4, `${def.ideas[n].id}: ${entradas.length} términos`);
  for (const termino of ['energía potencial gravitatoria', 'nivel de referencia']) {
    const entrada = def.glosario.find(g => g.termino === termino);
    assert.equal(entrada.local, true, `${termino}: el tooltip debe explicar el contexto gravitatorio exterior.`);
  }
  assert.deepEqual(Glosario.revisar(def), []);
});

test('Gravitación pasa el contrato de calidad 2 en 400 semillas sin marcarse', () => {
  // La copia permite aplicar todas las reglas a una unidad todavía pendiente
  // de auditoría y lectura en frío. No se modifica la definición publicada.
  const problemas = Teoria.problemas({ ...def, calidad: 2 }, { semillas: 400 });
  assert.deepEqual(problemas, [], problemas.join('\n'));
});
