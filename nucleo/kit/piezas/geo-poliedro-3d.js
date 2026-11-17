/*
 * Pieza «geo-poliedro-3d» (ronda 4, 15 nov 2026): el desarrollo plano de un poliedro que se pliega hasta cerrar el
 * sólido. El pliegue es un control t (0: plano, 1: armado), nunca una animación continua (docs/3d.md, regla 4).
 * Se gira con el dedo sobre la base común (nucleo/kit/vivo3d.js).
 *
 * Afirmación de la figura: las mismas caras, sin estirarse, cierran el sólido; al cerrar, las aristas y los vértices
 * sueltos del desarrollo se juntan de a dos o más. Las posiciones las calcula nucleo/solidos3d.js (apoyar, desarrollo)
 * y el conteo C, V, A también (conteo), no la pieza (regla 1).
 *
 * datos = { solido: id de Solidos3D.poliedro, t: 0 a 1, vista? }
 * Colores (los de la unidad): vértices naranja (c-o), aristas turquesa (c-i), caras verde (c-d).
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
  const { resta, largo, por, suma, centro } = S.util;
  const vistaDe = d => d.vista || { giro: 25, inclinacion: 38 };

  // Las caras en su posición para este t, centradas y a una escala que cabe en el cuadro (lo que se ve, no un dato).
  function figura(d) {
    const P = S.apoyar(S.poliedro(d.solido)), des = S.desarrollo(P, d.t), todos = des.caras.flat();
    const lo = [0, 1, 2].map(k => Math.min(...todos.map(p => p[k]))), hi = [0, 1, 2].map(k => Math.max(...todos.map(p => p[k])));
    const c = lo.map((x, k) => (x + hi[k]) / 2), R = Math.max(...todos.map(p => largo(resta(p, c))));
    const k = Math.min(1, 2.3 / R), caras = des.caras.map(f => f.map(p => por(resta(p, c), k)));
    const vertices = [];
    for (const p of caras.flat()) if (!vertices.some(q => largo(resta(p, q)) < 1e-6)) vertices.push(p);
    return { P, caras, vertices, conteo: S.conteo(P), escala: k };
  }

  function alt(d) {
    const g = figura(d), { C, V, A } = g.conteo, pct = Math.round(d.t * 100);
    const estado = pct >= 100 ? 'armado' : pct <= 0 ? 'abierto en su desarrollo plano' : `plegado al ${pct} %`;
    return `${g.P.nombre[0].toUpperCase()}${g.P.nombre.slice(1)} ${estado}: ${C} caras, ${V} vértices y ${A} aristas. ${C} + ${V} = ${A} + 2.`;
  }

  // ---------- Respaldo plano: caras de atrás hacia adelante ----------
  function plano(d) {
    const v = vistaDe(d), g = figura(d), E = 52, W = 320, H = 260;
    const p3 = p => S.proyectar(p, v), p2 = q => [W / 2 + q[0] * E, H / 2 - q[1] * E];
    const caras = g.caras.map(f => { const q = f.map(p3); return { pts: q.map(p2), z: centro(q)[2] }; }).sort((a, b) => a.z - b.z);
    return { W, H, caras: caras.map(c => c.pts), vertices: g.vertices.map(p => p2(p3(p))) };
  }
  function dibujar(d) {
    const pl = plano(d), n = x => Math.round(x * 100) / 100, pts = c => c.map(p => `${n(p[0])},${n(p[1])}`).join(' ');
    const caras = pl.caras.map(c => `<polygon points="${pts(c)}" fill="var(--c-d, #2f8f4e)" fill-opacity="0.35" stroke="var(--c-i, #0f8a8a)" stroke-width="2" stroke-linejoin="round"/>`).join('');
    const vert = pl.vertices.map(p => `<circle cx="${n(p[0])}" cy="${n(p[1])}" r="3.2" fill="var(--c-o, #a95300)"/>`).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${pl.W} ${pl.H}" width="${pl.W}" height="${pl.H}" role="img" aria-label="${alt(d).replace(/"/g, '&quot;')} Vista plana." class="kit-svg" font-family="inherit">${caras}${vert}</svg>`;
  }

  // ---------- En vivo ----------
  const SPEC = {
    plano: d => dibujar(d),
    vista: d => vistaDe(d),
    clave: d => JSON.stringify([d.solido, d.vista || null]),
    distancia: 8, distMin: 4, distMax: 14,
    construir(T, grupo, d, e, h) {
      const g = figura(d), verde = h.varCss('--c-d', '#2f8f4e'), turq = h.varCss('--c-i', '#0f8a8a'), nar = h.varCss('--c-o', '#a95300');
      const tri = [], lin = [];
      for (const f of g.caras) {
        for (let k = 1; k + 1 < f.length; k++) tri.push(...f[0], ...f[k], ...f[k + 1]);
        for (let k = 0; k < f.length; k++) lin.push(...f[k], ...f[(k + 1) % f.length]);
      }
      const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(tri, 3)); geo.computeVertexNormals();
      grupo.add(new T.Mesh(geo, h.material(verde, { side: T.DoubleSide, transparent: true, opacity: 0.6, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 })));
      const gl = new T.BufferGeometry(); gl.setAttribute('position', new T.Float32BufferAttribute(lin, 3));
      grupo.add(new T.LineSegments(gl, new T.LineBasicMaterial({ color: new T.Color(turq) })));
      // Vértices: una sola malla repetida (InstancedMesh), para no gastar una malla por punto.
      const bola = new T.InstancedMesh(new T.SphereGeometry(0.07, h.SEG / 2, h.SEG / 4), h.material(nar), g.vertices.length), m = new T.Matrix4();
      g.vertices.forEach((p, k) => { m.makeTranslation(p[0], p[1], p[2]); bola.setMatrixAt(k, m); });
      grupo.add(bola);
      return { aria: alt(d) };
    },
  };
  const montar = (el, op) => Kit.vivo3d.montar(el, SPEC, op);

  return { id: 'geo-poliedro-3d', dibujar, alt, montar, plano, figura };
});
