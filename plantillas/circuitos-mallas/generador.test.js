// Pruebas del generador «Dos pilas y una malla»: casos.json (calculados aparte), un recálculo
// independiente en 600 problemas con el motor nodal de plantillas/circuitos-cc/ (eliminación de
// Gauss sobre el circuito armado rama por rama, no las fórmulas del generador) y papel.json.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const motor = require('../circuitos-cc/motor.js');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// ---- Circuitos para el motor ----
// Rama k de kirchhoff: pila con su resistencia como resistencia interna, del borne − al +.
function redKirchhoff(e, R) {
  const ramas = e.map((ek, k) => (ek === 0
    ? { id: 'k' + k, tipo: 'resistencia', a: 'A', b: 'B', R: R[k] }
    : ek > 0 ? { id: 'k' + k, tipo: 'pila', a: 'B', b: 'A', fem: ek, r: R[k] }
      : { id: 'k' + k, tipo: 'pila', a: 'A', b: 'B', fem: -ek, r: R[k] }));
  return { tierra: 'B', ramas };
}
// Corriente que sube por la rama k hacia A (de B a A).
function sube(sol, e, k) {
  const I = sol.ramas['k' + k].I; // de a hacia b
  return e[k] > 0 ? I : -I; // con e = 0 o e < 0 la rama va de A a B
}
// Resistencia vista entre A y B: pila de 1 V y R = 1/I.
function req(ramas) {
  const s = motor.resolver({ tierra: 'B', ramas: [{ id: 'p', tipo: 'pila', a: 'B', b: 'A', fem: 1 }, ...ramas] });
  return 1 / s.ramas.p.I;
}
const puenteRamas = (R, central) => [
  { id: 'R1', tipo: 'resistencia', a: 'A', b: 'C', R: R[0] }, { id: 'R2', tipo: 'resistencia', a: 'C', b: 'B', R: R[1] },
  { id: 'R3', tipo: 'resistencia', a: 'A', b: 'D', R: R[2] }, { id: 'R4', tipo: 'resistencia', a: 'D', b: 'B', R: R[3] }, central];
