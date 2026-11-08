// Pruebas del generador de configuración y ubicación (hasta Z = 86): casos.json (verificados aparte, a ciegas),
// papel.json y un recálculo independiente en cada uno de 600 problemas.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// ---------- Camino independiente ----------
// La configuración se arma con el diagrama de Möller escrito a mano como texto (no con la regla n + ℓ), las
// anomalías se aplican copiando su capa de valencia de una tabla, y el periodo y el grupo salen de la forma de
// la tabla (en qué fila empieza cada periodo y cuántas casillas tiene), no de la configuración.
const DIAGONALES = '1s 2s 2p 3s 3p 4s 3d 4p 5s 4d 5p 6s 4f 5d 6p 7s'.split(' ');
const CAP = { s: 2, p: 6, d: 10, f: 14 };
const L = { s: 0, p: 1, d: 2, f: 3 };
const ANOMALAS = { 24: { '4s': 1, '3d': 5 }, 29: { '4s': 1, '3d': 10 }, 42: { '5s': 1, '4d': 5 }, 47: { '5s': 1, '4d': 10 }, 79: { '6s': 1, '5d': 10 } };
function llenar(e) {
  const m = new Map();
  for (const sub of DIAGONALES) { if (e === 0) break; const k = Math.min(CAP[sub[1]], e); m.set(sub, k); e -= k; }
  return m;
}
function atomo(Z) { const m = llenar(Z); if (ANOMALAS[Z]) for (const [s, k] of Object.entries(ANOMALAS[Z])) m.set(s, k); return m; }
function ion(Z, q) {
  const m = atomo(Z);
  if (q > 0) for (let i = 0; i < q; i++) {
    // el de más afuera: mayor n; a igual n, mayor ℓ
    const sub = [...m.keys()].filter(s => m.get(s) > 0).sort((a, b) => (+b[0] - +a[0]) || (L[b[1]] - L[a[1]]))[0];
    m.set(sub, m.get(sub) - 1);
  }
  if (q < 0) for (let i = 0; i < -q; i++) {
    const sub = DIAGONALES.find(s => (m.get(s) || 0) < CAP[s[1]]);
    m.set(sub, (m.get(sub) || 0) + 1);
  }
  return m;
}
const escribir = m => DIAGONALES.filter(s => m.get(s) > 0).map(s => s + m.get(s));
function abreviada(m) {
  const lista = escribir(m), total = [...m.values()].reduce((a, b) => a + b, 0);
  const gases = [[86, 'Rn'], [54, 'Xe'], [36, 'Kr'], [18, 'Ar'], [10, 'Ne'], [2, 'He']];
  for (const [g, sim] of gases) {
    if (g >= total) continue;
    const nucleo = escribir(llenar(g));
    if (nucleo.every(x => lista.includes(x))) return `[${sim}] ` + lista.filter(x => !nucleo.includes(x)).join(' ');
  }
  return lista.join(' ');
}
// La forma de la tabla: el primer Z de cada periodo y, para cada Z, su columna (sin lantánidos).
const INICIO = [1, 3, 11, 19, 37, 55, 87];
function lugar(Z) {
  const per = INICIO.filter(z => z <= Z).length, pos = Z - INICIO[per - 1];
  if (per === 1) return { per, gr: Z === 1 ? 1 : 18 };
  if (per <= 3) return { per, gr: pos < 2 ? pos + 1 : pos + 11 };
  if (per <= 5) return { per, gr: pos + 1 };
  if (Z <= 56) return { per, gr: pos + 1 };
  assert.ok(Z >= 72, `Z = ${Z} es lantánido`);
  return { per, gr: Z - 68 };
}
// Desapareados y último electrón dibujando las cajas, flecha por flecha.
function cajas(sub, e) {
  const k = 2 * L[sub[1]] + 1, c = Array.from({ length: k }, () => []);
  let ultimo;
  for (let i = 0; i < e; i++) { const caja = i < k ? i : i - k; c[caja].push(i < k ? '+' : '-'); ultimo = { caja, ms: i < k ? '+' : '-' }; }
  return { c, ultimo };
}
const desapareados = m => [...m.entries()].reduce((t, [s, e]) => t + cajas(s, e).c.filter(x => x.length === 1).length, 0);
// Vida media: se simula la muestra partiéndola por la mitad.
function partir(m0, T, t) { let m = m0; for (let x = T; x <= t + 1e-9; x += T) m /= 2; return m; }

