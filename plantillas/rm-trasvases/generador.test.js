// Pruebas del generador de trasvases: casos.json (verificados aparte), papel.json y un recálculo
// independiente en cada uno de 600 problemas. El generador busca en anchura (Dijkstra con costo 0 para
// llenar y vaciar cuando no cuentan); aquí se recalcula con profundidad iterativa (sin repetir estados
// en una misma rama) o, cuando llenar y vaciar no cuentan, por capas de trasvases con su clausura gratis.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// ---- Camino independiente ----
function verter(caps, e, i, j) {
  const s = [...e]; const q = Math.min(s[i], caps[j] - s[j]); s[i] -= q; s[j] += q; return s;
}
function hijos(caps, e, conCano) {
  const out = [];
  caps.forEach((_, i) => caps.forEach((__, j) => { if (i !== j && e[i] > 0 && e[j] < caps[j]) out.push({ s: verter(caps, e, i, j), cuenta: true }); }));
  if (conCano) caps.forEach((c, i) => {
    if (e[i] < c) { const s = [...e]; s[i] = c; out.push({ s, cuenta: false }); }
    if (e[i] > 0) { const s = [...e]; s[i] = 0; out.push({ s, cuenta: false }); }
  });
  return out;
}
function prueba(d) {
  const m = d.tipo === 'dos-jarras' ? { tipo: 'alguno', x: d.x } : d.meta;
  if (m.tipo === 'alguno') return e => e.some(c => c === m.x);
  if (m.tipo === 'en') return e => e[m.i] === m.x;
  return e => e.join('|') === m.estado.join('|');
}
const inicio = d => (d.tipo === 'dos-jarras' ? [0, 0] : d.caps.map((c, i) => (i ? 0 : c)));
// Profundidad iterativa: todas las jugadas cuentan.
function iddfs(caps, ini, conCano, meta, tope = 25) {
  for (let L = 0; L <= tope; L++) {
    const mejor = new Map(); // estado → mayor presupuesto con que ya se exploró sin éxito
    const dfs = (e, r) => {
      if (meta(e)) return true;
      if (r === 0) return false;
      const k = e.join('|');
      if ((mejor.get(k) ?? -1) >= r) return false;
      mejor.set(k, r);
      return hijos(caps, e, conCano).some(h => dfs(h.s, r - 1));
    };
    if (dfs(ini, L)) return L;
  }
  return NaN;
}
// Por capas: llenar y vaciar son gratis; cada capa es un trasvase más.
function capas(caps, ini, meta) {
  const vistos = new Set();
  const clausura = lista => {
    const pila = [...lista], out = [];
    while (pila.length) { const e = pila.pop(), k = e.join('|'); if (vistos.has(k)) continue; vistos.add(k); out.push(e); hijos(caps, e, true).filter(h => !h.cuenta).forEach(h => pila.push(h.s)); }
    return out;
  };
  let capa = clausura([ini]);
  for (let n = 0; n < 40 && capa.length; n++) {
    if (capa.some(meta)) return n;
    capa = clausura(capa.flatMap(e => hijos(caps, e, true).filter(h => h.cuenta).map(h => h.s)));
  }
  return NaN;
}
// Barriles: cada barril va al cliente 1, al cliente 2 o se queda (3⁶ maneras).
function barrilQueQueda({ barriles, k }) {
  const quedan = new Set(), n = barriles.length;
  for (let c = 0; c < 3 ** n; c++) {
    let x = c, s1 = 0, s2 = 0, n1 = 0, n2 = 0; const q = [];
    for (const b of barriles) { const t = x % 3; x = (x - t) / 3; if (t === 0) { s1 += b; n1++; } else if (t === 1) { s2 += b; n2++; } else q.push(b); }
    if (q.length === 1 && n1 && n2 && s2 === k * s1) quedan.add(q[0]);
  }
  return quedan.size === 1 ? [...quedan][0] : NaN;
}
function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'barriles') return barrilQueQueda(d);
  if (d.tipo === 'dos-jarras' && d.cuenta === 'trasvases') return capas(d.caps, inicio(d), prueba(d));
  return iddfs(d.caps, inicio(d), d.tipo === 'dos-jarras', prueba(d));
}
probarGenerador(gen, { semillas: 600, recalcular });

