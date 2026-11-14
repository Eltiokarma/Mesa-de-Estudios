/*
 * Pieza «fis-vasos» (física, docs/teoria.md): recipientes con líquido vistos de costado. Vasos de varias formas,
 * tubo en U con uno o dos líquidos, barómetro de mercurio, prensa hidráulica y tubo horizontal con estrechamiento
 * (con tubitos que miden la presión). Puntos a una profundidad, cotas verticales, un bloque que flota o se hunde con
 * sus flechas de empuje y peso. Sirve para presión hidrostática, vasos comunicantes, Pascal, Arquímedes y Bernoulli.
 *
 * Afirmación de la figura: la presión en un punto la decide cuánto líquido tiene encima en vertical, no la forma
 * del recipiente; las alturas y las flechas están a escala.
 *
 * Fidelidad: una sola escala vertical (px por unidad de `alto`) para todos los recipientes de la figura; en la prensa,
 * el ancho de cada émbolo es proporcional a su área (misma profundidad); en el tubo, la altura de cada tramo es
 * proporcional a su área y el largo de cada flecha de v, a la rapidez.
 * Los líquidos van en tinta con distinto tono (1 claro, 2 medio, 3 oscuro): no usan colores de variable.
 *
 * datos = {
 *   alto: 1, unidad: 'm',                       // la escala vertical: de la base (0) a `alto`
 *   recipientes: [                              // uno a tres, lado a lado (prensa y tubo ocupan todo el ancho)
 *     { tipo: 'vaso', forma: 'recto'|'ancho'|'embudo'|'botella', nivel, tono: 1, rotulo,
 *       bloque: { ancho: 0.3, alto, base, tono, rotulo, E: { largo, texto }, W: { largo, texto } } },  // base: altura de su cara de abajo
 *     { tipo: 'u', izq: [{ h, tono }], der: [{ h, tono }], rotulo },   // capas desde la base de cada rama
 *     { tipo: 'barometro', columna, rotulo },                          // columna de mercurio sobre la cubeta
 *     { tipo: 'prensa', a1, a2, nivel, F1: { texto, largo }, F2: { texto, largo } },   // a1, a2: áreas (cualquier unidad)
 *     { tipo: 'tubo', a1, a2, v1: { texto, largo }, v2: { texto, largo }, h1, h2 },   // h1, h2: columnas de los tubitos
 *   ],
 *   puntos: [{ k, y, lado: 'der'|'izq', rotulo, color, desde }],   // y: altura sobre la base del recipiente k
 *   cotas: [{ k, y1, y2, texto, color, lado: 'izq'|'der', desde }],
 *   colores: { F: 'h', v: 'o' }                // flechas de fuerza y de velocidad (regla 4)
 * }
 * estado = { corte }   // puntos y cotas con desde ≤ corte
 * El dibujo es una función pura de (datos, estado): sin ids, sin azar, sin reloj. Alto fijo.
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
  const W = 320, ALTO = 278, BASE = 228, TECHO = 48, OP = { 1: 0.14, 2: 0.3, 3: 0.5 };

  const altoU = d => (d.alto > 0 ? d.alto : 1);
  const Y = (d, y) => BASE - (BASE - TECHO) * y / altoU(d);
  const recs = d => (d.recipientes || []).slice(0, 3);
  // Un recipiente solo ocupa 200 px al centro: deja sitio a las cotas y rótulos de los costados.
  const ranura = (d, k) => { const n = Math.max(1, recs(d).length); if (n === 1) return { cx: W / 2, sw: 200 }; const sw = W / n; return { cx: sw * (k + 0.5), sw }; };
  const col = (d, q) => (d.colores && d.colores[q]) || (q === 'F' ? 'h' : 'o');
  const liq = (pts, tono) => `<path d="M${pts.map(p => `${T.n(p[0])} ${T.n(p[1])}`).join('L')}Z" fill="currentColor" fill-opacity="${OP[tono] || OP[1]}" stroke="none"/>`;
  const contorno = (pts, cerrar = false) => `<path d="M${pts.map(p => `${T.n(p[0])} ${T.n(p[1])}`).join('L')}${cerrar ? 'Z' : ''}" fill="none" stroke="currentColor" stroke-width="${T.GROSOR.contorno}" stroke-linejoin="round" stroke-linecap="round"/>`;

  // Ancho de un vaso a la altura y (px), según su forma.
  function anchos(forma, sw) {
    const a = { recto: [0.42, 0.42], ancho: [0.8, 0.8], embudo: [0.24, 0.8], botella: [0.8, 0.24] }[forma] || [0.42, 0.42];
    return [a[0] * sw, a[1] * sw];
  }
  // Geometría de cada recipiente: dónde está cada borde a cada altura (para puntos y cotas).
  function bordes(d, k, y) {
    const r = recs(d)[k], { cx, sw } = ranura(d, k);
    if (!r) return { izq: cx - 20, der: cx + 20 };
    if (r.tipo === 'vaso') {
      const [wb, wt] = anchos(r.forma, sw), w = wb + (wt - wb) * Math.min(1, Math.max(0, y / altoU(d)));
      return { izq: cx - w / 2, der: cx + w / 2 };
    }
    if (r.tipo === 'u') return { izq: cx - sw * 0.3 - 11, der: cx + sw * 0.3 + 11, ramas: [cx - sw * 0.3, cx + sw * 0.3] };
    return { izq: cx - 12, der: cx + 12 };
  }

  function vaso(d, k, r) {
    const { cx, sw } = ranura(d, k), [wb, wt] = anchos(r.forma, sw);
    const yb = Y(d, 0), yt = Y(d, altoU(d)), niv = Math.min(altoU(d), Math.max(0, r.nivel || 0));
    const wn = wb + (wt - wb) * niv / altoU(d), yn = Y(d, niv);
    let s = liq([[cx - wb / 2, yb], [cx + wb / 2, yb], [cx + wn / 2, yn], [cx - wn / 2, yn]], r.tono);
    s += T.linea(cx - wn / 2, yn, cx + wn / 2, yn, { grosor: T.GROSOR.contorno, opacidad: 0.7 });
    s += contorno([[cx - wt / 2, yt], [cx - wb / 2, yb], [cx + wb / 2, yb], [cx + wt / 2, yt]]);
    const b = r.bloque;
    if (b) {
      const bw = (b.ancho || 0.3) * sw, y0 = Y(d, b.base || 0), y1 = Y(d, (b.base || 0) + (b.alto || 0.1));
      s += `<rect x="${T.n(cx - bw / 2)}" y="${T.n(y1)}" width="${T.n(bw)}" height="${T.n(y0 - y1)}" rx="3" fill="var(--card)" stroke="currentColor" stroke-width="${T.GROSOR.contorno}"/>`;
      // La parte sumergida se ve con el tono del líquido encima del bloque: es el volumen desalojado.
      const ys = Y(d, Math.min(niv, (b.base || 0) + (b.alto || 0)));
      if (ys < y0) s += `<rect x="${T.n(cx - bw / 2)}" y="${T.n(ys)}" width="${T.n(bw)}" height="${T.n(y0 - ys)}" fill="currentColor" fill-opacity="${OP[r.tono] || OP[1]}"/>`;
      if (b.rotulo) s += T.rotulo(cx, (y0 + y1) / 2 + 5, b.rotulo, { ancla: 'middle', peso: 600, tam: 14, clase: 'kit-txt' });
      const ym = (y0 + y1) / 2;
      if (b.E && b.E.largo > 0) {
        s += T.flecha(cx - bw / 2 - 10, ym, cx - bw / 2 - 10, ym - b.E.largo, { grosor: T.GROSOR.variable, color: col(d, 'F') });
        if (b.E.texto) s += T.rotulo(cx - bw / 2 - 16, ym - b.E.largo + 6, b.E.texto, { ancla: 'end', color: col(d, 'F'), peso: 700, clase: 'kit-txt' });
      }
      if (b.W && b.W.largo > 0) {
        s += T.flecha(cx + bw / 2 + 10, ym, cx + bw / 2 + 10, ym + b.W.largo, { grosor: T.GROSOR.variable, color: col(d, 'F') });
        if (b.W.texto) s += T.rotulo(cx + bw / 2 + 16, ym + b.W.largo, b.W.texto, { color: col(d, 'F'), peso: 700, clase: 'kit-txt' });
      }
    }
    return s;
  }

  function tuboU(d, k, r) {
    const { cx, sw } = ranura(d, k), xs = [cx - sw * 0.3, cx + sw * 0.3], w = 22, yb = Y(d, 0), yt = Y(d, altoU(d));
    let s = '';
    const fondo = ((r.izq || [])[0] || {}).tono || 1;
    s += liq([[xs[0] - w / 2, yb - 4], [xs[1] + w / 2, yb - 4], [xs[1] + w / 2, yb + 18], [xs[0] - w / 2, yb + 18]], fondo);
    [r.izq || [], r.der || []].forEach((capas, i) => {
      let y = 0;
      for (const c of capas) {
        s += liq([[xs[i] - w / 2, Y(d, y)], [xs[i] + w / 2, Y(d, y)], [xs[i] + w / 2, Y(d, y + c.h)], [xs[i] - w / 2, Y(d, y + c.h)]], c.tono);
        y += c.h;
        s += T.linea(xs[i] - w / 2, Y(d, y), xs[i] + w / 2, Y(d, y), { grosor: T.GROSOR.cuadricula, opacidad: 0.7 });
      }
    });
    s += contorno([[xs[0] - w / 2, yt], [xs[0] - w / 2, yb + 18], [xs[1] + w / 2, yb + 18], [xs[1] + w / 2, yt]]);
    s += contorno([[xs[0] + w / 2, yt], [xs[0] + w / 2, yb - 4], [xs[1] - w / 2, yb - 4], [xs[1] - w / 2, yt]]);
    return s;
  }

  function barometro(d, k, r) {
    const { cx, sw } = ranura(d, k), w = 20, yb = Y(d, 0), yt = Y(d, altoU(d)) - 6, yc = Y(d, r.columna || 0);
    let s = liq([[cx - sw * 0.38, yb + 18], [cx + sw * 0.38, yb + 18], [cx + sw * 0.38, yb + 2], [cx - sw * 0.38, yb + 2]], 3);
    s += contorno([[cx - sw * 0.4, yb - 6], [cx - sw * 0.4, yb + 20], [cx + sw * 0.4, yb + 20], [cx + sw * 0.4, yb - 6]]);
    s += liq([[cx - w / 2, yb + 10], [cx + w / 2, yb + 10], [cx + w / 2, yc], [cx - w / 2, yc]], 3);
    s += contorno([[cx - w / 2, yb + 12], [cx - w / 2, yt], [cx + w / 2, yt], [cx + w / 2, yb + 12]]);
    if (yc - yt > 22) s += T.rotulo(cx + w / 2 + 6, (yc + yt) / 2 + 5, 'vacío', { tam: 14 });
    return s;
  }

  function prensa(d, r) {
    const tot = (r.a1 || 1) + (r.a2 || 1), util = 200, w1 = util * r.a1 / tot, w2 = util * r.a2 / tot;
    const x1 = 60, x2 = 210, yb = Y(d, 0), yn = Y(d, r.nivel || altoU(d) * 0.6), yt = Y(d, altoU(d));
    let s = liq([[x1 - w1 / 2, yn], [x1 + w1 / 2, yn], [x1 + w1 / 2, yb - 16], [x2 - w2 / 2, yb - 16], [x2 - w2 / 2, yn], [x2 + w2 / 2, yn], [x2 + w2 / 2, yb + 6], [x1 - w1 / 2, yb + 6]], 1);
    s += contorno([[x1 - w1 / 2, yt], [x1 - w1 / 2, yb + 6], [x2 + w2 / 2, yb + 6], [x2 + w2 / 2, yt]]);
    s += contorno([[x1 + w1 / 2, yt], [x1 + w1 / 2, yb - 16], [x2 - w2 / 2, yb - 16], [x2 - w2 / 2, yt]]);
    for (const [x, w] of [[x1, w1], [x2, w2]]) s += `<rect x="${T.n(x - w / 2 + 2)}" y="${T.n(yn - 10)}" width="${T.n(w - 4)}" height="10" rx="2" fill="var(--card)" stroke="currentColor" stroke-width="${T.GROSOR.contorno}"/>`;
    const c = col(d, 'F');
    if (r.F1) {
      s += T.flecha(x1, yn - 12 - (r.F1.largo || 20), x1, yn - 12, { grosor: T.GROSOR.variable, color: c });
      if (r.F1.texto) s += T.rotulo(x1, yn - 18 - (r.F1.largo || 20), r.F1.texto, { ancla: 'middle', color: c, peso: 700, clase: 'kit-txt' });
    }
    if (r.F2) {
      s += T.flecha(x2, yn - 12, x2, yn - 12 - (r.F2.largo || 20), { grosor: T.GROSOR.variable, color: c });
      if (r.F2.texto) s += T.rotulo(x2, yn - 18 - (r.F2.largo || 20), r.F2.texto, { ancla: 'middle', color: c, peso: 700, clase: 'kit-txt' });
    }
    s += T.rotulo(x1, yb + 26, 'A₁', { ancla: 'middle', peso: 600 }) + T.rotulo(x2, yb + 26, 'A₂', { ancla: 'middle', peso: 600 });
    return s;
  }

  function tubo(d, r) {
    const tot = Math.max(r.a1 || 1, r.a2 || 1), H1 = 70 * (r.a1 || 1) / tot, H2 = 70 * (r.a2 || 1) / tot, ym = 186;
    const xa = 14, xb = 116, xc = 204, xd = 306, xs = [65, 255];
    const top = [[xa, ym - H1 / 2], [xb - 20, ym - H1 / 2], [xb + 10, ym - H2 / 2], [xc - 10, ym - H2 / 2], [xc + 20, ym - H1 / 2], [xd, ym - H1 / 2]];
    const bot = top.map(([x, y]) => [x, 2 * ym - y]);
    let s = liq([...top, ...bot.reverse()], 1);
    s += contorno(top) + contorno(top.map(([x, y]) => [x, 2 * ym - y]));
    // Tubitos verticales: uno sobre el tramo ancho y otro sobre el angosto; su columna mide la presión.
    const xt = [xs[0], 160], ys = [ym - H1 / 2, ym - H2 / 2], hs = [r.h1 || 0, r.h2 || 0];
    xt.forEach((x, i) => {
      const yc = ys[i] - (ys[i] - TECHO) * hs[i] / altoU(d);
      s += liq([[x - 6, ys[i] + 1], [x + 6, ys[i] + 1], [x + 6, yc], [x - 6, yc]], 1);
      s += contorno([[x - 7, TECHO], [x - 7, ys[i]]]) + contorno([[x + 7, TECHO], [x + 7, ys[i]]]);
      s += T.linea(x - 7, yc, x + 7, yc, { grosor: T.GROSOR.contorno, opacidad: 0.8 });
    });
    const c = col(d, 'v');
    if (r.v1) {
      s += T.flecha(xs[0] - 22, ym, xs[0] - 22 + (r.v1.largo || 20), ym, { grosor: T.GROSOR.variable, color: c });
      if (r.v1.texto) s += T.rotulo(xs[0] - 22, ym + H1 / 2 + 20, r.v1.texto, { color: c, peso: 700, clase: 'kit-txt' });
    }
    if (r.v2) {
      s += T.flecha(160 - (r.v2.largo || 20) / 2, ym, 160 + (r.v2.largo || 20) / 2, ym, { grosor: T.GROSOR.variable, color: c });
      if (r.v2.texto) s += T.rotulo(160, ym + H1 / 2 + 20, r.v2.texto, { ancla: 'middle', color: c, peso: 700, clase: 'kit-txt' });
    }
    return s;
  }

  function dibujar(d, estado = {}) {
    const corte = Number.isFinite(estado.corte) ? estado.corte : Infinity;
    let s = '';
    const rs = recs(d);
    const lleno = rs.length === 1 && ['prensa', 'tubo'].includes(rs[0].tipo);
    if (lleno) s += rs[0].tipo === 'prensa' ? prensa(d, rs[0]) : tubo(d, rs[0]);
    else rs.forEach((r, k) => {
      s += r.tipo === 'u' ? tuboU(d, k, r) : r.tipo === 'barometro' ? barometro(d, k, r) : vaso(d, k, r);
      if (r.rotulo) s += T.rotulo(ranura(d, k).cx, ALTO - 6, r.rotulo, { ancla: 'middle', peso: 700 });
    });
    for (const c of d.cotas || []) {
      if ((c.desde || 0) > corte || lleno) continue;
      const b = bordes(d, c.k || 0, Math.max(c.y1, c.y2));
      const x = c.lado === 'der' ? b.der + 10 : b.izq - 10;
      const y1 = Y(d, c.y1), y2 = Y(d, c.y2);
      s += `<g>${T.linea(x, y1, x, y2, { grosor: T.GROSOR.contorno, color: c.color })}${T.linea(x - 5, y1, x + 5, y1, { grosor: T.GROSOR.contorno, color: c.color })}${T.linea(x - 5, y2, x + 5, y2, { grosor: T.GROSOR.contorno, color: c.color })}</g>`;
      if (c.texto) s += T.rotulo(x + (c.lado === 'der' ? 8 : -8), (y1 + y2) / 2 + 5, c.texto, { ancla: c.lado === 'der' ? 'start' : 'end', color: c.color, peso: 700, clase: 'kit-txt' });
    }
    for (const p of d.puntos || []) {
      if ((p.desde || 0) > corte || lleno) continue;
      const r = recs(d)[p.k || 0];
      const b = bordes(d, p.k || 0, p.y);
      let x = (b.izq + b.der) / 2;
      if (r && r.tipo === 'u') x = b.ramas[p.lado === 'izq' ? 0 : 1];
      if (r && r.tipo === 'barometro') x = ranura(d, p.k || 0).cx;
      const y = Y(d, p.y);
      s += `<circle cx="${T.n(x)}" cy="${T.n(y)}" r="5" fill="${T.color(p.color)}" stroke="var(--card)" stroke-width="1.5"/>`;
      // En el tubo en U el rótulo va hacia adentro de la U (las cotas van por afuera); en un vaso, a la derecha.
      const izq = r && r.tipo === 'u' ? p.lado !== 'izq' : p.lado === 'izq';
      if (p.rotulo) s += T.rotulo(x + (izq ? -14 : 14), y + 5, p.rotulo, { ancla: izq ? 'end' : 'start', color: p.color, peso: 700, clase: 'kit-txt' });
    }
    return T.svg(W, ALTO, s, { alt: alt(d) });
  }

  // El texto alternativo cuenta la relación: alturas de líquido, y lo que se mide en cada punto.
  function alt(d) {
    const u = d.unidad || 'm', fx = v => `${Kit.formatear(v, 2)} ${u}`;
    const rs = recs(d).map(r => {
      if (r.tipo === 'vaso') return `vaso ${r.forma || 'recto'} con líquido hasta ${fx(r.nivel || 0)}${r.bloque ? `, con un bloque ${r.bloque.rotulo || ''}` : ''}`;
      if (r.tipo === 'u') return `tubo en U: rama izquierda de ${fx((r.izq || []).reduce((a, c) => a + c.h, 0))}, derecha de ${fx((r.der || []).reduce((a, c) => a + c.h, 0))}`;
      if (r.tipo === 'barometro') return `barómetro con una columna de ${fx(r.columna || 0)}`;
      if (r.tipo === 'prensa') return `prensa hidráulica: émbolo chico de área ${Kit.formatear(r.a1, 2)} y grande de ${Kit.formatear(r.a2, 2)}${r.F1 ? `; fuerza ${r.F1.texto || ''} y ${r.F2 ? r.F2.texto || '' : ''}` : ''}`;
      if (r.tipo === 'tubo') return `tubo con un tramo angosto; columnas de ${fx(r.h1 || 0)} en el ancho y ${fx(r.h2 || 0)} en el angosto`;
      return 'recipiente';
    });
    const ps = (d.puntos || []).filter(p => p.rotulo).map(p => `${p.rotulo} a ${fx(p.y)} de la base`);
    return `${rs.join('; ') || 'Sin recipientes'}${ps.length ? `. Puntos: ${ps.join(', ')}` : ''}.`;
  }

  return { id: 'fis-vasos', dibujar, alt, escala: Y, constantes: { W, ALTO, BASE, TECHO } };
});
