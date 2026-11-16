/*
 * Pieza «fis-balanza-dim» (16 nov 2026, idea «Las dimensiones deben cuadrar»; contrato «se entiende sin profesor»,
 * docs/plan-calidad.md). Una balanza con los dos lados de una fórmula: en cada platillo, de qué está hecho ese lado
 * (su dimensión, en letras: L longitud, T tiempo, M masa). Si los dos lados tienen la misma dimensión, la balanza queda
 * derecha; si no, se inclina. Reemplaza las «fichas huecas que dividen», que nadie entendía sin profesor.
 *
 * Afirmación de la figura: una fórmula de física puede estar bien escrita solo si sus dos lados tienen la misma dimensión.
 *
 * datos = {
 *   izq: { nombre: 'd', exps: [0, 1, 0] },          // lado izquierdo: lo que se escribe y su dimensión (exponentes de M, L, T)
 *   der: { nombre: 'v · t', exps: [0, 1, 0],         // lado derecho
 *          oculta: false },                          //   oculta: la dimensión aún no se sabe («?»): la balanza no se inclina
 *   color: 'o', colorOculta: 'h',
 *   vistas: [datos, …]                               // opcional: varias balanzas; estado.vista elige (para «Mira»)
 * }
 * estado = { vista } (opcional). Función pura de (datos, estado): sin ids, sin azar, sin reloj.
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
  const W = 320, H = 214, CX = 160, EJE = 40, BRAZO = 96, INCL = 9, CUERDA = 92;
  const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const n = T.n;

  // «M L² T⁻²»; sin dimensiones, «1».
  function texto(exps = []) {
    const ps = ['M', 'L', 'T'].map((f, i) => {
      const e = exps[i] || 0;
      if (!e) return '';
      return e === 1 ? f : f + String(e).split('').map(c => SUP[c]).join('');
    }).filter(Boolean);
    return ps.length ? ps.join(' ') : '1';
  }
  const iguales = (a = [], b = []) => [0, 1, 2].every(i => (a[i] || 0) === (b[i] || 0));
  const cuadra = d => !(d.der && d.der.oculta) && iguales(d.izq && d.izq.exps, d.der && d.der.exps);

  // Un platillo colgado de (x, y) y, encima, una caja con lo que se pesa: el lado de la fórmula y su dimensión.
  function platillo(x, y, lado, color, colorOculta) {
    const c = T.color(color), yp = y + CUERDA;
    const dim = lado.oculta ? '?' : texto(lado.exps);
    // La caja se ensancha con lo que lleva: «M L⁻¹ T⁻²» no cabía en 76 (16 nov). Medio ancho entre 38 y 50: con el
    // brazo inclinado 9°, el borde del platillo izquierdo queda en x ≥ 160 − 96·cos 9° − 50 − 8 ≈ 7.
    const h = Math.min(50, Math.max(38, T.ancho(dim, 16, 700) / 2 + 7, T.ancho(lado.nombre || '', 15, 700) / 2 + 7));
    let g = `<line x1="${n(x - h - 2)}" y1="${n(yp)}" x2="${n(x)}" y2="${n(y)}" stroke="currentColor" stroke-width="1.5"/>`
      + `<line x1="${n(x + h + 2)}" y1="${n(yp)}" x2="${n(x)}" y2="${n(y)}" stroke="currentColor" stroke-width="1.5"/>`;
    g += `<rect x="${n(x - h)}" y="${n(yp - 50)}" width="${n(2 * h)}" height="48" rx="8" fill="var(--card)" stroke="${c}" stroke-width="2"/>`;
    g += T.rotulo(x, yp - 31, lado.nombre || '', { ancla: 'middle', tam: 15, peso: 700, min: x - h + 1, max: x + h - 1 });
    g += T.rotulo(x, yp - 10, dim, { ancla: 'middle', tam: 16, peso: 700, color: lado.oculta ? colorOculta : color, min: x - h + 1, max: x + h - 1 });
    g += `<path d="M${n(x - h - 8)} ${n(yp)}Q${n(x)} ${n(yp + 18)} ${n(x + h + 8)} ${n(yp)}Z" fill="${c}" fill-opacity="0.12" stroke="${c}" stroke-width="2.5" stroke-linejoin="round"/>`;
    return g;
  }

  function dibujar(datos = {}, estado = {}) {
    // Varias vistas en una figura (la línea de tiempo de «Mira»): estado.vista elige cuál.
    const d = Array.isArray(datos.vistas) ? datos.vistas[Math.max(0, Math.min(datos.vistas.length - 1, estado.vista || 0))] : datos;
    const color = d.color || datos.color || 'o', colorOculta = d.colorOculta || 'h';
    const ok = cuadra(d), sabe = !(d.der && d.der.oculta);
    const ang = sabe && !ok ? INCL : 0, a = ang * Math.PI / 180;
    const xi = CX - BRAZO * Math.cos(a), yi = EJE - BRAZO * Math.sin(a), xd = CX + BRAZO * Math.cos(a), yd = EJE + BRAZO * Math.sin(a);
    let s = `<path d="M${CX - 22} ${H - 30}L${CX + 22} ${H - 30}L${CX} ${EJE + 4}Z" fill="currentColor" fill-opacity="0.12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`;
    s += `<line x1="${n(xi)}" y1="${n(yi)}" x2="${n(xd)}" y2="${n(yd)}" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`
      + `<circle cx="${CX}" cy="${EJE}" r="5" fill="currentColor"/>`;
    s += platillo(xi, yi, d.izq || {}, color, colorOculta) + platillo(xd, yd, d.der || {}, color, colorOculta);
    if (sabe) s += T.rotulo(CX, H - 8, ok ? 'Cuadra: los dos lados son iguales' : 'No cuadra: los lados son distintos', { ancla: 'middle', tam: 15, peso: 700, color: ok ? 'd' : 'h' });
    return T.svg(W, H, s, { alt: alt(d) });
  }

  function alt(d0 = {}) {
    const d = Array.isArray(d0.vistas) ? (d0.vistas[0] || {}) : d0;
    const i = d.izq || {}, r = d.der || {};
    if (r.oculta) return `Una balanza: a la izquierda ${i.nombre || ''}, de dimensión ${texto(i.exps)}; a la derecha ${r.nombre || ''}, de dimensión desconocida.`;
    return `Una balanza: a la izquierda ${i.nombre || ''} (${texto(i.exps)}), a la derecha ${r.nombre || ''} (${texto(r.exps)}). ${cuadra(d) ? 'Queda derecha: cuadra.' : 'Se inclina: no cuadra.'}`;
  }

  return { id: 'fis-balanza-dim', dibujar, alt, texto, cuadra, constantes: { W, H } };
});
