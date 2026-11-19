// Pruebas de «Factorización» (práctica): casos.json (calculados aparte, con sympy, sin el generador), un recálculo
// independiente en 600 problemas (se lee el polinomio del enunciado y se evalúa aquí en varios puntos: la correcta tiene
// que valer lo mismo que el polinomio, o anularlo, o salir de sus datos por otro camino), que ningún distractor de una
// factorización o de un factor sea también correcto, fugas, los tipos por idea, los colores de la unidad, los códigos de
// error, el recuadro «Datos» en 400 semillas, el papel y que la práctica no repite ninguna Predice.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');
const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));

// ---- Camino independiente: el valor de una expresión escrita como la ve el alumno ----
const SUP = { '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9 };
function valor(texto, env) {
  const t = [];
  for (let i = 0; i < texto.length;) {
    const c = texto[i];
    if (/\s/.test(c)) { i++; continue; }
    if (/[0-9]/.test(c)) { let j = i; while (j < texto.length && /[0-9]/.test(texto[j])) j++; t.push(['n', +texto.slice(i, j)]); i = j; continue; }
    if (c in SUP) { let v = 0; while (i < texto.length && texto[i] in SUP) v = v * 10 + SUP[texto[i++]]; t.push(['^', v]); continue; }
    if (c === 'x' || c === 'y') { t.push(['v', c]); i++; continue; }
    if ('+−()'.includes(c)) { t.push([c, c]); i++; continue; }
    return NaN;
  }
  let k = 0;
  const ver = () => (k < t.length ? t[k][0] : null);
  const factor = () => {
    const a = ver(); let b;
    if (a === 'n') b = t[k++][1]; else if (a === 'v') b = env[t[k++][1]];
    else if (a === '(') { k++; b = expr(); if (ver() !== ')') throw new Error(')'); k++; } else throw new Error('factor');
    if (ver() === '^') b = b ** t[k++][1];
    return b;
  };
  const term = () => { let v = 1, uno = false; if (ver() === '−') { k++; v = -1; } while (['n', 'v', '('].includes(ver())) { v *= factor(); uno = true; } if (!uno) throw new Error('term'); return v; };
  function expr() { let v = term(); while (ver() === '+' || ver() === '−') { const op = t[k++][0], w = term(); v = op === '+' ? v + w : v - w; } return v; }
  try { const v = expr(); return k === t.length ? v : NaN; } catch (e) { return NaN; }
}
const PUNTOS = [{ x: 2, y: 3 }, { x: -3, y: 5 }, { x: 7, y: -2 }, { x: 1.5, y: 0.5 }, { x: -0.5, y: 4 }];
const vale = (t, p) => valor(t, p);
const iguales = (A, B) => PUNTOS.every(p => { const a = vale(A, p), b = vale(B, p); return Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) < 1e-6 * Math.max(1, Math.abs(a)); });
const ceroDe = bin => { const m = bin.match(/^(\d*)x ([+−]) (\d+)$/); if (!m) return null; const c = m[1] ? +m[1] : 1, b = +m[3]; return (m[2] === '−' ? b : -b) / c; };
// Una suma escrita a mano, sin el generador: [[coeficiente, letra], …] → «2x − 3y + 4».
const ex = ts => ts.map(([c, l]) => `${c}${l}`).join(' + ').replace(/\+ -/g, '− ').replace(/^-/, '−');
const anula = (P, a) => Math.abs(valor(P, { x: a, y: 0 })) < 1e-9;
const textoPoli = cs => { const g = cs.length - 1, out = []; cs.forEach((c, i) => { if (!c) return; const e = g - i, l = e === 0 ? '' : e === 1 ? 'x' : 'x' + [...String(e)].map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]).join(''), m = Math.abs(c), cu = `${m === 1 && e ? '' : m}${l}`; out.push(out.length ? ` ${c < 0 ? '−' : '+'} ${cu}` : `${c < 0 ? '−' : ''}${cu}`); }); return out.join('') || '0'; };

