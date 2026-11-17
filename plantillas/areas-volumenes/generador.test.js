// Pruebas de «Áreas y volúmenes»: casos.json (calculados aparte, con un script que no usa el generador), un
// recálculo independiente en 600 problemas, fugas, el recuadro «Datos» en 400 semillas y el papel.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');

// ---- Camino independiente ----
// Largos en metros; áreas y volúmenes se arman aquí elevando el largo (no con la tabla del generador).
const LARGO = { km: 1000, m: 1, dm: 0.1, cm: 0.01, mm: 0.001 };
const AREA = { 'km²': LARGO.km ** 2, 'm²': 1, 'dm²': LARGO.dm ** 2, 'cm²': LARGO.cm ** 2, 'mm²': LARGO.mm ** 2, ha: 100 * 100 };
const VOL = { 'm³': 1, 'dm³': LARGO.dm ** 3, L: LARGO.dm ** 3, 'cm³': LARGO.cm ** 3 };
const G_CM3 = 0.001 / LARGO.cm ** 3; // 1 g/cm³ en kg/m³
function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'area') {
    if (d.sub === 'losetas') return (d.a * d.b) / (d.L * LARGO.cm) ** 2;
    return d.x * AREA[d.de] / AREA[d.a];
  }
  if (d.tipo === 'volumen') {
    if (d.sub === 'cubo') return (d.L * LARGO.dm) ** 3 / VOL.L;
    if (d.sub === 'caja') return d.l * d.a * d.al * VOL['cm³'] / VOL.L;
    return d.x * VOL[d.de] / VOL[d.a];
  }
  if (d.tipo === 'densidad') {
    const rho = d.rho * G_CM3; // kg/m³
    if (d.sub === 'conv') return rho;
    if (d.sub === 'masa') return rho * d.dims.reduce((s, x) => s * x * LARGO.cm, 1);
    if (d.sub === 'masa-m3') return rho * d.V;
    return d.m / rho / VOL.L; // volumen, en litros
  }
  // caudal
  if (d.sub === 'caudal') return d.V / VOL.L / (d.t * 60);
  if (d.sub === 'tiempo') return d.V / VOL.L / d.q / 60;
  if (d.sub === 'convertir') return d.x * VOL.L * 60;
  return d.a * d.b * d.mm * LARGO.mm / VOL.L; // lluvia, en litros
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
    tipos.add(`${d.tipo}/${d.sub}`); niveles.add(d.nivel);
    for (const a of p.alternativas) if (a.error) ids.add(a.error.id);
  }
  for (const t of ['area/simple', 'area/ha', 'area/titicaca', 'area/losetas', 'volumen/simple', 'volumen/cubo', 'volumen/caja',
    'densidad/conv', 'densidad/masa', 'densidad/masa-m3', 'densidad/volumen', 'caudal/caudal', 'caudal/tiempo', 'caudal/convertir', 'caudal/lluvia'])
    assert.ok(tipos.has(t), `no sale ${t}`);
  assert.deepEqual([...niveles].sort(), [1, 2, 3]);
  // 100 en vez de 10 000, 1 m³ = 100 L, olvidar elevar, al cubo en un área, la fórmula de la densidad al revés.
  for (const id of ['U3-lineal', 'QU2-litro-como-100-cm3', 'U3-cuadrado', 'VOL-SIN-ELEVAR', 'CONV-CUBO', 'CONV-INVERSO', 'DENS-DESPEJE', 'HA-LADO', 'U4-gramos'])
    assert.ok(ids.has(id), `no sale ${id}`);
});

test('cada explicación empieza por lo que el alumno hizo bien y es hipótesis', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas.filter(x => x.error)) {
      assert.match(a.error.explicacion, /^Bien/, `semilla ${s}: ${a.error.explicacion}`);
      assert.equal(a.error.respaldo, 'hipotesis');
    }
  }
});

test('los textos no muestran un punto decimal ni «de el»', () => {
  const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? x.t : String(x));
  for (let s = 0; s < 800; s++) {
    const p = gen.generar(s);
    const todo = [plano(p.enunciado), plano(p.pregunta), ...p.solucion.map(plano), ...p.alternativas.map(a => a.texto), ...p.alternativas.filter(a => a.error).map(a => a.error.explicacion)].join(' ');
    assert.ok(!/\d\.\d|\b[Dd]e el\b|\b[Aa] el\b|\bese agua\b/.test(todo), `semilla ${s}: ${todo}`);
  }
});

