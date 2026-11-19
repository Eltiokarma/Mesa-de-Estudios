/*
 * Pieza «quim-tira» (19 nov 2026, etapa 5 de química, Tabla periódica, idea 1 «Ley periódica: periodos y grupos»):
 * las tarjetas de los elementos, en orden de Z, que se cortan en filas hasta que los parecidos quedan en columna.
 * Dibujo de prueba (data-prueba; Gerson decide después si lo reemplaza, docs/plan-calidad.md M4).
 *
 * Afirmación de la figura: ordenados por Z, los elementos repiten su manera de portarse cada cierto número; si la tira
 * se corta justo ahí, los parecidos caen uno debajo de otro. Esa es la tabla periódica.
 *
 * Tres vistas, con las mismas tarjetas (arriba Z, al centro el símbolo, abajo la marca de cómo se porta):
 *   objetos: tres objetos de todos los días (globo con helio, letrero de neón, foco con argón), cada uno con la tarjeta
 *            de su elemento debajo (la primera pantalla de la idea: contrato, punto 1);
 *   tira:    las tarjetas de `desde` a `hasta` cortadas en filas de `porFila`; con `cabeza`, el hidrógeno y el helio
 *            van en una primera fila corta, en las puntas;
 *   tabla:   la tabla de verdad (grupos 1, 2 y 13 a 18; los grupos 3 a 12 resumidos en una casilla), periodos 1 a 7.
 * Marcas (formas en tinta, no colores: se distinguen sin color): 'inerte' ● gas que casi no reacciona, 'blando' ▲ metal
 * blando que reacciona con el agua, 'sal' ■ no metal que forma sales con los metales.
 * Colores del mapa de la unidad (docs/etapa5/propuesta-quimica.md §8): Z naranja 'o' (el número de la tarjeta), el
 * periodo turquesa 'i' (una fila marcada), el grupo carmín 'h' (una columna marcada); lo demás en tinta; sin verde.
 *
 * datos = {
 *   vista: 'tira' | 'tabla' | 'objetos',
 *   simbolos: { 1: 'H', … },                       // Z → símbolo (los trae la unidad)
 *   marcas: { 3: 'blando', 10: 'inerte', … },      // Z → marca
 *   ocultos: [Z],                                  // la tarjeta dice «?» en vez del símbolo y no lleva marca (se pide cómo es)
 *   incognitas: [Z],                               // la tarjeta dice «?» en vez del número, sin símbolo ni marca (se pide su Z)
 *   resaltar: [{ Z, color, desde }],               // contorno grueso (tinta si no trae color)
 *   tira:    desde, hasta, porFila, cabeza: true, columnas: true (marco carmín en cada columna que junta toda una familia)
 *   tabla:   periodos, fila: { periodo, color, desde }, columna: { grupo, color, desde }, hasta (Z máximo que se dibuja)
 *   objetos: [{ que, Z, nombre, prende }],         // que: 'globo' | 'letrero' | 'foco' | 'sal' (bolsa de sal yodada) | 'clavo' | 'cable' |
 *                                                  // 'anillo' | 'probador' (pila, foquito y material; prende: 0, 1 o 2) | 'cristal' (grano de
 *                                                  // sal bajo la lupa) | 'salero' | 'romana' (balanza de resorte) | 'soga' (dos que jalan);
 *                                                  // sin Z, el objeto va sin tarjeta
 *   transicion (vista): los grupos 3 a 12 abiertos (IIIB a IIB), periodos 4 y 5; resaltar, ocultos, incognitas y rotulo como en la tabla
 *   escalera: true (tabla): la línea gruesa que separa los metales (a su izquierda) de los semimetales y los no metales
 *   probador: { prende } (tabla): el probador de foquito, chico (× 0,6), en el hueco de la fila 1 entre el H y el He
 *   esferas (vista, Propiedades periódicas): [{ s: 'O²⁻', r: 140, p: 8, e: 10, oculto, desde }] átomos o iones como círculos a
 *            escala (r en pm; max: el radio que mide 34 px, por omisión 220), con su símbolo arriba y, abajo, el radio
 *            (turquesa), los protones (naranja) y los electrones (tinta). oculto: el círculo va punteado, todos del mismo
 *            tamaño, y el radio dice «? pm» (lo que se pide)
 *   barras (vista, Propiedades periódicas): [{ s: 'Li', v: 520, oculto, marca }] una barra por elemento, del alto de su valor
 *            (max: el valor de la barra más alta, 120 px; color: 'h' o 'f'), con el valor arriba y el símbolo abajo; oculto: «?»
 *            y sin barra; marca: contorno grueso. Las barras van todas a la misma escala, desde 0.
 *   escenas: [{ desde, …datos }],                  // para «Mira»: se dibuja la última escena con desde ≤ corte
 *   rotulo, rotuloColor, alt
 * }
 * estado = { corte }. Función pura de (datos, estado): sin ids, sin azar, sin reloj. Alto fijo para unos datos (con
 * escenas, el de la más alta). geometria(datos, estado) → { W, H, M, textos, objetos }: las cajas con las mismas cuentas
 * del dibujo, para la prueba numérica de encuadre y rótulos (docs/molde-unidad.md §6).
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
  const W = 320, M = 4, CH = 50, SEP = 4, n = T.n;
  const NOBLES = [0, 2, 10, 18, 36, 54, 86, 118];
  const GRUPOS = ['1', '2', '3–12', '13', '14', '15', '16', '17', '18'];
  const BARRA_ALTO = 120;
  const NOMBRE_MARCA = { inerte: 'gas que casi no reacciona', blando: 'metal blando que reacciona con el agua', sal: 'no metal que forma sales' };

  // ---- Plano: dónde va cada tarjeta, según la vista (las mismas cuentas sirven al dibujo y a la geometría) ----
  // Tabla: columna (0..8) y periodo de un Z de los grupos 1, 2 y 13 a 18; null si es de los grupos 3 a 12 (o de más allá).
  function lugarTabla(Z) {
    for (let p = 1; p <= 7; p++) {
      const a = NOBLES[p - 1] + 1, b = NOBLES[p];
      if (Z < a || Z > b) continue;
      if (p === 1) return { col: Z === 1 ? 0 : 8, per: 1 };
      if (Z - a < 2) return { col: Z - a, per: p };
      if (b - Z < 6) return { col: 8 - (b - Z), per: p };
      return null;
    }
    return null;
  }
  const zTabla = (col, per) => (per === 1 ? (col === 0 ? 1 : col === 8 ? 2 : null) : col < 2 ? NOBLES[per - 1] + 1 + col : col > 2 ? NOBLES[per] - (8 - col) : null);
  function plano(d) {
    const vista = d.vista || 'tira', cartas = [], extras = [];
    let H;
    if (vista === 'objetos') {
      const os = d.objetos || [], paso = (W - 2 * M) / Math.max(1, os.length), cw = 40;
      const conCarta = os.some(o => o.Z), yN = conCarta ? 92 + CH + 18 : 104;
      os.forEach((o, k) => {
        const cx = M + paso * (k + 0.5);
        extras.push({ tipo: 'objeto', que: o.que, cx, y: 8, w: 76, h: 76, prende: o.prende });
        if (o.Z) cartas.push({ Z: o.Z, x: cx - cw / 2, y: 92, w: cw, h: CH });
        if (o.nombre) extras.push({ tipo: 'nombre', txt: o.nombre, cx, y: yN });
      });
      H = yN + 8;
    } else if (vista === 'esferas') {
      const es = d.esferas || [], paso = (W - 2 * M) / Math.max(1, es.length), max = d.max || 220, lineas = (es.some(e => e.p !== undefined) ? 1 : 0) + (es.some(e => e.e !== undefined) ? 1 : 0);
      es.forEach((e, k) => extras.push({ tipo: 'esfera', e, cx: M + paso * (k + 0.5), cy: 62, r: e.oculto ? 16 : Math.max(4, 34 * e.r / max) }));
      H = 62 + 32 + 20 + 17 * lineas + 6;
    } else if (vista === 'barras') {
      const bs = d.barras || [], paso = (W - 2 * M) / Math.max(1, bs.length), bw = Math.min(28, paso - 10), base = 30 + BARRA_ALTO, max = d.max || Math.max(...bs.map(b => b.v || 0), 1);
      bs.forEach((b, k) => extras.push({ tipo: 'barra', b, cx: M + paso * (k + 0.5), w: bw, base, h: b.oculto ? 0 : Math.max(1, BARRA_ALTO * Math.min(1, (b.v || 0) / max)) }));
      H = base + 30;
    } else if (vista === 'transicion') {
      // Los grupos 3 a 12 abiertos, periodos 4 y 5: diez columnas con su número y, debajo, su nombre en romanos.
      const cw = 30, x0 = 16, y0 = 42, ROMANOS = ['IIIB', 'IVB', 'VB', 'VIB', 'VIIB', '', 'VIIIB', '', 'IB', 'IIB'];
      for (let c = 0; c < 10; c++) {
        extras.push({ tipo: 'grupo', txt: String(c + 3), cx: x0 + c * cw + cw / 2, y: 16 });
        if (ROMANOS[c]) extras.push({ tipo: 'grupo', txt: ROMANOS[c], cx: x0 + c * cw + cw / 2, y: 34 });
      }
      extras.push({ tipo: 'llave', x1: x0 + 5 * cw + 2, x2: x0 + 8 * cw - 2, y: 38 });
      [4, 5].forEach((p, f) => {
        extras.push({ tipo: 'periodo', txt: String(p), x: x0 - 4, y: y0 + f * CH + CH / 2 + 5 });
        for (let c = 0; c < 10; c++) cartas.push({ Z: NOBLES[p - 1] + 3 + c, x: x0 + c * cw, y: y0 + f * CH, w: cw, h: CH, col: c, per: p });
      });
      H = y0 + 2 * CH + 6;
    } else if (vista === 'tabla') {
      const P = Math.max(1, Math.min(7, d.periodos || 4)), cw = 33, x0 = W - M - 9 * cw - 2, y0 = 24, tope = d.hasta || 118;
      GRUPOS.forEach((g, c) => extras.push({ tipo: 'grupo', txt: g, cx: x0 + c * cw + cw / 2, y: y0 - 7 }));
      for (let p = 1; p <= P; p++) {
        extras.push({ tipo: 'periodo', txt: String(p), x: x0 - 5, y: y0 + (p - 1) * CH + CH / 2 + 5 });
        for (let c = 0; c < 9; c++) {
          const x = x0 + c * cw, y = y0 + (p - 1) * CH, Z = zTabla(c, p);
          if (c === 2) { if (p >= 4 && NOBLES[p - 1] + 3 <= tope) extras.push({ tipo: 'resumen', a: NOBLES[p - 1] + 3, b: NOBLES[p] - 6, x, y, w: cw, h: CH }); continue; }
          if (Z && Z <= tope) cartas.push({ Z, x, y, w: cw, h: CH, col: c, per: p });
        }
      }
      H = y0 + P * CH + 6;
      return { vista, cartas, extras, H: H + (d.rotulo ? 26 : 0), x0, y0, cw, P };
    } else {
      const k = Math.max(2, d.porFila || 8), desde = d.desde || 1, hasta = d.hasta || 20;
      const cw = Math.min(38, Math.floor((W - 2 * M - 4) / k)), x0 = (W - k * cw) / 2, y0 = 8;
      let fila0 = 0;
      if (d.cabeza) { cartas.push({ Z: 1, x: x0, y: y0, w: cw, h: CH, col: 0, fila: 0 }, { Z: 2, x: x0 + (k - 1) * cw, y: y0, w: cw, h: CH, col: k - 1, fila: 0 }); fila0 = 1; }
      for (let Z = desde; Z <= hasta; Z++) {
        const i = Z - desde, col = i % k, fila = fila0 + Math.floor(i / k);
        cartas.push({ Z, x: x0 + col * cw, y: y0 + fila * (CH + SEP), w: cw, h: CH, col, fila });
      }
      const filas = fila0 + Math.ceil((hasta - desde + 1) / k);
      H = y0 + filas * (CH + SEP) + 4;
      return { vista, cartas, extras, H: H + (d.rotulo ? 26 : 0), k, cw };
    }
    return { vista, cartas, extras, H: H + (d.rotulo ? 26 : 0) };
  }
  // Columnas de la tira que juntan a toda una familia (dos o más tarjetas con la misma marca, y ninguna de esa marca
  // fuera de la columna): ahí «los parecidos quedaron en columna».
  function columnasFamilia(d, P) {
    if (P.vista !== 'tira' || d.columnas === false) return [];
    const m = d.marcas || {}, oc = [...(d.ocultos || []), ...(d.incognitas || [])], out = [];
    const marcadas = P.cartas.filter(c => m[c.Z] && !oc.includes(c.Z));
    for (const marca of [...new Set(marcadas.map(c => m[c.Z]))]) {
      const suyas = marcadas.filter(c => m[c.Z] === marca), col = suyas[0].col;
      if (suyas.length < 2 || suyas.some(c => c.col !== col)) continue;
      if (marcadas.some(c => c.col === col && m[c.Z] !== marca)) continue;
      const y0 = Math.min(...suyas.map(c => c.y)), y1 = Math.max(...suyas.map(c => c.y + c.h));
      out.push({ marca, x: suyas[0].x, y: y0, w: suyas[0].w, h: y1 - y0 });
    }
    return out;
  }
  const escena = (d, corte) => {
    if (!Array.isArray(d.escenas) || !d.escenas.length) return d;
    let e = d.escenas[0];
    for (const x of d.escenas) if ((x.desde || 0) <= corte) e = x;
    return Object.assign({ simbolos: d.simbolos, marcas: d.marcas }, e);
  };
  const altoDe = d => (Array.isArray(d.escenas) && d.escenas.length ? Math.max(...d.escenas.map(e => plano(Object.assign({ simbolos: d.simbolos, marcas: d.marcas }, e)).H)) : plano(d).H);

  // ---- Dibujo ----
  function marca(tipo, cx, cy) {
    if (tipo === 'inerte') return `<circle class="kit-marca" cx="${n(cx)}" cy="${n(cy)}" r="4.5" fill="currentColor"/>`;
    if (tipo === 'blando') return `<path class="kit-marca" d="M${n(cx)} ${n(cy - 5)}L${n(cx + 5.5)} ${n(cy + 4.5)}H${n(cx - 5.5)}Z" fill="currentColor"/>`;
    if (tipo === 'sal') return `<rect class="kit-marca" x="${n(cx - 4.5)}" y="${n(cy - 4.5)}" width="9" height="9" fill="currentColor"/>`;
    return '';
  }
  // El símbolo va a 16; en las tarjetas angostas (filas de 10), a 14, para que «Mg» no toque los bordes.
  const tamSimbolo = c => (c.w < 34 ? 14 : 16);
  // El número va en seminegrita; con tres cifras (periodo 7), en peso normal, para que quepa con aire.
  const pesoZ = c => (c.Z >= 100 ? 400 : 600);
  function carta(d, c) {
    const oculto = (d.ocultos || []).includes(c.Z), s = (d.simbolos || {})[c.Z] || '', m = (d.marcas || {})[c.Z];
    let t = `<rect x="${n(c.x + 1)}" y="${n(c.y + 1)}" width="${n(c.w - 2)}" height="${n(c.h - 2)}" rx="4" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-width="1.5"/>`;
    // Lo que se pide es su número atómico: «?» en tinta, y nada más en la tarjeta.
    if ((d.incognitas || []).includes(c.Z)) return `<g class="kit-carta">${t}${T.rotulo(c.x + c.w / 2, c.y + 30, '?', { ancla: 'middle', tam: 18, peso: 700, min: M, max: W - M })}</g>`;
    t += T.rotulo(c.x + c.w / 2, c.y + 15, String(c.Z), { ancla: 'middle', tam: 14, color: 'o', peso: pesoZ(c), clase: 'kit-num', min: M, max: W - M });
    t += T.rotulo(c.x + c.w / 2, c.y + 32, oculto ? '?' : s, { ancla: 'middle', tam: tamSimbolo(c), peso: 700, min: M, max: W - M });
    if (m && !oculto) t += marca(m, c.x + c.w / 2, c.y + 41);
    return `<g class="kit-carta">${t}</g>`;
  }
  // Los tres objetos, en tinta. Caja de 76 × 76 con centro en cx; y es su borde de arriba.
  function objeto(que, cx, y, o = {}) {
    const st = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
    const rel = 'fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="2" stroke-linejoin="round"';
    let s = '';
    if (que === 'sal') {
      // Bolsa de sal de cocina, con su rótulo.
      s += `<path d="M${n(cx - 27)} ${y + 12}L${n(cx - 23)} ${y + 6}H${n(cx + 23)}L${n(cx + 27)} ${y + 12}V${y + 72}H${n(cx - 27)}Z" ${rel}/>`;
      s += `<path d="M${n(cx - 27)} ${y + 12}H${n(cx + 27)}M${n(cx - 20)} ${y + 56}H${n(cx + 20)}" ${st} stroke-width="1.5"/>`;
      s += T.rotulo(cx, y + 34, 'SAL', { ancla: 'middle', tam: 16, peso: 700, min: M, max: W - M }) + T.rotulo(cx, y + 50, 'yodada', { ancla: 'middle', tam: 14, min: M, max: W - M });
    } else if (que === 'clavo') {
      s += `<path d="M${n(cx - 11)} ${y + 8}H${n(cx + 11)}V${y + 13}H${n(cx - 11)}Z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`;
      s += `<path d="M${n(cx - 3.5)} ${y + 13}V${y + 60}L${n(cx)} ${y + 74}L${n(cx + 3.5)} ${y + 60}V${y + 13}Z" ${rel}/>`;
    } else if (que === 'cable') {
      // Un cable con su forro y los hilos de cobre a la vista en la punta.
      s += `<path d="M${n(cx - 30)} ${y + 62}C${n(cx - 30)} ${y + 22} ${n(cx + 2)} ${y + 66} ${n(cx + 8)} ${y + 30}" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round" stroke-opacity="0.3"/>`;
      s += `<path d="M${n(cx - 30)} ${y + 62}C${n(cx - 30)} ${y + 22} ${n(cx + 2)} ${y + 66} ${n(cx + 8)} ${y + 30}" ${st}/>`;
      s += `<path d="M${n(cx + 8)} ${y + 30}L${n(cx + 6)} ${y + 10}M${n(cx + 9)} ${y + 28}L${n(cx + 14)} ${y + 9}M${n(cx + 10)} ${y + 30}L${n(cx + 22)} ${y + 13}" ${st}/>`;
    } else if (que === 'anillo') {
      s += `<circle cx="${n(cx)}" cy="${y + 46}" r="22" ${rel}/><circle cx="${n(cx)}" cy="${y + 46}" r="15" fill="none" stroke="currentColor" stroke-width="2"/>`;
      s += `<path d="M${n(cx - 8)} ${y + 22}L${n(cx)} ${y + 8}L${n(cx + 8)} ${y + 22}Z" ${rel}/>`;
    } else if (que === 'probador') {
      // Una pila, un foquito y dos cables que se cierran con el material de abajo. prende: 0 nada, 1 poco, 2 fuerte.
      const p = o.prende || 0;
      s += `<rect x="${n(cx - 34)}" y="${y + 24}" width="16" height="34" rx="3" ${rel}/><rect x="${n(cx - 30)}" y="${y + 19}" width="8" height="5" fill="currentColor"/>`;
      s += `<path d="M${n(cx - 26)} ${y + 19}V${y + 13}H${n(cx + 12)}M${n(cx - 26)} ${y + 58}V${y + 68}H${n(cx - 12)}M${n(cx + 28)} ${y + 13}H${n(cx + 32)}V${y + 68}H${n(cx + 12)}" ${st} stroke-width="1.5"/>`;
      s += `<rect x="${n(cx - 12)}" y="${y + 63}" width="24" height="10" rx="2" fill="currentColor" fill-opacity="0.35" stroke="currentColor" stroke-width="2"/>`;
      s += `<circle cx="${n(cx + 20)}" cy="${y + 13}" r="8" fill="currentColor" fill-opacity="${p === 2 ? 0.55 : p === 1 ? 0.25 : 0.05}" stroke="currentColor" stroke-width="2"/>`;
      const rayos = p === 2 ? [-150, -120, -90, -60, -30] : p === 1 ? [-120, -90, -60] : [];
      s += rayos.map(a => { const r = a * Math.PI / 180; return `<path class="kit-rayo" d="M${n(cx + 20 + 11 * Math.cos(r))} ${n(y + 13 + 11 * Math.sin(r))}L${n(cx + 20 + (p === 2 ? 16 : 13.5) * Math.cos(r))} ${n(y + 13 + (p === 2 ? 16 : 13.5) * Math.sin(r))}" ${st}/>`; }).join('');
    } else if (que === 'cristal') {
      // Un grano de sal (un cubito) bajo la lupa.
      s += `<path d="M${n(cx - 22)} ${y + 34}L${n(cx - 6)} ${y + 26}L${n(cx + 10)} ${y + 34}V${y + 54}L${n(cx - 6)} ${y + 62}L${n(cx - 22)} ${y + 54}Z" ${rel}/>`;
      s += `<path d="M${n(cx - 22)} ${y + 34}L${n(cx - 6)} ${y + 42}L${n(cx + 10)} ${y + 34}M${n(cx - 6)} ${y + 42}V${y + 62}" ${st} stroke-width="1.5"/>`;
      s += `<circle cx="${n(cx + 12)}" cy="${y + 26}" r="17" fill="none" stroke="currentColor" stroke-width="3"/><path d="M${n(cx + 24)} ${y + 38}L${n(cx + 33)} ${y + 49}" ${st} stroke-width="5"/>`;
    } else if (que === 'salero') {
      s += `<path d="M${n(cx - 14)} ${y + 28}H${n(cx + 14)}L${n(cx + 18)} ${y + 72}H${n(cx - 18)}Z" ${rel}/>`;
      s += `<path d="M${n(cx - 15)} ${y + 28}V${y + 20}C${n(cx - 15)} ${y + 6} ${n(cx + 15)} ${y + 6} ${n(cx + 15)} ${y + 20}V${y + 28}Z" fill="currentColor" fill-opacity="0.35" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`;
      s += [[-6, 17], [0, 14], [6, 17]].map(([dx, dy]) => `<circle cx="${n(cx + dx)}" cy="${y + dy}" r="1.6" fill="currentColor"/>`).join('');
      s += `<path d="M${n(cx - 15)} ${y + 50}H${n(cx + 16)}" ${st} stroke-width="1.5" stroke-dasharray="3 3"/>`;
    } else if (que === 'romana') {
      // Balanza de resorte de mercado: argolla, cuerpo con su escala y gancho.
      s += `<circle cx="${n(cx)}" cy="${y + 9}" r="5" ${st}/><rect x="${n(cx - 9)}" y="${y + 14}" width="18" height="40" rx="4" ${rel}/>`;
      s += [22, 28, 34, 40, 46].map(dy => `<path d="M${n(cx - 4)} ${y + dy}H${n(cx + 4)}" ${st} stroke-width="1.5"/>`).join('');
      s += `<path d="M${n(cx)} ${y + 54}V${y + 62}C${n(cx)} ${y + 74} ${n(cx - 12)} ${y + 72} ${n(cx - 10)} ${y + 64}" ${st}/>`;
    } else if (que === 'soga') {
      // Dos personas jalan una soga; el nudo del medio es lo que se disputan.
      // Cada uno se inclina hacia afuera, con el pie de adelante clavado, y jala con las dos manos.
      const persona = (x, lado) => `<circle cx="${n(x + 4 * lado)}" cy="${y + 20}" r="6" ${rel}/><path d="M${n(x + 3 * lado)} ${y + 26}L${n(x)} ${y + 50}M${n(x)} ${y + 50}L${n(x - 8 * lado)} ${y + 70}M${n(x)} ${y + 50}L${n(x + 4 * lado)} ${y + 70}M${n(x + 2.5 * lado)} ${y + 31}L${n(x - 9 * lado)} ${y + 38}" ${st}/>`;
      s += persona(cx - 28, -1) + persona(cx + 28, 1);
      s += `<path d="M${n(cx - 19)} ${y + 38}H${n(cx + 19)}" ${st} stroke-width="3"/><circle cx="${n(cx)}" cy="${y + 38}" r="4.5" fill="currentColor"/>`;
    }
    if (que === 'globo') {
      s += `<path d="M${n(cx)} ${y + 4}C${n(cx + 23)} ${y + 4} ${n(cx + 23)} ${y + 34} ${n(cx)} ${y + 50}C${n(cx - 23)} ${y + 34} ${n(cx - 23)} ${y + 4} ${n(cx)} ${y + 4}Z" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`;
      s += `<path d="M${n(cx - 4)} ${y + 55}L${n(cx)} ${y + 50}L${n(cx + 4)} ${y + 55}Z" fill="currentColor"/>`;
      s += `<path d="M${n(cx)} ${y + 55}C${n(cx + 7)} ${y + 62} ${n(cx - 7)} ${y + 68} ${n(cx)} ${y + 76}" ${st} stroke-width="1.5"/>`;
      s += `<path d="M${n(cx - 11)} ${y + 20}C${n(cx - 11)} ${y + 14} ${n(cx - 7)} ${y + 10} ${n(cx - 3)} ${y + 10}" ${st} stroke-opacity="0.6"/>`;
    } else if (que === 'letrero') {
      s += `<path d="M${n(cx - 22)} ${y + 2}V${y + 16}M${n(cx + 22)} ${y + 2}V${y + 16}" ${st} stroke-width="1.5"/>`;
      s += `<rect x="${n(cx - 37)}" y="${y + 16}" width="74" height="44" rx="6" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="2"/>`;
      s += `<rect x="${n(cx - 32)}" y="${y + 21}" width="64" height="34" rx="9" fill="none" stroke="currentColor" stroke-width="6" stroke-opacity="0.18"/>`;
      s += `<rect x="${n(cx - 32)}" y="${y + 21}" width="64" height="34" rx="9" fill="none" stroke="currentColor" stroke-width="2"/>`;
      s += T.rotulo(cx, y + 43, 'ABIERTO', { ancla: 'middle', tam: 14, peso: 700, min: M, max: W - M });
    } else if (que === 'foco') {
      s += `<path d="M${n(cx - 9)} ${y + 48}C${n(cx - 9)} ${y + 40} ${n(cx - 21)} ${y + 36} ${n(cx - 21)} ${y + 23}A21 21 0 0 1 ${n(cx + 21)} ${y + 23}C${n(cx + 21)} ${y + 36} ${n(cx + 9)} ${y + 40} ${n(cx + 9)} ${y + 48}Z" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`;
      s += `<path d="M${n(cx - 5)} ${y + 46}V${y + 34}L${n(cx - 2.5)} ${y + 28}L${n(cx)} ${y + 34}L${n(cx + 2.5)} ${y + 28}L${n(cx + 5)} ${y + 34}V${y + 46}" ${st} stroke-width="1.5"/>`;
      s += `<rect x="${n(cx - 9)}" y="${y + 48}" width="18" height="16" rx="2" fill="currentColor" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/>`;
      s += `<path d="M${n(cx - 9)} ${y + 54}H${n(cx + 9)}M${n(cx - 9)} ${y + 59}H${n(cx + 9)}" ${st} stroke-width="1.5"/>`;
      s += `<path d="M${n(cx - 4)} ${y + 64}H${n(cx + 4)}L${n(cx + 2)} ${y + 69}H${n(cx - 2)}Z" fill="currentColor"/>`;
    }
    return `<g class="kit-objeto" data-objeto="${que}" data-prueba="si">${s}</g>`;
  }

  function dibujar(datos, estado = {}) {
    const corte = Math.max(0, estado.corte || 0), d = escena(datos, corte), P = plano(d), H = altoDe(datos);
    const ve = x => (x.desde || 0) <= corte && (x.hasta === undefined || corte <= x.hasta), nuevo = x => ((x.desde || 0) === corte && corte > 0 ? ' kit-nuevo kit-aparece' : '');
    let s = '';
    for (const e of P.extras) {
      if (e.tipo === 'objeto') s += objeto(e.que, e.cx, e.y, e);
      else if (e.tipo === 'esfera') {
        if ((e.e.desde || 0) > corte) continue;
        const x = e.e, punteado = x.oculto ? ' stroke-dasharray="4 3"' : '';
        s += `<g class="kit-esfera${(x.desde || 0) === corte && corte > 0 ? ' kit-nuevo kit-aparece' : ''}"><circle cx="${n(e.cx)}" cy="${e.cy}" r="${n(e.r)}" fill="${T.color('i')}" fill-opacity="${x.oculto ? 0.06 : 0.22}" stroke="${T.color('i')}" stroke-width="2"${punteado}/>`
          + T.rotulo(e.cx, 20, x.s, { ancla: 'middle', tam: 16, peso: 700, min: M, max: W - M })
          + T.rotulo(e.cx, 110, x.oculto ? '? pm' : `${Kit.formatear(x.r, 1).replace(/,0$/, '')} pm`, { ancla: 'middle', tam: 14, peso: 600, color: 'i', clase: 'kit-num', min: M, max: W - M })
          + (x.p !== undefined ? T.rotulo(e.cx, 127, `${x.p} p⁺`, { ancla: 'middle', tam: 14, color: 'o', clase: 'kit-num', min: M, max: W - M }) : '')
          + (x.e !== undefined ? T.rotulo(e.cx, x.p !== undefined ? 144 : 127, `${x.e} e⁻`, { ancla: 'middle', tam: 14, clase: 'kit-num', min: M, max: W - M }) : '') + '</g>';
      }
      else if (e.tipo === 'barra') {
        const b = e.b, c = T.color(d.color || 'h'), txt = b.oculto ? '?' : d.decimales ? Kit.formatear(b.v, d.decimales) : String(b.v);
        s += `<g class="kit-barra">${b.oculto ? '' : `<rect x="${n(e.cx - e.w / 2)}" y="${n(e.base - e.h)}" width="${n(e.w)}" height="${n(e.h)}" rx="2" fill="${c}" fill-opacity="0.75"/>`}`
          + (b.marca ? `<rect x="${n(e.cx - e.w / 2 - 3)}" y="${n(e.base - e.h - 22)}" width="${n(e.w + 6)}" height="${n(e.h + 44)}" rx="5" fill="none" stroke="${c}" stroke-width="3"/>` : '')
          + T.rotulo(e.cx, e.base - e.h - 6, txt, { ancla: 'middle', tam: 14, peso: 600, color: d.color || 'h', clase: 'kit-num', min: M, max: W - M })
          + T.rotulo(e.cx, e.base + 18, b.s, { ancla: 'middle', tam: 15, peso: 700, min: M, max: W - M }) + '</g>';
      }
      else if (e.tipo === 'llave') s += `<path d="M${n(e.x1)} ${e.y - 3}V${e.y}H${n(e.x2)}V${e.y - 3}" fill="none" stroke="currentColor" stroke-width="1.5"/>`;
      else if (e.tipo === 'nombre') s += T.rotulo(e.cx, e.y, e.txt, { ancla: 'middle', tam: 15, min: M, max: W - M });
      else if (e.tipo === 'grupo') s += T.rotulo(e.cx, e.y, e.txt, { ancla: 'middle', tam: 14, clase: 'kit-num', min: M, max: W - M });
      else if (e.tipo === 'periodo') s += T.rotulo(e.x, e.y, e.txt, { ancla: 'end', tam: 14, clase: 'kit-num', min: M, max: W - M });
      else if (e.tipo === 'resumen') {
        const sim = d.simbolos || {};
        s += `<rect x="${n(e.x + 1)}" y="${n(e.y + 1)}" width="${n(e.w - 2)}" height="${n(e.h - 2)}" rx="4" fill="none" stroke="currentColor" stroke-width="1" stroke-opacity="0.55" stroke-dasharray="3 3"/>`;
        s += T.rotulo(e.x + e.w / 2, e.y + 21, `${sim[e.a] || e.a} a`, { ancla: 'middle', tam: 14, min: M, max: W - M }) + T.rotulo(e.x + e.w / 2, e.y + 38, String(sim[e.b] || e.b), { ancla: 'middle', tam: 14, min: M, max: W - M });
      }
    }
    if (P.vista === 'barras' && P.extras.length) s += `<path d="M${n(M + 2)} ${P.extras[0].base}H${n(W - M - 2)}" stroke="currentColor" stroke-width="1.5"/>`;
    for (const c of P.cartas) s += carta(d, c);
    // La fila (periodo) y la columna (grupo) marcadas, en la tabla.
    if (P.vista === 'tabla') {
      const f = d.fila, c = d.columna;
      if (f && ve(f) && f.periodo <= P.P) s += `<rect class="kit-fila${nuevo(f)}" x="${n(P.x0 - 1)}" y="${n(P.y0 + (f.periodo - 1) * CH - 1)}" width="${n(9 * P.cw + 2)}" height="${CH + 2}" rx="5" fill="none" stroke="${T.color(f.color || 'i')}" stroke-width="3"/>`;
      if (c && ve(c)) {
        const col = GRUPOS.indexOf(String(c.grupo)), y0 = P.y0 + (col === 0 || col === 8 ? 0 : col === 2 ? 3 * CH : CH);
        if (col >= 0) s += `<rect class="kit-columna${nuevo(c)}" x="${n(P.x0 + col * P.cw - 1)}" y="${n(y0 - 1)}" width="${P.cw + 2}" height="${n(P.y0 + P.P * CH - y0 + 2)}" rx="5" fill="none" stroke="${T.color(c.color || 'h')}" stroke-width="3"/>`;
      }
    }
    for (const c of columnasFamilia(d, P)) s += `<rect class="kit-columna" x="${n(c.x - 1)}" y="${n(c.y - 1)}" width="${n(c.w + 2)}" height="${n(c.h + 2)}" rx="6" fill="none" stroke="${T.color('h')}" stroke-width="3"/>`;
    for (const r of (d.resaltar || []).filter(ve)) {
      const c = P.cartas.find(x => x.Z === r.Z); if (!c) continue;
      s += `<rect class="kit-resalta${nuevo(r)}" x="${n(c.x)}" y="${n(c.y)}" width="${n(c.w)}" height="${n(c.h)}" rx="5" fill="none" stroke="${T.color(r.color)}" stroke-width="3"/>`;
    }
    // La escalera: a su izquierda, los metales; a su derecha, los semimetales y los no metales. Va encima de los marcos de
    // las casillas resaltadas, para que el marco del aluminio no la tape (lector en frío, 19 nov).
    if (P.vista === 'tabla' && d.escalera) {
      const X = c => P.x0 + c * P.cw, Y = p => P.y0 + (p - 1) * CH, pts = [[X(3), Y(2)], [X(3), Y(3)], [X(4), Y(3)]];
      if (P.P >= 5) pts.push([X(4), Y(5)], [X(5), Y(5)]); else pts.push([X(4), Y(P.P + 1)]);
      if (P.P >= 6) pts.push([X(5), Y(6)], [X(6), Y(6)], [X(6), Y(Math.min(P.P, 6) + 1)]); else if (P.P === 5) pts.push([X(5), Y(6)]);
      s += `<path class="kit-escalera" d="M${pts.map(p => `${n(p[0])} ${n(p[1])}`).join('L')}" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>`;
    }
    const pr = probadorEn(d, P);
    if (pr) s += `<g transform="translate(${n(pr.tx)} ${n(pr.ty)}) scale(${PR_ESCALA})">${objeto('probador', 0, 0, d.probador)}</g>`;
    if (d.rotulo) s += T.rotulo(M + 4, P.H - 8, d.rotulo, { peso: 700, color: d.rotuloColor, min: M, max: W - M });
    return T.svg(W, H, s, { alt: alt(datos, estado) });
  }

  // El probador chico de la tabla: el objeto mide de x = −34 a 33 y de y = −3 a 73 (con sus rayos); a escala 0,6 cabe en
  // la fila 1, entre las columnas 2 y 17, que están vacías.
  const PR_ESCALA = 0.6;
  function probadorEn(d, P) {
    if (P.vista !== 'tabla' || !d.probador) return null;
    const tx = P.x0 + 4.5 * P.cw, ty = P.y0 + 4;
    return { tx, ty, x0: tx - 34 * PR_ESCALA, x1: tx + 33 * PR_ESCALA, y0: ty - 3 * PR_ESCALA, y1: ty + 73 * PR_ESCALA };
  }
  function geometria(datos, estado = {}) {
    const corte = Math.max(0, estado.corte || 0), d = escena(datos, corte), P = plano(d), H = altoDe(datos), textos = [], objetos = [];
    const caja = (que, txt, x, y, tam, peso, ancla = 'start') => {
      const w = T.ancho(txt, tam, peso), xx = T.encajar(x, txt, ancla, { tam, peso, min: M, max: W - M });
      const x0 = ancla === 'middle' ? xx - w / 2 : ancla === 'end' ? xx - w : xx;
      textos.push({ que, txt, x0, x1: x0 + w, y0: y - 0.74 * tam, y1: y + 0.2 * tam });
    };
    for (const e of P.extras) {
      if (e.tipo === 'llave') continue;
      if (e.tipo === 'esfera') {
        if ((e.e.desde || 0) > corte) continue;
        const x = e.e;
        objetos.push({ que: `esfera ${x.s}`, x0: e.cx - e.r - 1, x1: e.cx + e.r + 1, y0: e.cy - e.r - 1, y1: e.cy + e.r + 1, r: e.r, oculto: !!x.oculto });
        caja('etiqueta', x.s, e.cx, 20, 16, 700, 'middle');
        caja('radio', x.oculto ? '? pm' : `${Kit.formatear(x.r, 1).replace(/,0$/, '')} pm`, e.cx, 110, 14, 600, 'middle');
        if (x.p !== undefined) caja('protones', `${x.p} p⁺`, e.cx, 127, 14, 400, 'middle');
        if (x.e !== undefined) caja('electrones', `${x.e} e⁻`, e.cx, x.p !== undefined ? 144 : 127, 14, 400, 'middle');
        continue;
      }
      if (e.tipo === 'barra') {
        const b = e.b;
        objetos.push({ que: `barra ${b.s}`, x0: e.cx - e.w / 2, x1: e.cx + e.w / 2, y0: e.base - e.h, y1: e.base, h: e.h, v: b.v, marco: true });
        caja('valor', b.oculto ? '?' : d.decimales ? Kit.formatear(b.v, d.decimales) : String(b.v), e.cx, e.base - e.h - 6, 14, 600, 'middle');
        caja('etiqueta', b.s, e.cx, e.base + 18, 15, 700, 'middle');
        continue;
      }
      if (e.tipo === 'objeto') {
        objetos.push({ que: `objeto ${e.que}`, x0: e.cx - e.w / 2, x1: e.cx + e.w / 2, y0: e.y, y1: e.y + e.h, marco: e.que === 'letrero' || e.que === 'sal' });
        if (e.que === 'letrero') caja('letrero', 'ABIERTO', e.cx, e.y + 43, 14, 700, 'middle');
        if (e.que === 'sal') { caja('sal', 'SAL', e.cx, e.y + 34, 16, 700, 'middle'); caja('sal', 'yodada', e.cx, e.y + 50, 14, 400, 'middle'); }
      } else if (e.tipo === 'nombre') caja('nombre', e.txt, e.cx, e.y, 15, 400, 'middle');
      else if (e.tipo === 'grupo') caja('grupo', e.txt, e.cx, e.y, 14, 400, 'middle');
      else if (e.tipo === 'periodo') caja('periodo', e.txt, e.x, e.y, 14, 400, 'end');
      else if (e.tipo === 'resumen') {
        const sim = d.simbolos || {};
        objetos.push({ que: 'resumen', x0: e.x, x1: e.x + e.w, y0: e.y, y1: e.y + e.h, marco: true });
        caja('resumen', `${sim[e.a] || e.a} a`, e.x + e.w / 2, e.y + 21, 14, 400, 'middle'); caja('resumen', String(sim[e.b] || e.b), e.x + e.w / 2, e.y + 38, 14, 400, 'middle');
      }
    }
    for (const c of P.cartas) {
      const oculto = (d.ocultos || []).includes(c.Z), m = (d.marcas || {})[c.Z];
      objetos.push({ que: `carta ${c.Z}`, Z: c.Z, col: c.col, fila: c.fila, per: c.per, x0: c.x, x1: c.x + c.w, y0: c.y, y1: c.y + c.h, marco: true });
      if ((d.incognitas || []).includes(c.Z)) { caja('simbolo', '?', c.x + c.w / 2, c.y + 30, 18, 700, 'middle'); continue; }
      caja('Z', String(c.Z), c.x + c.w / 2, c.y + 15, 14, pesoZ(c), 'middle');
      caja('simbolo', oculto ? '?' : (d.simbolos || {})[c.Z] || '', c.x + c.w / 2, c.y + 32, tamSimbolo(c), 700, 'middle');
      if (m && !oculto) objetos.push({ que: `marca ${m}`, x0: c.x + c.w / 2 - 5.5, x1: c.x + c.w / 2 + 5.5, y0: c.y + 36, y1: c.y + 46 });
    }
    const pr = probadorEn(d, P);
    if (pr) objetos.push({ que: 'objeto probador', x0: pr.x0, x1: pr.x1, y0: pr.y0, y1: pr.y1 });
    const columnas = columnasFamilia(d, P);
    for (const c of columnas) objetos.push({ que: `columna ${c.marca}`, x0: c.x - 2.5, x1: c.x + c.w + 2.5, y0: c.y - 2.5, y1: c.y + c.h + 2.5, marco: true });
    if (d.rotulo) caja('rotulo', d.rotulo, M + 4, P.H - 8, 16, 700);
    return { W, H, M, textos, objetos, columnas: columnas.map(c => c.marca), vista: P.vista, escalera: !!(P.vista === 'tabla' && d.escalera) };
  }

  function alt(datos, estado = {}) {
    if (datos.alt) return datos.alt;
    const d = escena(datos, Math.max(0, estado.corte || 0)), P = plano(d), sim = d.simbolos || {}, m = d.marcas || {}, oc = d.ocultos || [];
    const inc = d.incognitas || [];
    const una = Z => (inc.includes(Z) ? 'una tarjeta con «?»' : oc.includes(Z) ? `Z = ${Z}, «?»` : `${sim[Z] || '?'} (Z = ${Z}${m[Z] ? `, ${NOMBRE_MARCA[m[Z]]}` : ''})`);
    let txt;
    const NOMBRE_OBJETO = { globo: 'un globo', letrero: 'un letrero luminoso', foco: 'un foco', sal: 'una bolsa de sal yodada', clavo: 'un clavo', cable: 'un cable', anillo: 'un anillo',
      probador: 'un probador con pila y foquito', cristal: 'un grano de sal bajo una lupa', salero: 'un salero', romana: 'una balanza de resorte', soga: 'dos personas que jalan una soga' };
    const prende = o => (o.que === 'probador' ? [' (el foquito no prende)', ' (el foquito prende muy poco)', ' (el foquito prende fuerte)'][o.prende || 0] : '');
    if (P.vista === 'objetos') txt = `${(d.objetos || []).length === 3 ? 'Tres objetos' : 'Objetos'}${(d.objetos || []).some(o => o.Z) ? ' con la tarjeta de su elemento' : ''}: ${(d.objetos || []).map(o => `${NOMBRE_OBJETO[o.que]}${prende(o)}${o.nombre || sim[o.Z] ? `, ${o.nombre || sim[o.Z]}` : ''}${o.Z ? ` (Z = ${o.Z})` : ''}`).join('; ')}.`;
    else if (P.vista === 'esferas') txt = `Átomos o iones dibujados como círculos a escala: ${(d.esferas || []).map(x => `${x.s}, ${x.oculto ? 'radio «?»' : `${Kit.formatear(x.r, 1).replace(/,0$/, '')} pm`}${x.p !== undefined ? `, ${x.p} protones` : ''}${x.e !== undefined ? `, ${x.e} electrones` : ''}`).join('; ')}.`;
    else if (P.vista === 'barras') txt = `Barras a la misma escala, desde 0${d.nombre ? `, de ${d.nombre}` : ''}: ${(d.barras || []).map(b => `${b.s} ${b.oculto ? '«?»' : d.decimales ? Kit.formatear(b.v, d.decimales) : String(b.v)}`).join(', ')}.`;
    else if (P.vista === 'transicion') txt = `Los grupos 3 a 12 de la tabla periódica (IIIB a IIB), periodos 4 y 5: ${P.cartas.filter(c => (d.resaltar || []).some(r => r.Z === c.Z) || oc.includes(c.Z) || inc.includes(c.Z)).map(c => `${una(c.Z)} en el periodo ${c.per}, grupo ${c.col + 3}`).join('; ') || 'del escandio al cinc y del itrio al cadmio'}.`;
    else if (P.vista === 'tabla') txt = `Tabla periódica, periodos 1 a ${P.P}, con los grupos 1, 2 y 13 a 18 y los grupos 3 a 12 resumidos: ${P.cartas.filter(c => m[c.Z] || oc.includes(c.Z) || inc.includes(c.Z) || (d.resaltar || []).some(r => r.Z === c.Z)).map(c => `${una(c.Z)} en el periodo ${c.per}, grupo ${GRUPOS[c.col]}`).join('; ')}.`;
    else {
      const filas = [...new Set(P.cartas.map(c => c.fila))].map(f => P.cartas.filter(c => c.fila === f).map(c => una(c.Z)).join(', '));
      const cols = columnasFamilia(d, P).map(c => NOMBRE_MARCA[c.marca]);
      txt = `Tarjetas de elementos en orden de Z, en filas de ${P.k}: ${filas.map((f, i) => `fila ${i + 1}: ${f}`).join('. ')}.${cols.length ? ` Quedan en una misma columna: ${cols.join('; ')}.` : ''}`;
    }
    if (P.vista === 'tabla' && d.probador) txt += ` Arriba, ${NOMBRE_OBJETO.probador}${prende({ que: 'probador', prende: d.probador.prende })}.`;
    return txt + (d.rotulo ? ` ${d.rotulo}.` : '');
  }

  return { id: 'quim-tira', dibujar, alt, geometria, lugarTabla, zTabla, constantes: { W, M, CH, NOBLES, GRUPOS } };
});
