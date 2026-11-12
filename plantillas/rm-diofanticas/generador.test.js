// Pruebas del generador de enteros con condiciones: las comunes (600 problemas con un recálculo
// independiente que sale solo de _datos, por otro recorrido o por programación dinámica), casos.json,
// papel.json y propiedades (el óptimo de verdad es óptimo).
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// Máximo (o mínimo) de monedas con suma S exacta: programación dinámica sin límite de piezas.
function dpMonedas(den, S, mejor) {
  const dp = new Array(S + 1).fill(null); dp[0] = 0;
  for (let s = 1; s <= S; s++) for (const d of den) if (d <= s && dp[s - d] !== null) dp[s] = dp[s] === null ? dp[s - d] + 1 : mejor(dp[s], dp[s - d] + 1);
  return dp[S];
}
// Valor de la expresión con la jerarquía de JavaScript (× → *, ÷ → /), en coma flotante.
const valorJS = (nums, ops) => Function(`return ${nums.map((x, i) => x + (i < ops.length ? { '+': '+', '−': '-', '×': '*', '÷': '/' }[ops[i]] : '')).join('')};`)();
function* perms(l) { if (l.length <= 1) { yield l; return; } for (let i = 0; i < l.length; i++) for (const p of perms([...l.slice(0, i), ...l.slice(i + 1)])) yield [l[i], ...p]; }

function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'dos-articulos': {
      const sol = [];
      for (let y = 1; d.b * y < d.T; y++) { const r = d.T - d.b * y; if (r % d.a === 0 && r > 0) sol.push(r / d.a + y); }
      return d.pide === 'cuantas' ? sol.length : d.pide === 'mas' ? Math.max(...sol) : Math.min(...sol);
    }
    case 'palitos': return dpMonedas([d.a, d.b], d.L, Math.min);
    case 'monedas': {
      const resto = d.S - d.k * d.den.reduce((s, x) => s + x, 0);
      return d.k * d.den.length + dpMonedas(d.den, resto, Math.max);
    }
    case 'grupos': {
      // Grupos como multiconjunto de formas (en orden no decreciente), sin memoria.
      const formas = [];
      for (let c = 0; 5 * c <= d.G; c++) for (let b = 0; 5 * c + 2 * b <= d.G; b++) formas.push([d.G - 5 * c - 2 * b, b, c]);
      let mejor = 0;
      const rec = (desde, quedan, n) => {
        mejor = Math.max(mejor, n);
        for (let i = desde; i < formas.length; i++) {
          const f = formas[i];
          if (f.every((x, j) => x <= quedan[j])) rec(i, quedan.map((x, j) => x - f[j]), n + 1);
        }
      };
      rec(0, d.cant.slice(), 0);
      return mejor;
    }
    case 'tres-precios': {
      let mejor = -Infinity;
      for (let z = d.m; d.p[2] * z <= d.T; z++) for (let y = d.m; d.p[2] * z + d.p[1] * y <= d.T; y++) {
        const r = d.T - d.p[2] * z - d.p[1] * y;
        if (r % d.p[0] === 0 && r / d.p[0] >= d.m) mejor = Math.max(mejor, d.g[0] * r / d.p[0] + d.g[1] * y + d.g[2] * z);
      }
      return mejor;
    }
    case 'dardos': {
      // Búsqueda en anchura sobre los puntajes alcanzados.
      let nivel = new Set([0]);
      for (let n = 1; n < 200; n++) {
        const sig = new Set();
        for (const s of nivel) for (const x of d.sectores) if (s + x <= d.S) sig.add(s + x);
        if (sig.has(d.S)) return n * (d.pide === 'costo' ? d.costo : 1);
        nivel = sig;
      }
      return NaN;
    }
    case 'alcanza': {
      const Qv = (d.k + 1) * d.l + d.d;
      let l = 1; while ((d.k + 1) * l + d.d !== Qv) l++;
      const c = l + d.d;
      let max = NaN;
      for (let D = 0; D < 2000; D++) if (D >= d.a1 * c + d.b1 * l && D < d.a2 * c && D < d.b3 * l) max = D;
      return max;
    }
    case 'reparto': {
      const r = [];
      for (let n = d.lo + 1; n < d.hi; n++) if (d.C % n !== 0 && n - d.C % n === d.f) r.push(n); // lo que de verdad falta con n alumnos
      return r.length === 1 ? r[0] : NaN;
    }
    case 'borrar': {
      // Se prueban cantidades de cifras que quedan, de menor a mayor, con conteos por cifra.
      const cifras = d.bloque.repeat(d.r).split('').map(Number);
      const cuenta = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(x => cifras.filter(c => c === x).length);
      const posible = (m, s, i) => {
        if (s === 0) return m === 0;
        if (i < 0 || m === 0) return false;
        for (let c = Math.min(cuenta[i], m); c >= 0; c--) if (c * (i + 1) <= s && posible(m - c, s - c * (i + 1), i - 1)) return true;
        return false;
      };
      for (let m = 1; m <= cifras.length; m++) if (posible(m, d.S, 8)) return cifras.length - m;
      return NaN;
    }
    case 'expresion': {
      let mejor = -Infinity;
      for (const pm of perms(d.nums)) {
        const x = valorJS(pm, d.ops);
        if (Math.abs(x - Math.round(x)) < 1e-9 && Math.round(x) > mejor) mejor = Math.round(x);
      }
      return mejor;
    }
  }
  return NaN;
}
probarGenerador(gen, { semillas: 600, recalcular });

