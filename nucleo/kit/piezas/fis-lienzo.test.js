// Pruebas de la pieza «fis-lienzo»: escala única (un metro mide lo mismo en x y en y), flechas proporcionales a su
// valor, alto fijo entre estados, rastro por pasos, nada de NaN ni colores fijos y texto de 14 o más.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./fis-lienzo.js');

const DCL = {
  vista: { x0: -4, x1: 4, y0: -3, y1: 4 }, escalaF: 3, alt: 'Bloque sobre el piso con su peso y la normal, iguales y opuestas.',
  poligonos: [{ puntos: [[-4, 0], [4, 0]], rayado: true }, { puntos: [[-1, 0], [1, 0], [1, 2], [-1, 2]], cerrado: true }],
  flechas: [{ de: [0, 1], d: [0, -20], color: 'd', rotulo: 'P' }, { de: [0, 1], d: [0, 20], color: 'o', rotulo: 'N', paso: 1 },
    { de: [0, 1], d: [10, 0], color: 'h', rotulo: 'F', paso: 2, hasta: 2 }],
  discos: [{ c: [3, 3], r: 0.5, rotulo: 'A' }], arcos: [{ c: [0, 0], r: 2, de: 0, a: 90, color: 'i', rotulo: '90°', paso: 1 }],
  segmentos: [{ de: [-3, 0], a: [-3, 3], color: 'i', texto: '3 m', discontinua: true }], textos: [{ en: [0, 3.5], texto: 'bloque' }],
  puntos: [{ x: 2, y: 1, color: 'i', rotulo: 'B', hueco: true }],
};

test('se registra en el kit', () => assert.equal(Kit.piezas['fis-lienzo'], P));

test('fidelidad: un metro mide lo mismo en x y en y, y la flecha del doble mide el doble', () => {
  const g = P.geometria(DCL);
  assert.ok(Math.abs((g.X(1) - g.X(0)) - (g.Y(0) - g.Y(1))) < 1e-9);
  const s = P.dibujar(DCL, { paso: 2 });
  const largo = c => { const m = s.match(new RegExp(`<line x1="([\\d.-]+)" y1="([\\d.-]+)" x2="([\\d.-]+)" y2="([\\d.-]+)" stroke="var\\(--c-${c}\\)" stroke-width="3"`)); return Math.hypot(m[3] - m[1], m[4] - m[2]); };
  // La línea termina dentro de la punta (10 + grosor) · 0,8 antes del extremo: se compara con esa corrección.
  const corr = (10 + 3) * 0.8;
  assert.ok(Math.abs((largo('d') + corr) - 2 * (largo('h') + corr)) < 1, 'P = 20 mide el doble que F = 10');
});

test('rastro por pasos: lo de paso ≤ p se ve; lo de «hasta» se va', () => {
  const s0 = P.dibujar(DCL, { paso: 0 }), s2 = P.dibujar(DCL, { paso: 2 }), s3 = P.dibujar(DCL, { paso: 3 });
  assert.ok(!/>N</.test(s0)); assert.match(s2, />N</); assert.match(s2, />F</);
  assert.ok(!/>F</.test(s3), 'F se fue después de su paso'); assert.match(s3, />N</);
});

test('puro, alto fijo, sin NaN ni colores fijos, texto de 14 o más', () => {
  const altos = new Set();
  for (const e of [{}, { paso: 1 }, { paso: 2 }, { paso: 9 }, { final: true }]) {
    const s = P.dibujar(DCL, e);
    assert.equal(s, P.dibujar(DCL, e));
    assert.ok(!/NaN|undefined|null|Infinity/.test(s));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
    assert.ok(!/<script|\son[a-z]+\s*=|\sid=/i.test(s));
    for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14);
    for (const [, c] of s.matchAll(/var\(--c-([a-z])\)/g)) assert.ok(['o', 'i', 'h', 'd'].includes(c));
    altos.add(s.match(/viewBox="0 0 320 ([\d.]+)"/)[1]);
  }
  assert.equal(altos.size, 1);
  assert.ok(P.alt(DCL).length >= 15);
  assert.ok(P.alt({ flechas: [{ de: [0, 0], d: [1, 0], rotulo: 'F' }] }).length >= 15);
});
