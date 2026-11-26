// Pruebas propias de «Binomio de Newton» (además del validador común de contenido/teoria/teoria.test.js). Etapa 9
// (26 nov 2026; docs/etapa9/propuesta-algebra.md): seis ideas reescritas contra el contrato, sin calidad: 2 hasta el
// cierre (lector en frío y auditor); la primera prueba corre el validador simulando esa marca.
// Lo que se comprueba aquí:
//   - el orden de las ideas y los ids (los cuatro de la versión anterior se conservan);
//   - un color fijo por magnitud (cabecera): cada ficha de color dice su magnitud (m) y lleva el color de def.colores;
//     nunca carmín; el verde (el tercer término c) solo en la idea 6;
//   - cada misión: no está cumplida al abrir y la cumple un solo caso de su grilla (en la idea 6, las tres
//     permutaciones de un mismo grupo);
//   - nada antes de Predice trae la respuesta de su predicción (Lee, consigna, misión, leyenda y el glosario de la idea);
//   - «Ahora tú» y «Así se resuelve» en 400 semillas por idea: cuatro opciones distintas, una sola correcta, sin texto
//     roto ni signos de teclado; la correcta rehecha aquí por otro camino (un desarrollador de polinomios propio que lee
//     el binomio del enunciado, y los coeficientes de (1 + x) elevado a α por la recurrencia (1 + x)f′ = αf): vale lo que
//     se pide y ningún distractor lo vale; ninguno repite el binomio de la predicción ni el enunciado de un ejemplo;
//   - los ejemplos de nivel 3: cinco alternativas distintas, la letra de la respuesta es la de la alternativa con su
//     valor, y las letras se reparten (una vez cada una por idea).
// Las cuentas de los 90 ejemplos se rehicieron además con sympy, sin el código de la unidad (scratchpad de la sesión,
// e9-algebra/cuentas-ejemplos.py).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Teoria = require('../../../nucleo/teoria.js');
const def = require('./binomio-de-newton.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const cat = require('../../../catalogo/cursos/algebra.json');
const E = require('../../../nucleo/ecuacion.js');
const limpia = x => (Array.isArray(x) ? x.filter(y => y !== undefined && y !== null).map(limpia) : x);
const plano = x => E.texto(x === undefined || x === null ? '' : limpia(x)).replace(/⁠/g, '');
const fichas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(fichas)
  : typeof x.v === 'string' && /^c-/.test(x.v) ? [x] : Object.values(x).flatMap(fichas));
const SEMILLAS = 400;
const IDS = ['pascal-elecciones', 'termino-general', 'termino-buscado', 'suma-coeficientes', 'exponente-no-natural', 'potencia-trinomio'];
const idea = id => def.ideas.find(i => i.id === id);

