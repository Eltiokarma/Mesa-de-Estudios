// Pruebas de la pieza «fis-banco-optico»: los rayos principales (o sus prolongaciones) se cruzan en la imagen que da
// 1/f = 1/do + 1/di, en lentes y espejos, reales y virtuales; sin NaN ni colores fijos, texto de 14 o más, alto fijo.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./fis-banco-optico.js');

const imagen = (f, d0, h) => { const di = 1 / (1 / f - 1 / d0); return { d: di, h: -h * di / d0 }; };
// Cruce de dos rectas dadas por dos puntos cada una.
function cruce([a, b], [c, e]) {
  const d1 = [b[0] - a[0], b[1] - a[1]], d2 = [e[0] - c[0], e[1] - c[1]], den = d1[0] * d2[1] - d1[1] * d2[0];
  const t = ((c[0] - a[0]) * d2[1] - (c[1] - a[1]) * d2[0]) / den;
  return [a[0] + t * d1[0], a[1] + t * d1[1]];
}

test('se registra en el kit', () => assert.equal(Kit.piezas['fis-banco-optico'], P));

test('fidelidad: los rayos salientes se cruzan en la imagen (lentes y espejos, reales y virtuales)', () => {
  const casos = [['lente', 10, 30], ['lente', 10, 5], ['lente', -10, 20], ['espejo', 10, 30], ['espejo', 10, 6], ['espejo', -10, 15]];
  for (const [tipo, f, d0] of casos) {
    const h = 3, im = imagen(f, d0, h);
    const d = { tipo, f, alcance: 40, alto: 10, objeto: { d: d0, h }, imagen: im, rayos: ['paralelo', 'centro'] };
    const [r1, r2] = P.rayos(d);
    const sal = r => r[r.length - 2]; // el tramo que sale del elemento (antes de su prolongación)
    const p = cruce([sal(r1).de, sal(r1).a], [sal(r2).de, sal(r2).a]);
    const xi = tipo === 'lente' ? im.d : -im.d;
    assert.ok(Math.abs(p[0] - xi) < 1e-6 && Math.abs(p[1] - im.h) < 1e-6, `${tipo} f = ${f}, do = ${d0}: cruce ${p} y imagen ${xi}, ${im.h}`);
  }
});

test('espejo plano: la imagen queda tan atrás como el objeto adelante', () => {
  const d = { tipo: 'espejo-plano', alcance: 20, alto: 6, objeto: { d: 8, h: 3 }, imagen: { d: -8, h: 3 }, rayos: ['paralelo', 'centro'] };
  const [r1, r2] = P.rayos(d);
  const p = cruce([r1[2].de, r1[2].a], [r2[2].de, r2[2].a]);
  assert.ok(Math.abs(p[0] - 8) < 1e-6 && Math.abs(p[1] - 3) < 1e-6);
});

test('sin NaN ni hex; texto de 14 o más; alto fijo; puro', () => {
  const altos = new Set();
  const ds = [
    { tipo: 'lente', f: 10, alcance: 40, alto: 8, objeto: { d: 30, h: 4 }, imagen: imagen(10, 30, 4), rayos: ['paralelo', 'centro', 'foco'], rotulos: { o: 'do', i: 'di', f: 'f = 10 cm' } },
    { tipo: 'lente', f: 10, alcance: 30, alto: 8, objeto: { d: 25, h: 4 }, imagen: imagen(10, 25, 4), tapa: true },
    { tipo: 'lente', f: 12, alcance: 30, alto: 6, haz: [4, 2, -2, -4], grosor: 1 },
    { tipo: 'espejo', f: -10, alcance: 30, alto: 8, objeto: { d: 20, h: 4 }, imagen: imagen(-10, 20, 4), rayos: ['paralelo', 'centro', 'foco'] },
    { tipo: 'espejo-plano', alcance: 20, alto: 6, objeto: { d: 8, h: 3 }, imagen: { d: -8, h: 3 }, rayos: ['paralelo', 'centro'] },
    { tipo: 'lente', f: 10, alcance: 30 },
  ];
  for (const d of ds) for (const paso of [undefined, 1, 2, 3]) {
    const s = P.dibujar(d, { paso });
    assert.ok(!/NaN|undefined|Infinity/.test(s), JSON.stringify(d));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
    for (const m of s.matchAll(/font-size="(\d+)"/g)) assert.ok(+m[1] >= 14);
    altos.add(s.match(/viewBox="0 0 320 (\d+)"/)[1]);
    assert.equal(s, P.dibujar(d, { paso }));
    assert.ok(P.alt(d).length > 20);
  }
  assert.equal(altos.size, 1);
});
