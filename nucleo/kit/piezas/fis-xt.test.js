// Pruebas de la pieza «fis-xt» (18 nov): la gráfica posición–tiempo junto a la combi. Cada punto cae donde dicen sus
// números, un punto por segundo, el instante corta la línea, el escalón mide lo que debe, dos altos fijos (con avenida y
// sin ella), rótulos que caben con 4 de margen y no se pisan, puro, sin NaN ni colores fijos, dibujo de prueba.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./fis-xt.js');
const { W, H_SOLO, H_CON } = P.constantes;
const pisa = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
const AV = { min: -100, max: 100, paso: 10, numero: 50, signo: true, segundos: 0, rotulos: false, fantasmas: false, lugares: [{ en: 0, texto: 'Paradero', lado: 'izq' }, { en: 60, texto: 'Grifo' }] };
const MUESTRAS = [];
for (const v of [-20, -5, 0, 10, 20]) for (const t of [0, 1.5, 5]) {
  MUESTRAS.push({ avenida: Object.assign({}, AV, { x0: 0, v }), t: { max: 5, paso: 1 }, x: { min: -100, max: 100, paso: 25, numero: 50 },
    lineas: [{ puntos: [[0, 0], [5, 5 * v]], segundos: true }], puntos: [{ t: 4, x: 60, texto: 'Grifo', marca: 'aro', lado: 'izq' }], instante: t });
}
MUESTRAS.push(
  { t: { max: 7, paso: 1 }, x: { min: 0, max: 60, paso: 10, numero: 20 }, lineas: [{ puntos: [[0, 18], [7, 46]] }],
    puntos: [{ t: 2, x: 26, texto: '(2 s; 26 m)', lado: 'arribaIzq' }, { t: 5, x: 38, texto: '(5 s; 38 m)', lado: 'abajoDer' }, { t: 0, x: 18, texto: 'x₀ = 18 m', color: 'f', lado: 'abajoDer' }],
    escalon: { de: [2, 26], a: [5, 38], dt: 'Δt = 3 s', dx: 'Δx = 12 m', dxPie: true } },
  { t: { max: 20, paso: 5 }, x: { min: 0, max: 200, paso: 25, numero: 50 }, lineas: [{ puntos: [[0, 0], [20, 200]], rotulo: 'combi', rotuloEn: 6, rotuloLado: 'abajo' },
    { puntos: [[0, 60], [20, 180]], trazo: 'discontinua', rotulo: 'mototaxi', rotuloEn: 6 }], puntos: [{ t: 15, x: 150, texto: '(15 s; 150 m)', color: 'f', lado: 'arribaIzq' }] },
  { t: { max: 6, paso: 1 }, x: { min: 0, max: 60, paso: 10, numero: 20 }, lineas: [{ puntos: [[0, 0], [5, 40]], rotulo: 'A' }, { puntos: [[0, 50], [5, 42]], trazo: 'discontinua', rotulo: 'B' }] },
  { t: { max: 11, paso: 2, nombre: 't (min)' }, x: { min: 0, max: 8, paso: 1, numero: 2, nombre: 'x (km)' }, lineas: [{ puntos: [[0, 0], [10, 6]] }] },
);

test('registrada en el kit', () => assert.equal(Kit.piezas['fis-xt'], P));

test('cada punto cae donde dicen sus números, un punto por segundo y el instante corta la línea', () => {
  const d = MUESTRAS[11], g = P.geometria(d);   // v = 10 m/s, a los 5 s
  assert.equal(d.lineas[0].puntos[1][1], 50);
  assert.equal(g.lineas[0].segundos.length, 6, 'a los 0, 1, 2, 3, 4 y 5 s');
  for (const [t, x] of g.lineas[0].segundos) assert.ok(Math.abs(x - 10 * t) < 1e-9);
  assert.ok(Math.abs(g.Y(50) - g.Y(0) + (50 / 200) * (g.bot - g.top)) < 1e-9, 'la escala vertical es lineal');
  const a = P.geometria(Object.assign({}, d, { instante: 2.5 }));
  assert.deepEqual(a.lineas[0].pts[a.lineas[0].pts.length - 1], [2.5, 25], 'la línea llega solo hasta el instante');
  assert.equal(a.lineas[0].segundos.length, 3);
  assert.equal(a.ahora.length, 1);
  // El escalón: su tramo horizontal mide Δt y el vertical Δx, en la misma escala de los ejes.
  const e = P.geometria(MUESTRAS[15]).escalon, ge = P.geometria(MUESTRAS[15]);
  assert.ok(Math.abs(e.bx - e.ax - (ge.X(5) - ge.X(2))) < 1e-9 && Math.abs(e.ay - e.by - (ge.Y(26) - ge.Y(38))) < 1e-9);
  // Dos móviles: el mismo violeta, trazo distinto.
  const s = P.dibujar(MUESTRAS[16]);
  assert.equal((s.match(/stroke="var\(--c-f\)" stroke-width="3"/g) || []).length, 2);
  assert.equal((s.match(/stroke-dasharray="8 6"/g) || []).length, 1);
  assert.match(P.dibujar(MUESTRAS[18]), />t \(min\)</);
});

test('alto fijo con avenida y sin ella; rótulos que caben con 4 de margen y no se pisan', () => {
  for (const d of MUESTRAS) {
    const s = P.dibujar(d), g = P.geometria(d), H = d.avenida ? H_CON : H_SOLO, donde = JSON.stringify(d).slice(0, 120);
    assert.equal(s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)[2], String(H), donde);
    for (const r of g.rotulos) assert.ok(r.x0 >= 4 - 1e-9 && r.x1 <= W - 4 + 1e-9 && r.y0 >= 4 && r.y1 <= H - 4, `${donde}: «${r.texto}» se sale`);
    for (let i = 0; i < g.rotulos.length; i++) for (let j = i + 1; j < g.rotulos.length; j++) assert.ok(!pisa(g.rotulos[i], g.rotulos[j]), `${donde}: «${g.rotulos[i].texto}» pisa «${g.rotulos[j].texto}»`);
  }
});

test('sin NaN ni colores fijos, pura, dibujo de prueba, con la avenida de fis-combi arriba y texto alternativo', () => {
  for (const d of MUESTRAS) {
    const s = P.dibujar(d);
    assert.ok(!/NaN|undefined|Infinity/.test(s));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
    assert.equal(s, P.dibujar(d));
    assert.match(s, /data-prueba="si" class="fis-xt"/);
    if (d.avenida) assert.match(s, /class="fis-avenida"/);
    assert.ok(P.alt(d).length > 40 && !/NaN|undefined/.test(P.alt(d)));
  }
  // la posición es violeta y el tiempo turquesa, también en los nombres de los ejes
  const s = P.dibujar(MUESTRAS[15]);
  assert.match(s, /fill="var\(--c-f\)"[^>]*>x \(m\)</);
  assert.match(s, /fill="var\(--c-i\)"[^>]*>t \(s\)</);
  assert.match(s, /fill="var\(--c-i\)"[^>]*>Δt = 3 s</);
  assert.match(s, /fill="var\(--c-f\)"[^>]*>Δx = 12 m</);
});
