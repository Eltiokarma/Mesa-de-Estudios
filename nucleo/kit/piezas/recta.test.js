// Pruebas de la pieza «recta»: el final dibuja la respuesta, ida y vuelta da el mismo SVG, nada de NaN ni
// undefined, colores solo de variable, texto de 14 o más, alto fijo y la marca se convierte bien entre valor y posición.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const R = require('./recta.js');
const LT = require('../linea-tiempo.js');

// Cotas que encierran un entero: x > 3,5 y x < 6, con x entero → 4 y 5; la respuesta se arrastra.
const COTAS = {
  min: 0, max: 8, paso: 1, variable: 'x', color: 'o', filas: 2, decimales: 2,
  elementos: [
    { tipo: 'intervalo', a: 3.5, b: null, ca: false, color: 'i', rotulo: 'x > 3,5', fila: 2, desde: 1 },
    { tipo: 'intervalo', a: null, b: 6, cb: false, color: 'h', rotulo: 'x < 6', fila: 1, desde: 2 },
    { tipo: 'enteros', a: 4, b: 5, color: 'o', rotulo: 'enteros: 4 y 5', fila: 0, desde: 3 },
  ],
  marca: { min: 0, max: 8, inicio: 0 }, respuesta: 5,
};
// Unión de intervalos sin marca (se responde con alternativas): el fantasma es otro intervalo.
const UNION = {
  min: -4, max: 6, paso: 1, variable: 'k', color: 'o', filas: 1,
  elementos: [
    { tipo: 'intervalo', a: null, b: -2, cb: true, color: 'i', rotulo: 'k ≤ −2', fila: 1, desde: 1 },
    { tipo: 'intervalo', a: 3, b: null, ca: false, color: 'i', rotulo: 'k > 3', fila: 1, desde: 1 },
    { tipo: 'punto', x: 3, abierto: true, color: 'h', rotulo: '3', fila: 0, desde: 2 },
  ],
};
// Posiciones de dos móviles: distancia y salto, en metros.
const MOVIL = {
  min: 0, max: 120, paso: 10, cada: 2, sufijo: ' m', decimales: 0, variable: 'x (m)', filas: 2,
  elementos: [
    { tipo: 'punto', x: 0, color: 'i', rotulo: 'A', desde: 0 },
    { tipo: 'punto', x: 120, color: 'h', rotulo: 'B', desde: 0 },
    { tipo: 'salto', a: 0, b: 72, color: 'i', rotulo: '72 m', fila: 1, desde: 1 },
    { tipo: 'distancia', a: 72, b: 120, color: 'h', rotulo: '48 m', fila: 2, desde: 2 },
  ],
  marca: { min: 0, max: 120, inicio: 60 }, respuesta: 72,
};
const PASOS = [{ estado: { corte: 1 } }, { estado: { corte: 2 } }, { estado: { corte: 3, final: true } }];

test('se registra en el catálogo del kit', () => {
  assert.equal(Kit.piezas.recta, R);
});

test('el estado final dibuja la respuesta con su ✓ y todo lo calculado', () => {
  const s = R.dibujar(COTAS, LT.estado(PASOS, 3));
  assert.match(s, />5 ✓</);
  assert.match(s, /x &gt; 3,5/); assert.match(s, /x &lt; 6/); assert.match(s, /enteros: 4 y 5/);
  assert.match(R.dibujar(MOVIL, LT.estado(PASOS, 3)), />72 m ✓</);
  assert.ok(!/✓/.test(R.dibujar(UNION, LT.estado(PASOS, 3))), 'sin respuesta numérica no hay marca');
});

