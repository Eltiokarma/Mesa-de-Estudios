/*
 * Pieza «rv-texto» (razonamiento verbal): un texto corto, propio, en el que se marca la evidencia. Es la figura de
 * toda la teoría de razonamiento verbal (docs/teoria.md, ruta A · Argumentar y C · Comparar): el texto es el objeto
 * de estudio y lo que cambia es qué parte se marca, se tapa, se tacha o se pone en el hueco.
 *
 * Afirmación de la figura: la respuesta se sostiene en palabras concretas del texto, y se ven marcadas en su lugar.
 *
 * datos = {
 *   secciones: [{
 *     id: 's1',                       // para los sellos
 *     titulo: 'Texto A',              // opcional: cabecera en negrita
 *     modo: 'parrafo' | 'lista' | 'tarjeta',   // párrafo corrido · una oración por renglón, numerada · tarjeta con borde
 *                                     // en una lista, un fragmento con junto: true sigue en el renglón del anterior
 *     fragmentos: [{ id: 'f1', t: 'La biblioteca amplió su horario.' } | { id: 'f2', hueco: true, reserva: 'sin embargo,' }],
 *                                     // reserva: el texto más largo que puede entrar en el hueco (fija su ancho);
 *                                     // caja: false lo deja sin recuadro y en letra normal (texto que cambia, no hueco)
 *   }],
 *   numerar: false,                   // en párrafo, antepone (1), (2)… a cada fragmento
 * }
 * estado = {
 *   marcas:  { f1: 'i' },             // subrayado de 3 px y fondo tenue. Trazo distinto por color (no solo color):
 *                                     //   i continuo · o discontinuo · d punteado · h continuo con fondo más fuerte
 *   tachar:  ['f3'],                  // raya de tinta encima y texto tenue (lo que se descarta; el error va con marca h)
 *   tapar:   ['f2'],                  // el fragmento se cubre con una banda gris que conserva su lugar
 *   huecos:  { f2: 'sin embargo' },   // texto que entra en un fragmento con hueco: true (si no, «______»)
 *   sellos:  { s2: { t: 'Lo dice', c: 'i' } },  // rótulo en la cabecera de una sección (la clasificación)
 *   nuevo:   ['f1'],                  // su marca, tacha o sello se anima al avanzar un paso de «Mira» (el texto no se mueve)
 * }
 * El alto depende solo de datos: cambiar el estado nunca mueve el texto. El ancho de cada trozo se fija con
 * textLength (la medida del kit), así las marcas caen exactas bajo sus palabras en cualquier fuente.
 * Colores de la teoría de verbal (regla 4, igual en todo el curso): i = lo que el texto dice (evidencia),
 * o = la opción o afirmación que se evalúa, d = la relación (conector, idea que organiza), h = lo que choca o sobra.
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
  const W = 320, PAD = 8, TAM = 16, LH = 25, NUM = 24, PAD_T = 10, SEP = 12;
  const COLORES = ['i', 'o', 'd', 'h'];
  const HUECO = '______';

  // Reparte las palabras de cada fragmento en renglones de ancho `ancho`. Devuelve trozos { id, x, y, texto, w }.
  function componer(sec, x0, ancho, y0, numerar, num0) {
    const trozos = [], cajas = [];
    let x = x0, y = y0, k = num0, izq = x0;
    const esp = T.ancho(' ', TAM);
    const lista = sec.modo === 'lista';
    for (const fr of sec.fragmentos || []) {
      k++;
      // En una lista, cada fragmento abre renglón con su número, salvo los que siguen en el mismo (junto: true).
      if (lista && fr.junto) k--;
      if (lista && !fr.junto) {
        if (x > x0) y += LH;
        trozos.push({ num: true, x: x0, y, texto: `${k}`, w: NUM - 6 });
        izq = x0 + NUM; x = izq;
      }
      // Un hueco es una sola pieza del ancho de `reserva` (el texto más largo que puede entrar): no se parte.
      const palabras = fr.hueco ? [fr.reserva || HUECO] : String(fr.t).split(/\s+/).filter(Boolean);
      if (numerar && !lista) palabras.unshift(`(${k})`);
      let actual = null;
      for (const [j, p] of palabras.entries()) {
        const caja = fr.hueco && fr.caja !== false;
        const w = T.ancho(p, TAM, caja ? 700 : 400) + (caja ? 12 : 0);   // el hueco con caja lleva aire a cada lado
        const pegado = /^[.,;:!?)»]/.test(p);   // la puntuación va pegada a lo anterior
        const lugar = x > izq && !pegado ? esp : 0;
        if (x + lugar + w > x0 + ancho && x > izq && !pegado) { y += LH; x = izq; actual = null; }
        const sep = x > izq && !pegado ? esp : 0;
        if (!actual) { actual = { id: fr.id, x: x + sep, y, texto: p, w, hueco: fr.hueco, caja, n: numerar && !lista && j === 0 }; trozos.push(actual); }
        else { actual.texto += ' ' + p; actual.w = x + sep + w - actual.x; }
        x += sep + w;
        // El número entre paréntesis va solo: no se marca con el fragmento.
        if (numerar && !lista && j === 0) actual = null;
      }
      cajas.push(fr.id);
    }
    return { trozos, alto: y - y0 + LH, k };
  }

  function disponer(d) {
    const out = [];
    let y = PAD + 4, k = 0;
    for (const sec of d.secciones || []) {
      const tarjeta = sec.modo === 'tarjeta';
      const x0 = PAD + (tarjeta ? PAD_T : 0), ancho = W - 2 * PAD - (tarjeta ? 2 * PAD_T : 0);
      const top = y;
      if (tarjeta) y += PAD_T;
      let cab = null;
      if (sec.titulo) { cab = { x: x0, y: y + 17, texto: sec.titulo }; y += LH; }
      // Cada lista numera desde 1; con numerar, los (1), (2)… del párrafo siguen de una sección a otra.
      const c = componer(sec, x0, ancho, y + 18, d.numerar, d.numerar && sec.modo !== 'lista' ? k : 0);
      if (d.numerar && sec.modo !== 'lista') k = c.k;
      y += c.alto;
      if (tarjeta) y += PAD_T - 4;
      out.push({ sec, top, bottom: y, cab, trozos: c.trozos, tarjeta });
      y += SEP;
    }
    return { secciones: out, alto: Math.max(60, y - SEP + PAD) };
  }

  function dibujar(d, estado = {}) {
    const L = disponer(d);
    const marcas = estado.marcas || {}, tachar = new Set(estado.tachar || []), tapar = new Set(estado.tapar || []);
    const huecos = estado.huecos || {}, sellos = estado.sellos || {}, nuevo = new Set(estado.nuevo || []);
    let fondo = '', tinta = '', encima = '';
    for (const s of L.secciones) {
      if (s.tarjeta) fondo += `<rect x="${PAD}" y="${T.n(s.top)}" width="${W - 2 * PAD}" height="${T.n(s.bottom - s.top)}" rx="10" fill="none" stroke="currentColor" stroke-opacity="0.35" stroke-width="${T.GROSOR.contorno}"/>`;
      if (s.cab) tinta += T.rotulo(s.cab.x, s.cab.y, s.cab.texto, { peso: 700, clase: 'kit-txt' });
      const sello = sellos[s.sec.id];
      if (sello) {
        const c = COLORES.includes(sello.c) ? sello.c : null, w = T.ancho(sello.t, 14, 700) + 16;
        const x = W - PAD - (s.tarjeta ? 6 : 0) - w, y = s.top + (s.tarjeta ? 6 : 0);
        encima += `<g class="rv-sello${nuevo.has(s.sec.id) ? ' kit-nuevo kit-aparece' : ''}"><rect x="${T.n(x)}" y="${T.n(y)}" width="${T.n(w)}" height="22" rx="11" fill="var(--card)" stroke="${T.color(c)}" stroke-width="${T.GROSOR.contorno}"/>`
          + `<text x="${T.n(x + w / 2)}" y="${T.n(y + 16)}" fill="${T.color(c)}" font-size="14" font-weight="700" text-anchor="middle">${T.esc(sello.t)}</text></g>`;
      }
      for (const tr of s.trozos) {
        if (tr.num) { tinta += `<text class="kit-num" x="${T.n(tr.x)}" y="${T.n(tr.y)}" fill="currentColor" font-size="14" font-weight="700" opacity="0.75">${T.esc(tr.texto)}</text>`; continue; }
        const id = tr.id, m = marcas[id], c = COLORES.includes(m) ? m : null, cl = nuevo.has(id) ? ' kit-nuevo kit-aparece' : '';
        let texto = tr.texto;
        if (tr.hueco && !tr.n) texto = huecos[id] !== undefined ? huecos[id] : HUECO;
        const w = tr.w;
        if (tapar.has(id) && !tr.n) {
          fondo += `<rect class="rv-tapa${cl}" x="${T.n(tr.x - 2)}" y="${T.n(tr.y - 15)}" width="${T.n(tr.w + 4)}" height="20" rx="4" fill="currentColor" fill-opacity="0.18"/>`;
          continue;
        }
        if (c && !tr.n) {
          fondo += `<rect class="rv-marca${cl}" x="${T.n(tr.x - 2)}" y="${T.n(tr.y - 16)}" width="${T.n(w + 4)}" height="21" rx="4" fill="${T.color(c)}" fill-opacity="${c === 'h' ? 0.22 : 0.14}"/>`;
          const raya = c === 'o' ? ' stroke-dasharray="7 4"' : c === 'd' ? ' stroke-dasharray="1 5"' : '';
          encima += `<line class="rv-sub${cl}" x1="${T.n(tr.x)}" y1="${T.n(tr.y + 5)}" x2="${T.n(tr.x + w)}" y2="${T.n(tr.y + 5)}" stroke="${T.color(c)}" stroke-width="${T.GROSOR.variable}" stroke-linecap="round"${raya}/>`;
        }
        if (tr.caja && !tr.n) {
          fondo += `<rect x="${T.n(tr.x + 1)}" y="${T.n(tr.y - 16)}" width="${T.n(w - 2)}" height="22" rx="5" fill="none" stroke="${T.color(c || 'd')}" stroke-width="${T.GROSOR.contorno}" stroke-dasharray="5 4"/>`;
        }
        const tenue = tachar.has(id) && !tr.n;
        const largo = texto.length > 3 && !tr.hueco ? ` textLength="${T.n(w)}" lengthAdjust="spacing"` : '';
        const xt = tr.caja && !tr.n ? tr.x + (w - T.ancho(texto, TAM, 700)) / 2 : tr.x;
        const colorTxt = tr.caja && !tr.n ? T.color(c || 'd') : 'currentColor';   // lo que entra al hueco lleva el color de su marca
        tinta += `<text class="kit-txt" x="${T.n(xt)}" y="${T.n(tr.y)}" fill="${colorTxt}" font-size="${tr.n ? 14 : TAM}"${tr.caja || tr.n ? ' font-weight="700"' : ''}${tenue ? ' opacity="0.5"' : ''}${largo}>${T.esc(texto)}</text>`;
        if (tenue) encima += `<line class="rv-tacha${cl}" x1="${T.n(tr.x - 1)}" y1="${T.n(tr.y - 5)}" x2="${T.n(tr.x + w + 1)}" y2="${T.n(tr.y - 5)}" stroke="currentColor" stroke-width="${T.GROSOR.contorno}" stroke-linecap="round"/>`;
      }
    }
    return T.svg(W, L.alto, fondo + tinta + encima, { alt: alt(d), clase: 'rv-texto' });
  }

  // El texto alternativo es el texto mismo: quien usa lector de pantalla tiene que poder leerlo entero.
  function alt(d) {
    const secs = (d.secciones || []).map(s => {
      const frs = (s.fragmentos || []).map((f, k) => `${s.modo === 'lista' ? `${k + 1}. ` : ''}${f.hueco ? '(espacio en blanco)' : f.t}`).join(' ');
      return `${s.titulo ? `${s.titulo}: ` : ''}${frs}`;
    });
    return `Texto para leer. ${secs.join(' · ')}`;
  }

  return { id: 'rv-texto', dibujar, alt, disponer, constantes: { W, PAD, TAM, LH } };
});