function biseccion(g, a, b) {
  let ga = g(a);
  for (let i = 0; i < 200; i++) { const m = (a + b) / 2, gm = g(m); if ((gm > 0) === (ga > 0)) { a = m; ga = gm; } else b = m; }
  return (a + b) / 2;
}

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'kirchhoff') {
    const sol = motor.resolver(redKirchhoff(d.e, d.R));
    if (d.sub === 'rama' || d.sub === 'tres') return Math.abs(sube(sol, d.e, 1));
    if (d.sub === 'fuente') return Math.abs(sube(sol, d.e, 2));
    if (d.sub === 'potencia') return sol.ramas.k0.fem * sol.ramas.k0.I; // ε1·I1, sin la resistencia
    if (d.sub === 'ddp') return Math.abs(sol.V.A - sol.V.B);
    // fem: la red escondida da las corrientes del enunciado, y ε3 se busca por bisección.
    assert.ok(Math.abs(sube(sol, d.e, 0) - d.I1) < 1e-9 && Math.abs(sube(sol, d.e, 1) - d.I2) < 1e-9, 'el enunciado no calza con la red');
    const s3 = Math.sign(d.e[2]);
    const I2de = E3 => { const e = d.e.slice(); e[2] = s3 * E3; const s = motor.resolver(redKirchhoff(e, d.R)); return sube(s, e, 1) - d.I2; };
    return biseccion(I2de, 0, 200);
  }
  if (d.tipo === 'puente') {
    if (d.sub === 'req') return req(puenteRamas(d.R, { id: 'R5', tipo: 'resistencia', a: 'C', b: 'D', R: d.R5 }));
    if (d.sub === 'corriente') return d.E / req(puenteRamas(d.R, { id: 'R5', tipo: 'resistencia', a: 'C', b: 'D', R: d.R5 }));
    if (d.sub === 'amperimetro') {
      const s = motor.resolver({ tierra: 'B', ramas: [{ id: 'p', tipo: 'pila', a: 'B', b: 'A', fem: d.E }, ...puenteRamas(d.R, { id: 'am', tipo: 'amperimetro', a: 'C', b: 'D' })] });
      return Math.abs(s.ramas.am.lectura);
    }
    const ramas = [{ id: 'R1', tipo: 'resistencia', a: 'A', b: 'C', R: d.R[0] }, { id: 'R2', tipo: 'resistencia', a: 'C', b: 'B', R: d.R[1] },
      { id: 'R3', tipo: 'resistencia', a: 'A', b: 'B', R: d.R[2] }, d.cable === 'CB' ? { id: 'c', tipo: 'cable', a: 'C', b: 'B' } : { id: 'c', tipo: 'cable', a: 'A', b: 'C' }];
    return req(ramas);
  }
  if (d.sub === 'grafica') {
    const [[Ra, Ia], [Rb, Ib]] = d.puntos;
    const r = biseccion(x => Ia * (Ra + x) - Ib * (Rb + x), 0, 100);
    const E = Ia * (Ra + r);
    // La batería hallada, puesta en el motor con el segundo reóstato, debe dar la segunda corriente.
    const s = motor.resolver({ tierra: 'n', ramas: [{ id: 'b', tipo: 'pila', a: 'n', b: 'p', fem: E, r }, { id: 'R', tipo: 'resistencia', a: 'p', b: 'n', R: Rb }] });
    assert.ok(Math.abs(s.ramas.R.I - Ib) < 1e-6);
    return d.pide === 'r' ? r : E;
  }
  // pilas en serie o en paralelo, cada una con su r, y los medidores ideales del motor.
  const ramas = [];
  if (d.sub === 'serie') for (let k = 0; k < d.n; k++) ramas.push({ id: 'p' + k, tipo: 'pila', a: k === 0 ? 'n' : 'm' + k, b: k === d.n - 1 ? 'p' : 'm' + (k + 1), fem: d.E, r: d.r });
  else for (let k = 0; k < d.n; k++) ramas.push({ id: 'p' + k, tipo: 'pila', a: 'n', b: 'p', fem: d.E, r: d.r });
  ramas.push({ id: 'am', tipo: 'amperimetro', a: 'p', b: 'q' }, { id: 'R', tipo: 'resistencia', a: 'q', b: 'n', R: d.R }, { id: 'vm', tipo: 'voltimetro', a: 'p', b: 'n' });
  const s = motor.resolver({ tierra: 'n', ramas });
  return d.medidor === 'A' ? s.ramas.am.lectura : s.ramas.vm.lectura;
}
probarGenerador(gen, { semillas: 600, recalcular: p => {
  const r = recalcular(p);
  return Math.abs(r - p.respuesta.valor) < 1e-6 * Math.max(1, Math.abs(r)) ? p.respuesta.valor : r;
} });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

test('salen todos los tipos y subtipos; las alternativas llevan la misma unidad', () => {
  const vistos = new Set();
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    vistos.add(d.tipo + '/' + d.sub + (d.medidor ? '/' + d.medidor : ''));
    const unidad = a => a.texto.replace(/^[−\d ,]+/, '');
    assert.equal(new Set(p.alternativas.map(unidad)).size, 1, `semilla ${s}: unidades distintas (${p.alternativas.map(a => a.texto)})`);
    assert.ok(p.alternativas.every(a => a.valor > 0), `semilla ${s}: una alternativa no positiva`);
  }
  assert.deepEqual([...vistos].sort(), ['kirchhoff/ddp', 'kirchhoff/fem', 'kirchhoff/fuente', 'kirchhoff/potencia', 'kirchhoff/rama', 'kirchhoff/tres',
    'pilas/grafica', 'pilas/paralelo/A', 'pilas/paralelo/V', 'pilas/serie/A', 'pilas/serie/V', 'puente/amperimetro', 'puente/corriente', 'puente/corto', 'puente/req']);
});

test('en kirchhoff hay pilas en oposición (con el borne + hacia B), y la pregunta no dice la respuesta', () => {
  let opuestas = 0;
  const plano = seg => seg.map(x => (typeof x === 'string' ? x : x.t)).join('');
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.tipo === 'kirchhoff' && d.e.some(x => x < 0)) opuestas++;
    const correcta = p.alternativas.find(a => a.correcta).texto;
    assert.ok(!plano(p.pregunta).includes(correcta), `semilla ${s}`);
  }
  assert.ok(opuestas > 60, `solo ${opuestas} con pilas opuestas`);
});

