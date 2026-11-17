/*
 * Pieza «geo-piramides-3d» (ronda 4, 15 nov 2026): una caja llena con tres pirámides de cúspide común, que se separan
 * con un control (no con una animación continua, docs/3d.md). Se gira con el dedo sobre nucleo/kit/vivo3d.js.
 *
 * Afirmación de la figura: tres pirámides con la base y la altura del prisma lo llenan justo; por eso cada una es un
 * tercio, aunque en una caja que no es cubo tengan formas distintas. Vértices, caras y volúmenes los calcula
 * nucleo/solidos3d.js (tresPiramides, volumen), no la pieza (regla 1).
 *
 * datos = { caja: { a, b, c }, separar: 0 a 1, ver: 'todas' | 0 | 1 | 2, vista? }
 * Colores: cada pirámide el suyo, naranja (c-o), turquesa (c-i) y verde (c-d); la cúspide común en rojo (c-h).
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
  const COLORES = [['c-o', '#a95300'], ['c-i', '#0f8a8a'], ['c-d', '#2f8f4e']];
  const NOMBRES = ['naranja', 'turquesa', 'verde'];
  const { resta, suma, por, unit, centro } = S.util;
  const vistaDe = d => d.vista || { giro: 210, inclinacion: 24 };      // la cúspide común, al frente
  const ARISTAS = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];

  function figura(d) {
    const { a, b, c } = d.caja, r = S.tresPiramides(a, b, c), k = 1.1 * d.separar;
    const ver = d.ver === 'todas' || d.ver === undefined ? [0, 1, 2] : [+d.ver];
    // Separar: cada pirámide se aleja de la cúspide hacia el centro de su base.
    const piezas = ver.map(i => { const p = r.piezas[i], dir = por(unit(resta(p.base, r.cuspide)), k); return Object.assign({ i }, p, { vertices: p.vertices.map(q => suma(q, dir)) }); });
    const caja = []; for (const x of [-a / 2, a / 2]) for (const y of [-b / 2, b / 2]) for (const z of [-c / 2, c / 2]) caja.push([x, y, z]);
    return { r, piezas, caja };
  }

  function alt(d) {
    const { a, b, c } = d.caja, g = figura(d), cubo = a === b && b === c;
    const que = cubo ? `Cubo de arista ${f(a)}` : `Caja de ${f(a)} por ${f(b)} por ${f(c)}`;
    const cuantas = g.piezas.length === 3 ? 'tres pirámides de la misma cúspide' : `la pirámide ${NOMBRES[g.piezas[0].i]}, una de las tres`;
    return `${que}, de volumen ${f(g.r.caja)}, con ${cuantas}${d.separar > 0 ? ', separadas' : ''}: cada una tiene volumen ${f(g.r.piezas[0].volumen)}, un tercio de la caja.`;
  }

  // ---------- Respaldo plano ----------
  function plano(d) {
    const v = vistaDe(d), g = figura(d), E = 44, W = 320, H = 260;
    const p3 = p => S.proyectar(p, v), p2 = q => [W / 2 + q[0] * E, H / 2 - q[1] * E];
    const caras = [];
    for (const p of g.piezas) for (const fc of p.caras) { const q = fc.map(k => p3(p.vertices[k])); caras.push({ pts: q.map(p2), z: centro(q)[2], i: p.i }); }
    caras.sort((x, y) => x.z - y.z);
    return { W, H, caras, caja: ARISTAS.map(([i, j]) => [p2(p3(g.caja[i])), p2(p3(g.caja[j]))]) };
  }
  function dibujar(d) {
    const pl = plano(d), n = x => Math.round(x * 100) / 100;
    const caja = pl.caja.map(([p, q]) => `<line x1="${n(p[0])}" y1="${n(p[1])}" x2="${n(q[0])}" y2="${n(q[1])}" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4"/>`).join('');
    const caras = pl.caras.map(c => `<polygon points="${c.pts.map(p => `${n(p[0])},${n(p[1])}`).join(' ')}" fill="var(--${COLORES[c.i][0]}, ${COLORES[c.i][1]})" fill-opacity="0.55" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>`).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${pl.W} ${pl.H}" width="${pl.W}" height="${pl.H}" role="img" aria-label="${alt(d).replace(/"/g, '&quot;')} Vista plana." class="kit-svg" font-family="inherit">${caja}${caras}</svg>`;
  }

  // ---------- En vivo ----------
  const SPEC = {
    plano: d => dibujar(d),
    vista: d => vistaDe(d),
    clave: d => JSON.stringify([d.caja, d.vista || null]),
    distancia: 9, distMin: 5, distMax: 15,
    construir(T, grupo, d, e, h) {
      const g = figura(d), tinta = h.varCss('--ink', '#2d2340');
      const lineas = (pts, mat) => { const gl = new T.BufferGeometry(); gl.setAttribute('position', new T.Float32BufferAttribute(pts, 3)); return new T.LineSegments(gl, mat); };
      const caja = lineas(ARISTAS.flatMap(([i, j]) => [...g.caja[i], ...g.caja[j]]), new T.LineDashedMaterial({ color: new T.Color(tinta), dashSize: 0.12, gapSize: 0.1, transparent: true, opacity: 0.6 }));
      caja.computeLineDistances(); grupo.add(caja);
      for (const p of g.piezas) {
        const tri = [], lin = [];
        for (const fc of p.caras) {
          for (let k = 1; k + 1 < fc.length; k++) tri.push(...p.vertices[fc[0]], ...p.vertices[fc[k]], ...p.vertices[fc[k + 1]]);
          for (let k = 0; k < fc.length; k++) lin.push(...p.vertices[fc[k]], ...p.vertices[fc[(k + 1) % fc.length]]);
        }
        const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(tri, 3)); geo.computeVertexNormals();
        grupo.add(new T.Mesh(geo, h.material(h.varCss(`--${COLORES[p.i][0]}`, COLORES[p.i][1]), { side: T.DoubleSide, transparent: true, opacity: 0.78, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 })));
        grupo.add(lineas(lin, new T.LineBasicMaterial({ color: new T.Color(tinta) })));
        // El rótulo, afuera de la caja y frente a la base de su pirámide: así no se encima con los otros dos.
        const fuera = suma(p.vertices.slice(1).reduce(suma, [0, 0, 0]).map(x => x / 4), por(unit(resta(p.base, g.r.cuspide)), 0.55));
        h.etiqueta(new T.Vector3(...fuera), `V = ${f(p.volumen)}`, { color: COLORES[p.i][0] });
      }
      const c = new T.Mesh(new T.SphereGeometry(0.08, h.SEG / 2, h.SEG / 4), h.material(h.varCss('--c-h', '#c0392b'))); c.position.set(...g.r.cuspide); grupo.add(c);
      h.etiqueta(new T.Vector3(...g.r.cuspide).multiplyScalar(1.25), 'cúspide', { color: 'c-h' });
      return { aria: alt(d) };
    },
  };
  const montar = (el, op) => Kit.vivo3d.montar(el, SPEC, op);

  return { id: 'geo-piramides-3d', dibujar, alt, montar, plano, figura };
});
