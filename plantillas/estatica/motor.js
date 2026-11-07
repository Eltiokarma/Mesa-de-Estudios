/*
 * Motor de estática: palancas, barras con peso propio, centro de gravedad, nudos con dos cuerdas, poleas y roce estático.
 *
 * Aquí vive toda la física de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorEstatica) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Unidades SI, g = 10 m/s² y ángulos en grados. Los ángulos de academia se toman con los valores del triángulo
 * notable, como en el examen: sen 37° = 3/5, cos 37° = 4/5 (y 53°, 16° y 74°); 30°, 45°, 60° y 90° son exactos
 * de por sí. Cualquier otro ángulo usa el seno de verdad. Con { exacto: true } también 37°, 53°, 16° y 74° usan el
 * seno de verdad. El seno de una suma de ángulos se arma con sen(a + b) = sen a·cos b + cos a·sen b, para que
 * 53° + 53° dé 24/25 y no el seno de verdad de 106°. Los suplementos de los ángulos notables (143°, 127°, 164°,
 * 106°, 150°, 135°, 120°) también se toman como notables, como en la academia: sen 143° = sen 37° = 3/5 y
 * cos 143° = −cos 37° = −4/5.
 *
 * Convenciones. La barra va de su extremo A (x = 0, a la izquierda) a su extremo B (x = L). Las cargas son
 * fuerzas verticales hacia abajo (F positiva; negativa si tira hacia arriba); los apoyos y las cuerdas verticales
 * empujan o tiran hacia arriba. Los momentos (τ) son positivos en sentido antihorario y negativos en sentido
 * horario. Con 'inclinacion' φ la barra gira φ grados alrededor de su primer apoyo, subiendo el extremo B:
 * las fuerzas siguen verticales y cada brazo se acorta por cos φ.
 *
 * Funciones:
 *   trig(angulo, exacto)                  → { sen, cos }
 *   senSuma(a, b, exacto)                 → sen(a + b) con los valores notables
 *   barra({ L, m | P | tramos, cg, cargas: [{ x, F | m | '?' , nombre }], apoyos: [{ x, nombre, tipo }],
 *           inclinacion })                barra rígida con peso propio (homogénea, o por tramos de distinta
 *                                         densidad) y cargas puntuales. Con un apoyo y una carga '?', halla la
 *                                         carga y la reacción; con dos apoyos (o cuerdas), las dos reacciones;
 *                                         con un apoyo y sin incógnita, dice si gira y hacia dónde.
 *                                         Trae momentos(xo): el momento de cada fuerza y el neto respecto al punto
 *                                         de la barra que se elija (si hay equilibrio, el neto es cero en todos).
 *   momentoNeto(o, xo)                    barra(o).momentos(xo), para casos.json.
 *   momentos2D(fuerzas, punto)            momento neto y resultante de fuerzas en el plano [{ x, y, Fx, Fy }].
 *   momentoFuerza({ F, d, angulo })       momento de una fuerza que forma 'angulo' con la barra, a d del eje:
 *                                         τ = F·d·sen θ; el brazo es la distancia perpendicular d·sen θ, y 'pie'
 *                                         es el punto de la línea de la fuerza donde llega el brazo.
 *   centroGravedad(masas)                 centro de gravedad de masas puntuales [{ m, x, y }].
 *   figuraCompuesta(figuras)              centro de gravedad de una lámina armada con rectángulos, triángulos y
 *                                         círculos; los que llevan hueco: true se restan.
 *   bate({ tramos } | { L, m, razon }, corte)  objeto alargado que no es parejo: por tramos [{ largo, m }] desde el
 *                                         mango, o cónico (densidad que crece en línea recta; razon = grueso/delgado).
 *                                         Halla su punto de equilibrio, lo corta ahí (o en 'corte') y da la masa,
 *                                         el largo y el centro de cada parte. 'tau' es el momento del peso de cada
 *                                         parte respecto al corte, con signo (antihorario positivo): el del mango
 *                                         (a la izquierda) sale positivo y el de la punta, negativo.
 *   nudo({ m | P, a1, a2 })               bloque colgado de un nudo con dos cuerdas que forman a1 (la de la
 *                                         izquierda) y a2 (la de la derecha) con el techo. Tensiones por
 *                                         componentes y por el teorema de Lamy; geometria(h) da dónde se amarran.
 *   polea({ m1, m2 })                     polea fija ideal con un cuerpo a cada lado: en equilibrio solo si pesan
 *                                         igual, a cualquier altura; la tensión es la misma en toda la cuerda.
 *   poleaFija({ m })                      fuerza para sostener un cuerpo con una polea fija: su peso entero.
 *   planoRoce({ m, angulo, mus, F })      cuerpo quieto en un plano (angulo 0: el piso) con roce estático que se
 *                                         ajusta, hasta μs·N. F empuja hacia arriba del plano, paralela a él (en el
 *                                         piso, horizontal).
 *   par({ F, L, m })                      dos fuerzas iguales y opuestas, perpendiculares a una regla libre, en sus
 *                                         extremos: no hay fuerza neta, pero el momento F·L la hace girar.
 *
 * Cada resultado trae 'errores': los números que salen de las ideas erróneas del informe
 * (docs/investigacion/estatica-energia-ideas-erroneas.md, E1 a E11). La escena los usa para las opciones incorrectas.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorEstatica = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const G = 10;
  const EPS = 1e-9;
  const num = (x, que) => { const n = Number(x); if (x === null || x === '' || !Number.isFinite(n)) throw new Error(`${que} inválido: ${x}`); return n; };
  const pos = (x, que) => { const n = num(x, que); if (!(n > 0)) throw new Error(`${que} debe ser mayor que cero: ${x}`); return n; };
  const noNeg = (x, que) => { const n = num(x === undefined ? 0 : x, que); if (n < 0) throw new Error(`${que} no puede ser negativo: ${x}`); return n; };
  const limpio = x => (Math.abs(x) < EPS ? 0 : x);
  const gDe = o => (o.g === undefined ? G : pos(o.g, 'g'));

  // Triángulos notables de academia: [sen, cos].
  const R3 = Math.sqrt(3), R2 = Math.SQRT2;
  const NOTABLES = { 0: [0, 1], 16: [7 / 25, 24 / 25], 30: [1 / 2, R3 / 2], 37: [3 / 5, 4 / 5], 45: [R2 / 2, R2 / 2],
    53: [4 / 5, 3 / 5], 60: [R3 / 2, 1 / 2], 74: [24 / 25, 7 / 25], 90: [1, 0] };
  function trig(angulo, exacto) {
    const a = num(angulo, 'ángulo');
    const k = Math.abs(a), s = Math.sign(a) || 1;
    const fino = q => exacto && (q === 37 || q === 53 || q === 16 || q === 74);
    if (Object.prototype.hasOwnProperty.call(NOTABLES, k) && !fino(k)) {
      const [sen, cos] = NOTABLES[k];
      return { sen: s * sen, cos };
    }
    // Suplemento de un notable: mismo seno, coseno con el signo cambiado.
    if (k > 90 && k <= 180 && Object.prototype.hasOwnProperty.call(NOTABLES, 180 - k) && !fino(180 - k)) {
      const [sen, cos] = NOTABLES[180 - k];
      return { sen: s * sen, cos: -cos };
    }
    const r = a * Math.PI / 180;
    return { sen: Math.sin(r), cos: Math.cos(r) };
  }
  function senSuma(a, b, exacto) {
    const A = trig(a, exacto), B = trig(b, exacto);
    return limpio(A.sen * B.cos + A.cos * B.sen);
  }

  // ---------- Barra rígida ----------
  // Reparto de la masa de la barra: tramos homogéneos consecutivos desde A. Devuelve la masa entre 0 y x.
  function repartoBarra(o, g) {
    if (o.tramos) {
      if (!Array.isArray(o.tramos) || !o.tramos.length) throw new Error('tramos debe ser una lista con al menos un tramo');
      let x0 = 0;
      const t = o.tramos.map((q, i) => { const l = pos(q.largo, `largo del tramo ${i + 1}`), m = noNeg(q.m, `masa del tramo ${i + 1}`); const r = { x0, x1: x0 + l, m }; x0 += l; return r; });
      const L = x0;
      if (o.L !== undefined && Math.abs(num(o.L, 'largo') - L) > 1e-9) throw new Error('el largo no coincide con la suma de los tramos');
      const M = t.reduce((s, q) => s + q.m, 0);
      const xcg = M > 0 ? t.reduce((s, q) => s + q.m * (q.x0 + q.x1) / 2, 0) / M : L / 2;
      const masaHasta = x => t.reduce((s, q) => s + q.m * Math.max(0, Math.min(x, q.x1) - q.x0) / (q.x1 - q.x0), 0);
      return { L, M, P: M * g, xcg, masaHasta, tramos: t };
    }
    const L = pos(o.L, 'largo de la barra');
    const P = o.P !== undefined ? noNeg(o.P, 'peso de la barra') : noNeg(o.m, 'masa de la barra') * g;
    const xcg = o.cg !== undefined ? num(o.cg, 'centro de gravedad') : L / 2;
    if (xcg < -EPS || xcg > L + EPS) throw new Error('el centro de gravedad debe estar sobre la barra');
    // Con el centro de gravedad dado a mano no se sabe cómo se reparte la masa: se toma pareja (solo para los errores).
    return { L, M: P / g, P, xcg, masaHasta: x => (P / g) * Math.max(0, Math.min(x, L)) / L, tramos: null };
  }

  function barra(o) {
    const g = gDe(o), b = repartoBarra(o, g), L = b.L;
    const phi = num(o.inclinacion || 0, 'inclinación');
    if (Math.abs(phi) >= 90) throw new Error('la inclinación va de −90° a 90°');
    const cphi = trig(phi, o.exacto).cos;
    const enBarra = (x, que) => { const v = num(x, que); if (v < -EPS || v > L + EPS) throw new Error(`${que} debe estar sobre la barra (0 a ${L} m)`); return v; };
    const cargas = (o.cargas || []).map((c, i) => {
      const nombre = c.nombre || `carga ${i + 1}`, x = enBarra(c.x, `posición de ${nombre}`);
      if (c.F === '?' || c.m === '?') return { x, F: null, nombre, incognita: true };
      const F = c.F !== undefined ? num(c.F, `fuerza de ${nombre}`) : noNeg(c.m, `masa de ${nombre}`) * g;
      return { x, F, nombre, incognita: false };
    });
    const apoyos = (o.apoyos || []).map((a, i) => ({ x: enBarra(a.x, `posición del apoyo ${i + 1}`), nombre: a.nombre || `apoyo ${i + 1}`, tipo: a.tipo || 'apoyo' }));
    if (apoyos.length < 1 || apoyos.length > 2) throw new Error('la barra necesita uno o dos apoyos');
    const inc = cargas.filter(c => c.incognita);
    if (inc.length > 1) throw new Error('solo puede haber una carga desconocida');
    if (inc.length && apoyos.length === 2) throw new Error('con dos apoyos y una carga desconocida faltan datos');
    if (apoyos.length === 2 && Math.abs(apoyos[0].x - apoyos[1].x) < EPS) throw new Error('los dos apoyos están en el mismo punto');
    const s = apoyos[0].x;
    // Momento de las fuerzas conocidas (hacia abajo) respecto al primer apoyo: τ = −(x − s)·cos φ·F.
    const conocidas = [{ x: b.xcg, F: b.P }].concat(cargas.filter(c => !c.incognita));
    const tauConocidas = conocidas.reduce((t, c) => t - (c.x - s) * cphi * c.F, 0);
    const sumaConocidas = conocidas.reduce((t, c) => t + c.F, 0);
    let incognita = null, reacciones, equilibrio = true, gira = null;
    if (inc.length) {
      const u = inc[0];
      if (Math.abs(u.x - s) < EPS) throw new Error('una carga sobre el mismo apoyo no hace girar la barra: no se puede hallar');
      // −(xu − s)·cos φ·W + τconocidas = 0
      incognita = limpio(tauConocidas / ((u.x - s) * cphi));
      u.F = incognita;
      reacciones = [{ x: s, nombre: apoyos[0].nombre, tipo: apoyos[0].tipo, R: limpio(sumaConocidas + incognita) }];
    } else if (apoyos.length === 2) {
      const s2 = apoyos[1].x;
      // Momentos respecto al apoyo 1: R2·(s2 − s)·cos φ + τconocidas = 0
      const R2v = limpio(-tauConocidas / ((s2 - s) * cphi));
      reacciones = [{ x: s, nombre: apoyos[0].nombre, tipo: apoyos[0].tipo, R: limpio(sumaConocidas - R2v) },
        { x: s2, nombre: apoyos[1].nombre, tipo: apoyos[1].tipo, R: R2v }];
    } else {
      reacciones = [{ x: s, nombre: apoyos[0].nombre, tipo: apoyos[0].tipo, R: limpio(sumaConocidas) }];
      const t = limpio(tauConocidas);
      equilibrio = Math.abs(t) < 1e-7 * Math.max(1, sumaConocidas * L);
      gira = equilibrio ? null : (t > 0 ? 'antihorario' : 'horario');
    }
    // Un apoyo solo empuja y una cuerda solo jala: si sale una reacción negativa, la barra se vuelca.
    const vuelca = reacciones.some(r => r.R < -EPS);
    if (vuelca) equilibrio = false;
    const todas = () => [{ nombre: 'peso de la barra', x: b.xcg, F: -b.P }]
      .concat(cargas.map(c => ({ nombre: c.nombre, x: c.x, F: -c.F })))
      .concat(reacciones.map(r => ({ nombre: r.nombre, x: r.x, F: r.R })));
    function momentos(xo) {
      const x0 = num(xo, 'punto');
      const lista = todas().map(f => ({ nombre: f.nombre, x: f.x, F: f.F, brazo: limpio(Math.abs(f.x - x0) * cphi), tau: limpio((f.x - x0) * cphi * f.F) }));
      return { lista, neto: limpio(lista.reduce((t, f) => t + f.tau, 0)) };
    }
    const r = { L, P: b.P, M: b.M, xcg: b.xcg, inclinacion: phi,
      cargas: cargas.map(c => ({ x: c.x, F: c.F, nombre: c.nombre, incognita: c.incognita })),
      reacciones, R: reacciones[0].R, R2: reacciones[1] ? reacciones[1].R : null, incognita, equilibrio, gira, vuelca,
      momentoApoyo: null, momentos, errores: {} };
    r.momentoApoyo = momentos(s).neto;
    if (inc.length) {
      const u = inc[0], lado = Math.sign(u.x - s);
      const otras = cargas.filter(c => !c.incognita);
      // E1: el mismo peso a cada lado del apoyo (la barra cuenta por lo que pesa cada pedazo, sin mirar distancias).
      const masaA = b.masaHasta(s) * g, masaB = b.P - masaA;
      const ladoDe = x => Math.sign(x - s);
      const pesoLado = sg => (sg < 0 ? masaA : masaB) + otras.filter(c => ladoDe(c.x) === sg).reduce((t, c) => t + c.F, 0);
      const pesoTotalOtras = otras.reduce((t, c) => t + c.F, 0);
      const extremo = b.xcg >= s ? L : 0;
      const tauSinBarra = otras.reduce((t, c) => t - (c.x - s) * c.F, 0);
      const tauExtremo = tauSinBarra - (extremo - s) * b.P;
      r.errores = {
        igualarPesosLados: limpio(pesoLado(-lado) - pesoLado(lado)),
        igualarPesoTotal: limpio(b.P + pesoTotalOtras),
        pesoEnExtremo: limpio(tauExtremo / (u.x - s)),
        sinPesoBarra: limpio(tauSinBarra / (u.x - s)),
        reaccionSinCarga: limpio(sumaConocidas),
        reaccionDiferencia: limpio(Math.abs(sumaConocidas - incognita)),
      };
    }
    return r;
  }
  const momentoNeto = (o, xo) => barra(o).momentos(xo);

  function momentos2D(fuerzas, punto) {
    const p = punto || { x: 0, y: 0 }, x0 = num(p.x || 0, 'x del punto'), y0 = num(p.y || 0, 'y del punto');
    let neto = 0, Rx = 0, Ry = 0;
    const lista = fuerzas.map(f => {
      const x = num(f.x, 'x'), y = num(f.y || 0, 'y'), Fx = num(f.Fx || 0, 'Fx'), Fy = num(f.Fy || 0, 'Fy');
      const tau = (x - x0) * Fy - (y - y0) * Fx; neto += tau; Rx += Fx; Ry += Fy; return limpio(tau);
    });
    return { lista, neto: limpio(neto), Rx: limpio(Rx), Ry: limpio(Ry) };
  }

  function momentoFuerza(o) {
    const F = noNeg(o.F, 'fuerza'), d = noNeg(o.d, 'distancia al eje'), ang = num(o.angulo, 'ángulo');
    if (ang < 0 || ang > 180) throw new Error('el ángulo con la barra va de 0° a 180°');
    const { sen, cos } = ang > 90 ? (() => { const t = trig(180 - ang, o.exacto); return { sen: t.sen, cos: -t.cos }; })() : trig(ang, o.exacto);
    const brazo = limpio(d * sen);
    // Pie del brazo: el punto de la línea de la fuerza más cercano al eje (eje en el origen, barra sobre +x,
    // fuerza aplicada en (d, 0) con dirección (cos θ, sen θ)). Queda a la distancia d·sen θ del eje.
    const pie = { x: limpio(d * sen * sen), y: limpio(-d * sen * cos) };
    return { tau: limpio(F * brazo), brazo, Fperp: limpio(F * sen), Fpar: limpio(F * cos), sen, cos, pie,
      errores: { sinSeno: F * d, conCoseno: limpio(F * d * Math.abs(cos)), sinDistancia: limpio(F * sen) } };
  }

  // ---------- Centro de gravedad ----------
  function centroGravedad(masas) {
    if (!Array.isArray(masas) || !masas.length) throw new Error('hace falta al menos una masa');
    let M = 0, sx = 0, sy = 0;
    const ps = masas.map((q, i) => { const m = noNeg(q.m, `masa ${i + 1}`), x = num(q.x || 0, `x de la masa ${i + 1}`), y = num(q.y || 0, `y de la masa ${i + 1}`); M += m; sx += m * x; sy += m * y; return { x, y }; });
    if (!(M > 0)) throw new Error('la masa total debe ser mayor que cero');
    return { M, x: limpio(sx / M), y: limpio(sy / M),
      errores: { promedioSimple: { x: limpio(ps.reduce((s, p) => s + p.x, 0) / ps.length), y: limpio(ps.reduce((s, p) => s + p.y, 0) / ps.length) } } };
  }

  function parte(f, i) {
    const que = `figura ${i + 1}`;
    if (f.tipo === 'rect') {
      const w = pos(f.ancho, `ancho de la ${que}`), h = pos(f.alto, `alto de la ${que}`), x = num(f.x || 0, `x de la ${que}`), y = num(f.y || 0, `y de la ${que}`);
      return { area: w * h, x: x + w / 2, y: y + h / 2 };
    }
    if (f.tipo === 'triangulo') {
      if (!Array.isArray(f.puntos) || f.puntos.length !== 3) throw new Error(`la ${que} necesita tres vértices`);
      const [a, b, c] = f.puntos.map(p => [num(p[0], `vértice de la ${que}`), num(p[1], `vértice de la ${que}`)]);
      const area = Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1])) / 2;
      if (!(area > EPS)) throw new Error(`la ${que} no tiene área`);
      return { area, x: (a[0] + b[0] + c[0]) / 3, y: (a[1] + b[1] + c[1]) / 3 };
    }
    if (f.tipo === 'circulo') {
      const r = pos(f.r, `radio de la ${que}`);
      return { area: Math.PI * r * r, x: num(f.x || 0, `x de la ${que}`), y: num(f.y || 0, `y de la ${que}`) };
    }
    throw new Error(`tipo de figura desconocido: ${f.tipo}`);
  }
  function figuraCompuesta(figuras) {
    if (!Array.isArray(figuras) || !figuras.length) throw new Error('hace falta al menos una figura');
    const partes = figuras.map((f, i) => Object.assign(parte(f, i), { hueco: !!f.hueco }));
    const suma = (signoHueco) => {
      let A = 0, sx = 0, sy = 0;
      for (const p of partes) { const s = p.hueco ? signoHueco : 1; A += s * p.area; sx += s * p.area * p.x; sy += s * p.area * p.y; }
      return { A, x: sx / A, y: sy / A };
    };
    const bien = suma(-1);
    if (!(bien.A > EPS)) throw new Error('los huecos no pueden ser más grandes que la lámina');
    const mal = suma(1);
    return { area: limpio(bien.A), x: limpio(bien.x), y: limpio(bien.y), partes: partes.map(p => ({ area: p.area, x: p.x, y: p.y, hueco: p.hueco })),
      errores: { promedioSimple: { x: limpio(partes.reduce((s, p) => s + p.x, 0) / partes.length), y: limpio(partes.reduce((s, p) => s + p.y, 0) / partes.length) },
        huecoSumado: { x: limpio(mal.x), y: limpio(mal.y) } } };
  }

  // ---------- Bate (o escoba) cortado en su punto de equilibrio ----------
  function bate(o, corteDado) {
    let L, M, masaHasta, xcgDe;
    if (o.tramos) {
      const b = repartoBarra({ tramos: o.tramos }, G);
      L = b.L; M = b.M; masaHasta = b.masaHasta;
      // Centro de gravedad del pedazo entre u y v: por tramos.
      xcgDe = (u, v) => { let m = 0, mx = 0; for (const q of b.tramos) { const a = Math.max(u, q.x0), c = Math.min(v, q.x1); if (c > a) { const dm = q.m * (c - a) / (q.x1 - q.x0); m += dm; mx += dm * (a + c) / 2; } } return m > 0 ? mx / m : (u + v) / 2; };
    } else {
      L = pos(o.L, 'largo'); M = pos(o.m, 'masa');
      const razon = pos(o.razon === undefined ? 1 : o.razon, 'razón grueso/delgado');
      // Densidad λ(x) = λ0·(1 + k·x/L), con k = razón − 1 (crece del mango, x = 0, a la punta gruesa, x = L).
      const k = razon - 1, l0 = M / (L * (1 + k / 2));
      masaHasta = x => l0 * (x + k * x * x / (2 * L));
      const momentoHasta = x => l0 * (x * x / 2 + k * x * x * x / (3 * L));
      xcgDe = (u, v) => (momentoHasta(v) - momentoHasta(u)) / (masaHasta(v) - masaHasta(u));
    }
    const xcg = xcgDe(0, L);
    const c = corteDado === undefined ? xcg : num(corteDado, 'corte');
    if (!(c > EPS && c < L - EPS)) throw new Error('el corte debe estar dentro del objeto');
    const mI = masaHasta(c), mD = M - mI, xI = xcgDe(0, c), xD = xcgDe(c, L);
    const brazoIzq = c - xI, brazoDer = xD - c;
    const masMasa = Math.abs(mI - mD) < EPS ? 'iguales' : (mI > mD ? 'mango' : 'punta');
    return { L, M, P: M * G, xcg: limpio(xcg), corte: c,
      mango: { m: limpio(mI), P: limpio(mI * G), largo: c, xcg: limpio(xI), brazo: limpio(brazoIzq), tau: limpio(mI * G * brazoIzq) },
      punta: { m: limpio(mD), P: limpio(mD * G), largo: L - c, xcg: limpio(xD), brazo: limpio(brazoDer), tau: limpio(-mD * G * brazoDer) },
      masMasa, errores: { masasIguales: M / 2, centroEnLaMitad: L / 2 } };
  }

  // ---------- Nudo con dos cuerdas ----------
  function nudo(o) {
    const g = gDe(o);
    const P = o.P !== undefined ? pos(o.P, 'peso') : pos(o.m, 'masa') * g;
    const a1 = num(o.a1, 'ángulo de la cuerda 1'), a2 = num(o.a2, 'ángulo de la cuerda 2');
    for (const [a, q] of [[a1, 1], [a2, 2]]) if (!(a > 0 && a <= 90)) throw new Error(`el ángulo de la cuerda ${q} con el techo va de más de 0° a 90°`);
    const t1 = trig(a1, o.exacto), t2 = trig(a2, o.exacto);
    const s = senSuma(a1, a2, o.exacto);
    if (!(s > 1e-6)) throw new Error('con esos ángulos las cuerdas no pueden sostener el bloque');
    // Por componentes: horizontal T1·cos a1 = T2·cos a2; vertical T1·sen a1 + T2·sen a2 = P.
    const T1 = limpio(P * t2.cos / s), T2 = limpio(P * t1.cos / s);
    // Por Lamy: cada fuerza entre el seno del ángulo que forman las otras dos.
    const angulos = { opuestoT1: 90 + a2, opuestoT2: 90 + a1, opuestoP: 180 - a1 - a2 };
    const razon = P / s; // P / sen(180° − a1 − a2), y sen(180° − x) = sen x
    const lamy = { angulos, razon, T1: limpio(razon * senSuma(90, a2, o.exacto)), T2: limpio(razon * senSuma(90, a1, o.exacto)) };
    const comp = { T1x: limpio(-T1 * t1.cos), T1y: limpio(T1 * t1.sen), T2x: limpio(T2 * t2.cos), T2y: limpio(T2 * t2.sen) };
    // Dónde se amarran al techo si el nudo cuelga h metros debajo de él (el nudo en x = 0).
    const geometria = h => { const hh = pos(h, 'profundidad'); return { x1: -hh * t1.cos / t1.sen, x2: hh * t2.cos / t2.sen, l1: hh / t1.sen, l2: hh / t2.sen }; };
    return { P, T1, T2, suma: limpio(T1 + T2), masTensa: Math.abs(T1 - T2) < EPS ? 'iguales' : (T1 > T2 ? 'cuerda 1' : 'cuerda 2'),
      componentes: comp, lamy, geometria,
      errores: { mitadPeso: P / 2, invertidas: { T1: T2, T2: T1 },
        angulosConLaVertical: { T1: limpio(P * t2.sen / s), T2: limpio(P * t1.sen / s) },
        mitadPorSeno: { T1: limpio(P / 2 * t1.sen), T2: limpio(P / 2 * t2.sen) } } };
  }

  // ---------- Poleas ----------
  function polea(o) {
    const g = gDe(o), m1 = pos(o.m1, 'masa 1'), m2 = pos(o.m2, 'masa 2');
    const equilibrio = Math.abs(m1 - m2) < EPS;
    // Si no pesan igual, no hay equilibrio: se acelera como una máquina de Atwood.
    const T = equilibrio ? m1 * g : 2 * m1 * m2 * g / (m1 + m2);
    return { P1: m1 * g, P2: m2 * g, equilibrio, T, a: limpio((m1 - m2) * g / (m1 + m2)),
      tensionEn: () => T, // la misma en cualquier punto de la cuerda, a los dos lados de la polea
      errores: { mitadDeLaSuma: (m1 + m2) * g / 2 } };
  }
  function poleaFija(o) {
    const g = gDe(o), m = pos(o.m, 'masa');
    return { F: m * g, P: m * g, errores: { mitad: m * g / 2 } };
  }

  // ---------- Roce estático ----------
  function planoRoce(o) {
    const g = gDe(o), m = pos(o.m, 'masa'), ang = num(o.angulo || 0, 'ángulo');
    if (ang < 0 || ang >= 90) throw new Error('el ángulo del plano va de 0° a menos de 90°');
    const mus = noNeg(o.mus, 'μs'), F = noNeg(o.F, 'fuerza');
    const { sen, cos } = trig(ang, o.exacto);
    const P = m * g, Ppar = limpio(P * sen), N = limpio(P * cos), fsMax = limpio(mus * N);
    // Lo que el roce tiene que aguantar: positivo si el cuerpo tiende a bajar (o, en el piso, a irse hacia F).
    const D = limpio(Ppar - F);
    const quieto = Math.abs(D) <= fsMax + EPS;
    const roce = quieto ? Math.abs(D) : null;
    const sentido = !quieto || roce < EPS ? null : (ang === 0 ? 'contra F' : D > 0 ? 'hacia arriba del plano' : 'hacia abajo del plano');
    const tiende = Math.abs(D) < EPS ? null : (ang === 0 ? 'avanzar' : D > 0 ? 'bajar' : 'subir');
    return { P, Ppar, N, fsMax, roce, sentido, quieto, tiende, margen: quieto ? limpio(fsMax - Math.abs(D)) : null,
      Fmin: limpio(Math.max(0, Ppar - fsMax)), Fmax: limpio(Ppar + fsMax), anguloLimite: Math.atan(mus) * 180 / Math.PI,
      errores: { roceMaximo: fsMax, roceConPeso: mus * P, roceCero: 0, loQueFalta: limpio(fsMax - Math.abs(D)) } };
  }

  // ---------- Par de fuerzas ----------
  function par(o) {
    const F = noNeg(o.F, 'fuerza'), L = pos(o.L, 'largo'), m = o.m === undefined ? null : pos(o.m, 'masa');
    // En A (x = 0) la fuerza apunta hacia −y y en B (x = L) hacia +y: momento antihorario F·L respecto a cualquier punto.
    const fuerzas = [{ x: 0, y: 0, Fx: 0, Fy: -F }, { x: L, y: 0, Fx: 0, Fy: F }];
    const tau = F * L, I = m === null ? null : m * L * L / 12, alfa = I === null ? null : tau / I;
    return { resultante: 0, tau, I, alfa, aCentro: 0,
      momentoRespecto: (x, y) => momentos2D(fuerzas, { x, y }).neto,
      // Con las manos siempre perpendiculares a la regla, el momento no cambia: gira con α constante desde el reposo.
      angulo: t => (alfa === null ? null : alfa * num(t, 'tiempo') * num(t, 'tiempo') / 2),
      errores: { seCancelan: 0, unaSola: F * L / 2 } };
  }

  return { G, NOTABLES, trig, senSuma, barra, momentoNeto, momentos2D, momentoFuerza, centroGravedad, figuraCompuesta, bate,
    nudo, polea, poleaFija, planoRoce, par };
});
