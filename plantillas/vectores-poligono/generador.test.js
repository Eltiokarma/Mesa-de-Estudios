// Pruebas del generador G7 (polígono regular): casos.json (verificados aparte, a ciegas) y un
// recálculo independiente con el radio del polígono en cada uno de 600 problemas.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// Radio de la circunferencia circunscrita: L/√3, L/√2 o L (no se usa el seno).
const RADIO = { 3: L => L / Math.sqrt(3), 4: L => L / Math.SQRT2, 6: L => L };
function recalcular(p) {
  const { tipo, n, L } = p._datos;
  if (tipo === 'desde-vertice') return n * RADIO[n](L);
  if (tipo === 'lados-menos-uno') return L;
  return RADIO[n](L);
}
probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => Math.abs(a - b) < 1e-7 });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
  });
}

test('los módulos se escriben como entero o k√n', () => {
  for (let s = 0; s < 300; s++) for (const a of gen.generar(s).alternativas) assert.ok(!/,\d/.test(a.texto), a.texto);
});

// ---------- Escena viva (docs/escena-viva.md): el polígono con sus flechas a escala ----------
const { probarViva } = require('../../nucleo/kit/piezas/probar-viva.js');
probarViva(gen, {
  semillas: 300, pieza: 'flechas',
  final: (p, fin, s) => {
    const d = p.escena.datos, res = d.resultante;
    assert.ok(fin.includes(`R = ${res.valor}`), `semilla ${s}: el final no rotula la resultante`);
    // Fidelidad: la resultante dibujada es la suma de las flechas dadas (no punteadas) y mide la respuesta.
    const dadas = d.flechas.filter(f => !f.paso);
    const sx = dadas.reduce((a, f) => a + f.a[0] - f.de[0], 0), sy = dadas.reduce((a, f) => a + f.a[1] - f.de[1], 0);
    assert.ok(Math.abs(res.a[0] - res.de[0] - sx) < 1e-9 && Math.abs(res.a[1] - res.de[1] - sy) < 1e-9, `semilla ${s}: R no es la suma`);
    assert.ok(Math.abs(Math.hypot(sx, sy) - p.respuesta.valor) < 1e-7);
    // El lado rotulado mide L.
    const l = d.segmentos[0];
    assert.ok(Math.abs(Math.hypot(l.a[0] - l.de[0], l.a[1] - l.de[1]) - p._datos.L) < 1e-9);
  },
});
