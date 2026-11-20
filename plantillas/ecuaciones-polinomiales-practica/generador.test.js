// Pruebas de «Ecuaciones polinomiales» (práctica): casos.json (calculados aparte, con sympy, sin el generador), un
// recálculo independiente en 600 problemas (se lee lo que ve el alumno y se rehace aquí: raíces enteras por división
// sintética, conteos, sumas y productos), fugas, los tipos por idea, los colores de la unidad, los códigos de error, el
// recuadro «Datos» en 400 semillas, el papel y que la práctica no repite ninguna Predice.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');
const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));

// ---- Camino independiente ----
const SUP = { '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9 };
const numero = t => { const m = String(t).replace(/ (soles|dm)$/, '').replace(/(\d) (?=\d{3}\b)/g, '$1').replace('−', '-').match(/^(-?\d+)(?:\/(\d+))?$/); return m ? +m[1] / (m[2] ? +m[2] : 1) : NaN; };
// Coeficientes de un polinomio en x escrito como «2x³ − 5x² + 12» (sin paréntesis).
function coefs(texto) {
  const t = texto.replace(/(\d) (?=\d{3}\b)/g, '$1').replace(/ /g, '').replace(/−/g, '-');
  const out = {}; let g = 0;
  for (const m of t.matchAll(/([+-]?)(\d*)(x([⁰¹²³⁴⁵⁶⁷⁸⁹]*))?/g)) {
    if (!m[0] || m[0] === '+' || m[0] === '-') continue;
    const e = m[3] ? (m[4] ? [...m[4]].reduce((a, c) => a * 10 + SUP[c], 0) : 1) : 0;
    out[e] = (m[1] === '-' ? -1 : 1) * (m[2] ? +m[2] : 1); g = Math.max(g, e);
  }
  return Array.from({ length: g + 1 }, (_, i) => out[g - i] || 0);
}
// Raíces enteras con su repetición (división sintética) y lo que queda sin abrir.
function enteras(cs) {
  let q = cs.slice(); const r = [];
  for (let a = -40; a <= 40; a++) for (;;) { if (q.length < 2) break; const b = []; q.forEach((c, k) => b.push(k ? c + a * b[k - 1] : c)); if (b[b.length - 1] !== 0) break; r.push(a); q = b.slice(0, -1); }
  return { r, resto: q };
}
const realesDeCuadratica = ([a, b, c]) => (b * b - 4 * a * c >= 0 ? 2 : 0);
function recalcular(p) {
  const en = plano(p.enunciado), pr = plano(p.pregunta), d = p._datos;
  let m;
  switch (d.tipo) {
    case 'total': return d.m + d.k + 2;
    case 'distintas': return '2';
    case 'no-reales': { m = en.match(/\((x [−+] \d+)\)\((.+)\) = 0/); const cs = coefs(m[2]); return String(realesDeCuadratica(cs) ? 0 : 2); }
    case 'triple': { m = en.match(/raíz triple (−?\d+), y su término independiente es (−?\d+)/); return numero(m[2]) / numero(m[1]) ** 3; }
    case 'suma': case 'producto': { const cs = coefs(en.match(/es (.+) = 0/)[1]), { r } = enteras(cs); return d.tipo === 'suma' ? r.reduce((a, b) => a + b, 0) : r.reduce((a, b) => a * b, 1); }
    case 'inversos': { const { r } = enteras(coefs(en.match(/raíces de (.+) = 0/)[1])), v = r.reduce((a, b) => a + 1 / b, 0); return v; }
    case 'coef-k': { m = en.match(/x³ ([−+]) (\d*)x² \+ kx ([−+]) (\d+) = 0 tiene las raíces (−?\d+) y (−?\d+)/); const S = (m[1] === '−' ? 1 : -1) * (m[2] ? +m[2] : 1), r1 = numero(m[5]), r2 = numero(m[6]), r3 = S - r1 - r2; return r1 * r2 + r1 * r3 + r2 * r3; }
    case 'cuantos': { const cs = coefs(en.match(/es (.+) = 0/)[1]), L = Math.abs(cs[0]), C = Math.abs(cs[cs.length - 1]), s = new Set(); for (let a = 1; a <= C; a++) for (let b = 1; b <= L; b++) if (C % a === 0 && L % b === 0) { s.add(a / b); s.add(-a / b); } return s.size; }
    case 'caja': { m = en.match(/\(x \+ (\d+)\) dm de ancho y \(x \+ (\d+)\) dm de alto, y guarda ([\d ]+) dm³/); const a = +m[1], b = +m[2], V = +m[3].replace(/ /g, ''); for (let x = 1; x < 40; x++) if (x * (x + a) * (x + b) === V) return x + Math.max(a, b); return NaN; }
    case 'menor-grado': return String(4 + (d.dos ? 2 : 1));
    case 'raiz-real': { m = en.match(/cx ([−+]) (\d+) = 0/); const dd = (m[1] === '−' ? -1 : 1) * +m[2]; return -dd / (d.m * d.m + d.k * d.k); }
    case 'reales-bicuad': { const cs = coefs(en.match(/es (.+) = 0/)[1]); const D = cs[2] ** 2 - 4 * cs[4]; let n = 0; if (D >= 0) for (const u of [(-cs[2] + Math.sqrt(D)) / 2, (-cs[2] - Math.sqrt(D)) / 2]) if (u > 0) n += 2; return String(n); }
    case 'mayor': { const cs = coefs(en.match(/es (.+) = 0/)[1]), D = cs[2] ** 2 - 4 * cs[4]; return Math.sqrt((-cs[2] + Math.sqrt(D)) / 2); }
    case 'precio': { const cs = coefs(en.match(/cumple (.+) = 0/)[1]), D = cs[2] ** 2 - 4 * cs[4], a = Math.sqrt((-cs[2] - Math.sqrt(D)) / 2), b = Math.sqrt((-cs[2] + Math.sqrt(D)) / 2); return `${Math.round(b - a)} soles`; }
    case 'reales-bin': case 'no-reales-bin': { m = en.match(/x([⁰¹²³⁴⁵⁶⁷⁸⁹]) = (−?[\d ]+)/); const n = SUP[m[1]], c = numero(m[2].replace(/ /g, '')), re = n % 2 ? 1 : c > 0 ? 2 : 0; return String(d.tipo === 'reales-bin' ? re : n - re); }
    case 'producto-nr': { const c = numero(en.match(/x³ = (−?\d+)/)[1]), k = Math.cbrt(Math.abs(c)); return k * k; }
    case 'producto-todas': return -numero(en.match(/x⁴ = ([\d ]+)/)[1].replace(/ /g, ''));
    default: return p.respuesta.valor;   // no-puede, otras, companera, factor2 y en-t: los rehace la prueba de abajo
  }
}
const igual = (esperado, valor) => (typeof esperado === 'string' ? esperado === String(valor) : Math.abs(esperado - (typeof valor === 'string' ? numero(valor) : valor)) < 1e-9);
probarGenerador(gen, { semillas: 600, recalcular, igual });
probarFugas(gen, { grupo: p => p._datos.tipo });

test('los tipos de texto, rehechos aparte (400 semillas por idea): una sola alternativa cumple', () => {
  let n = 0;
  for (const idea of Object.keys(gen.TIPOS_POR_IDEA)) for (let s = 0; s < 400; s++) {
    const p = gen.generar(s, { idea }), d = p._datos, en = plano(p.enunciado);
    let cumple = null;
    if (d.tipo === 'no-puede') cumple = t => { const [a, b = '1'] = t.replace('−', '').split('/'); return !(Math.abs(d.C) % +a === 0 && d.L % +b === 0); };
    if (d.tipo === 'otras') { const cs = d.cs, val = t => { const [a, b = '1'] = t.replace('−', '-').split('/'); return +a / +b; }; cumple = t => t.split(' y ').every(r => Math.abs(cs.reduce((acc, c) => acc * val(r) + c, 0)) < 1e-9 && Math.abs(val(r) - d.r0) > 1e-9) && t.split(' y ')[0] !== t.split(' y ')[1]; }
    if (d.tipo === 'en-t') cumple = t => t === `t² ${d.B < 0 ? '−' : '+'} ${Math.abs(d.B) === 1 ? '' : Math.abs(d.B)}t${d.C - 2 === 0 ? '' : ` ${d.C - 2 < 0 ? '−' : '+'} ${Math.abs(d.C - 2)}`} = 0`;
    if (d.tipo === 'factor2' || d.tipo === 'companera') {
      // (x − z)(x − w): suma y producto con √n o i, rehechos con números.
      const valor = t => { const m = t.match(/^(−?\d+)? ?([+−]?) ?(\d*)(√(\d+)|i)$/); if (!m) return null; const a = m[1] ? +m[1].replace('−', '-') : 0, sg = m[2] === '−' || (!m[1] && t.startsWith('−')) ? -1 : 1, k = m[3] ? +m[3] : 1; return m[4] === 'i' ? { re: a, im: sg * k, r: 0 } : { re: a + sg * k * Math.sqrt(+m[5]), im: 0, r: 1 }; };
      const z = valor(d.txt);
      if (d.tipo === 'companera') cumple = t => { const w = valor(t); if (!w) return false; const sre = z.re + w.re, sim = z.im + w.im, pre = z.re * w.re - z.im * w.im, pim = z.re * w.im + z.im * w.re; return Math.abs(sim) < 1e-9 && Math.abs(pim) < 1e-9 && Math.abs(sre - Math.round(sre)) < 1e-9 && Math.abs(pre - Math.round(pre)) < 1e-9; };
      else cumple = t => { const cs = coefs(t); const re = z.re * z.re - z.im * z.im + cs[1] * z.re + cs[2], im = 2 * z.re * z.im + cs[1] * z.im; return Math.abs(re) < 1e-6 && Math.abs(im) < 1e-6; };
    }
    if (!cumple) continue;
    const ok = p.alternativas.filter(a => cumple(a.texto));
    assert.equal(ok.length, 1, `${d.tipo} ${s}: ${en} → ${p.alternativas.map(a => a.texto).join(' / ')}`);
    assert.ok(ok[0].correcta, `${d.tipo} ${s}: la que cumple no es la correcta`);
    n++;
  }
  assert.ok(n > 400, `revisados: ${n}`);
});

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla} (${c.entrada.tipo})`, () => {
    const p = gen.generar(c.semilla, { idea: c.entrada.idea });
    assert.equal(p._datos.tipo, c.entrada.tipo);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.texto);
  });
}

test('tipos por idea: las seis ideas de la teoría, y generar(semilla, { idea }) da solo los suyos, con nivel 1 y nivel 3', () => {
  const teoria = require('../../contenido/teoria/algebra/ecuaciones-polinomiales.js');
  assert.deepEqual(Object.keys(gen.TIPOS_POR_IDEA), teoria.ideas.map(i => i.id));
  for (const [idea, tipos] of Object.entries(gen.TIPOS_POR_IDEA)) {
    const vistos = new Set();
    for (let s = 0; s < 300; s++) { const p = gen.generar(s, { idea }); assert.equal(p._datos.idea, idea); vistos.add(p._datos.tipo); }
    assert.deepEqual([...vistos].sort(), [...tipos].sort(), idea);
    assert.ok(tipos.some(t => gen.NIVEL[t] === 1) && tipos.some(t => gen.NIVEL[t] === 3), idea);
  }
});

test('cada explicación empieza por lo que el alumno hizo bien, muestra lo que da su error y no nombra una letra', () => {
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas.filter(x => !x.correcta)) {
      const e = a.error.explicacion;
      assert.match(e, /^Bien/, `semilla ${s}: ${e}`);
      assert.ok(e.includes(a.texto.replace(/ (soles|dm)$/, '')), `semilla ${s}: no muestra su valor «${a.texto}»: ${e}`);
      assert.ok(!/\b(alternativa|opción|letra) [A-E]\b|\bla [A-E]\b/.test(e), `semilla ${s}: ${e}`);
      assert.ok(e.split(/\s+/).length <= 32, `semilla ${s}: explicación larga: ${e}`);
    }
  }
});

test('un color por magnitud: las raíces violeta, los coeficientes naranja, lo que se prueba y la variable auxiliar turquesa', () => {
  const COLOR = { r: 'f', c: 'o', n: 'i', u: 'i' };
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    for (const [k, vv] of Object.entries(p.variables)) assert.equal(vv.color, COLOR[k], `semilla ${s}: ${k}`);
  }
});

test('notación: superíndices de verdad, signo menos tipográfico, sin «*», «1x», «+ −», «− −» ni menos de teclado', () => {
  for (let s = 0; s < 1200; s++) {
    const p = gen.generar(s), todo = [plano(p.enunciado), plano(p.pregunta), ...p.alternativas.map(a => a.texto), ...p.alternativas.filter(a => a.error).map(a => a.error.explicacion), ...p.solucion.map(plano)].join(' | ');
    assert.ok(!/\*|\b1x|\+ −|− −|x − −|x¹(?![⁰¹²³⁴⁵⁶⁷⁸⁹])|\d-\d|(^|[\s(=:,])-\d|\^\d|null|NaN|undefined|\(\)/.test(todo), `semilla ${s}: ${todo}`);
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
    if (/\d{2,}|x|√|i/.test(c)) assert.ok(!p.datos.join(' ').includes(c), `semilla ${s}: los datos traen la respuesta ${c}`);
  }
});

test('la práctica no repite ninguna Predice de la unidad', () => {
  for (let s = 0; s < 2000; s++) {
    const t = plano(gen.generar(s).enunciado);
    assert.ok(!/2x³ − 6x² \+ 4x \+ 10|x⁴ \+ 3x² − 4 = 0|x³ = 8\.|la raíz 2 \+ 3i/.test(t), `semilla ${s}: ${t}`);
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

// ---------- Correcciones del 20 nov (cierre: auditoría) ----------
test('compañera: la raíz dada nunca está entre las alternativas (también es raíz «seguro»: serían dos respuestas)', () => {
  let vistos = 0;
  for (let s = 0; s < 1600; s++) {
    const p = gen.generar(s, { idea: 'conjugadas' });
    if (p._datos.tipo !== 'companera') continue;
    vistos++;
    const raiz = plano(p.enunciado).replace(/ es raíz.*$/, '');
    assert.ok(!p.alternativas.some(a => plano(a.texto) === raiz), `${raiz}: ${p.alternativas.map(a => a.texto)}`);
  }
  assert.ok(vistos > 100);
});

test('textos: sin «parte entera», sin «1 reales», sin «−(10)», y con los dos u negativos nadie alaba un «u positivo»', () => {
  for (const idea of Object.keys(gen.TIPOS_POR_IDEA)) for (let s = 0; s < 400; s++) {
    const p = gen.generar(s, { idea }), todo = [p.enunciado, p.pregunta, ...p.solucion, ...p.alternativas.map(a => a.error ? a.error.explicacion : '')].map(plano).join(' ');
    assert.ok(!/parte entera/.test(todo), todo);
    assert.ok(!/\b1 (reales|son reales)\b/.test(todo), todo);
    assert.ok(!/−\(\d+\)/.test(todo), todo);
    if (p._datos.tipo === 'reales-bicuad' && p._datos.u1 < 0 && p._datos.u2 < 0) assert.ok(!/u positivo|raíces opuestas/.test(todo), todo);
  }
});
