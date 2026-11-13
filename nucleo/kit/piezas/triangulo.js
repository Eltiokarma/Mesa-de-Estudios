/*
 * Pieza «triangulo» (docs/escena-viva.md, sección 5): triángulos y figuras de lados rectos a escala, con
 * lados y ángulos rotulados pegados, alturas, notables, la horizontal y las visuales (elevación y depresión
 * con observador) y cotas. Se responde con alternativas: la figura se ve y su solución se recorre.
 *
 * Afirmación de la figura: cada ángulo y cada largo dibujado es el del problema; lo que se pide está en su lugar.
 *
 * Fidelidad: una sola escala para los dos ejes; los ángulos se dibujan con el valor de sus lados (37° es
 * el ángulo de tan = 3/4, como en la convención de academia) y los largos, a escala.
 *
 * Coordenadas en unidades del problema, con y hacia arriba. Todo número lo calcula el generador (regla 1).
 * datos = {
 *   puntos: [{ id: 'P', x, y, rotulo: 'P', paso }],
 *   suelo: true,                       // la línea del suelo (y = 0) con su rayado, de punta a punta de la figura
 *   lados: [{ de: 'P', a: 'T', color: 'h', texto: 'H = ?', final: 'H = 12 m', grosor: 'variable'|'contorno',
 *             visual: false, horizontal: false, paso }],   // visual: discontinua (línea de mira); horizontal: tenue
 *   angulos: [{ en: 'P', de: 'B', a: 'T', texto: '37°', color: 'o', paso }],   // el menor de los dos ángulos; 90° → cuadradito
 *   cotas: [{ de: 'P', a: 'Q', texto: '20 m', final, color: 'd', lado: 1|-1, paso }]  // medida paralela, a 22 px
 * }
 * estado = { paso: 0..n, final: false, fantasma: null | { rotulo, texto } }
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
  const W = 320, MARGEN = 34, FIG_MAX = 240, COTA = 24;
  const rad = g => g * Math.PI / 180, grados = r => r * 180 / Math.PI;

  function geometria(d) {
    const pts = {};
    for (const q of d.puntos || []) pts[q.id] = q;
    const xs = (d.puntos || []).map(q => q.x), ys = (d.puntos || []).map(q => q.y);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys, d.suelo ? 0 : Infinity), y1 = Math.max(...ys);
    const sx = Math.max(x1 - x0, 1e-9), sy = Math.max(y1 - y0, 1e-9);
    // Abajo, lugar para las cotas del suelo; la escala es una sola para x e y.
    const abajo = (d.cotas || []).length ? COTA + 18 : 0;
    const s = Math.min((W - 2 * MARGEN) / sx, (FIG_MAX - 2 * MARGEN - abajo) / sy);
    const figH = sy * s + 2 * MARGEN + abajo;
    const X = x => (W - sx * s) / 2 + (x - x0) * s, Y = y => MARGEN + (y1 - y) * s;
    const P = id => { const q = pts[id]; return q ? [X(q.x), Y(q.y)] : null; };
    const centro = [X((x0 + x1) / 2), Y((y0 + y1) / 2)];
    return { s, X, Y, P, pts, centro, x0, x1, fantasmaY: figH + 16, alto: figH + 30 };
  }

  // Rótulo junto a la mitad de un segmento, del lado que mira afuera de la figura (o del lado pedido).
  function rotuloLado(g, a, b, texto, o) {
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    let nx = -(b[1] - a[1]) / L, ny = (b[0] - a[0]) / L;
    if ((mx - g.centro[0]) * nx + (my - g.centro[1]) * ny < 0) { nx = -nx; ny = -ny; }
    if (o.lado === -1) { nx = -nx; ny = -ny; }
    const dist = o.dist || 12;
    const ancla = Math.abs(nx) < 0.4 ? 'middle' : nx > 0 ? 'start' : 'end';
    const by = my + ny * dist + 5 + (ny > 0.4 ? 7 : ny < -0.4 ? -3 : 0);
    return T.rotulo(mx + nx * dist, by, texto, { color: o.color, ancla, peso: 700 });
  }

  function arco(g, an, clase) {
    const c = g.P(an.en), p1 = g.P(an.de), p2 = g.P(an.a);
    if (!c || !p1 || !p2) return '';
    // Direcciones en pantalla (y hacia abajo) y el barrido menor entre ellas.
    const t1 = Math.atan2(p1[1] - c[1], p1[0] - c[0]), t2 = Math.atan2(p2[1] - c[1], p2[0] - c[0]);
    let dt = t2 - t1; while (dt > Math.PI) dt -= 2 * Math.PI; while (dt < -Math.PI) dt += 2 * Math.PI;
    const r = an.radio || 30, col = T.color(an.color);
    const pt = (t, rr) => [c[0] + rr * Math.cos(t), c[1] + rr * Math.sin(t)];
    let s;
    if (Math.abs(Math.abs(grados(dt)) - 90) < 0.01) {
      const q = 12, u = pt(t1, q), v = pt(t2, q), w = [u[0] + v[0] - c[0], u[1] + v[1] - c[1]];
      s = `<path d="M${T.n(u[0])} ${T.n(u[1])}L${T.n(w[0])} ${T.n(w[1])}L${T.n(v[0])} ${T.n(v[1])}" fill="none" stroke="${col}" stroke-width="2" stroke-linejoin="round"/>`;
    } else {
      const [ax, ay] = pt(t1, r), [bx, by] = pt(t2, r);
      s = `<path d="M${T.n(ax)} ${T.n(ay)}A${r} ${r} 0 0 ${dt > 0 ? 1 : 0} ${T.n(bx)} ${T.n(by)}" fill="none" stroke="${col}" stroke-width="2" stroke-linecap="round"/>`;
    }
    if (an.texto) {
      // Sobre la bisectriz, lo bastante lejos para que el rótulo entero quepa entre los dos lados.
      const mitad = Math.max(rad(6), Math.min(rad(90), Math.abs(dt) / 2));
      const rr = Math.max(r + 16, (T.ancho(an.texto, T.TEXTO, 700) / 2 + 8) / Math.sin(mitad));
      const [tx, ty] = pt(t1 + dt / 2, Math.min(rr, 140));
      s += T.rotulo(tx, ty + 6, an.texto, { color: an.color, ancla: 'middle', peso: 700 });
    }
    return `<g class="${clase}">${s}</g>`;
  }

  function cota(g, c, texto, clase) {
    const a = g.P(c.de), b = g.P(c.a);
    if (!a || !b) return '';
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    let nx = -(b[1] - a[1]) / L, ny = (b[0] - a[0]) / L;
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    if ((mx - g.centro[0]) * nx + (my - g.centro[1]) * ny < 0) { nx = -nx; ny = -ny; }
    if (c.lado === -1) { nx = -nx; ny = -ny; }
    const o = [nx * COTA, ny * COTA], A = [a[0] + o[0], a[1] + o[1]], B = [b[0] + o[0], b[1] + o[1]];
    const tope = p => T.linea(p[0] - nx * 6, p[1] - ny * 6, p[0] + nx * 6, p[1] + ny * 6, { color: c.color });
    let s = T.linea(A[0], A[1], B[0], B[1], { color: c.color }) + tope(A) + tope(B)
      + T.linea(a[0] + nx * 4, a[1] + ny * 4, A[0], A[1], { grosor: 1, opacidad: 0.5 }) + T.linea(b[0] + nx * 4, b[1] + ny * 4, B[0], B[1], { grosor: 1, opacidad: 0.5 });
    if (texto) s += rotuloLado(g, A, B, texto, { color: c.color, lado: Math.sign(nx * (A[0] - g.centro[0]) + ny * (A[1] - g.centro[1])) < 0 ? -1 : 1, dist: 10 });
    return `<g class="${clase}">${s}</g>`;
  }

  function dibujar(d, estado = {}) {
    const g = geometria(d);
    const final = !!estado.final;
    const p = final ? Infinity : Math.max(0, Number.isFinite(estado.paso) ? estado.paso : 0);
    const ve = el => (el.paso || 0) <= p;
    const nuevo = el => (!final && (el.paso || 0) === p && p > 0 ? ' kit-nuevo' : '');
    const txt = el => (final && el.final !== undefined ? el.final : el.texto);
    let s = '';
    if (d.suelo) {
      const xa = Math.max(4, g.X(g.x0) - 24), xb = Math.min(W - 4, g.X(g.x1) + 24), y = g.Y(0);
      let raya = '';
      for (let x = xa + 6; x <= xb; x += 12) raya += `M${T.n(x)} ${T.n(y + 1)}l-6 7`;
      s += `<g class="kit-suelo">${T.linea(xa, y, xb, y)}<path class="kit-tenue" d="${raya}" stroke="currentColor" stroke-width="1" fill="none"/></g>`;
    }
    for (const l of d.lados || []) if (ve(l)) {
      const a = g.P(l.de), b = g.P(l.a);
      if (!a || !b) continue;
      const grosor = l.grosor === 'variable' ? T.GROSOR.variable : l.horizontal ? 1 : T.GROSOR.contorno;
      let e = T.linea(a[0], a[1], b[0], b[1], { color: l.color, grosor, discontinua: l.visual || l.horizontal, opacidad: l.horizontal ? 0.6 : undefined });
      const t = txt(l);
      if (t) e += rotuloLado(g, a, b, t, { color: l.color, lado: l.lado });
      s += `<g class="kit-aparece${final && l.final !== undefined ? ' kit-nuevo' : nuevo(l)}">${e}</g>`;
    }
    for (const an of d.angulos || []) if (ve(an)) s += arco(g, an, `kit-aparece${nuevo(an)}`);
    for (const c of d.cotas || []) if (ve(c)) s += cota(g, c, txt(c), `kit-aparece${final && c.final !== undefined ? ' kit-nuevo' : nuevo(c)}`);
    for (const q of d.puntos || []) if (ve(q)) {
      const [x, y] = g.P(q.id), L = Math.hypot(x - g.centro[0], y - g.centro[1]) || 1;
      let ux = (x - g.centro[0]) / L, uy = (y - g.centro[1]) / L;
      if (d.suelo && Math.abs(q.y) < 1e-9) { ux *= 0.4; uy = 1; } // en el suelo, el nombre va debajo
      s += `<g class="kit-aparece${nuevo(q)}"><circle cx="${T.n(x)}" cy="${T.n(y)}" r="3" fill="currentColor"/>`
        + `${q.rotulo ? T.rotulo(x + ux * 14, y + uy * 14 + 5, q.rotulo, { ancla: 'middle', peso: 600 }) : ''}</g>`;
    }
    if (estado.fantasma && (estado.fantasma.rotulo || estado.fantasma.texto)) {
      const f = estado.fantasma, t = `${f.rotulo ? f.rotulo + ': ' : ''}${f.texto || ''}`;
      const w = Math.min(W - 4, T.ancho(t) + 20);
      s += `<g class="kit-fantasma"><rect x="${T.n((W - w) / 2)}" y="${T.n(g.fantasmaY - 17)}" width="${T.n(w)}" height="26" rx="6" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4"/>`
        + `${T.rotulo(W / 2, g.fantasmaY + 1, t, { ancla: 'middle' })}</g>`;
    }
    return T.svg(W, g.alto, s, { alt: alt(d) });
  }

  function alt(d) {
    const ang = (d.angulos || []).filter(a => a.texto && !a.paso).map(a => `${a.texto} en ${a.en}`);
    const lad = [...(d.lados || []), ...(d.cotas || [])].filter(l => l.texto && !l.paso).map(l => `${l.de}${l.a}: ${l.texto}`);
    return `Figura a escala con los puntos ${(d.puntos || []).filter(q => !q.paso && q.rotulo).map(q => q.rotulo).join(', ')}`
      + (lad.length ? `; ${lad.join('; ')}` : '') + (ang.length ? `; ángulos de ${ang.join(' y ')}` : '');
  }

  return { id: 'triangulo', dibujar, alt, geometria };
});
