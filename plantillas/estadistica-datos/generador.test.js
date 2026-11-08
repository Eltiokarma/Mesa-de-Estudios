// Pruebas del generador «estadistica-datos»: casos.json (verificados aparte, a ciegas), un recálculo
// independiente en cada uno de 600 problemas (fuerza bruta y enumeración, no las fórmulas del
// generador), propiedades de las alternativas y papel.json.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// ---------- herramientas propias de la prueba ----------
const sumar = xs => xs.reduce((a, b) => a + b, 0);
function insercion(xs) { const s = []; for (const x of xs) { let i = s.length; while (i > 0 && s[i - 1] > x) i--; s.splice(i, 0, x); } return s; }
function medianaPorConteo(xs) {
  // El dato (o los dos) que deja tantos datos debajo como encima.
  const s = insercion(xs), n = s.length;
  const pos = n % 2 ? [(n + 1) / 2] : [n / 2, n / 2 + 1];
  return sumar(pos.map(p => s[p - 1])) / pos.length;
}
function modaUnica(xs) {
  const c = {}; for (const x of xs) c[x] = (c[x] || 0) + 1;
  const max = Math.max(...Object.values(c)); if (max < 2) return null;
  const top = Object.keys(c).filter(k => c[k] === max);
  return top.length === 1 ? Number(top[0]) : null;
}
// Todas las listas no crecientes de n enteros positivos que suman S (sin podar por la mediana).
function todas(n, S, max = S) {
  if (n === 0) return S === 0 ? [[]] : [];
  const out = [];
  for (let x = Math.min(max, S - (n - 1)); x >= Math.ceil(S / n); x--) for (const r of todas(n - 1, S - x, x)) out.push([x, ...r]);
  return out;
}
const clave = t => 'ord:' + t;

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'extremo') {
    const S = Math.round(d.n * d.p);
    if (d.sub === 'cota') { for (let x = S; x >= 0; x--) if (S - x >= (d.n - 1) * d.m && x >= d.m) return x; }
    if (d.sub === 'tope') { for (let x = 0; x <= 20; x++) if (S - x >= 0 && S - x <= (d.n - 1) * d.M) return x; }
    // distintos: todos los conjuntos de n enteros distintos en [m, tope] que suman S.
    let mejor = -1;
    (function rec(desde, quedan, resto, mayor) {
      if (quedan === 0) { if (resto === 0) mejor = Math.max(mejor, mayor); return; }
      for (let x = desde; x <= d.tope && x <= resto; x++) rec(x + 1, quedan - 1, resto - x, x);
    })(d.m, d.n, S, -1);
    return mejor;
  }
  if (d.tipo === 'central') {
    const xs = d.datos, Me = medianaPorConteo(xs), Mo = modaUnica(xs), x = sumar(xs) / xs.length;
    if (d.sub === 'mediana') return Me;
    const t = [['x̄', x], ['Me', Me], ['Mo', Mo]].sort((a, b) => a[1] - b[1]);
    return clave(t.map(e => e[0]).reduce((acc, nom, i) => i ? acc + (Math.abs(t[i][1] - t[i - 1][1]) < 1e-9 ? ' = ' : ' < ') + nom : nom, ''));
  }
  if (d.tipo === 'reconstruir') {
    if (d.sub === 'incognitas') {
      const partes = d.vista.split('; '), n = partes.length, sols = [];
      for (let x = 1; x <= 200; x++) for (let y = 1; y <= 200; y++) {
        const L = partes.map(t => t === 'x' ? x : t === 'y' ? y : Number(t));
        if (L.some((t, i) => i && t < L[i - 1])) continue;
        if (Math.abs(sumar(L) / n - d.media) < 1e-9 && Math.abs(medianaPorConteo(L) - d.mediana) < 1e-9) sols.push([x, y]);
      }
      assert.equal(sols.length, 1, `incógnitas: ${sols.length} soluciones`);
      return d.pide === 'y' ? sols[0][1] : sols[0][1] - sols[0][0];
    }
    const n = d.sub === 'cinco' ? 5 : 6;
    const sols = todas(n, Math.round(n * d.media)).map(L => L.slice().reverse())
      .filter(L => Math.abs(medianaPorConteo(L) - d.mediana) < 1e-9 && modaUnica(L) === d.moda && (d.conocido == null || L.includes(d.conocido)));
    if (d.sub === 'cinco') {
      assert.equal(sols.length, 1, `cinco: ${sols.length} listas`);
      const L = sols[0];
      return d.pide === 'mayor' ? L[4] : d.pide === 'rango' ? L[4] - L[0] : L[0] + L[4];
    }
    const vals = sols.map(L => L[5]);
    return d.pide === 'max-mayor' ? Math.max(...vals) : Math.min(...vals);
  }
  if (d.tipo === 'varianza') {
    // Dos datos simétricos con esa media y esa desviación; se transforman y se mide de nuevo.
    const X = [d.media - d.desviacion, d.media + d.desviacion], Y = X.map(x => d.a * x + d.b);
    const m = sumar(Y) / 2, V = sumar(Y.map(y => (y - m) ** 2)) / 2;
    return d.sub === 'media' ? m : d.sub === 'var' ? V : Math.sqrt(V);
  }
  if (d.tipo === 'medias') {
    if (d.sub === 'dados') {
      let best = Infinity;
      const rec = (i, prod, s) => { if (i === d.k) { if (prod === d.producto) best = Math.min(best, s); return; } for (let x = 1; x <= 6; x++) rec(i + 1, prod * x, s + x); };
      rec(0, 1, 0);
      return best / d.k;
    }
    for (let a = 1; a <= d.MA; a++) {
      const b = 2 * d.MA - a;
      if (a * b === d.MG * d.MG) return d.sub === 'mh' ? 2 / (1 / a + 1 / b) : d.pide === 'mayor' ? b : b - a;
    }
    return NaN;
  }
  // subconjuntos
  if (d.sub === 'multiplos') {
    const xs = []; for (let x = d.A + 1; x < d.B; x++) if (x % d.k === d.resto) xs.push(x);
    return sumar(xs) / xs.length;
  }
  const pares = Array.from({ length: d.N }, (_, i) => 2 * (i + 1));
  let a = 1; while (sumar(pares.slice(0, a)) / a !== d.p1) a++;
  let c = 1; while (sumar(pares.slice(d.N - c)) / c !== d.p3) c++;
  const medio = pares.slice(a, d.N - c);
  return sumar(medio) / medio.length;
}
const igual = (a, b) => typeof b === 'string' ? a === b : Math.abs(a - b) < 1e-9;
probarGenerador(gen, { semillas: 600, recalcular, igual });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    if (typeof c.esperado.respuesta === 'number') assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