function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'ubicar': { const u = lugar(d.Z); return `ub:${u.per}:${u.gr}`; }
    case 'familia': {
      const buenos = d.pares.filter(([a, b]) => lugar(a).gr === lugar(b).gr);
      assert.equal(buenos.length, 1, `familia: ${JSON.stringify(d.pares)}`);
      return `fam:${buenos[0][0]}-${buenos[0][1]}`;
    }
    case 'cation': case 'anion': case 'anomala': return 'conf:' + abreviada(ion(d.Z, d.carga || 0));
    case 'desapareados': return desapareados(ion(d.Z, d.carga));
    case 'cuanticos': {
      const lista = escribir(atomo(d.Z)), ult = lista[lista.length - 1], sub = ult.slice(0, 2), e = +ult.slice(2);
      const l = L[sub[1]], { ultimo } = cajas(sub, e);
      return `qn:${sub[0]}:${l}:${ultimo.caja - l}:${ultimo.ms}`;
    }
    case 'contar': return [...atomo(d.Z).entries()].filter(([s]) => L[s[1]] === d.l).reduce((t, [, e]) => t + e, 0);
    case 'particulas': return `part:${d.A - d.Z}:${d.Z - d.carga}`;
    case 'atomo-ion': { const m = ion(d.Z, d.carga); return `ion:${d.Z - d.carga}|${escribir(m).join(' ')}`; }
    case 'vida-media': {
      if (d.sub === 'queda') return partir(d.m0, d.T, d.t);
      if (d.sub === 'tiempo') { let t = 0, m = d.m0; const meta = d.m0 / 2 ** d.n; while (m > meta + 1e-12) { m /= 2; t += d.T; } return t; }
      // lectura: la vida media T que hace caer A0 a A1 en t1 y A1 a A2 en t2 − t1, buscada entre t1/1 … t1/10
      for (let k = 1; k <= 10; k++) {
        const T = d.t1 / k;
        if (Math.abs(partir(d.A0, T, d.t1) - d.A1) < 1e-9 && Math.abs(partir(d.A1, T, d.t2 - d.t1) - d.A2) < 1e-9) return T;
      }
      return NaN;
    }
  }
  throw new Error('tipo desconocido: ' + d.tipo);
}
const igual = (a, b) => typeof a === 'number' ? Math.abs(a - b) < 1e-9 : a === b;
probarGenerador(gen, { semillas: 600, recalcular, igual });

