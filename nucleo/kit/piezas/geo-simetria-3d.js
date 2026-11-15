/*
 * Pieza «geo-simetria-3d» (ronda 4, 15 nov 2026): un sólido, un plano que pasa por su centro y el reflejo del sólido en
 * ese plano. Si el reflejo coincide con el sólido, el plano es de simetría. Se gira con el dedo (nucleo/kit/vivo3d.js).
 *
 * Afirmación de la figura: un plano es de simetría cuando el reflejo cae justo sobre el sólido; el reflejo, la prueba y
 * la lista de planos los calcula nucleo/solidos3d.js (reflejar, esPlanoSimetria, planosSimetria), no la pieza (regla 1).
 *
 * datos = {
 *   solido: id de Solidos3D.poliedro ('cubo', 'ortoedro', 'prisma-6', 'piramide-4', 'tetraedro'…),
 *   normal: [x, y, z],           // normal del plano que se prueba (por el centro del sólido)
 *   todos: true|false,           // en vez del plano y el reflejo, todos los planos de simetría a la vez
 *   vista: { giro, inclinacion } // opcional
 * }
 * Colores: el sólido turquesa (c-i), su reflejo naranja (c-o), el plano verde (c-d).
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
  const vistaDe = d => d.vista || { giro: 28, inclinacion: 18 };
  const { cruz, unit, largo, por, suma } = S.util;

  // Todo lo que se dibuja, en coordenadas del sólido: lo comparten el respaldo plano y la escena 3D.
  function figura(d) {
    const P = S.poliedro(d.solido), A = S.aristas(P), R = Math.max(...P.vertices.map(largo));
    const cuadro = n => {
      const u = unit(Math.abs(n[1]) > 0.9 ? cruz(n, [1, 0, 0]) : cruz(n, [0, 1, 0])), w = cruz(unit(n), u), L = 1.25 * R;
      return [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([a, b]) => suma(por(u, a * L), por(w, b * L)));
    };
    const planos = d.todos ? S.planosSimetria(P) : [];
    const sim = !d.todos && S.esPlanoSimetria(P, d.normal);
    const reflejo = d.todos ? [] : P.vertices.map(p => S.reflejar(p, d.normal));
    return { P, A, R, sim, planos, reflejo, cuadros: d.todos ? planos.map(cuadro) : [cuadro(d.normal)] };
  }

  function alt(d) {
    const g = figura(d), nom = g.P.nombre;
    if (d.todos) return `El ${nom} con sus ${g.planos.length} planos de simetría a la vista, todos por su centro.`;
    return g.sim ? `El ${nom} y su reflejo en el plano verde: el reflejo cae justo sobre el sólido, así que es un plano de simetría.`
      : `El ${nom} y su reflejo en el plano verde: el reflejo queda corrido, así que no es un plano de simetría.`;
  }

  // ---------- Respaldo plano ----------
  function plano(d) {
    const v = vistaDe(d), g = figura(d), E = 150 / (2.6 * g.R), W = 320, H = 260;
    const p2 = p => { const q = S.proyectar(p, v); return [W / 2 + q[0] * E, H / 2 - q[1] * E]; };
    return {
      W, H, sim: g.sim,
      aristas: g.A.map(([a, b]) => [p2(g.P.vertices[a]), p2(g.P.vertices[b])]),
      reflejo: g.A.map(([a, b]) => (g.reflejo.length ? [p2(g.reflejo[a]), p2(g.reflejo[b])] : null)).filter(Boolean),
      cuadros: g.cuadros.map(c => c.map(p2)),
    };
  }
  function dibujar(d) {
    const pl = plano(d), n = x => Math.round(x * 100) / 100, pts = c => c.map(p => `${n(p[0])},${n(p[1])}`).join(' ');
    const linea = ([a, b], extra) => `<line x1="${n(a[0])}" y1="${n(a[1])}" x2="${n(b[0])}" y2="${n(b[1])}" ${extra}/>`;
    const cuadros = pl.cuadros.map(c => `<polygon points="${pts(c)}" fill="var(--c-d, #2f8f4e)" fill-opacity="${pl.cuadros.length > 1 ? 0.1 : 0.16}" stroke="var(--c-d, #2f8f4e)" stroke-width="1.6"/>`).join('');
    const solido = pl.aristas.map(a => linea(a, 'stroke="var(--c-i, #0f8a8a)" stroke-width="2.4" stroke-linecap="round"')).join('');
    const reflejo = pl.reflejo.map(a => linea(a, 'stroke="var(--c-o, #b85a06)" stroke-width="2" stroke-dasharray="6 4" stroke-linecap="round"')).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${pl.W} ${pl.H}" width="${pl.W}" height="${pl.H}" role="img" aria-label="${alt(d).replace(/"/g, '&quot;')} Vista plana." class="kit-svg" font-family="inherit"><g class="kit-planos">${cuadros}</g><g class="kit-solido">${solido}</g><g class="kit-reflejo">${reflejo}</g></svg>`;
  }

  // ---------- En vivo ----------
  const SPEC = {
    plano: d => dibujar(d),
    vista: d => vistaDe(d),
    clave: d => JSON.stringify([d.solido, d.vista || null]),
    distancia: 9, distMin: 5, distMax: 15,
    construir(T, grupo, d, e, h) {
      const g = figura(d), tinta = h.varCss('--ink', '#2d2340');
      const turq = h.varCss('--c-i', '#0f8a8a'), nar = h.varCss('--c-o', '#b85a06'), verde = h.varCss('--c-d', '#2f8f4e');
      const V = g.P.vertices, tri = [];
      for (const f of g.P.caras) for (let k = 1; k + 1 < f.length; k++) tri.push(...V[f[0]], ...V[f[k]], ...V[f[k + 1]]);
      const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(tri, 3)); geo.computeVertexNormals();
      grupo.add(new T.Mesh(geo, h.material(turq, { transparent: true, opacity: 0.32, depthWrite: false, side: T.DoubleSide })));
      const lineas = (pts, mat) => { const gl = new T.BufferGeometry(); gl.setAttribute('position', new T.Float32BufferAttribute(pts, 3)); const l = new T.LineSegments(gl, mat); return l; };
      grupo.add(lineas(g.A.flatMap(([a, b]) => [...V[a], ...V[b]]), new T.LineBasicMaterial({ color: new T.Color(tinta) })));
      // Los planos: cuadrados tenues con borde (uno, o todos los de simetría).
      for (const c of g.cuadros) {
        const pos = [...c[0], ...c[1], ...c[2], ...c[0], ...c[2], ...c[3]];
        const gp = new T.BufferGeometry(); gp.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
        grupo.add(new T.Mesh(gp, new T.MeshBasicMaterial({ color: new T.Color(verde), transparent: true, opacity: g.cuadros.length > 1 ? 0.1 : 0.16, side: T.DoubleSide, depthWrite: false })));
        grupo.add(lineas([0, 1, 1, 2, 2, 3, 3, 0].flatMap(k => c[k]), new T.LineBasicMaterial({ color: new T.Color(verde) })));
      }
      if (!d.todos) {
        // El reflejo, en naranja discontinuo y siempre encima: si coincide, tapa las aristas del sólido.
        const r = lineas(g.A.flatMap(([a, b]) => [...g.reflejo[a], ...g.reflejo[b]]), new T.LineDashedMaterial({ color: new T.Color(nar), dashSize: 0.16, gapSize: 0.1, depthTest: false }));
        r.computeLineDistances(); r.renderOrder = 2; grupo.add(r);
        h.etiqueta(new T.Vector3(...g.cuadros[0][0]).multiplyScalar(0.7), 'plano', { color: 'c-d' });   // dentro del cuadro: no se corta a 360 px
        // El rótulo del reflejo va en su vértice más alejado del sólido (si coincide, en el de más arriba).
        const lejos = g.reflejo.map(p => Math.min(...V.map(q => largo([p[0] - q[0], p[1] - q[1], p[2] - q[2]]))));
        const k = g.sim ? g.reflejo.reduce((m, p, i) => (p[1] > g.reflejo[m][1] ? i : m), 0) : lejos.indexOf(Math.max(...lejos));
        h.etiqueta(new T.Vector3(...g.reflejo[k]).multiplyScalar(1.12), g.sim ? 'reflejo = sólido' : 'reflejo', { color: 'c-o' });
      } else h.etiqueta(new T.Vector3(0, g.R * 1.25, 0), `${g.planos.length} planos`, { color: 'c-d' });
      return { aria: alt(d) };
    },
  };
  const montar = (el, op) => Kit.vivo3d.montar(el, SPEC, op);

  return { id: 'geo-simetria-3d', dibujar, alt, montar, plano, figura };
});
