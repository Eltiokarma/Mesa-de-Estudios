// Pruebas del generador G1 (dos vectores, ley de cosenos): casos.json (verificados aparte, a ciegas)
// y un recálculo independiente por componentes en cada uno de 600 problemas.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// Camino independiente: A sobre el eje x y B = b·(cos θ, sen θ) con el triángulo 3-4-5 de academia;
// la resultante sale de sus componentes, y el ángulo, del coseno que da la ley de cosenos.
const CS = { 37: [0.8, 0.6], 53: [0.6, 0.8], 60: [0.5, Math.sqrt(3) / 2], 90: [0, 1], 120: [-0.5, Math.sqrt(3) / 2], 127: [-0.6, 0.8], 143: [-0.8, 0.6] };
const porComp = (a, b, t, s) => Math.hypot(a + s * b * CS[t][0], s * b * CS[t][1]);
function anguloDe(c) {
  for (const [t, [co]] of Object.entries(CS)) if (Math.abs(co - c) < 1e-9) return Number(t);
  return NaN;
}
function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'resultante') return porComp(d.a, d.b, d.t, 1);
  if (d.tipo === 'diferencia') return porComp(d.a, d.b, d.t, -1);
  if (d.tipo === 'angulo-desde-R') {
    const R = porComp(d.a, d.b, d.t, 1); // el dato que ve el alumno
    return anguloDe((R * R - d.a * d.a - d.b * d.b) / (2 * d.a * d.b));
  }
  if (d.tipo === 'suma-diferencia') {
    // Rombo: |A + B| / |A − B| = cot(θ/2). Se busca el θ notable que da esa razón.
    const k = Math.sqrt(d.k2), razon = d.alReves ? 1 / k : k;
    for (const t of Object.keys(CS).map(Number)) {
      const S = porComp(d.a, d.a, t, 1), D = porComp(d.a, d.a, t, -1);
      if (Math.abs(S / D - razon) < 1e-9) return t;
    }
    return NaN;
  }
  const a = (d.M + d.m) / 2, b = (d.M - d.m) / 2;
  return porComp(a, b, d.t, 1);
}
probarGenerador(gen, { semillas: 600, recalcular });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
  });
}

test('salen los cinco tipos y la correcta se escribe como sus distractores', () => {
  const tipos = new Set();
  for (let s = 0; s < 300; s++) {
    const p = gen.generar(s); tipos.add(p._datos.tipo);
    const conGrado = p.alternativas.filter(a => a.texto.endsWith('°')).length;
    assert.ok(conGrado === 0 || conGrado === p.alternativas.length, `semilla ${s}: mezcla ángulos y módulos`);
    for (const a of p.alternativas) assert.ok(!/,\d/.test(a.texto) || conGrado, `semilla ${s}: decimal en un módulo (${a.texto})`);
  }
  assert.equal(tipos.size, 5);
});
