// Pruebas de «Proporcionalidad y semejanza» (práctica de geometria.proporcionalidad-y-semejanza): casos.json (calculados
// aparte, con un script que no usa el generador), un recálculo independiente en 400 problemas por tipo (leyendo el
// enunciado; con coordenadas o fuerza bruta), fugas, tipos por idea, el recuadro «Datos» en 400 semillas, notación,
// igualdades escritas y papel.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');

const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));
const sinDuros = t => String(t).replace(/[  ]/g, ' ');
const palabras = x => sinDuros(plano(x)).split(/\s+/).filter(w => /\p{L}/u.test(w)).length;
const casi = (a, b, e = 1e-6) => Math.abs(a - b) < e;
const num = s => +String(s).replace(/ /g, '').replace(',', '.');
const nums = t => (sinDuros(t).match(/\d+(?:,\d+)?/g) || []).map(num);
const val = (t, k) => { const m = new RegExp(`${k} = (\\d+(?:,\\d+)?)`).exec(t); return m ? num(m[1]) : NaN; };
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
const mezcla = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
const corte = (A, B, C, D) => { const r = [B[0] - A[0], B[1] - A[1]], s = [D[0] - C[0], D[1] - C[1]], den = r[0] * s[1] - r[1] * s[0], t = ((C[0] - A[0]) * s[1] - (C[1] - A[1]) * s[0]) / den; return [A[0] + r[0] * t, A[1] + r[1] * t]; };
const tri = (c, b, a) => { const x = (c * c + b * b - a * a) / (2 * c); return [[0, 0], [c, 0], [x, Math.sqrt(b * b - x * x)]]; };
const busca = (f, lo, hi, paso) => { for (let x = lo; x <= hi + 1e-9; x += paso) if (f(+x.toFixed(6))) return +x.toFixed(6); return NaN; };
const razonTxt = (a, b) => { const g = (x, y) => (y ? g(y, x % y) : x); const k = g(a, b); return `${a / k} : ${b / k}`; };

