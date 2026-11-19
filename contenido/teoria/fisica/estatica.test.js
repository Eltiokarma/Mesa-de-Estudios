// Pruebas propias de «Estática: equilibrio y torque» (además del validador común de contenido/teoria/teoria.test.js).
// La unidad se rehizo el 19 nov 2026 (etapa 6, docs/etapa6/propuesta-fisica.md). Todavía no declara calidad: 2 (la marca
// la sesión después del lector en frío y el auditor), pero una prueba la simula.
//   - la forma: seis ideas en el orden de la propuesta, los ids que se conservan, las tres mesas;
//   - un color fijo por clase de fuerza (peso carmín, normal violeta, tensión y mano naranja, rozamiento turquesa), sin verde;
//   - cada misión se logra y no está cumplida al abrir;
//   - los 90 ejemplos cuadran con un cálculo aparte: un resolvedor de equilibrio (suma de fuerzas por componentes y suma de
//     torques, con eliminación de Gauss) que no usa las fórmulas despejadas de la unidad; los resortes, estirados de a
//     poco hasta que su fuerza iguala lo que los jala; en los de examen, la letra de la respuesta es la de su valor y A–E
//     salen 6 veces cada una;
//   - «Ahora tú» en 400 semillas: 4 opciones distintas, una sola correcta y su valor es el del cálculo aparte con los
//     números de la pregunta;
//   - toda igualdad numérica escrita es verdadera (los redondeos van con «≈»);
//   - todas las figuras caben con 4 de margen y ningún rótulo pisa a otro.
// El mismo cálculo aparte está en el scratchpad de la sesión (e6-fisica/cuentas.js).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('../../../nucleo/kit/kit.js');
const Teoria = require('../../../nucleo/teoria.js');
const E = require('../../../nucleo/ecuacion.js');
const def = require('./estatica.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const P = require('../../../nucleo/kit/piezas/fis-estatica.js');
const idea = id => def.ideas.find(i => i.id === id);
const plano = x => E.texto(x === undefined || x === null ? '' : x).replace(/⁠/g, '');
const nums = s => (String(s).match(/\d{1,3}(?:[ \u202f\u00a0]\d{3})+(?:,\d+)?|\d+(?:,\d+)?/g) || []).map(x => Number(x.replace(/[ \u202f\u00a0]/g, '').replace(',', '.')));
const primero = s => nums(s)[0];
const cerca = (a, b, que, tol = 1e-6) => assert.ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(b)), `${que}: ${a} contra ${b}`);

// ---------- Cálculo aparte ----------
// Senos de examen por la definición del triángulo 3-4-5 (37° y 53°) y los exactos de 30°, 45° y 60°.
const SN = { 0: 0, 30: 1 / 2, 37: 3 / 5, 45: Math.SQRT2 / 2, 53: 4 / 5, 60: Math.sqrt(3) / 2, 90: 1 };
const sn = a => { a = ((a % 360) + 360) % 360; if (a <= 90) return SN[a]; if (a <= 180) return SN[180 - a]; if (a <= 270) return -SN[a - 180]; return -SN[360 - a]; };
const cs = a => sn(a + 90);
// Equilibrio: fuerzas [{ F (número o null si se busca), ang (grados), en: [x, y] }]; ecuaciones 'x', 'y' y 't' (torque
// respecto del origen). Devuelve los valores de las desconocidas, en orden, por eliminación de Gauss.
function resolver(fuerzas, ecs = ['x', 'y']) {
  const inc = fuerzas.map((q, i) => (q.F === null ? i : -1)).filter(i => i >= 0);
  const fila = e => {
    const coef = inc.map(i => { const q = fuerzas[i]; return e === 'x' ? cs(q.ang) : e === 'y' ? sn(q.ang) : (q.en || [0, 0])[0] * sn(q.ang) - (q.en || [0, 0])[1] * cs(q.ang); });
    const b = -fuerzas.filter(q => q.F !== null).reduce((t, q) => t + q.F * (e === 'x' ? cs(q.ang) : e === 'y' ? sn(q.ang) : (q.en || [0, 0])[0] * sn(q.ang) - (q.en || [0, 0])[1] * cs(q.ang)), 0);
    return [...coef, b];
  };
  const A = ecs.map(fila), n = inc.length;
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c; r < A.length; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]];
    for (let r = 0; r < A.length; r++) if (r !== c) { const k = A[r][c] / A[c][c]; for (let j = c; j <= n; j++) A[r][j] -= k * A[c][j]; }
  }
  return inc.map((_, c) => A[c][n] / A[c][c]);
}
// Un resorte se estira de a 0,0001 m hasta que su fuerza alcanza la que lo jala (en metros).
const estirar = (Fz, k) => { let x = 0; while (k * x < Fz - 1e-9) x += 1e-4; return x; };

