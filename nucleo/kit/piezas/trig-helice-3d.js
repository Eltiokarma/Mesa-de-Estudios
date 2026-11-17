/*
 * Pieza «trig-helice-3d» (15 nov 2026, ronda 4 del 3D, docs/3d.md): un punto P que gira en una circunferencia mientras
 * avanza por un eje deja una hélice. Su sombra en la pared del fondo es la onda y = A sen Bx; la del piso, A cos Bx.
 * Se gira con el dedo: de frente se ve la circunferencia; de costado, la onda. La usa la mesa «La hélice y su sombra»
 * de trigonometria.funciones-trigonometricas.
 *
 * Afirmación de la figura: la onda seno es la circunferencia trigonométrica estirada a lo largo del eje; una vuelta de
 * P es un periodo. Los puntos, el periodo y P los calcula plantillas/circunferencia-trig/motor.js (helice, con
 * pruebas), no la pieza (regla 1). Girar no cambia la hélice.
 *
 * datos = { A, B, g, vista?, alt? }      // radio (amplitud), vueltas por cada 360° de avance, y dónde está P (grados de x)
 * estado = { piso: true|false }          // la sombra del piso, en tinta discontinua (por defecto, a la vista)
 *
 * Colores (regla 4, los de la unidad): la onda y su amplitud A en rojo (c-h), la x de P en naranja (c-o), el periodo
 * T en verde (c-d). La hélice va en el tono de la marca y la sombra del piso, en tinta discontinua (curva de referencia).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const Kit = nodo ? require('../kit.js') : root.Kit;
  if (nodo) require('../vivo3d.js');
  const M = nodo ? require('../../../plantillas/circunferencia-trig/motor.js') : root.MotorCircTrig;
  const api = fabrica(Kit, M);
  Kit.registrar(api);
  if (nodo) module.exports = api;
})(typeof self !== 'undefined' ? self : this, function (Kit, M) {
  'use strict';
  const rad = g => g * Math.PI / 180;
  const f = (n, d = 2) => Kit.formatear(n, d);
  const HASTA = 720, LARGO = 5.2, ESC = 0.55;          // tramo de x (grados), su largo en la escena y escala de A
  const vistaDe = d => d.vista || { giro: -28, inclinacion: 16 };
  function girar(p, giro, inc) {
    const a = rad(giro || 0), b = rad(inc || 0);
    const x = p[0] * Math.cos(a) + p[2] * Math.sin(a), z = -p[0] * Math.sin(a) + p[2] * Math.cos(a);
    return [x, p[1] * Math.cos(b) - z * Math.sin(b), p[1] * Math.sin(b) + z * Math.cos(b)];
  }
  // Geometría común: x de la escena a lo largo del eje; y = alto; z = fondo (hacia quien mira). Pared en z = −MURO.
  const MURO = 2 * ESC + 0.45, PISO = -(2 * ESC + 0.45);
  function escena(d) {
    const r = M.helice({ A: d.A, B: d.B, g: d.g, hasta: HASTA, n: 360 });
    const X = x => (x / HASTA - 0.5) * LARGO;
    const P = [X(r.P.g), r.P.alto * ESC, r.P.fondo * ESC];
    return {
      r, X, P,
      helice: r.puntos.map(p => [X(p[0]), p[1] * ESC, p[2] * ESC]),
      pared: r.puntos.map(p => [X(p[0]), p[1] * ESC, -MURO]),
      piso: r.puntos.map(p => [X(p[0]), PISO, p[2] * ESC]),
      sombraP: [P[0], P[1], -MURO],
    };
  }

  function alt(d) {
    if (d.alt) return d.alt;
    const r = M.helice({ A: d.A, B: d.B, g: d.g, hasta: HASTA });
    return `Hélice de radio ${f(d.A)} que da ${f(r.vueltas)} vueltas en 720°: su sombra en la pared es y = ${f(d.A)} sen ${f(d.B)}x, con periodo ${f(r.T)}°. P, en x = ${d.g}°, está a la altura ${f(r.P.alto)}.`;
  }

  // ---------- Respaldo plano ----------
  function plano(d) {
    const v = vistaDe(d), e = escena(d), E = 54, W = 320, H = 240;
    const p2 = p => { const q = girar(p, v.giro, v.inclinacion); return [W / 2 + q[0] * E, H / 2 - q[1] * E]; };
    return { e, p2, W, H };
  }
  function dibujar(d, estado) {
    const st = estado || {}, { e, p2, W, H } = plano(d), n = x => Math.round(x * 10) / 10;
    const poli = (l, color, ancho, extra = '') => `<polyline points="${l.map(p2).map(p => `${n(p[0])},${n(p[1])}`).join(' ')}" fill="none" stroke="${color}" stroke-width="${ancho}" stroke-linejoin="round"${extra}/>`;
    const L = LARGO / 2, partes = [];
    partes.push(`<polygon points="${[[-L, PISO, -MURO], [L, PISO, -MURO], [L, -PISO, -MURO], [-L, -PISO, -MURO]].map(p2).map(p => `${n(p[0])},${n(p[1])}`).join(' ')}" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.3"/>`);
    partes.push(poli(e.pared, 'var(--c-h, #c0392b)', 3));
    if (st.piso !== false) partes.push(poli(e.piso, 'currentColor', 1.5, ' stroke-dasharray="5 4" stroke-opacity="0.6"'));
    partes.push(poli(e.helice, 'var(--brand, #7f5ae0)', 2.4));
    const P = p2(e.P), S = p2(e.sombraP);
    partes.push(`<line x1="${n(P[0])}" y1="${n(P[1])}" x2="${n(S[0])}" y2="${n(S[1])}" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 3"/>`);
    partes.push(`<circle cx="${n(P[0])}" cy="${n(P[1])}" r="6" fill="var(--c-o, #a95300)"/><circle cx="${n(S[0])}" cy="${n(S[1])}" r="4.5" fill="var(--c-h, #c0392b)"/>`);
    const t0 = p2([e.X(0), PISO + 0.12, -MURO]), t1 = p2([e.X(Math.min(HASTA, e.r.T)), PISO + 0.12, -MURO]);
    partes.push(`<line x1="${n(t0[0])}" y1="${n(t0[1])}" x2="${n(t1[0])}" y2="${n(t1[1])}" stroke="var(--c-d, #2e8b3d)" stroke-width="4" stroke-linecap="round"/>`);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${alt(d).replace(/"/g, '&quot;')} Vista plana." class="kit-svg" font-family="inherit">${partes.join('')}</svg>`;
  }

  // ---------- En vivo, sobre la base común (nucleo/kit/vivo3d.js) ----------
  const SPEC = {
    plano: (d, e) => dibujar(d, e),
    vista: d => vistaDe(d),
    clave: d => JSON.stringify(d.vista || null),
    distancia: 12.5, distMin: 5, distMax: 18,
    construir(T, grupo, d, st, h) {
      const e = escena(d), col = (n, x) => h.varCss(`--c-${n}`, x), tinta = h.varCss('--ink', '#2d2340'), marca = h.varCss('--brand', '#7f5ae0');
      const V = p => new T.Vector3(p[0], p[1], p[2]), L = LARGO / 2;
      const tubo = (pts, r, color) => new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts.map(V)), Math.min(360, pts.length), r, 6, false), h.material(color));
      // Pared del fondo y piso, tenues.
      const pared = new T.Mesh(new T.PlaneGeometry(LARGO + 0.4, -2 * PISO), h.material(h.oscuro() ? '#3a2f48' : '#f6efe8', { transparent: true, opacity: 0.7, side: T.DoubleSide }));
      pared.position.set(0, 0, -MURO - 0.01); grupo.add(pared);
      if (st.piso !== false) {
        const piso = new T.Mesh(new T.PlaneGeometry(LARGO + 0.4, 2 * MURO), h.material(h.oscuro() ? '#33293f' : '#efe6dc', { transparent: true, opacity: 0.6, side: T.DoubleSide }));
        piso.rotation.x = -Math.PI / 2; piso.position.set(0, PISO - 0.01, 0); grupo.add(piso);
        const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(e.piso.flat(), 3));
        const lin = new T.Line(g, new T.LineDashedMaterial({ color: new T.Color(tinta), dashSize: 0.08, gapSize: 0.06 })); lin.computeLineDistances(); grupo.add(lin);
      }
      // El eje por donde avanza P.
      const eje = new T.BufferGeometry(); eje.setAttribute('position', new T.Float32BufferAttribute([-L - 0.2, 0, 0, L + 0.2, 0, 0], 3));
      const ejeL = new T.Line(eje, new T.LineDashedMaterial({ color: new T.Color(tinta), dashSize: 0.1, gapSize: 0.08 })); ejeL.computeLineDistances(); grupo.add(ejeL);
      // La hélice (marca) y su sombra en la pared: la onda (c-h).
      grupo.add(tubo(e.helice, 0.035, marca));
      grupo.add(tubo(e.pared, 0.03, col('h', '#c0392b')));
      // P (c-o), su sombra en la onda y la línea que las une.
      const P = new T.Mesh(new T.SphereGeometry(0.1, h.SEG, h.SEG / 2), h.material(col('o', '#a95300'))); P.position.copy(V(e.P)); grupo.add(P);
      const S = new T.Mesh(new T.SphereGeometry(0.075, h.SEG, h.SEG / 2), h.material(col('h', '#c0392b'))); S.position.copy(V(e.sombraP)); grupo.add(S);
      const ls = new T.BufferGeometry(); ls.setAttribute('position', new T.Float32BufferAttribute([...e.P, ...e.sombraP], 3));
      const lsL = new T.Line(ls, new T.LineDashedMaterial({ color: new T.Color(tinta), dashSize: 0.06, gapSize: 0.05 })); lsL.computeLineDistances(); grupo.add(lsL);
      // La llave del periodo T (c-d), al pie de la pared.
      const tf = Math.min(HASTA, e.r.T);
      grupo.add(h.barra(V([e.X(0), PISO + 0.12, -MURO + 0.02]), V([e.X(tf), PISO + 0.12, -MURO + 0.02]), 0.03, col('d', '#2e8b3d')));
      h.etiqueta(V([e.X(tf / 2), PISO + 0.32, -MURO]), 'T', { color: 'c-d', letra: true });
      h.etiqueta(V(e.P).add(new T.Vector3(0, 0.28, 0)), 'P', { color: 'c-o', letra: true });
      h.etiqueta(V([e.X(HASTA) - 0.35, -PISO + 0.2, -MURO]), 'A sen Bx', { color: 'c-h' });
      return { aria: alt(d) };
    },
  };
  const montar = (el, op) => Kit.vivo3d.montar(el, SPEC, op);

  return { id: 'trig-helice-3d', dibujar, alt, montar, plano, girar, escena };
});
