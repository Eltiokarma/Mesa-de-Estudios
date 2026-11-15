/*
 * Pieza «alg-techo-3d» (15 nov 2026, ronda 4 del 3D, docs/3d.md): la región factible en el piso y, encima de cada
 * punto, un poste tan alto como Z = px + qy en ese punto. Los postes arman un techo plano inclinado. Un plano horizontal
 * a la altura k corta el techo justo en la recta de nivel px + qy = k. Se gira con el dedo.
 *
 * Afirmación de la figura: el máximo de Z es la esquina más alta del techo, y un techo plano siempre tiene su punto más
 * alto en un vértice (o en un lado entero, si queda paralelo a un borde). Los vértices, sus valores de Z y el óptimo los
 * calcula plantillas/programacion-lineal/motor.js (optimizar, con pruebas): la pieza solo dibuja (regla 1).
 *
 * datos = {
 *   restricciones: [[a, b, '<=', c], …],   // con x ≥ 0 e y ≥ 0; la región debe ser acotada
 *   objetivo:      [p, q],                  // Z = px + qy
 *   k:             número,                  // altura del plano de nivel
 *   escalaZ:       número,                  // opcional: altura en la escena por unidad de Z (fija en una mesa, para comparar)
 *   vista:         { giro, inclinacion },   // opcional; sin ella, −35° y 24°
 *   alt,
 * }
 * Colores (regla 4, los de la unidad): la región en c-d; Z, sus postes, el techo y el plano k en c-h.
 *
 * Respaldo (dibujar): piso, postes y techo proyectados desde datos.vista. Se usa mientras carga three.js, sin WebGL 2,
 * en Node (pruebas) y en las miniaturas de la colección.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const Kit = nodo ? require('../kit.js') : root.Kit;
  if (nodo) require('../vivo3d.js');
  // El motor se busca al usarlo: en la app, las piezas y los motores de «requiere» cargan en paralelo.
  const M = nodo ? require('../../../plantillas/programacion-lineal/motor.js') : null;
  const api = fabrica(Kit, () => M || root.MotorProgLineal);
  Kit.registrar(api);
  if (nodo) module.exports = api;
})(typeof self !== 'undefined' ? self : this, function (Kit, motor) {
  'use strict';
  const rad = g => g * Math.PI / 180;
  const f = (n, d = 2) => Kit.formatear(n, d);
  const E = 0.6;
  const vistaDe = d => d.vista || { giro: -35, inclinacion: 24 };
  const optimo = d => motor().optimizar({ restricciones: d.restricciones, noNegativas: true, objetivo: d.objetivo, sentido: 'max' });
  const plana = d => !d.objetivo[0] && !d.objetivo[1];
  // Lo que se dibuja: los vértices en orden con su Z, cuáles son los más altos y la escala de alturas.
  function figura(d) {
    const o = optimo(d), vs = o.tabla.map(t => ({ p: t.punto, z: t.valor, texto: t.texto }));
    const alto = Math.max(...vs.map(v => v.z)), arriba = vs.filter(v => v.z === alto);
    const xs = vs.map(v => v.p[0]), ys = vs.map(v => v.p[1]);
    const c = [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
    return { o, vs, arriba, alto, c, s: d.escalaZ || 2.5 / Math.max(1, Math.abs(alto)) };
  }
  // Punto (x, y) a altura Z → escena (x, alto, −y), centrada en la región y con el piso un poco abajo.
  const escena = (fg, x, y, z) => [(x - fg.c[0]) * E, z * fg.s - 0.5, -(y - fg.c[1]) * E];
  function girar(p, giro, inc) {
    const a = rad(giro || 0), b = rad(inc || 0);
    const x = p[0] * Math.cos(a) + p[2] * Math.sin(a), z = -p[0] * Math.sin(a) + p[2] * Math.cos(a);
    return [x, p[1] * Math.cos(b) - z * Math.sin(b), p[1] * Math.sin(b) + z * Math.cos(b)];
  }
  const zTexto = (p, q) => `Z = ${p ? `${p === 1 ? '' : p === -1 ? '−' : f(p)}x` : ''}${p && q ? ` ${q < 0 ? '−' : '+'} ` : q < 0 ? '−' : ''}${q ? `${Math.abs(q) === 1 ? '' : f(Math.abs(q))}y` : ''}${!p && !q ? '0' : ''}`.replace('-', '−');

  function alt(d) {
    if (d.alt) return d.alt;
    const fg = figura(d), [p, q] = d.objetivo;
    const max = plana(d) ? 'el techo queda en el piso: Z = 0 en toda la región'
      : fg.o.tipo === 'unico' ? `el punto más alto es ${fg.arriba[0].texto}, con Z = ${f(fg.alto)}`
        : `el lado de ${fg.arriba[0].texto} a ${fg.arriba[fg.arriba.length - 1].texto} queda arriba, con Z = ${f(fg.alto)}`;
    const nivel = d.k > fg.alto ? 'pasa por encima del techo' : 'corta el techo en la recta de nivel';
    return `Región de vértices ${fg.vs.map(v => v.texto).join(', ')} con ${zTexto(p, q)} como techo: ${max}. El plano k = ${f(d.k)} ${nivel}.`;
  }

  // ---------- Respaldo plano ----------
  function plano(d) {
    const v = vistaDe(d), W = 320, H = 260, fg = figura(d);
    const g3 = (x, y, z) => girar(escena(fg, x, y, z), v.giro, v.inclinacion);
    const todos = fg.vs.flatMap(w => [g3(w.p[0], w.p[1], 0), g3(w.p[0], w.p[1], w.z)]);
    const r = Math.max(1.5, ...todos.map(q => Math.hypot(q[0], q[1])));
    const PX = 118 / r, p2 = q => [W / 2 + q[0] * PX, H / 2 - q[1] * PX];
    return {
      W, H,
      piso: fg.vs.map(w => p2(g3(w.p[0], w.p[1], 0))),
      techo: fg.vs.map(w => p2(g3(w.p[0], w.p[1], w.z))),
      postes: fg.vs.map(w => ({ de: p2(g3(w.p[0], w.p[1], 0)), a: p2(g3(w.p[0], w.p[1], w.z)), arriba: fg.arriba.includes(w) && !plana(d) })),
    };
  }
  function dibujar(d) {
    const pl = plano(d), n = x => Math.round(x * 100) / 100, pts = l => l.map(q => `${n(q[0])},${n(q[1])}`).join(' ');
    const postes = pl.postes.map(p => `<line x1="${n(p.de[0])}" y1="${n(p.de[1])}" x2="${n(p.a[0])}" y2="${n(p.a[1])}" stroke="var(--c-h)" stroke-width="${p.arriba ? 4 : 2}" stroke-linecap="round"/>${p.arriba ? `<circle cx="${n(p.a[0])}" cy="${n(p.a[1])}" r="5" fill="var(--c-h)"/>` : ''}`).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${pl.W} ${pl.H}" width="${pl.W}" height="${pl.H}" role="img" aria-label="${alt(d).replace(/"/g, '&quot;')} Vista plana." class="kit-svg" font-family="inherit">`
      + `<polygon class="kit-region" points="${pts(pl.piso)}" fill="var(--c-d)" fill-opacity="0.35" stroke="var(--c-d)" stroke-width="2" stroke-linejoin="round"/>${postes}`
      + `<polygon class="kit-techo" points="${pts(pl.techo)}" fill="var(--c-h)" fill-opacity="0.22" stroke="var(--c-h)" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
  }

  // ---------- En vivo: la escena sobre la base común (nucleo/kit/vivo3d.js) ----------
  const SPEC = {
    plano: d => dibujar(d),
    vista: d => vistaDe(d),
    clave: d => JSON.stringify([d.restricciones, d.vista || null]),
    distancia: 8.5, distMin: 4.5, distMax: 14,
    tocar: o => (o && o.userData && o.userData.dice) || '',
    construir(T, grupo, d, e, h) {
      const fg = figura(d), tinta = h.varCss('--ink', '#2d2340'), cd = h.varCss('--c-d', '#2e7d32'), ch = h.varCss('--c-h', '#c2185b');
      const V = (x, y, z) => new T.Vector3(...escena(fg, x, y, z)), tocables = [];
      const poligono = (pts, color, opac) => {
        const c = pts.reduce((a, q) => a.map((x, i) => x + q[i] / pts.length), [0, 0, 0]), pos = [];
        for (let i = 0; i < pts.length; i++) pos.push(...c, ...pts[i], ...pts[(i + 1) % pts.length]);
        const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.computeVertexNormals();
        const m = new T.Mesh(g, h.material(color, { transparent: true, opacity: opac, side: T.DoubleSide, depthWrite: false }));
        const b = new T.BufferGeometry(); b.setAttribute('position', new T.Float32BufferAttribute(pts.concat([pts[0]]).flat(), 3));
        grupo.add(m, new T.Line(b, new T.LineBasicMaterial({ color: new T.Color(color) })));
        return m;
      };
      // Ejes x e y en el piso, tenues.
      const xMax = Math.max(...fg.vs.map(w => w.p[0])) + 1, yMax = Math.max(...fg.vs.map(w => w.p[1])) + 1;
      const ge = new T.BufferGeometry(); ge.setAttribute('position', new T.Float32BufferAttribute([...V(0, 0, 0).toArray(), ...V(xMax, 0, 0).toArray(), ...V(0, 0, 0).toArray(), ...V(0, yMax, 0).toArray()], 3));
      grupo.add(new T.LineSegments(ge, new T.LineBasicMaterial({ color: new T.Color(tinta), transparent: true, opacity: 0.45 })));
      h.etiqueta(V(xMax + 0.3, 0, 0), 'x', { letra: true }); h.etiqueta(V(0, yMax + 0.3, 0), 'y', { letra: true });
      const region = poligono(fg.vs.map(w => escena(fg, w.p[0], w.p[1], 0)), cd, 0.4);
      region.userData.dice = `Región factible: vértices ${fg.vs.map(w => w.texto).join(', ')}.`; tocables.push(region);
      if (!plana(d)) {
        const techo = poligono(fg.vs.map(w => escena(fg, w.p[0], w.p[1], w.z)), ch, 0.3);
        techo.userData.dice = `El techo ${zTexto(...d.objetivo)}: es plano, por eso su punto más alto es una esquina.`; tocables.push(techo);
      }
      for (const w of fg.vs) {
        const arriba = fg.arriba.includes(w) && !plana(d);
        if (Math.abs(w.z) > 1e-9) {
          const b = h.barra(V(w.p[0], w.p[1], 0), V(w.p[0], w.p[1], w.z), arriba ? 0.05 : 0.025, ch);
          b.userData.dice = `En ${w.texto}, Z = ${f(w.z)}.`; grupo.add(b); tocables.push(b);
        }
        if (arriba) {
          const s = new T.Mesh(new T.SphereGeometry(0.1, h.SEG, h.SEG / 2), h.material(ch));
          s.position.copy(V(w.p[0], w.p[1], w.z)); s.userData.dice = `Lo más alto: Z = ${f(w.z)} en ${w.texto}.`; grupo.add(s); tocables.push(s);
        }
      }
      if (!plana(d)) h.etiqueta(V(fg.arriba[0].p[0], fg.arriba[0].p[1], fg.alto).add(new T.Vector3(0, 0.32, 0)), `Z máx = ${f(fg.alto)}`, { color: 'c-h' });
      // El plano de nivel k: horizontal; donde corta al techo está la recta px + qy = k.
      const lados = [[-0.5, -0.5], [xMax, -0.5], [xMax, yMax], [-0.5, yMax]].map(([x, y]) => escena(fg, x, y, d.k));
      poligono(lados, tinta, 0.07);
      h.etiqueta(new T.Vector3(...lados[3]), `k = ${f(d.k)}`, { color: 'c-h' });
      return { tocables, aria: alt(d) };
    },
  };
  const montar = (el, op) => Kit.vivo3d.montar(el, SPEC, op);

  return { id: 'alg-techo-3d', dibujar, alt, montar, plano, girar, figura, optimo, zTexto };
});
