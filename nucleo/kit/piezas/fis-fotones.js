/*
 * Pieza «fis-fotones» (física moderna): una lámpara que manda paquetes de luz (fotones) contra una placa de metal y
 * los electrones que salen, cada uno con una flecha de su energía cinética.
 *
 * Afirmación de la figura: el color decide la energía de cada paquete; el brillo, cuántos paquetes llegan. Un
 * electrón sale solo si un paquete le alcanza.
 *
 * Fidelidad: cada fotón se dibuja como un tren de onda corto con la longitud de onda que trae (más corta = más
 * energía); la cantidad de fotones dibujados es proporcional a los que llegan por segundo (de 0 a 12), y el largo de
 * la flecha de cada electrón, a su energía cinética máxima. Las posiciones de los fotones son fijas (sin azar).
 *
 * datos = {
 *   fotones: 0..12,            // cuántos paquetes se dibujan (proporcional al flujo; lo decide quien llama)
 *   onda: 6..30,               // longitud de onda del dibujo de cada paquete, en px
 *   placa: true,               // dibuja la placa (sin ella, el haz llega a un detector)
 *   electrones: 0..6,          // cuántos electrones salen
 *   k: 0..1,                   // energía cinética relativa (largo de la flecha)
 *   rotulos: { foton: 'hf = 2,9 eV', placa: 'φ = 2,3 eV', e: 'Kmax = 0,6 eV', nota: 'no salen electrones' },
 *   colores: { f: 'h', K: 'o', phi: 'i', N: 'd' }
 * }
 * estado = { paso }: 1 fotones · 2 placa · 3 electrones. Sin paso, todo a la vista. Pura.
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
  const W = 320, ALTO = 214, LX = 34, LY = 108, PX = 226;
  const BASE = { f: 'h', K: 'o', phi: 'i', N: 'd' };
  // Lugares fijos de hasta 12 paquetes en el haz (x, y), repartidos sin azar.
  const LUGAR = Array.from({ length: 12 }, (_, i) => [78 + ((i * 37) % 128), 52 + ((i * 53) % 112)]);

  function paquete(x, y, onda, c) {
    const L = 30, A = 5, pts = [];
    for (let k = 0; k <= 30; k++) { const u = k / 30, env = Math.sin(Math.PI * u); pts.push([x - L / 2 + L * u, y - A * env * Math.sin(2 * Math.PI * (L * u) / onda)]); }
    return `<path d="M${pts.map(p => `${T.n(p[0])} ${T.n(p[1])}`).join('L')}" fill="none" stroke="${T.color(c)}" stroke-width="2.5" stroke-linecap="round"/>`
      + `<path d="M${T.n(x + L / 2 + 6)} ${T.n(y)}l-6 -4l0 8z" fill="${T.color(c)}"/>`;
  }

  function dibujar(d, estado = {}) {
    const C = Object.assign({}, BASE, d.colores || {}), R = d.rotulos || {};
    const ve = k => !Number.isFinite(estado.paso) || estado.paso >= k;
    const n = Math.max(0, Math.min(12, Math.round(d.fotones || 0))), onda = Math.max(6, Math.min(30, d.onda || 14));
    let s = '';
    // Lámpara.
    s += `<circle cx="${LX}" cy="${LY}" r="16" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`;
    for (let k = -2; k <= 2; k++) { const a = k * 0.35; s += T.linea(LX + 20 * Math.cos(a), LY + 20 * Math.sin(a), LX + 27 * Math.cos(a), LY + 27 * Math.sin(a), { grosor: 2 }); }
    s += T.rotulo(LX, LY + 36, 'lámpara', { ancla: 'middle' });
    if (ve(1)) {
      for (let i = 0; i < n; i++) s += paquete(LUGAR[i][0], LUGAR[i][1], onda, C.f);
      if (R.foton) s += T.rotulo(LX - 20, 30, R.foton, { color: C.f, peso: 700 });
    }
    if (d.placa !== false && ve(2)) {
      s += `<rect x="${PX}" y="40" width="14" height="136" rx="2" fill="currentColor" fill-opacity="0.22" stroke="currentColor" stroke-width="2"/>`;
      if (R.placa) s += T.rotulo(PX + 7, 196, R.placa, { color: C.phi, peso: 700, ancla: 'middle' });
    } else if (d.placa === false) {
      s += `<rect x="${PX}" y="40" width="14" height="136" rx="2" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4"/>`;
      s += T.rotulo(PX + 7, 196, 'detector', { ancla: 'middle' });
    }
    if (d.placa !== false && ve(3)) {
      const m = Math.max(0, Math.min(6, Math.round(d.electrones || 0))), k = Math.max(0, Math.min(1, d.k || 0));
      for (let i = 0; i < m; i++) {
        const y = 56 + i * 22, x = PX + 26;
        s += `<circle cx="${x}" cy="${y}" r="6" fill="var(--card)" stroke="currentColor" stroke-width="2"/>` + T.linea(x - 3, y, x + 3, y, { grosor: 2 });
        if (k > 0.01) s += T.flecha(x + 8, y, x + 10 + 50 * k, y, { color: C.K, grosor: T.GROSOR.variable });
      }
      if (m && R.e) s += T.rotulo(W - 4, 30, R.e, { color: C.K, peso: 700, ancla: 'end' });
      if (!m && R.nota) s += T.rotulo(W - 4, 30, R.nota, { peso: 700, ancla: 'end' });
    }
    return T.svg(W, ALTO, s, { alt: alt(d) });
  }

  function alt(d) {
    const R = d.rotulos || {};
    return `Lámpara que manda ${Math.round(d.fotones || 0)} paquetes de luz${R.foton ? ` (${R.foton})` : ''} hacia ${d.placa === false ? 'un detector' : `una placa de metal${R.placa ? ` (${R.placa})` : ''}`}`
      + (d.placa === false ? '.' : (d.electrones ? `; salen ${Math.round(d.electrones)} electrones${R.e ? ` con ${R.e}` : ''}.` : '; no sale ningún electrón.'));
  }

  return { id: 'fis-fotones', dibujar, alt, constantes: { W, ALTO } };
});
