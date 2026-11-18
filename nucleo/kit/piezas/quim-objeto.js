/*
 * Pieza «quim-objeto» (18 nov 2026, etapa 4 de química, Estructura atómica): objetos de la vida real dibujados como
 * prueba (data-prueba; Gerson decide después cuáles reemplaza, docs/plan-calidad.md M4) junto a lo que esconden por
 * dentro. Objetos:
 *   - 'hueso': el hueso de la llama del museo (el mismo de la idea 6 de Materia y energía) sobre su repisa, con una lupa
 *     que baja a dos átomos de su carbono, dibujados por quim-atomo con la paleta 'zne' (núcleo contado y electrones);
 *   - 'salero' (idea 5): un salero con sal de Maras, y debajo las cajas de un ion (quim-cajas, paleta 'zne');
 *   - 'frasco' (ideas 5 y 6): el frasco de gotas de sulfato ferroso (un suplemento de hierro), y debajo las cajas del ion;
 *   - 'combi' (idea 6): una combi vista desde arriba, con una fila de dos asientos por cada caja del subnivel que va
 *     debajo (alineadas con ellas): cada pasajero es una flecha de la caja de abajo (asiento de arriba ↑, de abajo ↓).
 *
 * Afirmación de la figura: lo que se ve por fuera (un hueso, un salero, un frasco) está hecho de átomos o iones que se
 * cuentan por dentro; en la combi, nadie comparte fila mientras haya una fila vacía.
 *
 * Partículas o variables, nunca los dos (docs/etapa2/decisiones.md): el objeto va en tinta (currentColor con tonos por
 * opacidad) y lo de dentro es un dibujo de variables (Z naranja, N turquesa, electrones violeta, carga carmín); la paleta
 * de elementos (--el-*) no aparece. Los pasajeros de la combi son electrones: violeta.
 *
 * datos = {
 *   objeto: 'hueso' | 'salero' | 'frasco' | 'combi',
 *   titulo,                                   // arriba; por omisión, el del objeto
 *   atomos: [ … ], lugares, flecha,           // solo 'hueso': los de quim-atomo con paleta 'zne'
 *   cajas: { filas, … },                      // 'salero', 'frasco' y 'combi': los datos de quim-cajas (paleta 'zne')
 *   asientos: 0,                              // 'combi': la fila de cajas que va en los asientos
 *   alt,
 * }
 * estado = { corte } (el de quim-atomo o el de quim-cajas). Función pura de (datos, estado): sin ids, sin azar, sin reloj.
 * Alto: 304 con el hueso (banda de 84 + los 220 del átomo); con los otros, 84 + el alto de las cajas.
 * geometria(datos, estado) → { W, H, M, textos, objetos, segmentos }: las cajas con las mismas cuentas del dibujo, para
 * la prueba numérica de encuadre y rótulos (docs/molde-unidad.md §6).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const Kit = nodo ? require('../kit.js') : root.Kit;
  const T = nodo ? require('../trazo.js') : root.Kit.trazo;
  if (nodo) { require('./quim-atomo.js'); require('./quim-cajas.js'); }
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

  function dibujarHueso(d, estado = {}) {
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

  function geometriaHueso(d, estado = {}) {
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

  function altHueso(d) {
    if (d.alt) return d.alt;
    const t = A().alt(datosAtomo(d)).replace(/^Átomo con su núcleo contado y sus electrones alrededor \(modelo, no a escala\)\. /, '');
    return `Un hueso de llama sobre la repisa de un museo; una lupa baja a dos átomos de su carbono, con el núcleo contado y los electrones alrededor (modelo, no a escala). ${t}`;
  }

  // ---------- Salero, frasco y combi: el objeto arriba y las cajas de quim-cajas debajo ----------
  const C = () => Kit.piezas['quim-cajas'];
  const TITULOS = { salero: 'Salero con sal de Maras', frasco: 'Gotas de sulfato ferroso', combi: 'Combi que se va llenando' };
  const datosCajas = d => Object.assign({ paleta: 'zne' }, d.cajas || { filas: [] });
  function salero() {
    let s = `<path d="M144 34H176L182 78Q182 80 180 80H140Q138 80 138 78Z" fill="currentColor" fill-opacity="0.06" ${tinta(2)}/>`;
    s += `<path d="M141 52H179L182 78Q182 80 180 80H140Q138 80 138 78Z" fill="currentColor" fill-opacity="0.16"/>`;
    s += `<path d="M142 34Q142 24 160 24Q178 24 178 34Z" fill="currentColor" fill-opacity="0.22" ${tinta(2)}/>`;
    for (const [x, y] of [[154, 30], [160, 28], [166, 30]]) s += `<circle cx="${x}" cy="${y}" r="1.4" fill="var(--card)"/>`;
    // Granitos de sal sobre la mesa, al costado.
    for (const [x, y] of [[196, 78], [204, 76], [212, 79], [119, 78], [111, 77]]) s += `<rect x="${x}" y="${y - 3}" width="4" height="4" fill="none" ${tinta(1.2)}/>`;
    s += `<line x1="70" y1="82" x2="250" y2="82" ${tinta(2)}/>`;
    return s;
  }
  function frasco() {
    let s = `<rect x="138" y="42" width="44" height="38" rx="6" fill="currentColor" fill-opacity="0.2" ${tinta(2)}/>`;
    s += `<rect x="150" y="34" width="20" height="8" fill="currentColor" fill-opacity="0.12" ${tinta(2)}/>`;
    s += `<path d="M154 34V30Q154 25 160 25Q166 25 166 30V34" fill="currentColor" fill-opacity="0.3" ${tinta(2)}/>`;
    s += `<rect x="144" y="51" width="32" height="18" rx="2" fill="var(--card)" ${tinta(1.2)}/>`;
    s += `<path d="M149 57H171M149 63H165" ${tinta(1.2)} stroke-opacity="0.6"/>`;
    // Una gota que cae del gotero, al costado.
    s += `<path d="M206 52Q200 62 206 64Q212 62 206 52Z" fill="currentColor" fill-opacity="0.2" ${tinta(1.5)}/>`;
    s += `<line x1="70" y1="82" x2="250" y2="82" ${tinta(2)}/>`;
    return s;
  }
  // La combi desde arriba: una fila de dos asientos alineada con cada caja de la fila `asientos`.
  function combi(d) {
    const cd = datosCajas(d), g = C().geometria(cd), i = d.asientos || 0, f = (cd.filas || [])[i] || { cajas: 3, e: 0 };
    const k = f.cajas || 3, fl = f.vacia ? Array.from({ length: k }, () => [0, 0]) : f.flechas || C().llenar(f.e || 0, k);
    const x0 = g.x0 - 22, x1 = g.x0 + k * g.lado + 64;
    let s = `<rect x="${n(x0)}" y="28" width="${n(x1 - x0)}" height="52" rx="12" fill="currentColor" fill-opacity="0.06" ${tinta(2)}/>`;
    s += `<path d="M${n(x1 - 12)} 31Q${n(x1 - 2)} 54 ${n(x1 - 12)} 77" fill="none" ${tinta(2)}/>`;
    s += `<circle cx="${n(x1 - 34)}" cy="64" r="8" fill="none" ${tinta(1.8)}/>`;
    for (let c = 0; c < k; c++) {
      const cx = g.x0 + c * g.lado + g.lado / 2;
      for (const [j, y] of [[0, 32], [1, 56]]) {
        s += `<rect x="${n(cx - 11)}" y="${y}" width="22" height="20" rx="5" fill="var(--card)" ${tinta(1.5)}/>`;
        if (fl[c][j]) s += `<circle class="kit-pasajero" cx="${n(cx)}" cy="${y + 10}" r="6" fill="var(--c-f)"/>`;
      }
    }
    return s;
  }
  const OBJ = { salero, frasco, combi };
  function dibujarCon(d, estado = {}) {
    const titulo = d.titulo === undefined ? TITULOS[d.objeto] : d.titulo, cd = datosCajas(d);
    let s = '';
    if (titulo) s += T.rotulo(W / 2, 18, titulo, { ancla: 'middle', peso: 700, tam: 16, min: M, max: W - M });
    s += `<g class="kit-objeto" data-objeto="${d.objeto}" data-prueba="si">${OBJ[d.objeto](d)}</g>`;
    s += `<g transform="translate(0 ${BANDA})">${C().cuerpo(cd, estado)}</g>`;
    return T.svg(W, BANDA + C().alto(cd), s, { alt: alt(d) });
  }
  function geometriaCon(d, estado = {}) {
    const titulo = d.titulo === undefined ? TITULOS[d.objeto] : d.titulo, textos = [], objetos = [], cd = datosCajas(d);
    if (titulo) { const w = T.ancho(titulo, 16, 700); textos.push({ que: 'titulo', txt: titulo, x0: W / 2 - w / 2, x1: W / 2 + w / 2, y0: 18 - 0.78 * 16, y1: 18 + 0.22 * 16 }); }
    if (d.objeto === 'combi') { const g = C().geometria(cd), k = ((cd.filas || [])[d.asientos || 0] || {}).cajas || 3; objetos.push({ que: 'combi', x0: g.x0 - 23, x1: g.x0 + k * g.lado + 65, y0: 27, y1: 81 }); }
    else objetos.push({ que: d.objeto, x0: 69, x1: 251, y0: 23, y1: 83 });
    const c = C().marcos(cd, estado), mover = b => Object.assign({}, b, { y0: b.y0 + BANDA, y1: b.y1 + BANDA });
    for (const t of c.textos) textos.push(mover(t));
    for (const o of c.objetos) objetos.push(mover(o));
    return { W, H: BANDA + C().alto(cd), M, textos, objetos, segmentos: [] };
  }
  function altCon(d) {
    if (d.alt) return d.alt;
    const QUE = { salero: 'Un salero con sal de Maras sobre la mesa', frasco: 'Un frasco gotero de sulfato ferroso, un suplemento de hierro',
      combi: 'Una combi vista desde arriba, con una fila de dos asientos por cada caja de abajo; los pasajeros son electrones' };
    return `${QUE[d.objeto]}. Debajo, ${C().alt(datosCajas(d)).replace(/^Diagrama/, 'el diagrama')}`;
  }

  const dibujar = (d, estado) => (d && OBJ[d.objeto] ? dibujarCon(d, estado) : dibujarHueso(d, estado));
  const geometria = (d, estado) => (d && OBJ[d.objeto] ? geometriaCon(d, estado) : geometriaHueso(d, estado));
  const alt = d => (d && OBJ[d.objeto] ? altCon(d) : altHueso(d));

  return { id: 'quim-objeto', dibujar, alt, geometria, constantes: { W, M, BANDA } };
});
