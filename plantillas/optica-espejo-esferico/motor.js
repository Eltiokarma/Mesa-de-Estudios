/*
 * Motor de Espejos esféricos, en aproximación paraxial.
 *
 * Aquí vive toda la física de la plantilla (regla 1 de CLAUDE.md). No toca el
 * DOM: funciona igual en el navegador (window.MotorEspejo) y en Node
 * (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Convención (la de docs/investigacion/optica-espejos-esfericos.md, la misma
 * que el Banco Óptico):
 *   1/f = 1/o + 1/i,  A = -i/o,  f = R/2.
 *   f > 0 espejo cóncavo; f < 0 espejo convexo.
 *   o > 0 objeto real, delante del espejo.
 *   i > 0 imagen real, DELANTE del espejo; i < 0 imagen virtual, detrás.
 *
 * Coordenadas del dibujo (cm): el espejo está en x = 0, el objeto a la
 * izquierda (x = -o) y lo que está detrás del espejo a la derecha (x > 0).
 * El lado de la imagen real se "dobla" hacia el objeto: una imagen de
 * distancia i queda en x = -i. Así, F está en x = -f y C en x = -2f.
 * Las pendientes de los rayos son dy/dx en estas coordenadas.
 * El espejo se trata como el plano x = 0 (aproximación paraxial), igual que
 * la lente delgada.
 *
 * El doblez (0.2.0): el espejo es una lente delgada de la misma f con la hoja
 * de la luz que sale doblada 180° sobre la línea x = 0. Una lente desvía un
 * rayo que llega a la altura yM con pendiente u a u' = u - yM/f
 * (pendienteLente); el espejo lo devuelve con yM/f - u = -u' (reflejar): el
 * rayo reflejado es el transmitido visto en el espejo x -> -x.
 * La hoja de la luz que sale está en el marco de la lente: la luz sale hacia
 * x > 0 y la imagen de distancia i queda en x = +i (real si i > 0). Doblarla
 * una fracción s (0 = lente, 1 = espejo) es girarla θ = π·s alrededor del eje
 * y (la línea del espejo): X = x·cos θ, Y = y, Z = x·sen θ (Z > 0, hacia quien
 * mira). Se ve en pantalla con una proyección oblicua de gabinete de vector
 * k = (kx, ky) = (-0,25; -0,35) cm de pantalla por cm de profundidad:
 *   x' = x·cos θ + kx·x·sen θ,  y' = y + ky·x·sen θ  (plegar).
 * Con s = 1 un punto (x, y) cae en (-x, y): la imagen de la lente, en x = +i,
 * queda en x = -i, donde la pone imagen(). Un giro rígido no cambia la
 * distancia de cada punto a la bisagra: la imagen sigue a |i| de la línea.
 * La hoja se ve de canto (ancho cos θ + kx·sen θ = 0) en s* = atan2(1, -kx)/π.
 * Todo punto plegado es { x, y, z } en cm de pantalla, con z > 0 hacia quien mira.
 * sMasCercano(p, W, yH, k): el s de la pestaña de la hoja (en (W, yH) de la
 *   hoja) que se ve en el punto de pantalla p = { x, y }; 0 o 1 si p cae fuera
 *   de su recorrido (media elipse).
 * hojaDeSalida(o, f, h, s, op) devuelve:
 *   s; theta = π·s; ancho = anchoHoja(s); deCanto = |ancho| < op.umbralCanto
 *   (0,18); sentido = signo de ancho; hoja = { mitadSalida, mitadEntrada },
 *   las 4 esquinas plegadas de [0, xHoja] y [-xHoja, 0] por [-yHoja, yHoja];
 *   imagen = la imagen de la lente, (i, A·h) plegado, más { i, A, real, inf:
 *   false }, o { inf: true } si el objeto está en F; focoPrima = (f, 0) y
 *   dobleFoco = (2f, 0), plegados; regla = [{ v, x, y, z }], cada marca v de
 *   op.regla ([10, 20, 30]) en (v, op.yRegla) plegada; distanciaBisagra = |i|
 *   (Infinity si no hay imagen); rayos = los principales (paralelo, foco,
 *   vertice; el del foco falta con el objeto en F) que tocan la abertura op.D,
 *   cada uno { nombre, yM, uEntra, uSale (pendiente al salir de la lente),
 *   desde = (0, yM) plegado, hasta = (xRayo, yM + uSale·xRayo) plegado,
 *   pendPantalla (pendiente de la recta plegada; null si es vertical),
 *   prolongacion ({ desde, hasta: la imagen plegada } si es virtual; si no, null) }.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorEspejo = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* Distancia focal a partir del radio de curvatura: f = R/2, negativa en el convexo. */
  function focal(R, tipo) {
    const f = Math.abs(R) / 2;
    return tipo === 'convexo' ? -f : f;
  }

  /*
   * Imagen de un objeto a distancia o de un espejo de focal f (altura h).
   * Si el objeto está en el foco (|o - f| < tol), los rayos reflejados salen
   * paralelos: no hay imagen y se devuelve { inf: true }.
   * Devuelve i, el aumento m (= A = -i/o), la altura h de la imagen, su
   * posición x en el dibujo y si es real.
   */
  function imagen(o, f, h, tol) {
    if (h === undefined) h = 1;
    const den = o - f;
    if (Math.abs(den) < (tol === undefined ? 1e-9 : tol)) return { o, f, inf: true };
    const i = o * f / den;
    const m = -f / den; // igual a -i/o, sin indefinirse con o = 0
    return { o, f, i, m, h: m * h, x: -i, real: i > 0, inf: false };
  }

  /*
   * Cómo es la imagen, en las palabras del examen.
   * tamano: 'mayor', 'menor' o 'igual' (con una tolerancia relativa tolA).
   */
  function describir(r, tolA) {
    if (r.inf) return { inf: true };
    const a = Math.abs(r.m), t = tolA === undefined ? 1e-6 : tolA;
    return {
      inf: false,
      real: r.i > 0,
      derecha: r.m > 0,
      tamano: Math.abs(a - 1) <= t ? 'igual' : (a > 1 ? 'mayor' : 'menor'),
    };
  }

  /*
   * Zona del objeto respecto a C y F (la regla de zonas del cóncavo).
   * 'mas-alla-de-C', 'en-C', 'entre-C-y-F', 'en-F', 'entre-F-y-espejo', o
   * 'convexo' (en el convexo no hay zonas: la imagen es siempre igual de tipo).
   */
  function zona(o, f, tol) {
    const t = tol === undefined ? 1e-9 : tol;
    if (f < 0) return 'convexo';
    if (Math.abs(o - 2 * f) < t) return 'en-C';
    if (Math.abs(o - f) < t) return 'en-F';
    if (o > 2 * f) return 'mas-alla-de-C';
    if (o > f) return 'entre-C-y-F';
    return 'entre-F-y-espejo';
  }

  /*
   * Ley de reflexión paraxial. Un rayo que llega al espejo (x = 0) a la altura
   * yM con pendiente u (viajando hacia la derecha) sale hacia la izquierda con
   * pendiente yM/f - u. Con f = Infinity es un espejo plano: sale con -u.
   */
  function reflejar(yM, u, f) {
    return (Number.isFinite(f) ? yM / f : 0) - u;
  }

  /* Altura de un rayo reflejado { yM, pend } en la coordenada x (recta completa). */
  function alturaEn(rayo, x) {
    return rayo.yM + rayo.pend * x;
  }

  /*
   * Rayo que sale de la punta del objeto (x = -o, altura h) con pendiente u0.
   * Devuelve la altura yM donde toca el espejo, la pendiente reflejada y los
   * puntos del recorrido hasta xFin (xFin < 0: delante del espejo).
   */
  function trazar(o, f, h, u0, xFin) {
    const yM = h + u0 * o;
    const pend = reflejar(yM, u0, f);
    const pts = [[-o, h], [0, yM]];
    if (xFin !== undefined) pts.push([xFin, yM + pend * xFin]);
    return { uEntra: u0, yM, pend, pts };
  }

  /*
   * Los rayos principales desde la punta del objeto:
   *   paralelo: llega paralelo al eje y sale pasando por F (o como si viniera de F, en el convexo);
   *   foco:     llega pasando por F (o apuntando a F) y sale paralelo al eje;
   *   vertice:  llega al vértice y sale con el mismo ángulo, simétrico respecto al eje;
   *   centro:   llega pasando por C (o apuntando a C) y vuelve por el mismo camino.
   * Si un rayo no existe (objeto en F para el rayo del foco, objeto en C para el
   * del centro), vale null.
   */
  function rayosPrincipales(o, f, h) {
    const rayo = (u0, nombre) => Object.assign(trazar(o, f, h, u0), { nombre });
    const r = { paralelo: rayo(0, 'paralelo'), vertice: rayo(-h / o, 'vertice'), foco: null, centro: null };
    // La recta de la punta del objeto (-o, h) al foco (-f, 0) tiene pendiente -h/(o - f).
    if (Math.abs(o - f) > 1e-9) r.foco = rayo(-h / (o - f), 'foco');
    // La recta de la punta del objeto al centro (-2f, 0) tiene pendiente -h/(o - 2f).
    if (Math.abs(o - 2 * f) > 1e-9) r.centro = rayo(-h / (o - 2 * f), 'centro');
    return r;
  }

  /*
   * Abanico: n rayos desde la punta del objeto que tocan el espejo en alturas
   * repartidas de manera pareja entre -D/2 y D/2 (D = abertura del espejo).
   * Todos los reflejados pasan por el punto imagen (o sus prolongaciones, si es virtual).
   */
  function abanico(o, f, h, D, n) {
    const rayos = [];
    for (let k = 0; k < n; k++) {
      const yM = n === 1 ? 0 : -D / 2 + D * k / (n - 1);
      const u0 = (yM - h) / o;
      rayos.push({ yM, uEntra: u0, pend: reflejar(yM, u0, f) });
    }
    return rayos;
  }

  /*
   * El rayo de la punta del objeto que, al reflejarse, llega a un ojo en
   * (xe, ye), con xe < 0. Se busca con la ley de reflexión, sin usar la
   * ecuación del espejo: la pendiente reflejada es lineal en yM, así que se
   * despeja yM de ye = yM + pend(yM)·xe. Con la abertura D dice si ese rayo
   * toca el espejo (si no, el ojo no ve la punta de la imagen).
   */
  function rayoAlOjo(o, f, h, xe, ye, D) {
    // pend(yM) = yM/f - (yM - h)/o = a·yM + b
    const a = (Number.isFinite(f) ? 1 / f : 0) - 1 / o, b = h / o;
    const den = 1 + a * xe;
    if (Math.abs(den) < 1e-12) return null; // el ojo está justo en la imagen real
    const yM = (ye - b * xe) / den;
    const u0 = (yM - h) / o;
    return {
      yM, uEntra: u0, pend: reflejar(yM, u0, f),
      enEspejo: D === undefined ? true : Math.abs(yM) <= D / 2 + 1e-9,
    };
  }

  /*
   * Campo de visión: lo que un ojo en (xe, ye) alcanza a ver en un espejo de
   * abertura D. Se trazan al revés los rayos que llegan al ojo desde los bordes
   * del espejo (la luz hace el mismo camino en los dos sentidos). Devuelve los
   * dos rayos de borde { yM, pend } y el ángulo (en radianes) entre ellos.
   * Con f = Infinity da el campo de un espejo plano del mismo tamaño.
   */
  function campoVisual(xe, ye, f, D) {
    const bordes = [D / 2, -D / 2].map(yM => {
      const u = (yM - ye) / (0 - xe); // del ojo al borde, viajando hacia la derecha
      return { yM, pend: reflejar(yM, u, f) };
    });
    const ang = Math.abs(Math.atan(bordes[0].pend) - Math.atan(bordes[1].pend));
    return { bordes, angulo: ang };
  }

  /* ================= El doblez: la lente que se vuelve espejo ================= */

  // Proyección oblicua (cm de pantalla por cm de profundidad): lo que se acerca baja y se corre a la izquierda.
  const PROYECCION = Object.freeze({ kx: -0.25, ky: -0.35 });

  /* Pendiente con que sale de una lente delgada de focal f un rayo que llega a la altura yM con pendiente u. */
  function pendienteLente(yM, u, f) {
    if (f === 0) throw new RangeError('f no puede ser 0');
    return u - (Number.isFinite(f) ? yM / f : 0);
  }

  function revisarS(s) {
    if (typeof s !== 'number' || !Number.isFinite(s) || s < 0 || s > 1) throw new RangeError('s debe estar entre 0 y 1');
  }
  // cos θ y sen θ con θ = π·s; exactos en 0, 1/2 y 1 (para que la hoja abierta y la doblada no arrastren 1e-16).
  function giro(s) {
    if (s === 0) return [1, 0];
    if (s === 1) return [-1, 0];
    if (s === 0.5) return [0, 1];
    return [Math.cos(Math.PI * s), Math.sin(Math.PI * s)];
  }

  /*
   * Lugar en pantalla (cm) del punto (x, y) de la hoja de la luz que sale, con la hoja doblada una fracción s.
   * Devuelve { x, y, z }: z es la profundidad (z > 0, hacia quien mira).
   */
  function plegar(x, y, s, k) {
    if (typeof x !== 'number' || !Number.isFinite(x) || typeof y !== 'number' || !Number.isFinite(y)) throw new TypeError('x e y deben ser números finitos');
    revisarS(s);
    const q = k || PROYECCION, [c, sn] = giro(s);
    return { x: x * c + q.kx * x * sn, y: y + q.ky * x * sn, z: x * sn };
  }

  /* Factor con que se ve el ancho de la hoja: positivo mientras la hoja aún apunta a la derecha. */
  function anchoHoja(s, k) {
    revisarS(s);
    const q = k || PROYECCION, [c, sn] = giro(s);
    return c + q.kx * sn;
  }

  /* El s en que la hoja se ve de canto (anchoHoja = 0). */
  function sDeCanto(k) {
    const q = k || PROYECCION;
    return Math.atan2(1, -q.kx) / Math.PI;
  }

  /*
   * Inversa para arrastrar la pestaña de la hoja, que está en (W, yH) de la hoja. Su recorrido en pantalla es
   * media elipse, (W·(cos θ + kx·sen θ), yH + ky·W·sen θ): una transformación lineal de (cos θ, sen θ) que se
   * invierte. Devuelve el s del punto de la curva que corresponde a p = { x, y } (cm de pantalla); si p cae fuera
   * de la media elipse, 0 o 1 según el lado.
   */
  function sMasCercano(p, W, yH, k) {
    const q = k || PROYECCION;
    if (!(W > 0)) throw new RangeError('W debe ser positivo');
    if (!q.ky) throw new RangeError('ky no puede ser 0');
    const v = (p.y - yH) / (q.ky * W), u = p.x / W - q.kx * v;
    const th = Math.atan2(v, u);
    if (th < 0) return u >= 0 ? 0 : 1;
    return Math.min(1, Math.max(0, th / Math.PI));
  }

  /*
   * Toda la geometría de la hoja de la luz que sale, para dibujar un cuadro del doblez: objeto real a distancia o
   * de una lente (o espejo) de focal f, altura h, hoja doblada una fracción s.
   * op = { k, xHoja: 34, yHoja: 18, xRayo: 36, regla: [10, 20, 30], yRegla: 0, umbralCanto: 0.18, D: Infinity }.
   * Los rayos son los principales (paralelo, foco, vértice) que tocan la abertura D; uSale es su pendiente al
   * salir de la lente. Si la imagen es virtual, prolongacion va desde la lente hasta la imagen (del lado del
   * objeto, en la misma hoja).
   */
  function hojaDeSalida(o, f, h, s, op) {
    if (!(o > 0)) throw new RangeError('o debe ser positiva (objeto real)');
    if (f === 0 || typeof f !== 'number' || Number.isNaN(f)) throw new RangeError('f no puede ser 0');
    revisarS(s);
    if (h === undefined) h = 1;
    op = op || {};
    const k = op.k || PROYECCION;
    const xH = op.xHoja === undefined ? 34 : op.xHoja, yH = op.yHoja === undefined ? 18 : op.yHoja;
    const xR = op.xRayo === undefined ? 36 : op.xRayo, D = op.D === undefined ? Infinity : op.D;
    const marcas = op.regla || [10, 20, 30], yReg = op.yRegla || 0;
    const umbral = op.umbralCanto === undefined ? 0.18 : op.umbralCanto;
    const P = (x, y) => plegar(x, y, s, k);
    const ancho = anchoHoja(s, k);
    const im = imagen(o, f, h);
    const esq = (x0, x1) => [P(x0, -yH), P(x1, -yH), P(x1, yH), P(x0, yH)];
    const r = {
      s, theta: Math.PI * s, ancho, deCanto: Math.abs(ancho) < umbral,
      hoja: { mitadSalida: esq(0, xH), mitadEntrada: esq(-xH, 0) },
      imagen: im.inf ? { inf: true } : Object.assign(P(im.i, im.h), { i: im.i, A: im.m, real: im.i > 0, inf: false }),
      focoPrima: P(f, 0),
      dobleFoco: P(2 * f, 0),
      rayos: [],
      regla: marcas.map(v => Object.assign({ v }, P(v, yReg))),
      sentido: Math.sign(ancho),
      distanciaBisagra: im.inf ? Infinity : Math.abs(im.i),
    };
    const rp = rayosPrincipales(o, f, h);
    for (const ry of [rp.paralelo, rp.foco, rp.vertice]) {
      if (!ry || Math.abs(ry.yM) > D / 2 + 1e-9) continue;
      const uSale = pendienteLente(ry.yM, ry.uEntra, f);
      const desde = P(0, ry.yM), hasta = P(xR, ry.yM + uSale * xR);
      const dx = hasta.x - desde.x;
      r.rayos.push({
        nombre: ry.nombre, yM: ry.yM, uEntra: ry.uEntra, uSale, desde, hasta,
        pendPantalla: Math.abs(dx) < 1e-12 ? null : (hasta.y - desde.y) / dx,
        prolongacion: im.inf || im.i > 0 ? null : { desde, hasta: P(im.i, im.h) },
      });
    }
    return r;
  }

  return { focal, imagen, describir, zona, reflejar, alturaEn, trazar, rayosPrincipales, abanico, rayoAlOjo, campoVisual,
    PROYECCION, pendienteLente, plegar, anchoHoja, sDeCanto, sMasCercano, hojaDeSalida };
});
