// Pruebas de la pieza «fis-vasos»: la superficie del líquido y los puntos caen a la altura de la escala, la prensa
// dibuja émbolos de ancho proporcional al área, nada de NaN ni colores fijos, alto fijo y pureza.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./fis-vasos.js');

const VASOS = { alto: 1, recipientes: [{ tipo: 'vaso', forma: 'embudo', nivel: 0.8 }, { tipo: 'vaso', forma: 'recto', nivel: 0.8 }, { tipo: 'vaso', forma: 'botella', nivel: 0.8 }],
  puntos: [{ k: 0, y: 0.2, rotulo: 'p', color: 'i' }, { k: 2, y: 0.2, color: 'i', desde: 1 }], cotas: [{ k: 0, y1: 0.2, y2: 0.8, texto: 'h', color: 'd' }] };
const OTROS = [
  { alto: 1, recipientes: [{ tipo: 'u', izq: [{ h: 0.3, tono: 3 }, { h: 0.5, tono: 1 }], der: [{ h: 0.6, tono: 3 }] }, { tipo: 'barometro', columna: 0.76, rotulo: 'Lima' }], puntos: [{ k: 0, y: 0.3, lado: 'izq', rotulo: 'A', color: 'i' }] },
  { alto: 1, recipientes: [{ tipo: 'vaso', forma: 'ancho', nivel: 0.7, bloque: { ancho: 0.3, alto: 0.4, base: 0.46, rotulo: 'madera', E: { largo: 40, texto: 'E' }, W: { largo: 40, texto: 'W' } } }] },
  { alto: 1, recipientes: [{ tipo: 'tubo', a1: 3, a2: 1, v1: { texto: '1 m/s', largo: 20 }, v2: { texto: '3 m/s', largo: 60 }, h1: 0.8, h2: 0.4 }] },
  {},
];

test('registrada en el kit', () => assert.equal(Kit.piezas['fis-vasos'], P));

test('fidelidad: la superficie del líquido y los puntos están a la altura de la escala', () => {
  const s = P.dibujar(VASOS, { corte: 1 });
  const yn = P.escala(VASOS, 0.8), yp = P.escala(VASOS, 0.2);
  const sup = [...s.matchAll(/<line x1="[\d.]+" y1="([\d.]+)" x2="[\d.]+" y2="\1" stroke="currentColor" stroke-width="2"[^>]*stroke-opacity="0.7"/g)].map(m => +m[1]);
  assert.equal(sup.length, 3);
  for (const y of sup) assert.ok(Math.abs(y - yn) < 0.6, 'la superficie de los tres vasos está al mismo nivel');
  const cys = [...s.matchAll(/<circle cx="[\d.]+" cy="([\d.]+)" r="5"/g)].map(m => +m[1]);
  assert.equal(cys.length, 2);
  for (const y of cys) assert.ok(Math.abs(y - yp) < 0.6);
});

test('prensa: el ancho de cada émbolo es proporcional a su área', () => {
  const s = P.dibujar({ alto: 1, recipientes: [{ tipo: 'prensa', a1: 1, a2: 4, nivel: 0.55, F1: { texto: '50 N', largo: 20 }, F2: { texto: '200 N', largo: 60 } }] });
  const w = [...s.matchAll(/<rect x="[\d.]+" y="[\d.]+" width="([\d.]+)" height="10"/g)].map(m => +m[1] + 4);
  assert.equal(w.length, 2);
  assert.ok(Math.abs(w[1] / w[0] - 4) < 0.05, `razón de anchos ${w[1] / w[0]}`);
});

test('sin NaN ni colores fijos, alto fijo, puros, y puntos que esperan su paso', () => {
  const altos = new Set();
  for (const d of [VASOS, ...OTROS]) for (const e of [{}, { corte: 0 }]) {
    const s = P.dibujar(d, e);
    assert.ok(!/NaN|undefined|Infinity/.test(s));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
    assert.equal(s, P.dibujar(d, e));
    altos.add(s.match(/height="([\d.]+)"/)[1]);
    assert.ok(P.alt(d).length > 15);
  }
  assert.equal(altos.size, 1);
  assert.equal((P.dibujar(VASOS, { corte: 0 }).match(/r="5"/g) || []).length, 1);
});
