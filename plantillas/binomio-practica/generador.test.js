// Pruebas de «Binomio de Newton» (práctica): casos.json (calculados aparte, con sympy, sin el generador), un recálculo
// independiente en 400 problemas por idea (se lee el binomio que ve el alumno y se desarrolla aquí con un multiplicador
// de polinomios propio; los coeficientes de (1 + x) elevado a α salen de la recurrencia (1 + x)f′ = αf), fugas, los
// tipos por idea, los colores de la unidad, los códigos de error, el recuadro «Datos» en 400 semillas, el papel y que la
// práctica no repite ninguna Predice.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');
const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));

// ---- Camino independiente: polinomios en a, b, c, x, y, z con exponentes enteros y coeficientes racionales ----
const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const Q = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = mcd(n, d); return [n / g, d / g]; };
const qm = (a, b) => Q(a[0] * b[0], a[1] * b[1]), qs = (a, b) => Q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const SUP = { '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9 };
const leeSup = s => (s ? (s[0] === '⁻' ? -1 : 1) * +[...s.replace('⁻', '')].map(c => SUP[c]).join('') : 1);
const clave = e => Object.keys(e).filter(k => e[k]).sort().map(k => `${k}:${e[k]}`).join(',');
const deClave = k => Object.fromEntries(k ? k.split(',').map(p => { const [l, e] = p.split(':'); return [l, +e]; }) : []);
function multP(A, B) {
  const out = new Map();
  for (const [ka, ca] of A) for (const [kb, cb] of B) {
    const e = deClave(ka), f = deClave(kb); for (const l in f) e[l] = (e[l] || 0) + f[l];
    const k = clave(e), v = out.has(k) ? qs(out.get(k), qm(ca, cb)) : qm(ca, cb);
    if (v[0] === 0) out.delete(k); else out.set(k, v);
  }
  return out;
}
const potP = (A, n) => { let r = new Map([['', [1, 1]]]); for (let i = 0; i < n; i++) r = multP(r, A); return r; };
function leeBase(t) {
  const P = new Map();
  for (let term of t.replace(/^\(|\)$/g, '').replace(/ − /g, ' + −').split(' + ')) {
    let sg = 1; if (term[0] === '−') { sg = -1; term = term.slice(1); }
    let m;
    if ((m = term.match(/^(\d*)\/([a-z])([⁰¹²³⁴⁵⁶⁷⁸⁹]*)$/))) { P.set(clave({ [m[2]]: -leeSup(m[3]) }), Q(sg * (m[1] ? +m[1] : 1))); continue; }
    m = term.match(/^(\d*)((?:[a-z][⁰¹²³⁴⁵⁶⁷⁸⁹]*)*)$/);
    const e = {}; for (const [, l, ex] of m[2].matchAll(/([a-z])([⁰¹²³⁴⁵⁶⁷⁸⁹]*)/g)) e[l] = (e[l] || 0) + leeSup(ex);
    P.set(clave(e), Q(sg * (m[1] ? +m[1] : 1)));
  }
  return P;
}
function leeMono(t) {
  const m = t.replace(/ /g, '').match(/^(−?)(\d*)((?:[a-z][⁻⁰¹²³⁴⁵⁶⁷⁸⁹]*)*)$/);
  if (!m) return null;
  const e = {}; for (const [, l, ex] of m[3].matchAll(/([a-z])([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]*)/g)) e[l] = (e[l] || 0) + leeSup(ex);
  return [clave(e), Q((m[1] ? -1 : 1) * (m[2] ? +m[2] : 1))];
}
const ordenX = P => [...P.entries()].sort((u, w) => (deClave(w[0]).x || 0) - (deClave(u[0]).x || 0));
const numQ = t => { const s = String(t).replace(/ /g, '').replace('−', '-'); const m = s.match(/^(-?\d+)(?:\/(\d+))?$/); return m ? Q(+m[1], m[2] ? +m[2] : 1) : null; };
const igualQ = (a, b) => !!a && !!b && a[0] === b[0] && a[1] === b[1];
const comb = (n, k) => { let r = 1; for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1); return Math.round(r); };
const serieA = (al, k) => { let c = [1, 1]; for (let j = 0; j < k; j++) c = qm(c, Q(al[0] - j * al[1], al[1] * (j + 1))); return c; };

