// Valida el catálogo de contenidos (catalogo/) y las fichas de plantillas (plantillas/*/plantilla.json).
// Se corre con el resto de las pruebas: npm test
//
// Comprueba que todo esté bien enlazado, para que agregar un curso, una unidad o una
// plantilla nueva sea editar un JSON sin miedo a romper nada.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const raiz = path.join(__dirname, '..');
const leer = p => JSON.parse(fs.readFileSync(path.join(raiz, p), 'utf8'));
const existe = p => fs.existsSync(path.join(raiz, p));

const universidades = leer('catalogo/universidades.json');
const archivosCursos = fs.readdirSync(path.join(raiz, 'catalogo/cursos')).filter(f => f.endsWith('.json'));
const cursos = archivosCursos.map(f => ({ archivo: f, ...leer(`catalogo/cursos/${f}`) }));
const dirsPlantillas = fs.readdirSync(path.join(raiz, 'plantillas'))
  .filter(d => fs.statSync(path.join(raiz, 'plantillas', d)).isDirectory());

const AREAS = ['ciencias', 'matematica', 'razonamiento', 'letras'];
const FORMATOS = ['escena', 'predicciones', 'lectura'];
const VISUAL = ['alto', 'medio', 'bajo'];
const ESTADOS = ['borrador', 'probada', 'publicada'];
const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const unidades = new Map(); // id -> { curso, unidad }

test('cada curso tiene un formato válido', () => {
  assert.ok(cursos.length > 0, 'no hay cursos en catalogo/cursos/');
  for (const c of cursos) {
    assert.match(c.id, ID, `${c.archivo}: id de curso inválido`);
    assert.equal(`${c.id}.json`, c.archivo, `${c.archivo}: el id debe ser igual al nombre del archivo`);
    assert.ok(c.nombre, `${c.id}: falta nombre`);
    assert.ok(AREAS.includes(c.area), `${c.id}: área "${c.area}" no es una de ${AREAS}`);
    assert.ok(FORMATOS.includes(c.formato_principal), `${c.id}: formato "${c.formato_principal}" no es uno de ${FORMATOS}`);
    assert.ok(Array.isArray(c.unidades) && c.unidades.length > 0, `${c.id}: no tiene unidades`);
  }
});

test('las unidades tienen ids únicos y campos válidos', () => {
  for (const c of cursos) {
    for (const u of c.unidades) {
      assert.ok(u.id && u.id.startsWith(`${c.id}.`), `${c.id}: la unidad "${u.id}" debe empezar por "${c.id}."`);
      assert.match(u.id.slice(c.id.length + 1), ID, `${u.id}: id inválido`);
      assert.ok(!unidades.has(u.id), `unidad repetida: ${u.id}`);
      unidades.set(u.id, { curso: c, unidad: u });
      assert.ok(u.nombre, `${u.id}: falta nombre`);
      assert.ok(Array.isArray(u.temas) && u.temas.length > 0, `${u.id}: falta la lista de temas`);
      assert.ok(VISUAL.includes(u.potencial_visual), `${u.id}: potencial_visual inválido`);
      assert.ok(Array.isArray(u.plantillas), `${u.id}: plantillas debe ser una lista`);
      const unis = Object.keys(u.universidades || {});
      assert.ok(unis.length > 0, `${u.id}: no dice en qué universidad entra`);
      for (const k of unis) {
        assert.ok(universidades[k], `${u.id}: universidad desconocida "${k}"`);
        const campo = universidades[k].ubicacion;
        const lista = u.universidades[k][campo];
        assert.ok(Array.isArray(lista) && lista.length > 0 && lista.every(Number.isInteger),
          `${u.id}: ${k}.${campo} debe ser una lista de números`);
      }
      if (u.investigacion !== null && u.investigacion !== undefined) {
        assert.ok(existe(u.investigacion), `${u.id}: no existe el informe ${u.investigacion}`);
      }
    }
  }
});

test('las unidades citan plantillas que existen', () => {
  for (const [id, { unidad }] of unidades) {
    for (const p of unidad.plantillas) {
      assert.ok(dirsPlantillas.includes(p), `${id}: la plantilla "${p}" no existe en plantillas/`);
    }
  }
});

test('cada plantilla tiene ficha válida y está en el catálogo', () => {
  for (const d of dirsPlantillas) {
    const ficha = `plantillas/${d}/plantilla.json`;
    assert.ok(existe(ficha), `${d}: falta ${ficha}`);
    const f = leer(ficha);
    assert.equal(f.id, d, `${ficha}: el id debe ser "${d}"`);
    assert.ok(ESTADOS.includes(f.estado), `${ficha}: estado inválido`);
    assert.match(f.version, /^\d+\.\d+\.\d+$/, `${ficha}: versión inválida`);
    for (const campo of ['escena', 'motor', 'casos', 'pruebas']) {
      assert.ok(f[campo] && existe(`plantillas/${d}/${f[campo]}`), `${ficha}: no existe el archivo de ${campo}`);
    }
    if (f.papel) assert.ok(existe(`plantillas/${d}/${f.papel}`), `${ficha}: no existe el archivo de papel`);
    if (f.estado !== 'borrador') assert.ok(f.papel, `${ficha}: una plantilla ${f.estado} necesita problemas de papel (regla 6)`);
    assert.ok(Array.isArray(f.unidades) && f.unidades.length > 0, `${ficha}: no dice qué unidades cubre`);
    for (const u of f.unidades) {
      assert.ok(unidades.has(u), `${ficha}: la unidad "${u}" no existe en el catálogo`);
      assert.ok(unidades.get(u).unidad.plantillas.includes(d), `${u}: debería listar la plantilla "${d}"`);
    }
  }
});
