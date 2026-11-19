// Pruebas propias de «Movimiento circular» (además del validador común de contenido/teoria/teoria.test.js). La unidad
// nació el 19 nov al partir «Movimiento parabólico y circular» (docs/etapa5/propuesta-fisica.md, parte B) y sus seis
// ideas se escribieron con el método (fase 3). Todavía no declara calidad: 2 (la marca la sesión después del lector en
// frío y el auditor), pero la última prueba la simula.
//   - la forma: seis ideas en el orden de la propuesta, los ids publicados que se conservan y lo que Avance.migrar manda;
//   - un color fijo por magnitud (los de MRU, MRUV y Movimiento parabólico), sin verde;
//   - cada misión se logra y no está cumplida al abrir; nada de lo que se ve antes de predecir dice la respuesta;
//   - los 15 ejemplos de cada idea (90) cuadran con un cálculo aparte que no usa las fórmulas de la regla: el arco se mide
//     sumando cuerdas, los giros se integran paso a paso, la aceleración sale de restar velocidades vecinas; también el
//     valor de cada alternativa equivocada con el error que dice el resuelto;
//   - «Ahora tú» en 400 semillas: la correcta es la del cálculo aparte (con los números de la pregunta) y única.
// El mismo cálculo aparte está en el scratchpad de la sesión (e5-fisica-b/cuentas-b.js).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../../../nucleo/kit/kit.js');
const Teoria = require('../../../nucleo/teoria.js');
const Glosario = require('../../../nucleo/glosario.js');
const Avance = require('../../../nucleo/avance.js');
const E = require('../../../nucleo/ecuacion.js');
const def = require('./movimiento-circular.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const P = Kit.piezas['fis-giro'];
const idea = id => def.ideas.find(i => i.id === id);
const limpio = x => (Array.isArray(x) ? x.filter(y => y !== undefined && y !== null).map(limpio) : x);
const plano = x => E.texto(x === undefined || x === null ? '' : limpio(x)).replace(/⁠/g, '');
const num = s => Number(String(s).replace(/\s/g, '').replace(',', '.').replace('−', '-'));
const cerca = (a, b, que, tol = 2e-3) => assert.ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(b)), `${que}: ${a} contra ${b}`);

// ---------- Cálculo aparte (sin s = θ·r, sin ω = 2π/T, sin a = v²/r ni las ecuaciones del MCUV) ----------
// π sale del perímetro de un polígono de muchos lados inscrito en una circunferencia de radio 1.
const LADOS = 200000;
const PI_ = LADOS * Math.sin(Math.PI / LADOS);   // la mitad del perímetro del polígono (≈ π con 10 cifras)
// Arco recorrido por un punto a r del eje que gira th radianes: suma de cuerdas de trocitos.
function arco(r, th) { const n = 20000, d = th / n; let s = 0; for (let i = 0; i < n; i++) s += 2 * r * Math.sin(d / 2); return s; }
// Ángulo (en rad) cuyo arco, a r del eje, mide s: bisección sobre arco().
function anguloDe(s, r) { let lo = 0, hi = 1e4; for (let k = 0; k < 80; k++) { const m = (lo + hi) / 2; if (arco(r, m) < s) lo = m; else hi = m; } return (lo + hi) / 2; }
const vuelta = r => arco(r, 2 * PI_);             // lo que mide la vuelta entera
// Giro con aceleración angular constante, integrado paso a paso: devuelve [ángulo girado, ω final].
function girar(w0, al, t) { const n = 100000, dt = t / n; let th = 0, w = w0; for (let i = 0; i < n; i++) { th += (w + al * dt / 2) * dt; w += al * dt; } return [th, w]; }
// Tiempo hasta girar th con w0 y al (bisección sobre girar).
function tiempoHasta(th, w0, al, tmax) { let lo = 0, hi = tmax; for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (girar(w0, al, m)[0] < th) lo = m; else hi = m; } return (lo + hi) / 2; }
// Aceleración de un punto que gira (ángulo th(t) a r del eje), restando velocidades vecinas: [total, tangencial, centrípeta].
function acel(r, thDe, t) {
  const h = 1e-4, pos = u => [r * Math.cos(thDe(u)), r * Math.sin(thDe(u))];
  const v = u => { const a = pos(u + h), b = pos(u - h); return [(a[0] - b[0]) / (2 * h), (a[1] - b[1]) / (2 * h)]; };
  const v1 = v(t - h), v2 = v(t + h), a = [(v2[0] - v1[0]) / (2 * h), (v2[1] - v1[1]) / (2 * h)];
  const vv = v(t), L = Math.hypot(vv[0], vv[1]) || 1, at = (a[0] * vv[0] + a[1] * vv[1]) / L, p = pos(t);
  const ac = -(a[0] * p[0] + a[1] * p[1]) / r;
  return [Math.hypot(a[0], a[1]), at, ac];
}
// Rapidez de un punto que gira con ω a r del eje, midiendo el arco que recorre en un instante corto.
const rapidez = (w, r) => arco(r, w * 1e-3) / 1e-3;
// Primer instante en que dos móviles que salen juntos (períodos T1 y T2) vuelven a coincidir, contando el reloj.
function encuentro(T1, T2, opuesto) { const dt = 1e-4; for (let t = dt; t < 1e5; t += dt) { const d = t / T1 + (opuesto ? t / T2 : -t / T2); if (Math.abs(d) >= 1) return t; } return NaN; }

// ---------- La forma de la unidad ----------
test('seis ideas en el orden de la propuesta; los ids publicados se conservan; con calidad 2', () => {
  assert.equal(def.unidad, 'fisica.movimiento-circular');
  assert.deepEqual(def.ideas.map(i => i.id), ['arco-y-radian', 'periodo-y-frecuencia', 'velocidad-tangencial', 'rapidez-constante-acelera', 'mcuv', 'dos-aceleraciones']);
  assert.deepEqual(def.ideas.map(i => i.titulo), ['El ángulo girado y el arco', 'Período, frecuencia y velocidad angular', 'Velocidad tangencial y transmisión',
    'Aceleración centrípeta', 'MCUV: el giro que acelera', 'Aceleración tangencial y total']);
  assert.deepEqual(def.laboratorio.map(m => m.id), ['rueda', 'giro']);
  assert.deepEqual(def.laboratorioIdeas, { rueda: ['arco-y-radian'], giro: ['rapidez-constante-acelera'] });
  assert.equal(def.calidad, 2, 'cerrada el 19 nov tras el lector en frío y el auditor');
  for (const i of def.ideas) {
    for (const k of ['aprendizaje', 'actividad', 'pregunta', 'lee', 'resuelve']) assert.ok(i[k], `${i.id}: ${k}`);
    assert.ok(i.juega.mision && i.juega.leyenda && i.juega.resumen, i.id);
    assert.deepEqual(Teoria.momentosDe(i), ['lee', 'juega', 'predice', 'mira', 'regla', 'resuelve', 'ahora-tu']);
    assert.equal(i.pieza, 'fis-giro');
  }
});

test('lo que Avance.migrar trae de la unidad vieja existe aquí; la Predice de B4 conserva sus ids de opción', () => {
  const V = 'fisica.movimiento-parabolico-y-circular', N = def.unidad;
  const est = { avanceV: 1, teoria: { [V]: { ideas: { 'arco-y-radian': { hecha: true, prediccion: 'grados' }, 'rapidez-constante-acelera': { prediccion: 'cero' }, 'dos-aceleraciones': { prediccion: 'alfa' } } } },
    coleccion: [{ id: 'c1', unidad: V, mesa: 'rueda' }, { id: 'c2', unidad: V, mesa: 'giro' }],
    glosario: { [V]: Object.fromEntries(['radian', 'desplazamiento angular', 'velocidad angular', 'aceleracion angular', 'velocidad tangencial', 'periodo', 'frecuencia', 'mcu', 'mcuv',
      'aceleracion centripeta', 'aceleracion tangencial'].map(k => [k, 'sabe'])) } };
  assert.equal(Avance.migrar(est), true);
  const ids = new Set(def.ideas.map(i => i.id)), mesas = new Set(def.laboratorio.map(m => m.id)), palabras = new Set(def.glosario.map(g => Glosario.clave(g.termino)));
  for (const id of Object.keys(est.teoria[N].ideas)) assert.ok(ids.has(id), id);
  for (const c of est.coleccion) assert.ok(mesas.has(c.mesa), c.mesa);
  for (const k of Object.keys(est.glosario[N])) assert.ok(palabras.has(k), `palabra «${k}»`);
  // B1 y B6 cambiaron de pregunta: su predicción vieja sin huella se borra (prediccionPC); B4 conserva la suya.
  assert.equal(est.teoria[N].ideas['arco-y-radian'].prediccion, undefined);
  assert.equal(est.teoria[N].ideas['dos-aceleraciones'].prediccion, undefined);
  assert.equal(est.teoria[N].ideas['rapidez-constante-acelera'].prediccion, 'cero');
  assert.deepEqual(idea('rapidez-constante-acelera').predice.opciones.map(o => o.id).sort(), ['adelante', 'afuera', 'c', 'cero']);
  // Las mesas conservan sus controles (un caso guardado sigue abriendo igual).
  assert.deepEqual(def.laboratorio[0].controles.map(c => c.id), ['r', 'deg']);
  assert.deepEqual(def.laboratorio[1].controles.map(c => c.id), ['v', 'r', 't']);
});

// ---------- Colores y notación ----------
const fichas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(fichas)
  : typeof x.v === 'string' && /^c-/.test(x.v) ? [x] : Object.values(x).flatMap(fichas));
