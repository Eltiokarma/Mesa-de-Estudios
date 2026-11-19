// Pruebas propias de «Números primos y divisores» (además del validador común de contenido/teoria/teoria.test.js).
// Etapa 6 (19 nov): las seis ideas pasan por el contrato, con la propuesta docs/etapa6/propuesta-aritmetica.md como guion.
//   - seis ideas con los id de antes, en el orden de la propuesta; con calidad 2 desde el 19 nov (lector en frío y auditor);
//   - un color fijo por magnitud (docs/molde-unidad.md §5b; propuesta §7): cada ficha de color dice su magnitud (m) y
//     lleva el color de def.colores; nunca verde ni carmín, tampoco en las figuras de las ideas; letras de alternativa en
//     negrita y sin color;
//   - cada misión se cumple con un solo caso de la grilla y no al abrir; su «bien» no dice la respuesta de la predicción;
//   - Predice: un código de error por opción, datos sin fórmulas, y nada de lo que se lee antes trae su cuenta;
//   - «Ahora tú» trae cuatro opciones distintas en 400 semillas, con datos, y su respuesta cuadra con una cuenta aparte
//     (fuerza bruta, sin el código de la unidad); ningún distractor es también correcto; «Así se resuelve» cuadra;
//   - toda igualdad numérica escrita (resueltos, siFuera, lecturas, Mira, reglas, ejemplos, glosario) es cierta en 400
//     semillas (auditoría de Divisibilidad, A1);
//   - 15 ejemplos por idea que suben de nivel, con datos; los de nivel 3, con cinco alternativas y una sola que cuadra;
//   - notación: × y nunca «·» (salvo el separador de dos relaciones de una regla).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../../../nucleo/kit/kit.js');
const Glosario = require('../../../nucleo/glosario.js');
const E = require('../../../nucleo/ecuacion.js');
const def = require('./numeros-primos-y-divisores.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const PZ = id => Kit.piezas[id];
const ID = ['rectangulos', 'criba', 'factorizacion', 'divisores', 'euler', 'fermat-wilson'];
const SEMILLAS = 400;
const idea = id => def.ideas.find(i => i.id === id);

const fichas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(fichas)
  : typeof x.v === 'string' && /^c-/.test(x.v) ? [x] : Object.values(x).flatMap(fichas));
const negritas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(negritas)
  : x.negrita ? [x] : Object.values(x).flatMap(negritas));
const plano = x => E.texto(x === undefined || x === null ? '' : Array.isArray(x) ? x : [x]);
// Texto con las potencias como «2^3» (E.texto las lee «2 al cubo»): lo usa el comprobador de igualdades.
const cuenta = x => (x === null || x === undefined ? '' : typeof x === 'string' || typeof x === 'number' ? String(x) : Array.isArray(x) ? x.map(cuenta).join('')
  : x.sup ? `${cuenta(x.sup[0])}^(${cuenta(x.sup[1])})` : x.raiz ? `√(${cuenta(x.raiz)})` : x.mult ? `múltiplo de ${cuenta(x.mult)}` : x.frac ? `(${cuenta(x.frac[0])})/(${cuenta(x.frac[1])})`
    : x.llave ? cuenta(x.llave) : x.negrita ? cuenta(x.negrita) : x.par ? `(${cuenta(x.par)})` : x.t !== undefined ? String(x.t) : '');
const svgDe = (dib, pz) => PZ((dib && dib.pieza) || pz).dibujar(dib.datos, dib.estado || {});

// ---------- Cuentas aparte (fuerza bruta: no usan la unidad) ----------
const DIV = n => { const o = []; for (let k = 1; k * k <= n; k++) if (n % k === 0) { o.push(k); if (k * k !== n) o.push(n / k); } return o.sort((a, b) => a - b); };
const PRIMO = n => DIV(n).length === 2;
const FORMAS = n => DIV(n).filter(a => a * a <= n).length;
const GCD = (a, b) => (b ? GCD(b, a % b) : a);
const PHI = n => { let c = 0; for (let k = 1; k <= n; k++) if (GCD(k, n) === 1) c++; return c; };
const POT = (b, e, m) => Number((BigInt(b) ** BigInt(e)) % BigInt(m));
const SUPS = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };

// Toda igualdad entre cuentas de enteros escrita en un texto es cierta: «24 = 1 × 24 = 2 × 12», «2⁴ × 3 = 48».
function igualdadesFalsas(t) {
  // Tramos hechos solo de cifras, paréntesis, potencias, + − × ÷ y =; un tramo que empieza con un signo es el final de una
  // cuenta con letras o con «…» (no se evalúa).
  const s = String(t).replace(/(\d)[\u00a0\u202f\u2009 ](?=\d{3}\b)/g, '$1').replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, m => `^${[...m].map(c => SUPS[c]).join('')}`);
  const malas = [];
  for (const m of s.matchAll(/[\d()^×+−÷= ]+/g)) {
    const tramo = m[0].trim();
    if (!tramo.includes('=') || /^[×+−÷=^)]/.test(tramo) || /[×+−÷=^(]$/.test(tramo)) continue;
    const antes = s.slice(0, m.index).replace(/\s+$/, '').slice(-1), pegado = s[m.index + m[0].length - m[0].trimStart().length - 1] || '';
    if (/[.,/√]/.test(pegado)) continue;
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
  assert.deepEqual(igualdadesFalsas('24 = 1 × 24 = 2 × 12 = 3 × 8 = 4 × 6: 8 divisores'), []);
  assert.deepEqual(igualdadesFalsas('2⁴ × 3 = 48 y 119 = 7 × 17'), []);
  assert.deepEqual(igualdadesFalsas('35 = 5 × 6'), ['35 = 5 × 6']);
  assert.deepEqual(igualdadesFalsas('12 − 1 − 5 = 7'), ['12 − 1 − 5 = 7']);
});

