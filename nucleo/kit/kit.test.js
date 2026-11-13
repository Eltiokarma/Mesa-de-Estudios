// Pruebas del núcleo del kit (nucleo/kit/kit.js), las primitivas (trazo.js) y la línea de tiempo (estado puro).
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('./kit.js');
const T = require('./trazo.js');
const LT = require('./linea-tiempo.js');
const P = require('../predicciones.js');

test('formatear es el mismo de nucleo/predicciones.js', () => {
  const vals = [0, 1, -1, 0.5, 1.035, 178.5, 1234.5, 1e6, -2.675, 40.5, 0.125, 99.995, 3.14159];
  for (const v of vals) for (const d of [0, 1, 2, 3]) assert.equal(Kit.formatear(v, d), P.formatear(v, d), `${v} con ${d}`);
});

test('ajustar lleva al paso y a los límites, sin ruido de coma flotante', () => {
  assert.equal(Kit.respuesta.ajustar(178.4, 0.5), 178.5);
  assert.equal(Kit.respuesta.ajustar(0.1 + 0.2, 0.1), 0.3);
  assert.equal(Kit.respuesta.ajustar(-3, 1, 0, 10), 0);
  assert.equal(Kit.respuesta.ajustar(12, 1, 0, 10), 10);
  assert.equal(Kit.respuesta.ajustar(NaN, 1, 0, 10), 0);
});

test('pasoBonito elige el mayor paso de la lista que no pasa del tope', () => {
  assert.equal(Kit.respuesta.pasoBonito(2.3), 2);
  assert.equal(Kit.respuesta.pasoBonito(0.3), 0.25);
  assert.equal(Kit.respuesta.pasoBonito(0.001), 0.01);
  assert.equal(Kit.respuesta.pasoBonito(1000), 100);
});

test('clasificar: la alternativa más cercana dentro de la tolerancia, o null', () => {
  const alt = [{ letra: 'A', valor: 178.5, correcta: true }, { letra: 'B', valor: 165 }, { letra: 'C', valor: 232.5 }];
  assert.equal(Kit.respuesta.clasificar(179, alt, 1).letra, 'A');
  assert.equal(Kit.respuesta.clasificar(166, alt, 1).letra, 'B');
  assert.equal(Kit.respuesta.clasificar(200, alt, 1), null);
  assert.equal(Kit.respuesta.clasificar(171.75, alt, 10).letra, 'A', 'empate: gana la primera');
});

test('palabras: letras o cifras seguidas; los números con coma cuentan una', () => {
  assert.equal(Kit.palabras('Se paga S/ 178,50.'), 4);
  assert.equal(Kit.palabras(['El ', { v: 'a', t: '15 %' }, ' se quita.']), 4);
  assert.equal(Kit.palabras('−15 % · S/ 45'), 3);
  assert.equal(Kit.palabras(''), 0);
});

test('registrar exige id, dibujar y alt', () => {
  assert.throws(() => Kit.registrar({ id: 'Mala', dibujar() {}, alt() {} }));
  assert.throws(() => Kit.registrar({ id: 'sin-alt', dibujar() {} }));
  const p = Kit.registrar({ id: 'prueba-x', dibujar: () => '<svg></svg>', alt: () => 'x' });
  assert.equal(Kit.piezas['prueba-x'], p);
  delete Kit.piezas['prueba-x'];
});

test('trazo: tokens del contrato, sin colores fijos, texto escapado y de 14 o más', () => {
  const s = [
    T.flecha(0, 0, 100, 50, { color: 'o' }), T.cota(10, 200, 30, { texto: 'base S/ 300' }), T.rotulo(5, 20, '<b>&', { tam: 10 }),
    T.eje(0, 300, 40, { marcas: [0, 100, 200] }), T.resaltado(0, 0, 50, 20, { color: 'i' }), T.barra(0, 0, 80, 30, { color: 'h', discontinua: true }),
    T.linea(0, 0, 10, 10, { color: '#ff0000' }),
  ].join('');
  assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), 'sin colores en hex');
  assert.ok(!/NaN|undefined|null/.test(s));
  assert.match(s, /&lt;b&gt;&amp;/);
  for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14, `texto de ${t}`);
  assert.match(s, /stroke-linecap="round"/);
  assert.match(T.linea(0, 0, 1, 1, { color: 'zz' }), /stroke="currentColor"/);
  // La flecha termina en una sola punta, en el punto pedido.
  assert.equal((T.flecha(0, 0, 100, 0).match(/<path/g) || []).length, 1);
  assert.match(T.flecha(0, 0, 100, 0), /M100 0L/);
});

test('trazo: un rótulo se encaja dentro del lienzo', () => {
  const r = T.rotulo(318, 20, 'S/ 1 234,5', { ancla: 'start' });
  const x = +r.match(/ x="([\d.-]+)"/)[1];
  assert.ok(x + T.ancho('S/ 1 234,5') <= T.ANCHO, 'no se sale por la derecha');
  const svg = T.svg(320, 100, r, { alt: 'Una "figura"' });
  assert.match(svg, /^<svg[\s>]/); assert.match(svg, /viewBox="0 0 320 100"/); assert.match(svg, /aria-label="Una &quot;figura&quot;"/);
});

test('línea de tiempo: estado(i) = base + estado del paso, acotado a 1..n', () => {
  const pasos = [{ estado: { corte: 1 } }, { estado: { corte: 2 } }, { estado: { corte: 2, final: true } }];
  const base = { fantasma: { marca: 45 } };
  assert.deepEqual(LT.estado(pasos, 2, base), { fantasma: { marca: 45 }, corte: 2 });
  assert.deepEqual(LT.estado(pasos, 0, base), LT.estado(pasos, 1, base));
  assert.deepEqual(LT.estado(pasos, 9, base), LT.estado(pasos, 3, base));
  assert.equal(base.corte, undefined, 'no toca la base');
});