const SUBS = {
  extremo: ['cota', 'distintos', 'tope'], central: ['mediana', 'orden'], reconstruir: ['cinco', 'incognitas', 'seis'],
  varianza: ['desv', 'media', 'var', 'var-a-desv'], medias: ['dados', 'dos', 'mh'], subconjuntos: ['grupos', 'multiplos'],
};
const texto = segs => segs.map(s => typeof s === 'object' ? s.t : String(s)).join('');

test('salen todos los tipos y subtipos', () => {
  const vistos = {};
  for (let s = 0; s < 600; s++) { const d = gen.generar(s)._datos; (vistos[d.tipo] = vistos[d.tipo] || new Set()).add(d.sub); }
  assert.deepEqual(Object.keys(vistos).sort(), Object.keys(SUBS).sort());
  for (const t of Object.keys(SUBS)) assert.deepEqual([...vistos[t]].sort(), SUBS[t], t);
});

test('las alternativas tienen la misma forma y ningún distractor da la correcta', () => {
  const cola = t => t.replace(/^S\/ /, 'S/').replace(/^[−\d ,]+/, '').replace(/^S\/[−\d ,]+/, 'S/');
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos, alt = p.alternativas;
    const correcta = alt.find(a => a.correcta);
    assert.equal(correcta.texto, p.respuesta.texto, `semilla ${s}`);
    if (d.sub === 'orden') {
      for (const a of alt) assert.match(a.texto, /^(x̄|Me|Mo)( [<=] (x̄|Me|Mo)){2}$/, `semilla ${s}: ${a.texto}`);
      continue;
    }
    if (d.sub === 'dados') { for (const a of alt) assert.match(a.texto, /^\d+(\/\d+)?$/, `semilla ${s}: ${a.texto}`); }
    else assert.equal(new Set(alt.map(a => cola(a.texto))).size, 1, `semilla ${s}: formas distintas (${alt.map(a => a.texto)})`);
    for (const a of alt.filter(a => !a.correcta)) assert.ok(Math.abs(a.valor - correcta.valor) > 1e-9, `semilla ${s}: el error ${a.error.id} da la correcta`);
    for (const a of alt) assert.ok(!/,\d{3}/.test(a.texto), `semilla ${s}: más de dos decimales (${a.texto})`);
  }
});

test('textos limpios y un color por variable', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    const colores = Object.values(p.variables).map(x => x.color);
    assert.equal(new Set(colores).size, colores.length, `semilla ${s}: dos variables con el mismo color`);
    for (const c of colores) assert.ok(['o', 'i', 'd', 'h'].includes(c));
    const todos = [p.enunciado, p.pregunta, ...p.solucion];
    for (const segs of todos) for (const x of segs) if (typeof x === 'object') assert.ok(p.variables[x.v], `semilla ${s}: clave ${x.v} sin variable`);
    const textos = [...todos.map(texto), ...p.alternativas.map(a => a.texto), ...p.alternativas.filter(a => a.error).map(a => a.error.explicacion)];
    for (const t of textos) assert.ok(!/undefined|NaN|−−|null|Infinity/.test(t), `semilla ${s}: «${t}»`);
  }
});

