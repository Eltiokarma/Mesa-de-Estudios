/*
 * Pieza «ari-cubitos-3d» (15 nov 2026, ronda 4 del 3D, docs/3d.md): bloques en una cuadrícula del espacio, agrupados por
 * color, que se giran con el dedo. Sirve a las unidades de aritmética donde el tercer factor es la profundidad: la caja
 * de divisores de p^a · q^b · r^c, la caja que se llena con cubos (MCD), los ladrillos que arman un cubo (MCM) y el cubo
 * de cubitos con su residuo (raíz cúbica).
 *
 * Afirmación de la figura: cada bloque es una unidad contada por el motor; su grupo (color y rótulo) dice qué cuenta.
 * Girar no cambia ni la cantidad ni el grupo de ningún bloque. La pieza no calcula nada (regla 1): dibuja la lista que
 * le pasan los motores de plantillas/divisores, plantillas/fracciones y plantillas/potenciacion.
 *
 * datos = {
 *   bloques: [{ x, y, z, w?, h?, d?, g }],    // esquina menor del bloque; z hacia arriba; w, h, d: lados en x, y, z (1)
 *   grupos:  [{ nombre, color?, rotulo?, rotuloEn?, dice? }],  // color: 'c-o', 'c-i', 'c-h', 'c-d', 'c-f' o nada (neutro)
 *                                                      // rotulo: texto HTML del color del grupo (regla 4), sobre su tapa
 *                                                      // o en rotuloEn [x, y, z]; dice: lo que se lee al tocarlo
 *   marco?:  { x, y, z, w, h, d, color?, rotulo? },  // caja de alambre: la caja que se llena, el cubo que falta…
 *   marcas?: [{ p: [x, y, z], texto, color? }],      // rótulos sueltos: lo que significa cada eje («×2», «12 cm»)
 *   hueco?:  0.1,                              // separación entre bloques, en la misma unidad
 *   vista?:  { giro, inclinacion },            // sin ella, 35° y 25°
 *   alt?,
 * }
 * Respaldo (dibujar): las caras visibles proyectadas, de atrás hacia adelante, con el rótulo de cada grupo. Se usa
 * mientras carga three.js, sin WebGL 2, en Node (pruebas) y en las miniaturas de la colección.
 * Presupuesto (docs/3d.md): una malla instanciada por grupo y una de aristas; hasta MAX bloques (12 triángulos cada uno).
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
  const MAX = 1200;                                   // 14 400 triángulos: queda bajo los 20 000 de docs/3d.md
  const rad = g => g * Math.PI / 180;
  const HEX = { 'c-o': '#b85a06', 'c-i': '#08807a', 'c-h': '#c0364a', 'c-d': '#4f7a17', 'c-f': '#6b3dbd' };
  const NEUTRO = '#cfc6bd';
  const vistaDe = d => d.vista || { giro: 35, inclinacion: 25 };
  const lados = b => [b.w || 1, b.h || 1, b.d || 1];

  function revisar(d) {
    if (!d || !Array.isArray(d.bloques) || !Array.isArray(d.grupos)) throw new Error('ari-cubitos-3d: faltan bloques o grupos');
    if (d.bloques.length > MAX) throw new Error(`ari-cubitos-3d: ${d.bloques.length} bloques pasan del tope de ${MAX}`);
    for (const b of d.bloques) if (!d.grupos[b.g]) throw new Error(`ari-cubitos-3d: grupo ${b.g} no existe`);
  }
  // Cuántos bloques tiene cada grupo (lo que se dice al tocar y en el alt).
  const cuenta = d => d.grupos.map((_, i) => d.bloques.filter(b => b.g === i).length);

  // Del motor (x, y, z con z arriba) a la escena (y arriba): x → x, z → y, y → −z. Centrado y con la diagonal en 4,4 unidades.
  function encuadre(d) {
    const cajas = d.bloques.map(b => { const [w, h, p] = lados(b); return [b.x, b.y, b.z, b.x + w, b.y + h, b.z + p]; });
    if (d.marco) { const m = d.marco; cajas.push([m.x, m.y, m.z, m.x + m.w, m.y + m.h, m.z + m.d]); }
    // Las marcas no entran al encuadre: se ponen junto a la figura y no deben achicarla.
    if (!cajas.length) cajas.push([0, 0, 0, 1, 1, 1]);
    const lo = [0, 1, 2].map(k => Math.min(...cajas.map(c => c[k]))), hi = [3, 4, 5].map(k => Math.max(...cajas.map(c => c[k])));
    // La escala sale de la diagonal: así la figura cabe en el lienzo desde cualquier lado que se gire.
    const c = [0, 1, 2].map(k => (lo[k] + hi[k]) / 2), L = Math.max(Math.hypot(...[0, 1, 2].map(k => hi[k] - lo[k])), 1);
    const s = 4.4 / L;
    return { s, aEscena: (x, y, z) => [(x - c[0]) * s, (z - c[2]) * s, -(y - c[1]) * s] };
  }
  function girar(p, giro, inc) {
    const a = rad(giro || 0), b = rad(inc || 0);
    const x = p[0] * Math.cos(a) + p[2] * Math.sin(a), z = -p[0] * Math.sin(a) + p[2] * Math.cos(a);
    return [x, p[1] * Math.cos(b) - z * Math.sin(b), p[1] * Math.sin(b) + z * Math.cos(b)];
  }
  // Dónde va el rótulo de un grupo: sobre el centro de su tapa más alta (en coordenadas del motor).
  function puntoRotulo(d, i) {
    if (d.grupos[i].rotuloEn) return d.grupos[i].rotuloEn;
    const bs = d.bloques.filter(b => b.g === i);
    if (!bs.length) return null;
    const sx = bs.reduce((a, b) => a + b.x + lados(b)[0] / 2, 0) / bs.length, sy = bs.reduce((a, b) => a + b.y + lados(b)[1] / 2, 0) / bs.length;
    return [sx, sy, Math.max(...bs.map(b => b.z + lados(b)[2])) + 0.35];
  }

  function alt(d) {
    if (d.alt) return d.alt;
    const n = cuenta(d);
    return `${d.bloques.length} bloques: ${d.grupos.map((g, i) => `${n[i]} ${g.nombre}`).join(', ')}.`;
  }

  // ---------- Respaldo plano: caras visibles, de atrás hacia adelante ----------
  const CARAS = [   // normal (motor) y sus cuatro vértices en fracciones del bloque
    { n: [1, 0, 0], v: [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]], luz: 0.72 },
    { n: [-1, 0, 0], v: [[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]], luz: 0.72 },
    { n: [0, 1, 0], v: [[0, 1, 0], [0, 1, 1], [1, 1, 1], [1, 1, 0]], luz: 0.55 },
    { n: [0, -1, 0], v: [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]], luz: 0.55 },
    { n: [0, 0, 1], v: [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]], luz: 1 },
    { n: [0, 0, -1], v: [[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]], luz: 0.45 },
  ];
  function plano(d) {
    revisar(d);
    const v = vistaDe(d), en = encuadre(d), W = 320, H = 260, hu = d.hueco === undefined ? 0.1 : d.hueco;
    const pr = (x, y, z) => girar(en.aEscena(x, y, z), v.giro, v.inclinacion);
    const ocupado = new Set(d.bloques.filter(b => !b.w && !b.h && !b.d).map(b => `${b.x},${b.y},${b.z}`));
    const caras = [];
    for (const b of d.bloques) {
      const [w, h, p] = lados(b), unidad = !b.w && !b.h && !b.d;
      for (const c of CARAS) {
        const nz = girar([c.n[0], c.n[2], -c.n[1]], v.giro, v.inclinacion)[2];
        if (nz <= 1e-9) continue;                                           // mira hacia atrás
        if (unidad && ocupado.has(`${b.x + c.n[0]},${b.y + c.n[1]},${b.z + c.n[2]}`)) continue;   // tapada por la vecina
        const pts = c.v.map(q => pr(b.x + hu / 2 + q[0] * (w - hu), b.y + hu / 2 + q[1] * (h - hu), b.z + hu / 2 + q[2] * (p - hu)));
        caras.push({ g: b.g, luz: c.luz, pts, z: pts.reduce((a, q) => a + q[2], 0) / 4 });
      }
    }
    caras.sort((a, b) => a.z - b.z);
    let marco = null;
    if (d.marco) {
      const m = d.marco, es = [];
      for (let k = 0; k < 8; k++) es.push(pr(m.x + (k & 1 ? m.w : 0), m.y + (k & 2 ? m.h : 0), m.z + (k & 4 ? m.d : 0)));
      marco = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]].map(([i, j]) => [es[i], es[j]]);
    }
    const rotulos = d.grupos.map((g, i) => (g.rotulo && puntoRotulo(d, i) ? { color: g.color, texto: g.rotulo, p: pr(...puntoRotulo(d, i)) } : null)).filter(Boolean);
    if (d.marco && d.marco.rotulo) rotulos.push({ color: d.marco.color, texto: d.marco.rotulo, p: pr(d.marco.x + d.marco.w, d.marco.y, d.marco.z + d.marco.d + 0.35) });
    for (const m of d.marcas || []) rotulos.push({ color: m.color, texto: m.texto, p: pr(...m.p) });
    // Encaje: todo lo proyectado entra en el viewBox con 16 px de margen (los rótulos, con 28 arriba).
    const todos = caras.flatMap(c => c.pts).concat(marco ? marco.flat() : [], rotulos.map(r => r.p));
    const xs = todos.map(p => p[0]), ys = todos.map(p => p[1]);
    const x0 = Math.min(...xs, -1), x1 = Math.max(...xs, 1), y0 = Math.min(...ys, -1), y1 = Math.max(...ys, 1);
    const E = Math.min((W - 32) / (x1 - x0), (H - 44) / (y1 - y0));
    const a2 = p => [W / 2 + (p[0] - (x0 + x1) / 2) * E, H / 2 + 6 - (p[1] - (y0 + y1) / 2) * E];
    return { W, H, caras: caras.map(c => ({ g: c.g, luz: c.luz, pts: c.pts.map(a2) })), marco: marco && marco.map(s => s.map(a2)), rotulos: rotulos.map(r => ({ color: r.color, texto: r.texto, p: a2(r.p) })) };
  }
  const colorDe = c => (c ? `var(--${c}, ${HEX[c] || NEUTRO})` : 'currentColor');
  const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  function dibujar(d) {
    const pl = plano(d), n = x => Math.round(x * 10) / 10;
    const pts = c => c.pts.map(p => `${n(p[0])},${n(p[1])}`).join(' ');
    const caras = pl.caras.map(c => {
      const g = d.grupos[c.g];
      return g.color
        ? `<polygon points="${pts(c)}" fill="var(--${g.color}, ${HEX[g.color] || NEUTRO})" fill-opacity="${c.luz}" stroke="currentColor" stroke-opacity="0.45" stroke-width="0.6" stroke-linejoin="round"/>`
        : `<polygon points="${pts(c)}" fill="${NEUTRO}" fill-opacity="${c.luz * 0.6}" stroke="currentColor" stroke-opacity="0.35" stroke-width="0.6" stroke-linejoin="round"/>`;
    }).join('');
    const marco = pl.marco ? `<g class="kit-marco" stroke="${colorDe(d.marco.color)}" stroke-width="1.6" stroke-dasharray="5 4" stroke-linecap="round">${pl.marco.map(([a, b]) => `<line x1="${n(a[0])}" y1="${n(a[1])}" x2="${n(b[0])}" y2="${n(b[1])}"/>`).join('')}</g>` : '';
    const rot = pl.rotulos.map(r => `<text x="${n(r.p[0])}" y="${n(r.p[1])}" text-anchor="middle" font-size="15" font-weight="700" fill="${colorDe(r.color)}" stroke="var(--bg, #fff)" stroke-width="3" paint-order="stroke">${esc(r.texto)}</text>`).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${pl.W} ${pl.H}" width="${pl.W}" height="${pl.H}" role="img" aria-label="${esc(alt(d))} Vista plana." class="kit-svg" font-family="inherit"><g class="kit-bloques">${caras}</g>${marco}${rot}</svg>`;
  }

  // ---------- En vivo: la escena sobre la base común (nucleo/kit/vivo3d.js) ----------
  const SPEC = {
    plano: d => dibujar(d),
    vista: d => vistaDe(d),
    // Volver a la vista de partida solo si cambia la caja de fondo (otro marco) o la vista pedida, no en cada bloque.
    clave: d => JSON.stringify([d.marco ? [d.marco.w, d.marco.h, d.marco.d] : null, d.vista || null]),
    distancia: 9, distMin: 4.5, distMax: 16,
    construir(T, grupo, d, e, h) {
      revisar(d);
      const en = encuadre(d), hu = d.hueco === undefined ? 0.1 : d.hueco, n = cuenta(d), tinta = h.varCss('--ink', '#2d2340');
      const caja = new T.BoxGeometry(1, 1, 1), m4 = new T.Matrix4(), q = new T.Quaternion(), tocables = [];
      const aristas = [];
      d.grupos.forEach((g, i) => {
        const bs = d.bloques.filter(b => b.g === i);
        if (!bs.length) return;
        const color = g.color ? h.varCss(`--${g.color}`, HEX[g.color]) : (h.oscuro() ? '#5a5068' : NEUTRO);
        const malla = new T.InstancedMesh(caja, h.material(color, g.color ? {} : { transparent: true, opacity: 0.55 }), bs.length);
        bs.forEach((b, k) => {
          const [w, hh, p] = lados(b), c = en.aEscena(b.x + w / 2, b.y + hh / 2, b.z + p / 2);
          m4.compose(new T.Vector3(...c), q, new T.Vector3((w - hu) * en.s, (p - hu) * en.s, (hh - hu) * en.s));
          malla.setMatrixAt(k, m4);
          if (bs.length * 24 <= 9000) {                                    // aristas de cada bloque (líneas, no triángulos)
            const x0 = (w - hu) * en.s / 2, y0 = (p - hu) * en.s / 2, z0 = (hh - hu) * en.s / 2;
            const v = [];
            for (let s = 0; s < 8; s++) v.push([c[0] + (s & 1 ? x0 : -x0), c[1] + (s & 2 ? y0 : -y0), c[2] + (s & 4 ? z0 : -z0)]);
            for (const [a, bb] of [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]]) aristas.push(...v[a], ...v[bb]);
          }
        });
        malla.userData.dice = g.dice || `${n[i]} ${g.nombre}`;
        grupo.add(malla); tocables.push(malla);
        if (g.rotulo) h.etiqueta(new T.Vector3(...en.aEscena(...puntoRotulo(d, i))), g.rotulo, { color: g.color });
      });
      if (aristas.length) {
        const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(aristas, 3));
        grupo.add(new T.LineSegments(geo, new T.LineBasicMaterial({ color: new T.Color(tinta), transparent: true, opacity: 0.35 })));
      }
      if (d.marco) {
        const m = d.marco, c = en.aEscena(m.x + m.w / 2, m.y + m.h / 2, m.z + m.d / 2);
        const geo = new T.BoxGeometry(m.w * en.s, m.d * en.s, m.h * en.s), col = m.color ? h.varCss(`--${m.color}`, HEX[m.color]) : tinta;
        const lin = new T.LineSegments(new T.EdgesGeometry(geo), new T.LineDashedMaterial({ color: new T.Color(col), dashSize: 0.12, gapSize: 0.08 }));
        lin.computeLineDistances(); lin.position.set(...c); grupo.add(lin);
        const velo = new T.Mesh(geo, new T.MeshBasicMaterial({ color: new T.Color(col), transparent: true, opacity: 0.06, depthWrite: false }));
        velo.position.set(...c); grupo.add(velo);
        if (m.rotulo) h.etiqueta(new T.Vector3(...en.aEscena(m.x + m.w, m.y, m.z + m.d + 0.35)), m.rotulo, { color: m.color });
      }
      for (const m of d.marcas || []) h.etiqueta(new T.Vector3(...en.aEscena(...m.p)), m.texto, { color: m.color });
      return { tocables, aria: alt(d) };
    },
    tocar: o => (o && o.userData && o.userData.dice) || '',
  };
  const montar = (el, op) => Kit.vivo3d.montar(el, SPEC, op);

  return { id: 'ari-cubitos-3d', dibujar, alt, montar, plano, girar, cuenta, MAX };
});
