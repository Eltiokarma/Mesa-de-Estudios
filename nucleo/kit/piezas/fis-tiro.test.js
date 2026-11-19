// Pruebas de la pieza «fis-tiro» (19 nov, Movimiento parabólico, idea A1): cada figura dibuja lo que dicen sus números,
// con números (no a ojo): todo cabe con 4 de margen, ningún rótulo pisa a otro ni a un objeto, la piedra está donde
// dicen x = v₀·t y h = ½·g·t² con la misma escala en los dos ejes, es pura, de prueba, sin verde ni colores fijos y con
// texto alternativo. La unidad corre además estas pruebas sobre todas sus figuras
// (contenido/teoria/fisica/movimiento-parabolico-y-circular.test.js).
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./fis-tiro.js');
const W = 320;
const pisa = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
const PENA = { plataforma: 'pena', alto: 20, ancho: 42 };
const RX = { paso: 5, numero: 10 }, RH = { paso: 5, numero: 5, tiempos: true };
const juego = (v0, t) => Object.assign({}, PENA, { v0, t, cada: 0.5, sombras: true, camino: 'recorrido', flecha: { texto: `${v0} m/s` }, regla: RX, alturas: RH, blanco: { en: 30, tipo: 'balsa' } });

const CASOS = [
  ['juego al abrir', juego(8, 0)],
  ['juego a medio vuelo', juego(15, 1.3)],
  ['juego en el agua, lo más lejos', juego(20, 2.6)],
  ['juego en el agua, lo más cerca', juego(5, 2.6)],
  ['predice: la lanzada y la que se suelta', Object.assign({}, PENA, { v0: 15, t: 0, flecha: { texto: '15 m/s' }, otra: { texto: 'se suelta' }, alturas: { paso: 5, numero: 5 } })],
  ['mira con niveles a 1 s', Object.assign({}, PENA, { v0: 15, t: 1, cada: 0.5, sombras: true, niveles: true, camino: 'recorrido', flecha: { texto: '15 m/s' }, otra: {}, alturas: RH })],
  ['mira con las dos reglas a 2 s', Object.assign({}, PENA, { v0: 15, t: 2, cada: 0.5, sombras: true, niveles: true, camino: 'recorrido', flecha: { texto: '15 m/s' }, otra: {}, alturas: RH, regla: RX })],
  ['lee: las dos reglas con sus guías', Object.assign({}, PENA, { v0: 12, t: 1.5, camino: 'recorrido', guias: true, regla: RX, alturas: { paso: 5, numero: 5 } })],
  ['lee: el camino entero', Object.assign({}, PENA, { v0: 12, t: 0, flecha: { texto: 'v₀' }, camino: 'entero' })],
  ['mesa con canica y cotas', { plataforma: 'mesa', objeto: 'canica', alto: 0.8, ancho: 1.2, v0: 2, t: 0, flecha: { texto: '2 m/s' }, cotaAlto: { texto: '80 cm' }, cotaAlcance: { texto: '?', hasta: 0.8 } }],
  ['azotea con la pared de enfrente', { plataforma: 'azotea', objeto: 'pelota', alto: 45, ancho: 48, v0: 20, t: 0, flecha: { texto: '20 m/s' }, cotaAlto: { texto: '45 m' }, cotaAlcance: { texto: '40 m', hasta: 40 }, pared: { en: 40, alto: 45 } }],
  ['avioneta con el paquete y la marca', { plataforma: 'avioneta', objeto: 'paquete', alto: 125, ancho: 235, v0: 40, t: 0, flecha: { texto: '144 km/h' }, cotaAlto: { texto: '125 m' }, blanco: { en: 200, tipo: 'marca' }, cotaAlcance: { texto: '?', hasta: 200 } }],
  ['el chorro del caño', { plataforma: 'muro', objeto: 'agua', alto: 1.25, ancho: 2.4, v0: 4, t: 0, flecha: { texto: '?' }, cotaAlto: { texto: '1,25 m' }, cotaAlcance: { texto: '2 m', hasta: 2 } }],
  ['peña alta con la altura por hallar', { plataforma: 'pena', alto: 45, ancho: 38, v0: 10, t: 0, flecha: { texto: '10 m/s' }, cotaAlto: { texto: '?' }, cotaAlcance: { texto: '30 m', hasta: 30 } }],
  ['torre con dos rapideces', { plataforma: 'azotea', objeto: 'piedra', alto: 80, ancho: 112, v0: 25, t: 0, flecha: { texto: '10 m/s o 25 m/s' }, cotaAlto: { texto: '80 m' } }],
  // Fase 3 (19 nov): las flechas de la velocidad (A2), con ángulo desde el piso (A3, A4), la manguera y el dron (A5).
  ['flechas a 1 s y a 2 s, con g', Object.assign({}, PENA, { alto: 45, ancho: 50, v0: 15, t: 2, cada: 1, camino: 'recorrido', alturas: RH, flechas: { en: [1, 2], kv: 2, textos: { vx: '15 m/s', vy: '20 m/s', v: '25 m/s' } }, gravedad: { en: [1, 2], texto: 'g' } })],
  ['patada con ángulo, reloj y reglas', { plataforma: 'piso', objeto: 'pelota', ancho: 64, techo: 24, vx: 15, vy: 20, t: 1.5, cada: 1, camino: 'recorrido', flecha: { texto: '25 m/s' }, angulo: { texto: '53°' }, regla: RX, alturas: { modo: 'sube', paso: 5, numero: 10 }, reloj: { texto: 't = 1,5 s' } }],
  ['componentes al salir, a ras del piso', { plataforma: 'piso', objeto: 'pelota', ancho: 64, techo: 24, vx: 15, vy: 20, t: 0, alturas: { modo: 'sube', paso: 5, numero: 10 }, flechas: { en: [0], kv: 2, textos: { vx: '15 m/s', vy: '20 m/s', v: '25 m/s' } } }],
  ['patada con el arco y el camino entero', { plataforma: 'piso', objeto: 'pelota', ancho: 24, vx: 9, vy: 12, t: 0, flecha: { texto: '15 m/s' }, angulo: { texto: '53°' }, blanco: { en: 19.8, tipo: 'arco', alto: 2.44 }, cotaAlcance: { texto: '19,8 m', hasta: 19.8 }, camino: 'entero', otros: [{ vx: 12, vy: 9, texto: '?' }] }],
  ['manguera, planta, altura y alcance', { plataforma: 'manguera', objeto: 'agua', ancho: 10.6, techo: 4.8, vx: 5, vy: 8.66, t: 0, flecha: { texto: '10 m/s' }, angulo: { texto: '60°' }, blanco: { en: 8.66, tipo: 'planta' }, cotaH: { texto: 'H' }, cotaAlcance: { texto: 'R', hasta: 8.66 } }],
  ['desde la azotea, con ángulo', { plataforma: 'azotea', objeto: 'pelota', alto: 20, ancho: 92, vx: 20, vy: 15, t: 0, flecha: { texto: '25 m/s' }, angulo: { texto: '37°' }, cotaAlto: { texto: '20 m' }, cotaAlcance: { texto: '?', hasta: 80 } }],
  ['el dron sobre las calles', { vista: 'plano', max: 80, paso: 10, numero: 20, vx: 8, vy: 8, t: 10, cada: 1, camino: true, guias: true, antena: { x: 30, y: 40, texto: 'antena' }, reloj: { texto: 't = 10 s' } }],
  ['el dron y la distancia por hallar', { vista: 'plano', max: 80, paso: 10, numero: 20, vx: 6, vy: 8, t: 5, camino: true, linea: { texto: '?' } }],
];

