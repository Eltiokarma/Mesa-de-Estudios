/*
 * Pieza «rm-fichas» (razonamiento matemático; docs/teoria.md, sección 4): filas de fichas con su rótulo. Una ficha es
 * un círculo o un cuadrado con letra (fichas de color, personas, monedas), una ficha de dominó con sus puntos, una
 * cara de dado o una cerilla. Una ficha puede quedar hueca (lugar libre), tachada (descartada) o resaltada.
 * Sirve para urnas y extracciones (peor caso), repartos en casilleros, dominós, dados, cerillas y conteos.
 *
 * Afirmación de la figura: cada ficha es un objeto que se puede contar; el rótulo de la fila dice qué representa.
 *
 * datos = {
 *   filas: [{ rotulo: 'Urna', fichas: [ficha, …], caja: false, desde, hasta }],   // hasta 5 filas; el alto es fijo
 *     ficha = { color: 'o', t: 'R', forma: 'circulo'|'cuadrado'|'domino'|'dado'|'cerilla', valor: [2, 5] | 3,
 *               hueca, tachada, resalto, desde, hasta }
 *   tam: 26,                                   // lado de una ficha (las de dominó miden el doble de largo)
 *   pie: 'texto'                               // una línea abajo (se reserva siempre)
 * }
 * estado = { corte: 0..n, fantasma: null | { fila, fichas: [ficha, …], rotulo } }  // fichas que se agregan, discontinuas
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
  const W = 320, M = 6, ALTO_ROT = 22, SEP = 6, PIE = 28;
  const ve = (x, corte) => (x.desde || 0) <= corte && (x.hasta === undefined || corte <= x.hasta);
  // Puntos de dado en una cuadrícula 3×3 (índices 0..8).
  const PUNTOS = { 0: [], 1: [4], 2: [2, 6], 3: [2, 4, 6], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };

  const tamDe = d => Math.max(22, Math.min(34, d.tam || 26));
  const ancho = (f, t) => (f.forma === 'domino' ? 2 * t : f.forma === 'cerilla' ? t * 0.5 : t);
  function filasAlto(d) { const t = tamDe(d); return t + ALTO_ROT + 10; }

  function puntos(x, y, lado, n, color) {
    let s = '';
    for (const i of PUNTOS[Math.max(0, Math.min(6, n | 0))] || []) {
      const px = x + lado * (0.22 + 0.28 * (i % 3)), py = y + lado * (0.22 + 0.28 * Math.floor(i / 3));
      s += `<circle cx="${T.n(px)}" cy="${T.n(py)}" r="${T.n(Math.max(2, lado * 0.085))}" fill="${T.color(color)}"/>`;
    }
    return s;
  }

  function ficha(x, y, t, f, fantasma) {
    const c = T.color(f.color), disc = fantasma || f.hueca ? ' stroke-dasharray="4 3"' : '';
    let s = '';
    if (f.resalto) s += T.resaltado(x - 3, y - 3, ancho(f, t) + 6, t + 6, { color: f.resalto, radio: 6 });
    if (f.forma === 'domino') {
      const [a, b] = Array.isArray(f.valor) ? f.valor : [0, 0];
      s += `<rect x="${T.n(x)}" y="${T.n(y)}" width="${2 * t}" height="${t}" rx="5" fill="var(--card)" stroke="currentColor" stroke-width="${T.GROSOR.contorno}"${disc}/>`;
      s += T.linea(x + t, y + 4, x + t, y + t - 4, { grosor: T.GROSOR.cuadricula });
      s += puntos(x, y, t, a, f.color) + puntos(x + t, y, t, b, f.color);
    } else if (f.forma === 'dado') {
      s += `<rect x="${T.n(x)}" y="${T.n(y)}" width="${t}" height="${t}" rx="6" fill="var(--card)" stroke="currentColor" stroke-width="${T.GROSOR.contorno}"${disc}/>`;
      s += puntos(x, y, t, f.valor, f.color);
    } else if (f.forma === 'cerilla') {
      s += `<line x1="${T.n(x + t * 0.25)}" y1="${T.n(y + t * 0.22)}" x2="${T.n(x + t * 0.25)}" y2="${T.n(y + t)}" stroke="${c}" stroke-width="${T.GROSOR.variable + 1}" stroke-linecap="round"${disc}/>`;
      s += `<circle cx="${T.n(x + t * 0.25)}" cy="${T.n(y + t * 0.16)}" r="4" fill="${c}"/>`;
    } else {
      const fondo = f.hueca ? 'none' : c, op = f.hueca ? 0 : 0.22;
      s += f.forma === 'cuadrado'
        ? `<rect x="${T.n(x + 1)}" y="${T.n(y + 1)}" width="${t - 2}" height="${t - 2}" rx="5" fill="${fondo}" fill-opacity="${op}" stroke="${c}" stroke-width="${T.GROSOR.contorno}"${disc}/>`
        : `<circle cx="${T.n(x + t / 2)}" cy="${T.n(y + t / 2)}" r="${T.n(t / 2 - 1)}" fill="${fondo}" fill-opacity="${op}" stroke="${c}" stroke-width="${T.GROSOR.contorno}"${disc}/>`;
      if (f.t) s += T.rotulo(x + t / 2, y + t / 2 + 5, f.t, { color: f.color, peso: 700, ancla: 'middle', tam: 14 });
    }
    if (f.tachada) s += T.linea(x - 2, y + t + 2, x + ancho(f, t) + 2, y - 2, { grosor: T.GROSOR.variable });
    return `<g class="${fantasma ? 'kit-fantasma' : 'kit-aparece'}">${s}</g>`;
  }

  function fila(d, k, fl, corte, extra) {
    const t = tamDe(d), y = M + k * filasAlto(d);
    let s = '';
    if (fl.rotulo) s += T.rotulo(M, y + 16, fl.rotulo, { peso: 700 });
    let x = M, yy = y + ALTO_ROT, cx0 = x;
    const todas = (fl.fichas || []).filter(f => ve(f, corte)).map(f => [f, false]).concat((extra || []).map(f => [f, true]));
    const total = todas.reduce((m, [f]) => m + ancho(f, t) + SEP, 0);
    const k2 = total > W - 2 * M ? (W - 2 * M) / total : 1;   // si no caben, se juntan (el tamaño no cambia)
    if (fl.caja) s += `<rect x="${M - 3}" y="${T.n(yy - 4)}" width="${W - 2 * M + 6}" height="${t + 8}" rx="8" fill="none" stroke="currentColor" stroke-opacity="0.5" stroke-width="${T.GROSOR.cuadricula}"/>`;
    for (const [f, fan] of todas) { s += ficha(x, yy, t, f, fan); x += (ancho(f, t) + SEP) * k2; }
    void cx0;
    return s;
  }

  function dibujar(d, e = {}) {
    const corte = e.corte || 0, filas = (d.filas || []).slice(0, 5);
    let s = '';
    filas.forEach((fl, k) => {
      const extra = e.fantasma && e.fantasma.fila === k ? e.fantasma.fichas : null;
      if (ve(fl, corte)) s += `<g class="kit-aparece">${fila(d, k, fl, corte, extra)}</g>`;
    });
    const base = M + filas.length * filasAlto(d);
    const pie = e.fantasma && e.fantasma.rotulo ? e.fantasma.rotulo : d.pie;
    if (pie) s += T.rotulo(W / 2, base + 18, pie, { ancla: 'middle', peso: 700, clase: e.fantasma && e.fantasma.rotulo ? 'kit-fantasma' : '' });
    return T.svg(W, base + PIE, s, { alt: alt(d) });
  }

  function alt(d) {
    const desc = f => (f.forma === 'domino' ? `dominó ${(f.valor || []).join('-')}` : f.forma === 'dado' ? `dado con ${f.valor}` : f.forma === 'cerilla' ? 'cerilla' : (f.t || 'ficha')) + (f.tachada ? ' (descartada)' : '') + (f.hueca ? ' (lugar libre)' : '');
    const fs = (d.filas || []).map(fl => `${fl.rotulo || 'fila'}: ${(fl.fichas || []).map(desc).join(', ') || 'vacía'}`);
    return `Fichas. ${fs.join('; ')}${d.pie ? `. ${d.pie}` : ''}.`;
  }

  return { id: 'rm-fichas', dibujar, alt };
});
