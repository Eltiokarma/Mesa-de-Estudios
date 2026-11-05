// Medición: resumen por módulo, ganancia pareada, CSV y unión de archivos exportados.
const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('./medicion.js');
const { unir, informe } = require('../herramientas/analizar-medicion.js');

const ev = (alumno, extra) => ({ t: `2026-12-14T10:00:0${Math.floor(Math.random() * 9)}Z`, alumno, grado: '5', colegio: 'ABC', version: '0.2.0', modulo: 'm1', ...extra });
const datos = [
  { ...ev('a', { tipo: 'prueba', fase: 'entrada', aciertos: 1, total: 3 }), t: '1' },
  { ...ev('a', { tipo: 'prueba', fase: 'salida', aciertos: 3, total: 3 }), t: '2' },
  { ...ev('b', { tipo: 'prueba', fase: 'entrada', aciertos: 2, total: 3 }), t: '3' },  // sin salida: no entra a la ganancia
  { ...ev('a', { tipo: 'prediccion', problema: 'p1', correcta: false, error: 'ES20', respaldo: 'documentado' }), t: '4' },
  { ...ev('a', { tipo: 'prediccion', problema: 'p2', correcta: false, error: 'ES20', respaldo: 'documentado' }), t: '5' },
  { ...ev('b', { tipo: 'prediccion', problema: 'p3', correcta: true, error: '' }), t: '6' },
];

test('resumen por módulo con ganancia solo de alumnos pareados', () => {
  const [r] = M.resumir(datos);
  assert.equal(r.alumnos, 2);
  assert.equal(r.pareados, 1);
  assert.ok(Math.abs(r.ganancia - (3 / 3 - 1 / 3)) < 1e-12);
  assert.ok(Math.abs(r.entrada - (1 / 3 + 2 / 3) / 2) < 1e-12);
  assert.equal(r.predicciones, 3);
  assert.ok(Math.abs(r.acierto - 1 / 3) < 1e-12);
  assert.deepEqual(r.errores, [{ id: 'ES20', n: 2 }]);
});

test('el CSV tiene una fila por evento y escapa comas', () => {
  const csv = M.aCSV([{ ...datos[0], modulo: 'a,b' }]);
  const filas = csv.trim().split('\n');
  assert.equal(filas.length, 2);
  assert.ok(filas[1].includes('"a,b"'));
});

test('unir quita eventos repetidos entre archivos e informe los resume', () => {
  const todos = unir([datos, datos.slice(0, 3)]);
  assert.equal(todos.length, datos.length);
  const md = informe(todos);
  assert.match(md, /2 alumnos/);
  assert.match(md, /\| ES20 \| 2 \| documentado \|/);
});

test('guardar: agrega el perfil anónimo y no guarda sin alumno', () => {
  const datos = {};
  const almacen = { getItem: k => datos[k] ?? null, setItem: (k, v) => { datos[k] = v; } };
  assert.equal(M.guardar({ tipo: 'prediccion', modulo: 'x' }, '1.0', null, almacen), false);
  datos['lab-v1'] = JSON.stringify({ alumno: 'a1', grado: '4', colegio: 'ABC', nombre: 'Ana' });
  assert.equal(M.guardar({ tipo: 'prediccion', modulo: 'x', correcta: true }, '1.0', null, almacen), true);
  const l = M.eventosGuardados(almacen);
  assert.equal(l.length, 1);
  assert.equal(l[0].alumno, 'a1'); assert.equal(l[0].grado, '4'); assert.equal(l[0].colegio, 'ABC');
  assert.ok(!JSON.stringify(l).includes('Ana'), 'nunca se guarda el nombre');
});
