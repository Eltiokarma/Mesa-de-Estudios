// Pruebas de la pieza «geo-figura»: se registra, es pura, no muestra NaN, usa solo colores de variable,
// el alto es fijo para un marco dado, la escala es una sola, los ángulos se dibujan con su valor
// y en un cubo las aristas de atrás van discontinuas.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const G = require('./geo-figura.js');
const LT = require('../linea-tiempo.js');

const TRI = {
  alt: 'Triángulo ABC con su altura desde C',
  vista: { x: [0, 8], y: [0, 5] },
  puntos: [{ id: 'A', x: 0, y: 0, rotulo: 'A' }, { id: 'B', x: 8, y: 0, rotulo: 'B' }, { id: 'C', x: 3, y: 4, rotulo: 'C' }, { id: 'H', x: 3, y: 0, rotulo: 'H', desde: 1 }],
  regiones: [{ puntos: ['A', 'B', 'C'], color: 'i' }],
  segmentos: [{ de: 'A', a: 'B', texto: '8' }, { de: 'B', a: 'C' }, { de: 'C', a: 'A', marcas: 2 }, { de: 'C', a: 'H', color: 'h', grosor: 'variable', desde: 1, texto: 'h = 4' }],
  angulos: [{ en: 'H', de: 'B', a: 'C', color: 'h', desde: 1 }, { en: 'A', de: 'B', a: 'C', texto: '53°', color: 'o' }],
  circulos: [{ centro: 'C', r: 1, color: 'd', desde: 2 }],
  arcos: [{ centro: 'A', r: 2, de: 0, a: 53.13, color: 'o', texto: 'arco', desde: 2 }],
  rotulos: [{ x: 4, y: 1.5, texto: 'S', color: 'i' }],
};
const v = Math.SQRT1_2;
const CUBO = {
  tresD: { giro: 30, alza: 20 }, vista: { x: [-1.6, 1.6], y: [-1.5, 1.5] },
  puntos: [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]].map(([x, y, z], k) => ({ id: 'P' + k, x, y, z })),
  // antihorario visto desde fuera
  solidos: [{ color: 'i', caras: [['P4', 'P5', 'P6', 'P7'], ['P1', 'P0', 'P3', 'P2'], ['P5', 'P1', 'P2', 'P6'], ['P0', 'P4', 'P7', 'P3'], ['P7', 'P6', 'P2', 'P3'], ['P0', 'P1', 'P5', 'P4']] }],
  curvas: [{ puntos: Array.from({ length: 25 }, (_, k) => [Math.cos(k * Math.PI / 12), -1, Math.sin(k * Math.PI / 12)]), atras: true, color: 'o' }],
};
void v;

test('se registra en el catálogo del kit', () => assert.equal(Kit.piezas['geo-figura'], G));

test('pura, sin NaN, solo colores de variable o tinta, texto de 14 o más', () => {
  for (const d of [TRI, CUBO]) for (const c of [0, 1, 2]) {
    const s = G.dibujar(d, { corte: c });
    assert.equal(s, G.dibujar(d, { corte: c }));
    assert.ok(!/NaN|undefined|Infinity/.test(s));
    for (const m of s.matchAll(/(?:fill|stroke)="([^"]+)"/g)) assert.match(m[1], /^(none|currentColor|var\(--c-[oihdf]\))$/);
    for (const m of s.matchAll(/font-size="(\d+)"/g)) assert.ok(+m[1] >= 14);
  }
});

test('lo de desde = corte aparece en su paso y queda como rastro', () => {
  assert.ok(!/h = 4/.test(G.dibujar(TRI, {})));
  assert.match(G.dibujar(TRI, LT.estado([{ estado: { corte: 1 } }], 1)), /kit-nuevo[^]*h = 4/);
  assert.match(G.dibujar(TRI, { corte: 2 }), />h = 4</);
});

test('alto fijo para un marco dado y una sola escala', () => {
  const a = G.dibujar(TRI, {}).match(/height="([\d.]+)"/)[1];
  const otro = Object.assign({}, TRI, { puntos: TRI.puntos.map(p => p.id === 'C' ? Object.assign({}, p, { x: 6 }) : p) });
  assert.equal(G.dibujar(otro, {}).match(/height="([\d.]+)"/)[1], a);
  const g = G.geometria(TRI), A = g.S('A'), B = g.S('B'), C = g.S('C');
  assert.ok(Math.abs((B[0] - A[0]) / 8 - (A[1] - C[1]) / 4) < 1e-9);
});

test('el ángulo de 53° se dibuja con su valor y el de 90° con cuadradito', () => {
  const g = G.geometria(TRI), A = g.S('A'), C = g.S('C');
  assert.ok(Math.abs(Math.atan2(A[1] - C[1], C[0] - A[0]) * 180 / Math.PI - 53.13) < 0.01);
  assert.match(G.dibujar(TRI, { corte: 1 }), /<path d="M[\d. ]+L[\d. ]+L[\d. ]+" fill="none" stroke="var\(--c-h\)"/);
});

test('cubo: tres caras de frente y tres aristas ocultas discontinuas; la base circular tiene tramo de atrás', () => {
  const s = G.dibujar(CUBO, {});
  assert.equal((s.match(/fill-opacity="0.1"/g) || []).length, 3);
  assert.equal((s.match(/stroke-dasharray="5 5"/g) || []).length >= 4, true);
  assert.equal(G.util.angulo([0, 0], [1, 0], [0, 1]), 90);
  assert.ok(Math.abs(G.util.area([[0, 0], [2, 0], [0, 2]]) - 2) < 1e-12);
  assert.ok(G.alt(CUBO).length > 15 && G.alt(TRI) === TRI.alt);
});
