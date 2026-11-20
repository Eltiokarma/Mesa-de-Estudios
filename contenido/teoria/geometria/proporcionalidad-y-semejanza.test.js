// Pruebas propias de «Proporcionalidad y semejanza» (geometria.proporcionalidad-y-semejanza), etapa 8 del plan de calidad
// (19 nov 2026): las seis ideas contra su propuesta (docs/etapa8/propuesta-geometria.md). El validador con calidad 2; los juegos, sus misiones y sus lecturas medidas en la figura; la regla de colores en todas las figuras; los
// rótulos que caben; las figuras sin escala que no dejan medir la respuesta; las respuestas de «Ahora tú» y «Así se
// resuelve» rehechas leyendo el enunciado (coordenadas y fuerza bruta, sin las cuentas de la unidad); toda cuenta escrita
// es cierta; los ejemplos de nivel 3 con una sola alternativa correcta y las demás explicadas; nada que llegue después.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../../../nucleo/kit/kit.js');
const Teoria = require('../../../nucleo/teoria.js');
const def = require('./proporcionalidad-y-semejanza.js');

const P = Kit.piezas['geo-objeto'];
const SEMILLAS = 400;
const plano = x => Teoria.plano(x);
const sinDuros = t => String(t).replace(/[  ]/g, ' ');
const C = require('../../../catalogo/cursos/geometria.json');
const FICHA = C.unidades.find(u => u.id === def.unidad), TEMAS = FICHA.temas;
const casi = (a, b, e = 1e-6) => Math.abs(a - b) < e;
const num = s => +String(s).replace(/[  ]/g, '').replace(',', '.');
const nums = t => (sinDuros(t).match(/\d+(?:,\d+)?/g) || []).map(num);
const val = (t, k) => { const m = new RegExp(`(?:^|[^A-Z])${k} = (\\d+(?:,\\d+)?)`).exec(t); return m ? num(m[1]) : NaN; };
const idea = id => def.ideas.find(i => i.id === id);
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
const mezcla = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
const corte = (A, B, Cc, D) => { const r = [B[0] - A[0], B[1] - A[1]], s = [D[0] - Cc[0], D[1] - Cc[1]], den = r[0] * s[1] - r[1] * s[0], t = ((Cc[0] - A[0]) * s[1] - (Cc[1] - A[1]) * s[0]) / den; return [A[0] + r[0] * t, A[1] + r[1] * t]; };
const tri = (c, b, a) => { const x = (c * c + b * b - a * a) / (2 * c); return [[0, 0], [c, 0], [x, Math.sqrt(b * b - x * x)]]; };
const busca = (f, lo, hi, paso) => { for (let x = lo; x <= hi + 1e-9; x += paso) if (f(+x.toFixed(6))) return +x.toFixed(6); return NaN; };
const ptsDe = F => Object.fromEntries(P.escena(F).fig.puntos.map(q => [q.id, [q.x, q.y]]));

test('las seis ideas de la propuesta, en orden; las tres mesas de antes; la ficha pide Polígonos y lista geo-semejanza primero', () => {
  assert.deepEqual(def.ideas.map(i => i.id), ['thales', 'bisectriz', 'semejanza', 'encajados', 'area-y-escala', 'ceva-menelao']);
  assert.deepEqual(def.laboratorio.map(m => m.id), ['corte-libre', 'bisectriz-libre', 'estirar']);
  assert.deepEqual(FICHA.requiere, ['geometria.poligonos-y-cuadrilateros']);
  assert.deepEqual(FICHA.plantillas, ['geo-semejanza', 'ampliadora', 'geo-proporcionalidad']);
  assert.ok(!FICHA.temas.some(t => /incentro/.test(t)), 'el incentro va a Puntos notables');
  const p = Teoria.problemas(def, { temas: TEMAS, semillas: 60 });
  assert.deepEqual(p, [], p.join('\n'));
});

test('lleva calidad 2 y pasa el validador sin excepciones (200 semillas); 15 ejemplos por idea; nivel 3 bien armado', () => {
  assert.equal(def.calidad, 2, 'cerrada el 20 nov tras el lector en frío y el auditor');
  const p = Teoria.problemas(Object.assign({}, def, { calidad: 2 }), { temas: TEMAS, semillas: 200 });
  assert.deepEqual(p, [], p.join('\n'));
  assert.deepEqual(Teoria.pendientes(Object.assign({}, def, { calidad: 2 })), []);
  const letras = {};
  for (const i of def.ideas) {
    assert.equal(i.ejemplos.length, 15, i.id);
    for (const nv of [1, 2, 3]) assert.equal(i.ejemplos.filter(e => e.nivel === nv).length, 5, `${i.id} nivel ${nv}`);
    for (const e of i.ejemplos.filter(x => x.nivel === 3)) {
      assert.equal(e.alternativas.length, 5, e.titulo);
      const sol = sinDuros(e.solucion.map(x => plano(x.texto) + ' ' + plano(x.ecuacion || '')).join(' ')), resp = sinDuros(plano(e.respuesta));
      const esta = (txt, a) => new RegExp(`(^|[^\\d,])${sinDuros(a).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?!\\d|,\\d)`).test(txt);
      const buenas = e.alternativas.filter(a => esta(resp, a));
      assert.equal(buenas.length, 1, `${e.titulo}: una sola alternativa es la respuesta (${buenas})`);
      for (const a of e.alternativas.filter(x => x !== buenas[0])) assert.ok(esta(sol, a), `${i.id} «${e.titulo}»: el resuelto no dice nada de «${a}»`);
      assert.ok(!/\b(alternativa|opción|respuesta:?)\s+[A-E]\b/i.test(sol + resp), `${e.titulo}: nombra una alternativa por su letra`);
      const L = 'ABCDE'[e.alternativas.indexOf(buenas[0])];
      letras[L] = (letras[L] || 0) + 1;
    }
  }
  for (const L of 'ABCDE') assert.equal(letras[L], 6, JSON.stringify(letras));
});

