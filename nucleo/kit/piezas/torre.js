/*
 * Pieza «torre» (docs/pogil-v2-rive.md, sección 7.5, parte 4): la pista parada. Una regla vertical de 0 a `alto`
 * metros, el suelo, una o dos pelotas con las marcas que dejan cada medio segundo, la flecha de g (siempre del mismo
 * largo y siempre hacia abajo: g no cambia) y la flecha de v (su largo es la rapidez y su sentido, el de la velocidad).
 *
 * Afirmación de la figura: la flecha de g no cambia en ningún punto, tampoco arriba, donde v es cero.
 *
 * datos = {
 *   alto: 20,                                   // metros de la regla
 *   pelotas: [{ y, v, marcas: [y, …], rotulo, grande }],   // una o dos; y es la altura del punto más bajo de la pelota
 *   g: true,                                    // dibuja la flecha de g en cada pelota
 *   colores: { y, v, a },                       // opcional: tokens de la unidad (regla 4); por defecto y 'i', v 'h', a 'd'
 * }
 * Todo número que se ve lo trae quien llama. La pieza solo convierte metros a píxeles.
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
  const W = 320, ALTO_SVG = 262, SUELO = 232, TECHO = 44, RX = 52;      // la regla va de SUELO (0 m) a TECHO (alto)
  const COLUMNAS = [150, 236];                                          // centro de cada pelota
  const PX_V = 2.2;                                                     // px por m/s en la flecha de v
  const COLOR_BASE = { y: 'i', v: 'h', a: 'd' };

  const alto = d => (d.alto > 0 ? d.alto : 20);
  const Y = (d, y) => SUELO - (SUELO - TECHO) * y / alto(d);

  function dibujar(d) {
    const COLOR = Object.assign({}, COLOR_BASE, d.colores || {});
    let s = '';
    // Suelo y regla vertical con rayitas cada metro y números cada 5.
    s += T.linea(16, SUELO, W - 8, SUELO, { grosor: T.GROSOR.contorno, opacidad: 0.55 });
    let rr = T.linea(RX, SUELO, RX, TECHO, { grosor: T.GROSOR.contorno });
    for (let m = 0; m <= alto(d) + 1e-9; m++) {
      const grande = m % 5 === 0;
      rr += T.linea(RX, Y(d, m), RX - (grande ? 8 : 4), Y(d, m), { grosor: T.GROSOR.cuadricula, opacidad: grande ? 1 : 0.6 });
      if (grande) rr += T.rotulo(RX - 12, Y(d, m) + 5, Kit.formatear(m, 0), { ancla: 'end', clase: 'kit-num' });
    }
    rr += T.rotulo(RX + 8, 18, 'y (m)', { color: COLOR.y, peso: 700 });
    s += `<g class="kit-regla">${rr}</g>`;
    (d.pelotas || []).slice(0, 2).forEach((p, k) => {
      const cx = COLUMNAS[k], r = p.grande ? 12 : 8;
      // Marcas de cada medio segundo, a la izquierda de la columna (en el color de y: son posiciones).
      for (const m of p.marcas || []) s += T.linea(cx - 26, Y(d, m), cx - 18, Y(d, m), { grosor: T.GROSOR.variable, color: COLOR.y });
      const cy = Y(d, p.y || 0) - r;
      s += `<g class="kit-pelota kit-pelota-${k}"><circle cx="${T.n(cx)}" cy="${T.n(cy)}" r="${r}" fill="var(--card)" stroke="currentColor" stroke-width="${T.GROSOR.contorno}"/></g>`;
      if (d.g !== false) {
        s += T.flecha(cx + r + 6, cy - 10, cx + r + 6, cy + 18, { grosor: T.GROSOR.variable, color: COLOR.a });
        s += T.rotulo(cx + r + 12, cy + 18, 'g', { color: COLOR.a, peso: 700 });
      }
      if (Number.isFinite(p.v) && Math.abs(p.v) > 0.05) {
        const largo = Math.max(14, Math.abs(p.v) * PX_V), sg = Math.sign(p.v), x = cx - r - 6;
        s += T.flecha(x, cy, x, cy - sg * largo, { grosor: T.GROSOR.variable, color: COLOR.v });
        s += T.rotulo(x - 6, cy - sg * largo / 2 + 5, 'v', { color: COLOR.v, peso: 700, ancla: 'end' });
      }
      if (p.rotulo) s += T.rotulo(cx, SUELO + 22, p.rotulo, { ancla: 'middle', peso: 700, clase: 'kit-txt' });
    });
    return T.svg(W, ALTO_SVG, s, { alt: alt(d) });
  }

  function alt(d) {
    const ps = (d.pelotas || []).map((p, k) => `pelota ${p.rotulo || k + 1} a ${Kit.formatear(p.y || 0, 1)} m${Number.isFinite(p.v) ? `, v = ${Kit.formatear(p.v, 1)} m/s` : ''}`);
    return `Torre de ${Kit.formatear(alto(d), 0)} m: ${ps.join('; ') || 'sin pelotas'}${d.g !== false ? '; la flecha de g es igual en todo momento, hacia abajo' : ''}.`;
  }

  return { id: 'torre', dibujar, alt, escala: Y, constantes: { W, SUELO, TECHO, COLUMNAS } };
});
