// Pruebas del generador G2 (transmisión): casos.json (verificados aparte, a ciegas) y un recálculo
// independiente en cada uno de 600 problemas.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// Camino independiente: se gira la primera rueda un ángulo pequeño durante dt y se propaga lo que
// avanza cada borde (el arco) por las fajas y contactos, o el mismo ángulo por los ejes. La rapidez
// angular de la última es su ángulo entre dt. El bloque sube lo que se enrolla su cuerda.
const dt = 1e-3;
function girarCadena(ruedas, angulo0) {
  let ang = angulo0, sentido = 1;
  for (let k = 1; k < ruedas.length; k++) {
    const q = ruedas[k];
    if (q.union !== 'eje') { const arco = ang * ruedas[k - 1].r; ang = arco / q.r; }
    if (q.union === 'cruzada' || q.union === 'engranaje') sentido = -sentido;
  }
  return { ang, sentido };
}
function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'movil') {
    // Cuánto se acorta cada tramo en dt; la polea sube la mitad de lo que se acorta la cuerda entera.
    const corto1 = d.w1 * dt * d.r1 / 100, corto2 = (d.suelta ? -1 : 1) * d.w2 * dt * d.r2 / 100;
    return Math.abs(corto1 + corto2) / 2 / dt;
  }
  if (d.tipo === 'bloque') {
    const ang0 = (d.modo === 'rad' ? d.w1 : d.w1 * 2 * Math.PI / 60) * dt;
    const g1 = d.fajaEnMayor ? d.R : d.r, g2 = d.fajaEnMayor ? d.r : d.R;
    const angB = ang0 * d.rA / g1;          // el arco de A pasa por la faja a la garganta g1
    return angB * (g2 / 100) / dt;          // lo que se enrolla en la garganta g2, en metros
  }
  // tren, contacto, sentido y alfa (en «alfa», el mismo razonamiento con aT = α·r en vez de v)
  const ang0 = (d.modo === 'rad' ? d.w1 : d.w1 * 2 * Math.PI / 60) * dt;
  const { ang, sentido } = girarCadena(d.ruedas, ang0);
  let w = ang / dt;
  if (d.modo === 'rpm') w = w * 60 / (2 * Math.PI);
  if (d.tipo === 'sentido') return (d.sentidoA === 'horario' ? 1 : -1) * sentido * w;
  return w;
}
probarGenerador(gen, { semillas: 600, recalcular: p => {
  const r = recalcular(p);
  return Math.abs(r - p.respuesta.valor) < 1e-9 * Math.max(1, Math.abs(r)) ? p.respuesta.valor : r;
} });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
    const correcta = p.alternativas.find(a => a.correcta);
    assert.equal(correcta.texto, c.esperado.exacta);
  });
}

test('salen los seis tipos y las alternativas se escriben igual', () => {
  const tipos = new Set();
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s); tipos.add(p._datos.tipo);
    const alt = p.alternativas;
    const conPi = alt.filter(a => a.texto.includes('π')).length;
    assert.ok(conPi === 0 || conPi === alt.length, `semilla ${s}: mezcla π con números`);
    const unidad = a => a.texto.replace(/^[\d ,π/]+/, '').replace(/horario|antihorario/, '');
    assert.equal(new Set(alt.map(unidad)).size, 1, `semilla ${s}: unidades distintas (${alt.map(a => a.texto)})`);
    if (p._datos.tipo === 'sentido') {
      assert.ok(alt.every(a => /sentido (anti)?horario$/.test(a.texto)));
      assert.ok(alt.some(a => Math.sign(a.valor) !== Math.sign(p.respuesta.valor)), `semilla ${s}: todas giran al mismo lado`);
    }
    for (const a of alt) assert.ok(!/\d,\d{3}/.test(a.texto), `semilla ${s}: más de dos decimales (${a.texto})`);
  }
  assert.deepEqual([...tipos].sort(), ['alfa', 'bloque', 'contacto', 'movil', 'sentido', 'tren']);
});