// ---- Camino independiente: desde el texto del problema (coordenadas y fuerza bruta) ----
function recalcular(p) {
  const d = p._datos, t = sinDuros(plano(p.enunciado) + ' ' + plano(p.pregunta)), N = nums(t);
  const T0 = [2, 5], T1 = [0, 0], T2 = [7, 0];
  switch (d.tipo) {
    case 'tres': { const a = val(t, 'AB'), b = val(t, 'BC'), de = val(t, 'DE'), h1 = 0.3 * a, h2 = 0.3 * b, s2 = h1 / de, dx = Math.sqrt(1 - s2 * s2), E = [5 + dx * de, h2], F = [E[0] + dx * h2 / s2, 0]; return dist(E, F); }
    case 'total': { const a = val(t, 'AB'), b = val(t, 'BC'), T = val(t, 'DF'); return busca(x => casi(x / (T - x), a / b, 1e-9), 0.5, T, 0.5); }
    case 'triangulo': { const am = val(t, 'AM'), mb = val(t, 'MB'), an = val(t, 'AN'), B = [am + mb, 0], M = [am, 0], u = [Math.cos(1), Math.sin(1)], N = [an * u[0], an * u[1]], C = corte(B, [B[0] + N[0] - M[0], B[1] + N[1] - M[1]], [0, 0], u); return dist(N, C); }
    case 'thales-x': { const p0 = +/MB = x \+ (\d+)/.exec(t)[1], an = val(t, 'AN'), nc = val(t, 'NC'), x = busca(x => casi(x * nc, (x + p0) * an), 1, 300, 1); return 2 * x + p0; }
    case 'tramo': { const [A, B, C] = tri(val(t, 'AB'), val(t, 'AC'), val(t, 'BC')), c = val(t, 'AB'), b = val(t, 'AC'), D = corte(A, [B[0] / c + C[0] / b, B[1] / c + C[1] / b], B, C); return /mide BD/.test(t) ? dist(B, D) : dist(D, C); }
    case 'lado': case 'perimetro': {
      const bd = val(t, 'BD'), dc = val(t, 'DC'), c = val(t, 'AB'), a = bd + dc;
      const b = busca(b => { if (!(a < b + c && b < a + c && c < a + b)) return false; const [A, B, C] = tri(c, b, a), D = corte(A, [B[0] / c + C[0] / b, B[1] / c + C[1] / b], B, C); return casi(dist(B, D), bd, 1e-6); }, 0.5, 300, 0.5);
      return d.tipo === 'lado' ? b : a + b + c; }
    case 'exterior': { const c = val(t, 'AB'), b = val(t, 'AC'), [A, B, C] = tri(c, b, val(t, 'BC')), E = corte(A, [B[0] / c - C[0] / b, B[1] / c - C[1] / b], B, C); return dist(C, E); }
    case 'sombra': { const [S, h, s] = N; return S * Math.tan(Math.atan(h / s)); }
    case 'base': { const am = val(t, 'AM'), mb = val(t, 'MB'), bc = val(t, 'BC'), B = [am + mb, 0], C = [2, 5], M = [am, 0], Nn = corte(M, [M[0] + C[0] - B[0], M[1] + C[1] - B[1]], [0, 0], C); return dist(M, Nn) * bc / dist(B, C); }
    case 'lll': { const a = N.slice(0, 3), b = N.slice(3, 6); return casi(b[0] / a[0], b[1] / a[1], 1e-9) && casi(b[0] / a[0], b[2] / a[2], 1e-9) ? 'si' : 'no'; }
    case 'espejo': { const [a, ojo, b] = N; return b * Math.tan(Math.atan(ojo / a)); }
    case 'cruzados': { const oa = val(t, 'OA'), oc = val(t, 'OC'), ab = val(t, 'AB'), A = [-oa, 0], C = [oc, 0], B = [A[0] + ab * Math.cos(1.2), ab * Math.sin(1.2)], D = corte([0, 0], B, C, [C[0] + B[0] - A[0], B[1] - A[1]]); return dist(C, D); }
    case 'anti': {
      const ab = val(t, 'AB'), ac = val(t, 'AC'), ae = val(t, 'AE'), B = [ab, 0], C = [ac * Math.cos(1), ac * Math.sin(1)], E = [ae * Math.cos(1), ae * Math.sin(1)];
      const ang = (V, P, Q) => Math.acos(((P[0] - V[0]) * (Q[0] - V[0]) + (P[1] - V[1]) * (Q[1] - V[1])) / (dist(V, P) * dist(V, Q)));
      return busca(x => casi(ang([x, 0], [0, 0], E), ang(C, [0, 0], B), 1e-9), 0.25, ab, 0.25); }
    case 'comun': { const ad = val(t, 'AD'), ac = ad + val(t, 'DC'); return busca(x => casi(x / ac, ad / x, 1e-12), 1, 100, 1); }
    case 'cuadrado': { const [b, h] = N; return busca(x => casi(x / b, (h - x) / h, 1e-12), 0.5, 100, 0.5); }
    case 'area': { const [k, S] = N; return S * k * k; }
    case 'lindero': { const [S, p0, q] = N, A = [0, 3], B = [0, 0], C = [4, 0], ar = P => Math.abs(P.reduce((s, X, i) => { const Y = P[(i + 1) % P.length]; return s + X[0] * Y[1] - Y[0] * X[1]; }, 0)) / 2;
      const ch = S * ar([A, mezcla(A, B, p0 / q), mezcla(A, C, p0 / q)]) / ar([A, B, C]); return /otra parte/.test(t) ? S - ch : ch; }
    case 'per-area': { const [k, Pm, S] = N; return /el perímetro del grande/.test(t) ? Pm * k : S * k * k; }
    case 'raices': { const [a, b, c] = N; return (Math.sqrt(a) + Math.sqrt(b) + Math.sqrt(c)) ** 2; }
    case 'ceva': { const af = val(t, 'AF'), fb = val(t, 'FB'), F = mezcla(T0, T1, af / (af + fb)), D = mezcla(T1, T2, val(t, 'BD') / (val(t, 'BD') + val(t, 'DC'))), P = corte(T0, D, T2, F), E = corte(T1, P, T2, T0); return dist(T2, E) / dist(E, T0) * val(t, 'EA'); }
    case 'ceva-x': { const b = val(t, 'FB'), D = mezcla(T1, T2, val(t, 'BD') / (val(t, 'BD') + val(t, 'DC'))), E = mezcla(T2, T0, val(t, 'CE') / (val(t, 'CE') + val(t, 'EA'))), P = corte(T0, D, T1, E), F = corte(T2, P, T0, T1); return dist(T0, F) / dist(F, T1) * b + b; }
    case 'ceva-razon': { const m = [...t.matchAll(/(\d+) : (\d+)/g)].map(x => [+x[1], +x[2]]), D = mezcla(T1, T2, m[0][0] / (m[0][0] + m[0][1])), E = mezcla(T2, T0, m[1][0] / (m[1][0] + m[1][1])), P = corte(T0, D, T1, E), F = corte(T2, P, T0, T1), r = dist(T0, F) / dist(F, T1);
      for (let den = 1; den <= 100; den++) { const nn = Math.round(r * den); if (casi(nn / den, r, 1e-9)) return razonTxt(nn, den); } return 'x'; }
    case 'menelao': { const L = val(t, 'CA'), A = [L * Math.cos(1.1), L * Math.sin(1.1)], C = [0, 0], B = [9, 0], af = val(t, 'AF'), fb = val(t, 'FB'), bd = val(t, 'BD'), dc = val(t, 'DC');
      const F = mezcla(A, B, af / (af + fb)), D = mezcla(B, C, bd / (bd + dc)), E = corte(F, D, C, A); return dist(E, A); }
    default: return NaN;
  }
}