function lecturas(i) {
  const out = [], add = (donde, x) => out.push({ donde, x });
  const j = i.juega;
  for (const [k, t] of i.lee.tarjetas.entries()) add(`lee ${k + 1}`, [t.titulo, t.texto]);
  add('leyenda', j.leyenda.map(x => [x.s, x.t]));
  for (const v of Teoria.grilla(j.controles).filter((_, k) => k % 7 === 0)) add(`lectura ${JSON.stringify(v)}`, j.lectura(v));
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
test('un color fijo por magnitud: velocidad y ω naranja, tiempo turquesa, arco y giro violeta, aceleración carmín; sin verde', () => {
  assert.deepEqual(def.colores, { velocidad: 'o', tiempo: 'i', giro: 'f', aceleración: 'h' });
  for (const otra of ['./mruv-y-caida-libre.js', './movimiento-rectilineo.js']) {
    const c = require(otra).colores;
    for (const m of ['velocidad', 'tiempo', 'aceleración']) assert.equal(def.colores[m], c[m], `${otra}: ${m}`);
  }
  const LETRA = { v: 'c-o', 'ω': 'c-o', t: 'c-i', T: 'c-i', s: 'c-f', 'θ': 'c-f', N: 'c-f', 'α': 'c-h', a: 'c-h' };
  let n = 0;
  for (const i of def.ideas) for (const { donde, x } of lecturas(i)) for (const fi of fichas(x)) {
    n++;
    assert.ok(fi.m in def.colores, `${i.id} ${donde}: «${fi.t}» sin magnitud`);
    assert.equal(fi.v, `c-${def.colores[fi.m]}`, `${i.id} ${donde}: «${fi.t}» (${fi.m}) en ${fi.v}`);
    if (fi.t in LETRA) assert.equal(fi.v, LETRA[fi.t], `${i.id} ${donde}: la letra ${fi.t}`);
    assert.notEqual(fi.v, 'c-d', `${i.id} ${donde}: verde`);
  }
  assert.ok(n > 3000, `${n} fichas`);
  // En las figuras tampoco hay verde, y lo que se pide va con «?» en tinta.
  for (const i of def.ideas) for (const e of i.ejemplos) {
    const g = P.geometria(e.figura.datos, e.figura.estado || {});
    assert.ok(!/--c-d/.test(P.dibujar(e.figura.datos, e.figura.estado || {})), `${i.id} «${e.titulo}»: verde en la figura`);
    for (const r of g.rotulos.filter(x => /\?/.test(x.texto))) assert.ok(!r.color || r.color === 'tinta', `${i.id} «${e.titulo}»: «${r.texto}» con color`);
  }
});

test('la velocidad lleva flecha desde B4 (en una curva es un vector); antes, v es la rapidez', () => {
  assert.equal(def.notacion.vectores, true);
  for (const id of ['arco-y-radian', 'periodo-y-frecuencia', 'velocidad-tangencial']) for (const { donde, x } of lecturas(idea(id))) {
    assert.ok(!JSON.stringify(x === undefined ? null : x).includes('"vec"'), `${id} ${donde}: { vec }`);
  }
  assert.ok(lecturas(idea('rapidez-constante-acelera')).some(({ x }) => JSON.stringify(x).includes('"vec"')));
  for (const i of def.ideas) for (const { donde, x } of lecturas(i)) assert.ok(!/[ᵧᵪ]/.test(plano(x)), `${i.id} ${donde}: subíndice con letra griega`);
});

// ---------- Juegos: la misión se logra, no al abrir, y lo de antes de Predice no delata la respuesta ----------
test('cada misión se cumple en algún caso del juego y no al abrir', () => {
  const LOGRAN = {
    'arco-y-radian': v => v.th === 1, 'periodo-y-frecuencia': v => v.T === 20, 'velocidad-tangencial': v => v.ra === 2 * v.rb,
    'rapidez-constante-acelera': v => Math.abs(v.t - Math.PI) < 1e-6, mcuv: v => v.w0 + 4 * v.alfa === 12, 'dos-aceleraciones': v => v.t === 1,
  };
  for (const i of def.ideas) {
    const j = i.juega, casos = Teoria.grilla(j.controles);
    assert.equal(j.mision.logrado(Teoria.inicio(j)), false, `${i.id}: cumplida al abrir`);
    const si = casos.filter(v => j.mision.logrado(v));
    assert.ok(si.length >= 1, `${i.id}: nadie la logra`);
    for (const v of casos) assert.equal(!!j.mision.logrado(v), LOGRAN[i.id](v), `${i.id} ${JSON.stringify(v)}`);
  }
  // B1: 1 rad deja un arco de un radio (8 m) medido con cuerdas. B2: con 20 s, 3 vueltas en 60 s contadas con el reloj.
  cerca(arco(8, 1), 8, 'B1: el arco de 1 rad');
  assert.equal(Math.floor(girar(vuelta(1) / 20, 0, 60)[0] / vuelta(1) + 1e-6), 3, 'B2: 3 vueltas en un minuto');
  assert.equal(Math.floor(girar(vuelta(1) / 25, 0, 60)[0] / vuelta(1) + 1e-6), 2, 'B2: con 25 s, no');
  // B3: misma vuelta en 12 s; a 2 r recorre el doble en el mismo tiempo. B6: a 1 s, a_c = a_T = 2 m/s² (restando velocidades).
  cerca(arco(4, 2 * PI_ / 12) / arco(2, 2 * PI_ / 12), 2, 'B3: el doble');
  const a6 = acel(2, t => 0.5 * t * t, 1);
  cerca(a6[1], 2, 'B6: a_T a 1 s', 1e-3); cerca(a6[2], 2, 'B6: a_c a 1 s', 1e-3);
  // B4: la moto va al norte un cuarto de vuelta después de pasar por el sur (π s, con ω = 0,5 rad/s).
  cerca(vuelta(20) / 10 / 4, Math.PI, 'B4: un cuarto de vuelta del óvalo a 10 m/s');
  // B5: con ω₀ = 4 y α = 2, a los 4 s gira a 12 rad/s.
  cerca(girar(4, 2, 4)[1], 12, 'B5');
});

test('nada de lo que se ve antes de predecir dice la respuesta de la Predice', () => {
  const NO = {
    'arco-y-radian': /2π|6,28|vuelta (entera|completa)/, 'periodo-y-frecuencia': /0,5 s|medio segundo/, 'velocidad-tangencial': /dos vueltas|2 vueltas|piñón/i,
    'rapidez-constante-acelera': /centro|centrípeta/i, mcuv: /18 rad/, 'dos-aceleraciones': /parejo|solo la/i,
  };
  for (const i of def.ideas) {
    const j = i.juega, antes = [];
    for (const t of i.lee.tarjetas) antes.push(plano([t.titulo, t.texto]));
    antes.push(plano(j.consigna), plano(j.mision.texto), plano(j.mision.bien), plano(j.voz), plano(j.leyenda.map(x => [x.s, ' ', x.t, ' '])));
    for (const v of Teoria.grilla(j.controles).filter((_, k) => k % 5 === 0)) antes.push(plano(j.lectura(v)));
    for (const txt of antes) assert.ok(!NO[i.id].test(txt), `${i.id}: adelanta la predicción: «${txt}»`);
    for (const d of i.predice.datos) assert.ok(!/\b[a-zA-Zθωα]\b\s*=/.test(plano(d)), `${i.id}: dato de Predice con fórmula: ${plano(d)}`);
  }
  // El juego de B4 no dibuja la aceleración; el de B1 no llega a la vuelta entera.
  for (const v of Teoria.grilla(idea('rapidez-constante-acelera').juega.controles)) assert.ok(!/fis-acel/.test(P.dibujar(idea('rapidez-constante-acelera').juega.dibujo(v).datos)));
  assert.ok(Math.max(...Teoria.grilla(idea('arco-y-radian').juega.controles).map(v => v.th)) < 2 * Math.PI);
  // Ningún ejemplo del glosario responde una Predice.
  const RESP = [/2π rad|6,28/, /0,5 s/, /dos vueltas|2 vueltas/i, /hacia el centro|al centro/, /18 rad/, /solo la centrípeta|queda (solo )?la centrípeta|a_T = 0/];
  for (const g of def.glosario) for (const x of [g.def, g.simple, ...(g.ejemplos || [])]) for (const re of RESP) assert.ok(!re.test(x), `glosario «${g.termino}»: «${x}»`);
});

test('cada idea estrena de 2 a 4 palabras del glosario, con simple y 3 ejemplos', () => {
  const por = Glosario.porIdea(def);
  assert.deepEqual(por.map(es => es.map(e => e.termino)), [['radián', 'desplazamiento angular', 'arco'], ['MCU', 'período', 'frecuencia', 'velocidad angular'],
    ['velocidad tangencial', 'transmisión'], ['cambio de velocidad', 'aceleración centrípeta'], ['MCUV', 'aceleración angular'], ['aceleración tangencial', 'aceleración total']]);
  for (const g of def.glosario) assert.ok(g.simple && g.ejemplos.length >= 3, g.termino);
});

// ---------- Ejemplos ----------
test('15 ejemplos por idea que suben de nivel; los de examen con cinco alternativas, la letra en negrita y A–E una vez cada una', () => {
  for (const i of def.ideas) {
    const EJ = i.ejemplos;
    assert.equal(EJ.length, 15, i.id);
    assert.deepEqual(EJ.map(e => e.nivel), [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3], i.id);
    for (const e of EJ) {
      assert.ok(Array.isArray(e.datos) && e.datos.length >= 1, `${i.id} «${e.titulo}»: sin datos`);
      assert.ok(e.figura && e.figura.pieza === 'fis-giro', `${i.id} «${e.titulo}»: sin figura`);
      const cuentas = e.solucion.filter(l => l.ecuacion).length;
      if (e.nivel === 1) assert.equal(cuentas, 1, `${i.id} «${e.titulo}»: un paso`);
      if (e.nivel === 2) assert.ok(cuentas >= 2, `${i.id} «${e.titulo}»: dos pasos`);
      if (e.nivel === 3) {
        assert.equal(e.alternativas.length, 5, e.titulo);
        assert.equal(new Set(e.alternativas).size, 5, `${e.titulo}: alternativas repetidas`);
        assert.ok(e.respuesta[0] && e.respuesta[0].negrita, `${e.titulo}: la letra en negrita`);
      } else assert.equal(e.alternativas, undefined, `${e.titulo}: alternativas fuera del nivel 3`);
    }
    assert.deepEqual(EJ.filter(e => e.nivel === 3).map(e => plano(e.respuesta)[0]).sort(), ['A', 'B', 'C', 'D', 'E'], `${i.id}: cada letra una vez`);
  }
});

// Lo que dice la respuesta de un ejemplo (el primer número que calza con re) y la alternativa de una letra.
const R = id => idea(id).ejemplos.map(e => plano(e.respuesta));
const dice = (id, k, re, valor, que, tol) => { const m = R(id)[k - 1].match(re); assert.ok(m, `${id} ${k}: «${R(id)[k - 1]}»`); cerca(num(m[1]), valor, `${id} ${k} (${que})`, tol); };
const alt = (id, k, letra) => idea(id).ejemplos[k - 1].alternativas['ABCDE'.indexOf(letra)];
const numAlt = s => num(String(s).match(/−?\d[\d,]*(?: \d{3})*/)[0]);
const piAlt = s => { const m = String(s).match(/^(−?[\d,]*)π(?:\/(\d+))?/); return m ? (m[1] === '' ? 1 : num(m[1])) * Math.PI / (m[2] ? Number(m[2]) : 1) : numAlt(s); };
const letra = (id, k) => R(id)[k - 1][0];

test('B1: los 15 ejemplos cuadran con el arco medido con cuerdas', () => {
  const B = 'arco-y-radian';
  dice(B, 1, /Recorre ([\d,]+) m/, arco(8, 2), '2 rad a 8 m');
  dice(B, 2, /unos ([\d,]+) rad/, 3 * 2 * PI_, '3 vueltas');
  dice(B, 3, /unos ([\d,]+) rad/, vuelta(1) * 90 / 360, '90°');
  dice(B, 4, /Gira ([\d,]+) rad/, anguloDe(6, 4), '6 m a 4 m');
  dice(B, 5, /Son ([\d,]+)°/, (PI_ / 3) / (vuelta(1) / 360), 'π/3 rad');
  dice(B, 6, /unos ([\d,]+) m/, arco(8, vuelta(1) / 4), 'un cuarto a 8 m');
  dice(B, 7, /Da ([\d,]+) vueltas/, 6 * PI_ / vuelta(0.3), '6π m con 30 cm');
  dice(B, 8, /unos ([\d,]+) cm/, vuelta(15) / 3, '20 min de minutero');
  dice(B, 9, /recorre ([\d,]+) m/, arco(2, anguloDe(7, 3.5)), 'Beto');
  dice(B, 10, /r = ([\d,]+) m/, anguloDe(10 * PI_, 1) / (vuelta(1) * 150 / 360), '150° y 10π m');
  // Nivel 3: la alternativa de la letra es la del cálculo aparte; las demás, las de su error.
  assert.equal(letra(B, 11), 'C'); cerca(piAlt(alt(B, 11, 'C')), 100 * vuelta(0.35), '11'); cerca(numAlt(alt(B, 11, 'A')), 100 * 0.35, '11 A');
  cerca(piAlt(alt(B, 11, 'B')), 100 * vuelta(0.35) / 2, '11 B'); cerca(piAlt(alt(B, 11, 'D')), 100 * vuelta(0.7), '11 D'); cerca(piAlt(alt(B, 11, 'E')), 100 * vuelta(35), '11 E');
  assert.equal(letra(B, 12), 'E'); cerca(piAlt(alt(B, 12, 'E')), 15 * vuelta(0.1), '12'); cerca(numAlt(alt(B, 12, 'A')), 1.5, '12 A');
  cerca(piAlt(alt(B, 12, 'B')), 15 * vuelta(0.1) / 2, '12 B'); cerca(piAlt(alt(B, 12, 'C')), 15 * vuelta(10), '12 C'); cerca(piAlt(alt(B, 12, 'D')), 15 * vuelta(0.2), '12 D');
  assert.equal(letra(B, 13), 'A'); cerca(numAlt(alt(B, 13, 'A')), anguloDe(15, 0.3), '13'); cerca(numAlt(alt(B, 13, 'B')), anguloDe(15, 30), '13 B');
  cerca(numAlt(alt(B, 13, 'C')), 15 * 0.3, '13 C'); cerca(numAlt(alt(B, 13, 'D')), anguloDe(15, 0.6), '13 D'); cerca(numAlt(alt(B, 13, 'E')), anguloDe(15, 0.3) / (2 * PI_), '13 E', 0.01);
  assert.equal(letra(B, 14), 'D'); cerca(piAlt(alt(B, 14, 'D')), 3 * 2 * PI_ - 2 * PI_ / 4, '14'); cerca(piAlt(alt(B, 14, 'A')), 6 * PI_, '14 A');
  cerca(numAlt(alt(B, 14, 'B')), 3 * 360 - 90, '14 B'); cerca(piAlt(alt(B, 14, 'C')), 6 * PI_ + PI_ / 2, '14 C'); cerca(numAlt(alt(B, 14, 'E')), 3 - 0.25, '14 E');
  assert.equal(letra(B, 15), 'B'); cerca(numAlt(alt(B, 15, 'B')), anguloDe(20, 8) * 360 / vuelta(1), '15', 0.005);
  cerca(numAlt(alt(B, 15, 'A')), anguloDe(20, 8), '15 A'); cerca(numAlt(alt(B, 15, 'C')), anguloDe(20, 8) * 180, '15 C'); cerca(numAlt(alt(B, 15, 'D')), 160, '15 D'); cerca(numAlt(alt(B, 15, 'E')), 8 / 20, '15 E');
});

test('B2: los 15 ejemplos cuadran contando vueltas con un reloj que avanza de a poco', () => {
  const B = 'periodo-y-frecuencia';
  const contar = (w, t) => Math.floor(girar(w, 0, t)[0] / (2 * PI_) + 1e-9);   // vueltas enteras en t con ω fija
  dice(B, 1, /f = ([\d,]+) Hz/, contar(2 * PI_ / 40, 4000) / 4000, 'una vuelta cada 40 s', 0.01);
  dice(B, 2, /f = ([\d,]+) Hz/, 15 / 3, '15 vueltas en 3 s');
  dice(B, 3, /unos ([\d,]+) rad\/s/, vuelta(1) / 20, 'T = 20 s', 0.02);
  dice(B, 4, /unos ([\d,]+) rad\/s/, vuelta(1) / 60, 'segundero', 0.06);
  dice(B, 5, /Gira ([\d,]+) rad/, girar(3, 0, 4)[0], '3 rad/s por 4 s');
  dice(B, 6, /T = ([\d,]+) s/, 60 / 300, '300 rpm');
  dice(B, 7, /unos ([\d,]+) rad\/s/, 90 / 60 * vuelta(1), '90 rpm');
  dice(B, 8, /Da ([\d,]+) vueltas/, contar(6 * PI_, 60), '6π rad/s en un minuto');
  dice(B, 9, /unos ([\d,]+) rad\/s/, vuelta(1) / 86400, 'la Tierra', 0.01);
  dice(B, 10, /gira 2π\/3 rad/.test(R(B)[9]) ? /π\/(\d+) rad\/s/ : /x/, 1800, 'el minutero');
  cerca(girar(vuelta(1) / 3600, 0, 1200)[0], 2 * PI_ / 3, 'B2 10: 2π/3 en 20 min');
  assert.equal(letra(B, 11), 'B'); cerca(numAlt(alt(B, 11, 'B')), encuentro(40, 60, true), '11', 1e-3);
  cerca(numAlt(alt(B, 11, 'A')), 50, '11 A'); cerca(numAlt(alt(B, 11, 'C')), 120, '11 C'); cerca(numAlt(alt(B, 11, 'D')), 20, '11 D'); cerca(numAlt(alt(B, 11, 'E')), 100, '11 E');
  assert.equal(letra(B, 12), 'E'); cerca(numAlt(alt(B, 12, 'E')), encuentro(30, 40, false), '12', 1e-3); cerca(numAlt(alt(B, 12, 'C')), encuentro(30, 40, true), '12 C', 1e-3);
  cerca(numAlt(alt(B, 12, 'A')), 70, '12 A'); cerca(numAlt(alt(B, 12, 'B')), 10, '12 B'); cerca(numAlt(alt(B, 12, 'D')), 35, '12 D');
  assert.equal(letra(B, 13), 'C'); cerca(numAlt(alt(B, 13, 'C')), encuentro(60, 720, false), '13', 1e-3); cerca(numAlt(alt(B, 13, 'B')), encuentro(60, 720, true), '13 B', 1e-3);
  assert.equal(letra(B, 14), 'A'); cerca(piAlt(alt(B, 14, 'A')), 45 / 60 * vuelta(1), '14'); cerca(piAlt(alt(B, 14, 'B')), 45 * vuelta(1), '14 B');
  cerca(numAlt(alt(B, 14, 'C')), 0.75, '14 C'); cerca(piAlt(alt(B, 14, 'D')), 0.75 * PI_, '14 D'); cerca(piAlt(alt(B, 14, 'E')), 45 * 60 * vuelta(1), '14 E');
  // 15: el primer instante en que los dos están otra vez en la salida, con el reloj; vueltas del rápido en ese tiempo.
  let tj = NaN; for (let t = 1; t < 1000; t += 1) if (t % 30 === 0 && t % 45 === 0) { tj = t; break; }
  assert.equal(letra(B, 15), 'D'); cerca(numAlt(alt(B, 15, 'D')), tj / 30, '15');
  cerca(numAlt(alt(B, 15, 'A')), tj / 45, '15 A'); cerca(numAlt(alt(B, 15, 'B')), tj, '15 B'); cerca(numAlt(alt(B, 15, 'C')), tj / 30 + tj / 45, '15 C'); cerca(numAlt(alt(B, 15, 'E')), 45 / 30, '15 E');
});

test('B3: los 15 ejemplos cuadran midiendo lo que recorre cada borde en un instante corto', () => {
  const B = 'velocidad-tangencial';
  dice(B, 1, /Va a ([\d,]+) m\/s/, rapidez(0.5, 3), 'ω 0,5 a 3 m');
  dice(B, 2, /ω = ([\d,]+) rad\/s/, 4 / rapidez(1, 0.2), '4 m/s a 0,2 m');
  dice(B, 3, /r = ([\d,]+) m/, 6 / rapidez(2, 1), '6 m/s con 2 rad/s');
  dice(B, 4, /a ([\d,]+) m\/s/, rapidez(30, 0.1), 'polea de 0,1 m');
  dice(B, 5, /con ([\d,]+) rad\/s/, 1.2 / rapidez(1, 0.06), 'piñón de 0,06 m');
  dice(B, 6, /unos ([\d,]+) m\/s/, vuelta(3) / 12, 'carrusel', 0.005);
  dice(B, 7, /unos ([\d,]+) m\/s/, 2 * vuelta(0.3), '120 rpm', 0.005);
  dice(B, 8, /con ([\d,]+) rad\/s/, rapidez(60, 0.1) / rapidez(1, 0.3), 'faja');
  dice(B, 9, /B va a ([\d,]+) m\/s/, rapidez(4 / rapidez(1, 0.5), 0.2), 'mismo disco');
  dice(B, 10, /a ([\d,]+) rpm/, 300 * 6 / 15, 'contacto');
  const V = (r, T) => 2 * 3 * r / T;   // π = 3, como dicen los datos del examen
  assert.equal(letra(B, 11), 'B'); cerca(numAlt(alt(B, 11, 'B')), V(6400 * Math.cos(Math.PI / 3), 24), '11'); cerca(numAlt(alt(B, 11, 'A')), V(6400, 24), '11 A');
  cerca(numAlt(alt(B, 11, 'C')), V(6400 * 0.87, 24), '11 C'); cerca(numAlt(alt(B, 11, 'D')), V(3200, 24) / 2, '11 D'); cerca(numAlt(alt(B, 11, 'E')), 3200, '11 E');
  const vc = rapidez(2 * PI_, 0.2), wp = vc / rapidez(1, 0.08);
  assert.equal(letra(B, 12), 'D'); cerca(numAlt(alt(B, 12, 'D')), rapidez(wp, 0.35), '12', 0.005); cerca(numAlt(alt(B, 12, 'A')), rapidez(2 * PI_, 0.35), '12 A', 0.005);
  cerca(numAlt(alt(B, 12, 'B')), rapidez(2 * PI_ * 0.08 / 0.2, 0.35), '12 B', 0.005); cerca(numAlt(alt(B, 12, 'C')), vc, '12 C', 0.005); cerca(numAlt(alt(B, 12, 'E')), rapidez(2 * PI_ * 6.25, 0.35), '12 E', 0.005);
  assert.equal(letra(B, 13), 'E'); cerca(numAlt(alt(B, 13, 'E')), rapidez(60, 10) / rapidez(1, 5), '13'); cerca(numAlt(alt(B, 13, 'A')), 60 * 10 / 30, '13 A');
  cerca(numAlt(alt(B, 13, 'B')), 60 * 30 / 5, '13 B'); cerca(numAlt(alt(B, 13, 'C')), 60 * 5 / 10, '13 C'); cerca(numAlt(alt(B, 13, 'D')), 60, '13 D');
  const w2 = rapidez(40, 0.05) / rapidez(1, 0.2);
  assert.equal(letra(B, 14), 'A'); cerca(numAlt(alt(B, 14, 'A')), rapidez(w2, 0.1), '14'); cerca(numAlt(alt(B, 14, 'B')), rapidez(40, 0.05), '14 B');
  cerca(numAlt(alt(B, 14, 'C')), rapidez(40, 0.1), '14 C'); cerca(numAlt(alt(B, 14, 'D')), rapidez(40 * 0.2 / 0.05, 0.1), '14 D'); cerca(numAlt(alt(B, 14, 'E')), w2, '14 E');
  assert.equal(letra(B, 15), 'C'); cerca(numAlt(alt(B, 15, 'C')), (6 - 2) / 0.2, '15'); cerca(numAlt(alt(B, 15, 'A')), 8 / 0.2, '15 A');
  cerca(numAlt(alt(B, 15, 'B')), 4 / 20, '15 B'); cerca(numAlt(alt(B, 15, 'D')), 6 / 0.2, '15 D'); cerca(numAlt(alt(B, 15, 'E')), 2 / 0.2, '15 E');
  // El punto B del ejemplo 15 queda a 0,1 m del eje y A a 0,3 m: con 20 rad/s, 2 m/s y 6 m/s.
  cerca(rapidez(20, 0.1), 2, '15: B'); cerca(rapidez(20, 0.3), 6, '15: A');
});

test('B4: los 15 ejemplos cuadran restando velocidades vecinas', () => {
  const B = 'rapidez-constante-acelera';
  const ac = (v, r) => acel(r, t => v / r * t, 0.3)[2];
  dice(B, 1, /= ([\d,]+) m\/s²/, ac(10, 25), 'moto');
  dice(B, 2, /= ([\d,]+) m\/s²/, acel(2, t => 3 * t, 0.3)[2], 'ω = 3 a 2 m');
  dice(B, 3, /r = ([\d,]+) m/, (() => { let lo = 1, hi = 100; for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (ac(12, m) > 6) lo = m; else hi = m; } return (lo + hi) / 2; })(), 'r con 12 m/s y 6 m/s²');
  dice(B, 4, /Va a ([\d,]+) m\/s/, Math.sqrt(8 * 2), 'v con 8 m/s² y 2 m');
  cerca(ac(Math.sqrt(8 * 2), 2), 8, 'B4 4: comprobación');
  dice(B, 5, /unos ([\d,]+) m\/s/, Math.hypot(4 - 0, 0 - 4), 'Δv de un cuarto');
  dice(B, 6, /= ([\d,]+) m\/s²/, ac(36000 / 3600, 50), 'bus');
  dice(B, 7, /unos ([\d,]+) m\/s²/, acel(0.25, t => vuelta(1) * t, 0.2)[2], 'lavadora', 0.005);
  dice(B, 8, /unos ([\d,]+) m\/s²/, ac(vuelta(5) / 10, 5), 'carrusel T = 10 s', 0.005);
  dice(B, 9, /= ([\d,]+) m\/s²/, ac(6, 6 / 2), 'v = 6 y ω = 2');
  dice(B, 10, /Ana: ([\d,]+) m\/s²/, acel(4, t => 0.5 * t, 0.3)[2], 'Ana'); dice(B, 10, /Beto: ([\d,]+) m\/s²/, acel(2, t => 0.5 * t, 0.3)[2], 'Beto');
  assert.equal(letra(B, 11), 'B'); assert.equal(alt(B, 11, 'B'), 'FVF');
  const a12 = ac(20, 100 / 4);
  assert.equal(letra(B, 12), 'C'); cerca(numAlt(alt(B, 12, 'C')), a12, '12'); cerca(numAlt(alt(B, 12, 'A')), 8, '12 A'); cerca(numAlt(alt(B, 12, 'B')), 4, '12 B');
  cerca(numAlt(alt(B, 12, 'D')), 2, '12 D'); cerca(numAlt(alt(B, 12, 'E')), 32, '12 E');
  const w13 = 1200 / 60 * vuelta(1);
  assert.equal(letra(B, 13), 'A'); cerca(piAlt(alt(B, 13, 'A').replace('π²', 'π')) * Math.PI, acel(0.25, t => w13 * t, 0.01)[2], '13', 0.005);
  cerca(numAlt(alt(B, 13, 'B')), 1200 * 1200 * 0.25, '13 B'); cerca(piAlt(alt(B, 13, 'C')), rapidez(w13, 0.25), '13 C', 0.005);
  cerca(numAlt(alt(B, 13, 'D')) * Math.PI ** 2, w13 * w13 * 25, '13 D', 0.005); cerca(numAlt(alt(B, 13, 'E')) * Math.PI ** 2, w13 * w13 * 0.5, '13 E', 0.005);
  assert.equal(letra(B, 14), 'E'); cerca(numAlt(alt(B, 14, 'E')), Math.hypot(-10 - 10, 0), '14'); cerca(numAlt(alt(B, 14, 'C')), Math.hypot(10, 10), '14 C', 1e-3);
  cerca(numAlt(alt(B, 14, 'D')), ac(10, 20), '14 D');
  // 15: la partícula en (3; 4) m con 5 m/s; la aceleración que sale de restar velocidades, en componentes.
  const r15 = 5, th0 = Math.atan2(4, 3), w15 = 5 / r15, h = 1e-4;
  const pos = t => [r15 * Math.cos(th0 + w15 * t), r15 * Math.sin(th0 + w15 * t)];
  const ax = (pos(h)[0] - 2 * pos(0)[0] + pos(-h)[0]) / (h * h), ay = (pos(h)[1] - 2 * pos(0)[1] + pos(-h)[1]) / (h * h);
  assert.equal(letra(B, 15), 'D'); const m15 = alt(B, 15, 'D').match(/(−?[\d,]+)î − ([\d,]+)ĵ/);
  cerca(num(m15[1]), ax, '15 x', 1e-3); cerca(-num(m15[2]), ay, '15 y', 1e-3);
});

