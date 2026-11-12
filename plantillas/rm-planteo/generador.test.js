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
    case 'latas': {
      // Cada lata cae si la golpean o si cae alguna de las dos en que se apoya (se simula fila por fila).
      const caen = (golpeada) => {
        const cae = new Set([golpeada.join(',')]);
        for (let r = 1; r < d.n; r++) for (let i = 0; i < d.n - r; i++) if (cae.has(`${r - 1},${i}`) || cae.has(`${r - 1},${i + 1}`)) cae.add(`${r},${i}`);
        return cae;
      };
      const marc = d.marcadas.map(p => p.join(','));
      const conjuntos = [];
      for (let r = 0; r < d.n; r++) for (let i = 0; i < d.n - r; i++) { const c = caen([r, i]); const s = marc.filter(m => c.has(m)); if (s.length) conjuntos.push(s); }
      for (let k = 1; k <= marc.length; k++) {
        const prueba = (desde, quedan, cubiertas) => {
          if (marc.every(m => cubiertas.has(m))) return true;
          if (!quedan) return false;
          for (let j = desde; j < conjuntos.length; j++) if (prueba(j + 1, quedan - 1, new Set([...cubiertas, ...conjuntos[j]]))) return true;
          return false;
        };
        if (prueba(0, k, new Set())) return k;
      }
      return NaN;
    }
    case 'latas-pares': {
      // Verdad de fondo: se suman los números de las latas tumbadas por Benito; y el puntaje de Arturo debe cuadrar.
      const suma = L => L.reduce((s, p) => s + d.valores[p[0]][p[1]], 0);
      if (suma(d.A) !== d.X) return NaN;
      const comunes = d.B.filter(p => d.A.some(q => q[0] === p[0] && q[1] === p[1]));
      if (comunes.length !== 1) return NaN;
      return suma(d.B);
    }
    case 'lanzamientos': {
      // Se prueban las 720 formas de repartir los seis números en tres fichas (caras 0 y 1 de cada una).
      const perm = a => (a.length < 2 ? [a] : a.flatMap((x, i) => perm([...a.slice(0, i), ...a.slice(i + 1)]).map(r => [x, ...r])));
      const parejas = new Set();
      for (const p of perm(d.numeros)) {
        const ficha = {}; p.forEach((x, i) => { ficha[x] = i >> 1; });
        if (d.lanzamientos.every(l => new Set(l.map(x => ficha[x])).size === l.length)) parejas.add(JSON.stringify([[p[0], p[1]], [p[2], p[3]], [p[4], p[5]]].map(q => q.slice().sort((a, b) => a - b)).sort((a, b) => a[0] - b[0])));
      }
      if (parejas.size !== 1) return NaN;
      const pa = JSON.parse([...parejas][0]), op = x => { const q = pa.find(z => z.includes(x)); return q[0] === x ? q[1] : q[0]; };
      return op(d.pq[0]) + op(d.pq[1]);
    }
    case 'cometa': {
      // Con coordenadas: diagonales perpendiculares que se cortan a d2/2 de la punta.
      const T = [0, 0], L = [-d.d2 / 2, d.d2 / 2], B = [0, d.d1], R = [d.d2 / 2, d.d2 / 2];
      const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]), mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      const M = [mid(T, L), mid(L, B), mid(B, R), mid(R, T)];
      const total = dist(T, B) + dist(L, R) + M.reduce((s, p, i) => s + dist(p, M[(i + 1) % 4]), 0);
      return d.pide === 'total' ? total : total / 2 - d.d1;
    }
    case 'vasos': {
      // Se colocan los centros uno por uno y se comprueba, con coordenadas, que caben y no se pisan.
      const cuenta = (desfase) => {
        const centros = []; let y = d.d / 2, fila = 0;
        while (y + d.d / 2 <= d.H + 1e-9) {
          let x = d.d / 2 + (desfase && fila % 2 ? d.d / 2 : 0);
          while (x + d.d / 2 <= d.W + 1e-9) { centros.push([x, y]); x += d.d; }
          y += desfase ? d.d * Math.sqrt(3) / 2 : d.d; fila++;
        }
        for (let i = 0; i < centros.length; i++) for (let j = i + 1; j < centros.length; j++) if (Math.hypot(centros[i][0] - centros[j][0], centros[i][1] - centros[j][1]) < d.d - 1e-9) return NaN;
        return centros.length;
      };
      return Math.max(cuenta(false), cuenta(true));
    }
  }
  return NaN;
}
probarGenerador(gen, { semillas: 600, recalcular });

test('salen todos los tipos (y los tres de votos) en 400 semillas', () => {
  const tipos = new Set(), votos = new Set();
  for (let s = 0; s < 400; s++) { const d = gen.generar(s)._datos; tipos.add(d.tipo); if (d.tipo === 'votos') votos.add(d.sub); }
  assert.deepEqual([...tipos].sort(), ['canje', 'cometa', 'cortes', 'diana', 'fichas', 'lanzamientos', 'latas', 'latas-pares', 'lotes', 'pista', 'progresion', 'promocion', 'torneo', 'vasos', 'votos']);
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
  for (const t of ['canje', 'cometa', 'cortes', 'diana', 'fichas', 'lanzamientos', 'latas', 'latas-pares', 'lotes', 'pista', 'progresion', 'promocion', 'torneo', 'vasos', 'votos']) assert.ok(cuenta[t] >= 2, t);
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

test('cierre-100: las semillas antiguas no cambian y las oficiales dan la respuesta del examen', () => {
  for (let s = 0; s < 108; s++) assert.ok(!['latas', 'latas-pares', 'lanzamientos', 'cometa', 'vasos'].includes(gen.generar(s)._datos.tipo), `semilla ${s}`);
  assert.equal(gen.generar('unmsm-2023-I-fichas').respuesta.valor, 8);
  assert.equal(gen.generar('unmsm-2021-cometa').respuesta.valor, 380);
  assert.equal(gen.generar('unmsm-2021-vasos').respuesta.valor, 11);
});

test('cierre-100: las latas, los lanzamientos y los vasos cumplen sus propiedades', () => {
  let mas = 0;
  for (let s = 108; s < 900; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.tipo === 'latas') { const r = gen.calc.latas(d); assert.ok(r.voraz > r.golpes && r.golpes >= 2); mas++; }
    if (d.tipo === 'lanzamientos') { const r = gen.calc.lanzamientos({ numeros: d.numeros, lanzamientos: d.lanzamientos }); assert.equal(r.validas.length, 1); assert.deepEqual(r.parejas.map(q => q.slice().sort((a, b) => a - b)).sort((a, b) => a[0] - b[0]), d.pares.map(q => q.slice().sort((a, b) => a - b)).sort((a, b) => a[0] - b[0])); }
    if (d.tipo === 'vasos') { const r = gen.calc.vasos(d); assert.notEqual(r.alineadas, r.intercaladas); }
    if (d.tipo === 'latas-pares') assert.equal(gen.calc.latasPares(d).comun.length, 2);
  }
  assert.ok(mas > 10);
});
