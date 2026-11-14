/*
 * Pieza «rm-tablero» (razonamiento matemático; docs/teoria.md, sección 4): una cuadrícula de casillas con cabeceras
 * de fila y de columna. Cada casilla lleva un texto, una marca (✓ sí, ✗ no) o queda vacía; una casilla null no se
 * dibuja (sirve para desarrollos de un cubo o tableros con forma). Marcos de color rodean grupos de casillas.
 * Sirve para cuadros de doble entrada, filas de asientos, cuadrados mágicos, calendarios, tablas de un algoritmo
 * (i, S), tablas de suposiciones y tablas de datos.
 *
 * Afirmación de la figura: cada casilla es una combinación posible; una marca la descarta o la confirma y el resto
 * de su fila y su columna se lee de un vistazo.
 *
 * datos = {
 *   columnas: ['1.º', '2.º', …] | null,      // cabeceras de columna (arriba)
 *   filas: ['Ana', 'Beto', …] | null,         // cabeceras de fila (a la izquierda)
 *   celdas: [[casilla, …], …],                // filas × columnas
 *     casilla = null | '' | 'texto' | { t, color, marca: 'si'|'no', resalto, tenue, desde, hasta }
 *   marcos: [{ f, c, alto, ancho, color, desde, hasta }],   // rectángulo de color sobre un grupo de casillas
 *   notas: [{ t, color, desde, hasta }],      // hasta dos líneas bajo el tablero (el alto se reserva)
 *   ancho: 56                                 // ancho máximo de casilla (por defecto 56)
 * }
 * estado = { corte: 0..n, fantasma: null | { celdas: { 'f,c': casilla }, rotulo } }
 *   corte: se ve lo que tiene desde ≤ corte (y hasta ≥ corte); el fantasma se dibuja discontinuo encima.
 * El dibujo es una función pura de (datos, estado): sin ids, sin azar, sin reloj. Todo texto lo trae quien llama.
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
  const W = 320, M = 4, ALTO_F = 40, ALTO_C = 30, ALTO_NOTA = 24;

  const norm = c => (c === null || c === undefined ? null : typeof c === 'object' ? c : { t: String(c) });
  const ve = (x, corte) => !x || ((x.desde || 0) <= corte && (x.hasta === undefined || corte <= x.hasta));

  function geometria(d) {
    const nf = (d.celdas || []).length, nc = Math.max(1, ...(d.celdas || [[]]).map(r => r.length), (d.columnas || []).length);
    const cab = d.filas && d.filas.length ? Math.min(118, Math.max(40, ...d.filas.map(f => T.ancho(f, 16, 700) + 14))) : 0;
    const cw = Math.min(d.ancho || 56, (W - 2 * M - cab) / nc);
    const x0 = M + cab + Math.max(0, (W - 2 * M - cab - cw * nc) / 2);
    const y0 = M + (d.columnas && d.columnas.length ? ALTO_C : 0);
    const notas = Math.max(1, Math.min(2, (d.notas || []).length));   // siempre se reserva una línea: el alto no cambia
    return { nf, nc, cab, cw, x0, y0, notas, alto: y0 + nf * ALTO_F + 8 + notas * ALTO_NOTA + M };
  }

  function marca(cx, cy, tipo, color) {
    const c = T.color(color);
    if (tipo === 'si') return `<path d="M${T.n(cx - 8)} ${T.n(cy)}L${T.n(cx - 2)} ${T.n(cy + 7)}L${T.n(cx + 9)} ${T.n(cy - 8)}" fill="none" stroke="${c}" stroke-width="${T.GROSOR.variable}" stroke-linecap="round" stroke-linejoin="round"/>`;
    return T.linea(cx - 7, cy - 7, cx + 7, cy + 7, { color, grosor: T.GROSOR.variable }) + T.linea(cx + 7, cy - 7, cx - 7, cy + 7, { color, grosor: T.GROSOR.variable });
  }

  function casilla(g, f, c, x, fantasma) {
    const X = g.x0 + c * g.cw, Y = g.y0 + f * ALTO_F;
    let s = '';
    const clase = fantasma ? 'kit-fantasma' : 'kit-aparece';
    if (x.resalto) s += T.resaltado(X + 2, Y + 2, g.cw - 4, ALTO_F - 4, { color: x.resalto, radio: 4 });
    const cx = X + g.cw / 2, cy = Y + ALTO_F / 2;
    if (x.marca) s += marca(cx, cy, x.marca, x.color);
    else if (x.t !== undefined && x.t !== '') {
      const tam = T.ancho(x.t, 16, 700) > g.cw - 6 ? 14 : 16;
      s += T.rotulo(cx, cy + 6, x.t, { color: x.color, peso: x.tenue ? 400 : 700, ancla: 'middle', tam, min: X, max: X + g.cw });
    }
    if (fantasma) s += `<rect x="${T.n(X + 3)}" y="${T.n(Y + 3)}" width="${T.n(g.cw - 6)}" height="${ALTO_F - 6}" rx="4" fill="none" stroke="currentColor" stroke-width="${T.GROSOR.contorno}" stroke-dasharray="4 3"/>`;
    return `<g class="${clase}"${x.tenue ? ' opacity="0.55"' : ''}>${s}</g>`;
  }

  function dibujar(d, e = {}) {
    const g = geometria(d), corte = e.corte || 0;
    let s = '';
    // Cabeceras.
    (d.columnas || []).forEach((t, c) => { if (t) s += T.rotulo(g.x0 + c * g.cw + g.cw / 2, M + 20, t, { ancla: 'middle', peso: 700, min: g.x0 + c * g.cw - 4, max: g.x0 + (c + 1) * g.cw + 4 }); });
    (d.filas || []).forEach((t, f) => { if (t) s += T.rotulo(g.x0 - 8, g.y0 + f * ALTO_F + ALTO_F / 2 + 6, t, { ancla: 'end', peso: 700, min: M }); });
    // Rejilla: cada casilla que existe, con contorno de cuadrícula.
    let rej = '';
    (d.celdas || []).forEach((r, f) => r.forEach((c0, c) => {
      if (norm(c0) === null) return;
      rej += `<rect x="${T.n(g.x0 + c * g.cw)}" y="${T.n(g.y0 + f * ALTO_F)}" width="${T.n(g.cw)}" height="${ALTO_F}" fill="var(--card)" stroke="currentColor" stroke-opacity="0.45" stroke-width="${T.GROSOR.cuadricula}"/>`;
    }));
    s += `<g class="kit-cuadricula">${rej}</g>`;
    (d.celdas || []).forEach((r, f) => r.forEach((c0, c) => {
      const x = norm(c0);
      if (x && ve(x, corte)) s += casilla(g, f, c, x, false);
    }));
    for (const m of d.marcos || []) {
      if (!ve(m, corte)) continue;
      s += `<rect class="kit-aparece" x="${T.n(g.x0 + m.c * g.cw + 1.5)}" y="${T.n(g.y0 + m.f * ALTO_F + 1.5)}" width="${T.n((m.ancho || 1) * g.cw - 3)}" height="${T.n((m.alto || 1) * ALTO_F - 3)}" rx="5" fill="none" stroke="${T.color(m.color)}" stroke-width="${T.GROSOR.variable}"/>`;
    }
    const fant = e.fantasma;
    if (fant && fant.celdas) for (const [k, c0] of Object.entries(fant.celdas)) {
      const [f, c] = k.split(',').map(Number), x = norm(c0);
      if (x && f < g.nf && c < g.nc) s += casilla(g, f, c, x, true);
    }
    const yN = g.y0 + g.nf * ALTO_F + 8;
    const notas = (d.notas || []).slice(0, 2).filter(n => ve(n, corte));
    if (fant && fant.rotulo && notas.length < 2) notas.push({ t: fant.rotulo, fantasma: true });
    notas.slice(0, g.notas).forEach((n, k) => {
      s += T.rotulo(W / 2, yN + 17 + k * ALTO_NOTA, n.t, { color: n.color, ancla: 'middle', peso: 700, clase: n.fantasma ? 'kit-fantasma' : 'kit-aparece' });
    });
    return T.svg(W, g.alto, s, { alt: alt(d) });
  }

  function alt(d) {
    const nf = (d.celdas || []).length, nc = Math.max(0, ...(d.celdas || [[]]).map(r => r.length));
    const llenas = (d.celdas || []).map((r, f) => r.map((c0, c) => {
      const x = norm(c0);
      if (!x) return null;
      const v = x.marca === 'si' ? 'sí' : x.marca === 'no' ? 'no' : x.t;
      if (!v) return null;
      const quien = [(d.filas || [])[f], (d.columnas || [])[c]].filter(Boolean).join(' y ');
      return quien ? `${quien}: ${v}` : v;
    }).filter(Boolean).join(', ')).filter(Boolean);
    return `Tablero de ${nf} filas y ${nc} columnas${d.filas ? ` (filas: ${d.filas.join(', ')})` : ''}${d.columnas ? ` (columnas: ${d.columnas.join(', ')})` : ''}. ${llenas.join('; ') || 'Casillas vacías'}.`;
  }

  // geometria(datos) → { nf, nc, cw, x0, y0, alto, centro(f, c) }: dónde cae cada casilla en el viewBox (para las manijas
  // del gesto directo) y su inversa casilla(x, y) → { f, c } (la más cercana, dentro de la rejilla).
  function geometriaPublica(d) {
    const g = geometria(d);
    return Object.assign({}, g, {
      altoFila: ALTO_F,
      centro: (f, c) => ({ x: g.x0 + (c + 0.5) * g.cw, y: g.y0 + (f + 0.5) * ALTO_F }),
      casilla: (x, y) => ({ f: Math.max(0, Math.min(g.nf - 1, Math.floor((y - g.y0) / ALTO_F))), c: Math.max(0, Math.min(g.nc - 1, Math.floor((x - g.x0) / g.cw))) }),
    });
  }

  return { id: 'rm-tablero', dibujar, alt, geometria: geometriaPublica, constantes: { W, ALTO_F, ALTO_C } };
});
