// Pruebas de «Trabajo, energía y potencia» (fis-energia): casos.json (calculados aparte, con un script que no usa el
// generador ni el motor), un recálculo independiente en 600 problemas (el trabajo como suma por pasos, el movimiento
// integrado paso a paso y las potencias como trabajo por segundo, sin plantillas/energia/motor.js ni las fórmulas del
// generador), fugas, los tipos por idea, los colores de la unidad, los códigos de error y su respaldo, el recuadro
// «Datos» en 400 semillas y que la práctica no repite ninguna Predice ni un ejemplo de la teoría.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');
const ENE = 'docs/investigacion/estatica-energia-ideas-erroneas.md';

// ---- Camino independiente ----
const g = 10, S37 = 3 / 5, C37 = 4 / 5;
const suma = (Fx, a, b, n = 20000) => { let W = 0; const h = (b - a) / n; for (let k = 0; k < n; k++) W += Fx(a + (k + 0.5) * h) * h; return W; };
// movimiento con aceleración constante a desde v0, hasta recorrer d: la rapidez al final (paso a paso)
const tras = (v0, a, d) => { let v = v0, x = 0; const dt = 1e-5; while (x < d) { v += a * dt; x += v * dt; } return v; };
const hastaParar = (v0, a) => { let v = v0, x = 0; const dt = 1e-5; while (v > 0) { v += a * dt; x += v * dt; } return x; };
function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'inclinada': return suma(() => d.F * (d.ang === 37 ? C37 : S37), 0, d.d);
    case 'roce': return suma(() => d.mu * d.m * g, 0, d.d);
    case 'oblicua': return suma(() => d.mu * (d.m * g - d.F * S37), 0, d.d);
    case 'delta': return d.m * d.v * d.v / 2 - d.m * d.v0 * d.v0 / 2;
    case 'empujon': return tras(0, (d.F - d.f) / d.m, d.d);
    case 'frenadoMu': { let lo = 0, hi = 2; for (let k = 0; k < 60; k++) { const mu = (lo + hi) / 2; if (hastaParar(d.v0, -mu * g) > d.d) lo = mu; else hi = mu; } return (lo + hi) / 2; }
    case 'epg': return d.m * g * (d.h1 - d.h0);
    case 'epe': return d.variante === 'x' ? Math.sqrt(2 * suma(x => d.k * x, 0, d.xc / 100) / d.k) * 100 : suma(x => d.k * x, 0, d.xc / 100);
    case 'estirar': return suma(x => d.k * x, d.a / 100, d.b / 100);
    case 'rampa': return tras(0, g * S37, d.h / S37);
    case 'desnivel': return Math.sqrt(d.v0 * d.v0 + 2 * g * d.dh);
    case 'vertical': { let v = 0, x = 0; const dt = 1e-6; do { v += (g - d.k * x / d.m) * dt; x += v * dt; } while (v > 0); return x; }
    case 'calor': return d.m * g * d.h - d.Q;
    case 'botes': { let E = d.H; for (let k = 0; k < d.n; k++) E -= E * d.p / 100; return E; }
    case 'aspera': return tras(0, g * S37 - d.mu * g * C37, d.h / S37);
    case 'grua': return d.m * g * d.h / (d.min ? 60 * d.t : d.t);
    case 'consumida': return d.Pu / d.ef;
    case 'tractor': return d.P * 1000 / (d.m * g * S37 + d.mu * d.m * g * C37);
    default: throw new Error(`tipo sin recálculo: ${d.tipo}`);
  }
}
const cerca = (a, b) => Math.abs(a - b) <= Math.max(3e-3, 2e-3 * Math.abs(b));

probarGenerador(gen, { semillas: 600, recalcular, igual: cerca });
probarFugas(gen);

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla} (${c.entrada.tipo})`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(cerca(p.respuesta.valor, c.esperado.respuesta), `${p.respuesta.valor} contra ${c.esperado.respuesta}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto.replace(/[  ]/g, ' '), c.esperado.texto.replace(/[  ]/g, ' '));
  });
}

test('tipos por idea: las seis ideas de la unidad, cada tipo con su nivel y todos salen', () => {
  const ideas = require('../../contenido/teoria/fisica/trabajo-y-energia.js').ideas.map(i => i.id);
  assert.deepEqual(Object.keys(gen.TIPOS_POR_IDEA), ideas);
  for (const [idea, tipos] of Object.entries(gen.TIPOS_POR_IDEA)) {
    const vistos = new Set();
    for (let s = 0; s < 300; s++) { const p = gen.generar(s, { idea }); assert.equal(p._datos.idea, idea); vistos.add(p._datos.tipo); }
    assert.deepEqual([...vistos].sort(), [...tipos].sort(), idea);
    assert.ok(tipos.some(t => gen.NIVEL[t] === 3), `${idea}: llega al de examen`);
  }
});

