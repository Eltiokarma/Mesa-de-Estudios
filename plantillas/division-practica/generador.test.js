// Pruebas de «División de polinomios» (práctica): casos.json (calculados aparte, con un script que no usa el generador),
// un recálculo independiente en 600 problemas (se lee el polinomio del enunciado y se divide o se evalúa aquí, con
// fracciones exactas; o se busca por fuerza bruta lo que se pide), fugas, los tipos por idea, los colores de la unidad,
// los códigos de error, el recuadro «Datos» en 400 semillas, el papel y que la práctica no repite ninguna Predice.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');
const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));

// ---- Camino independiente ----
const SUP = { '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9 };
function leerPoli(t) {
  const s = t.replace(/\s/g, '').replace(/−/g, '-');
  const terms = s.match(/[+-]?[^+-]+/g), cs = {};
  let g = 0;
  for (const tt of terms) {
    const m = tt.match(/^([+-]?)(\d*)(x?)([⁰¹²³⁴⁵⁶⁷⁸⁹]*)$/);
    if (!m) throw new Error(`no leo «${t}»`);
    const c = (m[1] === '-' ? -1 : 1) * (m[2] ? +m[2] : 1), e = m[3] ? (m[4] ? [...m[4]].reduce((v, ch) => v * 10 + SUP[ch], 0) : 1) : 0;
    cs[e] = (cs[e] || 0) + c; g = Math.max(g, e);
  }
  return Array.from({ length: g + 1 }, (_, i) => cs[g - i] || 0);
}
const ev = (cs, x) => cs.reduce((a, c) => a * x + c, 0);
function divide(D, d) {
  const cur = D.slice(), q = [];
  for (let k = 0; k + d.length <= cur.length; k++) { const c = cur[k] / d[0]; q.push(c); d.forEach((u, i) => { cur[k + i] -= c * u; }); }
  return { q, r: cur.slice(cur.length - (d.length - 1)) };
}
const texto = cs => { const g = cs.length - 1, out = []; cs.forEach((c, i) => { if (Math.abs(c) < 1e-12) return; const e = g - i, l = e === 0 ? '' : e === 1 ? 'x' : 'x' + [...String(e)].map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]).join(''), m = Math.abs(c), cu = `${m === 1 && e ? '' : m}${l}`; out.push(out.length ? ` ${c < 0 ? '−' : '+'} ${cu}` : `${c < 0 ? '−' : ''}${cu}`); }); return out.join('') || '0'; };
const sinCeros = cs => { const i = cs.findIndex(c => Math.abs(c) > 1e-12); return i < 0 ? [0] : cs.slice(i); };
const unSup = s => [...s].reduce((v, ch) => v * 10 + SUP[ch], 0);
function recalcular(p) {
  const d = p._datos, en = plano(p.enunciado), pr = plano(p.pregunta);
  const par = re => { const m = en.match(re); assert.ok(m, `${d.tipo}: no leo «${en}»`); return m; };
  switch (d.tipo) {
    case 'grado-q': return d.gD - d.gd;
    case 'grado-r': return d.gd - 1;
    case 'reconstruir': { const m = par(/entre (.+) se obtuvo el cociente (.+) y el resto (.+)\.$/); const dd = leerPoli(m[1]), q = leerPoli(m[2]), r = +m[3].replace('−', '-');
      const pr2 = Array(dd.length + q.length - 1).fill(0); dd.forEach((a, i) => q.forEach((b, j) => { pr2[i + j] += a * b; })); pr2[pr2.length - 1] += r; return texto(pr2); }
    case 'suma-coef': { const m = par(/entre (.+), el cociente es (.+) y el resto es (.+)\.$/); return ev(leerPoli(m[1]), 1) * ev(leerPoli(m[2]), 1) + +m[3].replace('−', '-'); }
    case 'identidad-cero': { const m = par(/entre (.+), el cociente es (.+) y el resto es (.+)\.$/); return ev(leerPoli(m[1]), 0) * ev(leerPoli(m[2]), 0) + ev(leerPoli(m[3]), 0); }
    case 'primer-termino': { const m = par(/^Se divide (.+) entre (.+)\.$/); const D = leerPoli(m[1]), dd = leerPoli(m[2]); return texto([D[0] / dd[0], ...Array(D.length - dd.length).fill(0)]); }
    case 'coef-q': { const m = par(/^Se divide (.+) entre (.+)\.$/); const { q } = divide(leerPoli(m[1]), leerPoli(m[2])); return q[q.length - 2]; }
    case 'resto-cuad': { const m = par(/^Se divide (.+) entre (.+)\.$/); return texto(sinCeros(divide(leerPoli(m[1]), leerPoli(m[2])).r)); }
    case 'exacta-mn': { const m = par(/^La división de (.+) \+ mx \+ n entre (.+) es exacta\.$/); const { r } = divide(leerPoli(m[1]), leerPoli(m[2])); return -r[0] - r[1]; }
    case 'casilla': { const m = par(/Ruffini de (.+) entre (.+)\.$/), D = leerPoli(m[1]), dd = leerPoli(m[2]), k = ['primera', 'segunda', 'tercera', 'cuarta'].indexOf(pr.match(/la (\w+) casilla/)[1]);
      let b = D[0]; for (let i = 1; i <= k; i++) b = D[i] + (-dd[1]) * b; return b; }
    case 'cociente': { const m = par(/divide (.+) entre (.+)\.$/); return texto(divide(leerPoli(m[1]), leerPoli(m[2])).q); }
    case 'resto-ruf': case 'resto': case 'resto-neg': { const m = par(/divide (?:P\(x\) = )?(.+) entre (.+)\.$/); const dd = leerPoli(m[2]); return ev(leerPoli(m[1]), -dd[1] / dd[0]); }
    case 'suma-q': { const m = par(/divide (.+) entre (.+)\.$/); return divide(leerPoli(m[1]), leerPoli(m[2])).q.reduce((a, b) => a + b, 0); }
    case 'cociente-k': case 'cociente-frac': { const m = par(/divide (.+) entre (.+)\.$/); return texto(divide(leerPoli(m[1]), leerPoli(m[2])).q); }
    case 'resto-k': { const m = par(/divide (.+) entre (.+)\.$/); return divide(leerPoli(m[1]), leerPoli(m[2])).r[0]; }
    case 'suma-k': { const m = par(/divide (.+) entre (.+)\.$/); return divide(leerPoli(m[1]), leerPoli(m[2])).q.reduce((a, b) => a + b, 0); }
    case 'divisible': { const m = par(/^El polinomio (.+) es divisible entre (.+)\.$/), a = -leerPoli(m[2])[1];
      for (let mm = -20; mm <= 20; mm++) if (Math.abs(ev(leerPoli(m[1].replace('mx²', `${mm < 0 ? '−' : ''}${Math.abs(mm)}x²`).replace(/^x³ \+ −/, 'x³ − ')), a)) < 1e-9) return mm; break; }
    case 'resto-dos': { // fuerza bruta de m y n con r(a) = Ra y r(b) = Rb
      for (let m = -20; m <= 20; m++) for (let n = -40; n <= 40; n++) if (m * d.a + n === d.Ra && m * d.b + n === d.Rb) return texto([m, n]); break; }
    case 'caja': { let V = 0; const x = d.k; V = x * (d.L - x - x) * (d.A - x - x); return V; }
    case 'termino': case 'signos': { const n = d.n, k = d.k, sg = d.tipo === 'signos' && k % 2 === 0 ? '−' : ''; const ex = n - k, ey = k - 1;
      const l = (e, L) => (e === 0 ? '' : e === 1 ? L : L + [...String(e)].map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]).join('')); return sg + l(ex, 'x') + l(ey, 'y'); }
    case 'num-terminos': { const m = par(/x([⁰¹²³⁴⁵⁶⁷⁸⁹]+) − y([⁰¹²³⁴⁵⁶⁷⁸⁹]*) entre x([⁰¹²³⁴⁵⁶⁷⁸⁹]+) − y([⁰¹²³⁴⁵⁶⁷⁸⁹]*)/); const N1 = unSup(m[1]) / unSup(m[3]), N2 = (m[2] ? unSup(m[2]) : 1) / (m[4] ? unSup(m[4]) : 1); assert.equal(N1, N2); return N1; }
    case 'central': { const m = par(/x([⁰¹²³⁴⁵⁶⁷⁸⁹]+) − y([⁰¹²³⁴⁵⁶⁷⁸⁹]*) entre x([⁰¹²³⁴⁵⁶⁷⁸⁹]+) − y([⁰¹²³⁴⁵⁶⁷⁸⁹]*)/); const p = unSup(m[3]), s = m[4] ? unSup(m[4]) : 1, N = unSup(m[1]) / p, k = (N + 1) / 2;
      return p * (N - k) + s * (k - 1); }
    case 'exponentes': { const m = par(/es x([⁰¹²³⁴⁵⁶⁷⁸⁹]+)y([⁰¹²³⁴⁵⁶⁷⁸⁹]+)\.$/), ex = unSup(m[1]), ey = unSup(m[2]);
      for (let N = 2; N < 30; N++) for (let k = 1; k <= N; k++) if (d.p * (N - k) === ex && d.s * (k - 1) === ey) return (d.p + d.s) * N; break; }
    default: throw new Error(`tipo sin recálculo: ${d.tipo}`);
  }
  throw new Error(`sin respuesta: ${d.tipo}`);
}
const igual = (esperado, valor) => (typeof esperado === 'string' ? esperado === valor : Math.abs(esperado - valor) < 1e-9);
probarGenerador(gen, { semillas: 600, recalcular, igual });
probarFugas(gen, { grupo: p => p._datos.tipo });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla} (${c.entrada.tipo})`, () => {
    const p = gen.generar(c.semilla, { idea: c.entrada.idea });
    assert.equal(p._datos.tipo, c.entrada.tipo);
    const bien = p.alternativas.find(a => a.correcta);
    assert.equal(bien.texto, c.esperado.texto);
  });
}

test('tipos por idea: las seis ideas de la teoría, y generar(semilla, { idea }) da solo los suyos, con nivel 1 y nivel 3', () => {
  const teoria = require('../../contenido/teoria/algebra/division-de-polinomios.js');
  assert.deepEqual(Object.keys(gen.TIPOS_POR_IDEA), teoria.ideas.map(i => i.id));
  for (const [idea, tipos] of Object.entries(gen.TIPOS_POR_IDEA)) {
    const vistos = new Set();
    for (let s = 0; s < 300; s++) { const p = gen.generar(s, { idea }); assert.equal(p._datos.idea, idea); vistos.add(p._datos.tipo); }
    assert.deepEqual([...vistos].sort(), [...tipos].sort(), idea);
    assert.ok(tipos.some(t => gen.NIVEL[t] === 3) && tipos.some(t => gen.NIVEL[t] === 1), idea);
  }
  assert.deepEqual(Object.keys(gen.NIVEL).sort(), [...gen.TIPOS].sort());
});

test('cada explicación empieza por lo que el alumno hizo bien, muestra lo que da su error y no nombra una letra', () => {
  const codigos = new Set();
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas.filter(x => !x.correcta)) {
      const e = a.error.explicacion;
      codigos.add(a.error.id);
      assert.match(e, /^(Bien|\d|−\d|Esa|Ese)/, `semilla ${s}: ${e}`);
      assert.ok(e.includes(a.texto.replace(/ cm³$/, '')), `semilla ${s}: no muestra su valor «${a.texto}»: ${e}`);
      assert.ok(!/\b(alternativa|opción|letra) [A-E]\b|\bla [A-E]\b/.test(e), `semilla ${s}: ${e}`);
      assert.ok(e.split(/\s+/).length <= 32, `semilla ${s}: explicación larga: ${e}`);
      if (/^AL\d/.test(a.error.id)) assert.equal(a.error.fuente, 'docs/investigacion/algebra-funciones-ideas-erroneas.md');
      if (/^PO\d/.test(a.error.id)) assert.equal(a.error.fuente, 'plantillas/polinomios/plantilla.json');
    }
  }
  for (const c of ['TAL-GRADO-SUMA', 'TAL-OLVIDA-RESTO', 'TAL-COEF-PRINC', 'PO1', 'PO2', 'PO3', 'PO4', 'PO8', 'PO15', 'PO27', 'AL16', 'TAL-TK-EXP', 'TAL-CENTRAL-MAL']) assert.ok(codigos.has(c), c);
});

test('un color por magnitud: divisor y su número turquesa, cociente violeta, resto naranja', () => {
  const COLOR = { d: 'i', a: 'i', q: 'f', r: 'o' };
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    for (const [k, vv] of Object.entries(p.variables)) assert.equal(vv.color, COLOR[k], `semilla ${s}: ${k}`);
    assert.ok(Object.values(p.variables).every(vv => !['h', 'd'].includes(vv.color)));
  }
});

test('notación: superíndices de verdad, signo menos tipográfico, sin «*», «1x», «+ −» ni «x¹»', () => {
  for (let s = 0; s < 800; s++) {
    const p = gen.generar(s), todo = [plano(p.enunciado), plano(p.pregunta), ...p.alternativas.map(a => a.texto), ...p.solucion.map(plano)].join(' | ');
    assert.ok(!/\*|\b1x|\+ −|− −|[xy]¹(?![⁰¹²³⁴⁵⁶⁷⁸⁹])|\d-\d|\s-\d|\^\d|null|NaN|undefined/.test(todo), `semilla ${s}: ${todo}`);
  }
});

test('datos: una lista de líneas cortas, sin la respuesta ni consejos, en 400 semillas', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    assert.ok(Array.isArray(p.datos) && p.datos.length >= 1, `semilla ${s}: sin datos`);
    for (const l of p.datos) {
      assert.ok(typeof l === 'string' && l.split(/\s+/).length <= 22, `semilla ${s}: «${l}»`);
      assert.ok(!/^(Recuerda|Ojo|Cuidado|Fíjate|Conviene|No olvides)/.test(l), `semilla ${s}: consejo: ${l}`);
    }
    const c = p.alternativas.find(a => a.correcta).texto;
    if (/\d{2,}|x/.test(c)) assert.ok(!p.datos.join(' ').includes(c), `semilla ${s}: los datos traen la respuesta ${c}`);
  }
});

test('nunca se queda sin cuatro alternativas (semillas 0 a 2000, y por idea)', () => {
  for (let s = 0; s < 2000; s++) assert.ok(gen.generar(s).alternativas.length >= 4);
  for (const idea of Object.keys(gen.TIPOS_POR_IDEA)) for (let s = 0; s < 300; s++) assert.ok(gen.generar(`i${s}`, { idea }).alternativas.length >= 4);
});

test('no repite ninguna Predice de la teoría', () => {
  const prohibido = ['6x⁴ + x³ + 4x − 1', '2x³ − 5x + 1 entre x − 2', '4x² − 2x + 5', 'x⁵ − 3x² + 7', 'x⁶ − 64'];
  for (let s = 0; s < 2000; s++) {
    const p = gen.generar(s), en = plano(p.enunciado);
    for (const x of prohibido) assert.ok(!new RegExp(`(?<![+−] )${x.replace(/[()+]/g, '\\$&')}`).test(en), `semilla ${s}: ${en}`);
    if (p._datos.tipo === 'grado-q') assert.ok(!(p._datos.gD === 7 && p._datos.gd === 3));
  }
});

test('papel.json: 8 problemas de las seis ideas, con sus datos y su respuesta recalculada', () => {
  assert.equal(papel.problemas.length, 8);
  for (const [k, pr] of papel.problemas.entries()) {
    assert.match(pr.enunciado, /Datos: /);
    const p = gen.generar(`papel-${k + 1}`), c = p.alternativas.find(a => a.correcta);
    assert.equal(pr.respuesta, `${c.letra}) ${c.texto}`);
    assert.ok(igual(recalcular(p), p.respuesta.valor));
  }
  const ideas = new Set(papel.problemas.map((pr, k) => gen.generar(`papel-${k + 1}`)._datos.idea));
  assert.equal(ideas.size, 6);
});

// Auditoría del 19 nov (rutinas/auditoria/algebra.division-de-polinomios.md, M1 y M4): el distractor «PO2» del cociente
// con x = −b/c en fracción no era lo que da usar b/c (ese cociente no sale con enteros); y en los tipos de cx + b el dato
// de Ruffini decía «más a por la anterior» sin que nadie dijera qué es a.
test('cociente con x = −b/c: cada distractor vale lo que da su error; los datos de cx + b dicen −b/c', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s, { idea: 'divisor-k' });
    for (const l of p.datos) assert.ok(!/más a por/.test(l), `${s}: «${l}»`);
    if (p._datos.tipo !== 'cociente-frac') continue;
    const m = plano(p.enunciado).match(/Se divide (.+) entre (.+)\.$/), D = leerPoli(m[1]), d = leerPoli(m[2]), q = divide(D, d).q;
    for (const a of p.alternativas) {
      if (!a.error) continue;
      assert.notEqual(a.error.id, 'PO2', `${s}: un PO2 que no es lo que da su error`);
      if (a.error.id === 'TAL-K-MULT') assert.equal(a.texto, texto(q.map(v => v * d[0] * d[0])), `${s}`);
    }
  }
});
