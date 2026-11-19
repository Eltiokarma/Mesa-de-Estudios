/*
 * Pieza «alg-reparto» (19 nov 2026, Etapa 6): los objetos de la unidad «División de polinomios y cocientes notables»
 * (contenido/teoria/algebra/division-de-polinomios.js; docs/etapa6/propuesta-algebra.md §2). Dibujo de prueba
 * (data-prueba): Gerson decide después si lo reemplaza (docs/plan-calidad.md, M4).
 *
 * Afirmación de la figura: dividir es acomodar el dividendo en un rectángulo de ancho dado (el divisor); el largo es el
 * cociente y lo que no alcanza para otro tramo es el resto. En el cuaderno, cada columna es una potencia de x y cada
 * casilla sale de las que ya se ven.
 *
 * Objetos:
 *   'pasadizo'  el pasadizo de Rubén: un rectángulo de (c·x + b) dm de ancho y (p·x + s) dm de largo hecho con las piezas
 *               de Polinomios (loseta x por x, tira x por 1, cuadradito 1 por 1). A la derecha, lo que sobra del pedido
 *               (naranja) o lo que falta (las piezas que no hay quedan punteadas dentro del rectángulo).
 *               datos = { objeto: 'pasadizo', ancho: [c, b], largo: [p, s], pedido: [losetas, tiras, cuadraditos]
 *                 (por defecto, justo lo que pide el rectángulo), tope: [p, s] y topeAncho: [c, b] (la escala del juego:
 *                 nada cambia de tamaño al mover el control), rotuloLargo: true | '?' | false, rotuloAncho: true | false,
 *                 sobran: true | false (la zona de la derecha), piezas: true | false (false: solo el borde) }.
 *   'angosto'   el piso de x² + x + 1 dm² visto como un rectángulo de (x − a) por q(x) dm y r cuadraditos sueltos; al
 *               achicar la loseta (x), el rectángulo se angosta y con x = a desaparece.
 *               datos = { objeto: 'angosto', x, a, q: [p, s] (q(x) = p·x + s), r, xMax, valores: true (los rótulos con
 *                 su valor en dm), resto: true | '?' }.
 *   'cuaderno'  una hoja de cuaderno cuadriculada con la cuenta escrita:
 *               tipo 'larga'   la división por columnas: datos.potencias (encabezados), datos.filas = [{ rotulo, celdas,
 *                              raya }] (raya: una línea encima de la fila, como al restar en el colegio);
 *               tipo 'ruffini' la tabla de tres filas: datos.coefs (arriba), datos.a (a la izquierda), datos.medio (los
 *                              productos, uno por columna desde la segunda), datos.abajo (q y, en la última, r, en una
 *                              caja; caja: false la quita, si el color delataría la respuesta); flechas: true dibuja
 *                              «multiplica por a» de cada casilla de abajo a la del medio;
 *               tipo 'horner'  datos.coefs (arriba), datos.divisor (la columna de la izquierda: el primero de d y los
 *                              demás con el signo cambiado), datos.filas (los productos, ya en su columna), datos.abajo
 *                              (q y r), datos.corte (cuántas columnas son de q).
 *               Una celda es un texto o { t, c: 'o' | 'i' | 'f' | null, hueco: true ('?' en una caja punteada), fuerte }.
 *               datos.cabeza y datos.pie: líneas de texto de colores [[texto, color, peso], …] arriba y debajo de la
 *               tabla. datos.pasos: [{ …datos }, …] para «Mira» (estado.paso elige qué cambia).
 *
 * estado = { paso }. Función pura de (datos, estado): sin ids, sin azar, sin reloj. Ancho 320; alto fijo por objeto
 * (pasadizo y angosto 220; el cuaderno, según sus filas). Colores: tinta (currentColor) y var(--c-*): el divisor en
 * turquesa (i), el cociente en violeta (f), el resto en naranja (o). Nunca carmín ni verde. La forma dice qué pieza es;
 * el color solo dice si forma el rectángulo (tinta) o sobra (naranja).
 * geometria(datos, estado) da las cajas de todo lo dibujado (objetos y textos) para la prueba numérica de encuadre.
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
  const W = 320, M = 4, TAM = 13, R = 3.4;   // R: cuántos dm dibujados mide una x (la loseta es 3,4 veces el cuadradito)
  const n2 = T.n;
  const ent = v => Math.max(0, Math.floor(+v || 0));

  function mezcla(datos, estado) {
    const ps = (datos && datos.pasos) || [];
    const p = ps[Math.max(0, Math.min(ps.length - 1, (estado && estado.paso) | 0))];
    const d = Object.assign({}, datos || {}, p || {});
    delete d.pasos;
    return d;
  }
  const anchoSegs = (segs, tam) => segs.reduce((a, s) => a + T.ancho(s[0], tam, s[2] || 400), 0);
  function texto(t) {
    // Varios espacios seguidos separan dos datos de una línea: el SVG los juntaría en uno, así que van como espacios duros.
    const spans = t.segs.map(([s, c, p]) => `<tspan fill="${T.color(c)}"${p && p !== 400 ? ` font-weight="${p}"` : ''}>${T.esc(s).replace(/ {2,}/g, m => '\u00a0'.repeat(m.length))}</tspan>`).join('');
    return `<text class="kit-txt" x="${n2(t.x)}" y="${n2(t.y)}" font-size="${t.tam}"${t.ancla !== 'start' ? ` text-anchor="${t.ancla}"` : ''} style="font-variant-numeric:tabular-nums">${spans}</text>`;
  }
  function ponTexto(textos, que, x, y, segs, ancla = 'start', tam = TAM) {
    const w = anchoSegs(segs, tam), x0 = ancla === 'end' ? x - w : ancla === 'middle' ? x - w / 2 : x;
    textos.push({ que, txt: segs.map(s => s[0]).join(''), x0, x1: x0 + w, y0: y - tam * 0.8, y1: y + tam * 0.25, segs, x, y, tam, ancla });
  }
  // Un binomio p·x + s escrito como lo lee el alumno: (x + 2), (3x + 3), 2x, 5.
  function binomio(p, s, par = true, signo = '+') {
    const xs = p === 0 ? '' : `${p === 1 ? '' : p}x`;
    if (!s) return xs || '0';
    if (!xs) return String(s);
    const t = `${xs} ${signo} ${Math.abs(s)}`;
    return par ? `(${t})` : t;
  }
  const NOM = [['loseta', 'losetas'], ['tira', 'tiras'], ['cuadradito', 'cuadraditos']];
  const cuantas = c => c.map((n, k) => (n > 0 ? `${n} ${NOM[k][n === 1 ? 0 : 1]}` : null)).filter(Boolean).join(', ') || 'nada';

  function pieza(x, y, w, h, color, clase, falta) {
    const c = T.color(color);
    if (falta) return `<rect class="alg-pieza alg-falta ${clase}" x="${n2(x + 1.5)}" y="${n2(y + 1.5)}" width="${n2(w - 3)}" height="${n2(h - 3)}" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 2.5"/>`;
    let s = `<rect class="alg-pieza ${clase}" x="${n2(x + 0.75)}" y="${n2(y + 0.75)}" width="${n2(w - 1.5)}" height="${n2(h - 1.5)}" rx="1.5" fill="${c}" fill-opacity="0.2" stroke="${c}" stroke-width="1.5"/>`;
    if (clase === 'loseta' && w >= 18 && h >= 18) s += `<rect x="${n2(x + 4)}" y="${n2(y + 4)}" width="${n2(w - 8)}" height="${n2(h - 8)}" rx="1" fill="none" stroke="${c}" stroke-opacity="0.45" stroke-width="1"/>`;
    return s;
  }

  // ---------- Objeto 'pasadizo' ----------
  const PA = { H: 220, zona: 96, sep: 12, gap: 4, uMax: 18 };
  function necesita(ancho, largo) {
    const [c, b] = ancho, [p, s] = largo;
    return [c * p, c * s + b * p, b * s];
  }
  function geoPasadizo(d) {
    const H = PA.H, ancho = (d.ancho || [1, 2]).map(ent), largo = (d.largo || [1, 3]).map(ent);
    const tope = (d.tope || largo).map(ent), topeA = (d.topeAncho || ancho).map(ent);
    const pide = necesita(ancho, largo), pedido = (d.pedido || pide).map(ent);
    const sobra = pedido.map((n, k) => n - pide[k]);
    const conZona = d.sobran !== false;
    const etA = `${binomio(ancho[0], ancho[1])} dm`;
    const wEtA = Math.max(T.ancho(etA, 12, 700), T.ancho(binomio(topeA[0], topeA[1]) + ' dm', 12, 700), T.ancho('ancho:', 12, 400));
    const izq = M + wEtA + 10;
    const dispW = W - M - izq - (conZona ? PA.zona + PA.sep : 4), dispH = H - 2 * M - 26 - 8;
    const lT = tope[0] * R + tope[1], aT = topeA[0] * R + topeA[1];
    const u = Math.min(PA.uMax, dispW / Math.max(lT, 1), dispH / Math.max(aT, 1)), X = R * u;
    const cols = [...Array(largo[0]).fill(X), ...Array(largo[1]).fill(u)], filas = [...Array(ancho[0]).fill(X), ...Array(ancho[1]).fill(u)];
    const w = cols.reduce((a, b) => a + b, 0), h = filas.reduce((a, b) => a + b, 0);
    const x0 = izq, y0 = M + 26;
    const objetos = [], textos = [], formas = [];
    if (w > 0 && h > 0) objetos.push({ que: 'pasadizo', x0, y0, x1: x0 + w, y1: y0 + h });
    // Las piezas del rectángulo, en orden de lectura; las que el pedido no tiene quedan punteadas (faltan).
    const quedan = pedido.slice();
    if (d.piezas !== false) {
      let yy = y0;
      filas.forEach((hh, i) => {
        let xx = x0;
        cols.forEach((ww, j) => {
          const k = ww === X && hh === X ? 0 : ww === u && hh === u ? 2 : 1;
          const falta = quedan[k] <= 0;
          quedan[k]--;
          formas.push({ que: NOM[k][0], x: xx, y: yy, w: ww, h: hh, falta, i, j });
          xx += ww;
        });
        yy += hh;
      });
    }
    // Cada medida dice qué es, donde está dibujada (sesión, 19 nov): «ancho:» sobre el número, a la izquierda;
    // «largo:» antes del número, arriba.
    if (d.rotuloAncho !== false && h > 0) {
      ponTexto(textos, 'ancho', x0 - 7, y0 + h / 2 - 4, [['ancho:', null, 400]], 'end', 12);
      ponTexto(textos, 'ancho', x0 - 7, y0 + h / 2 + 11, [[etA, 'i', 700]], 'end', 12);
    }
    if (d.rotuloLargo !== false && w > 0) {
      const t = d.rotuloLargo === '?' ? [['largo: ?', null, 700]] : [['largo: ', null, 400], [`${binomio(largo[0], largo[1])} dm`, 'f', 700]];
      ponTexto(textos, 'largo', x0 + w / 2, y0 - 9, t, 'middle', 12);
    }
    // La zona de la derecha: lo que sobra (en naranja, apilado) o lo que falta (en palabras).
    if (conZona) {
      const zx = W - M - PA.zona, zy = y0;
      const falta = sobra.map(v => Math.max(0, -v)), resta = sobra.map(v => Math.max(0, v));
      if (falta.some(v => v > 0)) {
        ponTexto(textos, 'zona', zx, zy + 10, [['Faltan:', null, 700]], 'start', 12);
        cuantas(falta).split(', ').forEach((l, k) => ponTexto(textos, 'zona', zx, zy + 28 + 16 * k, [[l]], 'start', 12));
      } else {
        ponTexto(textos, 'zona', zx, zy + 10, [['Sobran:', 'o', 700]], 'start', 12);
        let yy = zy + 22, xx = zx;
        const tu = Math.max(10, Math.min(u, 15)), tX = R * tu;
        if (!resta.some(v => v > 0)) ponTexto(textos, 'zona', zx, zy + 28, [['nada']], 'start', 12);
        for (let i = 0; i < resta[0]; i++) { formas.push({ que: 'loseta', x: xx, y: yy, w: tX, h: tX, sobra: true }); xx += tX + PA.gap; if (xx + tX > W - M) { xx = zx; yy += tX + PA.gap; } }
        if (resta[0]) { yy += tX + PA.gap; xx = zx; }
        for (let i = 0; i < resta[1]; i++) { formas.push({ que: 'tira', x: zx, y: yy, w: tX, h: tu, sobra: true }); yy += tu + PA.gap; }
        for (let i = 0; i < resta[2]; i++) { formas.push({ que: 'cuadradito', x: xx, y: yy, w: tu, h: tu, sobra: true }); xx += tu + PA.gap; if (xx + tu > W - M) { xx = zx; yy += tu + PA.gap; } }
        for (const f of formas.filter(f => f.sobra)) objetos.push({ que: 'sobra', x0: f.x, y0: f.y, x1: f.x + f.w, y1: f.y + f.h });
      }
    }
    // Alto: el del rectángulo más ancho del juego o el de la zona con todo el pedido sobrando (estable al jugar).
    const tu = Math.max(10, Math.min(u, 15)), tX = R * tu, porFila = Math.max(1, Math.floor((PA.zona + PA.gap) / (tu + PA.gap)));
    const zonaAlto = conZona ? 22 + (pedido[0] ? Math.ceil(pedido[0] / Math.max(1, Math.floor((PA.zona + PA.gap) / (tX + PA.gap)))) * (tX + PA.gap) : 0) + pedido[1] * (tu + PA.gap) + Math.ceil(pedido[2] / porFila) * (tu + PA.gap) : 0;
    const Hc = Math.ceil(Math.max(y0 + aT * u, y0 + zonaAlto, y0 + 60) + 12);
    return { W, H: Math.min(H, Hc), M, d, u, X, ancho, largo, pedido, pide, sobra, formas, objetos, textos };
  }
  function dibPasadizo(datos, estado) {
    const g = geometria(datos, estado);
    let s = '';
    for (const f of g.formas) s += pieza(f.x, f.y, f.w, f.h, f.sobra ? 'o' : null, f.que, f.falta);
    const o = g.objetos.find(b => b.que === 'pasadizo');
    if (o) s += `<rect x="${n2(o.x0)}" y="${n2(o.y0)}" width="${n2(o.x1 - o.x0)}" height="${n2(o.y1 - o.y0)}" fill="none" stroke="${T.color('i')}" stroke-width="2"/>`;
    for (const t of g.textos) s += texto(t);
    return T.svg(W, g.H, `<g class="kit-objeto" data-objeto="pasadizo" data-prueba="si">${s}</g>`, { alt: alt(datos, estado) });
  }
  function altPasadizo(d) {
    const g = geoPasadizo(d), falta = g.sobra.map(v => Math.max(0, -v)), resta = g.sobra.map(v => Math.max(0, v));
    const largo = d.rotuloLargo === '?' ? 'un largo por hallar' : `${binomio(g.largo[0], g.largo[1], false)} dm de largo`;
    let t = `Un pasadizo de ${binomio(g.ancho[0], g.ancho[1], false)} dm de ancho y ${largo}, hecho con losetas, tiras y cuadraditos.`;
    if (d.sobran !== false) t += falta.some(v => v > 0) ? ` Al pedido le faltan ${cuantas(falta)}: quedan huecos punteados.` : ` Del pedido sobran: ${cuantas(resta)}.`;
    return t;
  }

  // ---------- Objeto 'angosto' ----------
  const AN = { H: 220, izq: 92 };
  function geoAngosto(d) {
    const H = AN.H, a = +d.a || 2, x = Math.max(a, +d.x || a), xMax = Math.max(x, +d.xMax || x), q = d.q || [1, 3], r = ent(d.r === undefined ? 7 : d.r);
    const qv = v => q[0] * v + q[1];
    const dispW = W - M - AN.izq - 6, dispH = 112;
    const u = Math.min(dispW / qv(xMax), dispH / (xMax - a || 1), dispW / Math.max(r, 1), 28);
    const w = qv(x) * u, h = (x - a) * u, x0 = AN.izq, y0 = M + 40;
    const objetos = [], textos = [], formas = [];
    objetos.push({ que: 'rect', x0, y0, x1: x0 + w, y1: y0 + Math.max(h, 1) });
    const f = v => String(Math.round(v * 100) / 100).replace('.', ',');
    const val = d.valores !== false;
    ponTexto(textos, 'lado', M + 2, M + 13, [['loseta: x = ', null, 400], [`${f(x)} dm`, null, 700]], 'start', 12);
    ponTexto(textos, 'largo', x0 + w / 2, y0 - 8, [['largo: ', null, 400], [`${binomio(q[0], q[1], false)}${val ? ` = ${f(qv(x))}` : ''} dm`, 'f', 700]], 'middle', 12);
    ponTexto(textos, 'ancho', x0 - 7, y0 + Math.max(h, 0) / 2 - 4, [['ancho:', null, 400]], 'end', 12);
    ponTexto(textos, 'ancho', x0 - 7, y0 + Math.max(h, 0) / 2 + 11, [[`x − ${a}${val ? ` = ${f(x - a)}` : ''} dm`, 'i', 700]], 'end', 12);
    const yc = y0 + Math.max(h, 0) + 24, tu = Math.min(u, (W - M - x0) / Math.max(r, 1) - 3);
    for (let i = 0; i < r; i++) { formas.push({ que: 'cuadradito', x: x0 + i * (tu + 3), y: yc, w: tu, h: tu }); objetos.push({ que: 'cuadradito', x0: x0 + i * (tu + 3), y0: yc, x1: x0 + i * (tu + 3) + tu, y1: yc + tu }); }
    ponTexto(textos, 'resto', x0 - 7, yc + tu / 2 + 4, [[d.resto === '?' ? '? dm²' : `${r} dm²`, d.resto === '?' ? null : 'o', 700]], 'end', 12);
    const Hc = Math.ceil(y0 + (xMax - a) * u + 24 + tu + 14);
    return { W, H: Math.min(H, Hc), M, d, u, x, a, q, r, w, h, x0, y0, formas, objetos, textos };
  }
  function dibAngosto(datos, estado) {
    const g = geometria(datos, estado);
    let s = '';
    if (g.h > 0.5) {
      s += `<rect x="${n2(g.x0)}" y="${n2(g.y0)}" width="${n2(g.w)}" height="${n2(g.h)}" fill="currentColor" fill-opacity="0.08" stroke="currentColor" stroke-width="1.5"/>`;
      s += `<path d="M${n2(g.x0 - 3)} ${n2(g.y0)}V${n2(g.y0 + g.h)}" stroke="${T.color('i')}" stroke-width="3"/>`;
      s += `<path d="M${n2(g.x0)} ${n2(g.y0 - 3)}H${n2(g.x0 + g.w)}" stroke="${T.color('f')}" stroke-width="3"/>`;
    } else s += `<path d="M${n2(g.x0)} ${n2(g.y0)}H${n2(g.x0 + g.w)}" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3"/>`;
    for (const f of g.formas) s += pieza(f.x, f.y, f.w, f.h, g.d.resto === '?' ? null : 'o', f.que);
    for (const t of g.textos) s += texto(t);
    return T.svg(W, g.H, `<g class="kit-objeto" data-objeto="angosto" data-prueba="si">${s}</g>`, { alt: alt(datos, estado) });
  }
  function altAngosto(d) {
    const g = geoAngosto(d), q = `${binomio(g.q[0], g.q[1], false)}`;
    const rest = d.resto === '?' ? 'unos cuadraditos sueltos' : `${g.r} cuadraditos sueltos`;
    return g.h > 0.5 ? `Con losetas de x = ${g.x} dm, el piso es un rectángulo de x − ${g.a} dm de ancho por ${q} dm de largo, más ${rest}.`
      : `Con losetas de x = ${g.x} dm, el ancho x − ${g.a} vale 0: el rectángulo desaparece y quedan solo ${rest}.`;
  }

  // ---------- Objeto 'cuaderno' ----------
  const CU = { fila: 30, cab: 19, izqHoja: 22, minCol: 30, tam: 15 };
  const celda = x => (x !== null && typeof x === 'object' ? x : { t: x === undefined || x === null ? '' : String(x) });
  // Arma la grilla de cada tipo: celdas[fila][columna], líneas en coordenadas de la grilla y flechas.
  function grilla(d) {
    const tipo = d.tipo || 'larga';
    if (tipo === 'ruffini') {
      const coefs = d.coefs || [], n = coefs.length, medio = d.medio || [], abajo = d.abajo || [];
      const cel = [[null, ...coefs], [d.a, null, ...medio], [null, ...abajo]];
      const lineas = [{ c0: 1, f0: 0, c1: 1, f1: 2 }, { c0: 0, f0: 2, c1: n + 1, f1: 2 }];
      const caja = d.caja !== false && abajo.length === n ? [{ f: 2, c: n }] : [];   // caja: false, sin la caja del resto
      const flechas = d.flechas ? abajo.slice(0, n - 1).map((_, k) => (medio[k] !== undefined && celda(medio[k]).t !== '' ? { de: [2, k + 1], a: [1, k + 2] } : null)).filter(Boolean) : [];
      return { cel, lineas, caja, flechas, rotulos: [], potencias: null };
    }
    if (tipo === 'horner') {
      const coefs = d.coefs || [], n = coefs.length, div = d.divisor || [], filas = d.filas || [], abajo = d.abajo || [], corte = d.corte || n - div.length + 1;
      const m = Math.max(div.length, 1 + filas.length);
      const cel = [[div[0], ...coefs]];
      for (let i = 1; i < m; i++) cel.push([div[i] === undefined ? null : div[i], ...(filas[i - 1] || [])]);
      cel.push([null, ...abajo]);
      const F = cel.length - 1;
      const lineas = [{ c0: 1, f0: 0, c1: 1, f1: F + 1 }, { c0: 0, f0: F, c1: n + 1, f1: F }, { c0: corte + 1, f0: F, c1: corte + 1, f1: F + 1 }, { c0: 0, f0: 1, c1: 1, f1: 1 }];
      return { cel, lineas, caja: [], flechas: [], rotulos: [], potencias: null };
    }
    // larga: una columna de rótulos a la izquierda y una por potencia.
    const filas = d.filas || [];
    const cel = filas.map(f => f.celdas || []);
    const nc = Math.max(1, ...cel.map(c => c.length), (d.potencias || []).length);
    const lineas = [];
    filas.forEach((f, i) => { if (f.raya) lineas.push({ c0: 0, f0: i, c1: nc, f1: i }); });
    return { cel, lineas, caja: [], flechas: [], rotulos: filas.map(f => f.rotulo || null), potencias: d.potencias || null };
  }
  function geoCuaderno(d) {
    const gr = grilla(d), cab = d.cabeza || [], pie = d.pie || [];
    const nc = Math.max(1, ...gr.cel.map(f => f.length), gr.potencias ? gr.potencias.length : 0);
    const rotW = gr.rotulos.some(Boolean) ? Math.max(...gr.rotulos.map(r => (r ? anchoSegs(Array.isArray(r) ? r : [[r]], 12) : 0))) + 10 : 0;
    const anchos = Array(nc).fill(CU.minCol);
    gr.cel.forEach(f => f.forEach((x, k) => { anchos[k] = Math.max(anchos[k], T.ancho(celda(x).t, CU.tam, 700) + 14); }));
    if (gr.potencias) gr.potencias.forEach((p, k) => { anchos[k] = Math.max(anchos[k], T.ancho(String(p), 12, 400) + 12); });
    const util = W - 2 * M - CU.izqHoja - 10 - rotW;
    const suma = anchos.reduce((a, b) => a + b, 0), esc = suma > util ? util / suma : 1;
    const ws = anchos.map(a => a * esc);
    const total = ws.reduce((a, b) => a + b, 0);
    const xIni = M + CU.izqHoja + rotW + Math.max(0, (util - total) / 2);
    const xs = [xIni]; for (const w of ws) xs.push(xs[xs.length - 1] + w);
    let y = M + 14;
    const textos = [], objetos = [];
    for (const l of cab) { y += CU.cab; ponTexto(textos, 'cabeza', M + CU.izqHoja, y - 4, l, 'start', 13); }
    if (gr.potencias) { y += 18; gr.potencias.forEach((p, k) => ponTexto(textos, 'potencia', (xs[k] + xs[k + 1]) / 2, y - 4, [[String(p), null, 400]], 'middle', 12)); }
    const yT = y + 6, ys = gr.cel.map((_, i) => yT + i * CU.fila);
    const celdas = [];
    gr.cel.forEach((f, i) => f.forEach((x, k) => {
      const c = celda(x); if (x === null || x === undefined || (c.t === '' && !c.hueco)) return;
      const cx = (xs[k] + xs[k + 1]) / 2, cy = ys[i] + CU.fila / 2 + 5;
      const t = c.hueco ? '?' : c.t;
      celdas.push({ f: i, c: k, cx, cy, hueco: !!c.hueco, w: Math.min(ws[k] - 4, T.ancho(t, CU.tam, 700) + 10) });
      ponTexto(textos, 'celda', cx, cy, [[t, c.hueco ? null : c.c || null, c.fuerte === false ? 400 : 700]], 'middle', CU.tam);
    }));
    gr.rotulos.forEach((r, i) => { if (r) ponTexto(textos, 'rotulo', xs[0] - 8, ys[i] + CU.fila / 2 + 4, Array.isArray(r) ? r : [[r, null, 400]], 'end', 12); });
    let yF = yT + gr.cel.length * CU.fila + 4;
    for (const l of pie) { yF += CU.cab; ponTexto(textos, 'pie', M + CU.izqHoja, yF - 4, l, 'start', 13); }
    const H = Math.ceil(yF + 10);
    objetos.push({ que: 'tabla', x0: xs[0], y0: yT, x1: xs[nc], y1: yT + gr.cel.length * CU.fila });
    const X = c => xs[Math.min(c, nc)], Y = f => yT + f * CU.fila;
    return { W, H, M, d, gr, xs, ys, yT, X, Y, celdas, textos, objetos, nc };
  }
  function dibCuaderno(datos, estado) {
    const g = geometria(datos, estado);
    let s = `<rect x="${M + 1}" y="${M + 1}" width="${W - 2 * M - 2}" height="${g.H - 2 * M - 2}" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.5"/>`;
    for (let yy = M + 16; yy < g.H - M - 6; yy += 16) s += `<path d="M${M + CU.izqHoja - 6} ${yy}H${W - M - 6}" stroke="currentColor" stroke-opacity="0.1" stroke-width="1"/>`;
    for (let yy = M + 14; yy < g.H - M - 8; yy += 22) s += `<circle cx="${M + 10}" cy="${yy}" r="3" fill="none" stroke="currentColor" stroke-opacity="0.5" stroke-width="1.2"/>`;
    for (const l of g.gr.lineas) s += `<path d="M${n2(g.X(l.c0))} ${n2(g.Y(l.f0))}L${n2(g.X(l.c1))} ${n2(g.Y(l.f1))}" stroke="currentColor" stroke-width="1.6"/>`;
    for (const b of g.gr.caja) s += `<rect x="${n2(g.X(b.c) + 2)}" y="${n2(g.Y(b.f) + 2)}" width="${n2(g.X(b.c + 1) - g.X(b.c) - 4)}" height="${CU.fila - 4}" rx="3" fill="none" stroke="${T.color('o')}" stroke-width="1.5"/>`;
    for (const c of g.celdas) if (c.hueco) s += `<rect x="${n2(c.cx - c.w / 2)}" y="${n2(c.cy - 17)}" width="${n2(c.w)}" height="22" rx="3" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 2.5"/>`;
    for (const fl of g.gr.flechas) {
      // De la esquina de arriba a la derecha de la casilla de abajo a la de abajo a la izquierda de la del medio, sin
      // tocar los números (el ancho de cada texto sale de su celda).
      const cd = g.celdas.find(c => c.f === fl.de[0] && c.c === fl.de[1]), ca = g.celdas.find(c => c.f === fl.a[0] && c.c === fl.a[1]);
      if (!cd || !ca) continue;
      const x1 = cd.cx + cd.w / 2 - 3, y1 = g.Y(fl.de[0]) + 13, x2 = ca.cx - ca.w / 2 + 2, y2 = g.Y(fl.a[0]) + 19;
      s += T.flecha(x1, y1, x2, y2, { color: 'i', grosor: 1.2 });
    }
    for (const t of g.textos) s += texto(t);
    return T.svg(W, g.H, `<g class="kit-objeto" data-objeto="cuaderno" data-prueba="si">${s}</g>`, { alt: alt(datos, estado) });
  }
  function altCuaderno(d) {
    const g = geoCuaderno(d), plano = l => l.map(s => s[0]).join('');
    const filas = g.gr.cel.map(f => f.filter(x => x !== null && x !== undefined).map(x => { const c = celda(x); return c.hueco ? 'casilla por hallar' : c.t; }).filter(Boolean).join(', '));
    const nombre = { larga: 'la división por columnas', ruffini: 'la tabla de Ruffini', horner: 'el esquema de Horner' }[d.tipo || 'larga'];
    const cab = (d.cabeza || []).map(plano).join('. ');
    return `Hoja de cuaderno con ${nombre}${cab ? `: ${cab}` : ''}. Filas: ${filas.map((f, i) => `${i + 1}) ${f || 'vacía'}`).join('; ')}.`;
  }

  // ---------- Elige el objeto ----------
  const OBJ = { pasadizo: [geoPasadizo, dibPasadizo, altPasadizo], angosto: [geoAngosto, dibAngosto, altAngosto], cuaderno: [geoCuaderno, dibCuaderno, altCuaderno] };
  const de = d => OBJ[d && OBJ[d.objeto] ? d.objeto : 'pasadizo'];
  function geometria(datos, estado = {}) { const d = mezcla(datos, estado); return de(d)[0](d); }
  function dibujar(datos, estado = {}) { return de(mezcla(datos, estado))[1](datos, estado); }
  function alt(datos, estado = {}) { const d = mezcla(datos, estado); return de(d)[2](d); }
  function cabe(datos, estado = {}) {
    const g = geometria(datos, estado);
    return [...g.objetos, ...g.textos].every(c => c.x0 >= M - 1e-9 && c.y0 >= M - 1e-9 && c.x1 <= W - M + 1e-9 && c.y1 <= g.H - M + 1e-9);
  }
  return { id: 'alg-reparto', dibujar, alt, geometria, cabe, necesita, binomio, constantes: { W, M, R, PA, AN, CU } };
});
