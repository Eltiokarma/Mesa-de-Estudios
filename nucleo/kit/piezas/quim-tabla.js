/*
 * Pieza «quim-tabla» (sesión de teoría de Química): la tabla periódica de los grupos principales (1, 2 y 13 a 18)
 * de los periodos 1 a 4, con la columna de los metales de transición resumida («d»). Cada casilla lleva su
 * símbolo y, si se pide, el valor de una propiedad como barra (energía de ionización, electronegatividad) o como
 * círculo (radio). Sirve para periodos y grupos, bloques, ubicación, Lewis y tendencias con sus excepciones.
 *
 * Afirmación de la figura: el valor de cada casilla se compara con el de sus vecinas; la tendencia sale de los
 * datos, con sus saltos a la vista.
 *
 * Fidelidad: el alto de la barra es proporcional al valor (desde 0, sobre el máximo dado) y el radio del círculo
 * es proporcional al radio del átomo. Un elemento sin dato dice «sin dato» en el alt y no dibuja barra.
 *
 * datos = {
 *   periodos: 4,                                       // 1 a 4
 *   simbolos: { 1: 'H', 2: 'He', … },                  // Z → símbolo (los trae la unidad)
 *   propiedad: { valores: { Z: v }, max, forma: 'barra' | 'circulo', color: 'o', nombre: 'EI' } | null,
 *   marcadas: [{ Z, color, desde, rotulo }],           // casillas con contorno grueso (y rótulo opcional abajo)
 *   tenues: [Z] | 'resto',                             // casillas en segundo plano
 *   bloques: true,                                     // fondo tenue por bloque: s (o), p (i), d (d)
 *   escalera: true,                                    // línea gruesa entre metales y no metales
 *   ocultos: [Z],                                      // casillas con «?» (Mendeléiev dejó huecos)
 *   rotulo, alt
 * }
 * estado = { corte }. Alto fijo para unos datos.
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
  const W = 320, X0 = 22, CW = 33, CH = 44, Y0 = 24;
  const GRUPOS = ['1', '2', 'd', '13', '14', '15', '16', '17', '18'];

  // Columna (0..8) y periodo de un Z de grupo principal hasta 36; los de transición van a la columna «d».
  function lugar(Z) {
    if (Z <= 2) return { col: Z === 1 ? 0 : 8, per: 1 };
    const ini = { 2: 3, 3: 11, 4: 19 };
    for (const per of [2, 3, 4]) {
      const a = ini[per], fin = per === 4 ? 36 : a + 7;
      if (Z < a || Z > fin) continue;
      const k = Z - a;
      if (per < 4) return { col: k < 2 ? k : k + 1, per };
      if (k < 2) return { col: k, per };
      if (k < 12) return { col: 2, per, transicion: true };
      return { col: k - 12 + 3, per };
    }
    return null;
  }
  const bloque = Z => { const l = lugar(Z); return !l ? null : l.transicion ? 'd' : (l.col <= 1 || Z === 2) ? 's' : 'p'; };
  const xCol = c => X0 + c * CW, yPer = p => Y0 + (p - 1) * CH;
  const alto = d => Y0 + (d.periodos || 4) * CH + (d.rotulo ? 30 : 8);

  function dibujar(d, estado = {}) {
    const corte = Math.max(0, estado.corte || 0), P = d.periodos || 4, sim = d.simbolos || {};
    const ve = x => (x.desde || 0) <= corte;
    let s = '';
    GRUPOS.forEach((g, c) => { s += T.rotulo(xCol(c) + CW / 2, Y0 - 8, g, { ancla: 'middle', tam: 14, clase: 'kit-num' }); });
    for (let p = 1; p <= P; p++) s += T.rotulo(X0 - 6, yPer(p) + CH / 2 + 5, String(p), { ancla: 'end', tam: 14, clase: 'kit-num', min: 0 });
    const marc = new Map((d.marcadas || []).filter(ve).map(m => [m.Z, m]));
    const tenue = Z => d.tenues === 'resto' ? !marc.has(Z) : (d.tenues || []).includes(Z);
    const prop = d.propiedad;
    const dibujadas = new Set();
    for (let Z = 1; Z <= 36; Z++) {
      const l = lugar(Z);
      if (!l || l.per > P) continue;
      const x = xCol(l.col), y = yPer(l.per);
      if (l.transicion) {
        if (dibujadas.has(`d${l.per}`)) continue;
        dibujadas.add(`d${l.per}`);
        s += `<rect x="${x + 1}" y="${y + 1}" width="${CW - 2}" height="${CH - 2}" rx="3" fill="${d.bloques ? 'var(--c-d)' : 'none'}" fill-opacity="0.14" stroke="currentColor" stroke-width="1" stroke-opacity="0.45" stroke-dasharray="3 3"/>`;
        s += T.rotulo(x + CW / 2, y + 18, 'Sc–', { ancla: 'middle', tam: 14 }) + T.rotulo(x + CW / 2, y + 34, 'Zn', { ancla: 'middle', tam: 14 });
        continue;
      }
      const op = tenue(Z) ? ' opacity="0.4"' : '';
      const b = bloque(Z), fondo = d.bloques ? (b === 's' ? 'var(--c-o)' : 'var(--c-i)') : 'none';
      let c = `<rect x="${x + 1}" y="${y + 1}" width="${CW - 2}" height="${CH - 2}" rx="3" fill="${fondo}" fill-opacity="0.14" stroke="currentColor" stroke-width="1"/>`;
      const oculto = (d.ocultos || []).includes(Z);
      c += T.rotulo(x + CW / 2, y + 17, oculto ? '?' : (sim[Z] || ''), { ancla: 'middle', peso: 700, tam: 15 });
      if (prop && !oculto && Number.isFinite(prop.valores[Z])) {
        const v = prop.valores[Z] / (prop.max || 1);
        if (prop.forma === 'circulo') {
          c += `<circle cx="${T.n(x + CW / 2)}" cy="${y + 32}" r="${T.n(Math.max(1.5, 10 * Math.min(1, Math.max(0, v))))}" fill="${T.color(prop.color)}" fill-opacity="0.7"/>`;
        } else {
          const h = Math.max(1, 18 * Math.min(1, Math.max(0, v)));
          c += `<rect x="${T.n(x + 6)}" y="${T.n(y + CH - 4 - h)}" width="${CW - 12}" height="${T.n(h)}" fill="${T.color(prop.color)}" fill-opacity="0.8"/>`;
        }
      }
      s += `<g${op}>${c}</g>`;
    }
    for (const m of marc.values()) {
      const l = lugar(m.Z); if (!l || l.per > P) continue;
      const x = xCol(l.col), y = yPer(l.per);
      const nuevo = (m.desde || 0) === corte && corte > 0 ? ' class="kit-nuevo kit-aparece"' : '';
      s += `<g${nuevo}><rect x="${x}" y="${y}" width="${CW}" height="${CH}" rx="4" fill="none" stroke="${T.color(m.color)}" stroke-width="${T.GROSOR.variable}"/></g>`;
    }
    if (d.escalera) {
      // Entre metales y no metales: a la derecha de la línea, B, Si, Ge (semimetales) y los no metales.
      const pts = [[xCol(3), yPer(2)], [xCol(3), yPer(3)], [xCol(4), yPer(3)], [xCol(4), yPer(P) + CH]];
      s += `<path d="M${pts.map(p => `${T.n(p[0])} ${T.n(p[1])}`).join('L')}" fill="none" stroke="currentColor" stroke-width="${T.GROSOR.variable}" stroke-linejoin="round"/>`;
    }
    if (d.rotulo) s += T.rotulo(X0, alto(d) - 10, d.rotulo, { peso: 700, color: prop && prop.color });
    return T.svg(W, alto(d), s, { alt: alt(d) });
  }

  function alt(d) {
    if (d.alt) return d.alt;
    const p = d.propiedad;
    const marc = (d.marcadas || []).map(m => (d.simbolos || {})[m.Z]).filter(Boolean);
    let txt = `Tabla periódica de los grupos principales, periodos 1 a ${d.periodos || 4}`;
    if (p) {
      const vals = Object.entries(p.valores).filter(([Z]) => lugar(+Z) && !lugar(+Z).transicion && lugar(+Z).per <= (d.periodos || 4))
        .map(([Z, v]) => `${(d.simbolos || {})[Z] || Z} ${Number.isFinite(v) ? Kit.formatear(v, 2) : 'sin dato'}`);
      txt += `, con ${p.nombre || 'una propiedad'} en cada casilla: ${vals.join(', ')}`;
    }
    if (marc.length) txt += `. Marcados: ${marc.join(', ')}`;
    return txt + '.';
  }

  return { id: 'quim-tabla', dibujar, alt, lugar, bloque };
});
