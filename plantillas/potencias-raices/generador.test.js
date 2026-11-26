// Pruebas de «La bandeja cuadrada de doña Juana»: casos.json (calculados aparte, con un script que no usa el generador),
// un recálculo independiente en 600 problemas (raíces por fuerza bruta, factorizaciones, conteos uno por uno, décimas como
// enteros), fugas, los tipos por idea, los colores de la unidad, la notación, el recuadro «Datos» en 400 semillas y el
// papel.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');

// ---- Camino independiente ----
const raizN = (N, n) => { let k = 0; while ((k + 1) ** n <= N) k++; return k; };
const esPot = (N, n) => raizN(N, n) ** n === N;
const sinEsp = t => String(t).replace(/[\s   ]/g, '');
const SUPS = { '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9 };
const leePot = t => String(t).split('×').reduce((a, p) => { const m = p.trim().match(/^(\d+)([⁰¹²³⁴⁵⁶⁷⁸⁹]*)$/); return a * Number(m[1]) ** (m[2] ? Number([...m[2]].map(c => SUPS[c]).join('')) : 1); }, 1);
const pasa = n => { let z = 0, x = n; while (x && x % 10 === 0) { x /= 10; z++; } return z % 2 === 0 && [1, 4, 5, 6, 9].includes(x % 10) && (x % 10 !== 5 || x % 100 === 25); };
const cuenta = (lo, hi, ok) => { let c = 0; for (let x = lo; x <= hi; x++) if (ok(x)) c++; return c; };
const encierra = (N, u) => { let t = 0; while ((t + 1) ** 2 <= N * u * u) t++; return t; };
const dec = (t, n) => (t / 10 ** n).toFixed(n).replace('.', ',');
function recalcular(p) {
  const d = p._datos, alts = p.alternativas.map(a => a.texto);
  switch (d.tipo) {
    case 'es-cuadrado': { const ok = alts.filter(a => esPot(leePot(a), 2)); assert.equal(ok.length, 1); return ok[0]; }
    case 'mult-cuadrado': case 'mult-cubo': { let m = 1; while (!esPot(d.N * m, d.n)) m++; return String(m); }
    case 'div-cuadrados': return String(cuenta(1, d.N, x => d.N % x === 0 && esPot(x, 2)));
    case 'descarta': { const ok = alts.filter(a => !esPot(Number(sinEsp(a)), 2)); assert.equal(ok.length, 1); assert.ok(!pasa(Number(sinEsp(ok[0])))); return ok[0]; }
    case 'cifra-final': return String((d.d * d.d) % 10);
    case 'pasa-no-es': { const ok = alts.filter(a => pasa(Number(sinEsp(a))) && !esPot(Number(sinEsp(a)), 2)); assert.equal(ok.length, 1); return ok[0]; }
    case 'oculta': { const ok = alts.filter(a => esPot(Number(d.tapado.replace('☐', a)), 2)); assert.equal(ok.length, 1); return ok[0]; }
    case 'raiz-residuo': { const k = raizN(d.N, 2); return `k = ${k}, r = ${d.N - k * k}`; }
    case 'faltan': return String((raizN(d.N, 2) + 1) ** 2 - d.N);
    case 'mayor-n': { let N = d.k * d.k; while (raizN(N + 1, 2) === d.k) N++; return String(N); }
    case 'dos-residuos': { for (let N = 1; ; N++) { const k = raizN(N, 2); if (N - k * k === d.r && (k + 1) ** 2 - N === d.re) return String(N); } }
    case 'cubica': { const k = raizN(d.N, 3); return `k = ${k}, r = ${d.N - k ** 3}`; }
    case 'siguiente-cubo': return String((d.k + 1) ** 3 - d.k ** 3);
    case 'arista': return String(raizN(d.N, 3));
    case 'mayor-cubo': { let N = d.k ** 3; while (raizN(N + 1, 3) === d.k) N++; return String(N); }
    case 'cifras': return String(cuenta(1, 10 ** d.c, k => k ** d.n >= 10 ** (d.c - 1) && k ** d.n <= 10 ** d.c - 1));
    case 'entre': return String(cuenta(1, 100, k => k * k >= d.a && k * k <= d.b));
    case 'cubos-entre': return String(cuenta(1, 30, k => k ** 3 >= d.a && k ** 3 <= d.b));
    case 'o-cubos': return String(cuenta(1, d.L, x => esPot(x, 2) || esPot(x, 3)));
    case 'decimas': { const t = encierra(d.N, 10); return `Entre ${dec(t, 1)} y ${dec(t + 1, 1)}`; }
    case 'raiz-suma': return String(Math.sqrt(d.a + d.b));
    case 'exceso': { const t = encierra(d.N, 10); return `${dec(d.exceso ? t + 1 : t, 1)} m`; }
    case 'centesimas': { const t = encierra(d.N, 100); return `Entre ${dec(t, 2)} y ${dec(t + 1, 2)} m`; }
    default: throw new Error(`tipo sin recálculo: ${d.tipo}`);
  }
}
probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => sinEsp(a) === sinEsp(b) });
probarFugas(gen, { grupo: p => p._datos.tipo });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla} (${c.entrada.tipo})`, () => {
    const p = gen.generar(c.semilla, c.idea ? { idea: c.idea } : undefined);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(sinEsp(p.respuesta.valor), sinEsp(c.esperado.respuesta));
  });
}

const TEORIA = require('../../contenido/teoria/aritmetica/potenciacion-y-radicacion.js');
const IDEAS = TEORIA.ideas.map(i => i.id);
test('tipos por idea: las seis ideas de la teoría, y generar(semilla, { idea }) da solo los suyos', () => {
  assert.deepEqual(Object.keys(gen.TIPOS_POR_IDEA), IDEAS);
  assert.equal(casos.casos.length, Object.values(gen.TIPOS_POR_IDEA).flat().length, 'un caso por tipo');
  for (const idea of IDEAS) {
    const vistos = new Set();
    for (let s = 0; s < 300; s++) { const p = gen.generar(`i${s}`, { idea }); assert.equal(p._datos.idea, idea); vistos.add(p._datos.tipo); }
    assert.deepEqual([...vistos].sort(), [...gen.TIPOS_POR_IDEA[idea]].sort(), `${idea}: no salen todos sus tipos`);
    assert.ok(gen.TIPOS_POR_IDEA[idea].some(t => gen.NIVEL[t] === 3), idea);
  }
});

test('colores de la teoría (número naranja, exponente turquesa, raíz violeta, residuo carmín); sin verde', () => {
  const C = { o: TEORIA.colores.numero, i: TEORIA.colores.exponente, f: TEORIA.colores.raiz, h: TEORIA.colores.residuo };
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    for (const [k, x] of Object.entries(p.variables)) assert.equal(x.color, C[k], `semilla ${s}: ${k}`);
  }
});

test('notación y cuentas: × y nunca «·»; sin NaN; alternativas razonables', () => {
  const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? x.t : String(x));
  for (let s = 0; s < 1000; s++) {
    const p = gen.generar(s);
    const todo = [[p.enunciado, p.pregunta, ...p.solucion].map(plano).join(' '), p.datos.join(' | '), p.alternativas.map(a => a.texto + ' | ' + (a.error ? a.error.explicacion : '')).join(' | ')].join(' | ');
    assert.ok(!/·|\*/.test(todo), `semilla ${s}: ${todo}`);
    assert.ok(!/NaN|undefined|null|Infinity|e\+/.test(todo), `semilla ${s}: ${todo}`);
    for (const a of p.alternativas) assert.ok(!/\d{7,}/.test(sinEsp(a.texto)), `semilla ${s}: alternativa ${a.texto}`);
  }
});

test('datos: una lista de líneas cortas, sin la respuesta, en 400 semillas', () => {
  const palabras = t => (t.match(/[\p{L}\p{N}]+/gu) || []).length;
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    assert.ok(Array.isArray(p.datos) && p.datos.length);
    for (const l of p.datos) { assert.ok(typeof l === 'string' && l.length); assert.ok(palabras(l) <= 22, `«${l}» tiene ${palabras(l)} palabras`); assert.ok(!/^(Recuerda|Ojo|Cuidado|Fíjate)/i.test(l)); }
    const c = sinEsp(p.respuesta.texto);
    // La línea fija de los cubos de 10, 20 y 30 («27 000») no cuenta: no depende del problema.
    if (/\d{2,}/.test(c) && !['centesimas', 'arista'].includes(p._datos.tipo)) assert.ok(!new RegExp(`(^|[^\\d,])${c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^\\d,])`).test(p.datos.map(sinEsp).join('\n')), `semilla ${s}: los datos traen ${c}`);
  }
});

test('cada distractor da el valor de su error (rehecho aquí, en 600 semillas)', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos, alt = id => p.alternativas.filter(a => a.error && a.error.id === id).map(a => sinEsp(a.texto));
    const tiene = (id, v) => { const xs = alt(id); if (xs.length) assert.ok(xs.includes(sinEsp(v)), `semilla ${s} (${d.tipo}): ${id} da ${xs}, no ${v}`); };
    if (d.tipo === 'cifra-final') { tiene('E-MUL', (2 * d.d) % 10); tiene('E-SUM', (d.d + 2) % 10); tiene('AT-MISMA', d.d); }
    if (d.tipo === 'faltan') { const k = raizN(d.N, 2); tiene('AT-CAMBIA', d.N - k * k); tiene('AT-BORDE', 2 * k + 1); }
    if (d.tipo === 'mayor-n') { tiene('AT-MAS-UNO', (d.k + 1) ** 2); tiene('AT-UNA-FILA', d.k * d.k + d.k); tiene('AT-SIN-RESIDUO', d.k * d.k); }
    if (d.tipo === 'siguiente-cubo') { tiene('AT-COPIA-CUADRADO', 2 * d.k + 1); tiene('AT-CARAS', 3 * d.k * d.k); }
    if (d.tipo === 'o-cubos') { const c2 = raizN(d.L, 2), c3 = raizN(d.L, 3), c6 = raizN(d.L, 6); tiene('AT-SIN-RESTAR', c2 + c3); tiene('AT-SOLO-AMBOS', c6); }
    if (d.tipo === 'raiz-suma') tiene('AT-SIN-RAIZ', d.a + d.b);
    if (d.tipo === 'dos-residuos') { tiene('AT-SUMA', d.r + d.re); tiene('AT-DA-K', (d.r + d.re - 1) / 2); }
  }
});

test('papel.json: 8 problemas de las seis ideas, con sus datos al final y su respuesta recalculada', () => {
  assert.equal(papel.problemas.length, 8);
  const ideas = new Set();
  papel.problemas.forEach((pr, i) => {
    const p = gen.generar(`papel-${i + 1}`);
    ideas.add(p._datos.idea);
    assert.match(pr.enunciado, /Datos: .+ Alternativas: /, pr.id);
    assert.ok(sinEsp(pr.respuesta).endsWith(sinEsp(recalcular(p))), `${pr.id}: ${pr.respuesta}`);
  });
  assert.deepEqual([...ideas].sort(), [...IDEAS].sort());
});

test('auditoría (26 nov): lo que se descarta por los ceros tiene uno o tres, y la práctica no repite la Predice (600)', () => {
  const ceros = n => { let z = 0; while (n && n % 10 === 0) { n /= 10; z++; } return z; };
  for (let s = 0; s < 2000; s++) {
    const p = gen.generar(s, { idea: 'exclusion' });
    if (p._datos.tipo === 'descarta' && p._datos.mal % 10 === 0) assert.ok(ceros(p._datos.mal) % 2 === 1, `semilla ${s}: ${p._datos.mal}`);
    const q = gen.generar(s, { idea: 'perfectos' });
    if (q._datos.tipo === 'mult-cuadrado') assert.notEqual(q._datos.N, 600, `semilla ${s}: 600 es la Predice de la teoría`);
  }
});
