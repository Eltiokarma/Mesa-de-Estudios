// Pruebas de «Congruencia de triángulos» (práctica de geometria.congruencia): casos.json (calculados aparte, con un
// script que no usa el generador), un recálculo independiente en 400 problemas (a partir de los datos del problema, con
// coordenadas y trigonometría donde se puede: otro camino que las reglas del generador), fugas, tipos por idea, el recuadro
// «Datos» en 400 semillas, notación y papel.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');

const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));
const sinDuros = t => String(t).replace(/ /g, ' ');
const palabras = x => sinDuros(plano(x)).split(/\s+/).filter(w => /\p{L}/u.test(w)).length;
const RAD = Math.PI / 180;
const casi = (a, b, e = 1e-6) => Math.abs(a - b) < e;

// ---- Camino independiente ----
// Un triángulo por sus tres lados (AB = c sobre el eje x, A en el origen) y sus ángulos medidos.
const porLados = (c, b, a) => { const x = (c * c + b * b - a * a) / (2 * c); return { A: [0, 0], B: [c, 0], C: [x, Math.sqrt(b * b - x * x)] }; };
const ang = (V, P, Q) => { const u = [P[0] - V[0], P[1] - V[1]], w = [Q[0] - V[0], Q[1] - V[1]]; return Math.acos((u[0] * w[0] + u[1] * w[1]) / (Math.hypot(...u) * Math.hypot(...w))) / RAD; };
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
// La x que hace iguales a·x + b y c·x + d (probando enteros de −50 a 100).
const xIgual = (a, b, c, d) => { for (let x = -50; x <= 100; x++) if (a * x + b === c * x + d) return x; return NaN; };
function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'criterio': return { LAL: 'LAL', ALA: 'ALA', LLL: 'LLL', LLA: 'Ninguno: esos datos no bastan', AAA: 'Ninguno: esos datos no bastan' }[d.caso];
    case 'cuantos': {
      // Puntos de la semirrecta desde A a 30° que quedan a BC de B: t² − 2·AB·cos30°·t + AB² − BC² = 0, con t > 0.
      const bq = -2 * d.AB * Math.cos(30 * RAD), cq = d.AB * d.AB - d.BC * d.BC, disc = bq * bq - 4 * cq;
      const ts = Math.abs(disc) < 1e-9 ? [-bq / 2] : disc < 0 ? [] : [(-bq - Math.sqrt(disc)) / 2, (-bq + Math.sqrt(disc)) / 2];
      return ['Ninguno', 'Uno solo', 'Dos'][ts.filter(t => t > 1e-9).length];
    }
    case 'con-x': case 'cruce': { const x = xIgual(d.p, -d.q, 1, d.s); return d.p * x - d.q; }
    case 'orden': { const med = { AB: d.AB, BC: d.BC, AC: d.AC }, i = d.perm.indexOf(d.pide[0]), j = d.perm.indexOf(d.pide[1]); return med[['AB', 'BC', 'AC'][[0, 1].includes(i) && [0, 1].includes(j) ? 0 : [1, 2].includes(i) && [1, 2].includes(j) ? 1 : 2]]; }
    case 'angulo-orden': return 180 - d.A - d.B;
    case 'iso-de': {
      // Con coordenadas: un isósceles cualquiera con AD = AE y ∠DAE = t (D y E simétricos): el ángulo ADE medido.
      const h = 3, e = h * Math.tan(d.t / 2 * RAD), A = [0, h], D = [-e, 0], E = [e, 0];
      return Math.round(ang(D, E, A) * 1e6) / 1e6;
    }
    case 'iso-med': { const A = [-1, 0], B = [1, 0], P = [0, Math.tan(d.th * RAD)]; return Math.round(ang(P, A, B) * 1e6) / 1e6; }
    case 'igualar': { const x = xIgual(d.a1, d.b1, d.a2, d.b2); return d.a1 * x + d.b1; }
    case 'perimetro': {
      // Con coordenadas: el punto de BC que equidista de A y de C, y el perímetro de ABP medido.
      const T = porLados(d.AB, d.AC, d.BC);
      for (let k = 0; k <= 200000; k++) { const t = k / 200000, P = [T.B[0] + (T.C[0] - T.B[0]) * t, T.B[1] + (T.C[1] - T.B[1]) * t]; if (Math.abs(dist(P, T.A) - dist(P, T.C)) < 1e-4) return Math.round(dist(T.A, T.B) + dist(T.B, P) + dist(P, T.A)); }
      return NaN;
    }
    case 'perp-bis': return d.AB - d.AC;
    case 'mitad': return d.alReves ? 2 * d.dado : d.dado / 2;
    case 'reciproco': return d.AC / 2;
    case 'con-x-bm': case 'med-x': { const x = xIgual(d.q, -d.s, 2, 2 * d.p); return x + d.p; }
    case 'medial': { const s = d.lados.reduce((a, b) => a + b, 0); return d.alReves ? 2 * s : s / 2; }
    case 'dos-bases': return d.BC / 4;
    case 'mediana': return d.alReves ? 2 * d.dado : d.dado / 2;
    case 'iso-ang': {
      // Con coordenadas: recto en C, m∠A = a; M punto medio de AB; el ángulo pedido medido.
      const a = d.a, A = [0, 0], C = [Math.cos(a * RAD) ** 2, Math.cos(a * RAD) * Math.sin(a * RAD)], B = [1, 0], M = [0.5, 0];
      return Math.round(ang(C, d.pide === 'ACM' ? A : B, M) * 1e6) / 1e6;
    }
    case 'med-altura': { const a = d.a, A = [0, 0], C = [Math.cos(a * RAD) ** 2, Math.cos(a * RAD) * Math.sin(a * RAD)], M = [0.5, 0], H = [C[0], 0]; return Math.round(ang(C, M, H) * 1e6) / 1e6; }
    case 'entero': { let mx = 0; for (let n = 1; n < 4 * d.CM; n++) if (n < 2 * d.CM) mx = n; return mx; }
    case 'n30': return d.alReves ? 2 * d.k : d.k;
    case 'n37': { const h = 5 * d.k, sen = d.ang === 37 ? 3 / 5 : 4 / 5; return d.pide === 'alto' ? h * sen : h * Math.sqrt(1 - sen * sen); }
    case 'n45': return `${d.a === 1 ? '' : d.a}√2 cm`;
    case 'iso120': return `${d.L}√3 cm`;
    case 'altura': { const h = d.BH; return h + h / (d.aC === 37 ? 3 / 4 : 4 / 3); }
    default: throw new Error(`tipo sin recálculo: ${d.tipo}`);
  }
}
const igual = (esperado, valor) => (typeof esperado === 'string' ? sinDuros(esperado) === sinDuros(valor) : casi(esperado, valor, 1e-6));

