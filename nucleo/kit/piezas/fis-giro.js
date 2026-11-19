/*
 * Pieza «fis-giro» (19 nov 2026, «Movimiento circular», fase 3; docs/etapa5/propuesta-fisica.md §2): cosas que giran
 * alrededor de un eje, vistas como se ven en la vida (la rueda de la fortuna de la feria, el carrusel de la plaza visto
 * desde arriba, el ventilador del aula visto desde abajo, la moto en el óvalo, poleas con faja, el plato y el piñón con su
 * cadena, la llanta que rueda, la Tierra con un paralelo y el reloj de la plaza). Todo es dibujo de prueba (data-prueba):
 * Gerson decide después cuáles reemplaza (docs/plan-calidad.md, M4).
 *
 * Afirmación de la figura (≤ 25 palabras): todo lo que va sobre el mismo cuerpo gira el mismo ángulo; el camino de cada
 * punto es un arco, más largo cuanto más lejos del eje.
 *
 * Coordenadas en píxeles del lienzo (ancho 320); los ángulos, en grados, como en trigonometría: 0° a la derecha y el
 * giro positivo contra las agujas del reloj (el y de la pantalla crece hacia abajo: y = cy − r·sen a). Función pura de
 * (datos, estado): sin ids, sin azar, sin reloj. Solo currentColor y var(--c-*). geometria(datos, estado) devuelve las
 * cajas de los rótulos y de los objetos y los extremos de las flechas, para las pruebas de encuadre y de choques
 * (fis-giro.test.js).
 *
 * datos = {
 *   alto: 240,                         px del lienzo
 *   cuerpos: [{ tipo, c: [x, y], R, giro, cabinas, dientes, latitud, agujas, piso }]
 *     tipo: 'rueda' (de la fortuna, con su soporte y `cabinas` tenues) | 'carrusel' (desde arriba) | 'ventilador'
 *           (desde abajo, tres aspas; la primera, pintada) | 'pista' (el óvalo, desde arriba) | 'disco' | 'polea' |
 *           'engranaje' (con `dientes`) | 'llanta' (de bicicleta; piso: true la apoya en el suelo) | 'tierra' (con el
 *           paralelo de `latitud` grados) | 'reloj' (con `agujas: [{ ang, f }]`)
 *     giro: grados que giró el dibujo (rayos, aspas, cabinas)
 *   correas: [{ de: 0, a: 1, tipo: 'faja' | 'cadena' }]       las dos tangentes de afuera entre dos cuerpos
 *   puntos: [{ en, ang, f, tipo: 'cabina' | 'caballo' | 'moto' | 'punto', texto, lado, tenue }]   f: fracción de R
 *   arcos:  [{ en, de, a, f, tipo: 'camino' | 'angulo', rpx, color, texto, discontinuo }]   de «de» a «a» (a > de)
 *   radios: [{ en, ang, f, texto, lado, color, discontinuo }]  del eje al punto
 *   flechas: [{ en, ang, f, dir: 'tangente' | 'centro' | 'afuera' | [dx, dy], largo, color, texto, abierta, sentido,
 *               discontinua, desde: [x, y] }]   la velocidad (naranja, punta llena) o la aceleración (carmín, abierta)
 *   sentido: [{ en, f, de, a, horario }]          una flecha curva que dice hacia dónde gira
 *   reloj: { x, y, frac, texto }                  el cronómetro (turquesa) con su aguja y su rótulo
 *   textos: [{ x, y, texto, color, ancla, peso }]
 *   cortes: [{ … }, …]                            para «Mira»: estado.corte elige qué se agrega a los datos
 *   alt
 * }
 * Rótulos (19 nov): «a_c» se dibuja con la c como subíndice (<tspan>) y «v⃗» con una flechita trazada sobre la letra (la
 * U+20D7 no está en todas las fuentes del celular); cada rótulo lleva un halo del color de la tarjeta. Los textos fijos y
 * el cronómetro se ponen primero; los demás rótulos (radios, arcos, puntos, flechas) prueban su lado preferido y, si se
 * salen del lienzo o pisan otro rótulo o una figura chica, giran alrededor de su ancla hasta encontrar un sitio libre.
 * Un arco con «?» se dibuja punteado. La prueba numérica de encuadre está en fis-giro.test.js y, figura por figura, en
 * contenido/teoria/fisica/movimiento-circular.test.js.
 * Marcas con clase, para que la unidad compruebe que lo que nombra su leyenda se dibuja: fis-camino (el arco recorrido),
 * fis-angulo (el arco del ángulo), fis-radio, fis-vel (flecha de velocidad), fis-acel (flecha de aceleración),
 * fis-reloj, fis-correa.
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

  function caja(x, y, texto, o = {}) {
    const tam = o.tam || TAM, peso = o.peso || 400, ancla = o.ancla || 'start';
    // El ancho es el del texto como se ve: sin la flecha de vector ni el «_» del subíndice (que se dibuja más chico).
    const visto = String(texto).replace(/\u20d7|_/g, '');
    const w = T.ancho(visto, tam, peso), xx = T.encajar(x, visto, ancla, { tam, peso, min: M, max: W - M });
    const izq = ancla === 'middle' ? xx - w / 2 : ancla === 'end' ? xx - w : xx;
    return { x0: izq, x1: izq + w, y0: y - tam * 0.78, y1: y + tam * 0.22, texto: String(texto), x: xx, y, ancla, tam, peso, color: o.color, tipo: o.tipo || 'rotulo' };
  }
  // caja() ya dejó el rótulo dentro del lienzo: pinta() no lo vuelve a mover.
  const pinta = b => T.rotulo(b.x, b.y, b.texto, { ancla: b.ancla, tam: b.tam, peso: b.peso, color: b.color, min: -1e4, max: 1e4 });
  // Rótulo centrado en (x, y) (el centro de su caja, no la línea base).
  const centrado = (x, y, texto, o = {}) => caja(x, y + (o.tam || TAM) * 0.28, texto, Object.assign({ ancla: 'middle' }, o));

  function datosDe(datos, estado) {
    const d = datos || {};
    if (!Array.isArray(d.cortes) || !d.cortes.length) return d;
    const k = lim(Math.round((estado && estado.corte) || 0), 0, d.cortes.length - 1);
    return Object.assign({}, d, d.cortes[k]);
  }
  // El punto a una fracción f del radio, con el ángulo a.
  const en = (cu, a, f = 1) => [cu.c[0] + f * cu.R * Math.cos(rad(a)), cu.c[1] - f * cu.R * Math.sin(rad(a))];
  // Arco de circunferencia (centro, radio en px) de «de» a «a», contra las agujas del reloj.
  function arco(c, r, de, a) {
    const tramo = a - de;
    if (tramo >= 359.999) return `M${n(c[0] + r)} ${n(c[1])}A${n(r)} ${n(r)} 0 1 0 ${n(c[0] - r)} ${n(c[1])}A${n(r)} ${n(r)} 0 1 0 ${n(c[0] + r)} ${n(c[1])}`;
    const p = [c[0] + r * Math.cos(rad(de)), c[1] - r * Math.sin(rad(de))], q = [c[0] + r * Math.cos(rad(a)), c[1] - r * Math.sin(rad(a))];
    return `M${n(p[0])} ${n(p[1])}A${n(r)} ${n(r)} 0 ${tramo > 180 ? 1 : 0} 0 ${n(q[0])} ${n(q[1])}`;
  }
  // Flecha de punta abierta (la aceleración, como en MRUV): la línea y dos trazos.
  function abierta(x1, y1, x2, y2, c, g = 2.5, clase = '', disc = false) {
    const ang = Math.atan2(y2 - y1, x2 - x1), L = 9, s = 0.5;
    const a1 = [x2 - L * Math.cos(ang - s), y2 - L * Math.sin(ang - s)], a2 = [x2 - L * Math.cos(ang + s), y2 - L * Math.sin(ang + s)];
    return `<g class="${clase}"><path d="M${n(x1)} ${n(y1)}L${n(x2)} ${n(y2)}" stroke="${col(c)}" stroke-width="${g}" stroke-linecap="round"${disc ? ' stroke-dasharray="5 4"' : ''} fill="none"/>`
      + `<path d="M${n(a1[0])} ${n(a1[1])}L${n(x2)} ${n(y2)}L${n(a2[0])} ${n(a2[1])}" stroke="${col(c)}" stroke-width="${g}" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>`;
  }
  function llena(x1, y1, x2, y2, c, g = 3, clase = '', disc = false) {
    if (!disc) return T.flecha(x1, y1, x2, y2, { color: c, grosor: g, clase });
    // discontinua: el tronco a trazos y la punta llena al final
    const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / (L || 1), uy = (y2 - y1) / (L || 1);
    return `<g class="${clase}"><path d="M${n(x1)} ${n(y1)}L${n(x2 - ux * 8)} ${n(y2 - uy * 8)}" stroke="${col(c)}" stroke-width="${g}" stroke-dasharray="5 4" fill="none"/>`
      + T.flecha(x2 - ux * 10, y2 - uy * 10, x2, y2, { color: c, grosor: g }) + '</g>';
  }

  // ---- los cuerpos ----
  function cuerpo(cu) {
    const [cx, cy] = cu.c, R = cu.R, g = cu.giro || 0, ink = 'currentColor';
    let s = '', caja0 = { nombre: cu.tipo, x0: cx - R, x1: cx + R, y0: cy - R, y1: cy + R };
    const rayos = (k, f0, f1, ancho = 1.4) => {
      let r = '';
      for (let i = 0; i < k; i++) { const a = g + i * 360 / k, p = en(cu, a, f0), q = en(cu, a, f1); r += `M${n(p[0])} ${n(p[1])}L${n(q[0])} ${n(q[1])}`; }
      return `<path d="${r}" stroke="${ink}" stroke-width="${ancho}" fill="none"/>`;
    };
    if (cu.tipo === 'rueda') {
      // la rueda de la fortuna: el aro, ocho rayos, el soporte en A hasta el piso y cabinas tenues colgando del borde
      const base = cy + R + 18;
      s += `<path d="M${n(cx)} ${n(cy)}L${n(cx - 0.62 * R)} ${n(base)}M${n(cx)} ${n(cy)}L${n(cx + 0.62 * R)} ${n(base)}" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`
        + `<path d="M${n(cx - 0.9 * R)} ${n(base)}H${n(cx + 0.9 * R)}" stroke="${ink}" stroke-width="2" stroke-linecap="round"/>`
        + `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(R)}" fill="none" stroke="${ink}" stroke-width="2.5"/>`
        + `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(R * 0.82)}" fill="none" stroke="${ink}" stroke-width="1" stroke-opacity="0.6"/>`
        + `<g stroke-opacity="0.55">${rayos(8, 0, 1)}</g><circle cx="${n(cx)}" cy="${n(cy)}" r="5" fill="var(--card)" stroke="${ink}" stroke-width="2"/>`;
      const k = cu.cabinas || 0;
      for (let i = 0; i < k; i++) s += cabina(en(cu, g + 270 + i * 360 / k), true);
      caja0 = { nombre: 'rueda', x0: cx - 0.9 * R, x1: cx + R, y0: cy - R, y1: base };
      caja0.x0 = Math.min(cx - R, caja0.x0);
      if (k) { caja0.y0 = cy - R; caja0.y1 = Math.max(base, cy + R + 22); caja0.x0 -= 8; caja0.x1 += 8; }
    } else if (cu.tipo === 'carrusel') {
      s += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(R)}" fill="${ink}" fill-opacity="0.06" stroke="${ink}" stroke-width="2.5"/>`
        + `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(R * 0.22)}" fill="${ink}" fill-opacity="0.12" stroke="${ink}" stroke-width="1.5"/>`
        + `<g stroke-opacity="0.35">${rayos(8, 0.22, 1, 1)}</g><circle cx="${n(cx)}" cy="${n(cy)}" r="3" fill="${ink}"/>`;
    } else if (cu.tipo === 'ventilador') {
      s += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(R)}" fill="none" stroke="${ink}" stroke-width="1" stroke-dasharray="3 5" stroke-opacity="0.5"/>`;
      for (let i = 0; i < 3; i++) s += aspa(cu, g + i * 120, i === 0);
      s += `<circle cx="${n(cx)}" cy="${n(cy)}" r="10" fill="var(--card)" stroke="${ink}" stroke-width="2"/><circle cx="${n(cx)}" cy="${n(cy)}" r="3" fill="${ink}"/>`;
    } else if (cu.tipo === 'pista') {
      const a = R + 10, b = R - 10;
      s += `<path d="${arco([cx, cy], a, 0, 360)}${arco([cx, cy], b, 0, 360)}" fill="${ink}" fill-opacity="0.08" fill-rule="evenodd" stroke="${ink}" stroke-width="2"/>`
        + `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(R)}" fill="none" stroke="${ink}" stroke-width="1" stroke-dasharray="6 6" stroke-opacity="0.5"/>`
        + `<circle cx="${n(cx)}" cy="${n(cy)}" r="2.5" fill="${ink}"/>`;
      caja0 = { nombre: 'pista', x0: cx - a, x1: cx + a, y0: cy - a, y1: cy + a };
    } else if (cu.tipo === 'engranaje') {
      const k = cu.dientes || Math.max(8, Math.round(R / 4)), h = 5;
      let p = '';
      for (let i = 0; i < k; i++) {
        const a0 = g + i * 360 / k, w = 360 / k * 0.25;
        const q = [en(cu, a0 - w, 1), en(cu, a0 - w * 0.7, 1 + h / R), en(cu, a0 + w * 0.7, 1 + h / R), en(cu, a0 + w, 1)];
        p += `M${n(q[0][0])} ${n(q[0][1])}L${n(q[1][0])} ${n(q[1][1])}L${n(q[2][0])} ${n(q[2][1])}L${n(q[3][0])} ${n(q[3][1])}`;
      }
      s += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(R)}" fill="${ink}" fill-opacity="0.08" stroke="${ink}" stroke-width="2"/>`
        + `<path d="${p}" fill="none" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/>`
        + `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(Math.min(6, R * 0.3))}" fill="var(--card)" stroke="${ink}" stroke-width="2"/>`;
      caja0 = { nombre: 'engranaje', x0: cx - R - h, x1: cx + R + h, y0: cy - R - h, y1: cy + R + h };
    } else if (cu.tipo === 'llanta') {
      s += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(R)}" fill="none" stroke="${ink}" stroke-width="4"/>`
        + `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(R - 4)}" fill="none" stroke="${ink}" stroke-width="1"/>` + rayos(12, 0, 0.92, 0.9)
        + `<circle cx="${n(cx)}" cy="${n(cy)}" r="4" fill="var(--card)" stroke="${ink}" stroke-width="2"/>`;
      if (cu.piso) s += `<path d="M${M + 2} ${n(cy + R + 2)}H${W - M - 2}" stroke="${ink}" stroke-width="2" stroke-linecap="round"/>`;
      caja0 = { nombre: 'llanta', x0: cx - R - 2, x1: cx + R + 2, y0: cy - R - 2, y1: cy + R + 2 };
    } else if (cu.tipo === 'tierra') {
      const lat = cu.latitud || 0, yl = cy - R * Math.sin(rad(lat)), xr = R * Math.cos(rad(lat));
      s += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(R)}" fill="${ink}" fill-opacity="0.06" stroke="${ink}" stroke-width="2"/>`
        + `<path d="M${n(cx)} ${n(cy - R - 14)}V${n(cy + R + 14)}" stroke="${ink}" stroke-width="1.5" stroke-dasharray="6 4"/>`
        + `<path d="M${n(cx - R)} ${n(cy)}H${n(cx + R)}" stroke="${ink}" stroke-width="1" stroke-opacity="0.5" stroke-dasharray="3 4"/>`
        + (lat ? `<path d="M${n(cx - xr)} ${n(yl)}H${n(cx + xr)}" stroke="${ink}" stroke-width="1.5"/>` : '');
      caja0 = { nombre: 'tierra', x0: cx - R, x1: cx + R, y0: cy - R - 14, y1: cy + R + 14 };
    } else if (cu.tipo === 'reloj') {
      s += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(R)}" fill="var(--card)" stroke="${ink}" stroke-width="3"/>`;
      let mk = '';
      for (let i = 0; i < 12; i++) { const a = 90 - i * 30, p = en(cu, a, i % 3 ? 0.88 : 0.8), q = en(cu, a, 0.96); mk += `M${n(p[0])} ${n(p[1])}L${n(q[0])} ${n(q[1])}`; }
      s += `<path d="${mk}" stroke="${ink}" stroke-width="1.5"/>`;
      for (const ag of cu.agujas || []) { const q = en(cu, ag.ang, ag.f || 0.8); s += `<path d="M${n(cx)} ${n(cy)}L${n(q[0])} ${n(q[1])}" stroke="${ink}" stroke-width="${ag.grosor || 3}" stroke-linecap="round"/>`; }
      s += `<circle cx="${n(cx)}" cy="${n(cy)}" r="3.5" fill="${ink}"/>`;
    } else {
      // disco o polea: el borde, el eje y tres rayos
      s += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(R)}" fill="${ink}" fill-opacity="0.07" stroke="${ink}" stroke-width="2.5"/>`
        + (cu.tipo === 'polea' ? `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(R - 4)}" fill="none" stroke="${ink}" stroke-width="1"/>` : '')
        + `<g stroke-opacity="0.5">${rayos(3, 0.15, 0.85, 1.2)}</g><circle cx="${n(cx)}" cy="${n(cy)}" r="4" fill="var(--card)" stroke="${ink}" stroke-width="2"/>`;
    }
    return { s: `<g class="kit-objeto" data-objeto="${cu.tipo}" data-prueba="si">${s}</g>`, caja: caja0 };
  }
  // Una cabina que cuelga del punto p del aro (siempre derecha).
  function cabina(p, tenue, lleno) {
    const op = tenue ? ' stroke-opacity="0.4"' : '', x = p[0], y = p[1];
    return `<path d="M${n(x)} ${n(y)}V${n(y + 5)}" stroke="currentColor" stroke-width="1.5"${op}/>`
      + `<rect x="${n(x - 7)}" y="${n(y + 5)}" width="14" height="11" rx="3" fill="${lleno ? 'currentColor' : 'var(--card)'}"${lleno ? ' fill-opacity="0.45"' : ''} stroke="currentColor" stroke-width="${tenue ? 1.3 : 2}"${op}/>`;
  }
  function aspa(cu, a, marcada) {
    const p0 = en(cu, a, 0.18), p1 = en(cu, a, 0.96), nx = -Math.sin(rad(a)), ny = -Math.cos(rad(a)), w = 7;
    const q = (p, k) => `${n(p[0] + nx * k)} ${n(p[1] + ny * k)}`;
    const d = `M${q(p0, -4)}L${q(p1, -w)}Q${n(p1[0] + (p1[0] - cu.c[0]) * 0.06)} ${n(p1[1] + (p1[1] - cu.c[1]) * 0.06)} ${q(p1, w)}L${q(p0, 4)}Z`;
    return `<path d="${d}" fill="${marcada ? 'currentColor' : 'var(--card)'}"${marcada ? ' fill-opacity="0.45"' : ''} stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`;
  }
  // Un caballo del carrusel o la moto del óvalo, vistos desde arriba y mirando hacia donde gira.
  function figura(tipo, p, a, sentido, tenue) {
    const op = tenue ? ' stroke-opacity="0.35"' : '', ang = -(a + 90 * sentido), x = p[0], y = p[1];
    if (tipo === 'moto') return `<g transform="rotate(${n(ang)} ${n(x)} ${n(y)})"${op ? ' opacity="0.45"' : ''}><rect x="${n(x - 9)}" y="${n(y - 3.5)}" width="18" height="7" rx="3" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`
      + `<path d="M${n(x + 4)} ${n(y - 6)}V${n(y + 6)}" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="${n(x - 2)}" cy="${n(y)}" r="2.5" fill="currentColor"/></g>`;
    if (tipo === 'caballo') return `<g transform="rotate(${n(ang)} ${n(x)} ${n(y)})"${op ? ' opacity="0.45"' : ''}><ellipse cx="${n(x - 1)}" cy="${n(y)}" rx="8" ry="4.5" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`
      + `<circle cx="${n(x + 8)}" cy="${n(y)}" r="3.2" fill="var(--card)" stroke="currentColor" stroke-width="1.8"/><circle cx="${n(x - 1)}" cy="${n(y)}" r="1.6" fill="currentColor"/></g>`;
    return `<circle cx="${n(x)}" cy="${n(y)}" r="${tenue ? 3.5 : 5}" fill="${tenue ? 'none' : 'currentColor'}" stroke="currentColor" stroke-width="1.5"${op}/>`;
  }
  const RADIO_FIG = { moto: 10, caballo: 11, cabina: 9, punto: 5 };

  const pisa = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
  // ¿El segmento cruza la caja (achicada 1 px)? Recorte de Liang-Barsky.
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
  // Dirección de una flecha (unitaria, en pantalla), la misma que usa geometria() al dibujarla.
  function dirFlecha(fl) {
    if (Array.isArray(fl.dir)) { const L = Math.hypot(fl.dir[0], fl.dir[1]) || 1; return [fl.dir[0] / L, fl.dir[1] / L]; }
    if (fl.dir === 'centro' || fl.dir === 'afuera') { const sg = fl.dir === 'centro' ? -1 : 1; return [sg * Math.cos(rad(fl.ang)), -sg * Math.sin(rad(fl.ang))]; }
    const sg = fl.horario ? -1 : 1; return [-sg * Math.sin(rad(fl.ang)), -sg * Math.cos(rad(fl.ang))];
  }
  function lineasDe(d, cs) {
    const out = [];
    for (const cu of cs) if (cu.tipo === 'rueda') {
      const base = cu.c[1] + cu.R + 18;
      out.push([cu.c[0], cu.c[1] + cu.R * 0.3, cu.c[0] - 0.62 * cu.R, base], [cu.c[0], cu.c[1] + cu.R * 0.3, cu.c[0] + 0.62 * cu.R, base]);
    }
    for (const se of d.sentido || []) {
      const cu = cs[se.en || 0]; if (!cu) continue;
      const r = (se.f || 1.16) * cu.R, de = se.de === undefined ? 20 : se.de, a = se.a === undefined ? 70 : se.a, k = 8;
      for (let i = 0; i < k; i++) { const u = de + (a - de) * i / k, v = de + (a - de) * (i + 1) / k; out.push([cu.c[0] + r * Math.cos(rad(u)), cu.c[1] - r * Math.sin(rad(u)), cu.c[0] + r * Math.cos(rad(v)), cu.c[1] - r * Math.sin(rad(v))]); }
    }
    for (const fl of d.flechas || []) {
      const cu = cs[fl.en || 0], q = fl.desde ? fl.desde : cu ? en(cu, fl.ang, fl.f === undefined ? 1 : fl.f) : null;
      if (!q) continue;
      const [ux, uy] = dirFlecha(fl), L = fl.largo || 40;
      out.push([q[0] + ux * 2, q[1] + uy * 2, q[0] + ux * (L - 2), q[1] + uy * (L - 2)]);
    }
    return out;
  }
  function geometria(datos, estado = {}) {
    const d = datosDe(datos, estado);
    const H = d.alto > 0 ? d.alto : 240;
    const cs = Array.isArray(d.cuerpos) ? d.cuerpos : [];
    const rot = [], objetos = [], flechas = [], pts = [], figs = [];
    let fondo = '', s = '';
    // Los rótulos buscan su lugar (19 nov): primero los fijos (textos y el cronómetro); después cada rótulo pegado a lo
    // que nombra prueba su lado preferido y, si se sale del lienzo o pisa otro rótulo o una figura chica (caballo, moto,
    // cabina, punto), gira alrededor de su ancla hasta encontrar un sitio libre.
    const libre = b => b.x0 >= M && b.x1 <= W - M && b.y0 >= M && b.y1 <= H - M && !rot.some(o => pisa(o, b)) && !figs.some(o => pisa(o, b));
    // Líneas que un rótulo evita si puede (lector en frío, 19 nov: la «s» del arco sobre la pata del soporte, la «v»
    // sobre la flecha curva del giro, rótulos sobre el tronco de otra flecha): las patas de la rueda de la fortuna, las
    // flechas curvas del sentido de giro y los troncos de las flechas. Primero se busca un sitio libre de rótulos,
    // figuras y líneas; si no hay, uno libre de rótulos y figuras, como antes.
    const lineas = lineasDe(d, cs);
    // y los bordes de los cuerpos (lector B: «6 m/s» y «a_T» encima del borde del disco), salvo el reloj y la Tierra.
    const bordes = cs.filter(cu => !['reloj', 'tierra'].includes(cu.tipo)).flatMap(cu => (cu.tipo === 'pista' ? [cu.R - 10, cu.R + 10] : [cu.R]).map(R => [cu.c[0], cu.c[1], R]));
    const tocaBorde = (b, [cx, cy, R]) => {
      const dx = Math.max(b.x0 + 1 - cx, 0, cx - b.x1 + 1), dy = Math.max(b.y0 + 1 - cy, 0, cy - b.y1 + 1);
      const lejos = Math.max(...[[b.x0, b.y0], [b.x1, b.y0], [b.x0, b.y1], [b.x1, b.y1]].map(([x, y]) => Math.hypot(x - cx, y - cy)));
      return Math.hypot(dx, dy) < R && lejos > R;
    };
    const sinLinea = b => !lineas.some(([x1, y1, x2, y2]) => cruza(b, x1, y1, x2, y2)) && !bordes.some(c => tocaBorde(b, c));
    function poner(ax, ay, ux, uy, dist, texto, o = {}) {
      const w = T.ancho(String(texto).replace(/⃗|_/g, ''), TAM, 700), h = TAM, base = Math.atan2(uy, ux);
      let primero = null, sinRotulo = null;
      for (const da of [0, 25, -25, 50, -50, 80, -80, 115, -115, 150, -150, 180]) for (const dd of [dist, dist + 8, dist + 18]) {
        const a = base + rad(da), cx = Math.cos(a), cy = Math.sin(a), ext = Math.abs(cx) * w / 2 + Math.abs(cy) * h / 2;
        const b = centrado(ax + cx * (dd + ext), ay + cy * (dd + ext), texto, Object.assign({ peso: 700 }, o));
        if (!primero) primero = b;
        if (libre(b)) { if (sinLinea(b)) { rot.push(b); return b; } if (!sinRotulo) sinRotulo = b; }
      }
      const b = sinRotulo || primero; rot.push(b); return b;
    }
    // las correas van debajo de las ruedas
    for (const co of d.correas || []) {
      const A = cs[co.de], B = cs[co.a];
      if (!A || !B) continue;
      const dx = B.c[0] - A.c[0], dy = B.c[1] - A.c[1], dd = Math.hypot(dx, dy), be = Math.atan2(dy, dx), ga = Math.acos(lim((A.R - B.R) / dd, -1, 1));
      const ex = cu => (cu.tipo === 'engranaje' ? 3 : 1.5);
      const p = (cu, t) => [cu.c[0] + (cu.R + ex(cu)) * Math.cos(t), cu.c[1] + (cu.R + ex(cu)) * Math.sin(t)];
      const a1 = p(A, be + ga), b1 = p(B, be + ga), a2 = p(A, be - ga), b2 = p(B, be - ga);
      const est = co.tipo === 'cadena' ? ' stroke-width="3" stroke-dasharray="4 3"' : ' stroke-width="3"';
      fondo += `<path class="fis-correa" d="M${n(a1[0])} ${n(a1[1])}L${n(b1[0])} ${n(b1[1])}M${n(a2[0])} ${n(a2[1])}L${n(b2[0])} ${n(b2[1])}" stroke="currentColor" fill="none"${est} stroke-linecap="round"/>`;
    }
    for (const cu of cs) { const o = cuerpo(cu); s += o.s; objetos.push(o.caja); }
    // rótulos fijos: el cronómetro y los textos
    if (d.reloj) {
      const { x, y } = d.reloj;
      objetos.push({ nombre: 'reloj', x0: x - 13, x1: x + 13, y0: y - 19, y1: y + 13 });
      figs.push({ x0: x - 13, x1: x + 13, y0: y - 19, y1: y + 13 });
      if (d.reloj.texto) rot.push(caja(x + 19, y + 5, d.reloj.texto, { peso: 700, color: 'i', tipo: 'reloj' }));
    }
    // Un texto fijo no se sale por arriba ni por abajo: su línea base se encaja en el alto del lienzo.
    const yFijo = y => Math.min(H - M - TAM * 0.22 - 0.5, Math.max(M + TAM * 0.78 + 0.5, y));
    for (const tx of d.textos || []) rot.push(caja(tx.x, yFijo(tx.y), tx.texto, { ancla: tx.ancla, peso: tx.peso || 700, color: tx.color, tipo: 'texto' }));
    // las figuras chicas de los puntos (para que ningún rótulo las pise)
    const PT = (d.puntos || []).map(p => {
      const cu = cs[p.en || 0]; if (!cu) return null;
      const q = en(cu, p.ang, p.f === undefined ? 1 : p.f), tipo = p.tipo || 'punto';
      const caj = tipo === 'cabina' ? { nombre: 'cabina', x0: q[0] - 8, x1: q[0] + 8, y0: q[1] - 1, y1: q[1] + 17, fig: true }
        : { nombre: tipo, x0: q[0] - (RADIO_FIG[tipo] || 5), x1: q[0] + (RADIO_FIG[tipo] || 5), y0: q[1] - (RADIO_FIG[tipo] || 5), y1: q[1] + (RADIO_FIG[tipo] || 5), fig: true };
      figs.push(caj);
      return { p, cu, q, tipo, caj };
    });
    // radios (debajo de los puntos)
    for (const ra of d.radios || []) {
      const cu = cs[ra.en || 0]; if (!cu) continue;
      const q = en(cu, ra.ang, ra.f === undefined ? 1 : ra.f), c = col(ra.color);
      s += `<path class="fis-radio" d="M${n(cu.c[0])} ${n(cu.c[1])}L${n(q[0])} ${n(q[1])}" stroke="${c}" stroke-width="2"${ra.discontinuo ? ' stroke-dasharray="5 4"' : ''} stroke-linecap="round"/>`;
      if (ra.texto) {
        const mx = (cu.c[0] + q[0]) / 2, my = (cu.c[1] + q[1]) / 2, l = ra.lado || 1;
        poner(mx, my, -Math.sin(rad(ra.ang)) * l, -Math.cos(rad(ra.ang)) * l, 4, ra.texto, { color: ra.color, tipo: 'radio' });
      }
    }
    // arcos: el camino recorrido (sobre el borde) y el arco del ángulo (cerca del eje)
    for (const ar of d.arcos || []) {
      const cu = cs[ar.en || 0]; if (!cu) continue;
      const esAng = ar.tipo === 'angulo', r = esAng ? (ar.rpx || 22) : (ar.f === undefined ? 1 : ar.f) * cu.R, c = col(ar.color === undefined ? 'f' : ar.color);
      if (ar.a - ar.de > 0.01) s += `<path class="${esAng ? 'fis-angulo' : 'fis-camino'}" d="${arco(cu.c, r, ar.de, ar.a)}" fill="none" stroke="${c}" stroke-width="${esAng ? 2 : 5}" stroke-linecap="round"${ar.discontinuo || ar.texto === '?' ? ' stroke-dasharray="6 5"' : ''} stroke-opacity="${esAng ? 1 : 0.85}"/>`;
      if (ar.texto) {
        const m = ar.medio === undefined ? (ar.de + ar.a) / 2 : ar.medio, ux = Math.cos(rad(m)), uy = -Math.sin(rad(m));
        const sg = ar.dentro ? -1 : 1, base = esAng ? r : r + (ar.afuera === undefined ? 6 : ar.afuera - 14);
        poner(cu.c[0] + ux * base, cu.c[1] + uy * base, ux * sg, uy * sg, esAng ? 3 : 6, ar.texto, { color: ar.color === undefined ? 'f' : ar.color, tipo: esAng ? 'angulo' : 'camino' });
      }
    }
    // la flecha curva del sentido de giro
    for (const se of d.sentido || []) {
      const cu = cs[se.en || 0]; if (!cu) continue;
      const r = (se.f || 1.16) * cu.R, de = se.de === undefined ? 20 : se.de, a = se.a === undefined ? 70 : se.a;
      s += `<path class="fis-sentido" d="${arco(cu.c, r, de, a)}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.7"/>`;
      const fin = se.horario ? de : a, sg = se.horario ? -1 : 1, q = [cu.c[0] + r * Math.cos(rad(fin)), cu.c[1] - r * Math.sin(rad(fin))];
      s += T.flecha(q[0] + sg * Math.sin(rad(fin)) * 6, q[1] + sg * Math.cos(rad(fin)) * 6, q[0] - sg * Math.sin(rad(fin)) * 2, q[1] - sg * Math.cos(rad(fin)) * 2, { grosor: 1.5 });
    }
    // los puntos: cabinas, caballos, la moto
    for (const it of PT) {
      if (!it) continue;
      const { p, q, tipo, caj } = it, sg = p.horario ? -1 : 1;
      if (tipo === 'cabina') s += `<g class="kit-objeto" data-objeto="cabina" data-prueba="si">${cabina(q, p.tenue, !p.tenue)}</g>`;
      else s += `<g class="kit-objeto" data-objeto="${tipo}" data-prueba="si">${figura(tipo, q, p.ang, sg, p.tenue)}</g>`;
      objetos.push(caj);
      pts.push({ x: q[0], y: q[1], ang: p.ang });
      if (p.texto) {
        const l = p.lado === undefined ? 1 : p.lado, cx = (caj.x0 + caj.x1) / 2, cy = (caj.y0 + caj.y1) / 2;
        poner(cx, cy, Math.cos(rad(p.ang)) * l, -Math.sin(rad(p.ang)) * l, Math.max(caj.x1 - caj.x0, caj.y1 - caj.y0) / 2 + 3, p.texto, { color: p.color, tipo: 'punto' });
      }
    }
    // las flechas de la velocidad y de la aceleración
    for (const fl of d.flechas || []) {
      const cu = cs[fl.en || 0];
      const q = fl.desde ? fl.desde.slice() : cu ? en(cu, fl.ang, fl.f === undefined ? 1 : fl.f) : null;
      if (!q) continue;
      const [ux, uy] = dirFlecha(fl);
      const L = fl.largo || 40, x2 = q[0] + ux * L, y2 = q[1] + uy * L, c = fl.color || 'o';
      s += (fl.abierta || c === 'h') ? abierta(q[0], q[1], x2, y2, c, fl.grosor || 2.5, 'fis-acel', fl.discontinua) : llena(q[0], q[1], x2, y2, c, fl.grosor || 3, 'fis-vel', fl.discontinua);
      flechas.push({ x1: q[0], y1: q[1], x2, y2, color: c, ux, uy, L });
      if (fl.texto) poner(x2, y2, ux, uy, 3, fl.texto, { color: fl.texto === '?' ? undefined : c, tipo: 'flecha' });
    }
    // el cronómetro (su rótulo ya está)
    if (d.reloj) {
      const { x, y } = d.reloj, fr = d.reloj.frac || 0, a = 90 - 360 * fr;
      s += `<g class="fis-reloj"><circle cx="${n(x)}" cy="${n(y)}" r="13" fill="var(--card)" stroke="var(--c-i)" stroke-width="2.5"/><path d="M${n(x - 3)} ${n(y - 17)}H${n(x + 3)}M${n(x)} ${n(y - 17)}V${n(y - 13)}" stroke="var(--c-i)" stroke-width="2.5" stroke-linecap="round"/>`
        + `<path d="M${n(x)} ${n(y)}L${n(x + 10 * Math.cos(rad(a)))} ${n(y - 10 * Math.sin(rad(a)))}" stroke="var(--c-i)" stroke-width="2" stroke-linecap="round"/></g>`;
    }
    return { W, M, H, s: fondo + s, rotulos: rot, objetos, flechas, puntos: pts, en: (k, a, f) => en(cs[k], a, f) };
  }

  // Notación en los rótulos (molde §5): «a_c» se dibuja con la c como subíndice (<tspan>, como en fis-tiro), y «v⃗» con
  // una flechita dibujada sobre la letra (la U+20D7 no está en todas las fuentes del celular). La caja de geometría() es
  // la del texto sin la flecha; la flechita queda dentro de la altura de la caja.
  const SUB = /([A-Za-zωα])_([A-Za-z0-9]{1,3})/g;
  function conSubindices(t) {
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
    const sinFlecha = Object.assign({}, b, { texto: limpio });
    // Un halo del color de la tarjeta detrás de cada rótulo: se lee aunque cruce un rayo o una línea.
    let s = pinta(sinFlecha).replace('<text', '<text stroke="var(--card)" stroke-width="4" stroke-linejoin="round" paint-order="stroke"');
    const sub = conSubindices(limpio);
    if (sub !== null) s = s.replace(/>[^<]*<\/text>$/, `>${sub}</text>`);
    if (b.texto.includes(VEC)) {
      // la x de inicio del texto tal como lo encaja pinta(): la misma cuenta de caja()
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
    const NOM = { rueda: 'una rueda de la fortuna', carrusel: 'un carrusel visto desde arriba', ventilador: 'un ventilador de techo visto desde abajo',
      pista: 'una pista circular vista desde arriba', disco: 'un disco', polea: 'una polea', engranaje: 'una rueda dentada', llanta: 'una llanta de bicicleta',
      tierra: 'la Tierra con un paralelo', reloj: 'un reloj' };
    const cs = (d.cuerpos || []).map(c => NOM[c.tipo] || 'un disco');
    return `Figura con ${cs.join(' y ') || 'un giro'}${(d.correas || []).length ? ', unidas por una faja o una cadena' : ''}.`;
  }

  return { id: 'fis-giro', dibujar, alt, geometria, constantes: { W, M } };
});