// Lo que vale la correcta, rehecho desde el texto que ve el alumno: devuelve una función «¿este texto lo vale?».
function rehacer(p) {
  const en = plano(p.enunciado), pr = plano(p.pregunta), d = p._datos;
  const bas = en.match(/(\([^()]+\))([⁰¹²³⁴⁵⁶⁷⁸⁹]+)/), Pn = bas && !/m\//.test(bas[1]) ? potP(leeBase(bas[1]), leeSup(bas[2])) : null;
  let m;
  switch (d.tipo) {
    case 'coef': case 'multi': case 'tri-num': case 'coef-xm': { const [k] = leeMono(pr.match(/coeficiente de (\S+)\?/)[1]); return t => igualQ(Pn.get(k), numQ(t)); }
    case 'fila': { m = pr.match(/coeficiente de (\S+) en (\(a \+ b\))(\S+)\?/); const P = potP(leeBase(m[2]), leeSup(m[3])); return t => igualQ(P.get(leeMono(m[1])[0]), numQ(t)); }
    case 'cenefas': { m = en.match(/cenefas de (\d+) losetas con (\d+) turquesas/); const n = +m[1], k = +m[2]; let c = 0; for (let b = 0; b < 2 ** n; b++) { const s = b.toString(2).padStart(n, '0'); if (s[0] === '1' && [...s].filter(z => z === '1').length === k) c++; } return t => igualQ(Q(c), numQ(t)); }
    case 'iguales': { m = en.match(/xⁿ⁻(\S)y\S* y de xⁿ⁻(\S)/); const k1 = leeSup(m[1]), k2 = leeSup(m[2]), ns = []; for (let n = k2; n < 40; n++) if (comb(n, k1) === comb(n, k2)) ns.push(n); assert.equal(ns.length, 1); return t => igualQ(Q(ns[0]), numQ(t)); }
    case 'termino': { const [k, c] = ordenX(Pn)[+pr.match(/lugar (\d+)/)[1] - 1]; return t => { const l = leeMono(t); return !!l && l[0] === k && igualQ(l[1], c); }; }
    case 'coef-signo': { const [k] = leeMono(pr.match(/coeficiente de (\S+)\?/)[1]); return t => igualQ(Pn.get(k), numQ(t)); }
    case 'lugar': { const [k] = leeMono(pr.match(/término con (\S+)\?/)[1]); return t => t === `lugar ${ordenX(Pn).findIndex(x => x[0] === k) + 1}`; }
    case 'n-termino': { m = en.match(/(\([^()]+\))ⁿ, el término de lugar (\d+) es ([^.]+)\./); const L = +m[2], [k, c] = leeMono(m[3]), ns = []; for (let n = L - 1; n < 30; n++) { const o = ordenX(potP(leeBase(m[1]), n))[L - 1]; if (o && o[0] === k && igualQ(o[1], c)) ns.push(n); } assert.equal(ns.length, 1); return t => igualQ(Q(ns[0]), numQ(t)); }
    case 'existe': { const L = ordenX(Pn).findIndex(x => x[0] === '') + 1; return t => (L ? t === `Sí, el de lugar ${L}` : t === 'No tiene'); }
    case 'indep': case 'indep-tri': return t => igualQ(Pn.get('') || [0, 1], numQ(t));
    case 'param': { m = en.match(/de \((x[⁰¹²³⁴⁵⁶⁷⁸⁹]*) \+ m\/(x[⁰¹²³⁴⁵⁶⁷⁸⁹]*)\)([⁰¹²³⁴⁵⁶⁷⁸⁹]+), con m positivo, es ([\d ]+)\./); const V = +m[4].replace(/ /g, ''), ms = []; for (let mm = 1; mm < 20; mm++) if (igualQ(potP(leeBase(`(${m[1]} + ${mm}/${m[2]})`), leeSup(m[3])).get(''), Q(V))) ms.push(mm); assert.equal(ms.length, 1); return t => igualQ(Q(ms[0]), numQ(t)); }
    case 'cuantos': case 'terminos': return t => igualQ(Q(Pn.size), numQ(t));
    case 'central': { const o = ordenX(Pn), [k, c] = o[(o.length - 1) / 2]; return t => { const l = leeMono(t); return !!l && l[0] === k && igualQ(l[1], c); }; }
    case 'suma': { const s = [...Pn.values()].reduce(qs, [0, 1]); return t => igualQ(s, numQ(t)); }
    case 'n-suma': { m = en.match(/(\([^()]+\))ⁿ suman ([\d ]+)\./); const S = Q(+m[2].replace(/ /g, '')), ns = []; for (let n = 1; n < 20; n++) { const P = potP(leeBase(m[1]), n); if (igualQ([...P.values()].reduce(qs, [0, 1]), S)) ns.push([n, P.size]); } assert.equal(ns.length, 1); return t => igualQ(Q(ns[0][1]), numQ(t)); }
    case 'termina': { m = en.match(/\(1 \+ x\)(?: elevado a (−?\d+)\/(\d+)|([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+))/); const nat = !m[1] && leeSup(m[3]) >= 0; return t => (nat ? igualQ(Q(leeSup(m[3]) + 1), numQ(t)) : t === 'No termina'); }
    case 'x2': case 'x3': { m = en.match(/\(1 \+ x\)(?: elevado a (−?\d+)\/(\d+)|([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+))/); const al = m[1] ? Q(+m[1].replace('−', '-'), +m[2]) : [leeSup(m[3]), 1]; const c = serieA(al, d.tipo === 'x2' ? 2 : 3); return t => igualQ(c, numQ(t)); }
    case 'aprox': { m = en.match(/\(1 \+ x\)(?: elevado a (−?\d+)\/(\d+)|([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)) con x = ([\d,]+)/); const al = m[1] ? Q(+m[1].replace('−', '-'), +m[2]) : [leeSup(m[3]), 1], x = +m[4].replace(',', '.'); const v = 1 + al[0] / al[1] * x + serieA(al, 2)[0] / serieA(al, 2)[1] * x * x; return t => Math.abs(+t.replace(',', '.') - v) < 1e-9; }
    default: throw new Error(`tipo sin recálculo: ${d.tipo}`);
  }
}
probarGenerador(gen, { semillas: 600, recalcular: p => { const v = rehacer(p); const a = p.alternativas.find(x => v(x.texto)); return a ? a.texto : null; }, igual: (esperado, valor) => String(esperado) === String(valor) });
probarFugas(gen, { grupo: p => p._datos.tipo });

test('cada problema, rehecho aparte (400 semillas por idea): una sola alternativa vale lo que se pide, y es la correcta', () => {
  let n = 0;
  for (const idea of Object.keys(gen.TIPOS_POR_IDEA)) for (let s = 0; s < 400; s++) {
    const p = gen.generar(s, { idea }), vale = rehacer(p), ok = p.alternativas.filter(a => vale(a.texto));
    assert.equal(ok.length, 1, `${p._datos.tipo} ${s}: ${plano(p.enunciado)} ${plano(p.pregunta)} → ${p.alternativas.map(a => a.texto).join(' / ')}`);
    assert.ok(ok[0].correcta, `${p._datos.tipo} ${s}: la que vale no es la correcta`);
    n++;
  }
  assert.ok(n >= 2400);
});

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla} (${c.entrada.tipo})`, () => {
    const p = gen.generar(c.semilla, { idea: c.entrada.idea });
    assert.equal(p._datos.tipo, c.entrada.tipo);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.texto);
  });
}

test('tipos por idea: las seis ideas de la teoría, y generar(semilla, { idea }) da solo los suyos, con nivel 1 y nivel 3', () => {
  const teoria = require('../../contenido/teoria/algebra/binomio-de-newton.js');
  assert.deepEqual(Object.keys(gen.TIPOS_POR_IDEA), teoria.ideas.map(i => i.id));
  for (const [idea, tipos] of Object.entries(gen.TIPOS_POR_IDEA)) {
    const vistos = new Set();
    for (let s = 0; s < 300; s++) { const p = gen.generar(s, { idea }); assert.equal(p._datos.idea, idea); vistos.add(p._datos.tipo); }
    assert.deepEqual([...vistos].sort(), [...tipos].sort(), idea);
    assert.ok(tipos.some(t => gen.NIVEL[t] === 1) && tipos.some(t => gen.NIVEL[t] === 3), idea);
  }
});

// La explicación ya no tiene que empezar por «Bien» (auditoría, 26 nov): esa exigencia forzaba el molde telegráfico
// «Bien X, pero Y»; el redactor elige cómo decir lo que estuvo bien.
test('cada explicación muestra lo que da su error, no nombra una letra y no pasa de 32 palabras', () => {
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas.filter(x => !x.correcta)) {
      const e = a.error.explicacion;
      assert.ok(e.includes(a.texto), `semilla ${s}: no muestra su valor «${a.texto}»: ${e}`);
      assert.ok(!/\b(alternativa|opción|letra) [A-E]\b|\bla [A-E]\b/.test(e), `semilla ${s}: ${e}`);
      assert.ok(e.split(/\s+/).length <= 32, `semilla ${s}: explicación larga: ${e}`);
    }
  }
});

test('un color por magnitud: lo que se busca violeta, el primer término naranja, el segundo turquesa, el tercero verde', () => {
  const COLOR = { r: 'f', a: 'o', b: 'i', c: 'd' };
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    for (const [k, vv] of Object.entries(p.variables)) assert.equal(vv.color, COLOR[k], `semilla ${s}: ${k}`);
  }
});

test('notación: superíndices de verdad, signo menos tipográfico, sin «*», «1x», «+ −», «− −» ni menos de teclado', () => {
  for (let s = 0; s < 1200; s++) {
    const p = gen.generar(s), todo = [plano(p.enunciado), plano(p.pregunta), ...p.alternativas.map(a => a.texto), ...p.alternativas.filter(a => a.error).map(a => a.error.explicacion), ...p.solucion.map(plano)].join(' | ');
    assert.ok(!/\*|\b1x|\+ −|− −|x¹(?![⁰¹²³⁴⁵⁶⁷⁸⁹])|\d-\d|(^|[\s(=:,])-\d|\^\d|null|NaN|undefined|\(\)|\b1\(/.test(todo), `semilla ${s}: ${todo}`);
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

test('la práctica no repite ninguna Predice de la unidad', () => {
  for (let s = 0; s < 2000; s++) {
    const p = gen.generar(s), t = `${plano(p.enunciado)} ${plano(p.pregunta)}`;
    assert.ok(!/\(a \+ b\)⁵|\(x − 2\)⁶ .*lugar 4|\(x² \+ 1\/x\)⁵|\(2x − 1\)⁵|elevado a 1\/2\. ¿Cuántos términos|a²b²c²/.test(t), `semilla ${s}: ${t}`);
  }
});

test('nunca se queda sin cuatro alternativas (semillas 0 a 2000, y por idea)', () => {
  for (let s = 0; s < 2000; s++) assert.ok(gen.generar(s).alternativas.length >= 4);
  for (const idea of Object.keys(gen.TIPOS_POR_IDEA)) for (let s = 0; s < 300; s++) assert.ok(gen.generar(s, { idea }).alternativas.length >= 4);
});

test('papel: 8 problemas de las seis ideas, cada uno con sus datos', () => {
  assert.equal(papel.problemas.length, 8);
  for (const q of papel.problemas) assert.match(q.enunciado, / Datos: /, q.id);
  const ideas = new Set(papel.problemas.map((q, k) => gen.generar(`papel-${k + 1}`)._datos.idea));
  assert.equal(ideas.size, 6);
});

// Auditoría (26 nov): el papel y la práctica no repiten el ejemplo de nivel 3 de la idea 3 ((x² + m/x)⁶ con 240); la
// fracción de k va simplificada («k = 9/2», no «k = 18/4»); TAL-BN-CERO es solo poner las letras en 0.
test('no repite el ejemplo «El número que falta», k simplificado y códigos con su error', () => {
  const papel = require('./papel.json');
  const mcdT = (a, b) => (b ? mcdT(b, a % b) : a);
  const textos = [];
  for (const idea of Object.keys(gen.TIPOS_POR_IDEA)) for (let s = 0; s < 400; s++) textos.push(gen.generar(s, { idea }));
  for (let k = 1; k <= 8; k++) textos.push(gen.generar(`papel-${k}`));
  for (const p of textos) {
    const todo = [plano(p.enunciado), ...p.alternativas.filter(a => a.error).map(a => a.error.explicacion), ...p.solucion.map(plano)].join(' | ');
    assert.ok(!/\(x² \+ m\/x\)⁶, con m positivo, es 240\b/.test(todo), `${p.id}: repite el ejemplo`);
    for (const [, a, b] of todo.matchAll(/k = (\d+)\/(\d+)/g)) assert.equal(mcdT(+a, +b), 1, `${p.id}: k = ${a}/${b} sin simplificar`);
    for (const a of p.alternativas.filter(x => x.error && x.error.id === 'TAL-BN-CERO')) assert.match(a.error.explicacion, /= 0/, `${p.id}: ${a.error.explicacion}`);
  }
  assert.ok(!JSON.stringify(papel).includes('es 240'), 'papel.json repite el ejemplo');
});

// Auditoría (26 nov): la práctica no repite un ejemplo ni una predicción de la teoría, aunque cambie la redacción
// («Se desarrolla (x + 2/x)⁶. ¿Cuál es el término independiente?» es el ejemplo «Con un número en b»).
test('la práctica no repite un ejemplo ni una predicción de la teoría dichos de otra manera (400 semillas por idea y papel)', () => {
  const teoria = require('../../contenido/teoria/algebra/binomio-de-newton.js');
  const E = require('../../nucleo/ecuacion.js');
  const pl = x => E.texto(x).replace(/⁠/g, '');
  const firma = t => {
    t = String(t).replace(/[ ⁠]/g, ' ').replace(/(\d) (\d{3})\b/g, '$1$2');
    const pide = ['independiente', 'central', 'lugar', 'suman', 'aproxim', 'coeficiente', 'cenefas', 'vale n', 'vale m', 'términos'].find(p => t.includes(p)) || '';
    const trozos = (t.match(/\([^()]*\)(?:[⁰¹²³⁴⁵⁶⁷⁸⁹⁻ⁿ]+| elevado a −?\d+\/\d+)?|[^\s;:¿?()]+/g) || []).map(w => w.replace(/[,.]+$/, '')).filter(w => /[\d⁰¹²³⁴⁵⁶⁷⁸⁹ⁿ(√]/.test(w)).sort();
    return [pide, ...trozos].join(' | ');
  };
  const vistos = new Map();
  for (const i of teoria.ideas) { for (const e of i.ejemplos) vistos.set(firma(pl(e.enunciado)), `${i.id}: ${e.titulo}`); vistos.set(firma(pl(i.predice.pregunta)), `${i.id}: Predice`); }
  const ps = [];
  for (const idea of Object.keys(gen.TIPOS_POR_IDEA)) for (let s = 0; s < 400; s++) ps.push(gen.generar(s, { idea }));
  for (let k = 1; k <= 8; k++) ps.push(gen.generar(`papel-${k}`));
  for (const p of ps) {
    const fi = firma(`${plano(p.enunciado)} ${plano(p.pregunta)}`);
    assert.ok(!vistos.has(fi), `${p.id}: «${plano(p.enunciado)} ${plano(p.pregunta)}» es ${vistos.get(fi)}`);
  }
});
