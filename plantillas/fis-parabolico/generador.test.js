// Pruebas de «Movimiento parabólico» (fis-parabolico): casos.json (calculados aparte, con un script que no usa el
// generador ni el motor), un recálculo independiente en 600 problemas (el vuelo integrado paso a paso, sin las fórmulas
// del tiro ni plantillas/tiro-parabolico/motor.js), fugas, los tipos por idea, los colores de la unidad, los códigos de
// error y su respaldo, el recuadro «Datos» en 400 semillas, el catálogo y que la práctica no repite ninguna Predice.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');
const UNIDAD = 'fisica.movimiento-parabolico-y-circular';
const CIN = 'docs/investigacion/cinematica-ideas-erroneas.md';

// ---- Camino independiente: el vuelo paso a paso (eje y hacia arriba, g = 10 m/s²) ----
const SEN = { 30: 1 / 2, 37: 3 / 5, 45: Math.SQRT1_2, 53: 4 / 5, 60: Math.sqrt(3) / 2 }, COS = { 30: Math.sqrt(3) / 2, 37: 4 / 5, 45: Math.SQRT1_2, 53: 3 / 5, 60: 1 / 2 };
const DT = 1e-4;
function vuelo(vx, vy, y0, h) {
  let x = 0, y = y0, t = 0;
  for (let i = 0; i < 5e6; i++) {
    const vy1 = vy - 10 * DT, y1 = y + (vy + vy1) / 2 * DT, x1 = x + vx * DT;
    const corta = (a, a1, m) => { const f = (m - a) / (a1 - a); return { t: t + f * DT, x: x + f * (x1 - x), y: y + f * (y1 - y), vx, vy: vy + f * (vy1 - vy) }; };
    if (h.t !== undefined && t + DT >= h.t) return corta(t, t + DT, h.t);
    if (h.piso && y1 <= 0 && vy1 < 0) return corta(y, y1, 0);
    if (h.cima && vy1 <= 0) return corta(vy, vy1, 0);
    if (h.pend !== undefined && -vy1 >= h.pend * vx) return corta(-vy, -vy1, h.pend * vx);
    x = x1; y = y1; vy = vy1; t += DT;
  }
  throw new Error('no terminó');
}
const sale = (v0, a, h = 0) => [v0 * COS[a], v0 * SEN[a], h];
function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'caida-t': return vuelo(1, 0, d.h, { piso: true }).t;
    case 'alcance-h': return vuelo(d.v0, 0, d.h, { piso: true }).x;
    case 'avioneta': return vuelo(d.k / 3.6, 0, d.h, { piso: true }).x;
    case 'vy-t': return -vuelo(d.v0, 0, 999, { t: d.t }).vy;
    case 'llegada': { const q = vuelo(d.v0, 0, d.h, { piso: true }); return Math.hypot(q.vx, q.vy); }
    case 'angulo-t': return vuelo(d.v0, 0, 999, { pend: { 37: 3 / 4, 45: 1, 53: 4 / 3 }[d.ang] }).t;
    case 'componentes': return d.v0 * (d.sub === 'lado' ? COS : SEN)[d.a];
    case 'altura-t': return vuelo(...sale(d.v0, d.a), { t: d.t }).y;
    case 'vuelo-avance': return vuelo(...sale(d.v0, d.a), { piso: true }).t;
    case 'azotea': return vuelo(...sale(d.v0, d.a, d.h), { piso: true }).t;
    case 'altura-max': return vuelo(...sale(d.v0, d.a), { cima: true }).y;
    case 'alcance': return vuelo(...sale(d.v0, d.a), { piso: true }).x;
    case 'alcance-45': { let lo = 1, hi = 80; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (vuelo(...sale(m, 45), { piso: true }).t < d.k * Math.SQRT2) lo = m; else hi = m; } return lo; }
    case 'veces': return vuelo(...sale(d.k * d.v0, d.a), { piso: true }).x;
    case 'posicion': return (d.sub === 'norte' ? d.b : d.a) * d.t;
    case 'distancia': return Math.hypot(d.a * d.t, d.b * d.t);
    case 'particula': return Math.hypot(d.x0 + 2 * d.a, 4 * d.c);
    default: throw new Error(`tipo sin recálculo: ${d.tipo}`);
  }
}
const cerca = (a, b) => Math.abs(a - b) <= Math.max(5e-3, 2e-3 * Math.abs(b));

