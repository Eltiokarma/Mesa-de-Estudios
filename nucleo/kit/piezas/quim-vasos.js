/*
 * Pieza «quim-vasos» (17 nov 2026, etapa 2 de química): recipientes de la vida real sobre una mesa (un vaso, un frasco
 * cerrado o un trozo de material) y, debajo de cada uno, su lupa: lo que hay adentro, muy aumentado. Sirve para
 * «¿sustancia pura o mezcla?» (quimica.materia-y-energia, idea 1) y para cualquier idea que compare cómo se ve algo por
 * fuera con las partículas que tiene. Dibujos de prueba (data-prueba): Gerson decide después cuáles reemplaza
 * (docs/plan-calidad.md, M4).
 *
 * Afirmación de la figura: lo que se ve por fuera (el vaso) y lo que hay adentro (la lupa) se leen a la vez; dos vasos
 * que se ven iguales pueden tener partículas distintas.
 *
 * Un dibujo de partículas, nunca de variables (docs/etapa2/decisiones.md): los objetos van en tinta (currentColor, con
 * tonos por opacidad) y los átomos con la paleta de elementos (var(--el-<Símbolo>), vía `el` en `atomos`), con su
 * relleno (lleno, hueco o con punto) para leerse también en grises. Esta pieza no usa colores de variable (var(--c-*)).
 * Las partículas las dibuja quim-particulas (especieSVG): la misma forma de cada especie en toda la química.
 *
 * Fidelidad: el número de partículas de cada lupa es exactamente el de los datos (si no caben, la prueba lo detecta con
 * `capacidad`); cada capa de la lupa es una fase, separada de la otra por una línea punteada; las bolitas son un modelo,
 * no una foto (el alt lo dice).
 *
 * datos = {
 *   recipientes: [{                                  // de 1 a 3, lado a lado sobre la misma mesa
 *     tipo: 'vaso' | 'frasco' | 'trozo',             // vaso abierto con líquido; frasco cerrado (gas); trozo de un sólido
 *     titulo: 'Agua destilada',                       // arriba; si no cabe en su ranura, se parte en dos líneas
 *     nivel: 0.75,                                    // vaso: alto del líquido (fracción del vaso)
 *     capa: { alto: 0.2 },                            // vaso: otra capa de líquido encima (aceite), fracción del vaso
 *     fondo: { tipo: 'arena' | 'sal', cantidad: 1 },  // vaso: granos redondos (arena, limaduras) o granitos cuadrados de
 *                                                     // sal o azúcar, cuya cantidad de 0 a 1 baja mientras se disuelven
 *     cubitos: 2,                                     // vaso: cubitos de hielo que flotan
 *     material: 'metal' | 'cristal',                  // trozo: cómo se ve
 *     lupa: {                                         // opcional: la lupa debajo
 *       foco: 0.5,                                    // dónde mira, de 0 (el fondo) a 1 (el borde), como nivel; se marca
 *       capas: [{ alto: 0.5, particulas: [{ e, n }], orden: 'azar' | 'filas' }],   // de arriba abajo; cada una, una fase
 *       vacia: true,                                  // la lupa sin mirar todavía: un «?» (para predecir)
 *       desde: 0,                                     // paso en que aparece (Mira)
 *     },
 *   }],
 *   atomos: { O: { el: 'O', estilo: 'lleno', r: 5 }, … },   especies: { H2O: [['O', 0, 0], ['H', -5, 4], ['H', 5, 4]] },
 *   separacion: 22,                                   // lado de la celda de cada partícula (por omisión 22; con tres lupas, 20)
 *   escala: 1,                                        // tamaño de las especies dentro de la lupa
 *   clave: true,                                      // fila al pie: cada elemento de las lupas, su bolita y su símbolo
 *   nombres: { H2O: 'agua' },                         // para el texto alternativo
 *   alt,
 * }
 * estado = { corte }: una lupa con desde > corte no se ve (su lugar queda reservado: el alto no cambia).
 * Función pura de (datos, estado): sin ids, sin azar, sin reloj. El alto depende solo de los datos.
 * geometria(datos) → { n, sw, lupa: { R, cy }, cx(k), mesa, alto }; capacidad(datos, k) → partículas que caben por capa.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const Kit = nodo ? require('../kit.js') : root.Kit;
  const T = nodo ? require('../trazo.js') : root.Kit.trazo;
  if (nodo) require('./quim-particulas.js');
  const api = fabrica(Kit, T);
  Kit.registrar(api);
  if (nodo) module.exports = api;
})(typeof self !== 'undefined' ? self : this, function (Kit, T) {
  'use strict';
  const W = 320, M = 4, HV = 84, TAM_TIT = 14, LINEA_TIT = 17, CLAVE = 30;
  const n = T.n;
  const P = () => Kit.piezas['quim-particulas'];
  const tinta = (g = 2) => `stroke="currentColor" stroke-width="${g}" stroke-linejoin="round" stroke-linecap="round"`;
  const hash = (a, b) => {
    let h = (Math.imul(a + 0x9E3779B9, 0x85EBCA6B) ^ Math.imul(b + 0x7F4A7C15, 0xC2B2AE35)) >>> 0;
    h ^= h >>> 16; h = Math.imul(h, 0x7FEB352D); h ^= h >>> 15; h = Math.imul(h, 0x846CA68B); h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
  const recs = d => (d.recipientes || []).slice(0, 3);

  // Un título que no cabe en su ranura se parte en el espacio más cercano a la mitad.
  function lineas(t, max) {
    if (!t) return [];
    if (T.ancho(t, TAM_TIT, 700) <= max) return [t];
    const ps = t.split(' ');
    let mejor = null;
    for (let i = 1; i < ps.length; i++) {
      const a = ps.slice(0, i).join(' '), b = ps.slice(i).join(' '), w = Math.max(T.ancho(a, TAM_TIT, 700), T.ancho(b, TAM_TIT, 700));
      if (!mejor || w < mejor.w) mejor = { w, l: [a, b] };
    }
    return mejor ? mejor.l : [t];
  }

  function geometria(d) {
    const rs = recs(d), N = Math.max(1, rs.length), sw = W / N;
    const nl = Math.max(1, ...rs.map(r => lineas(r.titulo, sw - 8).length));
    const v0 = 16 + LINEA_TIT * (nl - 1) + 12, mesa = v0 + HV;
    const conLupa = rs.some(r => r.lupa), R = Math.min(54, sw / 2 - 6.5);
    const cy = mesa + 16 + R;
    let alto = conLupa ? cy + R + 6 : mesa + 12;
    if (conLupa && d.clave) alto = cy + R + CLAVE;
    return { n: N, sw, nl, v0, mesa, lupa: { R, cy }, alto: Math.ceil(alto), cx: k => sw * (k + 0.5) };
  }

  // Bordes del vaso a la altura y (px): se angosta hacia el fondo.
  function vasoBordes(g, k, y) {
    const cx = g.cx(k), wt = Math.min(72, g.sw * 0.62), wb = wt * 0.8, f = (g.mesa - y) / HV;
    const w = wb + (wt - wb) * Math.max(0, Math.min(1, f));
    return [cx - w / 2, cx + w / 2];
  }
  // El trapecio del vaso entre dos alturas (para rellenar líquido, capas y fondos).
  function franja(g, k, y1, y2, op) {
    const [a1, b1] = vasoBordes(g, k, y1), [a2, b2] = vasoBordes(g, k, y2);
    return `<path d="M${n(a1 + 2)} ${n(y1)}L${n(b1 - 2)} ${n(y1)}L${n(b2 - 2)} ${n(y2)}L${n(a2 + 2)} ${n(y2)}Z" fill="currentColor" fill-opacity="${op}" stroke="none"/>`;
  }

  function vaso(g, k, r) {
    const yTop = g.v0, yBot = g.mesa - 2, nivel = Math.max(0.1, Math.min(0.95, r.nivel === undefined ? 0.75 : r.nivel));
    const yl = g.mesa - HV * nivel;
    let s = franja(g, k, yl, yBot, 0.09);
    // Capa de arriba (aceite): más oscura, con el borde que la separa del agua.
    if (r.capa) {
      const yc = Math.min(yBot - 6, yl + HV * Math.max(0.06, r.capa.alto || 0.2));
      s += franja(g, k, yl, yc, 0.2);
      const [a, b] = vasoBordes(g, k, yc);
      s += `<line x1="${n(a + 2)}" y1="${n(yc)}" x2="${n(b - 2)}" y2="${n(yc)}" ${tinta(1.5)} stroke-opacity="0.7"/>`;
    }
    const [la, lb] = vasoBordes(g, k, yl);
    s += `<line x1="${n(la + 2)}" y1="${n(yl)}" x2="${n(lb - 2)}" y2="${n(yl)}" ${tinta(1.5)} stroke-opacity="0.75"/>`;
    // Fondo: arena (granos redondos en varias filas) o sal (granitos cuadrados en un montoncito que se achica).
    if (r.fondo) {
      const [fa, fb] = vasoBordes(g, k, yBot), cx = g.cx(k);
      if (r.fondo.tipo !== 'sal') {
        let gr = '';
        for (let fl = 0; fl < 3; fl++) for (let q = 0; q < 12; q++) {
          const x = fa + 5 + (fb - fa - 10) * (q + (fl % 2) * 0.5) / 12, y = yBot - 3 - fl * 3.4;
          if (x < fb - 4) gr += `<circle cx="${n(x)}" cy="${n(y)}" r="1.7"/>`;
        }
        s += `<g fill="currentColor" fill-opacity="0.55">${gr}</g>`;
      } else {
        const c = Math.max(0, Math.min(1, r.fondo.cantidad === undefined ? 1 : r.fondo.cantidad));
        const m = Math.round(9 * c);
        let gr = '';
        for (let j = 0; j < m; j++) {
          const fila = j < 5 ? 0 : j < 8 ? 1 : 2, enFila = fila === 0 ? j : fila === 1 ? j - 5 : 0, cuantos = [5, 3, 1][fila];
          const x = cx + (enFila - (cuantos - 1) / 2) * 5.2, y = yBot - 4 - fila * 4.4;
          gr += `<rect x="${n(x - 2)}" y="${n(y - 2)}" width="4" height="4" rx="0.8"/>`;
        }
        if (gr) s += `<g fill="var(--card)" stroke="currentColor" stroke-width="1">${gr}</g>`;
      }
    }
    // Cubitos de hielo: flotan con una parte sobre el nivel.
    const nc = Math.max(0, Math.min(3, Math.round(r.cubitos || 0)));
    for (let j = 0; j < nc; j++) {
      const x = g.cx(k) + [0, 19, -19][j], y = yl - 5 + (j % 2) * 2;   // el primero al centro, donde mira la lupa
      s += `<rect x="${n(x - 7)}" y="${n(y)}" width="14" height="13" rx="3" fill="var(--card)" fill-opacity="0.85" ${tinta(1.5)}/>`;
      s += `<line x1="${n(x - 3)}" y1="${n(y + 3)}" x2="${n(x + 1)}" y2="${n(y + 3)}" ${tinta(1)} stroke-opacity="0.6"/>`;
    }
    // El vaso: abierto arriba, un poco más ancho que el fondo; un reflejo a la izquierda.
    const [ta, tb] = vasoBordes(g, k, yTop), [ba, bb] = vasoBordes(g, k, yBot + 2);
    s += `<path d="M${n(ta)} ${n(yTop)}L${n(ba)} ${n(yBot + 2)}L${n(bb)} ${n(yBot + 2)}L${n(tb)} ${n(yTop)}" fill="none" ${tinta(2)}/>`;
    s += `<line x1="${n(ta + 7)}" y1="${n(yTop + 10)}" x2="${n(ba + 7)}" y2="${n(yTop + 46)}" ${tinta(1.5)} stroke-opacity="0.35"/>`;
    return s;
  }

  function frasco(g, k) {
    const cx = g.cx(k), w = Math.min(64, g.sw * 0.56), y0 = g.v0, y1 = g.mesa - 2, cuello = w * 0.42;
    let s = `<rect x="${n(cx - cuello / 2 - 3)}" y="${n(y0)}" width="${n(cuello + 6)}" height="9" rx="2" fill="currentColor" fill-opacity="0.45" ${tinta(1.5)}/>`;
    s += `<path d="M${n(cx - cuello / 2)} ${n(y0 + 9)}L${n(cx - cuello / 2)} ${n(y0 + 18)}Q${n(cx - w / 2)} ${n(y0 + 20)} ${n(cx - w / 2)} ${n(y0 + 32)}L${n(cx - w / 2)} ${n(y1 - 6)}Q${n(cx - w / 2)} ${n(y1)} ${n(cx - w / 2 + 6)} ${n(y1)}L${n(cx + w / 2 - 6)} ${n(y1)}Q${n(cx + w / 2)} ${n(y1)} ${n(cx + w / 2)} ${n(y1 - 6)}L${n(cx + w / 2)} ${n(y0 + 32)}Q${n(cx + w / 2)} ${n(y0 + 20)} ${n(cx + cuello / 2)} ${n(y0 + 18)}L${n(cx + cuello / 2)} ${n(y0 + 9)}" fill="currentColor" fill-opacity="0.04" ${tinta(2)}/>`;
    s += `<line x1="${n(cx - w / 2 + 7)}" y1="${n(y0 + 36)}" x2="${n(cx - w / 2 + 7)}" y2="${n(y0 + 64)}" ${tinta(1.5)} stroke-opacity="0.35"/>`;
    return s;
  }

  function trozo(g, k, r) {
    const cx = g.cx(k), w = Math.min(70, g.sw * 0.56), h = 36, dx = 12, dy = 9, x = cx - (w + dx) / 2, y = g.mesa - 2 - h;
    const metal = r.material !== 'cristal', op = metal ? [0.3, 0.18, 0.1] : [0.12, 0.08, 0.04];
    const cara = (ps, o) => `<path d="M${ps.map(p => `${n(p[0])} ${n(p[1])}`).join('L')}Z" fill="currentColor" fill-opacity="${o}" ${tinta(2)}/>`;
    let s = cara([[x + dx, y - dy], [x + w + dx, y - dy], [x + w, y], [x, y]], op[0]);
    s += cara([[x + w, y], [x + w + dx, y - dy], [x + w + dx, y + h - dy], [x + w, y + h]], op[1]);
    s += cara([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], op[2]);
    if (metal) s += `<line x1="${n(x + 8)}" y1="${n(y + h - 6)}" x2="${n(x + 22)}" y2="${n(y + 6)}" ${tinta(1.5)} stroke-opacity="0.4"/><line x1="${n(x + 16)}" y1="${n(y + h - 6)}" x2="${n(x + 30)}" y2="${n(y + 6)}" ${tinta(1.5)} stroke-opacity="0.3"/>`;
    else s += `<line x1="${n(x + w / 2)}" y1="${n(y)}" x2="${n(x + w / 2 + dx)}" y2="${n(y - dy)}" ${tinta(1)} stroke-opacity="0.5"/>`;
    return s;
  }

  // Dónde está, en el objeto, el punto que mira la lupa.
  function foco(g, k, r) {
    const f = Math.max(0, Math.min(1, r.lupa && r.lupa.foco !== undefined ? r.lupa.foco : 0.5));
    if (r.tipo === 'trozo') return { x: g.cx(k), y: g.mesa - 2 - 36 * (0.2 + 0.6 * f) };
    // En el vaso y el frasco, f es la fracción del alto del recipiente (la misma escala que nivel y capa).
    const top = r.tipo === 'frasco' ? g.v0 + 30 : g.v0 + 6;
    return { x: g.cx(k), y: Math.max(top, Math.min(g.mesa - 8, g.mesa - HV * f)) };
  }

  // Celdas de la lupa k, por capa. Una rejilla hexagonal centrada en la lupa (filas a s·0,87, cada fila corrida media
  // celda); vale toda celda cuya partícula cabe en el círculo. El borde entre dos capas se corre al punto medio entre las
  // dos filas más cercanas a la fracción pedida: así ninguna fila queda partida y la línea punteada pasa entre filas.
  function celdas(d, g, k) {
    const r = recs(d)[k], L = (r && r.lupa) || {}, caps = L.capas || [], { R, cy } = g.lupa, cx = g.cx(k);
    const s = d.separacion || (g.n === 3 ? 20 : 22), Ri = R - 4, dyF = s * 0.87, lim = Ri - s / 2;
    const filas = [];
    for (let j = -Math.floor(lim / dyF); j <= Math.floor(lim / dyF); j++) filas.push(j);
    const yFila = j => cy + j * dyF;
    // Bordes: arriba del todo, los internos (corridos entre filas) y abajo del todo.
    const peso = c => (c.alto > 0 ? c.alto : 1), total = caps.reduce((a, c) => a + peso(c), 0) || 1;
    const bordes = [-Infinity];
    let acum = 0;
    for (let ci = 0; ci < caps.length - 1; ci++) {
      acum += peso(caps[ci]) / total;
      const meta = cy - Ri + 2 * Ri * acum;
      let mejor = null;
      for (let q = 0; q + 1 < filas.length; q++) { const m = (yFila(filas[q]) + yFila(filas[q + 1])) / 2; if (!mejor || Math.abs(m - meta) < Math.abs(mejor - meta)) mejor = m; }
      bordes.push(Math.max(bordes[bordes.length - 1], mejor === null ? meta : mejor));
    }
    bordes.push(Infinity);
    return caps.map((c, ci) => {
      const y1 = bordes[ci], y2 = bordes[ci + 1], lista = [];
      for (const j of filas) {
        const fy = yFila(j);
        if (fy <= y1 || fy >= y2) continue;
        const off = (((j % 2) + 2) % 2) * s / 2;
        for (let q = -Math.ceil(Ri / s) - 1; q <= Math.ceil(Ri / s) + 1; q++) {
          const fx = cx + q * s + off - s / 4;
          if (Math.hypot(fx - cx, fy - cy) > lim) continue;
          lista.push([fx, fy, lista.length]);
        }
      }
      if (c.orden !== 'filas') lista.sort((a, b) => hash(k * 31 + ci + 1, a[2]) - hash(k * 31 + ci + 1, b[2]));
      return { y1, y2, lista };
    });
  }
  const capacidad = (d, k) => celdas(d, geometria(d), k).map(c => c.lista.length);

  function lupa(d, g, k, r) {
    const L = r.lupa, { R, cy } = g.lupa, cx = g.cx(k), f = foco(g, k, r), rf = 8;
    let s = `<circle cx="${n(f.x)}" cy="${n(f.y)}" r="${rf}" fill="none" ${tinta(1.5)} stroke-dasharray="3 2"/>`;
    // Las dos líneas del aumento: del círculo chico al grande.
    const a = Math.PI / 4;
    s += `<line x1="${n(f.x - rf)}" y1="${n(f.y)}" x2="${n(cx - R * Math.sin(a))}" y2="${n(cy - R * Math.cos(a))}" ${tinta(1)} stroke-opacity="0.45"/>`;
    s += `<line x1="${n(f.x + rf)}" y1="${n(f.y)}" x2="${n(cx + R * Math.sin(a))}" y2="${n(cy - R * Math.cos(a))}" ${tinta(1)} stroke-opacity="0.45"/>`;
    s += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(R)}" fill="var(--card)" ${tinta(2.5)}/>`;
    if (L.vacia) {
      s += T.rotulo(cx, cy + 8, '?', { ancla: 'middle', tam: 24, peso: 800, min: cx - R, max: cx + R });
      return s;
    }
    const cs = celdas(d, g, k), esc = d.escala || 1;
    (L.capas || []).forEach((c, ci) => {
      const { lista, y2 } = cs[ci];
      let i = 0;
      for (const p of c.particulas || []) {
        const m = Math.max(0, Math.round(p.n === undefined ? 1 : p.n));
        for (let j = 0; j < m && i < lista.length; j++, i++) s += `<g class="kit-particula">${P().especieSVG(d, p.e, lista[i][0], lista[i][1], esc)}</g>`;
      }
      // El borde entre dos fases: una cuerda punteada.
      if (ci < (L.capas || []).length - 1) {
        const hw = Math.sqrt(Math.max(0, R * R - (y2 - cy) ** 2)) - 3;
        s += `<line x1="${n(cx - hw)}" y1="${n(y2)}" x2="${n(cx + hw)}" y2="${n(y2)}" ${tinta(1.5)} stroke-dasharray="4 3" stroke-opacity="0.8"/>`;
      }
    });
    return s;
  }

  // Elementos que salen en las lupas visibles, en el orden en que aparecen.
  function elementosDe(d, corte = Infinity) {
    const out = [];
    for (const r of recs(d)) {
      const L = r.lupa;
      if (!L || L.vacia || (L.desde || 0) > corte) continue;
      for (const c of L.capas || []) for (const p of c.particulas || []) {
        if (!(p.n === undefined || p.n > 0)) continue;
        for (const [sim] of (d.especies || {})[p.e] || [[p.e]]) { const el = P().atomoDe(d, sim).el || sim; if (!out.includes(el)) out.push(el); }
      }
    }
    return out;
  }

  function clave(d, g, corte) {
    const els = elementosDe(d, corte);
    if (!els.length) return '';
    const y = g.lupa.cy + g.lupa.R + 22, items = els.map(e => {
      const sim = Object.keys(d.atomos || {}).find(k => (d.atomos[k].el || k) === e) || e;
      return { sim, e, w: 14 + 4 + T.ancho(e, 14, 700) };
    });
    const gap = 14, total = items.reduce((a, x) => a + x.w, 0) + gap * (items.length - 1);
    let x = Math.max(M, (W - total) / 2), s = '';
    for (const it of items) {
      s += `<g class="kit-clave">${P().especieSVG(d, it.sim, x + 7, y - 5, 1)}${T.rotulo(x + 18, y, it.e, { peso: 700, tam: 14, min: M, max: W - M })}</g>`;
      x += it.w + gap;
    }
    return s;
  }

  function dibujar(d, estado = {}) {
    const g = geometria(d), corte = Math.max(0, estado.corte || 0);
    let s = `<line x1="${M + 1}" y1="${n(g.mesa)}" x2="${W - M - 1}" y2="${n(g.mesa)}" ${tinta(2)}/>`;
    s += `<rect x="${M}" y="${n(g.mesa + 1)}" width="${W - 2 * M}" height="6" fill="currentColor" fill-opacity="0.07"/>`;
    recs(d).forEach((r, k) => {
      const ls = lineas(r.titulo, g.sw - 8);
      ls.forEach((t, j) => { s += T.rotulo(g.cx(k), 16 + LINEA_TIT * j + (g.nl - ls.length) * LINEA_TIT, t, { ancla: 'middle', peso: 700, tam: TAM_TIT, min: Math.max(M, g.sw * k + 2), max: Math.min(W - M, g.sw * (k + 1) - 2) }); });
      const cuerpo = r.tipo === 'frasco' ? frasco(g, k) : r.tipo === 'trozo' ? trozo(g, k, r) : vaso(g, k, r);
      s += `<g class="kit-objeto" data-objeto="${r.tipo === 'frasco' || r.tipo === 'trozo' ? r.tipo : 'vaso'}" data-prueba="si">${cuerpo}</g>`;
      if (r.lupa && (r.lupa.desde || 0) <= corte) {
        const nuevo = (r.lupa.desde || 0) === corte && corte > 0 ? ' kit-nuevo kit-aparece' : '';
        s += `<g class="kit-lupa${nuevo}">${lupa(d, g, k, r)}</g>`;
      }
    });
    if (d.clave) s += clave(d, g, corte);
    return T.svg(W, g.alto, s, { alt: alt(d) });
  }

  function alt(d) {
    if (d.alt) return d.alt;
    const nom = e => (d.nombres && d.nombres[e]) || e;
    const partes = recs(d).map(r => {
      const que = r.tipo === 'frasco' ? 'frasco cerrado' : r.tipo === 'trozo' ? 'trozo' : 'vaso';
      const aspecto = [];
      if (r.capa) aspecto.push('una capa encima');
      if (r.fondo) aspecto.push(r.fondo.tipo === 'arena' ? 'arena en el fondo' : 'granitos en el fondo');
      if (r.cubitos) aspecto.push(`${r.cubitos} cubitos de hielo`);
      let s = `${r.titulo || que} (${que}${aspecto.length ? ', con ' + aspecto.join(' y ') : ''})`;
      if (r.lupa) {
        if (r.lupa.vacia) s += ': lupa sin mirar';
        else {
          const capas = (r.lupa.capas || []).map(c => (c.particulas || []).map(p => `${p.n === undefined ? 1 : p.n} de ${nom(p.e)}`).join(' y '));
          s += `: en la lupa, ${capas.join('; en otra fase, ')}`;
        }
      }
      return s;
    });
    return `Recipientes sobre una mesa, con su lupa de partículas (modelo, no a escala): ${partes.join('. ')}.`;
  }

  return { id: 'quim-vasos', dibujar, alt, geometria, capacidad, elementosDe, celdas };
});
