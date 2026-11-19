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
