// Pruebas del glosario por tema (nucleo/glosario.js).
const test = require('node:test');
const assert = require('node:assert/strict');
const G = require('./glosario.js');

test('clave sin tildes ni mayúsculas, y plurales simples', () => {
  assert.equal(G.clave(' Aceleración '), 'aceleracion');
  assert.equal(G.plural('fuerza'), 'fuerzas');
  assert.equal(G.plural('vector'), 'vectores');
  assert.equal(G.plural('luz'), 'luces');
  assert.equal(G.plural('ion'), 'iones');
  assert.equal(G.plural('tórax'), null);
  assert.equal(G.plural('reacción'), 'reacciones');
  assert.equal(G.plural('masa molar'), null);
});

test('marcas: la forma más larga primero, una sola vez por término y nunca dentro de otra palabra', () => {
  const ent = [{ termino: 'masa' }, { termino: 'masa molar' }, { termino: 'mol' }];
  const txt = 'La masa molar no es la masa. Un mol de molinos; otro mol.';
  const m = G.marcas(txt, ent);
  assert.deepEqual(m.map(x => txt.slice(x.inicio, x.fin)), ['masa molar', 'masa', 'mol']);
  assert.deepEqual(m.map(x => x.clave), ['masa molar', 'masa', 'mol']);
  // Los ya marcados en la pantalla no se marcan otra vez.
  assert.deepEqual(G.marcas('masa y mol', ent, new Set(['masa'])).map(x => x.clave), ['mol']);
  // Mayúsculas y plural.
  assert.equal(G.marcas('Las Masas pesan', ent).length, 1);
});

test('texto de la unidad: junta cadenas y partes de ecuación, sin los nombres internos', () => {
  const t = G.texto({ unidad: 'x.y', ideas: [{ id: 'velocidad', titulo: 'Rapidez', regla: { texto: ['La ', { v: 'c-o', t: 'v' }, ' cambia'] } }] });
  assert.match(t, /Rapidez/); assert.match(t, /La v cambia/);
  assert.doesNotMatch(t, /velocidad/);
});

test('revisar: topes, término repetido, definición circular y término que no aparece', () => {
  const base = { ideas: [{ titulo: 'La fuerza y el peso', consigna: 'Empuja la caja.' }] };
  assert.deepEqual(G.revisar(base), []);
  assert.deepEqual(G.revisar(Object.assign({ glosario: [{ termino: 'fuerza', def: 'Un empujón o un tirón sobre un cuerpo.' }] }, base)), []);
  const p = G.revisar(Object.assign({ glosario: [
    { termino: 'fuerza', def: 'La fuerza es la fuerza.' },
    { termino: 'Fuerza', def: 'Otra vez.' },
    { termino: 'masa', def: 'Cuánta materia tiene un cuerpo.' },
    { termino: 'F', def: 'Letra.' },
    { termino: 'peso', def: Array(25).fill('palabra').join(' ') },
  ] }, base)).join('\n');
  assert.match(p, /«fuerza»: la definición usa el mismo término/);
  assert.match(p, /«Fuerza»: repetido/);
  assert.match(p, /«masa»: no aparece/);
  assert.match(p, /«F»: el término tiene que ser una palabra/);
  assert.match(p, /«peso»: definición de 25 palabras/);
});

test('índice del curso: una definición por término, dónde aparece y referencias rotas', () => {
  const us = [
    { id: 'c.a', nombre: 'A', def: { glosario: [{ termino: 'vector', def: 'Flecha con tamaño y dirección.', ver: ['escalar', 'módulo'] }, { termino: 'escalar', def: 'Número sin dirección.' }] }, texto: 'Un vector y un escalar.' },
    { id: 'c.b', nombre: 'B', def: { glosario: [{ termino: 'Vector', def: 'Otra.' }] }, texto: 'Dos vectores.' },
    { id: 'c.c', nombre: 'C', texto: 'Nada de eso.' },
  ];
  const { entradas, problemas } = G.indice(us);
  assert.equal(entradas.length, 2);
  assert.deepEqual(entradas[0].aparece, ['c.a', 'c.b']);
  assert.equal(entradas[0].en, 'c.a'); assert.equal(entradas[0].enNombre, 'A');
  assert.match(problemas.join('\n'), /c\.b: «Vector» ya se define en c\.a/);
  assert.match(problemas.join('\n'), /manda a ver «módulo»/);
});
