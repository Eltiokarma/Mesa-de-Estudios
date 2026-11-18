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

// Lector en frío, ronda 2 (18 nov): «quenistas» quedaba fuera de la banda, «cantantes» dentro de ajedrecistas y lejos de
// su aro, y un aro llegaba justo al borde de otro. En toda figura de la teoría (no en el laboratorio, donde el alumno
// mueve los aros a su gusto), cada nombre va dentro de su aro y fuera de los que no lo contienen, o afuera de todos los
// aros, a 10 px o menos del suyo y más cerca de él que de cualquier otro; y entre dos aros hay 6 px o más de holgura.
test('cada nombre queda pegado a su aro y no dentro de un aro que no es el suyo; ningún aro queda al borde de otro', () => {
  const T = require('../trazo.js');
  let n = 0;
  for (const { donde, datos } of TODAS) {
    if (datos.escena || /mesa |^muestra/.test(donde)) continue;
    const g = P.geometria(datos);
    (datos.diagramas || []).forEach((D, i) => {
      const circ = (D.aros || []).map(a => { const c = P.vennPx(datos, i, a.x, a.y); return { a, x: c.x, y: c.y, r: a.r * g.esc }; });
      const contiene = (K, A) => Math.hypot(K.x - A.x, K.y - A.y) + A.r <= K.r + 1e-6;
      for (const A of circ) for (const K of circ) if (A !== K && A.r <= K.r) {
        const d = Math.hypot(K.x - A.x, K.y - A.y);
        assert.ok(Math.abs(K.r - (d + A.r)) >= 6 && Math.abs(d - (A.r + K.r)) >= 6, `${donde}: «${A.a.nombre}» llega justo al borde de «${K.a.nombre}»`);
      }
      for (const C of circ) {
        if (!C.a.nombre) continue;
        assert.ok(C.a.en, `${donde}: «${C.a.nombre}» sin lugar`);
        n++;
        const w = T.ancho(C.a.nombre, 14, 700), p = P.vennPx(datos, i, C.a.en[0], C.a.en[1]);
        const b = { x0: p.x - w / 2, x1: p.x + w / 2, y0: p.y + 5 - 14 * 0.8, y1: p.y + 5 + 14 * 0.25 };
        const ds = circ.map(K => { const nx = Math.max(b.x0, Math.min(K.x, b.x1)), ny = Math.max(b.y0, Math.min(K.y, b.y1));
          return { K, dmin: Math.hypot(nx - K.x, ny - K.y), dmax: Math.max(...[[b.x0, b.y0], [b.x1, b.y0], [b.x0, b.y1], [b.x1, b.y1]].map(([x, y]) => Math.hypot(x - K.x, y - K.y))) }; });
        const yo = ds.find(z => z.K === C), dentro = z => z.dmax <= z.K.r - 2, fuera = z => z.dmin >= z.K.r + 2;
        if (dentro(yo)) {
          for (const z of ds) if (z.K !== C) assert.ok(fuera(z) || (dentro(z) && contiene(z.K, C)), `${donde}: «${C.a.nombre}» dentro de «${z.K.a.nombre}»`);
        } else {
          for (const z of ds) assert.ok(fuera(z), `${donde}: «${C.a.nombre}» queda dentro de «${z.K.a.nombre}» y fuera del suyo`);
          const gap = yo.dmin - C.r;
          assert.ok(gap <= 10, `${donde}: «${C.a.nombre}» lejos de su aro (${gap.toFixed(1)} px)`);
          for (const z of ds) if (z.K !== C) assert.ok(z.dmin - z.K.r > gap + 3, `${donde}: «${C.a.nombre}» más cerca de «${z.K.a.nombre}» que del suyo`);
        }
      }
    });
  }
  assert.ok(n > 1000, `${n} nombres revisados`);
});

