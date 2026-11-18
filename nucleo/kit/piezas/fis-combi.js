/*
 * Pieza «fis-combi» (16 nov 2026, contrato «se entiende sin profesor», docs/plan-calidad.md): una combi en una pista
 * con los metros marcados. Muestra dónde está en cada segundo: lo que avanza en un segundo se ve como un tramo.
 * Reemplaza los saltos sueltos sobre una recta, que hablaban de una combi que no se dibujaba.
 *
 * Afirmación de la figura: una rapidez dice cuántos metros se avanzan en cada segundo; tramos iguales en tiempos iguales.
 *
 * datos = {
 *   v: 20,                 // m que avanza en cada segundo
 *   segundos: 5,           // cuántos segundos se dibujan (la combi queda en v · segundos)
 *   max: 100,              // m: largo de la pista dibujada
 *   paso: 10, numero: 20,  // rayita cada `paso` m y número cada `numero` m
 *   color: 'o',            // color de la variable (regla 4)
 *   rotulos: true,         // escribe «1 s», «2 s»… sobre cada combi y el largo del primer tramo
 * }
 * estado = { corte } (opcional): dibuja solo hasta ese segundo (la línea de tiempo de «Mira»).
 * Función pura de (datos, estado): sin ids, sin azar, sin reloj. La combi es un dibujo de prueba (data-prueba).
 *
 * Vista «avenida» (18 nov, Movimiento rectilíneo uniforme, idea 1; docs/etapa4/propuesta-fisica.md §2): la combi en una
 * avenida recta con la regla de metros desde el paradero. Solo con vista: 'avenida'; sin ella, la pieza dibuja lo de
 * arriba, sin cambiar nada (Magnitudes y unidades la usa así). Todo lo nuevo es dibujo de prueba (data-prueba).
 * Afirmación: la posición es la marca de la regla donde está la combi; en cada segundo se mueve lo mismo, con su signo.
 *   vista: 'avenida',
 *   x0: 20,                // m: dónde está la combi en t = 0 (puede ser negativo: antes del paradero)
 *   v: 16,                 // m/s, con signo: negativa va hacia la izquierda (la combi mira hacia ese lado)
 *   t: 2.4,                // s: el instante dibujado (por omisión, segundos); la combi firme está en x0 + v·t
 *   segundos: 5,           // hasta qué segundo se dejan las marcas (una combi tenue y un tramo por segundo)
 *   min: 0, max: 140,      // m: el tramo de regla dibujado (con min < 0 se ven las marcas antes del paradero)
 *   paso: 10, numero: 20,  // rayita cada `paso` m y número cada `numero` m
 *   color: 'o',            // velocidad: los tramos de cada segundo y la flecha
 *   colorT: 'i',           // tiempo: los rótulos «0 s», «1 s»… bajo los tramos
 *   rotulos: true,         // los rótulos de tiempo (se saltan los que se pisarían; el último siempre va)
 *   fantasmas: true,       // las combis tenues de cada segundo
 *   flecha: true, flechaTexto: '72 km/h',   // flecha de la velocidad bajo la combi firme, con su rapidez (sin signo)
 *   lugares: [{ en: 0, texto: 'Paradero' }],              // un poste con su letrero al borde de la avenida
 *   posiciones: [{ en: 20, texto: 'x₀', color: 'f' }],   // una marca sobre la regla con su rótulo (sin color: tinta)
 *   llaves: [{ de: 0, a: 20, texto: 'x₀', color: 'f', fila: 0 }],   // un tramo de la regla, acotado arriba de la avenida
 *   signo: true,           // la regla con signo: «−» a la izquierda, «+» y la punta a la derecha
 *   vehiculo: false,       // false: sin combi (solo la avenida y la regla)
 * estado = { corte }: no pasa de ese instante.
 *
 * Aceleración (18 nov, MRUV y caída libre, idea 1 «La aceleración»; docs/etapa4/propuesta-fisica.md §2, B1): la combi
 * que arranca del paradero con la flecha de su velocidad que crece cada segundo. Solo con `a` distinto de 0 o con
 * `crece`; sin ellos la vista dibuja lo mismo que antes, byte por byte (lo comprueba fis-combi.test.js).
 * Afirmación: con aceleración, la flecha de la velocidad cambia lo mismo en cada segundo y los tramos se abren o se juntan.
 *   a: 2,                  // m/s², con signo: x = x₀ + v·t + ½·a·t² y la velocidad v + a·t. Si a va contra v, la combi
 *                          //   frena hasta detenerse y se queda ahí: no retrocede
 *   crece: true,           // la flecha de la velocidad mide lo que la combi avanzaría en kFlecha segundos a esa velocidad
 *                          //   (más larga, más rápido), y cada combi tenue lleva la suya, tenue
 *   kFlecha: 0.8,          // s: con 0,8 la flecha de un segundo nunca llega a la combi del segundo siguiente si acelera
 *   flechaA: { texto: 'a' },   // la flecha de la aceleración sobre el techo de la combi firme, en carmín y con la punta
 *                          //   abierta (otra punta que la de v), con su rótulo; estado.flechaA = false la esconde
 *   colorA: 'h',           // aceleración: carmín
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
  const W = 320, H = 184, X0 = 26, X1 = 298, PISTA = 92, EJE = 144, CW = 40, CH = 22;
  const BASE = { v: 20, segundos: 0, max: 100, paso: 10, numero: 20, color: 'o', rotulos: true };
  const n = T.n;
  const conBase = d => Object.assign({}, BASE, d || {});
  const escala = d => m => X0 + (X1 - X0) * Math.max(0, Math.min(d.max, m)) / d.max;

  // La combi (dibujo de prueba): carrocería con ventanas y dos ruedas; su frente está en x.
  function combi(x, y, fantasma) {
    const x0 = x - CW;
    let s = `<path d="M${n(x0)} ${n(y - 4)}L${n(x0)} ${n(y - CH + 4)}Q${n(x0)} ${n(y - CH)} ${n(x0 + 4)} ${n(y - CH)}L${n(x - 10)} ${n(y - CH)}L${n(x)} ${n(y - 10)}L${n(x)} ${n(y - 4)}Z" fill="var(--card)" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`;
    s += `<rect x="${n(x0 + 4)}" y="${n(y - CH + 4)}" width="9" height="7" rx="1.5" fill="currentColor" fill-opacity="0.25"/>`
      + `<rect x="${n(x0 + 16)}" y="${n(y - CH + 4)}" width="9" height="7" rx="1.5" fill="currentColor" fill-opacity="0.25"/>`;
    for (const cx of [x0 + 9, x - 9]) s += `<circle cx="${n(cx)}" cy="${n(y - 2)}" r="4.5" fill="currentColor"/>`;
    return `<g class="kit-objeto${fantasma ? ' kit-fantasma' : ''}" data-objeto="combi" data-prueba="si"${fantasma ? ' opacity="0.35"' : ''}>${s}</g>`;
  }

  function dibujar(datos, estado = {}) {
    if (datos && datos.vista === 'avenida') return avenida(datos, estado);
    const d = conBase(datos), X = escala(d), c = T.color(d.color);
    const hasta = Number.isFinite(estado.corte) ? Math.max(0, Math.min(d.segundos, estado.corte)) : d.segundos;
    // pista: asfalto con su línea discontinua
    let s = `<rect x="8" y="${PISTA - 34}" width="${W - 16}" height="40" rx="6" fill="currentColor" fill-opacity="0.08"/>`
      + `<line x1="12" y1="${PISTA - 14}" x2="${W - 12}" y2="${PISTA - 14}" stroke="currentColor" stroke-width="1.5" stroke-dasharray="8 8" stroke-opacity="0.35"/>`;
    // eje de metros
    s += `<line x1="${X0}" y1="${EJE}" x2="${X1}" y2="${EJE}" stroke="currentColor" stroke-width="1.5"/>`;
    for (let m = 0; m <= d.max + 1e-9; m += d.paso) {
      const esN = Math.abs(m / d.numero - Math.round(m / d.numero)) < 1e-9;
      s += `<line x1="${n(X(m))}" y1="${EJE}" x2="${n(X(m))}" y2="${EJE + (esN ? 8 : 5)}" stroke="currentColor" stroke-width="1"/>`;
      if (esN) s += T.rotulo(X(m), EJE + 24, Kit.formatear(m, 0), { ancla: 'middle', tam: 14 });
    }
    s += T.rotulo(X1, EJE - 6, 'm', { ancla: 'end', tam: 14, peso: 700 });
    // tramos de cada segundo, en el color de la variable
    for (let k = 1; k <= hasta; k++) {
      const a = X((k - 1) * d.v), b = X(k * d.v);
      s += `<line x1="${n(a)}" y1="${PISTA + 12}" x2="${n(b)}" y2="${PISTA + 12}" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`
        + `<line x1="${n(b)}" y1="${PISTA + 6}" x2="${n(b)}" y2="${PISTA + 18}" stroke="${c}" stroke-width="2"/>`;
    }
    if (d.rotulos && hasta >= 1) s += T.rotulo((X(0) + X(d.v)) / 2, PISTA + 34, `${Kit.formatear(d.v, 2)} m`, { ancla: 'middle', tam: 14, peso: 700, color: d.color });
    // combis: las de los segundos anteriores, tenues; la última, firme
    for (let k = 0; k <= hasta; k++) {
      const x = X(k * d.v) + CW / 2;
      s += combi(Math.min(W - 6, x), PISTA - 16, k < hasta);
      if (d.rotulos && hasta > 0) s += T.rotulo(Math.min(W - 6, x) - CW / 2, PISTA - 44, `${k} s`, { ancla: 'middle', tam: 14, color: k === hasta ? d.color : undefined });
    }
    return T.svg(W, H, s, { alt: alt(d, hasta) });
  }

  function alt(datos, hasta) {
    const d = conBase(datos), k = Number.isFinite(hasta) ? hasta : d.segundos;
    return k ? `Una combi en una pista con metros marcados. Avanza ${Kit.formatear(d.v, 2)} m en cada segundo; a los ${k} s está en ${Kit.formatear(k * d.v, 2)} m.`
      : 'Una combi en el inicio de una pista con los metros marcados.';
  }

  // ---------- Vista «avenida» ----------
  const AV = { X0: 26, X1: 280, CAMINO: 58, BORDE: 98, CARRIL: 76, FLECHA: 89, ACEL: 47, TRAMO: 105, TIEMPO: 128, POS: 143, EJE: 150, NUM: 173,
    FILAS: [{ y: 44, texto: 38 }, { y: 22, texto: 16 }] };
  const BASE_AV = { x0: 0, v: 10, segundos: 0, min: 0, max: 100, paso: 10, numero: 20, color: 'o', colorT: 'i', rotulos: true,
    fantasmas: true, flecha: true, signo: false, vehiculo: true, kFlecha: 0.8, colorA: 'h' };
  const conBaseAv = d => Object.assign({}, BASE_AV, d || {});
  const escalaAv = d => m => AV.X0 + (AV.X1 - AV.X0) * (Math.max(d.min, Math.min(d.max, m)) - d.min) / (d.max - d.min);
  const fmt = m => Kit.formatear(m, 2).replace(/^-/, '−');
  const alto14 = 14;
  // Caja de un rótulo (x, y = línea base) para las pruebas de encuadre y de choques.
  const cajaTxt = (x, y, txt, ancla, tam = alto14, peso = 400) => {
    const w = T.ancho(txt, tam, peso), xx = T.encajar(x, txt, ancla, { tam, peso, min: 4, max: W - 4 });
    const izq = ancla === 'middle' ? xx - w / 2 : ancla === 'end' ? xx - w : xx;
    return { x0: izq, x1: izq + w, y0: y - tam * 0.78, y1: y + tam * 0.22, texto: txt, x: xx };
  };
  // Todo lo que la vista dibuja, con números: la usan dibujar, las manijas del juego y las pruebas.
  function geometriaAv(datos, estado = {}) {
    const d = conBaseAv(datos), X = escalaAv(d);
    const tope = Number.isFinite(estado.corte) ? estado.corte : Infinity;
    const t = Math.max(0, Math.min(Number.isFinite(d.t) ? d.t : d.segundos, tope));
    const kMax = Math.floor(Math.min(t, d.segundos) + 1e-9);
    // Con aceleración: x = x₀ + v·t + ½·a·t²; si a va contra v, se detiene en tAlto y se queda ahí (no retrocede).
    const acel = Number.isFinite(d.a) ? d.a : 0;
    const tAlto = acel && d.v && acel * d.v < 0 ? -d.v / acel : Infinity;
    const pos = acel ? k => { const q = Math.min(k, tAlto); return d.x0 + d.v * q + acel * q * q / 2; } : k => d.x0 + d.v * k;
    const vel = acel ? k => (k >= tAlto - 1e-9 ? 0 : d.v + acel * k) : () => d.v;
    const pxv = d.crece ? d.kFlecha * (AV.X1 - AV.X0) / (d.max - d.min) : 0;   // px por m/s de la flecha que crece
    const g = { d, X, t, kMax, x: pos(t), vt: vel(t), acel, tAlto, pos, vel, pxv, rotulos: [], cuerpos: [] };
    // Rótulos de tiempo: uno por segundo, sin pisarse; el del último segundo siempre queda.
    const tiempos = [];
    if (d.rotulos && d.vehiculo !== false) for (let k = 0; k <= kMax; k++) tiempos.push(cajaTxt(X(pos(k)), AV.TIEMPO, `${k} s`, 'middle'));
    const quedan = [];
    for (let i = tiempos.length - 1; i >= 0; i--) {
      const c = tiempos[i];
      if (quedan.every(q => c.x1 + 3 < q.x0 || c.x0 > q.x1 + 3)) quedan.push(Object.assign(c, { k: i }));
    }
    g.tiempos = quedan.reverse();
    g.rotulos.push(...g.tiempos);
    // Flecha de la velocidad, bajo la combi firme, con su rapidez; el rótulo va del lado de la punta si cabe.
    const vt = g.vt, L = d.crece ? pxv * Math.abs(vt) : 30;
    if (d.vehiculo !== false && d.flecha && vt && L >= 2) {
      const cx = X(g.x), dir = vt > 0 ? 1 : -1, x2 = cx + dir * L;
      const txt = d.flechaTexto || `${fmt(Math.abs(vt))} m/s`, w = T.ancho(txt, alto14, 700);
      let lx = dir > 0 ? x2 + 6 : x2 - 6, ancla = dir > 0 ? 'start' : 'end';
      if (dir > 0 && lx + w > W - 4) { lx = cx - 6; ancla = 'end'; }
      if (dir < 0 && lx - w < 4) { lx = cx + 6; ancla = 'start'; }
      g.flecha = { x1: cx, x2, y: AV.FLECHA, txt, caja: cajaTxt(lx, AV.FLECHA + 5, txt, ancla, alto14, 700), ancla, lx };
      g.rotulos.push(g.flecha.caja);
    }
    // Con `crece`, cada combi tenue lleva la flecha de su velocidad en ese segundo, tenue y sin rótulo.
    g.tenues = [];
    if (d.crece && d.vehiculo !== false && d.flecha && d.fantasmas) for (let k = 0; k <= kMax; k++) {
      const vk = vel(k), Lk = pxv * Math.abs(vk);
      if (Math.abs(k - t) > 1e-9 && vk && Lk >= 2) g.tenues.push({ k, x1: X(pos(k)), x2: X(pos(k)) + (vk > 0 ? 1 : -1) * Lk });
    }
    // Una flecha tenue que se montaría en la siguiente (la combi firme recién salió de ahí, o frena fuerte) no se dibuja:
    // de la última hacia atrás, cada una tiene que terminar antes de donde empieza la que sigue.
    for (let i = g.tenues.length - 1, sig = g.flecha; i >= 0; i--) {
      const fl = g.tenues[i], dir = fl.x2 > fl.x1 ? 1 : -1;
      if (sig && (dir > 0 ? fl.x2 > sig.x1 : fl.x2 < sig.x1)) g.tenues.splice(i, 1);
      else sig = fl;
    }
    // La flecha de la aceleración, sobre el techo de la combi firme (mientras no se detuvo). Si se saldría del lienzo,
    // se corre sin dejar de estar sobre la combi.
    if (d.vehiculo !== false && d.flechaA && estado.flechaA !== false && acel && t < tAlto - 1e-9) {
      const cx = X(g.x), dir = acel > 0 ? 1 : -1, LA = 26;
      // Sale 5 px corrida del centro de la combi, para no cruzar el poste de un lugar donde está la combi.
      let x1 = cx + dir * 5, x2 = cx + dir * (5 + LA);
      const lo = Math.min(x1, x2), hi = Math.max(x1, x2), corre = lo < 8 ? 8 - lo : hi > W - 8 ? W - 8 - hi : 0;
      x1 += corre; x2 += corre;
      const txt = (typeof d.flechaA === 'object' && d.flechaA.texto) || 'a', w = T.ancho(txt, alto14, 700);
      let lx = dir > 0 ? x2 + 6 : x2 - 6, ancla = dir > 0 ? 'start' : 'end';
      if (dir > 0 && lx + w > W - 4) { lx = x1 - 6; ancla = 'end'; }
      if (dir < 0 && lx - w < 4) { lx = x1 + 6; ancla = 'start'; }
      g.flechaA = { x1, x2, y: AV.ACEL, dir, txt, ancla, caja: cajaTxt(lx, AV.ACEL + 5, txt, ancla, alto14, 700) };
      g.rotulos.push(g.flechaA.caja);
    }
    g.lugares = (d.lugares || []).map(l => {
      const px = X(l.en), w = T.ancho(l.texto, alto14), der = px + 10 + w <= W - 4;
      const caja = cajaTxt(der ? px + 10 : px - 10, 34, l.texto, der ? 'start' : 'end');
      g.rotulos.push(caja);
      return { px, texto: l.texto, caja, ancla: der ? 'start' : 'end' };
    });
    g.posiciones = (d.posiciones || []).map(p => {
      const caja = cajaTxt(X(p.en), AV.POS, p.texto, 'middle', alto14, 700);
      g.rotulos.push(caja);
      return { px: X(p.en), texto: p.texto, color: p.color, caja };
    });
    g.llaves = (d.llaves || []).map(l => {
      const f = AV.FILAS[l.fila || 0], a = X(l.de), b = X(l.a);
      const caja = cajaTxt((a + b) / 2, f.texto, l.texto, 'middle', alto14, 700);
      g.rotulos.push(caja);
      return { a: Math.min(a, b), b: Math.max(a, b), y: f.y, texto: l.texto, color: l.color, caja };
    });
    g.numeros = [];
    for (let m = Math.ceil(d.min / d.paso - 1e-9) * d.paso; m <= d.max + 1e-9; m += d.paso) {
      const esN = Math.abs(m / d.numero - Math.round(m / d.numero)) < 1e-9;
      if (esN) { const c = cajaTxt(X(m), AV.NUM, fmt(Math.round(m * 100) / 100), 'middle'); g.numeros.push(Object.assign(c, { m })); g.rotulos.push(c); }
    }
    g.unidad = cajaTxt(W - 4, AV.NUM, 'm', 'end', alto14, 700);
    g.rotulos.push(g.unidad);
    if (d.signo) {
      g.mas = cajaTxt(W - 4, AV.EJE + 5, '+', 'end', 16, 700);
      g.menos = cajaTxt(4, AV.EJE + 5, '−', 'start', 16, 700);
      g.rotulos.push(g.mas, g.menos);
    }
    return g;
  }

  // La combi mira hacia la derecha; con v negativa, se refleja sobre su centro.
  function combiAv(cx, y, fantasma, izquierda) {
    const c = combi(cx + CW / 2, y, fantasma);
    return izquierda ? `<g transform="translate(${n(2 * cx)} 0) scale(-1 1)">${c}</g>` : c;
  }

  function avenida(datos, estado = {}) {
    const g = geometriaAv(datos, estado), d = g.d, X = g.X, c = T.color(d.color), izq = d.v < 0;
    const txt = (b, o) => T.rotulo(b.x, b.y1 - alto14 * 0.22, b.texto, Object.assign({ tam: alto14, min: 4, max: W - 4 }, o));
    // la avenida: asfalto con su línea discontinua
    let s = `<g data-prueba="si" class="fis-avenida"><rect x="6" y="${AV.CAMINO}" width="${W - 12}" height="${AV.BORDE - AV.CAMINO}" rx="6" fill="currentColor" fill-opacity="0.08"/>`
      + `<line x1="10" y1="${(AV.CAMINO + AV.BORDE) / 2}" x2="${W - 10}" y2="${(AV.CAMINO + AV.BORDE) / 2}" stroke="currentColor" stroke-width="1.5" stroke-dasharray="8 8" stroke-opacity="0.35"/></g>`;
    // lugares: un poste con su letrero al borde de la avenida (dibujo de prueba)
    for (const l of g.lugares) {
      s += `<g class="kit-objeto" data-objeto="lugar" data-prueba="si"><line x1="${n(l.px)}" y1="${AV.CAMINO}" x2="${n(l.px)}" y2="26" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`
        + `<rect x="${n(l.px - 6)}" y="20" width="12" height="12" rx="2" fill="var(--card)" stroke="currentColor" stroke-width="2"/></g>`
        + txt(l.caja, { ancla: l.ancla });
    }
    // llaves: un tramo de la regla, acotado arriba de la avenida
    for (const l of g.llaves) {
      const k = T.color(l.color);
      s += `<path d="M${n(l.a)} ${l.y + 6}V${l.y}H${n(l.b)}V${l.y + 6}" fill="none" stroke="${k}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`
        + txt(l.caja, { ancla: 'middle', peso: 700, color: l.color });
    }
    // la regla de metros
    const fin = d.signo ? AV.X1 + 12 : AV.X1;
    s += `<line x1="${AV.X0 - 6}" y1="${AV.EJE}" x2="${n(fin)}" y2="${AV.EJE}" stroke="currentColor" stroke-width="1.5"/>`;
    if (d.signo) s += `<path d="M${n(fin)} ${AV.EJE}l-8 -4.5v9z" fill="currentColor"/>`;
    for (let m = Math.ceil(d.min / d.paso - 1e-9) * d.paso; m <= d.max + 1e-9; m += d.paso) {
      const esN = Math.abs(m / d.numero - Math.round(m / d.numero)) < 1e-9;
      s += `<line x1="${n(X(m))}" y1="${AV.EJE}" x2="${n(X(m))}" y2="${AV.EJE + (esN ? 8 : 5)}" stroke="currentColor" stroke-width="1"/>`;
    }
    for (const b of g.numeros) s += txt(b, { ancla: 'middle' });
    s += txt(g.unidad, { ancla: 'end', peso: 700 });
    if (d.signo) s += T.rotulo(g.mas.x, AV.EJE + 5, '+', { ancla: 'end', tam: 16, peso: 700, min: 4, max: W - 4 })
      + T.rotulo(g.menos.x, AV.EJE + 5, '−', { ancla: 'start', tam: 16, peso: 700, min: 4, max: W - 4 });
    // marcas con nombre sobre la regla
    for (const p of g.posiciones) {
      const k = T.color(p.color);
      s += `<line x1="${n(p.px)}" y1="${AV.EJE - 4}" x2="${n(p.px)}" y2="${AV.EJE + 4}" stroke="${k}" stroke-width="3" stroke-linecap="round"/>`
        + txt(p.caja, { ancla: 'middle', peso: 700, color: p.color });
    }
    if (d.vehiculo !== false) {
      // un tramo por segundo, en el color de la velocidad, con su marca al final; y la marca de la salida
      if (d.rotulos || g.kMax >= 1) s += `<line x1="${n(X(d.x0))}" y1="${AV.TRAMO - 6}" x2="${n(X(d.x0))}" y2="${AV.TRAMO + 6}" stroke="${c}" stroke-width="2"/>`;
      for (let k = 1; k <= g.kMax; k++) {
        const a = X(g.pos(k - 1)), b = X(g.pos(k));
        s += `<line x1="${n(a)}" y1="${AV.TRAMO}" x2="${n(b)}" y2="${AV.TRAMO}" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`
          + `<line x1="${n(b)}" y1="${AV.TRAMO - 6}" x2="${n(b)}" y2="${AV.TRAMO + 6}" stroke="${c}" stroke-width="2"/>`;
      }
      for (const b of g.tiempos) s += txt(b, { ancla: 'middle', color: d.colorT });
      // combis: las de cada segundo, tenues; la del instante t, firme
      if (d.fantasmas) for (let k = 0; k <= g.kMax; k++) if (Math.abs(k - g.t) > 1e-9) s += combiAv(X(g.pos(k)), AV.CARRIL, true, g.vel(k) ? g.vel(k) < 0 : izq);
      s += combiAv(X(g.x), AV.CARRIL, false, g.vt ? g.vt < 0 : izq);
      for (const f of g.tenues) s += `<g class="kit-fantasma" opacity="0.35">${T.flecha(f.x1, AV.FLECHA, f.x2, AV.FLECHA, { color: d.color, grosor: 3 })}</g>`;
      if (g.flecha) s += T.flecha(g.flecha.x1, AV.FLECHA, g.flecha.x2, AV.FLECHA, { color: d.color, grosor: 3 })
        + txt(g.flecha.caja, { ancla: g.flecha.ancla, peso: 700, color: d.color });
      // La aceleración: línea y punta abierta (dos trazos), para que no se confunda con la flecha llena de v.
      if (g.flechaA) {
        const f = g.flechaA, k = T.color(d.colorA), y = f.y;
        s += `<g class="fis-aceleracion"><line x1="${n(f.x1)}" y1="${y}" x2="${n(f.x2 - f.dir * 1.5)}" y2="${y}" stroke="${k}" stroke-width="3" stroke-linecap="round"/>`
          + `<path d="M${n(f.x2 - f.dir * 9)} ${y - 6}L${n(f.x2)} ${y}L${n(f.x2 - f.dir * 9)} ${y + 6}" fill="none" stroke="${k}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>`
          + txt(f.caja, { ancla: f.ancla, peso: 700, color: d.colorA });
      }
    }
    return T.svg(W, H, s, { alt: altAv(d, g) });
  }

  function altAv(datos, g) {
    const d = conBaseAv(datos);
    g = g || geometriaAv(d);
    const lugar = (d.lugares || []).find(l => l.en === 0);
    let s = `Una avenida recta con una regla de metros${lugar ? ` que empieza en el ${lugar.texto.toLowerCase()}` : ''}.`;
    if (d.vehiculo === false) return s;
    const hacia = d.v > 0 ? 'hacia la derecha' : d.v < 0 ? 'hacia la izquierda' : 'quieta';
    const acel = Number.isFinite(d.a) ? d.a : 0;
    if (acel && !d.v) s += ` La combi sale de x = ${fmt(d.x0)} m y arranca hacia la ${acel > 0 ? 'derecha' : 'izquierda'}.`;
    else s += ` La combi sale de x = ${fmt(d.x0)} m y va ${d.v ? `a ${fmt(Math.abs(d.v))} m/s ` : ''}${hacia}.`;
    if (acel) s += ` Su velocidad ${acel * d.v < 0 ? 'baja' : 'sube'} ${fmt(Math.abs(acel))} m/s en cada segundo${acel * d.v < 0 ? ', hasta detenerse si no se acaba el tramo' : ''}.`;
    if (g.kMax >= 1) s += ` Deja una marca en cada segundo, hasta los ${g.kMax} s.`;
    return s;
  }

  return { id: 'fis-combi', dibujar, alt: d => (d && d.vista === 'avenida' ? altAv(d) : alt(d)), escala: d => (d && d.vista === 'avenida' ? escalaAv(conBaseAv(d)) : escala(conBase(d))),
    geometria: (d, e) => geometriaAv(d, e), constantes: { W, H, X0, X1, CW, AV } };
});
