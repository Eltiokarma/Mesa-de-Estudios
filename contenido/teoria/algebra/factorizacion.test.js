// Pruebas propias de «Factorización» (además del validador común de contenido/teoria/teoria.test.js). Etapa 7 (19 nov
// 2026; docs/etapa7/propuesta-algebra.md): seis ideas reescritas contra el contrato. La unidad lleva calidad: 2
// desde el cierre (lector en frío y auditor); la primera prueba corre el validador con esa marca.
// Lo que se comprueba aquí:
//   - el orden de las ideas y los ids publicados (los cinco de la ronda 2 se conservan; `identidades` es nueva);
//   - un color fijo por magnitud (cabecera): cada ficha de color dice su magnitud (m) y lleva el color de def.colores;
//     nunca carmín ni verde, tampoco en las figuras; las de alg-reparto y alg-losetas, marcadas como dibujo de prueba y
//     dentro de su lienzo;
//   - cada misión: no está cumplida al abrir y la cumple un solo caso de su grilla;
//   - nada antes de Predice trae la respuesta de su predicción (Lee, consigna, misión, leyenda, lectura al abrir y el
//     glosario de la idea);
//   - «Ahora tú» en 400 semillas por idea: cuatro opciones distintas y una sola correcta; cuando la pregunta pide una
//     factorización, un factor o un MCD/MCM, se rehace aquí con un evaluador propio: la correcta vale lo mismo que el
//     polinomio en varios puntos y ningún distractor lo vale;
//   - toda igualdad escrita en ecuaciones (Lee, Mira, regla, ejemplos, «Así se resuelve», soluciones, lecturas) es cierta:
//     un analizador propio la evalúa en varios valores de x e y;
//   - los ejemplos de nivel 3: cinco alternativas distintas, la letra de la respuesta es la de la alternativa que da el
//     valor, y las letras se reparten (una vez cada una por idea);
//   - no se adelanta Ecuaciones polinomiales: ni «raíz» ni «ecuación» en el texto del alumno.
// Las cuentas de los 90 ejemplos se rehicieron además con sympy, sin el código de la unidad
// (scratchpad de la sesión, e7-algebra/scripts/cuentas-ejemplos.py).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../../../nucleo/kit/kit.js');
const Teoria = require('../../../nucleo/teoria.js');
const Glosario = require('../../../nucleo/glosario.js');
const E = require('../../../nucleo/ecuacion.js');
const def = require('./factorizacion.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const idea = id => def.ideas.find(i => i.id === id);
const limpia = x => (Array.isArray(x) ? x.filter(y => y !== undefined && y !== null).map(limpia) : x);
const plano = x => E.texto(x === undefined || x === null ? '' : limpia(x)).replace(/⁠/g, '');
const fichas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(fichas)
  : typeof x.v === 'string' && /^c-/.test(x.v) ? [x] : Object.values(x).flatMap(fichas));
const SEMILLAS = 400;
const IDS = ['factor-comun', 'identidades', 'aspa-simple', 'aspa-doble', 'teorema-factor', 'mcd-mcm'];

