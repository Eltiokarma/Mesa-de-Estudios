/*
 * Pieza «rm-reloj» (razonamiento matemático; docs/teoria.md, sección 4): una o dos esferas de reloj con el minutero
 * y el horario en su posición exacta (el horario avanza también con los minutos) y, si se pide, el arco del ángulo
 * menor entre las agujas con su rótulo.
 *
 * Afirmación de la figura: el horario nunca se queda quieto sobre la hora: a las 3:30 está a mitad de camino entre el 3 y el 4.
 *
 * datos = {
 *   relojes: [{ h: 3, m: 20, rotulo: '3:20', arco: true, texto: '20°', fantasmaH: null | número, desde, hasta }],   // uno o dos
 * }
 *   h (0–23) y m (0–59, puede llevar decimales) fijan las agujas: minutero 6° por minuto, horario 30° por hora más
 *   0,5° por minuto. texto es el rótulo del arco (lo calcula quien llama). fantasmaH dibuja, discontinuo, un horario
 *   en otra posición (el error de dejarlo fijo sobre la hora).
 * Colores (regla 4): minutero c-o (naranja), horario c-i (turquesa), ángulo c-d (verde).
 * estado = { corte } — se ve lo que tiene desde ≤ corte. El dibujo es una función pura de (datos, estado).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const Kit = nodo ? require('../kit.js') : root.Kit;
  const T = nodo ? require('../trazo.js') : root.Kit.trazo;
  const api = fabrica(Kit, T);
  Kit.registrar(api);
  if (nodo) module.exports = api;
})(typeof self !== 'undefined' ? self : this, function (Kit, T) {
  'use strict';
  const W = 320, ALTO = 232, R1 = 92, R2 = 66;
  const COLOR = { m: 'o', h: 'i', ang: 'd' };
  const angM = m => (m % 60) * 6;
  const angH = (h, m) => ((h % 12) * 30 + m * 0.5) % 360;
  const P = (cx, cy, r, a) => [cx + r * Math.sin(a * Math.PI / 180), cy - r * Math.cos(a * Math.PI / 180)];
  const ve = (x, corte) => (x.desde || 0) <= corte && (x.hasta === undefined || corte <= x.hasta);

  function esfera(cx, cy, R, rel, corte) {
    let s = `<circle cx="${T.n(cx)}" cy="${T.n(cy)}" r="${R}" fill="var(--card)" stroke="currentColor" stroke-width="${T.GROSOR.contorno}"/>`;
    for (let k = 0; k < 60; k++) {
      const [x1, y1] = P(cx, cy, R - (k % 5 ? 4 : 9), k * 6), [x2, y2] = P(cx, cy, R - 1, k * 6);
      s += T.linea(x1, y1, x2, y2, { grosor: T.GROSOR.cuadricula, opacidad: k % 5 ? 0.45 : 1 });
    }
    if (R >= 80) for (let k = 1; k <= 12; k++) { const [x, y] = P(cx, cy, R - 22, k * 30); s += T.rotulo(x, y + 5, String(k), { ancla: 'middle', clase: 'kit-num', tam: 14 }); }
    else for (const k of [12, 3, 6, 9]) { const [x, y] = P(cx, cy, R - 18, k * 30); s += T.rotulo(x, y + 5, String(k), { ancla: 'middle', clase: 'kit-num', tam: 14 }); }
    const am = angM(rel.m || 0), ah = angH(rel.h || 0, rel.m || 0);
    if (rel.arco && ve(rel.arco === true ? {} : rel.arco, corte)) {
      let d = ((am - ah) % 360 + 360) % 360, desde = ah;
      if (d > 180) { d = 360 - d; desde = am; }
      const r = R * 0.42, [x1, y1] = P(cx, cy, r, desde), [x2, y2] = P(cx, cy, r, desde + d);
      s += `<path class="kit-aparece" d="M${T.n(cx)} ${T.n(cy)}L${T.n(x1)} ${T.n(y1)}A${r} ${r} 0 0 1 ${T.n(x2)} ${T.n(y2)}Z" fill="${T.color(COLOR.ang)}" fill-opacity="0.24" stroke="${T.color(COLOR.ang)}" stroke-width="${T.GROSOR.contorno}"/>`;
      if (rel.texto) { const [tx, ty] = P(cx, cy, R * 0.62, desde + d / 2); s += T.rotulo(tx, ty + 6, rel.texto, { color: COLOR.ang, peso: 700, ancla: 'middle' }); }
    }
    if (Number.isFinite(rel.fantasmaH)) {
      const [x, y] = P(cx, cy, R * 0.5, angH(rel.fantasmaH, 0));
      s += `<g class="kit-fantasma">${T.linea(cx, cy, x, y, { color: COLOR.h, grosor: T.GROSOR.variable, discontinua: true })}</g>`;
    }
    const [hx, hy] = P(cx, cy, R * 0.52, ah), [mx, my] = P(cx, cy, R * 0.82, am);
    s += T.linea(cx, cy, hx, hy, { color: COLOR.h, grosor: 6 }) + T.linea(cx, cy, mx, my, { color: COLOR.m, grosor: T.GROSOR.variable });
    s += `<circle cx="${T.n(cx)}" cy="${T.n(cy)}" r="4" fill="currentColor"/>`;
    if (rel.rotulo) s += T.rotulo(cx, cy + R + 22, rel.rotulo, { ancla: 'middle', peso: 700 });
    return s;
  }

  function dibujar(d, e = {}) {
    const corte = e.corte || 0;
    const rs = (d.relojes || []).slice(0, 2);
    let s = '';
    if (rs.length === 1) s += `<g>${esfera(W / 2, 8 + R1, R1, rs[0], corte)}</g>`;
    else rs.forEach((r, k) => { if (ve(r, corte)) s += `<g class="kit-aparece">${esfera(k ? W - 12 - R2 : 12 + R2, 30 + R2, R2, r, corte)}</g>`; });
    return T.svg(W, ALTO, s, { alt: alt(d) });
  }

  const hhmm = r => `${(r.h % 12) || 12}:${String(Math.floor(r.m || 0)).padStart(2, '0')}`;
  function alt(d) {
    const rs = (d.relojes || []).map(r => `reloj que marca ${hhmm(r)}: minutero en ${Kit.formatear(angM(r.m || 0), 1)}°, horario en ${Kit.formatear(angH(r.h || 0, r.m || 0), 1)}° desde las 12${r.arco && r.texto ? `; ángulo menor ${r.texto}` : ''}`);
    return `${rs.join('; ') || 'Reloj sin agujas'}.`;
  }

  return { id: 'rm-reloj', dibujar, alt, angulos: { minutero: angM, horario: angH } };
});
