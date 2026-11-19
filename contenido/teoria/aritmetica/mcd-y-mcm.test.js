// Pruebas propias de «MCD y MCM» (además del validador común de contenido/teoria/teoria.test.js).
// Etapa 7 (19 nov): las seis ideas pasan por el contrato, con la propuesta docs/etapa7/propuesta-aritmetica.md como guion.
//   - seis ideas en el orden de la propuesta (tres conservan su id con otra Predice; dos son nuevas; la vieja
//     `fraccion-continua` entró en `euclides`); con calidad 2 desde el cierre (lector en frío y auditor);
//   - un color fijo por magnitud (propuesta §7): cada ficha de color dice su magnitud (m) y lleva el color de def.colores;
//     nunca verde ni carmín en las figuras de las ideas; letras de alternativa en negrita y sin color;
//   - cada misión se cumple con un solo caso de la grilla y no al abrir; su «bien» no dice la respuesta de la predicción;
//   - Predice: un código de error por opción, una sola correcta, datos sin fórmulas, nada de lo de antes trae su respuesta,
//     y cada distractor da el valor de su error (rehecho aquí);
//   - «Ahora tú» trae cuatro opciones distintas en 400 semillas, con datos, y su respuesta cuadra con una cuenta aparte
//     (fuerza bruta, sin el código de la unidad); «Así se resuelve» cuadra;
//   - toda igualdad numérica escrita es cierta en 400 semillas (auditoría de Divisibilidad, A1);
//   - 15 ejemplos por idea que suben de nivel, con datos; los de nivel 3, con cinco alternativas, una sola que cuadra y
//     cada trampa nombrada; la respuesta de cada ejemplo, rehecha por fuerza bruta;
//   - el circulito se dice en los Datos de todo ejercicio que lo usa; notación: × y nunca «·».
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../../../nucleo/kit/kit.js');
const Glosario = require('../../../nucleo/glosario.js');
const E = require('../../../nucleo/ecuacion.js');
const def = require('./mcd-y-mcm.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const PZ = id => Kit.piezas[id];
const ID = ['mcd-cintas', 'mcm-coinciden', 'mcd-por-mcm', 'mismo-resto', 'multiplos-tramo', 'euclides'];
const SEMILLAS = 400;
const idea = id => def.ideas.find(i => i.id === id);

const fichas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(fichas)
  : typeof x.v === 'string' && /^c-/.test(x.v) ? [x] : Object.values(x).flatMap(fichas));
const negritas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(negritas)
  : x.negrita ? [x] : Object.values(x).flatMap(negritas));
const plano = x => E.texto(x === undefined || x === null ? '' : Array.isArray(x) ? x : [x]);
// Texto con las potencias como «2^3» y las fracciones como «(a)/(b)»: lo usa el comprobador de igualdades.
const cuenta = x => (x === null || x === undefined ? '' : typeof x === 'string' || typeof x === 'number' ? String(x) : Array.isArray(x) ? x.map(cuenta).join('')
  : x.sup ? `${cuenta(x.sup[0])}^(${cuenta(x.sup[1])})` : x.mult ? `múltiplo de ${cuenta(x.mult)}` : x.frac ? `((${cuenta(x.frac[0])})/(${cuenta(x.frac[1])}))`
    : x.sub ? `${cuenta(x.sub[0])}${cuenta(x.sub[1])}` : x.llave ? cuenta(x.llave) : x.negrita ? cuenta(x.negrita) : x.par ? `(${cuenta(x.par)})` : x.t !== undefined ? String(x.t) : '');
const svgDe = (dib, pz) => PZ((dib && dib.pieza) || pz).dibujar(dib.datos, dib.estado || {});

// ---------- Cuentas aparte (fuerza bruta: no usan la unidad) ----------
const GCD = (a, b) => { let d = 1; for (let k = 1; k <= Math.min(a, b); k++) if (a % k === 0 && b % k === 0) d = k; return d; };
const LCM = (...xs) => { for (let m = Math.max(...xs); ; m++) if (xs.every(x => m % x === 0)) return m; };
const GCDL = (...xs) => xs.reduce((u, v) => GCD(u, v));
const SUPS = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };
const desdeCanon = t => t.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, z => '^' + [...z].map(c => SUPS[c]).join('')).split('×').map(x => x.trim()).reduce((u, f) => { const [b, e] = f.split('^').map(Number); return u * b ** (e || 1); }, 1);
const CANON = n => { const o = []; for (let p = 2; n > 1; p++) { let e = 0; while (n % p === 0) { n /= p; e++; } if (e) o.push(e > 1 ? p + [...String(e)].map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]).join('') : String(p)); } return o.join(' × ') || '1'; };
const sinEsp = t => String(t).replace(/[\s   ]/g, '');
const numeros = t => (String(t).replace(/(\d)[    ](?=\d{3}\b)/g, '$1').match(/\d+/g) || []).map(Number);
const cuentaEn = (lo, hi, ok) => { let c = 0; for (let x = lo; x <= hi; x++) if (ok(x)) c++; return c; };

// Toda igualdad entre cuentas de enteros escrita en un texto es cierta: «24 = 2³ × 3», «12 × 8 + 3 = 99».
function igualdadesFalsas(t) {
  const s = String(t).replace(/(\d)[    ](?=\d{3}\b)/g, '$1').replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, m => `^${[...m].map(c => SUPS[c]).join('')}`);
  const malas = [];
  for (const m of s.matchAll(/[\d()^×+−÷=/ ]+/g)) {
    const tramo = m[0].trim();
    if (!tramo.includes('=') || /^[×+−÷=^)/]/.test(tramo) || /[×+−÷=^(/]$/.test(tramo)) continue;
    const antes = s.slice(0, m.index).replace(/\s+$/, '').slice(-1), despues = s.slice(m.index + m[0].length).replace(/^\s+/, '').slice(0, 1);
    if (/[.,√:;[\]]/.test(antes) || /[,:;\]]/.test(despues) && /\d$/.test(tramo) && /^[,]/.test(despues) && /\d/.test(s[m.index + m[0].length + 1] || '')) continue;
    if (antes === '(' || /\p{L}/u.test(antes) && /^\(/.test(tramo)) continue;
    const lados = tramo.split('=').map(x => x.trim());
    const val = x => { if ((x.match(/\(/g) || []).length !== (x.match(/\)/g) || []).length || !/\d/.test(x)) return NaN; try { return Function(`return (${x.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/\^/g, '**')})`)(); } catch (e) { return NaN; } };
    const vs = lados.map(val);
    if (vs.some(v => Number.isNaN(v))) continue;
    if (vs.some(v => Math.abs(v - vs[0]) > 1e-9)) malas.push(tramo);
  }
  return malas;
}
test('el comprobador de igualdades ve las falsas y deja pasar las ciertas', () => {
  assert.deepEqual(igualdadesFalsas('24 = 2³ × 3 y 12 × 8 + 3 = 99'), []);
  assert.deepEqual(igualdadesFalsas('((91)/(35)) = 2 + ((1)/(1 + ((1)/(1 + ((1)/(2))))))'), []);
  assert.deepEqual(igualdadesFalsas('35 = 5 × 6'), ['35 = 5 × 6']);
  assert.deepEqual(igualdadesFalsas('30 + 20 − 10 = 50'), ['30 + 20 − 10 = 50']);
});

// Todo lo que se lee en una idea, con «Ahora tú» y «Así se resuelve» en muchas semillas.
function grilla(cs) {
  let g = [{}];
  for (const c of cs) { const vs = c.opciones ? c.opciones.map(o => o.valor) : Array.from({ length: Math.round((c.max - c.min) / c.paso) + 1 }, (_, k) => c.min + k * c.paso); g = g.flatMap(x => vs.map(v => Object.assign({}, x, { [c.id]: v }))); }
  return g;
}
function textosDe(I, n = SEMILLAS) {
  const out = [];
  const push = (x, donde) => out.push([cuenta(x), donde]);
  (I.lee ? I.lee.tarjetas : []).forEach((t, i) => { push(t.texto, `lee ${i}`); if (t.ecuacion) push(t.ecuacion, `lee ${i}`); });
  for (const v of grilla(I.juega.controles)) push(I.juega.lectura(v), `lectura ${JSON.stringify(v)}`);
  push(I.juega.mision.bien, 'bien');
  I.predice.opciones.forEach(o => o.siFuera && push(o.siFuera, `siFuera ${o.id}`));
  (I.predice.datos || []).forEach(d => push(d, 'datos de predice'));
  I.mira.pasos.forEach((p, i) => { push(p.texto, `mira ${i}`); if (p.ecuacion) push(p.ecuacion, `mira ${i}`); });
  push(I.regla.texto, 'regla'); push(I.regla.ecuacion, 'regla'); push(I.regla.condicion, 'condición');
  (I.ejemplos || []).forEach((e, i) => { push(e.enunciado, `ejemplo ${i + 1}`); e.solucion.forEach(p => { push(p.texto, `ejemplo ${i + 1}`); if (p.ecuacion) push(p.ecuacion, `ejemplo ${i + 1}`); }); push(e.respuesta, `ejemplo ${i + 1}`); (e.datos || []).forEach(d => push(d, `ejemplo ${i + 1} datos`)); });
  for (let s = 0; s < n; s++) {
    const a = I.ahoraTu.generar(s);
    push(a.pregunta, `ahora ${s}`); push(a.solucion.texto, `ahora ${s}`); push(a.solucion.ecuacion, `ahora ${s}`);
    a.opciones.forEach(o => o.siFuera && push(o.siFuera, `ahora ${s} ${o.id}`));
    (a.datos || []).forEach(d => push(d, `ahora ${s} datos`));
    if (s < 100) { const r = I.resuelve.generar(s); push(r.enunciado, `resuelve ${s}`); r.pasos.forEach(p => { push(p.texto, `resuelve ${s}`); if (p.ecuacion) push(p.ecuacion, `resuelve ${s}`); }); push(r.respuesta, `resuelve ${s}`); }
  }
  return out;
}

