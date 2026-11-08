/*
 * Motor de «La hormiga en el alambre» (razonamiento matemático): rutas por estructuras de alambre en el espacio
 * (cubos pegados, pirámide, tronco de pirámide) y en redes planas (hexágono con su circunferencia, franja de
 * cuadrícula), contadas por fuerza bruta; rutas por tramos; el camino más corto sobre la superficie de un cilindro
 * (varias vueltas, por dentro y por fuera de un tarro, dos cilindros tangentes) y el recorrido más largo sin repetir
 * tramo.
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorRutasEspacio) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Convenciones:
 *   - Una estructura es { nodos: [[x, y, z], ...], tramos: [[i, j], ...] } (z hacia arriba). Un tramo une dos nodos
 *     distintos; si trae un tercer número ([i, j, L]) esa es su longitud; si no, la distancia entre los dos nodos. Puede
 *     haber dos tramos entre los mismos nodos (en el hexágono, el lado recto y el arco). Puede traer 'arcos'
 *     ({ índice de tramo: { centro: [x, y, z], radio, desde, hasta } }, ángulos en radianes en el plano z = 0), que
 *     solo sirven para dibujar.
 *   - Una ruta es { nodos: [n0, n1, ...], tramos: [t1, t2, ...] } (los índices de los tramos usados, en orden).
 *     «Sin repetir punto»: ningún nodo se visita dos veces. «Sin repetir tramo»: ningún tramo se usa dos veces (los
 *     puntos sí se pueden repetir), y la hormiga se queda en la llegada apenas llega (la llegada sale solo al final).
 *     Las rutas se ordenan por número de tramos y, con el mismo número, por la lista de nodos y después la de tramos.
 *   - Direcciones (para dirigidas): vectores [dx, dy, dz]; un tramo se puede caminar de p a q solo si q − p apunta
 *     igual que una de las direcciones (mismo sentido). Por defecto, las tres de «solo avanzar»: [1,0,0], [0,1,0], [0,0,1],
 *     con las letras 'x', 'y', 'z'.
 *   - Un «exacto» es un texto con raíces y π simplificadas ('10', '2√5', '4√(9 + 4π²)', '2π').
 *   - Cada resultado que es la respuesta de una predicción trae 'errores' (lo que da cada error típico) y 'coinciden'
 *     (los nombres de los errores que en ese caso dan justo la respuesta correcta: no se ofrecen y no van en
 *     'errores'). Un error que da lo mismo que otro anterior de la lista va a 'repetidos' ({ nombre: el anterior }).
 *
 * Funciones (argumentos entre llaves):
 *   cubos(celdas, { arista })   estructura de alambre hecha con cubitos de arista 'arista' (1 si no se da); celdas: lista
 *                               de [i, j, k] (el cubito que ocupa [i, i + 1] × [j, j + 1] × [k, k + 1]). Nodos: todas las
 *                               esquinas, ordenadas por z, después y, después x (de menor a mayor), por la arista.
 *                               Tramos: las aristas de los cubitos sin repetir, ordenadas por (i, j) con i < j.
 *   piramide({ lado, altura })  pirámide de base cuadrada: nodos 0 a 3 la base, (0,0,0), (lado,0,0), (lado,lado,0),
 *                               (0,lado,0); nodo 4 la cúspide (lado/2, lado/2, altura). Tramos: 0-1, 1-2, 2-3, 0-3 y
 *                               0-4, 1-4, 2-4, 3-4 (en ese orden).
 *   tronco({ abajo, arriba, altura })   tronco de pirámide cuadrada: nodos 0 a 3 la base de abajo (como en la pirámide,
 *                               lado 'abajo'); 4 a 7 la de arriba (lado 'arriba', centrada, a la altura dada), el 4 sobre
 *                               el 0, el 5 sobre el 1… Tramos: 0-1, 1-2, 2-3, 0-3, 4-5, 5-6, 6-7, 4-7, 0-4, 1-5, 2-6, 3-7.
 *   hexagono({ radio, diametro })   circunferencia de centro (0, 0) y el hexágono regular inscrito: el nodo k está en el
 *                               ángulo 180° − 60°·k (0 a la izquierda, 3 a la derecha, 1 y 2 arriba, 4 y 5 abajo).
 *                               Tramos 0 a 5: los lados rectos [k, k + 1] (el 5 es [0, 5]); 6 a 11: los arcos entre los
 *                               mismos nodos (longitud π·radio/3). Con diametro = true, el nodo 6 es el centro y los
 *                               tramos 12 y 13 son [0, 6] y [3, 6].
 *   franja({ n, filas })        cuadrícula de n cuadraditos de largo por 'filas' de alto (por defecto 1), de lado 1:
 *                               nodos (x, y) con 0 ≤ x ≤ n, 0 ≤ y ≤ filas, numerados y·(n + 1) + x. Tramos: primero los
 *                               horizontales (por filas, de izquierda a derecha), después los verticales.
 *   rutasSinRepetir(est, { desde, hasta, repetir, espejo })   todas las rutas de 'desde' a 'hasta' (repetir: 'punto',
 *                               por defecto, o 'tramo'). espejo (opcional): lista con la imagen de cada nodo en un
 *                               reflejo de la estructura que deja fijos 'desde' y 'hasta'. { total, rutas, porPasos
 *                               ({ tramos: cuántas }), masCortas (las de menos tramos), porInicio ({ índice del primer
 *                               tramo: cuántas }), errores: soloCortas (masCortas: RME141), y con espejo: unLado (2 · las
 *                               que empiezan por un lado: de cada par de primeros tramos que el espejo intercambia, el de
 *                               menor índice; olvida las que empiezan sobre el espejo: AR18), ejeDoble (2 · (las de un lado
 *                               + las que empiezan sobre el espejo): cuenta dos veces las del medio: RME142) }.
 *   dirigidas(est, { desde, hasta, direcciones })   rutas que solo avanzan. { total, tabla (cuántas rutas llegan a cada
 *                               nodo desde 'desde', sumando las de los nodos que llegan a él; 0 si no se llega), niveles
 *                               ([[nodos a k tramos de 'desde']], solo los que se alcanzan, cada lista de menor a mayor),
 *                               llegan ([[nodos desde los que se llega a cada nodo con un tramo permitido]], de menor a mayor),
 *                               rutas ([{ nodos, tramos, pasos (texto de letras 'x', 'y', 'z'), giros (cuántas veces cambia
 *                               de letra) }] por orden alfabético de pasos), casos ({ primera letra: cuántas rutas empiezan
 *                               así }), pasos (tramos de cada ruta), errores: cajaCompleta (el multinomial de los pasos de
 *                               cada dirección, como si la estructura fuera la caja entera: RME140), potencia (3^pasos),
 *                               aMano (las rutas con a lo más pasos − 2 giros, las que salen primero al dibujarlas a mano:
 *                               AR18), sinDireccion (las rutas sin repetir punto, sin la regla de solo avanzar: RME32; no
 *                               se da si pasan de 100 000) }.
 *                               Con direcciones propias, las letras son 'd0', 'd1'… y cajaCompleta no se calcula.
 *   soltarDireccion(est, { desde, hasta })   { total (rutas sin repetir punto, en cualquier dirección), dirigidas (las que
 *                               solo avanzan), errores: igual (dirigidas: RME32), doble (2 · dirigidas), potencia (3^pasos
 *                               de las que avanzan) }.
 *   compararRepetir(est, { desde, hasta })   { total (rutas sin repetir tramo), punto (sin repetir punto), nuevas (las que
 *                               sin repetir tramo pasan dos veces por un punto), porPasos (de las de tramo), errores: igual
 *                               (punto), doble (2 · punto) }.
 *   porTramos({ cadenas })      cadenas: lista de alternativas; cada una es la lista de cuántas formas hay en cada
 *                               tramo seguido. { total: Σ (Π de cada cadena), productos (de cada cadena), errores:
 *                               sumarTodo (Σ de todo: RME30), multiplicarTodo (Π de los productos: RME143), unaCadena (el
 *                               producto mayor: AR18) }.
 *   pasoObligado(est, { desde, paso, hasta, dirigido })   rutas que van de 'desde' a 'hasta' pasando por 'paso'
 *                               (dirigido = true: solo avanzando; si no, sin repetir punto). { antes (de desde a paso),
 *                               despues (de paso a hasta), producto, total (todas las de desde a hasta, por fuerza bruta),
 *                               todasPasan (si todas pasan por 'paso'), errores: suma (antes + despues: RME30), soloMayor
 *                               (el mayor de los dos), y si es dirigido, comoCaja (el multinomial de los pasos de cada
 *                               dirección de 'desde' a 'hasta', medidos en tramos de la menor longitud: RME140) }.
 *   hamiltonianos(est, { desde, hasta })   rutas que pasan una vez por cada nodo, de 'desde' a 'hasta'. { total, rutas,
 *                               porInicio, errores: todasSimples (todas las rutas sin repetir punto, pasen o no por todos),
 *                               unaPorSalida (una por cada primer tramo que usan: AR18), ordenarTodos ((nodos − 2)!: todos
 *                               los órdenes de los de en medio) }.
 *   franjaSucesion({ hasta, filas, desde, llegada })   en la franja de n = 1, 2, … 'hasta' (a lo más 10) cuenta por fuerza
 *                               bruta las rutas sin repetir punto entre dos esquinas ('abajo-izquierda', 'abajo-derecha',
 *                               'arriba-izquierda', 'arriba-derecha'; por defecto de 'abajo-izquierda' a 'arriba-derecha').
 *                               { valores: [n = 1, 2, …], razon (valores[k+1]/valores[k] si es siempre la misma; si no,
 *                               null), formula ('2^n' si valores[n − 1] = 2^n para todo n; si no, null) }.
 *   franjaPrediccion({ n, filas })   de la esquina de abajo a la izquierda a la de arriba a la derecha en la franja de n
 *                               (n ≥ 3). { total, sucesion (de 1 a n), errores: lineal (sigue de 2 en 2 desde los dos
 *                               primeros casos: valores[0] + (n − 1)(valores[1] − valores[0]): RME144), porPuntos (2^(n + 1):
 *                               una elección por cada columna de puntos), cuadrado (n²) }.
 *   helice({ radio | contorno, altura, vueltas })   la hormiga sube por fuera de un cilindro dando 'vueltas' vueltas
 *                               (entero ≥ 1), de un punto del borde de abajo al que está justo encima en el borde de arriba.
 *                               { L (√(altura² + (vueltas · contorno)²)), exacto, ancho (vueltas · contorno), alto, anchoTexto,
 *                               errores: unaVuelta (√(altura² + contorno²): RME31), porBorde (altura + ancho: RME31),
 *                               cadaVuelta (vueltas · √(altura² + contorno²): cada vuelta con toda la altura: RME145),
 *                               exactos }. Con 'radio', contorno = 2π·radio (los exactos llevan π); 'contorno' lo da directo.
 *   tarro({ radio | contorno, afuera, adentro, fraccion })   tarro sin tapa: la hormiga está por fuera, 'afuera' bajo el
 *                               borde, y la miel por dentro, 'adentro' bajo el borde, a 'fraccion' de vuelta (0 a 0,5;
 *                               por defecto 0,5: al otro lado). Al desarrollar, la pared de adentro se refleja sobre el
 *                               borde. { L (√((fraccion · contorno)² + (afuera + adentro)²)), exacto, ancho, alto, anchoTexto,
 *                               errores: porBorde (afuera + ancho + adentro: RME31), sinReflejar (√(ancho² + (afuera −
 *                               adentro)²): RME146), vueltaEntera (√(contorno² + (afuera + adentro)²)), exactos }.
 *   tangentes({ radio, altura, radio2 })   dos cilindros parados, de la misma altura, tangentes a lo largo de una recta. La
 *                               hormiga sale del borde de abajo del primero, del lado opuesto a la recta de contacto, y
 *                               llega al borde de arriba del segundo, del lado opuesto. { L (√(altura² + (π·radio +
 *                               π·radio2)²)), exacto, ancho, anchoTexto, errores: porBorde (altura + ancho: RME31),
 *                               unCilindro (√(altura² + (π·radio)²): desarrolla uno solo: RME147), exactos }. radio2 = radio
 *                               si no se da.
 *   tapa({ radio, altura })     tarro con tapa: de un punto del borde de abajo al centro de la tapa, por fuera. Prueba,
 *                               desarrollando la tapa pegada al borde en 4001 puntos, cuál es la menor. { L (altura +
 *                               radio), exacto, errores: diagonal (√(altura² + radio²): por dentro) }.
 *   maximoSinRepetir(est, { desde, hasta })   el recorrido más largo de 'desde' a 'hasta' sin repetir tramo (puede pasar
 *                               por 'hasta' antes de terminar), por fuerza bruta (a lo más 24 tramos). { total (suma de
 *                               todos los tramos), maximo, quitado (total − maximo), ruta ({ nodos, tramos } de un recorrido
 *                               de ese largo), sobran (índices de los tramos que esa ruta no usa), impares (nodos de grado
 *                               impar), quitarMinimo (lo mínimo que hay que quitar para que solo 'desde' y 'hasta' queden
 *                               impares: empareja los nodos que deben cambiar de paridad por el camino más corto), errores:
 *                               todas (total), unaPorImpar (total − (nodos que deben cambiar de paridad) · el tramo más
 *                               corto: RME148), sumar (total + quitarMinimo: el recorrido mínimo que pasa por todo: RME149) }.
 *   revisarQuitar(est, { desde, hasta, quitados })   se sacan los tramos 'quitados'. { impares (de lo que queda), conexa
 *                               (todos los tramos que quedan están unidos a 'desde'), sePuede (lo que queda se recorre entero
 *                               de 'desde' a 'hasta' sin repetir: conexa, llega a 'hasta' y sus impares son justo 'desde' y
 *                               'hasta'), longitud (de lo que queda), quedan (cuántos tramos quedan) }.
 *   longitud(est, k)            la longitud del tramo k.
 *   multinomial(lista)          (Σ lista)! / Π (cada uno)!.
 *   grados(est)                 cuántos tramos llegan a cada nodo.
 *   distancias(est)             la tabla de distancias más cortas entre nodos por los tramos (Floyd-Warshall).
 *   radical(n)                  √n simplificada para n entero ≥ 0: { coef, rad, texto, valor }; null si no es entero.
 *   exactoPi(a, b)              el texto de √(a + b·π²) con a, b enteros ≥ 0, sacando el mayor cuadrado común.
 *   estructuras                 las estructuras de la escena (solo datos): cubo, dosCubos (en fila, a lo largo de x),
 *                               ele (tres cubitos en L: [0,0,0], [1,0,0], [1,1,0]), escalon (dos cubitos en fila y uno
 *                               encima del primero), torre (dos cubitos, uno encima del otro), piramide (lado 2, altura 2),
 *                               tronco (abajo 4, arriba 2, altura 2), hexagono (radio 1, con diámetro), hexagonoSolo (sin
 *                               diámetro), unidosVertice (un cubito [0,0,0] y dos en fila [1,1,1], [2,1,1]: se tocan solo
 *                               en el vértice (1, 1, 1)), cuboArista3 (el cubo de arista 3).
 *
 * Respaldos (docs/investigacion/razonamiento-espacial-ideas-erroneas.md y aritmetica-razonamiento-ideas-erroneas.md):
 * listar rutas al tanteo y olvidar algunas es AR18 (documentado con cifra por confirmar; aquí «parcial»). Los RME son
 * hipótesis nuestras: RME30 (sumar tramos en vez de multiplicarlos), RME31 (no desarrollar o desarrollar una sola
 * vuelta), RME32 (dejar fuera la condición de dirección) y los nuevos RME140 a RME149 de esta plantilla.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorRutasEspacio = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const EPS = 1e-9;

  // ---------- Comprobaciones ----------
  function numero(x, que, o) {
    o = o || {};
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que} debe ser un número`);
    if (o.entero && !Number.isInteger(x)) throw new Error(`${que} debe ser entero`);
    if (o.positivo && !(x > 0)) throw new Error(`${que} debe ser positivo`);
    if (o.noNegativo && x < 0) throw new Error(`${que} no puede ser negativo`);
    return x;
  }
  function objeto(o, que) { if (!o || typeof o !== 'object' || Array.isArray(o)) throw new Error(`${que} debe ser un objeto`); return o; }
  const factorial = n => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; };
  function multinomial(lista) {
    if (!Array.isArray(lista)) throw new Error('multinomial necesita una lista');
    lista.forEach(v => numero(v, 'cada número', { entero: true, noNegativo: true }));
    let r = factorial(lista.reduce((a, b) => a + b, 0));
    for (const v of lista) r /= factorial(v);
    return Math.round(r);
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
  // √(a + b·π²), a y b enteros ≥ 0.
  function exactoPi(a, b) {
    numero(a, 'a', { entero: true, noNegativo: true }); numero(b, 'b', { entero: true, noNegativo: true });
    if (b === 0) return radical(a).texto;
    let g = 1;
    for (let q = Math.floor(Math.sqrt(Math.max(a, b))); q > 1; q--) if (a % (q * q) === 0 && b % (q * q) === 0) { g = q; break; }
    const A = a / (g * g), B = b / (g * g), c = g === 1 ? '' : String(g);
    const rb = radical(B);
    if (A === 0) return `${g * rb.coef === 1 ? '' : g * rb.coef}${rb.rad === 1 ? '' : `√${rb.rad}`}π`;
    const pi = B === 1 ? 'π²' : `${B}π²`;
    return `${c}√(${A} + ${pi})`;
  }
  // El texto exacto de una longitud L² = a + b·π² (a, b racionales con denominador chico: se escala).
  function exactoDe(a, b) {
    for (let d = 1; d <= 100; d++) {
      const A = a * d * d, B = b * d * d;
      if (Math.abs(A - Math.round(A)) < 1e-7 && Math.abs(B - Math.round(B)) < 1e-7) {
        const t = exactoPi(Math.round(A), Math.round(B));
        return d === 1 ? t : `${t}/${d}`;
      }
    }
    return null;
  }

  // ---------- Estructuras ----------
  function estructura(est, que) {
    objeto(est, que || 'la estructura');
    if (!Array.isArray(est.nodos) || !est.nodos.length) throw new Error('la estructura necesita nodos');
    for (const p of est.nodos) if (!Array.isArray(p) || p.length !== 3 || !p.every(Number.isFinite)) throw new Error(`nodo inválido: ${JSON.stringify(p)}`);
    if (!Array.isArray(est.tramos)) throw new Error('la estructura necesita tramos');
    for (const t of est.tramos) {
      if (!Array.isArray(t) || t.length < 2 || t.length > 3) throw new Error(`tramo inválido: ${JSON.stringify(t)}`);
      const [i, j] = t;
      if (!Number.isInteger(i) || !Number.isInteger(j) || i < 0 || j < 0 || i >= est.nodos.length || j >= est.nodos.length || i === j) throw new Error(`tramo inválido: ${JSON.stringify(t)}`);
      if (t.length === 3) numero(t[2], 'la longitud del tramo', { positivo: true });
    }
    return est;
  }
  function longitud(est, k) {
    const t = est.tramos[k];
    if (!t) throw new Error('no existe ese tramo');
    if (t.length === 3) return t[2];
    const p = est.nodos[t[0]], q = est.nodos[t[1]];
    return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
  }
  function vecinos(est) {
    const V = est.nodos.map(() => []);
    est.tramos.forEach(([i, j], k) => { V[i].push([j, k]); V[j].push([i, k]); });
    return V;
  }
  function nodoValido(est, v, que) {
    if (!Number.isInteger(v) || v < 0 || v >= est.nodos.length) throw new Error(`${que} debe ser un nodo de la estructura`);
    return v;
  }

  function cubos(celdas, o) {
    if (!Array.isArray(celdas) || !celdas.length) throw new Error('cubos necesita una lista de celdas');
    const a = o && o.arista !== undefined ? numero(o.arista, 'la arista', { positivo: true }) : 1;
    const clave = p => p.join(',');
    const puntos = new Map(), aristas = new Set();
    for (const c of celdas) {
      if (!Array.isArray(c) || c.length !== 3 || !c.every(Number.isInteger)) throw new Error(`celda inválida: ${JSON.stringify(c)}`);
      const [i, j, k] = c;
      for (let dx = 0; dx <= 1; dx++) for (let dy = 0; dy <= 1; dy++) for (let dz = 0; dz <= 1; dz++) puntos.set(clave([i + dx, j + dy, k + dz]), [i + dx, j + dy, k + dz]);
    }
    const lista = [...puntos.values()].sort((p, q) => p[2] - q[2] || p[1] - q[1] || p[0] - q[0]);
    const idx = new Map(lista.map((p, n) => [clave(p), n]));
    for (const c of celdas) {
      const [i, j, k] = c;
      for (let dx = 0; dx <= 1; dx++) for (let dy = 0; dy <= 1; dy++) for (let dz = 0; dz <= 1; dz++) {
        const p = [i + dx, j + dy, k + dz];
        for (let e = 0; e < 3; e++) {
          const q = p.slice(); q[e] += 1;
          if (q[e] > [i, j, k][e] + 1) continue;
          const u = idx.get(clave(p)), v = idx.get(clave(q));
          aristas.add(Math.min(u, v) + ',' + Math.max(u, v));
        }
      }
    }
    const tramos = [...aristas].map(s => s.split(',').map(Number)).sort((p, q) => p[0] - q[0] || p[1] - q[1]);
    return { nodos: lista.map(p => p.map(x => x * a)), tramos };
  }
  function piramide(o) {
    objeto(o, 'la pirámide');
    const L = numero(o.lado, 'el lado', { positivo: true }), H = numero(o.altura, 'la altura', { positivo: true });
    return { nodos: [[0, 0, 0], [L, 0, 0], [L, L, 0], [0, L, 0], [L / 2, L / 2, H]],
      tramos: [[0, 1], [1, 2], [2, 3], [0, 3], [0, 4], [1, 4], [2, 4], [3, 4]] };
  }
  function tronco(o) {
    objeto(o, 'el tronco');
    const A = numero(o.abajo, 'el lado de abajo', { positivo: true }), B = numero(o.arriba, 'el lado de arriba', { positivo: true }), H = numero(o.altura, 'la altura', { positivo: true });
    if (!(B < A)) throw new Error('el lado de arriba debe ser menor que el de abajo');
    const m = (A - B) / 2;
    return { nodos: [[0, 0, 0], [A, 0, 0], [A, A, 0], [0, A, 0], [m, m, H], [m + B, m, H], [m + B, m + B, H], [m, m + B, H]],
      tramos: [[0, 1], [1, 2], [2, 3], [0, 3], [4, 5], [5, 6], [6, 7], [4, 7], [0, 4], [1, 5], [2, 6], [3, 7]] };
  }
  function hexagono(o) {
    objeto(o, 'el hexágono');
    const r = numero(o.radio, 'el radio', { positivo: true });
    const ang = k => Math.PI - k * Math.PI / 3;
    const nodos = [];
    for (let k = 0; k < 6; k++) nodos.push([r * Math.cos(ang(k)), r * Math.sin(ang(k)), 0].map(v => Math.abs(v) < 1e-12 ? 0 : v));
    const tramos = [], arcos = {};
    for (let k = 0; k < 5; k++) tramos.push([k, k + 1]);
    tramos.push([0, 5]);
    for (let k = 0; k < 5; k++) { arcos[tramos.length] = { centro: [0, 0, 0], radio: r, desde: ang(k), hasta: ang(k + 1) }; tramos.push([k, k + 1, Math.PI * r / 3]); }
    arcos[tramos.length] = { centro: [0, 0, 0], radio: r, desde: Math.PI, hasta: Math.PI + Math.PI / 3 };
    tramos.push([0, 5, Math.PI * r / 3]);
    if (o.diametro) { nodos.push([0, 0, 0]); tramos.push([0, 6], [3, 6]); }
    return { nodos, tramos, arcos };
  }
  function franja(o) {
    objeto(o, 'la franja');
    const n = numero(o.n, 'n', { entero: true, positivo: true });
    const f = o.filas === undefined ? 1 : numero(o.filas, 'las filas', { entero: true, positivo: true });
    const id = (x, y) => y * (n + 1) + x, nodos = [], tramos = [];
    for (let y = 0; y <= f; y++) for (let x = 0; x <= n; x++) nodos.push([x, y, 0]);
    for (let y = 0; y <= f; y++) for (let x = 0; x < n; x++) tramos.push([id(x, y), id(x + 1, y)]);
    for (let y = 0; y < f; y++) for (let x = 0; x <= n; x++) tramos.push([id(x, y), id(x, y + 1)]);
    return { nodos, tramos };
  }

  // ---------- Enumeración ----------
  const cmpLista = (a, b) => { for (let k = 0; k < Math.min(a.length, b.length); k++) if (a[k] !== b[k]) return a[k] - b[k]; return a.length - b.length; };
  const cmpRuta = (a, b) => a.tramos.length - b.tramos.length || cmpLista(a.nodos, b.nodos) || cmpLista(a.tramos, b.tramos);
  function enumerar(est, desde, hasta, repetir, limite) {
    const V = vecinos(est), rutas = [], nodos = [desde], tramos = [];
    const usadoN = new Array(est.nodos.length).fill(false), usadoT = new Array(est.tramos.length).fill(false);
    usadoN[desde] = true;
    const tope = limite || 2e6;
    (function dfs(v) {
      if (v === hasta && nodos.length > 1) { rutas.push({ nodos: nodos.slice(), tramos: tramos.slice() }); if (rutas.length > tope) throw new Error('demasiadas rutas'); return; }
      for (const [w, k] of V[v]) {
        if (usadoT[k]) continue;
        if (repetir === 'punto' && usadoN[w]) continue;
        if (repetir === 'tramo' && w === desde && desde === hasta) { /* volver al inicio cierra */ }
        usadoT[k] = true; const antes = usadoN[w]; usadoN[w] = true; nodos.push(w); tramos.push(k);
        dfs(w);
        usadoT[k] = false; usadoN[w] = antes; nodos.pop(); tramos.pop();
      }
    })(desde);
    return rutas.sort(cmpRuta);
  }
  // cuenta las rutas sin repetir punto sin guardarlas; null si pasan de 'tope'
  function contarSimples(est, desde, hasta, tope) {
    const V = vecinos(est), usado = new Array(est.nodos.length).fill(false);
    let n = 0;
    usado[desde] = true;
    try {
      (function dfs(v) {
        if (v === hasta) { if (++n > tope) throw 0; return; }
        for (const [w] of V[v]) if (!usado[w]) { usado[w] = true; dfs(w); usado[w] = false; }
      })(desde);
    } catch (e) { if (e === 0) return null; throw e; }
    return n;
  }
  function contarPorClave(lista, f) { const o = {}; for (const x of lista) { const k = f(x); o[k] = (o[k] || 0) + 1; } return o; }
  // errores → { errores, coinciden, repetidos } sin choques con la correcta
  function separar(correcta, lista) {
    const errores = {}, coinciden = [], repetidos = {}, vistos = [];
    for (const [k, v] of lista) {
      if (v === undefined || v === null) continue;
      if (Math.abs(v - correcta) <= EPS * Math.max(1, Math.abs(v))) { coinciden.push(k); continue; }
      const igual = vistos.find(([, w]) => Math.abs(w - v) <= EPS * Math.max(1, Math.abs(v)));
      if (igual) { repetidos[k] = igual[0]; continue; }
      errores[k] = v; vistos.push([k, v]);
    }
    const r = { errores, coinciden };
    if (Object.keys(repetidos).length) r.repetidos = repetidos;
    return r;
  }

  function rutasSinRepetir(est, o) {
    estructura(est); objeto(o, 'las opciones');
    const desde = nodoValido(est, o.desde, 'desde'), hasta = nodoValido(est, o.hasta, 'hasta');
    if (desde === hasta) throw new Error('la salida y la llegada deben ser distintas');
    const repetir = o.repetir === undefined ? 'punto' : o.repetir;
    if (repetir !== 'punto' && repetir !== 'tramo') throw new Error("repetir debe ser 'punto' o 'tramo'");
    const rutas = enumerar(est, desde, hasta, repetir);
    const porPasos = contarPorClave(rutas, r => r.tramos.length);
    const min = rutas.length ? rutas[0].tramos.length : 0;
    const masCortas = rutas.filter(r => r.tramos.length === min).length;
    const porInicio = contarPorClave(rutas, r => r.tramos[0]);
    const lista = [['soloCortas', masCortas]];
    if (o.espejo) {
      const e = o.espejo;
      if (!Array.isArray(e) || e.length !== est.nodos.length || e[desde] !== desde || e[hasta] !== hasta) throw new Error('el espejo debe dar la imagen de cada nodo y dejar fijos la salida y la llegada');
      const imagen = k => { const [i, j] = est.tramos[k], a = e[i], b = e[j];
        const cand = est.tramos.map((t, q) => q).filter(q => { const [u, v] = est.tramos[q]; return ((u === a && v === b) || (u === b && v === a)) && (est.tramos[q].length === est.tramos[k].length) && Math.abs(longitud(est, q) - longitud(est, k)) < 1e-9; });
        if (cand.includes(k)) return k;
        return cand[0]; };
      let lado = 0, eje = 0;
      const salen = [...new Set(est.tramos.map((t, k) => k).filter(k => est.tramos[k][0] === desde || est.tramos[k][1] === desde))];
      for (const k of salen) {
        const im = imagen(k), n = porInicio[k] || 0;
        if (im === k) eje += n; else if (k < im) lado += n;
      }
      lista.push(['unLado', 2 * lado], ['ejeDoble', 2 * (lado + eje)]);
    }
    return Object.assign({ total: rutas.length, rutas, porPasos, masCortas, porInicio }, separar(rutas.length, lista));
  }

  const LETRAS = ['x', 'y', 'z'];
  function dirigidas(est, o) {
    estructura(est); objeto(o, 'las opciones');
    const desde = nodoValido(est, o.desde, 'desde'), hasta = nodoValido(est, o.hasta, 'hasta');
    const propias = !!o.direcciones;
    const dirs = propias ? o.direcciones : [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    if (!Array.isArray(dirs) || !dirs.length) throw new Error('direcciones debe ser una lista');
    const unit = d => { const n = Math.hypot(d[0], d[1], d[2]); if (!(n > 0)) throw new Error('dirección nula'); return d.map(v => v / n); };
    const U = dirs.map(unit);
    const letra = k => propias ? 'd' + k : LETRAS[k];
    // salidas permitidas de cada nodo
    const sal = est.nodos.map(() => []);
    est.tramos.forEach(([i, j], k) => {
      for (const [p, q] of [[i, j], [j, i]]) {
        const a = est.nodos[p], b = est.nodos[q], d = unit([b[0] - a[0], b[1] - a[1], b[2] - a[2]]);
        const di = U.findIndex(u => Math.abs(u[0] - d[0]) < 1e-9 && Math.abs(u[1] - d[1]) < 1e-9 && Math.abs(u[2] - d[2]) < 1e-9);
        if (di >= 0) sal[p].push([q, k, di]);
      }
    });
    const rutas = [];
    const nodos = [desde], tramos = [], pasos = [];
    (function dfs(v, prof) {
      if (prof > est.tramos.length) throw new Error('las direcciones permiten volver: no es una estructura que solo avanza');
      if (v === hasta && nodos.length > 1) { rutas.push({ nodos: nodos.slice(), tramos: tramos.slice(), pasos: pasos.join(''), giros: pasos.reduce((g, p, q) => g + (q && p !== pasos[q - 1] ? 1 : 0), 0) }); return; }
      for (const [w, k, di] of sal[v]) { nodos.push(w); tramos.push(k); pasos.push(letra(di)); dfs(w, prof + 1); nodos.pop(); tramos.pop(); pasos.pop(); }
    })(desde, 0);
    rutas.sort((a, b) => (a.pasos < b.pasos ? -1 : a.pasos > b.pasos ? 1 : cmpLista(a.nodos, b.nodos)));
    // tabla: rutas que llegan a cada nodo (desde 'desde'), por suma de los de atrás
    const tabla = est.nodos.map(() => 0), nivel = est.nodos.map(() => -1);
    tabla[desde] = 1; nivel[desde] = 0;
    // orden topológico (las direcciones permitidas no forman ciclos si la dfs terminó)
    const orden = [], visto = new Array(est.nodos.length).fill(0);
    (function topo(v) { if (visto[v]) return; visto[v] = 1; for (const [w] of sal[v]) topo(w); orden.push(v); })(desde);
    orden.reverse();
    const llegan = est.nodos.map(() => []);
    for (const v of orden) for (const [w] of sal[v]) { tabla[w] += tabla[v]; nivel[w] = Math.max(nivel[w], nivel[v] + 1); llegan[w].push(v); }
    llegan.forEach(l => l.sort((a, b) => a - b));
    const niveles = [];
    orden.forEach(v => { if (nivel[v] >= 0) { (niveles[nivel[v]] = niveles[nivel[v]] || []).push(v); } });
    niveles.forEach(l => l.sort((a, b) => a - b));
    const casos = contarPorClave(rutas, r => (propias ? r.pasos.match(/^d\d+/)[0] : r.pasos[0]));
    const npasos = rutas.length ? rutas[0].tramos.length : 0;
    const lista = [];
    if (!propias && rutas.length) {
      const cuenta = LETRAS.map(l => rutas[0].pasos.split('').filter(c => c === l).length);
      lista.push(['cajaCompleta', multinomial(cuenta)]);
    }
    lista.push(['potencia', Math.pow(dirs.length, npasos)]);
    lista.push(['aMano', rutas.filter(r => r.giros <= npasos - 2).length]);
    if (desde !== hasta) { const c = contarSimples(est, desde, hasta, 1e5); if (c !== null) lista.push(['sinDireccion', c]); }
    return Object.assign({ total: rutas.length, tabla, niveles, llegan, rutas, casos, pasos: npasos }, separar(rutas.length, lista));
  }

  function porTramos(o) {
    objeto(o, 'las opciones');
    if (!Array.isArray(o.cadenas) || !o.cadenas.length) throw new Error('cadenas debe ser una lista');
    o.cadenas.forEach(c => { if (!Array.isArray(c) || !c.length) throw new Error('cada cadena es una lista'); c.forEach(v => numero(v, 'cada tramo', { entero: true, positivo: true })); });
    const productos = o.cadenas.map(c => c.reduce((a, b) => a * b, 1));
    const total = productos.reduce((a, b) => a + b, 0);
    const lista = [['sumarTodo', o.cadenas.reduce((s, c) => s + c.reduce((a, b) => a + b, 0), 0)],
      ['multiplicarTodo', productos.reduce((a, b) => a * b, 1)], ['unaCadena', Math.max(...productos)]];
    return Object.assign({ total, productos }, separar(total, lista));
  }

  function pasoObligado(est, o) {
    estructura(est); objeto(o, 'las opciones');
    const desde = nodoValido(est, o.desde, 'desde'), paso = nodoValido(est, o.paso, 'paso'), hasta = nodoValido(est, o.hasta, 'hasta');
    const contar = (a, b) => o.dirigido ? dirigidas(est, { desde: a, hasta: b }).rutas : enumerar(est, a, b, 'punto');
    const antes = contar(desde, paso).length, despues = contar(paso, hasta).length;
    const todas = contar(desde, hasta), pasan = todas.filter(r => r.nodos.includes(paso)).length;
    const producto = antes * despues;
    return Object.assign({ antes, despues, producto, total: todas.length, todasPasan: pasan === todas.length },
      separar(todas.length, cajaDe(est, desde, hasta, [['suma', antes + despues], ['soloMayor', Math.max(antes, despues)]], o.dirigido)));
  }

  // agrega 'comoCaja' (el multinomial de los pasos de la salida a la llegada) si se camina solo avanzando
  function cajaDe(est, a, b, lista, dirigido) {
    if (!dirigido) return lista;
    const p = est.nodos[a], q = est.nodos[b], L = Math.min(...est.tramos.map((t, j) => longitud(est, j)));
    const d = [0, 1, 2].map(e => Math.round((q[e] - p[e]) / L));
    if (d.every(v => v >= 0)) lista.push(['comoCaja', multinomial(d)]);
    return lista;
  }
  // Cuántas rutas hay sin repetir punto, comparadas con las que solo avanzan.
  function soltarDireccion(est, o) {
    estructura(est); objeto(o, 'las opciones');
    const D = dirigidas(est, o), total = enumerar(est, o.desde, o.hasta, 'punto').length;
    return Object.assign({ total, dirigidas: D.total }, separar(total, [['igual', D.total], ['doble', 2 * D.total], ['potencia', Math.pow(3, D.pasos)]]));
  }
  // Rutas sin repetir tramo comparadas con las que no repiten punto.
  function compararRepetir(est, o) {
    estructura(est); objeto(o, 'las opciones');
    const P = rutasSinRepetir(est, { desde: o.desde, hasta: o.hasta }), T = rutasSinRepetir(est, { desde: o.desde, hasta: o.hasta, repetir: 'tramo' });
    const nuevas = T.rutas.filter(r => new Set(r.nodos).size < r.nodos.length);
    return Object.assign({ total: T.total, punto: P.total, nuevas: nuevas.length, porPasos: T.porPasos }, separar(T.total, [['igual', P.total], ['doble', 2 * P.total]]));
  }
  function hamiltonianos(est, o) {
    estructura(est); objeto(o, 'las opciones');
    const desde = nodoValido(est, o.desde, 'desde'), hasta = nodoValido(est, o.hasta, 'hasta');
    const n = est.nodos.length;
    const rutas = enumerar(est, desde, hasta, 'punto').filter(r => r.nodos.length === n);
    const porInicio = contarPorClave(rutas, r => r.tramos[0]);
    const usadas = Object.keys(porInicio).length;
    return Object.assign({ total: rutas.length, rutas, porInicio }, separar(rutas.length,
      [['todasSimples', enumerar(est, desde, hasta, 'punto').length], ['unaPorSalida', usadas], ['ordenarTodos', factorial(n - 2)]]));
  }

  function esquina(n, filas, cual) {
    const id = (x, y) => y * (n + 1) + x;
    if (cual === 'abajo-izquierda') return id(0, 0);
    if (cual === 'arriba-derecha') return id(n, filas);
    if (cual === 'abajo-derecha') return id(n, 0);
    if (cual === 'arriba-izquierda') return id(0, filas);
    throw new Error('esquina desconocida');
  }
  function franjaSucesion(o) {
    objeto(o, 'las opciones');
    const N = numero(o.hasta, 'hasta', { entero: true, positivo: true });
    if (N > 10) throw new Error('hasta 10 cuadraditos');
    const filas = o.filas === undefined ? 1 : o.filas;
    const a = o.desde || 'abajo-izquierda', b = o.llegada || 'arriba-derecha';
    const valores = [];
    for (let n = 1; n <= N; n++) { const f = franja({ n, filas }); valores.push(enumerar(f, esquina(n, filas, a), esquina(n, filas, b), 'punto').length); }
    let razon = valores.length > 1 ? valores[1] / valores[0] : null;
    for (let k = 1; k < valores.length; k++) if (razon === null || valores[k] !== valores[k - 1] * razon) { razon = null; break; }
    const formula = valores.every((v, k) => v === Math.pow(2, k + 1)) ? '2^n' : null;
    return { valores, razon, formula };
  }
  function franjaPrediccion(o) {
    objeto(o, 'las opciones');
    const n = numero(o.n, 'n', { entero: true, positivo: true });
    if (n < 3) throw new Error('n debe ser al menos 3 (los dos primeros casos se muestran)');
    const S = franjaSucesion({ hasta: n, filas: o.filas });
    const v = S.valores, total = v[n - 1];
    const lista = [['lineal', v[0] + (n - 1) * (v[1] - v[0])], ['porPuntos', Math.pow(2, n + 1)], ['cuadrado', n * n]];
    return Object.assign({ total, sucesion: v }, separar(total, lista));
  }

  // ---------- Cilindros ----------
  // contorno como a + b·π (a, b racionales): con radio, a = 0 y b = 2·radio
  function contornoDe(o) {
    if (o.radio !== undefined && o.contorno !== undefined) throw new Error('da el radio o el contorno, no los dos');
    if (o.radio !== undefined) { numero(o.radio, 'el radio', { positivo: true }); return { pi: 2 * o.radio, valor: 2 * Math.PI * o.radio }; }
    numero(o.contorno, 'el contorno', { positivo: true }); return { pi: 0, valor: o.contorno, num: o.contorno };
  }
  // texto de c·(algo con π o sin π)
  const fmtNum = v => { const r = Math.round(v * 1e6) / 1e6; return String(r).replace('.', ','); };
  function largoTexto(C, f) { // f · contorno, en texto
    if (C.pi) { const b = C.pi * f; return b === 1 ? 'π' : `${fmtNum(b)}π`; }
    return fmtNum(C.num * f);
  }
  function helice(o) {
    objeto(o, 'las opciones');
    const C = contornoDe(o), h = numero(o.altura, 'la altura', { positivo: true }), k = numero(o.vueltas, 'las vueltas', { entero: true, positivo: true });
    const ancho = k * C.valor, L = Math.hypot(h, ancho);
    const L2 = (f) => C.pi ? [h * h, (C.pi * f) ** 2] : [h * h + (C.num * f) ** 2, 0];
    const ex = (f) => { const [a, b] = L2(f); return exactoDe(a, b); };
    const una = Math.hypot(h, C.valor);
    const lista = [['unaVuelta', una], ['porBorde', h + ancho], ['cadaVuelta', k * una]];
    const sep = separar(L, lista);
    const exactos = {};
    const exK = f => { const [a, b] = L2(1); return exactoDe(a * f * f, b * f * f); };
    for (const nom of Object.keys(sep.errores)) exactos[nom] = nom === 'unaVuelta' ? ex(1) : nom === 'porBorde' ? (C.pi ? `${fmtNum(h)} + ${largoTexto(C, k)}` : fmtNum(h + ancho)) : exK(k);
    return Object.assign({ L, exacto: ex(k), ancho, alto: h, anchoTexto: largoTexto(C, k) }, sep, { exactos });
  }
  function tarro(o) {
    objeto(o, 'las opciones');
    const C = contornoDe(o), a = numero(o.afuera, 'afuera', { noNegativo: true }), b = numero(o.adentro, 'adentro', { noNegativo: true });
    const f = o.fraccion === undefined ? 0.5 : numero(o.fraccion, 'la fracción', { noNegativo: true });
    if (f > 0.5) throw new Error('la fracción de vuelta va de 0 a 0,5 (el camino corto rodea por el lado más cercano)');
    const ancho = f * C.valor, L = Math.hypot(ancho, a + b);
    const ex = (alto) => C.pi ? exactoDe(alto * alto, (C.pi * f) ** 2) : exactoDe(alto * alto + (C.num * f) ** 2, 0);
    const sep = separar(L, [['porBorde', a + ancho + b], ['sinReflejar', Math.hypot(ancho, a - b)], ['vueltaEntera', Math.hypot(C.valor, a + b)]]);
    const exactos = {};
    if ('porBorde' in sep.errores) exactos.porBorde = C.pi ? `${fmtNum(a + b)} + ${largoTexto(C, f)}` : fmtNum(a + ancho + b);
    if ('sinReflejar' in sep.errores) exactos.sinReflejar = ex(Math.abs(a - b));
    if ('vueltaEntera' in sep.errores) exactos.vueltaEntera = C.pi ? exactoDe((a + b) ** 2, C.pi ** 2) : exactoDe((a + b) ** 2 + C.num ** 2, 0);
    return Object.assign({ L, exacto: ex(a + b), ancho, alto: a + b, anchoTexto: largoTexto(C, f) }, sep, { exactos });
  }
  function tangentes(o) {
    objeto(o, 'las opciones');
    const r = numero(o.radio, 'el radio', { positivo: true }), h = numero(o.altura, 'la altura', { positivo: true });
    const r2 = o.radio2 === undefined ? r : numero(o.radio2, 'el segundo radio', { positivo: true });
    const b = r + r2, ancho = Math.PI * b, L = Math.hypot(h, ancho);
    const sep = separar(L, [['porBorde', h + ancho], ['unCilindro', Math.hypot(h, Math.PI * r)]]);
    const exactos = {};
    if ('porBorde' in sep.errores) exactos.porBorde = `${fmtNum(h)} + ${b === 1 ? '' : fmtNum(b)}π`;
    if ('unCilindro' in sep.errores) exactos.unCilindro = exactoDe(h * h, r * r);
    return Object.assign({ L, exacto: exactoDe(h * h, b * b), ancho, anchoTexto: `${b === 1 ? '' : fmtNum(b)}π` }, sep, { exactos });
  }
  function tapa(o) {
    objeto(o, 'las opciones');
    const r = numero(o.radio, 'el radio', { positivo: true }), h = numero(o.altura, 'la altura', { positivo: true });
    // la tapa desarrollada se pega al borde en el punto que está a s de la vertical de la hormiga (s de −πr a πr)
    let mejor = Infinity;
    for (let k = -2000; k <= 2000; k++) { const s = k / 2000 * Math.PI * r; mejor = Math.min(mejor, Math.hypot(s, h + r)); }
    const L = h + r;
    if (Math.abs(mejor - L) > 1e-9) throw new Error('la barrida no coincide');
    return Object.assign({ L, exacto: fmtNum(L) }, separar(L, [['diagonal', Math.hypot(h, r)]]));
  }

  // ---------- Recorrido máximo ----------
  function grados(est) { const g = est.nodos.map(() => 0); est.tramos.forEach(([i, j]) => { g[i]++; g[j]++; }); return g; }
  function distancias(est) {
    const n = est.nodos.length, D = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 0 : Infinity)));
    est.tramos.forEach(([i, j], k) => { const L = longitud(est, k); if (L < D[i][j]) { D[i][j] = L; D[j][i] = L; } });
    for (let k = 0; k < n; k++) for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (D[i][k] + D[k][j] < D[i][j]) D[i][j] = D[i][k] + D[k][j];
    return D;
  }
  function emparejar(lista, D) {
    if (!lista.length) return 0;
    const [a, ...resto] = lista;
    let mejor = Infinity;
    for (let k = 0; k < resto.length; k++) { const b = resto[k]; mejor = Math.min(mejor, D[a][b] + emparejar(resto.filter((_, q) => q !== k), D)); }
    return mejor;
  }
  function maximoSinRepetir(est, o) {
    estructura(est); objeto(o, 'las opciones');
    const desde = nodoValido(est, o.desde, 'desde'), hasta = nodoValido(est, o.hasta, 'hasta');
    if (desde === hasta) throw new Error('la salida y la llegada deben ser distintas');
    if (est.tramos.length > 24) throw new Error('a lo más 24 tramos');
    const V = vecinos(est), L = est.tramos.map((_, k) => longitud(est, k));
    const usado = new Array(est.tramos.length).fill(false);
    let maximo = -1, mejor = null;
    const nodos = [desde], tramos = [];
    const total = L.reduce((a, b) => a + b, 0);
    (function dfs(v, largo) {
      if (v === hasta && largo > maximo + EPS) { maximo = largo; mejor = { nodos: nodos.slice(), tramos: tramos.slice() }; }
      if (maximo >= total - EPS) return;
      for (const [w, k] of V[v]) {
        if (usado[k]) continue;
        usado[k] = true; nodos.push(w); tramos.push(k);
        dfs(w, largo + L[k]);
        usado[k] = false; nodos.pop(); tramos.pop();
        if (maximo >= total - EPS) return;
      }
    })(desde, 0);
    if (!mejor) throw new Error('no hay ruta entre esos puntos');
    const g = grados(est), impares = g.map((d, i) => i).filter(i => g[i] % 2 === 1);
    // los que deben cambiar de paridad: los impares que no son extremos y los extremos que son pares
    const T = est.nodos.map((_, i) => i).filter(i => (g[i] % 2 === 1) !== (i === desde || i === hasta));
    const D = distancias(est);
    const quitarMinimo = emparejar(T, D);
    const corto = Math.min(...L);
    const sobran = est.tramos.map((_, k) => k).filter(k => !mejor.tramos.includes(k));
    const lista = [['todas', total], ['unaPorImpar', total - T.length * corto], ['sumar', total + quitarMinimo]];
    return Object.assign({ total, maximo, quitado: total - maximo, ruta: mejor, sobran, impares, quitarMinimo }, separar(maximo, lista));
  }
  function revisarQuitar(est, o) {
    estructura(est); objeto(o, 'las opciones');
    const desde = nodoValido(est, o.desde, 'desde'), hasta = nodoValido(est, o.hasta, 'hasta');
    const q = new Set(o.quitados || []);
    for (const k of q) if (!Number.isInteger(k) || k < 0 || k >= est.tramos.length) throw new Error('tramo quitado inválido');
    const quedan = est.tramos.map((t, k) => k).filter(k => !q.has(k));
    const g = est.nodos.map(() => 0);
    for (const k of quedan) { const [i, j] = est.tramos[k]; g[i]++; g[j]++; }
    const impares = g.map((d, i) => i).filter(i => g[i] % 2 === 1);
    // conexa: todos los tramos que quedan se alcanzan desde 'desde'
    const V = est.nodos.map(() => []);
    for (const k of quedan) { const [i, j] = est.tramos[k]; V[i].push(j); V[j].push(i); }
    const visto = new Set([desde]), pila = [desde];
    while (pila.length) { const v = pila.pop(); for (const w of V[v]) if (!visto.has(w)) { visto.add(w); pila.push(w); } }
    const conexa = quedan.every(k => visto.has(est.tramos[k][0]));
    const extremos = desde === hasta ? [] : [desde, hasta].sort((a, b) => a - b);
    const sePuede = conexa && visto.has(hasta) && impares.length === extremos.length && impares.every((v, k) => v === extremos[k]);
    const largo = quedan.reduce((s, k) => s + longitud(est, k), 0);
    return { impares, conexa, sePuede, longitud: largo, quedan: quedan.length };
  }

  // ---------- Estructuras de la escena ----------
  const estructuras = {
    cubo: cubos([[0, 0, 0]]),
    dosCubos: cubos([[0, 0, 0], [1, 0, 0]]),
    ele: cubos([[0, 0, 0], [1, 0, 0], [1, 1, 0]]),
    escalon: cubos([[0, 0, 0], [1, 0, 0], [0, 0, 1]]),
    torre: cubos([[0, 0, 0], [0, 0, 1]]),
    piramide: piramide({ lado: 2, altura: 2 }),
    tronco: tronco({ abajo: 4, arriba: 2, altura: 2 }),
    hexagono: hexagono({ radio: 1, diametro: true }),
    hexagonoSolo: hexagono({ radio: 1, diametro: false }),
    unidosVertice: cubos([[0, 0, 0], [1, 1, 1], [2, 1, 1]]),
    cuboArista3: cubos([[0, 0, 0]], { arista: 3 }),
  };

  return { cubos, piramide, tronco, hexagono, franja, rutasSinRepetir, dirigidas, porTramos, pasoObligado, hamiltonianos, soltarDireccion, compararRepetir,
    franjaSucesion, franjaPrediccion, helice, tarro, tangentes, tapa, maximoSinRepetir, revisarQuitar, longitud, multinomial,
    radical, exactoPi, estructuras, grados, distancias };
});
