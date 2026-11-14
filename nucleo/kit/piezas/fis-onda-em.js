/*
 * Pieza «fis-onda-em» (física, ondas electromagnéticas): una onda plana vista en perspectiva oblicua. El campo
 * eléctrico oscila en el plano vertical; el magnético, en el plano que va hacia el fondo; los dos avanzan sobre el
 * mismo eje.
 *
 * Afirmación de la figura: E y B son perpendiculares entre sí y al avance, y tienen sus crestas en el mismo lugar.
 *
 * Fidelidad: E y B se dibujan con la misma forma senoidal y la misma fase (se calculan con una sola función); el alto
 * de E es proporcional a E₀ y el de B, a B₀ = E₀/c en la misma escala relativa. La profundidad es una proyección
 * oblicua fija (cualitativa, se declara en el alt).
 *
 * datos = {
 *   amplitud: 0..1,            // E₀ relativo al máximo dibujable
 *   ciclos: 1..4,              // cuántas longitudes de onda caben en el eje (la longitud de onda, al revés)
 *   colores: { E: 'o', B: 'i', l: 'd' },
 *   rotuloL: 'λ = 4 m',        // cota de una longitud de onda (opcional; lo escribe quien llama)
 *   nota: 'vacío: avanza a c'  // texto bajo el eje (opcional)
 * }
 * estado = { paso }: 1 campo E · 2 campo B · 3 crestas alineadas y cota de λ. Sin paso, todo a la vista (rastro).
 * El dibujo es una función pura de (datos, estado).
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
  const W = 320, ALTO = 214, X0 = 34, X1 = 286, EJE = 104, AMAX = 62, PZ = [-0.62, 0.5];
  const BASE = { E: 'o', B: 'i', l: 'd' };

  function puntos(d) {
    const a = Math.max(0, Math.min(1, d.amplitud === undefined ? 0.7 : d.amplitud)) * AMAX;
    const L = (X1 - X0) / Math.max(0.5, d.ciclos || 2);
    const pE = [], pB = [];
    for (let k = 0; k <= 96; k++) {
      const x = X0 + (X1 - X0) * k / 96, s = Math.sin(2 * Math.PI * (x - X0) / L);
      pE.push([x, EJE - a * s]);
      pB.push([x + PZ[0] * a * 0.8 * s, EJE + PZ[1] * a * 0.8 * s]);
    }
    return { a, L, pE, pB };
  }
  const camino = ps => 'M' + ps.map(p => `${T.n(p[0])} ${T.n(p[1])}`).join('L');

  function dibujar(d, estado = {}) {
    const C = Object.assign({}, BASE, d.colores || {}), ve = k => !Number.isFinite(estado.paso) || estado.paso >= k;
    const { a, L, pE, pB } = puntos(d);
    let s = '';
    // Planos de referencia, tenues: el vertical (de E) y el que va al fondo (de B).
    s += `<path d="M${X0} ${EJE - AMAX - 6}L${X1} ${EJE - AMAX - 6}L${X1} ${EJE + AMAX * 0.3}L${X0} ${EJE + AMAX * 0.3}Z" fill="none" stroke="currentColor" stroke-width="1" stroke-opacity="0.25"/>`;
    const dz = [PZ[0] * AMAX * 0.85, PZ[1] * AMAX * 0.85];
    s += `<path d="M${T.n(X0 - dz[0])} ${T.n(EJE - dz[1])}L${T.n(X1 - dz[0])} ${T.n(EJE - dz[1])}L${T.n(X1 + dz[0])} ${T.n(EJE + dz[1])}L${T.n(X0 + dz[0])} ${T.n(EJE + dz[1])}Z" fill="none" stroke="currentColor" stroke-width="1" stroke-opacity="0.25"/>`;
    // Varillas cada octavo de onda (1 px), del eje a cada curva: dicen «esto es el campo en ese punto».
    if (ve(2)) {
      for (let k = 0; k <= 96; k += 3) { const p = pB[k], x0 = X0 + (X1 - X0) * k / 96; s += T.linea(x0, EJE, p[0], p[1], { grosor: 1, color: C.B, opacidad: 0.55 }); }
      s += `<path class="kit-aparece" d="${camino(pB)}" fill="none" stroke="${T.color(C.B)}" stroke-width="3" stroke-linejoin="round"/>`;
    }
    // Eje de avance con su flecha.
    s += T.flecha(X0 - 10, EJE, X1 + 24, EJE, { grosor: T.GROSOR.contorno });
    s += T.rotulo(X1 + 24, EJE + 22, 'avance', { ancla: 'end' });
    if (ve(1)) {
      for (let k = 0; k <= 96; k += 3) { const p = pE[k]; s += T.linea(p[0], EJE, p[0], p[1], { grosor: 1, color: C.E, opacidad: 0.55 }); }
      s += `<path class="kit-aparece" d="${camino(pE)}" fill="none" stroke="${T.color(C.E)}" stroke-width="3" stroke-linejoin="round"/>`;
    }
    // La primera cresta: una flecha de cada campo, con su nombre.
    const xc = X0 + L / 4;
    if (ve(1) && a > 1) s += T.flecha(xc, EJE, xc, EJE - a, { grosor: T.GROSOR.variable, color: C.E }) + T.rotulo(xc + 6, EJE - a - 6, 'E', { color: C.E, peso: 700 });
    if (ve(2) && a > 1) {
      const bx = xc + PZ[0] * a * 0.8, by = EJE + PZ[1] * a * 0.8;
      s += T.flecha(xc, EJE, bx, by, { grosor: T.GROSOR.variable, color: C.B }) + T.rotulo(bx - 4, by + 18, 'B', { color: C.B, peso: 700, ancla: 'end' });
    }
    if (ve(3) && Number.isFinite(estado.paso)) {
      s += T.linea(xc, EJE - AMAX - 10, xc, EJE + AMAX * 0.6, { discontinua: true, grosor: 1 });
      s += T.rotulo(xc + 6, EJE + AMAX * 0.6 + 14, 'crestas juntas', { peso: 600 });
    }
    if (d.rotuloL && ve(3)) {
      const y = 18;
      s += T.cota(xc, xc + L, y + 8, { color: C.l }) + T.rotulo(xc + L / 2, y, d.rotuloL, { ancla: 'middle', color: C.l, peso: 700 });
    }
    if (d.nota) s += T.rotulo(W / 2, ALTO - 8, d.nota, { ancla: 'middle', peso: 700 });
    return T.svg(W, ALTO, s, { alt: alt(d) });
  }

  function alt(d) {
    return `Onda electromagnética que avanza hacia la derecha: el campo eléctrico oscila arriba y abajo y el magnético hacia el fondo, perpendiculares, con las crestas en el mismo lugar; caben ${Kit.formatear(d.ciclos || 2, 1)} longitudes de onda${d.nota ? `; ${d.nota}` : ''}.`;
  }

  return { id: 'fis-onda-em', dibujar, alt, puntos, constantes: { W, ALTO, X0, X1, EJE } };
});
