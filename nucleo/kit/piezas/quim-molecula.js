/*
 * Pieza «quim-molecula» (sesión de teoría de Química): una o varias estructuras en el plano, con átomos (o grupos
 * condensados como «CH₃»), enlaces simples, dobles y triples, pares libres, cargas parciales o formales, flechas
 * de dipolo de cada enlace y el dipolo total, ángulos, zonas resaltadas (un grupo funcional, un enlace peptídico)
 * y textos y flechas sueltas (resonancia, reacción). Sirve para Lewis, VSEPR, polaridad, fuerzas entre moléculas,
 * hidrocarburos, isómeros, grupos funcionales y biomoléculas.
 *
 * Afirmación de la figura: lo que define la estructura es qué átomo se une con cuál y cómo; la orientación en el
 * papel no cambia la molécula.
 *
 * Fidelidad: cada enlace dibujado es uno de los datos y su orden (1, 2, 3) se cuenta en líneas; cada par libre son
 * dos puntos; un ángulo rotulado está dibujado con su valor (las coordenadas las calcula la unidad). Las
 * flechas de dipolo apuntan al átomo más electronegativo (lo decide la unidad). Una proyección plana de una
 * molécula 3D lo dice el alt.
 *
 * Coordenadas en unidades (1 unidad = `escala` px, por defecto 40), con y hacia abajo. La figura se centra sola
 * con todo lo que trae (también lo que aparece en pasos posteriores): el encuadre no salta entre pasos.
 * datos = {
 *   atomos:  [{ id, t: 'O', x, y, color, desde, hasta, sinMarco }],      // t puede ser «CH₃», «OH», «Gly»
 *   enlaces: [{ a, b, orden: 1|2|3, color, dipolo: 'b' | 'a', discontinuo, desde, hasta }],
 *            // dipolo: flecha de enlace (con su cruz en la cola) que apunta hacia el átomo a o b;
 *            // discontinuo: interacción que no es enlace (puente de hidrógeno)
 *   pares:   [{ en: id, ang: grados (0 = derecha, 90 = abajo), desde }], // un par libre = dos puntos
 *   cargas:  [{ en: id, t: 'δ−', ang, color, desde }],
 *   angulos: [{ en: id, de: id, a: id, texto: '104,5°', color, desde }],
 *   resaltos:[{ atomos: [id…], texto, color, desde, hasta }],             // marco redondeado tenue con su nombre
 *   textos:  [{ x, y, t, color, peso, desde, hasta }],
 *   flechas: [{ de: [x, y], a: [x, y], doble, color, desde, hasta, dipolo }],  // dipolo: flecha gruesa con cruz
 *   escala: 40, alto, alt,
 * }
 * estado = { corte }. El dibujo es una función pura de (datos, estado).
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
  const W = 320, PAD = 22, TAM = 16;

  function encuadre(d) {
    const e = d.escala || 40;
    const xs = [], ys = [];
    for (const a of d.atomos || []) { xs.push(a.x); ys.push(a.y); }
    for (const t of d.textos || []) { xs.push(t.x); ys.push(t.y); }
    for (const f of d.flechas || []) { xs.push(f.de[0], f.a[0]); ys.push(f.de[1], f.a[1]); }
    if (!xs.length) { xs.push(0); ys.push(0); }
    const minx = Math.min(...xs), maxx = Math.max(...xs), miny = Math.min(...ys), maxy = Math.max(...ys);
    const alto = d.alto || Math.max(120, (maxy - miny) * e + 2 * PAD + 30);
    const ox = W / 2 - ((minx + maxx) / 2) * e, oy = alto / 2 - ((miny + maxy) / 2) * e;
    return { e, alto, X: x => ox + x * e, Y: y => oy + y * e };
  }

  // Medio ancho y medio alto de la etiqueta de un átomo (para recortar los enlaces en su borde).
  const caja = a => ({ w: Math.max(11, T.ancho(a.t, TAM, 700) / 2 + 5), h: 11 });
  function recorte(a, dx, dy) {
    const c = caja(a), L = Math.hypot(dx, dy) || 1, ux = Math.abs(dx / L), uy = Math.abs(dy / L);
    const t = Math.min(ux > 1e-6 ? c.w / ux : Infinity, uy > 1e-6 ? c.h / uy : Infinity);
    return t + 2;
  }

  function enlaceSVG(g, A, B, en, nuevo) {
    const x1 = g.X(A.x), y1 = g.Y(A.y), x2 = g.X(B.x), y2 = g.Y(B.y);
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
    const ra = recorte(A, dx, dy), rb = recorte(B, dx, dy);
    const ax = x1 + ux * ra, ay = y1 + uy * ra, bx = x2 - ux * rb, by = y2 - uy * rb;
    const orden = en.orden || 1, desp = orden === 2 ? [-3.5, 3.5] : orden === 3 ? [-5, 0, 5] : [0];
    const c = en.color ? T.color(en.color) : 'currentColor';
    let s = '';
    for (const o of desp) s += `<line x1="${T.n(ax + nx * o)}" y1="${T.n(ay + ny * o)}" x2="${T.n(bx + nx * o)}" y2="${T.n(by + ny * o)}" stroke="${c}" stroke-width="${en.color ? 2.5 : 2}" stroke-linecap="round"${en.discontinuo ? ' stroke-dasharray="2 4"' : ''}/>`;
    if (en.dipolo) {
      // Flecha de dipolo paralela al enlace, del lado n, con cruz en la cola (lado positivo).
      const haciaB = en.dipolo !== 'a', o = 11;
      const sx = haciaB ? ax : bx, sy = haciaB ? ay : by, tx = haciaB ? bx : ax, ty = haciaB ? by : ay;
      const px = sx + nx * o, py = sy + ny * o, qx = tx + nx * o, qy = ty + ny * o;
      const cx = px + (qx - px) * 0.18, cy = py + (qy - py) * 0.18;
      s += T.flecha(px, py, qx, qy, { color: 'o', grosor: 2 });
      s += `<line x1="${T.n(cx - nx * 5)}" y1="${T.n(cy - ny * 5)}" x2="${T.n(cx + nx * 5)}" y2="${T.n(cy + ny * 5)}" stroke="var(--c-o)" stroke-width="2" stroke-linecap="round"/>`;
    }
    return `<g class="kit-enlace${nuevo}">${s}</g>`;
  }

  function dibujar(d, estado = {}) {
    const g = encuadre(d), corte = Math.max(0, estado.corte || 0);
    const ve = x => (x.desde || 0) <= corte && !(x.hasta < corte);
    const nuevo = x => ((x.desde || 0) === corte && corte > 0 ? ' kit-nuevo kit-aparece' : '');
    const por = new Map((d.atomos || []).map(a => [a.id, a]));
    let s = '';
    for (const r of d.resaltos || []) {
      if (!ve(r)) continue;
      const as = r.atomos.map(id => por.get(id)).filter(Boolean);
      if (!as.length) continue;
      const x0 = Math.min(...as.map(a => g.X(a.x) - caja(a).w)) - 6, x1 = Math.max(...as.map(a => g.X(a.x) + caja(a).w)) + 6;
      const y0 = Math.min(...as.map(a => g.Y(a.y))) - 18, y1 = Math.max(...as.map(a => g.Y(a.y))) + 18;
      let q = `<rect x="${T.n(x0)}" y="${T.n(y0)}" width="${T.n(x1 - x0)}" height="${T.n(y1 - y0)}" rx="12" fill="${T.color(r.color)}" fill-opacity="0.14" stroke="${T.color(r.color)}" stroke-width="1.5" stroke-dasharray="4 3"/>`;
      if (r.texto) q += T.rotulo((x0 + x1) / 2, y1 + 18, r.texto, { ancla: 'middle', color: r.color, peso: 700 });
      s += `<g class="kit-resalto${nuevo(r)}">${q}</g>`;
    }
    for (const en of d.enlaces || []) {
      const A = por.get(en.a), B = por.get(en.b);
      if (A && B && ve(en) && ve(A) && ve(B)) s += enlaceSVG(g, A, B, en, nuevo(en));
    }
    for (const a of d.atomos || []) {
      if (!ve(a)) continue;
      const x = g.X(a.x), y = g.Y(a.y), c = caja(a);
      let q = '';
      if (!a.sinMarco && a.color) q += `<rect x="${T.n(x - c.w)}" y="${T.n(y - c.h - 2)}" width="${T.n(2 * c.w)}" height="${T.n(2 * c.h + 4)}" rx="${T.n(Math.min(c.w, c.h + 2))}" fill="var(--card)" stroke="${T.color(a.color)}" stroke-width="2"/>`;
      q += T.rotulo(x, y + 6, a.t, { ancla: 'middle', peso: 700, color: a.color, tam: TAM });
      s += `<g class="kit-atomo${nuevo(a)}">${q}</g>`;
    }
    for (const p of d.pares || []) {
      const A = por.get(p.en); if (!A || !ve(p) || !ve(A)) continue;
      const r = Math.max(caja(A).w, 13) + 5, ang = p.ang * Math.PI / 180;
      const cx = g.X(A.x) + r * Math.cos(ang), cy = g.Y(A.y) + r * Math.sin(ang);
      const tx = -Math.sin(ang) * 3.5, ty = Math.cos(ang) * 3.5;
      s += `<g class="kit-par${nuevo(p)}"><circle cx="${T.n(cx + tx)}" cy="${T.n(cy + ty)}" r="2.2" fill="currentColor"/><circle cx="${T.n(cx - tx)}" cy="${T.n(cy - ty)}" r="2.2" fill="currentColor"/></g>`;
    }
    for (const q of d.cargas || []) {
      const A = por.get(q.en); if (!A || !ve(q) || !ve(A)) continue;
      const ang = (q.ang === undefined ? -60 : q.ang) * Math.PI / 180, r = Math.max(caja(A).w, 13) + 12;
      s += `<g class="kit-carga${nuevo(q)}">${T.rotulo(g.X(A.x) + r * Math.cos(ang), g.Y(A.y) + r * Math.sin(ang) + 5, q.t, { ancla: 'middle', color: q.color, peso: 700 })}</g>`;
    }
    for (const an of d.angulos || []) {
      const C = por.get(an.en), A = por.get(an.de), B = por.get(an.a);
      if (!C || !A || !B || !ve(an)) continue;
      const a1 = Math.atan2(g.Y(A.y) - g.Y(C.y), g.X(A.x) - g.X(C.x)), a2 = Math.atan2(g.Y(B.y) - g.Y(C.y), g.X(B.x) - g.X(C.x));
      let da = a2 - a1; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
      const r = 26, cx = g.X(C.x), cy = g.Y(C.y);
      const p1 = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)], p2 = [cx + r * Math.cos(a1 + da), cy + r * Math.sin(a1 + da)];
      const am = a1 + da / 2;
      let q = `<path d="M${T.n(p1[0])} ${T.n(p1[1])}A${r} ${r} 0 0 ${da > 0 ? 1 : 0} ${T.n(p2[0])} ${T.n(p2[1])}" fill="none" stroke="${T.color(an.color)}" stroke-width="2"/>`;
      q += T.rotulo(cx + (r + 22) * Math.cos(am), cy + (r + 22) * Math.sin(am) + 5, an.texto, { ancla: 'middle', color: an.color, peso: 700 });
      s += `<g class="kit-angulo${nuevo(an)}">${q}</g>`;
    }
    for (const f of d.flechas || []) {
      if (!ve(f)) continue;
      const x1 = g.X(f.de[0]), y1 = g.Y(f.de[1]), x2 = g.X(f.a[0]), y2 = g.Y(f.a[1]);
      let q = T.flecha(x1, y1, x2, y2, { color: f.color, grosor: f.dipolo ? T.GROSOR.variable : T.GROSOR.contorno });
      if (f.doble) q += T.flecha(x2, y2, x1, y1, { color: f.color, grosor: T.GROSOR.contorno });
      if (f.dipolo) {
        const L = Math.hypot(x2 - x1, y2 - y1) || 1, nx = -(y2 - y1) / L, ny = (x2 - x1) / L;
        const cx = x1 + (x2 - x1) * 0.18, cy = y1 + (y2 - y1) * 0.18;
        q += `<line x1="${T.n(cx - nx * 7)}" y1="${T.n(cy - ny * 7)}" x2="${T.n(cx + nx * 7)}" y2="${T.n(cy + ny * 7)}" stroke="${T.color(f.color)}" stroke-width="3" stroke-linecap="round"/>`;
      }
      s += `<g class="kit-flecha${nuevo(f)}">${q}</g>`;
    }
    for (const t of d.textos || []) if (ve(t)) s += `<g class="kit-texto${nuevo(t)}">${T.rotulo(g.X(t.x), g.Y(t.y) + 5, t.t, { ancla: 'middle', color: t.color, peso: t.peso || 600 })}</g>`;
    return T.svg(W, g.alto, s, { alt: alt(d) });
  }

  function alt(d) {
    if (d.alt) return d.alt;
    const por = new Map((d.atomos || []).map(a => [a.id, a.t]));
    const en = (d.enlaces || []).filter(e => !e.discontinuo).map(e => `${por.get(e.a)}${['', '–', '=', '≡'][e.orden || 1]}${por.get(e.b)}`);
    return `Estructura en el plano (proyección): ${en.join(', ') || (d.atomos || []).map(a => a.t).join(', ')}.`;
  }

  return { id: 'quim-molecula', dibujar, alt, encuadre };
});
