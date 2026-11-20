/*
 * Pieza «trig-pos» (19 nov 2026, Etapa 8): el plano de «trig-plano» con un objeto reconocible de fondo, para la teoría
 * de «Ángulos en posición normal» (contenido/teoria/trigonometria/angulos-en-posicion-normal.js). Dibujos de prueba
 * (data-prueba): Gerson decide después cuáles reemplaza (docs/plan-calidad.md, M4).
 *
 * Afirmación de la figura: el ángulo en posición normal vive en un objeto que se reconoce; el origen es su centro (la
 * plaza, el eje de la rueda, el de la veleta o el del reloj) y el lado inicial apunta al eje x positivo.
 *
 * Fidelidad: todo lo del plano es de trig-plano (una sola escala, ángulos con su valor); el objeto se dibuja con la misma
 * escala, en las coordenadas del problema, y queda detrás (tenue), para que el plano se lea encima.
 *
 * datos = los de trig-plano (ventana, numeros, ejes, nombres, circulos, arcos, rayos, segmentos, puntos, rotulos, alt) y
 *   objeto: { tipo, ... }   uno de:
 *     plano      el plano de un pueblo: manzanas entre las calles (cada cuadra, una unidad), la plaza en el origen y,
 *                si va casa: [x, y], una casa en ese punto (P)
 *     rueda      una rueda de la fortuna de radio r con su centro en el origen, rayos, ocho cabinas tenues, las patas que
 *                bajan al suelo y la cabina en el ángulo cabina (grados), colgada del aro
 *     veleta     la veleta vista desde arriba: el poste en el origen, la cruz con N, E, S y O a distancia r, y la flecha
 *                de largo r que apunta al ángulo flecha (grados)
 *     reloj      un reloj de pared de radio r: marcas y los doce números (numeros: false, sin ellos); el minutero es el lado
 *                final, que dibuja la unidad con trig-plano
 *     bici       una rueda de bicicleta de radio r: llanta, rayos, maza y la válvula en el ángulo valvula (grados)
 * estado = el de trig-plano ({ corte }).
 * El dibujo es una función pura de (datos, estado): sin ids, sin azar, sin reloj. Alto fijo para unos datos (el de
 * trig-plano). Para las manijas: geometria, enPx, delPx y anguloDe de trig-plano.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const Kit = nodo ? require('../kit.js') : root.Kit;
  const T = nodo ? require('../trazo.js') : root.Kit.trazo;
  const TP = nodo ? require('./trig-plano.js') : root.Kit.piezas['trig-plano'];
  const api = fabrica(Kit, T, TP);
  Kit.registrar(api);
  if (nodo) module.exports = api;
})(typeof self !== 'undefined' ? self : this, function (Kit, T, TP) {
  'use strict';
  const rad = g => g * Math.PI / 180;
  const n = T.n;
  const TENUE = 'stroke="currentColor" stroke-opacity="0.35"';

  function plano(g, o) {
    const v = g.v;
    let s = '';
    // Manzanas: cada celda entera de la cuadrícula que no toca un eje (las calles van por los ejes y las líneas).
    for (let i = Math.floor(v.x[0]); i < Math.ceil(v.x[1]); i++) for (let j = Math.floor(v.y[0]); j < Math.ceil(v.y[1]); j++) {
      const a = Math.max(i, v.x[0]), b = Math.min(i + 1, v.x[1]), c = Math.max(j, v.y[0]), d = Math.min(j + 1, v.y[1]);
      if (b - a < 0.5 || d - c < 0.5) continue;
      const m = 0.14;
      s += `<rect x="${n(g.X(a + m))}" y="${n(g.Y(d - m))}" width="${n((b - a - 2 * m) * g.k)}" height="${n((d - c - 2 * m) * g.k)}" rx="3" fill="currentColor" fill-opacity="0.07"/>`;
    }
    // La plaza: la manzana del centro, con su pileta redonda y un árbol en cada esquina (las calles la cruzan por los ejes).
    const L = Math.max(14, 0.42 * g.k), X0 = g.X(0), Y0 = g.Y(0);
    s += `<rect x="${n(X0 - L)}" y="${n(Y0 - L)}" width="${n(2 * L)}" height="${n(2 * L)}" rx="5" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-opacity="0.5" stroke-width="1.5"/>`;
    s += `<circle cx="${n(X0)}" cy="${n(Y0)}" r="${n(L * 0.38)}" fill="none" stroke="currentColor" stroke-opacity="0.5" stroke-width="1.5"/>`;
    for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) s += `<circle cx="${n(X0 + sx * L * 0.68)}" cy="${n(Y0 + sy * L * 0.68)}" r="${n(L * 0.2)}" fill="currentColor" fill-opacity="0.3"/>`;
    if (o.casa) {
      // La casa cuelga de P: P es la punta del techo, así el rótulo de P queda libre arriba.
      const [cx, cy] = o.casa, X = g.X(cx), Y = g.Y(cy), w = 10;
      s += `<path d="M${n(X - w)} ${n(Y + 20)}V${n(Y + 8)}L${n(X)} ${n(Y)}L${n(X + w)} ${n(Y + 8)}V${n(Y + 20)}Z" fill="currentColor" fill-opacity="0.16" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>`
        + `<rect x="${n(X - 3)}" y="${n(Y + 13)}" width="6" height="7" fill="currentColor" fill-opacity="0.35"/>`;
    }
    return s;
  }

  function rueda(g, o) {
    const R = (o.r || 1) * g.k, X0 = g.X(0), Y0 = g.Y(0);
    let s = `<circle cx="${n(X0)}" cy="${n(Y0)}" r="${n(R)}" fill="none" ${TENUE} stroke-width="3"/>`;
    // Patas: del aro (abajo) al suelo, abiertas. No salen del centro: desde el origen parecerían otros lados finales
    // (cierre, lector en frío A).
    const piso = Math.min(g.y1, Y0 + R * 1.3);
    for (const sx of [-1, 1]) s += `<line x1="${n(X0 + sx * R * 0.5)}" y1="${n(Y0 + R * 0.87)}" x2="${n(X0 + sx * R * 0.78)}" y2="${n(piso)}" ${TENUE} stroke-width="3" stroke-linecap="round"/>`;
    for (let k = 0; k < 8; k++) {
      const a = rad(22.5 + 45 * k), x = X0 + R * Math.cos(a), y = Y0 - R * Math.sin(a);
      s += `<line x1="${n(X0)}" y1="${n(Y0)}" x2="${n(x)}" y2="${n(y)}" ${TENUE} stroke-width="1"/>`;
      s += `<rect x="${n(x - 6)}" y="${n(y)}" width="12" height="9" rx="2" fill="currentColor" fill-opacity="0.08" ${TENUE} stroke-width="1"/>`;
    }
    if (o.cabina !== undefined) {
      const a = rad(o.cabina), x = X0 + R * Math.cos(a), y = Y0 - R * Math.sin(a);
      s += `<rect x="${n(x - 8)}" y="${n(y + 2)}" width="16" height="12" rx="3" fill="currentColor" fill-opacity="0.22" stroke="currentColor" stroke-width="1.5"/>`;
    }
    return s;
  }

  function veleta(g, o) {
    const R = (o.r || 1) * g.k, X0 = g.X(0), Y0 = g.Y(0);
    // La rosa de los vientos: una estrella de cuatro puntas tenue debajo del poste.
    const e = R * 0.32, m = R * 0.08;
    let s = `<path d="M${n(X0 + e)} ${n(Y0)}L${n(X0 + m)} ${n(Y0 - m)}L${n(X0)} ${n(Y0 - e)}L${n(X0 - m)} ${n(Y0 - m)}L${n(X0 - e)} ${n(Y0)}L${n(X0 - m)} ${n(Y0 + m)}L${n(X0)} ${n(Y0 + e)}L${n(X0 + m)} ${n(Y0 + m)}Z" fill="currentColor" fill-opacity="0.12" stroke="currentColor" stroke-opacity="0.35" stroke-width="1"/>`;
    s += `<circle cx="${n(X0)}" cy="${n(Y0)}" r="5" fill="currentColor" fill-opacity="0.35"/>`;
    // La cruz de los puntos cardinales, tenue, con sus letras a un lado del eje (no encima de él).
    // Los puntos cardinales en palabras: la «O» sola se leía como un cero junto a (−a, 0) (cierre, lectores A y B).
    for (const [ang, letra] of [[0, 'este'], [90, 'norte'], [180, 'oeste'], [270, 'sur']]) {
      const ux = Math.round(Math.cos(rad(ang))), uy = -Math.round(Math.sin(rad(ang)));
      s += `<line x1="${n(X0 + ux * R * 0.25)}" y1="${n(Y0 + uy * R * 0.25)}" x2="${n(X0 + ux * R * 1.08)}" y2="${n(Y0 + uy * R * 1.08)}" ${TENUE} stroke-width="1.5"/>`;
      const px = X0 + ux * (R * 1.08 + 4) + (ux === 0 ? 8 : 0), py = Y0 + uy * (R * 1.08 + 10) + 5 + (uy === 0 ? -14 : 0);
      s += `<text class="kit-txt" x="${n(px)}" y="${n(py)}" fill="currentColor" fill-opacity="0.6" font-size="14" font-weight="700" text-anchor="${ux > 0 ? 'end' : ux < 0 ? 'start' : 'start'}">${letra}</text>`;
    }
    if (o.flecha !== undefined) {
      const a = rad(o.flecha), ux = Math.cos(a), uy = -Math.sin(a), px = -uy, py = ux;
      const cola = [X0 - ux * R * 0.45, Y0 - uy * R * 0.45];
      // La cola: una placa tenue a lo largo de la flecha (la punta la dibuja el lado final, encima). Unas plumas en «V»
      // se leían como otra punta (cierre, lectores A y B).
      const c1 = [X0 - ux * R * 0.12, Y0 - uy * R * 0.12], w = 6;
      s += `<path d="M${n(c1[0] + px * w)} ${n(c1[1] + py * w)}L${n(cola[0] + px * w)} ${n(cola[1] + py * w)}L${n(cola[0] - px * w)} ${n(cola[1] - py * w)}L${n(c1[0] - px * w)} ${n(c1[1] - py * w)}Z" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.45" stroke-width="1.5" stroke-linejoin="round"/>`;
    }
    return s;
  }

  function reloj(g, o) {
    const R = (o.r || 1) * g.k, X0 = g.X(0), Y0 = g.Y(0);
    let s = `<circle cx="${n(X0)}" cy="${n(Y0)}" r="${n(R)}" fill="currentColor" fill-opacity="0.04" ${TENUE} stroke-width="3"/>`;
    for (let k = 0; k < 12; k++) {
      const a = rad(90 - 30 * k), ux = Math.cos(a), uy = -Math.sin(a);
      s += `<line x1="${n(X0 + ux * R * 0.88)}" y1="${n(Y0 + uy * R * 0.88)}" x2="${n(X0 + ux * R * 0.98)}" y2="${n(Y0 + uy * R * 0.98)}" ${TENUE} stroke-width="2"/>`;
    }
    // Los doce números; los que caen sobre un eje (12, 3, 6 y 9) se corren a un lado para que la línea no los tache.
    for (let num = 1; num <= (o.numeros === false ? 0 : 12); num++) {
      const ang = 90 - 30 * num, ux = Math.cos(rad(ang)), uy = -Math.sin(rad(ang));
      const dx = num % 6 === 0 ? 9 : 0, dy = num % 6 === 3 ? -9 : 0;
      s += `<text class="kit-txt" x="${n(X0 + ux * R * 0.62 + dx)}" y="${n(Y0 + uy * R * 0.62 + 5 + dy)}" fill="currentColor" fill-opacity="0.6" font-size="14" font-weight="700" text-anchor="middle">${num}</text>`;
    }
    s += `<circle cx="${n(X0)}" cy="${n(Y0)}" r="4" fill="currentColor"/>`;
    return s;
  }

  function bici(g, o) {
    const R = (o.r || 1) * g.k, X0 = g.X(0), Y0 = g.Y(0);
    let s = `<circle cx="${n(X0)}" cy="${n(Y0)}" r="${n(R)}" fill="none" stroke="currentColor" stroke-opacity="0.45" stroke-width="6"/>`;
    s += `<circle cx="${n(X0)}" cy="${n(Y0)}" r="${n(R * 0.9)}" fill="none" ${TENUE} stroke-width="1.5"/>`;
    for (let k = 0; k < 16; k++) {
      const a = rad(11.25 + 22.5 * k);
      s += `<line x1="${n(X0)}" y1="${n(Y0)}" x2="${n(X0 + R * 0.9 * Math.cos(a))}" y2="${n(Y0 - R * 0.9 * Math.sin(a))}" stroke="currentColor" stroke-opacity="0.22" stroke-width="1"/>`;
    }
    s += `<circle cx="${n(X0)}" cy="${n(Y0)}" r="7" fill="currentColor" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/>`;
    if (o.valvula !== undefined) {
      const a = rad(o.valvula), ux = Math.cos(a), uy = -Math.sin(a);
      s += `<line x1="${n(X0 + ux * R * 0.9)}" y1="${n(Y0 + uy * R * 0.9)}" x2="${n(X0 + ux * R * 0.75)}" y2="${n(Y0 + uy * R * 0.75)}" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`;
    }
    return s;
  }

  const OBJETOS = { plano, rueda, veleta, reloj, bici };

  // ---------- Arcos y sus rótulos (cierre, 20 nov) ----------
  // En esta unidad el arco ES la información (lector en frío A): se dibuja con un radio de 20 px o más, para que se vea
  // hasta su lado final. Y su rótulo (θ, «−300°»…) no se pone a ciegas en la mitad del arco, como hace trig-plano (con
  // 180° o 360° caía justo sobre un eje): se prueban lugares a lo largo del arco hasta uno que no pise los ejes, el lado
  // final, los tramos x e y, los puntos, otros textos ni el arco mismo.
  const ARCO_MIN = 20, TAM = 16;
  function puntosArco(g, a) {
    const de = a.de || 0, total = a.a - de, esp = a.espiral === undefined ? 10 : a.espiral, cx = a.cx || 0, cy = a.cy || 0;
    const m = Math.max(2, Math.ceil(Math.abs(total) / 3)), pts = [];
    for (let i = 0; i <= m; i++) { const t = de + total * i / m, r = a.r * g.k + esp * Math.abs(total * i / m) / 360; pts.push([g.X(cx) + r * Math.cos(rad(t)), g.Y(cy) - r * Math.sin(rad(t)), t]); }
    return pts;
  }
  const cajaDe = (x, y, texto, ancla, tam = TAM, peso = 700) => { const w = T.ancho(texto, tam, peso), l = ancla === 'middle' ? x - w / 2 : ancla === 'end' ? x - w : x; return [l, y - 0.72 * tam, l + w, y + 0.18 * tam]; };
  const sePisan = (a, b) => Math.min(a[2], b[2]) - Math.max(a[0], b[0]) > -2 && Math.min(a[3], b[3]) - Math.max(a[1], b[1]) > -2;
  function cortaCaja(x1, y1, x2, y2, c) {
    const [l, t, r, b] = [c[0] - 2, c[1] - 2, c[2] + 2, c[3] + 2], dentro = (x, y) => x >= l && x <= r && y >= t && y <= b;
    if (dentro(x1, y1) || dentro(x2, y2)) return true;
    const cruza = (ax, ay, bx, by, cx, cy, dx, dy) => { const d = (bx - ax) * (dy - cy) - (by - ay) * (dx - cx); if (Math.abs(d) < 1e-12) return false; const u = ((cx - ax) * (dy - cy) - (cy - ay) * (dx - cx)) / d, v = ((cx - ax) * (by - ay) - (cy - ay) * (bx - ax)) / d; return u >= 0 && u <= 1 && v >= 0 && v <= 1; };
    return [[l, t, r, t], [r, t, r, b], [r, b, l, b], [l, b, l, t]].some(q => cruza(x1, y1, x2, y2, ...q));
  }
  function cajasDeTextos(svg) {
    const out = [];
    for (const m of svg.matchAll(/<text[^>]*?x="([-\d.]+)" y="([-\d.]+)"[^>]*?font-size="([\d.]+)"([^>]*)>([^<]*)<\/text>/g)) {
      const resto = m[4], peso = /font-weight="700"/.test(resto) ? 700 : 400, ancla = (resto.match(/text-anchor="(\w+)"/) || [])[1] || 'start';
      out.push(cajaDe(+m[1], +m[2], m[5].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'), ancla, +m[3], peso));
    }
    return out;
  }
  function rotulosDeArcos(svg, datos, arcos, estado, capa = '') {
    const g = TP.geometria(datos), corte = Math.max(0, estado.corte || 0), W = 320, H = g.alto;
    const ve = e => (e.desde || 0) <= corte && !(e.hasta < corte);
    const nuevo = e => ((e.desde || 0) === corte && corte > 0 ? ' kit-nuevo' : '');
    const lineas = [];
    if (datos.ejes !== false) {
      const ey = g.v.y[0] <= 0 && g.v.y[1] >= 0 ? g.Y(0) : g.y1, ex = g.v.x[0] <= 0 && g.v.x[1] >= 0 ? g.X(0) : g.x0;
      lineas.push([g.x0 - 4, ey, g.x1 + 12, ey], [ex, g.y1 + 4, ex, g.y0 - 12]);
    }
    for (const sg of (datos.segmentos || []).filter(ve)) lineas.push([g.X(sg.de[0]), g.Y(sg.de[1]), g.X(sg.a[0]), g.Y(sg.a[1])]);
    for (const r of (datos.rayos || []).filter(ve)) { const L = r.largo === undefined ? 1 : r.largo, cx = r.cx || 0, cy = r.cy || 0; lineas.push([g.X(cx), g.Y(cy), g.X(cx + L * Math.cos(rad(r.ang))), g.Y(cy + L * Math.sin(rad(r.ang)))]); }
    const cajas = cajasDeTextos(svg + capa).concat((datos.puntos || []).filter(ve).map(p => [g.X(p.x) - 6, g.Y(p.y) - 6, g.X(p.x) + 6, g.Y(p.y) + 6]));
    const curvas = arcos.filter(([, a]) => ve(a) && Math.abs(a.a - (a.de || 0)) > 1e-9).map(([, a]) => puntosArco(g, a));
    let extra = '';
    for (const [o, a] of arcos) {
      if (!o.rotulo || !ve(a) || Math.abs(a.a - (a.de || 0)) < 1e-9) continue;
      const pts = puntosArco(g, a), texto = String(o.rotulo);
      let elegido = null;
      for (const f of [0.5, 0.42, 0.58, 0.34, 0.66, 0.26, 0.74, 0.18, 0.82]) {
        for (const d of [18, 24, 12, 30, 36, 44, 54, 66, 80]) {
          const [px, py, t] = pts[Math.round(f * (pts.length - 1))], ux = Math.cos(rad(t)), uy = -Math.sin(rad(t));
          const ancla = Math.abs(ux) < 0.35 ? 'middle' : ux > 0 ? 'start' : 'end';
          const x = T.encajar(px + ux * d, texto, ancla, { tam: TAM, peso: 700, min: 2, max: W - 2 }), y = py + uy * d + 5;
          const c = cajaDe(x, y, texto, ancla);
          if (c[0] < 4 || c[2] > W - 4 || c[1] < 4 || c[3] > H - 4) continue;
          if (lineas.some(l => cortaCaja(...l, c)) || cajas.some(b => sePisan(b, c))) continue;
          if (curvas.some(cv => cv.some(([qx, qy]) => qx >= c[0] - 2 && qx <= c[2] + 2 && qy >= c[1] - 2 && qy <= c[3] + 2))) continue;
          elegido = { x, y, ancla, c }; break;
        }
        if (elegido) break;
      }
      // Un ángulo muy angosto no deja lugar adentro: el rótulo va junto al final del arco, del otro lado del lado final.
      const sg = Math.sign(a.a - (a.de || 0));
      for (const f of [1, 0.9, 0.8]) {
        if (elegido) break;
        for (const d of [10, 16, 24]) for (const r of [0, 8, 16]) {
          const [px, py, t] = pts[Math.round(f * (pts.length - 1))], ux = Math.cos(rad(t + sg * 90)), uy = -Math.sin(rad(t + sg * 90));
          const rx = Math.cos(rad(t)), ry = -Math.sin(rad(t));
          const ancla = Math.abs(ux) < 0.35 ? 'middle' : ux > 0 ? 'start' : 'end';
          const x = T.encajar(px + ux * d + rx * r, texto, ancla, { tam: TAM, peso: 700, min: 2, max: W - 2 }), y = py + uy * d + ry * r + 5;
          const c = cajaDe(x, y, texto, ancla);
          if (c[0] < 4 || c[2] > W - 4 || c[1] < 4 || c[3] > H - 4) continue;
          if (lineas.some(l => cortaCaja(...l, c)) || cajas.some(b => sePisan(b, c))) continue;
          if (curvas.some(cv => cv.some(([qx, qy]) => qx >= c[0] - 2 && qx <= c[2] + 2 && qy >= c[1] - 2 && qy <= c[3] + 2))) continue;
          elegido = { x, y, ancla, c }; break;
        }
      }
      if (!elegido) {   // sin lugar libre: donde lo pondría trig-plano
        const [px, py, t] = pts[Math.floor(pts.length / 2)], ux = Math.cos(rad(t)), uy = -Math.sin(rad(t)), ancla = Math.abs(ux) < 0.35 ? 'middle' : ux > 0 ? 'start' : 'end';
        elegido = { x: px + ux * 18, y: py + uy * 18 + 5, ancla, c: cajaDe(px + ux * 18, py + uy * 18 + 5, texto, ancla) };
      }
      cajas.push(elegido.c);
      extra += T.rotulo(elegido.x, elegido.y, texto, { color: o.color === undefined ? 'o' : o.color, peso: 700, ancla: elegido.ancla, clase: 'kit-aparece' + nuevo(a) });
    }
    const fin = svg.lastIndexOf('</svg>');
    return svg.slice(0, fin) + extra + svg.slice(fin);
  }

  function dibujar(datos, estado = {}) {
    const o = datos.objeto, conObjeto = o && OBJETOS[o.tipo];
    const capa = conObjeto ? `<g class="kit-objeto" data-objeto="${o.tipo}" data-prueba="si">${OBJETOS[o.tipo](TP.geometria(datos), o)}</g>` : '';
    // Arcos con radio mínimo y sin rótulo para trig-plano: los rótulos los pone rotulosDeArcos (sin pisar el objeto).
    let svg;
    if (datos.arcos && datos.arcos.length) {
      const g0 = TP.geometria(datos);
      const arcos = datos.arcos.map(a => [a, Object.assign({}, a, { r: Math.max(a.r === undefined ? 0.35 : a.r, ARCO_MIN / g0.k), rotulo: undefined })]);
      const prep = Object.assign({}, datos, { arcos: arcos.map(x => x[1]), alt: datos.alt || TP.alt(datos) });
      svg = rotulosDeArcos(TP.dibujar(prep, estado), prep, arcos, estado, capa);
    } else svg = TP.dibujar(datos, estado);
    if (!conObjeto) return svg;
    const i = svg.indexOf('>') + 1;   // el objeto va primero: queda detrás de los ejes y del ángulo
    return svg.slice(0, i) + capa + svg.slice(i);
  }

  const NOMBRE = { plano: 'el plano de un pueblo con su plaza en el origen', rueda: 'una rueda de la fortuna con su centro en el origen',
    veleta: 'la veleta de la plaza vista desde arriba', reloj: 'un reloj de pared con su centro en el origen', bici: 'una rueda de bicicleta con su eje en el origen' };
  function alt(datos) {
    const base = TP.alt(datos), o = datos.objeto;
    return o && NOMBRE[o.tipo] && !datos.alt ? `${NOMBRE[o.tipo][0].toUpperCase()}${NOMBRE[o.tipo].slice(1)}. ${base}` : base;
  }

  return { id: 'trig-pos', dibujar, alt, geometria: TP.geometria, enPx: TP.enPx, delPx: TP.delPx, anguloDe: TP.anguloDe, OBJETOS: Object.keys(OBJETOS) };
});
