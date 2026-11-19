// Pruebas de «Circunferencia y ángulos en ella» (práctica de geometria.circunferencia): casos.json (calculados aparte,
// con un script que no usa el generador), un recálculo independiente en 400 problemas por tipo (leyendo el enunciado; con
// coordenadas donde se puede), fugas, tipos por idea, el recuadro «Datos» en 400 semillas, notación y papel.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');

const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));
const sinDuros = t => String(t).replace(/[  ]/g, ' ');
const palabras = x => sinDuros(plano(x)).split(/\s+/).filter(w => /\p{L}/u.test(w)).length;
const RAD = Math.PI / 180;
const casi = (a, b, e = 1e-6) => Math.abs(a - b) < e;
const num = s => +String(s).replace(/ /g, '').replace(',', '.');
const nums = t => (sinDuros(t).match(/\d+(?: \d{3})*(?:,\d+)?/g) || []).map(num);
const pol = (g, r = 1) => [r * Math.cos(g * RAD), r * Math.sin(g * RAD)];
const ang = (V, A, B) => { const u = [A[0] - V[0], A[1] - V[1]], w = [B[0] - V[0], B[1] - V[1]]; return Math.acos(Math.max(-1, Math.min(1, (u[0] * w[0] + u[1] * w[1]) / (Math.hypot(...u) * Math.hypot(...w))))) / RAD; };
const corte = (A, B, C, D) => { const r = [B[0] - A[0], B[1] - A[1]], s = [D[0] - C[0], D[1] - C[1]], den = r[0] * s[1] - r[1] * s[0], t = ((C[0] - A[0]) * s[1] - (C[1] - A[1]) * s[0]) / den; return [A[0] + r[0] * t, A[1] + r[1] * t]; };
const busca = (f, lo, hi, paso = 1) => { for (let x = lo; x <= hi + 1e-9; x += paso) if (f(x)) return x; return NaN; };