test('B5: los 15 ejemplos cuadran integrando el giro paso a paso', () => {
  const B = 'mcuv';
  const alfaDe = (w0, w, t) => { let lo = -100, hi = 100; for (let k = 0; k < 80; k++) { const m = (lo + hi) / 2; if (girar(w0, m, t)[1] < w) lo = m; else hi = m; } return (lo + hi) / 2; };
  dice(B, 1, /= ([\d,]+) rad\/s²/, alfaDe(4, 12, 4), '4 a 12 en 4 s');
  dice(B, 2, /= ([\d,]+) rad\/s/, girar(3, 2, 5)[1], 'ω a 5 s');
  dice(B, 3, /Gira ([\d,]+) rad/, girar(0, 2, 5)[0], '25 rad');
  dice(B, 4, /Gira ([\d,]+) rad/, girar(10, alfaDe(10, 20, 4), 4)[0], 'ω media');
  dice(B, 5, /Tarda ([\d,]+) s/, (() => { let t = 0; while (girar(0, 5, t)[1] < 30) t += 1e-3; return t; })(), 'hasta 30 rad/s', 1e-3);
  dice(B, 6, /unos ([\d,]+) rad\/s²/, alfaDe(0, 600 / 60 * vuelta(1), 10), '600 rpm en 10 s', 0.005);
  dice(B, 7, /Da ([\d,]+) vueltas/, girar(0, PI_, 4)[0] / (2 * PI_), 'vueltas en 4 s');
  dice(B, 8, /= (−[\d,]+) rad\/s²/, alfaDe(20, 0, 5), 'frena'); dice(B, 8, /gira ([\d,]+) rad/, girar(20, alfaDe(20, 0, 5), 5)[0], 'lo que gira al frenar');
  // 9: sin el tiempo; se busca α tal que, al llegar a 30 rad/s, haya girado 100 rad.
  const a9 = (() => { let lo = 0.1, hi = 50; for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2, t = (30 - 10) / m; if (girar(10, m, t)[0] > 100) lo = m; else hi = m; } return (lo + hi) / 2; })();
  dice(B, 9, /= ([\d,]+) rad\/s²/, a9, 'sin el tiempo');
  dice(B, 10, /Gira ([\d,]+) rad/, girar(0, 2, 3)[0] - girar(0, 2, 2)[0], 'el tercer segundo');
  assert.equal(letra(B, 11), 'C'); cerca(numAlt(alt(B, 11, 'C')), alfaDe(20, 60, 8), '11'); cerca(numAlt(alt(B, 11, 'A')), 60 / 8, '11 A');
  cerca(numAlt(alt(B, 11, 'B')), 80 / 8, '11 B'); cerca(numAlt(alt(B, 11, 'D')), 40 * 8, '11 D'); cerca(numAlt(alt(B, 11, 'E')), 20 / 8, '11 E');
  // 12: frena parejo desde 4π rad/s hasta pararse después de 10 vueltas: el tiempo, por bisección sobre α.
  const w12 = 4 * PI_, th12 = 10 * 2 * PI_;
  const t12 = (() => { let lo = 0.01, hi = 100; for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2, al = -w12 / m; if (girar(w12, al, m)[0] > th12) hi = m; else lo = m; } return (lo + hi) / 2; })();
  assert.equal(letra(B, 12), 'A'); cerca(numAlt(alt(B, 12, 'A')), t12, '12'); cerca(numAlt(alt(B, 12, 'B')), th12 / w12, '12 B');
  cerca(numAlt(alt(B, 12, 'C')), 2 * 10 / w12, '12 C'); cerca(numAlt(alt(B, 12, 'D')), 2 * PI_ / w12, '12 D'); cerca(numAlt(alt(B, 12, 'E')), 2 * 3600 / w12, '12 E');
  // 13: 3 rad en el primer segundo desde el reposo; lo girado en 5 s.
  const a13 = (() => { let lo = 0, hi = 50; for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (girar(0, m, 1)[0] < 3) lo = m; else hi = m; } return (lo + hi) / 2; })();
  assert.equal(letra(B, 13), 'D'); cerca(numAlt(alt(B, 13, 'D')), girar(0, a13, 5)[0], '13'); cerca(numAlt(alt(B, 13, 'A')), 15, '13 A');
  cerca(numAlt(alt(B, 13, 'B')), girar(0, a13, 5)[0] - girar(0, a13, 4)[0], '13 B'); cerca(numAlt(alt(B, 13, 'C')), 3 + 6 + 9 + 12 + 15, '13 C'); cerca(numAlt(alt(B, 13, 'E')), 2 * girar(0, a13, 5)[0], '13 E');
  assert.equal(letra(B, 14), 'B'); cerca(numAlt(alt(B, 14, 'B')), arco(0.4, girar(0, 2, 5)[0]), '14'); cerca(numAlt(alt(B, 14, 'A')), girar(0, 2, 5)[0], '14 A');
  cerca(numAlt(alt(B, 14, 'C')), girar(0, 2, 5)[0] / 0.4, '14 C'); cerca(numAlt(alt(B, 14, 'D')), 2 * arco(0.4, girar(0, 2, 5)[0]), '14 D'); cerca(numAlt(alt(B, 14, 'E')), rapidez(girar(0, 2, 5)[1], 0.4), '14 E');
  const a15 = (() => { let lo = 0, hi = 50; for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (girar(0, m, 4)[0] - girar(0, m, 3)[0] < 14) lo = m; else hi = m; } return (lo + hi) / 2; })();
  assert.equal(letra(B, 15), 'E'); cerca(numAlt(alt(B, 15, 'E')), a15, '15'); cerca(numAlt(alt(B, 15, 'A')), 14 * 2 / 16, '15 A');
  cerca(numAlt(alt(B, 15, 'B')), 14 / 7, '15 B'); cerca(numAlt(alt(B, 15, 'C')), 14 / 4, '15 C'); cerca(numAlt(alt(B, 15, 'D')), 28, '15 D');
});

