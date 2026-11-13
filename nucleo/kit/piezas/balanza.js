/*
 * Pieza «balanza» (docs/escena-viva.md, sección 5): una o varias balanzas de dos platillos con figuras, incógnitas
 * (x, y) y pesas, y una balanza de trabajo donde se ven los pasos: sustituir, juntar dos balanzas, quitar lo mismo
 * de los dos lados y llegar al resultado. Sirve para balanzas de RM, ecuaciones y sistemas.
 *
 * Afirmación de la figura: una balanza en equilibrio sigue en equilibrio si se cambia algo por lo que pesa lo mismo
 * o si se quita lo mismo de los dos lados; el travesaño se inclina hacia el lado que pesa más.
 *
 * Un platillo (lado) = { circulo: 2, triangulo: 1, cuadrado, rombo,   // figuras por cantidad
 *                        x: 1, y: 2,                                   // incógnitas (las de datos.incognitas)
 *                        pesa: 40,                                     // una pesa con su valor
 *                        pesas: [[13, 3], [5, 1]],                     // varias pesas: [valor, cuántas]
 *                        saco: 54 }                                    // lo que se pesa (saco con su valor)
 * datos = {
 *   unidad: 'kg',
 *   colores: { circulo: 'o', x: 'i', … },     // color de cada figura o incógnita (regla 4); las pesas van en tinta
 *   incognitas: ['x', 'y'],                    // claves que se dibujan como caja con su letra
 *   pesos: { circulo: 3, … } | null,           // pesos reales, si se conocen: deciden la inclinación (si no, manda estado)
 *   balanzas: [{ izq, der, estado: 'equilibrio'|'izq-baja'|'der-baja' }],   // las del enunciado, siempre dibujadas
 *   trabajo: [{ izq, der, estado?, quita?: { izq, der }, traba?: true }],   // vistas de la balanza de trabajo (0 = la pregunta)
 *   marca: null | { vista: 0, lado: 'der', figura: 'circulo', max: 30, nombre: ['círculo', 'círculos'] }
 *          // si se responde poniendo n figuras en un platillo de la balanza de trabajo (trabada hasta responder)
 * }
 * estado = {
 *   vista: 0..,                 // qué vista de la balanza de trabajo se dibuja
 *   rastros: { 0: fichas, … },  // lo deducido de cada balanza del enunciado: rótulo bajo ella (lo deducido se queda)
 *   usa: [i, …],                // balanzas del enunciado que se usan en este paso (resaltadas)
 *   nuevo: ['r0', 't'],         // lo que aparece en este paso: rastro de la balanza i ('r' + i) o la de trabajo ('t')
 *   final, marca, fantasma: null | { marca?: n, der?: lado, rotulo }
 * }
 * fichas (un rótulo) = [ 'texto', { n: '3', f: 'circulo' }, { t: 'x = 5', c: 'i' }, … ]: texto, cantidad con su
 * figura dibujada en chico, o texto en el color de una variable.
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
  const W = 320, CX = 160, BRAZO = 104, PLATO = 54, FIG = 20, FILA_ITEM = 24, MAX_GRADOS = 10;
  const FIGURAS = ['circulo', 'triangulo', 'cuadrado', 'rombo'];
  const TAM = 14;                                    // texto de pesas y rótulos: el mínimo del kit
  const RX0 = 24, RX1 = 296;                         // regla de la marca

  const fmt = x => Kit.formatear(x, 2);
  const conUnidad = (d, x) => `${fmt(x)}${d.unidad ? ' ' + d.unidad : ''}`;
  const esFigura = (d, k) => FIGURAS.includes(k) || (d.incognitas || []).includes(k);

  // ---------- peso e inclinación ----------
  // Peso de un platillo con los pesos reales; null si alguna figura no tiene peso conocido.
  function pesoLado(d, lado) {
    let s = 0;
    for (const [k, n] of Object.entries(lado || {})) {
      if (k === 'pesa' || k === 'saco') s += n;
      else if (k === 'pesas') for (const [v, c] of n) s += v * c;
      else if (d.pesos && Number.isFinite(d.pesos[k])) s += n * d.pesos[k];
      else if (n) return null;
    }
    return s;
  }
  // Ángulo del travesaño en grados (positivo: baja la izquierda). Con pesos reales, según la diferencia;
  // si no, según el estado declarado. En equilibrio, 0: horizontal.
  function inclinacion(d, b) {
    if (b.traba) return 0;
    const I = pesoLado(d, b.izq), D = pesoLado(d, b.der);
    if (I !== null && D !== null) {
      const dif = I - D;
      if (Math.abs(dif) < 1e-9) return 0;
      return Math.sign(dif) * (4 + (MAX_GRADOS - 4) * Math.min(1, Math.abs(dif) / Math.max(I, D)));
    }
    return b.estado === 'izq-baja' ? MAX_GRADOS * 0.7 : b.estado === 'der-baja' ? -MAX_GRADOS * 0.7 : 0;
  }

  // ---------- objetos de un platillo ----------
  // Lista de objetos dibujables { k, ancho, … }: hasta 4 figuras iguales se dibujan una por una; más, una con «×n».
  function objetos(d, lado, quitado) {
    const out = [];
    for (const k of Object.keys(lado || {})) {
      const n = lado[k];
      if (esFigura(d, k)) {
        if (!(n > 0)) continue;
        if (n <= 4) for (let i = 0; i < n; i++) out.push({ k, ancho: FIG + 4, quitado });
        else out.push({ k, n, ancho: FIG + 6 + T.ancho(`×${n}`, TAM, 700), quitado });
      } else if (k === 'pesa' && n > 0) out.push({ k: 'pesa', v: n, ancho: anchoPesa(d, n), quitado });
      else if (k === 'saco' && n > 0) out.push({ k: 'saco', v: n, ancho: T.ancho(conUnidad(d, n), TAM, 700) + 18, quitado });
      else if (k === 'pesas') for (const [v, c] of n) if (c > 0) {
        if (c === 1) out.push({ k: 'pesa', v, ancho: anchoPesa(d, v), quitado });
        else out.push({ k: 'pesa', v, n: c, ancho: anchoPesa(d, v) + T.ancho(`×${c}`, TAM, 700) + 4, quitado });
      }
    }
    return out;
  }
  const anchoPesa = (d, v) => T.ancho(conUnidad(d, v), TAM, 700) + 10;
  // Reparte los objetos en filas de a lo más el ancho del platillo (la de abajo, primero).
  function filas(objs) {
    const r = [[]]; let w = 0;
    for (const o of objs) {
      if (w + o.ancho > 2 * PLATO + 6 && r[r.length - 1].length) { r.push([]); w = 0; }
      r[r.length - 1].push(o); w += o.ancho;
    }
    return r;
  }
  const lados = b => [b.izq, b.der];
  // Cuántas filas de objetos necesita un platillo como máximo (decide el largo de las cuerdas, igual en todo estado).
  function filasMax(d) {
    let m = 1;
    const ver = b => { for (const [l, q] of [[b.izq, b.quita && b.quita.izq], [b.der, b.quita && b.quita.der]]) m = Math.max(m, filas(objetos(d, l).concat(objetos(d, q, true))).length); };
    (d.balanzas || []).forEach(ver); (d.trabajo || []).forEach(ver);
    if (d.marca) { const v = d.trabajo[d.marca.vista || 0]; ver({ ...v, [d.marca.lado]: { ...v[d.marca.lado], [d.marca.figura]: d.marca.max } }); }
    return m;
  }
  // ¿Cabe todo? Un platillo no puede pasar de cuatro filas (si no, el generador no usa la pieza).
  const cabe = d => filasMax(d) <= 4 && [...(d.balanzas || []), ...(d.trabajo || [])].every(b => lados(b).every(l => objetos(d, l).every(o => o.ancho <= 2 * PLATO + 6)));

  // Dibujo de una figura con su base en (cx, yb). El trazo es del color de su variable; el relleno, tenue.
  function figura(d, k, cx, yb, o = {}) {
    const c = T.color((d.colores || {})[k]), dash = o.quitado ? ' stroke-dasharray="3 3"' : '';
    const est = `fill="${c}" fill-opacity="${o.quitado ? 0.06 : 0.28}" stroke="${c}" stroke-width="2" stroke-linejoin="round"${dash}`;
    const s = o.escala || 1, h = FIG * s, n = T.n;
    if (k === 'circulo') return `<circle cx="${n(cx)}" cy="${n(yb - h / 2)}" r="${n(h / 2 - 1)}" ${est}/>`;
    if (k === 'cuadrado') return `<rect x="${n(cx - h / 2 + 1)}" y="${n(yb - h + 1)}" width="${n(h - 2)}" height="${n(h - 2)}" rx="2" ${est}/>`;
    if (k === 'triangulo') return `<path d="M${n(cx - h / 2)} ${n(yb)}L${n(cx + h / 2)} ${n(yb)}L${n(cx)} ${n(yb - h)}Z" ${est}/>`;
    if (k === 'rombo') return `<path d="M${n(cx)} ${n(yb - h)}L${n(cx + h / 2 - 1)} ${n(yb - h / 2)}L${n(cx)} ${n(yb)}L${n(cx - h / 2 + 1)} ${n(yb - h / 2)}Z" ${est}/>`;
    // Incógnita: caja con su letra, en su color.
    return `<rect x="${n(cx - h / 2)}" y="${n(yb - h)}" width="${n(h)}" height="${n(h)}" rx="3" ${est}/>`
      + (s >= 1 ? `<text class="kit-txt" x="${n(cx)}" y="${n(yb - 5)}" fill="${c}" font-size="${TAM}" font-weight="700" font-style="italic" text-anchor="middle">${T.esc(k)}</text>` : '');
  }
  function objetoSVG(d, o, x, yb) {
    const dash = o.quitado ? ' stroke-dasharray="3 3"' : '';
    if (o.k === 'pesa' || o.k === 'saco') {
      const wb = o.k === 'pesa' ? anchoPesa(d, o.v) : o.ancho, t = conUnidad(d, o.v);
      const forma = o.k === 'pesa'
        ? `<path d="M${T.n(x + 3)} ${T.n(yb)}L${T.n(x + wb - 3)} ${T.n(yb)}L${T.n(x + wb - 6)} ${T.n(yb - 20)}L${T.n(x + 6)} ${T.n(yb - 20)}Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"${dash}/>`
        : `<path d="M${T.n(x + 4)} ${T.n(yb)}Q${T.n(x)} ${T.n(yb - 12)} ${T.n(x + 7)} ${T.n(yb - 20)}L${T.n(x + wb - 7)} ${T.n(yb - 20)}Q${T.n(x + wb)} ${T.n(yb - 12)} ${T.n(x + wb - 4)} ${T.n(yb)}Z" fill="currentColor" fill-opacity="0.08" stroke="currentColor" stroke-width="2" stroke-linejoin="round"${dash}/>`;
      let s = forma + T.rotulo(x + wb / 2, yb - 5, t, { ancla: 'middle', peso: 700, tam: TAM, min: -999, max: 999 });
      if (o.n) s += T.rotulo(x + wb + 2, yb - 5, `×${o.n}`, { peso: 700, tam: TAM, min: -999, max: 999 });
      return s;
    }
    let s = figura(d, o.k, x + FIG / 2 + 2, yb, o);
    if (o.n) s += T.rotulo(x + FIG + 5, yb - 5, `×${o.n}`, { color: (d.colores || {})[o.k], peso: 700, tam: TAM, min: -999, max: 999 });
    return s;
  }
  // Lo que hay en un platillo, centrado en cx y apoyado en yb. Lo quitado va al final, discontinuo y tenue.
  function platilloSVG(d, lado, quita, cx, yb, claseQuita) {
    const fs = filas(objetos(d, lado).concat(objetos(d, quita, true)));
    let s = '';
    fs.forEach((fila, i) => {
      const w = fila.reduce((a, o) => a + o.ancho, 0);
      let x = cx - w / 2;
      const y = yb - 1 - i * FILA_ITEM;
      for (const o of fila) {
        const g = objetoSVG(d, o, x, y);
        s += o.quitado ? `<g class="kit-tenue ${claseQuita || ''}">${g}</g>` : g;
        x += o.ancho;
      }
    });
    return s;
  }

  // ---------- geometría fija ----------
  function geometria(d) {
    const nf = filasMax(d), cuerda = 36 + (nf - 1) * FILA_ITEM;
    const filaH = 18 + 20 + cuerda + 52;            // número, brazo inclinado, cuerdas, platillo y rótulo
    const n = (d.balanzas || []).length + ((d.trabajo || []).length ? 1 : 0);
    const reglaY = n * filaH + 24, fantasmaY = d.marca ? reglaY + 44 : n * filaH + 16;
    return { cuerda, filaH, n, reglaY, fantasmaY, alto: fantasmaY + 16 };
  }

  // Una balanza en la fila i: travesaño inclinado según su peso, cuerdas, platillos y lo que hay encima.
  function balanzaSVG(d, g, i, b, o = {}) {
    const y0 = i * g.filaH, py = y0 + 26, grados = o.grados === undefined ? inclinacion(d, b) : o.grados;
    const a = grados * Math.PI / 180, dx = BRAZO * Math.cos(a), dy = BRAZO * Math.sin(a);
    const xl = CX - dx, yl = py + dy, xr = CX + dx, yr = py - dy;
    const base = py + 20 + g.cuerda + 12;
    let s = '';
    if (o.fantasma) {
      // Solo el travesaño, discontinuo: cómo quedaría la balanza con la respuesta elegida.
      s += T.linea(xl, yl, xr, yr, { discontinua: true, opacidad: 0.8 });
      return `<g class="kit-fantasma">${s}</g>`;
    }
    // Pie y punto de giro (tinta, 2 px); travesaño (3 px: es lo que se lee).
    s += T.linea(CX, py, CX, base) + T.linea(CX - 22, base, CX + 22, base);
    s += T.linea(xl, yl, xr, yr, { grosor: T.GROSOR.variable });
    s += `<circle cx="${CX}" cy="${T.n(py)}" r="4" fill="currentColor"/>`;
    // Trabada: dos apoyos bajo los platillos (no se inclina hasta que se responde).
    if (b.traba) for (const cx of [xl, xr]) s += T.linea(cx, py + g.cuerda + 2, cx, base, { discontinua: true, opacidad: 0.7 });
    for (const [cx, yy, lado, q] of [[xl, yl, b.izq, b.quita && b.quita.izq], [xr, yr, b.der, b.quita && b.quita.der]]) {
      const yp = yy + g.cuerda;
      s += `<g class="kit-tenue">${T.linea(cx, yy, cx - PLATO + 4, yp, { grosor: 1 })}${T.linea(cx, yy, cx + PLATO - 4, yp, { grosor: 1 })}</g>`;
      s += T.linea(cx - PLATO, yp, cx + PLATO, yp);
      s += platilloSVG(d, lado, q, cx, yp, o.claseQuita);
    }
    return s;
  }

  // Un rótulo hecho de fichas, centrado en x; las figuras se dibujan en chico junto a su cantidad.
  function fichasSVG(d, fichas, x, y, clase) {
    const piezas = (fichas || []).map(f => (typeof f === 'string' ? { t: f } : f));
    const anchoDe = f => 1.1 * (f.f ? T.ancho(String(f.n === undefined ? '' : f.n), TAM, 700) + 2 + 15 : T.ancho(f.t, TAM, 700));
    const w = piezas.reduce((a, f) => a + anchoDe(f) + 3, 0);
    let xx = Math.max(4, Math.min(W - 4 - w, x - w / 2)), s = '';
    for (const f of piezas) {
      if (f.f) {
        const tn = String(f.n === undefined ? '' : f.n);
        if (tn) s += T.rotulo(xx, y, tn, { peso: 700, color: (d.colores || {})[f.f], min: -999, max: 999 });
        s += figura(d, f.f, xx + T.ancho(tn, TAM, 700) + 2 + 7, y + 1, { escala: 0.7 });
      } else s += T.rotulo(xx, y, f.t, { peso: 700, color: f.c, min: -999, max: 999 });
      xx += anchoDe(f) + 3;
    }
    return `<g class="${clase}">${s}</g>`;
  }

  // ---------- marca (regla de 0 a max) ----------
  const xRegla = (d, m) => RX0 + (RX1 - RX0) * Math.max(0, Math.min(d.marca.max, m)) / d.marca.max;
  const nombreMarca = (d, m) => { const nm = d.marca.nombre || ['', '']; return `${fmt(m)} ${nm[m === 1 ? 0 : 1]}`.trim(); };
  function controles(d) {
    if (!d.marca) return null;
    const g = geometria(d);
    return {
      ancho: W, alto: g.alto,
      marca: {
        min: 0, max: d.marca.max, inicio: 0,
        aX: m => RX0 + (RX1 - RX0) * m / d.marca.max,
        deX: x => (x - RX0) / (RX1 - RX0) * d.marca.max,
        texto: m => nombreMarca(d, m),
      },
      respuesta: respuestaMarca(d),
    };
  }
  // La cantidad que equilibra la balanza de la marca (con los pesos reales), o null.
  function respuestaMarca(d) {
    if (!d.marca || !d.pesos) return null;
    const v = d.trabajo[d.marca.vista || 0], otro = d.marca.lado === 'der' ? v.izq : v.der;
    const P = pesoLado(d, otro), w = d.pesos[d.marca.figura], ya = pesoLado(d, v[d.marca.lado]);
    return P === null || ya === null || !w ? null : (P - ya) / w;
  }
  function reglaSVG(d, g) {
    const y = g.reglaY, max = d.marca.max, cada = max <= 20 ? 1 : max <= 50 ? 5 : 10;
    const marcas = []; for (let k = 0; k <= max; k += 1) if (k % cada === 0) marcas.push(xRegla(d, k));
    let s = T.eje(RX0, RX1, y, { marcas, alto: 6, clase: 'kit-eje kit-tenue' });
    s += T.rotulo(RX0, y + 20, '0', { ancla: 'middle', clase: 'kit-tenue' }) + T.rotulo(RX1, y + 20, fmt(max), { ancla: 'middle', clase: 'kit-tenue' });
    return s;
  }
  function manijaSVG(d, g, m, { solida, clase, rotulo, y }) {
    const x = xRegla(d, m), lado = x > W / 2 ? 'end' : 'start', dx = lado === 'end' ? -16 : 16;
    let s = solida ? `<circle cx="${T.n(x)}" cy="${T.n(y)}" r="11" fill="currentColor"/>`
      : `<circle cx="${T.n(x)}" cy="${T.n(y)}" r="6" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="3 3"/>`;
    s += T.rotulo(x + dx, y + 6, rotulo, { ancla: lado, peso: solida ? 700 : 400 });
    return `<g class="${clase}">${s}</g>`;
  }

  // ---------- dibujar ----------
  function dibujar(d, estado = {}) {
    const g = geometria(d);
    const final = !!estado.final, nuevo = new Set(final ? [] : estado.nuevo || []);
    const cls = (k, base) => `${base}${nuevo.has(k) ? ' kit-nuevo' : ''}`;
    const usa = new Set(estado.usa || []);
    const rastros = estado.rastros || {};
    let s = '';
    (d.balanzas || []).forEach((b, i) => {
      const y0 = i * g.filaH;
      if (usa.has(i)) s += T.resaltado(2, y0 + 2, W - 4, g.filaH - 4, { clase: cls('u' + i, 'kit-aparece') });
      s += T.rotulo(6, y0 + 18, String(i + 1), { peso: 700, clase: 'kit-tenue' });
      s += balanzaSVG(d, g, i, b);
      if (rastros[i]) s += fichasSVG(d, rastros[i], CX, y0 + g.filaH - 10, cls('r' + i, 'kit-aparece'));
    });
    // Balanza de trabajo: la vista del paso; mientras se responde con la marca, el platillo recibe n figuras.
    if ((d.trabajo || []).length) {
      const i = (d.balanzas || []).length, y0 = i * g.filaH;
      const k = Math.max(0, Math.min(d.trabajo.length - 1, estado.vista || 0));
      let v = d.trabajo[k];
      const conMarca = d.marca && !final && k === (d.marca.vista || 0) && Number.isFinite(estado.marca);
      if (conMarca) v = { ...v, [d.marca.lado]: { ...v[d.marca.lado], [d.marca.figura]: Math.max(0, Math.min(d.marca.max, Math.round(estado.marca))) } };
      s += `<g class="${cls('t', 'kit-trabajo')}">${balanzaSVG(d, g, i, v, { claseQuita: nuevo.has('t') ? 'kit-aparece kit-nuevo' : '' })}`;
      if (v.rotulo) s += fichasSVG(d, v.rotulo, CX, y0 + g.filaH - 10, cls('t', 'kit-aparece'));
      s += '</g>';
      // Fantasma: la balanza con la respuesta elegida, discontinua (se inclina según el peso real, si se conoce).
      const f = estado.fantasma;
      if (f && (Number.isFinite(f.marca) || f.der)) {
        let fv = null;
        if (Number.isFinite(f.marca) && d.marca) { const b0 = d.trabajo[d.marca.vista || 0]; fv = { ...b0, traba: false, [d.marca.lado]: { ...b0[d.marca.lado], [d.marca.figura]: Math.max(0, f.marca) } }; }
        else if (f.der && k === d.trabajo.length - 1) fv = { ...d.trabajo[d.trabajo.length - 1], traba: false, der: f.der, quita: null };
        if (fv && pesoLado(d, fv.izq) !== null && pesoLado(d, fv.der) !== null) s += balanzaSVG(d, g, i, fv, { fantasma: true });
      }
    }
    // Regla de la marca y lecturas.
    if (d.marca) {
      s += reglaSVG(d, g);
      const r = respuestaMarca(d);
      if (final && r !== null) s += manijaSVG(d, g, r, { solida: true, clase: 'kit-respuesta kit-aparece kit-nuevo', y: g.reglaY, rotulo: `${nombreMarca(d, r)} ✓` });
      else if (!final && Number.isFinite(estado.marca)) s += manijaSVG(d, g, estado.marca, { solida: true, clase: 'kit-marca', y: g.reglaY, rotulo: nombreMarca(d, estado.marca) });
    }
    const f = estado.fantasma;
    if (f && f.rotulo !== undefined) {
      if (d.marca && Number.isFinite(f.marca)) s += manijaSVG(d, g, f.marca, { solida: false, clase: 'kit-fantasma', y: g.fantasmaY, rotulo: `${f.rotulo ? f.rotulo + ': ' : ''}${nombreMarca(d, f.marca)}` });
      else if (f.rotulo) s += `<g class="kit-fantasma">${T.rotulo(CX, g.fantasmaY + 5, f.rotulo, { ancla: 'middle' })}</g>`;
    }
    return T.svg(W, g.alto, s, { alt: alt(d) });
  }

  // ---------- texto alternativo ----------
  const NOMBRES = { circulo: ['círculo', 'círculos'], triangulo: ['triángulo', 'triángulos'], cuadrado: ['cuadrado', 'cuadrados'], rombo: ['rombo', 'rombos'] };
  function ladoTexto(d, lado) {
    const p = [];
    for (const [k, n] of Object.entries(lado || {})) {
      if (NOMBRES[k] && n) p.push(`${n} ${NOMBRES[k][n === 1 ? 0 : 1]}`);
      else if (esFigura(d, k) && n) p.push(n === 1 ? k : `${n}${k}`);
      else if (k === 'pesa' || k === 'saco') p.push(conUnidad(d, n));
      else if (k === 'pesas') for (const [v, c] of n) if (c) p.push(`${c} de ${conUnidad(d, v)}`);
    }
    return p.length ? p.join(' y ') : 'nada';
  }
  function alt(d) {
    const est = b => { const a = inclinacion(d, b); return a > 0 ? 'baja la izquierda' : a < 0 ? 'baja la derecha' : 'en equilibrio'; };
    const bs = (d.balanzas || []).map((b, i) => `${i + 1}) ${ladoTexto(d, b.izq)} contra ${ladoTexto(d, b.der)}, ${est(b)}`);
    if (!bs.length) { const v = (d.trabajo || [])[0] || {}; return `Balanza con ${ladoTexto(d, v.izq)} a la izquierda y ${ladoTexto(d, v.der)} a la derecha`; }
    return `${bs.length === 1 ? 'Una balanza' : `${bs.length} balanzas`}: ${bs.join('; ')}`;
  }

  return { id: 'balanza', dibujar, alt, controles, pesoLado, inclinacion, cabe, respuestaMarca };
});