// Todo lo que se lee en una idea, con «Ahora tú» y «Así se resuelve» en muchas semillas.
function textosDe(I, n = SEMILLAS) {
  const out = [];
  const push = (x, donde) => out.push([cuenta(x), donde]);
  (I.lee ? I.lee.tarjetas : []).forEach((t, i) => { push(t.texto, `lee ${i}`); if (t.ecuacion) push(t.ecuacion, `lee ${i}`); });
  if (I.juega) {
    const cs = I.juega.controles, grilla = [{}];
    for (const c of cs) { const vs = c.opciones ? c.opciones.map(o => o.valor) : Array.from({ length: Math.round((c.max - c.min) / c.paso) + 1 }, (_, k) => c.min + k * c.paso); const nueva = []; for (const g of grilla) for (const v of vs) nueva.push(Object.assign({}, g, { [c.id]: v })); grilla.splice(0, grilla.length, ...nueva); }
    for (const v of grilla) push(I.juega.lectura(v), `lectura ${JSON.stringify(v)}`);
    push(I.juega.mision.bien, 'bien');
  }
  if (I.predice) I.predice.opciones.forEach(o => o.siFuera && push(o.siFuera, `siFuera ${o.id}`));
  if (I.mira) I.mira.pasos.forEach((p, i) => { push(p.texto, `mira ${i}`); if (p.ecuacion) push(p.ecuacion, `mira ${i}`); });
  if (I.regla) { push(I.regla.texto, 'regla'); push(I.regla.ecuacion, 'regla'); push(I.regla.condicion, 'condición'); }
  (I.ejemplos || []).forEach((e, i) => { push(e.enunciado, `ejemplo ${i + 1}`); e.solucion.forEach(p => { push(p.texto, `ejemplo ${i + 1}`); if (p.ecuacion) push(p.ecuacion, `ejemplo ${i + 1}`); }); push(e.respuesta, `ejemplo ${i + 1}`); (e.datos || []).forEach(d => push(d, `ejemplo ${i + 1} datos`)); });
  for (let s = 0; s < n; s++) {
    const a = I.ahoraTu.generar(s);
    push(a.pregunta, `ahora ${s}`); push(a.solucion.texto, `ahora ${s}`); push(a.solucion.ecuacion, `ahora ${s}`);
    a.opciones.forEach(o => o.siFuera && push(o.siFuera, `ahora ${s} ${o.id}`));
    if (s < 100 && I.resuelve) { const r = I.resuelve.generar(s); push(r.enunciado, `resuelve ${s}`); r.pasos.forEach(p => { push(p.texto, `resuelve ${s}`); if (p.ecuacion) push(p.ecuacion, `resuelve ${s}`); }); push(r.respuesta, `resuelve ${s}`); }
  }
  return out;
}

test('seis ideas en el orden de la propuesta, con sus id; la tabla de letras y los colores', () => {
  const hechas = def.ideas.map(i => i.id);
  assert.deepEqual(hechas, ID.slice(0, hechas.length), 'los id y el orden de la propuesta');
  assert.equal(def.septimaIdea, undefined);
  assert.equal(def.calidad, 2, 'cerrada el 19 nov tras el lector en frío y el auditor');
  assert.deepEqual(def.colores, { envase: 'i', sobra: 'o', busca: 'f' });
  for (const l of ['N', 'd', 'k', 'p', 'q', 'α', 'β', 'φ', 'a']) assert.ok(def.letras[l], `tabla de letras: ${l}`);
});

test('colores: cada ficha dice su magnitud y lleva su color; sin verde ni carmín en las ideas; letras de alternativa sin color', () => {
  for (const I of def.ideas) {
    const todo = [I.lee, I.juega.leyenda, I.juega.mision, I.predice, I.mira, I.regla, I.ejemplos];
    for (let s = 0; s < 60; s++) { todo.push(I.ahoraTu.generar(s)); if (s < 12) todo.push(I.resuelve.generar(s)); }
    const cs = I.juega.controles;
    for (let k = 0; k < 6; k++) todo.push(I.juega.lectura(Object.fromEntries(cs.map(c => [c.id, c.opciones ? c.opciones[k % c.opciones.length].valor : Math.min(c.max, c.min + k * c.paso)]))));
    const fs = fichas(todo);
    assert.ok(fs.length > 60, `${I.id}: fichas ${fs.length}`);
    for (const x of fs) {
      assert.ok(x.m && def.colores[x.m], `${I.id}: ficha sin magnitud: ${JSON.stringify(x)}`);
      assert.equal(x.v, `c-${def.colores[x.m]}`, `${I.id}: ${JSON.stringify(x)}`);
    }
    // Controles: sin carmín ni verde.
    for (const c of cs) assert.ok(!c.color || /^c-[iof]$/.test(c.color), `${I.id}: control ${c.id} en ${c.color}`);
    // Figuras de la idea: ni carmín ni verde.
    const svgs = [];
    for (const t of (I.lee ? I.lee.tarjetas : [])) if (t.dibujo) svgs.push(svgDe({ pieza: t.pieza || I.pieza, datos: t.dibujo.datos, estado: t.dibujo.estado }, I.pieza));
    svgs.push(svgDe(I.juega.dibujo(Object.fromEntries(cs.map(c => [c.id, c.inicio !== undefined ? c.inicio : c.opciones[0].valor]))), I.juega.pieza || I.pieza));
    svgs.push(svgDe(I.predice.dibujo, I.predice.pieza || I.pieza), svgDe(I.predice.revelar, I.predice.pieza || I.pieza));
    I.mira.pasos.forEach(p => svgs.push(PZ(I.mira.pieza || I.pieza).dibujar(I.mira.datos, p.estado)));
    if (I.regla.dibujo) svgs.push(svgDe(I.regla.dibujo, I.pieza));
    I.ejemplos.forEach(e => { if (e.figura) svgs.push(svgDe(e.figura, I.pieza)); });
    for (const s of svgs) assert.ok(!/var\(--c-[hd]\)/.test(s), `${I.id}: una figura usa carmín o verde`);
    // Las letras de alternativa: en negrita, una sola letra A–E, sin ficha de color adentro.
    for (const n of negritas(I.ejemplos)) { assert.match(plano(n.negrita), /^[A-E]$/); assert.equal(fichas(n).length, 0); }
  }
});

