/*
 * Pieza «rv-definicion» (razonamiento verbal, unidad «Definiciones», etapa 5): el texto en su soporte (rv-soporte) y,
 * debajo, la ficha de una definición, dibujada como una entrada de diccionario con sus piezas (la clase y los rasgos),
 * y la tabla de los casos con sus rasgos. Cada caso se marca según la definición: entra y es la cosa (turquesa,
 * continuo), se cuela sin serlo (naranja, a trazos) o queda fuera (gris).
 *
 * Afirmación de la figura: una definición es una clase más los rasgos que separan; cada pieza deja fuera a un vecino, y
 * si falta una, ese vecino se cuela.
 *
 * La ficha (la página con su lomo) es un dibujo de prueba (data-prueba="si"): Gerson decide después si se reemplaza
 * (docs/molde-unidad.md §6).
 *
 * datos = {
 *   soporte: { …datos de rv-soporte… },          // opcional: el cartel, el aviso o la hoja donde hace falta la definición
 *   entrada: {
 *     termino: 'mototaxi', rotulo: 'Ficha del cartel',
 *     partes: [{ id: 'g', papel: 'Clase' },                              // sin texto en el estado: «?» (o su `hueco`)
 *              { id: 'm', papel: 'Rasgo', casilla: true, hueco: 'con motor' }],   // casilla: una pieza que se pone o se quita
 *   },
 *   casos: { titulo: 'Vehículos del paradero', cols: ['Vehículo', 'Ruedas', 'Motor', 'Lleva'], anchos: [120, 58, 50, 66],
 *            filas: [{ id: 'v1', celdas: ['mototaxi abierto', '3', 'sí', 'pasajeros'] }] },
 *   toques: { g: 'g', m: 'm' },    // zona tocable sobre la fila de la pieza: cambia el control del juego (data-toque)
 * }
 * Sin `entrada` ni `casos`, la pieza dibuja solo el soporte.
 * estado = {
 *   soporte: { …estado de rv-soporte… },
 *   partes: { g: 'vehículo de tres ruedas', m: 'con motor' },   // el texto de cada pieza puesta; sin texto, hueco
 *   color: 'o' | 'f',              // o: la definición que se prueba (naranja, a trazos); f: la justa (violeta, punteado)
 *   filas: { v1: 'i', v5: 'o' },   // i: entra y es la cosa; o: se cuela
 *   tenue: ['v3'],                 // queda fuera
 *   sello: { t: 'Se cuela 1', c: 'o' },   // una línea bajo la tabla, en palabras (el color no es la única señal)
 *   nuevo: ['g', 'v1'],            // se anima al avanzar un paso de «Mira»
 * }
 * El alto depende solo de los datos: cambiar el estado nunca mueve nada. Todo texto mide 14 o más. Función pura: sin
 * azar, ids ni reloj. Solo currentColor, var(--c-i), var(--c-o), var(--c-f) y var(--card).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const Kit = nodo ? require('../kit.js') : root.Kit;
  const T = nodo ? require('../trazo.js') : root.Kit.trazo;
  const S = nodo ? require('./rv-soporte.js') : root.Kit.piezas['rv-soporte'];
  const api = fabrica(Kit, T, S);
  Kit.registrar(api);
  if (nodo) module.exports = api;
})(typeof self !== 'undefined' ? self : this, function (Kit, T, S) {
  'use strict';
  const W = 320, TAM = 15, RH = 40, TENUE = S.constantes.TENUE, PIE = S.constantes.PIE;
  // La ficha: el lomo va de 6 a 20; la página, de 16 a 314. Rótulo de la pieza en 28; su casilla, de 84 a 304.
  const FX = 16, FW = 298, ROT = 28, SX = 84, SW = 220;
  const TXI = 12, FILA = 26, CAB = 24;   // la tabla: primer texto en 12; filas de 26
  const RAYA = { i: '', o: ' stroke-dasharray="7 4"', f: ' stroke-dasharray="0.1 6"' };
  const ANCHOS = n => Array.from({ length: n }, () => 294 / n);

  function disponer(d) {
    const sop = d.soporte ? S.disponer(d.soporte) : null;
    let y = sop ? sop.alto - PIE + 2 : 4;
    let ficha = null, tabla = null;
    if (d.entrada) {
      const e = d.entrada, top = y;
      const cab = { termino: { x: ROT, y: y + 24, texto: e.termino || '' }, rotulo: e.rotulo ? { x: FX + FW - 12, y: y + 23, texto: e.rotulo } : null };
      y += 34;
      const filas = (e.partes || []).map(p => {
        const f = { id: p.id, papel: p.papel || 'Rasgo', casilla: !!p.casilla, hueco: p.hueco || '?', y, h: RH,
          rot: { x: ROT, y: y + 25 }, caja: { x: SX, y: y + 4, w: SW, h: RH - 8 }, tx: SX + (p.casilla ? 32 : 12), ty: y + 25 };
        f.tw = SX + SW - 10 - f.tx;
        y += RH;
        return f;
      });
      y += 8;
      ficha = { x: FX, y: top, w: FW, h: y - top, cab, filas };
      y += 6;
    }
    if (d.casos) {
      const c = d.casos, top = y, n = (c.cols || []).length || 1;
      const anchos = Array.isArray(c.anchos) && c.anchos.length === n ? c.anchos : ANCHOS(n);
      const xs = anchos.reduce((a, w) => a.concat(a[a.length - 1] + w), [TXI]);
      y += 4;
      const titulo = c.titulo ? { x: TXI, y: y + 16, texto: c.titulo } : null;
      if (titulo) y += 24;
      const cab = { y, h: CAB, cols: (c.cols || []).map((t, k) => ({ x: xs[k], y: y + 17, texto: t })) };
      y += CAB;
      const filas = (c.filas || []).map(f => {
        const r = { id: f.id, y, h: FILA, celdas: (f.celdas || []).map((t, k) => ({ x: xs[k], y: y + 18, w: anchos[k], texto: String(t) })) };
        y += FILA;
        return r;
      });
      y += 4;
      const sello = { x: TXI, y: y + 16 };
      y += 24;
      tabla = { x: 6, y: top, w: W - 12, h: y - top, titulo, cab, filas, sello, x1: xs[xs.length - 1] };
    }
    return { sop, ficha, tabla, alto: Math.ceil(Math.max(60, y + 4 + (ficha || tabla ? PIE : 0))) };
  }

  const obj = (nombre, s) => `<g class="kit-objeto" data-objeto="${nombre}" data-prueba="si">${s}</g>`;

  function dibujar(d, estado = {}) {
    const L = disponer(d);
    const c = estado.color === 'f' ? 'f' : 'o', partes = estado.partes || {}, marcas = estado.filas || {};
    const tenue = new Set(estado.tenue || []), nuevo = new Set(estado.nuevo || []);
    const cl = id => (nuevo.has(id) ? ' kit-nuevo kit-aparece' : '');
    let s = d.soporte ? S.cuerpo(d.soporte, estado.soporte || {}).s : '';
    if (L.ficha) {
      const F = L.ficha;
      // El lomo del libro y la página con su raya de cabecera (dibujo de prueba).
      let libro = `<rect x="${T.n(F.x - 10)}" y="${T.n(F.y)}" width="16" height="${T.n(F.h)}" rx="4" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-opacity="0.4" stroke-width="2"/>`;
      libro += `<rect x="${T.n(F.x)}" y="${T.n(F.y)}" width="${T.n(F.w)}" height="${T.n(F.h)}" rx="6" fill="var(--card)" stroke="currentColor" stroke-opacity="0.32" stroke-width="2"/>`;
      libro += `<line x1="${T.n(F.x + 12)}" y1="${T.n(F.y + 32)}" x2="${T.n(F.x + F.w - 12)}" y2="${T.n(F.y + 32)}" stroke="currentColor" stroke-opacity="0.3" stroke-width="1.5"/>`;
      s += obj('ficha-diccionario', libro);
      s += T.rotulo(F.cab.termino.x, F.cab.termino.y, F.cab.termino.texto, { tam: 18, peso: 700 });
      if (F.cab.rotulo) s += `<text class="kit-txt" x="${T.n(F.cab.rotulo.x)}" y="${T.n(F.cab.rotulo.y)}" fill="currentColor" font-size="14" text-anchor="end" opacity="0.8">${T.esc(F.cab.rotulo.texto)}</text>`;
      for (const f of F.filas) {
        const t = partes[f.id], puesto = typeof t === 'string' && t.trim().length > 0;
        s += `<text class="kit-txt" x="${T.n(f.rot.x)}" y="${T.n(f.rot.y)}" fill="currentColor" font-size="14" font-weight="700" opacity="0.8">${T.esc(f.papel)}</text>`;
        // La pieza puesta lleva el color de la definición (naranja mientras se prueba, violeta la justa); el hueco, tinta a puntos.
        s += puesto
          ? `<rect class="rv-pieza${cl(f.id)}" x="${T.n(f.caja.x)}" y="${T.n(f.caja.y)}" width="${T.n(f.caja.w)}" height="${T.n(f.caja.h)}" rx="8" fill="${T.color(c)}" fill-opacity="0.14" stroke="${T.color(c)}" stroke-width="${T.GROSOR.contorno}"${RAYA[c]} stroke-linecap="round"/>`
          : `<rect class="rv-hueco" x="${T.n(f.caja.x)}" y="${T.n(f.caja.y)}" width="${T.n(f.caja.w)}" height="${T.n(f.caja.h)}" rx="8" fill="none" stroke="currentColor" stroke-opacity="0.45" stroke-width="1.5" stroke-dasharray="3 4"/>`;
        if (f.casilla) {
          const bx = f.caja.x + 9, by = f.caja.y + (f.caja.h - 16) / 2;
          s += `<rect x="${T.n(bx)}" y="${T.n(by)}" width="16" height="16" rx="3" fill="${puesto ? 'currentColor' : 'none'}" fill-opacity="${puesto ? 0.85 : 0}" stroke="currentColor" stroke-opacity="${puesto ? 0.85 : 0.6}" stroke-width="2"/>`;
          if (puesto) s += `<path d="M${T.n(bx + 3.5)} ${T.n(by + 8.5)}l3 3l6 -7" fill="none" stroke="var(--card)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`;
        }
        s += `<text class="kit-txt" x="${T.n(f.tx)}" y="${T.n(f.ty)}" fill="currentColor" font-size="${TAM}"${puesto ? ' font-weight="700"' : ` opacity="${TENUE}"`}>${T.esc(puesto ? t : f.hueco)}</text>`;
      }
    }
    if (L.tabla) {
      const B = L.tabla;
      s += `<rect x="${T.n(B.x)}" y="${T.n(B.y)}" width="${T.n(B.w)}" height="${T.n(B.h)}" rx="10" fill="var(--card)" stroke="currentColor" stroke-opacity="0.3" stroke-width="2"/>`;
      if (B.titulo) s += T.rotulo(B.titulo.x, B.titulo.y, B.titulo.texto, { tam: 14, peso: 700 });
      for (const k of B.cab.cols) s += `<text class="kit-txt" x="${T.n(k.x)}" y="${T.n(k.y)}" fill="currentColor" font-size="14" font-weight="700" opacity="0.8">${T.esc(k.texto)}</text>`;
      s += `<line x1="${T.n(TXI - 2)}" y1="${T.n(B.cab.y + B.cab.h)}" x2="${T.n(B.x1 + 2)}" y2="${T.n(B.cab.y + B.cab.h)}" stroke="currentColor" stroke-opacity="0.45" stroke-width="2"/>`;
      for (const f of B.filas) {
        const m = marcas[f.id] === 'i' || marcas[f.id] === 'o' ? marcas[f.id] : null, op = tenue.has(f.id) ? ` opacity="${TENUE}"` : '';
        if (m) s += `<rect class="rv-marca${cl(f.id)}" x="${T.n(TXI - 4)}" y="${T.n(f.y + 2)}" width="${T.n(B.x1 - TXI + 8)}" height="${T.n(f.h - 4)}" rx="5" fill="${T.color(m)}" fill-opacity="0.14" stroke="${T.color(m)}" stroke-width="${T.GROSOR.contorno}"${RAYA[m]} stroke-linecap="round"/>`;
        else s += `<line x1="${T.n(TXI - 2)}" y1="${T.n(f.y + f.h)}" x2="${T.n(B.x1 + 2)}" y2="${T.n(f.y + f.h)}" stroke="currentColor" stroke-opacity="0.16" stroke-width="1"/>`;
        f.celdas.forEach(k => { s += `<text class="kit-txt" x="${T.n(k.x)}" y="${T.n(k.y)}" fill="currentColor" font-size="14" style="font-variant-numeric:tabular-nums"${op}>${T.esc(k.texto)}</text>`; });
      }
      if (estado.sello && estado.sello.t) s += T.rotulo(B.sello.x, B.sello.y, estado.sello.t, { tam: 14, peso: 700, color: ['i', 'o', 'f'].includes(estado.sello.c) ? estado.sello.c : undefined });
    }
    // Toques: una zona invisible sobre la fila de cada pieza de la ficha; el lector pasa ese control a su opción siguiente.
    if (L.ficha) for (const [id, ctl] of Object.entries(d.toques || {})) {
      const f = L.ficha.filas.find(x => x.id === id);
      if (f) s += `<rect class="rv-toque" data-toque="${T.esc(ctl)}" x="${T.n(L.ficha.x + 4)}" y="${T.n(f.y)}" width="${T.n(L.ficha.w - 8)}" height="${T.n(f.h)}" rx="8" fill="transparent"><title>${T.esc(f.papel)}: tocar para cambiar</title></rect>`;
    }
    return T.svg(W, L.alto, s, { alt: alt(d), clase: 'rv-soporte rv-definicion' });
  }

  // El texto alternativo: el soporte, la palabra de la ficha con sus piezas y la tabla entera.
  function alt(d) {
    const base = d.soporte ? S.alt(d.soporte) : '';
    const e = d.entrada, c = d.casos;
    const ficha = e ? ` Ficha de «${e.termino}», para completar: ${(e.partes || []).map(p => `${p.papel || 'Rasgo'}${p.hueco ? ` (${p.hueco})` : ''}`).join(', ')}.` : '';
    const tabla = c ? ` ${c.titulo || 'Casos'}: ${(c.cols || []).join(', ')}; ${(c.filas || []).map(f => (f.celdas || []).join(', ')).join('; ')}.` : '';
    return `${base}${ficha}${tabla}`.trim() || 'Ficha de una definición.';
  }

  return { id: 'rv-definicion', dibujar, alt, disponer, constantes: { W, TAM, RH, SW, FILA } };
});
