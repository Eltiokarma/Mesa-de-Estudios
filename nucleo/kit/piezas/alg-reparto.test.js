// Pruebas de la pieza «alg-reparto» (el pasadizo de Rubén, el piso que se angosta y la hoja del cuaderno de la unidad
// «División de polinomios»): se dibuja sin NaN ni colores fijos, es pura, está marcada como dibujo de prueba y trae su
// texto alternativo; nunca usa carmín ni verde. Es fiel: el pasadizo usa del pedido justo lo que pide su rectángulo
// (c·p losetas, c·s + b·p tiras y b·s cuadraditos) y lo demás va aparte o falta; el rectángulo del piso mide (x − a) por
// q(x). Con números (docs/molde-unidad.md §6): todo cabe en el lienzo con 4 de margen y ningún texto pisa a otro. Se
// revisan las muestras de abajo y todas las figuras de la teoría que usan la pieza.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../kit.js');
const P = require('./alg-reparto.js');

const MUESTRAS = [{}, { objeto: 'pasadizo' }, { objeto: 'angosto' }, { objeto: 'cuaderno' }];
for (let k = 0; k <= 4; k++) MUESTRAS.push({ objeto: 'pasadizo', ancho: [1, 2], largo: [1, k], pedido: [1, 5, 7], tope: [1, 4] });
for (const c of [1, 2, 3, 6]) MUESTRAS.push({ objeto: 'pasadizo', ancho: [c, c], largo: [6 / c, 0], pedido: [6, 6, 1], tope: [6, 0], topeAncho: [6, 6] });
MUESTRAS.push({ objeto: 'pasadizo', ancho: [1, 2], largo: [2, 3], piezas: false, rotuloLargo: '?', sobran: false },
  { objeto: 'pasadizo', ancho: [3, 3], largo: [2, 1], piezas: false, rotuloLargo: '?', sobran: false });
