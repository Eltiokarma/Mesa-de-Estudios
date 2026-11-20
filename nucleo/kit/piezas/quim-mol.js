/*
 * Pieza «quim-mol» (19 nov 2026, etapa 8 de química, «Mol, masa molar y composición»): los objetos de todos los días de
 * la primera pantalla de cada idea y la tarjeta de conteo (una fórmula y, por cada elemento, sus átomos por unidad y lo
 * que se pide). Los objetos son dibujo de prueba (data-prueba; Gerson decide después si los reemplaza,
 * docs/plan-calidad.md M4).
 *
 * Afirmación de la figura: lo que se ve por fuera (un cuadro de la tabla, un vaso en la balanza, una tiza, un paquete de
 * sal, una botella, un frasco cerrado) está hecho de átomos que se cuentan pesando; en la tarjeta, los átomos de cada
 * elemento son los de una unidad por las unidades que hay, y lo que se pide va con «?».
 *
 * Dos vistas:
 *   objeto: `objeto`: 'tabla' (el cuadro de un elemento en la tabla de la pared, con su número atómico, su símbolo y su
 *           masa: `celda: { z, simbolo, masa }`), 'balanza' (balanza de cocina con un vaso de agua), 'tiza' (una caja
 *           de tizas), 'sal' (paquete de sal con su tabla de nutrición), 'vinagre' (botella de vinagre), 'frasco'
 *           (frasco cerrado sobre una balanza); `etiqueta`: texto corto en la etiqueta o en la pantalla de la balanza;
 *           `nombre` debajo y `titulo` arriba (opcionales).
 *   cuenta: `formula`: lista de partes { t, color } o un texto (va en la serif, con su marco); `titulo` (opcional);
 *           `cabeza`: [col. 2, col. 3] (por omisión «por unidad» y «en total»); `filas`: [{ el, por, total, color,
 *           oculto, desde }] (de 1 a 5). `el` va en la serif; una fila `oculto` lleva «?» en el total; con `desde: k`
 *           el total se dibuja recién con estado.corte ≥ k (el alto no cambia entre pasos).
 * Colores del mapa de la unidad (docs/etapa8/propuesta-quimica.md §8): m naranja c-o, M y masa atómica turquesa c-i,
 * n violeta c-f, N y porcentajes carmín c-h; los objetos y los símbolos en tinta; sin verde.
 * Los símbolos de los átomos van en la letra con serifa de las ecuaciones (en la sin serifa «Cl» se lee «CI»).
 *
 * datos = { vista: 'objeto' | 'cuenta', … , alt }. estado = { corte }. Función pura: sin ids, sin azar, sin reloj.
 * Ancho 320; alto 176 en la vista objeto y 96 + 34 por fila en la de conteo (más 24 con título).
 * geometria(datos) → { W, H, M, textos, objetos, dentro }: las cajas con las mismas cuentas del dibujo, para la prueba
 * numérica de encuadre y rótulos (docs/molde-unidad.md §6).
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
  const plano = p => (Array.isArray(p) ? p.map(x => (typeof x === 'string' ? x : x.t)).join('') : String(p == null ? '' : p));
  // Una parte es un texto, { t, color } o una ficha de ecuación { v: 'c-f', t } (el color sale de su token).
  const partes = p => (Array.isArray(p) ? p.map(x => (typeof x === 'string' ? { t: x } : { t: x.t, color: x.color || (x.v ? String(x.v).replace(/^c-/, '') : undefined) })) : [{ t: String(p) }]);
  // Un solo <text> centrado con un <tspan> por parte: el navegador pone cada parte justo después de la otra.
  function linea(ps, cx, base, tam, peso, familia) {
    const spans = ps.map(p => `<tspan fill="${T.color(p.color)}">${T.esc(p.t)}</tspan>`).join('');
    return `<text class="kit-txt" x="${n(cx)}" y="${n(base)}" fill="${T.color()}" font-size="${tam}" font-weight="${peso}" text-anchor="middle" style="${familia ? `font-family:${T.esc(familia)};` : ''}font-variant-numeric:tabular-nums">${spans}</text>`;
  }

  // ---------- Vista «objeto» ----------
  // Cada objeto se dibuja en la banda y = 24 a 148; la etiqueta (si hay) va en el rectángulo ETQ de cada uno.
  const ETQ = { tabla: null, balanza: [130, 125, 190, 143], tiza: [86, 108, 174, 132], sal: [110, 62, 210, 88], vinagre: [124, 90, 196, 116], frasco: [128, 127, 192, 146] };
  // El cuadro de la tabla: una rejilla de casillas chicas y, al medio, la del elemento en grande.
  const CELDA = { x0: 118, y0: 34, x1: 202, y1: 142 };
  function tabla(d) {
    let s = `<rect x="40" y="26" width="240" height="122" rx="4" fill="currentColor" fill-opacity="0.04" ${tinta(1.5)}/>`;
    for (let i = 0; i < 9; i++) for (let j = 0; j < 4; j++) {
      const x = 48 + i * 26, y = 34 + j * 27;
      if (x + 22 > CELDA.x0 - 4 && x < CELDA.x1 + 4) continue;
      s += `<rect x="${x}" y="${y}" width="22" height="23" rx="2" fill="currentColor" fill-opacity="0.08" ${tinta(1)} stroke-opacity="0.5"/>`;
    }
    const c = d.celda || {};
    s += `<rect class="kit-celda" x="${CELDA.x0}" y="${CELDA.y0}" width="${CELDA.x1 - CELDA.x0}" height="${CELDA.y1 - CELDA.y0}" rx="4" fill="var(--card)" ${tinta(2.5)}/>`;
    if (c.z) s += T.rotulo(CELDA.x0 + 8, CELDA.y0 + 20, c.z, { tam: 15, peso: 600 });
    if (c.simbolo) s += `<text class="kit-txt kit-simbolo" x="${(CELDA.x0 + CELDA.x1) / 2}" y="${CELDA.y0 + 70}" fill="currentColor" font-size="36" font-weight="700" text-anchor="middle" style="font-family:${T.esc(T.SERIF)}">${T.esc(c.simbolo)}</text>`;
    if (c.masa) s += T.rotulo((CELDA.x0 + CELDA.x1) / 2, CELDA.y1 - 12, c.masa, { ancla: 'middle', tam: 16, peso: 600, clase: 'kit-num', color: c.color });
    return s;
  }
  function textosTabla(d) {
    const c = d.celda || {}, out = [];
    if (c.z) out.push(cajaTexto(c.z, CELDA.x0 + 8, CELDA.y0 + 20, 15, 600, 'start'));
    if (c.simbolo) out.push(cajaTexto(c.simbolo, (CELDA.x0 + CELDA.x1) / 2, CELDA.y0 + 70, 36, 700));
    if (c.masa) out.push(cajaTexto(c.masa, (CELDA.x0 + CELDA.x1) / 2, CELDA.y1 - 12, 16, 600));
    return out.map(t => Object.assign(t, { marco: [CELDA.x0, CELDA.y0, CELDA.x1, CELDA.y1] }));
  }
  function balanza() {
    // La balanza de cocina: base con su pantalla y un plato; encima, un vaso con agua hasta un poco más de la mitad.
    let s = `<path d="M92 118H228L238 146H82Z" fill="currentColor" fill-opacity="0.12" ${tinta(2)}/>`;
    s += `<path d="M96 116H224" ${tinta(3)}/>`;
    s += `<path d="M138 56L144 114H176L182 56Z" fill="none" ${tinta(2)}/>`;
    s += `<path d="M140.6 78L144 114H176L179.4 78Z" fill="currentColor" fill-opacity="0.22"/>`;
    s += `<line x1="60" y1="147" x2="260" y2="147" ${tinta(2)}/>`;
    return s;
  }
  function tiza() {
    // Una caja abierta de tizas y dos tizas sueltas al lado.
    let s = `<path d="M70 96H190V146H70Z" fill="currentColor" fill-opacity="0.08" ${tinta(2)}/>`;
    for (const x of [80, 96, 112, 128, 144, 160, 176]) s += `<rect x="${x - 5}" y="74" width="10" height="24" rx="4" fill="var(--card)" ${tinta(1.6)}/>`;
    s += `<rect x="202" y="128" width="84" height="12" rx="6" fill="var(--card)" ${tinta(1.6)}/><rect x="208" y="112" width="70" height="12" rx="6" fill="var(--card)" ${tinta(1.6)}/>`;
    s += `<line x1="56" y1="147" x2="296" y2="147" ${tinta(2)}/>`;
    return s;
  }
  function sal() {
    // Un paquete de sal con su etiqueta y, abajo, la tabla de nutrición con la fila del sodio.
    let s = `<path d="M100 40L106 30H214L220 40V146H100Z" fill="currentColor" fill-opacity="0.06" ${tinta(2)}/>`;
    s += `<path d="M106 30L112 38L118 30L124 38L130 30L136 38L142 30L148 38L154 30L160 38L166 30L172 38L178 30L184 38L190 30L196 38L202 30L208 38L214 30" fill="none" ${tinta(1.2)} stroke-opacity="0.6"/>`;
    s += `<rect x="122" y="96" width="76" height="42" rx="3" fill="var(--card)" ${tinta(1.4)}/>`;
    s += `<line x1="126" y1="122" x2="194" y2="122" ${tinta(1)} stroke-opacity="0.6"/>`;
    s += T.rotulo(128, 115, 'Sodio', { tam: 14, peso: 600 });
    s += `<line x1="70" y1="147" x2="250" y2="147" ${tinta(2)}/>`;
    return s;
  }
  function vinagre() {
    let s = `<path d="M128 72Q128 64 140 60H180Q192 64 192 72V146H128Z" fill="currentColor" fill-opacity="0.07" ${tinta(2)}/>`;
    s += `<path d="M148 60V40H172V60" fill="none" ${tinta(2)}/>`;
    s += `<rect x="146" y="28" width="28" height="12" rx="3" fill="currentColor" fill-opacity="0.3" ${tinta(1.5)}/>`;
    s += `<path d="M129 124H191V146H129Z" fill="currentColor" fill-opacity="0.12"/>`;
    s += `<line x1="70" y1="147" x2="250" y2="147" ${tinta(2)}/>`;
    return s;
  }
  function frasco() {
    // Un frasco cerrado con un poco de carbón en el fondo, sobre una balanza con su pantalla.
    let s = `<path d="M84 124H236L244 147H76Z" fill="currentColor" fill-opacity="0.12" ${tinta(2)}/>`;
    s += `<path d="M120 54Q116 58 116 66V122H204V66Q204 58 200 54Z" fill="currentColor" fill-opacity="0.04" ${tinta(2)}/>`;
    s += `<rect x="114" y="40" width="92" height="14" rx="3" fill="currentColor" fill-opacity="0.3" ${tinta(1.6)}/>`;
    for (const [x, y] of [[140, 116], [152, 114], [164, 117], [176, 115], [158, 108], [170, 109]]) s += `<circle cx="${x}" cy="${y}" r="5" fill="currentColor" fill-opacity="0.7"/>`;
    s += `<line x1="56" y1="148" x2="264" y2="148" ${tinta(2)}/>`;
    return s;
  }
  const OBJETOS = { tabla, balanza, tiza, sal, vinagre, frasco };
  const CAJA_OBJ = { tabla: [40, 26, 280, 148], balanza: [60, 55, 260, 148], tiza: [56, 73, 296, 148], sal: [70, 29, 250, 148], vinagre: [70, 27, 250, 148], frasco: [56, 39, 264, 149] };
  function etiquetaDe(d) {
    const r = ETQ[d.objeto];
    if (!r || !d.etiqueta) return null;
    const [x0, y0, x1, y1] = r, tam = (y1 - y0) < 20 ? 14 : 16;
    return { x0, y0, x1, y1, cx: (x0 + x1) / 2, base: (y0 + y1) / 2 + tam * 0.34, tam };
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
    const dentro = d.objeto === 'tabla' ? textosTabla(d) : [];
    if (e) dentro.push(Object.assign(cajaTexto(d.etiqueta, e.cx, e.base, e.tam, 700), { marco: [e.x0, e.y0, e.x1, e.y1] }));
    if (d.objeto === 'sal') dentro.push(Object.assign(cajaTexto('Sodio', 128, 115, 14, 600, 'start'), { marco: [122, 96, 198, 138] }));
    return { W, H: ALTO_OBJ, M, textos, objetos: [caja(d.objeto, x0, y0, x1, y1)], dentro };
  }

  // ---------- Vista «cuenta» ----------
  const TAM_F = 28, FILA = 34, X_EL = 52, X_POR = 160, X_TOT = 262;
  const altoCuenta = d => (d.titulo ? 24 : 0) + 96 + FILA * (d.filas || []).length;
  const cabeza = d => (d.cabeza || ['por unidad', 'en total']);
  function dibujarCuenta(d, estado = {}) {
    const corte = estado.corte || 0, y0 = d.titulo ? 24 : 0, H = altoCuenta(d), [c2, c3] = cabeza(d);
    let s = '';
    if (d.titulo) s += T.rotulo(W / 2, 18, d.titulo, { ancla: 'middle', peso: 700, tam: 16, min: M, max: W - M });
    s += `<rect x="${M + 2}" y="${y0 + 6}" width="${W - 2 * M - 4}" height="50" rx="10" fill="currentColor" fill-opacity="0.05" ${tinta(1.4)}/>`;
    s += `<g class="kit-formula">${linea(partes(d.formula), W / 2, y0 + 41, TAM_F, 700, T.SERIF)}</g>`;
    const yc = y0 + 82;
    s += T.rotulo(X_EL, yc, 'átomo', { ancla: 'middle', tam: 14, peso: 700, clase: 'kit-cabeza' });
    s += T.rotulo(X_POR, yc, c2, { ancla: 'middle', tam: 14, peso: 700, clase: 'kit-cabeza' });
    s += T.rotulo(X_TOT, yc, c3, { ancla: 'middle', tam: 14, peso: 700, clase: 'kit-cabeza', max: W - M });
    s += `<line x1="${M + 8}" y1="${yc + 7}" x2="${W - M - 8}" y2="${yc + 7}" ${tinta(1)} stroke-opacity="0.6"/>`;
    (d.filas || []).forEach((f, k) => {
      const base = yc + 8 + FILA * (k + 1) - 10;
      s += `<g class="kit-fila">${linea([{ t: f.el }], X_EL, base, 20, 700, T.SERIF)}${linea(partes(f.por), X_POR, base, 18, 600)}`;
      if (!(f.desde && corte < f.desde)) s += linea(f.oculto ? [{ t: '?' }] : partes(f.total).map(p => Object.assign({}, p, { color: p.color || f.color })), X_TOT, base, 18, 700);
      s += '</g>';
    });
    return T.svg(W, H, s, { alt: alt(d) });
  }
  function geometriaCuenta(d) {
    const y0 = d.titulo ? 24 : 0, yc = y0 + 82, [c2, c3] = cabeza(d), textos = [];
    if (d.titulo) textos.push(cajaTexto(d.titulo, W / 2, 18, 16, 700));
    textos.push(cajaTexto(plano(d.formula), W / 2, y0 + 41, TAM_F, 700));
    textos.push(cajaTexto('átomo', X_EL, yc, 14, 700), cajaTexto(c2, X_POR, yc, 14, 700), cajaTexto(c3, X_TOT, yc, 14, 700));
    (d.filas || []).forEach((f, k) => {
      const base = yc + 8 + FILA * (k + 1) - 10;
      textos.push(cajaTexto(f.el, X_EL, base, 20, 700), cajaTexto(plano(f.por), X_POR, base, 18, 600), cajaTexto(f.oculto ? '?' : plano(f.total), X_TOT, base, 18, 700));
    });
    return { W, H: altoCuenta(d), M, textos, objetos: [], dentro: [] };
  }

  const NOMBRE_OBJ = {
    tabla: 'El cuadro de un elemento en la tabla periódica de la pared', balanza: 'Una balanza de cocina con un vaso de agua',
    tiza: 'Una caja de tizas y dos tizas sueltas', sal: 'Un paquete de sal con su tabla de nutrición', vinagre: 'Una botella de vinagre',
    frasco: 'Un frasco cerrado con un poco de carbón, sobre una balanza',
  };
  function alt(d) {
    if (d.alt) return d.alt;
    if (d.vista === 'cuenta') {
      const [c2, c3] = cabeza(d);
      return `${d.titulo ? `${d.titulo}: ` : ''}${plano(d.formula)}. ${(d.filas || []).map(f => `${f.el}: ${plano(f.por)} ${c2}, ${f.oculto ? '?' : plano(f.total)} ${c3}`).join('; ')}.`;
    }
    const c = d.celda || {};
    return `${NOMBRE_OBJ[d.objeto]}${d.objeto === 'tabla' && c.simbolo ? ` (${c.simbolo}${c.z ? `, número atómico ${c.z}` : ''}${c.masa ? `, masa ${c.masa}` : ''})` : ''}${d.etiqueta ? `, con la etiqueta ${d.etiqueta}` : ''}${d.nombre ? ` (${d.nombre})` : ''}. Dibujo de prueba.`;
  }
  const dibujar = (d, estado) => (d.vista === 'cuenta' ? dibujarCuenta(d, estado) : dibujarObjeto(d));
  const geometria = d => (d.vista === 'cuenta' ? geometriaCuenta(d) : geometriaObjeto(d));
  return { id: 'quim-mol', dibujar, alt, geometria, constantes: { W, M, ALTO_OBJ, FILA }, OBJETOS: Object.keys(OBJETOS) };
});
