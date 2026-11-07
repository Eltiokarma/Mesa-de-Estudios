/*
 * Motor de «El lápiz y la hormiga» (razonamiento matemático): figuras de un solo trazo, el recorrido más corto que
 * pasa por todas las líneas de una figura, perímetros de figuras escalonadas y con arcos, caminos más cortos por una
 * cuadrícula de calles (en el plano y en el espacio) y la ruta de una hormiga por la superficie de una caja.
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorTrazos) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Convenciones:
 *   - Una figura es { nodos: [[x, y], ...], tramos: [[i, j], ...] }. Los nodos son todos los puntos donde una línea
 *     termina, dobla o se junta con otra (también donde dos líneas se cruzan); se numeran desde 0. Un tramo une dos
 *     nodos distintos con una línea recta; puede traer un tercer número, su longitud ([i, j, 5]); si no lo trae, su
 *     longitud es la distancia entre los dos nodos. Puede haber dos tramos entre los mismos nodos.
 *   - El grado de un nodo es cuántos tramos llegan a él. Un nodo impar es el de grado impar.
 *   - Un recorrido es la lista de nodos que se visitan en orden; dos nodos seguidos deben estar unidos por un tramo.
 *   - Un polígono es una lista de vértices [[x, y], ...] en orden contrario a las agujas del reloj, con lados solo
 *     horizontales o verticales (polígono ortogonal), sin repetir el primer vértice al final.
 *   - Cuadrícula de calles: m cuadras a la derecha (eje x) y n hacia arriba (eje y); los cruces son (x, y) con
 *     0 ≤ x ≤ m y 0 ≤ y ≤ n; se sale de (0, 0) y se llega a (m, n) moviéndose solo a la derecha o hacia arriba.
 *     Una tabla de cruces es tabla[y][x]. Un camino es una lista de pasos 'D' (derecha) y 'A' (arriba).
 *   - Caja: largo x, ancho y, alto z (positivos). La hormiga sale de la esquina (0, 0, 0) y va a la opuesta (x, y, z)
 *     caminando por la superficie.
 *   - Un «exacto» es un texto con raíces o fracciones simplificadas ('10', '2√21', '2 + 4√5', '6π', '8/3').
 *   - Cada resultado que es la respuesta de una predicción trae 'errores' (lo que da cada error típico) y
 *     'coinciden' (los nombres de los errores que en ese caso dan justo la respuesta correcta: no se ofrecen y no van
 *     en 'errores'). Un error que da lo mismo que otro anterior de la lista va a 'repetidos' ({ nombre: el anterior }).
 *
 * Funciones (argumentos entre llaves):
 *   grados(fig)                 { grados: [grado de cada nodo], impares: [nodos impares, de menor a mayor], numImpares }.
 *   cruces(fig)                 cuántos nodos son un cruce: un punto por el que pasan derechas (sin doblar) dos líneas
 *                               o más, o sea, con al menos dos pares de tramos opuestos (misma recta, sentidos contrarios).
 *   buscarRecorrido(fig, { inicio })   busca por vuelta atrás (backtracking) un recorrido que pase por cada tramo una sola
 *                               vez, sin mirar la regla de los impares: desde 'inicio' si se da, o probando cada nodo con
 *                               tramos, en orden. { recorrido: [nodos] o null, tramos: [índices de tramo en orden] o null,
 *                               probados: cuántas veces el lápiz quedó trabado (sin tramo libre) antes de terminar }.
 *   unTrazo(fig)                { tramos (cuántos), impares, numImpares, conexa (todos los tramos forman una sola pieza),
 *                               regla: 'circuito' (conexa y 0 impares: se vuelve al punto de partida) | 'camino' (conexa
 *                               y 2 impares: se empieza en uno y se termina en el otro) | 'no', trazos (el menor número de
 *                               trazos sin repetir líneas: en cada pieza, la mitad de sus impares, o 1 si no tiene),
 *                               sePuede (lo que da buscarRecorrido), recorrido, probados, empiezaEn (nodos donde puede
 *                               empezar un solo trazo: los dos impares, o todos los que tienen tramos; [] si no se puede),
 *                               errores (para «¿cuántos trazos?»): unoPorImpar (numImpares), unSoloTrazo (1),
 *                               dosSiempre (2) }. Una figura sin tramos da error.
 *   compararFiguras(figs)       2 a 4 figuras, de las que exactamente una se puede de un solo trazo.
 *                               { sePuede: [bool], correcta (índice), lineas: [tramos de cada una], cruces: [de cada una],
 *                               errores: menosLineas (índice de la de menos tramos, si es una sola), sinCruces (índice de
 *                               la única sin cruces, si hay una sola), todas ('todas') }.
 *   revisarTrazo(fig, recorrido)   lo que trazó el alumno. { usados: [índices de tramo en orden], valido, problema: null o
 *                               { paso (posición en el recorrido del nodo al que no se pudo ir), tipo: 'sin-linea' (no hay
 *                               tramo entre los dos nodos) | 'repetida' (los tramos entre ellos ya se usaron) },
 *                               faltan (tramos sin usar), salidas (tramos sin usar que salen del último nodo al que se
 *                               llegó: 0 con tramos por usar quiere decir que el lápiz quedó trabado; null si el recorrido
 *                               está vacío), completo (válido y sin tramos por usar) }. Con dos tramos entre
 *                               los mismos nodos usa primero el de menor índice.
 *   distancias(fig)             la tabla de distancias más cortas entre nodos caminando por los tramos (Floyd-Warshall);
 *                               Infinity si no hay camino.
 *   cartero(fig, { volver })    el recorrido más corto que pasa por todos los tramos (puede repetir algunos), por fuerza
 *                               bruta: prueba todas las formas de emparejar los nodos impares y repite el camino más corto
 *                               entre los de cada par. Con volver = true termina donde empezó (se emparejan todos); si no,
 *                               dos impares quedan como inicio y fin. La figura debe ser conexa y tener a lo más 12 impares.
 *                               { suma (de los tramos), impares, pares: [[u, v]] (los emparejados), repetir: [índices de
 *                               tramo que se pasan dos veces, uno por cada vez de más], repetido (lo que se camina de más),
 *                               minimo: suma + repetido, inicio y fin (nodos), ruta: [nodos] (un recorrido de esa longitud),
 *                               errores: sinRepetir (suma), cerrar (el mínimo volviendo al inicio; solo si volver es false),
 *                               todoDoble (2·suma) }.
 *   escalera({ anchos, altos }) polígono escalonado: columnas de izquierda a derecha de los anchos dados; la columna j
 *                               mide de alto la suma de altos[j..]. { vertices, ancho: Σ anchos, alto: Σ altos }.
 *   muesca({ ancho, alto, desde, hasta, profundidad })   rectángulo de ancho × alto con un entrante rectangular en el lado
 *                               de arriba, entre x = desde y x = hasta, de esa profundidad (0 < desde < hasta < ancho,
 *                               0 < profundidad < alto). { vertices, paredes: [índices de los dos lados verticales del
 *                               entrante] }; el lado k va del vértice k al k + 1.
 *   chakana({ medias, alturas })   cruz escalonada (una chakana simplificada, solo como figura): la unión de los
 *                               rectángulos centrados [−medias[k], medias[k]] × [−alturas[k], alturas[k]], con medias
 *                               crecientes y alturas decrecientes. { vertices, ancho, alto }.
 *   perimetro({ vertices })     polígono ortogonal. { perimetro, area, ancho y alto (del rectángulo que lo encierra),
 *                               caja (perímetro de ese rectángulo), horizontales y verticales (suma de los lados de cada
 *                               clase), sinEntrantes (cada recta horizontal o vertical corta al polígono en un solo tramo),
 *                               exceso (perimetro − caja), lados: [{ eje: 'h' | 'v', desde, hasta, longitud, destino }]
 *                               (destino: el lado del rectángulo hacia el que mira el lado: la y de arriba o de abajo si es
 *                               horizontal, la x de la derecha o de la izquierda si es vertical), errores: soloConNumero
 *                               (ancho + alto), diagonal (ancho + alto + la diagonal del rectángulo), area, comoRectangulo
 *                               (caja), exactos: el texto de cada error }.
 *   semicirculos({ diametro, partes })   un semicírculo sobre un diámetro y, sobre el mismo diámetro, 'partes' semicírculos
 *                               iguales seguidos. { grande: π·diametro/2, chicos: partes · π·(diametro/partes)/2, exacto
 *                               (texto de los dos, iguales: '6π'), errores: cadaUnoComoElGrande (partes · grande),
 *                               comoElArea (grande/partes), comoLaRecta (diametro), exactos }.
 *   caminos({ m, n, cerrados })   caminos más cortos de (0, 0) a (m, n) por la cuadrícula; cerrados: lista de cruces [x, y]
 *                               por los que no se puede pasar (ni el de salida ni el de llegada). Cada cruce suma los
 *                               caminos del de su izquierda y los del de abajo. { caminos, tabla, combinatorio: C(m + n, m)
 *                               (los caminos sin cruces cerrados), errores: producto (m·n), suma (m + n), potencia
 *                               (2^(m + n)), aMano (los caminos con 3 giros o menos, los que salen primero al dibujarlos uno
 *                               por uno) }.
 *   enumerarCaminos({ m, n, cerrados })   por fuerza bruta: revisa las 2^(m + n) listas de pasos D y A. { lista: [caminos en
 *                               orden alfabético, cada uno como texto 'DDAA…'], total, giros: [giros de cada uno] }.
 *   cerrarCruce({ m, n, x, y }) el cruce (x, y) se cierra por obras. { total (sin cerrar), hasta (caminos de (0, 0) al
 *                               cruce), desde (del cruce a (m, n)), porElCruce: hasta · desde, quedan: total − porElCruce,
 *                               tabla (con el cruce cerrado), errores: sinCambio (total), restarUno (total − 1), restarHasta
 *                               (total − hasta), restarDesde (total − desde) }.
 *   caminosEspacio({ a, b, c }) caminos más cortos por las aristas de una reja de a × b × c cubos, de una esquina a la
 *                               opuesta: cada nodo suma los de sus tres vecinos de atrás. { caminos ((a + b + c)!/(a!·b!·c!)),
 *                               tabla[z][y][x], errores: producto ((a + 1)(b + 1)(c + 1): los nodos), potencia (2^(a + b + c)),
 *                               conOrden ((a + b + c)!: ordena los pasos como si todos fueran distintos), sumaCaras
 *                               (C(a + b, a) + C(a + c, a) + C(b + c, b)) }.
 *   hormiga({ x, y, z })        la ruta más corta por la superficie de la caja, de (0, 0, 0) a (x, y, z), probando los tres
 *                               desarrollos de dos caras: { minimo, exacto, mejor (id del desarrollo), desarrollos: [{ id,
 *                               caras: [cara de salida, cara de llegada], largo y suma (los lados del rectángulo que forman
 *                               las dos caras abiertas), longitud: √(largo² + suma²), exacto, cruce: { x, y, z } (donde la
 *                               ruta pasa de una cara a la otra) }] en este orden: 'frente-tapa' (frente y = 0 y tapa
 *                               z = z: √(x² + (y + z)²)), 'frente-costado' (frente y costado x = x: √((x + y)² + z²)),
 *                               'base-costado' (base z = 0 y costado x = x: √((x + z)² + y²)), diagonal (la recta por dentro
 *                               de la caja: √(x² + y² + z²)), diagonalExacta, errores: diagonalInterior, porAristas
 *                               (x + y + z), caraYArista (la menor diagonal de una cara más la arista que falta),
 *                               otroDesarrollo (el segundo mejor desarrollo), exactos: el texto de cada error }.
 *   figuras                     las figuras de la escena (solo datos): sobre (un cuadrado de lado 2 con sus dos diagonales;
 *                               nodos 0 a 3 las esquinas desde abajo a la izquierda, contra las agujas, y 4 el centro),
 *                               casita (el sobre con un techo: nodo 5 en (1; 3,2) unido a las esquinas de arriba), ventanas
 *                               (tres cuadrados de lado 1 en fila: la reja de 3 × 1), parque (el sobre como un rectángulo
 *                               de 8 × 6: lados de 8 y 6 y medias diagonales de 5) y ventanal (cuatro cuadrados en fila: la reja de 4 × 1).
 *                               En una reja de c × f, el nodo (x, y) es el número y·(c + 1) + x.
 *   combinatorio(n, k)          C(n, k) para enteros 0 ≤ k ≤ n.
 *   fraccion(x)                 { num, den, texto ('8/3' o '7') } si x es una fracción de denominador ≤ 1000; si no, null.
 *   radical(n)                  √n simplificada para n entero ≥ 0: { coef, rad, texto ('2√21', '10', '√5'), valor };
 *                               si n no es entero, null.
 *
 * Respaldos (docs/investigacion/): contar caminos haciendo una lista al tanteo y olvidar algunos es AR18 de
 * aritmetica-razonamiento-ideas-erroneas.md (enumeración sin sistema; documentado con cifra por confirmar,
 * Navarro-Pelayo y otros, 1996); ordenar pasos iguales como si fueran distintos es un error de orden (AR17, mismo
 * estudio); dar el área cuando se pide el perímetro es la confusión de GE4 de geometria-ideas-erroneas.md (documentada
 * en el sentido contrario, por eso parcial aquí). Todo lo demás son hipótesis nuestras.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorTrazos = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const EPS = 1e-9;

  function numero(x, que, o) {
    o = o || {};
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que} debe ser un número`);
    if (o.entero && !Number.isInteger(x)) throw new Error(`${que} debe ser un número entero`);
    if (o.positivo && !(x > 0)) throw new Error(`${que} debe ser mayor que cero`);
    if (o.noNegativo && x < 0) throw new Error(`${que} no puede ser negativo`);
    if (o.min !== undefined && x < o.min) throw new Error(`${que} debe ser al menos ${o.min}`);
    if (o.max !== undefined && x > o.max) throw new Error(`${que} debe ser como mucho ${o.max}`);
    return x;
  }
  function objeto(o, que) {
    if (!o || typeof o !== 'object') throw new Error(`${que} debe ser un objeto con los datos`);
    return o;
  }
  function limpio(x) {
    if (typeof x !== 'number') return x;
    for (const p of [1, 100, 1e4, 1e6]) { const y = Math.round(x * p) / p; if (Math.abs(x - y) <= 1e-11 * Math.max(1, Math.abs(x))) return y + 0; }
    return x;
  }
  const casi = (a, b) => Math.abs(a - b) <= EPS * Math.max(1, Math.abs(a), Math.abs(b));
  const igual = (a, b) => (typeof a === 'number' && typeof b === 'number' ? casi(a, b) : a === b);
  function apartar(errores, correcto) {
    const e = {}, coinciden = [], repetidos = {};
    for (const [k, v] of Object.entries(errores)) {
      if (v === null || v === undefined || (typeof v === 'number' && !Number.isFinite(v))) continue;
      if (igual(v, correcto)) { coinciden.push(k); continue; }
      const antes = Object.keys(e).find(j => igual(e[j], v));
      if (antes) { repetidos[k] = antes; continue; }
      e[k] = typeof v === 'number' ? limpio(v) : v;
    }
    return { errores: e, coinciden, repetidos };
  }
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };

  // ---------- Exactos ----------
  function fraccion(x) {
    numero(x, 'el número');
    for (let den = 1; den <= 1000; den++) {
      const num = Math.round(x * den);
      if (Math.abs(num / den - x) <= 1e-9 * Math.max(1, Math.abs(x))) {
        const g = mcd(num, den) || 1, n = num / g, d = den / g;
        return { num: n, den: d, texto: d === 1 ? String(n) : `${n}/${d}` };
      }
    }
    return null;
  }
  function radical(n) {
    numero(n, 'el número bajo la raíz', { noNegativo: true });
    const m = Math.round(n);
    if (Math.abs(m - n) > 1e-9) return null;
    let coef = 1, rad = m;
    for (let f = 2; f * f <= rad; f++) while (rad % (f * f) === 0) { rad /= f * f; coef *= f; }
    const texto = rad === 1 ? String(coef) : (coef === 1 ? `√${rad}` : `${coef}√${rad}`);
    return { coef, rad, texto, valor: coef * Math.sqrt(rad) };
  }
  // Texto de una suma de raíces de enteros: los enteros juntos y primero.
  function sumaExacta(cuadrados) {
    const partes = [];
    let entero = 0;
    for (const c of cuadrados) {
      const r = radical(c); if (!r) return null;
      if (r.rad === 1) entero += r.coef; else partes.push(r.texto);
    }
    if (entero) partes.unshift(String(entero));
    return partes.length ? partes.join(' + ') : '0';
  }
  const textoPi = k => { const f = fraccion(k); if (!f) return null; return f.texto === '1' ? 'π' : (f.den === 1 ? `${f.num}π` : `${f.num}π/${f.den}`); };
  function combinatorio(n, k) {
    numero(n, 'n', { entero: true, noNegativo: true }); numero(k, 'k', { entero: true, noNegativo: true });
    if (k > n) throw new Error('k no puede ser mayor que n');
    let r = 1;
    for (let i = 1; i <= k; i++) r = r * (n - k + i) / i;
    return Math.round(r);
  }
  const factorial = n => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; };

  // ---------- Figuras ----------
  function figura(f, que) {
    objeto(f, que);
    if (!Array.isArray(f.nodos) || !f.nodos.length) throw new Error('la figura necesita una lista de nodos');
    for (const p of f.nodos) if (!Array.isArray(p) || p.length !== 2 || !p.every(Number.isFinite)) throw new Error(`nodo inválido: ${JSON.stringify(p)}`);
    if (!Array.isArray(f.tramos)) throw new Error('la figura necesita una lista de tramos');
    const n = f.nodos.length;
    const tramos = f.tramos.map(t => {
      if (!Array.isArray(t) || (t.length !== 2 && t.length !== 3)) throw new Error(`tramo inválido: ${JSON.stringify(t)}`);
      const [i, j] = t;
      if (!Number.isInteger(i) || !Number.isInteger(j) || i < 0 || j < 0 || i >= n || j >= n) throw new Error(`tramo inválido: ${JSON.stringify(t)}`);
      if (i === j) throw new Error('un tramo debe unir dos nodos distintos');
      const L = t.length === 3 ? numero(t[2], 'la longitud de un tramo', { positivo: true }) : Math.hypot(f.nodos[i][0] - f.nodos[j][0], f.nodos[i][1] - f.nodos[j][1]);
      if (!(L > 0)) throw new Error('un tramo no puede unir dos nodos en el mismo lugar');
      return { i, j, L };
    });
    const ady = Array.from({ length: n }, () => []);
    tramos.forEach((t, k) => { ady[t.i].push(k); ady[t.j].push(k); });
    return { n, nodos: f.nodos, tramos, ady };
  }
  const otro = (t, v) => (t.i === v ? t.j : t.i);
  function grados(f) {
    const F = figura(f, 'grados');
    const g = F.ady.map(a => a.length), impares = [];
    g.forEach((x, k) => { if (x % 2) impares.push(k); });
    return { grados: g, impares, numImpares: impares.length };
  }
  function cruces(f) {
    const F = figura(f, 'cruces');
    let total = 0;
    for (let v = 0; v < F.n; v++) {
      const dirs = F.ady[v].map(k => { const w = otro(F.tramos[k], v); return [F.nodos[w][0] - F.nodos[v][0], F.nodos[w][1] - F.nodos[v][1]]; });
      let pares = 0;
      const usado = new Array(dirs.length).fill(false);
      for (let a = 0; a < dirs.length; a++) for (let b = a + 1; b < dirs.length; b++) {
        if (usado[a] || usado[b]) continue;
        const [x1, y1] = dirs[a], [x2, y2] = dirs[b];
        const cruz = x1 * y2 - x2 * y1, punto = x1 * x2 + y1 * y2;
        if (Math.abs(cruz) <= 1e-9 * Math.hypot(x1, y1) * Math.hypot(x2, y2) && punto < 0) { pares++; usado[a] = usado[b] = true; }
      }
      if (pares >= 2) total++;
    }
    return total;
  }
  // piezas: grupos de nodos con tramos que están unidos
  function piezas(F) {
    const comp = new Array(F.n).fill(-1);
    let c = 0;
    for (let s = 0; s < F.n; s++) {
      if (comp[s] >= 0 || !F.ady[s].length) continue;
      const pila = [s]; comp[s] = c;
      while (pila.length) { const v = pila.pop(); for (const k of F.ady[v]) { const w = otro(F.tramos[k], v); if (comp[w] < 0) { comp[w] = c; pila.push(w); } } }
      c++;
    }
    return { comp, cuantas: c };
  }
  function buscar(F, inicio) {
    const usado = new Array(F.tramos.length).fill(false), camino = [], tramos = [];
    let probados = 0;
    const total = F.tramos.length;
    function ir(v) {
      camino.push(v);
      if (tramos.length === total) return true;
      let alguno = false;
      for (const k of F.ady[v]) {
        if (usado[k]) continue;
        alguno = true;
        usado[k] = true; tramos.push(k);
        if (ir(otro(F.tramos[k], v))) return true;
        usado[k] = false; tramos.pop();
      }
      if (!alguno) probados++;
      camino.pop();
      return false;
    }
    const inicios = inicio === undefined ? [...Array(F.n).keys()].filter(v => F.ady[v].length) : [inicio];
    for (const s of inicios) if (ir(s)) return { recorrido: camino.slice(), tramos: tramos.slice(), probados };
    return { recorrido: null, tramos: null, probados };
  }
  function buscarRecorrido(f, o) {
    const F = figura(f, 'buscarRecorrido');
    o = o || {};
    let inicio;
    if (o.inicio !== undefined) inicio = numero(o.inicio, 'el inicio', { entero: true, min: 0, max: F.n - 1 });
    if (!F.tramos.length) throw new Error('la figura no tiene tramos');
    return buscar(F, inicio);
  }
  function unTrazo(f) {
    const F = figura(f, 'unTrazo');
    if (!F.tramos.length) throw new Error('la figura no tiene tramos');
    const G = grados(f), P = piezas(F);
    const conexa = P.cuantas === 1;
    let trazos = 0;
    for (let c = 0; c < P.cuantas; c++) { const imp = G.impares.filter(v => P.comp[v] === c).length; trazos += Math.max(1, imp / 2); }
    const regla = conexa && G.numImpares === 0 ? 'circuito' : conexa && G.numImpares === 2 ? 'camino' : 'no';
    const B = buscar(F);
    const empiezaEn = regla === 'circuito' ? [...Array(F.n).keys()].filter(v => F.ady[v].length) : regla === 'camino' ? G.impares.slice() : [];
    const { errores, coinciden, repetidos } = apartar({ unoPorImpar: G.numImpares, unSoloTrazo: 1, dosSiempre: 2 }, trazos);
    return { tramos: F.tramos.length, impares: G.impares, numImpares: G.numImpares, conexa, regla, trazos, sePuede: !!B.recorrido,
      recorrido: B.recorrido, probados: B.probados, empiezaEn, errores, coinciden, repetidos };
  }
  function compararFiguras(figs) {
    if (!Array.isArray(figs) || figs.length < 2 || figs.length > 4) throw new Error('compararFiguras necesita una lista de 2 a 4 figuras');
    const R = figs.map(f => unTrazo(f));
    const sePuede = R.map(r => r.sePuede);
    const buenas = sePuede.map((s, k) => (s ? k : -1)).filter(k => k >= 0);
    if (buenas.length !== 1) throw new Error('exactamente una de las figuras debe poder hacerse de un solo trazo');
    const lineas = R.map(r => r.tramos), cr = figs.map(f => cruces(f));
    const min = Math.min(...lineas), conMin = lineas.map((l, k) => (l === min ? k : -1)).filter(k => k >= 0);
    const sin = cr.map((c, k) => (c === 0 ? k : -1)).filter(k => k >= 0);
    const { errores, coinciden, repetidos } = apartar({ menosLineas: conMin.length === 1 ? conMin[0] : null, sinCruces: sin.length === 1 ? sin[0] : null, todas: 'todas' }, buenas[0]);
    return { sePuede, correcta: buenas[0], lineas, cruces: cr, errores, coinciden, repetidos };
  }
  function revisarTrazo(f, recorrido) {
    const F = figura(f, 'revisarTrazo');
    if (!Array.isArray(recorrido)) throw new Error('el recorrido debe ser una lista de nodos');
    recorrido.forEach(v => numero(v, 'un nodo del recorrido', { entero: true, min: 0, max: F.n - 1 }));
    const usado = new Array(F.tramos.length).fill(false), usados = [];
    let problema = null;
    for (let p = 1; p < recorrido.length; p++) {
      const u = recorrido[p - 1], v = recorrido[p];
      const entre = F.ady[u].filter(k => otro(F.tramos[k], u) === v);
      if (!entre.length) { problema = { paso: p, tipo: 'sin-linea' }; break; }
      const libre = entre.find(k => !usado[k]);
      if (libre === undefined) { problema = { paso: p, tipo: 'repetida' }; break; }
      usado[libre] = true; usados.push(libre);
    }
    const faltan = F.tramos.length - usados.length;
    let salidas = null;
    if (recorrido.length) { const ult = recorrido[problema ? problema.paso - 1 : recorrido.length - 1]; salidas = F.ady[ult].filter(k => !usado[k]).length; }
    return { usados, valido: !problema, problema, faltan, salidas, completo: !problema && faltan === 0 };
  }
  function floyd(F) {
    const D = Array.from({ length: F.n }, (_, i) => Array.from({ length: F.n }, (_, j) => (i === j ? 0 : Infinity)));
    const sig = Array.from({ length: F.n }, () => new Array(F.n).fill(-1));   // tramo con que se sale de i hacia j
    F.tramos.forEach((t, k) => {
      if (t.L < D[t.i][t.j] - EPS) { D[t.i][t.j] = D[t.j][t.i] = t.L; sig[t.i][t.j] = k; sig[t.j][t.i] = k; }
    });
    const prox = Array.from({ length: F.n }, (_, i) => Array.from({ length: F.n }, (_, j) => (sig[i][j] >= 0 ? j : -1)));
    for (let m = 0; m < F.n; m++) for (let i = 0; i < F.n; i++) for (let j = 0; j < F.n; j++) {
      if (D[i][m] + D[m][j] < D[i][j] - EPS) { D[i][j] = D[i][m] + D[m][j]; prox[i][j] = prox[i][m]; }
    }
    return { D, prox, sig };
  }
  function distancias(f) { return floyd(figura(f, 'distancias')).D.map(fila => fila.map(limpio)); }
  // tramos del camino más corto de u a v
  function caminoCorto(F, Fl, u, v) {
    const out = [];
    let a = u;
    while (a !== v) {
      const b = Fl.prox[a][v];
      // el tramo más corto entre a y b (el que guardó Floyd para el par directo)
      const k = F.ady[a].filter(t => otro(F.tramos[t], a) === b).reduce((m, t) => (m < 0 || F.tramos[t].L < F.tramos[m].L - EPS ? t : m), -1);
      out.push(k); a = b;
    }
    return out;
  }
  // todas las formas de emparejar una lista (de largo par): el menor costo
  function mejorEmparejamiento(lista, costo) {
    let mejor = { c: Infinity, pares: null };
    (function ir(resto, pares, c) {
      if (c >= mejor.c - EPS) return;
      if (!resto.length) { mejor = { c, pares: pares.slice() }; return; }
      const [u, ...otros] = resto;
      for (let k = 0; k < otros.length; k++) {
        const v = otros[k];
        pares.push([u, v]);
        ir(otros.filter((_, j) => j !== k), pares, c + costo(u, v));
        pares.pop();
      }
    })(lista, [], 0);
    return mejor;
  }
  function cartero(f, o) {
    const F = figura(f, 'cartero');
    o = o || {};
    if (!F.tramos.length) throw new Error('la figura no tiene tramos');
    if (piezas(F).cuantas !== 1) throw new Error('la figura debe ser de una sola pieza');
    const volver = !!o.volver, G = grados(f);
    if (G.numImpares > 12) throw new Error('la figura puede tener como mucho 12 nodos impares');
    const Fl = floyd(F), costo = (u, v) => Fl.D[u][v];
    const suma = F.tramos.reduce((s, t) => s + t.L, 0);
    const resolver = cerrado => {
      const imp = G.impares;
      if (cerrado || imp.length === 0) { const M = mejorEmparejamiento(imp, costo); return { c: M.c, pares: M.pares, libres: [] }; }
      let mejor = { c: Infinity };
      for (let a = 0; a < imp.length; a++) for (let b = a + 1; b < imp.length; b++) {
        const M = mejorEmparejamiento(imp.filter((_, k) => k !== a && k !== b), costo);
        if (M.c < mejor.c - EPS) mejor = { c: M.c, pares: M.pares, libres: [imp[a], imp[b]] };
      }
      return mejor;
    };
    const S = resolver(volver), C = volver ? S : resolver(true);
    const repetir = [];
    for (const [u, v] of S.pares) repetir.push(...caminoCorto(F, Fl, u, v));
    // la ruta: un recorrido de una sola vez por la figura con los tramos repetidos agregados
    const extra = { nodos: f.nodos, tramos: F.tramos.map(t => [t.i, t.j, t.L]).concat(repetir.map(k => [F.tramos[k].i, F.tramos[k].j, F.tramos[k].L])) };
    const FE = figura(extra, 'cartero');
    const inicio = S.libres.length ? S.libres[0] : F.tramos[0].i;
    const B = buscar(FE, inicio);
    const minimo = suma + S.c;
    const { errores, coinciden, repetidos } = apartar({ sinRepetir: suma, cerrar: volver ? null : suma + C.c, todoDoble: 2 * suma }, minimo);
    return { suma: limpio(suma), impares: G.impares, pares: S.pares, repetir, repetido: limpio(S.c), minimo: limpio(minimo),
      inicio, fin: B.recorrido[B.recorrido.length - 1], ruta: B.recorrido, errores, coinciden, repetidos };
  }

  // ---------- Perímetros ----------
  function poligono(o, que) {
    objeto(o, que);
    const V = o.vertices;
    if (!Array.isArray(V) || V.length < 4) throw new Error('el polígono necesita al menos 4 vértices');
    for (const p of V) if (!Array.isArray(p) || p.length !== 2 || !p.every(Number.isFinite)) throw new Error(`vértice inválido: ${JSON.stringify(p)}`);
    for (let k = 0; k < V.length; k++) {
      const a = V[k], b = V[(k + 1) % V.length];
      const h = Math.abs(a[1] - b[1]) <= EPS, v = Math.abs(a[0] - b[0]) <= EPS;
      if (h === v) throw new Error('cada lado debe ser horizontal o vertical (y no medir cero)');
    }
    return V;
  }
  function areaFirmada(V) { let s = 0; for (let k = 0; k < V.length; k++) { const a = V[k], b = V[(k + 1) % V.length]; s += a[0] * b[1] - b[0] * a[1]; } return s / 2; }
  function perimetro(o) {
    const V = poligono(o, 'perimetro');
    const A = areaFirmada(V);
    if (!(A > 0)) throw new Error('los vértices deben ir en sentido contrario a las agujas del reloj');
    const xs = V.map(p => p[0]), ys = V.map(p => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    let per = 0, hor = 0, ver = 0;
    const lados = V.map((a, k) => {
      const b = V[(k + 1) % V.length], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.abs(dx) + Math.abs(dy);
      per += L;
      if (Math.abs(dy) <= EPS) { hor += L; return { eje: 'h', desde: a.slice(), hasta: b.slice(), longitud: limpio(L), destino: dx > 0 ? y0 : y1 }; }
      ver += L; return { eje: 'v', desde: a.slice(), hasta: b.slice(), longitud: limpio(L), destino: dy > 0 ? x1 : x0 };
    });
    // sin entrantes: cada recta horizontal (o vertical) entre dos niveles corta al polígono en un solo tramo
    const cortes = (fijo, eje) => lados.filter(l => l.eje !== eje && (Math.min(l.desde[eje === 'h' ? 1 : 0], l.hasta[eje === 'h' ? 1 : 0]) < fijo && Math.max(l.desde[eje === 'h' ? 1 : 0], l.hasta[eje === 'h' ? 1 : 0]) > fijo)).length;
    const niveles = arr => { const u = [...new Set(arr)].sort((p, q) => p - q); const m = []; for (let k = 0; k + 1 < u.length; k++) m.push((u[k] + u[k + 1]) / 2); return m; };
    const sinEntrantes = niveles(ys).every(y => cortes(y, 'h') === 2) && niveles(xs).every(x => cortes(x, 'v') === 2);
    const ancho = limpio(x1 - x0), alto = limpio(y1 - y0), caja = limpio(2 * (ancho + alto));
    const diag2 = ancho * ancho + alto * alto;
    const crudos = { soloConNumero: ancho + alto, diagonal: ancho + alto + Math.sqrt(diag2), area: A, comoRectangulo: caja };
    const { errores, coinciden, repetidos } = apartar(crudos, per);
    const txt = { soloConNumero: exactoNum(ancho + alto), diagonal: sumaExacta([(ancho + alto) * (ancho + alto), diag2]), area: exactoNum(A), comoRectangulo: exactoNum(caja) };
    const exactos = {};
    for (const k of Object.keys(errores)) exactos[k] = txt[k];
    return { perimetro: limpio(per), area: limpio(A), ancho, alto, caja, horizontales: limpio(hor), verticales: limpio(ver), sinEntrantes,
      exceso: limpio(per - caja), lados, errores, exactos, coinciden, repetidos };
  }
  function exactoNum(x) { const f = fraccion(x); return f ? f.texto : null; }
  function escalera(o) {
    objeto(o, 'escalera');
    const an = o.anchos, al = o.altos;
    if (!Array.isArray(an) || !Array.isArray(al) || !an.length || an.length !== al.length) throw new Error('anchos y altos deben ser listas del mismo largo');
    an.forEach(v => numero(v, 'un ancho', { positivo: true })); al.forEach(v => numero(v, 'un alto', { positivo: true }));
    const W = an.reduce((s, v) => s + v, 0), H = al.reduce((s, v) => s + v, 0);
    const V = [[0, 0], [limpio(W), 0]];
    let x = W;
    for (let j = an.length - 1; j >= 0; j--) {
      const h = limpio(al.slice(j).reduce((s, v) => s + v, 0));
      V.push([limpio(x), h]);
      x -= an[j];
      V.push([limpio(x), h]);
    }
    V.pop();                                   // el último vuelve a x = 0: se une con (0, 0)
    V.push([0, limpio(H)]);
    return { vertices: V, ancho: limpio(W), alto: limpio(H) };
  }
  function muesca(o) {
    objeto(o, 'muesca');
    const W = numero(o.ancho, 'el ancho', { positivo: true }), H = numero(o.alto, 'el alto', { positivo: true });
    const a = numero(o.desde, 'desde', { positivo: true }), b = numero(o.hasta, 'hasta', { positivo: true }), e = numero(o.profundidad, 'la profundidad', { positivo: true });
    if (!(a < b - EPS && b < W - EPS)) throw new Error('el entrante debe quedar dentro del lado de arriba: 0 < desde < hasta < ancho');
    if (!(e < H - EPS)) throw new Error('la profundidad debe ser menor que el alto');
    const V = [[0, 0], [W, 0], [W, H], [b, H], [b, limpio(H - e)], [a, limpio(H - e)], [a, H], [0, H]];
    return { vertices: V, paredes: [3, 5] };
  }
  function chakana(o) {
    objeto(o, 'chakana');
    const md = o.medias, al = o.alturas;
    if (!Array.isArray(md) || !Array.isArray(al) || md.length < 1 || md.length !== al.length) throw new Error('medias y alturas deben ser listas del mismo largo');
    md.forEach(v => numero(v, 'una media', { positivo: true })); al.forEach(v => numero(v, 'una altura', { positivo: true }));
    for (let k = 1; k < md.length; k++) if (!(md[k] > md[k - 1] && al[k] < al[k - 1])) throw new Error('las medias deben crecer y las alturas decrecer');
    // un cuarto (arriba a la derecha), desde el eje vertical hasta el horizontal
    const q = [];
    for (let k = 0; k < md.length; k++) { q.push([md[k], al[k]]); if (k + 1 < md.length) q.push([md[k], al[k + 1]]); }
    const V = [];
    // cuadrante IV (de abajo hacia la derecha), I, II y III
    const IV = q.map(p => [p[0], -p[1]]);                    // desde (m0, −a0) hasta (mk, −ak)
    const I = q.slice().reverse().map(p => [p[0], p[1]]);    // desde (mk, ak) hasta (m0, a0)
    const II = q.map(p => [-p[0], p[1]]);                    // desde (−m0, a0) hasta (−mk, ak)
    const III = q.slice().reverse().map(p => [-p[0], -p[1]]);// desde (−mk, −ak) hasta (−m0, −a0)
    for (const p of [...IV, ...I, ...II, ...III]) V.push(p.map(v => limpio(v + 0)));
    return { vertices: V, ancho: limpio(2 * md[md.length - 1]), alto: limpio(2 * al[0]) };
  }
  function semicirculos(o) {
    objeto(o, 'semicirculos');
    const D = numero(o.diametro, 'el diámetro', { positivo: true }), n = numero(o.partes, 'las partes', { entero: true, min: 1 });
    const grande = Math.PI * D / 2, chicos = n * Math.PI * (D / n) / 2;
    const { errores, coinciden, repetidos } = apartar({ cadaUnoComoElGrande: n * grande, comoElArea: grande / n, comoLaRecta: D }, chicos);
    const txt = { cadaUnoComoElGrande: textoPi(n * D / 2), comoElArea: textoPi(D / (2 * n)), comoLaRecta: exactoNum(D) };
    const exactos = {};
    for (const k of Object.keys(errores)) exactos[k] = txt[k];
    return { grande: limpio(grande), chicos: limpio(chicos), exacto: textoPi(D / 2), errores, exactos, coinciden, repetidos };
  }

  // ---------- Caminos ----------
  function datosCuadricula(o, que) {
    objeto(o, que);
    const m = numero(o.m, 'm (cuadras a la derecha)', { entero: true, min: 0, max: 12 }), n = numero(o.n, 'n (cuadras hacia arriba)', { entero: true, min: 0, max: 12 });
    if (m + n < 1) throw new Error('la cuadrícula debe tener al menos una cuadra');
    const cerr = (o.cerrados || []).map(c => {
      if (!Array.isArray(c) || c.length !== 2 || !Number.isInteger(c[0]) || !Number.isInteger(c[1]) || c[0] < 0 || c[1] < 0 || c[0] > m || c[1] > n) throw new Error(`cruce cerrado inválido: ${JSON.stringify(c)}`);
      if ((c[0] === 0 && c[1] === 0) || (c[0] === m && c[1] === n)) throw new Error('no se puede cerrar el cruce de salida ni el de llegada');
      return c[0] + ',' + c[1];
    });
    return { m, n, cerrado: new Set(cerr) };
  }
  function tablaCaminos(m, n, cerrado) {
    const T = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let y = 0; y <= n; y++) for (let x = 0; x <= m; x++) {
      if (cerrado.has(x + ',' + y)) { T[y][x] = 0; continue; }
      T[y][x] = x === 0 && y === 0 ? 1 : (x > 0 ? T[y][x - 1] : 0) + (y > 0 ? T[y - 1][x] : 0);
    }
    return T;
  }
  function enumerar(m, n, cerrado) {
    const L = m + n, lista = [], giros = [];
    for (let b = 0; b < (1 << L); b++) {
      let s = '', x = 0, y = 0, ok = true;
      for (let k = L - 1; k >= 0; k--) {
        const arriba = (b >> k) & 1;
        if (arriba) { y++; s += 'A'; } else { x++; s += 'D'; }
        if (x > m || y > n || cerrado.has(x + ',' + y)) { ok = false; break; }
      }
      if (!ok || x !== m || y !== n) continue;
      lista.push(s);
    }
    lista.sort();
    for (const s of lista) { let g = 0; for (let k = 1; k < s.length; k++) if (s[k] !== s[k - 1]) g++; giros.push(g); }
    return { lista, total: lista.length, giros };
  }
  function enumerarCaminos(o) {
    const { m, n, cerrado } = datosCuadricula(o, 'enumerarCaminos');
    return enumerar(m, n, cerrado);
  }
  function caminos(o) {
    const { m, n, cerrado } = datosCuadricula(o, 'caminos');
    const T = tablaCaminos(m, n, cerrado), N = T[n][m];
    const En = enumerar(m, n, cerrado);
    const aMano = En.giros.filter(g => g <= 3).length;
    const { errores, coinciden, repetidos } = apartar({ producto: m * n, suma: m + n, potencia: Math.pow(2, m + n), aMano }, N);
    return { caminos: N, tabla: T, combinatorio: combinatorio(m + n, m), errores, coinciden, repetidos };
  }
  function cerrarCruce(o) {
    objeto(o, 'cerrarCruce');
    const { m, n } = datosCuadricula({ m: o.m, n: o.n }, 'cerrarCruce');
    const x = numero(o.x, 'x del cruce', { entero: true, min: 0, max: m }), y = numero(o.y, 'y del cruce', { entero: true, min: 0, max: n });
    const D = datosCuadricula({ m, n, cerrados: [[x, y]] }, 'cerrarCruce');
    const total = combinatorio(m + n, m), hasta = combinatorio(x + y, x), desde = combinatorio(m - x + n - y, m - x);
    const T = tablaCaminos(m, n, D.cerrado), quedan = T[n][m];
    const { errores, coinciden, repetidos } = apartar({ sinCambio: total, restarUno: total - 1, restarHasta: total - hasta, restarDesde: total - desde }, quedan);
    return { total, hasta, desde, porElCruce: hasta * desde, quedan, tabla: T, errores, coinciden, repetidos };
  }
  function caminosEspacio(o) {
    objeto(o, 'caminosEspacio');
    const a = numero(o.a, 'a', { entero: true, min: 0, max: 6 }), b = numero(o.b, 'b', { entero: true, min: 0, max: 6 }), c = numero(o.c, 'c', { entero: true, min: 0, max: 6 });
    if (a + b + c < 1) throw new Error('la reja debe tener al menos una arista');
    const T = Array.from({ length: c + 1 }, () => Array.from({ length: b + 1 }, () => new Array(a + 1).fill(0)));
    for (let z = 0; z <= c; z++) for (let y = 0; y <= b; y++) for (let x = 0; x <= a; x++) {
      T[z][y][x] = x + y + z === 0 ? 1 : (x ? T[z][y][x - 1] : 0) + (y ? T[z][y - 1][x] : 0) + (z ? T[z - 1][y][x] : 0);
    }
    const N = T[c][b][a];
    const { errores, coinciden, repetidos } = apartar({ producto: (a + 1) * (b + 1) * (c + 1), potencia: Math.pow(2, a + b + c), conOrden: factorial(a + b + c),
      sumaCaras: combinatorio(a + b, a) + combinatorio(a + c, a) + combinatorio(b + c, b) }, N);
    return { caminos: N, tabla: T, errores, coinciden, repetidos };
  }

  // ---------- La hormiga ----------
  function hormiga(o) {
    objeto(o, 'hormiga');
    const x = numero(o.x, 'el largo x', { positivo: true }), y = numero(o.y, 'el ancho y', { positivo: true }), z = numero(o.z, 'el alto z', { positivo: true });
    const des = [
      { id: 'frente-tapa', caras: ['frente', 'tapa'], largo: x, suma: y + z, cruce: { x: x * z / (y + z), y: 0, z } },
      { id: 'frente-costado', caras: ['frente', 'costado'], largo: z, suma: x + y, cruce: { x, y: 0, z: z * x / (x + y) } },
      { id: 'base-costado', caras: ['base', 'costado'], largo: y, suma: x + z, cruce: { x, y: y * x / (x + z), z: 0 } },
    ].map(d => {
      const c2 = d.largo * d.largo + d.suma * d.suma, r = radical(c2);
      return { id: d.id, caras: d.caras, largo: limpio(d.largo), suma: limpio(d.suma), longitud: limpio(Math.sqrt(c2)), exacto: r ? r.texto : null,
        cruce: { x: limpio(d.cruce.x), y: limpio(d.cruce.y), z: limpio(d.cruce.z) } };
    });
    const orden = des.slice().sort((p, q) => p.longitud - q.longitud);
    const mejor = orden[0], segundo = orden.find(d => !casi(d.longitud, mejor.longitud));
    const d2 = x * x + y * y + z * z, diagonal = Math.sqrt(d2), rd = radical(d2);
    const caras = [[x, y, z], [x, z, y], [y, z, x]].map(([p, q, r]) => ({ v: Math.sqrt(p * p + q * q) + r, t: sumaExacta([r * r, p * p + q * q]) }));
    const cya = caras.reduce((m, c) => (c.v < m.v - EPS ? c : m), caras[0]);
    const crudos = { diagonalInterior: diagonal, porAristas: x + y + z, caraYArista: cya.v, otroDesarrollo: segundo ? segundo.longitud : null };
    const { errores, coinciden, repetidos } = apartar(crudos, mejor.longitud);
    const txt = { diagonalInterior: rd ? rd.texto : null, porAristas: exactoNum(x + y + z), caraYArista: cya.t, otroDesarrollo: segundo ? segundo.exacto : null };
    const exactos = {};
    for (const k of Object.keys(errores)) exactos[k] = txt[k];
    return { minimo: mejor.longitud, exacto: mejor.exacto, mejor: mejor.id, desarrollos: des, diagonal: limpio(diagonal), diagonalExacta: rd ? rd.texto : null,
      errores, exactos, coinciden, repetidos };
  }

  // ---------- Las figuras de la escena (datos) ----------
  function reja(columnas, filas, lado) {
    const nodos = [], tramos = [], id = (x, y) => y * (columnas + 1) + x;
    for (let y = 0; y <= filas; y++) for (let x = 0; x <= columnas; x++) nodos.push([x * lado, y * lado]);
    for (let y = 0; y <= filas; y++) for (let x = 0; x <= columnas; x++) {
      if (x < columnas) tramos.push([id(x, y), id(x + 1, y)]);
      if (y < filas) tramos.push([id(x, y), id(x, y + 1)]);
    }
    return { nodos, tramos };
  }
  const X_DEL_SOBRE = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 4], [1, 4], [2, 4], [3, 4]];
  const figuras = {
    sobre: { nodos: [[0, 0], [2, 0], [2, 2], [0, 2], [1, 1]], tramos: X_DEL_SOBRE },
    casita: { nodos: [[0, 0], [2, 0], [2, 2], [0, 2], [1, 1], [1, 3.2]], tramos: X_DEL_SOBRE.concat([[3, 5], [2, 5]]) },
    ventanas: reja(3, 1, 1),
    parque: { nodos: [[0, 0], [8, 0], [8, 6], [0, 6], [4, 3]], tramos: X_DEL_SOBRE },
    ventanal: reja(4, 1, 1),
  };

  return { figuras, grados, cruces, buscarRecorrido, unTrazo, compararFiguras, revisarTrazo, distancias, cartero, escalera, muesca, chakana, perimetro,
    semicirculos, caminos, enumerarCaminos, cerrarCruce, caminosEspacio, hormiga, combinatorio, fraccion, radical };
});