test('cada error trae su código, su respaldo y su fuente; la explicación empieza por lo bien hecho, en una oración, y muestra su valor', () => {
  const ids = new Set();
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas.filter(x => x.error)) {
      const e = a.error;
      ids.add(e.id);
      assert.equal(e.respaldo, { W1: 'documentado', W14: 'documentado', W15: 'parcial' }[e.id] || 'hipotesis', `semilla ${s}: ${e.id}`);
      assert.equal(e.fuente, ENE);
      // Empieza por lo bien hecho con una oración completa («… está bien, pero …», «Es cierto que …»), ya no con «Bien X.»
      assert.match(e.explicacion, /\bbien\b|cierto|comienzo/i, `semilla ${s}: ${e.explicacion}`);
      assert.ok(!/^Bien\b/.test(e.explicacion) && !/_/.test(e.explicacion), `semilla ${s}: telegrama o «_» crudo: ${e.explicacion}`);
      assert.ok(e.explicacion.includes(a.texto) || e.explicacion.includes(a.texto.replace(/ [A-Za-z/]+$/, '')), `semilla ${s}: «${e.explicacion}» no muestra ${a.texto}`);
      assert.ok(!/\b(alternativa|opción|letra) [A-E]\b|\bla [A-E]\b/.test(e.explicacion), `semilla ${s}: nombra una letra`);
    }
  }
  const informe = fs.readFileSync(path.join(__dirname, '..', '..', ENE), 'utf8');
  for (const id of ids) assert.ok(informe.includes(id), `${id} no está en ${ENE}`);
});

test('un color por clase de fuerza: peso carmín, normal violeta, mano o cuerda naranja, rozamiento turquesa; sin verde', () => {
  const COLOR = { mg: 'h', N: 'f', F: 'o', f: 'i' };
  for (let s = 0; s < 1000; s++) {
    const p = gen.generar(s);
    for (const [k, x] of Object.entries(p.variables)) assert.equal(x.color, COLOR[k], `semilla ${s}: ${k}`);
  }
});

test('datos en líneas cortas, sin la respuesta ni consejos; la práctica no repite las predicciones ni los ejemplos', () => {
  const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), ok = p.alternativas.find(a => a.correcta).texto;
    assert.ok(Array.isArray(p.datos) && p.datos.length >= 1, `semilla ${s}`);
    for (const l of p.datos) {
      assert.ok(l.split(/\s+/).filter(w => /\p{L}/u.test(w)).length <= 22, `semilla ${s}: «${l}»`);
      assert.ok(!/\b(recuerda|fíjate|ojo|conviene|debes)\b/i.test(l), `semilla ${s}: consejo «${l}»`);
      assert.ok(!new RegExp(`(?<![\\d,])${ok.replace(/[/()·]/g, '\\$&')}(?![\\d²])`).test(l), `semilla ${s}: los datos traen ${ok}`);   // «10 m/s» no es «g = 10 m/s²»
    }
    const t = plano([p.enunciado, p.pregunta]);
    assert.ok(!/mochila/.test(t), `semilla ${s}: la Predice de la idea 1`);
    assert.ok(!/de 20 kg pasa de 0/.test(t), `semilla ${s}: la Predice de la idea 2`);
    assert.ok(!/toboganes.*4 m de alto/.test(t), `semilla ${s}: la Predice de la idea 4`);
    assert.ok(!/entrega 500 W/.test(t), `semilla ${s}: la Predice de la idea 6`);
    assert.ok(!/a 37° sobre la horizontal, con 40 N, mientras avanza 5 m/.test(t), `semilla ${s}: la misión de la idea 1`);
    assert.ok(!/con 50 N, mientras avanza 6 m/.test(t) || !/37°/.test(t), `semilla ${s}: el ejemplo 1.2`);
  }
});

test('ningún error da la correcta y los casos son posibles', () => {
  for (const idea of Object.keys(gen.TIPOS_POR_IDEA)) for (let s = 0; s < 400; s++) {
    const p = gen.generar(s, { idea }), d = p._datos, ok = p.alternativas.find(a => a.correcta);
    for (const a of p.alternativas.filter(x => !x.correcta)) assert.notEqual(a.texto, ok.texto, `${d.tipo} ${s}`);
    if (d.tipo === 'oblicua') assert.ok(d.m * 10 - d.F * 0.6 > 0 && d.F * 0.8 > d.mu * (d.m * 10 - d.F * 0.6), `${d.tipo} ${s}: la cuerda levanta el bloque o no lo mueve`);
    if (d.tipo === 'aspera') assert.ok(d.mu < 0.75, `${d.tipo} ${s}: con μ ≥ tan 37° no bajaría`);
    if (d.tipo === 'frenadoMu') assert.ok(p.respuesta.valor <= 0.8, `${d.tipo} ${s}: μ_k de ${p.respuesta.valor}`);
    if (d.tipo === 'empujon') assert.ok(p.respuesta.valor <= 10, `${d.tipo} ${s}: ${p.respuesta.valor} m/s empujando a mano`);
  }
});

test('auditoría (20 nov): g en los Datos de todo problema con peso; el tractor trae la parte del peso a lo largo; el coseno en decimales', () => {
  for (const idea of Object.keys(gen.TIPOS_POR_IDEA)) for (let s = 0; s < 400; s++) {
    const p = gen.generar(s, { idea }), d = p.datos;
    if (d.some(l => /m · g|peso/.test(l))) assert.ok(d.some(l => /g = 10 m\/s²/.test(l)), `${p._datos.tipo} ${s}: sin g`);
    if (p._datos.tipo === 'tractor') assert.ok(d.some(l => /m · g · sen θ rampa abajo/.test(l)) && d.some(l => /fuerza neta es cero/.test(l)), `tractor ${s}`);
    assert.ok(!d.some(l => /3\/5|4\/5/.test(l)), `${p._datos.tipo} ${s}: coseno en fracción`);
  }
});
