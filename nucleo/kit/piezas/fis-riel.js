/*
 * Pieza «fis-riel» (física, docs/teoria.md): un riel visto en filas de tiempo (antes, durante, después), con
 * carritos que llevan su masa escrita y su flecha de velocidad a escala. Sirve para cantidad de movimiento,
 * choques, explosiones y restitución.
 *
 * Afirmación de la figura: cada flecha de velocidad está a escala; comparar la fila de antes con la de después
 * deja ver qué cambió y qué se conservó.
 *
 * Fidelidad: una sola escala de velocidad (px por m/s) para todas las flechas de la figura, y una sola escala de
 * posición (px por m) para el riel. Carritos que se tocan y llevan la misma velocidad comparten una sola flecha
 * («A y B: 2 m/s»): salen pegados. La pieza da `pegado(d, x)`: dónde va el segundo carrito para tocar al primero.
 *
 * datos = {
 *   largo: 10,                         // metros de riel visibles (de 0 a largo)
 *   escalaV: 10,                       // px por m/s (la misma en todas las filas)
 *   colores: { v: 'o' },               // color de la velocidad (regla 4)
 *   filas: [{ rotulo: 'Antes', nota: 'p = 6 kg·m/s', desde: 0,
 *             carros: [{ x: 2, m: 2, v: 3, rotulo: 'A', variante: 'a' | 'b', fantasma: false }] }]   // hasta 3 filas
 * }
 * estado = { corte: n }   // se dibujan las filas con desde ≤ corte (lo de antes se queda: rastro)
 * El dibujo es una función pura de (datos, estado): sin ids, sin azar, sin reloj. Alto fijo para unos datos.
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
  const W = 320, PX0 = 30, PX1 = 300, FILA = 104, ARRIBA = 8, CW = 46, CH = 26, RR = 5;

  const largo = d => (d.largo > 0 ? d.largo : 10);
  const X = (d, x) => PX0 + (PX1 - PX0) * x / largo(d);
  const filas = d => (d.filas || []).slice(0, 3);
  const alto = d => ARRIBA + Math.max(1, filas(d).length) * FILA + 4;
  const pisoDe = k => ARRIBA + k * FILA + 74;

  function carro(cx, piso, c, cv) {
    const disc = c.fantasma ? ' stroke-dasharray="5 4"' : '';
    const op = c.fantasma ? ' opacity="0.7"' : '';
    let s = `<g class="kit-carro"${op}>`;
    s += `<rect x="${T.n(cx - CW / 2)}" y="${T.n(piso - CH - RR)}" width="${CW}" height="${CH - 2}" rx="${c.variante === 'b' ? 2 : 7}" fill="var(--card)" stroke="currentColor" stroke-width="${T.GROSOR.contorno}"${disc}/>`;
    for (const dx of [-CW / 2 + 10, CW / 2 - 10]) s += `<circle cx="${T.n(cx + dx)}" cy="${T.n(piso - RR)}" r="${RR}" fill="var(--card)" stroke="currentColor" stroke-width="${T.GROSOR.contorno}"/>`;
    if (Number.isFinite(c.m)) s += T.rotulo(cx, piso - RR - 9, `${Kit.formatear(c.m, 1)} kg`, { ancla: 'middle', peso: 600, tam: 14 });
    s += '</g>';
    return s;
  }

  // Flecha de velocidad a escala sobre un grupo de carritos (uno solo, o varios pegados con la misma v).
  function velocidad(cx, piso, cs, cv) {
    const vv = cs[0].v;
    if (!Number.isFinite(vv)) return '';
    const yv = piso - CH - RR - 14;
    const quien = cs.map(c => c.rotulo).filter(Boolean).join(' y ');
    if (Math.abs(vv) < 1e-9) return T.rotulo(cx, yv - 2, `${quien ? quien + ': ' : ''}v = 0`, { ancla: 'middle', color: cv.color, peso: 700, clase: 'kit-txt' });
    const L = Math.abs(vv) * cv.escala, sg = Math.sign(vv);
    const x1 = cx - sg * Math.min(L, 14) / 2, x2 = x1 + sg * L;
    return T.flecha(x1, yv, x2, yv, { grosor: T.GROSOR.variable, color: cv.color })
      + T.rotulo((x1 + x2) / 2, yv - 9, `${quien ? quien + ': ' : ''}${Kit.formatear(vv, 2)} m/s`, { ancla: 'middle', color: cv.color, peso: 700, clase: 'kit-txt' });
  }
  // Carritos que se tocan (a menos de un carrito y 6 px) y llevan la misma velocidad van juntos: una sola flecha.
  function grupos(d, cs) {
    const orden = cs.slice().sort((a, b) => (a.x || 0) - (b.x || 0)), gs = [];
    for (const c of orden) {
      const g = gs[gs.length - 1], u = g && g[g.length - 1];
      if (u && X(d, c.x || 0) - X(d, u.x || 0) <= CW + 6 && Math.abs((c.v || 0) - (u.v || 0)) < 1e-9) g.push(c); else gs.push([c]);
    }
    return gs;
  }

  function dibujar(d, estado = {}) {
    const corte = Number.isFinite(estado.corte) ? estado.corte : Infinity;
    const cv = { escala: d.escalaV > 0 ? d.escalaV : 10, color: (d.colores && d.colores.v) || 'o' };
    let s = '';
    filas(d).forEach((f, k) => {
      const piso = pisoDe(k);
      const ve = (f.desde || 0) <= corte;
      s += T.linea(PX0 - 22, piso, PX1 + 14, piso, { grosor: T.GROSOR.contorno, opacidad: ve ? 0.55 : 0.2 });
      if (f.rotulo) s += T.rotulo(4, piso + 20, f.rotulo, { peso: 700 });
      if (!ve) return;
      if (f.nota) s += T.rotulo(W - 4, piso + 20, f.nota, { ancla: 'end', clase: 'kit-num' });
      for (const c of f.carros || []) s += carro(X(d, c.x || 0), piso, c, cv);
      for (const g of grupos(d, f.carros || [])) {
        const cx = (X(d, g[0].x || 0) + X(d, g[g.length - 1].x || 0)) / 2;
        s += velocidad(cx, piso, g, cv);
      }
    });
    return T.svg(W, alto(d), s, { alt: alt(d) });
  }

  // El texto alternativo cuenta la relación: qué velocidad lleva cada carrito en cada fila.
  function alt(d) {
    const fs = filas(d).map(f => `${f.rotulo || 'fila'}: ${(f.carros || []).map(c => `${c.rotulo || 'carrito'} de ${Kit.formatear(c.m, 1)} kg a ${Kit.formatear(c.v || 0, 2)} m/s`).join(', ') || 'sin carritos'}${f.nota ? ` (${f.nota})` : ''}`);
    return `Riel con carritos. ${fs.join('; ') || 'Sin filas'}. Las flechas de velocidad están a la misma escala.`;
  }

  // x del carrito que toca por la derecha al que está en x (para dibujar dos carritos pegados).
  const pegado = (d, x) => x + (CW + 2) * largo(d) / (PX1 - PX0);
  return { id: 'fis-riel', dibujar, alt, escala: X, pegado, constantes: { W, PX0, PX1, FILA, CW } };
});
