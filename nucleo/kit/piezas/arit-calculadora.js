/*
 * Pieza «arit-calculadora» (18 nov 2026): la calculadora de bolsillo de doña Juana, con una pantalla de 8 casillas, para
 * la idea 7 de «Las cuatro operaciones» (contenido/teoria/aritmetica/cuatro-operaciones.js; docs/etapa4/propuesta-
 * aritmetica.md §2). Dibujo de prueba (data-prueba): Gerson decide después si lo reemplaza (docs/plan-calidad.md, M4).
 *
 * Afirmación de la figura: cada casilla de la pantalla guarda una cifra; si el resultado tiene más cifras que casillas,
 * no cabe y la calculadora muestra «E». Una o dos calculadoras lado a lado (el caso menor y el mayor, para compararlos).
 *
 * datos = {
 *   casillas: 8,                              cuántas casillas tiene la pantalla (de 4 a 10)
 *   calcs: [{                                 una o dos calculadoras
 *     cuenta: '10 000 × 100',                 la cuenta tecleada, arriba de la pantalla (en tinta)
 *     pantalla: '1000000' | '?' | 'E',        las cifras del resultado, desde la casilla de la derecha; '?' (lo que se
 *                                             pide, en tinta y centrado); 'E', o cifras de más, no caben: «E» a la izquierda
 *     color: false,                           el resultado en tinta (cuando el violeta delataría); por defecto, violeta
 *     rotulo: 'el menor',                     debajo de la calculadora
 *   }],
 *   pasos: [{ …datos }, …],                   para «Mira»: estado.paso elige qué cambia (se mezcla con los datos)
 * }
 * estado = { paso }.
 * Función pura de (datos): sin ids, sin azar, sin reloj. Lienzo de 320 × 220. Colores: tinta (currentColor) y var(--c-*):
 * las casillas (la capacidad de la pantalla, el «envase») en turquesa (i), el resultado en violeta (f, lo que se busca),
 * la cuenta y lo que se pide en tinta. Nunca verde ni carmín.
 * geometria(datos) da las cajas de todo lo dibujado, para la prueba numérica de encuadre.
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
  const W = 320, H = 220, M = 4;
  const n2 = T.n;
  const Y0 = 6, Y1 = 186, YROT = 206;          // cuerpo de la calculadora y línea base del rótulo
  const YCU = 36, YP0 = 44, YP1 = 82;           // cuenta tecleada y pantalla
  const TC = 13, TD = 17, TR = 14;              // tamaños: cuenta, cifras de la pantalla, rótulo

  const casillasDe = d => Math.max(4, Math.min(10, Math.floor(+((d && d.casillas) || 8)) || 8));
  function calcsDe(d) {
    const cs = Array.isArray(d && d.calcs) && d.calcs.length ? d.calcs.slice(0, 2) : [{ pantalla: '?' }];
    return cs.map(c => Object.assign({ cuenta: '', pantalla: '?', rotulo: '' }, c || {}));
  }
  // Lo que se ve en cada casilla: las cifras desde la derecha; si no caben, «E» en la primera.
  function vista(c, K) {
    const p = String(c.pantalla === undefined || c.pantalla === null ? '?' : c.pantalla).replace(/\s+/g, '');
    if (p === '?') return { pide: true, cifras: [] };
    if (p === 'E' || p.length > K) return { error: true, cifras: [] };
    return { cifras: p.split('') };
  }

  function mezcla(datos, estado) {
    const ps = (datos && datos.pasos) || [];
    const p = ps[Math.max(0, Math.min(ps.length - 1, (estado && estado.paso) | 0))];
    return Object.assign({}, datos || {}, p || {});
  }
  function geometria(datos, estado = {}) {
    const d = mezcla(datos, estado), K = casillasDe(d), cs = calcsDe(d), dos = cs.length === 2;
    const ancho = dos ? 148 : 204, x0s = dos ? [8, 164] : [(W - ancho) / 2];
    const objetos = [], textos = [], cajas = [];
    const calcs = cs.map((c, i) => {
      const x0 = x0s[i], x1 = x0 + ancho, px0 = x0 + 10, px1 = x1 - 10, cw = (px1 - px0 - 6) / K;
      const casilla = j => ({ x0: px0 + 3 + j * cw, x1: px0 + 3 + (j + 1) * cw });   // j = 0 es la de la izquierda
      const v = vista(c, K);
      objetos.push({ que: 'calculadora', x0, y0: Y0, x1, y1: Y1 });
      objetos.push({ que: 'pantalla', x0: px0, y0: YP0, x1: px1, y1: YP1, dentro: 'calculadora' });
      const yD = YP1 - 10;
      const items = [];
      if (c.cuenta) {
        const w = T.ancho(String(c.cuenta), TC, 600);
        items.push({ txt: String(c.cuenta), x: px1, y: YCU, tam: TC, peso: 600, ancla: 'end', color: null, x0: px1 - w, x1: px1, que: 'cuenta' });
      }
      if (v.pide) { const w = T.ancho('?', TD, 700), cx = (px0 + px1) / 2; items.push({ txt: '?', x: cx, y: yD, tam: TD, peso: 700, ancla: 'middle', color: null, x0: cx - w / 2, x1: cx + w / 2, que: 'pantalla' }); }
      else if (v.error) { const cj = casilla(0), cx = (cj.x0 + cj.x1) / 2, w = T.ancho('E', TD, 700); items.push({ txt: 'E', x: cx, y: yD, tam: TD, peso: 700, ancla: 'middle', color: null, x0: cx - w / 2, x1: cx + w / 2, que: 'pantalla' }); }
      else v.cifras.forEach((ch, k) => {
        const cj = casilla(K - v.cifras.length + k), cx = (cj.x0 + cj.x1) / 2, w = T.ancho(ch, TD, 700);
        items.push({ txt: ch, x: cx, y: yD, tam: TD, peso: 700, ancla: 'middle', color: c.color === false ? null : 'f', x0: cx - w / 2, x1: cx + w / 2, que: 'cifra' });
      });
      if (c.rotulo) {
        const w = T.ancho(String(c.rotulo), TR, 600), cx = (x0 + x1) / 2;
        items.push({ txt: String(c.rotulo), x: cx, y: YROT, tam: TR, peso: 600, ancla: 'middle', color: null, x0: cx - w / 2, x1: cx + w / 2, que: 'rotulo' });
      }
      for (const t of items) {
        const caja = { que: t.que, txt: t.txt, x0: t.x0, x1: t.x1, y0: t.y - t.tam * 0.8, y1: t.y + t.tam * 0.25 };
        textos.push(caja);
        if (t.que === 'cifra' || t.que === 'pantalla') cajas.push(Object.assign({ dentro: 'pantalla', calc: i }, caja));
        if (t.que === 'cuenta') cajas.push(Object.assign({ dentro: 'calculadora', calc: i }, caja));
      }
      return { x0, x1, px0, px1, cw, casilla, v, items, c };
    });
    return { W, H, M, K, calcs, objetos, textos, cajas };
  }

  function dibujar(datos, estado = {}) {
    const g = geometria(datos, estado);
    let s = '';
    for (const c of g.calcs) {
      const { x0, x1, px0, px1 } = c;
      // Cuerpo, panel solar chico arriba a la izquierda y pantalla.
      s += `<g class="ac-calculadora"><rect x="${n2(x0)}" y="${Y0}" width="${n2(x1 - x0)}" height="${Y1 - Y0}" rx="12" fill="currentColor" fill-opacity="0.06" stroke="currentColor" stroke-width="2"/>`;
      s += `<rect x="${n2(px0)}" y="${Y0 + 12}" width="34" height="10" rx="2" fill="currentColor" fill-opacity="0.18"/>`;
      for (let k = 1; k < 4; k++) s += `<line x1="${n2(px0 + k * 8.5)}" y1="${Y0 + 12}" x2="${n2(px0 + k * 8.5)}" y2="${Y0 + 22}" stroke="var(--card)" stroke-width="1"/>`;
      s += `<rect class="ac-pantalla" x="${n2(px0)}" y="${YP0}" width="${n2(px1 - px0)}" height="${YP1 - YP0}" rx="5" fill="var(--card)" stroke="currentColor" stroke-width="1.5"/>`;
      // Las casillas: una por cifra, en turquesa (la capacidad de la pantalla).
      for (let j = 0; j < g.K; j++) {
        const cj = c.casilla(j);
        s += `<rect class="ac-casilla" x="${n2(cj.x0 + 0.8)}" y="${YP0 + 5}" width="${n2(cj.x1 - cj.x0 - 1.6)}" height="${YP1 - YP0 - 10}" rx="2" fill="var(--c-i)" fill-opacity="0.06" stroke="var(--c-i)" stroke-width="1" stroke-opacity="0.7"/>`;
      }
      // Teclado: 4 × 4 teclas lisas (sin cifras, para que no se confundan con los datos).
      const kx0 = x0 + 14, kx1 = x1 - 14, ky0 = YP1 + 12, ky1 = Y1 - 12, kw = (kx1 - kx0 - 3 * 7) / 4, kh = (ky1 - ky0 - 3 * 6) / 4;
      for (let f = 0; f < 4; f++) for (let k = 0; k < 4; k++) {
        const op = k === 3;
        s += `<rect x="${n2(kx0 + k * (kw + 7))}" y="${n2(ky0 + f * (kh + 6))}" width="${n2(kw)}" height="${n2(kh)}" rx="4" fill="currentColor" fill-opacity="${op ? 0.2 : 0.1}" stroke="currentColor" stroke-width="1" stroke-opacity="0.45"/>`;
      }
      for (const t of c.items) s += `<text class="kit-txt" x="${n2(t.x)}" y="${n2(t.y)}" font-size="${t.tam}" font-weight="${t.peso}"${t.ancla !== 'start' ? ` text-anchor="${t.ancla}"` : ''} fill="${T.color(t.color)}" style="font-variant-numeric:tabular-nums">${T.esc(t.txt)}</text>`;
      s += '</g>';
    }
    return T.svg(W, H, `<g class="kit-objeto" data-objeto="calculadora" data-prueba="si">${s}</g>`, { alt: alt(datos, estado) });
  }

  function alt(datos, estado = {}) {
    const d = mezcla(datos, estado), K = casillasDe(d), cs = calcsDe(d);
    const una = c => {
      const v = vista(c, K), cu = c.cuenta ? `${c.cuenta} = ` : '';
      const p = v.pide ? '? (lo que se pide)' : v.error ? 'E: no cabe en la pantalla' : `${v.cifras.join('')} (${v.cifras.length} ${v.cifras.length === 1 ? 'cifra' : 'cifras'})`;
      return `${c.rotulo ? `${c.rotulo}: ` : ''}${cu}${p}`;
    };
    return `${cs.length === 2 ? 'Dos calculadoras' : 'Calculadora'} de doña Juana, con pantalla de ${K} casillas. ${cs.map(una).join('. ')}.`;
  }

  return { id: 'arit-calculadora', dibujar, alt, geometria, constantes: { W, H, M } };
});
