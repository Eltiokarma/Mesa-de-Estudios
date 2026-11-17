/*
 * Pieza «alg-objeto» (17 nov 2026): objetos de la vida real para la teoría de Álgebra, uno por idea, en una sola pieza
 * (como trig-objeto; docs/etapa3/propuesta-algebra-exponentes.md §2). Dibujo de prueba (data-prueba): Gerson decide
 * después si lo reemplaza (docs/plan-calidad.md, M4). Por ahora trae un objeto:
 *
 *   'hoja'   una hoja de cuaderno que se dobla por la mitad (o en tres, como una carta), idea «leyes-exponentes» de
 *            contenido/teoria/algebra/exponentes-y-productos-notables.js.
 *
 * Afirmación de la figura: cada doblez multiplica las capas por la base; por eso los dobleces se suman y las capas se
 * multiplican. m dobleces dan bᵐ capas (el paquete naranja); n dobleces más repiten ese paquete bⁿ veces.
 *
 * Fidelidad: de canto se dibuja una capa por línea (32 capas son 32 líneas), agrupadas en bⁿ paquetes de bᵐ capas; vista
 * desde arriba, la hoja doblada es el pedazo que queda (cada doblez parte el alto o el ancho, por turnos), sobre el
 * contorno punteado de la hoja entera. Abierta, la hoja muestra sus pliegues: bᵏ partes iguales. Una hoja en tres no da
 * para más de 3 dobleces (se topa y lo dice); por la mitad, la pieza llega hasta 5 (32 capas: más ya no se cuentan).
 *
 * datos (objeto 'hoja') = {
 *   objeto: 'hoja',
 *   base: 2 | 3,          por la mitad o en tres (por defecto 2)
 *   m: 3, n: 2,           dobleces que ya tiene (naranja) y dobleces más (turquesa); n puede faltar (0)
 *   total: true | 'tinta' | '?' | false,   arriba del canto: «32 capas» en violeta (true) o en tinta (un dato junto a
 *                         una pregunta: el violeta queda para lo que se responde), «? capas» o nada
 *   tira: false,          sin la tira de dobleces de arriba (por defecto va)
 *   canto: false,         sin el canto ni el total (cuando se piden las capas: contar las líneas daría la respuesta)
 *   rotulos: false,       sin «8 capas» y «× 4» junto a los paquetes (con un solo paquete no van nunca)
 *   abierta: true,        a la izquierda, la hoja abierta con los pliegues de m + n dobleces (y no doblada)
 *   parte: '1/8' | '?',   rótulo de la cara de arriba (doblada) o de una parte (abierta): violeta, o «?» en tinta
 *   pasos: [{ …datos }, …]   para «Mira»: estado.paso elige qué cambia (se mezcla con los datos)
 * }
 * estado = { paso }. Función pura de (datos, estado): sin ids, sin azar, sin reloj. Lienzo de 320 × 250.
 * Colores: tinta (currentColor) y var(--c-*): los m dobleces y su paquete en naranja (o), los n dobleces en turquesa
 * (i), el total que se da en violeta (f). Lo que se pide va con «?» en tinta. Nunca carmín ni verde.
 * geometria(datos, estado) da las cajas de todo lo dibujado (objetos y textos) para la prueba numérica de encuadre.
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
  const W = 320, H = 250, M = 4, TAM = 13;
  const n2 = T.n;
  const entero = x => Math.max(0, Math.floor(+x || 0));
  // La hoja entera, vista desde arriba (proporción de una hoja A4).
  const HOJA = { x: 22, y: 66, w: 96, h: 136 };
  // El canto: dónde van las capas.
  const CANTO = { x0: 200, x1: 286, y0: 76, y1: 206 };
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };

  function mezcla(datos, estado) {
    const ps = (datos && datos.pasos) || [];
    const p = ps[Math.max(0, Math.min(ps.length - 1, (estado && estado.paso) | 0))];
    return Object.assign({}, datos || {}, p || {});
  }
  // Los dobleces que de verdad caben: en tres, a lo más 3; por la mitad, a lo más 5.
  function dobleces(d) {
    const b = d.base === 3 ? 3 : 2, tope = b === 3 ? 3 : 5;
    const m0 = entero(d.m), n0 = entero(d.n);
    const m = Math.min(m0, tope), n = Math.min(n0, tope - m);
    return { b, m, n, k: m + n, topado: m0 + n0 > tope };
  }

  // Texto de varios colores: segs = [[texto, color?, peso?], …].
  const anchoSegs = (segs, tam) => segs.reduce((a, s) => a + T.ancho(s[0], tam, s[2] || 400), 0);
  function texto(x, y, segs, o = {}) {
    const tam = o.tam || TAM, ancla = o.ancla || 'start';
    const spans = segs.map(([t, c, p]) => `<tspan fill="${T.color(c)}"${p && p !== 400 ? ` font-weight="${p}"` : ''}>${T.esc(t)}</tspan>`).join('');
    return `<text class="kit-txt" x="${n2(x)}" y="${n2(y)}" font-size="${tam}"${ancla !== 'start' ? ` text-anchor="${ancla}"` : ''} style="font-variant-numeric:tabular-nums">${spans}</text>`;
  }
  // Caja de un texto (para la prueba): de y − 0,8·tam a y + 0,25·tam.
  const cajaTexto = (que, x, y, segs, tam, ancla) => {
    const w = anchoSegs(segs, tam), x0 = ancla === 'end' ? x - w : ancla === 'middle' ? x - w / 2 : x;
    return { que, txt: segs.map(s => s[0]).join(''), x0, x1: x0 + w, y0: y - tam * 0.8, y1: y + tam * 0.25 };
  };

  function geometria(datos, estado = {}) {
    const d = mezcla(datos, estado), D = dobleces(d), { b, m, n, k } = D;
    const objetos = [], textos = [];
    const cols = b ** Math.floor(k / 2), filas = b ** Math.ceil(k / 2);
    // Sin el canto, la hoja va al centro del lienzo (no queda media figura vacía).
    const canto = d.canto !== false, hx = canto ? HOJA.x : (W - HOJA.w) / 2;
    // Vista desde arriba: el pedazo doblado (arriba a la izquierda de la hoja) o la hoja abierta.
    const pieza = { x: hx, y: HOJA.y, w: HOJA.w / cols, h: HOJA.h / filas };
    objetos.push({ que: 'hoja', x0: hx, y0: HOJA.y, x1: hx + HOJA.w, y1: HOJA.y + HOJA.h });
    // El canto: L capas en P paquetes de C capas.
    const C = b ** m, P = b ** n, L = C * P;
    const gap = P > 1 ? Math.min(10, 64 / (P - 1)) : 0, pad = P > 1 ? Math.min(4, (gap - 2) / 2) : 4;
    const alto = CANTO.y1 - CANTO.y0, paso = L > 1 ? Math.min(6, (alto - gap * (P - 1)) / (L - 1)) : 0;
    const usado = paso * (L - 1) + gap * (P - 1), y0 = CANTO.y0 + (alto - usado) / 2;
    const ys = Array.from({ length: L }, (_, j) => y0 + j * paso + Math.floor(j / C) * gap);
    const paquetes = Array.from({ length: P }, (_, q) => ({ y0: ys[q * C] - pad, y1: ys[q * C + C - 1] + pad }));
    if (canto) objetos.push({ que: 'canto', x0: CANTO.x0 - 8, y0: paquetes[0].y0 - 1, x1: CANTO.x1 + 8, y1: paquetes[P - 1].y1 + 1 });
    // La tira de dobleces, arriba: «por la mitad:» y un cuadrito por doblez.
    const tira = d.tira !== false;
    const marcas = [];
    let xt = 0;
    if (tira) {
      const et = [[b === 3 ? 'En tres:' : 'Por la mitad:']];
      textos.push(cajaTexto('tira', 12, 30, et, TAM));
      xt = 12 + anchoSegs(et, TAM) + 8;
      for (let j = 0; j < k; j++) {
        const x = xt + j * 15 + (j >= m && m > 0 ? 6 : 0);
        marcas.push({ x, color: j < m ? 'o' : 'i' });
        objetos.push({ que: 'doblez', x0: x, y0: 20, x1: x + 12, y1: 32 });
      }
      const xf = k ? marcas[k - 1].x + 12 + 10 : xt;
      const cuenta = n > 0 ? [[String(m), 'o', 700], [' + '], [String(n), 'i', 700], [' = '], [String(k), d.total === '?' ? null : 'f', 700]]
        : [[String(m), 'o', 700]];
      textos.push(cajaTexto('cuenta', xf, 30, cuenta, TAM));
      marcas.cuenta = { x: xf, segs: cuenta };
    }
    // Arriba del canto, el total de capas.
    let total = null;
    if (canto && d.total !== false) {
      const segs = d.total === '?' ? [['? capas', null, 700]] : [[`${L} ${L === 1 ? 'capa' : 'capas'}`, d.total === 'tinta' ? null : 'f', 700]];
      const cx = (CANTO.x0 + CANTO.x1) / 2, y = 60;
      total = { cx, y, segs };
      textos.push(cajaTexto('total', cx, y, segs, 14, 'middle'));
    }
    // A la izquierda del primer paquete, cuántas capas tiene; a la izquierda del último, cuántas veces se repite.
    const rot = [];
    // Con un solo paquete, su cuenta sería el total: no se repite (y no delata un total que se pide).
    if (canto && m > 0 && P > 1 && d.rotulos !== false) {
      const yc = (paquetes[0].y0 + paquetes[0].y1) / 2 + 4;
      const segs = [[`${C} ${C === 1 ? 'capa' : 'capas'}`, 'o', 700]];
      rot.push({ x: CANTO.x0 - 12, y: Math.max(yc, 82), segs });
    }
    if (canto && P > 1 && d.rotulos !== false) {
      let y = (paquetes[P - 1].y0 + paquetes[P - 1].y1) / 2 + 4;
      if (rot.length) y = Math.max(y, rot[0].y + 18);
      rot.push({ x: CANTO.x0 - 12, y: Math.min(y, 216), segs: [[`× ${P}`, 'i', 700]] });
    }
    for (const r of rot) textos.push(cajaTexto('paquete', r.x, r.y, r.segs, TAM, 'end'));
    // La parte rotulada: la cara de arriba (doblada) o la parte de la esquina (abierta).
    let parte = null;
    if (d.parte !== undefined && d.parte !== false) {
      const t = String(d.parte), pide = /\?/.test(t), w = T.ancho(t, 14, 700);
      const dentro = pieza.w >= w + 8 && pieza.h >= 20;
      const x = dentro ? pieza.x + pieza.w / 2 : hx + HOJA.w + 6 + w / 2, y = dentro ? pieza.y + pieza.h / 2 + 5 : pieza.y + 14;
      parte = { t, pide, x, y };
      textos.push(cajaTexto('parte', x, y, [[t, null, 700]], 14, 'middle'));
    }
    // Una hoja en tres no da para más.
    let aviso = null;
    if (D.topado) {
      aviso = [[b === 3 ? 'En tres, la hoja no da para más de 3 dobleces' : 'Por la mitad, aquí van a lo más 5 dobleces']];
      textos.push(cajaTexto('aviso', 160, 236, aviso, 12, 'middle'));
    }
    return { W, H, M, d, D, C, P, L, ys, canto, hx, paquetes, pieza, cols, filas, marcas, tira, total, rot, parte, aviso, objetos, textos };
  }

  // Rayas de cuaderno dentro de un rectángulo (las de la hoja que caen en el pedazo).
  function rayas(x, y, w, h, hx) {
    let s = '';
    for (let yy = HOJA.y + 12; yy < y + h - 2; yy += 9) if (yy > y + 2) s += `M${n2(x + 2)} ${n2(yy)}H${n2(x + w - 2)}`;
    const xm = hx + 14;
    if (xm < x + w - 2) s += `M${n2(xm)} ${n2(y + 1)}V${n2(y + h - 1)}`;
    return s ? `<path d="${s}" fill="none" stroke="currentColor" stroke-width="1" stroke-opacity="0.35"/>` : '';
  }

  function dibujar(datos, estado = {}) {
    const g = geometria(datos, estado), d = g.d, { b, k } = g.D;
    let s = '';
    // La tira de dobleces.
    if (g.tira) {
      s += texto(12, 30, [[b === 3 ? 'En tres:' : 'Por la mitad:']]);
      for (const mk of g.marcas) s += `<g class="alg-doblez"><rect x="${n2(mk.x)}" y="20" width="12" height="12" rx="2" fill="var(--c-${mk.color})" fill-opacity="0.12" stroke="var(--c-${mk.color})" stroke-width="2"/>`
        + `<path d="M${n2(mk.x + 12)} 26L${n2(mk.x + 6)} 32" stroke="var(--c-${mk.color})" stroke-width="1.5" fill="none"/></g>`;
      s += texto(g.marcas.cuenta.x, 30, g.marcas.cuenta.segs);
    }
    // Vista desde arriba.
    const p = g.pieza, hx = g.hx;
    if (d.abierta) {
      // La hoja abierta, con sus pliegues: cols × filas partes iguales; la de la esquina, marcada.
      s += `<rect class="alg-hoja" x="${n2(hx)}" y="${HOJA.y}" width="${HOJA.w}" height="${HOJA.h}" rx="2" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`;
      s += rayas(hx, HOJA.y, HOJA.w, HOJA.h, hx);
      let pl = '';
      for (let c = 1; c < g.cols; c++) pl += `M${n2(hx + c * p.w)} ${HOJA.y}V${HOJA.y + HOJA.h}`;
      for (let f = 1; f < g.filas; f++) pl += `M${n2(hx)} ${n2(HOJA.y + f * p.h)}H${n2(hx + HOJA.w)}`;
      if (pl) s += `<path class="alg-pliegues" d="${pl}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3"/>`;
      const c = g.parte && !g.parte.pide ? 'var(--c-f)' : 'currentColor';
      if (g.parte) s += `<rect class="alg-parte" x="${n2(p.x)}" y="${n2(p.y)}" width="${n2(p.w)}" height="${n2(p.h)}" fill="${c}" fill-opacity="0.18" stroke="${c}" stroke-width="2"/>`;
    } else {
      // La hoja entera, punteada; encima, el pedazo doblado (las capas no se ven desde arriba).
      if (k > 0) s += `<rect class="alg-contorno" x="${n2(hx)}" y="${HOJA.y}" width="${HOJA.w}" height="${HOJA.h}" rx="2" fill="none" stroke="currentColor" stroke-width="1.2" stroke-opacity="0.5" stroke-dasharray="4 4"/>`;
      const c = g.parte && !g.parte.pide ? 'var(--c-f)' : 'currentColor';
      s += `<rect class="alg-hoja" x="${n2(p.x)}" y="${n2(p.y)}" width="${n2(p.w)}" height="${n2(p.h)}" rx="2" fill="var(--card)" stroke="${c}" stroke-width="2"/>`;
      s += rayas(p.x, p.y, p.w, p.h, hx);
      if (k > 0) s += `<rect x="${n2(p.x)}" y="${n2(p.y)}" width="${n2(p.w)}" height="${n2(p.h)}" rx="2" fill="currentColor" fill-opacity="0.06"/>`;
    }
    if (g.parte) s += texto(g.parte.x, g.parte.y, [[g.parte.t, g.parte.pide ? null : 'f', 700]], { tam: 14, ancla: 'middle' });
    // El canto: una tira continua doblada en zigzag (una línea por capa), con cada paquete en su marco naranja.
    const ys = g.ys, x0 = CANTO.x0, x1 = CANTO.x1;
    let z = `M${x0} ${n2(ys[0])}H${x1}`;
    for (let j = 1; j < ys.length; j++) {
      const r = (ys[j] - ys[j - 1]) / 2, der = j % 2 === 1;
      z += `A${n2(Math.max(r, 0.5))} ${n2(Math.max(r, 0.5))} 0 0 ${der ? 1 : 0} ${der ? x1 : x0} ${n2(ys[j])}H${der ? x0 : x1}`;
    }
    if (g.canto) s += `<path class="alg-capas" d="${z}" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>`;
    if (g.canto && g.D.m > 0) for (const q of g.paquetes) s += `<rect class="alg-paquete" x="${x0 - 8}" y="${n2(q.y0)}" width="${x1 - x0 + 16}" height="${n2(q.y1 - q.y0)}" rx="4" fill="none" stroke="var(--c-o)" stroke-width="1.5"/>`;
    for (const r of g.rot) s += texto(r.x, r.y, r.segs, { ancla: 'end' });
    if (g.total) s += texto(g.total.cx, g.total.y, g.total.segs, { tam: 14, ancla: 'middle' });
    if (g.aviso) s += texto(160, 236, g.aviso, { tam: 12, ancla: 'middle' });
    return T.svg(W, H, `<g class="kit-objeto" data-objeto="hoja" data-prueba="si">${s}</g>`, { alt: alt(datos, estado) });
  }

  function alt(datos, estado = {}) {
    const d = mezcla(datos, estado), D = dobleces(d), L = D.b ** D.k;
    const como = D.b === 3 ? 'en tres' : 'por la mitad';
    let t = d.abierta ? `Una hoja de cuaderno abierta, con los pliegues de ${D.k} dobleces ${como}: ${L} partes iguales.`
      : `Una hoja de cuaderno doblada ${como} ${D.m} ${D.m === 1 ? 'vez' : 'veces'}${D.n ? ` y ${D.n} ${D.n === 1 ? 'vez' : 'veces'} más` : ''}; ${d.canto === false ? 'las capas no se muestran' : `de canto se ven ${d.total === '?' ? 'sus capas, sin contar' : `${L} ${L === 1 ? 'capa' : 'capas'}`}`}.`;
    if (d.parte !== undefined && d.parte !== false) t += ` Una parte rotulada: ${d.parte}.`;
    if (D.topado) t += D.b === 3 ? ' En tres, la hoja no da para más de 3 dobleces.' : ' Por la mitad, la figura llega a 5 dobleces.';
    return t;
  }

  return { id: 'alg-objeto', dibujar, alt, geometria, constantes: { W, H, M, HOJA, CANTO } };
});
