/*
 * Pieza «arit-reparto» (19 nov 2026): el paquete de caramelos de doña Juana empacado de varias formas, para «MCD y MCM»
 * (contenido/teoria/aritmetica/mcd-y-mcm.js, idea 4; docs/etapa7/propuesta-aritmetica.md §2). Dibujo de prueba
 * (data-prueba): Gerson decide después si lo reemplaza (docs/plan-calidad.md, M4).
 *
 * Afirmación de la figura: los mismos N caramelos se empacan en bolsitas de d, una fila por cada d; en cada fila se ven
 * las bolsitas llenas y los caramelos que sobran.
 *
 * Fidelidad: cada bolsita muestra sus d caramelos, y cada caramelo suelto se dibuja; en cada fila hay exactamente N
 * caramelos (bolsitas × d + sueltos). Todas las bolsitas de una figura tienen el mismo ancho y cada caramelo el mismo
 * tamaño. Con el paquete cerrado (cerrado: true) no se sabe cuántas bolsitas hay: cada fila muestra una sola bolsita,
 * «× ?» y los sueltos que dicen los datos; nunca se dibuja una cantidad que el problema no da.
 *
 * datos = {
 *   n: 37,                        caramelos del paquete (sin cerrado)
 *   repartos: [{ d: 4, nota? }, { d: 6 }],   una fila por tamaño de bolsita; nota: lo que dice la fila debajo
 *                                  (por defecto, «9 bolsitas y sobra 1», con lo que sobra en naranja)
 *   cerrado: true,                el paquete cerrado: cada reparto lleva sobran (los sueltos) o falta (lo que falta
 *                                  para otra bolsita: huecos punteados)
 *   sobran: 1,                    con cerrado, los sueltos de cada fila (o en cada reparto: { d, sobran } / { d, falta })
 *   letrero, pie: [[texto, color?, peso?], …] | 'texto',
 *   alto: 220,                    alto mínimo del lienzo (el juego no salta al cambiar n)
 *   pasos: [{ …datos }, …],       para «Mira»: estado.paso elige qué cambia (se mezcla con los datos)
 * }
 * estado = { paso }. Función pura de (datos, estado): sin ids, sin azar, sin reloj. Lienzo de 320 de ancho; el alto se
 * reserva con el paso más lleno (no salta).
 * Colores: tinta (currentColor) y var(--c-*): las bolsitas y sus caramelos en tinta (los tamaños son datos del problema);
 * lo que sobra y lo que falta, en naranja (o), con borde punteado. Nunca carmín ni verde.
 * geometria(datos, estado) da las cajas de todo lo dibujado, para la prueba numérica de encuadre.
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
  const W = 320, M = 4, TAM = 13;
  const X0 = 10, XB = 60, X1 = 312;      // la etiqueta de la fila a la izquierda; las bolsitas desde XB
  const BW = 15, BG = 3, R = 2.1, DY = 4.6; // ancho de bolsita, aire entre bolsitas, radio y paso de un caramelo
  const NOTA = 18, SEP = 9;
  const n2 = T.n;
  const ent = x => Math.max(0, Math.floor(+x || 0));
  const segsDe = x => (x === undefined || x === null ? null : typeof x === 'string' ? [[x]] : Array.isArray(x) ? x : null);
  const segsAncho = (segs, tam = TAM) => segs.reduce((a, s) => a + T.ancho(s[0], tam, s[2] || 400), 0);
  function texto(x, y, segs, o = {}) {
    const tam = o.tam || TAM, ancla = o.ancla || 'start';
    const spans = segs.map(([t, c, p]) => `<tspan fill="${T.color(c)}"${p && p !== 400 ? ` font-weight="${p}"` : ''}>${T.esc(t)}</tspan>`).join('');
    return `<text class="kit-txt" x="${n2(x)}" y="${n2(y)}" font-size="${tam}"${ancla !== 'start' ? ` text-anchor="${ancla}"` : ''} style="font-variant-numeric:tabular-nums">${spans}</text>`;
  }
  function mezcla(datos, estado) {
    const ps = (datos && datos.pasos) || [];
    const p = ps.length ? ps[Math.max(0, Math.min(ps.length - 1, (estado && estado.paso) | 0))] : null;
    return Object.assign({}, datos || {}, p || {});
  }
  const altoBolsa = d => 9 + Math.ceil(d / 2) * DY;
  const plural = (k, uno, varios) => `${k} ${k === 1 ? uno : varios}`;

  // Una fila: dónde va cada bolsita y cada suelto (o hueco). Las bolsitas saltan de renglón si no caben.
  function filaDe(rp, d, y, cerrado) {
    const bolsas = [], sueltos = [], huecos = [];
    const hB = altoBolsa(rp.d);
    const porRenglon = Math.max(1, Math.floor((X1 - XB + BG) / (BW + BG)));
    let nb, ns, nf;
    if (cerrado) { nb = 1; ns = ent(rp.sobran !== undefined ? rp.sobran : rp.falta === undefined ? d.sobran : 0); nf = ent(rp.falta); }
    else { nb = Math.floor(ent(d.n) / rp.d); ns = ent(d.n) - nb * rp.d; nf = 0; }
    // Los sueltos van en una columna como si fueran una bolsita más (2 por renglón), con borde punteado.
    const items = nb + (ns + nf > 0 ? 1 : 0) + (cerrado ? 2 : 0);   // cerrado: el «× ?» ocupa dos lugares
    const renglones = Math.max(1, Math.ceil(items / porRenglon));
    for (let i = 0; i < items; i++) {
      const r = Math.floor(i / porRenglon), c = i % porRenglon;
      const x = XB + c * (BW + BG), yy = y + r * (hB + 6);
      if (i < nb) bolsas.push({ x, y: yy, w: BW, h: hB });
      else if (cerrado && i === nb) bolsas.push({ x, y: yy, w: 2 * BW + BG, h: hB, signo: true });
      else if (cerrado && i === nb + 1) continue;
      else {
        for (let j = 0; j < ns; j++) sueltos.push({ cx: x + 4 + (j % 2) * 7, cy: yy + 7 + Math.floor(j / 2) * DY + 2 });
        for (let j = 0; j < nf; j++) huecos.push({ cx: x + 4 + ((ns + j) % 2) * 7, cy: yy + 7 + Math.floor((ns + j) / 2) * DY + 2 });
      }
    }
    return { d: rp.d, nb, ns, nf, bolsas, sueltos, huecos, hB, alto: renglones * (hB + 6) - 6 };
  }

  // ---------- Geometría ----------
  function geometria(datos, estado = {}) {
    const d = mezcla(datos, estado);
    const reps = (Array.isArray(d.repartos) ? d.repartos : []).filter(x => ent(x && x.d) >= 2).map(x => Object.assign({}, x, { d: ent(x.d) }));
    const cerrado = !!d.cerrado;
    const letrero = segsDe(d.letrero), pie = segsDe(d.pie);
    const conLetrero = !!(datos && (datos.letrero !== undefined || (datos.pasos || []).some(p => p && p.letrero !== undefined)));
    const conPie = !!(datos && (datos.pie !== undefined || (datos.pasos || []).some(p => p && p.pie !== undefined)));
    const objetos = [], textos = [], filas = [];
    const tx = (que, x, y, segs, o = {}) => {
      const tam = o.tam || TAM, w = segsAncho(segs, tam);
      const x0 = o.ancla === 'middle' ? x - w / 2 : o.ancla === 'end' ? x - w : x;
      textos.push({ que, txt: segs.map(s => s[0]).join(''), x0, x1: x0 + w, y0: y - tam * 0.8, y1: y + tam * 0.25, x, y, segs, o });
    };
    if (letrero) tx('letrero', X0, 19, letrero, { peso: 700 });
    let y = conLetrero ? 32 : 8;
    reps.forEach((rp, k) => {
      const f = filaDe(rp, d, y, cerrado);
      tx(`etiqueta ${k}`, X0, y + Math.min(f.hB, 22) / 2 + 5, [[`De ${rp.d}:`, null, 700]]);
      for (const b of f.bolsas.filter(z => !z.signo)) objetos.push({ que: `bolsita fila ${k}`, x0: b.x, y0: b.y - 3, x1: b.x + b.w, y1: b.y + b.h });
      for (const z of [...f.sueltos, ...f.huecos]) objetos.push({ que: `suelto fila ${k}`, x0: z.cx - R - 1, y0: z.cy - R - 1, x1: z.cx + R + 1, y1: z.cy + R + 1 });
      if (cerrado && f.bolsas.length > 1) { const b = f.bolsas[1]; tx(`signo ${k}`, b.x + b.w / 2, b.y + Math.min(b.h, 22) / 2 + 5, [['× ?', null, 700]], { ancla: 'middle' }); }
      const nota = segsDe(rp.nota) || (cerrado
        ? (f.nf ? [['faltan '], [String(f.nf), 'o', 700], [` para otra bolsita de ${rp.d}`]] : [['sobran '], [String(f.ns), 'o', 700], [` con bolsitas de ${rp.d}`]])
        : [[`${plural(f.nb, 'bolsita', 'bolsitas')}`], f.ns ? [` y ${f.ns === 1 ? 'sobra' : 'sobran'} `] : [', no sobra nada'], ...(f.ns ? [[String(f.ns), 'o', 700]] : [])]);
      tx(`nota ${k}`, XB, y + f.alto + 14, nota);
      f.y = y; f.k = k;
      filas.push(f);
      y += f.alto + NOTA + SEP;
    });
    // El alto se reserva con el paso más lleno (la figura no salta en «Mira»).
    let yFin = y - SEP;
    if (datos && Array.isArray(datos.pasos) && datos.pasos.length && !(estado && estado._sinReserva)) {
      for (let p = 0; p < datos.pasos.length; p++) yFin = Math.max(yFin, geometria(datos, { paso: p, _sinReserva: true }).yFin);
    }
    if (+d.alto > 0) yFin = Math.max(yFin, +d.alto - (conPie ? 24 : 4));
    if (pie) tx('pie', X0, yFin + 16, pie);
    const H = Math.round(yFin + (conPie ? 24 : 4));
    return { W, H, M, d, cerrado, filas, objetos, textos, yFin };
  }

  function bolsita(b) {
    // Bolsa de papel con el doblez de arriba y un lazo: se reconoce como bolsita, no como caja.
    const { x, y, w, h } = b;
    return `<path class="re-bolsa" d="M${n2(x + 1)} ${n2(y + 3)}H${n2(x + w - 1)}L${n2(x + w)} ${n2(y + h - 2)}Q${n2(x + w)} ${n2(y + h)} ${n2(x + w - 2)} ${n2(y + h)}H${n2(x + 2)}Q${n2(x)} ${n2(y + h)} ${n2(x)} ${n2(y + h - 2)}Z" fill="currentColor" fill-opacity="0.08" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>`
      + `<path d="M${n2(x + w / 2 - 3)} ${n2(y)}L${n2(x + w / 2)} ${n2(y + 3)}L${n2(x + w / 2 + 3)} ${n2(y)}" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/>`;
  }

  // ---------- Dibujo ----------
  function dibujar(datos, estado = {}) {
    const g = geometria(datos, estado);
    let s = '';
    for (const f of g.filas) {
      for (const b of f.bolsas) {
        if (b.signo) continue;
        s += bolsita(b);
        for (let j = 0; j < f.d; j++) s += `<circle cx="${n2(b.x + 4 + (j % 2) * 7)}" cy="${n2(b.y + 7 + Math.floor(j / 2) * DY)}" r="${R}" fill="currentColor" fill-opacity="0.75"/>`;
      }
      for (const z of f.sueltos) s += `<circle class="re-suelto" cx="${n2(z.cx)}" cy="${n2(z.cy)}" r="${R + 0.4}" fill="var(--c-o)" fill-opacity="0.35" stroke="var(--c-o)" stroke-width="1.2" stroke-dasharray="1.6 1.2"/>`;
      for (const z of f.huecos) s += `<circle class="re-hueco" cx="${n2(z.cx)}" cy="${n2(z.cy)}" r="${R + 0.4}" fill="none" stroke="var(--c-o)" stroke-width="1.2" stroke-dasharray="1.6 1.2"/>`;
    }
    for (const t of g.textos) s += texto(t.x, t.y, t.segs, t.o);
    return T.svg(W, g.H, `<g class="kit-objeto" data-objeto="reparto" data-prueba="si">${s}</g>`, { alt: alt(datos, estado) });
  }

  function alt(datos, estado = {}) {
    const g = geometria(datos, estado);
    if (!g.filas.length) return 'Un paquete de caramelos todavía sin empacar.';
    if (g.cerrado) return 'Un paquete cerrado de caramelos: no se sabe cuántos hay. ' + g.filas.map(f => (f.nf
      ? `Con bolsitas de ${f.d}, faltan ${f.nf} para otra bolsita.` : `Con bolsitas de ${f.d}, sobran ${f.ns}.`)).join(' ');
    return `${g.d.n} caramelos empacados de ${g.filas.length} formas. ` + g.filas.map(f => `En bolsitas de ${f.d}: ${plural(f.nb, 'bolsita llena', 'bolsitas llenas')}`
      + (f.ns ? ` y ${plural(f.ns, 'caramelo suelto', 'caramelos sueltos')}.` : ', sin sueltos.')).join(' ');
  }

  return { id: 'arit-reparto', dibujar, alt, geometria, constantes: { W, M, X0, XB, X1 } };
});
