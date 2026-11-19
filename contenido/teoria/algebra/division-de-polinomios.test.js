// Pruebas propias de «División de polinomios y cocientes notables» (además del validador común de
// contenido/teoria/teoria.test.js). Etapa 6 (19 nov 2026; docs/etapa6/propuesta-algebra.md): seis ideas reescritas
// contra el contrato. La unidad lleva calidad: 2 desde el 19 nov (lector en frío y auditor);
// la primera prueba corre además el validador. Lo que se comprueba aquí:
//   - el orden de las ideas y los ids publicados (los cinco de la ronda 2 se conservan; `horner` es nueva);
//   - un color fijo por magnitud (cabecera): cada ficha de color dice su magnitud (m) y lleva el color de def.colores;
//     divisor turquesa, cociente violeta, resto naranja; nunca carmín ni verde, tampoco en las figuras;
//   - toda figura de la unidad cabe en su lienzo y está marcada como dibujo de prueba si es de alg-reparto;
//   - cada misión: no está cumplida al abrir y la cumple un solo caso de su grilla;
//   - nada antes de Predice trae la respuesta de su predicción (Lee, consigna, misión, leyenda, lectura en todo el
//     juego y el glosario de la idea);
//   - «Ahora tú» en 400 semillas por idea: cuatro opciones distintas y una sola correcta; cuando la pregunta divide un
//     polinomio entre otro, el cociente o el resto se rehacen aquí con una división propia (fracciones exactas);
//   - toda igualdad escrita en ecuaciones (Mira, ejemplos, «Así se resuelve», soluciones, lecturas) es cierta: un
//     analizador propio la evalúa en varios valores de x e y;
//   - los ejemplos de nivel 3: cinco alternativas distintas, la letra de la respuesta es la de la alternativa que da el
//     valor, y las letras se reparten (una vez cada una por idea);
//   - no se adelanta Factorización: ni «factor» ni «raíz» en el texto del alumno.
// Las cuentas de los 90 ejemplos se rehicieron además con sympy, sin el código de la unidad
// (scratchpad de la sesión, e6-algebra/scripts/cuentas-ejemplos.py).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../../../nucleo/kit/kit.js');
const Teoria = require('../../../nucleo/teoria.js');
const Glosario = require('../../../nucleo/glosario.js');
const E = require('../../../nucleo/ecuacion.js');
const def = require('./division-de-polinomios.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const idea = id => def.ideas.find(i => i.id === id);
const limpia = x => (Array.isArray(x) ? x.filter(y => y !== undefined && y !== null).map(limpia) : x);
const plano = x => E.texto(x === undefined || x === null ? '' : limpia(x)).replace(/⁠/g, '');
const fichas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(fichas)
  : typeof x.v === 'string' && /^c-/.test(x.v) ? [x] : Object.values(x).flatMap(fichas));
const SEMILLAS = 400;

