// Pruebas de «Sentido contextual»: casos.json (calculados aparte, con un léxico propio que no usa el generador), un
// recálculo por otro camino en 600 problemas, fugas, los tipos por idea, el recuadro «Datos» y que el banco cuadre entero.
// El recálculo no usa las funciones del generador: con las etiquetas del banco busca la única alternativa «OK», y rehace
// el código de cada incorrecta con su propia tabla.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');

const BANCOS = ['ACEPCION', 'VALOR', 'PRECISA', 'FIGURADO', 'PISTAS'];
const items = BANCOS.flatMap(b => gen[b]);
const porId = Object.fromEntries(items.map(it => [it.id, it]));
const sinTilde = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

test('los ids del banco no se repiten', () => assert.equal(new Set(items.map(i => i.id)).size, items.length));

function recalcular(p) {
  const it = porId[p._datos.item], et = Object.fromEntries(it.alts.map(([t, e]) => [t, e]));
  const b = p.alternativas.filter(a => et[a.texto] === 'OK');
  assert.equal(b.length, 1, `${it.id}: ${b.length} buenas`);
  return `ok:${b[0].texto}`;
}
probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => a === b });
probarFugas(gen, { grupo: p => p._datos.tipo });

for (const c of casos.casos) {
  test(`casos.json: ${c.semilla}`, () => {
    const p = gen.generar(c.semilla, { idea: c.idea });
    assert.deepEqual({ tipo: p._datos.tipo, item: p._datos.item }, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.texto);
    assert.deepEqual(p.alternativas.filter(a => a.error).map(a => [a.texto, a.error.id]).sort(), c.esperado.errores.slice().sort());
  });
}

test('cada idea tiene sus tipos, salen los dos niveles y todos los códigos', () => {
  assert.deepEqual(Object.keys(gen.TIPOS_POR_IDEA), ['acepcion', 'denota-connota', 'palabra-precisa', 'sentido-figurado', 'inferir-significado']);
  const ids = new Set(), niveles = new Set();
  for (const idea of Object.keys(gen.TIPOS_POR_IDEA)) for (let s = 0; s < 150; s++) {
    const p = gen.generar(s, { idea });
    assert.equal(p._datos.idea, idea);
    assert.ok(gen.TIPOS_POR_IDEA[idea].includes(p._datos.tipo));
    assert.equal(p.alternativas.length, p._datos.nivel === 3 ? 5 : 4);
    niveles.add(p._datos.nivel);
    for (const a of p.alternativas) if (a.error) ids.add(a.error.id);
  }
  assert.deepEqual([...niveles].sort(), [2, 3]);
  const codigos = require('../../contenido/razonamiento-verbal/codigos.json');
  for (const id of ['RV18', 'RV19', 'RV20', 'RV21', 'RV23', 'RVS1', 'RVS2', 'RVS3', 'RVS4', 'RVS5', 'RVS6', 'RVS7', 'RVS8']) {
    assert.ok(ids.has(id), `no sale ${id}`);
    assert.ok(codigos[id], `${id} no está en codigos.json`);
  }
});

// Tabla propia: el motivo que tiene que decir la explicación de cada código.
const MOTIVO = { RV18: /otra acepción/, RV19: /mismo campo|otra cosa/, RV20: /se escribe parecido/, RV21: /otro rasgo/, RV23: /choca/,
  RVS1: /lo contrario|sinónimo/, RVS2: /valoración|al revés/, RVS3: /otro grado/, RVS4: /comodín/, RVS5: /tal cual/, RVS6: /literal encaja/,
  RVS7: /idea propia/, RVS8: /contraste al revés/ };