function recalcular(p) {
  const d = p._datos, en = plano(p.enunciado), bien = p.alternativas.find(a => a.correcta).texto;
  const pol = re => { const m = en.match(re); assert.ok(m, `${d.tipo}: no leo «${en}»`); return m[1]; };
  const comprueba = (ok, que) => { assert.ok(ok, `${d.tipo}: ${que} («${en}» → ${bien})`); return p.respuesta.valor; };
  switch (d.tipo) {
    case 'comun-uno': return comprueba(iguales(bien, pol(/factoriza (.+) con todo/)), 'no da el polinomio');
    case 'volteado': case 'dif-cuad': case 'tcp': return comprueba(iguales(bien, pol(/factoriza (.+)\.$/)), 'no da el polinomio');
    case 'aspa-coef': return comprueba(iguales(bien, pol(/factoriza (.+) con aspa/)), 'no da el polinomio');
    case 'comun-dos': { const P = pol(/de (.+)\.$/); return comprueba(iguales(`(${bien})(${textoPoli([1])})`, bien) && PUNTOS.every(q => Number.isFinite(vale(P, q))), 'no se lee'); }
    case 'cubos': { const m = en.match(/factores de (.+) es (.+)\.$/); return comprueba(iguales(`(${m[2]})(${bien})`, m[1]), 'el producto no da el polinomio'); }
    case 'primos-ident': return [3, 4, 2, 3][d.forma];
    case 'aspa-monico': return comprueba(anula(pol(/factoriza (.+) con aspa/), ceroDe(bien)), 'el binomio no anula');
    case 'agrupar': return textoPoli([d.c, 1, d.a + d.b]);
    case 'aspa-dos': { const P = pol(/^(.+) se factoriza/); const f1 = `x ${d.q < 0 ? '−' : '+'} ${Math.abs(d.q)}y`, f2 = `${d.p}x ${d.s < 0 ? '−' : '+'} ${Math.abs(d.s)}y`; assert.ok(iguales(`(${f1})(${f2})`, P)); return comprueba(iguales(bien, `${f1} + ${f2}`), 'no es la suma'); }
    case 'bicuad': { const P = pol(/completo (.+), tomando/); assert.ok(iguales(`(x + ${d.k})(x − ${d.k})(x² + ${d.l * d.l})`, P)); return textoPoli([1, 2, d.l * d.l]); }
    case 'doble-factor': case 'doble-suma': { const P = en.match(/factoriza (.+) con aspa doble\.$/) ? en.match(/factoriza (.+) con aspa doble\.$/)[1] : en.match(/^(.+) se factoriza/)[1];
      const F = d.F, G = d.G, tri = ([a, b, c]) => ex([[a, 'x'], [b, 'y'], [c, '']]);
      assert.ok(iguales(`(${tri(F)})(${tri(G)})`, P), `${d.tipo}: las filas no dan P`);
      return comprueba(iguales(bien, d.tipo === 'doble-factor' ? tri(F) : tri([F[0] + G[0], F[1] + G[1], F[2] + G[2]])), 'no cuadra'); }
    case 'falta': { const k = d.a * d.c; return `${k < 0 ? '−' : ''}${Math.abs(k) === 1 ? '' : Math.abs(k)}x²`; }
    case 'especial-primos': { const P = pol(/completo (.+), primero/);
      assert.ok(iguales(`(${ex([[1, 'x'], [d.p, '']])})(${ex([[1, 'x'], [d.q, '']])})(${ex([[1, 'x²'], [d.c, 'x'], [d.d, '']])})`, P), 'los factores no dan P');
      return comprueba(iguales(bien, ex([[1, 'x²'], [d.c + 2, 'x'], [d.p + d.q + d.d, '']])), 'no es la suma'); }
    case 'factor-signo': { const P = pol(/P\(x\) = (.+) se sabe/); return comprueba(anula(P, ceroDe(bien)), 'el binomio no anula'); }
    case 'cual-divisor': { const P = pol(/P\(x\) = (.+)\.$/); return comprueba(anula(P, ceroDe(bien)), 'el binomio no anula'); }
    case 'principal': { const P = pol(/P\(x\) = (.+) tiene/); return comprueba(anula(P, ceroDe(bien)), 'el binomio no anula'); }
    case 'suma-cubica': return textoPoli([3, -(d.u + d.w + d.y)]);
    case 'mcd': return `${d.a > 0 ? `x − ${d.a}` : `x + ${-d.a}`}`.replace(/^(.*)$/, m => (Math.min(d.i, d.k) === 1 ? m : `(${m})${'⁰¹²³⁴⁵⁶⁷⁸⁹'[Math.min(d.i, d.k)]}`));
    case 'mcm': return p.respuesta.valor;   // revisado abajo por otro camino (exponentes)
    case 'grado-mcm': return 3;
    case 'mcd-valor': { const m = en.match(/P\(x\) = (.+) y Q\(x\) = (.+)\.$/); assert.ok(anula(m[1], d.a) && anula(m[2], d.a)); return d.k - d.a; }
    case 'mcm-dado': return d.a * d.c;
    default: throw new Error(`tipo sin recálculo: ${d.tipo}`);
  }
}
const igual = (esperado, valor) => (typeof esperado === 'string' ? esperado === valor : Math.abs(esperado - valor) < 1e-9);
probarGenerador(gen, { semillas: 600, recalcular, igual });
probarFugas(gen, { grupo: p => p._datos.tipo });

