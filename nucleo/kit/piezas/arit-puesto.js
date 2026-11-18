/*
 * Pieza «arit-puesto» (17 nov 2026): el puesto de caramelos de doña Juana en el mercado de Juliaca, el hilo de la
 * unidad «Sistemas de numeración» (contenido/teoria/aritmetica/numeracion.js; docs/etapa3/propuesta-aritmetica.md §2).
 * Dibujo de prueba (data-prueba): Gerson decide después si lo reemplaza (docs/plan-calidad.md, M4).
 *
 * Afirmación de la figura: un pedido es lo que queda cuando ya no se puede juntar nada. n caramelos sueltos llenan una
 * bolsita, n bolsitas una caja y n cajas un cajón; la etiqueta anota cuántos hay de cada uno, del más grande al suelto.
 *
 * Fidelidad: cada bolsita muestra sus n caramelos, cada caja sus n bolsitas y cada cajón sus n cajas; cada caramelo
 * suelto se dibuja (un montón de 38 son 38 caramelos). Todo el pedido va a una sola escala: si no cabe, se achica
 * entero, nunca una parte. Lo que no está juntado se dibuja tal cual (6 sueltos con bolsitas de 5 se ven 6).
 *
 * datos = {
 *   n: 5,                                   caramelos por bolsita (y bolsitas por caja, cajas por cajón): la base
 *   cajones: 0, cajas: 0, bolsitas: 2, sueltos: 3,   cuántos hay de cada uno sobre el mostrador
 *   ceros: true,                            dibuja también los órdenes vacíos, del mayor que hay hasta los sueltos
 *   cerrado: true,                          en vez del pedido, un paquete de papel cerrado (no se ve qué hay adentro;
 *                                           la unidad lo llama «paquete», para no confundirlo con la bolsita)
 *   llega: 1,                               caramelos que llegan: a la derecha del pedido, con un «+» y borde punteado
 *   juntar: 'sueltos' | 'bolsitas' | 'cajas',   aro punteado alrededor de los primeros n de ese orden (se van a juntar)
 *   etiqueta: { cifras: '23', base: '5', color: true },   la etiqueta colgada: cifras naranja y base turquesa; con
 *                                           cifras '?' (lo que se pide) o sin color, en tinta. base: '' la omite
 *   regla: true | n.º de líneas | [[[texto, color?], …], …],   el letrero de la regla del puesto, arriba a la
 *                                           izquierda («1 bolsita = 5 caramelos»; el 5 en turquesa). true: hasta el
 *                                           orden mayor que hay; un número: esa cantidad de líneas; o líneas propias
 *   rotulos: true | { sueltos: 'texto' | [[texto, color?], …], … },   debajo de cada grupo, en el frente del mostrador.
 *                                           true: «2 bolsitas» con la cantidad en naranja (es una cifra)
 *   colorCifras: false,                     con rotulos: true, las cantidades en tinta (cuando el color delataría)
 *   escala: 1.2,                            fija el tamaño (si cabe): el juego no cambia de escala al mover un control
 *   pasos: [{ …datos }, …],                 para «Mira»: estado.paso elige qué cambia (se mezcla con los datos)
 *
 *   Opciones de «Las cuatro operaciones» (18 nov; contenido/teoria/aritmetica/cuatro-operaciones.js, idea 1). Ninguna
 *   cambia lo de arriba si no se pide:
 *   cuenta: {                               el cuaderno de doña Juana, de pie sobre el mostrador a la derecha del pedido
 *     sumandos: ['47', '38'],               las filas de la cuenta (en tinta: son los números que se operan)
 *     op: '+',                              el signo, a la izquierda de la última fila
 *     resultado: '?' | '85' | '5',          las cifras del resultado, en violeta (se escriben desde las unidades); '?', en
 *                                           tinta y centrado (lo que se pide: no dice cuántas cifras tiene)
 *     llevadas: { 1: 1 },                   columna (0 = unidades) → lo que le llega llevado: chiquito y naranja, arriba
 *     base: '5' | 'n',                      el subíndice ₍₅₎ de cada fila, en turquesa (sin base, o '10', base 10)
 *     foco: 0,                              una columna resaltada con un fondo tenue
 *     iconos: false,                        sin los iconos de la cabecera (caramelo, bolsita, caja y cajón sobre cada
 *                                           columna: dicen qué orden cuenta cada columna)
 *     solo: true,                           solo el cuaderno, abierto y más grande sobre el mostrador, sin pedido
 *   }
 *   llevada: { bolsitas: 1, cajas: 1 },     cuántos de ese orden acaban de subir (los últimos del grupo): aro naranja
 *   toque: [{ orden: 'sueltos', control: 'ju', titulo }],   zona data-toque sobre ese grupo (el lector de la teoría pasa
 *                                           el control a su opción siguiente; los botones del control siguen ahí)
 *   Con cuenta, no se dibuja la etiqueta (el cuaderno anota el total) y, con solo, tampoco el letrero ni el pedido.
 * }
 * estado = { paso }. Función pura de (datos, estado): sin ids, sin azar, sin reloj. Lienzo de 320 × 250.
 * Colores: tinta (currentColor) y var(--c-*): la base (bolsita, caja y cajón, y el subíndice) en turquesa (i), las
 * cifras de la etiqueta y las cantidades en naranja (o), un texto en violeta (f) solo si los datos lo piden (la
 * cantidad en base 10 que se da). Nunca carmín. En el cuaderno (cuenta): los números que se operan en tinta, la
 * llevada y el aro de lo que subió en naranja, el resultado en violeta y la base en turquesa (el mapa de colores de «Las
 * cuatro operaciones»: el envase turquesa, lo que se muda naranja, lo que se busca violeta). El relleno opaco de las cajas usa var(--card), como los halos del kit.
 * geometria(datos, estado) da las cajas de todo lo dibujado (objetos y textos), para la prueba numérica de encuadre.
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
  const W = 320, H = 250, M = 4;
  const PISO = 196;                       // borde de arriba del mostrador: ahí se apoya el pedido
  const ZONA = { x0: 20, x1: 300 };       // ancho para el pedido (entre los postes del puesto)
  const TOPE = 102;                       // lo más alto que puede llegar el pedido (debajo del letrero y la etiqueta)
  const ROT = [220, 238];                 // líneas de base de los rótulos, en el frente del mostrador
  const TAM = 14;
  const ETQ = { cx: 262, x0: 220, x1: 304, y0: 48, y1: 92, base: 80 };
  const n2 = T.n;
  const ORDENES = ['sueltos', 'bolsitas', 'cajas', 'cajones'];
  const SING = { sueltos: 'suelto', bolsitas: 'bolsita', cajas: 'caja', cajones: 'cajón' };
  const PLUR = { sueltos: 'sueltos', bolsitas: 'bolsitas', cajas: 'cajas', cajones: 'cajones' };
  // Para el letrero: «1 bolsita = 5 caramelos», «1 caja = 5 bolsitas», «1 cajón = 5 cajas».
  const DEBAJO = { bolsitas: 'caramelos', cajas: 'bolsitas', cajones: 'cajas' };
  const entero = x => Math.max(0, Math.floor(+x || 0));

  // ---------- Objetos, en coordenadas naturales (escala 1), con el borde de abajo en y = 0 ----------
  // Un caramelo envuelto: el cuerpo y las dos puntas torcidas. k: tamaño (1 = 16 de ancho).
  function caramelo(cx, cy, k) {
    const rx = 4.4 * k, ry = 3.3 * k, t = 3.6 * k, h = 2.8 * k;
    return `M${n2(cx - rx)} ${n2(cy)}A${n2(rx)} ${n2(ry)} 0 1 0 ${n2(cx + rx)} ${n2(cy)}A${n2(rx)} ${n2(ry)} 0 1 0 ${n2(cx - rx)} ${n2(cy)}Z`
      + `M${n2(cx - rx + 0.6 * k)} ${n2(cy)}L${n2(cx - rx - t)} ${n2(cy - h)}L${n2(cx - rx - t)} ${n2(cy + h)}Z`
      + `M${n2(cx + rx - 0.6 * k)} ${n2(cy)}L${n2(cx + rx + t)} ${n2(cy - h)}L${n2(cx + rx + t)} ${n2(cy + h)}Z`;
  }
  const trazoCaramelos = d => (d ? `<path d="${d}" fill="currentColor" fill-opacity="0.28" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>` : '');

  // Bolsita transparente con sus n caramelos adentro, atada arriba.
  function medidaBolsita(n) {
    const c = n <= 4 ? 2 : 3, r = Math.ceil(n / c);
    return { c, r, w: c * 11.5 + 10, cuerpo: r * 8 + 12, h: r * 8 + 12 + 10 };
  }
  // extra: los últimos caramelos de la bolsa (los de arriba) van en violeta: lo que se agregó (cuatro operaciones, idea 5).
  // tiene: bolsita incompleta (idea 6): solo los primeros `tiene` caramelos; los demás lugares, huecos punteados en
  // violeta (lo que falta), o en tinta si colorHuecos es false (lo que se pide, antes de comprobar).
  function bolsita(x, n, extra = 0, tiene = null, colorHuecos = true) {
    const m = medidaBolsita(n), x1 = x + m.w, yt = -m.cuerpo, cx = x + m.w / 2, nw = m.w * 0.16;
    let car = '', mas = '', hue = '';
    for (let k = 0; k < n; k++) {
      const fila = Math.floor(k / m.c), col = k % m.c, enFila = Math.min(m.c, n - fila * m.c);
      const x0 = cx - (enFila * 11.5) / 2 + 5.75;
      const d = caramelo(x0 + col * 11.5, -7 - fila * 8, 0.66);
      if (tiene !== null && k >= tiene) hue += `M${n2(x0 + col * 11.5 + 2.9)} ${n2(-7 - fila * 8)}A2.9 2.9 0 1 0 ${n2(x0 + col * 11.5 - 2.9)} ${n2(-7 - fila * 8)}A2.9 2.9 0 1 0 ${n2(x0 + col * 11.5 + 2.9)} ${n2(-7 - fila * 8)}Z`;
      else if (k >= n - extra) mas += d; else car += d;
    }
    const cuerpo = `M${n2(x + 4)} 0L${n2(x1 - 4)} 0Q${n2(x1)} 0 ${n2(x1)} -4L${n2(x1 - 1)} ${n2(yt + 7)}Q${n2(x1 - 3)} ${n2(yt)} ${n2(cx + nw)} ${n2(yt - 1)}`
      + `L${n2(cx + nw + 4)} ${n2(yt - 9)}L${n2(cx)} ${n2(yt - 6)}L${n2(cx - nw - 4)} ${n2(yt - 9)}L${n2(cx - nw)} ${n2(yt - 1)}`
      + `Q${n2(x + 3)} ${n2(yt)} ${n2(x + 1)} ${n2(yt + 7)}L${n2(x)} -4Q${n2(x)} 0 ${n2(x + 4)} 0Z`;
    const cHue = colorHuecos ? 'var(--c-f)' : 'currentColor';
    return `<g class="ar-bolsita${tiene !== null ? ' ar-incompleta' : ''}"><path d="${cuerpo}" fill="var(--c-i)" fill-opacity="0.08" stroke="var(--c-i)" stroke-width="2" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`
      + `${trazoCaramelos(car)}`
      + (mas ? `<path class="ar-extra" d="${mas}" fill="var(--c-f)" fill-opacity="0.45" stroke="var(--c-f)" stroke-width="1.2" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>` : '')
      + (hue ? `<path class="ar-hueco" d="${hue}" fill="none" stroke="${cHue}" stroke-width="1.3" stroke-dasharray="2 1.6" vector-effect="non-scaling-stroke"/>` : '')
      + `<line x1="${n2(cx - nw - 1.5)}" y1="${n2(yt - 1)}" x2="${n2(cx + nw + 1.5)}" y2="${n2(yt - 1)}" stroke="var(--c-i)" stroke-width="2.5" stroke-linecap="round" vector-effect="non-scaling-stroke"/></g>`;
  }
  // Caja abierta con sus n bolsitas asomando (en una fila, o en dos si son más de 5).
  function medidaCaja(n) { const c = n <= 5 ? n : Math.ceil(n / 2), f = n <= 5 ? 1 : 2; return { c, f, w: c * 10 + 12, cuerpo: 28, h: 28 + 10 + (f - 1) * 6 }; }
  function miniBolsa(cx, yb) {
    return `M${n2(cx - 4)} ${n2(yb)}L${n2(cx - 4)} ${n2(yb - 10)}Q${n2(cx - 4)} ${n2(yb - 13)} ${n2(cx - 1.5)} ${n2(yb - 13)}L${n2(cx - 3)} ${n2(yb - 16)}L${n2(cx + 3)} ${n2(yb - 16)}L${n2(cx + 1.5)} ${n2(yb - 13)}Q${n2(cx + 4)} ${n2(yb - 13)} ${n2(cx + 4)} ${n2(yb - 10)}L${n2(cx + 4)} ${n2(yb)}Z`;
  }
  function caja(x, n) {
    const m = medidaCaja(n), borde = -m.cuerpo;
    let atras = '', adelante = '';
    for (let k = 0; k < n; k++) {
      const fila = m.f === 2 && k >= m.c ? 1 : 0, col = fila ? k - m.c : k, enFila = fila ? n - m.c : Math.min(m.c, n);
      const cx = x + m.w / 2 - (enFila * 10) / 2 + 5 + col * 10 + (fila ? 0 : 0);
      const d = miniBolsa(cx, borde + 8 - fila * 6);
      if (fila) atras += d; else adelante += d;
    }
    const bolsas = d => (d ? `<path d="${d}" fill="var(--c-i)" fill-opacity="0.14" stroke="var(--c-i)" stroke-width="1.5" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>` : '');
    return `<g class="ar-caja">${bolsas(atras)}${bolsas(adelante)}`
      + `<rect x="${n2(x)}" y="${n2(borde)}" width="${n2(m.w)}" height="${n2(m.cuerpo)}" rx="3" fill="var(--card)" stroke="var(--c-i)" stroke-width="2" vector-effect="non-scaling-stroke"/>`
      + `<rect x="${n2(x)}" y="${n2(borde)}" width="${n2(m.w)}" height="${n2(m.cuerpo)}" rx="3" fill="var(--c-i)" fill-opacity="0.1"/>`
      + `<line x1="${n2(x + 4)}" y1="${n2(borde + 7)}" x2="${n2(x + m.w - 4)}" y2="${n2(borde + 7)}" stroke="var(--c-i)" stroke-width="1.5" stroke-opacity="0.6" vector-effect="non-scaling-stroke"/></g>`;
  }
  // Cajón de tablas con sus n cajas asomando.
  function medidaCajon(n) { const c = n <= 5 ? n : Math.ceil(n / 2), f = n <= 5 ? 1 : 2; return { c, f, w: c * 14 + 14, cuerpo: 34, h: 34 + 9 + (f - 1) * 7 }; }
  function cajon(x, n) {
    const m = medidaCajon(n), borde = -m.cuerpo;
    let atras = '', adelante = '';
    for (let k = 0; k < n; k++) {
      const fila = m.f === 2 && k >= m.c ? 1 : 0, col = fila ? k - m.c : k, enFila = fila ? n - m.c : Math.min(m.c, n);
      const cx = x + m.w / 2 - (enFila * 14) / 2 + 7 + col * 14, yb = borde + 6 - fila * 7;
      const s = `<rect x="${n2(cx - 6)}" y="${n2(yb - 15)}" width="12" height="15" rx="2" fill="var(--card)" stroke="var(--c-i)" stroke-width="1.5" vector-effect="non-scaling-stroke"/><rect x="${n2(cx - 6)}" y="${n2(yb - 15)}" width="12" height="15" rx="2" fill="var(--c-i)" fill-opacity="0.14"/>`;
      if (fila) atras += s; else adelante += s;
    }
    let tablas = '';
    for (const y of [borde + 12, borde + 23]) tablas += `<line x1="${n2(x + 3)}" y1="${n2(y)}" x2="${n2(x + m.w - 3)}" y2="${n2(y)}" stroke="var(--c-i)" stroke-width="1.5" stroke-opacity="0.55" vector-effect="non-scaling-stroke"/>`;
    return `<g class="ar-cajon">${atras}${adelante}`
      + `<rect x="${n2(x)}" y="${n2(borde)}" width="${n2(m.w)}" height="${n2(m.cuerpo)}" rx="3" fill="var(--card)" stroke="var(--c-i)" stroke-width="2.5" vector-effect="non-scaling-stroke"/>`
      + `<rect x="${n2(x)}" y="${n2(borde)}" width="${n2(m.w)}" height="${n2(m.cuerpo)}" rx="3" fill="var(--c-i)" fill-opacity="0.12"/>${tablas}</g>`;
  }
  // Montón de k caramelos sueltos: filas de abajo arriba, cada una con un caramelo menos y centrada (un montoncito).
  function filasMonton(k) {
    if (k <= 3) return k ? [k] : [];
    let c = 1;
    while (c * (c + 1) / 2 < k) c++;
    const out = [];
    for (let r = c, quedan = k; quedan > 0; r--) { out.push(Math.min(r, quedan)); quedan -= r; }
    return out;
  }
  function medidaMonton(k) {
    if (!k) return { filas: [], w: 60, h: 6 };
    const filas = filasMonton(k);
    return { filas, w: filas[0] * 13 + 4, h: filas.length * 8 + 6 };
  }
  // Centro de cada caramelo del montón, en orden (los primeros, abajo a la izquierda).
  function puntosMonton(x, k) {
    const m = medidaMonton(k), out = [];
    m.filas.forEach((largo, f) => { for (let j = 0; j < largo; j++) out.push([x + 2 + (m.w - 4) / 2 - largo * 13 / 2 + 6.5 + j * 13, -5 - f * 8]); });
    return out;
  }
  function monton(x, k) {
    const m = medidaMonton(k);
    if (!k) return `<ellipse cx="${n2(x + m.w / 2)}" cy="-3" rx="13" ry="3" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 3" stroke-opacity="0.6" vector-effect="non-scaling-stroke"/>`;
    return trazoCaramelos(puntosMonton(x, k).map(([cx, cy]) => caramelo(cx, cy, 0.85)).join(''));
  }
  // Paquete de papel cerrado, con la boca doblada dos veces y los fuelles de los costados: no se ve qué hay adentro.
  const CERRADO = { w: 58, h: 76 };
  function cerrado(x) {
    const { w, h } = CERRADO, x1 = x + w, top = -h + 14;
    return `<g class="ar-cerrado"><rect x="${n2(x)}" y="${n2(top)}" width="${n2(w)}" height="${n2(h - 14)}" rx="2" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="2" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`
      + `<path d="M${n2(x + 6)} ${n2(top)}L${n2(x + 10)} ${n2(top + 10)}L${n2(x + 6)} -2M${n2(x1 - 6)} ${n2(top)}L${n2(x1 - 10)} ${n2(top + 10)}L${n2(x1 - 6)} -2" fill="none" stroke="currentColor" stroke-width="1.2" stroke-opacity="0.55" vector-effect="non-scaling-stroke"/>`
      + `<rect x="${n2(x - 2)}" y="${n2(-h)}" width="${n2(w + 4)}" height="14" rx="2" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="2" vector-effect="non-scaling-stroke"/>`
      + `<line x1="${n2(x)}" y1="${n2(-h + 7)}" x2="${n2(x1)}" y2="${n2(-h + 7)}" stroke="currentColor" stroke-width="1.2" vector-effect="non-scaling-stroke"/>`
      + trazoCaramelos(caramelo(x + w / 2, top + (h - 14) / 2, 1.6)) + '</g>';
  }
  // Un grupo de k objetos iguales (bolsitas, cajas o cajones) en `filas` filas apiladas, cada una centrada.
  function medidaGrupo(tipo, k, n, filas = 1) {
    if (tipo === 'sueltos') { const m = medidaMonton(k); return { w: m.w, h: m.h }; }
    // Los que llegan: un montón con un «+» a la izquierda y un borde punteado (no son del pedido todavía).
    if (tipo === 'llega') { const m = medidaMonton(k); return { w: m.w + 26, h: m.h + 6, m }; }
    if (tipo === 'incompleta') { const u = medidaBolsita(k); return { w: u.w, h: u.h, u }; }
    const u = tipo === 'bolsitas' ? medidaBolsita(n) : tipo === 'cajas' ? medidaCaja(n) : medidaCajon(n);
    if (!k) return { w: 60, h: 6, u, filas: 1, porFila: 0 };
    const f = Math.max(1, Math.min(filas, k)), porFila = Math.ceil(k / f);
    return { w: porFila * (u.w + 3) - 3, h: f * (u.h + 2) - 2, u, filas: f, porFila };
  }
  function grupo(tipo, x, k, n, g) {
    if (tipo === 'sueltos') return monton(x, k);
    if (tipo === 'llega') {
      const m = g.m, xm = x + 26;
      return `<g class="ar-llega"><path d="M${n2(x + 4)} ${n2(-g.h / 2)}H${n2(x + 18)}M${n2(x + 11)} ${n2(-g.h / 2 - 7)}V${n2(-g.h / 2 + 7)}" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`
        + `<rect x="${n2(xm - 2)}" y="${n2(-g.h)}" width="${n2(m.w + 4)}" height="${n2(g.h - 1)}" rx="6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 4" vector-effect="non-scaling-stroke"/>`
        + `${monton(xm, k)}</g>`;
    }
    if (tipo === 'incompleta') return bolsita(x, g.de, 0, g.tiene, g.colorHuecos);
    if (!k) return monton(x, 0);
    const ex = tipo === 'bolsitas' ? Math.min(n, entero(g.extra)) : 0;
    const dib = tipo === 'bolsitas' ? (x0, nn) => bolsita(x0, nn, ex) : tipo === 'cajas' ? caja : cajon;
    let s = '';
    // De arriba abajo (las de atrás primero), cada fila centrada.
    for (let f = g.filas - 1; f >= 0; f--) {
      const enFila = Math.min(g.porFila, k - f * g.porFila);
      const x0 = x + (g.w - (enFila * (g.u.w + 3) - 3)) / 2;
      for (let j = 0; j < enFila; j++) s += `<g transform="translate(${n2(x0 + j * (g.u.w + 3))} ${n2(-f * (g.u.h + 2))})">${dib(0, n)}</g>`;
    }
    return s;
  }

  // Dónde queda cada objeto de un grupo (en el mismo orden en que se cuentan: la fila de abajo primero, de izquierda a
  // derecha), en coordenadas del grupo: { x, y } es la esquina de abajo a la izquierda. Lo usa el aro de la llevada.
  function posicionesGrupo(x, k, g) {
    const out = [];
    for (let f = 0; f < g.filas; f++) {
      const enFila = Math.min(g.porFila, k - f * g.porFila);
      const x0 = x + (g.w - (enFila * (g.u.w + 3) - 3)) / 2;
      for (let j = 0; j < enFila; j++) out.push({ x: x0 + j * (g.u.w + 3), y: -f * (g.u.h + 2) });
    }
    return out;
  }

  // ---------- El cuaderno de doña Juana (opción cuenta): la cuenta escrita en columnas ----------
  // De pie sobre el mostrador, a la derecha del pedido; con solo: abierto en el medio, más grande y sin pedido.
  const CU = { x0: 202, x1: 304, y0: 44, y1: PISO };
  const CU_SOLO = { x0: 60, x1: 260, y0: 42, y1: H - M - 2 };
  const ZONA_CU = { x0: 18, x1: 196 };
  const ICONO = ['sueltos', 'bolsitas', 'cajas', 'cajones'];
  const sinBase = b => b === undefined || b === null || b === '' || String(b) === '10';
  function geoCuenta(cu) {
    const solo = !!cu.solo, C = solo ? CU_SOLO : CU;
    const filas = (cu.sumandos || []).map(String), nf = filas.length;
    const res = cu.resultado === undefined || cu.resultado === null ? '?' : String(cu.resultado);
    const lleva = cu.llevadas || {}, kLl = Object.keys(lleva).map(Number).filter(k => lleva[k]);
    // El préstamo (resta): lo que tiene la columna después de prestar o recibir, arriba y en naranja; la cifra de la
    // primera fila, tachada en naranja.
    const presta = cu.presta || {}, kPr = Object.keys(presta).map(Number).filter(k => presta[k] !== undefined && presta[k] !== null && presta[k] !== '');
    const K = Math.max(1, ...filas.map(f => f.length), res === '?' ? 0 : res.length, ...kLl.map(k => k + 1), ...kPr.map(k => k + 1));
    const F = solo ? (nf >= 4 ? 24 : 30) : (nf >= 3 || K >= 4 ? 19 : 22);
    const TB = 13, TL = 15, TP = 13;
    // Con préstamos de dos cifras («12») las columnas se separan lo justo para que no se toquen.
    // Con los iconos de la cabecera (14 de ancho), las columnas no bajan de 15,5: con 4 columnas junto al pedido se pisaban.
    const P = Math.max(F * 0.64, cu.iconos === false ? 0 : 15.5, ...kPr.map(k => T.ancho(String(presta[k]), TP, 700) + 3));
    const base = sinBase(cu.base) ? '' : String(cu.base);
    const subW = base ? T.ancho(`(${base})`, TB, 600) + 3 : 0;
    // Junto al pedido, la cuenta va contra el borde derecho; sola, centrada en el cuaderno.
    const anchoBloque = P * K + (nf ? T.ancho('+', F) + 6 : 0) + subW;
    const xr = solo ? C.x0 + (C.x1 - C.x0 + anchoBloque) / 2 - subW : C.x1 - 10 - subW;
    const cx = k => xr - P * (k + 0.5);
    const yIcono = C.y0 + 20, yL = C.y0 + 44, paso = F + (solo ? 4 : 3);
    const yF = i => yL + 8 + F * 0.8 + i * paso;
    const yRaya = yF(Math.max(0, nf - 1)) + F * 0.25 + 5, yR = yRaya + 6 + F * 0.8;
    const xOp = cx(K - 1) - P / 2 - 3;
    const items = [];
    const caja = (txt, x, y, tam, peso, ancla, que) => {
      const w = T.ancho(txt, tam, peso), x0 = ancla === 'middle' ? x - w / 2 : ancla === 'end' ? x - w : x;
      return { que, txt, x0, x1: x0 + w, y0: y - tam * 0.8, y1: y + tam * 0.25, dentro: 'cuaderno' };
    };
    const pon = (txt, x, y, o) => items.push(Object.assign({ txt, x, y, tam: F, peso: 400, ancla: 'middle', color: null }, o));
    for (const [k, v] of Object.entries(lleva)) if (v) pon(String(v), cx(+k), yL, { tam: TL, peso: 700, color: 'o', que: 'llevada' });
    for (const k of kPr) pon(String(presta[k]), cx(k), yL, { tam: TP, peso: 700, color: 'o', que: 'préstamo' });
    // '#': una mancha (la cifra no se ve). manchas: [[fila, columna]]: la mancha va detrás de una cifra ya hallada.
    const manchas = [];
    for (const [i, k] of Array.isArray(cu.manchas) ? cu.manchas : []) manchas.push({ i, k });
    filas.forEach((f, i) => {
      const cs = f.split('');
      cs.forEach((ch, j) => {
        const k = cs.length - 1 - j;
        if (ch === '#') { manchas.push({ i, k, sola: true }); pon('#', cx(k), yF(i), { que: 'mancha' }); }
        else if (ch !== ' ') pon(ch, cx(k), yF(i), { que: 'fila' });
      });
      if (base) pon(`(${base})`, xr + 3, yF(i) + 5, { tam: TB, peso: 600, ancla: 'start', color: base === '?' ? null : 'i', que: 'base' });
    });
    if (nf) pon(cu.op || '+', xOp, yF(nf - 1), { ancla: 'end', que: 'signo' });
    if (res === '?') pon('?', (cx(0) + cx(K - 1)) / 2, yR, { peso: 700, que: 'resultado' });
    else res.split('').forEach((ch, j, cs) => {
      const k = cs.length - 1 - j;
      if (ch === '#') { manchas.push({ i: nf, k, sola: true }); pon('#', cx(k), yR, { peso: 700, que: 'mancha' }); }
      else if (ch !== ' ') pon(ch, cx(k), yR, { peso: 700, color: ch === '?' ? null : 'f', que: 'resultado' });
    });
    if (base) pon(`(${base})`, xr + 3, yR + 5, { tam: TB, peso: 600, ancla: 'start', color: base === '?' ? null : 'i', que: 'base' });
    const cajas = items.map(t => caja(t.txt, t.x, t.y, t.tam, t.peso, t.ancla, t.que));
    const iconos = cu.iconos === false ? [] : Array.from({ length: Math.min(K, 4) }, (_, k) => ({ k, tipo: ICONO[k], x: cx(k), y: yIcono }));
    for (const ic of iconos) cajas.push({ que: `icono ${ic.tipo}`, txt: ic.tipo, x0: ic.x - 7, x1: ic.x + 7, y0: ic.y - 7, y1: ic.y + 7, dentro: 'cuaderno' });
    const foco = Number.isInteger(cu.foco) && cu.foco >= 0 && cu.foco < K ? cu.foco : null;
    // Tachas del préstamo: sobre la cifra de la primera fila de esa columna (si la hay).
    const tachas = nf ? kPr.filter(k => k < filas[0].length && filas[0][filas[0].length - 1 - k] !== ' ').map(k => ({ x: cx(k), y: yF(0) })) : [];
    const yM = i => (i >= nf ? yR : yF(i));
    return { C, solo, K, F, P, xr, cx, yL, yF, yRaya, yR, xOp, subW, items, cajas, iconos, foco, base, nf, tachas,
      manchas: manchas.filter(m => m.i >= 0 && m.i <= nf && m.k >= 0 && m.k < K).map(m => Object.assign({ x: cx(m.k), y: yM(m.i) }, m)) };
  }
  // Los iconos de la cabecera del cuaderno: qué orden cuenta cada columna.
  function icono(tipo, cx, cy) {
    if (tipo === 'sueltos') return trazoCaramelos(caramelo(cx, cy, 0.85));
    if (tipo === 'bolsitas') return `<path d="${miniBolsa(cx, cy + 7)}" fill="var(--c-i)" fill-opacity="0.14" stroke="var(--c-i)" stroke-width="1.5" stroke-linejoin="round"/>`;
    const w = tipo === 'cajas' ? 13 : 15, h = tipo === 'cajas' ? 10 : 12;
    return `<rect x="${n2(cx - w / 2)}" y="${n2(cy - h / 2)}" width="${w}" height="${h}" rx="2" fill="var(--c-i)" fill-opacity="0.12" stroke="var(--c-i)" stroke-width="1.5"/>`
      + `<line x1="${n2(cx - w / 2 + 2)}" y1="${n2(cy - h / 2 + 3)}" x2="${n2(cx + w / 2 - 2)}" y2="${n2(cy - h / 2 + 3)}" stroke="var(--c-i)" stroke-width="1.2"/>`
      + (tipo === 'cajones' ? `<line x1="${n2(cx - w / 2 + 2)}" y1="${n2(cy + 1)}" x2="${n2(cx + w / 2 - 2)}" y2="${n2(cy + 1)}" stroke="var(--c-i)" stroke-width="1.2"/>` : '');
  }
  // Una mancha: curva cerrada suave por 7 nodos con radios fijos (sin azar: la misma mancha cada vez; `v` la rota).
  const RADIOS = [1, 0.82, 0.95, 0.74, 0.9, 0.8, 0.97];
  function mancha(cx, cy, rx, ry, v) {
    const N = RADIOS.length, f = 4 * Math.tan(Math.PI / (2 * N)) / Math.sin(2 * Math.PI / N);
    const pts = RADIOS.map((_, i) => { const r = RADIOS[(i + v) % N], a = (2 * Math.PI * i) / N + v * 0.4; return [cx + rx * r * Math.cos(a), cy + ry * r * Math.sin(a)]; });
    let d = `M${n2(pts[0][0])} ${n2(pts[0][1])}`;
    for (let i = 0; i < N; i++) {
      const p0 = pts[(i - 1 + N) % N], p1 = pts[i], p2 = pts[(i + 1) % N], p3 = pts[(i + 2) % N];
      d += `C${n2(p1[0] + (p2[0] - p0[0]) * f / 6)} ${n2(p1[1] + (p2[1] - p0[1]) * f / 6)} ${n2(p2[0] - (p3[0] - p1[0]) * f / 6)} ${n2(p2[1] - (p3[1] - p1[1]) * f / 6)} ${n2(p2[0])} ${n2(p2[1])}`;
    }
    return d + 'Z';
  }
  function dibujarCuenta(gc) {
    const { C } = gc;
    let s = `<g class="ar-cuaderno"><rect x="${C.x0}" y="${C.y0}" width="${C.x1 - C.x0}" height="${C.y1 - C.y0}" rx="5" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`;
    // Anillos del espiral, arriba.
    for (let x = C.x0 + 10; x <= C.x1 - 8; x += 12) s += `<circle cx="${n2(x)}" cy="${C.y0}" r="2.6" fill="var(--card)" stroke="currentColor" stroke-width="1.4"/>`;
    // Renglones tenues, bajo cada fila escrita.
    const renglones = [gc.yL + 5].concat(Array.from({ length: gc.nf }, (_, i) => gc.yF(i) + 6), [gc.yR + 6]);
    for (const y of renglones) if (y < C.y1 - 3) s += `<line x1="${C.x0 + 6}" y1="${n2(y)}" x2="${C.x1 - 6}" y2="${n2(y)}" stroke="currentColor" stroke-width="1" stroke-opacity="0.14"/>`;
    if (gc.foco !== null) s += `<rect class="ar-foco" x="${n2(gc.cx(gc.foco) - gc.P / 2 - 1)}" y="${n2(gc.yL - 15)}" width="${n2(gc.P + 2)}" height="${n2(gc.yR + 7 - (gc.yL - 15))}" rx="3" fill="currentColor" fill-opacity="0.09"/>`;
    for (const ic of gc.iconos) s += icono(ic.tipo, ic.x, ic.y);
    if (gc.nf) s += `<line x1="${n2(gc.xOp - T.ancho('+', gc.F) - 2)}" y1="${n2(gc.yRaya)}" x2="${n2(gc.xr + gc.subW)}" y2="${n2(gc.yRaya)}" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    // Manchas de chicha morada (en tinta: no delatan nada): sola, tapa la cifra; detrás de una cifra hallada, más tenue.
    for (const m of gc.manchas) s += `<path class="ar-mancha" d="${mancha(m.x, m.y - gc.F * 0.3, gc.P * 0.5, gc.F * 0.5, m.k * 3 + m.i)}" fill="currentColor" fill-opacity="${m.sola ? 0.42 : 0.2}" stroke="currentColor" stroke-opacity="${m.sola ? 0.55 : 0.35}" stroke-width="1"/>`;
    for (const t of gc.items) if (t.que !== 'mancha') s += `<text class="kit-txt" x="${n2(t.x)}" y="${n2(t.y)}" font-size="${t.tam}"${t.peso !== 400 ? ` font-weight="${t.peso}"` : ''}${t.ancla !== 'start' ? ` text-anchor="${t.ancla}"` : ''} fill="${T.color(t.color)}" style="font-variant-numeric:tabular-nums">${T.esc(t.txt)}</text>`;
    for (const t of gc.tachas) s += `<line class="ar-tacha" x1="${n2(t.x - gc.P * 0.36)}" y1="${n2(t.y - gc.F * 0.02)}" x2="${n2(t.x + gc.P * 0.36)}" y2="${n2(t.y - gc.F * 0.62)}" stroke="var(--c-o)" stroke-width="2" stroke-linecap="round"/>`;
    return s + '</g>';
  }

  // Los órdenes que se dibujan, del mayor al suelto.
  function ordenes(d) {
    if (d.cerrado) return [];
    const hay = ORDENES.filter(o => entero(d[o]) > 0);
    if (!d.ceros) return hay.length ? hay.slice().reverse() : ['sueltos'];
    const mayor = Math.max(0, ...hay.map(o => ORDENES.indexOf(o)));
    return ORDENES.slice(0, mayor + 1).reverse();
  }

  // ---------- Textos con varios colores (un <text> con <tspan>) ----------
  // segs: [[texto, color?, peso?], …]
  const segsDe = x => (Array.isArray(x) ? x.map(s => (Array.isArray(s) ? s : [String(s)])) : [[String(x)]]);
  const anchoSegs = (segs, tam, peso) => segs.reduce((a, s) => a + T.ancho(s[0], tam, s[2] || peso), 0);
  function texto(x, y, segs, o = {}) {
    const tam = o.tam || TAM, peso = o.peso || 400, ancla = o.ancla || 'start';
    const spans = segs.map(([t, c, p]) => `<tspan fill="${T.color(c)}"${(p || peso) !== 400 ? ` font-weight="${p || peso}"` : ''}>${T.esc(t)}</tspan>`).join('');
    return `<text class="kit-txt" x="${n2(x)}" y="${n2(y)}" font-size="${tam}"${ancla !== 'start' ? ` text-anchor="${ancla}"` : ''} style="font-variant-numeric:tabular-nums">${spans}</text>`;
  }

  // Líneas del letrero de la regla.
  function lineasRegla(d, ords) {
    if (!d.regla) return [];
    if (Array.isArray(d.regla)) return d.regla.map(segsDe);
    const n = String(d.n === undefined ? '?' : d.n);
    const cuantas = typeof d.regla === 'number' ? d.regla : Math.max(1, ords.filter(o => o !== 'sueltos').length);
    return ['bolsitas', 'cajas', 'cajones'].slice(0, Math.min(3, cuantas)).map(o => [[`1 ${SING[o]} = `], [n, 'i', 700], [` ${DEBAJO[o]}`]]);
  }

  // Rótulo de un grupo, debajo, en el frente del mostrador.
  function rotuloDe(d, tipo) {
    if (!d.rotulos) return null;
    if (d.rotulos !== true) { const r = d.rotulos[tipo]; return r === undefined || r === null ? null : segsDe(r); }
    if (tipo === 'cerrado') return null;
    if (tipo === 'llega') { const k = entero(d.llega); return [[k === 1 ? 'llega ' : 'llegan '], [String(k), 'f', 700]]; }
    const k = entero(d[tipo]);
    return [[String(k), d.colorCifras === false ? null : 'o', 700], [` ${k === 1 ? SING[tipo] : PLUR[tipo]}`]];
  }

  // ---------- Geometría: dónde va cada cosa, en coordenadas del lienzo ----------
  function mezcla(datos, estado) {
    const ps = (datos && datos.pasos) || [];
    const p = ps[Math.max(0, Math.min(ps.length - 1, (estado && estado.paso) | 0))];
    return Object.assign({}, datos || {}, p || {});
  }
  function geometria(datos, estado = {}) {
    const d = mezcla(datos, estado), n = entero(d.n) || 1;
    // El cuaderno (cuatro operaciones): el pedido se corre a la izquierda; con solo, no hay pedido ni letrero.
    const cu = d.cuenta && typeof d.cuenta === 'object' ? d.cuenta : null, solo = !!(cu && cu.solo);
    const zona = cu ? ZONA_CU : ZONA;
    const ords = solo ? [] : ordenes(d), llega = d.cerrado || solo ? 0 : entero(d.llega);
    // La bolsita incompleta (cuatro operaciones, idea 6): va después de las llenas, con sus sueltos y sus huecos.
    const inc = !solo && !d.cerrado && d.incompleta && entero(d.incompleta.de) > 0 ? d.incompleta : null;
    const tipos = solo ? [] : d.cerrado ? ['cerrado'] : ords.concat(llega ? ['llega'] : [], inc ? ['incompleta'] : []);
    const reglas = solo ? [] : lineasRegla(d, ords);
    // Con tres líneas en el letrero, el pedido baja un poco más; el aro punteado de «juntar» sobresale 5 del grupo
    // (numeracion, idea 3: rondas con el letrero completo). Con el cuaderno no hay etiqueta: el pedido sube hasta el letrero.
    const tope = cu ? (reglas.length ? 62 + 18 * (reglas.length - 1) + 14 : 48)
      : (reglas.length >= 3 ? 108 : TOPE) + (reglas.length || d.etiqueta ? 0 : -50);
    const SEP = 12, AW = zona.x1 - zona.x0, AH = PISO - tope - (d.juntar && reglas.length >= 3 ? 6 : 0);
    // Cuántas filas lleva cada grupo: la combinación que deja el pedido más grande (a igual tamaño, menos filas).
    const opciones = tipos.map(t => (['bolsitas', 'cajas', 'cajones'].includes(t) && entero(d[t]) > 1 ? [1, 2, 3].filter(f => f <= entero(d[t])) : [1]));
    let mejor = null;
    const tapa = d.escala > 0 ? d.escala : 1.7;
    const prueba = (i, elegidas) => {
      if (i === tipos.length) {
        const kDe = t => (t === 'llega' ? llega : t === 'incompleta' ? entero(inc.de) : entero(d[t]));
        const gs = tipos.map((t, j) => (t === 'cerrado' ? { tipo: t, w: CERRADO.w, h: CERRADO.h }
          : Object.assign({ tipo: t, k: kDe(t) }, medidaGrupo(t, kDe(t), n, elegidas[j]),
            t === 'incompleta' ? { de: entero(inc.de), tiene: Math.min(entero(inc.de), entero(inc.tiene)), colorHuecos: inc.color !== false } : {},
            t === 'bolsitas' ? { extra: entero(d.extra) } : {})));
        const W0 = gs.reduce((a, g) => a + g.w, 0) + SEP * Math.max(0, gs.length - 1), H0 = Math.max(1, ...gs.map(g => g.h));
        const sc = Math.min(AW / W0, AH / H0), filas = elegidas.reduce((a, f) => a + f, 0), se = Math.min(sc, tapa);
        if (!mejor || se > mejor.se + 1e-9 || (Math.abs(se - mejor.se) <= 1e-9 && filas < mejor.filas)) mejor = { sc, se, gs, W0, filas };
        return;
      }
      for (const f of opciones[i]) prueba(i + 1, elegidas.concat(f));
    };
    prueba(0, []);
    const grupos = mejor.gs, W0 = mejor.W0;
    // Escala: la que hace caber el pedido, hasta 1,7 (o la que fijan los datos, para que el juego no salte de tamaño).
    const sCabe = mejor.sc;
    const s = Math.min(sCabe, tapa);
    let x = zona.x0 + (AW - W0 * s) / 2;
    const objetos = [], textos = [], cajas = [];
    grupos.forEach(g => {
      g.x = x; g.cx = x + g.w * s / 2; g.y0 = PISO - g.h * s;
      objetos.push({ que: g.tipo, x0: x, y0: g.y0, x1: x + g.w * s, y1: PISO });
      x += (g.w + SEP) * s;
    });
    // Rótulos: en la primera línea; si pisan al de la izquierda, en la segunda. Con el cuaderno, los rótulos dicen
    // sumas («3 + 2 bolsitas») y dos seguidos se leerían como una sola: piden más aire entre ellos.
    const aire = cu ? 20 : 6;
    const rotulos = [];
    for (const g of grupos) {
      const segs = rotuloDe(d, g.tipo === 'cerrado' ? 'cerrado' : g.tipo);
      if (!segs) continue;
      const w = anchoSegs(segs, TAM, 400), x0 = Math.min(W - 12 - w, Math.max(12, g.cx - w / 2));
      let fila = 0;
      while (fila < ROT.length - 1 && rotulos.some(r => r.fila === fila && x0 < r.x1 + aire && r.x0 < x0 + w + aire)) fila++;
      const r = { segs, x0, x1: x0 + w, fila, y: ROT[fila] };
      rotulos.push(r);
      textos.push({ que: 'rotulo', txt: segs.map(z => z[0]).join(''), x0, x1: x0 + w, y0: r.y - TAM * 0.8, y1: r.y + TAM * 0.25 });
    }
    // Letrero de la regla.
    const regla = reglas.map((segs, i) => {
      const y = 62 + i * 18, w = anchoSegs(segs, TAM, 400);
      textos.push({ que: 'regla', txt: segs.map(z => z[0]).join(''), x0: 20, x1: 20 + w, y0: y - TAM * 0.8, y1: y + TAM * 0.25 });
      return { segs, y };
    });
    // El cuaderno: un objeto más del puesto; sus textos van dentro (cajas con dentro: 'cuaderno').
    let cuenta = null;
    if (cu) {
      cuenta = geoCuenta(cu);
      objetos.push({ que: 'cuaderno', x0: cuenta.C.x0, y0: cuenta.C.y0, x1: cuenta.C.x1, y1: cuenta.C.y1 });
      cajas.push(...cuenta.cajas);
    }
    // Etiqueta colgada (con el cuaderno no va: el cuaderno anota el total).
    let etq = null;
    if (d.etiqueta && !cu) {
      const e = d.etiqueta, cif = String(e.cifras === undefined ? '?' : e.cifras), base = e.base === undefined ? String(d.n) : String(e.base);
      const pide = /\?/.test(cif), col = e.color !== false;
      const w = T.ancho(cif, 22, 700) + (base ? T.ancho(`(${base})`, TAM, 600) : 0);
      etq = { cif, base, cCif: col && !pide ? 'o' : null, cBase: col && base !== '?' ? 'i' : null, w };
      objetos.push({ que: 'etiqueta', x0: ETQ.x0, y0: ETQ.y0, x1: ETQ.x1, y1: ETQ.y1 });
      cajas.push({ que: 'texto de la etiqueta', x0: ETQ.cx - w / 2, x1: ETQ.cx + w / 2, y0: ETQ.base - 22 * 0.8, y1: ETQ.base + 5 + TAM * 0.25, dentro: 'etiqueta' });
    }
    return { W, H, M, PISO, s, sCabe, n, d, grupos, rotulos, regla, etq, cuenta, objetos, textos, cajas };
  }

  // ---------- Dibujo ----------
  function dibujar(datos, estado = {}) {
    const g = geometria(datos, estado), d = g.d, n = g.n;
    let s = '';
    // El puesto: toldo a rayas con su letrero, dos postes y el mostrador.
    let rayas = '';
    for (let k = 0; k < 8; k++) rayas += `<rect x="${n2(8 + k * 38)}" y="6" width="38" height="26" fill="currentColor" fill-opacity="${k % 2 ? 0.05 : 0.13}"/>`;
    let ondas = 'M8 32';
    for (let k = 0; k < 8; k++) ondas += `A19 7 0 0 0 ${n2(8 + (k + 1) * 38)} 32`;
    s += `<g class="ar-toldo">${rayas}<path d="${ondas}" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`
      + `<rect x="8" y="6" width="304" height="26" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>`
      + `<rect x="60" y="10" width="200" height="19" rx="4" fill="var(--card)" stroke="currentColor" stroke-width="1"/>`
      + texto(160, 24, [['Caramelos de doña Juana', null, 600]], { ancla: 'middle' }) + '</g>';
    s += `<line x1="14" y1="38" x2="14" y2="${PISO}" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="306" y1="38" x2="306" y2="${PISO}" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    s += `<rect x="8" y="${PISO}" width="304" height="${H - M - PISO}" rx="3" fill="currentColor" fill-opacity="0.06" stroke="currentColor" stroke-width="2"/>`;
    // El letrero de la regla del puesto.
    for (const r of g.regla) s += texto(20, r.y, r.segs);
    // El cuaderno de doña Juana con la cuenta.
    if (g.cuenta) s += dibujarCuenta(g.cuenta);
    // La etiqueta colgada del toldo.
    if (g.etq) {
      const e = g.etq;
      s += `<g class="ar-etiqueta"><line x1="${ETQ.cx}" y1="34" x2="${ETQ.cx}" y2="${ETQ.y0 + 6}" stroke="currentColor" stroke-width="1.5"/>`
        + `<rect x="${ETQ.x0}" y="${ETQ.y0}" width="${ETQ.x1 - ETQ.x0}" height="${ETQ.y1 - ETQ.y0}" rx="7" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`
        + `<circle cx="${ETQ.cx}" cy="${ETQ.y0 + 6}" r="2.5" fill="none" stroke="currentColor" stroke-width="1.5"/>`
        + `<text class="kit-txt" x="${ETQ.cx}" y="${ETQ.base}" text-anchor="middle" font-size="22" font-weight="700" style="font-variant-numeric:tabular-nums"><tspan fill="${T.color(e.cCif)}">${T.esc(e.cif)}</tspan>`
        + (e.base ? `<tspan fill="${T.color(e.cBase)}" font-size="${TAM}" font-weight="600" dy="5">(${T.esc(e.base)})</tspan>` : '') + '</text></g>';
    }
    // El pedido, a una sola escala, apoyado en el mostrador.
    let pedido = '';
    for (const gr of g.grupos) {
      const xl = (gr.x - g.grupos[0].x) / g.s;
      pedido += gr.tipo === 'cerrado' ? cerrado(xl) : grupo(gr.tipo, xl, gr.k, n, gr);
      // Lo que acaba de subir (la llevada): los últimos del grupo, con un aro punteado naranja.
      const sube = d.llevada && ['bolsitas', 'cajas', 'cajones'].includes(gr.tipo) ? Math.min(entero(d.llevada[gr.tipo]), gr.k) : 0;
      if (sube) for (const p of posicionesGrupo(xl, gr.k, gr).slice(gr.k - sube))
        pedido += `<rect class="ar-subio" x="${n2(p.x - 3)}" y="${n2(p.y - gr.u.h - 3)}" width="${n2(gr.u.w + 6)}" height="${n2(gr.u.h + 5)}" rx="6" fill="none" stroke="var(--c-o)" stroke-width="2.5" stroke-dasharray="5 3" vector-effect="non-scaling-stroke"/>`;
      if (d.juntar === gr.tipo && gr.k >= n) {
        // Aro punteado alrededor de los primeros n (los que se juntan).
        if (gr.tipo === 'sueltos') {
          const ps = puntosMonton(xl, gr.k).slice(0, n), xs = ps.map(p => p[0]), ys = ps.map(p => p[1]);
          const x0 = Math.min(...xs) - 10, x1 = Math.max(...xs) + 10, y0 = Math.min(...ys) - 6, y1 = Math.max(...ys) + 5;
          pedido += `<rect class="ar-juntar" x="${n2(x0)}" y="${n2(y0)}" width="${n2(x1 - x0)}" height="${n2(y1 - y0)}" rx="6" fill="none" stroke="var(--c-i)" stroke-width="2" stroke-dasharray="5 4" vector-effect="non-scaling-stroke"/>`;
        } else if (d.cuenta) {
          // Con el cuaderno, un aro por cada uno de los primeros n: así se ve que se juntan n, no la fila entera.
          for (const p of posicionesGrupo(xl, gr.k, gr).slice(0, n))
            pedido += `<rect class="ar-juntar" x="${n2(p.x - 0.5)}" y="${n2(p.y - gr.u.h - 1)}" width="${n2(gr.u.w + 1)}" height="${n2(gr.u.h + 1.5)}" rx="6" fill="none" stroke="var(--c-i)" stroke-width="2" stroke-dasharray="5 4" vector-effect="non-scaling-stroke"/>`;
        } else {
          const filasG = Math.ceil(n / gr.porFila), anchoG = Math.min(n, gr.porFila) * (gr.u.w + 3) + 3;
          const x0 = xl + (gr.w - (Math.min(gr.porFila, gr.k) * (gr.u.w + 3) - 3)) / 2 - 3;
          pedido += `<rect class="ar-juntar" x="${n2(x0)}" y="${n2(-filasG * (gr.u.h + 2) - 3)}" width="${n2(anchoG)}" height="${n2(filasG * (gr.u.h + 2) + 2)}" rx="8" fill="none" stroke="var(--c-i)" stroke-width="2" stroke-dasharray="5 4" vector-effect="non-scaling-stroke"/>`;
        }
      }
    }
    if (g.grupos.length) s += `<g class="ar-pedido" transform="translate(${n2(g.grupos[0].x)} ${PISO}) scale(${n2(g.s)})">${pedido}</g>`;
    // Rótulos del frente del mostrador.
    for (const r of g.rotulos) s += texto(r.x0, r.y, r.segs);
    // Zonas para tocar un grupo (toque directo; el control sigue con sus botones).
    for (const t of Array.isArray(d.toque) ? d.toque : []) {
      const o = g.objetos.find(x => x.que === t.orden);
      if (!o || !t.control) continue;
      s += `<rect class="ar-toque" data-toque="${T.esc(t.control)}" x="${n2(o.x0 - 4)}" y="${n2(o.y0 - 4)}" width="${n2(o.x1 - o.x0 + 8)}" height="${n2(o.y1 - o.y0 + 6)}" fill="transparent"><title>${T.esc(t.titulo || 'Tocar')}</title></rect>`;
    }
    return T.svg(W, H, `<g class="kit-objeto" data-objeto="puesto" data-prueba="si">${s}</g>`, { alt: alt(datos, estado) });
  }

  function alt(datos, estado = {}) {
    const d = mezcla(datos, estado), n = d.n;
    const cu = d.cuenta && typeof d.cuenta === 'object' ? d.cuenta : null;
    const partes = [];
    if (d.cerrado) partes.push('un paquete de papel cerrado');
    else for (const o of ordenes(d).slice()) { const k = entero(d[o]); partes.push(`${k} ${o === 'sueltos' ? (k === 1 ? 'caramelo suelto' : 'caramelos sueltos') : (k === 1 ? SING[o] : PLUR[o])}`); }
    let t = cu && cu.solo ? 'Puesto de caramelos de doña Juana, con su cuaderno de cuentas abierto sobre el mostrador.'
      : `Puesto de caramelos de doña Juana, con bolsitas de ${n === undefined ? '?' : n} caramelos. Sobre el mostrador: ${partes.join(', ')}.`;
    if (!d.cerrado && !(cu && cu.solo) && entero(d.llega)) t += ` Llegan ${entero(d.llega)} caramelos más.`;
    if (!d.cerrado && !(cu && cu.solo) && d.incompleta && entero(d.incompleta.de)) { const de = entero(d.incompleta.de), ti = Math.min(de, entero(d.incompleta.tiene)); t += ` Una bolsita a medio llenar, de ${de}: tiene ${ti} ${ti === 1 ? 'caramelo' : 'caramelos'} y ${de - ti} ${de - ti === 1 ? 'hueco' : 'huecos'}.`; }
    if (entero(d.extra) && entero(d.bolsitas)) t += ` En cada bolsita, los ${entero(d.extra)} caramelos de arriba son los que se agregaron.`;
    if (d.llevada) for (const o of ['bolsitas', 'cajas', 'cajones']) { const k = entero(d.llevada[o]); if (k) t += ` ${k === 1 ? `Acaba de subir 1 ${SING[o]}` : `Acaban de subir ${k} ${PLUR[o]}`}, marcada con un aro.`; }
    if (cu) {
      const b = sinBase(cu.base) ? '' : ` en base ${cu.base}`, ll = Object.entries(cu.llevadas || {}).filter(([, v]) => v);
      const sinM = x => String(x).replace(/#/g, '?');
      t += ` En el cuaderno: ${(cu.sumandos || []).map(sinM).join(` ${cu.op || '+'} `)}${b} = ${cu.resultado === undefined ? '?' : sinM(cu.resultado)}.`;
      if (/#/.test((cu.sumandos || []).join('') + String(cu.resultado))) t += ' Las cifras con «?» están tapadas por manchas.';
      const pr = Object.entries(cu.presta || {}).filter(([, v]) => v !== undefined && v !== null && v !== '');
      if (pr.length) t += ` Préstamos: la columna ${pr.map(([k, v]) => `${+k + 1} queda en ${v}`).join(', la ')}.`;
      if (ll.length) t += ` Llevadas: ${ll.map(([k, v]) => `${v} a la columna ${+k + 1}`).join(', ')}.`;
    } else if (d.etiqueta) { const e = d.etiqueta, b = e.base === undefined ? n : e.base; t += ` Etiqueta: ${e.cifras === undefined ? '?' : e.cifras}${b !== '' && b !== undefined ? ` en base ${b}` : ''}.`; }
    return t;
  }

  return { id: 'arit-puesto', dibujar, alt, geometria, constantes: { W, H, M, PISO, ZONA, TOPE, ETQ } };
});
