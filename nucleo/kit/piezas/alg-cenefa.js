/*
 * Pieza «alg-cenefa» (26 nov 2026, Etapa 9): las cenefas del maestro Rubén, el objeto de la unidad «Binomio de Newton»
 * (contenido/teoria/algebra/binomio-de-newton.js; docs/etapa9/propuesta-algebra.md §2). Dibujo de prueba (data-prueba):
 * Gerson decide después si lo reemplaza (docs/plan-calidad.md, M4).
 *
 * Afirmación de la figura: una cenefa es una fila de n losetas, y cada loseta es un paréntesis de (a + b)ⁿ: la loseta
 * naranja es elegir a y la turquesa es elegir b (en un trinomio, la verde es elegir c). Las cenefas con la misma
 * cantidad de cada color dan el mismo producto; cuántas son es el coeficiente de ese término.
 *
 * Cada loseta lleva su letra dentro (el color guía, la letra identifica: WCAG 1.4.1). Los tres colores tienen además
 * distinta opacidad de relleno (naranja la más clara, verde la más llena), para que se separen también en gris.
 *
 * Objetos:
 *   'cenefas'     una rejilla de cenefas.
 *                 datos = { objeto: 'cenefas',
 *                   patrones: [[0, 1, 1], …]   cada cenefa: 0 = loseta a, 1 = loseta b, 2 = loseta c;
 *                   letras: ['a', 'b', 'c']    lo que se escribe en cada loseta (un texto corto: «x²», «1/x»);
 *                   marca: 2                   índice de una cenefa que se rodea (la que se mira), o null;
 *                   arriba: segs | texto       una línea sobre la rejilla; abajo: segs | texto, otra debajo;
 *                   lado: 18                   lado de la loseta (de 14 a 40; con más cenefas, la pieza lo achica) }
 *   'grupos'      una fila por grupo: el grupo de cenefas con k losetas b, dicho por una cenefa de muestra y su cuenta.
 *                 datos = { objeto: 'grupos', n,
 *                   filas: [{ patron: [0, 0, 1], rotulo: '1 turquesa', cuenta: '× 3' | '?' | null, color: 'f' }],
 *                   letras, abajo: segs | texto (el total), arriba }
 *   'parentesis'  los n paréntesis «(a + b)» en fila, con la letra elegida en cada uno marcada y, debajo de cada
 *                 paréntesis, la loseta que le toca: la cenefa es la lista de elecciones.
 *                 datos = { objeto: 'parentesis', eleccion: [0, 1, 1, 0], terminos: ['a', 'b'] (los términos del
 *                   paréntesis, uno por letra), letras (lo que va en la loseta; por defecto, los términos),
 *                   abajo: segs | texto (el producto que sale), arriba }
 * segs: [[texto, color, peso], …] con color 'o' | 'i' | 'f' | 'd' | null (tinta).
 *
 * pasos: [{ …datos }, …] (para «Mira»): estado.paso elige cuál se mezcla con los datos.
 * estado = { paso }. Función pura de (datos, estado): sin ids, sin azar, sin reloj. Ancho 320; el alto sale
 * del contenido. Colores: tinta (currentColor) y var(--c-o|i|d|f). Nunca carmín. geometria(datos) da las cajas de todo
 * lo dibujado (losetas, marcas y textos) para la prueba numérica de encuadre (cabe).
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
  const W = 320, M = 4, TAM = 14;
  const n2 = T.n;
  const TONO = ['o', 'i', 'd'], RELLENO = [0.10, 0.26, 0.42];
  const LETRAS = ['a', 'b', 'c'];
  const segsDe = x => (x === null || x === undefined || x === false ? [] : Array.isArray(x) ? x.map(s => (Array.isArray(s) ? s : [String(s), null, 400])) : [[String(x), null, 700]]);
  const anchoSegs = (segs, tam) => segs.reduce((a, s) => a + T.ancho(s[0], tam, s[2] || 400), 0);
  function ponTexto(textos, que, x, y, segs, ancla = 'start', tam = TAM) {
    const w = anchoSegs(segs, tam), x0 = ancla === 'end' ? x - w : ancla === 'middle' ? x - w / 2 : x;
    textos.push({ que, txt: segs.map(s => s[0]).join(''), x0, x1: x0 + w, y0: y - tam * 0.8, y1: y + tam * 0.25, segs, x, y, tam, ancla });
  }
  function texto(t) {
    const spans = t.segs.map(([s, c, p]) => `<tspan fill="${T.color(c)}"${p && p !== 400 ? ` font-weight="${p}"` : ''}>${T.esc(s)}</tspan>`).join('');
    return `<text class="kit-txt" x="${n2(t.x)}" y="${n2(t.y)}" font-size="${t.tam}"${t.ancla !== 'start' ? ` text-anchor="${t.ancla}"` : ''} style="font-variant-numeric:tabular-nums">${spans}</text>`;
  }
  const letraDe = (d, j) => String((d.letras || d.terminos || LETRAS)[j] === undefined ? LETRAS[j] : (d.letras || d.terminos || LETRAS)[j]);
  // El tamaño de la letra dentro de una loseta: cabe en el lado con 3 de aire a cada lado. Sin el halo de .kit-txt
  // (style stroke:none): en una loseta chica, el halo de 4 px tapaba el «1/x» con una mancha (lector en frío, 26 nov).
  const tamLetra = (txt, lado) => { let t = Math.min(16, Math.max(9, lado * 0.62)); while (t > 8 && T.ancho(txt, t, 700) > lado - 6) t -= 0.5; return t; };

  // Una cenefa desde (x, y): sus losetas, de lado `lado`, pegadas con 1 de junta.
  function cenefa(objetos, patron, x, y, lado, que = 'loseta') {
    patron.forEach((j, i) => objetos.push({ que, j: Math.max(0, Math.min(2, j | 0)), x0: x + i * (lado + 1), y0: y, x1: x + i * (lado + 1) + lado, y1: y + lado }));
    return patron.length * (lado + 1) - 1;
  }

  // pasos: [{ …datos }, …] para «Mira»: estado.paso elige cuál se mezcla con los datos (puede cambiar de objeto).
  function mezcla(datos, estado) {
    const ps = (datos && datos.pasos) || [];
    const p = ps[Math.max(0, Math.min(ps.length - 1, (estado && estado.paso) | 0))];
    const d = Object.assign({}, datos || {}, p || {});
    delete d.pasos;
    return d;
  }

  function geometria(datos, estado) {
    const d = mezcla(datos, estado);
    const objeto = d.objeto || 'cenefas';
    const objetos = [], textos = [], marcas = [];
    let y = M;
    const arriba = segsDe(d.arriba);
    if (arriba.length) { ponTexto(textos, 'arriba', W / 2, y + TAM, arriba, 'middle'); y += TAM + 10; }
    if (objeto === 'parentesis') {
      const el = (d.eleccion || [0, 1]).map(j => j | 0), terms = (d.terminos || LETRAS).map(String);
      // Entre dos términos va « + », o solo un espacio si el término ya trae su signo («2x − 1»).
      const sep = t => (/^[−-]/.test(t) ? ' − ' : ' + ');
      const sinSigno = t => t.replace(/^[−-]/, '');
      // Cada paréntesis «(a + b)»: el ancho sale de sus términos; la letra baja de 14 a 11 si los n no caben.
      let tam = TAM;
      const anchoDe = tm => T.ancho('(', tm) * 2 + terms.reduce((a, t, j) => a + T.ancho(j ? sinSigno(t) : t, tm, 700) + (j ? T.ancho(sep(t), tm) : 0), 0);
      while (tam > 11 && el.length * anchoDe(tam) + (el.length - 1) * 4 > W - 2 * M) tam -= 0.5;
      const anchoPar = anchoDe(tam);
      const hueco = Math.max(4, Math.min(14, (W - 2 * M - el.length * anchoPar) / Math.max(1, el.length - 1)));
      const total = el.length * anchoPar + (el.length - 1) * hueco, x0 = (W - total) / 2;
      const yp = y + tam + 4;
      const lado = Math.max(14, Math.min(30, anchoPar - 6));
      el.forEach((elegida, i) => {
        const xi = x0 + i * (anchoPar + hueco);
        let xx = xi + T.ancho('(', tam);
        const segs = [['(', null, 400]];
        terms.forEach((t, j) => {
          if (j) { segs.push([sep(t), null, 400]); xx += T.ancho(sep(t), tam); }
          const vis = j ? sinSigno(t) : t;   // el signo de b va en el separador: «(2x − 1)»
          segs.push([vis, j === elegida ? TONO[j] : null, 700]);
          const w = T.ancho(vis, tam, 700);
          // La marca: una raya gruesa bajo el término elegido, en su color.
          if (j === elegida) marcas.push({ que: 'marca', j, x0: xx - 1, y0: yp + 4, x1: xx + w + 1, y1: yp + 7 });
          xx += w;
        });
        segs.push([')', null, 400]);
        ponTexto(textos, 'parentesis', xi, yp, segs, 'start', tam);
        cenefa(objetos, [elegida], xi + anchoPar / 2 - lado / 2, yp + 16, lado);
      });
      y = yp + 16 + lado + 6;
    } else if (objeto === 'grupos') {
      const filas = d.filas || [], n = Math.max(1, ...filas.map(f => (f.patron || []).length));
      const anchoRot = Math.max(0, ...filas.map(f => T.ancho(String(f.rotulo || ''), TAM, 400)));
      const anchoCta = Math.max(0, ...filas.map(f => T.ancho(String(f.cuenta === null || f.cuenta === undefined ? '' : f.cuenta), TAM, 700)));
      // El lado de la loseta baja de 22 a 12 hasta que el rótulo, la cenefa y la cuenta quepan en el ancho.
      let lado = Math.max(12, Math.min(d.lado || 20, 22));
      while (lado > 12 && anchoRot + 10 + n * (lado + 1) - 1 + 12 + anchoCta > W - 2 * M) lado -= 1;
      const anchoCen = n * (lado + 1) - 1;
      const total = anchoRot + 10 + anchoCen + 12 + anchoCta, x0 = Math.max(M, (W - total) / 2);
      filas.forEach((f, i) => {
        const yy = y + i * (lado + 6);
        if (f.rotulo) ponTexto(textos, 'rotulo', x0 + anchoRot, yy + lado * 0.72, [[String(f.rotulo), null, 400]], 'end');
        cenefa(objetos, f.patron || [], x0 + anchoRot + 10, yy, lado);
        if (f.cuenta !== null && f.cuenta !== undefined) ponTexto(textos, 'cuenta', x0 + anchoRot + 10 + anchoCen + 12, yy + lado * 0.72, [[String(f.cuenta), f.cuenta === '?' ? null : (f.color === undefined ? 'f' : f.color), 700]], 'start');
      });
      y += filas.length * (lado + 6) + 2;
    } else {
      const ps = (d.patrones || []).filter(p => Array.isArray(p) && p.length);
      const n = Math.max(1, ...ps.map(p => p.length));
      // El lado: el pedido, achicado hasta que las cenefas quepan en el ancho con 12 de separación, en a lo más 7 filas.
      let lado = Math.max(14, Math.min(40, d.lado || 18));
      const cols = l => Math.max(1, Math.floor((W - 2 * M + 12) / (n * (l + 1) - 1 + 12)));
      while (lado > 12 && Math.ceil(ps.length / cols(lado)) > 7) lado -= 1;
      while (lado > 12 && cols(lado) < 1) lado -= 1;
      const c = Math.min(cols(lado), Math.max(1, ps.length)), anchoCen = n * (lado + 1) - 1;
      const filasN = Math.ceil(ps.length / c);
      const total = c * anchoCen + (c - 1) * 12, x0 = (W - total) / 2;
      ps.forEach((p, i) => {
        const fx = i % c, fy = Math.floor(i / c), xx = x0 + fx * (anchoCen + 12), yy = y + 4 + fy * (lado + 10);
        cenefa(objetos, p, xx, yy, lado);
        if (d.marca === i) marcas.push({ que: 'marca', j: null, x0: xx - 4, y0: yy - 4, x1: xx + anchoCen + 4, y1: yy + lado + 4 });
      });
      y += 4 + filasN * (lado + 10) - 2;
    }
    const abajo = segsDe(d.abajo);
    if (abajo.length) { ponTexto(textos, 'abajo', W / 2, y + TAM + 2, abajo, 'middle'); y += TAM + 8; }
    const H = Math.max(60, Math.ceil(y + M));
    return { W, H, M, d, objeto, objetos, textos, marcas };
  }

  function dibujar(datos, estado = {}) {
    const g = geometria(datos, estado), d = g.d;
    let s = '';
    for (const o of g.objetos) {
      const c = T.color(TONO[o.j]), lado = o.x1 - o.x0;
      s += `<rect x="${n2(o.x0)}" y="${n2(o.y0)}" width="${n2(lado)}" height="${n2(o.y1 - o.y0)}" rx="2" fill="${c}" fill-opacity="${RELLENO[o.j]}" stroke="${c}" stroke-width="1.6"/>`;
      const t = letraDe(d, o.j), tam = tamLetra(t, lado);
      s += `<text class="kit-txt" x="${n2((o.x0 + o.x1) / 2)}" y="${n2(o.y0 + lado / 2 + tam * 0.36)}" font-size="${n2(tam)}" font-weight="700" text-anchor="middle" fill="currentColor" style="stroke:none">${T.esc(t)}</text>`;
    }
    for (const m of g.marcas) s += m.j === null
      ? `<rect x="${n2(m.x0)}" y="${n2(m.y0)}" width="${n2(m.x1 - m.x0)}" height="${n2(m.y1 - m.y0)}" rx="5" fill="none" stroke="var(--c-f)" stroke-width="2"/>`
      : `<rect x="${n2(m.x0)}" y="${n2(m.y0)}" width="${n2(m.x1 - m.x0)}" height="${n2(m.y1 - m.y0)}" rx="1.5" fill="${T.color(TONO[m.j])}"/>`;
    for (const t of g.textos) s += texto(t);
    return T.svg(W, g.H, `<g class="kit-objeto" data-objeto="cenefa" data-prueba="si">${s}</g>`, { alt: alt(datos, estado) });
  }

  function alt(datos, estado) {
    const g = geometria(datos, estado), d = g.d;
    const cuenta = p => [0, 1, 2].map(j => p.filter(x => (x | 0) === j).length);
    const dice = p => { const c = cuenta(p); return [0, 1, 2].filter(j => c[j]).map(j => `${c[j]} ${letraDe(d, j)}`).join(', '); };
    const arr = segsDe(d.arriba).map(x => x[0]).join(''), ab = segsDe(d.abajo).map(x => x[0]).join('');
    let cuerpo;
    if (g.objeto === 'parentesis') cuerpo = `${(d.eleccion || []).length} paréntesis; en cada uno se elige: ${(d.eleccion || []).map(j => String((d.terminos || LETRAS)[j])).join(', ')}`;
    else if (g.objeto === 'grupos') cuerpo = `Cenefas juntas por grupos: ${(d.filas || []).map(f => `${f.rotulo || dice(f.patron || [])} ${f.cuenta === null || f.cuenta === undefined ? '' : f.cuenta}`.trim()).join('; ')}`;
    else cuerpo = `${(d.patrones || []).length} cenefas de losetas${(d.patrones || []).length ? `, como la de ${dice(d.patrones[0])}` : ''}`;
    return `${cuerpo}${arr ? `. Arriba: ${arr}` : ''}${ab ? `. Abajo: ${ab}` : ''}.`;
  }
  function cabe(datos, estado = {}) {
    const g = geometria(datos, estado);
    return [...g.objetos, ...g.textos, ...g.marcas].every(q => q.x0 >= M - 1e-9 && q.y0 >= M - 1e-9 && q.x1 <= W - M + 1e-9 && q.y1 <= g.H - M + 1e-9);
  }
  // Todas las cenefas de n losetas con k de b (y, en el trinomio, r de c), en orden de lectura: la primera tiene las b al
  // final. Lo usan la teoría y su prueba; no dibuja.
  function patrones(n, k, r = 0) {
    const out = [];
    const rec = (pre, quedaB, quedaC) => {
      const falta = n - pre.length;
      if (falta === 0) { if (!quedaB && !quedaC) out.push(pre); return; }
      if (falta > quedaB + quedaC) rec(pre.concat(0), quedaB, quedaC);
      if (quedaB) rec(pre.concat(1), quedaB - 1, quedaC);
      if (quedaC) rec(pre.concat(2), quedaB, quedaC - 1);
    };
    if (k >= 0 && r >= 0 && k + r <= n) rec([], k, r);
    return out;
  }
  return { id: 'alg-cenefa', dibujar, alt, geometria, cabe, patrones, constantes: { W, M } };
});
