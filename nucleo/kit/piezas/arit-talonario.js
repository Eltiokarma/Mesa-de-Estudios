/*
 * Pieza «arit-talonario» (17 nov 2026): el talonario de la rifa pro fondos de la promoción, para la idea 5 de «Sistemas
 * de numeración» (contar cifras por bloques; contenido/teoria/aritmetica/numeracion.js, docs/etapa3/propuesta-aritmetica.md
 * §2). Dibujo de prueba (data-prueba): Gerson decide después si lo reemplaza (docs/plan-calidad.md, M4).
 *
 * Afirmación de la figura: cada boleto lleva su número impreso; un boleto de k cifras gasta k cifras. Los boletos se
 * juntan en bloques (los de una cifra, los de dos, los de tres…) y cada bloque gasta «cuántos boletos por cuántas cifras».
 *
 * Fidelidad: arriba, el talonario con su primer boleto al frente y, al lado, el último boleto: los dos extremos que se
 * cuentan (de a hasta z). Cada cifra impresa va en su casilla (el 200 tiene tres). Abajo, dos barras a la MISMA escala
 * (una cifra = un boleto de ancho): la de boletos y la de cifras; el bloque de tres cifras se estira el triple en la
 * de cifras. Nada se estira para que quepa un rótulo: lo que no cabe adentro va en las líneas de abajo.
 *
 * datos = {
 *   N: 200,                 último boleto (la cantidad: violeta). pide: 'N' lo cambia por «?» en tinta
 *   desde: 1,               primer boleto (por defecto 1)
 *   max: 1100,              escala: cuántas cifras ocupan todo el ancho (fija en el juego; por defecto, las del talonario)
 *   barras: true,           dibuja las barras (false: solo el talonario y el último boleto)
 *   cifras: true,           dibuja la barra de cifras (false: solo la de boletos)
 *   lineas: 'cuenta' | 'rango' | false,   una línea por bloque: «10 a 99: 90 × 2 = 180» o «10 a 99: 90 boletos»
 *   cuenta: true,           en las líneas, el resultado de cada bloque (false: «90 × 2 = ?»)
 *   total: true | '?' | false,   el total de cifras en el rótulo de la barra de cifras (naranja) o «?»
 *   hasta: 2,               cuántos bloques se ven (Mira: los demás quedan como hueco punteado)
 *   impresas: 492,          sin barras: las cifras que cobró la imprenta (cuando se pide el último boleto)
 *   pide: 'N' | null,
 *   pasos: [{ …datos }, …], para «Mira»: estado.paso elige qué cambia
 * }
 * estado = { paso }. Función pura de (datos, estado): sin ids, sin azar, sin reloj. Lienzo de 320 × 280 con las líneas de
 * los bloques; sin ellas, más bajo (hasta donde llega lo dibujado), para que el ejemplo no deje una franja vacía.
 * Colores: tinta (currentColor) y var(--c-*): el último boleto, si se da, en violeta (f); las cifras (casillas, barra de
 * cifras y su total) en naranja (o). Nunca carmín. geometria(datos, estado) da las cajas de todo lo dibujado.
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
  const W = 320, H = 280, M = 4, TAM = 14;
  const X0 = 12, X1 = 308;                        // ancho de las barras
  const B1 = { y: 140, h: 22 }, B2 = { y: 186, h: 22 };   // barra de boletos y barra de cifras
  const L0 = 224, LP = 16;                        // líneas de los bloques: base de la primera y paso
  const n2 = T.n;
  const RELLENO = [0.1, 0.24, 0.4, 0.58];
  const entero = x => Math.max(0, Math.floor(+x || 0));

  // Bloques de a hasta N: los de k cifras van de 10ᵏ⁻¹ a 10ᵏ − 1 (cortado en a y en N).
  function bloques(a, N) {
    const out = [];
    for (let k = 1; 10 ** (k - 1) <= N; k++) {
      const lo = Math.max(a, 10 ** (k - 1)), hi = Math.min(N, 10 ** k - 1);
      if (hi >= lo) out.push({ k, a: lo, z: hi, cuantos: hi - lo + 1, cifras: (hi - lo + 1) * k });
    }
    return out;
  }
  function mezcla(datos, estado) {
    const ps = (datos && datos.pasos) || [];
    const p = ps[Math.max(0, Math.min(ps.length - 1, (estado && estado.paso) | 0))];
    return Object.assign({}, datos || {}, p || {});
  }
  const fmt = x => String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const segsAncho = (segs, tam = TAM) => segs.reduce((a, s) => a + T.ancho(s[0], tam, s[2] || 400), 0);
  function texto(x, y, segs, o = {}) {
    const tam = o.tam || TAM, ancla = o.ancla || 'start';
    const spans = segs.map(([t, c, p]) => `<tspan fill="${T.color(c)}"${p && p !== 400 ? ` font-weight="${p}"` : ''}>${T.esc(t)}</tspan>`).join('');
    return `<text class="kit-txt" x="${n2(x)}" y="${n2(y)}" font-size="${tam}"${ancla !== 'start' ? ` text-anchor="${ancla}"` : ''} style="font-variant-numeric:tabular-nums">${spans}</text>`;
  }

  // ---------- Geometría ----------
  function geometria(datos, estado = {}) {
    const d = mezcla(datos, estado);
    const N = entero(d.N), a = Math.max(1, entero(d.desde) || 1);
    const conBarras = N >= a && d.impresas === undefined && d.pide !== 'N' && d.barras !== false;
    const bl = conBarras ? bloques(a, N) : [];
    const total = bl.reduce((s, x) => s + x.cifras, 0);
    const max = d.max > 0 ? d.max : Math.max(1, total);
    const sx = (X1 - X0) / max;
    const hasta = d.hasta === undefined ? bl.length : Math.max(0, Math.min(bl.length, entero(d.hasta)));
    const objetos = [], textos = [];
    const caja = (que, x0, y0, x1, y1, txt) => (txt === undefined ? objetos : textos).push({ que, txt, x0, y0, x1, y1 });
    // El talonario (frente: el primer boleto) y el último boleto suelto.
    caja('talonario', 10, 10, 160, 104);
    caja('último boleto', 176, 26, 308, 104);
    const tx = (que, x, y, segs, o = {}) => {
      const w = segsAncho(segs, o.tam || TAM), x0 = o.ancla === 'middle' ? x - w / 2 : o.ancla === 'end' ? x - w : x;
      textos.push({ que, txt: segs.map(s => s[0]).join(''), x0, x1: x0 + w, y0: y - (o.tam || TAM) * 0.8, y1: y + (o.tam || TAM) * 0.25 });
      return { x, y, segs, o };
    };
    const rot = [];
    rot.push(tx('rótulo del último', 242, 20, [['último boleto']], { ancla: 'middle' }));
    // Barras.
    const tramos = [];
    if (conBarras) {
      rot.push(tx('rótulo boletos', X0, B1.y - 6, [['boletos']]));
      let x1 = X0, x2 = X0;
      bl.forEach((b, i) => {
        const w1 = b.cuantos * sx, w2 = b.cifras * sx, ve = i < hasta;
        tramos.push({ b, i, ve, x1, w1, x2, w2 });
        x1 += w1; x2 += w2;
      });
      caja('barra de boletos', X0, B1.y, Math.max(X0 + 1, x1), B1.y + B1.h);
      if (d.cifras !== false) {
        const tot = d.total === false ? null : d.total === '?' ? [['?', null, 700]] : (hasta === bl.length ? [[fmt(total), 'o', 700]] : null);
        rot.push(tx('rótulo cifras', X0, B2.y - 6, [['cifras impresas']].concat(tot ? [[': ']].concat(tot) : [])));
        caja('barra de cifras', X0, B2.y, Math.max(X0 + 1, x2), B2.y + B2.h);
      }
      // Líneas de los bloques.
      if (d.lineas) bl.forEach((b, i) => {
        if (i >= hasta) return;
        const segs = [[`${fmt(b.a)} a ${fmt(b.z)}: `, null, 600]];
        if (d.lineas === 'rango') segs.push([`${fmt(b.cuantos)} ${b.cuantos === 1 ? 'boleto' : 'boletos'} de ${b.k} ${b.k === 1 ? 'cifra' : 'cifras'}`]);
        else {
          segs.push([`${fmt(b.cuantos)} × `], [String(b.k), 'o', 700], [' = ']);
          segs.push(d.cuenta === false ? ['?', null, 700] : [fmt(b.cifras), 'o', 700]);
        }
        rot.push(tx(`bloque ${i + 1}`, X0, L0 + i * LP, segs));
      });
    } else if (d.impresas !== undefined) {
      rot.push(tx('impresas', 160, 150, [['La imprenta imprimió '], [fmt(entero(d.impresas)), 'o', 700], [' cifras']], { ancla: 'middle' }));
      rot.push(tx('pregunta', 160, 176, [['desde el boleto '], [fmt(a)], ['. ¿Hasta cuál llegó?']], { ancla: 'middle' }));
    }
    // Alto: el lienzo entero con las líneas de los bloques; sin ellas, se corta donde termina lo dibujado (las figuras de
    // los ejemplos no dejan una franja vacía). Dentro de un juego o de «Mira» las líneas van siempre: el alto no salta.
    const alto = d.lineas && conBarras ? H : conBarras ? (d.cifras === false ? B1.y + B1.h + 12 : B2.y + B2.h + 12) : d.impresas !== undefined ? 192 : 112;
    return { W, H: alto, M, d, N, a, bl, total, max, sx, hasta, tramos, rot, objetos, textos, conBarras };
  }

  // Un número impreso con cada cifra en su casilla (naranja); «?» sin casillas.
  function numero(cx, cy, txt, o = {}) {
    const t = String(txt);
    if (t === '?') return `<text class="kit-txt" x="${n2(cx)}" y="${n2(cy + 8)}" font-size="24" font-weight="700" text-anchor="middle" fill="currentColor">?</text>`;
    const cw = o.cw || 17, ch = o.ch || 24, w = cw * t.length, x0 = cx - w / 2;
    let s = '';
    for (let i = 0; i < t.length; i++) {
      s += `<rect x="${n2(x0 + i * cw + 1)}" y="${n2(cy - ch / 2)}" width="${n2(cw - 2)}" height="${n2(ch)}" rx="3" fill="var(--c-o)" fill-opacity="0.1" stroke="var(--c-o)" stroke-width="1.5"/>`;
      s += `<text class="kit-txt" x="${n2(x0 + i * cw + cw / 2)}" y="${n2(cy + 6.5)}" font-size="${o.tam || 18}" font-weight="700" text-anchor="middle" fill="${T.color(o.color)}" style="font-variant-numeric:tabular-nums">${T.esc(t[i])}</text>`;
    }
    return s;
  }
  // Un boleto: talón a la izquierda (con su número chico), línea punteada y el cuerpo con «Rifa» y el número.
  function boleto(x, y, w, h, num, o = {}) {
    const tal = 34;
    let s = `<rect x="${n2(x)}" y="${n2(y)}" width="${n2(w)}" height="${n2(h)}" rx="4" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`;
    s += `<line x1="${n2(x + tal)}" y1="${n2(y + 3)}" x2="${n2(x + tal)}" y2="${n2(y + h - 3)}" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3"/>`;
    s += `<text class="kit-txt" x="${n2(x + tal / 2)}" y="${n2(y + 16)}" font-size="9" text-anchor="middle" fill="currentColor" fill-opacity="0.75">N.º</text>`;
    s += `<text class="kit-txt" x="${n2(x + tal / 2)}" y="${n2(y + 30)}" font-size="${String(num).length > 3 ? 8 : 10}" text-anchor="middle" fill="currentColor" fill-opacity="0.75">${T.esc(num)}</text>`;
    s += `<text class="kit-txt" x="${n2(x + tal + (w - tal) / 2)}" y="${n2(y + 15)}" font-size="10" font-weight="700" text-anchor="middle" fill="currentColor" letter-spacing="1">RIFA</text>`;
    s += numero(x + tal + (w - tal) / 2, y + h / 2 + 8, num, o);
    return s;
  }

  // ---------- Dibujo ----------
  function dibujar(datos, estado = {}) {
    const g = geometria(datos, estado), d = g.d;
    let s = '';
    // El talonario: tres hojas de atrás asomando y, al frente, el primer boleto.
    for (let k = 3; k >= 1; k--) s += `<rect x="${12 + k * 3}" y="${12 + k * 3}" width="138" height="78" rx="4" fill="var(--card)" stroke="currentColor" stroke-width="1.2" stroke-opacity="${0.35 + 0.1 * (3 - k)}"/>`;
    s += `<rect x="10" y="10" width="140" height="10" rx="2" fill="currentColor" fill-opacity="0.22" stroke="currentColor" stroke-width="1.5"/>`;
    s += boleto(10, 18, 140, 74, String(g.a));
    // El último boleto, recién impreso.
    const ult = d.pide === 'N' || d.N === undefined ? '?' : String(g.N);
    s += boleto(176, 30, 132, 74, ult, { color: ult === '?' ? null : 'f', cw: ult.length > 3 ? 15 : 17, tam: ult.length > 3 ? 16 : 18 });
    // Barras a la misma escala.
    for (const t of g.tramos) {
      const r = RELLENO[Math.min(3, t.b.k - 1)];
      if (t.ve) {
        s += `<rect x="${n2(t.x1)}" y="${B1.y}" width="${n2(t.w1)}" height="${B1.h}" fill="currentColor" fill-opacity="${r}" stroke="currentColor" stroke-width="1.5"/>`;
        if (d.cifras !== false) s += `<rect x="${n2(t.x2)}" y="${B2.y}" width="${n2(t.w2)}" height="${B2.h}" fill="var(--c-o)" fill-opacity="${r}" stroke="var(--c-o)" stroke-width="1.5"/>`;
      } else {
        s += `<rect x="${n2(t.x1)}" y="${B1.y}" width="${n2(t.w1)}" height="${B1.h}" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 4" stroke-opacity="0.6"/>`;
        if (d.cifras !== false) s += `<rect x="${n2(t.x2)}" y="${B2.y}" width="${n2(t.w2)}" height="${B2.h}" fill="none" stroke="var(--c-o)" stroke-width="1.2" stroke-dasharray="4 4" stroke-opacity="0.6"/>`;
      }
    }
    for (const r of g.rot) s += texto(r.x, r.y, r.segs, r.o);
    return T.svg(W, g.H, `<g class="kit-objeto" data-objeto="talonario" data-prueba="si">${s}</g>`, { alt: alt(datos, estado) });
  }

  function alt(datos, estado = {}) {
    const g = geometria(datos, estado), d = g.d;
    let t = `Talonario de una rifa: el primer boleto es el ${g.a}`;
    t += d.pide === 'N' || d.N === undefined ? ' y no se sabe cuál es el último.' : ` y el último, el ${g.N}.`;
    if (g.conBarras) t += ` Abajo, los boletos por bloques (${g.bl.map(b => `${b.a} a ${b.z}, de ${b.k} ${b.k === 1 ? 'cifra' : 'cifras'}`).join('; ')}) y, a la misma escala, las cifras que gasta cada bloque.`;
    if (d.impresas !== undefined) t += ` La imprenta imprimió ${entero(d.impresas)} cifras.`;
    return t;
  }

  // Dónde está el final de la barra de boletos (para arrastrarlo) y qué último boleto da una x.
  const finBarra = datos => { const g = geometria(datos); return { x: X0 + g.bl.reduce((s, b) => s + b.cuantos, 0) * g.sx, y: B1.y + B1.h / 2 }; };
  // Con a = 1 y N ≥ 100, la barra de boletos mide N cifras de ancho: N sale de x sin depender del estado.
  const deX = (datos, x) => { const g = geometria(datos); return g.a - 1 + Math.max(0, (x - X0) / g.sx); };

  return { id: 'arit-talonario', dibujar, alt, geometria, bloques, finBarra, deX, constantes: { W, H, M, X0, X1, B1, B2 } };
});