// ---------- La forma ----------
test('seis ideas en el orden de la propuesta; los ids publicados se conservan; tres mesas', () => {
  assert.equal(def.unidad, 'fisica.estatica');
  assert.deepEqual(def.ideas.map(i => i.id), ['diagrama-y-parejas', 'nudo-en-equilibrio', 'rozamiento-se-ajusta', 'resorte-proporcional', 'torque-y-brazo', 'cuerpo-rigido']);
  assert.deepEqual(def.laboratorio.map(m => m.id), ['palanca-libre', 'caja-con-masa', 'nudo-libre']);
  assert.deepEqual(def.laboratorio[0].controles.map(c => c.id), ['m1', 'd1', 'm2', 'd2']);
  assert.deepEqual(def.laboratorio[1].controles.map(c => c.id), ['m', 'F']);
  assert.deepEqual(def.laboratorio[2].controles.map(c => c.id), ['P', 'ang']);
  for (const i of def.ideas) {
    for (const k of ['aprendizaje', 'actividad', 'pregunta', 'lee', 'resuelve']) assert.ok(i[k], `${i.id}: ${k}`);
    assert.ok(i.juega.mision && i.juega.leyenda && i.juega.resumen, i.id);
    assert.deepEqual(Teoria.momentosDe(i), ['lee', 'juega', 'predice', 'mira', 'regla', 'resuelve', 'ahora-tu']);
    assert.equal(i.pieza, 'fis-estatica');
  }
});

// ---------- Colores ----------
const fichas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(fichas)
  : typeof x.v === 'string' && /^c-/.test(x.v) ? [x] : Object.values(x).flatMap(fichas));
function textos(i) {
  const out = [], add = (donde, x) => out.push({ donde, x });
  for (const [k, t] of i.lee.tarjetas.entries()) add(`lee ${k + 1}`, t.texto);
  add('leyenda', i.juega.leyenda.map(x => x.s));
  for (const v of Teoria.grilla(i.juega.controles)) add(`lectura ${JSON.stringify(v)}`, i.juega.lectura(v));
  for (const [k, p] of i.mira.pasos.entries()) add(`mira ${k + 1}`, [p.texto, p.ecuacion]);
  add('regla', [i.regla.texto, i.regla.ecuacion]);
  for (const [k, e] of i.ejemplos.entries()) add(`ejemplo ${k + 1}`, [e.enunciado, e.datos, e.solucion, e.respuesta]);
  for (let s = 0; s < 40; s++) {
    const a = i.ahoraTu.generar(s), r = i.resuelve.generar(s);
    add(`ahora tú ${s}`, [a.pregunta, a.datos, a.solucion]);
    add(`resuelve ${s}`, [r.enunciado, r.datos, r.pasos.map(x => [x.texto, x.ecuacion]), r.respuesta]);
  }
  return out;
}
test('un color fijo por clase de fuerza: peso carmín, normal violeta, tensión y mano naranja, rozamiento turquesa; sin verde', () => {
  assert.deepEqual(def.colores, { peso: 'h', normal: 'f', jalón: 'o', rozamiento: 'i' });
  const LETRA = { P: 'c-h', g: 'c-h', N: 'c-f', T: 'c-o', F: 'c-o', f: 'c-i' };
  let n = 0;
  for (const i of def.ideas) for (const { donde, x } of textos(i)) for (const fi of fichas(x)) {
    n++;
    assert.ok(fi.m in def.colores, `${i.id} ${donde}: «${fi.t}» sin clase`);
    assert.equal(fi.v, `c-${def.colores[fi.m]}`, `${i.id} ${donde}: «${fi.t}» (${fi.m}) en ${fi.v}`);
    if (fi.t in LETRA) assert.equal(fi.v, LETRA[fi.t], `${i.id} ${donde}: la letra ${fi.t}`);
  }
  assert.ok(n > 2000, `${n} fichas`);
  for (const i of def.ideas) for (const e of i.ejemplos) assert.ok(!/--c-d/.test(P.dibujar(e.figura.datos, e.figura.estado || {})), `${i.id} «${e.titulo}»: verde`);
});

