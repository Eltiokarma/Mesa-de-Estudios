/*
 * Pieza «fis-interfaz» (física, óptica geométrica): un rayo que llega a la frontera plana entre dos medios, con la
 * normal punteada, el rayo reflejado y el refractado (o la reflexión total), y los ángulos medidos desde la normal.
 *
 * Afirmación de la figura: los ángulos se miden desde la normal; el reflejado copia al incidente y el refractado se
 * acerca a la normal en el medio de mayor índice.
 *
 * Fidelidad: cada rayo se dibuja con el ángulo exacto que trae (grados desde la normal). El tono de cada medio crece con
 * su índice: el más denso ópticamente se ve más oscuro también en grises.
 *
 * datos = {
 *   n1: 1, n2: 1.33, nombre1: 'aire', nombre2: 'agua',   // medio de arriba (de donde viene el rayo) y de abajo
 *   t1: 40,                    // ángulo de incidencia (grados desde la normal)
 *   t2: 28.9 | null,           // ángulo de refracción; null = reflexión total (no hay rayo refractado)
 *   reflejado: true,           // dibuja el rayo reflejado (si t2 es null, siempre)
 *   tenue: true,               // con refractado, el reflejado va más tenue (parte de la luz)
 *   critico: 48.6 | null,      // un rayo punteado al ángulo crítico (opcional)
 *   rotulos: { t1: 'θ₁ = 40°', t2: 'θ₂ = 28,9°', r: '40°', c: 'θc' },   // los escribe quien llama (regla 1)
 *   colores: { t1: 'o', t2: 'i', r: 'o', c: 'h' },
 * }
 * estado = { paso }: 1 incidente · 2 reflejado · 3 refractado. Sin paso, todo a la vista. Pura.
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
  const W = 320, ALTO = 230, CX = 160, CY = 112, LR = 104;
  const BASE = { t1: 'o', t2: 'i', r: 'o', c: 'h' };
  const rad = g => g * Math.PI / 180;
  // Punto a distancia L del centro con ángulo t desde la normal: arriba-izquierda (incidente), arriba-derecha
  // (reflejado), abajo-derecha (refractado).
  const pto = (t, L, cuadrante) => {
    const sx = cuadrante === 'ai' ? -1 : 1, sy = cuadrante === 'ab' ? 1 : -1;
    return [CX + sx * L * Math.sin(rad(t)), CY + sy * L * Math.cos(rad(t))];
  };
  function arco(t, cuadrante, r, c, texto) {
    const a0 = pto(0, r, cuadrante), a1 = pto(t, r, cuadrante);
    const barre = (cuadrante === 'ai') ? 0 : (cuadrante === 'ab' ? 0 : 1);
    let s = `<path d="M${T.n(a0[0])} ${T.n(a0[1])}A${r} ${r} 0 0 ${barre} ${T.n(a1[0])} ${T.n(a1[1])}" fill="none" stroke="${T.color(c)}" stroke-width="2"/>`;
    if (texto) {
      // Más allá del rayo, del lado contrario a la normal: el texto no cruza ni el rayo ni la normal.
      const m = pto(Math.min(t + 14, 86), r + 26, cuadrante);
      s += T.rotulo(m[0], m[1] + 5, texto, { color: c, peso: 700, ancla: cuadrante === 'ai' ? 'end' : 'start' });
    }
    return s;
  }
  function rayo(x1, y1, x2, y2, c, o = {}) {
    // La flecha va a la mitad del rayo, en el sentido de la luz.
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    return `<g${o.tenue ? ' opacity="0.55"' : ''}>${T.linea(x1, y1, x2, y2, { color: c, grosor: T.GROSOR.variable, discontinua: o.disc })}${T.flecha(x1 + (mx - x1) * 0.8, y1 + (my - y1) * 0.8, mx + (x2 - x1) * 0.04, my + (y2 - y1) * 0.04, { color: c, grosor: T.GROSOR.variable })}</g>`;
  }

  function dibujar(d, estado = {}) {
    const C = Object.assign({}, BASE, d.colores || {}), R = d.rotulos || {};
    const ve = k => !Number.isFinite(estado.paso) || estado.paso >= k;
    const op = n => T.n(Math.min(0.42, 0.06 + 0.2 * Math.max(0, (n || 1) - 1)));
    let s = `<rect x="0" y="0" width="${W}" height="${CY}" fill="currentColor" fill-opacity="${op(d.n1)}"/>`
      + `<rect x="0" y="${CY}" width="${W}" height="${ALTO - CY}" fill="currentColor" fill-opacity="${op(d.n2)}"/>`;
    s += T.linea(0, CY, W, CY, { grosor: T.GROSOR.contorno });
    s += T.linea(CX, CY - 100, CX, CY + 100, { grosor: 1, discontinua: true, opacidad: 0.8 });
    s += T.rotulo(CX + 4, 16, 'normal', { peso: 600 });
    s += T.rotulo(6, 20, `${d.nombre1 || 'medio 1'} · n = ${Kit.formatear(d.n1 || 1, 2)}`, { peso: 700 });
    s += T.rotulo(W - 6, ALTO - 10, `${d.nombre2 || 'medio 2'} · n = ${Kit.formatear(d.n2 || 1, 2)}`, { peso: 700, ancla: 'end' });
    const t1 = d.t1 || 0, total = d.t2 === null || d.t2 === undefined;
    if (Number.isFinite(d.critico)) {
      const pc = pto(d.critico, LR, 'ai');
      s += T.linea(pc[0], pc[1], CX, CY, { color: C.c, grosor: 2, discontinua: true });
      if (R.c) s += T.rotulo(pc[0] - 4, pc[1] - 6, R.c, { color: C.c, peso: 700, ancla: 'end' });
    }
    if (ve(1)) {
      const a = pto(t1, LR, 'ai');
      s += rayo(a[0], a[1], CX, CY, C.t1);
      s += arco(t1, 'ai', 40, C.t1, R.t1);
    }
    if (ve(2) && (d.reflejado || total)) {
      const b = pto(t1, LR, 'ad');
      s += rayo(CX, CY, b[0], b[1], C.r, { tenue: !total && d.tenue !== false });
      if (R.r) s += arco(t1, 'ad', 32, C.r, R.r);
    }
    if (ve(3) && !total) {
      const c = pto(d.t2, LR, 'ab');
      s += rayo(CX, CY, c[0], c[1], C.t2);
      s += arco(d.t2, 'ab', 40, C.t2, R.t2);
    }
    if (ve(3) && total) s += T.rotulo(CX + 8, CY + 52, 'no pasa: reflexión total', { peso: 700, color: C.c });
    return T.svg(W, ALTO, s, { alt: alt(d) });
  }

  function alt(d) {
    const f = x => Kit.formatear(x, 1);
    const total = d.t2 === null || d.t2 === undefined;
    return `Rayo que va de ${d.nombre1 || 'un medio'} (n = ${f(d.n1 || 1)}) a ${d.nombre2 || 'otro'} (n = ${f(d.n2 || 1)}) con ${f(d.t1 || 0)}° desde la normal; `
      + (total ? 'no pasa: se refleja todo con el mismo ángulo.' : `se refracta a ${f(d.t2)}° de la normal${d.reflejado ? ` y una parte se refleja a ${f(d.t1 || 0)}°` : ''}.`);
  }

  return { id: 'fis-interfaz', dibujar, alt, pto, constantes: { W, ALTO, CX, CY } };
});
