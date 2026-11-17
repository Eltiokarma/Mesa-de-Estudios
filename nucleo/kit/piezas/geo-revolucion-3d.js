/*
 * Pieza «geo-revolucion-3d» (ronda 4, 15 nov 2026): una región plana que gira alrededor de un eje y barre un sólido.
 * El ángulo girado es un control, no una animación continua (docs/3d.md, regla 4). Se gira la vista con el dedo.
 *
 * Afirmación de la figura: el volumen barrido es el área de la región por el camino que recorre su centroide
 * (Pappus-Guldin); si la región toca el eje, no queda hueco. Perfil, centroide y volumen los calcula
 * nucleo/solidos3d.js (region, revolucion), no la pieza (regla 1).
 *
 * datos = { region: 'rectangulo' | 'triangulo' | 'semicirculo' | 'circulo', d: distancia al eje, grados: 0 a 360, vista? }
 * Colores (los de la unidad): la región y su distancia naranja (c-o), el eje turquesa (c-i), la superficie barrida verde
 * (c-d), el camino del centroide rojo (c-h).
 * Convención: el punto (r, y) de la región, girado φ, queda en (r cos φ, y, −r sin φ); con φ = 0, en el plano xy.
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
  const vistaDe = d => d.vista || { giro: 20, inclinacion: 24 };
  const girado = (r, y, phi) => [r * Math.cos(phi), y, -r * Math.sin(phi)];

  function figura(d) {
    const R = S.revolucion(d.region, d.d, d.grados), phi = rad(d.grados), rMax = Math.max(...R.perfil.map(p => p[0]));
    const arco = (r, y) => Array.from({ length: 25 }, (_, k) => girado(r, y, phi * k / 24));
    return { R, phi, rMax, inicio: R.perfil.map(([r, y]) => girado(r, y, 0)), fin: R.perfil.map(([r, y]) => girado(r, y, phi)),
      camino: arco(R.rc, R.yc), bordes: [arco(rMax, R.perfil.find(p => p[0] === rMax)[1])] };
  }

  function alt(d) {
    const { R } = figura(d);
    const que = R.entero ? `Da la vuelta entera y barre ${/^esfera/.test(R.solido) ? 'una' : 'un'} ${R.solido}` : `Gira ${f(d.grados, 0)}° de 360°`;
    return `Un ${R.nombre} a ${f(d.d)} del eje gira a su alrededor. ${que}: volumen ${f(R.volumen)}, igual a su área ${f(R.area)} por el camino ${f(R.recorrido)} de su centroide.`;
  }

  // ---------- Respaldo plano ----------
  function plano(d) {
    const v = vistaDe(d), g = figura(d), E = 52, W = 320, H = 240;
    const p2 = p => { const q = S.proyectar(p, v); return [W / 2 + q[0] * E, H / 2 - q[1] * E]; };
    return { W, H, eje: [p2([0, -1.6, 0]), p2([0, 1.6, 0])], inicio: g.inicio.map(p2), fin: d.grados > 0 ? g.fin.map(p2) : [],
      camino: d.grados > 0 ? g.camino.map(p2) : [], bordes: d.grados > 0 ? g.bordes.map(b => b.map(p2)) : [], centroide: p2(girado(g.R.rc, g.R.yc, 0)) };
  }
  function dibujar(d) {
    const pl = plano(d), n = x => Math.round(x * 100) / 100, pts = c => c.map(p => `${n(p[0])},${n(p[1])}`).join(' ');
    const reg = (c, op) => `<polygon points="${pts(c)}" fill="var(--c-o, #a95300)" fill-opacity="${op}" stroke="var(--c-o, #a95300)" stroke-width="2"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${pl.W} ${pl.H}" width="${pl.W}" height="${pl.H}" role="img" aria-label="${alt(d).replace(/"/g, '&quot;')} Vista plana." class="kit-svg" font-family="inherit">`
      + `<line x1="${n(pl.eje[0][0])}" y1="${n(pl.eje[0][1])}" x2="${n(pl.eje[1][0])}" y2="${n(pl.eje[1][1])}" stroke="var(--c-i, #0f8a8a)" stroke-width="2.4" stroke-dasharray="8 5"/>`
      + pl.bordes.map(b => `<polyline points="${pts(b)}" fill="none" stroke="var(--c-d, #2f8f4e)" stroke-width="2"/>`).join('')
      + (pl.fin.length ? reg(pl.fin, 0.2) : '') + reg(pl.inicio, 0.5)
      + (pl.camino.length ? `<polyline points="${pts(pl.camino)}" fill="none" stroke="var(--c-h, #c0392b)" stroke-width="2.4"/>` : '')
      + `<circle cx="${n(pl.centroide[0])}" cy="${n(pl.centroide[1])}" r="4" fill="var(--c-h, #c0392b)"/></svg>`;
  }

  // ---------- En vivo ----------
  const SPEC = {
    plano: d => dibujar(d),
    vista: d => vistaDe(d),
    clave: d => JSON.stringify([d.vista || null]),
    distancia: 9, distMin: 5, distMax: 15,
    construir(T, grupo, d, e, h) {
      const g = figura(d), R = g.R;
      const nar = h.varCss('--c-o', '#a95300'), turq = h.varCss('--c-i', '#0f8a8a'), verde = h.varCss('--c-d', '#2f8f4e'), rojo = h.varCss('--c-h', '#c0392b');
      grupo.add(h.barra(new T.Vector3(0, -1.7, 0), new T.Vector3(0, 1.7, 0), 0.03, turq));
      // La región en su lugar de partida y donde llegó: forma plana en xy, girada φ alrededor del eje.
      const forma = new T.Shape(R.perfil.map(([r, y]) => new T.Vector2(r, y)));
      const region = (phi, op) => { const m = new T.Mesh(new T.ShapeGeometry(forma), h.material(nar, { side: T.DoubleSide, transparent: true, opacity: op })); m.rotation.y = phi; return m; };
      grupo.add(region(0, 0.85));
      if (d.grados > 0) {
        if (!R.entero) grupo.add(region(g.phi, 0.45));
        const perfil = R.perfil.concat([R.perfil[0]]).map(([r, y]) => new T.Vector2(Math.max(r, 1e-4), y));
        const pasos = Math.max(2, Math.round(d.grados / 360 * (h.ahorro ? 32 : 64)));
        grupo.add(new T.Mesh(new T.LatheGeometry(perfil, pasos, Math.PI / 2, g.phi),
          h.material(verde, { side: T.DoubleSide, transparent: true, opacity: 0.42, depthWrite: false })));
        grupo.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(g.camino.map(p => new T.Vector3(...p))), 32, 0.03, 6), h.material(rojo)));
      }
      const c = new T.Mesh(new T.SphereGeometry(0.07, h.SEG / 2, h.SEG / 4), h.material(rojo)); c.position.set(R.rc, R.yc, 0); grupo.add(c);
      h.etiqueta(new T.Vector3(0, 1.95, 0), 'eje', { color: 'c-i' });
      h.etiqueta(new T.Vector3(R.rc + 0.15, R.yc - 0.55, 0.05), 'centroide', { color: 'c-h' });   // debajo: no tapa su camino
      return { aria: alt(d) };
    },
  };
  const montar = (el, op) => Kit.vivo3d.montar(el, SPEC, op);

  return { id: 'geo-revolucion-3d', dibujar, alt, montar, plano, figura };
});
