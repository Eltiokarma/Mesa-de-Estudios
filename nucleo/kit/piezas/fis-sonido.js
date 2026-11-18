/*
 * Pieza «fis-sonido» (18 nov 2026, Movimiento rectilíneo uniforme, idea 1; docs/etapa4/propuesta-fisica.md §1, A1):
 * el sonido que viaja en línea recta con rapidez constante. Dos objetos, dibujos de prueba (data-prueba); Gerson decide
 * después cuáles reemplaza (docs/plan-calidad.md, M4).
 *
 * datos = { objeto, v: '340 m/s', t: '3 s', distancia: 'D = ?', color: 'o', colorT: 'i', colorD }
 *   eco     una alumna grita frente a un cerro: el sonido va hasta el cerro y vuelve. Afirmación: el eco hace el camino
 *           dos veces, ida y vuelta, a la misma rapidez.
 *   trueno  un rayo cae lejos de una persona: la luz llega casi al instante y el sonido tarda. Afirmación: el sonido
 *           recorre la distancia una sola vez, y eso es lo que tarda.
 *   v: la rapidez del sonido, escrita sobre su flecha (color, naranja: es una velocidad).
 *   t: lo que se tarda en oír, escrito junto a quien oye (colorT, turquesa: es un tiempo). Sin t, no se escribe.
 *   distancia: el rótulo de la distancia acotada abajo. Si es lo que se pide, «D = ?» en tinta (sin colorD).
 * estado = {} (sin pasos). Función pura de (datos, estado): sin ids, sin azar, sin reloj. Ancho 320, alto fijo.
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
  const W = 320, H = 196, SUELO = 150, COTA = 166, TXT = 14;
  const n = T.n;
  const BASE = { objeto: 'eco', v: '340 m/s', t: '', distancia: 'D = ?', color: 'o', colorT: 'i', colorD: undefined };
  const conBase = d => Object.assign({}, BASE, d || {});
  // Caja de un rótulo (y = línea base), encajado en el lienzo con 4 de margen.
  const caja = (x, y, texto, ancla, peso = 700) => {
    const w = T.ancho(texto, TXT, peso), xx = T.encajar(x, texto, ancla, { tam: TXT, peso, min: 4, max: W - 4 });
    const izq = ancla === 'middle' ? xx - w / 2 : ancla === 'end' ? xx - w : xx;
    return { x0: izq, x1: izq + w, y0: y - TXT * 0.78, y1: y + TXT * 0.22, x: xx, y, texto, ancla, peso };
  };
  const rot = (b, color) => T.rotulo(b.x, b.y, b.texto, { ancla: b.ancla, peso: b.peso, color, tam: TXT, min: 4, max: W - 4 });

  // Una persona de pie (palitos con cabeza), con los pies en el suelo en x; mano a la boca si grita.
  function persona(x, grita) {
    const cab = SUELO - 50;
    let s = `<circle cx="${n(x)}" cy="${n(cab)}" r="8" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`
      + `<path d="M${n(x)} ${n(cab + 8)}L${n(x)} ${n(SUELO - 18)}M${n(x)} ${n(SUELO - 18)}L${n(x - 8)} ${SUELO}M${n(x)} ${n(SUELO - 18)}L${n(x + 8)} ${SUELO}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    s += grita ? `<path d="M${n(x)} ${n(cab + 14)}L${n(x + 9)} ${n(cab + 6)}L${n(x + 11)} ${n(cab + 1)}M${n(x)} ${n(cab + 14)}L${n(x - 8)} ${n(cab + 26)}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`
      : `<path d="M${n(x)} ${n(cab + 14)}L${n(x - 8)} ${n(cab + 28)}M${n(x)} ${n(cab + 14)}L${n(x + 8)} ${n(cab + 28)}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>`;
    return `<g class="kit-objeto" data-objeto="persona" data-prueba="si">${s}</g>`;
  }

  // Todo lo que se dibuja, con números (lo usan dibujar y las pruebas de encuadre y choques).
  function geometria(datos) {
    const d = conBase(datos), g = { d, rotulos: [], flechas: [] };
    if (d.objeto === 'trueno') {
      g.rayo = 64; g.oye = 268;
      g.flechas.push({ x1: g.rayo + 14, x2: g.oye - 16, y: 112 });
      g.rotulos.push(caja((g.rayo + g.oye) / 2, 102, d.v, 'middle'));
      if (d.t) g.rotulos.push(caja(g.oye, 70, `oye a los ${d.t}`, 'middle', 400));
      g.cota = { a: g.rayo, b: g.oye };
    } else {
      g.grita = 42; g.cerro = 236;
      // la ladera del cerro: de su pie (cerro − 6, en el suelo) a la primera cima (266, 72)
      const ladera = y => g.cerro - 6 + (SUELO - y) / (SUELO - 72) * (266 - (g.cerro - 6));
      g.flechas.push({ x1: g.grita + 16, x2: ladera(104) - 3, y: 104 }, { x1: ladera(126) - 3, x2: g.grita + 16, y: 126 });
      g.rotulos.push(caja((g.grita + g.cerro) / 2, 94, `ida: ${d.v}`, 'middle'), caja((g.grita + g.cerro) / 2, 142, 'vuelta', 'middle', 400));
      if (d.t) g.rotulos.push(caja(g.grita - 8, 58, `oye el eco a los ${d.t}`, 'start', 400));
      g.cota = { a: g.grita, b: g.cerro };
    }
    if (d.distancia) g.rotulos.push(caja((g.cota.a + g.cota.b) / 2, COTA + 22, d.distancia, 'middle'));
    return g;
  }

  function dibujar(datos) {
    const g = geometria(datos), d = g.d, c = T.color(d.color);
    let s = `<line x1="6" y1="${SUELO}" x2="${W - 6}" y2="${SUELO}" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    if (d.objeto === 'trueno') {
      // la nube y el rayo que llega al suelo (lejos), y quien oye (cerca de la derecha)
      s += `<g class="kit-objeto" data-objeto="rayo" data-prueba="si"><path d="M22 52Q22 34 40 36Q46 20 66 26Q82 16 94 32Q112 32 110 50Q110 60 96 60H34Q22 60 22 52Z" fill="currentColor" fill-opacity="0.14" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`
        + `<path d="M62 60L54 98L66 98L58 ${SUELO - 2}L80 92L68 92L76 60Z" fill="currentColor" fill-opacity="0.85" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></g>`;
      s += persona(g.oye, false);
    } else {
      // la alumna que grita y el cerro (dibujos de prueba)
      s += persona(g.grita, true);
      s += `<g class="kit-objeto" data-objeto="cerro" data-prueba="si"><path d="M${g.cerro - 6} ${SUELO}L266 72L282 92L300 56L316 ${SUELO}Z" fill="currentColor" fill-opacity="0.12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></g>`;
    }
    for (const f of g.flechas) s += T.flecha(f.x1, f.y, f.x2, f.y, { color: d.color, grosor: 3 });
    const [r0, ...resto] = g.rotulos;
    s += rot(r0, d.color);
    for (const r of resto) s += rot(r, r.texto === d.distancia ? d.colorD : undefined);
    // el tiempo, en su color, dentro de su rótulo («oye … a los 3 s»): se reescribe solo la cifra con su unidad
    if (d.t) {
      const r = g.rotulos.find(x => /^oye/.test(x.texto));
      s = s.replace(`>${T.esc(r.texto)}</text>`, `>${T.esc(r.texto.slice(0, -d.t.length))}<tspan fill="${T.color(d.colorT)}" font-weight="700">${T.esc(d.t)}</tspan></text>`);
    }
    // la distancia, acotada bajo el suelo
    s += `<path d="M${n(g.cota.a)} ${COTA - 6}V${COTA}H${n(g.cota.b)}V${COTA - 6}" fill="none" stroke="${T.color(d.colorD)}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
    return T.svg(W, H, s, { alt: alt(d) });
  }

  function alt(datos) {
    const d = conBase(datos);
    return d.objeto === 'trueno'
      ? `Un rayo cae lejos de una persona. El sonido del trueno viaja hasta ella a ${d.v}${d.t ? ` y lo oye a los ${d.t}` : ''}. Abajo, la distancia entre los dos: ${d.distancia}.`
      : `Una alumna grita frente a un cerro. El sonido va hasta el cerro y vuelve a ${d.v}${d.t ? `; oye el eco a los ${d.t}` : ''}. Abajo, la distancia hasta el cerro: ${d.distancia}.`;
  }

  return { id: 'fis-sonido', dibujar, alt, geometria, constantes: { W, H, SUELO, COTA } };
});
