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

// 19 nov (Movimiento circular, fase 3; docs/etapa5/propuesta-fisica.md §7): la práctica por idea.
test('generar(semilla, { idea }): cada idea de Movimiento circular saca solo sus tipos; sin idea, los de siempre', () => {
  const gen = require('./generador.js');
  const IDEAS = ['arco-y-radian', 'periodo-y-frecuencia', 'velocidad-tangencial', 'rapidez-constante-acelera', 'mcuv', 'dos-aceleraciones'];
  const def = require('../../contenido/teoria/fisica/movimiento-circular.js');
  assert.deepEqual(def.ideas.map(i => i.id), IDEAS);
  for (const [idea, tipos] of Object.entries(gen.TIPOS_POR_IDEA)) {
    assert.ok(IDEAS.includes(idea), `«${idea}» no es una idea de la unidad`);
    for (let s = 0; s < 60; s++) {
      const p = gen.generar(s, { unidad: 'fisica.movimiento-circular', idea });
      assert.ok(tipos.includes(p._datos.tipo), `${idea}, semilla ${s}: tipo ${p._datos.tipo}`);
    }
  }
  for (let s = 0; s < 30; s++) assert.deepEqual(gen.generar(s, { unidad: 'fisica.movimiento-circular' }), gen.generar(s), 'sin idea, el mismo problema de antes');
});

// 19 nov (contrato, punto 13): cada problema da sus datos, una fórmula o equivalencia por línea, sin la respuesta.
test('datos en 400 semillas: lista no vacía, líneas de 22 palabras o menos, sin la respuesta', () => {
  const gen = require('./generador.js');
  const palabras = t => String(t).trim().split(/\s+/).length;
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    assert.ok(Array.isArray(p.datos) && p.datos.length >= 1, `semilla ${s}: sin datos`);
    for (const l of p.datos) assert.ok(typeof l === 'string' && palabras(l) <= 22, `semilla ${s}: «${l}»`);
    const bien = p.alternativas.find(a => a.correcta).texto, todo = p.datos.join(' ');
    // 60, 360, 100, 1000 y 3600 son de las equivalencias (1 min = 60 s, 1 vuelta = 360°…), no de la respuesta.
    for (const n of String(bien).match(/\d+(?:,\d+)?/g) || []) if (n.replace(',', '').length >= 2 && !['60', '360', '100', '1000', '3600'].includes(n)) assert.ok(!new RegExp(`(?<![\\d,])${n}(?![\\d,])`).test(todo), `semilla ${s}: los datos traen ${n}, de la respuesta`);
  }
});
