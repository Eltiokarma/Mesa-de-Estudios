// Pruebas propias de «Puntos notables del triángulo» (geometria.puntos-notables), etapa 9 del plan de calidad (26 nov
// 2026): las seis ideas contra su propuesta (docs/etapa9/propuesta-geometria.md). El validador con calidad 2 simulada;
// las misiones (sin cumplir al abrir, una sola salida en su grilla); las lecturas del juego medidas con coordenadas;
// todas las figuras caben y siguen la regla de colores (sin violeta ni verde); las respuestas de «Ahora tú» y «Así se
// resuelve» rehechas leyendo el texto (coordenadas y fuerza bruta, sin las cuentas de la unidad), con una sola correcta;
// los ejemplos de nivel 3 con una sola alternativa correcta y la letra repartida; nada que llegue después.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../../../nucleo/kit/kit.js');
const Teoria = require('../../../nucleo/teoria.js');
const def = require('./puntos-notables.js');

const PO = Kit.piezas['geo-objeto'];
const SEMILLAS = 400;
const plano = x => Teoria.plano(x);
const sinDuros = t => String(t).replace(/[  ]/g, ' ');
const C = require('../../../catalogo/cursos/geometria.json');
const FICHA = C.unidades.find(u => u.id === def.unidad);
const casi = (a, b, e = 1e-6) => Math.abs(a - b) < e;
const num = s => +String(s).replace(/[  ]/g, '').replace(',', '.');
const nums = t => (sinDuros(t).match(/\d+(?:,\d+)?/g) || []).map(num);
const val = (t, k) => { const m = new RegExp(`(?:^|[^A-Z])${k} = (\\d+(?:,\\d+)?)`).exec(t); return m ? num(m[1]) : NaN; };
const idea = id => def.ideas.find(i => i.id === id);
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);

// ---- Geometría propia de la prueba (no usa la unidad) ----
const tri = (c, b, a) => { const x = (a * a + c * c - b * b) / (2 * a); return [[x, Math.sqrt(c * c - x * x)], [0, 0], [a, 0]]; };
function centros(A, B, Cc) {
  const a = dist(B, Cc), b = dist(A, Cc), c = dist(A, B), n2 = p => p[0] ** 2 + p[1] ** 2;
  const D = 2 * (A[0] * (B[1] - Cc[1]) + B[0] * (Cc[1] - A[1]) + Cc[0] * (A[1] - B[1]));
  const O = [(n2(A) * (B[1] - Cc[1]) + n2(B) * (Cc[1] - A[1]) + n2(Cc) * (A[1] - B[1])) / D, (n2(A) * (Cc[0] - B[0]) + n2(B) * (A[0] - Cc[0]) + n2(Cc) * (B[0] - A[0])) / D];
  const s = a + b + c, w = -a + b + c;
  return { G: [(A[0] + B[0] + Cc[0]) / 3, (A[1] + B[1] + Cc[1]) / 3], O, H: [A[0] + B[0] + Cc[0] - 2 * O[0], A[1] + B[1] + Cc[1] - 2 * O[1]],
    I: [(a * A[0] + b * B[0] + c * Cc[0]) / s, (a * A[1] + b * B[1] + c * Cc[1]) / s], E: [(-a * A[0] + b * B[0] + c * Cc[0]) / w, (-a * A[1] + b * B[1] + c * Cc[1]) / w] };
}
const ang = (V, P, Q) => { const u = [P[0] - V[0], P[1] - V[1]], w = [Q[0] - V[0], Q[1] - V[1]]; return Math.acos(Math.max(-1, Math.min(1, (u[0] * w[0] + u[1] * w[1]) / Math.hypot(...u) / Math.hypot(...w)))) * 180 / Math.PI; };
const conAng = (A, B) => { const c = 10 * Math.sin((180 - A - B) * Math.PI / 180) / Math.sin(A * Math.PI / 180); return [[c * Math.cos(B * Math.PI / 180), c * Math.sin(B * Math.PI / 180)], [0, 0], [10, 0]]; };
const pie = (P, X, Y) => { const d = [Y[0] - X[0], Y[1] - X[1]], t = ((P[0] - X[0]) * d[0] + (P[1] - X[1]) * d[1]) / (d[0] ** 2 + d[1] ** 2); return [X[0] + d[0] * t, X[1] + d[1] * t]; };
const area = (P, Q, R) => Math.abs((Q[0] - P[0]) * (R[1] - P[1]) - (R[0] - P[0]) * (Q[1] - P[1])) / 2;
const dentro = (P, A, B, Cc) => Math.abs(area(A, B, P) + area(B, Cc, P) + area(Cc, A, P) - area(A, B, Cc)) < 1e-9;
const lugar = (P, A, B, Cc) => { if ([A, B, Cc].some(V => dist(P, V) < 1e-9)) return 'vertice'; if ([[A, B], [B, Cc], [Cc, A]].some(([X, Y]) => casi(dist(P, X) + dist(P, Y), dist(X, Y), 1e-9))) return 'lado'; return dentro(P, A, B, Cc) ? 'dentro' : 'fuera'; };
const busca = (f, lo, hi, paso) => { for (let x = lo; x <= hi + 1e-9; x += paso) { const r = f(+x.toFixed(4)); if (r !== undefined) return r; } return NaN; };

