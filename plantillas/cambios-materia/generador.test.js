// Pruebas de «¿Físico, químico o nuclear?»: casos.json (calculados aparte, con un script que no usa el generador), un
// recálculo independiente en 600 problemas (tipos de cambio y cuentas de átomos con tablas escritas aquí), fugas, el
// recuadro «Datos» en 400 semillas, la figura y el papel.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador, probarFugas, dentroDeEscala } = require('../../nucleo/probar-generador.js');

// ---- Camino independiente ----
const QUIMICOS = new Set(['clavo', 'lena', 'vinagre', 'gas', 'leche', 'pan', 'chicha']);
const NUCLEARES = new Set(['c14']);
const PROP_QUIMICAS = new Set(['arde', 'oxida', 'zinc', 'papel', 'agria', 'bicarbonato']);
const tipoFen = k => (QUIMICOS.has(k) ? 'quimico' : NUCLEARES.has(k) ? 'nuclear' : 'fisico');
// Lupas: [especies de antes], [especies de después], ¿cambia algún elemento?
const LUPA = { agua: 'quimico', funde: 'fisico', amoniaco: 'quimico', c14: 'nuclear', hierve: 'fisico', propano: 'quimico', oxido: 'quimico', condensa: 'fisico' };
// Átomos: moléculas de lo que se pide = átomos del elemento antes − los del producto fijo, entre los de cada molécula.
const ATOMOS = { propano: [8, 0, 2], propanoC: [3, 0, 1], agua: [8, 0, 2], oxido: [4, 0, 2], amoniaco: [4, 0, 1], metano: [8, 0, 2], etano: [12, 0, 2] };
function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'cual') { const b = d.ids.filter(k => tipoFen(k) === d.pide); assert.equal(b.length, 1); return 'fen:' + b[0]; }
  if (d.tipo === 'propiedad') { const b = d.ids.filter(k => PROP_QUIMICAS.has(k) === (d.pide === 'quimica')); assert.equal(b.length, 1); return 'prop:' + b[0]; }
  if (d.tipo === 'lupa') return 'cambio:' + LUPA[d.caso];
  if (d.tipo === 'atomos') { const [a, fijo, k] = ATOMOS[d.caso]; return (a - fijo) / k; }
  if (d.tipo === 'contar') return d.ids.filter(k => tipoFen(k) === 'quimico').length;
  // balanza: cerrado, nada entra; abierto, entra el oxígeno: 24/56 de la masa de hierro.
  return d.cerrado ? d.frasco : Number((d.frasco + d.lana * 3 / 7).toPrecision(12));
}
const igual = (a, b) => (typeof a === 'number' ? Math.abs(a - b) < 1e-9 : a === b);
probarGenerador(gen, { semillas: 600, recalcular, igual });
probarFugas(gen, { grupo: p => [p._datos.tipo, p._datos.cerrado === undefined ? '' : p._datos.cerrado].join('/') });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(igual(c.esperado.respuesta, p.respuesta.valor), `da ${p.respuesta.valor}, se esperaba ${c.esperado.respuesta}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.texto);
  });
}

test('la tabla de fenómenos del generador coincide con la de la prueba', () => {
  for (const [k, x] of Object.entries(gen.FEN)) assert.equal(x.clase === 'quimico' ? 'quimico' : x.clase === 'nuclear' ? 'nuclear' : 'fisico', tipoFen(k), k);
  for (const [k, x] of Object.entries(gen.PROP)) assert.equal(x.clase === 'quimica', PROP_QUIMICAS.has(k), k);
});

test('salen todos los tipos, los tres niveles, los tres cambios en la lupa y los errores típicos pedidos', () => {
  const tipos = new Set(), niveles = new Set(), ids = new Set(), lupas = new Set();
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s), d = p._datos;
    tipos.add(d.tipo); niveles.add(gen.NIVEL[d.tipo]);
    if (d.tipo === 'lupa') lupas.add(p.respuesta.valor);
    for (const a of p.alternativas) if (a.error) ids.add(a.error.id);
  }
  for (const t of ['cual', 'propiedad', 'lupa', 'atomos', 'contar', 'balanza']) assert.ok(tipos.has(t), `no sale ${t}`);
  assert.deepEqual([...niveles].sort(), [1, 2, 3]);
  assert.deepEqual([...lupas].sort(), ['cambio:fisico', 'cambio:nuclear', 'cambio:quimico']);
  for (const id of ['MA1', 'MA2', 'MA3', 'MA4', 'MA5', 'QM-NUCLEAR', 'QM-CUENTA-O', 'QM-MOLECULAS-IGUALES', 'QM-SUBINDICE', 'QM-MASA-SE-VA', 'QM-SOLO-SOLIDO', 'QM-SUMA-OXIDO', 'QM-FORMA'])
    assert.ok(ids.has(id), `no sale ${id}`);
});

test('explicaciones que empiezan por «Bien», respaldos, escala y el valor de cada error numérico', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    for (const a of p.alternativas.filter(x => x.error)) {
      assert.match(a.error.explicacion, /^Bien/, `semilla ${s}: ${a.error.explicacion}`);
      assert.equal(a.error.respaldo, /^MA\d/.test(a.error.id) ? 'parcial' : 'hipotesis', `semilla ${s}: ${a.error.id}`);
      if (typeof p.respuesta.valor === 'number') assert.ok(dentroDeEscala(a, p.respuesta.valor), `semilla ${s}: ${a.texto} fuera de escala`);
      if (d.tipo === 'balanza' || d.tipo === 'contar') assert.ok(a.error.explicacion.includes(a.texto.replace(' g', '')), `semilla ${s}: «${a.error.explicacion}» no muestra ${a.texto}`);
    }
  }
});

test('datos: una lista de líneas cortas, sin la respuesta y con las definiciones o la fórmula de cada tipo, en 400 semillas', () => {
  const palabras = t => t.split(/\s+/).filter(w => /\p{L}/u.test(w)).length;
  const PIDE = {
    cual: ['Cambio físico:', 'Cambio químico:', 'Cambio nuclear:'], contar: ['Cambio físico:', 'Cambio químico:', 'Cambio nuclear:'],
    lupa: ['Cambio físico:', 'Cambio químico:', 'Cambio nuclear:', 'cada bolita es un átomo'], propiedad: ['Propiedad física:', 'Propiedad química:'],
    atomos: ['los átomos de cada elemento son los mismos', 'subíndice'], balanza: ['56 g de hierro toman 24 g de oxígeno', 'no se crean ni se destruyen'],
  };
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), d = p._datos;
    assert.ok(Array.isArray(p.datos) && p.datos.length, `semilla ${s}: datos debe ser una lista no vacía`);
    for (const l of p.datos) {
      assert.ok(typeof l === 'string' && l.trim() === l && l.length && palabras(l) <= 22, `semilla ${s}: «${l}»`);
      assert.ok(!/<[a-z/]|\bnull\b|\bNaN\b|\bundefined\b|\d\.\d|^Dato:/i.test(l), `semilla ${s}: «${l}»`);
    }
    const todo = p.datos.join('\n'), c = p.alternativas.find(a => a.correcta).texto;
    for (const x of PIDE[d.tipo]) assert.ok(todo.includes(x), `semilla ${s} (${d.tipo}): falta «${x}»`);
    assert.ok(!todo.includes(c), `semilla ${s}: los datos traen la respuesta ${c}`);
    if (typeof p.respuesta.valor === 'number') assert.ok(!new RegExp(`(^|[^\\d,])${c.split(' ')[0]}(?![\\d,])`).test(todo), `semilla ${s}: el número de la respuesta está en los datos`);
  }
});

test('la figura (solo en la lupa) es de partículas, en tinta, cabe en el lienzo y no dice el tipo de cambio', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    assert.equal(!!p.figura, p._datos.tipo === 'lupa', `semilla ${s}`);
    if (!p.figura) continue;
    assert.ok(!/var\(--c-/.test(p.figura.svg), `semilla ${s}: la figura usa colores de variable`);
    const todo = (p.figura.svg + ' ' + p.figura.alt).toLowerCase();
    for (const x of ['físico', 'químico', 'nuclear']) assert.ok(!todo.includes(x), `semilla ${s}: la figura dice «${x}»`);
    const c = gen.LUPAS[p._datos.caso], esperado = [...c.antes, ...c.despues].reduce((t, [e, n]) => t + n * gen.ESP[e].at.length, 0);
    assert.equal((p.figura.svg.match(/<circle/g) || []).length, esperado, `semilla ${s}: átomos dibujados`);
    const [, W, H] = p.figura.svg.match(/viewBox="0 0 (\d+) (\d+)"/).map(Number);
    const cs = [...p.figura.svg.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)"/g)].map(m => m.slice(1).map(Number));
    for (const [x, y, r] of cs) assert.ok(x - r >= 4 && x + r <= W - 4 && y - r >= 22 && y + r <= H, `semilla ${s}: un átomo se sale`);
  }
});

test('nunca se queda sin cuatro alternativas (semillas 0 a 2000 y de texto)', () => {
  for (let s = 0; s <= 2000; s++) gen.generar(s);
  for (const s of ['entrada-1', 'entrada-2', 'salida-1', 'salida-3', 'papel-1', 'papel-8', 'examen-x']) gen.generar(s);
});

// Toda molécula dibujada lleva los átomos de su fórmula (auditoría, 17 nov, A1: el propano salía con 2 H y no con 8, y
// en el frasco cerrado «aparecían» 6 hidrógenos). Las fórmulas van escritas aquí, aparte del generador. Además se cuenta
// en el dibujo: los átomos de cada elemento son los mismos antes y después en los cambios químicos y físicos.
const FORMULA = { H2O: 'H2O', O2: 'O2', H2: 'H2', N2: 'N2', NH3: 'NH3', CO2: 'CO2', C3H8: 'C3H8', Fe: 'Fe', Fe2O3: 'Fe2O3', C: 'C', N: 'N' };
const contar = f => { const c = {}; for (const [, e, n] of f.matchAll(/([A-Z][a-z]?)(\d*)/g)) c[e] = (c[e] || 0) + (n ? +n : 1); return c; };
test('cada molécula dibujada tiene los átomos de su fórmula (propano: 3 C y 8 H)', () => {
  const usadas = new Set(Object.values(gen.LUPAS).flatMap(c => [...c.antes, ...c.despues].map(([e]) => e)));
  for (const e of usadas) {
    assert.ok(FORMULA[e], `${e} sin fórmula en la prueba`);
    const dib = {}; for (const [a] of gen.ESP[e].at) { const el = a === 'h' ? 'H' : a; dib[el] = (dib[el] || 0) + 1; }
    assert.deepEqual(dib, contar(FORMULA[e]), `${e} dibujado con ${JSON.stringify(dib)}`);
  }
  assert.ok(usadas.has('C3H8'));
});
test('en cada lupa dibujada, los átomos de antes son los de después (salvo el nuclear, que cambia de elemento)', () => {
  const visto = new Set();
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s); if (!p.figura) continue;
    visto.add(p._datos.caso);
    const c = gen.LUPAS[p._datos.caso];
    // Se cuenta en el SVG: letras dentro de cada panel (el primer panel termina en la flecha).
    const [, izq, der] = p.figura.svg.split('<rect');
    const letras = t => { const r = {}; for (const m of t.matchAll(/>([A-Z][a-z]?)<\/text>/g)) r[m[1]] = (r[m[1]] || 0) + 1; delete r.A; return r; };
    const sinTitulo = t => t.replace(/<text[^>]*font-size="12"[^>]*>[^<]*<\/text>/g, '');
    const a = letras(sinTitulo(izq)), d = letras(sinTitulo(der));
    if (c.antes.some(([e]) => e === 'C') && c.despues.some(([e]) => e === 'N')) { assert.equal(a.C, (d.C || 0) + (d.N || 0), `semilla ${s}`); continue; }
    assert.deepEqual(a, d, `semilla ${s}, ${p._datos.caso}: antes ${JSON.stringify(a)}, después ${JSON.stringify(d)}`);
  }
  assert.ok(visto.has('propano') && visto.has('oxido'));
});
test('el hierro va como átomos, no como moléculas (auditoría, M9)', () => {
  for (let s = 0; s < 600; s++) { const p = gen.generar(s); assert.ok(!/moléculas? de Fe(?![₀-₉])/.test(JSON.stringify(p.enunciado)), `semilla ${s}`); }
});
