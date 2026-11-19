// Pruebas de la pieza «rm-certeza»: las comunes de las piezas de la rama Lógica (rm-pruebas.js: limpia, pura, de alto fijo,
// marcada como dibujo de prueba, todo dentro del lienzo con 4 de margen y ningún rótulo encima de otro ni de un trazo, con
// números y no a ojo; docs/molde-unidad.md §6), en las muestras de abajo y en todas las figuras de «Certezas» que usan la
// pieza (Lee, el juego en toda su grilla, la predicción, «Mira» paso a paso, la regla, los ejemplos, «Así se resuelve» y
// «Ahora tú» en 60 semillas y las mesas del laboratorio). Además: los papeles de color (naranja la peor suerte, turquesa
// la que obliga, violeta solo lo seguro; lo descartado en gris con su raya) y lo que se ve antes de responder.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Teoria = require('../../teoria.js');
const P = require('./rm-certeza.js');
const R = require('./rm-pruebas.js');

const bolas = (xs) => xs.flatMap(([c, n]) => Array.from({ length: n }, () => ({ forma: 'bola', t: c })));
const MUESTRAS = [
  { escena: 'recipiente', recipiente: 'tombola', meta: 'Meta: 2 rojas', objetos: bolas([['R', 5], ['V', 4], ['N', 3]]),
    salieron: [{ i: 6, papel: 'peor' }, { i: 7, papel: 'peor', desde: 1 }, { i: 4, papel: 'obliga', desde: 2 }], reserva: 12,
    cuenta: [{ t: '7 no sirven', papel: 'peor' }, { t: '+ 1 obliga', papel: 'obliga', desde: 1 }, { t: '= 8', papel: 'seguro', desde: 2 }] },
  { escena: 'recipiente', recipiente: 'cajon', objetos: [{ forma: 'guante', t: 'I', relleno: 1 }, { forma: 'guante', t: 'D', relleno: 1 }, { forma: 'guante', t: 'I' }, { forma: 'guante', t: 'D' }],
    salieron: [{ i: 0, papel: 'peor' }, { i: 2, papel: 'peor' }, { i: 3, papel: 'obliga' }], reserva: 4 },
  { escena: 'recipiente', recipiente: 'bingo', enSuLugar: true, objetos: Array.from({ length: 20 }, (_, k) => ({ forma: 'ficha', t: String(k + 1) })),
    salieron: [{ i: 0, papel: 'peor' }, { i: 2, papel: 'obliga' }], nota: 'Una nota' },
  { escena: 'recipiente', recipiente: 'mesa', enSuLugar: true, objetos: [1, 7, 2, 6, 3, 5, 4].map((x, k) => ({ forma: 'carta', t: String(x), grupo: Math.floor(k / 2) })),
    salieron: [{ i: 0, papel: 'peor' }, { i: 6, papel: 'descartado' }] },
  { escena: 'casilleros', tituloCal: 'Cumpleaños del salón', columnas: 4, meta: 'Meta: 3 el mismo mes',
    casilleros: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'].map((t, k) => ({ t, n: k ? 2 : 3, papel: k ? 'peor' : undefined, papeles: k ? undefined : ['peor', 'peor', 'obliga'], desdes: k ? undefined : [0, 0, 1] })) },
  { escena: 'llaves', llaves: 4, filas: [['x', 'x', 'x', 'd'], ['-', 'x', 'x', 'd'], ['-', '-', 'x', 'd'], ['-', '-', '-', 'd']], filasDesde: [0, 1, 2, 3], totales: ['3 pruebas', '2 pruebas', '1 prueba', '0 pruebas'] },
  { escena: 'llaves', llaves: 10, filas: [] },
];

function deLaTeoria(semillas) {
  const def = require('../../../contenido/teoria/razonamiento-matematico/certezas.js');
  for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
  const out = [], add = (donde, pieza, dib, antes) => { if (dib && dib.datos && (pieza || P.id) === P.id) out.push({ donde, datos: dib.datos, estado: dib.estado || {}, antes: !!antes }); };
  for (const idea of def.ideas) {
    for (const [i, t] of idea.lee.tarjetas.entries()) add(`${idea.id} lee ${i + 1}`, t.pieza, t.dibujo, true);
    const base = Teoria.inicio(idea.juega);
    for (const v of Teoria.grilla(idea.juega.controles)) add(`${idea.id} juega ${JSON.stringify(v)}`, null, idea.juega.dibujo(Object.assign({}, base, v)));
    add(`${idea.id} predice`, null, idea.predice.dibujo, true);
    add(`${idea.id} revelar`, null, idea.predice.revelar);
    for (const [i, paso] of idea.mira.pasos.entries()) add(`${idea.id} mira ${i + 1}`, null, { datos: idea.mira.datos, estado: paso.estado });
    const fr = Teoria.figuraRegla(idea);
    add(`${idea.id} regla`, fr.pieza, fr);
    for (const [i, e] of (idea.ejemplos || []).entries()) if (e.figura) add(`${idea.id} ejemplo ${i + 1}`, e.figura.pieza, e.figura, true);
    for (let s = 0; s < semillas; s++) {
      const a = idea.ahoraTu.generar(s);
      add(`${idea.id} ahora tú ${s}`, null, a.dibujo, true);
      add(`${idea.id} ahora tú ${s} solución`, null, a.solucion.dibujo);
      const r = idea.resuelve.generar(s);
      add(`${idea.id} resuelve ${s}`, null, r.dibujo, true);
      for (const [k, x] of r.pasos.entries()) add(`${idea.id} resuelve ${s} paso ${k + 1}`, null, x.dibujo);
    }
  }
  for (const m of def.laboratorio) {
    const base = Teoria.inicio(m), casos = Teoria.grilla(m.controles);
    for (let i = 0; i < casos.length; i += Math.max(1, Math.floor(casos.length / 80))) add(`mesa ${m.id} ${JSON.stringify(casos[i])}`, m.pieza, m.dibujo(Object.assign({}, base, casos[i])));
  }
  return out;
}
const TEORIA = deLaTeoria(60);
const TODAS = MUESTRAS.map((d, k) => ({ donde: `muestra ${k + 1}`, datos: d, estado: {} })).concat(TEORIA);
R.comunes(P, TODAS, { minTeoria: 200, cortes: [0, 1, 2, 3, 4, 5] });

test('papeles de color fijos: naranja la peor suerte, turquesa la que obliga, violeta solo lo seguro, gris con raya lo descartado', () => {
  assert.deepEqual(P.PAPELES, { peor: 'o', obliga: 'i', seguro: 'f', descartado: 'tenue', amarra: 'tinta' });
  for (const { donde, datos } of TODAS) for (const c of [0, 5]) {
    const s = P.dibujar(datos, { corte: c });
    const sinSeguro = s.replace(/<g[^>]*data-marca="seguro"[^>]*>.*?<\/g>/g, '').replace(/<(circle|rect)[^>]*data-marca="seguro"[^>]*\/>/g, '');
    assert.ok(!/var\(--c-f\)/.test(sinSeguro), `${donde}: violeta fuera de lo seguro`);
    for (const [m] of s.matchAll(/<g class="kit-aparece" data-objeto-papel="descartado"[^>]*>.*?<\/g>/g)) {
      assert.match(m, /opacity="0.7"/, donde);
      assert.match(m, /data-tacha="si"/, donde);
    }
  }
});

test('lo que el alumno ve antes de responder no trae violeta ni nada tachado', () => {
  const antes = TEORIA.filter(f => f.antes);
  assert.ok(antes.length > 100, `${antes.length}`);
  for (const { donde, datos, estado } of antes) {
    const s = P.dibujar(datos, estado);
    assert.ok(!/var\(--c-f\)/.test(s), `${donde}: violeta antes de responder`);
    assert.ok(!/data-tacha="si"/.test(s), `${donde}: algo tachado antes de responder`);
  }
});

test('lo que salió baja a «Salieron» y deja su lugar en la tómbola; el texto alternativo lo dice en orden', () => {
  const d = MUESTRAS[0];
  const enCaja = s => (s.match(/data-objeto-papel="amarra"/g) || []).length;
  assert.equal(enCaja(P.dibujar(d, { corte: 0 })), 12 - 1);
  assert.equal(enCaja(P.dibujar(d, { corte: 2 })), 12 - 3);
  assert.match(P.alt(d), /Salieron, en orden: bolita V, bolita V, bolita R \(la que obliga\)/);
  assert.match(P.alt(MUESTRAS[5]), /llave 1, 3 pruebas que fallan y el último se deduce/);
});
