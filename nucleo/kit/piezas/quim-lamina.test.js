// Pruebas de la pieza «quim-lamina» (la lámina de oro y los modelos atómicos, idea 2 de Estructura atómica): sana, pura,
// marcada de prueba, fiel (el camino de cada alfa sale con el desvío de los datos) y, con números (docs/molde-unidad.md
// §6), todo dentro del lienzo con 4 de margen, ningún rótulo que pise a otro y ningún camino que se salga, en las
// muestras y en toda la unidad.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../kit.js');
const Teoria = require('../../teoria.js');
const P = require('./quim-lamina.js');

// Todas las figuras de «Estructura atómica» que usan una pieza (juego en toda su grilla, Lee, Predice, Mira, la regla,
// los ejemplos, «Así se resuelve», «Ahora tú» y las mesas del laboratorio).
function figurasUnidad(pieza) {
  const def = require('../../../contenido/teoria/quimica/estructura-atomica.js');
  for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
  const out = [], con = (donde, f, pz) => { const p = f && (f.pieza || pz); if (f && f.datos && p === pieza) out.push({ donde, datos: f.datos, estado: f.estado || {} }); };
  for (const i of def.ideas) {
    const d = i.id;
    for (const v of Teoria.grilla(i.juega.controles)) con(`${d} juego ${JSON.stringify(v)}`, i.juega.dibujo(v), i.juega.pieza || i.pieza);
    i.lee.tarjetas.forEach((t, k) => con(`${d} lee ${k + 1}`, t.dibujo, t.pieza));
    con(`${d} predice`, i.predice.dibujo, i.predice.pieza || i.pieza); con(`${d} revelar`, i.predice.revelar, i.predice.pieza || i.pieza);
    for (let c = 0; c <= 6; c++) con(`${d} mira corte ${c}`, { datos: i.mira.datos, estado: { corte: c } }, i.mira.pieza || i.pieza);
    if (i.regla.dibujo) con(`${d} regla`, i.regla.dibujo, i.regla.dibujo.pieza || i.mira.pieza || i.pieza);
    i.ejemplos.forEach((e, k) => con(`${d} ejemplo ${k + 1}`, e.figura));
    for (let s = 0; s < 40; s++) {
      const r = i.resuelve.generar(s), a = i.ahoraTu.generar(s);
      con(`${d} resuelve ${s}`, r.dibujo, i.resuelve.pieza || i.pieza); r.pasos.forEach((p, k) => con(`${d} resuelve ${s} paso ${k + 1}`, p.dibujo, i.resuelve.pieza || i.pieza));
      con(`${d} ahora tú ${s}`, a.dibujo, i.ahoraTu.pieza || i.pieza); if (a.solucion) con(`${d} solución ${s}`, a.solucion.dibujo, i.ahoraTu.pieza || i.pieza);
    }
  }
  for (const m of def.laboratorio) if (m.pieza === pieza) for (const v of Teoria.grilla(m.controles)) con(`mesa ${m.id} ${JSON.stringify(v)}`, m.dibujo(v), m.pieza);
  return out;
}
const solapan = (a, b, e = 0) => a.x0 < b.x1 + e && b.x0 < a.x1 + e && a.y0 < b.y1 + e && b.y0 < a.y1 + e;
// Encuadre (todo dentro con 4 de margen) y rótulos que no se pisan entre sí ni pisan las cajas o los objetos.
function revisar(g, nombre, mal, { dentroDe = () => false } = {}) {
  const { W, H, M } = g;
  for (const c of [...g.objetos.filter(o => !o.marco), ...g.textos]) if (!(c.x0 >= M - 1e-9 && c.y0 >= M - 1e-9 && c.x1 <= W - M + 1e-9 && c.y1 <= H - M + 1e-9))
    mal.push(`${nombre}: se sale «${c.txt || c.que}» (${c.x0.toFixed(1)}, ${c.y0.toFixed(1)}) – (${c.x1.toFixed(1)}, ${c.y1.toFixed(1)}) de ${W} × ${H}`);
  const t = g.textos;
  for (let i = 0; i < t.length; i++) for (let j = i + 1; j < t.length; j++) if (solapan(t[i], t[j], 1)) mal.push(`${nombre}: se pisan «${t[i].txt}» y «${t[j].txt}»`);
  for (const x of t) for (const o of g.objetos) if (!o.marco && !dentroDe(x, o) && solapan(x, o)) mal.push(`${nombre}: «${x.txt}» pisa ${o.que}`);
}

