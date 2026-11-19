// Pruebas de la pieza fis-giro (cosas que giran: rueda de la fortuna, carrusel, ventilador, óvalo, poleas, ruedas
// dentadas, llanta, la Tierra y el reloj). Encuadre con números (molde §6): todo dentro del lienzo con 4 de margen,
// ningún rótulo pisa a otro ni a una figura chica, la pieza es pura y solo usa currentColor y var(--c-*). Las figuras de
// la unidad (fisica.movimiento-circular) se revisan una por una en su propia prueba.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./fis-giro.js');

const TIPOS = ['rueda', 'carrusel', 'ventilador', 'pista', 'disco', 'polea', 'engranaje', 'llanta', 'tierra', 'reloj'];
const pisa = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
function revisar(nombre, datos, estado = {}) {
  const g = P.geometria(datos, estado), s = P.dibujar(datos, estado);
  assert.ok(!/NaN|undefined|Infinity/.test(s), `${nombre}: NaN o undefined en el SVG`);
  assert.equal(s, P.dibujar(datos, estado), `${nombre}: la pieza no es pura`);
  assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s.replace(/&#\d+;/g, '')), `${nombre}: un color fijo (hex)`);
  for (const r of g.rotulos) assert.ok(r.x0 >= 4 - 1e-9 && r.x1 <= 316 + 1e-9 && r.y0 >= 4 - 1e-9 && r.y1 <= g.H - 4 + 1e-9, `${nombre}: «${r.texto}» se sale`);
  for (let a = 0; a < g.rotulos.length; a++) for (let b = a + 1; b < g.rotulos.length; b++) assert.ok(!pisa(g.rotulos[a], g.rotulos[b]), `${nombre}: «${g.rotulos[a].texto}» pisa «${g.rotulos[b].texto}»`);
  for (const r of g.rotulos) for (const o of g.objetos.filter(x => x.fig)) assert.ok(!pisa(r, o), `${nombre}: «${r.texto}» pisa ${o.nombre}`);
  for (const o of g.objetos) assert.ok(o.x0 >= 2 && o.x1 <= 318 && o.y0 >= 2 && o.y1 <= g.H - 2, `${nombre}: ${o.nombre} se sale`);
  return { g, s };
}

test('fis-giro se registra en el kit y dibuja cada cuerpo como objeto de prueba', () => {
  assert.equal(Kit.piezas['fis-giro'], P);
  for (const tipo of TIPOS) {
    const { s } = revisar(tipo, { alto: 240, cuerpos: [{ tipo, c: [160, 118], R: 80, cabinas: 8, dientes: 16, latitud: 37, agujas: [{ ang: 90 }], piso: true }] });
    assert.match(s, new RegExp(`data-objeto="${tipo}" data-prueba="si"`), tipo);
    assert.ok(P.alt({ cuerpos: [{ tipo }] }).length > 10, `${tipo}: texto alternativo`);
  }
});

test('rótulos con subíndice y con flecha de vector: «a_c» con <tspan> y «v⃗» con una flechita dibujada', () => {
  const { s } = revisar('vectores', { alto: 240, cuerpos: [{ tipo: 'pista', c: [160, 120], R: 86 }], puntos: [{ ang: 300, tipo: 'moto' }],
    flechas: [{ ang: 300, largo: 50, texto: 'v⃗' }, { ang: 300, dir: 'centro', largo: 40, color: 'h', texto: 'a⃗_c' }] });
  assert.match(s, /<tspan font-size="72%" dy="\.35em">c<\/tspan>/);
  assert.ok(!s.includes('⃗'), 'la U+20D7 no llega al SVG: se dibuja aparte');
  assert.equal((s.match(/class="fis-acel"/g) || []).length, 1);
  assert.equal((s.match(/class="fis-vel"/g) || []).length, 1);
  // Cada rótulo lleva el halo del color de la tarjeta.
  assert.ok((s.match(/paint-order="stroke"/g) || []).length >= 2);
});

test('los rótulos buscan un lugar libre: cerca del borde del lienzo o de otro rótulo, giran alrededor de su ancla', () => {
  // Un arco en lo más alto de la rueda: su rótulo no cabe afuera y se mete sin salirse.
  for (let a = 0; a < 360; a += 15) {
    revisar(`arco en ${a}°`, { alto: 238, cuerpos: [{ tipo: 'rueda', c: [150, 116], R: 80, cabinas: 8, giro: a }], puntos: [{ ang: 270 + a, tipo: 'cabina' }],
      arcos: [{ de: 270, a: 270 + Math.max(a, 1), texto: 's = 50,27 m' }, { tipo: 'angulo', de: 270, a: 270 + Math.max(a, 1), rpx: 20, texto: '2π rad' }],
      radios: [{ ang: 270 }, { ang: 270 + a }, { ang: 180, texto: 'r = 8 m', lado: 1 }] });
    revisar(`dos caballos en ${a}°`, { alto: 240, cuerpos: [{ tipo: 'carrusel', c: [160, 118], R: 100 }],
      puntos: [{ ang: a, f: 0.9, tipo: 'caballo', texto: 'Ana', lado: -1 }, { ang: a + 180, f: 0.3, tipo: 'caballo', texto: 'Beto', lado: -1 }],
      flechas: [{ ang: a, f: 0.9, largo: 42, texto: 'v' }, { ang: a + 180, f: 0.3, largo: 14 }] });
  }
});

test('cortes: estado.corte elige qué se agrega a los datos (para «Mira»)', () => {
  const d = { alto: 228, cuerpos: [{ tipo: 'ventilador', c: [165, 112], R: 92 }], cortes: [{ textos: [{ x: 312, y: 220, texto: 'uno', ancla: 'end' }] }, { textos: [{ x: 312, y: 220, texto: 'dos', ancla: 'end' }] }] };
  assert.match(P.dibujar(d, { corte: 0 }), />uno</);
  assert.match(P.dibujar(d, { corte: 1 }), />dos</);
  assert.match(P.dibujar(d, { corte: 9 }), />dos</, 'un corte que no existe se queda en el último');
});

test('correas: la faja y la cadena van por fuera de las dos ruedas, debajo de ellas', () => {
  const { s } = revisar('faja', { alto: 210, cuerpos: [{ tipo: 'polea', c: [86, 100], R: 34 }, { tipo: 'polea', c: [226, 100], R: 74 }], correas: [{ de: 0, a: 1, tipo: 'faja' }] });
  assert.ok(s.indexOf('fis-correa') < s.indexOf('data-objeto="polea"'), 'la faja se dibuja antes (debajo)');
  const c = revisar('cadena', { alto: 214, cuerpos: [{ tipo: 'engranaje', c: [96, 104], R: 60 }, { tipo: 'engranaje', c: [244, 104], R: 30 }], correas: [{ de: 0, a: 1, tipo: 'cadena' }] }).s;
  assert.match(c, /class="fis-correa"[^>]*stroke-dasharray="4 3"/);
});

// 19 nov (lector en frío de Movimiento circular): un rótulo evita, si puede, las patas de la rueda de la fortuna, la
// flecha curva del sentido de giro, el tronco de las flechas y el borde de los cuerpos.
const cruzaSeg = (b, x1, y1, x2, y2) => { for (let q = 0; q <= 60; q++) { const x = x1 + (x2 - x1) * q / 60, y = y1 + (y2 - y1) * q / 60; if (x > b.x0 + 1 && x < b.x1 - 1 && y > b.y0 + 1 && y < b.y1 - 1) return true; } return false; };
test('los rótulos no se montan en las patas del soporte ni en la flecha curva del giro', () => {
  for (let a = 15; a < 345; a += 15) {
    const g = P.geometria({ alto: 238, cuerpos: [{ tipo: 'rueda', c: [150, 116], R: 80, cabinas: 8, giro: a }], puntos: [{ ang: 270 + a, tipo: 'cabina' }],
      arcos: [{ de: 270, a: 270 + a, texto: 's = 16 m', afuera: 26 }], radios: [{ ang: 270 }, { ang: 270 + a }] });
    const s = g.rotulos.find(r => r.texto === 's = 16 m');
    for (const sg of [-1, 1]) assert.ok(!cruzaSeg(s, 150, 116 + 24, 150 + sg * 0.62 * 80, 116 + 98), `arco de ${a}°: «s» sobre la pata`);
  }
  // La «v» de un caballo que gira parejo, junto a la flecha curva del sentido (Predice de B6).
  const d = { alto: 240, cuerpos: [{ tipo: 'carrusel', c: [160, 118], R: 100 }], puntos: [{ ang: 60, f: 0.9, tipo: 'caballo' }], flechas: [{ ang: 60, f: 0.9, largo: 48, texto: 'v' }],
    sentido: [{ f: 1.12, de: 90, a: 135 }] };
  const g = P.geometria(d), v = g.rotulos.find(r => r.texto === 'v'), R = 1.12 * 100;
  for (let u = 90; u < 135; u += 5) { const x1 = 160 + R * Math.cos(u * Math.PI / 180), y1 = 118 - R * Math.sin(u * Math.PI / 180), x2 = 160 + R * Math.cos((u + 5) * Math.PI / 180), y2 = 118 - R * Math.sin((u + 5) * Math.PI / 180);
    assert.ok(!cruzaSeg(v, x1, y1, x2, y2), '«v» sobre la flecha curva del giro'); }
});