// Lo que pide «Ahora tú» o «Así se resuelve», rehecho desde el texto: un número o una palabra (dentro, fuera, lado, vértice, centro).
function rehacer(t) {
  t = sinDuros(t); const N = nums(t), q = (t.match(/¿[^?]*\?/g) || []).pop() || '';
  const A0 = [2, 7], B0 = [0, 0], C0 = [9, 0], M0 = [4.5, 0], X0 = centros(A0, B0, C0);
  const lados3 = () => tri(val(t, 'AB'), val(t, 'AC'), val(t, 'BC'));
  if (/mediana AM mide/.test(t) && /mide AG\?/.test(q)) return dist(A0, X0.G) * N[0] / dist(A0, M0);
  if (/GM = \d/.test(t) && /mide AM\?/.test(q)) return dist(A0, M0) * val(t, 'GM') / dist(X0.G, M0);
  if (/BG = \d/.test(t) && /GN\?/.test(q)) return val(t, 'BG') / 2;
  if (/AG = x \+ (\d+) y GM = x/.test(t)) { const p = +/AG = x \+ (\d+)/.exec(t)[1]; return busca(x => (casi(x + p, 2 * x) ? 3 * x : undefined), 1, 50, 1); }
  if (/AG = 3x − (\d+) y GM = x \+ (\d+)/.test(t)) { const [, p, r] = /AG = 3x − (\d+) y GM = x \+ (\d+)/.exec(t).map(Number); return busca(x => (casi(3 * x - p, 2 * (x + r)) ? 3 * x - p : undefined), 1, 80, 1); }
  if (/seis triángulos/.test(t) && /uno de ellos/.test(q)) return N[0] / 6;
  if (/área del triángulo AGC/.test(q)) return N[0] * area(A0, X0.G, C0) / area(A0, B0, C0);
  if (/área del triángulo BGC/.test(q)) return N[0] * area(B0, X0.G, C0) / area(A0, B0, C0);
  if (/área del triángulo BGM/.test(q)) return N[0] * area(B0, X0.G, M0) / area(A0, B0, C0);
  if (/hipotenusa AC mide/.test(t) && /BG\?|distancia de B/.test(q)) { const h = N[0], A = [0, 6], B = [0, 0], Cc = [8, 0]; return dist(B, centros(A, B, Cc).G) * h / 10; }
  if (/hipotenusa AC mide/.test(t) && /GH\?/.test(q)) { const h = N[0], A = [0, 6], B = [0, 0], Cc = [8, 0], X = centros(A, B, Cc); return dist(X.G, X.H) * h / 10; }
  if (/cartulina triangular ABC tiene la mediana AM/.test(t)) return dist(A0, X0.G) * N[0] / dist(A0, M0);
  // Circuncentro
  if (/catetos de (\d+) (cm|m) y (\d+) (cm|m)/.test(t) && /circunradio|cada esquina/.test(q)) { const A = [0, N[0]], B = [0, 0], Cc = [N[1], 0]; return dist(centros(A, B, Cc).O, A); }
  if (/circuncentro/.test(t) && /ángulo BOC\?/.test(q)) { const [A, B, Cc] = conAng(N[0], (180 - N[0]) / 2 + 6); return ang(centros(A, B, Cc).O, B, Cc); }
  if (/m∠BOC = (\d+)/.test(t) && /ángulo A\?/.test(q)) return busca(a => { const [A, B, Cc] = conAng(a, (180 - a) / 2); return Math.abs(ang(centros(A, B, Cc).O, B, Cc) - N[0]) < 0.01 ? a : undefined; }, 0.5, 89.5, 0.5);
  if (/circuncentro/.test(t) && /ángulo OBC\?/.test(q)) { const [A, B, Cc] = conAng(N[0], (180 - N[0]) / 2 + 6); return ang(B, centros(A, B, Cc).O, Cc); }
  if (/Dos ángulos de un triángulo miden (\d+)° y (\d+)°/.test(t)) {
    const [A, B, Cc] = conAng(N[0], N[1]), X = centros(A, B, Cc), P = /circuncentro/.test(q) ? X.O : X.H;
    return lugar(P, A, B, Cc);
  }
  // Incentro
  if (/toca AB en F/.test(t) && /AF\?/.test(q)) { const [A, B, Cc] = lados3(); return dist(A, pie(centros(A, B, Cc).I, A, B)); }
  if (/radio de su inscrita\?|radio del círculo más grande/.test(q) && /hipotenusa (AC = )?de (\d+)|hipotenusa de/.test(t)) { const A = [0, N[0]], B = [0, 0], Cc = [N[1], 0], I = centros(A, B, Cc).I; return I[1]; }
  if (/rectángulo en B, con AB = \d+ cm, BC = \d+ cm y AC = \d+ cm/.test(t)) { const A = [0, val(t, 'AB')], B = [0, 0], Cc = [val(t, 'BC'), 0]; return centros(A, B, Cc).I[1]; }
  if (/cm de perímetro y su inscrita tiene radio/.test(t)) return N[0] * N[1] / 2;
  if (/toca BC en D, AB en F y AC en K/.test(t) && /AC\?/.test(q)) {
    const bd = val(t, 'BD'), dc = val(t, 'DC'), ab = val(t, 'AB'), a = bd + dc;
    return busca(b => { if (!(a < b + ab && b < a + ab && ab < a + b)) return undefined; const [A, B, Cc] = tri(ab, b, a); return casi(dist(B, pie(centros(A, B, Cc).I, B, Cc)), bd, 1e-6) ? b : undefined; }, 0.5, 40, 0.5);
  }
  // Ortocentro
  if (/ortocentro|alturas/.test(t) && /ángulo BHC\?/.test(q)) { const [A, B, Cc] = conAng(N[0], (180 - N[0]) / 2 + 6); return ang(centros(A, B, Cc).H, B, Cc); }
  if (/m∠BHC = (\d+)/.test(t) && /ángulo A\?/.test(q)) return busca(a => { const [A, B, Cc] = conAng(a, (180 - a) / 2); return Math.abs(ang(centros(A, B, Cc).H, B, Cc) - N[0]) < 0.01 ? a : undefined; }, 0.5, 89.5, 0.5);
  if (/m∠C = (\d+)/.test(t) && /ángulo HBC\?/.test(q)) { const c = N[0], b = c / 2 + 20, [A, B, Cc] = conAng(180 - c - b, b); return ang(B, centros(A, B, Cc).H, Cc); }
  if (/recta AH corta BC en P/.test(t) && /AP\?/.test(q)) return Math.sqrt(val(t, 'AB') ** 2 - val(t, 'BP') ** 2);
  // Excentro
  if (/exinscrita relativa a BC toca la prolongación de AB en T/.test(t) && /(AT|BT)\?/.test(q)) {
    const [A, B, Cc] = lados3(), T = pie(centros(A, B, Cc).E, A, B); return /AT\?/.test(q) ? dist(A, T) : dist(B, T);
  }
  if (/exinscrita relativa a BC toca la prolongación de AB en T y el lado BC en D/.test(t) && /BD\?/.test(q)) { const [A, B, Cc] = lados3(); return dist(B, pie(centros(A, B, Cc).E, B, Cc)); }
  if (/glorieta toca la avenida BC/.test(t) && /BT\?/.test(q)) { const [A, B, Cc] = lados3(); return dist(B, pie(centros(A, B, Cc).E, A, B)); }
  if (/excentro relativo a BC/.test(t) && /m∠A = (\d+)/.test(t) && /ángulo BEC\?/.test(q)) { const [A, B, Cc] = conAng(N[0], (180 - N[0]) / 2); return ang(centros(A, B, Cc).E, B, Cc); }
  if (/m∠BEC = (\d+)/.test(t) && /ángulo A\?/.test(q)) return busca(a => { const [A, B, Cc] = conAng(a, (180 - a) / 2); return Math.abs(ang(centros(A, B, Cc).E, B, Cc) - N[0]) < 0.01 ? a : undefined; }, 1, 179, 1);
  if (/m∠BIC = (\d+)/.test(t) && /ángulo BEC\?/.test(q)) { const a = busca(a => { const [A, B, Cc] = conAng(a, (180 - a) / 2); return Math.abs(ang(centros(A, B, Cc).I, B, Cc) - N[0]) < 0.01 ? a : undefined; }, 1, 179, 1); const [A, B, Cc] = conAng(a, (180 - a) / 2); return ang(centros(A, B, Cc).E, B, Cc); }
  // Euler: un triángulo cualquiera (no equilátero), escalado al dato.
  const [EA, EB, EC] = conAng(70, 50), XE = centros(EA, EB, EC), NE = [(XE.O[0] + XE.H[0]) / 2, (XE.O[1] + XE.H[1]) / 2], R9 = dist(NE, [5, 0]);
  if (/OG = (\d+)/.test(t) && /GH\?/.test(q)) return dist(XE.G, XE.H) * N[0] / dist(XE.O, XE.G);
  if (/OG = (\d+)/.test(t) && /OH\?/.test(q)) return dist(XE.O, XE.H) * N[0] / dist(XE.O, XE.G);
  if (/GH = (\d+)/.test(t) && /OH\?/.test(q)) return dist(XE.O, XE.H) * N[0] / dist(XE.G, XE.H);
  if (/OH = (\d+)/.test(t) && /OG\?/.test(q)) return dist(XE.O, XE.G) * N[0] / dist(XE.O, XE.H);
  if (/OH = (\d+)/.test(t) && /OG y GH\?/.test(q)) return dist(XE.G, XE.H) * N[0] / dist(XE.O, XE.H);
  if (/circunradio de un triángulo mide/.test(t)) { const k = N[0] / dist(XE.O, EA); return /diámetro/.test(q) ? 2 * R9 * k : R9 * k; }
  if (/hipotenusa mide (\d+) cm/.test(t) && /OH/.test(q)) { const A = [0, 6], B = [0, 0], Cc = [8, 0], X = centros(A, B, Cc); return dist(X.O, X.H) * N[0] / 10; }
  if (/punto notable del triángulo es\?/.test(q)) return /distancia de tres pueblos/.test(t) ? 'circuncentro' : /tres muros/.test(t) ? 'incentro' : /equilibrio/.test(t) ? 'baricentro' : 'ortocentro';
  return NaN;
}
const LUG = { dentro: /^Dentro/, fuera: /^Fuera/, lado: /punto medio|^En el punto medio/, vertice: /vértice/ };
const esLa = (r, texto) => (typeof r === 'string' ? (LUG[r] ? LUG[r].test(texto) : texto.toLowerCase().includes(r)) : casi(nums(texto).pop(), r, 0.006));

