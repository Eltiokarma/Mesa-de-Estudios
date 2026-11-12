// Pruebas del generador de cortes: casos.json (para verificar aparte, a ciegas), papel.json y un recálculo
// independiente en cada uno de 600 problemas, sin las fórmulas ni la búsqueda del generador:
//   plancha sin límite: altura mínima del árbol de cortes, probando todas las formas de partir cada pieza;
//   plancha con límite: búsqueda en anchura sin cota sobre todos los montones posibles;
//   arreglo: programación dinámica de abajo hacia arriba sobre todos los subrectángulos;
//   progresión: se prueban todas las cantidades de tramos; estacas: se cuentan los puntos uno por uno;
//   esquinas: se arma el polígono, se suma su perímetro con decimales y se busca el p + q√2 que da lo mismo.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

const memoAlto = new Map();
function altoSinLimite(a, b) {
  if (a > b) [a, b] = [b, a];
  if (a * b === 1) return 0;
  const k = a + 'x' + b;
  if (memoAlto.has(k)) return memoAlto.get(k);
  let mejor = Infinity;
  for (let i = 1; i < b; i++) mejor = Math.min(mejor, 1 + Math.max(altoSinLimite(a, i), altoSinLimite(a, b - i)));
  for (let i = 1; i < a; i++) mejor = Math.min(mejor, 1 + Math.max(altoSinLimite(i, b), altoSinLimite(a - i, b)));
  memoAlto.set(k, mejor);
  return mejor;
}

// Búsqueda en anchura: un estado es la lista ordenada de piezas que aún tienen más de un cuadradito.
function anchura(m, n, c) {
  const norm = l => l.map(([a, b]) => (a <= b ? [a, b] : [b, a])).filter(([a, b]) => a * b > 1).sort((p, q) => (p[0] - q[0]) || (p[1] - q[1]));
  const clave = l => JSON.stringify(l);
  let frente = [norm([[m, n]])];
  const visto = new Set(frente.map(clave));
  for (let d = 0; ; d++) {
    if (frente.some(s => !s.length)) return d;
    const sig = [];
    for (const s of frente) {
      // cada pieza: se queda (null) o se parte de alguna forma; a lo más c piezas partidas
      const opciones = s.map(([a, b]) => {
        const o = [null];
        for (let i = 1; i < b; i++) o.push([[a, i], [a, b - i]]);
        for (let i = 1; i < a; i++) o.push([[i, b], [a - i, b]]);
        return o;
      });
      (function rec(i, partidas, acc) {
        if (i === s.length) {
          if (!partidas) return;
          const t = norm(acc), k = clave(t);
          if (!visto.has(k)) { visto.add(k); sig.push(t); }
          return;
        }
        for (const o of opciones[i]) {
          if (o && partidas === c) continue;
          rec(i + 1, partidas + (o ? 1 : 0), o ? acc.concat(o) : acc.concat([s[i]]));
        }
      })(0, 0, []);
    }
    frente = sig;
  }
}

function altoArreglo(celdas) {
  const F = celdas.length, C = celdas[0].length, A = new Map();
  const key = (f0, f1, k0, k1) => `${f0},${f1},${k0},${k1}`;
  for (let alto = 1; alto <= F; alto++) for (let ancho = 1; ancho <= C; ancho++) {
    for (let f0 = 0; f0 + alto <= F; f0++) for (let k0 = 0; k0 + ancho <= C; k0++) {
      const f1 = f0 + alto, k1 = k0 + ancho;
      const ids = new Set(); for (let i = f0; i < f1; i++) for (let k = k0; k < k1; k++) ids.add(celdas[i][k]);
      let v = ids.size === 1 ? 0 : Infinity;
      if (v) {
        for (let k = k0 + 1; k < k1; k++) {
          let limpia = true; for (let i = f0; i < f1; i++) if (celdas[i][k - 1] === celdas[i][k]) limpia = false;
          if (limpia) v = Math.min(v, 1 + Math.max(A.get(key(f0, f1, k0, k)), A.get(key(f0, f1, k, k1))));
        }
        for (let i = f0 + 1; i < f1; i++) {
          let limpia = true; for (let k = k0; k < k1; k++) if (celdas[i - 1][k] === celdas[i][k]) limpia = false;
          if (limpia) v = Math.min(v, 1 + Math.max(A.get(key(f0, i, k0, k1)), A.get(key(i, f1, k0, k1))));
        }
      }
      A.set(key(f0, f1, k0, k1), v);
    }
  }
  return A.get(key(0, F, 0, C));
}

