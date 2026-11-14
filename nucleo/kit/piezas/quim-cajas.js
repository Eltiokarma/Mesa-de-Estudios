/*
 * Pieza «quim-cajas» (sesión de teoría de Química): el diagrama de orbitales. Cada fila es un subnivel (1s, 2p…)
 * con una caja por orbital y los electrones como flechas de espín. Sirve para configuración electrónica, Pauli,
 * Hund, iones, paramagnetismo y la ubicación en la tabla.
 *
 * Afirmación de la figura: cada caja admite dos flechas opuestas, y los electrones solos (desapareados) se ven.
 *
 * Fidelidad: el número de flechas de cada fila es el de los datos. Si una fila no trae `flechas`, se llena como
 * dice Hund (una hacia arriba en cada caja, después las de abajo); si las trae, se dibujan tal cual (estados
 * excitados o errores que se muestran). Las que salen se dibujan discontinuas.
 *
 * datos = {
 *   filas: [{ nombre: '2p', e: 4, cajas: 3, flechas: [[1, 1], [1, 0], [1, 0]], sale: 0, desde, color }],
 *          // de arriba abajo, en el orden en que se escribe la configuración; sale: cuántas de las últimas
 *          // flechas se van (se dibujan discontinuas)
 *   desapareados: true,          // marca las cajas con una sola flecha
 *   rotulo,                      // debajo, por ejemplo «3 desapareados»
 *   alt
 * }
 * estado = { corte }. El alto depende solo de cuántas filas hay.
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
  const W = 320, FILA = 40, X0 = 64, TOP = 10;
  // Lado de la caja: 32 px; si alguna fila tiene más de 5 orbitales (4f: 7), todas bajan a 26 para caber en 320.
  let CAJA = 32;
  const ladoCaja = d => (Math.max(1, ...(d.filas || []).map(f => f.cajas || (f.flechas ? f.flechas.length : 1))) > 5 ? 26 : 32);

  // Hund: primero una flecha hacia arriba en cada caja, después las de abajo.
  function llenar(e, cajas) {
    const out = Array.from({ length: cajas }, () => [0, 0]);
    for (let k = 0; k < Math.min(e, 2 * cajas); k++) out[k % cajas][k < cajas ? 0 : 1] = 1;
    return out;
  }

  function filaSVG(fila, y, d, corte) {
    const nuevo = (fila.desde || 0) === corte && corte > 0 ? ' kit-nuevo kit-aparece' : '';
    const cajas = fila.cajas || (fila.flechas ? fila.flechas.length : 1);
    const fl = fila.flechas || llenar(fila.e || 0, cajas);
    // Las `sale` últimas flechas (en orden de llenado inverso) se dibujan discontinuas.
    const orden = [];
    for (let k = 0; k < cajas; k++) if (fl[k][0]) orden.push([k, 0]);
    for (let k = 0; k < cajas; k++) if (fl[k][1]) orden.push([k, 1]);
    const salen = new Set(orden.slice(orden.length - (fila.sale || 0)).map(([k, j]) => `${k}-${j}`));
    let s = T.rotulo(X0 - 12, y + CAJA / 2 + 6, fila.nombre || '', { ancla: 'end', peso: 700, color: fila.color });
    for (let k = 0; k < cajas; k++) {
      const x = X0 + k * CAJA;
      s += `<rect x="${T.n(x)}" y="${T.n(y)}" width="${CAJA}" height="${CAJA}" fill="none" stroke="currentColor" stroke-width="${T.GROSOR.contorno}"/>`;
      const enCaja = [0, 1].filter(j => fl[k][j] && !salen.has(`${k}-${j}`)).length;
      if (d.desapareados && enCaja === 1) s += `<rect x="${T.n(x + 3)}" y="${T.n(y + 3)}" width="${CAJA - 6}" height="${CAJA - 6}" rx="3" fill="var(--c-o)" fill-opacity="0.18" stroke="var(--c-o)" stroke-width="1.5" stroke-dasharray="3 2"/>`;
      for (const j of [0, 1]) {
        if (!fl[k][j]) continue;
        const xx = x + Math.round(CAJA * (j ? 0.66 : 0.34)), arriba = j === 0;
        const y1 = arriba ? y + CAJA - 5 : y + 5, y2 = arriba ? y + 5 : y + CAJA - 5;
        const sale = salen.has(`${k}-${j}`);
        const linea = `<line x1="${xx}" y1="${T.n(y1)}" x2="${xx}" y2="${T.n(y2)}" stroke="var(--c-i)" stroke-width="2.5" stroke-linecap="round"${sale ? ' stroke-dasharray="3 3" stroke-opacity="0.6"' : ''}/>`;
        const pt = arriba ? `M${xx - 5} ${T.n(y2 + 7)}L${xx} ${T.n(y2)}L${xx + 5} ${T.n(y2 + 7)}` : `M${xx - 5} ${T.n(y2 - 7)}L${xx} ${T.n(y2)}L${xx + 5} ${T.n(y2 - 7)}`;
        s += linea + `<path d="${pt}" fill="none" stroke="var(--c-i)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"${sale ? ' stroke-opacity="0.6"' : ''}/>`;
      }
    }
    const e = orden.length - (fila.sale || 0);
    s += T.rotulo(X0 + cajas * CAJA + 10, y + CAJA / 2 + 6, `${Kit.formatear(e, 0)} e⁻`, { peso: 600, clase: 'kit-num' });
    return `<g class="kit-fila${nuevo}">${s}</g>`;
  }

  function alto(d) { return TOP + (d.filas || []).length * FILA + (d.rotulo ? 30 : 6); }

  // Geometría para el gesto directo (docs/teoria.md §4b): dónde cae cada caja y cada flecha, en px del viewBox.
  // caja(i, k): fila i (de arriba abajo), caja k; flecha(i, k, j): j = 0 la de arriba (↑), 1 la de abajo (↓).
  function geometria(d) {
    const lado = ladoCaja(d);
    const caja = (i, k) => { const x = X0 + k * lado, y = TOP + i * FILA; return { x, y, w: lado, h: lado, cx: x + lado / 2, cy: y + lado / 2 }; };
    const flecha = (i, k, j) => ({ x: X0 + k * lado + Math.round(lado * (j ? 0.66 : 0.34)), y: TOP + i * FILA + lado / 2 });
    return { lado, x0: X0, top: TOP, fila: FILA, alto: alto(d), caja, flecha };
  }

  function dibujar(d, estado = {}) {
    const corte = Math.max(0, estado.corte || 0);
    CAJA = ladoCaja(d);
    let s = '';
    (d.filas || []).forEach((f, i) => { if ((f.desde || 0) <= corte) s += filaSVG(f, TOP + i * FILA, d, corte); });
    if (d.rotulo) s += T.rotulo(X0, alto(d) - 10, d.rotulo, { peso: 700, color: d.desapareados ? 'o' : undefined });
    return T.svg(W, alto(d), s, { alt: alt(d) });
  }

  function alt(d) {
    if (d.alt) return d.alt;
    const fs = (d.filas || []).map(f => `${f.nombre}: ${Kit.formatear((f.flechas ? f.flechas.flat().reduce((a, b) => a + b, 0) : f.e || 0) - (f.sale || 0), 0)} electrones en ${f.cajas || (f.flechas || []).length} cajas`);
    return `Diagrama de orbitales: ${fs.join('; ')}${d.rotulo ? `. ${d.rotulo}` : ''}.`;
  }

  return { id: 'quim-cajas', dibujar, alt, llenar, geometria };
});
