/*
 * Pieza «arit-monedas» (19 nov 2026): monedas sobre el mostrador para pagar una cuenta, para la idea «Pagar justo con
 * dos monedas» de «Divisibilidad» (contenido/teoria/aritmetica/divisibilidad.js; docs/etapa5/propuesta-aritmetica.md
 * §2). Dibujo de prueba (data-prueba): Gerson decide después si lo reemplaza.
 *
 * Afirmación de la figura: la cuenta se paga con un número entero de monedas de cada clase; cada fila vale lo que su
 * moneda por cuántas hay.
 *
 * Fidelidad: cada moneda se dibuja (4 monedas son 4 círculos), en fila; la de más valor es más grande. Si se pide cuántas
 * hay, la fila muestra una sola moneda y «× ?». Con más de 12 en una fila, se dibujan 12 y «…» (el rótulo dice cuántas).
 *
 * datos = {
 *   filas: [{ valor: 2, cuantas: 4 }, { valor: 5, cuantas: 3 }],   una fila por clase de moneda (o billete: clase: 'billete');
 *                                 cuantas: un número, o '?' si se pide
 *   cuenta: 23,                   lo que hay que pagar: va en el cartel («Cuenta: S/ 23»)
 *   total: true,                  el rótulo de cada fila dice lo que vale («4 × S/ 2 = S/ 8»); false: solo cuántas hay
 *   pie: [[texto, color?, peso?], …],   una línea abajo (la relación)
 *   pasos: [{ …datos }, …],
 * }
 * estado = { paso }. Función pura. Lienzo de 320 de ancho y alto fijo para una misma figura. Colores: tinta y var(--c-*):
 * el valor de la moneda en turquesa (i: es «el envase», de cuánto en cuánto se paga) y cuántas hay en violeta (f: lo que
 * se busca). Nunca carmín ni verde. geometria(datos, estado) da las cajas de lo dibujado.
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
  const W = 320, M = 4, TAM = 13, n2 = T.n, MAX = 12;
  const LET = { y0: 6, y1: 30, base: 23 };
  const FILA = 58;      // alto de una fila: monedas y su rótulo
  const mezcla = (datos, estado) => { const ps = (datos && datos.pasos) || []; return Object.assign({}, datos || {}, ps[Math.max(0, Math.min(ps.length - 1, (estado && estado.paso) | 0))] || {}); };
  const segsDe = x => (typeof x === 'string' ? [[x]] : Array.isArray(x) ? x : null);
  const segsAncho = (segs, tam = TAM) => segs.reduce((a, s) => a + T.ancho(s[0], tam, s[2] || 400), 0);
  const texto = (x, y, segs, o = {}) => `<text class="kit-txt" x="${n2(x)}" y="${n2(y)}" font-size="${o.tam || TAM}"${o.ancla ? ` text-anchor="${o.ancla}"` : ''} style="font-variant-numeric:tabular-nums">`
    + segs.map(([t, c, p]) => `<tspan fill="${T.color(c)}"${p && p !== 400 ? ` font-weight="${p}"` : ''}>${T.esc(t)}</tspan>`).join('') + '</text>';
  const tiene = (datos, k) => !!(datos && (datos[k] !== undefined || (datos.pasos || []).some(p => p && p[k] !== undefined)));
  const nombre = f => (f.clase === 'billete' ? (f.cuantas === 1 ? 'billete' : 'billetes') : (f.cuantas === 1 ? 'moneda' : 'monedas'));

  function geometria(datos, estado = {}) {
    const d = mezcla(datos, estado);
    const filas = (Array.isArray(d.filas) ? d.filas : []).slice(0, 3);
    const conCuenta = tiene(datos, 'cuenta'), conPie = tiene(datos, 'pie');
    const y0 = conCuenta ? LET.y1 + 10 : 8;
    const objetos = [], textos = [], rot = [], monedas = [];
    const tx = (que, x, y, segs, o = {}) => { const w = segsAncho(segs, o.tam || TAM); textos.push({ que, txt: segs.map(s => s[0]).join(''), x0: x, x1: x + w, y0: y - (o.tam || TAM) * 0.8, y1: y + (o.tam || TAM) * 0.25 }); rot.push({ x, y, segs, o }); return w; };
    let cartel = null;
    if (d.cuenta !== undefined) { const segs = [['Cuenta: '], [`S/ ${d.cuenta}`, null, 700]], w = segsAncho(segs); cartel = { x0: 10, y0: LET.y0, x1: 10 + w + 20, y1: LET.y1 }; objetos.push(Object.assign({ que: 'cartel' }, cartel)); tx('cartel', 20, LET.base, segs); }
    const vmax = Math.max(1, ...filas.map(f => +f.valor || 1));
    filas.forEach((f, k) => {
      const billete = f.clase === 'billete', pide = f.cuantas === '?', cuantas = pide ? 1 : Math.max(0, Math.floor(+f.cuantas || 0));
      const r = billete ? 0 : (+f.valor === vmax && filas.length > 1 ? 12.5 : 10.5), w = billete ? 34 : 2 * r, h = billete ? 18 : 2 * r, paso = w + 3;
      const cy = y0 + k * FILA + 14, ver = Math.min(cuantas, billete ? 8 : MAX);
      for (let i = 0; i < ver; i++) { const x = 12 + i * paso; monedas.push({ fila: k, valor: f.valor, billete, x, y: cy - h / 2, w, h, r }); objetos.push({ que: `${billete ? 'billete' : 'moneda'} ${k + 1}.${i + 1}`, x0: x, y0: cy - h / 2, x1: x + w, y1: cy + h / 2 }); }
      const xFin = 12 + ver * paso + 2;
      if (pide) tx(`cuántas ${k + 1}`, xFin + 2, cy + 5, [['× '], ['?', null, 700]], { tam: 15 });
      else if (cuantas > ver) tx(`más ${k + 1}`, xFin, cy + 5, [['…']], { tam: 15 });
      const segs = pide ? [['¿cuántas de '], [`S/ ${f.valor}`, 'i', 700], ['?']]
        : d.total === false ? [[String(cuantas), 'f', 700], [` ${nombre({ clase: f.clase, cuantas })} de `], [`S/ ${f.valor}`, 'i', 700]]
          : [[String(cuantas), 'f', 700], [' × '], [`S/ ${f.valor}`, 'i', 700], [` = S/ ${cuantas * f.valor}`]];
      tx(`rótulo ${k + 1}`, 12, y0 + k * FILA + 46, segs);
    });
    const yFin = y0 + filas.length * FILA;
    const pie = segsDe(d.pie);
    if (pie) tx('pie', 12, yFin + 12, pie);
    const H = Math.round(yFin + (conPie ? 22 : 2));
    const suma = filas.reduce((a, f) => a + (f.cuantas === '?' ? 0 : (+f.cuantas || 0) * f.valor), 0);
    return { W, H, M, d, filas, monedas, cartel, rot, objetos, textos, suma };
  }

  function dibujar(datos, estado = {}) {
    const g = geometria(datos, estado);
    let s = '';
    if (g.cartel) { const c = g.cartel; s += `<rect x="${n2(c.x0)}" y="${c.y0}" width="${n2(c.x1 - c.x0)}" height="${c.y1 - c.y0}" rx="5" fill="var(--card)" stroke="currentColor" stroke-width="1.6"/>`; }
    for (const m of g.monedas) {
      const cx = m.x + m.w / 2, cy = m.y + m.h / 2;
      if (m.billete) {
        s += `<rect class="mo-billete" x="${n2(m.x)}" y="${n2(m.y)}" width="${m.w}" height="${m.h}" rx="3" fill="var(--c-i)" fill-opacity="0.1" stroke="currentColor" stroke-width="1.5"/>`;
        s += `<text class="kit-txt" x="${n2(cx)}" y="${n2(cy + 4)}" font-size="11" font-weight="700" text-anchor="middle" fill="var(--c-i)">${T.esc(m.valor)}</text>`;
      } else {
        // Moneda de dos metales: el aro de afuera y el centro.
        s += `<circle class="mo-moneda" cx="${n2(cx)}" cy="${n2(cy)}" r="${m.r}" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="1.6"/>`;
        s += `<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${n2(m.r - 3.2)}" fill="var(--card)" stroke="currentColor" stroke-width="1" stroke-opacity="0.6"/>`;
        s += `<text class="kit-txt" x="${n2(cx)}" y="${n2(cy + 4)}" font-size="${m.r > 11 ? 12 : 11}" font-weight="700" text-anchor="middle" fill="var(--c-i)">${T.esc(m.valor)}</text>`;
      }
    }
    for (const r of g.rot) s += texto(r.x, r.y, r.segs, r.o);
    return T.svg(W, g.H, `<g class="kit-objeto" data-objeto="monedas" data-prueba="si">${s}</g>`, { alt: alt(datos, estado) });
  }

  function alt(datos, estado = {}) {
    const g = geometria(datos, estado);
    let t = g.d.cuenta !== undefined ? `Hay que pagar una cuenta de ${g.d.cuenta} soles. ` : '';
    t += 'Sobre el mostrador: ' + (g.filas.map(f => (f.cuantas === '?' ? `una cantidad que no se sabe de ${f.clase === 'billete' ? 'billetes' : 'monedas'} de ${f.valor} soles` : `${f.cuantas} ${nombre(f)} de ${f.valor} soles`)).join(' y ') || 'no hay ninguna moneda todavía') + '.';
    if (!g.filas.some(f => f.cuantas === '?') && g.filas.length) t += ` En total, ${g.suma} soles.`;
    return t;
  }

  return { id: 'arit-monedas', dibujar, alt, geometria, constantes: { W, M, MAX } };
});
