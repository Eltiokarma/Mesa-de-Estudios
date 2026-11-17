// Pruebas de «¿Sustancia pura o mezcla?»: casos.json (calculados aparte, con un script que no usa el generador), un
// recálculo independiente en 600 problemas (las composiciones, escritas aquí sin las tablas del generador), fugas, el
// recuadro «Datos» en 400 semillas, la figura y el papel.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');

// ---- Camino independiente ----
// Cada material: sus sustancias (fórmulas) y cuántas zonas con borde se ven.
const COMPOSICION = {
  bronce: [['Cu', 'Sn'], 1], aire: [['N2', 'O2', 'Ar'], 1], diamante: [['C'], 1], sal: [['NaCl'], 1], ozono: [['O3'], 1],
  granito: [['SiO2', 'KAlSi3O8', 'mica'], 3], mar: [['H2O', 'NaCl'], 1], oro: [['Au'], 1], azucar: [['C12H22O11'], 1],
  acero: [['Fe', 'C'], 1], chicha: [['H2O', 'C12H22O11', 'otras'], 2], destilada: [['H2O'], 1], gaseosa: [['H2O', 'C12H22O11', 'CO2'], 2],
  'hielo-seco': [['CO2'], 1],
  // Lista del tipo contar (otros ids, la misma regla)
  oxigeno: [['O2'], 1], cobre: [['Cu'], 1], hieloSeco: [['CO2'], 1], nitrogeno: [['N2'], 1], arenaAgua: [['H2O', 'SiO2'], 2],
};
const FORMULA = { H2O: 'H2O', O2: 'O2', N2: 'N2', O3: 'O3', CO2: 'CO2', NaCl: 'NaCl', He: 'He', Ar: 'Ar', Cu: 'Cu', Sn: 'Sn', SiO2: 'SiO2', aceite: 'C18H34O2' };
const simbolos = f => new Set(f.match(/[A-Z][a-z]?/g)).size;
function clase(sustancias, zonas) {
  if (sustancias.length === 1) return simbolos(sustancias[0]) === 1 ? 'elemento' : 'compuesto';
  return zonas === 1 ? 'homogenea' : 'heterogenea';
}
function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'lupa') {
    const sus = [...new Set(d.capas.flat().map(([e]) => FORMULA[e]))];
    return 'clase:' + clase(sus, d.capas.length);
  }
  if (d.tipo === 'material') return 'clase:' + clase(...COMPOSICION[d.m]);
  if (d.tipo === 'formada') {
    const el = d.formulas.filter(f => simbolos(f) === 1).length;
    return 'formada:' + (el === d.formulas.length ? 'el' : el === 0 ? 'co' : 'am');
  }
  if (d.tipo === 'fases') {
    // Zonas: el agua (con lo disuelto) más hielo, aceite y arena. Sustancias: agua más todo lo que no es hielo.
    const F = 1 + d.partes.filter(x => ['hielo', 'aceite', 'arena'].includes(x)).length;
    const C = 1 + d.partes.filter(x => x !== 'hielo').length;
    return `fc:${F}|${C}`;
  }
  const cl = d.lista.map(k => clase(...COMPOSICION[k]));
  return cl.filter(c => (d.pide === 'mezclas' ? c === 'homogenea' || c === 'heterogenea' : d.pide === 'compuestos' ? c === 'compuesto' : c === 'elemento')).length;
}
probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => a === b });
probarFugas(gen, { grupo: p => p._datos.tipo });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(p.respuesta.valor, c.esperado.respuesta);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.texto);
  });
}

test('salen todos los tipos, los tres niveles y los errores típicos pedidos', () => {
  const tipos = new Set(), niveles = new Set(), ids = new Set(), clases = new Set();
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s), d = p._datos;
    tipos.add(d.tipo); niveles.add(d.nivel);
    if (d.tipo === 'lupa' || d.tipo === 'material') clases.add(d.tipo + '/' + p.respuesta.valor);
    for (const a of p.alternativas) if (a.error) ids.add(a.error.id);
  }
  for (const t of ['lupa', 'material', 'formada', 'fases', 'contar']) assert.ok(tipos.has(t), `no sale ${t}`);
  assert.deepEqual([...niveles].sort(), [1, 2, 3]);
  for (const t of ['lupa', 'material']) for (const k of ['elemento', 'compuesto', 'homogenea', 'heterogenea']) assert.ok(clases.has(`${t}/clase:${k}`), `${t}: no sale ${k}`);
  for (const id of ['MA9', 'MA10', 'QM-HOMO', 'QM-HETERO', 'QM-FASE-DISUELTO', 'QM-SIN-AGUA', 'QM-INVIERTE', 'AQ-solo-elementos', 'AQ-solo-compuestos', 'AQ-elementos-y-compuestos'])
    assert.ok(ids.has(id), `no sale ${id}`);
});

test('cada explicación empieza por lo que el alumno hizo bien; respaldo parcial solo para los códigos del informe', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas.filter(x => x.error)) {
      assert.match(a.error.explicacion, /^Bien/, `semilla ${s}: ${a.error.explicacion}`);
      assert.equal(a.error.respaldo, /^MA\d/.test(a.error.id) ? 'parcial' : 'hipotesis', `semilla ${s}: ${a.error.id}`);
      if (a.error.fuente) assert.match(a.error.fuente, /^docs\/investigacion\//);
    }
  }
});