probarGenerador(gen, { recalcular, igual: (a, b) => (typeof a === 'string' ? a === b : casi(a, b, 1e-6)) });
probarFugas(gen);

test('tipos por idea: las seis ideas de la unidad, todos los tipos generan y caen en su idea; niveles 1 a 3', () => {
  const teoria = require('../../contenido/teoria/geometria/proporcionalidad-y-semejanza.js');
  assert.deepEqual(Object.keys(gen.TIPOS_POR_IDEA), teoria.ideas.map(i => i.id), 'las mismas ideas que la teoría');
  for (const [idea, tipos] of Object.entries(gen.TIPOS_POR_IDEA)) {
    const vistos = new Set();
    for (let s = 0; s < 300; s++) { const p = gen.generar(s, { idea }); assert.equal(p._datos.idea, idea); vistos.add(p._datos.tipo); }
    assert.deepEqual([...vistos].sort(), [...tipos].sort(), idea);
  }
  const niveles = new Set(); for (let s = 0; s < 400; s++) niveles.add(gen.generar(s)._datos.nivel);
  assert.deepEqual([...niveles].sort(), [1, 2, 3]);
});

test('una sola correcta, cuatro alternativas distintas o más, y la respuesta rehecha desde el texto (400 semillas por tipo)', () => {
  for (const t of gen.TIPOS) for (let s = 0; s < 400; s++) {
    const p = gen.generar(s, { tipo: t }), tx = p.alternativas.map(a => a.texto);
    assert.equal(p.alternativas.filter(a => a.correcta).length, 1, `${t} ${s}`);
    assert.equal(new Set(tx).size, tx.length, `${t} ${s}: alternativas repetidas`);
    assert.ok(tx.length >= 4, `${t} ${s}`);
    const r = recalcular(p);
    assert.ok(typeof r === 'string' ? r === p.respuesta.valor : casi(r, p.respuesta.valor, 1e-6), `${t} ${s}: ${r} contra ${p.respuesta.valor}`);
    if (typeof r !== 'string') for (const a of p.alternativas.filter(x => !x.correcta)) assert.ok(!casi(num(a.texto.replace(/[^\d ,]/g, '').trim()), p.respuesta.valor), `${t} ${s}`);
    for (const a of p.alternativas.filter(x => !x.correcta)) assert.ok(a.error && a.error.explicacion && a.error.explicacion.length > 10, `${t} ${s}`);
  }
});

