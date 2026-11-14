/*
 * Pieza «alg-baldosas» (Álgebra, docs/teoria.md §4): el modelo de área. Un rectángulo cuyo ancho y alto se parten
 * en tramos (a, b, …); cada casilla es el producto de su tramo de arriba por su tramo de la izquierda. Sirve para
 * productos notables, multiplicación de polinomios, factor común, completar cuadrados y aspa.
 *
 * Afirmación de la figura: el área del todo es la suma de las piezas; cada pieza es su ancho por su alto.
 *
 * Fidelidad: una sola escala para los dos lados; cada tramo se dibuja con su valor `v` (positivo) a escala.
 * datos = {
 *   anchos: [{ t: 'a', v: 3, color: 'o' }, { t: 'b', v: 2, color: 'i' }],   // tramos de arriba (izquierda → derecha)
 *   altos:  [{ t: 'a', v: 3, color: 'o' }, { t: 'b', v: 2, color: 'i' }],   // tramos de la izquierda (arriba → abajo)
 *   celdas: [[{ t: 'a²', color: 'o', desde }, …], …],   // [fila][columna]; sin celda: casilla vacía (solo contorno)
 *   total:  { t: '(a + b)²', desde },                    // rótulo debajo del rectángulo
 *   alt
 * }
 * estado = { corte, separar: false, fantasma: null | { celdas: [[f, c], …], rotulo } }
 *   separar: las piezas se apartan unas de otras (se cuentan una por una); la escala no cambia.
 *   fantasma: casillas que un error olvida, con borde discontinuo y su rótulo en el pie.
 * El dibujo es una función pura de (datos, estado). Todo número lo trae quien llama.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const Kit = nodo ? require('../kit.js') : root.Kit;
  const T = nodo ? require('../trazo.js') : root.Kit.trazo;
  const api = fabrica(Kit, T);
  Kit.registrar(api);
  if (nodo) module.exports = api;
})(typeof self !== 'undefined' ? self : this, function (Kit, T) {
  'use strict';
  const W = 320, X0 = 56, Y0 = 40, LADO = 200, HUECO = 10, ALTO = 300;

  const suma = l => (l || []).reduce((a, x) => a + Math.max(0, +x.v || 0), 0);
  // Escala única: el lado mayor mide LADO px (con huecos incluidos, para que separar no cambie la escala).
  function geometria(d) {
    const A = suma(d.anchos) || 1, H = suma(d.altos) || 1;
    const na = (d.anchos || []).length, nh = (d.altos || []).length;
    const esc = Math.min((LADO - HUECO * (na - 1)) / A, (LADO - HUECO * (nh - 1)) / H);
    return { esc, A, H };
  }
  function cortes(lista, esc, origen, separar) {
    const out = []; let p = origen;
    (lista || []).forEach((x, k) => { const w = Math.max(0, +x.v || 0) * esc; out.push([p, p + w]); p += w + (separar ? HUECO : 0); });
    return out;
  }

  function dibujar(d, estado = {}) {
    const g = geometria(d), sep = !!estado.separar;
    const corte = Math.max(0, estado.corte || 0);
    const ve = e => (e.desde || 0) <= corte;
    const nuevo = e => ((e.desde || 0) === corte && corte > 0 ? ' kit-nuevo' : '');
    const xs = cortes(d.anchos, g.esc, X0, sep), ys = cortes(d.altos, g.esc, Y0, sep);
    let s = '';
    // Cotas de los tramos: arriba los anchos, a la izquierda los altos, en el color de su variable.
    xs.forEach(([a, b], k) => { const x = d.anchos[k]; s += T.cota(a + 1, b - 1, Y0 - 14, { color: x.color, texto: x.t, grosor: T.GROSOR.contorno }); });
    ys.forEach(([a, b], k) => {
      const x = d.altos[k];
      s += T.linea(X0 - 14, a + 1, X0 - 14, b - 1, { color: x.color }) + T.linea(X0 - 20, a + 1, X0 - 8, a + 1, { color: x.color }) + T.linea(X0 - 20, b - 1, X0 - 8, b - 1, { color: x.color });
      s += T.rotulo(X0 - 22, (a + b) / 2 + 6, x.t, { color: x.color, ancla: 'end', peso: 600, min: 2, max: X0 - 20 });
    });
    // Casillas.
    ys.forEach(([y1, y2], f) => xs.forEach(([x1, x2], c) => {
      const e = ((d.celdas || [])[f] || [])[c];
      if (e && ve(e)) {
        s += `<g class="kit-aparece${nuevo(e)}">${T.barra(x1, y1, x2 - x1, y2 - y1, { color: e.color, relleno: 0.2 })}</g>`;
        if (e.t) s += T.rotulo((x1 + x2) / 2, (y1 + y2) / 2 + 6, e.t, { ancla: 'middle', peso: 700, clase: 'kit-aparece' + nuevo(e), min: x1 + 1, max: x2 - 1 });
      } else {
        s += `<rect x="${T.n(x1)}" y="${T.n(y1)}" width="${T.n(x2 - x1)}" height="${T.n(y2 - y1)}" rx="4" fill="none" stroke="currentColor" stroke-width="${T.GROSOR.cuadricula}" stroke-opacity="0.45"/>`;
      }
    }));
    const bajo = Y0 + LADO + 26;
    if (d.total && ve(d.total)) s += T.rotulo(X0 + LADO / 2, bajo, d.total.t, { ancla: 'middle', peso: 700, clase: 'kit-aparece' + nuevo(d.total) });
    const fa = estado.fantasma;
    if (fa && Array.isArray(fa.celdas)) {
      let c = '';
      for (const [f, k] of fa.celdas) {
        if (!xs[k] || !ys[f]) continue;
        const [x1, x2] = xs[k], [y1, y2] = ys[f];
        c += `<rect x="${T.n(x1 + 3)}" y="${T.n(y1 + 3)}" width="${T.n(x2 - x1 - 6)}" height="${T.n(y2 - y1 - 6)}" rx="3" fill="none" stroke="currentColor" stroke-width="${T.GROSOR.contorno}" stroke-dasharray="4 3"/>`;
      }
      if (fa.rotulo) c += T.rotulo(8, ALTO - 12, fa.rotulo, {});
      s += `<g class="kit-fantasma">${c}</g>`;
    }
    return T.svg(W, ALTO, s, { alt: alt(d) });
  }

  function alt(d) {
    if (d.alt) return d.alt;
    const w = (d.anchos || []).map(x => x.t).join(' + '), h = (d.altos || []).map(x => x.t).join(' + ');
    return `Rectángulo de ancho ${w} y alto ${h}, partido en piezas que son ancho por alto`;
  }

  return { id: 'alg-baldosas', dibujar, alt, geometria };
});