test('salen los cuatro tipos y las metas de cada uno en 200 semillas', () => {
  const vistos = new Set();
  for (let s = 0; s < 200; s++) {
    const d = gen.generar(s)._datos;
    vistos.add(d.tipo + (d.meta ? ':' + d.meta.tipo : d.cuenta ? ':' + d.cuenta : ''));
  }
  for (const t of ['dos-jarras:todo', 'dos-jarras:trasvases', 'tres-cerrados:alguno', 'tres-cerrados:en', 'tres-cerrados:reparto', 'cuatro:en', 'cuatro:alguno', 'barriles'])
    assert.ok(vistos.has(t), `no salió ${t}`);
});

test('la solución mostrada es válida paso a paso y su largo es la respuesta', () => {
  for (let s = 0; s < 300; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.tipo === 'barriles') continue;
    const sol = gen.calc.minimo(d);
    let e = inicio(d), contados = 0;
    assert.deepEqual(sol.camino[0], e);
    sol.movs.forEach((m, i) => {
      if (m.tipo === 'pasar') { assert.ok(e[m.de] > 0 && e[m.a] < d.caps[m.a], `semilla ${s}: trasvase inútil`); e = verter(d.caps, e, m.de, m.a); }
      else { assert.equal(d.tipo, 'dos-jarras'); e = [...e]; if (m.tipo === 'llenar') e[m.a] = d.caps[m.a]; else e[m.de] = 0; }
      if (m.tipo === 'pasar' || d.cuenta !== 'trasvases') contados++;
      assert.deepEqual(sol.camino[i + 1], e, `semilla ${s}: el estado ${i + 1} no sale de la jugada`);
    });
    assert.ok(prueba(d)(e), `semilla ${s}: el último estado no cumple la meta`);
    assert.equal(contados, p.respuesta.valor);
    // Ningún estado intermedio cumple ya la meta (si no, la ruta no sería la más corta).
    sol.camino.slice(0, -1).forEach(x => assert.ok(!prueba(d)(x) || d.cuenta === 'trasvases'));
  }
});

test('los distractores de ruta son más largos y los de «meta a medias» no cumplen la meta', () => {
  for (let s = 0; s < 300; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas.filter(x => !x.correcta)) {
      if (a.error.id === 'RMP2-otra-ruta') assert.ok(a.valor > p.respuesta.valor);
      if (a.error.id === 'RMP1-estados') assert.equal(a.valor, p.respuesta.valor + 1);
      if (/^RMP11-(repartida|otro-recipiente|a-medias)/.test(a.error.id)) assert.ok(a.valor < p.respuesta.valor);
    }
  }
});

test('barriles: el que queda es el único que permite armar los dos pedidos', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.tipo !== 'barriles') continue;
    const r = gen.calc.barriles(d);
    const T = d.barriles.reduce((a, b) => a + b, 0);
    assert.equal(r.primero.reduce((a, b) => a + b, 0) * d.k, r.segundo.reduce((a, b) => a + b, 0));
    assert.equal(r.primero.length + r.segundo.length, 5);
    assert.equal(T - r.queda, (d.k + 1) * r.primero.reduce((a, b) => a + b, 0));
    for (const a of p.alternativas.filter(x => !x.correcta)) assert.ok(d.barriles.includes(a.valor), 'toda alternativa es un barril');
  }
});

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(p.respuesta.valor, c.esperado.respuesta);
  });
}

// Compara solo las claves que trae «espera».
function parcial(real, espera, que) {
  for (const [k, val] of Object.entries(espera)) {
    if (val && typeof val === 'object' && !Array.isArray(val)) parcial(real[k], val, `${que}.${k}`);
    else assert.deepEqual(real[k], val, `${que}.${k}`);
  }
}
for (const pr of papel.problemas) {
  test(`papel ${pr.id}: la respuesta sale del cálculo`, () => {
    assert.ok(pr.verificar && pr.verificar.length);
    for (const vf of pr.verificar) parcial(gen.calc[vf.fn](...vf.args), vf.espera, `${pr.id}.${vf.fn}`);
  });
}