test('el recuadro «Datos»: lista de líneas cortas, sin la respuesta, sin consejos (400 semillas)', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), c = p.alternativas.find(a => a.correcta).texto;
    assert.ok(Array.isArray(p.datos) && p.datos.length >= 1, `${s}`);
    for (const d of p.datos) {
      assert.ok(palabras(d) <= 22, `${s}: dato largo «${d}»`);
      assert.ok(!/^(Recuerda|Ojo|Cuidado|No olvides|Ten en cuenta|Fíjate|Conviene|Primero)/.test(d), `${s}: consejo «${d}»`);
      assert.ok(!new RegExp(`(^|[^\\d,])${c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\d,])`).test(sinDuros(d)), `${s}: el dato «${d}» trae la respuesta ${c}`);
    }
  }
});

test('notación y lo que llega después: sin incentro, baricentro ni cuerdas; todo largo con su unidad; nada sin definir', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    const textos = [plano(p.enunciado), plano(p.pregunta), plano(p.solucion), ...p.datos, ...p.alternativas.map(a => a.texto), ...p.alternativas.filter(a => a.error).map(a => a.error.explicacion)].map(sinDuros);
    for (const t of textos) {
      assert.ok(!/incentro|baricentro|circunferencia|cuerda|mediana/i.test(t), `${s}: «${t}»`);
      assert.ok(!/\b(alternativa|opción) [A-E]\b/.test(t), `${s}: «${t}»`);
      assert.ok(!/NaN|undefined|Infinity|null/.test(t), `${s}: «${t}»`);
    }
    if (/ cm\b/.test(plano(p.enunciado)) && !['lll', 'ceva-razon', 'per-area', 'area', 'raices'].includes(p._datos.tipo)) for (const a of p.alternativas) assert.match(a.texto, / cm$/, `${s}: alternativa sin unidad «${a.texto}»`);
  }
});

test('igualdades escritas: toda cuenta «a op b = c» de la solución es cierta (400 semillas)', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), t = sinDuros(plano(p.solucion));
    for (const m of t.matchAll(/(?<![\d,A-Za-z(/]|· )((?:\d+(?:,\d+)? [−+·÷] )+\d+(?:,\d+)?) = (\d+(?:,\d+)?)(?![\d,/]| [−+·÷])/g)) {
      const expr = m[1].replace(/,/g, '.').replace(/−/g, '-').replace(/·/g, '*').replace(/÷/g, '/');
      assert.ok(casi(Function(`return (${expr})`)(), num(m[2]), 1e-6), `${s}: «${m[0]}» en «${t}»`);
    }
  }
});