test('B6: los 15 ejemplos cuadran separando la aceleración de un arranque simulado', () => {
  const B = 'dos-aceleraciones';
  // Un punto a r del eje que arranca del reposo con α: ángulo ½·α·t² (integrado con girar) y su aceleración restando velocidades.
  const arr = (r, al, t, w0 = 0) => acel(r, u => girar(w0, al, u)[0], t);
  dice(B, 1, /= ([\d,]+) m\/s²/, arr(2, 3, 0.5)[1], 'a_T');
  dice(B, 2, /= ([\d,]+) m\/s²/, acel(4, u => 6 / 4 * u, 0.5)[2], 'a_c con 6 m/s a 4 m');
  dice(B, 3, /= ([\d,]+) m\/s²/, Math.hypot(3, 4), 'total');
  dice(B, 4, /= ([\d,]+) rad\/s²/, 1.5 / arr(0.5, 1, 0.5)[1], 'α con a_T');
  dice(B, 5, /Va a ([\d,]+) m\/s/, rapidez(girar(0, 2 / 1, 3)[1], 1), 'v a 3 s');
  dice(B, 6, /= ([\d,]+) m\/s²/, arr(8, 2 / 8, 4)[2], 'a_c a 4 s');
  dice(B, 7, /= ([\d,]+) m\/s²/, Math.hypot(6, acel(2, u => 4 / 2 * u, 0.3)[2]), 'total con v');
  dice(B, 8, /= ([\d,]+) m\/s²/, arr(0.5, 3, 2 / 3)[0], 'con α y ω');
  dice(B, 9, /= ([\d,]+) m\/s²/, Math.sqrt(13 * 13 - 12 * 12), 'a_T que falta');
  dice(B, 10, /φ = ([\d,]+)°/, Math.atan2(3, 4) * 180 / Math.PI, 'ángulo', 0.01);
  // 11: el instante en que se igualan, desde el reposo, con r = 4 m y a_T = 1 m/s² (α = 0,25 rad/s²).
  let t11 = NaN; for (let t = 0.001; t < 10; t += 0.001) { const a = arr(4, 0.25, t); if (a[2] >= a[1]) { t11 = t; break; } }
  assert.equal(letra(B, 11), 'D'); cerca(numAlt(alt(B, 11, 'D')), t11, '11', 2e-3); cerca(numAlt(alt(B, 11, 'A')), 4, '11 A');
  cerca(numAlt(alt(B, 11, 'B')), 0.25, '11 B'); cerca(numAlt(alt(B, 11, 'C')), Math.sqrt(8), '11 C', 1e-3); cerca(numAlt(alt(B, 11, 'E')), 16, '11 E');
  // 12: el ángulo girado cuando se igualan, con α = 2 rad/s² y r = 3 m.
  let th12 = NaN; for (let t = 0.001; t < 10; t += 0.0005) { const a = arr(3, 2, t); if (a[2] >= a[1]) { th12 = girar(0, 2, t)[0]; break; } }
  assert.equal(letra(B, 12), 'B'); cerca(numAlt(alt(B, 12, 'B')), th12, '12', 5e-3);
  // 13: v = 6 m/s a 3 m; la total forma 53° con v (tan 53° = 4/3).
  const ac13 = acel(3, u => 2 * u, 0.3)[2], at13 = ac13 * 3 / 4;
  assert.equal(letra(B, 13), 'E'); cerca(numAlt(alt(B, 13, 'E')), Math.hypot(at13, ac13), '13'); cerca(numAlt(alt(B, 13, 'A')), ac13, '13 A');
  cerca(numAlt(alt(B, 13, 'B')), at13, '13 B'); cerca(numAlt(alt(B, 13, 'C')), at13 + ac13, '13 C'); cerca(numAlt(alt(B, 13, 'D')), Math.hypot(ac13 * 4 / 3, ac13), '13 D');
  const a14 = arr(0.5, 2, 2);
  assert.equal(letra(B, 14), 'A'); cerca(numAlt(alt(B, 14, 'A')), a14[0], '14', 2e-3); cerca(numAlt(alt(B, 14, 'B')), a14[1] + a14[2], '14 B', 2e-3);
  cerca(numAlt(alt(B, 14, 'C')), a14[2], '14 C', 2e-3); cerca(numAlt(alt(B, 14, 'D')), a14[1], '14 D', 2e-3); cerca(numAlt(alt(B, 14, 'E')), Math.hypot(1, 2 * 2 * 0.5), '14 E', 2e-3);
  // 15: después del arranque gira parejo con la ω que alcanzó: la aceleración que queda, restando velocidades.
  const w15 = girar(0, 0.5, 4)[1], a15 = acel(4, u => w15 * u, 0.3);
  assert.equal(letra(B, 15), 'C'); cerca(numAlt(alt(B, 15, 'C')), a15[0], '15'); cerca(a15[1], 0, 'B6 15: a_T = 0', 1e-3);
  cerca(numAlt(alt(B, 15, 'A')), Math.hypot(2, a15[2]), '15 A', 2e-3); cerca(numAlt(alt(B, 15, 'B')), 2, '15 B'); cerca(numAlt(alt(B, 15, 'E')), 18, '15 E');
});

