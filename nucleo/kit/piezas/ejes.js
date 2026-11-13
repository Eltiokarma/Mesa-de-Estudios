/*
 * Pieza «ejes» (docs/escena-viva.md, sección 5): un plano con sus dos ejes rotulados, una o dos gráficas
 * (por tramos o muestreadas de una función), áreas sombreadas con signo, puntos con sus guías y una marca
 * que el alumno arrastra: sobre el eje horizontal (un instante, una abscisa) o sobre una regla aparte,
 * debajo de la gráfica (un área, una pendiente, cualquier número que no es un punto del plano).
 * Sirve para gráficas v-t, F-t y x-t, funciones, dominio y rango.
 *
 * Afirmación de la figura: lo que se pide se lee en la gráfica (un área, un corte, una altura).
 *
 * datos = {
 *   x: { min, max, paso, cada, nombre: 't', unidad: 's', decimales, color },   // eje horizontal
 *   y: { min, max, paso, cada, nombre: 'F', unidad: 'N', decimales, color },   // eje vertical
 *   curvas: [{ puntos: [[x, y], …, null, …], color, rotulo, en: [x, y], discontinua, desde }],
 *            // null corta la línea (saltos); `en`: dónde va el rótulo (por defecto, junto al último punto)
 *   areas:  [{ puntos: [[x, y], …], color, rotulo, desde, cerrada }],  // región entre la poligonal y el eje y = 0;
 *            // con cerrada, los puntos son el contorno de la región (entre dos gráficas), sin signo;
 *            // por debajo del eje es negativa: relleno más tenue y borde discontinuo (el signo se ve)
 *   puntos: [{ x, y, color, rotulo, abierto, guias, desde }], // guias: líneas tenues hasta los dos ejes
 *            // curvas, áreas y puntos aceptan además `hasta`: se ven solo mientras corte ≤ hasta
 *   marca:  { eje: 'x', min, max, inicio } | { eje: 'regla', min, max, inicio, paso, cada, nombre, unidad, color },
 *   respuesta: número | null,   // lo que el estado final dibuja con ✓ (en el eje x o en la regla)
 *   prefijo, sufijo, decimales  // cómo se lee la marca («12,5 s», «40 N·s»)
 *   compacto: true              // sin marca: plano de 96 px y sin espacio para fantasmas (va debajo de otra figura)
 * }
 * estado = { corte, final, marca, fantasma: null | { marca, rotulo } | { curvas, areas, puntos, rotulo } }
 * El dibujo es una función pura de (datos, estado). Todo número que se ve lo trae el generador.
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
  const W = 320, PX0 = 48, PX1 = 302, PY0 = 30, ALTO_PLANO = 170, ALTO_COMPACTO = 96, R = 5;

  const dec = e => (e && e.decimales !== undefined ? e.decimales : 2);
  const nombreEje = e => (e.nombre ? `${e.nombre}${e.unidad ? ` (${e.unidad})` : ''}` : '');
  // compacto (sin marca): plano más bajo y sin el espacio del fantasma, para ir debajo de otra figura a 360 px.
  const esCompacto = d => !!d.compacto && !d.marca;
  function geometria(d) {
    const PY1 = PY0 + (esCompacto(d) ? ALTO_COMPACTO : ALTO_PLANO);
    const sx = (d.x.max - d.x.min) || 1, sy = (d.y.max - d.y.min) || 1;
    const X = v => PX0 + (PX1 - PX0) * (v - d.x.min) / sx;
    const Y = v => PY1 - (PY1 - PY0) * (v - d.y.min) / sy;
    const regla = d.marca && d.marca.eje === 'regla';
    const reglaY = PY1 + 66;
    const manija = regla ? reglaY + 52 : PY1 + 58;
    const fantasma = manija + 30;
    // Regla aparte: misma anchura útil que el plano.
    const m = d.marca || {};
    const RX = v => PX0 + (PX1 - PX0) * (v - m.min) / ((m.max - m.min) || 1);
    const ceroY = Y(Math.min(d.y.max, Math.max(d.y.min, 0)));
    return { PY1, X, Y, ceroY, regla, reglaY, manija, fantasma, alto: esCompacto(d) ? PY1 + 48 : fantasma + 16, RX };
  }
  const fmt = (d, v) => `${d.prefijo || ''}${Kit.formatear(v, d.decimales === undefined ? 2 : d.decimales)}${d.sufijo || ''}`;
  const lim = (v, a, b) => Math.min(b, Math.max(a, v));

  // Posición de la marca: en el eje x del plano o en la regla.
  function aX(d, g, v) { return g.regla ? g.RX(v) : g.X(v); }
  function deX(d, px) {
    const m = d.marca;
    if (m.eje === 'regla') return m.min + (px - PX0) / (PX1 - PX0) * (m.max - m.min);
    return d.x.min + (px - PX0) / (PX1 - PX0) * (d.x.max - d.x.min);
  }

  function controles(d) {
    const g = geometria(d);
    if (!d.marca) return { ancho: W, alto: g.alto, respuesta: d.respuesta };
    const m = d.marca;
    return {
      ancho: W, alto: g.alto,
      marca: {
        min: m.min, max: m.max, inicio: m.inicio === undefined ? m.min : m.inicio,
        aX: v => aX(d, g, v), deX: px => deX(d, px), texto: v => fmt(d, v),
      },
      respuesta: d.respuesta,
    };
  }

  // Valores de las rayitas de un eje, raleando los números si no caben.
  function rayitas(e, largo) {
    const paso = e.paso > 0 ? e.paso : (e.max - e.min) / 5;
    const vals = [];
    for (let k = Math.ceil((e.min - 1e-9) / paso); k <= Math.floor((e.max + 1e-9) / paso); k++) vals.push(Math.round(k * paso * 1e9) / 1e9);
    const sep = largo * paso / ((e.max - e.min) || 1);
    const w = Math.max(...vals.map(v => T.ancho(Kit.formatear(v, dec(e)))), 0);
    let cada = Math.max(1, e.cada || 1);
    for (const c of [1, 2, 5, 10, 20, 50]) if (c >= cada && sep * c >= w + 8) { cada = c; break; }
    return { vals, paso, cada };
  }

  // El plano: cuadrícula tenue, ejes (el horizontal pasa por y = 0), números y nombres de los ejes.
  function plano(d, g) {
    let s = '';
    const rx = rayitas(d.x, PX1 - PX0), ry = rayitas(d.y, g.PY1 - PY0);
    let grid = '';
    for (const v of rx.vals) grid += T.linea(g.X(v), PY0, g.X(v), g.PY1, { grosor: T.GROSOR.cuadricula, opacidad: 0.18 });
    for (const v of ry.vals) grid += T.linea(PX0, g.Y(v), PX1, g.Y(v), { grosor: T.GROSOR.cuadricula, opacidad: 0.18 });
    s += `<g class="kit-cuadricula">${grid}</g>`;
    // Eje vertical en x = 0 si se ve; si no, en el borde izquierdo.
    const ejeX = d.x.min <= 0 && d.x.max >= 0 ? g.X(0) : PX0;
    s += `<g class="kit-eje">${T.flecha(ejeX, g.PY1 + 4, ejeX, PY0 - 14, { grosor: T.GROSOR.contorno })}${T.flecha(PX0 - 4, g.ceroY, PX1 + 14, g.ceroY, { grosor: T.GROSOR.contorno })}</g>`;
    // Números del eje x debajo del plano (no chocan con lo que está bajo el eje); del eje y, a la izquierda.
    rx.vals.forEach(v => { if (Math.round(v / rx.paso) % rx.cada === 0) s += T.rotulo(g.X(v), g.PY1 + 22, Kit.formatear(v, dec(d.x)), { ancla: 'middle', clase: 'kit-num' }); });
    ry.vals.forEach(v => { if (Math.round(v / ry.paso) % ry.cada === 0) s += T.rotulo(PX0 - 8, g.Y(v) + 5, Kit.formatear(v, dec(d.y)), { ancla: 'end', clase: 'kit-num', min: 0 }); });
    if (nombreEje(d.y)) s += T.rotulo(ejeX + 10, PY0 - 12, nombreEje(d.y), { color: d.y.color, peso: 700 });
    if (nombreEje(d.x)) s += T.rotulo(PX1 + 16, g.PY1 + 42, nombreEje(d.x), { color: d.x.color, peso: 700, ancla: 'end' });
    return s;
  }

  const P = (g, p) => `${T.n(g.X(p[0]))} ${T.n(g.Y(p[1]))}`;
  // Poligonal con cortes (null): «M … L … M …».
  function camino(g, puntos) {
    let s = '', nuevo = true;
    for (const p of puntos || []) {
      if (!p) { nuevo = true; continue; }
      s += (nuevo ? 'M' : 'L') + P(g, p); nuevo = false;
    }
    return s;
  }
  // Centroide de un polígono (fórmula del área): ahí va el rótulo del área.
  function centroide(pts) {
    let a = 0, cx = 0, cy = 0;
    for (let i = 0; i < pts.length; i++) {
      const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length], c = x1 * y2 - x2 * y1;
      a += c; cx += (x1 + x2) * c; cy += (y1 + y2) * c;
    }
    if (Math.abs(a) < 1e-9) return pts.reduce((m, p) => [m[0] + p[0] / pts.length, m[1] + p[1] / pts.length], [0, 0]);
    return [cx / (3 * a), cy / (3 * a)];
  }

  function areaSVG(g, a, clase, disc) {
    const pts = (a.puntos || []).filter(Boolean);
    if (pts.length < 2) return '';
    // cerrada: el polígono es la región entre dos gráficas (se cierra solo, sin bajar al eje y sin signo).
    const poli = a.cerrada ? pts : [[pts[0][0], 0], ...pts, [pts[pts.length - 1][0], 0]];
    const media = pts.reduce((m, p) => m + p[1], 0) / pts.length;
    const neg = !a.cerrada && media < 0, c = disc ? 'currentColor' : T.color(a.color);
    const d = 'M' + poli.map(p => P(g, [p[0], lim(p[1], -1e12, 1e12)])).join('L') + 'Z';
    let s = `<path class="kit-crece${clase}" d="${d}" fill="${c}" fill-opacity="${disc ? 0.08 : neg ? 0.12 : 0.24}" stroke="${c}" stroke-width="${T.GROSOR.cuadricula}"${neg || disc ? ' stroke-dasharray="4 3"' : ''}/>`;
    if (a.rotulo && !disc) {
      const [cx, cy] = centroide(poli.map(p => [g.X(p[0]), g.Y(p[1])]));
      s += T.rotulo(cx, cy + 6, a.rotulo, { color: a.color, peso: 700, ancla: 'middle', clase: 'kit-aparece' + clase, min: PX0, max: PX1 + 10 });
    }
    return s;
  }

  function curvaSVG(g, cv, clase, disc) {
    const d = camino(g, cv.puntos);
    if (!d) return '';
    const c = disc ? 'currentColor' : T.color(cv.color);
    let s = `<path class="kit-crece${clase}" d="${d}" fill="none" stroke="${c}" stroke-width="${disc ? T.GROSOR.contorno : T.GROSOR.variable}" stroke-linecap="round" stroke-linejoin="round"${disc || cv.discontinua ? ' stroke-dasharray="6 4"' : ''}${disc ? ' stroke-opacity="0.8"' : ''}/>`;
    if (cv.rotulo && !disc) {
      const ult = cv.en || [...cv.puntos].reverse().find(Boolean);
      const x = g.X(ult[0]), y = g.Y(ult[1]);
      s += T.rotulo(x, y - 10, cv.rotulo, { color: cv.color, peso: 700, ancla: x > W * 0.6 ? 'end' : 'start', clase: 'kit-aparece' + clase, min: PX0 + 2 });
    }
    return s;
  }

  function puntoSVG(d, g, p, clase, disc) {
    const x = g.X(p.x), y = g.Y(p.y), c = disc ? 'currentColor' : T.color(p.color);
    let s = '';
    if (p.guias) {
      const ejeX = d.x.min <= 0 && d.x.max >= 0 ? g.X(0) : PX0;
      s += T.linea(x, y, x, g.ceroY, { grosor: T.GROSOR.cuadricula, discontinua: true, opacidad: 0.7 });
      s += T.linea(x, y, ejeX, y, { grosor: T.GROSOR.cuadricula, discontinua: true, opacidad: 0.7 });
    }
    s += `<circle cx="${T.n(x)}" cy="${T.n(y)}" r="${R}" fill="${p.abierto ? 'var(--card)' : c}" stroke="${c}" stroke-width="2.5"${disc ? ' stroke-dasharray="3 2"' : ''}/>`;
    let rot = '';
    if (p.rotulo && !disc) rot = T.rotulo(x + (x > W * 0.6 ? -10 : 10), y - 10, p.rotulo, { color: p.color, peso: 700, ancla: x > W * 0.6 ? 'end' : 'start', clase: 'kit-aparece' + clase, min: PX0 + 2 });
    return `<g class="kit-aparece${clase}">${s}</g>${rot}`;
  }

  // La regla aparte (si la marca no es un punto del plano).
  function reglaSVG(d, g) {
    const m = d.marca, e = { min: m.min, max: m.max, paso: m.paso, cada: m.cada, decimales: m.decimales === undefined ? d.decimales : m.decimales };
    const rr = rayitas(e, PX1 - PX0);
    let s = T.eje(PX0 - 6, PX1 + 6, g.reglaY, { marcas: rr.vals.map(g.RX), alto: 6, grosor: T.GROSOR.contorno });
    rr.vals.forEach(v => { if (Math.round(v / rr.paso) % rr.cada === 0) s += T.rotulo(g.RX(v), g.reglaY + 22, Kit.formatear(v, dec(e)), { ancla: 'middle', clase: 'kit-num' }); });
    const nom = nombreEje(m);
    if (nom) s += T.rotulo(PX0 - 6, g.reglaY - 12, nom, { color: m.color, peso: 700 });
    return s;
  }

  // La marca: en el eje x cruza el plano de arriba abajo; en la regla, solo la regla. Termina en su manija.
  function marcaSVG(d, g, v, { solida, clase, rotulo, y }) {
    const m = d.marca;
    const x = aX(d, g, lim(v, m.min, m.max));
    const lado = x > W / 2 ? 'end' : 'start', dx = lado === 'end' ? -16 : 16;
    const y0 = g.regla ? g.reglaY - 10 : PY0;
    let s = T.linea(x, y0, x, y, { grosor: solida ? T.GROSOR.variable : T.GROSOR.contorno, discontinua: !solida, opacidad: solida ? (g.regla ? undefined : 0.85) : 0.8 });
    s += solida ? `<circle cx="${T.n(x)}" cy="${T.n(y)}" r="11" fill="currentColor"/>` : `<circle cx="${T.n(x)}" cy="${T.n(y)}" r="6" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="3 3"/>`;
    s += T.rotulo(x + dx, y + 6, rotulo, { ancla: lado, peso: solida ? 700 : 400 });
    return `<g class="${clase}">${s}</g>`;
  }

  function dibujar(d, estado = {}) {
    const g = geometria(d);
    const final = !!estado.final, corte = Math.max(0, estado.corte || 0);
    const ve = e => (e.desde || 0) <= corte && !(e.hasta < corte); // hasta: el rótulo provisional («vmax») deja su lugar al valor
    const nuevo = e => ((e.desde || 0) === corte && corte > 0 ? ' kit-nuevo' : '');
    let s = plano(d, g);
    for (const a of d.areas || []) if (ve(a)) s += areaSVG(g, a, nuevo(a), false);
    for (const c of d.curvas || []) if (ve(c)) s += curvaSVG(g, c, nuevo(c), false);
    for (const p of d.puntos || []) if (ve(p)) s += puntoSVG(d, g, p, nuevo(p), false);
    if (g.regla) s += reglaSVG(d, g);
    const f = estado.fantasma;
    if (f && d.marca && Number.isFinite(f.marca)) {
      s += marcaSVG(d, g, f.marca, { solida: false, clase: 'kit-fantasma', y: g.fantasma, rotulo: `${f.rotulo ? f.rotulo + ': ' : ''}${fmt(d, f.marca)}` });
    } else if (f && (f.curvas || f.areas || f.puntos)) {
      let c = '';
      for (const a of f.areas || []) c += areaSVG(g, a, '', true);
      for (const cv of f.curvas || []) c += curvaSVG(g, cv, '', true);
      for (const p of f.puntos || []) c += puntoSVG(d, g, p, '', true);
      if (f.rotulo) c += T.linea(PX0, g.fantasma, PX0 + 22, g.fantasma, { discontinua: true, opacidad: 0.8 }) + T.rotulo(PX0 + 30, g.fantasma + 5, f.rotulo, {});
      s += `<g class="kit-fantasma">${c}</g>`;
    }
    if (d.marca && final && Number.isFinite(d.respuesta)) {
      s += marcaSVG(d, g, d.respuesta, { solida: true, clase: 'kit-respuesta kit-aparece kit-nuevo', y: g.manija, rotulo: `${fmt(d, d.respuesta)} ✓` });
    } else if (d.marca && !final && Number.isFinite(estado.marca)) {
      s += marcaSVG(d, g, estado.marca, { solida: true, clase: 'kit-marca', y: g.manija, rotulo: fmt(d, estado.marca) });
    }
    return T.svg(W, g.alto, s, { alt: alt(d) });
  }

  function alt(d) {
    if (d.alt) return d.alt;
    const partes = [...(d.curvas || []), ...(d.areas || []), ...(d.puntos || [])].filter(e => e.rotulo).map(e => e.rotulo);
    return `Gráfica de ${nombreEje(d.y) || 'y'} contra ${nombreEje(d.x) || 'x'}${partes.length ? ': ' + partes.join('; ') : ''}`;
  }

  return { id: 'ejes', dibujar, alt, controles, geometria };
});
