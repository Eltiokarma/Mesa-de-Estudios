// Pruebas del generador «quimica-conceptos» (verdadero o falso de química): casos.json, un recálculo
// independiente en cada uno de 600 problemas (la respuesta se rehace leyendo el banco por id) y
// pruebas del banco de proposiciones y de los pares para relacionar.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');
const catalogo = require('../../catalogo/cursos/quimica.json');

const banco = Object.fromEntries(gen.BANCO.map(p => [p.id, p]));
const pares = Object.fromEntries(gen.PARES.flatMap(c => c.pares.map(p => [p.id, { ...p, conjunto: c.id }])));
const ROM = ['I', 'II', 'III', 'IV'];

// Camino independiente: se ignoran las alternativas y la respuesta del generador; solo se leen los ids
// que se mostraron y el banco.
function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'vf') return 'vf:' + d.ids.map(id => (banco[id].verdad ? 'V' : 'F')).join('');
  if (d.tipo === 'incorrecta' || d.tipo === 'correcta') {
    const buscada = d.tipo === 'correcta';
    const ganadoras = d.ids.filter(id => banco[id].verdad === buscada);
    assert.equal(ganadoras.length, 1, `${p.id}: debe haber una sola ${d.tipo}`);
    return 'p:' + ganadoras[0];
  }
  // relacionar: la letra de cada elemento de la izquierda es la posición de su par en la derecha.
  return 'rel:' + d.ids.map((id, k) => ROM[k] + 'abcd'[d.derecha.indexOf(id)]).join(', ');
}
probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => a === b });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(p.respuesta.valor, c.esperado.respuesta);
    assert.equal(p.respuesta.texto, c.esperado.texto);
  });
}

test('casos.json cubre los cuatro tipos', () => {
  const tipos = new Set(casos.casos.map(c => c.entrada.tipo));
  for (const t of ['vf', 'incorrecta', 'correcta', 'relacionar']) assert.ok(tipos.has(t), `falta ${t}`);
  assert.ok(casos.casos.length >= 15 && casos.casos.length <= 20);
});

test('banco: ids únicos, textos sin repetir y campos completos', () => {
  assert.ok(gen.BANCO.length >= 150 && gen.BANCO.length <= 250, `${gen.BANCO.length} proposiciones`);
  const ids = new Set(), textos = new Set();
  const unidades = new Set(catalogo.unidades.map(u => u.id));
  const norm = t => t.toLowerCase().replace(/[^a-záéíóúñü0-9]/g, '');
  for (const p of gen.BANCO) {
    assert.ok(!ids.has(p.id), `id repetido ${p.id}`); ids.add(p.id);
    assert.ok(!pares[p.id], `${p.id} choca con un id de los pares`);
    assert.ok(!textos.has(norm(p.texto)), `texto repetido: ${p.texto}`); textos.add(norm(p.texto));
    assert.ok(unidades.has(p.unidad), `${p.id}: unidad ${p.unidad} no está en el catálogo`);
    assert.equal(typeof p.verdad, 'boolean');
    assert.ok(p.texto.length > 20 && p.texto.length <= 160, `${p.id}: texto de largo ${p.texto.length}`);
    assert.ok(p.explicacion && p.explicacion.length > 10, `${p.id}: sin explicación`);
    if (p.verdad) {
      assert.equal(p.error, null); assert.equal(p.corregida, null);
      if (p.negar) assert.ok(gen.ERRORES[p.negar], `${p.id}: negar ${p.negar} no está en ERRORES`);
    } else {
      assert.ok(p.error && gen.ERRORES[p.error], `${p.id}: falsa sin error válido`);
      assert.ok(p.corregida && p.corregida !== p.texto, `${p.id}: falsa sin corregida`);
    }
  }
});

test('banco: cada unidad tiene al menos 6 proposiciones y 2 falsas; cada tema sirve para los tres tipos', () => {
  const porUnidad = {};
  for (const p of gen.BANCO) (porUnidad[p.unidad] = porUnidad[p.unidad] || []).push(p);
  for (const [u, ps] of Object.entries(porUnidad)) {
    assert.ok(ps.length >= 6, `${u}: ${ps.length}`);
    assert.ok(ps.filter(p => !p.verdad).length >= 2, `${u}: pocas falsas`);
  }
  for (const t of gen.TEMAS) {
    const ps = t.ids.map(id => banco[id]);
    assert.ok(ps.filter(p => p.verdad).length >= 4 && ps.filter(p => !p.verdad).length >= 4, `${t.id}: necesita 4 V y 4 F`);
    assert.ok(ps.every(p => p.tema === t.id && p.unidad === t.unidad));
  }
});

