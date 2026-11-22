'use strict';

// Comprobación geométrica de la primera idea, sin navegador.
// Las cajas de texto las mide la pieza común; las colisiones se calculan aquí
// por intervalos, sin reutilizar su algoritmo de colocación de rótulos.
const test = require('node:test');
const assert = require('node:assert/strict');
const def = require('./impulso-y-choques.js');
const pieza = require('../../../nucleo/kit/piezas/fis-estatica.js');
const idea = def.ideas.find(x => x.id === 'cantidad-movimiento');

function figuras() {
  const out = [];
  const add = (nombre, f) => { if (f) out.push({ nombre, figura: f }); };
  for (let mB = 1; mB <= 4; mB++) for (let vB = 1; vB <= 4; vB++) {
    for (const t of [0, 0.17, 0.5, 1]) add(`juega m=${mB} v=${vB} t=${t}`, idea.juega.dibujo({ mB, vB, t }));
  }
  idea.ejemplos.forEach((e, i) => add(`ejemplo ${i + 1}`, e.figura));
  add('predice', idea.predice.dibujo);
  add('predice revelar', idea.predice.revelar);
  idea.mira.pasos.forEach((p, i) => add(`mira ${i + 1}`, { pieza: idea.mira.pieza, datos: idea.mira.datos, estado: p.estado }));
  idea.lee.tarjetas.forEach((t, i) => add(`lee ${i + 1}`, t.dibujo));
  add('regla', idea.regla.dibujo);
  for (let s = 0; s < 400; s++) for (const momento of ['resuelve', 'ahoraTu']) {
    add(`${momento} semilla ${s}`, idea[momento].generar(s).dibujo);
  }
  return out;
}

const solapan = (a, b) => Math.min(a.x1, b.x1) > Math.max(a.x0, b.x0) + 1e-7 &&
  Math.min(a.y1, b.y1) > Math.max(a.y0, b.y0) + 1e-7;

// Intersección segmento/caja mediante intervalos paramétricos independientes.
// Se incluye el grosor del trazo; tocar únicamente el contorno no cuenta.
function atraviesa(caja, a, b, grosor = 0) {
  let ini = 0, fin = 1;
  for (const [lo, hi, origen, delta] of [
    [caja.x0 - grosor, caja.x1 + grosor, a[0], b[0] - a[0]],
    [caja.y0 - grosor, caja.y1 + grosor, a[1], b[1] - a[1]],
  ]) {
    if (Math.abs(delta) < 1e-10) { if (origen <= lo || origen >= hi) return false; }
    else {
      const t0 = (lo - origen) / delta, t1 = (hi - origen) / delta;
      ini = Math.max(ini, Math.min(t0, t1));
      fin = Math.min(fin, Math.max(t0, t1));
      if (fin <= ini + 1e-10) return false;
    }
  }
  return fin > ini + 1e-10;
}

function datosVisibles(f) {
  const d = f.datos, e = f.estado || {};
  return d.cortes ? { ...d, ...d.cortes[Math.max(0, Math.min(d.cortes.length - 1, Math.round(e.corte || 0)))] } : d;
}

test('cantidad de movimiento: 887 figuras dentro del lienzo con margen de cuatro unidades', () => {
  const casos = figuras();
  assert.equal(casos.length, 887);
  for (const { nombre, figura: f } of casos) {
    assert.equal(f.pieza, 'fis-estatica', nombre);
    const g = pieza.geometria(f.datos, f.estado || {});
    assert.equal(g.W, 320, nombre);
    for (const b of [...g.rotulos, ...g.objetos]) {
      assert.ok([b.x0, b.x1, b.y0, b.y1].every(Number.isFinite), `${nombre}: caja no finita`);
      assert.ok(b.x0 >= 4 - 1e-7 && b.x1 <= g.W - 4 + 1e-7 && b.y0 >= 4 - 1e-7 && b.y1 <= g.H - 4 + 1e-7,
        `${nombre}: fuera del margen ${b.texto || b.nombre}: ${JSON.stringify(b)}`);
    }
    for (const a of g.flechas) for (const [x, y] of [[a.x1, a.y1], [a.x2, a.y2]]) {
      assert.ok(x >= 4 && x <= g.W - 4 && y >= 4 && y <= g.H - 4, `${nombre}: flecha fuera del margen`);
    }
    assert.doesNotMatch(pieza.dibujar(f.datos, f.estado || {}), /NaN|undefined|\[object Object\]/, nombre);
  }
});

test('cantidad de movimiento: rótulos legibles sin cruces con otros rótulos, guías o flechas', () => {
  for (const { nombre, figura: f } of figuras()) {
    const g = pieza.geometria(f.datos, f.estado || {}), datos = datosVisibles(f);
    for (let i = 0; i < g.rotulos.length; i++) {
      const r = g.rotulos[i];
      for (const otro of g.rotulos.slice(i + 1)) assert.ok(!solapan(r, otro), `${nombre}: rótulos superpuestos: ${r.texto} / ${otro.texto}`);
      for (const l of datos.lineas || []) assert.ok(!atraviesa(r, l.de, l.a, 0.6), `${nombre}: una guía cruza ${r.texto}`);
      for (const a of g.flechas) {
        assert.ok(!atraviesa(r, [a.x1, a.y1], [a.x2, a.y2], 1.5), `${nombre}: una flecha cruza ${r.texto}`);
        // Punta triangular: los dos lados visibles, además del segmento central.
        for (const lado of [-1, 1]) {
          const base = [a.x2 - 8 * a.ux - lado * 4 * a.uy, a.y2 - 8 * a.uy + lado * 4 * a.ux];
          assert.ok(!atraviesa(r, base, [a.x2, a.y2], 0), `${nombre}: la punta de una flecha cruza ${r.texto}`);
        }
      }
    }
  }
});