probarGenerador(gen, { semillas: 400, recalcular, igual });
probarFugas(gen, { semillas: 1500 });

test('tipos por idea: las seis ideas de la unidad, todos los tipos generan y caen en su idea', () => {
  assert.deepEqual(Object.keys(gen.TIPOS_POR_IDEA), ['criterios', 'partes-correspondientes', 'mediatriz-bisectriz', 'base-media', 'mediana-hipotenusa', 'notables']);
  for (const [idea, tipos] of Object.entries(gen.TIPOS_POR_IDEA)) {
    const vistos = new Set();
    for (let s = 0; s < 300; s++) { const p = gen.generar(s, { idea }); assert.equal(p._datos.idea, idea); vistos.add(p._datos.tipo); }
    assert.deepEqual([...vistos].sort(), [...tipos].sort(), idea);
    for (const t of tipos) for (const n of [1, 2, 3]) if (gen.generar(n, { tipo: t })._datos.nivel === 3) { /* hay de examen */ }
  }
  const niveles = new Set(); for (let s = 0; s < 400; s++) niveles.add(gen.generar(s)._datos.nivel);
  assert.deepEqual([...niveles].sort(), [1, 2, 3]);
});

test('el recuadro «Datos»: lista de líneas cortas, sin la respuesta, sin consejos (400 semillas)', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), c = p.alternativas.find(a => a.correcta).texto;
    assert.ok(Array.isArray(p.datos) && p.datos.length >= 1, `${s}`);
    for (const d of p.datos) {
      assert.ok(palabras(d) <= 22, `${s}: dato largo «${d}»`);
      assert.ok(!/^(Recuerda|Ojo|Cuidado|No olvides|Ten en cuenta|Fíjate|Conviene|Primero)/.test(d), `${s}: consejo «${d}»`);
      if (/\d/.test(c) && !/^\d+° y \d+°$/.test(c)) assert.ok(!new RegExp(`(^|[^\\d,])${c.replace(/[.*+?^${}()|[\]\\√]/g, '\\$&')}`).test(sinDuros(d)), `${s}: el dato «${d}» trae la respuesta ${c}`);
    }
  }
});

