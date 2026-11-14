/*
 * Pieza «fis-dimensiones» (física, magnitudes y análisis dimensional): una tabla de fichas de dimensión.
 * Cada columna es un término de una ecuación (o una magnitud); cada fila, una dimensión fundamental (M, L, T).
 * En cada casilla hay tantas fichas como el exponente: llenas si es positivo y huecas (discontinuas) si es negativo.
 *
 * Afirmación de la figura: una ecuación es homogénea cuando todos sus términos tienen la misma fila de fichas de M, L y T.
 *
 * datos = {
 *   filas: ['M', 'L', 'T'],                         // dimensiones fundamentales (por defecto M, L, T)
 *   columnas: [{ nombre: 'x', color: 'i', exps: [0, 1, 0], desde: 0, oculta: 2, signo: '=' }, …],
 *             // exps: exponente de cada fila; desde: paso en que aparece la columna;
 *             // oculta: hasta ese paso (excluido) muestra «?» en vez de fichas (la incógnita);
 *             // signo: lo que se escribe entre esta columna y la anterior ('=', '+', '·'), opcional
 * }
 * estado = { corte: 0..n, final: false, resalta: [i, …] }   // resalta: columnas que se comparan (borde de 3 px)
 * El dibujo es una función pura de (datos, estado). Alto fijo para unos datos: 3 filas → 212 px.
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
  const W = 320, X0 = 34, CAB = 40, FILA = 54, FICHA = 14, ENTRE = 3;
  const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const filasDe = d => (Array.isArray(d.filas) && d.filas.length ? d.filas : ['M', 'L', 'T']);

  // «M L² T⁻²»; sin dimensiones, «1».
  function texto(exps, filas = ['M', 'L', 'T']) {
    const partes = filas.map((f, i) => {
      const e = exps[i] || 0;
      if (!e) return '';
      return e === 1 ? f : f + String(e).split('').map(c => SUP[c]).join('');
    }).filter(Boolean);
    return partes.length ? partes.join(' ') : '1';
  }

  const ve = (c, corte) => (c.desde || 0) <= corte;
  const oculta = (c, estado) => !estado.final && Number.isFinite(c.oculta) && (estado.corte || 0) < c.oculta;

  function dibujar(d, estado = {}) {
    const filas = filasDe(d), cols = d.columnas || [];
    const n = Math.max(1, cols.length), ancho = (W - X0) / n;
    const alto = CAB + filas.length * FILA + 10;
    const corte = estado.final ? Infinity : estado.corte || 0;
    let s = '';
    // Rótulos de fila (dimensiones fundamentales) y líneas guía tenues.
    filas.forEach((f, i) => {
      const y = CAB + i * FILA;
      s += T.rotulo(4, y + FILA / 2 + 6, f, { peso: 700 });
      s += T.linea(X0 - 4, y, W - 2, y, { grosor: T.GROSOR.cuadricula, opacidad: 0.35 });
    });
    s += T.linea(X0 - 4, CAB + filas.length * FILA, W - 2, CAB + filas.length * FILA, { grosor: T.GROSOR.cuadricula, opacidad: 0.35 });
    cols.forEach((c, k) => {
      if (!ve(c, corte)) return;
      const x = X0 + k * ancho, cx = x + ancho / 2;
      if (k > 0 && c.signo) s += T.rotulo(x, 24, c.signo, { ancla: 'middle', peso: 700 });
      s += T.rotulo(cx, 24, c.nombre || '', { ancla: 'middle', peso: 700, color: c.color, min: x + 4, max: x + ancho - 4 });
      if ((estado.resalta || []).includes(k)) {
        s += `<rect x="${T.n(x + 6)}" y="${T.n(CAB - 4)}" width="${T.n(ancho - 12)}" height="${T.n(filas.length * FILA + 8)}" rx="8" fill="none" stroke="${T.color(c.color)}" stroke-width="${T.GROSOR.variable}"/>`;
      }
      filas.forEach((f, i) => {
        const y = CAB + i * FILA, cy = y + FILA / 2;
        if (oculta(c, estado)) { s += T.rotulo(cx, cy + 6, '?', { ancla: 'middle', peso: 700, color: c.color }); return; }
        const e = (c.exps || [])[i] || 0;
        if (!e) { s += T.rotulo(cx, cy + 6, '0', { ancla: 'middle', clase: 'kit-num kit-tenue' }); return; }
        const m = Math.min(Math.abs(e), 4), tot = m * FICHA + (m - 1) * ENTRE;
        for (let j = 0; j < m; j++) {
          const fx = cx - tot / 2 + j * (FICHA + ENTRE), fy = cy - 17;
          s += e > 0
            ? `<rect x="${T.n(fx)}" y="${T.n(fy)}" width="${FICHA}" height="${FICHA}" rx="2" fill="${T.color(c.color)}"/>`
            : `<rect x="${T.n(fx + 1)}" y="${T.n(fy + 1)}" width="${FICHA - 2}" height="${FICHA - 2}" rx="2" fill="none" stroke="${T.color(c.color)}" stroke-width="${T.GROSOR.contorno}" stroke-dasharray="3 2"/>`;
        }
        s += T.rotulo(cx, cy + 17, f + (e === 1 ? '' : String(e).split('').map(ch => SUP[ch]).join('')), { ancla: 'middle', clase: 'kit-num', color: c.color });
      });
    });
    return T.svg(W, alto, s, { alt: alt(d) });
  }

  function alt(d) {
    const filas = filasDe(d);
    const cs = (d.columnas || []).map(c => `${c.nombre}: ${Number.isFinite(c.oculta) ? 'incógnita' : texto(c.exps || [], filas)}`);
    return `Tabla de fichas de dimensión (${filas.join(', ')}): ${cs.join('; ') || 'sin columnas'}. Fichas llenas, exponente positivo; huecas, negativo.`;
  }

  return { id: 'fis-dimensiones', dibujar, alt, texto, constantes: { W, CAB, FILA } };
});