// ---------- Misiones ----------
test('cada misión se cumple en algún caso del juego y no al abrir', () => {
  const formas = {};
  for (const i of def.ideas) {
    const inicio = Object.fromEntries(i.juega.controles.map(c => [c.id, c.inicio]));
    assert.equal(i.juega.mision.logrado(inicio), false, `${i.id}: cumplida al abrir`);
    formas[i.id] = Teoria.grilla(i.juega.controles).filter(v => i.juega.mision.logrado(v)).length;
    assert.ok(formas[i.id] >= 1, `${i.id}: nadie la logra`);
  }
  assert.deepEqual(formas, { 'diagrama-y-parejas': 3, 'nudo-en-equilibrio': 4, 'rozamiento-se-ajusta': 1, 'resorte-proporcional': 1, 'torque-y-brazo': 2, 'cuerpo-rigido': 1 });
});

// ---------- Predice y Mira ----------
test('las respuestas de Predice cuadran con el cálculo aparte', () => {
  const bien = i => idea(i).predice.opciones.find(o => o.correcta).texto;
  cerca(primero(bien('diagrama-y-parejas')), resolver([{ F: 400, ang: 270 }, { F: 100, ang: 270 }, { F: null, ang: 90 }], ['y'])[0], 'balanza empujada');
  const [t37, t53] = resolver([{ F: null, ang: 180 - 37 }, { F: null, ang: 53 }, { F: 100, ang: 270 }]);
  assert.ok(t53 > t37 && /53°/.test(bien('nudo-en-equilibrio')), 'el más parado jala más');
  cerca(primero(bien('rozamiento-se-ajusta')), resolver([{ F: 120, ang: 0 }, { F: null, ang: 180 }], ['x'])[0], 'rozamiento estático');
  // el resorte: 1 kg estira 3 cm; 3 kg, tres veces lo que estira 1 kg (k medido con la primera medida)
  const k = 10 / 0.03;
  cerca(primero(bien('resorte-proporcional')), 12 + estirar(30, k) * 100, 'largo con 3 kg', 1e-3);
  assert.match(bien('torque-y-brazo'), /cepillo/);
  // el tablón: torques respecto de B (x = 4), con el pintor encima de B
  cerca(primero(bien('cuerpo-rigido')), resolver([{ F: null, ang: 90, en: [-4, 0] }, { F: 200, ang: 270, en: [-2, 0] }, { F: 600, ang: 270, en: [0, 0] }], ['t'])[0], 'caballete A');
});