// ---------- Fracciones y polinomios propios (no usan el código de la unidad) ----------
const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const Q = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = mcd(n, d); return [n / g, d / g]; };
const qm = (a, b) => Q(a[0] * b[0], a[1] * b[1]), qs = (a, b) => Q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const qTxt = ([n, d]) => (d === 1 ? String(n) : `${n}/${d}`);
const SUP = { '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9 };
const leeSup = s => (s ? (s[0] === '⁻' ? -1 : 1) * +[...s.replace('⁻', '')].map(c => SUP[c]).join('') : 1);
// Un polinomio es un Map de «x:2,y:1» a su coeficiente [n, d].
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
// Lee «(2x − 1)», «(x² + 1/x)», «(x + 2/x)», «(x − 3y)», «(a + b + c)», «(−x + 2)», «(x + 1/x + 1)».
function leeBase(t) {
  const s = t.replace(/^\(|\)$/g, '').replace(/ − /g, ' + −').split(' + ');
  const P = new Map();
  for (let term of s) {
    let sg = 1; if (term[0] === '−') { sg = -1; term = term.slice(1); }
    let m;
    if ((m = term.match(/^(\d*)\/([a-z])([⁰-⁹¹²³]*)$/))) { P.set(clave({ [m[2]]: -leeSup(m[3]) }), Q(sg * (m[1] ? +m[1] : 1))); continue; }
    m = term.match(/^(\d*)((?:[a-z][⁻⁰¹²³⁴⁵⁶⁷⁸⁹]*)*)$/);
    if (!m) throw new Error(`no leo el término «${term}» de ${t}`);
    const e = {}; for (const [, l, ex] of m[2].matchAll(/([a-z])([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]*)/g)) e[l] = (e[l] || 0) + leeSup(ex);
    P.set(clave(e), Q(sg * (m[1] ? +m[1] : 1)));
  }
  return P;
}
// Un monomio escrito: «−160x³», «x²y³», «15x⁻²», «7» → [clave, coef].
function leeMono(t) {
  t = t.replace(/ /g, '');
  const m = t.match(/^(−?)(\d*)((?:[a-z][⁻⁰¹²³⁴⁵⁶⁷⁸⁹]*)*)$/);
  if (!m) return null;
  const e = {}; for (const [, l, ex] of m[3].matchAll(/([a-z])([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]*)/g)) e[l] = (e[l] || 0) + leeSup(ex);
  const c = (m[1] ? -1 : 1) * (m[2] ? +m[2] : 1);
  return [clave(e), Q(m[3] || m[2] ? c : NaN)];
}
const num = t => { const s = String(t).replace(/ /g, '').replace('−', '-').replace(',', '.'); if (/^-?\d+\/\d+$/.test(s)) { const [a, b] = s.split('/'); return Q(+a, +b); } return /^-?\d+$/.test(s) ? Q(+s) : /^-?\d+\.\d+$/.test(s) ? +s : null; };
const igualQ = (a, b) => Array.isArray(a) && Array.isArray(b) && a[0] === b[0] && a[1] === b[1];
const comb = (n, k) => { let r = 1; for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1); return Math.round(r); };
// Coeficientes de (1 + x) elevado a α por la recurrencia (1 + x)f′ = αf: (j + 1)c₍ⱼ₊₁₎ = (α − j)cⱼ.
const serieA = (al, k) => { let c = [1, 1]; for (let j = 0; j < k; j++) c = qm(c, Q(al[0] - j * al[1], al[1] * (j + 1))); return c; };
const leeAlfa = t => { const m = t.match(/\(1 \+ x\)(?: elevado a (−?\d+\/\d+)|([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+))/); if (!m) return null; if (m[1]) { const [a, b] = m[1].replace('−', '-').split('/'); return Q(+a, +b); } return [leeSup(m[2]), 1]; };
const decimal = q => q[0] / q[1];

// El valor que pide cada pregunta, calculado aquí. Devuelve una función que dice si un texto de opción lo vale.
function esperado(q) {
  let m;
  const bas = q.match(/\(([^()]+)\)([⁰¹²³⁴⁵⁶⁷⁸⁹]+|ⁿ)/);
  if ((m = q.match(/fila (\d+) del triángulo de Pascal .* coeficiente de (\S+) en \(a \+ b\)([⁰-⁹¹²³]+)\?/))) {
    const P = potP(leeBase('(a + b)'), leeSup(m[3])), [k] = leeMono(m[2]); return t => igualQ(P.get(k), num(t));
  }
  if ((m = q.match(/cenefas de (\d+) losetas: (\d+) turquesas?/))) { const v = comb(+m[1], +m[2]); return t => igualQ(Q(v), num(t)); }
  if ((m = q.match(/coeficientes de xⁿ⁻([⁰-⁹¹²³]+)y\S* y de xⁿ⁻([⁰-⁹¹²³]+)/))) {
    const k1 = leeSup(m[1]), k2 = leeSup(m[2]); const ns = []; for (let n = k2; n < 40; n++) if (comb(n, k1) === comb(n, k2)) ns.push(n);
    assert.equal(ns.length, 1); return t => igualQ(Q(ns[0]), num(t));
  }
  if ((m = q.match(/término de lugar (\d+) es ([^?]+?)\. ¿Cuánto vale n\?/))) {
    const L = +m[1], [k, c] = leeMono(m[2]), ns = [];
    for (let n = L - 1; n < 30; n++) { const P = potP(leeBase(`(${bas[1]})`), n), orden = [...P.entries()].sort((u, w) => (deClave(w[0]).x || 0) - (deClave(u[0]).x || 0)); if (orden[L - 1] && orden[L - 1][0] === k && igualQ(orden[L - 1][1], c)) ns.push(n); }
    assert.equal(ns.length, 1, q); return t => igualQ(Q(ns[0]), num(t));
  }
  if ((m = q.match(/el término independiente está en el lugar (\d+)\. ¿Cuánto vale n\?/))) {
    const L = +m[1], ns = [];
    for (let n = 1; n < 30; n++) { const P = potP(leeBase(`(${bas[1]})`), n), orden = [...P.keys()].sort((u, w) => (deClave(w).x || 0) - (deClave(u).x || 0)); if (orden[L - 1] === '') ns.push(n); }
    assert.equal(ns.length, 1, q); return t => igualQ(Q(ns[0]), num(t));
  }
  if ((m = q.match(/suman ([\d ]+)\. ¿Cuántos términos tiene\?/))) {
    const s = +m[1].replace(/ /g, ''), base = leeBase(`(${bas[1]})`), b = [...base.values()].reduce((a, c) => qs(a, c), [0, 1])[0], ns = [];
    for (let n = 1; n < 30; n++) if (b ** n === s) ns.push(n);
    assert.equal(ns.length, 1); return t => igualQ(Q(potP(base, ns[0]).size), num(t));
  }
  if ((m = q.match(/coeficiente de x² en el desarrollo de \(1 ([+−]) (\d)x\)(?: elevado a (−?\d+\/\d+)|([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+))\?/))) {
    const c = (m[1] === '−' ? -1 : 1) * +m[2], a2 = m[3] ? Q(...m[3].replace('−', '-').split('/').map(Number)) : [leeSup(m[4]), 1];
    const v = qm(serieA(a2, 2), Q(c * c)); return t => igualQ(v, num(t));
  }
  const al = leeAlfa(q);
  if (al && al[1] !== 1 || al && /Con los tres primeros/.test(q) || al && /coeficiente de x[²³] en el desarrollo de \(1 \+ x\)/.test(q)) {
    if ((m = q.match(/coeficiente de x([²³]) en el desarrollo de \(1 \+ x\)/))) { const v = serieA(al, leeSup(m[1])); return t => igualQ(v, num(t)); }
    if ((m = q.match(/¿cuánto da \S+, aproximado\?/))) { const x = num(q.match(/da (?:1\/)?√?([\d,]+), aproximado/)[1]) - 1; return t => { const v = num(t); return typeof v === 'number' && Math.abs(v - (1 + decimal(al) * x + decimal(serieA(al, 2)) * x * x)) < 1e-9; }; }
    if (/Cuántos términos/.test(q)) return t => t === 'No termina';
  }
  if (/Cuántos términos tiene el desarrollo/.test(q)) {
    if (al && al[1] === 1 && al[0] >= 0) return t => igualQ(Q(al[0] + 1), num(t));
    if (al) return t => t === 'No termina';
    const n = leeSup(bas[2]), P = potP(leeBase(`(${bas[1]})`), n); return t => igualQ(Q(P.size), num(t));
  }
  const n = bas && bas[2] !== 'ⁿ' ? leeSup(bas[2]) : null, P = n !== null ? potP(leeBase(`(${bas[1]})`), n) : null;
  if ((m = q.match(/coeficiente de (\S+) en el desarrollo/)) || (m = q.match(/coeficiente de (\S+)\?/))) {
    const [k] = leeMono(m[1]); return t => igualQ(P.get(k) || [0, 1], num(t));
  }
  if (/término independiente/.test(q) && /Si lo tiene/.test(q)) {
    const orden = [...P.keys()].sort((u, w) => (deClave(w).x || 0) - (deClave(u).x || 0)), L = orden.indexOf('') + 1;
    return t => (L ? t === `Sí, el de lugar ${L}` : t === 'No tiene');
  }
  if (/término independiente/.test(q)) return t => igualQ(P.get('') || [0, 1], num(t));
  if (/suman los coeficientes/.test(q)) { const s = [...P.values()].reduce((a, c) => qs(a, c), [0, 1]); return t => igualQ(s, num(t)); }
  if ((m = q.match(/término de lugar (\d+)(?:\?| del desarrollo)/))) {
    const orden = [...P.entries()].sort((u, w) => (deClave(w[0]).x || 0) - (deClave(u[0]).x || 0)), [k, c] = orden[+m[1] - 1];
    return t => { const l = leeMono(t); return l && l[0] === k && igualQ(l[1], c); };
  }
  if ((m = q.match(/en qué lugar está el término con (\S+)\?/))) {
    const [k] = leeMono(m[1]), orden = [...P.keys()].sort((u, w) => (deClave(w).x || 0) - (deClave(u).x || 0)); return t => t === `${orden.indexOf(k) + 1}.º`;
  }
  if (/término central/.test(q)) {
    const orden = [...P.entries()].sort((u, w) => (deClave(w[0]).x || 0) - (deClave(u[0]).x || 0)), [k, c] = orden[(orden.length - 1) / 2];
    return t => { const l = leeMono(t); return l && l[0] === k && igualQ(l[1], c); };
  }
  throw new Error(`pregunta que la prueba no sabe rehacer: ${q}`);
}

test('el validador con calidad 2 simulada no encuentra nada (60 semillas)', () => {
  const u = cat.unidades.find(x => x.id === def.unidad);
  assert.deepEqual(Teoria.problemas(Object.assign({}, def, { calidad: 2 }), { temas: u.temas, semillas: 60 }), []);
});

test('las seis ideas, en orden, con los cuatro ids de antes', () => {
  assert.deepEqual(def.ideas.map(i => i.id), IDS);
});

test('un color fijo por magnitud; nunca carmín; el verde solo en la idea 6', () => {
  for (const i of def.ideas) {
    const fs = fichas(i);
    for (const fi of fs) {
      assert.ok(fi.v !== 'c-h', `${i.id}: ficha en carmín`);
      if (fi.m) assert.equal(fi.v, `c-${def.colores[fi.m]}`, `${i.id}: «${fi.t}» (${fi.m})`);
      if (fi.v === 'c-d') assert.equal(i.id, 'potencia-trinomio', `${i.id}: verde fuera de la idea 6`);
    }
  }
});

test('cada misión: no está cumplida al abrir y la cumple un solo caso (tres permutaciones en la idea 6)', () => {
  for (const i of def.ideas) {
    const g = Teoria.grilla(i.juega.controles), ok = g.filter(v => i.juega.mision.logrado(v));
    assert.ok(!i.juega.mision.logrado(Teoria.inicio(i.juega)), `${i.id}: cumplida al abrir`);
    assert.equal(ok.length, i.id === 'potencia-trinomio' ? 3 : 1, `${i.id}: ${ok.length} casos`);
  }
});

test('nada antes de Predice trae su respuesta (Lee, juego, misión, leyenda, glosario de la idea)', () => {
  const porIdea = require('../../../nucleo/glosario.js').porIdea(def);
  def.ideas.forEach((i, n) => {
    const resp = plano(i.predice.opciones.find(o => o.correcta).texto);
    const glos = (porIdea[n] || []).map(t => [t.def, t.simple, ...(t.ejemplos || [])].join(' '));
    const antes = [...i.lee.tarjetas.map(t => plano(t.texto)), plano(i.juega.consigna), plano(i.juega.mision.texto), plano(i.juega.mision.bien),
      ...i.juega.leyenda.map(l => plano(l.t)), ...glos].join(' | ');
    const re = new RegExp(`(^|[^0-9/,x])${resp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^0-9/,⁰¹²³⁴⁵⁶⁷⁸⁹])`);
    if (resp.length >= 2) assert.ok(!re.test(antes), `${i.id}: «${resp}» aparece antes de Predice`);
  });
});

test('«Ahora tú» y «Así se resuelve» en 400 semillas: una correcta, rehecha por otro camino, sin texto roto ni repetidos', () => {
  for (const i of def.ideas) {
    const enun = new Set(i.ejemplos.map(e => plano(e.enunciado)));
    for (let s = 0; s < SEMILLAS; s++) {
      const a = i.ahoraTu.generar(s), q = plano(a.pregunta), textos = a.opciones.map(o => plano(o.texto));
      const todo = [q, ...textos, ...a.opciones.map(o => plano(o.siFuera || '')), plano(a.solucion.texto), plano(a.solucion.ecuacion), ...a.datos.map(plano)].join(' | ');
      assert.ok(!/NaN|undefined|Infinity|\[object|\+ -|− −|· -|= -|\+ −\d|1\(|\b1k\b/.test(todo), `${i.id} ${s}: texto roto: ${todo.slice(0, 300)}`);
      assert.equal(a.opciones.length, 4, `${i.id} ${s}`);
      assert.equal(new Set(textos).size, 4, `${i.id} ${s}: opciones repetidas`);
      assert.equal(a.opciones.filter(o => o.correcta).length, 1);
      assert.ok(!enun.has(q), `${i.id} ${s}: repite un ejemplo`);
      const vale = esperado(q);
      a.opciones.forEach(o => assert.equal(!!vale(plano(o.texto)), !!o.correcta, `${i.id} ${s}: «${q}» → «${plano(o.texto)}»`));
      const r = i.resuelve.generar(s), qr = plano(r.enunciado);
      assert.ok(!enun.has(qr), `${i.id} ${s}: «Así se resuelve» repite un ejemplo`);
      assert.ok(esperado(qr)(plano(r.respuesta)), `${i.id} ${s}: «${qr}» → ${plano(r.respuesta)}`);
    }
  }
});

test('ejemplos de nivel 3: cinco alternativas, la letra de la respuesta es la suya y las letras se reparten', () => {
  for (const i of def.ideas) {
    const letras = [];
    for (const e of i.ejemplos.filter(x => x.nivel === 3)) {
      const alts = e.alternativas.map(plano);
      assert.equal(alts.length, 5); assert.equal(new Set(alts).size, 5, e.titulo);
      const resp = plano(e.respuesta), L = resp[0], valor = resp.slice(3);
      assert.ok(/^[A-E]$/.test(L), e.titulo);
      const alt = alts['ABCDE'.indexOf(L)];
      assert.ok(valor === alt || valor.endsWith(alt) || valor.includes(alt), `${e.titulo}: «${valor}» no es la ${L} («${alt}»)`);
      letras.push(L);
    }
    assert.deepEqual([...letras].sort(), ['A', 'B', 'C', 'D', 'E'], `${i.id}: ${letras}`);
  }
});

// Auditoría (26 nov): la cuenta «C(n, k) · a · b = término» se cumple tal como se lee. Con a = x³ sin paréntesis salía
// «C(8, 5) · x³³ · (−2/x)⁵ = −1 792x⁴», que se lee x elevado a 33. Cada factor se lee aquí sin el código de la unidad.
const SUPN = s => (s ? leeSup(s) : 1);
function leeFactor(t) {
  let m = t.match(/^\((.+)\)([⁰¹²³⁴⁵⁶⁷⁸⁹]*)$/), dentro, fuera;
  if (m) { dentro = m[1]; fuera = SUPN(m[2]); } else { dentro = t; fuera = 1; }
  let c, e;
  if ((m = dentro.match(/^(−?)(\d*)\/x([⁰¹²³⁴⁵⁶⁷⁸⁹]*)$/))) { c = (m[1] ? -1 : 1) * (m[2] ? +m[2] : 1); e = -SUPN(m[3]); }
  else if ((m = dentro.match(/^(−?)(\d*)(?:x([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]*))?$/)) && (m[2] || m[3] !== undefined)) { c = (m[1] ? -1 : 1) * (m[2] ? +m[2] : 1); e = m[3] === undefined ? 0 : SUPN(m[3]); }
  else return null;
  return [c ** fuera, e * fuera];
}
test('la cuenta del término se cumple tal como se lee, factor por factor (400 semillas, ideas 2 a 4)', () => {
  let vistas = 0;
  for (const i of def.ideas) for (let s = 0; s < SEMILLAS; s++) {
    const ecs = [i.ahoraTu.generar(s).solucion.ecuacion, ...i.resuelve.generar(s).pasos.map(p => p.ecuacion)];
    for (const ec of ecs) {
      const t = plano(ec).replace(/ /g, ' '), m = t.match(/^C\((\d+), (\d+)\)((?: · \S+)+) = (−?[\d ]*\d?x?[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]*)$/);
      if (!m) continue;
      let c = comb(+m[1], +m[2]), e = 0;
      for (const fa of m[3].split(' · ').slice(1)) { const r = leeFactor(fa); assert.ok(r, `${i.id} ${s}: no leo «${fa}» en ${t}`); c *= r[0]; e += r[1]; }
      const [k, q] = leeMono(m[4].replace(/(\d) (\d)/g, '$1$2'));
      assert.equal(c, q[0], `${i.id} ${s}: ${t}`);
      assert.equal(e, deClave(k).x || 0, `${i.id} ${s}: el exponente de x no cuadra en ${t}`);
      vistas++;
    }
  }
  assert.ok(vistas > 1000, `solo ${vistas} cuentas leídas`);
});

// Auditoría (26 nov): «− 1 · 3» cuando el exponente de b es 1 (idea 3, n desde el lugar del independiente), y cada
// código dice el error que modela: TAL-BN-CERO es poner las letras en 0 (pⁿ es TAL-BN-PRIMERO; bⁿ sin despejar,
// TAL-BN-SIN-DESPEJAR).
test('sin «1 ·» delante de un número y TAL-BN-CERO solo para poner las letras en 0 (400 semillas)', () => {
  for (const i of def.ideas) for (let s = 0; s < SEMILLAS; s++) {
    const a = i.ahoraTu.generar(s);
    const todo = [plano(a.solucion.texto), ...a.opciones.map(o => plano(o.siFuera || ''))].join(' | ');
    assert.ok(!/(^|[^\d,/])1 · \d/.test(todo), `${i.id} ${s}: ${todo}`);
    for (const o of a.opciones.filter(x => x.error === 'TAL-BN-CERO')) assert.match(plano(o.siFuera), /= 0/, `${i.id} ${s}: ${plano(o.siFuera)}`);
  }
});

// Auditoría (26 nov): «Ahora tú» y «Así se resuelve» no repiten un ejemplo de la unidad ni una predicción aunque lo digan
// con otras palabras. La firma junta los trozos de matemática y lo que se pide, sin orden ni redacción (la de la prueba
// se escribe aparte de la de la unidad).
const firmaP = t => {
  t = String(t).replace(/[ ⁠]/g, ' ').replace(/(\d) (\d{3})\b/g, '$1$2');
  const pide = ['independiente', 'central', 'lugar', 'suman', 'aproxim', 'coeficiente', 'cenefas', 'vale n', 'vale m', 'términos'].find(p => t.includes(p)) || '';
  const trozos = (t.match(/\([^()]*\)(?:[⁰¹²³⁴⁵⁶⁷⁸⁹⁻ⁿ]+| elevado a −?\d+\/\d+)?|[^\s;:¿?()]+/g) || []).map(w => w.replace(/[,.]+$/, '')).filter(w => /[\d⁰¹²³⁴⁵⁶⁷⁸⁹ⁿ(√]/.test(w)).sort();
  return [pide, ...trozos].join(' | ');
};
test('ningún «Ahora tú» ni «Así se resuelve» es un ejemplo o una predicción dicho de otra manera (400 semillas)', () => {
  const vistos = new Map();
  for (const i of def.ideas) { for (const e of i.ejemplos) vistos.set(firmaP(plano(e.enunciado)), `${i.id}: ${e.titulo}`); vistos.set(firmaP(plano(i.predice.pregunta)), `${i.id}: Predice`); }
  for (const i of def.ideas) for (let s = 0; s < SEMILLAS; s++) {
    for (const q of [plano(i.ahoraTu.generar(s).pregunta), plano(i.resuelve.generar(s).enunciado)]) {
      const fi = firmaP(q);
      assert.ok(!vistos.has(fi), `${i.id} ${s}: «${q}» es ${vistos.get(fi)}`);
    }
  }
});
