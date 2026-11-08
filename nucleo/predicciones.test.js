// Pruebas de nucleo/predicciones.js: formato con coma, raíces simplificadas y las opciones de armar.
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('./predicciones.js');
const Azar = require('./azar.js');

test('radical: entero, a√b, √b/2 o decimales', () => {
  assert.equal(P.radical(5), '5');
  assert.equal(P.radical(Math.sqrt(75)), '5√3');
  assert.equal(P.radical(Math.sqrt(97)), '√97');
  assert.equal(P.radical(-2 * Math.SQRT2), '−2√2');
  assert.equal(P.radical(Math.sqrt(26) / 2), '√26/2');
  assert.equal(P.radical(3.5), '3,5');
  assert.equal(P.radical(0), '0');
  assert.equal(P.radical(1.234), '1,23');
});

test('armar descarta ceros y negativos salvo con negativos: true', () => {
  const errores = [{ id: 'a', valor: -3, explicacion: 'x', respaldo: 'hipotesis' }, { id: 'b', valor: 0, explicacion: 'x', respaldo: 'hipotesis' },
    { id: 'c', valor: 4, explicacion: 'x', respaldo: 'hipotesis' }];
  assert.equal(P.armar({ correcta: 2, errores, rng: Azar.crear(1) }).length, 2);
  const con = P.armar({ correcta: -2, errores, rng: Azar.crear(1), negativos: true });
  assert.equal(con.length, 4);
  assert.deepEqual(con.map(a => a.texto).sort(), ['0', '4', '−2', '−3'].sort());
});

test('armar con texto propio compara lo que ve el alumno', () => {
  const errores = [{ id: 'a', valor: Math.sqrt(12), explicacion: 'x', respaldo: 'hipotesis' }, { id: 'b', valor: 2 * Math.sqrt(3) + 1e-12, explicacion: 'x', respaldo: 'hipotesis' }];
  const alt = P.armar({ correcta: 5, errores, rng: Azar.crear(2), texto: x => `${P.radical(x)} u` });
  assert.deepEqual(alt.map(a => a.texto).sort(), ['2√3 u', '5 u']);
});
