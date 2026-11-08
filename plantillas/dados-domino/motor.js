/*
 * Motor de «El dado en la mesa y las fichas del dominó» (razonamiento matemático): caras de un dado, dados apoyados,
 * apilados, en fila o en L sobre una mesa (puntos que se ven y que no se ven), el dado que rueda por casillas o da
 * vueltas a un circuito, un cubo marcado visto desde varias posiciones, las fichas del dominó, lanzamientos de un dado
 * y deducción de puntajes.
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorDados) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 * Todo se resuelve por fuerza bruta: las 24 posiciones de un dado (o las 720 formas de repartir 1 a 6 en las seis
 * caras, para el error de olvidar que las opuestas suman 7), las 28 fichas, los 6^n lanzamientos.
 *
 * Convenciones:
 *   - Caras (y direcciones): 'arriba', 'abajo', 'frente' (la que mira a quien observa), 'atras' (la del fondo),
 *     'derecha' e 'izquierda'. Ejes: x hacia la derecha, y hacia el fondo, z hacia arriba.
 *   - Un dado (una posición de un dado) es un objeto { arriba, abajo, frente, atras, derecha, izquierda } con los
 *     puntos de cada cara. En los dos dados de esta escena las caras opuestas suman 7. El dado normal es el que, con
 *     1 arriba y 2 al frente, tiene el 3 a la derecha. El dado espejo tiene la misma regla del 7 pero es su reflejo:
 *     con 1 arriba y 2 al frente, tiene el 3 a la izquierda. Cada uno tiene 24 posiciones.
 *   - Una vista de esquina es una lista [arriba, frente, derecha]: las tres caras que se ven desde arriba, adelante y
 *     a la derecha.
 *   - Rodar hacia un lado X ('derecha', 'izquierda', 'atras' o 'frente') es volcar el dado sobre su arista de ese lado:
 *     la cara de arriba pasa al lado X, la del lado X va abajo, la de abajo pasa al lado opuesto a X y la del lado
 *     opuesto a X sube. Un camino es un texto con una letra por vuelco: D (a la derecha, x + 1), I (a la izquierda,
 *     x − 1), A (hacia atrás, al fondo, y + 1) y F (hacia el frente, y − 1). El dado empieza en la casilla [0, 0].
 *   - Una disposición son dados de igual tamaño en casillas enteras [x, y, z] (z = 0 apoyado en la mesa; con z > 0
 *     debe haber un dado debajo). Una cara del dado i es: 'mesa' (la de abajo con z = 0), 'dado' (pegada a otro dado),
 *     'pared' (si hay pared de ese lado y el dado está en el borde: 'atras' es y máxima, 'frente' y mínima, 'derecha'
 *     x máxima, 'izquierda' x mínima), 'vista' (libre y su lado está en 'vista') o 'escondida' (libre, pero no se ve
 *     desde donde se mira). 'vista' por defecto es dar la vuelta a la mesa: ['arriba', 'frente', 'atras', 'derecha',
 *     'izquierda']. Visibles = las caras 'vista'; no visibles = todas las demás. Total de puntos = 21 por dado.
 *   - Una ficha del dominó es [a, b] con a ≤ b (0 es la mitad en blanco). El juego «del 0 al m» tiene todas las parejas
 *     una sola vez. Una ficha puesta en una cadena es [izquierda, derecha]; puesta de pie, [arriba, abajo].
 *   - Cada resultado que es la respuesta de una predicción trae 'respuesta', 'errores' (lo que da cada error típico),
 *     'coinciden' (los nombres de los errores que en ese caso dan justo la respuesta: no se ofrecen y no van en
 *     'errores') y 'repetidos' (un error que da lo mismo que otro anterior de la lista: { nombre: el anterior }).
 *     Un error que no se puede calcular (o que no tiene solución) no aparece.
 *
 * Funciones (argumentos entre llaves):
 *   rodar(dado, lado)           el dado tras un vuelco hacia 'lado'.
 *   posiciones(espejo)          las 24 posiciones del dado normal (o del espejo, con espejo = true), en orden fijo.
 *   dado({ arriba, frente, derecha, espejo })   el dado completo. Con derecha, se busca entre los dos dados (el normal y el
 *                               espejo); sin derecha, en el que dice espejo (por defecto el normal).
 *   caminoGiro(desde, hasta)    la lista más corta de lados hacia los que hay que volcar el dado 'desde' para dejarlo
 *                               como 'hasta' (los dos completos o como en dado()); null si uno es el espejo del otro.
 *   quiralidad([arriba, frente, derecha])   'normal', 'espejo' o null (si dos de las tres suman 7 o se repiten: no es una
 *                               vista posible de un dado normal).
 *   mismoDado(vistaA, vistaB)   { a, b (quiralidad de cada vista), iguales (los dos son el mismo dado girado),
 *                               respuesta (= iguales), errores: porElSiete (true: «son el mismo, porque en los dos las
 *                               opuestas suman 7»; solo si no lo son), noSeSabe ('no se puede saber') }.
 *   unDado({ arriba, frente, derecha, pregunta })   un dado normal sobre la mesa. pregunta 'abajo' (por defecto): los
 *                               puntos de la cara que toca la mesa; { respuesta, ocultas (los puntajes que no se ven, si
 *                               se dan frente y derecha), errores: noSeSabe ('no se puede saber'), laMenor (el menor de
 *                               los que no se ven) }. pregunta 'visibles': los puntos que se ven dando la vuelta a la
 *                               mesa; { respuesta, errores: cuentaAbajo (21), restaArriba (21 − arriba), depende ('depende
 *                               del giro') }.
 *   clasificar({ dados, pared, vista })   pared: lista de lados con pared (por defecto ninguna). { caras: [por dado,
 *                               { arriba: clase, … }], contactos: [[i, cara de i, j, cara de j]] (i < j), visibles (cuántas
 *                               caras 'vista' hay), ocultas (cuántas no), total (21 · n) }.
 *   optimizarDados({ dados, pared, vista, fijas, condicion, objetivo, extremo })   fijas: [[i, cara, puntos]] (lo que se
 *                               ve en el dibujo). condicion: { arriba: 'par' | 'impar' (la cara de arriba de cada dado),
 *                               productoArriba (el producto de las caras de arriba), sumaArriba, contacto (cada par de
 *                               caras pegadas entre dados suma eso) }. objetivo: 'visibles' (por defecto), 'noVisibles',
 *                               'mesa' (las caras que tocan la mesa), 'contactos' (las caras pegadas a otro dado) o
 *                               [[i, cara], …] (la suma de esas caras). extremo: 'max' o 'min'. Prueba todas las
 *                               posiciones de cada dado. { respuesta, total, n, ejemplo: [los dados en una posición que
 *                               da la respuesta], clases (las de clasificar), errores: sinSiete (las caras de cada dado
 *                               con 1 a 6 en cualquier orden, sin la regla del 7), contactosVisibles (solo con objetivo
 *                               'visibles' o 'noVisibles': las caras pegadas a otro dado o a la pared contadas como si se
 *                               vieran; la que toca la mesa sigue oculta), alReves (el otro extremo), sinCondicion (sin la condición) }. Error si nada
 *                               cumple.
 *   rodarCamino({ inicio, camino, pregunta, en })   inicio: { arriba, frente, espejo } (o el dado completo). pregunta:
 *                               'arriba' (por defecto: la cara de arriba al llegar), 'visibles' (los puntos que se ven
 *                               al llegar, dando la vuelta: todas menos la de abajo) o 'sumaArriba' (la suma de las caras
 *                               de arriba en las casillas número 'en', contando 0 la de partida). { final (el dado al
 *                               llegar), arribas (la cara de arriba en cada casilla, desde la de partida), casillas
 *                               ([x, y] de cada una), respuesta, errores: alReves (cada vuelco hace subir la cara del lado
 *                               hacia el que rueda), soloArriba (solo se sigue la cara de arriba: los costados se quedan
 *                               como al inicio y cada vuelco sube el costado de atrás de esa foto), y con 'visibles':
 *                               cuentaAbajo (21), restaArriba (21 − la de arriba), alReves }.
 *   rodarDos({ a, b })          a y b: { inicio, camino } de dos dados. { arribaA, arribaB, respuesta (la suma de las dos
 *                               caras de arriba al llegar), errores: alReves, soloArriba (los dos con ese error) }.
 *   circuito({ inicio, vuelta, vueltas })   vuelta: el camino de una vuelta (debe volver a la casilla de partida).
 *                               { periodo (cuántas vueltas hacen falta para que el dado quede como empezó), arribas (la
 *                               cara de arriba tras 0, 1, …, periodo vueltas), respuesta (la cara de arriba tras
 *                               'vueltas' vueltas), errores: unaVuelta (la de arriba al inicio: creer que cada vuelta lo
 *                               deja igual), periodoCuatro (contar el resto entre 4 vueltas en vez del periodo), alReves }.
 *   deducirCubo({ vistas, simbolos, cara, vista })   vistas: [[arriba, frente, derecha], …] del mismo cubo; simbolos: sus
 *                               6 marcas (por defecto, las que aparecen en las vistas, que deben ser 6). Prueba las 720
 *                               formas de marcar el cubo y se queda con las que dan todas las vistas. { cubos (cuántos
 *                               cubos distintos sirven, sin contar giros), opuestas: { marca: [las que pueden estar al
 *                               otro lado] }, y si se pide 'cara': respuesta (la opuesta de esa cara si es una sola; null
 *                               si no se puede saber), errores: siete (7 − cara, como en un dado normal), noJuntas (una
 *                               cara que nunca sale junto a ella en las vistas pero no es la opuesta; la menor) ; si se
 *                               pide 'vista' (un índice): ocultas: { abajo, atras, izquierda } de esa vista (null las que
 *                               no se pueden saber) }.
 *   fichas(max)                 las fichas del juego del 0 al max (max por defecto 6), de [0, 0] a [max, max].
 *   contarFichas({ max, condicion })   condicion: null (todas), 'primo' (la suma de puntos es primo), 'par', 'impar',
 *                               'doble' o un número (la suma es ese número). { fichas (las que cumplen), respuesta (cuántas),
 *                               puntos (la suma de sus puntos), errores: ordenadas ([a, b] y [b, a] contadas como dos),
 *                               sinDobles (sin las fichas dobles), sinBlanco (sin las que tienen una mitad en blanco),
 *                               y erroresPuntos con lo mismo para 'puntos' }.
 *   elegirFichas({ k, razon, extremo, max, sinDobles })   k fichas distintas puestas de pie (sinDobles: ninguna doble);
 *                               razon [p, q]: la suma de las mitades de arriba es a la de las de abajo como p es a q
 *                               (arriba · q = abajo · p). Prueba todas las
 *                               elecciones y las dos formas de poner cada ficha. extremo 'min' (por defecto) o 'max' de
 *                               la suma de todos los puntos. { respuesta, ejemplo: [[arriba, abajo], …], errores: repite
 *                               (se pueden repetir fichas), sinBlanco (sin la mitad en blanco), conDobles (si se pidió
 *                               sinDobles: dejando usar dobles) }.
 *   cadenaDomino({ cadena, total, ficha, extremo, max })   cadena: lista de fichas en fila, [izquierda, derecha] las que
 *                               se ven y null las retiradas; en una cadena las mitades que se tocan tienen los mismos
 *                               puntos y no se repiten fichas. total: la suma de todos los puntos de la cadena. ficha:
 *                               el índice de una ficha retirada. { cadenas (cuántas cadenas posibles), respuesta (el
 *                               extremo de los puntos de esa ficha), ejemplo (una cadena completa que lo da), errores:
 *                               repite (con fichas repetidas), sinEmpalme (cada ficha retirada se elige sin mirar a sus
 *                               vecinas), alReves (el otro extremo) }.
 *   lanzamientos({ n, suma, todos, distintos, pregunta })   n lanzamientos de un dado (resultados en orden). suma:
 *                               'cuadrado', 'cubo', 'primo', 'cuadradoOCubo', un número o una lista de números; todos:
 *                               'par' o 'impar'; distintos: true si no se repite ningún puntaje. pregunta: 'mayor' (el
 *                               mayor puntaje que puede salir en algún lanzamiento), 'menor', 'sumas' (cuántas sumas
 *                               distintas hay) o 'resultados' (cuántos resultados en orden cumplen). { sumas: [las sumas
 *                               posibles], resultados, mayor, menor, respuesta }.
 *   conteoPuntajes({ n, valores, total, iguales, valor })   n lanzamientos que solo dan 'valores'; total: la suma real;
 *                               iguales: [[u, v], …] (u salió tantas veces como v). Prueba todas las cuentas. { maximo
 *                               (n · el mayor valor), deficit (maximo − total), soluciones: [{ valor: veces }],
 *                               respuesta (las veces de 'valor' si es una sola; null si no) }.
 *   deducirPuntajes({ nombres, condiciones, distintos, pregunta })   puntajes de 1 a 6 de los dados 'nombres'.
 *                               condiciones (cada una con un 'id' opcional): { suma: [nombres], igual: [nombres] },
 *                               { suma: [nombres], valor }, { par: nombre }, { impar: nombre }, { primo: nombre },
 *                               { noPrimo: nombre }, { mayor: [a, b] } (a > b), { doble: [a, b] } (a = 2b) o
 *                               { producto: [nombres], valor }. distintos: los puntajes no se repiten (por defecto
 *                               true). pregunta: un nombre o una lista de nombres (la suma). { soluciones: [{ nombre:
 *                               puntos }], unica, valores (si es única), respuesta (si la pregunta tiene una sola
 *                               respuesta), errores: lo que da el primer caso que aparece al tantear (los puntajes
 *                               de menor a mayor, en el orden de 'nombres') si se olvida una regla: conRepetidos (dejando
 *                               repetir puntajes) y sin_<id> por cada condición con id (sin esa condición); casos: { error: ese
 *                               primer caso, con todos los puntajes } }.
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MotorDados = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ---------- Utilidades ----------
  const CARAS = ['arriba', 'abajo', 'frente', 'atras', 'derecha', 'izquierda'];
  const LADOS = ['frente', 'atras', 'derecha', 'izquierda'];
  const OPUESTA = { arriba: 'abajo', abajo: 'arriba', frente: 'atras', atras: 'frente', derecha: 'izquierda', izquierda: 'derecha' };
  const VEC = { arriba: [0, 0, 1], abajo: [0, 0, -1], frente: [0, -1, 0], atras: [0, 1, 0], derecha: [1, 0, 0], izquierda: [-1, 0, 0] };
  const LETRA = { D: 'derecha', I: 'izquierda', A: 'atras', F: 'frente' };
  const VISTA_ALREDEDOR = ['arriba', 'frente', 'atras', 'derecha', 'izquierda'];

  function objeto(o, que) {
    if (!o || typeof o !== 'object' || Array.isArray(o)) throw new Error(`${que} debe ser un objeto con los datos`);
    return o;
  }
  function entero(x, que, min, max) {
    if (typeof x !== 'number' || !Number.isInteger(x)) throw new Error(`${que} debe ser un número entero`);
    if (min !== undefined && x < min) throw new Error(`${que} debe ser al menos ${min}`);
    if (max !== undefined && x > max) throw new Error(`${que} debe ser como mucho ${max}`);
    return x;
  }
  function cara(c, que) {
    if (!CARAS.includes(c)) throw new Error(`${que || 'la cara'} debe ser arriba, abajo, frente, atras, derecha o izquierda`);
    return c;
  }
  const igual = (a, b) => a === b;
  function apartar(errores, correcto) {
    const e = {}, coinciden = [], repetidos = {};
    for (const [k, v] of Object.entries(errores)) {
      if (v === null || v === undefined || (typeof v === 'number' && !Number.isFinite(v))) continue;
      if (igual(v, correcto)) { coinciden.push(k); continue; }
      const antes = Object.keys(e).find(j => igual(e[j], v));
      if (antes) { repetidos[k] = antes; continue; }
      e[k] = v;
    }
    return { errores: e, coinciden, repetidos };
  }
  const copia = d => ({ arriba: d.arriba, abajo: d.abajo, frente: d.frente, atras: d.atras, derecha: d.derecha, izquierda: d.izquierda });
  const clave = d => CARAS.map(c => d[c]).join(',');
  const esPrimo = n => { if (n < 2) return false; for (let k = 2; k * k <= n; k++) if (n % k === 0) return false; return true; };
  const esCuadrado = n => n >= 0 && Math.round(Math.sqrt(n)) ** 2 === n;
  const esCubo = n => n >= 0 && Math.round(Math.cbrt(n)) ** 3 === n;

  // ---------- El dado ----------
  function rodar(d, lado) {
    if (!LADOS.includes(lado)) throw new Error('el dado rueda hacia la derecha, la izquierda, atrás o el frente');
    const n = copia(d), o = OPUESTA[lado];
    n[lado] = d.arriba; n.abajo = d[lado]; n[o] = d.abajo; n.arriba = d[o];
    return n;
  }
  // Las 24 posiciones salen de la de partida volcándola hacia los cuatro lados (recorrido en anchura, orden fijo).
  function generar(base) {
    const vistos = new Map([[clave(base), base]]), cola = [base];
    while (cola.length) {
      const d = cola.shift();
      for (const l of LADOS) { const n = rodar(d, l), k = clave(n); if (!vistos.has(k)) { vistos.set(k, n); cola.push(n); } }
    }
    return [...vistos.values()];
  }
  const BASE_NORMAL = { arriba: 1, abajo: 6, frente: 2, atras: 5, derecha: 3, izquierda: 4 };
  const BASE_ESPEJO = { arriba: 1, abajo: 6, frente: 2, atras: 5, derecha: 4, izquierda: 3 };
  const POS_NORMAL = generar(BASE_NORMAL), POS_ESPEJO = generar(BASE_ESPEJO);
  // Los 24 giros como permutaciones de las caras: GIROS[g][c] = la cara de la posición inicial que queda en c.
  const GIROS = generar({ arriba: 'arriba', abajo: 'abajo', frente: 'frente', atras: 'atras', derecha: 'derecha', izquierda: 'izquierda' });
  const girarCon = (L, g) => { const n = {}; for (const c of CARAS) n[c] = L[g[c]]; return n; };

  const posiciones = espejo => (espejo ? POS_ESPEJO : POS_NORMAL).map(copia);
  function dado(o) {
    objeto(o, 'el dado');
    if (CARAS.every(c => typeof o[c] === 'number')) {
      const k = clave(o);
      if (![...POS_NORMAL, ...POS_ESPEJO].some(d => clave(d) === k)) throw new Error('ese no es un dado: las caras opuestas deben sumar 7');
      return copia(o);
    }
    entero(o.arriba, 'arriba', 1, 6); entero(o.frente, 'frente', 1, 6);
    if (o.derecha !== undefined) {
      entero(o.derecha, 'derecha', 1, 6);
      const d = [...POS_NORMAL, ...POS_ESPEJO].find(p => p.arriba === o.arriba && p.frente === o.frente && p.derecha === o.derecha);
      if (!d) throw new Error('esas tres caras no pueden verse juntas en un dado');
      return copia(d);
    }
    const d = (o.espejo ? POS_ESPEJO : POS_NORMAL).find(p => p.arriba === o.arriba && p.frente === o.frente);
    if (!d) throw new Error('la cara de arriba y la del frente no pueden ser opuestas ni iguales');
    return copia(d);
  }
  function quiralidad(v) {
    if (!Array.isArray(v) || v.length !== 3) throw new Error('una vista es [arriba, frente, derecha]');
    const [a, f, r] = v;
    if (POS_NORMAL.some(p => p.arriba === a && p.frente === f && p.derecha === r)) return 'normal';
    if (POS_ESPEJO.some(p => p.arriba === a && p.frente === f && p.derecha === r)) return 'espejo';
    return null;
  }
  function mismoDado(a, b) {
    const qa = quiralidad(a), qb = quiralidad(b), iguales = qa !== null && qa === qb;
    // errores: «son el mismo porque en los dos las opuestas suman 7» (solo si no lo son) y «no se puede saber»
    return Object.assign({ a: qa, b: qb, iguales, respuesta: iguales }, apartar({ porElSiete: iguales ? null : true, noSeSabe: 'no se puede saber' }, iguales));
  }
  function unDado(o) {
    objeto(o, 'los datos');
    const a = entero(o.arriba, 'arriba', 1, 6), pregunta = o.pregunta || 'abajo';
    if (pregunta === 'abajo') {
      const vistas = [a].concat(o.frente !== undefined ? [o.frente] : [], o.derecha !== undefined ? [o.derecha] : []);
      if (o.frente !== undefined && o.derecha !== undefined) dado({ arriba: a, frente: o.frente, derecha: o.derecha });
      const ocultas = [1, 2, 3, 4, 5, 6].filter(x => !vistas.includes(x));
      const respuesta = 7 - a;
      return Object.assign({ respuesta, ocultas }, apartar({ noSeSabe: 'no se puede saber', laMenor: vistas.length === 3 ? Math.min(...ocultas) : null }, respuesta));
    }
    if (pregunta === 'visibles') {
      const respuesta = 21 - (7 - a);
      return Object.assign({ respuesta }, apartar({ cuentaAbajo: 21, restaArriba: 21 - a, depende: 'depende del giro' }, respuesta));
    }
    throw new Error("pregunta debe ser 'abajo' o 'visibles'");
  }

  // El camino más corto de vuelcos (en el sitio) que lleva un dado de una posición a otra del mismo dado.
  function caminoGiro(desde, hasta) {
    const a = dado(desde), b = dado(hasta), meta = clave(b);
    const vistos = new Map([[clave(a), []]]), cola = [a];
    while (cola.length) {
      const d = cola.shift(), cam = vistos.get(clave(d));
      if (clave(d) === meta) return cam;
      for (const l of LADOS) { const n = rodar(d, l), k = clave(n); if (!vistos.has(k)) { vistos.set(k, cam.concat([l])); cola.push(n); } }
    }
    return null;
  }

  // ---------- Disposiciones sobre la mesa ----------
  function leerDisposicion(o) {
    objeto(o, 'la disposición');
    if (!Array.isArray(o.dados) || !o.dados.length) throw new Error('dados debe ser una lista de casillas [x, y, z]');
    if (o.dados.length > 6) throw new Error('como mucho 6 dados');
    const pos = o.dados.map((p, i) => {
      if (!Array.isArray(p) || p.length !== 3) throw new Error(`el dado ${i} debe ser [x, y, z]`);
      p.forEach((x, k) => entero(x, `dados[${i}][${k}]`, k === 2 ? 0 : undefined));
      return p;
    });
    const k = new Map(pos.map((p, i) => [p.join(','), i]));
    if (k.size !== pos.length) throw new Error('dos dados en la misma casilla');
    pos.forEach((p, i) => { if (p[2] > 0 && !k.has([p[0], p[1], p[2] - 1].join(','))) throw new Error(`el dado ${i} está en el aire`); });
    const pared = o.pared || [];
    if (!Array.isArray(pared)) throw new Error('pared debe ser una lista de lados');
    pared.forEach(l => { if (!LADOS.includes(l)) throw new Error('la pared va atras, frente, derecha o izquierda'); });
    const vista = o.vista || VISTA_ALREDEDOR;
    if (!Array.isArray(vista)) throw new Error('vista debe ser una lista de caras');
    vista.forEach(c => cara(c, 'cada lado de la vista'));
    return { pos, idx: k, pared, vista };
  }
  function clasificar(o) {
    const { pos, idx, pared, vista } = leerDisposicion(o);
    const xs = pos.map(p => p[0]), ys = pos.map(p => p[1]);
    const borde = { atras: Math.max(...ys), frente: Math.min(...ys), derecha: Math.max(...xs), izquierda: Math.min(...xs) };
    const enBorde = (p, l) => (l === 'atras' || l === 'frente' ? p[1] : p[0]) === borde[l];
    const caras = [], contactos = [];
    let visibles = 0;
    pos.forEach((p, i) => {
      const C = {};
      for (const c of CARAS) {
        const v = VEC[c], q = [p[0] + v[0], p[1] + v[1], p[2] + v[2]].join(',');
        if (c === 'abajo' && p[2] === 0) C[c] = 'mesa';
        else if (idx.has(q)) { C[c] = 'dado'; const j = idx.get(q); if (i < j) contactos.push([i, c, j, OPUESTA[c]]); }
        else if (pared.includes(c) && enBorde(p, c)) C[c] = 'pared';
        else if (vista.includes(c)) C[c] = 'vista';
        else C[c] = 'escondida';
        if (C[c] === 'vista') visibles++;
      }
      caras.push(C);
    });
    return { caras, contactos, visibles, ocultas: 6 * pos.length - visibles, total: 21 * pos.length };
  }

  // Las 720 formas de poner 1 a 6 en las caras (para el error de olvidar la regla del 7).
  const LIBRES = (() => {
    const out = [], usado = new Array(7).fill(false), d = {};
    (function rec(k) {
      if (k === 6) { out.push(copia(d)); return; }
      for (let v = 1; v <= 6; v++) if (!usado[v]) { usado[v] = true; d[CARAS[k]] = v; rec(k + 1); usado[v] = false; }
    })(0);
    return out;
  })();

  function resolverDados(D, o, opciones) {
    const { clases, libres, sinCondicion, contactosVisibles, extremo } = opciones;
    const n = clases.caras.length, cond = sinCondicion ? {} : (o.condicion || {});
    const fijas = o.fijas || [];
    const objetivo = o.objetivo || 'visibles';
    const cl = clases.caras.map(C => {
      const c2 = Object.assign({}, C);
      if (contactosVisibles) for (const c of CARAS) if (C[c] === 'dado' || C[c] === 'pared') c2[c] = 'vista';
      return c2;
    });
    const aporta = (i, d) => {
      if (Array.isArray(objetivo)) return objetivo.reduce((s, [j, c]) => s + (j === i ? d[c] : 0), 0);
      let s = 0;
      for (const c of CARAS) {
        const k = cl[i][c];
        if (objetivo === 'visibles' && k === 'vista') s += d[c];
        else if (objetivo === 'noVisibles' && k !== 'vista') s += d[c];
        else if (objetivo === 'mesa' && k === 'mesa') s += d[c];
        else if (objetivo === 'contactos' && k === 'dado') s += d[c];
      }
      return s;
    };
    const misContactos = i => clases.contactos.filter(t => t[0] === i || t[2] === i);
    const acoplado = cond.productoArriba !== undefined || cond.sumaArriba !== undefined || cond.contacto !== undefined;
    // por dado: las posiciones que respetan lo fijo y la paridad, agrupadas por lo que importa
    const cands = [];
    for (let i = 0; i < n; i++) {
      const lista = libres ? LIBRES : POS_NORMAL, firmas = new Map();
      for (const d of lista) {
        if (fijas.some(([j, c, v]) => j === i && d[c] !== v)) continue;
        if (cond.arriba === 'par' && d.arriba % 2) continue;
        if (cond.arriba === 'impar' && !(d.arriba % 2)) continue;
        const a = aporta(i, d), ct = misContactos(i).map(t => (t[0] === i ? d[t[1]] : d[t[3]]));
        const f = acoplado ? [a, d.arriba].concat(ct).join(',') : String(a);
        if (!firmas.has(f)) firmas.set(f, { a, d, ct });
      }
      if (!firmas.size) return null;
      cands.push([...firmas.values()]);
    }
    const mejor = (x, y) => (extremo === 'max' ? x > y : x < y);
    if (!acoplado) {
      let s = 0; const ej = [];
      for (const L of cands) { let b = L[0]; for (const c of L) if (mejor(c.a, b.a)) b = c; s += b.a; ej.push(b.d); }
      return { respuesta: s, ejemplo: ej };
    }
    let best = null, ej = null;
    const elegido = [];
    const P = cond.productoArriba;
    (function rec(i, suma, prod, sumA) {
      if (i === n) {
        if (P !== undefined && prod !== P) return;
        if (cond.sumaArriba !== undefined && sumA !== cond.sumaArriba) return;
        if (best === null || mejor(suma, best)) { best = suma; ej = elegido.map(c => c.d); }
        return;
      }
      for (const c of cands[i]) {
        const p2 = prod * c.d.arriba;
        if (P !== undefined && P % p2 !== 0) continue;
        if (cond.sumaArriba !== undefined && sumA + c.d.arriba > cond.sumaArriba) continue;
        if (cond.contacto !== undefined) {
          let ok = true;
          for (const t of clases.contactos) {
            if (t[2] !== i) continue;          // el contacto con un dado anterior se revisa al llegar al segundo
            const otro = elegido[t[0]];
            if (otro.d[t[1]] + c.d[t[3]] !== cond.contacto) { ok = false; break; }
          }
          if (!ok) continue;
        }
        elegido.push(c); rec(i + 1, suma + c.a, p2, sumA + c.d.arriba); elegido.pop();
      }
    })(0, 0, 1, 0);
    return best === null ? null : { respuesta: best, ejemplo: ej };
  }
  function optimizarDados(o) {
    const D = leerDisposicion(o), clases = clasificar(o);
    const extremo = o.extremo || 'max';
    if (extremo !== 'max' && extremo !== 'min') throw new Error("extremo debe ser 'max' o 'min'");
    const objetivo = o.objetivo || 'visibles';
    if (!Array.isArray(objetivo) && !['visibles', 'noVisibles', 'mesa', 'contactos'].includes(objetivo)) throw new Error('objetivo desconocido');
    if (Array.isArray(objetivo)) objetivo.forEach(([i, c]) => { entero(i, 'el dado del objetivo', 0, D.pos.length - 1); cara(c); });
    (o.fijas || []).forEach(([i, c, v]) => { entero(i, 'el dado de una cara fija', 0, D.pos.length - 1); cara(c); entero(v, 'los puntos de una cara fija', 1, 6); });
    const cond = o.condicion || {};
    for (const k of Object.keys(cond)) if (!['arriba', 'productoArriba', 'sumaArriba', 'contacto'].includes(k)) throw new Error(`condición desconocida: ${k}`);
    const base = { clases, extremo };
    const R = resolverDados(D, o, base);
    if (!R) throw new Error('ninguna posición de los dados cumple las condiciones');
    const otro = extremo === 'max' ? 'min' : 'max';
    const val = r => (r ? r.respuesta : null);
    const err = {
      sinSiete: val(resolverDados(D, o, Object.assign({}, base, { libres: true }))),
      contactosVisibles: objetivo === 'visibles' || objetivo === 'noVisibles' ? val(resolverDados(D, o, Object.assign({}, base, { contactosVisibles: true }))) : null,
      alReves: val(resolverDados(D, o, Object.assign({}, base, { extremo: otro }))),
      sinCondicion: Object.keys(cond).length ? val(resolverDados(D, o, Object.assign({}, base, { sinCondicion: true }))) : null,
    };
    if (err.contactosVisibles !== null && clases.caras.every(C => !CARAS.some(c => C[c] === 'dado' || C[c] === 'pared'))) err.contactosVisibles = null;
    return Object.assign({ respuesta: R.respuesta, total: clases.total, n: D.pos.length, ejemplo: R.ejemplo.map(copia), clases: clases.caras }, apartar(err, R.respuesta));
  }

  // ---------- El dado que rueda ----------
  function leerInicio(o) {
    objeto(o, 'el inicio');
    return dado(o);
  }
  function leerCamino(c) {
    if (typeof c !== 'string') throw new Error('el camino es un texto con las letras D, I, A y F');
    for (const ch of c) if (!LETRA[ch]) throw new Error(`letra de camino desconocida: ${ch}`);
    return [...c].map(ch => LETRA[ch]);
  }
  function seguir(d, lados, modo) {
    const arribas = [d.arriba];
    let x = d;
    const foto = copia(d);              // para soloArriba: los costados que el alumno cree que no cambian
    let a = d.arriba;
    for (const l of lados) {
      if (modo === 'alReves') x = rodar(x, OPUESTA[l]);
      else if (modo === 'soloArriba') { a = foto[OPUESTA[l]]; x = Object.assign(copia(x), { arriba: a, abajo: 7 - a }); }
      else x = rodar(x, l);
      arribas.push(x.arriba);
    }
    return { final: x, arribas };
  }
  function rodarCamino(o) {
    objeto(o, 'los datos');
    const d = leerInicio(o.inicio), lados = leerCamino(o.camino);
    const pregunta = o.pregunta || 'arriba';
    const S = seguir(d, lados), R = seguir(d, lados, 'alReves'), Q = seguir(d, lados, 'soloArriba');
    const casillas = [[0, 0]];
    for (const l of lados) { const [x, y] = casillas[casillas.length - 1], v = VEC[l]; casillas.push([x + v[0], y + v[1]]); }
    let respuesta, err;
    if (pregunta === 'arriba') { respuesta = S.final.arriba; err = { alReves: R.final.arriba, soloArriba: Q.final.arriba }; }
    else if (pregunta === 'visibles') { respuesta = 21 - S.final.abajo; err = { cuentaAbajo: 21, restaArriba: 21 - S.final.arriba, alReves: 21 - R.final.abajo }; }
    else if (pregunta === 'sumaArriba') {
      if (!Array.isArray(o.en) || !o.en.length) throw new Error('en: la lista de casillas');
      o.en.forEach(k => entero(k, 'cada casilla de en', 0, lados.length));
      const suma = A => o.en.reduce((s, k) => s + A[k], 0);
      respuesta = suma(S.arribas); err = { alReves: suma(R.arribas), soloArriba: suma(Q.arribas) };
    } else throw new Error("pregunta debe ser 'arriba', 'visibles' o 'sumaArriba'");
    return Object.assign({ final: S.final, arribas: S.arribas, casillas, respuesta }, apartar(err, respuesta));
  }
  function rodarDos(o) {
    objeto(o, 'los datos');
    const A = rodarCamino(objeto(o.a, 'el dado a')), B = rodarCamino(objeto(o.b, 'el dado b'));
    const da = leerInicio(o.a.inicio), db = leerInicio(o.b.inicio), la = leerCamino(o.a.camino), lb = leerCamino(o.b.camino);
    const respuesta = A.respuesta + B.respuesta;
    const err = {
      alReves: seguir(da, la, 'alReves').final.arriba + seguir(db, lb, 'alReves').final.arriba,
      soloArriba: seguir(da, la, 'soloArriba').final.arriba + seguir(db, lb, 'soloArriba').final.arriba,
    };
    return Object.assign({ arribaA: A.respuesta, arribaB: B.respuesta, respuesta }, apartar(err, respuesta));
  }
  function circuito(o) {
    objeto(o, 'los datos');
    const d = leerInicio(o.inicio), lados = leerCamino(o.vuelta);
    let x = 0, y = 0;
    for (const l of lados) { x += VEC[l][0]; y += VEC[l][1]; }
    if (x || y) throw new Error('la vuelta debe terminar en la casilla de partida');
    const N = entero(o.vueltas, 'vueltas', 0);
    const tras = (modo, k) => { let z = d; for (let j = 0; j < k; j++) z = seguir(z, lados, modo).final; return z; };
    const arribas = [d.arriba];
    let z = d, periodo = 0;
    do { z = seguir(z, lados).final; periodo++; arribas.push(z.arriba); } while (clave(z) !== clave(d));
    const respuesta = arribas[N % periodo];
    const err = { unaVuelta: d.arriba, periodoCuatro: tras(undefined, N % 4).arriba, alReves: tras('alReves', N).arriba };
    return Object.assign({ periodo, arribas, respuesta }, apartar(err, respuesta));
  }

  // ---------- Un cubo visto desde varias posiciones ----------
  function deducirCubo(o) {
    objeto(o, 'los datos');
    if (!Array.isArray(o.vistas) || !o.vistas.length) throw new Error('vistas: lista de [arriba, frente, derecha]');
    o.vistas.forEach((v, k) => { if (!Array.isArray(v) || v.length !== 3 || new Set(v).size !== 3) throw new Error(`la vista ${k} debe tener tres marcas distintas`); });
    const sim = o.simbolos || [...new Set(o.vistas.flat())];
    if (sim.length !== 6 || new Set(sim).size !== 6) throw new Error('el cubo tiene 6 marcas distintas');
    o.vistas.flat().forEach(s => { if (!sim.includes(s)) throw new Error(`la marca ${s} no está en el cubo`); });
    const cubos = new Map();
    const marcas = {};
    (function rec(k, usado) {
      if (k === 6) {
        const L = Object.assign({}, marcas);
        const giros = GIROS.map(g => girarCon(L, g));
        const sirve = o.vistas.every(v => giros.some(G => G.arriba === v[0] && G.frente === v[1] && G.derecha === v[2]));
        if (!sirve) return;
        const canon = giros.map(G => CARAS.map(c => G[c]).join('|')).sort()[0];
        if (!cubos.has(canon)) cubos.set(canon, L);
        return;
      }
      for (let i = 0; i < 6; i++) if (!usado[i]) { usado[i] = true; marcas[CARAS[k]] = sim[i]; rec(k + 1, usado); usado[i] = false; }
    })(0, []);
    const lista = [...cubos.values()];
    const opuestas = {};
    for (const s of sim) opuestas[s] = [...new Set(lista.map(L => L[OPUESTA[CARAS.find(c => L[c] === s)]]))].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    const out = { cubos: lista.length, opuestas };
    if (o.cara !== undefined) {
      if (!sim.includes(o.cara)) throw new Error('esa cara no está en el cubo');
      const op = opuestas[o.cara], respuesta = op.length === 1 ? op[0] : null;
      const juntas = new Set();
      for (const v of o.vistas) if (v.includes(o.cara)) v.forEach(s => juntas.add(s));
      const nunca = sim.filter(s => s !== o.cara && !juntas.has(s) && !op.includes(s)).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
      const err = { siete: typeof o.cara === 'number' && o.cara >= 1 && o.cara <= 6 && sim.includes(7 - o.cara) ? 7 - o.cara : null, noJuntas: nunca.length ? nunca[0] : null };
      Object.assign(out, { respuesta }, apartar(err, respuesta));
    }
    if (o.vista !== undefined) {
      const v = o.vistas[entero(o.vista, 'vista', 0, o.vistas.length - 1)];
      const oc = { abajo: new Set(), atras: new Set(), izquierda: new Set() };
      for (const L of lista) for (const g of GIROS) {
        const G = girarCon(L, g);
        if (G.arriba === v[0] && G.frente === v[1] && G.derecha === v[2]) for (const c of Object.keys(oc)) oc[c].add(G[c]);
      }
      out.ocultas = {};
      for (const c of Object.keys(oc)) out.ocultas[c] = oc[c].size === 1 ? [...oc[c]][0] : null;
    }
    return out;
  }

  // ---------- Dominó ----------
  function fichas(max) {
    const m = max === undefined ? 6 : entero(max, 'max', 1, 12);
    const out = [];
    for (let a = 0; a <= m; a++) for (let b = a; b <= m; b++) out.push([a, b]);
    return out;
  }
  function cumpleFicha(cond, a, b) {
    const s = a + b;
    if (cond === null || cond === undefined) return true;
    if (cond === 'primo') return esPrimo(s);
    if (cond === 'par') return s % 2 === 0;
    if (cond === 'impar') return s % 2 === 1;
    if (cond === 'doble') return a === b;
    if (typeof cond === 'number') return s === cond;
    throw new Error('condición de ficha desconocida');
  }
  function contarFichas(o) {
    o = o || {};
    const m = o.max === undefined ? 6 : entero(o.max, 'max', 1, 12), cond = o.condicion === undefined ? null : o.condicion;
    const F = fichas(m).filter(([a, b]) => cumpleFicha(cond, a, b));
    const pts = L => L.reduce((s, [a, b]) => s + a + b, 0);
    const ord = [];
    for (let a = 0; a <= m; a++) for (let b = 0; b <= m; b++) if (cumpleFicha(cond, a, b)) ord.push([a, b]);
    const sinD = F.filter(([a, b]) => a !== b), sinB = F.filter(([a]) => a !== 0);
    const respuesta = F.length, puntos = pts(F);
    const e1 = apartar({ ordenadas: ord.length, sinDobles: sinD.length, sinBlanco: sinB.length }, respuesta);
    const e2 = apartar({ ordenadas: pts(ord), sinDobles: pts(sinD), sinBlanco: pts(sinB) }, puntos);
    return Object.assign({ fichas: F, respuesta, puntos }, e1, { erroresPuntos: e2.errores });
  }
  function elegirFichasCon(o, repite, sinBlanco, conDobles) {
    const k = o.k, [p, q] = o.razon, extremo = o.extremo || 'min';
    let F = fichas(o.max);
    if (sinBlanco) F = F.filter(([a]) => a !== 0);
    if (o.sinDobles && !conDobles) F = F.filter(([a, b]) => a !== b);
    let best = null, ej = null;
    const elegidas = [];
    (function rec(desde, arriba, abajo) {
      if (elegidas.length === k) {
        if (arriba * q !== abajo * p) return;
        const t = arriba + abajo;
        if (best === null || (extremo === 'min' ? t < best : t > best)) { best = t; ej = elegidas.map(x => x.slice()); }
        return;
      }
      for (let i = desde; i < F.length; i++) {
        const [a, b] = F[i], formas = a === b ? [[a, b]] : [[a, b], [b, a]];
        for (const f of formas) { elegidas.push(f); rec(repite ? i : i + 1, arriba + f[0], abajo + f[1]); elegidas.pop(); }
      }
    })(0, 0, 0);
    return best === null ? null : { respuesta: best, ejemplo: ej };
  }
  function elegirFichas(o) {
    objeto(o, 'los datos');
    entero(o.k, 'k', 1, 5);
    if (!Array.isArray(o.razon) || o.razon.length !== 2) throw new Error('razon: [p, q]');
    o.razon.forEach(x => entero(x, 'la razón', 0));
    if (o.extremo && o.extremo !== 'min' && o.extremo !== 'max') throw new Error("extremo debe ser 'min' o 'max'");
    const R = elegirFichasCon(o, false, false);
    if (!R) throw new Error('no hay fichas que cumplan');
    const v = r => (r ? r.respuesta : null);
    return Object.assign({ respuesta: R.respuesta, ejemplo: R.ejemplo }, apartar({ repite: v(elegirFichasCon(o, true, false)), sinBlanco: v(elegirFichasCon(o, false, true)), conDobles: o.sinDobles ? v(elegirFichasCon(o, false, false, true)) : null }, R.respuesta));
  }
  function cadenaCon(o, modo) {
    const C = o.cadena, m = C.length, M = o.max === undefined ? 6 : o.max, extremo = o.extremo || 'min';
    const claveF = (a, b) => (a <= b ? a + ',' + b : b + ',' + a);
    let best = null, ej = null, cuantas = 0;
    if (modo === 'sinEmpalme') {
      // cada ficha retirada es cualquier ficha que no esté a la vista ni se repita; no se mira a las vecinas
      const vistas = C.filter(Boolean), usadas = new Set(vistas.map(([a, b]) => claveF(a, b)));
      const huecos = C.map((f, i) => (f ? -1 : i)).filter(i => i >= 0);
      const F = fichas(M).filter(([a, b]) => !usadas.has(claveF(a, b)));
      const fijo = vistas.reduce((s, [a, b]) => s + a + b, 0);
      const elegidas = [];
      (function rec(j, desde, s) {
        if (j === huecos.length) {
          if (s !== o.total) return;
          const t = elegidas[huecos.indexOf(o.ficha)];
          const v = t[0] + t[1];
          if (best === null || (extremo === 'min' ? v < best : v > best)) best = v;
          return;
        }
        for (let i = 0; i < F.length; i++) {
          if (elegidas.includes(F[i])) continue;
          elegidas.push(F[i]); rec(j + 1, 0, s + F[i][0] + F[i][1]); elegidas.pop();
        }
      })(0, 0, fijo);
      return best === null ? null : { respuesta: best };
    }
    // las mitades v0 … vm: la ficha i es [v_i, v_(i+1)]
    const v = new Array(m + 1).fill(null);
    for (let i = 0; i < m; i++) if (C[i]) {
      for (const [k, x] of [[i, C[i][0]], [i + 1, C[i][1]]]) {
        if (v[k] !== null && v[k] !== x) throw new Error(`las fichas ${k - 1} y ${k} no empalman`);
        v[k] = x;
      }
    }
    const w = v.slice();
    (function rec(k) {
      if (k === m + 1) {
        let s = 0; const vistas = new Set();
        for (let i = 0; i < m; i++) {
          s += w[i] + w[i + 1];
          const c = claveF(w[i], w[i + 1]);
          if (modo !== 'repite') { if (vistas.has(c)) return; vistas.add(c); }
        }
        if (s !== o.total) return;
        cuantas++;
        const t = w[o.ficha] + w[o.ficha + 1];
        if (best === null || (extremo === 'min' ? t < best : t > best)) { best = t; ej = Array.from({ length: m }, (_, i) => [w[i], w[i + 1]]); }
        return;
      }
      if (v[k] !== null) { rec(k + 1); return; }
      for (let x = 0; x <= M; x++) { w[k] = x; rec(k + 1); }
      w[k] = null;
    })(0);
    return best === null ? null : { respuesta: best, ejemplo: ej, cadenas: cuantas };
  }
  function cadenaDomino(o) {
    objeto(o, 'los datos');
    if (!Array.isArray(o.cadena) || o.cadena.length < 2 || o.cadena.length > 8) throw new Error('cadena: de 2 a 8 fichas');
    const M = o.max === undefined ? 6 : entero(o.max, 'max', 1, 12);
    o.cadena.forEach((f, i) => { if (f !== null) { if (!Array.isArray(f) || f.length !== 2) throw new Error(`la ficha ${i} debe ser [izquierda, derecha] o null`); f.forEach(x => entero(x, 'una mitad', 0, M)); } });
    entero(o.total, 'total', 0);
    entero(o.ficha, 'ficha', 0, o.cadena.length - 1);
    if (o.cadena[o.ficha] !== null) throw new Error('la ficha preguntada debe ser una retirada');
    const R = cadenaCon(o);
    if (!R) throw new Error('ninguna cadena cumple');
    const v = r => (r ? r.respuesta : null);
    const otro = Object.assign({}, o, { extremo: (o.extremo || 'min') === 'min' ? 'max' : 'min' });
    return Object.assign({ cadenas: R.cadenas, respuesta: R.respuesta, ejemplo: R.ejemplo }, apartar({ repite: v(cadenaCon(o, 'repite')), sinEmpalme: v(cadenaCon(o, 'sinEmpalme')), alReves: v(cadenaCon(otro)) }, R.respuesta));
  }

  // ---------- Lanzamientos ----------
  function cumpleSuma(c, s) {
    if (c === undefined || c === null) return true;
    if (c === 'cuadrado') return esCuadrado(s);
    if (c === 'cubo') return esCubo(s);
    if (c === 'cuadradoOCubo') return esCuadrado(s) || esCubo(s);
    if (c === 'primo') return esPrimo(s);
    if (typeof c === 'number') return s === c;
    if (Array.isArray(c)) return c.includes(s);
    throw new Error('condición de suma desconocida');
  }
  function lanzamientos(o) {
    objeto(o, 'los datos');
    const n = entero(o.n, 'n', 1, 7);
    if (o.todos && o.todos !== 'par' && o.todos !== 'impar') throw new Error("todos debe ser 'par' o 'impar'");
    const sumas = new Set();
    let resultados = 0, mayor = null, menor = null;
    const t = new Array(n).fill(1);
    for (;;) {
      const s = t.reduce((a, b) => a + b, 0);
      const ok = cumpleSuma(o.suma, s) && (!o.todos || t.every(x => (x % 2 === 0) === (o.todos === 'par'))) && (!o.distintos || new Set(t).size === n);
      if (ok) {
        resultados++; sumas.add(s);
        const mx = Math.max(...t), mn = Math.min(...t);
        if (mayor === null || mx > mayor) mayor = mx;
        if (menor === null || mn < menor) menor = mn;
      }
      let k = 0; while (k < n && t[k] === 6) { t[k] = 1; k++; }
      if (k === n) break; t[k]++;
    }
    const S = [...sumas].sort((a, b) => a - b);
    const pregunta = o.pregunta || 'sumas';
    const respuesta = pregunta === 'mayor' ? mayor : pregunta === 'menor' ? menor : pregunta === 'sumas' ? S.length : pregunta === 'resultados' ? resultados : undefined;
    if (respuesta === undefined) throw new Error("pregunta debe ser 'mayor', 'menor', 'sumas' o 'resultados'");
    return { sumas: S, resultados, mayor, menor, respuesta };
  }
  function conteoPuntajes(o) {
    objeto(o, 'los datos');
    const n = entero(o.n, 'n', 1, 60), V = o.valores;
    if (!Array.isArray(V) || V.length < 2 || V.length > 4) throw new Error('valores: de 2 a 4 puntajes');
    V.forEach(x => entero(x, 'cada valor', 1, 6));
    entero(o.total, 'total', 0);
    const iguales = o.iguales || [];
    const sol = [], c = new Array(V.length).fill(0);
    (function rec(i, resto) {
      if (i === V.length - 1) {
        c[i] = resto;
        const s = c.reduce((a, x, k) => a + x * V[k], 0);
        if (s !== o.total) return;
        const veces = {}; V.forEach((x, k) => { veces[x] = c[k]; });
        if (iguales.every(([u, w]) => veces[u] === veces[w])) sol.push(veces);
        return;
      }
      for (let x = 0; x <= resto; x++) { c[i] = x; rec(i + 1, resto - x); }
    })(0, n);
    const maximo = n * Math.max(...V);
    const out = { maximo, deficit: maximo - o.total, soluciones: sol };
    if (o.valor !== undefined) { const r = [...new Set(sol.map(s => s[o.valor]))]; out.respuesta = r.length === 1 ? r[0] : null; }
    return out;
  }
  function cumpleCondicion(c, v) {
    const s = L => L.reduce((a, x) => a + v[x], 0);
    if (c.suma && c.igual) return s(c.suma) === s(c.igual);
    if (c.suma && c.valor !== undefined) return s(c.suma) === c.valor;
    if (c.producto) return c.producto.reduce((a, x) => a * v[x], 1) === c.valor;
    if (c.par) return v[c.par] % 2 === 0;
    if (c.impar) return v[c.impar] % 2 === 1;
    if (c.primo) return esPrimo(v[c.primo]);
    if (c.noPrimo) return !esPrimo(v[c.noPrimo]);
    if (c.mayor) return v[c.mayor[0]] > v[c.mayor[1]];
    if (c.doble) return v[c.doble[0]] === 2 * v[c.doble[1]];
    throw new Error('condición desconocida');
  }
  function deducirCon(nom, conds, distintos) {
    const sol = [], v = {};
    (function rec(i) {
      if (i === nom.length) { if (conds.every(c => cumpleCondicion(c, v))) sol.push(Object.assign({}, v)); return; }
      for (let x = 1; x <= 6; x++) {
        if (distintos && nom.slice(0, i).some(m => v[m] === x)) continue;
        v[nom[i]] = x; rec(i + 1);
      }
      delete v[nom[i]];
    })(0);
    return sol;
  }
  function deducirPuntajes(o) {
    objeto(o, 'los datos');
    const nom = o.nombres;
    if (!Array.isArray(nom) || nom.length < 1 || nom.length > 6 || new Set(nom).size !== nom.length) throw new Error('nombres: de 1 a 6 nombres distintos');
    const conds = o.condiciones || [];
    const nombresDe = c => [].concat(c.suma || [], c.igual || [], c.producto || [], c.mayor || [], c.doble || [], c.par || [], c.impar || [], c.primo || [], c.noPrimo || []);
    conds.forEach(c => nombresDe(c).forEach(x => { if (!nom.includes(x)) throw new Error(`${x} no es uno de los dados`); }));
    const distintos = o.distintos !== false;
    const sol = deducirCon(nom, conds, distintos);
    const out = { soluciones: sol, unica: sol.length === 1 };
    if (sol.length === 1) out.valores = sol[0];
    if (o.pregunta !== undefined) {
      const P = [].concat(o.pregunta);
      P.forEach(x => { if (!nom.includes(x)) throw new Error(`${x} no es uno de los dados`); });
      const resp = L => { const r = [...new Set(L.map(s => P.reduce((a, x) => a + s[x], 0)))]; return r.length === 1 ? r[0] : null; };
      out.respuesta = resp(sol);
      // el error es quedarse con el primer caso que aparece al tantear (de menor a mayor) sin una de las reglas
      const primero = L => (L.length ? P.reduce((a, x) => a + L[0][x], 0) : null);
      const err = { conRepetidos: distintos ? primero(deducirCon(nom, conds, false)) : null };
      conds.forEach((c, k) => { if (c.id) err['sin_' + c.id] = primero(deducirCon(nom, conds.filter((_, j) => j !== k), distintos)); });
      Object.assign(out, apartar(err, out.respuesta));
      out.casos = {};
      const caso = L => (L.length ? L[0] : null);
      for (const k of Object.keys(out.errores)) out.casos[k] = k === 'conRepetidos' ? caso(deducirCon(nom, conds, false)) : caso(deducirCon(nom, conds.filter(c => 'sin_' + c.id !== k), distintos));
    }
    return out;
  }

  return {
    CARAS, LADOS, OPUESTA, VEC, rodar, posiciones, dado, caminoGiro, quiralidad, mismoDado, unDado, clasificar, optimizarDados,
    rodarCamino, rodarDos, circuito, deducirCubo, fichas, contarFichas, elegirFichas, cadenaDomino,
    lanzamientos, conteoPuntajes, deducirPuntajes, esPrimo,
  };
});
