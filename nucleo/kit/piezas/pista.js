/*
 * Pieza «pista» (docs/escena-viva.md, sección 5; docs/pogil-v2-rive.md, sección 7.5): una pista recta con su regla,
 * uno o dos carriles con su carrito, las marcas que el carrito deja cada segundo, la bandera de una predicción
 * y las tiras de las corridas anteriores (el registro). Sirve para MRU, MRUV y encuentros.
 *
 * Afirmación de la figura: la separación entre marcas de un segundo es la rapidez; se lee sin números.
 *
 * datos = {
 *   largo: 30,                      // metros de pista (la regla va de 0 a largo)
 *   cada: 5,                        // cada cuántos metros va un número en la regla
 *   carriles: [{ x, variante: 'a' | 'b', marcas: [x, …], flecha: { a } , rotulo }],   // uno o dos
 *   bandera: { x, rotulo } | null,  // la predicción del alumno (dónde se encuentran)
 *   encuentro: { x, rotulo } | null,// dónde se encontraron de verdad (lo calcula el motor)
 *   registro: [{ marcas: [x, …], rotulo }],   // corridas anteriores, una tira por corrida (máximo 3)
 * }
 * Todo número que se ve lo trae quien llama: la pieza solo convierte metros a píxeles.
 *
 * El carrito es PROVISIONAL (trazo del kit: caja y dos ruedas). El arte final es de Gerson
 * (docs/encargo-vectores.md, sección 9) y respeta los mismos grupos: cuerpo, rueda-del, rueda-tras y apoyo.
 * Para animar sin redibujar todo, la página mueve el grupo «kit-carrito-<k>» con mover(datos, k, x, cabeceo):
 * devuelve el transform del carrito y el giro de las ruedas, que salen de la misma escala que la regla.
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
  const W = 320, PX0 = 28, PX1 = 292;          // la regla: de 0 a largo metros entre PX0 y PX1
  const CARRIL0 = 58, ENTRE = 54;              // piso del primer carril y separación entre carriles
  const CW = 48, CH = 26, RR = 6;              // carrito provisional: ancho, alto y radio de rueda (px)
  const COLOR = { x: 'i', a: 'd' };            // x turquesa, a verde (tokens de variable del kit)

  const largo = d => (d.largo > 0 ? d.largo : 30);
  // Metros → píxeles. Es la única conversión de la pieza: la regla, las marcas y el apoyo del carrito la usan.
  const X = (d, x) => PX0 + (PX1 - PX0) * x / largo(d);
  const pisoDe = k => CARRIL0 + k * ENTRE;
  function geometria(d) {
    const n = Math.max(1, (d.carriles || []).length);
    const regla = pisoDe(n - 1) + 22;
    const registro = regla + 46;
    // Con registro, el alto reserva siempre las 3 tiras: que aparezca una corrida nueva no mueve nada.
    const filas = Array.isArray(d.registro) ? 3 : 0;
    return { regla, registro, alto: registro + filas * 24 + (filas ? 4 : 0), X: x => X(d, x), piso: pisoDe };
  }

  // El carrito provisional, dibujado con el apoyo en (0, 0): el piso pasa por y = 0 y el centro está en x = 0.
  function carrito(variante) {
    const b = variante === 'b';
    const cuerpo = b
      ? `<path d="M${-CW / 2} ${-RR - 2}L${-CW / 2} ${-CH}L${CW / 2 - 10} ${-CH}L${CW / 2} ${-CH + 10}L${CW / 2} ${-RR - 2}Z"/>`
      : `<rect x="${-CW / 2}" y="${-CH}" width="${CW}" height="${CH - RR - 2}" rx="8"/>`;
    const rueda = (cx, id) => `<g class="${id}" transform="translate(${cx} ${-RR})"><circle r="${RR}" fill="var(--card)"/><line x1="0" y1="0" x2="0" y2="${-RR + 1}" stroke-width="2" stroke-linecap="round"/></g>`;
    return `<g class="cuerpo" fill="var(--card)" stroke="currentColor" stroke-width="${T.GROSOR.contorno}" stroke-linejoin="round">${cuerpo}</g>`
      + `<g stroke="currentColor" stroke-width="${T.GROSOR.contorno}">${rueda(-CW / 2 + 11, 'rueda-tras')}${rueda(CW / 2 - 11, 'rueda-del')}</g>`
      + `<g class="apoyo"><circle r="1" fill="none"/></g>`;
  }

  // Transform del carrito k en la posición x (m), con el cabeceo en grados (+ hacia adelante, al frenar).
  // El giro de las ruedas es el ángulo que da una rueda que rueda sin resbalar: recorrido en px / radio.
  function mover(d, k, x, cabeceo = 0) {
    const px = X(d, x), py = pisoDe(k);
    const giro = (px - X(d, 0)) / RR * 180 / Math.PI;
    return { px, py, carrito: `translate(${T.n(px)} ${T.n(py)}) rotate(${T.n(cabeceo)} 0 ${-RR})`, rueda: `rotate(${T.n(giro)})` };
  }

  const punto = (x, y, color, r = 3.5) => `<circle cx="${T.n(x)}" cy="${T.n(y)}" r="${r}" fill="${T.color(color)}"/>`;

  function dibujar(d, estado = {}) {
    const g = geometria(d);
    let s = '';
    const carriles = d.carriles && d.carriles.length ? d.carriles : [{ x: 0 }];
    // Pisos de los carriles.
    carriles.forEach((c, k) => {
      s += T.linea(PX0 - 24, pisoDe(k), PX1 + 24, pisoDe(k), { grosor: T.GROSOR.contorno, opacidad: 0.55 });
      if (c.rotulo) s += T.rotulo(4, pisoDe(k) - CH - 6, c.rotulo, { peso: 700, clase: 'kit-txt' });
    });
    // Regla de la pista: rayitas cada metro, números cada `cada` metros.
    const L = largo(d), cada = d.cada > 0 ? d.cada : 5;
    let rr = T.linea(PX0, g.regla, PX1, g.regla, { grosor: T.GROSOR.contorno });
    for (let m = 0; m <= L + 1e-9; m++) {
      const grande = m % cada === 0;
      rr += T.linea(X(d, m), g.regla, X(d, m), g.regla + (grande ? 8 : 4), { grosor: T.GROSOR.cuadricula, opacidad: grande ? 1 : 0.6 });
      if (grande) rr += T.rotulo(X(d, m), g.regla + 24, Kit.formatear(m, 0), { ancla: 'middle', clase: 'kit-num' });
    }
    rr += T.rotulo(PX1 + 26, g.regla + 24, 'x (m)', { color: COLOR.x, peso: 700, ancla: 'end' });
    s += `<g class="kit-regla">${rr}</g>`;
    // Marcas de cada segundo: puntos sobre el piso del carril, en el color de x (son posiciones).
    carriles.forEach((c, k) => { for (const m of c.marcas || []) s += punto(X(d, m), pisoDe(k) + 6, COLOR.x); });
    // Bandera de la predicción y lugar del encuentro (los dos cruzan los carriles).
    const arriba = pisoDe(0) - CH - 14, abajo = pisoDe(carriles.length - 1) + 10;
    if (d.bandera) {
      const bx = X(d, d.bandera.x);
      s += `<g class="kit-bandera">${T.linea(bx, arriba, bx, abajo, { grosor: T.GROSOR.contorno, discontinua: true })}`
        + `<path d="M${T.n(bx)} ${T.n(arriba)}l12 5l-12 5z" fill="currentColor"/>`
        + (d.bandera.rotulo ? T.rotulo(bx + 16, arriba + 9, d.bandera.rotulo, { clase: 'kit-txt' }) : '') + '</g>';
    }
    if (d.encuentro) {
      const ex = X(d, d.encuentro.x);
      s += `<g class="kit-encuentro">${T.linea(ex, arriba, ex, abajo, { grosor: T.GROSOR.variable, color: COLOR.x })}`
        + (d.encuentro.rotulo ? T.rotulo(ex, abajo + 14 > g.regla - 4 ? arriba - 6 : abajo + 14, d.encuentro.rotulo, { ancla: 'middle', color: COLOR.x, peso: 700, clase: 'kit-txt' }) : '') + '</g>';
    }
    // Carritos, con su flecha de aceleración (verde, solo el sentido: la flecha no mide).
    carriles.forEach((c, k) => {
      const m = mover(d, k, c.x || 0, c.cabeceo || 0);
      let fl = '';
      if (c.flecha && c.flecha.a) {
        const sg = Math.sign(c.flecha.a), y = -CH - 10;
        fl = T.flecha(-sg * 14, y, sg * 18, y, { grosor: T.GROSOR.variable, color: COLOR.a }) + T.rotulo(sg > 0 ? -22 : 22, y + 5, 'a', { color: COLOR.a, peso: 700, ancla: 'middle' });
      }
      s += `<g class="kit-carrito kit-carrito-${k}" transform="${m.carrito}">${carrito(c.variante)}${fl}</g>`;
    });
    // Registro: una tira por corrida anterior, con su rótulo a la izquierda de la tira.
    (d.registro || []).slice(-3).forEach((r, i) => {
      const y = g.registro + i * 24;
      s += T.linea(PX0, y, PX1, y, { grosor: T.GROSOR.cuadricula, opacidad: 0.35 });
      for (const m of r.marcas || []) s += punto(X(d, m), y, COLOR.x, 3);
      if (r.rotulo) s += T.rotulo(PX0, y - 6, r.rotulo, { clase: 'kit-txt kit-num' });
    });
    return T.svg(W, g.alto, s, { alt: alt(d) });
  }

  // El texto alternativo cuenta la relación: cuánto separa cada carrito sus marcas de un segundo.
  function alt(d) {
    const sep = ms => {
      if (!ms || ms.length < 2) return 'sin marcas todavía';
      const dif = ms.slice(1).map((m, i) => m - ms[i]);
      const igual = dif.every(x => Math.abs(x - dif[0]) < 1e-6);
      return igual ? `marcas cada ${Kit.formatear(dif[0], 1)} m` : `marcas de ${Kit.formatear(dif[0], 1)} a ${Kit.formatear(dif[dif.length - 1], 1)} m de separación`;
    };
    const cs = (d.carriles || []).map((c, k) => `carrito ${k + 1} en x = ${Kit.formatear(c.x || 0, 1)} m, ${sep(c.marcas)}`);
    let t = `Pista de ${Kit.formatear(largo(d), 0)} m: ${cs.join('; ') || 'un carrito en x = 0'}`;
    if (d.bandera) t += `; predicción en x = ${Kit.formatear(d.bandera.x, 1)} m`;
    if (d.encuentro) t += `; se encuentran en x = ${Kit.formatear(d.encuentro.x, 1)} m`;
    return t + '.';
  }

  return { id: 'pista', dibujar, alt, mover, geometria, escala: X, constantes: { W, PX0, PX1, CW, RR } };
});