test('cada paso deja su rastro y no adelanta el siguiente', () => {
  const s1 = R.dibujar(COTAS, LT.estado(PASOS, 1)), s2 = R.dibujar(COTAS, LT.estado(PASOS, 2));
  assert.match(s1, />x &gt; 3,5</); assert.ok(!/>x &lt; 6</.test(s1));
  assert.match(s2, /x &gt; 3,5/); assert.match(s2, /x &lt; 6/); assert.ok(!/>enteros/.test(s2), 'el aria-label sí lo nombra; el dibujo todavía no');
  assert.match(s2, /kit-nuevo/);
  assert.ok(!/kit-nuevo/.test(R.dibujar(COTAS, { corte: 0, marca: 2 })), 'antes de responder nada se anima');
});

test('extremos: cerrado lleno, abierto hueco', () => {
  const s = R.dibujar(UNION, { corte: 2 });
  assert.match(s, /r="5" fill="var\(--c-i\)"/, 'k ≤ −2 tiene el extremo lleno');
  assert.match(s, /r="5" fill="var\(--card\)" stroke="var\(--c-i\)"/, 'k > 3 tiene el extremo hueco');
});

test('ida y vuelta: el mismo paso da el mismo SVG, venga de donde venga', () => {
  const fantasmas = [{ marca: 4, rotulo: 'redondeando' }, { elementos: [{ tipo: 'intervalo', a: -2, b: 3, ca: true, cb: false }], rotulo: 'al revés' }];
  for (const d of [COTAS, UNION, MOVIL]) for (const fantasma of fantasmas) {
    const ida = [1, 2, 3].map(i => R.dibujar(d, LT.estado(PASOS, i, { fantasma })));
    const vuelta = [3, 2, 1].map(i => R.dibujar(d, LT.estado(PASOS, i, { fantasma }))).reverse();
    assert.deepEqual(ida, vuelta);
  }
});

test('sin NaN, undefined ni colores fijos; texto de 14 o más; el alto no cambia entre estados', () => {
  const estados = [{}, { corte: 0, marca: 0 }, { corte: 0, marca: 1e9 }, { corte: 0, marca: -50 }, { corte: 1 }, { corte: 2 },
    { corte: 3, final: true, fantasma: { marca: 4, rotulo: 'redondeando' } }, { corte: 9 }, { fantasma: { marca: NaN } },
    { corte: 3, fantasma: { elementos: [{ tipo: 'intervalo', a: null, b: 2, cb: true }, { tipo: 'punto', x: 5 }], rotulo: 'al revés' } }];
  for (const d of [COTAS, UNION, MOVIL]) {
    const altos = new Set();
    for (const e of estados) {
      const s = R.dibujar(d, e);
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
  for (const d of [COTAS, MOVIL]) {
    const c = R.controles(d).marca;
    for (const v of [c.min, (c.min + c.max) / 3, c.max]) assert.ok(Math.abs(c.deX(c.aX(v)) - v) < 1e-9);
    assert.ok(c.inicio >= c.min && c.inicio <= c.max);
    const v = (c.min + c.max) / 2, s = R.dibujar(d, { corte: 0, marca: v });
    assert.ok(s.includes(`x1="${Math.round(c.aX(v) * 100) / 100}"`), 'la línea de la marca pasa por aX(valor)');
    assert.ok(s.includes(c.texto(v)), 'la lectura en vivo está junto a la marca');
  }
  assert.equal(R.controles(UNION).marca, undefined, 'sin marca en los datos no hay arrastre');
});

test('los números de la recta no chocan: se ralean si no caben', () => {
  const d = { min: 0, max: 1000, paso: 10, variable: 'x' };
  const nums = [...R.dibujar(d, {}).matchAll(/class="kit-txt kit-num"[^>]*>([^<]+)</g)].map(m => m[1]);
  assert.ok(nums.length >= 3 && nums.length <= 11, `rótulos: ${nums.join(' ')}`);
});

test('alt cuenta la relación', () => {
  assert.equal(R.alt(COTAS), 'Recta de x de 0 a 8: x > 3,5; x < 6; enteros: 4 y 5');
  assert.match(R.dibujar(MOVIL, {}), /role="img" aria-label="Recta de x \(m\) de 0 m a 120 m/);
});
