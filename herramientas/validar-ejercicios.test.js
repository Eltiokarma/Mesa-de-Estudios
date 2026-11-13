// Pruebas del validador de la tanda de ejercicios (herramientas/validar-ejercicios.js).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const V = require('./validar-ejercicios.js');

const RAIZ = path.join(__dirname, '..');
const EJEMPLOS = path.join(RAIZ, 'contenido', 'ejercicios', 'ejemplos');
const ctx = V.cargarContexto();
const leer = f => JSON.parse(fs.readFileSync(path.join(EJEMPLOS, f), 'utf8'));
const copia = x => JSON.parse(JSON.stringify(x));
const errores = ej => V.validarEjercicio(ej, ctx).errores;
const tiene = (lista, texto) => lista.some(e => e.includes(texto));

const propio = () => leer('juguete-porcentajes.json');
const oficial = () => leer('juguete-oficial-mruv.json');
const academia = () => leer('juguete-academia-balanzas.json');
const larga = n => Array.from({ length: n }, (_, i) => `palabra${i}`).join(' ');

test('los ejemplos de juguete son válidos y sus respuestas se recalculan aparte', () => {
  const { res } = V.validarCarpeta(EJEMPLOS);
  assert.equal(res.length, 3);
  for (const x of res) assert.deepEqual(x.errores, [], `${x.archivo}: ${x.errores.join('; ')}`);
  // Cálculo independiente (regla 2): descuentos sucesivos, frenado y balanzas.
  const p = propio().datos;
  assert.equal(Math.round(p.P.valor * (1 - p.a.valor / 100) * (1 - p.b.valor / 100) * 1e9) / 1e9, propio().respuesta.valor);
  assert.equal(20 ** 2 / (2 * 4), oficial().respuesta.valor);
  // 2C = 3T y T = 2S → C = 3S → 4C = 12S.
  const S = 1, T = 2 * S, C = 3 * T / 2;
  assert.equal(4 * C / S, academia().respuesta.valor);
  assert.equal(oficial().alternativas_fuente['ABCDE'.indexOf(oficial().clave_fuente)], '50 m');
});

test('palabras: no cuentan los datos con color, los números ni los signos', () => {
  assert.equal(V.palabras('Una casaca cuesta {P}. Le rebajan {a}.'), 5);
  assert.equal(V.palabras(['El precio es ', { v: 'P', t: 'S/ 300' }, ' y sube.']), 5);
  assert.equal(V.palabras('270 × 0,7 = 189'), 0);
  assert.equal(V.palabras([['Queda el ', '90 %', ': ', { v: 'P', t: '300' }, ' × 0,9.']]), 2);
  assert.equal(V.palabras(null), 0);
});

test('esquema: campos según el estado', () => {
  const a = propio(); delete a.unidad;
  assert.ok(tiene(errores(a), 'falta «unidad»'));
  const b = propio(); delete b.verificacion;
  assert.ok(tiene(errores(b), 'falta «verificacion»'));
  const c = propio(); c.verificacion.coincide = false;
  assert.ok(tiene(errores(c), 'debe valer true'));
  const d = oficial(); delete d.origen.periodo;
  assert.ok(tiene(errores(d), 'falta «periodo»'));
  const e = oficial(); e.origen.periodo = '25-I';
  assert.ok(tiene(errores(e), 'no cumple'));
  const f = propio(); f.color = 'o';
  assert.ok(tiene(errores(f), 'campo desconocido «color»'));
  const g = propio(); g.estado = 'listo';
  assert.ok(tiene(errores(g), 'no es ninguno'));
  const h = { id: 'pr-x-0001', estado: 'crudo', origen: { tipo: 'propio' }, enunciado: 'Algo.' };
  assert.deepEqual(errores(h), []);
});

