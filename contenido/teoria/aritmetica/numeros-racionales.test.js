// Pruebas propias de «Números racionales, fracciones y decimales» (además del validador común de
// contenido/teoria/teoria.test.js). Etapa 8 (19 nov): las seis ideas pasan por el contrato, con la propuesta
// docs/etapa8/propuesta-aritmetica.md como guion.
//   - seis ideas en el orden de la propuesta (cinco conservan su id; `del-resto` es nueva); con calidad 2 desde el cierre;
//   - un color fijo por magnitud (propuesta §7): cada ficha de color dice su magnitud (m) y lleva el color de def.colores;
//     nunca verde en las figuras; letras de alternativa en negrita y sin color;
//   - cada misión se cumple con un solo caso de la grilla y no al abrir (y se rehace aquí por fuerza bruta);
//   - Predice: un código de error por opción, una sola correcta, nada de lo de antes trae su respuesta, y cada
//     distractor da el valor de su error (rehecho aquí con fracciones exactas);
//   - «Ahora tú» trae cuatro opciones distintas en 400 semillas, con datos; la correcta y el valor de cada distractor se
//     rehacen desde el texto de la pregunta, con cuentas aparte (fracciones con enteros, divisiones largas propias,
//     fuerza bruta), sin el código de la unidad; «Así se resuelve» cuadra y no repite a «Ahora tú»;
//   - toda igualdad entre números escrita es cierta (400 semillas);
//   - 15 ejemplos por idea que suben de nivel, con datos; los de nivel 3, con cinco alternativas, una sola que cuadra,
//     cada trampa nombrada y su valor rehecho; la letra correcta repartida (6 de cada una);
//   - el glosario no trae la respuesta de ninguna predicción ni misión; notación: × y nunca «·».
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../../../nucleo/kit/kit.js');
const E = require('../../../nucleo/ecuacion.js');
const Glosario = require('../../../nucleo/glosario.js');
const def = require('./numeros-racionales.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const PZ = id => Kit.piezas[id];
const ID = ['equivalentes', 'orden-recta', 'del-resto', 'exacto-periodico', 'generatriz', 'otras-bases'];
const SEMILLAS = 400;
const idea = id => def.ideas.find(i => i.id === id);

const fichas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(fichas)
  : typeof x.v === 'string' && /^c-/.test(x.v) ? [x] : Object.values(x).flatMap(fichas));
const negritas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(negritas)
  : x.negrita ? [x] : Object.values(x).flatMap(negritas));
const plano = x => E.texto(x === undefined || x === null ? '' : Array.isArray(x) ? x : [x]);
const svgDe = (dib, pz) => PZ((dib && dib.pieza) || pz).dibujar(dib.datos, dib.estado || {});
const planoN = x => plano(x).replace(/ \/ /g, '/');
const sinEsp = t => String(t).replace(/[\s   ]/g, '');

// ---------- Cuentas aparte: fracciones con enteros, divisiones largas y fuerza bruta (no usan la unidad) ----------
const GCD = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const Q = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = GCD(n, d) || 1; return [n / g, d / g]; };
const suma = ([a, b], [c, d]) => Q(a * d + b * c, b * d);
const resta = ([a, b], [c, d]) => Q(a * d - b * c, b * d);
const por = ([a, b], [c, d]) => Q(a * c, b * d);
const entre = ([a, b], [c, d]) => Q(a * d, b * c);
const fq = ([n, d]) => (d === 1 ? String(n) : `${n}/${d}`);
const leeFr = t => { const m = String(t).match(/^(\d+)\/(\d+)$/); return m ? Q(+m[1], +m[2]) : /^\d+$/.test(t) ? Q(+t) : null; };
const igualQ = (x, y) => x && y && x[0] === y[0] && x[1] === y[1];
// La división larga en base B: cifras antes del bloque, el bloque (vacío si termina) y la parte entera.
function largo(n, d, B = 10) {
  const ent = Math.floor(n / d); let r = n % d; const cifras = [], visto = new Map();
  while (r && !visto.has(r)) { visto.set(r, cifras.length); r *= B; cifras.push(Math.floor(r / d)); r %= d; }
  if (!r) return { ent, ante: cifras.join(''), per: '' };
  const i = visto.get(r); return { ent, ante: cifras.slice(0, i).join(''), per: cifras.slice(i).join('') };
}
// Cómo escribe la unidad un decimal (propuesta, decisión 8): el bloque de una o dos cifras tres veces; de más, dos.
const escribe = (n, d, B = 10) => { const x = largo(n, d, B); return x.per ? `${x.ent},${x.ante}${x.per.repeat(x.per.length <= 2 ? 3 : 2)}…` : x.ante ? `${x.ent},${x.ante}` : String(x.ent); };
// La fracción que da un decimal escrito así: se prueban todos los cortes (cifras de antes y bloque) y se queda la que,
// dividida otra vez, se escribe igual. Por fuerza bruta sobre los cortes; la división larga es la prueba.
const memo = new Map();
function desdeDecimal(t, B = 10) {
  const k = `${t}|${B}`; if (memo.has(k)) return memo.get(k);
  const m = String(t).match(/^(\d+),(\d*?)(…?)$/); let res = null;
  if (m) {
    const ent = +m[1], cif = m[2].split('').map(Number);
    const val = ds => ds.reduce((u, c) => u * B + c, 0);
    if (!m[3]) { res = Q(ent * B ** cif.length + val(cif), B ** cif.length); }
    else for (let a = 0; a < cif.length && !res; a++) for (let L = 1; a + L <= cif.length && !res; L++) {
      const ante = cif.slice(0, a), per = cif.slice(a, a + L);
      const den = (B ** L - 1) * B ** a, num = (val([...ante, ...per]) - val(ante)) + ent * den;
      const c = Q(num, den); if (escribe(c[0], c[1], B) === t) res = c;
    }
  }
  memo.set(k, res); return res;
}

// Toda igualdad entre cuentas de enteros y fracciones escrita en un texto es cierta («3 × 25 = 75 = 5 × 15», «6/8 = 3/4»).
const SUPS = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };
function igualdadesFalsas(t) {
  const s = String(t).replace(/(\d)[    ](?=\d{3}\b)/g, '$1').replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, m => `^${[...m].map(c => SUPS[c]).join('')}`);
  const malas = [];
  for (const m of s.matchAll(/[\d()^×+−÷=/ ]+/g)) {
    const tramo = m[0].trim();
    if (!tramo.includes('=') || /^[×+−÷=^)/]/.test(tramo) || /[×+−÷=^(/]$/.test(tramo)) continue;
    const antes = s.slice(0, m.index).replace(/\s+$/, '').slice(-1), despues = s.slice(m.index + m[0].length).replace(/^\s+/, '').slice(0, 1);
    if (/[.,√:;[\]…₍₎]/.test(antes) || /[,…₍]/.test(despues) || /\p{L}/u.test(antes) && /^\(/.test(tramo) || antes === '(') continue;
    if (/\d y$/.test(s.slice(0, m.index).replace(/\s+$/, ''))) continue;   // «2 y 1/3 = 7/3»: un número mixto
    const lados = tramo.split('=').map(x => x.trim());
    const val = x => { if ((x.match(/\(/g) || []).length !== (x.match(/\)/g) || []).length || !/\d/.test(x)) return NaN; try { return Function(`return (${x.replace(/(\d+)\s*\/\s*(\d+)/g, '(($1)/($2))').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/\^/g, '**')})`)(); } catch (e) { return NaN; } };
    const vs = lados.map(val);
    if (vs.some(v => Number.isNaN(v))) continue;
    if (vs.some(v => Math.abs(v - vs[0]) > 1e-9)) malas.push(tramo);
  }
  return malas;
}
test('las cuentas aparte funcionan: igualdades, divisiones largas y decimales escritos', () => {
  assert.deepEqual(igualdadesFalsas('3 × 25 = 75 = 5 × 15 y 6/8 = 3/4'), []);
  assert.deepEqual(igualdadesFalsas('2 × 6 = 15'), ['2 × 6 = 15']);
  assert.equal(escribe(3, 11), '0,272727…'); assert.equal(escribe(5, 6), '0,8333…'); assert.equal(escribe(41, 333), '0,123123…');
  assert.equal(escribe(1, 5, 6), '0,111…'); assert.equal(escribe(7, 40), '0,175');
  assert.deepEqual(desdeDecimal('0,272727…'), [3, 11]);
});

