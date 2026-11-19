/*
 * Pieza «arit-boletos» (19 nov 2026): la plancha de boletos de la rifa de la promoción, para «Divisibilidad»
 * (contenido/teoria/aritmetica/divisibilidad.js, idea 1; docs/etapa5/propuesta-aritmetica.md §2). Dibujo de prueba
 * (data-prueba): Gerson decide después si lo reemplaza (docs/plan-calidad.md, M4).
 *
 * Afirmación de la figura: los boletos premiados aparecen cada d; cada premio cierra un grupo completo de d boletos, y
 * los que sobran al final no alcanzan para otro premio.
 *
 * Fidelidad: cada boleto se dibuja, con su número, en el orden en que se venden (de izquierda a derecha y de arriba
 * abajo). Todos miden lo mismo. Un grupo es exactamente d boletos seguidos y termina en un múltiplo de d: no se estira
 * ni se corta para que cuadre una fila. Nada se marca si los datos no lo piden (en Predice la plancha va sin premios).
 *
 * datos = {
 *   desde: 1, hasta: 50,        primer y último boleto de la plancha
 *   columnas: 10,               boletos por fila (de 5 a 10)
 *   premio: 6,                  d: llevan premio los boletos cuyo número es múltiplo de d
 *   marcar: true | false | 3,   marca los premiados (turquesa, borde grueso y esquina sellada): todos, ninguno o solo
 *                               los 3 primeros (para «Mira»). Sin premio no se marca nada
 *   grupos: true,               sombrea, uno sí y uno no, cada grupo completo de d boletos (el que termina en un premiado)
 *   sobran: true,               los boletos que quedan después del último premiado, con borde punteado naranja
 *   letrero: [[texto, color?, peso?], …],   el cartel de la rifa, arriba («Premio: múltiplos de 6», el 6 en turquesa)
 *   pie: [[texto, color?, peso?], …],       una línea bajo la plancha (lo que se cuenta); el alto se reserva siempre que
 *                                           algún paso la traiga, para que la figura no salte
 *   pasos: [{ …datos }, …],     para «Mira»: estado.paso elige qué cambia (se mezcla con los datos)
 * }
 * estado = { paso }. Función pura de (datos, estado): sin ids, sin azar, sin reloj. Lienzo de 320 de ancho; el alto sale
 * de las filas (fijo para una misma plancha).
 * Colores: tinta (currentColor) y var(--c-*): los premiados en turquesa (i: son los múltiplos de d, «el envase» del mapa
 * de colores de la rama), los que sobran en naranja (o) y, en el letrero o el pie, lo que los datos pidan (violeta para
 * lo que se cuenta). Nunca carmín ni verde. El color no es la única señal: el premiado lleva borde grueso, número en
 * negrita y la esquina sellada; el que sobra, borde punteado. geometria(datos, estado) da las cajas de todo lo dibujado.
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
  const X0 = 10, X1 = 310, SEP = 2;     // ancho de la plancha y separación entre boletos
  const ALTO = 22, PASO_Y = 25;         // alto de un boleto y paso entre filas
  const LET = { y0: 6, y1: 30, base: 23 };   // el cartel
  const n2 = T.n;
  const entero = x => Math.max(0, Math.floor(+x || 0));

  function mezcla(datos, estado) {
    const ps = (datos && datos.pasos) || [];
    const p = ps[Math.max(0, Math.min(ps.length - 1, (estado && estado.paso) | 0))];
    return Object.assign({}, datos || {}, p || {});
  }
  const segsAncho = (segs, tam = TAM) => segs.reduce((a, s) => a + T.ancho(s[0], tam, s[2] || 400), 0);
  const segsDe = x => (typeof x === 'string' ? [[x]] : Array.isArray(x) ? x : null);
  function texto(x, y, segs, o = {}) {
    const tam = o.tam || TAM, ancla = o.ancla || 'start';
    const spans = segs.map(([t, c, p]) => `<tspan fill="${T.color(c)}"${p && p !== 400 ? ` font-weight="${p}"` : ''}>${T.esc(t)}</tspan>`).join('');
    return `<text class="kit-txt" x="${n2(x)}" y="${n2(y)}" font-size="${tam}"${ancla !== 'start' ? ` text-anchor="${ancla}"` : ''} style="font-variant-numeric:tabular-nums">${spans}</text>`;
  }

  // ---------- Geometría ----------
  function geometria(datos, estado = {}) {
    const d = mezcla(datos, estado);
    const desde = Math.max(1, entero(d.desde) || 1), hasta = Math.max(desde, entero(d.hasta) || desde);
    const cols = Math.max(5, Math.min(10, entero(d.columnas) || 10));
    const premio = entero(d.premio);
    const total = hasta - desde + 1, filas = Math.ceil(total / cols);
    const cw = (X1 - X0 - (cols - 1) * SEP) / cols;
    const letrero = segsDe(d.letrero), pie = segsDe(d.pie);
    // El pie reserva su línea si los datos o algún paso lo traen (el alto no salta en «Mira»).
    const conPie = !!(datos && (datos.pie !== undefined || (datos.pasos || []).some(p => p && p.pie !== undefined)));
    const conLetrero = !!(datos && (datos.letrero !== undefined || (datos.pasos || []).some(p => p && p.letrero !== undefined)));
    const yG = conLetrero ? LET.y1 + 8 : 8;
    const ultimoPremio = premio ? Math.floor(hasta / premio) * premio : 0;
    const cuantos = premio ? Math.floor(hasta / premio) - Math.floor((desde - 1) / premio) : 0;
    const tope = d.marcar === false || !premio ? 0 : d.marcar === true || d.marcar === undefined ? Infinity : entero(d.marcar);
    const celdas = [];
    let vistos = 0;
    for (let i = 0; i < total; i++) {
      const num = desde + i, f = Math.floor(i / cols), c = i % cols;
      const esPremio = !!premio && num % premio === 0;
      if (esPremio) vistos++;
      const grupo = premio ? Math.floor((num - 1) / premio) : 0;
      // Un grupo cuenta si está entero en la plancha: empieza en desde o después y su premiado no pasa del último boleto.
      const entera = !!premio && grupo * premio + 1 >= desde && (grupo + 1) * premio <= hasta;
      celdas.push({ num, x: X0 + c * (cw + SEP), y: yG + f * PASO_Y, w: cw, h: ALTO,
        premio: esPremio && vistos <= tope,
        sombra: !!d.grupos && entera && grupo % 2 === 0,
        sobra: !!d.sobran && !!premio && num > ultimoPremio });
    }
    const objetos = [], textos = [];
    for (const c of celdas) objetos.push({ que: `boleto ${c.num}`, x0: c.x, y0: c.y, x1: c.x + c.w, y1: c.y + c.h });
    const rot = [];
    const tx = (que, x, y, segs, o = {}) => {
      const w = segsAncho(segs, o.tam || TAM), x0 = o.ancla === 'middle' ? x - w / 2 : x;
      textos.push({ que, txt: segs.map(s => s[0]).join(''), x0, x1: x0 + w, y0: y - (o.tam || TAM) * 0.8, y1: y + (o.tam || TAM) * 0.25 });
      rot.push({ x, y, segs, o });
      return w;
    };
    let cartel = null;
    if (letrero) {
      const w = segsAncho(letrero);
      cartel = { x0: X0, y0: LET.y0, x1: X0 + w + 20, y1: LET.y1 };
      objetos.push({ que: 'cartel', x0: cartel.x0, y0: cartel.y0, x1: cartel.x1, y1: cartel.y1 });
      tx('cartel', X0 + 10, LET.base, letrero);
    }
    const yFin = yG + (filas - 1) * PASO_Y + ALTO;
    if (pie) tx('pie', X0, yFin + 18, pie);
    const H = Math.round(yFin + (conPie ? 26 : 6));
    return { W, H, M, d, desde, hasta, cols, premio, filas, cw, celdas, cuantos, ultimoPremio, sobrantes: premio ? hasta - ultimoPremio : 0, cartel, rot, objetos, textos, yG };
  }

  // Un boleto: tarjeta con las dos muescas del troquel a media altura.
  function boleto(c) {
    const { x, y, w, h } = c, r = 2.5, m = 2, ym = y + h / 2;
    const d = `M${n2(x + r)} ${n2(y)}H${n2(x + w - r)}Q${n2(x + w)} ${n2(y)} ${n2(x + w)} ${n2(y + r)}V${n2(ym - m)}A${m} ${m} 0 0 0 ${n2(x + w)} ${n2(ym + m)}V${n2(y + h - r)}`
      + `Q${n2(x + w)} ${n2(y + h)} ${n2(x + w - r)} ${n2(y + h)}H${n2(x + r)}Q${n2(x)} ${n2(y + h)} ${n2(x)} ${n2(y + h - r)}V${n2(ym + m)}A${m} ${m} 0 0 0 ${n2(x)} ${n2(ym - m)}V${n2(y + r)}Q${n2(x)} ${n2(y)} ${n2(x + r)} ${n2(y)}Z`;
    const t = String(c.num), tam = t.length >= 3 ? 10 : 11.5;
    let s = `<path d="${d}" fill="var(--card)" stroke="none"/>`;
    if (c.sombra) s += `<path d="${d}" fill="currentColor" fill-opacity="0.13" stroke="none"/>`;
    if (c.premio) {
      s += `<path class="bo-premio" d="${d}" fill="var(--c-i)" fill-opacity="0.2" stroke="var(--c-i)" stroke-width="2.2" stroke-linejoin="round"/>`;
      // La esquina sellada: el premio no se lee solo por el color.
      s += `<path d="M${n2(x + w - 8)} ${n2(y + 1.1)}H${n2(x + w - r)}Q${n2(x + w - 1.1)} ${n2(y + 1.1)} ${n2(x + w - 1.1)} ${n2(y + r)}V${n2(y + 8)}Z" fill="var(--c-i)"/>`;
    } else if (c.sobra) {
      s += `<path class="bo-sobra" d="${d}" fill="var(--c-o)" fill-opacity="0.14" stroke="var(--c-o)" stroke-width="1.8" stroke-dasharray="3 2.2" stroke-linejoin="round"/>`;
    } else {
      s += `<path d="${d}" fill="none" stroke="currentColor" stroke-width="1.1" stroke-opacity="0.6" stroke-linejoin="round"/>`;
    }
    s += `<text class="kit-txt" x="${n2(x + w / 2)}" y="${n2(y + h / 2 + tam * 0.36)}" font-size="${tam}" text-anchor="middle"${c.premio ? ' font-weight="700"' : ''} fill="${c.premio ? 'var(--c-i)' : c.sobra ? 'var(--c-o)' : 'currentColor'}" style="font-variant-numeric:tabular-nums">${T.esc(t)}</text>`;
    return s;
  }

  // ---------- Dibujo ----------
  function dibujar(datos, estado = {}) {
    const g = geometria(datos, estado);
    let s = '';
    if (g.cartel) {
      const c = g.cartel;
      // El cartel cuelga de dos cordeles.
      s += `<path d="M${n2(c.x0 + 12)} ${M}V${c.y0}M${n2(c.x1 - 12)} ${M}V${c.y0}" stroke="currentColor" stroke-width="1.2" stroke-opacity="0.6"/>`;
      s += `<rect x="${n2(c.x0)}" y="${c.y0}" width="${n2(c.x1 - c.x0)}" height="${c.y1 - c.y0}" rx="5" fill="var(--card)" stroke="currentColor" stroke-width="1.6"/>`;
    }
    for (const c of g.celdas) s += boleto(c);
    for (const r of g.rot) s += texto(r.x, r.y, r.segs, r.o);
    return T.svg(W, g.H, `<g class="kit-objeto" data-objeto="boletos" data-prueba="si">${s}</g>`, { alt: alt(datos, estado) });
  }

  function alt(datos, estado = {}) {
    const g = geometria(datos, estado);
    let t = `Plancha de boletos de una rifa, numerados del ${g.desde} al ${g.hasta}, en filas de ${g.cols}.`;
    if (g.premio) {
      const marcados = g.celdas.filter(c => c.premio).map(c => c.num);
      t += ` El premio es para los múltiplos de ${g.premio}`;
      t += marcados.length ? `; están marcados ${marcados.length > 8 ? `${marcados.slice(0, 4).join(', ')}… hasta el ${marcados[marcados.length - 1]}` : marcados.join(', ')}.` : ': ninguno está marcado todavía.';
      if (g.celdas.some(c => c.sombra)) t += ` Cada grupo de ${g.premio} boletos seguidos termina en un premiado.`;
      if (g.celdas.some(c => c.sobra)) t += ` Al final ${g.sobrantes === 1 ? 'sobra 1 boleto' : `sobran ${g.sobrantes} boletos`}, que no completan otro grupo.`;
    }
    return t;
  }

  return { id: 'arit-boletos', dibujar, alt, geometria, constantes: { W, M, X0, X1, ALTO, PASO_Y } };
});
