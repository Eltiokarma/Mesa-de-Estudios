'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const def = require('./impulso-y-choques.js');
for (const ruta of def.requiere) require('../../..' + ruta);
const Teoria = require('../../../nucleo/teoria.js');
const Glosario = require('../../../nucleo/glosario.js');
const figura = require('../../../nucleo/kit/piezas/fis-estatica.js');
const ejes = require('../../../nucleo/kit/piezas/ejes.js');
const ids = ['cantidad-movimiento', 'impulso', 'conservacion', 'elastico-inelastico', 'restitucion', 'centro-masa'];

test('Impulso y choques: seis ideas completas y noventa ejemplos, con calidad 2', () => {
  assert.equal(def.calidad, 2, 'la sesión la marcó al integrar (26 nov)');
  assert.deepEqual(def.ideas.map(i => i.id), ids);
  const glosario = Glosario.porIdea(def);
  for (const [n, idea] of def.ideas.entries()) {
    for (const momento of ['lee', 'juega', 'predice', 'mira', 'regla', 'resuelve', 'ahoraTu']) assert.ok(idea[momento], `${idea.id}: ${momento}`);
    assert.equal(idea.ejemplos.length, 15, idea.id);
    for (const nivel of [1, 2, 3]) assert.equal(idea.ejemplos.filter(e => e.nivel === nivel).length, 5, `${idea.id}: nivel ${nivel}`);
    assert.ok(glosario[n].length >= 2 && glosario[n].length <= 4, `${idea.id}: estrena ${glosario[n].length} términos`);
    for (const termino of glosario[n]) {
      assert.ok(termino.simple, `${idea.id}: ${termino.termino} sin aproximación cotidiana`);
      assert.ok(Glosario.ejemplosDe(termino).length >= 3, termino.termino);
    }
  }
});

test('Impulso y choques: simula el contrato de calidad 2 en cuatrocientas semillas', () => {
  const temas = require('../../../catalogo/cursos/fisica.json').unidades.find(u => u.id === def.unidad).temas;
  const problemas = Teoria.problemas({ ...def, calidad: 2 }, { semillas: 400, temas });
  assert.deepEqual(problemas, []);
});

test('Impulso y choques: el papel de toda la ficha cumple calidad 2 sin excepciones', () => {
  const papel = require('../../../herramientas/papel-reglas.js');
  const c2 = new Set([def.unidad]);
  const fichas = papel.plantillasConPapel().filter(x => x.ficha.unidades.includes(def.unidad));
  assert.equal(fichas.length, 4, 'plantilla nueva y tres mesas anteriores');
  assert.ok(fichas.some(x => x.id === 'fis-impulso-choques'));
  for (const ficha of fichas) assert.deepEqual(papel.revisar(ficha, c2), [], ficha.id);
});

function figuras() {
  const todas = [];
  function agregar(nombre, f, pieza) {
    if (f) todas.push({ nombre, f: { ...f, pieza: f.pieza || pieza } });
  }
  for (const idea of def.ideas) {
    const j = idea.juega;
    const inicio = Object.fromEntries(j.controles.map(c => [c.id, c.inicio === undefined ? c.opciones[0].valor : c.inicio]));
    const estados = [inicio, ...(j.mision.testigo || [])];
    for (const c of j.controles) for (const valor of c.opciones ? c.opciones.map(o => o.valor) : [c.min, c.max]) estados.push({ ...inicio, [c.id]: valor });
    estados.forEach((e, n) => agregar(`${idea.id}: juega ${n}`, j.dibujo(e), idea.pieza));
    idea.lee.tarjetas.forEach((t, n) => agregar(`${idea.id}: lee ${n}`, t.dibujo, t.pieza || idea.pieza));
    agregar(`${idea.id}: predice`, idea.predice.dibujo, idea.pieza);
    agregar(`${idea.id}: revelar`, idea.predice.revelar, idea.pieza);
    agregar(`${idea.id}: regla`, idea.regla.dibujo, idea.pieza);
    idea.mira.pasos.forEach((p, n) => agregar(`${idea.id}: mira ${n}`, p.dibujo || { datos: idea.mira.datos, estado: p.estado || {} }, idea.mira.pieza || idea.pieza));
    idea.ejemplos.forEach((e, n) => agregar(`${idea.id}: ejemplo ${n + 1}`, e.figura, idea.pieza));
    for (let semilla = 0; semilla < 400; semilla++) for (const momento of ['resuelve', 'ahoraTu']) {
      const caso = idea[momento].generar(semilla);
      agregar(`${idea.id}: ${momento} ${semilla}`, caso.dibujo, idea[momento].pieza || idea.pieza);
      if (caso.pasos) caso.pasos.forEach((p, n) => agregar(`${idea.id}: ${momento} ${semilla} paso ${n}`, p.dibujo, idea[momento].pieza || idea.pieza));
    }
  }
  return todas;
}

