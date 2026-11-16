/*
 * Pieza «fis-combi» (16 nov 2026, contrato «se entiende sin profesor», docs/plan-calidad.md): una combi en una pista
 * con los metros marcados. Muestra dónde está en cada segundo: lo que avanza en un segundo se ve como un tramo.
 * Reemplaza los saltos sueltos sobre una recta, que hablaban de una combi que no se dibujaba.
 *
 * Afirmación de la figura: una rapidez dice cuántos metros se avanzan en cada segundo; tramos iguales en tiempos iguales.
 *
 * datos = {
 *   v: 20,                 // m que avanza en cada segundo
 *   segundos: 5,           // cuántos segundos se dibujan (la combi queda en v · segundos)
 *   max: 100,              // m: largo de la pista dibujada
 *   paso: 10, numero: 20,  // rayita cada `paso` m y número cada `numero` m
 *   color: 'o',            // color de la variable (regla 4)
 *   rotulos: true,         // escribe «1 s», «2 s»… sobre cada combi y el largo del primer tramo
 * }
 * estado = { corte } (opcional): dibuja solo hasta ese segundo (la línea de tiempo de «Mira»).
 * Función pura de (datos, estado): sin ids, sin azar, sin reloj. La combi es un dibujo de prueba (data-prueba).
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
  const W = 320, H = 184, X0 = 26, X1 = 298, PISTA = 92, EJE = 144, CW = 40, CH = 22;
  const BASE = { v: 20, segundos: 0, max: 100, paso: 10, numero: 20, color: 'o', rotulos: true };
  const n = T.n;
  const conBase = d => Object.assign({}, BASE, d || {});
  const escala = d => m => X0 + (X1 - X0) * Math.max(0, Math.min(d.max, m)) / d.max;

  // La combi (dibujo de prueba): carrocería con ventanas y dos ruedas; su frente está en x.
  function combi(x, y, fantasma) {
    const x0 = x - CW;
    let s = `<path d="M${n(x0)} ${n(y - 4)}L${n(x0)} ${n(y - CH + 4)}Q${n(x0)} ${n(y - CH)} ${n(x0 + 4)} ${n(y - CH)}L${n(x - 10)} ${n(y - CH)}L${n(x)} ${n(y - 10)}L${n(x)} ${n(y - 4)}Z" fill="var(--card)" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`;
    s += `<rect x="${n(x0 + 4)}" y="${n(y - CH + 4)}" width="9" height="7" rx="1.5" fill="currentColor" fill-opacity="0.25"/>`
      + `<rect x="${n(x0 + 16)}" y="${n(y - CH + 4)}" width="9" height="7" rx="1.5" fill="currentColor" fill-opacity="0.25"/>`;
    for (const cx of [x0 + 9, x - 9]) s += `<circle cx="${n(cx)}" cy="${n(y - 2)}" r="4.5" fill="currentColor"/>`;
    return `<g class="kit-objeto${fantasma ? ' kit-fantasma' : ''}" data-objeto="combi" data-prueba="si"${fantasma ? ' opacity="0.35"' : ''}>${s}</g>`;
  }

  function dibujar(datos, estado = {}) {
    const d = conBase(datos), X = escala(d), c = T.color(d.color);
    const hasta = Number.isFinite(estado.corte) ? Math.max(0, Math.min(d.segundos, estado.corte)) : d.segundos;
    // pista: asfalto con su línea discontinua
    let s = `<rect x="8" y="${PISTA - 34}" width="${W - 16}" height="40" rx="6" fill="currentColor" fill-opacity="0.08"/>`
      + `<line x1="12" y1="${PISTA - 14}" x2="${W - 12}" y2="${PISTA - 14}" stroke="currentColor" stroke-width="1.5" stroke-dasharray="8 8" stroke-opacity="0.35"/>`;
    // eje de metros
    s += `<line x1="${X0}" y1="${EJE}" x2="${X1}" y2="${EJE}" stroke="currentColor" stroke-width="1.5"/>`;
    for (let m = 0; m <= d.max + 1e-9; m += d.paso) {
      const esN = Math.abs(m / d.numero - Math.round(m / d.numero)) < 1e-9;
      s += `<line x1="${n(X(m))}" y1="${EJE}" x2="${n(X(m))}" y2="${EJE + (esN ? 8 : 5)}" stroke="currentColor" stroke-width="1"/>`;
      if (esN) s += T.rotulo(X(m), EJE + 24, Kit.formatear(m, 0), { ancla: 'middle', tam: 14 });
    }
    s += T.rotulo(X1, EJE - 6, 'm', { ancla: 'end', tam: 14, peso: 700 });
    // tramos de cada segundo, en el color de la variable
    for (let k = 1; k <= hasta; k++) {
      const a = X((k - 1) * d.v), b = X(k * d.v);
      s += `<line x1="${n(a)}" y1="${PISTA + 12}" x2="${n(b)}" y2="${PISTA + 12}" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`
        + `<line x1="${n(b)}" y1="${PISTA + 6}" x2="${n(b)}" y2="${PISTA + 18}" stroke="${c}" stroke-width="2"/>`;
    }
    if (d.rotulos && hasta >= 1) s += T.rotulo((X(0) + X(d.v)) / 2, PISTA + 34, `${Kit.formatear(d.v, 2)} m`, { ancla: 'middle', tam: 14, peso: 700, color: d.color });
    // combis: las de los segundos anteriores, tenues; la última, firme
    for (let k = 0; k <= hasta; k++) {
      const x = X(k * d.v) + CW / 2;
      s += combi(Math.min(W - 6, x), PISTA - 16, k < hasta);
      if (d.rotulos && hasta > 0) s += T.rotulo(Math.min(W - 6, x) - CW / 2, PISTA - 44, `${k} s`, { ancla: 'middle', tam: 14, color: k === hasta ? d.color : undefined });
    }
    return T.svg(W, H, s, { alt: alt(d, hasta) });
  }

  function alt(datos, hasta) {
    const d = conBase(datos), k = Number.isFinite(hasta) ? hasta : d.segundos;
    return k ? `Una combi en una pista con metros marcados. Avanza ${Kit.formatear(d.v, 2)} m en cada segundo; a los ${k} s está en ${Kit.formatear(k * d.v, 2)} m.`
      : 'Una combi en el inicio de una pista con los metros marcados.';
  }

  return { id: 'fis-combi', dibujar, alt: d => alt(d), escala: d => escala(conBase(d)), constantes: { W, H, X0, X1, CW } };
});
