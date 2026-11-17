// Pruebas de la pieza «rm-familia»: las comunes de las piezas de la unidad (rm-pruebas.js), en las muestras de abajo y en
// todas las figuras de la teoría que la usan. Además: los papeles de color, y que cada línea vaya de un padre (arriba) a un
// hijo (abajo).
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('./rm-familia.js');
const R = require('./rm-pruebas.js');

const PER = [{ id: 'raul', nombre: 'Raúl', x: 5, g: 0, cara: 'abuelo' }, { id: 'pedro', nombre: 'Pedro', x: 2.4, g: 1, cara: 'hombre' }, { id: 'tomas', nombre: 'Tomás', x: 7.6, g: 1, cara: 'mujer' },
  { id: 'ana', nombre: 'Ana', x: 1.0, g: 2, cara: 'nina' }, { id: 'luis', nombre: 'Luis', x: 3.8, g: 2, cara: 'nino' }, { id: 'ivan', nombre: 'Iván', x: 7.6, g: 2, cara: 'nino' }];
const L = [['raul', 'pedro'], ['raul', 'tomas'], ['pedro', 'ana'], ['pedro', 'luis'], ['tomas', 'ivan']];
const MUESTRAS = [
  { escena: 'fotos', personas: PER, lineas: L },
  { escena: 'fotos', personas: PER, lineas: L, habla: 'ana', elegida: 'ivan', camino: { ids: ['ana', 'pedro', 'raul', 'tomas', 'ivan'] }, nota: 'Sube 2 y baja 2' },
  { escena: 'fotos', personas: PER, lineas: L, habla: 'ana', pedida: { id: 'ivan', desde: 2 }, camino: [{ ids: ['ana', 'pedro'], desde: 1 }], papeles: [{ id: 'pedro', t: 'mi papá', desde: 1 }], nota: [{ t: 'Uno', desde: 1 }] },
  { personas: [{ id: 'u0', nombre: 'Rosa', x: 1.6, g: 2 }, { id: 'u1', nombre: 'madre', x: 1.6, g: 1 }, { id: 'u2', nombre: '…', x: 5, g: 0 }, { id: 'd1', nombre: '?', x: 8.4, g: 1, incognita: true }],
    lineas: [['u1', 'u0'], ['u2', 'u1'], ['u2', 'd1']], habla: 'u0', camino: { ids: ['u0', 'u1', 'u2', 'd1'] } },
];
const TODAS = MUESTRAS.map((d, k) => ({ donde: `muestra ${k + 1}`, datos: d, estado: {} })).concat(R.deLaTeoria('rm-familia'));
R.comunes(P, TODAS, { minTeoria: 300 });

test('papeles: quien habla en naranja, la persona pedida en violeta (solo desde su corte), el camino en tinta gruesa', () => {
  assert.deepEqual(P.PAPELES, { habla: 'o', pedida: 'f', camino: 'tinta' });
  for (const { donde, datos } of TODAS) for (const c of [0, 9]) {
    const s = P.dibujar(datos, { corte: c });
    for (const [m] of s.matchAll(/<rect[^>]*data-papel="(\w+)"[^>]*>/g)) assert.match(m, /data-papel="habla"/.test(m) ? /stroke="var\(--c-o\)"/ : /stroke="var\(--c-f\)"/, donde);
    assert.equal((s.match(/stroke="var\(--c-o\)"/g) || []).length, datos.habla ? 1 : 0, donde);
    const ped = datos.pedida && (typeof datos.pedida === 'object' ? (c >= (datos.pedida.desde || 0) ? datos.pedida.id : null) : datos.pedida);
    assert.equal((s.match(/stroke="var\(--c-f\)"/g) || []).length, ped ? 1 : 0, `${donde} (corte ${c})`);
    for (const [m] of s.matchAll(/<path[^>]*data-camino="si"[^>]*>/g)) assert.match(m, /stroke="currentColor" stroke-width="4"/, donde);
  }
});

test('cada línea baja de un padre a un hijo de la generación siguiente', () => {
  for (const { donde, datos } of TODAS) {
    const g = Object.fromEntries(datos.personas.map(p => [p.id, p.g]));
    for (const [a, b] of datos.lineas) if (a in g && b in g) assert.equal(g[b], g[a] + 1, `${donde}: ${a} → ${b}`);
  }
});