// Todo lo que se lee en una idea, con «Ahora tú» y «Así se resuelve» en muchas semillas.
function grilla(cs) {
  let g = [{}];
  for (const c of cs) { const vs = c.opciones ? c.opciones.map(o => o.valor) : Array.from({ length: Math.round((c.max - c.min) / c.paso) + 1 }, (_, k) => c.min + k * c.paso); g = g.flatMap(x => vs.map(v => Object.assign({}, x, { [c.id]: v }))); }
  return g;
}
function textosDe(I, n = SEMILLAS) {
  const out = [], push = (x, donde) => out.push([plano(x), donde]);
  (I.lee ? I.lee.tarjetas : []).forEach((t, i) => { push(t.texto, `lee ${i}`); if (t.ecuacion) push(t.ecuacion, `lee ${i}`); });
  for (const v of grilla(I.juega.controles)) push(I.juega.lectura(v), `lectura ${JSON.stringify(v)}`);
  push(I.juega.mision.bien, 'bien');
  I.predice.opciones.forEach(o => o.siFuera && push(o.siFuera, `siFuera ${o.id}`));
  I.mira.pasos.forEach((p, i) => { push(p.texto, `mira ${i}`); if (p.ecuacion) push(p.ecuacion, `mira ${i}`); });
  push(I.regla.texto, 'regla'); push(I.regla.ecuacion, 'regla'); push(I.regla.condicion, 'condición');
  I.ejemplos.forEach((e, i) => { push(e.enunciado, `ejemplo ${i + 1}`); e.solucion.forEach(p => { push(p.texto, `ejemplo ${i + 1}`); if (p.ecuacion) push(p.ecuacion, `ejemplo ${i + 1}`); }); push(e.respuesta, `ejemplo ${i + 1}`); (e.datos || []).forEach(d => push(d, `ejemplo ${i + 1} datos`)); });
  for (let s = 0; s < n; s++) {
    const a = I.ahoraTu.generar(s);
    push(a.pregunta, `ahora ${s}`); push(a.solucion.texto, `ahora ${s}`); push(a.solucion.ecuacion, `ahora ${s}`);
    a.opciones.forEach(o => o.siFuera && push(o.siFuera, `ahora ${s} ${o.id}`));
    (a.datos || []).forEach(d => push(d, `ahora ${s} datos`));
    if (s < 100) { const r = I.resuelve.generar(s); push(r.enunciado, `resuelve ${s}`); r.pasos.forEach(p => { push(p.texto, `resuelve ${s}`); if (p.ecuacion) push(p.ecuacion, `resuelve ${s}`); }); push(r.respuesta, `resuelve ${s}`); }
  }
  return out;
}

test('seis ideas en el orden de la propuesta, con sus id; tabla de letras y colores', () => {
  assert.equal(def.calidad, 2, 'cerrada el 20 nov tras el lector en frío y el auditor');
  assert.deepEqual(def.ideas.map(i => i.id), ID);
  assert.equal(def.septimaIdea, undefined);
  assert.deepEqual(def.colores, { parte: 'o', partes: 'i', pedido: 'f', resto: 'h' });
  for (const l of ['a', 'b', 'c', 'd', 'k', 'x', 'B', 'n', 'N', 'L']) assert.ok(def.letras[l], `tabla de letras: ${l}`);
});

test('colores: cada ficha dice su magnitud y lleva su color; nada en verde; letras de alternativa sin color', () => {
  for (const I of def.ideas) {
    const cs = I.juega.controles;
    const todo = [I.lee, I.juega.leyenda, I.juega.mision, I.predice, I.mira, I.regla, I.ejemplos];
    for (let s = 0; s < 60; s++) { todo.push(I.ahoraTu.generar(s)); if (s < 12) todo.push(I.resuelve.generar(s)); }
    for (const v of grilla(cs)) todo.push(I.juega.lectura(v));
    const fs = fichas(todo);
    assert.ok(fs.length > 30, `${I.id}: fichas ${fs.length}`);
    for (const x of fs) {
      assert.ok(x.m && def.colores[x.m], `${I.id}: ficha sin magnitud: ${JSON.stringify(x)}`);
      assert.equal(x.v, `c-${def.colores[x.m]}`, `${I.id}: ${JSON.stringify(x)}`);
    }
    for (const c of cs) assert.ok(!c.color || /^c-[iofh]$/.test(c.color), `${I.id}: control ${c.id} en ${c.color}`);
    const svgs = [];
    for (const t of (I.lee ? I.lee.tarjetas : [])) if (t.dibujo) svgs.push(svgDe({ pieza: t.pieza || I.pieza, datos: t.dibujo.datos, estado: t.dibujo.estado }, I.pieza));
    for (const v of grilla(cs)) svgs.push(svgDe(I.juega.dibujo(v), I.juega.pieza || I.pieza));
    svgs.push(svgDe(I.predice.dibujo, I.predice.pieza || I.pieza), svgDe(I.predice.revelar, I.predice.pieza || I.pieza));
    I.mira.pasos.forEach(p => svgs.push(PZ(I.mira.pieza || I.pieza).dibujar(I.mira.datos, p.estado)));
    if (I.regla.dibujo) svgs.push(svgDe(I.regla.dibujo, I.pieza));
    I.ejemplos.forEach(e => { if (e.figura) svgs.push(svgDe(e.figura, I.pieza)); });
    for (const s of svgs) assert.ok(!/var\(--c-d\)/.test(s) && !/NaN|undefined|Infinity/.test(s), `${I.id}: una figura usa verde o muestra NaN`);
    for (const n of negritas(I.ejemplos)) { assert.match(plano(n.negrita), /^[A-E]$/); assert.equal(fichas(n).length, 0); }
  }
  for (const m of def.laboratorio) for (const c of m.controles) assert.ok(!c.color || /^c-[iofh]$/.test(c.color), `${m.id}: ${c.id}`);
});

test('misiones: una sola manera en la grilla, no cumplidas al abrir; rehechas aparte', () => {
  for (const I of def.ideas) {
    const cs = I.juega.controles, g = grilla(cs);
    const cumplen = g.filter(v => I.juega.mision.logrado(v) === true);
    assert.equal(cumplen.length, 1, `${I.id}: la misión se cumple de ${cumplen.length} maneras`);
    const inicio = Object.fromEntries(cs.map(c => [c.id, c.inicio !== undefined ? c.inicio : c.opciones[0].valor]));
    assert.equal(I.juega.mision.logrado(inicio), false, `${I.id}: cumplida al abrir`);
  }
  // Idea 1: de las fracciones del juego, solo 2/3 cortada en 3 da 6/9 (escrita así).
  const fr1 = idea('equivalentes').juega.controles[0].opciones.map(o => o.valor);
  assert.deepEqual(fr1.flatMap(f => [1, 2, 3, 4].filter(k => { const [a, b] = f.split('/').map(Number); return a * k === 6 && b * k === 9; }).map(k => `${f}-${k}`)), ['2/3-3']);
  assert.ok(!fr1.includes('3/5'), 'el juego no tiene la fracción de la predicción');
  // Idea 2: con 3/4 arriba y séptimos abajo, la menor que pasa es 6/7.
  assert.equal([1, 2, 3, 4, 5, 6, 7, 8].find(c => c * 4 > 3 * 7), 6);
  // Idea 3: solo 2/3 y después 1/4 del resto dejan 1/4.
  const c3 = idea('del-resto').juega.controles;
  const q3 = c3[0].opciones.flatMap(m => c3[1].opciones.filter(t => igualQ(por(resta([1, 1], leeFr(m.valor)), resta([1, 1], leeFr(t.valor))), [1, 4])).map(t => `${m.valor}-${t.valor}`));
  assert.deepEqual(q3, ['2/3-1/4']);
  assert.ok(!c3[0].opciones.some(o => o.valor === '1/2'), 'el juego no tiene 1/2 en la mañana (la predicción)');
  // Idea 4: con numerador 1, de los impares de 3 a 11 solo 1/5 termina.
  assert.deepEqual([3, 5, 7, 9, 11].filter(b => largo(1, b).per === ''), [5]);
  // Idea 5: para 0,123123…, solo 1000x − x es entero.
  assert.deepEqual([10, 100, 1000].filter(m => (m - 1) * 41 % 333 === 0), [1000]);
  // Idea 6: 1/9 termina en las bases 3, 6 y 9; la menor, 3.
  assert.deepEqual([2, 3, 4, 5, 6, 7, 8, 9, 10].filter(B => largo(1, 9, B).per === ''), [3, 6, 9]);
  assert.ok(!idea('otras-bases').juega.controles[0].opciones.some(o => o.valor === 5), 'el juego no tiene el 5');
});

