// Pruebas de «Conectores»: casos.json (calculados aparte, con un léxico propio que no usa el generador), un recálculo por
// otro camino en 600 problemas, fugas, los tipos por idea, el recuadro «Datos» y que el banco cuadre entero. El recálculo
// no usa las funciones del generador: con su propia tabla de conectores busca la única alternativa que cumple en todos
// los espacios del ítem.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');

const BANCOS = ['RELACION', 'CAUSA', 'CLASES', 'LOCUCIONES', 'ESPACIOS'];
const items = BANCOS.flatMap(b => gen[b]);
const porId = Object.fromEntries(items.map(it => [it.id, it]));
const sinTilde = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// Tabla propia (no la del generador): la relación que marca cada conector.
const REL = {};
for (const [r, cs] of Object.entries({ contraste: 'sin embargo|pero|aun así|no obstante|en cambio', concesión: 'aunque|si bien|aun cuando|a pesar de que',
  consecuencia: 'por eso|así que|por lo tanto|por consiguiente|de modo que|de manera que', causa: 'porque|ya que|dado que|puesto que',
  adición: 'además|también|asimismo|así como|además de que', reformulación: 'es decir|o sea|en otras palabras', ejemplo: 'por ejemplo',
  orden: 'primero|antes|después|finalmente', cierre: 'en resumen|en suma|en síntesis' })) for (const c of cs.split('|')) REL[c] = r;
const cumple = (t, pide) => t.split(' – ').every((c, k) => REL[c.toLowerCase()] === pide[k]);

test('los ids del banco no se repiten', () => assert.equal(new Set(items.map(i => i.id)).size, items.length));

function recalcular(p) {
  const it = porId[p._datos.item], pide = it.pide.split(' ');
  const b = p.alternativas.filter(a => cumple(a.texto, pide));
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
  assert.deepEqual(Object.keys(gen.TIPOS_POR_IDEA), ['relacion-primero', 'causa-consecuencia', 'clases', 'locuciones', 'varios-espacios']);
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
  for (const id of ['RV24', 'RV25', 'RV26', 'RV35', 'RVC1', 'RVC2', 'RVC4', 'RVC5', 'RVC6']) {
    assert.ok(ids.has(id), `no sale ${id}`);
    assert.ok(codigos[id], `${id} no está en codigos.json`);
  }
});

// El motivo que tiene que decir la explicación de cada código (tabla propia).
const MOTIVO = { RV24: /resultado|razón/, RV25: /razón/, RV26: /suma/, RV35: /repetición|caso|paso|cierre/, RVC1: /al revés|resultado|razón/,
  RVC2: /choque|obstáculo/, RVC4: /Acierta en el espacio/, RVC5: /suma/, RVC6: /resultado|razón/ };
test('el banco cuadra entero: una sola que cumple, incorrectas con códigos distintos y su motivo', () => {
  for (const [k, b] of BANCOS.entries()) for (const it of gen[b]) {
    const pide = it.pide.split(' ');
    assert.deepEqual([it.ok, ...it.malas].filter(t => cumple(t, pide)), [it.ok], it.id);
    for (let s = 0; s < 40; s++) {
      const p = gen.generar(`banco-${it.id}-${s}`, { idea: Object.keys(gen.TIPOS_POR_IDEA)[k] });
      if (p._datos.item !== it.id) continue;
      const cs = p.alternativas.filter(x => x.error).map(a => a.error.id);
      assert.equal(new Set(cs).size, cs.length, `${it.id}: ${cs}`);
      for (const a of p.alternativas.filter(x => x.error)) {
        assert.ok(MOTIVO[a.error.id].test(a.error.explicacion), `${it.id}: «${a.texto}» (${a.error.id}): «${a.error.explicacion}»`);
        assert.ok(/bien/.test(a.error.explicacion), `${it.id}: «${a.texto}»: empieza por lo que hizo bien`);
      }
    }
  }
});

test('la correcta no está escrita dentro de otra, ni otra dentro de la correcta', () => {
  for (const it of items) {
    const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), dentro = (a, b) => new RegExp(`(^|\\s)${esc(a)}(\\s|$)`, 'i').test(b);
    assert.ok(!it.malas.some(t => dentro(it.ok, t) || dentro(t, it.ok)), it.id);
  }
});

