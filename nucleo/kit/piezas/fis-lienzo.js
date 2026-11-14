/*
 * Pieza «fis-lienzo» (docs/teoria.md, sección 4): un plano de física a escala, con y hacia arriba y metros como
 * unidad. Dibuja cuerpos (polígonos y discos), el suelo o la rampa, arcos, flechas de fuerza, velocidad o
 * aceleración (a su propia escala, fija para toda la unidad), cotas y rótulos pegados. Sirve para diagramas de
 * cuerpo libre, palancas, ruedas que giran, órbitas, trayectorias y barras de energía.
 *
 * Afirmación de la figura: cada flecha mide lo que vale y sale del cuerpo sobre el que actúa; lo que no cambia
 * entre estados no se mueve.
 *
 * Fidelidad: una sola escala (px por metro) para los dos ejes, fijada por `vista`, que no cambia entre estados; así
 * el alto del SVG no salta al mover un control. Cada familia de flechas usa su escala (px por unidad), que el
 * archivo de teoría fija una vez: una flecha del doble de valor mide el doble.
 *
 * datos = {
 *   vista: { x0, x1, y0, y1 },               // ventana en metros (y hacia arriba); la escala sale del ancho
 *   alt: 'texto',                             // texto alternativo que cuenta la relación (lo escribe quien llama)
 *   poligonos: [{ puntos: [[x, y], …], cerrado, relleno, color, grosor: 'variable'|'contorno'|'fino',
 *                 discontinua, rayado, rotulo, en: [x, y], paso, hasta }],   // rayado: suelo (rayitas debajo)
 *   discos:    [{ c: [x, y], r, color, relleno, rotulo, paso, hasta }],     // r en metros (mínimo 4 px)
 *   arcos:     [{ c: [x, y], r, rpx, de, a, color, grosor, rotulo, paso, hasta }],  // de y a en grados, antihorario
 *   segmentos: [{ de: [x, y], a: [x, y], color, grosor, discontinua, texto, lado, paso, hasta }],
 *   flechas:   [{ de: [x, y], d: [dx, dy], escala, color, rotulo, lado: 1|-1,
 *                 rotuloEn: 'cola' (rótulo junto a la cola, si la punta llega a un cuerpo), discontinua, paso, hasta }],
 *              // d en unidades de la magnitud (N, m/s, m/s²); escala en px por unidad (por defecto datos.escalaF);
 *              // tras: [dx, dy] en esas unidades corre el origen (para encadenar flechas cola con punta)
 *   textos:    [{ en: [x, y], texto, color, ancla, peso, paso, hasta }],
 *   puntos:    [{ x, y, color, hueco, rotulo, paso, hasta }],
 *   escalaF: 4                                // px por unidad de flecha, por defecto
 * }
 * estado = { paso: 0..n, final: false }   // se ve lo que tiene paso ≤ estado.paso y hasta ≥ estado.paso (rastro)
 * El dibujo es una función pura de (datos, estado): sin ids, sin azar, sin reloj. Todo número que se ve lo trae
 * quien llama; la pieza solo convierte metros y unidades a píxeles.
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
  const W = 320, M = 20, ALTO_MAX = 300;
  const rad = g => g * Math.PI / 180;
  const GROSOR = { variable: T.GROSOR.variable, contorno: T.GROSOR.contorno, fino: T.GROSOR.cuadricula };

  function geometria(d) {
    const v = d.vista || { x0: -5, x1: 5, y0: -5, y1: 5 };
    const sx = Math.max(v.x1 - v.x0, 1e-9), sy = Math.max(v.y1 - v.y0, 1e-9);
    const s = Math.min((W - 2 * M) / sx, (ALTO_MAX - 2 * M) / sy);
    const alto = Math.round(sy * s + 2 * M);
    const ox = (W - sx * s) / 2;
    // Xi, Yi: las inversas (de píxel a metro), para que el gesto directo convierta el dedo en valores.
    return { s, alto, X: x => ox + (x - v.x0) * s, Y: y => M + (v.y1 - y) * s, Xi: px => v.x0 + (px - ox) / s, Yi: py => v.y1 - (py - M) / s };
  }

  // Se ve en este estado: desde su paso y hasta su «hasta» (lo que se va, se va a propósito).
  const ve = (el, p) => (el.paso || 0) <= p && (el.hasta === undefined || p <= el.hasta);

  function dibujar(d, estado = {}) {
    const g = geometria(d);
    const p = estado.final ? Infinity : Math.max(0, Number.isFinite(estado.paso) ? estado.paso : 0);
    const nuevo = el => (!estado.final && (el.paso || 0) === p && p > 0 ? ' kit-nuevo' : '');
    let s = '';
    for (const q of d.poligonos || []) if (ve(q, p) && q.puntos && q.puntos.length > 1) {
      const pts = q.puntos.map(([x, y]) => `${T.n(g.X(x))} ${T.n(g.Y(y))}`);
      const c = T.color(q.color), gr = GROSOR[q.grosor || 'contorno'];
      let el = `<path d="M${pts.join('L')}${q.cerrado ? 'Z' : ''}" fill="${q.relleno ? c : 'none'}"${q.relleno ? ` fill-opacity="${q.relleno === true ? 0.16 : q.relleno}"` : ''} stroke="${c}" stroke-width="${gr}" stroke-linejoin="round" stroke-linecap="round"${q.discontinua ? ' stroke-dasharray="6 5"' : ''}/>`;
      if (q.rayado) {
        // Rayitas del suelo bajo el primer tramo y los siguientes, cada 12 px.
        for (let i = 0; i + 1 < q.puntos.length; i++) {
          const [x1, y1] = [g.X(q.puntos[i][0]), g.Y(q.puntos[i][1])], [x2, y2] = [g.X(q.puntos[i + 1][0]), g.Y(q.puntos[i + 1][1])];
          const L = Math.hypot(x2 - x1, y2 - y1), n = Math.floor(L / 12);
          for (let k = 0; k <= n; k++) {
            const x = x1 + (x2 - x1) * k / Math.max(n, 1), y = y1 + (y2 - y1) * k / Math.max(n, 1);
            el += T.linea(x, y, x - 7, y + 8, { grosor: 1, opacidad: 0.5 });
          }
        }
      }
      if (q.rotulo) {
        const [ex, ey] = q.en || q.puntos[0];
        el += T.rotulo(g.X(ex), g.Y(ey), q.rotulo, { color: q.color, ancla: 'middle', peso: 700 });
      }
      s += `<g class="kit-aparece${nuevo(q)}">${el}</g>`;
    }
    for (const a of d.arcos || []) if (ve(a, p)) {
      const cx = g.X(a.c[0]), cy = g.Y(a.c[1]), r = a.rpx || a.r * g.s;
      const barrido = ((a.a - a.de) % 360 + 360) % 360 || 360;
      const pt = t => [cx + r * Math.cos(rad(t)), cy - r * Math.sin(rad(t))];
      const c = T.color(a.color), gr = GROSOR[a.grosor || 'contorno'];
      let el;
      if (barrido >= 359.999) el = `<circle cx="${T.n(cx)}" cy="${T.n(cy)}" r="${T.n(r)}" fill="none" stroke="${c}" stroke-width="${gr}"${a.discontinua ? ' stroke-dasharray="6 5"' : ''}/>`;
      else {
        const [x1, y1] = pt(a.de), [x2, y2] = pt(a.a);
        el = `<path d="M${T.n(x1)} ${T.n(y1)}A${T.n(r)} ${T.n(r)} 0 ${barrido > 180 ? 1 : 0} 0 ${T.n(x2)} ${T.n(y2)}" fill="none" stroke="${c}" stroke-width="${gr}" stroke-linecap="round"${a.discontinua ? ' stroke-dasharray="6 5"' : ''}/>`;
      }
      if (a.rotulo) {
        const [tx, ty] = (() => { const t = a.de + barrido / 2, rr = r + 16; return [cx + rr * Math.cos(rad(t)), cy - rr * Math.sin(rad(t)) + 5]; })();
        el += T.rotulo(tx, ty, a.rotulo, { color: a.color, ancla: 'middle', peso: 700 });
      }
      s += `<g class="kit-aparece${nuevo(a)}">${el}</g>`;
    }
    for (const q of d.segmentos || []) if (ve(q, p)) {
      const x1 = g.X(q.de[0]), y1 = g.Y(q.de[1]), x2 = g.X(q.a[0]), y2 = g.Y(q.a[1]);
      let el = T.linea(x1, y1, x2, y2, { color: q.color, grosor: GROSOR[q.grosor || 'contorno'], discontinua: q.discontinua });
      if (q.texto) {
        const L = Math.hypot(x2 - x1, y2 - y1) || 1, lado = q.lado === -1 ? -1 : 1;
        const nx = -(y2 - y1) / L * lado, ny = (x2 - x1) / L * lado;
        const ancla = Math.abs(nx) < 0.4 ? 'middle' : nx > 0 ? 'start' : 'end';
        el += T.rotulo((x1 + x2) / 2 - nx * 10, (y1 + y2) / 2 - ny * 12 + 5, q.texto, { color: q.color, ancla, peso: 700 });
      }
      s += `<g class="kit-aparece${nuevo(q)}">${el}</g>`;
    }
    for (const q of d.discos || []) if (ve(q, p)) {
      const c = T.color(q.color), r = Math.max(4, q.r * g.s);
      let el = `<circle cx="${T.n(g.X(q.c[0]))}" cy="${T.n(g.Y(q.c[1]))}" r="${T.n(r)}" fill="${q.relleno ? c : 'var(--card)'}"${q.relleno ? ` fill-opacity="${q.relleno === true ? 0.2 : q.relleno}"` : ''} stroke="${c}" stroke-width="${T.GROSOR.contorno}"/>`;
      if (q.rotulo) el += T.rotulo(g.X(q.c[0]), g.Y(q.c[1]) + 5, q.rotulo, { color: q.color, ancla: 'middle', peso: 700 });
      s += `<g class="kit-aparece${nuevo(q)}">${el}</g>`;
    }
    for (const f of d.flechas || []) if (ve(f, p)) {
      const k = f.escala || d.escalaF || 4;
      const tr = f.tras || [0, 0];
      const x1 = g.X(f.de[0]) + tr[0] * k, y1 = g.Y(f.de[1]) - tr[1] * k, x2 = x1 + f.d[0] * k, y2 = y1 - f.d[1] * k;
      if (Math.hypot(x2 - x1, y2 - y1) < 2) continue;
      let el = T.flecha(x1, y1, x2, y2, { color: f.color, grosor: T.GROSOR.variable });
      if (f.discontinua) el = el.replace('stroke-linecap="round"/>', 'stroke-linecap="round" stroke-dasharray="6 5"/>').replace(/<path /, '<path fill-opacity="0.5" ');
      if (f.rotulo) {
        const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L;
        if (Math.abs(ux) < 0.4) {
          // Flecha casi vertical: el rótulo va al costado, cerca de la punta (no tapa el cuerpo donde llega).
          const lado = f.lado === -1 ? -1 : 1;
          el += T.rotulo(x2 + lado * 8, y2 - uy * Math.min(14, L / 3) + 5, f.rotulo, { color: f.color, ancla: lado > 0 ? 'start' : 'end', peso: 700 });
        } else if (f.rotuloEn === 'cola') el += T.rotulo(x1 - ux * 6, y1 - uy * 12 + 5, f.rotulo, { color: f.color, ancla: ux > 0 ? 'end' : 'start', peso: 700 });
        else el += T.rotulo(x2 + ux * 6, y2 + uy * 12 + (uy < -0.4 ? -2 : 5), f.rotulo, { color: f.color, ancla: ux > 0 ? 'start' : 'end', peso: 700 });
      }
      s += `<g class="kit-aparece${nuevo(f)}">${el}</g>`;
    }
    for (const q of d.puntos || []) if (ve(q, p)) {
      const c = T.color(q.color);
      let el = `<circle cx="${T.n(g.X(q.x))}" cy="${T.n(g.Y(q.y))}" r="4" fill="${q.hueco ? 'var(--card)' : c}" stroke="${c}" stroke-width="2"/>`;
      if (q.rotulo) el += T.rotulo(g.X(q.x) + 8, g.Y(q.y) - 8, q.rotulo, { color: q.color, peso: 600 });
      s += `<g class="kit-aparece${nuevo(q)}">${el}</g>`;
    }
    for (const q of d.textos || []) if (ve(q, p)) {
      s += `<g class="kit-aparece${nuevo(q)}">${T.rotulo(g.X(q.en[0]), g.Y(q.en[1]), q.texto, { color: q.color, ancla: q.ancla || 'middle', peso: q.peso || 600 })}</g>`;
    }
    return T.svg(W, g.alto, s, { alt: alt(d) });
  }

  function alt(d) {
    if (d.alt && String(d.alt).length >= 15) return String(d.alt);
    const fl = (d.flechas || []).filter(f => f.rotulo && !f.discontinua).map(f => f.rotulo);
    return `Figura a escala${fl.length ? ` con las flechas ${fl.join(', ')}, cada una del largo de su valor` : ''}.`;
  }

  return { id: 'fis-lienzo', dibujar, alt, geometria };
});