// ---------- Predice y «Mira»: las respuestas, con el cálculo aparte ----------
test('las respuestas de Predice y los números de «Mira» cuadran con el cálculo aparte', () => {
  const vale = (id, re, valor, tol) => { const t = plano(idea(id).predice.opciones.find(o => o.correcta).texto); const m = t.match(re); assert.ok(m, `${id}: «${t}»`); cerca(num(m[1]), valor, id, tol); };
  vale('arco-y-radian', /unos ([\d,]+) rad/, vuelta(1), 1e-3);
  vale('periodo-y-frecuencia', /([\d,]+) s/, 60 / 120);
  let n3 = 0; for (let a = 0; a < vuelta(2) - 1e-9; a += vuelta(1) / 1000) n3 += 1 / 1000;   // lo que avanza la cadena con el plato (R = 2) medido en vueltas del piñón (r = 1)
  assert.equal(plano(idea('velocidad-tangencial').predice.opciones.find(o => o.correcta).texto), 'Dos vueltas'); cerca(n3, 2, 'B3', 2e-3);
  assert.equal(idea('rapidez-constante-acelera').predice.opciones.find(o => o.correcta).id, 'c');
  const a5 = (() => { let lo = 0, hi = 50; for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (girar(0, m, 1)[0] < 2) lo = m; else hi = m; } return (lo + hi) / 2; })();
  vale('mcuv', /([\d,]+) rad/, girar(0, a5, 3)[0]);
  cerca(girar(0, a5, 3)[0] - girar(0, a5, 2)[0], 10, 'B5: el distractor del tercer segundo');
  assert.equal(plano(idea('dos-aceleraciones').predice.opciones.find(o => o.correcta).texto), 'Solo la que va hacia el centro');
  // «Mira» de B4: 10 m/s en 20 m dan 5 m/s²; de B6: a 2 s, a_c = 8 y la total ≈ 8,25.
  assert.match(plano(idea('rapidez-constante-acelera').mira.pasos[4].ecuacion), /= 5 m\/s²$/); cerca(acel(20, u => 0.5 * u, 1)[2], 5, 'B4 mira');
  const a6 = acel(2, u => 0.5 * u * u, 2);
  cerca(a6[2], 8, 'B6 mira a_c'); cerca(a6[0], 8.246, 'B6 mira total', 1e-3);
  assert.match(plano(idea('dos-aceleraciones').mira.pasos[3].ecuacion), /≈ 8,25 m\/s²$/);
});