for (let x = 2; x <= 6; x += 0.5) MUESTRAS.push({ objeto: 'angosto', x, a: 2, q: [1, 3], r: 7, xMax: 6 }, { objeto: 'angosto', x, a: 2, q: [1, 3], r: 7, xMax: 6, valores: false, resto: '?' });
const cel = (t, c) => ({ t, c });
MUESTRAS.push(
  { objeto: 'cuaderno', tipo: 'ruffini', coefs: ['1', '2', '−1', '3'], a: cel('2', 'i'), medio: ['2', '8', '14'], abajo: [cel('1', 'f'), cel('4', 'f'), cel('7', 'f'), cel('17', 'o')], flechas: true },
  { objeto: 'cuaderno', tipo: 'ruffini', coefs: ['1', '0', '0', '0', '0', '0', '−64'], a: cel('2', 'i'), medio: ['2', '4', '8', '16', '32', '64'], abajo: ['1', '2', '4', '8', '16', '32', cel('0', 'o')].map(x => (typeof x === 'string' ? cel(x, 'f') : x)) },
  { objeto: 'cuaderno', tipo: 'ruffini', coefs: ['2', '5', '−3'], a: cel('1', 'i'), medio: ['2', ''], abajo: [cel('2', 'f'), { hueco: true }, ''] },
  { objeto: 'cuaderno', tipo: 'larga', potencias: ['x³', 'x²', 'x', 'x⁰'], cabeza: [[['d = ', null], ['x² + x − 1', 'i', 700]]], filas: [{ rotulo: 'D', celdas: ['1', '4', '1', '−2'] }, { rotulo: 'd · q', celdas: ['1', '4', '2', '−3'] }, { rotulo: 'queda', raya: true, celdas: ['0', '0', cel('−1', 'o'), cel('1', 'o')] }] },
  { objeto: 'cuaderno', tipo: 'horner', coefs: ['6', '1', cel('0', 'f'), '4', '−1'], divisor: [cel('2', 'i'), cel('−1', 'i'), cel('1', 'i')], filas: [['', '−3', '3'], ['', '', '1', '−1'], ['', '', '', '2', '−2']], abajo: [cel('3', 'f'), cel('−1', 'f'), cel('2', 'f'), cel('1', 'o'), cel('1', 'o')], corte: 3 },
  { objeto: 'cuaderno', tipo: 'larga', filas: [], cabeza: [[['2x³ − 5x + 1 entre ', null], ['x − 2', 'i', 700]], [['resto = ?', null, 700]]] },
);
// Todas las figuras de la teoría que usan la pieza.
const def = require('../../../contenido/teoria/algebra/division-de-polinomios.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const Teoria = require('../../teoria.js');
const deTeoria = [];
for (const i of def.ideas) {
  const add = fg => { if (fg && (fg.pieza || i.pieza) === 'alg-reparto') deTeoria.push({ datos: fg.datos, estado: fg.estado || {} }); };
  i.lee.tarjetas.forEach(t => add(t.dibujo));
  if ((i.juega.pieza || i.pieza) === 'alg-reparto') for (const v of Teoria.grilla(i.juega.controles)) add(Object.assign({ pieza: i.juega.pieza || i.pieza }, i.juega.dibujo(v)));
  add(i.predice.dibujo); add(i.predice.revelar); add(i.regla.dibujo);
  if (i.mira.pieza === 'alg-reparto') i.mira.pasos.forEach(p => deTeoria.push({ datos: i.mira.datos, estado: p.estado }));
  i.ejemplos.forEach(e => add(e.figura));
  for (let s = 0; s < 20; s++) { const r = i.resuelve.generar(s); add(r.dibujo); r.pasos.forEach(p => add(p.dibujo)); add(i.ahoraTu.generar(s).dibujo); }
}
const TODAS = [...MUESTRAS.map(datos => ({ datos, estado: {} })), ...deTeoria];

test('se dibuja puro, sin NaN, marcado como prueba, con texto alternativo y sin carmín ni verde', () => {
  for (const { datos, estado } of TODAS) {
    const a = P.dibujar(datos, estado), b = P.dibujar(datos, estado);
    assert.equal(a, b, 'pura');
    assert.ok(!/NaN|undefined|Infinity/.test(a), JSON.stringify(datos).slice(0, 120));
    assert.ok(/data-prueba="si"/.test(a));
    assert.ok(/aria-label="[^"]{20,}"/.test(a));
    assert.ok(!/var\(--c-[hd]\)/.test(a));
    assert.ok(!/#[0-9a-f]{3,6}/i.test(a), 'sin colores fijos');
  }
  assert.ok(TODAS.length > 100, `figuras: ${TODAS.length}`);
});

test('todo cabe en el lienzo con su margen y ningún texto pisa a otro', () => {
  for (const { datos, estado } of TODAS) {
    assert.ok(P.cabe(datos, estado), `no cabe: ${JSON.stringify(datos).slice(0, 140)}`);
    const g = P.geometria(datos, estado), t = g.textos;
    for (let i = 0; i < t.length; i++) for (let j = i + 1; j < t.length; j++) {
      const A = t[i], B = t[j], pisa = A.x0 < B.x1 - 0.5 && B.x0 < A.x1 - 0.5 && A.y0 < B.y1 - 0.5 && B.y0 < A.y1 - 0.5;
      assert.ok(!pisa, `«${A.txt}» pisa a «${B.txt}» en ${JSON.stringify(datos).slice(0, 100)}`);
    }
  }
});

test('el pasadizo es fiel: usa del pedido lo que pide su rectángulo; lo demás queda aparte o falta', () => {
  for (let k = 0; k <= 4; k++) {
    const d = { objeto: 'pasadizo', ancho: [1, 2], largo: [1, k], pedido: [1, 5, 7], tope: [1, 4] }, g = P.geometria(d);
    const pide = [1, k + 2, 2 * k];
    assert.deepEqual(g.pide, pide);
    const dentro = q => g.formas.filter(f => !f.sobra && f.que === q);
    assert.equal(dentro('loseta').length, 1); assert.equal(dentro('tira').length, k + 2); assert.equal(dentro('cuadradito').length, 2 * k);
    const faltan = g.formas.filter(f => f.falta).length, aparte = g.formas.filter(f => f.sobra).length;
    assert.equal(faltan, Math.max(0, k + 2 - 5) + Math.max(0, 2 * k - 7));
    if (!faltan) assert.equal(aparte, (5 - k - 2) + (7 - 2 * k));
  }
  // El ancho 3x + 3 por un largo 2x pide 6 losetas y 6 tiras.
  assert.deepEqual(P.necesita([3, 3], [2, 0]), [6, 6, 0]);
});

test('el piso que se angosta mide (x − a) por q(x) y con x = a no tiene ancho', () => {
  const g = P.geometria({ objeto: 'angosto', x: 5, a: 2, q: [1, 3], r: 7, xMax: 6 });
  assert.ok(Math.abs(g.w / g.u - 8) < 1e-9 && Math.abs(g.h / g.u - 3) < 1e-9);
  assert.equal(g.formas.length, 7);
  assert.equal(P.geometria({ objeto: 'angosto', x: 2, a: 2, q: [1, 3], r: 7, xMax: 6 }).h, 0);
  // El alto del lienzo no cambia al mover x (el juego no salta).
  const altos = new Set(); for (let x = 2; x <= 6; x += 0.5) altos.add(P.geometria({ objeto: 'angosto', x, a: 2, q: [1, 3], r: 7, xMax: 6 }).H);
  assert.equal(altos.size, 1);
});

// Auditoría del 19 nov (rutinas/auditoria/algebra.division-de-polinomios.md, M14): la casilla «?» medía como el texto
// «undefined» y su columna salía el doble de ancha; las columnas de arriba quedaban corridas y las últimas, pegadas.
test('la tabla de Ruffini con una casilla «?»: todas las columnas de números miden lo mismo', () => {
  const d = { objeto: 'cuaderno', tipo: 'ruffini', coefs: ['−3', '−1', '−3', '−5'], a: cel('−2', 'i'), medio: ['', '', ''], abajo: [cel('−3', 'f'), { hueco: true }, '', ''], flechas: true };
  const g = P.geometria(d), ws = g.xs.slice(2).map((x, k) => x - g.xs[k + 1]);
  assert.ok(Math.max(...ws) - Math.min(...ws) < 0.5, `anchos de columna: ${ws.map(w => w.toFixed(1)).join(', ')}`);
});