// ---------- Los juegos ----------
const grilla = c => (c.opciones ? c.opciones.map(o => o.valor) : Array.from({ length: Math.round((c.max - c.min) / c.paso) + 1 }, (_, k) => +(c.min + k * c.paso).toFixed(6)));
function casosJuego(j) { let all = [{}]; for (const c of j.controles) all = all.flatMap(v => grilla(c).map(x => Object.assign({}, v, { [c.id]: x }))); return all; }
test('las misiones: sin cumplir al abrir; se cumplen justo donde dice la propuesta (una sola salida salvo la de Ceva)', () => {
  const esperado = { thales: v => v.ab === 50, bisectriz: v => v.ac === 60, semejanza: v => v.s === 2, encajados: v => casi(v.ae, 2.4), 'area-y-escala': v => v.k === 3, 'ceva-menelao': v => casi(v.d * v.e, 1) };
  for (const i of def.ideas) {
    const j = i.juega, ini = Teoria.inicio(j);
    assert.equal(j.mision.logrado(ini), false, i.id);
    const ok = casosJuego(j).filter(v => j.mision.logrado(v));
    for (const v of casosJuego(j)) assert.equal(j.mision.logrado(v), esperado[i.id](v), `${i.id} ${JSON.stringify(v)}`);
    assert.equal(ok.length, i.id === 'ceva-menelao' ? 5 : 1, i.id);
  }
});
test('las lecturas del juego dicen una relación verdadera en toda la grilla (medida en la figura)', () => {
  for (const v of casosJuego(idea('thales').juega)) {
    const p = ptsDe(idea('thales').juega.dibujo(v).datos), l = sinDuros(plano(idea('thales').juega.lectura(v)));
    const r1 = dist(p.A, p.B) / dist(p.B, p.C), r2 = dist(p.D, p.E) / dist(p.E, p.F), m = /AB : BC = (\d+) : (\d+) = (\d+) : (\d+) = DE : EF/.exec(l);
    assert.ok(m && casi(r1, r2) && casi(+m[1] / +m[2], r1) && casi(+m[3] / +m[4], r1) && +m[1] === v.ab, `${JSON.stringify(v)}: ${l}`);
    assert.ok(casi(p.A[1], p.D[1]) && casi(p.B[1], p.E[1]) && casi(p.C[1], p.F[1]), 'los jirones son horizontales: paralelos');
    assert.ok(casi(dist(p.D, p.F) / dist(p.A, p.C), 1.5), 'la avenida 2 mide 1,5 veces la 1 entre el primer jirón y el tercero');
  }
  for (const v of casosJuego(idea('bisectriz').juega)) {
    const p = ptsDe(idea('bisectriz').juega.dibujo(v).datos), l = sinDuros(plano(idea('bisectriz').juega.lectura(v)));
    const a1 = Math.atan2(p.B[1] - p.A[1], p.B[0] - p.A[0]), a2 = Math.atan2(p.D[1] - p.A[1], p.D[0] - p.A[0]), a3 = Math.atan2(p.C[1] - p.A[1], p.C[0] - p.A[0]);
    assert.ok(casi(a2 - a1, a3 - a2, 1e-9), 'AD parte A en dos');
    const bd = dist(p.B, p.D) * 10, dc = dist(p.D, p.C) * 10, ns = nums(l);
    if (v.ac === 60) assert.ok(casi(bd, dc) && /D en el medio/.test(l) && casi(ns[0], Math.round(bd * 10) / 10, 0.051), l);
    else assert.ok(casi(ns[0], bd, 0.051) && casi(ns[1], dc, 0.051) && l.endsWith(`D, más cerca de ${bd < dc ? 'B' : 'C'}`), l);
  }
  for (const v of casosJuego(idea('semejanza').juega)) {
    const p = ptsDe(idea('semejanza').juega.dibujo(v).datos), l = sinDuros(plano(idea('semejanza').juega.lectura(v)));
    const ang = (V, X) => Math.atan2(X[1] - V[1], V[0] - X[0]);
    assert.ok(casi(ang(p.C, p.A), ang(p.F, p.D), 1e-9), 'los rayos son paralelos');
    assert.ok(casi(dist(p.B, p.C) / dist(p.E, p.F), 3) && casi(dist(p.A, p.B) / dist(p.D, p.E), 3), 'todo por 3');
    assert.ok(l.includes(`sombras: ${Kit.formatear(3 * v.s, 2)} m = 3 × ${Kit.formatear(v.s, 2)} m`), l);
  }
  for (const v of casosJuego(idea('encajados').juega)) {
    const p = ptsDe(idea('encajados').juega.dibujo(v).datos), l = sinDuros(plano(idea('encajados').juega.lectura(v)));
    const u = [p.B[0] - p.A[0], p.B[1] - p.A[1]], w = [p.D[0] - p.E[0], p.D[1] - p.E[1]];
    assert.ok(casi(u[0] * w[0] + u[1] * w[1], 0, 1e-9), 'el puntal es perpendicular a la rampa');
    assert.ok(casi(dist(p.A, p.E) / dist(p.A, p.C), dist(p.A, p.D) / dist(p.A, p.B)), 'AE : AC = AD : AB');
    // Auditoría (20 nov): la lectura dice los dos cocientes («AE ÷ AC = 1,6 ÷ 4 = 0,4 y AD ÷ AB = 2 ÷ 5 = 0,4»).
    const q = Kit.formatear(v.ae / 4, 2);
    assert.ok(l.includes(`= ${q} y AD`) && l.endsWith(`= ${q}`) && casi(nums(l)[3], dist(p.A, p.D), 1e-6), l);
  }
  for (const v of casosJuego(idea('ceva-menelao').juega)) {
    const p = ptsDe(idea('ceva-menelao').juega.dibujo(v).datos), l = sinDuros(plano(idea('ceva-menelao').juega.lectura(v)));
    const r = (X, Y, Z) => dist(X, Y) / dist(Y, Z), prod = r(p.B, p.D, p.C) * r(p.C, p.E, p.A) * r(p.A, p.F, p.B);
    assert.ok(casi(prod, 1, 1e-9) && casi(r(p.B, p.D, p.C), v.d, 1e-9) && casi(r(p.C, p.E, p.A), v.e, 1e-9), JSON.stringify(v));
    const m = /= ([\d/]+) · ([\d/]+) · ([\d/]+) = 1$/.exec(l), q = s => s.split('/').reduce((a, b) => a / b);
    assert.ok(m && casi(q(m[1]) * q(m[2]) * q(m[3]), 1, 1e-9) && casi(q(m[3]), r(p.A, p.F, p.B), 1e-9), l);
  }
});

