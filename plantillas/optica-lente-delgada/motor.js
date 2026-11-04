/*
 * Motor del Banco Óptico: lentes delgadas en aproximación paraxial.
 *
 * Aquí vive toda la física de la plantilla (regla 1 de CLAUDE.md). No toca
 * el DOM: funciona igual en el navegador (window.MotorLente) y en Node
 * (require('./motor.js')), donde lo prueban los casos de casos.json.
 *
 * Convención (la de casos.json): Descartes para lentes, 1/f = 1/o + 1/i,
 * A = -i/o. Distancias en cm sobre el eje óptico, positivo hacia la derecha.
 * o > 0 objeto real; i > 0 imagen real; f > 0 lente convergente.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorLente = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /*
   * Imagen de un objeto a distancia o de una lente de focal f.
   * Si el objeto está en el foco (|o - f| < tol) los rayos salen paralelos:
   * no hay imagen y se devuelve { inf: true }.
   */
  function imagen(o, f, h, tol) {
    const den = o - f;
    if (Math.abs(den) < (tol === undefined ? 1e-9 : tol)) return { o, inf: true };
    const i = o * f / den;
    const m = -f / den; // igual a -i/o, pero no se indefine con o = 0
    return { o, i, m, h: m * h, inf: false };
  }

  /*
   * Sistema óptico a partir de los datos de un problema.
   * lentes: [{ f }, { f, d }, ...], donde d es la separación con la lente
   * anterior. La primera lente está en x = 0 y el objeto en x = -o1.
   */
  function sistema(o1, h, lentes) {
    let x = 0;
    return {
      x0: -o1,
      h,
      lentes: lentes.map((L, k) => {
        if (k > 0) x += L.d;
        return { x, f: L.f };
      }),
    };
  }

  /*
   * Encadena las lentes: la imagen de cada una es el objeto de la siguiente.
   * Devuelve un paso por lente: { o, i, m, h, x, L, inf }, donde x es la
   * posición de la imagen y h su altura. Si una imagen se va al infinito, la
   * cadena se corta ahí.
   */
  function cadena(sis, tol) {
    let xo = sis.x0, h = sis.h;
    const pasos = [];
    for (const L of sis.lentes) {
      const r = imagen(L.x - xo, L.f, h, tol === undefined ? 0.05 : tol);
      if (r.inf) { pasos.push({ o: r.o, inf: true, L }); break; }
      pasos.push({ o: r.o, i: r.i, m: r.m, h: r.h, x: L.x + r.i, L, inf: false });
      xo = L.x + r.i; h = r.h;
    }
    return pasos;
  }

  /*
   * Traza un rayo que sale de la punta del objeto con pendiente u0, con la
   * regla de la lente delgada: pendiente de salida = pendiente de entrada - y/f.
   * Devuelve los puntos del rayo hasta xFin y, en cada lente, la altura y las
   * pendientes de entrada y salida.
   */
  function trazar(sis, u0, xFin) {
    let x = sis.x0, y = sis.h, u = u0;
    const pts = [[x, y]], en = [];
    for (const L of sis.lentes) {
      y += u * (L.x - x); x = L.x; pts.push([x, y]);
      const uEntra = u;
      u -= y / L.f;
      en.push({ x, y, uEntra, uSale: u });
    }
    pts.push([xFin, y + u * (xFin - x)]);
    return { pts, en };
  }

  /* Aumento total: producto de los aumentos de cada lente. */
  function aumentoTotal(pasos) {
    return pasos.reduce((A, p) => A * p.m, 1);
  }

  return { imagen, sistema, cadena, trazar, aumentoTotal };
});
