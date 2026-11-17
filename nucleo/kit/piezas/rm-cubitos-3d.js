/*
 * Pieza «rm-cubitos-3d» (15 nov 2026, ronda 4 del 3D, docs/3d.md): cubitos que se giran con el dedo. Una sola pieza
 * para lo espacial de razonamiento matemático: la pila de cubitos con sus sombras de frente y de lado, el cubo pintado
 * que se separa, la pila de dados y la caja con una ruta por las aristas.
 *
 * Afirmación de la figura: cada cubito está donde dice el motor de su unidad (plantillas/cubitos-pintados,
 * plantillas/dados-caras o la cuenta de la unidad, regla 1); cada cara lleva el tono o los puntos que el motor le dio.
 * La pieza no cuenta nada: dibuja lo que le pasan. Girar no cambia la figura.
 *
 * Ejes (los de los motores): x a la derecha, y hacia el fondo (y = 0 es la fila del frente), z hacia arriba (z = 0
 * toca la mesa). El cubito p = [x, y, z] ocupa [x, x + 1] × [y, y + 1] × [z, z + 1].
 *
 * datos = {
 *   celdas:  [{ p: [x, y, z], tono?, caras? }],   // tono de todo el cubito: 'cubo' (por defecto), 'tenue', 'pintada',
 *                                                 // 'blanca', 'base', 'dado' o el color de una variable, suave
 *                                                 // ('c-i', 'c-h'…: la cara de un dado que hay que mirar)
 *            caras: 6 entradas en el orden −x, +x, −y, +y, −z, +z (el de plantillas/cubitos-pintados), cada una
 *            { tono, puntos? } (puntos: 1 a 6, los de un dado) o null (el tono del cubito)
 *   separar: 0 a 1,                               // separa los cubitos desde el centro (deja ver los de adentro)
 *   sombras: { frente: [[x, z]], lado: [[y, z]] }, // cuadraditos de la vista de frente (en la pared del fondo) y de la
 *                                                 // vista de lado (vista desde la derecha, en la pared de la izquierda)
 *   piso:    [nx, ny],                            // cuadrícula del piso (opcional)
 *   malla:   [a, b, c],                           // aristas de una caja de a × b × c cubitos, en alambre (opcional)
 *   ruta:    [[x, y, z]],                         // puntos de la cuadrícula unidos por un camino grueso (opcional)
 *   marcas:  [{ p: [x, y, z], texto, color? }],   // rótulos HTML en puntos de la cuadrícula ('c-o', 'c-i'…)
 *   vista:   { giro, inclinacion },               // opcional; sin ella, −32° (se ve el frente y la derecha) y 24°
 *   alt,
 * }
 * Colores (regla 4): 'pintada' y la ruta, naranja (c-o); la vista de frente, turquesa (c-i); la de lado, verde (c-d).
 *
 * Respaldo (dibujar): proyección de las mismas caras, vistas desde datos.vista, pintadas de atrás hacia adelante. Se
 * usa mientras carga three.js, sin WebGL 2, en Node (pruebas) y en las miniaturas de la colección.
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
  const f = (n, d = 2) => Kit.formatear(n, d);
  const vistaDe = d => d.vista || { giro: -32, inclinacion: 24 };
  // Normales de las caras en el orden −x, +x, −y, +y, −z, +z, y los dos ejes de cada cara (u, v) para los puntos.
  const NORMAL = [[-1, 0, 0], [1, 0, 0], [0, -1, 0], [0, 1, 0], [0, 0, -1], [0, 0, 1]];
  const EJES = [[[0, -1, 0], [0, 0, 1]], [[0, 1, 0], [0, 0, 1]], [[1, 0, 0], [0, 0, 1]], [[-1, 0, 0], [0, 0, 1]], [[1, 0, 0], [0, 1, 0]], [[1, 0, 0], [0, -1, 0]]];
  // Puntos de un dado en coordenadas de la cara (de −0,5 a 0,5).
  const Q = 0.27;
  const PUNTOS = {
    1: [[0, 0]], 2: [[-Q, Q], [Q, -Q]], 3: [[-Q, Q], [0, 0], [Q, -Q]], 4: [[-Q, -Q], [-Q, Q], [Q, -Q], [Q, Q]],
    5: [[-Q, -Q], [-Q, Q], [0, 0], [Q, -Q], [Q, Q]], 6: [[-Q, -Q], [-Q, 0], [-Q, Q], [Q, -Q], [Q, 0], [Q, Q]],
  };
  const R_PUNTO = 0.085;
  const TONOS = {
    cubo: { css: '--c-o', mezcla: 0.45 }, pintada: { css: '--c-o', mezcla: 0.85 },
    blanca: { fijo: '#ddd5cf', oscuro: '#cfc6d6' }, base: { fijo: '#b3a8a0', oscuro: '#6f6478' },
    dado: { fijo: '#fffdf9', oscuro: '#e9e3ef' }, tenue: { css: '--c-o', mezcla: 0.32, opaco: 0.07 },
  };

  // Gira un punto (en ejes de three: x derecha, y arriba, z hacia la cámara): primero el giro, después la inclinación.
  function girar(p, giro, inc) {
    const a = rad(giro || 0), b = rad(inc || 0);
    const x = p[0] * Math.cos(a) + p[2] * Math.sin(a), z = -p[0] * Math.sin(a) + p[2] * Math.cos(a);
    return [x, p[1] * Math.cos(b) - z * Math.sin(b), p[1] * Math.sin(b) + z * Math.cos(b)];
  }

  // ---------- Geometría común (la usan el respaldo y el 3D) ----------
  function caja(d) {
    const ps = [];
    for (const c of centros(d)) ps.push(c.map(x => x - 0.5), c.map(x => x + 0.5));
    if (d.sombras) for (const m of murosEn(d, cajaCeldas(d))) ps.push(...m.p);
    if (d.malla) ps.push([0, 0, 0], d.malla);
    if (d.piso) ps.push([0, 0, 0], [d.piso[0], d.piso[1], 0]);
    for (const q of d.ruta || []) ps.push(q);
    for (const m of d.marcas || []) ps.push(m.p);                // los rótulos también caben en el cuadro
    if (!ps.length) ps.push([0, 0, 0], [1, 1, 1]);
    const mn = [0, 1, 2].map(i => Math.min(...ps.map(p => p[i]))), mx = [0, 1, 2].map(i => Math.max(...ps.map(p => p[i])));
    return { mn, mx, centro: mn.map((v, i) => (v + mx[i]) / 2), lado: Math.max(1, ...mx.map((v, i) => v - mn[i])) };
  }
  // Caja de los cubitos (sin separar): de ahí salen las paredes de las vistas.
  function cajaCeldas(d) {
    const cs = d.celdas || [];
    if (!cs.length) return { mn: [0, 0, 0], mx: [1, 1, 1] };
    return { mn: [0, 1, 2].map(i => Math.min(...cs.map(c => c.p[i]))), mx: [0, 1, 2].map(i => Math.max(...cs.map(c => c.p[i] + 1))) };
  }
  // Centro de cada cubito, corrido hacia afuera si se separa (desde el centro de los cubitos).
  function centros(d) {
    const cs = d.celdas || [], s = Math.max(0, Math.min(1, d.separar || 0)) * 0.7;
    const m = [0, 1, 2].map(i => cs.reduce((a, c) => a + c.p[i] + 0.5, 0) / Math.max(1, cs.length));
    return cs.map(c => [0, 1, 2].map(i => c.p[i] + 0.5 + (c.p[i] + 0.5 - m[i]) * s));
  }
  const ocupadas = d => new Set((d.celdas || []).map(c => c.p.join()));
  // Las caras que se dibujan: con los cubitos juntos, las pegadas a otro cubito no se ven y se omiten.
  function caras(d) {
    const occ = ocupadas(d), juntos = !(d.separar > 0), cs = centros(d), out = [];
    (d.celdas || []).forEach((c, i) => {
      for (let k = 0; k < 6; k++) {
        const n = NORMAL[k];
        if (juntos && occ.has([c.p[0] + n[0], c.p[1] + n[1], c.p[2] + n[2]].join())) continue;
        const e = (c.caras && c.caras[k]) || {};
        out.push({ celda: i, k, centro: cs[i].map((v, j) => v + n[j] * 0.5), tono: e.tono || c.tono || 'cubo', puntos: e.puntos || 0 });
      }
    });
    return out;
  }
  // Esquinas de una cara (en ejes del motor), en orden alrededor.
  function esquinas(cara) {
    const [u, v] = EJES[cara.k], c = cara.centro;
    return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => c.map((x, i) => x + 0.5 * a * u[i] + 0.5 * b * v[i]));
  }
  function puntosDe(cara) {
    const [u, v] = EJES[cara.k], n = NORMAL[cara.k];
    return (PUNTOS[cara.puntos] || []).map(([a, b]) => cara.centro.map((x, i) => x + a * u[i] + b * v[i] + n[i] * 0.004));
  }
  const muros = d => murosEn(d, cajaCeldas(d));
  const murosEn = (d, b) => {
    const s = d.sombras || {}, out = [];
    for (const [x, z] of s.frente || []) out.push({ que: 'frente', p: [[x, b.mx[1] + 0.4, z], [x + 1, b.mx[1] + 0.4, z], [x + 1, b.mx[1] + 0.4, z + 1], [x, b.mx[1] + 0.4, z + 1]] });
    for (const [y, z] of s.lado || []) out.push({ que: 'lado', p: [[b.mn[0] - 0.4, y, z], [b.mn[0] - 0.4, y + 1, z], [b.mn[0] - 0.4, y + 1, z + 1], [b.mn[0] - 0.4, y, z + 1]] });
    return out;
  };
  // Aristas de la malla de alambre a × b × c.
  function aristasMalla(m) {
    const out = [];
    if (!m) return out;
    const [a, b, c] = m;
    for (let x = 0; x <= a; x++) for (let y = 0; y <= b; y++) for (let z = 0; z <= c; z++) {
      if (x < a) out.push([[x, y, z], [x + 1, y, z]]);
      if (y < b) out.push([[x, y, z], [x, y + 1, z]]);
      if (z < c) out.push([[x, y, z], [x, y, z + 1]]);
    }
    return out;
  }
  const aristasPiso = p => {
    if (!p) return [];
    const out = [];
    for (let x = 0; x <= p[0]; x++) out.push([[x, 0, 0], [x, p[1], 0]]);
    for (let y = 0; y <= p[1]; y++) out.push([[0, y, 0], [p[0], y, 0]]);
    return out;
  };

  function alt(d) {
    if (d.alt) return d.alt;
    const n = (d.celdas || []).length;
    return `${n === 1 ? 'Un cubito' : `${f(n, 0)} cubitos`} en el espacio${d.ruta ? ', con una ruta por las aristas' : ''}${d.sombras ? ', con sus vistas de frente y de lado en las paredes' : ''}.`;
  }

  // ---------- Respaldo plano ----------
  const W = 320, H = 260;
  function plano(d) {
    const v = vistaDe(d), b = caja(d), E = Math.min(46, 168 / b.lado);
    const t3 = p => [p[0] - b.centro[0], p[2] - b.centro[2], -(p[1] - b.centro[1])];   // motor → three
    const pr = p => { const q = girar(t3(p), v.giro, v.inclinacion); return { x: W / 2 + q[0] * E, y: H / 2 - q[1] * E, z: q[2] }; };
    const hacia = n => girar([n[0], n[2], -n[1]], v.giro, v.inclinacion)[2] > 1e-9;    // la cara mira a la cámara
    const poligonos = [];
    for (const m of muros(d)) { const ps = m.p.map(pr); poligonos.push({ tipo: m.que, ps, z: ps.reduce((a, q) => a + q.z, 0) / 4 - 50 }); }
    for (const c of caras(d)) {
      if (!hacia(NORMAL[c.k])) continue;
      const ps = esquinas(c).map(pr);
      poligonos.push({ tipo: 'cara', tono: c.tono, ps, z: pr(c.centro).z, puntos: puntosDe(c).map(pr) });
    }
    poligonos.sort((a, q) => a.z - q.z);
    return {
      W, H, E, poligonos,
      lineas: aristasMalla(d.malla).concat(aristasPiso(d.piso)).map(([p, q]) => [pr(p), pr(q)]),
      ruta: (d.ruta || []).map(pr),
      marcas: (d.marcas || []).map(m => Object.assign({ en: pr(m.p) }, m)),
    };
  }
  const RELLENO = {
    cubo: 'fill="color-mix(in srgb, var(--c-o, #a95300) 32%, var(--card, #fffaf6))"',
    pintada: 'fill="color-mix(in srgb, var(--c-o, #a95300) 85%, var(--card, #fffaf6))"', blanca: 'fill="#ddd5cf"', base: 'fill="#b3a8a0"',
    dado: 'fill="var(--card, #fffaf6)"', tenue: 'fill="var(--c-o, #a95300)" fill-opacity="0.12"',
  };
  function dibujar(d) {
    const pl = plano(d), n = x => Math.round(x * 100) / 100, pts = ps => ps.map(p => `${n(p.x)},${n(p.y)}`).join(' ');
    const cuerpo = pl.poligonos.map(g => {
      if (g.tipo !== 'cara') return `<polygon points="${pts(g.ps)}" fill="var(${g.tipo === 'frente' ? '--c-i, #07746e' : '--c-d, #3d6b0c'})" fill-opacity="0.4" stroke="none"/>`;
      const r = Math.max(1.5, R_PUNTO * pl.E);
      const relleno = /^c-[a-z]$/.test(g.tono) ? `fill="color-mix(in srgb, var(--${g.tono}) 50%, var(--card, #fffaf6))"` : RELLENO[g.tono] || RELLENO.cubo;
      return `<polygon points="${pts(g.ps)}" ${relleno} stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"${g.tono === 'tenue' ? ' stroke-opacity="0.35"' : ''}/>`
        + g.puntos.map(p => `<circle cx="${n(p.x)}" cy="${n(p.y)}" r="${n(r)}" fill="currentColor"/>`).join('');
    }).join('');
    const lineas = pl.lineas.map(([a, b]) => `<line x1="${n(a.x)}" y1="${n(a.y)}" x2="${n(b.x)}" y2="${n(b.y)}" stroke="currentColor" stroke-opacity="0.45" stroke-width="1"/>`).join('');
    const ruta = pl.ruta.length > 1 ? `<polyline points="${pts(pl.ruta)}" fill="none" stroke="var(--c-o, #a95300)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>` : '';
    const marcas = pl.marcas.map(m => `<text x="${n(m.en.x)}" y="${n(m.en.y - 8)}" text-anchor="middle" font-size="14" font-weight="700" fill="${m.color ? `var(--${m.color})` : 'currentColor'}">${Kit.esc ? Kit.esc(m.texto) : String(m.texto).replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text>`).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${alt(d).replace(/"/g, '&quot;')} Vista plana." class="kit-svg" font-family="inherit"><g class="kit-lineas">${lineas}</g><g class="kit-cubitos">${cuerpo}</g><g class="kit-ruta">${ruta}</g><g class="kit-marcas">${marcas}</g></svg>`;
  }

  // ---------- En vivo: la escena sobre la base común (nucleo/kit/vivo3d.js) ----------
  const SPEC = {
    plano: d => dibujar(d),
    vista: d => vistaDe(d),
    // Se vuelve a la vista de partida solo si cambia la vista pedida: subir o separar cubitos no mueve la cámara.
    clave: d => JSON.stringify(d.vista || null),
    distancia: 8.4, distMin: 4.2, distMax: 14,
    construir(T, grupo, d, e, h) {
      const b = caja(d), osc = h.oscuro();
      // Cabe en el cuadro: por la esfera que lo envuelve (un cubo) o por su lado más largo (una pila alta).
      const radio = Math.hypot(...b.mx.map((v, i) => v - b.mn[i])) / 2, escala = Math.min(2.6 / radio, 4.2 / b.lado);
      grupo.scale.setScalar(escala);
      const t3 = p => new T.Vector3(p[0] - b.centro[0], p[2] - b.centro[2], -(p[1] - b.centro[1]));
      const tinta = h.varCss('--ink', '#2d2340'), naranja = h.varCss('--c-o', '#a95300');
      const colorTono = k => {
        if (/^c-[a-z]$/.test(k)) return new T.Color(h.varCss(`--${k}`, '#a95300')).lerp(new T.Color(osc ? '#2a2135' : '#fffaf6'), 0.5).getStyle();
        const t = TONOS[k] || TONOS.cubo;
        if (t.fijo) return osc && t.oscuro ? t.oscuro : t.fijo;
        const c = new T.Color(naranja);
        return t.mezcla < 1 ? c.lerp(new T.Color(osc ? '#2a2135' : '#fffaf6'), 1 - t.mezcla).getStyle() : c.getStyle();
      };
      // Una malla por tono: todas las caras de ese tono en una sola geometría (presupuesto de mallas).
      const porTono = {}, puntos = [];
      for (const c of caras(d)) {
        (porTono[c.tono] = porTono[c.tono] || []).push(c);
        if (c.puntos) puntos.push(...puntosDe(c).map(p => ({ p, k: c.k })));
      }
      for (const [tono, lista] of Object.entries(porTono)) {
        const pos = [];
        for (const c of lista) { const q = esquinas(c).map(t3); for (const i of [0, 1, 2, 0, 2, 3]) pos.push(q[i].x, q[i].y, q[i].z); }
        const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); geo.computeVertexNormals();
        const t = TONOS[tono] || TONOS.cubo;
        grupo.add(new T.Mesh(geo, h.material(colorTono(tono), t.opaco ? { transparent: true, opacity: t.opaco, depthWrite: false, side: T.DoubleSide } : { side: T.DoubleSide })));
      }
      // Los puntos de los dados: discos chatos, todos en una geometría.
      if (puntos.length) {
        const pos = [], NS = Math.max(8, h.SEG / 2);
        for (const { p, k } of puntos) {
          const [u, v] = EJES[k], c = t3(p), U = t3([u[0], u[1], u[2]]).sub(t3([0, 0, 0])), V = t3([v[0], v[1], v[2]]).sub(t3([0, 0, 0]));
          for (let s = 0; s < NS; s++) {
            const a0 = 2 * Math.PI * s / NS, a1 = 2 * Math.PI * (s + 1) / NS;
            const q0 = c.clone().addScaledVector(U, R_PUNTO * Math.cos(a0)).addScaledVector(V, R_PUNTO * Math.sin(a0));
            const q1 = c.clone().addScaledVector(U, R_PUNTO * Math.cos(a1)).addScaledVector(V, R_PUNTO * Math.sin(a1));
            pos.push(c.x, c.y, c.z, q0.x, q0.y, q0.z, q1.x, q1.y, q1.z);
          }
        }
        const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); geo.computeVertexNormals();
        grupo.add(new T.Mesh(geo, new T.MeshBasicMaterial({ color: new T.Color(tinta), side: T.DoubleSide })));
      }
      // Bordes de cada cubito y la malla de alambre, en una sola pieza de líneas.
      // Los cubitos tenues llevan bordes tenues: así lo resaltado se lee primero.
      const lin = { fuerte: [], tenue: [] }, cs = centros(d);
      cs.forEach((c, i) => {
        const l = d.celdas[i].tono === 'tenue' ? lin.tenue : lin.fuerte;
        for (const [a, q] of aristasMalla([1, 1, 1])) { const p = t3(a.map((x, j) => c[j] - 0.5 + x)), r = t3(q.map((x, j) => c[j] - 0.5 + x)); l.push(p.x, p.y, p.z, r.x, r.y, r.z); }
      });
      for (const [k, l] of Object.entries(lin)) {
        if (!l.length) continue;
        const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(l, 3));
        grupo.add(new T.LineSegments(g, new T.LineBasicMaterial(k === 'tenue' ? { color: new T.Color(tinta), transparent: true, opacity: 0.16 } : { color: new T.Color(tinta) })));
      }
      const alambre = aristasMalla(d.malla).concat(aristasPiso(d.piso)).flatMap(([a, q]) => { const p = t3(a), r = t3(q); return [p.x, p.y, p.z, r.x, r.y, r.z]; });
      if (alambre.length) { const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(alambre, 3)); grupo.add(new T.LineSegments(g, new T.LineBasicMaterial({ color: new T.Color(tinta), transparent: true, opacity: 0.45 }))); }
      // Las vistas en las paredes: cuadraditos tenues del color de cada vista, con su rótulo.
      const ms = muros(d);
      for (const que of ['frente', 'lado']) {
        const lista = ms.filter(m => m.que === que);
        if (!lista.length) continue;
        const pos = [];
        for (const m of lista) { const q = m.p.map(t3); for (const i of [0, 1, 2, 0, 2, 3]) pos.push(q[i].x, q[i].y, q[i].z); }
        const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
        grupo.add(new T.Mesh(geo, new T.MeshBasicMaterial({ color: new T.Color(h.varCss(que === 'frente' ? '--c-i' : '--c-d', que === 'frente' ? '#07746e' : '#3d6b0c')), transparent: true, opacity: 0.45, side: T.DoubleSide, depthWrite: false })));
        const alto = Math.max(...lista.map(m => m.p[2][2]));
        const bc = cajaCeldas(d), sobre = que === 'frente' ? [(bc.mn[0] + bc.mx[0]) / 2, bc.mx[1] + 0.4, alto + 0.45] : [bc.mn[0] - 0.4, (bc.mn[1] + bc.mx[1]) / 2, alto + 0.45];
        h.etiqueta(t3(sobre), que === 'frente' ? 'vista de frente' : 'vista de lado', { color: que === 'frente' ? 'c-i' : 'c-d' });
      }
      // La ruta: barras gruesas por las aristas.
      const ruta = d.ruta || [];
      for (let i = 0; i + 1 < ruta.length; i++) grupo.add(h.barra(t3(ruta[i]), t3(ruta[i + 1]), 0.05 / escala, naranja));   // grosor fijo en pantalla
      for (const m of d.marcas || []) h.etiqueta(t3(m.p), m.texto, { color: m.color });
      return { aria: alt(d) };
    },
  };
  const montar = (el, op) => Kit.vivo3d.montar(el, SPEC, op);

  return { id: 'rm-cubitos-3d', dibujar, alt, montar, plano, girar, caras, centros };
});