// ---------- Todas las figuras ----------
function figuras(N = 120) {
  const out = [], toma = (donde, dib, estados) => { if (dib && dib.datos && dib.datos.objeto) out.push({ donde, datos: dib.datos, estados: estados || [(dib.estado && dib.estado.corte) || 0] }); };
  for (const i of def.ideas) {
    for (const v of casosJuego(i.juega)) toma(`${i.id} juego ${JSON.stringify(v)}`, i.juega.dibujo(v));
    for (const t of i.lee.tarjetas) toma(`${i.id} lee`, t.dibujo);
    toma(`${i.id} predice`, i.predice.dibujo); toma(`${i.id} revelar`, i.predice.revelar);
    toma(`${i.id} mira`, { datos: i.mira.datos }, i.mira.pasos.map(x => x.estado.corte));
    toma(`${i.id} regla`, i.regla.dibujo);
    i.ejemplos.forEach((e, k) => toma(`${i.id} ejemplo ${k + 1}`, e.figura));
    for (let s = 0; s < N; s++) { toma(`${i.id} resuelve ${s}`, i.resuelve.generar(s).dibujo); toma(`${i.id} ahora tú ${s}`, i.ahoraTu.generar(s).dibujo); }
  }
  return out;
}
test('todas las figuras caben y sus rótulos no se pisan; los colores siguen la regla (sin violeta ni verde; «?» en tinta)', () => {
  const mal = [];
  for (const F of figuras()) {
    for (const c of F.estados) if (!P.escenaCabe(F.datos, c)) mal.push(`${F.donde} corte ${c}`);
    const fig = P.escena(F.datos).fig;
    for (const x of [...(fig.segmentos || []), ...(fig.angulos || []), ...(fig.regiones || [])]) if (x.color === 'f' || x.color === 'd') mal.push(`${F.donde}: color ${x.color}`);
    for (const l of [...(F.datos.ladosRot || []), ...(F.datos.libres || [])]) {
      if (l.color === 'f' || l.color === 'd') mal.push(`${F.donde}: rótulo ${l.texto} en ${l.color}`);
      if (String(l.texto).trim() === '?' && l.color) mal.push(`${F.donde}: «?» con color`);
    }
    for (const a of fig.angulos || []) if (a.color && a.color !== 'h') mal.push(`${F.donde}: ángulo en ${a.color}`);
  }
  assert.deepEqual([...new Set(mal)].slice(0, 20), []);
});
test('las figuras sin escala no dejan medir la respuesta: lo dibujado queda lejos de lo que se pide (predicciones)', () => {
  // Thales: DE dibujado, con DF = 160 m (auditoría, 20 nov), contra 60 (la respuesta), los distractores y 45 (copiar el
  // factor 1,5 del juego).
  let p = ptsDe(idea('thales').predice.dibujo.datos), de = 160 * dist(p.D, p.E) / dist(p.D, p.F);
  for (const x of [60, 96, 80, 100, 45]) assert.ok(Math.abs(de - x) > 6, `Thales: DE dibujado ${de}`);
  // Bisectriz: BD dibujado, con BC = 10 m, contra 4, 5, 6 y 3.
  p = ptsDe(idea('bisectriz').predice.dibujo.datos); const bd = 10 * dist(p.B, p.D) / dist(p.B, p.C);
  for (const x of [4, 5, 6, 3]) assert.ok(Math.abs(bd - x) > 0.3, `bisectriz: BD dibujado ${bd}`);
  // Semejanza: el poste dibujado, con el alumno de 1,6 m, contra 4, 2,4, 4,6 y 5.
  p = ptsDe(idea('semejanza').predice.dibujo.datos); const po = 1.6 * dist(p.A, p.B) / dist(p.D, p.E);
  for (const x of [4, 2.4, 4.6, 5]) assert.ok(Math.abs(po - x) > 0.15, `semejanza: poste dibujado ${po}`);
  // Encajados: AD dibujado, con AB = 9 cm, contra 2, 4,5, 3 y 6.
  p = ptsDe(idea('encajados').predice.dibujo.datos); const ad = 9 * dist(p.A, p.D) / dist(p.A, p.B);
  for (const x of [2, 4.5, 3, 6]) assert.ok(Math.abs(ad - x) > 0.3, `encajados: AD dibujado ${ad}`);
  for (const i of def.ideas) if (/[?¿]/.test(plano(i.predice.pregunta)) && i.predice.dibujo.datos.sinEscala) assert.ok(/no está a escala/.test(plano(i.predice.pregunta)), i.id);
});

