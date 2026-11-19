// Pruebas de «Dinámica» (fis-dinamica): casos.json (calculados aparte, con un script que no usa el generador ni el
// motor), un recálculo independiente en 600 problemas (cada caso con la segunda ley escrita a mano por ejes, y las
// distancias integrando el movimiento paso a paso, sin plantillas/dinamica/motor.js ni las fórmulas del generador),
// fugas, los tipos por idea, los colores de la unidad, los códigos de error y su respaldo, el recuadro «Datos» en 400
// semillas y que la práctica no repite ninguna Predice.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');
const DIN = 'docs/investigacion/dinamica-ideas-erroneas.md', EST = 'docs/investigacion/estatica-energia-ideas-erroneas.md';

// ---- Camino independiente ----
const g = 10, S37 = 3 / 5, C37 = 4 / 5;
// Avanza con aceleración a desde v0 hasta que v llega a 0 (a < 0) o hasta recorrer d (a > 0): la distancia o la rapidez.
const hastaParar = (v0, a) => { let v = v0, x = 0; const dt = 1e-5; while (v > 0) { x += v * dt + a * dt * dt / 2; v += a * dt; } return x; };
const tras = (a, t) => { let v = 0, x = 0; const dt = 1e-4; for (let k = 0; k < Math.round(t / dt); k++) { x += v * dt + a * dt * dt / 2; v += a * dt; } return { v, x }; };
function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'neta': return (d.F1 + -d.F2) / d.m;
    case 'reposo': return tras(d.F / d.m, d.t).v;
    case 'recorrido': { let lo = 0, hi = 1e4; for (let k = 0; k < 80; k++) { const Fm = (lo + hi) / 2; if (tras(Fm / d.m, d.t).x > d.d) hi = Fm; else lo = Fm; } return (lo + hi) / 2; }
    case 'pesoLugar': return d.PT / g * d.g2;
    case 'lugares': return d.m * d.g2;
    case 'levantar': return (d.T - d.m * d.g2) / d.m;
    case 'arrastre': { const N = d.m * g; return (d.F - d.mu * N) / d.m; }
    case 'frenado': return hastaParar(d.v0, -d.mu * g);
    case 'oblicua': { const N = d.m * g - d.F * S37; return (d.F * C37 - d.mu * N) / d.m; }
    case 'rampa': { const N = 1 * g * C37; return hastaParar(d.v0, -(g * S37 + d.mu * N)); }
    case 'mesa': { // dos ecuaciones: T = m1·a y m2·g − T = m2·a, resueltas por sustitución
      const a = d.m2 * g / (d.m1 + d.m2); return a; }
    case 'atwood': { const a = (d.m1 - d.m2) * g / (d.m1 + d.m2); return d.m2 * g + d.m2 * a; }
    case 'aspera': { const a = (d.m2 * g - d.mu * d.m1 * g) / (d.m1 + d.m2); return d.m1 * a + d.mu * d.m1 * g; }
    case 'balanza': return d.m * g + d.m * d.a;
    case 'grua': return d.m * g + d.m * d.a;
    case 'lectura': return Math.abs(d.N - d.m * g) / d.m;
    case 'loma': return d.m * g - d.m * d.v * d.v / d.r;
    case 'plataforma': { let lo = 0, hi = 100; for (let k = 0; k < 80; k++) { const r = (lo + hi) / 2; if (d.w * d.w * r > d.mu * g) hi = r; else lo = r; } return (lo + hi) / 2; }
    case 'rizo': return d.m * d.v * d.v / d.r - d.m * g;
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
  const ideas = require('../../contenido/teoria/fisica/dinamica.js').ideas.map(i => i.id);
  assert.deepEqual(Object.keys(gen.TIPOS_POR_IDEA), ideas);
  for (const [idea, tipos] of Object.entries(gen.TIPOS_POR_IDEA)) {
    const vistos = new Set();
    for (let s = 0; s < 300; s++) { const p = gen.generar(s, { idea }); assert.equal(p._datos.idea, idea); vistos.add(p._datos.tipo); }
    assert.deepEqual([...vistos].sort(), [...tipos].sort(), idea);
    assert.ok(tipos.some(t => gen.NIVEL[t] === 3), `${idea}: llega al de examen`);
  }
});