const TIPOS = ['alcanza', 'borrar', 'dardos', 'dos-articulos', 'expresion', 'grupos', 'monedas', 'palitos', 'reparto', 'tres-precios'];
test('salen todos los tipos en 200 semillas', () => {
  const tipos = new Set(); for (let s = 0; s < 200; s++) tipos.add(gen.generar(s)._datos.tipo);
  assert.deepEqual([...tipos].sort(), TIPOS);
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
  for (const t of TIPOS) assert.ok(cuenta[t] >= 2, t);
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

test('propiedades: el óptimo de verdad es óptimo y cumple las condiciones', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), d = p._datos, x = p.respuesta.valor;
    if (d.tipo === 'dardos' && d.pide === 'tiros') assert.equal(recalcular({ _datos: { ...d, S: d.S } }), x);
    if (d.tipo === 'monedas') {
      const r = gen.calc.monedas(d.den, d.S, d.k);
      assert.equal(r.mejor.reduce((a, c, i) => a + c * d.den[i], 0), d.S, 'la mejor suma exacto');
      assert.ok(r.mejor.every(c => c >= d.k), 'respeta el mínimo');
    }
    if (d.tipo === 'alcanza') { const a = gen.calc.alcanza(d); assert.ok(a.hasta >= a.desde); }
    if (d.tipo === 'reparto') { assert.equal((d.C + d.f) % x, 0); assert.ok(d.C % x !== 0 && x > d.lo && x < d.hi); }
    if (d.tipo === 'expresion') {
      const e = gen.calc.expresion(d.nums, d.ops);
      assert.ok(Math.abs(valorJS(e.arreglo, d.ops) - x) < 1e-9, 'el arreglo da la respuesta');
    }
  }
});

test('ningún distractor es la respuesta y la figura de dardos no la revela', () => {
  for (let s = 0; s < 300; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas) if (!a.correcta) assert.notEqual(a.valor, p.respuesta.valor);
    if (p._datos.tipo === 'dardos') for (const x of p._datos.sectores) assert.ok(p.figura.alt.includes(String(x)));
  }
});

test('reparto: en 2000 semillas, C + f tiene un solo divisor en el rango (una sola respuesta defendible)', () => {
  let vistos = 0;
  for (let s = 0; s < 2000; s++) {
    const d = gen.generar(s)._datos;
    if (d.tipo !== 'reparto') continue;
    vistos++;
    const N = d.C + d.f, enRango = [];
    for (let n = d.lo + 1; n < d.hi; n++) if (N % n === 0) enRango.push(n);
    assert.equal(enRango.length, 1, `semilla ${s}: divisores de ${N} entre ${d.lo} y ${d.hi}: ${enRango.join(', ')}`);
  }
  assert.ok(vistos > 50);
});

test('tres precios: «la compra con más cajas» solo se ofrece si es una sola', () => {
  for (let s = 0; s < 2000; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.tipo !== 'tres-precios' || !p.alternativas.some(a => a.error && a.error.id === 'RMP2-mas-articulos')) continue;
    const sol = gen.calc.tresPrecios(d.p, d.g, d.T, d.m).soluciones, cajas = x => x[0] + x[1] + x[2];
    const max = Math.max(...sol.map(cajas));
    assert.equal(sol.filter(x => cajas(x) === max).length, 1, `semilla ${s}`);
  }
});
