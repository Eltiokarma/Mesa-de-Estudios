/*
 * Pieza «quim-atomo» (sesión de teoría de Química): uno o dos átomos (o iones) en el modelo de capas, con el
 * núcleo contado (protones y neutrones) y los electrones en capas discontinuas. Sirve para partículas
 * subatómicas, Z y A, isótopos, iones e isoelectrónicos.
 *
 * Afirmación de la figura: el núcleo dice qué elemento es; los electrones de afuera solo dicen su carga.
 *
 * Fidelidad: el número de puntos de cada capa es el de los datos; los electrones que salen se dibujan fuera,
 * con su flecha, y los que llegan llevan un aro. Las capas son discontinuas a propósito: son niveles de energía
 * del modelo, no trayectorias (el alt lo dice). El tamaño no es a escala: el núcleo real es unas 10⁵ veces menor.
 *
 * Colores (los mismos tokens que la unidad): protones 'h', neutrones 'd', electrones 'i'.
 * datos = {
 *   atomos: [{ simbolo: 'Na', Z: 11, N: 12, capas: [2, 8, 1],   // electrones que quedan, por capa
 *              sale: { n: 1, desde: 1 },                         // electrones que se van (dibujados afuera)
 *              llega: { n: 0, desde },                           // de los de la última capa, cuántos llegaron
 *              titulo, rotulo, desde }],                         // uno o dos átomos
 *   alt
 * }
 * estado = { corte }. El dibujo es una función pura de (datos, estado). Alto fijo: 220.
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
  const W = 320, ALTO = 220, CY = 112, RN = 22;
  const f = n => Kit.formatear(n, 0);

  function atomoSVG(a, cx, ancho, corte) {
    const ve = x => !x || (x.desde || 0) <= corte;
    const nuevo = x => (x && (x.desde || 0) === corte && corte > 0 ? ' kit-nuevo kit-aparece' : '');
    const capas = (a.capas || []).filter((n, i, l) => n > 0 || i < l.length - 1);
    const nc = Math.max(1, capas.length + ((a.sale && a.sale.n > 0 && !capas.length) ? 1 : 0));
    const rmax = Math.min(ancho / 2 - 14, 84);
    const paso = (rmax - RN - 6) / nc;
    let s = '';
    // Capas (niveles del modelo): discontinuas.
    capas.forEach((n, i) => {
      const r = RN + 6 + paso * (i + 1);
      s += `<circle cx="${T.n(cx)}" cy="${CY}" r="${T.n(r)}" fill="none" stroke="currentColor" stroke-width="1" stroke-opacity="0.5" stroke-dasharray="3 4"/>`;
      const llegan = i === capas.length - 1 && a.llega ? a.llega.n || 0 : 0;
      for (let j = 0; j < n; j++) {
        const ang = -Math.PI / 2 + (2 * Math.PI * j) / n + i * 0.35;
        const x = cx + r * Math.cos(ang), y = CY + r * Math.sin(ang);
        const esNuevo = j >= n - llegan;
        if (esNuevo && !ve(a.llega)) continue;
        s += `<g class="kit-electron${esNuevo ? nuevo(a.llega) : ''}"><circle cx="${T.n(x)}" cy="${T.n(y)}" r="4.5" fill="var(--c-i)"/>`;
        if (esNuevo) s += `<circle cx="${T.n(x)}" cy="${T.n(y)}" r="8" fill="none" stroke="var(--c-i)" stroke-width="1.5"/>`;
        s += '</g>';
      }
    });
    // Núcleo: protones y neutrones contados.
    s += `<circle cx="${T.n(cx)}" cy="${CY}" r="${RN}" fill="var(--card)" stroke="currentColor" stroke-width="${T.GROSOR.contorno}"/>`;
    s += T.rotulo(cx, CY - 3, `${f(a.Z)}p`, { ancla: 'middle', peso: 700, color: 'h', tam: 14 });
    s += T.rotulo(cx, CY + 14, `${f(a.N)}n`, { ancla: 'middle', peso: 700, color: 'd', tam: 14 });
    // Electrones que salen: afuera, con su flecha.
    if (a.sale && a.sale.n > 0 && ve(a.sale)) {
      const rext = RN + 6 + paso * Math.max(1, capas.length);
      let q = '';
      for (let j = 0; j < a.sale.n; j++) {
        const ang = -Math.PI / 4 + j * 0.42;
        const x0 = cx + (rext - 2) * Math.cos(ang), y0 = CY + (rext - 2) * Math.sin(ang);
        const x1 = cx + (rext + 18) * Math.cos(ang), y1 = CY + (rext + 18) * Math.sin(ang);
        q += T.flecha(x0, y0, x1 - 6 * Math.cos(ang), y1 - 6 * Math.sin(ang), { color: 'i', grosor: T.GROSOR.cuadricula + 0.5 });
        q += `<circle cx="${T.n(x1 + 4 * Math.cos(ang))}" cy="${T.n(y1 + 4 * Math.sin(ang))}" r="4.5" fill="none" stroke="var(--c-i)" stroke-width="2" stroke-dasharray="2 2"/>`;
      }
      s += `<g class="kit-sale${nuevo(a.sale)}">${q}</g>`;
    }
    if (a.titulo) s += T.rotulo(cx, 18, a.titulo, { ancla: 'middle', peso: 700, min: cx - ancho / 2, max: cx + ancho / 2 });
    if (a.rotulo) s += T.rotulo(cx, ALTO - 8, a.rotulo, { ancla: 'middle', peso: 600, min: cx - ancho / 2, max: cx + ancho / 2, clase: 'kit-num' });
    return `<g class="kit-atomo${nuevo(a)}">${s}</g>`;
  }

  function dibujar(d, estado = {}) {
    const corte = Math.max(0, estado.corte || 0);
    const as = (d.atomos || []).slice(0, 2), n = Math.max(1, as.length), ancho = W / n;
    let s = '';
    as.forEach((a, k) => { if ((a.desde || 0) <= corte) s += atomoSVG(a, ancho * (k + 0.5), ancho, corte); });
    if (n === 2) s += T.linea(W / 2, 30, W / 2, ALTO - 30, { grosor: T.GROSOR.cuadricula, opacidad: 0.3 });
    return T.svg(W, ALTO, s, { alt: alt(d) });
  }

  function alt(d) {
    if (d.alt) return d.alt;
    const as = (d.atomos || []).map(a => {
      const e = (a.capas || []).reduce((x, y) => x + y, 0);
      return `${a.simbolo || 'átomo'}: ${f(a.Z)} protones y ${f(a.N)} neutrones en el núcleo, ${f(e)} electrones en capas ${(a.capas || []).join(', ')}${a.sale && a.sale.n ? `; salen ${f(a.sale.n)}` : ''}`;
    });
    return `Modelo de capas (niveles, no trayectorias; no a escala). ${as.join('. ')}.`;
  }

  return { id: 'quim-atomo', dibujar, alt };
});
