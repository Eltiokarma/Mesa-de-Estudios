/*
 * Pieza «fis-cuentas» (física; docs/teoria.md, sección 4): barras de una cuenta de energía o de carga, con signo,
 * sobre una línea de cero común. Sirve para la primera ley (Q, W, ΔU), la máquina térmica (Q caliente, W, Q frío),
 * condensadores (Q, V, U) y potencias en un circuito.
 *
 * Afirmación de la figura: cada término es una barra con signo sobre el mismo cero; lo que entra sube, lo que sale baja,
 * y el resultado se lee comparando largos.
 *
 * Fidelidad: una sola escala para todas las barras (px por unidad = 82 / max). El largo dibujado es el valor.
 *
 * datos = {
 *   max: 600,                                     // el valor que llena media altura (mayor |valor| si no se da)
 *   barras: [{ rotulo: 'Q', valor: 500, texto: '+500 J', color: 'o', desde: 0 }],   // de 1 a 5, en orden
 *   igual: 2,                                     // opcional: índice de la barra que es el resultado (raya vertical antes)
 *   referencia: { valor: 1, texto: 'antes' }      // opcional: una raya horizontal a trazos en ese valor (lo de antes)
 * }
 * estado = {
 *   corte: 0..n,                                  // se dibujan las barras con desde ≤ corte (lo hecho se queda)
 *   fantasma: null | { indice, valor, rotulo }    // el error con nombre: una barra a trazos en esa columna
 * }
 * Todo número que se ve lo trae quien llama (texto). El dibujo es una función pura de (datos, estado).
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
  const W = 320, CERO = 136, MEDIA = 82, ALTO = 262, X0 = 24, X1 = 304;

  const tope = d => (d.max > 0 ? d.max : Math.max(1e-9, ...(d.barras || []).map(b => Math.abs(b.valor) || 0)));
  const largo = (d, v) => Math.max(-1, Math.min(1.08, v / tope(d))) * MEDIA;
  function columnas(d) {
    const n = Math.max(1, (d.barras || []).length), paso = (X1 - X0) / n;
    return Array.from({ length: n }, (_, k) => X0 + paso * (k + 0.5));
  }

  function barra(x, v, d, o) {
    const h = largo(d, v), w = o.ancho || 46;
    if (Math.abs(h) < 1.5) return T.linea(x - w / 2, CERO, x + w / 2, CERO, { grosor: T.GROSOR.variable, color: o.color, discontinua: o.discontinua });
    return T.barra(x - w / 2, h > 0 ? CERO - h : CERO, w, Math.abs(h), { color: o.color, grosor: o.discontinua ? T.GROSOR.contorno : T.GROSOR.variable, relleno: o.discontinua ? 0 : 0.22, discontinua: o.discontinua });
  }

  function dibujar(d, estado = {}) {
    const corte = estado.corte === undefined ? Infinity : estado.corte;
    const xs = columnas(d);
    let s = T.linea(X0 - 8, CERO, X1 + 8, CERO, { grosor: T.GROSOR.contorno });
    s += T.rotulo(X1 + 6, CERO - 6, '0', { ancla: 'end', clase: 'kit-num' });
    if (Number.isInteger(d.igual) && d.igual > 0 && d.igual < xs.length) {
      const xm = (xs[d.igual - 1] + xs[d.igual]) / 2;
      s += T.linea(xm, CERO - MEDIA - 8, xm, CERO + MEDIA + 8, { grosor: T.GROSOR.cuadricula, discontinua: true, opacidad: 0.6 });
    }
    if (d.referencia && Number.isFinite(d.referencia.valor)) {
      const yr = CERO - largo(d, d.referencia.valor);
      s += T.linea(X0 - 8, yr, X1 + 8, yr, { grosor: T.GROSOR.cuadricula, discontinua: true });
      if (d.referencia.texto) s += T.rotulo(X1 + 8, yr - 6, d.referencia.texto, { ancla: 'end', clase: 'kit-txt' });
    }
    (d.barras || []).forEach((b, k) => {
      const x = xs[k];
      // El rótulo de la magnitud va siempre arriba, en su color: la columna existe aunque su barra aún no aparezca.
      s += T.rotulo(x, 22, b.rotulo, { ancla: 'middle', color: b.color, peso: 700 });
      if ((b.desde || 0) > corte) { s += T.rotulo(x, CERO - 8, '?', { ancla: 'middle', peso: 700 }); return; }
      s += barra(x, b.valor, d, { color: b.color });
      const h = largo(d, b.valor);
      const y = h >= 0 ? CERO - h - 8 : CERO - h + 20;
      if (b.texto) s += T.rotulo(x, y, b.texto, { ancla: 'middle', peso: 700, clase: 'kit-txt kit-num', min: X0 - 20, max: W - 2 });
    });
    const f = estado.fantasma;
    if (f && Number.isInteger(f.indice) && xs[f.indice] !== undefined && Number.isFinite(f.valor)) {
      const x = xs[f.indice] + 36;
      s += `<g class="kit-fantasma">${barra(x, f.valor, d, { discontinua: true, ancho: 22 })}`
        + (f.rotulo ? T.rotulo(W / 2, ALTO - 6, f.rotulo, { ancla: 'middle', clase: 'kit-txt' }) : '') + '</g>';
    }
    return T.svg(W, ALTO, s, { alt: alt(d) });
  }

  function alt(d) {
    const bs = (d.barras || []).map(b => `${b.rotulo} ${b.texto || Kit.formatear(b.valor, 2)}`);
    return `Barras sobre un mismo cero (arriba positivo, abajo negativo): ${bs.join('; ') || 'sin barras'}.`;
  }

  return { id: 'fis-cuentas', dibujar, alt, constantes: { W, CERO, MEDIA, ALTO } };
});
