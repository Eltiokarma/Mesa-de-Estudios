// Pruebas de la pieza «torre»: la pelota se apoya donde la regla dice (dentro de 1 px), la flecha de g no cambia
// entre estados (tampoco en la cima, con v = 0), nada de NaN ni colores fijos, texto de 14 o más y alto fijo.
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('./torre.js');

const una = (y, v) => ({ alto: 20, pelotas: [{ y, v, marcas: [0, 8.75, 15] }] });

test('fidelidad: el punto más bajo de la pelota cae sobre la rayita de su altura (1 px)', () => {
  for (const y of [0, 3.5, 8.75, 15, 20]) {
    const s = P.dibujar(una(y, 0));
    const [, cy, r] = s.match(/kit-pelota-0"><circle cx="[\d.]+" cy="([\d.]+)" r="(\d+)"/).map(Number);
    assert.ok(Math.abs(cy + r - P.escala(una(y), y)) <= 1, `y = ${y}`);
  }
});

test('la flecha de g es la misma subiendo, en la cima y bajando', () => {
  const g = s => [...s.matchAll(/<g><line [^>]*stroke="var\(--c-d\)"[^>]*\/>/g)].map(m => m[0].replace(/[xy][12]="[\d.]+"/g, ''));
  const subiendo = g(P.dibujar(una(10, 12))), cima = g(P.dibujar(una(20, 0))), bajando = g(P.dibujar(una(10, -12)));
  assert.equal(subiendo.length, 1);
  assert.deepEqual(cima, subiendo); assert.deepEqual(bajando, subiendo);
  // En la cima no hay flecha de v (es cero), pero sí la de g.
  assert.ok(!/var\(--c-h\)/.test(P.dibujar(una(20, 0))));
});

test('sin NaN, undefined ni colores fijos; texto de 14 o más; el alto no cambia', () => {
  const altos = new Set();
  for (const d of [una(0, 20), una(20, 0), { alto: 20, pelotas: [{ y: 20, rotulo: '1 kg' }, { y: 20, rotulo: '5 kg', grande: true }] }, { alto: 20 }]) {
    const s = P.dibujar(d);
    assert.ok(!/NaN|undefined|null|Infinity/.test(s));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
    assert.ok(!/<script|\son[a-z]+\s*=|\sid=/i.test(s));
    for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14);
    for (const [, c] of s.matchAll(/var\(--c-([a-z])\)/g)) assert.ok(['i', 'h', 'd'].includes(c));
    altos.add(s.match(/viewBox="0 0 320 ([\d.]+)"/)[1]);
  }
  assert.equal(altos.size, 1);
  assert.match(P.alt(una(20, 0)), /g es igual en todo momento/);
});