test('misiones: una sola manera en la grilla, no cumplidas al abrir; su «bien» no dice la respuesta de la predicción', () => {
  for (const I of def.ideas) {
    const cs = I.juega.controles, grilla = [{}];
    for (const c of cs) { const vs = c.opciones ? c.opciones.map(o => o.valor) : Array.from({ length: Math.round((c.max - c.min) / c.paso) + 1 }, (_, k) => c.min + k * c.paso); const nueva = []; for (const g of grilla) for (const v of vs) nueva.push(Object.assign({}, g, { [c.id]: v })); grilla.splice(0, grilla.length, ...nueva); }
    const cumplen = grilla.filter(v => I.juega.mision.logrado(v) === true);
    // Una sola manera: los controles que la misión mira quedan fijos; uno que no mira (el primer corte de la idea 3)
    // puede tomar cualquier valor.
    const libres = cs.filter(c => new Set(cumplen.map(v => v[c.id])).size > 1);
    const maneras = libres.reduce((k, c) => k * (c.opciones ? c.opciones.length : Math.round((c.max - c.min) / c.paso) + 1), 1);
    assert.ok(cumplen.length >= 1 && cumplen.length === maneras && libres.length < cs.length, `${I.id}: la misión se cumple de ${cumplen.length} maneras`);
    const inicio = Object.fromEntries(cs.map(c => [c.id, c.inicio !== undefined ? c.inicio : c.opciones[0].valor]));
    assert.equal(I.juega.mision.logrado(inicio), false, `${I.id}: cumplida al abrir`);
    const correcta = I.predice.opciones.find(o => o.correcta).texto;
    if (/\d{2,}/.test(correcta)) assert.ok(!new RegExp(`(?<!\\d)${correcta}(?!\\d)`).test(I.juega.mision.bien + I.juega.mision.texto + plano(I.juega.consigna)), `${I.id}: el juego dice ${correcta}`);
  }
  // Aparte: de 20 a 28 solo el 23 es primo.
  assert.deepEqual([20, 21, 22, 23, 24, 25, 26, 27, 28].filter(PRIMO), [23]);
});

test('Predice: un código distinto por opción, una sola correcta, datos sin fórmulas; lo de antes no trae su cuenta', () => {
  for (const I of def.ideas) {
    const ops = I.predice.opciones;
    assert.equal(ops.filter(o => o.correcta).length, 1);
    const codigos = ops.filter(o => !o.correcta).map(o => o.error);
    assert.equal(new Set(codigos).size, codigos.length, `${I.id}: códigos repetidos ${codigos}`);
    for (const d of I.predice.datos || []) assert.ok(!/[=×÷+−]|\bfórmula/.test(plano(d)) || /^[^=]*\d+ = \d+ × \d+/.test(plano(d)) || /=\s*\d/.test(plano(d)), `${I.id}: dato con forma de fórmula: ${plano(d)}`);
    // Nada de lo que se lee antes (Lee, consigna, misión, leyenda) dice la cuenta de la respuesta de dos cifras o más.
    const antes = [plano(I.juega.consigna), I.juega.mision.texto, I.juega.mision.bien, ...I.juega.leyenda.map(l => plano(l.s) + ' ' + plano(l.t)), ...(I.lee ? I.lee.tarjetas.map(t => plano(t.texto) + ' ' + plano(t.ecuacion || '')) : [])].join(' | ');
    const correcta = ops.find(o => o.correcta).texto;
    if (/\d{2,}/.test(correcta)) assert.ok(!new RegExp(`(?<!\\d)${correcta}(?!\\d)`).test(antes), `${I.id}: lo de antes dice ${correcta}`);
  }
  // Idea 1, aparte: de 1, 2, 33, 35 y 37 son primos el 2 y el 37; cada distractor rehecho.
  const xs = [1, 2, 33, 35, 37], P1 = idea('rectangulos').predice.opciones;
  assert.equal(xs.filter(PRIMO).length, 2);
  assert.equal(P1.find(o => o.error === 'AT-PRIMO-UNO').texto, String(xs.filter(PRIMO).length + 1));
  assert.equal(P1.find(o => o.error === 'AT-PRIMO-PAR').texto, String(xs.filter(x => PRIMO(x) && x % 2).length));
  assert.equal(P1.find(o => o.error === 'AT-PRIMO-IMPAR').texto, String(xs.filter(x => x % 2).length));
  // La figura de Predice no marca a nadie; la de revelar marca justo los primos.
  const g0 = PZ('arit-boletos').geometria(idea('rectangulos').predice.dibujo.datos), g1 = PZ('arit-boletos').geometria(idea('rectangulos').predice.revelar.datos);
  assert.equal(g0.celdas.filter(c => c.queda || c.tacha || c.usado).length, 0);
  assert.deepEqual(g1.celdas.filter(c => c.queda).map(c => c.num), xs.filter(PRIMO));
});

