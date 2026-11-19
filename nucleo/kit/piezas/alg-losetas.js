/*
 * Pieza «alg-losetas» (19 nov 2026): el pedido de losetas del maestro Rubén, el objeto de la unidad «Polinomios»
 * (contenido/teoria/algebra/polinomios.js; docs/etapa5/propuesta-algebra.md §2). Dibujo de prueba (data-prueba): Gerson
 * decide después si lo reemplaza (docs/plan-calidad.md, M4).
 *
 * Afirmación de la figura: un polinomio es un pedido de piezas; solo se juntan en un montón las piezas de la misma
 * forma, y de cada forma se suman las cantidades. La loseta (x por x) cubre x², la tira (x por 1) cubre x y el
 * cuadradito (1 por 1) cubre 1. La letra es una medida (el lado de la loseta, en dm), no la pieza.
 *
 * Objetos:
 *   'piezas'  las tres piezas de la tienda con sus medidas: la loseta, la tira y el cuadradito.
 *             datos = { objeto: 'piezas', areas: true (bajo cada una, la cuenta de lo que cubre: «x · x = x²») }.
 *   'pedido'  de una a tres filas de piezas (los pedidos), con las formas en columnas, como una suma en el cuaderno, y
 *             debajo de la raya los pedidos juntos: cada montón conserva el color del pedido del que vino.
 *             datos = { objeto: 'pedido',
 *               filas: [{ nombre: 'Pedido 1', cuenta: [losetas, tiras, cuadraditos], color: 'o' | 'i' | null,
 *                         rotulo: undefined (nombre y polinomio) | false (solo el nombre) | '?' | texto }],
 *               juntos: true | false,           la fila de abajo, con todas las piezas
 *               terminos: true | '?' | false,   bajo cada montón de «Juntos», su término en violeta, «?» en tinta o nada
 *               columnas: false,                sin columnas por forma: cada fila arranca en el borde (dos pedidos
 *                                               que se comparan y no se suman; no va con juntos)
 *               nombreJuntos: 'Juntos',
 *               tope: [4, 7, 5] }.            tope reserva las columnas para esa cantidad (el juego: nada se corre)
 *             Capacidad: la unidad (1 dm) baja de 18 a 6 hasta que todo quepa; con más piezas que eso (por ejemplo, 7
 *             losetas, 13 tiras y 19 cuadraditos juntos) ya no cabe y cabe(datos) lo dice: la unidad que use la pieza
 *             lo comprueba en su prueba (aquí no se quita ninguna pieza: la figura no miente sobre la cantidad).
 *   'giro'    piezas rectangulares de x por y: unas echadas (xy) y otras giradas (yx); juntas, todas echadas.
 *             datos = { objeto: 'giro', a: 2, b: 3 (cuántas echadas y cuántas giradas; b = 0: solo las echadas),
 *               rotulos: true | false (los términos «2xy» y «3yx» sobre cada grupo), medidas: true (x e y en los lados),
 *               juntas: false | true | '?' (abajo, las a + b echadas, con «5xy» en violeta o «?» en tinta),
 *               igual: true (entre los dos grupos, «la misma pieza») }.
 *   'lote'    un terreno rectangular con las medidas de dos lados escritas con letras (ejemplos de perímetro).
 *             datos = { objeto: 'lote', largo: '3x + 2', ancho: 'x + 5', unidad: 'm', dentro: texto | false }.
 *   pasos: [{ …datos }, …] para «Mira»: estado.paso elige qué cambia (se mezcla con los datos; puede cambiar de objeto).
 *
 * estado = { paso }. Función pura de (datos, estado): sin ids, sin azar, sin reloj. Lienzo de 320 × 214.
 * Colores: tinta (currentColor) y var(--c-*): el pedido 1 en naranja (o), el pedido 2 en turquesa (i), el término que
 * resulta en violeta (f). Lo que se pide va con «?» en tinta. Nunca carmín ni verde. La forma dice qué pieza es; el
 * color solo dice de qué pedido vino (WCAG 1.4.1).
 * geometria(datos, estado) da las cajas de todo lo dibujado (objetos y textos) para la prueba numérica de encuadre.
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
  const W = 320, H = 214, M = 4, TAM = 13;
  const n2 = T.n;
  const entero = v => Math.max(0, Math.floor(+v || 0));

  function mezcla(datos, estado) {
    const ps = (datos && datos.pasos) || [];
    const p = ps[Math.max(0, Math.min(ps.length - 1, (estado && estado.paso) | 0))];
    const d = Object.assign({}, datos || {}, p || {});
    delete d.pasos;
    return d;
  }

  // Texto de varios colores: segs = [[texto, color?, peso?], …].
  const anchoSegs = (segs, tam) => segs.reduce((a, s) => a + T.ancho(s[0], tam, s[2] || 400), 0);
  function texto(t) {
    const spans = t.segs.map(([s, c, p]) => `<tspan fill="${T.color(c)}"${p && p !== 400 ? ` font-weight="${p}"` : ''}>${T.esc(s)}</tspan>`).join('');
    return `<text class="kit-txt" x="${n2(t.x)}" y="${n2(t.y)}" font-size="${t.tam}"${t.ancla !== 'start' ? ` text-anchor="${t.ancla}"` : ''} style="font-variant-numeric:tabular-nums">${spans}</text>`;
  }
  // Caja de un texto (para la prueba): de y − 0,8·tam a y + 0,25·tam.
  function ponTexto(textos, que, x, y, segs, ancla = 'start', tam = TAM) {
    const w = anchoSegs(segs, tam), x0 = ancla === 'end' ? x - w : ancla === 'middle' ? x - w / 2 : x;
    textos.push({ que, txt: segs.map(s => s[0]).join(''), x0, x1: x0 + w, y0: y - tam * 0.8, y1: y + tam * 0.25, segs, x, y, tam, ancla });
  }

  // El polinomio de un pedido: [2, 3, 1] → «2x² + 3x + 1» (el 1 delante de la letra no se escribe).
  const TERM = ['x²', 'x', ''];
  const termino = (n, k) => (k === 2 ? String(n) : `${n === 1 ? '' : n}${TERM[k]}`);
  const polinomio = c => c.map((n, k) => (n > 0 ? termino(n, k) : null)).filter(Boolean).join(' + ') || '0';
  const NOMBRES = [['loseta', 'losetas'], ['tira', 'tiras'], ['cuadradito', 'cuadraditos']];
  const cuantas = c => c.map((n, k) => (n > 0 ? `${n} ${NOMBRES[k][n === 1 ? 0 : 1]}` : null)).filter(Boolean).join(', ') || 'ninguna pieza';

  // Una pieza: rectángulo con su borde y, si es loseta, el bisel de adentro (se lee como baldosa y no como casilla).
  function pieza(x, y, w, h, color, clase) {
    const c = T.color(color);
    let s = `<rect class="alg-pieza ${clase}" x="${n2(x + 0.75)}" y="${n2(y + 0.75)}" width="${n2(w - 1.5)}" height="${n2(h - 1.5)}" rx="1.5" fill="${c}" fill-opacity="0.2" stroke="${c}" stroke-width="1.5"/>`;
    if (clase === 'loseta' && w >= 18) s += `<rect x="${n2(x + 4)}" y="${n2(y + 4)}" width="${n2(w - 8)}" height="${n2(h - 8)}" rx="1" fill="none" stroke="${c}" stroke-opacity="0.45" stroke-width="1"/>`;
    return s;
  }

  // ---------- Objeto 'piezas': la loseta, la tira y el cuadradito con sus medidas ----------
  const PZ = { u: 26, y1: 160, y1Areas: 146 };
  function geoPiezas(d) {
    const u = PZ.u, L = 3 * u, y1 = d.areas ? PZ.y1Areas : PZ.y1, y0 = y1 - L;
    const objetos = [], textos = [], formas = [];
    const cols = [
      { que: 'loseta', x: 44, w: L, h: L, bajo: 'x dm', lado: 'x dm', area: 'x · x = x²' },
      { que: 'tira', x: 176, w: u, h: L, bajo: '1 dm', lado: 'x dm', area: 'x · 1 = x' },
      { que: 'cuadradito', x: 262, w: u, h: u, bajo: '1 dm', lado: '1 dm', area: '1 · 1 = 1' },
    ];
    for (const c of cols) {
      const y = y1 - c.h, cx = c.x + c.w / 2;
      formas.push({ que: c.que, x: c.x, y, w: c.w, h: c.h });
      objetos.push({ que: c.que, x0: c.x, y0: y, x1: c.x + c.w, y1 });
      ponTexto(textos, 'nombre', cx, y0 - 12, [[c.que, null, 700]], 'middle');
      ponTexto(textos, 'bajo', cx, y1 + 17, [[c.bajo]], 'middle');
      ponTexto(textos, 'lado', c.x - 7, y + c.h / 2 + 4, [[c.lado]], 'end');
      if (d.areas) ponTexto(textos, 'area', cx, y1 + 40, [[c.area, null, 700]], 'middle');
    }
    return { W, H, M, d, u, formas, objetos, textos };
  }
  function dibPiezas(datos, estado) {
    const g = geometria(datos, estado);
    let s = '';
    for (const f of g.formas) s += pieza(f.x, f.y, f.w, f.h, null, f.que);
    for (const t of g.textos) s += texto(t);
    return T.svg(W, H, `<g class="kit-objeto" data-objeto="piezas" data-prueba="si">${s}</g>`, { alt: alt(datos, estado) });
  }
  const altPiezas = d => `Las tres piezas de la tienda: la loseta, un cuadrado de x dm de lado; la tira, de x dm por 1 dm; y el cuadradito, de 1 dm por 1 dm.${d.areas ? ' La loseta cubre x por x, que es x al cuadrado; la tira cubre x por 1, que es x; el cuadradito cubre 1.' : ''}`;

  // ---------- Objeto 'pedido': filas de piezas en columnas por forma y, bajo la raya, los pedidos juntos ----------
  const PD = { uMax: 18, uMin: 6, sepL: 3, sepT: 2, sepG: 12, rot: 16, bajo: 8 };
  function geoPedido(d) {
    const filas = (Array.isArray(d.filas) ? d.filas : []).slice(0, 3).map(f => ({ nombre: f.nombre || 'Pedido', cuenta: [0, 1, 2].map(k => entero((f.cuenta || [])[k])), color: f.color === 'o' || f.color === 'i' ? f.color : null, rotulo: f.rotulo }));
    const juntos = d.juntos === true && filas.length > 0;
    const total = [0, 1, 2].map(k => filas.reduce((a, f) => a + f.cuenta[k], 0));
    const hay = juntos ? total : [0, 1, 2].map(k => Math.max(0, ...filas.map(f => f.cuenta[k])));
    // Con `tope`, las columnas se reservan para esa cantidad: en el juego nada se corre ni cambia de escala al agregar
    // una pieza (el alumno compara el antes y el después en el mismo lugar).
    const tope = hay.map((n, k) => Math.max(n, entero((d.tope || [])[k])));
    const colsC = Math.ceil(tope[2] / 3);
    // Ancho de las tres columnas con la unidad u (1 dm): las losetas de 3u, las tiras de u y los cuadraditos de a 3.
    const anchos = u => [tope[0] ? tope[0] * 3 * u + (tope[0] - 1) * PD.sepL : 0, tope[1] ? tope[1] * u + (tope[1] - 1) * PD.sepT : 0, colsC ? colsC * u + (colsC - 1) * PD.sepT : 0];
    const anchoDe = u => { const a = anchos(u).filter(w => w > 0); return a.reduce((x, y) => x + y, 0) + Math.max(0, a.length - 1) * PD.sepG; };
    // La unidad más grande que cabe a lo ancho y a lo alto (con los dos pedidos y «Juntos» sale 12).
    const conTerm = juntos && d.terminos !== false && d.terminos !== undefined;
    const altoDe = u => filas.length * (PD.rot + 3 * u + PD.bajo) + (juntos ? 6 + PD.rot + 3 * u + (conTerm ? 18 : 0) : -PD.bajo);
    let u = PD.uMax;
    while (u > PD.uMin && (anchoDe(u) > W - 2 * M - 8 || altoDe(u) > H - 2 * M - 2)) u--;
    const aw = anchos(u), ancho = anchoDe(u);
    const objetos = [], textos = [], formas = [];
    // Rótulo de cada fila y su ancho, para centrar el conjunto.
    const rotuloDe = f => (f.rotulo === false ? f.nombre : f.rotulo === undefined ? `${f.nombre}: ${polinomio(f.cuenta)}` : `${f.nombre}: ${f.rotulo}`);
    const rotulos = filas.map(rotuloDe), nomJ = d.nombreJuntos || 'Juntos';
    const anchoRot = Math.max(0, ...rotulos.map(r => T.ancho(r, TAM, 700)), juntos ? T.ancho(nomJ, TAM, 700) : 0);
    const x0 = Math.max(M + 4, (W - Math.max(ancho, anchoRot)) / 2);
    const xsCol = [x0, 0, 0];
    xsCol[1] = xsCol[0] + aw[0] + (aw[0] ? PD.sepG : 0);
    xsCol[2] = xsCol[1] + aw[1] + (aw[1] ? PD.sepG : 0);
    const xs = xsCol;
    const altoFila = 3 * u, altoTotal = altoDe(u);
    let y = Math.max(M + 2, (H - altoTotal) / 2);
    // Las piezas de una fila: grupos = [[cuenta, color], …] por orden; cada forma llena su columna de izquierda a derecha.
    const fila = (grupos, yTop, que) => {
      const pos = [0, 0, 0];
      // Sin columnas (dos pedidos que no se suman: «x + x» contra «x · x»), cada fila arranca en el borde.
      let xs = xsCol;
      if (d.columnas === false) {
        const hay = [0, 1, 2].map(k => grupos.reduce((a, g) => a + g[0][k], 0));
        const w = [hay[0] ? hay[0] * 3 * u + (hay[0] - 1) * PD.sepL : 0, hay[1] ? hay[1] * u + (hay[1] - 1) * PD.sepT : 0];
        xs = [x0, x0 + w[0] + (w[0] ? PD.sepG : 0), 0];
        xs[2] = xs[1] + w[1] + (w[1] ? PD.sepG : 0);
      }
      for (const [cuenta, color] of grupos) for (let k = 0; k < 3; k++) for (let j = 0; j < cuenta[k]; j++) {
        const i = pos[k]++;
        if (k === 0) formas.push({ que: 'loseta', x: xs[0] + i * (3 * u + PD.sepL), y: yTop, w: 3 * u, h: 3 * u, color, fila: que });
        else if (k === 1) formas.push({ que: 'tira', x: xs[1] + i * (u + PD.sepT), y: yTop, w: u, h: 3 * u, color, fila: que });
        else formas.push({ que: 'cuadradito', x: xs[2] + Math.floor(i / 3) * (u + PD.sepT), y: yTop + (2 - (i % 3)) * u, w: u, h: u, color, fila: que });
      }
      if (pos.some(p => p > 0)) objetos.push({ que, x0: x0, y0: yTop, x1: x0 + ancho, y1: yTop + 3 * u });
    };
    filas.forEach((f, k) => {
      ponTexto(textos, 'rotulo', x0, y + 12, [[rotulos[k], f.color, 700]]);
      fila([[f.cuenta, f.color]], y + PD.rot, `fila ${k + 1}`);
      y += PD.rot + altoFila + PD.bajo;
    });
    let raya = null;
    if (juntos) {
      raya = { x0, x1: x0 + Math.max(ancho, anchoRot), y: y - 2 };
      y += 6;
      ponTexto(textos, 'rotulo', x0, y + 12, [[nomJ, null, 700]]);
      fila(filas.map(f => [f.cuenta, f.color]), y + PD.rot, 'juntos');
      if (conTerm) for (let k = 0; k < 3; k++) if (total[k] > 0) {
        // Centrado bajo las piezas que hay, no bajo la columna reservada (con `tope` la columna puede ser más ancha).
        const n = total[k], cols = Math.ceil(n / 3);
        const cx = xs[k] + (k === 0 ? n * 3 * u + (n - 1) * PD.sepL : k === 1 ? n * u + (n - 1) * PD.sepT : cols * u + (cols - 1) * PD.sepT) / 2;
        ponTexto(textos, 'termino', cx, y + PD.rot + altoFila + 15, d.terminos === '?' ? [['?', null, 700]] : [[termino(total[k], k), 'f', 700]], 'middle', 14);
      }
    }
    return { W, H, M, d, u, filas, total, juntos, raya, xs, aw, formas, objetos, textos };
  }
  function dibPedido(datos, estado) {
    const g = geometria(datos, estado);
    let s = '';
    if (g.raya) s += `<path d="M${n2(g.raya.x0)} ${n2(g.raya.y)}H${n2(g.raya.x1)}" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`;
    for (const f of g.formas) s += pieza(f.x, f.y, f.w, f.h, f.color, f.que);
    for (const t of g.textos) s += texto(t);
    return T.svg(W, H, `<g class="kit-objeto" data-objeto="pedido" data-prueba="si">${s}</g>`, { alt: alt(datos, estado) });
  }
  function altPedido(d) {
    const g = geoPedido(d);
    const partes = g.filas.map(f => `${f.nombre}: ${cuantas(f.cuenta)}${f.rotulo === undefined ? `, que cubren ${polinomio(f.cuenta).replace(/²/g, ' al cuadrado')}` : ''}.`);
    let fin = '';
    if (g.juntos) fin = d.terminos === true ? ` Juntos: ${cuantas(g.total)}, que cubren ${polinomio(g.total).replace(/²/g, ' al cuadrado')}. Las piezas de la misma forma quedan en un mismo montón.` : ' Debajo, los pedidos juntos, con las piezas de la misma forma en un mismo montón; se pide cuánto cubren.';
    return `Pedidos de piezas para un piso: losetas cuadradas de x dm de lado, tiras de x dm por 1 dm y cuadraditos de 1 dm. ${partes.join(' ')}${fin}`;
  }

  // ---------- Objeto 'giro': piezas de x por y, echadas (xy) y giradas (yx) ----------
  const GI = { w: 56, h: 32, sep: 4 };
  function geoGiro(d) {
    const juntas = d.juntas === true || d.juntas === '?';
    const a = Math.max(1, Math.min(juntas ? 2 : 3, entero(d.a === undefined ? 2 : d.a))), b = Math.min(3, entero(d.b === undefined ? 3 : d.b));
    const { w, h, sep } = GI, objetos = [], textos = [], formas = [];
    const rot = d.rotulos !== false, med = d.medidas !== false;
    // Arriba: el grupo de las echadas (apiladas) a la izquierda y el de las giradas (lado a lado) a la derecha.
    const altoA = a * h + (a - 1) * sep, altoB = b ? w : 0, altoG = Math.max(altoA, altoB);
    const anchoB = b ? b * h + (b - 1) * sep : 0;
    const yTop = juntas ? 26 : (H - altoG) / 2 + 4, yBase = yTop + altoG;
    const xA = b ? 44 : (W - w) / 2, xB = W - 42 - anchoB;
    for (let i = 0; i < a; i++) formas.push({ que: 'echada', x: xA, y: yBase - (i + 1) * h - i * sep, w, h, color: 'o' });
    objetos.push({ que: 'echadas', x0: xA, y0: yBase - altoA, x1: xA + w, y1: yBase });
    if (rot) ponTexto(textos, 'termino', xA + w / 2, yBase - altoA - 9, [[`${a === 1 ? '' : a}xy`, 'o', 700]], 'middle', 14);
    if (med) {
      ponTexto(textos, 'medida', xA + w / 2, yBase + 15, [['x dm']], 'middle');
      ponTexto(textos, 'medida', xA - 7, yBase - h / 2 + 4, [['y dm']], 'end');
    }
    if (b) {
      for (let i = 0; i < b; i++) formas.push({ que: 'girada', x: xB + i * (h + sep), y: yBase - w, w: h, h: w, color: 'i' });
      objetos.push({ que: 'giradas', x0: xB, y0: yBase - w, x1: xB + anchoB, y1: yBase });
      if (rot) ponTexto(textos, 'termino', xB + anchoB / 2, yBase - w - 9, [[`${b === 1 ? '' : b}yx`, 'i', 700]], 'middle', 14);
      if (med) {
        ponTexto(textos, 'medida', xB + h / 2, yBase + 15, [['y dm']], 'middle');
        ponTexto(textos, 'medida', xB + anchoB + 7, yBase - w / 2 + 4, [['x dm']], 'start');
      }
      if (d.igual) ponTexto(textos, 'igual', (xA + w + xB) / 2, yBase - altoG / 2 + 4, [['la misma pieza', null, 700]], 'middle', 12);
    }
    // Abajo: todas echadas, una al lado de la otra, cada una con el color de su grupo.
    let fila = null;
    if (juntas) {
      const n = a + b, ancho = n * w + (n - 1) * sep, x0 = (W - ancho) / 2, y0 = H - M - 20 - h;
      for (let i = 0; i < n; i++) formas.push({ que: 'echada', x: x0 + i * (w + sep), y: y0, w, h, color: i < a ? 'o' : 'i' });
      objetos.push({ que: 'juntas', x0, y0, x1: x0 + ancho, y1: y0 + h });
      ponTexto(textos, 'rotulo', x0, y0 - 7, [['Juntas', null, 700]]);
      ponTexto(textos, 'termino', W / 2, y0 + h + 16, d.juntas === '?' ? [['?', null, 700]] : [[`${n}xy`, 'f', 700]], 'middle', 14);
      fila = { x0, y0 };
    }
    return { W, H, M, d, a, b, formas, objetos, textos, fila };
  }
  function dibGiro(datos, estado) {
    const g = geometria(datos, estado);
    let s = '';
    for (const f of g.formas) s += pieza(f.x, f.y, f.w, f.h, f.color, f.que);
    for (const t of g.textos) s += texto(t);
    return T.svg(W, H, `<g class="kit-objeto" data-objeto="giro" data-prueba="si">${s}</g>`, { alt: alt(datos, estado) });
  }
  function altGiro(d) {
    const g = geoGiro(d), n = g.a + g.b;
    return `Piezas rectangulares de x dm por y dm: ${g.a} echada${g.a === 1 ? '' : 's'}, con el lado x abajo${g.b ? `, y ${g.b} girada${g.b === 1 ? '' : 's'}, con el lado y abajo` : ''}.${d.juntas === true ? ` Abajo, las ${n} juntas y echadas: son la misma pieza y cubren ${n}xy.` : d.juntas === '?' ? ' Se pide cuánto cubren todas juntas.' : ''}`;
  }

  // ---------- Objeto 'lote': un terreno rectangular con dos lados medidos con letras ----------
  function geoLote(d) {
    const u = d.unidad || 'm', largo = `${d.largo || 'x'} ${u}`, ancho = `${d.ancho || 'x'} ${u}`;
    const w = 170, h = 92, anchoTxt = T.ancho(ancho, TAM, 700);
    const x0 = Math.max(M + 2, (W - w - 8 - anchoTxt) / 2), y0 = (H - h - 22) / 2;
    const objetos = [{ que: 'lote', x0, y0, x1: x0 + w, y1: y0 + h }], textos = [];
    ponTexto(textos, 'largo', x0 + w / 2, y0 + h + 18, [[largo, null, 700]], 'middle');
    ponTexto(textos, 'ancho', x0 + w + 8, y0 + h / 2 + 4, [[ancho, null, 700]], 'start');
    if (d.dentro) ponTexto(textos, 'dentro', x0 + w / 2, y0 + h / 2 + 4, [[String(d.dentro), null, 700]], 'middle');
    return { W, H, M, d, x0, y0, w, h, objetos, textos };
  }
  function dibLote(datos, estado) {
    const g = geometria(datos, estado), { x0, y0, w, h } = g;
    let s = `<rect class="alg-lote" x="${n2(x0)}" y="${n2(y0)}" width="${w}" height="${h}" rx="2" fill="currentColor" fill-opacity="0.07" stroke="currentColor" stroke-width="2.5"/>`;
    // Surcos: el terreno se lee como chacra y no como una caja vacía.
    let surcos = '';
    for (let i = 1; i < 6; i++) surcos += `M${n2(x0 + 10)} ${n2(y0 + (h * i) / 6)}H${n2(x0 + w - 10)}`;
    s += `<path d="${surcos}" stroke="currentColor" stroke-opacity="0.22" stroke-width="1" stroke-dasharray="9 6" fill="none"/>`;
    for (const t of g.textos) s += texto(t);
    return T.svg(W, H, `<g class="kit-objeto" data-objeto="lote" data-prueba="si">${s}</g>`, { alt: alt(datos, estado) });
  }
  const altLote = d => `Un terreno rectangular visto desde arriba. Su largo mide ${d.largo || 'x'} ${d.unidad || 'm'} y su ancho, ${d.ancho || 'x'} ${d.unidad || 'm'}.`;

  // ---------- Objetos de las ideas 2 a 6 (fase 3, 19 nov) ----------
  const SUPS = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sup = k => String(k).split('').map(c => SUPS[c] || c).join('');
  const potx = (e, v = 'x') => (e === 0 ? `${v}⁰` : e === 1 ? v : `${v}${sup(e)}`);
  const num = v => (v < 0 ? `−${-v}` : String(v));
  // Un término c·xᵃ·yᵇ escrito como en el cuaderno: «3x²y», «−2xy³», «1».
  function terminoXY(c, a, b) {
    const lit = (a ? (a === 1 ? 'x' : `x${sup(a)}`) : '') + (b ? (b === 1 ? 'y' : `y${sup(b)}`) : '');
    const k = Math.abs(c), cuerpo = lit ? `${k === 1 ? '' : k}${lit}` : String(k);
    return (c < 0 ? '−' : '') + cuerpo;
  }

  // 'tamano': el mismo pedido con losetas de otro tamaño (idea 2) o dos pedidos lado a lado (idea 5). La loseta y la
  // tira crecen con el lado; el cuadradito no. Escala fija (TA.u px por dm) para que el alumno vea crecer las piezas.
  //   datos = { objeto: 'tamano', filas: [{ nombre, cuenta: [l, t, c], color }], lado: número (dm, de 0 a 6) | 'x',
  //             areas: true | false (bajo cada grupo, lo que cubre: «2 · 4² = 32»), total: true | '?' | false }
  const TA = { u: 14, uMin: 6, sepL: 4, sepT: 3, sepG: 16, rot: 18, izq: 44 };
  function geoTamano(d) {
    const filas = (Array.isArray(d.filas) ? d.filas : []).slice(0, 2).map(f => ({ nombre: f.nombre || 'Pedido', cuenta: [0, 1, 2].map(k => entero((f.cuenta || [])[k])), color: f.color === 'o' || f.color === 'i' ? f.color : null }));
    const letra = d.lado === 'x' || d.lado === undefined, a = letra ? 3 : Math.max(0, Math.min(6, +d.lado || 0));
    const ladoTxt = letra ? 'x dm' : `${a} dm`;
    const conArea = !!d.areas, conTotal = d.total === true || d.total === '?';
    // ladoMax: la escala se elige para el lado más grande que tomará la figura (el juego): al cambiar el lado, las piezas
    // crecen y nada cambia de escala ni de lugar.
    const aEsc = Math.max(a, +d.ladoMax || 0);
    const areas = (f, lado = a) => { const [l, t, c] = f.cuenta; return [l ? `${l} · ${lado}² = ${l * lado * lado}` : '', t ? `${t} · ${lado} = ${t * lado}` : '', c ? `${c}` : '']; };
    // Cada grupo ocupa un lugar del ancho de sus piezas (con el lado de la escala) o de su rótulo de área, si es más ancho.
    const lugares = (f, u, lado) => {
      const [l, t, c] = f.cuenta, A = Math.max(lado, 0.5) * u, cc = Math.ceil(c / 3), ar = areas(f, lado);
      const ws = [l ? l * A + (l - 1) * TA.sepL : 0, t ? t * u + (t - 1) * TA.sepT : 0, cc ? cc * u + (cc - 1) * TA.sepT : 0];
      return ws.map((w, k) => (w ? Math.max(w, conArea ? T.ancho(ar[k], 12) + 4 : 0) : 0));
    };
    const anchoDe = (f, u) => { const ls = lugares(f, u, aEsc), ls2 = lugares(f, u, a); return Math.max(...[ls, ls2].map(L => L.reduce((x, y) => x + y, 0) + Math.max(0, L.filter(Boolean).length - 1) * TA.sepG)); };
    const altoPiezas = (f, u) => Math.max(aEsc, 1, Math.min(3, f.cuenta[2])) * u;
    const altoDe = u => filas.reduce((x, f) => x + TA.rot + altoPiezas(f, u) + (conArea ? 22 : 8), 0) + (conTotal ? 22 : 0);
    let u = TA.u;
    while (u > TA.uMin && (Math.max(0, ...filas.map(f => anchoDe(f, u))) > W - 2 * M - TA.izq - 4 || altoDe(u) > H - 2 * M - 4)) u--;
    const objetos = [], textos = [], formas = [], vacios = [];
    let y = Math.max(M + 2, (H - altoDe(u)) / 2);
    const x0 = M + TA.izq, A = a * u;
    filas.forEach((f, k) => {
      const [l, t, c] = f.cuenta, slot = lugares(f, u, aEsc).map((w, j) => Math.max(w, lugares(f, u, a)[j])), ar = areas(f);
      ponTexto(textos, 'rotulo', x0, y + 12, [[`${f.nombre}: ${polinomio(f.cuenta)}`, f.color, 700]]);
      const base = y + TA.rot + altoPiezas(f, u);
      let x = x0;
      const grupo = (n, w, h, que, j) => {
        const xi = x;
        for (let i = 0; i < n; i++) {
          if (w > 0 && h > 0) formas.push({ que, x: x + i * (w + (que === 'loseta' ? TA.sepL : TA.sepT)), y: base - h, w, h, color: f.color, fila: `fila ${k + 1}` });
          else vacios.push({ que, x: x + i * (u + TA.sepT), y: base, w: u, fila: `fila ${k + 1}` });
        }
        const ancho = n ? (w > 0 && h > 0 ? n * w + (n - 1) * (que === 'loseta' ? TA.sepL : TA.sepT) : n * u + (n - 1) * TA.sepT) : 0;
        if (n && w > 0 && h > 0) objetos.push({ que: `${que}s ${k + 1}`, x0: xi, y0: base - h, x1: xi + ancho, y1: base });
        if (n && conArea) ponTexto(textos, 'area', xi + slot[j] / 2, base + 16, [[ar[j]]], 'middle', 12);
        x += slot[j] + (n ? TA.sepG : 0);
        return { xi, ancho };
      };
      grupo(l, A, A, 'loseta', 0);
      grupo(t, u, A, 'tira', 1);
      // Los cuadraditos, de a tres en columna.
      const xc = x, cc = Math.ceil(c / 3);
      for (let i = 0; i < c; i++) formas.push({ que: 'cuadradito', x: xc + Math.floor(i / 3) * (u + TA.sepT), y: base - (1 + (i % 3)) * u, w: u, h: u, color: f.color, fila: `fila ${k + 1}` });
      const anchoC = cc ? cc * u + (cc - 1) * TA.sepT : 0;
      if (c) objetos.push({ que: `cuadraditos ${k + 1}`, x0: xc, y0: base - Math.min(c, 3) * u, x1: xc + anchoC, y1: base });
      if (c && conArea) ponTexto(textos, 'area', xc + slot[2] / 2, base + 16, [[ar[2]]], 'middle', 12);
      // El lado de la loseta, a la izquierda de la primera (o de la primera tira).
      if (k === 0 && (l || t)) ponTexto(textos, 'lado', x0 - 6, base - Math.max(A, 12) / 2 + 4, [[ladoTxt, letra ? null : 'o', 700]], 'end', 12);
      y = base + (conArea ? 22 : 8);
    });
    if (conTotal) {
      const tot = filas.length ? filas[0].cuenta[0] * a * a + filas[0].cuenta[1] * a + filas[0].cuenta[2] : 0;
      ponTexto(textos, 'total', x0, y + 14, d.total === '?' ? [['Cubre: ', null, 700], ['? dm²', null, 700]] : [['Cubre: ', null, 700], [`${tot} dm²`, 'f', 700]]);
    }
    return { W, H, M, d, u, a, letra, filas, formas, vacios, objetos, textos };
  }
  function dibTamano(datos, estado) {
    const g = geometria(datos, estado);
    let s = '';
    for (const f of g.formas) s += pieza(f.x, f.y, f.w, f.h, f.color, f.que);
    // Con lado 0, la loseta y la tira no cubren nada: queda solo la marca de dónde estaban.
    for (const v of g.vacios) s += `<path class="alg-vacio" d="M${n2(v.x)} ${n2(v.y)}H${n2(v.x + v.w)}" stroke="currentColor" stroke-opacity="0.5" stroke-width="1.5" stroke-dasharray="3 3"/>`;
    for (const t of g.textos) s += texto(t);
    return T.svg(W, H, `<g class="kit-objeto" data-objeto="tamano" data-prueba="si">${s}</g>`, { alt: alt(datos, estado) });
  }
  function altTamano(d) {
    const g = geoTamano(d), lado = g.letra ? 'x dm' : `${g.a} dm`;
    return `Pedidos de piezas con losetas de ${lado} de lado: ${g.filas.map(f => `${f.nombre}, ${cuantas(f.cuenta)}`).join('; ')}. La loseta mide ${lado} por ${lado}, la tira ${lado} por 1 dm y el cuadradito 1 dm por 1 dm.${d.total === '?' ? ' Se pide cuánto cubre.' : ''}`;
  }

  // 'deposito': tres piezas del depósito con dos medidas, x e y: la varilla (x), la plancha (x por y) y el bloque (x por
  // x por y). Bajo cada una, cuántas medidas se multiplican.
  function geoDeposito(d) {
    const objetos = [], textos = [], formas = [];
    const base = 150;
    // Varilla: larga y delgada.
    formas.push({ que: 'varilla', x: 16, y: base - 10, w: 78, h: 10 });
    // Plancha: x por y, vista de frente.
    formas.push({ que: 'plancha', x: 122, y: base - 48, w: 66, h: 48 });
    // Bloque: x por x por y, en perspectiva (frente x por y y fondo de x).
    formas.push({ que: 'bloque', x: 222, y: base - 48, w: 56, h: 48, fondo: 24 });
    objetos.push({ que: 'varilla', x0: 16, y0: base - 10, x1: 94, y1: base });
    objetos.push({ que: 'plancha', x0: 122, y0: base - 48, x1: 188, y1: base });
    objetos.push({ que: 'bloque', x0: 222, y0: base - 48 - 17, x1: 222 + 56 + 17, y1: base });
    const r = [['varilla', 55, 'x', d.medidas === false ? null : '1 medida'], ['plancha', 155, 'xy', d.medidas === false ? null : '2 medidas'], ['bloque', 258, 'x²y', d.medidas === false ? null : '3 medidas']];
    for (const [nom, cx, t, m] of r) {
      ponTexto(textos, 'nombre', cx, 40, [[nom, null, 700]], 'middle');
      ponTexto(textos, 'termino', cx, base + 20, [[t, null, 700]], 'middle', 14);
      if (m) ponTexto(textos, 'medidas', cx, base + 40, [[m]], 'middle', 12);
    }
    // Las medidas de cada lado.
    ponTexto(textos, 'lado', 55, base - 16, [['x', 'o', 700]], 'middle', 12);
    ponTexto(textos, 'lado', 155, base - 54, [['x', 'o', 700]], 'middle', 12);
    ponTexto(textos, 'lado', 116, base - 20, [['y', 'i', 700]], 'end', 12);
    ponTexto(textos, 'lado', 250, base - 72, [['x', 'o', 700]], 'middle', 12);
    ponTexto(textos, 'lado', 216, base - 20, [['y', 'i', 700]], 'end', 12);
    ponTexto(textos, 'lado', 300, base - 50, [['x', 'o', 700]], 'start', 12);
    return { W, H, M, d, formas, objetos, textos };
  }
  function dibDeposito(datos, estado) {
    const g = geometria(datos, estado);
    let s = '';
    for (const f of g.formas) {
      if (f.que === 'bloque') {
        const { x, y, w, h, fondo } = f, dx = fondo * 0.7, dy = fondo * 0.7;
        s += `<path class="alg-pieza bloque" d="M${n2(x)} ${n2(y)}L${n2(x + dx)} ${n2(y - dy)}H${n2(x + w + dx)}V${n2(y + h - dy)}L${n2(x + w)} ${n2(y + h)}H${n2(x)}Z" fill="currentColor" fill-opacity="0.12" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>`;
        s += `<path d="M${n2(x)} ${n2(y)}H${n2(x + w)}V${n2(y + h)}M${n2(x + w)} ${n2(y)}L${n2(x + w + dx)} ${n2(y - dy)}" fill="none" stroke="currentColor" stroke-width="1.5"/>`;
      } else s += pieza(f.x, f.y, f.w, f.h, null, f.que);
    }
    for (const t of g.textos) s += texto(t);
    return T.svg(W, H, `<g class="kit-objeto" data-objeto="deposito" data-prueba="si">${s}</g>`, { alt: alt(datos, estado) });
  }
  const altDeposito = () => 'Tres piezas del depósito: una varilla de x dm de largo; una plancha de x dm por y dm; y un bloque de x dm por x dm por y dm. Cubren o llenan x, xy y x²y.';

  // 'medidas': cada término como una fila de fichas, una por cada letra que se multiplica (x naranja, y turquesa), y a
  // la derecha su grado (cuántas fichas tiene). Ideas 3 y 4 (homogéneo).
  //   datos = { objeto: 'medidas', terminos: [[c, a, b], …] (hasta 4), grado: true | '?' | false,
  //             mayor: true | '?' | false (abajo, «Grado del polinomio: …»), resaltar: índice de una fila (marco) }
  const ME = { w: 15, h: 22, sep: 2, alto: 34, xFichas: 82 };
  function geoMedidas(d) {
    const ts = (Array.isArray(d.terminos) ? d.terminos : []).slice(0, 4).map(t => [Math.trunc(+t[0] || 0) || 1, entero(t[1]), entero(t[2])]);
    const objetos = [], textos = [], fichas = [];
    const conMayor = d.mayor === true || d.mayor === '?';
    const alto = ts.length * ME.alto + (conMayor ? 26 : 0);
    let y = Math.max(M + 4, (H - alto) / 2);
    const grados = ts.map(t => t[1] + t[2]);
    ts.forEach(([c, a, b], k) => {
      const yc = y + ME.alto / 2;
      ponTexto(textos, 'termino', ME.xFichas - 10, yc + 5, [[terminoXY(c, a, b), null, 700]], 'end', 14);
      let x = ME.xFichas;
      for (let j = 0; j < a + b; j++) {
        const L = j < a ? 'x' : 'y';
        fichas.push({ letra: L, x, y: yc - ME.h / 2, fila: k });
        ponTexto(textos, 'dentro', x + ME.w / 2, yc + 4, [[L, L === 'x' ? 'o' : 'i', 700]], 'middle', 12);
        x += ME.w + ME.sep;
      }
      if (a + b) objetos.push({ que: `fichas ${k + 1}`, x0: ME.xFichas, y0: yc - ME.h / 2, x1: x - ME.sep, y1: yc + ME.h / 2 });
      else ponTexto(textos, 'nada', ME.xFichas, yc + 4, [['sin letras']], 'start', 12);
      if (d.grado === true || d.grado === '?') ponTexto(textos, 'grado', W - M - 2, yc + 5, d.grado === '?' ? [['grado ?', null, 700]] : [['grado ', null, 700], [String(grados[k]), 'f', 700]], 'end', 14);
      y += ME.alto;
    });
    let marco = null;
    if (Number.isInteger(d.resaltar) && d.resaltar >= 0 && d.resaltar < ts.length) {
      const y0 = Math.max(M + 4, (H - alto) / 2) + d.resaltar * ME.alto;
      marco = { x0: M + 2, y0: y0 + 1, x1: W - M - 2 + 0, y1: y0 + ME.alto - 1 };
    }
    if (conMayor) ponTexto(textos, 'mayor', W / 2, y + 18, d.mayor === '?' ? [['Grado del polinomio: ?', null, 700]] : [['Grado del polinomio: ', null, 700], [String(ts.length ? Math.max(...grados) : 0), 'f', 700]], 'middle', 14);
    return { W, H, M, d, ts, grados, fichas, objetos, textos, marco };
  }
  function dibMedidas(datos, estado) {
    const g = geometria(datos, estado);
    let s = '';
    if (g.marco) s += `<rect class="alg-marco" x="${n2(g.marco.x0)}" y="${n2(g.marco.y0)}" width="${n2(g.marco.x1 - g.marco.x0)}" height="${n2(g.marco.y1 - g.marco.y0)}" rx="5" fill="var(--c-f)" fill-opacity="0.08" stroke="var(--c-f)" stroke-width="1.5"/>`;
    for (const f of g.fichas) {
      const c = f.letra === 'x' ? 'var(--c-o)' : 'var(--c-i)';
      s += `<rect class="alg-ficha" x="${n2(f.x + 0.75)}" y="${n2(f.y + 0.75)}" width="${n2(ME.w - 1.5)}" height="${n2(ME.h - 1.5)}" rx="3" fill="${c}" fill-opacity="0.18" stroke="${c}" stroke-width="1.5"/>`;
    }
    for (const t of g.textos) s += texto(t);
    return T.svg(W, H, `<g class="kit-objeto" data-objeto="medidas" data-prueba="si">${s}</g>`, { alt: alt(datos, estado) });
  }
  function altMedidas(d) {
    const g = geoMedidas(d);
    const filas = g.ts.map(([c, a, b], k) => `${terminoXY(c, a, b)}: ${a} ficha${a === 1 ? '' : 's'} x y ${b} ficha${b === 1 ? '' : 's'} y${d.grado === true ? `, grado ${g.grados[k]}` : ''}`);
    return `Cada término, con una ficha por cada letra que se multiplica. ${filas.join('; ')}.${d.mayor === '?' ? ' Se pide el grado del polinomio.' : ''}`;
  }

  // 'casillero': el casillero de la tienda, con una casilla por potencia de x (de xⁿ a x⁰). Las casillas sin número
  // están vacías; con ceros: true llevan un 0 violeta (lo que se olvida). Una o dos filas (P y Q, para comparar).
  //   datos = { objeto: 'casillero', grado: n (1 a 6), orden: 'baja' | 'sube' | [exponentes en el orden de las columnas],
  //             filas: [{ nombre, coef: { exponente: coeficiente }, color }], ceros: false | true | '?',
  //             colorPot: 'o' | null (el rótulo de cada potencia), iconos: true (dibujo de la pieza sobre x³ a x⁰),
  //             marcas: true (bajo dos filas: ✓ si coinciden, ✗ si no), escrito: texto (arriba) }
  const CA = { alto: 36, cabeza: 22, icono: 22, izq: 30 };
  function geoCasillero(d) {
    const n = Math.max(0, Math.min(6, entero(d.grado)));
    let exps = Array.from({ length: n + 1 }, (_, k) => n - k);
    if (d.orden === 'sube') exps.reverse();
    // solo: las casillas de esas potencias y ninguna más (lo que se escribió, antes de completar).
    if (Array.isArray(d.solo)) exps = d.solo.map(entero).filter(e => e <= n);
    else if (Array.isArray(d.orden)) { const o = d.orden.map(entero).filter(e => e <= n); exps = [...new Set([...o, ...exps])]; }
    const filas = (Array.isArray(d.filas) ? d.filas : []).slice(0, 2).map(f => ({ nombre: f.nombre === undefined ? '' : String(f.nombre), coef: f.coef || {}, color: f.color === 'o' || f.color === 'i' ? f.color : null }));
    const conIconos = d.iconos === true, conMarcas = d.marcas === true && filas.length === 2;
    const izq = filas.some(f => f.nombre) ? Math.max(CA.izq, 8 + Math.max(...filas.map(f => T.ancho(f.nombre, 14, 700)))) : 0;
    const util = W - 2 * M - 4 - izq, w = Math.min(48, util / exps.length);
    const anchoT = w * exps.length, x0 = M + 2 + izq + (util - anchoT) / 2;
    const altoT = (d.escrito ? 24 : 0) + (conIconos ? CA.icono + 4 : 0) + CA.cabeza + filas.length * CA.alto + (conMarcas ? 24 : 0);
    let y = Math.max(M + 2, (H - altoT) / 2);
    const objetos = [], textos = [], celdas = [], iconos = [];
    if (d.escrito) { ponTexto(textos, 'escrito', W / 2, y + 14, [[String(d.escrito), null, 700]], 'middle', 14); y += 24; }
    if (conIconos) {
      exps.forEach((e, k) => { if (e <= 3) iconos.push({ e, cx: x0 + (k + 0.5) * w, y }); });
      if (iconos.length) objetos.push({ que: 'iconos', x0: Math.min(...iconos.map(i => i.cx - 10)), y0: y, x1: Math.max(...iconos.map(i => i.cx + 10)), y1: y + CA.icono });
      y += CA.icono + 4;
    }
    exps.forEach((e, k) => ponTexto(textos, 'potencia', x0 + (k + 0.5) * w, y + 15, [[potx(e), d.colorPot === 'o' ? 'o' : null, 700]], 'middle', 14));
    y += CA.cabeza;
    filas.forEach((f, i) => {
      if (f.nombre) ponTexto(textos, 'nombre', x0 - 8, y + CA.alto / 2 + 5, [[f.nombre, f.color, 700]], 'end', 14);
      exps.forEach((e, k) => {
        const c = f.coef[e], hay = c !== undefined && c !== null && c !== 0 && c !== '';
        celdas.push({ x: x0 + k * w, y, w, h: CA.alto, e, fila: i, hay, color: f.color });
        const cx = x0 + (k + 0.5) * w, cy = y + CA.alto / 2 + 5;
        if (hay) ponTexto(textos, 'dentro', cx, cy, [[typeof c === 'number' ? num(c) : String(c), f.color, 700]], 'middle', 15);
        else if (d.ceros === true) ponTexto(textos, 'dentro', cx, cy, [['0', 'f', 700]], 'middle', 15);
        else if (d.ceros === '?') ponTexto(textos, 'dentro', cx, cy, [['?', null, 700]], 'middle', 15);
      });
      y += CA.alto;
    });
    if (filas.length) objetos.push({ que: 'casillas', x0, y0: y - filas.length * CA.alto, x1: x0 + anchoT, y1: y });
    if (conMarcas) {
      exps.forEach((e, k) => {
        const a = Number(filas[0].coef[e] || 0), b = Number(filas[1].coef[e] || 0);
        ponTexto(textos, 'marca', x0 + (k + 0.5) * w, y + 17, [[a === b ? '✓' : '✗', null, 700]], 'middle', 14);
      });
      y += 24;
    }
    return { W, H, M, d, n, exps, filas, celdas, iconos, w, objetos, textos };
  }
  function dibCasillero(datos, estado) {
    const g = geometria(datos, estado);
    let s = '';
    for (const c of g.celdas) s += `<rect class="alg-casilla${c.hay ? '' : ' vacia'}" x="${n2(c.x + 1)}" y="${n2(c.y + 1)}" width="${n2(c.w - 2)}" height="${n2(c.h - 2)}" rx="3" fill="${c.hay ? T.color(c.color) : 'none'}" fill-opacity="${c.hay ? 0.1 : 0}" stroke="currentColor" stroke-opacity="${c.hay ? 0.8 : 0.45}" stroke-width="1.5"${c.hay ? '' : ' stroke-dasharray="4 3"'}/>`;
    // Los dibujos de las piezas sobre su casilla: bloque (x³), loseta (x²), tira (x) y cuadradito (x⁰).
    for (const i of g.iconos) {
      const cx = i.cx, y = i.y, k = 'fill="currentColor" fill-opacity="0.12" stroke="currentColor" stroke-width="1.2"';
      if (i.e === 3) s += `<path class="alg-icono" d="M${n2(cx - 9)} ${n2(y + 6)}H${n2(cx + 5)}V${n2(y + 20)}H${n2(cx - 9)}Z M${n2(cx - 9)} ${n2(y + 6)}L${n2(cx - 5)} ${n2(y + 2)}H${n2(cx + 9)}V${n2(y + 16)}L${n2(cx + 5)} ${n2(y + 20)} M${n2(cx + 5)} ${n2(y + 6)}L${n2(cx + 9)} ${n2(y + 2)}" ${k} stroke-linejoin="round"/>`;
      else if (i.e === 2) s += `<rect class="alg-icono" x="${n2(cx - 9)}" y="${n2(y + 2)}" width="18" height="18" rx="1" ${k}/>`;
      else if (i.e === 1) s += `<rect class="alg-icono" x="${n2(cx - 3)}" y="${n2(y + 2)}" width="6" height="18" rx="1" ${k}/>`;
      else s += `<rect class="alg-icono" x="${n2(cx - 3)}" y="${n2(y + 14)}" width="6" height="6" rx="1" ${k}/>`;
    }
    for (const t of g.textos) s += texto(t);
    return T.svg(W, H, `<g class="kit-objeto" data-objeto="casillero" data-prueba="si">${s}</g>`, { alt: alt(datos, estado) });
  }
  function altCasillero(d) {
    const g = geoCasillero(d);
    const filas = g.filas.map(f => `${f.nombre ? f.nombre + ': ' : ''}${g.exps.map(e => { const c = f.coef[e]; return c ? `${potx(e)} lleva ${typeof c === 'number' ? num(c) : c}` : `${potx(e)} ${d.ceros === true ? 'lleva 0' : 'vacía'}`; }).join(', ')}`);
    return `Casillero con una casilla por potencia de x, de ${potx(g.exps[0] === undefined ? 0 : g.exps[0])} a ${potx(g.exps[g.exps.length - 1] || 0)}. ${filas.join('. ')}.`;
  }

  // 'piso': un piso rectangular de (p·x + q) por (r·x + s) dm, partido en tramos: cada tramo del largo por cada tramo
  // del ancho es una pieza (loseta, tira o cuadradito). El largo en naranja, el ancho en turquesa (los dos factores).
  //   datos = { objeto: 'piso', largo: [p, q], ancho: [r, s], tope: [P, Q, R, S] (reserva el lugar: nada se corre),
  //             rotulos: true (los tramos), medidas: true (abajo, «largo: (2x + 1) dm»), piezas: true | '?' }
  const PI = { u: 16, x: 3 };
  function geoPiso(d) {
    const [p, q] = (d.largo || [1, 1]).map(entero), [r, s] = (d.ancho || [1, 1]).map(entero);
    const tp = d.tope || [p, q, r, s];
    const largoU = Math.max(p, entero(tp[0])) * PI.x + Math.max(q, entero(tp[1])), anchoU = Math.max(r, entero(tp[2])) * PI.x + Math.max(s, entero(tp[3]));
    let u = PI.u;
    while (u > 8 && (largoU * u > W - 2 * M - 44 || anchoU * u > H - 2 * M - 62)) u--;
    const X = PI.x * u;
    const cols = [...Array(p).fill(X), ...Array(q).fill(u)], filasT = [...Array(r).fill(X), ...Array(s).fill(u)];
    const w = cols.reduce((a, b) => a + b, 0), h = filasT.reduce((a, b) => a + b, 0);
    const x0 = M + 34 + Math.max(0, (W - 2 * M - 44 - largoU * u) / 2), y0 = M + 22;
    const objetos = [{ que: 'piso', x0, y0, x1: x0 + w, y1: y0 + h }], textos = [], formas = [];
    let yy = y0;
    filasT.forEach((hh, i) => {
      let xx = x0;
      cols.forEach((ww, j) => {
        const que = ww === X && hh === X ? 'loseta' : ww === u && hh === u ? 'cuadradito' : 'tira';
        formas.push({ que, x: xx, y: yy, w: ww, h: hh, i, j });
        xx += ww;
      });
      yy += hh;
    });
    if (d.rotulos !== false) {
      let xx = x0;
      for (const ww of cols) { ponTexto(textos, 'tramo', xx + ww / 2, y0 - 7, [[ww === X ? 'x' : '1', 'o', 700]], 'middle', 12); xx += ww; }
      yy = y0;
      for (const hh of filasT) { ponTexto(textos, 'tramo', x0 - 7, yy + hh / 2 + 4, [[hh === X ? 'x' : '1', 'i', 700]], 'end', 12); yy += hh; }
    }
    const fac = (a, b) => `(${a === 1 ? '' : a}x + ${b})`;
    if (d.medidas !== false) {
      // Debajo del lugar reservado (tope): al cambiar los tramos, los rótulos no se mueven.
      const yM = y0 + Math.max(h, anchoU * u) + 18;
      ponTexto(textos, 'medida', x0, yM, [['largo: ', null, 400], [`${fac(p, q)} dm`, 'o', 700]], 'start', 12);
      ponTexto(textos, 'medida', x0, yM + 16, [['ancho: ', null, 400], [`${fac(r, s)} dm`, 'i', 700]], 'start', 12);
    }
    return { W, H, M, d, u, X, p, q, r, s, formas, objetos, textos };
  }
  function dibPiso(datos, estado) {
    const g = geometria(datos, estado);
    let s = '';
    for (const f of g.formas) s += pieza(f.x, f.y, f.w, f.h, null, f.que);
    const o = g.objetos[0];
    s += `<rect x="${n2(o.x0)}" y="${n2(o.y0)}" width="${n2(o.x1 - o.x0)}" height="${n2(o.y1 - o.y0)}" fill="none" stroke="currentColor" stroke-width="2"/>`;
    for (const t of g.textos) s += texto(t);
    return T.svg(W, H, `<g class="kit-objeto" data-objeto="piso" data-prueba="si">${s}</g>`, { alt: alt(datos, estado) });
  }
  function altPiso(d) {
    const g = geoPiso(d), c = q => g.formas.filter(f => f.que === q).length;
    return `Un piso rectangular de (${g.p === 1 ? '' : g.p}x + ${g.q}) dm de largo por (${g.r === 1 ? '' : g.r}x + ${g.s}) dm de ancho, partido en tramos de x dm y de 1 dm. Cada tramo del largo por cada tramo del ancho da una pieza: ${c('loseta')} losetas, ${c('tira')} tiras y ${c('cuadradito')} cuadraditos.`;
  }

  // ---------- Elige el objeto ----------
  const OBJ = { piezas: [geoPiezas, dibPiezas, altPiezas], pedido: [geoPedido, dibPedido, altPedido], giro: [geoGiro, dibGiro, altGiro], lote: [geoLote, dibLote, altLote],
    tamano: [geoTamano, dibTamano, altTamano], deposito: [geoDeposito, dibDeposito, altDeposito], medidas: [geoMedidas, dibMedidas, altMedidas],
    casillero: [geoCasillero, dibCasillero, altCasillero], piso: [geoPiso, dibPiso, altPiso] };
  const de = d => OBJ[d && OBJ[d.objeto] ? d.objeto : 'piezas'];
  function geometria(datos, estado = {}) { const d = mezcla(datos, estado); return de(d)[0](d); }
  function dibujar(datos, estado = {}) { return de(mezcla(datos, estado))[1](datos, estado); }
  function alt(datos, estado = {}) { const d = mezcla(datos, estado); return de(d)[2](d); }

  // ¿Cabe todo lo pedido en el lienzo, con su margen? (La pieza no recorta ni quita piezas.)
  function cabe(datos, estado = {}) {
    const g = geometria(datos, estado);
    return [...g.objetos, ...g.textos].every(c => c.x0 >= M - 1e-9 && c.y0 >= M - 1e-9 && c.x1 <= W - M + 1e-9 && c.y1 <= H - M + 1e-9);
  }

  return { id: 'alg-losetas', dibujar, alt, geometria, cabe, polinomio, terminoXY, constantes: { W, H, M, PZ, PD, GI, TA, ME, CA, PI } };
});
