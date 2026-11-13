/*
 * Primitivas SVG del kit (docs/escena-viva.md, sección 5), como strings.
 * Tokens de trazo: 3 px para la variable en estudio, 2 px para contornos, 1 px para cuadrículas;
 * puntas y uniones redondas; texto de 16 unidades (en un lienzo de 320 de ancho, ≥ 14 px a 360 px de pantalla)
 * con cifras tabulares; color solo con var(--c-o|i|h|d|f) o currentColor (la tinta del tema).
 * Todo texto que entra se escapa. Coordenadas a 2 decimales. Sin ids: varias figuras conviven en una página.
 * Funciona en el navegador (window.Kit.trazo) y en Node (require).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const Kit = nodo ? require('./kit.js') : (root.Kit = root.Kit || {});
  const api = fabrica();
  Kit.trazo = api;
  if (nodo) module.exports = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const GROSOR = { variable: 3, contorno: 2, cuadricula: 1 };
  const TEXTO = 16;                 // tamaño base del texto en el lienzo de 320
  const ANCHO = 320;                // ancho de lienzo recomendado
  const COLORES = ['o', 'i', 'h', 'd', 'f'];

  const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const n = x => { const r = Math.round(x * 100) / 100; return Object.is(r, -0) ? '0' : String(r); };
  // 'o' → var(--c-o); cualquier otra cosa → currentColor (tinta). Nunca un hex.
  const color = c => (COLORES.includes(c) ? `var(--c-${c})` : 'currentColor');
  const clase = c => (c ? ` class="${esc(c)}"` : '');

  // Ancho aproximado de un texto (system-ui): cifras tabulares ≈ 0,56 em, letras ≈ 0,52 em, espacios ≈ 0,28 em.
  function ancho(texto, tam = TEXTO, peso = 400) {
    let w = 0;
    for (const ch of String(texto)) w += /\s/.test(ch) ? 0.28 : /[0-9]/.test(ch) ? 0.56 : /[ilI.,:;'|!]/.test(ch) ? 0.28 : /[mwMW%]/.test(ch) ? 0.82 : 0.55;
    return w * tam * (peso >= 600 ? 1.05 : 1);
  }

  // Deja un texto dentro de [min, max] según su ancla.
  function encajar(x, texto, ancla, { tam = TEXTO, peso = 400, min = 0, max = ANCHO } = {}) {
    const w = ancho(texto, tam, peso);
    const izq = ancla === 'middle' ? x - w / 2 : ancla === 'end' ? x - w : x;
    const dx = izq < min ? min - izq : izq + w > max ? max - (izq + w) : 0;
    return x + dx;
  }

  /* rotulo(x, y, texto, { color, ancla, peso, tam, clase, min, max }) → <text> pegado a lo que nombra.
     y es la línea base. Se encaja dentro de [min, max] para no salirse del lienzo. */
  function rotulo(x, y, texto, o = {}) {
    const ancla = o.ancla || 'start', tam = Math.max(14, o.tam || TEXTO), peso = o.peso || 400;
    const xx = encajar(x, texto, ancla, { tam, peso, min: o.min === undefined ? 2 : o.min, max: o.max === undefined ? ANCHO - 2 : o.max });
    return `<text${clase('kit-txt' + (o.clase ? ' ' + o.clase : ''))} x="${n(xx)}" y="${n(y)}" fill="${color(o.color)}" font-size="${tam}"${peso !== 400 ? ` font-weight="${peso}"` : ''}${ancla !== 'start' ? ` text-anchor="${ancla}"` : ''} style="font-variant-numeric:tabular-nums">${esc(texto)}</text>`;
  }

  // Punta única del kit: triángulo de 10 de largo y 5 de semiancho, relleno, con unión redonda.
  function punta(x, y, ang, c, g) {
    const L = 10 + g, A = 5 + g / 2, ca = Math.cos(ang), sa = Math.sin(ang);
    const p = (dx, dy) => `${n(x + dx * ca - dy * sa)} ${n(y + dx * sa + dy * ca)}`;
    return `<path d="M${p(0, 0)}L${p(-L, A)}L${p(-L, -A)}Z" fill="${c}" stroke="${c}" stroke-width="${g}" stroke-linejoin="round"/>`;
  }

  /* flecha(x1, y1, x2, y2, { color, grosor, clase }) → línea con la punta en (x2, y2). */
  function flecha(x1, y1, x2, y2, o = {}) {
    const g = o.grosor || GROSOR.contorno, c = color(o.color);
    const ang = Math.atan2(y2 - y1, x2 - x1), L = 10 + g;
    const fx = x2 - Math.cos(ang) * L * 0.8, fy = y2 - Math.sin(ang) * L * 0.8; // la línea termina dentro de la punta
    return `<g${clase(o.clase)}><line x1="${n(x1)}" y1="${n(y1)}" x2="${n(fx)}" y2="${n(fy)}" stroke="${c}" stroke-width="${g}" stroke-linecap="round"/>${punta(x2, y2, ang, c, g)}</g>`;
  }

  /* cota(x1, x2, y, { texto, color, lado: 'arriba'|'abajo', grosor, clase, peso }) → medida horizontal con topes
     y su rótulo centrado, del lado pedido. */
  function cota(x1, x2, y, o = {}) {
    const g = o.grosor || GROSOR.contorno, c = color(o.color), t = 6;
    const lado = o.lado === 'abajo' ? 1 : -1;
    let s = `<line x1="${n(x1)}" y1="${n(y)}" x2="${n(x2)}" y2="${n(y)}" stroke="${c}" stroke-width="${g}" stroke-linecap="round"/>`
      + `<line x1="${n(x1)}" y1="${n(y - t)}" x2="${n(x1)}" y2="${n(y + t)}" stroke="${c}" stroke-width="${g}" stroke-linecap="round"/>`
      + `<line x1="${n(x2)}" y1="${n(y - t)}" x2="${n(x2)}" y2="${n(y + t)}" stroke="${c}" stroke-width="${g}" stroke-linecap="round"/>`;
    if (o.texto) s += rotulo((x1 + x2) / 2, lado < 0 ? y - 10 : y + 22, o.texto, { color: o.color, ancla: 'middle', peso: o.peso || 600 });
    return `<g${clase(o.clase)}>${s}</g>`;
  }

  /* eje(x1, x2, y, { marcas: [x...], alto, grosor, color, clase }) → línea base con marcas cortas (cuadrícula de 1 px). */
  function eje(x1, x2, y, o = {}) {
    const g = o.grosor || GROSOR.cuadricula, c = color(o.color), h = o.alto || 6;
    let s = `<line x1="${n(x1)}" y1="${n(y)}" x2="${n(x2)}" y2="${n(y)}" stroke="${c}" stroke-width="${g}" stroke-linecap="round"/>`;
    for (const x of o.marcas || []) s += `<line x1="${n(x)}" y1="${n(y - h)}" x2="${n(x)}" y2="${n(y)}" stroke="${c}" stroke-width="${g}" stroke-linecap="round"/>`;
    return `<g${clase(o.clase || 'kit-eje')}>${s}</g>`;
  }

  /* resaltado(x, y, w, h, { color, radio, clase }) → fondo tenue (14 %) detrás de lo que hay que mirar. */
  function resaltado(x, y, w, h, o = {}) {
    return `<rect${clase(o.clase)} x="${n(x)}" y="${n(y)}" width="${n(Math.max(0, w))}" height="${n(Math.max(0, h))}" rx="${n(o.radio === undefined ? 6 : o.radio)}" fill="${color(o.color)}" fill-opacity="0.14"/>`;
  }

  /* barra(x, y, w, h, { color, grosor, relleno, discontinua, clase }) → rectángulo con contorno y relleno tenue. */
  function barra(x, y, w, h, o = {}) {
    const c = color(o.color), g = o.grosor || GROSOR.contorno;
    return `<rect${clase(o.clase)} x="${n(x)}" y="${n(y)}" width="${n(Math.max(0, w))}" height="${n(Math.max(0, h))}" rx="4" fill="${c}" fill-opacity="${o.relleno === undefined ? 0.16 : o.relleno}" stroke="${c}" stroke-width="${g}" stroke-linejoin="round"${o.discontinua ? ' stroke-dasharray="6 4"' : ''}/>`;
  }

  /* linea(x1, y1, x2, y2, { color, grosor, discontinua, opacidad, clase }) */
  function linea(x1, y1, x2, y2, o = {}) {
    return `<line${clase(o.clase)} x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" stroke="${color(o.color)}" stroke-width="${o.grosor || GROSOR.contorno}" stroke-linecap="round"${o.discontinua ? ' stroke-dasharray="4 5"' : ''}${o.opacidad !== undefined ? ` stroke-opacity="${o.opacidad}"` : ''}/>`;
  }

  /* svg(ancho, alto, contenido, { alt, clase }) → la figura completa, con role="img" y su texto alternativo. */
  function svg(w, h, contenido, o = {}) {
    const a = o.alt ? ` role="img" aria-label="${esc(o.alt)}"` : ' aria-hidden="true"';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n(w)} ${n(h)}" width="${n(w)}" height="${n(h)}"${a} class="kit-svg${o.clase ? ' ' + esc(o.clase) : ''}" font-family="inherit">${contenido}</svg>`;
  }

  return { GROSOR, TEXTO, ANCHO, COLORES, esc, n, color, ancho, encajar, rotulo, flecha, cota, eje, resaltado, barra, linea, svg };
});
