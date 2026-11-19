/*
 * Pieza «quim-nomenclatura» (19 nov 2026, etapa 7 de química, «Nomenclatura inorgánica»): los objetos de todos los días
 * de la primera pantalla de cada idea y la tarjeta de nombres (una fórmula y sus nombres en cada sistema). Los objetos son
 * dibujo de prueba (data-prueba; Gerson decide después si los reemplaza, docs/plan-calidad.md M4).
 *
 * Afirmación de la figura: una sustancia tiene una sola fórmula y varios nombres; cada nombre dice algo de la fórmula
 * (cuántos átomos, qué estado de oxidación), y lo que se pide va con «?».
 *
 * Dos vistas:
 *   objeto:  `objeto`: 'permanganato' (frasco de la farmacia con cristales), 'clavo' (clavo con herrumbre),
 *            'agua-oxigenada' (frasco de plástico con tapa), 'magnesia' (frasco de leche de magnesia), 'salero' (salero y
 *            saco de abono), 'bicarbonato' (caja de bicarbonato con su cuchara); `etiqueta`: texto corto en la etiqueta
 *            del objeto (una fórmula), `nombre` debajo y `titulo` arriba (opcionales).
 *   nombres: `formula`: lista de partes { t, color } (color 'o' | 'i' | 'f' | 'h' o nada: tinta), o un texto; `oculta`:
 *            true pone «?» en vez de la fórmula; `titulo` (la clase: «Óxido básico»); `filas`: [{ sistema, nombre: partes
 *            o texto, oculto, desde }] (de 1 a 4). Una fila `oculto` lleva «?» en vez del nombre. Una fila con `desde: k`
 *            se dibuja recién con estado.corte ≥ k (el alto no cambia entre pasos).
 * Colores del mapa de la unidad (docs/etapa7/propuesta-quimica.md §8): catión o metal naranja c-o, anión o no metal
 * turquesa c-i, estado de oxidación y su romano violeta c-f, carga carmín c-h; los objetos en tinta; sin verde.
 * Los símbolos de los átomos van en la letra con serifa de las ecuaciones (etapa 6: en la sin serifa «Cl» se leía «CI»).
 *
 * datos = { vista: 'objeto' | 'nombres', … , alt }. estado = { corte }. Función pura: sin ids, sin azar, sin reloj.
 * Ancho 320; alto 176 en la vista objeto y 70 + 46 por fila en la de nombres (más 24 con título).
 * geometria(datos) → { W, H, M, textos, objetos }: las cajas con las mismas cuentas del dibujo, para la prueba numérica de
 * encuadre y rótulos (docs/molde-unidad.md §6).
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
  const W = 320, M = 4, n = T.n, ALTO_OBJ = 176;
  const tinta = (g = 2) => `stroke="currentColor" stroke-width="${g}" stroke-linejoin="round" stroke-linecap="round"`;
  const caja = (que, x0, y0, x1, y1) => ({ que, x0, y0, x1, y1 });
  const cajaTexto = (txt, x, base, tam, peso, ancla = 'middle') => {
    const w = T.ancho(txt, tam, peso), x0 = ancla === 'middle' ? x - w / 2 : ancla === 'end' ? x - w : x;
    return { que: 'texto', txt, x0, x1: x0 + w, y0: base - 0.78 * tam, y1: base + 0.22 * tam };
  };
  const plano = p => (Array.isArray(p) ? p.map(x => (typeof x === 'string' ? x : x.t)).join('') : String(p || ''));

  // ---------- Vista «objeto» ----------
  // Cada objeto se dibuja en la banda y = 26 a 148; la etiqueta (si hay) va en el rectángulo ETQ de cada uno.
  const ETQ = {
    permanganato: [128, 92, 192, 118], 'agua-oxigenada': [130, 84, 190, 112], magnesia: [118, 80, 202, 110],
    salero: [196, 96, 268, 120], bicarbonato: [104, 78, 196, 104], clavo: null,
  };
  function permanganato() {
    let s = `<path d="M126 62Q126 54 136 52V40H184V52Q194 54 194 62V144H126Z" fill="currentColor" fill-opacity="0.06" ${tinta(2)}/>`;
    s += `<rect x="132" y="30" width="56" height="12" rx="3" fill="currentColor" fill-opacity="0.3" ${tinta(1.5)}/>`;
    // Cristales oscuros en el fondo del frasco.
    for (const [x, y] of [[136, 132], [146, 128], [158, 133], [170, 127], [180, 132], [152, 138], [166, 139], [140, 139], [178, 139]])
      s += `<path d="M${x} ${y}l4 -4l4 4l-4 4z" fill="currentColor" fill-opacity="0.7"/>`;
    s += `<line x1="70" y1="145" x2="250" y2="145" ${tinta(2)}/>`;
    return s;
  }
  function clavo() {
    // Un clavo inclinado sobre la mesa, con manchas de herrumbre (polvo rojizo) en la punta y la caña.
    let s = `<path d="M70 70L82 58L92 68L80 80Z" fill="currentColor" fill-opacity="0.25" ${tinta(2)}/>`;
    s += `<path d="M84 72L232 122L240 128L228 126L80 76Z" fill="currentColor" fill-opacity="0.12" ${tinta(2)}/>`;
    for (const [x, y, r] of [[150, 96, 6], [176, 104, 8], [204, 114, 6], [222, 121, 4], [120, 86, 4], [190, 113, 3], [212, 112, 3]])
      s += `<circle class="kit-herrumbre" cx="${x}" cy="${y}" r="${r}" fill="currentColor" fill-opacity="0.55"/>`;
    for (const [x, y] of [[170, 132], [186, 136], [204, 133], [160, 138]]) s += `<circle cx="${x}" cy="${y}" r="2" fill="currentColor" fill-opacity="0.55"/>`;
    s += `<line x1="56" y1="145" x2="264" y2="145" ${tinta(2)}/>`;
    return s;
  }
  function aguaOxigenada() {
    let s = `<path d="M134 56Q130 60 130 70V144H190V70Q190 60 186 56Z" fill="currentColor" fill-opacity="0.05" ${tinta(2)}/>`;
    s += `<path d="M146 56V44H174V56" fill="none" ${tinta(2)}/>`;
    s += `<path d="M150 44V30H170V44" fill="currentColor" fill-opacity="0.3" ${tinta(1.5)}/>`;
    s += `<line x1="70" y1="145" x2="250" y2="145" ${tinta(2)}/>`;
    return s;
  }
  function magnesia() {
    let s = `<path d="M120 60Q114 64 114 74V144H206V74Q206 64 200 60Z" fill="currentColor" fill-opacity="0.18" ${tinta(2)}/>`;
    s += `<path d="M140 60V46H180V60" fill="none" ${tinta(2)}/>`;
    s += `<rect x="136" y="32" width="48" height="14" rx="3" fill="currentColor" fill-opacity="0.3" ${tinta(1.5)}/>`;
    s += `<line x1="70" y1="145" x2="250" y2="145" ${tinta(2)}/>`;
    return s;
  }
  function salero() {
    // A la izquierda el salero con sus agujeros; a la derecha un saco de abono atado.
    let s = `<path d="M70 80Q70 70 80 68H112Q122 70 122 80L118 144H74Z" fill="currentColor" fill-opacity="0.05" ${tinta(2)}/>`;
    s += `<path d="M74 68Q96 50 118 68" fill="currentColor" fill-opacity="0.25" ${tinta(2)}/>`;
    for (const [x, y] of [[90, 61], [96, 58], [102, 61]]) s += `<circle cx="${x}" cy="${y}" r="1.8" fill="var(--card)"/>`;
    for (const [x, y] of [[84, 132], [94, 128], [104, 133], [90, 138], [100, 139], [110, 138]]) s += `<rect x="${x}" y="${y}" width="4" height="4" fill="none" ${tinta(1.2)}/>`;
    s += `<path d="M190 70Q186 60 200 58L264 58Q276 60 272 70L278 144H184Z" fill="currentColor" fill-opacity="0.12" ${tinta(2)}/>`;
    s += `<path d="M196 58Q232 48 268 58" fill="none" ${tinta(2)}/><path d="M224 50L232 42L240 50" fill="none" ${tinta(2)}/>`;
    s += `<line x1="50" y1="145" x2="290" y2="145" ${tinta(2)}/>`;
    return s;
  }
  function bicarbonato() {
    let s = `<path d="M96 56H204V144H96Z" fill="currentColor" fill-opacity="0.08" ${tinta(2)}/>`;
    s += `<path d="M96 56L112 40H220L204 56M220 40V128L204 144" fill="none" ${tinta(2)}/>`;
    // La cuchara con polvo blanco.
    s += `<path d="M222 132Q240 120 258 128Q266 138 250 142Q232 146 222 138Z" fill="var(--card)" ${tinta(1.6)}/><path d="M258 128L292 106" ${tinta(4)} stroke-opacity="0.5"/>`;
    s += `<line x1="70" y1="145" x2="296" y2="145" ${tinta(2)}/>`;
    return s;
  }
  const OBJETOS = { permanganato, clavo, 'agua-oxigenada': aguaOxigenada, magnesia, salero, bicarbonato };
  const CAJA_OBJ = {
    permanganato: [68, 28, 252, 147], clavo: [54, 56, 266, 147], 'agua-oxigenada': [68, 28, 252, 147], magnesia: [68, 30, 252, 147],
    salero: [48, 40, 292, 147], bicarbonato: [68, 38, 298, 147],
  };
  function etiquetaDe(d) {
    const r = ETQ[d.objeto];
    if (!r || !d.etiqueta) return null;
    const [x0, y0, x1, y1] = r, cx = (x0 + x1) / 2, tam = Math.min(16, Math.max(14, 16)), base = (y0 + y1) / 2 + 5.5;
    return { x0, y0, x1, y1, cx, base, tam };
  }
  function dibujarObjeto(d) {
    let s = '';
    if (d.titulo) s += T.rotulo(W / 2, 18, d.titulo, { ancla: 'middle', peso: 700, tam: 16, min: M, max: W - M });
    s += `<g class="kit-objeto" data-objeto="${T.esc(d.objeto)}" data-prueba="si">${OBJETOS[d.objeto](d)}`;
    const e = etiquetaDe(d);
    if (e) {
      s += `<rect class="kit-etiqueta" x="${e.x0}" y="${e.y0}" width="${e.x1 - e.x0}" height="${e.y1 - e.y0}" rx="3" fill="var(--card)" ${tinta(1.4)}/>`;
      s += T.rotulo(e.cx, e.base, d.etiqueta, { ancla: 'middle', peso: 700, tam: e.tam, familia: T.SERIF });
    }
    s += '</g>';
    if (d.nombre) s += T.rotulo(W / 2, ALTO_OBJ - 8, d.nombre, { ancla: 'middle', tam: 15, peso: 600, min: M, max: W - M });
    return T.svg(W, ALTO_OBJ, s, { alt: alt(d) });
  }
  function geometriaObjeto(d) {
    const textos = [], [x0, y0, x1, y1] = CAJA_OBJ[d.objeto], e = etiquetaDe(d);
    if (d.titulo) textos.push(cajaTexto(d.titulo, W / 2, 18, 16, 700));
    if (d.nombre) textos.push(cajaTexto(d.nombre, W / 2, ALTO_OBJ - 8, 15, 600));
    const dentro = [];
    if (e) dentro.push(Object.assign(cajaTexto(d.etiqueta, e.cx, e.base, e.tam, 700), { marco: [e.x0, e.y0, e.x1, e.y1] }));
    return { W, H: ALTO_OBJ, M, textos, objetos: [caja(d.objeto, x0, y0, x1, y1)], dentro };
  }

  // ---------- Vista «nombres» ----------
  const TAM_F = 30, ALTO_FILA = 46, TAM_N = 16, TAM_S = 13;
  const altoNombres = d => (d.titulo ? 24 : 0) + 70 + ALTO_FILA * (d.filas || []).length;
  const partes = p => (Array.isArray(p) ? p.map(x => (typeof x === 'string' ? { t: x } : x)) : [{ t: String(p) }]);
  // Escribe una lista de partes centrada en cx; cada parte con su color. Devuelve el SVG y el ancho.
  // Un solo <text> centrado con un <tspan> por parte: el navegador pone cada parte justo después de la otra (antes, con
  // un <text> por parte y anchos estimados, el romano se montaba sobre la última letra: «plomc(IV)»).
  function linea(ps, cx, base, tam, peso, familia) {
    const tot = T.ancho(ps.map(p => p.t).join(''), tam, peso);
    const spans = ps.map(p => `<tspan fill="${T.color(p.color)}">${T.esc(p.t)}</tspan>`).join('');
    const s = `<text class="kit-txt" x="${n(cx)}" y="${n(base)}" fill="${T.color()}" font-size="${tam}" font-weight="${peso}" text-anchor="middle" style="${familia ? `font-family:${T.esc(familia)};` : ''}font-variant-numeric:tabular-nums">${spans}</text>`;
    return { s, w: tot };
  }
  // El tamaño de un nombre baja hasta 14 si no cabe en 304.
  const tamNombre = ps => { let t = TAM_N; while (t > 14 && T.ancho(plano(ps), t, 600) > W - 2 * M - 12) t -= 1; return t; };
  function dibujarNombres(d, estado = {}) {
    const corte = estado.corte || 0, y0 = d.titulo ? 24 : 0, H = altoNombres(d);
    let s = '';
    if (d.titulo) s += T.rotulo(W / 2, 18, d.titulo, { ancla: 'middle', peso: 700, tam: 16, min: M, max: W - M });
    // La fórmula, grande y en la serif de las ecuaciones, en su marco.
    s += `<rect x="${M + 2}" y="${y0 + 6}" width="${W - 2 * M - 4}" height="54" rx="10" fill="currentColor" fill-opacity="0.05" ${tinta(1.4)}/>`;
    const f = d.oculta ? [{ t: '?' }] : partes(d.formula);
    s += `<g class="kit-formula">${linea(f, W / 2, y0 + 44, TAM_F, 700, T.SERIF).s}</g>`;
    (d.filas || []).forEach((fila, k) => {
      if (fila.desde && corte < fila.desde) return;
      const base = y0 + 70 + ALTO_FILA * k;
      s += T.rotulo(M + 8, base + 10, fila.sistema, { tam: 14, peso: 700, clase: 'kit-sistema', min: M, max: W - M });
      const ps = fila.oculto ? [{ t: '?' }] : partes(fila.nombre), tam = tamNombre(ps);
      s += `<g class="kit-nombre">${linea(ps, W / 2, base + 32, tam, 600).s}</g>`;
    });
    return T.svg(W, H, s, { alt: alt(d) });
  }
  function geometriaNombres(d) {
    const y0 = d.titulo ? 24 : 0, textos = [];
    if (d.titulo) textos.push(cajaTexto(d.titulo, W / 2, 18, 16, 700));
    const f = d.oculta ? '?' : plano(d.formula);
    textos.push(cajaTexto(f, W / 2, y0 + 44, TAM_F, 700));
    (d.filas || []).forEach((fila, k) => {
      const base = y0 + 70 + ALTO_FILA * k, ps = fila.oculto ? [{ t: '?' }] : partes(fila.nombre);
      textos.push(cajaTexto(fila.sistema, M + 8, base + 10, 14, 700, 'start'));
      textos.push(cajaTexto(plano(ps), W / 2, base + 32, tamNombre(ps), 600));
    });
    return { W, H: altoNombres(d), M, textos, objetos: [], dentro: [] };
  }

  const NOMBRE_OBJ = {
    permanganato: 'Un frasco de permanganato de la farmacia, con cristales oscuros', clavo: 'Un clavo con herrumbre (polvo rojizo)',
    'agua-oxigenada': 'Un frasco de agua oxigenada', magnesia: 'Un frasco de leche de magnesia', salero: 'Un salero y un saco de abono',
    bicarbonato: 'Una caja de bicarbonato y una cuchara con polvo blanco',
  };
  function alt(d) {
    if (d.alt) return d.alt;
    if (d.vista === 'nombres') {
      const f = d.oculta ? '? (lo que se pide)' : plano(d.formula);
      return `${d.titulo ? `${d.titulo}: ` : ''}la fórmula ${f}${(d.filas || []).map(x => `; ${x.sistema}: ${x.oculto ? '?' : plano(x.nombre)}`).join('')}.`;
    }
    return `${NOMBRE_OBJ[d.objeto]}${d.etiqueta ? `, con la etiqueta ${d.etiqueta}` : ''}${d.nombre ? ` (${d.nombre})` : ''}. Dibujo de prueba.`;
  }
  const dibujar = (d, estado) => (d.vista === 'nombres' ? dibujarNombres(d, estado) : dibujarObjeto(d));
  const geometria = d => (d.vista === 'nombres' ? geometriaNombres(d) : geometriaObjeto(d));
  return { id: 'quim-nomenclatura', dibujar, alt, geometria, constantes: { W, M, ALTO_OBJ, ALTO_FILA }, OBJETOS: Object.keys(OBJETOS) };
});
