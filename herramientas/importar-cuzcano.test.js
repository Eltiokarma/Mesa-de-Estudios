'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const I = require('./importar-cuzcano.js');
const V = require('./validar-ejercicios.js');

const LIBRO = '1AbC_libro-de-prueba';
const libros = new Map([[LIBRO, { id: LIBRO, titulo: 'Álgebra', coleccion: 'PREUNI', autor: 'Ing. Autor de Prueba' }]]);

// Un traspaso mínimo en una carpeta temporal: manifiesto, dos fichas y una figura.
function traspaso() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cuzcano-'));
  const t = path.join(dir, 'traspaso-claude', 'algebra');
  fs.mkdirSync(t, { recursive: true });
  fs.mkdirSync(path.join(dir, 'lote'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'lote', 'p1.json'), JSON.stringify({
    fuente: { libro_id: LIBRO, tipo: 'problema', numero: 1, paginas_pdf: [44], paginas_impresas: [47] },
    enunciado: 'P(x,y) es homogéneo de grado 4 y P(2,−1) = 2. Calcular P(−6,3).',
    alternativas: { A: 6, B: -6, C: 54, D: -54, E: 162 },
    resultado: { valor: 162, alternativa: 'E' },
  }));
  fs.writeFileSync(path.join(dir, 'lote', 'p2.json'), JSON.stringify({
    fuente: { libro_id: LIBRO, tipo: 'propuesto', numero: 2, paginas_pdf: [270] },
    enunciado: 'Hallar el grado absoluto mínimo del siguiente polinomio.',
    expresion_latex: 'P(x)=x^{n-6}',
    resultado: { expresion: '14, alternativa D.' },
  }));
  fs.writeFileSync(path.join(dir, 'lote', 'f2.svg'), '<svg xmlns="http://www.w3.org/2000/svg"/>');
  fs.writeFileSync(path.join(t, 'tema.json'), JSON.stringify({ ejercicios: [
    { uid: `${LIBRO}:problema:1`, titulo: 'Homogeneidad', estado: 'verificado', revisar_antes_de_integrar: false, ficha: 'lote/p1.json', paginas_pdf: [44], subtema: null },
    { uid: `${LIBRO}:propuesto:2`, titulo: 'Grado mínimo', estado: 'condicionado', revisar_antes_de_integrar: true, requiere_aclaracion_para_producto: true, ficha: 'lote/p2.json', grafico: 'lote/f2.svg', tipo_grafico: 'tarjeta', paginas_pdf: [270], subtema: null },
  ] }));
  return { desde: dir, destino: path.join(dir, 'salida') };
}
const correr = (t, extra = {}) => I.importar({ desde: t.desde, destino: t.destino, manifiesto: 'algebra/tema.json', curso: 'algebra', temaId: 'algebra.polinomios-y-grados', unidad: 'algebra.polinomios', libros, ...extra });
const archivo = t => path.join(t.destino, 'algebra', 'polinomios-y-grados.jsonl');

test('id estable desde el uid y válido para el esquema', () => {
  assert.equal(I.idDeUid('1GQx-ab_c:problema:240'), 'cz-1GQx-ab_c-problema-240');
  assert.equal(I.idDeUid('x:seminario 6:12a'), 'cz-x-seminario-6-12a');
});

test('cita: autor, libro, colección, editorial, problema y página', () => {
  assert.equal(I.armarCita({ libro: 'Álgebra', autor: 'Ing. Luis Manrique L.', coleccion: 'PREUNI', rotulo: 'problema 240', pagina: 47 }),
    'Ing. Luis Manrique L., Álgebra (PREUNI), Editorial Cuzcano, problema 240, p. 47.');
  // Sin autor propio ni página impresa: la editorial y la página del PDF.
  assert.equal(I.armarCita({ libro: 'Física', autor: 'Editorial Cuzcano', rotulo: 'problema propuesto 3', paginaPdf: 12 }),
    'Física, Editorial Cuzcano, problema propuesto 3, p. 12 del PDF.');
});

test('importar dos veces no duplica y deja el archivo idéntico', () => {
  const t = traspaso();
  const r1 = correr(t);
  assert.equal(r1.nuevos, 2);
  const antes = fs.readFileSync(archivo(t), 'utf8');
  const r2 = correr(t);
  assert.deepEqual([r2.nuevos, r2.actualizados, r2.iguales, r2.total_en_archivo], [0, 0, 2, 2]);
  assert.equal(fs.readFileSync(archivo(t), 'utf8'), antes);
});

test('una muestra con --limite y luego el tema entero: los primeros no se repiten', () => {
  const t = traspaso();
  correr(t, { limite: 1 });
  const r = correr(t);
  assert.deepEqual([r.nuevos, r.iguales, r.total_en_archivo], [1, 1, 2]);
});

