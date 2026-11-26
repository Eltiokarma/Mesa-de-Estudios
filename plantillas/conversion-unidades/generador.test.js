// Pruebas de «Cambiar de unidad»: casos.json (calculados aparte, con un script que no usa el generador), un
// recálculo independiente en 600 problemas, fugas, el recuadro «Datos» en 400 semillas y el papel.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');

// ---- Camino independiente ----
// Cada unidad, en la unidad del SI (m, kg, s, m/s), escrita aquí sin la tabla de exponentes del generador.
const SI = {
  km: 1000, m: 1, cm: 0.01, mm: 0.001, 'μm': 0.000001,
  t: 1000, kg: 1, g: 0.001, mg: 0.000001,
  h: 3600, min: 60, s: 1,
  'km/h': 1000 / 3600, 'm/s': 1, 'm/min': 1 / 60,
};
const cambiar = (x, de, a) => x * SI[de] / SI[a];
function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'tiempo' && d.sub === 'h-min') return (d.h * 3600 + d.min * 60) / SI.h;
  if (d.tipo === 'dos-cambios' && d.sub === 'media') return (d.d * SI[d.ud]) / (d.t * SI[d.ut]) / SI[d.a];
  if (d.tipo === 'comparar') {
    const a = Array.isArray(d.a) ? d.a[0] * SI.h + d.a[1] * SI.min : d.a * SI[d.ua];
    const b = d.b * SI[d.ub];
    return d.sub === 'diferencia' ? a - b : a / b;
  }
  return cambiar(d.x, d.de, d.a);
}
const cerca = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
probarGenerador(gen, { semillas: 600, recalcular, igual: cerca });
probarFugas(gen, { grupo: p => [p._datos.tipo, p._datos.sub || ''].join('/') });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(cerca(p.respuesta.valor, c.esperado.respuesta), `da ${p.respuesta.valor}, se esperaba ${c.esperado.respuesta}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.texto);
  });
}

test('salen todos los tipos, los tres niveles y los errores típicos pedidos', () => {
  const tipos = new Set(), niveles = new Set(), ids = new Set();
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s), d = p._datos;
    tipos.add(d.tipo + (d.sub ? '/' + d.sub : '')); niveles.add(d.nivel);
    for (const a of p.alternativas) if (a.error) ids.add(a.error.id);
  }
  for (const t of ['longitud', 'masa', 'tiempo/min-s', 'tiempo/s-min', 'tiempo/h-s', 'tiempo/h-min', 'rapidez', 'notacion',
    'dos-cambios/media', 'dos-cambios/compuesta', 'comparar/veces', 'comparar/cuantas', 'comparar/diferencia']) assert.ok(tipos.has(t), `no sale ${t}`);
  assert.deepEqual([...niveles].sort(), [1, 2, 3]);
  // Multiplicar en vez de dividir, 100 en vez de 1000, el 3,6 al revés, una sola unidad de la rapidez, la coma.
  for (const id of ['CONV-INVERSO', 'CONV-PREFIJO', 'U1-al-reves', 'CONV-UNA-UNIDAD', 'CONV-COMA', 'CONV-BASE-100', 'AU4-hora-decimal', 'CONV-EXP-SIGNO', 'U1-sin-convertir'])
    assert.ok(ids.has(id), `no sale ${id}`);
});

// Desde el 26 nov (redacción) las explicaciones ya no tienen que empezar por «Bien»: esa exigencia producía
// telegramas («Bien el 60, pero al revés…»). Cada una sigue diciendo qué estuvo bien y qué cambiar, en una oración.
test('cada explicación de un error es hipótesis', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas.filter(x => x.error)) {
      assert.equal(a.error.respaldo, 'hipotesis');
    }
  }
});

test('los textos no muestran 10⁰, ni un punto decimal, ni «de el»', () => {
  const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? x.t : String(x));
  for (let s = 0; s < 800; s++) {
    const p = gen.generar(s);
    const todo = [plano(p.enunciado), plano(p.pregunta), ...p.solucion.map(plano), ...p.alternativas.map(a => a.texto), ...p.alternativas.filter(a => a.error).map(a => a.error.explicacion)].join(' ');
    assert.ok(!/10⁰|\d\.\d|\b[Dd]e el\b|\b[Aa] el\b/.test(todo), `semilla ${s}: ${todo}`);
  }
});

// Un color fijo por magnitud (molde §5b, 17 nov), el de la teoría: lo que te dan naranja (d, y a y b al comparar), el
// factor turquesa (k) y lo que se pide violeta (x). Falla si una cambia de color.
test('un color por magnitud: dato naranja, factor turquesa, lo que se pide violeta', () => {
  const COLOR = { d: 'o', a: 'o', b: 'o', k: 'i', x: 'f' };
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), V = p.variables;
    for (const [k, x] of Object.entries(V)) assert.equal(x.color, COLOR[k], `semilla ${s}: ${k} (${x.nombre}) en ${x.color}`);
    assert.ok(p.pregunta.some(x => typeof x === 'object' && x.v === 'x'), `semilla ${s}: lo que se pide no va en violeta`);
    // Todo tramo de color es de una variable del problema (si no, la app lo pinta naranja, como un dato).
    for (const linea of [p.enunciado, p.pregunta, ...p.solucion])
      for (const x of linea) if (x && typeof x === 'object') assert.ok(V[x.v], `semilla ${s}: «${x.t}» usa la variable ${x.v}, que no existe`);
  }
});

// Recuadro «Datos» (docs/plan-calidad.md, contrato, punto 13): equivalencias y fórmulas en una lista, una por línea,
// cortas (22 palabras o menos), sin la respuesta ni el factor ya armado (nada de 3,6).
test('datos: una lista de líneas cortas en texto plano, sin la respuesta, en 400 semillas', () => {
  const palabras = t => t.split(/\s+/).filter(w => /\p{L}/u.test(w)).length;
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), d = p._datos;
    assert.ok(Array.isArray(p.datos) && p.datos.length, `semilla ${s}: datos debe ser una lista no vacía`);
    for (const l of p.datos) {
      assert.ok(typeof l === 'string' && l.trim() === l && l.length, `semilla ${s}: línea vacía o con espacios`);
      assert.ok(palabras(l) <= 22, `semilla ${s}: «${l}» tiene ${palabras(l)} palabras`);
      assert.ok(!/<[a-z/]|\bnull\b|\bNaN\b|\bundefined\b|\d\.\d|3,6/i.test(l), `semilla ${s}: «${l}»`);
      assert.ok(!/^Dato:/i.test(l));
    }
    assert.equal(new Set(p.datos).size, p.datos.length, `semilla ${s}: líneas repetidas`);
    const todo = p.datos.join('\n'), c = p.alternativas.find(a => a.correcta).texto;
    assert.ok(!c.includes(' ') || !todo.includes(c), `semilla ${s}: los datos traen la respuesta ${c}`);
    const n = c.split(' ')[0];
    assert.ok(!new RegExp(`(^|[^\\d,])${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\d,])`).test(todo) || n === '1', `semilla ${s}: el número ${n} de la respuesta está en los datos`);
    // Cada tipo trae lo que necesita, y solo equivalencias de una unidad con otra (nunca el factor combinado).
    if (d.tipo === 'rapidez' || (d.tipo === 'comparar' && d.ua === 'km/h')) assert.deepEqual(p.datos, ['1 km = 1000 m', '1 h = 3600 s'], `semilla ${s}`);
    if (d.tipo === 'notacion') assert.ok(todo.includes('a × 10ⁿ') && todo.includes('10ᵃ × 10ᵇ'), `semilla ${s}: falta la notación científica`);
    if (d.tipo === 'dos-cambios' && d.sub === 'media') assert.ok(todo.includes('v = d / t'), `semilla ${s}: falta v = d / t`);
    assert.ok(!/km\/h =|m\/s =/.test(todo), `semilla ${s}: los datos dan la rapidez ya convertida`);
  }
});

test('nunca se queda sin cuatro alternativas (semillas 0 a 2000 y de texto)', () => {
  for (let s = 0; s <= 2000; s++) gen.generar(s);
  for (const s of ['entrada-1', 'entrada-2', 'salida-1', 'salida-3', 'papel-1', 'examen-x']) gen.generar(s);
});