test('el banco cuadra entero: una sola buena, cuatro incorrectas con códigos distintos y su motivo', () => {
  for (const [k, b] of BANCOS.entries()) for (const it of gen[b]) {
    assert.equal(it.alts.filter(x => x[1] === 'OK').length, 1, it.id);
    assert.equal(it.alts.length, 5, it.id);
    for (let s = 0; s < 40; s++) {
      const p = gen.generar(`banco-${it.id}-${s}`, { idea: Object.keys(gen.TIPOS_POR_IDEA)[k] });
      if (p._datos.item !== it.id) continue;
      for (const a of p.alternativas.filter(x => x.error)) {
        assert.ok(MOTIVO[a.error.id].test(a.error.explicacion), `${it.id}: «${a.texto}» (${a.error.id}): «${a.error.explicacion}»`);
        assert.ok(/bien/.test(a.error.explicacion) || /otra cosa/.test(a.error.explicacion), `${it.id}: «${a.texto}»: empieza por lo que hizo bien`);
      }
    }
  }
});

test('la correcta no es la única escrita dentro de otra, ni otra está dentro de la correcta', () => {
  for (const it of items) {
    const ok = it.alts.find(x => x[1] === 'OK')[0], textos = it.alts.map(x => x[0]);
    const dentro = (a, b) => new RegExp(`(^|\\s)${a}(\\s|$)`, 'i').test(b);
    assert.ok(!textos.some(t => t !== ok && dentro(ok, t)), `${it.id}: «${ok}» está dentro de otra`);
    assert.ok(!textos.some(t => t !== ok && dentro(t, ok)), `${it.id}: una incorrecta está dentro de «${ok}»`);
  }
});

test('recuadro «Datos» en 400 semillas: lista de líneas cortas, sin la respuesta ni consejos', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), c = p.alternativas.find(a => a.correcta).texto;
    assert.ok(Array.isArray(p.datos) && p.datos.length >= 2, `semilla ${s}`);
    for (const l of p.datos) {
      assert.ok(l.split(/\s+/).length <= 22, `semilla ${s}: «${l}»`);
      assert.ok(!new RegExp(`(^|[^a-z])${sinTilde(c)}([^a-z]|$)`).test(sinTilde(l)), `semilla ${s}: los datos traen la respuesta`);
      assert.ok(!/^(Recuerda|Ojo|Cuidado|No olvides|Ten en cuenta|Fíjate|Conviene)/.test(l), `semilla ${s}: consejo en Datos`);
    }
  }
});

test('en ningún problema la correcta es la más larga ni la más corta (200 semillas por idea)', () => {
  for (const idea of Object.keys(gen.TIPOS_POR_IDEA)) for (let s = 0; s < 200; s++) {
    const p = gen.generar(`largo-${s}`, { idea }), l = p.alternativas.map(a => a.texto.length), c = p.respuesta.texto.length;
    assert.ok(c < Math.max(...l) && c > Math.min(...l), `${idea} ${p._datos.item}: la correcta mide ${c}; ${l}`);
  }
});

test('la letra de la correcta se reparte entre las cuatro o cinco', () => {
  const cuenta = {};
  for (let s = 0; s < 1000; s++) { const p = gen.generar(s); const L = p.alternativas.find(a => a.correcta).letra; cuenta[L] = (cuenta[L] || 0) + 1; }
  for (const L of 'ABCD') assert.ok(cuenta[L] > 120 && cuenta[L] < 350, JSON.stringify(cuenta));
});

test('ninguna oración ni alternativa usa una palabra de dos lecturas para un alumno peruano', () => {
  // En el Perú: «caliente» es también enojado; «vivo», astuto; «fresco», descarado; «bravo», difícil o enojado; «rico»,
  // sabroso; «jalar», desaprobar; «palta», vergüenza; «piña», mala suerte; «prendido», entusiasmado o ebrio.
  const MALOS = /\b(caliente|vivo|viva|fresco|fresca|bravo|brava|rico|rica|jalar|jaló|palta|piña|prendido|despierto)\b/i;
  for (const it of items) for (const t of [it.o, ...it.alts.map(x => x[0])]) assert.ok(!MALOS.test(t), `${it.id}: «${t}»`);
});
