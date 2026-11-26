// Pruebas de «La mitad cada cierto tiempo»: casos.json (calculados aparte, con un script que no usa el generador), un
// recálculo independiente en 600 problemas (en cada vida media queda la mitad, escrito aquí con un bucle, sin 2 ** n),
// fugas, el recuadro «Datos» en 400 semillas y el papel.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador, probarFugas, dentroDeEscala } = require('../../nucleo/probar-generador.js');

// ---- Camino independiente ----
// Vidas medias de libro, escritas otra vez aquí (no se leen del generador).
const VM = { cobalto: 5.3, cesio: 30, estroncio: 29, c14: 5730, yodo: 8, tecnecio: 6, fosforo: 14 };
const HORAS_O_DIAS = { día: 24, días: 24, semanas: 7 };
const mitades = (x, n) => { let q = x; for (let k = 0; k < n; k++) q /= 2; return q; };
const cuantas = (t, T) => Math.round(t / T * 1e9) / 1e9;
function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'queda') return mitades(d.m0, d.n);
  if (d.tipo === 'masa') return mitades(d.m0, cuantas(d.t, VM[d.fuente]));
  if (d.tipo === 'tiempo') return d.n * VM[d.sustancia];
  if (d.tipo === 'desintegrado') { const q = mitades(1, cuantas(d.t, VM[d.sustancia])); return d.como === 'porcentaje' ? 100 * (1 - q) : 1 - q; }
  if (d.tipo === 'vida') return d.t / d.n;
  if (d.tipo === 'unidades') return mitades(1, cuantas(d.t * HORAS_O_DIAS[d.unidadT], VM[d.sustancia]));
  // deducir: de m0 a m0/4 en t1 son 2 vidas medias
  const T = d.t1 / 2;
  return mitades(d.m0, cuantas(d.t2, T));
}
const igual = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a));
probarGenerador(gen, { semillas: 600, recalcular, igual });
probarFugas(gen, { grupo: p => p._datos.tipo });

