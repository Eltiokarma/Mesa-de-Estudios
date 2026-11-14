/*
 * Pieza «quim-celda» (sesión de teoría de Química): una celda electroquímica. La galvánica tiene dos vasos con su
 * electrodo y su disolución, el alambre con un voltímetro arriba y el puente salino; la electrolítica, un solo
 * vaso con dos electrodos y una fuente. Sirve para ánodo y cátodo, el recorrido de los electrones (por el
 * alambre) y de los iones (por la disolución y el puente), fem, electrólisis y Faraday.
 *
 * Afirmación de la figura: los electrones solo viajan por el alambre; dentro del líquido y del puente la carga la
 * llevan iones.
 *
 * Fidelidad: las flechas de electrones van sobre el alambre y en el sentido de los datos; las de iones, solo en el
 * líquido o el puente. Ningún electrón se dibuja dentro de un líquido. Los nombres de los electrodos (ánodo,
 * cátodo) y de los procesos los decide la unidad.
 *
 * datos = {
 *   tipo: 'galvanica' | 'electrolitica',
 *   izq: { electrodo: 'Zn', disolucion: 'Zn²⁺', rol: 'ánodo', proceso: 'oxidación', color: 'h' },
 *   der: { electrodo: 'Cu', disolucion: 'Cu²⁺', rol: 'cátodo', proceso: 'reducción', color: 'i' },
 *   electrones: 'der' | 'izq' | null,        // hacia dónde van por el alambre
 *   iones: true,                             // flechas de cationes y aniones en el puente (o en el líquido)
 *   medidor: '1,10 V',                       // lectura del voltímetro (galvánica) o de la fuente (electrolítica)
 *   desde: { electrones, iones, roles, medidor },   // en qué paso aparece cada cosa (0 por defecto)
 *   alt
 * }
 * estado = { corte }. Alto fijo: 236.
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
  const W = 320, ALTO = 236, YA = 34, YV = 96, HV = 92;

  function dibujar(d, estado = {}) {
    const corte = Math.max(0, estado.corte || 0), dd = d.desde || {};
    const ve = k => (dd[k] || 0) <= corte;
    const nuevo = k => ((dd[k] || 0) === corte && corte > 0 ? ' kit-nuevo kit-aparece' : '');
    const galv = d.tipo !== 'electrolitica';
    const L = d.izq || {}, R = d.der || {};
    let s = '';
    // Vasos y electrodos.
    const vasos = galv ? [[14, 120], [186, 120]] : [[50, 220]];
    for (const [x, w] of vasos) {
      s += `<rect x="${x + 2}" y="${YV + 16}" width="${w - 4}" height="${HV - 18}" fill="currentColor" fill-opacity="0.07"/>`;
      s += `<path d="M${x} ${YV}L${x} ${YV + HV}L${x + w} ${YV + HV}L${x + w} ${YV}" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`;
    }
    const ex = galv ? [50, 270] : [100, 220];
    [L, R].forEach((e, k) => {
      const x = ex[k];
      s += `<rect x="${x - 7}" y="${YA + 22}" width="14" height="${YV + HV - 14 - (YA + 22)}" rx="2" fill="${T.color(e.color)}" fill-opacity="0.35" stroke="${T.color(e.color)}" stroke-width="2"/>`;
      s += T.rotulo(x + (k ? 12 : -12), YV + 34, e.electrodo || '', { ancla: k ? 'start' : 'end', peso: 700, color: e.color });
      if (galv && e.disolucion) s += T.rotulo(k ? 240 : 80, YV + HV - 12, e.disolucion, { ancla: 'middle', peso: 600 });
    });
    if (!galv && (L.disolucion || R.disolucion)) s += T.rotulo(160, YV + HV - 12, L.disolucion || R.disolucion, { ancla: 'middle', peso: 600 });
    // Alambre y medidor (voltímetro o fuente).
    s += `<path d="M${ex[0]} ${YA + 22}L${ex[0]} ${YA}L${ex[1]} ${YA}L${ex[1]} ${YA + 22}" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`;
    if (galv) {
      s += `<circle cx="160" cy="${YA}" r="16" fill="var(--card)" stroke="currentColor" stroke-width="2"/>` + T.rotulo(160, YA + 6, 'V', { ancla: 'middle', peso: 700 });
    } else {
      s += `<rect x="136" y="${YA - 13}" width="48" height="26" fill="var(--card)" stroke="none"/>`;
      s += T.linea(152, YA - 14, 152, YA + 14, { grosor: 3 }) + T.linea(166, YA - 8, 166, YA + 8, { grosor: 3 });
      s += T.rotulo(146, YA + 30, '+', { ancla: 'middle', peso: 700 }) + T.rotulo(173, YA + 30, '−', { ancla: 'middle', peso: 700 });
    }
    if (d.medidor && ve('medidor')) s += `<g class="kit-medidor${nuevo('medidor')}">${T.rotulo(galv ? 160 : 200, galv ? YA + 36 : YA + 30, d.medidor, { ancla: galv ? 'middle' : 'start', peso: 700, color: 'd', clase: 'kit-num' })}</g>`;
    // Puente salino.
    if (galv) s += `<path d="M102 ${YV + 36}L102 ${YV - 8}L218 ${YV - 8}L218 ${YV + 36}" fill="none" stroke="currentColor" stroke-width="12" stroke-opacity="0.18" stroke-linejoin="round"/>`
      + `<path d="M102 ${YV + 36}L102 ${YV - 8}L218 ${YV - 8}L218 ${YV + 36}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.6" stroke-linejoin="round"/>`
      + T.rotulo(160, YV + 12, 'puente', { ancla: 'middle', tam: 14 });
    // Electrones por el alambre.
    if (d.electrones && ve('electrones')) {
      const der = d.electrones === 'der';
      let q = '';
      for (const xm of [ex[0] + 34, ex[1] - 34]) {
        const a = der ? xm - 14 : xm + 14, b = der ? xm + 14 : xm - 14;
        q += T.flecha(a, YA - 10, b, YA - 10, { color: 'i', grosor: 2.5 });
      }
      q += T.rotulo(ex[0] + 34, YA - 18, 'e⁻', { ancla: 'middle', color: 'i', peso: 700 }) + T.rotulo(ex[1] - 34, YA - 18, 'e⁻', { ancla: 'middle', color: 'i', peso: 700 });
      s += `<g class="kit-electrones${nuevo('electrones')}">${q}</g>`;
    }
    // Iones: en el puente (galvánica) o en el líquido (electrolítica). Los cationes van hacia el cátodo.
    if (d.iones && ve('iones')) {
      const catDer = (R.rol || '').startsWith('cát');
      let q = '';
      if (galv) {
        q += T.flecha(catDer ? 136 : 184, YV - 22, catDer ? 184 : 136, YV - 22, { color: 'o', grosor: 2 }) + T.rotulo(catDer ? 130 : 190, YV - 17, '+', { ancla: catDer ? 'end' : 'start', color: 'o', peso: 700 });
        q += T.flecha(catDer ? 184 : 136, YV + 26, catDer ? 136 : 184, YV + 26, { color: 'd', grosor: 2 }) + T.rotulo(catDer ? 190 : 130, YV + 31, '−', { ancla: catDer ? 'start' : 'end', color: 'd', peso: 700 });
      } else {
        q += T.flecha(catDer ? 130 : 190, YV + 34, catDer ? 190 : 130, YV + 34, { color: 'o', grosor: 2 }) + T.rotulo(catDer ? 124 : 196, YV + 39, '+', { ancla: catDer ? 'end' : 'start', color: 'o', peso: 700 });
        q += T.flecha(catDer ? 190 : 130, YV + 52, catDer ? 130 : 190, YV + 52, { color: 'd', grosor: 2 }) + T.rotulo(catDer ? 196 : 124, YV + 57, '−', { ancla: catDer ? 'start' : 'end', color: 'd', peso: 700 });
      }
      s += `<g class="kit-iones${nuevo('iones')}">${q}</g>`;
    }
    // Roles bajo cada electrodo.
    if (ve('roles')) {
      let q = '';
      [L, R].forEach((e, k) => {
        const x = galv ? (k ? 246 : 74) : (k ? 250 : 70);
        if (e.rol) q += T.rotulo(x, YV + HV + 20, e.rol, { ancla: 'middle', peso: 700, color: e.color });
        if (e.proceso) q += T.rotulo(x, YV + HV + 38, e.proceso, { ancla: 'middle', tam: 14 });
      });
      s += `<g class="kit-roles${nuevo('roles')}">${q}</g>`;
    }
    return T.svg(W, ALTO, s, { alt: alt(d) });
  }

  function alt(d) {
    if (d.alt) return d.alt;
    const L = d.izq || {}, R = d.der || {};
    const tipo = d.tipo === 'electrolitica' ? 'Celda electrolítica con fuente' : 'Celda galvánica con voltímetro y puente salino';
    return `${tipo}: electrodo de ${L.electrodo || '?'} (${L.rol || 'sin rol'}) a la izquierda y de ${R.electrodo || '?'} (${R.rol || 'sin rol'}) a la derecha${d.electrones ? `; los electrones van por el alambre hacia la ${d.electrones === 'der' ? 'derecha' : 'izquierda'}` : ''}${d.iones ? '; los iones llevan la carga dentro del líquido' : ''}${d.medidor ? `; lectura ${d.medidor}` : ''}.`;
  }

  return { id: 'quim-celda', dibujar, alt };
});