// ---------- Cálculo aparte: el valor de una expresión escrita como la ve el alumno ----------
const SUP = { '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9 };
function valor(texto, env) {
  texto = texto.replace(/(\d)[  ](?=\d{3}(?!\d))/g, '$1');   // los miles van con espacio: 40 000
  const t = [];
  for (let i = 0; i < texto.length;) {
    const c = texto[i];
    if (/\s/.test(c)) { i++; continue; }
    if (/[0-9]/.test(c)) { let j = i; while (j < texto.length && /[0-9]/.test(texto[j])) j++; t.push(['n', +texto.slice(i, j)]); i = j; continue; }
    if (c in SUP) { let v = 0; while (i < texto.length && texto[i] in SUP) v = v * 10 + SUP[texto[i++]]; t.push(['^', v]); continue; }
    if ('xyab'.includes(c) && env[c] !== undefined) { t.push(['v', c]); i++; continue; }
    if ('+−·÷/()[]'.includes(c)) { t.push([c, c]); i++; continue; }
    return NaN;
  }
  let k = 0;
  const ver = () => (k < t.length ? t[k][0] : null);
  const factor = () => {
    const a = ver();
    if (a === '−') { k++; return -junto(); }
    let b;
    if (a === 'n') b = t[k++][1];
    else if (a === 'v') b = env[t[k++][1]];
    else if (a === '(' || a === '[') { k++; b = expr(); if (ver() !== ')' && ver() !== ']') throw new Error('paréntesis'); k++; }
    else throw new Error('factor');
    if (ver() === '^') b = b ** t[k++][1];
    return b;
  };
  const junto = () => { let v = factor(); for (;;) { const a = ver(); if (a === 'n' || a === 'v' || a === '(' || a === '[') v *= factor(); else return v; } };
  const term = () => {
    let v = junto();
    for (;;) { const a = ver(); if (a === '·') { k++; v *= junto(); } else if (a === '÷' || a === '/') { k++; v /= junto(); } else return v; }
  };
  function expr() { let v = term(); while (ver() === '+' || ver() === '−') { const op = t[k++][0], w = term(); v = op === '+' ? v + w : v - w; } return v; }
  try { const v = expr(); return k === t.length ? v : NaN; } catch (e) { return NaN; }
}
const PUNTOS = [{ x: 2, y: 3 }, { x: -3, y: 5 }, { x: 7, y: -2 }, { x: 1.5, y: 0.5 }];
const vale = (txt, p) => valor(txt, p);
const iguales = (A, B) => PUNTOS.every(p => { const a = vale(A, p), b = vale(B, p); return Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) < 1e-6 * Math.max(1, Math.abs(a)); });
const evaluable = A => PUNTOS.every(p => Number.isFinite(vale(A, p)));
let comprobadas = 0;
function igualdades(txt, donde) {
  const partes = txt.split('→'), ultima = partes[partes.length - 1];
  for (const trozo of ultima.split(/;|,\s{2,}|:\s/)) {
    if (/[<>≤≥≠±∓]/.test(trozo)) continue;
    const lados = trozo.split('=').map(l => l.trim());
    for (let i = 0; i + 1 < lados.length; i++) {
      if (!lados[i] || !lados[i + 1] || !evaluable(lados[i]) || !evaluable(lados[i + 1])) continue;
      comprobadas++;
      assert.ok(iguales(lados[i], lados[i + 1]), `${donde}: «${lados[i]} = ${lados[i + 1]}» no se cumple`);
    }
  }
}