test('las seis ideas de la propuesta, en orden; las tres mesas de antes; la ficha pide Circunferencia y Proporcionalidad', () => {
  assert.deepEqual(def.ideas.map(i => i.id), ['baricentro', 'circuncentro', 'incentro', 'ortocentro', 'excentro', 'euler']);
  assert.deepEqual(def.laboratorio.map(m => m.id), ['cuatro-centros', 'euler-libre', 'seis-areas']);
  assert.deepEqual(FICHA.requiere, ['geometria.circunferencia', 'geometria.proporcionalidad-y-semejanza']);
  assert.equal(FICHA.plantillas[0], 'geo-puntos-notables');
});

test('pasaría el validador con calidad 2 (200 semillas), sin excepciones; 15 ejemplos por idea, 5 por nivel', () => {
  const p = Teoria.problemas(Object.assign({}, def, { calidad: 2 }), { temas: FICHA.temas, semillas: 200 });
  assert.deepEqual(p, [], p.join('\n'));
  for (const i of def.ideas) for (const n of [1, 2, 3]) assert.equal(i.ejemplos.filter(e => e.nivel === n).length, 5, `${i.id} nivel ${n}`);
});

test('nivel 3: una sola alternativa vale la respuesta, y la letra correcta se reparte (ninguna pasa del 40 %, ninguna falta)', () => {
  const letras = [];
  for (const i of def.ideas) for (const e of i.ejemplos.filter(x => x.alternativas)) {
    const r = plano(e.respuesta), rn = nums(r).pop();
    const k = e.alternativas.map((a, j) => (rn !== undefined && /\d/.test(a) ? (casi(nums(a).pop(), rn, 0.006) ? j : -1) : (r.toLowerCase().includes(a.toLowerCase().replace(/^el /, '')) ? j : -1))).filter(j => j >= 0);
    assert.equal(k.length, 1, `${i.id} «${e.titulo}»: ${k.length} alternativas valen ${r}`);
    letras.push('ABCDE'[k[0]]);
  }
  for (const L of 'ABCDE') { const n = letras.filter(x => x === L).length; assert.ok(n > 0 && n / letras.length <= 0.4, `${L}: ${n} de ${letras.length}`); }
});