test('conserva la revisión que escribió una persona', () => {
  const t = traspaso();
  correr(t);
  const m = I.leerJsonl(archivo(t));
  const id = `cz-${LIBRO}-propuesto-2`;
  m.get(id).banco.revision = { por: 'Gerson', fecha: '2026-11-13', resultado: 'aceptado con la condición de n natural' };
  fs.writeFileSync(archivo(t), [...m.values()].map(x => JSON.stringify(x)).join('\n') + '\n');
  const r = correr(t);
  assert.deepEqual([r.nuevos, r.total_en_archivo], [0, 2]); // la línea editada a mano vuelve al orden de claves canónico
  assert.equal(I.leerJsonl(archivo(t)).get(id).banco.revision.por, 'Gerson');
  assert.equal(correr(t).iguales, 2);
});

test('procedencia completa: uid, ficha original, clave, respuesta, expresión y figura', () => {
  const t = traspaso();
  correr(t);
  const m = I.leerJsonl(archivo(t));
  const a = m.get(`cz-${LIBRO}-problema-1`);
  assert.equal(a.banco.uid, `${LIBRO}:problema:1`);
  assert.deepEqual(a.alternativas_fuente, ['A) 6', 'B) -6', 'C) 54', 'D) -54', 'E) 162']);
  assert.equal(a.clave_fuente, 'E');
  assert.deepEqual(a.respuesta, { valor: 162 });
  assert.equal(a.origen.pagina, 47);
  assert.deepEqual(a.banco.ficha.alternativas.E, 162);
  const b = m.get(`cz-${LIBRO}-propuesto-2`);
  assert.equal(b.clave_fuente, 'D');
  assert.deepEqual(b.respuesta, { texto: '14, alternativa D.' });
  assert.deepEqual(b.expresion, { latex: 'P(x)=x^{n-6}' });
  assert.equal(b.banco.revisar_antes_de_integrar, true);
  assert.ok(fs.existsSync(path.join(t.destino, b.banco.figura)));
  assert.ok(b.origen.cita.endsWith('p. 270 del PDF.'));
  // Y los dos pasan el esquema y el catálogo.
  const ctx = V.cargarContexto();
  for (const x of m.values()) assert.deepEqual(V.validarEjercicio(x, ctx).errores, [], x.id);
});

test('el banco versionado es válido, con cita y sin uid repetido', () => {
  const dir = path.join(__dirname, '..', 'contenido', 'ejercicios', 'cuzcano');
  if (!fs.existsSync(dir)) return;
  const { res } = V.validarCarpeta(dir);
  const mal = res.filter(x => x.errores.length).map(x => `${x.archivo}: ${x.errores.join('; ')}`);
  assert.deepEqual(mal, []);
  const uids = new Set();
  for (const x of res) {
    assert.equal(x.ej.origen.tipo, 'libro', x.archivo);
    assert.ok(x.ej.origen.cita, `${x.archivo}: sin cita (regla 5)`);
    assert.ok(!uids.has(x.ej.banco.uid), `${x.ej.banco.uid} repetido`);
    uids.add(x.ej.banco.uid);
    if (x.ej.banco.figura) assert.ok(fs.existsSync(path.join(dir, x.ej.banco.figura)), `${x.ej.id}: falta ${x.ej.banco.figura}`);
  }
});

test('las llaves de conjuntos y exponentes conservan su significado literal', () => {
  const texto = 'Para x ∈ ℝ∖{0}, compara x^{2} con x.';
  const e = { uid: `${LIBRO}:problema:3`, ficha: 'lote/p3.json', paginas_pdf: [4] };
  const ficha = { enunciado: texto };
  const ej = I.convertir(e, ficha, { curso: 'algebra', temaId: 'algebra.tema', libros });
  assert.deepEqual(ej.enunciado, [texto]);
  assert.deepEqual(ej.banco.ficha, ficha);
  assert.deepEqual(V.validarEjercicio(ej, V.cargarContexto()).errores, []);
});

test('conserva una ficha completada si el piloto de origen carece de enunciado', () => {
  const t = traspaso();
  correr(t);
  const antes = fs.readFileSync(archivo(t), 'utf8');
  const piloto = path.join(t.desde, 'lote', 'p1.json');
  fs.writeFileSync(piloto, JSON.stringify({ interpretacion: 'Probar homogeneidad.' }));
  assert.equal(correr(t).iguales, 2);
  assert.equal(fs.readFileSync(archivo(t), 'utf8'), antes);
  const nuevo = correr(t, { destino: path.join(t.desde, 'nuevo') });
  assert.equal(nuevo.nuevos, 1);
  assert.deepEqual(nuevo.sin_enunciado, [`${LIBRO}:problema:1`]);
});
