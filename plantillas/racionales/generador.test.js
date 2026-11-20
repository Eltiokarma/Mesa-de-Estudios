// Pruebas de «El queque y la calculadora»: casos.json (calculados aparte, con un script que no usa el generador), un
// recálculo independiente en 600 problemas (fracciones con enteros, divisiones largas propias, fuerza bruta), fugas, los
// tipos por idea, los colores de la unidad, la notación, el recuadro «Datos» en 400 semillas y el papel.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');

// ---- Camino independiente ----
const GCD = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const Q = (n, d = 1) => { const g = GCD(n, d) || 1; return [n / g, d / g]; };
const fq = ([n, d]) => (d === 1 ? String(n) : `${n}/${d}`);
const suma = ([a, b], [c, d]) => Q(a * d + b * c, b * d), resta = ([a, b], [c, d]) => Q(a * d - b * c, b * d);
const por = ([a, b], [c, d]) => Q(a * c, b * d), entre = ([a, b], [c, d]) => Q(a * d, b * c);
const cuentaEn = (lo, hi, ok) => { let c = 0; for (let x = lo; x <= hi; x++) if (ok(x)) c++; return c; };
function largo(n, d, B = 10) {
  let r = n % d; const c = [], visto = new Map();
  while (r && !visto.has(r)) { visto.set(r, c.length); r *= B; c.push(Math.floor(r / d)); r %= d; }
  return r ? { ante: c.slice(0, visto.get(r)).join(''), per: c.slice(visto.get(r)).join('') } : { ante: c.join(''), per: '' };
}
// La generatriz por la resta de colas, escrita a mano desde las cifras (otro camino que la fórmula del generador).
const genDe = (ante, per) => { const L = per.length, a = ante.length; return Q(Number(ante + per) - Number(ante || 0), (10 ** L - 1) * 10 ** a); };
const exactaEn = (n, B) => largo(1, n, B).per === '';
function recalcular(p) {
  const d = p._datos, uno = [1, 1];
  switch (d.tipo) {
    case 'falta': return String(d.a * d.k);
    case 'irreductible': return fq(Q(d.N, d.D));
    case 'suma-terminos': { for (let k = 1; ; k++) if ((d.a + d.b) * k === d.S) return String(d.b * k); }
    case 'tres-cifras': return String(cuentaEn(1, 999, k => d.b * k >= 100 && d.b * k <= 999));
    case 'mayor': return d.a * d.d > d.b * d.c ? `${d.a}/${d.b}` : `${d.c}/${d.d}`;
    case 'clase': { const xs = [[d.p1, d.b], [d.q * d.b, d.b], [d.q * d.b + d.r, d.b], [d.otra, d.b]].filter(([x, y]) => x % y === 0); assert.equal(xs.length, 1); return `${xs[0][0]}/${xs[0][1]}`; }
    case 'entre': return String(cuentaEn(1, d.N - 1, k => k * d.q > d.p * d.N && k * d.s < d.u * d.N && GCD(k, d.N) === 1));
    case 'precio': return d.P1 * d.k2 < d.P2 * d.k1 ? `La de ${d.k1} kg` : `La de ${d.k2} kg`;
    case 'sumar': return fq(suma([d.a, d.b], [d.c, d.d]));
    case 'queda': return `${fq(por([d.N, 1], por(resta(uno, [d.a, d.b]), resta(uno, [d.c, d.d]))))} kg`;
    case 'atras': { for (let N = 1; N < 5000; N++) { const q1 = N * (d.b - d.a) / d.b, q = q1 * (d.d - d.c) / d.d; if (Number.isInteger(q1) && q === d.Q) return String(N); } return '?'; }
    case 'grifos': return `${fq(entre(uno, resta(suma([1, d.A], [1, d.B]), [1, d.C])))} h`;
    case 'exacto': return [d.buena, d.par, d.cinco, d.dyc].filter(([n, m]) => largo(n, m).per === '').map(([n, m]) => `${n}/${m}`).join('|');
    case 'cifras': return String(largo(d.a, d.D).ante.length);
    case 'factorial': { let F = 1; for (let i = 2; i <= d.k; i++) F *= i; return String(largo(d.a, F).ante.length); }
    case 'lugar': { let r = d.a % d.q, c = 0; for (let i = 0; i < d.n; i++) { r *= 10; c = Math.floor(r / d.q); r %= d.q; } return String(c); }
    case 'puro': return fq(genDe('', d.per));
    case 'mixto-g': return fq(genDe(d.ante, d.per));
    case 'suma-p': return fq(suma(genDe('', String(d.p1)), genDe('', d.per2)));
    case 'porcentaje': {
      const [e, dec] = d.pc.replace('…', '').split(','), f = entre(suma([+e, 1], genDe('', dec[0])), [100, 1]);
      return `S/ ${fq(entre([d.R, 1], resta(uno, f)))}`;
    }
    case 'a-fraccion': return fq(suma([d.x, d.B], [d.y, d.B * d.B]));
    case 'menor-base': { let B = 2; while (!exactaEn(d.n, B)) B++; return `Base ${B}`; }
    case 'bloque': { const x = Q(d.x * d.B + d.y, d.B * d.B - 1), l = largo(x[0], x[1], d.B); assert.equal(l.per, `${d.x}${d.y}`); return fq(x); }
    case 'cuantas': return String(cuentaEn(2, d.L, B => exactaEn(d.n, B)));
    default: throw new Error(`tipo sin recálculo: ${d.tipo}`);
  }
}
const sinEsp = t => String(t).replace(/[\s   ]/g, '');
probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => a.split('|').map(sinEsp).includes(sinEsp(b)) && !a.includes('|') });
probarFugas(gen, { grupo: p => p._datos.tipo });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla} (${c.entrada.tipo})`, () => {
    const p = gen.generar(c.semilla, c.idea ? { idea: c.idea } : undefined);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(sinEsp(p.respuesta.valor), sinEsp(c.esperado.respuesta));
  });
}

const TEORIA = require('../../contenido/teoria/aritmetica/numeros-racionales.js');
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

test('colores de la teoría (numerador naranja, denominador turquesa, lo pedido violeta, resto carmín); sin verde', () => {
  const C = { o: TEORIA.colores.parte, i: TEORIA.colores.partes, f: TEORIA.colores.pedido, h: TEORIA.colores.resto };
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    for (const [k, x] of Object.entries(p.variables)) assert.equal(x.color, C[k], `semilla ${s}: ${k}`);
    for (const x of [...p.enunciado, ...p.pregunta]) assert.equal(typeof x, 'string', `semilla ${s}: lo que se pide va en tinta`);
  }
});

test('notación y cuentas: × y nunca «·»; sin NaN; los valores de los distractores son finitos y razonables', () => {
  const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? x.t : String(x));
  for (let s = 0; s < 1000; s++) {
    const p = gen.generar(s);
    const todo = [[p.enunciado, p.pregunta, ...p.solucion].map(plano).join(' '), p.datos.join(' | '), p.alternativas.map(a => a.texto + ' | ' + (a.error ? a.error.explicacion : '')).join(' | ')].join(' | ');
    assert.ok(!/·|\*/.test(todo), `semilla ${s}: ${todo}`);
    assert.ok(!/NaN|undefined|null|Infinity|e\+/.test(todo), `semilla ${s}: ${todo}`);
    for (const a of p.alternativas) assert.ok(!/\d{7,}/.test(a.texto.replace(/[\s  ]/g, '')), `semilla ${s}: alternativa ${a.texto}`);
  }
});

test('datos: una lista de líneas cortas, sin la respuesta, en 400 semillas', () => {
  const palabras = t => (t.match(/[\p{L}\p{N}]+/gu) || []).length;
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    assert.ok(Array.isArray(p.datos) && p.datos.length);
    for (const l of p.datos) { assert.ok(typeof l === 'string' && l.length); assert.ok(palabras(l) <= 22, `«${l}» tiene ${palabras(l)} palabras`); assert.ok(!/^(Recuerda|Ojo|Cuidado|Fíjate)/i.test(l)); }
    const c = p.respuesta.texto;
    // Las líneas fijas («del 100 al 999», «5! = 1 × 2 × … × 5») no cuentan: no dependen del problema.
    if (/\d{2,}/.test(c) && !['tres-cifras', 'factorial', 'porcentaje'].includes(p._datos.tipo)) assert.ok(!p.datos.join('\n').includes(c), `semilla ${s}: los datos traen ${c}`);
  }
});

test('cada distractor da el valor de su error (rehecho aquí, en 600 semillas)', () => {
  const uno = [1, 1];
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos, alt = id => p.alternativas.filter(a => a.error && a.error.id === id).map(a => sinEsp(a.texto));
    const tiene = (id, v) => { const xs = alt(id); if (xs.length) assert.ok(xs.includes(sinEsp(v)), `semilla ${s} (${d.tipo}): ${id} da ${xs}, no ${v}`); };
    if (d.tipo === 'falta') { tiene('AT-SOLO-ABAJO', d.a); tiene('AT-FACTOR', d.k); tiene('AT-SUMA-AMBOS', d.a + d.b * d.k - d.b); }
    if (d.tipo === 'sumar') { tiene('AR12', `${d.a + d.c}/${d.b + d.d}`); tiene('AT-PRODUCTO-FR', fq(por([d.a, d.b], [d.c, d.d]))); }
    if (d.tipo === 'queda') { const q1 = d.N * (d.b - d.a) / d.b; tiene('AT-DESHACE-UNA', `${q1} kg`); tiene('AT-RESPONDE-OTRA', `${q1 * d.c / d.d} kg`); tiene('AT-RESTO-TOTAL', `${d.N - d.N * d.a / d.b - d.N * d.c / d.d} kg`); }
    if (d.tipo === 'atras') { const t = resta(resta(uno, [d.a, d.b]), [d.c, d.d]); if (t[0] > 0) { const v = entre([d.Q, 1], t); if (v[1] === 1) tiene('AT-RESTO-TOTAL', v[0]); } else assert.equal(alt('AT-RESTO-TOTAL').length, 0); tiene('AT-RESPONDE-OTRA', 2 * d.Q); }
    if (d.tipo === 'grifos') { tiene('AT-OLVIDA-DESAGUE', `${fq(entre(uno, suma([1, d.A], [1, d.B])))}h`); tiene('AT-SUMA-DESAGUE', `${fq(entre(uno, suma(suma([1, d.A], [1, d.B]), [1, d.C])))}h`); }
    if (d.tipo === 'puro') { tiene('AT-CORTAR', fq(Q(+d.per, 10 ** d.per.length))); }
    if (d.tipo === 'a-fraccion') { tiene('AT-BASE10', fq(Q(10 * d.x + d.y, 100))); tiene('AT-POSICION', fq(Q(d.x + d.y, d.B))); }
    if (d.tipo === 'tres-cifras') tiene('AT-CONTEO-SIN-QUITAR', Math.floor(999 / d.b));
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

// ---------- Cierre (20 nov, rutinas/auditoria/aritmetica.numeros-racionales.md): fallan con el generador de antes ----------
const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));
test('cierre: la trampa «cuesta menos en total» cuesta menos en total (precio)', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(`c${s}`, { idea: 'orden-recta' }); if (p._datos.tipo !== 'precio') continue;
    const { k1, P1, k2, P2 } = p._datos, t = p.alternativas.find(a => a.error && a.error.id === 'AT-TOTAL');
    const suyo = t.texto.includes(`${k1} kg`) ? P1 : P2; assert.ok(suyo < (suyo === P1 ? P2 : P1), plano(p.enunciado));
  }
});
test('cierre: en «exacto» la fracción exacta no va siempre primera en la lista del enunciado', () => {
  const lugares = new Set();
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(`c${s}`, { idea: 'exacto-periodico' }); if (p._datos.tipo !== 'exacto') continue;
    const lista = plano(p.enunciado).replace(/^.*cuaderno /, '').replace(/\.$/, '').split(', ');
    lugares.add(lista.indexOf(p.respuesta.texto));
  }
  assert.ok(lugares.size >= 3, `la exacta cae solo en ${[...lugares]}`);
});
