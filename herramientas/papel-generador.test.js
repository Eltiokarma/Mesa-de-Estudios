// El papel que se arma desde los generadores (herramientas/papel-generador.js) está al día y cumple la regla 6.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { armar, generados, texto } = require('./papel-generador.js');

test('el papel generado desde cada generador está al día y trae de 5 a 10 problemas', () => {
  const ids = generados();
  assert.ok(ids.length >= 22);
  for (const id of ids) {
    const d = armar(id);
    assert.ok(d.problemas.length >= 5 && d.problemas.length <= 10, id);
    for (const q of d.problemas) assert.ok(q.enunciado && q.respuesta && q.pasos.length, `${id} ${q.id}`);
    assert.equal(fs.readFileSync(path.join(__dirname, '..', 'plantillas', id, 'papel.json'), 'utf8'), texto(d), `${id}: corre node herramientas/papel-generador.js`);
  }
});
