// Pruebas de «Analogías»: casos.json (calculados aparte, con un léxico propio que no usa el generador), un recálculo por
// otro camino en 600 problemas, fugas, los tipos por idea, el recuadro «Datos» y que el banco cuadre entero.
// El recálculo no usa las funciones del generador: con las relaciones del banco, busca la alternativa que se une igual
// que el par base comparando las etiquetas por su cuenta, y rehace el código de cada incorrecta con su propia tabla.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');

const BANCOS = ['HERR', 'INCL', 'ORDEN', 'RASGO', 'JUSTA'];
const items = BANCOS.flatMap(b => gen[b]);
const porId = Object.fromEntries(items.map(it => [it.id, it]));
const sinTilde = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function recalcular(p) {
  const it = porId[p._datos.item], rel = Object.fromEntries(it.alts.map(([t, r]) => [t, r]));
  const b = p.alternativas.filter(a => rel[a.texto] === it.base[1]);
  assert.equal(b.length, 1, `${it.id}: ${b.length} se unen como el par base`);
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
  assert.deepEqual(Object.keys(gen.TIPOS_POR_IDEA), ['relacion-no-tema', 'parte-o-clase', 'clase-y-causa', 'sinonimo-antonimo', 'puente-justa']);
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
  for (const id of ['RV15', 'RV16', 'RV17', 'RV21', 'RVA1', 'RVA2', 'RVA3', 'RVA4', 'RVA5', 'RVA6', 'RVA7', 'RVA8']) {
    assert.ok(ids.has(id), `no sale ${id}`);
    assert.ok(codigos[id], `${id} no está en codigos.json`);
  }
});

// Tabla propia: qué código toca a cada relación de una incorrecta, según la del par base.
const VUELTA = [['CE', 'EC'], ['MAS', 'MENOS'], ['PLUGAR', 'LUGARP'], ['PVEH', 'VEHP'], ['PACC', 'ACCP'], ['IACC', 'ACCI'], ['IMIDE', 'MIDEI'], ['CUIDA', 'ACCP']];
const ESPERA = (b, a) => {
  if (VUELTA.some(([x, y]) => (x === b && y === a) || (x === a && y === b))) return 'RV16';
  if (a === 'TEMA') return 'RV15';
  if (b === 'H') return { USA: 'RVA5', SINP: 'RVA8' }[a] || 'RV17';
  if (['CLASE', 'PARTE', 'GRUPO'].includes(b)) return { CLASE: 'RVA2', PARTE: 'RVA6', GRUPO: 'RVA7' }[a] || 'RV17';
  if (['CE', 'EC'].includes(b)) return a === 'SUC' ? 'RVA1' : 'RV17';
  if (['SIN', 'ANT', 'MAS', 'MENOS'].includes(b)) return a === 'OTRO' ? 'RV21' : ['MAS', 'MENOS'].includes(a) || (a === 'ANT' && b !== 'SIN') ? 'RVA3' : 'RV17';
  return ['PESTA', 'PVA', 'IUSO'].includes(a) ? 'RVA5' : ['PSUSTACC', 'ISUST', 'PACC', 'IACC', 'ACCI'].includes(a) ? 'RVA4' : 'RV17';
};
test('el banco cuadra entero: una sola alternativa se une como el par base, y cada incorrecta tiene su código y su motivo', () => {
  const MOTIVO = { RV15: /mismo tema/, RV16: /al revés/, RV17: /otra relación|lugar|lo que hace|material|sinónimos|antónimos/, RV21: /rasgos distintos/, RVA1: /sucesión/, RVA2: /de clase/, RVA3: /intensidad|opuesto|antónimos/,
    RVA4: /categoría|nombra una cosa|es una acción/, RVA5: /muy amplia/, RVA6: /de parte/, RVA7: /de grupo/, RVA8: /falta la persona/ };
  for (const b of BANCOS) for (const it of gen[b]) {
    assert.equal(it.alts.filter(x => x[1] === it.base[1]).length, 1, it.id);
    const cods = it.alts.filter(x => x[1] !== it.base[1]).map(x => ESPERA(it.base[1], x[1]));
    assert.equal(new Set(cods).size, 4, `${it.id}: ${cods}`);
    for (let s = 0; s < 30; s++) {
      const p = gen.generar(`banco-${it.id}-${s}`, { idea: Object.keys(gen.TIPOS_POR_IDEA)[BANCOS.indexOf(b)] });
      if (p._datos.item !== it.id) continue;
      for (const a of p.alternativas.filter(x => x.error)) {
        const r = it.alts.find(x => x[0] === a.texto)[1];
        assert.equal(a.error.id, ESPERA(it.base[1], r), `${it.id}: «${a.texto}»`);
        assert.ok(MOTIVO[a.error.id].test(a.error.explicacion), `${it.id}: «${a.texto}» (${a.error.id}): «${a.error.explicacion}»`);
      }
    }
  }
});

test('ninguna alternativa repite una palabra del par base, y la correcta no es la única escrita dentro de otra', () => {
  for (const it of items) {
    const bw = it.base[0].split(' : ');
    for (const [t] of it.alts) assert.ok(!t.split(' : ').some(w => bw.includes(w)), `${it.id}: «${t}»`);
    const ok = it.alts.find(x => x[1] === it.base[1])[0], textos = it.alts.map(x => x[0]);
    const dentro = textos.filter(t => textos.some(x => x !== t && x.includes(t)));
    assert.ok(!(dentro.length === 1 && dentro[0] === ok), it.id);
  }
});

test('recuadro «Datos» en 400 semillas: lista de líneas cortas, sin la respuesta ni consejos', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), c = p.alternativas.find(a => a.correcta).texto;
    assert.ok(Array.isArray(p.datos) && p.datos.length >= 2, `semilla ${s}`);
    for (const l of p.datos) {
      assert.ok(l.split(/\s+/).length <= 22, `semilla ${s}: «${l}»`);
      assert.ok(!sinTilde(l).includes(sinTilde(c)), `semilla ${s}: los datos traen la respuesta`);
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