test('registrada en el kit', () => assert.equal(Kit.piezas['fis-tiro'], P));

// Lo que comprueba cada figura (lo usa también la unidad): cabe, no se pisa, es pura y de prueba.
function revisar(d, e = {}, nombre = '') {
  const s = P.dibujar(d, e), g = P.geometria(d, e);
  assert.equal(s, P.dibujar(d, e), `${nombre}: no es pura`);
  assert.ok(!/NaN|undefined|Infinity/.test(s), `${nombre}: NaN o undefined`);
  assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), `${nombre}: solo currentColor y var(--c-*)`);
  assert.ok(!/var\(--c-d\)/.test(s), `${nombre}: sin verde`);
  assert.match(s, /data-prueba="si"/);
  assert.match(s, new RegExp(`viewBox="0 0 ${W} ${g.H}"`));
  assert.ok(P.alt(d, e).length > 20 && !/undefined|NaN/.test(P.alt(d, e)), `${nombre}: texto alternativo`);
  for (const r of g.rotulos) assert.ok(r.x0 >= 4 - 1e-9 && r.x1 <= W - 4 + 1e-9 && r.y0 >= 4 && r.y1 <= g.H - 4, `${nombre}: «${r.texto}» se sale`);
  for (let a = 0; a < g.rotulos.length; a++) for (let b = a + 1; b < g.rotulos.length; b++) assert.ok(!pisa(g.rotulos[a], g.rotulos[b]), `${nombre}: «${g.rotulos[a].texto}» pisa «${g.rotulos[b].texto}»`);
  for (const o of g.objetos) assert.ok(o.x0 >= 4 && o.x1 <= W - 4 + 1e-9 && o.y0 >= 2 && o.y1 <= g.H - 2, `${nombre}: ${o.nombre} se sale (${JSON.stringify(o)})`);
  // Un rótulo con texto propio (la flecha, las cotas, «se suelta») no cae encima del objeto que vuela ni de la balsa.
  for (const r of g.rotulos.filter(x => ['flecha', 'cota', 'otra', 'blanco'].includes(x.tipo))) for (const o of g.objetos.filter(x => !['pena', 'mesa', 'azotea', 'muro'].includes(x.nombre))) {
    assert.ok(!pisa(r, o), `${nombre}: «${r.texto}» pisa ${o.nombre}`);
  }
  for (const p of g.puntos) assert.ok(p.x >= 4 && p.x <= W - 4 && p.y >= 4 && p.y <= g.H - 4, `${nombre}: una marca se sale`);
  return g;
}
module.exports = { revisar };