test('regla 5: un ejercicio de academia (sin cita) nunca se publica ni es instancia fija', () => {
  const a = academia(); a.estado = 'publicado'; a.respuesta = { valor: 12 };
  a.verificacion = { por: 'generador', coincide: true, resultado: 12 };
  assert.ok(tiene(errores(a), 'no es ninguno de oficial, libro, propio'));
  const b = academia(); b.mapeo = { via: 'instancia', pieza: 'balanza' };
  assert.ok(tiene(errores(b), 'instancia fija no puede ser de academia'));
  // El presupuesto de texto no se le aplica: no se publica.
  const c = academia(); c.enunciado = larga(80);
  assert.deepEqual(V.presupuestoEjercicio(c), []);
});

test('regla 5: un ejercicio de libro entra con cita y banco, y puede publicarse', () => {
  const libro = () => ({
    id: 'cz-libro-problema-0001', estado: 'crudo',
    origen: { tipo: 'libro', fuente: 'id-del-pdf', libro: 'Álgebra', autor: 'Autor', editorial: 'Cuzcano', problema: { tipo: 'problema', numero: 1 }, pagina: 47, cita: 'Autor, Álgebra (Cuzcano), problema 1, p. 47.' },
    banco: { uid: 'id-del-pdf:problema:1', ficha: { enunciado: 'Algo.' } },
    enunciado: larga(80),
  });
  assert.deepEqual(errores(libro()), []);
  // Sin cita o sin banco, no entra.
  const a = libro(); delete a.origen.cita;
  assert.ok(tiene(errores(a), 'falta «cita»'));
  const b = libro(); delete b.banco;
  assert.ok(tiene(errores(b), 'falta «banco»'));
  // Va tal cual: el enunciado no paga presupuesto, pero los pasos propios sí.
  assert.deepEqual(V.presupuestoEjercicio(libro()), []);
  const c = libro(); c.pasos = [{ estado: {}, texto: larga(20) }];
  assert.equal(V.presupuestoEjercicio(c).length, 1);
  // Se puede publicar.
  const d = libro(); d.estado = 'publicado'; d.curso = 'algebra'; d.unidad = 'algebra.polinomios'; d.tipo = 'polinomios/grados';
  d.mapeo = { via: 'nuevo' }; d.respuesta = { valor: 2 }; d.verificacion = { por: 'calculo-independiente', coincide: true, resultado: 2 };
  assert.ok(!tiene(errores(d), 'no es ninguno de'));
});

test('regla 1: el resultado del código debe ser la respuesta', () => {
  const a = propio(); a.verificacion.resultado = 190;
  assert.ok(tiene(errores(a), 'el código dio 190'));
  const b = propio(); delete b.respuesta.valor; b.respuesta.texto = 'S/ 189';
  assert.ok(tiene(errores(b), 'falta «valor» recalculado'));
  const c = propio(); c.alternativas[0].valor = 180;
  assert.ok(tiene(errores(c), 'la correcta no tiene el valor'));
});

test('catálogo, tipos, mapeo y piezas', () => {
  const a = propio(); a.unidad = 'aritmetica.no-existe';
  assert.ok(tiene(errores(a), 'no está en catalogo'));
  // Una unidad de otro curso vale: el curso es el del libro y la unidad, donde se estudia.
  const b = propio(); b.unidad = 'fisica.movimiento-rectilineo'; delete b.tipo;
  assert.ok(!errores(b).some(e => e.startsWith('unidad:')));
  const c = propio(); c.tipo = 'mezclas/otra-cosa';
  assert.ok(tiene(errores(c), 'debe empezar por «porcentajes/»'));
  const d = academia(); d.tipo = 'cortes-y-pesadas/sin-registro';
  assert.ok(tiene(errores(d), 'no está en tipos.json'));
  const e = academia(); e.mapeo = { via: 'generador', generador: 'no-existe' };
  assert.ok(tiene(errores(e), 'no existe el generador'));
  const f = propio(); f.escena.pieza = 'pieza-inventada';
  assert.ok(tiene(errores(f), '«pieza-inventada» no está'));
  const g = academia(); g.mapeo = { via: 'generador', generador: 'rm-balanzas', subtipo: 'no-es-subtipo' };
  assert.ok(tiene(V.validarEjercicio(g, ctx).avisos, 'no se ve el subtipo'));
});