probarGenerador(gen, { semillas: 600, recalcular, igual: cerca });
probarFugas(gen);

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla} (${c.entrada.tipo})`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(cerca(p.respuesta.valor, c.esperado.respuesta), `${p.respuesta.valor} contra ${c.esperado.respuesta}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.texto);
  });
}

test('tipos por idea: las cinco ideas de la unidad, cada tipo con su nivel y todos salen', () => {
  const ideas = require('../../contenido/teoria/fisica/movimiento-parabolico-y-circular.js').ideas.map(i => i.id);
  assert.deepEqual(Object.keys(gen.TIPOS_POR_IDEA), ideas);
  for (const [idea, tipos] of Object.entries(gen.TIPOS_POR_IDEA)) {
    const vistos = new Set();
    for (let s = 0; s < 300; s++) { const p = gen.generar(s, { idea }); assert.equal(p._datos.idea, idea); vistos.add(p._datos.tipo); }
    assert.deepEqual([...vistos].sort(), [...tipos].sort(), idea);
    assert.ok(tipos.some(t => gen.NIVEL[t] === 1) && tipos.some(t => gen.NIVEL[t] === 3), `${idea}: del nivel 1 al de examen`);
  }
});

test('cada error trae su código, su respaldo y su fuente; la explicación empieza por lo bien hecho y muestra su valor', () => {
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas.filter(x => x.error)) {
      const e = a.error;
      assert.match(e.id, /^(P[24]|TP-|2D-|PR|K-TIEMPO|C-LINEAL|U1-kmh)/, `semilla ${s}: ${e.id}`);
      assert.equal(e.respaldo, /^P[24]$/.test(e.id) ? 'documentado' : 'hipotesis', `semilla ${s}: ${e.id}`);
      assert.equal(e.fuente, /^(U1|PR1)\b/.test(e.id) ? 'docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md' : CIN);
      assert.match(e.explicacion, /^Bien/, `semilla ${s}: ${e.explicacion}`);
      assert.ok(e.explicacion.includes(a.texto), `semilla ${s}: «${e.explicacion}» no muestra ${a.texto}`);
      assert.ok(!/\b(alternativa|opción|letra) [A-E]\b|\bla [A-E]\b/.test(e.explicacion), `semilla ${s}: nombra una letra`);
      assert.ok(e.explicacion.split(/\s+/).length <= 40, `semilla ${s}: explicación larga`);
    }
  }
  // Los códigos nuevos (hipótesis) están en el informe de cinemática.
  const informe = fs.readFileSync(path.join(__dirname, '..', '..', CIN), 'utf8'), ids = new Set();
  for (let s = 0; s < 3000; s++) for (const a of gen.generar(s).alternativas.filter(x => x.error)) ids.add(a.error.id);
  for (const id of ids) if (!/^(U1|PR1)\b/.test(id)) assert.ok(informe.includes(id), `${id} no está en ${CIN}`);
});

test('un color por magnitud: v naranja, t turquesa, x violeta, a carmín; sin verde', () => {
  const COLOR = { v: 'o', t: 'i', x: 'f', a: 'h' };
  for (let s = 0; s < 1000; s++) {
    const p = gen.generar(s);
    for (const [k, x] of Object.entries(p.variables)) assert.equal(x.color, COLOR[k], `semilla ${s}: ${k}`);
    const usadas = new Set();
    for (const linea of [p.enunciado, p.pregunta, ...p.solucion]) for (const x of linea) if (x && typeof x === 'object') { assert.ok(p.variables[x.v] && x.t, `semilla ${s}`); usadas.add(x.v); }
    assert.deepEqual([...usadas].sort(), Object.keys(p.variables).sort());
    assert.ok(p.solucion[p.solucion.length - 1].some(x => x && typeof x === 'object'), `semilla ${s}: la respuesta sin color`);
  }
});

test('notación y datos: subíndices con «_», sin «ᵧ» ni «^»; datos en líneas cortas, sin la respuesta ni atajos', () => {
  const plano = x => (Array.isArray(x) ? x.map(plano).join(' ') : x && typeof x === 'object' ? String(x.t) : String(x));
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), todo = [p.enunciado, p.pregunta, p.solucion, p.datos].map(plano).join(' ');
    assert.ok(!/[ᵧ^*]|\d\.\d|\bv0\b|NaN|undefined/.test(todo), `semilla ${s}: ${todo}`);
    assert.ok(Array.isArray(p.datos) && p.datos.length >= 2 && p.datos.length <= 6, `semilla ${s}: ${p.datos.length} líneas`);
    const ok = p.alternativas.find(a => a.correcta).texto;
    for (const l of p.datos) {
      assert.ok(l.split(/\s+/).filter(w => /\p{L}/u.test(w)).length <= 22, `semilla ${s}: «${l}»`);
      assert.ok(!/sen 2θ|v_0²|2v_0|\brecuerda\b|\bfíjate\b|\bdebes\b/i.test(l), `semilla ${s}: atajo o consejo: «${l}»`);
      assert.ok(!new RegExp(`(?<![\\d,])${ok.replace(/[/()]/g, '\\$&')}(?![²\\d/])`).test(l), `semilla ${s}: los datos traen la respuesta ${ok}`);
    }
  }
});

