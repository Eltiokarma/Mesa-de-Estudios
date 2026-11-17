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

// ---------- Escena viva (docs/escena-viva.md): flechas a escala, paralelogramo y regla ----------
const { probarViva } = require('../../nucleo/kit/piezas/probar-viva.js');
probarViva(gen, {
  semillas: 300, pieza: 'flechas',
  conEscena: p => ['resultante', 'diferencia', 'desde-max-min'].includes(p._datos.tipo),
  final: (p, fin, s) => {
    const d = p.escena.datos, res = d.resultante;
    assert.ok(fin.includes(`${res.rotulo} = ${res.valor}`), `semilla ${s}: el final no rotula la resultante`);
    if (d.regla) assert.ok(fin.includes(`${d.regla.texto} ✓`));
    // Fidelidad: la diagonal dibujada mide la respuesta, y A y B miden sus módulos.
    assert.ok(Math.abs(Math.hypot(res.a[0] - res.de[0], res.a[1] - res.de[1]) - p.respuesta.valor) < 1e-9, `semilla ${s}`);
    const [A, B] = d.flechas, dd = p._datos;
    const a = dd.a !== undefined ? dd.a : (dd.M + dd.m) / 2, b = dd.b !== undefined ? dd.b : (dd.M - dd.m) / 2;
    assert.ok(Math.abs(Math.hypot(...A.a) - a) < 1e-9 && Math.abs(Math.hypot(...B.a) - b) < 1e-9);
    assert.ok(fin.includes(`>${dd.t}°<`), 'el ángulo está rotulado');
  },
});

test('escena viva: los tipos de longitud se arrastran casi siempre', () => {
  let con = 0, arr = 0;
  for (let s = 0; s < 300; s++) { const p = gen.generar(s); if (p.escena) { con++; if (p.respuesta.tipo === 'arrastrar') arr++; } }
  assert.ok(arr / con > 0.6, `${arr} de ${con}`);
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
  assert.ok(d.includes('A² + B² + 2AB·cos θ'), `semilla ${s}: falta la ley de cosenos`);
  if (x.tipo === 'angulo-desde-R' || x.tipo === 'suma-diferencia') {
    // Se pide el ángulo: va la tabla entera y nunca «cos θ = …» resuelto.
    for (const t of [37, 53, 60]) assert.ok(d.includes(`cos ${t}° = `), `semilla ${s}: falta cos ${t}°`);
    assert.ok(d.includes('cos(180° − α) = −cos α') && !/cos \d+° = −/.test(d), `semilla ${s}: va la reducción, no el valor con signo`);
    assert.ok(!/cos θ = /.test(d), `semilla ${s}: los datos dan cos θ`);
  } else assert.ok(d.includes(`cos ${x.t}° = `), `semilla ${s}: falta cos ${x.t}°`);
  if (x.tipo === 'desde-max-min') assert.ok(d.includes('A + B') && d.includes('A − B'), `semilla ${s}: falta el máximo y el mínimo`);
}