test('seis ideas en el orden de la propuesta, con sus id; la tabla de letras y los colores', () => {
  assert.deepEqual(def.ideas.map(i => i.id), ID);
  assert.equal(def.septimaIdea, undefined);
  assert.equal(def.calidad, 2, 'cerrada el 19 nov tras el lector en frío y el auditor');
  assert.deepEqual(def.colores, { divisor: 'i', multiplo: 'f', sobra: 'o' });
  for (const l of ['A', 'B', 'C', 'N', 'k', 'p', 'q', 'r', 'r_e', 'L']) assert.ok(def.letras[l], `tabla de letras: ${l}`);
});

test('colores: cada ficha dice su magnitud y lleva su color; sin verde ni carmín en las ideas; letras de alternativa sin color', () => {
  for (const I of def.ideas) {
    const cs = I.juega.controles;
    const todo = [I.lee, I.juega.leyenda, I.juega.mision, I.predice, I.mira, I.regla, I.ejemplos];
    for (let s = 0; s < 60; s++) { todo.push(I.ahoraTu.generar(s)); if (s < 12) todo.push(I.resuelve.generar(s)); }
    for (const v of grilla(cs).slice(0, 40)) todo.push(I.juega.lectura(v));
    const fs = fichas(todo);
    assert.ok(fs.length > 40, `${I.id}: fichas ${fs.length}`);
    for (const x of fs) {
      assert.ok(x.m && def.colores[x.m], `${I.id}: ficha sin magnitud: ${JSON.stringify(x)}`);
      assert.equal(x.v, `c-${def.colores[x.m]}`, `${I.id}: ${JSON.stringify(x)}`);
    }
    for (const c of cs) assert.ok(!c.color || /^c-[iof]$/.test(c.color), `${I.id}: control ${c.id} en ${c.color}`);
    const svgs = [];
    for (const t of (I.lee ? I.lee.tarjetas : [])) if (t.dibujo) svgs.push(svgDe({ pieza: t.pieza || I.pieza, datos: t.dibujo.datos, estado: t.dibujo.estado }, I.pieza));
    for (const v of grilla(cs)) svgs.push(svgDe(I.juega.dibujo(v), I.juega.pieza || I.pieza));
    svgs.push(svgDe(I.predice.dibujo, I.predice.pieza || I.pieza), svgDe(I.predice.revelar, I.predice.pieza || I.pieza));
    I.mira.pasos.forEach(p => svgs.push(PZ(I.mira.pieza || I.pieza).dibujar(I.mira.datos, p.estado)));
    if (I.regla.dibujo) svgs.push(svgDe(I.regla.dibujo, I.pieza));
    I.ejemplos.forEach(e => { if (e.figura) svgs.push(svgDe(e.figura, I.pieza)); });
    for (const s of svgs) assert.ok(!/var\(--c-[hd]\)/.test(s) && !/NaN|undefined/.test(s), `${I.id}: una figura usa carmín o verde, o muestra NaN`);
    for (const n of negritas(I.ejemplos)) { assert.match(plano(n.negrita), /^[A-E]$/); assert.equal(fichas(n).length, 0); }
  }
  // Las mesas del laboratorio tampoco usan verde ni carmín (antes el MCD iba en verde y el MCM en rojo).
  for (const m of def.laboratorio) for (const c of m.controles) assert.ok(!c.color || /^c-[iof]$/.test(c.color), `${m.id}: ${c.id}`);
});

test('misiones: una sola manera en la grilla, no cumplidas al abrir; su «bien» no dice la respuesta de la predicción', () => {
  for (const I of def.ideas) {
    const cs = I.juega.controles, g = grilla(cs);
    const cumplen = g.filter(v => I.juega.mision.logrado(v) === true);
    assert.equal(cumplen.length, 1, `${I.id}: la misión se cumple de ${cumplen.length} maneras`);
    const inicio = Object.fromEntries(cs.map(c => [c.id, c.inicio !== undefined ? c.inicio : c.opciones[0].valor]));
    assert.equal(I.juega.mision.logrado(inicio), false, `${I.id}: cumplida al abrir`);
    const correcta = I.predice.opciones.find(o => o.correcta).texto;
    const n = (correcta.match(/\d+/) || [''])[0];
    if (n.length >= 2) assert.ok(!new RegExp(`(?<!\\d)${n}(?!\\d)`).test(I.juega.mision.bien + I.juega.mision.texto + plano(I.juega.consigna)), `${I.id}: el juego dice ${n}`);
  }
  // Aparte, por fuerza bruta: con 18 y 30, el trozo más largo es 6; solo 4 y 10 dan 20; solo 12 y 16 dan MCD 4 y MCM 48;
  // de 40 a 55 solo 49 deja 1 con 4 y 6; solo 3 y 10 dejan 24 boletos con premio; solo 60 y 38 piden seis divisiones.
  assert.equal(GCD(18, 30), 6);
  assert.deepEqual([3, 4, 5, 6].flatMap(a => [7, 8, 10, 15].filter(b => LCM(a, b) === 20).map(b => `${a}-${b}`)), ['4-10']);
  assert.deepEqual([12, 18, 20].flatMap(a => [8, 15, 16, 30].filter(b => GCD(a, b) === 4 && LCM(a, b) === 48).map(b => `${a}-${b}`)), ['12-16']);
  assert.deepEqual([40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55].filter(x => x % 4 === 1 && x % 6 === 1), [49]);
  assert.deepEqual([3, 4, 5].flatMap(a => [6, 10, 15].filter(b => cuentaEn(1, 60, x => x % a === 0 || x % b === 0) === 24).map(b => `${a}-${b}`)), ['3-10']);
  const divs = (a, b) => { let n = 0; while (b) { [a, b] = [b, a % b]; n++; } return n; };
  assert.deepEqual([48, 60, 84, 90].flatMap(a => [24, 26, 35, 38].filter(b => divs(a, b) === 6).map(b => `${a}-${b}`)), ['60-38']);
});