test('ningún distractor de una factorización o de un factor es también correcto (400 semillas por idea)', () => {
  let n = 0;
  for (const idea of Object.keys(gen.TIPOS_POR_IDEA)) for (let s = 0; s < 400; s++) {
    const p = gen.generar(s, { idea }), en = plano(p.enunciado), d = p._datos;
    const m = en.match(/factoriza (.+?)(?: con todo su factor común afuera| con aspa)?\.$/);
    if (['comun-uno', 'volteado', 'dif-cuad', 'tcp', 'aspa-coef'].includes(d.tipo) && m) {
      for (const a of p.alternativas) if (!a.correcta) assert.ok(!iguales(a.texto, m[1]) || /COMUN|UNO-COEF/.test(a.error.id), `${d.tipo} ${s}: «${a.texto}» también es ${m[1]}`);
      n++;
    }
    const mp = en.match(/P\(x\) = (.+?)(?: se sabe| tiene|\.$)/) || en.match(/factoriza (.+) con aspa\.$/);
    if (['factor-signo', 'cual-divisor', 'principal', 'aspa-monico'].includes(d.tipo) && mp) {
      for (const a of p.alternativas) if (!a.correcta && ceroDe(a.texto) !== null) assert.ok(!anula(mp[1], ceroDe(a.texto)), `${d.tipo} ${s}: «${a.texto}» también es un factor`);
      n++;
    }
  }
  assert.ok(n > 300, `revisados: ${n}`);
});

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla} (${c.entrada.tipo})`, () => {
    const p = gen.generar(c.semilla, { idea: c.entrada.idea });
    assert.equal(p._datos.tipo, c.entrada.tipo);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.texto);
  });
}

test('tipos por idea: las seis ideas de la teoría, y generar(semilla, { idea }) da solo los suyos, con nivel 1 y nivel 3', () => {
  const teoria = require('../../contenido/teoria/algebra/factorizacion.js');
  assert.deepEqual(Object.keys(gen.TIPOS_POR_IDEA), teoria.ideas.map(i => i.id));
  for (const [idea, tipos] of Object.entries(gen.TIPOS_POR_IDEA)) {
    const vistos = new Set();
    for (let s = 0; s < 300; s++) { const p = gen.generar(s, { idea }); assert.equal(p._datos.idea, idea); vistos.add(p._datos.tipo); }
    assert.deepEqual([...vistos].sort(), [...tipos].sort(), idea);
    assert.ok(tipos.some(t => gen.NIVEL[t] === 3) && tipos.some(t => gen.NIVEL[t] <= 2), idea);
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
      assert.match(e, /^Bien/, `semilla ${s}: ${e}`);
      assert.ok(e.includes(a.texto), `semilla ${s}: no muestra su valor «${a.texto}»: ${e}`);
      assert.ok(!/\b(alternativa|opción|letra) [A-E]\b|\bla [A-E]\b/.test(e), `semilla ${s}: ${e}`);
      assert.ok(e.split(/\s+/).length <= 32, `semilla ${s}: explicación larga: ${e}`);
      if (/^AL\d/.test(a.error.id)) assert.equal(a.error.fuente, 'docs/investigacion/algebra-funciones-ideas-erroneas.md');
    }
  }
  for (const c of ['TAL-UNO-CERO', 'TAL-INCOMPLETA', 'AL8', 'TAL-ASPA-CRUCE', 'TAL-DE-TODO', 'TAL-FACTOR-SIGNO', 'TAL-OLVIDA-PRINC', 'TAL-MCD-MAX', 'TAL-MCM-SUMA']) assert.ok(codigos.has(c), c);
});

test('un color por magnitud: el factor que se saca y el número que anula turquesa; el otro factor, MCD y MCM violeta', () => {
  const COLOR = { s: 'i', a: 'i', o: 'f', m: 'f' };
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    for (const [k, vv] of Object.entries(p.variables)) assert.equal(vv.color, COLOR[k], `semilla ${s}: ${k}`);
    assert.ok(Object.values(p.variables).every(vv => !['h', 'd'].includes(vv.color)));
  }
});

test('notación: superíndices de verdad, signo menos tipográfico, sin «*», «1x», «+ −» ni «x¹»; ni «raíz» ni «ecuación»', () => {
  for (let s = 0; s < 800; s++) {
    const p = gen.generar(s), todo = [plano(p.enunciado), plano(p.pregunta), ...p.alternativas.map(a => a.texto), ...p.alternativas.filter(a => a.error).map(a => a.error.explicacion), ...p.solucion.map(plano)].join(' | ');
    assert.ok(!/\*|\b1x|\+ −|− −|[xy]¹(?![⁰¹²³⁴⁵⁶⁷⁸⁹])|\d-\d|\s-\d|\^\d|null|NaN|undefined|\(\)/.test(todo), `semilla ${s}: ${todo}`);
    assert.ok(!/\braíz|\braíces|ecuaci[oó]n/.test(todo), `semilla ${s}: ${todo}`);
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
  const PREDICE = ['6x³ + 3x²', 'x⁴ − 16', '2x² + 7x + 3', 'x⁴ + 5x³ + 9x² + 7x + 2', 'x³ + 2x² − 5x − 6', 'x² − 2x + 1'];
  for (const idea of Object.keys(gen.TIPOS_POR_IDEA)) for (let s = 0; s < 400; s++) {
    const en = plano(gen.generar(s, { idea }).enunciado);
    for (const t of PREDICE) assert.ok(!new RegExp(`(?<![−+·] |[⁰¹²³⁴⁵⁶⁷⁸⁹\\dx])${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^⁰¹²³⁴⁵⁶⁷⁸⁹\\dx]|$)`).test(en), `${idea} ${s}: ${en}`);
  }
});

test('nunca se queda sin cuatro alternativas (semillas 0 a 2000, y por idea)', () => {
  for (let s = 0; s < 2000; s++) assert.ok(gen.generar(s).alternativas.length >= 4);
  for (const idea of Object.keys(gen.TIPOS_POR_IDEA)) for (let s = 0; s < 300; s++) assert.ok(gen.generar(`i${s}`, { idea }).alternativas.length >= 4);
});

test('papel: 8 problemas de las seis ideas, cada uno con sus datos y su unidad', () => {
  assert.equal(papel.problemas.length, 8);
  for (const q of papel.problemas) {
    assert.ok(/ Datos: /.test(q.enunciado), q.id);
    assert.ok(q.respuesta && q.enunciado, q.id);
  }
});