test('situaciones posibles: piedras hasta 20 m/s, pelotas pateadas hasta 25 m/s, drones hasta 15 m/s', () => {
  const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));
  for (let s = 0; s < 1500; s++) {
    const txt = plano([gen.generar(s).enunciado]);
    for (const [, n] of txt.matchAll(/(?:piedra|patea|pelota)[^.]*? a ([\d,]+) m\/s/g)) assert.ok(Number(n.replace(',', '.')) <= 25, `semilla ${s}: ${txt}`);
    for (const [, n] of txt.matchAll(/(?:peña|azotea|torre) de ([\d,]+) m/g)) assert.ok(Number(n.replace(',', '.')) <= 80, `semilla ${s}: ${txt}`);
  }
});

test('la práctica no repite las predicciones de la unidad', () => {
  const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));
  for (let s = 0; s < 2000; s++) {
    const t = plano([gen.generar(s).enunciado, gen.generar(s).pregunta]);
    assert.ok(!/x = 6t e y = 8t/.test(t), `semilla ${s}: ${t}`);
    assert.ok(!/^A 10 m\/s con 30°/.test(t), `semilla ${s}: ${t}`);
    assert.ok(!/25 m\/s con 53°[^?]*más alto/.test(t), `semilla ${s}: ${t}`);
  }
});

test('la física la hace el motor de la escena tiro-parabolico, no una copia', () => {
  const src = fs.readFileSync(path.join(__dirname, 'generador.js'), 'utf8');
  assert.match(src, /require\('\.\.\/tiro-parabolico\/motor\.js'\)/);
  assert.ok(!/function proyectil\b/.test(src));
});

test('la ficha y el catálogo: la unidad lista esta plantilla primero', () => {
  const ficha = require('./plantilla.json'), cat = require('../../catalogo/cursos/fisica.json');
  assert.deepEqual(ficha.unidades, [UNIDAD]);
  assert.equal(cat.unidades.find(u => u.id === UNIDAD).plantillas[0], 'fis-parabolico');
  const papel = require('./papel.json');
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  for (const pr of papel.problemas) assert.match(pr.enunciado, /Datos: /);
});

// ---- Auditoría (19 nov): cada prueba falla con la versión de antes ----
const planoG = x => (Array.isArray(x) ? x.map(planoG).join('') : x && typeof x === 'object' ? String(x.t) : String(x === undefined ? '' : x));
test('auditoría: las velocidades de la idea 2 que usan vₓ = v₀ la traen en los datos; las de eje hacia arriba lo dicen', () => {
  for (let s = 0; s < 300; s++) {
    const p = gen.generar(s, { idea: 'velocidad-en-vuelo' });
    if (['llegada', 'angulo-t'].includes(p._datos.tipo)) assert.ok(p.datos.some(d => /v_x = v_0/.test(d)), `${p._datos.tipo}: ${p.datos}`);
    for (const k of ['tiro-oblicuo', 'altura-y-alcance']) for (const d of gen.generar(s, { idea: k }).datos) if (/v_y² =/.test(d)) assert.match(d, /hacia arriba/);
  }
});
test('auditoría: ninguna pelota se patea a más de 25 m/s, y «veces» se lee bien', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s, { idea: 'altura-y-alcance' }), t = planoG(p.enunciado) + ' ' + planoG(p.pregunta);
    if (p._datos.tipo === 'alcance-45') assert.ok(p._datos.v0 <= 25, t);
    assert.ok(!/veces de esa|de esa rapidez de esa/.test(t), t);
  }
});
test('auditoría: la ecuación de segundo grado dice qué son p, q y r', () => {
  for (let s = 0; s < 200; s++) for (const d of gen.generar(s, { idea: 'tiro-oblicuo' }).datos) if (/p · t²/.test(d)) assert.match(d, /p, q, r/);
});
