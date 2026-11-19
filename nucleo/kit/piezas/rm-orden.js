/*
 * Pieza «rm-orden» (19 nov 2026): objetos de ordenamiento de información dibujados por la sesión como prueba
 * (data-prueba; Gerson decide después cuáles reemplaza, docs/plan-calidad.md M4), con la lista de órdenes debajo. La usa
 * la teoría de «Ordenamiento de información» (contenido/teoria/razonamiento-matematico/ordenamiento-de-informacion.js).
 *
 * Escena «banca» (idea 1, «Ordenar en una fila»): la banca frente a la cancha del campeonato del colegio, vista desde
 * atrás. Quien ya tiene puesto está sentado, de espaldas (mira la cancha, igual que el alumno: su izquierda es la del
 * dibujo); quien todavía no, espera de pie a la izquierda. Bajo la banca va el número de cada puesto.
 *
 * Afirmación de la figura: cada lugar de la banca es un puesto, y cada renglón de «Orden» es una manera de sentar a
 * todos, alineada con los puestos. Un puesto es seguro cuando todos los órdenes que quedan tienen ahí a la misma persona:
 * esa casilla se enmarca y esa persona pasa a sentarse.
 *
 * Papeles de color (paleta de deducción de la rama Lógica, fija en la pieza: quien llama dice el papel, no el color):
 *   seguro .................. violeta (f): la casilla que coincide en todos los órdenes que quedan y el nombre de quien
 *                             se sienta por deducción
 *   orden descartado ........ gris (tinta al 55 %) y una raya que lo tacha (data-tacha: cruza su renglón a propósito)
 *   posible ................. tinta, con marco discontinuo (la regla: dónde puede ir alguien)
 *   personas, puestos, pistas y lo que da un dato ... tinta
 *   rejilla y marcos ........ data-caja="si": contienen rótulos a propósito (las pruebas no los cuentan como choque)
 * Ni verde ni carmín, ni naranja ni turquesa (entran recién en las mesas). Lo seguro y lo descartado se distinguen por la
 * forma (marco contra raya), no solo por el color (WCAG 1.4.1). PAPELES lo exporta para las pruebas de la unidad.
 *
 * datos = {
 *   escena: 'banca' | undefined,     el dibujo de prueba (sin escena, la tira de puestos)
 *   panel: false,                    solo la escena, sin órdenes ni pistas (la primera tarjeta de «Lee»)
 *   puestos: 4,                      cuántos puestos tiene la fila (de 3 a 6; con escena, hasta 5)
 *   nombres: ['Ana', 'Beto', …],     las personas del problema (el peinado de cada una sale de su lugar en esta lista)
 *   sentados: [{ p, t, seguro, desde }],   con escena: t ocupa el puesto p (desde 0); seguro: se dedujo (nombre violeta)
 *   fila: [null | 'Leo' | { t, seguro, posible }],   sin escena: lo que cada pista pone por sí sola en la tira de puestos
 *   ordenes: [{ a: ['Ana', { t: 'Ciro', seguro: true | n }, …], fuera: true | n, desde: n }],   la lista de órdenes;
 *            fuera: tachado (desde el corte n); desde: el renglón aparece en el corte n; seguro: casilla violeta
 *   fijos: [{ c, desde }],           columnas que coinciden en todos los órdenes sin tachar: sus casillas van en violeta
 *   pistas: [{ t, nueva, desde }], lineas: n,   las pistas bajo la figura (se reservan n renglones)
 *   nota: 'texto' | [{ t, desde }],  una línea al final (se reserva aunque no se vea)
 *   tiras: [{ rotulo, celdas: [null | 'Ana' | { t, posible } | { t, seguro }] }], titulo: 'texto'
 *            en lugar de todo lo demás: varias tiras de puestos para comparar (la figura de «La regla»)
 * }
 * estado = { corte: 0..n }: se ve lo que tiene desde ≤ corte. El alto no cambia con el estado.
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
  const W = 320, M = 4, ESC = 108, SW = 40, PASO = 34, RH = 24, LINEA = 20, TENUE = 0.55, SUELO = 90;
  const PAPELES = { seguro: 'f', descartado: 'tenue', amarra: 'tinta', posible: 'tinta' };
  const n = T.n;
  const ve = (x, corte) => !x || typeof x !== 'object' || (x.desde || 0) <= corte;
  const desde = (x, corte) => x === true || (typeof x === 'number' && corte >= x);
  const tinta = (g = 2) => `fill="none" stroke="currentColor" stroke-width="${g}" stroke-linecap="round" stroke-linejoin="round"`;
  const CAJA = ' data-caja="si"';
  const lista = xs => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}` : xs.join(''));
  const celdaDe = x => (x === null || x === undefined || x === '' ? null : typeof x === 'object' ? x : { t: String(x) });

  // ---------- La banca, vista desde atrás ----------
  // El pelo, visto desde atrás, cubre la cabeza: cada persona se distingue por su peinado, sin color.
  function pelo(k, x, y) {
    let s = `<circle cx="${n(x)}" cy="${n(y)}" r="8" fill="currentColor"/>`;
    const v = k % 6;
    if (v === 0) s += `<path d="M${n(x)} ${n(y + 6)}L${n(x + 1)} ${n(y + 19)}" ${tinta(4)}/>`;                       // cola de caballo
    else if (v === 1) s += `<path d="M${n(x - 4.5)} ${n(y + 6.6)}A5.5 5.5 0 0 0 ${n(x + 4.5)} ${n(y + 6.6)}Z" fill="var(--card)"/>`;   // pelo corto: se ve la nuca
    else if (v === 2) s += `<path d="M${n(x - 7.5)} ${n(y + 2.5)}L${n(x + 7.5)} ${n(y + 2.5)}" fill="none" stroke="var(--card)" stroke-width="2"/><circle cx="${n(x)}" cy="${n(y - 8)}" r="1.8" fill="currentColor"/>`;   // gorra
    else if (v === 3) s += `<path d="M${n(x - 6)} ${n(y + 5)}L${n(x - 8)} ${n(y + 18)}" ${tinta(3)}/><path d="M${n(x + 6)} ${n(y + 5)}L${n(x + 8)} ${n(y + 18)}" ${tinta(3)}/>`;   // dos trenzas
    else if (v === 4) s += `<rect x="${n(x - 8)}" y="${n(y)}" width="16" height="11" rx="3" fill="currentColor"/>`;   // melena
    else s += `<path d="M${n(x - 3)} ${n(y - 8)}L${n(x)} ${n(y - 12)}L${n(x + 3)} ${n(y - 8)}Z" fill="currentColor"/>`;   // un mechón parado
    return s;
  }
  // Sentado: cabeza y espalda; el respaldo de la banca se dibuja después, encima.
  const sentado = (k, x) => `<rect x="${n(x - 11)}" y="54" width="22" height="28" rx="8" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`
    + `<rect x="${n(x - 11)}" y="54" width="22" height="28" rx="8" fill="currentColor" fill-opacity="0.12"/>` + pelo(k, x, 44);
  // De pie, esperando: de espaldas también.
  function parado(k, x) {
    let s = `<line x1="${n(x - 4)}" y1="78" x2="${n(x - 5)}" y2="${SUELO - 1}" ${tinta()}/><line x1="${n(x + 4)}" y1="78" x2="${n(x + 5)}" y2="${SUELO - 1}" ${tinta()}/>`;
    s += `<line x1="${n(x - 10)}" y1="57" x2="${n(x - 14)}" y2="73" ${tinta()}/><line x1="${n(x + 10)}" y1="57" x2="${n(x + 14)}" y2="73" ${tinta()}/>`;
    s += `<rect x="${n(x - 10)}" y="52" width="20" height="28" rx="7" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`;
    s += `<rect x="${n(x - 10)}" y="52" width="20" height="28" rx="7" fill="currentColor" fill-opacity="0.12"/>`;
    return s + pelo(k, x, 42);
  }
  // El arco de la cancha, lejos: los dos postes, el travesaño, la red y la pelota en el pasto.
  const arco = (x, y) => `<path d="M${n(x)} ${n(y + 20)}L${n(x)} ${n(y)}L${n(x + 52)} ${n(y)}L${n(x + 52)} ${n(y + 20)}" ${tinta()}/>`
    + [9, 17, 26, 35, 43].map(d => `<line x1="${n(x + d)}" y1="${n(y + 1)}" x2="${n(x + d)}" y2="${n(y + 20)}" stroke="currentColor" stroke-width="1" stroke-opacity="0.45"/>`).join('')
    + [7, 14].map(d => `<line x1="${n(x + 1)}" y1="${n(y + d)}" x2="${n(x + 51)}" y2="${n(y + d)}" stroke="currentColor" stroke-width="1" stroke-opacity="0.45"/>`).join('')
    + `<line x1="${n(x - 12)}" y1="${n(y + 21)}" x2="${n(x + 78)}" y2="${n(y + 21)}" stroke="currentColor" stroke-width="1" stroke-opacity="0.45"/>`
    + `<circle cx="${n(x + 66)}" cy="${n(y + 16)}" r="4.5" fill="var(--card)" stroke="currentColor" stroke-width="1.5"/>`;

  const LEY = 20;
  const hayPosibles = fila => (fila || []).some(x => x && typeof x === 'object' && x.posible);
  // La leyenda de las marcas, bajo la tira: qué quiere decir la línea cortada (y, en la regla, el marco violeta).
  function leyenda(x, y, conSeguro) {
    let s = `<line x1="${n(x)}" y1="${n(y - 5)}" x2="${n(x + 18)}" y2="${n(y - 5)}" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3"/>` + T.rotulo(x + 24, y, 'línea cortada: puede ir ahí', { tam: 14 });
    if (conSeguro) s += `<rect${CAJA} data-marca="seguro" x="${n(x)}" y="${n(y + 9)}" width="18" height="12" rx="4" fill="none" stroke="var(--c-${PAPELES.seguro})" stroke-width="2"/>` + T.rotulo(x + 24, y + 20, 'marco violeta: seguro, un solo lugar', { tam: 14, color: PAPELES.seguro });
    return s;
  }
  function geometria(d) {
    if (d.escena === 'edificio') return conPanel(d, geoEdificio(d));
    if (d.escena === 'talla') return conPanel(d, geoTalla(d));
    if (d.escena === 'mesa') return conPanel(d, geoMesa(d));
    if (d.barras) return conPanel(d, geoBarras(d));
    const N = d.puestos || (d.columnas || []).length || (d.fila || []).length || ((d.ordenes || [])[0] || { a: [] }).a.length || (d.nombres || []).length;
    const conPanel_ = d.panel !== false;
    const filas = conPanel_ ? (d.ordenes || []).length : 0;
    let x0, sw, yPanel, yNum;
    if (d.escena === 'sobres') {
      // Los sobres arriba; debajo, una columna por persona (su nombre encima) y un renglón por reparto.
      sw = 58; x0 = Math.max(M + 76, W - 8 - N * sw); yNum = SOBRE_Y + 66; yPanel = yNum + 8;
    } else if (d.escena) {
      sw = SW; x0 = W - 8 - N * sw; yNum = 104; yPanel = ESC + 4;
    } else {
      // Sin escena: la tira de puestos, con su rótulo a la izquierda (el mismo ancho que «Orden 6»).
      const rot = 62;
      sw = Math.min(54, (W - 2 * M - rot - 2) / N);
      x0 = M + rot + Math.max(0, (W - 2 * M - rot - N * sw) / 2);
      // Si la tira trae lugares posibles (línea cortada), debajo va su leyenda: un renglón más.
      yNum = M + 16; yPanel = M + 22 + 30 + 6 + (hayPosibles(d.fila) ? LEY : 0);
    }
    const lineas = conPanel_ && d.pistas ? Math.max(d.lineas || 0, renglones(d.pistas).length, 1) : 0;
    const yP = (conPanel_ ? yPanel + filas * RH : d.escena === 'sobres' ? SOBRE_Y + 52 : ESC) + (lineas ? 8 : 0);
    const yN = yP + lineas * LINEA;
    const nota = conPanel_ && d.nota !== undefined ? LINEA + 4 : 0;
    return { N, sw, x0, x1: x0 + N * sw, yNum, yPanel, filas, lineas, yP, yN, centro: k => x0 + (k + 0.5) * sw,
      alto: Math.ceil(conPanel_ ? yN + nota + M + 2 : (d.escena === 'sobres' ? SOBRE_Y + 52 : ESC) + M) };
  }
  // Las escenas que no son fila (edificio, talla, mesa, barras) terminan en yFin; debajo, las pistas y la nota.
  function conPanel(d, g) {
    const lineas = d.pistas ? Math.max(d.lineas || 0, renglones(d.pistas).length, 1) : 0;
    const yP = g.yFin + (lineas ? 8 : 0), yN = yP + lineas * LINEA, nota = d.nota !== undefined ? LINEA + 4 : 0;
    return Object.assign(g, { lineas, yP, yN, alto: Math.ceil(yN + nota + M + 2) });
  }

  function escena(d, g, corte) {
    const nombres = d.nombres || [];
    const sent = (d.sentados || []).filter(x => ve(x, corte) && x.p < g.N);
    const ya = new Set(sent.map(x => x.t));
    let s = '';
    if (g.x0 >= 112) s += arco(22, 6);
    s += `<line x1="5" y1="${SUELO}" x2="${W - 5}" y2="${SUELO}" stroke="currentColor" stroke-width="1" stroke-opacity="0.45"/>`;
    // Los que esperan de pie, a la izquierda de la banca (si caben).
    const espera = nombres.filter(t => !ya.has(t));
    if (espera.length * PASO <= g.x0 - 12) espera.forEach((t, i) => {
      const x = 22 + i * PASO;
      s += parado(nombres.indexOf(t), x) + T.rotulo(x, 104, t, { ancla: 'middle', tam: 14, min: M, max: g.x0 - 2 });
    });
    // Los sentados, y encima el respaldo (dos tablas), el asiento y las patas.
    for (const x of sent) {
      const cx = g.centro(x.p);
      s += `<g class="kit-aparece">${sentado(Math.max(0, nombres.indexOf(x.t)), cx)}`
        + T.rotulo(cx, 28, x.t, { ancla: 'middle', peso: 700, tam: 14, color: x.seguro ? PAPELES.seguro : undefined, min: g.x0 - 8, max: W - M }).replace('<text', `<text data-sentado="${x.seguro ? 'seguro' : 'dato'}"`) + '</g>';
    }
    for (const y of [62, 72]) s += `<rect x="${n(g.x0)}" y="${y}" width="${n(g.N * g.sw)}" height="7" rx="2" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`;
    for (let k = 1; k < g.N; k++) s += `<line x1="${n(g.x0 + k * g.sw)}" y1="60" x2="${n(g.x0 + k * g.sw)}" y2="81" stroke="currentColor" stroke-width="1" stroke-opacity="0.45"/>`;
    s += `<line x1="${n(g.x0 - 2)}" y1="83" x2="${n(g.x1 + 2)}" y2="83" ${tinta(3)}/>`;
    for (const x of [g.x0 + 8, g.x1 - 8]) s += `<line x1="${n(x)}" y1="84" x2="${n(x)}" y2="${SUELO - 1}" ${tinta()}/>`;
    for (let k = 0; k < g.N; k++) s += T.rotulo(g.centro(k), g.yNum, String(k + 1), { ancla: 'middle', tam: 14 });
    return `<g class="kit-objeto" data-objeto="banca" data-prueba="si">${s}</g>`;
  }

  // Una casilla de puesto: vacía, con un nombre (dato), posible (marco discontinuo) o segura (marco y nombre violeta).
  const rejilla = (x, y, w, h) => `<rect${CAJA} x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" fill="var(--card)" stroke="currentColor" stroke-opacity="0.45" stroke-width="${T.GROSOR.cuadricula}"/>`;
  function casilla(c, x, y, w, h, seguro, fino) {
    if (!c) return '';
    let s = '';
    if (seguro) s += `<rect${CAJA} data-marca="seguro" x="${n(x + 2)}" y="${n(y + 2)}" width="${n(w - 4)}" height="${n(h - 4)}" rx="5" fill="none" stroke="var(--c-${PAPELES.seguro})" stroke-width="2"/>`;
    else if (c.posible) s += `<rect${CAJA} data-marca="posible" x="${n(x + 3)}" y="${n(y + 3)}" width="${n(w - 6)}" height="${n(h - 6)}" rx="4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3"/>`;
    return s + T.rotulo(x + w / 2, y + h / 2 + 5, c.t, { ancla: 'middle', tam: 14, peso: seguro || !(c.posible || fino) ? 700 : 400, color: seguro ? PAPELES.seguro : undefined, min: x, max: x + w });
  }

  // La tira de puestos sin escena: los números y, debajo, las casillas con lo que cada pista pone por sí sola.
  function tira(d, g) {
    let s = T.rotulo(g.x0 - 8, g.yNum, d.rotulo || 'Puesto', { ancla: 'end', tam: 14, min: M });
    const y = M + 22;
    for (let k = 0; k < g.N; k++) {
      const x = g.x0 + k * g.sw, c = celdaDe((d.fila || [])[k]);
      s += T.rotulo(g.centro(k), g.yNum, String(k + 1), { ancla: 'middle', tam: 14 });
      s += rejilla(x, y, g.sw, 30) + casilla(c, x, y, g.sw, 30, c && c.seguro);
    }
    s += `<rect${CAJA} x="${n(g.x0)}" y="${y}" width="${n(g.N * g.sw)}" height="30" fill="none" stroke="currentColor" stroke-width="2"/>`;
    if (hayPosibles(d.fila)) s += leyenda(W / 2 - 108, y + 30 + 16, false);
    return s;
  }

  // La lista de órdenes: un renglón por orden, alineado con los puestos.
  function ordenes(d, g, corte) {
    let s = '';
    const fijos = (d.fijos || []).filter(x => ve(x, corte)).map(x => x.c);
    (d.ordenes || []).forEach((o, r) => {
      if (!ve(o, corte)) return;
      const y = g.yPanel + r * RH, fuera = desde(o.fuera, corte);
      let c = T.rotulo(g.x0 - 8, y + 17, `${d.rotuloOrden || 'Orden'} ${r + 1}`, { ancla: 'end', tam: 14, min: M });
      o.a.forEach((x, k) => {
        const cel = celdaDe(x), X = g.x0 + k * g.sw;
        const seg = !fuera && cel && (desde(cel.seguro, corte) || fijos.includes(k));
        c += rejilla(X, y, g.sw, RH) + casilla(cel && { t: cel.t }, X, y, g.sw, RH, seg, true);
      });
      if (fuera) c += `<line data-tacha="si"${CAJA} x1="${n(g.x0 + 4)}" y1="${n(y + RH / 2)}" x2="${n(g.x1 - 4)}" y2="${n(y + RH / 2)}" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
      s += `<g class="kit-aparece" data-orden="${fuera ? 'fuera' : 'queda'}"${fuera ? ` opacity="${TENUE}"` : ''}>${c}</g>`;
    });
    return s;
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
  function pistasYNota(d, g, corte) {
    let s = '';
    const vistas = (d.pistas || []).filter(p => ve(p, corte));
    if (d.pistas && !vistas.length && g.lineas) s += T.rotulo(M + 4, g.yP + 15, 'Todavía no hay pistas.', { tam: 14 });
    renglones(vistas).forEach((r, k) => {
      s += T.rotulo(M + 4, g.yP + k * LINEA + 15, r.t, { tam: 14, peso: r.p.nueva ? 700 : 400, clase: 'kit-aparece', min: M, max: W - M });
    });
    if (d.nota !== undefined) {
      const notas = (Array.isArray(d.nota) ? d.nota : [{ t: d.nota }]).filter(x => ve(x, corte));
      const t = notas.length ? notas[notas.length - 1].t : '';
      if (t) s += T.rotulo(W / 2, g.yN + 17, t, { ancla: 'middle', peso: 700, tam: 14, min: M, max: W - M });
    }
    return s;
  }

  // Varias tiras para comparar (la figura de «La regla»): el rótulo de cada pista y dónde deja ir a la otra persona.
  const TIRA = 58;
  function tiras(d) {
    const N = Math.max(...d.tiras.map(t => t.celdas.length)), sw = Math.min(54, (W - 2 * M - 2) / N), x0 = (W - N * sw) / 2;
    const y0 = M + (d.titulo ? 24 : 0);
    let s = d.titulo ? T.rotulo(M + 4, M + 16, d.titulo, { peso: 700, tam: 14, min: M, max: W - M }) : '';
    d.tiras.forEach((t, i) => {
      const y = y0 + i * TIRA;
      s += T.rotulo(M + 4, y + 16, t.rotulo, { tam: 14, min: M, max: W - M });
      t.celdas.forEach((x, k) => { const c = celdaDe(x), X = x0 + k * sw; s += rejilla(X, y + 22, sw, 28) + casilla(c, X, y + 22, sw, 28, c && c.seguro); });
      s += `<rect${CAJA} x="${n(x0)}" y="${n(y + 22)}" width="${n(N * sw)}" height="28" fill="none" stroke="currentColor" stroke-width="2"/>`;
    });
    const yL = y0 + d.tiras.length * TIRA;
    s += leyenda(M + 4, yL + 14, d.tiras.some(t => t.celdas.some(x => x && typeof x === 'object' && x.seguro)));
    return T.svg(W, Math.ceil(yL + 2 * LEY + M + 2), s, { alt: alt(d) });
  }

  // ======================= Escenas de las ideas 2 a 6 (fase 3, 19 nov) =======================
  // Un nombre: en violeta si es seguro (lo cuenta la prueba de papeles por su data-sentado), en naranja si es la
  // referencia de la mesa, gris y tachado si se descarta.
  function nombre(x, y, t, o = {}) {
    const color = o.seguro ? PAPELES.seguro : o.ref ? 'o' : undefined;
    let s = T.rotulo(x, y, t, { ancla: o.ancla || 'start', tam: 14, peso: o.fino ? 400 : 700, color, min: o.min === undefined ? M : o.min, max: o.max === undefined ? W - M : o.max })
      .replace('<text', `<text data-sentado="${o.seguro ? 'seguro' : 'dato'}"${o.tacha ? ` opacity="${TENUE}"` : ''}`);
    if (o.tacha) {
      const w = T.ancho(t, 14, 700), x0 = o.ancla === 'middle' ? x - w / 2 : o.ancla === 'end' ? x - w : x;
      s += `<line data-tacha="si"${CAJA} x1="${n(x0 - 2)}" y1="${n(y - 4.5)}" x2="${n(x0 + w + 2)}" y2="${n(y - 4.5)}" stroke="currentColor" stroke-width="2" stroke-opacity="${TENUE}" stroke-linecap="round"/>`;
    }
    return s;
  }
  // La punta de una flecha en (x, y) que apunta en el ángulo a (la misma forma que la del kit).
  function puntaEn(x, y, a, color, g = 2) {
    const L = 10 + g, A = 5 + g / 2, ca = Math.cos(a), sa = Math.sin(a), c = T.color(color);
    const p = (dx, dy) => `${n(x + dx * ca - dy * sa)} ${n(y + dx * sa + dy * ca)}`;
    return `<path d="M${p(0, 0)}L${p(-L, A)}L${p(-L, -A)}Z" fill="${c}" stroke="${c}" stroke-width="${g}" stroke-linejoin="round"/>`;
  }

  // ---------- Escena «edificio» (idea 2): uno o dos edificios con una ventana por piso, el 1 abajo ----------
  // datos: { escena: 'edificio', pisos: 5, sobre: n (renglones reservados sobre el techo, para quien «caería» fuera),
  //   edificios: [{ titulo, ocupa: [{ piso, t, seguro, tacha, desde }], bloque: { de, a, texto, desde }, enMedio: [pisos],
  //   enMedioDesde }] }   (sin edificios: uno solo, con ocupa y bloque en datos)
  const PH = 28;
  function geoEdificio(d) {
    const eds = d.edificios || [{ titulo: d.titulo, ocupa: d.ocupa, bloque: d.bloque, enMedio: d.enMedio, enMedioDesde: d.enMedioDesde }];
    const dos = eds.length > 1, pisos = d.pisos || 5, sobre = d.sobre || 0;
    const slot = (W - 2 * M) / eds.length, bw = dos ? 92 : 124;
    const yTitulo = M + 16, yTecho = M + (eds.some(e => e.titulo) ? 24 : 0) + 22 + sobre * PH;
    const ySuelo = yTecho + pisos * PH;
    return { eds, dos, pisos, sobre, bw, yTecho, ySuelo, yTitulo, bx: i => M + i * slot + (dos ? 22 : 66), yPiso: p => ySuelo - p * PH, yFin: ySuelo + 4 };
  }
  function edificio(d, g, corte) {
    let s = `<line x1="${n(M + 1)}" y1="${n(g.ySuelo)}" x2="${n(W - M - 1)}" y2="${n(g.ySuelo)}" stroke="currentColor" stroke-width="1" stroke-opacity="0.45"/>`;
    g.eds.forEach((e, i) => {
      const bx = g.bx(i), bw = g.bw;
      if (e.titulo) s += T.rotulo(bx + bw / 2, g.yTitulo, e.titulo, { ancla: 'middle', tam: 14, peso: 700, min: M, max: W - M });
      // El techo: parapeto y tanque de agua.
      s += `<rect x="${n(bx + bw - 36)}" y="${n(g.yTecho - 17)}" width="22" height="11" rx="2" fill="var(--card)" stroke="currentColor" stroke-width="1.5"/>`;
      s += `<line x1="${n(bx + bw - 32)}" y1="${n(g.yTecho - 6)}" x2="${n(bx + bw - 32)}" y2="${n(g.yTecho - 1)}" stroke="currentColor" stroke-width="1.5"/><line x1="${n(bx + bw - 18)}" y1="${n(g.yTecho - 6)}" x2="${n(bx + bw - 18)}" y2="${n(g.yTecho - 1)}" stroke="currentColor" stroke-width="1.5"/>`;
      s += `<rect${CAJA} x="${n(bx)}" y="${n(g.yTecho)}" width="${bw}" height="${g.pisos * PH}" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`;
      s += `<line x1="${n(bx - 3)}" y1="${n(g.yTecho)}" x2="${n(bx + bw + 3)}" y2="${n(g.yTecho)}" ${tinta(3)}/>`;
      if (!g.dos) s += T.rotulo(bx - 8, g.yTecho - 5, 'Piso', { ancla: 'end', tam: 14, min: M });
      const medio = (e.enMedio || []).filter(() => (e.enMedioDesde || 0) <= corte);
      for (let p = 1; p <= g.pisos; p++) {
        const y = g.yPiso(p);
        if (p < g.pisos) s += `<line x1="${n(bx + 1)}" y1="${n(y)}" x2="${n(bx + bw - 1)}" y2="${n(y)}" stroke="currentColor" stroke-width="1" stroke-opacity="0.45"/>`;
        if (medio.includes(p)) s += `<rect${CAJA} data-medio="si" x="${n(bx + 2)}" y="${n(y + 2)}" width="${bw - 4}" height="${PH - 4}" rx="3" fill="currentColor" fill-opacity="0.12"/>`;
        s += T.rotulo(bx - 8, y + 19, String(p), { ancla: 'end', tam: 14, min: M });
        s += `<rect x="${n(bx + 7)}" y="${n(y + 5)}" width="26" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/>`;
      }
      // Quien vive en cada piso: su cabeza en la ventana y su nombre al lado (dos en un mismo piso: «Ana y Ciro»).
      const ocupa = (e.ocupa || []).filter(x => ve(x, corte));
      const porPiso = {};
      for (const x of ocupa) (porPiso[x.piso] = porPiso[x.piso] || []).push(x);
      for (const [p, xs] of Object.entries(porPiso)) {
        const y = g.yPiso(+p), dentro = +p >= 1 && +p <= g.pisos;
        if (!dentro) s += `<rect x="${n(bx + 7)}" y="${n(y + 5)}" width="26" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3" stroke-opacity="${TENUE}"/>`;
        s += `<g class="kit-aparece"${dentro ? '' : ` opacity="${TENUE}"`}><circle cx="${n(bx + 20)}" cy="${n(y + 11)}" r="4" fill="currentColor"/><rect x="${n(bx + 13)}" y="${n(y + 16)}" width="14" height="6" rx="3" fill="currentColor"/></g>`;
        let x = bx + 40;
        xs.forEach((o, k) => {
          if (k) { s += T.rotulo(x, y + 19, 'y', { tam: 14 }); x += T.ancho('y', 14) + 4; }
          s += nombre(x, y + 19, o.t, { seguro: o.seguro, tacha: o.tacha || !dentro, max: bx + bw + (dentro ? -3 : 80) });
          x += T.ancho(o.t, 14, 700) + 4;
        });
      }
      // El bloque: dos personas amarradas por una distancia en pisos.
      const b = e.bloque;
      if (b && ve(b, corte)) {
        const X = bx + bw + 8, ya = g.yPiso(b.de) + PH / 2, yb = g.yPiso(b.a) + PH / 2;
        s += `<g class="kit-aparece" data-bloque="si"><line x1="${n(X)}" y1="${n(Math.min(ya, yb))}" x2="${n(X)}" y2="${n(Math.max(ya, yb))}" ${tinta(2)}/>`
          + `<line x1="${n(X - 5)}" y1="${n(ya)}" x2="${n(X)}" y2="${n(ya)}" ${tinta(2)}/><line x1="${n(X - 5)}" y1="${n(yb)}" x2="${n(X)}" y2="${n(yb)}" ${tinta(2)}/>`;
        if (b.texto) s += T.rotulo(X + 5, (ya + yb) / 2 + 5, b.texto, { tam: 14, peso: 700, min: M, max: W - M });
        s += '</g>';
      }
    });
    return `<g class="kit-objeto" data-objeto="edificio" data-prueba="si">${s}</g>`;
  }
  function altEdificio(d) {
    const g = geoEdificio(d);
    return g.eds.map(e => {
      const oc = (e.ocupa || []).slice().sort((a, b) => b.piso - a.piso), vacios = [];
      for (let p = 1; p <= g.pisos; p++) if (!oc.some(x => x.piso === p)) vacios.push(p);
      return `${e.titulo ? `${e.titulo}: e` : 'E'}dificio de ${g.pisos} pisos, el 1 abajo${oc.length ? `: ${oc.map(x => `${x.t} en el piso ${x.piso}${x.piso > g.pisos ? ' (no cabe)' : ''}${x.tacha ? ' (tachado)' : ''}`).join(', ')}` : ', sin nadie ubicado'}${oc.length && vacios.length ? `; vacíos: ${lista(vacios.map(String))}` : ''}${e.bloque ? `; un bloque une los pisos ${e.bloque.de} y ${e.bloque.a}` : ''}`;
    }).join('. ');
  }

  // ---------- Escena «talla» (idea 3): la formación por talla y la cadena de flechas ----------
  // datos: { escena: 'talla', nombres, formados: [nombres en orden] (si ya se sabe todo: de menor a mayor, con alturas
  //   que suben), eje: 'texto sobre la cadena', casos: [{ titulo, cadena: [[nombres de un nivel], …], aparte: [nombres sin
  //   flechas], flechas: [{ de, a, tipo: 'menor' | 'igual' | 'menorIgual', desde, nueva }], seguros: [nombres], pide: [nombres] }] }
  // La cadena la arma quien llama (cada flecha une niveles seguidos, o dos del renglón de arriba): la pieza solo dibuja.
  const NINO = 96, CH = 24, CGAP = 12;
  function geoTalla(d) {
    const casos = d.casos || [];
    const alto = c => 42 + Math.max(1, ...c.cadena.map(x => x.length), (c.aparte || []).length) * (CH + CGAP) - CGAP + 8;
    const y0 = M + NINO + 6, ys = [];
    let y = y0;
    for (const c of casos) { ys.push(y); y += alto(c) + 8; }
    return { casos, ys, yFin: y - 4 };
  }
  function nino(x, k, alto, txt, o) {
    const top = NINO - 20 - alto, yc = top + 8;
    let s = `<circle cx="${n(x)}" cy="${n(yc)}" r="7" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`;
    s += `<path d="M${n(x - 7)} ${n(yc - 1)}A7 7 0 0 1 ${n(x + 7)} ${n(yc - 1)}Z" fill="currentColor"/>`;   // el pelo
    s += `<rect x="${n(x - 9)}" y="${n(yc + 9)}" width="18" height="${n(alto * 0.45)}" rx="4" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`;
    const yp = yc + 9 + alto * 0.45;
    s += `<line x1="${n(x - 4)}" y1="${n(yp)}" x2="${n(x - 4)}" y2="${NINO - 21}" ${tinta()}/><line x1="${n(x + 4)}" y1="${n(yp)}" x2="${n(x + 4)}" y2="${NINO - 21}" ${tinta()}/>`;
    s += `<line x1="${n(x - 9)}" y1="${n(yc + 11)}" x2="${n(x - 13)}" y2="${n(yc + 9 + alto * 0.35)}" ${tinta()}/><line x1="${n(x + 9)}" y1="${n(yc + 11)}" x2="${n(x + 13)}" y2="${n(yc + 9 + alto * 0.35)}" ${tinta()}/>`;
    return s + nombre(x, NINO - 3, txt, Object.assign({ ancla: 'middle' }, o));
  }
  function talla(d, g, corte) {
    const ns = d.formados || d.nombres, paso = (W - 2 * M - 34) / ns.length;
    let s = `<line x1="${n(M + 1)}" y1="${NINO - 20}" x2="${n(W - M - 1)}" y2="${NINO - 20}" stroke="currentColor" stroke-width="1" stroke-opacity="0.45"/>`;
    // El tallímetro: sin números, porque nadie sabe cuánto mide cada uno. Con tallimetro: false (edades o puntajes) no va.
    if (d.tallimetro !== false) s += `<line x1="${M + 10}" y1="${M + 10}" x2="${M + 10}" y2="${NINO - 21}" ${tinta()}/>` + [0, 1, 2, 3, 4].map(k => `<line x1="${M + 10}" y1="${n(M + 14 + k * 14)}" x2="${M + 16}" y2="${n(M + 14 + k * 14)}" stroke="currentColor" stroke-width="1.5"/>`).join('');
    const seg = new Set((g.casos[0] || {}).seguros || []);
    ns.forEach((t, k) => { s += nino(M + 34 + (k + 0.5) * paso, k, d.formados ? 34 + k * 5 : 44, t, { seguro: d.formados && seg.has(t) }); });
    s = `<g class="kit-objeto" data-objeto="formacion" data-prueba="si">${s}</g>`;
    g.casos.forEach((c, i) => { s += cadena(d, c, g.ys[i], corte); });
    return s;
  }
  function cadena(d, c, y0, corte) {
    const cols = c.cadena.length + (c.aparte && c.aparte.length ? 1 : 0), colW = Math.min(80, (W - 2 * M) / cols);
    const cw = Math.min(56, colW - 22), x0 = M + (W - 2 * M - cols * colW) / 2, yLane = y0 + 30, yC = y0 + 42;
    const pos = {};
    c.cadena.forEach((nivel, i) => nivel.forEach((t, r) => { pos[t] = { x: x0 + i * colW + (colW - cw) / 2, y: yC + r * (CH + CGAP), i, r }; }));
    (c.aparte || []).forEach((t, r) => { pos[t] = { x: x0 + c.cadena.length * colW + (colW - cw) / 2, y: yC + r * (CH + CGAP), i: -1, r, aparte: true }; });
    let s = `<rect${CAJA} x="${n(M + 1)}" y="${n(y0)}" width="${n(W - 2 * M - 2)}" height="${n(yC - y0 + Math.max(1, ...c.cadena.map(x => x.length), (c.aparte || []).length) * (CH + CGAP) - CGAP + 8)}" rx="8" fill="none" stroke="currentColor" stroke-opacity="0.45" stroke-width="1"/>`;
    s += T.rotulo(M + 8, y0 + 18, c.titulo || d.eje || '', { tam: 14, peso: 700, min: M, max: W - M });
    const seg = new Set(c.seguros || []), pide = new Set(c.pide || []);
    for (const [t, p] of Object.entries(pos)) {
      const sg = seg.has(t);
      s += `<rect${CAJA}${sg ? ' data-marca="seguro"' : ''} x="${n(p.x)}" y="${n(p.y)}" width="${n(cw)}" height="${CH}" rx="8" fill="var(--card)" stroke="${sg ? `var(--c-${PAPELES.seguro})` : 'currentColor'}" stroke-width="${sg ? 2 : 1.5}"${p.aparte ? ' stroke-dasharray="4 3"' : ''}/>`;
      s += T.rotulo(p.x + cw / 2, p.y + 17, pide.has(t) ? '?' : t, { ancla: 'middle', tam: 14, peso: 700, color: sg ? PAPELES.seguro : undefined, min: p.x, max: p.x + cw });
    }
    for (const f of (c.flechas || []).filter(x => ve(x, corte))) {
      const a = pos[f.de], b = pos[f.a];
      if (!a || !b) continue;
      const g2 = f.nueva ? 3 : 2;
      if (f.tipo === 'igual') {
        const [u, v] = a.y < b.y ? [a, b] : [b, a], X = u.x + cw / 2;
        s += `<line x1="${n(X - 3)}" y1="${n(u.y + CH + 2)}" x2="${n(X - 3)}" y2="${n(v.y - 2)}" ${tinta(2)}/><line x1="${n(X + 3)}" y1="${n(u.y + CH + 2)}" x2="${n(X + 3)}" y2="${n(v.y - 2)}" ${tinta(2)}/>`;
      } else if (b.i - a.i === 1) {
        const x1 = a.x + cw + 2, y1 = a.y + CH / 2, x2 = b.x - 2, y2 = b.y + CH / 2;
        const ang = Math.atan2(y2 - y1, x2 - x1), L = (10 + g2) * 0.8;
        s += `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2 - Math.cos(ang) * L)}" y2="${n(y2 - Math.sin(ang) * L)}" stroke="currentColor" stroke-width="${g2}" stroke-linecap="round"${f.tipo === 'menorIgual' ? ' stroke-dasharray="5 4"' : ''}/>` + puntaEn(x2, y2, ang, null, g2);
      } else {
        // Dos niveles o más: por el carril de arriba (las dos fichas van en el primer renglón).
        const xa = a.x + cw / 2 + 6, xb = b.x + cw / 2 - 6;
        s += `<line x1="${n(xa)}" y1="${n(a.y - 2)}" x2="${n(xa)}" y2="${n(yLane)}" stroke="currentColor" stroke-width="${g2}" stroke-linecap="round"/>`
          + `<line x1="${n(xa)}" y1="${n(yLane)}" x2="${n(xb)}" y2="${n(yLane)}" stroke="currentColor" stroke-width="${g2}" stroke-linecap="round"${f.tipo === 'menorIgual' ? ' stroke-dasharray="5 4"' : ''}/>`
          + `<line x1="${n(xb)}" y1="${n(yLane)}" x2="${n(xb)}" y2="${n(b.y - 9)}" stroke="currentColor" stroke-width="${g2}" stroke-linecap="round"/>` + puntaEn(xb, b.y - 1, Math.PI / 2, null, g2);
      }
    }
    return s;
  }
  function altTalla(d) {
    const sinTalla = d.tallimetro === false, menos = sinTalla ? 'es menor que' : 'es más bajo que', igual = sinTalla ? 'es igual a' : 'mide lo mismo que';
    const partes = [`${sinTalla ? 'Personas que se comparan' : 'Formación por talla para el desfile'}: ${d.formados ? `ya ordenados, del más bajo al más alto: ${d.formados.join(', ')}` : `${lista(d.nombres)}, todavía sin ordenar`}`];
    for (const c of d.casos || []) {
      const fl = (c.flechas || []).map(f => (f.tipo === 'igual' ? `${f.de} ${igual} ${f.a}` : f.tipo === 'menorIgual' ? (sinTalla ? `${f.de} ${menos} ${f.a} o igual` : `${f.de} mide menos que ${f.a} o lo mismo`) : `${f.de} ${menos} ${f.a}`));
      partes.push(`${c.titulo || d.eje || 'Cadena'}: ${fl.length ? fl.join('; ') : 'sin flechas'}${(c.aparte || []).length ? `; sin comparar: ${lista(c.aparte)}` : ''}${(c.seguros || []).length ? `; seguro: ${lista(c.seguros)}` : ''}`);
    }
    return partes.join('. ') + '.';
  }

  // ---------- Escena «sobres» (idea 4): los sobres de la rifa y la lista de repartos ----------
  // datos: { escena: 'sobres', sobres: ['S/ 20', …], columnas: ['Ana', …], ordenes, fijos, rotuloOrden: 'Reparto', pistas, nota }
  const SOBRE_Y = M + 2;
  // forma: 'sobre' (por omisión), 'dado' (una cara con sus puntos; el rótulo es el número de 1 a 6) o 'tarjeta' (una ficha
  // lisa, para edades: sin solapa de sobre). Auditoría, 19 nov: el dibujo es el objeto que nombra el texto.
  const PUNTOS = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
    5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };
  function sobres(d, g) {
    const k = d.sobres.length, paso = (W - 2 * M) / k, forma = d.forma || 'sobre', ew = forma === 'dado' ? 42 : Math.min(70, paso - 12);
    let s = '';
    d.sobres.forEach((t, i) => {
      const x = M + i * paso + (paso - ew) / 2, y = SOBRE_Y + 4;
      s += `<rect${CAJA} x="${n(x)}" y="${n(y)}" width="${n(ew)}" height="42" rx="${forma === 'dado' ? 8 : 3}" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`;
      if (forma === 'dado' && PUNTOS[+t]) PUNTOS[+t].forEach(([a, b]) => { s += `<circle cx="${n(x + 21 + a * 11)}" cy="${n(y + 21 + b * 11)}" r="4" fill="currentColor"/>`; });
      else {
        if (forma === 'sobre') s += `<path d="M${n(x + 1)} ${n(y + 1)}L${n(x + ew / 2)} ${n(y + 17)}L${n(x + ew - 1)} ${n(y + 1)}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>`;
        s += T.rotulo(x + ew / 2, y + (forma === 'sobre' ? 36 : 26), t, { ancla: 'middle', tam: 14, peso: 700, min: x, max: x + ew });
      }
    });
    s = `<g class="kit-objeto" data-objeto="${forma === 'dado' ? 'dados' : forma === 'tarjeta' ? 'tarjetas' : 'sobres'}" data-prueba="si">${s}</g>`;
    if (d.columnas && d.ordenes && d.ordenes.length) d.columnas.forEach((t, k) => { s += T.rotulo(g.centro(k), g.yNum, t, { ancla: 'middle', tam: 14, peso: 700, min: M, max: W - M }); });
    return s;
  }

  // ---------- «barras» (idea 4): dos sumas iguales, como dos barras del mismo largo ----------
  // datos: { barras: [{ rotulo, partes: [{ t, v, texto, seguro }] }], banda: { de, a, desde } }   (v: el largo de cada parte)
  const BH = 44, BFILA = 76;
  function geoBarras(d) {
    const tot = Math.max(...d.barras.map(b => b.partes.reduce((a, p) => a + p.v, 0)));
    const x0 = M + 12, u = (W - 2 * M - 24) / tot;
    return { x0, u, X: v => x0 + v * u, y: i => M + 20 + i * BFILA, yFin: M + 20 + d.barras.length * BFILA - BFILA + BH + 6 };
  }
  function barras(d, g, corte) {
    let s = '';
    const b = d.banda;
    // La franja: lo que una parte le gana a la otra, marcada en cada barra (sin cruzar los rótulos de en medio).
    if (b && ve(b, corte)) d.barras.forEach((_, i) => {
      s += `<rect${CAJA} data-banda="si" x="${n(g.X(b.de))}" y="${n(g.y(i) - 3)}" width="${n(g.X(b.a) - g.X(b.de))}" height="${BH + 6}" fill="currentColor" fill-opacity="0.14"/>`;
    });
    d.barras.forEach((fila, i) => {
      const y = g.y(i);
      s += T.rotulo(g.x0, y - 7, fila.rotulo, { tam: 14, peso: 700, min: M, max: W - M });
      let v = 0;
      for (const p of fila.partes) {
        const x = g.X(v), w = p.v * g.u;
        s += `<rect${CAJA} x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${BH}" rx="4" fill="currentColor" fill-opacity="0.06" stroke="currentColor" stroke-width="2"/>`;
        s += nombre(x + w / 2, y + 19, p.t, { ancla: 'middle', seguro: p.seguro, min: x, max: x + w });
        if (p.texto !== undefined && ve(p, corte)) s += T.rotulo(x + w / 2, y + 37, p.texto, { ancla: 'middle', tam: 14, min: x, max: x + w });
        v += p.v;
      }
    });
    if (b && ve(b, corte)) d.barras.forEach((_, i) => { for (const v of [b.de, b.a]) s += `<line${CAJA} x1="${n(g.X(v))}" y1="${n(g.y(i) - 3)}" x2="${n(g.X(v))}" y2="${n(g.y(i) + BH + 3)}" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3"/>`; });
    return s;
  }
  const altBarras = d => `Dos barras: ${d.barras.map(b => `${b.rotulo}, partida en ${b.partes.map(p => `${p.t}${p.texto !== undefined && p.texto !== '?' ? ` (${p.texto})` : ''}`).join(' y ')}`).join('; ')}${d.banda ? '; una franja marca lo que una parte le gana a la otra' : ''}.`;

  // ---------- Escena «mesa» (ideas 5 y 6): la mesa vista desde arriba, redonda o cuadrada ----------
  // datos: { escena: 'mesa', forma: 'redonda' | 'cuadrada', sillas: n (redonda) | porLado: k (cuadrada),
  //   sentados: [{ s, t, seguro, ref, desde, pide }],  s: la silla, contada desde la de abajo (s = 0) contra el reloj, que es
  //            hacia la derecha de quien mira al centro; ref: la referencia (naranja); pide: se dibuja «?»
  //   numeros: ['1', '2', …] (cartel de cada silla, por s), marcas: [{ s, seguro, desde }] (cartel señalado o violeta), cucharas: true (plato y cuchara en la mano derecha de cada uno),
  //   flechas: [{ s, sentido: 'derecha' | 'izquierda', desde }] (turquesa: de la silla s a la siguiente; o una sola, flecha),
  //   frente: [{ de, a, desde }] (turquesa: la línea que cruza la mesa), espera: [nombres de pie, abajo a la izquierda],
  //   pistas, lineas, nota }
  // Papeles: la referencia en naranja (desde quién se mide), la flecha y la línea en turquesa (hacia dónde), lo seguro
  // y lo pedido ya comprobado en violeta. Todo lo demás, en tinta.
  const RT = 46, RS = 72;
  function geoMesa(d) {
    const cuad = d.forma === 'cuadrada', k = d.porLado || 2, N = cuad ? 4 * k : d.sillas;
    const L = cuad && k >= 3 ? 60 : 50;
    const cx = W / 2, cy = M + L + 52 + (d.titulo ? 20 : (d.espera || []).length ? 30 : 0);
    const silla = s => {
      if (!cuad) { const a = 2 * Math.PI * s / N; return { x: cx + RS * Math.sin(a), y: cy + RS * Math.cos(a), fx: -Math.sin(a), fy: -Math.cos(a) }; }
      const lado = Math.floor(s / k), j = s % k, t = (j + 0.5) / k;
      if (lado === 0) return { x: cx - L + 2 * L * t, y: cy + L + 22, fx: 0, fy: -1, lado };
      if (lado === 1) return { x: cx + L + 22, y: cy + L - 2 * L * t, fx: -1, fy: 0, lado };
      if (lado === 2) return { x: cx + L - 2 * L * t, y: cy - L - 22, fx: 0, fy: 1, lado };
      return { x: cx - L - 22, y: cy - L + 2 * L * t, fx: 1, fy: 0, lado };
    };
    const yFin = cy + L + 62;
    // El cartel de cada silla (cuadrada): sobre el borde de la mesa, a 32 de cada esquina o más, para que los carteles
    // de dos lados no se toquen en la esquina.
    const cartel = s => {
      const p = silla(s), lado = Math.floor(s / k), t = (s % k + 0.5) / k, a = Math.min(2 * L - 32, Math.max(32, 2 * L * t)) - L, e = L - (k >= 3 ? 10 : 12);
      return [{ x: cx + a, y: cy + e }, { x: cx + e, y: cy - a }, { x: cx - a, y: cy - e }, { x: cx - e, y: cy + a }][lado] || p;
    };
    return { cuad, k, N, cx, cy, L, silla, yFin, cartel };
  }
  // Dónde va el nombre de quien se sienta en la silla s: afuera, del lado de su silla.
  function lugarNombre(g, s) {
    const p = g.silla(s), ox = -p.fx, oy = -p.fy;
    if (ox > 0.35) return { x: p.x + 18, y: p.y + 5, ancla: 'start' };
    if (ox < -0.35) return { x: p.x - 18, y: p.y + 5, ancla: 'end' };
    return oy > 0 ? { x: p.x, y: p.y + 30, ancla: 'middle' } : { x: p.x, y: p.y - 18, ancla: 'middle' };
  }
  function mesa(d, g, corte) {
    let s = '';
    const { cx, cy } = g;
    if (d.titulo) s += T.rotulo(cx, M + 16, d.titulo, { ancla: 'middle', tam: 14, peso: 700 });
    if (g.cuad) s += `<rect${CAJA} x="${n(cx - g.L)}" y="${n(cy - g.L)}" width="${2 * g.L}" height="${2 * g.L}" rx="4" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`
      + (g.k >= 3 ? [-14, 14] : g.k === 2 ? [0] : []).map(q => `<line x1="${n(cx + q)}" y1="${n(cy - g.L + 1)}" x2="${n(cx + q)}" y2="${n(cy + g.L - 1)}" stroke="currentColor" stroke-width="1" stroke-opacity="0.35"/>`).join('');   // las carpetas juntas, entre los carteles
    else s += `<circle${CAJA} cx="${n(cx)}" cy="${n(cy)}" r="${RT}" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`;
    const sent = (d.sentados || []).filter(x => ve(x, corte)), ocup = new Map(sent.map(x => [x.s, x]));
    // La línea «frente a». En la cuadrada cruza toda la mesa, de una silla a la otra, y pasa por debajo de los carteles
    // (se dibuja antes; data-caja: los cruza a propósito). Auditoría, 19 nov: cortada cerca del centro, las cuatro líneas
    // de «La regla» formaban un cuadradito y se leían como sillas del mismo lado.
    for (const fr of (d.frente || []).filter(x => ve(x, corte))) {
      const a = g.silla(fr.de), b = g.silla(fr.a), r0 = g.cuad ? 13 : RS - RT + 30;
      s += `<line class="kit-aparece" data-frente="si"${g.cuad ? CAJA : ''} x1="${n(a.x + a.fx * r0)}" y1="${n(a.y + a.fy * r0)}" x2="${n(b.x + b.fx * r0)}" y2="${n(b.y + b.fy * r0)}" stroke="var(--c-i)" stroke-width="3" stroke-linecap="round"/>`;
    }
    // Las sillas: vacías se ven; con alguien, la persona vista desde arriba (hombros y pelo).
    for (let k = 0; k < g.N; k++) {
      const p = g.silla(k);
      s += `<rect x="${n(p.x - 10)}" y="${n(p.y - 10)}" width="20" height="20" rx="5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.45"/>`;
      if (d.numeros) {
        // El cartel con el número de la silla; marcado: con marco grueso (señalado) o violeta (lo pedido, ya comprobado).
        const c = g.cuad ? g.cartel(k) : { x: p.x + p.fx * (RS - RT + 12), y: p.y + p.fy * (RS - RT + 12) };
        const m = (d.marcas || []).find(x => x.s === k && ve(x, corte)), sg = m && m.seguro;
        s += `<rect${CAJA}${sg ? ' data-marca="seguro"' : ''} x="${n(c.x - 10)}" y="${n(c.y - 9)}" width="20" height="18" rx="3" fill="var(--card)" stroke="${sg ? `var(--c-${PAPELES.seguro})` : 'currentColor'}" stroke-width="${m ? 2.5 : 1}"/>`
          + T.rotulo(c.x, c.y + 5, d.numeros[k], { ancla: 'middle', tam: 14, peso: m ? 700 : 400, color: sg ? PAPELES.seguro : undefined, min: c.x - 10, max: c.x + 10 });
      }
      const x = ocup.get(k);
      if (!x) continue;
      const rx = -p.fy, ry = p.fx, bx = p.x - p.fx * 6, by = p.y - p.fy * 6;
      let q = `<line x1="${n(bx - rx * 11)}" y1="${n(by - ry * 11)}" x2="${n(bx + rx * 11)}" y2="${n(by + ry * 11)}" stroke="currentColor" stroke-width="9" stroke-linecap="round" stroke-opacity="0.35"/>`;
      q += `<circle cx="${n(p.x)}" cy="${n(p.y)}" r="7.5" fill="currentColor"/>`;
      if (x.ref) q += `<circle cx="${n(p.x)}" cy="${n(p.y)}" r="11" fill="none" stroke="var(--c-o)" stroke-width="2"/>`;
      if (d.cucharas) {
        // El plato, frente a cada uno; la cuchara, del lado de su mano derecha.
        const pl = { x: p.x + p.fx * (RS - RT + 14), y: p.y + p.fy * (RS - RT + 14) }, cu = { x: pl.x + rx * 12, y: pl.y + ry * 12 };
        q += `<circle cx="${n(pl.x)}" cy="${n(pl.y)}" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="${n(pl.x)}" cy="${n(pl.y)}" r="4" fill="none" stroke="currentColor" stroke-width="1" stroke-opacity="0.45"/>`;
        q += `<line x1="${n(cu.x - p.fx * 7)}" y1="${n(cu.y - p.fy * 7)}" x2="${n(cu.x + p.fx * 3)}" y2="${n(cu.y + p.fy * 3)}" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="${n(cu.x + p.fx * 6)}" cy="${n(cu.y + p.fy * 6)}" r="2.6" fill="currentColor"/>`;
      }
      const ln = lugarNombre(g, k);
      q += nombre(ln.x, ln.y, x.pide ? '?' : x.t, { ancla: ln.ancla, seguro: x.seguro, ref: x.ref });
      s += `<g class="kit-aparece" data-silla="${k}">${q}</g>`;
    }
    // La flecha de «a la derecha» (contra el reloj) o de «a la izquierda», de la silla s a la que sigue.
    for (const f of (d.flechas || (d.flecha ? [d.flecha] : [])).filter(x => ve(x, corte) && !g.cuad)) {
      const R = RT + 10, sg = f.sentido === 'izquierda' ? -1 : 1, a1 = 2 * Math.PI * f.s / g.N + sg * 0.2, a2 = 2 * Math.PI * (f.s + sg) / g.N - sg * 0.22;
      const P = a => ({ x: cx + R * Math.sin(a), y: cy + R * Math.cos(a) });
      const p1 = P(a1), p2 = P(a2), tan = Math.atan2(-Math.sin(a2) * sg, Math.cos(a2) * sg);
      s += `<g class="kit-aparece" data-flecha="${f.sentido || 'derecha'}"><path d="M${n(p1.x)} ${n(p1.y)}A${R} ${R} 0 0 ${sg > 0 ? 0 : 1} ${n(p2.x - Math.cos(tan) * 6)} ${n(p2.y - Math.sin(tan) * 6)}" fill="none" stroke="var(--c-i)" stroke-width="3" stroke-linecap="round"/>${puntaEn(p2.x + Math.cos(tan) * 3, p2.y + Math.sin(tan) * 3, tan, 'i', 2)}</g>`;
    }
    // Quienes todavía esperan, de pie: centrados sobre la mesa, para que su nombre no quede de un lado (auditoría, 19 nov:
    // en la esquina de la izquierda, «Eva» señalaba la respuesta de la predicción).
    if ((d.espera || []).length && !d.titulo) s += T.rotulo(cx, M + 16, `De pie: ${d.espera.join(', ')}`, { ancla: 'middle', tam: 14, peso: 400, min: M, max: W - M });
    return `<g class="kit-objeto" data-objeto="mesa" data-prueba="si">${s}</g>`;
  }
  function altMesa(d) {
    const g = geoMesa(d), sent = d.sentados || [];
    const silla = k => (d.numeros ? `la silla ${d.numeros[k]}` : k === 0 ? 'la silla de abajo' : `la silla ${k} contra el reloj desde la de abajo`);
    let s = `Mesa ${g.cuad ? `cuadrada de carpetas juntas, con ${g.k} ${g.k === 1 ? 'silla' : 'sillas'} por lado` : `redonda de ${g.N} sillas`}, vista desde arriba; todos miran al centro`;
    if (sent.length) s += `: ${sent.map(x => `${x.pide ? 'alguien por saber' : x.t} en ${silla(x.s)}${x.ref ? ' (referencia)' : ''}${x.seguro ? ' (seguro)' : ''}`).join(', ')}`;
    if (d.cucharas) s += '; cada uno tiene la cuchara a su derecha';
    for (const f of d.flechas || (d.flecha ? [d.flecha] : [])) s += `; una flecha va de la silla de ${(sent.find(x => x.s === f.s) || {}).t || 'alguien'} hacia su ${f.sentido || 'derecha'}, ${f.sentido === 'izquierda' ? 'con' : 'contra'} el reloj`;
    if ((d.frente || []).length) s += `; una línea cruza la mesa de ${d.frente.map(f => `${silla(f.de)} a ${silla(f.a)}`).join(' y de ')}`;
    if ((d.espera || []).length) s += `; esperan de pie ${lista(d.espera)}`;
    if (d.pistas && d.pistas.length) s += `. Pistas: ${d.pistas.map(p => p.t).join(' ')}`;
    return s + '.';
  }

  function dibujar(d, e = {}) {
    const corte = e.corte || 0;
    if (d.tiras) return tiras(d);
    const g = geometria(d);
    if (d.escena === 'edificio' || d.escena === 'talla' || d.escena === 'mesa' || d.barras) {
      const s = (d.escena === 'edificio' ? edificio : d.escena === 'talla' ? talla : d.escena === 'mesa' ? mesa : barras)(d, g, corte) + pistasYNota(d, g, corte);
      return T.svg(W, g.alto, s, { alt: alt(d) });
    }
    let s = d.escena === 'sobres' ? sobres(d, g) : d.escena ? escena(d, g, corte) : tira(d, g);
    if (d.panel === false) return T.svg(W, g.alto, s, { alt: alt(d) });
    s += ordenes(d, g, corte) + pistasYNota(d, g, corte);
    return T.svg(W, g.alto, s, { alt: alt(d) });
  }

  function alt(d) {
    const txt = x => { const c = celdaDe(x); return c ? c.t : 'vacío'; };
    if (d.escena === 'edificio') return altEdificio(d) + (d.pistas && d.pistas.length ? `. Pistas: ${d.pistas.map(p => p.t).join(' ')}` : '') + '.';
    if (d.escena === 'talla') return altTalla(d);
    if (d.escena === 'mesa') return altMesa(d);
    if (d.barras) return altBarras(d);
    if (d.tiras) return `${d.titulo ? `${d.titulo} ` : ''}${d.tiras.map(t => `${t.rotulo}: ${t.celdas.map((x, k) => { const c = celdaDe(x); return c ? `puesto ${k + 1}, ${c.t}${c.posible ? ' (posible)' : c.seguro ? ' (seguro)' : ''}` : null; }).filter(Boolean).join('; ')}`).join('. ')}.`;
    const g = geometria(d), partes = [];
    if (d.escena === 'sobres') partes.push(`${d.forma === 'dado' ? 'Dados' : d.forma === 'tarjeta' ? 'Tarjetas' : 'Sobres de la rifa'}: ${lista(d.sobres)}${d.columnas ? `; una columna por persona: ${lista(d.columnas)}` : ''}`);
    else if (d.escena === 'banca') {
      const sent = d.sentados || [], ya = new Set(sent.map(x => x.t)), espera = (d.nombres || []).filter(t => !ya.has(t));
      partes.push(`Banca de ${g.N} puestos frente a la cancha del campeonato, vista desde atrás${sent.length ? `: ${sent.map(x => `${x.t} en el puesto ${x.p + 1}`).join(', ')}` : ', vacía'}${espera.length ? `; esperan de pie ${lista(espera)}` : ''}`);
    } else partes.push(`Fila de ${g.N} puestos numerados de izquierda a derecha${(d.fila || []).some(Boolean) ? `: ${(d.fila || []).map((x, k) => (celdaDe(x) ? `${txt(x)} en el puesto ${k + 1}` : null)).filter(Boolean).join(', ')}` : ', sin nadie ubicado'}`);
    if (d.panel === false) return partes.join('. ') + '.';
    if (d.ordenes && d.ordenes.length) {
      const quedan = d.ordenes.filter(o => o.fuera !== true && typeof o.fuera !== 'number');
      partes.push(`${d.ordenes.length} órdenes en lista${quedan.length < d.ordenes.length ? `; sin tachar, ${quedan.length}` : ''}: ${quedan.map(o => o.a.map(txt).join(', ')).join('; ')}`);
    }
    if (d.pistas && d.pistas.length) partes.push(`Pistas: ${d.pistas.map(p => p.t).join(' ')}`);
    return partes.join('. ') + '.';
  }

  return { id: 'rm-orden', dibujar, alt, geometria, PAPELES, constantes: { W, ESC, SW, RH, TENUE } };
});
