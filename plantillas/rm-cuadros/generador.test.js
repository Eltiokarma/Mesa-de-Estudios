// Pruebas de «El cuadro que descarta» (rm-cuadros): un camino independiente que no usa el motor (todos los repartos
// armados aquí, con las pistas leídas desde _datos), una sola respuesta comprobada por fuerza bruta en 400 semillas,
// cada pista necesaria, el recuadro «Datos», la paleta de deducción, las explicaciones, la figura, casos.json y el papel.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');

const UNIDAD = 'razonamiento-matematico.razonamiento-deductivo';
const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));

// ---- Camino independiente: todos los repartos por fuerza bruta ----
function permutaciones(xs) {
  if (xs.length <= 1) return [xs.slice()];
  const out = [];
  xs.forEach((x, i) => { for (const r of permutaciones(xs.filter((_, j) => j !== i))) out.push([x, ...r]); });
  return out;
}
function todos(d) {
  let lista = [{}];
  for (const L of d.listas) {
    const nueva = [];
    for (const base of lista) for (const per of permutaciones(L.items)) nueva.push({ ...base, [L.id]: per });
    lista = nueva;
  }
  return lista;
}
function vale(d, q, r) {
  if (q.tipo === 'es' || q.tipo === 'noEs') {
    const si = r[q.atributo][d.personas.indexOf(q.persona)] === q.valor;
    return q.tipo === 'es' ? si : !si;
  }
  const i = r[q.atr1].indexOf(q.val1), si = r[q.atr2][i] === q.val2;
  return q.tipo === 'mismo' ? si : !si;
}
const quedan = (d, pistas = d.pistas) => todos(d).filter(r => pistas.every(q => vale(d, q, r)));
function respuestaDe(d, r) {
  const pi = d.pide;
  if (pi.t === 'valor') return r[pi.atributo][d.personas.indexOf(pi.persona)];
  if (pi.t === 'quienTiene') return d.personas[r[pi.atributo].indexOf(pi.valor)];
  return r[pi.atr2][r[pi.atr1].indexOf(pi.val1)];
}
// La respuesta, calculada sin el generador ni el motor.
function recalcular(p) {
  const d = p._datos, rs = quedan(d);
  if (d.pide.t !== 'seguro') {
    const vs = [...new Set(rs.map(r => respuestaDe(d, r)))];
    return vs.length === 1 ? `r:${vs[0]}` : null;
  }
  const seguras = d.pide.opciones.filter(a => a.tipo !== 'nada' && rs.every(r => vale(d, a, r)));
  return seguras.length === 1 ? `a:${JSON.stringify(seguras[0])}` : null;
}
probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => a === b });
probarFugas(gen, { grupo: p => `${p._datos.tipo}/${p._datos.sub}` });

test('una sola respuesta por fuerza bruta en 400 semillas (y con la unidad de la práctica)', () => {
  for (let s = 0; s < 400; s++) for (const p of [gen.generar(s), gen.generar(`u-${s}`, { unidad: UNIDAD })]) {
    const d = p._datos, rs = quedan(d);
    if (d.sub === 'quien') {
      assert.equal(rs.length, 1, `semilla ${s}: quedan ${rs.length} repartos`);
      // Ninguna otra alternativa es posible: cada valor distinto choca con alguna pista.
      for (const a of p.alternativas.filter(x => !x.correcta && x.valor !== 'nada')) {
        const x = a.valor.slice(2);
        assert.ok(!rs.some(r => String(respuestaDe(d, r)) === x), `semilla ${s}: «${a.texto}» también es posible`);
      }
    } else {
      assert.ok(rs.length >= 2 && rs.length <= 3, `semilla ${s}: quedan ${rs.length} repartos`);
      const ops = d.pide.opciones.filter(a => a.tipo !== 'nada');
      const seguras = ops.filter(a => rs.every(r => vale(d, a, r)));
      assert.equal(seguras.length, 1, `semilla ${s}: ${seguras.length} afirmaciones seguras`);
      // Lo seguro no es una pista dicha tal cual.
      assert.ok(!d.pistas.some(q => JSON.stringify(q) === JSON.stringify(seguras[0])), `semilla ${s}: la segura es una pista`);
    }
  }
});

