/*
 * Pieza «trig-arco» (19 nov 2026, etapa 6): los objetos de la teoría de «Longitud de arco y sector circular»
 * (contenido/teoria/trigonometria/longitud-de-arco-y-sector.js). Dibujos de prueba (data-prueba): Gerson decide después
 * cuáles reemplaza (docs/plan-calidad.md, M4).
 *
 * Afirmación de la figura: un arco es un pedazo de borde que se mide con el radio; el área de un sector y la de una banda
 * salen de sus radios; una rueda que rueda deja en el piso el arco de su borde, y dos ruedas unidas por una cadena
 * recorren el mismo arco.
 *
 *   columpio    un columpio del parque, visto de lado: la cadena (el radio, naranja) cuelga del travesaño; quieta, es
 *               el lado inicial (punteada); el asiento recorre el arco (turquesa).
 *     datos = { objeto: 'columpio', r: 2,            el largo de la cadena, en metros (de 1 a 2,5)
 *               t: 0.75,                             cuánto se aleja de donde cuelga quieta, en radianes (0 a 1,3)
 *               rot: { r, s, t } }                   rótulos de la cadena, del arco y del ángulo (null: sin rótulo)
 *   abanico     un abanico de papel plegado: las varillas de los bordes son radios (naranja), el borde de arriba es el
 *               arco (turquesa) y el papel, el área (violeta claro).
 *     datos = { objeto: 'abanico', r: 20, g: 90,     las varillas, en cm, y cuánto se abre, en grados (de 15° a 180°)
 *               rot: { r, s, t, A }, otro: { r, rot } }   otro abanico del mismo ángulo, punteado, detrás (a la misma escala)
 *   limpia      el limpiaparabrisas de un carro: el brazo (r₂, naranja) gira desde abajo; el jebe va al final del brazo,
 *               desde r₁ hasta r₂, y limpia una banda (violeta claro) entre dos arcos (turquesa).
 *     datos = { objeto: 'limpia', r2: 60, h: 30, g: 120,   el brazo y el jebe, en cm; cuánto barre, en grados
 *               rot: { r1, r2, h, s1, s2, t, A }, k }       k: px por cm (para comparar dos figuras a la misma escala)
 *   rueda       la rueda de una bicicleta que rueda sin deslizar hacia la derecha: la llanta está mojada en pintura y deja
 *               su huella (turquesa) en el piso; una marca en la llanta, con su rayo (el radio, naranja), cuenta las vueltas.
 *     datos = { objeto: 'rueda', r: 0.3, n: 1.5,    el radio en metros y las vueltas que da
 *               rot: { r, d, n }, k }                k: px por metro (fijo en el juego para que las ruedas se comparen)
 *   monedas     una moneda que rueda alrededor de otra igual, que está fija: la de afuera en una o varias posiciones de
 *               su camino, cada una con su marca; el camino del centro, punteado (turquesa).
 *     datos = { objeto: 'monedas', pos: [0, 90], camino: true, rot: { fija, camino } }   pos: dónde está su centro, en
 *               grados alrededor de la fija (0 = a la derecha, sentido antihorario)
 *   bici        la transmisión de una bicicleta: el plato de los pedales (rueda 1), la cadena y el piñón (rueda 2); y, si
 *               se pide, la rueda de atrás (rueda 3), en el mismo eje que el piñón.
 *     datos = { objeto: 'bici', r1: 10, r2: 5,      radios del plato y del piñón, en cm
 *               n1: 1,                               vueltas de los pedales (el piñón gira n1 · r1 / r2)
 *               rueda: false | 'punteada' | true, r3: 30,  la rueda de atrás y su radio
 *               rot: { r1, r2, r3, n1, n2, n3 } }
 *   figura      la figura de un examen: un sector (o, con r1, un trapecio circular) de centro O, abierto g grados y
 *               simétrico respecto de la vertical; los radios en naranja, los arcos en turquesa, el área en violeta claro.
 *     datos = { objeto: 'figura', g: 60, r1: 0.5,    r1: el radio de adentro como fracción del de afuera (0: sector)
 *               area: true, circulo: false,          pinta el área; dibuja punteada la circunferencia entera
 *               rot: { r, s, t, A, r1, h, s1, O } }  en un trapecio, r es el radio de afuera y s su arco (s₂)
 *   engranajes  dos engranajes que se tocan: el 1 a la izquierda y el 2 a la derecha, cada uno con su rayo y su flecha
 *               de giro (en sentidos contrarios).
 *     datos = { objeto: 'engranajes', r1: 3, r2: 2, g1: 90,   radios (en cm) y cuánto gira el 1, en grados
 *               rot: { r1, r2, t1, t2 } }
 * Todos aceptan valores con pasos: un valor o [{ t | v, paso }] (se ve el último cuyo paso ya llegó); estado = { paso, final }.
 * Un rótulo «?» va en tinta. Función pura de (datos, estado): sin ids, sin azar, sin reloj. Lienzo de 320 × 300.
 * Colores (regla de la unidad): el ángulo en carmín (h), los radios en naranja (o), los arcos y la huella en turquesa (i),
 * el área y las vueltas en violeta (f); lo demás, tinta (currentColor).
 * geometria(datos, estado) da las cajas de los rótulos y los puntos que usan las manijas y las pruebas.
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
  const W = 320, H = 300, M = 4, RAD = Math.PI / 180;
  const OBJETOS = ['columpio', 'abanico', 'limpia', 'rueda', 'monedas', 'bici', 'engranajes', 'figura'];
  const n = T.n;
  const tinta = (g = 2, op) => `fill="none" stroke="currentColor" stroke-width="${g}" stroke-linejoin="round" stroke-linecap="round"${op !== undefined ? ` stroke-opacity="${op}"` : ''}`;
  const trazo = (c, g = 2, extra = '') => `fill="none" stroke="${T.color(c)}" stroke-width="${g}" stroke-linejoin="round" stroke-linecap="round"${extra}`;
  const PUNTOS = ' stroke-dasharray="5 5"';
  const linea = (p, q, attrs) => `<line x1="${n(p[0])}" y1="${n(p[1])}" x2="${n(q[0])}" y2="${n(q[1])}" ${attrs}/>`;
  const poli = (ps, attrs, cerrar = true) => `<path d="M${ps.map(p => `${n(p[0])} ${n(p[1])}`).join('L')}${cerrar ? 'Z' : ''}" ${attrs}/>`;
  const circulo = (c, r, attrs) => `<circle cx="${n(c[0])}" cy="${n(c[1])}" r="${n(r)}" ${attrs}/>`;
  const rect = (x, y, w, h, rx, attrs) => `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${n(rx)}" ${attrs}/>`;
  const enPaso = (x, e) => {
    if (!Array.isArray(x)) return x;
    const p = e && e.final ? Infinity : (e && e.paso) || 0;
    let v;
    for (const it of x) if ((it.paso || 0) <= p) v = it.t !== undefined ? it.t : it.v;
    return v;
  };
  // Punto a distancia r del centro c, en el ángulo a (grados, antihorario desde la derecha; la y del SVG va hacia abajo).
  const pt = (c, r, a) => [c[0] + r * Math.cos(a * RAD), c[1] - r * Math.sin(a * RAD)];
  const arcoPs = (c, r, a0, a1) => { const N = Math.max(2, Math.ceil(Math.abs(a1 - a0) / 4)); return Array.from({ length: N + 1 }, (_, i) => pt(c, r, a0 + (a1 - a0) * i / N)); };
  // El arco chico del ángulo, con su punta de flecha al final (de a0 a a1, en el sentido que vayan).
  function arcoAngulo(c, r, a0, a1, color = 'h', flecha = true) {
    if (Math.abs(a1 - a0) < 1) return '';
    const sg = Math.sign(a1 - a0), corta = flecha ? Math.min(Math.abs(a1 - a0) / 2, 8 / (r * RAD)) : 0, ps = arcoPs(c, r, a0, a1 - sg * corta);
    let s = poli(ps, trazo(color, 2.5), false);
    if (flecha) {
      const p1 = pt(c, r, a1), b = ps[ps.length - 1], L = Math.hypot(p1[0] - b[0], p1[1] - b[1]) || 1, u = [(p1[0] - b[0]) / L, (p1[1] - b[1]) / L], v = [-u[1], u[0]], B = [p1[0] - u[0] * 8, p1[1] - u[1] * 8];
      s += poli([p1, [B[0] + v[0] * 4, B[1] + v[1] * 4], [B[0] - v[0] * 4, B[1] - v[1] * 4]], `fill="${T.color(color)}" stroke="${T.color(color)}" stroke-width="1.5" stroke-linejoin="round"`);
    }
    return s;
  }
  const sector = (c, r0, r1, a0, a1) => poli(arcoPs(c, r1, a0, a1).concat(r0 > 0 ? arcoPs(c, r0, a1, a0) : [c]), `fill="var(--c-f)" fill-opacity="0.16" stroke="none"`);

  // ---------- Rótulos: caja centrada en (x, y); se dibujan con halo; un «?» va en tinta ----------
  const caja = (x, y, texto, o = {}) => {
    const tam = o.tam || 15, peso = o.peso || 600, w = T.ancho(String(texto), tam, peso);
    return { x: Math.min(W - M - 2 - w / 2, Math.max(M + 2 + w / 2, x)), y: Math.min(ALTO - M - tam * 0.55, Math.max(M + tam * 0.55, y)), w, h: tam * 1.1, texto: String(texto), tam, peso, color: String(texto) === '?' ? 'tinta' : o.color };
  };
  const pisa = (cs, b) => cs.some(c => Math.abs(c.x - b.x) < (c.w + b.w) / 2 + 3 && Math.abs(c.y - b.y) < (c.h + b.h) / 2 + 3);
  // Pone el rótulo en el primer lugar libre de la lista; si ninguno está libre, busca alrededor del primero, en anillos
  // cada vez más anchos, el lugar libre más cercano (dentro del lienzo y sin pisar otro rótulo).
  let ALTO = H;
  const dentro = (c, x, y) => Math.abs(c.x - x) < 1 && Math.abs(c.y - y) < 1 && c.y + c.tam * 0.6 <= ALTO - M && c.y - c.tam * 0.6 >= M;
  function coloca(cs, lugares, texto, o) {
    if (texto === null || texto === undefined || texto === '') return null;
    let b = null;
    // Un lugar que se sale del lienzo (la caja se corre al encajarla) cuenta como ocupado.
    for (const [x, y] of lugares) { const c = caja(x, y, texto, o); if (dentro(c, x, y) && !pisa(cs, c)) { b = c; break; } }
    for (let rad = 8; !b && rad <= 90; rad += 6) for (let k = 0; k < 16 && !b; k++) {
      const x = lugares[0][0] + rad * Math.cos(k * Math.PI / 8), y = lugares[0][1] + rad * Math.sin(k * Math.PI / 8), c = caja(x, y, texto, o);
      if (dentro(c, x, y) && !pisa(cs, c)) b = c;
    }
    b = b || caja(lugares[0][0], lugares[0][1], texto, o);
    cs.push(b);
    return b;
  }
  // Un lugar junto al punto p, hacia la dirección u (vector unitario de la pantalla), sin que la caja toque p.
  const junto = (p, u, texto, sep = 8, tam = 15) => { const w = T.ancho(String(texto || ''), tam, 600), h = tam * 1.1, L = Math.hypot(u[0], u[1]) || 1, a = [u[0] / L, u[1] / L]; const dd = sep + Math.abs(a[0]) * w / 2 + Math.abs(a[1]) * h / 2; return [p[0] + a[0] * dd, p[1] + a[1] * dd]; };
  const dir = a => [Math.cos(a * RAD), -Math.sin(a * RAD)];
  const rotulo = b => T.rotulo(b.x, b.y + b.tam * 0.33, b.texto, { ancla: 'middle', peso: b.peso, color: b.color, tam: b.tam, min: M, max: W - M })
    .replace('<text ', '<text stroke="var(--card)" stroke-width="4" stroke-linejoin="round" paint-order="stroke" ');
  const rots = (d, e) => { const r = {}; for (const [k, v] of Object.entries(d.rot || {})) r[k] = enPaso(v, e); return r; };
  const num = (x, def) => (Number.isFinite(+x) && x !== null && x !== '' ? +x : def);

  // ---------- El columpio ----------
  // El armazón es siempre el mismo (alto para la cadena más larga, 2,5 m): con una cadena más corta, el asiento queda más
  // alto. Así la figura llena el lienzo con cualquier cadena y las cadenas se comparan a una sola escala.
  const CP = [72, 14], KC = 94, G_COL = CP[1] + (2.5 + 0.42) * KC;
  function columpio(d, e) {
    const r = Math.min(2.5, Math.max(1, num(enPaso(d.r, e), 2))), t = Math.min(1.3, Math.max(0, num(enPaso(d.t, e), 0)));
    const R = r * KC, a = -90 + t / RAD, G = G_COL, abre = 0.2 * (G - CP[1]), ro = rots(d, e), cajas = [];
    let s = linea([M + 2, G], [W - M - 2, G], tinta(2, 0.6));
    // Pasto al pie del armazón (26 nov, dibujos reconocibles): unas matas cortas que dicen «parque».
    for (const x of [22, 118, 196, 262, 300]) s += `<path d="M${x - 5} ${n(G)}L${x - 3} ${n(G - 7)}M${x} ${n(G)}L${x} ${n(G - 9)}M${x + 5} ${n(G)}L${x + 3} ${n(G - 7)}" ${tinta(1.5, 0.4)}/>`;
    // El armazón de madera, en perspectiva (26 nov): el de atrás, corrido arriba a la derecha y tenue; un travesaño los
    // une. Así se lee el columpio del parque y no un par de rayas en A. El pivote y la cadena de adelante no se mueven.
    const DP = [16, -3], postes = (o, op) => {
      const c = [CP[0] + o[0], CP[1] + o[1]];
      return [[c[0] - abre, G + o[1]], [c[0] + abre, G + o[1]]].map(q => {
        const L = Math.hypot(q[0] - c[0], q[1] - c[1]), w = [-(q[1] - c[1]) / L * 4.5, (q[0] - c[0]) / L * 4.5];
        return poli([[c[0] + w[0], c[1] + w[1]], [q[0] + w[0], q[1] + w[1]], [q[0] - w[0], q[1] - w[1]], [c[0] - w[0], c[1] - w[1]]],
          `fill="var(--card)" stroke="currentColor" stroke-width="2" stroke-opacity="${op}" stroke-linejoin="round"`) +
          linea([c[0] + w[0] * 0.2, c[1] + w[1] * 0.2], [q[0] + w[0] * 0.2, q[1] + w[1] * 0.2], tinta(1, op * 0.5));
      }).join('');
    };
    s += postes(DP, 0.35);
    // El travesaño: la viga que va de un armazón al otro, vista de canto.
    s += poli([[CP[0] - 6, CP[1] - 5], [CP[0] + DP[0] - 6, CP[1] + DP[1] - 5], [CP[0] + DP[0] + 6, CP[1] + DP[1] - 5], [CP[0] + DP[0] + 6, CP[1] + DP[1] + 5], [CP[0] + 6, CP[1] + 5], [CP[0] - 6, CP[1] + 5]],
      'fill="var(--card)" stroke="currentColor" stroke-width="2" stroke-opacity="0.6" stroke-linejoin="round"');
    // El armazón de adelante, debajo de la cadena y del arco (lo que se mide va encima).
    s += postes([0, 0], 0.65);
    // El camino que puede seguir el asiento: la circunferencia de la cadena, con centro en el travesaño (tenue, punteada).
    const camino = arcoPs(CP, R, -90 - 60, -90 + 78).filter(q => q[0] >= M + 3 && q[0] <= W - M - 3);
    if (camino.length > 1) s += poli(camino, tinta(1.5, 0.3) + ' stroke-dasharray="3 6"', false);
    // Quieta: la cadena cuelga derecho (el lado inicial), punteada, y el asiento quieto, tenue.
    const abajo = pt(CP, R, -90), asiento = pt(CP, R, a);
    s += linea(CP, abajo, tinta(2, 0.55) + PUNTOS);
    s += rect(abajo[0] - 15, abajo[1] - 3, 30, 6, 2, 'fill="none" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.3"');
    // El arco que recorre el asiento: sobre esa circunferencia, desde el asiento quieto hasta el asiento.
    if (t > 0.01) s += poli(arcoPs(CP, R, -90, a), trazo('i', 4.5), false);
    const u = [Math.cos(a * RAD), -Math.sin(a * RAD)], v = [-u[1], u[0]];
    // La cadena de atrás (la otra del asiento), tenue, y después el armazón de adelante.
    s += linea([CP[0] + DP[0], CP[1] + DP[1]], [asiento[0] + DP[0], asiento[1] + DP[1]], trazo('o', 2, ' stroke-opacity="0.35" stroke-dasharray="4 2"'));
    s += circulo(CP, 6, 'fill="var(--card)" stroke="currentColor" stroke-width="2.5"');
    // La cadena, el radio: naranja, con sus eslabones; el asiento, una tabla con canto, centrada en la punta de la cadena.
    s += linea(CP, asiento, trazo('o', 3.5));
    const nE = Math.max(4, Math.round(R / 13));
    for (let i = 1; i < nE; i++) {
      const q = [CP[0] + (asiento[0] - CP[0]) * i / nE, CP[1] + (asiento[1] - CP[1]) * i / nE], ang = Math.atan2(asiento[1] - CP[1], asiento[0] - CP[0]) / RAD;
      s += `<ellipse cx="${n(q[0])}" cy="${n(q[1])}" rx="${i % 2 ? 5 : 3.5}" ry="${i % 2 ? 2.6 : 1.4}" transform="rotate(${n(ang)} ${n(q[0])} ${n(q[1])})" ${trazo('o', 1.6)} fill="var(--card)"/>`;
    }
    const tabla = [[-16, -2], [16, -2], [16, 5], [-16, 5]].map(([x, y]) => [asiento[0] + v[0] * x + u[0] * y, asiento[1] + v[1] * x + u[1] * y]);
    s += poli(tabla, 'fill="var(--card)" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"');
    s += linea([asiento[0] - v[0] * 12 + u[0] * 2, asiento[1] - v[1] * 12 + u[1] * 2], [asiento[0] + v[0] * 12 + u[0] * 2, asiento[1] + v[1] * 12 + u[1] * 2], tinta(1, 0.4));
    // El ángulo, desde la cadena quieta hasta la cadena: carmín, con su flecha.
    if (t > 0.01) s += arcoAngulo(CP, 30, -90, a);
    const mitad = (-90 + a) / 2;
    // El ángulo: dentro de su abertura si cabe (desde unos 0,9 rad); si no, a la izquierda de la cadena quieta.
    coloca(cajas, t >= 0.9 ? [junto(pt(CP, 34, mitad), dir(mitad), ro.t, 4), junto(pt(CP, 30, -90), [-1, 0.3], ro.t, 6)] : [junto(pt(CP, 30, -90), [-1, 0.3], ro.t, 6), junto(pt(CP, 40, -90), [-1, 0], ro.t, 6)], ro.t, { color: 'h' });
    // El radio, junto a la cadena, del lado de afuera del ángulo (arriba a la derecha de la cadena).
    const pm = pt(CP, R * 0.55, a), fuera = dir(a + 90);
    coloca(cajas, [junto(pm, fuera, ro.r, 8), junto(pt(CP, R * 0.7, a), fuera, ro.r, 8), junto(pm, [-fuera[0], -fuera[1]], ro.r, 8)], ro.r, { color: 'o' });
    coloca(cajas, [junto(pt(CP, R + 4, mitad), dir(mitad), ro.s, 6), junto(pt(CP, R, -90), [0.2, 1], ro.s, 8), junto(pt(CP, R - 8, mitad), dir(mitad + 180), ro.s, 6)], ro.s, { color: 'i' });
    return { s, cajas, asiento, centro: CP, R, piso: G };
  }

  // ---------- El abanico de papel ----------
  const CA = [160, 268];
  function abanico(d, e) {
    const r = num(enPaso(d.r, e), 20), g = Math.min(180, Math.max(15, num(enPaso(d.g, e), 90))), otro = enPaso(d.otro, e), ro = rots(d, e), cajas = [];
    // Con otro abanico detrás (cierre, 19 nov): más grande, para que los rótulos del chico quepan dentro de su papel.
    const rmax = otro ? Math.max(r, num(otro.r, r)) : r, K = Math.min(otro ? 200 : 150, 150 / Math.sin(Math.min(g, 160) / 2 * RAD)) / rmax, R = r * K, a0 = 90 - g / 2, a1 = 90 + g / 2;
    let s = '';
    if (otro) {
      const R2 = num(otro.r, r) * K;
      s += poli(arcoPs(CA, R2, a0, a1).concat([CA]), tinta(1.5, 0.6) + PUNTOS);
    }
    s += sector(CA, 0, R, a0, a1);
    // Los pliegues del papel: rayas finas cada pocos grados.
    const k = Math.max(4, Math.round(g / 12));
    for (let i = 1; i < k; i++) s += linea(pt(CA, 8, a0 + g * i / k), pt(CA, R - 2, a0 + g * i / k), tinta(1, i % 2 ? 0.35 : 0.2));
    s += poli(arcoPs(CA, R, a0, a1), trazo('i', 4), false);
    s += linea(CA, pt(CA, R + 4, a0), trazo('o', 4)) + linea(CA, pt(CA, R + 4, a1), trazo('o', 4));
    s += circulo(CA, 5, 'fill="var(--card)" stroke="currentColor" stroke-width="2.5"');
    s += arcoAngulo(CA, 28, a0, a1, 'h', false);
    coloca(cajas, [pt(CA, otro ? 40 : 46, 90), pt(CA, 50, 90 + Math.min(30, g / 4))], ro.t, { color: 'h' });
    // El radio, junto a la varilla de la izquierda y sin tocarla (el lector en frío lo vio montado sobre ella).
    coloca(cajas, [junto(pt(CA, R * 0.55, a1), dir(a1 + 90), ro.r, 10), junto(pt(CA, R * 0.75, a1), dir(a1 + 90), ro.r, 10)], ro.r, { color: 'o' });
    // Con otro abanico detrás, el arco y el área del chico van dentro de su papel: afuera serían del grande.
    coloca(cajas, otro ? [pt(CA, R - 17, 90)] : [pt(CA, R + 20, 90), pt(CA, R + 22, 90 - g / 4), pt(CA, R - 22, 90)], ro.s, { color: 'i' });
    coloca(cajas, otro ? [pt(CA, R * 0.6, 90)] : [pt(CA, R * 0.66, 90), pt(CA, R * 0.55, 90 - g / 6)], ro.A, { color: 'f' });
    if (otro && otro.rot) {
      const R2 = num(otro.r, r) * K, o2 = {};
      for (const [kk, vv] of Object.entries(otro.rot)) o2[kk] = enPaso(vv, e);
      coloca(cajas, [pt(CA, R2 + 18, 90), pt(CA, R2 + 18, 90 - g / 4)], o2.s, { color: 'i' });
      coloca(cajas, [junto(pt(CA, R2 * 0.75, a0), dir(a0 - 90), o2.r, 8), junto(pt(CA, R2 * 0.9, a0), dir(a0 - 90), o2.r, 8)], o2.r, { color: 'o' });
      coloca(cajas, [pt(CA, (R + R2) / 2, 90), pt(CA, (R + R2) / 2, 90 + g / 5)], o2.A, { color: 'f' });
    }
    return { s, cajas, centro: CA, R, borde: pt(CA, R, a1) };
  }

  // ---------- El limpiaparabrisas ----------
  const CL = [160, 250];
  function limpia(d, e) {
    const r2 = num(enPaso(d.r2, e), 60), h = Math.min(r2, num(enPaso(d.h, e), 30)), g = Math.min(160, Math.max(20, num(enPaso(d.g, e), 120))), ro = rots(d, e), cajas = [];
    const K = num(d.k, 150 / Math.max(r2, 60)), R2 = r2 * K, R1 = (r2 - h) * K, a0 = 90 - g / 2, a1 = 90 + g / 2;
    // El vidrio: un parabrisas, con los bordes de arriba y de abajo curvos y las esquinas redondeadas (el lector en frío leyó
    // como «el trapecio» el trapecio gris de antes: el trapecio circular es la banda violeta).
    const q = (p0, c, p1) => Array.from({ length: 9 }, (_, i) => { const t = i / 8; return [(1 - t) ** 2 * p0[0] + 2 * t * (1 - t) * c[0] + t * t * p1[0], (1 - t) ** 2 * p0[1] + 2 * t * (1 - t) * c[1] + t * t * p1[1]]; });
    const vidrio = [].concat(q([30, 287], [160, 294], [290, 287]), q([290, 287], [306, 286], [304, 271]), q([276, 46], [273, 30], [258, 31]), q([258, 31], [160, 20], [62, 31]), q([62, 31], [47, 30], [44, 46]), q([16, 271], [14, 286], [30, 287]));
    let s = poli(vidrio, 'fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-width="2" stroke-opacity="0.45" stroke-linejoin="round"');
    s += sector(CL, R1, R2, a0, a1);
    s += poli(arcoPs(CL, R1, a0, a1), trazo('i', 3.5), false) + poli(arcoPs(CL, R2, a0, a1), trazo('i', 3.5), false);
    // Donde empieza (a la derecha), punteado; el brazo, al final del barrido, en naranja, con el jebe negro al final.
    s += linea(CL, pt(CL, R2, a0), tinta(1.5, 0.55) + PUNTOS);
    s += linea(CL, pt(CL, R1, a0), trazo('o', 3));
    s += linea(CL, pt(CL, R2, a1), trazo('o', 3.5));
    s += linea(pt(CL, R1, a1), pt(CL, R2, a1), tinta(7));
    s += circulo(CL, 6, 'fill="var(--card)" stroke="currentColor" stroke-width="2.5"');
    s += arcoAngulo(CL, 26, a0, a1);
    // r₂ es el brazo entero: una cota naranja, paralela al brazo y por fuera, del eje a la punta (cierre, 19 nov: el
    // rótulo iba junto al primer tramo, que mide r₁). El rótulo, en la mitad de la cota.
    if (ro.r2) {
      const u = dir(a1 + 90), q0 = [CL[0] + u[0] * 15, CL[1] + u[1] * 15], q1 = [pt(CL, R2, a1)[0] + u[0] * 15, pt(CL, R2, a1)[1] + u[1] * 15];
      const tic = q => linea([q[0] - u[0] * 5, q[1] - u[1] * 5], [q[0] + u[0] * 5, q[1] + u[1] * 5], trazo('o', 1.8));
      s += linea(q0, q1, trazo('o', 1.8)) + tic(q0) + tic(q1);
      coloca(cajas, [junto([(q0[0] + q1[0]) / 2, (q0[1] + q1[1]) / 2], u, ro.r2, 6), junto([q0[0] * 0.4 + q1[0] * 0.6, q0[1] * 0.4 + q1[1] * 0.6], u, ro.r2, 6)], ro.r2, { color: 'o' });
    }
    // Primero los arcos: s₂ encima del de afuera; s₁ debajo del de adentro si cabe, si no encima, dentro de la banda.
    coloca(cajas, [junto(pt(CL, R2 + 2, 90), [0, -1], ro.s2, 6), junto(pt(CL, R2 + 2, 90 - g / 5), dir(90 - g / 5), ro.s2, 6)], ro.s2, { color: 'i' });
    // Debajo del arco de adentro, tan abajo que sus esquinas no toquen el arco (el arco baja hacia los lados).
    const w1 = ro.s1 ? T.ancho(String(ro.s1), 15, 600) : 0, yDebajo = R1 > w1 / 2 + 6 ? CL[1] - Math.sqrt(R1 * R1 - (w1 / 2 + 6) ** 2) + 12 : Infinity;
    coloca(cajas, yDebajo < CL[1] - 30 ? [[CL[0], yDebajo], junto(pt(CL, R1 + 3, 90), [0, -1], ro.s1, 5)] : [junto(pt(CL, R1 + 3, 90), [0, -1], ro.s1, 5)], ro.s1, { color: 'i' });
    // h junto al jebe, del lado de la banda; r₁ junto al tramo naranja de la derecha, por fuera.
    // (si la banda es angosta, h va por fuera, más allá de la cota de r₂: adentro pisaría el arco de adentro)
    const hFuera = [junto(pt(CL, R1 + (R2 - R1) * 0.75, a1), dir(a1 + 90), ro.h, ro.r2 ? 26 : 8), junto(pt(CL, R2, a1), dir(a1 + 90), ro.h, ro.r2 ? 26 : 8)];
    coloca(cajas, R2 - R1 >= 60 ? [junto(pt(CL, (R1 + R2) / 2, a1), dir(a1 - 90), ro.h, 8), junto(pt(CL, R1 + (R2 - R1) * 0.7, a1), dir(a1 - 90), ro.h, 8)].concat(hFuera) : hFuera, ro.h, {});
    coloca(cajas, [junto(pt(CL, R1 * 0.6, a0), dir(a0 - 90), ro.r1, 6), junto(pt(CL, R1 * 0.85, a0), dir(a0 - 90), ro.r1, 6)], ro.r1, { color: 'o' });
    // El ángulo, adentro del arco chico si cabe; si no, debajo del eje. s₁, debajo de su arco (del lado del eje) si cabe;
    // si no, encima, dentro de la banda. s₂, encima del arco de afuera.
    const tAdentro = R1 >= 66 && !ro.s1;
    coloca(cajas, tAdentro ? [pt(CL, 40, 90)] : [[CL[0], CL[1] + 22], [CL[0] + 34, CL[1] + 20]], ro.t, { color: 'h' });
    coloca(cajas, [pt(CL, (R1 + R2) / 2, 90 - g / 4), pt(CL, (R1 + R2) / 2, 90 + g / 6), pt(CL, (R1 + R2) / 2, 90)], ro.A, { color: 'f' });
    return { s, cajas, centro: CL, R1, R2, K, punta: pt(CL, R2, a1) };
  }

  // ---------- La rueda de la bicicleta que rueda y deja su huella ----------
  // El lienzo de la rueda es más bajo (160): la rueda es chica a la escala de su huella, y arriba no hay nada que mostrar.
  const PISO = 112, X0 = 14, H_RUEDA = 160;
  function rueda(d, e) {
    const r = num(enPaso(d.r, e), 0.3), nv = Math.max(0, num(enPaso(d.n, e), 1)), ro = rots(d, e), cajas = [];
    const dd = nv * 2 * Math.PI * r, K = num(d.k, Math.min(150, (W - 2 * X0) / (dd + 2 * r))), R = r * K, c0 = [X0 + R, PISO - R], c1 = [X0 + R + dd * K, PISO - R];
    let s = linea([M + 2, PISO], [W - M - 2, PISO], tinta(2.5, 0.7));
    // La huella de pintura, del punto donde tocaba al empezar hasta donde toca ahora: mide lo que avanzó el centro.
    if (dd > 0) s += linea([c0[0], PISO + 4], [c1[0], PISO + 4], trazo('i', 5));
    // Al empezar, punteada; la marca (abajo) tocaba el piso.
    s += circulo(c0, R, tinta(1.5, 0.55) + PUNTOS) + circulo([c0[0], PISO - 2], 3, 'fill="currentColor" fill-opacity="0.5" stroke="none"');
    // Ahora: llanta gruesa, rayos y la marca, girada nv vueltas en sentido horario (rueda hacia la derecha).
    s += circulo(c1, R, 'fill="none" stroke="currentColor" stroke-width="6" stroke-opacity="0.35"') + circulo(c1, R + 3, tinta(2));
    const giro = -90 - nv * 360;
    for (let k = 0; k < 6; k++) s += linea(c1, pt(c1, R - 3, giro + 30 + k * 60), tinta(1, 0.45));
    s += linea(c1, pt(c1, R, giro), trazo('o', 3.5));
    const marca = pt(c1, R, giro);
    s += circulo(marca, 4.5, 'fill="var(--c-o)" stroke="var(--card)" stroke-width="1.5"');
    s += circulo(c1, 4, 'fill="var(--card)" stroke="currentColor" stroke-width="2"');
    // El avance: una flecha sobre la rueda.
    if (dd > 0) s += T.flecha(c1[0] - Math.min(36, dd * K * 0.5), c1[1] - R - 14, c1[0] + 4, c1[1] - R - 14, { color: 'tinta' });
    coloca(cajas, [[(c0[0] + c1[0]) / 2, PISO + 24], [Math.max(c1[0] - 30, 60), PISO + 24]], ro.d, { color: 'i' });
    coloca(cajas, [junto([c1[0] + R + 2, c1[1]], [1, 0], ro.r, 6), junto([c1[0] - R - 2, c1[1]], [-1, 0], ro.r, 6)], ro.r, { color: 'o' });
    coloca(cajas, [[c1[0], c1[1] - R - 34], [c1[0] - 40, c1[1] - R - 34]], ro.n, { color: 'f' });
    return { s, cajas, centro: c1, inicio: c0, R, K, marca, alto: H_RUEDA };
  }

  // ---------- Dos monedas iguales: una fija y otra que rueda alrededor ----------
  const CM = [160, 150], RMON = 40;
  function monedas(d, e) {
    const pos = [].concat(enPaso(d.pos, e) === undefined ? [0] : enPaso(d.pos, e)), ro = rots(d, e), cajas = [];
    let s = circulo(CM, RMON, 'fill="currentColor" fill-opacity="0.12" stroke="currentColor" stroke-width="2.5"');
    if (enPaso(d.camino, e)) s += circulo(CM, 2 * RMON, trazo('i', 2.5, PUNTOS));
    pos.forEach((p, k) => {
      const c = pt(CM, 2 * RMON, p), ultima = k === pos.length - 1;
      // La marca apunta hacia afuera al empezar (p = 0); al rodar sin deslizar gira el doble de lo que avanza.
      const m = pt(c, RMON - 4, 2 * p);
      s += circulo(c, RMON, ultima ? tinta(2.5) : tinta(1.5, 0.45) + PUNTOS);
      s += linea(c, m, trazo('o', ultima ? 3 : 2, ultima ? '' : ' stroke-opacity="0.55"'));
      s += circulo(m, 4, `fill="var(--c-o)" stroke="none"${ultima ? '' : ' fill-opacity="0.55"'}`);
    });
    coloca(cajas, [[CM[0], CM[1]]], ro.fija, { tam: 14 });
    coloca(cajas, [[CM[0], CM[1] + 2 * RMON + 50], [CM[0] + 100, H - 20]], ro.camino, { color: 'i' });
    return { s, cajas, centro: CM };
  }

  // ---------- La transmisión de la bicicleta ----------
  function dientes(c, R, giro, z) {
    let s = '';
    for (let k = 0; k < z; k++) s += linea(pt(c, R, giro + 360 * k / z), pt(c, R + 4, giro + 360 * k / z), tinta(2));
    return s;
  }
  function bici(d, e) {
    const r1 = num(enPaso(d.r1, e), 10), r2 = num(enPaso(d.r2, e), 5), n1 = num(enPaso(d.n1, e), 0), conRueda = enPaso(d.rueda, e), r3 = num(enPaso(d.r3, e), 30), ro = rots(d, e), cajas = [];
    const K = conRueda ? 2.9 : 4.2, c1 = [conRueda ? 52 : 82, conRueda ? 150 : 138], c2 = [conRueda ? 212 : 236, c1[1]], R1 = r1 * K, R2 = r2 * K, R3 = r3 * K;
    const g1 = -n1 * 360, g2 = -n1 * r1 / r2 * 360;             // pedaleando hacia adelante: sentido horario
    let s = '';
    if (conRueda) {
      s += circulo(c2, R3, conRueda === 'punteada' ? tinta(2, 0.6) + PUNTOS : 'fill="none" stroke="currentColor" stroke-width="6" stroke-opacity="0.3"') + (conRueda === 'punteada' ? '' : circulo(c2, R3 + 3, tinta(2)));
      for (let k = 0; k < 8; k++) s += linea(pt(c2, R2 + 4, g2 + 22.5 + k * 45), pt(c2, R3 - 3, g2 + 22.5 + k * 45), tinta(1, 0.35));
    }
    // La cadena: las dos rectas tangentes (de arriba y de abajo), con eslabones.
    const D = c2[0] - c1[0], fi = Math.asin((R1 - R2) / D) / RAD;
    for (const sg of [1, -1]) s += linea(pt(c1, R1 + 2, sg * (90 - fi)), pt(c2, R2 + 2, sg * (90 - fi)), tinta(3.5, 0.75) + ' stroke-dasharray="3 3"');
    s += circulo(c1, R1, 'fill="var(--card)" stroke="currentColor" stroke-width="2.5"') + dientes(c1, R1, g1, Math.round(r1 * 3.2));
    s += circulo(c2, R2, 'fill="var(--card)" stroke="currentColor" stroke-width="2.5"') + dientes(c2, R2, g2, Math.max(9, Math.round(r2 * 3.2)));
    // El rayo de cada rueda (su radio, en naranja) empieza arriba y gira con ella; el arco carmín dice cuánto.
    s += linea(c1, pt(c1, R1, 90 + g1), trazo('o', 3.5)) + linea(c2, pt(c2, R2, 90 + g2), trazo('o', 3));
    // La biela y el pedal, en el plato.
    const pedal = pt(c1, R1 * 0.75, 270 + g1);
    s += linea(c1, pedal, tinta(5, 0.7)) + rect(pedal[0] - 10, pedal[1] - 4, 20, 8, 2, 'fill="currentColor" fill-opacity="0.6" stroke="none"');
    s += circulo(c1, 4, 'fill="var(--card)" stroke="currentColor" stroke-width="2"') + circulo(c2, 3, 'fill="var(--card)" stroke="currentColor" stroke-width="2"');
    coloca(cajas, [[c1[0], c1[1] + R1 + 26], [c1[0] + 30, c1[1] + R1 + 26]], ro.r1, { color: 'o' });
    coloca(cajas, [[c2[0], c2[1] + (conRueda ? R2 + 22 : R1 + 26)], [c2[0], c2[1] - R2 - 22]], ro.r2, { color: 'o' });
    coloca(cajas, [[c1[0], c1[1] - R1 - 22], [c1[0] + 34, c1[1] - R1 - 22]], ro.n1, { color: 'f' });
    // Con la rueda de atrás, n₂ va junto al piñón y n₃ arriba de la rueda (el lector en frío los leyó cambiados).
    coloca(cajas, conRueda ? [[c2[0], c2[1] - R2 - 22], [c2[0] + 40, c2[1] - R2 - 24]] : [[c2[0], c2[1] - R1 - 22], [c2[0] - 50, c2[1] - R2 - 24], [c2[0], c2[1] - R2 - 24]], ro.n2, { color: 'f' });
    if (conRueda) {
      coloca(cajas, [[c2[0], c2[1] + R3 + 18], [c2[0] - 40, c2[1] + R3 + 18]], ro.r3, { color: 'o' });
      coloca(cajas, [[c2[0], c2[1] - R3 - 18], [c2[0] + R3 * 0.5, c2[1] - R3 * 0.62]], ro.n3, { color: 'f' });
    }
    return { s, cajas, c1, c2, R1, R2, K, g1, g2 };
  }

  // ---------- Dos engranajes que se tocan ----------
  function engranajes(d, e) {
    const r1 = num(enPaso(d.r1, e), 3), r2 = num(enPaso(d.r2, e), 2), g1 = num(enPaso(d.g1, e), 0), ro = rots(d, e), cajas = [];
    const K = 110 / Math.max(r1 + r2, 5) * 1.1, R1 = r1 * K, R2 = r2 * K, cy = 150, c1 = [160 - (R1 + R2) / 2 + R1 - R1, cy];
    c1[0] = 160 - (R1 + R2) / 2; const c2 = [c1[0] + R1 + R2, cy];
    const g2 = -g1 * r1 / r2;
    let s = '';
    for (const [c, R, g, z] of [[c1, R1, g1, Math.round(r1 * 6)], [c2, R2, g2, Math.round(r2 * 6)]]) {
      s += circulo(c, R - 3, 'fill="currentColor" fill-opacity="0.06" stroke="currentColor" stroke-width="2"');
      for (let k = 0; k < z; k++) {
        const a = g + 90 + 360 * k / z, w = 180 / z * 0.55;
        s += poli([pt(c, R - 3, a - w), pt(c, R + 4, a - w * 0.6), pt(c, R + 4, a + w * 0.6), pt(c, R - 3, a + w)], 'fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"', false);
      }
      s += linea(c, pt(c, R - 3, 90), tinta(1.5, 0.5) + PUNTOS) + linea(c, pt(c, R - 3, 90 + g), trazo('o', 3.5));
      s += arcoAngulo(c, Math.min(26, R * 0.45), 90, 90 + g);
      s += circulo(c, 4, 'fill="var(--card)" stroke="currentColor" stroke-width="2"');
    }
    coloca(cajas, [[c1[0], cy + R1 + 24], [c1[0] - 30, cy + R1 + 24]], ro.r1, { color: 'o' });
    coloca(cajas, [[c2[0], cy + R2 + 24], [c2[0] + 30, cy + R2 + 24]], ro.r2, { color: 'o' });
    coloca(cajas, [[c1[0], cy - R1 - 22], [c1[0] - 30, cy - R1 - 22]], ro.t1, { color: 'h' });
    coloca(cajas, [[c2[0], cy - R2 - 22], [c2[0] + 30, cy - R2 - 22]], ro.t2, { color: 'h' });
    return { s, cajas, c1, c2, R1, R2, g2 };
  }


  // ---------- La figura de examen: un sector o un trapecio circular ----------
  function sectorFig(d, e) {
    const g = Math.min(330, Math.max(10, num(enPaso(d.g, e), 60))), f1 = Math.min(0.85, Math.max(0, num(enPaso(d.r1, e), 0))), ro = rots(d, e), cajas = [];
    const ancho = g > 180, C = ancho ? [160, 152] : [160, g > 120 ? 236 : 250], R = ancho ? 112 : g > 120 ? 140 : 170, R1 = R * f1, a0 = 90 - g / 2, a1 = 90 + g / 2;
    let s = '';
    if (enPaso(d.circulo, e)) s += circulo(C, R, tinta(1.5, 0.45) + PUNTOS);
    if (enPaso(d.area, e)) s += sector(C, R1, R, a0, a1);
    s += poli(arcoPs(C, R, a0, a1), trazo('i', 3.5), false);
    // El borde derecho es el radio entero (r, o r₂ en un trapecio); en un trapecio, el izquierdo se parte en r₁ (naranja,
    // hasta el arco de adentro) y el ancho h (tinta, de un arco al otro).
    s += linea(C, pt(C, R, a0), trazo('o', 3));
    // Sin rótulo de ancho, el borde izquierdo es otro radio entero (dos circunferencias con el mismo centro); si r₁ lleva
    // rótulo, el tramo de afuera va fino, en tinta, para que se vea dónde termina r₁ (lector en frío A).
    if (R1 > 0) s += poli(arcoPs(C, R1, a0, a1), trazo('i', 3.5), false) + linea(C, pt(C, R1, a1), trazo('o', 3)) + linea(pt(C, R1, a1), pt(C, R, a1), ro.h ? tinta(3) : ro.r1 ? tinta(1.5, 0.55) : trazo('o', 3));
    else s += linea(C, pt(C, R, a1), trazo('o', 3));
    s += circulo(C, 3.5, 'fill="currentColor" stroke="none"');
    const ra0 = ancho ? 24 : R1 > 0 ? Math.min(30, R1 * 0.5) : 30;
    s += arcoAngulo(C, ra0, a0, a1, 'h', false);
    coloca(cajas, [junto(C, [0, 1], ro.O, 6), junto(C, [-1, 0.6], ro.O, 6)], ro.O, {});
    const lugT = ancho ? [junto(pt(C, 26, 270), [0, 1], ro.t, 4)] : [junto(pt(C, ra0 + 2, 90), [0, -1], ro.t, 4), junto(pt(C, ra0 + 2, 90 + g / 4), dir(90 + g / 4), ro.t, 4)];
    // Un rótulo ancho en un ángulo estrecho cruzaría los radios: se sube hasta donde la abertura le alcanza.
    const wT = ro.t ? T.ancho(String(ro.t), 15, 600) : 0, rhoT = (wT + 12) / (2 * Math.sin(Math.min(g, 170) / 2 * RAD)) + 9;
    if (!ancho && rhoT > ra0 + 12 && rhoT < (R1 > 0 ? R1 - 12 : R * 0.72)) lugT.unshift(pt(C, rhoT, 90));
    if (R1 > 0) lugT.unshift(...lugT.splice(0, lugT.length).filter(q => Math.hypot(q[0] - C[0], q[1] - C[1]) < R1 - 12));
    lugT.push(junto(C, [1, -0.15], ro.t, 12), junto(C, [-1, -0.15], ro.t, 12));
    coloca(cajas, lugT, ro.t, { color: 'h' });
    // El radio (o el de afuera) junto al borde derecho, por fuera; en un trapecio, r₁ junto al tramo punteado de la izquierda
    // y h junto al tramo naranja de la izquierda.
    coloca(cajas, [junto(pt(C, R * 0.6, a0), dir(a0 - 90), ro.r, 6), junto(pt(C, R * 0.8, a0), dir(a0 - 90), ro.r, 6), junto(pt(C, R * 0.6, a0), dir(a0 + 90), ro.r, 6)], ro.r, { color: 'o' });
    coloca(cajas, [junto(pt(C, R1 * 0.55, a1), dir(a1 + 90), ro.r1, 6), junto(pt(C, R1 * 0.75, a1), dir(a1 + 90), ro.r1, 6)], ro.r1, { color: 'o' });
    coloca(cajas, [junto(pt(C, (R1 + R) / 2, a1), dir(a1 + 90), ro.h, 6), junto(pt(C, R1 + (R - R1) * 0.8, a1), dir(a1 + 90), ro.h, 6)], ro.h, {});
    coloca(cajas, [junto(pt(C, R + 2, 90), [0, -1], ro.s, 6), junto(pt(C, R + 2, 90 - g / 4), dir(90 - g / 4), ro.s, 6), junto(pt(C, R + 2, 90 + g / 4), dir(90 + g / 4), ro.s, 6)], ro.s, { color: 'i' });
    coloca(cajas, [junto(pt(C, R1 - 3, 90), [0, 1], ro.s1, 6), junto(pt(C, R1 + 3, 90), [0, -1], ro.s1, 4), junto(pt(C, R1 - 3, 90 - g / 5), dir(270 - g / 5), ro.s1, 6)], ro.s1, { color: 'i' });
    const ra = R1 > 0 ? (R1 + R) / 2 : R * 0.62;
    coloca(cajas, [pt(C, ra, 90), pt(C, ra, 90 - g / 5), pt(C, ra, 90 + g / 5)], ro.A, { color: 'f' });
    return { s, cajas, centro: C, R, R1 };
  }

  const DIBUJA = { columpio, abanico, limpia, rueda, monedas, bici, engranajes, figura: sectorFig };
  function geometria(d = {}, e = {}) {
    const objeto = OBJETOS.includes(d.objeto) ? d.objeto : 'columpio';
    ALTO = objeto === 'rueda' ? H_RUEDA : H;
    const g = Object.assign({ objeto }, DIBUJA[objeto](d, e));
    ALTO = H;
    return g;
  }
  function dibujar(datos = {}, estado = {}) {
    const g = geometria(datos, estado);
    return T.svg(W, g.alto || H, `<g class="kit-objeto" data-objeto="${g.objeto}" data-prueba="si">${g.s}</g>${g.cajas.map(rotulo).join('')}`, { alt: alt(datos) });
  }
  const f = x => Kit.formatear(x, 2);
  function alt(d = {}) {
    if (d.alt) return d.alt;
    const e = { final: true }, objeto = OBJETOS.includes(d.objeto) ? d.objeto : 'columpio', v = k => enPaso(d[k], e);
    if (objeto === 'columpio') return `Columpio visto de lado: la cadena de ${f(num(v('r'), 2))} m cuelga del travesaño; se aleja ${f(num(v('t'), 0))} rad de donde cuelga quieta (punteada) y el asiento recorre un arco.`;
    if (objeto === 'abanico') { const o = v('otro'); return `Abanico de papel con varillas de ${f(num(v('r'), 20))} cm, abierto ${f(num(v('g'), 90))}°: el borde de arriba es el arco y el papel, el área${o ? `; detrás, punteado, otro abanico de ${f(o.r)} cm con el mismo ángulo` : ''}.`; }
    if (objeto === 'limpia') return `Limpiaparabrisas sobre el vidrio de un carro: el brazo de ${f(num(v('r2'), 60))} cm barre ${f(num(v('g'), 120))}° y el jebe, de ${f(num(v('h'), 30))} cm al final del brazo, limpia una banda curva entre dos arcos.`;
    if (objeto === 'rueda') return `Rueda de bicicleta de ${f(num(v('r'), 0.3))} m de radio que rueda sin deslizar hacia la derecha y deja en el piso una huella de pintura; una marca en la llanta cuenta las vueltas.`;
    if (objeto === 'monedas') return 'Una moneda fija y otra igual que rueda a su alrededor sin deslizar; la marca de la que rueda muestra cuánto giró.';
    if (objeto === 'bici') return `Transmisión de una bicicleta: el plato de los pedales, de ${f(num(v('r1'), 10))} cm, y el piñón, de ${f(num(v('r2'), 5))} cm, unidos por la cadena${v('rueda') ? `; la rueda de atrás, de ${f(num(v('r3'), 30))} cm, va en el mismo eje que el piñón` : ''}.`;
    if (objeto === 'figura') return `${num(v('r1'), 0) > 0 ? 'Trapecio circular' : 'Sector circular'} de ${f(num(v('g'), 60))}°: dos radios en naranja y ${num(v('r1'), 0) > 0 ? 'dos arcos' : 'su arco'} en turquesa.`;
    return `Dos engranajes que se tocan, de ${f(num(v('r1'), 3))} cm y ${f(num(v('r2'), 2))} cm de radio: giran en sentidos contrarios.`;
  }

  return { id: 'trig-arco', dibujar, alt, geometria, OBJETOS, constantes: { W, H, M, CP, KC, CA, CL, PISO, X0, CM, RMON } };
});
