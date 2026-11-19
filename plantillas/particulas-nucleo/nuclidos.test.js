// Pruebas de la tabla de núclidos reales (nuclidos.js; auditoría de Estructura atómica, B5). Comprueban la forma de la
// tabla contra datos escritos aquí aparte (cuántos isótopos naturales tiene cada elemento, cuáles tienen uno solo, el
// tecnecio sin ninguno), que nada se repite y que la búsqueda en un texto reconoce «¹⁴C», «²³Na⁺» y «carbono-14» y deja
// pasar las letras genéricas (X, Y) y los números que no son de masa («argón 18»).
const test = require('node:test');
const assert = require('node:assert/strict');
const N = require('./nuclidos.js');

test('la tabla llega de Z = 1 a 54, con un símbolo y un nombre por elemento', () => {
  assert.equal(N.Z_MAX, 54);
  assert.equal(N.SIMB.length, 55); assert.equal(N.NOMBRE.length, 55); assert.equal(N.NATURALES.length, 55);
  assert.equal(new Set(N.SIMB).size, 55); assert.equal(new Set(N.NOMBRE).size, 55);
  assert.equal(N.SIMB[6], 'C'); assert.equal(N.SIMB[26], 'Fe'); assert.equal(N.SIMB[54], 'Xe'); assert.equal(N.NOMBRE[53], 'yodo');
  for (let z = 1; z <= 54; z++) assert.match(N.SIMB[z], /^[A-Z][a-z]?$/);
});

test('isótopos naturales: la cantidad de cada elemento, escrita aparte, y los que tienen uno solo', () => {
  // Cuántos isótopos tiene la composición natural de cada elemento, de Z = 1 a 54 (escrito aquí, sin leer la tabla).
  const CUANTOS = [2, 2, 2, 1, 2, 2, 2, 3, 1, 3, 1, 3, 1, 3, 1, 4, 2, 3, 3, 6, 1, 5, 2, 4, 1, 4, 1, 5, 2, 5, 2, 5, 1, 6, 2, 6, 2, 4, 1, 5, 1, 7, 0, 7,
    1, 6, 2, 8, 2, 10, 2, 8, 1, 9];
  assert.equal(CUANTOS.length, 54);
  for (let z = 1; z <= 54; z++) assert.equal(N.NATURALES[z].length, CUANTOS[z - 1], `${N.NOMBRE[z]} (Z = ${z})`);
  // Los elementos con un solo isótopo natural, hasta Z = 54, con su número de masa.
  const UNO = { Be: 9, F: 19, Na: 23, Al: 27, P: 31, Sc: 45, Mn: 55, Co: 59, As: 75, Y: 89, Nb: 93, Rh: 103, I: 127 };
  for (let z = 1; z <= 54; z++) if (N.NATURALES[z].length === 1) assert.equal(UNO[N.SIMB[z]], N.NATURALES[z][0], N.SIMB[z]);
  assert.equal(Object.keys(UNO).length, N.NATURALES.filter(x => x.length === 1).length);
  assert.deepEqual(N.NATURALES[43], [], 'el tecnecio no tiene isótopos naturales');
  // Un elemento de Z impar tiene a lo más dos isótopos naturales, salvo el potasio (39, 40 y 41).
  for (let z = 1; z <= 54; z += 2) assert.ok(N.NATURALES[z].length <= (z === 19 ? 3 : 2), `${N.NOMBRE[z]}: Z impar`);
  // Los más abundantes de algunos elementos, de memoria de cualquier tabla periódica (la masa atómica redondeada).
  for (const [s, a] of [['H', 1], ['C', 12], ['N', 14], ['O', 16], ['Na', 23], ['Cl', 35], ['Cl', 37], ['K', 39], ['Ca', 40], ['Fe', 56], ['Cu', 63], ['Cu', 65], ['Br', 79], ['Br', 81], ['Ag', 107], ['Ag', 109], ['Sn', 120], ['Xe', 132]])
    assert.ok(N.esNatural(N.numeroAtomico(s), a), `${s}-${a}`);
  // Y masas que parecen naturales por la masa atómica, pero no lo son (el promedio de dos isótopos).
  for (const [s, a] of [['Br', 80], ['Cl', 36], ['Cu', 64], ['Ag', 108], ['Ga', 70], ['Sb', 122]]) assert.ok(!N.esNatural(N.numeroAtomico(s), a), `${s}-${a}`);
});

test('ningún núclido repetido, masas en orden, A ≥ Z y neutrones en un rango posible', () => {
  const vistos = new Set();
  const revisa = (z, a) => {
    assert.ok(Number.isInteger(z) && z >= 1 && z <= 54 && Number.isInteger(a), `${z}-${a}`);
    assert.ok(!vistos.has(`${z}-${a}`), `${N.SIMB[z]}-${a} repetido`);
    vistos.add(`${z}-${a}`);
    const n = a - z;
    // Solo el hidrógeno-1 no tiene neutrones y el helio-3 tiene menos neutrones que protones; de ahí en adelante N ≥ Z
    // en los naturales, y nunca pasa de 1,6 veces Z.
    assert.ok(n >= 0 && n <= Math.ceil(1.6 * z), `${N.SIMB[z]}-${a}: ${n} neutrones`);
  };
  N.NATURALES.forEach((as, z) => {
    assert.deepEqual(as, [...as].sort((p, q) => p - q), `${N.NOMBRE[z]}: en orden`);
    as.forEach(a => { revisa(z, a); if (z > 2) assert.ok(a - z >= z, `${N.SIMB[z]}-${a}: natural con menos neutrones que protones`); });
  });
  for (const [z, a, motivo] of N.RADIACTIVOS) { revisa(z, a); assert.ok(typeof motivo === 'string' && motivo.length > 3, `${z}-${a}: sin motivo`); }
  assert.equal(vistos.size, N.NATURALES.flat().length + N.RADIACTIVOS.length);
  // Los radiactivos que nombran los libros de la unidad están, y no pasan por naturales.
  for (const [s, a] of [['H', 3], ['C', 14], ['P', 32], ['Co', 60], ['Sr', 90], ['Tc', 99], ['I', 131]]) {
    const z = N.numeroAtomico(s);
    assert.ok(N.existe(z, a) && !N.esNatural(z, a), `${s}-${a}`);
  }
  assert.ok(N.esNatural(19, 40), 'el potasio-40 es radiactivo, pero natural');
  assert.deepEqual(N.masas(6), [11, 12, 13, 14]);
  assert.ok(!N.existe(1, 15) && !N.existe(6, 20) && !N.existe(35, 80) && !N.existe(60, 144), 'lo que no está, no existe para la tabla');
});

test('enTexto: reconoce el núclido escrito con su elemento y deja pasar las letras genéricas y los números atómicos', () => {
  const h = t => N.enTexto(t).map(x => `${N.SIMB[x.z]}-${x.a}`);
  assert.deepEqual(h('El ¹⁴C pasa a ¹⁴N; el ion ²³Na⁺ y el ⁵⁶Fe³⁺.'), ['C-14', 'N-14', 'Na-23', 'Fe-56']);
  assert.deepEqual(h('carbono-14, Carbono-12 y cloro‑37'), ['C-14', 'C-12', 'Cl-37']);
  assert.deepEqual(h('El ion ⁴⁰X²⁺ y el átomo ⁸⁰Y: letras genéricas.'), []);
  assert.deepEqual(h('argón 18, sodio 11 y 1s²2s²2p⁶ no nombran un núclido; [Ar]4s²3d¹⁰ tampoco.'), []);
  assert.deepEqual(h('⁸⁰Br⁻'), ['Br-80']);
});