// Un color fijo por magnitud (molde §5b, 17 nov), el de la teoría: lo que te dan naranja (d, a y b), el factor
// turquesa (k) y lo que se pide violeta (x). Falla si una cambia de color.
test('un color por magnitud: datos naranja, factor turquesa, lo que se pide violeta', () => {
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

test('el dato del mundo (el Titicaca) lleva su fuente', () => {
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s);
    if (p._datos.sub === 'titicaca') assert.ok(/ILEC/.test(p.fuente || ''), `semilla ${s}: sin fuente`);
  }
});

// Recuadro «Datos» (docs/plan-calidad.md, contrato, punto 13): equivalencias de LARGO, definiciones y fórmulas, una
// por línea, cortas (22 palabras o menos), sin la respuesta y sin la equivalencia ya elevada (1 m² = 10 000 cm²,
// 1 m³ = 1000 L): elevarla es lo que se practica.
test('datos: una lista de líneas cortas, sin la respuesta ni el factor elevado, en 400 semillas', () => {
  const palabras = t => t.split(/\s+/).filter(w => /\p{L}/u.test(w)).length;
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), d = p._datos;
    assert.ok(Array.isArray(p.datos) && p.datos.length, `semilla ${s}: datos debe ser una lista no vacía`);
    for (const l of p.datos) {
      assert.ok(typeof l === 'string' && l.trim() === l && l.length, `semilla ${s}: línea vacía o con espacios`);
      assert.ok(palabras(l) <= 22, `semilla ${s}: «${l}» tiene ${palabras(l)} palabras`);
      assert.ok(!/<[a-z/]|\bnull\b|\bNaN\b|\bundefined\b|\d\.\d/i.test(l), `semilla ${s}: «${l}»`);
      // Ninguna equivalencia de área o volumen ya elevada; sí las definiciones 1 L = 1 dm³.
      const sinDef = l.replace(/1 L = 1 dm³/, '');
      assert.ok(!/\d\s*(?:k|d|c|m)?m[²³]\s*=|=\s*[\d ]+\s*(?:k|d|c|m)?m[²³]|10 000|1000 L|\bha\s*=/.test(sinDef), `semilla ${s}: «${l}» da el factor ya elevado`);
    }
    assert.equal(new Set(p.datos).size, p.datos.length, `semilla ${s}: líneas repetidas`);
    const todo = p.datos.join('\n'), c = p.alternativas.find(a => a.correcta).texto, n = c.split(' ')[0];
    assert.ok(!c.includes(' ') || !todo.includes(c), `semilla ${s}: los datos traen la respuesta ${c}`);
    assert.ok(!new RegExp(`(^|[^\\d,])${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\d,])`).test(todo), `semilla ${s}: el número ${n} de la respuesta está en los datos`);
    // La fórmula de cada tipo.
    if (d.tipo === 'densidad') assert.ok(todo.includes('ρ = m / V'), `semilla ${s}: falta ρ = m / V`);
    if (d.tipo === 'caudal' && (d.sub === 'caudal' || d.sub === 'tiempo')) assert.ok(todo.includes('Q = V / t'), `semilla ${s}: falta Q = V / t`);
    if (d.sub === 'losetas') assert.ok(todo.includes('A = largo × ancho') && todo.includes('A = lado × lado'), `semilla ${s}`);
    if (d.sub === 'caja' || d.sub === 'lluvia' || d.sub === 'masa') assert.ok(todo.includes('V = largo × ancho × alto'), `semilla ${s}`);
    if (d.sub === 'cubo') assert.ok(todo.includes('V = lado × lado × lado'), `semilla ${s}`);
    // Lo que va con litros trae su definición.
    if (/L\b/.test(p.respuesta.unidad) || /\bL\b/.test(String(d.de)) || d.sub === 'caudal' || d.sub === 'tiempo') assert.ok(todo.includes('1 L = 1 dm³'), `semilla ${s}: falta 1 L = 1 dm³`);
  }
});

test('nunca se queda sin cuatro alternativas (semillas 0 a 2000 y de texto)', () => {
  for (let s = 0; s <= 2000; s++) gen.generar(s);
  for (const s of ['entrada-1', 'entrada-2', 'salida-1', 'salida-3', 'papel-1', 'examen-x']) gen.generar(s);
});
