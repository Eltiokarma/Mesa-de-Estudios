// Pruebas del generador «Condensadores en fila y en paralelo»: casos.json (calculados aparte),
// papel.json y un recálculo independiente en cada uno de 600 problemas.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador, topeEscala } = require('../../nucleo/probar-generador.js');

// Camino independiente: no se usan las reglas de serie y paralelo. Cada arreglo es una red de
// condensadores entre nodos; se fija el nodo 0 a V y el nodo 1 a 0, se resuelven los potenciales de
// los nodos internos con la conservación de la carga (la suma de C·ΔV en cada nodo interno es cero,
// eliminación de Gauss) y la capacidad equivalente es la carga que sale del nodo 0 dividida entre V.
function resolver(nodos, ramas, V = 1) {
  const libres = [];
  for (let i = 2; i < nodos; i++) libres.push(i);
  const idx = new Map(libres.map((n, k) => [n, k]));
  const M = libres.map(() => new Array(libres.length + 1).fill(0));
  const fijo = n => (n === 0 ? V : n === 1 ? 0 : null);
  for (const [a, b, c] of ramas) {
    for (const [x, y] of [[a, b], [b, a]]) {
      if (!idx.has(x)) continue;
      const fila = M[idx.get(x)];
      fila[idx.get(x)] += c;
      if (idx.has(y)) fila[idx.get(y)] -= c; else fila[libres.length] += c * fijo(y);
    }
  }
  const n = libres.length;
  for (let i = 0; i < n; i++) {
    let p = i; for (let r = i + 1; r < n; r++) if (Math.abs(M[r][i]) > Math.abs(M[p][i])) p = r;
    [M[i], M[p]] = [M[p], M[i]];
    for (let r = 0; r < n; r++) if (r !== i) { const k = M[r][i] / M[i][i]; for (let j = i; j <= n; j++) M[r][j] -= k * M[i][j]; }
  }
  const pot = new Array(nodos).fill(0); pot[0] = V; pot[1] = 0;
  libres.forEach((nd, k) => { pot[nd] = M[k][n] / M[k][k]; });
  const dv = ramas.map(([a, b]) => pot[a] - pot[b]);
  const carga = ramas.reduce((s, [a, b, c], k) => s + (a === 0 ? c * dv[k] : b === 0 ? -c * dv[k] : 0), 0);
  const energia = ramas.reduce((s, [, , c], k) => s + 0.5 * c * dv[k] ** 2, 0);
  return { ceq: carga / V, dv, energia };
}
// Redes escritas a mano (nodo 0 y nodo 1 son los extremos). c: capacidades en el orden C1, C2, …
const REDES = {
  T1: c => [3, [[0, 2, c[0]], [2, 1, c[1]], [0, 1, c[2]]]],
  T2: c => [3, [[0, 2, c[0]], [0, 2, c[1]], [2, 1, c[2]]]],
  T3: c => [4, [[0, 2, c[0]], [2, 1, c[1]], [0, 3, c[2]], [3, 1, c[3]]]],
  T4: c => [3, [[0, 2, c[0]], [0, 2, c[1]], [2, 1, c[2]], [2, 1, c[3]]]],
  T5: c => [4, [[0, 2, c[0]], [2, 3, c[1]], [0, 3, c[2]], [3, 1, c[3]]]],
  A3a: C => [3, [[0, 2, C], [2, 1, C], [0, 1, C]]],
  A3b: C => [3, [[0, 2, C], [0, 2, C], [2, 1, C]]],
  A4a: C => [3, [[0, 2, C], [0, 2, C], [0, 2, C], [2, 1, C]]],
  A4b: C => [4, [[0, 2, C], [2, 3, C], [3, 1, C], [0, 1, C]]],
  A4c: C => [3, [[0, 2, C], [0, 2, C], [2, 1, C], [0, 1, C]]],
  A4d: C => [4, [[0, 2, C], [2, 3, C], [0, 3, C], [3, 1, C]]],
};
const red = (id, c, V) => { const [n, r] = REDES[id](c); return resolver(n, r, V); };
const cadena = (cs, V) => resolver(cs.length + 1, cs.map((c, i) => [i === 0 ? 0 : i + 1, i === cs.length - 1 ? 1 : i + 2, c]), V);
const paralelo = (cs, V) => resolver(2, cs.map(c => [0, 1, c]), V);
function biseccion(g, a, b) {
  let ga = g(a);
  for (let i = 0; i < 300; i++) { const m = (a + b) / 2, gm = g(m); if ((gm > 0) === (ga > 0)) { a = m; ga = gm; } else b = m; }
  return (a + b) / 2;
}
const EPS = 8.85e-12;
// Condensador plano por Gauss: con una carga cualquiera, σ = Q/A, E = σ/ε0, V = E·d y C = Q/V.
const gauss = (A, d) => { const Q = 1e-9, E = Q / A / EPS; return Q / (E * d); };

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'equivalente' && d.sub === 'mixta') return red(d.forma, d.c).ceq;
  if (d.tipo === 'equivalente' && d.sub === 'incognita') {
    const con = x => { const c = d.conocidos.slice(); c.splice(d.pos, 0, x); return red(d.forma, c).ceq - d.ceq; };
    return biseccion(con, 1e-4, 1e4);
  }
  if (d.tipo === 'equivalente') return red(d.arreglo, d.cp / Number(d.arreglo[1])).ceq;
  if (d.tipo === 'n-iguales' && d.sub === 'veces') {
    const cs = new Array(d.n).fill(d.c);
    return paralelo(cs, d.v).energia / cadena(cs, d.v).energia;
  }
  if (d.tipo === 'n-iguales') {
    for (let n = 1; n <= 30; n++) {
      const cs = new Array(n).fill(d.c);
      if (Math.abs(paralelo(cs, 1).energia / cadena(cs, 1).energia - d.razon) < 1e-9) return cadena(cs, 1).ceq;
    }
    return NaN;
  }
  if (d.sub === 'serie-voltaje') return cadena(d.c, d.v).dv[d.i];
  if (d.sub === 'mixta-carga') { const r = red('T2', d.c, d.v); return d.c[0] * r.dv[0]; }
  if (d.sub === 'basica') {
    // Trabajo para subir la carga de C·V1 a C·V2: ∫ V dq con V = q/C (regla del trapecio, exacta para una recta).
    const C = d.c * 1e-6, q1 = C * d.v1, q2 = C * d.v2;
    return (q2 - q1) * (q1 / C + q2 / C) / 2 * (d.unidad === 'J' ? 1 : 1e3);
  }
  if (d.sub === 'serie-paralelo') {
    const Us = cadena(d.c, d.v1).energia;
    return biseccion(V => paralelo(d.c, V).energia - Us, 0, d.v1);
  }
  if (d.sub === 'eficiencia') return biseccion(C => d.eta / 100 * paralelo([C * 1e-6], d.v).energia - d.luz, 0, 1e5);
  if (d.sub === 'capacidad') return gauss(d.a * 1e-4, d.d * 1e-3) * 1e12;
  // cambio: unas placas de 1 m² con la separación que da C0; luego se cambian área y separación.
  const d0 = EPS * 1 / (d.c0 * 1e-12);
  return gauss(d.fA, d0 * d.kd) * 1e12;
}
probarGenerador(gen, { semillas: 600, recalcular: p => {
  const r = recalcular(p);
  return Math.abs(r - p.respuesta.valor) < 1e-6 * Math.max(1, Math.abs(r)) ? p.respuesta.valor : r;
} });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia * Math.max(1, Math.abs(c.esperado.respuesta)), `da ${p.respuesta.valor}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

test('salen todos los tipos y subtipos; las alternativas llevan la misma unidad', () => {
  const vistos = new Set();
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    vistos.add(d.tipo + '/' + d.sub);
    const unidad = a => a.texto.replace(/^[−\d ,/]+/, '');
    assert.equal(new Set(p.alternativas.map(unidad)).size, 1, `semilla ${s}: unidades distintas (${p.alternativas.map(a => a.texto)})`);
    for (const a of p.alternativas) assert.ok(!/\d,\d{3}/.test(a.texto), `semilla ${s}: más de dos decimales (${a.texto})`);
  }
  assert.deepEqual([...vistos].sort(), ['carga-voltaje/mixta-carga', 'carga-voltaje/serie-voltaje', 'energia/basica', 'energia/eficiencia', 'energia/serie-paralelo',
    'equivalente/iguales', 'equivalente/incognita', 'equivalente/mixta', 'n-iguales/serie-eq', 'n-iguales/veces', 'plano/cambio', 'plano/capacidad']);
});

test('sin distractores absurdos ni correcta reconocible por redonda (600 semillas)', () => {
  const dec = t => { const m = t.match(/,(\d+)/); return m ? m[1].length : 0; };
  let redonda = 0;
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), c = p.respuesta.valor;
    for (const a of p.alternativas) if (!a.correcta && a.valor !== 0) {
      const r = Math.abs(a.valor / c);
      assert.ok(r <= topeEscala(a) && r >= 1 / topeEscala(a), `semilla ${s}: ${a.texto} es ${r} veces la correcta`);
    }
    const ct = p.alternativas.find(a => a.correcta).texto;
    if (p.alternativas.filter(a => !a.correcta).every(a => dec(a.texto) > dec(ct))) redonda++;
  }
  assert.ok(redonda <= 30, `la correcta es la única redonda en ${redonda} de 600`);
});

test('la trampa principal (CAP-como-resistencia) sale a menudo', () => {
  let n = 0;
  for (let s = 0; s < 600; s++) if (gen.generar(s).alternativas.some(a => a.error && a.error.id === 'CAP-como-resistencia')) n++;
  assert.ok(n > 150, `solo en ${n} de 600`);
});

test('los textos no dicen «de el» ni «a el»; la pregunta no da la respuesta', () => {
  const plano = seg => seg.map(x => (typeof x === 'string' ? x : x.t)).join('');
  for (let s = 0; s < 1000; s++) {
    const p = gen.generar(s);
    const todo = [plano(p.enunciado), plano(p.pregunta), ...p.solucion.map(plano), ...p.alternativas.filter(a => a.error).map(a => a.error.explicacion)].join(' ');
    assert.ok(!/\b[Dd]e el\b|\b[Aa] el\b/.test(todo), `semilla ${s}`);
    const correcta = p.alternativas.find(a => a.correcta).texto;
    assert.ok(!plano(p.pregunta).includes(correcta), `semilla ${s}: la pregunta trae «${correcta}»`);
  }
});

// ---------- papel.json: estructura y recálculo con funciones propias del test ----------
const VERIFICAR = {
  serie: cs => cadena(cs, 1).ceq,
  paralelo: cs => paralelo(cs, 1).ceq,
  red: (id, c) => red(id, c).ceq,
  'voltaje-serie': (cs, V, i) => cadena(cs, V).dv[i],
  'energia-uJ': (C, V) => paralelo([C], V).energia,
  'plano-pF': (Acm2, dmm) => gauss(Acm2 * 1e-4, dmm * 1e-3) * 1e12,
  'capacidad-flash-uF': (luz, eta, V) => biseccion(C => eta * paralelo([C * 1e-6], V).energia - luz, 0, 1e6),
  'razon-energias': n => { const cs = new Array(n).fill(1); return paralelo(cs, 1).energia / cadena(cs, 1).energia; },
};
test('papel.json: de 5 a 10 problemas propios, bien armados y verificados', () => {
  assert.ok(papel.titulo && papel.indicacion);
  const ps = papel.problemas;
  assert.ok(ps.length >= 5 && ps.length <= 10, `${ps.length} problemas`);
  assert.equal(new Set(ps.map(p => p.id)).size, ps.length, 'ids repetidos');
  for (const p of ps) {
    for (const campo of ['id', 'nivel', 'enunciado', 'respuesta']) assert.ok(typeof p[campo] === 'string' && p[campo].length, `${p.id}: falta ${campo}`);
    assert.ok(Array.isArray(p.pasos) && p.pasos.length >= 2, `${p.id}: pasos`);
    assert.ok(Array.isArray(p.verificar) && p.verificar.length >= 1, `${p.id}: verificar`);
    const textos = [p.enunciado, p.respuesta, ...p.pasos].join(' ');
    assert.ok(!/<[a-z\/][^>]*>/i.test(textos), `${p.id}: trae HTML`);
    for (const ver of p.verificar) {
      assert.ok(VERIFICAR[ver.tipo], `${p.id}: tipo desconocido ${ver.tipo}`);
      const r = VERIFICAR[ver.tipo](...ver.args);
      assert.ok(Math.abs(r - ver.espera) < 1e-6 * Math.max(1, Math.abs(ver.espera)), `${p.id}: ${ver.tipo} da ${r}, se esperaba ${ver.espera}`);
    }
  }
});
