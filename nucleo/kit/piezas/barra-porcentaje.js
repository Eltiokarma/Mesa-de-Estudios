/*
 * Pieza «barra-porcentaje» (docs/escena-viva.md, sección 5): la barra del total que se va cortando por tramos
 * sucesivos. Sirve para porcentajes sucesivos, fracciones de lo que queda, mezclas y reparto.
 *
 * Afirmación de la figura: el segundo porcentaje muerde lo que quedó, no el total.
 *
 * datos = {
 *   total: 300,                       // el 100 % (en pct, 100)
 *   prefijo: 'S/ ', sufijo: '',       // cómo se escriben los valores («S/ 255», «85 %»)
 *   decimales: 2,
 *   color: 'o',                       // color de la variable del total (regla 4)
 *   tramos: [{ tipo: 'descuento'|'aumento', pct: 15, color: 'i' }, …],  // en orden
 *   marca: 'queda' | 'quita',         // qué mide la marca del alumno: lo que queda o lo que se quitó del total
 *   escala: 1000                      // opcional: el valor que ocupa todo el ancho (si no, el mayor de la barra)
 * }
 * estado = {
 *   corte: 0..n,                      // cuántos tramos ya se aplicaron (lo aplicado se queda dibujado)
 *   final: false,                     // dibuja el resultado (marca sólida y su cota)
 *   marca: null | número,             // la marca del alumno, en las unidades de la respuesta
 *   fantasma: null | { marca, rotulo } // el error con nombre, dibujado con trazo discontinuo
 * }
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
  const W = 320, X0 = 10, X1 = 310;
  const BARRA_Y = 42, BARRA_H = 36, EJE_Y = BARRA_Y + BARRA_H + 8, FILA0 = 96, FILA = 24, PIEZA_H = 14;

  // Valores tras cada tramo: v[0] = total, v[i] = v[i−1] · (1 ± pct/100). Escala = el mayor (con aumentos pasa del total).
  function valores(d) {
    const v = [d.total];
    for (const t of d.tramos) v.push(v[v.length - 1] * (t.tipo === 'aumento' ? 1 + t.pct / 100 : 1 - t.pct / 100));
    return v;
  }
  // Geometría fija para todos los estados: barra arriba, una fila por tramo, la fila de la marca y la del fantasma.
  function geometria(d) {
    // escala opcional (agregada para el laboratorio): fija el valor que ocupa todo el ancho, para que arrastrar un
    // pedazo no cambie la regla bajo el dedo. Si algún valor la pasa, manda el mayor, como sin ella.
    const v = valores(d), escala = Math.max(...v, d.escala > 0 ? d.escala : 0);
    const n = d.tramos.length;
    const manijaY = FILA0 + FILA * n + 14;
    const fantasmaY = manijaY + 28;
    return { v, escala, n, manijaY, fantasmaY, alto: fantasmaY + 14, x: val => X0 + (X1 - X0) * Math.max(0, val) / escala,
      // Agregado para el gesto directo (docs/teoria.md §4b): la barra, la fila de cada tramo y la inversa de x.
      barraY: BARRA_Y, barraH: BARRA_H, piezaH: PIEZA_H, filaY, deX: px => (px - X0) / (X1 - X0) * escala };
  }
  const filaY = i => FILA0 + FILA * (i - 1);
  const fmt = (d, x) => `${d.prefijo || ''}${Kit.formatear(x, d.decimales === undefined ? 2 : d.decimales)}${d.sufijo || ''}`;
  const pct = x => `${Kit.formatear(x, 2)} %`;
  // Lo que mide la respuesta: lo que queda, o lo que se quitó del total.
  const medida = (d, g) => (d.marca === 'quita' ? d.total - g.v[g.n] : g.v[g.n]);
  // Posición de una marca (en unidades de la respuesta) sobre la barra.
  const xMarca = (d, g, m) => g.x(d.marca === 'quita' ? d.total - m : m);

  function controles(d) {
    const g = geometria(d);
    const max = d.marca === 'quita' ? d.total : g.escala;
    return {
      ancho: W, alto: g.alto,
      marca: {
        min: 0, max, inicio: d.marca === 'quita' ? 0 : d.total,
        aX: m => xMarca(d, g, m),
        deX: x => { const val = (x - X0) / (X1 - X0) * g.escala; return d.marca === 'quita' ? d.total - val : val; },
        texto: m => fmt(d, m),
      },
      respuesta: medida(d, g),
    };
  }

  // La marca vertical: atraviesa la barra y termina en una manija con su lectura al lado.
  function marcaSVG(d, g, m, { solida, clase, rotulo, y }) {
    const x = xMarca(d, g, Math.min(Math.max(m, 0), d.marca === 'quita' ? d.total : g.escala));
    const lado = x > W / 2 ? 'end' : 'start', dx = lado === 'end' ? -16 : 16;
    let s = '';
    if (d.marca === 'quita' && solida) s += T.resaltado(x, BARRA_Y, g.x(d.total) - x, BARRA_H, { radio: 0 });
    s += T.linea(x, BARRA_Y - 8, x, y, { grosor: solida ? T.GROSOR.variable : T.GROSOR.contorno, discontinua: !solida, opacidad: solida ? undefined : 0.8 });
    s += solida ? `<circle cx="${T.n(x)}" cy="${T.n(y)}" r="11" fill="currentColor"/>` : `<circle cx="${T.n(x)}" cy="${T.n(y)}" r="6" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="3 3"/>`;
    s += T.rotulo(x + dx, y + 6, rotulo, { ancla: lado, peso: solida ? 700 : 400 });
    return `<g class="${clase}">${s}</g>`;
  }

  // Rótulo de un pedazo: a su derecha si cabe; si no, a su izquierda; si tampoco, centrado (encajado en el lienzo).
  function rotuloPedazo(xa, xb, y, texto, o) {
    const w = T.ancho(texto, T.TEXTO, 700);
    if (xb + 8 + w <= W - 2) return T.rotulo(xb + 8, y, texto, { ...o, ancla: 'start' });
    if (xa - 8 - w >= 2) return T.rotulo(xa - 8, y, texto, { ...o, ancla: 'end' });
    return T.rotulo((xa + xb) / 2, y, texto, { ...o, ancla: 'middle' });
  }

  function dibujar(d, estado = {}) {
    const g = geometria(d);
    const corte = Math.max(0, Math.min(g.n, estado.corte || 0));
    const final = !!estado.final;
    const nuevo = i => (!final && i === corte ? ' kit-nuevo' : '');
    const queda = g.v[corte];
    let s = '';
    // Cuadrícula de 1 px cada 10 % del total, bajo la barra (para leer la marca sin adivinar).
    const marcas = [];
    for (let k = 0; k * d.total / 10 <= g.escala + 1e-9; k++) marcas.push(g.x(k * d.total / 10));
    s += T.eje(X0, g.x(g.escala), EJE_Y, { marcas, alto: 4, clase: 'kit-eje kit-tenue' });
    // Dónde terminaba el total: contorno tenue de 1 px (lo que se fue se compara con lo que había).
    if (queda < d.total) s += `<rect class="kit-tenue" x="${T.n(X0)}" y="${BARRA_Y}" width="${T.n(g.x(d.total) - X0)}" height="${BARRA_H}" rx="4" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="3 4"/>`;
    // La barra: lo que hay ahora (la variable en estudio, 3 px). Lo agregado por un aumento, con el color de ese tramo.
    s += T.barra(X0, BARRA_Y, g.x(Math.min(queda, d.total)) - X0, BARRA_H, { color: d.color, grosor: T.GROSOR.variable });
    if (queda > d.total) {
      const k = d.tramos.findIndex((t, i) => i < corte && t.tipo === 'aumento');
      const t = d.tramos[k], recien = k === corte - 1 ? nuevo(corte) : '';
      s += `<rect class="kit-crece${recien}" x="${T.n(g.x(d.total))}" y="${BARRA_Y}" width="${T.n(g.x(queda) - g.x(d.total))}" height="${BARRA_H}" fill="${T.color(t ? t.color : d.color)}" fill-opacity="0.3"/>`;
      s += `<rect x="${T.n(X0)}" y="${BARRA_Y}" width="${T.n(g.x(queda) - X0)}" height="${BARRA_H}" rx="4" fill="none" stroke="${T.color(d.color)}" stroke-width="${T.GROSOR.variable}" stroke-linejoin="round"/>`;
    }
    // Rótulo dentro de la barra: lo que vale la barra ahora (fidelidad: una barra del 75 % no puede decir «S/ 1 000»).
    // Antes del primer corte es el total, con el color de su variable (el hilo de color); después, el valor del momento, en tinta.
    s += corte === 0
      ? T.rotulo(X0 + 8, BARRA_Y + BARRA_H / 2 + 6, fmt(d, d.total), { color: d.color, peso: 700, max: g.x(d.total) - 4 })
      : T.rotulo(X0 + 8, BARRA_Y + BARRA_H / 2 + 6, fmt(d, queda), { peso: 700, max: g.x(Math.min(queda, d.total)) - 4 });
    // Cada tramo aplicado deja su pedazo en su propia fila, bajo el lugar que ocupaba (rastro): lo que se quita cae
    // de la barra; lo que se suma se ve en la barra y su copia, en la fila.
    for (let i = 1; i <= corte; i++) {
      const t = d.tramos[i - 1], a = g.v[i - 1], b = g.v[i];
      const xa = g.x(Math.min(a, b)), xb = g.x(Math.max(a, b)), y = filaY(i);
      const sube = T.n(BARRA_Y + (BARRA_H - PIEZA_H) / 2 - y);
      s += t.tipo === 'aumento'
        ? T.barra(xa, y, xb - xa, PIEZA_H, { color: t.color, relleno: 0.3, clase: `kit-t${i} kit-aparece${nuevo(i)}` })
        : `<g class="kit-t${i} kit-cae${nuevo(i)}" style="--kit-dy:${sube}px">${T.barra(xa, y, xb - xa, PIEZA_H, { color: t.color, discontinua: true, relleno: 0.12 })}</g>`;
      const signo = t.tipo === 'aumento' ? '+' : '−';
      s += rotuloPedazo(xa, xb, y + PIEZA_H - 1, `${signo}${Kit.formatear(t.pct)} % · ${fmt(d, Math.abs(b - a))}`,
        { color: t.color, peso: 700, clase: `kit-t${i} kit-aparece${nuevo(i)}` });
    }
    // Cota de arriba: la base del tramo de este paso. En el final, el resultado.
    if (final) {
      const r = medida(d, g);
      const x0 = d.marca === 'quita' ? g.x(g.v[g.n]) : X0, x1 = d.marca === 'quita' ? g.x(d.total) : g.x(g.v[g.n]);
      s += `<g class="kit-final kit-aparece kit-nuevo">${T.cota(x0, x1, 28, { texto: `${pct(100 * r / d.total)} del total` })}</g>`;
    } else if (corte > 0) {
      // Sobre qué se calculó el tramo de este paso: el segundo porcentaje se calcula sobre lo que quedó.
      s += `<g class="kit-base kit-aparece${nuevo(corte)}">${T.cota(X0, g.x(g.v[corte - 1]), 28, { texto: `base ${fmt(d, g.v[corte - 1])}`, peso: 600 })}</g>`;
    }
    // El fantasma: el error con nombre, discontinuo, con su rótulo en su propia fila (no choca con la marca).
    if (estado.fantasma && Number.isFinite(estado.fantasma.marca)) {
      const f = estado.fantasma;
      s += marcaSVG(d, g, f.marca, { solida: false, clase: 'kit-fantasma', y: g.fantasmaY, rotulo: `${f.rotulo ? f.rotulo + ': ' : ''}${fmt(d, f.marca)}` });
    }
    // La respuesta correcta en el final, o la marca del alumno mientras responde.
    if (final) s += marcaSVG(d, g, medida(d, g), { solida: true, clase: 'kit-respuesta kit-aparece kit-nuevo', y: g.manijaY, rotulo: `${fmt(d, medida(d, g))} ✓` });
    else if (Number.isFinite(estado.marca)) s += marcaSVG(d, g, estado.marca, { solida: true, clase: 'kit-marca', y: g.manijaY, rotulo: fmt(d, estado.marca) });
    return T.svg(W, g.alto, s, { alt: alt(d) });
  }

  function alt(d) {
    const partes = d.tramos.map((t, i) => {
      const verbo = t.tipo === 'aumento' ? 'gana' : 'pierde';
      const base = i === 0 ? '' : t.tipo === 'aumento' ? ' de lo que hay' : ' de lo que queda';
      return `${i === 0 ? 'primero' : 'luego'} ${verbo} el ${Kit.formatear(t.pct)} %${base}`;
    });
    const fin = partes.length > 1 ? partes.slice(0, -1).join(', ') + ' y ' + partes[partes.length - 1] : partes[0] || '';
    return `Barra de ${fmt(d, d.total)} que ${fin}`;
  }

  return { id: 'barra-porcentaje', dibujar, alt, controles, valores, geometria };
});
