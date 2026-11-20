/*
 * Pieza «rm-patrones» (19 nov 2026, etapa 8): los objetos de «Razonamiento inductivo» dibujados por la sesión como prueba
 * (data-prueba; Gerson decide después cuáles reemplaza). La usa
 * contenido/teoria/razonamiento-matematico/razonamiento-inductivo.js.
 *
 * Afirmación de la figura: una regla general sale de mirar casos chicos y de cómo se arma cada uno. Se ven los casos uno
 * junto a otro (figura 1, 2, 3…), lo que tiene el primero, lo que agrega cada paso y, al resolver, lo pedido.
 *
 * Escenas:
 *   'fosforos'     figuras armadas con fósforos (cada uno con su cabeza), una junto a otra, cada una con su título.
 *   'torta'        una torta redonda vista desde arriba, con velitas en el borde y cortes rectos entre ellas.
 *   'chapitas'     chapitas (tapas de gaseosa) en filas: rectángulos o triángulos, una figura junto a otra.
 *   'latas'        una pirámide de latas numeradas, fila 1 arriba.
 *   'calculadora'  la calculadora del salón: la cuenta y su resultado en la pantalla, y la cinta con los casos de antes.
 *   'pulsera'      una pulsera de mostacillas (o una tira de fichas con cifras) en fila, con su número de lugar debajo.
 *
 * Papeles de color (la unidad los fija; quien llama dice el papel, no el color; sin verde ni carmín):
 *   dato ...... naranja (o): lo que tiene el primer caso; el caso que se elige (la fila, el lugar)
 *   agrega .... turquesa (i): lo que agrega cada paso; el ciclo que se repite; el contraejemplo contado
 *   seguro .... violeta (f): lo pedido, ya comprobado (solo al resolver)
 *   tenue ..... gris: lo que ya no cuenta
 *   (sin papel) tinta: los objetos, lo que ya estaba, los números
 * PAPELES lo exporta para las pruebas de la unidad.
 *
 * datos = {
 *   escena, meta: 'texto' (línea de arriba, en tinta), nota: 'texto' | [{ t, papel, desde }], notas: n (líneas reservadas)
 *   fosforos:    figuras: [{ titulo, palitos: [[x1, y1, x2, y2, papel, desde], …] }] en unidades (un lado = 1); unidad: px
 *                por unidad (máximo; se achica si no cabe); alto: alto en unidades (fijo, para que no cambie al jugar)
 *   torta:       velitas: k (1 a 7), cortes: true | false, papelCortes, titulo
 *   chapitas:    figuras: [{ titulo, filas: [n1, n2, …], centrar: true (triángulo), marcas: [[fila, col, papel, desde], …],
 *                arriba: 'texto' }]; radio: px (máximo); altoFilas: filas reservadas (fijo)
 *   latas:       filas: [[número, …], …] de arriba abajo; resaltar: [{ fila, papel, desde }]; tapar: [fila, …] (sus
 *                números van con «?»); rotulos: true (dice «Fila k» a la izquierda); filasReservadas: n
 *   calculadora: cuenta: 'texto', resultado: 'texto', papelResultado, cinta: [{ t, papel, desde }], lineas: n reservadas
 *   pulsera:     cuentas: ['R', 'V', …] o cifras ('2', '4'…), forma: 'cuenta' | 'ficha', desde: lugar del primero (1),
 *                marcas: [{ i, papel, desde }], ciclo: { de: i, largo: L, t: 'ciclo de 4', desde }, porFila: 12, puntos: true
 *                (tres puntos al final: la lista sigue)
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
  const W = 320, M = 4, TAM = 14, NOTA = 22, TENUE = 0.45;
  const PAPELES = { dato: 'o', agrega: 'i', seguro: 'f', tenue: 'tenue', amarra: 'tinta' };
  const n = T.n;
  const CAJA = ' data-caja="si"';
  const ve = (x, corte) => !x || typeof x !== 'object' || Array.isArray(x) ? true : (x.desde || 0) <= corte;
  const tok = p => (p === 'dato' ? 'o' : p === 'agrega' ? 'i' : p === 'seguro' ? 'f' : undefined);
  const col = p => (tok(p) ? `var(--c-${tok(p)})` : 'currentColor');
  const marca = p => (p === 'seguro' ? ' data-marca="seguro"' : '');
  const notasDe = d => (d.nota === undefined ? [] : Array.isArray(d.nota) ? d.nota : [{ t: d.nota }]);
  const lista = xs => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}` : xs.join(''));
  const g = (p, s) => `<g class="kit-aparece"${marca(p)}${p === 'tenue' ? ` opacity="${TENUE}"` : ''}>${s}</g>`;

  // ---------- Fósforos ----------
  function cajaPalitos(ps) {
    const xs = ps.flatMap(p => [p[0], p[2]]), ys = ps.flatMap(p => [p[1], p[3]]);
    return xs.length ? { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) } : { x0: 0, x1: 1, y0: 0, y1: 1 };
  }
  function geoFosforos(d, y) {
    const figs = d.figuras || [], cajas = figs.map(f => cajaPalitos(f.palitos || []));
    if (d.columna) {
      // Una figura por renglón, alineadas a la izquierda: lo que agrega cada paso se ve a la derecha.
      const altoU = Math.max(d.alto || 0, ...cajas.map(c => c.y1 - c.y0), 0.5), anchoU = Math.max(...cajas.map(c => c.x1 - c.x0), 1);
      const xIzq = M + 92, s = Math.min(d.unidad || 40, (W - M - 10 - xIzq) / anchoU, 60 / altoU), fila = altoU * s + 18;
      return { columna: true, s, xIzq, fila, yTop: y + 10, altoU, alto: 10 + figs.length * fila + 2 };
    }
    const tit = figs.map(f => (f.titulo ? T.ancho(f.titulo, TAM, 700) + 8 : 0));
    const altoU = Math.max(d.alto || 0, ...cajas.map(c => c.y1 - c.y0), 0.5);
    const gap = 14, disp = W - 2 * M - 16 - gap * Math.max(0, figs.length - 1);
    let s = Math.min(d.unidad || 40, (W - 2 * M - 40) / altoU);
    // Cada figura ocupa lo que mide o lo que mide su título; la escala se achica hasta que todo entra.
    for (let k = 0; k < 40; k++) {
      const tot = cajas.reduce((a, c, i) => a + Math.max((c.x1 - c.x0) * s + 10, tit[i]), 0);
      if (tot <= disp) break;
      s *= 0.94;
    }
    const slots = cajas.map((c, i) => Math.max((c.x1 - c.x0) * s + 10, tit[i]));
    const tot = slots.reduce((a, b) => a + b, 0) + gap * Math.max(0, figs.length - 1);
    let x = (W - tot) / 2;
    const pos = slots.map((w, i) => { const p = { x, w, c: cajas[i] }; x += w + gap; return p; });
    return { s, pos, yTop: y + 10, altoU, alto: 10 + altoU * s + 10 + (figs.some(f => f.titulo) ? 22 : 0) + 4 };
  }
  function fosforo(x1, y1, x2, y2, papel) {
    // El palito y su cabeza (en la punta 2); se recorta 3 px en cada punta para que dos fósforos no se toquen.
    const L = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / L, uy = (y2 - y1) / L, c = col(papel);
    const ax = x1 + ux * 3, ay = y1 + uy * 3, bx = x2 - ux * 3, by = y2 - uy * 3;
    return `<line x1="${n(ax)}" y1="${n(ay)}" x2="${n(bx)}" y2="${n(by)}" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`
      + `<circle cx="${n(bx - ux * 1.5)}" cy="${n(by - uy * 1.5)}" r="3.6" fill="${c}"/>`;
  }
  function fosforos(d, G, corte) {
    let s = '';
    if (G.columna) {
      (d.figuras || []).forEach((f, i) => {
        const c = cajaPalitos(f.palitos || []), y0 = G.yTop + i * G.fila, ox = G.xIzq - c.x0 * G.s, oy = y0 + (G.altoU - (c.y1 - c.y0)) * G.s - c.y0 * G.s;
        for (const q of f.palitos || []) if ((q[5] || 0) <= corte) s += g(q[4], fosforo(ox + q[0] * G.s, oy + q[1] * G.s, ox + q[2] * G.s, oy + q[3] * G.s, q[4]));
        if (f.titulo) s += T.rotulo(M + 4, y0 + G.altoU * G.s / 2 + 5, f.titulo, { tam: TAM, peso: 700, min: M, max: G.xIzq - 10 });
      });
      return `<g class="kit-objeto" data-objeto="fosforos" data-prueba="si">${s}</g>`;
    }
    (d.figuras || []).forEach((f, i) => {
      const p = G.pos[i], c = p.c, w = (c.x1 - c.x0) * G.s, ox = p.x + (p.w - w) / 2 - c.x0 * G.s;
      const oy = G.yTop + (G.altoU - (c.y1 - c.y0)) * G.s - c.y0 * G.s;
      for (const q of f.palitos || []) {
        if ((q[5] || 0) > corte) continue;
        s += g(q[4], fosforo(ox + q[0] * G.s, oy + q[1] * G.s, ox + q[2] * G.s, oy + q[3] * G.s, q[4]));
      }
      if (f.titulo) s += T.rotulo(p.x + p.w / 2, G.yTop + G.altoU * G.s + 10 + 17, f.titulo, { ancla: 'middle', tam: TAM, peso: 700, min: p.x - 6, max: p.x + p.w + 6 });
    });
    return `<g class="kit-objeto" data-objeto="fosforos" data-prueba="si">${s}</g>`;
  }

  // ---------- La torta ----------
  // Ángulos irregulares (en radianes, desde arriba en sentido horario): ningún punto donde se crucen tres cortes.
  const ANG = [0.15, 1.2, 2.05, 3.25, 4.15, 5.3, 2.65];
  const RT = 92;
  const velitas = (k, cx = W / 2, cy = 0) => Array.from({ length: k }, (_, i) => [cx + RT * Math.sin(ANG[i]), cy - RT * Math.cos(ANG[i])]);
  function torta(d, G, corte) {
    const cx = W / 2, cy = G.yC, k = d.velitas || 0, pts = velitas(k, cx, cy);
    let s = `<circle${CAJA} cx="${n(cx)}" cy="${n(cy)}" r="${RT + 12}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.5"/>`;
    s += `<circle${CAJA} cx="${n(cx)}" cy="${n(cy)}" r="${RT}" fill="currentColor" fill-opacity="0.06" stroke="currentColor" stroke-width="2"/>`;
    if (d.cortes !== false && ve(d.cortesDesde === undefined ? null : { desde: d.cortesDesde }, corte)) {
      for (let i = 0; i < k; i++) for (let j = i + 1; j < k; j++) s += g(d.papelCortes, `<line${CAJA} x1="${n(pts[i][0])}" y1="${n(pts[i][1])}" x2="${n(pts[j][0])}" y2="${n(pts[j][1])}" stroke="${col(d.papelCortes)}" stroke-width="2"/>`);
    }
    // Las velitas: un círculo con su llamita hacia afuera.
    pts.forEach(([x, y], i) => {
      const ux = Math.sin(ANG[i]), uy = -Math.cos(ANG[i]);
      s += `<circle${CAJA} cx="${n(x)}" cy="${n(y)}" r="5.5" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`;
      s += `<circle${CAJA} cx="${n(x + ux * 9)}" cy="${n(y + uy * 9)}" r="2.6" fill="currentColor" fill-opacity="0.7"/>`;
    });
    if (d.titulo) s += T.rotulo(M + 4, G.yTit, d.titulo, { tam: TAM, peso: 700, min: M, max: W - M });
    return `<g class="kit-objeto" data-objeto="torta" data-prueba="si">${s}</g>`;
  }

  // ---------- Chapitas ----------
  function geoChapitas(d, y) {
    const figs = d.figuras || [], gap = 14;
    const filasMax = Math.max(d.altoFilas || 0, ...figs.map(f => (f.filas || []).length), 1);
    const anchoF = f => Math.max(1, ...(f.filas || []).map(x => x));
    const tit = figs.map(f => Math.max(f.titulo ? T.ancho(f.titulo, TAM, 700) + 8 : 0, f.arriba ? T.ancho(f.arriba, TAM, 400) + 8 : 0));
    // Con tocan, las monedas se tocan: van pegadas en la fila y cada fila se encaja en los huecos de la de arriba.
    const sep = d.tocan ? 1 : 1.12;
    let r = Math.min(d.radio || 11, 11);
    for (let k = 0; k < 60; k++) {
      const tot = figs.reduce((a, f, i) => a + Math.max(anchoF(f) * 2 * r * sep, tit[i]), 0) + gap * Math.max(0, figs.length - 1);
      if (tot <= W - 2 * M - 8) break;
      r *= 0.95;
    }
    const paso = 2 * r * sep, pasoY = d.tocan ? paso * Math.sqrt(3) / 2 : paso;
    const slots = figs.map((f, i) => Math.max(anchoF(f) * paso, tit[i]));
    const tot = slots.reduce((a, b) => a + b, 0) + gap * Math.max(0, figs.length - 1);
    let x = (W - tot) / 2;
    const conArriba = figs.some(f => f.arriba), conTit = figs.some(f => f.titulo);
    const yTop = y + 6 + (conArriba ? 22 : 0);
    const pos = slots.map(w => { const p = { x, w }; x += w + gap; return p; });
    const altoF = (filasMax - 1) * pasoY + paso;
    return { r, paso, pasoY, altoF, pos, yTop, filasMax, alto: (yTop - y) + altoF + (conTit ? 26 : 6) + 4 };
  }
  function chapita(cx, cy, r, papel) {
    const c = col(papel), fondo = tok(papel) ? ` fill="${c}" fill-opacity="0.16"` : ' fill="var(--card)"';
    return `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}"${fondo} stroke="${c}" stroke-width="${tok(papel) ? 2.5 : 1.6}"/>`
      + `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r * 0.55)}" fill="none" stroke="${c}" stroke-width="1" stroke-opacity="0.7"/>`;
  }
  function chapitas(d, G, corte) {
    let s = '';
    (d.figuras || []).forEach((f, i) => {
      const p = G.pos[i], filas = f.filas || [], ancho = Math.max(1, ...filas) * G.paso;
      const x0 = p.x + (p.w - ancho) / 2, papelDe = new Map((f.marcas || []).filter(m => ve({ desde: m[3] || 0 }, corte)).map(m => [`${m[0]},${m[1]}`, m[2]]));
      filas.forEach((cnt, fi) => {
        const dx = f.centrar ? (Math.max(...filas) - cnt) * G.paso / 2 : 0;
        for (let cI = 0; cI < cnt; cI++) {
          const pp = papelDe.get(`${fi},${cI}`);
          s += g(pp, chapita(x0 + dx + (cI + 0.5) * G.paso, G.yTop + fi * G.pasoY + G.paso / 2, G.r - (d.tocan ? 0.8 : 0), pp));
        }
      });
      if (f.arriba) s += T.rotulo(p.x + p.w / 2, G.yTop - 8, f.arriba, { ancla: 'middle', tam: TAM, min: p.x - 6, max: p.x + p.w + 6 });
      if (f.titulo) s += T.rotulo(p.x + p.w / 2, G.yTop + G.altoF + 18, f.titulo, { ancla: 'middle', tam: TAM, peso: 700, min: p.x - 6, max: p.x + p.w + 6 });
    });
    return `<g class="kit-objeto" data-objeto="chapitas" data-prueba="si">${s}</g>`;
  }

  // ---------- Latas ----------
  function geoLatas(d, y) {
    const filas = d.filas || [], nf = Math.max(d.filasReservadas || 0, filas.length, 1);
    const maxC = Math.max(1, ...filas.map(f => f.length)), dig = Math.max(1, ...filas.flat().map(x => String(x).length));
    const izq = d.rotulos ? 58 : 0;
    const w = Math.min(Math.max(26, dig * 9 + 10), (W - 2 * M - 8 - izq) / maxC - 2), h = Math.min(26, w + 2);
    return { w, h, paso: w + 2, nf, maxC, izq, yTop: y + 6, alto: 6 + nf * (h + 3) + 6 };
  }
  function latas(d, G, corte) {
    let s = '';
    const res = new Map((d.resaltar || []).filter(x => ve(x, corte)).map(x => [x.fila, x.papel]));
    const tapadas = new Set(d.tapar || []);
    const cx = G.izq / 2 + W / 2;
    (d.filas || []).forEach((fila, fi) => {
      const papel = res.get(fi), c = col(papel), y = G.yTop + fi * (G.h + 3), x0 = cx - fila.length * G.paso / 2;
      let q = '';
      fila.forEach((num, k) => {
        const x = x0 + k * G.paso + 1;
        q += `<rect${CAJA} x="${n(x)}" y="${n(y)}" width="${n(G.w)}" height="${n(G.h)}" rx="4"${tok(papel) ? ` fill="${c}" fill-opacity="0.14"` : ' fill="var(--card)"'} stroke="${c}" stroke-width="${tok(papel) ? 2.5 : 1.5}"/>`;
        q += `<line${CAJA} x1="${n(x + 3)}" y1="${n(y + 5)}" x2="${n(x + G.w - 3)}" y2="${n(y + 5)}" stroke="${c}" stroke-width="1" stroke-opacity="0.6"/>`;
        q += T.rotulo(x + G.w / 2, y + G.h - 5, tapadas.has(fi) ? '?' : String(num), { ancla: 'middle', tam: TAM, peso: tok(papel) ? 700 : 400, color: tok(papel), min: x, max: x + G.w });
      });
      if (d.rotulos) q += T.rotulo(x0 - 6, y + G.h - 5, `Fila ${fi + 1}`, { ancla: 'end', tam: TAM, color: tok(papel), min: M, max: x0 - 4 });
      s += g(papel === 'tenue' ? 'tenue' : papel, q);
    });
    return `<g class="kit-objeto" data-objeto="latas" data-prueba="si">${s}</g>`;
  }

  // ---------- Calculadora ----------
  function geoCalculadora(d, y) {
    const nl = Math.max(d.lineas || 0, (d.cinta || []).length);
    return { yCal: y + 2, hCal: 124, yCinta: y + 2 + 124 + 8, nl, alto: 2 + 124 + 8 + (nl ? 22 + nl * NOTA : 0) + 4 };
  }
  function calculadora(d, G, corte) {
    const x0 = M + 1, w = W - 2 * M - 2, y0 = G.yCal;
    let s = `<rect${CAJA} x="${x0}" y="${n(y0)}" width="${w}" height="${G.hCal}" rx="12" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-width="2"/>`;
    s += `<rect${CAJA} x="${x0 + 12}" y="${n(y0 + 12)}" width="${w - 24}" height="64" rx="6" fill="var(--card)" stroke="currentColor" stroke-width="1.5"/>`;
    if (d.cuenta) s += T.rotulo(x0 + w - 22, y0 + 34, d.cuenta, { ancla: 'end', tam: TAM, min: x0 + 16, max: x0 + w - 16 });
    if (d.resultado !== undefined) s += g(d.papelResultado, T.rotulo(x0 + w - 22, y0 + 64, String(d.resultado), { ancla: 'end', tam: 22, peso: 700, color: tok(d.papelResultado), min: x0 + 16, max: x0 + w - 16 }));
    // Teclas de adorno, sin rótulo.
    for (let k = 0; k < 8; k++) s += `<rect x="${n(x0 + 14 + k * ((w - 28) / 8))}" y="${n(y0 + 88)}" width="${n((w - 28) / 8 - 6)}" height="22" rx="4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.6"/>`;
    if (G.nl) {
      s += T.rotulo(M + 2, G.yCinta + 15, d.tituloCinta || 'En la cinta:', { tam: TAM, peso: 700, min: M, max: W - M });
      (d.cinta || []).forEach((x, k) => { if (ve(x, corte)) s += g(x.papel, T.rotulo(M + 10, G.yCinta + 22 + 16 + k * NOTA, x.t, { tam: TAM, peso: tok(x.papel) ? 700 : 400, color: tok(x.papel), min: M, max: W - M })); });
    }
    return `<g class="kit-objeto" data-objeto="calculadora" data-prueba="si">${s}</g>`;
  }

  // ---------- Pulsera (o tira de fichas) ----------
  function geoPulsera(d, y) {
    const nCu = (d.cuentas || []).length, porFila = d.porFila || 12, filas = Math.max(1, Math.ceil(nCu / porFila));
    const paso = Math.min(25, (W - 2 * M - 24) / porFila), conCiclo = !!d.ciclo;
    const yTop = y + (conCiclo ? 34 : 6);
    return { paso, porFila, filas, yTop, alto: (yTop - y) + filas * 46 + 4 };
  }
  function pulsera(d, G, corte) {
    const cs = d.cuentas || [], desde = d.desde || 1, ficha = d.forma === 'ficha', R = Math.min(10.5, G.paso / 2 - 1);
    const papelDe = new Map((d.marcas || []).filter(m => ve(m, corte)).map(m => [m.i, m.papel]));
    const posDe = i => { const fi = Math.floor(i / G.porFila), k = i % G.porFila, ancho = Math.min(cs.length - fi * G.porFila, G.porFila) * G.paso;
      return { cx: (W - Math.min(cs.length, G.porFila) * G.paso) / 2 + (k + 0.5) * G.paso, cy: G.yTop + fi * 46 + 12, fi, ancho }; };
    let s = '';
    for (let fi = 0; fi < G.filas; fi++) {
      const a = posDe(fi * G.porFila), b = posDe(Math.min(cs.length, (fi + 1) * G.porFila) - 1);
      if (!ficha && cs.length) s += `<line${CAJA} x1="${n(a.cx - G.paso / 2 + 2)}" y1="${n(a.cy)}" x2="${n(b.cx + G.paso / 2 - 2)}" y2="${n(b.cy)}" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.6"/>`;
    }
    cs.forEach((t, i) => {
      const { cx, cy } = posDe(i), p = papelDe.get(i), c = col(p);
      const fondo = tok(p) ? ` fill="${c}" fill-opacity="0.16"` : ' fill="var(--card)"';
      let q = ficha ? `<rect${CAJA} x="${n(cx - R)}" y="${n(cy - R)}" width="${n(2 * R)}" height="${n(2 * R)}" rx="3"${fondo} stroke="${c}" stroke-width="${tok(p) ? 2.5 : 1.5}"/>`
        : `<circle${CAJA} cx="${n(cx)}" cy="${n(cy)}" r="${n(R)}"${fondo} stroke="${c}" stroke-width="${tok(p) ? 2.5 : 1.5}"/>`;
      q += T.rotulo(cx, cy + 5, String(t), { ancla: 'middle', tam: TAM, peso: 700, color: tok(p), min: cx - R - 4, max: cx + R + 4 });
      q += T.rotulo(cx, cy + 30, String(desde + i), { ancla: 'middle', tam: TAM, color: tok(p), min: cx - G.paso / 2, max: cx + G.paso / 2 });
      s += g(p, q);
    });
    if (d.puntos && cs.length) { const u = posDe(cs.length - 1); s += T.rotulo(u.cx + G.paso / 2 + 1, u.cy + 5, '…', { tam: TAM, peso: 700, min: M, max: W - M }); }
    if (d.ciclo && ve(d.ciclo, corte)) {
      const a = posDe(d.ciclo.de), b = posDe(d.ciclo.de + d.ciclo.largo - 1), yy = a.cy - R - 6, x1 = a.cx - R + 1, x2 = b.cx + R - 1, xm = (x1 + x2) / 2, c = col('agrega');
      s += g('agrega', `<path d="M${n(x1)} ${n(yy)}L${n(x1)} ${n(yy - 5)}L${n(x2)} ${n(yy - 5)}L${n(x2)} ${n(yy)}" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`
        + T.rotulo(xm, yy - 10, d.ciclo.t || '', { ancla: 'middle', tam: TAM, peso: 700, color: 'i', min: M, max: W - M }));
    }
    return `<g class="kit-objeto" data-objeto="${ficha ? 'tira' : 'pulsera'}" data-prueba="si">${s}</g>`;
  }

  // ---------- Geometría común ----------
  function geometria(d) {
    let y = M;
    const G = { yMeta: y };
    if (d.meta) y += 24;
    if (d.escena === 'fosforos') { Object.assign(G, geoFosforos(d, y)); y += G.alto; }
    else if (d.escena === 'torta') { G.yTit = y + 15; if (d.titulo) y += 22; G.yC = y + RT + 16; y += 2 * RT + 32; }
    else if (d.escena === 'chapitas') { Object.assign(G, geoChapitas(d, y)); y += G.alto; }
    else if (d.escena === 'latas') { Object.assign(G, geoLatas(d, y)); y += G.alto; }
    else if (d.escena === 'calculadora') { Object.assign(G, geoCalculadora(d, y)); y += G.alto; }
    else if (d.escena === 'pulsera') { Object.assign(G, geoPulsera(d, y)); y += G.alto; }
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
    if (d.escena === 'fosforos') s += fosforos(d, G, corte);
    else if (d.escena === 'torta') s += torta(d, G, corte);
    else if (d.escena === 'chapitas') s += chapitas(d, G, corte);
    else if (d.escena === 'latas') s += latas(d, G, corte);
    else if (d.escena === 'calculadora') s += calculadora(d, G, corte);
    else if (d.escena === 'pulsera') s += pulsera(d, G, corte);
    notasDe(d).forEach((x, k) => { if (ve(x, corte)) s += g(x.papel, T.rotulo(M + 2, G.yNota + 16 + k * NOTA, x.t, { tam: TAM, peso: x.fuerte || tok(x.papel) ? 700 : 400, color: tok(x.papel), min: M, max: W - M })); });
    return T.svg(W, G.altoTotal, s, { alt: alt(d) });
  }

  // ---------- Texto alternativo ----------
  const COLOR = { R: 'roja', V: 'verde', N: 'negra', B: 'blanca', D: 'dorada', C: 'celeste' };
  function alt(d) {
    const partes = [];
    if (d.meta) partes.push(d.meta);
    if (d.escena === 'fosforos') partes.push(`Figuras de fósforos: ${(d.figuras || []).map(f => `${f.titulo || 'figura'} con ${(f.palitos || []).length} fósforos`).join('; ')}`);
    if (d.escena === 'torta') partes.push(`${d.titulo || 'Torta'} vista desde arriba con ${d.velitas || 0} velitas en el borde${d.cortes === false ? ', sin cortes' : ' y un corte recto entre cada par de velitas'}`);
    if (d.escena === 'chapitas') partes.push(`Chapitas en filas: ${(d.figuras || []).map(f => `${f.titulo || 'figura'}, filas de ${lista((f.filas || []).map(String))}`).join('; ')}`);
    if (d.escena === 'latas') partes.push(`Pirámide de latas numeradas, de arriba abajo: ${(d.filas || []).map((f, i) => `fila ${i + 1}: ${(d.tapar || []).includes(i) ? 'números tapados' : f.join(', ')}`).join('; ')}`);
    if (d.escena === 'calculadora') partes.push(`Calculadora: ${d.cuenta || ''} ${d.resultado !== undefined ? `da ${d.resultado}` : ''}`.trim(), ...(d.cinta || []).map(x => x.t));
    if (d.escena === 'pulsera') partes.push(`${d.forma === 'ficha' ? 'Tira de fichas' : 'Pulsera de mostacillas'} desde el lugar ${d.desde || 1}: ${(d.cuentas || []).map(t => COLOR[t] || t).join(', ')}${d.puntos ? ', y sigue' : ''}`);
    for (const x of notasDe(d)) partes.push(x.t);
    return (partes.length ? partes.join('. ') : 'Casos chicos de una regla') + '.';
  }

  return { id: 'rm-patrones', dibujar, alt, geometria, velitas, PAPELES, constantes: { W, RT, ANG } };
});
