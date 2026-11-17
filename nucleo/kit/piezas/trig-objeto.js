/*
 * Pieza «trig-objeto» (17 nov 2026): objetos de la vida real que esconden un triángulo rectángulo, para la teoría de
 * «Razones trigonométricas de ángulos agudos» (contenido/teoria/trigonometria/razones-trigonometricas-agudas.js).
 * Dibujos de prueba (data-prueba): Gerson decide después cuáles reemplaza (docs/plan-calidad.md, M4).
 *
 * Afirmación de la figura: el triángulo es el objeto. Cada lado es una parte que se ve (la escalera, la pared, el
 * piso) y lleva su medida pegada; los ángulos van en carmín, con su arco y su letra; el ángulo recto, con su cuadradito.
 *
 * Fidelidad: una sola escala para los dos ejes; los lados se dibujan a escala con sus medidas (en metros o cm).
 *
 * Cada objeto tiene tres vértices: el del ángulo recto (r) y dos agudos (a y b). Sus lados son ra (de r a a), rb (de r a
 * b) y h (de a a b, la hipotenusa). Cada objeto les pone nombres propios (alias), que valen en medidas, lados y angulos:
 *   escalera  lados { piso: ra, pared: rb, escalera: h }       angulos { pie: a, arriba: b }
 *             una escalera apoyada en la pared de una casa de adobe (la casa a la derecha)
 *   rampa     lados { base: ra, alto: rb, rampa: h }            angulos { abajo: a, arriba: b }
 *             una rampa que sube a una vereda
 *   poste     lados { suelo: ra, poste: rb, cable: h }          angulos { suelo: a, arriba: b }
 *             un poste con su cable a una estaca; con sombra: true, la sombra en el suelo (alias sombra: ra) y el rayo
 *             de sol (alias rayo: h, punteado) que pasa por la punta del poste, con el sol lejos, en la misma dirección
 *   repisa    lados { pared: ra, brazo: rb, tirante: h }        angulos { abajo: a, punta: b }
 *             una repisa en la pared: el ángulo recto arriba, donde el brazo horizontal toca la pared
 *   chacra    lados { ra, rb, h }                               una chacra vista desde arriba, con la hipotenusa abajo
 *   triangulo lados { ra, rb, h }, giro (grados), vertices: { r: 'Q', a: 'P', b: 'R' }   un triángulo girado, de examen
 * Para las ideas 2 a 5 (más adelante): el poste con sombra sirve al poste y el primo; faltan las escuadras con la loseta
 * y la señal, la cuerda del albañil y el techo a dos aguas.
 *
 * datos = {
 *   objeto, medidas: { piso: 3, pared: 4 },          largos de los catetos ra y rb, en la unidad del problema
 *   marco: [ra, rb],                                 opcional: fija la escala (el juego, para que el pie siga al dedo)
 *   lados: { piso: { color: 'f', texto, texto2, paso } },   color: token del kit; texto (línea 1, 16) y texto2 (línea 2,
 *            14): un texto o [{ t, paso }] (se ve el último cuyo paso ya llegó); paso: desde cuándo se pinta el color
 *   angulos: { pie: { texto: 'θ', color: 'h', paso } },     solo los que se nombran; color carmín por omisión
 *   recto: true,                                     el cuadradito del ángulo recto (por omisión, sí)
 * }
 * estado = { paso: 0..n, final }. Función pura de (datos, estado): sin ids, sin azar, sin reloj. Lienzo de 320 × 256.
 * Colores: currentColor (tinta) y var(--c-*); el halo de los rótulos, var(--card).
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
  const W = 320, H = 256, M = 4, SUELO = 200;
  const n = T.n;
  const tinta = (g = 2, op) => `stroke="currentColor" stroke-width="${g}" stroke-linejoin="round" stroke-linecap="round"${op !== undefined ? ` stroke-opacity="${op}"` : ''}`;
  const obj = (nombre, s) => `<g class="kit-objeto" data-objeto="${nombre}" data-prueba="si">${s}</g>`;
  const halo = s => s.replace(/<text /g, '<text stroke="var(--card)" stroke-width="4" stroke-linejoin="round" paint-order="stroke" ');
  const linea = (p, q, attrs) => `<line x1="${n(p[0])}" y1="${n(p[1])}" x2="${n(q[0])}" y2="${n(q[1])}" ${attrs}/>`;
  const poli = (ps, attrs) => `<path d="M${ps.map(p => `${n(p[0])} ${n(p[1])}`).join('L')}Z" ${attrs}/>`;
  const resta = (p, q) => [p[0] - q[0], p[1] - q[1]];
  const suma = (p, q, k = 1) => [p[0] + q[0] * k, p[1] + q[1] * k];
  const largo = v => Math.hypot(v[0], v[1]) || 1;
  const unit = v => { const L = largo(v); return [v[0] / L, v[1] / L]; };

  const ALIAS = {
    escalera: { lados: { piso: 'ra', pared: 'rb', escalera: 'h' }, angulos: { pie: 'a', arriba: 'b' } },
    rampa: { lados: { base: 'ra', alto: 'rb', rampa: 'h' }, angulos: { abajo: 'a', arriba: 'b' } },
    poste: { lados: { suelo: 'ra', sombra: 'ra', poste: 'rb', cable: 'h', rayo: 'h' }, angulos: { suelo: 'a', arriba: 'b' } },
    repisa: { lados: { pared: 'ra', brazo: 'rb', tirante: 'h' }, angulos: { abajo: 'a', punta: 'b' } },
    chacra: { lados: {}, angulos: {} },
    triangulo: { lados: {}, angulos: {} },
  };
  // Nombres de los lados para el texto alternativo.
  const NOMBRES = {
    escalera: { ra: 'piso', rb: 'pared', h: 'escalera' }, rampa: { ra: 'base', rb: 'altura', h: 'rampa' },
    poste: { ra: 'suelo', rb: 'poste', h: 'cable' }, sombra: { ra: 'sombra', rb: 'poste', h: 'rayo de sol' },
    repisa: { ra: 'pared', rb: 'brazo', h: 'tirante' }, chacra: { ra: 'cerca', rb: 'cerca', h: 'cerca larga' },
    triangulo: { ra: 'cateto', rb: 'cateto', h: 'hipotenusa' },
  };
  // Pasa los alias de un objeto a las claves de la pieza (ra, rb, h; a, b).
  function normal(d) {
    const al = ALIAS[d.objeto] || { lados: {}, angulos: {} };
    const mapa = (o, tipo) => { const r = {}; for (const [k, v] of Object.entries(o || {})) r[al[tipo][k] || k] = v; return r; };
    return { med: mapa(d.medidas, 'lados'), lados: mapa(d.lados, 'lados'), angulos: mapa(d.angulos, 'angulos') };
  }

  // Suelo: línea y banda tenue, de punta a punta.
  const suelo = (x0 = 8, x1 = W - 6) => linea([x0, SUELO], [x1, SUELO], tinta(2)) + `<rect x="${x0}" y="${SUELO}" width="${x1 - x0}" height="4" fill="currentColor" fill-opacity="0.12"/>`;
  // Muro de adobe: relleno tenue y juntas de los adobes (filas de 12, juntas alternadas cada 30).
  function adobe(x0, y0, x1, y1) {
    let s = `<rect x="${n(x0)}" y="${n(y0)}" width="${n(x1 - x0)}" height="${n(y1 - y0)}" fill="currentColor" fill-opacity="0.07"/>`;
    let juntas = '';
    for (let y = y1 - 12, fila = 0; y > y0 + 4; y -= 12, fila++) {
      juntas += `M${n(x0)} ${n(y)}L${n(x1)} ${n(y)}`;
      for (let x = x0 + 12 + (fila % 2) * 15; x < x1 - 4; x += 30) juntas += `M${n(x)} ${n(y)}L${n(x)} ${n(Math.min(y + 12, y1))}`;
    }
    return s + `<path d="${juntas}" fill="none" ${tinta(1, 0.28)}/>`;
  }

  // Cada objeto: geometría en px (r, a, b) y su dibujo. col(k): color del lado k (o tinta). Devuelve también los lados
  // que el objeto pinta con su propio dibujo (propios) y si alguno va punteado.
  const OBJETOS = {
    // escalera: «una escalera apoyada en la pared de una casa de adobe es la hipotenusa; la pared y el piso, los catetos».
    escalera(m, d, col) {
      const mk = d.marco || [];
      const s = Math.min(160 / Math.max(m.ra, mk[0] || 0), 168 / Math.max(m.rb, mk[1] || 0));
      const XW = 196, r = [XW, SUELO], a = [XW - m.ra * s, SUELO], b = [XW, SUELO - m.rb * s];
      let fondo = adobe(XW, 16, W - 6, SUELO) + linea([XW, 16], [XW, SUELO], tinta(2));
      fondo += `<path d="M${XW - 10} 16L${W - 6} 16L${W - 6} 9L${XW - 4} 9Z" fill="currentColor" fill-opacity="0.3" ${tinta(1.5)}/>`;
      // Una ventana arriba, lejos de los rótulos de la pared (que van a media altura).
      fondo += `<rect x="262" y="30" width="36" height="30" rx="2" fill="var(--card)" ${tinta(2)}/>` + linea([280, 30], [280, 60], tinta(1.5)) + linea([262, 45], [298, 45], tinta(1.5));
      fondo += suelo();
      // Dos largueros: uno es el lado (de a a b); el otro, 7 más afuera. Peldaños cada 14 px.
      const u = unit(resta(b, a)), q = [u[1], -u[0]], L = largo(resta(b, a));
      const a2 = suma(a, q, 7), b2 = suma(b, q, 7);
      let frente = linea(a2, b2, `stroke="${col('h')}" stroke-width="2.5" stroke-linecap="round"`);
      const k = Math.max(2, Math.floor(L / 14));
      let pel = '';
      for (let i = 1; i < k; i++) { const p = suma(a, resta(b, a), i / k), p2 = suma(p, q, 7); pel += `M${n(p[0])} ${n(p[1])}L${n(p2[0])} ${n(p2[1])}`; }
      frente += `<path d="${pel}" fill="none" ${tinta(1.5)}/>` + linea(a, b, `stroke="${col('h')}" stroke-width="3" stroke-linecap="round"`);
      // El rótulo de la escalera va más afuera: el segundo larguero está a 7 del lado.
      return { r, a, b, s, fondo, frente, propios: ['h'], separa: { h: 19 } };
    },
    // rampa: «la rampa es la hipotenusa; lo que sube (la vereda) y la base en el piso son los catetos».
    rampa(m, d) {
      const mk = d.marco || [];
      const s = Math.min(170 / Math.max(m.ra, mk[0] || 0), 130 / Math.max(m.rb, mk[1] || 0));
      const XR = 200, r = [XR, SUELO], a = [XR - m.ra * s, SUELO], b = [XR, SUELO - m.rb * s];
      let fondo = `<rect x="${XR}" y="${n(b[1])}" width="${W - 6 - XR}" height="${n(SUELO - b[1])}" fill="currentColor" fill-opacity="0.12"/>`
        + linea(b, [W - 6, b[1]], tinta(2)) + linea(r, b, tinta(2));
      fondo += poli([a, r, b], `fill="currentColor" fill-opacity="0.1" stroke="none"`) + suelo();
      const frente = linea(a, b, tinta(3));
      return { r, a, b, s, fondo, frente, propios: [] };
    },
    // poste: «el poste y el suelo forman el ángulo recto; el cable (o el rayo de sol) es la hipotenusa».
    poste(m, d) {
      const sombra = !!d.sombra, mk = d.marco || [];
      const XP = sombra ? 96 : 80;
      const s = Math.min((W - 24 - XP) / Math.max(m.ra, mk[0] || 0), (sombra ? 132 : 168) / Math.max(m.rb, mk[1] || 0));
      const r = [XP, SUELO], a = [XP + m.ra * s, SUELO], b = [XP, SUELO - m.rb * s];
      let fondo = suelo();
      if (sombra) fondo += `<rect x="${XP}" y="${SUELO - 2}" width="${n(m.ra * s)}" height="7" rx="3" fill="currentColor" fill-opacity="0.4"/>`;
      fondo += `<rect x="${XP - 4}" y="${n(b[1] - 6)}" width="8" height="${n(SUELO - b[1] + 6)}" rx="2" fill="currentColor" fill-opacity="0.18" ${tinta(1.5)}/>`;
      fondo += linea([XP - 14, b[1] + 8], [XP + 14, b[1] + 8], tinta(2.5));
      let frente = '';
      if (sombra) {
        // El sol, lejos, en la dirección del rayo (de la punta de la sombra hacia la punta del poste).
        const u = unit(resta(b, a)), k = Math.min(48, (b[1] - 22) / Math.abs(u[1] || 1e-9), (b[0] - 22) / Math.abs(u[0] || 1e-9));
        const c = suma(b, u, k);
        let rayos = '';
        for (let i = 0; i < 8; i++) { const t = i * Math.PI / 4; rayos += `M${n(c[0] + 12 * Math.cos(t))} ${n(c[1] + 12 * Math.sin(t))}L${n(c[0] + 17 * Math.cos(t))} ${n(c[1] + 17 * Math.sin(t))}`; }
        frente += `<circle cx="${n(c[0])}" cy="${n(c[1])}" r="8" fill="currentColor" fill-opacity="0.25" ${tinta(1.5)}/><path d="${rayos}" fill="none" ${tinta(1.5)}/>`;
        frente += linea(b, a, `${tinta(2)} stroke-dasharray="5 5"`);
      } else {
        frente += linea(b, a, tinta(2)) + linea([a[0] - 3, SUELO - 4], [a[0] + 3, SUELO + 8], tinta(2.5));
      }
      return { r, a, b, s, fondo, frente, propios: [], punteado: sombra ? ['h'] : [] };
    },
    // repisa: «el ángulo recto está arriba, en la pared: el lado de enfrente del ángulo de abajo es horizontal».
    repisa(m, d) {
      const mk = d.marco || [];
      const XW = 66, YB = 72;
      const s = Math.min(216 / Math.max(m.rb, mk[1] || 0), 164 / Math.max(m.ra, mk[0] || 0));
      const r = [XW, YB], a = [XW, YB + m.ra * s], b = [XW + m.rb * s, YB];
      let fondo = adobe(6, 8, XW, H - 8) + linea([XW, 8], [XW, H - 8], tinta(2));
      fondo += `<rect x="${XW}" y="${YB - 9}" width="${n(m.rb * s + 14)}" height="8" rx="2" fill="currentColor" fill-opacity="0.2" ${tinta(1.5)}/>`;
      const frente = linea(r, b, tinta(3)) + linea(a, b, tinta(2.5))
        + `<circle cx="${n(a[0] + 3)}" cy="${n(a[1])}" r="2.5" fill="currentColor"/><circle cx="${n(b[0] - 4)}" cy="${n(b[1] + 3)}" r="2" fill="currentColor"/>`;
      return { r, a, b, s, fondo, frente, propios: [] };
    },
    // chacra: «una chacra con forma de triángulo rectángulo, vista desde arriba, con postes en la cerca».
    chacra(m) {
      const c = Math.hypot(m.ra, m.rb), alto = m.ra * m.rb / c, xr = m.ra * m.ra / c;
      const s = Math.min(236 / c, 140 / alto), y0 = 190, x0 = (W - c * s) / 2;
      const a = [x0, y0], b = [x0 + c * s, y0], r = [x0 + xr * s, y0 - alto * s];
      let fondo = poli([a, r, b], `fill="currentColor" fill-opacity="0.07" ${tinta(2)}`);
      let postes = '';
      for (const [p, q] of [[a, r], [r, b], [b, a]]) {
        const L = largo(resta(q, p)), k = Math.max(2, Math.round(L / 26));
        for (let i = 0; i < k; i++) { const t = suma(p, resta(q, p), i / k); postes += `<circle cx="${n(t[0])}" cy="${n(t[1])}" r="2.5" fill="currentColor"/>`; }
      }
      return { r, a, b, s, fondo: fondo + postes, frente: '', propios: [] };
    },
    // triangulo: «un triángulo rectángulo girado, con sus vértices nombrados, como en el examen».
    triangulo(m, d) {
      const g = (d.giro || 0) * Math.PI / 180, cg = Math.cos(g), sg = Math.sin(g);
      const rot = ([x, y]) => [x * cg - y * sg, x * sg + y * cg];
      const loc = { r: rot([0, 0]), a: rot([m.ra, 0]), b: rot([0, m.rb]) };
      const xs = Object.values(loc).map(p => p[0]), ys = Object.values(loc).map(p => p[1]);
      const w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys);
      const s = Math.min(196 / w, 150 / h), cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2;
      const px = p => [W / 2 + (p[0] - cx) * s, 124 - (p[1] - cy) * s];
      const r = px(loc.r), a = px(loc.a), b = px(loc.b);
      let fondo = poli([a, r, b], `fill="currentColor" fill-opacity="0.05" ${tinta(2)}`);
      const v = d.vertices || {}, G = [(r[0] + a[0] + b[0]) / 3, (r[1] + a[1] + b[1]) / 3];
      let frente = '';
      for (const [k, p] of [['r', r], ['a', a], ['b', b]]) if (v[k]) {
        const u = unit(resta(p, G));
        frente += `<circle cx="${n(p[0])}" cy="${n(p[1])}" r="3" fill="currentColor"/>` + T.rotulo(p[0] + u[0] * 16, p[1] + u[1] * 16 + 6, v[k], { ancla: 'middle', peso: 700, tam: 16 });
      }
      return { r, a, b, s, fondo, frente, propios: [] };
    },
  };

  // Lo que se ve de un texto con pasos: el último cuyo paso ya llegó.
  const textoEn = (t, p) => {
    if (t === undefined || t === null || t === '') return null;
    if (!Array.isArray(t)) return String(t);
    let out = null;
    for (const x of t) if (x && (x.paso || 0) <= p) out = x.t;
    return out;
  };

  // Rótulo de un lado: una o dos líneas junto a su mitad, del lado de afuera del triángulo.
  function rotulosLado(p, q, G, lineas, color, dist = 12) {
    const mid = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    let nv = unit([-(q[1] - p[1]), q[0] - p[0]]);
    if ((mid[0] - G[0]) * nv[0] + (mid[1] - G[1]) * nv[1] < 0) nv = [-nv[0], -nv[1]];
    const P = suma(mid, nv, dist), alto = lineas.length * 18;
    const ancla = Math.abs(nv[0]) < 0.4 ? 'middle' : nv[0] > 0 ? 'start' : 'end';
    const arriba = nv[1] > 0.4 ? P[1] : nv[1] < -0.4 ? P[1] - alto : P[1] - alto / 2;
    return lineas.map((t, i) => T.rotulo(P[0], arriba + 13 + i * 18, t, { ancla, peso: 700, tam: i === 0 ? 16 : 14, color, min: M, max: W - M })).join('');
  }

  // ¿El segmento p–q cruza la caja [x0, y0, x1, y1]? Recorte de Liang-Barsky.
  function cruza(p, q, c) {
    let t0 = 0, t1 = 1;
    const dx = q[0] - p[0], dy = q[1] - p[1];
    for (const [pp, qq] of [[-dx, p[0] - c[0]], [dx, c[2] - p[0]], [-dy, p[1] - c[1]], [dy, c[3] - p[1]]]) {
      if (pp === 0) { if (qq < 0) return false; continue; }
      const r = qq / pp;
      if (pp < 0) { if (r > t1) return false; if (r > t0) t0 = r; } else { if (r < t0) return false; if (r < t1) t1 = r; }
    }
    return true;
  }

  // Arco de un ángulo agudo en v, entre los lados que van a p1 y p2, con su letra sobre la bisectriz: tan lejos del
  // vértice como haga falta para que la letra no toque ningún lado del triángulo (en ángulos chicos, más lejos).
  function arco(v, p1, p2, an) {
    const t1 = Math.atan2(p1[1] - v[1], p1[0] - v[0]), t2 = Math.atan2(p2[1] - v[1], p2[0] - v[0]);
    let dt = t2 - t1; while (dt > Math.PI) dt -= 2 * Math.PI; while (dt < -Math.PI) dt += 2 * Math.PI;
    const R = 24, c = T.color(an.color || 'h');
    const pt = (t, rr) => [v[0] + rr * Math.cos(t), v[1] + rr * Math.sin(t)];
    const [ax, ay] = pt(t1, R), [bx, by] = pt(t2, R);
    let s = `<path d="M${n(ax)} ${n(ay)}A${R} ${R} 0 0 ${dt > 0 ? 1 : 0} ${n(bx)} ${n(by)}" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/>`;
    if (an.texto) {
      const w = T.ancho(an.texto, 16, 700), caja = (x, y) => [x - w / 2 - 3, y - 10, x + w / 2 + 3, y + 7];
      let rr = R + 12, tx, ty;
      for (; rr < 130; rr += 2) {
        [tx, ty] = pt(t1 + dt / 2, rr);
        const k = caja(tx, ty);
        if (![[v, p1], [v, p2], [p1, p2]].some(([p, q]) => cruza(p, q, k))) break;
      }
      s += T.rotulo(tx, ty + 5.5, an.texto, { color: an.color || 'h', ancla: 'middle', peso: 700, tam: 16 });
    }
    return s;
  }

  function geometria(d = {}) {
    const f = OBJETOS[d.objeto];
    if (!f) return null;
    const N = normal(d), m = { ra: +N.med.ra || 1, rb: +N.med.rb || 1 };
    return f(m, d, k => T.color((N.lados[k] || {}).color));
  }

  function dibujar(d = {}, estado = {}) {
    const g = geometria(d);
    if (!g) return T.svg(W, H, '', { alt: alt(d) });
    const N = normal(d), final = !!estado.final;
    const p = final ? Infinity : Math.max(0, Number.isFinite(estado.paso) ? estado.paso : 0);
    const ve = x => x && (x.paso || 0) <= p;
    const lados = { ra: [g.r, g.a], rb: [g.r, g.b], h: [g.a, g.b] };
    let cuerpo = g.fondo;
    for (const k of ['ra', 'rb', 'h']) {
      const st = N.lados[k];
      if (!st || !st.color || !ve(st) || (g.propios || []).includes(k)) continue;
      const [a, b] = lados[k];
      cuerpo += linea(a, b, `stroke="${T.color(st.color)}" stroke-width="3" stroke-linecap="round"${(g.punteado || []).includes(k) ? ' stroke-dasharray="6 5"' : ''}`);
    }
    cuerpo += g.frente;
    let marcas = '';
    if (d.recto !== false) {
      const u1 = unit(resta(g.a, g.r)), u2 = unit(resta(g.b, g.r)), q = 11;
      const p1 = suma(g.r, u1, q), p3 = suma(g.r, u2, q), p2 = suma(p1, u2, q);
      marcas += `<path d="M${n(p1[0])} ${n(p1[1])}L${n(p2[0])} ${n(p2[1])}L${n(p3[0])} ${n(p3[1])}" fill="none" ${tinta(2)}/>`;
    }
    for (const k of ['a', 'b']) {
      const an = N.angulos[k];
      if (!ve(an)) continue;
      const v = k === 'a' ? g.a : g.b, otro = k === 'a' ? g.b : g.a;
      marcas += arco(v, g.r, otro, an);
    }
    const G = [(g.r[0] + g.a[0] + g.b[0]) / 3, (g.r[1] + g.a[1] + g.b[1]) / 3];
    let textos = '';
    for (const k of ['ra', 'rb', 'h']) {
      const st = N.lados[k];
      if (!st) continue;
      const lin = [textoEn(st.texto, p), textoEn(st.texto2, p)].filter(x => x !== null);
      if (!lin.length) continue;
      const [a, b] = lados[k];
      textos += rotulosLado(a, b, G, lin, st.colorTexto || st.color, (g.separa || {})[k]);
    }
    const nombre = d.objeto === 'poste' && d.sombra ? 'poste-sombra' : d.objeto;
    return T.svg(W, H, obj(nombre, cuerpo) + marcas + halo(textos), { alt: alt(d) });
  }

  function alt(d = {}) {
    const base = {
      escalera: 'Una escalera apoyada en la pared de una casa de adobe', rampa: 'Una rampa que sube desde el piso hasta una vereda',
      poste: d.sombra ? 'Un poste y su sombra en el suelo, con el rayo de sol que pasa por su punta' : 'Un poste sostenido por un cable que baja hasta una estaca',
      repisa: 'Una repisa en la pared, con un brazo horizontal y un tirante', chacra: 'Una chacra con forma de triángulo rectángulo, vista desde arriba',
      triangulo: 'Un triángulo rectángulo girado',
    }[d.objeto];
    if (!base) return 'Un dibujo.';
    const N = normal(d), nom = NOMBRES[d.objeto === 'poste' && d.sombra ? 'sombra' : d.objeto] || {};
    const plano = t => (Array.isArray(t) ? t.map(x => x && x.t).filter(Boolean).join(', ') : t);
    const lados = ['ra', 'rb', 'h'].filter(k => N.lados[k] && N.lados[k].texto).map(k => `${nom[k]}: ${plano(N.lados[k].texto)}`);
    const angs = ['a', 'b'].filter(k => N.angulos[k] && N.angulos[k].texto).map(k => N.angulos[k].texto);
    const v = d.vertices ? `; vértices ${['r', 'a', 'b'].map(k => d.vertices[k]).filter(Boolean).join(', ')}, recto en ${d.vertices.r || ''}` : '';
    return `${base}${v}${lados.length ? `; ${lados.join('; ')}` : ''}${angs.length ? `; ángulos ${angs.join(' y ')}` : ''}.`;
  }

  return { id: 'trig-objeto', dibujar, alt, geometria, OBJETOS: Object.keys(OBJETOS), constantes: { W, H, M, SUELO } };
});
