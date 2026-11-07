/*
 * Motor de «Fichas, banderas y ruedas» (razonamiento matemático): cuadrados mágicos de 3 × 3, números en los vértices
 * y lados de un polígono con la misma suma por lado, piezas de cuadrícula que se giran o se reflejan, ruedas y monedas
 * que ruedan sin resbalar, el recorrido de un vértice de un polígono que vuelca sobre una recta y la región que barre
 * un segmento que gira.
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorArreglos) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Convenciones:
 *   - Un cuadrado de 3 × 3 es una lista de 9 casillas por filas, de arriba abajo y de izquierda a derecha:
 *         0 1 2
 *         3 4 5        la casilla 4 es el centro; las esquinas son 0, 2, 6 y 8.
 *         6 7 8
 *     Sus 8 líneas, en este orden: filas [0,1,2] [3,4,5] [6,7,8]; columnas [0,3,6] [1,4,7] [2,5,8]; diagonales
 *     [0,4,8] y [2,4,6]. Una casilla vacía es null.
 *   - Un polígono de números tiene 'lados' lados y 'porLado' números en cada lado (contando los dos vértices). Sus
 *     n = lados · (porLado − 1) posiciones se numeran desde 0 dando la vuelta: el vértice 0, los del medio del lado 0,
 *     el vértice 1, los del medio del lado 1, …; el vértice j está en la posición j · (porLado − 1). El lado j va de la
 *     posición j · (porLado − 1) a la (j + 1) · (porLado − 1) (la última vuelve a la 0). Una distribución es la lista
 *     de los números puestos en las posiciones 0, 1, …, n − 1.
 *   - Una pieza es una lista de celdas [x, y] de una cuadrícula (x hacia la derecha, y hacia arriba). Normalizar es
 *     correrla para que la menor x y la menor y sean 0 y ordenar las celdas (por x y después por y). Girar es girar
 *     90° en sentido contrario a las agujas del reloj: (x, y) → (−y, x). Reflejar es el espejo de eje vertical:
 *     (x, y) → (−x, y). Las dos devuelven la pieza normalizada. Dos piezas son iguales si normalizadas coinciden.
 *   - Ruedas: r es el radio de la que rueda y R el de la fija; ruedan sin resbalar. Una vuelta de la rueda es un giro
 *     de 360° respecto de la mesa (una flecha pintada en ella vuelve a apuntar hacia arriba).
 *   - Polígono que vuelca: polígono regular de n lados (3, 4 o 6) y lado l, apoyado en un lado sobre una recta, con
 *     los vértices numerados desde 0 en sentido contrario a las agujas del reloj: el 0 en (0, 0), el 1 en (l, 0), el 2
 *     el siguiente hacia arriba, … Vuelca hacia la derecha: en el vuelco j (j = 1, 2, …) gira 360°/n en el sentido de
 *     las agujas del reloj alrededor del vértice que está en el suelo más a la derecha, que es el vértice j mod n.
 *   - Un «exacto» es un texto con π, raíces o fracciones simplificadas ('(2 + √2)π', '600π', '7/2', '4'). Si hay
 *     parte racional y parte con raíz y alguna es fracción, se escribe con denominador común fuera del paréntesis:
 *     (4/3 + (2/3)√3)π se da como '(4 + 2√3)π/3'; π/2 como 'π/2' y 2π/3 como '2π/3'. Los ángulos se dan en grados,
 *     salvo donde se dice radianes.
 *   - Cada resultado que es la respuesta de una predicción trae 'errores' (lo que da cada error típico), 'coinciden'
 *     (los nombres de los errores que en ese caso dan justo la respuesta correcta: no se ofrecen y no van en
 *     'errores') y 'repetidos' (un error que da lo mismo que otro anterior de la lista: { nombre: el anterior }).
 *
 * Funciones (argumentos entre llaves):
 *   lineasCuadrado()            las 8 líneas del 3 × 3, como arriba.
 *   cuadradoMagico(numeros)     numeros: 9 números distintos (por defecto 1 a 9). Busca por fuerza bruta (vuelta atrás
 *                               sobre las 9! formas de llenar las casillas) todos los cuadrados en que las 8 líneas
 *                               suman lo mismo. { numeros (de menor a mayor), total (su suma), constante (total / 3: lo
 *                               que suma cada línea), soluciones: [cuadrados], cuantas, centro (el número del centro si
 *                               es el mismo en todas las soluciones; null si no hay soluciones o si cambia), medio (el
 *                               quinto de los números ordenados), errores (para «¿qué número va al centro?»): mayor (el
 *                               mayor), menor (el menor), constante (la suma de una línea), cinco (5, como en el de
 *                               1 a 9), cualquiera ('cualquiera') }.
 *   revisarCuadrado(casillas, numeros)   lo que armó el alumno (numeros por defecto 1 a 9). { lineas: [{ tipo:
 *                               'fila' | 'columna' | 'diagonal', k (1, 2 o 3 en filas y columnas; 1 la que baja de
 *                               izquierda a derecha y 2 la otra), celdas, suma (null si falta alguna casilla), ok (la
 *                               suma es la constante; null si falta alguna) }], llenas, completo, repetido (algún número
 *                               está dos veces), ajeno (algún número no es de la lista), constante, buenas (líneas
 *                               completas que suman la constante), magico (completo, sin repetidos ni ajenos, y con las
 *                               8 líneas buenas) }.
 *   simetriasCuadrado(cuadro)   los 8 cuadrados que salen de girarlo 0°, 90°, 180° y 270° y de reflejarlo y girarlo
 *                               (sin quitar los repetidos), en este orden: 0, 1, 2 y 3 giros de 90° en el sentido de las agujas del reloj (el giro
 *                               lleva la casilla 6 a la 0, la 0 a la 2, …) y después el reflejo (espejo
 *                               de eje vertical: [2,1,0,5,4,3,8,7,6]) seguido de giros 0, 1, 2, 3.
 *   poligonoNumeros({ numeros, lados, porLado })   numeros: lados · (porLado − 1) números distintos. Prueba todas las
 *                               distribuciones (vuelta atrás) y se queda con las de igual suma en todos los lados.
 *                               { total, posiciones (n), vertices: [posiciones de los vértices], ladosPos: [[posiciones
 *                               de cada lado]], distribuciones (cuántas sirven, contando como distintas las que son
 *                               giros o reflejos de otra), distintas (cuántas, contando como una sola las que son giros
 *                               o reflejos de otra), sumas: [{ S (la suma por lado), V (la suma de los vértices),
 *                               cuantas, distintas, ejemplo (la primera distribución hallada) }] de menor a mayor S,
 *                               posibles: [los S], minimo, maximo }. Se cumple lados · S = total + V.
 *   sumaLado({ numeros, lados, porLado, extremo })   extremo: 'minimo' o 'maximo'. { respuesta (la menor o la mayor
 *                               suma por lado posible), V (suma de los vértices en ese caso), vertices: [los números de
 *                               los vértices en el ejemplo, de menor a mayor], ejemplo, cota ((total + suma de los
 *                               'lados' números más chicos (o más grandes)) / lados, lo que daría la cuenta sin mirar si
 *                               se puede), errores: unaVez (total / lados: los vértices contados una sola vez), alReves
 *                               (el otro extremo), sumaVertices (V) }.
 *   normalizar(pieza)           la pieza corrida a x, y ≥ 0 tocando los dos ejes, con las celdas ordenadas.
 *   girar(pieza, veces)         gira 'veces' · 90° en sentido contrario a las agujas del reloj (veces por defecto 1;
 *                               puede ser negativo). Devuelve la pieza normalizada.
 *   reflejar(pieza)             espejo de eje vertical, normalizada.
 *   iguales(a, b)               true si normalizadas son la misma pieza.
 *   orientaciones(pieza)        { giros (cuántas posiciones distintas salen solo girando), conReflejos (cuántas salen
 *                               girando y reflejando), quiral (su reflejo no sale con ningún giro), lista: [las 8
 *                               piezas: girar 0 a 3 veces y reflejar y girar 0 a 3 veces] }.
 *   compararPiezas(base, candidatas)   para cada candidata: 'giro' (sale de la base solo girando, sin levantarla de la
 *                               mesa), 'reflejo' (hace falta darle la vuelta: sale de reflejar y girar, pero no solo
 *                               girando) o 'distinta' (no sale de ninguna forma). Exactamente una debe ser 'giro'.
 *                               { tipos: [...], giros: [veces de 90° antihorario que llevan la base a la candidata, o
 *                               null], reflejos: [veces que hay que girar el reflejo de la base, o null], correcta
 *                               (índice de la que es giro), errores (índices): espejo (la primera 'reflejo'),
 *                               espejoGirado (la segunda 'reflejo'), otraPieza (la primera 'distinta') }.
 *   rodarRecta({ r, L })        una rueda de radio r avanza L sobre una recta. { vueltas: L / (2πr), recorridoCentro: L,
 *                               exacto (de las vueltas, si L es múltiplo racional de π·r o de r…: se da como fracción
 *                               si vueltas lo es; si no, null) }. Con 'Lpi' en vez de L, la recta mide Lpi · π.
 *   rodarCirculo({ R, r, lado, alrededor })   la rueda r da 'alrededor' vueltas (por defecto 1) alrededor de una fija R,
 *                               por fuera (lado 'fuera', por defecto) o por dentro ('dentro', con r < R). { vueltas:
 *                               alrededor · (R ± r) / r, exacto (fracción), recorridoCentro: 2π(R ± r) · alrededor,
 *                               recorridoExacto (texto con π), radioCentro (R ± r), contacto: alrededor · R / r (lo que
 *                               mide el borde que toca, dividido entre 2πr), errores: contacto (solo el borde que toca),
 *                               bordeExterior (solo por fuera: alrededor · (R + 2r) / r, el camino del punto más
 *                               alejado; por dentro, bordeExterior no se calcula y no aparece en errores),
 *                               mismoLado (0: «va pegada, no gira»), otroLado (como si rodara por el otro lado) }.
 *   rodarEn({ R, r, lado, theta })   la posición a mitad de camino: el centro de la rueda r cuando la recta que une los
 *                               centros forma un ángulo theta (radianes, desde el eje x, en sentido contrario a las
 *                               agujas del reloj) y la rueda empezó arriba (theta = π/2). { cx, cy (con la fija en
 *                               (0, 0)), phi (cuánto giró la rueda desde el inicio, en radianes, en el sentido de su
 *                               giro; siempre ≥ 0) }.
 *   rodarRectangulo({ a, b, r, enPi })   la rueda r da una vuelta por fuera de un rectángulo de a × b (con enPi, a y b
 *                               son coeficientes de π). { recorridoCentro: 2(a + b) + 2πr, enLados (vueltas mientras
 *                               rueda por los lados: 2(a + b) / (2πr)), enEsquinas (1: en las 4 esquinas gira 90° cada
 *                               vez sin avanzar por un lado), vueltas, exacto, errores: soloLados (enLados),
 *                               unaPorEsquina (enLados + 4), porDentro (enLados − 1) }.
 *   rodarRectanguloEn({ a, b, r, enPi, t })   dónde está la rueda de rodarRectangulo cuando lleva la fracción t (0 a 1)
 *                               de su recorrido. El rectángulo va de (0, 0) a (a, b); la rueda empieza arriba, apoyada en la
 *                               esquina de arriba a la izquierda (centro en (0, b + r)), y avanza en el sentido de las agujas
 *                               del reloj. { cx, cy, phi (lo que giró la rueda, en radianes y en el sentido de las agujas
 *                               del reloj: el recorrido de su centro hasta ahí, dividido entre r), tramo ('lado' o
 *                               'esquina') }.
 *   simularRodar({ r, camino, pasos })   otra forma de contar, sin usar el recorrido del centro: suma, punto de contacto
 *                               por punto de contacto, lo que gira la rueda. camino: lista de tramos { tipo: 'recta',
 *                               largo } (gira largo / r), { tipo: 'arco', R, angulo (grados que da la línea de los
 *                               centros), lado: 'fuera' | 'dentro' } (en cada pedacito la rueda gira lo que rueda
 *                               sobre el borde fijo, R·dθ / r, más (fuera) o menos (dentro) lo que gira la línea de los
 *                               centros, dθ) y { tipo: 'esquina', angulo } (la rueda pivota en el vértice ese ángulo
 *                               en grados). pasos por tramo (por defecto 720). { angulo (total, radianes), vueltas
 *                               (angulo / 2π), marcas (cuántas veces la flecha pintada volvió a apuntar arriba,
 *                               contadas pedacito a pedacito) }.
 *   volcar({ n, l, vuelcos, punto })   polígono regular de n = 3, 4 o 6 lados y lado l que vuelca 'vuelcos' veces
 *                               (por defecto n: una vuelta completa); se sigue el vértice 'punto' (por defecto 0).
 *                               { radios: [distancia del punto al pivote en cada vuelco; 0 si el punto es el pivote],
 *                               radiosExactos: ['2', '2√2', …], angulo (360/n, el de cada arco), arcos: [longitudes],
 *                               longitud (la suma), exacto (texto, p. ej. '(2 + √2)π'), coef: { a, b, c } con
 *                               longitud = (a + b√c)π, posiciones: [[x, y] del punto al inicio y después de cada
 *                               vuelco], pivotes: [[x, y]], avance (vuelcos · l, lo que avanza el polígono), errores:
 *                               sinPivote (cuenta también un arco de radio l en el vuelco en que el punto es el pivote),
 *                               todosLado (todos los arcos de radio l), angulorecto (los mismos radios con arcos de 90°),
 *                               avance (vuelcos · l, sin arcos), exactos: { el texto de cada error } }.
 *   volcarEn({ n, l, t })       las posiciones de los n vértices cuando el polígono lleva t vuelcos (t real ≥ 0; entre
 *                               dos enteros, a medio girar). { vertices: [[x, y]], pivote: [x, y] o null }.
 *   regionBarrida({ a, b, angulo })   un segmento que va de a a b del centro (0 ≤ a < b) gira 'angulo' grados (como
 *                               la plumilla de un limpiaparabrisas). { area: (angulo/360) · π(b² − a²), coefPi, exacto,
 *                               errores: sinHueco ((angulo/360) · πb²), restaRadios ((angulo/360) · π(b − a)²),
 *                               vueltaEntera (π(b² − a²)), exactos: { … } }.
 *   fraccion(x)                 { num, den, texto } (den ≤ 1000).
 *   textoPi(a, b, c)            el texto de (a + b√c)π con a y b racionales ('(2 + √2)π', '4π', 'π/2', '0'); si a o b
 *                               no son fracciones con denominador hasta 1000, el número con decimales seguido de π.
 *
 * Piezas predefinidas (motor.piezas, celdas [x, y]):
 *   bandera   [[0,0],[0,1],[0,2],[1,1],[1,2]]   un asta de 3 con una bandera de 2 arriba a la derecha (la «P»).
 *   espejo    [[0,1],[0,2],[1,0],[1,1],[1,2]]   el reflejo de la bandera (bandera arriba a la izquierda).
 *   girada    [[0,1],[1,0],[1,1],[2,0],[2,1]]   la bandera girada 3 veces 90° antihorario (90° horario).
 *   otra      [[0,0],[0,1],[0,2],[1,2],[1,3]]   otra pieza de 5 cuadraditos (la «N»): no sale ni girando ni reflejando.
 *   espejoGirado [[0,0],[0,1],[0,2],[1,0],[1,1]]   el reflejo de la bandera girado 180° (bandera abajo a la derecha).
 *   ele       [[0,0],[0,1],[0,2],[1,0]]         la «L» de 4.
 *   te        [[0,0],[1,0],[2,0],[1,1]]         la «T» de 4 (simétrica: su reflejo sale girando).
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MotorArreglos = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const EPS = 1e-9;

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
  function distintos(lista, que, cuantos) {
    if (!Array.isArray(lista)) throw new Error(`${que} debe ser una lista de números`);
    if (cuantos !== undefined && lista.length !== cuantos) throw new Error(`${que} debe tener ${cuantos} números`);
    lista.forEach((x, k) => numero(x, `${que}[${k}]`));
    for (let i = 0; i < lista.length; i++) for (let j = i + 1; j < lista.length; j++) if (casi(lista[i], lista[j])) throw new Error(`${que} no puede repetir números`);
    return lista.slice();
  }

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
  const textoNum = x => { const f = fraccion(x); return f ? f.texto : String(limpio(x)); };
  // (a + b√c)π con a, b racionales y c entero sin cuadrados (o 1)
  function textoPi(a, b, c) {
    a = a || 0; b = b || 0; c = c || 1;
    if (c === 1) { a += b; b = 0; }
    if (casi(a, 0) && casi(b, 0)) return '0';
    const fa = fraccion(a), fb = fraccion(b);
    if (!fa || !fb) return `${limpio(a + b * Math.sqrt(c))}π`;      // no es racional: se da con decimales
    if (casi(b, 0)) {
      if (fa.den === 1) return fa.num === 1 ? 'π' : fa.num === -1 ? '−π' : `${String(fa.num).replace('-', '−')}π`;
      return `${fa.num === 1 ? '' : fa.num === -1 ? '−' : String(fa.num).replace('-', '−')}π/${fa.den}`;
    }
    const raiz = (f) => (Math.abs(f.num) === 1 ? '' : String(Math.abs(f.num))) + `√${c}`;
    if (casi(a, 0)) {
      const s = (fb.num < 0 ? '−' : '') + raiz(fb);
      return fb.den === 1 ? `${s}π` : `${s}π/${fb.den}`;
    }
    // denominador común
    const D = fa.den * fb.den / mcd(fa.den, fb.den), na = fa.num * D / fa.den, nb = fb.num * D / fb.den;
    const g = mcd(mcd(na, nb), D), A = na / g, B = nb / g, Dd = D / g;
    // si A y B tienen un factor común, se saca: (4 + 2√2)π se deja así (es lo usual); solo se simplifica con el denominador
    const dentro = `${String(A).replace('-', '−')} ${B < 0 ? '−' : '+'} ${Math.abs(B) === 1 ? '' : Math.abs(B)}√${c}`;
    return Dd === 1 ? `(${dentro})π` : `(${dentro})π/${Dd}`;
  }

  // ---------- Cuadrado mágico ----------
  const LINEAS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  const TIPOS = [['fila', 1], ['fila', 2], ['fila', 3], ['columna', 1], ['columna', 2], ['columna', 3], ['diagonal', 1], ['diagonal', 2]];
  const lineasCuadrado = () => LINEAS.map(l => l.slice());
  const UNO_A_NUEVE = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  // qué líneas quedan completas al llenar la casilla k (llenando en orden 0..8)
  const CIERRAN = [[], [], [0], [], [], [1], [3, 7], [4], [2, 5, 6]];
  function cuadradoMagico(numeros) {
    const N = distintos(numeros === undefined ? UNO_A_NUEVE : numeros, 'los números', 9).sort((a, b) => a - b);
    const total = N.reduce((s, x) => s + x, 0), K = total / 3;
    const sol = [], c = new Array(9).fill(null), usado = new Array(9).fill(false);
    let probados = 0;
    (function poner(k) {
      if (k === 9) { sol.push(c.slice()); return; }
      for (let i = 0; i < 9; i++) {
        if (usado[i]) continue;
        c[k] = N[i]; usado[i] = true; probados++;
        if (CIERRAN[k].every(li => casi(c[LINEAS[li][0]] + c[LINEAS[li][1]] + c[LINEAS[li][2]], K))) poner(k + 1);
        usado[i] = false; c[k] = null;
      }
    })(0);
    const centros = [...new Set(sol.map(s => s[4]))];
    const centro = sol.length && centros.length === 1 ? centros[0] : null;
    const { errores, coinciden, repetidos } = apartar({ mayor: N[8], menor: N[0], constante: K, cinco: 5, cualquiera: 'cualquiera' }, centro);
    return { numeros: N, total: limpio(total), constante: limpio(K), soluciones: sol, cuantas: sol.length, centro, medio: N[4], probados, errores, coinciden, repetidos };
  }
  function revisarCuadrado(casillas, numeros) {
    if (!Array.isArray(casillas) || casillas.length !== 9) throw new Error('las casillas deben ser 9');
    const N = distintos(numeros === undefined ? UNO_A_NUEVE : numeros, 'los números', 9);
    const K = N.reduce((s, x) => s + x, 0) / 3;
    casillas.forEach((x, k) => { if (x !== null) numero(x, `la casilla ${k}`); });
    const llenos = casillas.filter(x => x !== null);
    const repetido = llenos.some((x, i) => llenos.some((y, j) => j > i && casi(x, y)));
    const ajeno = llenos.some(x => !N.some(y => casi(x, y)));
    const lineas = LINEAS.map((l, i) => {
      const v = l.map(k => casillas[k]), llena = v.every(x => x !== null), suma = llena ? limpio(v[0] + v[1] + v[2]) : null;
      return { tipo: TIPOS[i][0], k: TIPOS[i][1], celdas: l.slice(), suma, ok: llena ? casi(suma, K) : null };
    });
    const buenas = lineas.filter(l => l.ok === true).length, completo = llenos.length === 9;
    return { lineas, llenas: llenos.length, completo, repetido, ajeno, constante: limpio(K), buenas, magico: completo && !repetido && !ajeno && buenas === 8 };
  }
  const GIRO_C = [6, 3, 0, 7, 4, 1, 8, 5, 2];     // casilla nueva k ← casilla vieja GIRO_C[k]: giro de 90° en el sentido de las agujas del reloj
  const ESPEJO_C = [2, 1, 0, 5, 4, 3, 8, 7, 6];
  function simetriasCuadrado(cuadro) {
    if (!Array.isArray(cuadro) || cuadro.length !== 9) throw new Error('el cuadrado debe tener 9 casillas');
    const giro = q => GIRO_C.map(k => q[k]), out = [];
    let q = cuadro.slice();
    for (let i = 0; i < 4; i++) { out.push(q); q = giro(q); }
    q = ESPEJO_C.map(k => cuadro[k]);
    for (let i = 0; i < 4; i++) { out.push(q); q = giro(q); }
    return out;
  }

  // ---------- Números en un polígono ----------
  function armarPoligono(o) {
    objeto(o, 'el polígono');
    const lados = numero(o.lados === undefined ? 3 : o.lados, 'los lados', { entero: true, min: 3, max: 6 });
    const p = numero(o.porLado === undefined ? 3 : o.porLado, 'los números por lado', { entero: true, min: 2, max: 5 });
    const n = lados * (p - 1);
    const N = distintos(o.numeros === undefined ? Array.from({ length: n }, (_, k) => k + 1) : o.numeros, 'los números', n);
    const ladosPos = Array.from({ length: lados }, (_, j) => Array.from({ length: p }, (_, t) => (j * (p - 1) + t) % n));
    const vertices = Array.from({ length: lados }, (_, j) => j * (p - 1));
    return { lados, p, n, N, ladosPos, vertices };
  }
  function poligonoNumeros(o) {
    const P = armarPoligono(o), { lados, p, n, N, ladosPos, vertices } = P;
    if (n > 10) throw new Error('el polígono tiene demasiadas posiciones para probarlas todas');
    const total = N.reduce((s, x) => s + x, 0);
    const d = new Array(n).fill(null), usado = new Array(n).fill(false), grupos = new Map();
    const sumaLado = j => ladosPos[j].reduce((s, k) => s + d[k], 0);
    // el lado j (j < lados − 1) se completa al llenar la posición (j + 1)(p − 1); el último, al llenar la n − 1
    const cierra = new Array(n).fill(-1);
    for (let j = 0; j < lados - 1; j++) cierra[(j + 1) * (p - 1)] = j;
    cierra[n - 1] = cierra[n - 1] === -1 ? lados - 1 : cierra[n - 1];
    let S = null;
    (function poner(k) {
      if (k === n) {
        const V = vertices.reduce((s, v) => s + d[v], 0), clave = limpio(S);
        if (!grupos.has(clave)) grupos.set(clave, { S: clave, V: limpio(V), lista: [] });
        grupos.get(clave).lista.push(d.slice());
        return;
      }
      for (let i = 0; i < n; i++) {
        if (usado[i]) continue;
        d[k] = N[i]; usado[i] = true;
        let sigue = true;
        const j = cierra[k];
        if (j === 0) S = sumaLado(0);
        else if (j > 0) sigue = casi(sumaLado(j), S);
        if (k === n - 1 && j !== lados - 1) sigue = sigue && casi(sumaLado(lados - 1), S);
        if (sigue) poner(k + 1);
        usado[i] = false; d[k] = null;
      }
    })(0);
    // simetrías del polígono sobre las posiciones: giros de (p − 1) posiciones y reflejo
    const sims = [];
    for (let g = 0; g < lados; g++) {
      sims.push(k => (k + g * (p - 1)) % n);
      sims.push(k => ((n - k) % n + g * (p - 1)) % n);
    }
    const canon = dist => sims.map(f => { const q = new Array(n); dist.forEach((x, k) => { q[f(k)] = x; }); return q.join(','); }).sort()[0];
    const sumas = [...grupos.values()].sort((a, b) => a.S - b.S).map(g => ({
      S: g.S, V: g.V, cuantas: g.lista.length, distintas: new Set(g.lista.map(canon)).size, ejemplo: g.lista[0] }));
    const posibles = sumas.map(s => s.S);
    return { total: limpio(total), posiciones: n, vertices, ladosPos, distribuciones: sumas.reduce((s, x) => s + x.cuantas, 0),
      distintas: sumas.reduce((s, x) => s + x.distintas, 0), sumas, posibles,
      minimo: posibles.length ? posibles[0] : null, maximo: posibles.length ? posibles[posibles.length - 1] : null };
  }
  function sumaLado(o) {
    objeto(o, 'los datos');
    const ext = o.extremo === undefined ? 'minimo' : o.extremo;
    if (ext !== 'minimo' && ext !== 'maximo') throw new Error("extremo debe ser 'minimo' o 'maximo'");
    const P = armarPoligono(o), T = poligonoNumeros(o);
    if (!T.sumas.length) throw new Error('con esos números no hay ninguna distribución de igual suma por lado');
    const g = ext === 'minimo' ? T.sumas[0] : T.sumas[T.sumas.length - 1], otro = ext === 'minimo' ? T.maximo : T.minimo;
    const orden = P.N.slice().sort((a, b) => a - b), extremos = ext === 'minimo' ? orden.slice(0, P.lados) : orden.slice(-P.lados);
    const cota = limpio((T.total + extremos.reduce((s, x) => s + x, 0)) / P.lados);
    const { errores, coinciden, repetidos } = apartar({ unaVez: T.total / P.lados, alReves: otro, sumaVertices: g.V }, g.S);
    return { respuesta: g.S, V: g.V, vertices: P.vertices.map(v => g.ejemplo[v]).sort((a, b) => a - b), ejemplo: g.ejemplo, cota, errores, coinciden, repetidos };
  }

  // ---------- Piezas en la cuadrícula ----------
  function pieza(c, que) {
    if (!Array.isArray(c) || !c.length) throw new Error(`${que || 'la pieza'} debe ser una lista de celdas [x, y]`);
    c.forEach((q, k) => { if (!Array.isArray(q) || q.length !== 2) throw new Error(`la celda ${k} debe ser [x, y]`); numero(q[0], 'x', { entero: true }); numero(q[1], 'y', { entero: true }); });
    const s = new Set(c.map(q => q.join(',')));
    if (s.size !== c.length) throw new Error(`${que || 'la pieza'} repite una celda`);
    return c;
  }
  function normalizar(c) {
    pieza(c);
    const x0 = Math.min(...c.map(q => q[0])), y0 = Math.min(...c.map(q => q[1]));
    return c.map(([x, y]) => [x - x0 + 0, y - y0 + 0]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  }
  function girar(c, veces) {
    pieza(c);
    let v = veces === undefined ? 1 : numero(veces, 'las veces', { entero: true });
    v = ((v % 4) + 4) % 4;
    let q = c.map(p => p.slice());
    for (let i = 0; i < v; i++) q = q.map(([x, y]) => [-y, x]);
    return normalizar(q);
  }
  const reflejar = c => normalizar(pieza(c).map(([x, y]) => [-x, y]));
  const clave = c => normalizar(c).map(q => q.join(',')).join(';');
  const iguales = (a, b) => clave(a) === clave(b);
  function orientaciones(c) {
    const lista = [];
    for (let v = 0; v < 4; v++) lista.push(girar(c, v));
    const r = reflejar(c);
    for (let v = 0; v < 4; v++) lista.push(girar(r, v));
    const g = new Set(lista.slice(0, 4).map(clave)), t = new Set(lista.map(clave));
    return { giros: g.size, conReflejos: t.size, quiral: !g.has(clave(r)), lista };
  }
  function compararPiezas(base, cands) {
    pieza(base, 'la base');
    if (!Array.isArray(cands) || cands.length < 2) throw new Error('hacen falta al menos dos candidatas');
    const r = reflejar(base);
    const giros = cands.map(c => { pieza(c, 'la candidata'); for (let v = 0; v < 4; v++) if (iguales(girar(base, v), c)) return v; return null; });
    const reflejos = cands.map((c, k) => { if (giros[k] !== null) return null; for (let v = 0; v < 4; v++) if (iguales(girar(r, v), c)) return v; return null; });
    const tipos = cands.map((_, k) => giros[k] !== null ? 'giro' : reflejos[k] !== null ? 'reflejo' : 'distinta');
    const g = tipos.map((t, k) => t === 'giro' ? k : -1).filter(k => k >= 0);
    if (g.length !== 1) throw new Error('exactamente una candidata debe salir solo girando');
    const refl = tipos.map((t, k) => t === 'reflejo' ? k : -1).filter(k => k >= 0), dist = tipos.map((t, k) => t === 'distinta' ? k : -1).filter(k => k >= 0);
    const { errores, coinciden, repetidos } = apartar({ espejo: refl.length ? refl[0] : null, espejoGirado: refl.length > 1 ? refl[1] : null, otraPieza: dist.length ? dist[0] : null }, g[0]);
    return { tipos, giros, reflejos, correcta: g[0], errores, coinciden, repetidos };
  }

  // ---------- Ruedas ----------
  function rodarRecta(o) {
    objeto(o, 'la rueda');
    const r = numero(o.r, 'el radio r', { positivo: true });
    const conPi = o.Lpi !== undefined;
    const L = conPi ? numero(o.Lpi, 'Lpi', { positivo: true }) * Math.PI : numero(o.L, 'el largo L', { positivo: true });
    const vueltas = L / (2 * Math.PI * r);
    const f = conPi ? fraccion(o.Lpi / (2 * r)) : null;
    return { vueltas: limpio(vueltas), recorridoCentro: limpio(L), exacto: f ? f.texto : null };
  }
  function datosCirculo(o) {
    objeto(o, 'las ruedas');
    const R = numero(o.R, 'el radio R', { positivo: true }), r = numero(o.r, 'el radio r', { positivo: true });
    const lado = o.lado === undefined ? 'fuera' : o.lado;
    if (lado !== 'fuera' && lado !== 'dentro') throw new Error("lado debe ser 'fuera' o 'dentro'");
    if (lado === 'dentro' && !(r < R)) throw new Error('por dentro, r debe ser menor que R');
    return { R, r, lado, s: lado === 'fuera' ? 1 : -1 };
  }
  function rodarCirculo(o) {
    const { R, r, lado, s } = datosCirculo(o);
    const m = o.alrededor === undefined ? 1 : numero(o.alrededor, 'las vueltas alrededor', { positivo: true });
    const rc = R + s * r, vueltas = m * rc / r, f = fraccion(vueltas);
    const crudos = { contacto: m * R / r, bordeExterior: lado === 'fuera' ? m * (R + 2 * r) / r : null, mismoLado: 0, otroLado: m * (R - s * r) / r };
    const { errores, coinciden, repetidos } = apartar(crudos, vueltas);
    return { vueltas: limpio(vueltas), exacto: f ? f.texto : null, recorridoCentro: limpio(2 * Math.PI * rc * m), recorridoExacto: textoPi(2 * rc * m),
      radioCentro: limpio(rc), contacto: limpio(m * R / r), errores, coinciden, repetidos };
  }
  function rodarEn(o) {
    const { R, r, s } = datosCirculo(o);
    const th = numero(o.theta, 'theta');
    const rc = R + s * r, avance = Math.PI / 2 - th;          // cuánto avanzó la línea de los centros (sentido horario)
    return { cx: rc * Math.cos(th), cy: rc * Math.sin(th), phi: avance * rc / r };
  }
  function rodarRectangulo(o) {
    objeto(o, 'el rectángulo');
    const r = numero(o.r, 'el radio r', { positivo: true }), a = numero(o.a, 'el lado a', { positivo: true }), b = numero(o.b, 'el lado b', { positivo: true });
    const k = o.enPi ? Math.PI : 1, per = 2 * (a + b) * k;
    const enLados = per / (2 * Math.PI * r), vueltas = enLados + 1, f = fraccion(vueltas);
    const { errores, coinciden, repetidos } = apartar({ soloLados: enLados, unaPorEsquina: enLados + 4, porDentro: enLados - 1 }, vueltas);
    return { recorridoCentro: limpio(per + 2 * Math.PI * r), enLados: limpio(enLados), enEsquinas: 1, vueltas: limpio(vueltas), exacto: f ? f.texto : null, errores, coinciden, repetidos };
  }
  function rodarRectanguloEn(o) {
    objeto(o, 'el rectángulo');
    const r = numero(o.r, 'el radio r', { positivo: true }), k = o.enPi ? Math.PI : 1;
    const a = numero(o.a, 'el lado a', { positivo: true }) * k, b = numero(o.b, 'el lado b', { positivo: true }) * k;
    const t = numero(o.t === undefined ? 0 : o.t, 't', { min: 0, max: 1 });
    const q = Math.PI * r / 2, tramos = [
      ['lado', a, u => [u, b + r]], ['esquina', q, u => [a + r * Math.cos(Math.PI / 2 - u / r), b + r * Math.sin(Math.PI / 2 - u / r)]],
      ['lado', b, u => [a + r, b - u]], ['esquina', q, u => [a + r * Math.cos(-u / r), r * Math.sin(-u / r)]],
      ['lado', a, u => [a - u, -r]], ['esquina', q, u => [r * Math.cos(-Math.PI / 2 - u / r), r * Math.sin(-Math.PI / 2 - u / r)]],
      ['lado', b, u => [-r, u]], ['esquina', q, u => [r * Math.cos(Math.PI - u / r), b + r * Math.sin(Math.PI - u / r)]],
    ];
    const total = tramos.reduce((s, x) => s + x[1], 0);
    let s = t * total;
    for (const [tipo, largo, f] of tramos) {
      if (s <= largo + 1e-12) { const [cx, cy] = f(Math.min(s, largo)); return { cx, cy, phi: t * total / r, tramo: tipo }; }
      s -= largo;
    }
    const [cx, cy] = tramos[7][2](q);
    return { cx, cy, phi: total / r, tramo: 'esquina' };
  }
  function simularRodar(o) {
    objeto(o, 'la simulación');
    const r = numero(o.r, 'el radio r', { positivo: true });
    const pasos = o.pasos === undefined ? 720 : numero(o.pasos, 'los pasos', { entero: true, min: 1 });
    if (!Array.isArray(o.camino) || !o.camino.length) throw new Error('el camino debe ser una lista de tramos');
    let phi = 0, marcas = 0;
    const dar = d => { const antes = Math.floor(phi / (2 * Math.PI) + EPS); phi += d; const ahora = Math.floor(phi / (2 * Math.PI) + EPS); marcas += ahora - antes; };
    for (const t of o.camino) {
      objeto(t, 'el tramo');
      if (t.tipo === 'recta') { const L = numero(t.largo, 'el largo', { noNegativo: true }); for (let i = 0; i < pasos; i++) dar(L / pasos / r); }
      else if (t.tipo === 'esquina') { const A = numero(t.angulo, 'el ángulo', { noNegativo: true }) * Math.PI / 180; for (let i = 0; i < pasos; i++) dar(A / pasos); }
      else if (t.tipo === 'arco') {
        const R = numero(t.R, 'el radio R', { positivo: true }), A = numero(t.angulo, 'el ángulo', { noNegativo: true }) * Math.PI / 180;
        const fuera = (t.lado === undefined ? 'fuera' : t.lado) === 'fuera';
        if (!fuera && !(r < R)) throw new Error('por dentro, r debe ser menor que R');
        const dth = A / pasos;
        for (let i = 0; i < pasos; i++) { const rueda = R * dth / r; dar(fuera ? rueda + dth : rueda - dth); }
      } else throw new Error("cada tramo es 'recta', 'arco' o 'esquina'");
    }
    return { angulo: phi, vueltas: limpio(phi / (2 * Math.PI)), marcas };
  }

  // ---------- Polígono que vuelca ----------
  // cuerdas de un polígono regular de lado 1: la distancia entre vértices separados k lugares, como a + b√c
  const CUERDAS = {
    3: { c: 1, k: [[0, 0], [1, 0], [1, 0]] },
    4: { c: 2, k: [[0, 0], [1, 0], [0, 1], [1, 0]] },
    6: { c: 3, k: [[0, 0], [1, 0], [0, 1], [2, 0], [0, 1], [1, 0]] },
  };
  function datosVuelco(o) {
    objeto(o, 'el polígono');
    const n = numero(o.n === undefined ? 4 : o.n, 'los lados n', { entero: true });
    if (!CUERDAS[n]) throw new Error('el polígono debe tener 3, 4 o 6 lados');
    const l = numero(o.l, 'el lado l', { positivo: true });
    return { n, l };
  }
  function verticesIniciales(n, l) {
    const v = [[0, 0]];
    let ang = 0;
    for (let k = 1; k < n; k++) { const p = v[k - 1]; v.push([p[0] + l * Math.cos(ang), p[1] + l * Math.sin(ang)]); ang += 2 * Math.PI / n; }
    return v;
  }
  const rotar = (p, c, a) => { const dx = p[0] - c[0], dy = p[1] - c[1], co = Math.cos(a), si = Math.sin(a); return [c[0] + dx * co - dy * si, c[1] + dx * si + dy * co]; };
  function volcarEn(o) {
    const { n, l } = datosVuelco(o);
    const t = numero(o.t === undefined ? 0 : o.t, 't', { noNegativo: true });
    let v = verticesIniciales(n, l), piv = null;
    const enteros = Math.floor(t + EPS), resto = t - enteros, a = -2 * Math.PI / n;
    for (let j = 1; j <= enteros; j++) { const c = v[j % n].slice(); v = v.map(p => rotar(p, c, a)); v[j % n] = c; }
    if (resto > EPS) { piv = v[(enteros + 1) % n].slice(); v = v.map(p => rotar(p, piv, a * resto)); }
    const cero = p => p.map(x => (Math.abs(x) < 1e-12 ? 0 : x));
    return { vertices: v.map(cero), pivote: piv ? cero(piv) : null };
  }
  function volcar(o) {
    const { n, l } = datosVuelco(o);
    const vuelcos = numero(o.vuelcos === undefined ? n : o.vuelcos, 'los vuelcos', { entero: true, min: 1, max: 60 });
    const P = numero(o.punto === undefined ? 0 : o.punto, 'el punto', { entero: true, min: 0, max: n - 1 });
    const C = CUERDAS[n], ang = 360 / n, f = ang / 180;          // cada arco mide f·π·radio
    let v = verticesIniciales(n, l);
    const posiciones = [v[P].slice()], pivotes = [], radios = [], radiosExactos = [], arcos = [];
    let A = 0, B = 0;                                             // la suma de radios es (A + B√c)·l
    for (let j = 1; j <= vuelcos; j++) {
      const q = j % n, c = v[q].slice();
      const dist = Math.hypot(v[P][0] - c[0], v[P][1] - c[1]);
      const k = ((P - q) % n + n) % n, [ca, cb] = C.k[k];
      A += ca; B += cb;
      radios.push(limpio(dist)); arcos.push(limpio(f * Math.PI * dist));
      radiosExactos.push(textoRadical(ca * l, cb * l, C.c));
      v = v.map(p => rotar(p, c, -2 * Math.PI / n)); v[q] = c;
      pivotes.push(c.map(x => limpio(x))); posiciones.push(v[P].map(x => limpio(Math.abs(x) < 1e-12 ? 0 : x)));
    }
    const a = f * A * l, b = f * B * l, longitud = (a + b * Math.sqrt(C.c)) * Math.PI;
    const pivoteVeces = radios.filter(x => casi(x, 0)).length;
    const crudos = {
      sinPivote: longitud + pivoteVeces * f * Math.PI * l,
      todosLado: vuelcos * f * Math.PI * l,
      angulorecto: (A + B * Math.sqrt(C.c)) * l * Math.PI / 2,
      avance: vuelcos * l,
    };
    const txt = { sinPivote: textoPi(a + pivoteVeces * f * l, b, C.c), todosLado: textoPi(vuelcos * f * l), angulorecto: textoPi(A * l / 2, B * l / 2, C.c), avance: textoNum(vuelcos * l) };
    const { errores, coinciden, repetidos } = apartar(crudos, longitud);
    const exactos = {}; for (const k of Object.keys(errores)) exactos[k] = txt[k];
    return { radios, radiosExactos, angulo: limpio(ang), arcos, longitud: limpio(longitud), exacto: textoPi(a, b, C.c), coef: { a: limpio(a), b: limpio(b), c: C.c },
      posiciones, pivotes, avance: limpio(vuelcos * l), errores, exactos, coinciden, repetidos };
  }
  function textoRadical(a, b, c) {
    if (casi(b, 0) || c === 1) return textoNum(a + (c === 1 ? b : 0));
    const rb = casi(b, 1) ? '' : textoNum(b);
    if (casi(a, 0)) return `${rb}√${c}`;
    return `${textoNum(a)} + ${rb}√${c}`;
  }

  // ---------- Región barrida ----------
  function regionBarrida(o) {
    objeto(o, 'el segmento');
    const a = numero(o.a, 'a', { noNegativo: true }), b = numero(o.b, 'b', { positivo: true }), ang = numero(o.angulo, 'el ángulo', { positivo: true, max: 360 });
    if (!(a < b)) throw new Error('a debe ser menor que b');
    const f = ang / 360, coef = f * (b * b - a * a);
    const crudos = { sinHueco: f * b * b, restaRadios: f * (b - a) * (b - a), vueltaEntera: b * b - a * a };
    const { errores: e, coinciden, repetidos } = apartar(crudos, coef);
    const errores = {}, exactos = {};
    for (const [k, v] of Object.entries(e)) { errores[k] = limpio(v * Math.PI); exactos[k] = textoPi(v); }
    return { area: limpio(coef * Math.PI), coefPi: limpio(coef), exacto: textoPi(coef), errores, exactos, coinciden, repetidos };
  }

  // ---------- Piezas de la escena (datos) ----------
  const piezas = {
    bandera: [[0, 0], [0, 1], [0, 2], [1, 1], [1, 2]],
    espejo: [[0, 1], [0, 2], [1, 0], [1, 1], [1, 2]],
    girada: [[0, 1], [1, 0], [1, 1], [2, 0], [2, 1]],
    otra: [[0, 0], [0, 1], [0, 2], [1, 2], [1, 3]],
    espejoGirado: [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1]],
    ele: [[0, 0], [0, 1], [0, 2], [1, 0]],
    te: [[0, 0], [1, 0], [2, 0], [1, 1]],
  };

  return { piezas, lineasCuadrado, cuadradoMagico, revisarCuadrado, simetriasCuadrado, poligonoNumeros, sumaLado,
    normalizar, girar, reflejar, iguales, orientaciones, compararPiezas,
    rodarRecta, rodarCirculo, rodarEn, rodarRectangulo, rodarRectanguloEn, simularRodar, volcar, volcarEn, regionBarrida, fraccion, textoPi };
});
