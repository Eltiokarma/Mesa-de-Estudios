/*
 * Pieza «geo-corte-3d» (15 nov 2026, docs/dos-entradas.md): un prisma rectangular (cubo u ortoedro) cortado por un plano,
 * que se gira con el dedo. Segunda pieza viva del kit, sobre la base común nucleo/kit/vivo3d.js.
 *
 * Afirmación de la figura: la sección es el polígono donde el plano corta la caja; sus vértices, su nombre y su área los
 * calcula nucleo/geometria3d.js (seccion, con pruebas), no la pieza (regla 1). Girar la figura no cambia el corte.
 *
 * datos = {
 *   caja:   { a, b, c },                     // lados en x, y, z (caja centrada en el origen)
 *   normal: [x, y, z],                       // normal del plano (no hace falta que sea unitaria)
 *   d:      número,                          // el plano es n·p = d, con n unitaria
 *   vista:  { giro, inclinacion },           // opcional; sin ella, 30° y 20°
 *   alt,
 * }
 * estado = { plano: true|false }             // el plano tenue que corta (por defecto, a la vista)
 *
 * Respaldo (dibujar): la caja y la sección proyectadas en el plano, vistas desde datos.vista. Se usa mientras carga
 * three.js, sin WebGL 2, en Node (pruebas) y en las miniaturas de la colección.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const Kit = nodo ? require('../kit.js') : root.Kit;
  if (nodo) require('../vivo3d.js');
  const G = nodo ? require('../../geometria3d.js') : root.Geo3D;
  const api = fabrica(Kit, G);
  Kit.registrar(api);
  if (nodo) module.exports = api;
})(typeof self !== 'undefined' ? self : this, function (Kit, G) {
  'use strict';
  const rad = g => g * Math.PI / 180;
  const f = (n, d = 2) => Kit.formatear(n, d);
  const ARISTAS = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
  const vistaDe = d => d.vista || { giro: 30, inclinacion: 20 };
  function girar(p, giro, inc) {
    const a = rad(giro || 0), b = rad(inc || 0);
    const x = p[0] * Math.cos(a) + p[2] * Math.sin(a), z = -p[0] * Math.sin(a) + p[2] * Math.cos(a);
    return [x, p[1] * Math.cos(b) - z * Math.sin(b), p[1] * Math.sin(b) + z * Math.cos(b)];
  }
  const corte = d => G.seccion(d.caja, d.normal, d.d);

  function alt(d) {
    if (d.alt) return d.alt;
    const s = corte(d), cubo = d.caja.a === d.caja.b && d.caja.b === d.caja.c;
    const caja = cubo ? `Cubo de arista ${f(d.caja.a)}` : `Prisma rectangular de ${f(d.caja.a)} por ${f(d.caja.b)} por ${f(d.caja.c)}`;
    return s.lados >= 3 ? `${caja}, cortado por un plano: la sección es un ${s.nombre} de área ${f(s.area)}.` : `${caja}; el plano no lo corta.`;
  }

  // ---------- Respaldo plano: proyección de la caja y la sección ----------
  function plano(d) {
    const v = vistaDe(d), E = 46, W = 320, H = 240;
    const p2 = p => { const q = girar(p, v.giro, v.inclinacion); return [W / 2 + q[0] * E, H / 2 - q[1] * E]; };
    const vs = G.vertices(d.caja).map(p2), s = corte(d);
    return { aristas: ARISTAS.map(([i, j]) => [vs[i], vs[j]]), seccion: s.lados >= 3 ? s.puntos.map(p2) : [], W, H };
  }
  function dibujar(d) {
    const pl = plano(d), n = x => Math.round(x * 100) / 100;
    const aristas = pl.aristas.map(([a, b]) => `<line x1="${n(a[0])}" y1="${n(a[1])}" x2="${n(b[0])}" y2="${n(b[1])}" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`).join('');
    const sec = pl.seccion.length ? `<polygon points="${pl.seccion.map(p => `${n(p[0])},${n(p[1])}`).join(' ')}" fill="var(--c-o, #a95300)" fill-opacity="0.45" stroke="var(--c-o, #a95300)" stroke-width="2.4" stroke-linejoin="round"/>` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${pl.W} ${pl.H}" width="${pl.W}" height="${pl.H}" role="img" aria-label="${alt(d).replace(/"/g, '&quot;')} Vista plana." class="kit-svg" font-family="inherit"><g class="kit-caja">${aristas}</g><g class="kit-seccion">${sec}</g></svg>`;
  }

  // ---------- En vivo: la escena sobre la base común (nucleo/kit/vivo3d.js) ----------
  const SPEC = {
    plano: d => dibujar(d),
    vista: d => vistaDe(d),
    clave: d => JSON.stringify([d.caja, d.vista || null]),
    distancia: 8, distMin: 4, distMax: 14,
    construir(T, grupo, d, e, h) {
      const tinta = h.varCss('--ink', '#2d2340'), naranja = h.varCss('--c-o', '#a95300'), marca = h.varCss('--brand', '#7f5ae0');
      const caja = new T.BoxGeometry(d.caja.a, d.caja.b, d.caja.c);
      grupo.add(new T.Mesh(caja, h.material(h.oscuro() ? '#3a2f48' : '#fffaf6', { transparent: true, opacity: 0.35, depthWrite: false })));
      grupo.add(new T.LineSegments(new T.EdgesGeometry(caja), new T.LineBasicMaterial({ color: new T.Color(tinta) })));
      const n = new T.Vector3(...d.normal).normalize(), s = corte(d);
      if (e.plano !== false) {
        const lado = 2.2 * Math.max(d.caja.a, d.caja.b, d.caja.c);
        const pl = new T.Mesh(new T.BoxGeometry(lado, 0.002, lado), new T.MeshBasicMaterial({ color: new T.Color(marca), transparent: true, opacity: 0.12, depthWrite: false }));
        pl.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), n); pl.position.copy(n.clone().multiplyScalar(d.d));
        grupo.add(pl);
      }
      if (s.lados >= 3) {
        const c = s.puntos.reduce((a, p) => [a[0] + p[0] / s.lados, a[1] + p[1] / s.lados, a[2] + p[2] / s.lados], [0, 0, 0]), pos = [];
        for (let k = 0; k < s.lados; k++) { const p = s.puntos[k], q = s.puntos[(k + 1) % s.lados]; pos.push(...c, ...p, ...q); }
        const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); geo.computeVertexNormals();
        grupo.add(new T.Mesh(geo, h.material(naranja, { side: T.DoubleSide, transparent: true, opacity: 0.85 })));
        const borde = new T.BufferGeometry(); borde.setAttribute('position', new T.Float32BufferAttribute(s.puntos.concat([s.puntos[0]]).flat(), 3));
        grupo.add(new T.Line(borde, new T.LineBasicMaterial({ color: new T.Color(tinta) })));
        h.etiqueta(new T.Vector3(...c), s.nombre, { color: 'c-o' });      // el nombre, sobre la sección y en su color
      }
      return { aria: alt(d) };
    },
  };
  const montar = (el, op) => Kit.vivo3d.montar(el, SPEC, op);

  return { id: 'geo-corte-3d', dibujar, alt, montar, plano, girar, corte };
});
