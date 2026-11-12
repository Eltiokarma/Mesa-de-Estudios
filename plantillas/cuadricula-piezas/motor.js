/*
 * Motor de «El tablero que se parte en piezas»: cortes por la cuadrícula, piezas congruentes, rearmados,
 * áreas y perímetros compuestos, y conteos de ubicaciones, casillas, triángulos y cuadrados.
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el navegador
 * (window.MotorPiezas) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 * Todo conteo se hace por FUERZA BRUTA (se recorren todos los casos posibles); donde hay fórmula de academia, el motor
 * la da también y las pruebas comprueban que coinciden.
 *
 * CONVENCIONES
 *   Casilla: [f, c] (fila desde arriba, columna desde la izquierda; desde 0). Una PIEZA es una lista de casillas.
 *   Tablero m × n: m filas y n columnas; la casilla [f, c] ocupa x ∈ [c, c + 1], y ∈ [f, f + 1] (y hacia ABAJO).
 *   Un CORTE es un tramo de la cuadrícula de largo 1: [x1, y1, x2, y2] con puntos enteros vecinos.
 *   Dos casillas vecinas (comparten un lado) están en la misma pieza si ese lado no está cortado.
 *   Perímetro de una pieza = lados de sus casillas que no tocan otra casilla de la misma pieza (en lados de casilla).
 *   Dos piezas son CONGRUENTES si una se lleva sobre la otra con un desplazamiento y alguna de las 8 isometrías del
 *   cuadrado (4 giros de 0°, 90°, 180° y 270°, y esos mismos después de un reflejo).
 *   Exactos «a + bπ»: { a, b } (números). Fracciones: { num, den } reducidas, con den > 0.
 *
 * PIEZAS DE CASILLAS
 *   normalizar(celdas)        corre la pieza a la esquina (mín f = mín c = 0) y la ordena por filas y columnas.
 *   isometrias(celdas)        las 8 imágenes normalizadas: [{ nombre, celdas }] con nombre 'identidad', 'giro90',
 *                             'giro180', 'giro270', 'reflejo', 'reflejo-giro90', 'reflejo-giro180', 'reflejo-giro270'
 *                             (giro antihorario en el dibujo; reflejo = espejo vertical, c → −c, antes del giro).
 *   orientaciones(celdas)     las imágenes DISTINTAS entre esas 8, en ese orden: { total, lista:[celdas], giros }
 *                             (giros = cuántas distintas dan solo los 4 giros).
 *   congruentes(a, b)         { es, como } (como = nombre de la primera isometría de la lista que lleva a sobre b, o null).
 *   perimetro(celdas)         4·n − 2·(pares de casillas vecinas).   conexa(celdas) → true o false.
 *
 * CORTES EN UN TABLERO
 *   piezas(m, n, cortes)      parte el tablero m × n por los cortes. → { total, piezas:[{ celdas, area, perimetro }],
 *                             areas, perimetros (en el orden de las piezas: la que tiene la casilla [0, 0] primero),
 *                             congruentes (true si hay 2 piezas o más y todas son congruentes entre sí; con una sola pieza, false),
 *                             como (con 2 piezas: congruentes(A, B).como),
 *                             cortesUsados (cortes que separan dos piezas distintas), sueltos (cortes dentro de una pieza o en
 *                             el borde, que no separan nada) }.
 *   cortesEntre(A, B)         los tramos de la cuadrícula que separan una casilla de A de una de B (el corte entre las dos).
 *   partirDos(m, n)           todas las maneras de partir el tablero en DOS piezas conexas y congruentes (m·n par, m·n ≤ 20),
 *                             cada una contada una vez. → { total, lista:[{ A, B, perimetro, corte, como }] (de mayor a menor
 *                             perímetro), maximo, minimo, porPerimetro:{ p: cuántas }, recto (perímetro del corte recto por la
 *                             mitad, o null), errores:{ corteRecto = recto, mitadTablero = m + n (el perímetro del tablero
 *                             partido en dos, sin sumar el corte), dosPiezas = 2·maximo (los dos perímetros sumados),
 *                             segundo = el mayor perímetro menor que el máximo } }.
 *                             Cada pieza mide m + n + corte (corte = lados cortados), así que el mayor perímetro es el corte
 *                             más largo.
 *   partirEn(region, k, lado) todas las maneras de partir una región (lista de casillas, o [m, n]) en k piezas congruentes.
 *                             lado = lado de cada casilla (por defecto 1). → { total, area (casillas por pieza), formas:[{ celdas,
 *                             perimetro (en lados de casilla), metros (= perimetro·lado), maneras }], perimetros (distintos, de
 *                             menor a mayor, en lados), lista:[[pieza, …]] }.
 *   regionL(a)                L de tres cuadrados de a × a: el cuadrado de 2a × 2a sin el cuarto de arriba a la derecha.
 *
 * REARMAR UN RECTÁNGULO COMO CUADRADO
 *   mover(celdas, df, dc)     corre la pieza df filas y dc columnas.
 *   rearmar(piezas)           junta piezas ya movidas. → { encaja (sin solapes ni huecos en un rectángulo), solapes, huecos,
 *                             alto, ancho, esCuadrado }.
 *   escalera(W, H)            rectángulo de W columnas por H filas (W > H) partido por UN corte en escalera para rearmar un
 *                             cuadrado. Existe si W = (k + 1)²·t y H = k²·t (escalones de w = (k + 1)·t de ancho y h = k·t de
 *                             alto). → { posible, k, w, h, lado = k·w = √(W·H), A, B (las dos piezas), mover:{ df:−h, dc:−w }
 *                             (lo que se corre B; en cuadrado, después todo baja h filas para empezar en la fila 0), cuadrado (piezas ya rearmadas), corte (los
 *                             tramos del corte), largoCorte (cuántos tramos tiene: H + (k − 1)·w, las k bajadas de h y los k − 1
 *                             pasos de w), escalones = k, trozos = 2, cortes = 1, encaja, errores:{ mismoPerimetro =
 *                             (W + H)/2 (lado si se conservara el perímetro), cuartoDelArea = W·H/4, tiras } }.
 *                             Con k = 1 el corte es recto. 'tiras' = trozos con el método de tiras rectas (ver tiras(W, H)).
 *   tiras(W, H)               método de tiras: se corta la franja de W − L columnas (L = lado) y se parte en tiras de
 *                             (W − L) × (L − H) que van arriba. → { posible, lado, trozos, cortes (rectos, de lado a lado), piezas
 *                             (antes de mover: el rectángulo de L columnas y las tiras), armadas (ya en el cuadrado), encaja }.
 *
 * ÁREAS COMPUESTAS
 *   areaPiezas(lista)         lista de { tipo:'rect', b, h } | { tipo:'trap', B, b, h } | { tipo:'tri', b, h } → { total, areas }.
 *   escaleraEnchape(p, huella, contra, ancho, precio)
 *                             escalera maciza de p peldaños (fondo de cada peldaño = huella, alto = contra, ancho = ancho), con
 *                             la espalda contra la pared y la base en el piso. Se enchapan huellas, contrahuellas y los DOS
 *                             costados (cada costado es escalonado: huella·contra·(1 + 2 + … + p)). precio por unidad de área.
 *                             → { huellas, contrahuellas, costado, costados, total, costo, errores:{ sinCostados, unCostado,
 *                             costadoRectangulo (cada costado como el rectángulo p·huella × p·contra), sinContrahuellas }
 *                             (cada error es un COSTO) }.
 *
 * PERÍMETROS CON ARCOS (exactos a + bπ)
 *   perimetroZonas(tramos, zonas)
 *                             tramos = { id: { tipo:'recto', l } | { tipo:'semi', d } (semicircunferencia de diámetro d: (d/2)π)
 *                             | { tipo:'cuarto', r } (cuarto de circunferencia de radio r: (r/2)π) }; zonas = [[ids de su borde]].
 *                             → { zonas:[{ a, b }], suma:{ a, b }, compartidos:[ids que bordean dos zonas o más],
 *                             errores:{ compartidoUnaVez, sinRectos, sinRectosNiCompartido } (cada uno { a, b }) }.
 *   arcosZonas(AB, AM)        semicircunferencia de diámetro AB y, adentro, otra de diámetro AM (M en AB): zona 1 = el medio
 *                             círculo chico (arco AM y AM); zona 2 = lo demás (arco AB, arco AM y MB). Mismo resultado.
 *   curvaS(AB, AM)            círculo de diámetro AB partido por una S: semicircunferencia de diámetro AM arriba y de MB abajo.
 *                             Dos zonas iguales en forma de gota; cada una tiene medio círculo grande y la S entera.
 *
 * FRACCIÓN DE ÁREA EN UN RECTÁNGULO
 *   fraccionTriangulo(P, Q, R)  rectángulo ABCD (A abajo a la izquierda, B abajo a la derecha, C arriba a la derecha, D arriba
 *                             a la izquierda). Vértices: 'A', 'B', 'C', 'D', puntos medios 'AB', 'BC', 'CD', 'DA' o el centro 'O'.
 *                             → { num, den, valor, sobrantes:[{ num, den }] (las piezas del rectángulo fuera del triángulo, de menor a mayor, si los
 *                             tres vértices están en el borde), errores:{ olvidaUna (no restar la pieza sobrante más chica),
 *                             todasIguales (restar todas las sobrantes como la más grande), mitad = 1/2 } (fracciones) }.
 *                             errores.loQueSobra = 1 − fracción (la parte que queda fuera). Vale para cualquier rectángulo.
 *   trianguloEn(W, H, P, Q, R)  el mismo triángulo en un rectángulo de W de ancho y H de alto (A en el origen, y hacia ARRIBA).
 *                             → { area, total = W·H, num, den, valor = area/total, vertices:[{ x, y }], puntos:{ nombre: { x, y } } }.
 *
 * CONTEOS
 *   ubicaciones(pieza, region)  copias de la pieza (girada o reflejada) que caben en la región (lista de casillas o [m, n]),
 *                             sin salirse. Cada ubicación se cuenta una vez. → { total, lista:[{ celdas, orientacion (índice en
 *                             orientaciones(pieza).lista), comoDibujo (true si va como la pieza dada), girada (true si sale con
 *                             un giro, sin reflejo) }], orientaciones, errores:{ comoDibujo (solo como la pieza dada), soloGiros
 *                             (sin reflejos), ochoVeces (las 8 isometrías contadas aunque coincidan), marcos (lugares del
 *                             rectángulo que encierra la pieza, acostado y parado, sin mirar la pieza) } }.
 *   casillasBorde(m, n, g)    casillas de un marco de grosor g (por defecto 1) en un tablero m × n, contadas una por una.
 *                             → { total, formula = m·n − (m − 2g)(n − 2g), esquinas = 4g², errores:{ esquinasDosVeces = 2g(m + n),
 *                             sinEsquinas = total − 4g², anillosIguales = g·(2m + 2n − 4) (cada anillo de adentro tomado igual
 *                             al de afuera) } }.
 *   triangulosPuntos(puntos)  puntos [[x, y]] enteros. → { total (ternas no alineadas), ternas = C(n, 3), alineadas, rectas:[cuántos
 *                             puntos tiene cada recta con 3 o más] (de mayor a menor), lista:[[i, j, k]] (si total ≤ 400),
 *                             errores:{ sinRestar = C(n, 3), conOrden = 6·total, unaPorRecta = C(n, 3) − (rectas con 3 o más),
 *                             soloFilasColumnas (resta solo las ternas en rectas horizontales y verticales) } }.
 *   dosRectas(a, b)           a puntos en una recta y b en otra paralela, sin otros tres alineados → puntos [[x, y]].
 *   red(m, n)                 red de m filas y n columnas de puntos (x de 0 a n − 1, y de 0 a m − 1) → puntos.
 *   cuadradosLibres(m, n, sombreadas)
 *                             cuadrados de todos los tamaños, por las líneas del tablero m × n, que no tienen ninguna casilla
 *                             sombreada adentro. → { total, todos (cuadrados del tablero), conSombra = todos − total,
 *                             porLado:{ k: cuántos libres }, lista:[{ f, c, k }], errores:{ todos, soloCasillas (solo las casillas
 *                             libres de 1 × 1) } }.
 *   diagonal(t)               figura t de la sucesión: tablero t × t con la diagonal (de arriba a la izquierda a abajo a la
 *                             derecha) sombreada. → cuadradosLibres(t, t, diagonal) con además terminos (los libres de las figuras
 *                             1 … t) y errores.patronDoble (la figura t si las diferencias de las figuras 1 a t − 1 se fueran
 *                             duplicando).
 *
 * UTILIDADES
 *   C(n, k) combinaciones.   fraccion(num, den) → { num, den } reducida.   azar(semilla) → generador en [0, 1).
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MotorPiezas = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ---------- utilidades ----------
  function C(n, k) {
    if (k < 0 || k > n) return 0;
    let r = 1;
    for (let i = 1; i <= k; i++) r = r * (n - k + i) / i;
    return Math.round(r);
  }
  function mcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; }
  function fraccion(num, den) {
    if (!den) throw new Error('denominador 0');
    if (den < 0) { num = -num; den = -den; }
    const g = mcd(num, den);
    return { num: num / g, den: den / g, valor: num / den };
  }
  function azar(semilla) {
    let s = (semilla >>> 0) || 1;
    return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const clave = cs => cs.map(q => q[0] + ',' + q[1]).join(' ');
  function entero(x, que) { if (!Number.isInteger(x)) throw new Error(`${que} debe ser entero`); return x; }

  // ---------- piezas de casillas ----------
  function validarPieza(celdas) {
    if (!Array.isArray(celdas) || !celdas.length) throw new Error('la pieza necesita casillas');
    const vistas = new Set();
    for (const q of celdas) {
      if (!Array.isArray(q) || q.length !== 2 || !Number.isInteger(q[0]) || !Number.isInteger(q[1])) throw new Error('casilla inválida');
      const k = q[0] + ',' + q[1];
      if (vistas.has(k)) throw new Error('casilla repetida');
      vistas.add(k);
    }
  }
  function normalizar(celdas) {
    validarPieza(celdas);
    const f0 = Math.min(...celdas.map(q => q[0])), c0 = Math.min(...celdas.map(q => q[1]));
    return celdas.map(q => [q[0] - f0, q[1] - c0]).sort((p, q) => p[0] - q[0] || p[1] - q[1]);
  }
  // giro antihorario de 90° en el dibujo (y hacia abajo): (f, c) → (−c, f)
  const GIRO = q => [-q[1], q[0]];
  const REFLEJO = q => [q[0], -q[1]];
  const NOMBRES = ['identidad', 'giro90', 'giro180', 'giro270', 'reflejo', 'reflejo-giro90', 'reflejo-giro180', 'reflejo-giro270'];
  function isometrias(celdas) {
    validarPieza(celdas);
    const out = [];
    for (let r = 0; r < 2; r++) {
      let cs = r ? celdas.map(REFLEJO) : celdas.map(q => q.slice());
      for (let g = 0; g < 4; g++) {
        out.push({ nombre: NOMBRES[r * 4 + g], celdas: normalizar(cs) });
        cs = cs.map(GIRO);
      }
    }
    return out;
  }
  function orientaciones(celdas) {
    const iso = isometrias(celdas), vistas = new Set(), lista = [], nombres = [];
    let giros = 0;
    iso.forEach((x, i) => {
      const k = clave(x.celdas);
      if (vistas.has(k)) return;
      vistas.add(k); lista.push(x.celdas); nombres.push(x.nombre);
      if (i < 4) giros++;
    });
    return { total: lista.length, lista, nombres, giros };
  }
  function congruentes(a, b) {
    if (a.length !== b.length) return { es: false, como: null };
    const kb = clave(normalizar(b));
    for (const x of isometrias(a)) if (clave(x.celdas) === kb) return { es: true, como: x.nombre };
    return { es: false, como: null };
  }
  function perimetro(celdas) {
    validarPieza(celdas);
    const s = new Set(celdas.map(q => q[0] + ',' + q[1]));
    let pares = 0;
    for (const [f, c] of celdas) { if (s.has(f + ',' + (c + 1))) pares++; if (s.has((f + 1) + ',' + c)) pares++; }
    return 4 * celdas.length - 2 * pares;
  }
  function conexa(celdas) {
    if (!celdas.length) return false;
    const s = new Set(celdas.map(q => q[0] + ',' + q[1])), vis = new Set([celdas[0][0] + ',' + celdas[0][1]]), pila = [celdas[0]];
    while (pila.length) {
      const [f, c] = pila.pop();
      for (const [df, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const k = (f + df) + ',' + (c + dc);
        if (s.has(k) && !vis.has(k)) { vis.add(k); pila.push([f + df, c + dc]); }
      }
    }
    return vis.size === s.size;
  }

  // ---------- tablero y cortes ----------
  function dims(m, n) {
    entero(m, 'm'); entero(n, 'n');
    if (m < 1 || n < 1 || m > 60 || n > 60) throw new Error('tablero fuera de rango');
  }
  const claveTramo = (x1, y1, x2, y2) => (x1 < x2 || (x1 === x2 && y1 < y2)) ? `${x1},${y1},${x2},${y2}` : `${x2},${y2},${x1},${y1}`;
  function validarCorte(t) {
    if (!Array.isArray(t) || t.length !== 4 || !t.every(Number.isInteger)) throw new Error('corte inválido');
    const [x1, y1, x2, y2] = t;
    if (Math.abs(x1 - x2) + Math.abs(y1 - y2) !== 1) throw new Error('un corte va de un punto de la cuadrícula al vecino');
  }
  // lado entre [f, c] y [f, c + 1]: vertical x = c + 1, y de f a f + 1; entre [f, c] y [f + 1, c]: horizontal y = f + 1
  const ladoDer = (f, c) => claveTramo(c + 1, f, c + 1, f + 1);
  const ladoAba = (f, c) => claveTramo(c, f + 1, c + 1, f + 1);
  function piezas(m, n, cortes) {
    dims(m, n);
    cortes = cortes || [];
    const S = new Set();
    for (const t of cortes) { validarCorte(t); S.add(claveTramo(...t)); }
    const id = Array.from({ length: m }, () => Array(n).fill(-1));
    const lista = [];
    for (let f = 0; f < m; f++) for (let c = 0; c < n; c++) {
      if (id[f][c] >= 0) continue;
      const k = lista.length, cel = [], pila = [[f, c]]; id[f][c] = k;
      while (pila.length) {
        const [a, b] = pila.pop(); cel.push([a, b]);
        const vec = [];
        if (b + 1 < n && !S.has(ladoDer(a, b))) vec.push([a, b + 1]);
        if (b - 1 >= 0 && !S.has(ladoDer(a, b - 1))) vec.push([a, b - 1]);
        if (a + 1 < m && !S.has(ladoAba(a, b))) vec.push([a + 1, b]);
        if (a - 1 >= 0 && !S.has(ladoAba(a - 1, b))) vec.push([a - 1, b]);
        for (const [x, y] of vec) if (id[x][y] < 0) { id[x][y] = k; pila.push([x, y]); }
      }
      cel.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
      lista.push(cel);
    }
    let usados = 0;
    for (const t of S) {
      const [x1, y1, x2, y2] = t.split(',').map(Number);
      let a = null, b = null;
      if (x1 === x2) { const f = Math.min(y1, y2); if (x1 > 0 && x1 < n) { a = id[f][x1 - 1]; b = id[f][x1]; } }
      else { const c = Math.min(x1, x2); if (y1 > 0 && y1 < m) { a = id[y1 - 1][c]; b = id[y1][c]; } }
      if (a !== null && a !== b) usados++;
    }
    const pz = lista.map(cel => ({ celdas: cel, area: cel.length, perimetro: perimetro(cel) }));
    let todas = true;
    for (let i = 1; i < pz.length; i++) if (!congruentes(pz[0].celdas, pz[i].celdas).es) { todas = false; break; }
    return {
      total: pz.length, piezas: pz, areas: pz.map(p => p.area), perimetros: pz.map(p => p.perimetro),
      congruentes: pz.length >= 2 && todas, como: pz.length === 2 ? congruentes(pz[0].celdas, pz[1].celdas).como : null,
      cortesUsados: usados, sueltos: S.size - usados,
    };
  }
  function cortesEntre(A, B) {
    const sb = new Set(B.map(q => q[0] + ',' + q[1])), out = [];
    for (const [f, c] of A) {
      if (sb.has(f + ',' + (c + 1))) out.push([c + 1, f, c + 1, f + 1]);
      if (sb.has(f + ',' + (c - 1))) out.push([c, f, c, f + 1]);
      if (sb.has((f + 1) + ',' + c)) out.push([c, f + 1, c + 1, f + 1]);
      if (sb.has((f - 1) + ',' + c)) out.push([c, f, c + 1, f]);
    }
    return out;
  }
  function celdasDe(region) {
    if (Array.isArray(region) && region.length === 2 && Number.isInteger(region[0]) && Number.isInteger(region[1])) {
      const [m, n] = region; dims(m, n);
      const out = []; for (let f = 0; f < m; f++) for (let c = 0; c < n; c++) out.push([f, c]);
      return out;
    }
    validarPieza(region);
    return region.map(q => q.slice()).sort((p, q) => p[0] - q[0] || p[1] - q[1]);
  }
  function compartidos(a, b) {
    const s = new Set(a.map(q => q[0] + ',' + q[1]));
    let k = 0;
    for (const [f, c] of b) for (const [df, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (s.has((f + df) + ',' + (c + dc))) k++;
    return k;
  }
  function partirDos(m, n) {
    dims(m, n);
    const N = m * n;
    if (N % 2) throw new Error('el tablero necesita un número par de casillas');
    if (N > 20) throw new Error('tablero demasiado grande para la fuerza bruta (hasta 20 casillas)');
    const todas = celdasDe([m, n]), mitad = N / 2, lista = [];
    // A siempre lleva la casilla [0, 0]: así cada partición sale una sola vez
    const elegir = (desde, A) => {
      if (A.length === mitad) {
        const sa = new Set(A.map(q => q[0] + ',' + q[1]));
        const B = todas.filter(q => !sa.has(q[0] + ',' + q[1]));
        if (!conexa(A) || !conexa(B)) return;
        const cg = congruentes(A, B);
        if (!cg.es) return;
        const corte = compartidos(A, B);
        lista.push({ A: A.map(q => q.slice()), B, perimetro: perimetro(A), corte, como: cg.como });
        return;
      }
      for (let i = desde; i <= N - (mitad - A.length); i++) { A.push(todas[i]); elegir(i + 1, A); A.pop(); }
    };
    elegir(1, [todas[0]]);
    lista.sort((p, q) => q.perimetro - p.perimetro || clave(p.A).localeCompare(clave(q.A)));
    const porPerimetro = {};
    for (const x of lista) porPerimetro[x.perimetro] = (porPerimetro[x.perimetro] || 0) + 1;
    const maximo = lista.length ? lista[0].perimetro : null, minimo = lista.length ? lista[lista.length - 1].perimetro : null;
    const rectos = [];
    if (n % 2 === 0) rectos.push(2 * (m + n / 2));
    if (m % 2 === 0) rectos.push(2 * (m / 2 + n));
    const recto = rectos.length ? Math.min(...rectos) : null;
    const menores = Object.keys(porPerimetro).map(Number).filter(p => p < maximo);
    return {
      total: lista.length, lista, maximo, minimo, porPerimetro, recto,
      errores: { corteRecto: recto, mitadTablero: m + n, dosPiezas: 2 * maximo, segundo: menores.length ? Math.max(...menores) : null },
    };
  }
  function regionL(a) {
    entero(a, 'a'); if (a < 1 || a > 6) throw new Error('a fuera de rango');
    const out = [];
    for (let f = 0; f < 2 * a; f++) for (let c = 0; c < 2 * a; c++) if (!(f < a && c >= a)) out.push([f, c]);
    return out;
  }
  function partirEn(region, k, lado) {
    const R = celdasDe(region), N = R.length;
    entero(k, 'k');
    if (k < 1 || N % k) throw new Error('la región no se reparte en k piezas de igual área');
    if (N > 40) throw new Error('región demasiado grande');
    const a = N / k, ladoU = lado === undefined ? 1 : lado;
    const enR = new Set(R.map(q => q[0] + ',' + q[1]));
    // formas posibles de la pieza que cubre la primera casilla: crecer piezas conexas dentro de la región
    const formas = new Map();
    const vistas = new Set();
    const crecer = cel => {
      const kk = clave([...cel].sort((p, q) => p[0] - q[0] || p[1] - q[1]));
      if (vistas.has(kk)) return; vistas.add(kk);
      if (cel.length === a) {
        const iso = isometrias(cel), canon = iso.map(x => clave(x.celdas)).sort()[0];
        if (!formas.has(canon)) formas.set(canon, normalizar(cel));
        return;
      }
      const s = new Set(cel.map(q => q[0] + ',' + q[1]));
      for (const [f, c] of cel) for (const [df, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const x = f + df, y = c + dc, kx = x + ',' + y;
        if (enR.has(kx) && !s.has(kx) && (x > R[0][0] || (x === R[0][0] && y > R[0][1]))) crecer(cel.concat([[x, y]]));
      }
    };
    crecer([R[0]]);
    const lista = [], resumen = [];
    for (const forma of formas.values()) {
      const ors = orientaciones(forma).lista;
      let maneras = 0;
      const usadas = new Set();
      const actual = [];
      const llenar = () => {
        const libre = R.find(q => !usadas.has(q[0] + ',' + q[1]));
        if (!libre) { lista.push(actual.map(p => p.map(q => q.slice()))); maneras++; return; }
        for (const o of ors) {
          const [f0, c0] = o[0];
          const pz = o.map(q => [q[0] - f0 + libre[0], q[1] - c0 + libre[1]]);
          if (pz.every(q => enR.has(q[0] + ',' + q[1]) && !usadas.has(q[0] + ',' + q[1]))) {
            pz.forEach(q => usadas.add(q[0] + ',' + q[1])); actual.push(pz);
            llenar();
            actual.pop(); pz.forEach(q => usadas.delete(q[0] + ',' + q[1]));
          }
        }
      };
      llenar();
      if (maneras) { const p = perimetro(forma); resumen.push({ celdas: forma, perimetro: p, metros: p * ladoU, maneras }); }
    }
    resumen.sort((p, q) => p.perimetro - q.perimetro || clave(p.celdas).localeCompare(clave(q.celdas)));
    return { total: lista.length, area: a, formas: resumen, perimetros: [...new Set(resumen.map(x => x.perimetro))].sort((p, q) => p - q), lista };
  }

  // ---------- rearmar ----------
  function mover(celdas, df, dc) { return celdas.map(q => [q[0] + df, q[1] + dc]); }
  function rearmar(pzs) {
    const cuenta = new Map();
    for (const p of pzs) for (const q of p) { const k = q[0] + ',' + q[1]; cuenta.set(k, (cuenta.get(k) || 0) + 1); }
    const todas = [...cuenta.keys()].map(s => s.split(',').map(Number));
    const f0 = Math.min(...todas.map(q => q[0])), f1 = Math.max(...todas.map(q => q[0]));
    const c0 = Math.min(...todas.map(q => q[1])), c1 = Math.max(...todas.map(q => q[1]));
    let solapes = 0; for (const v of cuenta.values()) if (v > 1) solapes += v - 1;
    const alto = f1 - f0 + 1, ancho = c1 - c0 + 1, huecos = alto * ancho - cuenta.size;
    return { encaja: solapes === 0 && huecos === 0, solapes, huecos, alto, ancho, esCuadrado: solapes === 0 && huecos === 0 && alto === ancho };
  }
  function tiras(W, H) {
    entero(W, 'W'); entero(H, 'H');
    const L = Math.round(Math.sqrt(W * H));
    if (L * L !== W * H || W <= H) return { posible: false, lado: Math.sqrt(W * H), trozos: null, cortes: null };
    const falta = L - H, franja = W - L;
    // la franja de franja × H se parte en tiras de franja × falta, que van arriba una al lado de otra
    if (H % falta || (franja * (H / falta)) !== L) return { posible: false, lado: L, trozos: null, cortes: null };
    const tirasN = H / falta;
    const rect = (f0, c0, h, w) => { const o = []; for (let f = f0; f < f0 + h; f++) for (let c = c0; c < c0 + w; c++) o.push([f, c]); return o; };
    const piezas = [rect(0, 0, H, L)], armadas = [rect(falta, 0, H, L)];
    for (let j = 0; j < tirasN; j++) { piezas.push(rect(j * falta, L, falta, franja)); armadas.push(rect(0, j * franja, falta, franja)); }
    return { posible: true, lado: L, trozos: 1 + tirasN, cortes: 1 + (tirasN - 1), piezas, armadas, encaja: rearmar(armadas).esCuadrado };
  }
  function escalera(W, H) {
    entero(W, 'W'); entero(H, 'H');
    if (W < 1 || H < 1 || W > 60 || H > 60) throw new Error('rectángulo fuera de rango');
    const mismoPerimetro = (W + H) / 2, cuartoDelArea = W * H / 4, tr = tiras(W, H);
    const errores = { mismoPerimetro, cuartoDelArea, tiras: tr.posible ? tr.trozos : null };
    let k = 0, t = 0;
    for (let kk = 1; kk <= 20 && !k; kk++) {
      if (W % ((kk + 1) * (kk + 1)) === 0) { const tt = W / ((kk + 1) * (kk + 1)); if (H === kk * kk * tt) { k = kk; t = tt; } }
    }
    if (!k) return { posible: false, lado: Math.sqrt(W * H), errores };
    const w = (k + 1) * t, h = k * t, lado = k * w;
    // bandas: columnas i = 0 … k (de w), filas j = 0 … k − 1 (de h, desde arriba). A = { i ≤ j }: abajo a la izquierda.
    const A = [], B = [];
    for (let f = 0; f < H; f++) for (let c = 0; c < W; c++) { const i = Math.floor(c / w), j = Math.floor(f / h); (i <= j ? A : B).push([f, c]); }
    // B se corre w a la izquierda y h hacia arriba; después todo baja h para empezar en la fila 0
    const Bm = mover(B, -h, -w), cuadrado = [mover(A, h, 0), mover(Bm, h, 0)];
    const rr = rearmar(cuadrado);
    // tramos del corte: los lados entre una casilla de A y una de B
    const enA = new Set(A.map(q => q[0] + ',' + q[1])), corte = [];
    for (const [f, c] of B) {
      if (enA.has(f + ',' + (c - 1))) corte.push([c, f, c, f + 1]);
      if (enA.has((f + 1) + ',' + c)) corte.push([c, f + 1, c + 1, f + 1]);
    }
    return {
      posible: true, k, w, h, t, lado, A, B, mover: { df: -h, dc: -w }, cuadrado, corte, largoCorte: corte.length,
      escalones: k, trozos: 2, cortes: 1, encaja: rr.esCuadrado && rr.alto === lado, errores,
    };
  }

  // ---------- áreas compuestas ----------
  function areaPiezas(lista) {
    if (!Array.isArray(lista)) throw new Error('lista de piezas');
    const areas = lista.map(p => {
      if (p.tipo === 'rect') return p.b * p.h;
      if (p.tipo === 'trap') return (p.B + p.b) * p.h / 2;
      if (p.tipo === 'tri') return p.b * p.h / 2;
      throw new Error('pieza desconocida');
    });
    if (areas.some(x => !(x >= 0))) throw new Error('medidas inválidas');
    return { total: areas.reduce((s, x) => s + x, 0), areas };
  }
  function escaleraEnchape(p, huella, contra, ancho, precio) {
    entero(p, 'p'); if (p < 1 || p > 30) throw new Error('peldaños fuera de rango');
    if (!(huella > 0 && contra > 0 && ancho > 0)) throw new Error('medidas positivas');
    const pr = precio === undefined ? 1 : precio;
    const huellas = p * huella * ancho, contrahuellas = p * contra * ancho;
    // costado escalonado: columnas de huella × (j·contra), j = 1 … p
    const costado = areaPiezas(Array.from({ length: p }, (_, j) => ({ tipo: 'rect', b: huella, h: (j + 1) * contra }))).total;
    const costados = 2 * costado, total = huellas + contrahuellas + costados;
    const rect = p * huella * p * contra;
    return {
      huellas, contrahuellas, costado, costados, total, costo: total * pr,
      errores: {
        sinCostados: (huellas + contrahuellas) * pr, unCostado: (huellas + contrahuellas + costado) * pr,
        costadoRectangulo: (huellas + contrahuellas + 2 * rect) * pr, sinContrahuellas: (huellas + costados) * pr,
      },
    };
  }

  // ---------- perímetros con arcos ----------
  function largo(t) {
    if (t.tipo === 'recto') return { a: t.l, b: 0 };
    if (t.tipo === 'semi') return { a: 0, b: t.d / 2 };
    if (t.tipo === 'cuarto') return { a: 0, b: t.r / 2 };
    throw new Error('tramo desconocido');
  }
  const suma = xs => xs.reduce((s, x) => ({ a: s.a + x.a, b: s.b + x.b }), { a: 0, b: 0 });
  function perimetroZonas(tramos, zonas) {
    const cuantas = {};
    for (const z of zonas) for (const id of z) { if (!tramos[id]) throw new Error('tramo ' + id + ' no existe'); cuantas[id] = (cuantas[id] || 0) + 1; }
    const per = zonas.map(z => suma(z.map(id => largo(tramos[id]))));
    const ids = Object.keys(cuantas), comp = ids.filter(id => cuantas[id] >= 2);
    const una = suma(ids.map(id => largo(tramos[id])));
    const total = suma(per);
    const rectos = suma(ids.filter(id => tramos[id].tipo === 'recto').map(id => ({ a: largo(tramos[id]).a * cuantas[id], b: 0 })));
    const rectosUna = suma(ids.filter(id => tramos[id].tipo === 'recto').map(id => largo(tramos[id])));
    return {
      zonas: per, suma: total, compartidos: comp,
      errores: {
        compartidoUnaVez: una, sinRectos: { a: total.a - rectos.a, b: total.b },
        sinRectosNiCompartido: { a: una.a - rectosUna.a, b: una.b },
      },
    };
  }
  function puntoM(AB, AM) { if (!(AB > 0 && AM > 0 && AM < AB)) throw new Error('M debe quedar entre A y B'); }
  function arcosZonas(AB, AM) {
    puntoM(AB, AM);
    const tr = { arcoAB: { tipo: 'semi', d: AB }, arcoAM: { tipo: 'semi', d: AM }, AM: { tipo: 'recto', l: AM }, MB: { tipo: 'recto', l: AB - AM } };
    return Object.assign(perimetroZonas(tr, [['arcoAM', 'AM'], ['arcoAB', 'arcoAM', 'MB']]), { tramos: tr });
  }
  function curvaS(AB, AM) {
    puntoM(AB, AM);
    const tr = { arriba: { tipo: 'semi', d: AB }, abajo: { tipo: 'semi', d: AB }, sAM: { tipo: 'semi', d: AM }, sMB: { tipo: 'semi', d: AB - AM } };
    return Object.assign(perimetroZonas(tr, [['arriba', 'sAM', 'sMB'], ['abajo', 'sAM', 'sMB']]), { tramos: tr });
  }

  // ---------- fracción de área ----------
  // en medios lados: A (0, 0), B (2, 0), C (2, 2), D (0, 2); el rectángulo mide 4 de estas unidades² (2 × 2 medios lados)
  const PUNTOS = { A: [0, 0], AB: [1, 0], B: [2, 0], BC: [2, 1], C: [2, 2], CD: [1, 2], D: [0, 2], DA: [0, 1], O: [1, 1] };
  const BORDE = ['A', 'AB', 'B', 'BC', 'C', 'CD', 'D', 'DA'];
  const doble = pts => { let s = 0; for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; s += p[0] * q[1] - q[0] * p[1]; } return Math.abs(s); };
  function fraccionTriangulo(P, Q, R) {
    for (const x of [P, Q, R]) if (!PUNTOS[x]) throw new Error('punto ' + x + ' desconocido');
    if (new Set([P, Q, R]).size < 3) throw new Error('tres puntos distintos');
    const d = doble([PUNTOS[P], PUNTOS[Q], PUNTOS[R]]);
    // área del triángulo = d/2 (en medios lados²); el rectángulo = 4 → fracción d/8
    const f = fraccion(d, 8);
    let sobrantes = null, errores = { mitad: fraccion(1, 2) };
    if ([P, Q, R].every(x => BORDE.includes(x))) {
      const ord = [P, Q, R].map(x => BORDE.indexOf(x)).sort((a, b) => a - b);
      sobrantes = [];
      for (let i = 0; i < 3; i++) {
        const a = ord[i], b = ord[(i + 1) % 3], pts = [];
        for (let j = a; ; j = (j + 1) % 8) { pts.push(PUNTOS[BORDE[j]]); if (j === b) break; }
        const s = doble(pts);
        if (s) sobrantes.push(fraccion(s, 8));
      }
      sobrantes.sort((x, y) => x.valor - y.valor);
      if (sobrantes.length) {
        const chica = sobrantes[0], grande = sobrantes[sobrantes.length - 1];
        errores.olvidaUna = fraccion(f.num * chica.den + chica.num * f.den, f.den * chica.den);
        const resta = fraccion(grande.num * sobrantes.length, grande.den);
        errores.todasIguales = fraccion(resta.den - resta.num, resta.den);
        errores.loQueSobra = fraccion(f.den - f.num, f.den);
      }
    }
    return { num: f.num, den: f.den, valor: f.valor, sobrantes, errores };
  }
  function trianguloEn(W, H, P, Q, R) {
    if (!(W > 0 && H > 0)) throw new Error('lados positivos');
    const f = fraccionTriangulo(P, Q, R), pt = x => ({ x: PUNTOS[x][0] * W / 2, y: PUNTOS[x][1] * H / 2 });
    const v = [pt(P), pt(Q), pt(R)];
    const area = Math.abs((v[1].x - v[0].x) * (v[2].y - v[0].y) - (v[2].x - v[0].x) * (v[1].y - v[0].y)) / 2;
    return { area, total: W * H, num: f.num, den: f.den, valor: area / (W * H), vertices: v, puntos: Object.fromEntries(Object.keys(PUNTOS).map(k => [k, pt(k)])) };
  }

  // ---------- conteos ----------
  function ubicaciones(pieza, region) {
    const R = celdasDe(region), enR = new Set(R.map(q => q[0] + ',' + q[1]));
    const base = normalizar(pieza), ors = orientaciones(base), iso = isometrias(base);
    const colocar = o => {
      const out = [];
      const f0 = Math.min(...R.map(q => q[0])), f1 = Math.max(...R.map(q => q[0])), c0 = Math.min(...R.map(q => q[1])), c1 = Math.max(...R.map(q => q[1]));
      for (let df = f0; df <= f1; df++) for (let dc = c0; dc <= c1; dc++) {
        const p = o.map(q => [q[0] + df, q[1] + dc]);
        if (p.every(q => enR.has(q[0] + ',' + q[1]))) out.push(p);
      }
      return out;
    };
    const lista = [];
    ors.lista.forEach((o, i) => {
      const girada = isometrias(base).findIndex(x => clave(x.celdas) === clave(o)) < 4;
      for (const p of colocar(o)) lista.push({ celdas: p, orientacion: i, comoDibujo: i === 0, girada });
    });
    const comoDibujo = lista.filter(x => x.comoDibujo).length, soloGiros = lista.filter(x => x.girada).length;
    const ochoVeces = iso.reduce((s, x) => s + colocar(x.celdas).length, 0);
    // marcos: el rectángulo que encierra la pieza, acostado y parado
    const a = Math.max(...base.map(q => q[0])) + 1, b = Math.max(...base.map(q => q[1])) + 1;
    const lleno = (h, w) => { const o = []; for (let f = 0; f < h; f++) for (let c = 0; c < w; c++) o.push([f, c]); return o; };
    const marcos = colocar(lleno(a, b)).length + (a !== b ? colocar(lleno(b, a)).length : 0);
    return { total: lista.length, lista, orientaciones: ors.total, errores: { comoDibujo, soloGiros, ochoVeces, marcos } };
  }
  function casillasBorde(m, n, g) {
    dims(m, n);
    const gg = g === undefined ? 1 : g; entero(gg, 'g');
    if (gg < 1 || 2 * gg > Math.min(m, n) + 1) throw new Error('grosor fuera de rango');
    let total = 0;
    for (let f = 0; f < m; f++) for (let c = 0; c < n; c++) if (f < gg || c < gg || f >= m - gg || c >= n - gg) total++;
    const formula = m * n - Math.max(0, m - 2 * gg) * Math.max(0, n - 2 * gg);
    return { total, formula, esquinas: 4 * gg * gg, errores: { esquinasDosVeces: 2 * gg * (m + n), sinEsquinas: total - 4 * gg * gg, anillosIguales: gg * (2 * m + 2 * n - 4) } };
  }
  function triangulosPuntos(puntos) {
    if (!Array.isArray(puntos) || puntos.length < 3 || puntos.length > 40) throw new Error('entre 3 y 40 puntos');
    const P = puntos.map(p => { if (!Array.isArray(p) || p.length !== 2 || !p.every(Number.isInteger)) throw new Error('punto inválido'); return p; });
    if (new Set(P.map(p => p.join(','))).size !== P.length) throw new Error('puntos repetidos');
    const n = P.length, det = (i, j, k) => (P[j][0] - P[i][0]) * (P[k][1] - P[i][1]) - (P[k][0] - P[i][0]) * (P[j][1] - P[i][1]);
    let total = 0, alineadas = 0, hv = 0;
    const lista = [];
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) for (let k = j + 1; k < n; k++) {
      if (det(i, j, k)) { total++; if (lista.length <= 400) lista.push([i, j, k]); }
      else { alineadas++; if ((P[i][0] === P[j][0] && P[j][0] === P[k][0]) || (P[i][1] === P[j][1] && P[j][1] === P[k][1])) hv++; }
    }
    // rectas con 3 puntos o más: para cada par, el conjunto de puntos alineados con él
    const rectas = new Map();
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      const en = []; for (let k = 0; k < n; k++) if (!det(i, j, k)) en.push(k);
      if (en.length >= 3) rectas.set(en.join(','), en.length);
    }
    const tam = [...rectas.values()].sort((a, b) => b - a);
    return {
      total, ternas: C(n, 3), alineadas, rectas: tam, lista: total <= 400 ? lista : null,
      errores: { sinRestar: C(n, 3), conOrden: 6 * total, unaPorRecta: C(n, 3) - tam.length, soloFilasColumnas: C(n, 3) - hv },
    };
  }
  function dosRectas(a, b) {
    entero(a, 'a'); entero(b, 'b');
    if (a < 1 || b < 1 || a + b < 3 || a + b > 40) throw new Error('fuera de rango');
    // arriba en y = 0 con x pares; abajo en y = 3 con x impares (corridos): ningún punto cae en una recta de dos de enfrente
    const out = [];
    for (let i = 0; i < a; i++) out.push([2 * i, 0]);
    for (let j = 0; j < b; j++) out.push([2 * j + 1, 3]);
    return out;
  }
  function red(m, n) {
    entero(m, 'm'); entero(n, 'n'); if (m < 1 || n < 1 || m * n > 40) throw new Error('fuera de rango');
    const out = []; for (let y = 0; y < m; y++) for (let x = 0; x < n; x++) out.push([x, y]);
    return out;
  }
  function cuadradosLibres(m, n, sombreadas) {
    dims(m, n);
    const S = new Set((sombreadas || []).map(q => { if (q[0] < 0 || q[1] < 0 || q[0] >= m || q[1] >= n) throw new Error('casilla fuera del tablero'); return q[0] + ',' + q[1]; }));
    let todos = 0;
    const lista = [], porLado = {};
    for (let k = 1; k <= Math.min(m, n); k++) for (let f = 0; f + k <= m; f++) for (let c = 0; c + k <= n; c++) {
      todos++;
      let libre = true;
      for (let a = f; a < f + k && libre; a++) for (let b = c; b < c + k; b++) if (S.has(a + ',' + b)) { libre = false; break; }
      if (libre) { lista.push({ f, c, k }); porLado[k] = (porLado[k] || 0) + 1; }
    }
    const total = lista.length;
    return { total, todos, conSombra: todos - total, porLado, lista, errores: { todos, soloCasillas: porLado[1] || 0 } };
  }
  function diagonal(t) {
    entero(t, 't'); if (t < 1 || t > 20) throw new Error('t fuera de rango');
    const sombra = t => Array.from({ length: t }, (_, i) => [i, i]);
    const r = cuadradosLibres(t, t, sombra(t));
    const terminos = []; for (let i = 1; i <= t; i++) terminos.push(cuadradosLibres(i, i, sombra(i)).total);
    // patrón «las diferencias se duplican», leído de las figuras 1 … t − 1
    let patronDoble = null;
    if (t >= 4) {
      const d = terminos[t - 2] - terminos[t - 3];
      patronDoble = terminos[t - 2] + 2 * d;
    }
    r.sombreadas = sombra(t); r.terminos = terminos; r.errores.patronDoble = patronDoble;
    return r;
  }

  return {
    C, fraccion, azar, normalizar, isometrias, orientaciones, congruentes, perimetro, conexa,
    piezas, cortesEntre, partirDos, partirEn, regionL, mover, rearmar, escalera, tiras,
    areaPiezas, escaleraEnchape, perimetroZonas, arcosZonas, curvaS, fraccionTriangulo, trianguloEn,
    ubicaciones, casillasBorde, triangulosPuntos, dosRectas, red, cuadradosLibres, diagonal,
  };
});
