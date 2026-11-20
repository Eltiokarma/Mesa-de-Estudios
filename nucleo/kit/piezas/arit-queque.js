/*
 * Pieza «arit-queque» (19 nov 2026): el queque de la promoción en su bandeja, cortado en porciones, para «Números
 * racionales» (contenido/teoria/aritmetica/numeros-racionales.js, ideas 1, 2, 3 y 6; docs/etapa8/propuesta-aritmetica.md
 * §2). Dibujo de prueba (data-prueba): Gerson decide después si lo reemplaza (docs/plan-calidad.md, M4).
 *
 * Afirmación de la figura: un queque se corta en porciones iguales (columnas) y, si se pide, cada porción en pedazos
 * iguales (filas); lo vendido es un rectángulo de esa grilla. Todas las bandejas de una figura son iguales y van a la
 * misma escala: lo que se ve más grande es más queque.
 *
 * Fidelidad: un queque mide lo mismo en todas las bandejas de la figura (el ancho sale de la bandeja con más queques). Cada
 * porción mide 1/partes del queque y cada pedazo 1/filas de su porción; una marca de c0 a c1 (en porciones, contando de
 * izquierda a derecha por todos los queques de la bandeja) mide exactamente eso, también con fracciones de porción
 * (c1: 3,33 es un tercio de la cuarta porción). Nada se estira para que quepa un rótulo.
 *
 * datos = {
 *   bandejas: [{                  de una a tres, una debajo de otra
 *     partes: 5,                  porciones de cada queque (cortes de arriba abajo)
 *     filas: 1,                   pedazos de cada porción (cortes de izquierda a derecha); por defecto, 1
 *     cortaFilas: [c0, c1],       las filas se cortan solo en esas porciones (lo que quedó en la mañana); por defecto, todas
 *     queques: 1,                 queques en la bandeja (para una fracción mayor que 1); por defecto, 1
 *     marcas: [{ c0, c1, f0, f1, color: 'o' | 'i' | 'f' | null, estilo: 'lleno' | 'rayado' | 'borde', texto }],
 *                                 rectángulos de la grilla: porciones de c0 a c1 y filas de f0 a f1 (por defecto, todas).
 *                                 lleno: lo vendido; rayado: lo vendido después; borde: lo que se pide (sin relleno)
 *     rotulo: [[texto, color?, peso?], …] | 'texto',   arriba a la izquierda («Mañana: 2/3»)
 *     nota: [[texto, color?, peso?], …] | 'texto',     debajo de la bandeja
 *     paso: 0,                    aparece en el paso (antes se reserva su lugar)
 *   }],
 *   maxQueques: 2,                queques que caben a lo ancho (escala común); por defecto, el máximo de las bandejas
 *   filas: 2,                     bandejas reservadas (el alto no salta aunque una aparezca después)
 *   letrero, pie: [[texto, color?, peso?], …] | 'texto',
 *   pasos: [{ …datos }, …],       para «Mira»: estado.paso elige qué cambia (se mezcla con los datos)
 * }
 * estado = { paso }. Función pura de (datos, estado): sin ids, sin azar, sin reloj. Lienzo de 320 de ancho.
 * Colores: tinta (currentColor) y var(--c-*): lo vendido en naranja (o, el numerador: las porciones que se toman), lo que
 * se pide con borde violeta (f); el queque y sus cortes en tinta. Nunca verde. El color no es la única señal: lo vendido
 * va relleno o rayado y lo pedido con borde grueso, y el rótulo lo dice.
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
  const W = 320, M = 4, TAM = 13;
  const X0 = 14, X1 = 306, GAP = 10;            // la bandeja va de X0 a X1; entre dos queques de una bandeja, GAP
  const ROT = 18, NOTA = 19, SEP = 8;            // rótulo, nota y aire entre bandejas
  // El alto del queque depende de cuántas bandejas reserva la figura: con una sola, el queque es alto (la figura llena su
  // lugar en la pantalla, unos 200 px; lectura de la sesión, 19 nov); con tres, bajo. Dentro de una figura es el mismo.
  const ALTOS = [0, 100, 64, 46];
  const BORDE = 5;                               // lo que la bandeja asoma alrededor de los queques
  const COL = ['o', 'i', 'f'];
  const n2 = T.n;
  const num = x => (Number.isFinite(+x) ? +x : 0);
  const ent = (x, lo, hi, def) => { const v = Math.round(num(x)); return v >= lo && v <= hi ? v : def; };
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
    const bandejas = (Array.isArray(d.bandejas) ? d.bandejas : []).slice(0, 3);
    const todos = [d, ...((datos && datos.pasos) || [])];
    // La escala y el alto se reservan con la figura más llena de todos los pasos (nada salta en «Mira»).
    const maxQ = Math.max(1, Math.min(3, num(d.maxQueques) || 0) || 0, ...todos.flatMap(x => (x && Array.isArray(x.bandejas) ? x.bandejas : []).map(b => ent(b && b.queques, 1, 3, 1))));
    const nFilas = Math.min(3, Math.max(1, num(d.filas), bandejas.length, ...todos.map(x => (x && Array.isArray(x.bandejas) ? x.bandejas.length : 0))));
    const ancho = (X1 - X0 - 2 * BORDE - (maxQ - 1) * GAP) / maxQ;
    const conLetrero = todos.some(x => x && x.letrero !== undefined);
    const conPie = todos.some(x => x && x.pie !== undefined);
    const letrero = segsDe(d.letrero), pie = segsDe(d.pie);
    const y0 = conLetrero ? 30 : 6;
    const ALTO = ALTOS[nFilas];
    const FILA = ROT + ALTO + 2 * BORDE + NOTA + SEP;
    const objetos = [], textos = [], filas = [];
    const tx = (que, x, y, segs, o = {}) => {
      const tam = o.tam || TAM, w = segsAncho(segs, tam);
      const x0 = o.ancla === 'middle' ? x - w / 2 : o.ancla === 'end' ? x - w : x;
      textos.push({ que, txt: segs.map(s => s[0]).join(''), x0, x1: x0 + w, y0: y - tam * 0.8, y1: y + tam * 0.25, x, y, segs, o });
    };
    if (letrero) tx('letrero', X0, 19, letrero, { peso: 700 });
    bandejas.forEach((b, k) => {
      b = b || {};
      const partes = ent(b.partes, 1, 24, 1), fs = ent(b.filas, 1, 8, 1), q = ent(b.queques, 1, 3, 1);
      const yR = y0 + k * FILA, yB = yR + ROT, yQ = yB + BORDE;
      const visible = (b.paso || 0) <= paso;
      const ancho1 = ancho / partes;
      const fila = { k, visible, partes, filas: fs, queques: q, bandeja: { x0: X0, x1: X0 + 2 * BORDE + q * ancho + (q - 1) * GAP, y0: yB, y1: yB + ALTO + 2 * BORDE },
        queque: [], marcas: [], c: b };
      if (visible) {
        const rot = segsDe(b.rotulo);
        if (rot) tx(`rótulo ${k}`, X0, yR + 13, rot);
        objetos.push({ que: `bandeja ${k}`, x0: fila.bandeja.x0, y0: fila.bandeja.y0, x1: fila.bandeja.x1, y1: fila.bandeja.y1 });
        for (let i = 0; i < q; i++) fila.queque.push({ x0: X0 + BORDE + i * (ancho + GAP), x1: X0 + BORDE + i * (ancho + GAP) + ancho, y0: yQ, y1: yQ + ALTO });
        const total = partes * q;
        const [cf0, cf1] = Array.isArray(b.cortaFilas) ? [Math.max(0, num(b.cortaFilas[0])), Math.min(total, num(b.cortaFilas[1]))] : [0, total];
        fila.cortaFilas = [cf0, cf1];
        for (const m of Array.isArray(b.marcas) ? b.marcas : []) {
          if (!m) continue;
          const c0 = Math.max(0, Math.min(total, num(m.c0))), c1 = Math.max(c0, Math.min(total, m.c1 === undefined ? total : num(m.c1)));
          const f0 = Math.max(0, Math.min(fs, num(m.f0))), f1 = Math.max(f0, Math.min(fs, m.f1 === undefined ? fs : num(m.f1)));
          if (c1 - c0 < 1e-9 || f1 - f0 < 1e-9) continue;
          // Una marca que cruza de un queque a otro se parte en un rectángulo por queque.
          const trozos = [];
          for (let i = 0; i < q; i++) {
            const a = Math.max(c0, i * partes), z = Math.min(c1, (i + 1) * partes);
            const qx = X0 + BORDE + i * (ancho + GAP);
            if (z - a > 1e-9) trozos.push({ x0: qx + (a - i * partes) * ancho1, x1: qx + (z - i * partes) * ancho1, y0: yQ + f0 * ALTO / fs, y1: yQ + f1 * ALTO / fs });
          }
          const mk = { c0, c1, f0, f1, color: COL.includes(m.color) ? m.color : null, estilo: ['lleno', 'rayado', 'borde'].includes(m.estilo) ? m.estilo : 'lleno', trozos, texto: m.texto };
          if (m.texto !== undefined && m.texto !== null && trozos.length) {
            const segs = segsDe(String(m.texto) === m.texto ? [[m.texto, mk.color, 700]] : m.texto);
            const t0 = trozos[0], w = segsAncho(segs, 12);
            if (t0.x1 - t0.x0 >= w + 6 && t0.y1 - t0.y0 >= 14) mk.rot = { x: (t0.x0 + t0.x1) / 2, y: (t0.y0 + t0.y1) / 2 + 4.3, segs, w };
          }
          fila.marcas.push(mk);
        }
        const nota = segsDe(b.nota);
        if (nota) tx(`nota ${k}`, X0, fila.bandeja.y1 + 15, nota);
      }
      fila.ancho1 = ancho1;
      filas.push(fila);
    });
    const yFin = y0 + nFilas * FILA - SEP;
    if (pie) tx('pie', X0, yFin + 16, pie);
    const H = Math.round(yFin + (conPie ? 24 : 4));
    return { W, H, M, d, ancho, maxQ, filas, objetos, textos, y0, nFilas, ALTO };
  }

  // ---------- Dibujo ----------
  // Rayas a 45° dentro de un rectángulo, cortadas a mano en sus bordes (sin patrón ni recorte: una pieza no lleva ids).
  function raya(t, c, paso = 6) {
    const a = t.x0 + 1, b = t.x1 - 1, y0 = t.y0 + 1, y1 = t.y1 - 1;
    if (b - a < 1 || y1 - y0 < 1) return '';
    let d = '';
    for (let k = a + y0 + paso / 2; k < b + y1; k += paso) {
      // La recta x + y = k dentro del rectángulo: de (k − y1, y1) a (k − y0, y0), recortada en x ∈ [a, b].
      let xa = k - y1, ya = y1, xb = k - y0, yb = y0;
      if (xa < a) { ya -= a - xa; xa = a; }
      if (xb > b) { yb += xb - b; xb = b; }
      if (xb - xa > 0.5) d += `M${n2(xa)} ${n2(ya)}L${n2(xb)} ${n2(yb)}`;
    }
    return d ? `<path class="aq-raya" d="${d}" stroke="${c}" stroke-width="1.6" stroke-opacity="0.9" fill="none"/>` : '';
  }
  function dibujar(datos, estado = {}) {
    const g = geometria(datos, estado);
    let s = '';
    for (const f of g.filas) {
      if (!f.visible) continue;
      const bj = f.bandeja;
      // La bandeja: un molde de lata con su borde (tinta tenue).
      s += `<rect class="aq-bandeja" x="${n2(bj.x0)}" y="${n2(bj.y0)}" width="${n2(bj.x1 - bj.x0)}" height="${n2(bj.y1 - bj.y0)}" rx="6" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-width="1.6" stroke-opacity="0.8"/>`;
      for (const qq of f.queque) {
        // El queque: bizcocho claro y una franja de cobertura arriba.
        s += `<rect class="aq-queque" x="${n2(qq.x0)}" y="${n2(qq.y0)}" width="${n2(qq.x1 - qq.x0)}" height="${n2(qq.y1 - qq.y0)}" rx="3" fill="currentColor" fill-opacity="0.09" stroke="currentColor" stroke-width="1.2"/>`;
        s += `<rect class="aq-cobertura" x="${n2(qq.x0 + 1)}" y="${n2(qq.y0 + 1)}" width="${n2(qq.x1 - qq.x0 - 2)}" height="4" rx="2" fill="currentColor" fill-opacity="0.16"/>`;
      }
      // Lo marcado va debajo de los cortes (así cada porción se sigue viendo).
      for (const m of f.marcas) for (const t of m.trozos) {
        const c = m.color ? T.color(m.color) : 'currentColor';
        if (m.estilo === 'borde') s += `<rect class="aq-marca aq-borde" x="${n2(t.x0 + 1.5)}" y="${n2(t.y0 + 1.5)}" width="${n2(Math.max(0.5, t.x1 - t.x0 - 3))}" height="${n2(Math.max(0.5, t.y1 - t.y0 - 3))}" rx="2" fill="none" stroke="${c}" stroke-width="3"/>`;
        else if (m.estilo === 'rayado') s += `<rect class="aq-marca aq-rayado" x="${n2(t.x0 + 0.6)}" y="${n2(t.y0 + 0.6)}" width="${n2(Math.max(0.5, t.x1 - t.x0 - 1.2))}" height="${n2(Math.max(0.5, t.y1 - t.y0 - 1.2))}" fill="${c}" fill-opacity="0.08" stroke="${c}" stroke-width="1.4"/>${raya(t, c)}`;
        else s += `<rect class="aq-marca aq-lleno" x="${n2(t.x0 + 0.6)}" y="${n2(t.y0 + 0.6)}" width="${n2(Math.max(0.5, t.x1 - t.x0 - 1.2))}" height="${n2(Math.max(0.5, t.y1 - t.y0 - 1.2))}" fill="${c}" fill-opacity="0.34" stroke="${c}" stroke-width="1.4"/>`;
      }
      // Los cortes: de arriba abajo entre porciones; de izquierda a derecha, entre pedazos (solo donde se cortó).
      for (let i = 0; i < f.queques; i++) {
        const qq = f.queque[i];
        for (let p = 1; p < f.partes; p++) { const x = qq.x0 + p * f.ancho1; s += `<line class="aq-corte" x1="${n2(x)}" y1="${n2(qq.y0)}" x2="${n2(x)}" y2="${n2(qq.y1)}" stroke="currentColor" stroke-width="1.3"/>`; }
        const a = Math.max(f.cortaFilas[0], i * f.partes), z = Math.min(f.cortaFilas[1], (i + 1) * f.partes);
        if (f.filas > 1 && z - a > 1e-9) {
          const xa = qq.x0 + (a - i * f.partes) * f.ancho1, xz = qq.x0 + (z - i * f.partes) * f.ancho1;
          for (let r = 1; r < f.filas; r++) { const y = qq.y0 + r * (qq.y1 - qq.y0) / f.filas; s += `<line class="aq-corte-fila" x1="${n2(xa)}" y1="${n2(y)}" x2="${n2(xz)}" y2="${n2(y)}" stroke="currentColor" stroke-width="1" stroke-dasharray="3 2"/>`; }
        }
      }
      for (const m of f.marcas) if (m.rot) s += texto(m.rot.x, m.rot.y, m.rot.segs, { tam: 12, ancla: 'middle' });
    }
    for (const t of g.textos) s += texto(t.x, t.y, t.segs, t.o);
    return T.svg(W, g.H, `<g class="kit-objeto" data-objeto="queque" data-prueba="si">${s}</g>`, { alt: alt(datos, estado) });
  }

  function alt(datos, estado = {}) {
    const g = geometria(datos, estado);
    const vis = g.filas.filter(f => f.visible);
    if (!vis.length) return 'Espacio para bandejas que todavía no aparecen.';
    const fr = x => String(Math.round(x * 100) / 100).replace('.', ',');
    const QUE = { lleno: 'vendido', rayado: 'vendido después', borde: 'lo que se pide' };
    const una = f => {
      let t = `Una bandeja con ${f.queques === 1 ? 'un queque' : `${f.queques} queques`} cortado${f.queques === 1 ? '' : 's'} en ${f.partes} ${f.partes === 1 ? 'porción' : 'porciones'}`;
      if (f.filas > 1) t += `, y ${f.cortaFilas[0] === 0 && f.cortaFilas[1] === f.partes * f.queques ? 'cada porción' : 'algunas porciones'} en ${f.filas} pedazos`;
      const ms = f.marcas.map(m => {
        const porciones = m.c1 - m.c0, parte = (m.f1 - m.f0) / f.filas;
        const cuanto = parte === 1 ? `${fr(porciones)} ${porciones === 1 ? 'porción' : 'porciones'}` : `${fr(porciones * (m.f1 - m.f0))} pedazos`;
        return `${cuanto} ${QUE[m.estilo]}`;
      });
      return t + (ms.length ? `: ${ms.join('; ')}` : '') + '.';
    };
    return vis.map(una).join(' ') + (vis.length > 1 ? ' Todos los queques son iguales.' : '');
  }

  return { id: 'arit-queque', dibujar, alt, geometria, constantes: { W, M, X0, X1, ALTOS } };
});