test('los datos son creíbles', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos, r = p.respuesta.valor;
    if (d.tipo === 'extremo' && (d.contexto === 'notas' || d.sub === 'tope')) assert.ok(r >= 0 && r <= 20, `semilla ${s}: nota ${r}`);
    if (d.tipo === 'extremo' && d.contexto === 'edades') assert.ok(r <= 30, `semilla ${s}: edad ${r}`);
    if (d.tipo === 'central') assert.ok(d.datos.every(x => x > 0 && x <= 45));
    if (d.tipo === 'reconstruir' && d.sub !== 'incognitas') assert.ok(r > 0 && r <= 60, `semilla ${s}: ${r}`);
    if (d.tipo === 'medias' && d.sub !== 'dados') assert.ok(d.MA <= 100 && d.MG < d.MA, `semilla ${s}`);
    if (d.tipo === 'varianza' && d.contexto === 'puntajes') assert.ok(d.media - 3 * d.desviacion > 0);
    if (d.tipo === 'subconjuntos') assert.ok(r > 0 && r < 400, `semilla ${s}: ${r}`);
  }
});

test('el título y las preguntas no anuncian la regla', () => {
  assert.ok(!/varianza|no cambia|k²|ponder/i.test(gen.titulo));
  assert.ok(!/no cambia|k²|ponder/i.test(papel.titulo));
  for (let s = 0; s < 200; s++) assert.ok(!/no cambia|ponder|sin ordenar|ordenar/i.test(texto(gen.generar(s).pregunta)));
});

// ---------- papel.json ----------
test('papel.json: entre 5 y 10 problemas con sus campos', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  for (const q of papel.problemas) {
    for (const c of ['id', 'nivel', 'enunciado', 'respuesta', 'pasos']) assert.ok(q[c], `${q.id}: falta ${c}`);
    assert.ok(['básico', 'intermedio', 'avanzado'].includes(q.nivel));
    assert.ok(Array.isArray(q.pasos) && q.pasos.length >= 2);
  }
  assert.equal(new Set(papel.problemas.map(q => q.id)).size, papel.problemas.length);
});

test('papel.json: cada respuesta se recalcula', () => {
  const R = Object.fromEntries(papel.problemas.map(q => [q.id, q.respuesta]));
  const tiene = (id, t) => assert.ok(R[id].includes(t), `${id}: «${R[id]}» no trae ${t}`);
  // p1: 7 amigos, promedio S/ 18, nadie menos de S/ 12 → 7·18 − 6·12.
  tiene('p1', `S/ ${recalcular({ _datos: { tipo: 'extremo', sub: 'cota', n: 7, p: 18, m: 12 } })}`);
  // p2: 6 notas enteras distintas, promedio 13, ninguna menor que 10 (tope 20).
  tiene('p2', String(recalcular({ _datos: { tipo: 'extremo', sub: 'distintos', n: 6, p: 13, m: 10, tope: 20 } })));
  // p3: mediana de 12; 7; 15; 7; 10; 18; 9; 13.
  tiene('p3', String(medianaPorConteo([12, 7, 15, 7, 10, 18, 9, 13])).replace('.', ','));
  // p4: cinco enteros positivos, media 9, mediana 8, moda única 12: el menor.
  const p4 = todas(5, 45).map(L => L.reverse()).filter(L => medianaPorConteo(L) === 8 && modaUnica(L) === 12);
  assert.equal(p4.length, 1); tiene('p4', String(p4[0][0]));
  // p5: 4; 6; x; 12; y; 17 ordenados, media 10, mediana 9.
  tiene('p5', String(recalcular({ _datos: { tipo: 'reconstruir', sub: 'incognitas', vista: '4; 6; x; 12; y; 17', media: 10, mediana: 9, pide: 'y' } })));
  // p6: varianza 5, Y = 4X − 7.
  tiene('p6', String(Math.round(recalcular({ _datos: { tipo: 'varianza', sub: 'var', media: 10, desviacion: Math.sqrt(5), a: 4, b: -7 } }))));
  // p7: MA 13 y MG 12: los números y la MH.
  tiene('p7', '8 y 18');
  assert.ok(Math.abs(recalcular({ _datos: { tipo: 'medias', sub: 'mh', MA: 13, MG: 12 } }) - 144 / 13) < 1e-9); tiene('p7', '144/13');
  // p8: tres dados con producto 60: menor MA.
  assert.equal(recalcular({ _datos: { tipo: 'medias', sub: 'dados', k: 3, producto: 60 } }), 4); tiene('p8', '4');
  // p9: múltiplos de 6 entre 50 y 200.
  tiene('p9', String(recalcular({ _datos: { tipo: 'subconjuntos', sub: 'multiplos', k: 6, resto: 0, A: 50, B: 200 } })));
  // p10: pares del 2 al 80; primer grupo promedia 9, último 71.
  tiene('p10', String(recalcular({ _datos: { tipo: 'subconjuntos', sub: 'grupos', N: 40, p1: 9, p3: 71 } })));
});
