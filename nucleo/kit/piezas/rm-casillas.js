/*
 * Pieza «rm-casillas» (26 nov 2026, etapa 9): los objetos de «Arreglos numéricos y cuadrados mágicos», dibujados por la
 * sesión como prueba (data-prueba; Gerson decide después cuáles reemplaza): el juego de tarjetas de la kermés del colegio.
 * La usa contenido/teoria/razonamiento-matematico/arreglos-numericos.js.
 *
 * Afirmación de la figura: cada tarjeta está en un lugar, y cada línea (fila, columna, lado o grupo) suma o multiplica las
 * tarjetas que tiene. Una tarjeta compartida está en dos líneas a la vez; lo que se pide va con «?» hasta resolver.
 *
 * Escenas:
 *   'bandeja'  una bandeja de madera con filas de tarjetas (o tiras de cartulina que multiplican, con op: '×'); a la
 *              derecha de cada fila, su resultado. Las columnas se pueden tocar (toques: un control por columna).
 *   'cruz'     una bandeja en cruz: una fila y una columna de tres que comparten la tarjeta del centro.
 *   'marco'    un marco de madera con forma de polígono (3, 4 o 5 lados), con una tarjeta en cada esquina y una a mitad de
 *              cada lado; fuera de cada lado, lo que suma.
 *   'tablero'  un tablero de madera de n × n casillas; líneas resaltadas (fila, columna, diagonal) y la suma de cada fila.
 *   'muro'     un muro de adobes en pirámide: cada adobe, la suma de los dos de abajo; bajo la base, cuántas veces sube cada
 *              adobe (pesos).
 *
 * Tarjeta: { t: '7' | '?' | '', papel, desde, hueco: true (lugar vacío, punteado), rep: true (número repetido: punteado
 *   y tenue), toque: 'id del control' (zona para tocar) }; un texto suelto vale como { t }.
 * Papeles de color (la unidad los fija; quien llama dice el papel, no el color; sin verde ni carmín):
 *   total ....... naranja (o): el total de todos los números (en una nota)
 *   compartida .. turquesa (i): lo que se cuenta de más: las esquinas, el centro, la casilla común, los pesos
 *   seguro ...... violeta (f): lo pedido, ya comprobado (solo al resolver)
 *   tenue ....... gris: lo que ya no cuenta
 *   (sin papel) . tinta: la madera, las tarjetas, los números
 * PAPELES lo exporta para las pruebas de la unidad.
 *
 * datos = {
 *   escena, meta: 'texto' (línea de arriba), nota: 'texto' | [{ t, papel, desde }], notas: n (líneas reservadas)
 *   bandeja: filas: [{ cartas: [tarjeta], rotulo, resultado: tarjeta }], op: '+' | '×', ranuras: n (lugares por fila),
 *            toques: ['c0', 'c1', …] (una zona por columna), conResultado: true (reserva el sitio del resultado)
 *   cruz:    centro, izq, der, arriba, abajo: tarjeta; fila, columna: tarjeta (lo que suman)
 *   marco:   lados: 3 | 4 | 5, esquinas: [tarjeta], medios: [tarjeta] (el del lado k va entre la esquina k y la k + 1),
 *            sumas: [tarjeta] (fuera de cada lado)
 *   tablero: celdas: [[tarjeta]], lineas: [{ tipo: 'fila' | 'columna' | 'diagonal' | 'contra', k, papel, desde }],
 *            sumas: [tarjeta] (a la derecha de cada fila), conSumas: true (reserva el sitio)
 *   muro:    filas: [[tarjeta]] de arriba abajo (la fila k tiene k + 1 adobes), pesos: [tarjeta] (bajo la base)
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
  const W = 320, M = 4, TAM = 14, NUM = 18, NOTA = 22, TENUE = 0.45;
  const PAPELES = { total: 'o', compartida: 'i', seguro: 'f', tenue: 'tenue' };
  const n = T.n;
  const CAJA = ' data-caja="si"';
  const tok = p => PAPELES[p] && PAPELES[p] !== 'tenue' ? PAPELES[p] : undefined;
  const col = p => (tok(p) ? `var(--c-${tok(p)})` : 'currentColor');
  const norm = x => (x === null || x === undefined ? null : typeof x === 'object' ? x : { t: String(x) });
  const ve = (x, corte) => !x || (x.desde || 0) <= corte;
  const notasDe = d => (d.nota === undefined ? [] : Array.isArray(d.nota) ? d.nota : [{ t: d.nota }]);
  const marcaSeguro = p => (p === 'seguro' ? ' data-marca="seguro"' : '');
  const g = (p, s) => `<g class="kit-aparece"${marcaSeguro(p)}${p === 'tenue' ? ` opacity="${TENUE}"` : ''}>${s}</g>`;
  const esc = T.esc;

  // Una tarjeta de cartulina centrada en (cx, cy), de w × h, con su número. Lo pedido va con «?».
  function tarjeta(x, cx, cy, w, h, corte, o = {}) {
    const c = norm(x);
    if (!c) return '';
    let s = '';
    const visible = ve(c, corte);
    const x0 = cx - w / 2, y0 = cy - h / 2;
    if (c.hueco || !visible) {
      s += `<rect${CAJA} x="${n(x0)}" y="${n(y0)}" width="${n(w)}" height="${n(h)}" rx="6" fill="var(--card)" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.45" stroke-dasharray="4 4"/>`;
    } else {
      const p = c.papel, cc = col(p);
      s += g(p === 'seguro' || p === 'compartida' ? p : c.rep ? 'tenue' : undefined,
        (tok(p) ? `<rect${CAJA} x="${n(x0)}" y="${n(y0)}" width="${n(w)}" height="${n(h)}" rx="6" fill="var(--card)"/>` : '')
        + `<rect${CAJA} x="${n(x0)}" y="${n(y0)}" width="${n(w)}" height="${n(h)}" rx="6" fill="${tok(p) ? cc : 'var(--card)'}" fill-opacity="${tok(p) ? 0.14 : 1}" stroke="${cc}" stroke-width="2"${c.rep ? ' stroke-dasharray="5 4"' : ''}/>`
        + (c.t !== undefined && c.t !== '' ? T.rotulo(cx, cy + NUM * 0.36, String(c.t), { ancla: 'middle', tam: o.tam || NUM, peso: 700, color: tok(p), min: x0 + 1, max: x0 + w - 1 }) : ''));
    }
    if (c.toque) s += `<rect class="rm-toque" data-toque="${esc(c.toque)}" x="${n(x0 - 2)}" y="${n(y0 - 2)}" width="${n(w + 4)}" height="${n(h + 4)}" fill="transparent"><title>${esc(o.titulo || 'Tocar para cambiar')}</title></rect>`;
    return s;
  }
  // Un rótulo suelto (la suma de una línea) con su papel; si es «?», en tinta.
  function rot(x, cx, y, corte, o = {}) {
    const c = norm(x);
    if (!c || !ve(c, corte) || c.t === undefined || c.t === '') return '';
    return g(c.papel, T.rotulo(cx, y, String(c.t), { ancla: o.ancla || 'middle', tam: o.tam || 16, peso: 700, color: tok(c.papel), min: o.min === undefined ? M : o.min, max: o.max === undefined ? W - M : o.max }));
  }
  const anchoTxt = (x, tam = 16) => { const c = norm(x); return c && c.t !== undefined ? T.ancho(String(c.t), tam, 700) : 0; };

  // ---------- Bandeja (o tiras que multiplican) ----------
  function geoBandeja(d, y) {
    const filas = d.filas || [], nr = Math.max(d.ranuras || 0, ...filas.map(f => (f.cartas || []).length), 1);
    const rotW = filas.some(f => f.rotulo) ? Math.min(96, Math.max(...filas.map(f => (f.rotulo ? T.ancho(f.rotulo, TAM, 700) + 10 : 0)))) : 0;
    const resW = d.conResultado || filas.some(f => f.resultado) ? Math.max(54, ...filas.map(f => anchoTxt(f.resultado) + 26)) : 0;
    const libre = W - 2 * M - 12 - rotW - resW;
    const paso = Math.min(70, libre / nr), cw = paso - 10, ch = Math.min(54, Math.max(40, paso - 10)), filaH = ch + 12;
    const anchoB = nr * paso + 12, x0 = M + 6 + rotW + Math.max(0, (libre - nr * paso) / 2);
    return { nr, rotW, resW, paso, cw, ch, filaH, x0, xB: x0 - 6 + 6, anchoB, yTop: y + 6, alto: 6 + filas.length * filaH + 10 + 6 };
  }
  function bandeja(d, G, corte) {
    const filas = d.filas || [];
    const bx = G.x0 - 2, by = G.yTop, bw = G.nr * G.paso + 4, bh = filas.length * G.filaH + 8;
    let s = `<rect${CAJA} x="${n(bx)}" y="${n(by)}" width="${n(bw)}" height="${n(bh)}" rx="10" fill="currentColor" fill-opacity="0.07" stroke="currentColor" stroke-width="2"/>`;
    filas.forEach((f, i) => {
      const cy = by + 4 + i * G.filaH + G.filaH / 2;
      if (i > 0) s += `<line${CAJA} x1="${n(bx + 6)}" y1="${n(by + 4 + i * G.filaH)}" x2="${n(bx + bw - 6)}" y2="${n(by + 4 + i * G.filaH)}" stroke="currentColor" stroke-width="1" stroke-opacity="0.35"/>`;
      for (let k = 0; k < G.nr; k++) {
        const cx = G.x0 + k * G.paso + G.paso / 2, c = (f.cartas || [])[k];
        s += c ? tarjeta(c, cx, cy, G.cw, G.ch, corte, { tam: G.cw < 34 ? 14 : NUM }) : '';
      }
      if (f.rotulo) s += T.rotulo(M + 2, cy + 5, f.rotulo, { tam: TAM, peso: 700, min: M, max: M + G.rotW - 4 });
      if (f.resultado) s += rot(f.resultado, bx + bw + 10, cy + 6, corte, { ancla: 'start', min: bx + bw + 6, max: W - M });
    });
    (d.toques || []).forEach((id, k) => {
      if (!id) return;
      s += `<rect class="rm-toque" data-toque="${esc(id)}" x="${n(G.x0 + k * G.paso + 2)}" y="${n(by)}" width="${n(G.paso - 4)}" height="${n(bh)}" fill="transparent"><title>Tocar para voltear la columna ${k + 1}</title></rect>`;
    });
    return `<g class="kit-objeto" data-objeto="bandeja" data-prueba="si">${s}</g>`;
  }

  // ---------- Cruz ----------
  const CZ = 46, CP = 54;
  function geoCruz(d, y) { return { cx: 118, cy: y + 8 + CP + CZ / 2, alto: 8 + 2 * CP + CZ + 30 }; }
  function cruz(d, G, corte) {
    const { cx, cy } = G, a = CZ / 2 + 6;
    // La bandeja en cruz: el contorno de una fila y una columna de tres lugares.
    const p = [[cx - CP - a, cy - a], [cx - a, cy - a], [cx - a, cy - CP - a], [cx + a, cy - CP - a], [cx + a, cy - a], [cx + CP + a, cy - a],
      [cx + CP + a, cy + a], [cx + a, cy + a], [cx + a, cy + CP + a], [cx - a, cy + CP + a], [cx - a, cy + a], [cx - CP - a, cy + a]];
    let s = `<path${CAJA} d="M${p.map(q => `${n(q[0])} ${n(q[1])}`).join('L')}Z" fill="currentColor" fill-opacity="0.07" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`;
    s += tarjeta(d.izq, cx - CP, cy, CZ, CZ, corte) + tarjeta(d.der, cx + CP, cy, CZ, CZ, corte)
      + tarjeta(d.arriba, cx, cy - CP, CZ, CZ, corte) + tarjeta(d.abajo, cx, cy + CP, CZ, CZ, corte)
      + tarjeta(d.centro, cx, cy, CZ, CZ, corte, { titulo: 'Tocar para cambiar el centro' });
    if (d.fila) s += g(undefined, T.rotulo(cx + CP + a + 10, cy - 8, 'fila', { tam: TAM, min: cx + CP + a + 6, max: W - M })) + rot(d.fila, cx + CP + a + 10, cy + 14, corte, { ancla: 'start', min: cx + CP + a + 6 });
    if (d.columna) s += g(undefined, T.rotulo(cx + a + 10, cy + CP + 4, 'columna', { tam: TAM, min: cx + a + 6, max: W - M })) + rot(d.columna, cx + a + 10, cy + CP + 24, corte, { ancla: 'start', min: cx + a + 6 });
    return `<g class="kit-objeto" data-objeto="cruz" data-prueba="si">${s}</g>`;
  }

  // ---------- Marco (polígono) ----------
  const CM = 40;
  function vertices(lados, cx, cy) {
    if (lados === 4) { const h = 78; return [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]]; }
    const R = lados === 3 ? 100 : 110;
    return Array.from({ length: lados }, (_, k) => { const a = -Math.PI / 2 + 2 * Math.PI * k / lados; return [cx + R * Math.cos(a), cy + R * Math.sin(a)]; });
  }
  function geoMarco(d, y) {
    const L = d.lados || 3, cx = W / 2;
    const top = L === 4 ? 78 : L === 3 ? 100 : 110, bot = L === 4 ? 78 : L === 3 ? 50 : 110 * Math.cos(Math.PI / 5);
    const conSumas = (d.sumas || []).length > 0 || d.conSumas;
    const yTop = y + CM / 2 + 6 + (conSumas && L === 4 ? 30 : 0);
    const cy = yTop + top, alto = (cy + bot + CM / 2 + (conSumas ? 34 : 6)) - y;
    return { L, cx, cy, alto, conSumas };
  }
  function marco(d, G, corte) {
    const V = vertices(G.L, G.cx, G.cy);
    let s = `<path${CAJA} d="M${V.map(q => `${n(q[0])} ${n(q[1])}`).join('L')}Z" fill="none" stroke="currentColor" stroke-width="10" stroke-opacity="0.22" stroke-linejoin="round"/>`;
    s += `<path${CAJA} d="M${V.map(q => `${n(q[0])} ${n(q[1])}`).join('L')}Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`;
    for (let k = 0; k < G.L; k++) {
      const a = V[k], b = V[(k + 1) % G.L], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      s += tarjeta((d.medios || [])[k], mx, my, CM, CM, corte);
      const su = (d.sumas || [])[k];
      if (su) {
        // Fuera del lado, sobre la normal que sale del centro.
        const vx = mx - G.cx, vy = my - G.cy, L = Math.hypot(vx, vy) || 1, dist = CM / 2 + 18;
        const tx = mx + vx / L * dist, ty = my + vy / L * dist + 6;
        s += rot(su, tx, ty, corte);
      }
    }
    V.forEach(([x, y], k) => { s += tarjeta((d.esquinas || [])[k], x, y, CM, CM, corte, { titulo: 'Tocar para cambiar la esquina' }); });
    return `<g class="kit-objeto" data-objeto="marco" data-prueba="si">${s}</g>`;
  }

  // ---------- Tablero ----------
  function geoTablero(d, y) {
    const nf = (d.celdas || []).length, nc = Math.max(1, ...(d.celdas || [[]]).map(f => f.length));
    const resW = d.conSumas || (d.sumas || []).length ? Math.max(40, ...(d.sumas || []).map(x => anchoTxt(x) + 16)) : 0;
    const cs = Math.min(54, (W - 2 * M - 12 - resW) / nc);
    const x0 = M + 6 + Math.max(0, (W - 2 * M - 12 - resW - cs * nc) / 2);
    return { nf, nc, cs, x0, y0: y + 8, resW, alto: 8 + nf * cs + 10 };
  }
  function tablero(d, G, corte) {
    const { cs, x0, y0, nf, nc } = G;
    let s = `<rect${CAJA} x="${n(x0 - 5)}" y="${n(y0 - 5)}" width="${n(nc * cs + 10)}" height="${n(nf * cs + 10)}" rx="8" fill="currentColor" fill-opacity="0.07" stroke="currentColor" stroke-width="2"/>`;
    for (const L of d.lineas || []) {
      if (!ve(L, corte)) continue;
      const c = col(L.papel);
      if (L.tipo === 'fila') s += g(L.papel, `<rect${CAJA} x="${n(x0 + 1)}" y="${n(y0 + L.k * cs + 1)}" width="${n(nc * cs - 2)}" height="${n(cs - 2)}" rx="6" fill="${c}" fill-opacity="0.16"/>`);
      else if (L.tipo === 'columna') s += g(L.papel, `<rect${CAJA} x="${n(x0 + L.k * cs + 1)}" y="${n(y0 + 1)}" width="${n(cs - 2)}" height="${n(nf * cs - 2)}" rx="6" fill="${c}" fill-opacity="0.16"/>`);
      else {
        const a = L.tipo === 'diagonal' ? [x0 + 6, y0 + 6, x0 + nc * cs - 6, y0 + nf * cs - 6] : [x0 + nc * cs - 6, y0 + 6, x0 + 6, y0 + nf * cs - 6];
        s += g(L.papel, `<line${CAJA} x1="${n(a[0])}" y1="${n(a[1])}" x2="${n(a[2])}" y2="${n(a[3])}" stroke="${c}" stroke-width="10" stroke-opacity="0.28" stroke-linecap="round"/>`);
      }
    }
    (d.celdas || []).forEach((fila, f) => fila.forEach((x, k) => {
      s += tarjeta(x, x0 + k * cs + cs / 2, y0 + f * cs + cs / 2, cs - 8, cs - 8, corte, { tam: cs < 44 ? 16 : NUM });
    }));
    (d.sumas || []).forEach((x, f) => { s += rot(x, x0 + nc * cs + 12, y0 + f * cs + cs / 2 + 6, corte, { ancla: 'start', min: x0 + nc * cs + 8 }); });
    return `<g class="kit-objeto" data-objeto="tablero" data-prueba="si">${s}</g>`;
  }

  // ---------- Muro de adobes ----------
  function geoMuro(d, y) {
    const filas = d.filas || [], nb = Math.max(1, ...filas.map(f => f.length));
    const bw = Math.min(66, (W - 2 * M - 12) / nb), bh = 40;
    const conPesos = (d.pesos || []).length > 0 || d.conPesos;
    return { nb, bw, bh, yTop: y + 6, alto: 6 + filas.length * bh + (conPesos ? 32 : 6) };
  }
  function muro(d, G, corte) {
    const filas = d.filas || [];
    let s = '';
    filas.forEach((f, i) => {
      const k = f.length, x0 = W / 2 - k * G.bw / 2, cy = G.yTop + i * G.bh + G.bh / 2;
      f.forEach((x, j) => { s += tarjeta(x, x0 + j * G.bw + G.bw / 2, cy, G.bw - 4, G.bh - 4, corte); });
    });
    const base = filas[filas.length - 1] || [], x0 = W / 2 - base.length * G.bw / 2, yb = G.yTop + filas.length * G.bh;
    s += `<line${CAJA} x1="${n(Math.max(M + 1, x0 - 6))}" y1="${n(yb + 1)}" x2="${n(Math.min(W - M - 1, x0 + base.length * G.bw + 6))}" y2="${n(yb + 1)}" stroke="currentColor" stroke-width="2"/>`;
    (d.pesos || []).forEach((x, j) => { s += rot(x, x0 + j * G.bw + G.bw / 2, yb + 24, corte); });
    return `<g class="kit-objeto" data-objeto="muro" data-prueba="si">${s}</g>`;
  }

  // ---------- Geometría común ----------
  const GEO = { bandeja: geoBandeja, cruz: geoCruz, marco: geoMarco, tablero: geoTablero, muro: geoMuro };
  const DIB = { bandeja, cruz, marco, tablero, muro };
  function geometria(d) {
    let y = M;
    const G = { yMeta: y };
    if (d.meta) y += 24;
    if (GEO[d.escena]) { Object.assign(G, GEO[d.escena](d, y)); y += G.alto; }
    const nNotas = Math.max(d.notas || 0, notasDe(d).length);
    G.yNota = y; G.nNotas = nNotas;
    y += nNotas * NOTA;
    G.altoTotal = Math.max(y + M, 40);
    return G;
  }

  function dibujar(d, e = {}) {
    const corte = e.corte || 0, G = geometria(d);
    let s = '';
    if (d.meta) s += T.rotulo(M + 2, G.yMeta + 16, d.meta, { tam: TAM, peso: 700, min: M, max: W - M });
    if (DIB[d.escena]) s += DIB[d.escena](d, G, corte);
    notasDe(d).forEach((x, k) => { if (ve(x, corte)) s += g(x.papel, T.rotulo(M + 2, G.yNota + 16 + k * NOTA, x.t, { tam: TAM, peso: tok(x.papel) ? 700 : 400, color: tok(x.papel), min: M, max: W - M })); });
    return T.svg(W, G.altoTotal, s, { alt: alt(d) });
  }

  // ---------- Texto alternativo ----------
  const tt = x => { const c = norm(x); return !c ? '' : c.hueco ? 'lugar vacío' : c.t === '?' ? 'una tarjeta con «?»' : String(c.t); };
  const lista = xs => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}` : xs.join(''));
  function alt(d) {
    const partes = [];
    if (d.meta) partes.push(d.meta);
    if (d.escena === 'bandeja') partes.push(`${d.op === '×' ? 'Tiras de cartulina que multiplican' : 'Bandeja de madera con tarjetas'}: ${(d.filas || []).map((f, i) => `${f.rotulo || `fila ${i + 1}`}, ${lista((f.cartas || []).map(tt))}${f.resultado ? `, da ${tt(f.resultado)}` : ''}`).join('; ')}`);
    if (d.escena === 'cruz') partes.push(`Bandeja en cruz: fila ${lista([d.izq, d.centro, d.der].map(tt))}; columna ${lista([d.arriba, d.centro, d.abajo].map(tt))}; el centro, ${tt(d.centro)}, está en las dos`);
    if (d.escena === 'marco') partes.push(`Marco de madera de ${d.lados || 3} lados: esquinas ${lista((d.esquinas || []).map(tt))}; a mitad de cada lado, ${lista((d.medios || []).map(tt))}`);
    if (d.escena === 'tablero') partes.push(`Tablero de ${(d.celdas || []).length} por ${Math.max(0, ...(d.celdas || [[]]).map(f => f.length))}, por filas: ${(d.celdas || []).map(f => f.map(tt).join(', ')).join('; ')}`);
    if (d.escena === 'muro') partes.push(`Muro de adobes en pirámide, de arriba abajo: ${(d.filas || []).map(f => f.map(tt).join(', ')).join('; ')}${(d.pesos || []).length ? `; bajo la base, ${lista(d.pesos.map(tt))}` : ''}`);
    for (const x of notasDe(d)) partes.push(x.t);
    return (partes.length ? partes.join('. ') : 'Tarjetas con números en sus lugares') + '.';
  }

  return { id: 'rm-casillas', dibujar, alt, geometria, vertices, PAPELES, constantes: { W, CM, CZ, CP } };
});
