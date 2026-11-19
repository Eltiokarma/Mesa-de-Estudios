/*
 * Pieza «trig-vista» (19 nov 2026, etapa 7): escenas de lado para la teoría de «Resolución de triángulos rectángulos»
 * (contenido/teoria/trigonometria/triangulos-rectangulos.js). Dibujos de prueba (data-prueba): Gerson decide después
 * cuáles reemplaza (docs/plan-calidad.md, M4).
 *
 * Afirmación de la figura: un triángulo rectángulo escondido en una cosa que se ve (una cometa, una antena, un globo, un
 * cerro, un letrero): las alturas y las distancias por el suelo van a escala y los ángulos se dibujan con su medida, desde
 * la horizontal del ojo. Lo vertical (la altura) es el cateto opuesto a la elevación; lo horizontal, el adyacente.
 *
 * El mundo va en metros: x hacia la derecha, y hacia arriba, el suelo en y = 0. Una sola escala para los dos ejes, salvo
 * la altura de los ojos: si a escala mide menos de OJO_PX, el tramo del suelo a los ojos se dibuja con OJO_PX y todo lo de
 * arriba sigue a escala (así la persona se reconoce y los ángulos, que nacen en los ojos, son fieles).
 *
 * datos = {
 *   suelo: true,                      la línea del suelo (por omisión, sí); false: una figura de examen sin suelo
 *   agua: [x0, x1],                   un tramo de agua (mar o lago) sobre el suelo, con ondas
 *   ojo: 1.5,                         la altura de los ojos de las personas (para el tramo que no va a escala)
 *   marco: [[x0, y0], [x1, y1]],      puntos del mundo que entran siempre en el encuadre (el juego fija la escala así)
 *   objetos: [{ tipo, x, y, h, h1, ancho, lado, tenue, texto, dx }],   ver OBJETOS abajo; dx: corre un ícono dx px (que no
 *            tape un vértice); lado: +1 (se extiende a la
 *            derecha de x) o −1; tenue: dibujado a medias (un rastro o un lugar anterior); texto: un nombre corto junto
 *   lados:   [{ de: [x, y], a: [x, y], como: 'linea' | 'cota' | 'vista' | 'punteada', color, texto, lado, sep, paso }],
 *            como 'linea': un trazo grueso del color; 'cota': una medida paralela al tramo, a sep px (14) hacia el lado
 *            (+1: a la izquierda de de→a en pantalla), con topes; 'vista': punteada en tinta; 'punteada': del color
 *   angulos: [{ en, de, a, texto, color, paso, radio }],   el arco del ángulo en `en`, entre las rectas hacia de y hacia a
 *   rectos:  [{ en, de, a, paso }],   el cuadradito del ángulo recto
 *   horizontales: [{ en, hasta, paso }],   la horizontal del ojo, punteada, desde `en` hasta la x `hasta`
 *   puntos:  [{ en, texto, dir: [dx, dy], paso }],   el nombre de un punto de una figura de examen (A, B, C, H), con un
 *            puntito; dir: hacia dónde va el nombre (en pantalla: x a la derecha, y hacia abajo)
 *   nota: 'El dibujo no está a escala'   una línea arriba (un texto o [{ t, paso }])
 * }
 * Todo texto y todo valor aceptan pasos: un valor o [{ t | v, paso }] (se ve el último cuyo paso ya llegó); un elemento
 * con `paso` aparece desde ese paso. estado = { paso, final }. Un rótulo «?» va en tinta. Lienzo de 320 × 260.
 * Función pura de (datos, estado): sin ids, sin azar, sin reloj. Colores: currentColor (tinta) y var(--c-*).
 *
 * OBJETOS (los altos van a escala; los íconos, con tamaño fijo en pantalla, anclados en su punto del mundo):
 *   cometa   ícono; (x, y) es donde se amarra la pita       estaca   ícono en (x, 0), clavada en el suelo
 *   antena   mástil de x, de 0 a h, con su foco arriba       persona  ícono de pie en (x, y = 0), con los ojos a `ojo`;
 *   globo    ícono; (x, y) es la canasta                              lado: hacia dónde mira (+1 a la derecha)
 *   edificio de x a x + lado·ancho, de 0 a h (ventanas; liso: sin ventanas, una pared)     faro     torre a rayas de x (su cara) hacia lado, alto h
 *   acantilado roca alta h, con su borde en x y el resto hacia lado    cerro   perfil con la punta en (x, h)
 *   poste    poste de x, de 0 a h                           letrero  poste en x y un panel de h1 a h del lado `lado`
 *   arbol    tronco y copa, punta en (x, h)                 combi, auto, barco, lancha   íconos en (x, 0)
 *   dron     ícono en (x, y)                                camara   ícono en (x, y) (en lo alto de un poste)
 *   ojo      un ojo en (x, y): «desde un punto»             tanque   tanque elevado de x, alto h
 *   escalera de `de` a `a` (puntos del mundo), con peldaños  tobogan  escalerita en x hasta h y la bajada hasta `hasta`
 * geometria(datos, estado) da la escala (X, Y), las cajas de los rótulos y los segmentos (para las pruebas).
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
  const W = 320, H = 260, M = 4, OJO_PX = 30, RAD = Math.PI / 180;
  const BORDE = { izq: 18, der: 18, arriba: 26, abajo: 38 };
  const n = T.n;
  const tinta = (g = 2, op) => `fill="none" stroke="currentColor" stroke-width="${g}" stroke-linejoin="round" stroke-linecap="round"${op !== undefined ? ` stroke-opacity="${op}"` : ''}`;
  const trazo = (c, g = 2, extra = '') => `fill="none" stroke="${T.color(c)}" stroke-width="${g}" stroke-linejoin="round" stroke-linecap="round"${extra}`;
  const linea = (p, q, attrs) => `<line x1="${n(p[0])}" y1="${n(p[1])}" x2="${n(q[0])}" y2="${n(q[1])}" ${attrs}/>`;
  const poli = (ps, attrs, cerrar = true) => `<path d="M${ps.map(p => `${n(p[0])} ${n(p[1])}`).join('L')}${cerrar ? 'Z' : ''}" ${attrs}/>`;
  const circulo = (c, r, attrs) => `<circle cx="${n(c[0])}" cy="${n(c[1])}" r="${n(r)}" ${attrs}/>`;
  const rect = (x, y, w, h, attrs) => `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" ${attrs}/>`;
  const enPaso = (x, e) => {
    if (!Array.isArray(x) || !x.length || typeof x[0] !== 'object' || x[0] === null || Array.isArray(x[0])) return x;
    const p = e && e.final ? Infinity : (e && e.paso) || 0;
    let v;
    for (const it of x) if ((it.paso || 0) <= p) v = it.t !== undefined ? it.t : it.v;
    return v;
  };
  const visible = (el, e) => (el.paso || 0) <= (e && e.final ? Infinity : (e && e.paso) || 0);
  const num = (x, def) => (Number.isFinite(+x) && x !== null && x !== '' ? +x : def);
  const pt2 = p => [num(p && p[0], 0), num(p && p[1], 0)];

  // Lo que ocupa cada ícono en pantalla alrededor de su punto: [izquierda, derecha, arriba, abajo], en px.
  const ICONO = {
    cometa: [12, 26, 16, 34], estaca: [5, 5, 10, 0], persona: [9, 9, 9, 0], globo: [17, 17, 44, 2], combi: [20, 20, 18, 0],
    auto: [16, 16, 14, 0], barco: [18, 18, 12, 2], lancha: [14, 14, 10, 2], dron: [15, 15, 7, 5], camara: [9, 9, 6, 6], ojo: [8, 8, 6, 6],
  };
  const TIPOS = ['cometa', 'estaca', 'antena', 'persona', 'globo', 'edificio', 'faro', 'acantilado', 'cerro', 'poste', 'letrero', 'arbol',
    'combi', 'auto', 'barco', 'lancha', 'dron', 'camara', 'ojo', 'tanque', 'escalera', 'tobogan'];

  // ---------- Escala: el mundo (metros) → la pantalla (px) ----------
  // Puntos del mundo que deben entrar, con el margen en px que pide cada uno (los íconos piden su tamaño).
  function puntosDe(d, e) {
    const ps = [];   // [x, y, izq, der, arriba, abajo]
    const add = (p, m = [0, 0, 0, 0]) => { const q = pt2(p); ps.push([q[0], q[1], ...m]); };
    for (const o of d.objetos || []) {
      if (!visible(o, e)) continue;
      const x = num(enPaso(o.x, e), 0), y = num(enPaso(o.y, e), 0), h = num(enPaso(o.h, e), 0), lado = o.lado === -1 ? -1 : 1;
      const ancho = num(enPaso(o.ancho, e), 0);
      if (ICONO[o.tipo]) { const ic = ICONO[o.tipo], dx = num(o.dx, 0); add([x, y], [ic[0] - dx, ic[1] + dx, ic[2], ic[3]]); }
      else if (o.tipo === 'edificio' || o.tipo === 'faro' || o.tipo === 'tanque') { add([x, h], [0, 0, o.tipo === 'faro' ? 16 : o.tipo === 'tanque' ? 4 : 2, 0]); add([x + lado * (ancho || 0), h], [lado < 0 ? 44 : 0, lado > 0 ? 44 : 0, 2, 0]); add([x, 0]); }
      else if (o.tipo === 'acantilado') { add([x, h]); add([x + lado * (ancho || 0), h], [lado < 0 ? 44 : 0, lado > 0 ? 44 : 0, 0, 0]); add([x, 0]); }
      else if (o.tipo === 'cerro') { add([x, h], [48, 0, 4, 0]); add([x - (ancho || h), 0]); add([x + (ancho || h), 0]); }   // a la izquierda de la punta, el rótulo de la altura
      else if (o.tipo === 'letrero') { add([x, h], [lado < 0 ? 22 : 4, lado > 0 ? 22 : 4, 3, 0]); add([x, 0]); }
      // A la izquierda del mástil va la cota de su altura con su rótulo («h = 12 m»): sin este margen, el rótulo caía
      // encima del mástil (lector en frío A, 19 nov). Lo mismo al lado de afuera de un edificio, un faro o un acantilado.
      else if (o.tipo === 'antena') { add([x, h], [82, 6, 8, 0]); add([x, 0], [82, 0, 0, 0]); }
      else if (o.tipo === 'poste') { add([x, h], [58, 6, 4, 0]); add([x, 0], [58, 0, 0, 0]); }
      else if (o.tipo === 'arbol') { add([x, h], [14, 14, 2, 0]); add([x, 0]); }
      else if (o.tipo === 'escalera') { add(o.de, [6, 6, 6, 0]); add(o.a, [6, 6, 6, 0]); }
      else if (o.tipo === 'tobogan') { add([x, h], [48, 8, 4, 0]); add([num(o.hasta, x + h), 0]); add([x, 0]); }
      else add([x, h], [4, 4, 2, 0]), add([x, 0]);
    }
    for (const l of d.lados || []) if (visible(l, e)) { add(l.de); add(l.a); }
    for (const a of d.angulos || []) if (visible(a, e)) add(a.en);
    for (const q of d.puntos || []) if (visible(q, e)) add(q.en, [12, 12, 12, 12]);
    for (const p of d.marco || []) add(p);
    return ps;
  }
  function escala(d, e) {
    const ps = puntosDe(d, e), suelo = d.suelo !== false;
    const ojo = Math.max(0, num(d.ojo, 0));
    const L = M + BORDE.izq, R = W - M - BORDE.der, TOP = M + BORDE.arriba, G = suelo ? H - M - BORDE.abajo : H - M - BORDE.abajo + 8;
    if (!ps.length) ps.push([0, 0, 0, 0, 0, 0], [1, 1, 0, 0, 0, 0]);
    // x: la mayor k con la que todos entran, con el corrimiento al centro de lo posible.
    const rangoX = k => { let lo = -Infinity, hi = Infinity; for (const p of ps) { lo = Math.max(lo, L + p[2] - k * p[0]); hi = Math.min(hi, R - p[3] - k * p[0]); } return [lo, hi]; };
    let kx = 1e4;
    { let a = 0, b = 1e4; for (let i = 0; i < 60; i++) { const m = (a + b) / 2, [lo, hi] = rangoX(m); if (lo <= hi) a = m; else b = m; } kx = a; }
    // y: con suelo, el suelo queda en G; sin suelo, se centra como x.
    let k = kx, e0 = 0, ox, oy, Y;
    if (suelo) {
      const altoLibre = (kk, p) => G - TOP - p[4];
      const usaOjo = kk => ojo > 0 && ojo * kk < OJO_PX;
      const F = (y, kk) => (usaOjo(kk) ? (y <= ojo ? y * OJO_PX / ojo : OJO_PX + (y - ojo) * kk) : y * kk);
      const cabe = kk => ps.every(p => F(p[1], kk) <= altoLibre(kk, p) + 1e-9);
      if (!cabe(k)) { let a = 0, b = k; for (let i = 0; i < 60; i++) { const m = (a + b) / 2; if (cabe(m)) a = m; else b = m; } k = a; }
      e0 = usaOjo(k) ? OJO_PX / ojo : k;
      Y = y => G - F(y, k);
    } else {
      const rangoY = kk => { let lo = -Infinity, hi = Infinity; for (const p of ps) { lo = Math.max(lo, TOP + p[4] + kk * p[1]); hi = Math.min(hi, G - p[5] + kk * p[1]); } return [lo, hi]; };
      let a = 0, b = k; for (let i = 0; i < 60; i++) { const m = (a + b) / 2, [lo, hi] = rangoY(m); if (lo <= hi) a = m; else b = m; }
      k = a;
      const [lo, hi] = rangoY(k); oy = (lo + hi) / 2;
      Y = y => oy - k * y;
    }
    const [lo, hi] = rangoX(k); ox = Number.isFinite(lo) && Number.isFinite(hi) ? (lo + hi) / 2 : L;
    const X = x => ox + k * x;
    return { k, X, Y, G, suelo, ojoPx: e0 * ojo, P: p => { const q = pt2(p); return [X(q[0]), Y(q[1])]; } };
  }

  // ---------- Rótulos: caja centrada en (x, y); no pisan otro rótulo ni cruzan una línea ----------
  const caja = (x, y, texto, o = {}) => {
    const tam = o.tam || 15, peso = o.peso || 600, w = T.ancho(String(texto), tam, peso);
    return { x: Math.min(W - M - 2 - w / 2, Math.max(M + 2 + w / 2, x)), y: Math.min(H - M - tam * 0.55, Math.max(M + tam * 0.55, y)), w, h: tam * 1.1, texto: String(texto), tam, peso, color: String(texto) === '?' || /=\s*\?$/.test(String(texto)) ? 'tinta' : o.color };
  };
  const pisa = (cs, b) => cs.some(c => Math.abs(c.x - b.x) < (c.w + b.w) / 2 + 3 && Math.abs(c.y - b.y) < (c.h + b.h) / 2 + 2);
  // ¿El segmento p–q cruza la caja b (agrandada en 2 px)?
  function cruza(b, p, q) {
    const x0 = b.x - b.w / 2 - 2, x1 = b.x + b.w / 2 + 2, y0 = b.y - b.h / 2 - 2, y1 = b.y + b.h / 2 + 2;
    let t0 = 0, t1 = 1;
    const dx = q[0] - p[0], dy = q[1] - p[1];
    for (const [pp, qq] of [[-dx, p[0] - x0], [dx, x1 - p[0]], [-dy, p[1] - y0], [dy, y1 - p[1]]]) {
      if (Math.abs(pp) < 1e-12) { if (qq < 0) return false; continue; }
      const r = qq / pp;
      if (pp < 0) { if (r > t1) return false; if (r > t0) t0 = r; } else { if (r < t0) return false; if (r < t1) t1 = r; }
    }
    return t0 <= t1;
  }
  const dentro = (c, x, y) => Math.abs(c.x - x) < 1 && Math.abs(c.y - y) < 1;
  function coloca(cs, segs, lugares, texto, o, obst = []) {
    if (texto === null || texto === undefined || texto === '') return null;
    const libre = c => !pisa(cs, c) && !pisa(obst, c) && !segs.some(s => s.duro && cruza(c, s.p, s.q));
    let b = null;
    for (const [x, y] of lugares) { const c = caja(x, y, texto, o); if (dentro(c, x, y) && libre(c)) { b = c; break; } }
    for (let rad = 6; !b && rad <= 80; rad += 5) for (let k = 0; k < 16 && !b; k++) {
      const x = lugares[0][0] + rad * Math.cos(k * Math.PI / 8), y = lugares[0][1] + rad * Math.sin(k * Math.PI / 8), c = caja(x, y, texto, o);
      if (dentro(c, x, y) && libre(c)) b = c;
    }
    b = b || caja(lugares[0][0], lugares[0][1], texto, o);
    cs.push(b);
    return b;
  }
  // Un lugar junto al punto p, hacia la dirección u (de la pantalla), sin que la caja toque p.
  const junto = (p, u, texto, sep = 6, tam = 15) => { const w = T.ancho(String(texto || ''), tam, 600), h = tam * 1.1, L = Math.hypot(u[0], u[1]) || 1, a = [u[0] / L, u[1] / L]; const dd = sep + Math.abs(a[0]) * w / 2 + Math.abs(a[1]) * h / 2; return [p[0] + a[0] * dd, p[1] + a[1] * dd]; };
  const rotulo = b => T.rotulo(b.x, b.y + b.tam * 0.33, b.texto, { ancla: 'middle', peso: b.peso, color: b.color, tam: b.tam, min: M, max: W - M })
    .replace('<text ', '<text stroke="var(--card)" stroke-width="4" stroke-linejoin="round" paint-order="stroke" ');

  // ---------- Objetos ----------
  function objeto(o, E, e, d) {
    const x = num(enPaso(o.x, e), 0), y = num(enPaso(o.y, e), 0), h = num(enPaso(o.h, e), 0), lado = o.lado === -1 ? -1 : 1;
    const P = E.P, op = o.tenue ? 0.35 : 1, g = s => `<g stroke-opacity="${op}" fill-opacity="${op}">${s}</g>`;
    const [X1, Y0] = P([x, y]), X0 = X1 + (ICONO[o.tipo] ? num(o.dx, 0) : 0);   // dx: corre el ícono en px (que no tape el vértice)
    switch (o.tipo) {
      case 'cometa': {
        // El rombo de la cometa, con su cola; (X0, Y0) es donde se amarra la pita (la punta de abajo del rombo).
        const top = [X0 + 6, Y0 - 16], izq = [X0 - 6, Y0 - 7], der = [X0 + 15, Y0 - 5];
        let s = poli([[X0, Y0], izq, top, der], `fill="currentColor" fill-opacity="0.12" ${tinta(2)}`);
        s += linea(top, [X0, Y0], tinta(1.2, 0.6)) + linea(izq, der, tinta(1.2, 0.6));
        s += poli([[X0 + 2, Y0 + 2], [X0 + 8, Y0 + 10], [X0 + 4, Y0 + 18], [X0 + 12, Y0 + 26], [X0 + 9, Y0 + 32]], tinta(1.5, 0.7), false);
        for (const [a, b] of [[[X0 + 6, Y0 + 8], [X0 + 10, Y0 + 12]], [[X0 + 6, Y0 + 22], [X0 + 10, Y0 + 26]]]) s += linea(a, b, tinta(2.5, 0.7));
        return g(s);
      }
      case 'estaca': return g(poli([[X0 - 2.5, Y0 + 1], [X0 - 2.5, Y0 - 8], [X0 + 2.5, Y0 - 8], [X0 + 2.5, Y0 + 1]], `fill="currentColor" fill-opacity="0.35" ${tinta(1.5)}`) + rect(X0 - 4.5, Y0 - 10, 9, 3, `fill="currentColor" stroke="none" rx="1"`));
      case 'antena': {
        const [, Yt] = P([x, h]), Yb = Y0;
        let s = linea([X0 - 3, Yb], [X0 - 1.5, Yt], tinta(1.8)) + linea([X0 + 3, Yb], [X0 + 1.5, Yt], tinta(1.8));
        const N = Math.max(2, Math.round((Yb - Yt) / 12));
        for (let i = 0; i < N; i++) { const ya = Yb - (Yb - Yt) * i / N, yb = Yb - (Yb - Yt) * (i + 1) / N; s += linea([X0 - 3 + 1.5 * i / N, ya], [X0 + 3 - 1.5 * (i + 1) / N, yb], tinta(1, 0.7)); }
        s += circulo([X0, Yt - 4], 3, `fill="var(--c-h)" stroke="none"`) + linea([X0, Yt], [X0, Yt - 2], tinta(1.5));
        return g(s);
      }
      case 'persona': {
        // De pie en (x, y); los ojos, a la altura `ojo` (con el tramo que no va a escala).
        const ojo = Math.max(0.5, num(d.ojo, 1.5)), [, Yo] = P([x, y + ojo]), alto = Y0 - Yo, cab = Math.max(4, alto * 0.14);
        const cuello = Yo + cab * 0.9, cadera = Y0 - alto * 0.45;
        let s = circulo([X0, Yo - cab * 0.2], cab, `fill="var(--card)" ${tinta(2)}`);
        s += circulo([X0 + lado * cab * 0.45, Yo - cab * 0.25], 1.3, `fill="currentColor" stroke="none"`);
        s += linea([X0, cuello], [X0, cadera], tinta(2.5)) + linea([X0, cadera], [X0 - 4, Y0], tinta(2.2)) + linea([X0, cadera], [X0 + 4, Y0], tinta(2.2));
        s += linea([X0, cuello + 3], [X0 - 5, cadera - 1], tinta(2)) + linea([X0, cuello + 3], [X0 + 5, cadera - 1], tinta(2));
        return g(s);
      }
      case 'globo': {
        // La canasta en (X0, Y0); el globo, arriba.
        let s = rect(X0 - 5, Y0 - 7, 10, 7, `fill="currentColor" fill-opacity="0.3" ${tinta(1.5)} rx="1.5"`);
        s += linea([X0 - 4, Y0 - 7], [X0 - 7, Y0 - 17], tinta(1.2)) + linea([X0 + 4, Y0 - 7], [X0 + 7, Y0 - 17], tinta(1.2));
        const c = [X0, Y0 - 30], r = 14;
        s += `<path d="M${n(X0 - 7)} ${n(Y0 - 17)}C${n(X0 - 17)} ${n(Y0 - 24)} ${n(c[0] - r - 2)} ${n(c[1] - r)} ${n(X0)} ${n(c[1] - r)}C${n(c[0] + r + 2)} ${n(c[1] - r)} ${n(X0 + 17)} ${n(Y0 - 24)} ${n(X0 + 7)} ${n(Y0 - 17)}Z" fill="currentColor" fill-opacity="0.12" ${tinta(2)}/>`;
        s += `<path d="M${n(X0 - 2)} ${n(Y0 - 17)}C${n(X0 - 6)} ${n(Y0 - 30)} ${n(X0 - 5)} ${n(c[1] - r + 2)} ${n(X0)} ${n(c[1] - r)}C${n(X0 + 5)} ${n(c[1] - r + 2)} ${n(X0 + 6)} ${n(Y0 - 30)} ${n(X0 + 2)} ${n(Y0 - 17)}" ${tinta(1.2, 0.6)}/>`;
        return g(s);
      }
      case 'edificio': case 'tanque': {
        const ancho = num(enPaso(o.ancho, e), 6), [Xa, Yt] = P([x, h]), [Xb] = P([x + lado * ancho, h]);
        const xi = Math.min(Xa, Xb), w = Math.abs(Xb - Xa);
        if (o.tipo === 'tanque') {
          const t = Math.min(26, (Y0 - Yt) * 0.35), s0 = linea([xi + w * 0.2, Y0], [xi + w * 0.3, Yt + t], tinta(2)) + linea([xi + w * 0.8, Y0], [xi + w * 0.7, Yt + t], tinta(2));
          return g(s0 + linea([xi + w * 0.25, (Y0 + Yt + t) / 2], [xi + w * 0.75, (Y0 + Yt + t) / 2], tinta(1.2, 0.6)) + rect(xi, Yt, w, t, `fill="currentColor" fill-opacity="0.12" ${tinta(2)} rx="3"`));
        }
        let s = rect(xi, Yt, w, Y0 - Yt, `fill="currentColor" fill-opacity="0.08" ${tinta(2)}`);
        if (o.liso) return g(s + linea([xi, Yt], [xi + w, Yt], tinta(3)));   // una pared lisa (la de una casa de adobe)
        const filas = Math.max(1, Math.min(8, Math.floor((Y0 - Yt - 8) / 14))), cols = Math.max(1, Math.min(4, Math.floor((w - 4) / 10)));
        for (let i = 0; i < filas; i++) for (let j = 0; j < cols; j++) s += rect(xi + 4 + j * (w - 8) / cols + 1, Yt + 6 + i * 14, Math.max(2, (w - 8) / cols - 3), 6, `fill="currentColor" fill-opacity="0.22" stroke="none"`);
        return g(s);
      }
      case 'faro': {
        const ancho = num(enPaso(o.ancho, e), 4), [Xa, Yt] = P([x, h]), [Xb] = P([x + lado * ancho, h]), w = Math.abs(Xb - Xa), xi = Math.min(Xa, Xb);
        const ab = Math.max(w * 1.4, w + 6), base = lado > 0 ? [Xa, Xa + lado * ab] : [Xa + lado * ab, Xa];
        let s = poli([[Math.min(...base), Y0], [Math.max(...base), Y0], [xi + w, Yt], [xi, Yt]], `fill="currentColor" fill-opacity="0.08" ${tinta(2)}`);
        const N = 3;
        for (let i = 1; i <= N; i++) { const yy = Y0 - (Y0 - Yt) * i / (N + 1), t = (Y0 - yy) / (Y0 - Yt), a = Math.min(...base) + (xi - Math.min(...base)) * t, b = Math.max(...base) + (xi + w - Math.max(...base)) * t; s += linea([a, yy], [b, yy], `stroke="var(--c-h)" stroke-width="4" stroke-opacity="0.55"`); }
        s += rect(xi + w / 2 - 4, Yt - 10, 8, 10, `fill="var(--c-o)" fill-opacity="0.35" ${tinta(1.5)}`) + poli([[xi + w / 2 - 6, Yt - 10], [xi + w / 2 + 6, Yt - 10], [xi + w / 2, Yt - 16]], `fill="currentColor" ${tinta(1.2)}`);
        return g(s);
      }
      case 'acantilado': {
        const ancho = num(enPaso(o.ancho, e), 10), [Xa, Yt] = P([x, h]), [Xb] = P([x + lado * ancho, h]), alto = Y0 - Yt;
        const ps = [[Xa, Yt], [Xa + lado * 3, Yt + alto * 0.3], [Xa - lado * 2, Yt + alto * 0.55], [Xa + lado * 4, Yt + alto * 0.8], [Xa + lado * 2, Y0], [Xb, Y0], [Xb, Yt]];
        return g(poli(ps, `fill="currentColor" fill-opacity="0.14" ${tinta(2)}`));
      }
      case 'cerro': {
        const ancho = num(enPaso(o.ancho, e), h), [Xp, Yp] = P([x, h]), [Xi] = P([x - ancho, 0]), [Xd] = P([x + ancho, 0]), alto = Y0 - Yp;
        const ps = [[Xi, Y0], [Xi + (Xp - Xi) * 0.35, Y0 - alto * 0.42], [Xi + (Xp - Xi) * 0.6, Y0 - alto * 0.55], [Xp - 6, Yp + 4], [Xp, Yp], [Xp + 7, Yp + 6], [Xp + (Xd - Xp) * 0.45, Y0 - alto * 0.6], [Xp + (Xd - Xp) * 0.7, Y0 - alto * 0.35], [Xd, Y0]];
        return g(poli(ps, `fill="currentColor" fill-opacity="0.12" ${tinta(2)}`) + poli([[Xp - 6, Yp + 4], [Xp, Yp], [Xp + 7, Yp + 6], [Xp + 3, Yp + 9], [Xp - 2, Yp + 7]], `fill="var(--card)" stroke="none"`));
      }
      case 'escalera': {
        // Dos largueros paralelos y sus peldaños, de `de` a `a`.
        const p = P(o.de), q = P(o.a), v = [q[0] - p[0], q[1] - p[1]], L = Math.hypot(v[0], v[1]) || 1, u = [v[0] / L, v[1] / L], w = [-u[1] * 4, u[0] * 4];
        let s = linea([p[0] + w[0], p[1] + w[1]], [q[0] + w[0], q[1] + w[1]], tinta(2)) + linea([p[0] - w[0], p[1] - w[1]], [q[0] - w[0], q[1] - w[1]], tinta(2));
        const N = Math.max(3, Math.floor(L / 11));
        for (let i = 1; i < N; i++) { const c = [p[0] + v[0] * i / N, p[1] + v[1] * i / N]; s += linea([c[0] + w[0], c[1] + w[1]], [c[0] - w[0], c[1] - w[1]], tinta(1.5)); }
        return g(s);
      }
      case 'tobogan': {
        const [, Yt] = P([x, h]), [Xh] = P([num(o.hasta, x + h), 0]);
        let s = linea([X0, Y0], [X0, Yt], tinta(2)) + linea([X0 - lado * 8, Y0], [X0 - lado * 8, Yt], tinta(2));
        for (let yy = Y0 - 9; yy > Yt + 3; yy -= 9) s += linea([X0, yy], [X0 - lado * 8, yy], tinta(1.3));
        s += linea([X0 - lado * 8, Yt], [X0, Yt], tinta(3));
        return g(s);
      }
      case 'poste': { const [, Yt] = P([x, h]); return g(linea([X0, Y0], [X0, Yt], tinta(4)) + linea([X0 - 5, Yt + 2], [X0 + 5, Yt + 2], tinta(2))); }
      case 'letrero': {
        const h1 = num(enPaso(o.h1, e), 0), [, Yt] = P([x, h]), [, Yb] = P([x, h1]), w = 20;
        let s = linea([X0 + lado * (w * 0.5), Y0], [X0 + lado * (w * 0.5), Yb], tinta(3));
        s += rect(lado > 0 ? X0 : X0 - w, Yt, w, Yb - Yt, `fill="var(--c-o)" fill-opacity="0.14" ${tinta(2)} rx="2"`);
        for (let i = 1; i <= 3; i++) { const yy = Yt + (Yb - Yt) * i / 4; s += linea([lado > 0 ? X0 + 4 : X0 - w + 4, yy], [lado > 0 ? X0 + w - 4 : X0 - 4, yy], tinta(1.5, 0.35)); }
        return g(s);
      }
      case 'arbol': {
        const [, Yt] = P([x, h]), alto = Y0 - Yt, r = Math.min(14, alto * 0.3);
        return g(linea([X0, Y0], [X0, Yt + r], tinta(3.5)) + circulo([X0, Yt + r], r, `fill="currentColor" fill-opacity="0.15" ${tinta(2)}`));
      }
      case 'combi': case 'auto': {
        const w = o.tipo === 'combi' ? 36 : 30, hh = o.tipo === 'combi' ? 15 : 11, x0 = X0 - w / 2;
        let s = `<path d="M${n(x0)} ${n(Y0 - 4)}L${n(x0)} ${n(Y0 - hh)}L${n(x0 + w * (lado > 0 ? 0.75 : 0.12))} ${n(Y0 - hh)}L${n(x0 + w * (lado > 0 ? 0.92 : 0.02) + (lado > 0 ? 3 : -3))} ${n(Y0 - hh * 0.5)}L${n(x0 + w)} ${n(Y0 - hh * 0.45)}L${n(x0 + w)} ${n(Y0 - 4)}Z" fill="currentColor" fill-opacity="0.12" ${tinta(2)}/>`;
        s += rect(x0 + 4, Y0 - hh + 3, w * 0.4, hh * 0.3, `fill="currentColor" fill-opacity="0.3" stroke="none" rx="1"`);
        s += circulo([x0 + 8, Y0 - 3], 3.5, `fill="var(--card)" ${tinta(2)}`) + circulo([x0 + w - 8, Y0 - 3], 3.5, `fill="var(--card)" ${tinta(2)}`);
        return g(s);
      }
      case 'barco': case 'lancha': {
        const w = o.tipo === 'barco' ? 34 : 26;
        let s = poli([[X0 - w / 2, Y0 - 6], [X0 + w / 2, Y0 - 6], [X0 + w / 2 - 6, Y0 + 1], [X0 - w / 2 + 4, Y0 + 1]], `fill="currentColor" fill-opacity="0.2" ${tinta(2)}`);
        s += o.tipo === 'barco' ? rect(X0 - 6, Y0 - 12, 12, 6, `fill="none" ${tinta(1.5)}`) : linea([X0, Y0 - 6], [X0, Y0 - 10], tinta(1.5));
        return g(s);
      }
      case 'dron': return g(rect(X0 - 5, Y0 - 3, 10, 6, `fill="currentColor" fill-opacity="0.3" ${tinta(1.5)} rx="2"`) + linea([X0 - 5, Y0 - 1], [X0 - 12, Y0 - 4], tinta(1.5)) + linea([X0 + 5, Y0 - 1], [X0 + 12, Y0 - 4], tinta(1.5))
        + linea([X0 - 16, Y0 - 5], [X0 - 8, Y0 - 5], tinta(2)) + linea([X0 + 8, Y0 - 5], [X0 + 16, Y0 - 5], tinta(2)));
      case 'camara': return g(rect(X0 - 7, Y0 - 4, 11, 8, `fill="currentColor" fill-opacity="0.3" ${tinta(1.5)} rx="1.5"`) + poli([[X0 + 4, Y0 - 2], [X0 + 8, Y0 - 4], [X0 + 8, Y0 + 4], [X0 + 4, Y0 + 2]], `fill="currentColor" ${tinta(1)}`));
      case 'ojo': return g(`<path d="M${n(X0 - 7)} ${n(Y0)}Q${n(X0)} ${n(Y0 - 7)} ${n(X0 + 7)} ${n(Y0)}Q${n(X0)} ${n(Y0 + 7)} ${n(X0 - 7)} ${n(Y0)}Z" fill="var(--card)" ${tinta(1.5)}/>` + circulo([X0, Y0], 2.3, `fill="currentColor" stroke="none"`));
      default: return '';
    }
  }

  // ---------- La escena ----------
  function geometria(d = {}, e = {}) {
    const E = escala(d, e), P = E.P, cajas = [], segs = [], obst = [];
    let s = '';
    if (E.suelo) {
      s += linea([M + 2, E.G], [W - M - 2, E.G], tinta(2, 0.6));
      segs.push({ p: [M + 2, E.G], q: [W - M - 2, E.G], duro: true });
      const ag = d.agua;
      if (Array.isArray(ag)) {
        const a = Math.max(M + 2, Math.min(E.X(num(ag[0], 0)), E.X(num(ag[1], 0)))), b = Math.min(W - M - 2, Math.max(E.X(num(ag[0], 0)), E.X(num(ag[1], 0))));
        s += rect(a, E.G, b - a, 8, `fill="var(--c-i)" fill-opacity="0.12" stroke="none"`);
        for (let x = a + 4; x < b - 8; x += 16) s += `<path d="M${n(x)} ${n(E.G + 4)}q4 -3 8 0" ${trazo('i', 1.2)} stroke-opacity="0.6"/>`;
      }
    }
    for (const o of d.objetos || []) {
      if (!visible(o, e) || !TIPOS.includes(o.tipo)) continue;
      s += objeto(o, E, e, d);
      // Los íconos son obstáculos para los rótulos (un rótulo encima de la combi no se lee).
      const ic = (o.tipo === 'cometa' ? [10, 16, 16, 6] : ICONO[o.tipo]), q0 = P([num(enPaso(o.x, e), 0), num(enPaso(o.y, e), 0)]), q = [q0[0] + (ic ? num(o.dx, 0) : 0), q0[1]];
      if (ic) obst.push({ x: q[0] + (ic[1] - ic[0]) / 2, y: q[1] + (ic[3] - ic[2]) / 2, w: ic[0] + ic[1], h: ic[2] + ic[3] });
      if (o.tipo === 'persona') { const [, Yo] = P([q[0] === q[0] ? num(enPaso(o.x, e), 0) : 0, num(enPaso(o.y, e), 0) + Math.max(0.5, num(d.ojo, 1.5))]); obst.push({ x: q[0], y: (q[1] + Yo) / 2 - 3, w: 18, h: q[1] - Yo + 10 }); }
    }
    // Horizontales del ojo (punteadas, en tinta).
    for (const hz of d.horizontales || []) {
      if (!visible(hz, e)) continue;
      const p = P(hz.en), q = [E.X(num(hz.hasta, 0)), p[1]];
      s += linea(p, q, tinta(1.5, 0.75) + ' stroke-dasharray="6 5"');
      segs.push({ p, q, duro: true });
    }
    // Los lados: primero los trazos, después los rótulos (para que los rótulos esquiven todos los trazos).
    const pend = [];
    for (const l of d.lados || []) {
      if (!visible(l, e)) continue;
      const p = P(l.de), q = P(l.a), como = l.como || 'linea', c = l.color, texto = enPaso(l.texto, e);
      const v = [q[0] - p[0], q[1] - p[1]], L = Math.hypot(v[0], v[1]) || 1, u = [v[0] / L, v[1] / L], nrm = [u[1], -u[0]];   // a la izquierda de p→q
      const lado = l.lado === -1 ? -1 : 1, nn = [nrm[0] * lado, nrm[1] * lado];
      if (como === 'cota') {
        const sep = num(l.sep, 14), a = [p[0] + nn[0] * sep, p[1] + nn[1] * sep], b = [q[0] + nn[0] * sep, q[1] + nn[1] * sep];
        const col = c ? T.color(c) : 'currentColor';
        s += linea(a, b, `stroke="${col}" stroke-width="2" stroke-linecap="round"`);
        for (const z of [a, b]) s += linea([z[0] - nn[0] * 5, z[1] - nn[1] * 5], [z[0] + nn[0] * 5, z[1] + nn[1] * 5], `stroke="${col}" stroke-width="2" stroke-linecap="round"`);
        segs.push({ p: a, q: b, duro: true });
        pend.push({ texto, color: c, lugares: [junto([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], nn, texto, 4), junto([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], [-nn[0], -nn[1]], texto, 4)] });
      } else {
        const g = como === 'vista' ? tinta(1.8, 0.85) + ' stroke-dasharray="6 5"' : como === 'punteada' ? trazo(c, 2.5, ' stroke-dasharray="6 5"') : c ? trazo(c, 4) : tinta(3);
        s += linea(p, q, g);
        segs.push({ p, q, duro: true });
        const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
        pend.push({ texto, color: c, lugares: [junto(m, nn, texto, 5), junto([p[0] + v[0] * 0.35, p[1] + v[1] * 0.35], nn, texto, 5), junto([p[0] + v[0] * 0.65, p[1] + v[1] * 0.65], nn, texto, 5), junto(m, [-nn[0], -nn[1]], texto, 5), junto([p[0] + v[0] * 0.35, p[1] + v[1] * 0.35], [-nn[0], -nn[1]], texto, 5)] });
      }
    }
    // Ángulos rectos.
    for (const r of d.rectos || []) {
      if (!visible(r, e)) continue;
      const c = P(r.en), a = P(r.de), b = P(r.a), ua = unit([a[0] - c[0], a[1] - c[1]]), ub = unit([b[0] - c[0], b[1] - c[1]]), t = 9;
      s += poli([[c[0] + ua[0] * t, c[1] + ua[1] * t], [c[0] + ua[0] * t + ub[0] * t, c[1] + ua[1] * t + ub[1] * t], [c[0] + ub[0] * t, c[1] + ub[1] * t]], tinta(1.5), false);
    }
    // Ángulos: el arco y su rótulo dentro de la abertura (o afuera si es angosta).
    const pendA = [];
    for (const a of d.angulos || []) {
      if (!visible(a, e)) continue;
      const c = P(a.en), p1 = P(a.de), p2 = P(a.a), col = a.color || 'h';
      const a1 = Math.atan2(-(p1[1] - c[1]), p1[0] - c[0]), a2 = Math.atan2(-(p2[1] - c[1]), p2[0] - c[0]);
      let da = a2 - a1; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
      const r = num(a.radio, 24), N = Math.max(3, Math.ceil(Math.abs(da) / (4 * RAD)));
      const arc = Array.from({ length: N + 1 }, (_, i) => { const t = a1 + da * i / N; return [c[0] + r * Math.cos(t), c[1] - r * Math.sin(t)]; });
      const arco = poli(arc, trazo(col, 2.5), false);   // se dibuja después de colocar el rótulo (puede crecer hasta él)
      const mid = a1 + da / 2, dir = [Math.cos(mid), -Math.sin(mid)], texto = enPaso(a.texto, e);
      // El rótulo, dentro de la abertura: sobre la bisectriz, tan lejos del vértice como pida su caja para no tocar
      // ninguno de los dos lados (en un ángulo angosto, más lejos). Si así queda muy lejos, afuera, junto al arco.
      const wb = T.ancho(String(texto || ''), 15, 600) / 2 + 3, hb = 8.25 + 3, mitadA = Math.abs(da) / 2;
      const radio = Math.hypot(wb, hb), lejos = Math.max(r + 8 + radio, radio / Math.max(0.05, Math.sin(Math.min(mitadA, Math.PI / 2))) + 2);
      const lug = [];
      for (const dd of [r + 6 + radio * 0.6, r + 6 + radio]) if (dd < lejos) lug.push([c[0] + dir[0] * dd, c[1] + dir[1] * dd]);
      // Lejos sobre la bisectriz solo si ahí sigue dentro del triángulo (no más allá del lado más corto que sale del vértice).
      const corto = Math.min(Math.hypot(p1[0] - c[0], p1[1] - c[1]), Math.hypot(p2[0] - c[0], p2[1] - c[1]));
      if (lejos <= 95 && (lejos + 10) * Math.cos(mitadA) + wb <= corto) lug.push([c[0] + dir[0] * lejos, c[1] + dir[1] * lejos], [c[0] + dir[0] * (lejos + 10), c[1] + dir[1] * (lejos + 10)]);
      for (const t of [a2 + Math.sign(da) * 0.35, a1 - Math.sign(da) * 0.35]) lug.push(junto([c[0] + Math.cos(t) * (r + 2), c[1] - Math.sin(t) * (r + 2)], [Math.cos(t), -Math.sin(t)], texto, 2));
      // Si todo eso choca (escena apretada), más lugares alrededor del arco, del más cercano al más lejano, antes de
      // buscar en espiral: así el rótulo no se va lejos de su vértice.
      for (const sep of [2, 10, 20]) for (const giro of [0.7, 1.05, 1.4, 1.75]) for (const t of [a2 + Math.sign(da) * giro, a1 - Math.sign(da) * giro]) {
        lug.push(junto([c[0] + Math.cos(t) * (r + 2), c[1] - Math.sin(t) * (r + 2)], [Math.cos(t), -Math.sin(t)], texto, sep));
      }
      pendA.push({ texto, color: col, lugares: lug, c, a1, da, r, corto, arco });
      segs.push({ p: arc[0], q: arc[arc.length - 1], duro: false });
    }
    // Rótulos: ángulos primero (son los más chicos y van pegados a su vértice), después los lados. Con suelo, el rótulo de
    // un ángulo nunca va bajo el suelo (cierre, 19 nov: el «60°» de la combi quedaba debajo, junto al cerro).
    const bajoSuelo = E.suelo ? [{ x: W / 2, y: (E.G + H) / 2 + 2, w: 2 * W, h: H - E.G }] : [];
    for (const x of pendA) {
      const b = coloca(cajas, segs, x.lugares, x.texto, { color: x.color }, obst.concat(bajoSuelo));
      // Si el rótulo quedó dentro de la abertura pero lejos del vértice (un ángulo angosto), el arco crece hasta él: el
      // rótulo queda junto a su arco (sin pasar del lado más corto que sale del vértice).
      if (!b) { s += x.arco; continue; }
      const dn = Math.hypot(Math.max(Math.abs(b.x - x.c[0]) - b.w / 2, 0), Math.max(Math.abs(b.y - x.c[1]) - b.h / 2, 0));
      let rel = (Math.atan2(-(b.y - x.c[1]), b.x - x.c[0]) - x.a1) * Math.sign(x.da || 1);
      while (rel < -Math.PI) rel += 2 * Math.PI; while (rel > Math.PI) rel -= 2 * Math.PI;
      const r2 = Math.min(dn - 4, x.corto - 6);
      if (rel > 0 && rel < Math.abs(x.da) && r2 > x.r + 8) {
        const N2 = Math.max(3, Math.ceil(Math.abs(x.da) / (4 * RAD)));
        s += poli(Array.from({ length: N2 + 1 }, (_, i) => { const t = x.a1 + x.da * i / N2; return [x.c[0] + r2 * Math.cos(t), x.c[1] - r2 * Math.sin(t)]; }), trazo(x.color, 2.5), false);
      } else s += x.arco;
    }
    for (const x of pend) coloca(cajas, segs, x.lugares, x.texto, { color: x.color }, obst);
    // Nombres cortos junto a los objetos («tú», «combi», «faro»).
    for (const o of d.objetos || []) {
      const t = enPaso(o.texto, e);
      if (!visible(o, e) || !t) continue;
      const [X0, Y0] = P([num(enPaso(o.x, e), 0), num(enPaso(o.y, e), 0)]), ic = ICONO[o.tipo] || [10, 10, 30, 0], w = T.ancho(t, 14, 500) / 2 + 4;
      coloca(cajas, segs, [[X0 - ic[0] - w, Y0 - ic[2] / 2], [X0 + ic[1] + w, Y0 - ic[2] / 2], [X0, Y0 - ic[2] - 10], [X0, Math.min(H - M - 9, Y0 + ic[3] + 12)]], t, { tam: 14, peso: 500 }, obst);
    }
    for (const q of d.puntos || []) {
      if (!visible(q, e)) continue;
      const p = P(q.en), t = enPaso(q.texto, e), dir = Array.isArray(q.dir) ? q.dir : [0, -1];
      s += circulo(p, 2.5, 'fill="currentColor" stroke="none"');
      coloca(cajas, segs, [junto(p, dir, t, 4), junto(p, [-dir[0], -dir[1]], t, 4)], t, { tam: 15, peso: 600 }, obst);
    }
    const nota = enPaso(d.nota, e);
    if (nota) coloca(cajas, [], [[W / 2, M + 9]], nota, { tam: 14, peso: 500 });
    return { s, cajas, segs, k: E.k, X: E.X, Y: E.Y, G: E.G, P };
  }
  function unit(v) { const L = Math.hypot(v[0], v[1]) || 1; return [v[0] / L, v[1] / L]; }

  function dibujar(datos = {}, estado = {}) {
    const g = geometria(datos, estado);
    return T.svg(W, H, `<g class="kit-objeto" data-objeto="vista" data-prueba="si">${g.s}</g>${g.cajas.map(rotulo).join('')}`, { alt: alt(datos) });
  }
  const NOMBRE = { cometa: 'una cometa', estaca: 'una estaca', antena: 'una antena', persona: 'una persona', globo: 'un globo aerostático',
    edificio: 'un edificio', faro: 'un faro', acantilado: 'un acantilado', cerro: 'un cerro', poste: 'un poste', letrero: 'un letrero en un poste',
    arbol: 'un árbol', combi: 'una combi', auto: 'un auto', barco: 'un barco', lancha: 'una lancha', dron: 'un dron', camara: 'una cámara', ojo: 'un punto de observación', tanque: 'un tanque elevado' };
  function alt(d = {}) {
    if (d.alt) return d.alt;
    const os = [...new Set((d.objetos || []).map(o => NOMBRE[o.tipo]).filter(Boolean))];
    const nv = (d.lados || []).filter(l => l.como === 'vista').length, na = (d.angulos || []).length;
    return `Escena de lado${os.length ? `: ${os.join(', ')}` : ''}${d.suelo === false ? '' : ', sobre el suelo horizontal'}${nv ? `, con ${nv === 1 ? 'una visual punteada' : `${nv} visuales punteadas`}` : ''}${na ? ` y ${na === 1 ? 'un ángulo marcado' : `${na} ángulos marcados`}` : ''}.`;
  }

  return { id: 'trig-vista', dibujar, alt, geometria, TIPOS, constantes: { W, H, M, OJO_PX } };
});