for (const [nombre, d, e] of CASOS) test(`${nombre}: cabe, no se pisa, es pura y de prueba`, () => { revisar(d, e || {}, nombre); });

test('la piedra está donde dicen x = v₀·t y h = ½·g·t², con la misma escala de lado y hacia abajo', () => {
  const g0 = P.geometria(juego(15, 0)), g1 = P.geometria(juego(15, 1)), g2 = P.geometria(juego(15, 2));
  const piedra = g => g.objetos.find(o => o.nombre === 'piedra'), c = o => [(o.x0 + o.x1) / 2, (o.y0 + o.y1) / 2];
  const [x0, y0] = c(piedra(g0)), [x1, y1] = c(piedra(g1)), [x2, y2] = c(piedra(g2));
  const k = g0.k;
  assert.ok(Math.abs((x1 - x0) - 15 * k) < 1e-9 && Math.abs((x2 - x0) - 30 * k) < 1e-9, 'de lado: 15 m cada segundo');
  assert.ok(Math.abs((y1 - y0) - 5 * k) < 1e-9 && Math.abs((y2 - y0) - 20 * k) < 1e-9, 'hacia abajo: 5 m y 20 m');
  assert.ok(Math.abs(g0.X(10) - g0.X(0) - (g0.Y(10) - g0.Y(0))) < 1e-9, 'un metro mide lo mismo en las dos reglas');
  // Al llegar al agua se queda ahí, aunque el reloj siga.
  assert.deepEqual(c(piedra(P.geometria(juego(15, 2.6)))), [x2, y2]);
  // Con 15 m/s cae justo en la balsa (a 30 m).
  const balsa = g2.objetos.find(o => o.nombre === 'balsa');
  assert.ok(Math.abs((balsa.x0 + balsa.x1) / 2 - x2) < 1e-9);
});