// ---------- Cálculo aparte: el valor de una expresión escrita como la ve el alumno ----------
const SUP = { '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9 };
function valor(texto, env) {
  texto = texto.replace(/(\d)[  ](?=\d{3}(?!\d))/g, '$1');   // los miles van con espacio: 1 000
  const t = [];
  for (let i = 0; i < texto.length;) {
    const c = texto[i];
    if (/\s/.test(c)) { i++; continue; }
    if (/[0-9]/.test(c)) { let j = i; while (j < texto.length && /[0-9]/.test(texto[j])) j++; t.push(['n', +texto.slice(i, j)]); i = j; continue; }
    if (c in SUP) { let v = 0; while (i < texto.length && texto[i] in SUP) v = v * 10 + SUP[texto[i++]]; t.push(['^', v]); continue; }
    if ('xy'.includes(c)) { t.push(['v', c]); i++; continue; }
    if ('+−·÷/()[]'.includes(c)) { t.push([c, c]); i++; continue; }
    return NaN;
  }
  let k = 0;
  const ver = () => (k < t.length ? t[k][0] : null);
  const factor = () => {
    const a = ver();
    if (a === '−') { k++; return -factor(); }
    let b;
    if (a === 'n') b = t[k++][1];
    else if (a === 'v') b = env[t[k++][1]];
    else if (a === '(' || a === '[') { k++; b = expr(); if (ver() !== ')' && ver() !== ']') throw new Error('paréntesis'); k++; }
    else throw new Error('factor');
    if (ver() === '^') b = b ** t[k++][1];
    return b;
  };
  // El producto sin signo (2x², 3(x + 1)) va antes que · y ÷: «6x⁴ ÷ 2x²» es (6x⁴) ÷ (2x²).
  const junto = () => { let v = factor(); for (;;) { const a = ver(); if (a === 'n' || a === 'v' || a === '(' || a === '[') v *= factor(); else return v; } };
  const term = () => {
    let v = junto();
    for (;;) {
      const a = ver();
      if (a === '·') { k++; v *= junto(); } else if (a === '÷' || a === '/') { k++; v /= junto(); } else return v;
    }
  };
  function expr() { let v = term(); while (ver() === '+' || ver() === '−') { const op = t[k++][0], w = term(); v = op === '+' ? v + w : v - w; } return v; }
  try { const v = expr(); return k === t.length ? v : NaN; } catch (e) { return NaN; }
}
const PUNTOS = [{ x: 2, y: 3 }, { x: -3, y: 5 }, { x: 7, y: -2 }, { x: 1.5, y: 0.5 }];
// Revisa las igualdades de un texto de ecuación: cada tramo «A = B = C» separado por «→», «;», «,   » o «:».
let comprobadas = 0;
function igualdades(txt, donde) {
  // Lo que va antes de «→» es una ecuación por resolver (x + 2 = 0 → x = −2), no una igualdad que valga siempre.
  const partes = txt.split('→'), ultima = partes[partes.length - 1];
  for (const trozo of ultima.split(/;|,\s{2,}|:\s/)) {
    if (/[<>≤≥≠]/.test(trozo)) continue;
    const lados = trozo.split('=').map(l => l.trim());
    for (let i = 0; i + 1 < lados.length; i++) {
      const a = PUNTOS.map(p => valor(lados[i], p)), b = PUNTOS.map(p => valor(lados[i + 1], p));
      if (a.some(Number.isNaN) || b.some(Number.isNaN) || !lados[i] || !lados[i + 1] || /^[xy]$/.test(lados[i])) continue;   // «x = −2»: una solución
      comprobadas++;
      assert.ok(a.every((v, j) => Math.abs(v - b[j]) < 1e-6 * Math.max(1, Math.abs(v))), `${donde}: «${lados[i]} = ${lados[i + 1]}» no se cumple (${a[0]} y ${b[0]})`);
    }
  }
}

// ---------- División propia, con fracciones exactas ----------
const fr = (n, d = 1) => { const g = (function m(a, b) { return b ? m(b, a % b) : Math.abs(a); })(n, d) || 1; return d < 0 ? [-n / g, -d / g] : [n / g, d / g]; };
const fsum = (a, b) => fr(a[0] * b[1] + b[0] * a[1], a[1] * b[1]), fmul = (a, b) => fr(a[0] * b[0], a[1] * b[1]), fdiv = (a, b) => fr(a[0] * b[1], a[1] * b[0]);
// Lee un polinomio en x tal como se escribe («2x³ − 5x + 1») → coeficientes de mayor a menor.
function leerPoli(t) {
  const s = t.replace(/\s/g, '').replace(/−/g, '-');
  if (!/^[-+0-9x⁰¹²³⁴⁵⁶⁷⁸⁹]+$/.test(s)) return null;
  const terms = s.match(/[+-]?[^+-]+/g), cs = {};
  let gr = 0;
  for (const tt of terms) {
    const m = tt.match(/^([+-]?)(\d*)(x?)([⁰¹²³⁴⁵⁶⁷⁸⁹]*)$/);
    if (!m) return null;
    const c = (m[1] === '-' ? -1 : 1) * (m[2] ? +m[2] : 1), e = m[3] ? (m[4] ? [...m[4]].reduce((v, ch) => v * 10 + SUP[ch], 0) : 1) : 0;
    if (!m[2] && !m[3]) return null;
    cs[e] = (cs[e] || 0) + c; gr = Math.max(gr, e);
  }
  return Array.from({ length: gr + 1 }, (_, i) => cs[gr - i] || 0);
}
function divide(D, d) {
  const cur = D.map(c => fr(c)), q = [];
  for (let k = 0; k + d.length <= cur.length; k++) { const c = fdiv(cur[k], fr(d[0])); q.push(c); d.forEach((u, i) => { cur[k + i] = fsum(cur[k + i], fmul(c, fr(-u))); }); }
  return { q, r: cur.slice(cur.length - (d.length - 1)) };
}
const fTxt = c => (c[1] === 1 ? String(c[0]) : `${c[0]}/${c[1]}`).replace('-', '−');
function poliTxt(cs) {
  const n = cs.length - 1, out = [];
  cs.forEach((c, k) => { if (c[0] === 0) return; const e = n - k, abs = [Math.abs(c[0]), c[1]], lit = e === 0 ? '' : e === 1 ? 'x' : 'x' + String(e).split('').map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]).join('');
    const num = abs[0] === 1 && abs[1] === 1 && lit ? '' : fTxt(abs); out.push((c[0] < 0 ? (out.length ? ' − ' : '−') : (out.length ? ' + ' : '')) + num + lit); });
  return out.join('') || '0';
}

