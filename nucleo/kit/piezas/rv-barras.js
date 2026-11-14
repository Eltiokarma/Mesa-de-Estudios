/*
 * Pieza «rv-barras» (razonamiento verbal: textos discontinuos e infografías). Un gráfico de barras horizontales con
 * su título, un párrafo opcional (infografía: texto e imagen juntos), la escala y la fuente. Lo que cambia es dónde
 * empieza la escala y qué barras o partes se marcan.
 *
 * Afirmación de la figura: el largo de la barra solo es fiel al dato si la escala empieza en cero.
 *
 * datos = {
 *   titulo: 'Venta de quinua (toneladas)',
 *   texto: 'Párrafo corto de la infografía…',     // opcional; se parte en renglones aquí
 *   barras: [{ id: 'a', nombre: 'Puno', valor: 82 }, …],   // de 2 a 6
 *   min: 0, max: 100,                             // la escala; si min > 0, se dibuja el corte del eje
 *   decimales: 0, unidad: ' t',                   // cómo se escriben los valores
 *   fuente: 'Datos inventados para el ejercicio', // opcional, al pie
 * }
 * estado = {
 *   marcas: { a: 'i' },          // barra marcada (contorno de 3 px y relleno más fuerte); el resto, tinta tenue
 *   texto: 'i' | 'h',            // marca el párrafo; titulo: 'i' | 'h' marca el título
 *   valores: true,               // escribe el valor al final de cada barra (por defecto sí)
 *   nuevo: ['a'],                // se anima al avanzar un paso de «Mira»
 * }
 * Los valores los trae quien llama (regla 1); la pieza solo convierte valores a píxeles. Alto fijo por datos.
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
  const W = 320, PAD = 8, NOM = 92, BAR = 22, PASO = 34, LH = 22, COLORES = ['i', 'o', 'd', 'h'];

  // Parte un párrafo en renglones que caben en `ancho` (la medida del kit).
  function renglones(texto, ancho) {
    const out = []; let r = '';
    for (const p of String(texto || '').split(/\s+/).filter(Boolean)) {
      const prueba = r ? `${r} ${p}` : p;
      if (T.ancho(prueba, 16) > ancho && r) { out.push(r); r = p; } else r = prueba;
    }
    if (r) out.push(r);
    return out;
  }

  function disponer(d) {
    let y = PAD + 16;
    const tit = { y };
    y += 10;
    const lineas = renglones(d.texto, W - 2 * PAD);
    const txt = lineas.map(t => { y += LH; return { y, t }; });
    if (lineas.length) y += 10;
    const x0 = PAD + NOM, x1 = W - PAD - 52;
    const top = y + 8;
    const barras = (d.barras || []).map((b, k) => ({ b, y: top + k * PASO }));
    const ejeY = top + barras.length * PASO;
    return { tit, txt, x0, x1, barras, ejeY, alto: ejeY + 28 + (d.fuente ? 20 : 0) };
  }

  const escala = (d, L, v) => {
    const min = Number.isFinite(d.min) ? d.min : 0, max = d.max > min ? d.max : min + 1;
    return L.x0 + (L.x1 - L.x0) * (Math.min(max, Math.max(min, v)) - min) / (max - min);
  };

  function dibujar(d, estado = {}) {
    const L = disponer(d), marcas = estado.marcas || {}, nuevo = new Set(estado.nuevo || []);
    const fmt = v => `${Kit.formatear(v, d.decimales || 0)}${d.unidad || ''}`;
    let s = '';
    const fondoTxt = (y0, h, c) => (COLORES.includes(c) ? T.resaltado(PAD - 2, y0, W - 2 * PAD + 4, h, { color: c }) : '');
    s += fondoTxt(L.tit.y - 16, 22, estado.titulo);
    s += T.rotulo(PAD, L.tit.y, d.titulo || '', { peso: 700 });
    if (L.txt.length) s += fondoTxt(L.txt[0].y - 16, L.txt.length * LH + 4, estado.texto);
    for (const r of L.txt) s += T.rotulo(PAD, r.y, r.t, {});
    for (const { b, y } of L.barras) {
      const c = COLORES.includes(marcas[b.id]) ? marcas[b.id] : null, x = escala(d, L, b.valor), cl = nuevo.has(b.id) ? ' kit-nuevo kit-aparece' : '';
      s += T.rotulo(L.x0 - 8, y + 16, b.nombre, { ancla: 'end', min: PAD, peso: c ? 700 : 400 });
      s += `<rect class="rv-barra${cl}" x="${T.n(L.x0)}" y="${T.n(y)}" width="${T.n(Math.max(2, x - L.x0))}" height="${BAR}" rx="3" fill="${T.color(c)}" fill-opacity="${c ? 0.3 : 0.12}" stroke="${T.color(c)}" stroke-width="${c ? T.GROSOR.variable : T.GROSOR.contorno}"${c ? '' : ' stroke-opacity="0.55"'}/>`;
      if (estado.valores !== false) s += T.rotulo(x + 6, y + 16, fmt(b.valor), { peso: 700, color: c, max: W - 2 });
    }
    // Eje: línea base, valores mínimo y máximo, y el corte si la escala no empieza en cero.
    s += T.linea(L.x0, L.barras.length ? L.barras[0].y - 6 : L.ejeY, L.x0, L.ejeY, { grosor: T.GROSOR.contorno });
    s += T.linea(L.x0, L.ejeY, L.x1, L.ejeY, { grosor: T.GROSOR.cuadricula });
    s += T.rotulo(L.x0, L.ejeY + 20, fmt(Number.isFinite(d.min) ? d.min : 0), { ancla: 'middle', peso: d.min > 0 ? 700 : 400, color: d.min > 0 ? 'h' : null });
    s += T.rotulo(L.x1, L.ejeY + 20, fmt(d.max), { ancla: 'middle' });
    if (d.min > 0) s += `<path class="rv-corte" d="M${T.n(L.x0 - 6)} ${T.n(L.ejeY + 2)}l4 -6l4 6l4 -6" fill="none" stroke="${T.color('h')}" stroke-width="${T.GROSOR.contorno}" stroke-linecap="round" stroke-linejoin="round"/>`;
    if (d.fuente) s += `<text class="kit-txt" x="${PAD}" y="${T.n(L.ejeY + 42)}" fill="currentColor" font-size="14" opacity="0.75">${T.esc(d.fuente)}</text>`;
    return T.svg(W, L.alto, s, { alt: alt(d), clase: 'rv-barras' });
  }

  function alt(d) {
    const fmt = v => `${Kit.formatear(v, d.decimales || 0)}${d.unidad || ''}`;
    const bs = (d.barras || []).map(b => `${b.nombre}: ${fmt(b.valor)}`).join('; ');
    return `Gráfico de barras «${d.titulo || ''}». ${d.texto ? `Texto: ${d.texto} ` : ''}Datos: ${bs}. La escala va de ${fmt(Number.isFinite(d.min) ? d.min : 0)} a ${fmt(d.max)}${d.min > 0 ? ', no empieza en cero' : ''}.`;
  }

  return { id: 'rv-barras', dibujar, alt, disponer, escala, constantes: { W, PAD } };
});