test('Predice: un código distinto por opción, una sola correcta, y cada distractor da el valor de su error', () => {
  for (const I of def.ideas) {
    const ops = I.predice.opciones;
    assert.equal(ops.filter(o => o.correcta).length, 1);
    const codigos = ops.filter(o => !o.correcta).map(o => o.error);
    assert.equal(new Set(codigos).size, codigos.length, `${I.id}: códigos repetidos ${codigos}`);
    const antes = [plano(I.juega.consigna), I.juega.mision.texto, I.juega.mision.bien, ...I.juega.leyenda.map(l => plano(l.s) + ' ' + plano(l.t)),
      ...(I.lee ? I.lee.tarjetas.map(t => plano(t.texto) + ' ' + plano(t.ecuacion || '')) : [])].join(' | ');
    const c = ops.find(o => o.correcta).texto.replace(/ del queque$/, '').replace(/^Del de /, '');
    assert.ok(!antes.includes(c) || c.length < 3, `${I.id}: lo de antes dice «${c}»`);
  }
  const op = (id, err) => idea(id).predice.opciones.find(o => (err ? o.error === err : o.correcta)).texto;
  // Idea 1: 3/5. La correcta es equivalente; cada distractor no.
  assert.ok(igualQ(leeFr(op('equivalentes')), [3, 5]));
  assert.deepEqual(leeFr(op('equivalentes', 'AT-SUMA-AMBOS')), Q(3 + 2, 5 + 2));
  assert.equal(op('equivalentes', 'AT-SOLO-ABAJO'), `3/${5 * 5}`);
  assert.equal(op('equivalentes', 'AT-SOLO-ARRIBA'), `${3 * 5}/5`);
  // Idea 2: 5/7 contra 7/9.
  assert.ok(7 * 7 > 5 * 9); assert.equal(op('orden-recta'), 'Del de 7/9');
  assert.equal(7 - 5, 9 - 7, 'a los dos les faltan 2 porciones (AT-DIFERENCIA)');
  // Idea 3: 1/2 y 1/3 de lo que quedó.
  const queda = por(resta([1, 1], [1, 2]), resta([1, 1], [1, 3]));
  assert.equal(op('del-resto'), `${fq(queda)} del queque`);
  assert.equal(op('del-resto', 'AT-RESTO-TOTAL'), `${fq(resta(resta([1, 1], [1, 2]), [1, 3]))} del queque`);
  assert.equal(op('del-resto', 'AR12'), `${fq(resta([1, 1], Q(1 + 1, 2 + 3)))} del queque`);
  assert.equal(op('del-resto', 'AT-RESTO-SOLO'), `${fq(resta([1, 1], [1, 3]))} del queque`);
  // Idea 4: solo 7/40 termina.
  for (const o of idea('exacto-periodico').predice.opciones) { const [n, d] = o.texto.split('/').map(Number); assert.equal(largo(n, d).per === '', !!o.correcta, o.texto); }
  // Idea 5: 0,272727….
  assert.deepEqual(leeFr(op('generatriz')), desdeDecimal('0,272727…'));
  assert.deepEqual(leeFr(op('generatriz', 'AT-CORTAR')), Q(27, 100));
  assert.deepEqual(leeFr(op('generatriz', 'AT-MIXTO')), Q(27, 90));
  assert.deepEqual(leeFr(op('generatriz', 'AT-NUEVES')), Q(27, 9));
  // Idea 6: 1/5 en base 6 se repite: 0,111…; 0,2 en base 6 es 1/3; 0,1 en base 6 es 1/6.
  assert.equal(escribe(1, 5, 6), '0,111…'); assert.ok(op('otras-bases').startsWith('0,111…'));
  assert.ok(igualQ(Q(2, 6), [1, 3]) && !igualQ(Q(1, 6), [1, 5]));
});

