/*
 * Pieza «quim-orbital-3d» (15 nov 2026, ronda 4 del 3D, docs/3d.md): la nube de un orbital del hidrógeno, que se gira
 * con el dedo. Va sobre la base común nucleo/kit/vivo3d.js.
 *
 * Afirmación de la figura: cada punto es un lugar donde es probable hallar al electrón (densidad |ψ|²); donde no hay
 * puntos, un nodo. Los puntos, su signo y los nodos los calcula el motor de plantillas/atomo-y-tabla (orbital, nube,
 * regla 1); la pieza solo los dibuja. Girar no cambia la nube. No es un camino ni una órbita.
 *
 * datos = {
 *   puntos:  [[x, y, z, ±1]],                // en a₀, ejes de química (z hacia arriba); ±1 es el signo de ψ
 *   escala:  número,                          // unidades de la escena por a₀
 *   nodos:   { radiales: [r], planos: [[nx, ny, nz]], conos: [grados] } | null,   // null: nodos ocultos
 *   nombre:  '2pz',                           // para el alt
 *   lobulos: [{ signo: ±1, pos: [x, y, z] }], // dónde va el rótulo «ψ +» o «ψ −» (lo da el motor)
 *   corte:   'x' | 'y' | 'z' | null,          // si la nube es una lámina, el eje perpendicular a ella (para el alt)
 *   vista:   { giro, inclinacion },           // opcional; sin ella, 30° y 20°
 *   alt,
 * }
 * Colores (regla 4): ψ positiva turquesa c-i, ψ negativa violeta c-f, con rótulos «ψ +» y «ψ −» del mismo color; los nodos,
 * en tinta tenue; los ejes x, y, z, rótulos en cursiva.
 *
 * Respaldo (dibujar): la nube proyectada en el plano desde datos.vista (una muestra de 700 puntos), los ejes y los
 * nodos esféricos como círculos punteados. Se usa mientras carga three.js, sin WebGL 2, en Node y en las miniaturas.
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
  const EJE = 2.5;                                       // largo de cada semieje en la escena
  const vistaDe = d => d.vista || { giro: 30, inclinacion: 20 };
  // De los ejes de química (z arriba) a los de la escena (y arriba), sin espejar: (x, y, z) → (x, z, −y).
  const aEscena = p => [p[0], p[2], -p[1]];
  function girar(p, giro, inc) {
    const a = rad(giro || 0), b = rad(inc || 0);
    const x = p[0] * Math.cos(a) + p[2] * Math.sin(a), z = -p[0] * Math.sin(a) + p[2] * Math.cos(a);
    return [x, p[1] * Math.cos(b) - z * Math.sin(b), p[1] * Math.sin(b) + z * Math.cos(b)];
  }
  // Rótulos de signo: en los puntos que da el motor (lobulos: el lugar más probable de cada signo).
  const rotulos = d => (d.lobulos || []).map(l => ({ signo: l.signo, texto: l.signo > 0 ? 'ψ +' : 'ψ −', color: l.signo > 0 ? 'c-i' : 'c-f', pos: l.pos }));
  const PLANO_EJE = { x: 'yz', y: 'xz', z: 'xy' };
  function alt(d) {
    if (d.alt) return d.alt;
    const n = d.nodos, partes = [];
    if (n) {
      if (n.radiales.length) partes.push(`${n.radiales.length === 1 ? 'un nodo esférico' : `${n.radiales.length} nodos esféricos`}`);
      if (n.planos.length) partes.push(`${n.planos.length === 1 ? 'un plano nodal' : `${n.planos.length} planos nodales`}`);
      if (n.conos.length) partes.push('dos conos nodales');
    }
    const signos = new Set(d.puntos.map(p => p[3])).size === 2 ? ', con zonas de ψ positiva y negativa' : '';
    return `Nube del orbital ${d.nombre} del hidrógeno${d.corte ? `, cortada por el plano ${PLANO_EJE[d.corte]}` : ''}: ${d.puntos.length} puntos donde es probable hallar al electrón${signos}${partes.length ? `; ${partes.join(', ')}` : ''}.`;
  }

  // ---------- Respaldo plano ----------
  function plano(d) {
    const v = vistaDe(d), W = 320, H = 260, E = 38;
    const p2 = p => { const q = girar(aEscena(p), v.giro, v.inclinacion); return [W / 2 + q[0] * E, H / 2 - q[1] * E]; };
    const paso = Math.max(1, Math.ceil(d.puntos.length / 700));
    const puntos = d.puntos.filter((p, i) => i % paso === 0).map(p => { const q = p2(p.map((x, k) => (k < 3 ? x * d.escala : x))); return [q[0], q[1], p[3]]; });
    const ejes = ['x', 'y', 'z'].map((t, k) => { const u = [0, 0, 0]; u[k] = EJE; const w = u.map(x => -x); return { t, de: p2(w), a: p2(u) }; });
    const circulos = d.nodos ? d.nodos.radiales.map(r => r * d.escala * E) : [];
    return { W, H, puntos, ejes, circulos };
  }
  function dibujar(d) {
    const pl = plano(d), n = x => Math.round(x * 10) / 10;
    const ejes = pl.ejes.map(e => `<line x1="${n(e.de[0])}" y1="${n(e.de[1])}" x2="${n(e.a[0])}" y2="${n(e.a[1])}" stroke="currentColor" stroke-opacity="0.45" stroke-width="1"/><text x="${n(e.a[0])}" y="${n(e.a[1])}" font-size="14" font-style="italic" fill="currentColor" text-anchor="middle" dy="-4">${e.t}</text>`).join('');
    const pts = s => pl.puntos.filter(p => p[2] === s).map(p => `<circle cx="${n(p[0])}" cy="${n(p[1])}" r="1.6"/>`).join('');
    const nod = pl.circulos.map(r => `<circle cx="${pl.W / 2}" cy="${pl.H / 2}" r="${n(r)}" fill="none" stroke="currentColor" stroke-opacity="0.6" stroke-dasharray="4 4"/>`).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${pl.W} ${pl.H}" width="${pl.W}" height="${pl.H}" role="img" aria-label="${alt(d).replace(/"/g, '&quot;')} Vista plana." class="kit-svg" font-family="inherit">`
      + `<g class="kit-ejes">${ejes}</g><g class="kit-mas" fill="var(--c-i, #08807a)" fill-opacity="0.7">${pts(1)}</g><g class="kit-menos" fill="var(--c-f, #6b3dbd)" fill-opacity="0.7">${pts(-1)}</g>`
      + `<g class="kit-nodos">${nod}</g><circle cx="${pl.W / 2}" cy="${pl.H / 2}" r="3" fill="currentColor"/></svg>`;
  }

  // ---------- En vivo, sobre la base común ----------
  const SPEC = {
    plano: d => dibujar(d),
    vista: d => vistaDe(d),
    clave: d => JSON.stringify([d.nombre, d.vista || null]),
    distancia: 9, distMin: 3.5, distMax: 15,
    construir(T, grupo, d, e, h) {
      const tinta = h.varCss('--ink', '#2d2340');
      const color = { 1: h.varCss('--c-i', '#08807a'), '-1': h.varCss('--c-f', '#6b3dbd') };
      const paso = h.ahorro ? 2 : 1;
      for (const s of [1, -1]) {
        const pos = [];
        d.puntos.forEach((p, i) => { if (p[3] === s && i % paso === 0) pos.push(...aEscena(p).map(x => x * d.escala)); });
        if (!pos.length) continue;
        const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
        grupo.add(new T.Points(g, new T.PointsMaterial({ color: new T.Color(color[s]), size: h.ahorro ? 0.09 : 0.065, sizeAttenuation: true, transparent: true, opacity: 0.85, depthWrite: false })));
      }
      // Ejes x, y, z con su rótulo en cursiva y el núcleo en el centro.
      const ejes = [];
      ['x', 'y', 'z'].forEach((t, k) => {
        const u = [0, 0, 0]; u[k] = EJE; const a = aEscena(u);
        ejes.push(...a.map(x => -x), ...a);
        h.etiqueta(new T.Vector3(...a).multiplyScalar(1.1), t, { letra: true });
      });
      const ge = new T.BufferGeometry(); ge.setAttribute('position', new T.Float32BufferAttribute(ejes, 3));
      grupo.add(new T.LineSegments(ge, new T.LineBasicMaterial({ color: new T.Color(tinta), transparent: true, opacity: 0.45 })));
      grupo.add(new T.Mesh(new T.SphereGeometry(0.07, h.SEG / 2, h.SEG / 3), h.material(tinta)));
      // Nodos: esferas, planos y conos tenues donde ψ vale cero.
      if (d.nodos) {
        const tenue = { color: new T.Color(tinta), transparent: true, opacity: 0.09, depthWrite: false, side: T.DoubleSide };
        for (const r of d.nodos.radiales) grupo.add(new T.Mesh(new T.SphereGeometry(r * d.escala, h.SEG, Math.round(h.SEG * 0.7)), new T.MeshBasicMaterial(tenue)));
        for (const nrm of d.nodos.planos) {
          const pl = new T.Mesh(new T.PlaneGeometry(2 * EJE, 2 * EJE), new T.MeshBasicMaterial(tenue));
          pl.quaternion.setFromUnitVectors(new T.Vector3(0, 0, 1), new T.Vector3(...aEscena(nrm)).normalize());
          grupo.add(pl);
        }
        for (const g of d.nodos.conos) {
          const alto = EJE * 0.8, radio = alto * Math.tan(rad(g));
          for (const s of [1, -1]) {                   // dos conos con el vértice en el núcleo, a lo largo del eje z
            const c = new T.Mesh(new T.ConeGeometry(radio, alto, h.SEG, 1, true), new T.MeshBasicMaterial(tenue));
            c.rotation.x = s > 0 ? Math.PI : 0; c.position.y = s * alto / 2;
            grupo.add(c);
          }
        }
      }
      for (const r of rotulos(d)) h.etiqueta(new T.Vector3(...aEscena(r.pos).map(x => x * d.escala)), r.texto, { color: r.color });
      return { aria: alt(d) };
    },
  };
  const montar = (el, op) => Kit.vivo3d.montar(el, SPEC, op);

  return { id: 'quim-orbital-3d', dibujar, alt, montar, plano, girar, aEscena, rotulos };
});
