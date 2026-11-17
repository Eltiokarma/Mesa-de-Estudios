/*
 * Pieza «rv-arbol» (razonamiento verbal, idea «Principal y secundarias»): el texto en su soporte (rv-soporte) y, debajo,
 * el árbol de sus ideas: la oración principal arriba y cada secundaria colgando de ella con la pregunta que le responde
 * («¿Por qué?», «¿Cómo?», «Por ejemplo»). Es el diagrama que llega después del objeto (contrato, punto 1).
 *
 * Afirmación de la figura: en un texto, una oración manda y las otras le responden algo; la que no le responde nada no
 * cuelga de ella.
 *
 * datos = {
 *   soporte: { …datos de rv-soporte… },
 *   titulo: 'Quién manda en el texto',
 *   raiz:  { n: 2, t: 'El cuy es una forma de ahorro' },                 // n: número de la oración en el texto
 *   ramas: [{ id: 'r3', n: 3, rel: '¿Cómo?', t: 'Se vende cuando falta plata' }],   // de 1 a 5, en el orden del texto
 *   vacio: 'Arriba irá la oración que manda…',   // aviso en gris mientras la principal no se ve (el árbol no queda mudo)
 * }
 * estado = {
 *   soporte: { …estado de rv-soporte… },
 *   ver: ['raiz', 'r3'],      // qué cajas se ven; las demás guardan su lugar vacío (el alto no cambia)
 *   tachar: ['r5'],           // rama que no sostiene a la principal: se dibuja tachada y suelta, sin la línea que la une
 *   nuevo: ['r3'],            // se anima al avanzar un paso de «Mira»
 * }
 * Colores (paleta de lectura): la principal f (violeta, punteado), las secundarias i (turquesa, continuo); la tachada en
 * tinta. Función pura; solo currentColor, var(--c-*) y var(--card). Todo texto mide 14 o más.
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
  const W = 320, TAM = 15, RL = 20, RIEL = 28, RX = 46, PAD = 10;
  const RAYA = { i: '', f: ' stroke-dasharray="0.1 6"' };

  // Una caja: rótulo en negrita arriba («Principal · oración 2» o «¿Cómo? · oración 3») y el texto debajo.
  function caja(x, w, y, rotulo, texto) {
    const rot = S.partir(rotulo, w - 2 * PAD, 14, 700);
    const lineas = S.partir(texto, w - 2 * PAD, TAM);
    let yy = y + PAD;
    const out = { x, y, w, rot: [], lineas: [] };
    for (const r of rot) { out.rot.push({ x: x + PAD, y: yy + 14, w: T.ancho(r, 14, 700), texto: r }); yy += 19; }
    for (const r of lineas) { out.lineas.push({ x: x + PAD, y: yy + 15, w: T.ancho(r, TAM), texto: r }); yy += RL; }
    out.h = yy - y + PAD - 2;
    return out;
  }

  function disponer(d) {
    const sop = d.soporte ? S.disponer(d.soporte) : null;
    const y0 = sop ? sop.alto + 4 : 4;
    let y = y0 + 6;
    const marco = { x: 4, y: y0, w: W - 8 };
    const titulo = { x: 14, y: y + 18, texto: d.titulo || 'Quién manda en el texto' };
    y += 30;
    const raiz = caja(14, W - 28, y, `Principal · oración ${d.raiz.n}`, d.raiz.t);
    y += raiz.h + 12;
    const ramas = (d.ramas || []).map(r => {
      const c = Object.assign(caja(RX, W - RX - 14, y, `${r.rel} · oración ${r.n}`, r.t), { id: r.id });
      c.cy = y + 16;
      y += c.h + 8;
      return c;
    });
    y += 6;
    marco.h = y - marco.y;
    return { sop, marco, titulo, raiz, ramas, alto: Math.ceil(y + 4) };
  }

  function dibujar(d, estado = {}) {
    const L = disponer(d);
    const ver = new Set(estado.ver || []), tachar = new Set(estado.tachar || []), nuevo = new Set(estado.nuevo || []);
    const cl = id => (nuevo.has(id) ? ' kit-nuevo kit-aparece' : '');
    let s = d.soporte ? S.cuerpo(d.soporte, estado.soporte || {}).s : '';
    let fondo = `<rect x="${T.n(L.marco.x)}" y="${T.n(L.marco.y)}" width="${T.n(L.marco.w)}" height="${T.n(L.marco.h)}" rx="10" fill="var(--card)" stroke="currentColor" stroke-opacity="0.3" stroke-width="2"/>`;
    let tinta = T.rotulo(L.titulo.x, L.titulo.y, L.titulo.texto, { tam: 16, peso: 700 });
    const texto = (r, peso, extra = '') => `<text class="kit-txt" x="${T.n(r.x)}" y="${T.n(r.y)}" fill="currentColor" font-size="${peso === 700 ? 14 : TAM}"${peso === 700 ? ' font-weight="700"' : ''}${extra}${r.texto.length > 3 ? ` textLength="${T.n(r.w)}" lengthAdjust="spacing"` : ''}>${T.esc(r.texto)}</text>`;
    const dibCaja = (c, color, id, tachada) => {
      const borde = tachada ? 'stroke="currentColor" stroke-opacity="0.45"' : `stroke="${T.color(color)}"${RAYA[color]}`;
      fondo += `<rect class="rv-nodo${cl(id)}" x="${T.n(c.x)}" y="${T.n(c.y)}" width="${T.n(c.w)}" height="${T.n(c.h)}" rx="8" fill="${tachada ? 'var(--card)' : T.color(color)}" fill-opacity="${tachada ? 1 : 0.12}" ${borde} stroke-width="${T.GROSOR.contorno}" stroke-linecap="round"/>`;
      const op = tachada ? ' opacity="0.65"' : '';
      for (const r of c.rot) tinta += texto(r, 700, op);
      for (const r of c.lineas) {
        tinta += texto(r, 400, op);
        if (tachada) tinta += `<line class="rv-tacha${cl(id)}" x1="${T.n(r.x - 1)}" y1="${T.n(r.y - 5)}" x2="${T.n(r.x + r.w + 1)}" y2="${T.n(r.y - 5)}" stroke="currentColor" stroke-width="${T.GROSOR.contorno}" stroke-linecap="round"/>`;
      }
    };
    if (ver.has('raiz')) dibCaja(L.raiz, 'f', 'raiz', false);
    else if (d.vacio) S.partir(d.vacio, L.raiz.w - 2 * PAD, 14).forEach((r, k) => { tinta += `<text class="kit-txt" x="${T.n(L.raiz.x + PAD)}" y="${T.n(L.raiz.y + PAD + 14 + k * 19)}" fill="currentColor" font-size="14" opacity="0.72">${T.esc(r)}</text>`; });
    // El riel baja desde la principal hasta la última rama que cuelga de ella (las tachadas no cuelgan).
    const colgadas = L.ramas.filter(r => ver.has(r.id) && !tachar.has(r.id));
    if (ver.has('raiz') && colgadas.length) {
      const fin = colgadas[colgadas.length - 1].cy;
      let p = `M${RIEL} ${T.n(L.raiz.y + L.raiz.h)}V${T.n(fin)}`;
      for (const r of colgadas) p += `M${RIEL} ${T.n(r.cy)}H${RX}`;
      fondo += `<path class="rv-riel" d="${p}" fill="none" stroke="${T.color('i')}" stroke-width="${T.GROSOR.contorno}" stroke-linecap="round"/>`;
    }
    for (const r of L.ramas) if (ver.has(r.id)) dibCaja(r, 'i', r.id, tachar.has(r.id));
    s += fondo + tinta;
    return T.svg(W, L.alto, s, { alt: alt(d), clase: 'rv-arbol' });
  }

  function alt(d) {
    const base = d.soporte ? S.alt(d.soporte) : '';
    const ramas = (d.ramas || []).map(r => `${r.rel} (oración ${r.n}): ${r.t}`).join('; ');
    return `${base} Árbol de ideas: principal, oración ${d.raiz.n}: ${d.raiz.t}.${ramas ? ` Debajo: ${ramas}.` : ''}`;
  }

  return { id: 'rv-arbol', dibujar, alt, disponer, constantes: { W } };
});
