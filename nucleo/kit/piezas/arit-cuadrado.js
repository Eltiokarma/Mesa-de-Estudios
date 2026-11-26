/*
 * Pieza «arit-cuadrado» (26 nov 2026): la bandeja cuadrada de caramelos de doña Juana, para «Potenciación y radicación»
 * (contenido/teoria/aritmetica/potenciacion-y-radicacion.js, ideas 1, 3 y 5; docs/etapa9/propuesta-aritmetica.md §2).
 * Dibujo de prueba (data-prueba): Gerson decide después si lo reemplaza (docs/plan-calidad.md, M4).
 *
 * Afirmación de la figura: con N caramelos, doña Juana arma la bandeja cuadrada más grande que puede: k filas de k. Los
 * que sobran se ponen en el borde de la bandeja siguiente, la de (k + 1) × (k + 1): primero la columna nueva de arriba
 * abajo, después la fila nueva de izquierda a derecha y al final la esquina. Los lugares que quedan vacíos son los que
 * faltan para esa bandeja. Si N no es un cuadrado, también se puede dibujar el rectángulo más cuadrado que cierra.
 *
 * Fidelidad: cada caramelo se dibuja (una bandeja de 6 × 6 lleva 36). Todas las bandejas de una figura van a la misma
 * escala (un caramelo mide lo mismo en todas): si no caben, se achican todas, nunca una. Los que sobran nunca pasan de
 * 2k (el borde tiene 2k + 1 lugares y con uno más la bandeja siguiente se completa): la pieza lo exige.
 *
 * datos = {
 *   bandejas: [{                 de una a tres, lado a lado
 *     k: 6,                      la bandeja cuadrada llena, de k × k
 *     filas: 8, porFila: 9,      o un rectángulo lleno de filas × porFila (sin k)
 *     sobran: 5,                 caramelos que sobran, en el borde de la bandeja siguiente (carmín, punteados); 0 a 2k
 *     siguiente: true,           dibuja el borde de la bandeja de (k + 1) × (k + 1) con los lugares que faltan
 *                                (punteados en tinta). Con sobran > 0 se dibuja siempre.
 *     rotulo: [[texto, color?, peso?], …],   una línea arriba de la bandeja
 *     pie: [[texto, color?, peso?], …],      una línea debajo de la bandeja
 *   }],
 *   letrero: [[texto, color?, peso?], …],    una línea arriba de todo
 *   alto: 240,                   alto fijo del lienzo (el juego no salta al cambiar N); sin alto, el que haga falta
 *   mudo: true,                  el texto alternativo sin cantidades (cuando la figura es de un ejercicio que las pide)
 *   pasos: [{ …datos }, …],      para «Mira»: estado.paso elige qué cambia (se mezcla con los datos)
 * }
 * estado = { paso }. Función pura de (datos, estado): sin ids, sin azar, sin reloj. Lienzo de 320 de ancho.
 * Colores (los de la unidad, def.colores): los caramelos de la bandeja en tinta; los que sobran en carmín (h, el
 * residuo), con borde punteado; los lugares que faltan, punteados en tinta (lo que falta va sin color). Los rótulos llevan
 * el color que pidan los datos. Nunca verde. El color no es la única señal: los que sobran van punteados y rellenos, los
 * que faltan, punteados y vacíos.
 * geometria(datos, estado) da las cajas de todo lo dibujado (bandejas y textos), para la prueba numérica de encuadre.
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
  const W = 320, M = 4, TAM = 14, X0 = 8, X1 = 312;
  const PAD = 5, LIN = 20, SEP_X = 16;
  const n2 = T.n;
  const entero = x => Math.max(0, Math.floor(+x || 0));

  function mezcla(datos, estado) {
    const ps = (datos && datos.pasos) || [];
    const p = ps[Math.max(0, Math.min(ps.length - 1, (estado && estado.paso) | 0))];
    return Object.assign({}, datos || {}, p || {});
  }
  const segsDe = x => (typeof x === 'string' ? [[x]] : Array.isArray(x) ? x : null);
  const segsAncho = (segs, tam = TAM) => segs.reduce((a, s) => a + T.ancho(s[0], tam, s[2] || 400), 0);
  function texto(x, y, segs, o = {}) {
    const tam = o.tam || TAM, ancla = o.ancla || 'start';
    const spans = segs.map(([t, c, p]) => `<tspan fill="${T.color(c)}"${p && p !== 400 ? ` font-weight="${p}"` : ''}>${T.esc(t)}</tspan>`).join('');
    return `<text class="kit-txt" x="${n2(x)}" y="${n2(y)}" font-size="${tam}"${ancla !== 'start' ? ` text-anchor="${ancla}"` : ''} style="font-variant-numeric:tabular-nums">${spans}</text>`;
  }

  // Una bandeja normalizada: k (cuadrada) o filas × porFila; sobran ≤ 2k; con sobran, siempre el borde siguiente.
  function normal(b) {
    if (b.k !== undefined) {
      const k = Math.max(1, entero(b.k)), sobran = Math.min(2 * k, entero(b.sobran));
      return { k, filas: k, porFila: k, sobran, siguiente: !!b.siguiente || sobran > 0, rotulo: segsDe(b.rotulo), pie: segsDe(b.pie) };
    }
    return { filas: Math.max(1, entero(b.filas)), porFila: Math.max(1, entero(b.porFila)), sobran: 0, siguiente: false, rotulo: segsDe(b.rotulo), pie: segsDe(b.pie) };
  }
  // Lugares de una bandeja, fila i y columna j: los k × k llenos; el borde de la siguiente se recorre columna nueva (de
  // arriba abajo), fila nueva (de izquierda a derecha) y esquina; los primeros `sobran` del borde son los que sobran.
  function lugaresDe(b) {
    const out = [];
    for (let i = 0; i < b.filas; i++) for (let j = 0; j < b.porFila; j++) out.push({ i, j, tipo: 'lleno' });
    if (b.siguiente) {
      const k = b.k, borde = [];
      for (let i = 0; i < k; i++) borde.push([i, k]);
      for (let j = 0; j < k; j++) borde.push([k, j]);
      borde.push([k, k]);
      borde.forEach(([i, j], n) => out.push({ i, j, tipo: n < b.sobran ? 'sobra' : 'falta' }));
    }
    return out;
  }

  function geometria(datos, estado = {}) {
    const d = mezcla(datos, estado);
    const bs = (d.bandejas || []).slice(0, 3).map(normal);
    const letrero = segsDe(d.letrero);
    const conRot = bs.some(b => b.rotulo) || ((datos && datos.pasos) || []).some(p => p && (p.bandejas || []).some(b => b.rotulo));
    const conPie = bs.some(b => b.pie) || ((datos && datos.pasos) || []).some(p => p && (p.bandejas || []).some(b => b.pie));
    const conLetrero = !!(datos && (datos.letrero !== undefined || ((datos.pasos || []).some(p => p && p.letrero !== undefined))));
    const yA = M + (conLetrero ? LIN + 2 : 0);
    const alto = d.alto ? Math.max(80, +d.alto) : null;
    const extra = (conRot ? LIN : 0) + (conPie ? LIN : 0);
    const cols = bs.map(b => (b.siguiente ? b.porFila + 1 : b.porFila)), rows = bs.map(b => (b.siguiente ? b.filas + 1 : b.filas));
    const anchoRot = bs.map(b => Math.max(b.rotulo ? segsAncho(b.rotulo) : 0, b.pie ? segsAncho(b.pie) : 0));
    const disponible = alto ? alto - yA - M - 2 - extra : Infinity;
    const anchoDe = s => bs.reduce((a, b, i) => a + Math.max(cols[i] * s + 2 * PAD, anchoRot[i]), 0) + SEP_X * Math.max(0, bs.length - 1);
    let s = 22;
    while (s > 3 && (anchoDe(s) > X1 - X0 || Math.max(0, ...rows.map(r => r * s + 2 * PAD)) > disponible)) s -= 0.25;
    const hBand = Math.max(0, ...rows.map(r => r * s + 2 * PAD));
    const objetos = [], textos = [], rot = [], bandejas = [];
    const tx = (que, x, y, segs, o = {}) => {
      const w = segsAncho(segs, o.tam || TAM), xa = o.ancla === 'middle' ? x - w / 2 : x;
      textos.push({ que, txt: segs.map(z => z[0]).join(''), x0: xa, x1: xa + w, y0: y - (o.tam || TAM) * 0.8, y1: y + (o.tam || TAM) * 0.25 });
      rot.push({ x, y, segs, o });
    };
    if (letrero) tx('letrero', X0, M + 15, letrero);
    const bloque = hBand + extra;
    const y0 = yA + (alto ? Math.max(0, (alto - yA - M - 2 - bloque) / 2) : 0);
    let x = X0 + ((X1 - X0) - anchoDe(s)) / 2;
    bs.forEach((b, i) => {
      const ancho = Math.max(cols[i] * s + 2 * PAD, anchoRot[i]), cx = x + ancho / 2;
      const w = cols[i] * s + 2 * PAD, h = rows[i] * s + 2 * PAD;
      const yb = y0 + (conRot ? LIN : 0) + (hBand - h);
      if (b.rotulo) tx(`rótulo ${b.rotulo.map(z => z[0]).join('')}`, cx, yb - 6, b.rotulo, { ancla: 'middle' });
      const bx = cx - w / 2, caja = { x: bx, y: yb, w, h };
      objetos.push({ que: `bandeja ${i + 1}`, x0: bx, y0: yb, x1: bx + w, y1: yb + h });
      const lugares = lugaresDe(b).map(l => Object.assign(l, { x: bx + PAD + (l.j + 0.5) * s, y: yb + PAD + (l.i + 0.5) * s }));
      if (b.pie) tx(`pie ${b.pie.map(z => z[0]).join('')}`, cx, yb + h + 16, b.pie, { ancla: 'middle' });
      bandejas.push({ b, caja, lugares, s, borde: b.siguiente ? { x: bx + PAD - 1.5, y: yb + PAD - 1.5, w: b.porFila * s + 3, h: b.filas * s + 3 } : null });
      x += ancho + SEP_X;
    });
    const H = Math.round(alto || (y0 + bloque + M + 4));
    return { W, H, M, d, s, bandejas, objetos, textos, rot };
  }

  // Un caramelo redondo con su envoltura: un círculo y las dos puntas torcidas, a los lados (como en arit-bandejas).
  function caramelo(x, y, s) {
    const r = s * 0.3, t = s * 0.17, hh = s * 0.13;
    return `M${n2(x - r)} ${n2(y)}A${n2(r)} ${n2(r)} 0 1 0 ${n2(x + r)} ${n2(y)}A${n2(r)} ${n2(r)} 0 1 0 ${n2(x - r)} ${n2(y)}Z`
      + `M${n2(x - r + 0.3)} ${n2(y)}L${n2(x - r - t)} ${n2(y - hh)}L${n2(x - r - t)} ${n2(y + hh)}Z`
      + `M${n2(x + r - 0.3)} ${n2(y)}L${n2(x + r + t)} ${n2(y - hh)}L${n2(x + r + t)} ${n2(y + hh)}Z`;
  }
  const circulo = (x, y, r) => `M${n2(x - r)} ${n2(y)}A${n2(r)} ${n2(r)} 0 1 0 ${n2(x + r)} ${n2(y)}A${n2(r)} ${n2(r)} 0 1 0 ${n2(x - r)} ${n2(y)}Z`;

  function dibujar(datos, estado = {}) {
    const g = geometria(datos, estado);
    let s = '';
    for (const bd of g.bandejas) {
      const c = bd.caja;
      s += `<rect x="${n2(c.x)}" y="${n2(c.y)}" width="${n2(c.w)}" height="${n2(c.h)}" rx="4" fill="var(--card)" stroke="currentColor" stroke-width="1.5"/>`;
      s += `<path d="M${n2(c.x + 3)} ${n2(c.y + c.h + 2)}H${n2(c.x + c.w - 3)}" stroke="currentColor" stroke-width="1.2" stroke-opacity="0.45" stroke-linecap="round"/>`;
      // El borde de la bandeja de k × k, dentro de la siguiente: separa lo que ya está armado.
      if (bd.borde) s += `<rect class="cu-k" x="${n2(bd.borde.x)}" y="${n2(bd.borde.y)}" width="${n2(bd.borde.w)}" height="${n2(bd.borde.h)}" rx="2" fill="none" stroke="currentColor" stroke-width="1.2" stroke-opacity="0.7"/>`;
      let llenos = '', sobran = '', faltan = '';
      for (const l of bd.lugares) {
        if (l.tipo === 'lleno') llenos += caramelo(l.x, l.y, bd.s);
        else if (l.tipo === 'sobra') sobran += caramelo(l.x, l.y, bd.s);
        else faltan += circulo(l.x, l.y, bd.s * 0.3);
      }
      if (llenos) s += `<path d="${llenos}" fill="currentColor" fill-opacity="0.28" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/>`;
      if (sobran) s += `<path class="cu-sobra" d="${sobran}" fill="var(--c-h)" fill-opacity="0.22" stroke="var(--c-h)" stroke-width="1.3" stroke-dasharray="2.5 1.6" stroke-linejoin="round"/>`;
      if (faltan) s += `<path class="cu-falta" d="${faltan}" fill="none" stroke="currentColor" stroke-opacity="0.5" stroke-width="1" stroke-dasharray="2 2"/>`;
    }
    for (const r of g.rot) s += texto(r.x, r.y, r.segs, r.o);
    return T.svg(W, g.H, `<g class="kit-objeto" data-objeto="bandeja-cuadrada" data-prueba="si">${s}</g>`, { alt: alt(datos, estado) });
  }

  const pl = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
  function alt(datos, estado = {}) {
    const g = geometria(datos, estado);
    if (!g.bandejas.length) return 'Bandeja vacía.';
    if (g.d.mudo) return g.bandejas.length > 1 ? 'Bandejas de caramelos de doña Juana, lado a lado.' : 'Bandeja de caramelos de doña Juana.';
    return g.bandejas.map(bd => {
      const b = bd.b;
      if (b.k === undefined) return `Bandeja de ${pl(b.filas, 'fila', 'filas')} de ${pl(b.porFila, 'caramelo', 'caramelos')}: ${b.filas * b.porFila} caramelos.`;
      let t = `Bandeja cuadrada de ${b.k} × ${b.k}: ${b.k * b.k} caramelos.`;
      if (b.siguiente) {
        const faltan = 2 * b.k + 1 - b.sobran;
        t += b.sobran ? ` Sobran ${b.sobran} en el borde de la bandeja de ${b.k + 1} × ${b.k + 1}; faltan ${faltan}.` : ` Para la de ${b.k + 1} × ${b.k + 1} faltan ${faltan} lugares.`;
      }
      return t;
    }).join(' ');
  }

  return { id: 'arit-cuadrado', dibujar, alt, geometria, constantes: { W, M, X0, X1 } };
});
