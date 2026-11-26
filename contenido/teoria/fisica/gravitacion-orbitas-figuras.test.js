const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const P = require('../../../nucleo/kit/piezas/fis-gravitacion.js');
const unidad = require(process.env.GR_ORBITAS_MODULE || path.join(__dirname, 'gravitacion.js'));
const idea = unidad.ideas.find(i => i.id === 'orbita-circular');
const toca = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
function cruza(a, b, r) {
  const dentro = p => p[0] > r.x0 + 1e-6 && p[0] < r.x1 - 1e-6 && p[1] > r.y0 + 1e-6 && p[1] < r.y1 - 1e-6;
  if (dentro(a) || dentro(b)) return true;
  const o = (p, q, z) => (q[0] - p[0]) * (z[1] - p[1]) - (q[1] - p[1]) * (z[0] - p[0]);
  const esq = [[r.x0, r.y0], [r.x1, r.y0], [r.x1, r.y1], [r.x0, r.y1]];
  return esq.some((c, i) => { const d = esq[(i + 1) % 4]; return o(a, b, c) * o(a, b, d) < -1e-7 && o(c, d, a) * o(c, d, b) < -1e-7; });
}
function comprobar(figura, nombre) {
  const g = P.geometria(figura.datos, figura.estado), punto = p => assert.ok(p[0] >= 4 - 1e-8 && p[0] <= 316 + 1e-8 && p[1] >= 4 - 1e-8 && p[1] <= g.H - 4 + 1e-8, `${nombre}: fuera (${p})`);
  for (const b of [...g.rotulos, ...g.objetos]) { punto([b.x0, b.y0]); punto([b.x1, b.y1]); }
  const lineas = [...g.segmentos];
  for (const f of g.flechas) {
    punto([f.x1, f.y1]); punto([f.x2, f.y2]); f.punta.forEach(punto);
    lineas.push({ de: [f.x1, f.y1], a: [f.x2, f.y2], tipo: 'flecha' });
    f.punta.forEach((p, j) => lineas.push({ de: p, a: f.punta[(j + 1) % 3], tipo: 'punta' }));
  }
  for (const l of lineas) { punto(l.de); punto(l.a); }
  g.rotulos.forEach((r, i) => {
    for (const b of g.rotulos.slice(i + 1)) assert.ok(!toca(r, b), `${nombre}: rótulos ${r.texto}/${b.texto}`);
    for (const o of g.objetos) assert.ok(!toca(r, o), `${nombre}: ${r.texto} sobre ${o.tipo}`);
    for (const l of lineas) assert.ok(!cruza(l.de, l.a, r), `${nombre}: ${r.texto} sobre ${l.tipo}`);
  });
  const s = P.dibujar(figura.datos, figura.estado);
  assert.ok(!/NaN|undefined|Infinity/.test(s), nombre);
  return g;
}
test('órbitas: 400 estados del juego conservan márgenes y rótulos libres', () => {
  for (let s = 0; s < 400; s++) comprobar(idea.juega.dibujo({ v: [2, 4, 5, 6][s % 4], t: 500 * (Math.floor(s / 4) % 41) }), `juego ${s}`);
});
test('órbitas: todas las figuras de momentos y quince ejemplos caben y no revelan la incógnita', () => {
  const figuras = idea.lee.tarjetas.filter(t => t.dibujo).map(t => t.dibujo);
  figuras.push(idea.predice.dibujo, idea.predice.revelar, idea.regla.dibujo,
    ...idea.mira.pasos.map(p => ({ datos: idea.mira.datos, estado: p.estado })), ...idea.ejemplos.map(e => e.figura));
  figuras.forEach((f, i) => comprobar(f, `momento/ejemplo ${i}`));
  for (const e of idea.ejemplos) {
    const textos = P.geometria(e.figura.datos, e.figura.estado).rotulos;
    assert.ok(!textos.some(r => r.texto.startsWith('E_M =')), 'la energía no aparece resuelta');
    for (const r of textos.filter(r => r.texto.includes('?'))) assert.equal(r.color, 'tinta', 'la incógnita permanece en tinta');
  }
});
test('órbitas: figuras de ambos generadores en 400 semillas', () => {
  for (let s = 0; s < 400; s++) {
    comprobar(idea.resuelve.generar(s).dibujo, `resuelve ${s}`);
    comprobar(idea.ahoraTu.generar(s).dibujo, `ahora ${s}`);
  }
});
