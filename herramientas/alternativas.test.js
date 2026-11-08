// La correcta no debe verse distinta de las demás (herramientas/alternativas.js).
// Falla si en una fuente con al menos 20 ítems la correcta es la más larga, sola, en más del 35 %;
// si es la única que justifica en más del 10 %; si alguna vez es la única con negrita o marcas;
// o si en un generador cae en la misma letra más de la mitad de las veces.
const test = require('node:test');
const assert = require('node:assert');
const A = require('./alternativas.js');

test('medir cuenta las cuatro pistas', () => {
  const m = A.medir([
    { id: 'a', opciones: ['corta', 'la más larga de todas', 'media'], correcta: 1, letra: 'B' },
    { id: 'b', opciones: ['sí, porque llueve', 'no', 'tal vez'], correcta: 0, letra: 'A' },
    { id: 'c', opciones: ['**1**', '12345', '13456'], correcta: 0, letra: 'A' },
    { id: 'd', opciones: ['tres', 'dos', 'uno'], correcta: 2, letra: 'C' },
  ]);
  assert.equal(m.n, 4);
  assert.equal(m.largo, 2 / 4); // a y b
  assert.equal(m.justifica, 1);
  assert.equal(m.marcas, 1);
  assert.deepEqual(m.casosMarcas, ['c']);
  assert.deepEqual(m.letraMax, { letra: 'A', tasa: 0.5 });
});

test('justificación: conectores de causa y consecuencia, sin falsos «puesto que»', () => {
  for (const t of ['llueve porque hace frío', 'así que nadie lo discutía', 'no es eso: es otra cosa', 'ya que vino'])
    assert.ok(A.JUSTIFICA.test(t), t);
  for (const t of ['le quitó un puesto que merecía', 'Razón: 2', 'después', 'repuesto que falta'])
    assert.ok(!A.JUSTIFICA.test(t), t);
});

const lista = A.fuentes();

test('cada fuente tiene ítems y cada ítem una sola correcta', () => {
  assert.ok(lista.length >= 3);
  for (const f of lista) {
    assert.ok(f.items.length > 0, `${f.fuente}: sin ítems`);
    for (const it of f.items) assert.ok(it.correcta >= 0 && it.correcta < it.opciones.length, `${it.id}: sin correcta`);
  }
});

for (const f of lista) {
  test(`la forma no delata la correcta: ${f.fuente}`, () => {
    const mal = A.problemas(f, A.medir(f.items));
    assert.deepEqual(mal, []);
  });
}