test('cada pista hace falta; en atributos alguna pista cruza dos listas sin nombrar a nadie', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), d = p._datos, n = quedan(d).length;
    d.pistas.forEach((q, i) => assert.ok(quedan(d, d.pistas.filter((_, j) => j !== i)).length > n, `semilla ${s}: la pista ${i + 1} sobra`));
    // Cada pista es verdadera en algún reparto que queda (no hay pistas falsas ni contradicción).
    assert.ok(n >= 1);
    if (d.tipo === 'atributos') assert.ok(d.pistas.some(q => q.tipo === 'mismo' || q.tipo === 'noMismo'), `semilla ${s}: sin pista que cruce`);
    if (d.tipo === 'cuadro') {
      assert.equal(d.listas.length, 1);
      assert.ok(d.pistas.every(q => q.tipo === 'es' || q.tipo === 'noEs'));
      assert.ok(d.pistas.filter(q => q.tipo === 'es').length <= 1, `semilla ${s}: más de una pista «X tiene…»`);
    }
  }
});

test('salen los dos tipos, sus subtipos y preguntas, los tres niveles y los errores típicos', () => {
  const vistos = new Set(), niveles = new Set(), ids = new Set();
  for (let s = 0; s < 800; s++) {
    const d = gen.generar(s)._datos;
    vistos.add(`${d.tipo}/${d.sub}/${d.pide.t}`); niveles.add(d.nivel);
    for (const a of gen.generar(s).alternativas) if (a.error) ids.add(a.error.id);
  }
  for (const t of ['cuadro/quien/valor', 'cuadro/quien/quienTiene', 'cuadro/seguro/seguro', 'atributos/quien/valor', 'atributos/quien/quienTiene', 'atributos/quien/cruce', 'atributos/seguro/seguro'])
    assert.ok(vistos.has(t), `no sale ${t}`);
  assert.deepEqual([...niveles].sort(), [1, 2, 3]);
  for (const id of ['RMP72-pista-sin-revisar', 'RMP63-sin-cruce', 'RMP77-posible', 'RMP78-faltan-datos']) assert.ok(ids.has(id), `no sale ${id}`);
});

test('cada explicación empieza por lo que el alumno hizo bien, es hipótesis y no se repite en el problema', () => {
  const PERMITIDOS = /^(RMP72-pista-sin-revisar|RMP63-sin-cruce|RMP63-dos-pistas|RMP77-posible|RMP78-faltan-datos)$/;
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), ex = [];
    for (const a of p.alternativas.filter(x => x.error)) {
      assert.match(a.error.explicacion, /^Bien/, `semilla ${s}: ${a.error.explicacion}`);
      assert.equal(a.error.respaldo, 'hipotesis');
      assert.match(a.error.id, PERMITIDOS, `semilla ${s}: ${a.error.id}`);
      ex.push(a.error.explicacion);
    }
    // Dos opciones con el mismo error pueden compartir la idea, pero no el texto entero.
    assert.equal(new Set(ex).size, ex.length, `semilla ${s}: explicaciones repetidas`);
  }
});

