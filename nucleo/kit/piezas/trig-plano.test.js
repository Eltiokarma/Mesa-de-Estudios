// Pruebas de la pieza «trig-plano»: una sola escala para x e y, el rayo termina donde dice su ángulo (1 px), la
// espiral se abre con cada vuelta, el sentido del arco se respeta, cortes por paso, sin NaN ni colores fijos.
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('./trig-plano.js');

const base = (extra = {}) => Object.assign({ circulos: [{ r: 1 }] }, extra);

test('una sola escala: el círculo unitario mide lo mismo en x y en y', () => {
  const g = P.geometria({ ventana: { x: [-2, 2], y: [-1, 1] } });
  assert.ok(Math.abs((g.X(1) - g.X(0)) - (g.Y(0) - g.Y(1))) < 1e-9);
  const s = P.dibujar(base());
  const [, r] = s.match(/<circle[^>]* r="([\d.]+)"/);
  const k = P.geometria({}).k;
  assert.ok(Math.abs(+r - k) < 0.01);
});

test('fidelidad: el rayo de θ termina en (cos θ, sen θ) del dibujo, a 1 px', () => {
  const g = P.geometria({});
  for (const ang of [0, 30, 135, 210, -60, 400]) {
    const s = P.dibujar(base({ rayos: [{ ang, punta: false, color: 'o' }] }));
    const [, x2, y2] = s.match(/<line[^>]*x1="[\d.]+" y1="[\d.]+" x2="([\d.]+)" y2="([\d.]+)" stroke="var\(--c-o\)"/).map(Number);
    assert.ok(Math.abs(x2 - g.X(Math.cos(ang * Math.PI / 180))) <= 1, `θ = ${ang}`);
    assert.ok(Math.abs(y2 - g.Y(Math.sin(ang * Math.PI / 180))) <= 1, `θ = ${ang}`);
  }
});

test('el arco de más de una vuelta se abre en espiral; el negativo gira en sentido horario', () => {
  const g = P.geometria({});
  const d = s => s.match(/<path class="kit-aparece" d="M([^"]+)"/)[1].split('L').map(p => p.split(' ').map(Number));
  const una = d(P.dibujar(base({ arcos: [{ de: 0, a: 360, r: 0.3 }] })));
  const dos = d(P.dibujar(base({ arcos: [{ de: 0, a: 720, r: 0.3 }] })));
  const dist = p => Math.hypot(p[0] - g.X(0), p[1] - g.Y(0));
  assert.ok(dist(dos[dos.length - 1]) > dist(una[una.length - 1]) + 5);
  // Antihorario: el segundo punto queda arriba del eje (y de pantalla menor); horario, abajo.
  const pos = d(P.dibujar(base({ arcos: [{ de: 0, a: 90 }] }))), neg = d(P.dibujar(base({ arcos: [{ de: 0, a: -90 }] })));
  assert.ok(pos[3][1] < g.Y(0) && neg[3][1] > g.Y(0));
});

test('corte: lo de desde > corte no se ve; lo de desde = corte es nuevo', () => {
  const d = base({ rayos: [{ ang: 30, color: 'o', desde: 2 }], puntos: [{ x: 0.5, y: 0.5, color: 'i', desde: 1, rotulo: 'P' }] });
  assert.ok(!/var\(--c-o\)/.test(P.dibujar(d, { corte: 1 })));
  assert.ok(/kit-nuevo/.test(P.dibujar(d, { corte: 1 })));
  assert.ok(/var\(--c-o\)/.test(P.dibujar(d, { corte: 2 })));
  const h = base({ puntos: [{ x: 0, y: 1, color: 'i', hasta: 1 }] });
  assert.ok(/var\(--c-i\)/.test(P.dibujar(h, { corte: 1 })) && !/var\(--c-i\)/.test(P.dibujar(h, { corte: 2 })));
});

test('sin NaN, undefined ni colores fijos; texto de 14 o más; puro; alto fijo para unos datos', () => {
  const todo = {
    ventana: { x: [-3, 3], y: [-2, 2] }, numeros: 1,
    circulos: [{ r: 1 }, { cx: 1, cy: 0, r: 0.5, color: 'h', discontinua: true }],
    sectores: [{ de: 0, a: 60, r: 1 }, { de: 90, a: 120, r: 1.5, r0: 1, color: 'd' }],
    arcos: [{ de: 0, a: -450, rotulo: '−450°' }],
    rayos: [{ ang: 150, rotulo: 'θ', color: 'o' }],
    segmentos: [{ de: [0, 0], a: [0.5, 0.86], color: 'i', rotulo: 'sen θ' }],
    rectas: [{ y: 0.5, rotulo: 'y = 0,5' }, { x: -1 }],
    curvas: [{ puntos: [[-3, 0], [0, 1], null, [1, 1], [3, 2]], rotulo: 'f' }],
    puntos: [{ x: 1, y: 1, rotulo: 'A' }, { x: -1, y: 0, abierto: true }],
    rotulos: [{ x: 0, y: -1.5, texto: '1 rad' }],
  };
  const altos = new Set();
  for (const d of [todo, base(), { ventana: { x: [0, 10], y: [0, 4] }, ejes: false }]) {
    const s = P.dibujar(d, { corte: 3 });
    assert.equal(s, P.dibujar(d, { corte: 3 }));
    assert.ok(!/NaN|undefined|null|Infinity/.test(s));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
    assert.ok(!/<script|\son[a-z]+\s*=|\sid=/i.test(s));
    for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14);
    assert.ok(P.alt(d).length >= 15);
  }
  for (const corte of [0, 1, 5]) altos.add(P.dibujar(todo, { corte }).match(/viewBox="0 0 320 ([\d.]+)"/)[1]);
  assert.equal(altos.size, 1);
});

test('manijas: enPx y delPx son inversas, y anguloDe elige el coterminal cercano', () => {
  const d = { ventana: { x: [-3, 2], y: [-1, 4] } };
  const g = P.geometria(d);
  for (const [x, y] of [[0, 0], [-3, 4], [1.5, -0.5]]) {
    const px = P.enPx(d, x, y);
    assert.ok(Math.abs(px.x - g.X(x)) < 1e-9 && Math.abs(px.y - g.Y(y)) < 1e-9);
    const q = P.delPx(d, px);
    assert.ok(Math.abs(q.x - x) < 1e-9 && Math.abs(q.y - y) < 1e-9);
  }
  const u = {};
  const en = a => P.enPx(u, Math.cos(a * Math.PI / 180), Math.sin(a * Math.PI / 180));
  assert.ok(Math.abs(P.anguloDe(u, en(120)) - 120) < 1e-9);
  assert.ok(Math.abs(P.anguloDe(u, en(-90)) - 270) < 1e-9);
  assert.ok(Math.abs(P.anguloDe(u, en(700), { cerca: 690 }) - 700) < 1e-9);
  assert.ok(Math.abs(P.anguloDe(u, en(-200), { cerca: -180 }) + 200) < 1e-9);
  assert.ok(Math.abs(P.anguloDe(u, P.enPx(u, 1, 1), { cx: 1, cy: 0 }) - 90) < 1e-9);
});
