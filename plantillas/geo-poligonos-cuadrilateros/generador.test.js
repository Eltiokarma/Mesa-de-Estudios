// Pruebas de «Polígonos y cuadriláteros» (práctica de geometria.poligonos-y-cuadrilateros): casos.json (calculados aparte,
// con un script que no usa el generador), un recálculo independiente en 400 problemas (leyendo el enunciado; con
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
const ang = (V, P, Q) => { const u = [P[0] - V[0], P[1] - V[1]], w = [Q[0] - V[0], Q[1] - V[1]]; return Math.acos((u[0] * w[0] + u[1] * w[1]) / (Math.hypot(...u) * Math.hypot(...w))) / RAD; };
// La x que hace iguales p·x + q y x + s (probando enteros).
const xIgual = (p, q, s) => { for (let x = -50; x <= 100; x++) if (p * x + q === x + s) return x; return NaN; };

// ---- Camino independiente: desde el texto del problema ----
function recalcular(p) {
  const d = p._datos, t = sinDuros(plano(p.enunciado) + ' ' + plano(p.pregunta)), N = nums(t);
  switch (d.tipo) {
    // Triangulando de verdad: cuenta los triángulos que salen de un vértice en un polígono de N[0] lados.
    case 'suma': { let tri = 0; for (let k = 1; k < N[0] - 1; k++) tri++; return tri * 180; }
    case 'lados': { for (let n = 3; n < 200; n++) if ((n - 2) * 180 === N[0]) return n; return NaN; }
    case 'falta': { const n = N[0], dados = N.slice(2, 2 + n - 1); return (n - 2) * 180 - dados.reduce((a, b) => a + b, 0); }
    // Con coordenadas: un cuadrilátero con esos ángulos en A y B (C y D iguales a lo que sobra, repartido como sea).
    case 'bisectrices': { const [a, b] = N; return 180 - (360 - a - b) / 2; }
    case 'cada': { const n = N[0]; return /interior/.test(t) ? (n - 2) * 180 / n : 360 / n; }
    case 'n-interior': { for (let n = 3; n < 400; n++) if (casi((n - 2) * 180 / n, N[0])) return n; return NaN; }
    // Con coordenadas: se camina el hexágono girando 60° con los lados dados y DE, FA desconocidos que lo cierran.
    case 'hexagono': {
      const [ab, bc, cd, ef] = N;
      for (let de = 1; de < 40; de++) for (let fa = 1; fa < 40; fa++) {
        const L = [ab, bc, cd, de, ef, fa]; let x = 0, y = 0;
        L.forEach((l, k) => { x += l * Math.cos(k * 60 * RAD); y += l * Math.sin(k * 60 * RAD); });
        if (Math.hypot(x, y) < 1e-9) return L.reduce((a, c) => a + c, 0);
      }
      return NaN;
    }
    // Contando pares de vértices no vecinos uno por uno.
    case 'total': { const n = N[0]; let c = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (j - i !== 1 && !(i === 0 && j === n - 1)) c++; return c; }
    case 'n-diag': { for (let n = 4; n < 200; n++) if (n * (n - 3) / 2 === N[0]) return n; return NaN; }
    case 'mas-lados': { const [k, dl] = N; for (let n = 4; n < 200; n++) if ((n + k) * (n + k - 3) / 2 - n * (n - 3) / 2 === dl) return n; return NaN; }
    case 'ang-par': { const A = N[0], pide = /m∠(\w)\?/.exec(t.replace(/ /g, ''))[1]; return pide === 'C' ? A : 180 - A; }
    case 'diag-par': { const m = /AO = (\d*)x(?: ([−+]) (\d+))? y OC = x(?: ([−+]) (\d+))?/.exec(t); const p = +(m[1] || 1), q = m[2] ? (m[2] === '−' ? -1 : 1) * +m[3] : 0, s = m[4] ? (m[4] === '−' ? -1 : 1) * +m[5] : 0; return 2 * (p * xIgual(p, q, s) + q); }
    // Con coordenadas: el paralelogramo con AB y BC dados (A = 70°) y el corte de la bisectriz de A con BC.
    case 'bisectriz-par': {
      const [ab, bc] = N, A = [0, 0], B = [ab, 0], Dd = [bc * Math.cos(70 * RAD), bc * Math.sin(70 * RAD)], C = [B[0] + Dd[0], B[1] + Dd[1]];
      const u = [Math.cos(35 * RAD), Math.sin(35 * RAD)], w = [C[0] - B[0], C[1] - B[1]], det = u[0] * -w[1] - u[1] * -w[0];
      const s = (B[0] * -w[1] - B[1] * -w[0]) / det, E = [u[0] * s, u[1] * s];
      return Math.round(Math.hypot(C[0] - E[0], C[1] - E[1]) * 1e6) / 1e6;
    }
    // Con coordenadas: un rectángulo cuyas diagonales forman ese ángulo, y el ángulo OAB medido.
    case 'rect-ang': { const th = N[0], A = [-Math.cos((90 - th / 2) * RAD) * 0 - 1, 0], half = th / 2, O = [0, 1 / Math.tan(half * RAD)], B = [1, 0]; void A; return Math.round(ang([-1, 0], O, B) * 1e6) / 1e6; }
    case 'rombo-ang': { const a = N[0], A = [0, 0], B = [1, 0], Dd = [Math.cos(a * RAD), Math.sin(a * RAD)]; return Math.round(ang(B, A, Dd) * 1e6) / 1e6; }
    case 'cuad-eq': {
      const A = [0, 0], B = [1, 0], E = /Fuera/.test(t) ? [1 + Math.sin(60 * RAD), 0.5] : [1 - Math.sin(60 * RAD), 0.5];
      return Math.round(ang(A, B, E) * 1e6) / 1e6;
    }
    case 'mediana': return (N[0] + N[1]) / 2;
    case 'pq': return Math.abs(N[0] - N[1]) / 2;
    case 'base': return 2 * N[0] - N[1];
    // Con coordenadas: un trapecio cualquiera con esas bases y las tres paralelas medidas.
    case 'tres': { const [b, B] = N, h = 4, sh = 1.3, Bt = [sh, h], Ct = [sh + b, h], A = [0, 0], D = [B, 0]; let s = 0; for (const k of [1, 2, 3]) { const y = h * (1 - k / 4), xl = A[0] + (Bt[0] - A[0]) * (y / h), xr = D[0] + (Ct[0] - D[0]) * (y / h); s += xr - xl; } return Math.round(s * 1e6) / 1e6; }
    default: throw new Error(`tipo sin recálculo: ${d.tipo}`);
  }
}
const igual = (esperado, valor) => casi(esperado, valor, 1e-6);

