/*
 * Pieza «quim-reaccion» (26 nov 2026, etapa 9 de química, «Reacciones químicas y balance»): los objetos de todos los días
 * de la primera pantalla de cada idea y el inventario de una ecuación (una tabla izquierda | derecha por elemento, carga o
 * electrones). Los objetos son dibujo de prueba (data-prueba; Gerson decide después si los reemplaza,
 * docs/plan-calidad.md M4).
 *
 * Afirmación de la figura: lo que pasa en el vaso (burbujas, un sólido, calor, un metal que se cubre de otro) es una
 * reacción entre sustancias que se escriben en una ecuación; en el inventario, una ecuación está balanceada cuando cada
 * fila tiene lo mismo a los dos lados.
 *
 * Dos vistas:
 *   objeto: `objeto`: 'mesa' (tres vasos en la mesa del laboratorio: uno burbujea, otro con un sólido blanco en el fondo,
 *           otro humea), 'horno' (horno de cal con piedras de caliza sobre el fuego), 'cocina' (hornilla con su llama de
 *           gas y una olla), 'zinc' (lámina de zinc en un vaso con solución de sulfato de cobre, cubriéndose de cobre),
 *           'plata' (alambre de cobre enrollado en un vaso con nitrato de plata, con cristales de plata), 'permanganato'
 *           (frasco de permanganato de potasio con su gotero y un vaso); `etiqueta`: texto corto en la etiqueta del frasco
 *           (solo 'permanganato'); `nombre` debajo y `titulo` arriba (opcionales).
 *   inventario: `ecuacion`: lista de partes { t, color } o fichas de ecuación { v: 'c-f', t } (va en la serif, dentro de un
 *           marco; la letra se achica hasta 14 si no cabe); `titulo` (opcional); `cabeza`: [izquierda, derecha] (por
 *           omisión «izquierda» y «derecha»); `filas`: [{ et, izq, der, color, igual, oculto, desde }] (de 1 a 5): `et` es
 *           el elemento o la cuenta («O», «carga», «e⁻»); `izq` y `der`, lo que suma cada lado; `igual`: true pone «✓» y
 *           false «≠» al final (sin `igual`, nada); `oculto`: 'izq' o 'der' lleva «?» en ese lado; con `desde: k` la fila
 *           se llena recién con estado.corte ≥ k (el alto no cambia entre pasos).
 * Colores del mapa de la unidad (docs/etapa9/propuesta-quimica.md §8): coeficiente violeta c-f, EO naranja c-o, electrones
 * turquesa c-i, carga carmín c-h; los objetos, las fórmulas y los subíndices en tinta; sin verde.
 * Los símbolos de los átomos van en la letra con serifa de las ecuaciones (en la sin serifa «Cl» se lee «CI»).
 *
 * datos = { vista: 'objeto' | 'inventario', … , alt }. estado = { corte }. Función pura: sin ids, sin azar, sin reloj.
 * Ancho 320; alto 176 en la vista objeto y 100 + 32 por fila en el inventario (122 si la ecuación va en dos renglones; más
 * 24 con título).
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
  function linea(ps, cx, base, tam, peso, familia) {
    // La flecha va en la letra de la interfaz: en la serif de la ecuación se ve como un guion corto (lector en frío, 26 nov).
    const flecha = t => T.esc(t).split('→').join('<tspan style="font-family:system-ui,sans-serif">→</tspan>');
    const spans = ps.map(p => `<tspan fill="${T.color(p.color)}">${flecha(p.t)}</tspan>`).join('');
    return `<text class="kit-txt" x="${n(cx)}" y="${n(base)}" fill="${T.color()}" font-size="${n(tam)}" font-weight="${peso}" text-anchor="middle" style="${familia ? `font-family:${T.esc(familia)};` : ''}font-variant-numeric:tabular-nums">${spans}</text>`;
  }

  // ---------- Vista «objeto» ----------
  // Cada objeto se dibuja en la banda y = 24 a 148, sobre la línea de la mesa (y = 147).
  // Colores de las sustancias que se ven (lectores en frío, 26 nov: el color es el indicio que enseña la idea). Son el
  // color real de cada una, no colores de variable ni de elemento: solución de Cu²⁺ azul, cobre rojizo, plata gris
  // brillante, permanganato morado. De prueba, como los objetos (Gerson decide si se reemplazan).
  const SUST = { cobreAc: '#2f7fd6', cobre: '#b4532a', zinc: '#8a96a3', plata: '#9aa3ad', mno4: '#7a2f93' };
  const vaso = (x, w, y0, nivel, color, op = 0.14) => {
    // Un vaso de vidrio de boca ancha, de x a x + w, con fondo en 146; el líquido llega a `nivel` (y), del `color` dado
    // (sin color, un gris del texto).
    let s = `<path d="M${x} ${y0}L${x + 4} 146H${x + w - 4}L${x + w} ${y0}" fill="none" ${tinta(2)}/>`;
    if (nivel) s += `<path d="M${n(x + 4 * (nivel - y0) / (146 - y0))} ${nivel}L${x + 4} 146H${x + w - 4}L${n(x + w - 4 * (nivel - y0) / (146 - y0))} ${nivel}Z" fill="${color || 'currentColor'}" fill-opacity="${op}"/>`;
    return s;
  };
  function mesa() {
    let s = '';
    // Vaso 1: burbujas que suben.
    s += vaso(30, 70, 70, 90);
    for (const [x, y, r] of [[48, 130, 3], [62, 118, 2.5], [74, 132, 3], [56, 104, 2], [80, 110, 2.5], [66, 96, 2], [52, 84, 1.8], [78, 80, 2]]) s += `<circle cx="${x}" cy="${y}" r="${r}" fill="none" ${tinta(1.3)}/>`;
    // Vaso 2: un sólido blanco en el fondo (polvo asentado).
    s += vaso(125, 70, 70, 90);
    s += `<path d="M130 146Q140 132 160 134Q180 132 190 146Z" fill="var(--card)" ${tinta(1.6)}/>`;
    for (const [x, y] of [[142, 140], [152, 137], [163, 141], [172, 138], [181, 142], [158, 143]]) s += `<circle cx="${x}" cy="${y}" r="1.4" fill="currentColor" fill-opacity="0.6"/>`;
    // Vaso 3: humea (calor).
    s += vaso(220, 70, 70, 90);
    for (const x of [238, 255, 272]) s += `<path d="M${x} 62Q${x - 6} 52 ${x} 44Q${x + 6} 36 ${x} 28" fill="none" ${tinta(1.6)} stroke-opacity="0.7"/>`;
    s += `<line x1="12" y1="147" x2="308" y2="147" ${tinta(2)}/>`;
    return s;
  }
  function horno() {
    // El horno: una torre de piedra con boca abajo, el fuego dentro y piedras de caliza arriba; humo que sale.
    let s = `<path d="M96 146L108 66H212L224 146Z" fill="currentColor" fill-opacity="0.06" ${tinta(2)}/>`;
    for (const y of [86, 106, 126]) s += `<line x1="${n(96 + 12 * (146 - y) / 80)}" y1="${y}" x2="${n(224 - 12 * (146 - y) / 80)}" y2="${y}" ${tinta(1)} stroke-opacity="0.4"/>`;
    s += `<path d="M140 146V124Q160 110 180 124V146" fill="var(--card)" ${tinta(2)}/>`;
    s += `<path d="M148 146Q146 134 154 128Q152 138 160 132Q160 122 166 120Q164 132 172 134Q176 140 172 146Z" fill="currentColor" fill-opacity="0.45" ${tinta(1.2)}/>`;
    for (const [x, r] of [[122, 9], [142, 10], [162, 9], [182, 10], [200, 8]]) s += `<circle cx="${x}" cy="${66 - r + 3}" r="${r}" fill="var(--card)" ${tinta(1.6)}/>`;
    for (const x of [140, 176]) s += `<path d="M${x} 48Q${x - 7} 42 ${x} 37Q${x + 7} 32 ${x} 28" fill="none" ${tinta(1.6)} stroke-opacity="0.6"/>`;
    s += `<line x1="60" y1="147" x2="260" y2="147" ${tinta(2)}/>`;
    return s;
  }
  function cocina() {
    // La hornilla: la plancha con su perilla, el quemador y la llama; encima, una olla con su tapa y asas.
    let s = `<rect x="60" y="128" width="200" height="18" rx="3" fill="currentColor" fill-opacity="0.1" ${tinta(2)}/>`;
    s += `<circle cx="236" cy="137" r="5" fill="none" ${tinta(1.6)}/>`;
    s += `<rect x="134" y="118" width="52" height="10" rx="2" fill="currentColor" fill-opacity="0.3" ${tinta(1.4)}/>`;
    for (const x of [142, 152, 160, 168, 178]) s += `<path d="M${x - 4} 118Q${x - 5} 110 ${x} 104Q${x + 5} 110 ${x + 4} 118Z" fill="currentColor" fill-opacity="0.25" ${tinta(1.2)}/>`;
    s += `<path d="M118 98V60H202V98Z" fill="currentColor" fill-opacity="0.06" ${tinta(2)}/>`;
    s += `<path d="M110 66H118M202 66H210" ${tinta(3)}/>`;
    s += `<path d="M114 60Q160 46 206 60" fill="none" ${tinta(2)}/><circle cx="160" cy="50" r="4" fill="var(--card)" ${tinta(1.6)}/>`;
    s += `<line x1="40" y1="147" x2="280" y2="147" ${tinta(2)}/>`;
    return s;
  }
  function zinc() {
    // Un vaso con solución azul de sulfato de cobre y una lámina de zinc parada adentro; la parte mojada, con manchas de
    // cobre.
    let s = vaso(100, 120, 60, 82, SUST.cobreAc, 0.4);
    s += `<rect x="150" y="36" width="20" height="104" rx="2" fill="${SUST.zinc}" fill-opacity="0.45" ${tinta(1.8)}/>`;
    // La capa rojiza de cobre, solo en la parte mojada de la lámina.
    s += `<rect x="150" y="84" width="20" height="56" rx="2" fill="${SUST.cobre}" fill-opacity="0.75"/>`;
    for (const [x, y] of [[155, 92], [163, 100], [157, 110], [165, 118], [154, 126], [162, 132], [158, 86]]) s += `<circle cx="${x}" cy="${y}" r="2.2" fill="${SUST.cobre}"/>`;
    s += `<line x1="60" y1="147" x2="260" y2="147" ${tinta(2)}/>`;
    return s;
  }
  function plata() {
    // Un vaso con solución de nitrato de plata; adentro, un alambre de cobre en espiral con cristales que le crecen.
    // La solución ya se tiñe de celeste (Cu²⁺); el alambre es de cobre y los cristales, de plata.
    let s = vaso(100, 120, 50, 70, SUST.cobreAc, 0.2);
    let d = 'M160 36V60';
    for (let k = 0; k < 5; k++) { const y = 66 + 14 * k; d += `Q${k % 2 ? 128 : 192} ${y} 160 ${y + 7}`; }
    s += `<path d="${d}" fill="none" stroke="${SUST.cobre}" stroke-width="3" stroke-linecap="round"/>`;
    for (const [x, y, a] of [[134, 72, -1], [188, 84, 1], [132, 100, -1], [190, 112, 1], [136, 126, -1], [184, 136, 1]]) {
      // Cristales: rombos de plata pegados al alambre (no trazos sueltos, que se leían como flechas).
      for (const [dx, dy, r] of [[3, -3, 5], [7, 3, 4], [2, 5, 3]]) {
        const cx = x + dx * a, cy = y + dy;
        s += `<path d="M${cx} ${cy - r * 1.4}L${cx + r} ${cy}L${cx} ${cy + r * 1.4}L${cx - r} ${cy}Z" fill="${SUST.plata}" ${tinta(0.8)}/>`;
      }
    }
    s += `<line x1="60" y1="147" x2="260" y2="147" ${tinta(2)}/>`;
    return s;
  }
  function permanganato() {
    // El frasco de permanganato (oscuro) con su etiqueta, el gotero echado al lado y un vaso con agua apenas teñida.
    let s = `<path d="M60 70Q60 62 70 60H110Q120 62 120 70V146H60Z" fill="${SUST.mno4}" fill-opacity="0.85" ${tinta(2)}/>`;
    s += `<rect x="72" y="44" width="36" height="16" rx="3" fill="currentColor" fill-opacity="0.3" ${tinta(1.6)}/>`;
    s += `<path d="M132 140L176 118" ${tinta(3)}/><path d="M176 118L184 114" ${tinta(5)}/>`;
    s += vaso(196, 90, 70, 92, SUST.mno4, 0.45);
    s += `<line x1="40" y1="147" x2="300" y2="147" ${tinta(2)}/>`;
    return s;
  }
  const OBJETOS = { mesa, horno, cocina, zinc, plata, permanganato };
  const CAJA_OBJ = { mesa: [12, 27, 308, 148], horno: [60, 27, 260, 148], cocina: [40, 46, 280, 148], zinc: [60, 36, 260, 148],
    plata: [60, 36, 260, 148], permanganato: [40, 44, 300, 148] };
  const ETQ = { permanganato: [64, 96, 116, 118] };
  function etiquetaDe(d) {
    const r = ETQ[d.objeto];
    if (!r || !d.etiqueta) return null;
    const [x0, y0, x1, y1] = r, tam = 14;
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
    const textos = [], [x0, y0, x1, y1] = CAJA_OBJ[d.objeto], e = etiquetaDe(d), dentro = [];
    if (d.titulo) textos.push(cajaTexto(d.titulo, W / 2, 18, 16, 700));
    if (d.nombre) textos.push(cajaTexto(d.nombre, W / 2, ALTO_OBJ - 8, 15, 600));
    if (e) dentro.push(Object.assign(cajaTexto(d.etiqueta, e.cx, e.base, e.tam, 700), { marco: [e.x0, e.y0, e.x1, e.y1] }));
    return { W, H: ALTO_OBJ, M, textos, objetos: [caja(d.objeto, x0, y0, x1, y1)], dentro };
  }

  // ---------- Vista «inventario» ----------
  const FILA = 32, X_ET = 50, X_IZ = 150, X_DE = 240, X_MARCA = 296, ANCHO_EC = W - 2 * M - 20;
  // La ecuación en uno o dos renglones: si no cabe con letra 14, se parte en la flecha (el segundo renglón empieza en «→»).
  function renglones(d) {
    const ps = partes(d.ecuacion), t = plano(ps);
    if (T.ancho(t, 14, 700) <= ANCHO_EC) return [ps];
    const a = [], b = []; let en = a;
    for (const p of ps) {
      const i = en === a ? p.t.indexOf('→') : -1;
      if (i < 0) { en.push(p); continue; }
      if (p.t.slice(0, i).trim()) a.push(Object.assign({}, p, { t: p.t.slice(0, i).trimEnd() }));
      b.push(Object.assign({}, p, { t: p.t.slice(i) })); en = b;
    }
    return b.length ? [a, b] : [ps];
  }
  const ALTO_EC = d => (renglones(d).length > 1 ? 70 : 48);
  const altoInv = d => (d.titulo ? 24 : 0) + 52 + ALTO_EC(d) + FILA * (d.filas || []).length;
  const cabezaInv = d => (d.cabeza || ['izquierda', 'derecha']);
  // La letra de la ecuación: 22 si cabe; si no, la que cabe, nunca menos de 14.
  const tamEc = d => { const rs = renglones(d); let tam = 22; while (tam > 14 && rs.some(r => T.ancho(plano(r), tam, 700) > ANCHO_EC)) tam -= 0.5; return tam; };
  const basesEc = (d, y0) => (renglones(d).length > 1 ? [y0 + 32, y0 + 58] : [y0 + 38]);
  const marcaDe = f => (f.igual === true ? '✓' : f.igual === false ? '≠' : '');
  function dibujarInventario(d, estado = {}) {
    const corte = estado.corte || 0, y0 = d.titulo ? 24 : 0, H = altoInv(d), [c1, c2] = cabezaInv(d);
    let s = '';
    if (d.titulo) s += T.rotulo(W / 2, 18, d.titulo, { ancla: 'middle', peso: 700, tam: 16, min: M, max: W - M });
    s += `<rect x="${M + 2}" y="${y0 + 6}" width="${W - 2 * M - 4}" height="${ALTO_EC(d)}" rx="10" fill="currentColor" fill-opacity="0.05" ${tinta(1.4)}/>`;
    const bs = basesEc(d, y0);
    s += `<g class="kit-ecuacion">${renglones(d).map((r, i) => linea(r, W / 2, bs[i], tamEc(d), 700, T.SERIF)).join('')}</g>`;
    const yc = y0 + ALTO_EC(d) + 34;
    s += T.rotulo(X_IZ, yc, c1, { ancla: 'middle', tam: 14, peso: 700, clase: 'kit-cabeza' });
    s += T.rotulo(X_DE, yc, c2, { ancla: 'middle', tam: 14, peso: 700, clase: 'kit-cabeza' });
    s += `<line x1="${M + 8}" y1="${yc + 7}" x2="${W - M - 8}" y2="${yc + 7}" ${tinta(1)} stroke-opacity="0.6"/>`;
    s += `<line x1="${(X_IZ + X_DE) / 2}" y1="${yc + 12}" x2="${(X_IZ + X_DE) / 2}" y2="${H - 8}" ${tinta(1)} stroke-opacity="0.35"/>`;
    (d.filas || []).forEach((f, k) => {
      const base = yc + 8 + FILA * (k + 1) - 9, ve = !(f.desde && corte < f.desde);
      s += `<g class="kit-fila">${linea([{ t: f.et, color: f.colorEt }], X_ET, base, 18, 700, T.SERIF)}`;
      if (ve) {
        const lado = (q, val) => (f.oculto === q ? [{ t: '?' }] : partes(val).map(p => Object.assign({}, p, { color: p.color || f.color })));
        s += linea(lado('izq', f.izq), X_IZ, base, 18, 700) + linea(lado('der', f.der), X_DE, base, 18, 700);
        const m = marcaDe(f);
        if (m) s += `<text class="kit-txt kit-marca" x="${X_MARCA}" y="${base}" fill="${T.color()}" font-size="18" font-weight="700" text-anchor="middle">${m}</text>`;
      }
      s += '</g>';
    });
    return T.svg(W, H, s, { alt: alt(d) });
  }
  function geometriaInventario(d) {
    const y0 = d.titulo ? 24 : 0, yc = y0 + ALTO_EC(d) + 34, [c1, c2] = cabezaInv(d), textos = [], bs = basesEc(d, y0);
    if (d.titulo) textos.push(cajaTexto(d.titulo, W / 2, 18, 16, 700));
    renglones(d).forEach((r, i) => textos.push(Object.assign(cajaTexto(plano(r), W / 2, bs[i], tamEc(d), 700), { marco: [M + 2, y0 + 6, W - M - 2, y0 + 6 + ALTO_EC(d)] })));
    textos.push(cajaTexto(c1, X_IZ, yc, 14, 700), cajaTexto(c2, X_DE, yc, 14, 700));
    (d.filas || []).forEach((f, k) => {
      const base = yc + 8 + FILA * (k + 1) - 9;
      textos.push(cajaTexto(f.et, X_ET, base, 18, 700), cajaTexto(f.oculto === 'izq' ? '?' : plano(f.izq), X_IZ, base, 18, 700),
        cajaTexto(f.oculto === 'der' ? '?' : plano(f.der), X_DE, base, 18, 700));
      if (marcaDe(f)) textos.push(cajaTexto(marcaDe(f), X_MARCA, base, 18, 700));
    });
    return { W, H: altoInv(d), M, textos, objetos: [], dentro: [] };
  }

  const NOMBRE_OBJ = {
    mesa: 'La mesa del laboratorio con tres vasos: uno burbujea, otro tiene un sólido blanco en el fondo y otro humea',
    horno: 'Un horno de cal: piedras de caliza sobre el fuego', cocina: 'La hornilla de la cocina con su llama de gas y una olla',
    zinc: 'Una lámina de zinc en un vaso con solución de sulfato de cobre; la parte mojada se cubre de cobre',
    plata: 'Un alambre de cobre enrollado en un vaso con nitrato de plata; le crecen cristales de plata',
    permanganato: 'El frasco de permanganato de potasio, morado oscuro, con su gotero y un vaso de agua',
  };
  function alt(d) {
    if (d.alt) return d.alt;
    if (d.vista === 'inventario') {
      const [c1, c2] = cabezaInv(d);
      return `${d.titulo ? `${d.titulo}: ` : ''}${plano(d.ecuacion)}. ${(d.filas || []).map(f => `${f.et}: ${c1} ${f.oculto === 'izq' ? '?' : plano(f.izq)}, ${c2} ${f.oculto === 'der' ? '?' : plano(f.der)}${f.igual === true ? ', iguales' : f.igual === false ? ', distintos' : ''}`).join('; ')}.`;
    }
    return `${NOMBRE_OBJ[d.objeto]}${d.etiqueta ? `, con la etiqueta ${d.etiqueta}` : ''}${d.nombre ? ` (${d.nombre})` : ''}. Dibujo de prueba.`;
  }
  const dibujar = (d, estado) => (d.vista === 'inventario' ? dibujarInventario(d, estado) : dibujarObjeto(d));
  const geometria = d => (d.vista === 'inventario' ? geometriaInventario(d) : geometriaObjeto(d));
  return { id: 'quim-reaccion', dibujar, alt, geometria, constantes: { W, M, ALTO_OBJ, FILA }, OBJETOS: Object.keys(OBJETOS) };
});
