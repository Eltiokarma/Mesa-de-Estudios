/*
 * Pieza «fis-circuito» (física; docs/teoria.md, sección 4): un circuito de una malla con una fuente a la izquierda,
 * elementos en serie en el cable de arriba y, opcionalmente, un bloque de ramas en paralelo a la derecha.
 * Elementos: resistencia, foco (con su brillo), condensador y amperímetro; un voltímetro se cuelga en paralelo de
 * cualquier elemento o de la fuente. Sirve para corriente, ley de Ohm, fem, serie y paralelo, Kirchhoff, potencia
 * y condensadores.
 *
 * Afirmación de la figura: lo que mide cada aparato está pegado a él; la corriente que entra a un nudo es la que sale.
 *
 * El dibujo es un esquema (topología, no distancias): el brillo del foco es lo único que codifica una cantidad
 * (el radio del halo crece con la potencia, en una escala que fija quien llama con brillo 0..1).
 *
 * elemento = { tipo: 'R' | 'foco' | 'C' | 'A', rotulo: 'R₁ = 2 Ω', lectura: '3 A', color: 'o', brillo: 0..1,
 *              voltimetro: '6 V' | null, corriente: { texto: '2 A', color: 'h' } | null, desde }
 * datos = {
 *   fuente: { rotulo: 'ε = 12 V', r: 'r = 1 Ω' | null, voltimetro: '10 V' | null, color },
 *   serie: [elemento, …],          // 0 a 3, en el cable de arriba
 *   ramas: [elemento, …],          // 0 a 3 ramas en paralelo (un elemento por rama); sin ramas, un cable cierra
 *   abierto: false,                // el cable de abajo cortado (interruptor abierto: no circula corriente)
 * }
 * estado = { corte: 0..n }        // se dibuja la lectura y la corriente de los elementos con desde ≤ corte
 * Alto: 200 para una malla simple; 262 con ramas o pila real. Todo número que se ve lo trae quien llama.
 * El dibujo es una función pura de (datos, estado).
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
  const W = 320, XL = 70, XR = 300, YT = 64;
  // Sin ramas ni pila real, el circuito es una malla baja (alto 200); con ellas, alta (262). Dentro de unos mismos
  // datos el alto no cambia entre estados.
  const compacto = d => !(d.ramas || []).length && !(d.fuente || {}).r;
  const altoDe = d => (compacto(d) ? 200 : 262), YBde = d => (compacto(d) ? 176 : 236);
  const G = T.GROSOR;

  // Símbolo de un elemento centrado en (x, y), horizontal (h = true) o vertical. Devuelve el SVG y su semiancho.
  function simbolo(e, x, y, h) {
    const c = e.color, tinta = undefined;
    const rot = (dx, dy) => (h ? [x + dx, y + dy] : [x + dy, y + dx]);
    const p = (dx, dy) => rot(dx, dy).map(T.n).join(' ');
    if (e.tipo === 'R') {
      const pts = [[-18, 0], [-14, -7], [-7, 7], [0, -7], [7, 7], [14, -7], [18, 0]];
      return { svg: `<path d="M${pts.map(q => p(q[0], q[1])).join('L')}" fill="none" stroke="${T.color(c)}" stroke-width="${G.variable}" stroke-linejoin="round" stroke-linecap="round"/>`, m: 18 };
    }
    if (e.tipo === 'C') {
      return { svg: T.linea(...rot(-4, -12), ...rot(-4, 12), { grosor: G.variable, color: c }) + T.linea(...rot(4, -12), ...rot(4, 12), { grosor: G.variable, color: c }), m: 4 };
    }
    if (e.tipo === 'A') {
      return { svg: `<circle cx="${T.n(x)}" cy="${T.n(y)}" r="12" fill="var(--card)" stroke="currentColor" stroke-width="${G.contorno}"/>` + T.rotulo(x, y + 5, 'A', { ancla: 'middle', peso: 700, tam: 14 }), m: 12 };
    }
    // Foco: círculo con una cruz y un halo cuyo radio sigue al brillo (0 = apagado: sin halo).
    const b = Math.max(0, Math.min(1, e.brillo || 0)), halo = b > 0.01 ? 13 + 15 * Math.sqrt(b) : 0;
    let s = halo ? `<circle class="kit-halo" cx="${T.n(x)}" cy="${T.n(y)}" r="${T.n(halo)}" fill="${T.color(c || 'o')}" fill-opacity="0.22"/>` : '';
    s += `<circle cx="${T.n(x)}" cy="${T.n(y)}" r="11" fill="var(--card)" stroke="${T.color(tinta)}" stroke-width="${G.contorno}"/>`
      + T.linea(x - 7, y - 7, x + 7, y + 7, { grosor: G.contorno }) + T.linea(x - 7, y + 7, x + 7, y - 7, { grosor: G.contorno });
    return { svg: s, m: 11 };
  }

  // Voltímetro colgado en paralelo de un tramo: un puente con el círculo V. h: el tramo es horizontal.
  function voltimetro(x, y, m, h, texto, lado) {
    const d = 34 * lado;
    let s = '';
    if (h) {
      s += `<path d="M${T.n(x - m - 4)} ${T.n(y)}L${T.n(x - m - 4)} ${T.n(y - d)}L${T.n(x + m + 4)} ${T.n(y - d)}L${T.n(x + m + 4)} ${T.n(y)}" fill="none" stroke="currentColor" stroke-width="${G.cuadricula}" stroke-dasharray="4 3"/>`;
      s += `<circle cx="${T.n(x)}" cy="${T.n(y - d)}" r="11" fill="var(--card)" stroke="currentColor" stroke-width="${G.contorno}"/>` + T.rotulo(x, y - d + 5, 'V', { ancla: 'middle', peso: 700, tam: 14 });
      if (texto) s += T.rotulo(x + 16, y - d + 5, texto, { peso: 700, clase: 'kit-txt kit-num' });
    } else {
      s += `<path d="M${T.n(x)} ${T.n(y - m - 4)}L${T.n(x - d)} ${T.n(y - m - 4)}L${T.n(x - d)} ${T.n(y + m + 4)}L${T.n(x)} ${T.n(y + m + 4)}" fill="none" stroke="currentColor" stroke-width="${G.cuadricula}" stroke-dasharray="4 3"/>`;
      s += `<circle cx="${T.n(x - d)}" cy="${T.n(y)}" r="11" fill="var(--card)" stroke="currentColor" stroke-width="${G.contorno}"/>` + T.rotulo(x - d, y + 5, 'V', { ancla: 'middle', peso: 700, tam: 14 });
      if (texto) s += T.rotulo(x - d, y + 32, texto, { ancla: 'middle', peso: 700, clase: 'kit-txt kit-num' });
    }
    return s;
  }

  function dibujar(d, estado = {}) {
    const corte = estado.corte === undefined ? Infinity : estado.corte;
    const ve = e => (e.desde || 0) <= corte;
    const YB = YBde(d), ALTO = altoDe(d);
    const serie = (d.serie || []).slice(0, 3), ramas = (d.ramas || []).slice(0, 3);
    const sep = ramas.length > 2 ? 72 : 96;                               // entre ramas
    const xp0 = ramas.length ? XR - sep * (ramas.length - 1) - 10 : XR;  // primera rama
    const xRam = ramas.map((_, k) => xp0 + sep * k);
    let s = '';
    // Cables: arriba de XL a XR (o hasta la última rama), abajo igual, lado izquierdo con la fuente.
    const xFin = ramas.length ? xRam[xRam.length - 1] : XR;
    const cable = (x1, y1, x2, y2) => T.linea(x1, y1, x2, y2, { grosor: G.contorno });
    // Fuente en el lado izquierdo, entre yA y yB; con resistencia interna, la caja punteada de la pila real.
    const f = d.fuente || {};
    const yF = 116, yR = 168;
    s += cable(XL, YT, XL, yF - 12) + cable(XL, yF + 12, XL, f.r ? yR - 18 : YB) + (f.r ? cable(XL, yR + 18, XL, YB) : '');
    s += T.linea(XL - 16, yF - 6, XL + 16, yF - 6, { grosor: G.variable, color: f.color }) + T.linea(XL - 8, yF + 6, XL + 8, yF + 6, { grosor: G.variable * 2, color: f.color });
    s += T.rotulo(XL + 20, yF - 12, '+', { peso: 700 });
    if (f.rotulo) s += T.rotulo(XL + 30, yF + 6, f.rotulo, { peso: 700, color: f.color, clase: 'kit-txt kit-num' });
    if (f.r) {
      s += simbolo({ tipo: 'R' }, XL, yR, false).svg;
      s += T.rotulo(XL + 30, yR + 6, f.r, { clase: 'kit-txt kit-num' });
      s += `<rect x="${XL - 24}" y="${yF - 20}" width="48" height="${yR - yF + 44}" rx="8" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="3 4" stroke-opacity="0.7"/>`;
    }
    if (f.voltimetro !== undefined && f.voltimetro !== null) s += voltimetro(XL, (yF + (f.r ? yR : yF)) / 2, f.r ? 50 : 18, false, f.voltimetro, 1);
    // Cable de arriba con los elementos en serie repartidos.
    const xS0 = XL + 30, xS1 = (ramas.length ? xp0 : XR) - 24;
    const xsS = serie.map((_, k) => xS0 + (xS1 - xS0) * (k + 0.5) / serie.length);
    let x = XL;
    serie.forEach((e, k) => {
      const sb = simbolo(e, xsS[k], YT, true);
      s += cable(x, YT, xsS[k] - sb.m, YT) + sb.svg;
      x = xsS[k] + sb.m;
      if (e.rotulo) s += T.rotulo(xsS[k], YT - 16, e.rotulo, { ancla: 'middle', color: e.color, peso: 700, clase: 'kit-txt kit-num' });
      if (ve(e) && e.lectura) s += T.rotulo(xsS[k], YT + (e.voltimetro ? 76 : 32), e.lectura, { ancla: 'middle', peso: 700, clase: 'kit-txt kit-num' });
      if (ve(e) && e.voltimetro) s += voltimetro(xsS[k], YT, sb.m, true, e.voltimetro, -1);
      if (ve(e) && e.corriente) s += T.flecha(xsS[k] - 14, YT - 36, xsS[k] + 14, YT - 36, { color: e.corriente.color, grosor: G.variable }) + T.rotulo(xsS[k] + 20, YT - 31, e.corriente.texto, { color: e.corriente.color, peso: 700, clase: 'kit-txt kit-num' });
    });
    s += cable(x, YT, xFin, YT);
    // Cable de abajo (cortado si el circuito está abierto).
    if (d.abierto) {
      const xm = (XL + xFin) / 2;
      s += cable(XL, YB, xm - 12, YB) + cable(xm + 14, YB, xFin, YB) + T.linea(xm - 12, YB, xm + 10, YB - 14, { grosor: G.contorno });
      s += `<circle cx="${T.n(xm - 12)}" cy="${YB}" r="3" fill="currentColor"/><circle cx="${T.n(xm + 14)}" cy="${YB}" r="3" fill="currentColor"/>`;
    } else s += cable(XL, YB, xFin, YB);
    // Ramas en paralelo (o el cable que cierra a la derecha).
    if (!ramas.length) s += cable(XR, YT, XR, YB);
    const yM = (YT + YB) / 2;
    ramas.forEach((e, k) => {
      const xr = xRam[k], sb = simbolo(e, xr, yM, false);
      s += cable(xr, YT, xr, yM - sb.m) + sb.svg + cable(xr, yM + sb.m, xr, YB);
      if (k > 0 || serie.length || true) s += `<circle cx="${T.n(xr)}" cy="${YT}" r="3.5" fill="currentColor"/><circle cx="${T.n(xr)}" cy="${YB}" r="3.5" fill="currentColor"/>`;
      if (e.rotulo) s += T.rotulo(xr, yM - sb.m - 10, e.rotulo, { ancla: 'middle', color: e.color, peso: 700, clase: 'kit-txt kit-num', max: W });
      if (ve(e) && e.lectura) s += T.rotulo(xr, yM + sb.m + 22, e.lectura, { ancla: 'middle', peso: 700, clase: 'kit-txt kit-num', max: W });
      if (ve(e) && e.voltimetro) s += voltimetro(xr, yM, sb.m, false, e.voltimetro, 1);
      if (ve(e) && e.corriente) s += T.flecha(xr - 10, YT + 14, xr - 10, YT + 38, { color: e.corriente.color, grosor: G.variable }) + T.rotulo(xr - 16, YT + 32, e.corriente.texto, { ancla: 'end', color: e.corriente.color, peso: 700, clase: 'kit-txt kit-num', max: W });
    });
    return T.svg(W, ALTO, s, { alt: alt(d) });
  }

  const nombre = { R: 'resistencia', foco: 'foco', C: 'condensador', A: 'amperímetro' };
  function alt(d) {
    const desc = e => `${nombre[e.tipo] || 'elemento'}${e.rotulo ? ' ' + e.rotulo : ''}${e.lectura ? ' (' + e.lectura + ')' : ''}${e.voltimetro ? ', voltímetro ' + e.voltimetro : ''}`;
    const f = d.fuente || {};
    let t = `Circuito con fuente ${f.rotulo || ''}${f.r ? ' y ' + f.r + ' interna' : ''}${f.voltimetro ? ', voltímetro en sus bornes ' + f.voltimetro : ''}`;
    if ((d.serie || []).length) t += `; en serie: ${d.serie.map(desc).join(', ')}`;
    if ((d.ramas || []).length) t += `; en paralelo: ${d.ramas.map(desc).join(', ')}`;
    if (d.abierto) t += '; el interruptor está abierto';
    return t + '.';
  }

  return { id: 'fis-circuito', dibujar, alt, constantes: { W } };
});
