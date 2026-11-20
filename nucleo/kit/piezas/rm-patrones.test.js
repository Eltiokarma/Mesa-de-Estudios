// Pruebas de la pieza «rm-patrones»: las comunes de las piezas de razonamiento matemático (rm-pruebas.js: limpia, pura, de
// alto fijo, marcada como dibujo de prueba, todo dentro del lienzo con 4 de margen y ningún rótulo encima de otro ni de un
// trazo, con números y no a ojo; docs/molde-unidad.md §6), en las muestras de abajo y en todas las figuras de
// «Razonamiento inductivo» que usan la pieza (Lee, el juego en toda su grilla, la predicción, «Mira» paso a paso, la
// regla, los ejemplos, «Así se resuelve» y «Ahora tú» en 60 semillas y las mesas del laboratorio). Además: los papeles de
// color (naranja el dato, turquesa lo que agrega o se repite, violeta solo lo seguro), lo que se ve antes de responder y
// que la torta no tiene tres cortes que pasen por un mismo punto (así los pedazos son los que dice la unidad).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Teoria = require('../../teoria.js');
const P = require('./rm-patrones.js');
const R = require('./rm-pruebas.js');

const cuad = k => { const ps = [[0, 0, 0, 1, 'dato']]; for (let i = 0; i < k; i++) ps.push([i, 0, i + 1, 0, i ? 'agrega' : 'dato'], [i, 1, i + 1, 1], [i + 1, 0, i + 1, 1]); return ps; };
const MUESTRAS = [
  { escena: 'fosforos', alto: 1, unidad: 26, figuras: [1, 2, 3].map(k => ({ titulo: `Figura ${k}`, palitos: cuad(k) })), nota: [{ t: 'Una nota', papel: 'seguro', desde: 1 }] },
  { escena: 'fosforos', alto: 1, unidad: 36, figuras: [{ palitos: cuad(7) }] },
  { escena: 'torta', velitas: 7, titulo: 'La torta' },
  { escena: 'torta', velitas: 1, cortes: false },
  { escena: 'chapitas', figuras: [1, 2, 3, 4].map(k => ({ titulo: `Figura ${k}`, filas: Array(k).fill(k + 1), marcas: [[0, 0, 'agrega']] })) },
  { escena: 'chapitas', figuras: [{ titulo: 'Figura 10', filas: Array(10).fill(11) }] },
  { escena: 'chapitas', figuras: [{ titulo: 'Triángulo', filas: [1, 2, 3, 4, 5], centrar: true, arriba: '5 por lado' }] },
  { escena: 'latas', rotulos: true, filas: [[1], [3, 5], [7, 9, 11], [13, 15, 17, 19], [21, 23, 25, 27, 29]], resaltar: [{ fila: 2, papel: 'dato' }] },
  { escena: 'latas', filas: Array.from({ length: 10 }, (_, i) => Array.from({ length: i + 1 }, (_, j) => i * (i + 1) + 1 + 2 * j)), tapar: [9] },
  { escena: 'calculadora', cuenta: '9 999 × 9 999', resultado: '99 980 001', cinta: [{ t: '9 × 9 = 81' }, { t: '99 × 99 = 9 801', desde: 1 }], lineas: 4 },
  { escena: 'pulsera', cuentas: 'RVNBRVNBRVNBRVNBRVNBRVNB'.split(''), ciclo: { de: 0, largo: 4, t: 'ciclo de 4' }, marcas: [{ i: 5, papel: 'dato' }], puntos: true },
  { escena: 'pulsera', forma: 'ficha', cuentas: '246824682468'.split(''), desde: 1 },
];

