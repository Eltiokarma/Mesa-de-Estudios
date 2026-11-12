// Pruebas del generador de certezas: casos.json (para verificar aparte, a ciegas), papel.json y un recálculo
// independiente en cada uno de 600 problemas. El recálculo no usa las fórmulas del generador: busca por fuerza bruta
// el mayor grupo que se puede sacar SIN lograr lo pedido (conjunto independiente máximo en un grafo, recorrido de
// todas las cantidades posibles por color, todos los subconjuntos o programación dinámica) y le suma 1.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

const rango = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const primo = n => n > 1 && rango(2, n - 1).every(d => n % d);

// Conjunto independiente máximo: vértices 0..n−1, malo(i, j) = true si i y j juntos ya logran lo pedido.
// Ramifica en el vértice de mayor grado; los de grado 0 o 1 se toman sin ramificar (siempre hay un óptimo con ellos).
function mis(n, malo) {
  const ady = rango(0, n - 1).map(i => new Set(rango(0, n - 1).filter(j => j !== i && malo(i, j))));
  function rec(vivos) {
    if (!vivos.size) return 0;
    let mejor = -1, gmax = -1;
    for (const v of vivos) {
      let g = 0; for (const u of ady[v]) if (vivos.has(u)) g++;
      if (g <= 1) { const r = new Set(vivos); r.delete(v); for (const u of ady[v]) r.delete(u); return 1 + rec(r); }
      if (g > gmax) { gmax = g; mejor = v; }
    }
    const sin = new Set(vivos); sin.delete(mejor);
    const con = new Set(sin); for (const u of ady[mejor]) con.delete(u);
    return Math.max(rec(sin), 1 + rec(con));
  }
  return rec(new Set(rango(0, n - 1)));
}
// Todas las cantidades posibles por clase (0..tope[i]); devuelve la mayor suma entre las que NO logran.
function porCantidades(topes, logra) {
  let mejor = 0;
  (function rec(i, v) {
    if (i === topes.length) { if (!logra(v)) mejor = Math.max(mejor, v.reduce((s, x) => s + x, 0)); return; }
    for (let c = 0; c <= topes[i]; c++) { v.push(c); rec(i + 1, v); v.pop(); }
  })(0, []);
  return mejor;
}
// Todos los subconjuntos de una lista chica: el mayor que no logra.
function porSubconjuntos(xs, logra) {
  let mejor = 0;
  for (let m = 0; m < 1 << xs.length; m++) {
    const s = xs.filter((_, i) => m >> i & 1);
    if (s.length > mejor && !logra(s)) mejor = s.length;
  }
  return mejor;
}

const cacheAbrir = {};
function abrirPorBusqueda(c, y) {
  const n = c + y, rot = [...rango(0, c - 1), ...new Array(y).fill(c)];
  const sobran = new Array(c + 1).fill(1); sobran[c] = y;
  const validos = [];
  (function llena(i, cur) {
    if (i === n) { validos.push(cur.slice()); return; }
    for (let col = 0; col <= c; col++) if (sobran[col] > 0 && col !== rot[i]) { sobran[col]--; cur.push(col); llena(i + 1, cur); cur.pop(); sobran[col]++; }
  })(0, []);
  const visto = new Map();
  function costo(vistos, posibles) {
    if (posibles.length === 1) return 0;
    const clave = [...vistos].sort((a, b) => a[0] - b[0]).map(x => x.join(':')).join(',');
    if (visto.has(clave)) return visto.get(clave);
    let mejor = Infinity;
    for (let b = 0; b < n; b++) {
      if (vistos.has(b)) continue;
      const sale = [...new Set(posibles.map(q => q[b]))];
      if (sale.length === 1) continue;
      let peor = 0;
      for (const col of sale) peor = Math.max(peor, costo(new Map(vistos).set(b, col), posibles.filter(q => q[b] === col)));
      mejor = Math.min(mejor, 1 + peor);
    }
    visto.set(clave, mejor); return mejor;
  }
  return costo(new Map(), validos);
}

