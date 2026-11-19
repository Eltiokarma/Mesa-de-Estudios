// Pruebas de «Polinomios» (práctica): casos.json (calculados aparte, con un script que no usa el generador), un
// recálculo independiente en 600 problemas (se evalúa con números la expresión que ve el alumno y se compara con la
// alternativa correcta leída como texto; o se busca por fuerza bruta lo que se pide), fugas, los tipos por idea, los
// colores de la unidad, los códigos de error, el recuadro «Datos» en 400 semillas, el papel, el catálogo y que la
// práctica no repite ninguna Predice de la teoría.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');
const UNIDAD = 'algebra.polinomios';
const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));

// ---- Camino independiente: un texto con x e y se lee como expresión y se evalúa ----
const SUP = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };
function evaluar(texto, x, y = 0) {
  let t = String(texto).replace(/ (m|dm²)$/, '').replace(/−/g, '-').replace(/·/g, '*').replace(/\s+/g, '');
  t = t.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, m => `**${[...m].map(c => SUP[c]).join('')}`);
  t = t.replace(/([\dxy)])(?=[(xy])/g, '$1*').replace(/(^|\()-/g, '$10-');
  if (!/^[\d+\-*().xy]+$/.test(t)) throw new Error(`no se puede leer: ${texto} → ${t}`);
  // eslint-disable-next-line no-new-func
  return Function('x', 'y', `return ${t};`)(x, y);
}
const PUNTOS = [[2, 3], [-3, 5], [7, -2], [0.5, 4]];
const mismo = (a, b) => PUNTOS.every(([x, y]) => Math.abs(evaluar(a, x, y) - evaluar(b, x, y)) < 1e-9);
// Lo que vale el enunciado, por otro camino.
function recalcular(p) {
  const d = p._datos, en = plano(p.enunciado);
  const exprDe = re => { const m = en.match(re); assert.ok(m, `${d.tipo}: no leo «${en}»`); return m; };
  switch (d.tipo) {
    case 'reducir': case 'dos-letras': return { expr: exprDe(/^Se tiene el polinomio (.+)\.$/)[1] };
    case 'sumar': { const m = exprDe(/^Se suman (.+) y (.+)\.$/); return { expr: `(${m[1]}) + (${m[2]})` }; }
    case 'restar': { const m = exprDe(/^Al polinomio (.+) se le resta (.+)\.$/); return { expr: `(${m[1]}) - (${m[2]})` }; }
    case 'perimetro': { const m = exprDe(/mide \((.+)\) m de largo y \((.+)\) m de ancho/); return { expr: `2(${m[1]}) + 2(${m[2]})` }; }
    case 'exponentes': { for (let m = 0; m < 20; m++) for (let n = 0; n < 20; n++) if (m + d.p === d.ex && n - d.s === d.ey) return m + n; break; }
    case 'losetas': { let t = 0; const [l, ti, c] = d.cs; for (let i = 0; i < l; i++) t += d.k * d.k; for (let i = 0; i < ti; i++) t += d.k; return t + c; }
    case 'evaluar': return evaluar(en.match(/P\(x\) = (.+)\.$/)[1], d.k);
    case 'uno-cero': { const e = en.match(/P\(x\) = (.+)\.$/)[1]; return d.mas ? evaluar(e, 1) + evaluar(e, 0) : evaluar(e, 1) - evaluar(e, 0); }
    case 'factorizada': { const e = en.match(/P\(x\) = (.+)\.$/)[1]; return evaluar(e, d.u) + evaluar(e, d.w); }
    case 'coeficiente': {
      const e = en.match(/P\(x\) = (.+) cumple/)[1], V = Number(en.match(/\) = (−?\d+)\.$/)[1].replace('−', '-'));
      for (let k = -30; k <= 30; k++) { const ek = e.replace('kx²', `(${k})x²`); if (Math.abs(evaluar(ek, d.t) - V) < 1e-9) return evaluar(ek, d.u); }
      break;
    }
    case 'desplazado': { const Qx = x => d.A * x * x + d.B * x + d.C; const P = k => Qx(k - d.h); return d.pide === 'p1' ? P(1) : d.pide === 'p0' ? P(0) : P(0) + P(1); }
    case 'ga': return Math.max(...d.ts.map(t => t[1] + t[2]));
    case 'gr': return Math.max(...d.ts.map(t => (d.L === 'x' ? t[1] : t[2])));
    case 'es-polinomio': { let c = 0; for (let n = -30; n <= 40; n++) if (n - d.p >= 0 && d.q - n >= 0) c++; return c; }
    case 'parametro': { for (let n = 0; n < 40; n++) if (Math.max(...d.ps.map((p, i) => n + p + d.qs[i])) === d.G) return n; break; }
    case 'relativos': { for (let m = 0; m < 20; m++) for (let n = 0; n < 20; n++) if (Math.max(m + d.p, m) === d.A && Math.max(n, n + d.q) === d.B) return Math.max(m + d.p + n, m + n + d.q); break; }
    case 'total': return [...Array(d.n + 1).keys()].length;
    case 'ceros': return [...Array(d.n + 1).keys()].filter(e => !d.exps.includes(e)).length;
    case 'homogeneo': { const ts = en.match(/2x\^\(m\)y([⁰¹²³⁴⁵⁶⁷⁸⁹]*)(.+)\.$/); const b1 = ts[1] ? Number([...ts[1]].map(c => SUP[c]).join('')) : 1; return d.g - b1; }
    case 'parametros': { for (let a = -10; a < 10; a++) for (let c = -10; c < 10; c++) if (a + d.p === 3 && c - d.s === 1) return a * c; break; }
    case 'mn': { const m = d.A + d.p, n = d.B - d.q; return d.mas ? m + n : m * n; }
    case 'nulo': { for (let a = -10; a <= 10; a++) if (a - d.p === 0) for (let b = -10; b <= 10; b++) if (b - d.q === 0) for (let c = -10; c <= 10; c++) if (c - d.s === 0) return a + b + c; break; }
    case 'tres': return d.a + d.b + d.c;
    case 'sistema': { for (let a = -20; a <= 20; a++) for (let b = -20; b <= 20; b++) if (a + b === d.S && d.p * a - d.q * b === d.T) return a * b; break; }
    case 'grado': return d.k * d.m + d.n;
    case 'coef': { // el coeficiente sale de evaluar el producto en tres puntos (diferencias), sin desarrollar
      const Pr = x => (x + d.a) * (x * x + d.b * x + d.c), c0 = Pr(0), s1 = Pr(1) - 1 - c0, s2 = Pr(-1) + 1 - c0;   // a2 + a1 y a2 − a1
      return d.enX2 ? (s1 + s2) / 2 : (s1 - s2) / 2;
    }
    case 'suma-coef': return (d.a * 1 + d.b) ** d.k * (d.c * 1 + d.d);
    case 'indep': return ((0 + d.a) * (2 * 0 + d.b) * (0 + d.c));
    case 'producto-igual': {
      const m0 = en.match(/≡ (\d*)x² \+ nx ([+−]) (\d+)\.$/), K = (m0[2] === '−' ? -1 : 1) * Number(m0[3]), A = Number(m0[1] || 1);
      const q = Number(en.match(/\(x ([+−]) (\d)\)/).slice(1).join('').replace('−', '-').replace('+', '')) * -1;
      for (let m = -40; m <= 40; m++) for (let n = -40; n <= 40; n++) if ([0, 1, 2].every(x => (A * x + m) * (x - q) === A * x * x + n * x + K)) return m + n;
      break;
    }
    default: throw new Error(`tipo sin recálculo: ${d.tipo}`);
  }
  throw new Error(`sin respuesta: ${d.tipo}`);
}
function igual(esperado, valor) {
  if (esperado && esperado.expr) return mismo(esperado.expr, valor);
  return Math.abs(esperado - valor) < 1e-9;
}
probarGenerador(gen, { semillas: 600, recalcular, igual });
probarFugas(gen, { grupo: p => p._datos.tipo });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla} (${c.entrada.tipo})`, () => {
    const p = gen.generar(c.semilla);
    for (const [k, val] of Object.entries(c.entrada)) assert.deepEqual(p._datos[k], val, `${k}`);
    const bien = p.alternativas.find(a => a.correcta);
    assert.equal(bien.texto, c.esperado.texto);
    if (typeof c.esperado.respuesta === 'number') assert.equal(p.respuesta.valor, c.esperado.respuesta);
    else assert.ok(mismo(p.respuesta.valor, c.esperado.respuesta));
  });
}

test('tipos por idea: las seis ideas de la teoría, y generar(semilla, { idea }) da solo los suyos, con los tres niveles', () => {
  const teoria = require('../../contenido/teoria/algebra/polinomios.js');
  assert.deepEqual(Object.keys(gen.TIPOS_POR_IDEA), teoria.ideas.map(i => i.id));
  for (const [idea, tipos] of Object.entries(gen.TIPOS_POR_IDEA)) {
    const vistos = new Set();
    for (let s = 0; s < 300; s++) { const p = gen.generar(s, { idea }); assert.equal(p._datos.idea, idea); assert.ok(tipos.includes(p._datos.tipo)); vistos.add(p._datos.tipo); }
    assert.deepEqual([...vistos].sort(), [...tipos].sort(), idea);
    assert.ok(tipos.some(t => gen.NIVEL[t] === 3), `${idea}: sin nivel de examen`);
    assert.ok(tipos.some(t => gen.NIVEL[t] === 1), `${idea}: sin nivel 1`);
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
      assert.match(e, /^(Bien|\d|−\d|Esos|Ese)/, `semilla ${s}: ${e}`);
      assert.ok(!/\b(alternativa|opción|letra) [A-E]\b|\bla [A-E]\b/.test(e), `semilla ${s}: nombra una letra: ${e}`);
      assert.ok(e.split(/\s+/).length <= 32, `semilla ${s}: explicación larga: ${e}`);
      if (/^AL\d/.test(a.error.id)) assert.equal(a.error.fuente, 'docs/investigacion/algebra-funciones-ideas-erroneas.md');
      if (/^PO\d/.test(a.error.id)) assert.equal(a.error.fuente, 'plantillas/polinomios/plantilla.json');
    }
  }
  for (const c of ['TAL-NO-SEMEJ', 'TAL-SUMA-POT', 'TAL-ORDEN', 'PO12', 'PO11', 'PO28', 'PO9', 'PO1', 'TAL-COEF-Q', 'PO5', 'PO23', 'AL16', 'TAL-DESPLAZA']) assert.ok(codigos.has(c), c);
});

test('un color por magnitud: P naranja, Q turquesa, el valor de x naranja y el resultado violeta (solo en la solución)', () => {
  const COLOR = { P: 'o', Q: 'i', X: 'o', EX: 'o', EY: 'i', R: 'f' };
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    for (const [k, vv] of Object.entries(p.variables)) assert.equal(vv.color, COLOR[k], `semilla ${s}: ${k}`);
    assert.ok(!('P' in p.variables && 'X' in p.variables), `semilla ${s}: dos magnitudes con el mismo color`);
    const fuera = [...p.enunciado, ...p.pregunta].filter(x => x && typeof x === 'object').map(x => x.v);
    assert.ok(!fuera.includes('R'), `semilla ${s}: el resultado aparece antes de resolver`);
    assert.ok(p.solucion.flat().some(x => x && x.v === 'R'), `semilla ${s}: la solución no pinta el resultado`);
  }
});

test('notación: superíndices de verdad, signo menos tipográfico, sin «*», «1x», «+ −» ni «y¹»', () => {
  for (let s = 0; s < 800; s++) {
    const p = gen.generar(s), todo = [plano(p.enunciado), plano(p.pregunta), ...p.alternativas.map(a => a.texto), ...p.solucion.map(plano)].join(' | ');
    assert.ok(!/\*|\b1x|\+ −|− −|[xy]¹(?![⁰¹²³⁴⁵⁶⁷⁸⁹])|\d-\d|\s-\d|\^\d/.test(todo), `semilla ${s}: ${todo}`);
  }
});

test('datos: una lista de líneas cortas, sin la respuesta, en 400 semillas', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    assert.ok(Array.isArray(p.datos) && p.datos.length >= 1, `semilla ${s}: sin datos`);
    for (const l of p.datos) {
      assert.ok(typeof l === 'string' && l.split(/\s+/).length <= 22, `semilla ${s}: «${l}»`);
      assert.ok(!/^(Recuerda|Ojo|Cuidado|Fíjate|Conviene|No olvides)/.test(l), `semilla ${s}: consejo: ${l}`);
      assert.ok(!/null|NaN|undefined/.test(l));
    }
    const c = p.alternativas.find(a => a.correcta).texto;
    if (/\d{2,}/.test(c)) assert.ok(!p.datos.join(' ').includes(c), `semilla ${s}: los datos traen la respuesta ${c}`);
  }
});

test('nunca se queda sin cuatro alternativas (semillas 0 a 2000, y por idea)', () => {
  for (let s = 0; s < 2000; s++) assert.ok(gen.generar(s).alternativas.length >= 4);
  for (const idea of Object.keys(gen.TIPOS_POR_IDEA)) for (let s = 0; s < 300; s++) assert.ok(gen.generar(`i${s}`, { idea }).alternativas.length >= 4);
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

test('la unidad lista esta plantilla primero; la escena vieja va a «Más mesas del tema» en esta unidad', () => {
  const cat = JSON.parse(fs.readFileSync(path.join(__dirname, '../../catalogo/cursos/algebra.json'), 'utf8'));
  const u = cat.unidades.find(x => x.id === UNIDAD);
  assert.equal(u.plantillas[0], 'polinomios-practica');
  const ficha = JSON.parse(fs.readFileSync(path.join(__dirname, 'plantilla.json'), 'utf8'));
  assert.deepEqual(ficha.unidades, [UNIDAD]);
  assert.equal(ficha.formato, 'predicciones');
  const vieja = JSON.parse(fs.readFileSync(path.join(__dirname, '../polinomios/plantilla.json'), 'utf8'));
  assert.deepEqual(vieja.rehacer, [UNIDAD]);
});

test('la práctica no repite las predicciones de la unidad', () => {
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s), t = `${plano(p.enunciado)} ${plano(p.pregunta)}`;
    assert.ok(!/2xy \+ 3yx|3x²y − 2xy³ \+ 1|x⁵ − 3x² \+ 1|x² \+ 1 y 2x\b/.test(t), `semilla ${s}: ${t}`);
    assert.ok(!(/cubre 2x² \+ 3x \+ 4 dm²/.test(t) && /losetas de 1 dm/.test(t)), t);
    assert.ok(!/grado 2 y Q tiene grado 3\. ¿Qué grado tiene P · Q/.test(t), t);
  }
});
