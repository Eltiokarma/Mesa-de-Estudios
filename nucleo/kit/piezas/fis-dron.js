/*
 * Pieza «fis-dron» (16 nov 2026, idea «¿Basta un número? Escalar o vector» de Vectores; contrato «se entiende sin
 * profesor», docs/plan-calidad.md). Una plaza vista desde arriba, con sus calles cada 100 m, y un dron que sale de la
 * plaza y vuela en línea recta. La flecha va de la plaza a donde aterriza. El círculo punteado marca todos los puntos
 * que quedan a la misma distancia: con solo el número, el dron podría estar en cualquiera de ellos.
 *
 * Afirmación de la figura: «voló 300 m» deja todo un círculo de lugares posibles; con el rumbo queda uno solo, y eso
 * es un vector: una flecha con largo (módulo) y hacia dónde.
 *
 * datos = {
 *   max: 400, paso: 100,                         // m: radio que entra en el mapa y separación de las calles
 *   lugares: [{ nombre: 'Mercado', largo: 300, rumbo: 'NO' }],   // dónde quedan, vistos desde la plaza
 *   drones: [{ largo: 300, rumbo: 'NE',          // rumbo: 'E', 'NE', 'N', 'NO', 'O', 'SO', 'S', 'SE' o grados (antihorario desde el este)
 *              color: 'o', valor: '300 m',        // rótulo sobre la flecha (el módulo)
 *              flecha: true, fantasma: false }],
 *   circulo: null | 300,                         // m: dibuja el círculo punteado de los puntos a esa distancia
 *   textoCirculo: 'Todos a 300 m de la plaza',   // rótulo del círculo (abajo)
 *   color: 'o',
 *   vistas: [datos, …]                           // opcional: varias figuras; estado.vista elige (para «Mira»)
 * }
 * estado = { vista } (opcional). Función pura de (datos, estado): sin ids, sin azar, sin reloj. El dron es un dibujo
 * de prueba (data-prueba).
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
  const W = 320, H = 330, CX = 160, CY = 164, RPX = 118, MAPA = 128;
  const RUMBOS = { E: 0, NE: 45, N: 90, NO: 135, O: 180, SO: 225, S: 270, SE: 315 };
  const NOMBRES = { E: 'el este', NE: 'el noreste', N: 'el norte', NO: 'el noroeste', O: 'el oeste', SO: 'el suroeste', S: 'el sur', SE: 'el sureste' };
  const BASE = { max: 400, paso: 100, lugares: [], drones: [], circulo: null, color: 'o' };
  const n = T.n;
  const grados = r => (typeof r === 'number' ? r : RUMBOS[r] || 0);
  // Metros y rumbo a coordenadas del lienzo (y hacia abajo en el lienzo, hacia el norte en el mapa).
  const punto = (d, largo, rumbo) => {
    const s = RPX / d.max, a = grados(rumbo) * Math.PI / 180;
    return [CX + largo * s * Math.cos(a), CY - largo * s * Math.sin(a)];
  };

  // El dron (dibujo de prueba): cuerpo, cuatro brazos y cuatro hélices.
  function dron(x, y, fantasma) {
    let s = '';
    for (const [dx, dy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      s += `<line x1="${n(x)}" y1="${n(y)}" x2="${n(x + dx * 9)}" y2="${n(y + dy * 9)}" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>`
        + `<circle cx="${n(x + dx * 9)}" cy="${n(y + dy * 9)}" r="5" fill="var(--card)" stroke="currentColor" stroke-width="1.5"/>`;
    }
    s += `<rect x="${n(x - 5)}" y="${n(y - 5)}" width="10" height="10" rx="3" fill="currentColor"/>`;
    return `<g class="kit-objeto${fantasma ? ' kit-fantasma' : ''}" data-objeto="dron" data-prueba="si"${fantasma ? ' opacity="0.4"' : ''}>${s}</g>`;
  }

  // Un lugar del mapa: un alfiler con su nombre afuera, del lado contrario a la plaza.
  function lugar(d, l) {
    const [x, y] = punto(d, l.largo, l.rumbo), a = grados(l.rumbo) * Math.PI / 180;
    const ox = Math.cos(a), oy = -Math.sin(a);
    const ancla = ox > 0.3 ? 'start' : ox < -0.3 ? 'end' : 'middle';
    const tx = x + ox * 14, ty = y + oy * 16 + (oy > 0.3 ? 10 : oy < -0.3 ? 0 : 5);
    return `<g class="kit-lugar"><path d="M${n(x)} ${n(y)}l-6 -11a7 7 0 1 1 12 0z" fill="var(--card)" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`
      + `<circle cx="${n(x)}" cy="${n(y - 14)}" r="2.5" fill="currentColor"/>`
      + T.rotulo(tx, ty, l.nombre || '', { ancla, tam: 14, peso: 600, min: 4, max: W - 4 }) + '</g>';
  }

  function dibujar(datos0 = {}, estado = {}) {
    const d0 = Array.isArray(datos0.vistas) ? Object.assign({ color: datos0.color }, datos0.vistas[Math.max(0, Math.min(datos0.vistas.length - 1, estado.vista || 0))]) : datos0;
    const d = Object.assign({}, BASE, d0);
    const s0 = RPX / d.max;
    // El mapa: un recuadro con las calles cada `paso` m, centradas en la plaza.
    let s = `<rect x="${CX - MAPA}" y="${CY - MAPA}" width="${2 * MAPA}" height="${2 * MAPA}" rx="12" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-opacity="0.25"/>`;
    const k = Math.floor(MAPA / (d.paso * s0));
    for (let i = -k; i <= k; i++) {
      const v = i * d.paso * s0;
      s += `<line x1="${n(CX + v)}" y1="${CY - MAPA}" x2="${n(CX + v)}" y2="${CY + MAPA}" stroke="currentColor" stroke-width="0.8" stroke-opacity="0.18"/>`
        + `<line x1="${CX - MAPA}" y1="${n(CY + v)}" x2="${CX + MAPA}" y2="${n(CY + v)}" stroke="currentColor" stroke-width="0.8" stroke-opacity="0.18"/>`;
    }
    // El norte, abajo a la derecha (arriba quedan los lugares a 300 m): una flecha que apunta hacia arriba.
    s += `<g class="kit-norte">${T.rotulo(CX + MAPA - 18, CY + MAPA - 44, 'N', { ancla: 'middle', tam: 14, peso: 800 })}`
      + T.flecha(CX + MAPA - 18, CY + MAPA - 10, CX + MAPA - 18, CY + MAPA - 38, { grosor: 2 }) + '</g>';
    // La escala: una cuadra, abajo a la izquierda (lector en frío, 16 nov: sin ella, la distancia se adivinaba).
    const e = d.paso * s0, ex = CX - MAPA + 12, ey = CY + MAPA - 12;
    s += `<g class="kit-escala"><line x1="${n(ex)}" y1="${n(ey)}" x2="${n(ex + e)}" y2="${n(ey)}" stroke="currentColor" stroke-width="3"/>`
      + `<line x1="${n(ex)}" y1="${n(ey - 5)}" x2="${n(ex)}" y2="${n(ey + 5)}" stroke="currentColor" stroke-width="2"/><line x1="${n(ex + e)}" y1="${n(ey - 5)}" x2="${n(ex + e)}" y2="${n(ey + 5)}" stroke="currentColor" stroke-width="2"/>`
      + T.rotulo(ex, ey - 9, `${Kit.formatear(d.paso, 0)} m`, { tam: 14, peso: 700 }) + '</g>';
    // La plaza.
    s += `<rect x="${CX - 9}" y="${CY - 9}" width="18" height="18" rx="3" fill="${T.color('d')}" fill-opacity="0.35" stroke="${T.color('d')}" stroke-width="2"/>`;
    // El círculo de los puntos a la misma distancia.
    if (Number.isFinite(d.circulo) && d.circulo > 0) {
      s += `<circle class="kit-circulo" cx="${CX}" cy="${CY}" r="${n(d.circulo * s0)}" fill="none" stroke="${T.color('h')}" stroke-width="2" stroke-dasharray="5 6"/>`;
      if (d.textoCirculo) s += T.rotulo(CX, H - 10, d.textoCirculo, { ancla: 'middle', tam: 14, peso: 700, color: 'h' });
    }
    for (const l of d.lugares || []) s += lugar(d, l);
    // «Plaza» a la izquierda del cuadrado, a su altura: debajo quedaba encima del paradero (lector en frío, 16 nov).
    s += T.rotulo(CX - 14, CY + 5, 'Plaza', { ancla: 'end', tam: 14, peso: 700, color: 'd' });
    // Los drones con su flecha: de la plaza al dron, y el módulo escrito al costado.
    for (const v of d.drones || []) {
      const [x, y] = punto(d, v.largo, v.rumbo), a = grados(v.rumbo) * Math.PI / 180, c = v.color || d.color;
      const lpx = v.largo * s0;
      if (v.flecha !== false && lpx > 20) {
        const fx = x - Math.cos(a) * 15, fy = y + Math.sin(a) * 15;
        s += `<g class="kit-vector"${v.fantasma ? ' opacity="0.4"' : ''}>${T.flecha(CX + Math.cos(a) * 10, CY - Math.sin(a) * 10, fx, fy, { color: c, grosor: 3.5 })}</g>`;
        if (v.valor) {
          // A un 30 % del vuelo y al costado izquierdo de la flecha, lejos del dron.
          const mx = CX + (x - CX) * 0.3 - Math.sin(a) * 22, my = CY + (y - CY) * 0.3 - Math.cos(a) * 22 + 5;
          s += T.rotulo(mx, my, v.valor, { ancla: 'middle', tam: 15, peso: 800, color: c });
        }
      }
      s += dron(x, y, v.fantasma);
    }
    return T.svg(W, H, s, { alt: alt(d) });
  }

  function alt(d0 = {}) {
    const d = Array.isArray(d0.vistas) ? Object.assign({}, BASE, d0.vistas[0] || {}) : Object.assign({}, BASE, d0);
    const vs = (d.drones || []).map(v => `un dron a ${Kit.formatear(v.largo, 0)} m hacia ${typeof v.rumbo === 'string' ? NOMBRES[v.rumbo] || v.rumbo : `${v.rumbo}°`}`);
    const ls = (d.lugares || []).map(l => `${l.nombre} a ${Kit.formatear(l.largo, 0)} m`);
    return `Mapa de una plaza con calles cada ${Kit.formatear(d.paso, 0)} m${vs.length ? `; ${vs.join(' y ')}` : ''}${ls.length ? `. Lugares: ${ls.join(', ')}` : ''}${d.circulo ? `. Un círculo punteado marca todos los puntos a ${Kit.formatear(d.circulo, 0)} m de la plaza` : ''}.`;
  }

  return { id: 'fis-dron', dibujar, alt, punto: (d, l, r) => punto(Object.assign({}, BASE, d), l, r), RUMBOS, NOMBRES, constantes: { W, H, CX, CY, RPX } };
});
