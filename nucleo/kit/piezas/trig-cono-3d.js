/*
 * Pieza «trig-cono-3d» (15 nov 2026, ronda 4 del 3D, docs/3d.md): un cono doble cortado por un plano, que se gira con
 * el dedo. La usa la mesa «El cono que se corta» de trigonometria.conicas.
 *
 * Afirmación de la figura: la curva roja es lo que el plano deja en el cono; su forma depende de comparar la
 * inclinación del plano con la de la generatriz. Los puntos de la curva y su tipo los calcula
 * plantillas/conicas/motor.js (corte3d, con pruebas), no la pieza (regla 1). Girar no cambia el corte.
 *
 * datos = { inclinacion, generatriz, altura, vista?, alt? }   // grados con la horizontal; altura del plano bajo el vértice
 * estado = { plano: true|false }                              // el plano tenue (por defecto, a la vista)
 *
 * Colores (regla 4, los de la unidad): la curva, el lugar que se busca, en rojo (c-h); el plano lleva el tinte de la
 * marca. El nombre de la curva va como rótulo HTML rojo sobre ella.
 *
 * Respaldo (dibujar): el cono, el plano y la curva proyectados desde datos.vista. Se usa mientras carga three.js, sin
 * WebGL 2, en Node (pruebas) y en las miniaturas de la colección.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const Kit = nodo ? require('../kit.js') : root.Kit;
  if (nodo) require('../vivo3d.js');
  const M = nodo ? require('../../../plantillas/conicas/motor.js') : root.MotorConicas;
  const api = fabrica(Kit, M);
  Kit.registrar(api);
  if (nodo) module.exports = api;
})(typeof self !== 'undefined' ? self : this, function (Kit, M) {
  'use strict';
  const rad = g => g * Math.PI / 180;
  const ALTO = 2;                                    // cada hoja del cono llega hasta esta altura sobre o bajo el vértice
  const vistaDe = d => d.vista || { giro: 30, inclinacion: 30 };
  function girar(p, giro, inc) {
    const a = rad(giro || 0), b = rad(inc || 0);
    const x = p[0] * Math.cos(a) + p[2] * Math.sin(a), z = -p[0] * Math.sin(a) + p[2] * Math.cos(a);
    return [x, p[1] * Math.cos(b) - z * Math.sin(b), p[1] * Math.sin(b) + z * Math.cos(b)];
  }
  const corte = d => M.corte3d({ inclinacion: d.inclinacion, generatriz: d.generatriz, altura: d.altura, alto: ALTO });
  const radio = d => ALTO / Math.tan(rad(d.generatriz));
  // Las cuatro esquinas del plano y = tan(φ)·x − altura, recortado a un cuadrado que cubre el cono.
  function esquinas(d) {
    const L = radio(d) + 0.5, m = Math.tan(rad(d.inclinacion));
    let xs = [-L, L];
    if (m > 1e-9) xs = [Math.max(-L, (-ALTO - 0.3 + d.altura) / m), Math.min(L, (ALTO + 0.3 + d.altura) / m)];
    return [[xs[0], -L], [xs[1], -L], [xs[1], L], [xs[0], L]].map(([x, z]) => [x, m * x - d.altura, z]);
  }
  // Punto donde va el rótulo del nombre: el más alejado del eje, para que no tape el vértice.
  function rotulo(c) {
    const pts = c.tramos.flat();
    return pts.reduce((a, p) => (Math.hypot(p[0], p[2]) > Math.hypot(a[0], a[2]) ? p : a), pts[0]);
  }

  function alt(d) {
    if (d.alt) return d.alt;
    const c = corte(d);
    return `Cono doble con la generatriz a ${d.generatriz}° y un plano inclinado ${d.inclinacion}°${d.altura > 0 ? '' : ' que pasa por el vértice'}: el corte es ${c.nombre}.`;
  }

  // ---------- Respaldo plano ----------
  function plano(d) {
    const v = vistaDe(d), E = 48, W = 320, H = 280, R = radio(d);
    const k = Math.min(1, 2.6 / R);
    const p2 = p => { const q = girar(p, v.giro, v.inclinacion); return [W / 2 + q[0] * E * k, H / 2 - q[1] * E * k]; };
    const aros = [ALTO, -ALTO].map(y => Array.from({ length: 40 }, (_, s) => p2([R * Math.cos(s / 40 * 2 * Math.PI), y, R * Math.sin(s / 40 * 2 * Math.PI)])));
    const gen = [0, 90, 180, 270].map(t => [p2([R * Math.cos(rad(t)), ALTO, R * Math.sin(rad(t))]), p2([-R * Math.cos(rad(t)), -ALTO, -R * Math.sin(rad(t))])]);
    const c = corte(d);
    return { W, H, aros, gen, plano: esquinas(d).map(p2), curva: c.tramos.map(t => t.map(p2)), c };
  }
  function dibujar(d, estado) {
    const st = estado || {}, pl = plano(d), n = x => Math.round(x * 10) / 10, pts = l => l.map(p => `${n(p[0])},${n(p[1])}`).join(' ');
    const partes = [];
    if (st.plano !== false) partes.push(`<polygon points="${pts(pl.plano)}" fill="var(--brand, #7f5ae0)" fill-opacity="0.12" stroke="var(--brand, #7f5ae0)" stroke-opacity="0.4"/>`);
    for (const a of pl.aros) partes.push(`<polygon points="${pts(a)}" fill="none" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.4"/>`);
    for (const [a, b] of pl.gen) partes.push(`<line x1="${n(a[0])}" y1="${n(a[1])}" x2="${n(b[0])}" y2="${n(b[1])}" stroke="currentColor" stroke-opacity="0.35" stroke-width="1.2"/>`);
    for (const t of pl.curva) {
      if (t.length === 1) partes.push(`<circle cx="${n(t[0][0])}" cy="${n(t[0][1])}" r="5" fill="var(--c-h, #c0392b)"/>`);
      else partes.push(`<polyline points="${pts(t)}" fill="none" stroke="var(--c-h, #c0392b)" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>`);
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${pl.W} ${pl.H}" width="${pl.W}" height="${pl.H}" role="img" aria-label="${alt(d).replace(/"/g, '&quot;')} Vista plana." class="kit-svg" font-family="inherit">${partes.join('')}</svg>`;
  }

  // ---------- En vivo, sobre la base común (nucleo/kit/vivo3d.js) ----------
  const SPEC = {
    plano: (d, e) => dibujar(d, e),
    vista: d => vistaDe(d),
    clave: d => JSON.stringify(d.vista || null),
    distancia: 9, distMin: 4.5, distMax: 15,
    construir(T, grupo, d, st, h) {
      const rojo = h.varCss('--c-h', '#c0392b'), marca = h.varCss('--brand', '#7f5ae0'), tinta = h.varCss('--ink', '#2d2340');
      const R = radio(d), k = Math.min(1, 2.6 / R), c = corte(d);
      grupo.scale.setScalar(k);
      // Las dos hojas: conos abiertos y tenues, con el vértice en el origen.
      const piel = () => h.material(h.oscuro() ? '#5a4d6e' : '#f3e6da', { transparent: true, opacity: 0.38, side: T.DoubleSide, depthWrite: false });
      for (const s of [1, -1]) {
        const hoja = new T.Mesh(new T.ConeGeometry(R, ALTO, h.SEG * 2, 1, true), piel());
        hoja.position.y = s * ALTO / 2; if (s > 0) hoja.rotation.x = Math.PI;
        grupo.add(hoja);
        const aro = new T.Mesh(new T.TorusGeometry(R, 0.018 / k, 6, h.SEG * 2), h.material(tinta));
        aro.rotation.x = Math.PI / 2; aro.position.y = s * ALTO; grupo.add(aro);
      }
      const eje = new T.BufferGeometry(); eje.setAttribute('position', new T.Float32BufferAttribute([0, -ALTO - 0.3, 0, 0, ALTO + 0.3, 0], 3));
      const ejeL = new T.Line(eje, new T.LineDashedMaterial({ color: new T.Color(tinta), dashSize: 0.12, gapSize: 0.1 })); ejeL.computeLineDistances(); grupo.add(ejeL);
      // El plano: un rectángulo tenue que se inclina y baja.
      if (st.plano !== false) {
        const q = esquinas(d), geo = new T.BufferGeometry();
        geo.setAttribute('position', new T.Float32BufferAttribute([...q[0], ...q[1], ...q[2], ...q[0], ...q[2], ...q[3]], 3));
        geo.computeVertexNormals();
        grupo.add(new T.Mesh(geo, new T.MeshBasicMaterial({ color: new T.Color(marca), transparent: true, opacity: 0.16, side: T.DoubleSide, depthWrite: false })));
      }
      // La curva, en rojo (c-h): un tubo por tramo; el punto, una bolita.
      for (const t of c.tramos) {
        if (t.length === 1) { const b = new T.Mesh(new T.SphereGeometry(0.09 / k, h.SEG, h.SEG / 2), h.material(rojo)); grupo.add(b); continue; }
        const curva = new T.CatmullRomCurve3(t.map(p => new T.Vector3(p[0], p[1], p[2])));
        grupo.add(new T.Mesh(new T.TubeGeometry(curva, Math.min(160, t.length * 2), 0.045 / k, 8, false), h.material(rojo)));
      }
      const p = rotulo(c);
      h.etiqueta(new T.Vector3(p[0] * 1.45 + (Math.abs(p[0]) + Math.abs(p[2]) < 0.05 ? 0.6 : 0), p[1] - 0.25, p[2] * 1.45), c.nombre, { color: 'c-h' });
      return { aria: alt(d) };
    },
  };
  const montar = (el, op) => Kit.vivo3d.montar(el, SPEC, op);

  return { id: 'trig-cono-3d', dibujar, alt, montar, plano, girar, corte };
});