// ---------- La unidad ----------
test('seis ideas en el orden de la propuesta; los ids publicados se conservan; pasa el validador con calidad 2', () => {
  assert.equal(def.calidad, 2, 'cerrada el 19 nov tras el lector en frío y el auditor');
  assert.deepEqual(def.ideas.map(i => i.id), IDS);
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
test('la tabla de colores: el factor que se saca turquesa, el otro violeta, lo que sobra naranja; sin carmín ni verde', () => {
  assert.deepEqual(def.colores, { 'factor que se saca': 'i', 'número que anula': 'i', 'otro factor': 'f', 'lo que sobra': 'o',
    'exponente en P': 'o', 'exponente en Q': 'i', 'MCD y MCM': 'f' });
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
  for (const v of Teoria.grilla(i.juega.controles)) figs.push(Object.assign({ pieza: i.juega.pieza }, i.juega.dibujo(v)));
  figs.push(i.predice.dibujo, i.predice.revelar, i.regla.dibujo);
  for (const p of i.mira.pasos) figs.push({ pieza: i.mira.pieza, datos: i.mira.datos, estado: p.estado });
  for (const e of i.ejemplos) if (e.figura) figs.push(e.figura);
  for (let s = 0; s < 30; s++) { const r = i.resuelve.generar(s); if (r.dibujo) figs.push(Object.assign({ pieza: i.resuelve.pieza }, r.dibujo)); for (const p of r.pasos) if (p.dibujo) figs.push(Object.assign({ pieza: i.resuelve.pieza }, p.dibujo)); const a = i.ahoraTu.generar(s); if (a.dibujo) figs.push(a.dibujo); }
  return figs.filter(Boolean).map(fg => Object.assign({ pieza: i.pieza }, fg));
}
test('las figuras: sin carmín ni verde, dentro del lienzo, y las de objetos marcadas como dibujo de prueba', () => {
  let n = 0;
  for (const i of def.ideas) for (const fg of figuras(i)) {
    const P = Kit.piezas[fg.pieza];
    assert.ok(P, `${i.id}: pieza ${fg.pieza}`);
    const s = P.dibujar(fg.datos, fg.estado || {});
    assert.ok(!/var\(--c-[hd]\)/.test(s), `${i.id}: carmín o verde en ${fg.pieza}`);
    assert.ok(!/NaN|undefined|Infinity/.test(s), `${i.id}: ${fg.pieza} con NaN`);
    if (fg.pieza === 'alg-reparto' || fg.pieza === 'alg-losetas') {
      assert.ok(/data-prueba="si"/.test(s), `${i.id}: ${fg.pieza} sin marca de prueba`);
      assert.ok(P.cabe(fg.datos, fg.estado || {}), `${i.id}: no cabe ${JSON.stringify(fg.datos).slice(0, 140)}`);
    }
    n++;
  }
  assert.ok(n > 300, `figuras: ${n}`);
});

// ---------- Juego ----------
const inicioDe = i => Object.fromEntries(i.juega.controles.map(c => [c.id, c.inicio !== undefined ? c.inicio : c.opciones[0].valor]));
test('cada misión: no está cumplida al abrir y la cumple un solo caso de su grilla', () => {
  for (const i of def.ideas) {
    const j = i.juega;
    assert.ok(!j.mision.logrado(inicioDe(i)), `${i.id}: cumplida al abrir`);
    const cumplen = Teoria.grilla(j.controles).filter(v => j.mision.logrado(v));
    assert.equal(cumplen.length, 1, `${i.id}: ${cumplen.length} casos cumplen la misión`);
  }
});
test('nada antes de Predice trae la respuesta de su predicción', () => {
  const por = Glosario.porIdea(def);
  def.ideas.forEach((i, k) => {
    const bien = plano(i.predice.opciones.find(o => o.correcta).texto);
    const antes = [...i.lee.tarjetas.map(t => [t.titulo, t.texto, t.ecuacion]), i.juega.consigna, i.juega.mision.texto, i.juega.mision.bien, i.juega.leyenda.map(x => [x.s, x.t]),
      i.juega.lectura(inicioDe(i)), ...por[k].map(g => [g.def, g.simple, g.ejemplos])].map(plano).join(' | ');
    assert.ok(!antes.includes(bien), `${i.id}: «${bien}» antes de Predice`);
  });
  // Las que son una idea y no un texto: el 1 que deja un término entero, x² + 4 que ya no se abre, el −3 que da x + 3.
  const texto = id => { const i = idea(id), k = def.ideas.indexOf(i); return [...i.lee.tarjetas.map(t => [t.texto, t.ecuacion]), i.juega.mision.bien, ...por[k].map(g => [g.def, g.simple, g.ejemplos])].map(plano).join(' | '); };
  assert.ok(!/deja (un )?1|queda (un )?1/.test(texto('factor-comun')));
  assert.ok(!/x² \+ 4|no se abre|ya no se abre/.test(texto('identidades')));
  assert.ok(!/x \+ 3/.test(texto('teorema-factor')));
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
test('«Ahora tú»: la factorización correcta vale el polinomio en cuatro puntos y ningún distractor lo vale', () => {
  let n = 0;
  for (const i of def.ideas) for (let s = 0; s < SEMILLAS; s++) {
    const a = i.ahoraTu.generar(s), p = plano(a.pregunta);
    const m = p.match(/factorización (?:completa )?de (.+?)(?: con todo su factor común afuera)?\?$/);
    if (!m) continue;
    for (const o of a.opciones) {
      const t = plano(o.texto);
      if (o.correcta) assert.ok(iguales(t, m[1]), `${i.id} ${s}: «${t}» no es ${m[1]}`);
      else assert.ok(!iguales(t, m[1]) || /COMUN|INCOMPLETA|PRIMO/.test(o.error), `${i.id} ${s}: el distractor «${t}» (${o.error}) también es ${m[1]}`);
    }
    n++;
  }
  assert.ok(n > 400, `factorizaciones rehechas: ${n}`);
});

// ---------- Igualdades ----------
test('toda igualdad de las ecuaciones es cierta (Lee, Mira, regla, ejemplos, «Así se resuelve», soluciones y lecturas)', () => {
  comprobadas = 0;
  for (const i of def.ideas) {
    for (const [k, p] of i.mira.pasos.entries()) igualdades(plano(p.ecuacion), `${i.id} mira ${k + 1}`);
    for (const t of i.lee.tarjetas) if (t.ecuacion) igualdades(plano(t.ecuacion), `${i.id} lee`);
    igualdades(plano(i.regla.ecuacion), `${i.id} regla`);
    for (const [k, e] of i.ejemplos.entries()) for (const l of e.solucion) { if (l.ecuacion) igualdades(plano(l.ecuacion), `${i.id} ejemplo ${k + 1}`); for (const tr of plano(l.texto).split(/ y | e |\. /).filter(t => !/y/.test(t))) igualdades(tr, `${i.id} ejemplo ${k + 1} (texto)`); }
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
      const alt = e.alternativas['ABCDE'.indexOf(L)].toLowerCase(), despues = resp.slice(1).replace(/^,\s*/, '').toLowerCase();
      assert.ok(despues.includes(alt) || despues.replace(/ dm$/, '') === alt, `${i.id} «${e.titulo}»: la respuesta «${resp}» no dice el valor de ${L}, «${alt}»`);
    }
    assert.deepEqual([...letras].sort(), ['A', 'B', 'C', 'D', 'E'], `${i.id}: letras ${letras.join('')}`);
  }
});

test('no se adelanta Ecuaciones polinomiales: ni «raíz» ni «ecuación» en el texto del alumno', () => {
  const t = Glosario.texto(def);
  assert.ok(!/\braíz\b|\braíces\b|\becuaci[oó]n/i.test(t), (t.match(/.{30}(raíz|raíces|ecuaci).{30}/i) || [''])[0]);
});

test('las reglas no separan igualdades con «·»', () => {
  for (const i of def.ideas) assert.ok(!/ {3}· {3}/.test(plano(i.regla.ecuacion)), `${i.id}: «·» entre dos igualdades`);
});

// Regla 8 y 15 de la etapa delegada: «Ahora tú» y «Así se resuelve» no repiten el polinomio de un ejemplo, de la
// predicción ni de la misión de su idea (ni «Así se resuelve» el de «Ahora tú» en las semillas del validador).
const POLI = /(?:\d*[xy][⁰¹²³⁴⁵⁶⁷⁸⁹]*(?:[xy][⁰¹²³⁴⁵⁶⁷⁸⁹]*)?|\d+)(?: [+−] (?:\d*[xy][⁰¹²³⁴⁵⁶⁷⁸⁹]*(?:[xy][⁰¹²³⁴⁵⁶⁷⁸⁹]*)?|\d+))+/g;
const polis = t => (plano(t).match(POLI) || []).filter(p => /[xy]/.test(p) && p.split(/ [+−] /).length >= 2);
test('«Ahora tú» y «Así se resuelve» no repiten el polinomio de un ejemplo, de la predicción ni del juego', () => {
  for (const i of def.ideas) {
    const vistos = new Set([...i.ejemplos.flatMap(e => polis(e.enunciado)), ...polis(i.predice.pregunta), ...polis(i.juega.consigna)]);
    for (let s = 0; s < SEMILLAS; s++) {
      for (const p of polis(i.ahoraTu.generar(s).pregunta)) if (p.split(/ [+−] /).length >= 3 || /x²|x³|x⁴/.test(p)) assert.ok(!vistos.has(p), `${i.id} ahora tú ${s}: «${p}» ya está en un ejemplo o en la predicción`);
      for (const p of polis(i.resuelve.generar(s).enunciado)) if (p.split(/ [+−] /).length >= 3 || /x²|x³|x⁴/.test(p)) assert.ok(!vistos.has(p), `${i.id} resuelve ${s}: «${p}» ya está en un ejemplo o en la predicción`);
    }
  }
});

// ---------- Correcciones del 19 nov (cierre: auditoría rutinas/auditoria/algebra.factorizacion.md y lectores en frío) ----------
// Cada prueba falla con la versión anterior (scratchpad de la sesión, e7-cierre-fz/antes/).
const mcdE = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
// Los factores entre paréntesis de un texto («(2x − 4)²(x + 1)») con los números de sus coeficientes.
const factoresDe = t => (t.match(/\(([^()]+)\)/g) || []).map(f => f.slice(1, -1));
const contenido = f => (f.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, '').match(/\d+|(?<![\d])(?=[xy])/g) || []).map(n => (n === '' ? 1 : +n)).reduce(mcdE, 0);
const textosCaso = c => [plano(c.pregunta || c.enunciado), ...(c.datos || []).map(plano), ...(c.opciones || []).map(o => plano(o.texto) + ' ' + (o.siFuera || '')),
  c.solucion ? plano(c.solucion.texto) + ' ' + plano(c.solucion.ecuacion) : '', ...(c.pasos || []).map(p => plano(p.texto) + ' ' + plano(p.ecuacion)), c.respuesta ? plano(c.respuesta) : ''];

test('A1: las factorizaciones de las identidades son completas (ningún factor con un número común)', () => {
  for (let s = 0; s < SEMILLAS; s++) {
    const c = idea('identidades').ahoraTu.generar(s);
    if (/¿Cuál es la factorización/.test(plano(c.pregunta))) for (const f of factoresDe(plano(c.opciones.find(o => o.correcta).texto))) assert.equal(contenido(f), 1, `ahora tú ${s}: «${f}» tiene un número común`);
    for (const f of factoresDe(plano(idea('identidades').resuelve.generar(s).respuesta))) assert.equal(contenido(f), 1, `resuelve ${s}: «${f}» tiene un número común`);
  }
});

test('A2: a y b de una identidad son lo que va al cuadrado, no los términos', () => {
  for (const i of def.ideas) for (let s = 0; s < 40; s++) for (const t of [...textosCaso(i.ahoraTu.generar(s)), ...textosCaso(i.resuelve.generar(s))])
    assert.ok(!/con a y b los dos términos/.test(t), `${i.id} ${s}: «${t}»`);
  assert.ok(!/con a y b los dos términos/.test(def.ideas.flatMap(i => i.ejemplos.flatMap(e => (e.datos || []).map(plano))).join(' ')));
});

test('M1: todo ejercicio que cuenta o suma factores primos dice la convención entera en sus datos (enteros, distintos, sin la constante)', () => {
  const dice = ds => { const t = ds.map(plano).join(' '); return /enteros/.test(t) && /distintos/.test(t) && /no cuenta/.test(t); };
  for (const i of def.ideas) {
    for (let s = 0; s < SEMILLAS; s++) { const c = i.ahoraTu.generar(s); if (/factores primos/.test(plano(c.pregunta))) assert.ok(dice(c.datos), `${i.id} ahora tú ${s}`); }
    for (const e of i.ejemplos) if (/cuántos factores primos|suman los factores primos/i.test(plano(e.enunciado))) assert.ok(dice(e.datos || []), `${i.id} «${e.titulo}»`);
  }
});

test('M2: ningún texto sale con un menos de teclado ni con dos signos seguidos («x + -1», «x · -5y», «− −6x²»)', () => {
  for (const i of def.ideas) for (let s = 0; s < SEMILLAS; s++) for (const t of [...textosCaso(i.ahoraTu.generar(s)), ...textosCaso(i.resuelve.generar(s))])
    assert.ok(!/[+−·] -|(?<![\w)])-\d|− −|\+ −|− \+/.test(t), `${i.id} ${s}: «${t}»`);
});

test('M3: en los cubos, el cuadrado de 2x o 3x se escribe (2x)² = 4x², no «2x²»', () => {
  for (let s = 0; s < SEMILLAS; s++) {
    const c = idea('identidades').ahoraTu.generar(s);
    for (const o of c.opciones) { const m = /los cuadrados (\S+)/.exec(o.siFuera || ''); if (m) assert.ok(m[1] === 'x²' || /^\(\dx\)²$/.test(m[1]), `${s}: «${o.siFuera}»`); }
  }
});

test('M7: las alternativas de «Ahora tú» van en tinta, sin fichas de color (se leían como términos del glosario)', () => {
  for (const i of def.ideas) for (let s = 0; s < 80; s++) for (const o of i.ahoraTu.generar(s).opciones) assert.equal(fichas(o.texto).length, 0, `${i.id} ${s}`);
});

test('M9: el dibujo de «Así se resuelve» del teorema del factor no muestra el número que anula a P antes de los pasos', () => {
  for (let s = 0; s < 40; s++) {
    const r = idea('teorema-factor').resuelve.generar(s), d = r.dibujo.datos;
    assert.equal(d.a.t, '?', `${s}: a = ${d.a.t}`);
    assert.ok(d.abajo.every(x => x === ''), `${s}: la fila de abajo ya está llena`);
    assert.ok(r.pasos.some(p => p.dibujo), `${s}: ningún paso trae la tabla llena`);
  }
});

test('Lectores: el juego 2 no llama «pedido» a lo que hay con las tiras compradas; el juego 1 con ancho x no parece cumplido', () => {
  const j2 = idea('identidades').juega;
  for (const c of j2.controles) assert.ok(c);
  assert.ok(!/pedido: x² \+ \d+x \+ 9/.test(plano(j2.lectura({ s: 2, t: 4 }))), plano(j2.lectura({ s: 2, t: 4 })));
  assert.match(plano(idea('factor-comun').juega.lectura({ c: 1 })), /uno más ancho/);
});

test('Notación: la letra a no tiene un tercer sentido en el glosario (a + 1 como variable)', () => {
  assert.ok(!def.glosario.some(g => (g.ejemplos || []).some(e => /\ba \+ 1\b/.test(e))));
});

test('Datos que no regalan: «Qué números probar» no trae la regla de los candidatos; la Predice de la doble especial no trae el cruce', () => {
  const q = idea('teorema-factor').ejemplos.find(e => e.titulo === 'Qué números probar');
  assert.ok(!(q.datos || []).map(plano).some(d => /divisores del término independiente/.test(d)));
  assert.ok(!idea('aspa-doble').predice.datos.some(d => /x² · 2 = 2x²|1 · x² = x²/.test(d)));
});
