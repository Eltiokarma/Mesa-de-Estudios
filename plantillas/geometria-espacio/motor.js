/*
 * Motor de «El cubo que gira»: rectas y planos en el espacio (unidad geometria.geometria-del-espacio).
 *
 * Aquí vive toda la geometría de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorEspacio) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * CONVENCIONES
 *   - Puntos y vectores: listas [x, y, z]. El eje x va a la derecha, y hacia el fondo, z hacia arriba.
 *     El piso (el plano P) es z = 0.
 *   - El cubo de arista a (notación de academia ABCD-EFGH): A(0,0,0), B(a,0,0), C(a,a,0), D(0,a,0) en el piso,
 *     y E, F, G, H encima de A, B, C, D (E(0,0,a), F(a,0,a), G(a,a,a), H(0,a,a)). Una recta del cubo se nombra con
 *     dos letras ('AG', 'BF'); un punto, con una ('E').
 *   - Ángulos en GRADOS. El ángulo entre dos rectas va de 0 a 90; el ángulo de un vértice (entre dos rayos), de 0 a 180;
 *     el ángulo entre recta y plano, de 0 a 90; el diedro, de 0 a 180.
 *   - Las distancias salen en las unidades del problema (u); el motor no convierte.
 *   - Lo que es entero salvo un error de coma flotante se devuelve entero (√36 = 6, no 5,999…).
 *   - Cada función que es la respuesta de una predicción trae 'respuestas' (lo correcto), 'errores' (lo que da cada
 *     idea errónea, agrupado con la misma clave que 'respuestas') y 'coinciden' (los errores que con esos datos dan lo
 *     mismo que la respuesta: se apartan para que la escena no ofrezca dos opciones iguales). Las ideas erróneas de este
 *     tema están revisadas en docs/investigacion/matematica-avanzada-ideas-erroneas.md: son hipótesis nuestras, salvo
 *     anguloEnVertice.angulo.recto (90° en el ángulo AFH del cubo), que es parcial por Kondo y otros (2013, 2014); 'dibujo'
 *     (leer el ángulo del dibujo en perspectiva) se emparenta con GE13 y GE7–GE10 (leer las propiedades del dibujo).
 *
 * CÁMARA (la misma que dibuja la escena; sirve para calcular el ángulo «que se ve» en el dibujo)
 *   vista(az, el)                 ejes de la pantalla { u, up, v }: el que mira está del lado de y negativo, girado az
 *                                 grados hacia x positivo y elevado el grados; u va a la derecha, up hacia arriba,
 *                                 v hacia el que mira. VISTA0 = { az: 28, el: 22 } es la vista con que abre la escena.
 *   proyectar(p, V)               [X, Y] en la pantalla (sin escala; Y hacia arriba)
 *   anguloEnDibujo(O, P, Q, V)    el ángulo POQ tal como se ve en el dibujo (rayos, 0 a 180)
 *   anguloRectasEnDibujo(d1, d2, V)  el ángulo entre dos direcciones como se ve en el dibujo (rectas, 0 a 90)
 *
 * GEOMETRÍA GENERAL
 *   cubo(a)                       { a, vertices: { A..H }, aristas: [['A','B'], …] (12), caras: [{ nombre, vertices, normal }] (6) }
 *   puntoCubo(a, letra)           las coordenadas de un vértice
 *   anguloRectas(u, w)            ángulo entre dos direcciones como rectas (0 a 90)
 *   anguloVectores(u, w)          ángulo entre dos vectores (0 a 180)
 *   anguloRectaPlano(d, n)        ángulo entre la recta de dirección d y el plano de normal n (0 a 90)
 *   proyeccionPunto(p, Q, n)      pie de la perpendicular desde p al plano que pasa por Q con normal n
 *   distanciaPuntoRecta(p, A, d)  { distancia, pie }: de p a la recta que pasa por A con dirección d
 *   distanciaPuntoPlano(p, Q, n)  distancia (sin signo)
 *   posicionRectas(P1, d1, P2, d2)  { tipo: 'coincidentes' | 'paralelas' | 'secantes' | 'cruzadas', angulo, distancia,
 *                                 pies: [X1, X2] } (X1 en la 1.ª, X2 en la 2.ª: la perpendicular común; null si son paralelas)
 *   rectasCubo(a, r1, r2)         lo mismo con rectas del cubo nombradas por letras
 *   diedro(A, B, C, D)            ángulo diedro de arista AB entre el semiplano que contiene a C y el que contiene a D:
 *                                 { diedro, pieC, pieD, perpC, perpD } (perpC y perpD: las rectas perpendiculares a la
 *                                 arista que lo miden, desde el pie en la arista hacia C y hacia D) y la predicción:
 *                                 respuestas.diedro; errores.diedro = { oblicuas: ángulo CAD medido con las rectas AC y AD,
 *                                 que no son perpendiculares a la arista; unaOblicua: entre AC y la perpendicular hacia D;
 *                                 recto: 90 (se toma todo plano que sube como pared) }
 *   marcaRecta(o, p, q, s)        los tres puntos de la marca de ángulo recto en o (lado s), entre los rayos o→p y o→q
 *   arco(o, p, q, r, n)           n + 1 puntos del arco de radio r alrededor de o, del rayo o→p al rayo o→q
 *   radical(x)                    [k, m] con x = k·√m (m libre de cuadrados) si x² es casi entero; si no, null
 *
 * PREDICCIONES (con respuestas, errores y coinciden)
 *   varilla({ incl, dir, largo, O, M, vista })
 *       Una varilla OQ clavada en el piso en O (por defecto [0,0,0]), de largo 'largo' (por defecto 1), inclinada incl
 *       grados sobre el piso (0 < incl ≤ 90) y con su sombra hacia el azimut dir (grados desde el eje x, en el piso).
 *       Da la punta Q, la sombra (proyección) y su largo, la altura de Q, el ángulo con el piso (= incl) y las rectas del
 *       piso por O a las que es perpendicular: 'perpendicularA' es 'todas' si incl = 90 y, si no, la única dirección
 *       (dir + 90) mod 180 (en [0, 180)). respuestas.cuantas = 1 o 'todas' (con cuántas rectas del piso que pasan por O
 *       forma 90°); errores.cuantas = { ninguna: 0 (inclinada, no es perpendicular a ninguna), bastaUna: 'todas' (si es
 *       perpendicular a una recta del piso, lo es al piso), dos: 2 (a una recta y a su perpendicular) }. respuestas.conM y errores.conM: el ángulo con la recta M del piso por O de azimut M
 *       (por defecto, dir: la sombra) frente a { bastaUna: 90, complemento: 90 − conM, dibujo: el que se ve en la vista,
 *       redondeado a grados }.
 *   anguloConRecta({ incl, dir, phi })   ángulo entre esa varilla y la recta del piso por O de azimut phi
 *   anguloDiagonal({ largo, ancho, alto })
 *       Paralelepípedo de base largo × ancho (AB = largo en x, AD = ancho en y) y altura alto: la diagonal AG, su sombra
 *       AC (la proyección en el piso) y el ángulo θ de AG con el piso: tan θ = alto / AC. respuestas = { angulo, tan,
 *       sombra, diagonal }; errores.angulo = { conArista: el ángulo de AG con la arista AB (una recta del piso que no es
 *       la proyección), diagonalCara: el de la diagonal AF de la cara del frente con el piso, hipotenusa: atan(alto / AG),
 *       con la diagonal en lugar de la sombra como cateto }; errores.tan, la tangente de cada uno: √(ancho² + alto²)/largo,
 *       alto/largo y alto/AG.
 *   tresPerpendiculares({ h, m, largo })
 *       Teorema de las tres perpendiculares: PA ⊥ plano (PA = h), AB ⊥ L con B en L (AB = m), y L tiene un tramo de
 *       largo 'largo' que empieza en B. Entonces PB ⊥ L y la distancia de P a L es PB = √(h² + m²).
 *       respuestas.distancia; errores.distancia = { alPlano: h, alPie: m, alMedio: hasta el punto medio del tramo,
 *       alExtremo: hasta el otro extremo del tramo }.
 *   distanciaCruzadas({ a, r1, r2 })
 *       Distancia entre dos rectas del cubo (cruzadas, en la escena AG y BF). respuestas = { distancia, angulo, tipo }.
 *       Si las rectas no son cruzadas, no da error: 'tipo' lo dice ('secantes': distancia 0; 'paralelas': la distancia
 *       entre ellas; 'coincidentes': 0) y los errores se calculan igual (los que dan lo mismo van a 'coinciden');
 *       errores.distancia = { entreExtremos: la menor distancia entre extremos nombrados, mitadDeR1: la mitad del largo de
 *       r1, perpendicularAUna: la menor distancia de un extremo de una recta a la otra recta (perpendicular a una sola) }.
 *   proyeccion({ largo, h1, h2 })
 *       Un segmento de largo 'largo' con extremos a alturas h1 y h2 del plano: su proyección mide √(largo² − (h2 − h1)²)
 *       y forma con el plano un ángulo de asen(|h2 − h1| / largo). respuestas = { proyeccion, angulo };
 *       errores.proyeccion = { igual: largo, resta: largo − |h2 − h1|, altura: |h2 − h1| }.
 *   anguloRectasCubo({ a, r1, r2, vista })
 *       Ángulo entre dos rectas del cubo (0 a 90), sean secantes o cruzadas. respuestas = { angulo, tipo };
 *       errores.angulo = { dibujo: el que se ve en la vista (rectas), paralelas: 0 (solo si son cruzadas: «no se cortan,
 *       entonces son paralelas»), recto: 90, medio: 45, equilatero: 60 }.
 *   anguloEnVertice({ a, v, p, q, vista })
 *       El ángulo pvq del cubo (rayos v→p y v→q, 0 a 180). respuestas.angulo; errores.angulo = { dibujo (rayos), recto: 90,
 *       medio: 45, equilatero: 60 }.
 *   distanciaVerticeRecta({ a, v, r })
 *       Distancia del vértice v a la recta r del cubo. respuestas = { distancia, pie }; errores.distancia = { alMedio: hasta
 *       el punto medio del segmento r, alExtremo: hasta el extremo más cercano, conLaSombra: hasta la proyección de r en el
 *       piso (se usa la sombra de la recta en lugar de la recta) }.
 *   triedro({ caras: [α, β, γ] })
 *       α es la cara entre las aristas e2 y e3, β entre e1 y e3, γ entre e1 y e2. Existe si cada cara está entre 0° y
 *       180°, la suma es menor que 360° y cada una es menor que la suma de las otras dos. Da { existe, suma, criterios:
 *       { cadaCara, suma, desigualdad }, diedros: [D1, D2, D3] (en e1, e2, e3; null si no existe), aristas: [e1, e2, e3]
 *       (unitarias; null si no existe) }. respuestas.existe; errores.existe = { soloCadaCara: lo que diría quien solo mira
 *       que cada cara mida menos de 180°, soloDesigualdad: quien además mira la desigualdad pero no la suma,
 *       obtusaImposible: quien cree que ninguna cara puede ser obtusa }. respuestas.razon es 'existe' o el primer
 *       criterio que falla ('cadaCara', 'suma', 'desigualdad'); errores.razon da la razón de cada idea errónea (la de
 *       obtusaImposible es 'obtusa', solo si alguna cara pasa de 90°).
 *   desarrolloTriedro({ caras, f, R })
 *       Las tres caras como sectores de radio R (por defecto 1), del plano (f = 0) al triedro cerrado (f = 1): la cara γ
 *       queda en el piso; las otras dos giran sobre e1 y e2. Da { caras: [{ nombre, puntos }], libres: [e3 de la cara β,
 *       e3 de la cara α], cierra }. Si el triedro no existe, solo vale f = 0 (el desarrollo plano: 'traslape' dice cuántos
 *       grados se enciman si la suma pasa de 360°).
 *   puerta({ a, ancho, abre })
 *       Una puerta rectangular con bisagra en la arista AB del cubo (largo a, ancho 'ancho'), abierta 'abre' grados desde el
 *       piso hacia el fondo: sus cuatro esquinas [A, B, B', A'] y el diedro con el piso (= abre).
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorEspacio = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const EPS = 1e-9;
  const GR = 180 / Math.PI;

  // ---------- Vectores ----------
  const add = (p, q) => [p[0] + q[0], p[1] + q[1], p[2] + q[2]];
  const sub = (p, q) => [p[0] - q[0], p[1] - q[1], p[2] - q[2]];
  const mul = (p, k) => [p[0] * k, p[1] * k, p[2] * k];
  const dot = (p, q) => p[0] * q[0] + p[1] * q[1] + p[2] * q[2];
  const cross = (p, q) => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]];
  const norma = p => Math.hypot(p[0], p[1], p[2]);
  const unit = p => { const n = norma(p); if (n < EPS) throw new Error('vector nulo'); return mul(p, 1 / n); };
  const lerp = (p, q, t) => add(p, mul(sub(q, p), t));
  const acosG = x => Math.acos(Math.max(-1, Math.min(1, x))) * GR;
  const rad = g => g / GR;
  // Gira el punto p alrededor del eje que pasa por el origen con dirección k (unitaria), ang radianes (Rodrigues).
  function rotar(p, k, ang) {
    const c = Math.cos(ang), s = Math.sin(ang);
    return add(add(mul(p, c), mul(cross(k, p), s)), mul(k, dot(k, p) * (1 - c)));
  }

  const limpio = x => (typeof x === 'number' && Math.abs(x - Math.round(x)) < 1e-9 * Math.max(1, Math.abs(x)) ? Math.round(x) + 0 : x);
  const limpioP = p => p.map(limpio);
  const iguales = (a, b) => (typeof a === 'number' && typeof b === 'number' ? Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)) : a === b);

  function numero(x, que, o) {
    o = o || {};
    const v = typeof x === 'string' && x.trim() !== '' ? Number(x) : x;
    if (typeof v !== 'number' || !Number.isFinite(v)) throw new Error(`${que}: falta un número`);
    if (o.positivo && !(v > 0)) throw new Error(`${que} debe ser mayor que cero`);
    if (!o.positivo && !o.libre && v < 0) throw new Error(`${que} no puede ser negativo`);
    return v;
  }
  function vector(p, que) {
    if (!Array.isArray(p) || p.length !== 3) throw new Error(`${que}: falta un punto [x, y, z]`);
    return p.map((x, i) => numero(x, `${que}[${i}]`, { libre: true }));
  }

  // Reparte los errores: los que dan lo mismo que la respuesta van a 'coinciden' (no se ofrecen como opción).
  function separar(respuestas, grupos) {
    const errores = {}, coinciden = {};
    for (const [k, g] of Object.entries(grupos)) {
      if (!(k in respuestas)) throw new Error(`falta la respuesta de ${k}`);
      errores[k] = {}; coinciden[k] = [];
      for (const [e, v] of Object.entries(g)) {
        if (v === undefined) continue;
        const x = limpio(v);
        if (iguales(x, limpio(respuestas[k]))) coinciden[k].push(e); else errores[k][e] = x;
      }
    }
    const r = {};
    for (const [k, v] of Object.entries(respuestas)) r[k] = Array.isArray(v) ? limpioP(v) : limpio(v);
    return { respuestas: r, errores, coinciden };
  }

  // x = k·√m si x² es casi entero (m libre de cuadrados).
  function radical(x) {
    if (typeof x !== 'number' || !Number.isFinite(x) || x < 0) return null;
    const n = Math.round(x * x);
    if (Math.abs(n - x * x) > 1e-7 * Math.max(1, x * x)) return null;
    let k = 1, m = n;
    for (let i = 2; i * i <= m; i++) while (m % (i * i) === 0) { m /= i * i; k *= i; }
    return [k, m];
  }

  // ---------- Cámara ----------
  const VISTA0 = { az: 28, el: 22 };
  function vista(az, el) {
    if (az && typeof az === 'object') { el = az.el; az = az.az; }
    const a = rad(numero(az, 'el giro de la vista', { libre: true })), e = rad(numero(el, 'la elevación de la vista', { libre: true }));
    return {
      u: [Math.cos(a), Math.sin(a), 0],
      up: [-Math.sin(a) * Math.sin(e), Math.cos(a) * Math.sin(e), Math.cos(e)],
      v: [Math.sin(a) * Math.cos(e), -Math.cos(a) * Math.cos(e), Math.sin(e)],
      az: az, el: el,
    };
  }
  const comoVista = V => (V && V.u ? V : vista(V || VISTA0));
  const proyectar = (p, V) => { V = comoVista(V); return [dot(p, V.u), dot(p, V.up)]; };
  function angulo2(a, b) {
    const na = Math.hypot(a[0], a[1]), nb = Math.hypot(b[0], b[1]);
    if (na < EPS || nb < EPS) return 0;   // una recta que se ve de punta: el dibujo no muestra ángulo
    return acosG((a[0] * b[0] + a[1] * b[1]) / (na * nb));
  }
  function anguloEnDibujo(O, P, Q, V) {
    const o = proyectar(O, V), p = proyectar(P, V), q = proyectar(Q, V);
    return angulo2([p[0] - o[0], p[1] - o[1]], [q[0] - o[0], q[1] - o[1]]);
  }
  function anguloRectasEnDibujo(d1, d2, V) {
    const g = angulo2(proyectar(d1, V), proyectar(d2, V));
    return g > 90 ? 180 - g : g;
  }

  // ---------- El cubo ----------
  const LETRAS = 'ABCDEFGH';
  function cubo(a) {
    a = numero(a, 'la arista', { positivo: true });
    const B = [[0, 0, 0], [a, 0, 0], [a, a, 0], [0, a, 0]];
    const vertices = {};
    B.forEach((p, i) => { vertices[LETRAS[i]] = p; vertices[LETRAS[i + 4]] = [p[0], p[1], a]; });
    const aristas = [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'], ['E', 'F'], ['F', 'G'], ['G', 'H'], ['H', 'E'], ['A', 'E'], ['B', 'F'], ['C', 'G'], ['D', 'H']];
    const caras = [
      { nombre: 'ABCD', vertices: ['A', 'B', 'C', 'D'], normal: [0, 0, -1] },
      { nombre: 'EFGH', vertices: ['E', 'F', 'G', 'H'], normal: [0, 0, 1] },
      { nombre: 'ABFE', vertices: ['A', 'B', 'F', 'E'], normal: [0, -1, 0] },
      { nombre: 'DCGH', vertices: ['D', 'C', 'G', 'H'], normal: [0, 1, 0] },
      { nombre: 'ADHE', vertices: ['A', 'D', 'H', 'E'], normal: [-1, 0, 0] },
      { nombre: 'BCGF', vertices: ['B', 'C', 'G', 'F'], normal: [1, 0, 0] },
    ];
    return { a, vertices, aristas, caras, centro: [a / 2, a / 2, a / 2] };
  }
  function puntoCubo(a, letra) {
    const v = cubo(a).vertices[letra];
    if (!v) throw new Error(`vértice desconocido: ${letra} (A a H)`);
    return v;
  }
  function rectaCubo(a, r) {
    if (typeof r !== 'string' || r.length !== 2 || r[0] === r[1]) throw new Error(`recta del cubo: dos letras distintas de A a H (no ${r})`);
    const p = puntoCubo(a, r[0]), q = puntoCubo(a, r[1]);
    return { p, q, d: sub(q, p), nombre: r };
  }

  // ---------- Ángulos y distancias ----------
  const anguloVectores = (u, w) => limpio(acosG(dot(u, w) / (norma(u) * norma(w))));
  const anguloRectas = (u, w) => limpio(acosG(Math.abs(dot(u, w)) / (norma(u) * norma(w))));
  const anguloRectaPlano = (d, n) => limpio(90 - acosG(Math.abs(dot(d, n)) / (norma(d) * norma(n))));
  function proyeccionPunto(p, Q, n) {
    const k = unit(n);
    return limpioP(sub(p, mul(k, dot(sub(p, Q), k))));
  }
  function distanciaPuntoPlano(p, Q, n) { return limpio(Math.abs(dot(sub(p, Q), unit(n)))); }
  function distanciaPuntoRecta(p, A, d) {
    const k = unit(d), t = dot(sub(p, A), k), pie = add(A, mul(k, t));
    return { distancia: limpio(norma(sub(p, pie))), pie: limpioP(pie), t: limpio(t / norma(d)) };
  }
  function posicionRectas(P1, d1, P2, d2) {
    P1 = vector(P1, 'P1'); d1 = vector(d1, 'd1'); P2 = vector(P2, 'P2'); d2 = vector(d2, 'd2');
    if (norma(d1) < EPS || norma(d2) < EPS) throw new Error('una recta necesita una dirección distinta de cero');
    const n = cross(d1, d2), w = sub(P2, P1), escala = Math.max(1, norma(d1) * norma(d2));
    const angulo = anguloRectas(d1, d2);
    if (norma(n) < 1e-9 * escala) {
      const dist = distanciaPuntoRecta(P2, P1, d1).distancia;
      return { tipo: dist < 1e-9 ? 'coincidentes' : 'paralelas', angulo: 0, distancia: dist, pies: null };
    }
    // la perpendicular común: X1 = P1 + s·d1, X2 = P2 + t·d2 con (X2 − X1) ⊥ d1 y ⊥ d2
    const a = dot(d1, d1), b = dot(d1, d2), c = dot(d2, d2), e = dot(d1, w), f = dot(d2, w), den = a * c - b * b;
    const s = (e * c - b * f) / den, t = (b * e - a * f) / den;
    const X1 = add(P1, mul(d1, s)), X2 = add(P2, mul(d2, t));
    const distancia = limpio(Math.abs(dot(w, n)) / norma(n));
    return { tipo: distancia < 1e-9 ? 'secantes' : 'cruzadas', angulo, distancia, pies: [limpioP(X1), limpioP(X2)] };
  }
  function rectasCubo(a, r1, r2) {
    const R1 = rectaCubo(a, r1), R2 = rectaCubo(a, r2);
    return posicionRectas(R1.p, R1.d, R2.p, R2.d);
  }
  function diedro(A, B, C, D) {
    A = vector(A, 'A'); B = vector(B, 'B'); C = vector(C, 'C'); D = vector(D, 'D');
    const k = unit(sub(B, A));
    const pieDe = X => add(A, mul(k, dot(sub(X, A), k)));
    const pieC = pieDe(C), pieD = pieDe(D), perpC = sub(C, pieC), perpD = sub(D, pieD);
    if (norma(perpC) < EPS || norma(perpD) < EPS) throw new Error('C y D no pueden estar en la arista');
    const v = anguloVectores(perpC, perpD);
    const r = { diedro: v, pieC: limpioP(pieC), pieD: limpioP(pieD), perpC: limpioP(perpC), perpD: limpioP(perpD) };
    return Object.assign(r, separar({ diedro: v }, { diedro: {
      oblicuas: anguloVectores(sub(C, A), sub(D, A)),
      unaOblicua: anguloVectores(sub(C, A), perpD),
      recto: 90,
    } }));
  }
  // Marca de ángulo recto en o entre los rayos o→p y o→q: tres puntos.
  function marcaRecta(o, p, q, s) {
    const u = mul(unit(sub(p, o)), s), w = mul(unit(sub(q, o)), s);
    return [add(o, u), add(add(o, u), w), add(o, w)];
  }
  // Arco de radio r alrededor de o, del rayo o→p al rayo o→q (en el plano de los dos rayos).
  function arco(o, p, q, r, n) {
    n = n || 24;
    const u = unit(sub(p, o)), w0 = unit(sub(q, o)), ang = Math.acos(Math.max(-1, Math.min(1, dot(u, w0))));
    let perp = sub(w0, mul(u, dot(w0, u)));
    if (norma(perp) < EPS) perp = Math.abs(u[2]) < .9 ? cross(u, [0, 0, 1]) : cross(u, [1, 0, 0]);
    perp = unit(perp);
    const out = [];
    for (let i = 0; i <= n; i++) { const t = ang * i / n; out.push(add(o, add(mul(u, r * Math.cos(t)), mul(perp, r * Math.sin(t))))); }
    return out;
  }

  // ---------- La varilla ----------
  function direccionVarilla(incl, dir) {
    const i = rad(incl), d = rad(dir);
    return [Math.cos(i) * Math.cos(d), Math.cos(i) * Math.sin(d), Math.sin(i)];
  }
  function datosVarilla(d) {
    d = d || {};
    const incl = numero(d.incl, 'la inclinación', { positivo: true });
    if (incl > 90) throw new Error('la inclinación va de 0° a 90°');
    const dir = d.dir === undefined ? 0 : numero(d.dir, 'la dirección', { libre: true });
    return { incl, dir };
  }
  function anguloConRecta(d) {
    const { incl, dir } = datosVarilla(d);
    const phi = numero(d.phi, 'el azimut de la recta', { libre: true });
    return anguloRectas(direccionVarilla(incl, dir), [Math.cos(rad(phi)), Math.sin(rad(phi)), 0]);
  }
  function varilla(d) {
    d = d || {};
    const { incl, dir } = datosVarilla(d);
    const largo = d.largo === undefined ? 1 : numero(d.largo, 'el largo', { positivo: true });
    const O = d.O ? vector(d.O, 'O') : [0, 0, 0];
    const u = direccionVarilla(incl, dir), Q = add(O, mul(u, largo));
    const pieSombra = [Q[0], Q[1], O[2]];
    const vertical = iguales(incl, 90);
    const M = d.M === undefined ? dir : numero(d.M, 'el azimut de M', { libre: true });
    const m = [Math.cos(rad(M)), Math.sin(rad(M)), 0];
    const conM = anguloRectas(u, m);
    const V = comoVista(d.vista);
    const enDibujo = Math.round(anguloEnDibujo(O, Q, add(O, m), V));
    const perp = vertical ? 'todas' : limpio(((dir + 90) % 180 + 180) % 180);
    const r = {
      O: limpioP(O), punta: limpioP(Q), direccion: limpioP(u), pieSombra: limpioP(pieSombra),
      sombra: limpio(largo * Math.cos(rad(incl))), altura: limpio(largo * Math.sin(rad(incl))), anguloPlano: limpio(incl),
      perpendicularAlPlano: vertical, perpendicularA: perp,
    };
    return Object.assign(r, separar({ cuantas: vertical ? 'todas' : 1, conM }, {
      cuantas: { ninguna: 0, bastaUna: 'todas', dos: 2 },
      conM: { bastaUna: 90, complemento: 90 - conM, dibujo: enDibujo },
    }));
  }

  // ---------- La diagonal y su sombra ----------
  function anguloDiagonal(d) {
    d = d || {};
    const l = numero(d.largo, 'el largo', { positivo: true }), w = numero(d.ancho, 'el ancho', { positivo: true }), h = numero(d.alto, 'el alto', { positivo: true });
    const sombra = Math.hypot(l, w), diagonal = Math.hypot(l, w, h);
    const angulo = Math.atan(h / sombra) * GR;
    const r = { A: [0, 0, 0], G: [l, w, h], C: [l, w, 0], sombra: limpio(sombra), diagonal: limpio(diagonal), angulo: limpio(angulo), tan: limpio(h / sombra), sen: limpio(h / diagonal) };
    return Object.assign(r, separar({ angulo, tan: h / sombra, sombra, diagonal }, { angulo: {
      conArista: acosG(l / diagonal),
      diagonalCara: Math.atan(h / l) * GR,
      hipotenusa: Math.atan(h / diagonal) * GR,
    }, tan: { // la tangente que da cada idea errónea (para las preguntas de papel, que piden la tangente)
      conArista: Math.hypot(w, h) / l,
      diagonalCara: h / l,
      hipotenusa: h / diagonal,
    } }));
  }

  // ---------- Tres perpendiculares ----------
  function tresPerpendiculares(d) {
    d = d || {};
    const h = numero(d.h, 'la altura PA', { positivo: true }), m = numero(d.m, 'la distancia AB', { positivo: true });
    const largo = d.largo === undefined ? m : numero(d.largo, 'el largo del tramo', { positivo: true });
    const distancia = Math.hypot(h, m);
    // P sobre A; A en el origen; L paralela al eje y por B(m, 0, 0); el tramo va de B a B + (0, largo, 0)
    const r = { P: [0, 0, h], A: [0, 0, 0], B: [m, 0, 0], extremo: [m, largo, 0], distancia: limpio(distancia), anguloPBL: 90 };
    return Object.assign(r, separar({ distancia }, { distancia: {
      alPlano: h, alPie: m, alMedio: Math.hypot(h, m, largo / 2), alExtremo: Math.hypot(h, m, largo),
    } }));
  }

  // ---------- Rectas cruzadas en el cubo ----------
  function distanciaCruzadas(d) {
    d = d || {};
    const a = numero(d.a, 'la arista', { positivo: true });
    const R1 = rectaCubo(a, d.r1 || 'AG'), R2 = rectaCubo(a, d.r2 || 'BF');
    const pos = posicionRectas(R1.p, R1.d, R2.p, R2.d);
    const ext1 = [R1.p, R1.q], ext2 = [R2.p, R2.q];
    let entre = Infinity; for (const p of ext1) for (const q of ext2) entre = Math.min(entre, norma(sub(p, q)));
    let aUna = Infinity;
    for (const p of ext1) aUna = Math.min(aUna, distanciaPuntoRecta(p, R2.p, R2.d).distancia);
    for (const p of ext2) aUna = Math.min(aUna, distanciaPuntoRecta(p, R1.p, R1.d).distancia);
    const r = { tipo: pos.tipo, pies: pos.pies, r1: [R1.p, R1.q], r2: [R2.p, R2.q] };
    return Object.assign(r, separar({ distancia: pos.distancia, angulo: pos.angulo, tipo: pos.tipo }, { distancia: {
      entreExtremos: entre, mitadDeR1: norma(R1.d) / 2, perpendicularAUna: aUna,
    } }));
  }

  // ---------- Proyección de un segmento ----------
  function proyeccion(d) {
    d = d || {};
    const largo = numero(d.largo, 'el largo', { positivo: true });
    const h1 = d.h1 === undefined ? 0 : numero(d.h1, 'la altura h1'), h2 = numero(d.h2, 'la altura h2');
    const dh = Math.abs(h2 - h1);
    if (dh > largo + EPS) throw new Error('la diferencia de alturas no puede pasar del largo del segmento');
    const p = Math.sqrt(Math.max(0, largo * largo - dh * dh));
    const angulo = Math.asin(Math.min(1, dh / largo)) * GR;
    const r = { proyeccion: limpio(p), angulo: limpio(angulo), desnivel: limpio(dh) };
    return Object.assign(r, separar({ proyeccion: p, angulo }, { proyeccion: { igual: largo, resta: largo - dh, altura: dh } }));
  }

  // ---------- Ángulos en el cubo ----------
  function anguloRectasCubo(d) {
    d = d || {};
    const a = numero(d.a, 'la arista', { positivo: true });
    const R1 = rectaCubo(a, d.r1), R2 = rectaCubo(a, d.r2);
    const pos = posicionRectas(R1.p, R1.d, R2.p, R2.d);
    const dib = Math.round(anguloRectasEnDibujo(R1.d, R2.d, d.vista));
    const r = { tipo: pos.tipo, pies: pos.pies, distancia: pos.distancia };
    return Object.assign(r, separar({ angulo: pos.angulo, tipo: pos.tipo }, { angulo: {
      dibujo: dib, paralelas: pos.tipo === 'cruzadas' ? 0 : undefined, recto: 90, medio: 45, equilatero: 60,
    } }));
  }
  function anguloEnVertice(d) {
    d = d || {};
    const a = numero(d.a, 'la arista', { positivo: true });
    const V = puntoCubo(a, d.v), P = puntoCubo(a, d.p), Q = puntoCubo(a, d.q);
    if (d.v === d.p || d.v === d.q || d.p === d.q) throw new Error('el ángulo necesita tres vértices distintos');
    const ang = anguloVectores(sub(P, V), sub(Q, V));
    const dib = Math.round(anguloEnDibujo(V, P, Q, d.vista));
    return Object.assign({ V, P, Q }, separar({ angulo: ang }, { angulo: { dibujo: dib, recto: 90, medio: 45, equilatero: 60 } }));
  }
  function distanciaVerticeRecta(d) {
    d = d || {};
    const a = numero(d.a, 'la arista', { positivo: true });
    const X = puntoCubo(a, d.v), R = rectaCubo(a, d.r);
    if (R.nombre.includes(d.v)) throw new Error('el vértice no puede estar en la recta');
    const res = distanciaPuntoRecta(X, R.p, R.d);
    const medio = lerp(R.p, R.q, 0.5);
    const sp = [R.p[0], R.p[1], 0], sq = [R.q[0], R.q[1], 0];
    const conSombra = norma(sub(sp, sq)) < EPS ? norma(sub(X, sp)) : distanciaPuntoRecta(X, sp, sub(sq, sp)).distancia;
    return Object.assign({ distancia: res.distancia, pie: res.pie, t: res.t }, separar({ distancia: res.distancia, pie: res.pie }, { distancia: {
      alMedio: norma(sub(X, medio)), alExtremo: Math.min(norma(sub(X, R.p)), norma(sub(X, R.q))), conLaSombra: conSombra,
    } }));
  }

  // ---------- El triedro ----------
  function carasTriedro(c) {
    if (!Array.isArray(c) || c.length !== 3) throw new Error('el triedro necesita tres caras [α, β, γ]');
    return c.map((x, i) => numero(x, `la cara ${'αβγ'[i]}`, { positivo: true }));
  }
  function triedro(d) {
    d = d || {};
    const [al, be, ga] = carasTriedro(d.caras);
    const suma = al + be + ga;
    const cadaCara = [al, be, ga].every(x => x > 0 && x < 180);
    const sumaOk = suma < 360 - EPS;
    const desig = al < be + ga - EPS && be < al + ga - EPS && ga < al + be - EPS;
    const existe = cadaCara && sumaOk && desig;
    let diedros = null, aristas = null;
    if (existe) {
      const [A, B, G] = [al, be, ga].map(rad);
      const D1 = acosG((Math.cos(A) - Math.cos(B) * Math.cos(G)) / (Math.sin(B) * Math.sin(G)));
      const D2 = acosG((Math.cos(B) - Math.cos(A) * Math.cos(G)) / (Math.sin(A) * Math.sin(G)));
      const D3 = acosG((Math.cos(G) - Math.cos(A) * Math.cos(B)) / (Math.sin(A) * Math.sin(B)));
      diedros = [D1, D2, D3].map(limpio);
      const e1 = [1, 0, 0], e2 = [Math.cos(G), Math.sin(G), 0];
      const x = Math.cos(B), y = (Math.cos(A) - Math.cos(B) * Math.cos(G)) / Math.sin(G), z = Math.sqrt(Math.max(0, 1 - x * x - y * y));
      aristas = [e1, e2, [x, y, z]].map(limpioP);
    }
    const r = { existe, suma: limpio(suma), criterios: { cadaCara, suma: sumaOk, desigualdad: desig }, diedros, aristas, traslape: limpio(Math.max(0, suma - 360)) };
    // la razón: 'existe' o el primer criterio que falla ('cadaCara', 'suma', 'desigualdad')
    const razon = existe ? 'existe' : !cadaCara ? 'cadaCara' : !sumaOk ? 'suma' : 'desigualdad';
    const obtusa = [al, be, ga].some(x => x > 90);
    return Object.assign(r, separar({ existe, razon }, {
      existe: { soloCadaCara: cadaCara, soloDesigualdad: cadaCara && desig, obtusaImposible: cadaCara && !obtusa },
      razon: {
        soloCadaCara: cadaCara ? 'existe' : 'cadaCara',
        soloDesigualdad: !cadaCara ? 'cadaCara' : desig ? 'existe' : 'desigualdad',
        obtusaImposible: obtusa ? 'obtusa' : undefined,
      },
    }));
  }
  function sector(o, u, k, ang, R, n) {
    // puntos del sector: o y el arco desde la dirección u girando ang radianes alrededor del eje k
    const pts = [o];
    for (let i = 0; i <= n; i++) pts.push(add(o, mul(rotar(u, k, ang * i / n), R)));
    return pts;
  }
  function desarrolloTriedro(d) {
    d = d || {};
    const T = triedro(d), [al, be, ga] = carasTriedro(d.caras).map(rad);
    const f = d.f === undefined ? 0 : numero(d.f, 'el avance f');
    if (f > 1) throw new Error('el avance f va de 0 a 1');
    if (!T.existe && f > 0) throw new Error('ese triedro no existe: solo se puede mostrar abierto (f = 0)');
    const R = d.R === undefined ? 1 : numero(d.R, 'el radio', { positivo: true });
    const n = 24, z = [0, 0, 1], O = [0, 0, 0];
    const e1 = [1, 0, 0], e2 = [Math.cos(ga), Math.sin(ga), 0];
    // cara γ: en el piso, de e1 a e2
    const caraG = sector(O, e1, z, ga, R, n);
    // cara β: abierta, de e1 hacia atrás (giro −β); se dobla sobre e1 hacia arriba
    const g1 = T.existe ? f * (Math.PI - rad(T.diedros[0])) : 0;
    const g2 = T.existe ? f * (Math.PI - rad(T.diedros[1])) : 0;
    const caraB = sector(O, e1, z, -be, R, n).map(p => rotar(p, e1, -g1));
    // cara α: abierta, de e2 hacia adelante (giro +α); se dobla sobre e2 hacia arriba
    const caraA = sector(O, e2, z, al, R, n).map(p => rotar(p, e2, g2));
    const libreB = caraB[caraB.length - 1], libreA = caraA[caraA.length - 1];
    return {
      existe: T.existe, f, traslape: T.traslape,
      caras: [{ nombre: 'γ', puntos: caraG.map(limpioP) }, { nombre: 'β', puntos: caraB.map(limpioP) }, { nombre: 'α', puntos: caraA.map(limpioP) }],
      aristas: [e1, e2].map(limpioP), libres: [limpioP(libreB), limpioP(libreA)],
      cierra: T.existe && f === 1,
    };
  }

  // ---------- La puerta (el diedro que se abre) ----------
  function puerta(d) {
    d = d || {};
    const a = numero(d.a, 'la arista', { positivo: true });
    const ancho = d.ancho === undefined ? a : numero(d.ancho, 'el ancho', { positivo: true });
    const abre = numero(d.abre, 'la abertura');
    if (abre > 180) throw new Error('la abertura va de 0° a 180°');
    const w = [0, ancho * Math.cos(rad(abre)), ancho * Math.sin(rad(abre))];
    const A = [0, 0, 0], B = [a, 0, 0];
    return { esquinas: [A, B, add(B, w), add(A, w)].map(limpioP), diedro: limpio(abre), perpendicular: limpioP(w) };
  }

  return {
    VISTA0, vista, proyectar, anguloEnDibujo, anguloRectasEnDibujo,
    cubo, puntoCubo, anguloRectas, anguloVectores, anguloRectaPlano, proyeccionPunto, distanciaPuntoRecta, distanciaPuntoPlano,
    posicionRectas, rectasCubo, diedro, marcaRecta, arco, radical,
    varilla, anguloConRecta, anguloDiagonal, tresPerpendiculares, distanciaCruzadas, proyeccion,
    anguloRectasCubo, anguloEnVertice, distanciaVerticeRecta, triedro, desarrolloTriedro, puerta,
    util: { add, sub, mul, dot, cross, norma, unit, lerp, rotar, limpio, iguales },
  };
});