test('los puentes de «req» y «corriente» están equilibrados; los de «amperimetro», no', () => {
  for (let s = 0; s < 600; s++) {
    const d = gen.generar(s)._datos;
    if (d.tipo !== 'puente' || d.sub === 'corto') continue;
    const eq = Math.abs(d.R[0] * d.R[3] - d.R[1] * d.R[2]) < 1e-9;
    assert.equal(eq, d.sub !== 'amperimetro', `semilla ${s}`);
  }
});

test('los textos no dicen «de el» ni «a el»', () => {
  const plano = seg => seg.map(x => (typeof x === 'string' ? x : x.t)).join('');
  for (let s = 0; s < 1000; s++) {
    const p = gen.generar(s);
    const todo = [plano(p.enunciado), plano(p.pregunta), ...p.solucion.map(plano), ...p.alternativas.filter(a => a.error).map(a => a.error.explicacion)].join(' ');
    assert.ok(!/\b[Dd]e el\b|\b[Aa] el\b/.test(todo), `semilla ${s}`);
  }
});

// ---- papel.json (regla 6): estructura y recálculo propio de cada «verificar» ----
const CALC = {
  // ramas: [[fem con signo (+ hacia A), R], ...]; pide: 'subeK' (corriente que sube por la rama K) o 'VA'.
  kirchhoff: ({ ramas, pide }) => {
    const e = ramas.map(x => x[0]), R = ramas.map(x => x[1]);
    const s = motor.resolver(redKirchhoff(e, R));
    return pide === 'VA' ? s.V.A : sube(s, e, Number(pide.slice(4)));
  },
  puenteReq: ({ R, R5 }) => req(puenteRamas(R, R5 === 0 ? { id: 'c', tipo: 'cable', a: 'C', b: 'D' } : { id: 'R5', tipo: 'resistencia', a: 'C', b: 'D', R: R5 })),
  puenteAmperimetro: ({ R, E }) => {
    const s = motor.resolver({ tierra: 'B', ramas: [{ id: 'p', tipo: 'pila', a: 'B', b: 'A', fem: E }, ...puenteRamas(R, { id: 'am', tipo: 'amperimetro', a: 'C', b: 'D' })] });
    return Math.abs(s.ramas.am.lectura);
  },
  pilasSerie: ({ n, E, r, R }) => (n * E) / (R + n * r),
  pilasParalelo: ({ n, E, r, R }) => E / (R + r / n),
  graficaR: ({ puntos }) => { const [[Ra, Ia], [Rb, Ib]] = puntos; return biseccion(x => Ia * (Ra + x) - Ib * (Rb + x), 0, 100); },
  producto: ({ a, b }) => a * b,
};
test('papel.json: entre 5 y 10 problemas propios, bien armados y sin HTML', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  assert.equal(new Set(papel.problemas.map(p => p.id)).size, papel.problemas.length);
  for (const p of papel.problemas) {
    assert.ok(p.id && p.nivel && p.enunciado && p.respuesta, p.id);
    assert.ok(Array.isArray(p.pasos) && p.pasos.length >= 2, p.id);
    assert.ok(Array.isArray(p.verificar) && p.verificar.length >= 1, p.id);
    for (const t of [p.enunciado, p.respuesta, ...p.pasos]) assert.ok(!/<[a-z/][^>]*>/i.test(t), `${p.id}: HTML`);
  }
});
for (const p of papel.problemas) {
  test(`papel ${p.id}: cada «verificar» coincide con un cálculo propio`, () => {
    for (const v of p.verificar) {
      assert.ok(CALC[v.tipo], `tipo desconocido ${v.tipo}`);
      const r = CALC[v.tipo](v.args);
      assert.ok(Math.abs(r - v.espera) < 1e-6 * Math.max(1, Math.abs(v.espera)), `${p.id}: ${v.tipo} da ${r}, se espera ${v.espera}`);
    }
  });
}
