// Pruebas de «Poca masa, muchísima energía»: casos.json (calculados aparte, con un script que no usa el generador), un
// recálculo independiente en 600 problemas (E = Δm · c² con c = 3 × 10⁸ m/s, escrito aquí), fugas, el recuadro «Datos»
// en 400 semillas y el papel.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador, probarFugas, dentroDeEscala } = require('../../nucleo/probar-generador.js');

// ---- Camino independiente ----
const c = 3e8, KG = { mg: 1e-6, g: 1e-3 };
function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'energia') return d.x * KG[d.u] * c * c;
  if (d.tipo === 'masa') return d.E / (c * c) * 1000;
  if (d.tipo === 'que-masa') return 'masa:falta';
  if (d.tipo === 'defecto') return (d.antes - d.despues) * 1e-3 * c * c;
  return Math.round(d.mg * 1e-6 * c * c / 4.6e8);
}
const igual = (a, b) => (typeof a === 'number' ? Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a)) : a === b);
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
  for (const t of ['energia', 'masa', 'que-masa', 'defecto', 'balones']) assert.ok(tipos.has(t), `no sale ${t}`);
  assert.deepEqual([...niveles].sort(), [1, 2, 3]);
  for (const id of ['QM-TODA-MASA', 'QM-MASA-IGUAL', 'QM-MASA-QUEDA', 'QM-C2-SOLO-POTENCIA', 'QM-C2-DOBLE', 'QU1-mg-como-g', 'QU1-g-como-kg', 'QU1-kg-como-g'])
    assert.ok(ids.has(id), `no sale ${id}`);
});

test('explicaciones que empiezan por «Bien», hipótesis, escala y el valor de cada error', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas.filter(x => x.error)) {
      assert.match(a.error.explicacion, /^Bien/, `semilla ${s}: ${a.error.explicacion}`);
      assert.equal(a.error.respaldo, 'hipotesis');
      if (typeof p.respuesta.valor === 'number') {
        assert.ok(dentroDeEscala(a, p.respuesta.valor), `semilla ${s}: ${a.texto} fuera de escala`);
        assert.ok(a.error.explicacion.includes(a.texto), `semilla ${s}: «${a.error.explicacion}» no muestra ${a.texto}`);
      }
    }
  }
});

test('datos: una lista de líneas cortas, sin la respuesta, con la fórmula y sin c² ya elevado, en 400 semillas', () => {
  const palabras = t => t.split(/\s+/).filter(w => /\p{L}/u.test(w)).length;
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), d = p._datos;
    assert.ok(Array.isArray(p.datos) && p.datos.length, `semilla ${s}: datos debe ser una lista no vacía`);
    for (const l of p.datos) {
      assert.ok(typeof l === 'string' && l.trim() === l && l.length && palabras(l) <= 22, `semilla ${s}: «${l}»`);
      assert.ok(!/<[a-z/]|\bnull\b|\bNaN\b|\bundefined\b|\d\.\d|^Dato:/i.test(l), `semilla ${s}: «${l}»`);
    }
    const todo = p.datos.join('\n'), cor = p.alternativas.find(a => a.correcta).texto;
    assert.ok(todo.includes('E = Δm · c²'), `semilla ${s}: falta la fórmula`);
    assert.ok(!/9 × 10¹⁶|c² =/.test(todo), `semilla ${s}: los datos dan c² ya elevado`);
    if (d.tipo !== 'que-masa') assert.ok(todo.includes('c = 3 × 10⁸ m/s') && /1 kg = /.test(todo), `semilla ${s}: faltan c o la equivalencia`);
    if (d.tipo === 'defecto' || d.tipo === 'que-masa') assert.ok(todo.includes('Δm: la masa antes menos la masa después'), `semilla ${s}: falta qué es Δm`);
    if (d.tipo === 'balones') assert.ok(todo.includes('unos 4,6 × 10⁸ J'), `semilla ${s}: falta la energía de un balón`);
    assert.ok(!todo.includes(cor), `semilla ${s}: los datos traen la respuesta ${cor}`);
    if (typeof p.respuesta.valor === 'number') assert.ok(!new RegExp(`(^|[^\\d,])${cor.split(' ')[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\d,])`).test(todo), `semilla ${s}: el número de ${cor} está en los datos`);
  }
});

test('colores por papel: Δm naranja, c² turquesa, la energía de un balón verde, lo que se pide violeta', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), V = p.variables;
    for (const [k, x] of Object.entries(V)) assert.equal(x.color, { dm: 'o', c2: 'i', E: 'i', b: 'd', x: 'f' }[k], `semilla ${s}: ${k}`);
    assert.ok(p.pregunta.some(x => typeof x === 'object' && x.v === 'x'), `semilla ${s}: lo que se pide no va en violeta`);
    for (const linea of [p.enunciado, p.pregunta, ...p.solucion])
      for (const x of linea) if (x && typeof x === 'object') assert.ok(V[x.v], `semilla ${s}: «${x.t}» usa la variable ${x.v}, que no existe`);
  }
});

test('nunca se queda sin cuatro alternativas (semillas 0 a 2000 y de texto)', () => {
  for (let s = 0; s <= 2000; s++) gen.generar(s);
  for (const s of ['entrada-1', 'entrada-2', 'salida-1', 'salida-3', 'papel-1', 'papel-8', 'examen-x']) gen.generar(s);
});