test('Predice: un código distinto por opción, una sola correcta, datos sin fórmulas; lo de antes no trae su respuesta', () => {
  for (const I of def.ideas) {
    const ops = I.predice.opciones;
    assert.equal(ops.filter(o => o.correcta).length, 1);
    const codigos = ops.filter(o => !o.correcta).map(o => o.error);
    assert.equal(new Set(codigos).size, codigos.length, `${I.id}: códigos repetidos ${codigos}`);
    for (const d of I.predice.datos || []) assert.ok(!/MCD|MCM|×.*=|÷/.test(plano(d)) || /^\d+ = \d+ × \d+ \+ \d+$/.test(plano(d)), `${I.id}: dato con forma de fórmula: ${plano(d)}`);
    const antes = [plano(I.juega.consigna), I.juega.mision.texto, I.juega.mision.bien, ...I.juega.leyenda.map(l => plano(l.s) + ' ' + plano(l.t)),
      ...(I.lee ? I.lee.tarjetas.map(t => plano(t.texto) + ' ' + plano(t.ecuacion || '')) : [])].join(' | ');
    const n = (ops.find(o => o.correcta).texto.match(/\d+/) || [''])[0];
    if (n.length >= 2) assert.ok(!new RegExp(`(?<!\\d)${n}(?!\\d)`).test(antes), `${I.id}: lo de antes dice ${n}`);
  }
  const op = (id, err) => idea(id).predice.opciones.find(o => (err ? o.error === err : o.correcta)).texto;
  // Idea 1: rollos de 24 y 36.
  assert.equal(op('mcd-cintas'), `${GCD(24, 36)} m`);
  assert.equal(op('mcd-cintas', 'AR13'), `${LCM(24, 36)} m`);
  assert.ok(24 % 6 === 0 && 36 % 6 === 0 && 6 < GCD(24, 36), 'AT-NOMAX: 6 es un divisor común menor');
  assert.equal(op('mcd-cintas', 'AT-MENOR'), '24 m'); assert.equal(36 % 24, 12);
  // Idea 2: caramelo cada 12, gaseosa cada 18.
  assert.equal(op('mcm-coinciden'), String(LCM(12, 18)));
  assert.equal(op('mcm-coinciden', 'AR13'), String(GCD(12, 18)));
  assert.equal(op('mcm-coinciden', 'AT-PRODUCTO'), String(12 * 18));
  assert.equal(op('mcm-coinciden', 'AT-SUMA'), String(12 + 18)); assert.ok(30 % 12 !== 0);
  // Idea 3: 4, 6 y 10.
  assert.equal(op('mcd-por-mcm'), String(GCDL(4, 6, 10) * LCM(4, 6, 10)));
  assert.equal(op('mcd-por-mcm', 'AT-TRES'), String(4 * 6 * 10));
  assert.equal(op('mcd-por-mcm', 'AT-MCM-PRODUCTO'), String(GCDL(4, 6, 10) * 4 * 6 * 10));
  assert.equal(op('mcd-por-mcm', 'AT-OLVIDA-TERCERO'), String(GCDL(4, 6, 10) * LCM(4, 6)));
  // Idea 4: sobra 1 con 4, 6 y 10, más de 10.
  const n4 = (() => { for (let x = 11; ; x++) if (x % 4 === 1 && x % 6 === 1 && x % 10 === 1) return x; })();
  assert.equal(op('mismo-resto'), String(n4));
  assert.equal(op('mismo-resto', 'AT-RESTO-PRODUCTO'), String(4 * 6 * 10 + 1));
  assert.equal(op('mismo-resto', 'AT-RESTO-DOS'), String((() => { for (let x = 2; ; x++) if (x % 4 === 1 && x % 6 === 1) return x; })())); assert.equal(13 % 10, 3);
  assert.equal(op('mismo-resto', 'AT-RESTO-OLVIDA'), String(n4 - 1));
  // Idea 5: 120 boletos, 4 y 6.
  const al = cuentaEn(1, 120, x => x % 4 === 0 || x % 6 === 0), c4 = cuentaEn(1, 120, x => x % 4 === 0), c6 = cuentaEn(1, 120, x => x % 6 === 0), c12 = cuentaEn(1, 120, x => x % 4 === 0 && x % 6 === 0);
  assert.equal(op('multiplos-tramo'), String(al));
  assert.equal(op('multiplos-tramo', 'AT-IE-SUMA'), String(c4 + c6));
  assert.equal(op('multiplos-tramo', 'AT-IE-DOBLE'), String(c4 + c6 - 2 * c12));
  assert.equal(op('multiplos-tramo', 'AT-IE-SOLO-AMBOS'), String(c12));
  // Idea 6: 91 y 35; el MCD de los dos pares es el mismo, y 91 = 2 × 35 + 21.
  assert.equal(GCD(91, 35), GCD(35, 21)); assert.equal(91 - 2 * 35, 21);
  assert.equal(op('euclides'), 'Son iguales');
  assert.equal(GCD(91, 35), 7);
});