probarGenerador(gen, { semillas: 400, recalcular, igual });
probarFugas(gen, { semillas: 1500 });

test('tipos por idea: las seis ideas de la unidad, todos los tipos generan y caen en su idea; niveles 1 a 3', () => {
  assert.deepEqual(Object.keys(gen.TIPOS_POR_IDEA), ['suma-de-angulos', 'angulos-exteriores', 'diagonales', 'paralelogramos', 'rectangulo-rombo-cuadrado', 'trapecios']);
  const teoria = require('../../contenido/teoria/geometria/poligonos-y-cuadrilateros.js');
  assert.deepEqual(Object.keys(gen.TIPOS_POR_IDEA), teoria.ideas.map(i => i.id), 'las mismas ideas que la teoría');
  for (const [idea, tipos] of Object.entries(gen.TIPOS_POR_IDEA)) {
    const vistos = new Set();
    for (let s = 0; s < 300; s++) { const p = gen.generar(s, { idea }); assert.equal(p._datos.idea, idea); vistos.add(p._datos.tipo); }
    assert.deepEqual([...vistos].sort(), [...tipos].sort(), idea);
  }
  const niveles = new Set(); for (let s = 0; s < 400; s++) niveles.add(gen.generar(s)._datos.nivel);
  assert.deepEqual([...niveles].sort(), [1, 2, 3]);
});

