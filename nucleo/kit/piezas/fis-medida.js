/*
 * Pieza «fis-medida» (16 nov 2026, pedido de Gerson: «pon un poste de luz, y diferentes reglas de diferentes escalas,
 * en SVG»; docs/plan-calidad.md, contrato puntos 1 y 4). Un objeto real medido a la vez con varias reglas, una por
 * unidad. Se ve que el objeto es uno solo y que cada regla le pone su número.
 *
 * Afirmación de la figura: cambiar de unidad no cambia lo medido; cambia el número, y la regla más fina da el más grande.
 *
 * datos = {
 *   objeto: 'poste',                  // dibujo de prueba (Gerson puede reemplazarlo); por ahora solo el poste de luz
 *   alto: 6.5,                         // en metros: lo que mide el objeto
 *   max: 10,                           // en metros: hasta dónde llegan las reglas
 *   color: 'o',                        // color de la variable medida (regla 4)
 *   variable: 'L',                     // su letra, en la cota junto al objeto
 *   persona: true,                     // una persona de 1,6 m al lado, para tener idea del tamaño
 *   reglas: [                          // de izquierda a derecha
 *     { unidad: 'm', k: 1, menor: 0.5, mayor: 1, numero: 2, decimales: 2 },
 *     { unidad: 'dm', k: 10, menor: 1, mayor: 5, numero: 20, decimales: 1 },
 *     { unidad: 'cm', k: 100, menor: 10, mayor: 50, numero: 200, decimales: 0 },
 *   ]                                  // k: cuántas de esa unidad hay en un metro; menor, mayor y numero, en esa unidad
 * }
 * estado = {} (sin pasos: la figura entera responde al valor).
 * Función pura de (datos, estado): sin ids, sin azar, sin reloj. Todo número que se ve sale de datos.
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
  const W = 320, H = 334, SUELO = 290, TOPE = 36, RX0 = 120, RW = 46, RSEP = 64;
  const REGLAS = [
    { unidad: 'm', k: 1, menor: 0.5, mayor: 1, numero: 2, decimales: 2 },
    { unidad: 'dm', k: 10, menor: 1, mayor: 5, numero: 20, decimales: 1 },
    { unidad: 'cm', k: 100, menor: 10, mayor: 50, numero: 200, decimales: 0 },
  ];
  const BASE = { objeto: 'poste', alto: 6.5, max: 10, color: 'o', variable: 'L', persona: true, reglas: REGLAS };
  const conBase = d => Object.assign({}, BASE, d || {});
  const n = T.n;

  // Geometría: metros a la altura en el lienzo (0 m en el suelo).
  function geometria(d) {
    const s = (SUELO - TOPE) / d.max;
    return { s, y: m => SUELO - m * s, xRegla: i => RX0 + i * RSEP };
  }
  const lectura = (d, r) => `${Kit.formatear(d.alto * r.k, r.decimales)} ${r.unidad}`;

  // El poste de luz (dibujo de prueba): concreto que se afina, brazo y lámpara con su luz.
  function poste(x, y0, y1) {
    const ab = 7, ar = 4;
    let s = `<path d="M${n(x - ab)} ${n(y0)}L${n(x - ar)} ${n(y1)}L${n(x + ar)} ${n(y1)}L${n(x + ab)} ${n(y0)}Z" fill="currentColor" fill-opacity="0.12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`;
    s += `<rect x="${n(x - ab - 4)}" y="${n(y0 - 6)}" width="${n(2 * ab + 8)}" height="6" rx="2" fill="currentColor" fill-opacity="0.25"/>`;
    // brazo curvo hacia la derecha y lámpara
    const bx = x + 26, by = y1 + 2;
    s += `<path d="M${n(x)} ${n(y1 + 10)}Q${n(x + 4)} ${n(y1 - 2)} ${n(bx)} ${n(by)}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>`;
    s += `<rect x="${n(bx - 9)}" y="${n(by - 1)}" width="18" height="6" rx="3" fill="currentColor"/>`;
    s += `<path d="M${n(bx - 7)} ${n(by + 5)}L${n(bx - 16)} ${n(by + 30)}L${n(bx + 16)} ${n(by + 30)}L${n(bx + 7)} ${n(by + 5)}Z" fill="currentColor" fill-opacity="0.07"/>`;
    return `<g class="kit-objeto" data-objeto="poste" data-prueba="si">${s}</g>`;
  }
  // Una persona de pie (dibujo de prueba), para tener idea del tamaño.
  function persona(x, y0, alto) {
    const cab = alto * 0.13, cy = y0 - alto + cab;
    let s = `<circle cx="${n(x)}" cy="${n(cy)}" r="${n(cab)}" fill="none" stroke="currentColor" stroke-width="2"/>`;
    s += `<path d="M${n(x)} ${n(cy + cab)}L${n(x)} ${n(y0 - alto * 0.45)}M${n(x)} ${n(y0 - alto * 0.45)}L${n(x - alto * 0.12)} ${n(y0)}M${n(x)} ${n(y0 - alto * 0.45)}L${n(x + alto * 0.12)} ${n(y0)}M${n(x - alto * 0.16)} ${n(cy + cab + alto * 0.12)}L${n(x + alto * 0.16)} ${n(cy + cab + alto * 0.12)}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    return `<g class="kit-objeto" data-objeto="persona" data-prueba="si" opacity="0.7">${s}</g>`;
  }

  // Una regla vertical: rayitas en el borde izquierdo (menor y mayor) y números sobre las rayitas mayores.
  function regla(d, g, r, i, yMarca = null) {
    const x = g.xRegla(i), yTop = g.y(d.max);
    let s = `<rect x="${n(x)}" y="${n(yTop - 20)}" width="${RW}" height="${n(SUELO - yTop + 20)}" rx="4" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`;
    const tope = d.max * r.k, paso = r.menor;
    const veces = Math.round(tope / paso);
    for (let j = 0; j <= veces; j++) {
      const v = j * paso, y = g.y(v / r.k);
      const esNum = Math.abs(v / r.numero - Math.round(v / r.numero)) < 1e-9;
      const esMayor = esNum || Math.abs(v / r.mayor - Math.round(v / r.mayor)) < 1e-9;
      const largo = esNum ? RW - 4 : esMayor ? 10 : 5;
      s += `<line x1="${n(x)}" y1="${n(y)}" x2="${n(x + largo)}" y2="${n(y)}" stroke="currentColor" stroke-width="${esNum ? 1.6 : 1}"${esNum ? ' stroke-opacity="0.8"' : ''}/>`;
      // El número va encima de su rayita (sin separador de miles: así se lee en una regla).
      // Un número que caería bajo la etiqueta de la lectura no se escribe (el lector en frío lo vio tapado).
      if (esNum && v > 0 && !(yMarca !== null && y > yMarca - 30 && y < yMarca + 22)) s += T.rotulo(x + RW - 3, y - 3, String(Math.round(v)), { ancla: 'end', tam: 14, min: x + 6, max: x + RW - 2 });
    }
    s += T.rotulo(x + RW / 2, SUELO + 26, r.unidad, { ancla: 'middle', peso: 700, tam: 16 });
    return `<g class="kit-regla" data-unidad="${T.esc(r.unidad)}">${s}</g>`;
  }

  function dibujar(datos, estado = {}) {
    const d = conBase(datos), g = geometria(d);
    const alto = Math.max(0, Math.min(d.max, Number.isFinite(d.alto) ? d.alto : 0));
    const yTop = g.y(alto), c = T.color(d.color), xp = 62;
    let s = `<line x1="8" y1="${SUELO}" x2="${W - 8}" y2="${SUELO}" stroke="currentColor" stroke-width="2"/>`;
    d.reglas.forEach((r, i) => { s += regla(d, g, r, i, yTop); });
    if (d.persona) s += persona(100, SUELO, 1.6 * g.s);
    s += poste(xp, SUELO, yTop);
    // La cota del objeto: del suelo a la punta, con su letra, en el color de la variable.
    const xc = 22;
    s += `<g class="kit-cota-v"><line x1="${xc}" y1="${n(SUELO - 2)}" x2="${xc}" y2="${n(yTop + 2)}" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`
      + `<line x1="${xc - 7}" y1="${n(yTop)}" x2="${xc + 7}" y2="${n(yTop)}" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`
      + `<line x1="${xc - 7}" y1="${SUELO}" x2="${xc + 7}" y2="${SUELO}" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`
      + T.rotulo(xc + 8, (SUELO + yTop) / 2 + 6, d.variable, { color: d.color, peso: 700, tam: 18 }) + '</g>';
    // La altura del poste llevada a todas las reglas: una línea discontinua y, en cada regla, su número.
    const xFin = g.xRegla(d.reglas.length - 1) + RW + 4;
    s += `<line x1="${xp + 4}" y1="${n(yTop)}" x2="${n(xFin)}" y2="${n(yTop)}" stroke="${c}" stroke-width="2" stroke-dasharray="5 4"/>`;
    d.reglas.forEach((r, i) => {
      const cx = g.xRegla(i) + RW / 2, txt = lectura(d, r), w = Math.max(52, T.ancho(txt, 14, 700) + 10);
      const yb = Math.max(4, yTop - 26);
      s += `<g class="kit-lectura-regla"><rect x="${n(cx - w / 2)}" y="${n(yb)}" width="${n(w)}" height="22" rx="11" fill="var(--card)" stroke="${c}" stroke-width="2"/>`
        + T.rotulo(cx, yb + 16, txt, { ancla: 'middle', peso: 700, tam: 14, color: d.color }) + '</g>';
    });
    return T.svg(W, H, s, { alt: alt(d) });
  }

  function alt(datos) {
    const d = conBase(datos);
    return `Un poste de luz de ${lectura(d, d.reglas[0])} medido a la vez con ${d.reglas.length} reglas: ${d.reglas.map(r => lectura(d, r)).join(', ')}.`;
  }

  return { id: 'fis-medida', dibujar, alt, geometria: d => geometria(conBase(d)), constantes: { W, H, SUELO, TOPE, RX0, RW, RSEP }, REGLAS };
});
