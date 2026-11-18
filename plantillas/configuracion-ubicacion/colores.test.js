// Un color fijo por magnitud en «Estructura atómica», en la teoría y en la práctica (docs/molde-unidad.md §5b; propuesta
// de la etapa 4, §8): Z y los protones naranja, N y los neutrones turquesa, los electrones violeta, la carga carmín, los
// orbitales turquesa; A y los números cuánticos en tinta; sin verde. La tabla está en la teoría (`colores`); cada
// generador de la unidad lleva una copia (COLOR). Esta prueba compara cada copia con la teoría y recorre 400 problemas de
// cada generador con { unidad }: toda variable dice su magnitud y lleva su color; nunca verde; nunca N (neutrones) y
// orbitales (también turquesa) en el mismo problema. quimica-conceptos (V/F) no pinta nada en esta unidad.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const RAIZ = path.join(__dirname, '..', '..');
const def = require(path.join(RAIZ, 'contenido/teoria/quimica/estructura-atomica.js'));
const UNIDAD = 'quimica.estructura-atomica';
const curso = require(path.join(RAIZ, 'catalogo/cursos/quimica.json'));
const ficha = curso.unidades.find(u => u.id === UNIDAD);
const GENERADORES = ficha.plantillas.filter(id => require(path.join(RAIZ, 'plantillas', id, 'plantilla.json')).formato === 'predicciones');
const SIN_COLOR = new Set(['quimica-conceptos']);

test('la unidad tiene sus cuatro generadores y la tabla de colores, sin verde', () => {
  assert.deepEqual([...GENERADORES].sort(), ['configuracion-ubicacion', 'niveles-orbitales', 'particulas-nucleo', 'quimica-conceptos']);
  assert.ok(!Object.values(def.colores).includes('d'));
});

for (const id of GENERADORES) {
  test(`${id}: los colores de sus variables son los de la tabla de la teoría`, () => {
    const gen = require(path.join(RAIZ, 'plantillas', id, 'generador.js'));
    if (!SIN_COLOR.has(id)) assert.deepEqual(gen.COLOR, def.colores, `${id}: la copia de la tabla no es la de la teoría`);
    let vistas = 0;
    for (let s = 0; s < 400; s++) {
      const p = gen.generar(s, { unidad: UNIDAD }), mags = new Set();
      for (const [k, x] of Object.entries(p.variables || {})) {
        vistas++;
        assert.ok(x.mag && def.colores[x.mag], `${id} semilla ${s}: la variable ${k} («${x.nombre}») no dice su magnitud`);
        assert.equal(x.color, def.colores[x.mag], `${id} semilla ${s}: ${k} (${x.mag}) en ${x.color} y no en ${def.colores[x.mag]}`);
        assert.notEqual(x.color, 'd', `${id} semilla ${s}: verde`);
        mags.add(x.mag);
      }
      assert.ok(!(mags.has('neutrones') && mags.has('orbitales')), `${id} semilla ${s}: N y orbitales, los dos en turquesa`);
    }
    if (SIN_COLOR.has(id)) assert.equal(vistas, 0, `${id}: no debería pintar nada`);
    else assert.ok(vistas > 0, `${id}: ninguna variable con color`);
  });
}
