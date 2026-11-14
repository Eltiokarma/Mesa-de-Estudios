// Pruebas de la pieza «fis-interfaz»: cada rayo sale con el ángulo pedido (medido en el SVG), sin NaN ni colores
// fijos, texto de 14 o más, alto fijo, pura; con reflexión total no hay rayo hacia abajo.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./fis-interfaz.js');

const D = { n1: 1, n2: 1.33, nombre1: 'aire', nombre2: 'agua', t1: 53, t2: 37, reflejado: true, rotulos: { t1: '53°', t2: '37°', r: '53°' } };
const TOT = { n1: 1.33, n2: 1, nombre1: 'agua', nombre2: 'aire', t1: 60, t2: null, critico: 48.6, rotulos: { t1: '60°', c: 'θc' } };
const lineas = (s, c) => [...s.matchAll(new RegExp(`<line x1="([\\d.-]+)" y1="([\\d.-]+)" x2="([\\d.-]+)" y2="([\\d.-]+)" stroke="var\\(--c-${c}\\)" stroke-width="3"`, 'g'))].map(m => m.slice(1).map(Number));

test('se registra en el kit', () => assert.equal(Kit.piezas['fis-interfaz'], P));

test('fidelidad: el incidente y el refractado forman con la normal los ángulos pedidos', () => {
  const s = P.dibujar(D, {});
  const ang = ([x1, y1, x2, y2]) => Math.atan2(Math.abs(x2 - x1), Math.abs(y2 - y1)) * 180 / Math.PI;
  assert.ok(Math.abs(ang(lineas(s, 'o')[0]) - 53) < 0.5);
  assert.ok(Math.abs(ang(lineas(s, 'i')[0]) - 37) < 0.5);
});

test('reflexión total: ningún rayo baja del centro', () => {
  const s = P.dibujar(TOT, {}), { CY } = P.constantes;
  for (const c of ['o', 'i']) for (const l of lineas(s, c)) assert.ok(l[1] <= CY + 0.5 && l[3] <= CY + 0.5);
});

test('sin NaN ni hex; texto de 14 o más; alto fijo; puro', () => {
  const altos = new Set();
  for (const d of [D, TOT, { t1: 0, t2: 0 }]) for (const paso of [undefined, 1, 2, 3]) {
    const s = P.dibujar(d, { paso });
    assert.ok(!/NaN|undefined|Infinity/.test(s));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
    for (const m of s.matchAll(/font-size="(\d+)"/g)) assert.ok(+m[1] >= 14);
    altos.add(s.match(/viewBox="0 0 320 (\d+)"/)[1]);
    assert.equal(s, P.dibujar(d, { paso }));
    assert.ok(P.alt(d).length > 20);
  }
  assert.equal(altos.size, 1);
});
