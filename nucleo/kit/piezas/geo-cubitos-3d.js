/*
 * Pieza «geo-cubitos-3d» (ronda 4, 15 nov 2026): un cubo de lado n armado con cubitos, pintado por fuera, que se abre
 * (los cubitos se separan) para ver los de adentro. Abrir es un control, no una animación continua (docs/3d.md).
 * Se gira con el dedo sobre la base común (nucleo/kit/vivo3d.js).
 *
 * Afirmación de la figura: cada cubito pertenece a una clase según cuántas caras tiene pintadas (3, 2, 1 o 0), y las
 * de 0 solo se ven al abrir. Las clases y las caras pintadas las calcula nucleo/solidos3d.js (cubitos, porClase), no
 * la pieza (regla 1).
 *
 * datos = { n: 2 a 6, abrir: 0 a 1, ver: 'todas' | '3' | '2' | '1' | '0', vista? }
 * Colores (los de la unidad): esquinas rojo (c-h), aristas naranja (c-o), caras turquesa (c-i), interior verde (c-d).
 * Cada cubito lleva el color de su clase: fuerte en las caras pintadas, pálido en las que no lo están.
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
  const CLASE = { 3: { color: 'c-h', texto: 'esquinas', hex: '#c0392b' }, 2: { color: 'c-o', texto: 'aristas', hex: '#b85a06' },
    1: { color: 'c-i', texto: 'caras', hex: '#0f8a8a' }, 0: { color: 'c-d', texto: 'interior', hex: '#2f8f4e' } };
  const CARAS = { '+x': [1, 0, 0], '-x': [-1, 0, 0], '+y': [0, 1, 0], '-y': [0, -1, 0], '+z': [0, 0, 1], '-z': [0, 0, -1] };
  const vistaDe = d => d.vista || { giro: 35, inclinacion: 28 };
  const LADO = 2.6;                                   // lo que mide el cubo armado en la escena, sea cual sea n

  // Cubitos visibles con su centro (separado si se abre), su tamaño y sus caras pintadas.
  function figura(d) {
    // Al abrir, los huecos crecen (g, en cubitos) y los cubitos se achican para que el conjunto quepa en el cuadro.
    const g = 1.2 * d.abrir, s = LADO * (1 + 0.3 * d.abrir) / (d.n + (d.n - 1) * g), m = (d.n - 1) / 2;
    const todos = S.cubitos(d.n).map(q => Object.assign({}, q, { c: q.p.map(x => (x - m) * s * (1 + g)) }));
    const vistos = d.ver === 'todas' ? todos : todos.filter(q => q.clase === +d.ver);
    return { s, vistos, cuenta: S.porClase(d.n) };
  }
  // Las 4 esquinas de la cara «k» de un cubito de centro c y lado l.
  function esquinas(c, l, k) {
    const n = CARAS[k], i = n.findIndex(x => x !== 0), [a, b] = [0, 1, 2].filter(x => x !== i), h = l / 2;
    return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, w]) => { const p = c.slice(); p[i] += n[i] * h; p[a] += u * h; p[b] += w * h; return p; });
  }

  function alt(d) {
    const g = figura(d), c = g.cuenta, n = d.n;
    const abierto = d.abrir > 0 ? ', abierto para ver adentro' : '';
    if (d.ver !== 'todas') {
      const k = g.vistos.length, cuales = k === 1 ? 'el único cubito' : `los ${k} cubitos`;
      const caras = d.ver === '0' ? 'sin caras pintadas' : d.ver === '1' ? 'con 1 cara pintada' : `con ${d.ver} caras pintadas`;
      return `Cubo de lado ${n}${abierto}: a la vista solo ${cuales} ${caras} (${CLASE[d.ver].texto}).`;
    }
    return `Cubo de lado ${n} pintado por fuera${abierto}: ${c[3]} esquinas con 3 caras pintadas, ${c[2]} con 2, ${c[1]} con 1 y ${c[0]} sin pintar; ${n ** 3} en total.`;
  }

  // ---------- Respaldo plano: caras que miran al frente, de atrás hacia adelante ----------
  function plano(d) {
    const v = vistaDe(d), g = figura(d), E = 44, W = 320, H = 270, l = g.s * 0.96;
    const ocupado = new Set(g.vistos.map(q => q.p.join(',')));
    const caras = [];
    for (const q of g.vistos) for (const k of Object.keys(CARAS)) {
      const n = CARAS[k], nq = S.proyectar(n, v);
      if (nq[2] <= 1e-9) continue;                                                         // mira hacia atrás
      if (d.abrir === 0 && ocupado.has(q.p.map((x, i) => x + n[i]).join(','))) continue;   // tapada por su vecino
      const pts = esquinas(q.c, l, k).map(p => S.proyectar(p, v));
      caras.push({ pts: pts.map(p => [W / 2 + p[0] * E, H / 2 - p[1] * E]), z: pts.reduce((a, p) => a + p[2], 0) / 4, clase: q.clase, pintada: q.pintadas.includes(k) });
    }
    caras.sort((a, b) => a.z - b.z);
    return { W, H, caras };
  }
  function dibujar(d) {
    const pl = plano(d), n = x => Math.round(x);   // píxeles enteros: con 125 cubitos el SVG pesa menos
    const caras = pl.caras.map(c => `<polygon points="${c.pts.map(p => `${n(p[0])},${n(p[1])}`).join(' ')}" fill="var(--${CLASE[c.clase].color}, ${CLASE[c.clase].hex})" fill-opacity="${c.pintada ? 0.9 : 0.4}" stroke="currentColor" stroke-width="0.8" stroke-linejoin="round"/>`).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${pl.W} ${pl.H}" width="${pl.W}" height="${pl.H}" role="img" aria-label="${alt(d).replace(/"/g, '&quot;')} Vista plana." class="kit-svg" font-family="inherit">${caras}</svg>`;
  }

  // ---------- En vivo: una malla por clase y tono (a lo más 8) y una para todas las aristas ----------
  const SPEC = {
    plano: d => dibujar(d),
    vista: d => vistaDe(d),
    clave: d => JSON.stringify([d.vista || null]),
    distancia: 9, distMin: 4.5, distMax: 16,
    construir(T, grupo, d, e, h) {
      const g = figura(d), l = g.s * 0.96, tri = {}, lin = [];
      for (const q of g.vistos) for (const k of Object.keys(CARAS)) {
        const c = esquinas(q.c, l, k), key = `${q.clase}${q.pintadas.includes(k) ? 'f' : 'p'}`;
        (tri[key] = tri[key] || []).push(...c[0], ...c[1], ...c[2], ...c[0], ...c[2], ...c[3]);
        for (let i = 0; i < 4; i++) lin.push(...c[i], ...c[(i + 1) % 4]);
      }
      const blanco = new T.Color(h.oscuro() ? '#2a2236' : '#ffffff');
      for (const [key, pos] of Object.entries(tri)) {
        const col = new T.Color(h.varCss(`--${CLASE[key[0]].color}`, CLASE[key[0]].hex));
        if (key[1] === 'p') col.lerp(blanco, 0.45);   // pálido, pero se sigue leyendo su clase
        const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); geo.computeVertexNormals();
        grupo.add(new T.Mesh(geo, h.material(col, { side: T.DoubleSide, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 })));
      }
      const gl = new T.BufferGeometry(); gl.setAttribute('position', new T.Float32BufferAttribute(lin, 3));
      grupo.add(new T.LineSegments(gl, new T.LineBasicMaterial({ color: new T.Color(h.varCss('--ink', '#2d2340')), transparent: true, opacity: 0.55 })));
      return { aria: alt(d) };
    },
  };
  const montar = (el, op) => Kit.vivo3d.montar(el, SPEC, op);

  return { id: 'geo-cubitos-3d', dibujar, alt, montar, plano, figura, CLASE };
});