// Intersecciones por intervalos: no reutiliza el algoritmo que coloca los rótulos de la pieza.
const solapan = (a, b) => Math.min(a.x1, b.x1) > Math.max(a.x0, b.x0) + 1e-7 &&
  Math.min(a.y1, b.y1) > Math.max(a.y0, b.y0) + 1e-7;
function atraviesa(caja, a, b, grosor = 0) {
  let inicio = 0, fin = 1;
  for (const [lo, hi, origen, delta] of [
    [caja.x0 - grosor, caja.x1 + grosor, a[0], b[0] - a[0]],
    [caja.y0 - grosor, caja.y1 + grosor, a[1], b[1] - a[1]],
  ]) {
    if (Math.abs(delta) < 1e-10) { if (origen <= lo || origen >= hi) return false; }
    else {
      const t0 = (lo - origen) / delta, t1 = (hi - origen) / delta;
      inicio = Math.max(inicio, Math.min(t0, t1));
      fin = Math.min(fin, Math.max(t0, t1));
      if (fin <= inicio + 1e-10) return false;
    }
  }
  return fin > inicio + 1e-10;
}

test('Impulso y choques: figuras finitas, con margen y rótulos sin cruces en todas las ideas', () => {
  const todas = figuras();
  assert.ok(todas.length >= 4800, 'se examinan los dos generadores de las seis ideas');
  for (const { nombre, f } of todas) {
    if (f.pieza === 'ejes') {
      const g = ejes.geometria(f.datos);
      for (const curva of [...(f.datos.curvas || []), ...(f.datos.areas || [])]) for (const [t, fuerza] of curva.puntos || []) {
        const x = g.X(t), y = g.Y(fuerza);
        assert.ok(Number.isFinite(x) && Number.isFinite(y), `${nombre}: punto de F–t no finito`);
        assert.ok(x >= 4 && x <= 316 && y >= 4 && y <= g.alto - 4, `${nombre}: punto de F–t fuera del lienzo`);
      }
      assert.doesNotMatch(ejes.dibujar(f.datos, f.estado || {}), /NaN|undefined|\[object Object\]/, nombre);
      continue;
    }
    assert.equal(f.pieza, 'fis-estatica', nombre);
    const g = figura.geometria(f.datos, f.estado || {});
    const datos = f.datos.cortes ? { ...f.datos, ...f.datos.cortes[Math.max(0, Math.min(f.datos.cortes.length - 1, Math.round((f.estado || {}).corte || 0)))] } : f.datos;
    assert.equal(g.W, 320, nombre);
    for (const b of [...g.rotulos, ...g.objetos]) {
      assert.ok([b.x0, b.x1, b.y0, b.y1].every(Number.isFinite), `${nombre}: caja no finita`);
      assert.ok(b.x0 >= 4 - 1e-7 && b.x1 <= g.W - 4 + 1e-7 && b.y0 >= 4 - 1e-7 && b.y1 <= g.H - 4 + 1e-7,
        `${nombre}: fuera del margen: ${b.texto || b.nombre} ${JSON.stringify(b)}`);
    }
    for (const a of g.flechas) for (const [x, y] of [[a.x1, a.y1], [a.x2, a.y2]]) assert.ok(x >= 4 && x <= g.W - 4 && y >= 4 && y <= g.H - 4, `${nombre}: flecha fuera del margen`);
    for (let i = 0; i < g.rotulos.length; i++) {
      const r = g.rotulos[i];
      for (const otro of g.rotulos.slice(i + 1)) assert.ok(!solapan(r, otro), `${nombre}: rótulos superpuestos: ${r.texto} / ${otro.texto}`);
      for (const l of datos.lineas || []) assert.ok(!atraviesa(r, l.de, l.a, 0.6), `${nombre}: una guía cruza ${r.texto}`);
      for (const a of g.flechas) {
        assert.ok(!atraviesa(r, [a.x1, a.y1], [a.x2, a.y2], 1.5), `${nombre}: una flecha cruza ${r.texto}`);
        for (const lado of [-1, 1]) {
          const base = [a.x2 - 8 * a.ux - lado * 4 * a.uy, a.y2 - 8 * a.uy + lado * 4 * a.ux];
          assert.ok(!atraviesa(r, base, [a.x2, a.y2]), `${nombre}: punta de flecha cruza ${r.texto}`);
        }
      }
    }
    assert.doesNotMatch(figura.dibujar(f.datos, f.estado || {}), /NaN|undefined|\[object Object\]/, nombre);
  }
});