// ---------- «Ahora tú» y «Así se resuelve» ----------
const nums = s => [...plano(s).replace(/(\d) (\d{3})/g, '$1$2').matchAll(/(\d+(?:,\d+)?)(π)?/g)].map(m => num(m[1]) * (m[2] ? Math.PI : 1));
test('«Ahora tú» en 400 semillas: una sola correcta, la del cálculo aparte con los números de la pregunta', () => {
  const valor = o => { const t = plano(o.texto), m = t.match(/^(−?[\d,]*)(π)?(?:\/(\d+))?(π²)?/); if (!m || (m[1] === '' && !m[2])) return NaN; const k = m[1] === '' ? 1 : num(m[1]); return k * (m[2] ? Math.PI : 1) / (m[3] ? Number(m[3]) : 1); };
  const CALC = {
    'arco-y-radian': [
      q => { const [r, g] = nums(q); return arco(r, g / 360 * vuelta(1)); },
      q => { const [r, s] = nums(q); return anguloDe(s, r); },
      q => { const [n] = nums(q); return n * 2 * PI_; },
      q => { const [rc, n] = nums(q); return n * vuelta(rc / 100); }],
    'periodo-y-frecuencia': [
      q => { const [rpm] = nums(q); return 60 / rpm; },
      q => { const [T] = nums(q); return vuelta(1) / T; },
      q => { const [rpm] = nums(q); return rpm / 60 * vuelta(1); },
      q => { const [n, tm] = nums(q); return n * vuelta(1) / (60 * tm); }],
    'velocidad-tangencial': [
      q => { const [r, w] = nums(q); return rapidez(w, r); },
      q => { const [ra, va, rb] = nums(q); return rapidez(va / ra, rb); },
      q => { const [r1, w1, r2] = nums(q); return rapidez(w1, r1 / 100) / rapidez(1, r2 / 100); },
      q => { const [ra, wa, rb, rc] = nums(q); return rapidez(rapidez(wa, ra / 100) / rapidez(1, rb / 100), rc / 100); }],
    'rapidez-constante-acelera': [
      q => { const [r, v] = nums(q); return acel(r, u => v / r * u, 0.3)[2]; },
      q => { const [r, w] = nums(q); return acel(r, u => w * u, 0.3)[2]; },
      q => { const [r, kmh] = nums(q); return acel(r, u => kmh / 3.6 / r * u, 0.3)[2]; },
      q => { const [a1] = nums(q); const t = plano(q); const k = /doble/.test(t) ? 2 : /triple/.test(t) ? 3 : 0, kr = /mitad/.test(t) ? 2 : /tercio/.test(t) ? 3 : 0;
        return k ? acel(1, u => k * Math.sqrt(a1) * u, 0.3)[2] : acel(1 / kr, u => Math.sqrt(a1) * kr * u, 0.3)[2]; }],
    mcuv: [
      q => { const [w1, w2, dt] = nums(q); let lo = -100, hi = 100; for (let k = 0; k < 80; k++) { const m = (lo + hi) / 2; if (girar(w1, m, dt)[1] < w2) lo = m; else hi = m; } return (lo + hi) / 2; },
      q => { const [w0, al, t] = nums(q); return girar(w0, al, t)[1]; },
      q => { const x = nums(q); const [w0, al, t] = x.length === 3 ? x : [0, x[0], x[1]]; return girar(w0, al, t)[0]; },
      q => { const [w0, n] = nums(q); const th = n * 2 * PI_; let lo = 0.01, hi = 1000; for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (girar(w0, -w0 / m, m)[0] > th) hi = m; else lo = m; } return (lo + hi) / 2; }],
    'dos-aceleraciones': [
      q => { const [al, r] = nums(q); return acel(r, u => girar(0, al, u)[0], 0.5)[1]; },
      q => { const [r, v, at] = nums(q); return Math.hypot(at, acel(r, u => v / r * u, 0.3)[2]); },
      q => { const [r, at, t] = nums(q); return acel(r, u => girar(0, at / r, u)[0], t)[0]; },
      q => { const [r, at] = nums(q); for (let t = 0.001; t < 20; t += 0.0005) { const a = acel(r, u => girar(0, at / r, u)[0], t); if (a[2] >= a[1]) return t; } return NaN; }],
  };
  for (const i of def.ideas) {
    for (let s = 0; s < 400; s++) {
      const c = i.ahoraTu.generar(s), bien = c.opciones.filter(o => o.correcta);
      assert.equal(bien.length, 1, `${i.id} ${s}`); assert.ok(c.opciones.length >= 3, `${i.id} ${s}: ${c.opciones.length} opciones`);
      assert.equal(new Set(c.opciones.map(o => o.texto)).size, c.opciones.length, `${i.id} ${s}: opciones repetidas`);
      assert.ok(Array.isArray(c.datos) && c.datos.length, `${i.id} ${s}: sin datos`);
      if (s % 10) continue;   // el cálculo aparte es lento: una semilla de cada diez
      const esperado = CALC[i.id][s % 4](c.pregunta);
      cerca(valor(bien[0]), esperado, `${i.id} semilla ${s}: «${plano(c.pregunta)}» → ${plano(bien[0].texto)}`, 6e-3);
    }
  }
});