// ---------- Los 90 ejemplos ----------
// Lo que la respuesta escrita debe decir (su primer número), sacado con el cálculo aparte; null si la respuesta es una
// frase sin número (se revisa a mano en la lista de abajo).
const R = (fz, ecs) => resolver(fz, ecs);
const ESPERA = {
  'diagrama-y-parejas': [250, R([{ F: 40, ang: 270 }, { F: null, ang: 90 }], ['y'])[0], R([{ F: 300, ang: 270 }, { F: 100, ang: 90 }, { F: null, ang: 90 }], ['y'])[0], 2,
    R([{ F: 100, ang: 270 }, { F: 50, ang: 270 }, { F: null, ang: 90 }], ['y'])[0], R([{ F: 180, ang: 90 }, { F: 70, ang: 90 }, { F: null, ang: 270 }], ['y'])[0] / 10,
    R([{ F: 80, ang: 270 }, { F: 50, ang: 270 }, { F: null, ang: 90 }], ['y'])[0], 50, R([{ F: 600, ang: 270 }, { F: 50, ang: 270 }, { F: null, ang: 90 }], ['y'])[0], 350,
    R([{ F: 700, ang: 270 }, { F: 200, ang: 90 }, { F: null, ang: 90 }], ['y'])[0], R([{ F: 550, ang: 270 }, { F: 150, ang: 270 }, { F: null, ang: 90 }], ['y'])[0],
    R([{ F: 30, ang: 270 }, { F: 20, ang: 270 }, { F: null, ang: 90 }], ['y'])[0], null, 2],
  'nudo-en-equilibrio': [40, 50 * sn(37), 40, 60, 100, R([{ F: null, ang: 143 }, { F: null, ang: 37 }, { F: 120, ang: 270 }])[1], R([{ F: null, ang: 150 }, { F: null, ang: 30 }, { F: 50, ang: 270 }])[0],
    R([{ F: null, ang: 127 }, { F: null, ang: 53 }, { F: 160, ang: 270 }])[0], Math.max(...R([{ F: null, ang: 143 }, { F: null, ang: 53 }, { F: 200, ang: 270 }])),
    R([{ F: null, ang: 180 }, { F: null, ang: 53 }, { F: 80, ang: 270 }])[0], R([{ F: null, ang: 53 }, { F: null, ang: 180 }, { F: 600, ang: 270 }])[1], 210,
    R([{ F: null, ang: 150 }, { F: null, ang: 60 }, { F: 100, ang: 270 }])[1] / Math.sqrt(3), 30, R([{ F: null, ang: 180 }, { F: null, ang: 53 }, { F: 60, ang: 270 }])[0]],
  'rozamiento-se-ajusta': [50, 100, 60, 80, 100, 100, 240, 0.3, R([{ F: 100, ang: 270 }, { F: null, ang: 127 }, { F: null, ang: 37 }])[1], R([{ F: 100, ang: 270 }, { F: null, ang: 127 }, { F: null, ang: 37 }])[0],
    R([{ F: 100, ang: 37 }, { F: 300, ang: 270 }, { F: null, ang: 90 }, { F: null, ang: 180 }])[0],
    (() => { let lo = 0, hi = 500; for (let k = 0; k < 80; k++) { const m = (lo + hi) / 2, Nn = R([{ F: m, ang: 37 }, { F: 100, ang: 270 }, { F: null, ang: 90 }], ['y'])[0]; if (m * cs(37) < 0.75 * Nn) lo = m; else hi = m; } return lo; })(),
    sn(37) / cs(37), 100 * sn(37) + 0.5 * (100 * cs(37)),
    (() => { const Nn = R([{ F: 50, ang: -37 }, { F: 200, ang: 270 }, { F: null, ang: 90 }], ['y'])[0]; return 50 * cs(37) <= 0.5 * Nn ? 50 * cs(37) : NaN; })()],
  'resorte-proporcional': [estirar(10, 200) * 100, 20 / 0.04, estirar(20, 400) * 100, 600 * 0.03, 250 * 0.06, 25 + estirar(30, 200) * 100, 18 - 3, 10, 20 / 0.08, 300 * 0.02,
    estirar(R([{ F: null, ang: 90 + 37 }, { F: null, ang: 90 - 37 }, { F: 160, ang: 270 }])[1], 2000) * 100, estirar(50 * sn(37), 500) * 100, 60 - 500 * 0.04, 30 - 4, 12 - estirar(30, 1500) * 100],
  'torque-y-brazo': [15, 16, 600, null, 0.3, 600 / 300, 250 * 2 / 2.5 / 10, 80 * 0.25 * sn(53), 50 * 0.2, 60 * 0.4 * sn(30),
    R([{ F: 800, ang: 270, en: [-0.3, 0] }, { F: null, ang: 270, en: [1.2, 0] }], ['t'])[0], (300 * 2 + 200 * 1) / 400, 3 * 0.5 / 0.1, 20 / (0.25 * sn(30)), 50 * 30 / 4],
  'cuerpo-rigido': [100, 1.5, 100, 200, R([{ F: null, ang: 90, en: [3, 0] }, { F: 300, ang: 270, en: [1, 0] }], ['t'])[0],
    R([{ F: null, ang: 90, en: [-4, 0] }, { F: 200, ang: 270, en: [-2, 0] }, { F: 600, ang: 270, en: [-3, 0] }], ['t'])[0],
    R([{ F: null, ang: 90, en: [5, 0] }, { F: 300, ang: 270, en: [2.5, 0] }, { F: 500, ang: 270, en: [4, 0] }], ['t'])[0],
    R([{ F: null, ang: 270, en: [-1, 0] }, { F: 300, ang: 270, en: [1.5, 0] }], ['t'])[0] / 10, 0.5,
    R([{ F: null, ang: 90, en: [2, 0] }, { F: 100, ang: 270, en: [1, 0] }], ['t'])[0],
    // la escalera: torques respecto del pie; la pared, a 4 · sen 53° de altura; los pesos, a su distancia horizontal
    R([{ F: null, ang: 180, en: [4 * cs(53), 4 * sn(53)] }, { F: 200, ang: 270, en: [2 * cs(53), 0] }, { F: 600, ang: 270, en: [3 * cs(53), 0] }], ['t'])[0],
    (() => { const b = R([{ F: null, ang: 90, en: [5, 0] }, { F: 15, ang: 270, en: [15, 0] }, { F: 50, ang: 270, en: [35, 0] }], ['t'])[0]; return R([{ F: b, ang: 90 }, { F: 65, ang: 270 }, { F: null, ang: 270 }], ['y'])[0]; })(),
    R([{ F: 300, ang: 270, en: [-1, 0] }, { F: null, ang: 270, en: [1, 0] }], ['t'])[0] / 600,
    R([{ F: null, ang: 150, en: [2, 0] }, { F: 100, ang: 270, en: [1, 0] }], ['t'])[0], null],
};
const LETRAS_AE = ['A', 'B', 'C', 'D', 'E'];
test('los 90 ejemplos cuadran con el cálculo aparte; en los de examen, la letra es la de su valor y A–E salen 6 veces', () => {
  const cuenta = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  for (const i of def.ideas) {
    assert.equal(i.ejemplos.length, 15, i.id);
    assert.deepEqual(i.ejemplos.map(e => e.nivel), [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3], i.id);
    i.ejemplos.forEach((e, k) => {
      const esp = ESPERA[i.id][k], resp = plano(e.respuesta), que = `${i.id} ejemplo ${k + 1} «${e.titulo}»`;
      if (esp !== null) { assert.ok(Number.isFinite(esp), `${que}: el cálculo aparte no dio número`); cerca(nums(resp.replace(/^[A-E][,:]\s*/, ''))[0], esp, que, 2e-3); }
      if (e.nivel === 3) {
        assert.equal(e.alternativas.length, 5, que);
        const letra = (resp.match(/^([A-E])\b/) || [])[1];
        assert.ok(letra, `${que}: la respuesta empieza por su letra`);
        cuenta[letra]++;
        const alt = e.alternativas[LETRAS_AE.indexOf(letra)];
        if (esp !== null) cerca(primero(alt), esp, `${que}: la alternativa ${letra}`, 2e-3);
        // ninguna otra alternativa vale lo mismo
        if (esp !== null && /^\s*\d/.test(alt)) e.alternativas.forEach((a, j) => { if (j !== LETRAS_AE.indexOf(letra) && /^\s*\d/.test(a)) assert.ok(Math.abs(primero(a) - esp) > 1e-6 || /√/.test(a) !== /√/.test(alt), `${que}: ${a} repite`); });
        // el resuelto nombra las otras cuatro
        const sol = plano(e.solucion.map(x => x.texto));
        for (const l of LETRAS_AE.filter(x => x !== letra)) assert.ok(new RegExp(`\\b${l}\\b`).test(sol), `${que}: no explica la ${l}`);
      }
    });
  }
  assert.deepEqual(cuenta, { A: 6, B: 6, C: 6, D: 6, E: 6 });
});
test('las respuestas sin número dicen lo que el cálculo aparte da', () => {
  const t = (id, k) => plano(idea(id).ejemplos[k].respuesta);
  assert.match(t('diagrama-y-parejas', 13), /^E: el libro empuja la mesa/);
  // ¿hacia dónde gira? Ana 300 · 1 contra Beto 200 · 2
  assert.ok(200 * 2 > 300 * 1); assert.match(t('torque-y-brazo', 3), /Beto/);
  assert.match(t('cuerpo-rigido', 14), /^A, sobre el apoyo/);
});

