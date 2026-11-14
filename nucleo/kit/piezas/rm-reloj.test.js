// Pruebas de la pieza «rm-reloj»: el horario avanza medio grado por minuto (a las 3:30 está a 105°), el minutero
// 6° por minuto, el arco es el ángulo menor, alto fijo, sin NaN ni colores fijos y texto de 14 o más.
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('./rm-reloj.js');

test('ángulos de las agujas', () => {
  assert.equal(P.angulos.horario(3, 30), 105);
  assert.equal(P.angulos.minutero(20), 120);
  assert.equal(P.angulos.horario(12, 0), 0);
});

test('la aguja horaria dibujada apunta a 105° a las 3:30', () => {
  const s = P.dibujar({ relojes: [{ h: 3, m: 30 }] });
  const m = s.match(/<line x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)" stroke="var\(--c-i\)" stroke-width="6"/);
  const ang = Math.atan2(+m[3] - +m[1], -(+m[4] - +m[2])) * 180 / Math.PI;
  assert.ok(Math.abs(ang - 105) < 0.5, String(ang));
});

test('limpio y alto fijo', () => {
  const altos = new Set();
  for (const d of [{ relojes: [{ h: 3, m: 20, arco: true, texto: '20°', rotulo: '3:20' }] }, { relojes: [{ h: 9, m: 0, fantasmaH: 3 }, { h: 10, m: 15, arco: true, texto: '142,5°' }] }]) {
    const s = P.dibujar(d, { corte: 1 });
    assert.ok(!/NaN|undefined|null|Infinity/.test(s));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
    for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14);
    altos.add(s.match(/viewBox="0 0 320 ([\d.]+)"/)[1]);
  }
  assert.equal(altos.size, 1);
  assert.match(P.alt({ relojes: [{ h: 3, m: 30 }] }), /horario en 105°/);
});

test('geometria: la punta del minutero cae donde se dibuja y angulo es su inversa', () => {
  const dr = { relojes: [{ h: 3, m: 20 }] };
  const g = P.geometria(dr), s = P.dibujar(dr);
  const p = g.punta(0, P.angulos.minutero(20), g.minutero);
  const [, x2, y2] = s.match(/<line x1="160" y1="100" x2="([\d.]+)" y2="([\d.]+)"[^>]*stroke-width="3"/) || [];
  assert.ok(Math.abs(+x2 - p.x) < 0.02 && Math.abs(+y2 - p.y) < 0.02, `${x2},${y2} vs ${p.x},${p.y}`);
  assert.ok(Math.abs(g.angulo(0, p.x, p.y) - 120) < 1e-9);
  const g2 = P.geometria({ relojes: [{ h: 1, m: 0 }, { h: 2, m: 0 }] });
  assert.equal(g2.relojes.length, 2);
  assert.ok(g2.relojes[1].cx > g2.relojes[0].cx);
});
