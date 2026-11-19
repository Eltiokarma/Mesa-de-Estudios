/*
 * Pieza «arit-boleto» (19 nov 2026): un boleto de la rifa de la promoción visto de cerca, con cada cifra de su número en
 * una casilla, para la idea «Criterios del 11, 7 y 13» de «Divisibilidad» (contenido/teoria/aritmetica/divisibilidad.js;
 * docs/etapa5/propuesta-aritmetica.md §2). Dibujo de prueba (data-prueba): Gerson decide después si lo reemplaza.
 *
 * Afirmación de la figura: cada cifra del número ocupa un lugar, y cada lugar tiene su peso; una cifra borrada es una
 * casilla que hay que llenar para que el boleto gane.
 *
 * Fidelidad: una casilla por cifra, todas iguales y en el orden en que se lee el número; el peso de cada lugar va justo
 * debajo de su casilla. Nada se escribe en la casilla borrada si los datos no lo dan.
 *
 * datos = {
 *   cifras: '4?73',             el número del boleto; «?» es la cifra borrada (una mancha de lluvia con su «?»)
 *   hallada: { 1: '8' },        casilla (desde la izquierda, 0 = la primera) → la cifra que se halló: va en violeta
 *   pesos: ['−1', '+1', '−1', '+1'],   el peso de cada lugar, debajo de su casilla (naranja: es un resto)
 *   letrero: [[texto, color?, peso?], …],   el cartel («Gana si es múltiplo de 11»)
 *   pie: [[texto, color?, peso?], …],       una línea bajo el boleto (la cuenta)
 *   pasos: [{ …datos }, …],     para «Mira»: estado.paso elige qué cambia
 * }
 * estado = { paso }. Función pura. Lienzo de 320 de ancho; el alto reserva los pesos y el pie si los datos o algún paso
 * los traen (no salta). Colores: tinta y var(--c-*): los pesos en naranja (o), la cifra hallada en violeta (f), lo que
 * pidan el letrero y el pie. Nunca carmín ni verde. geometria(datos, estado) da las cajas de lo dibujado.
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
  const W = 320, M = 4, TAM = 13, n2 = T.n;
  const LET = { y0: 6, y1: 30, base: 23 };
  const BOL = { x0: 22, x1: 298, y0: 40, y1: 114, talon: 62 };   // el boleto y su talón
  const CASILLA = { w: 36, h: 46, sep: 6 };
  const mezcla = (datos, estado) => { const ps = (datos && datos.pasos) || []; return Object.assign({}, datos || {}, ps[Math.max(0, Math.min(ps.length - 1, (estado && estado.paso) | 0))] || {}); };
  const segsDe = x => (typeof x === 'string' ? [[x]] : Array.isArray(x) ? x : null);
  const segsAncho = (segs, tam = TAM) => segs.reduce((a, s) => a + T.ancho(s[0], tam, s[2] || 400), 0);
  const texto = (x, y, segs, o = {}) => `<text class="kit-txt" x="${n2(x)}" y="${n2(y)}" font-size="${o.tam || TAM}"${o.ancla ? ` text-anchor="${o.ancla}"` : ''} style="font-variant-numeric:tabular-nums">`
    + segs.map(([t, c, p]) => `<tspan fill="${T.color(c)}"${p && p !== 400 ? ` font-weight="${p}"` : ''}>${T.esc(t)}</tspan>`).join('') + '</text>';
  const tiene = (datos, k) => !!(datos && (datos[k] !== undefined || (datos.pasos || []).some(p => p && p[k] !== undefined)));

  function geometria(datos, estado = {}) {
    const d = mezcla(datos, estado);
    const cifras = String(d.cifras === undefined ? '?' : d.cifras).slice(0, 6).split('');
    const conLetrero = tiene(datos, 'letrero'), conPesos = tiene(datos, 'pesos'), conPie = tiene(datos, 'pie');
    const dy = conLetrero ? 0 : -(LET.y1 - 2);
    const k = cifras.length, ancho = k * CASILLA.w + (k - 1) * CASILLA.sep;
    const cx0 = (BOL.x0 + BOL.talon + BOL.x1) / 2 - ancho / 2, cy0 = BOL.y0 + dy + 22;
    const casillas = cifras.map((c, i) => ({ c, i, x: cx0 + i * (CASILLA.w + CASILLA.sep), y: cy0, w: CASILLA.w, h: CASILLA.h,
      hallada: d.hallada && d.hallada[i] !== undefined ? String(d.hallada[i]) : null, peso: d.pesos && d.pesos[i] !== undefined ? String(d.pesos[i]) : null }));
    const objetos = [{ que: 'boleto', x0: BOL.x0, y0: BOL.y0 + dy, x1: BOL.x1, y1: BOL.y1 + dy }], textos = [], rot = [];
    const tx = (que, x, y, segs, o = {}) => { const w = segsAncho(segs, o.tam || TAM), x0 = o.ancla === 'middle' ? x - w / 2 : x; textos.push({ que, txt: segs.map(s => s[0]).join(''), x0, x1: x0 + w, y0: y - (o.tam || TAM) * 0.8, y1: y + (o.tam || TAM) * 0.25 }); rot.push({ x, y, segs, o }); return w; };
    let cartel = null;
    const letrero = segsDe(d.letrero);
    if (letrero) { const w = segsAncho(letrero); cartel = { x0: 10, y0: LET.y0, x1: 10 + w + 20, y1: LET.y1 }; objetos.push(Object.assign({ que: 'cartel' }, cartel)); tx('cartel', 20, LET.base, letrero); }
    const yPesos = BOL.y1 + dy + 20;
    for (const c of casillas) if (c.peso !== null) tx(`peso ${c.i + 1}`, c.x + c.w / 2, yPesos, [[c.peso, 'o', 700]], { ancla: 'middle', tam: 15 });
    const yPie = BOL.y1 + dy + (conPesos ? 44 : 20);
    const pie = segsDe(d.pie);
    if (pie) tx('pie', 12, yPie, pie);
    const H = Math.round(BOL.y1 + dy + 8 + (conPesos ? 24 : 0) + (conPie ? 24 : 0));
    return { W, H, M, d, dy, cifras, casillas, cartel, rot, objetos, textos, yPesos };
  }

  function dibujar(datos, estado = {}) {
    const g = geometria(datos, estado), y0 = BOL.y0 + g.dy, y1 = BOL.y1 + g.dy, xt = BOL.x0 + BOL.talon;
    let s = '';
    if (g.cartel) { const c = g.cartel; s += `<rect x="${n2(c.x0)}" y="${c.y0}" width="${n2(c.x1 - c.x0)}" height="${c.y1 - c.y0}" rx="5" fill="var(--card)" stroke="currentColor" stroke-width="1.6"/>`; }
    // El boleto: tarjeta con las muescas del troquel, el talón a la izquierda y «RIFA» arriba.
    const m = 5, ym = (y0 + y1) / 2;
    s += `<path d="M${BOL.x0 + 6} ${y0}H${BOL.x1 - 6}Q${BOL.x1} ${y0} ${BOL.x1} ${y0 + 6}V${n2(ym - m)}A${m} ${m} 0 0 0 ${BOL.x1} ${n2(ym + m)}V${y1 - 6}Q${BOL.x1} ${y1} ${BOL.x1 - 6} ${y1}H${BOL.x0 + 6}Q${BOL.x0} ${y1} ${BOL.x0} ${y1 - 6}V${n2(ym + m)}A${m} ${m} 0 0 0 ${BOL.x0} ${n2(ym - m)}V${y0 + 6}Q${BOL.x0} ${y0} ${BOL.x0 + 6} ${y0}Z" fill="var(--card)" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`;
    s += `<line x1="${xt}" y1="${y0 + 4}" x2="${xt}" y2="${y1 - 4}" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3"/>`;
    s += `<text class="kit-txt" x="${n2(BOL.x0 + BOL.talon / 2)}" y="${n2(ym - 4)}" font-size="11" font-weight="700" text-anchor="middle" fill="currentColor" letter-spacing="1">RIFA</text>`;
    s += `<text class="kit-txt" x="${n2(BOL.x0 + BOL.talon / 2)}" y="${n2(ym + 12)}" font-size="10" text-anchor="middle" fill="currentColor" fill-opacity="0.75">boleto</text>`;
    s += `<text class="kit-txt" x="${n2((xt + BOL.x1) / 2)}" y="${n2(y0 + 15)}" font-size="10" text-anchor="middle" fill="currentColor" fill-opacity="0.75" letter-spacing="0.5">número</text>`;
    for (const c of g.casillas) {
      const cx = c.x + c.w / 2, cy = c.y + c.h / 2;
      if (c.c === '?' && !c.hallada) {
        // La cifra borrada: una mancha de lluvia irregular y su «?».
        s += `<rect x="${n2(c.x)}" y="${n2(c.y)}" width="${c.w}" height="${c.h}" rx="5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3"/>`;
        s += `<path class="bl-mancha" d="M${n2(cx - 12)} ${n2(cy - 6)}Q${n2(cx - 8)} ${n2(cy - 17)} ${n2(cx + 3)} ${n2(cy - 14)}Q${n2(cx + 14)} ${n2(cy - 12)} ${n2(cx + 12)} ${n2(cy + 1)}Q${n2(cx + 13)} ${n2(cy + 13)} ${n2(cx + 1)} ${n2(cy + 15)}Q${n2(cx - 13)} ${n2(cy + 15)} ${n2(cx - 12)} ${n2(cy - 6)}Z" fill="currentColor" fill-opacity="0.16"/>`;
        s += `<text class="kit-txt" x="${n2(cx)}" y="${n2(cy + 8)}" font-size="24" font-weight="700" text-anchor="middle" fill="currentColor">?</text>`;
      } else {
        const col = c.hallada ? 'var(--c-f)' : 'currentColor';
        s += `<rect x="${n2(c.x)}" y="${n2(c.y)}" width="${c.w}" height="${c.h}" rx="5" fill="${c.hallada ? 'var(--c-f)' : 'currentColor'}" fill-opacity="${c.hallada ? 0.14 : 0.05}" stroke="${col}" stroke-width="${c.hallada ? 2.2 : 1.5}"/>`;
        s += `<text class="kit-txt${c.hallada ? ' bl-hallada' : ''}" x="${n2(cx)}" y="${n2(cy + 9)}" font-size="26" font-weight="700" text-anchor="middle" fill="${col}" style="font-variant-numeric:tabular-nums">${T.esc(c.hallada || c.c)}</text>`;
      }
      // La rayita que une cada casilla con su peso.
      if (c.peso !== null) s += `<line x1="${n2(cx)}" y1="${n2(y1 + 2)}" x2="${n2(cx)}" y2="${n2(g.yPesos - 14)}" stroke="var(--c-o)" stroke-width="1.5"/>`;
    }
    for (const r of g.rot) s += texto(r.x, r.y, r.segs, r.o);
    return T.svg(W, g.H, `<g class="kit-objeto" data-objeto="boleto" data-prueba="si">${s}</g>`, { alt: alt(datos, estado) });
  }

  function alt(datos, estado = {}) {
    const g = geometria(datos, estado);
    const num = g.casillas.map(c => c.hallada || (c.c === '?' ? 'una cifra borrada' : c.c));
    let t = `Boleto de una rifa con su número cifra por cifra: ${num.join(', ')}.`;
    if (g.casillas.some(c => c.peso !== null)) t += ` Debajo de cada cifra, el peso de su lugar: ${g.casillas.map(c => c.peso).filter(x => x !== null).join(', ')}.`;
    return t;
  }

  return { id: 'arit-boleto', dibujar, alt, geometria, constantes: { W, M } };
});
