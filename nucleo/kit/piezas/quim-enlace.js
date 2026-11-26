/*
 * Pieza «quim-enlace» (19 nov 2026, etapa 6 de química, «Enlace químico» y «Geometría molecular y fuerzas
 * intermoleculares»): los objetos de todos los días de la primera pantalla de cada idea y los símbolos de Lewis en fila
 * (átomos que entregan y reciben electrones, iones entre corchetes). Dibujo de prueba (data-prueba; Gerson decide después
 * si lo reemplaza, docs/plan-calidad.md M4).
 *
 * Afirmación de la figura: lo que se ve por fuera (un foquito que prende, un grano de sal, una tiza) depende de cómo están
 * unidas sus partículas por dentro; en los símbolos de Lewis, cada punto es un electrón de valencia y lo que un átomo
 * entrega lo recibe otro, sin que se pierda ninguno.
 *
 * Dos vistas:
 *   objeto:   un objeto (`objeto`), con su nombre abajo (`nombre`) y, si se pide, un título arriba (`titulo`):
 *             'probador' (pila, foquito y dos cables que tocan `contenido`: 'cobre' | 'sal' (un trozo de sal seca) | 'agua-sal' | 'agua-azucar' |
 *             'agua'; `prende`: 0 apagado, 1 débil, 2 fuerte), 'sal' (granos de sal en una cuchara), 'ventana' (el aire:
 *             moléculas de dos bolitas), 'limpiador' (frasco de limpiador), 'tiza' (una tiza junto a la pizarra),
 *             'globos' (`n` globos amarrados por el nudo, de 2 a 4), 'soplete' (soplete con su llama), 'chorro' (chorrito de
 *             agua que se dobla hacia un peine), 'olla' (olla con agua que hierve);
 *   simbolos: `filas`, cada una una lista de fichas: un texto ('+', '→', '2') o un átomo
 *             { s: 'Cl', puntos: 7, carga: '−', corchetes: true, oculto: true }; `transfiere`: [[fila, i, j]] dibuja una
 *             flecha curva violeta (un electrón que pasa) de la ficha i a la ficha j de esa fila. Una fila también puede ser
 *             { fichas: [...], desde: k }: se dibuja recién con estado.corte ≥ k (el alto no cambia entre pasos).
 * Colores del mapa de la unidad (docs/etapa6/propuesta-quimica.md §8): los puntos (electrones) violeta c-f, la carga del
 * ion carmín c-h; los objetos y los símbolos en tinta; sin verde. Un átomo `oculto` lleva «?» en vez de sus puntos (lo que
 * se pide), en tinta.
 *
 * datos = { vista: 'objeto' | 'simbolos', … , alt }. estado = {} (sin pasos). Función pura: sin ids, sin azar, sin reloj.
 * Ancho 320; alto 168 en la vista objeto (206 el probador, agrandado × 1,3) y 20 + 62 por fila en la de símbolos (más 26 con título).
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
  const W = 320, M = 4, n = T.n, ALTO_OBJ = 168;
  const tinta = (g = 2) => `stroke="currentColor" stroke-width="${g}" stroke-linejoin="round" stroke-linecap="round"`;
  const caja = (que, x0, y0, x1, y1, txt) => ({ que, txt, x0, y0, x1, y1 });
  const cajaTexto = (txt, x, base, tam, peso, ancla = 'middle') => {
    const w = T.ancho(txt, tam, peso), x0 = ancla === 'middle' ? x - w / 2 : ancla === 'end' ? x - w : x;
    return { que: 'texto', txt, x0, x1: x0 + w, y0: base - 0.78 * tam, y1: base + 0.22 * tam };
  };

  // ---------- Vista «objeto» ----------
  // Cada objeto se dibuja en la banda y = 30 a 140 y devuelve su caja (para la prueba).
  const CONT = {
    cobre: 'un cable de cobre', sal: 'un trozo de sal', 'agua-sal': 'agua con sal', 'agua-azucar': 'agua con azúcar', agua: 'agua destilada',
  };
  function probador(d) {
    const p = d.prende || 0, c = d.contenido || 'agua';
    let s = '';
    // La pila, a la izquierda, con su borne.
    s += `<rect x="22" y="70" width="52" height="30" rx="4" fill="currentColor" fill-opacity="0.12" ${tinta(2)}/>`;
    s += `<rect x="74" y="79" width="5" height="12" fill="currentColor"/>`;
    s += T.rotulo(48, 90, '+ −', { ancla: 'middle', tam: 14, peso: 700 });
    // El foquito, arriba al centro, con su rosca; si prende, rayos (más largos si prende fuerte) y la ampolla rellena.
    // Encendido: la ampolla llena, un halo punteado y rayos; apagado: la ampolla vacía, sin halo ni rayos.
    if (p) s += `<circle class="kit-halo" cx="160" cy="50" r="${p === 2 ? 25 : 21}" fill="none" ${tinta(1.2)} stroke-dasharray="2 3"/>`;
    s += `<circle class="kit-ampolla" cx="160" cy="50" r="16" fill="currentColor" fill-opacity="${p ? 0.12 : 0}" ${tinta(2)}/>`;
    // El filamento: grueso y entero si prende; fino y tenue si no.
    s += `<path class="kit-filamento" d="M154 62L154 52L157 46L160 52L163 46L166 52L166 62" fill="none" stroke="currentColor" stroke-width="${p ? 3 : 1.2}" stroke-opacity="${p ? 1 : 0.4}" stroke-linejoin="round"/>`;
    s += `<rect x="153" y="65" width="14" height="9" fill="currentColor" fill-opacity="0.3" ${tinta(1.5)}/>`;
    if (p) {
      const L = p === 2 ? 9 : 5;
      // Sin rayos horizontales: el de la izquierda caía sobre el cable (auditoría de Enlace químico, 19 nov).
      for (const a of [-155, -125, -90, -55, -25]) {
        const r = a * Math.PI / 180, x0 = 160 + 28 * Math.cos(r), y0 = 50 + 28 * Math.sin(r);
        s += `<line class="kit-rayo" x1="${n(x0)}" y1="${n(y0)}" x2="${n(x0 + L * Math.cos(r))}" y2="${n(y0 + L * Math.sin(r))}" ${tinta(2)}/>`;
      }
    }
    // Cables: de la pila al foquito y del foquito a los dos electrodos que bajan al vaso.
    s += `<path d="M48 70V50H144" fill="none" ${tinta(2)}/>`;
    s += `<path d="M79 85H118V112" fill="none" ${tinta(2)}/>`;
    s += `<path d="M160 74V84H202V112" fill="none" ${tinta(2)}/>`;
    if (c === 'cobre' || c === 'sal') {
      // Sobre la mesa: los dos electrodos tocan el cable de cobre o el grano de sal.
      s += `<line x1="92" y1="136" x2="236" y2="136" ${tinta(2)}/>`;
      if (c === 'cobre') s += `<path d="M108 118Q160 106 212 118" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-opacity="0.55"/>`;
      else s += `<rect x="112" y="112" width="96" height="22" fill="currentColor" fill-opacity="0.08" ${tinta(2)}/><path d="M112 112L122 104H218L208 112M218 104V126L208 134" fill="none" ${tinta(1.5)}/>`;
      s += `<path d="M118 112V118M202 112V118" ${tinta(3)}/>`;
    } else {
      // El vaso, con el líquido hasta la mitad; los electrodos entran al líquido.
      s += `<path d="M98 100L106 144H214L222 100" fill="none" ${tinta(2)}/>`;
      s += `<path d="M101 116L106 144H214L219 116Z" fill="currentColor" fill-opacity="${c === 'agua' ? 0.08 : 0.16}"/>`;
      s += `<path d="M118 112V134M202 112V134" ${tinta(3)}/>`;
      if (c === 'agua-sal' || c === 'agua-azucar') {
        // Unos granitos en el fondo: lo que se echó al agua (sin partículas: eso es de la lupa).
        for (const x of [138, 152, 168, 182]) s += `<rect x="${x}" y="137" width="4" height="4" fill="none" ${tinta(1.2)}/>`;
      }
    }
    return s;
  }
  function sal() {
    let s = `<path d="M70 96Q160 130 230 96Q160 110 70 96Z" fill="currentColor" fill-opacity="0.08" ${tinta(2)}/>`;
    s += `<path d="M228 96L290 80" ${tinta(5)} stroke-opacity="0.5"/>`;
    for (const [x, y] of [[112, 90], [126, 86], [140, 91], [154, 85], [168, 90], [182, 86], [134, 79], [160, 78], [148, 72]])
      s += `<rect x="${x}" y="${y}" width="10" height="10" fill="var(--card)" ${tinta(1.6)}/>`;
    return s;
  }
  // Las moléculas del aire: N₂ con las bolitas claras y O₂ (la 2.ª y la 7.ª) oscuras, unas 3 de cada 4 de nitrógeno
  // (78 contra 21; lector en frío de Enlace químico, 19 nov: todas iguales no dejaban ver cuáles eran cuáles).
  function ventana() {
    let s = `<rect x="70" y="34" width="180" height="100" rx="4" fill="currentColor" fill-opacity="0.04" ${tinta(2)}/>`;
    s += `<path d="M160 34V134M70 84H250" ${tinta(1.5)} stroke-opacity="0.5"/>`;
    for (const [k, [x, y, ang]] of [[96, 54, 20], [134, 66, -30], [196, 52, 60], [226, 70, 0], [100, 108, -10], [140, 116, 40], [190, 104, -45], [226, 118, 15]].entries()) {
      const r = ang * Math.PI / 180, dx = 5 * Math.cos(r), dy = 5 * Math.sin(r), op = k === 1 || k === 6 ? 0.8 : 0.18;
      s += `<circle class="kit-${op > 0.5 ? 'o2' : 'n2'}" cx="${n(x - dx)}" cy="${n(y - dy)}" r="5" fill="currentColor" fill-opacity="${op}" ${tinta(1.2)}/><circle cx="${n(x + dx)}" cy="${n(y + dy)}" r="5" fill="currentColor" fill-opacity="${op}" ${tinta(1.2)}/>`;
    }
    return s;
  }
  function limpiador() {
    let s = `<path d="M134 62Q134 52 146 50V40H174V50Q186 52 186 62V136H134Z" fill="currentColor" fill-opacity="0.1" ${tinta(2)}/>`;
    s += `<rect x="144" y="30" width="32" height="10" rx="2" fill="currentColor" fill-opacity="0.3" ${tinta(1.5)}/>`;
    s += `<rect x="140" y="80" width="40" height="34" rx="3" fill="var(--card)" ${tinta(1.4)}/>`;
    s += `<path d="M146 90H174M146 98H168M146 106H172" ${tinta(1.2)} stroke-opacity="0.55"/>`;
    s += `<line x1="90" y1="137" x2="230" y2="137" ${tinta(2)}/>`;
    return s;
  }
  // La tiza en primer plano, grande y con su punta gastada; la pizarra queda detrás (lector en frío de Enlace químico,
  // 19 nov: la tiza chiquita en la repisa no se veía).
  function tiza() {
    let s = `<rect x="40" y="34" width="240" height="64" rx="3" fill="currentColor" fill-opacity="0.16" ${tinta(2)}/>`;
    s += `<path d="M60 62Q80 48 100 62T140 62" fill="none" ${tinta(2)} stroke-opacity="0.5"/>`;
    s += `<line x1="36" y1="102" x2="284" y2="102" ${tinta(3)}/>`;
    s += `<path class="kit-tiza" d="M96 110H214L226 116L214 132H96Q90 121 96 110Z" fill="var(--card)" ${tinta(2.2)}/>`;
    s += `<path d="M214 110V132" ${tinta(1.4)} stroke-opacity="0.6"/><path d="M110 116H200M110 125H186" ${tinta(1)} stroke-opacity="0.25"/>`;
    return s;
  }
  function globos(d) {
    const k = Math.max(2, Math.min(4, d.n || 3)), cx = 160, cy = 92;
    const angs = { 2: [180, 0], 3: [-90, 30, 150], 4: [-125, -55, 35, 145] }[k];
    let s = '';
    for (const a of angs) {
      const r = a * Math.PI / 180, ex = cx + 40 * Math.cos(r), ey = cy + 30 * Math.sin(r);
      const rot = a + 90;
      s += `<ellipse class="kit-globo" cx="${n(ex)}" cy="${n(ey)}" rx="${k === 2 ? 30 : 22}" ry="${k === 2 ? 20 : 18}" transform="rotate(${n(rot + 90)} ${n(ex)} ${n(ey)})" fill="currentColor" fill-opacity="0.14" ${tinta(2)}/>`;
      // 26 nov (dibujos reconocibles): la boquilla amarrada de cada globo, su pita hasta el nudo y un brillo.
      const R = k === 2 ? 30 : 22, ux = Math.cos(r), uy = Math.sin(r), tip = [ex - ux * R, ey - uy * R], vx = -uy, vy = ux;
      s += `<path d="M${n(tip[0])} ${n(tip[1])}L${n(tip[0] - ux * 5 + vx * 3)} ${n(tip[1] - uy * 5 + vy * 3)}L${n(tip[0] - ux * 5 - vx * 3)} ${n(tip[1] - uy * 5 - vy * 3)}Z" fill="currentColor" ${tinta(1.2)}/>`;
      s += `<line x1="${n(tip[0] - ux * 5)}" y1="${n(tip[1] - uy * 5)}" x2="${cx}" y2="${cy}" ${tinta(1.2)} stroke-opacity="0.7"/>`;
      s += `<path d="M${n(ex + ux * R * 0.35 + vx * 6)} ${n(ey + uy * R * 0.35 + vy * 6)}L${n(ex + ux * R * 0.6 + vx * 4)} ${n(ey + uy * R * 0.6 + vy * 4)}" stroke="var(--card)" stroke-width="3" stroke-linecap="round"/>`;
    }
    s += `<circle cx="${cx}" cy="${cy}" r="5" fill="currentColor"/>`;
    return s;
  }
  // 26 nov (dibujos reconocibles): el soplete de gasfitero: el balón de gas parado, la válvula con su perilla, el tubo
  // y la boquilla, y la llama con su cono de adentro. El bloque con una hoja de antes no se reconocía.
  function soplete() {
    let s = `<path d="M60 136V102Q60 93 76 93Q92 93 92 102V136Z" fill="currentColor" fill-opacity="0.14" ${tinta(2)}/>`;
    s += `<rect x="60" y="110" width="32" height="12" fill="currentColor" fill-opacity="0.18" stroke="none"/>`;
    s += `<rect x="70" y="86" width="12" height="8" rx="2" fill="var(--card)" ${tinta(1.8)}/><circle cx="66" cy="90" r="3.5" fill="var(--card)" ${tinta(1.6)}/>`;
    s += `<path d="M82 90L120 92L164 101" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`;
    s += `<path d="M162 96L176 101L176 107L162 106Z" fill="var(--card)" ${tinta(1.8)}/>`;
    s += `<path d="M178 104Q206 89 250 104Q206 119 178 104Z" fill="currentColor" fill-opacity="0.18" ${tinta(1.8)}/>`;
    s += `<path d="M180 104Q192 98 210 104Q192 110 180 104Z" fill="currentColor" fill-opacity="0.4"/>`;
    s += `<line x1="40" y1="137" x2="280" y2="137" ${tinta(2)}/>`;
    return s;
  }
  function chorro() {
    // 26 nov (dibujos reconocibles): el caño con su plancha en la pared, la llave arriba y el pico que baja; antes era
    // una T sin rasgo de caño.
    let s = `<rect x="50" y="38" width="8" height="26" rx="2" fill="currentColor" fill-opacity="0.2" ${tinta(1.8)}/>`;
    s += `<path d="M58 44H96Q104 44 104 52V60H92V56H58Z" fill="currentColor" fill-opacity="0.14" ${tinta(2)} stroke-linejoin="round"/>`;
    s += `<path d="M78 44V39M70 39H86" ${tinta(2.4)}/>`;
    s += `<path d="M98 60Q100 100 132 134" fill="none" stroke="currentColor" stroke-width="3" stroke-opacity="0.55" stroke-linecap="round"/>`;
    s += `<g transform="rotate(-20 176 100)"><rect x="150" y="94" width="58" height="10" rx="3" fill="currentColor" fill-opacity="0.2" ${tinta(1.6)}/>`;
    for (let x = 154; x <= 204; x += 6) s += `<line x1="${x}" y1="104" x2="${x}" y2="112" ${tinta(1.2)}/>`;
    s += '</g>';
    s += `<line x1="50" y1="137" x2="270" y2="137" ${tinta(2)}/>`;
    return s;
  }
  function olla() {
    let s = `<path d="M92 72H228V126Q228 134 220 134H100Q92 134 92 126Z" fill="currentColor" fill-opacity="0.08" ${tinta(2)}/>`;
    s += `<path d="M80 72H240M92 82H76M228 82H244" ${tinta(2)}/>`;
    s += `<path d="M96 92H224V126Q224 130 220 130H100Q96 130 96 126Z" fill="currentColor" fill-opacity="0.14"/>`;
    for (const [x, y, r] of [[120, 112, 5], [150, 104, 4], [176, 116, 6], [204, 106, 4], [138, 122, 3]]) s += `<circle cx="${x}" cy="${y}" r="${r}" fill="var(--card)" ${tinta(1.3)}/>`;
    for (const x of [130, 160, 190]) s += `<path d="M${x} 66Q${x - 6} 56 ${x} 48Q${x + 6} 40 ${x} 32" fill="none" ${tinta(1.5)} stroke-opacity="0.45"/>`;
    s += `<path d="M100 140H220M118 140V146M202 140V146" ${tinta(2)}/>`;
    return s;
  }
  const OBJETOS = { probador, sal, ventana, limpiador, tiza, globos, soplete, chorro, olla };
  // Caja de cada objeto (para la prueba de rótulos): lo que ocupa el dibujo.
  const CAJA_OBJ = {
    probador: [20, 10, 238, 146], sal: [68, 70, 292, 112], ventana: [68, 32, 252, 136], limpiador: [88, 28, 232, 139], tiza: [34, 32, 286, 134],
    globos: [100, 50, 220, 134], soplete: [38, 86, 282, 139], chorro: [48, 38, 272, 139], olla: [74, 30, 246, 147],
  };
  // El probador se agranda (× 1,3) para que la figura sea lo más grande de la pantalla (sesión, 19 nov): su alto es 206.
  const AGRANDA = { probador: { k: 1.3, dx: -9, dy: -6, alto: 206 } };
  const altoObj = d => (AGRANDA[d.objeto] ? AGRANDA[d.objeto].alto : ALTO_OBJ);
  const enEscala = (d, x, y) => { const a = AGRANDA[d.objeto]; return a ? [a.dx + a.k * x, a.dy + a.k * y] : [x, y]; };
  function dibujarObjeto(d) {
    const a = AGRANDA[d.objeto], H = altoObj(d);
    let s = '';
    if (d.titulo) s += T.rotulo(W / 2, 20, d.titulo, { ancla: 'middle', peso: 700, tam: 16, min: M, max: W - M });
    const tr = a ? ` transform="translate(${a.dx} ${a.dy}) scale(${a.k})"` : '';
    s += `<g class="kit-objeto" data-objeto="${T.esc(d.objeto)}" data-prueba="si"${tr}>${OBJETOS[d.objeto](d)}</g>`;
    if (d.nombre) s += T.rotulo(W / 2, H - 8, d.nombre, { ancla: 'middle', tam: 15, peso: 600, min: M, max: W - M });
    return T.svg(W, H, s, { alt: alt(d) });
  }
  function geometriaObjeto(d) {
    const textos = [], [bx0, by0, bx1, by1] = CAJA_OBJ[d.objeto], H = altoObj(d), [x0, y0] = enEscala(d, bx0, by0), [x1, y1] = enEscala(d, bx1, by1);
    if (d.titulo) textos.push(cajaTexto(d.titulo, W / 2, 20, 16, 700));
    if (d.nombre) textos.push(cajaTexto(d.nombre, W / 2, H - 8, 15, 600));
    return { W, H, M, textos, objetos: [caja(d.objeto, x0, y0, x1, y1)] };
  }

  // ---------- Vista «símbolos» ----------
  const TAM = 22, TAMQ = 15, SEP = 10, ALTO_FILA = 62;
  // Lugar de cada punto: arriba, derecha, abajo, izquierda; primero uno por lado y después en pares (como en los libros).
  function lugaresPuntos(k) {
    const lados = [0, 0, 0, 0];
    for (let i = 0; i < k; i++) lados[i < 4 ? i : i - 4] += 1;
    return lados;
  }
  function medidas(f) {
    if (typeof f === 'string') return { w: T.ancho(f, TAM, 600), op: true };
    const ws = T.ancho(f.s, TAM, 700), pad = 9, wq = f.carga ? T.ancho(f.carga, TAMQ, 700) + 2 : 0, wc = f.corchetes ? 9 : 0;
    return { ws, pad, wq, wc, w: ws + 2 * pad + 2 * wc + wq };
  }
  function layoutFila(fila) {
    const ms = fila.map(medidas), tot = ms.reduce((a, m) => a + m.w, 0) + SEP * (fila.length - 1);
    let x = (W - tot) / 2;
    return ms.map(m => { const o = Object.assign({ x0: x }, m); x += m.w + SEP; return o; });
  }
  function dibujarFicha(f, m, base, cajas) {
    let s = '';
    if (typeof f === 'string') {
      const cx = m.x0 + m.w / 2;
      s += T.rotulo(cx, base, f, { ancla: 'middle', tam: TAM, peso: 600 });
      cajas.textos.push(cajaTexto(f, cx, base, TAM, 600));
      return s;
    }
    const cx = m.x0 + m.wc + m.pad + m.ws / 2, top = base - 0.74 * TAM, bot = base + 0.06 * TAM, mid = (top + bot) / 2;
    // El símbolo, en la serif de las ecuaciones (Etapa 6: en la sin serif «Cl» se leía «CI»).
    s += `<g class="kit-simbolo">${T.rotulo(cx, base, f.s, { ancla: 'middle', tam: TAM, peso: 700, familia: T.SERIF })}`;
    cajas.textos.push(cajaTexto(f.s, cx, base, TAM, 700));
    if (f.oculto) {
      // Lo que se pide (sus puntos) va con «?», arriba del símbolo y lejos de la carga.
      s += T.rotulo(cx, top - 6, '?', { ancla: 'middle', tam: 14, peso: 700 });
      cajas.textos.push(cajaTexto('?', cx, top - 6, 14, 700));
    } else if (f.puntos) {
      const [ar, de, ab, iz] = lugaresPuntos(f.puntos), pts = [];
      const par = (k, x, y, horiz) => { if (k === 1) pts.push([x, y]); else if (k === 2) { if (horiz) pts.push([x - 4, y], [x + 4, y]); else pts.push([x, y - 4], [x, y + 4]); } };
      par(ar, cx, top - 3, true); par(de, cx + m.ws / 2 + 6, mid, false); par(ab, cx, bot + 4, true); par(iz, cx - m.ws / 2 - 6, mid, false);
      for (const [x, y] of pts) s += `<circle class="kit-punto" cx="${n(x)}" cy="${n(y)}" r="3.2" fill="var(--c-f)"/>`;
      cajas.puntos.push(...pts);
    }
    if (f.corchetes) {
      const xl = m.x0 + 2, xr = m.x0 + m.w - m.wq - 2, yt = top - 9, yb = bot + 9;
      s += `<path d="M${n(xl + 5)} ${n(yt)}H${n(xl)}V${n(yb)}H${n(xl + 5)}M${n(xr - 5)} ${n(yt)}H${n(xr)}V${n(yb)}H${n(xr - 5)}" fill="none" ${tinta(1.6)}/>`;
      cajas.objetos.push(caja('corchetes', xl - 1, yt - 1, xr + 1, yb + 1));
    }
    if (f.carga) {
      const xq = m.x0 + m.w - m.wq + 1, yq = top + 2;
      s += T.rotulo(xq, yq, f.carga, { tam: TAMQ, peso: 700, color: 'h' });
      cajas.textos.push(cajaTexto(f.carga, xq, yq, TAMQ, 700, 'start'));
    }
    return s + '</g>';
  }
  const fichasDe = fila => (Array.isArray(fila) ? fila : fila.fichas);
  const seVe = (fila, corte) => Array.isArray(fila) || !fila.desde || corte >= fila.desde;
  function alto(d) { return (d.titulo ? 26 : 0) + 20 + ALTO_FILA * (d.filas || []).length; }
  function dibujarSimbolos(d, estado = {}) {
    const cajas = { textos: [], objetos: [], puntos: [] }, y0 = d.titulo ? 26 : 0, corte = estado.corte || 0;
    let s = '';
    if (d.titulo) { s += T.rotulo(W / 2, 20, d.titulo, { ancla: 'middle', peso: 700, tam: 16, min: M, max: W - M }); }
    (d.filas || []).forEach((fila0, k) => {
      if (!seVe(fila0, corte)) return;
      const fila = fichasDe(fila0), base = y0 + 20 + ALTO_FILA * k + 38, lay = layoutFila(fila);
      fila.forEach((f, i) => { s += dibujarFicha(f, lay[i], base, cajas); });
      for (const [fk, i, j] of d.transfiere || []) if (fk === k) {
        // La flecha nace 14 px sobre el símbolo, por encima de su punto de arriba, para que el electrón que pasa se vea.
        const a = lay[i], b = lay[j], xa = a.x0 + a.w / 2, xb = b.x0 + b.w / 2, yt = base - 0.74 * TAM - 14, yc = yt - 10;
        s += `<path class="kit-transfiere" d="M${n(xa)} ${n(yt)}Q${n((xa + xb) / 2)} ${n(yc - 6)} ${n(xb - 6)} ${n(yt - 2)}" fill="none" stroke="var(--c-f)" stroke-width="2"/>`;
        s += T.flecha(xb - 9, yt - 4, xb - 4, yt - 1, { color: 'f', grosor: 2 });
      }
    });
    return T.svg(W, alto(d), s, { alt: alt(d) });
  }
  function geometriaSimbolos(d) {
    const cajas = { textos: [], objetos: [], puntos: [] }, y0 = d.titulo ? 26 : 0;
    if (d.titulo) cajas.textos.push(cajaTexto(d.titulo, W / 2, 20, 16, 700));
    (d.filas || []).forEach((fila0, k) => {
      const fila = fichasDe(fila0), base = y0 + 20 + ALTO_FILA * k + 38, lay = layoutFila(fila);
      fila.forEach((f, i) => dibujarFicha(f, lay[i], base, cajas));
    });
    return { W, H: alto(d), M, textos: cajas.textos, objetos: cajas.objetos, puntos: cajas.puntos };
  }

  const NOMBRE_OBJ = {
    probador: d => `Un probador: una pila y un foquito con dos cables que tocan ${CONT[d.contenido || 'agua']}; el foquito ${d.prende === 2 ? 'prende fuerte' : d.prende === 1 ? 'prende poco' : 'no prende'}`,
    sal: () => 'Granos de sal en una cuchara', ventana: () => 'Una ventana con el aire: moléculas de dos bolitas', limpiador: () => 'Un frasco de limpiador',
    tiza: () => 'Una tiza junto a la pizarra', globos: d => `${d.n || 3} globos amarrados por el nudo, lo más separados posible`,
    soplete: () => 'Un soplete de soldar con su llama', chorro: () => 'Un chorrito de agua que se dobla hacia un peine frotado', olla: () => 'Una olla con agua que hierve',
  };
  const textoFicha = f => (typeof f === 'string' ? f : `${f.corchetes ? '[' : ''}${f.s}${f.oculto ? ' con ? puntos' : f.puntos ? ` con ${f.puntos} punto${f.puntos > 1 ? 's' : ''}` : ''}${f.corchetes ? ']' : ''}${f.carga || ''}`);
  function alt(d) {
    if (d.alt) return d.alt;
    if (d.vista === 'simbolos') return `Símbolos de Lewis (cada punto, un electrón de valencia): ${(d.filas || []).map(f => fichasDe(f).map(textoFicha).join(' ')).join('; ')}.`;
    return `${NOMBRE_OBJ[d.objeto](d)}${d.nombre ? ` (${d.nombre})` : ''}. Dibujo de prueba.`;
  }
  const dibujar = (d, estado) => (d.vista === 'simbolos' ? dibujarSimbolos(d, estado) : dibujarObjeto(d));
  const geometria = d => (d.vista === 'simbolos' ? geometriaSimbolos(d) : geometriaObjeto(d));

  return { id: 'quim-enlace', dibujar, alt, geometria, constantes: { W, M, ALTO_OBJ, ALTO_FILA }, OBJETOS: Object.keys(OBJETOS) };
});
