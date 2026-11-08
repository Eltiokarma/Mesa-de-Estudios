// Pruebas del generador de planteo de situaciones: las comunes (600 problemas con un recálculo
// independiente que sale solo de _datos, por simulación o fuerza bruta), casos.json, papel.json y propiedades.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// Recibe regalos uno por uno: cada vez que el contador de comprados llega a k, uno de regalo.
const recibe = (C, k) => { let r = 0; for (let i = 1; i <= C; i++) if (i % k === 0) r++; return C + r; };

function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'lotes': {
      let c = 0; while (c * d.k + d.s < d.n * d.g) c++;
      return d.pide === 'costo' ? c * d.precio : c;
    }
    case 'promocion': {
      if (d.sub === 'total') return recibe(d.C, d.k);
      if (d.sub === 'dinero') { let C = 0; while ((C + 1) * d.precio <= d.D) C++; return recibe(C, d.k); }
      let C = 0; while (recibe(C, d.k) < d.T) C++; return C;
    }
    case 'canje': return d.C + Math.floor((d.C - 1) / (d.k - 1)); // fórmula cerrada, sin préstamo
    case 'votos': {
      if (d.sub === 'minimo') {
        const V = d.E - d.b;
        for (let x = 1; x <= V; x++) {
          // Se reparte lo que queda entre los otros, a cada uno lo más que puede tener (x − 1).
          let resto = V - x;
          for (let j = 0; j < d.n - 1; j++) resto -= Math.min(x - 1, resto);
          if (resto === 0) return x;
        }
        return NaN;
      }
      const R = d.E - d.votos.reduce((s, x) => s + x, 0);
      if (d.sub === 'pueden') {
        let n = 0;
        d.votos.forEach((_, i) => {
          const w = d.votos.slice(); w[i] += R;
          if (w.filter((x, j) => j !== i).every(x => x < w[i])) n++;
        });
        return n;
      }
      // asegurar: x sirve si ningún rival, recibiendo cualquier y ≤ R − x, alcanza al líder.
      for (let x = 0; x <= R; x++) {
        let ok = true;
        for (let j = 1; j < d.votos.length && ok; j++) for (let y = 0; y <= R - x; y++) if (d.votos[j] + y >= d.votos[0] + x) { ok = false; break; }
        if (ok) return x;
      }
      return NaN;
    }
    case 'progresion': {
      const t = Array.from({ length: d.n }, (_, i) => d.a + i * d.d);
      const max = Math.max(...t), agregado = t.reduce((s, x) => s + (max - x), 0);
      return d.pide === 'agregado' ? agregado : d.pide === 'cada' ? max : d.n * max;
    }
    case 'pista': {
      // Distancias multiplicadas por rel: en cada tic Ana avanza p y Beto q (o −q).
      const rel = d.mismo ? d.p - d.q : d.p + d.q, vuelta = d.L * rel;
      let a = 0, b = 0, n = 0;
      for (let t = 1; t < 1e6; t++) {
        a += d.p; b += d.mismo ? d.q : -d.q;
        if (((a - b) % vuelta + vuelta) % vuelta === 0 && ++n === d.n) return (a / rel) % d.L;
      }
      return NaN;
    }
    case 'diana': {
      // Se busca la combinación α·u1 + β·u2 = u3 y se aplica a los puntajes.
      const [u1, u2, u3] = d.u, pts = d.u.map(u => u[0] * d.w[0] + u[1] * d.w[1] + u[2] * d.w[2]);
      for (let a2 = -8; a2 <= 8; a2++) for (let b2 = -8; b2 <= 8; b2++) {
        if ([0, 1, 2].every(i => 2 * u3[i] === a2 * u1[i] + b2 * u2[i])) return (a2 * pts[0] + b2 * pts[1]) / 2;
      }
      return NaN;
    }
    case 'torneo': {
      const M = d.vueltas * d.n * (d.n - 1) / 2, T = 3 * (M - d.E) + 2 * d.E;
      for (let E = 0; E <= M; E++) if (3 * (M - E) + 2 * E === T) return d.pide === 'empates' ? E : M - E;
      return NaN;
    }
    case 'fichas': return d.caras.flat().reduce((s, x) => s + x, 0);
    case 'cortes': {
      const P = d.q + d.c, V = 4 * d.q + d.delta * d.c;
      for (let q = 1; q <= P; q++) for (let c = 0; c <= q; c++) if (q + c === P && 4 * q + d.delta * c === V) return d.pide === 'cuadrados' ? q : c;
      return NaN;
    }
  }
  return NaN;
}
probarGenerador(gen, { semillas: 600, recalcular });

