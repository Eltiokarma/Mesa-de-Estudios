/*
 * Pieza «arit-cintas» (19 nov 2026): los rollos de cinta de la fiesta de la promoción, para «MCD y MCM»
 * (contenido/teoria/aritmetica/mcd-y-mcm.js, ideas 1, 3 y 6; docs/etapa7/propuesta-aritmetica.md §2). Dibujo de prueba
 * (data-prueba): Gerson decide después si lo reemplaza (docs/plan-calidad.md, M4).
 *
 * Afirmación de la figura: una cinta se corta en trozos iguales; si el trozo no entra un número entero de veces, sobra
 * un pedazo más corto que el trozo. Todas las cintas de una figura se miden con la misma regla.
 *
 * Fidelidad: una sola escala (px por metro o por centímetro) para todas las cintas de la figura: el largo dibujado de
 * cada cinta y de cada trozo es su medida por esa escala; nada se estira para que quepa un rótulo. Cada trozo completo
 * se dibuja (24 m en trozos de 6 son 4 trozos) y lo que sobra mide exactamente largo − trozo × (trozos enteros).
 *
 * datos = {
 *   max: 36,                     el largo que ocupa todo el ancho (escala común); por defecto, la cinta más larga
 *   cintas: [{
 *     largo: 24,                 lo que mide la cinta
 *     rotulo: [[texto, color?, peso?], …] | 'texto',   arriba a la izquierda («Cinta A: 24 m»)
 *     trozo: 6,                  la cinta va cortada en trozos de este largo (sin trozo: entera, sin cortes)
 *     colorTrozo: 'i' | 'f' | null,   el color de los trozos: turquesa (un divisor común), violeta, o tinta (null)
 *     marca: true,               el largo del trozo escrito dentro de cada trozo, si cabe
 *     nota: [[texto, color?, peso?], …] | 'texto',     debajo de la cinta («4 trozos de 6 m»)
 *     color: 'f' | null,         el contorno de la cinta entera (violeta para un múltiplo común); por defecto, tinta
 *     pedida: true,              la cinta va punteada y sin cortes, con «?» al final (lo que se pide)
 *     paso: 0,                   aparece en el paso (antes se reserva su lugar)
 *   }],
 *   filas: 3,                    filas reservadas (el alto no cambia aunque una cinta aparezca después)
 *   compacta: true,              filas bajas, sin nota (para varias divisiones seguidas, como en Euclides)
 *   letrero, pie: [[texto, color?, peso?], …] | 'texto',   una línea arriba y otra abajo de todo
 *   pasos: [{ …datos }, …],      para «Mira»: estado.paso elige qué cambia (se mezcla con los datos)
 * }
 * estado = { paso }. Función pura de (datos, estado): sin ids, sin azar, sin reloj. Lienzo de 320 de ancho.
 * Colores: tinta (currentColor) y var(--c-*): los trozos, en el color que piden los datos (turquesa para el divisor
 * común: es lo que entra exacto en las dos cintas); lo que sobra, en naranja punteado (o); la cinta de un múltiplo común,
 * con contorno violeta (f). Nunca carmín ni verde. El color no es la única señal: lo que sobra va punteado y su nota lo
 * dice. geometria(datos, estado) da las cajas de todo lo dibujado, para la prueba numérica de encuadre.
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
  const W = 320, M = 4, TAM = 13;
  const X0 = 10, X1 = 300;              // la cinta más larga va de X0 a X1 (a la derecha queda la punta en V y el «?»)
  const ROT = 17, ALTO = 20, NOTA = 19, SEP = 8;   // rótulo, cinta, nota y aire entre filas
  const FILA = ROT + ALTO + NOTA + SEP;
  const CHICA = { ROT: 17, ALTO: 16, NOTA: 0, SEP: 5 };   // compacta: sin nota
  const COL = ['o', 'i', 'f'];
  const n2 = T.n;
  const num = x => (Number.isFinite(+x) ? +x : 0);
  const segsDe = x => (x === undefined || x === null ? null : typeof x === 'string' ? [[x]] : Array.isArray(x) ? x : null);
  const segsAncho = (segs, tam = TAM) => segs.reduce((a, s) => a + T.ancho(s[0], tam, s[2] || 400), 0);
  function texto(x, y, segs, o = {}) {
    const tam = o.tam || TAM, ancla = o.ancla || 'start';
    const spans = segs.map(([t, c, p]) => `<tspan fill="${T.color(c)}"${p && p !== 400 ? ` font-weight="${p}"` : ''}>${T.esc(t)}</tspan>`).join('');
    return `<text class="kit-txt" x="${n2(x)}" y="${n2(y)}" font-size="${tam}"${ancla !== 'start' ? ` text-anchor="${ancla}"` : ''} style="font-variant-numeric:tabular-nums">${spans}</text>`;
  }
  function mezcla(datos, estado) {
    const ps = (datos && datos.pasos) || [];
    const p = ps.length ? ps[Math.max(0, Math.min(ps.length - 1, (estado && estado.paso) | 0))] : null;
    return Object.assign({}, datos || {}, p || {});
  }

  // ---------- Geometría ----------
  function geometria(datos, estado = {}) {
    const d = mezcla(datos, estado);
    const paso = Math.max(0, (estado && estado.paso) | 0);
    const cintas = Array.isArray(d.cintas) ? d.cintas : [];
    // Las filas se reservan con la figura más llena de todos los pasos (el alto no salta en «Mira»).
    const nFilas = Math.max(1, num(d.filas), cintas.length, ...((datos && datos.pasos) || []).map(p => (p && Array.isArray(p.cintas) ? p.cintas.length : 0)));
    const max = num(d.max) > 0 ? num(d.max) : Math.max(1, ...cintas.map(c => num(c.largo)));
    const esc = (X1 - X0) / max;
    const letrero = segsDe(d.letrero), pie = segsDe(d.pie);
    const conLetrero = !!(datos && (datos.letrero !== undefined || (datos.pasos || []).some(p => p && p.letrero !== undefined)));
    const conPie = !!(datos && (datos.pie !== undefined || (datos.pasos || []).some(p => p && p.pie !== undefined)));
    const y0 = conLetrero ? 30 : 6;
    const K = d.compacta ? CHICA : { ROT, ALTO, NOTA, SEP }, fila0 = K.ROT + K.ALTO + K.NOTA + K.SEP;
    const objetos = [], textos = [], filas = [];
    const tx = (que, x, y, segs, o = {}) => {
      const tam = o.tam || TAM, w = segsAncho(segs, tam);
      const x0 = o.ancla === 'middle' ? x - w / 2 : o.ancla === 'end' ? x - w : x;
      textos.push({ que, txt: segs.map(s => s[0]).join(''), x0, x1: x0 + w, y0: y - tam * 0.8, y1: y + tam * 0.25, x, y, segs, o });
    };
    if (letrero) tx('letrero', X0, 19, letrero, { peso: 700 });
    cintas.forEach((c, k) => {
      const yR = y0 + k * fila0, yC = yR + K.ROT, largo = Math.max(0, num(c.largo));
      const visible = (c.paso || 0) <= paso;
      const fila = { k, visible, largo, x0: X0, x1: X0 + largo * esc, y: yC, h: K.ALTO, trozos: [], sobra: null, pedida: !!c.pedida };
      if (visible) {
        const rot = segsDe(c.rotulo);
        if (rot) tx(`rótulo ${k}`, X0, yR + 13, rot);
        objetos.push({ que: `cinta ${k}`, x0: fila.x0, y0: yC, x1: fila.x1 + (c.pedida ? 0 : 7), y1: yC + K.ALTO });
        const t = num(c.trozo);
        if (!c.pedida && t > 0 && largo > 0) {
          const q = Math.floor(largo / t + 1e-9), r = Math.round((largo - q * t) * 1e6) / 1e6;
          for (let i = 0; i < q; i++) fila.trozos.push({ x0: X0 + i * t * esc, x1: X0 + (i + 1) * t * esc, valor: t });
          if (r > 1e-9) fila.sobra = { x0: X0 + q * t * esc, x1: X0 + largo * esc, valor: r };
          fila.q = q; fila.r = r > 1e-9 ? r : 0;
          // El largo del trozo, dentro de cada trozo, si cabe con 3 de aire por lado.
          if (c.marca) {
            const et = String(c.marcaTexto || t), w = T.ancho(et, 12, 700);
            if ((t * esc) >= w + 6) fila.marcas = fila.trozos.map(z => ({ x: (z.x0 + z.x1) / 2, t: et }));
          }
        }
        if (c.pedida) tx(`pedida ${k}`, fila.x1 + 4, yC + K.ALTO / 2 + 5, [['?', null, 700]], { tam: 15 });
        const nota = d.compacta ? null : segsDe(c.nota);
        if (nota) tx(`nota ${k}`, X0, yC + K.ALTO + 15, nota);
      }
      fila.c = c;
      filas.push(fila);
    });
    const yFin = y0 + nFilas * fila0 - K.SEP;
    if (pie) tx('pie', X0, yFin + 16, pie);
    const H = Math.round(yFin + (conPie ? 24 : 4));
    return { W, H, M, d, max, esc, filas, objetos, textos, y0, nFilas };
  }

  // Una cinta: banda con la punta en V a la derecha (como una cinta de regalo cortada en diagonal).
  function banda(x0, x1, y, h, o = {}) {
    const v = 7, col = o.color ? T.color(o.color) : 'currentColor';
    const d = `M${n2(x0)} ${n2(y)}H${n2(x1 + v)}L${n2(x1)} ${n2(y + h / 2)}L${n2(x1 + v)} ${n2(y + h)}H${n2(x0)}Z`;
    return `<path class="ci-cinta" d="${d}" fill="currentColor" fill-opacity="0.07" stroke="${col}" stroke-width="${o.color ? 2 : 1.3}" stroke-opacity="${o.color ? 1 : 0.75}" stroke-linejoin="round"/>`;
  }

  // ---------- Dibujo ----------
  function dibujar(datos, estado = {}) {
    const g = geometria(datos, estado);
    let s = '';
    for (const f of g.filas) {
      if (!f.visible) continue;
      const c = f.c;
      if (f.pedida) {
        s += `<path class="ci-pedida" d="M${n2(f.x0)} ${n2(f.y)}H${n2(f.x1)}V${n2(f.y + f.h)}H${n2(f.x0)}Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="5 4" stroke-linejoin="round"/>`;
        continue;
      }
      s += banda(f.x0, f.x1, f.y, f.h, { color: COL.includes(c.color) ? c.color : null });
      const ct = COL.includes(c.colorTrozo) ? c.colorTrozo : null;
      for (const z of f.trozos) {
        const a = z.x0 + 1, b = z.x1 - 1;
        s += `<rect class="ci-trozo" x="${n2(a)}" y="${n2(f.y + 3)}" width="${n2(Math.max(0.5, b - a))}" height="${n2(f.h - 6)}" rx="2" fill="${ct ? T.color(ct) : 'currentColor'}" fill-opacity="${ct ? 0.22 : 0.12}" stroke="${ct ? T.color(ct) : 'currentColor'}" stroke-width="${ct ? 1.6 : 1}" stroke-opacity="${ct ? 1 : 0.7}"/>`;
      }
      // Los cortes: una raya de tijera entre trozo y trozo (y antes de lo que sobra).
      for (const z of f.trozos.slice(0, f.sobra ? f.trozos.length : -1)) s += `<path class="ci-corte" d="M${n2(z.x1)} ${n2(f.y - 2)}V${n2(f.y + f.h + 2)}" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2 2"/>`;
      if (f.sobra) {
        const a = f.sobra.x0 + 1, b = f.sobra.x1;
        s += `<rect class="ci-sobra" x="${n2(a)}" y="${n2(f.y + 3)}" width="${n2(Math.max(0.5, b - a))}" height="${n2(f.h - 6)}" rx="2" fill="var(--c-o)" fill-opacity="0.16" stroke="var(--c-o)" stroke-width="1.6" stroke-dasharray="3 2"/>`;
      }
      for (const m of f.marcas || []) s += `<text class="kit-txt" x="${n2(m.x)}" y="${n2(f.y + f.h / 2 + 4.3)}" font-size="12" font-weight="700" text-anchor="middle" fill="${ct ? T.color(ct) : 'currentColor'}" style="font-variant-numeric:tabular-nums">${T.esc(m.t)}</text>`;
    }
    for (const t of g.textos) s += texto(t.x, t.y, t.segs, t.o);
    return T.svg(W, g.H, `<g class="kit-objeto" data-objeto="cintas" data-prueba="si">${s}</g>`, { alt: alt(datos, estado) });
  }

  function alt(datos, estado = {}) {
    const g = geometria(datos, estado);
    const vis = g.filas.filter(f => f.visible);
    if (!vis.length) return 'Espacio para cintas que todavía no aparecen.';
    const f2 = x => String(Math.round(x * 100) / 100).replace('.', ',');
    return vis.map(f => {
      if (f.pedida) return 'Una cinta cuyo largo se pide (punteada, con signo de pregunta).';
      let t = `Una cinta de ${f2(f.largo)}`;
      if (f.trozos.length) t += ` cortada en ${f.trozos.length} ${f.trozos.length === 1 ? 'trozo' : 'trozos'} de ${f2(f.trozos[0].valor)}`;
      if (f.sobra) t += `; sobra un pedazo de ${f2(f.sobra.valor)}`;
      else if (f.trozos.length) t += ', sin que sobre nada';
      return t + '.';
    }).join(' ') + ' Todas a la misma escala.';
  }

  return { id: 'arit-cintas', dibujar, alt, geometria, constantes: { W, M, X0, X1, FILA, ALTO } };
});
