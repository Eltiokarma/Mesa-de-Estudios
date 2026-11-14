/*
 * Pieza «quim-composicion» (sesión de teoría de Química): una o varias barras partidas en tramos, una por fila.
 * Cada tramo es lo que aporta un elemento (o un reactivo): su largo es su valor. Sirve para composición
 * centesimal, el paso de gramos a moles en la fórmula empírica, la conservación de la masa (antes y después) y
 * las proporciones definidas y múltiples.
 *
 * Afirmación de la figura: el porcentaje de un elemento es el largo de su tramo dentro de la barra del compuesto.
 *
 * Fidelidad: el largo de cada tramo es proporcional a su valor. Con escala 'comun', todas las filas usan la misma
 * escala (dos barras del mismo largo pesan lo mismo); con 'propia', cada fila ocupa el ancho entero (porcentajes).
 * Los rótulos los trae quien llama (regla 1): la pieza solo ubica.
 *
 * datos = {
 *   filas: [{ titulo: '100 g de glucosa', tramos: [{ valor: 40, texto: 'C 40 g', color: 'o' }, …], desde, hasta }],
 *   escala: 'propia' | 'comun',
 *   alt
 * }
 * estado = { corte }: se ve la fila con desde ≤ corte y sin hasta < corte. El alto depende solo del número de filas.
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
  const W = 320, X0 = 10, LARGO = 300, FILA = 84, TOP = 6, HB = 30;
  const total = f => (f.tramos || []).reduce((a, t) => a + Math.max(0, t.valor || 0), 0);
  const alto = d => TOP + (d.filas || []).length * FILA + 4;

  function filaSVG(d, f, y, maximo, nuevo) {
    const tot = total(f), largo = d.escala === 'comun' ? LARGO * tot / (maximo || 1) : LARGO;
    let s = '';
    if (f.titulo) s += T.rotulo(X0, y + 16, f.titulo, { peso: 700 });
    let x = X0, abajo = 0;
    for (const t of f.tramos || []) {
      const w = tot > 0 ? largo * Math.max(0, t.valor || 0) / tot : 0;
      s += `<rect x="${T.n(x)}" y="${y + 24}" width="${T.n(w)}" height="${HB}" fill="${T.color(t.color)}" fill-opacity="0.22" stroke="${T.color(t.color)}" stroke-width="2"/>`;
      if (t.texto) {
        const tw = T.ancho(t.texto, 14, 600);
        if (tw + 8 <= w) s += T.rotulo(x + w / 2, y + 24 + HB / 2 + 5, t.texto, { ancla: 'middle', peso: 600, tam: 14, clase: 'kit-num' });
        else {
          s += T.linea(x + w / 2, y + 24 + HB, x + w / 2, y + 24 + HB + 6 + 14 * (abajo % 2), { grosor: 1, opacidad: 0.6 });
          s += T.rotulo(x + w / 2, y + 24 + HB + 18 + 14 * (abajo % 2), t.texto, { ancla: 'middle', peso: 600, tam: 14, clase: 'kit-num' });
          abajo++;
        }
      }
      x += w;
    }
    return `<g class="kit-fila${nuevo}">${s}</g>`;
  }

  // Geometría para el gesto directo (docs/teoria.md §4b): la barra de la fila i empieza en x0, mide largo(i) y su
  // borde de arriba está en y(i). xDe(i, v) es el x donde termina un acumulado v; valorEn(i, x) es la inversa.
  function geometria(d) {
    const filas = d.filas || [], maximo = Math.max(0, ...filas.map(total));
    const largo = i => { const tot = total(filas[i] || {}); return d.escala === 'comun' ? LARGO * tot / (maximo || 1) : LARGO; };
    const xDe = (i, v) => { const tot = total(filas[i] || {}); return X0 + (tot > 0 ? largo(i) * v / tot : 0); };
    const valorEn = (i, x) => { const tot = total(filas[i] || {}), L = largo(i); return L > 0 ? (x - X0) * tot / L : 0; };
    return { x0: X0, alto: alto(d), hb: HB, y: i => TOP + i * FILA + 24, largo, xDe, valorEn };
  }

  function dibujar(d, estado = {}) {
    const corte = Math.max(0, estado.corte || 0), filas = d.filas || [];
    const maximo = Math.max(0, ...filas.map(total));
    let s = '';
    filas.forEach((f, i) => {
      if ((f.desde || 0) > corte || f.hasta < corte) return;
      s += filaSVG(d, f, TOP + i * FILA, maximo, (f.desde || 0) === corte && corte > 0 ? ' kit-nuevo kit-aparece' : '');
    });
    return T.svg(W, alto(d), s, { alt: alt(d) });
  }

  function alt(d) {
    if (d.alt) return d.alt;
    return (d.filas || []).map(f => `${f.titulo || 'barra'}: ${(f.tramos || []).map(t => t.texto || Kit.formatear(t.valor, 2)).join(', ')}`).join('. ') + '.';
  }

  return { id: 'quim-composicion', dibujar, alt, geometria };
});
