// Pruebas de la pieza «arit-venn»: aros del mismo radio (no codifican cantidad), cada rótulo cae en su zona,
// punteo solo en las zonas pedidas, nada de NaN ni colores fijos, texto de 14 o más y alto fijo.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./arit-venn.js');

const DOS = { conjuntos: [{ nombre: 'A', color: 'o' }, { nombre: 'B', color: 'i' }], regiones: { A: '1, 2', AB: '3', B: { t: '4', paso: 1 }, '': '5' } };
const TRES = { conjuntos: [{ nombre: 'A', color: 'o' }, { nombre: 'B', color: 'i' }, { nombre: 'C', color: 'h' }], regiones: { A: 'a', B: 'b', C: 'c', AB: 'ab', AC: 'ac', BC: 'bc', ABC: 'abc' } };

test('se registra en el kit', () => assert.equal(Kit.piezas['arit-venn'], P));

test('los aros tienen el mismo radio y cada rótulo cae en su zona', () => {
  for (const d of [DOS, TRES]) {
    const s = P.dibujar(d, { paso: 1 });
    const radios = new Set([...s.matchAll(/<circle cx="[\d.]+" cy="[\d.]+" r="(\d+)" fill="none" stroke="var/g)].map(m => m[1]));
    assert.equal(radios.size, 1);
    const geo = P.geometria(d);
    for (const z of Object.keys(d.regiones)) if (z) assert.equal(geo.zona(...geo.centro[z]), z, `zona ${z}`);
  }
});

test('puntea solo las zonas pedidas', () => {
  const geo = P.geometria(DOS);
  const s = P.dibujar(DOS, { resalta: ['AB'] });
  const pts = [...s.matchAll(/<circle cx="(\d+)" cy="(\d+)" r="2" fill="var\(--c-d\)"/g)].map(m => [+m[1], +m[2]]);
  assert.ok(pts.length > 10);
  for (const p of pts) assert.equal(geo.zona(...p), 'AB');
});

test('sin NaN ni colores fijos; texto de 14 o más; alto fijo; puro', () => {
  const altos = new Set();
  for (const d of [DOS, TRES]) for (const e of [{}, { paso: 1 }, { resalta: ['A', ''] }, { fantasma: { resalta: ['A', 'B', 'AB'], rotulo: 'A ∪ B' } }]) {
    const s = P.dibujar(d, e);
    assert.equal(s, P.dibujar(d, e));
    assert.ok(!/NaN|undefined|null|Infinity/.test(s));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
    assert.ok(!/\sid=/i.test(s));
    for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14);
    altos.add(s.match(/viewBox="0 0 320 ([\d.]+)"/)[1]);
  }
  assert.equal(altos.size, 1);
});

test('alt cuenta las zonas', () => assert.match(P.alt(DOS), /zona A∩B: 3/));
