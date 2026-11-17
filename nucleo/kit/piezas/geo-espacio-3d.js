/*
 * Pieza «geo-espacio-3d» (ronda 4, 15 nov 2026): rectas y planos que se giran con el dedo (nucleo/kit/vivo3d.js).
 *   modo 'varilla': una varilla AB apoyada en el piso, su sombra AH (proyección ortogonal), la perpendicular BH y el
 *                   ángulo con el plano, que se mide entre la varilla y su sombra.
 *   modo 'diedro':  dos semiplanos con una arista común que se abren φ; P en una cara, su pie H en el plano de la otra.
 *                   Con φ obtuso, H cae fuera de la cara del piso, en su prolongación.
 *
 * Afirmación de la figura: el ángulo que se pide se mide en un triángulo del espacio (varilla, sombra, perpendicular),
 * no en el dibujo. Las posiciones las calcula nucleo/solidos3d.js (varilla, diedro), no la pieza (regla 1).
 *
 * datos = { modo: 'varilla', a, L, vista? }  ·  { modo: 'diedro', phi, p, vista? }
 * Colores (los de la unidad): lo dado naranja (c-o), lo perpendicular turquesa (c-i), la proyección o la otra cara
 * verde (c-d), el ángulo pedido rojo (c-h).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const Kit = nodo ? require('../kit.js') : root.Kit;
  if (nodo) require('../vivo3d.js');
  const S = nodo ? require('../../solidos3d.js') : root.Solidos3D;
  const api = fabrica(Kit, S);
  Kit.registrar(api);
  if (nodo) module.exports = api;
})(typeof self !== 'undefined' ? self : this, function (Kit, S) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const rad = g => g * Math.PI / 180;
  const GIRO = 30;                                     // la varilla apunta a 30° del frente: la sombra no se esconde
  const vistaDe = d => d.vista || { giro: d.modo === 'diedro' ? 35 : 45, inclinacion: 20 };   // la varilla, casi de costado
  const { suma, por, unit, resta } = S.util;
  // Arco de radio r con centro en O, de la dirección u a la dirección w (unitarias), en n tramos.
  const arco = (O, u, w, r, n = 16) => {
    const ang = Math.acos(Math.max(-1, Math.min(1, u[0] * w[0] + u[1] * w[1] + u[2] * w[2])));
    const perp = unit(resta(w, por(u, Math.cos(ang))));
    return Array.from({ length: n + 1 }, (_, k) => { const t = ang * k / n; return suma(O, suma(por(u, r * Math.cos(t)), por(perp, r * Math.sin(t)))); });
  };

  // Todo lo que se dibuja, en el espacio: caras, segmentos, puntos, arcos y rótulos. Lo usan el SVG y el 3D.
  function figura(d) {
    if (d.modo === 'diedro') {
      const g = S.diedro(d.phi, d.p), u = g.u, L = 2.6, X = 1.8;
      const piso = [[-X, 0, 0], [X, 0, 0], [X, 0, L], [-X, 0, L]], otra = [[-X, 0, 0], [X, 0, 0], suma([X, 0, 0], por(u, L)), suma([-X, 0, 0], por(u, L))];
      const r = Math.min(0.7, 0.45 * d.p);
      return {
        g, centro: [0, 0.9, 0.6],
        caras: [{ pts: piso, color: 'c-i', op: 0.16 }, { pts: otra, color: 'c-d', op: 0.2 },
          ...(g.dentro ? [] : [{ pts: [[-X, 0, 0], [X, 0, 0], [X, 0, -L], [-X, 0, -L]], color: 'c-i', op: 0.06, disc: true }])],
        segs: [{ de: [-X, 0, 0], a: [X, 0, 0], color: 'tinta', grosor: 2 },
          { de: [0, 0, 0], a: [0, 0, Math.max(d.p, 1.2)], color: 'c-i', grosor: 1 }, { de: [0, 0, 0], a: g.P, color: 'c-o', grosor: 2 },
          { de: g.P, a: g.H, color: 'c-i', grosor: 1, disc: true }, ...(g.dentro ? [] : [{ de: [0, 0, 0], a: g.H, color: 'c-i', grosor: 1, disc: true }])],
        puntos: [{ p: g.P, color: 'c-o' }, { p: g.H, color: 'c-i' }],
        recto: [{ en: g.H, a: [0, 1, 0], b: [0, 0, g.dentro ? -1 : 1] }],
        arcos: [{ pts: arco([0, 0, 0], [0, 0, 1], u, r), color: 'c-h' }],
        rotulos: [{ p: suma(g.P, [0, 0.25, 0]), texto: 'P', color: 'c-o', letra: true }, { p: suma(g.H, [0.3, 0, 0]), texto: 'H', color: 'c-i', letra: true },
          { p: suma([0, 0, 0], por(unit(suma([0, 0, 1], u)), r + 0.35)), texto: 'φ', color: 'c-h', letra: true },
          { p: [X + 0.2, 0, 0], texto: 'arista', color: '' }],
      };
    }
    const g = S.varilla(d.a, d.L, GIRO), dirH = g.sombra > 1e-9 ? unit(g.H) : [Math.sin(rad(GIRO)), 0, Math.cos(rad(GIRO))];
    const r = Math.min(0.6, 0.4 * d.L), Lp = 3.4, vert = [0, 1, 0];
    return {
      g, centro: suma(por(dirH, 0.75), [0, 0.8, 0]),
      caras: [{ pts: [[-Lp / 2, 0, -Lp / 2], [Lp / 2, 0, -Lp / 2], [Lp / 2, 0, Lp / 2], [-Lp / 2, 0, Lp / 2]].map(p => suma(p, por(dirH, 0.9))), color: 'piso', op: 0.5 }],
      segs: [{ de: g.A, a: g.B, color: 'c-o', grosor: 2 }, ...(g.sombra > 1e-9 ? [{ de: g.A, a: g.H, color: 'c-d', grosor: 2 }] : []),
        ...(g.altura > 1e-9 && g.sombra > 1e-9 ? [{ de: g.B, a: g.H, color: 'c-i', grosor: 1, disc: true }] : [])],
      puntos: [{ p: g.A, color: 'tinta' }, { p: g.B, color: 'c-o' }, ...(g.sombra > 1e-9 ? [{ p: g.H, color: 'c-d' }] : [])],
      recto: g.sombra > 1e-9 && g.altura > 1e-9 ? [{ en: g.H, a: vert, b: por(dirH, -1) }] : [],
      arcos: d.a > 0 && d.a < 90 ? [{ pts: arco(g.A, dirH, unit(g.B), r), color: 'c-h' }] : [],
      rotulos: [{ p: [0, -0.3, 0], texto: 'A', color: '', letra: true }, { p: suma(g.B, [0, 0.3, 0]), texto: 'B', color: 'c-o', letra: true },
        ...(g.sombra > 1e-9 ? [{ p: suma(g.H, por(dirH, 0.3)), texto: 'H', color: 'c-d', letra: true }] : []),
        ...(d.a > 0 && d.a < 90 ? [{ p: por(unit(suma(dirH, unit(g.B))), r + 0.3), texto: 'α', color: 'c-h', letra: true }] : [])],
    };
  }

  function alt(d) {
    const g = figura(d).g;
    if (d.modo === 'diedro') {
      return `Diedro de ${f(d.phi, 0)}°: P está a ${f(d.p)} de la arista y a ${f(g.PH)} del plano del piso. `
        + (g.dentro ? 'Su pie H cae sobre la cara del piso.' : 'Su pie H cae fuera de la cara, en la prolongación del piso.');
    }
    return d.a >= 90 ? `Varilla de ${f(d.L)} parada a 90° del piso: su sombra es solo un punto, su pie.`
      : `Varilla de ${f(d.L)} a ${f(d.a, 0)}° del piso: su sombra AH mide ${f(g.sombra)} y su altura BH, ${f(g.altura)}.`;
  }

  // ---------- Respaldo plano ----------
  const COLOR = { 'c-o': 'var(--c-o, #a95300)', 'c-i': 'var(--c-i, #0f8a8a)', 'c-d': 'var(--c-d, #2f8f4e)', 'c-h': 'var(--c-h, #c0392b)', tinta: 'currentColor', piso: 'var(--sub, #8a7f99)', '': 'currentColor' };
  function plano(d) {
    const v = vistaDe(d), F = figura(d), E = 58, W = 320, H = 250;
    const p2 = p => { const q = S.proyectar(resta(p, F.centro), v); return [W / 2 + q[0] * E, H / 2 - q[1] * E]; };
    return {
      W, H,
      caras: F.caras.map(c => ({ pts: c.pts.map(p2), color: c.color, op: c.op, disc: c.disc })),
      segs: F.segs.map(s => ({ de: p2(s.de), a: p2(s.a), color: s.color, grosor: s.grosor, disc: s.disc })),
      puntos: F.puntos.map(p => ({ p: p2(p.p), color: p.color })),
      arcos: F.arcos.map(a => ({ pts: a.pts.map(p2), color: a.color })),
      rotulos: F.rotulos.map(r => ({ p: p2(r.p), texto: r.texto, color: r.color, letra: r.letra })),
    };
  }
  function dibujar(d) {
    const pl = plano(d), n = x => Math.round(x * 100) / 100, pts = c => c.map(p => `${n(p[0])},${n(p[1])}`).join(' ');
    const caras = pl.caras.map(c => `<polygon points="${pts(c.pts)}" fill="${COLOR[c.color]}" fill-opacity="${c.op}" stroke="${COLOR[c.color]}" stroke-width="1"${c.disc ? ' stroke-dasharray="5 4"' : ''}/>`).join('');
    const segs = pl.segs.map(s => `<line x1="${n(s.de[0])}" y1="${n(s.de[1])}" x2="${n(s.a[0])}" y2="${n(s.a[1])}" stroke="${COLOR[s.color]}" stroke-width="${s.grosor === 2 ? 3 : 2}" stroke-linecap="round"${s.disc ? ' stroke-dasharray="6 4"' : ''}/>`).join('');
    const arcos = pl.arcos.map(a => `<polyline points="${pts(a.pts)}" fill="none" stroke="${COLOR[a.color]}" stroke-width="2.4"/>`).join('');
    const puntos = pl.puntos.map(p => `<circle cx="${n(p.p[0])}" cy="${n(p.p[1])}" r="4" fill="${COLOR[p.color]}"/>`).join('');
    const rot = pl.rotulos.map(r => `<text x="${n(r.p[0])}" y="${n(r.p[1])}" fill="${COLOR[r.color]}" font-size="16" text-anchor="middle" dominant-baseline="middle"${r.letra ? ' font-style="italic"' : ''}>${r.texto}</text>`).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${pl.W} ${pl.H}" width="${pl.W}" height="${pl.H}" role="img" aria-label="${alt(d).replace(/"/g, '&quot;')} Vista plana." class="kit-svg" font-family="inherit">${caras}${segs}${arcos}${puntos}${rot}</svg>`;
  }

  // ---------- En vivo ----------
  const SPEC = {
    plano: d => dibujar(d),
    vista: d => vistaDe(d),
    clave: d => JSON.stringify([d.modo, d.vista || null]),
    distancia: 7.5, distMin: 4, distMax: 14,
    construir(T, grupo, d, e, h) {
      const F = figura(d), c0 = new T.Vector3(...F.centro).negate();
      const g = new T.Group(); g.position.copy(c0); grupo.add(g);
      const col = k => (k === 'tinta' || !k ? h.varCss('--ink', '#2d2340') : k === 'piso' ? (h.oscuro() ? '#3a2f48' : '#e8e1d8') : h.varCss(`--${k}`, '#555'));
      const V = p => new T.Vector3(...p);
      for (const c of F.caras) {
        const pos = []; for (let k = 1; k + 1 < c.pts.length; k++) pos.push(...c.pts[0], ...c.pts[k], ...c.pts[k + 1]);
        const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
        g.add(new T.Mesh(geo, new T.MeshBasicMaterial({ color: new T.Color(col(c.color)), transparent: true, opacity: c.op, side: T.DoubleSide, depthWrite: false })));
        const borde = new T.BufferGeometry(); borde.setAttribute('position', new T.Float32BufferAttribute(c.pts.concat([c.pts[0]]).flat(), 3));
        const lb = new T.Line(borde, c.disc ? new T.LineDashedMaterial({ color: new T.Color(col(c.color)), dashSize: 0.14, gapSize: 0.1 }) : new T.LineBasicMaterial({ color: new T.Color(col(c.color)) }));
        if (c.disc) lb.computeLineDistances();
        g.add(lb);
      }
      for (const s of F.segs) {
        if (s.disc) {
          const gl = new T.BufferGeometry(); gl.setAttribute('position', new T.Float32BufferAttribute([...s.de, ...s.a], 3));
          const l = new T.Line(gl, new T.LineDashedMaterial({ color: new T.Color(col(s.color)), dashSize: 0.12, gapSize: 0.08 })); l.computeLineDistances(); g.add(l);
        } else g.add(h.barra(V(s.de), V(s.a), s.grosor === 2 ? 0.05 : 0.03, col(s.color)));
      }
      for (const p of F.puntos) { const m = new T.Mesh(new T.SphereGeometry(0.08, h.SEG / 2, h.SEG / 4), h.material(col(p.color))); m.position.copy(V(p.p)); g.add(m); }
      for (const a of F.arcos) g.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(a.pts.map(V)), 24, 0.025, 6), h.material(col(a.color))));
      // Ángulo recto: un cuadradito en su propio plano (en el dibujo plano se vería como rombo).
      for (const r of F.recto) {
        const q = 0.22, A = V(r.en), u = V(r.a).multiplyScalar(q), w = V(r.b).multiplyScalar(q);
        const pts = [A.clone().add(u), A.clone().add(u).add(w), A.clone().add(w)];
        const gl = new T.BufferGeometry().setFromPoints(pts); g.add(new T.Line(gl, new T.LineBasicMaterial({ color: new T.Color(col('tinta')) })));
      }
      for (const r of F.rotulos) h.etiqueta(V(r.p).add(c0), r.texto, { color: r.color || undefined, letra: r.letra });
      return { aria: alt(d) };
    },
  };
  const montar = (el, op) => Kit.vivo3d.montar(el, SPEC, op);

  return { id: 'geo-espacio-3d', dibujar, alt, montar, plano, figura };
});
