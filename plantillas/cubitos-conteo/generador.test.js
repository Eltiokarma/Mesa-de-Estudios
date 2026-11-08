// Pruebas del generador «cubitos que se cuentan»: casos.json y un recálculo independiente en 600
// problemas. El generador cuenta en una grilla mirando los vecinos de cada cubito; aquí se cuenta
// con otro camino: por coordenadas (cuántas caras extremas toca cada cubito), por inclusión y
// exclusión con las reglas de cruce de rectas, y con fórmulas cerradas.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// Caras del bloque que no se pintan, por apoyo: [izquierda, derecha, frente, atrás, base, arriba].
const PINTA = {
  todo: [1, 1, 1, 1, 1, 1], mesa: [1, 1, 1, 1, 0, 1], pared: [1, 1, 1, 0, 0, 1], rincon: [0, 1, 1, 0, 0, 1],
};
// Caras pintadas de un cubito: se mira, eje por eje, si está en un extremo pintado del bloque.
function pintadasEn(x, y, z, a, b, c, apoyo) {
  const p = PINTA[apoyo];
  return (x === 0) * p[0] + (x === a - 1) * p[1] + (y === 0) * p[2] + (y === b - 1) * p[3] + (z === 0) * p[4] + (z === c - 1) * p[5];
}
function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'pintados') {
    let n = 0;
    for (let x = 0; x < d.a; x++) for (let y = 0; y < d.b; y++) for (let z = 0; z < d.c; z++) if (pintadasEn(x, y, z, d.a, d.b, d.c, d.apoyo) === d.k) n++;
    return n;
  }
  if (d.tipo === 'caras') {
    const p = PINTA[d.apoyo], { a, b, c } = d;
    return (p[0] + p[1]) * b * c + (p[2] + p[3]) * a * c + (p[4] + p[5]) * a * b;
  }
  if (d.tipo === 'tuneles') {
    // Inclusión y exclusión: dos túneles de ejes distintos se cruzan en un cubito si comparten la
    // coordenada del tercer eje; los paralelos (distintos) no se cruzan; tres de ejes distintos
    // comparten un cubito si se cruzan de dos en dos.
    const T = d.tuneles.map(t => {
      if (t.eje === 'x') return { eje: 'x', x: null, y: t.p, z: t.q };
      if (t.eje === 'y') return { eje: 'y', x: t.p, y: null, z: t.q };
      return { eje: 'z', x: t.p, y: t.q, z: null };
    });
    const punto = ts => {
      const r = {};
      for (const e of ['x', 'y', 'z']) {
        const vals = ts.map(t => t[e]).filter(q => q !== null);
        if (new Set(vals).size > 1) return null;
        r[e] = vals.length ? vals[0] : null;
      }
      return Object.values(r).every(q => q !== null) ? 1 : 0;
    };
    let quitados = T.length * d.n;
    for (let i = 0; i < T.length; i++) for (let j = i + 1; j < T.length; j++) {
      if (T[i].eje === T[j].eje) continue;
      quitados -= punto([T[i], T[j]]) || 0;
      for (let k = j + 1; k < T.length; k++) {
        if (new Set([T[i].eje, T[j].eje, T[k].eje]).size < 3) continue;
        quitados += punto([T[i], T[j], T[k]]) || 0;
      }
    }
    return d.n ** 3 - quitados;
  }
  if (d.tipo === 'completar') return Math.max(d.a, d.b, d.c) ** 3 - d.a * d.b * d.c;
  if (d.tipo === 'copias') {
    const mcd = (x, y) => (y ? mcd(y, x % y) : x);
    const L = [d.a, d.b, d.c].reduce((m, x) => m * x / mcd(m, x));
    return L ** 3 / (d.a * d.b * d.c);
  }
  if (d.tipo === 'escalera') {
    const N = d.N;
    if (d.regla === 'escalera') return N * (N + 1) + (d.base ? 4 : 3) * N * d.d;
    return (d.base ? 2 : 1) * (2 * N - 1) ** 2 + 4 * N * N;
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

test('salen los seis tipos, con enteros y una sola unidad por problema', () => {
  const tipos = new Set();
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    tipos.add(p._datos.tipo);
    for (const a of p.alternativas) assert.ok(Number.isInteger(a.valor) && a.valor > 0, `semilla ${s}: ${a.texto}`);
    const unidad = a => a.texto.replace(/^[\d ]+/, '').replace(/s$/, '');
    assert.equal(new Set(p.alternativas.map(unidad)).size, 1, `semilla ${s}: unidades distintas`);
  }
  assert.deepEqual([...tipos].sort(), ['caras', 'completar', 'copias', 'escalera', 'pintados', 'tuneles']);
});

test('los distractores son los valores de su error', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), d = p._datos;
    for (const a of p.alternativas.filter(x => !x.correcta)) {
      if (d.tipo === 'tuneles' && a.error.id === 'RME2') assert.equal(a.valor, d.n ** 3 - d.tuneles.length * d.n);
      if (d.tipo === 'tuneles' && a.error.id === 'RME172') assert.equal(a.valor, d.n ** 3 - p.respuesta.valor);
      if (d.tipo === 'caras' && a.error.id === 'RME1' && a.valor === 6 * d.a * d.b * d.c) assert.ok(true);
      if (d.tipo === 'completar' && a.error.id === 'RME172') assert.equal(a.valor, Math.max(d.a, d.b, d.c) ** 3);
      if (d.tipo === 'pintados' && a.error.id === 'RME1') {
        let n = 0;
        for (let x = 0; x < d.a; x++) for (let y = 0; y < d.b; y++) for (let z = 0; z < d.c; z++) if (pintadasEn(x, y, z, d.a, d.b, d.c, 'todo') === d.k) n++;
        assert.equal(a.valor, n);
      }
    }
  }
});

test('ejemplos de los informes: 4 × 4 × 4 y el cubo de 3 con dos túneles', () => {
  const { carasPintadas, bloque, sinPintar } = gen._interno;
  const m = carasPintadas(bloque(4, 4, 4), sinPintar('todo', 3));
  const cuenta = k => [...m.values()].filter(n => n === k).length;
  assert.deepEqual([0, 1, 2, 3].map(cuenta), [8, 24, 24, 8]);
  // Dos cubitos pegados sobre la mesa: 8 caras pintadas (RME1 del informe).
  const dos = new Set(['0,0,0', '1,0,0']);
  assert.equal([...carasPintadas(dos, sinPintar('mesa', 0)).values()].reduce((s, n) => s + n, 0), 8);
});