test('formato vivo: fantasmas con ids de error, una sola correcta, marcadores en datos', () => {
  const a = propio(); a.fantasmas.inventado = { marca: 1 };
  assert.ok(tiene(errores(a), '«inventado» no es el id de error'));
  const b = propio(); b.alternativas[1].correcta = true; b.alternativas[1].error = null;
  assert.ok(tiene(errores(b), 'una sola correcta'));
  const c = propio(); c.enunciado = 'Cuesta {Q}.';
  assert.ok(tiene(errores(c), 'el marcador {Q}'));
  const d = propio(); d.alternativas[2].error = null;
  assert.ok(tiene(errores(d), 'no trae error con nombre'));
});

test('presupuesto: error desde verificado, aviso antes, y las oficiales no pagan enunciado', () => {
  const a = propio(); a.enunciado = larga(41);
  assert.ok(tiene(errores(a), 'enunciado de'));
  const b = propio(); b.pasos[0].texto = larga(15);
  assert.ok(tiene(errores(b), 'paso 1 de 15 palabras'));
  const c = propio(); c.alternativas[1].error.explicacion = larga(21);
  assert.ok(tiene(errores(c), 'explicación de «suma-descuentos» de 21'));
  const d = propio(); d.estado = 'mapeado'; d.enunciado = larga(41);
  const r = V.validarEjercicio(d, ctx);
  assert.ok(!tiene(r.errores, 'presupuesto') && tiene(r.avisos, 'presupuesto'));
  const e = oficial(); e.enunciado = larga(90);
  assert.deepEqual(V.presupuestoEjercicio(e), []);
});