// ---------- Recálculo de «Ahora tú» (desde el texto de la pregunta; devuelve la correcta y el valor de cada error) ----------
const n_ = s => Number(String(s).replace(/[    ]/g, ''));
const entreHasta = (lo, hi, ok) => { let c = 0; for (let x = lo; x <= hi; x++) if (ok(x)) c++; return c; };
const RECALCULO = {
  equivalentes(p) {
    let m;
    if ((m = p.match(/recuadro\? (\d+)\/(\d+) = □\/(\d+)$/))) { const [a, b, D] = m.slice(1).map(Number), k = D / b; return { c: String(a * k), suma: String(a + D - b), abajo: String(a), factor: String(k) }; }
    if ((m = p.match(/recuadro\? (\d+)\/(\d+) = (\d+)\/□$/))) { const [a, b, N] = m.slice(1).map(Number), k = N / a; return { c: String(b * k), suma: String(b + N - a), arriba: String(b), factor: String(k) }; }
    if ((m = p.match(/es la misma parte que (\d+)\/(\d+)\?$/))) return { equivalente: [+m[1], +m[2]] };
    if ((m = p.match(/irreductible equivalente a (\d+)\/(\d+)\?$/))) { const [N, D] = [+m[1], +m[2]], g = GCD(N, D); return { c: fq(Q(N, D)), invertir: `${D / g}/${N / g}`, arriba: `${N / g}/${D}` }; }
    if ((m = p.match(/equivalente a (\d+)\/(\d+) tiene numerador y denominador que suman (\d+)/))) { const [a, b, S] = m.slice(1).map(Number), k = S / (a + b); return { c: String(b * k), numerador: String(a * k), factor: String(k), resta: String(S - b) }; }
    if ((m = p.match(/equivalente a (\d+)\/(\d+) tiene un denominador que excede a su numerador en (\d+)/))) { const [a, b, D] = m.slice(1).map(Number), k = D / (b - a); return { c: `${a * k}/${b * k}`, suma: `${a + D}/${b + D}`, factor: `${a * D}/${b * D}`, sink: `${a}/${a + D}` }; }
    if ((m = p.match(/equivalentes a (\d+)\/(\d+) tienen denominador de tres cifras/))) { const [a, b] = [+m[1], +m[2]], C = entreHasta(1, 999, k => b * k >= 100 && b * k <= 999); return { c: String(C), desde1: String(entreHasta(1, 999, k => b * k <= 999)), masuno: String(C - 1), numerador: String(entreHasta(1, 999, k => a * k >= 100 && a * k <= 999)) }; }
    throw new Error(`sin recálculo: ${p}`);
  },
  'orden-recta'(p, textos) {
    let m;
    if ((m = p.match(/mayor: (\d+)\/(\d+) o (\d+)\/(\d+)\?$/))) { const x = [+m[1], +m[2]], y = [+m[3], +m[4]], M = x[0] * y[1] > x[1] * y[0] ? x : y; return { c: `${M[0]}/${M[1]}`, iguales: 'Son iguales', nose: 'No se pueden comparar' }; }
    if ((m = p.match(/^Ordena de menor a mayor: (.+)\.$/))) {
      const xs = m[1].split(', ').map(t => t.split('/').map(Number)), t = l => l.map(z => z.join('/')).join(' < ');
      return { c: t(xs.slice().sort((u, v) => u[0] * v[1] - v[0] * u[1])), num: t(xs.slice().sort((u, v) => u[0] - v[0] || u[1] - v[1])), porcion: t(xs.slice().sort((u, v) => v[1] - u[1])) };
    }
    if ((m = p.match(/es (aparente|propia): (.+)\?$/))) { const xs = m[2].split(', ').map(t => t.split('/').map(Number)), ok = xs.filter(([a, b]) => (m[1] === 'aparente' ? a % b === 0 : a < b)); assert.equal(ok.length, 1, p); return { c: ok[0].join('/') }; }
    if ((m = p.match(/se escribe (\d+)\/(\d+) como número mixto\?$/))) { const [a, b] = [+m[1], +m[2]]; return { c: `${Math.floor(a / b)} y ${a % b}/${b}`, invierte: `${a % b} y ${Math.floor(a / b)}/${b}`, denom: `${Math.floor(a / b)} y ${a % b}/${a}` }; }
    if ((m = p.match(/irreductibles de denominador (\d+) son mayores que (\d+)\/(\d+) y menores que (\d+)\/(\d+)\?$/))) {
      const [N, p1, q1, u, s] = m.slice(1).map(Number), dentro = k => k * q1 > p1 * N && k * s < u * N;
      const todas = entreHasta(1, N - 1, dentro);
      return { c: String(entreHasta(1, N - 1, k => dentro(k) && GCD(k, N) === 1)), todas: String(todas), extremos: String(todas + 2) };
    }
    if ((m = p.match(/de (\d+) kg cuesta S\/ (\d+) y otra de (\d+) kg cuesta S\/ (\d+)\./))) { const [k1, P1, k2, P2] = m.slice(1).map(Number); return { c: P1 * k2 < P2 * k1 ? `La de ${k1} kg` : `La de ${k2} kg`, total: P1 * k2 < P2 * k1 ? `La de ${k2} kg` : `La de ${k1} kg`, igual: 'Las dos igual' }; }
    throw new Error(`sin recálculo: ${p} ${textos}`);
  },
  'del-resto'(p) {
    let m;
    const uno = [1, 1];
    // Tipo 0 (cierre, 20 nov): qué queda tras la mañana y la tarde (antes, una suma sola).
    if ((m = p.match(/mañana se vende (\d+)\/(\d+) de un queque y en la tarde, (\d+)\/(\d+) de lo que quedó\. ¿Qué parte del queque queda al final\?/))) {
      const M = [+m[1], +m[2]], T = [+m[3], +m[4]], t = resta(resta(uno, M), T);
      return { c: fq(por(resta(uno, M), resta(uno, T))), total: t[0] > 0 ? fq(t) : '(no queda nada)', ar12: fq(resta(uno, Q(M[0] + T[0], M[1] + T[1]))), solo: fq(resta(uno, T)) };
    }
    if ((m = p.match(/mañana se vende (\d+)\/(\d+) de un queque y en la tarde, (\d+)\/(\d+) de lo que quedó\. ¿Qué parte del queque se vendió en total\?/))) {
      const M = [+m[1], +m[2]], T = [+m[3], +m[4]], v = suma(M, por(T, resta(uno, M)));
      return { c: fq(v), total: fq(suma(M, T)), ar12: `${M[0] + T[0]}/${M[1] + T[1]}`, queda: fq(resta(uno, v)) };
    }
    if ((m = p.match(/saco de (\d+) kg de arroz\. Vende (\d+)\/(\d+) del saco y después (\d+)\/(\d+) de lo que le quedó/))) {
      const [N, a, b, c, d] = m.slice(1).map(Number), q1 = N - N * a / b, q = q1 - q1 * c / d;
      return { c: `${q} kg`, total: `${N - N * a / b - N * c / d} kg`, tarde: `${q1 * c / d} kg`, una: `${q1} kg` };
    }
    if ((m = p.match(/vendió (\d+)\/(\d+) de sus panes y después (\d+)\/(\d+) de los que le quedaban\. Le quedaron (\d+) panes/))) {
      const [a, b, c, d, R] = m.slice(1).map(Number); let N0 = null; for (let N = 1; N <= 5000; N++) { const q1 = N * (b - a) / b, q = q1 * (d - c) / d; if (Number.isInteger(q1) && Number.isInteger(q) && q === R) { N0 = N; break; } }
      const d0 = resta(resta(uno, [a, b]), [c, d]), t = d0[0] > 0 ? entre([R, 1], d0) : null;
      return { c: String(N0), doble: String(2 * R), total: t && t[1] === 1 ? String(t[0]) : '(no sale entero)', tarde: fq(entre([R, 1], resta(uno, [c, d]))), man: fq(entre([R, 1], resta(uno, [a, b]))) };
    }
    if ((m = p.match(/llena un tanque en (\d+) h y otro en (\d+) h; un desagüe lo vacía en (\d+) h/))) {
      const [A, B, C] = m.slice(1).map(Number), h = resta(suma([1, A], [1, B]), [1, C]);
      return { c: `${fq(entre(uno, h))} h`, desague: `${fq(entre(uno, suma(suma([1, A], [1, B]), [1, C])))} h`, cerrado: `${fq(entre(uno, suma([1, A], [1, B])))} h`, inv: `${fq(h)} h` };
    }
    if ((m = p.match(/llena un tanque en (\d+) h y otro en (\d+) h\. Abiertos los dos/))) {
      const [A, B] = m.slice(1).map(Number), h = suma([1, A], [1, B]);
      return { c: `${fq(entre(uno, h))} h`, suma: `${A + B} h`, mitad: `${fq(Q(A + B, 2))} h`, inv: `${fq(h)} h` };
    }
    if ((m = p.match(/pierde (\d+)\/(\d+) de su dinero; después, (\d+)\/(\d+) de lo que le quedaba, y luego gana S\/ (\d+)\. Termina con S\/ (\d+)/))) {
      const [a, b, c, d, G, F] = m.slice(1).map(Number), k = por(resta(uno, [a, b]), resta(uno, [c, d])), N = entre([F - G, 1], k);
      const d0 = resta(resta(uno, [a, b]), [c, d]), t = d0[0] > 0 ? entre([F - G, 1], d0) : null;
      return { c: `S/ ${fq(N)}`, resta: `S/ ${F - G}`, total: t && t[1] === 1 ? `S/ ${t[0]}` : '(no sale entero)', ganancia: `S/ ${fq(entre([F, 1], k))}`, sumaG: `S/ ${fq(entre([F + G, 1], k))}` };
    }
    throw new Error(`sin recálculo: ${p}`);
  },
  'exacto-periodico'(p, textos) {
    let m;
    if (/da un decimal exacto\?$/.test(p)) { const ok = textos.filter(t => { const [n, d] = t.split('/').map(Number); return largo(n, d).per === ''; }); assert.equal(ok.length, 1, `${p} ${textos}`); return { c: ok[0] }; }
    if ((m = p.match(/cifras no periódicas tiene el decimal de (\d+)\/(\d+)\?$/))) { const x = largo(+m[1], +m[2]); return { c: String(x.ante.length), puro: '0', bloque: String(x.per.length) }; }
    if ((m = p.match(/tiene el decimal de (\d+)\/(\d+)\?$/))) { const x = largo(+m[1], +m[2]); assert.equal(x.per, ''); return { c: String(x.ante.length) }; }
    if (/es irracional\?$/.test(p)) { const ok = textos.filter(t => { const r = t.match(/^√(\d+)$/); return r && Math.round(Math.sqrt(+r[1])) ** 2 !== +r[1]; }); assert.equal(ok.length, 1, textos.join(' ')); return { c: ok[0] }; }
    if ((m = p.match(/decimal de (\d+)\/(\d+)!\?$/))) { let F = 1; for (let i = 2; i <= +m[2]; i++) F *= i; return { c: String(largo(+m[1], F).ante.length), k: m[2] }; }
    if ((m = p.match(/^El decimal de (\d+)\/(\d+) es (\S+) ¿Qué cifra ocupa el lugar (\d+) después de la coma\?$/))) {
      const [a, q, , n] = [+m[1], +m[2], m[3], +m[4]]; assert.equal(m[3], escribe(a, q));
      let r = a % q, c = 0; for (let i = 0; i < n; i++) { r *= 10; c = Math.floor(r / q); r %= q; }
      const per = largo(a, q).per; return { c: String(c), primera: per[0] };
    }
    throw new Error(`sin recálculo: ${p}`);
  },
  generatriz(p) {
    let m;
    if ((m = p.match(/^¿Qué fracción irreductible es (\S+…) \+ (\S+…)\?$/))) { const x = desdeDecimal(m[1]), y = desdeDecimal(m[2]); return { c: fq(suma(x, y)), ar12: `${x[0] + y[0]}/${x[1] + y[1]}` }; }
    if ((m = p.match(/^¿Qué fracción irreductible es (\S+…) × (\S+)\?$/))) { const x = desdeDecimal(m[1]), y = leeFr(String(Math.round(Number(m[2].replace(',', '.')) * 100))); return { c: fq(por(x, entre(y, [100, 1]))), solo: fq(x) }; }
    if ((m = p.match(/^¿Qué fracción irreductible es (\S+…)\?$/))) { const x = desdeDecimal(m[1]); assert.ok(x, p); return { c: fq(x) }; }
    if ((m = p.match(/^¿Qué fracción irreductible es (0,\d+)\?$/))) { const k = m[1].length - 2; return { c: fq(Q(+m[1].slice(2), 10 ** k)), menos: fq(Q(+m[1].slice(2), 10 ** (k - 1))), nueves: fq(Q(+m[1].slice(2), 10 ** k - 1)), mas: fq(Q(+m[1].slice(2), 10 ** (k + 1))) }; }
    if ((m = p.match(/gasta el (\S+) % de su sueldo en el alquiler y le quedan S\/ (\d+)\./))) {
      const f = entre(desdeDecimal(m[1]), [100, 1]), R = +m[2], S = entre([R, 1], resta([1, 1], f));
      return { c: `S/ ${fq(S)}`, gasto: `S/ ${fq(por(S, f))}` };
    }
    throw new Error(`sin recálculo: ${p}`);
  },
  'otras-bases'(p, textos) {
    let m;
    const exacta = (n, B) => largo(1, n, B).per === '';
    if ((m = p.match(/bases es exacta la fracción (\d+)\/(\d+)\?$/))) { const ok = textos.filter(t => exacta(+m[2], +t.replace('Base ', ''))); assert.equal(ok.length, 1, `${p} ${textos}`); return { c: ok[0], diez: 'Base 10' }; }
    if ((m = p.match(/^¿Qué fracción irreductible es 0,(\d)(\d)₍(.)₎\?$/))) { const [x, y] = [+m[1], +m[2]], B = '₀₁₂₃₄₅₆₇₈₉'.indexOf(m[3]); return { c: fq(Q(x * B + y, B * B)), b10: fq(Q(10 * x + y, 100)), pos: fq(Q(x + y, B)), mas: fq(Q(x * B + y, B ** 3)) }; }
    if ((m = p.match(/menor base en que (\d+)\/(\d+) es exacta\?$/))) { let B = 2; while (!exacta(+m[2], B)) B++; return { c: `Base ${B}`, n: `Base ${m[2]}`, diez: 'Base 10' }; }
    if ((m = p.match(/es (0,\S+…)₍(.)₎, en la que/))) { const B = '₀₁₂₃₄₅₆₇₈₉'.indexOf(m[2]), x = desdeDecimal(m[1], B); const xy = m[1].slice(2, 4); return { c: fq(x), b10: fq(Q(+xy, 99)) }; }
    if ((m = p.match(/de la 2 a la (\d+), es exacta la fracción (\d+)\/(\d+)\?$/))) { const [L, , n] = m.slice(1).map(Number); return { c: String(entreHasta(2, L, B => exacta(n, B))), grande: String(L - n + 1) }; }
    throw new Error(`sin recálculo: ${p}`);
  },
};
test('«Ahora tú»: 400 semillas por idea con cuatro opciones distintas, datos; la correcta y cada error rehechos aparte', () => {
  for (const I of def.ideas) {
    const vistas = new Set();
    for (let s = 0; s < SEMILLAS; s++) {
      const a = I.ahoraTu.generar(s), ops = a.opciones, p = plano(a.pregunta).replace(/ \/ /g, '/'), textos = ops.map(o => o.texto);
      assert.equal(ops.length, 4, `${I.id} ${s}`);
      assert.equal(new Set(textos).size, 4, `${I.id} ${s}: opciones repetidas`);
      assert.equal(ops.filter(o => o.correcta).length, 1);
      assert.ok(Array.isArray(a.datos) && a.datos.length, `${I.id} ${s}: sin datos`);
      const r = RECALCULO[I.id](p, textos), c = ops.find(o => o.correcta).texto;
      if (r.equivalente) {
        const [a0, b0] = r.equivalente;
        for (const o of ops) { const [x, y] = o.texto.split('/').map(Number); assert.equal(x * b0 === y * a0, !!o.correcta, `${p}: ${o.texto}`); }
      } else assert.equal(sinEsp(r.c), sinEsp(c), `${I.id} ${s}: ${p}`);
      for (const o of ops.filter(x => !x.correcta)) {
        assert.ok(o.error && o.siFuera, `${I.id} ${s}: ${o.texto} sin error o siFuera`);
        if (r[o.id] !== undefined) assert.equal(sinEsp(o.texto).replace(/^(\d+)\/1$/, '$1'), sinEsp(r[o.id]).replace(/^(\d+)\/1$/, '$1'), `${I.id} ${s} «${p}»: el error ${o.id} da ${r[o.id]}, no ${o.texto}`);
      }
      vistas.add(p);
    }
    assert.ok(vistas.size > 40, `${I.id}: pocas preguntas distintas (${vistas.size})`);
  }
});

