/*
 * Pieza «fis-estatica» (19 nov 2026, «Estática: equilibrio y torque», etapa 6; docs/etapa6/propuesta-fisica.md §2):
 * cuerpos quietos de la vida real con las fuerzas que los sostienen. El costal sobre la balanza de la bodega, el letrero
 * colgado de dos cables, el ropero que se empuja, la balanza de resorte del mercado, el sube y baja del parque, el
 * tablón del pintor sobre dos caballetes, la escalera contra la pared, la rampa, la polea, la llave y la escoba. Todo es
 * dibujo de prueba (data-prueba): Gerson decide después cuáles reemplaza (docs/plan-calidad.md, M4).
 *
 * Afirmación de la figura (≤ 25 palabras): cada fuerza es una flecha que sale del cuerpo que la siente, apunta hacia
 * donde empuja o jala y lleva el color de su clase.
 *
 * Colores de la unidad (cabecera de contenido/teoria/fisica/estatica.js): peso carmín (h), normal y apoyos violeta (f),
 * tensión, mano y resorte naranja (o), rozamiento turquesa (i); todo lo demás en tinta. La pieza no elige colores: los
 * trae cada flecha.
 *
 * Coordenadas en píxeles del lienzo (ancho 320, y hacia abajo). Los ángulos de flechas y arcos, en grados como en
 * trigonometría: 0° a la derecha, 90° hacia arriba (en pantalla: dx = cos, dy = −sen). Función pura de (datos, estado):
 * sin ids, sin azar, sin reloj. Solo currentColor y var(--c-*). geometria(datos, estado) devuelve las cajas de los
 * rótulos y de los objetos y los extremos de las flechas, para las pruebas de encuadre y de choques
 * (fis-estatica.test.js).
 *
 * datos = {
 *   alto: 240,
 *   piso: { y, x0, x1 }  techo: { y, x0, x1 }  paredes: [{ x, y0, y1, lado: -1 (rayas a la izquierda) | 1 }]
 *   objetos: [{ tipo, … }]   (cada uno puede traer paso y hasta)
 *     caja | costal | ropero | letrero | bolsa | balde   { x: centro, y: abajo (letrero y bolsa: arriba), w, h, texto, giro }
 *     balanza   { x, y: piso, w, lectura }           la balanza de piso con su pantalla al frente (lo de encima, en y − 26)
 *     persona   { x, y: pies, alto, mano: [x, y], mira: 1 | -1, texto }   una persona de palitos
 *     cuerda    { de, a, floja }    nudo { en }    resorte { de, a, vueltas, ancho }    polea { c, r }
 *     rampa     { x0, y0, largo, ang }               el triángulo, con el ángulo abajo a la izquierda
 *     barra     { de, a, grosor }   apoyo { x, y }   caballete { x, y, alto }   viga { x0, x1, y }
 *     escalera  { de, a, peldanos }   escoba { de, a }   llave { de, a }   regla { x, y0, y1, cm, desde }
 *     gancho    { x, y, w }   la caja de la balanza de resorte, colgada de la viga
 *   flechas: [{ de: [x, y], ang, largo, color, texto, lado, rumbo: [dx, dy], discontinua, paso, hasta }]
 *   angulos: [{ c, de, a, r, texto }]                arcos en tinta, de «de» a «a» (a > de)
 *   cotas:   [{ de, a, texto, lado: 1 | -1, sep }]   una llave de medida paralela al tramo, con sus topes
 *   lineas:  [{ de, a, discontinua }]                guías finas (el largo natural, la línea de una fuerza)
 *   textos:  [{ x, y, texto, color, ancla, peso }]
 *   cortes:  [{ … }, …]                              para «Mira»: estado.corte elige qué se agrega a los datos
 *   alt
 * }
 * estado = { paso, corte }: un elemento con paso se ve desde ese paso y hasta su «hasta».
 * Rótulos: «N_A» se dibuja con la A como subíndice (<tspan>) y «P⃗» con una flechita trazada sobre la letra; cada rótulo
 * lleva un halo del color de la tarjeta. Los textos fijos se ponen primero; los demás prueban su lado preferido y, si se
 * salen o pisan otro rótulo o una persona, giran alrededor de su ancla hasta encontrar un sitio libre.
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
  const W = 320, M = 4, TAM = 14;
  const n = T.n;
  const rad = d => d * Math.PI / 180;
  const lim = (v, a, b) => Math.min(b, Math.max(a, v));
  const col = c => (c && c !== 'tinta' ? `var(--c-${c})` : 'currentColor');
  const ink = 'currentColor';
  const ve = (el, p) => (el.paso || 0) <= p && (el.hasta === undefined || p <= el.hasta);

  function caja(x, y, texto, o = {}) {
    const tam = o.tam || TAM, peso = o.peso || 700, ancla = o.ancla || 'start';
    const visto = String(texto).replace(/⃗|_/g, '');
    const w = T.ancho(visto, tam, peso), xx = T.encajar(x, visto, ancla, { tam, peso, min: M, max: W - M });
    const izq = ancla === 'middle' ? xx - w / 2 : ancla === 'end' ? xx - w : xx;
    return { x0: izq, x1: izq + w, y0: y - tam * 0.78, y1: y + tam * 0.22, texto: String(texto), x: xx, y, ancla, tam, peso, color: o.color, tipo: o.tipo || 'rotulo' };
  }
  const centrado = (x, y, texto, o = {}) => caja(x, y + (o.tam || TAM) * 0.28, texto, Object.assign({ ancla: 'middle' }, o));
  function datosDe(datos, estado) {
    const d = datos || {};
    if (!Array.isArray(d.cortes) || !d.cortes.length) return d;
    const k = lim(Math.round((estado && estado.corte) || 0), 0, d.cortes.length - 1);
    return Object.assign({}, d, d.cortes[k]);
  }
  const pisa = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
  function cruza(b, x1, y1, x2, y2) {
    const X0 = b.x0 + 1, X1 = b.x1 - 1, Y0 = b.y0 + 1, Y1 = b.y1 - 1, dx = x2 - x1, dy = y2 - y1;
    let t0 = 0, t1 = 1;
    for (const [pp, qq] of [[-dx, x1 - X0], [dx, X1 - x1], [-dy, y1 - Y0], [dy, Y1 - y1]]) {
      if (Math.abs(pp) < 1e-12) { if (qq < 0) return false; continue; }
      const r = qq / pp;
      if (pp < 0) { if (r > t1) return false; if (r > t0) t0 = r; } else { if (r < t0) return false; if (r < t1) t1 = r; }
    }
    return t0 <= t1;
  }
  const raya = (x1, y1, x2, y2, g = 2, extra = '') => `<path d="M${n(x1)} ${n(y1)}L${n(x2)} ${n(y2)}" stroke="${ink}" stroke-width="${g}" stroke-linecap="round" fill="none"${extra}/>`;
  const cajaDe = (nombre, x0, y0, x1, y1, fig) => ({ nombre, x0: Math.min(x0, x1), x1: Math.max(x0, x1), y0: Math.min(y0, y1), y1: Math.max(y0, y1), fig: !!fig });

  // ---- Bloque de Dinámica (19 nov 2026, etapa 7): carrito, ascensor, auto, tramo de pista y disco que gira ----
  //   carrito  { x: centro, y: piso, w, h, texto, mango: -1 | 1 | 0 }   la caja sobre dos ruedas; el mango atrás
  //   ascensor { x, y: piso de la cabina, w, h }                       la cabina con su cable hasta arriba
  //   auto     { x, y: donde tocan las ruedas, w, giro, texto }        de costado; giro, como la caja de la rampa
  //   pista    { c: [x, y], r, de, a, forma: 'loma' | 'hondonada' }     un arco de pista (grados: 0° a la derecha, 90° arriba)
  //   disco    { c: [x, y], r }                                       una plataforma que gira, vista desde arriba
  //   pelota   { x, y: centro, r }                                    una pelota
  function objetoDinamica(o, lineas) {
    let s = '', b = null;
    const figs = [], t = o.tipo;
    if (t === 'carrito') {
      const w = o.w || 80, h = o.h || 30, rr = 7, x0 = o.x - w / 2, yb = o.y - 2 * rr, y0 = yb - h, m = o.mango === undefined ? -1 : o.mango;
      s += `<rect x="${n(x0)}" y="${n(y0)}" width="${n(w)}" height="${n(h)}" rx="3" fill="${ink}" fill-opacity="0.08" stroke="${ink}" stroke-width="2"/>`;
      for (const xr of [x0 + w * 0.22, x0 + w * 0.78]) s += `<circle cx="${n(xr)}" cy="${n(o.y - rr)}" r="${rr}" fill="var(--card)" stroke="${ink}" stroke-width="2"/><circle cx="${n(xr)}" cy="${n(o.y - rr)}" r="1.8" fill="${ink}"/>`;
      let xm = o.x;
      if (m) { const xa = m < 0 ? x0 : x0 + w, xb = xa + m * 14; s += raya(xa, y0 + 4, xb, y0 - 18, 2.5) + raya(xb - 4, y0 - 18, xb + 4, y0 - 18, 3); xm = xb; lineas.push([xa, y0 + 4, xb, y0 - 18]); }
      if (o.texto) s += T.rotulo(o.x, y0 + h / 2 + 5, o.texto, { ancla: 'middle', tam: 13, peso: 700, min: -1e4, max: 1e4 });
      b = cajaDe('carrito', Math.min(x0, xm - 5) - 1, y0 - (m ? 20 : 2), Math.max(x0 + w, xm + 5) + 1, o.y + 1);
    } else if (t === 'ascensor') {
      const w = o.w || 110, h = o.h || 150, x0 = o.x - w / 2, y0 = o.y - h;
      s += `<rect x="${n(x0)}" y="${n(y0)}" width="${n(w)}" height="${n(h)}" rx="2" fill="${ink}" fill-opacity="0.04" stroke="${ink}" stroke-width="2.5"/>`
        + raya(x0, o.y, x0 + w, o.y, 4) + raya(o.x, y0, o.x, M, 2) + raya(x0 + 6, y0 + 8, x0 + 6, o.y - 8, 1) + raya(x0 + w - 6, y0 + 8, x0 + w - 6, o.y - 8, 1);
      lineas.push([o.x, y0, o.x, M]);
      b = cajaDe('ascensor', x0 - 2, y0 - 2, x0 + w + 2, o.y + 3);
      figs.push(cajaDe('techo-ascensor', x0 - 2, y0 - 2, x0 + w + 2, y0 + 3, true));
    } else if (t === 'auto') {
      const w = o.w || 72, rr = 7, x0 = o.x - w / 2, yb = o.y - rr, y1 = yb - 14, y2 = y1 - 13;
      let g = `<path d="M${n(x0)} ${n(yb)}V${n(y1 + 3)}Q${n(x0)} ${n(y1)} ${n(x0 + 4)} ${n(y1)}H${n(x0 + w * 0.22)}L${n(x0 + w * 0.34)} ${n(y2)}H${n(x0 + w * 0.7)}L${n(x0 + w * 0.82)} ${n(y1)}H${n(x0 + w - 3)}Q${n(x0 + w)} ${n(y1)} ${n(x0 + w)} ${n(y1 + 3)}V${n(yb)}Z" fill="${ink}" fill-opacity="0.1" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/>`;
      g += raya(x0 + w * 0.52, y2 + 2, x0 + w * 0.52, y1 - 1, 1.5);
      for (const xr of [x0 + w * 0.22, x0 + w * 0.78]) g += `<circle cx="${n(xr)}" cy="${n(o.y - rr)}" r="${rr}" fill="var(--card)" stroke="${ink}" stroke-width="2"/><circle cx="${n(xr)}" cy="${n(o.y - rr)}" r="1.8" fill="${ink}"/>`;
      if (o.texto) g += T.rotulo(o.x, y1 + 11, o.texto, { ancla: 'middle', tam: 11, peso: 700, min: -1e4, max: 1e4 });
      s += o.giro ? `<g transform="rotate(${n(-o.giro)} ${n(o.x)} ${n(o.y)})">${g}</g>` : g;
      const R = Math.hypot(w / 2, o.y - y2) + 2;
      b = o.giro ? cajaDe('auto', o.x - R, o.y - R, o.x + R, o.y + R * Math.sin(rad(Math.abs(o.giro))) + 2) : cajaDe('auto', x0 - 1, y2 - 1, x0 + w + 1, o.y + 1);
    } else if (t === 'pista') {
      const [cx, cy] = o.c, r = o.r || 120, de = o.de === undefined ? 45 : o.de, a = o.a === undefined ? 135 : o.a, dentro = o.forma !== 'hondonada';
      const pt = (ang, rr) => [cx + rr * Math.cos(rad(ang)), cy - rr * Math.sin(rad(ang))];
      const P1 = pt(de, r), P2 = pt(a, r);
      s += `<path d="M${n(P1[0])} ${n(P1[1])}A${n(r)} ${n(r)} 0 ${a - de > 180 ? 1 : 0} 0 ${n(P2[0])} ${n(P2[1])}" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`;
      let rs = '';
      const k = Math.max(4, Math.round((a - de) * r * Math.PI / 180 / 10));
      let xmin = Math.min(P1[0], P2[0]), xmax = Math.max(P1[0], P2[0]), ymin = Math.min(P1[1], P2[1]), ymax = Math.max(P1[1], P2[1]);
      for (let i = 0; i <= k; i++) {
        const ang = de + (a - de) * i / k, q = pt(ang, r), q2 = pt(ang + (dentro ? 3 : -3), dentro ? r - 7 : r + 7);
        if (i < k) rs += `M${n(q[0])} ${n(q[1])}L${n(q2[0])} ${n(q2[1])}`;
        xmin = Math.min(xmin, q[0], q2[0]); xmax = Math.max(xmax, q[0], q2[0]); ymin = Math.min(ymin, q[1], q2[1]); ymax = Math.max(ymax, q[1], q2[1]);
        if (i) { const p0 = pt(de + (a - de) * (i - 1) / k, r); lineas.push([p0[0], p0[1], q[0], q[1]]); }
      }
      s += `<path d="${rs}" stroke="${ink}" stroke-width="1" stroke-opacity="0.5" fill="none"/>`;
      b = cajaDe('pista', xmin - 2, ymin - 2, xmax + 2, ymax + 2);
    } else if (t === 'pelota') {
      const r = o.r || 12;
      s += `<circle cx="${n(o.x)}" cy="${n(o.y)}" r="${n(r)}" fill="${ink}" fill-opacity="0.12" stroke="${ink}" stroke-width="2"/><path d="M${n(o.x - r * 0.7)} ${n(o.y - r * 0.3)}Q${n(o.x)} ${n(o.y + r * 0.4)} ${n(o.x + r * 0.7)} ${n(o.y - r * 0.3)}" fill="none" stroke="${ink}" stroke-width="1.2"/>`;
      b = cajaDe('pelota', o.x - r - 1, o.y - r - 1, o.x + r + 1, o.y + r + 1);
    } else if (t === 'disco') {
      const [cx, cy] = o.c, r = o.r || 80;
      s += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="${ink}" fill-opacity="0.06" stroke="${ink}" stroke-width="2"/><circle cx="${n(cx)}" cy="${n(cy)}" r="3.5" fill="${ink}"/>`;
      b = cajaDe('disco', cx - r - 1, cy - r - 1, cx + r + 1, cy + r + 1);
      figs.push(cajaDe('eje', cx - 5, cy - 5, cx + 5, cy + 5, true));
    }
    return { s, b, figs };
  }

  // ---- los objetos ----
  function objeto(o, lineas) {
    let s = '', b = null, figs = [];
    const t = o.tipo;
    if (t === 'caja' || t === 'ropero' || t === 'costal' || t === 'balde') {
      const w = o.w || 60, h = o.h || 40, x0 = o.x - w / 2, y0 = o.y - h;
      if (t === 'costal') {
        s += `<path d="M${n(x0 + 4)} ${n(o.y)}Q${n(x0 - 3)} ${n(y0 + h * 0.45)} ${n(x0 + 8)} ${n(y0 + 6)}Q${n(o.x)} ${n(y0 - 4)} ${n(x0 + w - 8)} ${n(y0 + 6)}Q${n(x0 + w + 3)} ${n(y0 + h * 0.45)} ${n(x0 + w - 4)} ${n(o.y)}Z" fill="${ink}" fill-opacity="0.1" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/>`
          + raya(o.x - 8, y0 + 4, o.x + 8, y0 + 4, 1.5);
      } else if (t === 'balde') {
        s += `<path d="M${n(x0)} ${n(y0)}L${n(x0 + 4)} ${n(o.y)}H${n(x0 + w - 4)}L${n(x0 + w)} ${n(y0)}Z" fill="${ink}" fill-opacity="0.1" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/>`
          + `<path d="M${n(x0)} ${n(y0)}Q${n(o.x)} ${n(y0 - h * 0.7)} ${n(x0 + w)} ${n(y0)}" fill="none" stroke="${ink}" stroke-width="1.5"/>`;
      } else {
        s += `<rect x="${n(x0)}" y="${n(y0)}" width="${n(w)}" height="${n(h)}" rx="3" fill="${ink}" fill-opacity="0.08" stroke="${ink}" stroke-width="2"/>`;
        if (t === 'ropero') s += raya(o.x, y0 + 4, o.x, o.y - 4, 1.5) + raya(o.x - 5, y0 + h * 0.45, o.x - 5, y0 + h * 0.55, 2) + raya(o.x + 5, y0 + h * 0.45, o.x + 5, y0 + h * 0.55, 2);
      }
      if (o.texto) s += T.rotulo(o.x, y0 + h / 2 + 5, o.texto, { ancla: 'middle', tam: 13, peso: 700, min: -1e4, max: 1e4 });
      b = cajaDe(t, x0 - 2, y0 - (t === 'balde' ? h * 0.4 : 2), x0 + w + 2, o.y + 1);
      // giro: la caja apoyada en una rampa, girada alrededor del medio de su base (grados, contra las agujas del reloj)
      if (o.giro) {
        s = `<g transform="rotate(${n(-o.giro)} ${n(o.x)} ${n(o.y)})">${s}</g>`;
        const R = Math.hypot(w / 2, h) + 2; b = cajaDe(t, o.x - R, o.y - R, o.x + R, o.y + R * Math.sin(rad(Math.abs(o.giro))) + 2);
      }
    } else if (t === 'letrero' || t === 'bolsa') {
      const w = o.w || 70, h = o.h || 34, x0 = o.x - w / 2, y0 = o.y;
      if (t === 'bolsa') s += `<path d="M${n(x0 + 6)} ${n(y0 + 6)}H${n(x0 + w - 6)}L${n(x0 + w)} ${n(y0 + h)}H${n(x0)}Z" fill="${ink}" fill-opacity="0.1" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/>`
        + `<path d="M${n(o.x - 8)} ${n(y0 + 6)}Q${n(o.x)} ${n(y0 - 4)} ${n(o.x + 8)} ${n(y0 + 6)}" fill="none" stroke="${ink}" stroke-width="1.5"/>`;
      else s += `<rect x="${n(x0)}" y="${n(y0)}" width="${n(w)}" height="${n(h)}" rx="4" fill="var(--card)" stroke="${ink}" stroke-width="2.5"/>`
        + `<rect x="${n(x0 + 4)}" y="${n(y0 + 4)}" width="${n(w - 8)}" height="${n(h - 8)}" rx="2" fill="${ink}" fill-opacity="0.06" stroke="none"/>`;
      if (o.texto) s += T.rotulo(o.x, y0 + h / 2 + 5, o.texto, { ancla: 'middle', tam: 13, peso: 700, min: -1e4, max: 1e4 });
      b = cajaDe(t, x0 - 2, y0 - (t === 'bolsa' ? 4 : 2), x0 + w + 2, y0 + h + 2);
    } else if (t === 'balanza') {
      // la balanza de piso: una plataforma con su pantalla al frente; lo que se apoya va encima (y − 26)
      const w = o.w || 110, x0 = o.x - w / 2, y = o.y;
      s += `<rect x="${n(x0)}" y="${n(y - 22)}" width="${n(w)}" height="22" rx="3" fill="${ink}" fill-opacity="0.12" stroke="${ink}" stroke-width="2"/>`
        + `<rect x="${n(x0 + 4)}" y="${n(y - 26)}" width="${n(w - 8)}" height="4" fill="${ink}" fill-opacity="0.35"/>`
        + `<rect x="${n(o.x - 24)}" y="${n(y - 19)}" width="48" height="16" rx="2" fill="var(--card)" stroke="${ink}" stroke-width="1.5"/>`;
      if (o.lectura) s += T.rotulo(o.x, y - 7, o.lectura, { ancla: 'middle', tam: 12, peso: 700, min: -1e4, max: 1e4 });
      b = cajaDe('balanza', x0 - 1, y - 27, x0 + w + 1, y + 1);
      figs.push(cajaDe('pantalla', o.x - 25, y - 20, o.x + 25, y - 2, true));
    } else if (t === 'persona') {
      const H = o.alto || 70, x = o.x, y = o.y, m = o.mira || 1, cab = H * 0.11;
      const hombro = [x, y - H * 0.72], cadera = [x, y - H * 0.38], cy = y - H + cab;
      s += `<circle cx="${n(x)}" cy="${n(cy)}" r="${n(cab)}" fill="var(--card)" stroke="${ink}" stroke-width="2"/>`
        + raya(x, cy + cab, cadera[0], cadera[1], 2.5) + raya(cadera[0], cadera[1], x - 6, y, 2.5) + raya(cadera[0], cadera[1], x + 6, y, 2.5);
      const mano = o.mano || [x + m * H * 0.32, hombro[1] + H * 0.1];
      const codo = [(hombro[0] + mano[0]) / 2 - m * 3, (hombro[1] + mano[1]) / 2 + 4];
      s += `<path d="M${n(hombro[0])} ${n(hombro[1])}L${n(codo[0])} ${n(codo[1])}L${n(mano[0])} ${n(mano[1])}" stroke="${ink}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
      if (o.texto) s += T.rotulo(x, cy - cab - 4, o.texto, { ancla: 'middle', tam: 12, peso: 700, min: -1e4, max: 1e4 });
      b = cajaDe('persona', Math.min(x - 8, mano[0]) - 2, cy - cab - (o.texto ? 16 : 2), Math.max(x + 8, mano[0]) + 2, y + 1);
      figs.push(cajaDe('cabeza', x - cab - 1, cy - cab - (o.texto ? 16 : 1), x + cab + 1, cy + cab + 1, true));
      lineas.push([hombro[0], hombro[1], mano[0], mano[1]]);
    } else if (t === 'cuerda') {
      // floja: true la dibuja suelta, con una comba (no jala)
      if (o.floja) { const mx = (o.de[0] + o.a[0]) / 2 + 14, my = (o.de[1] + o.a[1]) / 2; s += `<path d="M${n(o.de[0])} ${n(o.de[1])}Q${n(mx)} ${n(my)} ${n(o.a[0])} ${n(o.a[1])}" stroke="${ink}" stroke-width="2" fill="none" stroke-linecap="round"/>`; }
      else s += raya(o.de[0], o.de[1], o.a[0], o.a[1], 2);
      lineas.push([o.de[0], o.de[1], o.a[0], o.a[1]]);
    } else if (t === 'nudo') {
      s += `<circle cx="${n(o.en[0])}" cy="${n(o.en[1])}" r="4" fill="${ink}"/>`;
      figs.push(cajaDe('nudo', o.en[0] - 5, o.en[1] - 5, o.en[0] + 5, o.en[1] + 5, true));
    } else if (t === 'resorte') {
      const [x1, y1] = o.de, [x2, y2] = o.a, L = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / L, uy = (y2 - y1) / L, k = o.vueltas || 10, a = o.ancho || 9;
      const pto = (u, v) => `${n(x1 + ux * u - uy * v)} ${n(y1 + uy * u + ux * v)}`;
      let d = `M${pto(0, 0)}L${pto(8, 0)}`;
      const paso = (L - 16) / k;
      for (let i = 0; i < k; i++) d += `L${pto(8 + paso * (i + 0.5), i % 2 ? a : -a)}`;
      d += `L${pto(L - 8, 0)}L${pto(L, 0)}`;
      s += `<path class="fis-resorte" d="${d}" fill="none" stroke="${ink}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
      lineas.push([x1, y1, x2, y2]);
      b = cajaDe('resorte', Math.min(x1, x2) - a - 1, Math.min(y1, y2) - 1, Math.max(x1, x2) + a + 1, Math.max(y1, y2) + 1);
    } else if (t === 'polea') {
      const [cx, cy] = o.c, r = o.r || 16;
      s += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="var(--card)" stroke="${ink}" stroke-width="2.5"/><circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r - 4)}" fill="none" stroke="${ink}" stroke-width="1"/>`
        + `<circle cx="${n(cx)}" cy="${n(cy)}" r="3" fill="${ink}"/>`;
      b = cajaDe('polea', cx - r - 1, cy - r - 1, cx + r + 1, cy + r + 1);
    } else if (t === 'rampa') {
      const L = o.largo || 200, a = o.ang || 30, x0 = o.x0, y0 = o.y0, x1 = x0 + L * Math.cos(rad(a)), y1 = y0 - L * Math.sin(rad(a));
      s += `<path d="M${n(x0)} ${n(y0)}L${n(x1)} ${n(y1)}L${n(x1)} ${n(y0)}Z" fill="${ink}" fill-opacity="0.08" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/>`;
      b = cajaDe('rampa', x0 - 1, y1 - 1, x1 + 1, y0 + 1);
    } else if (t === 'barra') {
      const g = o.grosor || 8, [x1, y1] = o.de, [x2, y2] = o.a, L = Math.hypot(x2 - x1, y2 - y1) || 1, nx = -(y2 - y1) / L * g / 2, ny = (x2 - x1) / L * g / 2;
      s += `<path d="M${n(x1 + nx)} ${n(y1 + ny)}L${n(x2 + nx)} ${n(y2 + ny)}L${n(x2 - nx)} ${n(y2 - ny)}L${n(x1 - nx)} ${n(y1 - ny)}Z" fill="${ink}" fill-opacity="0.18" stroke="${ink}" stroke-width="1.8" stroke-linejoin="round"/>`;
      lineas.push([x1, y1, x2, y2]);
      b = cajaDe('barra', Math.min(x1, x2) - g, Math.min(y1, y2) - g, Math.max(x1, x2) + g, Math.max(y1, y2) + g);
    } else if (t === 'apoyo') {
      const h = o.alto || 22;
      s += `<path d="M${n(o.x)} ${n(o.y)}L${n(o.x - h * 0.6)} ${n(o.y + h)}H${n(o.x + h * 0.6)}Z" fill="${ink}" fill-opacity="0.2" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/>`;
      b = cajaDe('apoyo', o.x - h * 0.6 - 1, o.y - 1, o.x + h * 0.6 + 1, o.y + h + 1);
    } else if (t === 'caballete') {
      const h = o.alto || 40, x = o.x, y = o.y;
      s += raya(x - 12, y, x + 12, y, 4) + raya(x - 4, y, x - 14, y + h, 2.5) + raya(x + 4, y, x + 14, y + h, 2.5) + raya(x - 9, y + h * 0.6, x + 9, y + h * 0.6, 1.5);
      b = cajaDe('caballete', x - 15, y - 2, x + 15, y + h + 1);
    } else if (t === 'viga') {
      s += `<rect x="${n(o.x0)}" y="${n(o.y - 8)}" width="${n(o.x1 - o.x0)}" height="8" fill="${ink}" fill-opacity="0.2" stroke="${ink}" stroke-width="1.5"/>`;
      b = cajaDe('viga', o.x0 - 1, o.y - 9, o.x1 + 1, o.y + 1);
    } else if (t === 'escalera') {
      const [x1, y1] = o.de, [x2, y2] = o.a, L = Math.hypot(x2 - x1, y2 - y1) || 1, nx = -(y2 - y1) / L * 7, ny = (x2 - x1) / L * 7, k = o.peldanos || 7;
      s += raya(x1 + nx, y1 + ny, x2 + nx, y2 + ny, 2.5) + raya(x1 - nx, y1 - ny, x2 - nx, y2 - ny, 2.5);
      for (let i = 1; i <= k; i++) { const u = i / (k + 1), px = x1 + (x2 - x1) * u, py = y1 + (y2 - y1) * u; s += raya(px + nx, py + ny, px - nx, py - ny, 1.5); }
      lineas.push([x1, y1, x2, y2]);
      b = cajaDe('escalera', Math.min(x1, x2) - 8, Math.min(y1, y2) - 8, Math.max(x1, x2) + 8, Math.max(y1, y2) + 8);
    } else if (t === 'escoba') {
      const [x1, y1] = o.de, [x2, y2] = o.a, L = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / L, uy = (y2 - y1) / L;
      const c0 = [x2 - ux * 28, y2 - uy * 28];
      s += raya(x1, y1, c0[0], c0[1], 3.5);
      const nx = -uy, ny = ux, q = (u, v) => `${n(c0[0] + ux * u + nx * v)} ${n(c0[1] + uy * u + ny * v)}`;
      s += `<path d="M${q(0, -6)}L${q(0, 6)}L${q(30, 14)}L${q(30, -14)}Z" fill="${ink}" fill-opacity="0.25" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/>`;
      lineas.push([x1, y1, x2, y2]);
      b = cajaDe('escoba', Math.min(x1, x2 + nx * 15) - 4, Math.min(y1, y2) - 15, Math.max(x1, x2) + 4, Math.max(y1, y2) + 15);
    } else if (t === 'llave') {
      const [x1, y1] = o.de, [x2, y2] = o.a, L = Math.hypot(x2 - x1, y2 - y1) || 1, nx = -(y2 - y1) / L * 5, ny = (x2 - x1) / L * 5;
      s += `<path d="M${n(x1 + nx)} ${n(y1 + ny)}L${n(x2 + nx)} ${n(y2 + ny)}L${n(x2 - nx)} ${n(y2 - ny)}L${n(x1 - nx)} ${n(y1 - ny)}Z" fill="${ink}" fill-opacity="0.15" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/>`;
      let hex = '';
      for (let i = 0; i < 6; i++) { const a = rad(30 + 60 * i); hex += `${i ? 'L' : 'M'}${n(x1 + 12 * Math.cos(a))} ${n(y1 - 12 * Math.sin(a))}`; }
      s += `<path d="${hex}Z" fill="var(--card)" stroke="${ink}" stroke-width="2"/><circle cx="${n(x1)}" cy="${n(y1)}" r="3" fill="${ink}"/>`;
      lineas.push([x1, y1, x2, y2]);
      b = cajaDe('llave', Math.min(x1 - 13, x2 - 6), Math.min(y1 - 13, y2 - 6), Math.max(x1 + 13, x2 + 6), Math.max(y1 + 13, y2 + 6));
    } else if (t === 'regla') {
      const x = o.x, y0 = o.y0, y1 = o.y1, k = o.cm || 0;
      s += `<rect x="${n(x)}" y="${n(y0)}" width="14" height="${n(y1 - y0)}" fill="var(--card)" stroke="${ink}" stroke-width="1.5"/>`;
      if (k > 0) for (let i = 0; i * k <= y1 - y0 + 1e-6; i++) { const y = y0 + i * k; s += raya(x, y, x + (i % 5 ? 4 : 8), y, 1); }
      b = cajaDe('regla', x - 1, y0 - 1, x + 15, y1 + 1);
    } else if (t === 'gancho') {
      const w = o.w || 26, x = o.x, y = o.y;
      s += `<rect x="${n(x - w / 2)}" y="${n(y)}" width="${n(w)}" height="22" rx="4" fill="var(--card)" stroke="${ink}" stroke-width="2"/>`
        + raya(x - w / 2 + 5, y + 11, x + w / 2 - 5, y + 11, 1);
      b = cajaDe('gancho', x - w / 2 - 1, y - 1, x + w / 2 + 1, y + 23);
    } else if (t === 'carrito' || t === 'ascensor' || t === 'auto' || t === 'pista' || t === 'disco' || t === 'pelota') {
      // Bloque de Dinámica (19 nov 2026, etapa 7; docs/etapa7/propuesta-fisica.md, decisión 10): objetos que se mueven.
      const r = objetoDinamica(o, lineas);
      s += r.s; b = r.b; figs.push(...r.figs);
    }
    // Un objeto con fig: true (la caja de un DCL) no deja que un rótulo lo pise.
    if (o.fig && b) figs.push(Object.assign({}, b, { fig: true }));
    return { s: `<g class="kit-objeto" data-objeto="${t}" data-prueba="si">${s}</g>`, b, figs };
  }

  function geometria(datos, estado = {}) {
    const d = datosDe(datos, estado), p = Math.round((estado && estado.paso) || 0);
    const H = d.alto > 0 ? d.alto : 240;
    const rot = [], objetos = [], flechas = [], figs = [], lineas = [];
    let s = '';
    if (d.piso) {
      const { y, x0 = M + 2, x1 = W - M - 2 } = d.piso;
      s += raya(x0, y, x1, y, 2);
      let r = '';
      for (let x = x0 + 4; x < x1 - 2; x += 10) r += `M${n(x)} ${n(y + 1)}L${n(x - 6)} ${n(y + 7)}`;
      s += `<path d="${r}" stroke="${ink}" stroke-width="1" stroke-opacity="0.5" fill="none"/>`;
      objetos.push(cajaDe('piso', x0 - 6, y - 1, x1, y + 8));
    }
    if (d.techo) {
      const { y, x0 = M + 2, x1 = W - M - 2 } = d.techo;
      s += raya(x0, y, x1, y, 2);
      let r = '';
      for (let x = x0 + 6; x < x1; x += 10) r += `M${n(x)} ${n(y - 1)}L${n(x - 6)} ${n(y - 7)}`;
      s += `<path d="${r}" stroke="${ink}" stroke-width="1" stroke-opacity="0.5" fill="none"/>`;
      objetos.push(cajaDe('techo', x0 - 6, y - 8, x1, y + 1));
    }
    for (const pa of d.paredes || []) {
      const l = pa.lado || -1;
      s += raya(pa.x, pa.y0, pa.x, pa.y1, 2);
      let r = '';
      for (let y = pa.y0 + 6; y < pa.y1; y += 10) r += `M${n(pa.x + l)} ${n(y)}L${n(pa.x + l * 7)} ${n(y - 6)}`;
      s += `<path d="${r}" stroke="${ink}" stroke-width="1" stroke-opacity="0.5" fill="none"/>`;
      objetos.push(cajaDe('pared', Math.min(pa.x, pa.x + l * 8), pa.y0 - 6, Math.max(pa.x, pa.x + l * 8), pa.y1));
    }
    for (const li of (d.lineas || []).filter(x => ve(x, p))) {
      s += `<path class="fis-guia" d="M${n(li.de[0])} ${n(li.de[1])}L${n(li.a[0])} ${n(li.a[1])}" stroke="${ink}" stroke-width="1.2" stroke-opacity="0.7"${li.discontinua === false ? '' : ' stroke-dasharray="5 4"'} fill="none"/>`;
    }
    for (const o of (d.objetos || []).filter(x => ve(x, p))) {
      const r = objeto(o, lineas);
      s += r.s;
      if (r.b) objetos.push(r.b);
      figs.push(...r.figs);
      for (const f of r.figs) objetos.push(f);
    }
    const libre = b => b.x0 >= M && b.x1 <= W - M && b.y0 >= M && b.y1 <= H - M && !rot.some(o => pisa(o, b)) && !figs.some(o => pisa(o, b));
    const yFijo = y => Math.min(H - M - TAM * 0.22 - 0.5, Math.max(M + TAM * 0.78 + 0.5, y));
    for (const tx of (d.textos || []).filter(x => ve(x, p))) rot.push(caja(tx.x, yFijo(tx.y), tx.texto, { ancla: tx.ancla, peso: tx.peso || 700, color: tx.color, tipo: 'texto' }));
    const fls = (d.flechas || []).filter(x => ve(x, p));
    for (const fl of fls) { const ux = Math.cos(rad(fl.ang)), uy = -Math.sin(rad(fl.ang)), L = fl.largo || 40; lineas.push([fl.de[0] + ux * 3, fl.de[1] + uy * 3, fl.de[0] + ux * (L - 2), fl.de[1] + uy * (L - 2)]); }
    const sinLinea = b => !lineas.some(([x1, y1, x2, y2]) => cruza(b, x1, y1, x2, y2));
    function poner(ax, ay, ux, uy, dist, texto, o = {}) {
      const w = T.ancho(String(texto).replace(/⃗|_/g, ''), TAM, 700), h = TAM, base = Math.atan2(uy, ux);
      let primero = null, sinRotulo = null;
      for (const da of [0, 30, -30, 60, -60, 90, -90, 120, -120, 150, -150, 180]) for (const dd of [dist, dist + 8, dist + 18]) {
        const a = base + rad(da), cx = Math.cos(a), cy = Math.sin(a), ext = Math.abs(cx) * w / 2 + Math.abs(cy) * h / 2;
        const b = centrado(ax + cx * (dd + ext), ay + cy * (dd + ext), texto, Object.assign({ peso: 700 }, o));
        if (!primero) primero = b;
        if (libre(b)) { if (sinLinea(b)) { rot.push(b); return b; } if (!sinRotulo) sinRotulo = b; }
      }
      const b = sinRotulo || primero; rot.push(b); return b;
    }
    // ángulos (arcos en tinta)
    for (const an of (d.angulos || []).filter(x => ve(x, p))) {
      const r = an.r || 26, [cx, cy] = an.c, de = an.de, a = an.a, tramo = a - de;
      const P1 = [cx + r * Math.cos(rad(de)), cy - r * Math.sin(rad(de))], P2 = [cx + r * Math.cos(rad(a)), cy - r * Math.sin(rad(a))];
      s += `<path class="fis-angulo" d="M${n(P1[0])} ${n(P1[1])}A${n(r)} ${n(r)} 0 ${tramo > 180 ? 1 : 0} 0 ${n(P2[0])} ${n(P2[1])}" fill="none" stroke="${col(an.color)}" stroke-width="1.8"/>`;
      if (an.texto) { const m = (de + a) / 2; poner(cx + r * Math.cos(rad(m)), cy - r * Math.sin(rad(m)), Math.cos(rad(m)), -Math.sin(rad(m)), 2, an.texto, { color: an.color, tipo: 'angulo' }); }
    }
    // cotas: una medida paralela al tramo, con topes
    for (const co of (d.cotas || []).filter(x => ve(x, p))) {
      const [x1, y1] = co.de, [x2, y2] = co.a, L = Math.hypot(x2 - x1, y2 - y1) || 1, l = co.lado || 1, sep = co.sep === undefined ? 12 : co.sep;
      const nx = -(y2 - y1) / L * l, ny = (x2 - x1) / L * l, q1 = [x1 + nx * sep, y1 + ny * sep], q2 = [x2 + nx * sep, y2 + ny * sep], c = col(co.color);
      s += `<path class="fis-cota" d="M${n(q1[0])} ${n(q1[1])}L${n(q2[0])} ${n(q2[1])}M${n(q1[0] - nx * 5)} ${n(q1[1] - ny * 5)}L${n(q1[0] + nx * 5)} ${n(q1[1] + ny * 5)}M${n(q2[0] - nx * 5)} ${n(q2[1] - ny * 5)}L${n(q2[0] + nx * 5)} ${n(q2[1] + ny * 5)}" stroke="${c}" stroke-width="1.5" fill="none"/>`;
      if (co.texto) poner((q1[0] + q2[0]) / 2, (q1[1] + q2[1]) / 2, nx, ny, 3, co.texto, { color: co.color, tipo: 'cota' });
    }
    // las flechas de las fuerzas
    for (const fl of fls) {
      const ux = Math.cos(rad(fl.ang)), uy = -Math.sin(rad(fl.ang)), L = fl.largo || 40, [x1, y1] = fl.de, x2 = x1 + ux * L, y2 = y1 + uy * L, c = fl.color || 'o';
      if (fl.discontinua) s += `<g class="fis-fuerza"><path d="M${n(x1)} ${n(y1)}L${n(x2 - ux * 9)} ${n(y2 - uy * 9)}" stroke="${col(c)}" stroke-width="3" stroke-dasharray="5 4" fill="none"/>${T.flecha(x2 - ux * 11, y2 - uy * 11, x2, y2, { color: c === 'tinta' ? undefined : c, grosor: 3 })}</g>`;
      else s += T.flecha(x1, y1, x2, y2, { color: c === 'tinta' ? undefined : c, grosor: 3, clase: 'fis-fuerza' });
      flechas.push({ x1, y1, x2, y2, color: c, ux, uy, L });
      if (fl.texto) {
        const lado = fl.lado === undefined ? 0 : fl.lado;
        let bx = lado ? -uy * lado : ux, by = lado ? ux * lado : uy;
        // rumbo: hacia dónde prefiere ir el rótulo desde la punta ([dx, dy] en pantalla), para que dos flechas paralelas
        // y cercanas pongan sus rótulos hacia afuera.
        if (Array.isArray(fl.rumbo)) { bx = fl.rumbo[0]; by = fl.rumbo[1]; }
        poner(lado ? (x1 + x2) / 2 : x2, lado ? (y1 + y2) / 2 : y2, bx, by, 3, fl.texto, { color: fl.texto.includes('?') ? undefined : (c === 'tinta' ? undefined : c), tipo: 'flecha' });
      }
    }
    return { W, M, H, s, rotulos: rot, objetos, flechas };
  }

  const SUB = /([A-Za-zμτθ])_([A-Za-z0-9]{1,3})/g;
  function conSubindices(t) {
    SUB.lastIndex = 0;
    if (!SUB.test(t)) { SUB.lastIndex = 0; return null; }
    SUB.lastIndex = 0;
    let out = '', k = 0, abajo = false;
    t.replace(SUB, (mm, l, sb, i) => {
      const antes = T.esc(t.slice(k, i) + l);
      out += abajo ? `<tspan dy="-.252em">${antes}</tspan>` : antes;
      out += `<tspan font-size="72%" dy=".35em">${T.esc(sb)}</tspan>`;
      abajo = true; k = i + mm.length; return mm;
    });
    const resto = t.slice(k);
    if (resto) out += `<tspan dy="-.252em">${T.esc(resto)}</tspan>`;
    return out;
  }
  function pintaRotulo(b) {
    const VEC = '⃗', limpio = b.texto.split(VEC).join('');
    let s = T.rotulo(b.x, b.y, limpio, { ancla: b.ancla, tam: b.tam, peso: b.peso, color: b.color, min: -1e4, max: 1e4 })
      .replace('<text', '<text stroke="var(--card)" stroke-width="4" stroke-linejoin="round" paint-order="stroke"');
    const sub = conSubindices(limpio);
    if (sub !== null) s = s.replace(/>[^<]*<\/text>$/, `>${sub}</text>`);
    if (b.texto.includes(VEC)) {
      const w = T.ancho(limpio.replace(/_/g, ''), b.tam, b.peso), x0 = b.ancla === 'middle' ? b.x - w / 2 : b.ancla === 'end' ? b.x - w : b.x;
      let i = 0;
      for (const parte of b.texto.split(VEC).slice(0, -1)) {
        i += parte.length;
        const antes = limpio.slice(0, i).replace(/_/g, ''), letra = limpio.slice(i - 1, i);
        const xa = x0 + T.ancho(antes.slice(0, -1), b.tam, b.peso), wl = T.ancho(letra, b.tam, b.peso), y = b.y - b.tam * 0.78;
        const c = b.color ? `var(--c-${b.color})` : 'currentColor';
        s += `<path d="M${n(xa + 1)} ${n(y)}H${n(xa + wl)}M${n(xa + wl - 3)} ${n(y - 2.5)}L${n(xa + wl)} ${n(y)}L${n(xa + wl - 3)} ${n(y + 2.5)}" stroke="${c}" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
      }
    }
    return s;
  }
  function dibujar(datos, estado = {}) {
    const g = geometria(datos, estado);
    return T.svg(W, g.H, `<g data-prueba="si">${g.s}${g.rotulos.map(pintaRotulo).join('')}</g>`, { alt: alt(datos, estado) });
  }
  function alt(datos, estado = {}) {
    const d = datosDe(datos, estado);
    if (d.alt) return d.alt;
    const NOM = { caja: 'una caja', costal: 'un costal', ropero: 'un ropero', letrero: 'un letrero colgado', bolsa: 'una bolsa', balde: 'un balde',
      balanza: 'una balanza de piso', persona: 'una persona', resorte: 'un resorte', polea: 'una polea', rampa: 'una rampa', barra: 'una barra',
      caballete: 'un caballete', escalera: 'una escalera', escoba: 'una escoba', llave: 'una llave de tuercas', gancho: 'una balanza de resorte',
      carrito: 'un carrito', ascensor: 'un ascensor', auto: 'un auto', pista: 'un tramo de pista curva', disco: 'una plataforma que gira', pelota: 'una pelota' };
    const cs = [...new Set((d.objetos || []).map(o => NOM[o.tipo]).filter(Boolean))];
    const k = (d.flechas || []).length;
    return `Figura con ${cs.join(', ') || 'un cuerpo'}${k ? ` y ${k} ${k === 1 ? 'fuerza dibujada' : 'fuerzas dibujadas'}` : ''}.`;
  }

  return { id: 'fis-estatica', dibujar, alt, geometria, constantes: { W, M } };
});
