// Pruebas de la pieza «rm-casos»: las comunes de las piezas de la unidad (rm-pruebas.js), en las muestras de abajo y en
// todas las figuras de la teoría que la usan. Además: los papeles de color y que tachar no dependa solo del color.
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('./rm-casos.js');
const R = require('./rm-pruebas.js');

const V = [{ t: 'Llueve', papel: 'primero', si: 'llueve', no: 'no llueve' }, { t: 'Pista', papel: 'segundo', si: 'mojada', no: 'seca' }];
const C4 = [[true, true], [true, false], [false, true], [false, false]];
const MUESTRAS = [
  { escena: 'calle', calle: { lluvia: true, pista: null }, regla: 'Regla: si llueve, la pista se moja.', tablas: [{ vars: V, filas: C4.map((v, k) => ({ v, fuera: k === 1 ? 'regla' : k > 1 ? 'dato' : false, seguro: k === 0 })) }] },
  { escena: 'calle', calle: { lluvia: false, pista: true }, tablas: [{ vars: V, filas: C4.map(v => ({ v, fuera: false })) }], nota: 'Quedan 2' },
  { tablas: [{ titulo: 'Dato: seca', vars: V, filas: C4.map((v, k) => ({ v, fuera: k === 3 ? false : k === 1 ? 'regla' : 'dato', desde: 1, seguro: k === 3 ? 2 : false })) }, { titulo: 'Dato: mojada', vars: V, filas: C4.map(v => ({ v, fuera: false })) }] },
  { tablas: [{ vars: V.concat([{ t: 'r', papel: 'tercero', si: 'sí', no: 'no' }]), filas: [0, 1, 2, 3, 4, 5, 6, 7].map(i => ({ v: [!(i & 4), !(i & 2), !(i & 1)], fuera: i % 3 ? 'regla' : false })) }] },
];
const TODAS = MUESTRAS.map((d, k) => ({ donde: `muestra ${k + 1}`, datos: d, estado: {} })).concat(R.deLaTeoria('rm-casos'));
R.comunes(P, TODAS, { minTeoria: 300 });

test('papeles: lo primero naranja, lo segundo turquesa, lo que queda solo violeta; lo tachado gris, con raya y su motivo', () => {
  assert.deepEqual(P.PAPELES, { primero: 'o', segundo: 'i', tercero: 'tinta', seguro: 'f', descartado: 'tenue' });
  for (const { donde, datos } of TODAS) for (const c of [0, 9]) {
    const s = P.dibujar(datos, { corte: c });
    for (const [m] of s.matchAll(/<g data-fila="fuera"[^>]*>.*?<\/g>/g)) { assert.match(m, /^<g data-fila="fuera" opacity="0.55">/, donde); assert.match(m, /data-raya="si"/, donde); }
    const violetas = (s.match(/var\(--c-f\)/g) || []).length, marcas = (s.match(/data-marca="(si|fila-segura)"/g) || []).length;
    assert.equal(violetas, marcas, `${donde}: violeta fuera de lo seguro`);
    // A lo más un caso seguro por tabla, y nunca uno tachado.
    for (const t of datos.tablas || []) assert.ok(t.filas.filter(f => f.seguro === true || (typeof f.seguro === 'number' && c >= f.seguro)).length <= 1, donde);
  }
});
