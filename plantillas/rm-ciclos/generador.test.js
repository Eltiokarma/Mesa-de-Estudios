// Pruebas del generador «Lo que se repite»: las comunes (600 problemas) con un recálculo independiente
// por simulación paso a paso (minuto a minuto, marca a marca, jugada a jugada, cifra a cifra, casilla a
// casilla), casos.json (verificados aparte, a ciegas), papel.json y propiedades de cada tipo.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// Espiral recorrida casilla por casilla: derecha 1, arriba 1, izquierda 2, abajo 2, derecha 3, …
function espiral(hasta) {
  const pos = [[0, 0]], dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  let x = 0, y = 0, d = 0, largo = 1;
  while (pos.length < hasta) {
    for (let rep = 0; rep < 2 && pos.length < hasta; rep++) {
      for (let i = 0; i < largo && pos.length < hasta; i++) { x += dirs[d][0]; y += dirs[d][1]; pos.push([x, y]); }
      d = (d + 1) % 4;
    }
    largo++;
  }
  return pos; // pos[n − 1] es la casilla del número n
}

function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'canciones': {
      let i = d.s, t = d.m;
      for (let min = 0; min < d.T; min++) { t++; if (t === d.dur[i]) { i = (i + 1) % d.dur.length; t = 0; } }
      return d.nombres[i];
    }
    case 'pista': {
      let m = d.s;
      for (let i = 0; i < d.k; i++) m = d.sentido === 'horario' ? (m === d.n ? 1 : m + 1) : (m === 1 ? d.n : m - 1);
      return m;
    }
    case 'fichas': {
      let A = d.a, B = d.b;
      const mover = (x, paso, sentido) => { for (let i = 0; i < paso; i++) x = sentido > 0 ? (x === d.n ? 1 : x + 1) : (x === 1 ? d.n : x - 1); return x; };
      for (let t = 1; t < 1000; t++) { A = mover(A, d.p, 1); B = mover(B, d.q, d.mismo ? 1 : -1); if (A === B) return t; }
      return NaN;
    }
    case 'bloque': {
      let s = d.pre; const largo = Math.max(d.k, d.D) + 2;
      while (s.length < largo) s += d.bloque;
      if (d.pide === 'cifra') return Number(s[d.k - 1]);
      const n = s.slice(0, d.D);
      if (d.pide === 'suma') return [...n].reduce((a, c) => a + Number(c), 0);
      return Number(n.slice(-2));
    }
    case 'unidades': {
      const t = d.regla === 'producto' ? [d.u1, d.u2] : [d.u1];
      while (t.length < d.N) t.push(d.regla === 'producto' ? (t[t.length - 1] * t[t.length - 2]) % 10 : (d.c1 * t[t.length - 1] + d.c0) % 10);
      return t[d.N - 1];
    }
    case 'figuras': {
      const V = d.forma === 'cuadrado' ? 4 : 6;
      let pt = d.p0, fl = d.d0;
      for (let i = 1; i < d.N; i++) {
        for (let j = 0; j < Math.abs(d.sp); j++) pt = d.sp > 0 ? (pt + 1) % V : (pt + V - 1) % V;
        for (let j = 0; j < d.giro; j++) fl = d.sd > 0 ? (fl + 1) % 8 : (fl + 7) % 8;
      }
      return `p${pt}f${fl}`;
    }
    case 'espiral': {
      if (d.pide === 'rayo') {
        const [dx, dy] = d.rayo, obj = `${dx * d.m},${dy * d.m}`;
        const pos = espiral((2 * d.m + 1) ** 2);
        return pos.findIndex(([x, y]) => `${x},${y}` === obj) + 1;
      }
      const sombra = new Set(espiral(d.N).map(([x, y]) => `${x},${y}`));
      let per = 0;
      for (const c of sombra) { const [x, y] = c.split(',').map(Number); for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (!sombra.has(`${x + a},${y + b}`)) per++; }
      return per;
    }
    case 'avance': {
      if (d.pide === 'dias') {
        let alt = 0;
        for (let dia = 1; dia < 1000; dia++) { alt += d.a; if (alt >= d.H) return dia; alt -= d.b; }
        return NaN;
      }
      let alt = 0;
      for (let min = 1; min < 100000; min++) {
        const enLaHora = (min - 1) % 60;
        if (enLaHora < d.t1) { alt += d.a / d.t1; if (alt >= d.H - 1e-9) return min; }
        if (enLaHora === 59) alt -= d.b;
      }
      return NaN;
    }
  }
  throw new Error('tipo sin recálculo: ' + d.tipo);
}
const igual = (a, b) => (typeof a === 'string' || typeof b === 'string' ? a === b : Math.abs(a - b) < 1e-9);
probarGenerador(gen, { semillas: 600, recalcular, igual });

