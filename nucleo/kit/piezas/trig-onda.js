/*
 * Pieza «trig-onda» (docs/teoria.md, sección 4): la gráfica de una función trigonométrica con el eje x en radianes,
 * rotulado en múltiplos de π (π/2, π, 3π/2…), y el eje y con sus números. Dibuja curvas muestreadas que se cortan
 * en las asíntotas (null) y se recortan al borde del plano, asíntotas verticales discontinuas, rectas y = k,
 * la llave de un periodo (de una cresta a la siguiente, con su rótulo «T = π»), una franja sombreada y puntos.
 * Sirve para seno y coseno, amplitud y periodo, tangente y cotangente, secante y cosecante, y periodos de
 * funciones transformadas; también para ecuaciones (cortes con y = k) y funciones inversas.
 *
 * Afirmación de la figura: el periodo es un largo sobre el eje x, medido con las marcas de π; la misma forma
 * se repite cada T.
 *
 * Fidelidad: las marcas de π van en su valor real (π/2 ≈ 1,57 rad), así que el largo de la llave es el periodo;
 * las escalas de x y de y son distintas (se elige la del plano), como en toda gráfica de función.
 *
 * Coordenadas en unidades del problema (x en radianes). Todo número lo calcula quien usa la pieza (regla 1).
 * datos = {
 *   x: { min, max, cada: 2 },            // marcas cada π/cada (cada = 2: π/2; 4: π/4; 1: π)
 *   y: { min, max, paso: 1, decimales: 0, nombre: 'y' },
 *   curvas:   [{ puntos: [[x, y], …, null, …], color, discontinua, rotulo, en: [x, y], lado, desde, hasta }],
 *   asintotas: [{ x, desde, hasta }],                     // rectas x = k, discontinuas, de borde a borde
 *   rectas:   [{ y, color, rotulo, desde, hasta }],       // rectas y = k, discontinuas
 *   periodos: [{ de, a, y, color, rotulo, desde, hasta }], // llave horizontal de de a a, a la altura y
 *   franjas:  [{ de, a, color, eje: 'x' | 'y', desde, hasta }], // franja tenue: vertical (x de de a a) u horizontal (y)
 *   puntos:   [{ x, y, color, rotulo, abierto, lado: 'n'|'s'|'e'|'o'|'ne'|…, desde, hasta }],
 *   alt: 'texto alternativo'
 * }
 * estado = { corte: 0..n }   // se ve lo que tiene desde ≤ corte (y hasta ≥ corte); lo de desde = corte es nuevo
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
  const W = 320, PX0 = 40, PX1 = 300, PY0 = 26, ALTO = 180, ABAJO = 40;

  function geometria(d) {
    const x = d.x || { min: 0, max: 2 * Math.PI }, y = d.y || { min: -1.5, max: 1.5 };
    const PY1 = PY0 + ALTO;
    const X = v => PX0 + (PX1 - PX0) * (v - x.min) / ((x.max - x.min) || 1);
    const Y = v => PY1 - (PY1 - PY0) * (v - y.min) / ((y.max - y.min) || 1);
    return { x, y, X, Y, PY1, alto: PY1 + ABAJO };
  }

  const mcd = (a, b) => (b ? mcd(b, a % b) : Math.abs(a));
  // k/cada de π como texto: 1/2 → «π/2», 3/2 → «3π/2», −1 → «−π», 2 → «2π».
  function piTexto(k, cada) {
    if (k === 0) return '0';
    const g = mcd(k, cada), nu = k / g, de = cada / g, a = Math.abs(nu);
    return `${nu < 0 ? '−' : ''}${a === 1 ? '' : a}π${de === 1 ? '' : '/' + de}`;
  }

  function plano(d, g) {
    let s = '', grid = '';
    const cada = (d.x && d.x.cada) || 2, paso = Math.PI / cada;
    const ks = [];
    for (let k = Math.ceil(g.x.min / paso - 1e-9); k * paso <= g.x.max + 1e-9; k++) ks.push(k);
    const py = (d.y && d.y.paso) || 1, ys = [];
    for (let k = Math.ceil(g.y.min / py - 1e-9); k * py <= g.y.max + 1e-9; k++) ys.push(Math.round(k * py * 1e9) / 1e9);
    for (const k of ks) grid += T.linea(g.X(k * paso), PY0, g.X(k * paso), g.PY1, { grosor: T.GROSOR.cuadricula, opacidad: 0.18 });
    for (const v of ys) grid += T.linea(PX0, g.Y(v), PX1, g.Y(v), { grosor: T.GROSOR.cuadricula, opacidad: 0.18 });
    s += `<g class="kit-cuadricula">${grid}</g>`;
    const ceroY = g.Y(Math.min(g.y.max, Math.max(g.y.min, 0)));
    const ejeX = g.x.min <= 0 && g.x.max >= 0 ? g.X(0) : PX0;
    s += `<g class="kit-eje">${T.flecha(PX0 - 4, ceroY, PX1 + 14, ceroY, { grosor: T.GROSOR.contorno })}${T.flecha(ejeX, g.PY1 + 4, ejeX, PY0 - 14, { grosor: T.GROSOR.contorno })}</g>`;
    // Rótulos de π debajo del plano (raleados si no caben) y números de y a la izquierda.
    const sep = (PX1 - PX0) * paso / ((g.x.max - g.x.min) || 1);
    const salto = sep >= 40 ? 1 : sep >= 20 ? 2 : 4;   // «3π/2» mide unos 35 px: con menos de 40 px se ralea
    for (const k of ks) if (k % salto === 0) s += T.rotulo(g.X(k * paso), g.PY1 + 22, piTexto(k, cada), { ancla: 'middle', clase: 'kit-num' });
    const dec = d.y && d.y.decimales !== undefined ? d.y.decimales : 0;
    const sepY = (g.PY1 - PY0) * py / ((g.y.max - g.y.min) || 1), saltoY = sepY >= 18 ? 1 : 2;
    ys.forEach((v, i) => { if (i % saltoY === 0 && Math.abs(v) > 1e-9) s += T.rotulo(PX0 - 8, g.Y(v) + 5, Kit.formatear(v, dec), { ancla: 'end', clase: 'kit-num', min: 0 }); });
    s += T.rotulo(PX1 + 14, ceroY - 10, 'x', { ancla: 'end', peso: 700 });
    s += T.rotulo(ejeX + 10, PY0 - 12, (d.y && d.y.nombre) || 'y', { peso: 700 });
    return s;
  }

  // Poligonal recortada a la franja de y visible: un tramo que sale por arriba o por abajo se corta en el borde.
  function camino(g, puntos) {
    const lo = g.y.min, hi = g.y.max;
    let s = '', abierto = false;
    const mover = (x, y) => { s += `${abierto ? 'L' : 'M'}${T.n(g.X(x))} ${T.n(g.Y(y))}`; abierto = true; };
    let prev = null;
    for (const p of puntos || []) {
      if (!p || !Number.isFinite(p[0]) || !Number.isFinite(p[1])) { prev = null; abierto = false; continue; }
      const dentro = p[1] >= lo && p[1] <= hi;
      if (!prev) { if (dentro) mover(p[0], p[1]); prev = p; continue; }
      const prevDentro = prev[1] >= lo && prev[1] <= hi;
      const corte = lim => prev[0] + (p[0] - prev[0]) * (lim - prev[1]) / (p[1] - prev[1]);
      if (prevDentro && dentro) mover(p[0], p[1]);
      else if (prevDentro && !dentro) { const lim = p[1] > hi ? hi : lo; mover(corte(lim), lim); abierto = false; }
      else if (!prevDentro && dentro) { const lim = prev[1] > hi ? hi : lo; abierto = false; mover(corte(lim), lim); mover(p[0], p[1]); }
      else if ((prev[1] > hi && p[1] < lo) || (prev[1] < lo && p[1] > hi)) {
        abierto = false; const a = prev[1] > hi ? hi : lo, b = a === hi ? lo : hi; mover(corte(a), a); mover(corte(b), b); abierto = false;
      }
      prev = p;
    }
    return s;
  }

  function rotuloEn(x, y, texto, col, cls, lado) {
    const L = { n: [0, -12], s: [0, 22], e: [10, 5], o: [-10, 5], ne: [8, -8], no: [-8, -8], se: [8, 20], so: [-8, 20] }[lado || 'ne'] || [8, -8];
    const ancla = L[0] > 0 ? 'start' : L[0] < 0 ? 'end' : 'middle';
    return T.rotulo(x + L[0], y + L[1], texto, { color: col, peso: 700, ancla, clase: 'kit-aparece' + cls });
  }

  function dibujar(d, estado = {}) {
    const g = geometria(d);
    const corte = Math.max(0, estado.corte || 0);
    const ve = e => (e.desde || 0) <= corte && !(e.hasta < corte);
    const nuevo = e => ((e.desde || 0) === corte && corte > 0 ? ' kit-nuevo' : '');
    let s = '';
    for (const b of d.franjas || []) if (ve(b)) {
      let x1 = PX0, x2 = PX1, y1 = PY0, y2 = g.PY1;
      if (b.eje === 'y') { y1 = g.Y(Math.min(g.y.max, Math.max(b.de, b.a))); y2 = g.Y(Math.max(g.y.min, Math.min(b.de, b.a))); }
      else { x1 = g.X(Math.max(g.x.min, Math.min(b.de, b.a))); x2 = g.X(Math.min(g.x.max, Math.max(b.de, b.a))); }
      s += `<rect class="kit-aparece${nuevo(b)}" x="${T.n(x1)}" y="${T.n(y1)}" width="${T.n(Math.max(0, x2 - x1))}" height="${T.n(Math.max(0, y2 - y1))}" fill="${T.color(b.color)}" fill-opacity="0.12"/>`;
    }
    s += plano(d, g);
    for (const a of d.asintotas || []) if (ve(a) && a.x >= g.x.min && a.x <= g.x.max) s += T.linea(g.X(a.x), PY0, g.X(a.x), g.PY1, { grosor: T.GROSOR.contorno, discontinua: true, opacidad: 0.7, clase: 'kit-aparece' + nuevo(a) });
    for (const r of d.rectas || []) if (ve(r) && r.y >= g.y.min && r.y <= g.y.max) {
      s += T.linea(PX0, g.Y(r.y), PX1, g.Y(r.y), { color: r.color, grosor: T.GROSOR.contorno, discontinua: true, clase: 'kit-aparece' + nuevo(r) });
      if (r.rotulo) s += T.rotulo(PX1, g.Y(r.y) - 8, r.rotulo, { color: r.color, peso: 700, ancla: 'end', clase: 'kit-aparece' + nuevo(r) });
    }
    for (const c of d.curvas || []) if (ve(c)) {
      const p = camino(g, c.puntos);
      if (p) s += `<path class="kit-aparece${nuevo(c)}" d="${p}" fill="none" stroke="${T.color(c.color === undefined ? 'i' : c.color)}" stroke-width="${T.GROSOR.variable}" stroke-linecap="round" stroke-linejoin="round"${c.discontinua ? ' stroke-dasharray="6 4"' : ''}/>`;
      if (c.rotulo) {
        const u = c.en || [...(c.puntos || [])].reverse().find(q => q && Number.isFinite(q[1]) && q[1] >= g.y.min && q[1] <= g.y.max);
        if (u) s += rotuloEn(g.X(u[0]), g.Y(u[1]), c.rotulo, c.color === undefined ? 'i' : c.color, nuevo(c), c.lado);
      }
    }
    for (const p of d.periodos || []) if (ve(p)) {
      s += `<g class="kit-aparece${nuevo(p)}">${T.cota(g.X(p.de), g.X(p.a), g.Y(p.y), { texto: p.rotulo, color: p.color, peso: 700 })}</g>`;
    }
    for (const p of d.puntos || []) if (ve(p) && p.y >= g.y.min && p.y <= g.y.max) {
      const col = T.color(p.color);
      s += `<circle class="kit-aparece${nuevo(p)}" cx="${T.n(g.X(p.x))}" cy="${T.n(g.Y(p.y))}" r="5" fill="${p.abierto ? 'var(--card)' : col}" stroke="${col}" stroke-width="2.5"/>`;
      if (p.rotulo) s += rotuloEn(g.X(p.x), g.Y(p.y), p.rotulo, p.color, nuevo(p), p.lado);
    }
    return T.svg(W, g.alto, s, { alt: alt(d) });
  }

  function alt(d) {
    if (d.alt) return d.alt;
    const partes = [...(d.curvas || []), ...(d.periodos || []), ...(d.puntos || [])].filter(e => e.rotulo).map(e => e.rotulo);
    return `Gráfica con el eje x en radianes${partes.length ? ': ' + partes.join('; ') : ''}`;
  }

  return { id: 'trig-onda', dibujar, alt, geometria, piTexto };
});