test('«Así se resuelve»: 100 semillas que cuadran con una cuenta aparte y no repiten «Ahora tú»', () => {
  const ahora = new Set(); for (const I of def.ideas) for (let s = 0; s < 12; s++) ahora.add(planoN(I.ahoraTu.generar(s).pregunta));
  for (let s = 0; s < 100; s++) {
    const R = def.ideas.map(I => I.resuelve.generar(s));
    for (const r of R) assert.ok(!ahora.has(planoN(r.enunciado)), planoN(r.enunciado));
    let m;
    m = planoN(R[0].enunciado).match(/equivalente a (\d+)\/(\d+) tiene numerador y denominador cuyo producto es (\d+)/);
    { const [a, b, P] = m.slice(1).map(Number), s2 = []; for (let x = 1; x * x <= P; x++) if (P % x === 0 && x * b === (P / x) * a) s2.push(`${x}/${P / x}`); assert.equal(s2.length, 1); assert.ok(sinEsp(planoN(R[0].respuesta)).endsWith(sinEsp(s2[0])), planoN(R[0].respuesta)); }
    m = planoN(R[1].enunciado).match(/mayor que (\d+)\/(\d+) y menor que (\d+)\/(\d+)/);
    { const [a, b, c, d] = m.slice(1).map(Number), x = planoN(R[1].respuesta).match(/(\d+)\/(\d+)$/), [u, w] = [+x[1], +x[2]]; assert.ok(u * b > a * w && u * d < c * w, planoN(R[1].respuesta)); }
    m = planoN(R[2].enunciado).match(/se vende (\d+)\/(\d+) de un queque\. .* queda (\d+)\/(\d+) del queque/);
    { const [a, b, q1, q2] = m.slice(1).map(Number), t = resta([1, 1], entre([q1, q2], resta([1, 1], [a, b]))); assert.ok(planoN(R[2].respuesta).includes(fq(t)), planoN(R[2].respuesta)); }
    m = planoN(R[3].enunciado).match(/decimal de (\d+)\/(\d+) es exacto/);
    { const x = largo(+m[1], +m[2]); assert.equal(x.per, ''); assert.ok(planoN(R[3].respuesta).endsWith(`0,${x.ante}`), planoN(R[3].respuesta)); }
    m = planoN(R[4].enunciado).match(/es (\S+…)\?$/);
    { const x = desdeDecimal(m[1]); assert.ok(sinEsp(planoN(R[4].respuesta)).replace(/[()]/g, '').endsWith(fq(x)), `${m[1]} → ${planoN(R[4].respuesta)}`); }
    m = planoN(R[5].enunciado).match(/fracción (\d+)\/(\d+) en base (\d+)/);
    { const [a, n, B] = m.slice(1).map(Number), x = largo(a, n, B); assert.equal(x.per, ''); assert.ok(sinEsp(planoN(R[5].respuesta)).includes(`0,${x.ante}`), planoN(R[5].respuesta)); }
  }
});

test('toda igualdad numérica escrita en la unidad es cierta (400 semillas de «Ahora tú», 100 de «Así se resuelve»)', () => {
  const malas = [];
  for (const I of def.ideas) for (const [t, donde] of textosDe(I)) for (const m of igualdadesFalsas(t)) malas.push(`${I.id} ${donde}: «${m}» en «${t}»`);
  for (const g of def.glosario) for (const e of g.ejemplos || []) for (const m of igualdadesFalsas(e)) malas.push(`glosario ${g.termino}: «${m}»`);
  assert.deepEqual(malas.slice(0, 20), []);
});

test('«Ahora tú» no repite la predicción, la misión ni un ejemplo (los números de la pregunta, en orden)', () => {
  const nums = t => (sinEsp(t).match(/\d+/g) || []).join('-');
  for (const I of def.ideas) {
    // Con tres números o más: dos números iguales no hacen la misma pregunta (3/7 en «tres cifras» y en «cuál es igual»).
    const usados = new Set([nums(plano(I.predice.pregunta)), ...I.ejemplos.map(e => nums(plano(e.enunciado)))].filter(x => x.split('-').length >= 3));
    for (let s = 0; s < SEMILLAS; s++) assert.ok(!usados.has(nums(plano(I.ahoraTu.generar(s).pregunta))), `${I.id} ${s}: ${plano(I.ahoraTu.generar(s).pregunta)}`);
  }
});