test('las misiones: sin cumplir al abrir; en su grilla se cumplen solo donde dice la propuesta', () => {
  const grilla = (j, f) => { const ids = j.controles.map(c => c.id), out = [];
    const rec = (k, v) => { if (k === ids.length) { if (j.mision.logrado(v)) out.push(f(v)); return; } const c = j.controles[k]; for (let x = c.min; x <= c.max + 1e-9; x += c.paso) rec(k + 1, Object.assign({}, v, { [c.id]: +x.toFixed(4) })); };
    rec(0, {}); return out; };
  const inicio = j => Object.fromEntries(j.controles.map(c => [c.id, c.inicio]));
  for (const i of def.ideas) assert.ok(!i.juega.mision.logrado(inicio(i.juega)), `${i.id}: cumplida al abrir`);
  const [A1, B1, C1] = [[3, 9], [0, 0], [12, 0]];
  assert.deepEqual(grilla(idea('baricentro').juega, v => [v.px, v.py]), [centros(A1, B1, C1).G]);
  assert.deepEqual(grilla(idea('circuncentro').juega, v => [v.px, v.py]), [centros([20, 60], [0, 0], [80, 0]).O].map(p => p.map(x => +x.toFixed(9))));
  const X = centros([0, 16], [0, 0], [12, 0]);
  assert.deepEqual(grilla(idea('incentro').juega, v => [v.px, v.py, v.r]), [[...X.I, 4]]);
  assert.deepEqual(grilla(idea('excentro').juega, v => [v.px, v.py, v.r]), [[...X.E, 8]]);
  for (const v of grilla(idea('ortocentro').juega, v => v)) { const H = centros([v.ax, v.ay], [0, 0], [12, 0]).H; assert.ok([[0, 0], [12, 0]].some(P => dist(H, P) < 1e-9)); }
  for (const v of grilla(idea('euler').juega, v => v)) assert.ok(casi(dist([v.ax, v.ay], [0, 0]), dist([v.ax, v.ay], [8, 0])));
});