test('recuadro «Datos» en 400 semillas: lista de líneas cortas, sin consejos ni la relación que pide el espacio', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    assert.ok(Array.isArray(p.datos) && p.datos.length >= 2, `semilla ${s}`);
    for (const l of p.datos) {
      assert.ok(l.split(/\s+/).length <= 22, `semilla ${s}: «${l}»`);
      assert.ok(!/^(Recuerda|Ojo|Cuidado|No olvides|Ten en cuenta|Fíjate|Conviene|Al revés)/.test(l), `semilla ${s}: «${l}»`);
      assert.ok(!/espacio (1|2|3) pide/i.test(l), `semilla ${s}: los datos dicen qué pide un espacio`);
    }
    // Cada conector de la correcta tiene su relación en los datos, para que se pueda elegir por criterio.
    const c = p.alternativas.find(a => a.correcta).texto;
    for (const x of c.split(' – ')) assert.ok(p.datos.some(l => sinTilde(l).includes(sinTilde(x))), `semilla ${s}: «${x}» no está en los datos`);
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

test('ninguna oración usa una palabra de dos lecturas, «pista», «contexto» ni Ilave; un solo hueco «¿…?»', () => {
  const MALOS = /\b(caliente|vivo|viva|fresco|fresca|bravo|brava|rico|rica|jalar|jaló|palta|piña|prendido|despierto|pistas?|contexto|Ilave)\b/i;
  for (const it of items) {
    assert.ok(!MALOS.test(it.o), `${it.id}: «${it.o}»`);
    assert.ok(/¿…\?/.test(it.o) && !/_{3}/.test(it.o), `${it.id}: hueco`);
    assert.equal((it.o.match(/¿…\?/g) || []).length, it.pide.split(' ').length, `${it.id}: un espacio por relación`);
  }
});

// ---------- Cierre (20 nov; rutinas/auditoria/razonamiento-verbal.conectores.md) ----------
test('cierre · Datos: el conector de cada alternativa mostrada tiene su relación en el recuadro, en 6 líneas o menos', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), D = sinTilde(p.datos.join(' '));
    assert.ok(p.datos.length <= 6, `semilla ${s}: ${p.datos.length} líneas`);
    for (const a of p.alternativas.filter(x => x.texto !== 'No sé')) for (const c of a.texto.split(' – '))
      assert.ok(new RegExp(`[(,] ?${sinTilde(c)}[,)]`).test(D) || D.includes(`«${sinTilde(c)}»`), `semilla ${s} ${p._datos.item}: «${c}» no está en los Datos`);
  }
});

test('cierre · la puntuación junto al espacio no delata el conector: «, ¿…?» dentro de la oración y nunca «¿…?,»', () => {
  for (const it of items) for (const m of it.o.matchAll(/¿…\?(?: \(\d\))?/g)) {
    const antes = it.o.slice(0, m.index), despues = it.o.slice(m.index + m[0].length);
    assert.ok(!/^,/.test(despues), `${it.id}: coma después del espacio`);
    assert.ok(!antes.trim() || /\.\s*$/.test(antes) || /, $/.test(antes), `${it.id}: «${it.o}»`);
  }
});

test('cierre · varios espacios: «la que más comparte», «la que menos» y «la más repetida por lugar» no aciertan más que el azar', () => {
  const suma = { mas: 0, menos: 0, moda: 0 }, malos = []; let n = 0, azar = 0;
  for (const tipo of ['espacios', 'espacios-examen']) for (let s = 0; s < 300; s++) {
    const p = gen.generar(`fuga-${tipo}-${s}`, { idea: 'varios-espacios' });
    if (p._datos.tipo !== tipo) continue;
    const al = p.alternativas.filter(a => a.texto !== 'No sé'), sp = al.map(a => a.texto.toLowerCase().split(' – ')), c = al.findIndex(a => a.correcta);
    const prob = v => { const m = Math.max(...v), top = v.map((x, k) => (x === m ? k : -1)).filter(k => k >= 0); return top.includes(c) ? 1 / top.length : 0; };
    const sc = sp.map(a => sp.reduce((t, b) => t + (a === b ? 0 : a.filter((x, k) => x === b[k]).length), 0));
    const pts = sp.map(() => 0);
    for (let k = 0; k < sp[0].length; k++) {
      const f = {}; sp.forEach(a => { f[a[k]] = (f[a[k]] || 0) + 1; });
      const m = Math.max(...Object.values(f)); if (Object.values(f).every(v => v === m)) continue;
      sp.forEach((a, j) => { if (f[a[k]] === m) pts[j]++; });
    }
    suma.mas += prob(sc); suma.menos += prob(sc.map(v => -v)); suma.moda += prob(pts); azar += 1 / al.length; n++;
    // Un problema delata si alguna de las tres maneras acierta más de 15 puntos sobre el azar.
    if (Math.max(prob(sc), prob(sc.map(v => -v)), prob(pts)) > 1 / al.length + 0.15) malos.push(`${p._datos.item} ${tipo}`);
  }
  for (const [k, v] of Object.entries(suma)) assert.ok(v / n <= azar / n + 0.1, `${k}: acierta ${Math.round(100 * v / n)} % (azar ${Math.round(100 * azar / n)} %)`);
  assert.ok(malos.length / n <= 0.1, `${malos.length} de ${n} problemas delatan la correcta: ${[...new Set(malos)]}`);
});