test('notación: m∠ (nunca «∠A = 40°»), x sin «°», todo largo con su unidad, explicaciones sin la letra de una alternativa', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    const textos = [plano(p.enunciado), plano(p.pregunta), plano(p.solucion), ...p.alternativas.map(a => a.texto), ...p.alternativas.filter(a => a.error).map(a => a.error.explicacion)].map(sinDuros);
    for (const t of textos) {
      assert.ok(!/(^|[^m])∠[A-HKMNOPQR]{1,3} = \d/.test(t), `${s}: «${t}»`);
      assert.ok(!/\bx = \d+(,\d+)?°/.test(t), `${s}: «${t}»`);
      assert.ok(!/\b(alternativa|opción) [A-E]\b/.test(t), `${s}: «${t}»`);
    }
    for (const a of p.alternativas) if (/^\d/.test(a.texto) && !/ (cm|m)$|°$/.test(a.texto)) assert.fail(`${s}: alternativa sin unidad «${a.texto}»`);
  }
});

test('casos.json: cada caso da su problema y su respuesta (calculada aparte)', () => {
  assert.ok(casos.casos.length >= 15 && casos.casos.length <= 30, `${casos.casos.length} casos`);
  for (const c of casos.casos) {
    const p = gen.generar(c.semilla, c.opciones || {});
    assert.equal(sinDuros(`${plano(p.enunciado)} ${plano(p.pregunta)}`), c.enunciado, `semilla ${c.semilla}`);
    const v = p.respuesta.valor;
    if (typeof c.esperado.valor === 'string') assert.equal(sinDuros(v), c.esperado.valor, `semilla ${c.semilla}`);
    else assert.ok(casi(v, c.esperado.valor, casos.tolerancia), `semilla ${c.semilla}: ${v} y no ${c.esperado.valor}`);
    assert.equal(sinDuros(p.alternativas.find(a => a.correcta).texto), c.esperado.texto, `semilla ${c.semilla}`);
  }
});

test('papel: 8 problemas del generador, de las seis ideas, con «Datos:» al final', () => {
  const papel = require('./papel.json');
  assert.equal(papel.problemas.length, 8);
  const ideas = new Set();
  papel.problemas.forEach((q, i) => {
    const p = gen.generar(`papel-${i + 1}`);
    ideas.add(p._datos.idea);
    assert.ok(sinDuros(q.enunciado).startsWith(sinDuros(`${plano(p.enunciado)} ${plano(p.pregunta)}`).slice(0, 40)), `${q.id}: no es el del generador`);
    assert.ok(/ Datos: .+ Alternativas: /.test(q.enunciado), `${q.id}: sin datos al final`);
    assert.ok(/ (cm|m)$|°$|^[A-E]\) [^0-9]/.test(q.respuesta), `${q.id}: la respuesta sin su unidad`);
  });
  assert.equal(ideas.size, 6, 'el papel cubre las seis ideas');
});
