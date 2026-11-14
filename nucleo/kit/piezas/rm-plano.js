/*
 * Pieza «rm-plano» (razonamiento matemático; docs/teoria.md, sección 4): un lienzo a escala con nodos unidos por
 * aristas, segmentos, polígonos y círculos (también ruedas dentadas con su sentido de giro). Sirve para grafos de
 * un solo trazo, árboles de parentesco, mesas redondas, recorridos por cuadras y puntos cardinales, reflejos,
 * diagramas de Venn, engranajes, poleas, figuras que se giran o trasladan y diagramas de flujo.
 *
 * Afirmación de la figura: lo que decide el problema son las uniones y las posiciones; cada una está dibujada donde
 * el dato dice, con una sola escala.
 *
 * Coordenadas en unidades del problema, con y hacia ABAJO (como se lee una hoja: el norte queda arriba).
 * datos = {
 *   ancho: 10, alto: 6,                 // tamaño del lienzo en unidades (una sola escala para los dos ejes)
 *   cuadricula: 1 | 0,                  // líneas tenues cada n unidades (calles, cuadritos)
 *   norte: false,                       // flecha N en la esquina superior derecha
 *   poligonos: [{ puntos: [[x, y], …], abierto, color, relleno, discontinua, grosor, rotulo, en: [x, y], desde, hasta }],
 *   circulos: [{ x, y, r, color, relleno, discontinua, grosor, rotulo, en, dientes, giro: 1 | -1, marca: grados, desde, hasta }],
 *            // dientes: rueda dentada; giro: flecha curva (1 horario, −1 antihorario); marca: radio hasta un punto del borde
 *            // (0° arriba, sentido horario)
 *   lineas: [{ de: [x, y], a: [x, y], color, grosor, discontinua, flecha, rotulo, en, desde, hasta }],
 *   nodos: [{ id, x, y, t, etiqueta, lado: 'abajo'|'arriba'|'izq'|'der', color, relleno, r, cuadrado, desde, hasta }],
 *   aristas: [{ de: id, a: id, color, grosor, discontinua, flecha, rotulo, curva: px, desde, hasta }],
 *   textos: [{ x, y, t, color, peso, ancla, desde, hasta }],
 *   pie: 'texto'                         // una línea bajo el lienzo (el alto se reserva siempre)
 * }
 * estado = { corte: 0..n, fantasma: null | { lineas, poligonos, circulos, nodos, aristas, rotulo } }
 *   corte: se ve lo que tiene desde ≤ corte (y hasta ≥ corte); lo hecho se queda. El fantasma va discontinuo.
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
  const W = 320, PAD = 24, PIE = 28, R_NODO = 15;
  const ve = (x, corte) => (x.desde || 0) <= corte && (x.hasta === undefined || corte <= x.hasta);
  const grosor = g => T.GROSOR[g] || T.GROSOR.contorno;

  function geometria(d) {
    const ancho = d.ancho > 0 ? d.ancho : 10, alto = d.alto > 0 ? d.alto : 6;
    const k = (W - 2 * PAD) / ancho;
    const X = x => PAD + x * k, Y = y => PAD + y * k;
    return { k, X, Y, alto: Math.round(2 * PAD + alto * k + PIE), base: PAD + alto * k };
  }

  function poligono(g, p, fantasma) {
    const pts = (p.puntos || []).filter(Boolean);
    if (pts.length < 2) return '';
    const dd = 'M' + pts.map(q => `${T.n(g.X(q[0]))} ${T.n(g.Y(q[1]))}`).join('L') + (p.abierto ? '' : 'Z');
    const c = T.color(p.color), disc = fantasma || p.discontinua;
    let s = `<path d="${dd}" fill="${p.abierto ? 'none' : c}" fill-opacity="${p.abierto ? 0 : p.relleno === undefined ? 0.14 : p.relleno}" stroke="${c}" stroke-width="${grosor(p.grosor)}" stroke-linejoin="round" stroke-linecap="round"${disc ? ' stroke-dasharray="6 4"' : ''}/>`;
    if (p.rotulo) {
      const en = p.en || pts.reduce((m, q) => [m[0] + q[0] / pts.length, m[1] + q[1] / pts.length], [0, 0]);
      s += T.rotulo(g.X(en[0]), g.Y(en[1]) + 6, p.rotulo, { color: p.color, peso: 700, ancla: 'middle' });
    }
    return s;
  }

  function dientes(cx, cy, r, n) {
    const pts = [];
    const h = 6;
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * 2 * Math.PI, w = Math.PI / n;
      for (const [a, rr] of [[a0 - w * 0.5, r], [a0 - w * 0.3, r + h], [a0 + w * 0.3, r + h], [a0 + w * 0.5, r]]) pts.push([cx + rr * Math.sin(a), cy - rr * Math.cos(a)]);
    }
    return 'M' + pts.map(p => `${T.n(p[0])} ${T.n(p[1])}`).join('L') + 'Z';
  }

  function circulo(g, c, fantasma) {
    const cx = g.X(c.x), cy = g.Y(c.y), r = c.r * g.k, col = T.color(c.color), disc = fantasma || c.discontinua;
    let s = '';
    if (c.dientes) s += `<path d="${dientes(cx, cy, r, c.dientes)}" fill="var(--card)" stroke="${col}" stroke-width="${T.GROSOR.contorno}" stroke-linejoin="round"${disc ? ' stroke-dasharray="6 4"' : ''}/>`;
    s += `<circle cx="${T.n(cx)}" cy="${T.n(cy)}" r="${T.n(r)}" fill="${col}" fill-opacity="${c.relleno === undefined ? (c.dientes ? 0.1 : 0.12) : c.relleno}" stroke="${col}" stroke-width="${grosor(c.grosor)}"${disc ? ' stroke-dasharray="6 4"' : ''}/>`;
    if (c.dientes) s += `<circle cx="${T.n(cx)}" cy="${T.n(cy)}" r="3" fill="currentColor"/>`;
    if (Number.isFinite(c.marca)) {
      const a = c.marca * Math.PI / 180, px = cx + r * Math.sin(a), py = cy - r * Math.cos(a);
      s += T.linea(cx, cy, px, py, { color: c.color, grosor: T.GROSOR.variable }) + `<circle cx="${T.n(px)}" cy="${T.n(py)}" r="5" fill="${col}"/>`;
    }
    if (c.giro) {
      const rr = r + (c.dientes ? 14 : 9), sg = c.giro > 0 ? 1 : -1;
      const a1 = -0.75 * sg, a2 = 0.75 * sg;
      const P = a => [cx + rr * Math.sin(a), cy - rr * Math.cos(a)];
      const [x1, y1] = P(a1), [x2, y2] = P(a2), [x3, y3] = P(a2 + 0.12 * sg);
      s += `<path d="M${T.n(x1)} ${T.n(y1)}A${T.n(rr)} ${T.n(rr)} 0 0 ${sg > 0 ? 1 : 0} ${T.n(x2)} ${T.n(y2)}" fill="none" stroke="${col}" stroke-width="${T.GROSOR.variable}" stroke-linecap="round"/>`;
      s += T.flecha(x2, y2, x3, y3, { color: c.color, grosor: T.GROSOR.variable });
    }
    if (c.rotulo) {
      const en = c.en ? [g.X(c.en[0]), g.Y(c.en[1])] : [cx, cy + 6];
      s += T.rotulo(en[0], en[1], c.rotulo, { color: c.color, peso: 700, ancla: 'middle' });
    }
    return s;
  }

  function linea(g, l, fantasma) {
    const [x1, y1, x2, y2] = [g.X(l.de[0]), g.Y(l.de[1]), g.X(l.a[0]), g.Y(l.a[1])];
    const o = { color: l.color, grosor: grosor(l.grosor || 'variable') };
    let s = l.flecha ? T.flecha(x1, y1, x2, y2, o) : T.linea(x1, y1, x2, y2, Object.assign(o, { discontinua: fantasma || l.discontinua }));
    if (l.flecha && (fantasma || l.discontinua)) s = s.replace('<line ', '<line stroke-dasharray="6 4" ');
    if (l.rotulo) {
      const en = l.en ? [g.X(l.en[0]), g.Y(l.en[1])] : [(x1 + x2) / 2, (y1 + y2) / 2 - 8];
      s += T.rotulo(en[0], en[1], l.rotulo, { color: l.color, peso: 700, ancla: 'middle' });
    }
    return s;
  }

  function nodoSVG(g, n, fantasma) {
    const cx = g.X(n.x), cy = g.Y(n.y), r = n.r || R_NODO, col = T.color(n.color);
    const fondo = n.relleno ? `${col}" fill-opacity="${n.relleno}` : 'var(--card)';
    let s = n.cuadrado
      ? `<rect x="${T.n(cx - r)}" y="${T.n(cy - r)}" width="${2 * r}" height="${2 * r}" rx="5" fill="${fondo}" stroke="${col}" stroke-width="${T.GROSOR.contorno}"${fantasma ? ' stroke-dasharray="5 3"' : ''}/>`
      : `<circle cx="${T.n(cx)}" cy="${T.n(cy)}" r="${r}" fill="${fondo}" stroke="${col}" stroke-width="${T.GROSOR.contorno}"${fantasma ? ' stroke-dasharray="5 3"' : ''}/>`;
    if (n.t !== undefined && n.t !== '') s += T.rotulo(cx, cy + 5.5, n.t, { color: n.color, peso: 700, ancla: 'middle', tam: 14 });
    if (n.etiqueta) {
      const lado = n.lado || 'abajo';
      const [ex, ey, an] = lado === 'arriba' ? [cx, cy - r - 7, 'middle'] : lado === 'izq' ? [cx - r - 6, cy + 5, 'end'] : lado === 'der' ? [cx + r + 6, cy + 5, 'start'] : [cx, cy + r + 17, 'middle'];
      s += T.rotulo(ex, ey, n.etiqueta, { color: n.color, peso: 700, ancla: an });
    }
    return s;
  }

  function arista(g, mapa, a, fantasma) {
    const p = mapa[a.de], q = mapa[a.a];
    if (!p || !q) return '';
    let [x1, y1, x2, y2] = [g.X(p.x), g.Y(p.y), g.X(q.x), g.Y(q.y)];
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
    const r1 = (p.r || R_NODO) + 2, r2 = (q.r || R_NODO) + (a.flecha ? 3 : 2);
    x1 += ux * r1; y1 += uy * r1; x2 -= ux * r2; y2 -= uy * r2;
    const col = T.color(a.color), gr = grosor(a.grosor || 'contorno'), disc = fantasma || a.discontinua;
    let s;
    const mx = (x1 + x2) / 2 - uy * (a.curva || 0), my = (y1 + y2) / 2 + ux * (a.curva || 0);
    if (a.curva) {
      s = `<path d="M${T.n(x1)} ${T.n(y1)}Q${T.n(2 * mx - (x1 + x2) / 2)} ${T.n(2 * my - (y1 + y2) / 2)} ${T.n(x2)} ${T.n(y2)}" fill="none" stroke="${col}" stroke-width="${gr}" stroke-linecap="round"${disc ? ' stroke-dasharray="6 4"' : ''}/>`;
      if (a.flecha) { const tx = x2 - (2 * mx - (x1 + x2) / 2), ty = y2 - (2 * my - (y1 + y2) / 2), tl = Math.hypot(tx, ty) || 1; s += T.flecha(x2 - tx / tl * 6, y2 - ty / tl * 6, x2, y2, { color: a.color, grosor: gr }); }
    } else if (a.flecha) {
      s = T.flecha(x1, y1, x2, y2, { color: a.color, grosor: gr });
      if (disc) s = s.replace('<line ', '<line stroke-dasharray="6 4" ');
    } else s = T.linea(x1, y1, x2, y2, { color: a.color, grosor: gr, discontinua: disc });
    if (a.rotulo) s += T.rotulo(mx - uy * 12, my + ux * 12 + 5, a.rotulo, { color: a.color, peso: 700, ancla: 'middle' });
    return s;
  }

  function capa(g, d, corte, fantasma) {
    const cls = fantasma ? 'kit-fantasma' : 'kit-aparece';
    const sel = l => (l || []).filter(x => fantasma || ve(x, corte));
    const mapa = {};
    for (const n of d.nodos || []) mapa[n.id] = n;
    for (const n of (fantasma && fantasma.nodos) || []) mapa[n.id] = mapa[n.id] || n;
    const src = fantasma || d;
    let s = '';
    for (const p of sel(src.poligonos)) s += `<g class="${cls}">${poligono(g, p, !!fantasma)}</g>`;
    for (const c of sel(src.circulos)) s += `<g class="${cls}">${circulo(g, c, !!fantasma)}</g>`;
    for (const l of sel(src.lineas)) s += `<g class="${cls}">${linea(g, l, !!fantasma)}</g>`;
    for (const a of sel(src.aristas)) s += `<g class="${cls}">${arista(g, mapa, a, !!fantasma)}</g>`;
    for (const n of sel(src.nodos)) s += `<g class="${cls}"${n.tenue ? ' opacity="0.5"' : ''}>${nodoSVG(g, n, !!fantasma)}</g>`;
    for (const t of sel(src.textos)) s += `<g class="${cls}">${T.rotulo(g.X(t.x), g.Y(t.y) + 5, t.t, { color: t.color, peso: t.peso || 700, ancla: t.ancla || 'middle' })}</g>`;
    return s;
  }

  function dibujar(d, e = {}) {
    const g = geometria(d), corte = e.corte || 0;
    let s = '';
    if (d.cuadricula > 0) {
      let r = '';
      for (let x = 0; x <= d.ancho + 1e-9; x += d.cuadricula) r += T.linea(g.X(x), g.Y(0), g.X(x), g.Y(d.alto), { grosor: T.GROSOR.cuadricula, opacidad: 0.25 });
      for (let y = 0; y <= d.alto + 1e-9; y += d.cuadricula) r += T.linea(g.X(0), g.Y(y), g.X(d.ancho), g.Y(y), { grosor: T.GROSOR.cuadricula, opacidad: 0.25 });
      s += `<g class="kit-cuadricula">${r}</g>`;
    }
    if (d.norte) s += `<g class="kit-eje">${T.flecha(W - 16, 44, W - 16, 12, { grosor: T.GROSOR.contorno })}${T.rotulo(W - 28, 30, 'N', { peso: 700, ancla: 'end' })}</g>`;
    s += capa(g, d, corte, null);
    if (e.fantasma) s += capa(g, d, corte, e.fantasma);
    const pie = e.fantasma && e.fantasma.rotulo ? e.fantasma.rotulo : d.pie;
    if (pie) s += T.rotulo(W / 2, g.base + PAD / 2 + 18, pie, { ancla: 'middle', peso: 700, clase: e.fantasma && e.fantasma.rotulo ? 'kit-fantasma' : '' });
    return T.svg(W, g.alto, s, { alt: alt(d) });
  }

  function alt(d) {
    const partes = [];
    const nod = (d.nodos || []).filter(n => n.t || n.etiqueta).map(n => [n.etiqueta, n.t].filter(Boolean).join(' '));
    if (nod.length) partes.push(`puntos ${nod.join(', ')}`);
    const nom = id => { const n = (d.nodos || []).find(x => x.id === id); return n ? (n.etiqueta || n.t || id) : id; };
    if ((d.aristas || []).length) partes.push(`${d.aristas.length} uniones (${d.aristas.slice(0, 12).map(a => `${nom(a.de)}${a.flecha ? '→' : '–'}${nom(a.a)}${a.rotulo ? ' ' + a.rotulo : ''}`).join(', ')})`);
    if ((d.circulos || []).length) partes.push(`${d.circulos.length} círculos${d.circulos.some(c => c.rotulo) ? ` (${d.circulos.map(c => c.rotulo).filter(Boolean).join(', ')})` : ''}`);
    if ((d.poligonos || []).length) partes.push(`${d.poligonos.length} figuras${d.poligonos.some(c => c.rotulo) ? ` (${d.poligonos.map(c => c.rotulo).filter(Boolean).join(', ')})` : ''}`);
    if ((d.lineas || []).length) partes.push(`${d.lineas.length} trazos${d.lineas.some(c => c.rotulo) ? ` (${d.lineas.map(c => c.rotulo).filter(Boolean).join(', ')})` : ''}`);
    if ((d.textos || []).length) partes.push(`rótulos ${d.textos.map(t => t.t).join(', ')}`);
    return `Plano a escala con ${partes.join('; ') || 'nada dibujado'}${d.pie ? `. ${d.pie}` : ''}.`;
  }

  return { id: 'rm-plano', dibujar, alt, constantes: { W, PAD } };
});
