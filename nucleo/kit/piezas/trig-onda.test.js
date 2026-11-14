// Pruebas de la pieza «trig-onda»: las marcas de π van en su valor real, la llave de un periodo mide lo que dice,
// la curva se corta en null y se recorta al borde del plano, cortes por paso, sin NaN ni colores fijos, puro.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./trig-onda.js');

const PI = Math.PI;
const muestra = (fn, a, b, n = 120) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });

test('se registra en el catálogo del kit', () => {
  assert.equal(Kit.piezas['trig-onda'], P);
});

test('rótulos de π: fracciones simplificadas y con signo', () => {
  assert.equal(P.piTexto(1, 2), 'π/2');
  assert.equal(P.piTexto(2, 2), 'π');
  assert.equal(P.piTexto(3, 2), '3π/2');
  assert.equal(P.piTexto(4, 2), '2π');
  assert.equal(P.piTexto(-1, 4), '−π/4');
  assert.equal(P.piTexto(0, 2), '0');
  const s = P.dibujar({ x: { min: 0, max: 2 * PI, cada: 2 }, y: { min: -1, max: 1 } });
  for (const t of ['π/2', 'π', '3π/2', '2π']) assert.ok(s.includes(`>${t}<`), t);
});

test('fidelidad: la marca de π está donde x = 3,14…, y la llave de un periodo mide el periodo', () => {
  const d = { x: { min: 0, max: 2 * PI, cada: 2 }, y: { min: -1.5, max: 1.5 }, periodos: [{ de: 0, a: PI, y: 1.2, rotulo: 'T = π', color: 'h' }] };
  const g = P.geometria(d), s = P.dibujar(d);
  const m = s.match(/x="([\d.]+)" y="[\d.]+" fill="currentColor" font-size="\d+" text-anchor="middle"[^>]*>π</);
  assert.ok(m && Math.abs(+m[1] - g.X(PI)) < 1);
  const [, x1, x2] = s.match(/<line x1="([\d.]+)" y1="[\d.]+" x2="([\d.]+)" y2="[\d.]+" stroke="var\(--c-h\)"/).map(Number);
  assert.ok(Math.abs(Math.abs(x2 - x1) - (g.X(PI) - g.X(0))) < 1);
  assert.match(s, />T = π</);
});

test('la tangente: null corta la curva y lo que sale del plano se recorta al borde', () => {
  const pts = [];
  for (const [a, b] of [[-PI / 2, PI / 2], [PI / 2, 3 * PI / 2]]) { pts.push(...muestra(Math.tan, a + 0.01, b - 0.01, 60)); pts.push(null); }
  const d = { x: { min: -PI / 2, max: 3 * PI / 2 }, y: { min: -3, max: 3 }, curvas: [{ puntos: pts, color: 'o' }], asintotas: [{ x: PI / 2 }] };
  const g = P.geometria(d), s = P.dibujar(d);
  const camino = s.match(/<path class="kit-aparece" d="([^"]+)"/)[1];
  const ys = [...camino.matchAll(/[ML]([\d.-]+) ([\d.-]+)/g)].map(m => +m[2]);
  assert.ok(Math.min(...ys) >= g.Y(3) - 0.01 && Math.max(...ys) <= g.Y(-3) + 0.01, 'nada fuera del plano');
  assert.ok((camino.match(/M/g) || []).length >= 2, 'una rama por intervalo');
  assert.match(s, /stroke-dasharray="4 5"/);   // la asíntota
});

test('corte: lo de desde > corte no se ve; lo de desde = corte es nuevo; hasta lo retira', () => {
  const d = { curvas: [{ puntos: muestra(Math.sin, 0, 2 * PI), color: 'o', desde: 2 }], puntos: [{ x: PI / 2, y: 1, color: 'i', desde: 1, hasta: 1 }] };
  assert.ok(!/var\(--c-o\)/.test(P.dibujar(d, { corte: 1 })));
  assert.ok(/kit-nuevo/.test(P.dibujar(d, { corte: 1 })));
  assert.ok(/var\(--c-o\)/.test(P.dibujar(d, { corte: 2 })));
  assert.ok(!/var\(--c-i\)/.test(P.dibujar(d, { corte: 2 })));
});

test('sin NaN, undefined ni colores fijos; texto de 14 o más; puro; alto fijo para unos datos', () => {
  const todo = {
    x: { min: -PI, max: 2 * PI, cada: 4 }, y: { min: -3, max: 3, paso: 1, nombre: 'f(x)' },
    curvas: [{ puntos: [...muestra(x => 2 * Math.sin(x), -PI, 2 * PI), null, [0, 9], [1, -9]], color: 'h', rotulo: '2 sen x' }, { puntos: muestra(Math.cos, 0, PI), discontinua: true }],
    asintotas: [{ x: PI / 2 }, { x: 10 }], rectas: [{ y: 1, color: 'd', rotulo: 'y = 1' }, { y: 9 }],
    periodos: [{ de: 0, a: 2 * PI, y: 2.5, rotulo: 'T = 2π', color: 'h' }], franjas: [{ de: 0, a: PI, color: 'i' }, { eje: 'y', de: -1, a: 1, color: 'h' }],
    puntos: [{ x: PI / 2, y: 2, color: 'h', rotulo: 'máx' }, { x: 0, y: 0, abierto: true }, { x: 0, y: 99 }],
  };
  const altos = new Set();
  for (const d of [todo, {}, { x: { min: 0, max: PI } }]) {
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

test('franja horizontal: cubre de y = −1 a y = 1, de borde a borde', () => {
  const d = { x: { min: 0, max: 2 * PI }, y: { min: -3, max: 3 }, franjas: [{ eje: 'y', de: -1, a: 1, color: 'h' }] };
  const g = P.geometria(d), s = P.dibujar(d);
  const [, y, h] = s.match(/<rect class="kit-aparece" x="[\d.]+" y="([\d.]+)" width="[\d.]+" height="([\d.]+)"/).map(Number);
  assert.ok(Math.abs(y - g.Y(1)) < 0.6 && Math.abs(y + h - g.Y(-1)) < 0.6);
});

test('manijas: xDe y yDe invierten X e Y', () => {
  const g = P.geometria({ x: { min: -PI, max: 3 * PI }, y: { min: -2, max: 3 } });
  for (const v of [-PI, 0, 1.3, 3 * PI]) assert.ok(Math.abs(g.xDe(g.X(v)) - v) < 1e-9);
  for (const v of [-2, 0, 0.7, 3]) assert.ok(Math.abs(g.yDe(g.Y(v)) - v) < 1e-9);
});
