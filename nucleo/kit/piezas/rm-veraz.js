/*
 * Pieza «rm-veraz» (19 nov 2026): los objetos de «Verdades y mentiras» dibujados por la sesión como prueba (data-prueba;
 * Gerson decide después cuáles reemplaza, docs/plan-calidad.md M4), con quién dice qué y la tabla de suposiciones. La usa
 * contenido/teoria/razonamiento-matematico/verdades-y-mentiras.js.
 *
 * Arriba va el objeto de la idea (escena); debajo, un renglón por persona que habla: su tarjeta (boca abajo o volteada),
 * su cara con su nombre, su globo con lo que dice y, a la derecha, lo que vale su frase en el caso supuesto y si encaja.
 * Al final, si hace falta, una lista de suposiciones (una por renglón, como los órdenes de Ordenamiento) y una nota.
 *
 * Afirmación de la figura: ante cada frase hay dos cosas distintas, quién la dice (su tarjeta) y si es cierta. Una
 * suposición encaja si la frase de cada veraz sale cierta y la de cada mentiroso, falsa; si una no encaja, choca.
 *
 * Papeles de color (paleta de deducción de la rama Lógica, fija en la pieza: quien llama dice el papel, no el color):
 *   supuesto ... naranja (o): lo que se da por cierto para probar (la tarjeta volteada, el culpable o la mochila supuestos,
 *                el número supuesto de mentirosos)
 *   sale ....... turquesa (i): lo que sale de suponer: «cierta» o «falsa»
 *   seguro ..... violeta (f): lo que encaja en todo lo que queda, ya comprobado (marco y texto)
 *   descartado . gris (tinta al 70 %, para que se lea qué se descartó) con una raya que lo tacha (data-tacha)
 *   amarra ..... tinta: personas, frases, objetos, el choque (✗ y la palabra «choca»: forma, no solo color)
 * Ni verde ni carmín (docs/etapa3/decisiones.md). PAPELES lo exporta para las pruebas de la unidad.
 *
 * datos = {
 *   escena: 'tarjetas' | 'ventana' | 'mochilas' | 'mural' | 'podio' | undefined,
 *   panel: false                       solo la escena y los renglones de quien habla, sin valores (la primera de «Lee»)
 *   supuesto: 'texto', seguro: 'texto'  una línea sobre la escena («Supón: fue Beto»), en naranja o en violeta
 *   objetos: [{ t, pelota: 'supuesto' | 'seguro', rotulo }], objeto: 'mochila' | 'caja'   (escena mochilas)
 *   lista: [{ t, ok: true | false | null }], tituloLista   (escena mural: la lista de notas)
 *   podio: [nombre del 1.º, del 2.º, del 3.º] (null o '?': sin saber), seguroPodio: true | n, papelPodio: 'supuesto'   (escena podio; con
 *          cuatro atletas, el cuarto va al pie del podio)
 *   habla: [{ quien, dice: ['frase', …], tarjeta: null | '?' | 'V' | 'M', papelTarjeta: 'supuesto' | 'seguro',
 *            anillo: 'supuesto' | 'seguro' | { papel, desde }, valores: [{ t, papel }], estado: { t, papel }, desde }]
 *          quien: null para una frase suelta (sin cara)
 *   casos: { columnas: ['Ana', 'Beto', 'Encaja'], filas: [{ celdas: [{ t, papel }], fuera: true | n, seguro: true | n, desde }] }
 *          la lista de suposiciones; o varias, lado a lado: casos: [{ titulo, columnas, filas }, …] (dos como máximo)
 *   nota: 'texto' | [{ t, desde, hasta }], notas: n   una o dos líneas al final (se reservan aunque no se vean)
 * }
 * estado = { corte: 0..n }: se ve lo que tiene desde ≤ corte. El alto no cambia con el estado.
 * Función pura de (datos, estado): sin ids, sin azar, sin reloj. Todo texto lo trae quien llama.
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
  const W = 320, M = 4, TENUE = 0.7, TAM = 14, LH = 17, RENGLON = 52, NOTA = 22, FILA = 26, CAB = 24;
  const PAPELES = { supuesto: 'o', sale: 'i', seguro: 'f', descartado: 'tenue', amarra: 'tinta' };
  const n = T.n;
  const CAJA = ' data-caja="si"';
  const ve = (x, corte) => !x || typeof x !== 'object' || ((x.desde || 0) <= corte && (x.hasta === undefined || corte <= x.hasta));
  const desde = (x, corte) => x === true || (typeof x === 'number' && corte >= x);
  const tok = p => (p === 'supuesto' ? 'o' : p === 'sale' ? 'i' : p === 'seguro' ? 'f' : undefined);
  const tinta = (g = 2) => `fill="none" stroke="currentColor" stroke-width="${g}" stroke-linecap="round" stroke-linejoin="round"`;
  const lista = xs => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}` : xs.join(''));
  const marcaSeguro = c => (c === 'f' ? ' data-marca="seguro"' : '');

  // Parte un texto en renglones que caben en `ancho`.
  function envolver(texto, ancho, tam = TAM, peso = 400) {
    const out = [];
    let linea = '';
    for (const p of String(texto).split(/\s+/).filter(Boolean)) {
      const prueba = linea ? `${linea} ${p}` : p;
      if (!linea || T.ancho(prueba, tam, peso) <= ancho) linea = prueba;
      else { out.push(linea); linea = p; }
    }
    if (linea) out.push(linea);
    return out;
  }
  const casosDe = d => (!d.casos ? [] : Array.isArray(d.casos) ? d.casos : [d.casos]);
  const notasDe = d => (d.nota === undefined ? [] : Array.isArray(d.nota) ? d.nota : [{ t: d.nota }]);

  // ---------- Geometría ----------
  const ALTO_ESC = { ventana: 104, mochilas: 100, mural: 0, podio: 112 };
  const X_TARJ = M + 1.5, A_TARJ = 62, X_CARA = 82, X_GLOBO = 104, X_VAL = 252;
  function geometria(d) {
    const conTarjeta = (d.habla || []).some(h => h.tarjeta !== undefined && h.tarjeta !== null);
    const conValores = d.panel !== false && (d.habla || []).some(h => (h.valores && h.valores.length) || h.estado);
    const xGlobo = conTarjeta ? X_GLOBO : 40, xVal = conValores ? X_VAL : W - M, anchoGlobo = xVal - xGlobo - 10;
    let y = M;
    const yLinea = y;
    if (d.supuesto || d.seguro || d.escena === 'ventana' || d.escena === 'mochilas' || d.escena === 'podio') y += 20;
    const yEsc = y;
    y += d.escena === 'mural' ? 30 + 22 * (d.lista || []).length + 8 : (ALTO_ESC[d.escena] || 0);
    const renglones = (d.habla || []).map(h => {
      const lineas = (h.dice || []).flatMap((t, k) => envolver((h.dice.length > 1 ? `${k + 1}. ` : '') + t, anchoGlobo - 14));
      const alto = Math.max(h.quien ? RENGLON : 34, lineas.length * LH + (h.quien ? 22 : 16), ((h.valores || []).length + (h.estado ? 1 : 0)) * LH + 12);
      const r = { y0: y, alto, lineas };
      y += alto + 6;
      return r;
    });
    const tablas = casosDe(d).map(c => ({ c }));
    if (tablas.length) {
      const y0 = y + 4, ancho = (W - 2 * M - 2 - (tablas.length - 1) * 10) / tablas.length;
      let alto = 0;
      tablas.forEach((t, i) => {
        t.x0 = M + 1 + i * (ancho + 10); t.ancho = ancho; t.y0 = y0;
        t.yCab = y0 + (t.c.titulo ? 20 : 0);
        t.cw = ancho / Math.max(1, t.c.columnas.length);
        alto = Math.max(alto, (t.yCab - y0) + CAB + FILA * t.c.filas.length);
      });
      y = y0 + alto + 6;
    }
    const nNotas = Math.max(d.notas || 0, notasDe(d).length);
    const yNota = y;
    y += nNotas * NOTA;
    return { conTarjeta, conValores, xGlobo, xVal, anchoGlobo, yLinea, yEsc, renglones, tablas, yNota, nNotas, alto: Math.max(y + M, 40) };
  }

  // ---------- Escenas (objetos de prueba) ----------
  function ventana(d, g) {
    const y0 = g.yEsc, x0 = 92, w = 136, h = 76;
    let s = `<rect${CAJA} x="${x0}" y="${y0}" width="${w}" height="${h}" rx="3" fill="var(--card)" stroke="currentColor" stroke-width="3"/>`;
    s += `<line x1="${x0 + w / 2}" y1="${y0}" x2="${x0 + w / 2}" y2="${y0 + h}" stroke="currentColor" stroke-width="3"/>`;
    // El vidrio de la izquierda, roto: rayas que salen de un punto.
    const cx = x0 + 34, cy = y0 + 34;
    for (const [dx, dy] of [[-26, -24], [-4, -30], [24, -18], [28, 10], [10, 32], [-22, 28], [-30, 4]]) s += `<line x1="${n(cx)}" y1="${n(cy)}" x2="${n(cx + dx)}" y2="${n(cy + dy)}" stroke="currentColor" stroke-width="1.5"/>`;
    s += `<rect x="${x0 + w / 2 + 10}" y="${y0 + 10}" width="${w / 2 - 20}" height="${h - 20}" fill="currentColor" fill-opacity="0.06"/>`;
    // La pelota en el piso, bajo la ventana.
    const py = y0 + h + 14;
    s += `<line x1="${x0 - 40}" y1="${py + 9}" x2="${x0 + w + 40}" y2="${py + 9}" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.45"/>`;
    const bx = x0 + w + 22;
    s += `<circle cx="${bx}" cy="${py}" r="8" fill="var(--card)" stroke="currentColor" stroke-width="2"/><path d="M${bx - 4} ${py - 7}A9 9 0 0 1 ${bx - 4} ${py + 7}" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M${bx + 4} ${py - 7}A9 9 0 0 0 ${bx + 4} ${py + 7}" fill="none" stroke="currentColor" stroke-width="1.5"/>`;
    return `<g class="kit-objeto" data-objeto="ventana" data-prueba="si">${s}</g>`;
  }
  function mochilas(d, g, corte) {
    const obs = d.objetos || [], k = obs.length || 1, paso = (W - 2 * M) / k, y0 = g.yEsc, caja = d.objeto === 'caja';
    let s = caja ? '' : `<line x1="${M + 6}" y1="${y0 + 6}" x2="${W - M - 6}" y2="${y0 + 6}" stroke="currentColor" stroke-width="2" stroke-opacity="0.45"/>`;
    obs.forEach((o, i) => {
      const cx = M + paso * (i + 0.5);
      if (caja) {
        s += `<rect x="${n(cx - 30)}" y="${y0 + 20}" width="60" height="44" rx="3" fill="var(--card)" stroke="currentColor" stroke-width="2"/><line x1="${n(cx - 30)}" y1="${y0 + 30}" x2="${n(cx + 30)}" y2="${y0 + 30}" stroke="currentColor" stroke-width="2"/>`;
      } else {
        s += `<circle cx="${n(cx)}" cy="${y0 + 8}" r="3" fill="currentColor"/><path d="M${n(cx - 8)} ${y0 + 22}A8 8 0 0 1 ${n(cx + 8)} ${y0 + 22}" ${tinta(2)}/>`;
        s += `<rect x="${n(cx - 24)}" y="${y0 + 20}" width="48" height="46" rx="10" fill="var(--card)" stroke="currentColor" stroke-width="2"/><rect x="${n(cx - 15)}" y="${y0 + 42}" width="30" height="16" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/>`;
      }
      const p = o.pelota && ve(o, corte) ? o.pelota : null, c = tok(p);
      if (p) s += `<g class="kit-aparece"${marcaSeguro(c)}><circle cx="${n(cx)}" cy="${y0 + (caja ? 46 : 32)}" r="9" fill="var(--card)" stroke="${T.color(c)}" stroke-width="3"/></g>`;
      const nom = T.rotulo(cx, y0 + 88, o.t, { ancla: 'middle', tam: TAM, peso: 700, color: p === 'seguro' ? 'f' : undefined, min: M, max: W - M });
      s += p === 'seguro' ? `<g class="kit-aparece" data-marca="seguro">${nom}</g>` : nom;
    });
    return `<g class="kit-objeto" data-objeto="${caja ? 'cajas' : 'mochilas'}" data-prueba="si">${s}</g>`;
  }
  function mural(d, g) {
    const xs = d.lista || [], y0 = g.yEsc + 2, x0 = 60, w = 200, h = 30 + 22 * xs.length;
    let s = `<rect${CAJA} x="${x0}" y="${y0}" width="${w}" height="${h}" rx="2" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`;
    s += `<circle cx="${x0 + w / 2}" cy="${y0 + 4}" r="3" fill="currentColor"/>`;
    s += T.rotulo(x0 + w / 2, y0 + 21, d.tituloLista || 'Simulacro: notas', { ancla: 'middle', tam: TAM, peso: 700, min: x0 + 4, max: x0 + w - 4 });
    xs.forEach((x, i) => {
      const y = y0 + 42 + 22 * i;
      s += T.rotulo(x0 + 14, y, x.t, { tam: TAM, min: x0 + 4, max: x0 + w / 2 });
      s += T.rotulo(x0 + w - 14, y, x.ok === null || x.ok === undefined ? '?' : x.ok ? 'aprobó' : 'no aprobó', { ancla: 'end', tam: TAM, peso: x.ok ? 700 : 400, min: x0 + w / 2, max: x0 + w - 4 });
    });
    return `<g class="kit-objeto" data-objeto="mural" data-prueba="si">${s}</g>`;
  }
  function podio(d, g, corte) {
    const y0 = g.yEsc, base = y0 + 104, xs = [150, 82, 218], altos = [56, 40, 28], ws = 68, pod = d.podio || [];
    let s = `<line x1="${M + 20}" y1="${base}" x2="${W - M - 20}" y2="${base}" stroke="currentColor" stroke-width="2"/>`;
    for (let k = 0; k < 3; k++) {
      s += `<rect${CAJA} x="${xs[k] - ws / 2}" y="${base - altos[k]}" width="${ws}" height="${altos[k]}" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`;
      s += T.rotulo(xs[k], base - altos[k] + 20, String(k + 1), { ancla: 'middle', tam: 16, peso: 700 });
      const quien = pod[k], seguro = desde(d.seguroPodio, corte);
      const c = quien && quien !== '?' ? (seguro ? 'f' : tok(d.papelPodio)) : undefined;
      s += `<g class="kit-aparece"${marcaSeguro(c)}>${T.rotulo(xs[k], base - altos[k] - 8, quien || '?', { ancla: 'middle', tam: TAM, peso: 700, color: c, min: M, max: W - M })}</g>`;
    }
    if (pod.length > 3) {
      const c = pod[3] && pod[3] !== '?' ? (desde(d.seguroPodio, corte) ? 'f' : tok(d.papelPodio)) : undefined;
      s += `<g class="kit-aparece"${marcaSeguro(c)}>${T.rotulo(W - M - 1, base - 8, `4.º ${pod[3] || '?'}`, { ancla: 'end', tam: TAM, peso: 700, color: c, min: 254, max: W - M - 1 })}</g>`;
    }
    return `<g class="kit-objeto" data-objeto="podio" data-prueba="si">${s}</g>`;
  }

  // ---------- Quien habla ----------
  function tarjeta(x, y, t, papel) {
    const w = A_TARJ - 4, h = 30, c = tok(papel);
    if (t === '?') return `<g data-tarjeta="boca-abajo"><rect${CAJA} x="${n(x)}" y="${n(y)}" width="${w}" height="${h}" rx="4" fill="currentColor" fill-opacity="0.12" stroke="currentColor" stroke-width="2"/>${T.rotulo(x + w / 2, y + 21, '?', { ancla: 'middle', tam: 16, peso: 700 })}</g>`;
    const txt = t === 'V' ? 'VERAZ' : 'MIENTE';
    return `<g class="kit-aparece" data-tarjeta="${t === 'V' ? 'veraz' : 'miente'}"${marcaSeguro(c)}><rect${CAJA} x="${n(x)}" y="${n(y)}" width="${w}" height="${h}" rx="4" fill="var(--card)" stroke="${T.color(c)}" stroke-width="2.5"/>${T.rotulo(x + w / 2, y + 20, txt, { ancla: 'middle', tam: TAM, peso: 700, color: c, min: x + 1, max: x + w - 1 })}</g>`;
  }
  function renglon(d, g, h, r, corte) {
    if (!ve(h, corte)) return '';
    let s = '';
    const yc = r.y0 + r.alto / 2;
    if (g.conTarjeta && h.tarjeta) s += tarjeta(X_TARJ, yc - 15, h.tarjeta, h.papelTarjeta || 'supuesto');
    const xCara = g.conTarjeta ? X_CARA : 19;
    if (h.quien) {
      const an = typeof h.anillo === 'object' && h.anillo ? h.anillo : { papel: h.anillo }, c = an.papel && ve(an, corte) ? tok(an.papel) : null;
      s += `<circle cx="${xCara}" cy="${n(yc - 9)}" r="8" fill="currentColor"/><path d="M${xCara - 12} ${n(yc + 9)}A12 12 0 0 1 ${xCara + 12} ${n(yc + 9)}" fill="currentColor" fill-opacity="0.35" stroke="currentColor" stroke-width="1.5"/>`;
      if (c) s += `<g class="kit-aparece"${marcaSeguro(c)}><circle cx="${xCara}" cy="${n(yc - 9)}" r="12" fill="none" stroke="${T.color(c)}" stroke-width="2.5"/></g>`;
      s += T.rotulo(xCara, r.y0 + r.alto - 2, h.quien, { ancla: 'middle', tam: TAM, peso: 700, min: M, max: g.xGlobo - 4 });
    }
    // El globo: un rectángulo redondeado con su colita hacia la cara (o un marco simple, si la frase es suelta). Quien no
    // habla no lleva globo.
    if (r.lineas.length) {
      const gx = g.xGlobo, gw = g.anchoGlobo, gh = r.lineas.length * LH + 10, gy = Math.max(r.y0 + 2, yc - gh / 2 - (h.quien ? 6 : 0));
      s += `<rect${CAJA} x="${n(gx)}" y="${n(gy)}" width="${n(gw)}" height="${n(gh)}" rx="9" fill="var(--card)" stroke="currentColor" stroke-width="1.5"/>`;
      if (h.quien) s += `<path d="M${n(gx)} ${n(gy + gh / 2 - 4)}L${n(gx - 8)} ${n(gy + gh / 2 + 2)}L${n(gx)} ${n(gy + gh / 2 + 4)}" fill="var(--card)" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>`;
      r.lineas.forEach((t, k) => { s += T.rotulo(gx + 8, gy + 18 + k * LH, t, { tam: TAM, min: gx + 2, max: gx + gw - 2 }); });
    }
    // Zona para tocar la tarjeta (el lector de la teoría pasa ese control a su opción siguiente).
    if (h.toque && g.conTarjeta) s += `<rect class="rm-toque" data-toque="${T.esc(h.toque)}" x="${X_TARJ}" y="${n(r.y0)}" width="${X_CARA + 14 - X_TARJ}" height="${n(r.alto)}" fill="transparent"><title>${T.esc(`Tarjeta de ${h.quien}: tocar para voltearla`)}</title></rect>`;
    // Lo que vale cada frase en el caso supuesto, y si encaja.
    if (g.conValores) {
      const vs = (h.valores || []).concat(h.estado ? [h.estado] : []), y1 = yc - (vs.length * LH) / 2 + 12 - (h.quien ? 4 : 0);
      vs.forEach((v, k) => {
        if (!ve(v, corte)) return;
        const c = tok(v.papel);
        s += `<g class="kit-aparece"${marcaSeguro(c)}>${T.rotulo(W - M - 4, y1 + k * LH, v.t, { ancla: 'end', tam: TAM, peso: v.papel ? 700 : (v.choca ? 700 : 400), color: c, min: g.xVal, max: W - M })}</g>`;
      });
    }
    return `<g class="kit-aparece" data-habla="${h.quien || 'frase'}">${s}</g>`;
  }

  // ---------- La lista de suposiciones ----------
  function tabla(t, corte) {
    const c = t.c;
    let s = '';
    if (c.titulo) s += T.rotulo(t.x0 + t.ancho / 2, t.y0 + 14, c.titulo, { ancla: 'middle', tam: TAM, peso: 700, min: t.x0, max: t.x0 + t.ancho });
    c.columnas.forEach((col, j) => { s += T.rotulo(t.x0 + t.cw * (j + 0.5), t.yCab + 17, col, { ancla: 'middle', tam: TAM, peso: 700, min: t.x0 + t.cw * j + 1, max: t.x0 + t.cw * (j + 1) - 1 }); });
    s += `<line x1="${n(t.x0)}" y1="${n(t.yCab + CAB)}" x2="${n(t.x0 + t.ancho)}" y2="${n(t.yCab + CAB)}" stroke="currentColor" stroke-width="1" stroke-opacity="0.45"/>`;
    c.filas.forEach((f, i) => {
      if (!ve(f, corte)) return;
      const y = t.yCab + CAB + FILA * i, fuera = desde(f.fuera, corte), seguro = !fuera && desde(f.seguro, corte);
      let q = '';
      f.celdas.forEach((x, j) => {
        const cel = typeof x === 'object' && x ? x : { t: String(x === null || x === undefined ? '' : x) };
        if (!cel.t || !ve(cel, corte)) return;
        const col = seguro ? 'f' : tok(cel.papel);
        q += T.rotulo(t.x0 + t.cw * (j + 0.5), y + 18, cel.t, { ancla: 'middle', tam: TAM, peso: cel.papel || cel.choca ? 700 : 400, color: fuera ? undefined : col, min: t.x0 + t.cw * j + 1, max: t.x0 + t.cw * (j + 1) - 1 });
      });
      if (fuera) q += `<line data-tacha="si"${CAJA} x1="${n(t.x0 + 2)}" y1="${n(y + 13)}" x2="${n(t.x0 + t.ancho - 2)}" y2="${n(y + 13)}" stroke="currentColor" stroke-width="1.5"/>`;
      if (seguro) q = `<rect${CAJA} data-marca="seguro" x="${n(t.x0 + 1)}" y="${n(y + 1)}" width="${n(t.ancho - 2)}" height="${FILA - 2}" rx="4" fill="none" stroke="var(--c-f)" stroke-width="2.5"/>` + q;
      s += `<g class="kit-aparece" data-caso="${fuera ? 'fuera' : seguro ? 'seguro' : 'queda'}"${fuera ? ` opacity="${TENUE}"` : ''}>${q}</g>`;
    });
    return s;
  }

  function dibujar(d, e = {}) {
    const corte = e.corte || 0, g = geometria(d);
    let s = '';
    const linea = d.seguro && ve(d.seguroDesde === undefined ? null : { desde: d.seguroDesde }, corte) ? { t: d.seguro, c: 'f' } : d.supuesto ? { t: d.supuesto, c: 'o' } : null;
    if (linea) s += `<g class="kit-aparece"${marcaSeguro(linea.c)}>${T.rotulo(W / 2, g.yLinea + 15, linea.t, { ancla: 'middle', tam: TAM, peso: 700, color: linea.c, min: M, max: W - M })}</g>`;
    if (d.escena === 'ventana') s += ventana(d, g);
    else if (d.escena === 'mochilas') s += mochilas(d, g, corte);
    else if (d.escena === 'mural') s += mural(d, g);
    else if (d.escena === 'podio') s += podio(d, g, corte);
    const habla = (d.habla || []).map((h, i) => renglon(d, g, h, g.renglones[i], corte)).join('');
    s += d.escena === 'tarjetas' ? `<g class="kit-objeto" data-objeto="tarjetas" data-prueba="si">${habla}</g>` : habla;
    for (const t of g.tablas) s += tabla(t, corte);
    notasDe(d).forEach((x, k) => { if (ve(x, corte)) s += `<g class="kit-aparece">${T.rotulo(M + 2, g.yNota + 16 + k * NOTA, x.t, { tam: TAM, peso: x.fuerte ? 700 : 400, min: M, max: W - M })}</g>`; });
    return T.svg(W, g.alto, s, { alt: alt(d) });
  }

  function alt(d) {
    const partes = [];
    if (d.escena === 'ventana') partes.push('El vidrio de una ventana del aula, roto, con una pelota en el piso');
    if (d.escena === 'mochilas') partes.push(`${d.objeto === 'caja' ? 'Cajas' : 'Mochilas colgadas en la pared'}: ${lista((d.objetos || []).map(o => `${o.t}${o.pelota ? (o.pelota === 'seguro' ? ' (aquí está, comprobado)' : ' (se supone que aquí está)') : ''}`))}`);
    if (d.escena === 'mural') partes.push(`Lista de notas en el mural: ${(d.lista || []).map(x => `${x.t}, ${x.ok === null || x.ok === undefined ? 'sin saber' : x.ok ? 'aprobó' : 'no aprobó'}`).join('; ')}`);
    if (d.escena === 'podio') partes.push(`Podio de tres escalones: ${(d.podio || []).map((x, k) => `puesto ${k + 1}, ${x || 'sin saber'}`).join('; ')}`);
    if (d.supuesto) partes.push(d.supuesto);
    if (d.seguro) partes.push(d.seguro);
    for (const h of d.habla || []) {
      const tarj = h.tarjeta === '?' ? 'tarjeta boca abajo' : h.tarjeta === 'V' ? 'tarjeta VERAZ' : h.tarjeta === 'M' ? 'tarjeta MIENTE' : '';
      const vals = d.panel === false ? [] : (h.valores || []).map(v => v.t).concat(h.estado ? [h.estado.t] : []);
      partes.push(`${h.quien ? `${h.quien}${tarj ? `, con ${tarj},` : ''} dice` : 'Frase'}: «${(h.dice || []).join('» y «')}»${vals.length ? ` (${vals.join(', ')})` : ''}`);
    }
    for (const c of casosDe(d)) partes.push(`${c.titulo ? `${c.titulo}: ` : ''}${c.filas.length} casos (${c.columnas.join(', ')}): ${c.filas.map(f => f.celdas.map(x => (typeof x === 'object' && x ? x.t : x)).filter(Boolean).join(', ') + (f.fuera ? ', descartado' : f.seguro ? ', el que queda' : '')).join('; ')}`);
    for (const x of notasDe(d)) partes.push(x.t);
    return (partes.length ? partes.join('. ') : 'Personas que dicen frases') + '.';
  }

  return { id: 'rm-veraz', dibujar, alt, geometria, PAPELES, envolver, constantes: { W, TENUE } };
});
