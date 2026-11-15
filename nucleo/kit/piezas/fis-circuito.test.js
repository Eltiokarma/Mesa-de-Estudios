// Pruebas de la pieza «fis-circuito»: dibuja cada elemento y cada lectura pegada, el halo del foco crece con el
// brillo, el corte esconde lecturas, nada de NaN ni colores fijos, texto de 14 o más, alto fijo y pieza pura.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./fis-circuito.js');

const SERIE = { fuente: { rotulo: 'ε = 12 V', color: 'o' }, serie: [{ tipo: 'A', lectura: '2 A' }, { tipo: 'foco', rotulo: 'R = 6 Ω', brillo: 0.5, color: 'h', lectura: '24 W', desde: 1 }, { tipo: 'A', lectura: '2 A' }] };
const PAR = { fuente: { rotulo: 'ε = 12 V', r: 'r = 1 Ω', voltimetro: '10 V', color: 'o' }, serie: [{ tipo: 'R', rotulo: 'R₁', color: 'i' }],
  ramas: [{ tipo: 'R', rotulo: 'R₂', lectura: '4 A', corriente: { texto: '4 A', color: 'h' } }, { tipo: 'foco', brillo: 1 }, { tipo: 'C', rotulo: 'C', voltimetro: '6 V' }] };

test('se registra en el kit', () => assert.equal(Kit.piezas['fis-circuito'], P));

test('cada lectura está en el dibujo y el corte las esconde', () => {
  const s = P.dibujar(SERIE, {});
  assert.equal((s.match(/>A</g) || []).length, 2, 'dos amperímetros');
  assert.match(s, />24 W</);
  assert.doesNotMatch(P.dibujar(SERIE, { corte: 0 }), />24 W</);
  const q = P.dibujar(PAR, {});
  assert.match(q, />10 V</); assert.match(q, />6 V</); assert.match(q, />4 A</);
  assert.match(q, /stroke-dasharray="3 4"/, 'la pila real lleva su caja');
});

test('el halo del foco crece con el brillo y no existe apagado', () => {
  const r = b => { const m = P.dibujar({ serie: [{ tipo: 'foco', brillo: b }] }).match(/kit-halo" cx="[\d.]+" cy="[\d.]+" r="([\d.]+)"/); return m ? +m[1] : 0; };
  assert.equal(r(0), 0);
  assert.ok(r(1) > r(0.25) && r(0.25) > 0);
});

test('sin NaN ni colores fijos; texto de 14 o más; dos altos (malla simple o con ramas), fijos entre estados; pura', () => {
  const altos = new Set();
  for (const d of [SERIE, PAR, { fuente: {} }, { serie: [], ramas: [], abierto: true }]) {
    const s = P.dibujar(d, {});
    assert.equal(s, P.dibujar(d, {}));
    assert.ok(!/NaN|undefined|null|Infinity/.test(s));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
    for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14);
    altos.add(s.match(/viewBox="0 0 320 ([\d.]+)"/)[1]);
  }
  assert.deepEqual([...altos].sort(), ['200', '262']);
  for (const d of [SERIE, PAR]) assert.equal(P.dibujar(d, { corte: 0 }).match(/viewBox="0 0 320 ([\d.]+)"/)[1], P.dibujar(d, {}).match(/viewBox="0 0 320 ([\d.]+)"/)[1]);
  assert.match(P.alt(PAR), /en paralelo/);
});

test('geometria: cada elemento donde se dibuja; el cursor del reóstato y su inversa', () => {
  const g = P.geometria(PAR);
  assert.equal(g.serie.length, 1); assert.equal(g.ramas.length, 3);
  assert.match(P.dibujar(PAR), new RegExp(`cx="${g.ramas[2].x}"`), 'el nudo de la rama está en su x');
  assert.equal(g.serie[0].cursor, undefined, 'una R común no trae cursor');
  const RS = { fuente: { rotulo: '12 V' }, serie: [{ tipo: 'A' }, { tipo: 'R', rotulo: 'R', color: 'i', reostato: 0.25 }],
    ramas: [] };
  const RR = { fuente: { rotulo: '12 V' }, ramas: [{ tipo: 'R', reostato: 0.5 }, { tipo: 'R', reostato: 0.75 }] };
  for (const d of [RS, RR]) {
    const ge = P.geometria(d), el = d.serie ? ge.serie[1] : ge.ramas[1], k = d.serie ? 0.25 : 0.75;
    const c = el.cursor(k);
    assert.ok(Math.abs(el.k(c) - k) < 1e-9, 'k(cursor(k)) = k');
    assert.ok(c.x >= 0 && c.x <= 320 && c.y >= 0 && c.y <= ge.alto);
    const s = P.dibujar(d);
    assert.match(s, /stroke-opacity="0.35"/, 'el tramo después del cursor va tenue');
    assert.ok(!/NaN|undefined/.test(s));
  }
  // Sin reóstato, el dibujo no cambia (el dato es opcional).
  assert.equal(P.dibujar(SERIE), P.dibujar(JSON.parse(JSON.stringify(SERIE))));
});

// Ronda 5 (animación): `flujo` es opcional; sin él la figura no cambia, con él hay puntos de carga que avanzan.
test('flujo: puntos de carga cada 20 px que avanzan con la fase; sin flujo, el dibujo de siempre', () => {
  const n = s => (s.match(/kit-carga/g) || []).length;
  assert.equal(n(P.dibujar(SERIE, {})), 0);
  const con = f => P.dibujar(Object.assign({}, SERIE, { flujo: { fase: f, color: 'h' } }), {});
  assert.ok(n(con(0)) > 20, 'el lazo de la malla simple lleva más de 20 puntos');
  assert.notEqual(con(0), con(7), 'otra fase, otros lugares');
  assert.equal(con(3), con(23), 'la fase se repite cada 20 px');
  assert.equal(P.dibujar(Object.assign({}, SERIE, { flujo: { fase: 5 }, abierto: true }), {}), P.dibujar(Object.assign({}, SERIE, { abierto: true }), {}), 'abierto: no circula');
  const r = P.dibujar(Object.assign({}, PAR, { flujo: { fase: 0, ramas: [0, 4], color: 'h' } }), {});
  assert.ok(n(r) > n(P.dibujar(Object.assign({}, PAR, { flujo: { fase: 0, color: 'h' } }), {})), 'las ramas con fase llevan sus puntos');
  assert.ok(!/NaN|undefined/.test(r));
});