// ---------- La unidad ----------
test('seis ideas en el orden de la propuesta; los ids publicados se conservan; pasa el validador con calidad 2 simulada', () => {
  assert.deepEqual(def.ideas.map(i => i.id), ['algoritmo', 'horner', 'ruffini', 'divisor-k', 'teorema-resto', 'cocientes-notables']);
  assert.equal(def.calidad, 2, 'cerrada el 19 nov tras el lector en frío y el auditor');
  const u = require('../../../catalogo/cursos/algebra.json').unidades.find(x => x.id === def.unidad);
  assert.deepEqual(Teoria.problemas(Object.assign({}, def, { calidad: 2 }), { temas: u.temas, semillas: 60 }), []);
  assert.deepEqual(Teoria.pendientes(Object.assign({}, def, { calidad: 2 })), [], 'una unidad nueva no agrega excepciones');
  for (const ids of Object.values(def.laboratorioIdeas)) for (const id of ids) assert.ok(idea(id), id);
});

test('cada idea estrena de 2 a 4 palabras con su aproximación y tres ejemplos', () => {
  Glosario.porIdea(def).forEach((es, k) => {
    const n = es.filter(e => e.simple).length;
    assert.ok(n >= 2 && n <= 4, `${def.ideas[k].id}: ${n}`);
  });
  for (const g of def.glosario) assert.ok((g.ejemplos || []).length >= 3, g.termino);
});

// ---------- Colores ----------
test('la tabla de colores: divisor turquesa, cociente violeta, resto naranja; sin carmín ni verde', () => {
  assert.deepEqual(def.colores, { divisor: 'i', 'número del divisor': 'i', cociente: 'f', resto: 'o' });
});

function lecturas(i) {
  const out = [], add = (donde, x) => out.push({ donde, x });
  const j = i.juega;
  for (const [k, t] of i.lee.tarjetas.entries()) add(`lee ${k + 1}`, [t.titulo, t.texto, t.ecuacion]);
  add('consigna', j.consigna); add('misión', [j.mision.texto, j.mision.bien]); add('leyenda', j.leyenda.map(x => x.s));
  for (const v of Teoria.grilla(j.controles)) add(`lectura ${JSON.stringify(v)}`, j.lectura(v));
  add('predice', [i.predice.pregunta, i.predice.datos, i.predice.opciones.map(o => o.texto)]);
  for (const [k, p] of i.mira.pasos.entries()) add(`mira ${k + 1}`, [p.texto, p.ecuacion]);
  add('regla', [i.regla.texto, i.regla.ecuacion]);
  for (const [k, e] of i.ejemplos.entries()) add(`ejemplo ${k + 1}`, [e.enunciado, e.alternativas, e.datos, e.solucion, e.respuesta]);
  for (let s = 0; s < 60; s++) {
    const a = i.ahoraTu.generar(s), r = i.resuelve.generar(s);
    add(`ahora tú ${s}`, [a.pregunta, a.datos, a.opciones.map(o => o.texto), a.solucion]);
    add(`resuelve ${s}`, [r.enunciado, r.datos, r.pasos.map(x => [x.texto, x.ecuacion]), r.respuesta]);
  }
  return out;
}
test('cada ficha de color dice su magnitud y lleva su color; ninguna en carmín ni en verde', () => {
  let n = 0;
  for (const i of def.ideas) for (const { donde, x } of lecturas(i)) for (const fch of fichas(x)) {
    n++;
    assert.ok(fch.m in def.colores, `${i.id} ${donde}: ficha «${fch.t}» sin magnitud`);
    assert.equal(fch.v, `c-${def.colores[fch.m]}`, `${i.id} ${donde}: «${fch.t}» (${fch.m})`);
  }
  assert.ok(n > 2000, `fichas revisadas: ${n}`);
});

