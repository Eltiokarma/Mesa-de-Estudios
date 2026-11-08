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
  assert.deepEqual(M.COLUMNAS.slice(-14, -2), ['curso', 'forma', 'orden', 'banco', 'item', 'par', 'plantilla', 'origen', 'previas', 'dias', 'que', 'accion']);
  assert.deepEqual(M.COLUMNAS.slice(-2), ['respuestas', 'nose']);
  assert.match(M.aCSV([cursoEv[0]]), /fisica,A,AB,,,,,,0,,,/);
  // Las habilitaciones del profesor y el cambio de alumno no entran al resumen por curso.
  assert.equal(M.resumirCursos([...cursoEv, { t: 'h', alumno: 'a', tipo: 'habilitacion', que: 'salida', curso: 'fisica', origen: 'profesor' }])[0].alumnosEntrada, 3);
});

// ---------- Formato lectura: paso previo y respuesta por código RV ----------
const { informeLectura } = require('../herramientas/analizar-medicion.js');
const lec = (alumno, n, extra) => ({ t: `L${alumno}${n}`, alumno, grado: '4', colegio: 'ABC', version: '0.6.0', modulo: 'lectura-verbal', ...extra });
const U1 = 'razonamiento-verbal.tema-e-idea-principal', U2 = 'razonamiento-verbal.inferencias';
const lecturaEv = [
  lec('a', 1, { tipo: 'lectura', unidad: U1, problema: 't001v1', ms: 60000 }),
  lec('a', 2, { tipo: 'previo', unidad: U1, problema: 't001v1.p1', opcion: 'o5', correcta: false, error: 'RV1', respaldo: 'parcial', ms: 9000 }),
  lec('a', 3, { tipo: 'prediccion', unidad: U1, problema: 't001v1.p1', opcion: '2', correcta: false, error: 'RV1', respaldo: 'parcial', ms: 8000 }),
  lec('a', 4, { tipo: 'previo', unidad: U2, problema: 't001v1.p3', opcion: 'convencer', correcta: false, error: '', respaldo: '', ms: 3000 }),
  lec('a', 5, { tipo: 'prediccion', unidad: U2, problema: 't001v1.p3', opcion: '1', correcta: true, error: '', respaldo: '', ms: 4000 }),
  lec('b', 1, { tipo: 'lectura', unidad: U1, problema: 't001v1', ms: 90000 }),
  lec('b', 2, { tipo: 'previo', unidad: U1, problema: 't001v1.p1', opcion: 'o2', correcta: true, error: '', respaldo: '', ms: 5000 }),
  lec('b', 3, { tipo: 'prediccion', unidad: U1, problema: 't001v1.p1', opcion: '4', correcta: false, error: 'RV3', respaldo: 'parcial', ms: 6000 }),
  lec('b', 4, { tipo: 'prueba', fase: 'entrada', unidad: U1, problema: 't000av1', aciertos: 2, total: 3, respuestas: '215', ms: 100 }),
  { t: 'p', alumno: 'a', tipo: 'prediccion', modulo: 'mruv', correcta: false, error: 'G2' }, // de otro formato: no entra
];

test('resumen de lectura: el paso previo va aparte de la respuesta, por unidad y por código', () => {
  const r = M.resumirLectura(lecturaEv);
  assert.deepEqual(r.map(x => x.modulo), ['lectura-verbal']);
  const [m] = r;
  assert.equal(m.alumnos, 2);
  assert.equal(m.textosLeidos, 2);
  assert.equal(m.msLecturaMediana, 75000);
  assert.equal(m.previos, 3); assert.ok(Math.abs(m.aciertoPrevio - 1 / 3) < 1e-12);
  assert.equal(m.respuestas, 3); assert.ok(Math.abs(m.aciertoRespuesta - 1 / 3) < 1e-12);
  assert.deepEqual(m.codigos, [{ id: 'RV1', previo: 1, respuesta: 1, respaldo: 'parcial' }, { id: 'RV3', previo: 0, respuesta: 1, respaldo: 'parcial' }]);
  assert.deepEqual(m.sinCodigo, { previo: 1, respuesta: 0 });
  const u = Object.fromEntries(m.unidades.map(x => [x.id, x]));
  assert.equal(u[U1].previos, 2); assert.equal(u[U1].aciertoPrevio, 0.5); assert.equal(u[U1].aciertoRespuesta, 0);
  assert.equal(u[U2].aciertoRespuesta, 1);
  // El resumen general sigue contando las respuestas como predicciones, y la prueba de entrada del módulo.
  const g = M.resumir(lecturaEv).find(x => x.modulo === 'lectura-verbal');
  assert.equal(g.predicciones, 3);
  assert.ok(Math.abs(g.entrada - 2 / 3) < 1e-12);
  assert.deepEqual(M.resumirLectura(lecturaEv.slice(-1)), []);
});

