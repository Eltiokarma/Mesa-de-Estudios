/*
 * Pieza «alg-caja» (19 nov 2026, Etapa 8): la caja de cartón del maestro Rubén, el objeto de la unidad «Ecuaciones
 * polinomiales» (contenido/teoria/algebra/ecuaciones-polinomiales.js; docs/etapa8/propuesta-algebra.md §2). Dibujo de
 * prueba (data-prueba): Gerson decide después si lo reemplaza (docs/plan-calidad.md, M4).
 *
 * Afirmación de la figura: una caja tiene tres aristas distintas (largo, ancho y alto); el polinomio
 * (x − largo)(x − ancho)(x − alto) vale 0 justo en ellas. Por eso la suma de las aristas, la suma de los productos de a
 * dos (la mitad del cartón) y el volumen se leen en sus coeficientes.
 *
 * Objeto 'caja': una caja cerrada en perspectiva (el frente de largo por alto, la tapa y el costado hacia atrás).
 *   datos = { objeto: 'caja',
 *     medidas: [largo, ancho, alto]   en dm, números positivos: lo que se dibuja (a escala);
 *     rotulos: [r1, r2, r3]           lo que se escribe en cada arista: un texto («x + 1»), '?' o null (el número con
 *                                     «dm»); false: esa arista sin rótulo;
 *     color: 'f' | null               color de las tres aristas marcadas y de sus rótulos (violeta: son las raíces);
 *     tope: [5, 5, 5]                 la caja más grande del juego: fija la escala (nada salta al mover un control);
 *     arriba: [[texto, color, peso], …] | texto | null    una línea sobre la caja (el volumen, «volumen: ?»);
 *     nombres: true                   «largo», «ancho» y «alto» junto a cada rótulo (por defecto, sí) }
 *
 * estado = {} (no tiene pasos). Función pura de (datos, estado): sin ids, sin azar, sin reloj. Ancho 320, alto 214.
 * Colores: tinta (currentColor) y var(--c-*): solo el color que pide `color` (las raíces en violeta). Nunca carmín ni
 * verde. geometria(datos) da las cajas de todo lo dibujado (la caja y los textos) para la prueba numérica de encuadre.
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
  const W = 320, H = 214, M = 4, TAM = 13, IZQ = 78, DER = 78, ARRIBA = 30, ABAJO = 30;
  const KX = Math.cos(35 * Math.PI / 180) * 0.5, KY = Math.sin(35 * Math.PI / 180) * 0.5;   // la profundidad, a 35° y a la mitad
  const n2 = T.n;
  const num = v => String(Math.round(v * 100) / 100).replace('.', ',');
  const pos = v => (Number.isFinite(+v) && +v > 0 ? +v : 1);
  const segsDe = x => (x === null || x === undefined ? [] : Array.isArray(x) ? x : [[String(x), null, 700]]);
  const anchoSegs = (segs, tam) => segs.reduce((a, s) => a + T.ancho(s[0], tam, s[2] || 400), 0);
  function ponTexto(textos, que, x, y, segs, ancla = 'start', tam = TAM) {
    const w = anchoSegs(segs, tam), x0 = ancla === 'end' ? x - w : ancla === 'middle' ? x - w / 2 : x;
    textos.push({ que, txt: segs.map(s => s[0]).join(''), x0, x1: x0 + w, y0: y - tam * 0.8, y1: y + tam * 0.25, segs, x, y, tam, ancla });
  }
  function texto(t) {
    const spans = t.segs.map(([s, c, p]) => `<tspan fill="${T.color(c)}"${p && p !== 400 ? ` font-weight="${p}"` : ''}>${T.esc(s)}</tspan>`).join('');
    return `<text class="kit-txt" x="${n2(t.x)}" y="${n2(t.y)}" font-size="${t.tam}"${t.ancla !== 'start' ? ` text-anchor="${t.ancla}"` : ''} style="font-variant-numeric:tabular-nums">${spans}</text>`;
  }
  const NOMBRES = ['largo', 'ancho', 'alto'];
  // El rótulo de una arista: el texto dado, «?» o el número con «dm».
  const rotulo = (r, v) => (r === '?' ? '?' : typeof r === 'string' ? `${r} dm` : `${num(v)} dm`);

  function geometria(datos) {
    const d = datos || {};
    const [L, A, Al] = (d.medidas || [3, 2, 1]).map(pos);
    const tope = (d.tope || [L, A, Al]).map(pos).map((t, k) => Math.max(t, [L, A, Al][k]));
    const dispW = W - IZQ - DER, dispH = H - ARRIBA - ABAJO - M;
    const s = Math.min(28, dispW / (tope[0] + KX * tope[1]), dispH / (tope[2] + KY * tope[1]));
    const anchoTope = (tope[0] + KX * tope[1]) * s;
    const x0 = IZQ + (dispW - anchoTope) / 2, yb = H - ABAJO;   // esquina de abajo a la izquierda del frente
    const w = L * s, h = Al * s, dx = KX * A * s, dy = KY * A * s;
    const P = {
      fi: [x0, yb], fd: [x0 + w, yb], si: [x0, yb - h], sd: [x0 + w, yb - h],
      ti: [x0 + dx, yb - h - dy], td: [x0 + w + dx, yb - h - dy], bd: [x0 + w + dx, yb - dy],
    };
    const objetos = [{ que: 'caja', x0, y0: yb - h - dy, x1: x0 + w + dx, y1: yb }];
    const textos = [];
    const rs = d.rotulos || [null, null, null], color = d.color || null, nombres = d.nombres !== false;
    const lado = k => (rs[k] === false ? null : [...(nombres ? [[`${NOMBRES[k]}: `, null, 400]] : []), [rotulo(rs[k], [L, A, Al][k]), rs[k] === '?' ? null : color, 700]]);
    const rl = lado(0), ra = lado(1), rh = lado(2);
    if (rl) ponTexto(textos, 'largo', x0 + w / 2, yb + 19, rl, 'middle');
    if (rh) ponTexto(textos, 'alto', x0 - 8, yb - h / 2 + 4, rh, 'end');
    if (ra) ponTexto(textos, 'ancho', x0 + w + dx / 2 + 9, yb - dy / 2 + 6, ra, 'start');
    const arriba = segsDe(d.arriba);
    if (arriba.length) ponTexto(textos, 'arriba', W / 2, M + 14, arriba, 'middle');
    return { W, H, M, d, s, L, A, Al, P, color, objetos, textos };
  }

  function dibujar(datos, estado = {}) {
    const g = geometria(datos, estado), P = g.P, c = T.color(g.color);
    const pt = q => `${n2(q[0])} ${n2(q[1])}`;
    const cara = (ps, op) => `<path d="M${ps.map(pt).join('L')}Z" fill="currentColor" fill-opacity="${op}" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>`;
    let s = '';
    s += cara([P.fi, P.fd, P.sd, P.si], 0.10);          // frente
    s += cara([P.si, P.sd, P.td, P.ti], 0.05);          // tapa
    s += cara([P.fd, P.bd, P.td, P.sd], 0.16);          // costado
    // La cinta de embalaje sobre la tapa: dice que es una caja cerrada de cartón.
    const m1 = [(P.si[0] + P.ti[0]) / 2, (P.si[1] + P.ti[1]) / 2], m2 = [(P.sd[0] + P.td[0]) / 2, (P.sd[1] + P.td[1]) / 2];
    s += `<path d="M${pt(m1)}L${pt(m2)}" stroke="currentColor" stroke-opacity="0.45" stroke-width="3"/>`;
    // Las tres aristas que se miden, más gruesas y en su color.
    const arista = (a, b) => `<path d="M${pt(a)}L${pt(b)}" stroke="${c}" stroke-width="3.2" stroke-linecap="round"/>`;
    s += arista(P.fi, P.fd) + arista(P.fd, P.bd) + arista(P.fi, P.si);
    for (const t of g.textos) s += texto(t);
    return T.svg(W, H, `<g class="kit-objeto" data-objeto="caja" data-prueba="si">${s}</g>`, { alt: alt(datos, estado) });
  }
  function alt(datos) {
    const g = geometria(datos), rs = (g.d.rotulos || [null, null, null]);
    const dice = [g.L, g.A, g.Al].map((v, k) => `${NOMBRES[k]} ${rs[k] === false ? 'sin rótulo' : rotulo(rs[k], v)}`).join(', ');
    const arr = segsDe(g.d.arriba).map(x => x[0]).join('');
    return `Caja de cartón cerrada: ${dice}${arr ? `. Arriba: ${arr}` : ''}.`;
  }
  function cabe(datos, estado = {}) {
    const g = geometria(datos, estado);
    return [...g.objetos, ...g.textos].every(q => q.x0 >= M - 1e-9 && q.y0 >= M - 1e-9 && q.x1 <= W - M + 1e-9 && q.y1 <= H - M + 1e-9);
  }
  return { id: 'alg-caja', dibujar, alt, geometria, cabe, constantes: { W, H, M } };
});