test('errores: respaldo válido y fuente existente; todos los códigos se usan', () => {
  const usados = new Set(['QA-negar-verdadera']);
  for (const p of gen.BANCO) { if (p.error) usados.add(p.error); if (p.negar) usados.add(p.negar); }
  for (const c of gen.PARES) { usados.add(c.codigo); if (c.codigoFamilia) usados.add(c.codigoFamilia); }
  for (const [k, e] of Object.entries(gen.ERRORES)) {
    assert.ok(['documentado', 'parcial', 'hipotesis'].includes(e.respaldo), k);
    if (k.startsWith('QA-')) assert.equal(e.respaldo, 'hipotesis', `${k}: los códigos nuevos son hipótesis`);
    assert.ok(usados.has(k), `${k} no se usa`);
  }
  for (const k of usados) assert.ok(gen.ERRORES[k], `${k} no está en ERRORES`);
});

test('pares: ids únicos, lados derechos distintos (salvo los tipos de sólido) y choques válidos', () => {
  const ids = new Set();
  for (const c of gen.PARES) {
    assert.ok(c.pares.length >= 4, c.id);
    for (const p of c.pares) { assert.ok(!ids.has(p.id), p.id); ids.add(p.id); }
    const ders = c.pares.map(p => p.der);
    if (c.id !== 'solido-ejemplo') assert.equal(new Set(ders).size, ders.length, `${c.id}: lados derechos repetidos`);
    else assert.ok(new Set(ders).size >= 4);
    for (const ch of c.choques || []) for (const id of ch) assert.ok(c.pares.some(p => p.id === id), `${c.id}: choque ${id}`);
    for (const id of c.familia || []) assert.ok(c.pares.some(p => p.id === id), `${c.id}: familia ${id}`);
  }
});

test('600 problemas: los textos coinciden con el banco y aparecen todos los tipos y temas', () => {
  const tipos = {}, temas = new Set(), conjuntos = new Set();
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    tipos[d.tipo] = (tipos[d.tipo] || 0) + 1;
    const enun = p.enunciado.map(x => (typeof x === 'string' ? x : x.t)).join('');
    if (d.tipo === 'relacionar') {
      conjuntos.add(d.conjunto);
      assert.ok(d.ids.length >= 3 && d.ids.length <= 4);
      assert.ok(d.ids.some((id, k) => d.derecha[k] !== id), `semilla ${s}: la derecha va en el mismo orden`);
      assert.equal(new Set(d.ids.map(id => pares[id].der)).size, d.ids.length, `semilla ${s}: dos pares con la misma derecha`);
      for (const id of d.ids) { assert.ok(enun.includes(pares[id].izq) && enun.includes(pares[id].der)); assert.equal(pares[id].conjunto, d.conjunto); }
      continue;
    }
    temas.add(d.tema);
    for (const id of d.ids) assert.equal(banco[id].tema, d.tema, `semilla ${s}: ${id} no es del tema`);
    if (d.tipo === 'vf') {
      assert.ok(d.ids.length >= 3 && d.ids.length <= 4);
      d.ids.forEach((id, k) => assert.ok(enun.includes(`${ROM[k]}. ${banco[id].texto}`), `semilla ${s}: falta la ${ROM[k]}`));
      for (const a of p.alternativas) assert.match(a.texto, new RegExp(`^[VF]{${d.ids.length}}$`));
      // Cada distractor difiere en una o dos posiciones de la correcta.
      for (const a of p.alternativas.filter(x => !x.correcta)) {
        const dif = [...a.texto].filter((c, k) => c !== p.respuesta.texto[k]).length;
        assert.ok(dif === 1 || dif === 2, `semilla ${s}: ${a.texto} difiere en ${dif}`);
      }
    } else {
      assert.ok(d.ids.length >= 4 && d.ids.length <= 5);
      assert.deepEqual(p.alternativas.map(a => a.valor).sort(), d.ids.map(id => 'p:' + id).sort());
      for (const a of p.alternativas) assert.equal(a.texto, banco[a.valor.slice(2)].texto);
      for (const a of p.alternativas.filter(x => !x.correcta)) {
        const q = banco[a.valor.slice(2)];
        assert.equal(a.error.id, q.verdad ? (q.negar || 'QA-negar-verdadera') : q.error);
      }
    }
  }
  for (const t of ['vf', 'incorrecta', 'correcta', 'relacionar']) assert.ok(tipos[t] > 50, `${t}: ${tipos[t]}`);
  for (const t of gen.TEMAS) assert.ok(temas.has(t.id), `el tema ${t.id} no salió`);
  for (const c of gen.PARES) assert.ok(conjuntos.has(c.id), `el conjunto ${c.id} no salió`);
});

test('en vf, invertir una falsa lleva el error de esa proposición', () => {
  let n = 0;
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.tipo !== 'vf') continue;
    for (const a of p.alternativas.filter(x => !x.correcta)) {
      const dif = [...a.texto].map((c, k) => (c !== p.respuesta.texto[k] ? k : -1)).filter(k => k >= 0);
      if (dif.length !== 1) continue;
      const q = banco[d.ids[dif[0]]];
      assert.equal(a.error.id, q.verdad ? (q.negar || 'QA-negar-verdadera') : q.error, `semilla ${s}`);
      n++;
    }
  }
  assert.ok(n > 300);
});