test('los eventos de lectura salen en el CSV y en el informe', () => {
  const csv = M.aCSV(lecturaEv).trim().split('\n');
  const col = k => M.COLUMNAS.indexOf(k);
  const fila = csv[2].split(',');
  assert.equal(fila[col('tipo')], 'previo');
  assert.equal(fila[col('opcion')], 'o5');
  assert.equal(fila[col('error')], 'RV1');
  assert.equal(csv[9].split(',')[col('respuestas')], '215');
  const md = informeLectura(unir([lecturaEv, lecturaEv.slice(0, 4)]), { RV1: { nombre: 'Detalle como idea principal', respaldo: 'parcial' } });
  assert.match(md, /\| lectura-verbal \| 2 \| 2 \| 75 s \| 3 \| 33 % \| 3 \| 33 % \|/);
  assert.match(md, /\| RV1 \| Detalle como idea principal \| parcial \| 1 \| 1 \|/);
  assert.match(md, /\| sin código \|.*\| 1 \| 0 \|/);
  assert.match(informe(lecturaEv), /# Formato lectura: paso previo y respuesta/);
  assert.equal(informeLectura([]), '');
});

test('resumen de lectura: al repetir un texto cuenta solo el primer intento', () => {
  const rep = [...lecturaEv,
    lec('a', 6, { tipo: 'lectura', unidad: U1, problema: 't001v1', ms: 1000, intento: 2 }),
    lec('a', 7, { tipo: 'previo', unidad: U1, problema: 't001v1.p1', opcion: 'o2', correcta: true, error: '', ms: 1, intento: 2 }),
    lec('a', 8, { tipo: 'prediccion', unidad: U1, problema: 't001v1.p1', opcion: '1', correcta: true, error: '', ms: 1, intento: 2 })];
  const [m] = M.resumirLectura(rep);
  assert.equal(m.previos, 3); assert.equal(m.respuestas, 3); assert.equal(m.textosLeidos, 2);
  assert.ok(Math.abs(m.aciertoPrevio - 1 / 3) < 1e-12);
});

test('el informe no repite los errores de lectura en "Errores elegidos"', () => {
  const md = informe(lecturaEv);
  assert.doesNotMatch(md, /## Errores elegidos en lectura-verbal/);
  assert.match(md, /## Errores por código RV en lectura-verbal/);
  assert.match(informe(datos), /## Errores elegidos en m1/);
});

// ---------- «No sé» ----------
test('«No sé» por módulo: porcentaje en entrada, salida y práctica, y confianza calibrada', () => {
  const e = (alumno, t, extra) => ({ t, alumno, modulo: 'm2', ...extra });
  const l = [
    e('a', '1', { tipo: 'prueba', fase: 'entrada', aciertos: 1, total: 3, nose: 2 }),  // 1 de 1 intentada
    e('b', '2', { tipo: 'prueba', fase: 'entrada', aciertos: 1, total: 3 }),           // dato de antes: sin campo
    e('a', '3', { tipo: 'prueba', fase: 'salida', aciertos: 2, total: 3, nose: 0 }),
    e('a', '4', { tipo: 'prediccion', problema: 'p1', opcion: '', correcta: false, error: '', nose: true }),
    e('a', '5', { tipo: 'prediccion', problema: 'p2', opcion: 'A', correcta: true, error: '' }),
    e('a', '6', { tipo: 'prediccion', problema: 'p3', opcion: 'B', correcta: false, error: 'X1' }),
  ];
  const [r] = M.resumir(l);
  assert.ok(Math.abs(r.nose.entrada - 2 / 6) < 1e-12);
  assert.equal(r.nose.salida, 0);
  assert.ok(Math.abs(r.nose.practica - 1 / 3) < 1e-12);
  assert.ok(Math.abs(r.confianza.entrada - 2 / 4) < 1e-12);
  assert.ok(Math.abs(r.confianza.practica - 1 / 2) < 1e-12);
  assert.ok(Math.abs(r.acierto - 1 / 3) < 1e-12, '«No sé» cuenta como no acierto');
  assert.deepEqual(r.errores, [{ id: 'X1', n: 1 }], '«No sé» no es un error');
  // Ganancia: «No sé» como no acierto (a: 1/3 → 2/3).
  assert.ok(Math.abs(r.ganancia - 1 / 3) < 1e-12);
});

test('«No sé» por curso: no es error, cuenta como no acierto en Hake y sale de la confianza', () => {
  const it = (alumno, fase, k, extra) => ({ t: `${alumno}${fase}${k}`, alumno, tipo: 'item', fase, curso: 'q', forma: 'A', orden: 'AB', plantilla: 'gases', ...extra });
  const l = [
    it('a', 'entrada', 1, { correcta: false, error: '', opcion: '', nose: true }),
    it('a', 'entrada', 2, { correcta: true, error: '' }),
    it('a', 'entrada', 3, { correcta: false, error: 'E1' }),
    it('a', 'entrada', 4, { correcta: false, error: 'E2', nose: undefined }), // dato de antes
    { t: 'az', alumno: 'a', tipo: 'prueba', fase: 'entrada', curso: 'q', forma: 'A', aciertos: 1, total: 4, nose: 1 },
    it('a', 'salida', 1, { correcta: true, error: '' }),
    it('a', 'salida', 2, { correcta: true, error: '' }),
    it('a', 'salida', 3, { correcta: false, error: '', nose: true }),
    it('a', 'salida', 4, { correcta: true, error: '' }),
    { t: 'bz', alumno: 'a', tipo: 'prueba', fase: 'salida', curso: 'q', forma: 'B', aciertos: 3, total: 4, nose: 1 },
  ];
  const [c] = M.resumirCursos(l);
  assert.equal(c.nose.entrada, 1 / 4); assert.equal(c.nose.salida, 1 / 4);
  assert.ok(Math.abs(c.confianza.entrada - 1 / 3) < 1e-12); assert.equal(c.confianza.salida, 1);
  assert.ok(Math.abs(c.hake - (3 / 4 - 1 / 4) / (1 - 1 / 4)) < 1e-12);
  assert.deepEqual(c.errores.map(e => e.id).sort(), ['E1', 'E2']);
  assert.equal(c.plantillas[0].noseEntrada, 1 / 4);
  const md = informeCursos(l, {});
  assert.match(md, /\| 25 % \/ 25 % \| 33 % \/ 100 % \|/);
  assert.match(informe(l), /Confianza calibrada/);
});