function perimetro(pts) { let s = 0; for (let i = 0; i < pts.length; i++) { const [a, b] = pts[i], [c, d] = pts[(i + 1) % pts.length]; s += Math.hypot(c - a, d - b); } return s; }
function comoRaiz(P, tope) {
  for (let q = -tope; q <= tope; q++) { const p = Math.round(P - q * Math.SQRT2); if (Math.abs(p + q * Math.SQRT2 - P) < 1e-7) return { p, q }; }
  return null;
}

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'plancha') return d.c ? anchura(d.m, d.n, d.c) : altoSinLimite(d.m, d.n);
  if (d.tipo === 'arreglo') return altoArreglo(d.celdas);
  if (d.tipo === 'progresion') {
    if (d.pide === 'cortes') {
      for (let n = 2; n < 200; n++) { const paso = (d.b - d.a) / (n - 1); let s = 0; for (let i = 0; i < n; i++) s += d.a + i * paso; if (Math.abs(s - d.L) < 1e-9) return n - 1; }
      return NaN;
    }
    // bisección sobre el tramo mayor: la suma de los c + 1 tramos crece con él
    const n = d.c + 1, suma = b => { let s = 0; for (let i = 0; i < n; i++) s += d.a + i * (b - d.a) / (n - 1); return s; };
    let lo = d.a, hi = d.L;
    for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (suma(mid) < d.L) lo = mid; else hi = mid; }
    return Math.round(lo * 1e6) / 1e6;
  }
  if (d.tipo === 'estacas') {
    let g = 1; for (let t = 1; t <= Math.min(d.A, d.B); t++) if (d.A % t === 0 && d.B % t === 0) g = t;
    const paso = d.pide === 'vertices' ? g : d.e;
    let n = 0;
    for (let X = 0; X <= d.A; X += paso) for (let Y = 0; Y <= d.B; Y += paso) if (X % g === 0 || Y % g === 0) n++;
    if (d.pide === 'vertices') { n = 0; for (let X = 0; X <= d.A; X += g) for (let Y = 0; Y <= d.B; Y += g) n++; }
    return n;
  }
  if (d.tipo === 'esquinas') {
    const { L, W, a } = d;
    let pts;
    if (d.corte === 'cuadrado') pts = [[a, 0], [L - a, 0], [L - a, a], [L, a], [L, W - a], [L - a, W - a], [L - a, W], [a, W], [a, W - a], [0, W - a], [0, a], [a, a]];
    else {
      const c = d.corte === 'octogono' ? L / (2 + Math.SQRT2) : a;
      pts = [[c, 0], [L - c, 0], [L, c], [L, W - c], [L - c, W], [c, W], [0, W - c], [0, c]];
      if (d.corte === 'octogono') { // los ocho lados iguales
        const lados = pts.map((q, i) => Math.hypot(pts[(i + 1) % 8][0] - q[0], pts[(i + 1) % 8][1] - q[1]));
        assert.ok(lados.every(z => Math.abs(z - lados[0]) < 1e-9));
      }
    }
    const P = perimetro(pts);
    if (d.corte === 'cuadrado') return `num:${Math.round(P * 1e9) / 1e9}`;
    const r = comoRaiz(P, 20 * L);
    return `rad:${r.p}:${r.q}`;
  }
  throw new Error('tipo desconocido');
}

probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => typeof a === 'number' && typeof b === 'number' ? Math.abs(a - b) < 1e-6 : a === b });

test('salen los cinco tipos en 200 semillas (y la plancha con y sin límite de capas)', () => {
  const tipos = new Set(); let con = 0, sin = 0;
  for (let s = 0; s < 200; s++) { const d = gen.generar(s)._datos; tipos.add(d.tipo); if (d.tipo === 'plancha') d.c ? con++ : sin++; }
  assert.equal(tipos.size, 5);
  assert.ok(con > 5 && sin > 5);
});