// Lector en frío, ronda 2 (18 nov): «hay muñequitos parados justo sobre la línea del aro». En el patio, cada alumno
// (de los pies a la cabeza, con los brazos) queda entero dentro o entero fuera de cada aro, con 3 px de holgura.
test('ningún alumno del patio toca la línea de un aro', () => {
  const { NINO_ALTO, NINO_MEDIO } = P.constantes;
  let n = 0;
  for (const { donde, datos } of TODAS) {
    if (datos.escena !== 'patio' || /^muestra/.test(donde)) continue;
    const aros = (datos.aros || []).map(a => { const c = P.patioPx(a.x, a.y); return { a, cx: c.x, cy: c.y, rx: a.r * 29.2, ry: a.r * 17 }; });
    const val = (E, x, y, d) => ((x - E.cx) / (E.rx + d)) ** 2 + ((y - E.cy) / (E.ry + d)) ** 2;
    for (const [x, y] of datos.ninos || []) {
      const p = P.patioPx(x, y), pts = [];
      for (let u = -NINO_MEDIO - 1; u <= NINO_MEDIO + 1.001; u += (NINO_MEDIO + 1) / 5) for (let v = -NINO_ALTO - 1.5; v <= 1.001; v += (NINO_ALTO + 2.5) / 10) pts.push([p.x + u, p.y + v]);
      for (const E of aros) {
        n++;
        assert.ok(pts.every(([a, b]) => val(E, a, b, -3) < 1) || pts.every(([a, b]) => val(E, a, b, 3) > 1), `${donde}: el alumno de (${x}, ${y}) toca la línea de «${E.a.nombre}»`);
      }
    }
  }
  assert.ok(n > 20, `${n} revisados`);
});

// En el patio, cada nombre va dentro de su aro o pegado a él (a 10 px o menos), sin cruzar ninguna línea ni pisar a un
// alumno; si queda dentro de otro aro, es uno que contiene al suyo (el nombre de los quenistas, sobre su aro, dentro de
// la banda).
test('en el patio, cada nombre va en su aro o pegado a él, sin cruzar líneas ni pisar alumnos', () => {
  const T = require('../trazo.js'), { NINO_ALTO, NINO_MEDIO } = P.constantes;
  let n = 0;
  for (const { donde, datos } of TODAS) {
    if (datos.escena !== 'patio' || /^muestra/.test(donde)) continue;
    const aros = (datos.aros || []).map(a => { const c = P.patioPx(a.x, a.y); return { a, cx: c.x, cy: c.y, rx: a.r * 29.2, ry: a.r * 17 }; });
    const val = (E, x, y, d) => ((x - E.cx) / (E.rx + d)) ** 2 + ((y - E.cy) / (E.ry + d)) ** 2;
    const contiene = (K, A) => Math.hypot(K.a.x - A.a.x, K.a.y - A.a.y) + A.a.r <= K.a.r + 1e-9;
    const rejilla = (x0, y0, x1, y1) => { const o = []; for (let i = 0; i <= 12; i++) for (let j = 0; j <= 6; j++) o.push([x0 + (x1 - x0) * i / 12, y0 + (y1 - y0) * j / 6]); return o; };
    for (const C of aros) {
      if (!C.a.nombre || !C.a.en) continue;
      n++;
      const w = T.ancho(C.a.nombre, 14, 700), p = P.patioPx(C.a.en[0], C.a.en[1]), y = p.y + 5, b = [p.x - w / 2, y - 11.2, p.x + w / 2, y + 3.5];
      const pts = rejilla(...b), estado = E => (pts.every(([u, v]) => val(E, u, v, -2) < 1) ? 'dentro' : pts.every(([u, v]) => val(E, u, v, 2) > 1) ? 'fuera' : 'cruza');
      for (const E of aros) assert.notEqual(estado(E), 'cruza', `${donde}: «${C.a.nombre}» cruza la línea de «${E.a.nombre}»`);
      if (estado(C) === 'fuera') assert.ok(rejilla(b[0] - 10, b[1] - 10, b[2] + 10, b[3] + 10).some(([u, v]) => val(C, u, v, 0) < 1), `${donde}: «${C.a.nombre}» lejos de su aro`);
      for (const E of aros) if (E !== C && estado(E) === 'dentro') assert.ok(contiene(E, C), `${donde}: «${C.a.nombre}» dentro de «${E.a.nombre}», que no contiene a su aro`);
      for (const [x, yy] of datos.ninos || []) {
        const k = P.patioPx(x, yy);
        assert.ok(!(b[2] > k.x - NINO_MEDIO - 2 && b[0] < k.x + NINO_MEDIO + 2 && b[3] > k.y - NINO_ALTO - 2 && b[1] < k.y + 2), `${donde}: «${C.a.nombre}» pisa al alumno de (${x}, ${yy})`);
      }
    }
  }
  assert.ok(n > 10, `${n} nombres revisados`);
});