// ---------- casos.json ----------
for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla} (${c.entrada.tipo})`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    if (typeof c.esperado.respuesta === 'number') assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
    else assert.equal(p.respuesta.valor, c.esperado.respuesta);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

// ---------- Más comprobaciones ----------
test('salen todos los tipos y subtipos', () => {
  const vistos = new Set();
  for (let s = 0; s < 600; s++) { const d = gen.generar(s)._datos; vistos.add(d.tipo + (d.sub ? '/' + d.sub : '')); }
  assert.deepEqual([...vistos].sort(), ['anion', 'anomala', 'atomo-ion', 'cation', 'contar', 'cuanticos', 'desapareados', 'familia',
    'particulas', 'ubicar', 'vida-media/lectura', 'vida-media/queda', 'vida-media/tiempo']);
});

test('en las preguntas de configuración no entran Nb, Ru, Rh, Pd, Pt ni lantánidos; en ubicar, solo Z > 36', () => {
  for (let s = 0; s < 1500; s++) {
    const d = gen.generar(s)._datos;
    if (['cation', 'anion', 'desapareados', 'anomala', 'cuanticos', 'contar'].includes(d.tipo)) assert.ok(gen.conConfig(d.Z), `semilla ${s}: Z = ${d.Z}`);
    if (d.tipo === 'ubicar') assert.ok(d.Z > 36 && !(d.Z >= 57 && d.Z <= 71), `semilla ${s}`);
  }
});

test('la trampa del periodo y la del 3d antes que el 4s aparecen seguido', () => {
  let periodo = 0, tresD = 0;
  for (let s = 0; s < 1500; s++) {
    const ids = gen.generar(s).alternativas.map(a => a.error && a.error.id);
    if (ids.includes('QA-periodo-del-ultimo-subnivel')) periodo++;
    if (ids.includes('QA-ion-quita-ultimos-llenados')) tresD++;
  }
  assert.ok(periodo > 30 && tresD > 30, `periodo ${periodo}, 3d ${tresD}`);
});

test('ejemplos de la cabecera y del informe', () => {
  assert.equal(gen.configuracion(26, 3).abreviada, '[Ar] 3d5');
  assert.equal(gen.configuracion(29, 1).abreviada, '[Ar] 3d10');
  assert.equal(gen.configuracion(79).abreviada, '[Xe] 6s1 4f14 5d10');
  assert.equal(gen.configuracion(53, -1).abreviada, '[Kr] 5s2 4d10 5p6');
  assert.equal(gen.configuracion(82, 4).abreviada, '[Xe] 4f14 5d10');
  assert.equal(gen.configuracion(28).desapareados, 2);
  assert.deepEqual(gen.ubicacion(53), { periodo: 5, grupo: 17, grupoAB: 'VIIA', bloque: 'p' });
  assert.deepEqual(gen.ubicacion(79), { periodo: 6, grupo: 11, grupoAB: 'IB', bloque: 'd' });
  const u = gen.ultimoElectron(26); assert.deepEqual([u.n, u.l, u.ml, u.ms], [3, 2, -2, -0.5]);
});

test('el recálculo independiente coincide con el generador para todo Z de 1 a 86 sin lantánidos', () => {
  for (let Z = 1; Z <= 86; Z++) {
    if (Z >= 57 && Z <= 71) continue;
    assert.equal(gen.configuracion(Z).abreviada, abreviada(atomo(Z)), `Z = ${Z}`);
    const u = gen.ubicacion(Z), w = lugar(Z);
    assert.deepEqual([u.periodo, u.grupo], [w.per, w.gr], `Z = ${Z}`);
  }
});

// ---------- papel.json ----------
test('papel.json: de 5 a 10 problemas con respuesta, pasos y verificación, sin punto decimal', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  const ids = new Set();
  for (const q of papel.problemas) {
    assert.ok(q.id && !ids.has(q.id)); ids.add(q.id);
    assert.ok(q.enunciado && q.respuesta && q.pasos.length && q.verificar.length, q.id);
    assert.ok(!/\d\.\d/.test(q.enunciado + q.respuesta + q.pasos.join('')), `${q.id}: coma decimal`);
  }
});
for (const q of papel.problemas) test(`papel ${q.id}`, () => {
  for (const { fn, args, espera } of q.verificar) {
    const r = gen[fn](...args);
    for (const [k, val] of Object.entries(typeof espera === 'object' ? espera : { valor: espera })) {
      const real = typeof espera === 'object' ? r[k] : r;
      if (typeof val === 'number') assert.ok(Math.abs(real - val) < 1e-9, `${q.id} ${fn}.${k}: ${real} ≠ ${val}`);
      else assert.deepEqual(real, val, `${q.id} ${fn}.${k}`);
    }
  }
});