// ---------- Figuras ----------
function figuras(i) {
  const figs = [];
  for (const t of i.lee.tarjetas) if (t.dibujo) figs.push(t.dibujo);
  for (const v of Teoria.grilla(i.juega.controles)) figs.push(i.juega.dibujo(v));
  figs.push(i.predice.dibujo, i.predice.revelar, i.regla.dibujo);
  for (const p of i.mira.pasos) figs.push({ pieza: i.mira.pieza, datos: i.mira.datos, estado: p.estado });
  for (const e of i.ejemplos) if (e.figura) figs.push(e.figura);
  for (let s = 0; s < 30; s++) { const r = i.resuelve.generar(s); if (r.dibujo) figs.push(r.dibujo); for (const p of r.pasos) if (p.dibujo) figs.push(p.dibujo); const a = i.ahoraTu.generar(s); if (a.dibujo) figs.push(a.dibujo); }
  return figs.filter(Boolean).map(fg => Object.assign({ pieza: i.pieza }, fg));
}
test('las figuras: sin carmín ni verde, dentro del lienzo, y las de alg-reparto marcadas como dibujo de prueba', () => {
  let n = 0;
  for (const i of def.ideas) for (const fg of figuras(i)) {
    const P = Kit.piezas[fg.pieza];
    assert.ok(P, `${i.id}: pieza ${fg.pieza}`);
    const s = P.dibujar(fg.datos, fg.estado || {});
    assert.ok(!/var\(--c-[hd]\)/.test(s), `${i.id}: carmín o verde en ${fg.pieza}`);
    assert.ok(!/NaN|undefined|Infinity/.test(s), `${i.id}: ${fg.pieza} con NaN`);
    if (fg.pieza === 'alg-reparto') { assert.ok(/data-prueba="si"/.test(s)); assert.ok(P.cabe(fg.datos, fg.estado || {}), `${i.id}: no cabe ${JSON.stringify(fg.datos).slice(0, 140)}`); }
    n++;
  }
  assert.ok(n > 300, `figuras: ${n}`);
});

