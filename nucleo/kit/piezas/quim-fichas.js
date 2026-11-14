/*
 * Pieza «quim-fichas» (sesión de teoría de Química): fichas de iones o de átomos con su carga (o su estado de
 * oxidación), y debajo la cuenta de cargas: una fila de cuadritos llenos por cada carga positiva y otra de
 * cuadritos huecos por cada negativa, alineadas para que cada + quede frente a un −. Lo que no tiene pareja es la
 * carga neta. Sirve para fórmulas de compuestos iónicos, estados de oxidación y electrones en una semirreacción.
 *
 * Afirmación de la figura: la fórmula es neutra cuando cada carga positiva tiene una negativa enfrente.
 *
 * Fidelidad: el número de fichas y de cuadritos es exactamente el de los datos (Σ n·carga); la neta es la
 * diferencia y se rotula. Si hay más de 16 cargas de un signo, se dibujan en grupos de 2 (dicho en el rótulo).
 *
 * datos = {
 *   fichas: [{ t: 'Ca²⁺', carga: 2, n: 1, color: 'o', desde, hasta }],  // n copias de la ficha
 *   cuenta: true,            // las dos filas de cuadritos y la carga neta (por defecto, sí)
 *   neta: 'carga neta',      // cómo se llama lo que queda («carga del ion», «electrones»)
 *   alt
 * }
 * estado = { corte }. Alto fijo: 196.
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
  const W = 320, ALTO = 196, YF = 22, HF = 40, YP = 104, YN = 136, Q = 14;
  const sg = n => (n > 0 ? `+${Kit.formatear(n, 0)}` : n < 0 ? `−${Kit.formatear(-n, 0)}` : '0');

  // La fila de fichas: todas las copias (también las que aparecerán), su ancho y la escala para caber en 320.
  function fila(d) {
    const copias = [];
    for (const f of d.fichas || []) for (let k = 0; k < (f.n === undefined ? 1 : f.n); k++) copias.push(f);
    const anchos = copias.map(f => Math.max(40, T.ancho(f.t, 16, 700) + 14));
    const total = anchos.reduce((a, b) => a + b, 0) + 6 * Math.max(0, copias.length - 1);
    const esc = Math.min(1, (W - 16) / Math.max(1, total));
    return { copias, anchos, esc, x: (W - total * esc) / 2 };
  }

  // Geometría para el gesto directo (docs/teoria.md §4b): la caja de cada copia (en orden), y dónde van los
  // cuadritos de carga (k-ésimo cuadrito de la fila + en cuadrito(k, '+'), de la fila − en cuadrito(k, '−')).
  function geometria(d) {
    const { copias, anchos, esc, x } = fila(d);
    let xx = x;
    const cajas = copias.map((f, i) => { const w = anchos[i] * esc, c = { x: xx, y: YF, w, h: HF, cx: xx + w / 2, cy: YF + HF / 2, ficha: f }; xx += w + 6 * esc; return c; });
    const cuadrito = (k, signo) => ({ x: 40 + k * (Q + 3) + Q / 2, y: (signo === '−' ? YN : YP) + Q / 2 });
    return { alto: ALTO, cajas, cuadrito };
  }

  function dibujar(d, estado = {}) {
    const corte = Math.max(0, estado.corte || 0);
    const ve = x => (x.desde || 0) <= corte && !(x.hasta < corte);
    const nuevo = x => ((x.desde || 0) === corte && corte > 0 ? ' kit-nuevo kit-aparece' : '');
    // Fichas en una fila (todas las copias, también las que aparecerán: el encuadre no salta).
    const { copias, anchos, esc, x: x00 } = fila(d);
    let x = x00, s = '';
    const visibles = [];
    copias.forEach((f, i) => {
      const w = anchos[i] * esc;
      if (ve(f)) {
        visibles.push(f);
        let q = T.barra(x, YF, w, HF, { color: f.color, relleno: 0.14 });
        q += T.rotulo(x + w / 2, YF + HF / 2 + 6, f.t, { ancla: 'middle', peso: 700, color: f.color, tam: esc < 0.85 ? 14 : 16 });
        q += T.rotulo(x + w / 2, YF + HF + 18, sg(f.carga), { ancla: 'middle', peso: 600, tam: 14, clase: 'kit-num' });
        s += `<g class="kit-ficha${nuevo(f)}">${q}</g>`;
      }
      x += w + 6 * esc;
    });
    if (d.cuenta !== false) {
      const pos = [], neg = [];
      for (const f of visibles) for (let k = 0; k < Math.abs(f.carga || 0); k++) (f.carga > 0 ? pos : neg).push(f);
      const grupo = Math.max(pos.length, neg.length) > 16 ? 2 : 1;
      const np = Math.ceil(pos.length / grupo), nn = Math.ceil(neg.length / grupo);
      const paso = Q + 3, x0 = 40;
      s += T.rotulo(x0 - 10, YP + Q - 1, '+', { ancla: 'end', peso: 700 }) + T.rotulo(x0 - 10, YN + Q - 1, '−', { ancla: 'end', peso: 700 });
      for (let k = 0; k < np; k++) { const f = pos[k * grupo]; s += `<rect x="${T.n(x0 + k * paso)}" y="${YP}" width="${Q}" height="${Q}" rx="2" fill="${T.color(f.color)}" stroke="${T.color(f.color)}" stroke-width="1.5"/>`; }
      for (let k = 0; k < nn; k++) { const f = neg[k * grupo]; s += `<rect x="${T.n(x0 + k * paso)}" y="${YN}" width="${Q}" height="${Q}" rx="2" fill="var(--card)" stroke="${T.color(f.color)}" stroke-width="2"/>`; }
      const pares = Math.min(np, nn);
      for (let k = 0; k < pares; k++) s += T.linea(x0 + k * paso + Q / 2, YP + Q + 2, x0 + k * paso + Q / 2, YN - 2, { grosor: 1, opacidad: 0.5 });
      for (let k = pares; k < Math.max(np, nn); k++) s += `<rect x="${T.n(x0 + k * paso - 2)}" y="${(np > nn ? YP : YN) - 2}" width="${Q + 4}" height="${Q + 4}" rx="3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2"/>`;
      const neta = pos.length - neg.length;
      s += T.rotulo(x0 - 24, ALTO - 12, `${d.neta || 'carga neta'}: ${sg(neta)}${grupo > 1 ? ' (cada cuadrito = 2)' : ''}`, { peso: 700, min: 4 });
    }
    return T.svg(W, ALTO, s, { alt: alt(d) });
  }

  function alt(d) {
    if (d.alt) return d.alt;
    const fs = (d.fichas || []).map(f => `${f.n === undefined ? 1 : f.n} × ${f.t} (${sg(f.carga)})`);
    const neta = (d.fichas || []).reduce((a, f) => a + (f.n === undefined ? 1 : f.n) * (f.carga || 0), 0);
    return `Fichas: ${fs.join(', ')}. ${d.neta || 'Carga neta'}: ${sg(neta)}.`;
  }

  return { id: 'quim-fichas', dibujar, alt, geometria };
});
