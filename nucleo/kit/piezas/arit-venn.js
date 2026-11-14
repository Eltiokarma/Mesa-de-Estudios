/*
 * Pieza «arit-venn» (aritmética; docs/teoria.md, sección 4): dos o tres conjuntos dentro de su universo, con lo que
 * hay en cada zona (elementos o cuántos) y las zonas que cumple una condición punteadas. Sirve para pertenencia,
 * operaciones con conjuntos, conteo con intersección, eventos y probabilidad condicional.
 *
 * Afirmación de la figura: cada zona es una condición de pertenencia; lo de la intersección se cuenta una sola vez.
 *
 * Fidelidad: los aros no codifican tamaños (Venn representa criterios, no cantidades): los tres tienen el mismo
 * radio siempre. La cantidad se lee en el rótulo de cada zona, nunca en el área.
 *
 * datos = {
 *   universo: 'U',                                   // nombre del universo (arriba a la izquierda)
 *   conjuntos: [{ nombre: 'A', color: 'o' }, { nombre: 'B', color: 'i' }, …],   // 2 o 3
 *   regiones: { A: '1, 2', AB: '3', B: '4', '': '5' },   // zona = letras de los conjuntos que la contienen, en orden
 *                                                    // ('' = fuera de todos); valor = texto o { t, paso }
 *   resalta: ['A', 'AB'],                            // zonas punteadas (también por estado)
 *   colorResalta: 'd',
 * }
 * estado = { paso: 0..n (o corte), resalta: [zonas] | undefined, fantasma: null | { resalta: [zonas], rotulo } }
 * El fantasma puntea con trazo hueco las zonas que el error tomaría, sobre las mismas zonas: se comparan en el lugar.
 * El dibujo es una función pura de (datos, estado): sin ids, sin azar, sin reloj.
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
  const W = 320, H = 238, M = 4, PASO_PUNTO = 8;
  const DOS = { r: 74, c: [[124, 124], [196, 124]] };
  const TRES = { r: 64, c: [[128, 100], [192, 100], [160, 156]] };

  function geometria(d) {
    const n = Math.min(3, Math.max(2, (d.conjuntos || []).length));
    const g = n === 3 ? TRES : DOS;
    const nombres = (d.conjuntos || []).slice(0, n).map(c => c.nombre);
    // Zona de un punto: las letras de los aros que lo contienen, en el orden de los conjuntos.
    const zona = (x, y) => g.c.slice(0, n).map((c, k) => ((x - c[0]) ** 2 + (y - c[1]) ** 2 <= g.r * g.r ? nombres[k] : '')).join('');
    // Centro de cada zona: promedio de una rejilla fina de puntos que caen en ella (sale de la geometría, no a ojo).
    const suma = {};
    for (let x = M + 2; x < W - M; x += 3) for (let y = 30; y < H - M; y += 3) {
      const z = zona(x, y);
      if (!z) continue;
      const a = suma[z] || (suma[z] = [0, 0, 0]);
      a[0] += x; a[1] += y; a[2]++;
    }
    const centro = {};
    for (const z in suma) centro[z] = [suma[z][0] / suma[z][2], suma[z][1] / suma[z][2]];
    centro[''] = [W - M - 10, H - M - 10];
    return { n, g, nombres, zona, centro };
  }

  function puntos(geo, zonas, o) {
    const quiere = new Set(zonas || []);
    if (!quiere.size) return '';
    let s = '';
    for (let x = M + 6; x < W - M - 2; x += PASO_PUNTO) for (let y = M + 26; y < H - M - 2; y += PASO_PUNTO) {
      if (!quiere.has(geo.zona(x, y))) continue;
      s += o.hueco
        ? `<circle cx="${x}" cy="${y}" r="2.2" fill="none" stroke="currentColor" stroke-width="1"/>`
        : `<circle cx="${x}" cy="${y}" r="2" fill="${T.color(o.color)}"/>`;
    }
    return `<g class="${o.clase}"${o.hueco ? ' opacity="0.8"' : ''}>${s}</g>`;
  }

  function dibujar(d, estado = {}) {
    const geo = geometria(d);
    const paso = Math.max(0, estado.paso || estado.corte || 0);
    let s = '';
    s += `<rect x="${M}" y="${M}" width="${W - 2 * M}" height="${H - 2 * M}" rx="8" fill="none" stroke="currentColor" stroke-width="${T.GROSOR.contorno}"/>`;
    s += T.rotulo(M + 8, M + 20, d.universo || 'U', { peso: 700 });
    const resalta = estado.resalta !== undefined ? estado.resalta : d.resalta;
    s += puntos(geo, resalta, { color: d.colorResalta || 'd', clase: 'kit-aparece' + (paso > 0 ? ' kit-nuevo' : '') });
    if (estado.fantasma && estado.fantasma.resalta) s += puntos(geo, estado.fantasma.resalta, { hueco: true, clase: 'kit-fantasma' });
    (d.conjuntos || []).slice(0, geo.n).forEach((c, k) => {
      const [cx, cy] = geo.g.c[k];
      s += `<circle cx="${cx}" cy="${cy}" r="${geo.g.r}" fill="none" stroke="${T.color(c.color)}" stroke-width="${T.GROSOR.variable}"/>`;
      // Nombre del aro, afuera y del lado que no tapa a otro aro.
      const lx = geo.n === 3 && k === 2 ? cx + geo.g.r * 0.8 + 6 : k === 0 ? cx - geo.g.r * 0.72 : cx + geo.g.r * 0.72;
      const ly = geo.n === 3 && k === 2 ? cy + geo.g.r * 0.75 : cy - geo.g.r * 0.72 - 4;
      s += T.rotulo(lx, ly, c.nombre, { color: c.color, peso: 700, ancla: k === 0 ? 'end' : 'start' });
    });
    for (const z of Object.keys(d.regiones || {})) {
      const v = d.regiones[z], o = v !== null && typeof v === 'object' ? v : { t: v };
      if ((o.paso || 0) > paso || o.t === undefined || o.t === '') continue;
      const c = geo.centro[z];
      if (!c) continue;
      const nuevo = (o.paso || 0) === paso && paso > 0 ? ' kit-nuevo' : '';
      s += T.rotulo(c[0], c[1] + 6, String(o.t), { ancla: z === '' ? 'end' : 'middle', peso: 700, clase: 'kit-aparece' + nuevo });
    }
    if (estado.fantasma && estado.fantasma.rotulo) s += T.rotulo(W - M - 8, M + 20, estado.fantasma.rotulo, { ancla: 'end', clase: 'kit-fantasma' });
    return T.svg(W, H, s, { alt: alt(d) });
  }

  function alt(d) {
    if (d.alt) return d.alt;
    const nom = (d.conjuntos || []).map(c => c.nombre).join(', ');
    const zs = Object.entries(d.regiones || {}).map(([z, v]) => `${z ? 'zona ' + z.split('').join('∩') : 'fuera de todos'}: ${v !== null && typeof v === 'object' ? v.t : v}`);
    return `Diagrama de Venn de ${nom || 'conjuntos'} en ${d.universo || 'U'}${zs.length ? '; ' + zs.join('; ') : ''}`;
  }

  return { id: 'arit-venn', dibujar, alt, geometria };
});
