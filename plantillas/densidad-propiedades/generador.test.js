// Pruebas de «Lo que no cambia al partir»: casos.json (calculados aparte, con un script que no usa el generador), un
// recálculo independiente en 600 problemas (ρ = m / V y sus despejes; las propiedades y los métodos, con tablas
// escritas aquí), fugas, el recuadro «Datos» en 400 semillas y el papel.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador, probarFugas, dentroDeEscala } = require('../../nucleo/probar-generador.js');

// ---- Camino independiente ----
const INTENSIVAS = new Set(['densidad', 'temperatura', 'temperatura de fusión', 'temperatura de ebullición', 'viscosidad',
  'conductividad eléctrica', 'color', 'olor', 'sabor', 'brillo', 'dureza']);
const METODO = { 'agua-arena': 'filtracion', 'agua-aceite': 'decantacion', 'agua-alcohol': 'destilacion', 'hierro-azufre': 'imantacion', 'sal-mar': 'evaporacion', 'sal-agua': 'destilacion' };
const r12 = x => Number(x.toPrecision(12));
function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'densidad') return r12(d.m / ((d.v0 + d.V) - d.v0));
  if (d.tipo === 'liquido') return d.sub === 'masa' ? r12(d.rho * d.litros * 1000) : r12(d.masa / d.rho);
  if (d.tipo === 'cubo') return r12(d.kg * 1000 / (d.lado * d.lado * d.lado));
  if (d.tipo === 'barra') return `parte:${r12(d.m / d.partes)}|${r12(d.m / d.V)}`;
  if (d.tipo === 'contar') return d.lista.filter(x => INTENSIVAS.has(x)).length;
  if (d.tipo === 'separar') return 'metodo:' + METODO[d.caso];
  // intensiva: la única de la lista que es intensiva (igual) o extensiva (mitad).
  const buenas = d.lista.filter(x => INTENSIVAS.has(x) === (d.pide === 'igual'));
  assert.equal(buenas.length, 1, 'intensiva: más de una opción correcta');
  return 'prop:' + buenas[0];
}
const igual = (a, b) => (typeof a === 'number' ? Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a)) : a === b);
probarGenerador(gen, { semillas: 600, recalcular, igual });
probarFugas(gen, { grupo: p => [p._datos.tipo, p._datos.sub || ''].join('/') });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(igual(c.esperado.respuesta, p.respuesta.valor), `da ${p.respuesta.valor}, se esperaba ${c.esperado.respuesta}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.texto);
  });
}

test('salen todos los tipos, los tres niveles y los errores típicos pedidos', () => {
  const tipos = new Set(), niveles = new Set(), ids = new Set();
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s), d = p._datos;
    tipos.add(d.tipo + (d.sub ? '/' + d.sub : '')); niveles.add(gen.NIVEL[d.tipo]);
    for (const a of p.alternativas) if (a.error) ids.add(a.error.id);
  }
  for (const t of ['densidad', 'intensiva', 'liquido/masa', 'liquido/volumen', 'separar', 'cubo', 'barra', 'contar']) assert.ok(tipos.has(t), `no sale ${t}`);
  assert.deepEqual([...niveles].sort(), [1, 2, 3]);
  for (const id of ['QM-RHO-INVIERTE', 'QM-RHO-PRODUCTO', 'QM-PROBETA', 'QM-COMO-AGUA', 'QU2-litros-sin-mL', 'QU1-kg-sin-g', 'QM-AREA',
    'QM-FILTRA-DISUELTO', 'QM-DECANTA-MISCIBLE', 'QM-METODO', 'AT1', 'Q4', 'QM-PARTE-DENSIDAD'])
    assert.ok(ids.has(id), `no sale ${id}`);
});

test('explicaciones: respaldos y escala de los distractores', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas.filter(x => x.error)) {
      assert.equal(a.error.respaldo, ['AT1', 'Q4'].includes(a.error.id) ? 'parcial' : 'hipotesis', `semilla ${s}: ${a.error.id}`);
      if (typeof p.respuesta.valor === 'number') assert.ok(dentroDeEscala(a, p.respuesta.valor), `semilla ${s}: ${a.texto} fuera de escala`);
    }
  }
});

test('las incorrectas de densidad, cubo y líquido muestran en la explicación el valor que producen', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    if (!['densidad', 'cubo'].includes(p._datos.tipo) && !(p._datos.tipo === 'liquido' && p._datos.sub === 'masa')) continue;
    for (const a of p.alternativas.filter(x => x.error && !['QM-COMO-AGUA'].includes(x.error.id))) {
      const n = a.texto.split(' ')[0];
      assert.ok(a.error.explicacion.includes(n), `semilla ${s}: «${a.error.explicacion}» no muestra ${n}`);
    }
  }
});

test('datos: una lista de líneas cortas, sin la respuesta y con la fórmula de cada tipo, en 400 semillas', () => {
  const palabras = t => t.split(/\s+/).filter(w => /\p{L}/u.test(w)).length;
  const PIDE = {
    densidad: ['ρ = m / V', '1 mL = 1 cm³', 'lo que sube el agua'], liquido: ['ρ = m / V', 'g/mL'], cubo: ['ρ = m / V', 'lado × lado × lado', '1 kg = 1000 g'],
    barra: ['ρ = m / V', 'Propiedad intensiva', 'Propiedad extensiva'], intensiva: ['Propiedad intensiva', 'Propiedad extensiva'],
    contar: ['Propiedad intensiva', 'Propiedad extensiva'], separar: [],
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
    if (d.tipo === 'separar') assert.ok(p.datos.filter(l => /^(Filtración|Decantación|Destilación|Evaporación|Imantación):/.test(l)).length >= 4, `semilla ${s}: faltan los métodos entre los que se elige`);
    // En separar se elige entre los métodos: sus definiciones van todas, también la del que se pide.
    if (d.tipo !== 'separar') assert.ok(!todo.includes(c), `semilla ${s}: los datos traen la respuesta ${c}`);
    if (typeof p.respuesta.valor === 'number') {
      const n = c.split(' ')[0];
      assert.ok(!new RegExp(`(^|[^\\d,])${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\d,])`).test(todo), `semilla ${s}: el número ${n} de la respuesta está en los datos`);
    }
    // Nunca una tabla de densidades de metales: la densidad del metal es lo que se pide.
    assert.ok(!/oro|plata|cobre|hierro|plomo|aluminio|zinc/i.test(todo) || d.tipo === 'separar', `semilla ${s}: los datos dan densidades de metales`);
  }
});

// Un color fijo por magnitud, el de la teoría (molde §5b, Gerson 17 nov; auditoría M1: la masa y el volumen pedidos iban
// en violeta). Tabla escrita aquí aparte; plantillas/materia-energia/colores.test.js la compara además con la teoría.
test('un color por magnitud: masa naranja, volumen y lado turquesa, densidad violeta, también cuando se piden', () => {
  const POR_MAG = { masa: 'o', volumen: 'i', longitud: 'i', densidad: 'f' };
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), V = p.variables;
    for (const [k, x] of Object.entries(V)) assert.equal(x.color, POR_MAG[x.mag], `semilla ${s}: ${k} (${x.mag})`);
    for (const linea of [p.enunciado, p.pregunta, ...p.solucion])
      for (const x of linea) if (x && typeof x === 'object') assert.ok(V[x.v], `semilla ${s}: «${x.t}» usa la variable ${x.v}, que no existe`);
  }
});

test('nunca se queda sin cuatro alternativas (semillas 0 a 2000 y de texto)', () => {
  for (let s = 0; s <= 2000; s++) gen.generar(s);
  for (const s of ['entrada-1', 'entrada-2', 'salida-1', 'salida-3', 'papel-1', 'papel-8', 'examen-x']) gen.generar(s);
});