// ---------- «Ahora tú» ----------
// El valor correcto, rehecho con los números de la pregunta (expresiones regulares sobre su texto).
function correcto(id, q, s) {
  const k = s % 4, n = nums(q), m = q.match.bind(q);
  if (id === 'diagrama-y-parejas') {
    if (k === 0) { const [kg, Fz] = n; return R([{ F: 10 * kg, ang: 270 }, { F: Fz, ang: /empujas/.test(q) ? 270 : 90 }, { F: null, ang: 90 }], ['y'])[0]; }
    if (k === 1) return null;
    if (k === 2) { const [a, b] = n; return /de abajo a la de arriba/.test(q) ? 10 * a : 10 * (a + b); }
    if (/techo/.test(q)) return 10 * n[0] - n[1];
    return 10 * (n[0] + n[1]);
  }
  if (id === 'nudo-en-equilibrio') {
    if (k === 0) { const [Pv, a] = n; return R([{ F: null, ang: 180 - a }, { F: null, ang: a }, { F: Pv, ang: 270 }])[0]; }
    if (k === 1) { const [Pv, , , c] = n; const t = R([{ F: null, ang: 143 }, { F: null, ang: 53 }, { F: Pv, ang: 270 }]); return c === 37 ? t[0] : t[1]; }
    if (k === 2) return /móvil/.test(q) ? 10 * n[0] / 2 : 10 * n[0];
    const [kg, a] = n; return R([{ F: null, ang: 90 - a }, { F: null, ang: 180 }, { F: 10 * kg, ang: 270 }])[1];
  }
  if (id === 'rozamiento-se-ajusta') {
    if (k === 0) { const [kg, mus, muk, Fz] = n; const Nn = 10 * kg; return Fz <= mus * Nn + 1e-9 ? Fz : muk * Nn; }
    if (k === 1) return n[1] * 10 * n[0];
    if (k === 2) { const [kg, a] = n; const t = R([{ F: 10 * kg, ang: 270 }, { F: null, ang: 90 + a }, { F: null, ang: a }]); return /empuja la rampa/.test(q) ? t[0] : t[1]; }
    const [kg, Fz, a] = n; const Nn = R([{ F: Fz, ang: a }, { F: 10 * kg, ang: 270 }, { F: null, ang: 90 }], ['y'])[0];
    return /μ/.test(q) ? Fz * cs(a) / Nn : Nn;
  }
  if (id === 'resorte-proporcional') {
    if (k === 0) { const [kk, kg] = n; return estirar(10 * kg, kk) * 100; }
    if (k === 1) { const [kg, x] = n; return 10 * kg / (x / 100); }
    if (k === 2) { const [kk, L0, kg] = n; return L0 + estirar(10 * kg, kk) * 100; }
    const [Pv, kk] = n; return estirar(Pv / 2, kk) * 100;
  }
  if (id === 'torque-y-brazo') {
    if (k === 0) { const [cm, Fz] = n; return R([{ F: Fz, ang: 90, en: [cm / 100, 0] }, { F: null, ang: 270, en: [1, 0] }], ['t'])[0]; }
    if (k === 1) { const [ma, da, mb] = n; return R([{ F: 10 * ma, ang: 270, en: [-da, 0] }, { F: null, ang: 270, en: [1, 0] }], ['t'])[0] / (10 * mb); }
    if (k === 2) { const [L, Fz, a] = n; return Fz * L * sn(a); }
    const [L, a, Pv] = n; return R([{ F: Pv, ang: 270, en: [-a, 0] }, { F: null, ang: 270, en: [L - a, 0] }], ['t'])[0];
  }
  if (k === 0) { const [L, Pb, Pp, x] = n; const t = R([{ F: null, ang: 90, en: [0, 0] }, { F: null, ang: 90, en: [L, 0] }, { F: Pb, ang: 270, en: [L / 2, 0] }, { F: Pp, ang: 270, en: [x, 0] }], ['y', 't']); return /empuja B/.test(q) ? t[1] : t[0]; }
  if (k === 1) { const [L, kg, a] = n; return R([{ F: null, ang: 270, en: [-a, 0] }, { F: 10 * kg, ang: 270, en: [L / 2 - a, 0] }], ['t'])[0]; }
  if (k === 2) { const [, Pb, , Pp] = n; return R([{ F: Pb, ang: 270, en: [-1, 0] }, { F: null, ang: 270, en: [1, 0] }], ['t'])[0] / Pp; }
  const [L, Pe, a, Pp, sP] = n.length >= 5 ? n : [...n, 0, 0];
  return R([{ F: null, ang: 180, en: [L * cs(a), L * sn(a)] }, { F: Pe, ang: 270, en: [L / 2 * cs(a), 0] }, { F: Pp, ang: 270, en: [sP * cs(a), 0] }], ['t'])[0];
}
test('«Ahora tú» en 400 semillas: 4 opciones distintas, una sola correcta, la del cálculo aparte', () => {
  for (const i of def.ideas) for (let s = 0; s < 400; s++) {
    const a = i.ahoraTu.generar(s), q = plano(a.pregunta), que = `${i.id} semilla ${s}: ${q}`;
    assert.equal(a.opciones.length, 4, que);
    assert.equal(new Set(a.opciones.map(o => o.texto)).size, 4, que);
    assert.equal(a.opciones.filter(o => o.correcta).length, 1, que);
    assert.ok(a.datos && a.datos.length, que);
    const c = correcto(i.id, q, s);
    if (c === null) continue;
    const bien = a.opciones.find(o => o.correcta);
    cerca(primero(bien.texto), c, que, 6e-3);
    for (const o of a.opciones.filter(x => !x.correcta)) assert.ok(Math.abs(primero(o.texto) - c) > 1e-6 * Math.max(1, c), `${que}: ${o.texto} vale lo mismo`);
  }
});
test('«Así se resuelve» no repite «Ahora tú»', () => {
  for (const i of def.ideas) {
    const at = new Set(Array.from({ length: 12 }, (_, s) => plano(i.ahoraTu.generar(s).pregunta)));
    for (let s = 0; s < 4; s++) assert.ok(!at.has(plano(i.resuelve.generar(s).enunciado)), `${i.id} ${s}`);
  }
});

