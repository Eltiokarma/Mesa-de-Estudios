/*
 * Pieza «arit-arbol» (19 nov 2026): el árbol de cortes de doña Juana, para «Números primos y divisores»
 * (contenido/teoria/aritmetica/numeros-primos-y-divisores.js, ideas 3 y 4; docs/etapa6/propuesta-aritmetica.md §2).
 * Dibujo de prueba (data-prueba): Gerson decide después si lo reemplaza (docs/plan-calidad.md, M4).
 *
 * Afirmación de la figura: un pedido de N caramelos se parte en partes iguales, y cada parte otra vez, hasta que ninguna
 * se pueda partir: las hojas son primos, y su producto es N. Se empiece por donde se empiece, las hojas son las mismas.
 *
 * Fidelidad: cada corte escribe sus dos partes, y el producto de las dos es lo de arriba (la prueba lo comprueba). Las
 * hojas que son primos llevan aro; una parte que no es primo y no se partió se ve sin aro. Un corte que no es exacto se
 * dibuja con lo que sobra, en naranja punteado, y no tiene hijos.
 *
 * datos = {
 *   arboles: [nodo, …],          uno o dos árboles, lado a lado; nodo = { n, hijos?: [nodo, nodo], sobra?: { d, r } }
 *   profundidad: 2,              opcional: solo se dibujan los niveles hasta ese (0 = solo las raíces)
 *   colorHojas: true,            las hojas primas en turquesa (i: son los divisores primos); false, en tinta
 *   pies: [[[texto, color?, peso?], …], …],   una línea bajo cada árbol («8 = 2 × 2 × 2»)
 *   letrero, pie: [[texto, color?, peso?], …],   una línea arriba y otra abajo de todo
 *   alto: 250,                   alto fijo (el juego no salta); sin alto, el que haga falta
 *   pasos: [{ …datos }, …],      para «Mira»: estado.paso elige qué cambia (se mezcla con los datos)
 * }
 * estado = { paso }. Función pura de (datos, estado): sin ids, sin azar, sin reloj. Lienzo de 320 de ancho.
 * Colores: tinta (currentColor) y var(--c-*): las hojas primas en turquesa, con aro (i); lo que sobra de un corte que no
 * cierra, en naranja punteado (o); en letrero y pies, lo que los datos pidan. Nunca carmín ni verde.
 * geometria(datos, estado) da las cajas de todo lo dibujado, para la prueba numérica de encuadre.
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
  const W = 320, M = 4, TAM = 15, TAMR = 14, X0 = 8, X1 = 312, FILA = 44, LIN = 22, SEP = 16;
  const n2 = T.n;
  const esPrimo = x => { if (x < 2) return false; for (let k = 2; k * k <= x; k++) if (x % k === 0) return false; return true; };

  function mezcla(datos, estado) {
    const ps = (datos && datos.pasos) || [];
    const p = ps[Math.max(0, Math.min(ps.length - 1, (estado && estado.paso) | 0))];
    return Object.assign({}, datos || {}, p || {});
  }
  const segsAncho = (segs, tam = TAMR) => segs.reduce((a, s) => a + T.ancho(s[0], tam, s[2] || 400), 0);
  const segsDe = x => (typeof x === 'string' ? [[x]] : Array.isArray(x) ? x : null);
  function texto(x, y, segs, o = {}) {
    const tam = o.tam || TAMR, ancla = o.ancla || 'start';
    const spans = segs.map(([t, c, p]) => `<tspan fill="${T.color(c)}"${p && p !== 400 ? ` font-weight="${p}"` : ''}>${T.esc(t)}</tspan>`).join('');
    return `<text class="kit-txt" x="${n2(x)}" y="${n2(y)}" font-size="${tam}"${ancla !== 'start' ? ` text-anchor="${ancla}"` : ''} style="font-variant-numeric:tabular-nums">${spans}</text>`;
  }
  const hojasDe = (nd, prof, k = 0) => (nd.hijos && (prof === undefined || k < prof) ? nd.hijos.flatMap(h => hojasDe(h, prof, k + 1)) : [nd]);
  const hondo = (nd, prof, k = 0) => (nd.hijos && (prof === undefined || k < prof) ? Math.max(...nd.hijos.map(h => hondo(h, prof, k + 1))) : k);

  // ---------- Geometría ----------
  function geometria(datos, estado = {}) {
    const d = mezcla(datos, estado);
    const arboles = (d.arboles || []).filter(Boolean).slice(0, 2);
    const prof = Number.isInteger(d.profundidad) ? d.profundidad : undefined;
    const pies = (d.pies || []).map(segsDe);
    const letrero = segsDe(d.letrero), pie = segsDe(d.pie);
    const conPie = !!(datos && (datos.pie !== undefined || (datos.pasos || []).some(p => p && p.pie !== undefined)));
    const conLetrero = !!(datos && (datos.letrero !== undefined || (datos.pasos || []).some(p => p && p.letrero !== undefined)));
    const conPies = !!(datos && (datos.pies !== undefined || (datos.pasos || []).some(p => p && p.pies !== undefined)));
    const nA = Math.max(1, arboles.length), ancho = (X1 - X0 - SEP * (nA - 1)) / nA;
    const yA = M + (conLetrero ? LIN : 0) + 18;
    const nodos = [], aristas = [], textos = [], objetos = [], rot = [];
    const tx = (que, x, y, segs, o = {}) => {
      const w = segsAncho(segs, o.tam || TAMR), xa = o.ancla === 'middle' ? x - w / 2 : x;
      textos.push({ que, txt: segs.map(z => z[0]).join(''), x0: xa, x1: xa + w, y0: y - (o.tam || TAMR) * 0.8, y1: y + (o.tam || TAMR) * 0.25 });
      rot.push({ x, y, segs, o });
    };
    if (letrero) tx('letrero', X0, M + 15, letrero);
    let profMax = 0;
    arboles.forEach((a, ia) => {
      const x0 = X0 + ia * (ancho + SEP), hs = hojasDe(a, prof), paso = ancho / Math.max(1, hs.length);
      profMax = Math.max(profMax, hondo(a, prof) + (a.sobra || hasSobra(a, prof) ? 1 : 0));
      let i = 0;
      const ubicar = (nd, k) => {
        const abierto = nd.hijos && (prof === undefined || k < prof);
        let x, hijos = [];
        if (abierto) { hijos = nd.hijos.map(h => ubicar(h, k + 1)); x = (hijos[0].x + hijos[1].x) / 2; } else { x = x0 + paso * (i + 0.5); i++; }
        const y = yA + k * FILA, t = String(nd.n), w = T.ancho(t, TAM, 700) + 6;
        const hoja = !abierto, primo = hoja && esPrimo(nd.n) && !(nd.hijos && !abierto);
        nodos.push({ n: nd.n, x, y, hoja, primo, abierto, k, arbol: ia, sobra: hoja && nd.sobra ? nd.sobra : null });
        objetos.push({ que: `nodo ${nd.n} (árbol ${ia + 1}, nivel ${k})`, x0: x - Math.max(w, 26) / 2, y0: y - 13, x1: x + Math.max(w, 26) / 2, y1: y + 13 });
        for (const h of hijos) aristas.push({ de: { x, y }, a: h });
        if (hoja && nd.sobra) tx(`sobra de ${nd.n}`, x, y + 32, [['÷ '], [String(nd.sobra.d), 'i', 700], [': sobra '], [String(nd.sobra.r), 'o', 700]], { ancla: 'middle' });
        return { x, y };
      };
      ubicar(a, 0);
    });
    const yFin = yA + profMax * FILA + 14;
    let yPies = yFin;
    if (conPies) { yPies = yFin + 20; arboles.forEach((a, ia) => { const s = pies[ia]; if (s) tx(`pie del árbol ${ia + 1}`, X0 + ia * (ancho + SEP) + ancho / 2, yPies, s, { ancla: 'middle' }); }); }
    const alto = d.alto ? Math.max(80, +d.alto) : null;
    if (pie) tx('pie', X0, alto ? alto - M - 6 : yPies + 24, pie);
    const H = Math.round(alto || ((conPie ? yPies + 24 : yPies) + 10 + M));
    return { W, H, M, d, nodos, aristas, objetos, textos, rot, arboles };
  }
  function hasSobra(nd, prof, k = 0) { return nd.sobra ? true : nd.hijos && (prof === undefined || k < prof) ? nd.hijos.some(h => hasSobra(h, prof, k + 1)) : false; }

  // ---------- Dibujo ----------
  function dibujar(datos, estado = {}) {
    const g = geometria(datos, estado), colorHojas = g.d.colorHojas !== false;
    let s = '';
    for (const ar of g.aristas) s += `<path d="M${n2(ar.de.x)} ${n2(ar.de.y + 12)}L${n2(ar.a.x)} ${n2(ar.a.y - 13)}" stroke="currentColor" stroke-width="1.4" stroke-opacity="0.7" stroke-linecap="round"/>`;
    for (const nd of g.nodos) {
      if (nd.primo) {
        const c = colorHojas ? 'var(--c-i)' : 'currentColor';
        s += `<circle class="ar-primo" cx="${n2(nd.x)}" cy="${n2(nd.y)}" r="${n2(Math.max(13, T.ancho(String(nd.n), TAM, 700) / 2 + 5))}" fill="${c}" fill-opacity="0.14" stroke="${c}" stroke-width="2"/>`;
      }
      if (nd.sobra) s += `<path class="ar-sobra" d="M${n2(nd.x - 10)} ${n2(nd.y + 15)}L${n2(nd.x + 10)} ${n2(nd.y + 15)}" stroke="var(--c-o)" stroke-width="2" stroke-dasharray="3 2"/>`;
      const fill = nd.primo && colorHojas ? 'var(--c-i)' : 'currentColor';
      s += `<text class="kit-txt" x="${n2(nd.x)}" y="${n2(nd.y + TAM * 0.36)}" font-size="${TAM}" text-anchor="middle" font-weight="${nd.primo ? 700 : 600}" fill="${fill}" style="font-variant-numeric:tabular-nums">${T.esc(String(nd.n))}</text>`;
    }
    for (const r of g.rot) s += texto(r.x, r.y, r.segs, r.o);
    return T.svg(W, g.H, `<g class="kit-objeto" data-objeto="arbol" data-prueba="si">${s}</g>`, { alt: alt(datos, estado) });
  }

  function alt(datos, estado = {}) {
    const g = geometria(datos, estado);
    if (!g.arboles.length) return 'Árbol de cortes vacío.';
    return g.arboles.map((a, ia) => {
      const hs = g.nodos.filter(z => z.arbol === ia && z.hoja);
      const primos = hs.filter(z => z.primo).map(z => z.n), otros = hs.filter(z => !z.primo).map(z => z.n);
      if (hs.length === 1 && !g.nodos.some(z => z.arbol === ia && z.abierto)) return `${a.n}, todavía sin partir${hs[0].sobra ? `: al partirlo en ${hs[0].sobra.d} sobran ${hs[0].sobra.r}` : ''}.`;
      return `${a.n} partido en cortes hasta llegar a ${primos.length ? `los primos ${primos.join(', ')}` : 'ningún primo'}${otros.length ? ` y sin partir ${otros.join(', ')}` : ''}.`;
    }).join(' ');
  }

  // Un árbol listo: N partido primero en d × (N ÷ d), y cada parte por su menor primo. Si d no divide a N, el corte no
  // cierra y queda lo que sobra.
  function arbol(N, d) {
    const parte = x => { if (esPrimo(x) || x < 2) return { n: x }; let p = 2; while (x % p) p++; return { n: x, hijos: [{ n: p }, parte(x / p)] }; };
    if (!d) return parte(N);
    if (N % d) return { n: N, sobra: { d, r: N % d } };
    return { n: N, hijos: [parte(d), parte(N / d)] };
  }

  return { id: 'arit-arbol', dibujar, alt, geometria, arbol, constantes: { W, M, X0, X1 } };
});
