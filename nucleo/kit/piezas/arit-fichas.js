/*
 * Pieza «arit-fichas» (aritmética; docs/teoria.md, sección 4): fichas iguales acomodadas en filas. Sirve para
 * agrupar en base b (cada fila llena se cambia por una ficha del orden siguiente), repartir en filas de m y ver
 * el sobrante (divisibilidad y división entera), armar rectángulos con n fichas (divisores, primos), el cuadrado
 * q × q con lo que falta para el siguiente (raíz entera) y escaleras de fichas (sucesiones).
 *
 * Afirmación de la figura: la cantidad de fichas no cambia al reacomodarlas; cambia solo cómo se agrupan.
 *
 * Fidelidad: todas las fichas de una figura tienen el mismo tamaño, también entre bloques (una ficha vale lo
 * mismo en todos lados). El tamaño sale de que el bloque más grande quepa; nunca se estira un bloque.
 *
 * datos = {
 *   bloques: [{
 *     n: 23, columnas: 5,            // n fichas, de izquierda a derecha y de arriba abajo, en filas de `columnas`
 *     filas: [3, 4, 2],              // o filas de largo dado (escaleras): reemplaza a n y columnas
 *     color: 'o', rotulo: '23',      // color de las fichas y rótulo debajo del bloque
 *     marcoFilas: true,              // contorno alrededor de cada fila llena (un grupo completo)
 *     tramos: [{ de: 20, a: 22, color: 'h', paso: 1 }],   // fichas k ∈ [de, a] con otro color desde ese paso
 *     huecos: 4,                     // fichas que faltan, punteadas, después de las n (para completar algo)
 *     huecosPaso: 1,
 *     paso: 0,                       // el bloque aparece en el paso `paso`
 *   }],
 *   ficha: 20,                       // tamaño máximo de la ficha en px del lienzo (se achica si no cabe)
 *   altoMax: 170,                    // alto reservado para las fichas (el alto no cambia entre estados)
 * }
 * estado = { paso: 0..n (o corte), fantasma: null | { bloque: k, huecos, rotulo } }
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
  const W = 320, X0 = 8, X1 = 312, Y0 = 8, SEP_BLOQUE = 18, ROT = 30;

  // Filas de un bloque: largo de cada fila (las fichas se cuentan en orden de lectura).
  function filasDe(b) {
    if (Array.isArray(b.filas)) return b.filas.map(x => Math.max(0, x | 0));
    const n = Math.max(0, (b.n | 0) + (b.huecos | 0)), c = Math.max(1, b.columnas | 0 || n || 1);
    const out = [];
    for (let k = 0; k < n; k += c) out.push(Math.min(c, n - k));
    return out;
  }

  function geometria(d) {
    const bs = d.bloques || [];
    const filas = bs.map(filasDe);
    const cols = filas.map(f => Math.max(1, ...f, 1)), nf = filas.map(f => Math.max(1, f.length));
    const altoMax = d.altoMax || 170;
    // Tamaño común: lo que permita que todos los bloques quepan a lo ancho y el más alto quepa a lo alto.
    const libre = (X1 - X0) - SEP_BLOQUE * Math.max(0, bs.length - 1);
    const porAncho = libre / Math.max(1, cols.reduce((a, b) => a + b, 0));
    const porAlto = altoMax / Math.max(1, ...nf);
    const paso = Math.max(5, Math.min(d.ficha || 20, porAncho, porAlto));
    const anchoTotal = cols.reduce((a, c) => a + c * paso, 0) + SEP_BLOQUE * Math.max(0, bs.length - 1);
    let x = X0 + Math.max(0, ((X1 - X0) - anchoTotal) / 2);
    const xs = cols.map(c => { const r = x; x += c * paso + SEP_BLOQUE; return r; });
    // Centro de la ficha número `idx` (en orden de lectura) del bloque k, y la caja del bloque: para las manijas del
    // gesto directo (docs/teoria.md §4b). Los bloques se apoyan abajo, como en dibujar.
    const y0 = k => Y0 + (altoMax - filas[k].length * paso);
    const ficha = (k, idx) => {
      const f = filas[k] || [];
      let i = 0, resto = Math.max(0, idx | 0);
      while (i < f.length - 1 && resto >= f[i]) { resto -= f[i]; i++; }
      return { x: xs[k] + Math.min(resto, Math.max(0, (f[i] || 1) - 1)) * paso + paso / 2, y: y0(k) + i * paso + paso / 2 };
    };
    const caja = k => ({ x: xs[k], y: y0(k), ancho: cols[k] * paso, alto: (filas[k] || []).length * paso });
    return { filas, cols, nf, paso, xs, altoMax, alto: Y0 + altoMax + ROT, ficha, caja, piso: Y0 + altoMax };
  }

  function dibujar(d, estado = {}) {
    const g = geometria(d);
    const pasoE = Math.max(0, estado.paso || estado.corte || 0);
    const nuevo = p => ((p || 0) === pasoE && pasoE > 0 ? ' kit-nuevo' : '');
    const r = Math.max(2, g.paso * 0.38);
    let s = '';
    (d.bloques || []).forEach((b, k) => {
      if ((b.paso || 0) > pasoE) return;
      const filas = g.filas[k], x0 = g.xs[k];
      const altoB = filas.length * g.paso, y0 = Y0 + (g.altoMax - altoB);   // los bloques se apoyan abajo
      const nLlenas = Array.isArray(b.filas) ? Infinity : (b.n | 0);
      let cuerpo = '', idx = 0;
      filas.forEach((largo, i) => {
        const y = y0 + i * g.paso + g.paso / 2;
        const llena = Array.isArray(b.filas) || (i + 1) * (b.columnas | 0) <= nLlenas;
        if (b.marcoFilas && llena && largo === g.cols[k] && !Array.isArray(b.filas)) {
          cuerpo += `<rect class="kit-aparece${nuevo(b.marcoPaso)}" x="${T.n(x0 + 1)}" y="${T.n(y - g.paso / 2 + 1)}" width="${T.n(largo * g.paso - 2)}" height="${T.n(g.paso - 2)}" rx="${T.n(g.paso / 2)}" fill="none" stroke="${T.color(b.color)}" stroke-width="${T.GROSOR.contorno}"${(b.marcoPaso || 0) > pasoE ? ' opacity="0"' : ''}/>`;
        }
        for (let j = 0; j < largo; j++, idx++) {
          const cx = x0 + j * g.paso + g.paso / 2;
          if (idx >= nLlenas) {     // hueco: la ficha que falta
            if ((b.huecosPaso || 0) > pasoE) continue;
            cuerpo += `<circle class="kit-aparece${nuevo(b.huecosPaso)}" cx="${T.n(cx)}" cy="${T.n(y)}" r="${T.n(r)}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3"/>`;
            continue;
          }
          let c = b.color, cl = '';
          for (const t of b.tramos || []) if (idx >= t.de && idx <= t.a && (t.paso || 0) <= pasoE) { c = t.color; cl = nuevo(t.paso); }
          cuerpo += `<circle class="kit-aparece${cl}" cx="${T.n(cx)}" cy="${T.n(y)}" r="${T.n(r)}" fill="${T.color(c)}" fill-opacity="0.85" stroke="${T.color(c)}" stroke-width="1.5"/>`;
        }
      });
      if (b.rotulo) cuerpo += T.rotulo(x0 + g.cols[k] * g.paso / 2, Y0 + g.altoMax + 22, b.rotulo, { ancla: 'middle', peso: 700, color: b.color });
      s += `<g class="kit-bloque${nuevo(b.paso)}">${cuerpo}</g>`;
    });
    const f = estado.fantasma;
    if (f && (d.bloques || [])[f.bloque] && f.rotulo) {
      s += T.rotulo(X1, Y0 + 14, f.rotulo, { ancla: 'end', clase: 'kit-fantasma' });
    }
    return T.svg(W, g.alto, s, { alt: alt(d) });
  }

  function alt(d) {
    if (d.alt) return d.alt;
    const bs = (d.bloques || []).map(b => {
      if (Array.isArray(b.filas)) return `escalera de filas ${b.filas.join(', ')}`;
      const c = b.columnas | 0 || b.n, q = Math.floor(b.n / c), rr = b.n - q * c;
      return `${b.n} fichas en filas de ${c}: ${q} filas llenas${rr ? ` y ${rr} sueltas` : ''}${b.huecos ? `; faltan ${b.huecos}` : ''}`;
    });
    return `Fichas: ${bs.join('; ') || 'ninguna'}`;
  }

  return { id: 'arit-fichas', dibujar, alt, geometria };
});
