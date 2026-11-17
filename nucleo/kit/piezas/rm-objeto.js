/*
 * Pieza «rm-objeto» (17 nov 2026): objetos de razonamiento deductivo dibujados por la sesión como prueba
 * (data-prueba; Gerson decide después cuáles reemplaza, docs/plan-calidad.md M4), con el cuadro de doble entrada al
 * lado. La usa la teoría de «Razonamiento deductivo» (contenido/teoria/razonamiento-matematico/razonamiento-deductivo.js).
 *
 * Escena «campeonato» (idea 1, «El cuadro que descarta»): tres amigos inscritos en el campeonato del aniversario del
 * colegio, con sus fichas de inscripción en blanco, y en la banca una pelota de fútbol, una de vóley y un tablero de
 * ajedrez. Cuando una casilla es segura, la cosa pasa de la banca a la mano de su dueño.
 *
 * Escena «comparsa» (idea 2, «Pistas que cruzan dos listas»): los tres músicos de la comparsa del colegio bajan de la
 * combi; en la parrilla del techo van una quena, un charango y un bombo. Cuando se sabe qué toca uno, su instrumento pasa
 * de la parrilla a su mano. Va con el cuadro en L (datos.listas): personas × primera lista, personas × segunda lista y,
 * abajo, segunda lista × primera lista, el cuadro donde va una pista que no nombra a nadie. Con tres listas, el cuadro
 * sigue en escalera (personas × A, B, C; C × A, B; B × A).
 *
 * Afirmación de la figura: cada casilla del cuadro es «esta persona hace esto»; cada columna del panel de repartos es
 * una manera de cumplir todo, alineada con las filas del cuadro. Una ✓ sale donde todos los repartos que quedan
 * coinciden: la fila se enmarca en el panel y la cosa pasa a la mano de su dueño.
 *
 * Papeles de color (paleta de deducción, fija en la pieza: quien llama no elige el color, solo el papel):
 *   ✓ seguro ................ violeta (f)
 *   ✗ descartado ............ gris: tinta al 55 % (3,5:1 en claro y 5,0:1 en oscuro contra la tarjeta, como marca)
 *   reparto descartado ...... gris (tinta al 55 %) y una raya que lo tacha
 *   personas, cosas, filas, columnas y pistas ... tinta
 *   pista nueva ............. negrita, y su ✗ con un marco discontinuo de tinta (no el color de marca: una pieza no lo usa)
 *   rejilla, marcos y cartel ........ data-caja="si": contienen rótulos a propósito (las pruebas no los cuentan como choque)
 * Ni verde ni carmín. ✓ y ✗ se distinguen por la forma, no solo por el color (WCAG 1.4.1). PAPELES lo exporta para las
 * pruebas de la unidad.
 *
 * datos = {
 *   escena: 'campeonato' | 'comparsa' | undefined,      el dibujo de prueba encima del cuadro (sin escena, solo el cuadro)
 *   cuadro: false,                          solo la escena, sin cuadro (la primera tarjeta de «Lee»)
 *   filas: ['Ana', 'Beto', 'Ciro'],         las personas (una fila cada una)
 *   columnas: ['fútbol', 'vóley', 'ajedrez'],   lo que se reparte (una columna cada cosa); el texto de la cabecera
 *   iconos: ['futbol', 'voley', 'ajedrez'], opcional: el dibujo de cada cosa en la cabecera y en el panel de repartos
 *   marcas: { 'f,c': 'si' | 'no' | { m: 'si' | 'no', nueva, desde, hasta } },   ✓ seguro y ✗ descartado
 *   repartos: [{ a: [columna de cada fila], fuera: true | n }],   opcional (con iconos): el panel de repartos; fuera: n,
 *            tachado desde el corte n
 *   pistas: [{ t, nueva, desde }], lineas: n,   opcional: las pistas bajo el cuadro (se reservan n renglones)
 *   manos: [{ f, c, desde }],               en la escena: la cosa c ya está en la mano de la persona f
 *   toques: { 'f,c': 'control' },           zonas tocables: tocar la casilla pasa ese control a su opción siguiente
 *   nota: 'texto' | [{ t, desde }],         opcional: una línea al final (se reserva aunque no se vea)
 *   ancho: 76                               ancho máximo de casilla sin iconos (por defecto 76)
 * }
 * Cuadro en L (en lugar de filas y columnas):
 *   personas: ['Ana', 'Beto', 'Ciro'],
 *   listas: [{ nombre: 'instrumento', items: ['quena', 'charango', 'bombo'] }, { nombre: 'ciudad', items: [...] }],
 *            (2 o 3 listas, cada una con tantos items como personas; los nombres de las columnas van girados)
 *   marcas: { 'p:1|0:2': ✓ o ✗ }      casilla: persona 1 y item 2 de la lista 0; '1:0|0:2', item 0 de la lista 1 y
 *            item 2 de la lista 0 (clave(a, b) arma la clave en el orden de la figura)
 *   manos: [{ f, c, desde }]            en la comparsa: el instrumento c (lista 0) en la mano de la persona f
 *   pistas, lineas, nota                igual que arriba
 * estado = { corte: 0..n }: se ve lo que tiene desde ≤ corte (y hasta ≥ corte). El alto no cambia con el estado.
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
  const W = 320, M = 4, ESC = 100, RH = 36, HC_ICONO = 46, HC_TEXTO = 30, LINEA = 20, COL_R = 18, TENUE = 0.55;
  const PAPELES = { seguro: 'f', descartado: 'tenue', amarra: 'tinta', nueva: 'tinta' };
  const n = T.n;
  const ve = (x, corte) => !x || typeof x !== 'object' || ((x.desde || 0) <= corte && (x.hasta === undefined || corte <= x.hasta));
  const marcaDe = x => (typeof x === 'string' ? { m: x } : x || null);
  const tinta = (g = 2) => `fill="none" stroke="currentColor" stroke-width="${g}" stroke-linecap="round" stroke-linejoin="round"`;
  const CAJA = ' data-caja="si"';

  // ---------- Iconos: la misma figura en la banca (o la parrilla), en la mano, en la cabecera y en el panel ----------
  function icono(nombre, cx, cy, s) {
    const r = s / 2, g = s > 14 ? 2 : 1.5;
    if (nombre === 'ajedrez') {
      const x0 = cx - r, y0 = cy - r, k = s / 4;
      let o = '';
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) if ((i + j) % 2) o += `<rect x="${n(x0 + i * k)}" y="${n(y0 + j * k)}" width="${n(k)}" height="${n(k)}" fill="currentColor" fill-opacity="0.75"/>`;
      return `<g data-icono="ajedrez"><rect x="${n(x0)}" y="${n(y0)}" width="${n(s)}" height="${n(s)}" rx="1.5" fill="var(--card)" ${tinta(g).replace('fill="none" ', '')}/>${o}</g>`;
    }
    if (nombre === 'quena') {
      // Un tubo de caña apenas inclinado, con sus agujeros.
      const x1 = cx - s * 0.12, y1 = cy + r, x2 = cx + s * 0.12, y2 = cy - r, w = Math.max(3, s * 0.24);
      let o = `<line x1="${n(x1)}" y1="${n(y1 - w / 2)}" x2="${n(x2)}" y2="${n(y2 + w / 2)}" stroke="currentColor" stroke-width="${n(w)}" stroke-linecap="round"/>`;
      for (const t of [0.3, 0.48, 0.66]) o += `<circle cx="${n(x1 + (x2 - x1) * t)}" cy="${n(y1 - w / 2 + (y2 - y1 + w) * t)}" r="${n(Math.max(0.8, s * 0.055))}" fill="var(--card)"/>`;
      return `<g data-icono="quena">${o}</g>`;
    }
    if (nombre === 'charango') {
      // Caja de dos lóbulos, la boca y el mástil con su clavijero.
      const yb = cy + s * 0.24, yt = cy + s * 0.02;
      let o = `<line x1="${n(cx)}" y1="${n(yt)}" x2="${n(cx)}" y2="${n(cy - r + s * 0.12)}" stroke="currentColor" stroke-width="${n(g * 1.2)}" stroke-linecap="round"/>`;
      o += `<rect x="${n(cx - s * 0.1)}" y="${n(cy - r)}" width="${n(s * 0.2)}" height="${n(s * 0.16)}" rx="1" fill="currentColor"/>`;
      o += `<circle cx="${n(cx)}" cy="${n(yb)}" r="${n(s * 0.26)}" fill="var(--card)" stroke="currentColor" stroke-width="${g}"/>`;
      o += `<circle cx="${n(cx)}" cy="${n(yt)}" r="${n(s * 0.19)}" fill="var(--card)" stroke="currentColor" stroke-width="${g}"/>`;
      o += `<circle cx="${n(cx)}" cy="${n(yb - s * 0.04)}" r="${n(s * 0.08)}" fill="currentColor"/>`;
      return `<g data-icono="charango">${o}</g>`;
    }
    if (nombre === 'bombo') {
      // Tambor visto de lado: el cuerpo, la boca de arriba y la cuerda en zigzag.
      const w = s, h = s * 0.62, x0 = cx - w / 2, y0 = cy - h / 2 + s * 0.08;
      let o = `<rect x="${n(x0)}" y="${n(y0)}" width="${n(w)}" height="${n(h)}" rx="2" fill="var(--card)" stroke="currentColor" stroke-width="${g}"/>`;
      o += `<ellipse cx="${n(cx)}" cy="${n(y0)}" rx="${n(w / 2)}" ry="${n(s * 0.14)}" fill="var(--card)" stroke="currentColor" stroke-width="${g}"/>`;
      const zz = [0, 1, 2, 3, 4].map(k => `${n(x0 + w * (0.1 + 0.2 * k))} ${n(k % 2 ? y0 + h - 1.5 : y0 + s * 0.16)}`);
      o += `<path d="M${zz.join('L')}" ${tinta(Math.max(1, g * 0.6))}/>`;
      return `<g data-icono="bombo">${o}</g>`;
    }
    let o = `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="var(--card)" stroke="currentColor" stroke-width="${g}"/>`;
    if (nombre === 'futbol') {
      // El pentágono negro del centro y cinco costuras hacia el borde.
      const p = Array.from({ length: 5 }, (_, k) => { const a = -Math.PI / 2 + k * 2 * Math.PI / 5; return [cx + r * 0.38 * Math.cos(a), cy + r * 0.38 * Math.sin(a), a]; });
      o += `<path d="M${p.map(q => `${n(q[0])} ${n(q[1])}`).join('L')}Z" fill="currentColor"/>`;
      for (const [x, y, a] of p) o += `<line x1="${n(x)}" y1="${n(y)}" x2="${n(cx + r * 0.7 * Math.cos(a))}" y2="${n(cy + r * 0.7 * Math.sin(a))}" stroke="currentColor" stroke-width="${g * 0.75}" stroke-linecap="round"/>`;
      // Los parches negros del borde, entre costura y costura: así se lee pelota de fútbol y no estrella.
      for (const [, , a] of p) {
        const b = a + Math.PI / 5, q = t => `${n(cx + r * 0.92 * Math.cos(b + t))} ${n(cy + r * 0.92 * Math.sin(b + t))}`;
        o += `<path d="M${q(-0.42)}L${n(cx + r * 0.62 * Math.cos(b))} ${n(cy + r * 0.62 * Math.sin(b))}L${q(0.42)}Z" fill="currentColor"/>`;
      }
      return `<g data-icono="futbol">${o}</g>`;
    }
    // Vóley: tres costuras curvas que nacen cerca del centro (sin pentágono: no se confunde con la de fútbol).
    const arco = (a0, a1, rr, barrido) => `<path d="M${n(cx + r * 0.95 * Math.cos(a0))} ${n(cy + r * 0.95 * Math.sin(a0))}A${n(rr)} ${n(rr)} 0 0 ${barrido} ${n(cx + r * 0.95 * Math.cos(a1))} ${n(cy + r * 0.95 * Math.sin(a1))}" ${tinta(g * 0.75)}/>`;
    o += arco(-2.6, 0.5, r * 1.15, 1) + arco(-1.2, 2.0, r * 1.15, 0) + arco(1.9, -0.25, r * 1.6, 1);
    return `<g data-icono="voley">${o}</g>`;
  }

  // ---------- Escenas «campeonato» y «comparsa» ----------
  const BANCA = [30, 79, 128], PARRILLA = [24, 84, 145], NINOS = [190, 240, 290], SUELO = 96;
  function nino(k, x) {
    let s = `<line x1="${n(x - 4)}" y1="80" x2="${n(x - 5)}" y2="${SUELO - 1}" ${tinta()}/><line x1="${n(x + 4)}" y1="80" x2="${n(x + 5)}" y2="${SUELO - 1}" ${tinta()}/>`;
    s += `<line x1="${n(x - 10)}" y1="55" x2="${n(x - 15)}" y2="72" ${tinta()}/><line x1="${n(x + 10)}" y1="55" x2="${n(x + 15)}" y2="72" ${tinta()}/>`;
    s += `<rect x="${n(x - 10)}" y="50" width="20" height="32" rx="7" fill="currentColor" fill-opacity="0.12" stroke="currentColor" stroke-width="2"/>`;
    s += `<circle cx="${n(x)}" cy="39" r="9" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`;
    // Peinados distintos para que se distingan sin color: cola (Ana), pelo corto (Beto), gorra (Ciro).
    if (k === 0) s += `<path d="M${n(x - 9)} 38A9 9 0 0 1 ${n(x + 9)} 38" ${tinta(3)}/><path d="M${n(x + 8)} 35L${n(x + 13)} 46" ${tinta(3)}/>`;
    else if (k === 1) s += `<path d="M${n(x - 9)} 37A9 9 0 0 1 ${n(x + 9)} 37L${n(x - 9)} 37Z" fill="currentColor"/>`;
    else s += `<path d="M${n(x - 9)} 36A9 9 0 0 1 ${n(x + 9)} 36Z" fill="currentColor"/><line x1="${n(x + 4)}" y1="35.5" x2="${n(x + 14)}" y2="35.5" ${tinta(3)}/>`;
    return s;
  }
  // La ficha de inscripción en blanco (campeonato) o la faja de la comparsa cruzada en el pecho.
  const ficha = x => `<rect x="${n(x - 7)}" y="58" width="14" height="16" rx="2" fill="var(--card)" stroke="currentColor" stroke-width="1.5"/>`
    + `<line x1="${n(x - 4)}" y1="63" x2="${n(x + 4)}" y2="63" stroke="currentColor" stroke-width="1" stroke-opacity="0.6"/><line x1="${n(x - 4)}" y1="68" x2="${n(x + 4)}" y2="68" stroke="currentColor" stroke-width="1" stroke-opacity="0.6"/>`;
  const faja = x => `<line x1="${n(x - 8)}" y1="53" x2="${n(x + 8)}" y2="78" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-opacity="0.55"/>`;
  function combi() {
    // Carrocería con su letrero, ventanas, ruedas y la parrilla del techo.
    let s = `<rect${CAJA} x="10" y="52" width="146" height="34" rx="8" fill="currentColor" fill-opacity="0.08" stroke="currentColor" stroke-width="2"/>`;
    for (const x of [18, 50, 82]) s += `<rect x="${x}" y="56" width="26" height="8" rx="2" fill="var(--card)" stroke="currentColor" stroke-width="1.5"/>`;
    s += `<rect x="126" y="56" width="24" height="8" rx="2" fill="var(--card)" stroke="currentColor" stroke-width="1.5"/>`;
    s += T.rotulo(70, 80, 'Comparsa', { ancla: 'middle', peso: 700, tam: 14 });
    for (const x of [28, 136]) s += `<circle cx="${x}" cy="88" r="7" fill="var(--card)" stroke="currentColor" stroke-width="2"/><circle cx="${x}" cy="88" r="2.5" fill="currentColor"/>`;
    s += `<line x1="16" y1="46" x2="150" y2="46" ${tinta()}/><line x1="22" y1="46" x2="22" y2="52" ${tinta()}/><line x1="144" y1="46" x2="144" y2="52" ${tinta()}/>`;
    return s;
  }
  function escena(d, corte) {
    const comp = d.escena === 'comparsa';
    const iconos = comp ? ['quena', 'charango', 'bombo'] : d.iconos || ['futbol', 'voley', 'ajedrez'];
    const nombres = comp ? d.listas[0].items : d.columnas || [];
    const quienes = comp ? d.personas : d.filas || [];
    const enMano = {};
    for (const x of d.manos || []) if (ve(x, corte)) enMano[x.c] = x.f;
    let s = '';
    if (comp) s += combi();
    else {
      s += T.rotulo(M + 4, 20, 'Campeonato', { peso: 700, tam: 14 });
      // La banca con las tres cosas; si una ya tiene dueño, en su lugar queda un hueco punteado.
      s += `<rect x="8" y="76" width="142" height="6" rx="3" fill="currentColor" fill-opacity="0.15" stroke="currentColor" stroke-width="2"/>`;
      s += `<line x1="16" y1="82" x2="16" y2="${SUELO}" ${tinta()}/><line x1="142" y1="82" x2="142" y2="${SUELO}" ${tinta()}/>`;
    }
    const lugares = comp ? PARRILLA : BANCA, yIc = comp ? 36 : 66, yNom = comp ? 20 : 52;
    lugares.forEach((x, c) => {
      if (c >= iconos.length) return;
      s += T.rotulo(x, yNom, nombres[c] || '', { ancla: 'middle', tam: 14, min: M, max: comp ? 168 : 160 });
      if (enMano[c] !== undefined) s += `<circle cx="${n(x)}" cy="${yIc}" r="${comp ? 10 : 9}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3" stroke-opacity="0.6"/>`;
      else s += icono(iconos[c], x, yIc, comp ? 21 : 18);
    });
    s += `<line x1="5" y1="${SUELO}" x2="${W - 5}" y2="${SUELO}" stroke="currentColor" stroke-width="1" stroke-opacity="0.45"/>`;
    NINOS.forEach((x, f) => {
      if (f >= quienes.length) return;
      s += T.rotulo(x, 20, quienes[f], { ancla: 'middle', peso: 700, min: 166, max: W - M });
      s += nino(f, x) + (comp ? faja(x) : ficha(x));
      const c = Object.keys(enMano).find(k => enMano[k] === f);
      if (c !== undefined) s += icono(iconos[+c], x + 16, 74, 14);
    });
    return `<g class="kit-objeto" data-objeto="${comp ? 'comparsa' : 'campeonato'}" data-prueba="si">${s}</g>`;
  }

  // ---------- Geometría del cuadro ----------
  function geometria(d) {
    const nf = (d.filas || []).length, nc = (d.columnas || []).length, nr = d.iconos && d.repartos ? d.repartos.length : 0;
    const cab = Math.max(44, ...(d.filas || []).map(f => T.ancho(f, 16, 700) + 14));
    const panel = nr ? nr * COL_R + 12 : 0;
    const cw = d.iconos ? 46 : Math.min(d.ancho || 76, (W - 2 * M - 2 - cab - panel) / Math.max(1, nc));
    const libre = W - 2 * M - cab - cw * nc - panel;
    const x0 = M + cab + (panel ? 0 : Math.max(0, libre / 2));
    const yE = d.escena ? ESC : 0;
    const hc = d.iconos ? HC_ICONO : HC_TEXTO;
    const yC = yE + M, y0 = yC + hc;
    const xR = x0 + cw * nc + 12;
    const yP = y0 + nf * RH + 8;
    const lineas = d.pistas ? Math.max(d.lineas || 0, renglones(d.pistas).length, 1) : 0;
    const yN = yP + lineas * LINEA;
    const nota = d.nota !== undefined ? LINEA + 4 : 0;
    return { nf, nc, nr, cab, cw, x0, yC, y0, hc, xR, yP, yN, lineas, alto: Math.ceil(yN + nota + M + 2),
      centro: (f, c) => ({ x: x0 + (c + 0.5) * cw, y: y0 + (f + 0.5) * RH }) };
  }
  // Las pistas, partidas en renglones que caben en el ancho (cada pista conserva su número y su «nueva»).
  function renglones(pistas) {
    const out = [];
    (pistas || []).forEach((p, k) => {
      const ps = `${k + 1}. ${p.t}`.split(' ');
      let linea = '';
      for (const w of ps) {
        const prueba = linea ? `${linea} ${w}` : w;
        if (T.ancho(prueba, 14, p.nueva ? 700 : 400) > W - 2 * M - 8 && linea) { out.push({ t: linea, p }); linea = `    ${w}`; } else linea = prueba;
      }
      out.push({ t: linea, p });
    });
    return out;
  }

  function marca(cx, cy, m) {
    if (m.m === 'si') return `<path data-marca="si" d="M${n(cx - 8)} ${n(cy)}L${n(cx - 2)} ${n(cy + 7)}L${n(cx + 9)} ${n(cy - 8)}" fill="none" stroke="var(--c-${PAPELES.seguro})" stroke-width="${T.GROSOR.variable}" stroke-linecap="round" stroke-linejoin="round"/>`;
    return `<g data-marca="no" opacity="${TENUE}"><line x1="${n(cx - 7)}" y1="${n(cy - 7)}" x2="${n(cx + 7)}" y2="${n(cy + 7)}" stroke="currentColor" stroke-width="${T.GROSOR.variable}" stroke-linecap="round"/><line x1="${n(cx + 7)}" y1="${n(cy - 7)}" x2="${n(cx - 7)}" y2="${n(cy + 7)}" stroke="currentColor" stroke-width="${T.GROSOR.variable}" stroke-linecap="round"/></g>`;
  }
  const celda = (x, y, w, h) => `<rect${CAJA} x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" fill="var(--card)" stroke="currentColor" stroke-opacity="0.45" stroke-width="${T.GROSOR.cuadricula}"/>`;
  const marcoNueva = (x, y, w, h) => `<rect${CAJA} data-nueva="si" x="${n(x + 3)}" y="${n(y + 3)}" width="${n(w - 6)}" height="${n(h - 6)}" rx="4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3"/>`;

  function cuadro(d, g, corte) {
    let s = '';
    const marcas = {};
    for (const [k, x] of Object.entries(d.marcas || {})) { const m = marcaDe(x); if (m && ve(m, corte)) marcas[k] = m; }
    // Cabeceras: con iconos, el dibujo de la cosa y su nombre debajo; sin iconos, el nombre.
    (d.columnas || []).forEach((t, c) => {
      const cx = g.x0 + (c + 0.5) * g.cw;
      if (d.iconos) { s += icono(d.iconos[c], cx, g.yC + 12, 20); s += T.rotulo(cx, g.yC + 40, t, { ancla: 'middle', tam: 14, min: g.x0 + c * g.cw - 6, max: g.x0 + (c + 1) * g.cw + 6 }); }
      else {
        // Los nombres en 16 si todos caben en su columna; si no, todos en 14 (quien llama tiene que darlos para 14).
        const tam = (d.columnas || []).every(x => T.ancho(x, 16, 700) <= g.cw - 4) ? 16 : 14;
        s += T.rotulo(cx, g.yC + 20, t, { ancla: 'middle', peso: 700, tam, min: g.x0 + c * g.cw - 2, max: g.x0 + (c + 1) * g.cw + 2 });
      }
    });
    (d.filas || []).forEach((t, f) => { s += T.rotulo(g.x0 - 8, g.y0 + f * RH + RH / 2 + 6, t, { ancla: 'end', peso: 700, min: M }); });
    let rej = '';
    for (let f = 0; f < g.nf; f++) for (let c = 0; c < g.nc; c++) rej += celda(g.x0 + c * g.cw, g.y0 + f * RH, g.cw, RH);
    s += `<g class="kit-cuadricula">${rej}</g>`;
    for (const [k, m] of Object.entries(marcas)) {
      const [f, c] = k.split(',').map(Number);
      if (!(f < g.nf && c < g.nc)) continue;
      const p = g.centro(f, c);
      s += `<g class="kit-aparece">${marca(p.x, p.y, m)}${m.nueva ? marcoNueva(g.x0 + c * g.cw, g.y0 + f * RH, g.cw, RH) : ''}</g>`;
    }
    // Zonas tocables (gesto directo, Gerson 17 nov): tocar la casilla pasa su control a la opción siguiente.
    for (const [k, ctl] of Object.entries(d.toques || {})) {
      const [f, c] = k.split(',').map(Number);
      if (!(f < g.nf && c < g.nc)) continue;
      s += `<rect class="rm-toque" data-toque="${T.esc(ctl)}" x="${n(g.x0 + c * g.cw)}" y="${n(g.y0 + f * RH)}" width="${n(g.cw)}" height="${RH}" fill="transparent"><title>${T.esc(`${d.filas[f]} y ${d.columnas[c]}: tocar para marcar`)}</title></rect>`;
    }
    return { s, marcas };
  }

  // El panel de repartos: una columna por reparto, con la cosa de cada persona en su fila (alineada con el cuadro).
  function panel(d, g, corte, marcas) {
    if (!g.nr) return '';
    const ancho = g.nr * COL_R;
    let s = T.rotulo(g.xR + ancho / 2, g.yC + 18, 'Repartos', { ancla: 'middle', peso: 700, tam: 14, min: g.xR - 4, max: W - M });
    d.repartos.forEach((r, k) => {
      const x = g.xR + k * COL_R, cx = x + COL_R / 2;
      const fuera = r.fuera === true || (typeof r.fuera === 'number' && corte >= r.fuera);
      s += T.rotulo(cx, g.yC + 40, String(k + 1), { ancla: 'middle', tam: 14, min: x - 2, max: x + COL_R + 2 });
      let c = `<rect${CAJA} x="${n(x + 1)}" y="${n(g.y0)}" width="${COL_R - 2}" height="${g.nf * RH}" rx="4" fill="none" stroke="currentColor" stroke-opacity="0.3" stroke-width="1"/>`;
      r.a.forEach((col, f) => { c += icono(d.iconos[col], cx, g.y0 + (f + 0.5) * RH, 13); });
      if (fuera) c += `<line x1="${n(x + 3)}" y1="${n(g.y0 + 4)}" x2="${n(x + COL_R - 3)}" y2="${n(g.y0 + g.nf * RH - 4)}" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
      s += `<g data-reparto="${fuera ? 'fuera' : 'queda'}"${fuera ? ` opacity="${TENUE}"` : ''}>${c}</g>`;
    });
    // Una ✓ a la vista: su fila se enmarca en violeta en el panel (ahí se ve que todos los que quedan coinciden).
    const filas = new Set(Object.entries(marcas).filter(([, m]) => m.m === 'si').map(([k]) => +k.split(',')[0]));
    for (const f of filas) s += `<rect${CAJA} data-marca="fila-segura" x="${n(g.xR - 2)}" y="${n(g.y0 + f * RH + 2)}" width="${n(ancho + 4)}" height="${RH - 4}" rx="6" fill="none" stroke="var(--c-${PAPELES.seguro})" stroke-width="2"/>`;
    return s;
  }

  // ---------- Cuadro en L (dos o tres listas) ----------
  // Grupos de columnas: las listas 0..m−1. Grupos de filas: las personas y después las listas m−1, …, 1. El bloque
  // (fila r, columna c) existe si r = 0 o c < m − r: así cada par de listas tiene un solo cuadro.
  const GAP = 6;
  const clave = (a, b) => {
    // a y b: 'p:i' o 'L:i'. La persona va siempre en la fila; entre dos listas, la de número mayor.
    const [ga, gb] = [a, b].map(x => x.split(':')[0]);
    if (gb === 'p' || (ga !== 'p' && +gb > +ga)) return `${b}|${a}`;
    return `${a}|${b}`;
  };
  function geometriaL(d) {
    const k = d.personas.length, m = d.listas.length;
    const filas = [{ g: 'p', items: d.personas }].concat(Array.from({ length: m - 1 }, (_, j) => ({ g: String(m - 1 - j), items: d.listas[m - 1 - j].items })));
    const etq = filas.flatMap(f => f.items);
    const tamF = etq.every(t => T.ancho(t, 16, 700) <= 64) ? 16 : 14;
    const cab = Math.max(40, ...etq.map(t => T.ancho(t, tamF, 700) + 10));
    const cw = Math.min(40, (W - 2 * M - 2 - cab - GAP * (m - 1)) / (m * k));
    const rh = Math.min(32, Math.max(26, cw));
    const hc = Math.max(40, ...d.listas.flatMap(l => l.items).map(t => T.ancho(t, 14, 700) + 10));
    const ancho = cab + m * k * cw + GAP * (m - 1);
    const x0 = M + cab + Math.max(0, (W - 2 * M - 2 - ancho) / 2);
    const yE = d.escena ? ESC : 0, yC = yE + M, y0 = yC + hc;
    const colX = (gc, c) => x0 + gc * (k * cw + GAP) + c * cw;
    const filaY = (gr, f) => y0 + gr * (k * rh + GAP) + f * rh;
    const altoGrid = filas.length * k * rh + GAP * (filas.length - 1);
    const yP = y0 + altoGrid + 8;
    const lineas = d.pistas ? Math.max(d.lineas || 0, renglones(d.pistas).length, 1) : 0;
    const yN = yP + lineas * LINEA;
    const nota = d.nota !== undefined ? LINEA + 4 : 0;
    // Dónde va cada clave: el bloque (fila, columna) y la casilla.
    const lugar = key => {
      const [a, b] = key.split('|'), [ga, ia] = a.split(':'), [gb, ib] = b.split(':');
      const gr = filas.findIndex(f => f.g === ga), gc = +gb;
      if (gr < 0 || !(gc >= 0 && gc < m) || !(gr === 0 || gc < m - gr)) return null;
      return { x: colX(gc, +ib), y: filaY(gr, +ia), gr, gc };
    };
    return { k, m, filas, tamF, cab, cw, rh, hc, x0, yC, y0, colX, filaY, yP, yN, lineas, lugar, alto: Math.ceil(yN + nota + M + 2) };
  }
  function cuadroL(d, g, corte) {
    let s = '';
    // Nombres de las columnas, girados (suben desde la rejilla); nombres de las filas a la izquierda.
    d.listas.forEach((l, gc) => l.items.forEach((t, c) => {
      const x = g.colX(gc, c) + g.cw / 2 + 4.5, y = g.y0 - 6;
      s += `<text class="kit-txt" x="${n(x)}" y="${n(y)}" fill="currentColor" font-size="14" font-weight="700" transform="rotate(-90 ${n(x)} ${n(y)})">${T.esc(t)}</text>`;
    }));
    g.filas.forEach((fg, gr) => fg.items.forEach((t, f) => { s += T.rotulo(g.x0 - 7, g.filaY(gr, f) + g.rh / 2 + (g.tamF === 16 ? 6 : 5), t, { ancla: 'end', peso: 700, tam: g.tamF, min: M }); }));
    let rej = '';
    g.filas.forEach((fg, gr) => { for (let gc = 0; gc < g.m; gc++) {
      if (!(gr === 0 || gc < g.m - gr)) continue;
      for (let f = 0; f < g.k; f++) for (let c = 0; c < g.k; c++) rej += celda(g.colX(gc, c), g.filaY(gr, f), g.cw, g.rh);
      rej += `<rect${CAJA} x="${n(g.colX(gc, 0))}" y="${n(g.filaY(gr, 0))}" width="${n(g.k * g.cw)}" height="${n(g.k * g.rh)}" fill="none" stroke="currentColor" stroke-width="2"/>`;
    } });
    s += `<g class="kit-cuadricula">${rej}</g>`;
    for (const [key, x] of Object.entries(d.marcas || {})) {
      const m = marcaDe(x), L = g.lugar(key);
      if (!m || !L || !ve(m, corte)) continue;
      s += `<g class="kit-aparece">${marca(L.x + g.cw / 2, L.y + g.rh / 2, m)}${m.nueva ? marcoNueva(L.x, L.y, g.cw, g.rh) : ''}</g>`;
    }
    return s;
  }

  function pistasYNota(d, g, corte) {
    let s = '';
    const vistas = (d.pistas || []).filter(p => ve(p, corte));
    // Sin pistas todavía: el renglón lo dice (si no, el espacio reservado parece un hueco).
    if (d.pistas && !vistas.length && g.lineas) s += T.rotulo(M + 4, g.yP + 15, 'Todavía no hay pistas.', { tam: 14 });
    renglones(vistas).forEach((r, k) => {
      s += T.rotulo(M + 4, g.yP + k * LINEA + 15, r.t, { tam: 14, peso: r.p.nueva ? 700 : 400, clase: 'kit-aparece', min: M, max: W - M });
    });
    if (d.nota !== undefined) {
      const notas = (Array.isArray(d.nota) ? d.nota : [{ t: d.nota }]).filter(x => ve(x, corte));
      const t = notas.length ? notas[notas.length - 1].t : '';
      if (t) s += T.rotulo(W / 2, g.yN + 17, t, { ancla: 'middle', peso: 700, tam: 14 });
    }
    return s;
  }

  function dibujar(d, e = {}) {
    const corte = e.corte || 0;
    let s = d.escena ? escena(d, corte) : '';
    if (d.cuadro === false) return T.svg(W, ESC + M, s, { alt: alt(d) });
    if (d.listas) {
      const g = geometriaL(d);
      s += cuadroL(d, g, corte) + pistasYNota(d, g, corte);
      return T.svg(W, g.alto, s, { alt: alt(d) });
    }
    const g = geometria(d);
    const q = cuadro(d, g, corte);
    s += q.s + panel(d, g, corte, q.marcas) + pistasYNota(d, g, corte);
    return T.svg(W, g.alto, s, { alt: alt(d) });
  }

  function alt(d) {
    const partes = [];
    if (d.escena === 'campeonato') partes.push(`Campeonato del colegio: ${lista(d.filas || [])}, con sus fichas de inscripción en blanco, y en la banca ${lista(d.columnas || [])}`);
    if (d.escena === 'comparsa') partes.push(`Comparsa del colegio: ${lista(d.personas || [])} bajan de la combi; en la parrilla del techo van ${lista(d.listas[0].items)}`);
    if (d.cuadro === false) return partes.join('. ') + '.';
    const marcas = Object.entries(d.marcas || {});
    if (d.listas) {
      const nom = key => key.split('|').map(x => { const [gq, i] = x.split(':'); return gq === 'p' ? d.personas[+i] : d.listas[+gq].items[+i]; }).join(' y ');
      const ms = marcas.map(([k, x]) => `${nom(k)}: ${marcaDe(x).m === 'si' ? 'seguro' : 'descartado'}`);
      const pares = [`personas y ${d.listas.map(l => l.nombre).join(', personas y ')}`];
      for (let a = d.listas.length - 1; a > 0; a--) for (let b = 0; b < a; b++) pares.push(`${d.listas[a].nombre} y ${d.listas[b].nombre}`);
      partes.push(`Cuadro de doble entrada en escalera: ${pares.join('; ')}${ms.length ? `. Marcas: ${ms.join('; ')}` : ', sin marcas'}`);
    } else {
      const ms = marcas.map(([k, x]) => { const m = marcaDe(x), [f, c] = k.split(',').map(Number); return `${(d.filas || [])[f]} y ${(d.columnas || [])[c]}: ${m.m === 'si' ? 'seguro' : 'descartado'}`; });
      partes.push(`Cuadro de doble entrada con ${(d.filas || []).length} filas (${lista(d.filas || [])}) y ${(d.columnas || []).length} columnas (${lista(d.columnas || [])})${ms.length ? `: ${ms.join('; ')}` : ', sin marcas'}`);
      if (d.iconos && d.repartos) {
        const quedan = d.repartos.filter(r => r.fuera !== true && typeof r.fuera !== 'number').length;
        partes.push(`${d.repartos.length} repartos posibles en columnas${quedan < d.repartos.length ? `; sin tachar, ${quedan}` : ''}`);
      }
    }
    if (d.pistas && d.pistas.length) partes.push(`Pistas: ${d.pistas.map(p => p.t).join(' ')}`);
    return partes.join('. ') + '.';
  }
  const lista = xs => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}` : xs.join(''));

  return { id: 'rm-objeto', dibujar, alt, geometria, geometriaL, clave, PAPELES, constantes: { W, ESC, RH, COL_R, TENUE } };
});
