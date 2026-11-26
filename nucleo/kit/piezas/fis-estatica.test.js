// Pruebas de la pieza fis-estatica (cuerpos quietos y sus fuerzas). Encuadre con números (molde §6): todo dentro del
// lienzo con 4 de margen, ningún rótulo pisa a otro ni a una figura chica, la pieza es pura y solo usa currentColor y
// var(--c-*). Las figuras de la unidad (fisica.estatica) se revisan una por una en su propia prueba.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./fis-estatica.js');

const pisa = (a, b) => a.x0 < b.x1 - 0.5 && b.x0 < a.x1 - 0.5 && a.y0 < b.y1 - 0.5 && b.y0 < a.y1 - 0.5;
function revisar(nombre, datos, estado = {}) {
  const g = P.geometria(datos, estado), s = P.dibujar(datos, estado);
  assert.ok(!/NaN|undefined|Infinity/.test(s), `${nombre}: NaN o undefined en el SVG`);
  assert.equal(s, P.dibujar(datos, estado), `${nombre}: la pieza no es pura`);
  assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s.replace(/&#\d+;/g, '')), `${nombre}: un color fijo (hex)`);
  for (const r of g.rotulos) assert.ok(r.x0 >= 4 - 1e-9 && r.x1 <= 316 + 1e-9 && r.y0 >= 4 - 1e-9 && r.y1 <= g.H - 4 + 1e-9, `${nombre}: «${r.texto}» se sale`);
  for (let a = 0; a < g.rotulos.length; a++) for (let b = a + 1; b < g.rotulos.length; b++) assert.ok(!pisa(g.rotulos[a], g.rotulos[b]), `${nombre}: «${g.rotulos[a].texto}» pisa «${g.rotulos[b].texto}»`);
  return { g, s };
}
const TIPOS = {
  caja: { x: 160, y: 200, texto: '5 kg' }, costal: { x: 160, y: 200 }, ropero: { x: 160, y: 200 }, balde: { x: 160, y: 200 },
  letrero: { x: 160, y: 80, texto: 'BODEGA' }, bolsa: { x: 160, y: 80 }, balanza: { x: 160, y: 200, lectura: '400 N' },
  persona: { x: 160, y: 200, alto: 90 }, cuerda: { de: [100, 20], a: [200, 120] }, nudo: { en: [160, 100] }, resorte: { de: [160, 20], a: [160, 150] },
  polea: { c: [160, 100] }, rampa: { x0: 20, y0: 200, largo: 250, ang: 37 }, barra: { de: [40, 120], a: [280, 120] }, apoyo: { x: 160, y: 126 },
  caballete: { x: 160, y: 150 }, viga: { x0: 100, x1: 220, y: 30 }, escalera: { de: [150, 210], a: [270, 60] }, escoba: { de: [24, 110], a: [300, 110] },
  llave: { de: [70, 150], a: [240, 150] }, regla: { x: 200, y0: 20, y1: 200, cm: 4 }, gancho: { x: 160, y: 40 },
};
test('fis-estatica se registra en el kit y dibuja cada objeto como dibujo de prueba', () => {
  assert.equal(Kit.piezas['fis-estatica'], P);
  for (const [tipo, o] of Object.entries(TIPOS)) {
    const { s } = revisar(tipo, { alto: 240, objetos: [Object.assign({ tipo }, o)] });
    assert.match(s, new RegExp(`data-objeto="${tipo}" data-prueba="si"`), tipo);
  }
  assert.ok(P.alt({ objetos: [{ tipo: 'costal' }], flechas: [{}] }).length > 10);
});
test('las fuerzas son flechas con su color; los rótulos con subíndice y con flecha de vector se dibujan aparte', () => {
  const { s, g } = revisar('fuerzas', { alto: 240, piso: { y: 200 }, objetos: [{ tipo: 'caja', x: 160, y: 200, w: 60, h: 40, fig: true }],
    flechas: [{ de: [160, 160], ang: 90, largo: 60, color: 'f', texto: 'N⃗' }, { de: [160, 200], ang: 270, largo: 30, color: 'h', texto: 'P_b' }, { de: [190, 180], ang: 0, largo: 40, color: 'o', texto: 'F = 20 N', discontinua: true }] });
  assert.match(s, /<tspan font-size="72%" dy="\.35em">b<\/tspan>/);
  assert.ok(!s.includes('⃗'), 'la U+20D7 no llega al SVG: se dibuja aparte');
  assert.match(s, /var\(--c-f\)/); assert.match(s, /var\(--c-h\)/); assert.match(s, /var\(--c-o\)/);
  assert.equal(g.flechas.length, 3);
  // la caja con fig: true no deja que un rótulo la pise
  for (const r of g.rotulos) for (const o of g.objetos.filter(x => x.fig)) assert.ok(!pisa(r, o), `«${r.texto}» pisa la caja`);
});
test('subíndices compuestos: «v_f,x», «P_total,x» y «x_CM(t)» van enteros abajo (impulso y choques, 26 nov)', () => {
  const { s } = revisar('subindices', { alto: 120, textos: [{ x: 12, y: 20, texto: 'v_f,x = 2 m/s' }, { x: 12, y: 50, texto: 'P_total,x = 6 kg·m/s' }, { x: 12, y: 80, texto: 'x_CM(t) = ?' }] });
  assert.match(s, /<tspan font-size="72%" dy="\.35em">f,x<\/tspan>/);
  assert.match(s, /<tspan font-size="72%" dy="\.35em">total,x<\/tspan>/);
  assert.match(s, /<tspan font-size="72%" dy="\.35em">CM\(t\)<\/tspan>/);
});
test('cortes y pasos: «Mira» agrega lo de cada corte, y un elemento con paso aparece desde ese paso', () => {
  const d = { alto: 200, objetos: [{ tipo: 'nudo', en: [160, 100] }], flechas: [{ de: [160, 100], ang: 90, largo: 40, texto: 'A', paso: 1 }], cortes: [{ textos: [] }, { textos: [{ x: 8, y: 30, texto: 'segundo' }] }] };
  assert.equal(P.geometria(d, { paso: 0, corte: 0 }).flechas.length, 0);
  assert.equal(P.geometria(d, { paso: 1, corte: 0 }).flechas.length, 1);
  assert.ok(P.geometria(d, { corte: 1 }).rotulos.some(r => r.texto === 'segundo'));
});
