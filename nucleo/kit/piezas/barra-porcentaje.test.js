// Pruebas de la pieza «barra-porcentaje»: el final dibuja el valor correcto, ida y vuelta da el mismo SVG,
// nada de NaN ni undefined, colores solo de variable y la marca se convierte bien entre valor y posición.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const B = require('./barra-porcentaje.js');
const LT = require('../linea-tiempo.js');

const soles = (tramos, total = 300) => ({ total, prefijo: 'S/ ', sufijo: '', decimales: 2, color: 'o', tramos, marca: 'queda' });
const D = soles([{ tipo: 'descuento', pct: 15, color: 'i' }, { tipo: 'descuento', pct: 30, color: 'h' }]);
const AUM = soles([{ tipo: 'aumento', pct: 20, color: 'i' }, { tipo: 'descuento', pct: 25, color: 'h' }], 500);
const UNICO = { total: 100, prefijo: '', sufijo: ' %', decimales: 2, color: 'o', marca: 'quita',
  tramos: [{ tipo: 'descuento', pct: 15, color: 'i' }, { tipo: 'descuento', pct: 30, color: 'h' }] };
const PASOS = [{ estado: { corte: 1 } }, { estado: { corte: 2 } }, { estado: { corte: 2, final: true } }];

test('se registra en el catálogo del kit', () => {
  assert.equal(Kit.piezas['barra-porcentaje'], B);
});

test('los valores se multiplican tramo a tramo', () => {
  assert.deepEqual(B.valores(D).map(x => +x.toFixed(6)), [300, 255, 178.5]);
  assert.deepEqual(B.valores(AUM).map(x => +x.toFixed(6)), [500, 600, 450]);
  assert.equal(B.controles(UNICO).respuesta.toFixed(6), '40.500000');
});

test('el estado final dibuja la respuesta correcta con su ✓ y su porcentaje', () => {
  const s = B.dibujar(D, LT.estado(PASOS, 3));
  assert.match(s, /S\/ 178,5 ✓/);
  assert.match(s, /59,5 % del total/);
  assert.match(B.dibujar(AUM, LT.estado(PASOS, 3)), /S\/ 450 ✓/);
  assert.match(B.dibujar(UNICO, LT.estado(PASOS, 3)), /40,5 % ✓/);
});

test('cada paso deja su rastro: el segundo tramo se calcula sobre lo que quedó', () => {
  const s1 = B.dibujar(D, LT.estado(PASOS, 1)), s2 = B.dibujar(D, LT.estado(PASOS, 2));
  assert.match(s1, /−15 % · S\/ 45/); assert.match(s1, /base S\/ 300/);
  assert.ok(!/−30 %/.test(s1), 'el paso 1 no adelanta el segundo tramo');
  assert.match(s2, /−15 % · S\/ 45/, 'el primer tramo sigue dibujado');
  assert.match(s2, /−30 % · S\/ 76,5/); assert.match(s2, /base S\/ 255/);
  assert.match(B.dibujar(AUM, LT.estado(PASOS, 1)), /\+20 % · S\/ 100/);
});

test('ida y vuelta: el mismo paso da el mismo SVG, venga de donde venga', () => {
  for (const d of [D, AUM, UNICO]) {
    const base = { fantasma: { marca: 45, rotulo: 'sumando' } };
    const ida = [1, 2, 3].map(i => B.dibujar(d, LT.estado(PASOS, i, base)));
    const vuelta = [3, 2, 1].map(i => B.dibujar(d, LT.estado(PASOS, i, base))).reverse();
    assert.deepEqual(ida, vuelta);
    assert.equal(B.dibujar(d, { corte: 0, marca: 50 }), B.dibujar(d, { corte: 0, marca: 50 }));
  }
});

test('sin NaN, undefined ni colores fijos; texto de 14 o más; el alto no cambia entre estados', () => {
  const estados = [{}, { corte: 0, marca: 0 }, { corte: 0, marca: 1e9 }, { corte: 0, marca: -5 }, { corte: 1 }, { corte: 2 },
    { corte: 2, final: true, fantasma: { marca: 165, rotulo: 'sumando' } }, { corte: 7 }, { fantasma: { marca: NaN } }];
  for (const d of [D, AUM, UNICO]) {
    const altos = new Set();
    for (const e of estados) {
      const s = B.dibujar(d, e);
      assert.ok(!/NaN|undefined|null|Infinity/.test(s), `${JSON.stringify(e)}: ${s.match(/.{20}(NaN|undefined|null|Infinity).{20}/)}`);
      assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), 'colores solo con var(--c-*) o currentColor');
      assert.ok(!/<script|\son[a-z]+\s*=|javascript:|<foreignObject|\sid=/i.test(s), 'sin código ni ids');
      for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14);
      for (const [, c] of s.matchAll(/var\(--c-([a-z])\)/g)) assert.ok(['o', 'i', 'h'].includes(c));
      altos.add(s.match(/viewBox="0 0 320 ([\d.]+)"/)[1]);
    }
    assert.equal(altos.size, 1, 'la figura mide lo mismo en todos los estados (nada salta)');
  }
});

test('la marca se dibuja donde dice su valor, y deX deshace aX', () => {
  for (const d of [D, AUM, UNICO]) {
    const c = B.controles(d).marca;
    for (const v of [0, c.max / 3, c.max / 2, c.max]) assert.ok(Math.abs(c.deX(c.aX(v)) - v) < 1e-9);
    assert.ok(c.inicio >= c.min && c.inicio <= c.max);
    const s = B.dibujar(d, { corte: 0, marca: c.max / 2 });
    assert.ok(s.includes(`x1="${Math.round(c.aX(c.max / 2) * 100) / 100}"`), 'la línea de la marca pasa por aX(valor)');
    assert.ok(s.includes(c.texto(c.max / 2)), 'la lectura en vivo está junto a la marca');
  }
});

test('alt cuenta la relación, no la coreografía', () => {
  assert.equal(B.alt(D), 'Barra de S/ 300 que primero pierde el 15 % y luego pierde el 30 % de lo que queda');
  assert.equal(B.alt(AUM), 'Barra de S/ 500 que primero gana el 20 % y luego pierde el 25 % de lo que queda');
  assert.match(B.dibujar(D, {}), /role="img" aria-label="Barra de S\/ 300/);
});

test('geometria (agregada para el gesto directo): x y deX son inversas y la barra no cambia de lugar', () => {
  const g = B.geometria(D);
  for (const v of [0, 100, 255, 300]) assert.ok(Math.abs(g.deX(g.x(v)) - v) < 1e-9);
  assert.ok(g.barraY > 0 && g.barraH > 0 && g.piezaH > 0);
  assert.equal(g.filaY(1), 96);
  assert.match(B.dibujar(D, {}), new RegExp(`y="${g.barraY}"`));
});

test('escala opcional: sin ella el dibujo no cambia; con ella la barra se mide con esa regla', () => {
  assert.equal(B.dibujar(Object.assign({}, D, { escala: 0 }), { corte: 2 }), B.dibujar(D, { corte: 2 }));
  const g = B.geometria(Object.assign({}, D, { escala: 600 }));
  assert.equal(g.escala, 600);
  assert.equal(g.x(300), 160);
  assert.equal(B.geometria(Object.assign({}, D, { escala: 100 })).escala, 300);
});
