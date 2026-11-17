/*
 * Pieza «fis-area» (16 nov 2026, idea «Áreas y volúmenes» de Magnitudes y unidades; contrato «se entiende sin
 * profesor», docs/plan-calidad.md). Cuadrados lado a lado, cada uno con su cuadrícula: se cuentan los cuadraditos que
 * caben. Y un cubo con cuadrícula en sus caras para el volumen.
 *
 * Afirmación de la figura: al cambiar de unidad, un área se multiplica por el factor al cuadrado (10 × 10 = 100) y un
 * volumen, por el factor al cubo (10 × 10 × 10 = 1000).
 *
 * datos = {
 *   cuadros: [                         // 1 o 2 paneles, de izquierda a derecha
 *     { lado: 2,                       // en la unidad del panel (lo que mide el lado del cuadrado)
 *       max: 3,                        // el lado más grande que puede tener (fija la escala; si falta, el cuadrado llena el panel)
 *       celdas: 1,                     // cuántas unidades de la cuadrícula por unidad del lado (1: cuadros de 1; 10: de 1/10)
 *       arriba: '2 m',                 // rótulo del lado
 *       abajo: '4 m²',                 // lo que mide el área (en el color de la variable)
 *       nombre: 'cuadros de 1 m',      // qué es cada cuadradito
 *       fila: false },                 // resalta la primera fila (para contar «10 en una fila»)
 *   ],
 *   cubo: null | { n: 10, arriba: '1 dm', abajo: '1000 cm³ = 1 L', nombre: 'cubitos de 1 cm' },   // en lugar de los cuadros
 *   color: 'o',
 *   vistas: [datos, datos…]            // opcional: varias figuras; estado.vista elige cuál (para «Mira»)
 * }
 * estado = { vista } (opcional). Función pura de (datos, estado): sin ids, sin azar, sin reloj.
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
  const W = 320, H = 250, ARRIBA = 30, LADO = 150;
  const n = T.n;

  function cuadro(q, x0, ancho, color) {
    const c = T.color(color), maxL = q.max || q.lado || 1, s = Math.min(LADO, ancho - 20) * (q.lado || 0) / maxL;
    const x = x0 + (ancho - s) / 2, y = ARRIBA + (LADO - s) / 2 + 8;
    const cuantas = (q.lado || 0) * (q.celdas || 1), paso = cuantas ? s / cuantas : 0, total = Math.ceil(cuantas - 1e-9);
    let g = `<rect x="${n(x)}" y="${n(y)}" width="${n(s)}" height="${n(s)}" fill="${c}" fill-opacity="0.08"/>`;
    if (q.fila && paso) g += `<rect x="${n(x)}" y="${n(y)}" width="${n(s)}" height="${n(paso)}" fill="${c}" fill-opacity="0.3"/>`;
    // Cuadrícula: solo si cada cuadradito se alcanza a ver (3 o más unidades del lienzo).
    if (paso >= 3) for (let k = 1; k < total; k++) {
      g += `<line x1="${n(x + k * paso)}" y1="${n(y)}" x2="${n(x + k * paso)}" y2="${n(y + s)}" stroke="currentColor" stroke-width="0.8" stroke-opacity="0.55"/>`
        + `<line x1="${n(x)}" y1="${n(y + k * paso)}" x2="${n(x + s)}" y2="${n(y + k * paso)}" stroke="currentColor" stroke-width="0.8" stroke-opacity="0.55"/>`;
    }
    g += `<rect x="${n(x)}" y="${n(y)}" width="${n(s)}" height="${n(s)}" fill="none" stroke="${c}" stroke-width="2.5"/>`;
    const cx = x0 + ancho / 2;
    if (q.arriba) g += T.rotulo(cx, y - 8, q.arriba, { ancla: 'middle', tam: 14, min: x0, max: x0 + ancho });
    if (q.abajo) g += T.rotulo(cx, ARRIBA + LADO + 34, q.abajo, { ancla: 'middle', tam: 16, peso: 700, color, min: x0, max: x0 + ancho });
    if (q.nombre) g += T.rotulo(cx, ARRIBA + LADO + 54, q.nombre, { ancla: 'middle', tam: 14, min: x0, max: x0 + ancho });
    return `<g class="kit-cuadro">${g}</g>`;
  }

  // Cubo en perspectiva caballera con su cuadrícula en las tres caras visibles.
  function cubo(q, color) {
    const c = T.color(color), N = q.n || 10, a = 104, d = 42, x = (W - a - d) / 2, y = ARRIBA + d;
    const P = (u, v, w) => [x + u * a + w * d, y + a - v * a - w * d];   // u: ancho, v: alto, w: fondo (0..1)
    const pt = p => `${n(p[0])} ${n(p[1])}`;
    const cara = pts => `<path d="M${pts.map(pt).join('L')}Z" fill="${c}" fill-opacity="0.1" stroke="${c}" stroke-width="2.5" stroke-linejoin="round"/>`;
    let g = cara([P(0, 0, 0), P(1, 0, 0), P(1, 1, 0), P(0, 1, 0)]) + cara([P(0, 1, 0), P(1, 1, 0), P(1, 1, 1), P(0, 1, 1)]) + cara([P(1, 0, 0), P(1, 0, 1), P(1, 1, 1), P(1, 1, 0)]);
    const linea = (p, q2) => `<line x1="${n(p[0])}" y1="${n(p[1])}" x2="${n(q2[0])}" y2="${n(q2[1])}" stroke="currentColor" stroke-width="0.7" stroke-opacity="0.5"/>`;
    for (let k = 1; k < N; k++) {
      const t = k / N;
      g += linea(P(t, 0, 0), P(t, 1, 0)) + linea(P(0, t, 0), P(1, t, 0));        // frente
      g += linea(P(t, 1, 0), P(t, 1, 1)) + linea(P(0, 1, t), P(1, 1, t));        // arriba
      g += linea(P(1, 0, t), P(1, 1, t)) + linea(P(1, t, 0), P(1, t, 1));        // costado
    }
    if (q.arriba) g += T.rotulo((P(0, 0, 0)[0] + P(1, 0, 0)[0]) / 2, P(0, 0, 0)[1] + 18, q.arriba, { ancla: 'middle', tam: 14 });
    if (q.abajo) g += T.rotulo(W / 2, ARRIBA + LADO + 42, q.abajo, { ancla: 'middle', tam: 16, peso: 700, color });
    if (q.nombre) g += T.rotulo(W / 2, ARRIBA + LADO + 62, q.nombre, { ancla: 'middle', tam: 14 });
    return `<g class="kit-cubo">${g}</g>`;
  }

  function dibujar(datos0 = {}, estado = {}) {
    // Varias vistas en una sola figura (la línea de tiempo de «Mira»): estado.vista dice cuál se ve.
    const datos = Array.isArray(datos0.vistas) ? Object.assign({ color: datos0.color }, datos0.vistas[Math.max(0, Math.min(datos0.vistas.length - 1, estado.vista || 0))]) : datos0;
    const color = datos.color || 'o';
    let s;
    if (datos.cubo) s = cubo(datos.cubo, color);
    else {
      const qs = (datos.cuadros || []).slice(0, 2), ancho = (W - 8) / Math.max(1, qs.length);
      s = qs.map((q, i) => cuadro(q, 4 + i * ancho, ancho, color)).join('');
      if (qs.length === 2) s += `<line x1="${W / 2}" y1="${ARRIBA}" x2="${W / 2}" y2="${ARRIBA + LADO + 20}" stroke="currentColor" stroke-width="1" stroke-dasharray="3 5" stroke-opacity="0.4"/>`;
    }
    return T.svg(W, H, s, { alt: alt(datos) });
  }

  function alt(datos0 = {}) {
    const datos = Array.isArray(datos0.vistas) ? (datos0.vistas[0] || {}) : datos0;
    // Sin `abajo` (la figura de un ejemplo no dice el volumen pedido, 17 nov), el texto alternativo tampoco lo dice.
    if (datos.cubo) return `Un cubo de ${datos.cubo.arriba || ''} de lado con una cuadrícula en sus caras${datos.cubo.abajo ? `: ${datos.cubo.abajo}` : ''}${datos.cubo.nombre ? ` (${datos.cubo.nombre})` : ''}.`;
    const qs = datos.cuadros || [];
    if (!qs.length) return 'Un panel vacío.';
    return `${qs.length > 1 ? 'Dos cuadrados iguales' : 'Un cuadrado'} con cuadrícula: ${qs.map(q => `${q.abajo || ''} (${q.nombre || ''})`).join(' y ')}.`;
  }

  return { id: 'fis-area', dibujar, alt, constantes: { W, H, LADO } };
});