// ---- Tablero de triángulos y estructura de alambre (cierre-100): se lee la figura DIBUJADA ----
// Tablero: cada triángulo sale del <polygon>; una línea es una dirección (entre 3) y un desplazamiento; el recuento
// prueba, ronda por ronda, si cada pieza se puede separar (puede(pieza, r)), sin la fórmula del generador.
function tableroIndep(p) {
  const tris = [...p.figura.svg.matchAll(/<polygon class="tri" points="([^"]+)"/g)].map(m => m[1].trim().split(/\s+/).map(q => q.split(',').map(Number)));
  const lado = Math.hypot(tris[0][0][0] - tris[0][1][0], tris[0][0][1] - tris[0][1][1]);
  const L = Math.floor(p._datos.sierra / p._datos.lado);
  const pt = q => `${Math.round(q[0] * 2)}:${Math.round(q[1] * 2)}`;
  // Direcciones (entre 3) y desplazamientos de las rectas; los desplazamientos se agrupan si difieren menos de 2 px.
  const crudas = tris.map(t => [[t[0], t[1]], [t[1], t[2]], [t[0], t[2]]].map(([a, b]) => {
    let ang = Math.atan2(b[1] - a[1], b[0] - a[0]); ang = ((ang % Math.PI) + Math.PI) % Math.PI;
    const dir = Math.round(ang / (Math.PI / 3)) % 3, nx = -Math.sin(dir * Math.PI / 3), ny = Math.cos(dir * Math.PI / 3);
    return { k: [pt(a), pt(b)].sort().join('|'), dir, off: ((a[0] + b[0]) / 2) * nx + ((a[1] + b[1]) / 2) * ny };
  }));
  const grupos = {};
  for (let dir = 0; dir < 3; dir++) {
    const offs = [...new Set(crudas.flat().filter(e => e.dir === dir).map(e => e.off))].sort((u, w) => u - w);
    let c = 0; grupos[dir] = offs.map((o, i) => { if (i && o - offs[i - 1] > 2) c++; return [o, c]; });
  }
  const aristas = (t, i) => crudas[i].map(e => ({ k: e.k, l: e.dir + ':' + grupos[e.dir].find(([o]) => o === e.off)[1] }));
  const E = tris.map((t, i) => aristas(t, i)), memo = new Map();
  const puede = (idx, r) => {
    if (idx.length === 1) return true;
    if (r === 0) return false;
    const k = idx.join(',') + '#' + r;
    if (memo.has(k)) return memo.get(k);
    let ok = false;
    for (const l of new Set(idx.flatMap(i => E[i].map(e => e.l)))) {
      const sobre = new Set(idx.flatMap(i => E[i].filter(e => e.l === l).map(e => e.k)));
      if (sobre.size > L) continue;
      // piezas que quedan: triángulos unidos por un lado que no está sobre la línea
      const grupos = [];
      for (const i of idx) {
        const unidos = grupos.filter(g => g.some(j => E[i].some(e => e.l !== l && E[j].some(f => f.k === e.k))));
        const nuevo = [i].concat(...unidos);
        for (const g of unidos) grupos.splice(grupos.indexOf(g), 1);
        grupos.push(nuevo);
      }
      if (grupos.length < 2) continue;
      if (grupos.every(g => puede(g.slice().sort((a, b) => a - b), r - 1))) { ok = true; break; }
    }
    memo.set(k, ok);
    return ok;
  };
  const todos = tris.map((_, i) => i);
  for (let r = 0; r < 12; r++) if (puede(todos, r)) return r;
  assert.ok(lado > 0);
  return NaN;
}
// Alambre: nodos (<circle class="nodo">), alambres rectos (<line>) y arcos (<path ... A r r 0 0 s x y>). Un corte es un
// segmento que, muestreado, no pasa cerca de ningún alambre salvo cerca de un punto de soldadura.
function alambreIndep(p) {
  const svg = p.figura.svg;
  const nodos = [...svg.matchAll(/<circle class="nodo" cx="([\d.]+)" cy="([\d.]+)"/g)].map(m => ({ x: Number(m[1]), y: Number(m[2]) }));
  const cercano = q => nodos.findIndex(n => Math.hypot(n.x - q[0], n.y - q[1]) < 0.6);
  const E = [];
  for (const m of svg.matchAll(/<line x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)"/g)) E.push({ a: cercano([+m[1], +m[2]]), b: cercano([+m[3], +m[4]]), tipo: 'r' });
  for (const m of svg.matchAll(/<path d="M([\d.]+) ([\d.]+) A([\d.]+) [\d.]+ 0 0 (\d) ([\d.]+) ([\d.]+)"/g)) {
    const a = cercano([+m[1], +m[2]]), b = cercano([+m[5], +m[6]]), r = Number(m[3]);
    const mx = (nodos[a].x + nodos[b].x) / 2, my = (nodos[a].y + nodos[b].y) / 2, dd = Math.hypot(nodos[b].x - nodos[a].x, nodos[b].y - nodos[a].y), hh = Math.sqrt(r * r - dd * dd / 4);
    const ux = -(nodos[b].y - nodos[a].y) / dd, uy = (nodos[b].x - nodos[a].x) / dd;
    const cands = [[mx + hh * ux, my + hh * uy], [mx - hh * ux, my - hh * uy]];
    const c = cands.map(z => ({ z, n: nodos.filter(q => Math.abs(Math.hypot(q.x - z[0], q.y - z[1]) - r) < 0.6).length })).sort((u, w) => w.n - u.n)[0].z;
    E.push({ a, b, tipo: 'a', c, r });
  }
  assert.ok(E.every(e => e.a >= 0 && e.b >= 0), 'un alambre no termina en un punto de soldadura');
  const distAlambre = (q, e) => {
    const A = nodos[e.a], B = nodos[e.b];
    if (e.tipo === 'r') {
      const dx = B.x - A.x, dy = B.y - A.y, t = Math.max(0, Math.min(1, ((q[0] - A.x) * dx + (q[1] - A.y) * dy) / (dx * dx + dy * dy)));
      return Math.hypot(q[0] - A.x - t * dx, q[1] - A.y - t * dy);
    }
    const ang = z => Math.atan2(z[1] - e.c[1], z[0] - e.c[0]), norm = z => { while (z > Math.PI) z -= 2 * Math.PI; while (z < -Math.PI) z += 2 * Math.PI; return z; };
    const a0 = ang([A.x, A.y]), da = norm(ang([B.x, B.y]) - a0), th = norm(ang(q) - a0);
    const dentro = da >= 0 ? th >= 0 && th <= da : th <= 0 && th >= da;
    return dentro ? Math.abs(Math.hypot(q[0] - e.c[0], q[1] - e.c[1]) - e.r) : Math.min(Math.hypot(q[0] - A.x, q[1] - A.y), Math.hypot(q[0] - B.x, q[1] - B.y));
  };
  const limpio = (idx, u, v) => {
    const A = nodos[u], B = nodos[v];
    for (let k = 1; k < 600; k++) {
      const q = [A.x + (B.x - A.x) * k / 600, A.y + (B.y - A.y) * k / 600];
      if (nodos.some(n => Math.hypot(n.x - q[0], n.y - q[1]) < 5)) continue;
      if (idx.some(i => distAlambre(q, E[i]) < 1)) return false;
    }
    return true;
  };
  const comps = cortados => {
    const grupo = E.map((_, i) => i);
    const raiz = i => (grupo[i] === i ? i : (grupo[i] = raiz(grupo[i])));
    nodos.forEach((_, n) => { if (cortados & (1 << n)) return; const ids = E.map((e, i) => i).filter(i => E[i].a === n || E[i].b === n); for (let k = 1; k < ids.length; k++) grupo[raiz(ids[k])] = raiz(ids[0]); });
    const g = {}; E.forEach((_, i) => (g[raiz(i)] = g[raiz(i)] || []).push(i));
    return Object.values(g);
  };
  const maximos = (idx, cortados) => {
    const ns = [...new Set(idx.flatMap(i => [E[i].a, E[i].b]))].filter(n => !(cortados & (1 << n)));
    const conjuntos = ns.map(n => 1 << n);
    for (const u of ns) for (const v of ns) if (u < v && limpio(idx, u, v)) {
      const A = nodos[u], B = nodos[v], len = Math.hypot(B.x - A.x, B.y - A.y);
      let m = 0;
      for (const n of ns) { const t = ((nodos[n].x - A.x) * (B.x - A.x) + (nodos[n].y - A.y) * (B.y - A.y)) / (len * len), d = Math.abs((nodos[n].x - A.x) * (B.y - A.y) - (nodos[n].y - A.y) * (B.x - A.x)) / len; if (d < 1.2 && t > -0.01 && t < 1.01) m |= 1 << n; }
      conjuntos.push(m);
    }
    return [...new Set(conjuntos)].filter(m => !conjuntos.some(o => o !== m && (o & m) === m));
  };
  const meta = (1 << nodos.length) - 1;
  let frente = [0]; const visto = new Set([0]);
  for (let r = 0; r < 12; r++) {
    if (frente.includes(meta)) return r;
    const sig = [];
    for (const c of frente) {
      let acc = [c];
      for (const idx of comps(c)) { const ms = maximos(idx, c); if (!ms.length) continue; acc = acc.flatMap(a => ms.map(m => a | m)); }
      for (const a of acc) if (!visto.has(a)) { visto.add(a); sig.push(a); }
    }
    frente = sig;
  }
  return NaN;
}
const recalcularTexto = p => (p._datos.tipo === 'tablero' ? tableroIndep(p) : p._datos.tipo === 'alambre' ? alambreIndep(p) : recalcular(p));
const igualCortes = (a, b) => (typeof a === 'number' && typeof b === 'number' ? Math.abs(a - b) < 1e-6 : a === b);
const genTexto = { ...gen, id: gen.id + ' (semillas de texto)', generar: s => gen.generar('p' + s) };
probarGenerador(genTexto, { semillas: 400, recalcular: recalcularTexto, igual: igualCortes });

test('las semillas numéricas no cambiaron y las de texto sacan el tablero y el alambre, en varias formas', () => {
  const nums = new Set(), txt = new Set(), formas = new Set();
  for (let s = 0; s < 200; s++) {
    nums.add(gen.generar(s)._datos.tipo);
    const d = genTexto.generar(s)._datos; txt.add(d.tipo);
    if (d.tipo === 'alambre') formas.add(d.forma.clase);
  }
  assert.ok(!nums.has('tablero') && !nums.has('alambre'));
  assert.ok(txt.has('tablero') && txt.has('alambre') && formas.has('rejilla') && formas.has('triangulos'));
});

test('las preguntas oficiales (UNMSM 2024-II y 2027-I) dan 4 cortes, y los números que ahí aparecen como opciones salen de errores con nombre', () => {
  const t = gen.generar('unmsm-2024-II-23'), a = gen.generar('unmsm-2027-I-25');
  for (const p of [t, a]) { assert.equal(p.respuesta.valor, 4); assert.equal(recalcularTexto(p), 4); assert.match(p.datos, /UNMSM/); }
  assert.equal(t._datos.cotas.j[1] + 1 - t._datos.cotas.j[0], 3);
  assert.equal(gen.calc.tablero(t._datos).N, 10);
  assert.equal(gen.calc.alambre(a._datos).trozos, 27);
  assert.equal(gen.calc.alambre(a._datos).nodos, 12);
  assert.equal(gen.calc.alambre(a._datos).enSitio, 6);
});

test('tablero: nunca menos de ⌈log₂ N⌉ cortes, la sierra corta no mejora a la larga, y cada corte parte cada pieza en dos', () => {
  for (let s = 0; s < 400; s++) {
    const d = genTexto.generar(s)._datos;
    if (d.tipo !== 'tablero') continue;
    const R = gen.calc.tablero(d), larga = gen.calc.tablero({ ...d, sierra: d.lado * 100 });
    assert.ok(larga.respuesta >= R.cotaLog && R.respuesta >= larga.respuesta, `semilla ${s}`);
    for (const ronda of R.rondas) for (const q of ronda) assert.ok(q.en.length === 2 && q.en[0] + q.en[1] === q.de, 'los cortes parten en dos');
    assert.equal(R.rondas.length, R.respuesta);
  }
});

test('alambre: el plan alinea un punto por trozo, cubre todos los puntos y su largo es la respuesta', () => {
  for (let s = 0; s < 300; s++) {
    const d = genTexto.generar(s)._datos;
    if (d.tipo !== 'alambre') continue;
    const R = gen.calc.alambre(d), vistos = new Set();
    for (const corte of R.plan) for (const g of corte) for (const n of g) { assert.ok(!vistos.has(n), `semilla ${s}: punto cortado dos veces`); vistos.add(n); }
    assert.equal(vistos.size, R.nodos);
    assert.equal(R.plan.length, R.respuesta);
    assert.ok(R.respuesta <= R.enSitio && R.respuesta < R.nodos);
  }
});

test('distractores del tablero y del alambre dicen lo que dicen', () => {
  for (let s = 0; s < 400; s++) {
    const p = genTexto.generar(s), d = p._datos, n = p.respuesta.valor;
    for (const a of p.alternativas.filter(x => x.error)) {
      const id = a.error.id;
      if (d.tipo === 'tablero') {
        const R = gen.calc.tablero(d);
        if (id === 'RMP35-pieza-por-pieza') assert.equal(a.valor, R.N - 1);
        if (id === 'RMP35-por-lineas') assert.equal(a.valor, R.enSitio);
        if (id === 'RMP36-log-abajo') assert.equal(a.valor, Math.floor(Math.log2(R.N)));
        if (id === 'RMP117-mitad') assert.equal(a.valor, Math.ceil(R.N / 2));
        if (id === 'RMP36-ignora-sierra') assert.equal(a.valor, gen.calc.tablero({ ...d, sierra: d.lado * 100 }).respuesta);
        assert.ok(a.valor !== n);
      }
      if (d.tipo === 'alambre') {
        const R = gen.calc.alambre(d);
        if (id === 'RMP35-sin-reacomodar') assert.ok(a.valor === R.enSitio && a.valor > n);
        if (id === 'RMP35-punto-por-punto') assert.equal(a.valor, R.nodos);
        if (id === 'RMP35-pieza-por-pieza') assert.equal(a.valor, R.trozos - 1);
        if (id === 'RMP119-de-a-dos') assert.equal(a.valor, Math.ceil(R.nodos / 2));
        if (id === 'RMP118-una-sola-recta') assert.equal(a.valor, 1);
      }
    }
  }
});

test('plancha: la búsqueda del generador es de verdad mínima en todas las planchas chicas (contra búsqueda en anchura)', () => {
  for (let m = 1; m <= 3; m++) for (let n = Math.max(m, 2); n <= 6; n++) for (const c of [null, 2, 3, 4]) {
    const r = gen.calc.plancha({ m, n, c }).respuesta;
    assert.equal(r, anchura(m, n, c || Infinity), `${m}×${n}, c = ${c}`);
  }
});

test('plancha: sin límite da ⌈log₂ m⌉ + ⌈log₂ n⌉, y con límite coincide con la cota que se explica', () => {
  for (let m = 1; m <= 6; m++) for (let n = Math.max(m, 2); n <= 12; n++) {
    assert.equal(gen.calc.plancha({ m, n, c: null }).respuesta, gen.calc.log2arriba(m) + gen.calc.log2arriba(n));
    if (m * n <= 24) for (const c of [2, 3, 4]) { const R = gen.calc.plancha({ m, n, c }); assert.equal(R.respuesta, R.cota, `${m}×${n}, c = ${c}`); }
  }
});

test('plancha: el plan del generador separa todo, con a lo más c piezas por corte', () => {
  for (const [m, n, c] of [[3, 5, 2], [4, 6, 3], [2, 7, 2], [1, 13, 3], [4, 4, null]]) {
    const R = gen.calc.plancha({ m, n, c });
    let piezas = [[m, n]];
    for (const corte of R.plan) {
      if (c) assert.ok(corte.length <= c);
      for (const e of corte) {
        const i = piezas.findIndex(([a, b]) => (a === e.de[0] && b === e.de[1]) || (a === e.de[1] && b === e.de[0]));
        assert.ok(i >= 0, 'el plan corta una pieza que no hay');
        piezas.splice(i, 1, ...e.en);
        assert.equal(e.en[0][0] * e.en[0][1] + e.en[1][0] * e.en[1][1], e.de[0] * e.de[1]);
      }
    }
    assert.ok(piezas.length === m * n && piezas.every(([a, b]) => a * b === 1));
    assert.equal(R.plan.length, R.respuesta);
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