test('«Así se resuelve» no repite «Ahora tú», y su respuesta cuadra con su comprobación', () => {
  for (const i of def.ideas) {
    const ahora = new Set(Array.from({ length: 40 }, (_, s) => plano(i.ahoraTu.generar(s).pregunta)));
    for (let s = 0; s < 40; s++) {
      const r = i.resuelve.generar(s);
      assert.ok(!ahora.has(plano(r.enunciado)), `${i.id}: «Así se resuelve» ${s} repite «Ahora tú»`);
      assert.deepEqual(r.pasos.map(p => p.tipo), ['pide', 'datos', 'regla', 'cuentas', 'sentido'], i.id);
      assert.ok(Array.isArray(r.datos) && r.datos.length, `${i.id} ${s}: sin datos`);
    }
  }
});

// ---------- Figuras ----------
const pisa = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
test('todas las figuras caben con 4 de margen y ningún rótulo pisa a otro ni a una figura chica', () => {
  let n = 0;
  for (const i of def.ideas) {
    const todas = [];
    for (const v of Teoria.grilla(i.juega.controles).filter((_, k) => k % 3 === 0)) todas.push([`juego ${JSON.stringify(v)}`, i.juega.dibujo(v)]);
    for (const [k, t] of i.lee.tarjetas.entries()) if (t.dibujo) todas.push([`lee ${k + 1}`, t.dibujo]);
    todas.push(['predice', i.predice.dibujo], ['revelar', i.predice.revelar]);
    for (const [k, p] of i.mira.pasos.entries()) todas.push([`mira ${k + 1}`, { datos: i.mira.datos, estado: p.estado }]);
    for (const e of i.ejemplos) todas.push([`ejemplo «${e.titulo}»`, e.figura]);
    for (let s = 0; s < 80; s++) { todas.push([`ahora tú ${s}`, i.ahoraTu.generar(s).dibujo], [`resuelve ${s}`, i.resuelve.generar(s).dibujo]); }
    for (const [nombre, f] of todas) {
      n++;
      const g = P.geometria(f.datos, f.estado || {}), s = P.dibujar(f.datos, f.estado || {}), q = `${i.id} ${nombre}`;
      assert.ok(!/NaN|undefined|Infinity/.test(s), q);
      for (const r of g.rotulos) assert.ok(r.x0 >= 4 - 1e-9 && r.x1 <= 316 + 1e-9 && r.y0 >= 4 - 1e-9 && r.y1 <= g.H - 4 + 1e-9, `${q}: «${r.texto}» se sale`);
      for (let a = 0; a < g.rotulos.length; a++) for (let b = a + 1; b < g.rotulos.length; b++) assert.ok(!pisa(g.rotulos[a], g.rotulos[b]), `${q}: «${g.rotulos[a].texto}» pisa «${g.rotulos[b].texto}»`);
      for (const r of g.rotulos) for (const o of g.objetos.filter(x => x.fig)) assert.ok(!pisa(r, o), `${q}: «${r.texto}» pisa ${o.nombre}`);
      for (const o of g.objetos) assert.ok(o.x0 >= 2 && o.x1 <= 318 && o.y0 >= 2 && o.y1 <= g.H - 2, `${q}: ${o.nombre} se sale`);
    }
  }
  for (const m of def.laboratorio) for (const v of Teoria.grilla(m.controles).filter((_, k) => k % 5 === 0)) {
    n++; const g = P.geometria(m.dibujo(v).datos);
    for (const r of g.rotulos) assert.ok(r.x0 >= 4 - 1e-9 && r.x1 <= 316 + 1e-9 && r.y0 >= 4 - 1e-9 && r.y1 <= g.H - 4 + 1e-9, `mesa ${m.id}: «${r.texto}» se sale`);
  }
  assert.ok(n > 1500, `${n} figuras`);
});

test('ninguna figura de un ejemplo, de «Ahora tú» ni de «Así se resuelve» muestra un número de la respuesta que el enunciado no dio', () => {
  const numerosDe = x => Teoria.numerosDe(plano(x));
  const revisar = (donde, fig, enun, resp) => {
    const dados = numerosDe(enun), enFig = Teoria.numerosDe(Teoria.textoSVG(P.dibujar(fig.datos, fig.estado || {})));
    for (const n of numerosDe(resp)) if (!dados.has(n)) assert.ok(!enFig.has(n), `${donde}: la figura muestra ${n}, que es de la respuesta`);
  };
  for (const i of def.ideas) {
    for (const e of i.ejemplos) revisar(`${i.id} «${e.titulo}»`, e.figura, [e.enunciado, e.alternativas || [], e.datos], e.respuesta);
    for (let s = 0; s < 80; s++) {
      const a = i.ahoraTu.generar(s), r = i.resuelve.generar(s);
      revisar(`${i.id} ahora tú ${s}`, a.dibujo, [a.pregunta, a.datos], a.opciones.find(o => o.correcta).texto);
      revisar(`${i.id} resuelve ${s}`, r.dibujo, [r.enunciado, r.datos], r.respuesta);
    }
  }
});

// ---------- El validador ----------
test('la unidad pasa el validador común, y con calidad: 2 simulada pasa todas sus reglas', () => {
  const cat = require('../../../catalogo/cursos/fisica.json'), temas = cat.unidades.find(x => x.id === def.unidad).temas;
  let p = Teoria.problemas(def, { temas, semillas: 60 });
  assert.deepEqual(p, [], p.join('\n'));
  p = Teoria.problemas(Object.assign({}, def, { calidad: 2 }), { temas, semillas: 60 });
  assert.deepEqual(p, [], p.join('\n'));
});

// ---------- Correcciones de la auditoría y del lector en frío (19 nov; rutinas/auditoria/fisica.movimiento-circular.md) ----------
const GEN_CIRC = ['circular-mcu', 'circular-encuentros', 'circular-transmision', 'circular-mcuv', 'circular-enesimo-segundo', 'circular-horaria',
  'circular-grafica', 'circular-aceleracion-total', 'circular-giro-combinado'].map(id => [id, require(`../../../plantillas/${id}/generador.js`)]);
const textoCaso = c => plano([c.pregunta || c.enunciado, ' ', ...(c.opciones || []).map(o => [o.texto, ' ', o.siFuera || '', ' ']), c.solucion ? [c.solucion.texto, ' ', c.solucion.ecuacion] : '',
  ...(c.pasos || []).map(p => [p.texto, ' ', p.ecuacion || '']), ' ', c.respuesta || '']);

test('auditoría M4: los múltiplos de π van con su fracción exacta, nunca un coeficiente redondeado con «=»', () => {
  for (const i of def.ideas) for (let s = 0; s < 400; s++) for (const c of [i.ahoraTu.generar(s), i.resuelve.generar(s)]) {
    const t = textoCaso(c);
    assert.ok(!/\d,\d+π/.test(t), `${i.id} semilla ${s}: «${(t.match(/[^ ]*\d,\d+π[^ ]*/) || [])[0]}»`);
  }
});

test('auditoría A1: el glosario no da la clave de las Predice de B4 y B6', () => {
  const g = Object.fromEntries(def.glosario.map(x => [x.termino, x]));
  const todo = x => [x.def, x.simple, ...x.ejemplos].join(' ');
  assert.ok(!/moto|óvalo|siempre/.test(todo(g['aceleración centrípeta'])), 'la centrípeta no usa la moto del óvalo que va siempre a la misma rapidez');
  assert.ok(!/más rápido o más lento|cambia la rapidez/.test(todo(g['aceleración tangencial'])), 'la tangencial no dice que mide el cambio de rapidez');
  assert.ok(!/parejo/.test(todo(g['aceleración angular'])), 'α no dice qué pasa si gira parejo');
});

test('auditoría M5: «Ahora tú» trae siempre 4 opciones distintas', () => {
  for (const i of def.ideas) for (let s = 0; s < 400; s++) {
    const o = i.ahoraTu.generar(s).opciones;
    assert.equal(o.length, 4, `${i.id} semilla ${s}: ${o.map(x => x.texto).join(' | ')}`);
    assert.equal(new Set(o.map(x => x.texto)).size, 4, `${i.id} semilla ${s}`);
  }
});

test('auditoría M6: las explicaciones de los distractores se pueden rehacer con el enunciado', () => {
  const e414 = idea('rapidez-constante-acelera').ejemplos.find(e => e.titulo === 'En media vuelta');
  assert.match(plano(e414.enunciado), /20 m de radio/, 'la D (v²/r) necesita el radio del óvalo');
  const e515 = idea('mcuv').ejemplos.find(e => e.titulo === 'Lo del cuarto segundo');
  assert.match(plano(e515.solucion.at(-1).texto), /\(4 − 3\)²/, 'la D usa (4 − 3)², no «olvida restar» (eso es la A)');
  cerca(2 * 14 / (4 - 3) ** 2, num(e515.alternativas[3].replace(/ rad.*/, '')), 'la D');
});