// ---------- Recálculo de «Ahora tú» por idea (fuerza bruta a partir del texto de la pregunta) ----------
const numeros = t => (String(t).match(/\d+/g) || []).map(Number);
const RECALCULO = {
  rectangulos(q) {
    if (/cuál de estos boletos/i.test(q.p)) { const ps = q.ops.filter(o => PRIMO(+o)); assert.equal(ps.length, 1, q.p); return ps[0]; }
    if (/quedan los boletos/.test(q.p)) { const xs = numeros(q.p.split('boletos')[1].split('.')[0]); return String(xs.filter(PRIMO).length); }
    if (/^¿Cuántos divisores tiene/.test(q.p)) return String(DIV(numeros(q.p)[0]).length);
    if (/formas distintas/.test(q.p)) return String(FORMAS(numeros(q.p)[0]));
    if (/Dos números primos suman/.test(q.p)) { const S = numeros(q.p)[0], sol = []; for (let a = 2; a <= S / 2; a++) if (PRIMO(a) && PRIMO(S - a)) sol.push(a * (S - a)); assert.equal(sol.length, 1, q.p); return String(sol[0]); }
    if (/cajas iguales/.test(q.p)) { const [N, a, b] = numeros(q.p); const ds = DIV(N).filter(x => x > a && x < b); assert.equal(ds.length, 1, q.p); return String(ds[0]); }
    throw new Error(`sin recálculo: ${q.p}`);
  },
  factorizacion(q) {
    const N = numeros(q.p).pop(), F = n => { const o = []; for (let p = 2; n > 1; p++) { let e = 0; while (n % p === 0) { n /= p; e++; } if (e) o.push([p, e]); } return o; };
    const txt = fs => fs.map(([p, e]) => (e > 1 ? p + [...String(e)].map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]).join('') : String(p))).join(' × ');
    if (/descomposición canónica de \d+\?/.test(q.p)) return txt(F(N));
    if (/Cuántas veces entra el 2/.test(q.p)) return String((F(N).find(f => f[0] === 2) || [2, 0])[1]);
    if (/pares es PESI/.test(q.p)) { const ok = q.ops.filter(o => /^\d+ y \d+$/.test(o) && GCD(...numeros(o)) === 1); assert.equal(ok.length, 1, q.ops.join(' | ')); return ok[0]; }
    if (/exponente de/.test(q.p)) { const [P, A, x, B, y] = numeros(q.p).slice(0, 5); const e = (n, p) => { let k = 0; while (n % p === 0) { n /= p; k++; } return k; }; return String(e(A, P) * x + e(B, P) * y); }
    throw new Error(`sin recálculo: ${q.p}`);
  },
  divisores(q) {
    const ns = numeros(q.p), N = /N = /.test(q.p) && !/\^\(α\)/.test(q.p) ? ns.reduce((x, n, i, a) => x, 0) : 0;
    const desdeCanon = t => { const m = t.match(/N = ([^.?]*)/)[1].replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, z => '^' + [...z].map(c => SUPS[c]).join('')); return m.split('×').map(f => f.trim()).reduce((x, f) => { const [b, e] = f.split('^').map(z => Number(z.replace(/[()]/g, ''))); return x * b ** (e || 1); }, 1); };
    if (/^¿Cuántos divisores tiene N = /.test(q.p)) return String(DIV(desdeCanon(q.p)).length);
    if (/Cuánto suman todos los divisores de/.test(q.p)) return String(DIV(ns[0]).reduce((x, y) => x + y, 0));
    if (/divisores impares tiene N/.test(q.p)) return String(DIV(desdeCanon(q.p)).filter(x => x % 2).length);
    if (/son múltiplos de/.test(q.p)) { const k = ns[ns.length - 1]; return String(DIV(desdeCanon(q.p)).filter(x => x % k === 0).length); }
    if (/tiene \d+ divisores\. ¿Cuánto vale N/.test(q.p)) { const b = ns[2], T = ns[3], sol = []; for (let a = 0; a < 15; a++) if (DIV(2 ** a * 3 ** b).length === T) sol.push(2 ** a * 3 ** b); assert.equal(sol.length, 1, q.p); return String(sol[0]); }
    if (/divisores compuestos/.test(q.p)) return String(DIV(desdeCanon(q.p)).filter(x => x > 1 && !PRIMO(x)).length);
    throw new Error(`sin recálculo: ${q.p}`);
  },
  euler(q) {
    const ns = numeros(q.p);
    if (/son PESI con/.test(q.p)) return String(PHI(ns[1]));
    if (/Cuánto vale φ/.test(q.p)) return String(PHI(ns[0]));
    if (/fracciones propias irreductibles/.test(q.p)) { const N = ns[0]; let c = 0; for (let k = 1; k < N; k++) if (GCD(k, N) === 1) c++; return String(c); }
    if (/mayores que 1\/2/.test(q.p)) { const N = ns[0]; let c = 0; for (let k = 1; k < N; k++) if (2 * k > N && GCD(k, N) === 1) c++; return String(c); }
    throw new Error(`sin recálculo: ${q.p}`);
  },
  'fermat-wilson'(q) {
    const ns = numeros(q.p);
    if (/^¿Qué resto deja 1 × 2 × 3 × … × \d+ \+ \d+/.test(q.p)) { const [, , , m, c, p] = ns; let x = 1; for (let k = 1; k <= m; k++) x = (x * k) % p; return String((x + c) % p); }
    if (/^¿Qué resto deja 1 × 2 × 3 × …/.test(q.p)) { const [, , , m, p] = ns; let x = 1; for (let k = 1; k <= m; k++) x = (x * k) % p; return String(x); }
    if (/^¿Qué resto deja \d+\^\(\d+\)/.test(q.p)) { const [a, n, p] = ns; return String(POT(a, n, p)); }
    throw new Error(`sin recálculo: ${q.p}`);
  },
  criba(q) {
    const N = numeros(q.p)[0];
    if (/el mayor primo con el que hay que probar/.test(q.p)) { let m = 0; for (let p = 2; p * p <= N; p++) if (PRIMO(p)) m = p; return String(m); }
    if (/el menor primo que divide/.test(q.p)) { for (let p = 2; p <= N; p++) if (N % p === 0) return String(p); }
    if (/Cuántos números primos hay entre/.test(q.p)) { const [a, b] = numeros(q.p); let c = 0; for (let x = a + 1; x < b; x++) if (PRIMO(x)) c++; return String(c); }
    if (/progresión aritmética/.test(q.p)) {
      const n = { Tres: 3, Cuatro: 4, Cinco: 5 }[q.p.split(' ')[0]], [B, d] = numeros(q.p), sol = [];
      for (let p = 2; p < B; p++) { const t = Array.from({ length: n }, (_, i) => p + i * d); if (t[n - 1] < B && t.every(PRIMO)) sol.push(t[n - 1]); }
      assert.equal(sol.length, 1, q.p); return String(sol[0]);
    }
    throw new Error(`sin recálculo: ${q.p}`);
  },
};
test('«Ahora tú»: 400 semillas por idea con cuatro opciones distintas, datos, y la correcta cuadra con una cuenta aparte', () => {
  for (const I of def.ideas) {
    const rec = RECALCULO[I.id];
    assert.ok(rec, `${I.id}: falta su recálculo`);
    const vistas = new Set();
    for (let s = 0; s < SEMILLAS; s++) {
      const a = I.ahoraTu.generar(s), ops = a.opciones;
      assert.equal(ops.length, 4, `${I.id} ${s}`);
      assert.equal(new Set(ops.map(o => o.texto)).size, 4, `${I.id} ${s}: opciones repetidas`);
      assert.equal(ops.filter(o => o.correcta).length, 1);
      assert.ok(Array.isArray(a.datos) && a.datos.length, `${I.id} ${s}: sin datos`);
      const p = cuenta(a.pregunta), c = ops.find(o => o.correcta).texto;
      assert.equal(String(rec({ p, ops: ops.map(o => o.texto) })), c, `${I.id} ${s}: ${p}`);
      for (const o of ops.filter(x => !x.correcta)) assert.ok(o.error && o.siFuera, `${I.id} ${s}: ${o.texto} sin error o siFuera`);
      vistas.add(p);
    }
    assert.ok(vistas.size > 40, `${I.id}: pocas preguntas distintas (${vistas.size})`);
  }
});

test('toda igualdad numérica escrita en la unidad es cierta (400 semillas de «Ahora tú», 100 de «Así se resuelve»)', () => {
  const malas = [];
  for (const I of def.ideas) for (const [t, donde] of textosDe(I)) for (const m of igualdadesFalsas(t)) malas.push(`${I.id} ${donde}: «${m}» en «${t}»`);
  for (const g of def.glosario) for (const e of g.ejemplos || []) for (const m of igualdadesFalsas(e)) malas.push(`glosario ${g.termino}: «${m}»`);
  for (const mesa of def.laboratorio) for (const inv of mesa.invitaciones || []) for (const m of igualdadesFalsas(inv.bien || '')) malas.push(`mesa ${mesa.id}: «${m}»`);
  assert.deepEqual(malas.slice(0, 20), []);
});

