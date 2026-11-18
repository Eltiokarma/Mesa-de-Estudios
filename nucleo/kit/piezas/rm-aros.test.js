// Pruebas de la pieza «rm-aros»: las comunes de las piezas de la unidad (rm-pruebas.js: limpia, pura, de alto fijo, todo
// dentro del lienzo con 4 de margen y ningún rótulo encima de otro ni de un trazo, con números), en las muestras de abajo y
// en todas las figuras de la teoría que la usan. Además: los papeles de color y la ida y vuelta entre el piso y la figura.
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('./rm-aros.js');
const R = require('./rm-pruebas.js');

const B = { nombre: 'banda', papel: 'medio', x: 4.0, y: 4.6, r: 3.7, en: [1.3, 1.75] }, Q = { nombre: 'quenistas', papel: 'primero', x: 2.7, y: 5.0, r: 1.7, en: [2.2, 7.15] };
const MUESTRAS = [
  { escena: 'patio', aros: [B, Q], ninos: [[2, 5.6], [5.3, 2.4]] },
  { escena: 'patio', aros: [B, Q, { nombre: 'diablada', papel: 'segundo', x: 9, y: 1.6, r: 0.9, en: [9, 3.1], cumple: false }], ninos: [[9, 1.6]], nota: 'No cumple' },
  { diagramas: [{ titulo: 'Dibujo 1', aros: [{ nombre: 'banda', papel: 'medio', x: 4.6, y: 3.2, r: 2.6, en: [4.6, 6.4] }] }, { titulo: 'Dibujo 2', desde: 2, cumple: false, aros: [] }], alto: 7, nota: [{ t: 'Uno', desde: 1 }] },
  { diagramas: [{ aros: [{ nombre: 'ajedrecistas', papel: 'primero', x: 3, y: 3.2, r: 2, en: [3, 3.2] }, { nombre: 'nadadores', papel: 'segundo', x: 7.5, y: 3.2, r: 1.6, en: [7.5, 5.6] }] }], alto: 6.4 },
];
const TODAS = MUESTRAS.map((d, k) => ({ donde: `muestra ${k + 1}`, datos: d, estado: {} })).concat(R.deLaTeoria('rm-aros'));
R.comunes(P, TODAS, { minTeoria: 300 });

test('papeles: el primer grupo en naranja, el segundo en turquesa, el del medio en tinta; el que no cumple, gris y punteado', () => {
  assert.deepEqual(P.PAPELES, { primero: 'o', segundo: 'i', medio: 'tinta', noCumple: 'tenue' });
  for (const { donde, datos } of TODAS) {
    const s = P.dibujar(datos, { corte: 9 });
    for (const [m] of s.matchAll(/<(?:ellipse|circle)[^>]*data-aro="(\w+)"[^>]*>/g)) {
      const papel = m.match(/data-aro="(\w+)"/)[1];
      if (/stroke-dasharray/.test(m)) { assert.match(m, /stroke="currentColor"/, donde); continue; }
      assert.match(m, papel === 'primero' ? /stroke="var\(--c-o\)"/ : papel === 'segundo' ? /stroke="var\(--c-i\)"/ : /stroke="currentColor"/, `${donde}: ${papel}`);
    }
    for (const [m] of s.matchAll(/<g data-cumple="no"[^>]*>/g)) assert.match(m, /opacity="0.55"/, donde);
    assert.ok(!/var\(--c-[fdh]\)/.test(s), donde);
  }
});

test('del piso del patio a la figura y de vuelta (la manija cae donde está el aro)', () => {
  for (const [x, y] of [[0, 0], [4, 4.6], [9, 1.6]]) {
    const p = P.patioPiso(P.patioPx(x, y));
    assert.ok(Math.abs(p.x - x) < 1e-9 && Math.abs(p.y - y) < 1e-9);
  }
  const d = MUESTRAS[3], q = P.vennPiso(d, 0, P.vennPx(d, 0, 7.5, 3.2));
  assert.ok(Math.abs(q.x - 7.5) < 1e-9 && Math.abs(q.y - 3.2) < 1e-9);
});

test('ningún nombre de aro queda montado sobre la línea de un aro (diagramas de Venn de la teoría; lector en frío, 17 nov)', () => {
  const T = require('../trazo.js');
  for (const { donde, datos } of TODAS) {
    if (datos.escena) continue;
    const g = P.geometria(datos);
    (datos.diagramas || []).forEach((D, i) => {
      const circ = (D.aros || []).map(a => { const c = P.vennPx(datos, i, a.x, a.y); return { a, x: c.x, y: c.y, r: a.r * g.esc }; });
      for (const C of circ) {
        if (!C.a.nombre || !C.a.en) continue;
        const w = T.ancho(C.a.nombre, 14, 700), p = P.vennPx(datos, i, C.a.en[0], C.a.en[1]);
        const b = { x0: p.x - w / 2, x1: p.x + w / 2, y0: p.y + 5 - 14 * 0.8, y1: p.y + 5 + 14 * 0.25 };
        for (const K of circ) {
          const nx = Math.max(b.x0, Math.min(K.x, b.x1)), ny = Math.max(b.y0, Math.min(K.y, b.y1)), dmin = Math.hypot(nx - K.x, ny - K.y);
          const dmax = Math.max(...[[b.x0, b.y0], [b.x1, b.y0], [b.x0, b.y1], [b.x1, b.y1]].map(([x, y]) => Math.hypot(x - K.x, y - K.y)));
          assert.ok(!(dmin < K.r + 2 && dmax > K.r - 2), `${donde}: «${C.a.nombre}» sobre la línea del aro ${K.a.nombre}`);
        }
      }
    });
  }
});
