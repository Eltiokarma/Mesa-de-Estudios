// Pruebas de la pieza «rm-fichas»: tantas fichas como se piden, el dado y el dominó llevan sus puntos, el corte muestra
// solo lo hecho, el fantasma va discontinuo, alto fijo, sin NaN ni colores fijos y texto de 14 o más.
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('./rm-fichas.js');

const d = {
  filas: [
    { rotulo: 'Urna', caja: true, fichas: [{ color: 'o', t: 'R' }, { color: 'i', t: 'A' }, { color: 'd', t: 'V', desde: 1 }] },
    { rotulo: 'Dominó y dado', fichas: [{ forma: 'domino', valor: [2, 5] }, { forma: 'dado', valor: 6 }, { forma: 'cerilla', color: 'h' }] },
  ],
  pie: 'Tres colores',
};

test('cuenta fichas y puntos', () => {
  const s = P.dibujar(d, { corte: 1 });
  assert.equal((s.match(/r="12"/g) || []).length, 3);           // tres fichas redondas de 26
  assert.equal((s.match(/r="2.21"/g) || []).length, 2 + 5 + 6);  // puntos del 2–5 y del 6
  assert.ok(!P.dibujar(d, { corte: 0 }).includes('>V<'));
});

test('fantasma, alto fijo y limpio', () => {
  const altos = new Set();
  for (const e of [{ corte: 0 }, { corte: 1 }, { corte: 1, fantasma: { fila: 0, fichas: [{ color: 'o', t: 'R' }], rotulo: 'Una más' } }]) {
    const s = P.dibujar(d, e);
    assert.ok(!/NaN|undefined|null|Infinity/.test(s));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
    for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14);
    altos.add(s.match(/viewBox="0 0 320 ([\d.]+)"/)[1]);
  }
  assert.equal(altos.size, 1);
  assert.match(P.dibujar(d, { corte: 1, fantasma: { fila: 0, fichas: [{ color: 'o', t: 'R' }], rotulo: 'Una más' } }), /kit-fantasma/);
  assert.match(P.alt(d), /dominó 2-5/);
});
