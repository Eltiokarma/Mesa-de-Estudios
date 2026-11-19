// Pruebas del bloque de Dinámica de la pieza fis-estatica (19 nov 2026, etapa 7; docs/etapa7/propuesta-fisica.md,
// decisión 10): el carrito, el ascensor, el auto, el tramo de pista y el disco. Encuadre con números (molde §6): todo
// dentro del lienzo con 4 de margen, ningún rótulo pisa a otro, la pieza es pura y solo usa currentColor y var(--c-*).
// Los objetos de Estática siguen en fis-estatica.test.js, sin cambios.
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('./fis-estatica.js');

const pisa = (a, b) => a.x0 < b.x1 - 0.5 && b.x0 < a.x1 - 0.5 && a.y0 < b.y1 - 0.5 && b.y0 < a.y1 - 0.5;
function revisar(nombre, datos) {
  const g = P.geometria(datos), s = P.dibujar(datos);
  assert.ok(!/NaN|undefined|Infinity/.test(s), `${nombre}: NaN o undefined en el SVG`);
  assert.equal(s, P.dibujar(datos), `${nombre}: la pieza no es pura`);
  assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s.replace(/&#\d+;/g, '')), `${nombre}: un color fijo (hex)`);
  for (const o of g.objetos.filter(x => ['carrito', 'ascensor', 'auto', 'pista', 'disco', 'pelota'].includes(x.nombre))) assert.ok(o.x0 >= 4 - 1e-9 && o.x1 <= 316 + 1e-9 && o.y0 >= 4 - 1e-9 && o.y1 <= g.H - 4 + 1e-9, `${nombre}: el objeto ${o.nombre} se sale`);
  for (const r of g.rotulos) assert.ok(r.x0 >= 4 - 1e-9 && r.x1 <= 316 + 1e-9 && r.y0 >= 4 - 1e-9 && r.y1 <= g.H - 4 + 1e-9, `${nombre}: «${r.texto}» se sale`);
  for (let a = 0; a < g.rotulos.length; a++) for (let b = a + 1; b < g.rotulos.length; b++) assert.ok(!pisa(g.rotulos[a], g.rotulos[b]), `${nombre}: «${g.rotulos[a].texto}» pisa «${g.rotulos[b].texto}»`);
  return { g, s };
}
const TIPOS = {
  carrito: { x: 160, y: 200, texto: '30 kg' }, ascensor: { x: 160, y: 220, w: 120, h: 160 }, auto: { x: 160, y: 200, texto: '1000 kg' },
  pista: { c: [160, 300], r: 160, de: 60, a: 120 }, disco: { c: [160, 120], r: 90 }, pelota: { x: 160, y: 120 },
};
test('el bloque de Dinámica dibuja sus seis objetos como dibujo de prueba, dentro del lienzo', () => {
  for (const [tipo, o] of Object.entries(TIPOS)) {
    const { s } = revisar(tipo, { alto: 240, objetos: [Object.assign({ tipo }, o)] });
    assert.match(s, new RegExp(`data-objeto="${tipo}" data-prueba="si"`), tipo);
  }
  assert.match(P.alt({ objetos: [{ tipo: 'ascensor' }] }), /ascensor/);
});
test('el auto girado, la hondonada y el carrito con mango a cada lado', () => {
  revisar('auto girado', { alto: 240, objetos: [{ tipo: 'auto', x: 160, y: 150, giro: 20 }] });
  revisar('hondonada', { alto: 240, objetos: [{ tipo: 'pista', forma: 'hondonada', c: [160, -40], r: 220, de: 240, a: 300 }] });
  for (const mango of [-1, 0, 1]) revisar(`mango ${mango}`, { alto: 240, piso: { y: 200 }, objetos: [{ tipo: 'carrito', x: 160, y: 200, mango }] });
  // un rótulo de fuerza junto al carrito no pisa la caja del techo del ascensor ni otro rótulo
  revisar('fuerzas', { alto: 240, objetos: [{ tipo: 'ascensor', x: 160, y: 226, w: 140, h: 190 }, { tipo: 'balanza', x: 160, y: 226, w: 80 }],
    flechas: [{ de: [140, 150], ang: 90, largo: 40, color: 'f', texto: 'N⃗' }, { de: [140, 190], ang: 270, largo: 30, color: 'h', texto: 'P⃗' }, { de: [260, 110], ang: 90, largo: 30, color: 'tinta', texto: 'a⃗', discontinua: true }] });
});
