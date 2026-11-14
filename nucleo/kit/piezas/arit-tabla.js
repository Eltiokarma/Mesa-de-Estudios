/*
 * Pieza «arit-tabla» (aritmética; docs/teoria.md, sección 4): una tabla que se llena por pasos. Sirve para tablas
 * de verdad (cada fila es una valuación), registros de casos (entrada → salida), tablas de frecuencias, la
 * cuadrícula de dos dados (cada celda un resultado) y la tabla de exponentes de los divisores.
 *
 * Afirmación de la figura: cada fila es un caso que ya se comprobó; nada se afirma de una fila vacía.
 *
 * datos = {
 *   columnas: [{ t: 'p', color: 'o' }, …],            // encabezado; el color es el de la variable (regla 4)
 *   filas: [[celda, …], …],                            // celda = 'V' | 12 | { t: 'F', color, resalta, paso, tenue }
 *   cabeza: true,                                      // la primera columna es encabezado de fila (en negrita)
 *   filasMax: 8,                                       // filas reservadas (el alto no cambia entre estados)
 * }
 * estado = {
 *   paso: 0..n (o corte),       // una celda con paso > este se ve vacía (su lugar se reserva)
 *   fila: k | [k, …],           // fila(s) resaltada(s): la que se está mirando
 *   columna: k,                 // columna resaltada
 *   fantasma: null | { fila, columna, t, rotulo }   // lo que el error pondría en una celda, discontinuo
 * }
 * Una celda con resalta: true lleva fondo tenue de su color: es la celda que cumple. Con tenue: true se ve
 * atenuada: es la celda que quedó fuera (por ejemplo, fuera del universo restringido).
 * El dibujo es una función pura de (datos, estado): sin ids, sin azar, sin reloj.
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
  const W = 320, X0 = 4, X1 = 316, Y0 = 4, ALTO_FILA = 30, ALTO_CAB = 32;

  const celda = c => (c !== null && typeof c === 'object' ? c : { t: c === undefined || c === null ? '' : String(c) });
  const texto = c => String(celda(c).t === undefined ? '' : celda(c).t);

  function geometria(d) {
    const cols = d.columnas || [];
    const nf = Math.max(d.filasMax || 0, (d.filas || []).length);
    // Ancho de cada columna: el de su texto más largo, repartiendo el sobrante en partes iguales.
    const anchos = cols.map((c, j) => Math.max(T.ancho(texto(c), T.TEXTO, 700), ...(d.filas || []).map(f => T.ancho(texto(f[j]), T.TEXTO, 700))) + 14);
    const suma = anchos.reduce((a, b) => a + b, 0) || 1;
    const libre = (X1 - X0) - suma;
    const w = libre >= 0 ? anchos.map(a => a + libre / anchos.length) : anchos.map(a => a * (X1 - X0) / suma);
    const xs = [X0];
    for (const a of w) xs.push(xs[xs.length - 1] + a);
    return { xs, nf, alto: Y0 + ALTO_CAB + ALTO_FILA * nf + 6, filaY: i => Y0 + ALTO_CAB + ALTO_FILA * i, altoFila: ALTO_FILA, cabezaY: Y0 + ALTO_CAB / 2,
      celda: (i, j) => ({ x: (xs[j] + xs[j + 1]) / 2, y: Y0 + ALTO_CAB + ALTO_FILA * i + ALTO_FILA / 2 }) };
  }

  function dibujar(d, estado = {}) {
    const g = geometria(d);
    const paso = Math.max(0, estado.paso || estado.corte || 0);
    const filasR = new Set([].concat(estado.fila === undefined || estado.fila === null ? [] : estado.fila));
    const cols = d.columnas || [];
    let s = '';
    // Fila o columna que se mira: fondo tenue de tinta.
    for (const i of filasR) if (i >= 0 && i < g.nf) s += T.resaltado(X0, g.filaY(i), X1 - X0, ALTO_FILA, { radio: 4 });
    if (Number.isInteger(estado.columna) && estado.columna < cols.length) s += T.resaltado(g.xs[estado.columna], Y0, g.xs[estado.columna + 1] - g.xs[estado.columna], ALTO_CAB + ALTO_FILA * (d.filas || []).length, { radio: 4 });
    // Encabezado.
    cols.forEach((c, j) => {
      const cc = celda(c);
      s += T.rotulo((g.xs[j] + g.xs[j + 1]) / 2, Y0 + 22, texto(c), { ancla: 'middle', peso: 700, color: cc.color });
    });
    s += T.linea(X0, Y0 + ALTO_CAB, X1, Y0 + ALTO_CAB, { grosor: T.GROSOR.contorno });
    // Rejilla de 1 px: separadores de columna y de fila (todas las filas reservadas, llenas o no).
    let rej = '';
    for (let j = 1; j < cols.length; j++) rej += T.linea(g.xs[j], Y0 + 4, g.xs[j], g.filaY(g.nf) - 2, { grosor: T.GROSOR.cuadricula });
    for (let i = 1; i <= g.nf; i++) rej += T.linea(X0, g.filaY(i), X1, g.filaY(i), { grosor: T.GROSOR.cuadricula });
    s += `<g class="kit-tenue">${rej}</g>`;
    (d.filas || []).forEach((f, i) => {
      const y = g.filaY(i);
      f.forEach((c0, j) => {
        const c = celda(c0);
        if ((c.paso || 0) > paso) return;
        const nuevo = (c.paso || 0) === paso && paso > 0 ? ' kit-nuevo' : '';
        const xa = g.xs[j] + 2, xb = g.xs[j + 1] - 2;
        if (c.resalta) s += `<g class="kit-aparece${nuevo}">${T.barra(xa, y + 3, xb - xa, ALTO_FILA - 6, { color: c.color, relleno: 0.2, grosor: T.GROSOR.contorno })}</g>`;
        const peso = (d.cabeza && j === 0) || c.resalta ? 700 : 400;
        s += T.rotulo((xa + xb) / 2, y + 21, texto(c), { ancla: 'middle', peso, color: c.color, clase: `kit-aparece${nuevo}${c.tenue ? ' kit-tenue' : ''}` });
      });
    });
    const fa = estado.fantasma;
    if (fa && Number.isInteger(fa.fila) && Number.isInteger(fa.columna) && fa.columna < cols.length && fa.fila < g.nf) {
      const xa = g.xs[fa.columna] + 2, xb = g.xs[fa.columna + 1] - 2, y = g.filaY(fa.fila);
      s += `<g class="kit-fantasma"><rect x="${T.n(xa)}" y="${T.n(y + 3)}" width="${T.n(xb - xa)}" height="${ALTO_FILA - 6}" rx="4" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4"/>${T.rotulo((xa + xb) / 2, y + 21, String(fa.t === undefined ? '' : fa.t), { ancla: 'middle' })}</g>`;
    }
    return T.svg(W, g.alto, s, { alt: alt(d) });
  }

  function alt(d) {
    if (d.alt) return d.alt;
    const cab = (d.columnas || []).map(texto).join(', ');
    return `Tabla con columnas ${cab || '(sin columnas)'} y ${(d.filas || []).length} filas`;
  }

  return { id: 'arit-tabla', dibujar, alt, geometria };
});