test('salen todos los tipos (y los tres de votos) en 300 semillas', () => {
  const tipos = new Set(), votos = new Set();
  for (let s = 0; s < 300; s++) { const d = gen.generar(s)._datos; tipos.add(d.tipo); if (d.tipo === 'votos') votos.add(d.sub); }
  assert.deepEqual([...tipos].sort(), ['canje', 'cortes', 'diana', 'fichas', 'lotes', 'pista', 'progresion', 'promocion', 'torneo', 'votos']);
  assert.equal(votos.size, 3);
});

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia);
  });
}

test('casos.json trae al menos 2 casos por tipo y las semillas de entrada y salida', () => {
  const cuenta = {};
  for (const c of casos.casos) cuenta[c.entrada.tipo] = (cuenta[c.entrada.tipo] || 0) + 1;
  for (const t of ['canje', 'cortes', 'diana', 'fichas', 'lotes', 'pista', 'progresion', 'promocion', 'torneo', 'votos']) assert.ok(cuenta[t] >= 2, t);
  for (const s of ['entrada-1', 'entrada-2', 'entrada-3', 'salida-1', 'salida-2', 'salida-3']) assert.ok(casos.casos.some(c => c.semilla === s), s);
});

test('papel.json: cada problema se comprueba con calc', () => {
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  for (const pr of papel.problemas) for (const vf of pr.verificar) {
    const r = gen.calc[vf.fn](...vf.args);
    if (vf.espera !== null && typeof vf.espera === 'object' && !Array.isArray(vf.espera)) for (const [k, x] of Object.entries(vf.espera)) assert.deepEqual(r[k], x, `${pr.id}: ${vf.fn}.${k}`);
    else assert.deepEqual(r, vf.espera, `${pr.id}: ${vf.fn}`);
  }
});

test('propiedades: los mínimos son mínimos y los máximos, máximos', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.tipo === 'lotes') { const c = gen.calc.lotes(d).paquetes; assert.ok(c * d.k >= d.n * d.g - d.s && (c - 1) * d.k < d.n * d.g - d.s); }
    if (d.tipo === 'promocion' && d.sub === 'comprar') { const C = p.respuesta.valor; assert.ok(recibe(C, d.k) >= d.T && recibe(C - 1, d.k) < d.T); }
    if (d.tipo === 'votos' && d.sub === 'asegurar') {
      const R = d.E - d.votos.reduce((a, b) => a + b, 0), x = p.respuesta.valor;
      assert.ok(d.votos[1] + (R - (x - 1)) >= d.votos[0] + x - 1, 'con uno menos, el segundo empata o pasa');
    }
    if (d.tipo === 'votos' && d.sub === 'minimo') { const V = d.E - d.b, x = p.respuesta.valor; assert.ok((d.n - 1) * (x - 2) < V - (x - 1)); }
    if (d.tipo === 'canje') assert.equal(gen.calc.canje(d).sobran < d.k, true);
    if (d.tipo === 'pista') assert.ok(p.respuesta.valor > 0 && p.respuesta.valor < d.L);
  }
});

test('ningún distractor es la respuesta y las figuras describen lo que muestran', () => {
  for (let s = 0; s < 300; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas) if (!a.correcta) assert.notEqual(a.valor, p.respuesta.valor);
    if (p._datos.tipo === 'diana') {
      for (const u of p._datos.u) assert.ok(p.figura.alt.includes(`${u[1]} en el anillo medio y ${u[0]} en el anillo exterior`));
      assert.ok(!p.figura.svg.includes(`>${p.respuesta.valor} puntos<`), 'la figura no muestra la respuesta');
    }
  }
});
