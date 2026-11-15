/*
 * Pieza «trig-campo-3d» (15 nov 2026, ronda 4 del 3D, docs/3d.md): una torre de pie sobre un piso plano y dos o más
 * observadores ubicados por su rumbo y su distancia al pie. Se gira con el dedo. La usan las mesas 3D de
 * trigonometria.triangulos-rectangulos («La torre y dos miradas») y trigonometria.triangulos-oblicuangulos
 * («Dos rumbos y la torre»).
 *
 * Afirmación de la figura: cada mirada forma un triángulo rectángulo vertical con la torre; los observadores y el pie
 * forman otro triángulo, acostado en el piso. Elevaciones, rumbos y la distancia AB los calcula el motor
 * plantillas/trig-angulos-verticales/motor.js (MotorCampo, con pruebas), no la pieza (regla 1).
 *
 * datos = {
 *   h, ojo?,                                   // altura de la torre y del ojo (m)
 *   obs: [{ id: 'A', az, d, ang: 'α' }],        // acimut desde el norte (grados), distancia al pie y nombre de su elevación
 *   par?: true,                                // la distancia entre los dos primeros observadores, en el piso
 *   pie?: true,                                // el ángulo en el pie entre los dos primeros
 *   vista?: { giro, inclinacion },
 *   alt?,
 * }
 * estado = { visuales: true|false }             // las visuales y sus arcos (por defecto, a la vista)
 *
 * Colores (regla 4, los de la unidad): la altura h en rojo (c-h), cada distancia al pie en turquesa (c-i), cada
 * visual en verde (c-d), los ángulos en naranja (c-o) y la distancia AB en morado (c-f). Los rótulos son HTML.
 *
 * Respaldo (dibujar): la misma escena proyectada desde datos.vista. Se usa mientras carga three.js, sin WebGL 2, en
 * Node (pruebas) y en las miniaturas de la colección.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const Kit = nodo ? require('../kit.js') : root.Kit;
  if (nodo) require('../vivo3d.js');
  const M = nodo ? require('../../../plantillas/trig-angulos-verticales/motor.js') : root.MotorCampo;
  const api = fabrica(Kit, M);
  Kit.registrar(api);
  if (nodo) module.exports = api;
})(typeof self !== 'undefined' ? self : this, function (Kit, M) {
  'use strict';
  const rad = g => g * Math.PI / 180;
  const f = (n, d = 1) => Kit.formatear(n, d);
  const vistaDe = d => d.vista || { giro: -25, inclinacion: 24 };
  const RADIO = 2.3;                                  // el campo cabe en un círculo de este radio, en unidades de escena

  // Gira un punto [x, y, z] como la base gira el grupo: primero el giro (eje vertical), después la inclinación.
  function girar(p, giro, inc) {
    const a = rad(giro || 0), b = rad(inc || 0);
    const x = p[0] * Math.cos(a) + p[2] * Math.sin(a), z = -p[0] * Math.sin(a) + p[2] * Math.cos(a);
    return [x, p[1] * Math.cos(b) - z * Math.sin(b), p[1] * Math.sin(b) + z * Math.cos(b)];
  }

  // Geometría de la escena (la comparten el 3D y el respaldo): x al este, y arriba, z al sur (el norte queda al fondo).
  function escena(d) {
    const c = M.campo({ h: d.h, ojo: d.ojo || 0, obs: d.obs });
    const k = RADIO / Math.max(d.h * 0.95, ...d.obs.map(o => o.d));
    const ojo = (c.ojo || 0) * k, punta = [0, c.h * k, 0];
    const obs = c.obs.map((o, i) => ({
      ...o, ang: d.obs[i].ang || '', pie: [o.este * k, 0, -o.norte * k], ojo: [o.este * k, ojo, -o.norte * k],
    }));
    const borde = k * Math.max(...d.obs.map(o => o.d)) * 1.18 + 0.25;
    return { c, k, punta, obs, borde, par: c.pares[0] };
  }
  // Arco de un ángulo de elevación, en el plano vertical del observador: de la horizontal a la visual.
  function arcoElev(o, punta, r) {
    const hz = [-o.ojo[0], 0, -o.ojo[2]], L = Math.hypot(hz[0], hz[2]) || 1, u = [hz[0] / L, 0, hz[2] / L];
    const e = rad(o.elev), pts = [];
    for (let s = 0; s <= 16; s++) {
      const t = e * s / 16;
      pts.push([o.ojo[0] + r * Math.cos(t) * u[0], o.ojo[1] + r * Math.sin(t), o.ojo[2] + r * Math.cos(t) * u[2]]);
    }
    return pts;
  }
  // Arco del ángulo en el pie, en el piso: del primer observador al segundo, por el lado corto.
  function arcoPie(a, b, r) {
    const ta = Math.atan2(a.pie[2], a.pie[0]);
    let dt = Math.atan2(b.pie[2], b.pie[0]) - ta;
    while (dt > Math.PI) dt -= 2 * Math.PI;
    while (dt < -Math.PI) dt += 2 * Math.PI;
    const pts = [];
    for (let s = 0; s <= 20; s++) { const t = ta + dt * s / 20; pts.push([r * Math.cos(t), 0.01, r * Math.sin(t)]); }
    return pts;
  }
  const medio = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2, (p[2] + q[2]) / 2];

  function alt(d) {
    if (d.alt) return d.alt;
    const e = escena(d);
    const cada = e.obs.map(o => `${o.id}, ${o.rumbo.texto === 'N' || o.rumbo.texto.length === 1 ? `al ${o.rumbo.texto}` : `con rumbo ${o.rumbo.texto}`}, a ${f(o.d)} m del pie: elevación de ${f(o.elev)}°`).join('. ');
    const par = d.par && e.par ? ` ${e.par.de}${e.par.a} mide ${f(e.par.distancia)} m en el piso; ángulo en el pie de ${f(e.par.angulo, 0)}°.` : '';
    return `Torre de ${f(d.h)} m sobre un piso plano. ${cada}.${par}`;
  }

  // ---------- Respaldo plano: la escena proyectada ----------
  function plano(d) {
    const v = vistaDe(d), e = escena(d), E = 52, W = 320, H = 250;
    const p2 = p => { const q = girar(p, v.giro, v.inclinacion); return [W / 2 + q[0] * E, H * 0.62 - q[1] * E]; };
    const piso = [];
    for (let s = 0; s < 48; s++) { const t = s / 48 * 2 * Math.PI; piso.push(p2([e.borde * Math.cos(t), 0, e.borde * Math.sin(t)])); }
    return { e, p2, piso, W, H };
  }
  function dibujar(d, estado) {
    const st = estado || {}, pl = plano(d), { e, p2 } = pl, n = x => Math.round(x * 10) / 10;
    const lin = (a, b, color, ancho, extra = '') => { const p = p2(a), q = p2(b); return `<line x1="${n(p[0])}" y1="${n(p[1])}" x2="${n(q[0])}" y2="${n(q[1])}" stroke="${color}" stroke-width="${ancho}" stroke-linecap="round"${extra}/>`; };
    const poli = (pts, color, ancho) => `<polyline points="${pts.map(p2).map(p => `${n(p[0])},${n(p[1])}`).join(' ')}" fill="none" stroke="${color}" stroke-width="${ancho}"/>`;
    const txt = (p, t, color) => { const q = p2(p); return `<text x="${n(q[0])}" y="${n(q[1])}" fill="${color}" font-size="15" font-weight="700" text-anchor="middle" dominant-baseline="middle">${t}</text>`; };
    const C = { h: 'var(--c-h, #c0392b)', i: 'var(--c-i, #0f8b8d)', d: 'var(--c-d, #2e8b3d)', o: 'var(--c-o, #b85a06)', f: 'var(--c-f, #7f5ae0)' };
    const partes = [`<polygon points="${pl.piso.map(p => `${n(p[0])},${n(p[1])}`).join(' ')}" fill="currentColor" fill-opacity="0.06" stroke="currentColor" stroke-opacity="0.35"/>`];
    const B = e.borde;
    partes.push(lin([0, 0, -B], [0, 0, B], 'currentColor', 1, ' stroke-opacity="0.35" stroke-dasharray="4 4"'), lin([-B, 0, 0], [B, 0, 0], 'currentColor', 1, ' stroke-opacity="0.35" stroke-dasharray="4 4"'));
    partes.push(txt([0, 0, -B - 0.25], 'N', 'currentColor'));
    for (const o of e.obs) partes.push(lin([0, 0, 0], o.pie, C.i, 3));
    if (d.par && e.obs.length > 1) partes.push(lin(e.obs[0].pie, e.obs[1].pie, C.f, 3, ' stroke-dasharray="7 5"'));
    if (d.pie && e.obs.length > 1) partes.push(poli(arcoPie(e.obs[0], e.obs[1], 0.45), C.o, 2.2));
    partes.push(lin([0, 0, 0], e.punta, C.h, 6));
    if (st.visuales !== false) for (const o of e.obs) {
      partes.push(lin(o.ojo, e.punta, C.d, 2.4));
      partes.push(poli(arcoElev(o, e.punta, 0.55), C.o, 2.4));
    }
    for (const o of e.obs) { const p = p2(o.pie); partes.push(`<circle cx="${n(p[0])}" cy="${n(p[1])}" r="5" fill="currentColor"/>`); }
    for (const o of e.obs) partes.push(txt([o.pie[0] * 1.13, 0, o.pie[2] * 1.13 + 0.05], o.id, 'currentColor'));
    partes.push(txt([0.25, e.punta[1] / 2, 0], 'h', C.h));
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${pl.W} ${pl.H}" width="${pl.W}" height="${pl.H}" role="img" aria-label="${alt(d).replace(/"/g, '&quot;')} Vista plana." class="kit-svg" font-family="inherit">${partes.join('')}</svg>`;
  }

  // ---------- En vivo, sobre la base común (nucleo/kit/vivo3d.js) ----------
  const V = (T, p) => new T.Vector3(p[0], p[1], p[2]);
  const SPEC = {
    plano: (d, e) => dibujar(d, e),
    vista: d => vistaDe(d),
    clave: d => JSON.stringify([d.obs.length, d.vista || null]),
    distancia: 11.5, distMin: 5, distMax: 18,
    tocar: o => (o && o.userData && o.userData.dice) || '',
    construir(T, grupo, d, st, h) {
      const e = escena(d), col = n => h.varCss(`--c-${n}`, { h: '#c0392b', i: '#0f8b8d', d: '#2e8b3d', o: '#b85a06', f: '#7f5ae0' }[n]);
      const tinta = h.varCss('--ink', '#2d2340'), tocables = [];
      grupo.position.set(0, -0.55, 0);
      // El piso: un disco claro con las líneas norte-sur y este-oeste.
      const piso = new T.Mesh(new T.CircleGeometry(e.borde, h.SEG * 2), h.material(h.oscuro() ? '#3b4a3a' : '#e9f0df', { side: T.DoubleSide }));
      piso.rotation.x = -Math.PI / 2; grupo.add(piso);
      const cruz = new T.BufferGeometry();
      cruz.setAttribute('position', new T.Float32BufferAttribute([0, 0.005, -e.borde, 0, 0.005, e.borde, -e.borde, 0.005, 0, e.borde, 0.005, 0], 3));
      const cruzL = new T.LineSegments(cruz, new T.LineDashedMaterial({ color: new T.Color(tinta), dashSize: 0.12, gapSize: 0.1, transparent: true, opacity: 0.5 }));
      cruzL.computeLineDistances(); grupo.add(cruzL);
      h.etiqueta(new T.Vector3(0, 0, -e.borde - 0.22), 'N');
      h.etiqueta(new T.Vector3(e.borde + 0.22, 0, 0), 'E');
      // La torre, en el color de su altura h.
      const torre = h.barra(V(T, [0, 0, 0]), V(T, e.punta), 0.09, col('h'));
      torre.userData = { dice: `La torre mide ${f(d.h)} m.` }; grupo.add(torre); tocables.push(torre);
      h.etiqueta(V(T, [0.32, e.punta[1] * 0.55, 0]), 'h', { color: 'c-h', letra: true });
      // Cada observador: su distancia al pie (c-i), su visual (c-d) y el arco de su elevación (c-o).
      e.obs.forEach(o => {
        grupo.add(h.barra(V(T, [0, 0.012, 0]), V(T, [o.pie[0], 0.012, o.pie[2]]), 0.03, col('i')));
        const cuerpo = new T.Mesh(new T.SphereGeometry(0.11, h.SEG, h.SEG / 2), h.material(tinta));
        cuerpo.position.set(o.pie[0], 0.11, o.pie[2]);
        cuerpo.userData = { dice: `${o.id}: rumbo ${o.rumbo.texto}, a ${f(o.d)} m del pie; elevación de ${f(o.elev)}°.` };
        grupo.add(cuerpo); tocables.push(cuerpo);
        h.etiqueta(V(T, [o.pie[0] * 1.14, 0.05, o.pie[2] * 1.14]), o.id);
        h.etiqueta(V(T, [o.pie[0] * 0.42, 0.05, o.pie[2] * 0.42]), `${f(o.d)} m`, { color: 'c-i' });
        if (st.visuales !== false) {
          grupo.add(h.barra(V(T, o.ojo), V(T, e.punta), 0.022, col('d')));
          const arco = new T.BufferGeometry();
          arco.setAttribute('position', new T.Float32BufferAttribute(arcoElev(o, e.punta, 0.6).flat(), 3));
          grupo.add(new T.Line(arco, new T.LineBasicMaterial({ color: new T.Color(col('o')) })));
          if (o.ang) { const m = arcoElev(o, e.punta, 1.0)[10]; h.etiqueta(V(T, m), o.ang, { color: 'c-o', letra: true }); }
        }
      });
      // Lo que une a los dos primeros, en el piso: AB (c-f) y el ángulo en el pie (c-o).
      if (e.obs.length > 1) {
        const [a, b] = e.obs;
        if (d.par) {
          grupo.add(h.barra(V(T, [a.pie[0], 0.02, a.pie[2]]), V(T, [b.pie[0], 0.02, b.pie[2]]), 0.03, col('f')));
          h.etiqueta(V(T, medio(a.pie, b.pie)).add(new T.Vector3(0, 0.08, 0)), `${a.id}${b.id}`, { color: 'c-f', letra: true });
        }
        if (d.pie && e.par.angulo > 0.5) {
          const arco = new T.BufferGeometry();
          arco.setAttribute('position', new T.Float32BufferAttribute(arcoPie(a, b, 0.5).flat(), 3));
          grupo.add(new T.Line(arco, new T.LineBasicMaterial({ color: new T.Color(col('o')) })));
        }
      }
      return { tocables, aria: alt(d) };
    },
  };
  const montar = (el, op) => Kit.vivo3d.montar(el, SPEC, op);

  return { id: 'trig-campo-3d', dibujar, alt, montar, plano, girar, escena };
});