test('en contar, cada error muestra el número que produce', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    if (p._datos.tipo !== 'contar') continue;
    for (const a of p.alternativas.filter(x => x.error && x.error.id !== 'MA10'))
      assert.ok(a.error.explicacion.includes(String(a.valor)), `semilla ${s}: «${a.error.explicacion}» no dice ${a.valor}`);
  }
});

// Recuadro «Datos» (docs/plan-calidad.md, contrato, punto 13): definiciones en una lista, una por línea, cortas,
// sin la respuesta; cada tipo trae las definiciones entre las que se elige.
test('datos: una lista de líneas cortas, sin la respuesta y con las definiciones de cada tipo, en 400 semillas', () => {
  const palabras = t => t.split(/\s+/).filter(w => /\p{L}/u.test(w)).length;
  const PIDE = {
    lupa: ['Sustancia pura: una sola clase de partícula', 'Elemento: átomos de una sola clase', 'Mezcla homogénea: una sola fase', 'cada bolita es un átomo'],
    material: ['Sustancia pura: una sola clase de partícula', 'Elemento: átomos de una sola clase', 'Mezcla homogénea: una sola fase'],
    formada: ['Elemento: átomos de una sola clase', 'cada símbolo es una clase de átomo'],
    fases: ['Fase: zona que se ve igual', 'Componente: cada sustancia distinta'],
    contar: ['Sustancia pura: una sola clase de partícula'],
  };
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), d = p._datos;
    assert.ok(Array.isArray(p.datos) && p.datos.length, `semilla ${s}: datos debe ser una lista no vacía`);
    for (const l of p.datos) {
      assert.ok(typeof l === 'string' && l.trim() === l && l.length, `semilla ${s}: línea vacía o con espacios`);
      assert.ok(palabras(l) <= 22, `semilla ${s}: «${l}» tiene ${palabras(l)} palabras`);
      assert.ok(!/<[a-z/]|\bnull\b|\bNaN\b|\bundefined\b|\d\.\d/i.test(l), `semilla ${s}: «${l}»`);
      assert.ok(!/^Dato:/i.test(l));
    }
    assert.equal(new Set(p.datos).size, p.datos.length, `semilla ${s}: líneas repetidas`);
    const todo = p.datos.join('\n'), c = p.alternativas.find(a => a.correcta).texto;
    for (const x of PIDE[d.tipo]) assert.ok(todo.includes(x), `semilla ${s} (${d.tipo}): falta «${x}»`);
    // La respuesta no está escrita en los datos: ni la clase (con su artículo) ni el número de la cuenta.
    assert.ok(!todo.toLowerCase().includes(c.toLowerCase()), `semilla ${s}: los datos traen la respuesta ${c}`);
    if (d.tipo === 'contar') assert.ok(!new RegExp(`(^|[^\\d,])${c}(?![\\d,])`).test(todo), `semilla ${s}: el número ${c} está en los datos`);
    if (d.tipo === 'fases') assert.ok(!/\d/.test(todo), `semilla ${s}: los datos de fases traen números`);
  }
});

test('la figura (solo en la lupa) es de partículas, en tinta, y no dice la clase', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    assert.equal(!!p.figura, p._datos.tipo === 'lupa', `semilla ${s}`);
    if (!p.figura) continue;
    assert.ok(!/var\(--c-/.test(p.figura.svg), `semilla ${s}: la figura usa colores de variable`);
    const todo = (p.figura.svg + ' ' + p.figura.alt).toLowerCase();
    for (const x of ['mezcla', 'compuesto', 'elemento', 'homog', 'heterog', 'pura']) assert.ok(!todo.includes(x), `semilla ${s}: la figura dice «${x}»`);
    // Tantos átomos dibujados como dicen las capas.
    const atomos = (p.figura.svg.match(/<circle/g) || []).length;
    const ESP = gen.ESP, esperado = p._datos.capas.flat().reduce((t, [e, n]) => t + n * ESP[e].at.length, 0);
    assert.equal(atomos, esperado, `semilla ${s}: ${atomos} átomos dibujados, ${esperado} en los datos`);
    const vb = p.figura.svg.match(/viewBox="0 0 (\d+) (\d+)"/);
    for (const m of p.figura.svg.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)"/g)) {
      const [x, y, r] = m.slice(1).map(Number);
      assert.ok(x - r >= 4 && x + r <= +vb[1] - 4 && y - r >= 0 && y + r <= +vb[2], `semilla ${s}: un átomo se sale del lienzo`);
    }
  }
});

test('nunca se queda sin cuatro alternativas (semillas 0 a 2000 y de texto)', () => {
  for (let s = 0; s <= 2000; s++) gen.generar(s);
  for (const s of ['entrada-1', 'entrada-2', 'salida-1', 'salida-3', 'papel-1', 'papel-8', 'examen-x']) gen.generar(s);
});
