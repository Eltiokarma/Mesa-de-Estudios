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
 *       { id:'A2',   tipo:'amperimetro', a:..., b:..., Rint:2 },  // real: resistencia interna finita
 *       { id:'V2',   tipo:'voltimetro',  a:..., b:..., Rint:60 }, // real: deja pasar V/Rint
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
 *   - cable, interruptor cerrado y amperímetro ideal: R = 0 y fem = 0;
 *   - amperímetro y voltímetro reales: R = Rint y fem = 0; el voltímetro ideal no conduce.
 *
 * Salida de resolver():
 *   { ok, corto, avisos, V: { nodo: potencial },
 *     ramas: { id: { I, V, P } } }
 *   donde V es la caída V(a) − V(b) y P = I·V es la potencia que la rama recibe
 *   (negativa en una pila que entrega energía). Las pilas traen además
 *   entrega = fem·I e interna = I²·r. Los medidores traen Rint y lectura: I en el
 *   amperímetro y V(a) − V(b) en el voltímetro.
 *   Avisos: 'cortocircuito', 'en-corto' y 'pila-en-corto', 'reparto-supuesto',
 *   'lectura-indeterminada' (un amperímetro ideal en paralelo con otro camino sin
 *   resistencia: la física ideal no decide su corriente, y su lectura es NaN) y
 *   'nodo-flotante' (un nodo unido al resto solo por ramas que no conducen: su
 *   potencial no está determinado, y un voltímetro que lo toca marca NaN).
 *
 * Medidores (0.2.0).
 *   conectarMedidor(circuito, m), con m = { id, tipo:'amperimetro'|'voltimetro',
 *   modo:'serie'|'paralelo', rama?, lado?:'a'|'b', entre?:[n1, n2], Rint? }: en serie
 *   corta la rama `rama` del lado `lado` (un nodo nuevo `${id}@${rama}`) y lo
 *   intercala; en paralelo lo une a los nodos de `rama` o a los nodos `entre`.
 *   Trabaja sobre una copia. conectarMedidores pone primero los de serie (y cada
 *   grupo por id). La rama del medidor lleva `medido` con su puesto.
 *   El medidor ideal es exacto (R = 0, o no conduce), no 1e-9 ni 1e12 Ω; el real
 *   tiende al ideal cuando Rint → 0 (amperímetro) o Rint → ∞ (voltímetro).
 * PUESTOS_MIXTO: los diez lugares de la pestaña «Medir» sobre mixto() (pila n→p;
 *   B1 p→x; Rv x→y; B2 y B3 de y a z; retorno z→n):
 *   'B1-a' y 'B1-b': en serie con B1, del lado de la pila (p) o del lado de x;
 *   'B1-p': en paralelo con B1 (sus dos extremos);
 *   'B2-a', 'B2-b', 'B3-a', 'B3-b': en serie con B2 o B3, arriba (y) o abajo (z);
 *   'G-p': en paralelo con el grupo B2 ∥ B3 (entre y y z);
 *   'ret': en serie en el cable de regreso, del lado de z;
 *   'pila-p': en paralelo con la pila (entre p y n).
 *   Ninguno en paralelo con un cable (su lectura sería indeterminada).
 * efectoMedidor(base, con, id) → { lectura, magnitud, sinMedidor, diagnostico,
 *   apaga, cambioMax, error, errorRel }. La referencia es `con` sin ese medidor.
 *   sinMedidor solo trae la magnitud que el medidor mide bien conectado: I para un
 *   amperímetro en serie, V para un voltímetro en paralelo; lo demás es null.
 *   diagnostico:
 *     corto-pila: un amperímetro une los bornes de una pila (con Rint = 0, corto:
 *       lectura infinita; con Rint > 0, lectura finita y enorme);
 *     indeterminada: la física ideal no decide la lectura (NaN), o hay otro corto;
 *     corto-elemento: un amperímetro en paralelo con otra cosa (la deja en corto si
 *       es ideal, o le desvía la corriente si es real); nunca da bien ni carga;
 *     abre-circuito: un voltímetro ideal en serie deja sin corriente a la pila;
 *     abre-rama: un voltímetro ideal en serie apaga solo una parte (`apaga`);
 *     carga: un medidor real bien puesto que cambia un poco el circuito
 *       (cambioMax = mayor |ΔP|/P de las resistencias);
 *     bien: el circuito no cambió.
 * medidoresMixto(colocados, op) arma los puestos y resuelve; prediccionesMedidores()
 *   da los números de las cinco predicciones de «Medir», con `errores`.
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
      case 'cable': return { R: 0, fem: 0 };
      case 'amperimetro': {             // ideal: Rint = 0 (un cable que mide)
        const r = rama.Rint === undefined ? 0 : Number(rama.Rint);
        if (!(r >= 0) || r === Infinity) throw new Error(`rama ${rama.id}: un amperímetro necesita una resistencia interna finita y no negativa`);
        return { R: r, fem: 0 };
      }
      case 'voltimetro': {              // ideal: Rint = ∞ (no deja pasar corriente)
        const r = rama.Rint === undefined ? Infinity : Number(rama.Rint);
        if (!(r > 0)) throw new Error(`rama ${rama.id}: un voltímetro necesita una resistencia interna positiva (con 0 sería un cable)`);
        return r === Infinity ? null : { R: r, fem: 0 };
      }
      case 'interruptor': return rama.cerrado ? { R: 0, fem: 0 } : null;
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
    const entra = new Array(N).fill(0), indeterminada = new Set();
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
      if (ks.length > m - 1) {
        avisos.push({ tipo: 'reparto-supuesto', ramas: ks.filter(k => !enArbol.has(k)).map(k => ramas[k].id) });
        // Un amperímetro ideal dentro de un lazo de resistencia cero (en paralelo con un cable u otro amperímetro):
        // la física ideal no decide cuánta corriente pasa por él. Se avisa y su lectura queda indeterminada (NaN).
        for (const k of ks) {
          if (ramas[k].tipo !== 'amperimetro') continue;
          const otras = ks.filter(j => j !== k).map(j => [loc.get(idx.get(ramas[j].a)), loc.get(idx.get(ramas[j].b))]);
          const cc = componentes(m, otras);
          if (cc[loc.get(idx.get(ramas[k].a))] === cc[loc.get(idx.get(ramas[k].b))]) { indeterminada.add(k); avisos.push({ tipo: 'lectura-indeterminada', rama: ramas[k].id }); }
        }
      }
    }
    // Nodos flotantes: unidos al resto solo por ramas que no conducen (p. ej., entre dos voltímetros ideales).
    // Su potencial respecto de la tierra no está determinado: se avisa, y un voltímetro entre dos partes
    // que no se tocan por ramas que conducen tiene lectura indeterminada (NaN).
    const parteDe = i => compG[grupo[i]], parteTierra = parteDe(tierra);
    nodos.forEach((x, i) => { if (parteDe(i) !== parteTierra) avisos.push({ tipo: 'nodo-flotante', nodo: x }); });

    // 4. Salida.
    const salida = { ok: true, corto: false, avisos, V: {}, ramas: {} };
    nodos.forEach((x, i) => { salida.V[x] = limpio(V[i]); });
    ramas.forEach((r, k) => {
      const dv = limpio(V[idx.get(r.a)] - V[idx.get(r.b)]), i = limpio(I[k]);
      const o = { I: i, V: dv, P: limpio(i * dv) };
      if (r.tipo === 'pila') { o.fem = Number(r.fem) || 0; o.entrega = limpio(o.fem * i); o.interna = el[k] ? limpio(i * i * el[k].R) : 0; o.bornes = -dv; }
      if (r.tipo === 'voltimetro' || r.tipo === 'amperimetro') {
        o.Rint = el[k] ? el[k].R : Infinity;
        if (r.tipo === 'voltimetro') o.lectura = parteDe(idx.get(r.a)) === parteDe(idx.get(r.b)) ? dv : NaN;
        else o.lectura = indeterminada.has(k) ? NaN : i;
      }
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

  /* ---------- Medidores (0.2.0): conectarlos sin escribir los nodos a mano ---------- */

  const TIPOS_MEDIDOR = ['amperimetro', 'voltimetro'];
  const copiar = c => JSON.parse(JSON.stringify(c));

  function validarMedidor(m) {
    if (!m || !m.id) throw new Error('el medidor necesita un id');
    if (!TIPOS_MEDIDOR.includes(m.tipo)) throw new Error(`medidor ${m.id}: tipo "${m.tipo}" no es un medidor (amperimetro o voltimetro)`);
    if (m.modo !== 'serie' && m.modo !== 'paralelo') throw new Error(`medidor ${m.id}: modo "${m.modo}" (debe ser serie o paralelo)`);
    if (m.Rint !== undefined) {
      const r = Number(m.Rint);
      if (m.Rint === null || Number.isNaN(r) || r < 0) throw new Error(`medidor ${m.id}: resistencia interna inválida (${m.Rint})`);
      if (m.tipo === 'voltimetro' && r === 0) throw new Error(`medidor ${m.id}: un voltímetro con resistencia interna 0 sería un cable`);
      if (m.tipo === 'amperimetro' && r === Infinity) throw new Error(`medidor ${m.id}: un amperímetro con resistencia interna infinita no deja pasar corriente`);
    }
  }

  // Conecta un medidor a una COPIA del circuito (el original no cambia) y devuelve el circuito nuevo.
  //   m = { id, tipo:'amperimetro'|'voltimetro', Rint?, modo:'serie', rama, lado:'a'|'b' }
  //     | { id, tipo, Rint?, modo:'paralelo', rama }        entre los extremos de la rama (como estén en ese momento)
  //     | { id, tipo, Rint?, modo:'paralelo', entre:[u, v] } entre dos nodos con nombre
  //   serie, lado 'a': el medidor va de rama.a al nodo nuevo `${id}@${rama}` y la rama queda del nodo nuevo a rama.b
  //                    (mide la corriente de la rama en su sentido a→b).
  //   serie, lado 'b': la rama va de rama.a al nodo nuevo y el medidor del nodo nuevo a rama.b.
  //   paralelo: el medidor va de a = rama.a (o u) a b = rama.b (o v): lectura positiva si el potencial baja de a a b.
  // La rama del medidor lleva `medido` con el puesto, para efectoMedidor.
  function conectarMedidor(circuito, m) {
    validarMedidor(m);
    const c = copiar(circuito);
    c.ramas = c.ramas || [];
    if (c.ramas.some(r => r.id === m.id)) throw new Error(`id repetido: ya hay una rama ${m.id}`);
    const nodos = new Set(c.nodos || []);
    c.ramas.forEach(r => { nodos.add(r.a); nodos.add(r.b); });
    const med = { id: m.id, tipo: m.tipo };
    if (m.Rint !== undefined) med.Rint = Number(m.Rint);
    if (m.modo === 'serie') {
      if (!m.rama) throw new Error(`medidor ${m.id}: en serie hace falta la rama`);
      const r = c.ramas.find(x => x.id === m.rama);
      if (!r) throw new Error(`medidor ${m.id}: no existe la rama ${m.rama}`);
      const lado = m.lado === undefined ? 'a' : m.lado;
      if (lado !== 'a' && lado !== 'b') throw new Error(`medidor ${m.id}: lado "${m.lado}" (debe ser a o b)`);
      const nuevo = `${m.id}@${m.rama}`;
      if (nodos.has(nuevo)) throw new Error(`medidor ${m.id}: el nodo ${nuevo} ya existe`);
      if (lado === 'a') { med.a = r.a; med.b = nuevo; r.a = nuevo; }
      else { med.a = nuevo; med.b = r.b; r.b = nuevo; }
      med.medido = { modo: 'serie', rama: m.rama, lado };
      if (c.nodos) c.nodos.push(nuevo);
    } else if (m.entre) {
      if (!Array.isArray(m.entre) || m.entre.length !== 2) throw new Error(`medidor ${m.id}: entre debe tener dos nodos`);
      for (const x of m.entre) if (!nodos.has(x)) throw new Error(`medidor ${m.id}: no existe el nodo ${x}`);
      med.a = m.entre[0]; med.b = m.entre[1];
      med.medido = { modo: 'paralelo', entre: m.entre.slice() };
    } else {
      if (!m.rama) throw new Error(`medidor ${m.id}: en paralelo hace falta la rama o los nodos (entre)`);
      const r = c.ramas.find(x => x.id === m.rama);
      if (!r) throw new Error(`medidor ${m.id}: no existe la rama ${m.rama}`);
      med.a = r.a; med.b = r.b;
      med.medido = { modo: 'paralelo', rama: m.rama };
    }
    c.ramas.push(med);
    return c;
  }

  // Varios medidores: primero todos los de serie y después los de paralelo, cada grupo por id. Así el resultado no
  // depende del orden de la lista, y un voltímetro «en paralelo con B1» queda en los bornes de B1 aunque haya un
  // amperímetro en serie con ella.
  function conectarMedidores(circuito, lista) {
    const ids = new Set();
    for (const m of lista || []) { if (m && ids.has(m.id)) throw new Error(`id repetido: ${m.id}`); if (m) ids.add(m.id); }
    const orden = (lista || []).slice().sort((p, q) => (p.modo === q.modo ? (p.id < q.id ? -1 : p.id > q.id ? 1 : 0) : p.modo === 'serie' ? -1 : 1));
    return orden.reduce((c, m) => conectarMedidor(c, m), copiar(circuito));
  }

  const esResistencia = r => (r.tipo === 'resistencia' || r.tipo === 'bombilla') && !r.abierta;

  // Qué hace el medidor `id` en el circuito `con` (que puede tener otros medidores). La referencia es el mismo
  // circuito SIN ese medidor (en serie se cambia por un cable; en paralelo se quita), con los demás puestos.
  //   → { lectura, magnitud:'I'|'V', sinMedidor:{ I, V }, diagnostico, apaga:[ids], cambioMax, error, errorRel }
  //   sinMedidor: lo que había sin él (en serie, la corriente por ese punto; en paralelo, el voltaje entre sus puntas);
  //   error = lectura − (I o V de sinMedidor, según lo que mide).
  // diagnostico: 'corto-pila' | 'indeterminada' | 'corto-elemento' | 'abre-circuito' | 'abre-rama' | 'carga' | 'bien'.
  // `base` (el circuito sin ningún medidor) se acepta por simetría con medidoresMixto; no hace falta para la cuenta.
  function efectoMedidor(base, con, id) {
    const m = con.ramas.find(r => r.id === id);
    if (!m || !TIPOS_MEDIDOR.includes(m.tipo)) throw new Error(`no hay un medidor ${id}`);
    const ref = copiar(con);
    const k = ref.ramas.findIndex(r => r.id === id);
    if (m.medido && m.medido.modo === 'serie') ref.ramas[k] = { id, tipo: 'cable', a: m.a, b: m.b };
    else ref.ramas[k] = { id, tipo: 'cable', a: m.a, b: m.b, abierta: true };
    const sol = resolver(con), sr = resolver(ref);
    const magnitud = m.tipo === 'amperimetro' ? 'I' : 'V';
    const info = m.medido || {};
    let sinMedidor = { I: NaN, V: NaN };
    if (sr.ok) {
      // En serie: la corriente que pasa por donde va el medidor (el cable que lo reemplaza); en paralelo: el voltaje
      // entre sus puntas y, si está sobre una rama, la corriente de esa rama.
      const Vab = sr.V[m.a] - sr.V[m.b];
      // Solo la magnitud que el medidor mide bien conectado; si está mal puesto, no mide nada de ese lugar.
      if (m.tipo === 'amperimetro' && info.modo === 'serie') sinMedidor = { I: sr.ramas[id].I, V: null };
      else if (m.tipo === 'voltimetro' && info.modo === 'paralelo') sinMedidor = { I: null, V: Vab };
      else sinMedidor = { I: null, V: null };
    }
    const ideal = magnitud === 'I' ? sinMedidor.I : sinMedidor.V;
    const unePila = con.ramas.some(r => r.tipo === 'pila' && ((r.a === m.a && r.b === m.b) || (r.a === m.b && r.b === m.a)));
    const salida = (lectura, diagnostico, apaga, cambioMax) => {
      const error = typeof ideal === 'number' && Number.isFinite(lectura) ? lectura - ideal : NaN;
      return { lectura, magnitud, sinMedidor, diagnostico, apaga, cambioMax, error, errorRel: ideal ? error / ideal : NaN };
    };
    if (sol.corto) return salida(sol.lazo.includes(id) && m.tipo === 'amperimetro' ? Infinity : NaN, sol.lazo.includes(id) ? 'corto-pila' : 'indeterminada', [], NaN);
    const lectura = sol.ramas[id].lectura;
    // Ramas que se apagan y mayor cambio relativo de potencia en las resistencias.
    const apaga = [];
    let cambioMax = 0;
    for (const r of con.ramas.filter(esResistencia)) {
      const P0 = sr.ok ? sr.ramas[r.id].P : 0, P1 = sol.ramas[r.id].P;
      if (P0 > 1e-12 && Math.abs(P1) <= 1e-12) apaga.push(r.id);
      if (P0 > 1e-12) cambioMax = Math.max(cambioMax, Math.abs(P1 - P0) / P0);
      else if (Math.abs(P1) > 1e-12) cambioMax = Infinity;
    }
    if (Number.isNaN(lectura)) return salida(lectura, 'indeterminada', apaga, cambioMax);
    if (!sr.ok) return salida(lectura, 'indeterminada', apaga, NaN);
    // Un amperímetro en paralelo nunca está bien puesto: con una pila es un cortocircuito (finito si Rint > 0),
    // y con cualquier otra cosa la deja en corto o le desvía la corriente.
    if (m.tipo === 'amperimetro' && info.modo === 'paralelo') return salida(lectura, unePila ? 'corto-pila' : 'corto-elemento', apaga, cambioMax);
    const enCorto = s => new Set(s.avisos.filter(a => a.tipo === 'en-corto').map(a => a.rama));
    const antes = enCorto(sr), ahora = enCorto(sol);
    const pilas = con.ramas.filter(r => r.tipo === 'pila');
    if (m.tipo === 'amperimetro' && [...ahora].some(x => !antes.has(x) && x !== id && con.ramas.some(r => r.id === x && esResistencia(r))))
      return salida(lectura, 'corto-elemento', apaga, cambioMax);
    if (m.tipo === 'voltimetro' && m.Rint === undefined) {
      const sinI = s => pilas.every(p => Math.abs(s.ramas[p.id].I) <= 1e-12);
      if (pilas.length && sinI(sol) && !sinI(sr)) return salida(lectura, 'abre-circuito', apaga, cambioMax);
      if (apaga.length) return salida(lectura, 'abre-rama', apaga, cambioMax);
    }
    return salida(lectura, cambioMax > 1e-9 ? 'carga' : 'bien', apaga, cambioMax);
  }

  // Puestos de la pestaña «Medir» sobre el circuito mixto (la geometría vive en el HTML). No hay ninguno en paralelo
  // con un cable: su lectura sería indeterminada (lo vigila una prueba).
  const PUESTOS_MIXTO = {
    'B1-a': { modo: 'serie', rama: 'B1', lado: 'a' },
    'B1-b': { modo: 'serie', rama: 'B1', lado: 'b' },
    'B1-p': { modo: 'paralelo', rama: 'B1' },
    'B2-a': { modo: 'serie', rama: 'B2', lado: 'a' },
    'B2-b': { modo: 'serie', rama: 'B2', lado: 'b' },
    'G-p': { modo: 'paralelo', entre: ['y', 'z'] },
    'B3-a': { modo: 'serie', rama: 'B3', lado: 'a' },
    'B3-b': { modo: 'serie', rama: 'B3', lado: 'b' },
    'ret': { modo: 'serie', rama: 'retorno', lado: 'a' },
    'pila-p': { modo: 'paralelo', entre: ['p', 'n'] },
  };
  const NOMBRE_MEDIDOR = { A: 'amperimetro', V: 'voltimetro' };

  // Lo que la escena llama al soltar un medidor. colocados = { A:{ puesto, Rint? }, V:{ puesto, Rint? } }
  // (un medidor sin puesto, o con puesto null o 'bandeja', está en la bandeja); op = opciones de mixto().
  //   → { base, circuito, sol, solBase, efecto:{ A?, V? } }
  function medidoresMixto(colocados, op) {
    const base = mixto(op), lista = [], usados = {};
    for (const [id, x] of Object.entries(colocados || {})) {
      if (!NOMBRE_MEDIDOR[id]) throw new Error(`medidor desconocido: ${id} (A o V)`);
      if (!x || x.puesto === undefined || x.puesto === null || x.puesto === 'bandeja') continue;
      const p = PUESTOS_MIXTO[x.puesto];
      if (!p) throw new Error(`puesto desconocido: ${x.puesto}`);
      if (usados[x.puesto]) throw new Error(`dos medidores en el mismo puesto: ${x.puesto}`);
      usados[x.puesto] = id;
      lista.push(Object.assign({ id, tipo: NOMBRE_MEDIDOR[id] }, p, x.Rint === undefined ? {} : { Rint: x.Rint }));
    }
    const circuito = conectarMedidores(base, lista);
    const efecto = {};
    for (const m of lista) efecto[m.id] = efectoMedidor(base, circuito, m.id);
    return { base, circuito, sol: resolver(circuito), solBase: resolver(base), efecto };
  }

  // Números de las cinco predicciones de la pestaña «Medir» (circuito mixto de 6 V con tres bombillas de 12 Ω).
  // Cada una trae la opción correcta (ok), lo que pasa de verdad (correcta) y, en `errores`, lo que daría el
  // razonamiento de cada opción incorrecta. P1, P2 y P3 son las potencias de B1, B2 y B3; pila es su corriente.
  function prediccionesMedidores() {
    const mm = c => medidoresMixto(c);
    const pot = s => ({ P1: s.ramas.B1.P, P2: s.ramas.B2.P, P3: s.ramas.B3.P, pila: s.ramas.pila.I });
    const s0 = resolver(mixto()), b0 = pot(s0);
    const V1 = s0.ramas.B1.V, I1 = s0.ramas.B1.I, I2 = s0.ramas.B2.I;
    const sinLuz = { P1: 0, P2: 0, P3: 0 };
    // M0: amperímetro ideal en serie con B1, del lado de la pila.
    const r0 = mm({ A: { puesto: 'B1-a' } }), comoBombilla = mm({ A: { puesto: 'B1-a', Rint: 12 } });
    // M1: dónde va para medir B2.
    const lect = p => mm({ A: { puesto: p } }).efecto.A;
    // M2: amperímetro ideal en paralelo con B1.
    const r2 = mm({ A: { puesto: 'B1-p' } });
    // M3: voltímetro ideal en serie con todo.
    const r3 = mm({ V: { puesto: 'B1-a' } });
    // M4: voltímetro real de 60 Ω en paralelo con B1. «Se suma a B1»: el tramo como 12 + 60 Ω en serie.
    const r4 = mm({ V: { puesto: 'B1-p', Rint: 60 } });
    const R1 = 12, Rp = 6, Rv4 = 60, fem = 6;
    const suma = fem * (R1 + Rv4) / (R1 + Rv4 + Rp);
    const tablaRV = [60, 600, 6000, 60000, Infinity].map(R => ({ Rint: R, lectura: mm({ V: R === Infinity ? { puesto: 'B1-p' } : { puesto: 'B1-p', Rint: R } }).efecto.V.lectura }));
    return {
      M0: { problema: 'medir-amperimetro-en-serie', ok: 'a',
        correcta: Object.assign({ lectura: r0.efecto.A.lectura, diagnostico: r0.efecto.A.diagnostico }, pot(r0.sol)),
        errores: {
          b: Object.assign({ lectura: comoBombilla.efecto.A.lectura }, pot(comoBombilla.sol)),   // «como otra bombilla» de 12 Ω
          c: { lecturaMayorQue: I1, P1: b0.P1 },                                                  // más de 1/3 A antes de B1
          d: Object.assign({ lectura: 0 }, sinLuz),                                               // «cortar el cable abre»
        } },
      M1: { problema: 'medir-donde-amperimetro', ok: 'a',
        correcta: { puesto: 'B2-a', lectura: lect('B2-a').lectura, diagnostico: lect('B2-a').diagnostico },
        errores: {
          b: { puesto: 'G-p', lectura: lect('G-p').lectura, diagnostico: lect('G-p').diagnostico, apaga: lect('G-p').apaga },
          c: { puesto: 'ret', lectura: lect('ret').lectura },
          d: { puesto: 'B1-a', lectura: lect('B1-a').lectura },
        }, sinMedidor: { I2 } },
      M2: { problema: 'medir-amperimetro-en-paralelo', ok: 'c',
        correcta: Object.assign({ lectura: r2.efecto.A.lectura, diagnostico: r2.efecto.A.diagnostico, apaga: r2.efecto.A.apaga }, pot(r2.sol)),
        errores: {
          a: Object.assign({ lectura: I1 }, b0),       // todo igual y marca lo de B1
          b: Object.assign({ lectura: 0 }, b0),        // todo igual y casi 0 A
          d: Object.assign({ lectura: 0 }, sinLuz),    // se apagan las tres
        },
        pilaEnCorto: mm({ A: { puesto: 'pila-p' } }).sol.corto },
      M3: { problema: 'medir-voltimetro-en-serie', ok: 'd',
        correcta: Object.assign({ lectura: r3.efecto.V.lectura, diagnostico: r3.efecto.V.diagnostico, apaga: r3.efecto.V.apaga }, pot(r3.sol)),
        errores: {
          a: Object.assign({ lectura: V1 }, b0),                         // todo igual y marca lo de B1
          b: Object.assign({ lectura: 0 }, b0),                          // deja pasar la corriente: un cable
          c: Object.assign({ lectura: 0, I: 0 }, sinLuz),                // sin corriente no hay voltaje
        },
        enB2: mm({ V: { puesto: 'B2-a' } }).efecto.V.lectura },
      M4: { problema: 'medir-voltimetro-real', ok: 'b',
        correcta: { lectura: r4.efecto.V.lectura, diagnostico: r4.efecto.V.diagnostico, errorRel: r4.efecto.V.errorRel,
          I: r4.sol.ramas.V.I, pila: r4.sol.ramas.pila.I, Rtramo: R1 * Rv4 / (R1 + Rv4) },
        errores: {
          a: { lectura: V1 },                          // no cambia nada
          c: { lectura: suma },                        // 12 + 60 Ω en serie: 72/13 V
          d: { lectura: V1 / 2 },                      // reparto por mitades de los 4 V del tramo: 2 V
        },
        tablaRV },
    };
  }

  return { resolver, mixto, mcdermott, pilas, resistenciaVista, balanceNodos,
    conectarMedidor, conectarMedidores, efectoMedidor, PUESTOS_MIXTO, medidoresMixto, prediccionesMedidores };
});
