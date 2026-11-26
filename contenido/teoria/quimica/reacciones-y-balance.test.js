// Prueba propia de «Reacciones químicas y balance» (Etapa 9, 26 nov 2026). Lo que el validador común no mira:
//   - colores: solo los cuatro tokens del mapa de la unidad (coeficiente c-f, EO c-o, electrones c-i, carga c-h), nunca verde;
//   - las lupas: cada vaso de iones es neutro, antes y después hay los mismos átomos, y en una misma lupa no van dos
//     elementos de colores cercanos (Elementos.CERCANOS);
//   - las ecuaciones: toda ecuación completa que se escribe (ejemplos, Así se resuelve y Ahora tú en 400 semillas) cuadra en
//     átomos y en carga, con un conteo propio que no usa el motor;
//   - una sola correcta y opciones distintas en 400 semillas; los electrones transferidos que se escriben son los de un lado
//     (no los del HCl que no cambia).
const test = require('node:test');
const assert = require('node:assert/strict');
const def = require('./reacciones-y-balance.js');
const E = require('../../../nucleo/elementos.js');
for (const r of def.requiere) require('../../..' + r);
const Kit = require('../../../nucleo/kit/kit.js');

const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? plano(x.t ?? x.negrita ?? x.llave ?? '') : String(x ?? '')).replace(/ /g, ' ');
const idea = id => def.ideas.find(i => i.id === id);
const SUB = '₀₁₂₃₄₅₆₇₈₉', SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
// Conteo propio de una especie como se escribe en el libro: «Ca(OH)₂(s)», «Cr₂O₇²⁻», «e⁻».
function especie(t) {
  let s = t.replace(/\((s|l|g|ac)\)$/, '').replace(/[₀-₉]/g, c => SUB.indexOf(c)), q = 0;
  const m = s.match(/([⁰¹²³⁴⁵⁶⁷⁸⁹]*)([⁺⁻])$/);
  if (m) { q = (m[2] === '⁺' ? 1 : -1) * (m[1] ? +m[1].split('').map(c => SUP.indexOf(c)).join('') : 1); s = s.slice(0, s.length - m[0].length); }
  if (s === 'e') return { at: {}, q: -1 };
  for (let g = 0; g < 5; g++) s = s.replace(/\(([^()]+)\)(\d*)/, (x, a, n) => a.repeat(+n || 1));
  const at = {}; for (const [, e, n] of s.matchAll(/([A-Z][a-z]?)(\d*)/g)) at[e] = (at[e] || 0) + (+n || 1);
  return { at, q };
}
function cuadra(ec) {
  const tot = l => { const r = { q: 0 }; for (const x of l.trim().split(/\s+\+\s+/)) { const m = x.match(/^(\d+)\s+(.*)$/), k = m ? +m[1] : 1, c = especie(m ? m[2] : x); r.q += k * c.q; for (const [e, n] of Object.entries(c.at)) r[e] = (r[e] || 0) + k * n; } return r; };
  const [a, b] = ec.split('→'), A = tot(a), B = tot(b);
  return [...new Set([...Object.keys(A), ...Object.keys(B)])].every(k => (A[k] || 0) === (B[k] || 0));
}
// Las ecuaciones completas de un texto: segmentos con «→», sin «?», «__», «calor» ni palabras.
function ecuaciones(txt) {
  const out = [];
  for (const seg of txt.split(/[,.;¿?|:·]|\b[I]+\. /).filter(x => x.includes('→') && !x.includes('__'))) {
    const i0 = seg.search(/(\d+ )?[A-Z][a-z]?(?=[₀-₉(A-Z⁺⁻⁰¹²³⁴⁵⁶⁷⁸⁹]| \+| →)/); if (i0 < 0) continue;
    const ec = seg.slice(i0).trim().replace(/\s*\+\s*(calor|energía)/g, '').replace(/(calor|energía)\s*\+\s*/g, '');
    if (/[a-z]{4,}|\bx\b|\(\?\)/.test(ec.replace(/\((s|l|g|ac)\)/g, ''))) continue;
    out.push(ec);
  }
  return out;
}
// Pasos a medio hacer que se escriben a propósito sin cuadrar (el resuelto los completa).
const A_PROPOSITO = ['SO₄²⁻ → SO₂ + 2 H₂O', 'ClO₃⁻ + 6 H⁺ → Cl⁻ + 3 H₂O'];

test('colores: solo los cuatro tokens del mapa de la unidad, sin verde', () => {
  const tokens = new Set();
  const mira = x => { if (Array.isArray(x)) x.forEach(mira); else if (x && typeof x === 'object') { if (x.v) tokens.add(x.v); for (const k of Object.keys(x)) if (typeof x[k] === 'object') mira(x[k]); } };
  for (const I of def.ideas) {
    mira([I.lee, I.predice, I.mira, I.regla, I.ejemplos, I.juega.leyenda]);
    for (let s = 0; s < 40; s++) { mira(I.ahoraTu.generar(s)); mira(I.resuelve.generar(s)); }
  }
  for (const t of tokens) assert.ok(['c-f', 'c-o', 'c-i', 'c-h'].includes(t), t);
  assert.ok(!tokens.has('c-d'));
});

test('lupas: vasos neutros, mismos átomos antes y después, sin elementos de colores cercanos', () => {
  // Carga de cada partícula de la lupa (el nombre de la especie en la unidad): H es H⁺, Zn2 es Zn²⁺.
  const Q = { H: 1, Cl: -1, Zn2: 2, Ag: 1, K: 1, NO3: -1, Fe3: 3, OH: -1, Na: 1 };
  const cerca = new Set(E.CERCANOS.map(([a, b]) => `${a}|${b}`));
  const revisa = (d, donde, corte = 99) => {
    const ve = p => !(p.desde && p.desde > corte) && !(p.hasta && p.hasta < corte);
    const els = new Set();
    for (const c of d.cajas) {
      let q = 0;
      for (const p of c.particulas.filter(ve)) { q += (Q[p.e] || 0) * (p.n === undefined ? 1 : p.n); for (const [a] of d.especies[p.e]) els.add(d.atomos[a].el); }
      assert.equal(q, 0, `${donde}: la caja «${c.titulo}» no es neutra`);
    }
    for (const a of els) for (const b of els) assert.ok(!cerca.has(`${a}|${b}`), `${donde}: ${a} y ${b} tienen colores cercanos`);
  };
  const atomos = (d, c) => { const r = {}; for (const p of c.particulas) for (const [a] of d.especies[p.e]) { const el = d.atomos[a].el; r[el] = (r[el] || 0) + (p.n === undefined ? 1 : p.n); } return r; };
  const I1 = idea('indicios');
  for (const o of I1.juega.controles[0].opciones) for (const t of [0, 2.5, 7]) {
    const d = I1.juega.dibujo({ k: o.valor, t }).datos;
    revisa(d, `juego ${o.valor}`);
    assert.deepEqual(atomos(d, d.cajas[0]), atomos(d, d.cajas[1]), `juego ${o.valor}: los átomos de antes y de después`);
  }
  revisa(I1.predice.dibujo.datos, 'Predice'); revisa(I1.predice.revelar.datos, 'revelar');
  const [a, b] = I1.predice.dibujo.datos.cajas, juntos = { particulas: [...a.particulas, ...b.particulas] }, d = I1.predice.dibujo.datos;
  assert.deepEqual(atomos(d, juntos), atomos(I1.predice.revelar.datos, I1.predice.revelar.datos.cajas[0]), 'la mezcla conserva las partículas de los dos vasos');
  for (const corte of [1, 2]) revisa(I1.mira.datos, `Mira, paso ${corte}`, corte);
  const T = idea('tanteo');
  for (const v of [{ a: 1, b: 1, c: 1 }, { a: 2, b: 1, c: 2 }, { a: 4, b: 4, c: 4 }]) revisa(T.juega.dibujo(v).datos, 'juego del metano');
});

test('toda ecuación escrita cuadra en átomos y carga (ejemplos y 400 semillas)', () => {
  for (const I of def.ideas) {
    const enunciado = ['indicios', 'clasificar', 'oxida-reduce'].includes(I.id);
    I.ejemplos.forEach((e, k) => {
      const txt = [enunciado ? plano(e.enunciado) : '', ...(e.alternativas || []).map(a => `| ${plano(a)} |`), ...e.solucion.map(x => `${plano(x.texto)} | ${plano(x.ecuacion || '')}`), plano(e.respuesta)].join(' | ');
      for (const ec of ecuaciones(txt)) if (!A_PROPOSITO.includes(ec)) assert.ok(cuadra(ec), `${I.id} ejemplo ${k + 1}: ${ec}`);
    });
    for (let s = 0; s < 400; s++) {
      const q = I.ahoraTu.generar(s);
      assert.equal(q.opciones.filter(o => o.correcta).length, 1, `${I.id} ${s}`);
      assert.equal(new Set(q.opciones.map(o => plano(o.texto))).size, q.opciones.length, `${I.id} ${s}: opciones repetidas`);
      for (const ec of ecuaciones(`${enunciado ? plano(q.pregunta) : ''} | ${plano(q.solucion.ecuacion || '')}`)) assert.ok(cuadra(ec), `${I.id} ahoraTu ${s}: ${ec}`);
      if (s < 60) { const r = I.resuelve.generar(s); for (const ec of ecuaciones([enunciado ? plano(r.enunciado) : '', ...r.pasos.map(p => `${plano(p.texto)} | ${plano(p.ecuacion || '')}`)].join(' | '))) assert.ok(cuadra(ec), `${I.id} resuelve ${s}: ${ec}`); }
    }
  }
});

test('electrones transferidos: los de un lado, no los del HCl que no cambia', () => {
  const I = idea('cambio-eo');
  for (let s = 0; s < 400; s++) {
    const q = I.ahoraTu.generar(s), t = plano(q.solucion.texto), m = t.match(/Se transfieren (\d+) electrones/);
    if (m && /K₂Cr₂O₇ \+ HCl/.test(plano(q.pregunta))) assert.equal(+m[1], 6, t);
    const n = t.match(/Se igualan (\d+) electrones/);
    if (n && /MnO₂ \+ HCl/.test(plano(q.pregunta))) assert.equal(+n[1], 2, t);
  }
});

test('el juego de cada idea: la misión no está cumplida al abrir y se puede cumplir', () => {
  const casos = { indicios: { k: 'hervir', t: 0 }, clasificar: { k: 'doble', t: 0 }, tanteo: { a: 2, b: 1, c: 2 }, 'oxida-reduce': { k: 'h2', t: 6 }, 'cambio-eo': { cu: 1, ag: 2 }, 'ion-electron': { w: 4, h: 8, e: 5 } };
  for (const I of def.ideas) {
    const ini = Object.fromEntries(I.juega.controles.map(c => [c.id, c.inicio !== undefined ? c.inicio : c.opciones[0].valor]));
    assert.equal(I.juega.mision.logrado(ini), false, I.id);
    assert.equal(I.juega.mision.logrado(Object.assign({}, ini, casos[I.id])), true, I.id);
    assert.ok(Kit.piezas[I.juega.dibujo(Object.assign({}, ini, casos[I.id])).pieza || I.pieza], I.id);
  }
});

// Auditoría y lectores en frío (26 nov): cada corrección con su prueba.
test('auditoría: lo que el auditor y los lectores encontraron no vuelve', () => {
  const ej = (id, titulo) => idea(id).ejemplos.find(e => e.titulo === titulo);
  const txt = e => plano([e.enunciado, ...e.solucion.map(x => [x.texto, ' ', x.ecuacion || '', ' ']), e.respuesta]);
  // «Una fracción que se va»: con 1, 5, 2, 1 el carbono cuadra (2 y 2); lo que no cuadra es el oxígeno (10 contra 5).
  assert.match(txt(ej('tanteo', 'Una fracción que se va')), /oxígeno quedaría en 10 contra 5/);
  assert.doesNotMatch(txt(ej('tanteo', 'Una fracción que se va')), /carbono en 1 contra 2/);
  // SO₂ → SO₄²⁻: los O faltan a la izquierda, donde va el agua.
  assert.match(txt(ej('ion-electron', 'Una oxidación')), /faltan 2 O a la izquierda/);
  // Una semirreacción a medias dice que le faltan los electrones.
  assert.match(txt(ej('ion-electron', 'El hidrógeno')), /faltan los electrones/);
  // Los datos dan el EO del halógeno en una sal sin oxígeno (Fe + Cl₂ → FeCl₃ de «Así se resuelve» 5).
  for (let s = 0; s < 20; s++) assert.ok(idea('cambio-eo').resuelve.generar(s).datos.some(d => /cloro.*−1/.test(d)), `resuelve ${s}`);
  // El juego de la idea 5 escribe una ecuación que cuadra en átomos: el nitrato no cambia y no se escribe.
  const j5 = plano(idea('cambio-eo').juega.dibujo({ cu: 2, ag: 1 }).datos.ecuacion);
  assert.doesNotMatch(j5, /NO₃/); assert.match(j5, /Ag⁺/);
  // Un solo símbolo por especie: el Fe³⁺ de las lupas no es el Fe metálico.
  assert.ok(JSON.stringify(idea('indicios').predice.dibujo.datos.cajas[0].particulas).includes('"Fe3"'));
  // Concordancia en 400 semillas: nada de «1 electrones».
  for (const I of def.ideas) for (let s = 0; s < 400; s++) for (const p of [I.ahoraTu.generar(s), I.resuelve.generar(s)]) {
    assert.doesNotMatch(plano(JSON.stringify(p)), /\b1 (electrones|átomos|moléculas)\b/, `${I.id} ${s}`);
  }
});
