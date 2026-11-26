// Pruebas de la pieza «rm-casillas»: las comunes de las piezas de razonamiento matemático (rm-pruebas.js: limpia, pura, de
// alto fijo, marcada como dibujo de prueba, todo dentro del lienzo con 4 de margen y ningún rótulo encima de otro ni de un
// trazo, con números y no a ojo; docs/molde-unidad.md §6), en las muestras de abajo y en todas las figuras de «Arreglos
// numéricos y cuadrados mágicos» que usan la pieza (Lee, el juego en toda su grilla, la predicción, «Mira» paso a paso, la
// regla, los ejemplos, «Así se resuelve» y «Ahora tú» en 60 semillas y las mesas del laboratorio). Además: los papeles de
// color (naranja el total, turquesa lo compartido, violeta solo lo seguro) y que nada de lo que se ve antes de responder
// trae violeta.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Teoria = require('../../teoria.js');
const P = require('./rm-casillas.js');
const R = require('./rm-pruebas.js');

const MUESTRAS = [
  { escena: 'bandeja', toques: ['c0', 'c1', 'c2'], filas: [{ cartas: ['1', '2', '3'], resultado: { t: '6' } }, { cartas: ['7', '6', '5'], resultado: { t: '18' } }], nota: [{ t: 'Total 24', papel: 'total' }] },
  { escena: 'bandeja', op: '×', filas: [{ rotulo: 'Arriba', cartas: ['2', '4', '9'], resultado: { t: '= 72' } }, { rotulo: 'Abajo', cartas: [{ hueco: true }, '3', { t: '?' }] }] },
  { escena: 'bandeja', ranuras: 9, filas: [{ rotulo: 'Grupo 1', cartas: '123456789'.split('') }, { rotulo: 'Grupo 2', cartas: [] }] },
  { escena: 'cruz', centro: { t: '4', papel: 'compartida' }, izq: '2', der: '6', arriba: '3', abajo: '5', fila: { t: '12' }, columna: { t: '12', papel: 'seguro', desde: 1 } },
  { escena: 'marco', lados: 3, esquinas: ['1', '3', '5'], medios: ['?', '?', '?'], sumas: ['?', '?', '?'] },
  { escena: 'marco', lados: 4, esquinas: ['13', '16', '17', '18'], medios: ['?', '?', '?', '?'], sumas: ['15', '15', '15', { t: '15', papel: 'seguro' }] },
  { escena: 'marco', lados: 5, esquinas: ['11', '13', '15', '17', '19'], medios: ['10', '12', '14', '16', '18'], sumas: ['?', '?', '?', '?', '?'] },
  { escena: 'tablero', celdas: [['16', '3', '2', '13'], ['5', '10', '11', '8'], ['9', '6', '7', '12'], ['4', '15', '14', '1']], sumas: ['34', '34', '34', '34'], lineas: [{ tipo: 'diagonal' }, { tipo: 'contra' }] },
  { escena: 'tablero', celdas: [[null, '?', null], ['?', { t: '5', papel: 'compartida' }, '?'], [null, '?', null]], lineas: [{ tipo: 'fila', k: 1, papel: 'compartida' }] },
  { escena: 'muro', filas: [[{ t: '?' }], ['8', '9'], ['3', '5', '4']], pesos: [{ t: '× 1', papel: 'compartida' }, { t: '× 2', papel: 'compartida' }, { t: '× 1', papel: 'compartida' }] },
  { escena: 'muro', filas: [['48'], ['', ''], ['', '', ''], ['', '', '', ''], ['12', '23', '34', '45', '56']] },
];

function deLaTeoria(semillas) {
  const def = require('../../../contenido/teoria/razonamiento-matematico/arreglos-numericos.js');
  for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
  const out = [], add = (donde, pieza, dib, antes) => { if (dib && dib.datos && (dib.pieza || pieza) === P.id) out.push({ donde, datos: dib.datos, estado: dib.estado || {}, antes: !!antes }); };
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
      const r = idea.resuelve.generar(s);
      add(`${idea.id} resuelve ${s}`, idea.resuelve.pieza || p, r.dibujo, true);
      for (const [k, x] of r.pasos.entries()) add(`${idea.id} resuelve ${s} paso ${k + 1}`, idea.resuelve.pieza || p, x.dibujo);
    }
  }
  for (const m of def.laboratorio || []) {
    const base = Teoria.inicio(m), casos = Teoria.grilla(m.controles || []);
    for (let i = 0; i < casos.length; i += Math.max(1, Math.floor(casos.length / 120))) add(`mesa ${m.id} ${JSON.stringify(casos[i])}`, m.pieza, m.dibujo(Object.assign({}, base, casos[i])));
  }
  return out;
}
const TEORIA = deLaTeoria(60);
const TODAS = MUESTRAS.map((d, k) => ({ donde: `muestra ${k + 1}`, datos: d, estado: {} })).concat(TEORIA);
R.comunes(P, TODAS, { minTeoria: 300, cortes: [0, 1, 2, 3, 4] });

test('papeles de color fijos: naranja el total, turquesa lo compartido, violeta solo lo seguro', () => {
  assert.deepEqual(P.PAPELES, { total: 'o', compartida: 'i', seguro: 'f', tenue: 'tenue' });
  for (const { donde, datos } of TODAS) for (const c of [0, 5]) {
    const s = P.dibujar(datos, { corte: c });
    const sinSeguro = s.replace(/<g class="kit-aparece" data-marca="seguro"[^>]*>.*?<\/g>/g, '');
    assert.ok(!/var\(--c-f\)/.test(sinSeguro), `${donde}: violeta fuera de lo seguro`);
  }
});

test('lo que el alumno ve antes de responder no trae violeta', () => {
  const antes = TEORIA.filter(f => f.antes);
  assert.ok(antes.length > 100, `${antes.length}`);
  for (const { donde, datos, estado } of antes) assert.ok(!/var\(--c-f\)/.test(P.dibujar(datos, estado)), `${donde}: violeta antes de responder`);
});

test('el marco: las tarjetas de las esquinas y de los medios no se tocan (3, 4 y 5 lados)', () => {
  for (const L of [3, 4, 5]) {
    const V = P.vertices(L, 160, 150), pts = V.concat(V.map((a, k) => [(a[0] + V[(k + 1) % L][0]) / 2, (a[1] + V[(k + 1) % L][1]) / 2]));
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const dx = Math.abs(pts[i][0] - pts[j][0]), dy = Math.abs(pts[i][1] - pts[j][1]);
      assert.ok(dx >= P.constantes.CM + 2 || dy >= P.constantes.CM + 2, `${L} lados: tarjetas ${i} y ${j} se tocan`);
    }
  }
});