function deLaTeoria(semillas) {
  const def = require('../../../contenido/teoria/razonamiento-matematico/razonamiento-inductivo.js');
  for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
  const out = [], add = (donde, pieza, dib, antes) => { if (dib && dib.datos && (pieza || dib.pieza) === P.id) out.push({ donde, datos: dib.datos, estado: dib.estado || {}, antes: !!antes }); };
  for (const idea of def.ideas) {
    const p = idea.pieza;
    for (const [i, t] of ((idea.lee && idea.lee.tarjetas) || []).entries()) add(`${idea.id} lee ${i + 1}`, t.pieza || p, t.dibujo, true);
    const j = idea.juega, base = Teoria.inicio(j);
    for (const v of Teoria.grilla(j.controles || [])) add(`${idea.id} juega ${JSON.stringify(v)}`, j.pieza || p, j.dibujo(Object.assign({}, base, v)));
    add(`${idea.id} predice`, idea.predice.pieza || p, idea.predice.dibujo, true);
    add(`${idea.id} revelar`, idea.predice.pieza || p, idea.predice.revelar);
    for (const [i, paso] of idea.mira.pasos.entries()) add(`${idea.id} mira ${i + 1}`, idea.mira.pieza || p, { datos: idea.mira.datos, estado: paso.estado });
    const fr = Teoria.figuraRegla(idea);
    add(`${idea.id} regla`, fr.pieza || p, fr);
    for (const [i, e] of (idea.ejemplos || []).entries()) if (e.figura) add(`${idea.id} ejemplo ${i + 1}`, e.figura.pieza, e.figura, true);
    for (let s = 0; s < semillas; s++) {
      const a = idea.ahoraTu.generar(s);
      add(`${idea.id} ahora tú ${s}`, idea.ahoraTu.pieza || p, a.dibujo, true);
      if (a.solucion) add(`${idea.id} ahora tú ${s} solución`, idea.ahoraTu.pieza || p, a.solucion.dibujo);
      if (idea.resuelve) {
        const r = idea.resuelve.generar(s);
        add(`${idea.id} resuelve ${s}`, idea.resuelve.pieza || p, r.dibujo, true);
        for (const [k, x] of r.pasos.entries()) add(`${idea.id} resuelve ${s} paso ${k + 1}`, idea.resuelve.pieza || p, x.dibujo);
      }
    }
  }
  for (const m of def.laboratorio || []) {
    if (m.pieza !== P.id) continue;
    const base = Teoria.inicio(m), casos = Teoria.grilla(m.controles || []);
    for (let i = 0; i < casos.length; i += Math.max(1, Math.floor(casos.length / 120))) add(`mesa ${m.id} ${JSON.stringify(casos[i])}`, m.pieza, m.dibujo(Object.assign({}, base, casos[i])));
  }
  return out;
}
const TEORIA = deLaTeoria(60);
const TODAS = MUESTRAS.map((d, k) => ({ donde: `muestra ${k + 1}`, datos: d, estado: {} })).concat(TEORIA);
R.comunes(P, TODAS, { minTeoria: 100, cortes: [0, 1, 2, 3, 4, 5] });

test('papeles de color fijos: naranja el dato, turquesa lo que agrega, violeta solo lo seguro', () => {
  assert.deepEqual(P.PAPELES, { dato: 'o', agrega: 'i', seguro: 'f', tenue: 'tenue', amarra: 'tinta' });
  for (const { donde, datos } of TODAS) for (const c of [0, 5]) {
    const s = P.dibujar(datos, { corte: c });
    const sinSeguro = s.replace(/<g class="kit-aparece" data-marca="seguro"[^>]*>.*?<\/g>/g, '');
    assert.ok(!/var\(--c-f\)/.test(sinSeguro), `${donde}: violeta fuera de lo seguro`);
  }
});

test('lo que el alumno ve antes de responder no trae violeta', () => {
  const antes = TEORIA.filter(f => f.antes);
  assert.ok(antes.length > 50, `${antes.length}`);
  for (const { donde, datos, estado } of antes) assert.ok(!/var\(--c-f\)/.test(P.dibujar(datos, estado)), `${donde}: violeta antes de responder`);
});

// Dos segmentos se cruzan dentro (sin tocar sus puntas): el punto de cruce.
function cruce(a, b, c, d) {
  const den = (b[0] - a[0]) * (d[1] - c[1]) - (b[1] - a[1]) * (d[0] - c[0]);
  if (Math.abs(den) < 1e-12) return null;
  const t = ((c[0] - a[0]) * (d[1] - c[1]) - (c[1] - a[1]) * (d[0] - c[0])) / den, u = ((c[0] - a[0]) * (b[1] - a[1]) - (c[1] - a[1]) * (b[0] - a[0])) / den;
  return t > 1e-9 && t < 1 - 1e-9 && u > 1e-9 && u < 1 - 1e-9 ? [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])] : null;
}
// Cierre (20 nov): con 7 velitas dos cruces quedaban a 2,2 px y un pedazo de 2,8 px² no se veía; ahora, 6 px o más.
test('la torta: ningún punto donde se crucen tres cortes, y los pedazos que da la figura son 1, 2, 4, 8, 16, 31 y 57', () => {
  for (let k = 1; k <= 7; k++) {
    const pts = P.velitas(k), segs = [];
    for (let i = 0; i < k; i++) for (let j = i + 1; j < k; j++) segs.push([pts[i], pts[j]]);
    const cruces = [];
    for (let i = 0; i < segs.length; i++) for (let j = i + 1; j < segs.length; j++) { const x = cruce(...segs[i], ...segs[j]); if (x) cruces.push(x); }
    for (let i = 0; i < cruces.length; i++) for (let j = i + 1; j < cruces.length; j++) assert.ok(Math.hypot(cruces[i][0] - cruces[j][0], cruces[i][1] - cruces[j][1]) > 6, `k = ${k}: dos cruces casi en el mismo punto (a la vista, un pedazo menos)`);
    // Euler en el disco: pedazos = 1 + cortes + cruces (cada corte y cada cruce simple agregan un pedazo).
    assert.equal(1 + segs.length + cruces.length, [1, 2, 4, 8, 16, 31, 57][k - 1], `k = ${k}`);
  }
});