test('las marcas de cada medio segundo: parejas en el agua, cada vez más separadas en la peña', () => {
  const g = P.geometria(juego(12, 2));
  const enX = g.sombras.filter(s => s.eje === 'x').map(s => s.x), enH = g.sombras.filter(s => s.eje === 'h').map(s => s.y);
  assert.equal(enX.length, 4); assert.equal(enH.length, 4);
  const dx = enX.map((x, i) => x - (i ? enX[i - 1] : g.X(0))), dh = enH.map((y, i) => y - (i ? enH[i - 1] : g.Y(0)));
  for (const d of dx) assert.ok(Math.abs(d - dx[0]) < 1e-9, 'de lado, la misma separación');
  for (let i = 1; i < dh.length; i++) assert.ok(dh[i] > dh[i - 1] + 1, 'hacia abajo, cada vez más');
  const s = P.dibujar(juego(12, 2));
  assert.equal((s.match(/class="fis-sombra"/g) || []).length, 8);
  assert.equal((s.match(/class="fis-tenue"/g) || []).length, 4, 'la de ahora no es tenue');
  // El reloj de la pared: «1 s» y «2 s», en turquesa, y solo de los segundos enteros.
  assert.deepEqual(g.rotulos.filter(r => r.tipo === 'tiempo').map(r => [r.texto, r.color]), [['1 s', 'i'], ['2 s', 'i']]);
});

test('la que se suelta cae a la misma altura que la lanzada en cada marca, y los niveles las unen', () => {
  const d = Object.assign({}, PENA, { v0: 15, t: 2, cada: 0.5, niveles: true, otra: {}, alturas: RH });
  for (const t of [0, 0.5, 1, 1.5, 2]) {
    const g = P.geometria(Object.assign({}, d, { t })), a = g.objetos.find(o => o.nombre === 'piedra'), b = g.objetos.find(o => o.nombre === 'soltada');
    assert.ok(Math.abs((a.y0 + a.y1) - (b.y0 + b.y1)) < 1e-9, `a los ${t} s`);
    assert.ok(b.x1 < a.x0 || t === 0, 'la soltada cae pegada a la peña');
  }
  assert.equal((P.dibujar(d).match(/class="fis-nivel"/g) || []).length, 4);
  // «se suelta» solo se rotula antes de soltarla.
  const con = Object.assign({}, d, { otra: { texto: 'se suelta' } });
  assert.ok(P.geometria(Object.assign({}, con, { t: 0 })).rotulos.some(r => r.texto === 'se suelta'));
  assert.ok(!P.geometria(con).rotulos.some(r => r.texto === 'se suelta'));
});

test('los cortes de «Mira»: estado.corte elige el paso, y lo que se pide va en tinta', () => {
  const d = Object.assign({}, PENA, { v0: 15, cada: 0.5, otra: {}, alturas: RH, cortes: [{ t: 0 }, { t: 1, niveles: true }, { t: 2, niveles: true, regla: RX }] });
  assert.equal(P.geometria(d, { corte: 0 }).t, 0);
  assert.equal(P.geometria(d, { corte: 1 }).t, 1);
  assert.ok(!/x \(m\)/.test(P.dibujar(d, { corte: 1 })) && /x \(m\)/.test(P.dibujar(d, { corte: 2 })));
  assert.equal(P.geometria(d, { corte: 9 }).t, 2, 'un corte de más se queda en el último');
  const q = P.geometria({ plataforma: 'pena', alto: 20, v0: 10, flecha: { texto: '?' }, cotaAlto: { texto: '?' }, cotaAlcance: { texto: '20 m', hasta: 20 } });
  assert.deepEqual(q.rotulos.filter(r => r.texto === '?').map(r => r.color), [undefined, undefined], 'el «?» nunca lleva el color de su magnitud');
  assert.equal(q.rotulos.find(r => r.texto === '20 m').color, 'f');
});

test('con una pared enfrente, el vuelo termina en la pared', () => {
  const d = { plataforma: 'azotea', objeto: 'pelota', alto: 45, ancho: 48, v0: 20, t: 5, pared: { en: 40, alto: 45 } };
  const g = P.geometria(d), p = g.objetos.find(o => o.nombre === 'pelota');
  assert.equal(g.t, 2);
  assert.ok(Math.abs((p.x0 + p.x1) / 2 - g.X(40)) < 1e-9 && Math.abs((p.y0 + p.y1) / 2 - g.Y(20)) < 1e-9, 'a 40 m de lado y 20 m más abajo');
});