// ---------- Ejemplos ----------
test('ejemplos: 15 por idea, 5 por nivel, con datos; nivel 3 con cinco alternativas, una sola que cuadra y cada trampa nombrada', () => {
  const LETRAS = 'ABCDE', cuenta = {};
  for (const I of def.ideas) {
    const ej = I.ejemplos;
    assert.equal(ej.length, 15, I.id);
    for (const n of [1, 2, 3]) assert.equal(ej.filter(e => e.nivel === n).length, 5, `${I.id} nivel ${n}`);
    for (const e of ej) {
      assert.ok(Array.isArray(e.datos) && e.datos.length, `${I.id} «${e.titulo}»: sin datos`);
      if (e.nivel !== 3) continue;
      assert.equal(e.alternativas.length, 5); assert.equal(new Set(e.alternativas).size, 5);
      const L = plano(negritas(e.respuesta)[0].negrita);
      cuenta[L] = (cuenta[L] || 0) + 1;
      const r = sinEsp(plano(e.respuesta).replace(/^[A-E]: /, '')), alt = sinEsp(e.alternativas[LETRAS.indexOf(L)]);
      assert.ok(r.toLowerCase().includes(alt.toLowerCase().replace(/^la/, '').replace(/^base/, 'base')) || r.toLowerCase().includes(alt.toLowerCase()), `${I.id} «${e.titulo}»: ${L} = ${alt} y la respuesta dice ${r}`);
      const nombradas = negritas(e.solucion).map(n => plano(n.negrita));
      for (const l of LETRAS) if (l !== L) assert.ok(nombradas.includes(l), `${I.id} «${e.titulo}»: no explica ${l}`);
    }
  }
  assert.deepEqual(cuenta, { A: 6, B: 6, C: 6, D: 6, E: 6 }, 'la letra correcta, 6 veces cada una');
});

// La respuesta de cada ejemplo de nivel 3 y el valor de cada trampa, rehechos aquí.
test('ejemplos de nivel 3: la correcta y cada trampa dan de verdad su valor', () => {
  const alt = (id, t) => idea(id).ejemplos.find(e => e.titulo === t).alternativas;
  const uno = [1, 1];
  // Idea 1.
  assert.deepEqual(alt('equivalentes', 'La suma de los términos').map(Number), [9 * 91 / 13, 4 * 91 / 13, 91 - 9, 91 / 13, 9]);
  assert.deepEqual(alt('equivalentes', 'La diferencia de los términos'), [`${5 + 27}/${8 + 27}`, '45/72', `${5 * 27}/${8 * 27}`, `5/${5 + 27}`, `${5 * 8}/${8 * 8}`]);
  assert.equal(72 - 45, 27); assert.equal(64 - 40, 24);
  const t37 = entreHasta(1, 999, k => 7 * k >= 100 && 7 * k <= 999);
  assert.deepEqual(alt('equivalentes', 'Denominador de tres cifras').map(Number), [entreHasta(1, 999, k => 7 * k <= 999), t37 - 1, t37, entreHasta(1, 999, k => 3 * k >= 100 && 3 * k <= 999), 142 - 14 + 1]);
  assert.deepEqual(alt('equivalentes', 'Irreductible y su suma').map(Number), [56 + 98, 28 + 49, 4, 4 + 7, 7]);
  assert.ok(igualQ(Q(56, 98), [4, 7]));
  const n25 = entreHasta(1, 99, k => 2 * k >= 10 && 2 * k <= 99);
  assert.deepEqual(alt('equivalentes', 'Numerador de dos cifras').map(Number), [entreHasta(1, 99, k => 2 * k <= 99), n25 - 1, entreHasta(1, 99, k => 5 * k >= 10 && 5 * k <= 99), 90, n25]);
  // Idea 2.
  const dentro = (k, N, a, b, c, d) => k * b > a * N && k * d < c * N;
  assert.deepEqual(alt('orden-recta', 'Irreductibles entre dos').map(Number), [entreHasta(1, 23, k => dentro(k, 24, 1, 3, 3, 4)), entreHasta(1, 23, k => dentro(k, 24, 1, 3, 3, 4) && GCD(k, 24) === 1),
    entreHasta(1, 23, k => dentro(k, 24, 1, 3, 3, 4)) + 2, entreHasta(1, 23, k => dentro(k, 24, 1, 3, 3, 4) && k % 2), entreHasta(1, 23, k => dentro(k, 24, 1, 3, 3, 4) && k % 3)]);
  const v5 = alt('orden-recta', 'La mayor de cinco').map(leeFr), mayor = v5.reduce((u, w) => (u[0] * w[1] > w[0] * u[1] ? u : w));
  assert.deepEqual(mayor, [3, 4]); assert.equal(Math.max(...v5.map(x => x[0])), 13);
  const kilo = [[11, 3], [18, 5], [29, 8]].map(([P, k]) => Q(P, k)), barata = kilo.reduce((u, w) => (u[0] * w[1] < w[0] * u[1] ? u : w));
  assert.deepEqual(barata, [18, 5]);
  assert.deepEqual(alt('orden-recta', 'Cuántas caben entre dos').map(Number), [entreHasta(1, 14, k => dentro(k, 15, 2, 5, 4, 5)) + 2, 3, 12 - 6, 11 - 7, entreHasta(1, 14, k => dentro(k, 15, 2, 5, 4, 5))]);
  assert.ok(igualQ(suma([2, 1], [3, 5]), [13, 5]));
  // Idea 3.
  const k23 = por(resta(uno, [2, 5]), resta(uno, [1, 3]));
  assert.deepEqual(alt('del-resto', 'Los panes que quedaron').map(Number), [48 / (1 - 2 / 5 - 1 / 3), fq(entre([48, 1], resta(uno, [2, 5]))), fq(entre([48, 1], k23)), fq(entre([48, 1], resta(uno, [1, 3]))), 96].map(Number));
  const h = (...xs) => xs.reduce((u, w) => suma(u, w));
  assert.deepEqual(alt('del-resto', 'Grifos y desagüe'), [`${fq(entre(uno, h([1, 4], [1, 6], [1, 12])))} h`, `${fq(entre(uno, h([1, 4], [1, 6])))} h`, `${4 + 6 + 12} h`, `${fq(entre(uno, resta(h([1, 4], [1, 6]), [1, 12])))} h`, `${fq(resta(h([1, 4], [1, 6]), [1, 12]))} h`]);
  const viaje = por(resta(uno, [1, 4]), resta(uno, [2, 3]));
  assert.deepEqual(alt('del-resto', 'El viaje en tres tramos'), [`${fq(entre([2, 1], resta(resta(uno, [1, 4]), [2, 3])))} h`, `${fq(entre([2, 1], resta(uno, [2, 3])))} h`, `${fq(entre([2, 1], resta(uno, [1, 4])))} h`, `${fq(entre([2, 1], resta(uno, Q(1 + 2, 4 + 3))))} h`, `${fq(entre([2, 1], viaje))} h`]);
  const pd = por(resta(uno, [1, 3]), resta(uno, [1, 4]));
  assert.deepEqual(alt('del-resto', 'Pierde dos veces y gana'), [`S/ ${fq(entre([60, 1], pd))}`, `S/ ${fq(entre([90, 1], pd))}`, `S/ ${fq(entre([120, 1], pd))}`, `S/ ${fq(entre([60, 1], resta(resta(uno, [1, 3]), [1, 4])))}`, 'S/ 60']);
  assert.deepEqual(alt('del-resto', 'Agua y aceite'), [`${fq(entre([5, 1], h([1, 3], [1, 2])))} L`, `${fq(entre([5, 1], resta(uno, h([1, 3], [1, 2]))))} L`, `${fq(entre([5, 1], resta(uno, [2, 5])))} L`, `${fq(entre([3, 1], resta(uno, h([1, 3], [1, 2]))))} L`, '5 L']);
  // Idea 4.
  assert.deepEqual(alt('exacto-periodico', 'Con un factorial').map(Number), [4 + 1, 1, 6, largo(1, 720).ante.length, 2]);
  assert.equal(alt('exacto-periodico', 'El lugar 100')[4], escribe(3, 7).replace('0,', '')[(100 - 1) % 6]);
  assert.deepEqual(alt('exacto-periodico', 'La única exacta').filter(t => { const [n, d] = t.split('/').map(Number); return largo(n, d).per === ''; }), ['21/56']);
  assert.deepEqual(alt('exacto-periodico', 'Cifras de un exacto').map(Number), [5 + 2, largo(1, 800).ante.length, 2, 10, 3]);
  const x600 = largo(1, 600);
  assert.equal(alt('exacto-periodico', 'Antes y dentro del bloque')[2], `${x600.ante.length} y ${x600.per.length}`);
  // Idea 5.
  const pc = entre(desdeDecimal('16,666…'), [100, 1]), S = entre([1500, 1], resta(uno, pc));
  assert.deepEqual(alt('generatriz', 'Un porcentaje que se repite'), [`S/ ${fq(por(S, pc))}`, `S/ ${fq(por([1500, 1], suma(uno, pc)))}`, `S/ ${fq(por([1500, 1], resta(uno, pc)))}`, `S/ ${fq(entre([1500, 1], pc))}`, `S/ ${fq(S)}`]);
  assert.deepEqual(alt('generatriz', 'Sumar dos colas'), [fq(suma(desdeDecimal('0,454545…'), desdeDecimal('0,1666…'))), '61/100', '6/17', '45/99', fq(suma(Q(45, 99), Q(16, 99)))]);
  assert.deepEqual(leeFr(alt('generatriz', 'Un producto')[1]), por(desdeDecimal('0,8333…'), [6, 5]));
  assert.deepEqual(leeFr(alt('generatriz', 'Un producto')[2]), por(Q(83, 90), [6, 5]));
  assert.deepEqual(alt('generatriz', 'Con entero y cifra antes'), [fq(Q(2136, 1000)), '2134/999', fq(desdeDecimal('2,1363636…')), fq(Q(2115, 9900)), fq(Q(211, 99))]);
  assert.deepEqual(Q(2115, 990), [47, 22]); assert.equal(escribe(47, 22), '2,1363636…');
  assert.deepEqual(Q(375, 1000), [3, 8]);
  // Idea 6.
  assert.deepEqual(desdeDecimal('0,333…', 5), leeFr(alt('otras-bases', 'Un bloque en base 5')[0]));
  assert.deepEqual(alt('otras-bases', '¿En qué base termina?').filter(t => largo(1, 18, +t.replace('Base ', '')).per === ''), ['Base 12']);
  assert.deepEqual(alt('otras-bases', 'Cuántas bases').map(Number), [entreHasta(2, 30, B => B % 2 === 0), entreHasta(2, 30, B => B % 5 === 0), entreHasta(10, 30, () => true), 1, entreHasta(2, 30, B => largo(1, 10, B).per === '')]);
  assert.deepEqual(desdeDecimal('0,252525…', 7), leeFr(alt('otras-bases', 'Bloque de dos en base 7')[1]));
  assert.deepEqual(alt('otras-bases', 'La menor base').filter(t => largo(1, 30, +t.replace('Base ', '')).per === '' && +t.replace('Base ', '') <= 30), ['Base 30']);
});

