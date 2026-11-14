/*
 * Pieza «alg-tabla» (Álgebra, docs/teoria.md §4): una tabla de celdas con texto, que se llena por pasos. Sirve
 * para tablas de verdad, sustitución de candidatos, Ruffini y Horner, matrices, el triángulo de Pascal,
 * tablas de signos y tablas de operación. Las flechas entre celdas dibujan el aspa, la bajada de Ruffini
 * o el «multiplica y suma».
 *
 * Afirmación de la figura: cada casilla sale de otras que ya se ven; nada aparece sin su origen.
 *
 * datos = {
 *   columnas: ['p', 'q', 'p → q'],                 // encabezados (texto) o null; van en tinta, o en color con colorCol
 *   colorCol: ['o', 'i', 'd'],                     // color de cada encabezado (regla 4)
 *   filas: [['V', 'V', 'V'], …],                   // celdas: texto | { t, color, desde, marca: 'ok'|'no', fuerte, hueco }
 *   rotulosFila: ['x = 0', …],                     // rótulo a la izquierda de cada fila (opcional)
 *   colorFila: ['o', …],
 *   separador: { fila: 2 } | { columna: 3 },       // línea gruesa antes de esa fila o columna (Ruffini, resto)
 *   corchetes: true,                               // matriz: corchetes a los lados, sin rejilla
 *   triangular: true,                              // Pascal: cada fila centrada y con su largo (sin celdas vacías)
 *   flechas: [{ de: [f, c], a: [f, c], color, desde, rotulo }],   // flecha entre centros de celdas
 *   resaltes: [{ f, c, alto: 1, ancho: 1, color, desde }],        // recuadro tenue detrás de un bloque
 *   pie: 'y 18 órdenes más',                       // una línea bajo la tabla (si hay fantasma con rótulo, manda el fantasma)
 *   alt: 'texto'                                   // si no, lo arma alt()
 * }
 * estado = { corte, final, fantasma: null | { f, c, t, rotulo } }
 *   Una celda (o flecha o resalte) con desde > corte se dibuja vacía: la casilla está, el valor todavía no.
 *   El fantasma escribe, discontinuo, el valor de un error en su casilla, con su rótulo debajo de la tabla.
 * El dibujo es una función pura de (datos, estado): sin ids, sin azar, sin reloj. Todo número lo trae quien llama.
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
  const W = 320, M = 8, ALTO_FILA = 34, CABEZA = 30, PIE = 34;

  const celda = x => (x !== null && typeof x === 'object' ? x : { t: x === undefined || x === null ? '' : String(x) });
  const nCols = d => Math.max(d.columnas ? d.columnas.length : 0, ...(d.filas || []).map(f => f.length), 1);

  // Geometría fija para unos datos: el ancho de columna sale del texto más largo, sin pasar del lienzo.
  function geometria(d) {
    const nc = nCols(d), filas = d.filas || [];
    const izq = d.rotulosFila ? Math.min(96, 12 + Math.max(...d.rotulosFila.map(r => T.ancho(String(r || ''), 16, 700)))) : 0;
    const textos = [];
    for (const f of filas) f.forEach((x, k) => { textos[k] = Math.max(textos[k] || 0, T.ancho(celda(x).t, 16, 700)); });
    (d.columnas || []).forEach((x, k) => { textos[k] = Math.max(textos[k] || 0, T.ancho(String(x || ''), 16, 700)); });
    const util = W - 2 * M - izq - (d.corchetes ? 24 : 0);
    let anchos = Array.from({ length: nc }, (_, k) => Math.max(34, (textos[k] || 0) + 16));
    const suma = anchos.reduce((a, b) => a + b, 0);
    if (suma > util) anchos = anchos.map(a => a * util / suma);
    else if (!d.triangular && !d.corchetes) anchos = anchos.map(a => a + (util - suma) / nc * 0.5);
    const total = anchos.reduce((a, b) => a + b, 0);
    const x0 = M + izq + (util - total) / 2 + (d.corchetes ? 12 : 0);
    const xs = [x0];
    for (const a of anchos) xs.push(xs[xs.length - 1] + a);
    const y0 = M + (d.columnas ? CABEZA : 4);
    const alto = y0 + ALTO_FILA * filas.length + PIE;
    // Pascal: la fila i tiene i + 1 celdas, centradas; el ancho de celda es el de la última fila.
    const paso = anchos.length ? total / nc : 40;
    const cx = (f, c) => {
      if (d.triangular) { const n = (filas[f] || []).length; return M + izq + util / 2 + (c - (n - 1) / 2) * paso; }
      return (xs[c] + xs[c + 1]) / 2;
    };
    const cy = f => y0 + ALTO_FILA * f + ALTO_FILA / 2;
    return { xs, y0, alto, cx, cy, anchos, izq, nc, paso };
  }

  function dibujar(d, estado = {}) {
    const g = geometria(d), filas = d.filas || [];
    const corte = Math.max(0, estado.corte || 0);
    const ve = e => (e.desde || 0) <= corte;
    const nuevo = e => ((e.desde || 0) === corte && corte > 0 ? ' kit-nuevo' : '');
    let s = '';
    // Resaltes, detrás de todo.
    for (const r of d.resaltes || []) {
      if (!ve(r)) continue;
      const x = d.triangular ? g.cx(r.f, r.c) - g.paso / 2 : g.xs[r.c];
      const w = d.triangular ? g.paso * (r.ancho || 1) : g.xs[Math.min(g.nc, r.c + (r.ancho || 1))] - g.xs[r.c];
      s += T.resaltado(x + 2, g.y0 + ALTO_FILA * r.f + 2, w - 4, ALTO_FILA * (r.alto || 1) - 4, { color: r.color, clase: 'kit-aparece' + nuevo(r) });
    }
    // Encabezados.
    (d.columnas || []).forEach((x, k) => {
      if (x === null || x === undefined || x === '') return;
      s += T.rotulo(g.cx(0, k), M + 20, String(x), { ancla: 'middle', peso: 700, color: (d.colorCol || [])[k], min: g.xs[k], max: g.xs[k + 1] });
    });
    // Rejilla (no en matrices ni en Pascal).
    if (!d.corchetes && !d.triangular && filas.length) {
      let grid = '';
      const y1 = g.y0 + ALTO_FILA * filas.length;
      for (let f = 0; f <= filas.length; f++) grid += T.linea(g.xs[0], g.y0 + ALTO_FILA * f, g.xs[g.nc], g.y0 + ALTO_FILA * f, { grosor: T.GROSOR.cuadricula, opacidad: 0.35 });
      for (let c = 0; c <= g.nc; c++) grid += T.linea(g.xs[c], g.y0, g.xs[c], y1, { grosor: T.GROSOR.cuadricula, opacidad: 0.35 });
      s += `<g class="kit-cuadricula">${grid}</g>`;
    }
    const sep = d.separador || {};
    if (Number.isInteger(sep.fila)) s += T.linea(g.xs[0], g.y0 + ALTO_FILA * sep.fila, g.xs[g.nc], g.y0 + ALTO_FILA * sep.fila, { grosor: T.GROSOR.contorno });
    if (Number.isInteger(sep.columna)) s += T.linea(g.xs[sep.columna], g.y0, g.xs[sep.columna], g.y0 + ALTO_FILA * filas.length, { grosor: T.GROSOR.contorno });
    if (d.corchetes && filas.length) {
      const a = g.xs[0] - 6, b = g.xs[g.nc] + 6, y1 = g.y0 + 2, y2 = g.y0 + ALTO_FILA * filas.length - 2;
      s += `<path d="M${T.n(a + 7)} ${T.n(y1)}L${T.n(a)} ${T.n(y1)}L${T.n(a)} ${T.n(y2)}L${T.n(a + 7)} ${T.n(y2)}M${T.n(b - 7)} ${T.n(y1)}L${T.n(b)} ${T.n(y1)}L${T.n(b)} ${T.n(y2)}L${T.n(b - 7)} ${T.n(y2)}" fill="none" stroke="currentColor" stroke-width="${T.GROSOR.contorno}" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    // Rótulos de fila.
    (d.rotulosFila || []).forEach((r, f) => {
      if (r === null || r === undefined || r === '') return;
      s += T.rotulo(g.xs[0] - 8, g.cy(f) + 6, String(r), { ancla: 'end', peso: 700, color: (d.colorFila || [])[f], min: 2, max: g.xs[0] - 4 });
    });
    // Celdas.
    filas.forEach((fila, f) => fila.forEach((x, c) => {
      const e = celda(x);
      if (!e.t || !ve(e)) return;
      const cx = g.cx(f, c), cy = g.cy(f);
      const max = d.triangular ? cx + g.paso / 2 : g.xs[c + 1], min = d.triangular ? cx - g.paso / 2 : g.xs[c];
      let t = T.rotulo(cx, cy + 6, e.t, { ancla: 'middle', color: e.color, peso: e.fuerte ? 700 : 400, clase: 'kit-aparece' + nuevo(e), min, max });
      if (e.marca === 'ok' || e.marca === 'no') t += T.rotulo(max - 4, cy - 4, e.marca === 'ok' ? '✓' : '✗', { ancla: 'end', peso: 700, min, max });
      if (e.hueco) t += `<rect x="${T.n(min + 3)}" y="${T.n(cy - ALTO_FILA / 2 + 3)}" width="${T.n(max - min - 6)}" height="${ALTO_FILA - 6}" rx="4" fill="none" stroke="currentColor" stroke-width="${T.GROSOR.contorno}" stroke-dasharray="4 3"/>`;
      s += t;
    }));
    // Flechas entre celdas: salen del borde de una y llegan al borde de la otra.
    for (const fl of d.flechas || []) {
      if (!ve(fl)) continue;
      const [f1, c1] = fl.de, [f2, c2] = fl.a;
      const x1 = g.cx(f1, c1), y1 = g.cy(f1), x2 = g.cx(f2, c2), y2 = g.cy(f2);
      // La flecha sale y llega al borde de una caja alrededor del texto de cada celda (no lo pisa).
      const L = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / L, uy = (y2 - y1) / L;
      const borde = (f, c) => {
        const w = d.triangular ? g.paso : g.xs[c + 1] - g.xs[c];
        const hw = Math.max(10, w / 2 - 6), hh = 10;
        return Math.min(Math.abs(ux) > 1e-9 ? hw / Math.abs(ux) : Infinity, Math.abs(uy) > 1e-9 ? hh / Math.abs(uy) : Infinity);
      };
      const r1 = borde(f1, c1), r2 = borde(f2, c2);
      s += `<g class="kit-crece${nuevo(fl)}">${T.flecha(x1 + ux * r1, y1 + uy * r1, x2 - ux * r2, y2 - uy * r2, { color: fl.color, grosor: T.GROSOR.contorno })}</g>`;
      if (fl.rotulo) s += T.rotulo((x1 + x2) / 2 + 6, (y1 + y2) / 2 - 2, fl.rotulo, { color: fl.color, peso: 700, clase: 'kit-aparece' + nuevo(fl) });
    }
    // Fantasma: el valor de un error, discontinuo, en su casilla; su rótulo va en el pie.
    const fa = estado.fantasma;
    if (d.pie && !(fa && fa.rotulo)) s += T.rotulo(M, g.alto - 10, String(d.pie), { peso: 700 });
    if (fa && Number.isInteger(fa.f) && Number.isInteger(fa.c) && fa.f < filas.length && fa.c < g.nc) {
      const cx = g.cx(fa.f, fa.c), cy = g.cy(fa.f);
      const min = d.triangular ? cx - g.paso / 2 : g.xs[fa.c], max = d.triangular ? cx + g.paso / 2 : g.xs[fa.c + 1];
      let c = `<rect x="${T.n(min + 3)}" y="${T.n(cy - ALTO_FILA / 2 + 3)}" width="${T.n(max - min - 6)}" height="${ALTO_FILA - 6}" rx="4" fill="none" stroke="currentColor" stroke-width="${T.GROSOR.contorno}" stroke-dasharray="4 3" stroke-opacity="0.8"/>`;
      if (fa.t !== undefined) c += T.rotulo(cx, cy + 6, String(fa.t), { ancla: 'middle', min, max });
      if (fa.rotulo) c += T.rotulo(M, g.alto - 10, String(fa.rotulo), {});
      s += `<g class="kit-fantasma">${c}</g>`;
    }
    return T.svg(W, g.alto, s, { alt: alt(d) });
  }

  function alt(d) {
    if (d.alt) return d.alt;
    const cab = (d.columnas || []).filter(Boolean).join(', ');
    const n = (d.filas || []).length;
    return `Tabla de ${n} fila${n === 1 ? '' : 's'}${cab ? ' con las columnas ' + cab : ''}`;
  }

  return { id: 'alg-tabla', dibujar, alt, geometria };
});