test('ejemplos: 15 por idea, 5 por nivel, con datos; nivel 3 con cinco alternativas y la letra en la que cuadra', () => {
  const LETRAS = 'ABCDE';
  for (const I of def.ideas) {
    const ej = I.ejemplos;
    assert.equal(ej.length, 15, I.id);
    for (const n of [1, 2, 3]) assert.equal(ej.filter(e => e.nivel === n).length, 5, `${I.id} nivel ${n}`);
    for (const e of ej) {
      assert.ok(Array.isArray(e.datos) && e.datos.length, `${I.id} «${e.titulo}»: sin datos`);
      assert.ok(fichas(e.respuesta).length, `${I.id} «${e.titulo}»: la respuesta sin color`);
      if (e.nivel === 3) {
        assert.equal(e.alternativas.length, 5, `${I.id} «${e.titulo}»`);
        assert.equal(new Set(e.alternativas).size, 5);
        const L = plano(negritas(e.respuesta)[0].negrita), val = plano(fichas(e.respuesta)[0].t);
        assert.equal(e.alternativas[LETRAS.indexOf(L)], val, `${I.id} «${e.titulo}»: la letra ${L} no es la de ${val}`);
        // Cada alternativa incorrecta se nombra en el resuelto.
        const r = negritas(e.solucion).map(n => plano(n.negrita));
        for (const l of LETRAS) if (l !== L) assert.ok(r.includes(l), `${I.id} «${e.titulo}»: no explica ${l}`);
      }
    }
  }
  // Idea 1, aparte: las respuestas de los ejemplos.
  const R1 = { 'Las formas de 10': FORMAS(10), 'Los divisores de 15': DIV(15).join(), 'Todos los divisores de 28': DIV(28).length, 'Primos entre 20 y 30': [21, 22, 23, 24, 25, 26, 27, 28, 29].filter(PRIMO).length,
    'La caja de huevos': FORMAS(30) - 1, 'Los compuestos hasta 12': [4, 5, 6, 7, 8, 9, 10, 11, 12].filter(x => !PRIMO(x)).length + 0 * PRIMO(2), 'Las formas de 64': FORMAS(64), 'Divisores en cantidad impar': [12, 18, 25, 30, 50].find(x => DIV(x).length % 2) };
  const I1 = idea('rectangulos');
  for (const [t, v] of Object.entries(R1)) {
    const e = I1.ejemplos.find(x => x.titulo === t);
    assert.ok(e, t);
    const r = plano(e.respuesta);
    assert.ok(String(v).split(',').every(x => r.includes(x)), `${t}: ${r} contra ${v}`);
  }
  assert.ok(plano(I1.ejemplos.find(e => e.titulo === 'Un cuadrado en la bandeja').respuesta).includes(`${FORMAS(25)} formas y ${DIV(25).length} divisores`));
  const dos = []; for (let a = 2; a <= 12; a++) if (PRIMO(a) && PRIMO(25 - a)) dos.push(a * (25 - a));
  assert.deepEqual(dos, [46]);
  const cajas = DIV(119).filter(x => x > 10 && x < 20); assert.deepEqual(cajas, [17]); assert.equal(119 / 17, 7);
  const dosFormas = []; for (let x = 10; x <= 99; x++) if (FORMAS(x) === 2 && x % 3 === 0) dosFormas.push(x);
  assert.equal(Math.max(...dosFormas), 93);
});

test('glosario: cada idea estrena de 2 a 4 palabras, con su simple y tres ejemplos; ninguno trae la respuesta de Predice', () => {
  const porIdea = Glosario.porIdea ? Glosario.porIdea(def) : null;
  for (const g of def.glosario) {
    assert.ok(g.simple && g.simple.split(/\s+/).length <= 14, g.termino);
    assert.ok(Array.isArray(g.ejemplos) && g.ejemplos.length >= 3, g.termino);
  }
  if (porIdea) for (const [i, I] of def.ideas.entries()) {
    const ts = porIdea[i] || [];
    assert.ok(ts.length >= 2 && ts.length <= 4, `${I.id}: ${ts.length} términos`);
  }
  // La predicción de la idea 1: ningún ejemplo del glosario dice qué boletos son primos.
  for (const g of def.glosario) for (const e of g.ejemplos) assert.ok(!/\b(33|35|37)\b/.test(e), `${g.termino}: ${e}`);
});

test('notación: × y nunca «·» (salvo el separador de una regla)', () => {
  for (const I of def.ideas) for (const [t, donde] of textosDe(I, 60)) assert.ok(!/·/.test(t.replace(/ +· +/g, ' | ')), `${I.id} ${donde}: «·» en ${t}`);
});

