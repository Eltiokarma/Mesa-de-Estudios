/*
 * Pieza «fis-espacio-3d» (15 nov 2026, ronda 4, docs/3d.md): el espacio de física en 3D, que se gira con el dedo. Una
 * sola pieza viva para varias unidades (vectores, magnetismo, inducción, ondas electromagnéticas, tiro parabólico):
 * dibuja ejes, flechas, trazos, bolas y caras que le pasa la mesa. No calcula física (regla 1): cada número sale del
 * motor de la unidad (plantillas/<tema>/motor.js) y llega aquí ya convertido en puntos de la escena.
 *
 * Coordenadas de física, con z hacia arriba (x a la derecha, y hacia el fondo): la pieza las pasa a las de three.js
 * (x, z, −y), que también son de mano derecha, así que x̂ × ŷ = ẑ se ve igual en el dibujo.
 *
 * datos = {
 *   escena:  texto                          // nombre de la escena: si cambia, se vuelve a la vista de partida
 *   ejes:    { largo, nombres: ['x','y','z'] } | null   // ejes de tinta con su nombre en la punta
 *   flechas: [{ de, a, color, rotulo, grosor }]          // de y a: [x, y, z]; color: 'c-o'…'c-f' o 'tinta'
 *   trazos:  [{ puntos: [[x,y,z]…], color, punteado, cerrado }]
 *   bolas:   [{ en, r, color, rotulo }]
 *   caras:   [{ puntos, color, opacidad }]               // polígono plano (convexo) relleno, con su borde
 *   rotulos: [{ en, texto, color }]                      // rótulos sueltos (sin objeto)
 *   vista:   { giro, inclinacion }, alt
 *   escala:  número (1 por defecto): multiplica todas las posiciones, para que la escena quepa en el cuadro; los grosores
 *            de flechas y bolas no cambian, así siguen legibles
 * }
 *
 * Respaldo (dibujar): todo proyectado en el plano desde datos.vista, en SVG, con los rótulos del color de su
 * variable. Se usa mientras carga three.js, sin WebGL 2, en Node (pruebas) y en las miniaturas de la colección.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const Kit = nodo ? require('../kit.js') : root.Kit;
  if (nodo) require('../vivo3d.js');
  const api = fabrica(Kit);
  Kit.registrar(api);
  if (nodo) module.exports = api;
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const rad = g => g * Math.PI / 180;
  const VAR = { 'c-o': '#b85a06', 'c-i': '#08807a', 'c-h': '#c0364a', 'c-d': '#4f7a17', 'c-f': '#6b3dbd' };
  const vistaDe = d => d.vista || { giro: 30, inclinacion: 20 };
  const aTres = p => [p[0], p[2], -p[1]];                     // física (z arriba) → three.js (y arriba)
  const aEscena = (d, p) => { const k = d.escala || 1; return aTres([p[0] * k, p[1] * k, p[2] * k]); };
  // Misma rotación que la escena viva: giro alrededor del eje vertical y después inclinación (grupo.rotation XYZ).
  function girar(p, giro, inc) {
    const a = rad(giro || 0), b = rad(inc || 0);
    const x = p[0] * Math.cos(a) + p[2] * Math.sin(a), z = -p[0] * Math.sin(a) + p[2] * Math.cos(a);
    return [x, p[1] * Math.cos(b) - z * Math.sin(b), p[1] * Math.sin(b) + z * Math.cos(b)];
  }
  const lista = x => (Array.isArray(x) ? x : []);
  const ejesDe = d => {
    if (!d.ejes) return [];
    const L = d.ejes.largo || 2, n = d.ejes.nombres || ['x', 'y', 'z'];
    return [[[L, 0, 0], n[0]], [[0, L, 0], n[1]], [[0, 0, L], n[2]]].map(([a, t]) => ({ de: [0, 0, 0], a, texto: t }));
  };

  function alt(d) { return d.alt || 'Figura en el espacio: se gira con el dedo.'; }

  // ---------- Respaldo plano ----------
  function plano(d) {
    const v = vistaDe(d), W = 320, H = 260, E = d.escalaPlano || 52;
    const p2 = p => { const q = girar(aEscena(d, p), v.giro, v.inclinacion); return [W / 2 + q[0] * E, H / 2 - q[1] * E + (d.bajarPlano || 0)]; };
    return {
      W, H,
      ejes: ejesDe(d).map(e => ({ de: p2(e.de), a: p2(e.a), texto: e.texto })),
      caras: lista(d.caras).map(c => ({ puntos: c.puntos.map(p2), color: c.color, opacidad: c.opacidad })),
      trazos: lista(d.trazos).map(t => ({ puntos: t.puntos.map(p2), color: t.color, punteado: !!t.punteado, cerrado: !!t.cerrado })),
      flechas: lista(d.flechas).filter(f => Math.hypot(f.a[0] - f.de[0], f.a[1] - f.de[1], f.a[2] - f.de[2]) > 1e-9)
        .map(f => ({ de: p2(f.de), a: p2(f.a), color: f.color, rotulo: f.rotulo, grosor: f.grosor || 1 })),
      bolas: lista(d.bolas).map(b => ({ en: p2(b.en), r: (b.r || 0.12) * E, color: b.color, rotulo: b.rotulo })),
      rotulos: lista(d.rotulos).map(r => ({ en: p2(r.en), texto: r.texto, color: r.color })),
    };
  }
  const n = x => Math.round(x * 10) / 10;
  const col = c => (c && VAR[c] ? `var(--${c}, ${VAR[c]})` : 'currentColor');
  const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  function punta(a, b, ancho) {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, s = Math.min(10, L * 0.4) * ancho;
    return `${n(b[0])},${n(b[1])} ${n(b[0] - ux * s - uy * s * 0.5)},${n(b[1] - uy * s + ux * s * 0.5)} ${n(b[0] - ux * s + uy * s * 0.5)},${n(b[1] - uy * s - ux * s * 0.5)}`;
  }
  const texto = (p, t, c, dx = 6, dy = -6) => `<text x="${n(p[0] + dx)}" y="${n(p[1] + dy)}" fill="${col(c)}" font-size="14" font-weight="700">${esc(t)}</text>`;
  function dibujar(d) {
    const pl = plano(d), partes = [];
    for (const e of pl.ejes) partes.push(`<line x1="${n(e.de[0])}" y1="${n(e.de[1])}" x2="${n(e.a[0])}" y2="${n(e.a[1])}" stroke="currentColor" stroke-opacity="0.55" stroke-width="1"/>`, texto(e.a, e.texto, null, 4, -2));
    for (const c of pl.caras) partes.push(`<polygon class="kit-cara" points="${c.puntos.map(p => `${n(p[0])},${n(p[1])}`).join(' ')}" fill="${col(c.color)}" fill-opacity="${c.opacidad === undefined ? 0.3 : c.opacidad}" stroke="${col(c.color)}" stroke-width="1.5"/>`);
    for (const t of pl.trazos) {
      const pts = t.puntos.map(p => `${n(p[0])},${n(p[1])}`).join(' ');
      partes.push(`<${t.cerrado ? 'polygon' : 'polyline'} class="kit-trazo" points="${pts}" fill="none" stroke="${col(t.color)}" stroke-width="2"${t.punteado ? ' stroke-dasharray="5 4"' : ''} stroke-linejoin="round"/>`);
    }
    for (const f of pl.flechas) {
      partes.push(`<g class="kit-flecha"><line x1="${n(f.de[0])}" y1="${n(f.de[1])}" x2="${n(f.a[0])}" y2="${n(f.a[1])}" stroke="${col(f.color)}" stroke-width="${n(2 + f.grosor)}" stroke-linecap="round"/><polygon points="${punta(f.de, f.a, f.grosor >= 1 ? 1 : 0.7)}" fill="${col(f.color)}"/></g>`);
      if (f.rotulo) partes.push(texto(f.a, f.rotulo, f.color));
    }
    for (const b of pl.bolas) {
      partes.push(`<circle class="kit-bola" cx="${n(b.en[0])}" cy="${n(b.en[1])}" r="${n(Math.max(3, b.r))}" fill="${col(b.color)}"/>`);
      if (b.rotulo) partes.push(texto(b.en, b.rotulo, b.color, 8, -8));
    }
    for (const r of pl.rotulos) partes.push(texto(r.en, r.texto, r.color, 0, 0));
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${pl.W} ${pl.H}" width="${pl.W}" height="${pl.H}" role="img" aria-label="${esc(alt(d)).replace(/"/g, '&quot;')} Vista plana." class="kit-svg" font-family="inherit">${partes.join('')}</svg>`;
  }

  // Cuántas mallas arma la escena viva (presupuesto de docs/3d.md: 60 como máximo). Lo usa la prueba.
  function mallas(d) {
    return lista(d.flechas).filter(f => Math.hypot(f.a[0] - f.de[0], f.a[1] - f.de[1], f.a[2] - f.de[2]) > 1e-9).length * 2
      + lista(d.bolas).length + lista(d.caras).length;
  }

  // ---------- En vivo: la escena sobre la base común (nucleo/kit/vivo3d.js) ----------
  const SPEC = {
    plano: d => dibujar(d),
    vista: d => vistaDe(d),
    clave: d => JSON.stringify([d.escena || '', d.vista || null]),
    distancia: 8, distMin: 4, distMax: 14,
    construir(T, grupo, d, e, h) {
      const tinta = h.varCss('--ink', '#2d2340');
      const color = c => (c && VAR[c] ? h.varCss(`--${c}`, VAR[c]) : tinta);
      const V = p => new T.Vector3(...aEscena(d, p));
      const linea = (pts, c, punteado, cerrado) => {
        const g = new T.BufferGeometry().setFromPoints(pts.concat(cerrado ? [pts[0]] : []));
        const m = punteado ? new T.LineDashedMaterial({ color: new T.Color(c), dashSize: 0.14, gapSize: 0.1 }) : new T.LineBasicMaterial({ color: new T.Color(c) });
        const l = new T.Line(g, m); if (punteado) l.computeLineDistances(); return l;
      };
      const etq = (p, t, c) => h.etiqueta(p, t, c && VAR[c] ? { color: c } : {});
      for (const x of ejesDe(d)) {
        const a = V(x.a);
        grupo.add(linea([V(x.de), a], tinta, false, false));
        etq(a.clone().multiplyScalar(1.08), x.texto, null);
      }
      for (const c of lista(d.caras)) {
        const pts = c.puntos.map(V), cen = pts.reduce((s, p) => s.add(p), new T.Vector3()).multiplyScalar(1 / pts.length), pos = [];
        for (let k = 0; k < pts.length; k++) { const p = pts[k], q = pts[(k + 1) % pts.length]; pos.push(cen.x, cen.y, cen.z, p.x, p.y, p.z, q.x, q.y, q.z); }
        const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); geo.computeVertexNormals();
        grupo.add(new T.Mesh(geo, h.material(color(c.color), { side: T.DoubleSide, transparent: true, opacity: c.opacidad === undefined ? 0.3 : c.opacidad, depthWrite: false })));
        grupo.add(linea(pts, color(c.color), false, true));
      }
      for (const t of lista(d.trazos)) grupo.add(linea(t.puntos.map(V), color(t.color), t.punteado, t.cerrado));
      for (const f of lista(d.flechas)) {
        const de = V(f.de), a = V(f.a);
        if (de.distanceTo(a) < 1e-9) continue;
        grupo.add(h.flecha(de, a, 0.035 * (f.grosor || 1), color(f.color)));
        if (f.rotulo) etq(a.clone().add(a.clone().sub(de).normalize().multiplyScalar(0.25)), f.rotulo, f.color);
      }
      for (const b of lista(d.bolas)) {
        const m = new T.Mesh(new T.SphereGeometry(b.r || 0.12, h.SEG, Math.max(8, h.SEG / 2)), h.material(color(b.color)));
        m.position.copy(V(b.en)); grupo.add(m);
        if (b.rotulo) etq(V(b.en).add(new T.Vector3(0, (b.r || 0.12) + 0.22, 0)), b.rotulo, b.color);
      }
      for (const r of lista(d.rotulos)) etq(V(r.en), r.texto, r.color);
      return { aria: alt(d) };
    },
  };
  const montar = (el, op) => Kit.vivo3d.montar(el, SPEC, op);

  return { id: 'fis-espacio-3d', dibujar, alt, montar, plano, girar, aTres, mallas };
});
