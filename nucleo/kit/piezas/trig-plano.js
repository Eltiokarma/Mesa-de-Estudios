/*
 * Pieza «trig-plano» (docs/teoria.md, sección 4): el plano de trigonometría a una sola escala. Ejes por el origen,
 * circunferencias, rayos que giran desde el lado inicial, arcos con flecha que dicen el sentido y las vueltas
 * (más de una vuelta se dibuja en espiral), sectores, segmentos (las líneas seno, coseno, tangente…), rectas
 * horizontales o verticales que cruzan todo el plano (y = k), curvas en coordenadas del problema y puntos.
 * Sirve para ángulos, radianes, arcos y sectores, posición normal, reducción, la circunferencia trigonométrica,
 * ecuaciones, inversas, polares, complejos y cónicas.
 *
 * Afirmación de la figura: el ángulo es un giro que se ve; el arco con flecha dice el sentido y las vueltas, y
 * cada largo se mide con la misma escala que el radio.
 *
 * Fidelidad: una sola escala para x e y (un círculo se ve círculo y una elipse con sus semiejes reales); los
 * ángulos se dibujan con su valor, positivos en sentido antihorario desde el eje x positivo.
 *
 * Coordenadas en unidades del problema, con y hacia arriba. Todo número lo calcula quien usa la pieza (regla 1).
 * datos = {
 *   ventana: { x: [min, max], y: [min, max] },     // por defecto [−1,3; 1,3] en los dos ejes
 *   ejes: true, nombres: ['x', 'y'], numeros: 1 | 0  // números de los ejes cada `numeros` unidades (0: sin números)
 *   circulos: [{ cx: 0, cy: 0, r: 1, color, discontinua, desde, hasta }],
 *   sectores: [{ de: 0, a: 60, r: 1, cx, cy, color, desde, hasta, r0 }],   // en grados; r0: trapecio circular
 *   arcos:   [{ de: 0, a: 450, r: 0.35, cx, cy, color, rotulo, flecha: true, espiral: 10, desde, hasta, grosor }],
 *            // de y a en grados con signo; |a − de| > 360 da una espiral que se abre `espiral` px por vuelta
 *   rayos:   [{ ang, largo: 1, cx, cy, color, rotulo, desde, hasta, discontinua, grosor, punta }],
 *   segmentos: [{ de: [x, y], a: [x, y], color, rotulo, desde, hasta, discontinua, grosor, punta }],
 *   rectas:  [{ y: k } | { x: k }, color, rotulo, desde, hasta]          // de borde a borde de la ventana, discontinua
 *   curvas:  [{ puntos: [[x, y], …, null, …], color, rotulo, en: [x, y], desde, hasta, discontinua }],
 *   puntos:  [{ x, y, color, rotulo, abierto, desde, hasta, lado: 'n'|'s'|'e'|'o'|'ne'|… }],
 *   rotulos: [{ x, y, texto, color, desde, hasta, ancla }],
 *   alt: 'texto alternativo'
 * }
 * estado = { corte: 0..n }   // se ve lo que tiene desde ≤ corte (y hasta ≥ corte); lo de desde = corte es nuevo
 * Grosores: 3 para la variable en estudio (rayos, arcos, segmentos con color), 2 contornos, 1 cuadrícula.
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
  const W = 320, M = 22, ANCHO_UTIL = W - 2 * M, ALTO_MAX = 270;
  const rad = g => g * Math.PI / 180;

  function geometria(d) {
    const v = d.ventana || { x: [-1.3, 1.3], y: [-1.3, 1.3] };
    const sx = (v.x[1] - v.x[0]) || 1, sy = (v.y[1] - v.y[0]) || 1;
    const k = Math.min(ANCHO_UTIL / sx, ALTO_MAX / sy);           // px por unidad, igual en x e y
    const ox = (W - sx * k) / 2, alto = sy * k + 2 * M;
    const X = x => ox + (x - v.x[0]) * k;
    const Y = y => M + (v.y[1] - y) * k;
    return { v, k, X, Y, alto, x0: X(v.x[0]), x1: X(v.x[1]), y0: Y(v.y[1]), y1: Y(v.y[0]) };
  }

  const c = (e, def) => (e.color === undefined ? def : e.color);
  const grosor = (e, def) => (e.grosor === 'contorno' ? T.GROSOR.contorno : e.grosor === 'cuadricula' ? T.GROSOR.cuadricula : def);

  function ejesSVG(d, g) {
    let s = '';
    const { v } = g;
    const n = d.numeros === undefined ? 0 : d.numeros;
    if (n > 0) {
      let grid = '';
      for (let x = Math.ceil(v.x[0] / n) * n; x <= v.x[1] + 1e-9; x += n) grid += T.linea(g.X(x), g.y0, g.X(x), g.y1, { grosor: T.GROSOR.cuadricula, opacidad: 0.16 });
      for (let y = Math.ceil(v.y[0] / n) * n; y <= v.y[1] + 1e-9; y += n) grid += T.linea(g.x0, g.Y(y), g.x1, g.Y(y), { grosor: T.GROSOR.cuadricula, opacidad: 0.16 });
      s += `<g class="kit-cuadricula">${grid}</g>`;
    }
    if (d.ejes === false) return s;
    const ey = v.y[0] <= 0 && v.y[1] >= 0 ? g.Y(0) : g.y1, ex = v.x[0] <= 0 && v.x[1] >= 0 ? g.X(0) : g.x0;
    s += `<g class="kit-eje">${T.flecha(g.x0 - 4, ey, g.x1 + 12, ey, { grosor: T.GROSOR.contorno })}${T.flecha(ex, g.y1 + 4, ex, g.y0 - 12, { grosor: T.GROSOR.contorno })}</g>`;
    const [nx, ny] = d.nombres || ['x', 'y'];
    if (nx) s += T.rotulo(g.x1 + 12, ey - 10, nx, { ancla: 'end', peso: 700 });
    if (ny) s += T.rotulo(ex + 10, g.y0 - 2, ny, { peso: 700 });
    if (n > 0) {
      const salto = Math.max(1, Math.ceil(26 / (n * g.k)));      // ralea los números si no caben
      for (let i = Math.ceil(v.x[0] / n); i * n <= v.x[1] + 1e-9; i++) if (i && i % salto === 0 && i * n < v.x[1] - 1e-9) s += T.rotulo(g.X(i * n), ey + 18, Kit.formatear(i * n, 2), { ancla: 'middle', clase: 'kit-num' });
      for (let i = Math.ceil(v.y[0] / n); i * n <= v.y[1] + 1e-9; i++) if (i && i % salto === 0 && i * n < v.y[1] - 1e-9) s += T.rotulo(ex - 6, g.Y(i * n) + 5, Kit.formatear(i * n, 2), { ancla: 'end', clase: 'kit-num' });
    }
    return s;
  }

  // Puntos de un arco (en px): de `de` a `a` grados, radio r unidades, abriéndose `esp` px por vuelta.
  function puntosArco(g, a) {
    const cx = a.cx || 0, cy = a.cy || 0, de = a.de || 0, total = a.a - de, esp = a.espiral === undefined ? 10 : a.espiral;
    const n = Math.max(2, Math.ceil(Math.abs(total) / 3));
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const t = de + total * i / n, r = (a.r === undefined ? 0.35 : a.r) * g.k + esp * Math.abs(total * i / n) / 360;
      pts.push([g.X(cx) + r * Math.cos(rad(t)), g.Y(cy) - r * Math.sin(rad(t))]);
    }
    return pts;
  }
  const camino = pts => 'M' + pts.map(p => `${T.n(p[0])} ${T.n(p[1])}`).join('L');

  function arcoSVG(g, a, cls) {
    if (Math.abs(a.a - (a.de || 0)) < 1e-9) return '';
    const pts = puntosArco(g, a), col = T.color(c(a, 'o')), gr = grosor(a, T.GROSOR.variable);
    let s = `<path class="kit-aparece${cls}" d="${camino(pts)}" fill="none" stroke="${col}" stroke-width="${gr}" stroke-linecap="round" stroke-linejoin="round"/>`;
    if (a.flecha !== false && pts.length > 3) {
      const [x2, y2] = pts[pts.length - 1], [x1, y1] = pts[pts.length - 3];
      s += T.flecha(x1 - (x2 - x1) * 2, y1 - (y2 - y1) * 2, x2, y2, { color: c(a, 'o'), grosor: gr, clase: 'kit-aparece' + cls });
    }
    if (a.rotulo) {
      const mid = (a.de || 0) + (a.a - (a.de || 0)) / 2;
      const p = pts[Math.floor(pts.length / 2)];
      const ux = Math.cos(rad(mid)), uy = -Math.sin(rad(mid));
      s += T.rotulo(p[0] + ux * 18, p[1] + uy * 18 + 5, a.rotulo, { color: c(a, 'o'), peso: 700, ancla: Math.abs(ux) < 0.35 ? 'middle' : ux > 0 ? 'start' : 'end', clase: 'kit-aparece' + cls });
    }
    return s;
  }

  function sectorSVG(g, a, cls) {
    const cx = a.cx || 0, cy = a.cy || 0, r = a.r === undefined ? 1 : a.r, de = a.de || 0, total = a.a - de;
    const n = Math.max(2, Math.ceil(Math.abs(total) / 3));
    const P = (t, rr) => `${T.n(g.X(cx) + rr * g.k * Math.cos(rad(t)))} ${T.n(g.Y(cy) - rr * g.k * Math.sin(rad(t)))}`;
    const fuera = Array.from({ length: n + 1 }, (_, i) => P(de + total * i / n, r));
    const dentro = a.r0 ? Array.from({ length: n + 1 }, (_, i) => P(a.a - total * i / n, a.r0)) : [P(0, 0)];
    const col = T.color(c(a, 'i'));
    return `<path class="kit-aparece${cls}" d="M${fuera.join('L')}L${dentro.join('L')}Z" fill="${col}" fill-opacity="0.2" stroke="${col}" stroke-width="${T.GROSOR.cuadricula}"/>`;
  }

  function rotuloEn(x, y, texto, col, cls, lado) {
    const L = { n: [0, -12], s: [0, 22], e: [10, 5], o: [-10, 5], ne: [8, -8], no: [-8, -8], se: [8, 20], so: [-8, 20] }[lado || 'ne'] || [8, -8];
    const ancla = L[0] > 0 ? 'start' : L[0] < 0 ? 'end' : 'middle';
    return T.rotulo(x + L[0], y + L[1], texto, { color: col, peso: 700, ancla, clase: 'kit-aparece' + cls });
  }

  function segmentoSVG(g, e, de, a, cls, gdef) {
    const col = c(e, undefined), gr = grosor(e, gdef);
    const x1 = g.X(de[0]), y1 = g.Y(de[1]), x2 = g.X(a[0]), y2 = g.Y(a[1]);
    if (Math.hypot(x2 - x1, y2 - y1) < 0.5) return '';
    let s = e.punta ? T.flecha(x1, y1, x2, y2, { color: col, grosor: gr, clase: 'kit-aparece' + cls })
      : T.linea(x1, y1, x2, y2, { color: col, grosor: gr, discontinua: e.discontinua, clase: 'kit-aparece' + cls });
    if (e.rotulo) {
      // El rótulo va a un lado del punto medio, del lado que se aleja del origen del plano.
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
      let nx = -dy / L, ny = dx / L;
      const ox = g.X(0), oy = g.Y(0);
      if ((mx - ox) * nx + (my - oy) * ny < 0) { nx = -nx; ny = -ny; }
      if (e.lado === 'adentro') { nx = -nx; ny = -ny; }
      const ancla = Math.abs(nx) < 0.4 ? 'middle' : nx > 0 ? 'start' : 'end';
      s += T.rotulo(mx + nx * 12, my + ny * 14 + 5, e.rotulo, { color: col, peso: 700, ancla, clase: 'kit-aparece' + cls });
    }
    return s;
  }

  function dibujar(d, estado = {}) {
    const g = geometria(d);
    const corte = Math.max(0, estado.corte || 0);
    const ve = e => (e.desde || 0) <= corte && !(e.hasta < corte);
    const nuevo = e => ((e.desde || 0) === corte && corte > 0 ? ' kit-nuevo' : '');
    let s = ejesSVG(d, g);
    for (const a of d.sectores || []) if (ve(a)) s += sectorSVG(g, a, nuevo(a));
    for (const k of d.circulos || []) if (ve(k)) {
      s += `<circle class="kit-aparece${nuevo(k)}" cx="${T.n(g.X(k.cx || 0))}" cy="${T.n(g.Y(k.cy || 0))}" r="${T.n((k.r === undefined ? 1 : k.r) * g.k)}" fill="none" stroke="${T.color(k.color)}" stroke-width="${k.color ? T.GROSOR.variable : T.GROSOR.contorno}"${k.discontinua ? ' stroke-dasharray="6 5"' : ''}${k.color ? '' : ' stroke-opacity="0.75"'}/>`;
    }
    for (const r of d.rectas || []) if (ve(r)) {
      const hor = r.y !== undefined;
      const [x1, y1, x2, y2] = hor ? [g.x0, g.Y(r.y), g.x1, g.Y(r.y)] : [g.X(r.x), g.y0, g.X(r.x), g.y1];
      s += T.linea(x1, y1, x2, y2, { color: c(r, 'd'), grosor: T.GROSOR.contorno, discontinua: true, clase: 'kit-aparece' + nuevo(r) });
      if (r.rotulo) s += hor ? T.rotulo(g.x1, y1 - 8, r.rotulo, { color: c(r, 'd'), peso: 700, ancla: 'end', clase: 'kit-aparece' + nuevo(r) })
        : T.rotulo(x1 + 6, g.y0 + 14, r.rotulo, { color: c(r, 'd'), peso: 700, clase: 'kit-aparece' + nuevo(r) });
    }
    for (const cv of d.curvas || []) if (ve(cv)) {
      let p = '', nueva = true;
      for (const q of cv.puntos || []) {
        if (!q || !Number.isFinite(q[0]) || !Number.isFinite(q[1])) { nueva = true; continue; }
        p += `${nueva ? 'M' : 'L'}${T.n(g.X(q[0]))} ${T.n(g.Y(q[1]))}`; nueva = false;
      }
      if (p) s += `<path class="kit-aparece${nuevo(cv)}" d="${p}" fill="none" stroke="${T.color(c(cv, 'i'))}" stroke-width="${T.GROSOR.variable}" stroke-linecap="round" stroke-linejoin="round"${cv.discontinua ? ' stroke-dasharray="6 4"' : ''}/>`;
      if (cv.rotulo) {
        const u = cv.en || [...cv.puntos].reverse().find(q => q && Number.isFinite(q[1]));
        if (u) s += rotuloEn(g.X(u[0]), g.Y(u[1]), cv.rotulo, c(cv, 'i'), nuevo(cv), cv.lado);
      }
    }
    for (const sg of d.segmentos || []) if (ve(sg)) s += segmentoSVG(g, sg, sg.de, sg.a, nuevo(sg), sg.color ? T.GROSOR.variable : T.GROSOR.contorno);
    for (const r of d.rayos || []) if (ve(r)) {
      const cx = r.cx || 0, cy = r.cy || 0, L = r.largo === undefined ? 1 : r.largo;
      const fin = [cx + L * Math.cos(rad(r.ang)), cy + L * Math.sin(rad(r.ang))];
      s += segmentoSVG(g, Object.assign({}, r, { rotulo: undefined, punta: r.punta !== false }), [cx, cy], fin, nuevo(r), T.GROSOR.variable);
      if (r.rotulo) {
        const ux = Math.cos(rad(r.ang)), uy = -Math.sin(rad(r.ang));
        s += T.rotulo(g.X(fin[0]) + ux * 16, g.Y(fin[1]) + uy * 16 + 5, r.rotulo, { color: c(r, undefined), peso: 700, ancla: Math.abs(ux) < 0.35 ? 'middle' : ux > 0 ? 'start' : 'end', clase: 'kit-aparece' + nuevo(r) });
      }
    }
    for (const a of d.arcos || []) if (ve(a)) s += arcoSVG(g, a, nuevo(a));
    for (const p of d.puntos || []) if (ve(p)) {
      const col = T.color(c(p, undefined));
      s += `<circle class="kit-aparece${nuevo(p)}" cx="${T.n(g.X(p.x))}" cy="${T.n(g.Y(p.y))}" r="5" fill="${p.abierto ? 'var(--card)' : col}" stroke="${col}" stroke-width="2.5"/>`;
      if (p.rotulo) s += rotuloEn(g.X(p.x), g.Y(p.y), p.rotulo, c(p, undefined), nuevo(p), p.lado);
    }
    for (const r of d.rotulos || []) if (ve(r)) s += T.rotulo(g.X(r.x), g.Y(r.y), r.texto, { color: r.color, peso: 700, ancla: r.ancla || 'middle', clase: 'kit-aparece' + nuevo(r) });
    return T.svg(W, g.alto, s, { alt: alt(d) });
  }

  function alt(d) {
    if (d.alt) return d.alt;
    const partes = [...(d.rayos || []), ...(d.arcos || []), ...(d.segmentos || []), ...(d.puntos || []), ...(d.curvas || [])].filter(e => e.rotulo).map(e => e.rotulo);
    return `Plano con ${d.circulos && d.circulos.length ? 'circunferencia y ' : ''}ejes x e y${partes.length ? ': ' + partes.join('; ') : ''}`;
  }

  return { id: 'trig-plano', dibujar, alt, geometria };
});