test('las lecturas del juego dicen una relación verdadera en toda la grilla (medida con coordenadas)', () => {
  const todas = j => { const out = []; const rec = (k, v) => { if (k === j.controles.length) { out.push(v); return; } const c = j.controles[k]; if (c.opciones) { for (const o of c.opciones) rec(k + 1, Object.assign({}, v, { [c.id]: o.valor })); return; } for (let x = c.min; x <= c.max + 1e-9; x += c.paso) rec(k + 1, Object.assign({}, v, { [c.id]: +x.toFixed(4) })); }; rec(0, {}); return out; };
  const L = (i, v) => sinDuros(plano(idea(i).juega.lectura(v)));
  // Idea 1: se inclina hacia donde está G, visto desde la punta.
  const [A1, B1, C1] = [[3, 9], [0, 0], [12, 0]], G1 = centros(A1, B1, C1).G;
  for (const v of todas(idea('baricentro').juega)) {
    const P = [v.px, v.py], t = L('baricentro', v);
    if (!dentro(P, A1, B1, C1)) { assert.match(t, /fuera/); continue; }
    if (dist(P, G1) < 1e-9) { assert.match(t, /No se cae/); continue; }
    const m = /hacia (la esquina|el lado) ([A-C]{1,2})/.exec(t); assert.ok(m, t);
    const X = m[2].length === 1 ? { A: A1, B: B1, C: C1 }[m[2]] : [({ A: A1, B: B1, C: C1 }[m[2][0]][0] + { A: A1, B: B1, C: C1 }[m[2][1]][0]) / 2, ({ A: A1, B: B1, C: C1 }[m[2][0]][1] + { A: A1, B: B1, C: C1 }[m[2][1]][1]) / 2];
    const u = [G1[0] - P[0], G1[1] - P[1]], w = [X[0] - P[0], X[1] - P[1]];
    assert.ok(u[0] * w[0] + u[1] * w[1] > 0, `${P}: «${t}» no va hacia G`);
  }
  // Idea 2: las distancias escritas son las de verdad.
  for (const v of todas(idea('circuncentro').juega)) {
    const P = [v.px, v.py], t = L('circuncentro', v), d = { A: dist(P, [20, 60]), B: dist(P, [0, 0]), C: dist(P, [80, 0]) };
    for (const m of t.matchAll(/P([ABC]) = (?:P[ABC] = )*(\d+(?:,\d+)?) m/g)) assert.ok(casi(d[m[1]], num(m[2]), 0.006), t);
    const m = /más corto es P([ABC]), de (\d+(?:,\d+)?) m; el más largo, P([ABC])/.exec(t);
    if (m) { assert.ok(casi(Math.min(...Object.values(d)), d[m[1]]) && casi(num(m[2]), d[m[1]], 0.006) && casi(Math.max(...Object.values(d)), d[m[3]]), t); }
  }
  // Ideas 3 y 5: qué veredas toca y cuánto le falta.
  const lados = { AB: [[0, 16], [0, 0]], BC: [[0, 0], [12, 0]], CA: [[12, 0], [0, 16]] };
  for (const id of ['incentro', 'excentro']) for (const v of todas(idea(id).juega)) {
    const P = [v.px, v.py], t = L(id, v), d = Object.fromEntries(Object.entries(lados).map(([k, [X, Y]]) => [k, dist(P, pie(P, X, Y))]));
    if (/Toca las tres/.test(t)) for (const x of Object.values(d)) assert.ok(casi(x, v.r), t);
    const m = /a (AB|BC|CA) le faltan (\d+(?:,\d+)?) m/.exec(t); if (m) assert.ok(casi(d[m[1]] - v.r, num(m[2]), 0.006), t);
  }
  // Idea 4: H dentro o en un vértice, como dice la lectura.
  for (const v of todas(idea('ortocentro').juega)) {
    const A = [v.ax, v.ay], H = centros(A, [0, 0], [12, 0]).H, t = L('ortocentro', v);
    if (/dentro/.test(t)) assert.ok(dentro(H, A, [0, 0], [12, 0]) && ![A, [0, 0], [12, 0]].some(V => dist(V, H) < 1e-9), t);
    else assert.ok([[0, 0], [12, 0]].some(V => dist(V, H) < 1e-9), t);
  }
});