// ---------- Ideas 2 a 6: las respuestas de los ejemplos y las predicciones, por fuerza bruta (sin la unidad) ----------
const SD = n => DIV(n).reduce((x, y) => x + y, 0);
const primosEn = (a, b) => { const o = []; for (let x = a; x <= b; x++) if (PRIMO(x)) o.push(x); return o; };
const mayorPrimoHasta = N => { let m = 0; for (let p = 2; p * p <= N; p++) if (PRIMO(p)) m = p; return m; };
const ESPERADO = {
  criba: {
    'Probar hasta el 7': mayorPrimoHasta(49), '¿Es 53 primo?': PRIMO(53) ? 'Sí' : 'No', 'Los primos hasta 20': primosEn(1, 20).length, '¿Es 91 primo?': PRIMO(91) ? 'Sí' : 'No',
    'Lo primero que tacha el 7': (() => { for (let x = 8; ; x++) if (x % 7 === 0 && [2, 3, 5].every(p => x % p)) return x; })(),
    '¿Es 221 primo?': PRIMO(221) ? 'Sí' : 'No', '¿Es 199 primo?': PRIMO(199) ? 'Sí' : 'No', 'Primos entre 70 y 90': primosEn(71, 89).length,
    'Lo que deja el 5': (() => { for (let x = 2; x <= 60; x++) if (!PRIMO(x) && [2, 3, 5].every(p => x % p)) return x; })(),
    'Lo que tacha el 7': (() => { let c = 0; for (let x = 2; x <= 100; x++) if (x % 7 === 0 && x !== 7 && [2, 3, 5].every(p => x % p)) c++; return c; })(),
    'Probar hasta 300': mayorPrimoHasta(299),
    'Cinco primos en fila': (() => { const s = []; for (let p = 2; p < 60; p++) { const t = [0, 1, 2, 3, 4].map(i => p + 6 * i); if (t[4] < 60 && t.every(PRIMO)) s.push(t[4]); } assert.equal(s.length, 1); return s[0]; })(),
    'El menor divisor primo': DIV(323)[1], 'Primos que terminan en 7': primosEn(10, 99).filter(x => x % 10 === 7).length,
    'El menor compuesto escondido': (() => { for (let x = 4; ; x++) if (!PRIMO(x) && [2, 3, 5, 7].every(p => x % p)) return x; })(),
  },
  factorizacion: {
    'Los treses de 162': (() => { let n = 162, k = 0; while (n % 3 === 0) { n /= 3; k++; } return k; })(),
    'Los primos de 2310': DIV(2310).filter(PRIMO).length, 'Potencias de compuestos': (() => { let n = 12 ** 3 * 45 ** 2, k = 0; while (n % 3 === 0) { n /= 3; k++; } return k; })(),
    'Los PESI con 12': [5, 9, 14, 25, 35, 49].filter(x => GCD(x, 12) === 1).length,
    'Los mismos primos': (() => { const a = 8 * 5, b = 2 * 25 * 7; for (let m = 1; ; m++) { const pa = DIV(a * m).filter(PRIMO).join(), pb = DIV(b).filter(PRIMO).join(); if (pa === pb) return m; } })(),
    'Los exponentes de N': (() => { for (let a = 0; a < 9; a++) for (let b = 0; b < 9; b++) if (6 * 2 ** a * 3 ** b === 2 ** 5 * 3 ** 3) return a + b; })(),
    'Primos de un producto': DIV(2 ** 7 * 3 ** 5 * 25).filter(PRIMO).length,
  },
  divisores: {
    'Divisores de 2⁴ × 7': DIV(112).length, 'Divisores de 2³ × 5²': DIV(200).length, 'Un primo al cubo': DIV(343).length, 'Divisores propios de 12': DIV(12).length - 1,
    'Divisores de 360': DIV(360).length, 'Suma de los divisores de 12': SD(12), 'Los impares de 360': DIV(360).filter(x => x % 2).length,
    'Múltiplos de 10': DIV(600).filter(x => x % 10 === 0).length, 'El producto de sus divisores': DIV(12).reduce((x, y) => x * y, 1),
    'El exponente que falta': (() => { for (let a = 0; a < 20; a++) if (DIV(2 ** a * 9).length === 21) return a; })(),
    'Divisores compuestos de 60': DIV(60).filter(x => x > 1 && !PRIMO(x)).length, 'El promedio de los divisores': SD(45) / DIV(45).length,
    'Múltiplos de 6': DIV(16 * 27 * 5).filter(x => x % 6 === 0).length, 'Suma de los divisores de 200': SD(200),
  },
  euler: {
    'φ de 10': PHI(10), 'φ de un primo': PHI(13), 'Los PESI con 9': PHI(9), 'φ de 8': PHI(8), 'φ de 21': PHI(21), 'φ de 36': PHI(36), 'φ de 60': PHI(60),
    'Fracciones de denominador 12': PHI(12), 'φ de 49': PHI(49), 'Los que no son PESI': 30 - PHI(30),
    'Mayores que un medio': (() => { let c = 0; for (let k = 16; k < 30; k++) if (GCD(k, 30) === 1) c++; return c; })(),
    'Ni de 3 ni de 5': (() => { let c = 0; for (let x = 1; x <= 150; x++) if (x % 3 && x % 5) c++; return c; })(), 'φ con tres primos': PHI(84), 'Fracciones de denominador 90': PHI(90),
    'Un N con φ dado': (() => { for (let a = 1; a < 9; a++) if (PHI(3 ** a) === 54) return 3 ** a; })(),
  },
  'fermat-wilson': {
    'Fermat con 5': POT(2, 4, 5), 'Fermat con 7': POT(3, 6, 7), 'El producto de 1 a 4': 24 % 5, 'Una base múltiplo': POT(10, 4, 5), 'Un divisor que no es primo': POT(2, 3, 4),
    'Un exponente grande': POT(2, 62, 7), 'Fermat con 11': POT(3, 20, 11), 'Wilson más uno': (() => { let x = 1; for (let k = 1; k <= 12; k++) x = x * k % 13; return (x + 1) % 13; })(),
    'Sin el último factor': 120 % 7, 'Una base mayor que la bolsita': POT(8, 25, 5), 'Una potencia entre 13': POT(2, 100, 13),
    'Wilson más cinco': (() => { let x = 1; for (let k = 1; k <= 16; k++) x = x * k % 17; return (x + 5) % 17; })(), 'Fermat no vale con 15': POT(2, 14, 15),
    'Dos potencias entre 41': (POT(3, 40, 41) + POT(5, 40, 41)) % 41,
    'El día de la semana': ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'][POT(2, 60, 7)],
  },
};
test('ideas 2 a 6: la respuesta de cada ejemplo cuadra con una cuenta aparte', () => {
  for (const [id, tabla] of Object.entries(ESPERADO)) {
    const I = idea(id);
    for (const [t, v] of Object.entries(tabla)) {
      const e = I.ejemplos.find(x => x.titulo === t);
      assert.ok(e, `${id}: no hay ejemplo «${t}»`);
      const r = plano(e.respuesta), val = String(v).replace('.', ',');
      assert.ok(new RegExp(`(^|[^\\d])${val}([^\\d]|$)`).test(r), `${id} «${t}»: ${r} contra ${val}`);
    }
  }
});
test('ideas 2 a 6: cada predicción cuadra, y cada distractor da el valor de su error', () => {
  const op = (id, err) => idea(id).predice.opciones.find(o => (err ? o.error === err : o.correcta)).texto;
  assert.equal(op('criba'), String(mayorPrimoHasta(100)));
  assert.equal(op('criba', 'AT-CRIBA-MISMO'), String(mayorPrimoHasta(30)));
  assert.equal(op('criba', 'AT-CRIBA-PASA'), String(primosEn(mayorPrimoHasta(100) + 1, 100)[0]));
  assert.equal(op('criba', 'AT-CRIBA-MITAD'), String(primosEn(1, 50).pop()));
  assert.equal(op('factorizacion'), '8 y 15');
  for (const o of idea('factorizacion').predice.opciones.filter(x => /^\d+ y \d+$/.test(x.texto))) assert.equal(GCD(...numeros(o.texto)) === 1, !!o.correcta, o.texto);
  const T = 720;
  assert.equal(op('divisores'), String(DIV(T).length));
  assert.equal(op('divisores', 'AT-CD-OLVIDA'), String(DIV(144).length));
  assert.equal(op('divisores', 'AT-CD-SIN-UNO'), String(4 * 2 * 1));
  assert.equal(op('divisores', 'AT-CD-SUMA'), String(5 + 3 + 2));
  assert.equal(SD(720), 2418);
  assert.equal(op('euler'), String(PHI(100)));
  assert.equal(op('euler', 'AT-EULER-DOBLE'), String(100 - 50 - 20));
  assert.equal(op('euler', 'AT-EULER-UN-PRIMO'), String(50));
  assert.equal(op('euler', 'AT-EULER-PRIMOS'), String(primosEn(1, 100).length));
  assert.equal(op('fermat-wilson'), String(POT(2, 100, 101)));
  // Mira de la criba: el 7 tacha nuevos el 49, el 77 y el 91; quedan 25.
  assert.deepEqual([49, 56, 63, 70, 77, 84, 91, 98].filter(x => [2, 3, 5].every(p => x % p)), [49, 77, 91]);
  assert.equal(primosEn(1, 100).length, 25);
  // Las misiones, aparte: 25 es el único compuesto de 1 a 30 sin 2 ni 3; de la lista, solo 60 tiene tres primos; solo 2⁴ × 3
  // tiene 10 divisores con α ≤ 4 y β ≤ 3; φ(15) = 8 es el único 8; con 7, solo la base 3 vuelve a 1 recién el día 6.
  const s30 = []; for (let x = 2; x <= 30; x++) if (!PRIMO(x) && x % 2 && x % 3) s30.push(x); assert.deepEqual(s30, [25]);
  assert.deepEqual([36, 48, 60, 64, 81, 100].filter(n => DIV(n).filter(PRIMO).length === 3), [60]);
  assert.deepEqual([12, 14, 15, 18, 21, 22].filter(n => PHI(n) === 8), [15]);
  assert.deepEqual([2, 3, 4, 6].filter(a => [1, 2, 3, 4, 5].every(e => POT(a, e, 7) !== 1) && POT(a, 6, 7) === 1), [3]);
});
// Letra de la correcta, repartida en toda la unidad (ningún 40 %, ninguna falta) y nivel 3 con cinco alternativas.
test('la letra correcta de los ejemplos de nivel 3 se reparte entre A y E', () => {
  const c = {};
  for (const I of def.ideas) for (const e of I.ejemplos.filter(x => x.nivel === 3)) { const L = plano(negritas(e.respuesta)[0].negrita); c[L] = (c[L] || 0) + 1; }
  const total = Object.values(c).reduce((x, y) => x + y, 0);
  for (const L of 'ABCDE') assert.ok(c[L] >= 4 && c[L] / total <= 0.4, `${L}: ${c[L]} de ${total} (${JSON.stringify(c)})`);
});

