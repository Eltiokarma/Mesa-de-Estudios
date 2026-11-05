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

  return { focal, imagen, describir, zona, reflejar, alturaEn, trazar, rayosPrincipales, abanico, rayoAlOjo, campoVisual };
});