test('todas las figuras caben y sus rótulos no se pisan; sin violeta ni verde en ninguna figura', () => {
  const figs = [];
  const toma = (f, donde) => { if (f && f.datos && f.datos.objeto) figs.push([f.datos, donde, f.estado]); else if (f && f.objeto) figs.push([f, donde]); };
  for (const i of def.ideas) {
    (i.lee.tarjetas || []).forEach((t, k) => toma(t.dibujo, `${i.id} lee ${k}`));
    const j = i.juega, v = Object.fromEntries(j.controles.map(c => [c.id, c.inicio]));
    toma(j.dibujo(v), `${i.id} juega`);
    toma(i.predice.dibujo, `${i.id} predice`); toma(i.predice.revelar, `${i.id} revelar`);
    i.mira.pasos.forEach((p, k) => figs.push([i.mira.datos, `${i.id} mira ${k}`, p.estado]));
    toma(i.regla.dibujo, `${i.id} regla`);
    i.ejemplos.forEach((e, k) => toma(e.figura, `${i.id} ejemplo ${k + 1}`));
    for (let s = 0; s < 12; s++) { const r = i.resuelve.generar(s); toma(r.dibujo, `${i.id} resuelve ${s}`); for (const p of r.pasos) toma(p.dibujo, `${i.id} resuelve ${s} paso`); }
  }
  assert.ok(figs.length > 100);
  for (const [F, donde, estado] of figs) {
    const corte = estado && estado.corte !== undefined ? estado.corte : Infinity;
    assert.ok(PO.escenaCabe(F, corte), `${donde}: un rótulo no cabe o pisa algo`);
    const txt = JSON.stringify(F);
    assert.ok(!/"color":"(f|d|c-f|c-d)"/.test(txt), `${donde}: violeta o verde en la figura`);
    for (const m of txt.matchAll(/"texto":"\?","color":"([^"]+)"/g)) assert.fail(`${donde}: «?» en color ${m[1]}`);
  }
});

test('«Ahora tú»: la correcta rehecha desde el texto (400 semillas por idea); una sola correcta; opciones distintas', () => {
  for (const i of def.ideas) for (let s = 0; s < SEMILLAS; s++) {
    const c = i.ahoraTu.generar(s), t = plano(c.pregunta), r = rehacer(t);
    assert.ok(typeof r === 'string' || Number.isFinite(r), `${i.id} ${s}: no se pudo rehacer «${t}»`);
    const ok = c.opciones.filter(o => esLa(r, o.texto));
    assert.equal(ok.length, 1, `${i.id} ${s}: ${ok.length} opciones valen ${r} en «${t}»`);
    assert.ok(ok[0].correcta, `${i.id} ${s}: la correcta no es ${r} en «${t}»`);
    assert.equal(new Set(c.opciones.map(o => o.texto)).size, c.opciones.length);
    assert.ok(c.datos && c.datos.length);
  }
});

test('«Así se resuelve»: la respuesta rehecha desde el enunciado (400 semillas por idea); no repite «Ahora tú»', () => {
  for (const i of def.ideas) {
    const ahora = new Set(); for (let s = 0; s < 12; s++) ahora.add(plano(i.ahoraTu.generar(s).pregunta));
    for (let s = 0; s < SEMILLAS; s++) {
      const r = i.resuelve.generar(s), t = plano(r.enunciado), x = rehacer(t), resp = plano(r.respuesta);
      assert.ok(typeof x === 'string' || Number.isFinite(x), `${i.id} ${s}: no se pudo rehacer «${t}»`);
      assert.ok(esLa(x, resp), `${i.id} ${s}: «${resp}» contra ${x} en «${t}»`);
      if (s < 4) assert.ok(!ahora.has(t), `${i.id} ${s}: repite «Ahora tú»`);
    }
  }
});

