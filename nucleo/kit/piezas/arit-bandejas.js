/*
 * Pieza «arit-bandejas» (19 nov 2026): la bandeja de la vitrina de doña Juana, para «Números primos y divisores»
 * (contenido/teoria/aritmetica/numeros-primos-y-divisores.js, ideas 1, 3 y 4; docs/etapa6/propuesta-aritmetica.md §2).
 * Dibujo de prueba (data-prueba): Gerson decide después si lo reemplaza (docs/plan-calidad.md, M4).
 *
 * Afirmación de la figura: N caramelos se acomodan en filas iguales, todas llenas, de tantas formas como parejas de
 * divisores tiene N; cada forma es una pareja «filas × caramelos por fila». Una forma que no cierra deja sueltos.
 *
 * Fidelidad: cada caramelo se dibuja (una bandeja de 3 filas de 8 lleva 24). Todas las bandejas de una figura van a la
 * misma escala (un caramelo mide lo mismo en todas): si no caben, se achican todas, nunca una. Cada forma va con las
 * filas menores o iguales que los caramelos por fila (3 × 8 y no también 8 × 3): una forma es una pareja.
 *
 * datos = {
 *   n: 24,                       caramelos
 *   formas: 'todas' | [[filas, porFila], …],   'todas' (por defecto): todas las parejas, de 1 fila hacia el cuadrado
 *   intento: 5,                  además, un intento que no cierra: filas de 5 caramelos; la última fila incompleta, con
 *                                los sueltos en naranja punteado (si cierra, se dibuja como una forma más)
 *   rotulos: true,               «3 filas de 8» sobre cada bandeja (los números en turquesa: son divisores)
 *   colorRotulos: false,         los números del rótulo en tinta (cuando el color adelantaría algo)
 *   alto: 250,                   alto fijo del lienzo (el juego no salta al cambiar n); sin alto, el que haga falta
 *   letrero: [[texto, color?, peso?], …],   una línea arriba («24 caramelos»)
 *   pie: [[texto, color?, peso?], …],       una línea abajo; el alto se reserva si algún paso la trae
 *   pasos: [{ …datos }, …],      para «Mira»: estado.paso elige qué cambia (se mezcla con los datos)
 * }
 * estado = { paso }. Función pura de (datos, estado): sin ids, sin azar, sin reloj. Lienzo de 320 de ancho.
 * Colores: tinta (currentColor) y var(--c-*): los números de las filas y de cada fila en turquesa (i: son divisores, «el
 * envase» de la rama); los sueltos en naranja (o: lo que sobra); en letrero y pie, lo que los datos pidan. Nunca carmín
 * ni verde. El color no es la única señal: los sueltos van con borde punteado y el rótulo dice «sobran».
 * geometria(datos, estado) da las cajas de todo lo dibujado (bandejas y textos), para la prueba numérica de encuadre.
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
  const W = 320, M = 4, TAM = 14, X0 = 8, X1 = 312;
  const PAD = 5, ROT = 19, SEP_X = 12, SEP_Y = 9, LIN = 22;
  const n2 = T.n;
  const entero = x => Math.max(0, Math.floor(+x || 0));

  function mezcla(datos, estado) {
    const ps = (datos && datos.pasos) || [];
    const p = ps[Math.max(0, Math.min(ps.length - 1, (estado && estado.paso) | 0))];
    return Object.assign({}, datos || {}, p || {});
  }
  const segsAncho = (segs, tam = TAM) => segs.reduce((a, s) => a + T.ancho(s[0], tam, s[2] || 400), 0);
  const segsDe = x => (typeof x === 'string' ? [[x]] : Array.isArray(x) ? x : null);
  function texto(x, y, segs, o = {}) {
    const tam = o.tam || TAM, ancla = o.ancla || 'start';
    const spans = segs.map(([t, c, p]) => `<tspan fill="${T.color(c)}"${p && p !== 400 ? ` font-weight="${p}"` : ''}>${T.esc(t)}</tspan>`).join('');
    return `<text class="kit-txt" x="${n2(x)}" y="${n2(y)}" font-size="${tam}"${ancla !== 'start' ? ` text-anchor="${ancla}"` : ''} style="font-variant-numeric:tabular-nums">${spans}</text>`;
  }

  // Las parejas de N: [filas, porFila] con filas ≤ porFila, de 1 fila hacia el cuadrado.
  function parejas(N) {
    const out = [];
    for (let a = 1; a * a <= N; a++) if (N % a === 0) out.push([a, N / a]);
    return out;
  }
  // El rótulo de una bandeja, en segmentos.
  function rotuloDe(b, color) {
    const c = color ? 'i' : null;
    if (b.intento) {
      const r = b.sueltos;
      return [[String(b.llenas)], [b.llenas === 1 ? ' fila de ' : ' filas de '], [String(b.porFila), c, 700], [r === 1 ? '; sobra ' : '; sobran '], [String(r), 'o', 700]];
    }
    return [[String(b.filas), c, 700], [b.filas === 1 ? ' fila de ' : ' filas de '], [String(b.porFila), c, 700]];
  }

  // ---------- Geometría ----------
  // Acomodo en estantes: las bandejas van en orden, de izquierda a derecha, y bajan cuando no caben. Se busca el
  // caramelo más grande (s, de 22 hacia abajo) con el que todo cabe en el ancho y, si hay alto fijo, en el alto.
  function acomodar(bs, s, conRot, x0, x1) {
    const filas = [];
    let fila = null;
    for (const b of bs) {
      const cols = b.porFila, rows = b.intento ? b.llenas + (b.sueltos ? 1 : 0) : b.filas;
      const w = cols * s + 2 * PAD, h = rows * s + 2 * PAD;
      const wr = conRot ? segsAncho(b.rot) : 0, ancho = Math.max(w, wr);
      if (!fila || fila.ancho + SEP_X + ancho > x1 - x0) { fila = { items: [], ancho: -SEP_X, alto: 0 }; filas.push(fila); }
      fila.items.push({ b, w, h, ancho, rows, cols });
      fila.ancho += SEP_X + ancho;
      fila.alto = Math.max(fila.alto, h + (conRot ? ROT : 0));
    }
    const alto = filas.reduce((a, f) => a + f.alto, 0) + SEP_Y * Math.max(0, filas.length - 1);
    const anchoMax = Math.max(0, ...filas.map(f => f.ancho));
    return { filas, alto, anchoMax };
  }

  function geometria(datos, estado = {}) {
    const d = mezcla(datos, estado);
    const N = Math.max(1, entero(d.n) || 1);
    const conRot = d.rotulos !== false, colorRot = d.colorRotulos !== false;
    const lista = Array.isArray(d.formas) ? d.formas.map(([a, b]) => [Math.max(1, entero(a)), Math.max(1, entero(b))]) : parejas(N);
    const bs = lista.map(([filas, porFila]) => ({ filas, porFila, n: filas * porFila }));
    if (d.intento) {
      const c = Math.max(1, entero(d.intento)), q = Math.floor(N / c), r = N % c;
      if (r === 0) bs.push({ filas: q, porFila: c, n: N });
      else bs.push({ intento: true, porFila: c, llenas: q, sueltos: r, n: N });
    }
    for (const b of bs) b.rot = rotuloDe(b, colorRot);
    const letrero = segsDe(d.letrero), pie = segsDe(d.pie);
    const conPie = !!(datos && (datos.pie !== undefined || (datos.pasos || []).some(p => p && p.pie !== undefined)));
    const conLetrero = !!(datos && (datos.letrero !== undefined || (datos.pasos || []).some(p => p && p.letrero !== undefined)));
    const yA = M + (conLetrero ? LIN : 0) + 2, alto = d.alto ? Math.max(80, +d.alto) : null;
    const disponible = alto ? alto - yA - (conPie ? LIN + 2 : 0) - M - 2 : Infinity;
    let s = 22, ac = acomodar(bs, s, conRot, X0, X1);
    while (s > 3 && (ac.alto > disponible || ac.anchoMax > X1 - X0 || ac.filas.some(f => f.items.some(it => it.w > X1 - X0)))) { s -= 0.25; ac = acomodar(bs, s, conRot, X0, X1); }
    const objetos = [], textos = [], bandejas = [], rot = [];
    const tx = (que, x, y, segs, o = {}) => {
      const w = segsAncho(segs, o.tam || TAM), xa = o.ancla === 'middle' ? x - w / 2 : x;
      textos.push({ que, txt: segs.map(z => z[0]).join(''), x0: xa, x1: xa + w, y0: y - (o.tam || TAM) * 0.8, y1: y + (o.tam || TAM) * 0.25 });
      rot.push({ x, y, segs, o });
    };
    if (letrero) tx('letrero', X0, M + 15, letrero);
    // Con alto fijo, las bandejas van centradas en el alto libre (no queda una franja vacía abajo).
    let y = yA + (alto ? Math.max(0, (disponible - ac.alto) / 2) : 0);
    for (const f of ac.filas) {
      let x = X0 + ((X1 - X0) - f.ancho) / 2;
      for (const it of f.items) {
        const cx = x + it.ancho / 2, yr = y + (conRot ? ROT : 0);
        if (conRot) tx(`rótulo ${it.b.rot.map(z => z[0]).join('')}`, cx, y + 14, it.b.rot, { ancla: 'middle' });
        const bx = cx - it.w / 2;
        const caja = { x: bx, y: yr, w: it.w, h: it.h };
        objetos.push({ que: `bandeja ${it.b.intento ? 'intento' : `${it.b.filas}×${it.b.porFila}`}`, x0: bx, y0: yr, x1: bx + it.w, y1: yr + it.h });
        // Los caramelos: centro de cada lugar.
        const lugares = [];
        const total = it.b.intento ? it.b.llenas * it.b.porFila + it.b.sueltos : it.b.n;
        for (let k = 0; k < it.rows * it.cols; k++) {
          const i = Math.floor(k / it.cols), j = k % it.cols;
          const tipo = k < (it.b.intento ? it.b.llenas * it.b.porFila : total) ? 'lleno' : k < total ? 'suelto' : 'vacio';
          lugares.push({ x: bx + PAD + (j + 0.5) * s, y: yr + PAD + (i + 0.5) * s, tipo });
        }
        bandejas.push({ b: it.b, caja, lugares, s });
        x += it.ancho + SEP_X;
      }
      y += f.alto + SEP_Y;
    }
    const yFin = y - SEP_Y;
    if (pie) tx('pie', X0, (alto ? alto - M - 6 : yFin + 18), pie);
    const H = Math.round(alto || (yFin + (conPie ? LIN + 4 : 0) + M + 2));
    return { W, H, M, d, N, s, bandejas, objetos, textos, rot };
  }

  // Un caramelo redondo con su envoltura: un círculo y las dos puntas torcidas, a los lados.
  function caramelo(x, y, s) {
    const r = s * 0.3, t = s * 0.17, hh = s * 0.13;
    return `M${n2(x - r)} ${n2(y)}A${n2(r)} ${n2(r)} 0 1 0 ${n2(x + r)} ${n2(y)}A${n2(r)} ${n2(r)} 0 1 0 ${n2(x - r)} ${n2(y)}Z`
      + `M${n2(x - r + 0.3)} ${n2(y)}L${n2(x - r - t)} ${n2(y - hh)}L${n2(x - r - t)} ${n2(y + hh)}Z`
      + `M${n2(x + r - 0.3)} ${n2(y)}L${n2(x + r + t)} ${n2(y - hh)}L${n2(x + r + t)} ${n2(y + hh)}Z`;
  }

  // ---------- Dibujo ----------
  function dibujar(datos, estado = {}) {
    const g = geometria(datos, estado);
    let s = '';
    for (const bd of g.bandejas) {
      const c = bd.caja;
      // La bandeja: fondo de tarjeta, borde y una ceja abajo (el canto).
      s += `<rect x="${n2(c.x)}" y="${n2(c.y)}" width="${n2(c.w)}" height="${n2(c.h)}" rx="4" fill="var(--card)" stroke="currentColor" stroke-width="1.5"/>`;
      s += `<path d="M${n2(c.x + 3)} ${n2(c.y + c.h + 2)}H${n2(c.x + c.w - 3)}" stroke="currentColor" stroke-width="1.2" stroke-opacity="0.45" stroke-linecap="round"/>`;
      let llenos = '', sueltos = '', vacios = '';
      for (const l of bd.lugares) {
        if (l.tipo === 'lleno') llenos += caramelo(l.x, l.y, bd.s);
        else if (l.tipo === 'suelto') sueltos += caramelo(l.x, l.y, bd.s);
        else vacios += `M${n2(l.x - bd.s * 0.3)} ${n2(l.y)}A${n2(bd.s * 0.3)} ${n2(bd.s * 0.3)} 0 1 0 ${n2(l.x + bd.s * 0.3)} ${n2(l.y)}A${n2(bd.s * 0.3)} ${n2(bd.s * 0.3)} 0 1 0 ${n2(l.x - bd.s * 0.3)} ${n2(l.y)}Z`;
      }
      if (llenos) s += `<path d="${llenos}" fill="currentColor" fill-opacity="0.28" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/>`;
      if (sueltos) s += `<path class="bd-suelto" d="${sueltos}" fill="var(--c-o)" fill-opacity="0.22" stroke="var(--c-o)" stroke-width="1.3" stroke-dasharray="2.5 1.6" stroke-linejoin="round"/>`;
      if (vacios) s += `<path class="bd-vacio" d="${vacios}" fill="none" stroke="currentColor" stroke-opacity="0.45" stroke-width="1" stroke-dasharray="2 2"/>`;
    }
    for (const r of g.rot) s += texto(r.x, r.y, r.segs, r.o);
    return T.svg(W, g.H, `<g class="kit-objeto" data-objeto="bandejas" data-prueba="si">${s}</g>`, { alt: alt(datos, estado) });
  }

  function alt(datos, estado = {}) {
    const g = geometria(datos, estado);
    const formas = g.bandejas.filter(b => !b.b.intento);
    let t = `Bandejas con ${g.N} ${g.N === 1 ? 'caramelo' : 'caramelos'} en filas iguales: `;
    t += formas.length ? formas.map(b => `${b.b.filas} ${b.b.filas === 1 ? 'fila' : 'filas'} de ${b.b.porFila}`).join(', ') + '.' : 'ninguna forma.';
    const it = g.bandejas.find(b => b.b.intento);
    if (it) t += ` Un intento con filas de ${it.b.porFila}: ${it.b.llenas} ${it.b.llenas === 1 ? 'fila llena' : 'filas llenas'} y ${it.b.sueltos === 1 ? 'sobra 1 caramelo' : `sobran ${it.b.sueltos} caramelos`}.`;
    return t;
  }

  return { id: 'arit-bandejas', dibujar, alt, geometria, parejas, constantes: { W, M, X0, X1 } };
});