// Recuadro «Datos» (docs/plan-calidad.md, contrato, punto 13; molde §4 y §7): la regla del reparto, qué es un reparto,
// qué dice una pista sin nombre y qué es «seguro», una por línea; nunca la respuesta ni un paso ya hecho.
test('datos: una lista de líneas cortas, con la regla de cada tipo y sin la respuesta, en 400 semillas', () => {
  const palabras = t => t.split(/\s+/).filter(w => /\p{L}/u.test(w)).length;
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(`d-${s}`, { unidad: UNIDAD }), d = p._datos;
    assert.ok(Array.isArray(p.datos) && p.datos.length, `semilla ${s}: datos debe ser una lista no vacía`);
    for (const l of p.datos) {
      assert.ok(typeof l === 'string' && l.trim() === l && l.length, `semilla ${s}: línea vacía`);
      assert.ok(palabras(l) <= 22, `semilla ${s}: «${l}» tiene ${palabras(l)} palabras`);
      assert.ok(!/^Dato:/i.test(l) && !/\bnull\b|\bNaN\b|\bundefined\b/.test(l));
    }
    assert.equal(new Set(p.datos).size, p.datos.length);
    const todo = p.datos.join('\n'), c = p.alternativas.find(a => a.correcta).texto.replace(/\.$/, '');
    assert.ok(!todo.toLowerCase().includes(c.toLowerCase()), `semilla ${s}: los datos traen la respuesta ${c}`);
    // Ni personas ni valores de las listas: eso va en el enunciado.
    for (const x of [...d.personas, ...d.listas.flatMap(L => L.items.filter(v => v.length > 2))]) assert.ok(!new RegExp(`\\b${x}\\b`).test(todo), `semilla ${s}: los datos nombran ${x}`);
    assert.ok(/se repite|nada se repite/.test(todo), `semilla ${s}: falta la regla del reparto`);
    assert.ok(todo.includes('Reparto:'), `semilla ${s}: falta qué es un reparto`);
    if (d.tipo === 'atributos') assert.ok(todo.includes('«quien…»'), `semilla ${s}: falta la pista sin nombre`);
    if (d.sub === 'seguro') assert.ok(todo.includes('Seguro:'), `semilla ${s}: falta qué es seguro`);
  }
});

// Paleta de deducción (Gerson, 17 nov): las ideas 1 y 2 solo usan violeta (lo seguro y lo pedido ya comprobado);
// personas, cosas y pistas en tinta. La pregunta no lleva color; la respuesta de la solución, sí.
test('paleta de deducción: solo violeta, solo en la solución; la figura sin naranja, turquesa, verde ni carmín', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    assert.deepEqual(Object.keys(p.variables), ['x']);
    assert.equal(p.variables.x.color, 'f');
    for (const linea of [p.enunciado, p.pregunta]) for (const x of linea) assert.equal(typeof x, 'string', `semilla ${s}: color fuera de la solución`);
    for (const linea of p.solucion) for (const x of linea) if (typeof x === 'object') assert.equal(x.v, 'x');
    assert.ok(p.solucion[p.solucion.length - 1].some(x => typeof x === 'object' && x.v === 'x'), `semilla ${s}: la respuesta no va en violeta`);
    const f = p.figuraSolucion.svg;
    assert.ok(!/--c-[oihd]\b/.test(f), `semilla ${s}: la figura usa otro color`);
    assert.ok(f.includes('var(--c-f)') || p._datos.sub === 'seguro', `semilla ${s}: la ✓ no va en violeta`);
  }
});