test('las explicaciones de los distractores dan el valor de su error (rehecho aparte, 400 semillas por tipo)', () => {
  // Para cada tipo, el valor que produce cada error, rehecho desde el texto con la cuenta que dice su explicación.
  const ERR = {
    tres: t => ({ GE22: val(t, 'AB') * val(t, 'DE') / val(t, 'BC'), 'GE-THA1': val(t, 'DE') + val(t, 'BC') - val(t, 'AB'), 'GE-THA5': val(t, 'DE') * (val(t, 'AB') + val(t, 'BC')) / val(t, 'AB'), 'GE-THA2': val(t, 'BC') }),
    total: t => ({ GE22: val(t, 'DF') * val(t, 'AB') / val(t, 'BC'), 'GE-THA4': val(t, 'DF') / 2, 'GE-THA5': val(t, 'DF') * val(t, 'BC') / (val(t, 'AB') + val(t, 'BC')), 'GE-THA1': val(t, 'DF') - val(t, 'AB') - val(t, 'BC') }),
    sombra: t => { const [S, h, s] = nums(t); return { GE22: S * s / h, 'GE-SEM1': S + h - s, 'GE-SEM2': S, 'GE-SEM3': S / s }; },
    area: t => { const [k, S] = nums(t); return { GE1: S * k, GE2: S * k ** 3, 'GE-ARE2': 2 * S * k, 'GE-ARE3': S + k * k }; },
    raices: t => { const [a, b, c] = nums(t); return { 'GE-ARE5': Math.sqrt(a) + Math.sqrt(b) + Math.sqrt(c) }; },
  };
  for (const [tipo, f] of Object.entries(ERR)) for (let s = 0; s < 400; s++) {
    const p = gen.generar(s, { tipo }), t = sinDuros(plano(p.enunciado)), esp = f(t);
    for (const a of p.alternativas.filter(x => x.error && esp[x.error.id] !== undefined)) assert.ok(casi(num(a.texto.replace(/[^\d,]/g, '')), Math.round(esp[a.error.id] * 100) / 100, 0.006), `${tipo} ${s} ${a.error.id}: ${a.texto} contra ${esp[a.error.id]}`);
  }
});

test('casos.json: cada caso da su problema y su respuesta (calculada aparte)', () => {
  assert.ok(casos.casos.length >= 15 && casos.casos.length <= 30, `${casos.casos.length} casos`);
  for (const c of casos.casos) {
    const p = gen.generar(c.semilla, c.opciones || {});
    assert.equal(sinDuros(`${plano(p.enunciado)} ${plano(p.pregunta)}`), c.enunciado, `semilla ${c.semilla}`);
    if (typeof c.esperado.valor === 'string') assert.equal(p.respuesta.valor, c.esperado.valor);
    else assert.ok(casi(p.respuesta.valor, c.esperado.valor, casos.tolerancia), `semilla ${c.semilla}: ${p.respuesta.valor} y no ${c.esperado.valor}`);
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
  });
  assert.equal(ideas.size, 6, 'el papel cubre las seis ideas');
});

// Auditoría (cierre, 20 nov): los triángulos que describe la práctica existen (Ceva, Menelao, la x con Ceva, LLL) y el dato de
// Menelao no afirma el recíproco (con largos sin signo es falso: los tres puntos medios dan 1 y no están alineados).
test('auditoría: los triángulos de Ceva, Menelao y LLL existen (400 semillas por tipo); Menelao en un solo sentido', () => {
  const existe = (a, b, c) => a + b > c + 1e-9 && a + c > b + 1e-9 && b + c > a + 1e-9, mal = [];
  for (const tipo of ['ceva', 'menelao', 'ceva-x', 'lll']) for (let s = 0; s < 400; s++) {
    const p = gen.generar(`aud${s}`, { tipo }), d = p._datos;
    let tris = [];
    if (tipo === 'ceva') tris = [[d.a + d.b, d.c + d.d, d.e + p.respuesta.valor * 1]].map(t => [t[0], t[1], d.e + d.e * d.b * d.d / (d.a * d.c)]);
    if (tipo === 'menelao') tris = [[d.a + d.b, d.c + d.d, d.L]];
    if (tipo === 'ceva-x') tris = [[p.respuesta.valor, d.c + d.d, d.e1 + d.e2]];
    if (tipo === 'lll') tris = [d.T, d.o];
    for (const t of tris) if (!existe(...t)) mal.push(`${tipo} ${s}: ${t}`);
    if (tipo === 'menelao') assert.ok(!/alineados si/.test(p.datos.join(' ')), p.datos.join(' '));
  }
  assert.deepEqual(mal.slice(0, 8), []);
});
