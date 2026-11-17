// Un color fijo por magnitud en «Materia y energía», en la teoría y en la práctica (docs/molde-unidad.md §5b; Gerson,
// mesa de revisión, 17 nov; auditoría de la unidad, M1). La tabla está en un solo lugar, la teoría (`colores`); la
// práctica carga solo su generador, así que cada uno lleva una copia. Esta prueba compara cada copia con la teoría y
// recorre los problemas de cada generador de la unidad (400 semillas, con { unidad }): toda variable con color dice su
// magnitud (`mag`) y lleva el color de la tabla.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const RAIZ = path.join(__dirname, '..', '..');
const def = require(path.join(RAIZ, 'contenido/teoria/quimica/materia-y-energia.js'));
const UNIDAD = 'quimica.materia-y-energia';
const curso = require(path.join(RAIZ, 'catalogo/cursos/quimica.json'));
const ficha = (curso.unidades || []).find(u => u.id === UNIDAD);
const GENERADORES = ficha.plantillas.filter(id => require(path.join(RAIZ, 'plantillas', id, 'plantilla.json')).formato === 'predicciones');
// Los generadores que no pintan magnitudes (clasificar con la lupa; V/F de conceptos, que solo marca la palabra que
// se busca) no llevan tabla.
const SIN_MAGNITUDES = new Set(['sustancias-mezclas', 'quimica-conceptos']);

test('la unidad tiene sus generadores y la tabla de colores', () => {
  assert.ok(GENERADORES.length >= 8, GENERADORES.join(', '));
  assert.ok(def.colores && Object.keys(def.colores).length >= 10);
});

for (const id of GENERADORES) {
  test(`${id}: los colores de sus variables son los de la tabla de la teoría`, () => {
    const gen = require(path.join(RAIZ, 'plantillas', id, 'generador.js'));
    const copia = gen.COLOR || gen.COLOR_ME;
    if (!SIN_MAGNITUDES.has(id)) assert.deepEqual(copia, def.colores, `${id}: la copia de la tabla no es la de la teoría`);
    let vistas = 0;
    if (SIN_MAGNITUDES.has(id)) return;
    for (let s = 0; s < 400; s++) {
      const p = gen.generar(s, { unidad: UNIDAD });
      for (const [k, x] of Object.entries(p.variables || {})) {
        vistas++;
        assert.ok(x.mag && def.colores[x.mag], `${id} semilla ${s}: la variable ${k} («${x.nombre}») no dice su magnitud`);
        assert.equal(x.color, def.colores[x.mag], `${id} semilla ${s}: ${k} (${x.mag}) en ${x.color} y no en ${def.colores[x.mag]}`);
      }
    }
    assert.ok(vistas > 0, `${id}: ninguna variable con color`);
  });
}
