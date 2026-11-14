/*
 * Pieza «alg-venn» (Álgebra, docs/teoria.md §4): diagrama de Venn de dos o tres conjuntos dentro del universo.
 * Cada región se nombra con un código de pertenencia ('10' = en A y no en B; '011' = en B y C, no en A; '00' =
 * fuera de todos). Una región sombreada se llena de puntitos (se ve también en grises), y cada región puede llevar
 * sus elementos o su cardinal. Sirve para operaciones con conjuntos, cardinalidad, inclusión y cuantificadores.
 *
 * Afirmación de la figura: cada elemento vive en una sola región, y cada operación es un conjunto de regiones.
 *
 * datos = {
 *   conjuntos: [{ t: 'A', color: 'o' }, { t: 'B', color: 'i' }, { t: 'C', color: 'd' }?],
 *   universo: 'U',                                   // rótulo del rectángulo (opcional)
 *   regiones: { '10': { t: '1, 3', desde, sombra: true, color }, … },
 *   alt
 * }
 * estado = { corte, sombra: ['11', …] | null, fantasma: null | { regiones: ['10', …], rotulo } }
 *   sombra del estado se suma a las regiones con sombra: true (y que ya aparecieron).
 * El dibujo es una función pura de (datos, estado): sin ids, sin clipPath, sin azar.
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
  const W = 320, ALTO = 270, U = { x: 10, y: 16, w: 300, h: 222 };
  const DOS = {
    c: [[124, 124, 74], [196, 124, 74]],
    centro: { '10': [92, 124], '01': [228, 124], '11': [160, 124], '00': [36, 222] },
    nombre: [[70, 52], [250, 52]],
  };
  const TRES = {
    c: [[128, 100, 64], [192, 100, 64], [160, 158, 64]],
    centro: { '100': [100, 86], '010': [220, 86], '001': [160, 200], '110': [160, 74], '101': [122, 150], '011': [198, 150], '111': [160, 120], '000': [34, 226] },
    nombre: [[62, 42], [258, 42], [252, 222]],
  };
  const forma = d => ((d.conjuntos || []).length >= 3 ? TRES : DOS);
  const n = d => ((d.conjuntos || []).length >= 3 ? 3 : 2);
  const codigo = (L, x, y) => L.c.map(([cx, cy, r]) => ((x - cx) ** 2 + (y - cy) ** 2 <= r * r ? '1' : '0')).join('');

  // Puntitos en una rejilla fija: un punto pertenece a la región si su código coincide (dentro del universo).
  function sombrear(L, codigos, color, clase) {
    const set = new Set(codigos);
    let s = '';
    for (let y = U.y + 8; y < U.y + U.h - 4; y += 8) for (let x = U.x + 6 + ((y / 8) % 2) * 4; x < U.x + U.w - 4; x += 8) {
      const c = codigo(L, x, y);
      if (!set.has(c)) continue;
      // margen de 3 px respecto de los bordes, para que la línea del círculo se lea limpia
      if (L.c.some(([cx, cy, r]) => Math.abs(Math.hypot(x - cx, y - cy) - r) < 3)) continue;
      s += `<circle cx="${x}" cy="${y}" r="1.8"/>`;
    }
    return `<g class="${clase}" fill="${T.color(color)}" fill-opacity="0.7">${s}</g>`;
  }

  function dibujar(d, estado = {}) {
    const L = forma(d), k = n(d);
    const corte = Math.max(0, estado.corte || 0);
    const ve = e => (e.desde || 0) <= corte;
    const nuevo = e => ((e.desde || 0) === corte && corte > 0 ? ' kit-nuevo' : '');
    let s = `<rect x="${U.x}" y="${U.y}" width="${U.w}" height="${U.h}" rx="8" fill="none" stroke="currentColor" stroke-width="${T.GROSOR.contorno}" stroke-opacity="0.6"/>`;
    if (d.universo) s += T.rotulo(U.x + U.w - 8, U.y + 22, d.universo, { ancla: 'end', peso: 700 });
    // Sombras: por región (con su color) y las del estado (en tinta).
    const regs = d.regiones || {};
    for (const [cod, r] of Object.entries(regs)) if (r.sombra && ve(r) && cod.length === k) s += sombrear(L, [cod], r.color, 'kit-aparece' + nuevo(r));
    if (Array.isArray(estado.sombra) && estado.sombra.length) s += sombrear(L, estado.sombra.filter(c => c.length === k), null, 'kit-aparece');
    // Círculos y nombres de los conjuntos.
    (d.conjuntos || []).slice(0, 3).forEach((cj, i) => {
      const [cx, cy, r] = L.c[i];
      s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${T.color(cj.color)}" stroke-width="${T.GROSOR.variable}"/>`;
      const [nx, ny] = L.nombre[i];
      s += T.rotulo(nx, ny, cj.t, { color: cj.color, peso: 700, ancla: 'middle', tam: 18 });
    });
    // Contenido de cada región (elementos o cardinal), centrado y con fondo de tarjeta para leerse sobre los puntos.
    for (const [cod, r] of Object.entries(regs)) {
      if (!r.t || !ve(r) || !L.centro[cod]) continue;
      const [x, y] = L.centro[cod], w = T.ancho(r.t, 16, 700) + 8;
      s += `<g class="kit-aparece${nuevo(r)}"><rect x="${T.n(x - w / 2)}" y="${y - 13}" width="${T.n(w)}" height="20" rx="4" fill="var(--card)" fill-opacity="0.85"/>${T.rotulo(x, y + 2, r.t, { ancla: 'middle', peso: 700 })}</g>`;
    }
    const fa = estado.fantasma;
    if (fa && Array.isArray(fa.regiones)) {
      let c = '';
      for (const cod of fa.regiones) {
        if (!L.centro[cod]) continue;
        const [x, y] = L.centro[cod];
        c += `<circle cx="${x}" cy="${y - 3}" r="16" fill="none" stroke="currentColor" stroke-width="${T.GROSOR.contorno}" stroke-dasharray="4 3"/>`;
      }
      if (fa.rotulo) c += T.rotulo(10, ALTO - 10, fa.rotulo, {});
      s += `<g class="kit-fantasma">${c}</g>`;
    }
    return T.svg(W, ALTO, s, { alt: alt(d) });
  }

  function alt(d) {
    if (d.alt) return d.alt;
    const nombres = (d.conjuntos || []).map(c => c.t).join(', ');
    const sombra = Object.entries(d.regiones || {}).filter(([, r]) => r.sombra).map(([c]) => c);
    return `Diagrama de Venn de ${nombres}${sombra.length ? `; sombreadas las regiones ${sombra.join(', ')}` : ''}`;
  }

  return { id: 'alg-venn', dibujar, alt, codigo: (d, x, y) => codigo(forma(d), x, y), centros: d => forma(d).centro };
});