// ---------- Juego ----------
test('cada misión: no está cumplida al abrir y la cumple un solo caso de su grilla', () => {
  for (const i of def.ideas) {
    const j = i.juega, inicio = Object.fromEntries(j.controles.map(c => [c.id, c.inicio !== undefined ? c.inicio : c.opciones[0].valor]));
    assert.ok(!j.mision.logrado(inicio), `${i.id}: cumplida al abrir`);
    const cumplen = Teoria.grilla(j.controles).filter(v => j.mision.logrado(v));
    assert.equal(cumplen.length, 1, `${i.id}: ${cumplen.length} casos cumplen la misión`);
  }
});
const inicioDe = i => Object.fromEntries(i.juega.controles.map(c => [c.id, c.inicio !== undefined ? c.inicio : c.opciones[0].valor]));
// La lectura del juego se revisa al abrir: la del juego 2 muestra lo que queda en cada caso, y 3x² sale ahí con otro
// cociente (no es la respuesta de la predicción, que divide entre 2x²).
test('nada antes de Predice trae la respuesta de su predicción', () => {
  const por = Glosario.porIdea(def);
  def.ideas.forEach((i, k) => {
    const bien = plano(i.predice.opciones.find(o => o.correcta).texto);
    const antes = [...i.lee.tarjetas.map(t => [t.titulo, t.texto, t.ecuacion]), i.juega.consigna, i.juega.mision.texto, i.juega.mision.bien, i.juega.leyenda.map(x => [x.s, x.t]),
      i.juega.lectura(inicioDe(i)), ...por[k].map(g => [g.def, g.simple, g.ejemplos])].map(plano).join(' | ');
    // La respuesta dicha como resultado («= 8x²», «da 2x», «es 3x²»), no como parte de otro polinomio (2x − 1).
    const esc = bien.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(=|\\bes|\\bda|\\bvale)\\s+${esc}(?![\\wⁿ⁰¹²³⁴⁵⁶⁷⁸⁹]|\\s*[+−·])`);
    if (bien.length >= 2) assert.ok(!re.test(antes), `${i.id}: «${bien}» antes de Predice`);
  });
  // Las de una cifra, con su frase: el grado del cociente (7 − 3), el resto 7 de la tabla y el resto 3 de x⁵ − 3x² + 7.
  const texto = id => { const i = idea(id); return [...i.lee.tarjetas.map(t => [t.texto, t.ecuacion]), i.juega.mision.bien].map(plano).join(' | '); };
  assert.ok(!/grado de q|menos el de d|7 − 3/.test(texto('algoritmo')));
  assert.ok(!/con 0|un 0|ceros/.test(plano(idea('ruffini').lee.tarjetas.map(t => t.texto))), 'Lee de Ruffini no habla de las potencias que faltan');
  assert.ok(!/D\(a\)|evalu/.test(texto('teorema-resto')));
  assert.ok(!/n − k|k − 1/.test(texto('cocientes-notables')));
});

// ---------- Ahora tú ----------
test('«Ahora tú»: 400 semillas por idea, cuatro opciones distintas y una sola correcta', () => {
  for (const i of def.ideas) for (let s = 0; s < SEMILLAS; s++) {
    const a = i.ahoraTu.generar(s), txt = a.opciones.map(o => plano(o.texto));
    assert.equal(a.opciones.length, 4, `${i.id} ${s}`);
    assert.equal(new Set(txt).size, 4, `${i.id} ${s}: ${txt.join(' ; ')}`);
    assert.equal(a.opciones.filter(o => o.correcta).length, 1);
    for (const o of a.opciones) if (!o.correcta) assert.ok(o.error && o.siFuera, `${i.id} ${s}`);
    assert.ok(Array.isArray(a.datos) && a.datos.length, `${i.id} ${s}: sin datos`);
  }
});
test('«Ahora tú»: el cociente y el resto se rehacen con una división propia', () => {
  let n = 0;
  for (const i of def.ideas) for (let s = 0; s < SEMILLAS; s++) {
    const a = i.ahoraTu.generar(s), p = plano(a.pregunta), bien = plano(a.opciones.find(o => o.correcta).texto);
    const m = p.match(/dividir (.+?) entre (.+?)(?:,|\?| con)/) || p.match(/Al dividir (.+?) entre (.+?),/);
    if (!m) continue;
    const D = leerPoli(m[1]), d = leerPoli(m[2]);
    if (!D || !d) continue;
    const { q, r } = divide(D, d), rr = r.slice(r.findIndex(c => c[0] !== 0) < 0 ? r.length - 1 : r.findIndex(c => c[0] !== 0));
    if (/resto/.test(p) && !/cociente/.test(p)) { assert.equal(bien, poliTxt(rr), `${i.id} ${s}: ${p}`); n++; }
    else if (/cuál es el cociente/i.test(p)) { assert.equal(bien, poliTxt(q), `${i.id} ${s}: ${p}`); n++; }
    else if (/suman los coeficientes del cociente/.test(p)) { const sq = q.reduce((u, w) => fsum(u, w), fr(0)); assert.equal(bien, fTxt(sq), `${i.id} ${s}`); n++; }
    else if (/coeficiente de x en el cociente/.test(p)) { assert.equal(bien, fTxt(q[q.length - 2]), `${i.id} ${s}`); n++; }
  }
  assert.ok(n > 600, `divisiones rehechas: ${n}`);
});

// ---------- Igualdades ----------
test('toda igualdad de las ecuaciones es cierta (Mira, regla, ejemplos, «Así se resuelve», soluciones y lecturas)', () => {
  comprobadas = 0;
  for (const i of def.ideas) {
    for (const [k, p] of i.mira.pasos.entries()) igualdades(plano(p.ecuacion), `${i.id} mira ${k + 1}`);
    for (const t of i.lee.tarjetas) if (t.ecuacion) igualdades(plano(t.ecuacion), `${i.id} lee`);
    for (const [k, e] of i.ejemplos.entries()) for (const l of e.solucion) if (l.ecuacion) igualdades(plano(l.ecuacion), `${i.id} ejemplo ${k + 1}`);
    for (const v of Teoria.grilla(i.juega.controles)) igualdades(plano(i.juega.lectura(v)).replace(/:.*$/, ''), `${i.id} lectura ${JSON.stringify(v)}`);
    for (let s = 0; s < 200; s++) {
      const a = i.ahoraTu.generar(s);
      if (a.solucion.ecuacion) igualdades(plano(a.solucion.ecuacion), `${i.id} ahora tú ${s}`);
      for (const p of i.resuelve.generar(s).pasos) if (p.ecuacion) igualdades(plano(p.ecuacion), `${i.id} resuelve ${s}`);
    }
  }
  assert.ok(comprobadas > 1500, `igualdades comprobadas: ${comprobadas}`);
});

// ---------- Ejemplos ----------
test('ejemplos: 15 por idea; en el nivel 3, cinco alternativas distintas y la letra es la de la que da el valor', () => {
  for (const i of def.ideas) {
    assert.equal(i.ejemplos.length, 15, i.id);
    const n3 = i.ejemplos.filter(e => e.nivel === 3 && e.alternativas);
    assert.equal(n3.length, 5, i.id);
    const letras = [];
    for (const e of n3) {
      assert.equal(new Set(e.alternativas).size, 5, `${i.id} ${e.titulo}`);
      const resp = plano(e.respuesta), L = resp.match(/^([A-E])/)[1];
      letras.push(L);
      const alt = e.alternativas['ABCDE'.indexOf(L)];
      const despues = resp.slice(1).replace(/^,\s*/, '').toLowerCase(), altL = alt.toLowerCase();
      assert.ok(despues.includes(altL) || despues.replace(/^.*= /, '') === altL || despues.includes(altL.replace(/^\((.*)\)$/, '$1')),
        `${i.id} «${e.titulo}»: la respuesta «${resp}» no dice el valor de ${L}, «${alt}»`);
    }
    assert.deepEqual([...letras].sort(), ['A', 'B', 'C', 'D', 'E'], `${i.id}: letras ${letras.join('')}`);
  }
});

test('no se adelanta Factorización: ni «factor» ni «raíz» en el texto del alumno', () => {
  const t = Glosario.texto(def);
  assert.ok(!/\bfactor\b|\bfactoriz|\braíz\b|\braíces\b/i.test(t), (t.match(/.{30}(factor|raíz).{30}/i) || [''])[0]);
});

// ---------- Correcciones del 19 nov (rutinas/auditoria/algebra.division-de-polinomios.md y rutinas/frio/) ----------
// Cada prueba falla con la versión anterior (copias en el scratchpad de la sesión, e6-cierre-div/antes/).
const glo = t => def.glosario.find(g => g.termino === t);
test('A1: lo que el glosario dice de una división («no lo es», «deja N») es cierto', () => {
  let n = 0;
  for (const g of def.glosario) for (const ej of g.ejemplos) {
    const m = ej.match(/^(?:En \()?([^()]*?x[^()]*?)\)? (?:entre|÷) \(?(x[^():]*?)\)?(?:,| no| deja| da|:|$)/);
    if (!m) continue;
    const D = leerPoli(m[1]), d = leerPoli(m[2]);
    if (!D || !d) continue;
    const r = divide(D, d).r, cero = r.every(c => c[0] === 0);
    if (/no lo es/.test(ej)) { assert.ok(!cero, `glosario «${g.termino}»: «${ej}» es exacta`); n++; }
    const dj = ej.match(/deja (−?\d+)\.$/) || ej.match(/sobra (−?\d+)\.$/);
    if (dj) { assert.equal(poliTxt(r.slice(r.findIndex(c => c[0] !== 0))), dj[1], `glosario «${g.termino}»: ${ej}`); n++; }
  }
  assert.ok(n >= 3, `afirmaciones revisadas: ${n}`);
});
test('M3: el glosario de las ideas 4, 5 y 6 no dice lo que se predice ni la misión', () => {
  assert.ok(!/dividir|entre c\b/.test(glo('cociente falso').def), 'cociente falso: no dice que se divide entre c');
  const tr = glo('teorema del resto'), t = [tr.def, tr.simple, ...tr.ejemplos].join(' | ');
  assert.ok(!/D\(a\)|evalu|se evalúa en/.test(t), `teorema del resto: ${t}`);
  const notable = [...glo('término de lugar k').ejemplos, ...idea('cocientes-notables').lee.tarjetas.map(x => plano(x.texto))].join(' | ');
  assert.ok(!/\+ 2x² \+ 4x \+ 8|x² \+ 2x \+ 4|124/.test(notable), 'nada de las potencias de 2 (la misión es 1248)');
  assert.ok(!/124/.test(JSON.stringify(idea('cocientes-notables').lee.tarjetas.map(x => x.dibujo || null))), 'la calculadora de Lee no muestra 124');
});
test('M1: idea 4, «Ahora tú»: cada distractor de cociente vale lo que da su error', () => {
  const i = idea('divisor-k');
  for (let s = 3; s < SEMILLAS; s += 4) {
    const a = i.ahoraTu.generar(s), m = plano(a.pregunta).match(/dividir (.+?) entre (.+?)\?/);
    const D = leerPoli(m[1]), d = leerPoli(m[2]), q = divide(D, d).q, c = d[0];
    for (const o of a.opciones) {
      if (o.error === 'PO2') assert.fail(`${s}: con x = b/c el cociente no sale con enteros; ese distractor no es lo que da el error`);
      if (o.error === 'TAL-K-MULT') assert.equal(plano(o.texto), poliTxt(q.map(v => fmul(v, fr(c * c)))), `${s}`);
    }
  }
});
test('M2 y M16: ningún ejemplo de nivel 2 o 3 repite la división de otro ejemplo de su idea (salvo «Comprobar»)', () => {
  for (const i of def.ideas) {
    const vistas = new Map();
    for (const e of i.ejemplos) {
      const m = plano(e.enunciado).match(/(?:dividir|Divide|dividir) (\S[^,?]*?x[^,?]*?) entre ([^,?.]+?)(?:,|\?|\.| con| se| salió| la tabla| sin)/);
      if (!m || /^Comprobar/.test(e.titulo)) continue;
      const k = `${m[1]} | ${m[2]}`;
      assert.ok(!vistas.has(k), `${i.id}: «${e.titulo}» repite la división de «${vistas.get(k)}» (${k})`);
      vistas.set(k, e.titulo);
    }
  }
  const e = idea('horner').ejemplos.find(x => x.titulo === 'El coeficiente de x del resto');
  const C = plano(e.solucion.map(l => l.texto)).match(/C[^;.]*/)[0];
  assert.ok(C.includes('21'), `la C vale 21 y su explicación dice: «${C}»`);
});
test('M4: los Datos que usan «a» dicen qué es; en la idea 4 el número es −b/c', () => {
  const lineas = i => [...i.ejemplos.flatMap(e => e.datos || []), ...Array.from({ length: 40 }, (_, s) => [...i.ahoraTu.generar(s).datos, ...i.resuelve.generar(s).datos]).flat()].map(plano);
  for (const l of lineas(idea('divisor-k'))) assert.ok(!/más a por/.test(l), `divisor-k: «${l}»`);
  for (const l of lineas(idea('ruffini'))) if (/más a por/.test(l)) assert.ok(/anula/.test(l), `ruffini: «${l}»`);
});
test('M5: la regla y Mira de Horner dicen por qué cambia el signo y que se divide entre el primero de d', () => {
  const i = idea('horner'), r = plano([i.regla.condicion, i.regla.voz]);
  assert.ok(/signo/.test(r) && /entre el primero de d/.test(r), r);
  assert.ok(i.mira.pasos.some(p => /signo/.test(p.texto) && /entre 2/.test(p.texto)), 'Mira explica la tabla de Horner');
  const e = i.ejemplos.find(x => x.titulo === 'La misma cuenta en Horner');
  assert.ok(e.solucion.filter(l => /productos/.test(plano(l.texto))).length >= 3, 'el resuelto dice adónde va cada producto');
});
test('M6: los coeficientes de D, también el 0 de una potencia que falta, van en tinta', () => {
  for (const i of def.ideas) for (const fg of figuras(i)) {
    const d = fg.datos || {};
    for (const c of [...(d.coefs || []), ...((d.filas || [])[0] && d.filas[0].rotulo === 'D' ? d.filas[0].celdas : [])]) assert.ok(!(c && typeof c === 'object' && c.c === 'f'), `${i.id}: un coeficiente de D en violeta`);
  }
  for (const i of def.ideas) for (const x of fichas([i.mira.pasos.map(p => p.ecuacion), i.ejemplos.map(e => [e.solucion, e.respuesta])])) assert.ok(!(x.t === '0' && x.v === 'c-f' && x.m === 'lo que se olvida'), i.id);
});
test('M7 y M8: las reglas no separan igualdades con «·» y el resto no se escribe r(a)', () => {
  for (const i of def.ideas) assert.ok(!/ {3}· {3}/.test(plano(i.regla.ecuacion)), `${i.id}: «·» entre dos igualdades`);
  assert.ok(!/r\(a\)/.test(plano(idea('teorema-resto').regla.ecuacion)));
  assert.ok(!/abajo/.test(plano([idea('cocientes-notables').regla.texto, idea('cocientes-notables').regla.condicion])));
});
test('M15: en el juego 1, lo que sobra va en naranja (el resto) solo cuando ya no alcanza para otro tramo', () => {
  const j = idea('algoritmo').juega;
  for (const k of [0, 1, 2]) assert.ok(!fichas(j.lectura({ k })).some(x => x.v === 'c-o'), `k = ${k}`);
  assert.ok(fichas(j.lectura({ k: 3 })).some(x => x.v === 'c-o'));
});
test('M9 a M13: datos y figuras de la idea 4 y de la caja', () => {
  const k = idea('divisor-k');
  assert.deepEqual(k.lee.tarjetas[0].dibujo.datos.ancho, [1, 1], 'Lee 1 dibuja el pasadizo de (x + 1) dm que nombra');
  assert.ok(plano(k.ejemplos.find(e => e.titulo === 'El pasadizo de ancho 3x + 3').datos).includes('cociente falso'));
  assert.ok(!plano(k.ejemplos.find(e => e.titulo === 'El resto no se divide').datos).includes('Resto: la última casilla'), 'los datos no dicen la respuesta');
  assert.ok(!/comprimido/.test(k.mira.voz));
  for (let s = 0; s < 20; s++) assert.ok(/pierde dos cuadrados/.test(plano(idea('teorema-resto').resuelve.generar(s).datos)));
});
test('notación: «1m» ni «+ 0» en la ecuación de divisibilidad (400 semillas)', () => {
  const i = idea('teorema-resto');
  for (let s = 3; s < SEMILLAS; s += 5) { const e = plano(i.ahoraTu.generar(s).solucion.ecuacion); assert.ok(!/(^|[^\d])1m|\+ 0 =/.test(e), `${s}: ${e}`); }
  assert.ok(/\(5 \+ 3\)/.test(plano(i.juega.lectura({ x: 5 }))), 'el largo del juego 5 con su cuenta');
});
