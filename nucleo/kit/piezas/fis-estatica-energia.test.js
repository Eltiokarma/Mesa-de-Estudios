// Pruebas del bloque de Energía de la pieza fis-estatica (19 nov 2026, etapa 8; docs/etapa8/propuesta-fisica.md,
// decisión 10): la maleta, la barra de energía, el tobogán, el niño sentado, la maceta, el edificio y el motor. Encuadre
// con números (molde §6): todo dentro del lienzo con 4 de margen, ningún rótulo pisa a otro, la pieza es pura y solo usa
// currentColor y var(--c-*). Los objetos de Estática y Dinámica siguen en sus pruebas, sin cambios.
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('./fis-estatica.js');

const NUEVOS = ['maleta', 'barra-e', 'tobogan', 'sentado', 'maceta', 'edificio', 'motor'];
const pisa = (a, b) => a.x0 < b.x1 - 0.5 && b.x0 < a.x1 - 0.5 && a.y0 < b.y1 - 0.5 && b.y0 < a.y1 - 0.5;
function revisar(nombre, datos) {
  const g = P.geometria(datos), s = P.dibujar(datos);
  assert.ok(!/NaN|undefined|Infinity/.test(s), `${nombre}: NaN o undefined en el SVG`);
  assert.equal(s, P.dibujar(datos), `${nombre}: la pieza no es pura`);
  assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s.replace(/&#\d+;/g, '')), `${nombre}: un color fijo (hex)`);
  for (const o of g.objetos.filter(x => NUEVOS.includes(x.nombre))) assert.ok(o.x0 >= 4 - 1e-9 && o.x1 <= 316 + 1e-9 && o.y0 >= 4 - 1e-9 && o.y1 <= g.H - 4 + 1e-9, `${nombre}: el objeto ${o.nombre} se sale`);
  for (const r of g.rotulos) assert.ok(r.x0 >= 4 - 1e-9 && r.x1 <= 316 + 1e-9 && r.y0 >= 4 - 1e-9 && r.y1 <= g.H - 4 + 1e-9, `${nombre}: «${r.texto}» se sale`);
  for (let a = 0; a < g.rotulos.length; a++) for (let b = a + 1; b < g.rotulos.length; b++) assert.ok(!pisa(g.rotulos[a], g.rotulos[b]), `${nombre}: «${g.rotulos[a].texto}» pisa «${g.rotulos[b].texto}»`);
  return { g, s };
}
const TIPOS = {
  maleta: { x: 100, y: 200, asa: 37, texto: '12 kg' }, 'barra-e': { x: 160, y: 200, h: 80, color: 'h' }, tobogan: { de: [80, 60], a: [240, 200], forma: 'curva' },
  sentado: { x: 160, y: 150, giro: 20 }, maceta: { x: 160, y: 150 }, edificio: { x0: 40, x1: 140, y: 220, pisos: 4, hp: 46 }, motor: { x: 160, y: 60 },
};
test('el bloque de Energía dibuja sus siete objetos como dibujo de prueba, dentro del lienzo', () => {
  for (const [tipo, o] of Object.entries(TIPOS)) {
    const { s } = revisar(tipo, { alto: 240, objetos: [Object.assign({ tipo }, o)] });
    assert.match(s, new RegExp(`data-objeto="${tipo}" data-prueba="si"`), tipo);
  }
  assert.match(P.alt({ objetos: [{ tipo: 'tobogan', de: [80, 60], a: [240, 200] }] }), /tobogán/);
});
test('el tobogán: enTobogan sale de arriba, llega abajo y la curva es más empinada al empezar', () => {
  for (const forma of ['recta', 'curva']) {
    const o = { de: [80, 60], a: [240, 200], forma };
    assert.deepEqual([P.enTobogan(o, 0).x, P.enTobogan(o, 0).y], [80, 60]);
    assert.deepEqual([P.enTobogan(o, 1).x, P.enTobogan(o, 1).y], [240, 200]);
  }
  const c = { de: [80, 60], a: [240, 200], forma: 'curva' };
  assert.ok(P.enTobogan(c, 0).ang > P.enTobogan(c, 0.9).ang + 20, 'la curva se aplana al final');
  revisar('recta con niño', { alto: 240, piso: { y: 200 }, objetos: [{ tipo: 'tobogan', de: [80, 60], a: [240, 200] }, { tipo: 'sentado', x: 80, y: 58, giro: -41 }] });
});
test('las barras de energía con sus rótulos no se pisan', () => {
  const barras = [['h', 90], ['tinta', 50], ['i', 30]];
  revisar('barras', { alto: 240, objetos: barras.map(([c, h], i) => ({ tipo: 'barra-e', x: 200 + 40 * i, y: 200, h, color: c })),
    textos: barras.flatMap(([c, h], i) => [{ x: 200 + 40 * i, y: 192 - h, texto: `${h} J`, ancla: 'middle', color: c === 'tinta' ? undefined : c }, { x: 200 + 40 * i, y: 218, texto: ['A', 'B', 'C'][i], ancla: 'middle' }]) });
  revisar('vacía', { alto: 240, objetos: [{ tipo: 'barra-e', x: 160, y: 200, h: 60, color: 'tinta', vacia: true }] });
});