// ---------- Recálculo de «Ahora tú» por idea (fuerza bruta a partir del texto de la pregunta) ----------
const desdeComa = t => Number(String(t).replace(',', '.'));
const RECALCULO = {
  'mcd-cintas'(p, ops) {
    let m;
    if ((m = p.match(/Dos rollos de cinta miden (\d+) m y (\d+) m.*¿Cuánto mide cada trozo\?/))) return `${GCD(+m[1], +m[2])} m`;
    if ((m = p.match(/Dos rollos de cinta miden (\d+) m y (\d+) m.*¿Cuántos trozos salen en total\?/))) { const g = GCD(+m[1], +m[2]); return String((+m[1] + +m[2]) / g); }
    if ((m = p.match(/Tres rollos miden (\d+) m, (\d+) m y (\d+) m/))) return `${GCDL(+m[1], +m[2], +m[3])} m`;
    if ((m = p.match(/^A = (.+) y B = (.+)\. ¿Cuál es el MCD de A y B\?$/))) return CANON(GCD(desdeCanon(m[1]), desdeCanon(m[2])));
    if ((m = p.match(/mide ([\d,]+) m y otro, ([\d,]+) m/))) return `${GCD(Math.round(desdeComa(m[1]) * 100), Math.round(desdeComa(m[2]) * 100))} cm`;
    if ((m = p.match(/terreno rectangular de (\d+) m por (\d+) m/))) { const g = GCD(+m[1], +m[2]); return String((+m[1] / g) * (+m[2] / g)); }
    throw new Error(`sin recálculo: ${p}`);
  },
  'mcm-coinciden'(p) {
    let m;
    if ((m = p.match(/ganan caramelo los boletos múltiplos de (\d+) y gaseosa los múltiplos de (\d+)/))) return String(LCM(+m[1], +m[2]));
    if ((m = p.match(/sonaron juntas a las (\d+):00\. Una suena cada (\d+) minutos y la otra cada (\d+)/))) { const t = +m[1] * 60 + LCM(+m[2], +m[3]); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`; }
    if ((m = p.match(/Tres pastillas se toman cada (\d+), cada (\d+) y cada (\d+) horas/))) return `${LCM(+m[1], +m[2], +m[3])} h`;
    if ((m = p.match(/^A = (.+) y B = (.+)\. ¿Cuál es el MCM de A y B\?$/))) return CANON(LCM(desdeCanon(m[1]), desdeCanon(m[2])));
    if ((m = p.match(/Uno llega cada (\d+) días y el otro cada (\d+)\. ¿Dentro de cuántos días llegan juntos por (tercera|cuarta) vez/))) {
      const k = { tercera: 3, cuarta: 4 }[m[3]], juntos = []; for (let d = 0; juntos.length < k; d++) if (d % +m[1] === 0 && d % +m[2] === 0) juntos.push(d);
      return `${juntos[k - 1]} días`;
    }
    if ((m = p.match(/cada (\d+), cada (\d+) y cada (\d+) horas\. A las \d+:00 tomó las tres/))) {
      const ps = [+m[1], +m[2], +m[3]]; let juntas = 0, tomas = 0;
      for (let h = 0; juntas < 3; h++) { const t = ps.filter(x => h % x === 0).length; tomas += t; if (t === 3) juntas++; }
      return String(tomas);
    }
    throw new Error(`sin recálculo: ${p}`);
  },
  'mcd-por-mcm'(p) {
    let m;
    const pares = (g, M) => { const o = []; for (let a = 1; a <= M; a++) for (let b = a + 1; b <= M; b++) if (M % a === 0 && M % b === 0 && GCD(a, b) === g && LCM(a, b) === M) o.push([a, b]); return o; };
    if ((m = p.match(/El MCD de dos números es (\d+) y su MCM es (\d+)\. Uno de ellos es (\d+)\. ¿Cuál es el otro\?/))) {
      const [g, M, A] = [+m[1], +m[2], +m[3]], s = []; for (let B = 1; B <= M; B++) if (GCD(A, B) === g && LCM(A, B) === M) s.push(B);
      assert.equal(s.length, 1, p); return String(s[0]);
    }
    if ((m = p.match(/Dos números multiplicados dan ([\d\s  ]+) y su MCD es (\d+)\. ¿Cuál es su MCM\?/))) {
      const P = numeros(m[1])[0], g = +m[2], s = new Set(); for (let a = 1; a * a <= P; a++) if (P % a === 0 && GCD(a, P / a) === g) s.add(LCM(a, P / a));
      assert.equal(s.size, 1, p); return String([...s][0]);
    }
    if ((m = p.match(/MCD\(A, B\) = (\d+) y MCM\(A, B\) = (\d+)\. ¿Cuánto vale el (MCD|MCM) de (\d+) × A/))) {
      const [g, M, k] = [+m[1], +m[2], +m[4]], s = new Set(); for (const [a, b] of pares(g, M)) s.add(m[3] === 'MCD' ? GCD(k * a, k * b) : LCM(k * a, k * b));
      assert.equal(s.size, 1, p); return String([...s][0]);
    }
    if ((m = p.match(/Dos números se diferencian en (\d+) y su MCM es (\d+)\. ¿Cuánto suman\?/))) {
      const [D, M] = [+m[1], +m[2]], s = []; for (let a = 1; a + D <= M; a++) if (LCM(a, a + D) === M) s.push(2 * a + D);
      assert.equal(s.length, 1, p); return String(s[0]);
    }
    if ((m = p.match(/tienen MCD (\d+) y MCM (\d+)\?/))) return String(pares(+m[1], +m[2]).length);
    throw new Error(`sin recálculo: ${p}`);
  },
  'mismo-resto'(p) {
    let m;
    if ((m = p.match(/tiene más de (\d+)\. En bolsitas de (\d+) sobran? (\d+), y en bolsitas de (\d+) también sobran? (\d+)/))) {
      const [X, a, r, b] = [+m[1], +m[2], +m[3], +m[4]]; for (let n = X + 1; ; n++) if (n % a === r && n % b === r) return String(n);
    }
    if ((m = p.match(/^Doña Juana empaca un paquete de caramelos: (.*)\. ¿Cuál es la menor cantidad posible\?$/))) {
      const cs = [...m[1].matchAll(/de (\d+) sobran (\d+)/g)].map(z => [+z[1], +z[2]]);
      for (let n = 1; ; n++) if (cs.every(([d, r]) => n % d === r)) return String(n);
    }
    if ((m = p.match(/menor número de tres cifras que deja resto (\d+) al dividirlo entre (\d+), entre (\d+) y entre (\d+)/))) {
      const [r, a, b, c] = m.slice(1).map(Number); for (let n = 100; n <= 999; n++) if ([a, b, c].every(d => n % d === r)) return String(n);
    }
    if ((m = p.match(/mayor número de tres cifras que deja resto (\d+) al dividirlo entre (\d+) y entre (\d+)/))) {
      const [r, a, b] = m.slice(1).map(Number); for (let n = 999; n >= 100; n--) if (n % a === r && n % b === r) return String(n);
    }
    if ((m = p.match(/deja 1 caramelo suelto con bolsitas de (\d+) y con bolsitas de (\d+), y ninguno con bolsitas de (\d+)/))) {
      const [a, b, c] = m.slice(1).map(Number); for (let n = 1; ; n++) if (n % a === 1 && n % b === 1 && n % c === 0) return String(n);
    }
    throw new Error(`sin recálculo: ${p}`);
  },
  'multiplos-tramo'(p) {
    let m;
    if ((m = p.match(/^Del 1 al (\d+), ¿cuántos números son múltiplos de (\d+) y de (\d+) a la vez\?$/))) { const [L, a, b] = m.slice(1).map(Number); return String(cuentaEn(1, L, x => x % a === 0 && x % b === 0)); }
    if ((m = p.match(/^Del 1 al (\d+), ¿cuántos números son múltiplos de (\d+) o de (\d+)\?$/))) { const [L, a, b] = m.slice(1).map(Number); return String(cuentaEn(1, L, x => x % a === 0 || x % b === 0)); }
    if ((m = p.match(/rifa de (\d+) boletos, ganan caramelo los múltiplos de (\d+) y gaseosa los múltiplos de (\d+)\. ¿Cuántos boletos no ganan ningún premio\?/))) { const [L, a, b] = m.slice(1).map(Number); return String(cuentaEn(1, L, x => x % a !== 0 && x % b !== 0)); }
    if ((m = p.match(/rifa de (\d+) boletos, ganan caramelo los múltiplos de (\d+) y gaseosa los múltiplos de (\d+)\. ¿Cuántos boletos ganan exactamente un premio\?/))) { const [L, a, b] = m.slice(1).map(Number); return String(cuentaEn(1, L, x => (x % a === 0) !== (x % b === 0))); }
    if ((m = p.match(/^¿Cuántos números del (\d+) al (\d+) son múltiplos de (\d+) o de (\d+)\?$/))) { const [lo, hi, a, b] = m.slice(1).map(Number); return String(cuentaEn(lo, hi, x => x % a === 0 || x % b === 0)); }
    if ((m = p.match(/lista del 1 al (\d+) se tachan primero los múltiplos de (\d+), después los múltiplos de (\d+) que quedan y al final los de (\d+)/))) {
      const [L, a, b, c] = m.slice(1).map(Number), tachado = new Set();
      for (const d of [a, b, c]) for (let x = d; x <= L; x += d) tachado.add(x);
      return String(tachado.size);
    }
    throw new Error(`sin recálculo: ${p}`);
  },
  euclides(p) {
    let m;
    const cocs = (a, b) => { const q = []; while (b) { q.push(Math.floor(a / b)); [a, b] = [b, a - b * Math.floor(a / b)]; } return q; };
    if ((m = p.match(/hallar el MCD de (\d+) y (\d+)\./))) return String(GCD(+m[1], +m[2]));
    if ((m = p.match(/^Al dividir (\d+) entre (\d+), el cociente es (\d+) y sobran (\d+)\./))) {
      const [A, B, q, r] = m.slice(1).map(Number); assert.equal(A, B * q + r, p); assert.ok(r < B); return `${B} entre ${r}`;
    }
    if ((m = p.match(/^¿Cuál es la fracción continua de (\d+)\/(\d+)\?$/))) { const q = cocs(+m[1], +m[2]); return `[${q[0]}; ${q.slice(1).join(', ')}]`; }
    if ((m = p.match(/^¿Qué número es la fracción continua \[(\d+); (\d+), (\d+)\]\?$/))) {
      // De abajo hacia arriba, con fracciones (numerador, denominador): a + 1/(b + 1/c).
      const [a, b, c] = m.slice(1).map(Number); let [n, d] = [b * c + 1, c]; [n, d] = [a * n + d, n]; const g = GCD(n, d); return d / g === 1 ? String(n / g) : `${n / g}/${d / g}`;
    }
    if ((m = p.match(/los cocientes fueron (\d+), (\d+) y (\d+), en ese orden, y el MCD es (\d+)\. ¿Cuánto suman/))) {
      // Continuantes: A = d × K(q1, q2, q3) y B = d × K(q2, q3).
      const [q1, q2, q3, d] = m.slice(1).map(Number), K2 = q2 * q3 + 1, K3 = q1 * K2 + q3;
      assert.deepEqual(cocs(d * K3, d * K2), [q1, q2, q3], p); assert.equal(GCD(d * K3, d * K2), d);
      return String(d * (K3 + K2));
    }
    throw new Error(`sin recálculo: ${p}`);
  },
};
test('«Ahora tú»: 400 semillas por idea con cuatro opciones distintas, datos, y la correcta cuadra con una cuenta aparte', () => {
  for (const I of def.ideas) {
    const rec = RECALCULO[I.id];
    const vistas = new Set();
    for (let s = 0; s < SEMILLAS; s++) {
      const a = I.ahoraTu.generar(s), ops = a.opciones;
      assert.equal(ops.length, 4, `${I.id} ${s}`);
      assert.equal(new Set(ops.map(o => o.texto)).size, 4, `${I.id} ${s}: opciones repetidas`);
      assert.equal(ops.filter(o => o.correcta).length, 1);
      assert.ok(Array.isArray(a.datos) && a.datos.length, `${I.id} ${s}: sin datos`);
      const p = plano(a.pregunta), c = ops.find(o => o.correcta).texto;
      assert.equal(sinEsp(rec(p, ops.map(o => o.texto))), sinEsp(c), `${I.id} ${s}: ${p}`);
      for (const o of ops.filter(x => !x.correcta)) {
        assert.ok(o.error && o.siFuera, `${I.id} ${s}: ${o.texto} sin error o siFuera`);
        // Ningún distractor es también correcto.
        assert.notEqual(sinEsp(o.texto), sinEsp(c));
      }
      vistas.add(p);
    }
    assert.ok(vistas.size > 40, `${I.id}: pocas preguntas distintas (${vistas.size})`);
  }
});

test('«Así se resuelve»: 100 semillas que cuadran con una cuenta aparte y no repiten los 12 primeros de «Ahora tú»', () => {
  const ahora = new Set(); for (const I of def.ideas) for (let s = 0; s < 12; s++) ahora.add(plano(I.ahoraTu.generar(s).pregunta));
  for (let s = 0; s < 100; s++) {
    const R = def.ideas.map(I => I.resuelve.generar(s));
    for (const r of R) if (s < 4) assert.ok(!ahora.has(plano(r.enunciado)), plano(r.enunciado));
    let m;
    // Idea 1 (auditoría, M3): la mayor cantidad de bolsas iguales y qué lleva cada una.
    m = plano(R[0].enunciado).match(/reparte (\d+) caramelos de fresa y (\d+) de limón/); { const [A, B] = [+m[1], +m[2]]; let g = Math.min(A, B); while (A % g || B % g) g--; assert.equal(plano(R[0].respuesta), `${g} bolsas, cada una con ${A / g} de fresa y ${B / g} de limón.`); }
    // Idea 2: losetas.
    m = plano(R[1].enunciado).match(/losetas de (\d+) cm por (\d+) cm/); { const L = LCM(+m[1], +m[2]); assert.ok(sinEsp(plano(R[1].respuesta)).includes(sinEsp(`${L} cm, con ${(L / +m[1]) * (L / +m[2])} losetas`)), plano(R[1].respuesta)); }
    // Idea 3: MCD y MCM, ninguno múltiplo del otro: un solo par.
    m = plano(R[2].enunciado).match(/MCD de dos números es (\d+) y su MCM es (\d+)/); {
      const [g, M] = [+m[1], +m[2]], s2 = new Set(); for (let a = 1; a <= M; a++) for (let b = a + 1; b <= M; b++) if (GCD(a, b) === g && LCM(a, b) === M && b % a) s2.add(a + b);
      assert.equal(s2.size, 1); assert.ok(plano(R[2].respuesta).includes(String([...s2][0])));
    }
    // Idea 4 (auditoría, M3): cuántos de dos cifras dejan el mismo resto, contados uno por uno.
    m = plano(R[3].enunciado).match(/dejan resto (\d+) al dividirlos entre (\d+) y entre (\d+)/); { const [r, a, b] = m.slice(1).map(Number); const xs = []; for (let n = 10; n <= 99; n++) if (n % a === r && n % b === r) xs.push(n); assert.ok(plano(R[3].respuesta).startsWith(`${xs.length} números: del ${xs[0]} al ${xs[xs.length - 1]}`), plano(R[3].respuesta)); }
    // Idea 5 (auditoría, M3): de A pero no de B.
    m = plano(R[4].enunciado).match(/del 1 al (\d+) son múltiplos de (\d+) pero no de (\d+)/); { const [L, a, b] = m.slice(1).map(Number); assert.ok(plano(R[4].respuesta).startsWith(String(cuentaEn(1, L, x => x % a === 0 && x % b !== 0)))); }
    // Idea 6: el MCD con divisiones sucesivas.
    m = plano(R[5].enunciado).match(/miden (\d+) cm y (\d+) cm/); assert.ok(plano(R[5].respuesta).startsWith(`${GCD(+m[1], +m[2])} cm`));
  }
});

test('toda igualdad numérica escrita en la unidad es cierta (400 semillas de «Ahora tú», 100 de «Así se resuelve»)', () => {
  const malas = [];
  for (const I of def.ideas) for (const [t, donde] of textosDe(I)) for (const m of igualdadesFalsas(t)) malas.push(`${I.id} ${donde}: «${m}» en «${t}»`);
  for (const g of def.glosario) for (const e of g.ejemplos || []) for (const m of igualdadesFalsas(e)) malas.push(`glosario ${g.termino}: «${m}»`);
  for (const mesa of def.laboratorio) for (const inv of mesa.invitaciones || []) for (const m of igualdadesFalsas(inv.bien || '')) malas.push(`mesa ${mesa.id}: «${m}»`);
  assert.deepEqual(malas.slice(0, 20), []);
});

// ---------- Ejemplos: la respuesta de cada uno, por fuerza bruta (sin la unidad) ----------
const menor = (desde, ok) => { for (let n = desde; ; n++) if (ok(n)) return n; };
const ESPERADO = {
  'mcd-cintas': {
    'Divisores comunes de 12 y 18': [1, 2, 3, 6].filter(d => 12 % d === 0 && 18 % d === 0).join(', ').replace(/, (\d+)$/, ' y $1'),
    'El MCD de 20 y 30': GCD(20, 30), 'Con primos: 40 y 100': GCD(40, 100), 'Dos números PESI': GCD(8, 15), 'Uno divide al otro': GCD(9, 36),
    'Dos rollos sin sobrante': (42 + 56) / GCD(42, 56), 'El MCD de tres': GCDL(36, 48, 60), 'Bolsitas de dos sabores': GCD(60, 84),
    'Con exponentes grandes': GCD(2 ** 4 * 9 * 7, 4 * 3 ** 5 * 5), 'El cartón en cuadrados': (60 / GCD(60, 36)) * (36 / GCD(60, 36)),
    'Metros con decimales': `${GCD(150, 225)} cm`, 'Estacas en el terreno': (84 / GCD(84, 60) + 1) * (60 / GCD(84, 60) + 1),
    'Tres tablas': [240, 300, 420].reduce((u, x) => u + x / GCDL(240, 300, 420), 0), 'Paquetes iguales': 120 / GCD(72, 120),
    'Sobran 4 en los dos': (() => { let m = 0; for (let d = 5; d <= 130; d++) if (100 % d === 4 && 130 % d === 4) m = d; return m; })(),
  },
  'mcm-coinciden': {
    'Múltiplos comunes de 4 y 6': '12, 24 y 36', 'El MCM de 8 y 12': LCM(8, 12), 'Dos primos distintos': LCM(5, 7), 'Uno es múltiplo del otro': LCM(6, 18),
    'Con primos: 12 y 10': LCM(12, 10), 'Las dos alarmas': `${9 + LCM(15, 20) / 60}:00`, 'El MCM de tres': LCM(6, 8, 10),
    'El cuadrado de losetas': (LCM(10, 15) / 10) * (LCM(10, 15) / 15), 'Con exponentes grandes': '3 240',
    'Boletos con los dos premios': cuentaEn(1, 100, x => x % 6 === 0 && x % 15 === 0), 'La tercera llegada': `${2 * LCM(9, 12)} días`,
    'Tomas de tres medicinas': (() => { let j = 0, t = 0; for (let h = 0; j < 3; h++) { const k = [4, 6, 8].filter(x => h % x === 0).length; t += k; if (k === 3) j++; } return t; })(),
    'Vueltas en la pista': LCM(60, 80, 90) / 60, 'Ladrillos para un cubo': (LCM(6, 9, 12) / 6) * (LCM(6, 9, 12) / 9) * (LCM(6, 9, 12) / 12),
    'Combis hasta las nueve': cuentaEn(0, 180, x => x % 10 === 0 && x % 12 === 0 && x % 15 === 0),
  },
  'mcd-por-mcm': {
    'Los cocientes de 24 y 40': `p = ${24 / GCD(24, 40)} y q = ${40 / GCD(24, 40)}`, 'El MCM con los cocientes': LCM(24, 42), 'El otro número': 4 * 60 / 12,
    'Comprobar con 8 y 12': GCD(8, 12) * LCM(8, 12), '¿Pueden ser los cocientes?': GCD(30, 45) === 5 ? 'Sí' : 'No', 'Con tres números no': `${GCDL(6, 10, 15) * LCM(6, 10, 15)} contra ${6 * 10 * 15}`,
    'El producto y el MCD': 864 / 6, 'Multiplicar por 3': `MCD = ${GCD(3 * 8, 3 * 96)}`, 'Los dos números': 36 + 63,
    'Pares con MCD 4, MCM 24': (() => { let c = 0; for (let a = 1; a <= 24; a++) for (let b = a + 1; b <= 24; b++) if (GCD(a, b) === 4 && LCM(a, b) === 24) c++; return `${c} pares`; })(),
    'Diferencia y MCM': (() => { const s = []; for (let a = 1; a + 12 <= 72; a++) if (LCM(a, a + 12) === 72) s.push(2 * a + 12); assert.equal(s.length, 1); return s[0]; })(),
    'Pares con MCD 4, MCM 144': (() => { let c = 0; for (let a = 1; a <= 144; a++) for (let b = a + 1; b <= 144; b++) if (GCD(a, b) === 4 && LCM(a, b) === 144) c++; return `${c} pares`; })(),
    'Suma 120 y MCD 15': (() => { let c = 0; for (let a = 1; a < 60; a++) if (GCD(a, 120 - a) === 15) c++; return `${c} pares`; })(),
    'El MCM, 30 veces el MCD': (() => { for (let g = 1; g < 100; g++) if (g * 30 * g === 1080) return g; })(),
    'Los números más cercanos': (() => { let best = null; for (let a = 1; a <= 360; a++) for (let b = a + 1; b <= 360; b++) if (GCD(a, b) === 12 && LCM(a, b) === 360 && b % a) if (!best || b - a < best[1] - best[0]) best = [a, b]; return best[0] + best[1]; })(),
  },
  'mismo-resto': {
    'Sobra 1 con 2 y 3': menor(2, n => n % 2 === 1 && n % 3 === 1), 'Cuáles sirven con 4 y 6': [25, 30, 37].filter(n => n % 4 === 1 && n % 6 === 1).join(' y el '),
    'Con el circulito': 'múltiplo de 5 + 3', 'Lo que falta': 7 - 5, 'Resto 2 con 3 y 5': menor(3, n => n % 3 === 2 && n % 5 === 2), 'Bolsitas de 6 y de 8': menor(11, n => n % 6 === 5 && n % 8 === 5),
    'Falta lo mismo en las dos': menor(1, n => n % 4 === 3 && n % 6 === 5), 'Entre 100 y 150': `${cuentaEn(100, 150, n => n % 6 === 2 && n % 9 === 2)} números`,
    'Tres bolsitas': menor(2, n => n % 2 === 1 && n % 3 === 1 && n % 5 === 1), 'El mayor de dos cifras': (() => { for (let n = 99; ; n--) if (n % 4 === 3 && n % 6 === 3) return n; })(),
    'El menor de tres cifras': menor(100, n => n % 6 === 5 && n % 8 === 5 && n % 9 === 5),
    'Le falta uno': (() => { const s = []; for (let n = 200; n <= 280; n++) if (n % 4 === 3 && n % 5 === 4 && n % 6 === 5) s.push(n); assert.equal(s.length, 1); return s[0]; })(),
    'Y sin sobrante con 7': menor(1, n => n % 2 === 1 && n % 3 === 1 && n % 4 === 1 && n % 7 === 0),
    'Aulas con sobrante': (() => { const s = []; for (let n = 300; n <= 400; n++) if (n % 30 === 5 && n % 40 === 5) s.push(n); assert.equal(s.length, 1); return s[0]; })(),
    'El mayor de tres cifras': (() => { for (let n = 999; ; n--) if (n % 8 === 7 && n % 10 === 7 && n % 12 === 7) return n; })(),
  },
  'multiplos-tramo': {
    'Múltiplos de 7 hasta 100': cuentaEn(1, 100, x => x % 7 === 0), 'Comunes de 4 y 6': cuentaEn(1, 50, x => x % 4 === 0 && x % 6 === 0),
    'De 3 o 5 hasta 30': cuentaEn(1, 30, x => x % 3 === 0 || x % 5 === 0), 'Los de los dos premios': cuentaEn(1, 60, x => x % 5 === 0 && x % 6 === 0),
    'Ni de 2 ni de 3': cuentaEn(1, 20, x => x % 2 && x % 3), 'La rifa de 200 boletos': cuentaEn(1, 200, x => x % 8 === 0 || x % 12 === 0),
    'Un solo premio': cuentaEn(1, 200, x => (x % 8 === 0) !== (x % 12 === 0)), 'Ni de 4 ni de 10': cuentaEn(1, 100, x => x % 4 && x % 10),
    'De 6 o 9 hasta 90': cuentaEn(1, 90, x => x % 6 === 0 || x % 9 === 0), 'De 12, entre 50 y 100': cuentaEn(50, 100, x => x % 12 === 0),
    'Tachar uno tras otro': cuentaEn(1, 60, x => x % 2 === 0 || x % 3 === 0 || x % 5 === 0), 'Tres cifras, de 6 o 15': cuentaEn(100, 999, x => x % 6 === 0 || x % 15 === 0),
    'Ganan exactamente uno': cuentaEn(1, 150, x => (x % 6 === 0) !== (x % 10 === 0)), 'Ni de 2, 3 ni 5': cuentaEn(1, 100, x => x % 2 && x % 3 && x % 5),
    'Los que no ganan nada': cuentaEn(1, 240, x => x % 10 && x % 15),
  },
  euclides: {
    'Una división': `Cociente ${Math.floor(50 / 15)} y resto ${50 % 15}`, 'El MCD de 45 y 12': GCD(45, 12), 'El par que sigue': `${24} y ${64 % 24}`,
    'Cuando divide exacto': GCD(84, 21), 'Una fracción continua corta': '[2; 3]', 'El MCD de 252 y 198': GCD(252, 198), 'La fracción continua de 43/30': '[1; 2, 3, 4]',
    'El valor de [1; 2, 2]': '7/5', 'Cuántas divisiones': (() => { let a = 89, b = 55, n = 0; while (b) { [a, b] = [b, a % b]; n++; } return `${n} divisiones`; })(),
    'Dos rollos difíciles': `${GCD(391, 323)} cm`, 'Reconstruir con los cocientes': 186 + 54, 'La diferencia y los cocientes': GCD(135, 105),
    'La fracción continua de 157/68': '[2; 3, 4, 5]', 'El valor de [2; 1, 3]': '11/4', 'El mayor de los dos': 98,
  },
};
test('ejemplos: 15 por idea, 5 por nivel, con datos; nivel 3 con cinco alternativas, una sola que cuadra y cada trampa nombrada', () => {
  const LETRAS = 'ABCDE';
  for (const I of def.ideas) {
    const ej = I.ejemplos;
    assert.equal(ej.length, 15, I.id);
    for (const n of [1, 2, 3]) assert.equal(ej.filter(e => e.nivel === n).length, 5, `${I.id} nivel ${n}`);
    for (const e of ej) {
      assert.ok(Array.isArray(e.datos) && e.datos.length, `${I.id} «${e.titulo}»: sin datos`);
      if (e.nivel !== 3) continue;
      assert.equal(e.alternativas.length, 5, `${I.id} «${e.titulo}»`);
      assert.equal(new Set(e.alternativas).size, 5);
      const L = plano(negritas(e.respuesta)[0].negrita), r = plano(e.respuesta).replace(/^[A-E]: /, '');
      const cuales = e.alternativas.filter(a => new RegExp(`(^|[^\\d/])${a.replace(/[[\]()]/g, '\\$&')}([^\\d/]|$)`).test(r));
      assert.deepEqual(cuales, [e.alternativas[LETRAS.indexOf(L)]], `${I.id} «${e.titulo}»: la letra ${L} no es la de «${r}»`);
      const nombradas = negritas(e.solucion).map(n => plano(n.negrita));
      for (const l of LETRAS) if (l !== L) assert.ok(nombradas.includes(l), `${I.id} «${e.titulo}»: no explica ${l}`);
    }
  }
  for (const [id, tabla] of Object.entries(ESPERADO)) {
    const I = idea(id);
    assert.equal(Object.keys(tabla).length, 15, `${id}: la tabla cubre los 15 ejemplos`);
    for (const [t, v] of Object.entries(tabla)) {
      const e = I.ejemplos.find(x => x.titulo.replace(/\u00a0/g, ' ') === t);   // títulos con espacios que no se parten
      assert.ok(e, `${id}: no hay ejemplo «${t}»`);
      const r = sinEsp(plano(e.respuesta)), val = sinEsp(String(v));
      assert.ok(new RegExp(`(^|[^\\d])${val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^\\d]|$)`).test(r), `${id} «${t}»: ${plano(e.respuesta)} contra ${v}`);
    }
  }
});
// Las trampas de nivel 3: cada alternativa incorrecta es el valor que su error produce (rehecho aquí).
test('ejemplos de nivel 3: cada trampa da de verdad el valor de su error', () => {
  const alt = (id, t) => idea(id).ejemplos.find(e => e.titulo === t).alternativas;
  assert.deepEqual(alt('mcd-cintas', 'Metros con decimales'), [`${GCD(15, 225)} cm`, `${GCD(150, 225)} cm`, '25 cm', `${LCM(150, 225)} cm`, '0,75 cm']);
  assert.ok(150 % 25 === 0 && 225 % 25 === 0);
  assert.deepEqual(alt('mcd-cintas', 'Estacas en el terreno').map(Number), [7 * 5, 12, 2 * (7 + 5), 8 * 6, 8 * 5]);
  assert.deepEqual(alt('mcd-cintas', 'Tres tablas').map(Number), [16, 60, 4 + 5, 240 / 30 + 300 / 30 + 420 / 30, 4 * 5 * 7]);
  assert.deepEqual(alt('mcd-cintas', 'Paquetes iguales').map(Number), [GCD(72, 120), 72 / 24, 5, LCM(72, 120), 120 / 12]);
  assert.deepEqual(alt('mcd-cintas', 'Sobran 4 en los dos').map(Number), [GCD(100, 130), 3, 4, 130 - 100, GCD(96, 126)]);
  assert.ok(96 % 3 === 0 && 126 % 3 === 0);
  assert.deepEqual(alt('mcm-coinciden', 'La tercera llegada').map(Number), [72, LCM(9, 12), 3 * LCM(9, 12), 2 * 9 * 12, GCD(9, 12)]);
  const tomas = T => [4, 6, 8].reduce((u, x) => u + T / x + 1, 0);
  assert.deepEqual(alt('mcm-coinciden', 'Tomas de tres medicinas').map(Number), [tomas(48) - 3, tomas(24), tomas(48), tomas(72), 48]);
  assert.deepEqual(alt('mcm-coinciden', 'Vueltas en la pista').map(Number), [720, 720 / 80, 720 / 90, LCM(60, 80) / 60, 12]);
  assert.deepEqual(alt('mcm-coinciden', 'Ladrillos para un cubo').map(Number), [36, 72, 6 + 4 + 3, 6 * 9 * 12, GCDL(6, 9, 12)]);
  assert.deepEqual(alt('mcm-coinciden', 'Combis hasta las nueve').map(Number), [3, 180 / LCM(10, 15) + 1, 180 / 10 + 1, 4, 1]);
  assert.ok(10 * 12 * 15 > 180);
  assert.deepEqual(alt('mcd-por-mcm', 'Diferencia y MCM').map(Number), [12 + 72, 2 + 3, 36, 60, 24 * 36]);
  const parejas = (c, pesi) => { let k = 0; for (let p = 1; p * p < c; p++) if (c % p === 0 && (!pesi || GCD(p, c / p) === 1)) k++; return k; };
  assert.deepEqual(alt('mcd-por-mcm', 'Pares con MCD 4, MCM 144').map(Number), [parejas(36, false), parejas(36, true), 1, 36, 9]);
  assert.equal([1, 2, 3, 4, 6, 9, 12, 18, 36].length, 9);
  assert.deepEqual(alt('mcd-por-mcm', 'Suma 120 y MCD 15').map(Number), [3, 8, 1, 4, 2]);
  assert.deepEqual(alt('mcd-por-mcm', 'El MCM, 30 veces el MCD').map(Number), [6, 36, 180, 30, 1080]);
  assert.deepEqual(alt('mcd-por-mcm', 'Los números más cercanos').map(Number), [12 + 360, 24 + 180, 60 + 72, 5 + 6, 36 + 120]);
  assert.deepEqual(alt('mismo-resto', 'El menor de tres cifras').map(Number), [72 + 5, 144, 149, 6 * 8 * 9 + 5, 72 * 3 + 5]);
  assert.deepEqual(alt('mismo-resto', 'Le falta uno').map(Number), [241, 243, 240, 59, 239]);
  assert.deepEqual(alt('mismo-resto', 'Y sin sobrante con 7').map(Number), [49, 13, LCM(2, 3, 4, 7), 85, 25]);
  assert.ok(13 % 7 === 6 && 85 % 7 === 1 && 25 % 7 === 4);
  assert.deepEqual(alt('mismo-resto', 'Aulas con sobrante').map(Number), [360, 30 * 40 + 5, 125, 365, 245]);
  assert.deepEqual(alt('mismo-resto', 'El mayor de tres cifras').map(Number), [960, 967, 1087, 847, 127]);
  assert.deepEqual(alt('multiplos-tramo', 'Tachar uno tras otro').map(Number), [30 + 20 + 12, 44, 60 - 44, 44 - 2, 30]);
  const tc = (d, lo = 100, hi = 999) => cuentaEn(lo, hi, x => x % d === 0);
  assert.deepEqual(alt('multiplos-tramo', 'Tres cifras, de 6 o 15').map(Number), [tc(6) + tc(15), cuentaEn(1, 999, x => x % 6 === 0 || x % 15 === 0), tc(6), 180, tc(30)]);
  assert.deepEqual(alt('multiplos-tramo', 'Ganan exactamente uno').map(Number), [cuentaEn(1, 150, x => x % 6 === 0 || x % 10 === 0), 25 + 15, 5, cuentaEn(1, 150, x => x % 6 && x % 10), 30]);
  assert.deepEqual(alt('multiplos-tramo', 'Ni de 2, 3 ni 5').map(Number), [26, 26 + 3, 74, 3, cuentaEn(1, 100, x => x % 2 && x % 3)]);
  assert.deepEqual(alt('multiplos-tramo', 'Los que no ganan nada').map(Number), [240 - 24 - 16, 32, 208, 240 - 8, 8]);
  assert.deepEqual(alt('euclides', 'Reconstruir con los cocientes').map(Number), [31 + 9, 3 * 2 * 4 * 6, 54, 186, 240]);
  assert.deepEqual(alt('euclides', 'La diferencia y los cocientes').map(Number), [15, 30, 30 / (1 + 3 + 2), 135, 105]);
  assert.deepEqual(alt('euclides', 'El mayor de los dos').map(Number), [56, 14 * (1 + 1 + 3), 42, 98, 14]);
});

test('glosario: cada idea estrena de 2 a 4 palabras, con su simple y tres ejemplos; ninguno trae la respuesta de Predice ni de la misión', () => {
  const porIdea = Glosario.porIdea ? Glosario.porIdea(def) : null;
  for (const g of def.glosario) {
    assert.ok(g.simple, g.termino);
    assert.ok(Array.isArray(g.ejemplos) && g.ejemplos.length >= 3, g.termino);
  }
  if (porIdea) for (const [i, I] of def.ideas.entries()) { const ts = porIdea[i] || []; assert.ok(ts.length >= 2 && ts.length <= 4, `${I.id}: ${ts.length} términos`); }
  // Las respuestas de las predicciones (12, 36, 120, 61, 40) y de las misiones (6, 20, 48, 49, 24, 38).
  for (const g of def.glosario) for (const e of [g.simple, g.def, ...g.ejemplos]) assert.ok(!/\b(12 m|36|120|61|40|48|49|24|38)\b/.test(e.replace(/MCM\(4, 6\) = 12/, '')), `${g.termino}: ${e}`);
});

test('el circulito se dice en los Datos de todo ejercicio que lo usa', () => {
  const usa = x => JSON.stringify(x).includes('"mult"');
  const glosa = ds => (ds || []).some(d => /con un circulito/.test(plano(d)));
  for (const I of def.ideas) {
    for (const e of I.ejemplos) if (usa([e.enunciado, e.solucion, e.respuesta, e.datos])) assert.ok(glosa(e.datos), `${I.id} «${e.titulo}»: usa el circulito sin decirlo`);
    for (let s = 0; s < 200; s++) { const a = I.ahoraTu.generar(s); if (usa([a.pregunta, a.opciones, a.solucion, a.datos])) assert.ok(glosa(a.datos), `${I.id} ${s}`); }
    for (let s = 0; s < 40; s++) { const r = I.resuelve.generar(s); if (usa([r.enunciado, r.pasos, r.respuesta, r.datos])) assert.ok(glosa(r.datos), `${I.id} resuelve ${s}`); }
  }
});

test('notación: × y nunca «·» (salvo el separador de una regla)', () => {
  for (const I of def.ideas) for (const [t, donde] of textosDe(I, 60)) assert.ok(!/·/.test(t.replace(/ {3}· {3}/g, ' | ')), `${I.id} ${donde}: «·» en ${t}`);
});

test('la letra correcta de los ejemplos de nivel 3 se reparte entre A y E', () => {
  const c = {};
  for (const I of def.ideas) for (const e of I.ejemplos.filter(x => x.nivel === 3)) { const L = plano(negritas(e.respuesta)[0].negrita); c[L] = (c[L] || 0) + 1; }
  for (const L of 'ABCDE') assert.equal(c[L], 6, `${L}: ${JSON.stringify(c)}`);
});

test('las figuras de la unidad en las piezas nuevas caben y no se pisan (arit-cintas y arit-reparto)', () => {
  const solapan = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
  const mal = []; let n = 0;
  const mira = (dib, nombre) => {
    if (!dib || !['arit-cintas', 'arit-reparto'].includes(dib.pieza)) return;
    const pasos = (dib.datos.pasos || [{}]).map((_, i) => i);
    for (const paso of pasos) {
      n++;
      const g = PZ(dib.pieza).geometria(dib.datos, Object.assign({}, dib.estado || {}, { paso }));
      for (const c of [...g.objetos, ...g.textos]) if (!(c.x0 >= 4 - 1e-9 && c.y0 >= 4 - 1e-9 && c.x1 <= 316 + 1e-9 && c.y1 <= g.H - 4 + 1e-9)) mal.push(`${nombre} paso ${paso}: se sale «${c.txt || c.que}»`);
      for (let i = 0; i < g.textos.length; i++) for (let j = i + 1; j < g.textos.length; j++) if (solapan(g.textos[i], g.textos[j])) mal.push(`${nombre}: se pisan «${g.textos[i].txt}» y «${g.textos[j].txt}»`);
      for (const t of g.textos) for (const o of g.objetos) if (solapan(t, o)) mal.push(`${nombre}: «${t.txt}» pisa ${o.que}`);
    }
  };
  for (const I of def.ideas) {
    const pz = I.pieza;
    for (const t of (I.lee ? I.lee.tarjetas : [])) if (t.dibujo) mira({ pieza: t.pieza || pz, datos: t.dibujo.datos, estado: t.dibujo.estado }, `${I.id} lee`);
    for (const v of grilla(I.juega.controles)) mira(Object.assign({ pieza: I.juega.pieza || pz }, I.juega.dibujo(v)), `${I.id} juego ${JSON.stringify(v)}`);
    for (const c of ['dibujo', 'revelar']) mira(Object.assign({ pieza: I.predice.pieza || pz }, I.predice[c]), `${I.id} predice ${c}`);
    mira({ pieza: I.mira.pieza || pz, datos: I.mira.datos }, `${I.id} mira`);
    if (I.regla.dibujo) mira(Object.assign({ pieza: pz }, I.regla.dibujo), `${I.id} regla`);
    I.ejemplos.forEach((e, i) => { if (e.figura) mira(Object.assign({ pieza: pz }, e.figura), `${I.id} ejemplo ${i + 1}`); });
  }
  for (const m of def.laboratorio) if (['arit-cintas', 'arit-reparto'].includes(m.pieza)) for (const v of grilla(m.controles).filter((_, i) => i % 7 === 0)) mira(Object.assign({ pieza: m.pieza }, m.dibujo(v)), `mesa ${m.id}`);
  assert.deepEqual(mal.slice(0, 20), []);
  assert.ok(n > 100, `figuras revisadas: ${n}`);
});

// ---------- Cierre (19 nov): auditoría (rutinas/auditoria/aritmetica.mcd-y-mcm.md) y lectores en frío ----------
// Cada prueba falla con la versión de antes de las correcciones.
const numsEnOrden = t => (sinEsp(t).match(/\d+/g) || []).join('-');
test('auditoría A1: el siFuera del cociente en Euclides es cierto (no dice que el cociente no divide a los dos)', () => {
  const I = idea('euclides');
  for (let s = 0; s < SEMILLAS; s++) {
    const c = I.ahoraTu.generar(s), o = c.opciones.find(x => x.error === 'AT-EUC-COCIENTE');
    if (!o) continue;
    const m = plano(c.pregunta).match(/MCD de (\d+) y (\d+)/); if (!m) continue;
    const [A, B, q] = [+m[1], +m[2], +o.texto];
    if (/no entra/.test(o.siFuera)) assert.ok(A % q || B % q, `semilla ${s}: «${o.siFuera}» y ${q} divide a ${A} y a ${B}`);
    assert.ok(o.siFuera.includes(`entra ${B} en ${A}`), o.siFuera);
  }
});
test('auditoría M1: p y q dichos en palabras en la regla, y en los Datos de todo ejercicio que los nombra', () => {
  const R = idea('mcd-por-mcm').regla;
  assert.match(R.texto, /p y q son los cocientes/);
  assert.match(R.condicion, /primos/);
  for (let s = 0; s < SEMILLAS; s++) {
    const c = idea('mcd-por-mcm').ahoraTu.generar(s);
    const usa = [...c.opciones.map(o => o.siFuera || ''), plano(c.solucion.texto)].some(t => /\bp\b|\bq\b/.test(t));
    if (usa) assert.ok(c.datos.some(d => /p y q son los cocientes/.test(plano(d))), `semilla ${s}: usa p o q sin decir qué son`);
  }
});
test('auditoría M2: «Ahora tú» y «Así se resuelve» no repiten los números de un ejemplo ni de la misión', () => {
  for (const I of def.ideas) {
    const usados = new Set([...I.ejemplos.map(e => numsEnOrden(plano(e.enunciado))), numsEnOrden(I.juega.mision.texto)]);
    for (let s = 0; s < SEMILLAS; s++) {
      const a = numsEnOrden(plano(I.ahoraTu.generar(s).pregunta)), r = numsEnOrden(plano(I.resuelve.generar(s).enunciado));
      assert.ok(!usados.has(a), `${I.id} «Ahora tú» ${s}: ${plano(I.ahoraTu.generar(s).pregunta)}`);
      assert.ok(!usados.has(r), `${I.id} «Así se resuelve» ${s}: ${plano(I.resuelve.generar(s).enunciado)}`);
    }
  }
});
test('auditoría M3: «Así se resuelve» no es la misma pregunta que un tipo de «Ahora tú» (ideas 1, 4 y 5)', () => {
  const tipos = id => new Set(Array.from({ length: 60 }, (_, s) => plano(idea(id).ahoraTu.generar(s).pregunta).replace(/\d[\d,]*/g, '#').replace(/^.*\. (?=¿)/, '')));
  for (const id of ['mcd-cintas', 'mismo-resto', 'multiplos-tramo']) {
    const preg = plano(idea(id).resuelve.generar(3).enunciado).replace(/\d[\d,]*/g, '#').replace(/^.*\. (?=¿)/, '');
    assert.ok(!tipos(id).has(preg), `${id}: «${preg}»`);
  }
  assert.doesNotMatch(plano(idea('mcd-cintas').resuelve.generar(0).enunciado), /en total/);
  assert.doesNotMatch(plano(idea('mismo-resto').resuelve.generar(0).enunciado), /el mayor número/);
  assert.doesNotMatch(plano(idea('multiplos-tramo').resuelve.generar(0).enunciado), / ni de /);
});
test('auditoría M4: el cambio de colores está dicho (violeta, múltiplos comunes y MCM; turquesa, divisores comunes)', () => {
  assert.match(plano(idea('mcm-coinciden').lee.tarjetas[2].texto), /violeta marca los múltiplos comunes y el turquesa, los divisores comunes/);
  assert.match(idea('multiplos-tramo').juega.leyenda.find(l => /violeta/.test(plano(l.s))).t, /MCM/);
  assert.match(idea('mcd-cintas').juega.leyenda[0].t, /divisor común/);
});
test('auditoría M6: ningún siFuera dice «llegar a tres cifras» con un número de dos cifras', () => {
  for (let s = 0; s < SEMILLAS; s++) {
    const c = idea('mismo-resto').ahoraTu.generar(s), o = c.opciones.find(x => x.error === 'AT-RESTO-OLVIDA');
    // El múltiplo puede tener dos cifras (96 con resto 5 da 101; en la práctica, la semilla 331): la frase no lo afirma.
    if (o) assert.doesNotMatch(o.siFuera, /llegar a tres cifras/, `${s}: ${o.siFuera}`);
  }
});
test('auditoría B1: el distractor «todos los primos» del MCD lleva el exponente con que el primo está en A', () => {
  for (let s = 3; s < SEMILLAS; s += 6) {
    const c = idea('mcd-cintas').ahoraTu.generar(s), A = plano(c.pregunta).match(/A = ([^y]+) y/)[1].trim();
    const o = c.opciones.find(x => x.error === 'AT-MCD-TODOS'); if (!o) continue;
    const noComun = A.split(' × ').find(t => !/^[23]/.test(t));
    assert.ok(o.texto.split(' × ').includes(noComun), `${s}: ${A} → ${o.texto}`);
  }
});
test('lectores en frío: condiciones que se leen como frase, letras p y q del dibujo en palabras, fracción continua en escalera', () => {
  assert.match(idea('mcd-cintas').regla.condicion, /^A y B son enteros positivos/);
  assert.match(idea('mcd-cintas').regla.condicion, /primos entre sí/);
  assert.match(idea('mcm-coinciden').regla.condicion, /^no se cuenta el 0/);
  assert.doesNotMatch(idea('mcm-coinciden').ahoraTu.voz, /corta/);
  assert.doesNotMatch(idea('multiplos-tramo').ahoraTu.voz, /se restan/);
  const notas = plano(idea('mcd-por-mcm').regla.dibujo.datos.cintas.slice(2).map(c => c.nota.map(x => x[0]).join('')));
  assert.match(notas, /tantos como trozos tiene B, q/); assert.match(notas, /tantos como trozos tiene A, p/);
  assert.ok(JSON.stringify(idea('euclides').regla.ecuacion).includes('"frac"'), 'la regla de Euclides dibuja la escalera');
  for (const t of ['El valor de [1; 2, 2]', 'El valor de [2; 1, 3]']) {
    const e = idea('euclides').ejemplos.find(x => x.titulo.replace(/ /g, ' ') === t);
    assert.ok(JSON.stringify(e.solucion[0].ecuacion || '').includes('"frac"'), `${t}: sin escalera`);
  }
  assert.match(idea('euclides').ejemplos.find(x => x.titulo === 'El par que sigue').enunciado, /se divide después/);
  const R4 = idea('mismo-resto').regla;
  assert.deepEqual(R4.dibujo.datos.repartos.map(r => r.d), [4, 6]);
  assert.equal(R4.dibujo.datos.n % 12, 1);
  assert.ok(!idea('mcd-cintas').ejemplos.find(x => x.titulo === 'Con primos: 40 y 100').datos.some(d => /40 =/.test(plano(d))));
  assert.match(plano(idea('multiplos-tramo').regla.condicion), /se cuenta del 1 al L/);
  assert.match(JSON.stringify(idea('multiplos-tramo').regla.ecuacion), /de\\u00a0A|de A/);
  assert.ok(JSON.stringify(idea('multiplos-tramo').regla.ecuacion).includes('de B'), 'de B sin partir');
});