test('leer carpeta: .json con listas o lotes, .jsonl, ids repetidos y archivos rotos', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ejercicios-'));
  try {
    const base = { estado: 'crudo', origen: { tipo: 'propio' }, enunciado: 'Algo.' };
    fs.writeFileSync(path.join(dir, 'lista.json'), JSON.stringify([{ id: 'pr-l-0001', ...base }, { id: 'pr-l-0002', ...base }]));
    fs.mkdirSync(path.join(dir, 'sub'));
    fs.writeFileSync(path.join(dir, 'sub', 'lote.json'), JSON.stringify({ lote: 'x', ejercicios: [{ id: 'pr-l-0003', ...base }] }));
    fs.writeFileSync(path.join(dir, 'lineas.jsonl'), [{ id: 'pr-l-0004', ...base }, { id: 'pr-l-0001', ...base }].map(x => JSON.stringify(x)).join('\n') + '\n');
    fs.writeFileSync(path.join(dir, 'roto.json'), '{ no es json');
    const { res } = V.validarCarpeta(dir);
    assert.equal(res.length, 6);
    assert.equal(res.filter(x => tiene(x.errores, 'repetido')).length, 1);
    assert.equal(res.filter(x => tiene(x.errores, 'no se pudo leer')).length, 1);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('contar: totales por curso, origen, estado y pieza, y huérfanos', () => {
  const { res } = V.validarCarpeta(EJEMPLOS);
  const extra = [
    { id: 'pr-h-0001', estado: 'clasificado', origen: { tipo: 'propio' }, curso: 'aritmetica', unidad: 'aritmetica.porcentajes', tipo: 'porcentajes/sin-mapeo', enunciado: 'Algo.' },
    { id: 'pr-h-0002', estado: 'crudo', origen: { tipo: 'propio' }, enunciado: 'Algo.', duplicado_de: 'pr-h-0001', figura_fuente: true },
  ].map(ej => ({ archivo: 'memoria', ej, ...V.validarEjercicio(ej, ctx) }));
  const c = V.contar(res.concat(extra), ctx);
  assert.equal(c.total, 5);
  assert.equal(c.invalidos, 0);
  assert.equal(c.por.curso.aritmetica, 2);
  assert.equal(c.por.origen['oficial unmsm'], 1);
  assert.equal(c.por.estado.crudo, 1);
  assert.equal(c.por.pieza['barra-porcentaje'], 1);
  assert.equal(c.por.via.generador, 2);
  assert.equal(c.sin_tipo, 1);
  assert.equal(c.duplicados, 1);
  assert.equal(c.figura_fuente, 1);
  assert.deepEqual(c.huerfanos, { total: 1, tipos: { 'porcentajes/sin-mapeo': 1 } });
  const t = V.tablaConteo(c);
  assert.ok(t.includes('Huérfanos (tipo sin generador ni pieza): 1') && t.includes('porcentajes/sin-mapeo'));
});

test('auditoría: mide el presupuesto de un problema generado', () => {
  const p = {
    enunciado: ['Una tienda rebaja ', { v: 'a', t: '10 %' }, ' y luego otro poco.'], pregunta: ['¿Cuánto se paga?'], datos: '',
    solucion: [['Queda el 90 %.'], [larga(15)]],
    alternativas: [{ correcta: true }, { correcta: false, error: { id: 'x', explicacion: larga(21) } }],
  };
  const m = V.medirProblema(p);
  assert.equal(m.enunciado, 10);
  assert.equal(m.pasoMax, 15);
  assert.ok(m.okE && !m.okP && !m.okX);
  assert.equal(m.carga, 21 / 20 > 15 / 14 ? 21 / 20 : 15 / 14);
  // Las oficiales reproducidas no pagan enunciado.
  const o = V.medirProblema({ ...p, enunciado: [larga(60)], datos: 'Pregunta de UNMSM 2024-II (examen de admisión, razonamiento matemático).' });
  assert.ok(o.oficial && o.okE);
  // Formato vivo: los pasos se miden por su texto, sin la ecuación.
  const v = V.medirProblema({ ...p, pasos: [{ estado: {}, texto: 'Queda el 90 %.', ecuacion: [larga(30)] }], escena: { pieza: 'barra-porcentaje' }, fantasmas: {} });
  assert.ok(v.okP && v.escena && v.pasosVivos && v.fantasmas);
});

test('auditoría: recorre todos los generadores de formato predicciones sin fallar', () => {
  const a = V.auditar({ semillas: 1, ctx });
  const esperados = fs.readdirSync(path.join(RAIZ, 'plantillas')).filter(d => {
    const f = path.join(RAIZ, 'plantillas', d, 'plantilla.json');
    return fs.existsSync(f) && JSON.parse(fs.readFileSync(f, 'utf8')).formato === 'predicciones';
  });
  assert.equal(a.filas.length, esperados.length);
  for (const f of a.filas) assert.equal(f.fallos, 0, `${f.id} falló al generar`);
  assert.equal(a.resumen.generadores, esperados.length);
  assert.ok(a.peores.length === Math.min(10, esperados.length));
  assert.ok(V.tablaAuditoria(a).includes('Orden de migración sugerido'));
  const una = V.auditar({ semillas: 3, solo: ['porcentajes-sucesivos'], ctx }).filas[0];
  assert.equal(una.problemas, 3);
  assert.ok(una.admision >= 1, 'porcentajes-sucesivos cubre preguntas de admisión en el CSV');
});

test('línea de comandos: --validar sale con 0 en los ejemplos y con 1 si hay errores', () => {
  const cli = path.join(__dirname, 'validar-ejercicios.js');
  const ok = spawnSync(process.execPath, [cli, '--validar', EJEMPLOS], { encoding: 'utf8' });
  assert.equal(ok.status, 0, ok.stdout + ok.stderr);
  assert.ok(ok.stdout.includes('3 ejercicios: 3 sin errores'));
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ejercicios-'));
  try {
    fs.writeFileSync(path.join(dir, 'malo.json'), JSON.stringify({ id: 'pr-m-0001', estado: 'clasificado', origen: { tipo: 'propio' }, enunciado: 'Algo.' }));
    const mal = spawnSync(process.execPath, [cli, '--validar', dir], { encoding: 'utf8' });
    assert.equal(mal.status, 1);
    const cont = spawnSync(process.execPath, [cli, '--contar', dir, '--json'], { encoding: 'utf8' });
    assert.equal(JSON.parse(cont.stdout).invalidos, 1);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
