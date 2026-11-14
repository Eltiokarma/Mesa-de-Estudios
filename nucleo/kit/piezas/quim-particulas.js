/*
 * Pieza «quim-particulas» (docs/teoria.md, sección 4; sesión de teoría de Química): una, dos o tres cajas vistas
 * con lupa, con las partículas que hay dentro. Cada especie es un dibujo de átomos (una bolita por átomo, con su
 * color de variable y un relleno que se distingue también en grises: lleno, hueco o con punto). Sirve para
 * sustancia y mezcla, mol, balance, reactivo limitante, gases (émbolo), soluciones (vaso con nivel), equilibrio.
 *
 * Afirmación de la figura: lo que se cuenta son partículas enteras dentro de un volumen visible; el número y el
 * volumen se leen a la vez.
 *
 * Fidelidad: el número de partículas dibujadas es exactamente el de los datos; el nivel del líquido y el émbolo
 * son proporcionales a su fracción de la caja (el volumen dibujado es el volumen). Las bolitas son un modelo,
 * no una fotografía: la escala de los átomos no es real (el alt lo dice).
 *
 * datos = {
 *   atomos: { H: { color: 'i', estilo: 'hueco', r: 5 }, O: { color: 'h', estilo: 'lleno', r: 7 }, … },
 *   especies: { agua: [['O', 0, 0], ['H', -7, 6], ['H', 7, 6]], … },   // átomo y su desplazamiento en px
 *   cajas: [{
 *     titulo, rotulo,                       // arriba y abajo de la caja (cortos: la caja mide ~90 px con tres)
 *     forma: 'caja' | 'vaso' | 'cilindro',  // vaso: abierto, con líquido hasta `nivel`; cilindro: émbolo en `nivel`
 *     nivel: 0..1,
 *     particulas: [{ e: 'agua', n: 4, desde, hasta, resalta, x, y }],   // x, y (0..1) fijan una sola partícula
 *     orden: 'azar' | 'filas',             // azar: mezcladas (con semilla fija); filas: en orden de lectura
 *     cuenta: [{ e, texto, desde }],        // fila bajo la caja: la especie en chico y su número
 *   }],
 *   flechas: true,                          // flecha entre cajas consecutivas (antes → después)
 *   alto: 150, separacion: 20,              // alto de las cajas y lado de la celda de cada partícula, en px
 *   alt: 'texto alternativo',
 * }
 * estado = { corte }: se ve lo que tiene desde ≤ corte y no tiene hasta < corte. Lo nuevo del paso se anima.
 * El dibujo es una función pura de (datos, estado): sin ids, sin azar, sin reloj. El alto depende solo de datos.
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
  const W = 320, M = 8, GAP_FLECHA = 30, GAP = 12, TOP = 30;

  // Hash entero (determinístico) para mezclar casillas y dar un pequeño desorden a cada partícula.
  const hash = (a, b) => { let h = (a * 374761393 + b * 668265263) >>> 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };

  function geometria(d) {
    const cajas = d.cajas || [];
    const n = Math.max(1, cajas.length), gap = d.flechas ? GAP_FLECHA : GAP;
    const ancho = (W - 2 * M - gap * (n - 1)) / n, alto = d.alto || 150;
    const conRotulo = cajas.some(c => c.rotulo), conCuenta = cajas.some(c => (c.cuenta || []).length);
    const y0 = TOP, y1 = TOP + alto;
    const total = y1 + (conRotulo ? 24 : 6) + (conCuenta ? 26 : 0) + 6;
    return { n, gap, ancho, alto, y0, y1, total, conRotulo, conCuenta, x: k => M + k * (ancho + gap) };
  }

  // Región donde viven las partículas de una caja (el líquido del vaso o el gas bajo el émbolo).
  function region(c, g, k) {
    const x = g.x(k) + 6, w = g.ancho - 12;
    const nivel = c.forma === 'vaso' || c.forma === 'cilindro' ? Math.max(0.05, Math.min(1, c.nivel === undefined ? 0.8 : c.nivel)) : 1;
    const top = g.y1 - (g.alto - 8) * nivel;
    return { x, y: top + 4, w, h: g.y1 - 4 - (top + 4) };
  }

  // Casillas de una región, en el orden pedido. Todas las partículas de la caja (también las que aún no se ven)
  // ocupan su casilla desde el principio: así lo que ya estaba no se mueve cuando aparece algo nuevo.
  function casillas(c, g, k, s) {
    const r = region(c, g, k);
    const cols = Math.max(1, Math.floor(r.w / s)), filas = Math.max(1, Math.floor(r.h / s));
    const ox = r.x + (r.w - cols * s) / 2 + s / 2, oy = r.y + (r.h - filas * s) / 2 + s / 2;
    const lista = [];
    for (let f = 0; f < filas; f++) for (let q = 0; q < cols; q++) lista.push([ox + q * s, oy + f * s, f * cols + q]);
    if (c.orden !== 'filas') lista.sort((a, b) => hash(k + 1, a[2]) - hash(k + 1, b[2]));
    return { lista, r };
  }

  const atomoDe = (d, sim) => Object.assign({ color: null, estilo: 'lleno', r: 6 }, (d.atomos || {})[sim] || {});

  function especieSVG(d, e, cx, cy, esc = 1) {
    const forma = (d.especies || {})[e] || [[e, 0, 0]];
    let s = '';
    for (const [sim, dx, dy] of forma) {
      const a = atomoDe(d, sim), x = cx + dx * esc, y = cy + dy * esc, r = a.r * esc, c = T.color(a.color);
      if (a.estilo === 'hueco') s += `<circle cx="${T.n(x)}" cy="${T.n(y)}" r="${T.n(r)}" fill="var(--card)" stroke="${c}" stroke-width="2"/>`;
      else if (a.estilo === 'punto') s += `<circle cx="${T.n(x)}" cy="${T.n(y)}" r="${T.n(r)}" fill="var(--card)" stroke="${c}" stroke-width="2"/><circle cx="${T.n(x)}" cy="${T.n(y)}" r="${T.n(Math.max(1.5, r * 0.38))}" fill="${c}"/>`;
      else s += `<circle cx="${T.n(x)}" cy="${T.n(y)}" r="${T.n(r)}" fill="${c}" fill-opacity="0.85" stroke="${c}" stroke-width="1.5"/>`;
    }
    return s;
  }

  function cajaSVG(d, g, c, k) {
    const x = g.x(k), w = g.ancho;
    let s = '';
    if (c.forma === 'vaso') {
      const r = region(c, g, k);
      s += `<rect x="${T.n(x + 2)}" y="${T.n(r.y - 4)}" width="${T.n(w - 4)}" height="${T.n(g.y1 - r.y + 2)}" fill="currentColor" fill-opacity="0.07"/>`;
      s += T.linea(x + 2, r.y - 4, x + w - 2, r.y - 4, { grosor: T.GROSOR.cuadricula, opacidad: 0.6 });
      s += `<path d="M${T.n(x)} ${T.n(g.y0)}L${T.n(x)} ${T.n(g.y1)}L${T.n(x + w)} ${T.n(g.y1)}L${T.n(x + w)} ${T.n(g.y0)}" fill="none" stroke="currentColor" stroke-width="${T.GROSOR.contorno}" stroke-linejoin="round" stroke-linecap="round"/>`;
    } else if (c.forma === 'cilindro') {
      const r = region(c, g, k), yp = r.y - 4;
      s += T.barra(x, g.y0, w, g.alto, { relleno: 0 });
      s += `<rect x="${T.n(x + 2)}" y="${T.n(yp - 6)}" width="${T.n(w - 4)}" height="8" rx="2" fill="currentColor" fill-opacity="0.55"/>`;
      s += T.linea(x + w / 2, yp - 6, x + w / 2, g.y0 + 2, { grosor: 4, opacidad: 0.55 });
    } else {
      s += T.barra(x, g.y0, w, g.alto, { relleno: 0 });
    }
    return s;
  }

  function dibujar(d, estado = {}) {
    const g = geometria(d), corte = Math.max(0, estado.corte || 0), sep = d.separacion || 20;
    const ve = e => (e.desde || 0) <= corte && !(e.hasta < corte);
    const nuevo = e => ((e.desde || 0) === corte && corte > 0 ? ' kit-nuevo kit-aparece' : '');
    let s = '';
    (d.cajas || []).forEach((c, k) => {
      const x = g.x(k), w = g.ancho;
      s += cajaSVG(d, g, c, k);
      if (c.titulo) s += T.rotulo(x + w / 2, g.y0 - 10, c.titulo, { ancla: 'middle', peso: 700, min: x - 4, max: x + w + 4 });
      const { lista } = casillas(c, g, k, sep);
      let i = 0, cuerpo = '';
      for (const grupo of c.particulas || []) {
        const n = Math.max(0, Math.round(grupo.n === undefined ? 1 : grupo.n));
        for (let j = 0; j < n; j++, i++) {
          let cx, cy;
          if (Number.isFinite(grupo.x) && Number.isFinite(grupo.y) && n === 1) {
            const r = region(c, g, k); cx = r.x + r.w * grupo.x; cy = r.y + r.h * grupo.y;
          } else {
            const cs = lista[i % lista.length];
            const juego = c.orden === 'filas' ? 0 : Math.max(0, Math.min(3, (sep - 16) / 2));
            cx = cs[0] + (hash(i + 11, k + 3) - 0.5) * 2 * juego; cy = cs[1] + (hash(k + 5, i + 17) - 0.5) * 2 * juego;
          }
          if (!ve(grupo)) continue;
          let p = especieSVG(d, grupo.e, cx, cy);
          if (grupo.resalta) p += `<circle cx="${T.n(cx)}" cy="${T.n(cy)}" r="${T.n(sep / 2 - 0.5)}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3"/>`;
          cuerpo += `<g class="kit-particula${nuevo(grupo)}">${p}</g>`;
        }
      }
      s += cuerpo;
      if (c.rotulo) s += T.rotulo(x + w / 2, g.y1 + 20, c.rotulo, { ancla: 'middle', peso: 600, min: x - 4, max: x + w + 4, clase: 'kit-num' });
      const cuenta = (c.cuenta || []).filter(ve);
      if (cuenta.length) {
        const y = g.y1 + (g.conRotulo ? 24 : 6) + 16, paso = w / cuenta.length;
        cuenta.forEach((q, j) => {
          const cx = x + paso * j + 10;
          s += `<g class="kit-cuenta${nuevo(q)}">${especieSVG(d, q.e, cx, y - 5, 0.75)}${T.rotulo(cx + 13, y, q.texto, { peso: 700, min: x - 4, max: x + w + 8, clase: 'kit-num' })}</g>`;
        });
      }
      if (d.flechas && k < g.n - 1) s += T.flecha(x + w + 5, g.y0 + g.alto / 2, x + w + g.gap - 5, g.y0 + g.alto / 2, { grosor: T.GROSOR.contorno });
    });
    return T.svg(W, g.total, s, { alt: alt(d) });
  }

  function alt(d) {
    if (d.alt) return d.alt;
    const cajas = (d.cajas || []).map((c, k) => {
      const cuenta = {};
      for (const p of c.particulas || []) cuenta[p.e] = (cuenta[p.e] || 0) + (p.n === undefined ? 1 : p.n);
      const lista = Object.entries(cuenta).map(([e, n]) => `${n} de ${e}`).join(', ');
      return `${c.titulo || `caja ${k + 1}`}: ${lista || 'vacía'}`;
    });
    return `Partículas (modelo, no a escala) en ${cajas.join('; ')}.`;
  }

  return { id: 'quim-particulas', dibujar, alt, geometria, region };
});
