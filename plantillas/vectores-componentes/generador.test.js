// Pruebas del generador G2 (componentes con notables): casos.json (verificados aparte, a ciegas)
// y un recálculo independiente con la tabla de academia en cada uno de 600 problemas.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// Seno y coseno de academia por cuadrante: se reduce al primer cuadrante y se usa la tabla.
const T = { 0: [1, 0], 30: [Math.sqrt(3) / 2, 0.5], 37: [0.8, 0.6], 45: [Math.SQRT1_2, Math.SQRT1_2], 53: [0.6, 0.8], 60: [0.5, Math.sqrt(3) / 2], 90: [0, 1] };
function cs(t) {
  const q = Math.floor(t / 90), r = t % 90;
  let [c, s] = T[r];
  for (let k = 0; k < q; k++) [c, s] = [-s, c];
  return [c, s];
}
function resultante(d) {
  let x = 0, y = 0;
  d.vectores.forEach((w, i) => { const [c, s] = cs(w.angulo); x += d.coef[i] * w.m * c; y += d.coef[i] * w.m * s; });
  return [x, y];
}
function recalcular(p) {
  const d = p._datos, [x, y] = resultante(d);
  if (d.tipo !== 'angulo') return Math.hypot(x, y);
  // El ángulo notable cuyo seno y coseno de academia apuntan como (x, y).
  const R = Math.hypot(x, y);
  for (let t = 0; t < 360; t++) {
    const r = t % 90; if (!T[r]) continue;
    const [c, s] = cs(t);
    if (Math.abs(c - x / R) < 1e-9 && Math.abs(s - y / R) < 1e-9) return t;
  }
  return NaN;
}
probarGenerador(gen, { semillas: 600, recalcular });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
  });
}

test('salen los tres tipos, las cuatro familias y los puntos cardinales', () => {
  const tipos = new Set(), fams = new Set(); let card = 0, eq = 0;
  for (let s = 0; s < 400; s++) {
    const d = gen.generar(s)._datos; tipos.add(d.tipo); fams.add(d.fam); card += d.cardinal; eq += d.equilibrio;
  }
  assert.equal(tipos.size, 3); assert.equal(fams.size, 4); assert.ok(card > 10 && eq > 10);
});

test('los módulos se escriben como entero o k√n, sin decimales', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    if (p._datos.tipo === 'angulo') continue;
    for (const a of p.alternativas) assert.ok(!/,\d/.test(a.texto), `semilla ${s}: ${a.texto}`);
  }
});

// ---------- Escena viva (docs/escena-viva.md): ejes con î y ĵ, componentes, cola con punta y R ----------
const { probarViva } = require('../../nucleo/kit/piezas/probar-viva.js');
probarViva(gen, {
  semillas: 300, pieza: 'flechas',
  final: (p, fin, s) => {
    const d = p.escena.datos, res = d.resultante;
    assert.ok(fin.includes(`${res.rotulo} = ${res.valor}`), `semilla ${s}: el final no rotula la resultante`);
    // Notación: con el ángulo, el rótulo es el vector (R⃗ = 8î − 6ĵ); con el módulo, el largo (R = 10 u).
    assert.equal(res.rotulo, p._datos.tipo === 'angulo' ? 'R\u20D7' : 'R', `semilla ${s}: rótulo de R`);
    assert.ok(fin.includes('>î<') && fin.includes('>ĵ<'), 'los ejes llevan î y ĵ');
    // Fidelidad: cada vector dado mide su módulo, y R es la suma con coeficientes.
    const dados = d.flechas.filter(f => !f.paso && !f.discontinua);
    p._datos.vectores.forEach((w, i) => assert.ok(Math.abs(Math.hypot(...dados[i].a) - w.m) < 1e-9));
    const sx = dados.reduce((a, f, i) => a + p._datos.coef[i] * f.a[0], 0), sy = dados.reduce((a, f, i) => a + p._datos.coef[i] * f.a[1], 0);
    assert.ok(Math.abs(res.a[0] - sx) < 1e-9 && Math.abs(res.a[1] - sy) < 1e-9, `semilla ${s}: R no es la suma`);
    if (p._datos.tipo === 'angulo') assert.ok(Math.abs(((Math.atan2(sy, sx) * 180 / Math.PI + 360) % 360) - p.respuesta.valor) < 1, 'R apunta al ángulo de la respuesta (con 37° de academia)');
    else assert.ok(Math.abs(Math.hypot(sx, sy) - p.respuesta.valor) < 1e-9);
    // La cadena cola con punta termina en el extremo de R.
    const cadena = d.flechas.filter(f => f.paso === 2);
    if (cadena.length) { const ult = cadena[cadena.length - 1].a; assert.ok(Math.abs(ult[0] - sx) < 1e-9 && Math.abs(ult[1] - sy) < 1e-9); }
  },
});

// Recuadro «Datos» (docs/plan-calidad.md, contrato, punto 13): datos y fórmulas en una lista, una por línea, en texto
// plano y cortas (22 palabras o menos). El generador dice qué se puede usar; el alumno decide qué usa.
test('datos: una lista de líneas cortas en texto plano, en todos los tipos', () => {
  const palabras = t => t.split(/\s+/).filter(w => /\p{L}/u.test(w)).length;
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    assert.ok(Array.isArray(p.datos) && p.datos.length, `semilla ${s}: datos debe ser una lista no vacía`);
    for (const l of p.datos) {
      assert.ok(typeof l === 'string' && l.trim() === l && l.length, `semilla ${s}: línea vacía o con espacios`);
      assert.ok(palabras(l) <= 22, `semilla ${s}: «${l}» tiene ${palabras(l)} palabras`);
      assert.ok(!/<[a-z/]|\bnull\b|\bNaN\b|\bundefined\b|\d\.\d/i.test(l), `semilla ${s}: «${l}»`);
    }
    assert.equal(new Set(p.datos).size, p.datos.length, `semilla ${s}: líneas repetidas`);
    revisarDatos(p, p.datos.join('\n'), s);
  }
});

function revisarDatos(p, d, s) {
  const x = p._datos;
  // El problema mide el signo por cuadrante: ningún seno ni coseno se da con su signo; va la referencia y la regla.
  assert.ok(!/(cos|sen) \d+° = −/.test(d), `semilla ${s}: un seno o coseno con signo`);
  assert.ok(/Valores de academia: sen (30|37|45|60)°/.test(d), `semilla ${s}: falta la tabla de academia`);
  if (!x.cardinal && (x.tipo === 'angulo' || x.vectores.some(w => w.angulo > 90 && w.angulo % 90 !== 0)))
    assert.ok(d.includes('180° + α') && d.includes('III (−; −)'), `semilla ${s}: falta la regla de cuadrantes`);
  assert.ok(d.includes('A·cos θ'), `semilla ${s}: falta la fórmula de las componentes`);
  if (x.tipo === 'angulo') assert.ok(d.includes('tan 37° = 3/4'), `semilla ${s}: falta la tabla de tangentes`);
  else assert.ok(d.includes('√(Rx² + Ry²)'), `semilla ${s}: falta el módulo`);
}