const TIPOS = ['canciones', 'pista', 'fichas', 'bloque', 'unidades', 'figuras', 'espiral', 'avance'];
test('salen los ocho tipos en 200 semillas', () => {
  const vistos = new Set(); for (let s = 0; s < 200; s++) vistos.add(gen.generar(s)._datos.tipo);
  assert.deepEqual([...vistos].sort(), [...TIPOS].sort());
});

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(igual(p.respuesta.valor, c.esperado.respuesta));
    assert.ok(igual(gen.calc.resolver(c.entrada), c.esperado.respuesta));
  });
}
test('casos.json: dos por tipo y las seis semillas de las pruebas', () => {
  for (const t of TIPOS) assert.ok(casos.casos.filter(c => c.entrada.tipo === t).length >= 2, t);
  for (const s of ['entrada-1', 'entrada-2', 'entrada-3', 'salida-1', 'salida-2', 'salida-3']) assert.ok(casos.casos.some(c => c.semilla === s), s);
});

test('papel.json: formato', () => {
  assert.ok(papel.titulo && papel.problemas.length >= 5 && papel.problemas.length <= 10);
  for (const q of papel.problemas) assert.ok(q.id && q.enunciado && q.respuesta && q.pasos.length && q.verificar.length, q.id);
});
for (const q of papel.problemas) test(`papel ${q.id}`, () => {
  for (const vv of q.verificar) {
    const r = gen.calc[vv.fn](...vv.args);
    assert.ok(igual(r, vv.espera), `${q.id}: ${vv.fn} da ${r}, se esperaba ${vv.espera}`);
    if (vv.fn === 'resolver') assert.ok(igual(recalcular({ _datos: vv.args[0] }), vv.espera), `${q.id}: la simulación no coincide`);
  }
});

test('canciones: el instante pedido nunca cae justo en un cambio de canción', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.tipo !== 'canciones') continue;
    const C = d.dur.reduce((a, b) => a + b, 0);
    const pos = (d.dur.slice(0, d.s).reduce((a, b) => a + b, 0) + d.m + d.T) % C;
    let acc = 0; for (const x of d.dur) { assert.notEqual(pos, acc, `semilla ${s}`); acc += x; }
  }
});

test('fichas: la jugada pedida es la primera coincidencia (ninguna antes)', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.tipo !== 'fichas') continue;
    for (let t = 1; t < p.respuesta.valor; t++) assert.notEqual(((d.a - 1 + d.p * t) % d.n + d.n) % d.n, ((d.b - 1 + (d.mismo ? 1 : -1) * d.q * t) % d.n + d.n) % d.n, `semilla ${s}, jugada ${t}`);
  }
});

test('espiral: numeroEn y posicionDe son inversas y coinciden con el recorrido', () => {
  const pos = espiral(500);
  for (let n = 1; n <= 500; n++) {
    assert.deepEqual(gen.calc.posicionDe(n), pos[n - 1], `n = ${n}`);
    assert.equal(gen.calc.numeroEn(...pos[n - 1]), n);
  }
});

test('unidades: siempre hay preperíodo y el período es corto', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.tipo !== 'unidades') continue;
    const c = gen.calc.cicloUnidades(d);
    assert.ok(c.pre >= 1 && c.periodo >= 2 && c.periodo <= 6, `semilla ${s}`);
  }
});

test('figuras: la figura no revela la respuesta (muestra solo las 4 primeras) y el alt las describe', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    if (p._datos.tipo !== 'figuras') continue;
    for (let i = 1; i <= 4; i++) assert.ok(p.figura.alt.includes(`Figura ${i}:`), `semilla ${s}`);
    assert.ok(p._datos.N >= 20);
  }
});
