/*
 * Motor de Circuitos de corriente continua.
 *
 * Aquí vive toda la física de la plantilla (regla 1 de CLAUDE.md). No toca el
 * DOM: funciona igual en el navegador (window.MotorCircuito) y en Node
 * (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Un circuito es una lista de ramas entre nodos:
 *
 *   {
 *     ramas: [
 *       { id:'pila', tipo:'pila', a:'n', b:'p', fem:6, r:0 },   // a = borne −, b = borne +
 *       { id:'B1',   tipo:'resistencia', a:'p', b:'x', R:12 },
 *       { id:'k1',   tipo:'interruptor', a:'x', b:'y', cerrado:true },
 *       { id:'c1',   tipo:'cable', a:'y', b:'n' },
 *       { id:'A1',   tipo:'amperimetro', a:..., b:... },          // ideal: resistencia cero
 *       { id:'V1',   tipo:'voltimetro',  a:..., b:... },          // ideal: no deja pasar corriente
 *     ],
 *     nodos: ['n', 'p', ...],   // opcional: se deducen de las ramas
 *     tierra: 'n',              // opcional: nodo de potencial 0 (por defecto, el primero)
 *   }
 *
 * Cualquier rama con abierta:true se trata como si no estuviera (la bombilla
 * quitada del portalámparas). Un interruptor abierto, igual.
 *
 * Convención de signos. La corriente I de una rama se cuenta de a hacia b.
 * Toda rama cumple  V(a) − V(b) = I·R − fem :
 *   - resistencia: fem = 0, así que V(a) − V(b) = I·R (la corriente baja el potencial);
 *   - pila: R = r (resistencia interna) y la fem sube el potencial de a (−) a b (+);
 *   - cable, interruptor cerrado y amperímetro: R = 0 y fem = 0.
 *
 * Salida de resolver():
 *   { ok, corto, avisos, V: { nodo: potencial },
 *     ramas: { id: { I, V, P } } }
 *   donde V es la caída V(a) − V(b) y P = I·V es la potencia que la rama recibe
 *   (negativa en una pila que entrega energía). Las pilas traen además
 *   entrega = fem·I e interna = I²·r. Los voltímetros traen lectura = V(a) − V(b).
 *
 * Método: análisis nodal con "supernodos". Primero se juntan los nodos unidos
 * por ramas de resistencia cero (cables y pilas ideales): dentro de cada grupo,
 * el potencial de cada nodo queda fijo respecto de los demás. Si en uno de esos
 * grupos se cierra un lazo cuya fem neta no es cero, una pila ideal está en corto:
 * la corriente sería infinita, así que se avisa (corto: true) y no se divide
 * entre cero. Después se resuelven las ecuaciones de nodos (ley de corrientes
 * de Kirchhoff) entre los grupos, con eliminación de Gauss. Las corrientes de
 * las ramas de resistencia cero salen de la ley de nodos; si dos de ellas están
 * en paralelo (dos cables, o dos pilas ideales iguales), el reparto no está
 * determinado por la física ideal y se toma el reparto en partes iguales.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorCircuito = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const EPS = 1e-12;

  // Resistencia y fem de una rama; null si no conduce (abierta, voltímetro).
  function electrica(rama) {
    if (rama.abierta) return null;
    switch (rama.tipo) {
      case 'resistencia': case 'bombilla': {
        const R = Number(rama.R);
        if (!(R >= 0)) throw new Error(`rama ${rama.id}: resistencia inválida (${rama.R})`);
        if (R === Infinity) return null;
        return { R, fem: 0 };
      }
      case 'pila': {
        const r = rama.r === undefined ? 0 : Number(rama.r);
        if (!(r >= 0) || r === Infinity) throw new Error(`rama ${rama.id}: resistencia interna inválida`);
        return { R: r, fem: Number(rama.fem) || 0 };
      }
      case 'cable': case 'amperimetro': return { R: 0, fem: 0 };
      case 'interruptor': return rama.cerrado ? { R: 0, fem: 0 } : null;
      case 'voltimetro': return null;
      default: throw new Error(`rama ${rama.id}: tipo desconocido "${rama.tipo}"`);
    }
  }

  // Eliminación de Gauss con pivoteo parcial. A es n×n, b de largo n. Devuelve x o null si es singular.
  function gauss(A, b) {
    const n = b.length, M = A.map((fila, i) => fila.concat([b[i]]));
    for (let c = 0; c < n; c++) {
      let p = c;
      for (let f = c + 1; f < n; f++) if (Math.abs(M[f][c]) > Math.abs(M[p][c])) p = f;
      if (Math.abs(M[p][c]) < 1e-14) return null;
      [M[c], M[p]] = [M[p], M[c]];
      for (let f = 0; f < n; f++) {
        if (f === c) continue;
        const k = M[f][c] / M[c][c];
        if (k) for (let j = c; j <= n; j++) M[f][j] -= k * M[c][j];
      }
    }
    return M.map((fila, i) => fila[n] / fila[i]);
  }

  // Componentes conexas de un grafo dado por aristas [u, v] sobre los índices 0..n-1.
  function componentes(n, aristas) {
    const padre = Array.from({ length: n }, (_, i) => i);
    const raiz = i => (padre[i] === i ? i : (padre[i] = raiz(padre[i])));
    for (const [u, v] of aristas) padre[raiz(u)] = raiz(v);
    return Array.from({ length: n }, (_, i) => raiz(i));
  }

  function resolver(circuito) {
    const ramas = circuito.ramas || [];
    const ids = new Set();
    const nodos = (circuito.nodos || []).slice();
    for (const r of ramas) {
      if (!r.id) throw new Error('cada rama necesita un id');
      if (ids.has(r.id)) throw new Error(`rama repetida: ${r.id}`);
      ids.add(r.id);
      for (const x of [r.a, r.b]) if (!nodos.includes(x)) nodos.push(x);
    }
    const idx = new Map(nodos.map((x, i) => [x, i]));
    const N = nodos.length;
    const el = ramas.map(electrica);

    // 1. Grupos unidos por ramas de resistencia cero, con el potencial de cada nodo
    //    relativo a la raíz del grupo (off) y un árbol para reconstruir el lazo de un corto.
    const cero = ramas.map((r, k) => k).filter(k => el[k] && el[k].R === 0);
    const vecinos = Array.from({ length: N }, () => []);
    for (const k of cero) {
      const a = idx.get(ramas[k].a), b = idx.get(ramas[k].b);
      vecinos[a].push([b, k, +1]); vecinos[b].push([a, k, -1]);
    }
    const grupo = new Array(N).fill(-1), off = new Array(N).fill(0), padre = new Array(N).fill(null);
    const enArbol = new Set();
    let nG = 0;
    for (let s = 0; s < N; s++) {
      if (grupo[s] >= 0) continue;
      grupo[s] = nG; const cola = [s];
      while (cola.length) {
        const u = cola.shift();
        for (const [v, k, sg] of vecinos[u]) {
          if (grupo[v] >= 0) continue;
          // Recorrida en su sentido (a→b), la rama sube el potencial en fem.
          grupo[v] = nG; off[v] = off[u] + sg * el[k].fem; padre[v] = [u, k]; enArbol.add(k);
          cola.push(v);
        }
      }
      nG++;
    }
    // Lazos de resistencia cero: su fem neta debe ser cero.
    const camino = i => { const l = []; while (padre[i]) { l.push(padre[i][1]); i = padre[i][0]; } return l; };
    for (const k of cero) {
      if (enArbol.has(k)) continue;
      const a = idx.get(ramas[k].a), b = idx.get(ramas[k].b);
      const falta = off[b] - off[a] - el[k].fem;
      const escala = Math.max(1, Math.abs(off[a]), Math.abs(off[b]), Math.abs(el[k].fem));
      if (Math.abs(falta) > 1e-9 * escala) {
        const ca = camino(a), cb = camino(b);
        const comun = new Set(ca.filter(x => cb.includes(x)));
        const lazo = [k].concat(ca.filter(x => !comun.has(x)), cb.filter(x => !comun.has(x))).map(j => ramas[j].id);
        const pilas = lazo.filter(id => ramas.find(r => r.id === id).tipo === 'pila');
        return {
          ok: false, corto: true, lazo, pilas, avisos: [{ tipo: 'cortocircuito', lazo, pilas }],
          mensaje: 'Cortocircuito: una pila ideal queda unida por un camino sin resistencia. La corriente sería infinita.',
          V: {}, ramas: {},
        };
      }
    }

    // 2. Ecuaciones de nodos entre grupos. Ramas con resistencia: I = (V(a) − V(b) + fem)/R.
    const resist = ramas.map((r, k) => k).filter(k => el[k] && el[k].R > 0);
    const avisos = [];
    for (const k of resist) {
      // En corto: sus dos extremos unidos por un camino sin resistencia y sin pilas.
      const ia = idx.get(ramas[k].a), ib = idx.get(ramas[k].b);
      if (grupo[ia] === grupo[ib] && Math.abs(off[ia] - off[ib]) < 1e-12) avisos.push({ tipo: ramas[k].tipo === 'pila' ? 'pila-en-corto' : 'en-corto', rama: ramas[k].id });
    }
    // Cada grupo conectado (por cualquier rama que conduce) toma una referencia.
    const compG = componentes(nG, resist.map(k => [grupo[idx.get(ramas[k].a)], grupo[idx.get(ramas[k].b)]]));
    const libres = [], pos = new Array(nG).fill(-1), refDe = new Map();
    const tierra = circuito.tierra !== undefined && idx.has(circuito.tierra) ? idx.get(circuito.tierra) : 0;
    const orden = [tierra].concat(nodos.map((_, i) => i).filter(i => i !== tierra));
    for (const i of orden) { const c = compG[grupo[i]]; if (!refDe.has(c)) refDe.set(c, i); }
    const refGrupo = new Set([...refDe.values()].map(i => grupo[i]));
    for (let g = 0; g < nG; g++) if (!refGrupo.has(g)) { pos[g] = libres.length; libres.push(g); }
    const n = libres.length;
    const G = Array.from({ length: n }, () => new Array(n).fill(0)), b = new Array(n).fill(0);
    for (const k of resist) {
      const ia = idx.get(ramas[k].a), ib = idx.get(ramas[k].b), ga = grupo[ia], gb = grupo[ib];
      if (ga === gb) continue;
      const g = 1 / el[k].R, fuente = g * (off[ia] - off[ib] + el[k].fem); // corriente a→b si U(ga) = U(gb)
      const pa = pos[ga], pb = pos[gb];
      if (pa >= 0) { G[pa][pa] += g; b[pa] -= fuente; if (pb >= 0) G[pa][pb] -= g; }
      if (pb >= 0) { G[pb][pb] += g; b[pb] += fuente; if (pa >= 0) G[pb][pa] -= g; }
    }
    const U = new Array(nG).fill(0);
    if (n) {
      const x = gauss(G, b);
      if (!x) throw new Error('el sistema de ecuaciones no tiene solución única');
      libres.forEach((g, j) => { U[g] = x[j]; });
    }
    // Potenciales: el nodo de referencia de cada parte queda en 0.
    const V = new Array(N);
    for (let i = 0; i < N; i++) V[i] = U[grupo[i]] + off[i];
    for (const [c, iRef] of refDe) {
      const v0 = V[iRef];
      for (let i = 0; i < N; i++) if (compG[grupo[i]] === c) V[i] -= v0;
    }
    const limpio = x => (Math.abs(x) < EPS ? 0 : x);

    // 3. Corrientes.
    const I = new Array(ramas.length).fill(0);
    for (const k of resist) {
      const ia = idx.get(ramas[k].a), ib = idx.get(ramas[k].b);
      I[k] = (V[ia] - V[ib] + el[k].fem) / el[k].R;
    }
    // Ramas de resistencia cero: ley de nodos dentro de cada grupo. Se reparte con el
    // mínimo de corriente total (como si cada una tuviera la misma resistencia pequeña).
    const entra = new Array(N).fill(0);
    for (const k of resist) { entra[idx.get(ramas[k].a)] -= I[k]; entra[idx.get(ramas[k].b)] += I[k]; }
    for (let g = 0; g < nG; g++) {
      const miembros = []; for (let i = 0; i < N; i++) if (grupo[i] === g) miembros.push(i);
      if (miembros.length < 2) continue;
      const loc = new Map(miembros.map((i, j) => [i, j])), m = miembros.length;
      const ks = cero.filter(k => grupo[idx.get(ramas[k].a)] === g);
      const Lp = Array.from({ length: m - 1 }, () => new Array(m - 1).fill(0)), q = new Array(m - 1).fill(0);
      for (const k of ks) {
        const a = loc.get(idx.get(ramas[k].a)) - 1, bb = loc.get(idx.get(ramas[k].b)) - 1;
        if (a >= 0) Lp[a][a] += 1; if (bb >= 0) Lp[bb][bb] += 1;
        if (a >= 0 && bb >= 0) { Lp[a][bb] -= 1; Lp[bb][a] -= 1; }
      }
      miembros.forEach((i, j) => { if (j) q[j - 1] = entra[i]; });
      const phi = [0].concat(m > 1 ? gauss(Lp, q) || new Array(m - 1).fill(0) : []);
      for (const k of ks) I[k] = phi[loc.get(idx.get(ramas[k].a))] - phi[loc.get(idx.get(ramas[k].b))];
      if (ks.length > m - 1) avisos.push({ tipo: 'reparto-supuesto', ramas: ks.filter(k => !enArbol.has(k)).map(k => ramas[k].id) });
    }

    // 4. Salida.
    const salida = { ok: true, corto: false, avisos, V: {}, ramas: {} };
    nodos.forEach((x, i) => { salida.V[x] = limpio(V[i]); });
    ramas.forEach((r, k) => {
      const dv = limpio(V[idx.get(r.a)] - V[idx.get(r.b)]), i = limpio(I[k]);
      const o = { I: i, V: dv, P: limpio(i * dv) };
      if (r.tipo === 'pila') { o.fem = Number(r.fem) || 0; o.entrega = limpio(o.fem * i); o.interna = el[k] ? limpio(i * i * el[k].R) : 0; o.bornes = -dv; }
      if (r.tipo === 'voltimetro') o.lectura = dv;
      if (r.tipo === 'amperimetro') o.lectura = i;
      salida.ramas[r.id] = o;
    });
    return salida;
  }

  /* ---------- Circuitos de la escena ---------- */

  // Problema guiado: B1 en serie con (B2 ∥ B3). Rv es un reóstato entre B1 y el paralelo
  // (0 = un cable). b1, b2, b3 = false quita esa bombilla del portalámparas.
  // Nodos: n (borne −), p (borne +), x (después de B1), y (entrada del paralelo), z (salida).
  function mixto(op) {
    const o = Object.assign({ fem: 6, r: 0, R1: 12, R2: 12, R3: 12, Rv: 0, b1: true, b2: true, b3: true }, op);
    return {
      nodos: ['n', 'p', 'x', 'y', 'z'], tierra: 'n',
      ramas: [
        { id: 'pila', tipo: 'pila', a: 'n', b: 'p', fem: o.fem, r: o.r },
        { id: 'B1', tipo: 'resistencia', a: 'p', b: 'x', R: o.R1, abierta: !o.b1 },
        { id: 'Rv', tipo: 'resistencia', a: 'x', b: 'y', R: o.Rv },
        { id: 'B2', tipo: 'resistencia', a: 'y', b: 'z', R: o.R2, abierta: !o.b2 },
        { id: 'B3', tipo: 'resistencia', a: 'y', b: 'z', R: o.R3, abierta: !o.b3 },
        { id: 'retorno', tipo: 'cable', a: 'z', b: 'n' },
      ],
    };
  }

  // Los tres circuitos de McDermott: una bombilla sola, dos en serie y dos en paralelo,
  // cada uno con su propia pila igual.
  function mcdermott(op) {
    const o = Object.assign({ fem: 6, R: 12 }, op);
    const pila = { id: 'pila', tipo: 'pila', a: 'n', b: 'p', fem: o.fem, r: 0 };
    return {
      sola: { tierra: 'n', ramas: [pila, { id: 'A', tipo: 'resistencia', a: 'p', b: 'n', R: o.R }] },
      serie: { tierra: 'n', ramas: [pila, { id: 'B', tipo: 'resistencia', a: 'p', b: 'm', R: o.R }, { id: 'C', tipo: 'resistencia', a: 'm', b: 'n', R: o.R }] },
      paralelo: { tierra: 'n', ramas: [pila, { id: 'D', tipo: 'resistencia', a: 'p', b: 'n', R: o.R }, { id: 'E', tipo: 'resistencia', a: 'p', b: 'n', R: o.R }] },
    };
  }

  // Dos pilas y una bombilla. modo: 'una' (solo P1), 'serie', 'paralelo' u 'oposicion'.
  // En oposición, P2 se conecta al revés: su borne + mira al + de P1.
  function pilas(op) {
    const o = Object.assign({ modo: 'serie', fem1: 1.5, fem2: 1.5, r1: 0, r2: 0, R: 3 }, op);
    const bomb = { id: 'B', tipo: 'resistencia', a: 'p', b: 'n', R: o.R };
    const P1 = { id: 'P1', tipo: 'pila', fem: o.fem1, r: o.r1 };
    const P2 = { id: 'P2', tipo: 'pila', fem: o.fem2, r: o.r2 };
    switch (o.modo) {
      case 'una': return { tierra: 'n', ramas: [Object.assign(P1, { a: 'n', b: 'p' }), bomb] };
      case 'serie': return { tierra: 'n', ramas: [Object.assign(P1, { a: 'n', b: 'm' }), Object.assign(P2, { a: 'm', b: 'p' }), bomb] };
      case 'paralelo': return { tierra: 'n', ramas: [Object.assign(P1, { a: 'n', b: 'p' }), Object.assign(P2, { a: 'n', b: 'p' }), bomb] };
      case 'oposicion': return { tierra: 'n', ramas: [Object.assign(P1, { a: 'n', b: 'm' }), Object.assign(P2, { a: 'p', b: 'm' }), bomb] };
      default: throw new Error(`modo de pilas desconocido: ${o.modo}`);
    }
  }

  // Resistencia equivalente que "ve" una pila (la del resto del circuito): voltaje en sus bornes / I.
  function resistenciaVista(sol, idPila) {
    const p = sol.ramas[idPila];
    if (!sol.ok || !p) return NaN;
    return p.I === 0 ? Infinity : p.bornes / p.I;
  }

  // Suma de corrientes que salen de cada nodo (debe ser 0). Sirve para las pruebas y para depurar.
  function balanceNodos(circuito, sol) {
    const b = {};
    for (const r of circuito.ramas) {
      b[r.a] = (b[r.a] || 0) + sol.ramas[r.id].I;
      b[r.b] = (b[r.b] || 0) - sol.ramas[r.id].I;
    }
    return b;
  }

  return { resolver, mixto, mcdermott, pilas, resistenciaVista, balanceNodos };
});
