/*
 * Pieza «alg-objeto» (17 nov 2026): objetos de la vida real para la teoría de Álgebra, uno por idea, en una sola pieza
 * (como trig-objeto; docs/etapa3/propuesta-algebra-exponentes.md §2). Dibujo de prueba (data-prueba): Gerson decide
 * después si lo reemplaza (docs/plan-calidad.md, M4). Por ahora trae un objeto:
 *
 *   'hoja'     una hoja de cuaderno que se dobla por la mitad (o en tres, como una carta), idea «leyes-exponentes» de
 *              contenido/teoria/algebra/exponentes-y-productos-notables.js (datos abajo);
 *   'huertos'  dos biohuertos cuadrados del colegio y el que junta sus áreas, idea «radicales» (18 nov): el área es el
 *              radicando y el lado del cerco, la raíz; abajo, los dos lados seguidos contra el lado del junto.
 *              datos = { objeto: 'huertos', a, b (m²; 0: no va), junto: false, comparar: false, escala (px por m),
 *              ladoA | ladoB | ladoJ: true | '?' | false, areaA | areaB | areaJ: true | '?' | false, nombreA… };
 *              a en naranja, b en turquesa, el junto en tinta con su lado en violeta (lo que se busca);
 *   'caja'     una caja cúbica de cartón de V dm³ junto a una loseta cuadrada de V dm², idea «exponente-fraccionario»
 *              (18 nov): la arista es ∛V y el lado, √V; misma escala (16 por dm) y cuadrícula de 1 dm si es entera.
 *              datos = { objeto: 'caja', V, loseta: false, arista | lado: true | '?' | false, tapa: '9 dm²' | '?',
 *              volumen | area: '?', cuadricula: false }; lo que se da en tinta, lo que resulta en violeta, lo que se pide
 *              con «?» (y entonces sin cuadrícula: contar los cuadritos daría la respuesta);
 *   'terreno'  el terreno cuadrado de Juan, en Juliaca, visto desde arriba, idea «cuadrado-suma» de Productos notables
 *              (18 nov). datos = { objeto: 'terreno', a, b (m), modo: 'amplia' | 'cede', escala, lados: false,
 *              ladoA | ladoB: '?' | false, piezas: true (rótulos de área), rot: { a2, ab, b2 } (rótulos propios o '?'),
 *              comprar: true (franjas punteadas, todavía sin comprar), total: true | '?' | texto | false; en 'cede':
 *              costado, fondo: true, esquina: 'doble' | 'devuelta', resto: '?' | texto }. a² naranja, las franjas ab
 *              violeta (el doble producto), la esquina b² turquesa, el total y lo que queda en tinta.
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

  function geoHoja(d) {
    const D = dobleces(d), { b, m, n, k } = D;
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

  function dibHoja(datos, estado) {
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

  function altHoja(d) {
    const D = dobleces(d), L = D.b ** D.k;
    const como = D.b === 3 ? 'en tres' : 'por la mitad';
    let t = d.abierta ? `Una hoja de cuaderno abierta, con los pliegues de ${D.k} dobleces ${como}: ${L} partes iguales.`
      : `Una hoja de cuaderno doblada ${como} ${D.m} ${D.m === 1 ? 'vez' : 'veces'}${D.n ? ` y ${D.n} ${D.n === 1 ? 'vez' : 'veces'} más` : ''}; ${d.canto === false ? 'las capas no se muestran' : `de canto se ven ${d.total === '?' ? 'sus capas, sin contar' : `${L} ${L === 1 ? 'capa' : 'capas'}`}`}.`;
    if (d.parte !== undefined && d.parte !== false) t += ` Una parte rotulada: ${d.parte}.`;
    if (D.topado) t += D.b === 3 ? ' En tres, la hoja no da para más de 3 dobleces.' : ' Por la mitad, la figura llega a 5 dobleces.';
    return t;
  }

  // ---------- Objeto 'huertos': dos biohuertos cuadrados y el que junta sus áreas (idea «radicales») ----------
  // El área es el radicando; el lado del cerco, la raíz. Cada biohuerto va centrado en su casilla, con la misma escala
  // para los tres (los lados se comparan de verdad). Abajo, dos barras a la misma escala: los dos lados seguidos y el
  // lado del biohuerto junto.
  const HU = { piso: 150, casillas: [[8, 102], [106, 200], [204, 312]], kMax: 6.7 };
  const fmt = (x, d = 1) => (Math.abs(x - Math.round(x)) < 1e-9 ? String(Math.round(x)) : `≈ ${(Math.round(x * 10 ** d) / 10 ** d).toFixed(d).replace('.', ',')}`);
  const raizTxt = x => fmt(Math.sqrt(x));
  function geoHuertos(d) {
    const A = Math.max(0, +d.a || 0), B = Math.max(0, +d.b || 0), J = A + B, junto = d.junto !== false;
    const lista = [['a', A, 'o'], ['b', B, 'i']].concat(junto ? [['junto', J, null]] : []).filter(x => x[1] > 0);
    const sMax = Math.max(...lista.map(x => Math.sqrt(x[1])), 1);
    const k = d.escala > 0 ? d.escala : Math.min(HU.kMax, 92 / sMax);
    const objetos = [], textos = [], cuad = [];
    const nombres = { a: d.nombreA || 'Biohuerto 1', b: d.nombreB || 'Biohuerto 2', junto: d.nombreJ || 'Los dos juntos' };
    lista.forEach(([que, area, col], i) => {
      const [c0, c1] = HU.casillas[que === 'junto' ? 2 : que === 'b' ? 1 : 0], cx = (c0 + c1) / 2, w = Math.sqrt(area) * k;
      const q = { que, area, col, s: Math.sqrt(area), x0: cx - w / 2, x1: cx + w / 2, y0: HU.piso - w, y1: HU.piso, cx };
      cuad.push(q);
      objetos.push({ que: `biohuerto ${que}`, x0: q.x0 - 2, y0: q.y0 - 2, x1: q.x1 + 2, y1: q.y1 + 2 });
      const nom = [[nombres[que], null, 600]];
      textos.push(Object.assign(cajaTexto('nombre', cx, 30, nom, 12, 'middle'), { segs: nom, x: cx, y: 30, tam: 12 }));
      // El lado, arriba (o «?»), y el área, abajo (o «?»). Lo que no se rotula: false.
      const lado = d[`lado${que === 'junto' ? 'J' : que.toUpperCase()}`], ar = d[`area${que === 'junto' ? 'J' : que.toUpperCase()}`];
      if (lado !== false) {
        const segs = lado === '?' ? [['? m', null, 700]] : [[`${raizTxt(area)} m`, que === 'junto' ? 'f' : col, 700]];
        const y = Math.min(q.y0 - 6, 140);
        textos.push(Object.assign(cajaTexto('lado', cx, y, segs, 13, 'middle'), { segs, x: cx, y, tam: 13 }));
      }
      if (ar !== false) {
        const segs = ar === '?' ? [['? m²', null, 700]] : [[`${fmt(area, 2)} m²`, que === 'junto' ? null : col, 700]];
        textos.push(Object.assign(cajaTexto('area', cx, 170, segs, 13, 'middle'), { segs, x: cx, y: 170, tam: 13 }));
      }
    });
    // Las barras: los dos lados seguidos y el lado del junto, a la misma escala de los biohuertos.
    const barras = [];
    if (junto && d.comparar !== false && A > 0 && B > 0) {
      const sA = Math.sqrt(A), sB = Math.sqrt(B), sJ = Math.sqrt(J), x0 = 14;
      const exacto = [sA, sB].every(x => Math.abs(x - Math.round(x)) < 1e-9), sin = x => fmt(x).replace('≈ ', '');
      const t1 = [[sin(sA), 'o', 700], [' + '], [sin(sB), 'i', 700], [exacto ? ' = ' : ' ≈ '], [`${sin(sA + sB)} m`, null, 700]];
      const pJ = d.ladoJ === '?';
      const t2 = [[pJ ? '? m' : `${raizTxt(J)} m`, pJ ? null : 'f', 700]];
      barras.push({ y: 196, tramos: [[x0, x0 + sA * k, 'o'], [x0 + sA * k, x0 + (sA + sB) * k, 'i']], segs: t1 },
        { y: 224, tramos: [[x0, x0 + sJ * k, pJ ? null : 'f']], segs: t2 });
      for (const b of barras) {
        const xf = b.tramos[b.tramos.length - 1][1];
        objetos.push({ que: 'barra', x0, y0: b.y - 4, x1: xf, y1: b.y + 4 });
        b.tx = xf + 8;
        textos.push(Object.assign(cajaTexto('barra', b.tx, b.y + 5, b.segs, 13), { segs: b.segs, x: b.tx, y: b.y + 5, tam: 13 }));
      }
    }
    return { W, H, M, d, k, cuad, barras, objetos, textos };
  }
  function dibHuertos(datos, estado) {
    const g = geometria(datos, estado);
    let s = '';
    for (const q of g.cuad) {
      const w = q.x1 - q.x0, c = q.col ? `var(--c-${q.col})` : 'currentColor';
      s += `<g class="alg-biohuerto" data-huerto="${q.que}"><rect x="${n2(q.x0)}" y="${n2(q.y0)}" width="${n2(w)}" height="${n2(w)}" fill="${c}" fill-opacity="0.1" stroke="${c}" stroke-width="2.5"/>`;
      // Postes del cerco, cada 8 de lado, y almácigos en filas (solo si el biohuerto es grande).
      let postes = '';
      const np = Math.max(1, Math.round(w / 8));
      for (let i = 0; i <= np; i++) { const t = (i / np) * w; postes += `M${n2(q.x0 + t)} ${n2(q.y0 - 3)}v6M${n2(q.x0 + t)} ${n2(q.y1 - 3)}v6M${n2(q.x0 - 3)} ${n2(q.y0 + t)}h6M${n2(q.x1 - 3)} ${n2(q.y0 + t)}h6`; }
      s += `<path d="${postes}" stroke="${c}" stroke-width="1.5" fill="none"/>`;
      if (w >= 24) {
        let pl = '';
        for (let yy = q.y0 + 9; yy < q.y1 - 5; yy += 10) for (let xx = q.x0 + 8; xx < q.x1 - 5; xx += 10) pl += `M${n2(xx - 3)} ${n2(yy - 3)}L${n2(xx)} ${n2(yy + 1)}L${n2(xx + 3)} ${n2(yy - 3)}`;
        s += `<path d="${pl}" stroke="currentColor" stroke-opacity="0.45" stroke-width="1.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
      }
      s += '</g>';
    }
    for (const b of g.barras) for (const [x0, x1, c] of b.tramos) s += `<line class="alg-barra" x1="${n2(x0)}" y1="${b.y}" x2="${n2(x1)}" y2="${b.y}" stroke="${c ? `var(--c-${c})` : 'currentColor'}" stroke-width="6" stroke-linecap="butt"/>`;
    for (const t of g.textos) s += texto(t.x, t.y, t.segs, { tam: t.tam, ancla: t.que === 'barra' ? 'start' : 'middle' });
    return T.svg(W, H, `<g class="kit-objeto" data-objeto="huertos" data-prueba="si">${s}</g>`, { alt: alt(datos, estado) });
  }
  function altHuertos(d) {
    const A = +d.a || 0, B = +d.b || 0, partes = [];
    if (A > 0) partes.push(`un biohuerto cuadrado de ${A} m²${d.ladoA === '?' ? ', de lado por hallar' : ''}`);
    if (B > 0) partes.push(`otro de ${B} m²`);
    let t = `Biohuertos cercados del colegio: ${partes.join(' y ')}.`;
    if (d.junto !== false && A > 0 && B > 0) t += ` Al lado, uno solo que junta sus áreas: ${A + B} m², con su lado ${d.ladoJ === '?' ? 'por hallar' : `de ${raizTxt(A + B)} m`}.`;
    return t;
  }

  // ---------- Objeto 'caja': una caja cúbica de cartón y una loseta cuadrada con el mismo número (idea 3) ----------
  // La caja tiene V dm³ y la loseta V dm²: la arista es ∛V y el lado, √V. Las dos van a la misma escala (16 por dm), con
  // su cuadrícula de 1 dm cuando la medida es entera. Lo que se pide va con «?» en tinta.
  const CA = { piso: 194, xc: 44, xl: 168, k: 16 };
  function geoCaja(d) {
    // Sin loseta, la caja va al centro y más grande (22 por dm): no queda media figura vacía.
    const V = Math.max(1, +d.V || 1), sola = d.loseta === false, k = d.escala > 0 ? d.escala : sola ? 22 : CA.k;
    const a = Math.cbrt(V), t = Math.sqrt(V), L = a * k, dx = 0.5 * L, dy = -0.32 * L, T2 = t * k;
    const xc = sola ? (W - 1.5 * L) / 2 - 20 : CA.xc;
    const cubo = { x0: xc, x1: xc + L, y0: CA.piso - L, y1: CA.piso, dx, dy, L, a };
    const losa = d.loseta === false ? null : { x0: CA.xl, x1: CA.xl + T2, y0: CA.piso - T2, y1: CA.piso, t };
    const objetos = [{ que: 'caja', x0: cubo.x0, y0: cubo.y0 + dy, x1: cubo.x1 + dx, y1: cubo.y1 }];
    if (losa) objetos.push({ que: 'loseta', x0: losa.x0, y0: losa.y0, x1: losa.x1, y1: losa.y1 });
    const textos = [];
    const pon = (que, x, y, segs, ancla = 'middle', tam = 13) => textos.push(Object.assign(cajaTexto(que, x, y, segs, tam, ancla), { segs, x, y, tam, ancla }));
    // Debajo: el volumen y el área (tinta: son el número que se da).
    pon('volumen', (cubo.x0 + cubo.x1 + dx) / 2, 216, [[d.volumen === '?' ? '? dm³' : `${fmt(V, 2)} dm³`, null, 700]]);
    if (losa) pon('area', (losa.x0 + losa.x1) / 2, 216, [[d.area === '?' ? '? dm²' : `${fmt(V, 2)} dm²`, null, 700]]);
    pon('nombre', (cubo.x0 + cubo.x1 + dx) / 2, 236, [['caja de cartón']], 'middle', 12);
    if (losa) pon('nombre', (losa.x0 + losa.x1) / 2, 236, [['loseta']], 'middle', 12);
    // La arista (a la izquierda de la cara de adelante) y el lado de la loseta (arriba).
    if (d.arista !== undefined && d.arista !== false) pon('arista', cubo.x0 - 6, (cubo.y0 + cubo.y1) / 2 + 5, [[d.arista === '?' ? '?' : `${fmt(a)} dm`, d.arista === '?' ? null : 'f', 700]], 'end');
    if (losa && d.lado !== undefined && d.lado !== false) pon('lado', (losa.x0 + losa.x1) / 2, losa.y0 - 7, [[d.lado === '?' ? '?' : `${fmt(t)} dm`, d.lado === '?' ? null : 'f', 700]]);
    // La tapa (la cara de arriba): su área o «?», a la derecha del cubo.
    if (d.tapa !== undefined && d.tapa !== false) pon('tapa', cubo.x1 + dx + 6, cubo.y0 + dy / 2 + 4, [[d.tapa === '?' ? 'tapa: ?' : `tapa: ${d.tapa}`, d.tapa === '?' ? null : 'f', 700]], 'start');
    return { W, H, M, d, V, cubo, losa, objetos, textos };
  }
  function dibCaja(datos, estado) {
    const g = geometria(datos, estado), d = g.d, c = g.cubo, { dx, dy, L } = c;
    const P = pts => pts.map(([x, y]) => `${n2(x)} ${n2(y)}`).join('L');
    const frente = [[c.x0, c.y0], [c.x1, c.y0], [c.x1, c.y1], [c.x0, c.y1]];
    const tapa = [[c.x0, c.y0], [c.x1, c.y0], [c.x1 + dx, c.y0 + dy], [c.x0 + dx, c.y0 + dy]];
    const lado = [[c.x1, c.y0], [c.x1 + dx, c.y0 + dy], [c.x1 + dx, c.y1 + dy], [c.x1, c.y1]];
    const tapaPide = d.tapa === '?', tapaDa = d.tapa !== undefined && d.tapa !== false && !tapaPide;
    let s = `<g class="alg-caja"><path d="M${P(lado)}Z" fill="currentColor" fill-opacity="0.12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`
      + `<path d="M${P(tapa)}Z" fill="${tapaDa ? 'var(--c-f)' : 'currentColor'}" fill-opacity="${tapaDa || tapaPide ? 0.22 : 0.06}" stroke="${tapaDa ? 'var(--c-f)' : 'currentColor'}" stroke-width="2" stroke-linejoin="round"/>`
      + `<path d="M${P(frente)}Z" fill="var(--card)" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`;
    // Cuadrícula de 1 dm en las tres caras, si la arista es entera.
    // Si algo se pide («?»), sin cuadrícula: contar los cuadritos daría la respuesta.
    const pide = [d.arista, d.lado, d.tapa, d.volumen, d.area].includes('?') || d.cuadricula === false;
    const a = Math.round(c.a);
    if (!pide && Math.abs(c.a - a) < 1e-9 && a > 1) {
      let gr = '';
      for (let i = 1; i < a; i++) {
        const u = i / a;
        gr += `M${n2(c.x0 + u * L)} ${n2(c.y0)}V${n2(c.y1)}M${n2(c.x0)} ${n2(c.y0 + u * L)}H${n2(c.x1)}`;
        gr += `M${n2(c.x0 + u * L)} ${n2(c.y0)}L${n2(c.x0 + u * L + dx)} ${n2(c.y0 + dy)}M${n2(c.x0 + u * dx)} ${n2(c.y0 + u * dy)}L${n2(c.x1 + u * dx)} ${n2(c.y0 + u * dy)}`;
        gr += `M${n2(c.x1 + u * dx)} ${n2(c.y0 + u * dy)}L${n2(c.x1 + u * dx)} ${n2(c.y1 + u * dy)}M${n2(c.x1)} ${n2(c.y0 + u * L)}L${n2(c.x1 + dx)} ${n2(c.y0 + u * L + dy)}`;
      }
      s += `<path d="${gr}" stroke="currentColor" stroke-opacity="0.35" stroke-width="1" fill="none"/>`;
    }
    // Una cinta de embalaje cruza la tapa (que se reconozca la caja).
    s += `<path d="M${n2(c.x0 + L / 2)} ${n2(c.y0)}L${n2(c.x0 + L / 2 + dx)} ${n2(c.y0 + dy)}" stroke="currentColor" stroke-width="3" stroke-opacity="0.35"/>`;
    if (d.arista !== undefined && d.arista !== false) s += `<line x1="${n2(c.x0)}" y1="${n2(c.y0)}" x2="${n2(c.x0)}" y2="${n2(c.y1)}" stroke="${d.arista === '?' ? 'currentColor' : 'var(--c-f)'}" stroke-width="4"/>`;
    s += '</g>';
    if (g.losa) {
      const q = g.losa, w = q.x1 - q.x0, t = Math.round(q.t);
      s += `<g class="alg-loseta"><rect x="${n2(q.x0)}" y="${n2(q.y0)}" width="${n2(w)}" height="${n2(w)}" fill="currentColor" fill-opacity="0.08" stroke="currentColor" stroke-width="2"/>`;
      if (!pide && Math.abs(q.t - t) < 1e-9 && t > 1) {
        let gr = '';
        for (let i = 1; i < t; i++) gr += `M${n2(q.x0 + i * w / t)} ${n2(q.y0)}V${n2(q.y1)}M${n2(q.x0)} ${n2(q.y0 + i * w / t)}H${n2(q.x1)}`;
        s += `<path d="${gr}" stroke="currentColor" stroke-opacity="0.3" stroke-width="1" fill="none"/>`;
      }
      if (d.lado !== undefined && d.lado !== false) s += `<line x1="${n2(q.x0)}" y1="${n2(q.y0)}" x2="${n2(q.x1)}" y2="${n2(q.y0)}" stroke="${d.lado === '?' ? 'currentColor' : 'var(--c-f)'}" stroke-width="4"/>`;
      s += '</g>';
    }
    for (const t of g.textos) s += texto(t.x, t.y, t.segs, { tam: t.tam, ancla: t.ancla });
    return T.svg(W, H, `<g class="kit-objeto" data-objeto="caja" data-prueba="si">${s}</g>`, { alt: alt(datos, estado) });
  }
  function altCaja(d) {
    const V = +d.V || 1;
    let t = `Una caja cúbica de cartón de ${fmt(V, 2)} dm³${d.loseta === false ? '' : ` y una loseta cuadrada de ${fmt(V, 2)} dm²`}.`;
    if (d.arista !== undefined && d.arista !== false) t += d.arista === '?' ? ' Se pide la arista de la caja.' : ` La arista de la caja mide ${fmt(Math.cbrt(V))} dm.`;
    if (d.lado !== undefined && d.lado !== false && d.loseta !== false) t += d.lado === '?' ? ' Se pide el lado de la loseta.' : ` El lado de la loseta mide ${fmt(Math.sqrt(V))} dm.`;
    if (d.tapa !== undefined && d.tapa !== false) t += d.tapa === '?' ? ' Se pide el área de la tapa.' : ` La tapa mide ${d.tapa}.`;
    return t;
  }


  // ---------- Objeto 'terreno': el terreno cuadrado de Juan, en Juliaca (idea «cuadrado-suma» de Productos notables) ----------
  // Visto desde arriba, con su cerco y la casa en una esquina. Modo 'amplia': Juan compra una franja de b por el costado y
  // otra por el fondo; el terreno nuevo, de lado a + b, son cuatro piezas: a² (naranja), dos franjas ab (violeta: el doble
  // producto, lo que se olvida) y la esquina b² (turquesa); el total en tinta. Modo 'cede': de un terreno de lado a se
  // quitan dos franjas de ancho b (costado y fondo) para la vereda: las dos franjas se pisan en la esquina.
  const TE = { x0: 66, y0: 44, lado: 176, kMax: 22 };
  const m2 = x => `${fmt(x, 2)} m²`;
  function geoTerreno(d) {
    const a = Math.max(1, +d.a || 1), b = Math.max(0, +d.b || 0), cede = d.modo === 'cede';
    const S = cede ? a : a + b, k = d.escala > 0 ? d.escala : Math.min(TE.kMax, TE.lado / S);
    const x0 = TE.x0, y0 = TE.y0, A = a * k, B = b * k, W2 = S * k;
    const objetos = [{ que: 'terreno', x0: x0 - 3, y0: y0 - 3, x1: x0 + W2 + 3, y1: y0 + W2 + 3 }], textos = [];
    const pon = (que, x, y, segs, ancla = 'middle', tam = 13) => textos.push(Object.assign(cajaTexto(que, x, y, segs, tam, ancla), { segs, x, y, tam, ancla }));
    const rot = (v, def) => (v === undefined || v === true ? def : v === false ? null : String(v));
    // Lados: arriba y a la izquierda (a naranja, b turquesa; «?» en tinta).
    const ladoA = rot(d.ladoA, `${fmt(a, 2)} m`), ladoB = rot(d.ladoB, `${fmt(b, 2)} m`);
    if (d.lados !== false) {
      if (cede) {
        if (ladoA) { pon('lado', x0 + W2 / 2, y0 - 10, [[ladoA, ladoA === '?' ? null : 'o', 700]]); pon('lado', x0 - 8, y0 + W2 / 2 + 5, [[ladoA, ladoA === '?' ? null : 'o', 700]], 'end'); }
        // El ancho de las franjas, recién cuando hay una franja a la vista.
        if (ladoB && B > 0 && (d.costado || d.fondo)) pon('lado', x0 + W2 + 6, y0 + W2 - B / 2 + 5, [[ladoB, ladoB === '?' ? null : 'i', 700]], 'start');
      } else {
        if (ladoA) { pon('lado', x0 + A / 2, y0 - 10, [[ladoA, ladoA === '?' ? null : 'o', 700]]); pon('lado', x0 - 8, y0 + A / 2 + 5, [[ladoA, ladoA === '?' ? null : 'o', 700]], 'end'); }
        if (ladoB && B > 0) { pon('lado', x0 + A + B / 2, y0 - 10 - (B < 34 ? 14 : 0), [[ladoB, ladoB === '?' ? null : 'i', 700]]); pon('lado', x0 - 8, y0 + A + B / 2 + 5 + (B < 24 ? 12 : 0), [[ladoB, ladoB === '?' ? null : 'i', 700]], 'end'); }
      }
    }
    // Las piezas: dónde va cada una y su rótulo de área (si cabe).
    const piezas = [];
    const pieza = (que, x, y, w, h, color, area, rotulo) => {
      piezas.push({ que, x, y, w, h, color });
      const t = rotulo === undefined ? (d.piezas ? m2(area) : null) : rotulo;
      if (t) {
        const segs = [[t, t === '?' ? null : color, 700]], ancho = T.ancho(t, 13, 700);
        if (ancho + 6 <= w && h >= 18) pon('pieza', x + w / 2, y + h / 2 + 5, segs);
      }
    };
    const R = d.rot || {};
    if (!cede) {
      pieza('a2', x0, y0, A, A, 'o', a * a, R.a2);
      if (B > 0) {
        pieza('ab', x0 + A, y0, B, A, d.comprar ? null : 'f', a * b, R.ab);
        pieza('ab', x0, y0 + A, A, B, d.comprar ? null : 'f', a * b, R.ab);
        pieza('b2', x0 + A, y0 + A, B, B, d.comprar ? null : 'i', b * b, R.b2);
      }
    } else {
      const C = A - B;
      pieza('resto', x0, y0, C, C, null, (a - b) ** 2, d.resto === undefined ? null : d.resto === false ? null : String(d.resto));
      if (d.costado) pieza('costado', x0 + C, y0, B, A, 'f', a * b, d.piezas ? m2(a * b) : null);
      if (d.fondo) pieza('fondo', x0, y0 + C, A, B, 'f', a * b, null);
    }
    // El total, debajo.
    const total = d.total === false ? null : d.total === '?' ? '? m²' : d.total === undefined || d.total === true ? (cede ? null : `(${fmt(a, 2)} + ${fmt(b, 2)})² = ${m2(S * S)}`) : String(d.total);
    // A la izquierda alineado con el terreno (los rótulos de los lados quedan más a la izquierda y no se pisan).
    if (total) pon('total', x0, Math.min(y0 + W2 + 22, 240), [[total, null, 700]], 'start');
    return { W, H, M, d, a, b, k, x0, y0, A, B, S, W2, cede, piezas, objetos, textos };
  }
  function dibTerreno(datos, estado) {
    const g = geometria(datos, estado), d = g.d, { x0, y0, A, B, W2 } = g;
    let s = '';
    // El terreno: fondo, piezas y cerco.
    s += `<rect class="alg-terreno" x="${n2(x0)}" y="${n2(y0)}" width="${n2(W2)}" height="${n2(W2)}" fill="currentColor" fill-opacity="0.04"/>`;
    for (const p of g.piezas) {
      if (p.que === 'resto') continue;
      const c = p.color ? `var(--c-${p.color})` : 'currentColor';
      const punteada = d.comprar && p.que !== 'a2';
      s += `<rect class="alg-pieza" data-pieza="${p.que}" x="${n2(p.x)}" y="${n2(p.y)}" width="${n2(p.w)}" height="${n2(p.h)}" fill="${c}" fill-opacity="${punteada ? 0 : p.color === 'o' ? 0.1 : 0.2}" stroke="${c}" stroke-width="2"${punteada ? ' stroke-dasharray="5 4"' : ''}/>`;
    }
    if (g.cede) {
      const C = A - B, rest = g.piezas.find(p => p.que === 'resto');
      s += `<rect class="alg-pieza" data-pieza="a2" x="${n2(x0)}" y="${n2(y0)}" width="${n2(A)}" height="${n2(A)}" fill="none" stroke="var(--c-o)" stroke-width="2.5"/>`;
      if (rest && d.resto !== undefined && d.resto !== false) s += `<rect x="${n2(x0)}" y="${n2(y0)}" width="${n2(C)}" height="${n2(C)}" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="6 4"/>`;
      // La esquina que se quitó dos veces: turquesa, con «× 2»; devuelta: con «+».
      if (d.esquina) {
        s += `<rect class="alg-esquina" x="${n2(x0 + C)}" y="${n2(y0 + C)}" width="${n2(B)}" height="${n2(B)}" fill="var(--c-i)" fill-opacity="${d.esquina === 'doble' ? 0.45 : 0.12}" stroke="var(--c-i)" stroke-width="2.5"/>`;
        s += texto(x0 + A + 6, y0 + A + 12, [[d.esquina === 'doble' ? 'esquina: se quitó 2 veces' : 'esquina: se devuelve 1', 'i', 700]], { tam: 12 });
      }
    } else {
      // La casa de Juan, en la esquina de arriba del terreno de antes.
      const hx = x0 + 8, hy = y0 + 8, hw = Math.min(24, A * 0.3);
      if (A >= 70) s += `<path d="M${n2(hx)} ${n2(hy + hw * 0.4)}L${n2(hx + hw / 2)} ${n2(hy)}L${n2(hx + hw)} ${n2(hy + hw * 0.4)}V${n2(hy + hw)}H${n2(hx)}Z" fill="var(--card)" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>`;
    }
    // Cerco: el borde del terreno, con postes.
    let postes = '';
    const np = Math.max(2, Math.round(W2 / 12));
    for (let i = 0; i <= np; i++) { const t = (i / np) * W2; postes += `M${n2(x0 + t)} ${n2(y0 - 3)}v6M${n2(x0 + t)} ${n2(y0 + W2 - 3)}v6M${n2(x0 - 3)} ${n2(y0 + t)}h6M${n2(x0 + W2 - 3)} ${n2(y0 + t)}h6`; }
    s += `<rect x="${n2(x0)}" y="${n2(y0)}" width="${n2(W2)}" height="${n2(W2)}" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="${postes}" stroke="currentColor" stroke-width="1.5" fill="none"/>`;
    for (const t of g.textos) s += texto(t.x, t.y, t.segs, { tam: t.tam, ancla: t.ancla });
    return T.svg(W, H, `<g class="kit-objeto" data-objeto="terreno" data-prueba="si">${s}</g>`, { alt: alt(datos, estado) });
  }
  function altTerreno(d) {
    const a = +d.a || 1, b = +d.b || 0;
    if (d.modo === 'cede') return `El terreno cuadrado de ${fmt(a, 2)} m de lado cede una franja de ${fmt(b, 2)} m por el costado y otra por el fondo para la vereda${d.resto && d.resto !== '?' ? `; queda un cuadrado de ${d.resto}` : ''}.`;
    return `El terreno cuadrado de Juan, de ${d.ladoA === '?' ? 'lado por hallar' : `${fmt(a, 2)} m de lado`}, con una franja de ${fmt(b, 2)} m por el costado y otra por el fondo: un cuadrado más grande, con dos franjas y una esquina.`;
  }

  // ---------- Elige el objeto ----------
  const OBJ = { hoja: [geoHoja, dibHoja, altHoja], huertos: [geoHuertos, dibHuertos, altHuertos], caja: [geoCaja, dibCaja, altCaja], terreno: [geoTerreno, dibTerreno, altTerreno] };
  const de = d => OBJ[d && OBJ[d.objeto] ? d.objeto : 'hoja'];
  function geometria(datos, estado = {}) { const d = mezcla(datos, estado); return de(d)[0](d); }
  function dibujar(datos, estado = {}) { return de(mezcla(datos, estado))[1](datos, estado); }
  function alt(datos, estado = {}) { const d = mezcla(datos, estado); return de(d)[2](d); }

  return { id: 'alg-objeto', dibujar, alt, geometria, constantes: { W, H, M, HOJA, CANTO, HU, CA, TE } };
});
