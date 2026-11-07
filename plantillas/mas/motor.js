/*
 * Motor del movimiento armónico simple (MAS): bloque con resorte (horizontal y vertical), péndulo simple,
 * resortes en serie y en paralelo, y el péndulo dentro de un ascensor que acelera.
 *
 * Aquí vive toda la física de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorMAS) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Unidades SI (kg, m, s, N, J) y g = 10 m/s², salvo que se dé otro g.
 *
 * Ecuación del movimiento, como en las academias peruanas: x(t) = A·sen(ωt + φ), con la fase inicial φ en grados.
 *   v(t) = A·ω·cos(ωt + φ)   y   a(t) = −ω²·x(t).   ω = √(k/m) en el resorte y ω = √(g/L) en el péndulo.
 *   Soltar desde x = +A en reposo es φ = 90°; soltar desde x = −A es φ = 270°; pasar por x = 0 hacia +x es φ = 0°.
 *   Si la fase ωt + φ (en grados) cae justo en un ángulo de academia (16°, 37°, 53°, 74° o 30°, 45°, 60°, o en uno
 *   de ellos llevado a otro cuadrante), el seno y el coseno toman los valores del triángulo notable: sen 37° = 3/5,
 *   cos 37° = 4/5. Son pitagóricos, así que la energía se conserva igual. Con { exacto: true } se usa el seno de verdad.
 *
 * π. Por defecto, el de verdad. Con { pi2: true } se toma la convención de examen π² ≈ 10 (π ≈ √10) SOLO en el
 * período T y la frecuencia f que se informan: un péndulo de 1 m da T = 2 s. x(t), v(t) y a(t) siempre usan el π de
 * verdad (la fase en grados no cambia con la convención).
 *
 * Resorte vertical: x se mide desde la posición de equilibrio, positiva hacia arriba. En el equilibrio el resorte ya
 * está estirado deq = m·g/k; el estiramiento en cada instante es deq − x. El período es el mismo que en horizontal:
 * la gravedad solo corre el centro de la oscilación. La energía potencial Ep = ½·k·x² es la del sistema medida desde
 * el equilibrio (elástica más gravitatoria, salvo una constante); también se dan las dos por separado.
 *
 * Péndulo: L va del punto de suspensión al centro de la esfera (hilo + radio). Para ángulos pequeños,
 * T = 2π·√(L/g), sin la masa ni la amplitud. Se informa además el período con la corrección de amplitud grande
 * (serie T·(1 + θ²/16 + 11θ⁴/3072)) para mostrar cuán poco cambia con 10°. En la escena, la posición del péndulo es
 * el arco s = L·θ (en metros) y su energía, la del MAS: Ep = ½·m·ω²·s².
 *
 * Ascensor (o cualquier marco que acelera): ay es la aceleración del ascensor hacia arriba (negativa si acelera hacia
 * abajo) y ax la horizontal. La gravedad efectiva es gef = √((g + ay)² + ax²). El péndulo usa gef; el resorte no
 * cambia de período (solo se corre su equilibrio: deq = m·(g + ay)/k).
 *
 * Funciones:
 *   trigFase(grados, exacto)            → { sen, cos } con los valores de academia
 *   resorte({ m, k, A, phi, orientacion: 'horizontal' | 'vertical', g, ay, pi2, exacto } | { m, k, x0, v0, ... })
 *       ω, T, f, A, φ, vmax = A·ω, amax = A·ω², E = ½·k·A², Fmax = k·A, deq; x(t), v(t), a(t), estado(t) (con el
 *       punto del círculo de referencia), enPosicion(x) (energía y rapidez en una posición), puntos (centro y extremo).
 *       Con x0 y v0 (en lugar de A y phi) halla A = √(x0² + (v0/ω)²) y φ.
 *   pendulo({ L | hilo + radio, g, m, theta0, phi, ay, ax, pi2 })   T, ω, f, gef, amplitud en arco y en ángulo,
 *       vmax (por energía, exacta) y vmaxMAS = ω·L·θ0; estado(t).
 *   comparar(tipo, o1, o2)              tipo 'resorte' o 'pendulo': cuántas veces cambia T (y vmax, amax, E) del
 *                                       primero al segundo, con los errores típicos de proporcionalidad.
 *   resortes({ k: [k1, k2, ...], modo: 'serie' | 'paralelo', m, F })   constante equivalente, período con la masa m
 *                                       y, con una fuerza F, cuánto se estira cada resorte.
 *
 * Cada resultado trae 'errores': los números que salen de las ideas erróneas del informe
 * (docs/investigacion/momento-gravitacion-ondas-ideas-erroneas.md, O1 a O4, y los errores de cálculo de su tabla
 * «Lo que no tiene respaldo»). La escena los usa para las opciones incorrectas.
 * El motor no dibuja: la escena lee estado(t), enPosicion(x) y comparar(), y pinta lo que le dan.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorMAS = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const G = 10;
  const EPS = 1e-9;
  const RAIZ10 = Math.sqrt(10);
  const num = (x, que) => { const n = Number(x); if (x === null || x === '' || x === undefined || !Number.isFinite(n)) throw new Error(`${que} inválido: ${x}`); return n; };
  const pos = (x, que) => { const n = num(x, que); if (!(n > 0)) throw new Error(`${que} debe ser mayor que cero: ${x}`); return n; };
  const noNeg = (x, que) => { const n = num(x, que); if (n < 0) throw new Error(`${que} no puede ser negativo: ${x}`); return n; };
  const limpio = x => (Math.abs(x) < EPS ? 0 : x);
  const gDe = o => (o.g === undefined ? G : pos(o.g, 'g'));
  const piDe = o => (o && o.pi2 ? RAIZ10 : Math.PI);
  const rad = d => d * Math.PI / 180, grad = r => r * 180 / Math.PI;
  const mod360 = d => ((d % 360) + 360) % 360;

  // Triángulos notables de academia: [sen, cos] en el primer cuadrante.
  const R3 = Math.sqrt(3), R2 = Math.SQRT2;
  const NOTABLES = { 0: [0, 1], 16: [7 / 25, 24 / 25], 30: [1 / 2, R3 / 2], 37: [3 / 5, 4 / 5], 45: [R2 / 2, R2 / 2],
    53: [4 / 5, 3 / 5], 60: [R3 / 2, 1 / 2], 74: [24 / 25, 7 / 25], 90: [1, 0] };
  const FINOS = [16, 37, 53, 74];
  function trigFase(grados, exacto) {
    const k = mod360(num(grados, 'fase'));
    // Ángulo de referencia y signos por cuadrante.
    let r, ss, sc;
    if (k <= 90) { r = k; ss = 1; sc = 1; }
    else if (k <= 180) { r = 180 - k; ss = 1; sc = -1; }
    else if (k <= 270) { r = k - 180; ss = -1; sc = -1; }
    else { r = 360 - k; ss = -1; sc = 1; }
    const rr = Math.round(r);
    if (Math.abs(r - rr) < 1e-9 && Object.prototype.hasOwnProperty.call(NOTABLES, rr) && !(exacto && FINOS.includes(rr))) {
      const [s, c] = NOTABLES[rr];
      return { sen: limpio(ss * s), cos: limpio(sc * c) };
    }
    return { sen: limpio(Math.sin(rad(k))), cos: limpio(Math.cos(rad(k))) };
  }

  // Oscilación genérica x = A·sen(ωt + φ). Devuelve las funciones del movimiento y del círculo de referencia.
  function oscilacion(A, w, phi, exacto) {
    const fase = t => phi + grad(w * num(t, 'tiempo'));
    const sc = t => trigFase(fase(t), exacto);
    return {
      fase: t => mod360(fase(t)),
      x: t => limpio(A * sc(t).sen),
      v: t => limpio(A * w * sc(t).cos),
      a: t => limpio(-w * w * A * sc(t).sen),
      // Círculo de referencia: un punto P da vueltas en sentido antihorario con rapidez angular ω. Su sombra sobre el
      // eje horizontal es x. P = (A·sen θ, −A·cos θ) con θ = ωt + φ: con θ = 0 está abajo y se mueve hacia +x.
      circulo: t => { const q = sc(t); return { px: limpio(A * q.sen), py: limpio(-A * q.cos), angulo: mod360(fase(t)) }; },
    };
  }

  // ---------- Bloque y resorte ----------
  function resorte(o) {
    const m = pos(o.m, 'masa'), k = pos(o.k, 'constante k'), g = gDe(o), PI = piDe(o);
    const orientacion = o.orientacion === undefined ? 'horizontal' : o.orientacion;
    if (orientacion !== 'horizontal' && orientacion !== 'vertical') throw new Error(`orientación desconocida: ${o.orientacion}`);
    const w = Math.sqrt(k / m);
    let A, phi;
    if (o.x0 !== undefined || o.v0 !== undefined) {
      if (o.A !== undefined || o.phi !== undefined) throw new Error('da A y phi, o x0 y v0, pero no las dos cosas');
      const x0 = num(o.x0 === undefined ? 0 : o.x0, 'posición inicial'), v0 = num(o.v0 === undefined ? 0 : o.v0, 'velocidad inicial');
      A = Math.hypot(x0, v0 / w);
      // x0 = A·sen φ y v0 = A·ω·cos φ.
      phi = A < EPS ? 90 : mod360(grad(Math.atan2(x0 * w, v0)));
    } else {
      A = noNeg(o.A === undefined ? 0 : o.A, 'amplitud');
      phi = o.phi === undefined ? 90 : num(o.phi, 'fase inicial');
    }
    const ay = o.ay === undefined ? 0 : num(o.ay, 'aceleración del ascensor');
    const gef = g + ay;
    const deq = orientacion === 'vertical' ? limpio(m * gef / k) : 0;
    const os = oscilacion(A, w, phi, o.exacto);
    const T = 2 * PI / w, f = 1 / T;
    const vmax = A * w, amax = A * w * w, E = k * A * A / 2;
    const Ep = x => k * x * x / 2;
    const estado = t => {
      const x = os.x(t), v = os.v(t), a = os.a(t);
      const r = { t, fase: os.fase(t), x, v, a, F: limpio(-k * x), Ec: limpio(m * v * v / 2), Ep: limpio(Ep(x)), E, circulo: os.circulo(t) };
      if (orientacion === 'vertical') {
        r.estiramiento = limpio(deq - x);
        r.Epe = limpio(k * r.estiramiento * r.estiramiento / 2);
        r.Epg = limpio(m * gef * x);
      }
      return r;
    };
    const enPosicion = xq => {
      const x = num(xq, 'posición');
      if (Math.abs(x) > A + EPS) throw new Error(`la posición ${x} está fuera de la amplitud ${A}`);
      const ep = Ep(x), ec = limpio(E - ep), vv = w * Math.sqrt(Math.max(0, A * A - x * x));
      const fr = A > 0 ? Math.abs(x) / A : 0;
      return { x, v: limpio(vv), a: limpio(-w * w * x), F: limpio(-k * x), Ec: ec, Ep: limpio(ep), E, fEc: E > 0 ? limpio(ec / E) : 0, fEp: E > 0 ? limpio(ep / E) : 0,
        errores: {
          ecLineal: limpio(E * (1 - fr)),               // «a la mitad del camino, la mitad de la energía»
          fEcLineal: limpio(1 - fr),
          ecIntercambiada: limpio(ep),                   // confundir cuál es la cinética y cuál la potencial
          fEcIntercambiada: E > 0 ? limpio(ep / E) : 0,
          fEcComoV: limpio(Math.sqrt(Math.max(0, 1 - fr * fr))), // tomar la fracción de rapidez como fracción de energía
          vLineal: limpio(vmax * (1 - fr)) } };           // la rapidez baja en línea recta con la distancia
    };
    return { m, k, g, gef, orientacion, omega: w, T, f, A, phi: mod360(phi), vmax, amax, E, Fmax: k * A, deq,
      x: os.x, v: os.v, a: os.a, estado, enPosicion, circulo: os.circulo,
      puntos: { centro: { x: 0, v: vmax, a: 0, Ec: E, Ep: 0 }, extremo: { x: A, v: 0, a: amax, Ec: 0, Ep: E } },
      errores: {
        periodoInvertido: 2 * PI * Math.sqrt(k / m),   // T = 2π√(k/m)
        periodoSinDosPi: Math.sqrt(m / k),              // T = √(m/k)
        periodoSinRaiz: 2 * PI * m / k,                 // T ∝ m
        periodoConG: orientacion === 'vertical' ? 2 * PI * Math.sqrt(m / k) * Math.sqrt(G / gef) : null, // creer que g cambia T: T·√(10/gef)
        vmaxConOmega2: A * w * w,                       // vmax = Aω²
        amaxConOmega: A * w,                            // amax = Aω
        energiaSinMedio: k * A * A,                     // E = kA²
        energiaConMasa: m * A * A / 2,                  // E = ½mA² (la masa en vez de k)
        vmaxEnExtremo: vmax,                            // creer que en el extremo va a vmax
        aEnExtremo: 0,                                  // creer que en el extremo la aceleración es cero
        aEnCentro: amax,                                // creer que la aceleración es máxima en el centro
        amplitudConDeq: orientacion === 'vertical' ? A + deq : null, // medir la amplitud desde el largo natural
      } };
  }

  // ---------- Péndulo simple ----------
  function pendulo(o) {
    const g = gDe(o), PI = piDe(o);
    let L, hilo = null, radio = 0;
    if (o.hilo !== undefined) {
      if (o.L !== undefined) throw new Error('da L, o hilo y radio, pero no las dos cosas');
      hilo = pos(o.hilo, 'largo del hilo'); radio = noNeg(o.radio === undefined ? 0 : o.radio, 'radio de la esfera'); L = hilo + radio;
    } else L = pos(o.L, 'largo del péndulo');
    const m = o.m === undefined ? null : pos(o.m, 'masa');
    const theta0 = noNeg(o.theta0 === undefined ? 5 : o.theta0, 'amplitud angular');
    if (theta0 >= 90) throw new Error('la amplitud angular debe ser menor que 90°');
    const ay = o.ay === undefined ? 0 : num(o.ay, 'aceleración del ascensor');
    const ax = o.ax === undefined ? 0 : num(o.ax, 'aceleración horizontal');
    const gy = g + ay;
    if (gy <= EPS && Math.abs(ax) < EPS) throw new Error('con esa aceleración no hay gravedad efectiva: el péndulo no oscila');
    const gef = Math.hypot(gy, ax);
    // Inclinación de la vertical efectiva (hacia atrás de la aceleración horizontal).
    const inclinacion = grad(Math.atan2(ax, gy));
    const w = Math.sqrt(gef / L), T = 2 * PI / w, f = 1 / T;
    const th = rad(theta0), s0 = L * th;
    const phi = o.phi === undefined ? 90 : num(o.phi, 'fase inicial');
    const os = oscilacion(s0, w, phi, o.exacto);
    const vmax = Math.sqrt(2 * gef * L * (1 - Math.cos(th)));
    const Tgrande = T * (1 + th * th / 16 + 11 * Math.pow(th, 4) / 3072);
    const E = m === null ? null : m * w * w * s0 * s0 / 2;
    const estado = t => {
      const s = os.x(t), v = os.v(t), r = { t, fase: os.fase(t), s, x: s, theta: grad(s / L), v, a: os.a(t), circulo: os.circulo(t) };
      if (m !== null) { r.Ec = limpio(m * v * v / 2); r.Ep = limpio(m * w * w * s * s / 2); r.E = E; }
      return r;
    };
    const Tcon = (LL, gg) => 2 * PI * Math.sqrt(LL / gg);
    return { L, hilo, radio, m, g, gef, ay, ax, inclinacion, theta0, omega: w, T, f, amplitudArco: s0, amplitudHorizontal: L * Math.sin(th),
      vmax, vmaxMAS: w * s0, amax: w * w * s0, E, Tgrande, cambioPorAmplitud: Tgrande / T - 1,
      x: os.x, v: os.v, a: os.a, estado, circulo: os.circulo,
      errores: {
        soloHilo: hilo === null ? null : Tcon(hilo, gef),             // O4: L solo hasta donde acaba el hilo
        invertido: 2 * PI * Math.sqrt(gef / L),                        // T = 2π√(g/L)
        sinRaiz: 2 * PI * L / gef,                                     // T ∝ L
        conMasaComoResorte: m === null ? null : 2 * PI * Math.sqrt(m / gef), // pasar la masa a la fórmula
        gSinCambio: Tcon(L, g),                                        // ignorar la aceleración del ascensor
        gSignoContrario: g - ay > EPS ? Tcon(L, Math.hypot(g - ay, ax)) : null, // sumar cuando hay que restar (o al revés)
        gSumaHorizontal: Math.abs(ax) > EPS ? Tcon(L, gy + Math.abs(ax)) : null, // sumar g y a sin componer
      } };
  }

  // ---------- Comparar dos osciladores ----------
  function comparar(tipo, o1, o2) {
    if (tipo === 'resorte') {
      const a = resorte(o1), b = resorte(o2);
      const rm = b.m / a.m, rk = b.k / a.k, rA = a.A > 0 ? b.A / a.A : null, rT = b.T / a.T;
      return { T1: a.T, T2: b.T, razonT: rT, razonVmax: a.vmax > 0 ? b.vmax / a.vmax : null, razonAmax: a.amax > 0 ? b.amax / a.amax : null,
        razonE: a.E > 0 ? b.E / a.E : null, razonF: b.f / a.f,
        errores: {
          TproporcionalA: rA === null ? null : rT * rA,        // O1: más amplitud, más período
          TconRaizA: rA === null ? null : rT * Math.sqrt(rA),  // «un poco más»: crece, pero menos que A
          TinversoA: rA === null ? null : rT / rA,             // «el resorte tira más fuerte, va más rápido»
          TproporcionalM: rm / rk,                             // T ∝ m/k, sin la raíz
          Tinvertido: 1 / rT,                                  // T = 2π√(k/m)
          TsinM: 1 / Math.sqrt(rk),                            // «la masa no importa», como en el péndulo
        } };
    }
    if (tipo === 'pendulo') {
      const a = pendulo(o1), b = pendulo(o2);
      const rL = b.L / a.L, rg = b.gef / a.gef, rT = b.T / a.T;
      const rm = a.m !== null && b.m !== null ? b.m / a.m : null, rth = a.theta0 > 0 ? b.theta0 / a.theta0 : null;
      return { T1: a.T, T2: b.T, razonT: rT, razonF: b.f / a.f,
        errores: {
          pesadaMasLenta: rm === null ? null : rT * rm,             // O3: «a más peso tarda más»
          pesadaMasRapida: rm === null ? null : rT / rm,            // O3 y D5: «la pesada cae más rápido»
          formulaResorte: rm === null ? null : rT * Math.sqrt(rm),  // pasar T ∝ √m del resorte al péndulo
          TproporcionalL: rL / rg,                                  // T ∝ L, sin la raíz
          Tinvertido: 1 / rT,                                       // T = 2π√(g/L)
          TproporcionalAmplitud: rth === null ? null : rT * rth,    // O1 llevado al péndulo
          TsinL: 1 / Math.sqrt(rg),                                 // «el largo no importa»
        } };
    }
    throw new Error(`tipo desconocido: ${tipo}`);
  }

  // ---------- Resortes en serie y en paralelo ----------
  function resortes(o) {
    if (!Array.isArray(o.k) || o.k.length < 1) throw new Error('k debe ser una lista con al menos un resorte');
    const ks = o.k.map((x, i) => pos(x, `constante del resorte ${i + 1}`));
    const modo = o.modo;
    if (modo !== 'serie' && modo !== 'paralelo') throw new Error(`modo desconocido: ${modo}`);
    const suma = ks.reduce((s, x) => s + x, 0), inv = 1 / ks.reduce((s, x) => s + 1 / x, 0);
    const keq = modo === 'serie' ? inv : suma;
    const r = { modo, k: ks, keq };
    if (o.m !== undefined) {
      const m = pos(o.m, 'masa'), PI = piDe(o);
      r.T = 2 * PI * Math.sqrt(m / keq); r.omega = Math.sqrt(keq / m);
      r.Tcon = { unSolo: 2 * PI * Math.sqrt(m / ks[0]) };
    }
    if (o.F !== undefined) {
      const F = num(o.F, 'fuerza');
      r.estiramiento = F / keq;
      // En serie cada resorte aguanta la fuerza entera; en paralelo (estiramiento común) se reparten la fuerza.
      r.cada = modo === 'serie' ? ks.map(k => ({ F, x: F / k })) : ks.map(k => ({ F: k * F / keq, x: F / keq }));
    }
    const errK = modo === 'serie' ? suma : inv;
    r.errores = {
      alReves: errK,                                   // sumar las k en serie, o sumar las inversas en paralelo
      promedio: suma / ks.length,                      // «es como un resorte más»
      TalReves: o.m === undefined ? null : 2 * piDe(o) * Math.sqrt(pos(o.m, 'masa') / errK),
    };
    return r;
  }

  return { G, NOTABLES, trigFase, resorte, pendulo, comparar, resortes };
});