function sana(s, nombre) {
  assert.ok(!/NaN|undefined|Infinity|null/.test(s), nombre);
  assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), `${nombre}: sin colores fijos`);
  assert.ok(!/var\(--c-d\)|var\(--el-/.test(s), `${nombre}: sin verde ni paleta de elementos`);
  assert.ok(!/<script|\son[a-z]+\s*=|\sid=/i.test(s), nombre);
  for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14, `${nombre}: texto de ${t}`);
  for (const m of s.matchAll(/<text[^>]*fill="([^"]+)"[^>]*>([^<]*\?[^<]*)<\/text>/g)) assert.equal(m[1], 'currentColor', `${nombre}: «${m[2]}» en ${m[1]}`);
}
const MUESTRAS = [
  { vista: 'zoom', banda: 'retablo', modelo: 'thomson', titulo: 'Átomo de Thomson', alfas: [{ b: 0.5, desvio: 0.4 }] },
  { vista: 'zoom', modelo: 'nuclear', alfas: [{ b: 0, desvio: 180 }, { b: 0.1, desvio: 22.6 }, { b: -0.75, desvio: 3 }] },
  { vista: 'zoom', modelo: 'dalton', alfas: [{ b: 0.9, desvio: 51.7 }, { b: -1, desvio: 0 }] },
  { vista: 'zoom', modelo: 'incognita', alfas: [{ b: 0, llega: true }] },
  { vista: 'lamina', resultado: true, titulo: 'Lámina de oro' },
  { vista: 'lamina', resultado: false },
  { vista: 'modelos' },
];
const dentroDe = (x, o) => x.que === 'pide';   // el «?» va dentro del átomo o al final de la alfa, a propósito

test('registrada en el kit', () => assert.equal(Kit.piezas['quim-lamina'], P));
test('sana, pura, marcada de prueba, de alto fijo por vista y con su texto alternativo', () => {
  for (const [k, d] of MUESTRAS.entries()) {
    const s = P.dibujar(d, { corte: 3 });
    sana(s, `muestra ${k}`); assert.equal(s, P.dibujar(d, { corte: 3 }));
    assert.match(s, /data-prueba="si"/);
    assert.ok(P.alt(d).length > 40, P.alt(d));
  }
  assert.match(P.dibujar(MUESTRAS[0]), /data-objeto="retablo" data-prueba="si"/);
  assert.match(P.alt(MUESTRAS[1]), /no a escala/);
});
test('fiel: la alfa sale con su desvío; la que va al centro del núcleo vuelve; la que solo llega lleva «?»', () => {
  const g = P.geometria({ vista: 'zoom', modelo: 'nuclear', alfas: [{ b: 0.5, desvio: 30 }] }), [ini, t, fin] = g.caminos[0];
  const ang = Math.atan2(-(fin[1] - t[1]), fin[0] - t[0]) * 180 / Math.PI;
  assert.ok(Math.abs(ang - 30) < 1e-6, `sale a ${ang}°`);
  assert.equal(ini[1], t[1]);
  const v = P.geometria({ vista: 'zoom', modelo: 'nuclear', alfas: [{ b: 0, desvio: 180 }] }).caminos[0];
  assert.ok(v[2][0] < v[1][0], 'vuelve hacia la fuente');
  assert.ok(P.dibujar(MUESTRAS[3]).includes('>?<'));
  // Modelos: con el corte aparecen uno a uno; los que faltan son un círculo punteado vacío.
  assert.equal((P.dibujar({ vista: 'modelos' }, { corte: 2 }).match(/class="kit-modelo/g) || []).length, 2);
});
test('encuadre, rótulos y caminos, con números, en las muestras y en toda la unidad', () => {
  const mal = [], caminos = (g, nombre) => { for (const c of g.caminos) for (const [x, y] of c) if (x < g.M || y < g.M || x > g.W - g.M || y > g.H - g.M) mal.push(`${nombre}: un camino sale en (${x.toFixed(1)}, ${y.toFixed(1)})`); };
  MUESTRAS.forEach((d, k) => { const g = P.geometria(d, { corte: 5 }); revisar(g, `muestra ${k}`, mal, { dentroDe }); caminos(g, `muestra ${k}`); });
  const figs = figurasUnidad('quim-lamina');
  assert.ok(figs.length > 40, `${figs.length} figuras`);
  for (const f of figs) { sana(P.dibujar(f.datos, f.estado), f.donde); const g = P.geometria(f.datos, f.estado); revisar(g, f.donde, mal, { dentroDe }); caminos(g, f.donde); }
  assert.deepEqual(mal.slice(0, 20), [], `${mal.length} problemas`);
});

// Ronda 2 del lector en frío (18 nov, noche): la barra de la izquierda se leía como la lámina; la onda de Bohr y la nube
// del modelo actual no tenían nombre.
test('ronda 2: «fuente de alfas» bajo la barra, «luz» y «orbital» en los modelos, y el zoom sin fuente', () => {
  const z = P.dibujar({ vista: 'zoom', modelo: 'dalton', alfas: [{ b: 0.3, llega: true }] });
  assert.ok(z.includes('>fuente de alfas<') && !z.includes('>alfas<'));
  const g = P.geometria({ vista: 'zoom', modelo: 'dalton', alfas: [{ b: -1, desvio: 0 }] }), f = g.textos.find(t => t.txt === 'fuente de alfas');
  assert.ok(f.y0 > g.caminos[0][0][1] + 4, 'ninguna alfa cruza el rótulo');
  assert.ok(P.dibujar({ vista: 'lamina', resultado: true }).includes('>fuente de alfas<'));
  const m = P.dibujar({ vista: 'modelos' }, { corte: 5 });
  assert.ok(m.includes('>luz<') && m.includes('>orbital<'));
  assert.ok(!P.dibujar({ vista: 'modelos' }, { corte: 3 }).includes('>luz<'), 'la luz llega con Bohr');
  const sin = P.dibujar({ vista: 'zoom', modelo: 'thomson', fuente: false });
  assert.ok(!sin.includes('fuente de alfas') && !/<rect x="8"/.test(sin));
});