test('una sola correcta y cuatro alternativas distintas o más (400 semillas por tipo)', () => {
  for (const t of gen.TIPOS) for (let s = 0; s < 400; s++) {
    const p = gen.generar(s, { tipo: t }), tx = p.alternativas.map(a => a.texto);
    assert.equal(p.alternativas.filter(a => a.correcta).length, 1, `${t} ${s}`);
    assert.equal(new Set(tx).size, tx.length, `${t} ${s}: alternativas repetidas`);
    assert.ok(tx.length >= 4, `${t} ${s}`);
    assert.ok(casi(recalcular(p), p.respuesta.valor), `${t} ${s}: ${recalcular(p)} contra ${p.respuesta.valor}`);
    // Ningún distractor vale lo mismo que la correcta.
    for (const a of p.alternativas.filter(x => !x.correcta)) assert.ok(!casi(num(a.texto.replace(/[^\d ,]/g, '').trim()), p.respuesta.valor), `${t} ${s}`);
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
    const enCm = / cm\b/.test(plano(p.enunciado));
    for (const a of p.alternativas) if (enCm && /¿Cuánto mide (AC|EC|PQ|su mediana|la base|el perímetro)|suman las tres/.test(plano(p.pregunta))) assert.match(a.texto, / cm$/, `${s}: alternativa sin unidad «${a.texto}»`);
  }
});

test('igualdades escritas: toda cuenta «a op b = c» de la solución es cierta (400 semillas)', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), t = sinDuros(plano(p.solucion));
    // Cadenas enteras («360° − 95° − 105° = 160°»), de izquierda a derecha con · y ÷ primero.
    for (const m of t.matchAll(/(?<![\d,∠A-Za-z(])((?:\d+(?: \d{3})*(?:,\d+)?°? [−+·÷] )+\d+(?: \d{3})*(?:,\d+)?°?) = (\d+(?: \d{3})*(?:,\d+)?)(?![\d,]|°? [−+·÷])/g)) {
      const expr = m[1].replace(/°/g, '').replace(/(\d) (\d{3})/g, '$1$2').replace(/,/g, '.').replace(/−/g, '-').replace(/·/g, '*').replace(/÷/g, '/');
      const r = Function(`return (${expr})`)(), c = num(m[2]);
      assert.ok(casi(r, c, 1e-6), `${s}: «${m[0]}» en «${t}»`);
    }
  }
});

test('casos.json: cada caso da su problema y su respuesta (calculada aparte)', () => {
  assert.ok(casos.casos.length >= 15 && casos.casos.length <= 30, `${casos.casos.length} casos`);
  for (const c of casos.casos) {
    const p = gen.generar(c.semilla, c.opciones || {});
    assert.equal(sinDuros(`${plano(p.enunciado)} ${plano(p.pregunta)}`), c.enunciado, `semilla ${c.semilla}`);
    assert.ok(casi(p.respuesta.valor, c.esperado.valor, casos.tolerancia), `semilla ${c.semilla}: ${p.respuesta.valor} y no ${c.esperado.valor}`);
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

// Auditoría (19 nov, cierre delegado; rutinas/auditoria/geometria.poligonos-y-cuadrilateros.md).
test('auditoría M7: PQ trae en los datos que la mediana corta cada diagonal en su punto medio (400 semillas)', () => {
  for (let s = 0; s < 400; s++) { const p = gen.generar(s, { tipo: 'pq' }); assert.ok(p.datos.some(d => /corta cada diagonal en su punto medio/.test(d)), `${s}`); }
});
test('auditoría B7: el cuadrado con el equilátero de afuera no trae «la mitad de 15°» (no sale de ningún error)', () => {
  for (let s = 0; s < 400; s++) { const p = gen.generar(s, { tipo: 'cuad-eq' }); assert.ok(!p.alternativas.some(a => /^7,5°$/.test(a.texto)), `${s}`); }
});
