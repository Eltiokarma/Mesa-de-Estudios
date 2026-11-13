// Pruebas de la pieza «balanza»: el final dibuja la respuesta, ida y vuelta da el mismo SVG, nada de NaN ni
// undefined, colores solo de variable, alto fijo, la marca se convierte bien y la inclinación sigue al peso real.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const B = require('./balanza.js');
const LT = require('../linea-tiempo.js');

const COL = { circulo: 'o', triangulo: 'i', cuadrado: 'h', rombo: 'd', x: 'o', y: 'i' };
// Sustitución: 1 rombo = 3 círculos; 1 cuadrado = 1 rombo + 1 círculo. ¿Cuántos círculos equilibran 2 cuadrados?
const SUS = {
  unidad: 'kg', colores: COL, pesos: { circulo: 1, rombo: 3, cuadrado: 4 },
  balanzas: [{ izq: { rombo: 1 }, der: { circulo: 3 }, estado: 'equilibrio' }, { izq: { cuadrado: 1 }, der: { rombo: 1, circulo: 1 }, estado: 'equilibrio' }],
  trabajo: [{ izq: { cuadrado: 2 }, der: {}, traba: true }, { izq: { cuadrado: 2 }, der: { circulo: 8 }, rotulo: ['= ', { n: 8, f: 'circulo' }] }],
  marca: { vista: 0, lado: 'der', figura: 'circulo', max: 20, nombre: ['círculo', 'círculos'] },
};
// Ecuación: 3x + 2 = x + 10 → quitar x y 2 de cada lado → 2x = 8.
const ECU = {
  unidad: 'kg', colores: COL, incognitas: ['x'], pesos: { x: 4 },
  balanzas: [{ izq: { x: 3, pesa: 2 }, der: { x: 1, pesa: 10 }, estado: 'equilibrio' }],
  trabajo: [{ izq: { x: 3, pesa: 2 }, der: { x: 1, pesa: 10 } }, { izq: { x: 2 }, der: { pesa: 8 }, quita: { izq: { x: 1, pesa: 2 }, der: { x: 1, pesa: 2 } } },
    { izq: { x: 1 }, der: { pesa: 4 }, rotulo: [{ t: 'x = 4 kg', c: 'o' }] }],
};
// Pesas: saco de 54 kg; sin pesos de figuras.
const PES = { unidad: 'kg', colores: COL, balanzas: [], trabajo: [{ izq: { saco: 54 }, der: {} }, { izq: { saco: 54 }, der: { pesas: [[13, 3], [5, 3]] } }] };
const P_SUS = [{ estado: { usa: [0], rastros: { 0: [{ n: 1, f: 'rombo' }, ' = ', { n: 3, f: 'circulo' }] }, nuevo: ['r0'] } },
  { estado: { usa: [1], rastros: { 0: ['a'], 1: ['b'] }, nuevo: ['r1'] } }, { estado: { vista: 1, rastros: { 0: ['a'], 1: ['b'] }, final: true } }];
