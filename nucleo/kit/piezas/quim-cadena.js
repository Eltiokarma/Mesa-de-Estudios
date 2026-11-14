/*
 * Pieza «quim-cadena» (sesión de teoría de Química): una o dos cadenas de pasos (fuente → especie → proceso →
 * efecto), de arriba abajo, con flechas entre pasos. Sirve para separar procesos que se confunden (destilar y
 * craquear, filtrar y desinfectar, ozono y efecto invernadero), para rutas de metalurgia y para el orden de un
 * procedimiento (nombre ↔ fórmula).
 *
 * Afirmación de la figura: cada paso causa el siguiente y solo ese; dos cadenas puestas lado a lado no comparten
 * flechas aunque compartan una sustancia.
 *
 * Fidelidad: solo se dibujan las flechas de los datos; una flecha `no` (tachada) dice que esa relación no existe.
 *
 * datos = {
 *   columnas: [{ titulo, color, nodos: [{ texto, color, desde, hasta, tenue }],
 *                flechas: [{ de: i, a: j, texto, no, desde }] }],   // sin flechas: cada nodo apunta al siguiente
 *   alt
 * }
 * estado = { corte }. El alto depende del número de nodos de la columna más larga.
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
  const W = 320, M = 6, GAP = 12, TOP = 28, HN = 46, SEP = 26, TAM = 15;

  // Parte un texto en líneas que caben en `ancho` px (a lo más tres).
  function lineas(texto, ancho) {
    const out = [];
    let act = '';
    for (const p of String(texto).split(/\s+/)) {
      const prueba = act ? `${act} ${p}` : p;
      if (T.ancho(prueba, TAM, 600) <= ancho || !act) act = prueba; else { out.push(act); act = p; }
    }
    if (act) out.push(act);
    return out.slice(0, 3);
  }

  function geometria(d) {
    const cols = (d.columnas || []).slice(0, 2), n = Math.max(1, cols.length);
    const ancho = (W - 2 * M - GAP * (n - 1)) / n;
    const max = Math.max(1, ...cols.map(c => (c.nodos || []).length));
    const altoNodo = Math.max(HN, ...cols.flatMap(c => (c.nodos || []).map(x => 14 + 19 * lineas(x.texto, ancho - 16).length)));
    return { cols, n, ancho, altoNodo, alto: TOP + max * altoNodo + (max - 1) * SEP + 10, x: k => M + k * (ancho + GAP), y: i => TOP + i * (altoNodo + SEP) };
  }

  function dibujar(d, estado = {}) {
    const g = geometria(d), corte = Math.max(0, estado.corte || 0);
    const ve = x => (x.desde || 0) <= corte && !(x.hasta < corte);
    const nuevo = x => ((x.desde || 0) === corte && corte > 0 ? ' kit-nuevo kit-aparece' : '');
    let s = '';
    g.cols.forEach((c, k) => {
      const x = g.x(k), w = g.ancho, nodos = c.nodos || [];
      if (c.titulo) s += T.rotulo(x + w / 2, TOP - 10, c.titulo, { ancla: 'middle', peso: 700, color: c.color, min: x, max: x + w });
      const flechas = c.flechas || nodos.slice(1).map((nn, i) => ({ de: i, a: i + 1, desde: nn.desde }));
      for (const f of flechas) {
        if (!ve(f) || !nodos[f.de] || !nodos[f.a] || !ve(nodos[f.de]) || !ve(nodos[f.a])) continue;
        const y1 = g.y(f.de) + g.altoNodo + 2, y2 = g.y(f.a) - 2, xm = x + w / 2;
        let q = T.flecha(xm, y1, xm, y2, { grosor: 2 });
        if (f.no) q += T.linea(xm - 8, (y1 + y2) / 2 - 8, xm + 8, (y1 + y2) / 2 + 8, { grosor: 2.5, color: 'h' }) + T.linea(xm - 8, (y1 + y2) / 2 + 8, xm + 8, (y1 + y2) / 2 - 8, { grosor: 2.5, color: 'h' });
        if (f.texto) q += T.rotulo(xm + 10, (y1 + y2) / 2 + 5, f.texto, { tam: 14, min: x, max: x + w });
        s += `<g class="kit-flecha${nuevo(f)}">${q}</g>`;
      }
      nodos.forEach((nn, i) => {
        if (!ve(nn)) return;
        const y = g.y(i), ls = lineas(nn.texto, w - 16), col = nn.color || c.color;
        let q = T.barra(x, y, w, g.altoNodo, { color: col, relleno: nn.tenue ? 0.04 : 0.14, discontinua: nn.tenue });
        const y0 = y + g.altoNodo / 2 - (ls.length - 1) * 9.5 + 5;
        ls.forEach((l, j) => { q += T.rotulo(x + w / 2, y0 + j * 19, l, { ancla: 'middle', peso: 600, tam: TAM, min: x + 2, max: x + w - 2 }); });
        s += `<g class="kit-nodo${nuevo(nn)}"${nn.tenue ? ' opacity="0.6"' : ''}>${q}</g>`;
      });
    });
    return T.svg(W, g.alto, s, { alt: alt(d) });
  }

  function alt(d) {
    if (d.alt) return d.alt;
    return (d.columnas || []).map(c => `${c.titulo ? c.titulo + ': ' : ''}${(c.nodos || []).map(n => n.texto).join(' → ')}`).join('. ') + '.';
  }

  return { id: 'quim-cadena', dibujar, alt, lineas, geometria };
});
