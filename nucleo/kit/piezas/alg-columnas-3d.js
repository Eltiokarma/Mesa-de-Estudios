/*
 * Pieza «alg-columnas-3d» (15 nov 2026, ronda 4 del 3D, docs/3d.md): las tres columnas u, v y w de una matriz de
 * 3 × 3 como flechas desde el origen, y la caja inclinada (paralelepípedo) que arman. Se gira con el dedo.
 *
 * Afirmación de la figura: el determinante de 3 × 3 es el volumen con signo de esa caja. Si las tres flechas caen en
 * un mismo plano, la caja se aplasta y det = 0; si w cruza al otro lado del plano de u y v, el signo cambia. El
 * determinante lo calcula plantillas/matrices/motor.js (det3, con pruebas), no la pieza (regla 1); la pieza solo suma
 * las flechas para ubicar las esquinas. Girar no cambia la caja.
 *
 * datos = {
 *   u, v, w: [x, y, z],              // las columnas de A, con z hacia arriba
 *   vista:   { giro, inclinacion },  // opcional; sin ella, −30° y 22°
 *   alt,
 * }
 * Colores (regla 4): u en c-o, v en c-i, w en c-d; la caja, en el tono de la marca.
 *
 * Respaldo (dibujar): la caja y las flechas proyectadas en el plano desde datos.vista. Se usa mientras carga
 * three.js, sin WebGL 2, en Node (pruebas) y en las miniaturas de la colección.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const Kit = nodo ? require('../kit.js') : root.Kit;
  if (nodo) require('../vivo3d.js');
  // El motor se busca al usarlo: en la app, las piezas y los motores de «requiere» cargan en paralelo.
  const M = nodo ? require('../../../plantillas/matrices/motor.js') : null;
  const api = fabrica(Kit, () => M || root.MotorMatrices);
  Kit.registrar(api);
  if (nodo) module.exports = api;
})(typeof self !== 'undefined' ? self : this, function (Kit, motor) {
  'use strict';
  const rad = g => g * Math.PI / 180;
  const f = (n, d = 2) => Kit.formatear(n, d);
  const E = 0.8;
  const COLOR = { u: 'c-o', v: 'c-i', w: 'c-d' };
  const vistaDe = d => d.vista || { giro: -30, inclinacion: 22 };
  const matriz = d => [0, 1, 2].map(i => [d.u[i], d.v[i], d.w[i]]);      // las flechas son las columnas
  const det = d => motor().det3({ M: matriz(d) }).valor;
  const suma = (...vs) => [0, 1, 2].map(i => vs.reduce((s, x) => s + x[i], 0));
  // Esquina k de la caja: el bit 0 suma u, el 1 suma v y el 2 suma w.
  const esquinas = d => Array.from({ length: 8 }, (_, k) => suma([0, 0, 0], k & 1 ? d.u : [0, 0, 0], k & 2 ? d.v : [0, 0, 0], k & 4 ? d.w : [0, 0, 0]));
  const CARAS = [[0, 1, 3, 2], [4, 5, 7, 6], [0, 1, 5, 4], [2, 3, 7, 6], [0, 2, 6, 4], [1, 3, 7, 5]];
  const ARISTAS = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
  // Matemática (x, y, z con z hacia arriba) → escena (x, alto, −y): un giro, conserva el signo del volumen.
  const centro = d => suma(d.u, d.v, d.w).map(x => x / 2);
  const escena = (d, p) => { const c = centro(d); return [(p[0] - c[0]) * E, (p[2] - c[2]) * E, -(p[1] - c[1]) * E]; };
  function girar(p, giro, inc) {
    const a = rad(giro || 0), b = rad(inc || 0);
    const x = p[0] * Math.cos(a) + p[2] * Math.sin(a), z = -p[0] * Math.sin(a) + p[2] * Math.cos(a);
    return [x, p[1] * Math.cos(b) - z * Math.sin(b), p[1] * Math.sin(b) + z * Math.cos(b)];
  }
  const vec = p => `(${p.map(x => f(x)).join('; ')})`;

  function alt(d) {
    if (d.alt) return d.alt;
    const D = det(d);
    const caja = D === 0 ? 'la caja queda aplastada en un plano: volumen 0' : `arman una caja inclinada de volumen ${f(Math.abs(D))}`;
    return `Columnas u = ${vec(d.u)}, v = ${vec(d.v)} y w = ${vec(d.w)}: ${caja}; det A = ${f(D)}.`;
  }

  // ---------- Respaldo plano ----------
  function plano(d) {
    const v = vistaDe(d), W = 320, H = 260, es = esquinas(d);
    const alcance = Math.max(2, ...es.map(p => Math.hypot(...escena(d, p))));
    const PX = 112 / alcance;
    const p2 = p => { const g = girar(escena(d, p), v.giro, v.inclinacion); return [W / 2 + g[0] * PX, H / 2 - g[1] * PX, g[2]]; };
    const pts = es.map(p2);
    const caras = CARAS.map(c => ({ puntos: c.map(k => pts[k]), prof: c.reduce((s, k) => s + pts[k][2], 0) / 4 })).sort((a, b) => a.prof - b.prof);
    const flechas = ['u', 'v', 'w'].map(n => ({ n, de: pts[0], a: p2(d[n]) }));
    return { caras, aristas: ARISTAS.map(([i, j]) => [pts[i], pts[j]]), flechas, W, H };
  }
  function dibujar(d) {
    const pl = plano(d), n = x => Math.round(x * 100) / 100;
    const caras = pl.caras.map(c => `<polygon points="${c.puntos.map(q => `${n(q[0])},${n(q[1])}`).join(' ')}" fill="var(--brand, #7f5ae0)" fill-opacity="0.1"/>`).join('');
    const aristas = pl.aristas.map(([a, b]) => `<line x1="${n(a[0])}" y1="${n(a[1])}" x2="${n(b[0])}" y2="${n(b[1])}" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.4"/>`).join('');
    const flechas = pl.flechas.map(fl => {
      const [x1, y1] = fl.de, [x2, y2] = fl.a, L = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / L, uy = (y2 - y1) / L, t = 9;
      const punta = `${n(x2)},${n(y2)} ${n(x2 - t * ux - t * 0.5 * uy)},${n(y2 - t * uy + t * 0.5 * ux)} ${n(x2 - t * ux + t * 0.5 * uy)},${n(y2 - t * uy - t * 0.5 * ux)}`;
      return `<g class="kit-flecha" style="color:var(--${COLOR[fl.n]})"><line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2 - t * ux)}" y2="${n(y2 - t * uy)}" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><polygon points="${punta}" fill="currentColor"/></g>`;
    }).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${pl.W} ${pl.H}" width="${pl.W}" height="${pl.H}" role="img" aria-label="${alt(d).replace(/"/g, '&quot;')} Vista plana." class="kit-svg" font-family="inherit"><g class="kit-caja">${caras}${aristas}</g>${flechas}</svg>`;
  }

  // ---------- En vivo: la escena sobre la base común (nucleo/kit/vivo3d.js) ----------
  const SPEC = {
    plano: d => dibujar(d),
    vista: d => vistaDe(d),
    clave: d => JSON.stringify(d.vista || null),
    distancia: 9, distMin: 4.5, distMax: 15,
    tocar: o => (o && o.userData && o.userData.dice) || '',
    construir(T, grupo, d, e, h) {
      const tinta = h.varCss('--ink', '#2d2340'), marca = h.varCss('--brand', '#7f5ae0'), es = esquinas(d);
      const V = p => new T.Vector3(...escena(d, p)), D = det(d), tocables = [];
      // Los tres ejes, tenues: dan el piso contra el que se ve si w sube o baja.
      const ejes = [];
      for (const k of [0, 1, 2]) { const a = [0, 0, 0], b = [0, 0, 0]; a[k] = -0.5; b[k] = 3.5; ejes.push(...V(a).toArray(), ...V(b).toArray()); }
      const ge = new T.BufferGeometry(); ge.setAttribute('position', new T.Float32BufferAttribute(ejes, 3));
      grupo.add(new T.LineSegments(ge, new T.LineBasicMaterial({ color: new T.Color(tinta), transparent: true, opacity: 0.3 })));
      // El piso (z = 0), donde viven u y v: deja ver de qué lado queda la punta de w.
      const piso = [[-2.5, -1], [4, -1], [4, 3.5], [-2.5, 3.5]].map(([x, y]) => escena(d, [x, y, 0]));
      const gp = new T.BufferGeometry(); gp.setAttribute('position', new T.Float32BufferAttribute([0, 1, 2, 0, 2, 3].flatMap(k => piso[k]), 3));
      grupo.add(new T.Mesh(gp, new T.MeshBasicMaterial({ color: new T.Color(tinta), transparent: true, opacity: 0.06, side: T.DoubleSide, depthWrite: false })));
      // La caja: seis caras translúcidas y sus doce aristas.
      const pos = [];
      for (const c of CARAS) for (const k of [0, 1, 2, 0, 2, 3]) pos.push(...escena(d, es[c[k]]));
      const gc = new T.BufferGeometry(); gc.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); gc.computeVertexNormals();
      const caja = new T.Mesh(gc, h.material(marca, { transparent: true, opacity: 0.18, side: T.DoubleSide, depthWrite: false }));
      caja.userData.dice = D === 0 ? 'Caja aplastada: volumen 0, det A = 0.' : `Caja de volumen ${f(Math.abs(D))}; det A = ${f(D)}.`;
      grupo.add(caja); tocables.push(caja);
      const ar = [];
      for (const [i, j] of ARISTAS) ar.push(...escena(d, es[i]), ...escena(d, es[j]));
      const ga = new T.BufferGeometry(); ga.setAttribute('position', new T.Float32BufferAttribute(ar, 3));
      grupo.add(new T.LineSegments(ga, new T.LineBasicMaterial({ color: new T.Color(tinta), transparent: true, opacity: 0.6 })));
      // Las tres columnas, como flechas desde el origen, con su nombre en la punta.
      for (const nom of ['u', 'v', 'w']) {
        const p = d[nom];
        if (Math.hypot(...p) < 1e-9) continue;
        const fl = h.flecha(V([0, 0, 0]), V(p), 0.05, h.varCss(`--${COLOR[nom]}`, '#888'));
        fl.userData.dice = `Columna ${nom} = ${vec(p)}.`;
        grupo.add(fl); tocables.push(fl);
        const u = Math.hypot(...p), fuera = p.map(x => x * (1 + 0.45 / u));
        h.etiqueta(V(fuera), nom, { color: COLOR[nom], letra: true });
      }
      return { tocables, aria: alt(d) };
    },
  };
  const montar = (el, op) => Kit.vivo3d.montar(el, SPEC, op);

  return { id: 'alg-columnas-3d', dibujar, alt, montar, plano, girar, det, esquinas };
});