test('auditoría M7 y lector: Mira no usa la fórmula antes de la regla; R tiene un solo significado; nada sale de la nada', () => {
  const m5 = idea('mcuv').mira.pasos;
  for (const p of m5.slice(0, 3)) assert.ok(!/½/.test(plano([p.texto, p.ecuacion])), `B5, Mira: «${plano(p.texto)}» usa θ = ½αt² antes del último paso`);
  const m6 = plano([idea('dos-aceleraciones').mira.pasos[0].texto, idea('dos-aceleraciones').mira.pasos[0].ecuacion]);
  assert.match(m6, /= 2 m\/s²/, 'B6, Mira: a_T sale de lo que gana cada segundo'); assert.match(m6, /1 rad\/s²/, 'y α = a_T ÷ r a la vista');
  assert.ok(!/ o /.test(def.letras.R), 'R: un solo significado');
  for (const p of idea('velocidad-tangencial').mira.pasos) assert.ok(!/R/.test(plano(p.ecuacion)), 'B3, Mira: el radio del plato es r');
  assert.ok(!/λ|latitud/.test(idea('velocidad-tangencial').regla.condicion), 'B3: la latitud va en los Datos de sus ejercicios');
  assert.match(idea('rapidez-constante-acelera').regla.condicion, /ω, la velocidad angular/, 'B4: la regla dice qué es ω');
  assert.ok(!idea('arco-y-radian').predice.datos.some(d => /6 rad/.test(plano(d))), 'B1: los datos de Predice no dicen hasta dónde llegó el juego');
  assert.match(plano(idea('arco-y-radian').lee.tarjetas[1].texto), /Si llevaste Trigonometría/, 'B1 no da por sabida una unidad que no pide');
});

test('auditoría M9: una igualdad por renglón en las reglas; los Datos empiezan por la fórmula', () => {
  // Las tres que los lectores vieron partidas a 390 px: «; 1 vuelta =» / «2π rad = 360°», «ω = θ/t =» / «2π/T», «a =» / la raíz.
  for (const id of ['arco-y-radian', 'periodo-y-frecuencia', 'dos-aceleraciones']) assert.ok((plano(idea(id).regla.ecuacion).match(/=/g) || []).length <= 2, `${id}: la regla tiene más de dos «=»`);
  for (const id of ['rapidez-constante-acelera', 'dos-aceleraciones']) for (const e of idea(id).ejemplos) for (const d of e.datos) {
    const t = plano(d); if (/centrípeta|total/.test(t) && /=/.test(t)) assert.ok(!/^Aceleración/.test(t), `${id} «${e.titulo}»: «${t}» empieza con un rótulo largo`);
  }
});

test('lector en frío: leyendas, consignas y figuras corregidas', () => {
  assert.match(plano(idea('mcuv').juega.leyenda[0].t), /instante/, 'B5: ω es lo de ese instante');
  assert.match(idea('periodo-y-frecuencia').juega.consigna, /cronómetro corre solo/, 'B2: para qué es el cronómetro');
  // B1: el rótulo del radio va afuera de la rueda (los rayos lo tachaban).
  const g1 = P.geometria(idea('arco-y-radian').juega.dibujo({ th: 1 }).datos);
  const r8 = g1.rotulos.find(r => r.texto === 'r = 8 m'); assert.ok(r8 && r8.x1 < 150 - 80, 'r = 8 m afuera del aro');
  // B1, juego: el rótulo del arco no cruza las patas del soporte, en toda la grilla.
  for (let th = 0.25; th <= 6; th += 0.25) {
    const d = idea('arco-y-radian').juega.dibujo({ th }).datos, g = P.geometria(d), s = g.rotulos.find(r => /^s = /.test(r.texto));
    for (const sg of [-1, 1]) { const x1 = 150, y1 = 116 + 24, x2 = 150 + sg * 0.62 * 80, y2 = 116 + 98, k = 40;
      for (let q = 0; q <= k; q++) { const x = x1 + (x2 - x1) * q / k, y = y1 + (y2 - y1) * q / k; assert.ok(!(x > s.x0 + 1 && x < s.x1 - 1 && y > s.y0 + 1 && y < s.y1 - 1), `th = ${th}: «${s.texto}» sobre la pata`); } }
  }
  // B3: «Beto» junto a su caballo, no sobre el eje.
  for (const t of [0, 2, 3, 6, 9]) { const g = P.geometria(idea('velocidad-tangencial').juega.dibujo({ ra: 3, rb: 1.5, t }).datos), b = g.rotulos.find(r => r.texto === 'Beto');
    assert.ok(!(b.x0 < 160 + 22 && b.x1 > 160 - 22 && b.y0 < 118 + 22 && b.y1 > 118 - 22), `t = ${t}: «Beto» sobre el eje`); }
  // B3, «Ahora tú»: el cuerpo que nombra el texto y la flecha en la punta del radio.
  for (let s = 0; s < 200; s += 4) { const a = idea('velocidad-tangencial').ahoraTu.generar(s), d = a.dibujo.datos, q = plano(a.pregunta);
    if (/aspa/.test(q)) assert.equal(d.cuerpos[0].tipo, 'ventilador', q);
    assert.equal(d.flechas[0].ang, d.radios[0].ang, `${q}: la flecha va en la punta del radio dibujado`); }
  // Tarjetas del lector B.
  const ej = (id, t) => idea(id).ejemplos.find(e => e.titulo === t);
  assert.ok(ej('arco-y-radian', 'La punta del minutero').figura.datos.arcos.some(a => a.texto === '?'), '1.08: el reloj marca el camino de 20 min');
  assert.ok(!ej('arco-y-radian', 'La punta del minutero').datos.some(d => /horario/.test(plano(d))), '1.08: sin el horario que no se usa');
  assert.ok(ej('velocidad-tangencial', 'El balde y la polea doble').figura.datos.textos.some(t => /soga/.test(t.texto)), '3.14: qué garganta lleva la soga');
  assert.ok(ej('rapidez-constante-acelera', 'El radio de la curva').figura.datos.flechas.some(f => f.dir === 'centro'), '4.03: a_c con su flecha');
  for (const t of ['La α con la tangencial', 'Con α y con ω']) assert.equal(ej('dos-aceleraciones', t).figura.datos.cuerpos[0].tipo, 'ventilador', `${t}: dice ventilador y dibuja un ventilador`);
  // B6: la regla tiene su dibujo, con las dos partes y la total.
  assert.equal(idea('dos-aceleraciones').regla.dibujo.datos.flechas.filter(f => f.color === 'h').length, 3);
  // Ningún «ₒ» (letra o) donde va el subíndice 0.
  assert.ok(!/ₒ/.test(require('node:fs').readFileSync(path.join(__dirname, 'movimiento-circular.js'), 'utf8')));
});

test('auditoría M2 y M3: la práctica usa los colores y los nombres de la unidad', () => {
  const PAL = new Set(['o', 'i', 'f', 'h', 'tinta']);
  for (const [id, G] of GEN_CIRC) for (const ideaId of Object.keys(G.TIPOS_POR_IDEA)) for (let s = 0; s < 200; s++) {
    const p = G.generar(s, { unidad: def.unidad, idea: ideaId }), t = JSON.stringify([p.enunciado, p.pregunta, p.solucion, p.alternativas, p.datos]);
    assert.ok(!/rapidez angular/.test(t), `${id} semilla ${s}: «rapidez angular» (la unidad dice velocidad angular)`);
    for (const [k, v] of Object.entries(p.variables)) {
      assert.ok(PAL.has(v.color), `${id} semilla ${s}: ${k} (${v.nombre}) en ${v.color}`);
      const n = v.nombre;
      if (/^aceleraci/.test(n)) assert.equal(v.color, 'h', `${id}: ${n}`);
      if (/^(tiempo|intervalo)/.test(n)) assert.equal(v.color, 'i', `${id}: ${n}`);
      if (/^(ángulo|vueltas|posición angular)/.test(n)) assert.equal(v.color, 'f', `${id}: ${n}`);
      if (/^velocidad angular/.test(n)) assert.equal(v.color, 'o', `${id}: ${n}`);
    }
    if (p._datos.vueltas) assert.ok(p.datos.some(d => /vueltas\/s²/.test(d)), `${id} semilla ${s}: la unidad «vueltas/s²» se dice en los Datos`);
  }
  // La escena «El disco y sus flechas» con las variables CSS de la unidad (naranja, turquesa, violeta y carmín).
  const html = require('node:fs').readFileSync(path.join(__dirname, '..', '..', '..', 'plantillas', 'movimiento-circular', 'index.html'), 'utf8');
  const claro = Object.fromEntries([...html.match(/:root\{[^}]*\}/)[0].matchAll(/--c-(\w+):(#[0-9a-f]{6})/g)].map(m => [m[1], m[2]]));
  assert.deepEqual([claro.v, claro.w, claro.t, claro.th, claro.a, claro.at, claro.alfa], ['#a95300', '#a95300', '#07746e', '#6b3dbd', '#c02a5c', '#c02a5c', '#c02a5c']);
  assert.ok(!/flechas? (ocres?|verdes?|moradas?)|cursor naranja/.test(html), 'la escena no nombra los colores de antes');
});