test('ejemplos de nivel 1 y 2: la respuesta rehecha aparte', () => {
  const r = (id, t) => sinEsp(plano(idea(id).ejemplos.find(e => e.titulo === t).respuesta));
  const tiene = (id, t, v) => assert.ok(r(id, t).includes(sinEsp(v)), `${id} «${t}»: ${r(id, t)} contra ${v}`);
  tiene('equivalentes', 'El número que falta', String(2 * 12 / 3)); tiene('equivalentes', 'Simplificar 12/16', fq(Q(12, 16)));
  tiene('equivalentes', 'Llegar a treintavos', `${5 * 30 / 6}/30`); tiene('equivalentes', 'Simplificar con primos', fq(Q(84, 126)));
  tiene('equivalentes', 'Simplificar y después ampliar', `${14 * 45 / 18}/45`); tiene('equivalentes', 'Despejar en cruz', String(6 * 15 / 9));
  tiene('orden-recta', 'De mixto a impropia', '17/5'); tiene('orden-recta', 'De impropia a mixto', `${Math.floor(11 / 4)}y${11 % 4}/4`);
  tiene('del-resto', 'Sumar con el MCM', fq(suma([1, 4], [1, 6]))); tiene('del-resto', 'Restar', fq(resta([5, 6], [1, 4])));
  tiene('del-resto', 'La mañana y la tarde', fq(por(resta([1, 1], [1, 4]), resta([1, 1], [1, 3]))));
  tiene('del-resto', 'Lo vendido en el día', fq(suma([2, 5], por([1, 2], [3, 5])))); tiene('del-resto', 'Los kilos que quedan', `${60 * 2 / 3 * 3 / 4}kg`);
  tiene('del-resto', 'Dos grifos juntos', `${fq(entre([1, 1], suma([1, 3], [1, 6])))}h`); tiene('del-resto', 'Hacia atrás', 'S/60');
  tiene('exacto-periodico', '¿Termina 3/8?', escribe(3, 8)); tiene('exacto-periodico', 'Cifras de 13/80', escribe(13, 80));
  tiene('exacto-periodico', 'Exacta escondida', escribe(33, 440)); tiene('exacto-periodico', 'El resto que vuelve', largo(2, 7).per);
  for (const [t, d] of [['Un bloque de una cifra', '0,777…'], ['Un bloque de dos cifras', '0,363636…'], ['Una cifra antes del bloque', '0,1666…'], ['Un bloque de tres cifras', '0,135135…'], ['Mixto con bloque de dos', '0,2454545…'], ['Dos cifras antes', '0,12777…'], ['Con parte entera', '1,333…']]) tiene('generatriz', t, fq(desdeDecimal(d)));
  tiene('otras-bases', '1/4 en base 6', `${escribe(1, 4, 6)}₍₆₎`); tiene('otras-bases', '1/3 en base 2', `${escribe(1, 3, 2)}₍₂₎`);
  tiene('otras-bases', 'De base 3 a fracción', fq(suma([1, 3], [2, 9]))); tiene('otras-bases', 'Dos cifras en base 4', fq(suma([2, 4], [1, 16])));
});

test('glosario: de 2 a 4 palabras por idea, con su simple y tres ejemplos; ninguno trae la respuesta de Predice ni de la misión', () => {
  const porIdea = Glosario.porIdea(def);
  porIdea.forEach((ts, i) => assert.ok(ts.length >= 2 && ts.length <= 4, `${ID[i]}: ${ts.map(t => t.termino)}`));
  // Como la regla glosario-predice: los términos que estrena cada idea no traen la respuesta de su predicción ni su misión.
  porIdea.forEach((ts, i) => {
    const I = def.ideas[i], r = I.predice.opciones.find(o => o.correcta).texto.replace(/ del queque$|^Del de | periódico$/g, '');
    for (const g of ts) {
      assert.ok(g.simple && (g.ejemplos || []).length >= 3, g.termino);
      const txt = [g.def, g.simple, ...g.ejemplos].join(' | ');
      assert.ok(!txt.includes(r), `${g.termino}: dice «${r}»`);
      assert.ok(!txt.includes(I.juega.mision.bien), g.termino);
    }
  });
});

test('notación: × y nunca «·» (salvo el separador de una regla); el decimal que se repite, siempre igual', () => {
  for (const I of def.ideas) for (const [t, donde] of textosDe(I, 60)) {
    assert.ok(!/\S·|·\S/.test(t), `${I.id} ${donde}: «·» en «${t}»`);
    if (/cada vez|ningún bloque|1,010010001…|≈/.test(t)) continue;   // el irracional 1,010010001… no repite a propósito
    for (const m of t.matchAll(/(\d+),(\d+)…/g)) {
      // Un decimal con «…» repite su último bloque como dice la decisión 8 (una o dos cifras, tres veces; más, dos).
      const cifras = m[2];
      const ok = [1, 2, 3, 4, 5, 6].some(L => { const b = cifras.slice(-L), veces = L <= 2 ? 3 : 2; return cifras.endsWith(b.repeat(veces)); });
      assert.ok(ok, `${I.id} ${donde}: «${m[0]}» no repite su bloque como el resto de la unidad`);
    }
  }
});

test('las figuras del queque caben y no se pisan (arit-queque), también las de los ejemplos', () => {
  const P = PZ('arit-queque'), { W, M } = P.constantes;
  const solapan = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
  const figs = [];
  for (const I of def.ideas.filter(i => i.pieza === 'arit-queque')) {
    for (const v of grilla(I.juega.controles)) figs.push(I.juega.dibujo(v));
    figs.push(I.predice.dibujo, I.predice.revelar);
    I.mira.pasos.forEach(p => figs.push({ datos: I.mira.datos, estado: p.estado }));
  }
  for (const I of def.ideas) for (const e of I.ejemplos) if (e.figura && e.figura.pieza === 'arit-queque') figs.push(e.figura);
  for (const I of def.ideas) for (const t of (I.lee ? I.lee.tarjetas : [])) if (t.dibujo && (t.pieza || I.pieza) === 'arit-queque') figs.push(t.dibujo);
  for (const f of figs) {
    const g = P.geometria(f.datos, f.estado || {});
    for (const c of [...g.objetos, ...g.textos]) assert.ok(c.x0 >= M - 1e-9 && c.y0 >= M - 1e-9 && c.x1 <= W - M + 1e-9 && c.y1 <= g.H - M + 1e-9, `se sale «${c.txt || c.que}»`);
    for (let i = 0; i < g.textos.length; i++) for (let j = i + 1; j < g.textos.length; j++) assert.ok(!solapan(g.textos[i], g.textos[j]), `se pisan «${g.textos[i].txt}» y «${g.textos[j].txt}»`);
    for (const t of g.textos) for (const o of g.objetos) assert.ok(!solapan(t, o), `«${t.txt}» pisa ${o.que}`);
  }
});

