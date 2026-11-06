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

// ---------- Pruebas de entrada y salida por curso ----------
const { informeCursos } = require('../herramientas/analizar-medicion.js');
// Tres alumnos en física: a (A→B) y b (B→A) hacen las dos; c solo la entrada.
const pr = (alumno, fase, forma, aciertos, previas) => ({ t: `${fase}-${alumno}`, alumno, tipo: 'prueba', fase, curso: 'fisica', forma, orden: 'AB', aciertos, total: 4, previas });
const it = (alumno, fase, n, error, plantilla = 'mruv') => ({ t: `${fase}-${alumno}-${n}`, alumno, tipo: 'item', fase, curso: 'fisica', item: `fis-0${n}A`, plantilla, correcta: !error, error: error || '' });
const cursoEv = [
  pr('a', 'entrada', 'A', 1, 0), it('a', 'entrada', 1, 'G2-lee-el-eje'), it('a', 'entrada', 2, 'C1-aceleracion-cero-en-la-cima'), it('a', 'entrada', 3, 'C1-aceleracion-cero-en-la-cima', 'dinamica'), it('a', 'entrada', 4, ''),
  pr('a', 'salida', 'B', 3), it('a', 'salida', 1, ''), it('a', 'salida', 2, 'C1-aceleracion-cero-en-la-cima'), it('a', 'salida', 3, '', 'dinamica'), it('a', 'salida', 4, ''),
  pr('b', 'entrada', 'B', 2, 3), it('b', 'entrada', 1, 'G2-lee-el-eje'),
  pr('b', 'salida', 'A', 4), it('b', 'salida', 1, ''),
  pr('c', 'entrada', 'A', 0, 0), it('c', 'entrada', 1, 'G2-lee-el-eje'),
  { t: 'x', alumno: 'a', tipo: 'prediccion', modulo: 'mruv', correcta: true }, // de una escena: no entra al resumen por curso
];

test('resumen por curso: puntajes, ganancia de Hake y errores antes y después', () => {
  const [r] = M.resumirCursos(cursoEv);
  assert.equal(r.curso, 'fisica');
  assert.equal(r.alumnosEntrada, 3); assert.equal(r.alumnosSalida, 2); assert.equal(r.pareados, 2);
  assert.ok(Math.abs(r.entrada - (1 / 4 + 2 / 4 + 0) / 3) < 1e-12);
  // Pareados: entrada (0,25 + 0,5)/2 = 0,375; salida (0,75 + 1)/2 = 0,875; <g> = 0,5 / 0,625 = 0,8.
  assert.ok(Math.abs(r.entradaPareados - 0.375) < 1e-12);
  assert.ok(Math.abs(r.salidaPareados - 0.875) < 1e-12);
  assert.ok(Math.abs(r.hake - 0.8) < 1e-12);
  // g individuales: a (0,75 − 0,25)/0,75 = 2/3; b (1 − 0,5)/0,5 = 1.
  assert.ok(Math.abs(r.hakeIndividual - (2 / 3 + 1) / 2) < 1e-12);
  assert.equal(r.entradaConPrevias, 1);
  assert.deepEqual(r.porForma.A, { alumnos: 2, entrada: 0.125 });
  assert.deepEqual(r.porForma.B, { alumnos: 1, entrada: 0.5 });
  const err = Object.fromEntries(r.errores.map(e => [e.id, e]));
  // G2: a y b en la entrada (c no está pareado), nadie en la salida. C1: a antes y después (se cuenta una vez por alumno).
  assert.deepEqual([err['G2-lee-el-eje'].antes, err['G2-lee-el-eje'].despues, err['G2-lee-el-eje'].antesTodos], [2, 0, 3]);
  assert.deepEqual([err['C1-aceleracion-cero-en-la-cima'].antes, err['C1-aceleracion-cero-en-la-cima'].despues], [1, 1]);
  const pl = Object.fromEntries(r.plantillas.map(p => [p.id, p]));
  assert.ok(Math.abs(pl.mruv.entrada - 1 / 5) < 1e-12); // 5 ítems de mruv en la entrada, 1 bien
  assert.equal(pl.dinamica.salida, 1);
});

test('resumen por curso: sin pareados no hay ganancia, y el resumen por módulo no se mezcla', () => {
  const [r] = M.resumirCursos(cursoEv.filter(e => e.fase !== 'salida'));
  assert.equal(r.pareados, 0); assert.equal(r.hake, null); assert.equal(r.hakeIndividual, null);
  assert.deepEqual(M.resumir(cursoEv).map(x => x.modulo), ['mruv']);
});

test('el informe incluye la tabla por curso y los errores con su descripción', () => {
  const banco = { fisica: { errores: { 'G2-lee-el-eje': { describe: 'Lee el corte con el eje', respaldo: 'documentado' } } } };
  const md = informeCursos(cursoEv, banco);
  assert.match(md, /\| fisica \| 25 % \(3\) \| 88 % \(2\) \| 2 \| 38 % \| 88 % \| 0,80 \| 0,83 \|/);
  assert.match(md, /\| G2-lee-el-eje \| Lee el corte con el eje \| documentado \| 2 \| 0 \| -2 \|/);
  assert.match(md, /1 alumno\(s\) hicieron la entrada de fisica después de abrir/);
  assert.equal(informeCursos([]), '');
  // unir no confunde dos ítems respondidos en el mismo milisegundo
  assert.equal(unir([[{ ...cursoEv[1], t: 'z' }, { ...cursoEv[2], t: 'z' }]]).length, 2);
  // el CSV lleva las columnas nuevas al final
  assert.deepEqual(M.COLUMNAS.slice(-12), ['curso', 'forma', 'orden', 'banco', 'item', 'par', 'plantilla', 'origen', 'previas', 'dias', 'que', 'accion']);
  assert.match(M.aCSV([cursoEv[0]]), /fisica,A,AB,,,,,,0,,,/);
  // Las habilitaciones del profesor y el cambio de alumno no entran al resumen por curso.
  assert.equal(M.resumirCursos([...cursoEv, { t: 'h', alumno: 'a', tipo: 'habilitacion', que: 'salida', curso: 'fisica', origen: 'profesor' }])[0].alumnosEntrada, 3);
});
