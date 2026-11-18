/*
 * Pieza «fis-mruv» (18 nov 2026, «MRUV y caída libre», ideas B1 a B6; docs/etapa4/propuesta-fisica.md §2): los objetos
 * de la unidad que no son la combi en la avenida con su regla (esa es fis-combi, que no se toca aquí). Todo es dibujo de
 * prueba (data-prueba): Gerson decide después cuáles reemplaza (docs/plan-calidad.md, M4).
 *
 * Todo número que se ve lo trae quien llama: la pieza solo convierte metros, segundos y m/s a píxeles. Función pura de
 * (datos, estado): sin ids, sin azar, sin reloj. Ancho 320; solo currentColor y var(--c-*). geometria(datos, estado)
 * devuelve las cajas de todos los rótulos y de los objetos, para las pruebas de encuadre y de choques (fis-mruv.test.js).
 *
 * Vistas (datos.vista):
 *   grafica  una gráfica (v–t, x–t o a–t).
 *            Afirmación: lo que se pide se lee en la gráfica: la inclinación, el área con su signo o un corte.
 *            datos = { x: { min, max, paso, cada, nombre: 't', unidad: 's', color: 'i' }, y: { … }, alto: 150,
 *                      curvas, areas, puntos, escalones, tangentes, textos, alt }
 *              curvas:     [{ puntos: [[x, y] | null, …], color, discontinua, rotulo, en: [x, y], ancla, dx, dy, desde, hasta }]
 *              areas:      [{ puntos: [[x, y], …], color, rotulo, en, desde, hasta }]   región entre la poligonal y y = 0;
 *                          bajo el eje es más tenue y con borde discontinuo (el signo se ve)
 *              puntos:     [{ x, y, color, rotulo, ancla, dx, dy, guias, abierto, desde, hasta }]
 *              escalones:  [{ t, dt, v, a, color: 'h', rotulo, ancla, dx, dy }]   la pendiente: dt a la derecha y a·dt hacia
 *                          arriba (o abajo), en carmín
 *              tangentes:  [{ t, y, m, ancho, color, rotulo }]   la recta que toca la curva en t con inclinación m
 *              textos:     [{ en: [x, y], texto, color, ancla, peso, dx, dy }]   un «?» o una letra suelta
 *   tres     las tres gráficas de un mismo movimiento, apiladas con el mismo eje t: x–t, v–t y a–t.
 *            Afirmación: x–t es una curva, v–t una recta y a–t una horizontal: tres formas para el mismo MRUV.
 *            datos = { x: { … }, graficas: [g, g, g] }   cada g como una «grafica» sin su eje x
 *   pista    un atleta en los 100 m, con su gráfica v–t debajo.
 *            Afirmación: lo que avanza el atleta es el área bajo su gráfica v–t.
 *            datos = { largo: 100, x, marcas: [m, …], grafica: { … } }   x: dónde está; marcas: dónde estaba cada segundo
 *   alcance  la combi que arranca del paradero y el mototaxi que pasa, en la avenida, con su gráfica x–t debajo.
 *            Afirmación: se alcanzan donde se cortan sus gráficas x–t.
 *            datos = { regla: { min, max, paso, numero }, combi: { x }, mototaxi: { x }, lugares: [{ en, texto }],
 *                      grafica: { … } }
 *   combi    la combi en la avenida sin regla de metros, con las flechas de v y de a (cuando el problema no usa el eje).
 *            Afirmación: la velocidad y la aceleración son dos flechas distintas sobre la misma combi.
 *            datos = { lugar: 'Grifo', v: { texto, sentido: 1 }, a: { texto, sentido: 1 } }
 *   regla    la regla de 30 cm que tu compañero suelta entre tus dedos.
 *            Afirmación: lo que cae la regla antes de que cierres los dedos crece con el cuadrado del tiempo.
 *            datos = { cae: 20 (cm), soltada, cerrada, marcas: [{ cm, texto }], atrapa: '20 cm' }
 *   pabellon la pelota (o la canica y la piedra) junto al pabellón del colegio, con las alturas en metros.
 *            Afirmación: la flecha de g es la misma en cada punto; la de v cambia.
 *            datos = { alto: 20, paso: 1, numero: 5, regla: false, cota: { de, a, texto }, edificio: { techo: 5, pisos: 1, ventana }, pelotas: [{ y, v,
 *                      texto, marcas: [y, …], grande, chica, rotulo }], g: { texto } | false }
 * estado = { corte }: en grafica, tres y pista, cada elemento con desde/hasta aparece solo en esos pasos de «Mira».
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
  const n = T.n;
  const fmt = (v, d = 2) => Kit.formatear(v, d).replace(/^-/, '−');
  const lim = (v, a, b) => Math.min(b, Math.max(a, v));

  // Caja de un rótulo (y = línea base), ya encajado en [4, W − 4]: la misma que se dibuja.
  function caja(x, y, texto, o = {}) {
    const tam = o.tam || TAM, peso = o.peso || 400, ancla = o.ancla || 'start';
    const w = T.ancho(String(texto), tam, peso), xx = T.encajar(x, String(texto), ancla, { tam, peso, min: M, max: W - M });
    const izq = ancla === 'middle' ? xx - w / 2 : ancla === 'end' ? xx - w : xx;
    return { x0: izq, x1: izq + w, y0: y - tam * 0.78, y1: y + tam * 0.22, texto: String(texto), x: xx, y, ancla, tam, peso, color: o.color, tipo: o.tipo || 'rotulo' };
  }
  const pinta = b => T.rotulo(b.x, b.y, b.texto, { ancla: b.ancla, tam: b.tam, peso: b.peso, color: b.color, min: M, max: W - M });
  const choca = (a, b, s = 2) => a.x0 < b.x1 + s && b.x0 < a.x1 + s && a.y0 < b.y1 + s && b.y0 < a.y1 + s;
  // Punta abierta (dos trazos) para la aceleración: otra punta que la de v (llena).
  function flechaA(x1, y1, x2, y2, c) {
    const ang = Math.atan2(y2 - y1, x2 - x1), ca = Math.cos(ang), sa = Math.sin(ang);
    const p = (dx, dy) => `${n(x2 + dx * ca - dy * sa)} ${n(y2 + dx * sa + dy * ca)}`;
    return `<g class="fis-aceleracion"><line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2 - ca * 1.5)}" y2="${n(y2 - sa * 1.5)}" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`
      + `<path d="M${p(-9, -6)}L${p(0, 0)}L${p(-9, 6)}" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  }

  // ---------- Una gráfica en el rectángulo R ----------
  function rayitas(e, largo) {
    const paso = e.paso > 0 ? e.paso : (e.max - e.min) / 5, vals = [];
    for (let k = Math.ceil(e.min / paso - 1e-9); k <= Math.floor(e.max / paso + 1e-9); k++) vals.push(Math.round(k * paso * 1e9) / 1e9);
    const sep = largo * paso / ((e.max - e.min) || 1);
    let cada = Math.max(1, e.cada || 1);
    while (sep * cada < 16 && cada < 50) cada++;
    return { vals, paso, cada };
  }
  const nombre = e => (e.nombre ? `${e.nombre}${e.unidad ? ` (${e.unidad})` : ''}` : '');
  // Arma la gráfica: devuelve { s, rotulos, X, Y, R, lineas } (lineas: los puntos en píxeles, para las pruebas).
  function plano(sp, R, corte, o = {}) {
    const ex = sp.x, ey = sp.y, sx = (ex.max - ex.min) || 1, sy = (ey.max - ey.min) || 1;
    const X = v => R.x0 + (R.x1 - R.x0) * (v - ex.min) / sx, Y = v => R.y1 - (R.y1 - R.y0) * (v - ey.min) / sy;
    const ve = e => (e.desde || 0) <= corte && !(e.hasta !== undefined && corte > e.hasta);
    const rot = [], lineas = [];
    let s = '';
    const rx = rayitas(ex, R.x1 - R.x0), ry = rayitas(ey, R.y1 - R.y0);
    let grid = '';
    for (const v of rx.vals) grid += T.linea(X(v), R.y0, X(v), R.y1, { grosor: 1, opacidad: 0.16 });
    for (const v of ry.vals) grid += T.linea(R.x0, Y(v), R.x1, Y(v), { grosor: 1, opacidad: 0.16 });
    s += `<g class="kit-cuadricula">${grid}</g>`;
    const cero = Y(lim(0, ey.min, ey.max));
    s += `<g class="kit-eje">${T.flecha(R.x0, R.y1 + 4, R.x0, R.y0 - 12, { grosor: 2 })}${T.flecha(R.x0 - 4, cero, R.x1 + 12, cero, { grosor: 2 })}</g>`;
    ry.vals.forEach(v => { if (Math.round(v / ry.paso) % ry.cada === 0) rot.push(caja(R.x0 - 7, Y(v) + 5, fmt(v), { ancla: 'end', tipo: 'numero' })); });
    if (o.numerosX !== false) rx.vals.forEach(v => { if (Math.round(v / rx.paso) % rx.cada === 0) rot.push(caja(X(v), R.y1 + 18, fmt(v), { ancla: 'middle', tipo: 'numero' })); });
    if (nombre(ey)) rot.push(caja(R.x0 + 10, R.y0 - 9, nombre(ey), { color: ey.color, peso: 700, tipo: 'nombre' }));
    if (o.nombreX !== false && nombre(ex)) rot.push(caja(W - M, R.y1 + 36, nombre(ex), { color: ex.color, peso: 700, ancla: 'end', tipo: 'nombre' }));
    const P = p => `${n(X(p[0]))} ${n(Y(p[1]))}`;
    const etiqueta = (e, x, y, porDef) => {
      const ancla = e.ancla || porDef.ancla;
      rot.push(caja(x + (e.dx !== undefined ? e.dx : porDef.dx), y + (e.dy !== undefined ? e.dy : porDef.dy), e.rotulo, { color: e.color, peso: 700, ancla }));
    };
    // Áreas: entre la poligonal y el eje; bajo el eje, más tenue y con borde discontinuo.
    for (const a of sp.areas || []) if (ve(a)) {
      const pts = (a.puntos || []).filter(Boolean);
      if (pts.length < 2) continue;
      const poli = [[pts[0][0], 0], ...pts, [pts[pts.length - 1][0], 0]];
      const media = pts.reduce((m, p) => m + p[1], 0) / pts.length, neg = media < 0, c = T.color(a.color);
      s += `<path class="kit-crece" d="M${poli.map(P).join('L')}Z" fill="${c}" fill-opacity="${neg ? 0.13 : 0.26}" stroke="${c}" stroke-width="1"${neg ? ' stroke-dasharray="4 3"' : ''}/>`;
      if (a.rotulo) {
        let cx, cy;
        if (a.en) { cx = X(a.en[0]); cy = Y(a.en[1]); } else {
          // centroide del polígono, en píxeles
          let A = 0, gx = 0, gy = 0; const q = poli.map(p => [X(p[0]), Y(p[1])]);
          for (let i = 0; i < q.length; i++) { const [x1, y1] = q[i], [x2, y2] = q[(i + 1) % q.length], k = x1 * y2 - x2 * y1; A += k; gx += (x1 + x2) * k; gy += (y1 + y2) * k; }
          cx = Math.abs(A) > 1e-9 ? gx / (3 * A) : q[0][0]; cy = Math.abs(A) > 1e-9 ? gy / (3 * A) : q[0][1];
        }
        // si pisaría el rótulo de otra área, no va (la lectura lo dice): el primero manda
        const b = caja(cx, cy + 5, a.rotulo, { color: a.color, peso: 700, ancla: 'middle', tipo: 'area' });
        if (rot.every(q => q.tipo !== 'area' || !choca(q, b))) rot.push(b);
      }
    }
    for (const cv of sp.curvas || []) if (ve(cv)) {
      let d = '', nuevo = true;
      for (const p of cv.puntos || []) { if (!p) { nuevo = true; continue; } d += (nuevo ? 'M' : 'L') + P(p); nuevo = false; lineas.push([X(p[0]), Y(p[1])]); }
      if (!d) continue;
      s += `<path class="kit-crece" d="${d}" fill="none" stroke="${T.color(cv.color)}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"${cv.discontinua ? ' stroke-dasharray="7 5"' : ''}/>`;
      if (cv.rotulo) {
        const ult = cv.en || [...cv.puntos].reverse().find(Boolean), x = X(ult[0]), y = Y(ult[1]);
        etiqueta(cv, x, y, { ancla: x > W * 0.6 ? 'end' : 'start', dx: 0, dy: -10 });
      }
    }
    for (const e of sp.escalones || []) if (ve(e)) {
      const x1 = X(e.t), x2 = X(e.t + e.dt), y1 = Y(e.v), y2 = Y(e.v + e.a * e.dt), c = T.color(e.color || 'h');
      s += `<path class="fis-escalon" d="M${n(x1)} ${n(y1)}H${n(x2)}V${n(y2)}" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="5 3"/>`;
      lineas.push([x1, y1], [x2, y1], [x2, y2]);
      if (e.rotulo) etiqueta(Object.assign({ color: e.color || 'h' }, e), x2, (y1 + y2) / 2, { ancla: 'start', dx: 6, dy: 5 });
    }
    for (const tg of sp.tangentes || []) if (ve(tg)) {
      const w = tg.ancho || 2, a = [tg.t - w, tg.y - tg.m * w], b = [tg.t + w, tg.y + tg.m * w];
      s += `<line class="fis-tangente" x1="${n(X(a[0]))}" y1="${n(Y(a[1]))}" x2="${n(X(b[0]))}" y2="${n(Y(b[1]))}" stroke="${T.color(tg.color || 'o')}" stroke-width="2.5" stroke-linecap="round"/>`;
      lineas.push([X(a[0]), Y(a[1])], [X(b[0]), Y(b[1])]);
      if (tg.rotulo) etiqueta(Object.assign({ color: tg.color || 'o' }, tg), X(b[0]), Y(b[1]), { ancla: 'start', dx: 4, dy: 4 });
    }
    for (const p of sp.puntos || []) if (ve(p)) {
      const x = X(p.x), y = Y(p.y), c = T.color(p.color);
      if (p.guias) s += T.linea(x, y, x, cero, { grosor: 1, discontinua: true, opacidad: 0.7 }) + T.linea(x, y, R.x0, y, { grosor: 1, discontinua: true, opacidad: 0.7 });
      s += `<circle cx="${n(x)}" cy="${n(y)}" r="5" fill="${p.abierto ? 'var(--card)' : c}" stroke="${c}" stroke-width="2.5"/>`;
      lineas.push([x, y]);
      if (p.rotulo) etiqueta(p, x, y, { ancla: x > W * 0.6 ? 'end' : 'start', dx: x > W * 0.6 ? -9 : 9, dy: -9 });
    }
    for (const t of sp.textos || []) if (ve(t)) rot.push(caja(X(t.en[0]) + (t.dx || 0), Y(t.en[1]) + (t.dy || 0), t.texto, { color: t.color, peso: t.peso || 700, ancla: t.ancla || 'middle' }));
    return { s, rotulos: rot, X, Y, R, lineas };
  }

  // ---------- Objetos (dibujos de prueba) ----------
  // La combi de fis-combi (el mismo dibujo, para que se reconozca), centrada en cx con las ruedas en y.
  function combi(cx, y, izquierda, tenue) {
    const x = cx + 20, x0 = cx - 20, CH = 22;
    let s = `<path d="M${n(x0)} ${n(y - 4)}L${n(x0)} ${n(y - CH + 4)}Q${n(x0)} ${n(y - CH)} ${n(x0 + 4)} ${n(y - CH)}L${n(x - 10)} ${n(y - CH)}L${n(x)} ${n(y - 10)}L${n(x)} ${n(y - 4)}Z" fill="var(--card)" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`;
    s += `<rect x="${n(x0 + 4)}" y="${n(y - CH + 4)}" width="9" height="7" rx="1.5" fill="currentColor" fill-opacity="0.25"/><rect x="${n(x0 + 16)}" y="${n(y - CH + 4)}" width="9" height="7" rx="1.5" fill="currentColor" fill-opacity="0.25"/>`;
    for (const c of [x0 + 9, x - 9]) s += `<circle cx="${n(c)}" cy="${n(y - 2)}" r="4.5" fill="currentColor"/>`;
    const g = `<g class="kit-objeto" data-objeto="combi" data-prueba="si"${tenue ? ' opacity="0.35"' : ''}>${s}</g>`;
    return izquierda ? `<g transform="translate(${n(2 * cx)} 0) scale(-1 1)">${g}</g>` : g;
  }
  // El mototaxi (dibujo de prueba): cabina con techo de lona, el conductor adelante y tres ruedas (se ven dos).
  function mototaxi(cx, y) {
    const x0 = cx - 17, x1 = cx + 17;
    let s = `<path d="M${n(x0)} ${n(y - 5)}V${n(y - 20)}Q${n(x0)} ${n(y - 25)} ${n(x0 + 5)} ${n(y - 25)}H${n(cx + 4)}L${n(cx + 8)} ${n(y - 12)}H${n(x1)}V${n(y - 5)}Z" fill="var(--card)" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`;
    s += `<path d="M${n(x0 + 3)} ${n(y - 22)}H${n(cx + 2)}" stroke="currentColor" stroke-width="2" stroke-opacity="0.5"/><circle cx="${n(cx + 11)}" cy="${n(y - 17)}" r="3.5" fill="currentColor"/>`;
    for (const c of [x0 + 7, x1 - 4]) s += `<circle cx="${n(c)}" cy="${n(y - 2)}" r="4" fill="currentColor"/>`;
    return `<g class="kit-objeto" data-objeto="mototaxi" data-prueba="si">${s}</g>`;
  }
  // El atleta (dibujo de prueba), con los pies en y.
  function atleta(x, y) {
    const s = `<circle cx="${n(x + 3)}" cy="${n(y - 30)}" r="5" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`
      + `<path d="M${n(x + 1)} ${n(y - 25)}L${n(x - 2)} ${n(y - 12)}M${n(x - 2)} ${n(y - 12)}L${n(x + 6)} ${n(y - 6)}L${n(x + 3)} ${n(y)}M${n(x - 2)} ${n(y - 12)}L${n(x - 9)} ${n(y - 4)}L${n(x - 13)} ${n(y - 3)}`
      + `M${n(x)} ${n(y - 22)}L${n(x + 8)} ${n(y - 16)}M${n(x)} ${n(y - 22)}L${n(x - 8)} ${n(y - 17)}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    return `<g class="kit-objeto" data-objeto="atleta" data-prueba="si">${s}</g>`;
  }

  // ---------- Vistas ----------
  const RG = alto => ({ x0: 48, x1: 300, y0: 34, y1: 34 + alto });
  function vGrafica(d, e) {
    const R = RG(d.alto || 150), p = plano(d, R, e.corte || 0);
    return { H: R.y1 + 44, s: p.s, rotulos: p.rotulos, objetos: [], lineas: p.lineas, planos: [p] };
  }
  function vTres(d, e) {
    const out = { s: '', rotulos: [], objetos: [], lineas: [], planos: [] };
    (d.graficas || []).forEach((g, k) => {
      const R = { x0: 48, x1: 300, y0: 30 + k * 110, y1: 30 + k * 110 + 64 };
      const p = plano(Object.assign({ x: d.x }, g), R, e.corte || 0, { nombreX: k === d.graficas.length - 1 });
      out.s += p.s; out.rotulos.push(...p.rotulos); out.lineas.push(...p.lineas); out.planos.push(p); out.H = R.y1 + 44;
    });
    return out;
  }
  function vPista(d, e) {
    const L = d.largo || 100, X = m => 26 + 268 * lim(m, 0, L) / L, Y0 = 30, Y1 = 66;
    let s = `<g data-prueba="si" class="fis-pista"><rect x="12" y="${Y0}" width="${W - 24}" height="${Y1 - Y0}" rx="5" fill="currentColor" fill-opacity="0.07"/>`
      + `<line x1="14" y1="${(Y0 + Y1) / 2}" x2="${W - 14}" y2="${(Y0 + Y1) / 2}" stroke="currentColor" stroke-opacity="0.35" stroke-width="1.5"/>`
      + `<line x1="${n(X(0))}" y1="${Y0}" x2="${n(X(0))}" y2="${Y1}" stroke="currentColor" stroke-width="3"/>`
      + `<line x1="${n(X(L))}" y1="${Y0}" x2="${n(X(L))}" y2="${Y1}" stroke="currentColor" stroke-width="3" stroke-dasharray="4 3"/></g>`;
    const rot = [caja(X(0), Y0 - 8, 'salida', { ancla: 'start' }), caja(X(L), Y0 - 8, 'meta', { ancla: 'end' })];
    for (let m = 0; m <= L + 1e-9; m += 10) s += `<line x1="${n(X(m))}" y1="${Y1}" x2="${n(X(m))}" y2="${Y1 + (m % 50 ? 4 : 8)}" stroke="currentColor" stroke-width="1"/>`;
    for (const m of [0, L / 2, L]) rot.push(caja(X(m), Y1 + 22, m === L ? `${fmt(m)} m` : fmt(m), { ancla: 'middle', tipo: 'numero' }));
    // dónde estaba en cada segundo: rayitas en tinta sobre el carril (la pista y sus marcas no son una magnitud: sin color)
    for (const m of d.marcas || []) s += `<line x1="${n(X(m))}" y1="${Y1 - 6}" x2="${n(X(m))}" y2="${Y1 + 2}" stroke="currentColor" stroke-opacity="0.7" stroke-width="2.5" stroke-linecap="round"/>`;
    const ax = X(Number.isFinite(d.x) ? d.x : 0);
    s += atleta(ax, Y1 - 4);
    const R = { x0: 48, x1: 300, y0: 124, y1: 124 + (d.grafica && d.grafica.alto || 120) };
    const p = plano(d.grafica, R, e.corte || 0);
    return { H: R.y1 + 44, s: s + p.s, rotulos: rot.concat(p.rotulos), objetos: [{ nombre: 'atleta', x0: ax - 13, x1: ax + 9, y0: Y1 - 39, y1: Y1 - 4 }], lineas: p.lineas, planos: [p] };
  }
  function vAlcance(d, e) {
    const rg = Object.assign({ min: 0, max: 200, paso: 25, numero: 50 }, d.regla || {});
    const X = m => 26 + 254 * (lim(m, rg.min, rg.max) - rg.min) / (rg.max - rg.min), Y0 = 30, Y1 = 88, EJE = 98;
    let s = `<g data-prueba="si" class="fis-avenida"><rect x="6" y="${Y0}" width="${W - 12}" height="${Y1 - Y0}" rx="6" fill="currentColor" fill-opacity="0.08"/>`
      + `<line x1="10" y1="${(Y0 + Y1) / 2 + 2}" x2="${W - 10}" y2="${(Y0 + Y1) / 2 + 2}" stroke="currentColor" stroke-width="1.5" stroke-dasharray="8 8" stroke-opacity="0.35"/></g>`;
    const rot = [], obj = [];
    for (const l of d.lugares || []) {
      const px = X(l.en);
      s += `<g class="kit-objeto" data-objeto="lugar" data-prueba="si"><line x1="${n(px)}" y1="${Y0}" x2="${n(px)}" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><rect x="${n(px - 5)}" y="8" width="10" height="10" rx="2" fill="var(--card)" stroke="currentColor" stroke-width="2"/></g>`;
      rot.push(caja(px + 9, 20, l.texto, { ancla: 'start' }));
    }
    s += `<line x1="20" y1="${EJE}" x2="${W - 14}" y2="${EJE}" stroke="currentColor" stroke-width="1.5"/>`;
    for (let m = rg.min; m <= rg.max + 1e-9; m += rg.paso) {
      const esN = Math.abs(m / rg.numero - Math.round(m / rg.numero)) < 1e-9;
      s += `<line x1="${n(X(m))}" y1="${EJE}" x2="${n(X(m))}" y2="${EJE + (esN ? 7 : 4)}" stroke="currentColor" stroke-width="1"/>`;
      if (esN) rot.push(caja(X(m), EJE + 21, fmt(m), { ancla: 'middle', tipo: 'numero' }));
    }
    rot.push(caja(W - M, EJE + 21, 'm', { ancla: 'end', peso: 700, tipo: 'numero' }));
    // dos carriles: el mototaxi en el de arriba y la combi en el de abajo (así no se tapan cuando van juntos)
    // cada uno con su nombre al lado, en su carril (a la derecha; a la izquierda si no cabe): no se confunden aunque vayan juntos
    const nombreV = (cx, medio, y, texto) => {
      const der = caja(cx + medio + 6, y, texto, { tam: 13 });
      rot.push(der.x1 <= W - M - 1e-9 && der.x0 >= cx + medio + 6 - 1e-9 ? der : caja(cx - medio - 6, y, texto, { tam: 13, ancla: 'end' }));
    };
    if (d.mototaxi) { const cx = X(d.mototaxi.x); s += mototaxi(cx, 56); obj.push({ nombre: 'mototaxi', x0: cx - 17, x1: cx + 17, y0: 31, y1: 56 }); if (d.nombres !== false) nombreV(cx, 17, 50, 'mototaxi'); }
    if (d.combi) { const cx = X(d.combi.x); s += combi(cx, 84); obj.push({ nombre: 'combi', x0: cx - 20, x1: cx + 20, y0: 62, y1: 84 }); if (d.nombres !== false) nombreV(cx, 20, 79, 'combi'); }
    if (!d.grafica) return { H: 128, s, rotulos: rot, objetos: obj, lineas: [], planos: [] };
    const R = { x0: 48, x1: 300, y0: 150, y1: 150 + (d.grafica.alto || 120) };
    const p = plano(d.grafica, R, e.corte || 0);
    return { H: R.y1 + 44, s: s + p.s, rotulos: rot.concat(p.rotulos), objetos: obj, lineas: p.lineas, planos: [p] };
  }
  function vCombi(d) {
    const Y0 = 52, Y1 = 98, cx = 130;
    let s = `<g data-prueba="si" class="fis-avenida"><rect x="6" y="${Y0}" width="${W - 12}" height="${Y1 - Y0}" rx="6" fill="currentColor" fill-opacity="0.08"/>`
      + `<line x1="10" y1="${(Y0 + Y1) / 2}" x2="${W - 10}" y2="${(Y0 + Y1) / 2}" stroke="currentColor" stroke-width="1.5" stroke-dasharray="8 8" stroke-opacity="0.35"/></g>`;
    const rot = [];
    if (d.lugar) {
      s += `<g class="kit-objeto" data-objeto="lugar" data-prueba="si"><line x1="${cx}" y1="${Y0}" x2="${cx}" y2="22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><rect x="${cx - 6}" y="14" width="12" height="12" rx="2" fill="var(--card)" stroke="currentColor" stroke-width="2"/></g>`;
      rot.push(caja(cx - 10, 26, d.lugar, { ancla: 'end' }));
    }
    const vs = d.v && d.v.sentido < 0 ? -1 : 1;
    s += combi(cx, 80, vs < 0);
    if (d.v) { const x2 = cx + vs * 70; s += T.flecha(cx, 112, x2, 112, { color: 'o', grosor: 3 }); rot.push(caja(x2 + vs * 8, 117, d.v.texto, { ancla: vs > 0 ? 'start' : 'end', peso: 700, color: 'o' })); }
    if (d.a) { const as = d.a.sentido < 0 ? -1 : 1, x1 = cx + as * 6, x2 = cx + as * 36; s += flechaA(x1, 44, x2, 44, 'var(--c-h)'); rot.push(caja(x2 + as * 8, 49, d.a.texto, { ancla: as > 0 ? 'start' : 'end', peso: 700, color: 'h' })); }
    return { H: 132, s, rotulos: rot, objetos: [{ nombre: 'combi', x0: cx - 20, x1: cx + 20, y0: 58, y1: 80 }], lineas: [] };
  }
  // La regla: 30 cm, 4 px por cm; tus dedos en y = 160; arriba, la mano de tu compañero.
    // Una mano vista de costado (dibujo de prueba): la palma hacia `lado` (−1 izquierda, +1 derecha), el pulgar adelante de
  // la regla y el índice detrás (se dibuja antes que la regla, que lo tapa). abre: cuánto se separan las yemas.
  function manoAtras(y, lado, abre) {
    const far = lado < 0 ? RX1 + 8 + abre : RX0 - 8 - abre, palma = lado < 0 ? RX0 - 20 - abre : RX1 + 20 + abre;
    return `<path d="M${n(palma)} ${n(y - 3)}L${n(far)} ${n(y - 3)}" stroke="currentColor" stroke-width="12" stroke-linecap="round" stroke-opacity="0.9"/>`
      + `<path d="M${n(palma)} ${n(y - 3)}L${n(far)} ${n(y - 3)}" stroke="var(--card)" stroke-width="8" stroke-linecap="round"/>`;
  }
  function manoAdelante(y, lado, abre) {
    const cerca = lado < 0 ? RX0 - 7 - abre : RX1 + 7 + abre, x0 = lado < 0 ? cerca - 56 : cerca + 6, w = 50;
    return `<rect x="${n(x0)}" y="${n(y - 15)}" width="${w}" height="30" rx="13" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`
      + `<ellipse cx="${n(cerca)}" cy="${n(y + 3)}" rx="7" ry="10" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`;
  }
  // La regla: 30 cm, 4 px por cm; tus dedos en y = 160; arriba, la mano de tu compañero.
  const RK = 4, DEDOS = 160, RX0 = 140, RX1 = 176, HR = 300, RASTRO = RX1 + 34;
  function vRegla(d) {
    const cae = Math.max(0, d.cae || 0), top = DEDOS - 30 * RK + cae * RK, bot = DEDOS + cae * RK;
    const y0 = Math.max(top, 2), y1 = Math.min(bot, HR - 2), rot = [];
    const esc = !!d.escapo, abre = d.cerrada && !esc ? 0 : esc ? -10 : 12, ys = DEDOS - 30 * RK + 10, sep = d.soltada ? 12 : 0;
    let s = '';
    // rastros: dónde estaba la punta de abajo (el 0) en cada instante, a la derecha
    const marcas = (d.marcas || []).map(m => ({ y: DEDOS + m.cm * RK, texto: m.texto }));
    for (const m of marcas) if (m.y < HR - 4) s += `<line x1="${RASTRO}" y1="${n(m.y)}" x2="${RASTRO + 14}" y2="${n(m.y)}" stroke="currentColor" stroke-opacity="0.6" stroke-width="2" stroke-linecap="round"/>`;
    const cajas = marcas.filter(m => m.y < HR - 8).map(m => caja(RASTRO + 20, m.y + 5, m.texto, { color: 'i' }));
    const quedan = [];
    for (let i = cajas.length - 1; i >= 0; i--) if (quedan.every(q => !choca(q, cajas[i]))) quedan.push(cajas[i]);
    rot.push(...quedan);
    // los índices van detrás de la regla
    s += `<g class="kit-objeto" data-objeto="mano" data-prueba="si">${manoAtras(ys, 1, sep)}</g>`;
    s += `<g class="kit-objeto" data-objeto="dedos" data-prueba="si">${manoAtras(DEDOS, -1, abre)}</g>`;
    if (y1 > y0) {
      s += `<g class="kit-objeto" data-objeto="regla" data-prueba="si"><rect x="${RX0}" y="${n(y0)}" width="${RX1 - RX0}" height="${n(y1 - y0)}" rx="2" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`;
      for (let c = 0; c <= 30; c++) {
        const y = bot - c * RK;
        if (y < y0 + 1 || y > y1 - 1) continue;
        s += `<line x1="${n(RX1 - (c % 5 ? 5 : 10))}" y1="${n(y)}" x2="${RX1}" y2="${n(y)}" stroke="currentColor" stroke-width="1"/>`;
      }
      s += '</g>';
      // números cada 10 cm (las rayas largas, cada 5): el 0 abajo, el 30 arriba, dentro de la regla
      for (let c = 0; c <= 30; c += 10) {
        const y = bot - c * RK + (c === 0 ? -2 : c === 30 ? 13 : 5);
        if (y - 11 < y0 || y + 2 > y1 || y > HR - 6) continue;
        rot.push(caja(RX0 + 4, y, String(c), { tipo: 'numero', tam: 14 }));
      }
    }
    // los pulgares y las palmas, adelante: arriba tu compañero (desde la derecha), abajo tú (desde la izquierda)
    s += `<g class="kit-objeto" data-objeto="mano" data-prueba="si">${manoAdelante(ys, 1, sep)}</g>`;
    s += `<g class="kit-objeto" data-objeto="dedos" data-prueba="si">${manoAdelante(DEDOS, -1, abre)}</g>`;
    // de quién es cada mano
    rot.push(caja(RX1 + 13 + sep, ys - 21, 'tu compañero'), caja(RX0 - 63 - Math.max(0, abre), DEDOS - 21, 'tus dedos'));
    if (d.atrapa) rot.push(caja(RX0 - 70, DEDOS + 36, d.atrapa, { peso: 700, color: 'f' }));
    return { H: HR, s, rotulos: rot, objetos: [{ nombre: 'dedos', x0: RX0 - 7 - Math.max(0, abre) - 56, x1: RX1 + 8 + Math.max(0, abre), y0: DEDOS - 15, y1: DEDOS + 15 },
      { nombre: 'mano', x0: RX0 - 8 - sep, x1: RX1 + 13 + sep + 50, y0: ys - 15, y1: ys + 15 }], lineas: [] };
  }
  // El pabellón: la regla de alturas a la izquierda, el edificio y la pelota (o dos) en el patio.
  const SUELO = 250, TECHO = 34, HP = 280, COL = [208, 262];
  function vPabellon(d, e = {}) {
    const alto = d.alto > 0 ? d.alto : 20, Y = m => SUELO - (SUELO - TECHO) * m / alto, rot = [], obj = [];
    let s = `<line x1="8" y1="${SUELO}" x2="${W - 8}" y2="${SUELO}" stroke="currentColor" stroke-width="2"/>`;
    for (let k = 0; k < 15; k++) s += `<line x1="${12 + k * 21}" y1="${SUELO + 2}" x2="${4 + k * 21}" y2="${SUELO + 10}" stroke="currentColor" stroke-width="1" stroke-opacity="0.4"/>`;
    // regla de alturas
    const paso = d.paso || (alto > 10 ? 1 : 0.5), num = d.numero || (alto > 10 ? 5 : 1);
    let r = `<line x1="40" y1="${SUELO}" x2="40" y2="${TECHO}" stroke="currentColor" stroke-width="2"/>`;
    for (let m = 0; m <= alto + 1e-9; m = Math.round((m + paso) * 1e6) / 1e6) {
      const esN = Math.abs(m / num - Math.round(m / num)) < 1e-9;
      r += `<line x1="${esN ? 32 : 35}" y1="${n(Y(m))}" x2="40" y2="${n(Y(m))}" stroke="currentColor" stroke-width="1"/>`;
      if (esN) rot.push(caja(28, Y(m) + 5, fmt(m), { ancla: 'end', tipo: 'numero' }));
    }
    rot.push(caja(46, TECHO - 12, 'altura (m)', { peso: 700, color: 'f', tipo: 'nombre' }));
    // regla: false, cuando el problema no mide alturas desde el patio (el 0 está en otro lado): solo la cota que se da
    if (d.regla !== false) s += `<g class="kit-regla">${r}</g>`;
    else rot.splice(0, rot.length);
    if (d.cota) {
      // x: dónde va (por defecto, junto a la regla de alturas); flecha: con punta en «a» (lo que cae, hacia abajo), y el
      // rótulo a su izquierda, a media altura.
      const ya = Y(d.cota.de), yb = Y(d.cota.a), cx = d.cota.x || 28;
      if (d.cota.flecha) {
        s += `<path d="M${cx - 6} ${n(ya)}H${cx + 6}" stroke="var(--c-f)" stroke-width="2" stroke-linecap="round" fill="none"/>${T.flecha(cx, ya, cx, yb, { color: 'f', grosor: 2.5 })}`;
        rot.push(caja(cx - 6, (ya + yb) / 2 + 5, d.cota.texto, { peso: 700, color: 'f', ancla: 'end' }));
      } else {
        s += `<path d="M${cx - 6} ${n(ya)}H${cx + 6}M${cx} ${n(ya)}V${n(yb)}M${cx - 6} ${n(yb)}H${cx + 6}" stroke="var(--c-f)" stroke-width="2" stroke-linecap="round" fill="none"/>`;
        rot.push(caja(cx - 8, Math.min(ya, yb) - 10, d.cota.texto, { peso: 700, color: 'f', ancla: 'start' }));
      }
    }
    // el pabellón del colegio (dibujo de prueba)
    const ed = d.edificio || { techo: 5, pisos: 1 }, yt = Y(ed.techo), pisos = ed.pisos || 1, X0 = 56, X1 = 164;
    let b = `<rect x="${X0}" y="${n(yt)}" width="${X1 - X0}" height="${n(SUELO - yt)}" fill="currentColor" fill-opacity="0.06" stroke="currentColor" stroke-width="2"/>`
      + `<line x1="${X0 - 4}" y1="${n(yt)}" x2="${X1 + 4}" y2="${n(yt)}" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`;
    const hp = (SUELO - yt) / pisos, hpm = ed.techo / pisos;
    // Con `ventana` (en m), el alféizar de cada piso va a esa misma altura sobre su piso: la rayita de la ventana queda
    // justo bajo la ventana dibujada (lector en frío, 18 nov: la rayita a 3,2 m y la ventana dibujada a unos 5 m).
    const alfeizar = ed.ventana !== undefined ? ed.ventana - Math.floor(ed.ventana / hpm + 1e-9) * hpm : null;
    for (let k = 0; k < pisos; k++) {
      const yb = SUELO - k * hp;
      if (k) b += `<line x1="${X0}" y1="${n(yb)}" x2="${X1}" y2="${n(yb)}" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.6"/>`;
      const wh = Math.min(16, hp * 0.4), wy = alfeizar !== null ? Y(k * hpm + alfeizar) - wh : yb - hp * 0.62 - wh / 2;
      for (const wx of [X0 + 12, X0 + 44, X0 + 76]) b += `<rect x="${wx}" y="${n(wy)}" width="20" height="${n(wh)}" rx="1.5" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="1.2"/>`;
    }
    s += `<g class="kit-objeto" data-objeto="pabellon" data-prueba="si">${b}</g>`;
    obj.push({ nombre: 'pabellon', x0: X0 - 4, x1: X1 + 4, y0: yt - 2, y1: SUELO });
    if (ed.ventana !== undefined) s += `<line x1="${X1 - 22}" y1="${n(Y(ed.ventana))}" x2="${X1 + 6}" y2="${n(Y(ed.ventana))}" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`;
    // pelotas
    (d.pelotas || []).forEach((p0, k) => {
      // pasos (para «Mira»): la altura en cada paso; con estado.corte = k, la pelota va en pasos[k] y deja las anteriores
      let p = p0;
      if (Array.isArray(p0.pasos) && p0.pasos.length) {
        const j = lim(Math.round(e.corte || 0), 0, p0.pasos.length - 1);
        p = Object.assign({}, p0, { y: p0.pasos[j], marcas: p0.pasos.slice(0, j), v: Array.isArray(p0.pasosV) ? p0.pasosV[j] : p0.v });
      }
      const cx = COL[k] || COL[0], rr = p.grande ? 10 : p.chica ? 5 : 8, cy = Y(p.y) - rr;
      for (const m of p.marcas || []) s += `<circle cx="${cx}" cy="${n(Y(m) - rr)}" r="${rr}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.32"/>`;
      s += `<g class="kit-objeto" data-objeto="pelota" data-prueba="si"><circle cx="${cx}" cy="${n(cy)}" r="${rr}" fill="var(--card)" stroke="currentColor" stroke-width="2.5"/>${p.grande || p.chica ? '' : `<path d="M${cx - rr * 0.7} ${n(cy - rr * 0.3)}Q${cx} ${n(cy + rr * 0.4)} ${cx + rr * 0.7} ${n(cy - rr * 0.3)}" fill="none" stroke="currentColor" stroke-width="1.2"/>`}</g>`;
      obj.push({ nombre: 'pelota', x0: cx - rr, x1: cx + rr, y0: cy - rr, y1: cy + rr });
      if (p.v && p.flecha !== false) {
        const L = Math.min(84, Math.abs(p.v) * 3.2), dir = p.v > 0 ? -1 : 1, y1 = cy + dir * (rr + 2), y2 = y1 + dir * L;
        if (L >= 4) {
          s += T.flecha(cx + 14, y1, cx + 14, y2, { color: 'o', grosor: 3 });
          const txt = p.texto === undefined ? `${fmt(Math.abs(p.v))} m/s` : p.texto;
          if (txt) rot.push(caja(cx + 22, (y1 + y2) / 2 + 5, txt, { peso: 700, color: 'o' }));
        }
      }
      if (d.g) {
        const y1 = cy - 12, y2 = cy + 22;
        s += flechaA(cx - 18, y1, cx - 18, y2, 'var(--c-h)');
        if (k === 0 || d.g.todas) rot.push(caja(cx - 26, (y1 + y2) / 2 + 5, d.g.texto || 'g', { peso: 700, color: 'h', ancla: 'end' }));
      }
      if (p.rotulo) rot.push(caja(cx, SUELO + 22, p.rotulo, { ancla: 'middle' }));
    });
    return { H: HP, s, rotulos: rot, objetos: obj, lineas: [] };
  }

  const VISTAS = { grafica: vGrafica, tres: vTres, pista: vPista, alcance: vAlcance, combi: vCombi, regla: vRegla, pabellon: vPabellon };
  function geometria(datos, estado = {}) {
    const d = datos || {}, f = VISTAS[d.vista] || vGrafica;
    const g = f(d, estado || {});
    return Object.assign({ W, M }, g);
  }
  function dibujar(datos, estado = {}) {
    const g = geometria(datos, estado);
    return T.svg(W, g.H, `<g data-prueba="si">${g.s}${g.rotulos.map(pinta).join('')}</g>`, { alt: alt(datos) });
  }
  function alt(datos) {
    const d = datos || {};
    if (d.alt) return d.alt;
    const nom = e => (e && e.nombre ? e.nombre : 'y');
    switch (d.vista) {
      case 'tres': return 'Tres gráficas del mismo movimiento, una sobre otra, con el mismo eje de tiempo: x–t, v–t y a–t.';
      case 'pista': return `Un atleta en la pista de ${fmt(d.largo || 100)} m, con su gráfica de velocidad contra tiempo debajo.`;
      case 'alcance': return 'La combi en el paradero y el mototaxi en la avenida, con sus gráficas de posición contra tiempo debajo.';
      case 'combi': return `Una combi en la avenida${d.lugar ? ` junto al ${String(d.lugar).toLowerCase()}` : ''}, con la flecha de su velocidad y la de su aceleración.`;
      case 'regla': return `Una regla de 30 cm entre tus dedos, que tu compañero suelta. ${d.cerrada ? `La atrapas después de que cayó ${fmt(d.cae || 0)} cm.` : 'Todavía no cierras los dedos.'}`;
      case 'pabellon': return 'El pabellón del colegio con una regla de alturas en metros y una pelota en el patio.';
      default: return `Gráfica de ${nom(d.y)} contra ${nom(d.x)}.`;
    }
  }

  return { id: 'fis-mruv', dibujar, alt, geometria, constantes: { W, M, DEDOS, RK, SUELO, TECHO, COL } };
});