// ---------- Igualdades ----------
// Toda igualdad entre dos expresiones numéricas escritas es verdadera: «200 · 2 + 600 · 3 = 2200», «120 / (2 · 3/5) = 100».
// Cada lado se evalúa dos veces: con los centímetros pasados a metros y sin pasarlos (un lado sin unidad vale lo mismo
// que el otro en su unidad). La igualdad vale si cuadra de alguna de las dos maneras.
const evaluar1 = (lado, conv) => {
  let t = conv ? lado.replace(/(\d[\d,]*)\s*cm(?![\p{L}])/gu, '($1/100)') : lado;
  t = t.replace(/(\d)\s*(N·m|N\/m|m\/s²|m\/s|kg|cm|m|N|rad|s)(?![\p{L}])/gu, '$1').replace(/°/g, '').trim();
  t = t.replace(/(sen|cos|tan)\s+(\d+)/g, (_, f, a) => `(${f === 'sen' ? sn(+a) : f === 'cos' ? cs(+a) : sn(+a) / cs(+a)})`);
  t = t.replace(/√(\d+)/g, '(Math.sqrt($1))').replace(/(\d),(\d)/g, '$1.$2').replace(/·/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
  if (!/^[\d\s.+\-*/()Mathsqr]+$/.test(t) || !/\d/.test(t)) return null;
  try { const v = Function(`return (${t})`)(); return Number.isFinite(v) ? v : null; } catch (e) { return null; }
};
const evaluar = lado => { const a = evaluar1(lado, false), b = evaluar1(lado, true); return a === null ? null : [a, b]; };
function igualdades(x, donde, out) {
  const partes = (Array.isArray(x) ? x : [x]).map(p => (typeof p === 'string' ? p.replace(/ {3}· {3}/g, ' ¦ ').replace(/ {3}→ {3}/g, ' ¦ ') : p));
  for (const seg of plano(partes).split(/¦|→|;/)) {
    const lados = seg.split(/=/).map(z => z.trim());
    for (let k = 0; k + 1 < lados.length; k++) {
      const a = evaluar(lados[k]), b = evaluar(lados[k + 1]);
      if (a !== null && b !== null) out.push({ donde, txt: seg, a: a[0], b: b[0], ok: Math.abs(a[0] - b[0]) <= 1e-9 * Math.max(1, Math.abs(b[0])) || Math.abs(a[1] - b[1]) <= 1e-9 * Math.max(1, Math.abs(b[1])) });
    }
  }
}
test('toda igualdad numérica escrita es verdadera (los redondeos van con «≈»)', () => {
  const out = [];
  for (const i of def.ideas) {
    for (const [k, p] of i.mira.pasos.entries()) { igualdades(p.ecuacion || [], `${i.id} mira ${k + 1}`, out); igualdades(p.texto, `${i.id} mira ${k + 1}`, out); }
    for (const [k, e] of i.ejemplos.entries()) for (const l of [...e.solucion, { texto: e.respuesta }]) { igualdades(l.ecuacion || [], `${i.id} ej ${k + 1}`, out); igualdades(l.texto, `${i.id} ej ${k + 1}`, out); }
    for (let s = 0; s < 400; s++) {
      const a = i.ahoraTu.generar(s), r = i.resuelve.generar(s);
      igualdades(a.solucion.ecuacion || [], `${i.id} ahora tú ${s}`, out);
      for (const p of r.pasos) { igualdades(p.ecuacion || [], `${i.id} resuelve ${s}`, out); igualdades(p.texto, `${i.id} resuelve ${s}`, out); }
    }
    for (const [k, t] of i.lee.tarjetas.entries()) igualdades(t.texto, `${i.id} lee ${k + 1}`, out);
  }
  assert.ok(out.length > 1500, `${out.length} igualdades`);
  const malas = out.filter(x => !x.ok);
  assert.deepEqual(malas.slice(0, 8).map(x => `${x.donde}: ${x.txt} (${x.a} contra ${x.b})`), []);
});

// ---------- Figuras ----------
const pisa = (a, b) => a.x0 < b.x1 - 0.5 && b.x0 < a.x1 - 0.5 && a.y0 < b.y1 - 0.5 && b.y0 < a.y1 - 0.5;
function revisar(que, fig) {
  const g = P.geometria(fig.datos, fig.estado || {}), s = P.dibujar(fig.datos, fig.estado || {});
  assert.ok(!/NaN|undefined|Infinity/.test(s), `${que}: NaN`);
  for (const r of g.rotulos) assert.ok(r.x0 >= 4 - 1e-9 && r.x1 <= 316 + 1e-9 && r.y0 >= 4 - 1e-9 && r.y1 <= g.H - 4 + 1e-9, `${que}: «${r.texto}» se sale`);
  for (let a = 0; a < g.rotulos.length; a++) for (let b = a + 1; b < g.rotulos.length; b++) assert.ok(!pisa(g.rotulos[a], g.rotulos[b]), `${que}: «${g.rotulos[a].texto}» pisa «${g.rotulos[b].texto}»`);
  for (const f of g.flechas) for (const p of [[f.x1, f.y1], [f.x2, f.y2]]) assert.ok(p[0] >= 2 && p[0] <= 318 && p[1] >= 2 && p[1] <= g.H - 2, `${que}: una flecha se sale`);
}
test('todas las figuras caben con 4 de margen y ningún rótulo pisa a otro', () => {
  for (const i of def.ideas) {
    for (const v of Teoria.grilla(i.juega.controles)) revisar(`${i.id} juego ${JSON.stringify(v)}`, i.juega.dibujo(v));
    revisar(`${i.id} predice`, i.predice.dibujo); revisar(`${i.id} revelar`, i.predice.revelar);
    for (const [k, p] of i.mira.pasos.entries()) revisar(`${i.id} mira ${k + 1}`, { datos: i.mira.datos, estado: p.estado });
    if (i.regla.dibujo) revisar(`${i.id} regla`, i.regla.dibujo);
    for (const [k, t] of i.lee.tarjetas.entries()) if (t.dibujo) revisar(`${i.id} lee ${k + 1}`, t.dibujo);
    for (const [k, e] of i.ejemplos.entries()) revisar(`${i.id} ejemplo ${k + 1}`, e.figura);
    for (let s = 0; s < 40; s++) { const a = i.ahoraTu.generar(s), r = i.resuelve.generar(s); if (a.dibujo) revisar(`${i.id} ahora tú ${s}`, a.dibujo); if (r.dibujo) revisar(`${i.id} resuelve ${s}`, r.dibujo); }
  }
  for (const m of def.laboratorio) for (const v of Teoria.grilla(m.controles).filter((_, k) => k % 5 === 0)) revisar(`mesa ${m.id}`, m.dibujo(v));
});

// ---------- Validador ----------
test('la unidad pasa el validador común, y con calidad: 2 simulada pasa todas sus reglas', () => {
  const temas = require('../../../catalogo/cursos/fisica.json').unidades.find(u => u.id === def.unidad).temas;
  assert.deepEqual(Teoria.problemas(def, { temas, semillas: 60 }), []);
  assert.deepEqual(Teoria.problemas(Object.assign({}, def, { calidad: 2 }), { temas, semillas: 60 }), []);
});
