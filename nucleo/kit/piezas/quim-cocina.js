/*
 * Pieza «quim-cocina» (17 nov 2026, etapa 2 de química): objetos de la cocina y del laboratorio con las variables del
 * problema escritas junto a lo que miden. Sirve para las ideas con cuentas de «Materia y energía»
 * (quimica.materia-y-energia: propiedades y densidad, calor sensible y latente, masa y energía). Dibujos de prueba
 * (data-prueba): Gerson decide después cuáles reemplaza (docs/plan-calidad.md, M4).
 *
 * Un dibujo de variables, nunca de partículas (docs/etapa2/decisiones.md, 17 nov): los objetos van en tinta
 * (currentColor, con tonos por opacidad) y solo los rótulos de las variables llevan color, por papel (molde §5b:
 * var(--c-o) primer dato, var(--c-i) segundo dato, var(--c-f) lo pedido, var(--c-d) tercer dato). No usa la paleta de
 * elementos: los núcleos de la balanza de dos platillos van en tinta, con su símbolo.
 *
 * Cada objeto lleva en su comentario la afirmación de su dibujo, en una línea.
 *
 * datos = {
 *   objetos: [{                                   // de 1 a 3 por fila, lado a lado; `fila` (0, 1) los apila
 *     tipo, fila: 0, peso: 1,                     // peso: cuánto ancho de la fila ocupa (por omisión 1)
 *     titulo: 'Lingote chico',                     // arriba, en tinta (se parte en dos líneas si no cabe)
 *     rotulos: [{ texto: 'm = 96,5 g', color: 'o', desde }],   // debajo, uno por línea, con el color de su papel
 *     desde,                                       // paso en que aparece el objeto entero (Mira); su lugar queda
 *     …lo propio de cada tipo (abajo)
 *   }],
 *   alt,
 * }
 *   balanza  { carga, pantalla, color }    balanza de cocina con pantalla: la masa se lee en la pantalla, debajo de lo que
 *                                          pesa. carga: 'lingote' | 'lingote-grande' | 'medalla' | 'anillo' | 'piedra' |
 *                                          'corona' | 'cubo' | 'granito' | 'nada'
 *   probeta  { antes: 50, despues: 55, max: 100, carga, color }   probeta graduada en mL: lo que sube el agua al meter el
 *                                          objeto es su volumen (raya punteada en `antes`, agua hasta `despues`)
 *   olla     { nivel: 0.6, tam: 1, fuego, hierve, vapor: 0..1, termometro: '87 °C', colorT }   olla sobre la hornilla con un
 *                                          termómetro adentro: lo que marca es la temperatura del agua
 *   vaso     { nivel, capa: { alto }, fondo: 'arena', polvo, cubitos: 3, termometro, colorT }   vaso con agua (o sin ella),
 *                                          una capa de aceite, arena o polvo en el fondo, cubitos y su termómetro
 *   curva    { puntos: [[Q, T], …], hasta, xmax, ymin, ymax, xMarcas, yMarcas, x: 'Q (kcal)', y: 'T (°C)',
 *              colorX: 'o', colorY: 'f', punto: '87 °C', completa }   (colorX o colorY 'tinta': sin color) la curva
 *                                          temperatura–calor de la olla: el punto
 *                                          avanza con el calor que entra y sube solo si sube la temperatura
 *   balones  { valor, por: 100, total: 20, meta, color }   fila de balones de gas: cada ícono son `por` balones; los
 *                                          llenos son la energía de la masa que desaparece, y la caja punteada, la meta
 *   balon    { texto }                     un balón de gas de cocina con lo que tiene escrito al costado
 *   balanza2 { izq: { nucleos: ['H', …] }, der: { nucleos: ['He'] }, inclina: 'izq' | 'der' | 'nivel' | 'duda' }
 *                                          balanza de dos platillos: baja el lado que pesa más; 'duda' la deja quieta con
 *                                          un «?» (para predecir)
 * estado = { corte }: se ve lo que tiene desde ≤ corte. El alto depende solo de los datos.
 * Función pura de (datos, estado): sin ids, sin azar, sin reloj. geometria(datos) → { filas, alto, caja(k) }.
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
  const W = 320, M = 4, TAM = 14, LINEA = 18, ROT = 20;
  const n = T.n;
  const tinta = (g = 2) => `stroke="currentColor" stroke-width="${g}" stroke-linejoin="round" stroke-linecap="round"`;
  const obj = (nombre, s) => `<g class="kit-objeto" data-objeto="${nombre}" data-prueba="si">${s}</g>`;
  const ALTO = { balanza: 92, probeta: 150, olla: 150, vaso: 124, curva: 168, balones: 82, balon: 96, balanza2: 118 };
  const objs = d => (d.objetos || []);

  function lineas(t, max) {
    if (!t) return [];
    if (T.ancho(t, TAM, 700) <= max) return [t];
    const ps = String(t).split(' ');
    let mejor = null;
    for (let i = 1; i < ps.length; i++) {
      const a = ps.slice(0, i).join(' '), b = ps.slice(i).join(' '), w = Math.max(T.ancho(a, TAM, 700), T.ancho(b, TAM, 700));
      if (!mejor || w < mejor.w) mejor = { w, l: [a, b] };
    }
    return mejor ? mejor.l : [t];
  }

  // Filas: cada una con sus objetos, el ancho de cada ranura y su alto (títulos + cuerpo + rótulos).
  function geometria(d) {
    const os = objs(d), filas = [];
    os.forEach((o, k) => { const f = Math.max(0, Math.round(o.fila || 0)); (filas[f] = filas[f] || []).push(k); });
    let y = M, cajas = [];
    const out = [];
    for (const ks of filas.filter(Boolean)) {
      const pesos = ks.map(k => os[k].peso || 1), total = pesos.reduce((a, b) => a + b, 0);
      let x = 0;
      const ranuras = ks.map((k, i) => { const w = W * pesos[i] / total, r = { k, x0: x, x1: x + w }; x += w; return r; });
      const nl = Math.max(0, ...ranuras.map(r => lineas(os[r.k].titulo, r.x1 - r.x0 - 8).length));
      const cuerpo = Math.max(...ks.map(k => ALTO[os[k].tipo] || 90));
      const nr = Math.max(0, ...ks.map(k => (os[k].rotulos || []).length));
      const yTit = y, yCuerpo = y + nl * LINEA + (nl ? 6 : 0), yBase = yCuerpo + cuerpo, yFin = yBase + nr * ROT + (nr ? 6 : 0) + 4;
      for (const r of ranuras) cajas[r.k] = { x0: r.x0, x1: r.x1, cx: (r.x0 + r.x1) / 2, w: r.x1 - r.x0, yTit, nl, yCuerpo, yBase, alto: cuerpo };
      out.push({ ks, yTit, yCuerpo, yBase, yFin, mesa: ks.some(k => ['balanza', 'probeta', 'olla', 'vaso', 'balon'].includes(os[k].tipo)) });
      y = yFin + 4;
    }
    return { filas: out, alto: Math.ceil(y + M - 4), caja: k => cajas[k] };
  }

  // ---------- Cargas: lo que va sobre la balanza o dentro de la probeta (en tinta) ----------
  // (x, y): centro de la base del objeto; e: escala.
  function carga(tipo, x, y, e = 1) {
    const s = v => v * e;
    if (tipo === 'lingote' || tipo === 'lingote-grande') {
      const w = s(tipo === 'lingote' ? 26 : 50), h = s(tipo === 'lingote' ? 10 : 16), dx = s(tipo === 'lingote' ? 5 : 8);
      return `<path d="M${n(x - w / 2)} ${n(y)}L${n(x + w / 2)} ${n(y)}L${n(x + w / 2 - dx)} ${n(y - h)}L${n(x - w / 2 + dx)} ${n(y - h)}Z" fill="currentColor" fill-opacity="0.28" ${tinta(2)}/>`
        + `<line x1="${n(x - w / 2 + dx + s(3))}" y1="${n(y - h + s(3))}" x2="${n(x + w / 2 - dx - s(3))}" y2="${n(y - h + s(3))}" ${tinta(1)} stroke-opacity="0.5"/>`;
    }
    if (tipo === 'medalla') {
      const r = s(11);
      return `<path d="M${n(x - s(6))} ${n(y - 2 * r)}L${n(x - s(10))} ${n(y - 2 * r - s(12))}M${n(x + s(6))} ${n(y - 2 * r)}L${n(x + s(10))} ${n(y - 2 * r - s(12))}" fill="none" ${tinta(2)}/>`
        + `<circle cx="${n(x)}" cy="${n(y - r)}" r="${n(r)}" fill="currentColor" fill-opacity="0.25" ${tinta(2)}/><circle cx="${n(x)}" cy="${n(y - r)}" r="${n(r * 0.55)}" fill="none" ${tinta(1)} stroke-opacity="0.6"/>`;
    }
    if (tipo === 'anillo') return `<ellipse cx="${n(x)}" cy="${n(y - s(5))}" rx="${n(s(10))}" ry="${n(s(5))}" fill="none" ${tinta(3)}/>`;
    if (tipo === 'piedra') return `<path d="M${n(x - s(16))} ${n(y)}Q${n(x - s(18))} ${n(y - s(14))} ${n(x - s(4))} ${n(y - s(17))}Q${n(x + s(14))} ${n(y - s(18))} ${n(x + s(16))} ${n(y - s(5))}Q${n(x + s(17))} ${n(y)} ${n(x + s(8))} ${n(y)}Z" fill="currentColor" fill-opacity="0.22" ${tinta(2)}/>`;
    if (tipo === 'corona') {
      const w = s(30), h = s(20);
      return `<path d="M${n(x - w / 2)} ${n(y)}L${n(x - w / 2)} ${n(y - h)}L${n(x - w / 4)} ${n(y - h * 0.55)}L${n(x)} ${n(y - h)}L${n(x + w / 4)} ${n(y - h * 0.55)}L${n(x + w / 2)} ${n(y - h)}L${n(x + w / 2)} ${n(y)}Z" fill="currentColor" fill-opacity="0.28" ${tinta(2)}/>`;
    }
    if (tipo === 'cubo') {
      const a = s(26), dx = s(8);
      return `<path d="M${n(x - a / 2)} ${n(y)}L${n(x + a / 2)} ${n(y)}L${n(x + a / 2)} ${n(y - a)}L${n(x - a / 2)} ${n(y - a)}Z" fill="currentColor" fill-opacity="0.12" ${tinta(2)}/>`
        + `<path d="M${n(x - a / 2)} ${n(y - a)}L${n(x - a / 2 + dx)} ${n(y - a - dx)}L${n(x + a / 2 + dx)} ${n(y - a - dx)}L${n(x + a / 2)} ${n(y - a)}M${n(x + a / 2 + dx)} ${n(y - a - dx)}L${n(x + a / 2 + dx)} ${n(y - dx)}L${n(x + a / 2)} ${n(y)}" fill="currentColor" fill-opacity="0.22" ${tinta(2)}/>`;
    }
    if (tipo === 'granito') return `<circle cx="${n(x)}" cy="${n(y - 2)}" r="2" fill="currentColor"/><circle cx="${n(x)}" cy="${n(y - 2)}" r="9" fill="none" ${tinta(1.5)} stroke-dasharray="3 2"/>`;
    return '';
  }
  const altoCarga = t => ({ lingote: 10, 'lingote-grande': 16, medalla: 34, anillo: 10, piedra: 18, corona: 20, cubo: 34, granito: 12 }[t] || 0);

  // ---------- Objetos ----------
  // balanza: la masa de lo que va en el plato se lee en la pantalla del frente.
  function balanza(o, c) {
    const x = c.cx, yb = c.yBase - 2, w = Math.min(112, c.w - 16), e = Math.min(1, w / 112);
    let s = `<path d="M${n(x - w / 2)} ${n(yb)}L${n(x + w / 2)} ${n(yb)}L${n(x + w / 2 - 6)} ${n(yb - 30)}L${n(x - w / 2 + 6)} ${n(yb - 30)}Z" fill="currentColor" fill-opacity="0.08" ${tinta(2)}/>`;
    const pw = Math.min(70, w - 26);
    s += `<rect x="${n(x - pw / 2)}" y="${n(yb - 25)}" width="${n(pw)}" height="20" rx="4" fill="var(--card)" ${tinta(1.5)}/>`;
    s += `<line x1="${n(x - w / 2 + 2)}" y1="${n(yb - 36)}" x2="${n(x + w / 2 - 2)}" y2="${n(yb - 36)}" ${tinta(3)}/>`;
    s += `<line x1="${n(x)}" y1="${n(yb - 35)}" x2="${n(x)}" y2="${n(yb - 30)}" ${tinta(2)}/>`;
    s += carga(o.carga, x, yb - 38, e);
    let r = obj('balanza', s);
    r += T.rotulo(x, yb - 10, o.pantalla === undefined ? '' : String(o.pantalla), { ancla: 'middle', tam: 14, peso: 800, color: o.color, min: x - pw / 2 + 2, max: x + pw / 2 - 2 });
    return r;
  }
  // probeta: lo que sube el agua al meter el objeto es su volumen.
  function probeta(o, c) {
    const x = c.cx, yb = c.yBase - 2, top = c.yCuerpo + 4, max = o.max || 100, w = 30;
    const y0 = yb - 10, y1 = top + 6, Y = v => y0 - (y0 - y1) * Math.max(0, Math.min(1, v / max));
    let s = `<path d="M${n(x - 22)} ${n(yb)}L${n(x + 22)} ${n(yb)}L${n(x + 14)} ${n(y0)}L${n(x - 14)} ${n(y0)}Z" fill="currentColor" fill-opacity="0.1" ${tinta(2)}/>`;
    const lleno = o.despues === undefined ? o.antes : o.despues;
    if (lleno !== undefined) s += `<rect x="${n(x - w / 2 + 2)}" y="${n(Y(lleno))}" width="${n(w - 4)}" height="${n(y0 - Y(lleno))}" fill="currentColor" fill-opacity="0.1"/>`
      + `<line x1="${n(x - w / 2 + 2)}" y1="${n(Y(lleno))}" x2="${n(x + w / 2 - 2)}" y2="${n(Y(lleno))}" ${tinta(1.5)}/>`;
    if (o.antes !== undefined && o.despues !== undefined) s += `<line x1="${n(x - w / 2 - 6)}" y1="${n(Y(o.antes))}" x2="${n(x + w / 2 + 6)}" y2="${n(Y(o.antes))}" ${tinta(1.5)} stroke-dasharray="4 3" stroke-opacity="0.8"/>`;
    s += `<path d="M${n(x - w / 2)} ${n(top)}L${n(x - w / 2)} ${n(y0)}L${n(x + w / 2)} ${n(y0)}L${n(x + w / 2)} ${n(top)}" fill="none" ${tinta(2)}/>`;
    s += `<path d="M${n(x - w / 2 - 4)} ${n(top)}L${n(x + w / 2)} ${n(top)}" fill="none" ${tinta(2)}/>`;
    // Marcas cada 10 mL; número cada 50.
    for (let v = 10; v <= max; v += 10) {
      const y = Y(v), larga = v % 50 === 0;
      s += `<line x1="${n(x + w / 2 - (larga ? 10 : 6))}" y1="${n(y)}" x2="${n(x + w / 2)}" y2="${n(y)}" ${tinta(1)}/>`;
    }
    if (o.carga) s += carga(o.carga, x, y0 - 1, 0.6);
    let r = obj('probeta', s);
    for (let v = 50; v <= max; v += 50) r += T.rotulo(x + w / 2 + 4, Y(v) + 5, String(v), { tam: 14, min: Math.max(M, c.x0 + 2), max: Math.min(W - M, c.x1 - 2) });
    r += T.rotulo(x - w / 2 - 6, top + 10, 'mL', { ancla: 'end', tam: 14, min: Math.max(M, c.x0 + 2), max: Math.min(W - M, c.x1 - 2) });
    return r;
  }
  function termometro(x, yTop, yBulbo, texto, color, c) {
    let s = `<rect x="${n(x - 4)}" y="${n(yTop)}" width="8" height="${n(yBulbo - yTop)}" rx="4" fill="var(--card)" ${tinta(1.5)}/>`;
    s += `<circle cx="${n(x)}" cy="${n(yBulbo)}" r="6" fill="currentColor" fill-opacity="0.5" ${tinta(1.5)}/>`;
    s += `<line x1="${n(x)}" y1="${n(yBulbo - 4)}" x2="${n(x)}" y2="${n(yTop + (yBulbo - yTop) * 0.45)}" ${tinta(2.5)} stroke-opacity="0.6"/>`;
    const t = texto === undefined ? '' : String(texto);
    return { s, r: t ? T.rotulo(x - 8, yTop + 12, t, { ancla: 'end', tam: 16, peso: 800, color, min: Math.max(M, c.x0 + 2), max: Math.min(W - M, c.x1 - 2) }) : '' };
  }
  // olla: lo que marca el termómetro es la temperatura del agua; si hierve, burbujas y vapor.
  function olla(o, c) {
    const x = c.cx, yb = c.yBase - 2, tam = Math.max(0.6, Math.min(1.2, o.tam || 1));
    const w = Math.min(c.w - 24, 104) * tam, h = 56 * tam, yf = yb - 16, y0 = yf - h, xi = x - w / 2, xd = x + w / 2;
    // Hornilla y llama.
    let s = `<rect x="${n(x - Math.min(56, c.w / 2 - 8))}" y="${n(yb - 8)}" width="${n(Math.min(112, c.w - 16))}" height="8" rx="2" fill="currentColor" fill-opacity="0.2" ${tinta(1.5)}/>`;
    s += `<line x1="${n(x - w * 0.35)}" y1="${n(yb - 9)}" x2="${n(x + w * 0.35)}" y2="${n(yb - 9)}" ${tinta(2)}/>`;
    if (o.fuego) for (let k = -2; k <= 2; k++) {
      const fx = x + k * w * 0.14;
      s += `<path d="M${n(fx - 4)} ${n(yb - 9)}Q${n(fx)} ${n(yb - 21)} ${n(fx)} ${n(yb - 21)}Q${n(fx)} ${n(yb - 21)} ${n(fx + 4)} ${n(yb - 9)}" fill="currentColor" fill-opacity="0.35" ${tinta(1.2)}/>`;
    }
    // Agua.
    const nivel = Math.max(0, Math.min(0.95, o.nivel === undefined ? 0.7 : o.nivel)), yl = yf - h * nivel;
    if (nivel > 0) s += `<rect x="${n(xi + 3)}" y="${n(yl)}" width="${n(w - 6)}" height="${n(yf - yl - 2)}" fill="currentColor" fill-opacity="0.12"/>`
      + `<line x1="${n(xi + 3)}" y1="${n(yl)}" x2="${n(xd - 3)}" y2="${n(yl)}" ${tinta(1.5)} stroke-opacity="0.7"/>`;
    if (o.hierve && nivel > 0.12) for (let k = 0; k < 6; k++) {
      const bx = xi + w * (0.18 + 0.13 * k), by = yf - 6 - ((k * 7) % 3) * (yf - yl - 10) / 3;
      s += `<circle cx="${n(bx)}" cy="${n(by)}" r="${n(2.2 + (k % 3))}" fill="none" ${tinta(1.2)}/>`;
    }
    // Olla y asas.
    s += `<path d="M${n(xi)} ${n(y0)}L${n(xi)} ${n(yf - 4)}Q${n(xi)} ${n(yf)} ${n(xi + 4)} ${n(yf)}L${n(xd - 4)} ${n(yf)}Q${n(xd)} ${n(yf)} ${n(xd)} ${n(yf - 4)}L${n(xd)} ${n(y0)}" fill="none" ${tinta(2.5)}/>`;
    s += `<line x1="${n(xi - 4)}" y1="${n(y0)}" x2="${n(xd + 4)}" y2="${n(y0)}" ${tinta(2.5)}/>`;
    s += `<path d="M${n(xi)} ${n(y0 + 8)}L${n(xi - 9)} ${n(y0 + 8)}M${n(xd)} ${n(y0 + 8)}L${n(xd + 9)} ${n(y0 + 8)}" ${tinta(3)}/>`;
    // Vapor: rizos sobre la boca.
    const nv = Math.round(3 * Math.max(0, Math.min(1, o.vapor || 0)));
    for (let k = 0; k < nv; k++) {
      const vx = x - w * 0.25 + k * w * 0.22, vy = y0 - 6;
      s += `<path d="M${n(vx)} ${n(vy)}Q${n(vx - 6)} ${n(vy - 8)} ${n(vx)} ${n(vy - 15)}Q${n(vx + 6)} ${n(vy - 22)} ${n(vx)} ${n(vy - 29)}" fill="none" ${tinta(1.5)} stroke-opacity="0.55"/>`;
    }
    let r = '';
    if (o.termometro !== undefined) {
      const t = termometro(xd - w * 0.2, c.yCuerpo + 2, Math.max(yl + 8, yf - 12), o.termometro, o.colorT, c);
      s += t.s; r += t.r;
    }
    return obj('olla', s) + r;
  }
  // vaso: un vaso con agua (nivel; 0, sin agua); encima puede llevar una capa de aceite, abajo arena o un polvo de dos
  // clases de grano, y adentro cubitos de hielo y un termómetro. Lo que marca el termómetro es la temperatura del agua.
  function vaso(o, c) {
    const x = c.cx, yb = c.yBase - 2, wt = Math.min(76, c.w - 30), wb = wt * 0.8, top = yb - 90;
    const borde = y => { const f = (yb - y) / 90, w = wb + (wt - wb) * f; return [x - w / 2, x + w / 2]; };
    const nivel = o.nivel === undefined ? 0.71 : Math.max(0, Math.min(0.9, o.nivel)), yl = yb - 90 * nivel;
    const [la, lb] = borde(yl), [ba, bb] = borde(yb);
    let s = '';
    if (nivel > 0) {
      s += `<path d="M${n(la + 2)} ${n(yl)}L${n(lb - 2)} ${n(yl)}L${n(bb - 2)} ${n(yb - 2)}L${n(ba + 2)} ${n(yb - 2)}Z" fill="currentColor" fill-opacity="0.1"/>`;
      s += `<line x1="${n(la + 2)}" y1="${n(yl)}" x2="${n(lb - 2)}" y2="${n(yl)}" ${tinta(1.5)} stroke-opacity="0.7"/>`;
      if (o.capa) {
        const yc = yl + 90 * Math.max(0.08, Math.min(0.4, o.capa.alto || 0.2)), [ca, cb] = borde(yc);
        s += `<path d="M${n(la + 2)} ${n(yl)}L${n(lb - 2)} ${n(yl)}L${n(cb - 2)} ${n(yc)}L${n(ca + 2)} ${n(yc)}Z" fill="currentColor" fill-opacity="0.22"/>`;
        s += `<line x1="${n(ca + 2)}" y1="${n(yc)}" x2="${n(cb - 2)}" y2="${n(yc)}" ${tinta(1.5)} stroke-opacity="0.7"/>`;
      }
    }
    // Granos en el fondo: arena (redondos) o un polvo de dos clases (redondos y cruces).
    if (o.fondo || o.polvo) {
      let gr = '';
      for (let fl = 0; fl < (o.polvo ? 4 : 3); fl++) for (let q = 0; q < 12; q++) {
        const y = yb - 4 - fl * 3.4, [a, b] = borde(y), gx = a + 5 + (b - a - 10) * (q + (fl % 2) * 0.5) / 12;
        if (gx > b - 4) continue;
        gr += o.polvo && (q + fl) % 2 ? `<path d="M${n(gx - 1.6)} ${n(y - 1.6)}L${n(gx + 1.6)} ${n(y + 1.6)}M${n(gx - 1.6)} ${n(y + 1.6)}L${n(gx + 1.6)} ${n(y - 1.6)}" ${tinta(1.2)}/>` : `<circle cx="${n(gx)}" cy="${n(y)}" r="1.7" fill="currentColor" fill-opacity="0.6"/>`;
      }
      s += gr;
    }
    const nc = Math.max(0, Math.min(3, Math.round(o.cubitos || 0)));
    for (let k = 0; k < nc; k++) {
      const cx = x - 24 + k * 13, cy = yl - 6 + (k % 2) * 3;
      s += `<rect x="${n(cx - 7)}" y="${n(cy)}" width="14" height="13" rx="3" fill="var(--card)" fill-opacity="0.85" ${tinta(1.5)}/>`;
    }
    const [ta, tb] = borde(top);
    s += `<path d="M${n(ta)} ${n(top)}L${n(ba)} ${n(yb)}L${n(bb)} ${n(yb)}L${n(tb)} ${n(top)}" fill="none" ${tinta(2)}/>`;
    let r = '';
    if (o.termometro !== undefined) {
      const t = termometro(x + wt * 0.22, c.yCuerpo + 2, yb - 14, o.termometro, o.colorT, c);
      s += t.s; r += t.r;
    }
    return obj('vaso', s) + r;
  }
  // curva: el punto avanza con el calor que entra; sube solo si sube la temperatura (la meseta es plana).
  function geoCurva(o, c) {
    const x0 = c.x0 + 46, x1 = c.x1 - 14, y0 = c.yBase - 34, y1 = c.yCuerpo + 14;
    const xmax = o.xmax || 1, ymin = o.ymin === undefined ? 0 : o.ymin, ymax = o.ymax === undefined ? 100 : o.ymax;
    return { x0, x1, y0, y1, X: q => x0 + (x1 - x0) * q / xmax, Y: t => y0 - (y0 - y1) * (t - ymin) / (ymax - ymin) };
  }
  function hasta(ps, q) {
    const out = [ps[0]];
    for (let i = 1; i < ps.length; i++) {
      const [a, ya] = ps[i - 1], [b, yb] = ps[i];
      if (q >= b) { out.push(ps[i]); continue; }
      if (q > a) out.push([q, ya + (yb - ya) * (q - a) / (b - a)]);
      break;
    }
    return out;
  }
  function curva(o, c) {
    const g = geoCurva(o, c), ps = o.puntos || [];
    const lin = l => `M${l.map(p => `${n(g.X(p[0]))} ${n(g.Y(p[1]))}`).join('L')}`;
    let s = `<line x1="${n(g.x0)}" y1="${n(g.y0)}" x2="${n(g.x1 + 6)}" y2="${n(g.y0)}" ${tinta(1.5)}/><line x1="${n(g.x0)}" y1="${n(g.y0)}" x2="${n(g.x0)}" y2="${n(g.y1 - 6)}" ${tinta(1.5)}/>`;
    let r = '';
    for (const v of o.xMarcas || []) { s += `<line x1="${n(g.X(v))}" y1="${n(g.y0)}" x2="${n(g.X(v))}" y2="${n(g.y0 + 5)}" ${tinta(1.5)}/>`; r += T.rotulo(g.X(v), g.y0 + 20, String(v.texto || v).replace('.', ','), { ancla: 'middle', tam: 14, min: Math.max(M, c.x0 + 2), max: Math.min(W - M, c.x1 - 2) }); }
    for (const v of o.yMarcas || []) { s += `<line x1="${n(g.x0 - 5)}" y1="${n(g.Y(v))}" x2="${n(g.x0)}" y2="${n(g.Y(v))}" ${tinta(1.5)}/><line x1="${n(g.x0)}" y1="${n(g.Y(v))}" x2="${n(g.x1)}" y2="${n(g.Y(v))}" stroke="currentColor" stroke-opacity="0.15" stroke-width="1"/>`; r += T.rotulo(g.x0 - 8, g.Y(v) + 5, String(v).replace('.', ','), { ancla: 'end', tam: 14, min: Math.max(M, c.x0 + 2), max: Math.min(W - M, c.x1 - 2) }); }
    if (ps.length > 1) {
      if (o.completa !== false) s += `<path d="${lin(ps)}" fill="none" ${tinta(2)} stroke-dasharray="4 4" stroke-opacity="0.45"/>`;
      const h = o.hasta === undefined ? ps[ps.length - 1][0] : o.hasta, l = hasta(ps, h);
      if (l.length > 1) s += `<path d="${lin(l)}" fill="none" stroke="${T.color(o.colorY || 'f')}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`;
      if (o.hasta !== undefined) {
        const p = l[l.length - 1];
        s += `<circle cx="${n(g.X(p[0]))}" cy="${n(g.Y(p[1]))}" r="6" fill="var(--card)" stroke="${T.color(o.colorY || 'f')}" stroke-width="3"/>`;
        const yp = g.Y(p[1]) - 12 - 11 < c.yCuerpo + 2 ? g.Y(p[1]) + 24 : g.Y(p[1]) - 12;   // si no cabe arriba, debajo del punto
        if (o.punto) r += T.rotulo(g.X(p[0]), yp, o.punto, { ancla: 'middle', tam: 14, peso: 800, color: o.colorY || 'f', min: g.x0 + 4, max: Math.min(W - M, c.x1 - 2) });
      }
    }
    r += T.rotulo(g.x1 + 6, g.y0 + 20, o.x || 'Q', { ancla: 'end', tam: 14, peso: 700, color: o.colorX || 'o', min: Math.max(M, c.x0 + 2), max: Math.min(W - M, c.x1 - 2) });
    r += T.rotulo(g.x0 + 8, g.y1 - 2, o.y || 'T', { tam: 14, peso: 700, color: o.colorY || 'f', min: Math.max(M, c.x0 + 2), max: Math.min(W - M, c.x1 - 2) });
    return obj('curva', s) + r;
  }
  // Un balón de gas de cocina: cuerpo, cuello y válvula.
  function iconoBalon(x, yb, e = 1, op = 0) {
    const w = 16 * e, h = 22 * e, rr = 5 * e;
    return `<rect x="${n(x - w / 2)}" y="${n(yb - h)}" width="${n(w)}" height="${n(h)}" rx="${n(rr)}" fill="currentColor" fill-opacity="${op}" ${tinta(Math.max(1.2, 1.5 * e))}/>`
      + `<path d="M${n(x - 4 * e)} ${n(yb - h)}L${n(x - 4 * e)} ${n(yb - h - 4 * e)}L${n(x + 4 * e)} ${n(yb - h - 4 * e)}L${n(x + 4 * e)} ${n(yb - h)}" fill="none" ${tinta(Math.max(1.2, 1.5 * e))}/>`;
  }
  // balones: cada ícono son `por` balones; los llenos son la energía de lo que desaparece; la caja punteada, la meta.
  function balones(o, c) {
    const total = Math.max(1, Math.min(20, o.total || 20)), por = o.por || 100, cols = 10, paso = (c.w - 24) / cols;
    const filas = Math.ceil(total / cols), valor = Math.max(0, o.valor || 0);
    let s = '';
    for (let k = 0; k < total; k++) {
      const col = k % cols, fl = Math.floor(k / cols), x = c.x0 + 12 + paso * (col + 0.5), yb = c.yCuerpo + 34 + fl * 38;
      const lleno = Math.max(0, Math.min(1, valor / por - k));
      s += iconoBalon(x, yb, 1, 0);
      if (lleno > 0) s += `<rect x="${n(x - 6.5)}" y="${n(yb - 20 * lleno - 1)}" width="13" height="${n(20 * lleno)}" rx="3" fill="${T.color(o.color || 'f')}" fill-opacity="0.75"/>`;
    }
    if (o.meta) {
      const k = Math.min(total, Math.round(o.meta / por)), fl = Math.floor((k - 1) / cols);
      const x1 = c.x0 + 12 + paso * ((k - 1) % cols + 1), y1 = c.yCuerpo + 34 + fl * 38 + 4;
      s += `<path d="M${n(c.x0 + 10)} ${n(c.yCuerpo + 4)}L${n(x1 + 2)} ${n(c.yCuerpo + 4)}L${n(x1 + 2)} ${n(y1)}L${n(c.x0 + 10)} ${n(y1)}Z" fill="none" ${tinta(1.5)} stroke-dasharray="5 4"/>`;
    }
    void filas;
    return obj('balones', s);
  }
  // balon: un balón de gas de cocina con lo que tiene escrito al costado.
  function balon(o, c) {
    const x = c.cx, yb = c.yBase - 2;
    let s = iconoBalon(x, yb, 3, 0.08);
    s += `<line x1="${n(x - 24)}" y1="${n(yb - 40)}" x2="${n(x + 24)}" y2="${n(yb - 40)}" ${tinta(1.5)} stroke-opacity="0.5"/>`;
    return obj('balon', s);
  }
  // balanza2: baja el platillo que pesa más; con 'duda' queda quieta y con un «?».
  function balanza2(o, c) {
    const x = c.cx, yb = c.yBase - 2, top = c.yCuerpo + 10, L = Math.min(104, c.w / 2 - 50);
    const ang = o.inclina === 'izq' ? 0.12 : o.inclina === 'der' ? -0.12 : 0;   // lado que baja
    const ay = top + 26, px = s => x + s * L * Math.cos(ang), py = s => ay + s * L * Math.sin(ang) * -1;
    let s = `<path d="M${n(x - 30)} ${n(yb)}L${n(x + 30)} ${n(yb)}L${n(x + 6)} ${n(yb - 10)}L${n(x - 6)} ${n(yb - 10)}Z" fill="currentColor" fill-opacity="0.12" ${tinta(2)}/>`;
    s += `<line x1="${n(x)}" y1="${n(yb - 10)}" x2="${n(x)}" y2="${n(ay)}" ${tinta(3)}/>`;
    s += `<line x1="${n(px(-1))}" y1="${n(py(-1))}" x2="${n(px(1))}" y2="${n(py(1))}" ${tinta(3)}/>`;
    s += `<circle cx="${n(x)}" cy="${n(ay)}" r="4" fill="var(--card)" ${tinta(2)}/>`;
    let r = '';
    for (const [lado, sg] of [['izq', -1], ['der', 1]]) {
      const hx = px(sg), hy = py(sg), plato = hy + 46, nu = ((o[lado] || {}).nucleos || []).slice(0, 6);
      s += `<line x1="${n(hx)}" y1="${n(hy)}" x2="${n(hx - 42)}" y2="${n(plato)}" ${tinta(1.2)} stroke-opacity="0.7"/><line x1="${n(hx)}" y1="${n(hy)}" x2="${n(hx + 42)}" y2="${n(plato)}" ${tinta(1.2)} stroke-opacity="0.7"/>`;
      s += `<path d="M${n(hx - 46)} ${n(plato)}Q${n(hx)} ${n(plato + 12)} ${n(hx + 46)} ${n(plato)}Z" fill="currentColor" fill-opacity="0.12" ${tinta(2)}/>`;
      nu.forEach((e, i) => {
        const big = e.length > 1, rr = big ? 13 : 10, cxn = hx + (i - (nu.length - 1) / 2) * (big ? 28 : 21.5), cyn = plato - rr - 1;
        s += `<circle cx="${n(cxn)}" cy="${n(cyn)}" r="${rr}" fill="var(--card)" ${tinta(1.5)}/>`;
        r += T.rotulo(cxn, cyn + 5, e, { ancla: 'middle', tam: 14, peso: 700, min: Math.max(M, c.x0 + 2), max: Math.min(W - M, c.x1 - 2) });
      });
    }
    if (o.inclina === 'duda') r += T.rotulo(x, top + 14, '?', { ancla: 'middle', tam: 18, peso: 800, min: Math.max(M, c.x0 + 2), max: Math.min(W - M, c.x1 - 2) });
    return obj('balanza2', s) + r;
  }
  const DIBUJO = { balanza, probeta, olla, vaso, curva, balones, balon, balanza2 };

  function dibujar(d, estado = {}) {
    const g = geometria(d), corte = Math.max(0, estado.corte || 0), os = objs(d);
    let s = '';
    for (const f of g.filas) if (f.mesa) s += `<line x1="${M + 1}" y1="${n(f.yBase)}" x2="${W - M - 1}" y2="${n(f.yBase)}" ${tinta(2)}/>`;
    os.forEach((o, k) => {
      const c = g.caja(k);
      if ((o.desde || 0) > corte) return;
      const nuevo = (o.desde || 0) === corte && corte > 0 ? ' kit-nuevo kit-aparece' : '';
      let t = '';
      const ls = lineas(o.titulo, c.w - 8);
      ls.forEach((x, j) => { t += T.rotulo(c.cx, c.yTit + 14 + LINEA * j + (c.nl - ls.length) * LINEA, x, { ancla: 'middle', peso: 700, tam: TAM, min: Math.max(M, c.x0 + 2), max: Math.min(W - M, c.x1 - 2) }); });
      t += (DIBUJO[o.tipo] || (() => ''))(o, c);
      (o.rotulos || []).forEach((ro, j) => {
        if ((ro.desde || 0) > corte) return;
        t += T.rotulo(c.cx, c.yBase + 18 + ROT * j, ro.texto, { ancla: 'middle', tam: 15, peso: 800, color: ro.color, min: Math.max(M, c.x0 + 2), max: Math.min(W - M, c.x1 - 2), clase: (ro.desde || 0) === corte && corte > 0 ? 'kit-nuevo kit-aparece' : '' });
      });
      s += `<g class="kit-cosa${nuevo}">${t}</g>`;
    });
    return T.svg(W, g.alto, s, { alt: alt(d) });
  }

  const NOMBRE = { balanza: 'una balanza de cocina', probeta: 'una probeta con agua', olla: 'una olla sobre la hornilla', vaso: 'un vaso',
    curva: 'la curva de temperatura contra calor', balones: 'una fila de balones de gas', balon: 'un balón de gas', balanza2: 'una balanza de dos platillos' };
  function alt(d) {
    if (d.alt) return d.alt;
    const partes = objs(d).map(o => {
      let s = NOMBRE[o.tipo] || 'un objeto';
      if (o.titulo) s += ` («${o.titulo}»)`;
      if (o.tipo === 'balanza' && o.pantalla !== undefined) s += `, que marca ${o.pantalla}`;
      if (o.tipo === 'probeta' && o.antes !== undefined) s += `: el agua ${o.despues !== undefined ? `pasa de ${o.antes} a ${o.despues} mL` : `llega a ${o.antes} mL`}`;
      if ((o.tipo === 'olla' || o.tipo === 'vaso') && o.termometro !== undefined) s += `, con un termómetro que marca ${o.termometro}`;
      if (o.tipo === 'balanza2') s += o.inclina === 'duda' ? ', quieta y con un signo de pregunta' : o.inclina === 'nivel' ? ', en equilibrio' : `, baja el platillo de la ${o.inclina === 'izq' ? 'izquierda' : 'derecha'}`;
      const rs = (o.rotulos || []).map(r => r.texto);
      if (rs.length) s += ` (${rs.join('; ')})`;
      return s;
    });
    return `Dibujo: ${partes.join('; ')}.`;
  }

  return { id: 'quim-cocina', dibujar, alt, geometria, geoCurva: (d, k) => geoCurva(objs(d)[k], geometria(d).caja(k)) };
});
