/*
 * Pieza «fis-banco-optico» (física, óptica geométrica): un eje óptico con una lente o un espejo, sus focos, un objeto
 * (flecha), sus rayos principales y la imagen (flecha discontinua si es virtual, con las prolongaciones punteadas).
 * También un haz paralelo que converge en el foco (para la potencia y el fabricante) y una lente tapada a medias.
 *
 * Afirmación de la figura: la imagen está donde se cruzan los rayos que salen de la punta del objeto, o sus
 * prolongaciones si divergen.
 *
 * Fidelidad: una escala horizontal para distancias (cm) y otra vertical para alturas (las rectas se conservan: el
 * cruce de los rayos cae en la imagen que trae quien llama; las pruebas lo comprueban). Los rayos se trazan con las
 * reglas de rayos principales a partir del objeto y de f, sin mirar la imagen, salvo los de la lente tapada.
 *
 * Convención: distancias positivas para lo real. Lente: objeto a la izquierda a do; imagen real a la derecha a di > 0,
 * virtual a la izquierda (di < 0). Espejo: todo lo real a la izquierda; imagen virtual detrás (di < 0).
 * f > 0 convergente (lente convergente o espejo cóncavo), f < 0 divergente; espejo plano: tipo 'espejo-plano'.
 *
 * datos = {
 *   tipo: 'lente' | 'espejo' | 'espejo-plano',
 *   f: 10,                          // cm, con signo
 *   alcance: 40,                    // cm visibles del lado del objeto (el otro lado, en proporción)
 *   alto: 10,                       // cm que ocupa la mitad de la figura en vertical
 *   objeto: { d: 30, h: 4 } | null,
 *   imagen: { d: 15, h: -2 } | null,                  // la calcula quien llama (regla 1)
 *   rayos: ['paralelo', 'centro', 'foco'],            // rayos principales desde la punta del objeto
 *   haz: [3, 0, -3] | null,                           // rayos paralelos al eje a esas alturas (cm)
 *   tapa: false,                                      // lente tapada en su mitad de arriba
 *   grosor: 0..1,                                     // curvatura dibujada de la lente (fabricante)
 *   rotulos: { o: 'do = 30 cm', i: 'di = 15 cm', f: 'f = 10 cm' },
 *   colores: { o: 'h', i: 'd', f: 'i', r: 'tinta' }
 * }
 * estado = { paso }: el rayo k aparece en el paso k + 1 y la imagen cuando ya están todos. Sin paso, todo. Pura.
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
  const W = 320, ALTO = 230, EJE = 112, MEDIO_V = 86, CAJA = [4, 8, 316, 206];
  const BASE = { o: 'h', i: 'd', f: 'i', r: 'tinta' };

  function geometria(d) {
    const lente = (d.tipo || 'lente') === 'lente';
    const XE = lente ? 170 : 196;                       // dónde está el elemento (el espejo deja lugar detrás)
    const sx = (XE - 16) / Math.max(1, d.alcance || 40);  // px por cm
    const sy = MEDIO_V / Math.max(0.5, d.alto || 10);
    return { lente, XE, sx, sy, X: x => XE + x * sx, Y: y => EJE - y * sy, xmin: -(XE - CAJA[0]) / sx, xmax: (CAJA[2] - XE) / sx };
  }

  // Recorta el segmento al rectángulo de dibujo (Liang–Barsky). Devuelve null si queda fuera.
  function recorta(x1, y1, x2, y2) {
    let t0 = 0, t1 = 1;
    const dx = x2 - x1, dy = y2 - y1;
    const p = [-dx, dx, -dy, dy], q = [x1 - CAJA[0], CAJA[2] - x1, y1 - CAJA[1], CAJA[3] - y1];
    for (let i = 0; i < 4; i++) {
      if (p[i] === 0) { if (q[i] < 0) return null; continue; }
      const r = q[i] / p[i];
      if (p[i] < 0) { if (r > t1) return null; if (r > t0) t0 = r; } else { if (r < t0) return null; if (r < t1) t1 = r; }
    }
    return [x1 + t0 * dx, y1 + t0 * dy, x1 + t1 * dx, y1 + t1 * dy];
  }

  // Rayos en coordenadas del problema (cm): lista de tramos { de, a, prolongacion }.
  function rayos(d) {
    const g = geometria(d), o = d.objeto, out = [];
    if (!o) return out;
    const tipo = d.tipo || 'lente', f = d.f, x0 = -o.d, h = o.h, lejos = g.xmax * 1.1, atras = g.xmin * 1.1;
    const tramo = (de, a, prolongacion = false) => ({ de, a, prolongacion });
    for (const nombre of d.rayos || []) {
      const r = [];
      if (tipo === 'lente') {
        if (nombre === 'paralelo') {
          const y = x => h - h * x / f;
          r.push(tramo([x0, h], [0, h]), tramo([0, h], [lejos, y(lejos)]), tramo([0, h], [atras, y(atras)], true));
        } else if (nombre === 'centro') {
          const y = x => -h * x / o.d;
          r.push(tramo([x0, h], [lejos, y(lejos)]), tramo([0, 0], [atras, y(atras)], true));
        } else if (nombre === 'foco' && Math.abs(Math.abs(f) - o.d) > 1e-9) {
          const yl = f > 0 ? h * f / (f - o.d) : h * -f / (-f + o.d);
          r.push(tramo([x0, h], [0, yl]), tramo([0, yl], [lejos, yl]), tramo([0, yl], [atras, yl], true));
        }
      } else {
        const plano = tipo === 'espejo-plano';
        if (nombre === 'paralelo') {
          const y = x => (plano ? h : h + h * x / f);
          r.push(tramo([x0, h], [0, h]), tramo([0, h], [atras, y(atras)]), tramo([0, h], [lejos, y(lejos)], true));
        } else if (nombre === 'centro') {
          const y = x => h * x / o.d;
          r.push(tramo([x0, h], [0, 0]), tramo([0, 0], [atras, y(atras)]), tramo([0, 0], [lejos, y(lejos)], true));
        } else if (nombre === 'foco' && !plano && Math.abs(Math.abs(f) - o.d) > 1e-9) {
          const yl = f > 0 ? h * f / (f - o.d) : h * -f / (-f + o.d);
          r.push(tramo([x0, h], [0, yl]), tramo([0, yl], [atras, yl]), tramo([0, yl], [lejos, yl], true));
        }
      }
      out.push(r);
    }
    return out;
  }

  function dibujar(d, estado = {}) {
    const C = Object.assign({}, BASE, d.colores || {}), g = geometria(d), R = d.rotulos || {};
    const tipo = d.tipo || 'lente', virtual = d.imagen && d.imagen.d < 0;
    const nr = (d.rayos || []).length + (d.haz ? 1 : 0) + (d.tapa ? 1 : 0);
    const ve = k => !Number.isFinite(estado.paso) || estado.paso >= k;
    let s = '';
    // Eje óptico.
    s += T.linea(CAJA[0], EJE, CAJA[2], EJE, { grosor: 1, opacidad: 0.7 });
    // Elemento.
    const XE = g.XE, HE = MEDIO_V + 10;
    if (tipo === 'lente') {
      const k = 6 + 14 * Math.max(0, Math.min(1, d.grosor === undefined ? 0.5 : d.grosor));
      if (d.f >= 0) s += `<path d="M${XE} ${EJE - HE}Q${XE + k * 2} ${EJE} ${XE} ${EJE + HE}Q${XE - k * 2} ${EJE} ${XE} ${EJE - HE}Z" fill="currentColor" fill-opacity="0.12" stroke="currentColor" stroke-width="2"/>`;
      else s += `<path d="M${XE - k} ${EJE - HE}L${XE + k} ${EJE - HE}Q${XE} ${EJE} ${XE + k} ${EJE + HE}L${XE - k} ${EJE + HE}Q${XE} ${EJE} ${XE - k} ${EJE - HE}Z" fill="currentColor" fill-opacity="0.12" stroke="currentColor" stroke-width="2"/>`;
      if (d.tapa) s += `<rect x="${XE - 8}" y="${EJE - HE - 4}" width="16" height="${HE + 4}" rx="3" fill="currentColor"/>`;
    } else if (tipo === 'espejo-plano') {
      s += T.linea(XE, EJE - HE, XE, EJE + HE, { grosor: T.GROSOR.variable });
      for (let y = EJE - HE + 6; y < EJE + HE; y += 12) s += T.linea(XE, y, XE + 8, y - 8, { grosor: 1, opacidad: 0.6 });
    } else {
      const c = d.f > 0 ? 1 : -1, k = -16 * c;  // cóncavo: los bordes avanzan hacia el objeto (izquierda), como un tazón
      s += `<path d="M${XE + k} ${EJE - HE}Q${XE - k} ${EJE} ${XE + k} ${EJE + HE}" fill="none" stroke="currentColor" stroke-width="3"/>`;
      for (let y = EJE - HE + 8; y < EJE + HE - 4; y += 12) { const t = (y - EJE + HE) / (2 * HE), xb = (1 - t) * (1 - t) * (XE + k) + 2 * t * (1 - t) * (XE - k) + t * t * (XE + k); s += T.linea(xb + 2, y, xb + 10, y - 8, { grosor: 1, opacidad: 0.6 }); }
    }
    // Focos.
    if (tipo !== 'espejo-plano' && Number.isFinite(d.f)) {
      const marcas = tipo === 'lente' ? [-Math.abs(d.f), Math.abs(d.f)] : [-d.f];
      for (const m of marcas) {
        const x = g.X(m);
        if (x < CAJA[0] || x > CAJA[2]) continue;
        s += `<circle cx="${T.n(x)}" cy="${EJE}" r="4" fill="${T.color(C.f)}"/>` + T.rotulo(x, EJE + 22, 'F', { ancla: 'middle', color: C.f, peso: 700 });
      }
      if (R.f) s += T.rotulo(g.X(-Math.abs(d.f)) , EJE + 40, R.f, { ancla: 'middle', color: C.f, peso: 700 });
    }
    // Haz paralelo que converge en F.
    if (d.haz && ve(1)) {
      for (const y0 of d.haz) {
        const f = d.f, lejos = g.xmax * 1.1, y = x => y0 - y0 * x / f;
        const p1 = recorta(g.X(g.xmin * 1.1), g.Y(y0), g.X(0), g.Y(y0)), p2 = recorta(g.X(0), g.Y(y0), g.X(lejos), g.Y(y(lejos)));
        if (p1) s += T.linea(...p1, { color: C.r, grosor: 2 });
        if (p2) s += T.linea(...p2, { color: C.r, grosor: 2 });
      }
    }
    // Rayos principales (con sus prolongaciones punteadas si la imagen es virtual).
    rayos(d).forEach((r, k) => {
      if (!ve(k + 1)) return;
      for (const t of r) {
        if (t.prolongacion && !virtual) continue;
        const p = recorta(g.X(t.de[0]), g.Y(t.de[1]), g.X(t.a[0]), g.Y(t.a[1]));
        if (p) s += T.linea(...p, { color: C.r, grosor: 2, discontinua: t.prolongacion, opacidad: t.prolongacion ? 0.7 : 1 });
      }
    });
    // Lente tapada: dos rayos por la mitad de abajo, que igual llegan a la punta de la imagen.
    if (d.tapa && d.objeto && d.imagen && ve(1)) {
      for (const fr of [0.35, 0.75]) {
        const yl = -fr * (HE / g.sy);
        const a = recorta(g.X(-d.objeto.d), g.Y(d.objeto.h), g.X(0), g.Y(yl));
        const xi = d.imagen.d, b = recorta(g.X(0), g.Y(yl), g.X(xi + (xi - 0) * 0.15), g.Y(d.imagen.h + (d.imagen.h - yl) * 0.15));
        if (a) s += T.linea(...a, { color: C.r, grosor: 2 });
        if (b) s += T.linea(...b, { color: C.r, grosor: 2 });
      }
    }
    // Objeto e imagen.
    const flechaV = (x, h, c, disc, rot) => {
      const X = g.X(x), Y = g.Y(h);
      if (X < CAJA[0] - 1 || X > CAJA[2] + 1) return '';
      let a = T.flecha(X, EJE, X, Y, { color: c, grosor: T.GROSOR.variable });
      if (disc) a = a.replace('stroke-linecap="round"/>', 'stroke-linecap="round" stroke-dasharray="5 4"/>');
      return a + (rot ? T.rotulo(X, h >= 0 ? Y - 8 : Y + 20, rot, { ancla: 'middle', color: c, peso: 700 }) : '');
    };
    if (d.objeto) s += flechaV(-d.objeto.d, d.objeto.h, C.o, false, R.o);
    if (d.imagen && ve(nr)) {
      const xi = tipo === 'lente' ? d.imagen.d : -d.imagen.d;
      s += flechaV(xi, d.imagen.h, C.i, virtual, R.i);
    }
    return T.svg(W, ALTO, s, { alt: alt(d) });
  }

  function alt(d) {
    const f = x => Kit.formatear(x, 1), tipo = d.tipo || 'lente';
    const el = tipo === 'lente' ? (d.f >= 0 ? 'Lente convergente' : 'Lente divergente') : tipo === 'espejo-plano' ? 'Espejo plano' : (d.f > 0 ? 'Espejo cóncavo' : 'Espejo convexo');
    let t = `${el}${tipo !== 'espejo-plano' ? ` de f = ${f(Math.abs(d.f))} cm` : ''}`;
    if (d.objeto) t += `; objeto de ${f(d.objeto.h)} cm a ${f(d.objeto.d)} cm`;
    if (d.imagen) t += `; imagen ${d.imagen.d < 0 ? 'virtual' : 'real'} a ${f(Math.abs(d.imagen.d))} cm, ${d.imagen.h * (d.objeto ? d.objeto.h : 1) < 0 ? 'invertida' : 'derecha'}, de ${f(Math.abs(d.imagen.h))} cm`;
    if (d.haz) t += '; un haz paralelo converge en el foco';
    if (d.tapa) t += '; la mitad de arriba de la lente está tapada y la imagen sigue completa';
    return t + '.';
  }

  return { id: 'fis-banco-optico', dibujar, alt, rayos, geometria, constantes: { W, ALTO, EJE } };
});