for (const k of casos.casos) {
  test(`casos.json: semilla ${k.semilla}`, () => {
    const p = gen.generar(k.semilla);
    assert.deepEqual(p._datos, k.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(igual(k.esperado.respuesta, p.respuesta.valor), `da ${p.respuesta.valor}, se esperaba ${k.esperado.respuesta}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, k.esperado.texto);
  });
}

test('salen todos los tipos, los tres niveles y los errores típicos pedidos', () => {
  const tipos = new Set(), niveles = new Set(), ids = new Set();
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s);
    tipos.add(p._datos.tipo); niveles.add(p._datos.nivel);
    for (const a of p.alternativas) if (a.error) ids.add(a.error.id);
  }
  for (const t of ['queda', 'masa', 'tiempo', 'desintegrado', 'vida', 'unidades', 'deducir']) assert.ok(tipos.has(t), `no sale ${t}`);
  assert.deepEqual([...niveles].sort(), [1, 2, 3]);
  for (const id of ['AQ-vm-lineal', 'AQ-vm-divide-entre-2n', 'AQ-vm-desintegrada', 'AQ-vm-tiempo-como-una-vida', 'AQ-vm-una-vida-de-menos',
    'AQ-vm-multiplica-fraccion', 'AQ-vm-sin-convertir', 'AQ-vm-lee-tiempo-sin-mitad']) assert.ok(ids.has(id), `no sale ${id}`);
});

test('explicaciones: hipótesis, escala y el valor de cada error', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas.filter(x => x.error)) {
      assert.equal(a.error.respaldo, 'hipotesis');
      assert.ok(dentroDeEscala(a, p.respuesta.valor), `semilla ${s}: ${a.texto} fuera de escala`);
      if (a.error.id !== 'AQ-vm-desintegrada') assert.ok(a.error.explicacion.includes(a.texto), `semilla ${s}: «${a.error.explicacion}» no muestra ${a.texto}`);
      else assert.ok(a.error.explicacion.includes(a.texto.split(' ')[0]), `semilla ${s}: «${a.error.explicacion}» no muestra ${a.texto}`);
    }
    // Una fracción como alternativa siempre es de potencias de 2 (un decimal suelto se delataría por la forma).
    if (p.respuesta.unidad === '') for (const a of p.alternativas) assert.match(a.texto, /^\d+\/\d+$/, `semilla ${s}: «${a.texto}»`);
  }
});

test('datos: una lista de líneas cortas, sin la respuesta, con la fórmula de cada tipo y sin n ya contado, en 400 semillas', () => {
  const palabras = t => t.split(/\s+/).filter(w => /\p{L}/u.test(w)).length;
  const FORMULA = { queda: 'm = m_0 / 2ⁿ', masa: 'm = m_0 / 2ⁿ', tiempo: 'n = t ÷ vida media', desintegrado: 'Lo desintegrado', vida: 'n = t ÷ vida media',
    unidades: 'Fracción que queda', deducir: 'm = m_0 / 2ⁿ' };
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), d = p._datos;
    assert.ok(Array.isArray(p.datos) && p.datos.length, `semilla ${s}: datos debe ser una lista no vacía`);
    for (const l of p.datos) {
      assert.ok(typeof l === 'string' && l.trim() === l && l.length && palabras(l) <= 22, `semilla ${s}: «${l}»`);
      assert.ok(!/<[a-z/]|\bnull\b|\bNaN\b|\bundefined\b|\d\.\d|^Dato:/i.test(l), `semilla ${s}: «${l}»`);
    }
    const todo = p.datos.join('\n'), cor = p.alternativas.find(a => a.correcta).texto;
    assert.ok(todo.includes(FORMULA[d.tipo]), `semilla ${s} (${d.tipo}): falta «${FORMULA[d.tipo]}»`);
    assert.ok(/Vida media: tiempo|Vida media del/.test(todo), `semilla ${s}: falta la vida media o su definición`);
    // La vida media de la sustancia va en los datos, salvo cuando es lo que se pide o sale de los datos (vida, deducir).
    if (['vida', 'deducir'].includes(d.tipo)) assert.ok(!/Vida media del/.test(todo), `semilla ${s}: los datos regalan la vida media`);
    else if (d.tipo !== 'queda') assert.ok(/Vida media del .*: un(o|a)s /.test(todo), `semilla ${s}: la vida media de libro va con «unos»`);
    if (d.tipo === 'unidades') assert.ok(/1 (día|semana) = /.test(todo), `semilla ${s}: falta la equivalencia de tiempo`);
    assert.ok(!/n = \d|2[²³⁴⁵⁶]/.test(todo), `semilla ${s}: los datos traen n ya contado`);
    assert.ok(!new RegExp(`(^|[^\\d,/])${cor.split(' ')[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\d,/])`).test(todo), `semilla ${s}: el número de ${cor} está en los datos`);
  }
});

test('colores como la teoría: masa naranja, tiempo turquesa, vida media violeta, n carmín', () => {
  const COLOR = { m0: 'o', m: 'o', t: 'i', th: 'f', n: 'h' };
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), V = p.variables;
    for (const [k, x] of Object.entries(V)) assert.equal(x.color, COLOR[k], `semilla ${s}: ${k}`);
    assert.ok(p.pregunta.some(x => typeof x === 'object'), `semilla ${s}: lo que se pide no lleva color`);
    for (const linea of [p.enunciado, p.pregunta, ...p.solucion])
      for (const x of linea) if (x && typeof x === 'object') assert.ok(V[x.v], `semilla ${s}: «${x.t}» usa la variable ${x.v}, que no existe`);
  }
});

test('sin partículas subatómicas ni «isótopo», y masas en gramos solo de las fuentes grandes', () => {
  const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), txt = [p.enunciado, p.pregunta, p.datos, p.solucion, p.alternativas.map(a => a.error ? a.error.explicacion : '')].map(plano).join(' ');
    assert.ok(!/protón|neutrón|electrón|alfa|beta|isótopo/i.test(txt), `semilla ${s}: ${txt}`);
    if (/yodo|tecnecio|fósforo|carbono/.test(plano(p.enunciado))) assert.ok(!/\d g\b/.test(plano([p.enunciado, p.pregunta])), `semilla ${s}: dosis o hueso en gramos`);
  }
});

test('nunca se queda sin cuatro alternativas (semillas 0 a 2000 y de texto)', () => {
  for (let s = 0; s <= 2000; s++) gen.generar(s);
  for (const s of ['entrada-1', 'entrada-2', 'salida-1', 'salida-3', 'papel-1', 'papel-8', 'examen-x']) gen.generar(s);
});
