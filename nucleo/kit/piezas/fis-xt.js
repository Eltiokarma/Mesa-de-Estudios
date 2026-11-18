/*
 * Pieza «fis-xt» (18 nov 2026, Movimiento rectilíneo uniforme, idea 2 «La gráfica posición–tiempo»;
 * docs/etapa4/propuesta-fisica.md §2, A2): la gráfica posición–tiempo que se dibuja junto a la combi. Arriba, si se pide,
 * la avenida de fis-combi con la combi (o la combi y el mototaxi) en el mismo instante, sin la franja de las marcas de
 * cada segundo (aquí las marcas son los puntos de la gráfica); abajo, el plano x–t con un punto
 * por cada segundo y la recta que los une. Dibujo de prueba (data-prueba); Gerson decide después si lo reemplaza.
 *
 * Afirmación de la figura: cada punto de la gráfica es dónde estaba en un segundo; lo que sube la recta por cada
 * segundo es la velocidad. La gráfica no es el camino: la avenida es recta y plana aunque la recta suba.
 *
 * datos = {
 *   avenida: { …datos de fis-combi, vista 'avenida' },   // opcional: la escena arriba (alto ALTO_AV)
 *   t: { max: 5, paso: 1, nombre: 't (s)' },           // eje horizontal, desde 0 (s); nombre: 't (min)' si va en minutos
 *   x: { min: -100, max: 100, paso: 20, numero: 40, nombre: 'x (m)' },  // eje vertical: rayita cada paso, número cada `numero`
 *   lineas: [{ puntos: [[t, x], …], trazo: 'continua' | 'discontinua', rotulo: 'combi', rotuloEn: 5, rotuloLado: 'abajo',
 *              segundos: true, desde, hasta }],   // rotuloEn: en qué instante va el nombre (si no, al final de la línea)
 *            // la posición de un móvil (violeta: es x). Dos móviles: el mismo color y trazo distinto (Gerson, 18 nov).
 *            // segundos: un punto en cada segundo entero. Con `instante`, la línea llega solo hasta ese t
 *   puntos: [{ t, x, texto, color, marca: 'punto' | 'aro', lado: 'arriba' | 'abajo' | 'izq' | 'der' | 'arribaIzq' | …, desde, hasta }],
 *   escalon: { de: [t1, x1], a: [t2, x2], dt: 'Δt = 3 s', dx: 'Δx = 12 m', ladoDx: 'izq', dxPie: true, desde, desdeX },   // la pendiente: el tramo
 *            // horizontal (tiempo, turquesa) y el vertical (posición, violeta), cada uno con su rótulo
 *   instante: 2.5,                                    // opcional: la gráfica hasta ese t, con el punto del momento
 * }
 * estado = { corte }: lo que lleva `desde` aparece cuando corte ≥ desde (la línea de tiempo de «Mira»).
 * Función pura de (datos, estado): sin ids, sin azar, sin reloj. Ancho 320; dos altos fijos: con avenida y sin ella.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const Kit = nodo ? require('../kit.js') : root.Kit;
  const T = nodo ? require('../trazo.js') : root.Kit.trazo;
  if (nodo) require('./fis-combi.js');
  const api = fabrica(Kit, T);
  Kit.registrar(api);
  if (nodo) module.exports = api;
})(typeof self !== 'undefined' ? self : this, function (Kit, T) {
  'use strict';
  const W = 320, CORTE_AV = 104, REGLA_AV = 134, ALTO_AV = CORTE_AV + 184 - REGLA_AV, PX0 = 50, PX1 = 270, ALTO_PLANO = 136, ARRIBA = 30, ABAJO = 28, TXT = 14;
  const H_SOLO = ARRIBA + ALTO_PLANO + ABAJO, H_CON = ALTO_AV + H_SOLO;
  const n = T.n;
  const fmt = m => Kit.formatear(m, 2).replace(/^-/, '−');
  const COMBI = () => Kit.piezas['fis-combi'];
  const caja = (x, y, texto, ancla, peso = 400) => {
    const w = T.ancho(texto, TXT, peso), xx = T.encajar(x, texto, ancla, { tam: TXT, peso, min: 4, max: W - 4 });
    const izq = ancla === 'middle' ? xx - w / 2 : ancla === 'end' ? xx - w : xx;
    return { x0: izq, x1: izq + w, y0: y - TXT * 0.78, y1: y + TXT * 0.22, x: xx, y, texto, ancla, peso };
  };
  const visible = (o, corte) => !o || ((o.desde === undefined || corte >= o.desde) && (o.hasta === undefined || corte <= o.hasta));
  // La línea hasta el instante t (corta el último tramo donde cae t).
  function hastaT(pts, t) {
    if (!Number.isFinite(t)) return pts;
    const out = [];
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      if (p[0] <= t + 1e-9) { out.push(p); continue; }
      const q = pts[i - 1];
      if (q) out.push([t, q[1] + (p[1] - q[1]) * (t - q[0]) / (p[0] - q[0])]);
      break;
    }
    return out;
  }
  const enT = (pts, t) => { for (let i = 1; i < pts.length; i++) if (t <= pts[i][0] + 1e-9) return pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * (t - pts[i - 1][0]) / ((pts[i][0] - pts[i - 1][0]) || 1); return pts[pts.length - 1][1]; };

  // Todo lo que la pieza dibuja, con números (lo usan dibujar, las manijas del juego y las pruebas).
  function geometria(datos, estado = {}) {
    const d = datos || {}, corte = Number.isFinite(estado.corte) ? estado.corte : Infinity;
    const et = Object.assign({ max: 5, paso: 1 }, d.t), ex = Object.assign({ min: 0, max: 100, paso: 10, numero: 20 }, d.x);
    const top = (d.avenida ? ALTO_AV : 0) + ARRIBA, bot = top + ALTO_PLANO;
    const X = t => PX0 + (PX1 - PX0) * t / et.max, Y = x => bot - (bot - top) * (x - ex.min) / (ex.max - ex.min);
    const Xi = px => (px - PX0) * et.max / (PX1 - PX0), Yi = py => ex.min + (bot - py) * (ex.max - ex.min) / (bot - top);
    const ceroY = Y(Math.max(ex.min, Math.min(ex.max, 0)));
    const g = { d, et, ex, top, bot, X, Y, Xi, Yi, ceroY, H: d.avenida ? H_CON : H_SOLO, rotulos: [], corte };
    // números de los ejes
    g.numT = [];
    for (let k = 0; k <= et.max + 1e-9; k += et.paso) { const c = caja(X(k), bot + 18, fmt(Math.round(k * 100) / 100), 'middle'); g.numT.push(c); g.rotulos.push(c); }
    g.numX = [];
    for (let m = Math.ceil(ex.min / ex.numero - 1e-9) * ex.numero; m <= ex.max + 1e-9; m += ex.numero) {
      const c = caja(PX0 - 8, Y(m) + 5, fmt(Math.round(m * 100) / 100), 'end'); g.numX.push(Object.assign(c, { m })); g.rotulos.push(c);
    }
    g.nombreX = caja(PX0 - 8, top - 12, ex.nombre || 'x (m)', 'start', 700);
    g.nombreT = caja(W - 4, bot + 18, et.nombre || 't (s)', 'end', 700);
    g.rotulos.push(g.nombreX, g.nombreT);
    // líneas: la posición de cada móvil, hasta el instante si lo hay
    g.lineas = (d.lineas || []).filter(l => visible(l, corte)).map(l => {
      const pts = hastaT(l.puntos, d.instante), L = { pts, trazo: l.trazo || 'continua', segundos: [], rotulo: null };
      if (l.segundos && pts.length) {
        const t0 = pts[0][0], t1 = pts[pts.length - 1][0];
        for (let k = Math.ceil(t0 - 1e-9); k <= t1 + 1e-9; k++) L.segundos.push([k, enT(pts, k)]);
      }
      if (l.rotulo && pts.length >= 2 && Number.isFinite(l.rotuloEn)) {
        // El nombre se aparta de su línea lo que ella sube o baja en medio ancho del rótulo: nunca la toca.
        const tt = l.rotuloEn, px = X(tt), py = Y(enT(l.puntos, tt)), dd = 0.5;
        const m = Math.abs((Y(enT(l.puntos, tt + dd)) - Y(enT(l.puntos, tt - dd))) / (X(tt + dd) - X(tt - dd)));
        const off = 5 + m * T.ancho(l.rotulo, TXT) / 2;
        L.rotulo = l.rotuloLado === 'abajo' ? caja(px, py + off + TXT * 0.78, l.rotulo, 'middle') : caja(px, py - off - TXT * 0.22, l.rotulo, 'middle');
        g.rotulos.push(L.rotulo);
      } else if (l.rotulo && pts.length >= 2 && !Number.isFinite(d.instante)) {
        const p = pts[pts.length - 1], q = pts[pts.length - 2], sube = p[1] >= q[1];
        L.rotulo = caja(X(p[0]) + 6, Y(p[1]) + (sube ? -6 : 16), l.rotulo, 'start');
        if (L.rotulo.x1 > W - 4 || L.rotulo.x0 < X(p[0])) L.rotulo = caja(X(p[0]) - 6, Y(p[1]) + (sube ? -8 : 18), l.rotulo, 'end');
        g.rotulos.push(L.rotulo);
      }
      return L;
    });
    // Los nombres de dos líneas que terminan cerca se separan en vertical: el de más abajo baja y el otro sube.
    const nombres = g.lineas.map(L => L.rotulo).filter(Boolean);
    for (let a = 0; a < nombres.length; a++) for (let b = a + 1; b < nombres.length; b++) {
      const p = nombres[a], q = nombres[b];
      if (!(p.x0 < q.x1 && q.x0 < p.x1 && p.y0 < q.y1 && q.y0 < p.y1)) continue;
      const [arr, abj] = p.y0 <= q.y0 ? [p, q] : [q, p], falta = arr.y1 - abj.y0 + 2;
      for (const [c, dy] of [[arr, -falta / 2], [abj, falta / 2]]) { c.y += dy; c.y0 += dy; c.y1 += dy; }
    }
    // el punto del instante, sobre cada línea
    g.ahora = Number.isFinite(d.instante) ? g.lineas.filter(l => l.pts.length).map(l => l.pts[l.pts.length - 1]) : [];
    g.puntos = (d.puntos || []).filter(p => visible(p, corte)).map(p => {
      const px = X(p.t), py = Y(p.x), lado = p.lado || 'arriba';
      let c = null;
      if (p.texto) {
        const L = { abajo: [0, 20, 'middle'], izq: [-9, 5, 'end'], der: [9, 5, 'start'], arriba: [0, -10, 'middle'],
          arribaIzq: [-6, -8, 'end'], arribaDer: [6, -8, 'start'], abajoIzq: [-6, 18, 'end'], abajoDer: [6, 18, 'start'] }[lado] || [0, -10, 'middle'];
        c = caja(px + L[0], py + L[1], p.texto, L[2], 700);
        g.rotulos.push(c);
      }
      return { px, py, color: p.color, marca: p.marca || 'punto', caja: c };
    });
    const e = d.escalon;
    if (e && visible(e, corte)) {
      const [t1, x1] = e.de, [t2, x2] = e.a, sube = x2 >= x1;
      g.escalon = { ax: X(t1), ay: Y(x1), bx: X(t2), by: Y(x2), verX: e.desdeX === undefined || corte >= e.desdeX };
      g.escalon.cdt = e.dt ? caja((X(t1) + X(t2)) / 2, Y(x1) + (sube ? 18 : -8), e.dt, 'middle', 700) : null;
      const izqDx = e.ladoDx === 'izq';
      // dxPie: el rótulo de Δx junto al pie del tramo vertical (no a media altura), para dejar libre lo de arriba
      const yDx = e.dxPie ? Y(x1) + (sube ? 5 : 2) : (Y(x1) + Y(x2)) / 2 + 5;
      g.escalon.cdx = e.dx && g.escalon.verX ? caja(X(t2) + (izqDx ? -8 : 8), yDx, e.dx, izqDx ? 'end' : 'start', 700) : null;
      if (g.escalon.cdx && !izqDx && g.escalon.cdx.x1 > W - 4 + 1e-9) g.escalon.cdx = caja(X(t2) - 8, yDx, e.dx, 'end', 700);
      for (const c of [g.escalon.cdt, g.escalon.cdx]) if (c) g.rotulos.push(c);
    }
    return g;
  }

  function dibujar(datos, estado = {}) {
    const g = geometria(datos, estado), d = g.d, cf = T.color('f');
    const rot = (b, color) => T.rotulo(b.x, b.y, b.texto, { ancla: b.ancla, peso: b.peso, color, tam: TXT, min: 4, max: W - 4 });
    let s = '';
    if (d.avenida) {
      const av = Object.assign({ vista: 'avenida' }, d.avenida, Number.isFinite(d.instante) ? { t: d.instante } : {});
      // La avenida sin la franja de las marcas de cada segundo (aquí las marcas son los puntos de la gráfica): se
      // muestran la calle (0 a CORTE_AV) y la regla (desde REGLA_AV) una debajo de otra, con dos svg anidados.
      const av0 = COMBI().dibujar(av, {}).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, ''), hr = 184 - REGLA_AV;
      s += `<svg x="0" y="0" width="${W}" height="${CORTE_AV}" viewBox="0 0 ${W} ${CORTE_AV}">${av0}</svg>`
        + `<svg x="0" y="${CORTE_AV}" width="${W}" height="${hr}" viewBox="0 ${REGLA_AV} ${W} ${hr}">${av0}</svg>`;
      s += `<line x1="8" y1="${ALTO_AV + 2}" x2="${W - 8}" y2="${ALTO_AV + 2}" stroke="currentColor" stroke-width="1" stroke-opacity="0.25"/>`;
    }
    // cuadrícula tenue y ejes: el del tiempo pasa por x = 0
    let grid = '';
    for (let k = 0; k <= g.et.max + 1e-9; k += g.et.paso) grid += T.linea(g.X(k), g.top, g.X(k), g.bot, { grosor: 1, opacidad: 0.16 });
    for (let m = Math.ceil(g.ex.min / g.ex.paso - 1e-9) * g.ex.paso; m <= g.ex.max + 1e-9; m += g.ex.paso) grid += T.linea(PX0, g.Y(m), PX1, g.Y(m), { grosor: 1, opacidad: 0.16 });
    s += `<g class="kit-cuadricula">${grid}</g>`;
    s += `<g class="kit-eje">${T.flecha(PX0, g.bot + 4, PX0, g.top - 10, { grosor: 2 })}${T.flecha(PX0 - 4, g.ceroY, PX1 + 18, g.ceroY, { grosor: 2 })}</g>`;
    for (const c of g.numT) s += rot(c);
    for (const c of g.numX) s += rot(c);
    s += rot(g.nombreX, 'f') + rot(g.nombreT, 'i');
    // el escalón de la pendiente, debajo de las líneas
    if (g.escalon) {
      const e = g.escalon, ci = T.color('i');
      s += `<line x1="${n(e.ax)}" y1="${n(e.ay)}" x2="${n(e.bx)}" y2="${n(e.ay)}" stroke="${ci}" stroke-width="3" stroke-linecap="round"/>`;
      if (e.verX) s += `<line x1="${n(e.bx)}" y1="${n(e.ay)}" x2="${n(e.bx)}" y2="${n(e.by)}" stroke="${cf}" stroke-width="3" stroke-linecap="round"/>`;
      if (e.cdt) s += rot(e.cdt, 'i');
      if (e.cdx) s += rot(e.cdx, 'f');
    }
    for (const L of g.lineas) {
      if (L.pts.length >= 2) s += `<path d="M${L.pts.map(p => `${n(g.X(p[0]))} ${n(g.Y(p[1]))}`).join('L')}" fill="none" stroke="${cf}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"${L.trazo === 'discontinua' ? ' stroke-dasharray="8 6"' : ''}/>`;
      for (const p of L.segundos) s += L.trazo === 'discontinua'
        ? `<circle cx="${n(g.X(p[0]))}" cy="${n(g.Y(p[1]))}" r="3.5" fill="var(--card)" stroke="${cf}" stroke-width="2"/>`
        : `<circle cx="${n(g.X(p[0]))}" cy="${n(g.Y(p[1]))}" r="3.5" fill="${cf}"/>`;
      if (L.rotulo) s += rot(L.rotulo);
    }
    for (const p of g.ahora) s += `<circle cx="${n(g.X(p[0]))}" cy="${n(g.Y(p[1]))}" r="5.5" fill="var(--card)" stroke="${cf}" stroke-width="3"/>`;
    for (const p of g.puntos) {
      const k = T.color(p.color);
      s += p.marca === 'aro' ? `<circle cx="${n(p.px)}" cy="${n(p.py)}" r="6" fill="none" stroke="${k}" stroke-width="2.5"/>`
        : `<circle cx="${n(p.px)}" cy="${n(p.py)}" r="4" fill="${k}"/>`;
      if (p.caja) s += rot(p.caja, p.color);
    }
    return T.svg(W, g.H, `<g data-prueba="si" class="fis-xt">${s}</g>`, { alt: alt(datos) });
  }

  function alt(datos) {
    const d = datos || {};
    let s = 'Una gráfica posición–tiempo: el tiempo en segundos hacia la derecha y la posición en metros hacia arriba.';
    const ls = d.lineas || [];
    if (ls.length === 1) s += ' Una línea muestra dónde está el móvil en cada instante.';
    else if (ls.length > 1) s += ` ${ls.length} líneas, una por móvil (${ls.map(l => l.rotulo || 'sin nombre').join(' y ')}).`;
    if (d.avenida) s += ' Arriba, la misma combi en la avenida.';
    const pts = (d.puntos || []).filter(p => p.texto).map(p => p.texto);
    if (pts.length) s += ` Puntos marcados: ${pts.join(', ')}.`;
    return s;
  }

  return { id: 'fis-xt', dibujar, alt, geometria, constantes: { W, H_SOLO, H_CON, ALTO_AV, PX0, PX1 } };
});
