/*
 * Pieza «fis-resorte» (física, docs/teoria.md): un bloque sobre una mesa sin roce, unido a la pared por un resorte.
 * Regla con el equilibrio en x = 0 y los extremos ±A; la flecha de la velocidad sobre el bloque y la de la
 * aceleración (o la fuerza del resorte) debajo; marcas tenues de posiciones anteriores. Sirve para el MAS.
 *
 * Afirmación de la figura: la flecha de la aceleración siempre apunta al equilibrio y crece con la distancia;
 * en los extremos la velocidad es cero y la aceleración, máxima.
 *
 * Fidelidad: una sola escala de posición (px por unidad de `A`); la flecha de v mide |v|·escalaV y la de a,
 * |a|·escalaA. El resorte se estira o se encoge con el bloque (sus vueltas se reparten en el largo que tiene).
 *
 * datos = {
 *   A: 0.2, unidad: 'm',                     // amplitud: la regla va de −A a +A (con un margen)
 *   x: 0.1, v: −0.5, a: −2,                  // estado del bloque (v y a con signo; null: sin flecha)
 *   escalaV: 60, escalaA: 12,                // px por unidad de v y de a
 *   colores: { x: 'i', v: 'o', a: 'd' },     // regla 4
 *   textoV, textoA,                          // rótulos de las flechas (si no, «v» y «a»)
 *   marcas: [x, …],                          // posiciones anteriores (bloques tenues)
 *   extremos: true                           // marca −A y +A en la regla
 * }
 * estado = {} (la pieza no tiene pasos: cada paso de «Mira» trae su propio x, v y a en datos distintos o usa `base`).
 * El dibujo es una función pura de (datos, estado): sin ids, sin azar, sin reloj. Alto fijo.
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
  const W = 320, ALTO = 200, PARED = 22, X0 = 190, MEDIO = 100, MESA = 120, BW = 44, BH = 40, REGLA = 156;

  const A = d => (d.A > 0 ? d.A : 1);
  const X = (d, x) => X0 + MEDIO * x / A(d);          // centro del bloque para la posición x
  const col = (d, q) => (d.colores && d.colores[q]) || { x: 'i', v: 'o', a: 'd' }[q];

  // El resorte: un zigzag de 10 vueltas entre la pared y la cara izquierda del bloque.
  function resorte(x1, x2, y) {
    const n = 10, paso = (x2 - x1 - 16) / n, h = 9;
    let d = `M${T.n(x1)} ${T.n(y)}L${T.n(x1 + 8)} ${T.n(y)}`;
    for (let i = 0; i < n; i++) d += `L${T.n(x1 + 8 + paso * (i + 0.5))} ${T.n(y + (i % 2 ? h : -h))}`;
    d += `L${T.n(x2 - 8)} ${T.n(y)}L${T.n(x2)} ${T.n(y)}`;
    return `<path d="${d}" fill="none" stroke="currentColor" stroke-width="${T.GROSOR.contorno}" stroke-linejoin="round" stroke-linecap="round"/>`;
  }

  function dibujar(d) {
    let s = '';
    const xb = X(d, Number.isFinite(d.x) ? d.x : 0), yb = MESA - BH, ym = MESA - BH / 2;
    // Pared y mesa.
    s += T.linea(PARED, MESA - 64, PARED, MESA, { grosor: T.GROSOR.contorno });
    for (let k = 0; k < 6; k++) s += T.linea(PARED, MESA - 60 + k * 11, PARED - 8, MESA - 52 + k * 11, { grosor: T.GROSOR.cuadricula });
    s += T.linea(PARED, MESA, W - 8, MESA, { grosor: T.GROSOR.contorno, opacidad: 0.6 });
    // Marcas de posiciones anteriores, tenues.
    for (const m of d.marcas || []) s += `<rect x="${T.n(X(d, m) - BW / 2)}" y="${yb}" width="${BW}" height="${BH}" rx="4" fill="none" stroke="currentColor" stroke-width="${T.GROSOR.cuadricula}" stroke-dasharray="4 3" opacity="0.6"/>`;
    s += resorte(PARED, xb - BW / 2, ym);
    s += `<rect class="kit-bloque" x="${T.n(xb - BW / 2)}" y="${yb}" width="${BW}" height="${BH}" rx="4" fill="var(--card)" stroke="currentColor" stroke-width="${T.GROSOR.contorno}"/>`;
    s += T.rotulo(xb, ym + 6, 'm', { ancla: 'middle', peso: 700 });
    // Velocidad, encima del bloque.
    if (Number.isFinite(d.v) && Math.abs(d.v) > 1e-9) {
      const L = Math.abs(d.v) * (d.escalaV || 60), sg = Math.sign(d.v), y = yb - 14;
      s += T.flecha(xb - sg * Math.min(L, 12) / 2, y, xb - sg * Math.min(L, 12) / 2 + sg * L, y, { grosor: T.GROSOR.variable, color: col(d, 'v') });
      s += T.rotulo(xb, y - 10, d.textoV || 'v', { ancla: 'middle', color: col(d, 'v'), peso: 700, clase: 'kit-txt' });
    } else if (Number.isFinite(d.v)) {
      s += T.rotulo(xb, yb - 12, d.textoV || 'v = 0', { ancla: 'middle', color: col(d, 'v'), peso: 700, clase: 'kit-txt' });
    }
    // Aceleración, entre la mesa y la regla.
    if (Number.isFinite(d.a) && Math.abs(d.a) > 1e-9) {
      const L = Math.abs(d.a) * (d.escalaA || 12), sg = Math.sign(d.a), y = MESA + 14;
      s += T.flecha(xb, y, xb + sg * L, y, { grosor: T.GROSOR.variable, color: col(d, 'a') });
      s += T.rotulo(xb + sg * (L + 6), y + 5, d.textoA || 'a', { ancla: sg > 0 ? 'start' : 'end', color: col(d, 'a'), peso: 700, clase: 'kit-txt' });
    } else if (Number.isFinite(d.a)) {
      s += T.rotulo(xb, MESA + 19, d.textoA || 'a = 0', { ancla: 'middle', color: col(d, 'a'), peso: 700, clase: 'kit-txt' });
    }
    // Regla: equilibrio en 0 y extremos ±A.
    const u = d.unidad || 'm';
    s += T.linea(X0 - MEDIO - 14, REGLA, X0 + MEDIO + 14, REGLA, { grosor: T.GROSOR.contorno });
    for (const [v, txt] of [[-A(d), '−A'], [0, '0'], [A(d), '+A']]) {
      if (v !== 0 && d.extremos === false) continue;
      s += T.linea(X(d, v), REGLA - 6, X(d, v), REGLA + 6, { grosor: T.GROSOR.contorno });
      s += T.rotulo(X(d, v), REGLA + 24, txt, { ancla: 'middle', clase: 'kit-num' });
    }
    s += T.linea(X0, yb - 4, X0, MESA, { grosor: T.GROSOR.cuadricula, discontinua: true, opacidad: 0.7 });
    s += `<circle cx="${T.n(xb)}" cy="${REGLA}" r="4.5" fill="${T.color(col(d, 'x'))}"/>`;
    s += T.rotulo(W - 6, REGLA + 42, `x (${u})`, { ancla: 'end', color: col(d, 'x'), peso: 700 });
    return T.svg(W, ALTO, s, { alt: alt(d) });
  }

  // El texto alternativo cuenta la relación: dónde está el bloque y hacia dónde apuntan v y a.
  function alt(d) {
    const sen = v => (!Number.isFinite(v) ? 'sin dato' : Math.abs(v) < 1e-9 ? 'cero' : v > 0 ? 'hacia la derecha' : 'hacia la izquierda');
    return `Bloque unido a un resorte, en x = ${Kit.formatear(d.x || 0, 2)} ${d.unidad || 'm'} (amplitud ${Kit.formatear(A(d), 2)}); velocidad ${sen(d.v)}, aceleración ${sen(d.a)}.`;
  }

  return { id: 'fis-resorte', dibujar, alt, escala: X, constantes: { W, ALTO, X0, MEDIO, BW } };
});