test('cada error trae su código, su respaldo y su fuente; la explicación empieza por lo bien hecho y muestra su valor', () => {
  const ids = new Set();
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas.filter(x => x.error)) {
      const e = a.error;
      ids.add(e.id);
      assert.equal(e.respaldo, ['D1', 'W5'].includes(e.id) ? 'documentado' : 'hipotesis', `semilla ${s}: ${e.id}`);
      assert.equal(e.fuente, e.id === 'W5' ? EST : DIN);
      assert.match(e.explicacion, /^(Bien|Así)/, `semilla ${s}: ${e.explicacion}`);
      assert.ok(e.explicacion.includes(a.texto), `semilla ${s}: «${e.explicacion}» no muestra ${a.texto}`);
      assert.ok(!/\b(alternativa|opción|letra) [A-E]\b|\bla [A-E]\b/.test(e.explicacion), `semilla ${s}: nombra una letra`);
    }
  }
  const informe = fs.readFileSync(path.join(__dirname, '..', '..', DIN), 'utf8');
  for (const id of ids) assert.ok(informe.includes(id), `${id} no está en ${DIN}`);
});

test('un color por clase de fuerza: peso carmín, normal violeta, tensión y mano naranja, rozamiento turquesa; sin verde', () => {
  const COLOR = { P: 'h', N: 'f', T: 'o', f: 'i' };
  for (let s = 0; s < 1000; s++) {
    const p = gen.generar(s);
    for (const [k, x] of Object.entries(p.variables)) assert.equal(x.color, COLOR[k], `semilla ${s}: ${k}`);
  }
});

test('datos en líneas cortas, sin la respuesta ni consejos; la práctica no repite las predicciones', () => {
  const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), ok = p.alternativas.find(a => a.correcta).texto;
    assert.ok(Array.isArray(p.datos) && p.datos.length >= 1, `semilla ${s}`);
    for (const l of p.datos) {
      assert.ok(l.split(/\s+/).filter(w => /\p{L}/u.test(w)).length <= 22, `semilla ${s}: «${l}»`);
      assert.ok(!/\b(recuerda|fíjate|ojo|conviene|debes)\b/i.test(l), `semilla ${s}: consejo «${l}»`);
      assert.ok(!new RegExp(`(?<![\\d,])${ok.replace(/[/()·]/g, '\\$&')}(?![\\d])`).test(l), `semilla ${s}: los datos traen ${ok}`);
    }
    const t = plano([p.enunciado, p.pregunta]);
    assert.ok(!/de 30 kg.*con 60 N/.test(t), `semilla ${s}: la Predice de la idea 1`);
    assert.ok(!/costal de 3 kg.*balde de 2 kg/.test(t), `semilla ${s}: la Predice de la idea 4`);
    assert.ok(!/persona de 50 kg.*sube y frena con 2 m/.test(t), `semilla ${s}: la Predice de la idea 5`);
  }
});

test('ningún error da la correcta y los casos son posibles', () => {
  for (const idea of Object.keys(gen.TIPOS_POR_IDEA)) for (let s = 0; s < 400; s++) {
    const p = gen.generar(s, { idea }), d = p._datos, ok = p.alternativas.find(a => a.correcta);
    for (const a of p.alternativas.filter(x => !x.correcta)) assert.notEqual(a.texto, ok.texto, `${d.tipo} ${s}`);
    if (d.tipo === 'plataforma') assert.ok(p.respuesta.valor <= 4, `${d.tipo} ${s}: radio de ${p.respuesta.valor} m`);
    if (d.tipo === 'oblicua') assert.ok(d.m * 10 - d.F * 0.6 > 0, `${d.tipo} ${s}: la cuerda levanta el bloque`);
    if (d.tipo === 'levantar') assert.ok(d.T < d.m * 10, `${d.tipo} ${s}: en la Tierra subiría igual`);
  }
});

// ---- Auditoría del 19 nov (rutinas/auditoria/fisica.dinamica.md, M6 y B1) ----
test('auditoría: nada se mueve más rápido de lo creíble y la práctica no repite los ejemplos de la teoría', () => {
  const VISTOS = { neta: d => d.m === 10 && d.F1 === 70 && d.F2 === 30, mesa: d => d.m1 === 6 && (d.m2 === 2 || d.m2 === 4),
    aspera: d => d.m1 === 5 && d.m2 === 3 && d.mu === 0.2, balanza: (d, t) => (d.m === 60 && d.a === 2 && /sube y acelera/.test(t)) || (d.m === 70 && d.a === 3 && /baja y frena/.test(t)) };
  for (const idea of Object.keys(gen.TIPOS_POR_IDEA)) for (let s = 0; s < 400; s++) {
    const p = gen.generar(s, { idea }), d = p._datos, t = p.enunciado.map(x => (typeof x === 'string' ? x : x.t)).join('');
    if (d.tipo === 'reposo') assert.ok(p.respuesta.valor <= 12, `semilla ${s}: ${p.respuesta.valor} m/s`);
    if (VISTOS[d.tipo]) assert.ok(!VISTOS[d.tipo](d, t), `${d.tipo} semilla ${s}: repite un ejemplo (${t})`);
  }
});
