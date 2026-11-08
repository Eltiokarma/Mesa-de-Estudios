// Pruebas del generador G4 (lo girado en el n-ésimo segundo): casos.json (verificados aparte, a
// ciegas) y un recálculo independiente en cada uno de 600 problemas.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// Camino independiente: se simula el giro a pasos de 1/1000 s (trapecios bajo ω-t) y se mide lo
// girado entre t = n − 1 y t = n; la α desconocida se busca por bisección.
function giradoEnSegundo(w0, al, n) {
  let w = w0, th = 0, antes = 0;
  const dt = 1e-3;
  for (let i = 0; i < n * 1000; i++) {
    if (i === (n - 1) * 1000) antes = th;
    const w2 = w + al * dt; th += (w + w2) / 2 * dt; w = w2;
  }
  return th - antes;
}
function alfaDesde(thetaK, k) {
  let a = 0, b = 1e3;
  for (let i = 0; i < 100; i++) { const m = (a + b) / 2; if (giradoEnSegundo(0, m, k) < thetaK) a = m; else b = m; }
  return (a + b) / 2;
}
function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'impares') return giradoEnSegundo(0, 1, d.m) / giradoEnSegundo(0, 1, 1);
  if (d.tipo === 'alfa') return alfaDesde(d.thetaK, d.k);
  if (d.tipo === 'desde-k') return giradoEnSegundo(0, alfaDesde(d.thetaK, d.k), d.m);
  return giradoEnSegundo(d.w0, d.alfa, d.m);
}
probarGenerador(gen, { semillas: 600, recalcular: p => {
  const r = recalcular(p);
  return Math.abs(r - p.respuesta.valor) < 1e-7 * Math.max(1, Math.abs(r)) ? p.respuesta.valor : r;
} });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

test('salen los cuatro tipos y las alternativas llevan la misma unidad', () => {
  const tipos = new Set();
  for (let s = 0; s < 300; s++) {
    const p = gen.generar(s); tipos.add(p._datos.tipo);
    const unidad = a => a.texto.replace(/^[\d ,]+/, '').replace(/^vuelta(?=$|\/)/, 'vueltas');
    assert.equal(new Set(p.alternativas.map(unidad)).size, 1, `semilla ${s}: unidades distintas`);
  }
  assert.deepEqual([...tipos].sort(), ['alfa', 'con-omega0', 'desde-k', 'impares']);
});
