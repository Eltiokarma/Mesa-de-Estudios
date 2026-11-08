// Pruebas del generador «dados y dominó»: casos.json y un recálculo independiente en 600 problemas.
// El generador prueba las 24 orientaciones de cada dado; aquí se usa otro camino: las caras de los
// costados de un dado son dos pares opuestos (suman 14), cada par oculto suma 7 y solo queda libre
// una cara por dado; el dominó se cuenta con pares ordenados y dobles, (ordenados + dobles)/2.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

const ext = (l, max) => (max ? Math.max(...l) : Math.min(...l));
const esPrimo = n => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
const PRUEBA = {
  primo: s => esPrimo(s), par: s => s % 2 === 0, impar: s => s % 2 === 1,
  multiplo: (s, q) => s > 0 && s % q === 0, mayor: (s, q) => s > q, menor: (s, q) => s < q,
};

function recalcular(p) {
  const d = p._datos, max = d.extremo === 'max';
  if (d.tipo === 'torre') {
    const tops = [1, 2, 3, 4, 5, 6].filter(t => !d.condicion || (d.condicion.tipo === 'valor' ? t === d.condicion.t : (t % 2 === 0) === d.condicion.par));
    const val = t => (d.pide === 'ocultos' ? 7 * (d.k - 1) + (7 - t) : 14 * d.k + t);
    return ext(tops.map(val), max);
  }
  if (d.tipo === 'fila') {
    // Visibles por dado: [máximo, mínimo] para los dos extremos y para los del medio.
    const [punta, medio] = d.pared ? [[15, 6], [11, 3]] : [[18, 10], [13, 8]];
    const vis = m => 2 * punta[m] + (d.k - 2) * medio[m];
    if (d.pide === 'visibles') return vis(max ? 0 : 1);
    return 21 * d.k - vis(max ? 1 : 0);
  }
  if (d.tipo === 'contacto') {
    const rel = b => (d.regla.tipo === 'suma' ? d.regla.S - b : b);
    const sirve = x => { let b = x; for (let i = d.k - 2; i >= 0; i--) { const t = rel(b); if (t < 1 || t > 6) return false; b = 7 - t; } return true; };
    const xs = [1, 2, 3, 4, 5, 6].filter(sirve);
    const ocultos = x => 7 * (d.k - 1) + x;
    return ext(xs.map(x => (d.pide === 'ocultos' ? ocultos(x) : 21 * d.k - ocultos(x))), max);
  }
  if (d.tipo === 'producto') {
    const sumas = [];
    const rec = (i, prod, abajo) => {
      if (i === d.k) { if (prod === d.P) sumas.push(abajo); return; }
      for (let t = 1; t <= 6; t++) rec(i + 1, prod * t, abajo + 7 - t);
    };
    rec(0, 1, 0);
    return ext(sumas, max);
  }
  if (d.tipo === 'domino') {
    const m = d.m;
    if (d.pide === 'suma') return m * (m + 1) * (m + 2) / 2;
    if (d.pide === 'fichas') return (m + 1) * (m + 2) / 2;
    let ord = 0, dob = 0;
    const cumple = (a, b) => (d.cond.tipo === 'contiene' ? a === d.cond.q || b === d.cond.q : PRUEBA[d.cond.tipo](a + b, d.cond.q));
    for (let a = 0; a <= m; a++) for (let b = 0; b <= m; b++) if (cumple(a, b)) { ord++; if (a === b) dob++; }
    return (ord + dob) / 2;
  }
  throw new Error('tipo desconocido ' + d.tipo);
}

probarGenerador(gen, { semillas: 600, recalcular });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla} (${c.tipo})`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(p.respuesta.valor, c.esperado.respuesta);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

test('las 24 orientaciones son dados comunes distintos', () => {
  const { DADO } = gen._interno;
  assert.equal(DADO.length, 24);
  assert.equal(new Set(DADO.map(o => o.join(''))).size, 24);
  for (const o of DADO) {
    assert.deepEqual([...o].sort(), [1, 2, 3, 4, 5, 6]);
    assert.equal(o[0] + o[1], 7); assert.equal(o[2] + o[3], 7); assert.equal(o[4] + o[5], 7);
  }
  // Cada valor sale arriba en 4 orientaciones (los cuatro giros sobre el eje vertical).
  for (let t = 1; t <= 6; t++) assert.equal(DADO.filter(o => o[0] === t).length, 4);
});

test('el recorrido por la tabla coincide con probar todas las combinaciones (torres de hasta 3 dados)', () => {
  const { DADO, extremo } = gen._interno;
  for (const k of [2, 3]) for (const S of [null, 5, 8, 9]) for (const max of [true, false]) {
    const cuenta = i => (i < k - 1 ? [0, 1] : [1]);
    const rel = S === null ? null : (a, b) => a + b === S;
    let mejor = null;
    const rec = (i, ant, s) => {
      if (i === k) { mejor = mejor === null ? s : max ? Math.max(mejor, s) : Math.min(mejor, s); return; }
      for (const o of DADO) {
        if (i > 0 && rel && !rel(ant, o[1])) continue;
        rec(i + 1, o[0], s + cuenta(i).reduce((t, c) => t + o[c], 0));
      }
    };
    rec(0, null, 0);
    assert.equal(extremo(k, { cuenta, contacto: rel, max }), mejor, `k = ${k}, S = ${S}`);
  }
});

test('salen los cinco tipos, con enteros positivos', () => {
  const tipos = new Set();
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    tipos.add(p._datos.tipo);
    for (const a of p.alternativas) assert.ok(Number.isInteger(a.valor) && a.valor > 0, `semilla ${s}: ${a.texto}`);
  }
  assert.deepEqual([...tipos].sort(), ['contacto', 'domino', 'fila', 'producto', 'torre']);
});

test('dominó del 0 al 6: 28 fichas y 168 puntos; el error RME12 da 49 fichas', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.tipo !== 'domino' || d.m !== 6 || d.pide !== 'suma') continue;
    assert.equal(p.respuesta.valor, 168);
    const rme12 = p.alternativas.filter(a => a.error && a.error.id === 'RME12').map(a => a.valor);
    assert.ok(rme12.every(x => x === 294 || x === 252));
  }
});
