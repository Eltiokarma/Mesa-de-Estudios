/*
 * Pieza «recta» (docs/escena-viva.md, sección 5): la recta numérica. Puntos, intervalos abiertos y cerrados,
 * uniones, enteros, distancias y desplazamientos, y una marca que el alumno arrastra sobre la recta.
 * Sirve para números reales, intervalos, inecuaciones, cotas enteras y posiciones de móviles.
 *
 * Afirmación de la figura: lo que se pide es un lugar de la recta, y cada condición lo encierra.
 *
 * datos = {
 *   min: −2, max: 8,                  // tramo visible
 *   paso: 1, cada: 1,                 // rayita cada `paso`; número cada `cada` rayitas (se ralea solo si no cabe)
 *   prefijo: '', sufijo: ' s', decimales: 2,   // cómo se escribe un valor de la recta (lecturas de la marca)
 *   variable: 'x', color: 'o',        // nombre y color de la variable de la recta (al extremo derecho)
 *   filas: 2,                         // filas sobre la recta (el alto se reserva aunque estén vacías)
 *   elementos: [                      // en orden; cada uno aparece en el paso `desde` (0: desde el principio)
 *     { tipo: 'punto', x, color, rotulo, abierto, fila, desde },
 *     { tipo: 'intervalo', a, b, ca, cb, color, rotulo, fila, desde },  // a o b null: −∞ o +∞; ca, cb: cerrado
 *     { tipo: 'enteros', a, b, cada, color, rotulo, fila, desde },      // un punto en cada entero (o múltiplo de cada) de [a, b]
 *     { tipo: 'distancia', a, b, color, rotulo, fila, desde },          // cota entre dos valores
 *     { tipo: 'salto', a, b, color, rotulo, fila, desde },              // flecha de a hasta b
 *   ],
 *   marca: { min, max, inicio } | null,   // si la respuesta es un valor de la recta y se arrastra
 *   respuesta: número | null          // el valor que el estado final dibuja con ✓ (fila de la marca)
 * }
 * estado = {
 *   corte: 0..n,                      // se dibujan los elementos con desde ≤ corte (lo hecho se queda)
 *   final: false,                     // dibuja la respuesta con ✓
 *   marca: null | número,             // la marca del alumno
 *   fantasma: null | { marca, rotulo } | { elementos: [...], rotulo }  // el error, discontinuo, en su fila
 * }
 * El dibujo es una función pura de (datos, estado): sin ids, sin azar, sin reloj. Todo número que se ve lo
 * trae el generador (rótulos y valores); la pieza solo los ubica.
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
  const W = 320, X0 = 18, X1 = 300, FILA = 34, ARRIBA = 36, R = 5;

  // Geometría fija para todos los estados: filas arriba, la recta, sus números, la fila de la marca y la del fantasma.
  function geometria(d) {
    const usadas = (d.elementos || []).map(e => e.fila || 0);
    const filas = Math.max(d.filas || 0, ...usadas, 0);
    const eje = ARRIBA + FILA * filas + 8;
    const manija = eje + 52, fantasma = manija + 30;
    const span = d.max - d.min || 1;
    const x = v => X0 + (X1 - X0) * (v - d.min) / span;
    return { filas, eje, manija, fantasma, alto: fantasma + 16, x, filaY: k => eje - FILA * k };
  }
  const fmt = (d, v) => `${d.prefijo || ''}${Kit.formatear(v, d.decimales === undefined ? 2 : d.decimales)}${d.sufijo || ''}`;
  const dentro = (d, v) => Math.min(d.max, Math.max(d.min, v));

  function controles(d) {
    const g = geometria(d);
    if (!d.marca) return { ancho: W, alto: g.alto, respuesta: d.respuesta };
    const m = d.marca;
    return {
      ancho: W, alto: g.alto,
      marca: {
        min: m.min, max: m.max, inicio: m.inicio === undefined ? m.min : m.inicio,
        aX: v => g.x(v),
        deX: px => d.min + (px - X0) / (X1 - X0) * (d.max - d.min),
        texto: v => fmt(d, v),
      },
      respuesta: d.respuesta,
    };
  }

  // Rayitas y números. Los números se ralean (cada 2, 5, 10…) si no caben sin chocar.
  function regla(d, g) {
    const paso = d.paso > 0 ? d.paso : 1;
    const marcas = [], valores = [];
    const k0 = Math.ceil((d.min - 1e-9) / paso), k1 = Math.floor((d.max + 1e-9) / paso);
    for (let k = k0; k <= k1; k++) { const v = Math.round(k * paso * 1e9) / 1e9; marcas.push(g.x(v)); valores.push(v); }
    let cada = Math.max(1, d.cada || 1);
    const sep = (X1 - X0) * paso / (d.max - d.min || 1);
    const anchoMax = Math.max(...valores.map(v => T.ancho(Kit.formatear(v, d.decimales === undefined ? 2 : d.decimales))));
    for (const c of [1, 2, 5, 10, 20, 50, 100]) if (c >= cada && sep * c >= anchoMax + 8) { cada = c; break; }
    let s = T.eje(X0 - 8, X1 + 10, g.eje, { marcas, alto: 6, grosor: T.GROSOR.contorno });
    s += `<g class="kit-eje">${T.flecha(X1, g.eje, X1 + 14, g.eje, { grosor: T.GROSOR.contorno })}</g>`;
    valores.forEach((v, i) => {
      if (Math.round(v / paso) % cada !== 0) return;
      s += T.rotulo(marcas[i], g.eje + 22, Kit.formatear(v, d.decimales === undefined ? 2 : d.decimales), { ancla: 'middle', clase: 'kit-num' });
    });
    // El nombre de la variable va arriba a la izquierda, sobre todas las filas: junto a la flecha chocaba con los
    // rótulos de los puntos cercanos al extremo.
    if (d.variable) s += T.rotulo(2, 18, d.variable, { color: d.color, peso: 700 });
    return s;
  }

  // Extremo de un intervalo: lleno si está incluido, hueco (color de la tarjeta) si no.
  const extremo = (x, y, c, cerrado, disc) => `<circle cx="${T.n(x)}" cy="${T.n(y)}" r="${R}" fill="${cerrado ? T.color(c) : 'var(--card)'}" stroke="${T.color(c)}" stroke-width="2.5"${disc && !cerrado ? ' stroke-dasharray="3 2"' : ''}/>`;
  // Guía tenue desde una fila hasta la recta: se lee el valor sin adivinar.
  const guia = (x, y, g) => (y < g.eje - 1 ? T.linea(x, y + R, x, g.eje, { grosor: T.GROSOR.cuadricula, discontinua: true, opacidad: 0.6 }) : '');

  // Rótulo de algo que ocupa [xa, xb] en la fila y: centrado encima; en la fila de la recta, encima también.
  function rotuloSobre(xa, xb, y, texto, o) {
    return T.rotulo((xa + xb) / 2, y - 11, texto, { ...o, ancla: 'middle' });
  }
  // Rótulo en la fila del fantasma (abajo): a la derecha si cabe, si no a la izquierda, si no centrado.
  function rotuloLado(xa, xb, y, texto, o) {
    const w = T.ancho(texto, T.TEXTO, o.peso || 400);
    if (xb + 10 + w <= W - 2) return T.rotulo(xb + 10, y + 5, texto, { ...o, ancla: 'start' });
    if (xa - 10 - w >= 2) return T.rotulo(xa - 10, y + 5, texto, { ...o, ancla: 'end' });
    return T.rotulo((xa + xb) / 2, y - 9, texto, { ...o, ancla: 'middle' });
  }

  // Un elemento en la fila y. disc: dibujado como fantasma (discontinuo, sin rótulo propio).
  function elemento(d, g, e, y, clase, disc) {
    const c = e.color, gros = disc ? T.GROSOR.contorno : T.GROSOR.variable;
    let s = '', rot = '';
    const op = { color: c, peso: 700, clase: 'kit-aparece' + clase };
    if (e.tipo === 'punto') {
      const x = g.x(dentro(d, e.x));
      s += guia(x, y, g) + extremo(x, y, c, !e.abierto, disc);
      if (e.rotulo && !disc) rot = rotuloSobre(x, x, y, e.rotulo, op);
      return `<g class="kit-aparece${clase}">${s}</g>${rot}`;
    }
    if (e.tipo === 'enteros') {
      const m = e.cada > 0 ? e.cada : 1;
      const a = Math.ceil((Math.max(d.min, e.a) - 1e-9) / m) * m, b = Math.floor((Math.min(d.max, e.b) + 1e-9) / m) * m;
      for (let k = a; k <= b + 1e-9; k += m) s += `<circle cx="${T.n(g.x(k))}" cy="${T.n(y)}" r="4" fill="${T.color(c)}"/>`;
      if (e.rotulo && !disc && b >= a) rot = rotuloSobre(g.x(a), g.x(b), y, e.rotulo, op);
      return `<g class="kit-aparece${clase}">${s}</g>${rot}`;
    }
    const a = e.a === null || e.a === undefined ? null : dentro(d, e.a);
    const b = e.b === null || e.b === undefined ? null : dentro(d, e.b);
    const xa = a === null ? X0 - 8 : g.x(a), xb = b === null ? X1 + 8 : g.x(b);
    if (e.tipo === 'distancia') {
      s += T.cota(Math.min(xa, xb), Math.max(xa, xb), y, { color: c, grosor: T.GROSOR.contorno, texto: disc ? '' : e.rotulo || '' });
      return `<g class="kit-aparece${clase}">${s}</g>`;
    }
    if (e.tipo === 'salto') {
      s += T.flecha(xa, y, xb, y, { color: c, grosor: gros });
      if (e.rotulo && !disc) rot = rotuloSobre(xa, xb, y, e.rotulo, op);
      return `<g class="kit-crece${clase}">${s}</g>${rot}`;
    }
    // Intervalo: tramo grueso; flecha hacia el infinito; extremos llenos o huecos; guías a la recta.
    let tramo = '';
    if (a === null && b === null) tramo = T.flecha(xb - 20, y, X0 - 10, y, { color: c, grosor: gros }) + T.flecha(xa + 20, y, X1 + 10, y, { color: c, grosor: gros });
    else if (a === null) tramo = T.flecha(xb, y, X0 - 10, y, { color: c, grosor: gros });
    else if (b === null) tramo = T.flecha(xa, y, X1 + 10, y, { color: c, grosor: gros });
    else tramo = T.linea(xa, y, xb, y, { color: c, grosor: gros, discontinua: disc });
    if (disc) tramo = tramo.replace(/stroke-linecap="round"/g, 'stroke-linecap="round" stroke-dasharray="6 4"');
    let puntas = '';
    if (a !== null) puntas += guia(xa, y, g) + extremo(xa, y, c, !!e.ca, disc);
    if (b !== null) puntas += guia(xb, y, g) + extremo(xb, y, c, !!e.cb, disc);
    if (e.rotulo && !disc) rot = rotuloSobre(a === null ? X0 : xa, b === null ? X1 : xb, y, e.rotulo, op);
    return `<g class="kit-crece${clase}">${tramo}</g><g class="kit-aparece${clase}">${puntas}</g>${rot}`;
  }

  // La marca vertical: sale de la recta y termina en una manija con su lectura al lado.
  function marcaSVG(d, g, m, { solida, clase, rotulo, y }) {
    const x = g.x(dentro(d, m));
    const lado = x > W / 2 ? 'end' : 'start', dx = lado === 'end' ? -16 : 16;
    let s = T.linea(x, g.eje - 10, x, y, { grosor: solida ? T.GROSOR.variable : T.GROSOR.contorno, discontinua: !solida, opacidad: solida ? undefined : 0.8 });
    s += solida ? `<circle cx="${T.n(x)}" cy="${T.n(y)}" r="11" fill="currentColor"/>` : `<circle cx="${T.n(x)}" cy="${T.n(y)}" r="6" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="3 3"/>`;
    s += T.rotulo(x + dx, y + 6, rotulo, { ancla: lado, peso: solida ? 700 : 400 });
    return `<g class="${clase}">${s}</g>`;
  }

  function dibujar(d, estado = {}) {
    const g = geometria(d);
    const final = !!estado.final;
    const corte = Math.max(0, estado.corte || 0);
    const nuevo = e => ((e.desde || 0) === corte && corte > 0 ? ' kit-nuevo' : '');
    let s = regla(d, g);
    for (const e of d.elementos || []) {
      if ((e.desde || 0) > corte) continue;
      s += elemento(d, g, e, g.filaY(e.fila || 0), nuevo(e), false);
    }
    const f = estado.fantasma;
    if (f && Number.isFinite(f.marca)) {
      s += marcaSVG(d, g, f.marca, { solida: false, clase: 'kit-fantasma', y: g.fantasma, rotulo: `${f.rotulo ? f.rotulo + ': ' : ''}${fmt(d, f.marca)}` });
    } else if (f && Array.isArray(f.elementos) && f.elementos.length) {
      let xa = X1, xb = X0, cuerpo = '';
      for (const e of f.elementos) {
        cuerpo += elemento(d, g, { ...e, color: null }, g.fantasma, '', true);
        const v = [e.x, e.a, e.b].filter(Number.isFinite).map(u => g.x(dentro(d, u)));
        if (e.a === null) v.push(X0); if (e.b === null) v.push(X1);
        xa = Math.min(xa, ...v); xb = Math.max(xb, ...v);
      }
      if (f.rotulo) cuerpo += rotuloLado(xa, xb, g.fantasma, f.rotulo, { peso: 400 });
      s += `<g class="kit-fantasma" opacity="0.85">${cuerpo}</g>`;
    }
    if (final && Number.isFinite(d.respuesta)) {
      s += marcaSVG(d, g, d.respuesta, { solida: true, clase: 'kit-respuesta kit-aparece kit-nuevo', y: g.manija, rotulo: `${fmt(d, d.respuesta)} ✓` });
    } else if (!final && Number.isFinite(estado.marca)) {
      s += marcaSVG(d, g, estado.marca, { solida: true, clase: 'kit-marca', y: g.manija, rotulo: fmt(d, estado.marca) });
    }
    return T.svg(W, g.alto, s, { alt: alt(d) });
  }

  function alt(d) {
    if (d.alt) return d.alt;
    const partes = (d.elementos || []).filter(e => e.rotulo).map(e => e.rotulo);
    return `Recta de ${d.variable || 'x'} de ${fmt(d, d.min)} a ${fmt(d, d.max)}${partes.length ? ': ' + partes.join('; ') : ''}`;
  }

  return { id: 'recta', dibujar, alt, controles, geometria };
});