// La figura (el cuadro final): todo dentro del lienzo con 4 de margen; ningún rótulo pisa a otro (cálculo aproximado
// con 6,6 px por letra a 12 px).
test('figura: el cuadro cabe en 320 de ancho y sus rótulos no se pisan', () => {
  for (let s = 0; s < 300; s++) {
    const { svg, alt } = gen.generar(s).figuraSolucion;
    const [, W, H] = /viewBox="0 0 (\d+) (\d+)"/.exec(svg).map(Number);
    assert.equal(W, 320);
    const cajas = [];
    for (const m of svg.matchAll(/<text x="([\d.]+)" y="([\d.]+)"(?: text-anchor="(\w+)")? style="font-size:(\d+)px[^"]*">([^<]*)<\/text>/g)) {
      const x = +m[1], y = +m[2], a = m[3] || 'start', fs = +m[4], w = m[5].length * fs * 0.55;
      const x0 = a === 'middle' ? x - w / 2 : a === 'end' ? x - w : x;
      cajas.push([x0, y - fs * 0.8, x0 + w, y]);
    }
    for (const m of svg.matchAll(/<text transform="translate\(([\d.]+) ([\d.]+)\) rotate\(-90\)" style="font-size:(\d+)px[^"]*">([^<]*)<\/text>/g)) {
      const x = +m[1], y = +m[2], fs = +m[3], h = m[4].length * fs * 0.55;
      cajas.push([x - fs * 0.8, y - h, x, y]);
    }
    for (const [a, b, c, d] of cajas) assert.ok(a >= 4 && b >= 0 && c <= W - 2 && d <= H, `semilla ${s}: un rótulo se sale (${a}, ${b}, ${c}, ${d})`);
    for (let i = 0; i < cajas.length; i++) for (let j = i + 1; j < cajas.length; j++) {
      const [a, b] = [cajas[i], cajas[j]];
      const pisa = a[0] < b[2] - 1 && b[0] < a[2] - 1 && a[1] < b[3] - 1 && b[1] < a[3] - 1;
      assert.ok(!pisa, `semilla ${s}: dos rótulos se pisan`);
    }
    assert.ok(alt.length > 30);
  }
});

test('generar(semilla, { unidad }): la unidad de Razonamiento deductivo recibe sus dos tipos; sin unidad, lo mismo', () => {
  const tipos = new Set();
  for (let s = 0; s < 100; s++) tipos.add(gen.generar(s, { unidad: UNIDAD })._datos.tipo);
  assert.deepEqual([...tipos].sort(), ['atributos', 'cuadro']);
  assert.deepEqual(gen.generar(7), gen.generar(7, { unidad: UNIDAD }));
  for (const s of ['entrada-1', 'entrada-2', 'entrada-3', 'salida-1', 'salida-2', 'salida-3', 'papel-1']) gen.generar(s, { unidad: UNIDAD });
  // Entrada y salida: formas paralelas (el mismo tipo en el mismo lugar).
  for (let i = 1; i <= 3; i++) {
    const a = gen.generar(`entrada-${i}`)._datos, b = gen.generar(`salida-${i}`)._datos;
    assert.equal(`${a.tipo}/${a.sub}`, `${b.tipo}/${b.sub}`);
  }
});

test('los textos no muestran «de el», minúsculas tras un punto ni nombres en minúscula', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), d = p._datos;
    const todo = [plano(p.enunciado), plano(p.pregunta), ...p.solucion.map(plano), ...p.alternativas.map(a => a.texto), ...p.alternativas.filter(a => a.error).map(a => a.error.explicacion)].join(' ');
    assert.ok(!/\b[Dd]e el\b|\b[Aa] el\b|\.\s+[a-záéíóú]/.test(todo), `semilla ${s}: ${todo}`);
    for (const x of d.personas) assert.ok(!todo.includes(` ${x.toLowerCase()} `), `semilla ${s}: ${x} en minúscula`);
  }
});

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(p.respuesta.valor, c.esperado.respuesta);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.texto);
    assert.equal(quedan(c.entrada).length, c.esperado.repartos);
  });
}
test('casos.json: entre 15 y 20 casos, con los dos tipos y sus dos subtipos', () => {
  assert.ok(casos.casos.length >= 15 && casos.casos.length <= 20);
  const t = new Set(casos.casos.map(c => `${c.entrada.tipo}/${c.entrada.sub}`));
  assert.deepEqual([...t].sort(), ['atributos/quien', 'atributos/seguro', 'cuadro/quien', 'cuadro/seguro']);
});

test('papel.json: entre 5 y 10 problemas, con datos, alternativas, respuesta y pasos', () => {
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  for (const q of papel.problemas) {
    assert.match(q.enunciado, / Datos: .* Alternativas: A\) /);
    assert.match(q.respuesta, /^[A-E]\) /);
    assert.ok(q.pasos.length >= 3);
  }
});