// ---------- «Ahora tú» y «Así se resuelve», rehechos desde el texto ----------
// Cada pregunta se reconoce por su forma y se resuelve con coordenadas o probando valores (no con las cuentas de la unidad).
function resolver(t) {
  t = sinDuros(t);
  const T0 = [2, 5], T1 = [0, 0], T2 = [7, 0];
  const bis = (c, b, a) => { const [A, B, Cc] = tri(c, b, a); return corte(A, [B[0] / c + Cc[0] / b, B[1] / c + Cc[1] / b], B, Cc).concat([B, Cc]); };
  if (/Tres rectas paralelas cortan a dos secantes/.test(t) && /DE = /.test(t)) { const a = val(t, 'AB'), b = val(t, 'BC'), de = val(t, 'DE'), h1 = 0.3 * a, h2 = 0.3 * b, s2 = h1 / de, dx = Math.sqrt(1 - s2 * s2); return dist([dx * de, h2], [dx * de + dx * h2 / s2, 0]); }
  if (/DF = /.test(t)) { const a = val(t, 'AB'), b = val(t, 'BC'), T = val(t, 'DF'), de = busca(x => casi(x / (T - x), a / b, 1e-9), 0.5, T, 0.5); return /¿Cuánto mide EF/.test(t) ? T - de : de; }
  if (/MN es paralela a BC/.test(t) && /¿Cuánto mide NC/.test(t)) { const am = val(t, 'AM'), mb = val(t, 'MB'), an = val(t, 'AN'), B = [am + mb, 0], M = [am, 0], u = [Math.cos(1), Math.sin(1)], N = [an * u[0], an * u[1]], Cc = corte(B, [B[0] + N[0] - M[0], B[1] + N[1] - M[1]], [0, 0], u); return dist(N, Cc); }
  if (/MN es paralela a BC/.test(t) && /AM = x/.test(t)) { const p0 = +/MB = x \+ (\d+)/.exec(t)[1], an = val(t, 'AN'), nc = val(t, 'NC'), x = busca(x => casi(x * nc, (x + p0) * an), 1, 300, 1); return 2 * x + p0; }
  if (/MN es paralela a BC/.test(t) && /AB = \d/.test(t) && /¿Cuánto mide AN/.test(t)) { const am = val(t, 'AM'), ab = val(t, 'AB'), ac = val(t, 'AC'); return busca(x => casi(x / (ac - x), am / (ab - am), 1e-9), 0.5, ac, 0.5); }
  if (/MN es paralela a BC/.test(t) && /¿Cuánto mide MN/.test(t)) { const am = val(t, 'AM'), mb = val(t, 'MB'), bc = val(t, 'BC'), B = [am + mb, 0], Cc = [2, 5], M = [am, 0], N = corte(M, [M[0] + Cc[0] - B[0], M[1] + Cc[1] - B[1]], [0, 0], Cc); return dist(M, N) * bc / dist(B, Cc); }
  if (/¿Es MN paralela a BC/.test(t)) { const am = val(t, 'AM'), mb = val(t, 'MB'), an = val(t, 'AN'), nc = val(t, 'NC'); const M = [am, 0], B = [am + mb, 0], u = [Math.cos(1), Math.sin(1)], N = [an * u[0], an * u[1]], Cc = [(an + nc) * u[0], (an + nc) * u[1]]; return casi((N[0] - M[0]) * (Cc[1] - B[1]) - (N[1] - M[1]) * (Cc[0] - B[0]), 0, 1e-9) ? 'sí' : 'no'; }
  if (/bisectriz del ángulo exterior/.test(t)) { const c = val(t, 'AB'), b = val(t, 'AC'), a = val(t, 'BC'), [A, B, Cc] = tri(c, b, a), E = corte(A, [B[0] / c - Cc[0] / b, B[1] / c - Cc[1] / b], B, Cc); return dist(Cc, E); }
  if (/bisectriz de A llega a BC en D/.test(t) && /AB = \d/.test(t) && /AC = \d/.test(t) && /BC = \d/.test(t)) { const [x, y, B, Cc] = bis(val(t, 'AB'), val(t, 'AC'), val(t, 'BC')), D = [x, y]; return /mide BD/.test(t) ? dist(B, D) : dist(D, Cc); }
  if (/(parte la esquina A|bisectriz de A llega a BC)/.test(t) && /BD = /.test(t)) {
    const bd = val(t, 'BD'), dc = val(t, 'DC'), a = bd + dc;
    if (/AB = x/.test(t)) { const k = +/AB = x \+ (\d+)/.exec(t)[1], b = val(t, 'AC'); return busca(x => { const c = x + k; if (!(a < b + c && b < a + c && c < a + b)) return false; const [X, Y, B] = bis(c, b, a); return casi(dist(B, [X, Y]), bd, 1e-6); }, 0.5, 200, 0.5); }
    const conocido = /AC = \d/.test(t) ? 'AC' : 'AB', k = val(t, conocido);
    const otro = busca(o => { const c = conocido === 'AB' ? k : o, b = conocido === 'AB' ? o : k; if (!(a < b + c && b < a + c && c < a + b)) return false; const [X, Y, B] = bis(c, b, a); return casi(dist(B, [X, Y]), bd, 1e-6); }, 0.5, 400, 0.5);
    return /perímetro/.test(t) ? a + k + otro : otro;
  }
  if (/terreno triangular ABC, AB = /.test(t)) { const [x, y, , Cc] = bis(val(t, 'AB'), val(t, 'AC'), val(t, 'BC')); return dist([x, y], Cc); }
  if (/proyecta una sombra (?:BC )?de/.test(t)) { const [S, h, s] = nums(t); return S * Math.tan(Math.atan(h / s)); }
  if (/se para a .* de un poste/.test(t)) { const [h, d, s] = nums(t); return (d + s) * Math.tan(Math.atan(h / s)); }
  // AA sin valores de ángulos: con B en el origen, C en el eje y A sobre un rayo cualquiera desde B (el mismo ángulo B), se
  // arma DEF con el mismo ángulo en E y el mismo en F, y se busca EF probando hasta que DE mida lo que dice.
  if (/m∠B = m∠E/.test(t)) { const ab = val(t, 'AB'), bc = val(t, 'BC'), de = val(t, 'DE'), A = [ab * Math.cos(1.1), ab * Math.sin(1.1)], Cc = [bc, 0];
    const angC = Math.atan2(A[1], Cc[0] - A[0]); return busca(ef => { const D = corte([0, 0], [Math.cos(1.1), Math.sin(1.1)], [ef, 0], [ef - Math.cos(angC), Math.sin(angC)]); return casi(Math.hypot(...D), de, 1e-6); }, 0.25, 200, 0.25); }
  if (/¿Son semejantes/.test(t)) { const n = nums(t), a = n.slice(0, 3), b = n.slice(3, 6); return casi(b[0] / a[0], b[1] / a[1], 1e-9) && casi(b[0] / a[0], b[2] / a[2], 1e-9) ? 'sí' : 'no'; }
  if (/más largo de/.test(t)) { const n = nums(t); return n[0] * n[3] / n[2]; }
  if (/espejo en el piso/.test(t)) { const [a, ojo, b] = nums(t); return b * Math.tan(Math.atan(ojo / a)); }
  if (/m∠ADE = m∠ACB/.test(t)) { const ab = val(t, 'AB'), ac = val(t, 'AC'), ae = val(t, 'AE'), B = [ab, 0], Cc = [ac * Math.cos(1), ac * Math.sin(1)], E = [ae * Math.cos(1), ae * Math.sin(1)];
    const an = (V, X, Y) => Math.acos(((X[0] - V[0]) * (Y[0] - V[0]) + (X[1] - V[1]) * (Y[1] - V[1])) / (dist(V, X) * dist(V, Y)));
    return busca(x => casi(an([x, 0], [0, 0], E), an(Cc, [0, 0], B), 1e-9), 0.05, ab, 0.05); }
  if (/Una rampa de/.test(t)) { const [AB, AC] = nums(t), BC = Math.sqrt(AB * AB - AC * AC), ae = nums(t)[/sube/.test(t) ? 3 : 2], u = [AC / AB, BC / AB], E = [u[0] * ae, u[1] * ae], nn = [u[1], -u[0]], D = [E[0] - E[1] / nn[1] * nn[0], 0]; return /mide AD/.test(t) ? D[0] : dist(D, E); }
  if (/m∠ABD = m∠ACB/.test(t)) { if (/AB = \d/.test(t)) { const ab = val(t, 'AB'), ad = val(t, 'AD'); return busca(x => casi(ab / x, ad / ab, 1e-12), 0.25, 400, 0.25); } const ad = val(t, 'AD'), ac = ad + val(t, 'DC'); return busca(x => casi(x / ac, ad / x, 1e-12), 0.5, 200, 0.5); }
  if (/AC y BD se cortan en O/.test(t)) { const oa = val(t, 'OA'), oc = val(t, 'OC'), A = [-oa, 0], Cc = [oc, 0];
    if (/OB = /.test(t)) { const ob = val(t, 'OB'), B = [ob * Math.cos(2), ob * Math.sin(2)], D = corte([0, 0], B, Cc, [Cc[0] + B[0] - A[0], B[1] - A[1]]); return dist([0, 0], D); }
    const ab = val(t, 'AB'), B = [A[0] + ab * Math.cos(1.2), ab * Math.sin(1.2)], D = corte([0, 0], B, Cc, [Cc[0] + B[0] - A[0], B[1] - A[1]]); return dist(Cc, D); }
  if (/Un cuadrado se apoya en la base/.test(t)) { const [b, h] = nums(t); return busca(x => casi(x / b, (h - x) / h, 1e-12), 0.5, 100, 0.5); }
  if (/veces el de la chica/.test(t)) { const [k, S] = nums(t); return S * k * k; }
  if (/áreas de \d+ cm² y \d+ cm²/.test(t)) { const [S1, S2, l] = nums(t); return l * Math.sqrt(S2 / S1); }
  if (/cerco paralelo/.test(t)) { const n = nums(t), [S, p0, q] = /deja, junto/.test(t) ? [n[0], n[1], n[2]] : n; const A = [0, 3], B = [0, 0], Cc = [4, 0], ar = Q => Math.abs(Q.reduce((s, X, i) => { const Y = Q[(i + 1) % Q.length]; return s + X[0] * Y[1] - Y[0] * X[1]; }, 0)) / 2;
    const ch = S * ar([A, mezcla(A, B, p0 / q), mezcla(A, Cc, p0 / q)]) / ar([A, B, Cc]); return /(otra parte|el resto)/.test(t) ? S - ch : ch; }
  if (/k = \d+, del chico al grande/.test(t)) { const [k, Pm, S] = nums(t); return /el perímetro del grande/.test(t) ? Pm * k : S * k * k; }
  if (/Por un punto interior/.test(t)) { const [a, b, c] = nums(t); return (Math.sqrt(a) + Math.sqrt(b) + Math.sqrt(c)) ** 2; }
  if (/se amplía y queda de/.test(t)) { const [w, h, W] = nums(t); return (W / w) ** 2; }
  if (/(Las cevianas AD, BE y CF|Los caminos AD, BE y CF)/.test(t) && /EA = \d/.test(t) && !/AF = x/.test(t) && !/\d : \d/.test(t)) { const af = val(t, 'AF'), fb = val(t, 'FB'), F = mezcla(T0, T1, af / (af + fb)), D = mezcla(T1, T2, val(t, 'BD') / (val(t, 'BD') + val(t, 'DC'))), Pp = corte(T0, D, T2, F), E = corte(T1, Pp, T2, T0); return dist(T2, E) / dist(E, T0) * val(t, 'EA'); }
  if (/AC = \d/.test(t) && /(cevianas|caminos)/.test(t)) { const af = val(t, 'AF'), fb = val(t, 'FB'), F = mezcla(T0, T1, af / (af + fb)), D = mezcla(T1, T2, val(t, 'BD') / (val(t, 'BD') + val(t, 'DC'))), Pp = corte(T0, D, T2, F), E = corte(T1, Pp, T2, T0), r = dist(T2, E) / dist(E, T0); return val(t, 'AC') * r / (1 + r); }
  if (/AF = x/.test(t)) { const b = val(t, 'FB'), D = mezcla(T1, T2, val(t, 'BD') / (val(t, 'BD') + val(t, 'DC'))), E = mezcla(T2, T0, val(t, 'CE') / (val(t, 'CE') + val(t, 'EA'))), Pp = corte(T0, D, T1, E), F = corte(T2, Pp, T0, T1); return dist(T0, F) / dist(F, T1) * b + b; }
  if (/¿En qué razón parte F/.test(t)) { const m = [...t.matchAll(/(\d+) : (\d+)/g)].map(x => [+x[1], +x[2]]), D = mezcla(T1, T2, m[0][0] / (m[0][0] + m[0][1])), E = mezcla(T2, T0, m[1][0] / (m[1][0] + m[1][1])), Pp = corte(T0, D, T1, E), F = corte(T2, Pp, T0, T1), r = dist(T0, F) / dist(F, T1);
    for (let d = 1; d <= 200; d++) { const n = Math.round(r * d); if (casi(n / d, r, 1e-9)) return `${n} : ${d}`; } }
  if (/¿Las cevianas AD, BE y CF pasan por un mismo punto/.test(t)) { const m = [...t.matchAll(/(\d+) : (\d+)/g)].map(x => [+x[1], +x[2]]), D = mezcla(T1, T2, m[1][0] / (m[1][0] + m[1][1])), E = mezcla(T2, T0, m[2][0] / (m[2][0] + m[2][1])), F = mezcla(T0, T1, m[0][0] / (m[0][0] + m[0][1])), Pp = corte(T0, D, T1, E); return casi((F[0] - Pp[0]) * (T2[1] - Pp[1]) - (F[1] - Pp[1]) * (T2[0] - Pp[0]), 0, 1e-9) ? 'sí' : 'no'; }
  if (/Una recta corta AB en F, BC en D y la prolongación de CA/.test(t)) { const L = val(t, 'CA'), A = [L * Math.cos(1.1), L * Math.sin(1.1)], Cc = [0, 0], B = [9, 0], F = mezcla(A, B, val(t, 'AF') / (val(t, 'AF') + val(t, 'FB'))), D = mezcla(B, Cc, val(t, 'BD') / (val(t, 'BD') + val(t, 'DC'))), E = corte(F, D, Cc, A); return /mide CE/.test(t) ? dist(E, Cc) : dist(E, A); }
  return NaN;
}
const valorDe = txt => { const t = sinDuros(txt); if (/^(Sí|No)[:,\s]/.test(t)) return /^Sí/.test(t) ? 'sí' : 'no'; const m = /(\d+) : (\d+)$/.exec(t); if (m) return `${m[1]} : ${m[2]}`; return num((t.match(/\d+(?:,\d+)?/) || [NaN])[0]); };
test('«Ahora tú»: la correcta rehecha desde el texto (400 semillas por idea); una sola correcta; opciones distintas', () => {
  const mal = [];
  for (const i of def.ideas) for (let s = 0; s < SEMILLAS; s++) {
    const c = i.ahoraTu.generar(s), q = plano(c.pregunta), r = resolver(q), ok = c.opciones.filter(o => o.correcta);
    if (ok.length !== 1) mal.push(`${i.id} ${s}: ${ok.length} correctas`);
    const tx = c.opciones.map(o => o.texto); if (new Set(tx).size !== tx.length) mal.push(`${i.id} ${s}: opciones repetidas`);
    const vc = valorDe(ok[0].texto);
    if (typeof r === 'string' ? r !== vc : !casi(r, vc, 0.006)) mal.push(`${i.id} ${s}: ${r} contra ${ok[0].texto} | ${sinDuros(q)}`);
    for (const o of c.opciones.filter(x => !x.correcta)) { const vo = valorDe(o.texto); if (typeof r === 'number' && casi(vo, r, 0.006)) mal.push(`${i.id} ${s}: el distractor ${o.texto} vale la respuesta`); }
  }
  assert.deepEqual(mal.slice(0, 10), []);
});
test('«Así se resuelve»: la respuesta rehecha desde el enunciado (400 semillas por idea); no repite «Ahora tú» ni un ejemplo', () => {
  const mal = [];
  for (const i of def.ideas) {
    const ahora = new Set(Array.from({ length: 60 }, (_, s) => sinDuros(plano(i.ahoraTu.generar(s).pregunta))));
    const ejemplos = new Set(i.ejemplos.map(e => sinDuros(plano(e.enunciado))));
    for (let s = 0; s < SEMILLAS; s++) {
      const c = i.resuelve.generar(s), q = sinDuros(plano(c.enunciado)), r = resolver(q), v = valorDe(plano(c.respuesta).replace(/^[^\d]*/, ''));
      if (typeof r === 'string' ? r !== v : !casi(r, v, 0.006)) mal.push(`${i.id} ${s}: ${r} contra ${plano(c.respuesta)} | ${q}`);
      if (s < 20 && (ahora.has(q) || ejemplos.has(q))) mal.push(`${i.id} ${s}: repite`);
    }
  }
  assert.deepEqual(mal.slice(0, 10), []);
});
test('toda cuenta escrita «a op b = c» de las soluciones y pasos es cierta (400 semillas)', () => {
  const re = /(?<![\d,A-Za-z(/]|· )((?:\d+(?:,\d+)? [−+·÷×] )+\d+(?:,\d+)?) = (\d+(?:,\d+)?)(?![\d,/]| [−+·÷×])/g, mal = [];
  const mira = t => { for (const m of sinDuros(t).matchAll(re)) { const e = m[1].replace(/,/g, '.').replace(/−/g, '-').replace(/[·×]/g, '*').replace(/÷/g, '/'); if (!casi(Function(`return (${e})`)(), num(m[2]), 0.006)) mal.push(m[0]); } };
  for (const i of def.ideas) {
    for (let s = 0; s < SEMILLAS; s++) {
      const a = i.ahoraTu.generar(s); mira(plano(a.solucion.texto) + ' ' + plano(a.solucion.ecuacion || ''));
      const r = i.resuelve.generar(s); for (const x of r.pasos) mira(plano(x.texto) + ' ' + plano(x.ecuacion || ''));
    }
    for (const e of i.ejemplos) for (const x of e.solucion) mira(plano(x.texto) + ' ' + plano(x.ecuacion || ''));
  }
  assert.deepEqual([...new Set(mal)], []);
});
test('nada que llegue después: ni incentro, ni baricentro, ni cuerdas, ni Pitágoras como regla en ningún texto de la unidad', () => {
  const textos = JSON.stringify(def.ideas.map(i => [i.lee, i.juega.consigna, i.predice, i.mira.pasos, i.regla.texto, i.ejemplos.map(e => [e.enunciado, e.datos, e.solucion])]));
  assert.ok(!/incentro|baricentro|circunferencia|cuerda|Pitágoras|mediana/i.test(textos));
  for (const i of def.ideas) for (let s = 0; s < 60; s++) assert.ok(!/incentro|baricentro|circunferencia|cuerda/i.test(JSON.stringify([i.ahoraTu.generar(s), i.resuelve.generar(s).pasos])), `${i.id} ${s}`);
});

// ---------- Auditoría y lectores en frío (cierre, 20 nov): rutinas/auditoria/geometria.proporcionalidad-y-semejanza.md ----------
const existeT = (a, b, c) => a + b > c + 1e-9 && a + c > b + 1e-9 && b + c > a + 1e-9;
// Los triángulos que un enunciado de Ceva, Menelao o LLL describe (lados AB = AF + FB, BC = BD + DC, CA).
function triangulosDe(t) {
  t = sinDuros(t); const out = [];
  if (/(cevianas|caminos|Una recta corta AB en F)/.test(t)) {
    const af = /AF = x/.test(t) ? NaN : val(t, 'AF'), fb = val(t, 'FB'), bd = val(t, 'BD'), dc = val(t, 'DC');
    let ca = /(?:CA|AC) = \d/.test(t) ? (val(t, 'CA') || val(t, 'AC')) : val(t, 'CE') + val(t, 'EA');
    let ab = af + fb;
    if (/AF = x/.test(t)) { const r = (bd / dc) * (val(t, 'CE') / val(t, 'EA')), x = /FB = x \+ (\d+)/.exec(t) ? +/FB = x \+ (\d+)/.exec(t)[1] : null;
      ab = x === null ? fb / r + fb : (() => { const xx = busca(y => casi(y / (y + x) * r, 1, 1e-9), 0.5, 200, 0.5); return 2 * xx + x; })(); }
    if (/EA = \d/.test(t) && !/CE = \d/.test(t) && !/(?:CA|AC) = \d/.test(t)) ca = val(t, 'EA') * (1 + fb * dc / (af * bd));
    if ([ab, bd + dc, ca].every(Number.isFinite)) out.push([ab, bd + dc, ca]);
  }
  if (/¿Son semejantes/.test(t)) { const n = nums(t); out.push(n.slice(0, 3), n.slice(3, 6)); }
  return out;
}
test('auditoría A2: todo triángulo de Ceva, Menelao y LLL existe (ejemplos y 400 semillas)', () => {
  const mal = [];
  for (const i of [idea('semejanza'), idea('ceva-menelao')]) {
    i.ejemplos.forEach((e, k) => { for (const tr of triangulosDe(plano(e.enunciado))) if (!existeT(...tr)) mal.push(`${i.id} ejemplo ${k + 1}: ${tr}`); });
    for (let s = 0; s < SEMILLAS; s++) for (const t of [plano(i.ahoraTu.generar(s).pregunta), plano(i.resuelve.generar(s).enunciado)])
      for (const tr of triangulosDe(t)) if (!existeT(...tr)) mal.push(`${i.id} ${s}: ${tr.map(x => +x.toFixed(2))} — ${t.slice(0, 90)}`);
  }
  assert.deepEqual(mal.slice(0, 10), []);
});
test('auditoría A1: Menelao en un solo sentido (con largos, «si vale 1, están alineados» es falso)', () => {
  const textos = [plano(idea('ceva-menelao').regla.texto), plano(idea('ceva-menelao').regla.condicion),
    ...idea('ceva-menelao').ejemplos.flatMap(e => (e.datos || []).map(plano)), ...def.glosario.filter(g => /Menelao/.test(g.termino)).map(g => g.def + ' ' + g.simple)];
  for (const t of textos) assert.ok(!/(alineados si|dice cuándo están alineados|en los dos sentidos)/.test(t), t);
  // Y el producto de los puntos medios (que no están alineados) vale 1: por eso el recíproco no vale con largos.
  assert.equal((1 / 1) * (1 / 1) * (1 / 1), 1);
});
test('auditoría A3: el ejemplo LAL describe un triángulo posible (BC² = AB² + AC² − 2 · AB · AC · cos A)', () => {
  const e = idea('semejanza').ejemplos.find(x => x.titulo === 'Dos lados y su ángulo'), t = sinDuros(plano(e.enunciado));
  const ab = val(t, 'AB'), ac = val(t, 'AC'), bc = val(t, 'BC'), A = +/m∠A = (\d+)°/.exec(t)[1];
  assert.ok(casi(bc * bc, ab * ab + ac * ac - 2 * ab * ac * Math.cos(A * Math.PI / 180), 1e-6), t);
});
test('auditoría: la explicación de los distractores de «Un tramo que se describe» da DF de verdad (9 + 15 = 24)', () => {
  const e = idea('thales').ejemplos.find(x => x.titulo === 'Un tramo que se describe'), sol = plano(e.solucion.map(s => s.texto));
  assert.ok(/24 cm, DF/.test(sol) && e.alternativas.includes('24 cm') && !e.alternativas.includes('25 cm'), sol);
});
test('lectores en frío: los Datos de semejanza no traen letras ajenas (DE/AB con D y E de otro problema)', () => {
  for (const i of [idea('semejanza'), idea('encajados')]) {
    const datos = [...i.ejemplos.flatMap(e => e.datos || []), ...Array.from({ length: 60 }, (_, s) => i.ahoraTu.generar(s).datos).flat(), ...Array.from({ length: 60 }, (_, s) => i.resuelve.generar(s).datos).flat()];
    for (const d of datos) assert.ok(!/DE\s*\/?\s*AB|EF\s*\/?\s*BC|FD\s*\/?\s*CA/.test(sinDuros(plano(d)).replace(/\n/g, ' ')), plano(d));
  }
});
test('auditoría M1: AB y AC enteros van sobre una llave (cota) en los encajados, no junto a DB o EC', () => {
  for (const F of [idea('encajados').regla.dibujo, idea('encajados').predice.dibujo, idea('encajados').ejemplos[0].figura, { datos: idea('encajados').juega.dibujo({ ae: 2.4 }).datos }]) {
    const d = F.datos, ids = (d.cotas || []).map(c => c.de + c.a);
    assert.ok(ids.includes('AB') && ids.includes('AC'), JSON.stringify(ids));
    assert.ok(!(d.ladosRot || []).some(l => ['AB', 'AC'].includes(l.de + l.a)));
    assert.ok(P.dibujar(d, {}).includes('data-cota="AB"'));
  }
});
test('lectores en frío: «Ahora tú» y «Así se resuelve» de bisectriz y semejanza llevan dibujo; con «?» sin escala, el aviso', () => {
  for (const id of ['bisectriz', 'semejanza', 'encajados']) for (let s = 0; s < 60; s++) {
    const a = idea(id).ahoraTu.generar(s), r = idea(id).resuelve.generar(s), pa = plano(a.pregunta);
    if (id === 'bisectriz' || (id === 'semejanza' && !/(Son semejantes|espejo)/.test(pa))) assert.ok(a.dibujo, `${id} ${s}: ${pa}`);
    if (id === 'bisectriz' || (id === 'semejanza' && s % 2 === 0)) assert.ok(r.dibujo, `${id} resuelve ${s}`);
    for (const [c, t] of [[a, pa], [r, plano(r.enunciado || '')]]) if (c.dibujo && c.dibujo.datos.sinEscala) assert.ok(/no está a escala/.test(t), `${id} ${s}: ${t}`);
  }
});
test('lector A: el dibujo sin escala de Thales respeta el orden de las medidas (el tramo más largo se ve más largo)', () => {
  for (let s = 0; s < 200; s++) for (const c of [idea('thales').ahoraTu.generar(s), idea('thales').resuelve.generar(s)]) {
    if (!c.dibujo) continue;
    const d = c.dibujo.datos, p = ptsDe(d), L = Object.fromEntries((d.ladosRot || []).map(l => [l.de + l.a, num((/(\d+(?:,\d+)?)/.exec(plano(l.texto)) || [])[1])]));
    for (const [x, y] of [['AB', 'BC'], ['AM', 'MB']]) if (Number.isFinite(L[x]) && Number.isFinite(L[y]) && L[x] !== L[y])
      assert.equal(dist(p[x[0]], p[x[1]]) > dist(p[y[0]], p[y[1]]), L[x] > L[y], `thales ${s}: ${x} = ${L[x]}, ${y} = ${L[y]}`);
  }
});
test('lectores en frío: las misiones nombran lo que se mueve; Predice de Thales no se acierta copiando el factor 1,5 del juego', () => {
  assert.ok(/EF/.test(idea('semejanza').juega.mision.texto) && !/sol/.test(idea('semejanza').juega.mision.texto));
  assert.ok(/AE/.test(idea('encajados').juega.mision.texto));
  const t = sinDuros(plano(idea('thales').predice.pregunta)), ok = num(plano(idea('thales').predice.opciones.find(o => o.correcta).texto));
  assert.ok(!casi(ok, 1.5 * val(t, 'AB')), `${ok} = 1,5 · AB`);
});
test('lector B: el pozo P tiene letra en Lee; la regla de áreas dice cuál es S₂; el Lee de la foto muestra la ampliación más grande', () => {
  const lee = idea('ceva-menelao').lee.tarjetas[0].dibujo.datos;
  assert.ok(lee.figura.puntos.some(q => q.id === 'P' && q.rotulo === 'P'));
  assert.ok(/S₂ es el área de la grande/.test(idea('area-y-escala').regla.condicion));
  const foto = idea('area-y-escala').lee.tarjetas[0].dibujo.datos, p = ptsDe(foto);
  assert.ok(dist(p.e, p.f) > 1.2 * dist(p.a, p.b));
});