// ---- Camino independiente: desde el texto del problema (coordenadas y fuerza bruta) ----
function recalcular(p) {
  const d = p._datos, t = sinDuros(plano(p.enunciado) + ' ' + plano(p.pregunta)), N = nums(t);
  switch (d.tipo) {
    case 'cuerda': { const [r, dd] = N; const y = -dd, x = Math.sqrt(r * r - y * y); return Math.hypot(2 * x, 0); }
    case 'tangente': { const [po, r] = N, T = pol(Math.acos(r / po) / RAD, r); return Math.hypot(po - T[0], T[1]); }
    case 'iso': { const g = N[0]; return ang(pol(0, 5), [0, 0], pol(g, 5)); }
    case 'flecha': { const [c, h] = N; return busca(r => casi(r * r, (c / 2) ** 2 + (r - h) ** 2), 1, 300); }
    case 'pitot': { const [AB, BC, CD] = N; return busca(x => AB + CD === BC + x, 1, 300); }
    case 'triangulo': { const [AB, BC, CA] = N, x = (AB * AB - CA * CA + BC * BC) / (2 * BC), A = [x, Math.sqrt(AB * AB - x * x)]; return (BC * A[0] + AB * BC) / (AB + BC + CA); }
    case 'poncelet': { const [a, b, c] = N; return a * b / (a + b + c); }
    // Con coordenadas: la circunferencia de radio r apoyada en la base mayor y tocando la base menor (altura 2r); se busca
    // el r con el que también toca el lado oblicuo (distancia del centro a esa recta = r), por bisección.
    case 'trapecio': { const [B, b] = N, f = r => { const P = [B / 2, 0], Q = [b / 2, 2 * r], O = [0, r]; return Math.abs((Q[0] - P[0]) * (P[1] - O[1]) - (P[0] - O[0]) * (Q[1] - P[1])) / Math.hypot(Q[0] - P[0], Q[1] - P[1]) - r; };
      let lo = 1e-3, hi = 500; for (let k = 0; k < 200; k++) { const m = (lo + hi) / 2; if (f(m) > 0) lo = m; else hi = m; } return Math.round(lo * 1e9) / 1e9; }
    case 'posicion': { const [r1, r2, dd] = N; return dd > r1 + r2 ? 'Exteriores' : dd === r1 + r2 ? 'Tangentes exteriores' : dd > r1 - r2 ? 'Secantes' : dd === r1 - r2 ? 'Tangentes interiores' : 'Interiores'; }
    case 'tocan': { const [r1, r2] = N; return /exteriores/.test(t) ? r1 + r2 : r1 - r2; }
    case 'radio': { const [dd, r1] = N; return /exteriores/.test(t) ? dd - r1 : r1 - dd; }
    case 'monedas': { const [a, b, c] = N; for (let x = 1; x < 40; x++) for (let y = x; y < 40; y++) for (let z = y; z < 40; z++) if (x + y === a && x + z === b && y + z === c) return /chica/.test(t) ? x : z; return NaN; }
    case 'inscrito': { const a = N[0]; return ang(pol(a + (360 - a) / 2), pol(0), pol(a)); }
    case 'semi': { const a = N[0], A = pol(270), B = pol(270 + a); return ang(A, [A[0] + 1, A[1]], B); }
    case 'menor': { const m = N[0]; return ang(pol(m / 2), pol(0), pol(m)); }
    case 'diametro': { const a = N[0], A = pol(0), B = pol(180), C = pol(180 - 2 * a); return ang(B, C, A); }
    case 'interior': { const [a, b] = N, A = pol(90 + a / 2), B = pol(90 - a / 2), C = pol(270 + b / 2), D = pol(270 - b / 2); return ang(corte(A, C, B, D), A, B); }
    case 'exterior': { const [L, c] = N, A = pol(180 - L / 2), D = pol(180 + L / 2), B = pol(c / 2), C = pol(-c / 2); return ang(corte(A, B, D, C), A, D); }
    case 'tangentes': { const c = N[0], T1 = pol(c / 2), T2 = pol(-c / 2); return ang(corte(T1, [T1[0] - T1[1], T1[1] + T1[0]], T2, [T2[0] - T2[1], T2[1] + T2[0]]), T1, T2); }
    case 'cercano': { const [x, L] = N; return busca(c => { const A = pol(180 - L / 2), D = pol(180 + L / 2), B = pol(c / 2), C = pol(-c / 2); return casi(ang(corte(A, B, D, C), A, D), x, 1e-6); }, 1, L - 1, 1); }
    // Con coordenadas: B en 0°, C y D repartiendo el arco que abarca el ángulo dado; se mide el ángulo pedido.
    case 'opuesto': { const m = /m∠([ABCD]) = (\d+)° y m∠([ABCD]) = (\d+)°\. ¿Cuánto mide m∠([ABCD])\?/.exec(t), dado = { [m[1]]: +m[2], [m[3]]: +m[4] }, op = { A: 'C', B: 'D', C: 'A', D: 'B' }, a = dado[op[m[5]]];
      // El vértice dado V ve el arco 2a entre sus vecinos; el pedido W queda en ese arco, a la mitad.
      const P = pol(0), Q = pol(2 * a), W = pol(a); return ang(W, P, Q); }
    case 'opuesto-x': { const m = /m∠A = (\d)?x \+ (\d+)° y m∠C = (\d)?x \+ (\d+)°/.exec(t), p = +(m[1] || 1), q = +(m[3] || 1), x = busca(x => p * x + +m[2] + q * x + +m[4] === 180, 0, 200); return p * x + +m[2]; }
    // Con coordenadas: A ve el arco BCD de 2a; C a la mitad de ese arco; se prolonga BC y se mide contra CD.
    case 'exterior-cic': { const a = N[0], B = pol(0), D = pol(2 * a), C = pol(a), E = [2 * C[0] - B[0], 2 * C[1] - B[1]]; return ang(C, E, D); }
    case 'inscriptible': { const [a, c] = N; return a + c === 180 ? 'si' : 'no'; }
    default: return NaN;
  }
}