const P_ECU = [{ estado: { vista: 0 } }, { estado: { vista: 1, nuevo: ['t'] } }, { estado: { vista: 2, final: true } }];
// Extremos del travesaño (la línea de 3 px en tinta) de cada balanza dibujada.
const travesanos = s => [...s.matchAll(/<line x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)" stroke="currentColor" stroke-width="3"/g)].map(m => m.slice(1).map(Number));

test('se registra en el catálogo del kit', () => assert.equal(Kit.piezas.balanza, B));

test('la inclinación sigue al peso real: en equilibrio, horizontal; baja el lado que pesa más', () => {
  for (const b of SUS.balanzas) assert.equal(B.inclinacion(SUS, b), 0);
  assert.equal(B.inclinacion(ECU, ECU.balanzas[0]), 0);
  assert.ok(B.inclinacion(ECU, { izq: { x: 2 }, der: { pesa: 5 } }) > 0, '8 kg contra 5 kg: baja la izquierda');
  assert.ok(B.inclinacion(ECU, { izq: { x: 1 }, der: { pesa: 5 } }) < 0);
  assert.ok(B.inclinacion(PES, PES.trabajo[0]) > 0);
  assert.equal(B.inclinacion(PES, PES.trabajo[1]), 0, '3 × 13 + 3 × 5 = 54');
  assert.ok(B.inclinacion({}, { izq: { circulo: 1 }, der: {}, estado: 'der-baja' }) < 0, 'sin pesos manda el estado');
  // En el SVG: equilibrio → extremos a la misma altura; saco solo → el extremo izquierdo más abajo (y mayor).
  for (const [, y1, , y2] of travesanos(B.dibujar(ECU, {}))) assert.equal(y1, y2);
  const [[, yi, , yd]] = travesanos(B.dibujar(PES, {}));
  assert.ok(yi > yd);
});

test('el estado final dibuja la respuesta: la marca con su ✓ y la balanza horizontal', () => {
  assert.equal(B.controles(SUS).respuesta, 8);
  const s = B.dibujar(SUS, LT.estado(P_SUS, 3));
  assert.match(s, /8 círculos ✓/);
  for (const [, y1, , y2] of travesanos(s)) assert.equal(y1, y2);
  assert.match(B.dibujar(ECU, LT.estado(P_ECU, 3)), /x = 4 kg/);
  const p = B.dibujar(PES, { vista: 1 });
  assert.match(p, /13 kg/); assert.match(p, /×3/);
});

test('cada paso deja su rastro y lo que se quita de los dos lados se ve discontinuo', () => {
  const s1 = B.dibujar(SUS, LT.estado(P_SUS, 1)), s2 = B.dibujar(SUS, LT.estado(P_SUS, 2));
  assert.match(s1, /kit-aparece kit-nuevo/);
  assert.match(s2, />a</, 'el rastro del paso 1 sigue');
  const q = B.dibujar(ECU, LT.estado(P_ECU, 2));
  assert.ok((q.match(/stroke-dasharray="3 3"/g) || []).length >= 4, 'lo quitado va discontinuo');
});

test('ida y vuelta: el mismo paso da el mismo SVG, venga de donde venga', () => {
  for (const [d, P] of [[SUS, P_SUS], [ECU, P_ECU]]) {
    const base = { fantasma: { marca: 5, rotulo: 'a medias' } };
    const ida = [1, 2, 3].map(i => B.dibujar(d, LT.estado(P, i, base)));
    const vuelta = [3, 2, 1].map(i => B.dibujar(d, LT.estado(P, i, base))).reverse();
    assert.deepEqual(ida, vuelta);
  }
});

test('sin NaN, undefined ni colores fijos; texto de 14 o más; el alto no cambia entre estados', () => {
  const estados = [{}, { marca: 0 }, { marca: 1e9 }, { marca: -5 }, { vista: 1 }, { vista: 9 }, { vista: 2, final: true, fantasma: { marca: 5, rotulo: 'x' } },
    { fantasma: { der: { pesa: 7 }, rotulo: 'otro' } }, { fantasma: { marca: NaN } }, { rastros: { 0: ['x = 3'] }, usa: [0, 7] }];
  for (const d of [SUS, ECU, PES]) {
    const altos = new Set();
    for (const e of estados) {
      const s = B.dibujar(d, e);
      assert.ok(!/NaN|undefined|null|Infinity/.test(s), `${JSON.stringify(e)}: ${s.match(/.{30}(NaN|undefined|null|Infinity).{10}/)}`);
      assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), 'colores solo con var(--c-*) o currentColor');
      assert.ok(!/<script|\son[a-z]+\s*=|javascript:|<foreignObject|\sid=/i.test(s), 'sin código ni ids');
      for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14);
      altos.add(s.match(/viewBox="0 0 320 ([\d.]+)"/)[1]);
    }
    assert.equal(altos.size, 1, 'la figura mide lo mismo en todos los estados');
    assert.ok(B.cabe(d));
  }
});

test('la marca pone n figuras en el platillo y deX deshace aX', () => {
  const c = B.controles(SUS).marca;
  for (const v of [0, 5, 10, 20]) assert.ok(Math.abs(c.deX(c.aX(v)) - v) < 1e-9);
  assert.equal(c.texto(1), '1 círculo'); assert.equal(c.texto(3), '3 círculos');
  const s = B.dibujar(SUS, { marca: 3 });
  assert.equal((s.match(/<circle cx="[\d.]+" cy="[\d.]+" r="9"/g) || []).length, 3 + 1 + 3, '3 y 1 de las balanzas y 3 de la marca');
  assert.ok(s.includes(`cx="${Math.round(c.aX(3) * 100) / 100}"`), 'la manija está en aX(valor)');
  assert.match(B.dibujar(SUS, { marca: 30 }), /×20/, 'más de 4 figuras iguales: una con su ×n');
  assert.equal(B.controles(ECU), null, 'sin marca no hay control');
});

test('alt cuenta la relación', () => {
  assert.equal(B.alt(SUS), '2 balanzas: 1) 1 rombo contra 3 círculos, en equilibrio; 2) 1 cuadrado contra 1 rombo y 1 círculo, en equilibrio');
  assert.equal(B.alt(PES), 'Balanza con 54 kg a la izquierda y nada a la derecha');
});