function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'colores': {
      const cs = Object.keys(d.urna), topes = cs.map(c => d.urna[c]);
      const logra = v => d.pide === 'mismo' ? v.some(x => x >= d.k) : d.pide === 'uno-de-cada' ? v.every(x => x >= 1) : v[cs.indexOf(d.color)] >= d.k;
      return porCantidades(topes, logra) + 1;
    }
    case 'guantes': {
      // dos clases por color: izquierdos y derechos
      const cs = Object.keys(d.pares), topes = cs.flatMap(c => [d.pares[c], d.pares[c]]);
      const logra = v => cs.some((c, i) => (!d.color || c === d.color) && v[2 * i] >= 1 && v[2 * i + 1] >= 1);
      return porCantidades(topes, logra) + 1;
    }
    case 'divisibilidad': {
      const noSirven = rango(1, d.N).filter(x => x % d.a && x % d.b).length;
      return noSirven + d.k;
    }
    case 'suma-supera': {
      // peor caso: para cada cantidad m, la menor suma posible entre todos los grupos de m cartas
      const n = d.valores.length, menor = new Array(n + 1).fill(Infinity);
      for (let m = 0; m < 1 << n; m++) {
        let c = 0, s = 0; for (let i = 0; i < n; i++) if (m >> i & 1) { c++; s += d.valores[i]; }
        menor[c] = Math.min(menor[c], s);
      }
      return menor.findIndex(s => s > d.S);
    }
    case 'pareja-suma': {
      const xs = rango(1, d.N).flatMap(x => new Array(d.copias).fill(x));
      return mis(xs.length, (i, j) => xs[i] + xs[j] === d.S) + 1;
    }
    case 'trio-suma': {
      const logra = s => s.some((a, i) => s.some((b, j) => j > i && s.some((c, k) => k > j && a + b + c === d.S)));
      return porSubconjuntos(rango(1, d.N), logra) + 1;
    }
    case 'consecutivos': {
      // programación dinámica: f[x][r] = mayor grupo de 1..x que termina con una racha de r seguidos (r < k)
      let f = new Array(d.k).fill(-Infinity); f[0] = 0;
      for (let x = 1; x <= d.N; x++) {
        const g = new Array(d.k).fill(-Infinity);
        g[0] = Math.max(...f);
        for (let r = 1; r < d.k; r++) g[r] = f[r - 1] + 1;
        f = g;
      }
      return Math.max(...f) + 1;
    }
    case 'paridad': {
      const xs = rango(d.desde, d.hasta);
      const cond = { 'producto-par': (a, b) => (a * b) % 2 === 0, 'suma-impar': (a, b) => (a + b) % 2 === 1, 'suma-par': (a, b) => (a + b) % 2 === 0 }[d.pide];
      return mis(xs.length, (i, j) => cond(xs[i], xs[j])) + 1;
    }
    case 'diferencia': {
      const xs = rango(d.desde, d.hasta);
      return mis(xs.length, (i, j) => d.pide === 'mayor' ? Math.abs(xs[i] - xs[j]) > d.d : Math.abs(xs[i] - xs[j]) === d.d) + 1;
    }
    case 'division': {
      const xs = rango(1, d.N);
      return mis(xs.length, (i, j) => Math.max(xs[i], xs[j]) % Math.min(xs[i], xs[j]) === 0) + 1;
    }
    case 'primos': {
      const xs = rango(1, d.N);
      return mis(xs.length, (i, j) => primo(xs[i]) && primo(xs[j]) && xs[i] + xs[j] > d.S) + 1;
    }
    case 'pareja-color': {
      // bolos (color, número); dos bolos «logran» si son de distinto color, de distinto número y suman S
      const xs = []; for (const c of [0, 1]) for (let x = 1; x <= d.N; x++) xs.push([c, x]);
      return mis(xs.length, (i, j) => xs[i][0] !== xs[j][0] && xs[i][1] !== xs[j][1] && xs[i][1] + xs[j][1] === d.S) + 1;
    }
    case 'cajas-abrir': {
      // repartos válidos por conteo y estrategia óptima por búsqueda sobre lo visto; se guarda por (c, y)
      const k = d.c + ',' + d.y;
      if (!cacheAbrir[k]) cacheAbrir[k] = abrirPorBusqueda(d.c, d.y);
      return cacheAbrir[k];
    }
    case 'billetes': {
      const vs = Object.keys(d.billetes).map(Number), topes = vs.map(x => d.billetes[x]);
      const logra = c => vs.some((x, i) => vs.some((y, j) => x + y === d.M && (i === j ? c[i] >= 2 : c[i] >= 1 && c[j] >= 1)));
      return porCantidades(topes, logra) + 1;
    }
    case 'cumpleanos': {
      // se llena casilla por casilla mientras se pueda sin juntar k (simulación del peor caso)
      const casillas = { fecha: 366, mes: 12, semana: 7, 'dia-mes': 31 }[d.casilla];
      if (d.casilla === 'fecha') { // las fechas de un año bisiesto, una por una
        let dias = 0; for (let m = 0; m < 12; m++) dias += new Date(Date.UTC(2024, m + 1, 0)).getUTCDate();
        assert.equal(dias, casillas);
      }
      const cuenta = new Array(casillas).fill(0); let gente = 0;
      for (;;) { const i = cuenta.findIndex(c => c < d.k - 1); if (i < 0) break; cuenta[i]++; gente++; }
      return gente + 1 - (d.ya || 0);
    }
    case 'suma-cifras': {
      const cuenta = {};
      for (let x = d.desde; x <= d.hasta; x++) { const s = String(x).split('').reduce((a, c) => a + +c, 0); cuenta[s] = (cuenta[s] || 0) + 1; }
      return Object.values(cuenta).reduce((t, c) => t + Math.min(c, d.k - 1), 0) + 1;
    }
    case 'llaves': {
      // adversario: en cada candado, la llave buena es la última de las que quedan; la última no se prueba
      let intentos = 0, quedan = d.n;
      while (quedan > 1) { intentos += quedan - 1; quedan--; }
      return intentos;
    }
    case 'cajas': {
      const nombres = ['A', 'B', 'mezcla'];
      const perms = [];
      for (const p of [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]]) if (p.every((x, i) => x !== i)) perms.push(p.map(i => nombres[i]));
      if (d.pide === 'cual') {
        const salen = c => (c === 'mezcla' ? ['A', 'B'] : [c]);
        const buenas = [0, 1, 2].filter(i => {
          // para cada reparto real y cada cosa que podría salir, ¿queda un solo reparto posible?
          return perms.every(real => salen(real[i]).every(x => perms.filter(q => salen(q[i]).includes(x)).length === 1));
        });
        assert.equal(buenas.length, 1);
        return nombres[buenas[0]];
      }
      const posibles = new Set(perms.filter(q => q[2] === d.sale).map(q => q[nombres.indexOf(d.rotulo)]));
      return posibles.size === 1 ? [...posibles][0] : 'no-se-sabe';
    }
  }
  throw new Error('tipo desconocido ' + d.tipo);
}

probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => a === b });

test('salen los 16 tipos en 200 semillas', () => {
  const tipos = new Set(); for (let s = 0; s < 200; s++) tipos.add(gen.generar(s)._datos.tipo);
  assert.equal(tipos.size, 16, [...tipos].join(', '));
});

// Tipos nuevos (cierre-100): solo con semillas de práctica; se prueban con semillas de texto.
const nuevosVistos = {};
test('los tipos nuevos salen con semillas de práctica y se recalculan aparte', () => {
  for (let s = 1; s <= 600; s++) {
    const p = gen.generar(`ana-${s}`), d = p._datos;
    assert.ok(p.alternativas.length >= 4);
    const nuevo = d.tipo === 'pareja-color' || d.tipo === 'cajas-abrir' || (d.tipo === 'cumpleanos' && d.ya !== undefined);
    if (!nuevo) continue;
    nuevosVistos[d.tipo + (d.ya !== undefined ? '-ya' : '')] = 1;
    assert.equal(recalcular(p), p.respuesta.valor, `ana-${s} (${d.tipo})`);
    assert.equal(p.alternativas.filter(a => a.correcta).length, 1);
  }
  assert.deepEqual(Object.keys(nuevosVistos).sort(), ['cajas-abrir', 'cumpleanos-ya', 'pareja-color']);
});
test('las semillas de entrada y salida no usan tipos nuevos', () => {
  for (const pre of ['entrada', 'salida']) for (let s = 1; s <= 60; s++) {
    const d = gen.generar(`${pre}-${s}`)._datos;
    assert.ok(!['pareja-color', 'cajas-abrir'].includes(d.tipo) && d.ya === undefined, `${pre}-${s}`);
  }
});

test('el peor caso falla de verdad: trioSuma da un grupo sin trío del tamaño dicho', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s); if (p._datos.tipo !== 'trio-suma') continue;
    const R = gen.calc.trioSuma(p._datos);
    assert.equal(R.peor.length, R.respuesta - 1);
    for (const t of R.trios) assert.ok(!t.every(x => R.peor.includes(x)), `semilla ${s}: el peor caso contiene ${t}`);
  }
});

test('la respuesta nunca es mayor que todo lo que hay (salvo cumpleaños y llaves)', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), d = p._datos;
    const total = { colores: () => Object.values(d.urna || {}).reduce((a, b) => a + b, 0), guantes: () => 2 * Object.values(d.pares).reduce((a, b) => a + b, 0),
      divisibilidad: () => d.N, 'suma-supera': () => d.valores.length, 'pareja-suma': () => d.N * d.copias, 'trio-suma': () => d.N, consecutivos: () => d.N,
      paridad: () => d.hasta - d.desde + 1, diferencia: () => d.hasta - d.desde + 1, division: () => d.N, primos: () => d.N,
      billetes: () => Object.values(d.billetes).reduce((a, b) => a + b, 0), 'suma-cifras': () => d.hasta - d.desde + 1 }[d.tipo];
    if (total) assert.ok(p.respuesta.valor <= total(), `semilla ${s} (${d.tipo}): ${p.respuesta.valor} > ${total()}`);
  }
});

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(p.respuesta.valor, c.esperado.respuesta);
  });
}

test('papel.json: formato', () => {
  assert.ok(papel.titulo && papel.indicacion && papel.problemas.length >= 5 && papel.problemas.length <= 10);
  for (const q of papel.problemas) assert.ok(q.id && q.nivel && q.enunciado && q.respuesta && q.pasos.length && q.verificar.length, q.id);
});
for (const q of papel.problemas) {
  test(`papel ${q.id}`, () => {
    for (const vf of q.verificar) {
      const r = gen.calc[vf.fn](...vf.args);
      for (const [k, e] of Object.entries(vf.espera)) assert.deepEqual(r[k], e, `${q.id}: ${vf.fn}.${k}`);
    }
  });
}
