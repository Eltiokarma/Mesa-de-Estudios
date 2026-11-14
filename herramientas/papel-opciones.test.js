// Alternativas de los problemas de papel (nucleo/papel-opciones.js): cada valor lo da el motor de su plantilla
// (regla 1), cada error tiene código, respaldo y explicación, y las alternativas se distinguen entre sí.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const PO = require('../nucleo/papel-opciones.js');
const P = require('../nucleo/predicciones.js');
const Azar = require('../nucleo/azar.js');

const RAIZ = path.join(__dirname, '..');
const conPreguntas = fs.readdirSync(path.join(RAIZ, 'plantillas'))
  .map(id => ({ id, ruta: path.join(RAIZ, 'plantillas', id, 'papel.json') }))
  .filter(x => fs.existsSync(x.ruta))
  .map(x => ({ ...x, papel: JSON.parse(fs.readFileSync(x.ruta, 'utf8')) }))
  // Los papel.json de lectura traen otro campo «preguntas» (las de su texto): solo cuentan las que tienen correcta y errores.
  .filter(x => x.papel.problemas.some(p => PO.tienePreguntas(p)));

test('hay al menos una plantilla con preguntas de papel (el molde es gases)', () => {
  assert.ok(conPreguntas.some(x => x.id === 'gases'));
});

for (const { id, papel } of conPreguntas) {
  test(`${id}: las preguntas de papel coinciden con el motor y se distinguen`, () => {
    const motor = require(path.join(RAIZ, 'plantillas', id, 'motor.js'));
    const mal = papel.problemas.flatMap(p => PO.validar(p, motor, P));
    assert.deepEqual(mal, []);
    // Los ids de pregunta no se repiten en el archivo (el repaso los usa como problema).
    const ids = papel.problemas.flatMap(p => (p.preguntas || []).map(q => q.id));
    assert.equal(new Set(ids).size, ids.length);
    // Las alternativas se arman y traen una sola correcta, con al menos tres opciones.
    for (const p of papel.problemas) for (const pq of p.preguntas || []) {
      const alts = PO.alternativas(pq, Azar.crear(`prueba-${pq.id}`), P);
      assert.ok(alts.length >= 3, `${pq.id}: solo ${alts.length} alternativas`);
      assert.equal(alts.filter(a => a.correcta).length, 1);
    }
  });
}

test('campo «valor»: el número mismo, o el campo valor si el motor devuelve un objeto', () => {
  const motor = { n: () => 7, o: () => ({ valor: 3, simple: 9 }), t: () => 'tautología' };
  assert.equal(PO.calcular(motor, { fn: 'n', args: [], campo: 'valor' }), 7);
  assert.equal(PO.calcular(motor, { fn: 'o', args: [], campo: 'valor' }), 3);
  assert.equal(PO.calcular(motor, { fn: 'o', args: [], campo: 'simple' }), 9);
  assert.equal(PO.calcular(motor, { fn: 't', args: [], campo: 'valor' }), 'tautología');
});
