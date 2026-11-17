/*
 * Pieza «rm-aros» (17 nov 2026): los aros de educación física en el patio, dibujados por la sesión como prueba
 * (data-prueba; Gerson decide después cuáles reemplaza, docs/plan-calidad.md M4), y el mismo dibujo visto desde arriba
 * como diagrama de Venn. La usa la idea «Lo que vale en todo dibujo» de «Razonamiento deductivo»
 * (contenido/teoria/razonamiento-matematico/razonamiento-deductivo.js).
 *
 * Afirmación de la figura: cada aro es un grupo; estar dentro de dos aros es estar en los dos grupos. Un aro entero dentro
 * de otro es «todos»; dos aros que no se tocan, «ningún»; dos aros que comparten un pedazo, «algunos». Un dibujo que no
 * cumple las premisas va en gris, discontinuo y tachado.
 *
 * Papeles de color (paleta de deducción, fija en la pieza: quien llama da el papel, no el color):
 *   primero ... naranja (o): el primer grupo (A, los quenistas)
 *   segundo ... turquesa (i): el segundo grupo (C, los que bailan diablada)
 *   medio ..... tinta: el grupo que amarra (B, la banda)
 *   no cumple . gris: tinta al 55 %, discontinuo y con una raya
 * Ni verde ni carmín. Los aros se distinguen también por su nombre escrito (WCAG 1.4.1).
 *
 * datos = {
 *   escena: 'patio',                    el patio en perspectiva, con alumnos parados dentro de los aros
 *   aros: [{ nombre, papel: 'primero'|'segundo'|'medio', x, y, r, en: [x, y], cumple: false, desde, hasta }],
 *            en el patio: x de 0 a 10 y y de 0 a 9 sobre el piso; en: dónde va el nombre (centro del texto)
 *   ninos: [[x, y], …],                 en el patio: dónde se para cada alumno (sus pies)
 *   diagramas: [{ titulo, aros, cumple: false, desde, hasta }],   sin escena: 1 o 2 diagramas de Venn lado a lado; x de
 *            0 a 10 y y de 0 a datos.alto (6 por defecto) en cada uno
 *   alto: 6, apilar: true (los diagramas uno debajo del otro), margen: 1 (unidades de más a cada lado de x),
 *   nota: 'texto' | [{ t, desde, hasta }]   una línea al final (se reserva aunque no se vea)
 * }
 * estado = { corte }: se ve lo que tiene desde ≤ corte (y hasta ≥ corte). El alto no cambia con el estado.
 * Función pura de (datos, estado): sin ids, sin azar, sin reloj. Todo texto lo trae quien llama.
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
  const W = 320, M = 4, TENUE = 0.55, NOTA = 24;
  const PAPELES = { primero: 'o', segundo: 'i', medio: 'tinta', noCumple: 'tenue' };
  const n = T.n;
  const ve = (x, corte) => !x || ((x.desde || 0) <= corte && (x.hasta === undefined || corte <= x.hasta));
  const colorDe = a => (a.cumple === false ? 'currentColor' : a.papel === 'primero' ? `var(--c-${PAPELES.primero})` : a.papel === 'segundo' ? `var(--c-${PAPELES.segundo})` : 'currentColor');
  const tokenDe = a => (a.cumple === false ? undefined : a.papel === 'primero' ? PAPELES.primero : a.papel === 'segundo' ? PAPELES.segundo : undefined);

  // ---------- El patio en perspectiva ----------
  const PX = x => 14 + x * 29.2, PY = y => 34 + y * 17, RX = r => r * 29.2, RY = r => r * 17;
  const ALTO_PATIO = 200;
  function nino(x, y) {
    // Un alumno de pie, visto de frente: pies en (x, y).
    let s = `<line x1="${n(x - 3)}" y1="${n(y - 11)}" x2="${n(x - 4.5)}" y2="${n(y)}" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    s += `<line x1="${n(x + 3)}" y1="${n(y - 11)}" x2="${n(x + 4.5)}" y2="${n(y)}" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    s += `<line x1="${n(x - 6)}" y1="${n(y - 21)}" x2="${n(x - 9)}" y2="${n(y - 13)}" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    s += `<line x1="${n(x + 6)}" y1="${n(y - 21)}" x2="${n(x + 9)}" y2="${n(y - 13)}" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    s += `<rect x="${n(x - 6.5)}" y="${n(y - 24)}" width="13" height="15" rx="5" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`;
    s += `<circle cx="${n(x)}" cy="${n(y - 29)}" r="5.5" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`;
    return `<g data-nino="si">${s}</g>`;
  }
  function aroPatio(a, corte) {
    if (!ve(a, corte)) return '';
    const c = colorDe(a), no = a.cumple === false;
    let s = `<ellipse data-caja="si" data-aro="${T.esc(a.papel)}" cx="${n(PX(a.x))}" cy="${n(PY(a.y))}" rx="${n(RX(a.r))}" ry="${n(RY(a.r))}" fill="${c}" fill-opacity="${a.papel === 'medio' || no ? 0.04 : 0.1}" stroke="${c}" stroke-width="${a.papel === 'medio' ? 2.5 : 3}"${no ? ' stroke-dasharray="6 4"' : ''}/>`;
    if (a.nombre && a.en) s += T.rotulo(PX(a.en[0]), PY(a.en[1]) + 5, a.nombre, { ancla: 'middle', peso: 700, tam: 14, color: tokenDe(a), min: M, max: W - M });
    return no ? `<g data-cumple="no" opacity="${TENUE}">${s}</g>` : s;
  }
  function patio(d, corte) {
    let s = T.rotulo(M + 4, 18, 'Patio del colegio', { peso: 700, tam: 14 });
    // El piso: un rectángulo tenue con juntas de baldosa.
    let piso = `<rect data-caja="si" x="${M + 2}" y="26" width="${W - 2 * M - 4}" height="${ALTO_PATIO - 30}" rx="6" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-opacity="0.35" stroke-width="1"/>`;
    for (const y of [72, 116, 160]) piso += `<line data-caja="si" x1="${M + 6}" y1="${y}" x2="${W - M - 6}" y2="${y}" stroke="currentColor" stroke-opacity="0.12" stroke-width="1"/>`;
    s += `<g data-piso="si">${piso}</g>`;
    // Primero los aros (en el piso) y encima los alumnos, de atrás hacia adelante.
    for (const a of (d.aros || []).filter(x => x.papel === 'medio')) s += aroPatio(a, corte);
    for (const a of (d.aros || []).filter(x => x.papel !== 'medio')) s += aroPatio(a, corte);
    for (const [x, y] of (d.ninos || []).slice().sort((p, q) => p[1] - q[1])) s += nino(PX(x), PY(y));
    return `<g class="kit-objeto" data-objeto="patio" data-prueba="si">${s}</g>`;
  }

  // ---------- Diagramas de Venn (los aros vistos desde arriba) ----------
  function geometria(d) {
    // Lado a lado (ancho de medio lienzo cada uno) o, con apilar, uno debajo del otro (a una escala menor, centrados).
    // margen: unidades de más a cada lado de x (para aros que se mueven libres, como en el laboratorio).
    const k = (d.diagramas || []).length || 1, apilar = !!d.apilar && k > 1, mx = d.margen || 0;
    const ancho = k === 1 || apilar ? W - 2 * M : (W - 2 * M - 8) / 2;
    const esc = apilar ? 22 : (ancho - 8) / (10 + 2 * mx), xoff = apilar ? (ancho - 8 - 10 * esc) / 2 : mx * esc;
    const alto = d.alto || 6, titulo = (d.diagramas || []).some(x => x.titulo) ? 22 : 0;
    const altoD = titulo + alto * esc + 8;
    const x0 = i => (apilar ? M : M + i * (ancho + 8)), y0 = i => (apilar ? M + i * (altoD + 8) : M);
    const total = d.escena === 'patio' ? ALTO_PATIO : apilar ? M + k * (altoD + 8) - 8 : M + altoD;
    return { k, ancho, esc, xoff, alto, titulo, altoD, x0, y0, total };
  }
  function diagrama(d, g, i, corte) {
    const D = d.diagramas[i];
    if (!ve(D, corte)) return '';
    const yT = g.y0(i), X = x => g.x0(i) + 4 + g.xoff + x * g.esc, Y = y => yT + g.titulo + 4 + y * g.esc;
    const no = D.cumple === false;
    let s = `<rect data-caja="si" x="${n(g.x0(i) + 1)}" y="${n(yT + 1)}" width="${n(g.ancho - 2)}" height="${n(g.altoD - 2)}" rx="8" fill="none" stroke="currentColor" stroke-opacity="0.3" stroke-width="1"/>`;
    if (D.titulo) s += T.rotulo(g.x0(i) + g.ancho / 2, yT + 17, D.titulo, { ancla: 'middle', peso: 700, tam: 14, min: g.x0(i) + 2, max: g.x0(i) + g.ancho - 2 });
    const aros = (D.aros || []).filter(a => ve(a, corte));
    for (const a of aros.filter(x => x.papel === 'medio').concat(aros.filter(x => x.papel !== 'medio'))) {
      const c = colorDe(a), noA = a.cumple === false;
      s += `<circle data-caja="si" data-aro="${T.esc(a.papel)}" cx="${n(X(a.x))}" cy="${n(Y(a.y))}" r="${n(a.r * g.esc)}" fill="${c}" fill-opacity="${a.papel === 'medio' || noA ? 0.04 : 0.1}" stroke="${c}" stroke-width="${a.papel === 'medio' ? 2.5 : 3}"${noA ? ' stroke-dasharray="6 4"' : ''}/>`;
    }
    for (const a of aros) if (a.nombre && a.en) s += T.rotulo(X(a.en[0]), Y(a.en[1]) + 5, a.nombre, { ancla: 'middle', peso: 700, tam: 14, color: tokenDe(a), min: g.x0(i) + 2, max: g.x0(i) + g.ancho - 2 });
    if (no) s += `<line x1="${n(g.x0(i) + 10)}" y1="${n(yT + g.altoD - 10)}" x2="${n(g.x0(i) + g.ancho - 10)}" y2="${n(yT + g.titulo + 6)}" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    return no ? `<g data-cumple="no" opacity="${TENUE}">${s}</g>` : s;
  }

  function dibujar(d, e = {}) {
    const corte = e.corte || 0, g = geometria(d);
    let s = '';
    if (d.escena === 'patio') s += patio(d, corte);
    else (d.diagramas || []).forEach((_, i) => { s += diagrama(d, g, i, corte); });
    let alto = g.total + M;
    if (d.nota !== undefined) {
      const notas = (Array.isArray(d.nota) ? d.nota : [{ t: d.nota }]).filter(x => ve(x, corte));
      const t = notas.length ? notas[notas.length - 1].t : '';
      if (t) s += T.rotulo(W / 2, alto + 14, t, { ancla: 'middle', peso: 700, tam: 14, min: M, max: W - M });
      alto += NOTA;
    }
    return T.svg(W, Math.ceil(alto), s, { alt: alt(d) });
  }

  function alt(d) {
    const rel = aros => aros.map(a => `${a.nombre || 'un grupo'}${a.cumple === false ? ' (no cumple)' : ''}`).join(', ');
    if (d.escena === 'patio') return `Patio del colegio con aros en el piso y ${(d.ninos || []).length} alumnos parados. Aros: ${rel(d.aros || [])}.`;
    return `${(d.diagramas || []).length === 2 ? 'Dos diagramas de Venn lado a lado' : 'Diagrama de Venn'}: ${(d.diagramas || []).map(D => `${D.titulo ? D.titulo + ': ' : ''}${rel(D.aros || [])}${D.cumple === false ? ', no cumple' : ''}`).join('; ')}.`;
  }

  // Para las pruebas y para quien arrastra un aro: del piso del patio a la figura y de vuelta.
  const patioPx = (x, y) => ({ x: PX(x), y: PY(y) }), patioPiso = p => ({ x: (p.x - 14) / 29.2, y: (p.y - 34) / 17 });
  // Lo mismo en el diagrama i (sin escena): de unidades del diagrama a la figura y de vuelta.
  const vennPx = (d, i, x, y) => { const g = geometria(d); return { x: g.x0(i) + 4 + g.xoff + x * g.esc, y: g.y0(i) + g.titulo + 4 + y * g.esc }; };
  const vennPiso = (d, i, p) => { const g = geometria(d); return { x: (p.x - g.x0(i) - 4 - g.xoff) / g.esc, y: (p.y - g.y0(i) - g.titulo - 4) / g.esc }; };
  return { id: 'rm-aros', dibujar, alt, geometria, patioPx, patioPiso, vennPx, vennPiso, PAPELES, constantes: { W, TENUE, ALTO_PATIO } };
});
