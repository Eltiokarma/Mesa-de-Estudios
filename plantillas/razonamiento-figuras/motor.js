/*
 * Motor de «El reflector de figuras»: conteo de segmentos, triángulos, cuadriláteros, cuadrados, rectángulos y cubos.
 *
 * Aquí vive todo el conteo de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el navegador
 * (window.MotorFiguras) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 * Cada conteo se hace dos veces: por FUERZA BRUTA sobre la figura (puntos y segmentos) y por la FÓRMULA de academia.
 * Las pruebas comprueban que las dos cuentas coinciden.
 *
 * CONVENCIONES
 *   Puntos del plano: { x, y }, con el eje y hacia arriba. Dos puntos a menos de 1e-7 son el mismo punto.
 *   Una FIGURA es { lineas: [[P, Q], …], puntos?: [{x,y}] }: cada línea es un segmento DIBUJADO entero, de P a Q;
 *   'puntos' (opcional) son puntos marcados sobre las líneas (por ejemplo, los puntos de una recta).
 *   C(n, 2) = n(n − 1)/2 (combinaciones de n en 2). Σk² = 1² + 2² + … + k².
 *
 * ARMADO DE LA FIGURA
 *   armar(fig)   → { puntos:[{x,y}], lineas:[[índices de los puntos de la línea, ordenados a lo largo de ella]],
 *                    aristas:[[i, j]] (tramos elementales: dos puntos consecutivos de una misma línea),
 *                    caras:[[índices]] (las PIEZAS: regiones en que las líneas parten el plano, sin la de afuera,
 *                    cada una con sus vértices en sentido antihorario), conecta(i, j) }.
 *                  Los puntos son los extremos de las líneas, los puntos marcados y todos los cruces entre líneas
 *                  (un extremo o un punto marcado que cae sobre una línea también es un punto de esa línea). Dos puntos están CONECTADOS si hay una línea que
 *                  pasa por los dos: entonces el segmento que los une está dibujado.
 *
 * CONTEO POR FUERZA BRUTA
 *   contar(fig, tipo)   tipo: 'segmentos' | 'triangulos' | 'cuadrilateros' | 'cuadrados' | 'rectangulos'.
 *     segmentos      pares {i, j} de puntos conectados.
 *     triangulos     ternas de puntos conectados de dos en dos y no alineados.
 *     cuadrilateros  cuatro puntos A, B, C, D con AB, BC, CD y DA dibujados, sin tres de ellos alineados, que formen
 *                    un cuadrilátero CONVEXO (como se cuenta en academia: los cóncavos no entran). Cada uno, una vez.
 *     cuadrados      cuadriláteros con los cuatro lados iguales y los cuatro ángulos rectos.
 *     rectangulos    cuadriláteros con los cuatro ángulos rectos (los cuadrados SÍ son rectángulos).
 *   Devuelve { tipo, total, lista:[{ vertices:[índices], pts:[{x,y}], tamano }], porTamano:{ tamaño: cuántas },
 *              piezas, compuestas, puntos, caras, errores }.
 *     En los cuadriláteros, cada uno trae además rectangulo y cuadrado (true o false).
 *     tamano de un polígono = cuántas piezas (caras de armar) tiene adentro; de un segmento = cuántos tramos
 *     elementales tiene. Una figura de tamaño 1 es una PIEZA SIMPLE; de 2 o más, COMPUESTA.
 *     piezas = cuántas figuras del tipo son piezas simples; compuestas = total − piezas.
 *     La lista va ordenada por tamaño, luego de arriba abajo y de izquierda a derecha (el orden del reflector).
 *     errores (todos números):
 *       soloPiezas          cuenta solo las piezas simples                         = piezas
 *       piezasYTotal        las piezas simples más la figura grande                 = piezas + 1
 *       dobleCuenta         cada figura contada dos veces (de ida y de vuelta)      = 2·total
 *       compuestasDosVeces  las piezas una vez y cada compuesta dos veces            = piezas + 2·compuestas
 *   puntoEnPoligono(P, pts)   true si P está estrictamente adentro (sirve para el tamaño).
 *
 * FIGURAS DE EJEMPLO (constructores; devuelven { lineas, nombre, ... } listos para contar)
 *   recta(n)                  una línea de (0; 0) a (n − 1; 0) con n puntos marcados, uno en cada entero.
 *   abanico(n, k)             vértice O = (n/2; 2k + 2); n + 1 rayos de O a (i; 0), i = 0 … n (n piezas en la base);
 *                             k = número de líneas horizontales: la base y = 0 y k − 1 CUERDAS a las alturas
 *                             y = 2, 4, …, 2(k − 1), cada una de borde a borde del abanico (del rayo de (0; 0) al rayo
 *                             de (n; 0)). k por defecto 1. Devuelve también n, k y O.
 *   cuadricula(m, n)          cuadrícula de m filas y n columnas de cuadritos de lado 1: de (0; 0) a (n; m).
 *   cuadradoDiagonales(l)     cuadrado de lado l (por defecto 2) de (0; 0) a (l; l) con sus dos diagonales.
 *   cuadradoUnaDiagonal(l)    el mismo cuadrado con una sola diagonal, de (0; 0) a (l; l).
 *   dosCevianas()             triángulo A(0; 0), B(6; 0), C(2; 6); ceviana de A a D(4; 3), punto medio de BC, y
 *                             ceviana de B a E(1; 3), punto medio de AC.
 *   tresMedianas()            el mismo triángulo ABC con sus tres medianas: de A a D(4; 3), de B a E(1; 3) y de C a (3; 0).
 *   cuadradoCompleto(l)       cuadrado de lado l (por defecto 2) con sus dos diagonales y sus dos medianas
 *                             (x = l/2 e y = l/2).
 *   triangulo(), cuadrado(l)  las figuras sueltas (el triángulo es ABC; el cuadrado va de (0; 0) a (l; l)).
 *
 * FÓRMULAS DE ACADEMIA (con los errores típicos de la escena)
 *   segmentosRecta(n)         n puntos en una recta: C(n, 2) segmentos.
 *                             errores: soloPiezas n − 1; piezasYTotal n; conOrden n(n − 1) (AB y BA por separado).
 *   triangulosAbanico(n, k)   k·n(n + 1)/2 triángulos (n piezas en la base, k líneas horizontales con la base).
 *                             errores: soloPiezas (piezas triangulares: n), piezasYTotal n + 1, dobleCuenta 2·total,
 *                             unNivel n(n + 1)/2 (solo los de una línea horizontal), unNivelYPiezas n(n + 1)/2 + n.
 *   cuadrilaterosAbanico(n, k)  C(k, 2)·n(n + 1)/2 trapecios (entre dos líneas horizontales y dos rayos).
 *                             errores: soloPiezas (k − 1)·n, piezasYTotal (k − 1)·n + 1, comoTriangulos k·n(n + 1)/2.
 *   cuadradosCuadricula(m, n) Σ (m − k + 1)(n − k + 1) para k = 1 … mín(m, n); si m = n, Σk² hasta n.
 *                             errores: soloPiezas m·n (= n² si es cuadrada); piezasYGrande m·n + 1;
 *                             soloDiagonal m·n + C(mín, 2) (los grandes solo a lo largo de una diagonal: uno de
 *                             lado mín, dos de lado mín − 1, …, sin contar los de lado 1 aparte);
 *                             comoCuadrada Σk² hasta mín(m, n); ladoLargo Σk² hasta máx(m, n).
 *   rectangulosCuadricula(m, n)  C(m + 1, 2)·C(n + 1, 2) (dos de las m + 1 horizontales por dos de las n + 1 verticales).
 *                             errores: soloPiezas m·n; sinCuadrados total − cuadrados; suma C(m + 1, 2) + C(n + 1, 2).
 *   triangulosCuadradoDiagonales()  8 (por fuerza bruta). errores: soloPiezas 4; unaDiagonal 6 (las 4 piezas y las
 *                             2 mitades de una sola diagonal); compuestasDosVeces 12.
 *   triangulosDosCevianas()   por fuerza bruta (8). errores: soloPiezas, piezasYTotal, dobleCuenta.
 *   Todas devuelven { total, errores } y, si cuentan polígonos, también la cuenta por fuerza bruta en 'bruta'.
 *
 * CUBOS
 *   pila(alturas)    alturas[i][j] = cuántos cubos de arista 1 hay apilados en la columna x = j, y = i (enteros ≥ 0).
 *                    El observador mira desde x, y y z grandes (de frente, a la derecha y desde arriba): ve las caras
 *                    +x, +y y +z. Las alturas no deben crecer al aumentar i ni j (la pila está apoyada en la esquina
 *                    x = 0, y = 0; así ninguna cara expuesta queda tapada por otro cubo).
 *                    Un cubo SE VE si tiene expuesta al menos una de sus caras +x, +y, +z (no tiene un cubo pegado
 *                    en esa cara). Devuelve { total, visibles, ocultos, caras (número de caras +x, +y, +z expuestas),
 *                    caja (largo · ancho · alto de la caja que envuelve la pila), cubos:[{ x, y, z, visible, caras:[…] }],
 *                    errores:{ soloVisibles = visibles, carasVisibles = caras, caja } }.
 *                    El cubo { x, y, z } ocupa [x, x + 1] × [y, y + 1] × [z, z + 1].
 *   piramideEsquina(n)  alturas[i][j] = n − máx(i, j) para i, j < n: capas de n × n, (n − 1) × (n − 1), …, 1 × 1,
 *                    apoyadas en la esquina. Total Σk² hasta n. Devuelve lo mismo que pila.
 *   escaleraCubos(alturas, fondo)  fila de columnas de alturas dadas (de atrás hacia adelante en x) repetida 'fondo'
 *                    veces en y. Devuelve lo mismo que pila.
 *   isometrico(P)    { u, v } en el dibujo: u = (x − y)·√3/2, v = z − (x + y)/2 (v hacia arriba).
 *
 * UTILIDADES
 *   C2(n) = n(n − 1)/2; sumaCuadrados(k); azar(semilla) (mulberry32, para las pruebas).
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MotorFiguras = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const EPS = 1e-7;

  function num(v, que) {
    if (typeof v !== 'number' || !Number.isFinite(v)) throw new Error(`${que} debe ser un número`);
    return v;
  }
  function entero(v, que, min) {
    if (!Number.isInteger(v) || v < min) throw new Error(`${que} debe ser un entero de ${min} o más`);
    return v;
  }
  const C2 = n => (n * (n - 1)) / 2;
  const sumaCuadrados = k => (k * (k + 1) * (2 * k + 1)) / 6;
  const cruz = (O, A, B) => (A.x - O.x) * (B.y - O.y) - (A.y - O.y) * (B.x - O.x);
  const mismo = (P, Q) => Math.abs(P.x - Q.x) < EPS && Math.abs(P.y - Q.y) < EPS;
  const limpio = v => (Math.abs(v - Math.round(v)) < 1e-9 ? Math.round(v) + 0 : v);

  // ---------- armado ----------
  function armar(fig) {
    if (!fig || !Array.isArray(fig.lineas) || !fig.lineas.length) throw new Error('la figura necesita lineas: [[P, Q], …]');
    const L = fig.lineas.map(([P, Q], k) => {
      const A = { x: num(P && P.x, `línea ${k}: P.x`), y: num(P && P.y, `línea ${k}: P.y`) };
      const B = { x: num(Q && Q.x, `línea ${k}: Q.x`), y: num(Q && Q.y, `línea ${k}: Q.y`) };
      if (mismo(A, B)) throw new Error(`línea ${k}: sus extremos coinciden`);
      return [A, B];
    });
    const puntos = [];
    const indice = P => {
      for (let i = 0; i < puntos.length; i++) if (mismo(puntos[i], P)) return i;
      puntos.push({ x: limpio(P.x), y: limpio(P.y) });
      return puntos.length - 1;
    };
    const sobre = (P, [A, B]) => {
      const d = Math.hypot(B.x - A.x, B.y - A.y);
      if (Math.abs(cruz(A, B, P)) / d > EPS) return false;
      const t = ((P.x - A.x) * (B.x - A.x) + (P.y - A.y) * (B.y - A.y)) / (d * d);
      return t > -EPS && t < 1 + EPS;
    };
    for (const [A, B] of L) { indice(A); indice(B); }
    for (const [k, Q] of (fig.puntos || []).entries()) {
      const R = { x: num(Q && Q.x, `puntos[${k}].x`), y: num(Q && Q.y, `puntos[${k}].y`) };
      if (!L.some(l => sobre(R, l))) throw new Error(`puntos[${k}] no está sobre ninguna línea`);
      indice(R);
    }
    for (let a = 0; a < L.length; a++) for (let b = a + 1; b < L.length; b++) {
      const [P, Q] = L[a], [R, S] = L[b];
      const den = (Q.x - P.x) * (S.y - R.y) - (Q.y - P.y) * (S.x - R.x);
      if (Math.abs(den) < 1e-12) continue; // paralelas (si se superponen, sus extremos ya están)
      const t = ((R.x - P.x) * (S.y - R.y) - (R.y - P.y) * (S.x - R.x)) / den;
      const X = { x: P.x + t * (Q.x - P.x), y: P.y + t * (Q.y - P.y) };
      if (sobre(X, L[a]) && sobre(X, L[b])) indice(X);
    }
    const lineas = L.map(([A, B]) => {
      const d = { x: B.x - A.x, y: B.y - A.y };
      return puntos.map((P, i) => i).filter(i => sobre(puntos[i], [A, B]))
        .sort((i, j) => (puntos[i].x - A.x) * d.x + (puntos[i].y - A.y) * d.y - ((puntos[j].x - A.x) * d.x + (puntos[j].y - A.y) * d.y));
    });
    const n = puntos.length;
    const con = Array.from({ length: n }, () => new Uint8Array(n));
    const vec = Array.from({ length: n }, () => new Set());
    const aristas = [], ya = new Set();
    for (const l of lineas) {
      for (let a = 0; a < l.length; a++) for (let b = a + 1; b < l.length; b++) { con[l[a]][l[b]] = con[l[b]][l[a]] = 1; }
      for (let a = 0; a + 1 < l.length; a++) {
        const i = Math.min(l[a], l[a + 1]), j = Math.max(l[a], l[a + 1]), k = i + ',' + j;
        if (!ya.has(k)) { ya.add(k); aristas.push([i, j]); vec[i].add(j); vec[j].add(i); }
      }
    }
    const caras = carasDe(puntos, vec);
    return { puntos, lineas, aristas, caras, conecta: (i, j) => i !== j && !!con[i][j], vecinos: con };
  }

  // Caras de la figura plana: se recorre cada arista dirigida girando siempre a la derecha en el punto de llegada
  // (la cara queda a la izquierda). Se descarta la de afuera (área negativa o cero).
  function carasDe(puntos, vec) {
    const ang = (i, j) => Math.atan2(puntos[j].y - puntos[i].y, puntos[j].x - puntos[i].x);
    const orden = puntos.map((P, i) => [...vec[i]].sort((a, b) => ang(i, a) - ang(i, b)));
    const usada = new Set(), caras = [];
    for (let i = 0; i < puntos.length; i++) for (const j of orden[i]) {
      if (usada.has(i + '>' + j)) continue;
      const cara = [];
      let a = i, b = j, guarda = 0;
      while (!usada.has(a + '>' + b) && guarda++ < 10000) {
        usada.add(a + '>' + b); cara.push(a);
        const o = orden[b], k = o.indexOf(a);
        const c = o[(k - 1 + o.length) % o.length]; // el vecino anterior en sentido antihorario: girar a la derecha… visto desde b
        a = b; b = c;
      }
      if (area(cara.map(q => puntos[q])) > EPS) caras.push(cara);
    }
    return caras;
  }
  function area(pts) {
    let s = 0;
    for (let i = 0; i < pts.length; i++) { const P = pts[i], Q = pts[(i + 1) % pts.length]; s += P.x * Q.y - Q.x * P.y; }
    return s / 2;
  }
  function puntoEnPoligono(P, pts) {
    let dentro = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const A = pts[i], B = pts[j];
      // sobre el borde: no está estrictamente adentro
      const d = Math.hypot(B.x - A.x, B.y - A.y);
      if (Math.abs(cruz(A, B, P)) / d < 1e-9 && (P.x - A.x) * (P.x - B.x) <= 1e-12 && (P.y - A.y) * (P.y - B.y) <= 1e-12) return false;
      if ((A.y > P.y) !== (B.y > P.y) && P.x < ((B.x - A.x) * (P.y - A.y)) / (B.y - A.y) + A.x) dentro = !dentro;
    }
    return dentro;
  }
  // Un punto bien adentro de cada cara: el medio de un lado, corrido un poquito hacia la izquierda (hacia la cara).
  function puntoInterior(pts) {
    let mejor = null, largo = -1;
    for (let i = 0; i < pts.length; i++) {
      const A = pts[i], B = pts[(i + 1) % pts.length], d = Math.hypot(B.x - A.x, B.y - A.y);
      if (d > largo) { largo = d; mejor = [A, B, d]; }
    }
    const [A, B, d] = mejor, e = 1e-4;
    return { x: (A.x + B.x) / 2 - ((B.y - A.y) / d) * e, y: (A.y + B.y) / 2 + ((B.x - A.x) / d) * e };
  }

  // ---------- conteo por fuerza bruta ----------
  const TIPOS = ['segmentos', 'triangulos', 'cuadrilateros', 'cuadrados', 'rectangulos'];
  // convexo: los cuatro giros en el mismo sentido (así tampoco hay lados que se crucen)
  function convexo(v) {
    const s = v.map((B, i) => Math.sign(cruz(v[(i + 3) % 4], B, v[(i + 1) % 4])));
    return s.every(x => x === s[0]) && s[0] !== 0;
  }
  function contar(fig, tipo) {
    if (!TIPOS.includes(tipo)) throw new Error(`tipo desconocido: ${tipo} (usa ${TIPOS.join(', ')})`);
    const G = fig && fig.puntos && fig.conecta ? fig : armar(fig);
    const P = G.puntos, n = P.length, con = G.conecta;
    const alineados = (a, b, c) => Math.abs(cruz(P[a], P[b], P[c])) < EPS;
    const lista = [];
    if (tipo === 'segmentos') {
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (con(i, j)) {
        const l = G.lineas.find(q => q.includes(i) && q.includes(j));
        lista.push({ vertices: [i, j], tamano: Math.abs(l.indexOf(i) - l.indexOf(j)) });
      }
    } else if (tipo === 'triangulos') {
      for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) if (con(a, b))
        for (let c = b + 1; c < n; c++) if (con(a, c) && con(b, c) && !alineados(a, b, c)) lista.push({ vertices: [a, b, c] });
    } else {
      // cuadriláteros: a es el menor índice y, para no contarlo dos veces (de ida y de vuelta), b < d
      for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) if (con(a, b))
        for (let c = a + 1; c < n; c++) if (c !== b && con(b, c) && !alineados(a, b, c))
          for (let d = b + 1; d < n; d++) if (d !== c && con(c, d) && con(d, a)
              && !alineados(b, c, d) && !alineados(c, d, a) && !alineados(d, a, b)
              && convexo([P[a], P[b], P[c], P[d]])) lista.push({ vertices: [a, b, c, d] });
    }
    const recto = q => {
      const v = q.vertices.map(i => P[i]);
      for (let i = 0; i < 4; i++) {
        const A = v[(i + 3) % 4], B = v[i], C = v[(i + 1) % 4];
        const u = { x: A.x - B.x, y: A.y - B.y }, w = { x: C.x - B.x, y: C.y - B.y };
        if (Math.abs(u.x * w.x + u.y * w.y) > 1e-6 * (Math.hypot(u.x, u.y) * Math.hypot(w.x, w.y))) return false;
      }
      return true;
    };
    const lados = q => {
      const v = q.vertices.map(i => P[i]);
      const l1 = Math.hypot(v[1].x - v[0].x, v[1].y - v[0].y), l2 = Math.hypot(v[2].x - v[1].x, v[2].y - v[1].y);
      return Math.abs(l1 - l2) <= 1e-6 * Math.max(l1, l2);
    };
    if (tipo !== 'segmentos' && tipo !== 'triangulos') for (const q of lista) { q.rectangulo = recto(q); q.cuadrado = q.rectangulo && lados(q); }
    const out = tipo === 'cuadrados' ? lista.filter(q => q.cuadrado) : tipo === 'rectangulos' ? lista.filter(q => q.rectangulo) : lista;
    // tamaño de los polígonos: cuántas piezas tiene adentro
    const interiores = G.caras.map(c => puntoInterior(c.map(i => P[i])));
    for (const f of out) {
      f.pts = f.vertices.map(i => ({ x: P[i].x, y: P[i].y }));
      if (tipo !== 'segmentos') {
        if (area(f.pts) < 0) { f.vertices.reverse(); f.pts.reverse(); }
        f.tamano = interiores.filter(Q => puntoEnPoligono(Q, f.pts)).length;
      }
    }
    const cy = f => f.pts.reduce((s, q) => s + q.y, 0) / f.pts.length, cx = f => f.pts.reduce((s, q) => s + q.x, 0) / f.pts.length;
    out.sort((f, g) => f.tamano - g.tamano || cy(g) - cy(f) || cx(f) - cx(g));
    const porTamano = {};
    for (const f of out) porTamano[f.tamano] = (porTamano[f.tamano] || 0) + 1;
    const total = out.length, piezas = porTamano[1] || 0;
    return {
      tipo, total, lista: out, porTamano, piezas, compuestas: total - piezas, puntos: P, caras: G.caras.length,
      errores: { soloPiezas: piezas, piezasYTotal: piezas + 1, dobleCuenta: 2 * total, compuestasDosVeces: piezas + 2 * (total - piezas) }
    };
  }

  // ---------- figuras de ejemplo ----------
  const p = (x, y) => ({ x, y });
  function recta(n) {
    entero(n, 'n (los puntos)', 2);
    const puntos = [];
    for (let i = 1; i + 1 < n; i++) puntos.push(p(i, 0));
    return { lineas: [[p(0, 0), p(n - 1, 0)]], puntos, nombre: `recta con ${n} puntos`, n };
  }
  function abanico(n, k) {
    entero(n, 'n (las piezas de la base)', 1);
    k = k === undefined ? 1 : entero(k, 'k (las líneas horizontales)', 1);
    const alto = 2 * k + 2, O = p(n / 2, alto), lineas = [];
    for (let i = 0; i <= n; i++) lineas.push([O, p(i, 0)]);
    for (let h = 0; h < k; h++) {
      const y = 2 * h, t = (alto - y) / alto; // en la altura y, el abanico va de x = n/2 − t·n/2 a x = n/2 + t·n/2
      lineas.push([p(n / 2 - (t * n) / 2, y), p(n / 2 + (t * n) / 2, y)]);
    }
    return { lineas, nombre: `abanico de ${n} piezas y ${k} ${k === 1 ? 'línea' : 'líneas'}`, n, k, O };
  }
  function cuadricula(m, n) {
    entero(m, 'm (las filas)', 1); entero(n, 'n (las columnas)', 1);
    const lineas = [];
    for (let i = 0; i <= m; i++) lineas.push([p(0, i), p(n, i)]);
    for (let j = 0; j <= n; j++) lineas.push([p(j, 0), p(j, m)]);
    return { lineas, nombre: `cuadrícula de ${m} × ${n}`, m, n };
  }
  function cuadrado(l) {
    l = l === undefined ? 2 : num(l, 'el lado');
    return { lineas: [[p(0, 0), p(l, 0)], [p(l, 0), p(l, l)], [p(l, l), p(0, l)], [p(0, l), p(0, 0)]], nombre: 'cuadrado', l };
  }
  function cuadradoDiagonales(l) {
    const c = cuadrado(l), L = c.l;
    return { lineas: c.lineas.concat([[p(0, 0), p(L, L)], [p(L, 0), p(0, L)]]), nombre: 'cuadrado con sus diagonales', l: L };
  }
  function cuadradoUnaDiagonal(l) {
    const c = cuadrado(l), L = c.l;
    return { lineas: c.lineas.concat([[p(0, 0), p(L, L)]]), nombre: 'cuadrado con una diagonal', l: L };
  }
  function tresMedianas() {
    const t = triangulo();
    return { lineas: t.lineas.concat([[p(0, 0), p(4, 3)], [p(6, 0), p(1, 3)], [p(2, 6), p(3, 0)]]), nombre: 'triángulo con sus tres medianas' };
  }
  function cuadradoCompleto(l) {
    const c = cuadradoDiagonales(l), L = c.l;
    return { lineas: c.lineas.concat([[p(L / 2, 0), p(L / 2, L)], [p(0, L / 2), p(L, L / 2)]]), nombre: 'cuadrado con diagonales y medianas', l: L };
  }
  function triangulo() { return { lineas: [[p(0, 0), p(6, 0)], [p(6, 0), p(2, 6)], [p(2, 6), p(0, 0)]], nombre: 'triángulo' }; }
  function dosCevianas() {
    const t = triangulo();
    return { lineas: t.lineas.concat([[p(0, 0), p(4, 3)], [p(6, 0), p(1, 3)]]), nombre: 'triángulo con dos cevianas',
      A: p(0, 0), B: p(6, 0), C: p(2, 6), D: p(4, 3), E: p(1, 3) };
  }

  // ---------- fórmulas de academia ----------
  function segmentosRecta(n) {
    entero(n, 'n (los puntos)', 2);
    return { total: C2(n), errores: { soloPiezas: n - 1, piezasYTotal: n, conOrden: n * (n - 1) } };
  }
  function triangulosAbanico(n, k) {
    entero(n, 'n', 1); k = k === undefined ? 1 : entero(k, 'k', 1);
    const uno = (n * (n + 1)) / 2, total = k * uno;
    return { total, porNivel: uno, bruta: contar(abanico(n, k), 'triangulos').total,
      errores: { soloPiezas: n, piezasYTotal: n + 1, dobleCuenta: 2 * total, unNivel: uno, unNivelYPiezas: uno + n } };
  }
  function cuadrilaterosAbanico(n, k) {
    entero(n, 'n', 1); entero(k, 'k', 2);
    const uno = (n * (n + 1)) / 2, total = C2(k) * uno;
    return { total, bruta: contar(abanico(n, k), 'cuadrilateros').total,
      errores: { soloPiezas: (k - 1) * n, piezasYTotal: (k - 1) * n + 1, comoTriangulos: k * uno } };
  }
  function cuadradosCuadricula(m, n) {
    entero(m, 'm', 1); entero(n, 'n', 1);
    const mn = Math.min(m, n), mx = Math.max(m, n);
    let total = 0; const porLado = {};
    for (let k = 1; k <= mn; k++) { porLado[k] = (m - k + 1) * (n - k + 1); total += porLado[k]; }
    return { total, porLado, bruta: contar(cuadricula(m, n), 'cuadrados').total,
      errores: { soloPiezas: m * n, piezasYGrande: m * n + 1, soloDiagonal: m * n + C2(mn), comoCuadrada: sumaCuadrados(mn), ladoLargo: sumaCuadrados(mx) } };
  }
  function rectangulosCuadricula(m, n) {
    entero(m, 'm', 1); entero(n, 'n', 1);
    const total = C2(m + 1) * C2(n + 1), cuad = cuadradosCuadricula(m, n).total;
    return { total, cuadrados: cuad, noCuadrados: total - cuad, bruta: contar(cuadricula(m, n), 'rectangulos').total,
      errores: { soloPiezas: m * n, sinCuadrados: total - cuad, suma: C2(m + 1) + C2(n + 1) } };
  }
  function triangulosCuadradoDiagonales() {
    const r = contar(cuadradoDiagonales(2), 'triangulos'), una = contar(cuadradoUnaDiagonal(2), 'triangulos');
    return { total: r.total, bruta: r.total, piezas: r.piezas,
      errores: { soloPiezas: r.piezas, unaDiagonal: r.piezas + una.total, compuestasDosVeces: r.errores.compuestasDosVeces } };
  }
  function triangulosDosCevianas() {
    const r = contar(dosCevianas(), 'triangulos');
    return { total: r.total, bruta: r.total, piezas: r.piezas,
      errores: { soloPiezas: r.piezas, piezasYTotal: r.piezas + 1, dobleCuenta: 2 * r.total } };
  }

  // ---------- cubos ----------
  function pila(alturas) {
    if (!Array.isArray(alturas) || !alturas.length || !alturas.every(Array.isArray)) throw new Error('alturas debe ser una lista de filas');
    const h = (i, j) => (i < alturas.length && j < alturas[i].length ? alturas[i][j] : 0);
    alturas.forEach((f, i) => f.forEach((v, j) => {
      entero(v, `alturas[${i}][${j}]`, 0);
      if (h(i + 1, j) > v || h(i, j + 1) > v) throw new Error('las alturas no deben crecer hacia adelante ni hacia la derecha (pila apoyada en la esquina)');
    }));
    const ocupado = (x, y, z) => x >= 0 && y >= 0 && z >= 0 && z < h(y, x);
    const cubos = [];
    let caras = 0, largo = 0, ancho = 0, alto = 0;
    alturas.forEach((f, i) => f.forEach((v, j) => {
      for (let z = 0; z < v; z++) {
        const cs = [];
        if (!ocupado(j + 1, i, z)) cs.push('+x');
        if (!ocupado(j, i + 1, z)) cs.push('+y');
        if (!ocupado(j, i, z + 1)) cs.push('+z');
        caras += cs.length;
        cubos.push({ x: j, y: i, z, visible: cs.length > 0, caras: cs });
      }
      if (v > 0) { largo = Math.max(largo, j + 1); ancho = Math.max(ancho, i + 1); alto = Math.max(alto, v); }
    }));
    cubos.sort((a, b) => a.x + a.y + a.z - (b.x + b.y + b.z) || a.z - b.z || a.x - b.x);
    const visibles = cubos.filter(c => c.visible).length, caja = largo * ancho * alto;
    return { total: cubos.length, visibles, ocultos: cubos.length - visibles, caras, caja, dims: { largo, ancho, alto }, cubos,
      errores: { soloVisibles: visibles, carasVisibles: caras, caja } };
  }
  function piramideEsquina(n) {
    entero(n, 'n (las capas)', 1);
    const alt = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => n - Math.max(i, j)));
    return Object.assign(pila(alt), { formula: sumaCuadrados(n), alturas: alt });
  }
  function escaleraCubos(alturas, fondo) {
    if (!Array.isArray(alturas)) throw new Error('alturas debe ser una lista');
    entero(fondo, 'fondo', 1);
    const alt = Array.from({ length: fondo }, () => alturas.slice());
    return Object.assign(pila(alt), { formula: fondo * alturas.reduce((s, v) => s + v, 0), alturas: alt });
  }
  function isometrico(P) { return { u: ((P.x - P.y) * Math.sqrt(3)) / 2, v: P.z - (P.x + P.y) / 2 }; }

  function azar(semilla) {
    let a = semilla >>> 0;
    return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }

  return {
    armar, contar, puntoEnPoligono, area,
    recta, abanico, cuadricula, cuadrado, cuadradoDiagonales, cuadradoUnaDiagonal, triangulo, dosCevianas, tresMedianas, cuadradoCompleto,
    segmentosRecta, triangulosAbanico, cuadrilaterosAbanico, cuadradosCuadricula, rectangulosCuadricula,
    triangulosCuadradoDiagonales, triangulosDosCevianas,
    pila, piramideEsquina, escaleraCubos, isometrico,
    C2, sumaCuadrados, azar
  };
});