// ---------- Cierre (20 nov): auditoría y lectores en frío (rutinas/auditoria/aritmetica.numeros-racionales.md) ----------
// Cada prueba falla con la versión de antes de las correcciones.
const opcion = (c, err) => c.opciones.find(o => o.error === err);

test('cierre M1: «cortar» un periódico en dos cifras da su valor de verdad (0,666… × 1,5 → 0,66 × 1,5)', () => {
  const I = idea('generatriz');
  for (let s = 5; s < 6 * SEMILLAS; s += 6) {
    const c = I.ahoraTu.generar(s), p = planoN(c.pregunta);
    const m = p.match(/es (\d+),(\d+)… × (\d+),(\d+)\?/); assert.ok(m, p);
    const corte = Q(+(m[2] + m[2] + m[2]).slice(0, 2), 100), y = Q(+(m[3] + m[4]), 10 ** m[4].length);
    const o = opcion(c, 'AT-CORTAR');
    if (o) assert.equal(o.texto, fq(por(corte, y)), `${p}: «cortar» da ${o.texto}`);
  }
});

test('cierre M2: la trampa «cuesta menos en total» cuesta menos en total (teoría y práctica)', () => {
  const I = idea('orden-recta');
  for (let s = 5; s < 6 * SEMILLAS; s += 6) {
    const c = I.ahoraTu.generar(s), m = planoN(c.pregunta).match(/de (\d+) kg cuesta S\/ (\d+) y otra de (\d+) kg cuesta S\/ (\d+)/);
    const t = opcion(c, 'AT-TOTAL'); if (!t) continue;
    const [k1, P1, k2, P2] = m.slice(1).map(Number), suyo = t.texto.includes(`${k1} kg`) ? P1 : P2, otro = suyo === P1 ? P2 : P1;
    assert.ok(suyo < otro, `${planoN(c.pregunta)}: la trampa no cuesta menos`);
  }
});

test('cierre M3: en «¿cuál es aparente / propia?» la correcta no cae siempre en el mismo lugar de la lista', () => {
  const I = idea('orden-recta'), lugares = new Set();
  for (let s = 2; s < 6 * SEMILLAS; s += 6) {
    const c = I.ahoraTu.generar(s), p = planoN(c.pregunta), lista = p.replace(/^.*: /, '').replace(/\?$/, '').split(', ');
    lugares.add(lista.indexOf(c.opciones.find(o => o.correcta).texto));
  }
  assert.ok(lugares.size >= 3, `la correcta cae solo en ${[...lugares]}`);
});

test('cierre M4: la trampa D de «El lugar 100» (3/7) es de verdad la cifra de un lugar menos, el 99', () => {
  const e = idea('exacto-periodico').ejemplos.find(x => x.titulo === 'El lugar 100');
  const cifra = n => { let r = 3; let c = 0; for (let k = 0; k < n; k++) { c = Math.floor(r * 10 / 7); r = r * 10 % 7; } return String(c); };
  assert.equal(e.alternativas[3], cifra(99));
  assert.equal(e.alternativas[1], cifra(101));
  assert.equal(e.alternativas[4], cifra(100));
});

test('cierre M5: todo decimal con «…» se escribe exactamente como la división (ni 0,0016666… ni 0,16666…)', () => {
  for (const I of def.ideas) for (const [t, donde] of textosDe(I, 60)) {
    if (/cada vez|ningún bloque|1,010010001…|≈/.test(t)) continue;
    for (const m of t.matchAll(/(\d+),(\d+)…(?!₍)/g)) if (m[0] !== '0,999…') assert.ok(desdeDecimal(m[0]), `${I.id} ${donde}: «${m[0]}» no se escribe como la división`);
  }
});

test('cierre A1: la regla de «del-resto» dice de dónde sale el 1/6 y no da 1/2 + 1/3 = 5/6 como lo vendido', () => {
  const R = idea('del-resto').regla, ec = planoN(R.ecuacion);
  assert.match(ec, /1\/3 × 1\/2 = 1\/6/);
  assert.match(ec, /2\/3 × 1\/2 = 1\/3/);
  assert.ok(!/[ab]\/[bd]|c\/d/.test(ec), `letras sin decir en la regla: ${ec}`);
  assert.ok(!/es 5\/6/.test(R.condicion), R.condicion);
});

test('cierre M6: «Ahora tú» de «del-resto» practica siempre una parte de lo que queda (no una suma sola)', () => {
  const I = idea('del-resto');
  for (let s = 0; s < 6 * SEMILLAS; s += 6) assert.match(planoN(I.ahoraTu.generar(s).pregunta), /de lo que quedó|de lo que le quedaba|de los que le quedaban/);
});

test('cierre M7: el dibujo de Predice de «orden-recta» y las figuras que comparan dos queques no pintan lo vendido', () => {
  const sinMarcas = d => d.bandejas.every(b => !b.marcas || b.marcas.length === 0);
  assert.ok(sinMarcas(idea('orden-recta').predice.dibujo.datos), 'Predice pinta lo vendido: a escala se ve cuál es más');
  for (const [i, t] of [['equivalentes', 'Dos queques iguales'], ['orden-recta', 'Mismo denominador'], ['orden-recta', 'Más de un queque']]) {
    const e = idea(i).ejemplos.find(x => x.titulo === t); assert.ok(sinMarcas(e.figura.datos), `${i} «${t}»`);
  }
});

test('cierre (lectores): Datos que no mienten ni empujan a una trampa; misión y nombres de «orden-recta»', () => {
  const ej = (i, t) => idea(i).ejemplos.find(x => x.titulo === t);
  assert.ok(ej('del-resto', 'Restar').datos.some(d => /se restan/.test(d)), 'Restar: los Datos solo dicen «se suman»');
  assert.ok(!ej('orden-recta', 'Ordenar tres').datos.some(d => /de los dos/.test(d)), 'Ordenar tres: «el MCM de los dos»');
  assert.ok(ej('del-resto', 'Pierde dos veces y gana').datos.some(d => /perder/.test(d)), 'Pierde: los Datos hablan solo de vender');
  const P = idea('generatriz').predice, malas = P.opciones.filter(o => !o.correcta).map(o => o.texto);
  const esc = t => t.replace(/[/]/g, '\\/');
  for (const d of P.datos) for (const t of malas) assert.ok(!new RegExp(`(?<![\\d,/])${esc(t)}(?![\\d,/])`).test(d), `Predice de generatriz: los Datos traen la trampa ${t}`);
  const O = idea('orden-recta');
  assert.ok(!/pasarlo|deja 3\/4/.test(O.juega.mision.texto), O.juega.mision.texto);
  const svg = PZ('arit-queque').dibujar(O.lee.tarjetas[0].dibujo.datos, {});
  assert.ok(/Arriba/.test(svg) && !/Mañana/.test(svg), 'Lee y Juega nombran distinto las bandejas');
  assert.match(planoN(O.regla.ecuacion), /8\/4 = 2/);
});

test('cierre (lectores): la tabla de bases dice la base; generatriz despeja x; la regla de bases termina en su fracción', () => {
  const B = idea('otras-bases');
  for (const v of [{ n: 3, B: 6 }, { n: 5, B: 10 }]) assert.match(B.juega.dibujo(v).datos.columnas.map(c => c.t).join(' '), new RegExp(`base ${v.B}`));
  assert.match(B.predice.dibujo.datos.columnas.map(c => c.t).join(' '), /base 10/);
  assert.match(planoN(B.regla.ecuacion), /= 5\/12/);
  const G = idea('generatriz');
  assert.match(planoN(G.juega.lectura({ x: '0,333…', m: 10 })), /x = 3\/9 = 1\/3/);
  assert.ok(planoN(idea('del-resto').mira.pasos[0].ecuacion).length && idea('del-resto').mira.pasos[0].ecuacion.some(p => p && p.frac && p.frac[0].v === 'c-f'), 'Mira: lo que queda en el color de lo vendido');
});

test('cierre M8: ningún caso del juego de «del-resto» deja lo mismo que la Predice (1/3 del queque)', () => {
  const I = idea('del-resto');
  for (const v of grilla(I.juega.controles)) assert.ok(!/: 1\/3 del queque/.test(planoN(I.juega.lectura(v))), `${JSON.stringify(v)}: ${planoN(I.juega.lectura(v))}`);
});