probarGenerador(gen, { recalcular, igual: (a, b) => (typeof a === 'string' ? a === b : casi(a, b, 1e-6)) });
probarFugas(gen);

test('tipos por idea: las seis ideas de la unidad, todos los tipos generan y caen en su idea; niveles 1 a 3', () => {
  const teoria = require('../../contenido/teoria/geometria/circunferencia.js');
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

test('notación: m∠ (nunca «∠A = 40°»), x sin «°», todo largo con su unidad, explicaciones sin la letra de una alternativa', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    const textos = [plano(p.enunciado), plano(p.pregunta), plano(p.solucion), ...p.alternativas.map(a => a.texto), ...p.alternativas.filter(a => a.error).map(a => a.error.explicacion)].map(sinDuros);
    for (const t of textos) {
      assert.ok(!/(^|[^m])∠[A-HKMNOPQR]{1,3} = \d/.test(t), `${s}: «${t}»`);
      assert.ok(!/\bx = \d+(,\d+)?°/.test(t), `${s}: «${t}»`);
      assert.ok(!/\b(alternativa|opción) [A-E]\b/.test(t), `${s}: «${t}»`);
      assert.ok(!/NaN|undefined|Infinity/.test(t), `${s}: «${t}»`);
    }
    if (/ cm\b/.test(plano(p.enunciado)) && !p._datos.tipo.startsWith('posicion')) for (const a of p.alternativas) assert.match(a.texto, / cm$/, `${s}: alternativa sin unidad «${a.texto}»`);
  }
});

test('igualdades escritas: toda cuenta «a op b = c» de la solución es cierta (400 semillas)', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), t = sinDuros(plano(p.solucion));
    for (const m of t.matchAll(/(?<![\d,∠A-Za-z(])((?:\d+(?: \d{3})*(?:,\d+)?°? [−+·÷] )+\d+(?: \d{3})*(?:,\d+)?°?) = (\d+(?: \d{3})*(?:,\d+)?)(?![\d,]|°? [−+·÷])/g)) {
      const expr = m[1].replace(/°/g, '').replace(/(\d) (\d{3})/g, '$1$2').replace(/,/g, '.').replace(/−/g, '-').replace(/·/g, '*').replace(/÷/g, '/');
      assert.ok(casi(Function(`return (${expr})`)(), num(m[2]), 1e-6), `${s}: «${m[0]}» en «${t}»`);
    }
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

// ---------- Auditoría y lectores en frío (cierre, 19 nov; rutinas/auditoria/geometria.circunferencia.md) ----------
test('auditoría: ninguna explicación usa una fórmula que la unidad no da (área ÷ perímetro), 400 semillas', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(`pon${s}`, { tipo: 'poncelet' });
    for (const a of p.alternativas.filter(x => x.error)) assert.ok(!/[Áá]rea|perímetro/.test(a.error.explicacion) && a.error.id !== 'GE-PON5', `${s}: ${a.error.explicacion}`);
  }
});
test('lector B: para decir «no se puede inscribir», el dato trae la otra mitad («si no, no caben»)', () => {
  for (let s = 0; s < 100; s++) { const p = gen.generar(`ins${s}`, { tipo: 'inscriptible' }); assert.ok(p.datos.some(d => /si no, no caben/.test(d)), `${s}`); }
});
test('lector B: objetos creíbles: las tres son ruedas, no monedas de hasta 28 cm de diámetro', () => {
  for (let s = 0; s < 100; s++) { const t = plano(gen.generar(`mon${s}`, { tipo: 'monedas' }).enunciado); assert.ok(/ruedas/.test(t) && !/moneda/.test(t), t); }
});
