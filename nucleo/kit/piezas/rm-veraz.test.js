// Pruebas de la pieza «rm-veraz»: las comunes de las piezas de la rama Lógica (rm-pruebas.js: limpia, pura, de alto fijo,
// marcada como dibujo de prueba, todo dentro del lienzo con 4 de margen y ningún rótulo encima de otro ni de un trazo, con
// números y no a ojo; docs/molde-unidad.md §6), en las muestras de abajo y en todas las figuras de «Verdades y mentiras»
// que usan la pieza (Lee, el juego en toda su grilla, la predicción, «Mira» paso a paso, la regla, los 90 ejemplos, «Así
// se resuelve» y «Ahora tú» en 60 semillas y las mesas del laboratorio). Además: los papeles de color (naranja lo
// supuesto, turquesa lo que sale, violeta solo lo seguro; lo descartado en gris con su raya) y el globo que no se sale.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Teoria = require('../../teoria.js');
const P = require('./rm-veraz.js');
const R = require('./rm-pruebas.js');

const MUESTRAS = [
  { escena: 'tarjetas', habla: [{ quien: 'Ana', dice: ['Beto miente'], tarjeta: '?' }, { quien: 'Beto', dice: ['Los dos mentimos'], tarjeta: 'V', papelTarjeta: 'supuesto', valores: [{ t: 'falsa', papel: 'sale' }], estado: { t: '✗ choca' } }] },
  { escena: 'ventana', supuesto: 'Supón: fue Beto', habla: ['Ana', 'Beto', 'Ciro', 'Dina'].map(q => ({ quien: q, dice: ['Una frase bastante larga que tiene que partirse en dos renglones'], valores: [{ t: 'cierta', papel: 'sale' }] })), nota: 'Si fue Beto: 1 frase falsa' },
  { escena: 'mochilas', objetos: [{ t: 'Ana' }, { t: 'Beto', pelota: 'seguro' }, { t: 'Ciro' }], habla: [{ quien: 'Ana', dice: ['Está en la de Beto'] }] },
  { escena: 'mochilas', objeto: 'caja', objetos: [{ t: 'Caja 1' }, { t: 'Caja 2', pelota: 'supuesto' }, { t: 'Caja 3' }], habla: [{ quien: null, dice: ['Caja 1: El premio está aquí'] }] },
  { escena: 'mural', lista: [{ t: 'Ana', ok: true }, { t: 'Beto', ok: false }, { t: 'Ciro', ok: null }], habla: [{ quien: null, dice: ['Todos aprobaron', 'Al menos uno no aprobó'], valores: [{ t: 'falsa', papel: 'sale' }, { t: 'cierta', papel: 'sale' }] }] },
  { escena: 'podio', podio: ['Beto', 'Ciro', 'Ana', 'Dina'], seguroPodio: 1, habla: [{ quien: 'Ana', dice: ['Llegué segunda', 'Beto llegó primero'], valores: [{ t: 'falsa', papel: 'sale' }, { t: 'cierta', papel: 'sale' }], estado: { t: 'encaja' } }] },
  { casos: [{ titulo: 'Ciro', columnas: ['Tarjeta', 'Frase'], filas: [{ celdas: [{ t: 'VERAZ', papel: 'supuesto' }, { t: 'cierta', papel: 'sale' }], seguro: 1 }, { celdas: [{ t: 'MIENTE', papel: 'supuesto' }, 'falsa'], fuera: 2 }] },
    { titulo: 'Dina', columnas: ['Tarjeta', 'Frase'], filas: [{ celdas: ['VERAZ', 'falsa'], fuera: true }] }], nota: [{ t: 'Una nota', desde: 1 }], notas: 2 },
];

function deLaTeoria(semillas) {
  const def = require('../../../contenido/teoria/razonamiento-matematico/verdades-y-mentiras.js');
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
    for (const [i, e] of idea.ejemplos.entries()) add(`${idea.id} ejemplo ${i + 1}`, e.figura.pieza, e.figura, true);
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
R.comunes(P, TODAS, { minTeoria: 1000, cortes: [0, 1, 2, 3, 4, 5] });

test('papeles de color fijos: naranja lo supuesto, turquesa lo que sale, violeta solo lo seguro, gris con raya lo descartado', () => {
  assert.deepEqual(P.PAPELES, { supuesto: 'o', sale: 'i', seguro: 'f', descartado: 'tenue', amarra: 'tinta' });
  for (const { donde, datos } of TODAS) for (const c of [0, 5]) {
    const s = P.dibujar(datos, { corte: c });
    // Cada violeta va dentro de algo marcado como seguro.
    const sinSeguro = s.replace(/<g[^>]*data-marca="seguro"[^>]*>.*?<\/g>/g, '').replace(/<rect[^>]*data-marca="seguro"[^>]*\/>/g, '').replace(/<g class="kit-aparece" data-caso="seguro".*?<\/g>/g, '');
    assert.ok(!/var\(--c-f\)/.test(sinSeguro), `${donde}: violeta fuera de lo seguro`);
    for (const [m] of s.matchAll(/<g class="kit-aparece" data-caso="fuera"[^>]*>.*?<\/g>/g)) {
      assert.match(m, /opacity="0.7"/, donde);
      assert.match(m, /data-tacha="si"/, donde);
      assert.ok(!/var\(--c-f\)/.test(m), `${donde}: violeta en un caso descartado`);
    }
  }
});

test('lo que el alumno ve antes de responder no trae violeta ni casos tachados', () => {
  const antes = TEORIA.filter(f => f.antes);
  assert.ok(antes.length > 400, `${antes.length}`);
  for (const { donde, datos, estado } of antes) {
    const s = P.dibujar(datos, estado);
    assert.ok(!/var\(--c-f\)/.test(s), `${donde}: violeta antes de responder`);
    assert.ok(!/data-caso="fuera"/.test(s), `${donde}: un caso tachado antes de responder`);
  }
});

test('cada globo cabe con su frase entera y la tarjeta volteada dice VERAZ o MIENTE dentro de su marco', () => {
  for (const { donde, datos } of TODAS) {
    const g = P.geometria(datos);
    (datos.habla || []).forEach((h, i) => {
      const r = g.renglones[i];
      assert.equal(r.lineas.join(' ').replace(/^\d\. /, ''), r.lineas.join(' ').replace(/^\d\. /, ''), donde);
      for (const t of r.lineas) assert.ok(require('../trazo.js').ancho(t, 14) <= g.anchoGlobo - 12, `${donde}: «${t}» no cabe en el globo`);
      const todo = (h.dice || []).map((t, k) => ((h.dice.length > 1 ? `${k + 1}. ` : '') + t)).join(' ');
      assert.equal(r.lineas.join(' '), todo, `${donde}: el globo no dice la frase entera`);
    });
  }
  const s = P.dibujar(MUESTRAS[0], {});
  assert.match(s, /data-tarjeta="boca-abajo"/);
  assert.match(s, /data-tarjeta="veraz"/);
  assert.match(P.alt(MUESTRAS[0]), /Ana, con tarjeta boca abajo, dice: «Beto miente»/);
});