test('toda cuenta escrita «a op b = c» de las soluciones, pasos y ejemplos es cierta (400 semillas)', () => {
  const re = /(\d+(?:,\d+)?)\s*([+−·÷])\s*(\d+(?:,\d+)?)\s*=\s*(\d+(?:,\d+)?)/g;
  const revisa = (t, donde) => {
    t = sinDuros(t).replace(/°/g, '').replace(/ (cm²|cm|m²|m)\b/g, '');
    for (const m of t.matchAll(re)) {
      const antes = t.slice(Math.max(0, m.index - 3), m.index);
      if (/[a-zA-Z(+−÷·²]\s*$/.test(antes) || /^[²]/.test(t.slice(m.index + m[0].length))) continue;
      const a = num(m[1]), b = num(m[3]), c = num(m[4]), r = { '+': a + b, '−': a - b, '·': a * b, '÷': a / b }[m[2]];
      assert.ok(Math.abs(r - c) < 0.006, `${donde}: «${m[0]}» es falsa`);
    }
  };
  for (const i of def.ideas) {
    for (let s = 0; s < SEMILLAS; s++) {
      const c = i.ahoraTu.generar(s); revisa(plano(c.solucion.texto) + ' ' + plano(c.solucion.ecuacion || ''), `${i.id} ahora ${s}`);
      const r = i.resuelve.generar(s); for (const p of r.pasos) revisa(plano(p.texto) + ' ' + plano(p.ecuacion || ''), `${i.id} resuelve ${s}`);
    }
    i.ejemplos.forEach((e, k) => e.solucion.forEach(p => revisa(plano(p.texto) + ' ' + plano(p.ecuacion || ''), `${i.id} ejemplo ${k + 1}`)));
  }
});

test('nada que llegue después: ni Stewart, ni Herón, ni coordenadas, ni la potencia de un punto', () => {
  const t = JSON.stringify(def.ideas.map(i => [i.lee, i.predice, i.mira, i.regla, i.ejemplos.map(e => [e.enunciado, e.datos, e.solucion])]));
  for (const w of [/Stewart/, /Her[oó]n/, /coordenadas/, /potencia de un punto/i, /Ptolomeo/]) assert.ok(!w.test(t), String(w));
});

test('lección 5: la predicción de la idea 3 se dibuja sin dejar medir AF (otras proporciones y el aviso)', () => {
  const F = idea('incentro').predice.dibujo.datos, P = Object.fromEntries(PO.escena(F).fig.puntos.map(q => [q.id, [q.x, q.y]]));
  assert.ok(Math.abs(dist(P.A, P.F) / dist(P.A, P.B) - 3 / 7) > 0.08, 'AF/AB dibujado igual que el de verdad');
  assert.match(plano(idea('incentro').predice.pregunta), /no está a escala/);
});

// ---- Cierre del 26 nov (auditoría y lectores en frío): cada prueba falla con la versión anterior ----

// Lo pedido no se mide en el dibujo: con la escala de los rótulos y de los lados del enunciado (si son coherentes entre sí,
// a 15 %), la medida del «?» (un tramo, un ángulo o el radio) se aleja más de 15 % de la respuesta. Se exceptúa lo que
// sale de la regla misma (G a dos tercios de la mediana, OC = OA, AK = AF, GH = 2 · OG), y ahí no se dice «no está a escala».
const REGLA_EJ = new Set(['Del vértice al baricentro', 'El tramo corto dado', 'La escuadra de cartón', 'Tres postes y un foco', 'Dos tangentes desde A']);
const REGLA_RES = { baricentro: [0, 1], euler: [0] };
function medible(F, texto, resp) {
  const D = F.datos || F, P = Object.fromEntries(PO.escena(D).fig.puntos.map(q => [q.id, [q.x, q.y]])), ds = (a, b) => dist(P[a], P[b]);
  const k = [];
  for (const m of sinDuros(texto).matchAll(/\b([A-Z])([A-Z]) = (\d+(?:,\d+)?) (?:cm|m)\b/g)) if (P[m[1]] && P[m[2]]) k.push(num(m[3]) / ds(m[1], m[2]));
  let preg = null;
  for (const r of [...(D.ladosRot || []), ...(D.llaves || [])]) {
    if (!P[r.de] || !P[r.a]) continue;
    const t = sinDuros(plano(r.texto || '')), m = /^(\d+(?:,\d+)?) ?(cm|m)$/.exec(t);
    if (m) k.push(num(m[1]) / ds(r.de, r.a)); if (t === '?') preg = r;
  }
  const R = sinDuros(plano(resp)), ma = /m∠([A-Z])([A-Z])([A-Z]) = (\d+(?:,\d+)?)°/.exec(R);
  if (ma && P[ma[1]] && P[ma[2]] && P[ma[3]]) { const v = num(ma[4]); return Math.abs(ang(P[ma[2]], P[ma[1]], P[ma[3]]) - v) / v < 0.15 ? `∠${ma.slice(1, 4).join('')}` : null; }
  if (!k.length || (k.length > 1 && Math.max(...k) / Math.min(...k) > 1.15)) return null;
  const esc = k.reduce((a, b) => a + b) / k.length, v = nums(R).pop();
  const mr = /^(r|R) = /.test(R) && (D.figura.circulos || [])[0];
  if (mr) return Math.abs(mr.r * esc - v) / v < 0.15 ? 'el radio' : null;
  if (preg && /(cm|m)$/.test(R) && !/²/.test(R)) return Math.abs(ds(preg.de, preg.a) * esc - v) / v < 0.15 ? `${preg.de}${preg.a}` : null;
  return null;
}
test('cierre: lo pedido no se mide en el dibujo, y «no está a escala» solo va cuando es cierto (y con dibujo)', () => {
  for (const i of def.ideas) {
    i.ejemplos.forEach((e, n) => {
      const t = plano(e.enunciado), dice = /no está a escala/.test(t), donde = `${i.id} ejemplo ${n + 1} «${e.titulo}»`;
      if (!e.figura) { assert.ok(!dice, `${donde}: «no está a escala» sin dibujo`); return; }
      const m = medible(e.figura, t, e.respuesta);
      if (REGLA_EJ.has(e.titulo)) assert.ok(!dice, `${donde}: está a escala y dice que no`);
      else assert.ok(!m, `${donde}: ${m} se mide en el dibujo`);
    });
    for (let s = 0; s < 200; s++) {
      const r = i.resuelve.generar(s), t = plano(r.enunciado), dice = /no está a escala/.test(t);
      if (!r.dibujo) { assert.ok(!dice, `${i.id} resuelve ${s}: «no está a escala» sin dibujo`); continue; }
      if ((REGLA_RES[i.id] || []).includes(s % 3)) { assert.ok(!dice, `${i.id} resuelve ${s}: está a escala y dice que no`); continue; }
      const m = medible(r.dibujo, t, r.respuesta);
      assert.ok(!m, `${i.id} resuelve ${s}: ${m} se mide en el dibujo («${t}»)`);
    }
  }
});

test('cierre: los Datos de «Ahora tú» dan herramientas, no la relación que se practica (lector B)', () => {
  const regalo = { ortocentro: /180° − m∠A/, excentro: /90° − m∠A ÷ 2|AT = s/, euler: /equidista/ };
  for (const i of def.ideas) for (let s = 0; s < 200; s++) {
    const c = i.ahoraTu.generar(s), q = plano(c.pregunta), d = c.datos.map(plano).join(' ');
    if (i.id === 'ortocentro' && /ángulo BHC\?|ángulo A\?/.test(q)) assert.ok(!regalo.ortocentro.test(d), `${s}: ${d}`);
    if (i.id === 'excentro' && /m∠A = \d+°.*BEC\?|m∠BEC = \d+°.*ángulo A\?/.test(q)) assert.ok(!/90° − m∠A ÷ 2/.test(d), `${s}: ${d}`);
    if (i.id === 'excentro') assert.ok(!/AT\?/.test(q), `${s}: pide AT, que los Datos dan hecho`);
    if (i.id === 'euler') { assert.ok(!(/OG = \d/.test(q) && /GH\?/.test(q)), `${s}: pide GH desde OG`); assert.ok(!regalo.euler.test(d), `${s}: ${d}`); }
  }
});

test('cierre: frases que eran falsas o no se entendían (redactor y lectores)', () => {
  // «E ve a BC más cerrado que A» es falso con A < 60°.
  for (let s = 0; s < 60; s++) for (const p of idea('excentro').resuelve.generar(s).pasos) assert.ok(!/más cerrado que A/.test(plano(p.texto)), plano(p.texto));
  // Ortocentro: el «Vale si» dice cuánto vale con B o C obtuso (BHC = A), y eso es cierto.
  assert.match(plano(idea('ortocentro').regla.condicion), /B o C es obtuso, el ángulo BHC mide lo mismo que A/);
  const [A, B, Cc] = [[-3, 6], [0, 0], [10, 0]]; assert.ok(casi(ang(centros(A, B, Cc).H, B, Cc), ang(A, B, Cc), 1e-6));
  // Circuncentro 14: la explicación del 8 cm es una cuenta que existe (20 − 12).
  const e14 = idea('circuncentro').ejemplos[13]; assert.ok(!/usa 10 cm como hipotenusa/.test(plano(e14.solucion.map(p => p.texto).join(' '))));
  // Euler: R se dice qué es en la regla y en los Datos de nueve puntos.
  assert.match(plano(idea('euler').regla.condicion), /R es el radio de la circunscrita/);
  for (const e of idea('euler').ejemplos) for (const d of e.datos || []) if (/R ÷ 2/.test(plano(d))) assert.match(plano(d), /radio de la circunscrita/, e.titulo);
  // Excentro: la predicción no presenta «veredas» que el alumno no vio.
  assert.ok(!/veredas/.test(plano(idea('excentro').predice.pregunta)));
});

test('cierre: el nivel 3 no repite un nivel 2 con otro número, y la elección de Euler pide algo más que nombrar', () => {
  const firma = e => plano(e.enunciado).replace(/\d+(?:,\d+)?/g, '#');
  for (const i of def.ideas) {
    const dos = new Set(i.ejemplos.filter(e => e.nivel === 2).map(firma));
    for (const e of i.ejemplos.filter(x => x.nivel === 3)) assert.ok(!dos.has(firma(e)), `${i.id} «${e.titulo}»`);
  }
  const ex = idea('excentro').ejemplos.filter(e => e.nivel === 3);
  assert.ok(ex.every(e => !/¿Cuánto mide AT\?|¿Cuál es el perímetro/.test(plano(e.enunciado))), 'excentro nivel 3 de un paso');
  assert.match(plano(idea('euler').ejemplos[13].enunciado), /dónde queda/);
});

test('cierre: en la cartulina de Euler, O no pisa BC, I se aparta de la recta OH y G no se encima con I', () => {
  const Fm = idea('euler').mira.datos, P = Object.fromEntries(PO.escena(Fm).fig.puntos.map(q => [q.id, [q.x, q.y]]));
  const u = [P.H[0] - P.O[0], P.H[1] - P.O[1]], fuera = Math.abs((P.I[0] - P.O[0]) * u[1] - (P.I[1] - P.O[1]) * u[0]) / Math.hypot(...u);
  assert.ok(P.O[1] > 1, `O a ${P.O[1]} de BC`); assert.ok(fuera > 0.4, `I a ${fuera} de la recta`); assert.ok(dist(P.H, P.A) > 1.5);
  const j = idea('euler').juega, v = Object.fromEntries(j.controles.map(c => [c.id, c.inicio])), Q = Object.fromEntries(PO.escena(j.dibujo(v).datos).fig.puntos.map(q => [q.id, [q.x, q.y]]));
  assert.ok(dist(Q.G, Q.I) > 0.7, `G e I a ${dist(Q.G, Q.I)}`);
  // La predicción no muestra los centros: con ellos, la recta se mediría con regla.
  const pr = PO.escena(idea('euler').predice.dibujo.datos).fig.puntos.map(q => q.id);
  assert.ok(!pr.some(x => ['O', 'G', 'H', 'I'].includes(x)), pr.join(','));
});
