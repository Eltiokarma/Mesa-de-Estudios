/*
 * Pieza «quim-objeto» (18 nov 2026, etapa 4 de química, Estructura atómica): objetos de la vida real dibujados como
 * prueba (data-prueba; Gerson decide después cuáles reemplaza, docs/plan-calidad.md M4) junto a lo que esconden por
 * dentro. Por ahora, un objeto:
 *   - 'hueso': el hueso de la llama del museo (el mismo de la idea 6 de Materia y energía) sobre su repisa, con una lupa
 *     que baja a dos átomos de su carbono, dibujados por quim-atomo con la paleta 'zne' (núcleo contado y electrones).
 * Los que vienen en la fase 3 (el retablo con pan de oro, el salero de Maras, el frasco de sulfato ferroso) se agregan
 * aquí como otros valores de `objeto`.
 *
 * Afirmación de la figura: lo que se ve por fuera (un hueso) está hecho de átomos que se cuentan por dentro; dos átomos
 * del mismo carbono se comparan lado a lado.
 *
 * Partículas o variables, nunca los dos (docs/etapa2/decisiones.md): el objeto va en tinta (currentColor con tonos por
 * opacidad) y los átomos son dibujos de variables (Z naranja, N turquesa, electrones violeta, carga carmín); la paleta de
 * elementos (--el-*) no aparece.
 *
 * datos = {
 *   objeto: 'hueso',
 *   titulo: 'Hueso de llama del museo',      // arriba; por omisión, ese
 *   atomos: [ … ],                            // los de quim-atomo con paleta 'zne' (de 1 a 4 entradas en 2 ranuras)
 *   lugares: 2, flecha: true,                 // como en quim-atomo
 *   alt,
 * }
 * estado = { corte } (el de quim-atomo: los átomos con desde y hasta).
 * Función pura de (datos, estado): sin ids, sin azar, sin reloj. Alto fijo: 304 (banda de 84 + los 220 del átomo).
 * geometria(datos, estado) → { W, H, M, textos, objetos, segmentos }: las cajas con las mismas cuentas del dibujo, para
 * la prueba numérica de encuadre y rótulos (docs/molde-unidad.md §6).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const Kit = nodo ? require('../kit.js') : root.Kit;
  const T = nodo ? require('../trazo.js') : root.Kit.trazo;
  if (nodo) require('./quim-atomo.js');
  const api = fabrica(Kit, T);
  Kit.registrar(api);
  if (nodo) module.exports = api;
})(typeof self !== 'undefined' ? self : this, function (Kit, T) {
  'use strict';
  const W = 320, M = 4, BANDA = 84, n = T.n;
  const A = () => Kit.piezas['quim-atomo'];
  const H = () => BANDA + A().ALTO;
  const tinta = (g = 2) => `stroke="currentColor" stroke-width="${g}" stroke-linejoin="round" stroke-linecap="round"`;
  const TITULO = 'Hueso de llama del museo';

  // El hueso: una caña con dos nudos en cada punta (cóndilos), apoyada en la repisa. Repisa en y = 66.
  const REPISA = { x0: 40, x1: 280, y: 66 }, HUESO = { x0: 76, x1: 244, y: 50 }, LUPA = { x: 160, y: 50, r: 10 };
  function hueso() {
    const { x0, x1, y } = HUESO, m = (x0 + x1) / 2;
    const nudos = [[x0 + 9, y - 7], [x0 + 9, y + 7], [x1 - 9, y - 7], [x1 - 9, y + 7]];
    let s = `<line x1="${REPISA.x0}" y1="${REPISA.y}" x2="${REPISA.x1}" y2="${REPISA.y}" ${tinta(2)}/>`;
    s += `<rect x="${REPISA.x0}" y="${REPISA.y + 1}" width="${REPISA.x1 - REPISA.x0}" height="5" fill="currentColor" fill-opacity="0.08"/>`;
    s += `<g fill="currentColor" fill-opacity="0.16">${nudos.map(([x, yy]) => `<circle cx="${n(x)}" cy="${n(yy)}" r="9" ${tinta(2)}/>`).join('')}</g>`;
    // La caña, más angosta al medio; tapa la mitad de adentro de los nudos.
    s += `<path d="M${x0 + 13} ${y - 8}Q${m} ${y - 3} ${x1 - 13} ${y - 8}L${x1 - 13} ${y + 8}Q${m} ${y + 3} ${x0 + 13} ${y + 8}Z" fill="var(--card)" ${tinta(2)}/>`;
    s += `<path d="M${x0 + 14} ${y - 6}Q${m} ${y - 1.5} ${x1 - 14} ${y - 6}L${x1 - 14} ${y + 6}Q${m} ${y + 1.5} ${x0 + 14} ${y + 6}Z" fill="currentColor" fill-opacity="0.16"/>`;
    // Dos rayitas de desgaste: es un hueso viejo.
    s += `<path d="M${x0 + 34} ${y - 3}l8 3M${x1 - 46} ${y + 2}l7 -3" fill="none" ${tinta(1.2)} stroke-opacity="0.45"/>`;
    return s;
  }
  // Las dos líneas de la lupa: del círculo chico en el hueso a la zona de cada átomo (casi verticales, entre los títulos).
  function segmentos(d) {
    void d;
    const R = Math.min((W / 2) / 2 - 16, 80) + 2;   // el radio de la zona con dos ranuras (el de quim-atomo)
    const cy = BANDA + 112, ang = -20 * Math.PI / 180;
    return [
      { x0: LUPA.x - LUPA.r + 1, y0: LUPA.y + 4, x1: 80 + R * Math.cos(ang), y1: cy + R * Math.sin(ang) },
      { x0: LUPA.x + LUPA.r - 1, y0: LUPA.y + 4, x1: 240 - R * Math.cos(ang), y1: cy + R * Math.sin(ang) },
    ];
  }
  function datosAtomo(d) { return Object.assign({ paleta: 'zne', lugares: 2, raya: false }, d, { objeto: undefined }); }

  function dibujar(d, estado = {}) {
    const titulo = d.titulo === undefined ? TITULO : d.titulo;
    let s = '';
    if (titulo) s += T.rotulo(W / 2, 18, titulo, { ancla: 'middle', peso: 700, tam: 16, min: M, max: W - M });
    s += `<g class="kit-objeto" data-objeto="hueso" data-prueba="si">${hueso()}</g>`;
    s += `<g class="kit-lupa"><circle cx="${LUPA.x}" cy="${LUPA.y}" r="${LUPA.r}" fill="none" ${tinta(1.5)} stroke-dasharray="3 2"/>`;
    for (const sg of segmentos(d)) s += `<line x1="${n(sg.x0)}" y1="${n(sg.y0)}" x2="${n(sg.x1)}" y2="${n(sg.y1)}" ${tinta(1)} stroke-opacity="0.45"/>`;
    s += '</g>';
    s += `<g transform="translate(0 ${BANDA})">${A().cuerpoZNE(datosAtomo(d), estado)}</g>`;
    return T.svg(W, H(), s, { alt: alt(d) });
  }

  function geometria(d, estado = {}) {
    const titulo = d.titulo === undefined ? TITULO : d.titulo, textos = [], objetos = [];
    if (titulo) {
      const w = T.ancho(titulo, 16, 700);
      textos.push({ que: 'titulo', txt: titulo, x0: W / 2 - w / 2, x1: W / 2 + w / 2, y0: 18 - 0.78 * 16, y1: 18 + 0.22 * 16 });
    }
    objetos.push({ que: 'hueso', x0: HUESO.x0 - 1, x1: HUESO.x1 + 1, y0: HUESO.y - 17, y1: HUESO.y + 17 });
    objetos.push({ que: 'repisa', x0: REPISA.x0 - 1, x1: REPISA.x1 + 1, y0: REPISA.y - 1, y1: REPISA.y + 6 });
    const c = A().cajasZNE(datosAtomo(d), estado), mover = b => Object.assign({}, b, { y0: b.y0 + BANDA, y1: b.y1 + BANDA, cy: b.cy === undefined ? undefined : b.cy + BANDA });
    for (const t of c.textos) textos.push(mover(t));
    for (const o of c.objetos) objetos.push(mover(o));
    return { W, H: H(), M, textos, objetos, segmentos: segmentos(d) };
  }

  function alt(d) {
    if (d.alt) return d.alt;
    const t = A().alt(datosAtomo(d)).replace(/^Átomo con su núcleo contado y sus electrones alrededor \(modelo, no a escala\)\. /, '');
    return `Un hueso de llama sobre la repisa de un museo; una lupa baja a dos átomos de su carbono, con el núcleo contado y los electrones alrededor (modelo, no a escala). ${t}`;
  }

  return { id: 'quim-objeto', dibujar, alt, geometria, constantes: { W, M, BANDA } };
});
