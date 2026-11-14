/*
 * Pieza «flechas» (docs/escena-viva.md, sección 5): vectores en el plano, a escala. Sirve para la suma con
 * origen común (paralelogramo), encadenados cola con punta (polígono), componentes sobre los ejes y la
 * resultante; con una regla de la misma escala para medir la resultante.
 *
 * Afirmación de la figura: la resultante es una flecha más, y su largo se mide con la misma regla que A y B.
 *
 * Fidelidad: una sola escala (px por unidad) para los dos ejes, las flechas y la regla. El largo dibujado de
 * cada flecha es su módulo por esa escala, y cada ángulo dibujado es el de sus componentes.
 *
 * Coordenadas en unidades del problema, con y hacia arriba. Todo número lo calcula el generador (regla 1).
 * datos = {
 *   unidad: 'N',
 *   flechas: [{ de: [x, y], a: [x, y], color: 'o', rotulo: 'A', valor: '6 N', valorPaso: 0,
 *               paso: 0, discontinua: false, grosor: 'variable'|'contorno' }],
 *   resultante: { de, a, color: 'd', rotulo: 'R', valor: '2√13 N', paso: (por defecto, solo en el final) },
 *   guias: [{ de, a, color, paso }],          // líneas discontinuas: lados del paralelogramo, proyecciones
 *   segmentos: [{ de, a, color: 'o', texto: 'L = 6 cm', paso }],  // un dato que es un largo sin sentido (un lado)
 *   angulos: [{ en: [x, y], de: 0, a: 60, texto: '60°', color: 'h', paso }],  // de y a en grados, antihorario desde +x
 *   puntos: [{ x, y, rotulo: 'A', paso }],     // vértices con nombre
 *   contorno: [[x, y], …],                     // figura de fondo (polígono cerrado), tenue
 *   ejes: false,                               // ejes x e y por el origen, con los unitarios î y ĵ de largo 1
 *   regla: { max: 20, respuesta: 7.21, texto: '2√13 N', decimales: 1 }  // solo si la respuesta se arrastra
 * }
 * estado = {
 *   paso: 0..n,                                // lo que tiene paso ≤ este se ve (lo anterior se queda: rastro)
 *   final: false,                              // la resultante con su valor y, si hay regla, su copia medida
 *   marca: null | número,                      // el largo que marca el alumno sobre la regla
 *   fantasma: null | { marca, rotulo, texto }  // el error con nombre, discontinuo
 * }
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
  const W = 320, MARGEN = 30, FIG_MAX = 220, R0 = 14, R1 = 306;
  const rad = g => g * Math.PI / 180;

  function extremos(d) {
    const ps = [];
    for (const f of d.flechas || []) ps.push(f.de, f.a);
    if (d.resultante) ps.push(d.resultante.de, d.resultante.a);
    for (const g of [...(d.guias || []), ...(d.segmentos || [])]) ps.push(g.de, g.a);
    for (const p of d.contorno || []) ps.push(p);
    for (const p of d.puntos || []) ps.push([p.x, p.y]);
    for (const a of d.angulos || []) ps.push(a.en);
    if (d.ejes) ps.push([0, 0], [1.8, 0], [0, 1.8]); // lugar para î y ĵ, lejos de los rótulos x e y
    return ps.filter(p => Array.isArray(p) && Number.isFinite(p[0]) && Number.isFinite(p[1]));
  }

  // Geometría fija para todos los estados: la escala, la figura centrada, y abajo la regla y la fila del fantasma.
  function geometria(d) {
    const ps = extremos(d);
    const xs = ps.map(p => p[0]), ys = ps.map(p => p[1]);
    const x0 = Math.min(0, ...xs), x1 = Math.max(0, ...xs), y0 = Math.min(0, ...ys), y1 = Math.max(0, ...ys);
    const sx = Math.max(x1 - x0, 1e-9), sy = Math.max(y1 - y0, 1e-9);
    let s = Math.min((W - 2 * MARGEN) / sx, (FIG_MAX - 2 * MARGEN) / sy);
    if (d.regla && d.regla.max > 0) s = Math.min(s, (R1 - R0) / d.regla.max);
    const figH = Math.max(sy * s, 40) + 2 * MARGEN;
    const ox = (W - sx * s) / 2 - x0 * s, oy = MARGEN + y1 * s + (figH - 2 * MARGEN - sy * s) / 2;
    const X = x => ox + x * s, Y = y => oy - y * s;
    const centro = [X((x0 + x1) / 2), Y((y0 + y1) / 2)];
    // Xi, Yi: las inversas (de píxel a unidades), para el gesto directo de la teoría.
    const g = { s, X, Y, Xi: px => (px - ox) / s, Yi: py => (oy - py) / s, centro, figH };
    if (d.regla) {
      g.copiaY = figH + 26; g.reglaY = g.copiaY + 14; g.manijaY = g.reglaY + 46;
      g.fantasmaY = g.manijaY + 30; g.xr = m => R0 + Math.max(0, m) * s;
    } else g.fantasmaY = figH + 18;
    g.alto = g.fantasmaY + 14;
    return g;
  }

  const dec = d => (d.regla && Number.isInteger(d.regla.decimales) ? d.regla.decimales : 1);
  const lectura = (d, m) => `${Kit.formatear(m, dec(d))}${d.unidad ? ' ' + d.unidad : ''}`;
  const largo = v => Math.hypot(v.a[0] - v.de[0], v.a[1] - v.de[1]);

  function controles(d) {
    const g = geometria(d);
    const c = { ancho: W, alto: g.alto, escala: g.s, respuesta: d.regla ? d.regla.respuesta : d.resultante ? largo(d.resultante) : null };
    if (d.regla) {
      c.marca = {
        min: 0, max: d.regla.max, inicio: 0,
        aX: m => R0 + m * g.s, deX: x => (x - R0) / g.s,
        texto: m => lectura(d, m),
      };
    }
    return c;
  }

  // Rótulo de una flecha: junto a su mitad, del lado que mira afuera de la figura.
  function rotuloFlecha(g, x1, y1, x2, y2, texto, o) {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, L = Math.hypot(x2 - x1, y2 - y1) || 1;
    let nx = -(y2 - y1) / L, ny = (x2 - x1) / L;
    if ((mx - g.centro[0]) * nx + (my - g.centro[1]) * ny < 0) { nx = -nx; ny = -ny; }
    if (o.lado === -1) { nx = -nx; ny = -ny; }
    const w = T.ancho(texto, T.TEXTO, 700);
    const px = mx + nx * 14, py = my + ny * 14;
    const ancla = Math.abs(nx) < 0.35 ? 'middle' : nx > 0 ? 'start' : 'end';
    const by = py + 5 + (ny > 0.35 ? 6 : ny < -0.35 ? -2 : 0);
    return T.rotulo(px, by, texto, { color: o.color, ancla, peso: 700, clase: o.clase, max: W - 2, min: 2, _w: w });
  }

  // Arco de un ángulo (antihorario desde «de» hasta «a», en grados), o el cuadradito si es recto.
  function arco(d, g, an, clase) {
    const cx = g.X(an.en[0]), cy = g.Y(an.en[1]);
    let barrido = ((an.a - an.de) % 360 + 360) % 360;
    const r = an.radio || 26;
    const p = (t, rr) => [cx + rr * Math.cos(rad(t)), cy - rr * Math.sin(rad(t))];
    const c = T.color(an.color);
    let s;
    if (Math.abs(barrido - 90) < 1e-6) {
      const q = 12, u = p(an.de, q), v = p(an.a, q), w = [u[0] + v[0] - cx, u[1] + v[1] - cy];
      s = `<path d="M${T.n(u[0])} ${T.n(u[1])}L${T.n(w[0])} ${T.n(w[1])}L${T.n(v[0])} ${T.n(v[1])}" fill="none" stroke="${c}" stroke-width="2" stroke-linejoin="round"/>`;
    } else {
      const [ax, ay] = p(an.de, r), [bx, by] = p(an.a, r);
      s = `<path d="M${T.n(ax)} ${T.n(ay)}A${r} ${r} 0 ${barrido > 180 ? 1 : 0} 0 ${T.n(bx)} ${T.n(by)}" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`;
    }
    if (an.texto) {
      // El rótulo va sobre el arco, en la dirección más lejos de las flechas que salen del vértice (no las tapa).
      const sal = [];
      for (const f of [...(d.flechas || []), ...(d.resultante ? [d.resultante] : [])]) {
        if (Math.hypot(f.de[0] - an.en[0], f.de[1] - an.en[1]) < 1e-9 && Math.hypot(f.a[0] - f.de[0], f.a[1] - f.de[1]) > 1e-9) sal.push(Math.atan2(f.a[1] - f.de[1], f.a[0] - f.de[0]) * 180 / Math.PI);
      }
      const lejos = t => Math.min(180, ...sal.map(u => { const x = Math.abs(((t - u) % 360 + 540) % 360 - 180); return x; }));
      const cands = [0.5, 0.35, 0.65, 0.25, 0.75].map(k => an.de + barrido * k);
      const mejor = cands.reduce((m, t) => (lejos(t) > lejos(m) + 8 ? t : m), cands[0]);
      // Lejos del vértice lo bastante para que el rótulo entero quepa entre las dos flechas vecinas.
      const ab = Math.max(10, Math.min(90, lejos(mejor)));
      const [tx, ty] = p(mejor, Math.max(r + 16, (T.ancho(an.texto, T.TEXTO, 700) / 2 + 10) / Math.sin(rad(ab))));
      s += T.rotulo(tx, ty + 6, an.texto, { color: an.color, ancla: 'middle', peso: 700 });
    }
    return `<g class="${clase}">${s}</g>`;
  }

  function marcaSVG(d, g, m, { solida, clase, rotulo, y }) {
    const x = g.xr(Math.min(Math.max(m, 0), d.regla.max));
    const lado = x > W / 2 ? 'end' : 'start', dx = lado === 'end' ? -16 : 16;
    let s = T.linea(x, g.copiaY - 10, x, y, { grosor: solida ? T.GROSOR.variable : T.GROSOR.contorno, discontinua: !solida, opacidad: solida ? undefined : 0.8 });
    s += solida ? `<circle cx="${T.n(x)}" cy="${T.n(y)}" r="11" fill="currentColor"/>` : `<circle cx="${T.n(x)}" cy="${T.n(y)}" r="6" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="3 3"/>`;
    s += T.rotulo(x + dx, y + 6, rotulo, { ancla: lado, peso: solida ? 700 : 400 });
    return `<g class="${clase}">${s}</g>`;
  }

  // Regla con la escala de la figura: marcas cortas cada «paso bonito» y números donde caben.
  function regla(d, g) {
    const max = d.regla.max, s = g.s;
    const pasos = [0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500];
    const fino = pasos.find(p => p * s >= 7) || 500, grueso = pasos.find(p => p * s >= 44 && p % fino === 0) || max;
    const marcas = [];
    for (let k = 0; k * fino <= max + 1e-9; k++) marcas.push(g.xr(k * fino));
    let out = T.eje(R0, g.xr(max), g.reglaY, { marcas, alto: 5 });
    for (let k = 0; k * grueso <= max + 1e-9; k++) {
      const x = g.xr(k * grueso);
      out += T.linea(x, g.reglaY - 9, x, g.reglaY, { grosor: 1 });
      out += T.rotulo(x, g.reglaY + 20, Kit.formatear(k * grueso, 1), { ancla: 'middle', clase: 'kit-tenue' });
    }
    return `<g class="kit-regla">${out}</g>`;
  }

  function dibujar(d, estado = {}) {
    const g = geometria(d);
    const final = !!estado.final;
    const p = final ? Infinity : Math.max(0, Number.isFinite(estado.paso) ? estado.paso : 0);
    const ve = el => (el.paso || 0) <= p;
    const nuevo = el => (!final && (el.paso || 0) === p && p > 0 ? ' kit-nuevo' : '');
    let s = '';
    if (d.ejes) {
      const ps = extremos(d), xs = ps.map(q => q[0]), ys = ps.map(q => q[1]);
      const ax0 = g.X(Math.min(0, ...xs)) - 16, ax1 = g.X(Math.max(0, ...xs)) + 16;
      const ay0 = g.Y(Math.max(0, ...ys)) - 16, ay1 = g.Y(Math.min(0, ...ys)) + 16;
      s += `<g class="kit-tenue">${T.linea(ax0, g.Y(0), ax1, g.Y(0), { grosor: 1 })}${T.linea(g.X(0), ay0, g.X(0), ay1, { grosor: 1 })}`
        + `${T.rotulo(ax1 + 4, g.Y(0) + 5, 'x')}${T.rotulo(g.X(0) + 6, ay0 + 4, 'y')}</g>`;
      // Los unitarios î y ĵ: flechas de largo 1 en la escala de la figura, desde el origen (fidelidad: miden 1).
      const o = [g.X(0), g.Y(0)];
      s += `<g class="kit-unitarios">${T.flecha(o[0], o[1], g.X(1), o[1], { grosor: 2 })}${T.flecha(o[0], o[1], o[0], g.Y(1), { grosor: 2 })}`
        + `${T.rotulo(g.X(0.5), o[1] + 20, 'î', { peso: 700, ancla: 'middle' })}${T.rotulo(o[0] - 8, g.Y(0.5) + 6, 'ĵ', { peso: 700, ancla: 'end' })}</g>`;
    }
    if (d.contorno && d.contorno.length > 2) {
      s += `<path class="kit-tenue" d="M${d.contorno.map(q => `${T.n(g.X(q[0]))} ${T.n(g.Y(q[1]))}`).join('L')}Z" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/>`;
    }
    for (const gu of d.guias || []) if (ve(gu)) {
      s += `<g class="kit-aparece${nuevo(gu)}">${T.linea(g.X(gu.de[0]), g.Y(gu.de[1]), g.X(gu.a[0]), g.Y(gu.a[1]), { color: gu.color, grosor: 2, discontinua: true, opacidad: 0.7 })}</g>`;
    }
    for (const sg of d.segmentos || []) if (ve(sg)) {
      const x1 = g.X(sg.de[0]), y1 = g.Y(sg.de[1]), x2 = g.X(sg.a[0]), y2 = g.Y(sg.a[1]);
      s += `<g class="kit-aparece${nuevo(sg)}">${T.linea(x1, y1, x2, y2, { color: sg.color, grosor: 3 })}${sg.texto ? rotuloFlecha(g, x1, y1, x2, y2, sg.texto, { color: sg.color }) : ''}</g>`;
    }
    for (const an of d.angulos || []) if (ve(an)) s += arco(d, g, an, `kit-aparece${nuevo(an)}`);
    for (const f of d.flechas || []) if (ve(f)) {
      const x1 = g.X(f.de[0]), y1 = g.Y(f.de[1]), x2 = g.X(f.a[0]), y2 = g.Y(f.a[1]);
      if (Math.hypot(x2 - x1, y2 - y1) < 1) continue;
      const grosor = f.grosor === 'contorno' ? T.GROSOR.contorno : T.GROSOR.variable;
      let a = T.flecha(x1, y1, x2, y2, { color: f.color, grosor });
      if (f.discontinua) a = a.replace('stroke-linecap="round"/>', 'stroke-linecap="round" stroke-dasharray="6 5"/>').replace(/<path /, '<path fill-opacity="0.6" ');
      const texto = f.valor !== undefined && p >= (f.valorPaso || 0) ? `${f.rotulo} = ${f.valor}` : f.rotulo;
      s += `<g class="kit-aparece${nuevo(f)}">${a}${texto ? rotuloFlecha(g, x1, y1, x2, y2, texto, { color: f.color, lado: f.lado }) : ''}</g>`;
    }
    for (const q of d.puntos || []) if (ve(q)) {
      const x = g.X(q.x), y = g.Y(q.y), L = Math.hypot(x - g.centro[0], y - g.centro[1]) || 1;
      const ux = (x - g.centro[0]) / L, uy = (y - g.centro[1]) / L;
      s += `<g class="kit-aparece${nuevo(q)}"><circle cx="${T.n(x)}" cy="${T.n(y)}" r="3" fill="currentColor"/>`
        + `${q.rotulo ? T.rotulo(x + ux * 14, y + uy * 14 + 5, q.rotulo, { ancla: 'middle', peso: 600 }) : ''}</g>`;
    }
    // La resultante: en el final (o desde su paso), con su valor; si hay regla, su copia acostada sobre ella.
    const res = d.resultante;
    if (res && (final || (res.paso !== undefined && res.paso <= p))) {
      const x1 = g.X(res.de[0]), y1 = g.Y(res.de[1]), x2 = g.X(res.a[0]), y2 = g.Y(res.a[1]);
      const texto = final && res.valor !== undefined ? `${res.rotulo} = ${res.valor}` : res.rotulo;
      const cl = final ? ' kit-nuevo' : nuevo(res);
      if (Math.hypot(x2 - x1, y2 - y1) >= 1) {
        s += `<g class="kit-aparece${cl}">${T.flecha(x1, y1, x2, y2, { color: res.color, grosor: T.GROSOR.variable })}${rotuloFlecha(g, x1, y1, x2, y2, texto, { color: res.color, lado: res.lado })}</g>`;
      } else {
        s += `<g class="kit-aparece${cl}"><circle cx="${T.n(x1)}" cy="${T.n(y1)}" r="5" fill="${T.color(res.color)}"/>${T.rotulo(x1 + 10, y1 - 10, texto, { color: res.color, peso: 700 })}</g>`;
      }
    }
    if (d.regla) {
      s += regla(d, g);
      if (final) {
        const L = d.regla.respuesta * g.s;
        if (L >= 1) s += `<g class="kit-final kit-aparece kit-nuevo">${T.flecha(R0, g.copiaY, R0 + L, g.copiaY, { color: res ? res.color : null, grosor: T.GROSOR.variable })}</g>`;
      }
      if (estado.fantasma && Number.isFinite(estado.fantasma.marca)) {
        const f = estado.fantasma;
        s += marcaSVG(d, g, f.marca, { solida: false, clase: 'kit-fantasma', y: g.fantasmaY, rotulo: `${f.rotulo ? f.rotulo + ': ' : ''}${f.texto || lectura(d, f.marca)}` });
      }
      if (final) s += marcaSVG(d, g, d.regla.respuesta, { solida: true, clase: 'kit-respuesta kit-aparece kit-nuevo', y: g.manijaY, rotulo: `${d.regla.texto || lectura(d, d.regla.respuesta)} ✓` });
      else if (Number.isFinite(estado.marca)) s += marcaSVG(d, g, estado.marca, { solida: true, clase: 'kit-marca', y: g.manijaY, rotulo: lectura(d, estado.marca) });
    } else if (estado.fantasma && (estado.fantasma.rotulo || estado.fantasma.texto)) {
      // Sin regla, el error elegido va en su fila, con contorno discontinuo: no se dibuja como dato.
      const f = estado.fantasma, t = `${f.rotulo ? f.rotulo + ': ' : ''}${f.texto || (Number.isFinite(f.marca) ? lectura(d, f.marca) : '')}`;
      const w = Math.min(W - 4, T.ancho(t) + 20);
      s += `<g class="kit-fantasma"><rect x="${T.n((W - w) / 2)}" y="${T.n(g.fantasmaY - 17)}" width="${T.n(w)}" height="26" rx="6" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4"/>`
        + `${T.rotulo(W / 2, g.fantasmaY + 1, t, { ancla: 'middle' })}</g>`;
    }
    return T.svg(W, g.alto, s, { alt: alt(d) });
  }

  function alt(d) {
    const fl = (d.flechas || []).filter(f => !f.discontinua && f.rotulo).map(f => (f.valor !== undefined ? `${f.rotulo} de ${f.valor}` : f.rotulo));
    const lista = fl.length > 1 ? fl.slice(0, -1).join(', ') + ' y ' + fl[fl.length - 1] : fl[0] || 'flechas';
    const ang = (d.angulos || []).filter(a => a.texto && !a.paso).map(a => a.texto);
    return `Flechas a escala, con el largo proporcional al módulo: ${lista}`
      + (ang.length ? `; ángulos de ${ang.join(' y ')}` : '')
      + (d.regla ? `. Debajo, una regla con la misma escala para medir ${d.resultante ? d.resultante.rotulo : 'la resultante'}` : '');
  }

  return { id: 'flechas', dibujar, alt, controles, geometria };
});
