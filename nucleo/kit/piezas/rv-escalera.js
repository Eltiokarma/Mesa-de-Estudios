/*
 * Pieza «rv-escalera» (razonamiento verbal, idea «El tema y su medida»): el texto en su soporte (rv-soporte) y, debajo,
 * una escalera de temas posibles, del más amplio (arriba) al más estrecho (abajo). El peldaño elegido se marca; el
 * soporte muestra qué oraciones cubre ese tema (turquesa) y cuáles deja fuera (gris).
 *
 * Afirmación de la figura: un tema puede quedar grande o chico para su texto; el justo cubre todas sus oraciones y no
 * le sirve a otro texto.
 *
 * datos = {
 *   soporte: { …datos de rv-soporte… },        // el texto (o los textos) que se miden
 *   titulo: 'Escalera de temas',
 *   peldanos: ['La vida escolar', '…'],        // de 2 a 6, del más amplio al más estrecho
 *   arriba: 'Más amplio', abajo: 'Más estrecho',
 * }
 * Sin `peldanos`, la pieza dibuja solo el soporte (así «Predice» muestra el cartel antes de ver la escalera).
 * estado = {
 *   soporte: { …estado de rv-soporte… },       // qué oraciones se cubren o quedan fuera con el peldaño elegido
 *   n: 3,                                      // peldaño elegido (1 = arriba); 0 o nada: ninguno
 *   color: 'o' | 'f',                          // o: el tema que se está probando (naranja, a trazos);
 *                                              // f: el tema que mide justo (violeta, punteado), solo tras el ✓
 *   nuevo: ['escalera'],                       // el peldaño se anima al avanzar un paso de «Mira»
 * }
 * El alto depende solo de los datos. Función pura; solo currentColor, var(--c-*) y var(--card).
 * peldanoEn(datos, punto) y ancla(datos, n) sirven al arrastre de la teoría (docs/teoria.md §4b).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const Kit = nodo ? require('../kit.js') : root.Kit;
  const T = nodo ? require('../trazo.js') : root.Kit.trazo;
  const S = nodo ? require('./rv-soporte.js') : root.Kit.piezas['rv-soporte'];
  const api = fabrica(Kit, T, S);
  Kit.registrar(api);
  if (nodo) module.exports = api;
})(typeof self !== 'undefined' ? self : this, function (Kit, T, S) {
  'use strict';
  const W = 320, TAM = 15, RL = 20, RAIL1 = 24, RAIL2 = 50, TX = 62, TW = W - TX - 12;
  const RAYA = { o: ' stroke-dasharray="7 4"', f: ' stroke-dasharray="0.1 6"' };

  function disponer(d) {
    const sop = d.soporte ? S.disponer(d.soporte) : null;
    const y0 = sop ? sop.alto + 4 : 4;
    if (!Array.isArray(d.peldanos) || !d.peldanos.length) return { sop, y0, caja: null, peldanos: [], alto: Math.max(60, y0) };
    let y = y0 + 6;
    const caja = { x: 4, y: y0, w: W - 8 };
    // El título va a la izquierda y el sentido de arriba, en el mismo renglón, a la derecha (la figura no crece).
    const titulo = { x: 14, y: y + 18, texto: d.titulo || 'Escalera de temas' };
    const arriba = { x: W - 14, y: y + 18, texto: `▲ ${d.arriba || 'Más amplio'}` };
    y += 28;
    const peldanos = d.peldanos.map((t, k) => {
      const lineas = S.partir(t, TW - 8, TAM, 700);   // medido en negrita: el elegido va en negrita y no se sale
      const h = lineas.length * RL + 12;
      const p = { n: k + 1, top: y, h, cy: y + h / 2, lineas: lineas.map((r, j) => ({ x: TX + 4, y: y + 7 + 15 + j * RL, w: T.ancho(r, TAM), wb: T.ancho(r, TAM, 700), texto: r })) };
      y += h + 2;
      return p;
    });
    const abajo = { x: TX, y: y + 13, texto: `▼ ${d.abajo || 'Más estrecho'}` };
    y += 24;
    caja.h = y - caja.y;
    return { sop, y0, caja, titulo, arriba, abajo, peldanos, alto: Math.ceil(y + 4) };
  }

  function dibujar(d, estado = {}) {
    const L = disponer(d);
    const c = estado.color === 'f' ? 'f' : 'o', n = estado.n || 0, nuevo = new Set(estado.nuevo || []);
    let s = d.soporte ? S.cuerpo(d.soporte, estado.soporte || {}).s : '';
    if (L.caja) {
      const { caja } = L;
      let e = `<rect x="${T.n(caja.x)}" y="${T.n(caja.y)}" width="${T.n(caja.w)}" height="${T.n(caja.h)}" rx="10" fill="var(--card)" stroke="currentColor" stroke-opacity="0.3" stroke-width="2"/>`;
      e += T.rotulo(L.titulo.x, L.titulo.y, L.titulo.texto, { tam: 16, peso: 700 });
      e += T.rotulo(L.arriba.x, L.arriba.y, L.arriba.texto, { tam: 14, peso: 700, clase: 'rv-sentido', ancla: 'end' });
      e += T.rotulo(L.abajo.x, L.abajo.y, L.abajo.texto, { tam: 14, peso: 700, clase: 'rv-sentido' });
      const p0 = L.peldanos[0], pN = L.peldanos[L.peldanos.length - 1];
      // Los dos largueros y los peldaños (objeto de prueba, como el soporte).
      let lad = '';
      for (const x of [RAIL1, RAIL2]) lad += `<line x1="${x}" y1="${T.n(p0.cy - 16)}" x2="${x}" y2="${T.n(pN.cy + 16)}" stroke="currentColor" stroke-opacity="0.55" stroke-width="3" stroke-linecap="round"/>`;
      for (const p of L.peldanos) lad += `<line x1="${RAIL1}" y1="${T.n(p.cy)}" x2="${RAIL2}" y2="${T.n(p.cy)}" stroke="currentColor" stroke-opacity="0.45" stroke-width="3" stroke-linecap="round"/>`;
      e += `<g class="kit-objeto" data-objeto="escalera" data-prueba="si">${lad}</g>`;
      for (const p of L.peldanos) {
        const sel = p.n === n, cl = sel && nuevo.has('escalera') ? ' kit-nuevo kit-aparece' : '';
        if (sel) {
          e += `<rect class="rv-peldano${cl}" x="${TX - 2}" y="${T.n(p.top + 2)}" width="${T.n(W - TX - 8)}" height="${T.n(p.h - 4)}" rx="8" fill="${T.color(c)}" fill-opacity="0.14" stroke="${T.color(c)}" stroke-width="${T.GROSOR.contorno}"${RAYA[c]}/>`;
          e += `<line class="rv-peldano${cl}" x1="${RAIL1}" y1="${T.n(p.cy)}" x2="${TX - 2}" y2="${T.n(p.cy)}" stroke="${T.color(c)}" stroke-width="4" stroke-linecap="round"${RAYA[c]}/>`;
        }
        for (const r of p.lineas) e += `<text class="kit-txt" x="${T.n(r.x)}" y="${T.n(r.y)}" fill="currentColor" font-size="${TAM}"${sel ? ' font-weight="700"' : ''}${r.texto.length > 3 ? ` textLength="${T.n(sel ? r.wb : r.w)}" lengthAdjust="spacing"` : ''}>${T.esc(r.texto)}</text>`;
      }
      s += e;
    }
    return T.svg(W, L.alto, s, { alt: alt(d), clase: 'rv-escalera' });
  }

  function alt(d) {
    const base = d.soporte ? S.alt(d.soporte) : '';
    if (!Array.isArray(d.peldanos) || !d.peldanos.length) return base || 'Texto para leer.';
    return `${base} Escalera de temas, de ${String(d.arriba || 'más amplio').toLowerCase()} a ${String(d.abajo || 'más estrecho').toLowerCase()}: ${d.peldanos.map((t, k) => `${k + 1}. ${t}`).join('; ')}.`;
  }

  // Para el arrastre: dónde va la manija del peldaño n (sobre los largueros) y qué peldaño queda más cerca de un punto.
  function ancla(d, n) {
    const p = disponer(d).peldanos[n - 1];
    return p ? { x: (RAIL1 + RAIL2) / 2, y: p.cy } : null;
  }
  function peldanoEn(d, punto) {
    const ps = disponer(d).peldanos;
    let mejor = 1, dm = Infinity;
    for (const p of ps) { const dist = Math.abs(p.cy - punto.y); if (dist < dm) { dm = dist; mejor = p.n; } }
    return mejor;
  }

  return { id: 'rv-escalera', dibujar, alt, disponer, ancla, peldanoEn, constantes: { W, TX, TW } };
});
