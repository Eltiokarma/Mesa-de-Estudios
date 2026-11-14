/*
 * Pieza «arit-tiras» (aritmética; docs/teoria.md, sección 4): una o varias tiras horizontales a la MISMA escala,
 * partidas en tramos. Sirve para razones (dos tiras que se comparan), fracciones (la unidad partida en partes
 * iguales), reparto (el total que se corta en partes proporcionales), mezclas (lo que hay de soluto dentro del
 * total), interés (capas que se apilan sobre el capital) y MCD (cintas cortadas en trozos iguales).
 *
 * Afirmación de la figura: todas las tiras se miden con la misma regla; una parte vale lo que mide, no lo que se llama.
 *
 * Fidelidad: una sola escala (px por unidad) para todas las tiras. El largo dibujado de cada tramo es su valor por
 * esa escala; nada se estira para que quepa un rótulo (si no cabe adentro, el rótulo va debajo del tramo).
 *
 * datos = {
 *   max: 12,                          // el valor que ocupa todo el ancho (escala común)
 *   prefijo: '', sufijo: '', decimales: 2,   // cómo se escriben las cotas que la pieza calcula (no se usa en rótulos)
 *   regla: { paso: 1, cada: 2 } | null,      // rayitas comunes bajo la última tira (paso) y números cada `cada` rayitas
 *   tiras: [{
 *     rotulo: 'A',  color: 'o',       // nombre de la tira (arriba a la izquierda), en el color de su variable
 *     fin: '12 m',                    // rótulo al final de la tira (lo que mide toda la tira)
 *     paso: 0,                        // la tira aparece en el paso `paso` (0: desde el principio)
 *     tramos: [{ valor: 3, color: 'i', texto: '3', relleno: 0.3, discontinua: false, hueco: false,
 *                partes: 3,           // divisiones iguales dentro del tramo (rayas de 1 px)
 *                paso: 0 }]           // el tramo aparece en el paso `paso` (lo anterior se queda: rastro)
 *   }],
 *   filas: 3                          // filas que se reservan (el alto no cambia aunque una tira aparezca después)
 * }
 * estado = { paso: 0..n (o corte), fantasma: null | { tira: k, valor, rotulo } }   // fantasma: una marca discontinua sobre la tira k
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
  const W = 320, X0 = 10, X1 = 310, ARRIBA = 6, ROT = 18, ALTO_TIRA = 30, DEBAJO = 22, SEP = 10;
  const FILA = ROT + ALTO_TIRA + DEBAJO + SEP;

  function geometria(d) {
    const n = Math.max(d.filas || 0, (d.tiras || []).length, 1);
    const max = d.max > 0 ? d.max : 1;
    const x = v => X0 + (X1 - X0) * Math.max(0, v) / max;
    const regla = d.regla && d.regla.paso > 0;
    const alto = ARRIBA + FILA * n + (regla ? 30 : 0);
    return { n, max, x, alto, tiraY: k => ARRIBA + FILA * k + ROT, regla };
  }

  // Rótulo de un tramo: adentro si cabe; si no, debajo, centrado y encajado en el lienzo.
  function rotuloTramo(xa, xb, y, texto, c, clase) {
    const w = T.ancho(texto, T.TEXTO, 700);
    if (xb - xa >= w + 8) return T.rotulo((xa + xb) / 2, y + ALTO_TIRA / 2 + 6, texto, { ancla: 'middle', peso: 700, clase });
    return T.rotulo((xa + xb) / 2, y + ALTO_TIRA + 17, texto, { ancla: 'middle', peso: 700, color: c, clase });
  }

  function dibujar(d, estado = {}) {
    const g = geometria(d);
    const paso = Math.max(0, estado.paso || estado.corte || 0);   // acepta paso o corte, como las demás piezas
    const nuevo = p => ((p || 0) === paso && paso > 0 ? ' kit-nuevo' : '');
    let s = '';
    (d.tiras || []).forEach((t, k) => {
      if ((t.paso || 0) > paso) return;
      const y = g.tiraY(k), cl = nuevo(t.paso);
      let cuerpo = '';
      if (t.rotulo) cuerpo += T.rotulo(X0, y - 5, t.rotulo, { color: t.color, peso: 700, clase: 'kit-aparece' + cl });
      let v = 0;
      for (const tr of t.tramos || []) {
        const a = v, b = v + Math.max(0, tr.valor || 0);
        v = b;
        if ((tr.paso || 0) > paso) continue;
        const xa = g.x(a), xb = g.x(b), cc = tr.color || t.color, ct = nuevo(tr.paso);
        if (tr.hueco) cuerpo += `<rect class="kit-aparece${ct}" x="${T.n(xa)}" y="${y}" width="${T.n(xb - xa)}" height="${ALTO_TIRA}" rx="4" fill="none" stroke="currentColor" stroke-width="${T.GROSOR.cuadricula}" stroke-dasharray="3 4" opacity="0.7"/>`;
        else cuerpo += T.barra(xa, y, xb - xa, ALTO_TIRA, { color: cc, relleno: tr.relleno === undefined ? 0.22 : tr.relleno, discontinua: tr.discontinua, grosor: T.GROSOR.contorno, clase: 'kit-crece' + ct });
        if (tr.partes > 1) for (let i = 1; i < tr.partes; i++) {
          const xi = xa + (xb - xa) * i / tr.partes;
          cuerpo += T.linea(xi, y + 3, xi, y + ALTO_TIRA - 3, { grosor: T.GROSOR.cuadricula, color: cc, clase: 'kit-crece' + ct });
        }
        if (tr.texto) cuerpo += rotuloTramo(xa, xb, y, tr.texto, cc, 'kit-aparece' + ct);
      }
      // El contorno de toda la tira (3 px: la cantidad en estudio) y su rótulo final.
      if ((t.tramos || []).length > 1 && !t.sinContorno) {
        const total = (t.tramos || []).filter(tr => (tr.paso || 0) <= paso).reduce((u, tr) => u + tr.valor, 0);
        if (total > 0) cuerpo += `<rect x="${T.n(X0)}" y="${y}" width="${T.n(g.x(total) - X0)}" height="${ALTO_TIRA}" rx="4" fill="none" stroke="${T.color(t.color)}" stroke-width="${T.GROSOR.variable}" stroke-linejoin="round"/>`;
      }
      if (t.fin) {
        const xf = g.x(v), w = T.ancho(t.fin, T.TEXTO, 700);
        cuerpo += xf + 8 + w <= W - 2
          ? T.rotulo(xf + 6, y + ALTO_TIRA / 2 + 6, t.fin, { color: t.color, peso: 700, clase: 'kit-aparece' + cl })
          : T.rotulo(X1, y - 5, t.fin, { color: t.color, peso: 700, ancla: 'end', clase: 'kit-aparece' + cl });
      }
      s += `<g class="kit-tira">${cuerpo}</g>`;
    });
    if (g.regla) {
      const y = ARRIBA + FILA * g.n + 4, marcas = [], r = d.regla;
      for (let u = 0; u <= g.max + 1e-9; u += r.paso) marcas.push(g.x(u));
      s += T.eje(X0, X1, y, { marcas, alto: 5, clase: 'kit-eje kit-tenue' });
      const cada = Math.max(1, r.cada || 1);
      marcas.forEach((x, i) => { if (i % cada === 0) s += T.rotulo(x, y + 20, Kit.formatear(i * r.paso, 2), { ancla: 'middle', clase: 'kit-num kit-tenue' }); });
    }
    const f = estado.fantasma;
    if (f && Number.isFinite(f.valor) && (d.tiras || [])[f.tira]) {
      const x = g.x(Math.min(f.valor, g.max)), y = g.tiraY(f.tira);
      s += `<g class="kit-fantasma">${T.linea(x, y - 6, x, y + ALTO_TIRA + 6, { discontinua: true, grosor: T.GROSOR.contorno, opacidad: 0.85 })}${f.rotulo ? T.rotulo(x, y + ALTO_TIRA + 18, f.rotulo, { ancla: 'middle' }) : ''}</g>`;
    }
    return T.svg(W, g.alto, s, { alt: alt(d) });
  }

  function alt(d) {
    if (d.alt) return d.alt;
    const ts = (d.tiras || []).map((t, k) => {
      const partes = (t.tramos || []).map(tr => tr.texto).filter(Boolean);
      return `${t.rotulo || `tira ${k + 1}`}${t.fin ? ` (${t.fin})` : ''}${partes.length ? ': ' + partes.join(', ') : ''}`;
    });
    return `Tiras a la misma escala: ${ts.join('; ') || 'sin tiras'}`;
  }

  return { id: 'arit-tiras', dibujar, alt, geometria };
});
