/*
 * Pieza «geo-figura» (docs/escena-viva.md, sección 5; docs/teoria.md, sección 4): la figura de geometría del curso.
 * Dibuja a escala puntos, segmentos, rectas, regiones, circunferencias, arcos, ángulos, curvas y sólidos simples
 * (proyección ortogonal con caras ocultas). La usan las unidades de contenido/teoria/geometria/.
 *
 * Afirmación de la figura: lo que se dibuja mide lo que dice el problema; la relación que se enseña se ve
 * pegada a su objeto, y lo que la hipótesis no garantiza se dibuja distinto (discontinuo o en otro color).
 *
 * Fidelidad: una sola escala para x e y; los ángulos se dibujan con su valor real (no con «cara de 90°»);
 * el marco (`vista`) es fijo para unos datos, así la figura no salta al mover un control.
 *
 * Coordenadas en unidades del problema, con y hacia arriba. Todo número lo calcula el archivo de teoría (regla 1).
 * datos = {
 *   alt: 'texto que cuenta la relación',          // recomendado: el texto alternativo cuenta la relación, no los trazos
 *   vista: { x: [min, max], y: [min, max] },       // marco fijo (en 3D, en coordenadas ya proyectadas)
 *   alto: 240,                                     // alto máximo del lienzo (el ancho es 320)
 *   tresD: { giro: 30, alza: 20 },                 // si está, los puntos llevan z y se proyectan (ortogonal)
 *   cuadricula: { paso: 1 },  ejes: true,          // cuadrícula de 1 px y ejes x, y con punta
 *   puntos:    [{ id, x, y, z, rotulo, color, lado: grados, sinPunto, hueco, desde, hasta }],
 *   regiones:  [{ puntos: [id | [x, y(, z)]], color, opacidad, discontinua, sinBorde, desde, hasta }],
 *   solidos:   [{ caras: [[id, …], …], color, desde, hasta }],   // caras en sentido antihorario vistas desde fuera:
 *                                                                // las aristas que solo tocan caras de atrás van discontinuas
 *   segmentos: [{ de, a, color, grosor: 'variable'|'contorno'|'fino', discontinua, recta, flecha, texto, lado: 1|-1,
 *                 marcas: 1..3 (rayitas de igualdad), paralela: 1..3 (puntas de paralelismo), desde, hasta }],
 *   curvas:    [{ puntos: [id | [x, y(, z)]], cerrada, color, grosor, discontinua, atras: true, relleno, desde, hasta }],
 *              // atras: en 3D, el tramo que queda detrás (profundidad < 0) va discontinuo
 *   circulos:  [{ centro: id | [x, y], r, color, grosor, discontinua, relleno, desde, hasta }],
 *   arcos:     [{ centro: id | [x, y], r, de: grados, a: grados, color, grosor, texto, desde, hasta }],  // antihorario
 *   angulos:   [{ en, de, a, texto, color, radio, marcas: 1..3, mayor, desde, hasta }],  // 90° → cuadradito
 *   rotulos:   [{ x, y(, z), texto, color, ancla, desde, hasta }],
 * }
 * estado = { corte: 0..n }: se ve lo que tiene desde ≤ corte (y hasta ≥ corte); lo de desde = corte se anima.
 * El dibujo es una función pura de (datos, estado): sin ids, sin azar, sin reloj. Alto fijo para unos datos.
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
  const W = 320, MARGEN = 26, ALTO = 240;
  const rad = g => g * Math.PI / 180;

  // ---------- Geometría útil (también la usan los archivos de teoría para calcular datos) ----------
  const util = {
    rad, grados: r => r * 180 / Math.PI,
    polar: (c, r, g) => [c[0] + r * Math.cos(rad(g)), c[1] + r * Math.sin(rad(g))],
    dist: (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1], (q[2] || 0) - (p[2] || 0)),
    medio: (p, q) => p.map((v, i) => (v + q[i]) / 2),
    mezcla: (p, q, t) => p.map((v, i) => v + (q[i] - v) * t),
    // Ángulo en V entre los rayos V→P y V→Q, en grados (0..180).
    angulo: (V, P, Q) => {
      const a = [P[0] - V[0], P[1] - V[1]], b = [Q[0] - V[0], Q[1] - V[1]];
      const c = (a[0] * b[0] + a[1] * b[1]) / (Math.hypot(...a) * Math.hypot(...b));
      return util.grados(Math.acos(Math.max(-1, Math.min(1, c))));
    },
    // Pie de la perpendicular desde P a la recta AB.
    pie: (P, A, B) => {
      const d = [B[0] - A[0], B[1] - A[1]], t = ((P[0] - A[0]) * d[0] + (P[1] - A[1]) * d[1]) / (d[0] ** 2 + d[1] ** 2);
      return [A[0] + d[0] * t, A[1] + d[1] * t];
    },
    // Corte de las rectas AB y CD (null si son paralelas).
    corte: (A, B, C, D) => {
      const r = [B[0] - A[0], B[1] - A[1]], s = [D[0] - C[0], D[1] - C[1]], den = r[0] * s[1] - r[1] * s[0];
      if (Math.abs(den) < 1e-12) return null;
      const t = ((C[0] - A[0]) * s[1] - (C[1] - A[1]) * s[0]) / den;
      return [A[0] + r[0] * t, A[1] + r[1] * t];
    },
    // Área con signo de un polígono (positiva si va antihorario).
    area: pts => pts.reduce((s, p, i) => { const q = pts[(i + 1) % pts.length]; return s + (p[0] * q[1] - q[0] * p[1]) / 2; }, 0),
    // Circunferencia (o arco) muestreada: n + 1 puntos de «de» a «a» grados.
    arco: (c, r, de = 0, a = 360, n = 48) => Array.from({ length: n + 1 }, (_, k) => util.polar(c, r, de + (a - de) * k / n)),
  };

  // ---------- Proyección y marco ----------
  function proyector(d) {
    if (!d.tresD) return p => [p[0], p[1], 0];
    const g = rad(d.tresD.giro || 0), a = rad(d.tresD.alza || 0);
    // Gira alrededor del eje vertical y y después inclina la mirada: x1 a la derecha, z1 hacia quien mira.
    return p => {
      const x = p[0], y = p[1], z = p[2] || 0;
      const x1 = x * Math.cos(g) + z * Math.sin(g), z1 = -x * Math.sin(g) + z * Math.cos(g);
      return [x1, y * Math.cos(a) - z1 * Math.sin(a), y * Math.sin(a) + z1 * Math.cos(a)];
    };
  }

  function geometria(d) {
    const pr = proyector(d);
    const pts = {};
    for (const q of d.puntos || []) pts[q.id] = pr([q.x, q.y, q.z || 0]);
    const P = r => (typeof r === 'string' ? pts[r] : Array.isArray(r) ? pr(r) : null);
    let x0, x1, y0, y1;
    if (d.vista) { [x0, x1] = d.vista.x; [y0, y1] = d.vista.y; }
    else {
      const todos = Object.values(pts).concat((d.curvas || []).flatMap(c => c.puntos.map(P).filter(Boolean)));
      for (const c of d.circulos || []) { const k = P(c.centro); if (k) todos.push([k[0] - c.r, k[1] - c.r], [k[0] + c.r, k[1] + c.r]); }
      const xs = todos.map(p => p[0]), ys = todos.map(p => p[1]);
      x0 = Math.min(...xs); x1 = Math.max(...xs); y0 = Math.min(...ys); y1 = Math.max(...ys);
    }
    const sx = Math.max(x1 - x0, 1e-9), sy = Math.max(y1 - y0, 1e-9);
    const altoMax = d.alto || ALTO;
    const s = Math.min((W - 2 * MARGEN) / sx, (altoMax - 2 * MARGEN) / sy);
    const H = sy * s + 2 * MARGEN;
    const X = x => (W - sx * s) / 2 + (x - x0) * s, Y = y => MARGEN + (y1 - y) * s;
    const S = r => { const p = P(r); return p ? [X(p[0]), Y(p[1]), p[2]] : null; };
    const lista = Object.values(pts);
    const cen = lista.length ? [X(lista.reduce((a, p) => a + p[0], 0) / lista.length), Y(lista.reduce((a, p) => a + p[1], 0) / lista.length)] : [W / 2, H / 2];
    return { s, X, Y, S, P, pr, x0, x1, y0, y1, centro: cen, alto: Math.round(H) };
  }

  // ---------- Trazos ----------
  const GROSOR = { variable: T.GROSOR.variable, contorno: T.GROSOR.contorno, fino: T.GROSOR.cuadricula };
  const camino = (ps, cerrada) => ps.length ? 'M' + ps.map(p => `${T.n(p[0])} ${T.n(p[1])}`).join('L') + (cerrada ? 'Z' : '') : '';
  const trazo = (dd, o = {}) => `<path d="${dd}" fill="${o.relleno ? T.color(o.color) : 'none'}"${o.relleno ? ` fill-opacity="${o.opacidad === undefined ? 0.16 : o.opacidad}"` : ''} stroke="${o.sinBorde ? 'none' : T.color(o.color)}" stroke-width="${GROSOR[o.grosor] || GROSOR.contorno}" stroke-linecap="round" stroke-linejoin="round"${o.discontinua ? ' stroke-dasharray="5 5"' : ''}/>`;

  // Recta AB recortada al marco (en pantalla).
  function recortar(g, a, b) {
    const L = [[0, 0], [W, g.alto]];
    const d = [b[0] - a[0], b[1] - a[1]];
    let t0 = -Infinity, t1 = Infinity;
    for (const k of [0, 1]) {
      if (Math.abs(d[k]) < 1e-12) { if (a[k] < L[0][k] || a[k] > L[1][k]) return null; continue; }
      let u = (L[0][k] + 4 - a[k]) / d[k], v = (L[1][k] - 4 - a[k]) / d[k];
      if (u > v) [u, v] = [v, u];
      t0 = Math.max(t0, u); t1 = Math.min(t1, v);
    }
    return t0 < t1 ? [[a[0] + d[0] * t0, a[1] + d[1] * t0], [a[0] + d[0] * t1, a[1] + d[1] * t1]] : null;
  }

  function rotuloLado(g, a, b, texto, o) {
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    let nx = -(b[1] - a[1]) / L, ny = (b[0] - a[0]) / L;
    if ((mx - g.centro[0]) * nx + (my - g.centro[1]) * ny < 0) { nx = -nx; ny = -ny; }
    if (o.lado === -1) { nx = -nx; ny = -ny; }
    const dist = o.dist || 12;
    const ancla = Math.abs(nx) < 0.4 ? 'middle' : nx > 0 ? 'start' : 'end';
    const by = my + ny * dist + 5 + (ny > 0.4 ? 7 : ny < -0.4 ? -3 : 0);
    return T.rotulo(mx + nx * dist, by, texto, { color: o.color, ancla, peso: 700 });
  }

  function segmento(g, l) {
    let a = g.S(l.de), b = g.S(l.a);
    if (!a || !b) return '';
    if (l.recta) { const r = recortar(g, a, b); if (!r) return ''; [a, b] = r; }
    const o = { color: l.color, grosor: l.grosor, discontinua: l.discontinua };
    let s = l.flecha ? T.flecha(a[0], a[1], b[0], b[1], { color: l.color, grosor: GROSOR[l.grosor] || GROSOR.contorno }) : trazo(camino([a, b]), o);
    const A = l.recta ? g.S(l.de) : a, B = l.recta ? g.S(l.a) : b;
    const L = Math.hypot(B[0] - A[0], B[1] - A[1]) || 1, ux = (B[0] - A[0]) / L, uy = (B[1] - A[1]) / L;
    const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2;
    // En una recta, las puntas de paralelismo van cerca del borde, lejos de los puntos que la recta une.
    const en = l.recta ? 0.88 : 0.5, px = a[0] + (b[0] - a[0]) * en, py = a[1] + (b[1] - a[1]) * en;
    for (let k = 0; k < (l.marcas || 0); k++) {
      const c = (k - ((l.marcas || 1) - 1) / 2) * 5;
      const cx = mx + ux * c, cy = my + uy * c;
      s += T.linea(cx - uy * 6, cy + ux * 6, cx + uy * 6, cy - ux * 6, { color: l.color, grosor: 2 });
    }
    for (let k = 0; k < (l.paralela || 0); k++) {
      const c = (k - ((l.paralela || 1) - 1) / 2) * 7 + 3;
      const cx = px + ux * c, cy = py + uy * c;
      s += `<path d="M${T.n(cx - ux * 6 - uy * 5)} ${T.n(cy - uy * 6 + ux * 5)}L${T.n(cx)} ${T.n(cy)}L${T.n(cx - ux * 6 + uy * 5)} ${T.n(cy - uy * 6 - ux * 5)}" fill="none" stroke="${T.color(l.color)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    if (l.texto) s += rotuloLado(g, A, B, l.texto, { color: l.color, lado: l.lado });
    return s;
  }

  function angulo(g, an) {
    const c = g.S(an.en), p1 = g.S(an.de), p2 = g.S(an.a);
    if (!c || !p1 || !p2) return '';
    const t1 = Math.atan2(p1[1] - c[1], p1[0] - c[0]), t2 = Math.atan2(p2[1] - c[1], p2[0] - c[0]);
    let dt = t2 - t1; while (dt > Math.PI) dt -= 2 * Math.PI; while (dt < -Math.PI) dt += 2 * Math.PI;
    if (an.mayor) dt = dt > 0 ? dt - 2 * Math.PI : dt + 2 * Math.PI;
    const r = an.radio || 26, col = T.color(an.color);
    const pt = (t, rr) => [c[0] + rr * Math.cos(t), c[1] + rr * Math.sin(t)];
    let s = '';
    if (Math.abs(Math.abs(dt) - Math.PI / 2) < 1e-4 && !an.mayor) {
      const q = 12, u = pt(t1, q), v = pt(t2, q), w = [u[0] + v[0] - c[0], u[1] + v[1] - c[1]];
      s = `<path d="M${T.n(u[0])} ${T.n(u[1])}L${T.n(w[0])} ${T.n(w[1])}L${T.n(v[0])} ${T.n(v[1])}" fill="none" stroke="${col}" stroke-width="2" stroke-linejoin="round"/>`;
    } else {
      for (let k = 0; k < Math.max(1, an.marcas || 1); k++) {
        const rr = r + k * 5, [ax, ay] = pt(t1, rr), [bx, by] = pt(t2, rr);
        s += `<path d="M${T.n(ax)} ${T.n(ay)}A${rr} ${rr} 0 ${Math.abs(dt) > Math.PI ? 1 : 0} ${dt > 0 ? 1 : 0} ${T.n(bx)} ${T.n(by)}" fill="none" stroke="${col}" stroke-width="2" stroke-linecap="round"/>`;
      }
    }
    if (an.texto) {
      const mitad = Math.max(rad(8), Math.min(rad(90), Math.abs(dt) / 2));
      const rr = Math.max(r + 14, (T.ancho(an.texto, T.TEXTO, 700) / 2 + 4) / Math.sin(mitad));
      const [tx, ty] = pt(t1 + dt / 2, Math.min(rr, 58));
      s += T.rotulo(tx, ty + 6, an.texto, { color: an.color, ancla: 'middle', peso: 700 });
    }
    return s;
  }

  // Tramos de una curva 3D: los de atrás (profundidad < 0) van discontinuos si se pide.
  function curva(g, c) {
    const ps = c.puntos.map(g.S).filter(Boolean);
    if (c.cerrada && ps.length) ps.push(ps[0]);
    if (!c.atras || !ps.length) return trazo(camino(ps, c.cerrada && !c.atras), c);
    let s = '', tramo = [ps[0]], atras = ps[0][2] < -1e-9;
    for (let k = 1; k < ps.length; k++) {
      const at = ps[k][2] < -1e-9;
      tramo.push(ps[k]);
      if (at !== atras || k === ps.length - 1) {
        s += trazo(camino(tramo), Object.assign({}, c, { discontinua: atras, relleno: false }));
        tramo = [ps[k]]; atras = at;
      }
    }
    if (c.relleno) s = trazo(camino(ps, true), Object.assign({}, c, { sinBorde: true })) + s;
    return s;
  }

  function solido(g, so) {
    const caras = so.caras.map(ids => ids.map(g.S));
    // En pantalla y crece hacia abajo: una cara antihoraria vista desde fuera tiene área de pantalla negativa.
    const frente = caras.map(ps => util.area(ps.map(p => [p[0], -p[1]])) > 1e-9);
    const aristas = new Map();
    so.caras.forEach((ids, k) => ids.forEach((id, i) => {
      const j = ids[(i + 1) % ids.length], clave = [id, j].sort().join('|');
      const e = aristas.get(clave) || { de: id, a: j, ve: false };
      e.ve = e.ve || frente[k];
      aristas.set(clave, e);
    }));
    let s = '';
    caras.forEach((ps, k) => { if (frente[k]) s += trazo(camino(ps, true), { color: so.color, relleno: true, sinBorde: true, opacidad: 0.1 }); });
    for (const e of aristas.values()) if (!e.ve) s += trazo(camino([g.S(e.de), g.S(e.a)]), { discontinua: true, grosor: 'fino' });
    for (const e of aristas.values()) if (e.ve) s += trazo(camino([g.S(e.de), g.S(e.a)]), { color: so.color });
    return s;
  }

  function dibujar(d, estado = {}) {
    const g = geometria(d);
    const corte = Math.max(0, estado.corte || 0);
    const ve = e => (e.desde || 0) <= corte && !(e.hasta < corte);
    const clase = e => `kit-aparece${(e.desde || 0) === corte && corte > 0 ? ' kit-nuevo' : ''}`;
    const capa = (lista, f) => (lista || []).filter(ve).map(e => `<g class="${clase(e)}">${f(e)}</g>`).join('');
    let s = '';
    if (d.cuadricula) {
      const p = d.cuadricula.paso || 1;
      let dd = '';
      for (let x = Math.ceil(g.x0 / p) * p; x <= g.x1 + 1e-9; x += p) dd += `M${T.n(g.X(x))} ${T.n(g.Y(g.y0))}V${T.n(g.Y(g.y1))}`;
      for (let y = Math.ceil(g.y0 / p) * p; y <= g.y1 + 1e-9; y += p) dd += `M${T.n(g.X(g.x0))} ${T.n(g.Y(y))}H${T.n(g.X(g.x1))}`;
      s += `<path class="kit-tenue" d="${dd}" stroke="currentColor" stroke-width="1" fill="none"/>`;
    }
    if (d.ejes) {
      s += T.flecha(g.X(g.x0), g.Y(0), g.X(g.x1) + 8, g.Y(0), { grosor: 1 }) + T.flecha(g.X(0), g.Y(g.y0), g.X(0), g.Y(g.y1) - 8, { grosor: 1 });
      s += T.rotulo(g.X(g.x1) + 2, g.Y(0) - 8, 'x', { ancla: 'end' }) + T.rotulo(g.X(0) + 8, g.Y(g.y1) + 2, 'y');
    }
    s += capa(d.regiones, r => trazo(camino(r.puntos.map(g.S).filter(Boolean), true), { color: r.color, relleno: true, opacidad: r.opacidad, discontinua: r.discontinua, sinBorde: r.sinBorde !== false && !r.discontinua }));
    s += capa(d.solidos, so => solido(g, so));
    s += capa(d.circulos, c => { const k = g.S(c.centro); return k ? `<circle cx="${T.n(k[0])}" cy="${T.n(k[1])}" r="${T.n(c.r * g.s)}" fill="${c.relleno ? T.color(c.color) : 'none'}"${c.relleno ? ' fill-opacity="0.14"' : ''} stroke="${T.color(c.color)}" stroke-width="${GROSOR[c.grosor] || GROSOR.contorno}"${c.discontinua ? ' stroke-dasharray="5 5"' : ''}/>` : ''; });
    s += capa(d.curvas, c => curva(g, c));
    s += capa(d.arcos, a => {
      const k = g.P(a.centro); if (!k) return '';
      const ps = util.arco(k, a.r, a.de, a.a, 40).map(p => [g.X(p[0]), g.Y(p[1])]);
      let t = trazo(camino(ps), a);
      if (a.texto) { const e = util.polar(k, a.r + 16 / g.s, (a.de + a.a) / 2); t += T.rotulo(g.X(e[0]), g.Y(e[1]) + 5, a.texto, { color: a.color, ancla: 'middle', peso: 700 }); }
      return t;
    });
    s += capa(d.segmentos, l => segmento(g, l));
    s += capa(d.angulos, an => angulo(g, an));
    s += capa((d.puntos || []).filter(q => !q.sinPunto || q.rotulo), q => {
      const [x, y] = g.S(q.id);
      let ux, uy;
      if (q.lado !== undefined) { ux = Math.cos(rad(q.lado)); uy = -Math.sin(rad(q.lado)); }
      else { const L = Math.hypot(x - g.centro[0], y - g.centro[1]) || 1; ux = (x - g.centro[0]) / L; uy = (y - g.centro[1]) / L; if (L < 2) { ux = 0; uy = -1; } }
      const dot = q.sinPunto ? '' : q.hueco ? `<circle cx="${T.n(x)}" cy="${T.n(y)}" r="4" fill="none" stroke="${T.color(q.color)}" stroke-width="2"/>` : `<circle cx="${T.n(x)}" cy="${T.n(y)}" r="${q.color ? 4 : 3}" fill="${T.color(q.color)}"/>`;
      return dot + (q.rotulo ? T.rotulo(x + ux * 15, y + uy * 15 + 5, q.rotulo, { ancla: 'middle', peso: 600, color: q.color }) : '');
    });
    s += capa(d.rotulos, r => { const p = g.S([r.x, r.y, r.z || 0]); return T.rotulo(p[0], p[1] + 5, r.texto, { color: r.color, ancla: r.ancla || 'middle', peso: 700 }); });
    return T.svg(W, g.alto, s, { alt: alt(d) });
  }

  function alt(d) {
    if (d.alt) return d.alt;
    const nombres = (d.puntos || []).filter(q => q.rotulo && !q.desde).map(q => q.rotulo);
    const textos = [...(d.segmentos || []), ...(d.angulos || [])].filter(e => e.texto && !e.desde).map(e => e.texto);
    return `Figura geométrica a escala${nombres.length ? ` con los puntos ${nombres.join(', ')}` : ''}${textos.length ? `; medidas: ${textos.join(', ')}` : ''}`;
  }

  return { id: 'geo-figura', dibujar, alt, geometria, util };
});
