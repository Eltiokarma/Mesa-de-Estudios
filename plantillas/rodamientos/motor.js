/*
 * Motor de «La rueda, el camino y la lámina que gira» (razonamiento matemático, transformaciones de figuras): el
 * recorrido del centro de una rueda por un camino con esquinas, escalones y arcos; las vueltas hasta que un punto
 * pintado toque el piso n veces; el recorrido de un punto de un polígono que vuelca sobre una recta o sobre otro
 * polígono; la superficie que barre una arista de un prisma que rueda; la región que barre una lámina (o uno de sus
 * lados) al girar alrededor de un vértice; láminas transparentes que giran y se superponen; giros en el plano
 * cartesiano, y un polígono que gira apoyado en sus vértices dentro de un marco.
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorRodamientos) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Convenciones:
 *   - Longitudes en una misma unidad; ángulos en grados. «Horario» es el sentido de las agujas del reloj.
 *   - Un «exacto» es un texto con π y raíces: '11 + π', '8 + 4π', '(10 + 5√2)π/3', '4 + (1 + √2)π', '18π', '7/2'.
 *     La parte sin π va primero; la parte con π, con un solo término, se escribe '3π/2', '5√2π/3', 'π'; con varios,
 *     con denominador común fuera del paréntesis: '(4 + 2√3)π/3'. Las raíces quedan sin cuadrados (√8 = 2√2).
 *   - Cada resultado que es la respuesta de una predicción trae 'errores' (lo que da cada error típico, en número),
 *     'exactos' (el texto de cada error), 'coinciden' (los errores que en ese caso dan justo la respuesta: no van en
 *     'errores') y 'repetidos' (un error que da lo mismo que otro anterior de la lista: { nombre: el anterior }).
 *
 * Funciones (argumentos entre llaves):
 *   recorridoCentro({ r, camino, cerrado, rumbo })   una rueda de radio r rueda sin resbalar apoyada en un camino. Se camina
 *                    por el camino con la rueda a la IZQUIERDA (encima, si se va hacia la derecha). camino: lista de
 *                    tramos, en orden:
 *                      { tipo: 'recta', largo }
 *                      { tipo: 'esquina', angulo, clase: 'sale' | 'entra' }   el camino dobla 'angulo' grados (el ángulo
 *                          exterior, 0 < angulo < 180). 'sale': dobla alejándose de la rueda (una esquina saliente, el
 *                          borde de un escalón que baja): el centro da un arco de radio r y ese ángulo alrededor de la
 *                          esquina. 'entra': dobla hacia la rueda (el pie de una pared): el centro corta camino; en cada
 *                          una de las dos rectas vecinas deja de recorrer r·tan(angulo/2). Una esquina que entra debe
 *                          tener rectas a los dos lados y cada recta debe alcanzar para los cortes de sus dos puntas.
 *                      { tipo: 'arco', R, angulo, lado: 'fuera' | 'dentro' }   el camino es un arco de radio R y 'angulo'
 *                          grados. 'fuera': la rueda va por el lado de afuera (una loma, el borde de un disco): su
 *                          centro va a R + r. 'dentro': por el lado de adentro (una canaleta): a R − r (r < R).
 *                    cerrado: true si el camino da la vuelta a una figura y termina donde empezó (la última esquina une
 *                    el final con el principio). Los ángulos de las esquinas que entran deben ser 30, 45, 60, 90, 120,
 *                    135 o 150 (para dar el corte exacto). Si la rueda chocara con otra parte del camino (un techo, una
 *                    pared que se inclina sobre ella), da error.
 *                    { longitud (lo que recorre el centro), exacto, vueltas (longitud / 2πr), pista (lo que mide el
 *                    camino), pistaExacto, sumaRectas, sumaArcos (lo que el centro recorre en arcos: esquinas que salen
 *                    y tramos curvos, con su radio desplazado), atajo (lo que se ahorra en las esquinas que entran),
 *                    partes (los exactos de esas tres: { sumaRectas, sumaArcos, atajo }), tramos: [{ tipo, clase y
 *                    angulo (en las esquinas), lado y R (en los arcos), largo (lo que recorre el centro en ese tramo; 0
 *                    en una esquina que entra), exacto, pista (en las rectas: lo que mide el camino), corte y
 *                    corteExacto (en una esquina que entra: lo que se ahorra entre las dos rectas, 2r·tan(angulo/2)) }],
 *                    trazo: [piezas del camino del centro: { tipo: 'linea', a: [x, y], b, largo } o
 *                    { tipo: 'arco', c: [x, y], radio, a0, a1 (radianes), largo }], piso: [piezas del camino, igual],
 *                    errores (para «¿cuánto recorre el centro?»): pista (el largo del camino), sinArcos (sin los arcos
 *                    de las esquinas que salen), sinAtajo (sin cortar en las esquinas que entran), arcoEnEntrante
 *                    (también un arco en cada esquina que entra, como si saliera), radioPista (los tramos curvos con el
 *                    radio R del camino), exactos, coinciden, repetidos }. El camino empieza en (0, 0) yendo hacia +x, o
 *                    con el rumbo dado en grados (rumbo: 90 empieza hacia arriba, como al pie de una loma).
 *   puntoEnTrazo({ trazo, s })   el punto del camino del centro tras recorrer s desde el inicio. { x, y, pieza }.
 *   toquesPiso({ r, n, falta, cuentaInicial })   una rueda de radio r con un punto P pintado en su borde rueda sobre una
 *                    recta. falta: cuántos grados debe girar la rueda para que P baje al piso (0 si empieza tocándolo;
 *                    180 si empieza arriba; si la rueda va hacia la derecha, 90 si P está adelante, a la altura del
 *                    centro, y 270 si está atrás). n: el número de toque que se pide. cuentaInicial: si P empieza en el
 *                    piso, ese toque cuenta como el primero (por defecto false). { giro (grados), vueltas, vueltasExacto,
 *                    marcas (lo que avanzó el centro en cada toque, sin el del inicio), recorrido (lo que avanza el centro), exacto, errores: vueltasN (n vueltas enteras), inicioComoToque
 *                    (n − 1 vueltas enteras), contrario (la rueda gira hacia el otro lado: falta pasa a 360 − falta),
 *                    radioDiametro (la vuelta medida como πr), exactos, coinciden, repetidos }.
 *   volcar({ figura, piso, vuelcos, punto, largo })   un polígono convexo vuelca hacia la derecha girando cada vez
 *                    sobre su vértice de apoyo de adelante (sentido horario). figura: { regular: n, lado } (n = 3, 4 o 6) o
 *                    { vertices: [[x, y], …] } en sentido antihorario con el 0 y el 1 en el piso (y = 0; el 1 a la
 *                    derecha). El vértice 0 empieza en (0, 0). En el vuelco j (j = 1, 2, …) el pivote es el vértice
 *                    j mod n. piso: 'recta' (por defecto) o { regular: m }: el polígono vuelca por fuera de un polígono
 *                    regular de m lados del mismo lado que la figura (la figura debe tener todos sus lados iguales),
 *                    apoyado al inicio en su lado de arriba. En cada vuelco gira 360° − α − β, con α el ángulo interior
 *                    de la figura en el pivote y β el del piso (180° en la recta). punto: el índice de un vértice (por
 *                    defecto 0) o [x, y] (en la posición inicial; p. ej. el centro). largo: si se da, la figura es la
 *                    cara de un prisma de ese largo y se pide la superficie que barre la arista lateral de 'punto'.
 *                    { angulos: [grados de cada vuelco], radios, radiosExactos, arcos, arcosExactos, longitud, exacto,
 *                    superficie, superficieExacto (si hay largo), posiciones: [[x, y] del punto al inicio y tras cada
 *                    vuelco], pivotes: [[x, y]], interiores: [ángulo interior de cada vértice], errores: radioLado (cada
 *                    arco con radio igual al lado que va del pivote al vértice siguiente), mismoAngulo (todos los arcos
 *                    con el ángulo del primer vuelco), anguloInterior (cada arco con el ángulo interior del pivote),
 *                    soloFigura (solo sobre un polígono: el giro de una recta, 180° − α), cuentaPivote (un arco de radio
 *                    igual al lado también cuando el punto es el pivote), avance (solo en la recta: lo que avanza el
 *                    polígono), exactos, coinciden, repetidos } (con largo, los errores son superficies).
 *   volcarEn({ figura, piso, t, punto })   la posición tras t vuelcos (t real ≥ 0; entre dos enteros, a medio girar).
 *                    { vertices: [[x, y]], punto: [x, y], pivote: [x, y] o null, piso: [[x, y]] (los vértices del
 *                    polígono del piso, si lo hay) }.
 *   barridoLamina({ figura, centro, angulo, sentido })   una lámina (polígono; vértices en sentido antihorario) gira
 *                    'angulo' grados alrededor de su vértice 'centro' (índice), en sentido 'antihorario' (por defecto)
 *                    u 'horario'. Se pide la región que barre la lámina entera. { lejano (índice del vértice más lejano
 *                    del centro), radioMayor, radioMayorExacto, perimetroFigura, perimetroFiguraExacto, arco (el que
 *                    dibuja el vértice más lejano), arcoExacto, perimetro (de la región), exacto, area, areaExacto
 *                    (solo si la lámina es convexa; si no, null), errores (del perímetro): sinArco (solo el perímetro
 *                    de la lámina), radioLado (el arco con radio igual al lado más largo), otroRadio (el arco con el
 *                    radio del segundo vértice más lejano), sector (el arco y dos radios mayores, sin la lámina),
 *                    exactos, coinciden, repetidos }. Comprueba la respuesta con perimetroUnion.
 *   barridoSegmento({ figura, centro, angulo, sentido, lado })   lo mismo, pero se pide la región que barre solo el
 *                    lado [i, j] (dos vértices consecutivos que no son el centro; el punto del lado más cercano al centro
 *                    debe ser una punta). { radioMayor, radioMenor (con sus exactos), largo (del lado), perimetro,
 *                    exacto, area, areaExacto, errores (del perímetro): radioLado (el arco de afuera con radio igual al
 *                    lado), sinArcoMenor, sinRectos (solo los dos arcos), sectorLleno (dos radios mayores y el arco de
 *                    afuera, como un sector), exactos, coinciden, repetidos }.
 *   barridoArista({ figura, vuelcos, lado })   un cubo vuelca sobre sus aristas: su cara de frente es la figura
 *                    (como en volcar, sobre una recta) y se pide la región que barre su lado [i, j] en 'vuelcos'
 *                    vuelcos. { piezas: [{ pivote, radioMayor, radioMenor, angulo }], perimetro, exacto (null si las
 *                    regiones de dos vuelcos se enciman: entonces perimetro es el número que da perimetroUnion), area
 *                    (suma de las piezas, si no se enciman), areaExacto, encimadas (true o false), errores: radioLado
 *                    (los arcos de afuera con radio igual a la arista), sinArcoMenor, sinRectos, exactos, coinciden,
 *                    repetidos }.
 *   perimetroUnion({ piezas })   el perímetro de la unión de regiones barridas, calculado punto por punto (sin fórmulas):
 *                    cada pieza es { tipo: 'poligono' | 'segmento', puntos: [[x, y], …], centro: [x, y], angulo
 *                    (grados, positivo antihorario) }. Recorre los bordes posibles (los lados al inicio y al final, los
 *                    arcos de cada vértice) y suma lo que tiene adentro a un lado y afuera al otro. { perimetro }.
 *   girarFigura({ puntos, centro, angulo })   los puntos girados 'angulo' grados (positivo antihorario) alrededor del
 *                    centro.
 *   laminas({ n, laminas, final })   láminas transparentes cuadradas de n × n casillas (n de 2 a 6) con casillas
 *                    pintadas. Casillas [columna, fila] desde la esquina de arriba a la izquierda (la fila crece hacia
 *                    abajo). Cada lámina { marcas: [[c, f], …], angulo (múltiplo de 90; puede ser mayor que 360),
 *                    sentido: 'horario' | 'antihorario' } gira alrededor de su centro; después se superponen (se ve lo
 *                    pintado en cualquiera) y el resultado gira { angulo, sentido } (final; puede faltar).
 *                    { reducidos: [{ angulo (lo que queda tras quitar las vueltas enteras, 0 a 270), sentido, horario
 *                    (el mismo giro dicho en sentido horario, 0 a 270) }], final (lo mismo para el giro final), parciales: [las marcas de cada lámina ya
 *                    girada], superpuesta (antes del giro final), resultado (las casillas pintadas al final, ordenadas),
 *                    errores: finalContrario (el giro final al revés), sinFinal (sin el giro final: «tantas vueltas la
 *                    dejan igual»), primeraContraria (la primera lámina girada al revés), todasContrarias, coinciden,
 *                    repetidos }. Cada error es una lista de casillas ordenadas.
 *   rotarPuntos({ puntos, angulo, sentido, centro, pide })   giro de puntos de coordenadas enteras en el plano
 *                    cartesiano, 'angulo' múltiplo de 90 (puede pasar de 360), sentido 'horario' | 'antihorario',
 *                    alrededor de centro (por defecto [0, 0]). pide: 'x' (suma de las abscisas nuevas), 'y' (de las
 *                    ordenadas) o 'xy' (de todas las coordenadas; por defecto). { reducido (el giro en sentido
 *                    antihorario, 0 a 270), nuevos: [[x, y]], respuesta, errores: contrario (girar al revés), origen
 *                    (girar alrededor de (0, 0) aunque el centro sea otro), intercambio (solo cambiar x por y, sin
 *                    signos), coinciden, repetidos }.
 *   girosMarco({ n, lado, ancho, alto, pasos, sentido, esquina })   un polígono regular de n lados (3, 4 o 6) y lado
 *                    'lado' está dentro de un marco rectangular de ancho × alto (esquina de abajo a la izquierda en
 *                    (0, 0)), apoyado en el lado de abajo con sus vértices 0 (A) y 1 (B) en el piso y A en (0, 0). Gira
 *                    sin resbalar sobre su vértice de apoyo de adelante (sentido 'horario', por defecto: avanza hacia
 *                    la derecha por abajo; 'antihorario': hacia el otro lado) hasta que otro vértice
 *                    toca el marco; ese vértice es el pivote del giro siguiente (si tocan dos a la vez, el que deja
 *                    seguir girando sin salirse del marco; lo mismo para el primer pivote). pasos: cuántos giros. esquina (para la
 *                    pregunta): 'abajo-izquierda', 'abajo-derecha', 'arriba-derecha' o 'arriba-izquierda'.
 *                    { angulos: [grados de cada giro], vertices: [[x, y]] (tras los pasos), pivote (índice), apoyo
 *                    ('abajo' | 'derecha' | 'arriba' | 'izquierda': el lado del marco donde descansa un lado del
 *                    polígono, o null), esquinas: { 'abajo-izquierda': letra o null, … }, giroTotal (grados
 *                    acumulados, si pasos ≤ 400), periodo (giros hasta volver a la posición inicial con cada letra en su lugar),
 *                    periodoLugar (giros hasta que la figura vuelve a ocupar el mismo lugar, sin mirar las letras),
 *                    respuesta (la letra en 'esquina', o 'ninguno'), errores: sinRotacionPropia (la letra tras
 *                    pasos mod periodoLugar giros), cicloVertices (tras pasos mod n giros), contrario (girando hacia el
 *                    otro lado), coinciden, repetidos }.
 *   marcoEn({ n, lado, ancho, alto, sentido, t })   la posición para dibujar: los vértices tras t giros (t real; entre
 *                    dos enteros, a medio girar). { vertices, pivote: [x, y] }.
 *   ex(x)            reconoce un número como exacto (racional, o racional por √2, √3, √5, √6 o √7, con o sin π) y da su
 *                    texto; null si no lo reconoce.
 *
 * Caminos y figuras de la escena (datos): motor.caminos (bloque, dosBloques, escalera, canaleta, pizza, rampa, loma,
 * dentroRectangulo: listas de tramos para recorridoCentro; pizza y dentroRectangulo son cerrados; loma va con rumbo 90) y motor.figuras (trapecio60, rectangulo, trapecioRecto, escalera3:
 * listas de vértices).
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MotorRodamientos = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const EPS = 1e-9;
  const GR = Math.PI / 180;

  // ---------- Utilidades ----------
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
    if (!o || typeof o !== 'object' || Array.isArray(o)) throw new Error(`${que} debe ser un objeto con los datos`);
    return o;
  }
  function limpio(x) {
    if (typeof x !== 'number') return x;
    for (const p of [1, 100, 1e4, 1e6]) { const y = Math.round(x * p) / p; if (Math.abs(x - y) <= 1e-10 * Math.max(1, Math.abs(x))) return y + 0; }
    return x;
  }
  const casi = (a, b, t) => Math.abs(a - b) <= (t || 1e-9) * Math.max(1, Math.abs(a), Math.abs(b));
  const clave = v => (Array.isArray(v) ? JSON.stringify(v) : v);
  const igual = (a, b) => (typeof a === 'number' && typeof b === 'number' ? casi(a, b) : clave(a) === clave(b));
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
  const mod = (a, m) => ((a % m) + m) % m;

  // ---------- Racionales y exactos ----------
  // Un racional es [num, den] con den > 0. Un exacto es { 'k,p': racional }: la suma de q·√k·π^p (k sin cuadrados).
  const Q = (n, d) => { d = d === undefined ? 1 : d; if (d < 0) { n = -n; d = -d; } const g = mcd(n, d) || 1; return [n / g, d / g]; };
  const qSuma = (a, b) => Q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
  const qPor = (a, b) => Q(a[0] * b[0], a[1] * b[1]);
  const qVal = a => a[0] / a[1];
  function aRacional(x, maxDen) {
    maxDen = maxDen || 1000;
    for (let d = 1; d <= maxDen; d++) { const n = Math.round(x * d); if (Math.abs(n / d - x) <= 1e-9 * Math.max(1, Math.abs(x))) return Q(n, d); }
    return null;
  }
  function sinCuadrados(k) {           // k = s²·m con m sin cuadrados → [s, m]
    let s = 1, m = k;
    for (let p = 2; p * p <= m; p++) while (m % (p * p) === 0) { m /= p * p; s *= p; }
    return [s, m];
  }
  const X = {
    cero: () => ({}),
    termino(q, k, pi) {                  // q·√k·π^pi
      k = k || 1; const [s, m] = sinCuadrados(k); const o = {};
      const c = qPor(q, [s, 1]); if (c[0] !== 0) o[`${m},${pi ? 1 : 0}`] = c; return o;
    },
    rac: x => { const q = Array.isArray(x) ? x : aRacional(x); if (!q) throw new Error('se esperaba un número racional'); return X.termino(q, 1, 0); },
    suma(...xs) {
      const o = {};
      for (const a of xs) for (const [kk, q] of Object.entries(a)) { o[kk] = o[kk] ? qSuma(o[kk], q) : q; if (o[kk][0] === 0) delete o[kk]; }
      return o;
    },
    porQ(a, q) { const o = {}; for (const [kk, v] of Object.entries(a)) { const c = qPor(v, q); if (c[0] !== 0) o[kk] = c; } return o; },
    porPi(a) {
      const o = {};
      for (const [kk, v] of Object.entries(a)) { const [k, p] = kk.split(',').map(Number); if (p) throw new Error('π² no se usa'); o[`${k},1`] = v; }
      return o;
    },
    porRaiz(a, k) {                      // a·√k
      let o = {};
      for (const [kk, v] of Object.entries(a)) { const [k0, p] = kk.split(',').map(Number); o = X.suma(o, X.termino(v, k0 * k, p)); }
      return o;
    },
    valor(a) { let s = 0; for (const [kk, v] of Object.entries(a)) { const [k, p] = kk.split(',').map(Number); s += qVal(v) * Math.sqrt(k) * (p ? Math.PI : 1); } return s; },
    texto(a) {
      const ts = Object.entries(a).map(([kk, q]) => { const [k, p] = kk.split(',').map(Number); return { k, p, q }; }).filter(t => t.q[0] !== 0);
      if (!ts.length) return '0';
      const sin = ts.filter(t => !t.p).sort((x, y) => x.k - y.k), con = ts.filter(t => t.p).sort((x, y) => x.k - y.k);
      const raiz = k => (k > 1 ? `√${k}` : '');
      const coef = (n, k) => (Math.abs(n) === 1 && k > 1 ? '' : String(Math.abs(n)));
      const partes = [];                 // [signo, texto]
      for (const t of sin) {
        const [n, d] = t.q;
        const cuerpo = t.k === 1 ? String(Math.abs(n)) + (d > 1 ? `/${d}` : '') : coef(n, t.k) + raiz(t.k) + (d > 1 ? `/${d}` : '');
        partes.push([n < 0 ? -1 : 1, cuerpo]);
      }
      if (con.length === 1) {
        const [n, d] = con[0].q;
        const c = Math.abs(n) === 1 ? '' : String(Math.abs(n));
        partes.push([n < 0 ? -1 : 1, c + raiz(con[0].k) + 'π' + (d > 1 ? `/${d}` : '')]);
      } else if (con.length > 1) {
        let D = 1; for (const t of con) D = D * t.q[1] / mcd(D, t.q[1]);
        const ns = con.map(t => t.q[0] * D / t.q[1]);
        const neg = ns[0] < 0, ms = neg ? ns.map(v => -v) : ns;
        const dentro = con.map((t, i) => { const v = ms[i], s = (Math.abs(v) === 1 && t.k > 1 ? '' : String(Math.abs(v))) + raiz(t.k); return i === 0 ? s : `${v < 0 ? '−' : '+'} ${s}`; }).join(' ');
        partes.push([neg ? -1 : 1, `(${dentro})π` + (D > 1 ? `/${D}` : '')]);
      }
      return partes.map(([s, t], i) => (i === 0 ? (s < 0 ? '−' : '') + t : ` ${s < 0 ? '−' : '+'} ${t}`)).join('');
    },
  };
  // la raíz cuadrada de un número racional (dado con decimales) como exacto: √(n/d) = √(n·d)/d
  function raizExacta(x2, que) {
    if (x2 < 1e-12) return X.cero();
    const q = aRacional(x2);
    if (!q) throw new Error(`${que || 'la distancia'} no tiene un cuadrado racional`);
    const [s, m] = sinCuadrados(q[0] * q[1]);
    return X.termino(Q(s, q[1]), m, 0);
  }
  // reconoce un número: q, q√k, qπ o q√kπ
  function reconocer(x) {
    for (const pi of [0, 1]) for (const k of [1, 2, 3, 5, 6, 7]) {
      const y = x / (Math.sqrt(k) * (pi ? Math.PI : 1)), q = aRacional(y, 120);
      if (q) return X.termino(q, k, pi);
    }
    return null;
  }
  function ex(x) { numero(x, 'el número'); const e = reconocer(x); return e ? X.texto(e) : null; }
  const anguloRacional = (g, que) => { const q = aRacional(g, 60); if (!q) throw new Error(`${que || 'el ángulo'} no es un número de grados racional`); return q; };
  const arcoX = (radio, gradosQ) => X.porQ(X.porPi(radio), qPor(gradosQ, [1, 180]));     // (θ/180)·π·radio
  // tan(δ/2) exacta para los ángulos de esquina que entran
  const TAN_MITAD = {
    30: X.suma(X.rac(2), X.termino([-1, 1], 3, 0)), 45: X.suma(X.termino([1, 1], 2, 0), X.rac(-1)), 60: X.termino([1, 3], 3, 0),
    90: X.rac(1), 120: X.termino([1, 1], 3, 0), 135: X.suma(X.termino([1, 1], 2, 0), X.rac(1)), 150: X.suma(X.rac(2), X.termino([1, 1], 3, 0)),
  };
  const porX = (a, b) => {               // producto de dos exactos sin π en el segundo
    let o = {};
    for (const [kb, vb] of Object.entries(b)) { const [k, p] = kb.split(',').map(Number); if (p) throw new Error('producto con π'); o = X.suma(o, X.porQ(X.porRaiz(a, k), vb)); }
    return o;
  };

  // ---------- Geometría ----------
  const rotar = (p, c, a) => { const dx = p[0] - c[0], dy = p[1] - c[1], co = Math.cos(a), si = Math.sin(a); return [c[0] + dx * co - dy * si, c[1] + dx * si + dy * co]; };
  const cero = p => p.map(x => (Math.abs(x) < 1e-11 ? 0 : x));
  const d2 = (p, q) => (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2;
  const area2 = v => { let s = 0; for (let i = 0; i < v.length; i++) { const a = v[i], b = v[(i + 1) % v.length]; s += a[0] * b[1] - a[1] * b[0]; } return s; };
  function punto2(p, que) { if (!Array.isArray(p) || p.length !== 2) throw new Error(`${que} debe ser [x, y]`); numero(p[0], `${que}[0]`); numero(p[1], `${que}[1]`); return p.slice(); }
  function girarFigura(o) {
    objeto(o, 'el giro');
    if (!Array.isArray(o.puntos)) throw new Error('puntos debe ser una lista de [x, y]');
    const c = o.centro === undefined ? [0, 0] : punto2(o.centro, 'el centro'), a = numero(o.angulo, 'el ángulo') * GR;
    return o.puntos.map((p, i) => cero(rotar(punto2(p, `puntos[${i}]`), c, a)));
  }

  // ---------- Recorrido del centro de una rueda ----------
  function recorridoCentro(o) {
    objeto(o, 'el camino');
    const r = numero(o.r, 'el radio r', { positivo: true }), rq = aRacional(r);
    if (!rq) throw new Error('el radio r debe ser racional');
    if (!Array.isArray(o.camino) || !o.camino.length) throw new Error('el camino debe ser una lista de tramos');
    const T = o.camino, N = T.length, cerrado = !!o.cerrado;
    T.forEach((t, i) => {
      objeto(t, `el tramo ${i + 1}`);
      if (t.tipo === 'recta') numero(t.largo, `el largo del tramo ${i + 1}`, { positivo: true });
      else if (t.tipo === 'esquina') {
        numero(t.angulo, `el ángulo del tramo ${i + 1}`, { positivo: true }); if (!(t.angulo < 180)) throw new Error('el ángulo de una esquina debe ser menor que 180');
        if (t.clase !== 'sale' && t.clase !== 'entra') throw new Error("una esquina es 'sale' o 'entra'");
        if (t.clase === 'entra' && !TAN_MITAD[t.angulo]) throw new Error('una esquina que entra debe medir 30, 45, 60, 90, 120, 135 o 150 grados');
      } else if (t.tipo === 'arco') {
        numero(t.R, `el radio R del tramo ${i + 1}`, { positivo: true }); numero(t.angulo, `el ángulo del tramo ${i + 1}`, { positivo: true, max: 360 });
        const lado = t.lado === undefined ? 'fuera' : t.lado;
        if (lado !== 'fuera' && lado !== 'dentro') throw new Error("un arco va 'fuera' o 'dentro'");
        if (lado === 'dentro' && !(r < t.R)) throw new Error('por dentro de un arco, r debe ser menor que R');
      } else throw new Error("cada tramo es 'recta', 'esquina' o 'arco'");
    });
    const vecino = (i, d) => { const j = i + d; if (j >= 0 && j < N) return T[j]; return cerrado ? T[mod(j, N)] : null; };
    // cortes en las rectas por las esquinas que entran
    const corteX = t => porX(X.rac(rq), TAN_MITAD[t.angulo]);
    for (let i = 0; i < N; i++) {
      const t = T[i]; if (!(t.tipo === 'esquina' && t.clase === 'entra')) continue;
      const a = vecino(i, -1), b = vecino(i, 1);
      if (!a || !b || a.tipo !== 'recta' || b.tipo !== 'recta') throw new Error('una esquina que entra debe tener una recta a cada lado');
    }
    const h0 = (o.rumbo === undefined ? 0 : numero(o.rumbo, 'el rumbo')) * GR;
    let pos = [0, 0], h = h0;
    const trazo = [], piso = [], tramos = [];
    let largoX = X.cero(), pistaX = X.cero(), rectasX = X.cero(), arcosX = X.cero(), atajoX = X.cero(), salenX = X.cero(), entranArcoX = X.cero(), radioPistaX = X.cero();
    for (let i = 0; i < N; i++) {
      const t = T[i];
      if (t.tipo === 'recta') {
        const L = t.largo, Lq = aRacional(L); if (!Lq) throw new Error('los largos deben ser racionales');
        const a = vecino(i, -1), b = vecino(i, 1);
        const c0 = a && a.tipo === 'esquina' && a.clase === 'entra' ? corteX(a) : X.cero(), c1 = b && b.tipo === 'esquina' && b.clase === 'entra' ? corteX(b) : X.cero();
        const v0 = X.valor(c0), v1 = X.valor(c1);
        if (v0 + v1 > L + 1e-9) throw new Error(`la recta ${i + 1} es muy corta: la rueda no llega a apoyarse en ella`);
        const dir = [Math.cos(h), Math.sin(h)], nor = [-Math.sin(h), Math.cos(h)], fin = [pos[0] + L * dir[0], pos[1] + L * dir[1]];
        piso.push({ tipo: 'linea', a: cero(pos), b: cero(fin), largo: L });
        const A = [pos[0] + r * nor[0] + v0 * dir[0], pos[1] + r * nor[1] + v0 * dir[1]], B = [fin[0] + r * nor[0] - v1 * dir[0], fin[1] + r * nor[1] - v1 * dir[1]];
        const lx = X.suma(X.rac(Lq), X.porQ(c0, [-1, 1]), X.porQ(c1, [-1, 1]));
        if (X.valor(lx) > 1e-12) trazo.push({ tipo: 'linea', a: cero(A), b: cero(B), largo: limpio(X.valor(lx)) });
        tramos.push({ tipo: 'recta', largo: limpio(X.valor(lx)), exacto: X.texto(lx), pista: L });
        largoX = X.suma(largoX, lx); rectasX = X.suma(rectasX, lx); pistaX = X.suma(pistaX, X.rac(Lq));
        pos = fin;
      } else if (t.tipo === 'esquina') {
        const dq = anguloRacional(t.angulo), d = t.angulo * GR;
        if (t.clase === 'sale') {
          const ax = arcoX(X.rac(rq), dq);
          trazo.push({ tipo: 'arco', c: cero(pos), radio: r, a0: h + Math.PI / 2, a1: h + Math.PI / 2 - d, largo: limpio(X.valor(ax)) });
          tramos.push({ tipo: 'esquina', clase: 'sale', angulo: t.angulo, largo: limpio(X.valor(ax)), exacto: X.texto(ax) });
          largoX = X.suma(largoX, ax); arcosX = X.suma(arcosX, ax); salenX = X.suma(salenX, ax);
          h -= d;
        } else {
          const cx = X.porQ(corteX(t), [2, 1]);
          tramos.push({ tipo: 'esquina', clase: 'entra', angulo: t.angulo, largo: 0, exacto: '0', corte: limpio(X.valor(cx)), corteExacto: X.texto(cx) });
          atajoX = X.suma(atajoX, cx); entranArcoX = X.suma(entranArcoX, arcoX(X.rac(rq), dq));
          h += d;
        }
      } else {
        const Rq = aRacional(t.R), aq = anguloRacional(t.angulo), th = t.angulo * GR, fuera = (t.lado === undefined ? 'fuera' : t.lado) === 'fuera';
        if (!Rq) throw new Error('los radios deben ser racionales');
        const C = fuera ? [pos[0] + t.R * Math.sin(h), pos[1] - t.R * Math.cos(h)] : [pos[0] - t.R * Math.sin(h), pos[1] + t.R * Math.cos(h)];
        const a0 = fuera ? h + Math.PI / 2 : h - Math.PI / 2, a1 = fuera ? a0 - th : a0 + th;
        const rc = fuera ? t.R + r : t.R - r, rcq = fuera ? qSuma(Rq, rq) : qSuma(Rq, qPor(rq, [-1, 1]));
        piso.push({ tipo: 'arco', c: cero(C), radio: t.R, a0, a1, largo: limpio(t.R * th) });
        trazo.push({ tipo: 'arco', c: cero(C), radio: rc, a0, a1, largo: limpio(rc * th) });
        const ax = arcoX(X.rac(rcq), aq);
        tramos.push({ tipo: 'arco', lado: fuera ? 'fuera' : 'dentro', R: t.R, angulo: t.angulo, largo: limpio(X.valor(ax)), exacto: X.texto(ax) });
        largoX = X.suma(largoX, ax); arcosX = X.suma(arcosX, ax); pistaX = X.suma(pistaX, arcoX(X.rac(Rq), aq));
        radioPistaX = X.suma(radioPistaX, arcoX(X.rac(Rq), aq), X.porQ(ax, [-1, 1]));
        pos = [C[0] + t.R * Math.cos(a1), C[1] + t.R * Math.sin(a1)];
        h = fuera ? h - th : h + th;
      }
    }
    if (cerrado && (d2(pos, [0, 0]) > 1e-12 || Math.abs(mod(h - h0 + Math.PI, 2 * Math.PI) - Math.PI) > 1e-9)) throw new Error('el camino cerrado no vuelve a su inicio');
    // la rueda no debe chocar con otra parte del camino: cada punto del trazo queda a r o más de todo el piso
    for (const q of trazo) for (let i = 0; i <= 40; i++) {
      const f = i / 40, P = q.tipo === 'linea' ? [q.a[0] + (q.b[0] - q.a[0]) * f, q.a[1] + (q.b[1] - q.a[1]) * f]
        : [q.c[0] + q.radio * Math.cos(q.a0 + (q.a1 - q.a0) * f), q.c[1] + q.radio * Math.sin(q.a0 + (q.a1 - q.a0) * f)];
      if (distanciaPiso(piso, P) < r - 1e-7) throw new Error('la rueda choca con otra parte del camino');
    }
    const longitud = X.valor(largoX);
    const crudosX = {
      pista: pistaX,
      sinArcos: X.suma(largoX, X.porQ(salenX, [-1, 1])),
      sinAtajo: X.suma(largoX, atajoX),
      arcoEnEntrante: X.suma(largoX, atajoX, entranArcoX),
      radioPista: X.suma(largoX, radioPistaX),
    };
    const crudos = {}; for (const [k, v] of Object.entries(crudosX)) crudos[k] = X.valor(v);
    const { errores, coinciden, repetidos } = apartar(crudos, longitud);
    const exactos = {}; for (const k of Object.keys(errores)) exactos[k] = X.texto(crudosX[k]);
    return { longitud: limpio(longitud), exacto: X.texto(largoX), vueltas: limpio(longitud / (2 * Math.PI * r)), pista: limpio(X.valor(pistaX)), pistaExacto: X.texto(pistaX),
      sumaRectas: limpio(X.valor(rectasX)), sumaArcos: limpio(X.valor(arcosX)), atajo: limpio(X.valor(atajoX)),
      partes: { sumaRectas: X.texto(rectasX), sumaArcos: X.texto(arcosX), atajo: X.texto(atajoX) },
      tramos, trazo, piso, errores, exactos, coinciden, repetidos };
  }
  function distanciaPiso(piso, p) {
    let m = Infinity;
    for (const q of piso) {
      if (q.tipo === 'linea') {
        const dx = q.b[0] - q.a[0], dy = q.b[1] - q.a[1], s = Math.max(0, Math.min(1, ((p[0] - q.a[0]) * dx + (p[1] - q.a[1]) * dy) / (dx * dx + dy * dy)));
        m = Math.min(m, Math.hypot(q.a[0] + s * dx - p[0], q.a[1] + s * dy - p[1]));
      } else {
        const ang = Math.atan2(p[1] - q.c[1], p[0] - q.c[0]), lo = Math.min(q.a0, q.a1), hi = Math.max(q.a0, q.a1);
        if (arcosSeCruzan(lo, hi, ang, ang)) m = Math.min(m, Math.abs(Math.hypot(p[0] - q.c[0], p[1] - q.c[1]) - q.radio));
        for (const a of [q.a0, q.a1]) m = Math.min(m, Math.hypot(q.c[0] + q.radio * Math.cos(a) - p[0], q.c[1] + q.radio * Math.sin(a) - p[1]));
      }
    }
    return m;
  }
  function puntoEnTrazo(o) {
    objeto(o, 'el trazo');
    if (!Array.isArray(o.trazo) || !o.trazo.length) throw new Error('trazo debe ser la lista de piezas de recorridoCentro');
    let s = Math.max(0, numero(o.s, 's'));
    for (let i = 0; i < o.trazo.length; i++) {
      const p = o.trazo[i];
      if (s <= p.largo + 1e-12 || i === o.trazo.length - 1) {
        const f = p.largo > 0 ? Math.min(1, s / p.largo) : 1;
        if (p.tipo === 'linea') return { x: p.a[0] + (p.b[0] - p.a[0]) * f, y: p.a[1] + (p.b[1] - p.a[1]) * f, pieza: i };
        const a = p.a0 + (p.a1 - p.a0) * f; return { x: p.c[0] + p.radio * Math.cos(a), y: p.c[1] + p.radio * Math.sin(a), pieza: i };
      }
      s -= p.largo;
    }
    return null;
  }

  // ---------- El punto que toca el piso ----------
  function toquesPiso(o) {
    objeto(o, 'la rueda');
    const r = numero(o.r, 'el radio r', { positivo: true }), n = numero(o.n, 'el número de toques n', { entero: true, min: 1, max: 1000 });
    const falta = numero(o.falta === undefined ? 0 : o.falta, 'falta', { noNegativo: true });
    if (!(falta < 360)) throw new Error('falta debe ser menor que 360');
    const rq = aRacional(r), fq = anguloRacional(falta, 'falta');
    if (!rq) throw new Error('el radio r debe ser racional');
    const giroDe = (f, ini) => (f === 0 ? (ini ? 360 * (n - 1) : 360 * n) : f + 360 * (n - 1));
    const giro = giroDe(falta, !!o.cuentaInicial);
    const vq = qSuma(qPor(fq, [1, 360]), [falta === 0 ? (o.cuentaInicial ? n - 1 : n) : n - 1, 1]);
    const recX = q => X.porQ(X.termino(rq, 1, 1), qPor(q, [2, 1]));      // vueltas · 2πr
    const correcto = recX(vq);
    const crudosQ = { vueltasN: [n, 1], inicioComoToque: [n - 1, 1], contrario: falta === 0 ? vq : qSuma(qPor(qSuma([360, 1], qPor(fq, [-1, 1])), [1, 360]), [n - 1, 1]) };
    const crudosX = {}; for (const [k, q] of Object.entries(crudosQ)) crudosX[k] = recX(q);
    crudosX.radioDiametro = X.porQ(correcto, [1, 2]);
    const crudos = {}; for (const [k, v] of Object.entries(crudosX)) crudos[k] = X.valor(v);
    const { errores, coinciden, repetidos } = apartar(crudos, X.valor(correcto));
    const exactos = {}; for (const k of Object.keys(errores)) exactos[k] = X.texto(crudosX[k]);
    const marcas = [];                     // lo que avanzó el centro en cada toque (sin el inicial)
    for (let k = 1; k <= n; k++) { const g = falta === 0 ? (o.cuentaInicial ? 360 * (k - 1) : 360 * k) : falta + 360 * (k - 1); if (g > 0) marcas.push(limpio(g / 360 * 2 * Math.PI * r)); }
    return { giro: limpio(giro), vueltas: limpio(qVal(vq)), vueltasExacto: vq[1] === 1 ? String(vq[0]) : `${vq[0]}/${vq[1]}`, marcas,
      recorrido: limpio(X.valor(correcto)), exacto: X.texto(correcto), errores, exactos, coinciden, repetidos };
  }

  // ---------- Polígono que vuelca ----------
  function verticesRegulares(n, l) {
    const v = [[0, 0]];
    let ang = 0;
    for (let k = 1; k < n; k++) { const p = v[k - 1]; v.push([p[0] + l * Math.cos(ang), p[1] + l * Math.sin(ang)]); ang += 2 * Math.PI / n; }
    return v.map(cero);
  }
  function leerFigura(f) {
    objeto(f, 'la figura');
    let v;
    if (f.regular !== undefined) {
      const n = numero(f.regular, 'los lados de la figura', { entero: true }), l = numero(f.lado, 'el lado de la figura', { positivo: true });
      if (![3, 4, 6].includes(n)) throw new Error('la figura regular debe tener 3, 4 o 6 lados');
      v = verticesRegulares(n, l);
    } else {
      if (!Array.isArray(f.vertices) || f.vertices.length < 3) throw new Error('la figura necesita al menos 3 vértices');
      v = f.vertices.map((p, i) => punto2(p, `el vértice ${i}`));
      const x0 = v[0][0], y0 = v[0][1]; v = v.map(p => [p[0] - x0, p[1] - y0]);
    }
    const n = v.length;
    if (Math.abs(v[1][1]) > 1e-9 || !(v[1][0] > 0)) throw new Error('el vértice 1 debe estar en el piso, a la derecha del 0');
    if (!(area2(v) > 0)) throw new Error('los vértices deben ir en sentido antihorario');
    const interiores = [];
    for (let i = 0; i < n; i++) {
      const a = v[mod(i - 1, n)], b = v[i], c = v[(i + 1) % n];
      const cr = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]);
      if (cr < -1e-9) throw new Error('la figura debe ser convexa');
      const u = [a[0] - b[0], a[1] - b[1]], w = [c[0] - b[0], c[1] - b[1]];
      const ang = Math.acos(Math.max(-1, Math.min(1, (u[0] * w[0] + u[1] * w[1]) / Math.hypot(...u) / Math.hypot(...w)))) / GR;
      interiores.push(anguloRacional(ang, `el ángulo del vértice ${i}`));
    }
    v.forEach(p => { if (p[1] < -1e-9) throw new Error('la figura debe quedar sobre el piso'); });
    return { v, n, interiores };
  }
  function leerPiso(piso, F) {
    if (piso === undefined || piso === 'recta') return { recta: true, beta: [180, 1] };
    objeto(piso, 'el piso');
    const m = numero(piso.regular, 'los lados del piso', { entero: true, min: 3, max: 12 });
    const l = Math.sqrt(d2(F.v[0], F.v[1]));
    for (let i = 0; i < F.n; i++) if (!casi(Math.sqrt(d2(F.v[i], F.v[(i + 1) % F.n])), l)) throw new Error('para volcar sobre un polígono, la figura debe tener todos sus lados iguales');
    const vs = [[0, 0], [l, 0]];
    for (let k = 2; k < m; k++) { const p = vs[k - 1], a = -2 * Math.PI * (k - 1) / m; vs.push([p[0] + l * Math.cos(a), p[1] + l * Math.sin(a)]); }
    return { recta: false, m, beta: Q(180 * (m - 2), m), vertices: vs.map(cero) };
  }
  function simVuelco(F, P, vuelcos) {
    let v = F.v.map(p => p.slice());
    const pasos = [];
    for (let j = 1; j <= vuelcos; j++) {
      const q = j % F.n, c = v[q].slice();
      const ang = qSuma([360, 1], qPor(qSuma(F.interiores[q], P.beta), [-1, 1]));
      if (!(qVal(ang) > 1e-9)) throw new Error('la figura no puede volcar: el giro no es positivo');
      pasos.push({ q, c, ang, antes: v.map(p => p.slice()) });
      v = v.map(p => rotar(p, c, -qVal(ang) * GR)); v[q] = c;
    }
    return { pasos, final: v };
  }
  function puntoFigura(F, punto) {
    if (punto === undefined) return { idx: 0, p: F.v[0] };
    if (Array.isArray(punto)) return { idx: null, p: punto2(punto, 'el punto') };
    const i = numero(punto, 'el punto', { entero: true, min: 0, max: F.n - 1 });
    return { idx: i, p: F.v[i] };
  }
  function volcar(o) {
    objeto(o, 'el vuelco');
    const F = leerFigura(o.figura), P = leerPiso(o.piso, F);
    const vuelcos = numero(o.vuelcos === undefined ? F.n : o.vuelcos, 'los vuelcos', { entero: true, min: 1, max: 60 });
    const pt = puntoFigura(F, o.punto);
    const largo = o.largo === undefined ? null : numero(o.largo, 'el largo', { positivo: true });
    const lq = largo === null ? null : aRacional(largo); if (largo !== null && !lq) throw new Error('el largo debe ser racional');
    const S = simVuelco(F, P, vuelcos);
    // el punto en coordenadas de la figura: se sigue con las mismas rotaciones
    let cur = pt.p.slice();
    const posiciones = [cero(cur)], pivotes = [], angulos = [], radios = [], radiosExactos = [], arcos = [], arcosExactos = [];
    let totalX = X.cero();
    const err = { radioLado: X.cero(), mismoAngulo: X.cero(), anguloInterior: X.cero(), soloFigura: X.cero(), cuentaPivote: X.cero() };
    let avanceX = X.cero(), pivoteVeces = 0;
    S.pasos.forEach((s, k) => {
      const q = s.q, radioX = raizExacta(d2(pt.p, F.v[q]), 'la distancia al pivote');
      const ladoSig = raizExacta(d2(F.v[q], F.v[(q + 1) % F.n]), 'un lado');
      const a = arcoX(radioX, s.ang);
      angulos.push(limpio(qVal(s.ang))); pivotes.push(cero(s.c)); radios.push(limpio(X.valor(radioX))); radiosExactos.push(X.texto(radioX));
      arcos.push(limpio(X.valor(a))); arcosExactos.push(X.texto(a));
      totalX = X.suma(totalX, a);
      const mueve = X.valor(radioX) > 1e-12;
      if (mueve) {
        err.radioLado = X.suma(err.radioLado, arcoX(ladoSig, s.ang));
        err.mismoAngulo = X.suma(err.mismoAngulo, arcoX(radioX, S.pasos[0].ang));
        err.anguloInterior = X.suma(err.anguloInterior, arcoX(radioX, F.interiores[q]));
        err.soloFigura = X.suma(err.soloFigura, arcoX(radioX, qSuma([180, 1], qPor(F.interiores[q], [-1, 1]))));
        err.cuentaPivote = X.suma(err.cuentaPivote, a);
      } else { pivoteVeces++; err.cuentaPivote = X.suma(err.cuentaPivote, arcoX(ladoSig, s.ang)); }
      avanceX = X.suma(avanceX, ladoSig);
      cur = rotar(cur, s.c, -qVal(s.ang) * GR);
      posiciones.push(cero(cur).map(limpio));
    });
    const crudosX = { radioLado: err.radioLado, mismoAngulo: err.mismoAngulo, anguloInterior: err.anguloInterior };
    if (!P.recta) crudosX.soloFigura = err.soloFigura;
    if (pivoteVeces) crudosX.cuentaPivote = err.cuentaPivote;
    if (P.recta) crudosX.avance = avanceX;
    const escala = x => (lq ? X.porQ(x, lq) : x);
    const correctoX = escala(totalX);
    const crudos = {}; for (const [k, v] of Object.entries(crudosX)) crudos[k] = X.valor(escala(v));
    const { errores, coinciden, repetidos } = apartar(crudos, X.valor(correctoX));
    const exactos = {}; for (const k of Object.keys(errores)) exactos[k] = X.texto(escala(crudosX[k]));
    const out = { angulos, radios, radiosExactos, arcos, arcosExactos, longitud: limpio(X.valor(totalX)), exacto: X.texto(totalX),
      posiciones, pivotes, interiores: F.interiores.map(limpio2), errores, exactos, coinciden, repetidos };
    if (lq) { out.superficie = limpio(X.valor(correctoX)); out.superficieExacto = X.texto(correctoX); }
    return out;
  }
  const limpio2 = q => limpio(qVal(q));
  function volcarEn(o) {
    objeto(o, 'el vuelco');
    const F = leerFigura(o.figura), P = leerPiso(o.piso, F);
    const t = numero(o.t === undefined ? 0 : o.t, 't', { noNegativo: true, max: 60 });
    const enteros = Math.floor(t + EPS), resto = t - enteros;
    const S = simVuelco(F, P, enteros + 1);
    const pt = puntoFigura(F, o.punto);
    // posición de la figura tras 'enteros' vuelcos
    let v = enteros < S.pasos.length ? S.pasos[enteros].antes : S.final;
    let cur = pt.p.slice();
    for (let j = 0; j < enteros; j++) cur = rotar(cur, S.pasos[j].c, -qVal(S.pasos[j].ang) * GR);
    let piv = null;
    if (resto > EPS) {
      const s = S.pasos[enteros], a = -qVal(s.ang) * GR * resto; piv = s.c;
      v = v.map(p => rotar(p, s.c, a)); cur = rotar(cur, s.c, a);
    }
    return { vertices: v.map(cero), punto: cero(cur), pivote: piv ? cero(piv) : null, piso: P.recta ? null : P.vertices };
  }

  // ---------- Regiones barridas ----------
  // Una pieza barrida: un polígono o un segmento que gira 'angulo' radianes (con signo) alrededor de c.
  function intervalosCirculo(c, rho, pol) {          // los arcos (en ángulo) del círculo de radio rho que quedan dentro del polígono
    const angs = [];
    for (let i = 0; i < pol.length; i++) {
      const a = pol[i], b = pol[(i + 1) % pol.length];
      const dx = b[0] - a[0], dy = b[1] - a[1], fx = a[0] - c[0], fy = a[1] - c[1];
      const A = dx * dx + dy * dy, B = 2 * (fx * dx + fy * dy), C = fx * fx + fy * fy - rho * rho, D = B * B - 4 * A * C;
      if (D < 0) continue;
      for (const s of [(-B - Math.sqrt(D)) / (2 * A), (-B + Math.sqrt(D)) / (2 * A)]) if (s >= -1e-12 && s <= 1 + 1e-12) angs.push(mod(Math.atan2(fy + s * dy, fx + s * dx), 2 * Math.PI));
    }
    angs.sort((x, y) => x - y);
    const den = p => dentroPoligono(p, pol);
    const pt = a => [c[0] + rho * Math.cos(a), c[1] + rho * Math.sin(a)];
    if (!angs.length) return den(pt(0)) ? [[0, 2 * Math.PI]] : [];
    const out = [];
    for (let i = 0; i < angs.length; i++) {
      const a0 = angs[i], a1 = i + 1 < angs.length ? angs[i + 1] : angs[0] + 2 * Math.PI;
      if (a1 - a0 < 1e-12) continue;
      if (den(pt((a0 + a1) / 2))) out.push([a0, a1]);
    }
    return out;
  }
  function dentroPoligono(p, pol) {
    let d = false;
    for (let i = 0, j = pol.length - 1; i < pol.length; j = i++) {
      const a = pol[i], b = pol[j];
      if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0]) d = !d;
    }
    return d;
  }
  const arcosSeCruzan = (a0, a1, b0, b1) => {        // dos arcos de ángulos (a0 ≤ a1, largo < 2π) se tocan
    if (a1 - a0 >= 2 * Math.PI - 1e-12 || b1 - b0 >= 2 * Math.PI - 1e-12) return true;
    const s = mod(b0 - a0, 2 * Math.PI);
    return s <= a1 - a0 + 1e-12 || s + (b1 - b0) >= 2 * Math.PI - 1e-12;
  };
  function piezaBarrida(p, i) {
    objeto(p, `la pieza ${i + 1}`);
    if (p.tipo !== 'poligono' && p.tipo !== 'segmento') throw new Error("cada pieza es 'poligono' o 'segmento'");
    if (!Array.isArray(p.puntos)) throw new Error('puntos debe ser una lista de [x, y]');
    const pts = p.puntos.map((q, k) => punto2(q, `puntos[${k}]`)), c = punto2(p.centro, 'el centro'), th = numero(p.angulo, 'el ángulo') * GR;
    if (p.tipo === 'segmento' && pts.length !== 2) throw new Error('un segmento tiene dos puntos');
    if (Math.abs(th) >= 2 * Math.PI - 1e-9) throw new Error('el giro debe ser menor que una vuelta');
    const a = th >= 0 ? -th : 0, b = th >= 0 ? 0 : -th;   // X está si X girado −t (t de 0 a th) cae en la figura: ángulos φ − th … φ
    const dentro = X0 => {
      const rho = Math.hypot(X0[0] - c[0], X0[1] - c[1]);
      if (rho < 1e-12) return p.tipo === 'poligono' ? pts.some(q => d2(q, c) < 1e-18) || dentroPoligono(c, pts) : false;
      const phi = Math.atan2(X0[1] - c[1], X0[0] - c[0]);
      if (p.tipo === 'poligono') return intervalosCirculo(c, rho, pts).some(([u, v]) => arcosSeCruzan(phi + a, phi + b, u, v));
      return false;
    };
    // curvas candidatas a borde
    const curvas = [];
    const seg = (A, B) => curvas.push({ tipo: 'linea', A, B, largo: Math.sqrt(d2(A, B)) });
    const arc = (rad, a0, a1) => { if (rad > 1e-12) curvas.push({ tipo: 'arco', c, rad, a0, a1, largo: rad * Math.abs(a1 - a0) }); };
    const fin = pts.map(q => rotar(q, c, th));
    const lados = p.tipo === 'poligono' ? pts.map((_, k) => [k, (k + 1) % pts.length]) : [[0, 1]];
    for (const [k, l] of lados) { seg(pts[k], pts[l]); seg(fin[k], fin[l]); }
    for (const q of pts) { const ang = Math.atan2(q[1] - c[1], q[0] - c[0]); arc(Math.sqrt(d2(q, c)), ang, ang + th); }
    for (const [k, l] of lados) {                     // el pie de la perpendicular, si cae dentro del lado
      const A = pts[k], B = pts[l], dx = B[0] - A[0], dy = B[1] - A[1], s = ((c[0] - A[0]) * dx + (c[1] - A[1]) * dy) / (dx * dx + dy * dy);
      if (s > 1e-9 && s < 1 - 1e-9) { const F0 = [A[0] + s * dx, A[1] + s * dy], ang = Math.atan2(F0[1] - c[1], F0[0] - c[0]); arc(Math.sqrt(d2(F0, c)), ang, ang + th); }
    }
    const pieza = { dentro, curvas };
    if (p.tipo === 'segmento') {
      // dentro de lo que barre un segmento: el círculo de radio rho corta al segmento en uno o dos puntos
      const [A, B] = pts;
      pieza.dentro = X0 => {
        const rho = Math.hypot(X0[0] - c[0], X0[1] - c[1]), phi = Math.atan2(X0[1] - c[1], X0[0] - c[0]);
        const dx = B[0] - A[0], dy = B[1] - A[1], fx = A[0] - c[0], fy = A[1] - c[1];
        const qa = dx * dx + dy * dy, qb = 2 * (fx * dx + fy * dy), qc = fx * fx + fy * fy - rho * rho, D = qb * qb - 4 * qa * qc;
        if (D < 0) return false;
        for (const s of [(-qb - Math.sqrt(D)) / (2 * qa), (-qb + Math.sqrt(D)) / (2 * qa)]) {
          if (s < -1e-12 || s > 1 + 1e-12) continue;
          const psi = Math.atan2(fy + s * dy, fx + s * dx);
          if (arcosSeCruzan(phi + a, phi + b, psi, psi)) return true;
        }
        return false;
      };
    }
    return pieza;
  }
  function perimetroUnion(o) {
    objeto(o, 'la unión');
    if (!Array.isArray(o.piezas) || !o.piezas.length) throw new Error('piezas debe ser una lista');
    const P = o.piezas.map(piezaBarrida);
    const todas = []; P.forEach(p => p.curvas.forEach(cv => todas.push(cv)));
    let escala = 0; todas.forEach(cv => { escala = Math.max(escala, cv.largo); });
    const eps = 1e-11 * Math.max(1, escala), tolC = 1e-12 * Math.max(1, escala);
    const dentro = q => P.some(p => p.dentro(q));
    const enCurva = (cv, q) => {
      if (cv.tipo === 'linea') {
        const dx = cv.B[0] - cv.A[0], dy = cv.B[1] - cv.A[1], L2 = dx * dx + dy * dy, s = ((q[0] - cv.A[0]) * dx + (q[1] - cv.A[1]) * dy) / L2;
        if (s < -1e-9 || s > 1 + 1e-9) return false;
        return Math.hypot(cv.A[0] + s * dx - q[0], cv.A[1] + s * dy - q[1]) < tolC;
      }
      if (Math.abs(Math.hypot(q[0] - cv.c[0], q[1] - cv.c[1]) - cv.rad) > tolC) return false;
      const lo = Math.min(cv.a0, cv.a1), hi = Math.max(cv.a0, cv.a1), ang = Math.atan2(q[1] - cv.c[1], q[0] - cv.c[0]);
      return arcosSeCruzan(lo - 1e-9, hi + 1e-9, ang, ang);
    };
    const en = (cv, u) => cv.tipo === 'linea' ? [cv.A[0] + (cv.B[0] - cv.A[0]) * u, cv.A[1] + (cv.B[1] - cv.A[1]) * u]
      : [cv.c[0] + cv.rad * Math.cos(cv.a0 + (cv.a1 - cv.a0) * u), cv.c[1] + cv.rad * Math.sin(cv.a0 + (cv.a1 - cv.a0) * u)];
    const normal = (cv, u) => {
      if (cv.tipo === 'linea') { const dx = cv.B[0] - cv.A[0], dy = cv.B[1] - cv.A[1], L = Math.hypot(dx, dy); return [-dy / L, dx / L]; }
      const a = cv.a0 + (cv.a1 - cv.a0) * u; return [Math.cos(a), Math.sin(a)];
    };
    let total = 0;
    todas.forEach((cv, k) => {
      if (cv.largo < 1e-12) return;
      const borde = u => {
        const m = en(cv, u), nn = normal(cv, u);
        if (dentro([m[0] + eps * nn[0], m[1] + eps * nn[1]]) === dentro([m[0] - eps * nn[0], m[1] - eps * nn[1]])) return false;
        for (let j = 0; j < k; j++) if (enCurva(todas[j], m)) return false;   // ya contado en otra curva
        return true;
      };
      const N = 240, est = [];
      for (let i = 0; i <= N; i++) est.push(borde(Math.min(1 - 1e-9, Math.max(1e-9, i / N))));
      let medida = 0;
      for (let i = 0; i < N; i++) {
        const u0 = i / N, u1 = (i + 1) / N;
        if (est[i] === est[i + 1]) { if (est[i]) medida += u1 - u0; continue; }
        let lo = u0, hi = u1;                       // el cambio está entre u0 y u1
        for (let it = 0; it < 40; it++) { const mid = (lo + hi) / 2; if (borde(mid) === est[i]) lo = mid; else hi = mid; }
        medida += est[i] ? lo - u0 : u1 - lo;
      }
      total += medida * cv.largo;
    });
    return { perimetro: limpio(total) };
  }
  function leerLamina(o) {
    if (!Array.isArray(o.figura) || o.figura.length < 3) throw new Error('la figura debe ser una lista de al menos 3 vértices [x, y]');
    const v = o.figura.map((p, i) => punto2(p, `el vértice ${i}`));
    if (!(area2(v) > 0)) throw new Error('los vértices deben ir en sentido antihorario');
    const k = numero(o.centro === undefined ? 0 : o.centro, 'el centro', { entero: true, min: 0, max: v.length - 1 });
    const ang = numero(o.angulo, 'el ángulo', { positivo: true }); if (!(ang < 360)) throw new Error('el ángulo debe ser menor que 360');
    const sentido = o.sentido === undefined ? 'antihorario' : o.sentido;
    if (sentido !== 'antihorario' && sentido !== 'horario') throw new Error("el sentido es 'horario' o 'antihorario'");
    return { v, k, O: v[k], ang, aq: anguloRacional(ang), signo: sentido === 'antihorario' ? 1 : -1 };
  }
  const perimetroX = v => { let s = X.cero(); for (let i = 0; i < v.length; i++) s = X.suma(s, raizExacta(d2(v[i], v[(i + 1) % v.length]), 'un lado')); return s; };
  function barridoLamina(o) {
    objeto(o, 'la lámina');
    const L = leerLamina(o), { v, k, O, aq } = L;
    const ds = v.map(p => d2(p, O)), max = Math.max(...ds);
    const lejos = ds.map((d, i) => (casi(d, max) ? i : -1)).filter(i => i >= 0);
    if (lejos.length !== 1) throw new Error('el vértice más lejano del centro debe ser uno solo');
    const F = lejos[0], rhoX = raizExacta(max, 'el radio mayor'), PX = perimetroX(v), arcX = arcoX(rhoX, aq);
    const totalX = X.suma(PX, arcX);
    const num = perimetroUnion({ piezas: [{ tipo: 'poligono', puntos: v, centro: O, angulo: L.signo * L.ang }] }).perimetro;
    const vale = casi(num, X.valor(totalX), 1e-3);
    // área exacta si la lámina es convexa
    let convexa = true;
    for (let i = 0; i < v.length; i++) { const a = v[i], b = v[(i + 1) % v.length], c = v[(i + 2) % v.length]; if ((b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]) < -1e-9) convexa = false; }
    let areaX = null;
    if (convexa) { const A = reconocer(area2(v) / 2); if (A) areaX = X.suma(A, X.porQ(X.termino(aRacional(max), 1, 1), qPor(aq, [1, 360]))); }
    // errores
    const lados = v.map((p, i) => d2(p, v[(i + 1) % v.length])), ladoMax = Math.max(...lados);
    const otros = ds.filter((d, i) => i !== F && i !== k && !casi(d, max)), segundo = otros.length ? Math.max(...otros) : null;
    const crudosX = {
      sinArco: PX,
      radioLado: X.suma(PX, arcoX(raizExacta(ladoMax), aq)),
      otroRadio: segundo === null ? null : X.suma(PX, arcoX(raizExacta(segundo), aq)),
      sector: X.suma(arcX, X.porQ(rhoX, [2, 1])),
    };
    const crudos = {}; for (const [kk, x] of Object.entries(crudosX)) crudos[kk] = x === null ? null : X.valor(x);
    const { errores, coinciden, repetidos } = apartar(crudos, X.valor(totalX));
    const exactos = {}; for (const kk of Object.keys(errores)) exactos[kk] = X.texto(crudosX[kk]);
    return { lejano: F, radioMayor: limpio(Math.sqrt(max)), radioMayorExacto: X.texto(rhoX), perimetroFigura: limpio(X.valor(PX)), perimetroFiguraExacto: X.texto(PX),
      arco: limpio(X.valor(arcX)), arcoExacto: X.texto(arcX), perimetro: vale ? limpio(X.valor(totalX)) : num, exacto: vale ? X.texto(totalX) : null, perimetroUnion: num,
      area: areaX ? limpio(X.valor(areaX)) : null, areaExacto: areaX ? X.texto(areaX) : null, errores, exactos, coinciden, repetidos };
  }
  function datosSegmento(O, A, B) {
    const dx = B[0] - A[0], dy = B[1] - A[1], s = ((O[0] - A[0]) * dx + (O[1] - A[1]) * dy) / (dx * dx + dy * dy);
    if (s > 1e-9 && s < 1 - 1e-9) throw new Error('el punto del lado más cercano al centro debe ser una punta');
    const da = d2(O, A), db = d2(O, B);
    return { mayor: Math.max(da, db), menor: Math.min(da, db) };
  }
  function barridoSegmento(o) {
    objeto(o, 'la lámina');
    const L = leerLamina(o), { v, k, O, aq } = L;
    if (!Array.isArray(o.lado) || o.lado.length !== 2) throw new Error('lado debe ser [i, j]');
    const [i, j] = o.lado.map(x => numero(x, 'el lado', { entero: true, min: 0, max: v.length - 1 }));
    if (!(j === (i + 1) % v.length || i === (j + 1) % v.length)) throw new Error('el lado debe unir dos vértices seguidos');
    const A = v[i], B = v[j], D = datosSegmento(O, A, B);
    const RX = raizExacta(D.mayor), rX = raizExacta(D.menor), lX = raizExacta(d2(A, B));
    const arcM = arcoX(RX, aq), arcm = arcoX(rX, aq);
    const totalX = X.suma(X.porQ(lX, [2, 1]), arcM, arcm);
    const areaX = X.porQ(X.termino(qSuma(aRacional(D.mayor), qPor(aRacional(D.menor), [-1, 1])), 1, 1), qPor(aq, [1, 360]));
    const num = perimetroUnion({ piezas: [{ tipo: 'segmento', puntos: [A, B], centro: O, angulo: L.signo * L.ang }] }).perimetro;
    const vale = casi(num, X.valor(totalX), 1e-3);
    const crudosX = {
      radioLado: X.suma(X.porQ(lX, [2, 1]), arcoX(lX, aq), arcm),
      sinArcoMenor: X.suma(X.porQ(lX, [2, 1]), arcM),
      sinRectos: X.suma(arcM, arcm),
      sectorLleno: X.suma(X.porQ(RX, [2, 1]), arcM),
    };
    const crudos = {}; for (const [kk, x] of Object.entries(crudosX)) crudos[kk] = X.valor(x);
    const { errores, coinciden, repetidos } = apartar(crudos, X.valor(totalX));
    const exactos = {}; for (const kk of Object.keys(errores)) exactos[kk] = X.texto(crudosX[kk]);
    return { radioMayor: limpio(Math.sqrt(D.mayor)), radioMayorExacto: X.texto(RX), radioMenor: limpio(Math.sqrt(D.menor)), radioMenorExacto: X.texto(rX),
      largo: limpio(X.valor(lX)), perimetro: vale ? limpio(X.valor(totalX)) : num, exacto: vale ? X.texto(totalX) : null, perimetroUnion: num,
      area: limpio(X.valor(areaX)), areaExacto: X.texto(areaX), errores, exactos, coinciden, repetidos };
  }
  function barridoArista(o) {
    objeto(o, 'el cubo');
    const F = leerFigura(o.figura), P = leerPiso('recta', F);
    const vuelcos = numero(o.vuelcos === undefined ? 1 : o.vuelcos, 'los vuelcos', { entero: true, min: 1, max: 12 });
    if (!Array.isArray(o.lado) || o.lado.length !== 2) throw new Error('lado debe ser [i, j]');
    const [i, j] = o.lado.map(x => numero(x, 'el lado', { entero: true, min: 0, max: F.n - 1 }));
    if (!(j === (i + 1) % F.n || i === (j + 1) % F.n)) throw new Error('el lado debe unir dos vértices seguidos');
    const S = simVuelco(F, P, vuelcos), lX = raizExacta(d2(F.v[i], F.v[j]));
    const piezas = [], geo = [];
    let arcosM = X.cero(), arcosm = X.cero(), areaX = X.cero(), radioLadoX = X.cero();
    S.pasos.forEach(s => {
      const A = s.antes[i], B = s.antes[j], D = datosSegmento(s.c, A, B);
      const RX = raizExacta(D.mayor), rX = raizExacta(D.menor);
      piezas.push({ pivote: cero(s.c).map(limpio), radioMayor: limpio(Math.sqrt(D.mayor)), radioMayorExacto: X.texto(RX), radioMenor: limpio(Math.sqrt(D.menor)), radioMenorExacto: X.texto(rX), angulo: limpio(qVal(s.ang)) });
      geo.push({ tipo: 'segmento', puntos: [A, B], centro: s.c, angulo: -qVal(s.ang) });
      arcosM = X.suma(arcosM, arcoX(RX, s.ang)); arcosm = X.suma(arcosm, arcoX(rX, s.ang));
      radioLadoX = X.suma(radioLadoX, arcoX(lX, s.ang));
      areaX = X.suma(areaX, X.porQ(X.termino(qSuma(aRacional(D.mayor), qPor(aRacional(D.menor), [-1, 1])), 1, 1), qPor(s.ang, [1, 360])));
    });
    const totalX = X.suma(X.porQ(lX, [2, 1]), arcosM, arcosm);
    const num = perimetroUnion({ piezas: geo }).perimetro;
    const vale = casi(num, X.valor(totalX), 1e-3);
    const crudosX = { radioLado: X.suma(X.porQ(lX, [2, 1]), radioLadoX, arcosm), sinArcoMenor: X.suma(X.porQ(lX, [2, 1]), arcosM), sinRectos: X.suma(arcosM, arcosm) };
    const crudos = {}; for (const [kk, x] of Object.entries(crudosX)) crudos[kk] = X.valor(x);
    const { errores, coinciden, repetidos } = apartar(crudos, vale ? X.valor(totalX) : num);
    const exactos = {}; for (const kk of Object.keys(errores)) exactos[kk] = X.texto(crudosX[kk]);
    return { piezas, perimetro: vale ? limpio(X.valor(totalX)) : num, exacto: vale ? X.texto(totalX) : null, encimadas: !vale,
      area: vale ? limpio(X.valor(areaX)) : null, areaExacto: vale ? X.texto(areaX) : null, errores, exactos, coinciden, repetidos };
  }

  // ---------- Láminas que giran y se superponen ----------
  const ordenar = cs => cs.map(c => c.slice()).sort((a, b) => a[1] - b[1] || a[0] - b[0]);
  const unicas = cs => { const s = new Set(), out = []; for (const c of cs) { const k = c.join(','); if (!s.has(k)) { s.add(k); out.push(c); } } return ordenar(out); };
  function giroHorario(c, n, cuartos) {      // cuartos de vuelta en sentido horario (fila hacia abajo): (c, f) → (n − 1 − f, c)
    let [x, y] = c;
    for (let k = 0; k < mod(cuartos, 4); k++) [x, y] = [n - 1 - y, x];
    return [x, y];
  }
  function leerGiro(g, que) {
    objeto(g, que);
    const a = numero(g.angulo, `el ángulo de ${que}`, { noNegativo: true });
    if (a % 90 !== 0) throw new Error(`el ángulo de ${que} debe ser múltiplo de 90`);
    const s = g.sentido === undefined ? 'horario' : g.sentido;
    if (s !== 'horario' && s !== 'antihorario') throw new Error("el sentido es 'horario' o 'antihorario'");
    const red = mod(a, 360);
    return { angulo: a, sentido: s, reducido: red, cuartosH: (s === 'horario' ? 1 : -1) * red / 90 };
  }
  function laminas(o) {
    objeto(o, 'las láminas');
    const n = numero(o.n === undefined ? 3 : o.n, 'el tamaño n', { entero: true, min: 2, max: 6 });
    if (!Array.isArray(o.laminas) || !o.laminas.length) throw new Error('laminas debe ser una lista');
    const Ls = o.laminas.map((l, i) => {
      objeto(l, `la lámina ${i + 1}`);
      if (!Array.isArray(l.marcas)) throw new Error('marcas debe ser una lista de [columna, fila]');
      const m = l.marcas.map((c, k) => { punto2(c, `marcas[${k}]`); if (!c.every(x => Number.isInteger(x) && x >= 0 && x < n)) throw new Error('cada marca debe ser una casilla de la lámina'); return c.slice(); });
      return Object.assign({ marcas: m }, leerGiro(l, `la lámina ${i + 1}`));
    });
    const fin = o.final === undefined ? { angulo: 0, sentido: 'horario', reducido: 0, cuartosH: 0 } : leerGiro(o.final, 'el giro final');
    const armar = (signos, sf) => {
      const sup = unicas([].concat(...Ls.map((l, i) => l.marcas.map(c => giroHorario(c, n, signos[i] * l.cuartosH)))));
      return { sup, res: unicas(sup.map(c => giroHorario(c, n, sf * fin.cuartosH))) };
    };
    const uno = Ls.map(() => 1);
    const ok = armar(uno, 1);
    const parciales = Ls.map(l => unicas(l.marcas.map(c => giroHorario(c, n, l.cuartosH))));
    const crudos = {
      finalContrario: armar(uno, -1).res,
      sinFinal: fin.cuartosH ? ok.sup : null,
      primeraContraria: armar(uno.map((s, i) => (i === 0 ? -1 : 1)), 1).res,
      todasContrarias: armar(uno.map(() => -1), -1).res,
    };
    const { errores, coinciden, repetidos } = apartar(crudos, ok.res);
    const red = g => ({ angulo: g.reducido, sentido: g.sentido, horario: mod(g.cuartosH * 90, 360) });
    return { reducidos: Ls.map(red), final: red(fin), parciales, superpuesta: ok.sup, resultado: ok.res, errores, coinciden, repetidos };
  }

  // ---------- Giros en el plano cartesiano ----------
  function rotarPuntos(o) {
    objeto(o, 'el giro');
    if (!Array.isArray(o.puntos) || !o.puntos.length) throw new Error('puntos debe ser una lista de [x, y]');
    const pts = o.puntos.map((p, i) => { punto2(p, `puntos[${i}]`); if (!p.every(Number.isInteger)) throw new Error('las coordenadas deben ser enteras'); return p.slice(); });
    const c = o.centro === undefined ? [0, 0] : punto2(o.centro, 'el centro');
    if (!c.every(Number.isInteger)) throw new Error('el centro debe tener coordenadas enteras');
    const g = leerGiro({ angulo: o.angulo, sentido: o.sentido }, 'el giro');
    const pide = o.pide === undefined ? 'xy' : o.pide;
    if (!['x', 'y', 'xy'].includes(pide)) throw new Error("pide es 'x', 'y' o 'xy'");
    const ah = mod(-g.cuartosH, 4);                   // cuartos antihorario
    const giro = (p, centro, k) => { let x = p[0] - centro[0], y = p[1] - centro[1]; for (let i = 0; i < mod(k, 4); i++) [x, y] = [-y, x]; return [x + centro[0] + 0, y + centro[1] + 0]; };
    const suma = ps => ps.reduce((s, p) => s + (pide === 'x' ? p[0] : pide === 'y' ? p[1] : p[0] + p[1]), 0);
    const nuevos = pts.map(p => giro(p, c, ah));
    const crudos = {
      contrario: suma(pts.map(p => giro(p, c, -ah))),
      origen: c[0] === 0 && c[1] === 0 ? null : suma(pts.map(p => giro(p, [0, 0], ah))),
      intercambio: suma(pts.map(p => [p[1] - c[1] + c[0], p[0] - c[0] + c[1]])),
    };
    const respuesta = suma(nuevos);
    const { errores, coinciden, repetidos } = apartar(crudos, respuesta);
    return { reducido: ah * 90, nuevos, respuesta, errores, coinciden, repetidos };
  }

  // ---------- Giros dentro de un marco ----------
  const ESQ = ['abajo-izquierda', 'abajo-derecha', 'arriba-derecha', 'arriba-izquierda'];
  function simMarco(n, l, W, H, pasos, s) {
    let v = verticesRegulares(n, l);
    v.forEach(p => { if (p[0] > W + 1e-9 || p[1] > H + 1e-9) throw new Error('el polígono no cabe en el marco'); });
    const adentro = w => w.every(p => p[0] > -1e-7 && p[0] < W + 1e-7 && p[1] > -1e-7 && p[1] < H + 1e-7);
    const enPared = p => Math.abs(p[0]) < 1e-9 || Math.abs(p[0] - W) < 1e-9 || Math.abs(p[1]) < 1e-9 || Math.abs(p[1] - H) < 1e-9;
    const orden = (s > 0 ? [1, 0] : [0, 1]).concat(v.map((_, i) => i).slice(2));
    let piv = orden.find(i => enPared(v[i]) && adentro(v.map(p => rotar(p, v[i], -s * 1e-3))));
    if (piv === undefined) throw new Error('el polígono no puede empezar a girar');
    const angulos = [], estados = [{ v: v.map(p => p.slice()), piv }];
    const paredes = [['x', 0], ['x', W], ['y', 0], ['y', H]];
    for (let k = 0; k < pasos; k++) {
      const P = v[piv];
      const cand = [];                                  // [giro, vértice] de cada toque posible
      v.forEach((q, i) => {
        if (i === piv) return;
        const rho = Math.sqrt(d2(q, P)), a0 = Math.atan2(q[1] - P[1], q[0] - P[0]);
        for (const [eje, val] of paredes) {
          const off = eje === 'x' ? (val - P[0]) / rho : (val - P[1]) / rho;
          if (Math.abs(off) > 1 + 1e-12) continue;
          const b = eje === 'x' ? Math.acos(Math.max(-1, Math.min(1, off))) : Math.asin(Math.max(-1, Math.min(1, off)));
          const sols = eje === 'x' ? [b, -b] : [b, Math.PI - b];
          for (const ang of sols) {
            const t = mod(s > 0 ? a0 - ang : ang - a0, 2 * Math.PI);  // giro (en el sentido del rodar) hasta esa pared
            if (t > 1e-7) cand.push([t, i]);
          }
        }
      });
      if (!cand.length) throw new Error('el polígono no puede girar dentro del marco');
      const mejor = Math.min(...cand.map(c => c[0]));
      const gg = mejor / GR, g60 = Math.round(gg * 60);
      if (Math.abs(gg - g60 / 60) > 1e-5) throw new Error('el giro no es un número de grados racional');
      const gq = Q(g60, 60);
      for (const f of [0.25, 0.5, 0.75]) if (!adentro(v.map(p => rotar(p, P, -s * qVal(gq) * GR * f)))) throw new Error('el polígono se sale del marco al girar');
      v = v.map(p => cero(rotar(p, P, -s * qVal(gq) * GR))); v[piv] = P;
      // el pivote siguiente: de los vértices que tocaron, el que deja seguir girando sin salirse
      const tocan = [...new Set(cand.filter(c => c[0] < mejor + 1e-7).map(c => c[1]))];
      const quien = tocan.find(i => adentro(v.map(p => rotar(p, v[i], -s * 1e-3))));
      if (quien === undefined) throw new Error('el polígono queda trabado en el marco');
      angulos.push(limpio(qVal(gq)));
      piv = quien;
      estados.push({ v: v.map(p => p.slice()), piv });
    }
    return { angulos, estados };
  }
  const huella = (E, letras) => (letras ? E.v.map(p => p.map(x => Math.round(x * 1e5)).join(',')).join(';') + '|' + E.piv
    : E.v.map(p => p.map(x => Math.round(x * 1e5)).join(',')).sort().join(';') + '|' + E.v[E.piv].map(x => Math.round(x * 1e5)).join(','));
  function esquinasDe(E, W, H) {
    const out = {};
    const pos = { 'abajo-izquierda': [0, 0], 'abajo-derecha': [W, 0], 'arriba-derecha': [W, H], 'arriba-izquierda': [0, H] };
    for (const e of ESQ) { const i = E.v.findIndex(p => d2(p, pos[e]) < 1e-10); out[e] = i >= 0 ? 'ABCDEF'[i] : null; }
    return out;
  }
  function apoyoDe(E, W, H) {
    const en = (f) => E.v.filter(f).length >= 2;
    if (en(p => Math.abs(p[1]) < 1e-7)) return 'abajo';
    if (en(p => Math.abs(p[0] - W) < 1e-7)) return 'derecha';
    if (en(p => Math.abs(p[1] - H) < 1e-7)) return 'arriba';
    if (en(p => Math.abs(p[0]) < 1e-7)) return 'izquierda';
    return null;
  }
  function girosMarco(o) {
    objeto(o, 'el marco');
    const n = numero(o.n === undefined ? 3 : o.n, 'los lados n', { entero: true });
    if (![3, 4, 6].includes(n)) throw new Error('el polígono debe tener 3, 4 o 6 lados');
    const l = numero(o.lado, 'el lado', { positivo: true }), W = numero(o.ancho, 'el ancho', { positivo: true }), H = numero(o.alto === undefined ? o.ancho : o.alto, 'el alto', { positivo: true });
    const pasos = numero(o.pasos === undefined ? 0 : o.pasos, 'los pasos', { entero: true, min: 0, max: 2000 });
    const sentido = o.sentido === undefined ? 'horario' : o.sentido;
    if (sentido !== 'horario' && sentido !== 'antihorario') throw new Error("el sentido es 'horario' o 'antihorario'");
    const s = sentido === 'horario' ? 1 : -1;
    const esquina = o.esquina === undefined ? 'arriba-derecha' : o.esquina;
    if (!ESQ.includes(esquina)) throw new Error('esquina no válida');
    // período: se simula hasta repetir
    const largo = simMarco(n, l, W, H, 400, s);
    const h0 = huella(largo.estados[0], true), g0 = huella(largo.estados[0], false);
    let periodo = null, periodoLugar = null;
    for (let k = 1; k < largo.estados.length; k++) {
      if (periodoLugar === null && huella(largo.estados[k], false) === g0) periodoLugar = k;
      if (periodo === null && huella(largo.estados[k], true) === h0) { periodo = k; break; }
    }
    if (periodo === null || periodoLugar === null) throw new Error('no se encontró el período en 400 giros');
    const estadoEn = (k, ss) => (ss === s ? largo.estados[k] : simMarco(n, l, W, H, k, ss).estados[k]);
    const E = estadoEn(pasos % periodo, s), Sim = simMarco(n, l, W, H, Math.min(pasos, 400), s);
    const letra = Est => { const e = esquinasDe(Est, W, H)[esquina]; return e === null ? 'ninguno' : e; };
    const respuesta = letra(E);
    const crudos = {
      sinRotacionPropia: letra(estadoEn(pasos % periodoLugar, s)),
      cicloVertices: letra(estadoEn(pasos % n, s)),
      contrario: letra(simMarco(n, l, W, H, pasos % periodo + periodo, -s).estados[pasos % periodo + periodo]),
    };
    const { errores, coinciden, repetidos } = apartar(crudos, respuesta);
    const giroTotal = Sim.angulos.reduce((a, b) => a + b, 0);
    return { angulos: Sim.angulos, vertices: E.v.map(p => p.map(limpio)), pivote: E.piv, apoyo: apoyoDe(E, W, H), esquinas: esquinasDe(E, W, H),
      giroTotal: limpio(pasos <= 400 ? giroTotal : NaN), periodo, periodoLugar, respuesta, errores, coinciden, repetidos };
  }
  // estados para dibujar: los vértices tras k giros y a medio girar
  function marcoEn(o) {
    objeto(o, 'el marco');
    const n = o.n === undefined ? 3 : o.n, s = (o.sentido || 'horario') === 'horario' ? 1 : -1;
    const W = o.ancho, H = o.alto === undefined ? o.ancho : o.alto, t = numero(o.t === undefined ? 0 : o.t, 't', { noNegativo: true, max: 400 });
    const k = Math.floor(t + EPS), f = t - k, S = simMarco(n, o.lado, W, H, k + 1, s);
    const E = S.estados[k];
    if (f <= EPS) return { vertices: E.v, pivote: E.v[E.piv] };
    const P = E.v[E.piv], a = -s * S.angulos[k] * GR * f;
    return { vertices: E.v.map(p => rotar(p, P, a)), pivote: P };
  }

  // ---------- Datos de la escena ----------
  const caminos = {
    bloque: [{ tipo: 'recta', largo: 4 }, { tipo: 'esquina', angulo: 90, clase: 'entra' }, { tipo: 'recta', largo: 2 }, { tipo: 'esquina', angulo: 90, clase: 'sale' },
      { tipo: 'recta', largo: 3 }, { tipo: 'esquina', angulo: 90, clase: 'sale' }, { tipo: 'recta', largo: 2 }, { tipo: 'esquina', angulo: 90, clase: 'entra' }, { tipo: 'recta', largo: 4 }],
    escalera: [{ tipo: 'recta', largo: 3 }, { tipo: 'esquina', angulo: 90, clase: 'sale' }, { tipo: 'recta', largo: 2 }, { tipo: 'esquina', angulo: 90, clase: 'entra' },
      { tipo: 'recta', largo: 3 }, { tipo: 'esquina', angulo: 90, clase: 'sale' }, { tipo: 'recta', largo: 2 }, { tipo: 'esquina', angulo: 90, clase: 'entra' },
      { tipo: 'recta', largo: 3 }, { tipo: 'esquina', angulo: 90, clase: 'sale' }, { tipo: 'recta', largo: 2 }, { tipo: 'esquina', angulo: 90, clase: 'entra' }, { tipo: 'recta', largo: 3 }],
    canaleta: [{ tipo: 'recta', largo: 3 }, { tipo: 'esquina', angulo: 90, clase: 'sale' }, { tipo: 'arco', R: 3, angulo: 180, lado: 'dentro' }, { tipo: 'esquina', angulo: 90, clase: 'sale' }, { tipo: 'recta', largo: 3 }],
    pizza: [{ tipo: 'recta', largo: 4 }, { tipo: 'esquina', angulo: 90, clase: 'sale' }, { tipo: 'arco', R: 4, angulo: 90, lado: 'fuera' }, { tipo: 'esquina', angulo: 90, clase: 'sale' },
      { tipo: 'recta', largo: 4 }, { tipo: 'esquina', angulo: 90, clase: 'sale' }],
    rampa: [{ tipo: 'recta', largo: 3 }, { tipo: 'esquina', angulo: 60, clase: 'entra' }, { tipo: 'recta', largo: 4 }, { tipo: 'esquina', angulo: 60, clase: 'sale' }, { tipo: 'recta', largo: 3 }],
  };
  caminos.loma = [{ tipo: 'arco', R: 3, angulo: 180, lado: 'fuera' }];            // con rumbo 90
  caminos.dentroRectangulo = [{ tipo: 'recta', largo: 8 }, { tipo: 'esquina', angulo: 90, clase: 'entra' }, { tipo: 'recta', largo: 6 }, { tipo: 'esquina', angulo: 90, clase: 'entra' },
    { tipo: 'recta', largo: 8 }, { tipo: 'esquina', angulo: 90, clase: 'entra' }, { tipo: 'recta', largo: 6 }, { tipo: 'esquina', angulo: 90, clase: 'entra' }];   // cerrado
  caminos.dosBloques = caminos.bloque.slice(0, 8).concat([{ tipo: 'recta', largo: 3 }], caminos.bloque.slice(1, 8), [{ tipo: 'recta', largo: 4 }]);
  const figuras = {
    trapecio60: [[0, 0], [4, 0], [3, Math.sqrt(3)], [1, Math.sqrt(3)]],
    rectangulo: [[0, 0], [4, 0], [4, 3], [0, 3]],
    trapecioRecto: [[0, 0], [4, 0], [2, 2], [0, 2]],
    escalera3: [[0, 0], [2, 0], [2, 2], [1, 2], [1, 1], [0, 1]],
  };

  return { caminos, figuras, recorridoCentro, puntoEnTrazo, toquesPiso, volcar, volcarEn, barridoLamina, barridoSegmento, barridoArista, perimetroUnion,
    girarFigura, laminas, rotarPuntos, girosMarco, marcoEn, ex };
});