// ---------- Auditoría y lector en frío (19 nov, rutinas/auditoria y rutinas/frio de la unidad) ----------
// Cada prueba falla con la versión de antes de las correcciones.
const FACT = n => { const o = []; for (let p = 2; n > 1; p++) { let e = 0; while (n % p === 0) { n /= p; e++; } if (e) o.push([p, e]); } return o; };
test('A1: el siFuera de AT-FACT-EXPONENTE solo dice «más de una vez» de los primos que se repiten', () => {
  for (let s = 0; s < SEMILLAS; s += 4) {
    const c = idea('factorizacion').ahoraTu.generar(s), o = c.opciones.find(x => x.id === 'sinexp');
    if (!o) continue;
    const N = +plano(c.pregunta).match(/de (\d+)\?/)[1], rep = FACT(N).filter(([, e]) => e > 1).map(([p]) => p);
    assert.ok(!/cada uno/.test(o.siFuera), o.siFuera);
    const nombrados = [...o.siFuera.matchAll(/el (\d+)/g)].map(m => +m[1]);
    assert.deepEqual(nombrados, rep, `${N}: ${o.siFuera}`);
  }
});
test('A2: la regla de la idea 1 dice que el cuadrado da un solo divisor, y Lee define primo con dos divisores', () => {
  const I = idea('rectangulos');
  assert.match(I.regla.texto, /la del cuadrado \(6 × 6\), uno solo/);
  assert.match(plano(I.lee.tarjetas[2].texto), /exactamente dos divisores/);
});
test('M1: con un divisor que no es primo, el ciclo de restos mide de 2 a 6 y la solución lo muestra entero', () => {
  for (let s = 1; s < 4 * SEMILLAS; s += 4) {
    const c = idea('fermat-wilson').ahoraTu.generar(s), m = plano(c.pregunta).match(/(\d+)\^?\(?(\d+)?\)? al dividirlo entre (\d+)/);
    const ns = plano(c.pregunta).match(/\d+/g).map(Number), [a, , d] = ns;
    if (PRIMO(d)) continue;
    let k = 1, x = a % d; while (x !== 1 && k < 50) { x = (x * a) % d; k++; }
    assert.ok(k <= 6, `${a} entre ${d}: ciclo de ${k}`);
    void m;
  }
});
test('M2: todo ejercicio de la idea 6 que usa el circulito lo dice en sus Datos, y ninguno lo trae sin usarlo', () => {
  const I = idea('fermat-wilson'), usa = x => JSON.stringify(x).includes('"mult"');
  const tieneMu = c => c.datos.some(d => usa(d));
  const revisa = (c, donde) => assert.equal(tieneMu(c), usa([c.pregunta, c.enunciado, c.opciones, c.solucion, c.pasos, c.respuesta]), donde);
  I.ejemplos.forEach(e => revisa(e, e.titulo));
  for (let s = 0; s < SEMILLAS; s++) { revisa(I.ahoraTu.generar(s), `Ahora tú ${s}`); revisa(I.resuelve.generar(s), `resuelve ${s}`); }
});
test('M3: las fórmulas largas no se parten dentro de un paréntesis (φ con tres primos en dos renglones; reglas sin «)(»)', () => {
  const sep = x => JSON.stringify(x).includes('   ·   ');
  const fracs = x => (JSON.stringify(x).match(/"frac"/g) || []).length;
  for (const I of def.ideas) for (const e of I.ejemplos) for (const p of e.solucion) if (p.ecuacion && fracs(p.ecuacion) >= 3) assert.ok(sep(p.ecuacion), `${e.titulo}: tres fracciones en un renglón`);
  for (let s = 0; s < SEMILLAS; s++) { const c = idea('euler').ahoraTu.generar(s); if (fracs(c.solucion.ecuacion) >= 3) assert.ok(sep(c.solucion.ecuacion), `Ahora tú ${s}`); }
  for (const id of ['divisores', 'euler']) { const t = plano(idea(id).regla.ecuacion); assert.ok(!/\)\(/.test(t), `${id}: «)(» en la regla`); }
  assert.equal(fracs(idea('euler').regla.ecuacion), 0, 'la regla de Euler con fracciones en línea');
  assert.ok(!/ ≤ | o /.test(idea('criba').regla.ecuacion.filter(x => typeof x === 'string').join('|').replace(/≤ /g, '≤ ')), 'espacios partibles en «d ≤ √N o k ≤ √N»');
});
test('M4: los ejemplos de Wilson no traen el resultado en los Datos en el nivel 1, y el nivel 2 pide dos pasos', () => {
  const I = idea('fermat-wilson'), n1 = I.ejemplos.find(e => e.nivel === 1 && /1 × 2 × 3 × 4/.test(plano(e.enunciado)));
  assert.ok(n1 && !n1.datos.some(d => /Wilson/.test(plano(d))), 'el nivel 1 de Wilson trae Wilson en los Datos');
  const n2 = I.ejemplos.filter(e => e.nivel === 2 && /1 × 2 × 3 × …/.test(plano(e.enunciado)));
  assert.ok(n2.length && n2.every(e => /\+/.test(plano(e.enunciado))), 'el nivel 2 de Wilson es igual al nivel 1');
  const e3 = idea('euler').ejemplos.filter(e => e.nivel === 3 && /fracciones propias irreductibles/.test(plano(e.enunciado)));
  for (const e of e3) assert.ok(FACT(+plano(e.enunciado).match(/denominador (\d+)/)[1]).length >= 3, `${e.titulo}: igual que el nivel 2`);
});
test('M5: «Dos formas, una de 3 filas» no afirma que 3 × un compuesto siempre tenga otra forma (27 = 3 × 9 tiene dos)', () => {
  const e = idea('rectangulos').ejemplos.find(x => x.titulo === 'Dos formas, una de 3 filas');
  assert.ok(!/habría una tercera forma/.test(plano(e.solucion.map(p => p.texto))));
});
test('M6: el juego de Fermat resalta el primer día en que los sueltos vuelven a 1; Predice y Mira no usan p sin presentarla', () => {
  const I = idea('fermat-wilson');
  for (const a of [2, 3, 4, 6]) for (const p of [5, 7]) {
    const t = I.juega.dibujo({ a, p }).datos, res = t.filas.map(f => f[2]).findIndex(x => x.resalta);
    const rs = t.filas.map(f => +f[2].t);
    assert.equal(res, rs.indexOf(1), `base ${a}, bolsitas de ${p}`);
  }
  for (const o of I.predice.opciones) assert.ok(!/\bp\b/.test(o.siFuera || ''), o.siFuera);
  assert.ok(!/\bp\b/.test(I.mira.voz + I.predice.voz));
  assert.ok(!/base \d/.test(JSON.stringify(I.mira.datos.columnas)), 'encabezados «base 2» que se pegan');
});
test('M7: las reglas dicen qué son p, q, α y β; «Vale si» sigue en minúscula; un solo nombre: descomposición canónica', () => {
  assert.match(idea('factorizacion').regla.condicion, /«alfa» y «beta»/);
  assert.match(idea('divisores').regla.texto, /p y q primos/);
  assert.ok(!/12³ no es 2³/.test(idea('divisores').regla.condicion));
  for (const I of def.ideas) assert.match(I.regla.condicion, /^[a-zé0-9p]/, `${I.id}: «Vale si» con mayúscula`);
  const todo = JSON.stringify(def.ideas.map(I => [I.lee, I.juega.consigna, I.predice, I.mira, I.regla, I.ejemplos, I.ahoraTu.generar(0), I.resuelve.generar(0)])) + JSON.stringify(def.glosario);
  assert.ok(!/[Ff]orma canónica/.test(todo), 'aparece «forma canónica»');
});
test('M8: PESI se dice en palabras en la idea 5 (Lee y la definición de φ en los Datos) y en Lee de la idea 3', () => {
  assert.match(plano(idea('euler').lee.tarjetas[0].texto), /primo entre sí/);
  assert.ok(idea('euler').ejemplos.filter(e => e.datos.some(d => /^φ\(N\): cuántos/.test(plano(d)))).every(e => e.datos.some(d => /no comparten ningún primo/.test(plano(d)))));
  assert.match(plano(idea('factorizacion').lee.tarjetas[2].texto), /primos entre sí/);
});
test('M9: ningún ejemplo de la idea 4 es la misión del juego (48 = 2⁴ × 3 con 10 divisores)', () => {
  for (const e of idea('divisores').ejemplos) assert.ok(!JSON.stringify(e.enunciado).includes('{"sup":["2","4"]}," × 3?"'), e.titulo);
});
test('lector A y B: carteles sin cordeles; al final de la criba quedan en violeta todos los primos; tachados legibles', () => {
  const dibujos = [];
  for (const I of def.ideas) {
    for (const t of I.lee.tarjetas) if (t.pieza === 'arit-boletos') dibujos.push(t.dibujo.datos);
    if (I.juega.pieza === 'arit-boletos') for (const v of [{ p: 2, n: 12 }, { p: 5, n: 15 }]) dibujos.push(I.juega.dibujo(v).datos);
    if (I.predice.pieza === 'arit-boletos') dibujos.push(I.predice.dibujo.datos, I.predice.revelar.datos);
    if (I.mira.pieza === 'arit-boletos') dibujos.push(I.mira.datos);
  }
  for (const d of dibujos) if (d.letrero || (d.pasos || []).some(p => p.letrero)) assert.equal(d.cordeles, false, JSON.stringify(d.letrero));
  const M = idea('criba').mira, ult = { paso: M.datos.pasos.length - 1 };
  const g = PZ('arit-boletos').geometria(M.datos, ult);
  assert.equal(g.celdas.filter(c => c.queda).length, 25);
  assert.ok(!/fill-opacity="0.45"/.test(PZ('arit-boletos').dibujar(M.datos, ult)));
  // La lectura del árbol no pinta las partes del primer corte (el 18 parecía primo).
  assert.ok(!fichas(idea('factorizacion').juega.lectura({ n: 36, d: 2 })).some(x => x.t === '18'));
});
