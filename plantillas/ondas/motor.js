/*
 * Motor de ondas mecánicas y sonido: onda viajera, rapidez en una cuerda, pulsos, cambio de medio, superposición,
 * ondas estacionarias, tubos, nivel de intensidad sonora (decibeles) y Doppler básico.
 *
 * Aquí vive toda la física de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorOndas) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Unidades SI: m, s, Hz, N, kg/m, W/m². La onda viajera es y(x, t) = A·sen(kx − ωt + φ), con k = 2π/λ,
 * ω = 2πf y v = λ·f = ω/k; con el signo + (kx + ωt) va hacia −x. En una cuerda, v = √(T/μ): T es la TENSIÓN
 * (N) y μ la densidad lineal (kg/m). El periodo no lleva letra en esta plantilla (se dice «periodo», 1/f),
 * porque T ya nombra la tensión.
 *
 * Convenciones. La mano está en x = 0 y la onda avanza hacia +x. La mano empieza bajando: su posición es
 * h(t) = −A·sen(ωt) para t ≥ 0 y cero antes, así que la onda que sale es y = A·sen(kx − ωt) donde ya llegó
 * (x < v·t) y cero más allá. La cuerda estacionaria va de x = 0 a x = L, fija en los dos extremos.
 * Los decibeles: β = 10·log(I/I0), con I0 = 10⁻¹² W/m². 'betaAcademia' usa log 2 = 0,3 y log 3 = 0,48, como los
 * problemas de examen; 'beta' es el valor exacto. La intensidad de una fuente puntual baja con 1/r².
 *
 * Funciones:
 *   cuerda({ T, mu })                      rapidez de una onda en una cuerda tensa, v = √(T/μ).
 *   onda({ A, f, lambda | v | T y mu, phi }) onda viajera armónica: k, ω, v, λ, f, periodo, rapidez máxima de un
 *                                          punto (uMax = A·ω), y(x, t) y u(x, t) (velocidad vertical de un punto).
 *   funcionOnda({ A, k | kPi, w | wPi, signo }) lee y = A·sen(kx ∓ ωt): λ, f, v y el sentido. kPi y wPi son
 *                                          k y ω en múltiplos de π (4π → kPi: 4). signo '-' (kx − ωt) va hacia +x.
 *   mano({ A, f, v | T y mu })             la mano que agita: onda que sale de x = 0 a partir de t = 0 (frente en
 *                                          x = v·t). y(x, t), u(x, t), frente(t), llegada(d).
 *   pulso({ A, ancho, v | T y mu, x0 })    pulso de forma A·e^(−((x − x0 − v·t)/ancho)²) que viaja hacia +x
 *                                          (ancho negativo no vale; A con signo). llegada(d): cuándo llega
 *                                          su centro a x = d. La forma se conserva al avanzar (ON10).
 *   carrera({ L, base, cambios })          pulsos que corren L metros con la mano o el medio cambiados; da el tiempo
 *                                          de llegada de cada uno.
 *   cuerdaConMano({ v1, v2, d, h, kmax })  cuerda de rapidez v1 hasta x = d y v2 desde ahí (sin fin a la derecha),
 *                                          movida por la mano en x = 0 con la posición h(t) (una función; h(t) = 0 si
 *                                          t < 0). Suma exacta de reflexiones: la que vuelve a la mano rebota
 *                                          invertida (la mano manda: es un extremo fijo para lo que llega).
 *   cambioMedio({ f, v1, v2 | T, mu1, mu2 }) la onda pasa de un medio a otro: f se conserva; cambian v y λ.
 *                                          r y t son los factores de amplitud del pulso reflejado y transmitido
 *                                          (cuerdas con la misma tensión: r = (v2 − v1)/(v1 + v2), t = 2·v2/(v1 + v2)).
 *   dosPulsos({ A1, A2, ancho, v, x1, x2 }) dos pulsos que viajan uno hacia el otro (el 1 hacia +x desde x1,
 *                                          el 2 hacia −x desde x2). y1, y2, y = y1 + y2 (superposición), tCruce.
 *   estacionaria({ L, v | T y mu, n, A })  cuerda fija en los dos extremos, modo n: f = n·v/(2L), λ = 2L/n,
 *                                          nodos (n + 1, con los extremos) y vientres (n). y(x, t) = 2A·sen(kx)·sen(ωt)
 *                                          (A es la amplitud de cada onda que va y vuelve; el vientre llega a 2A).
 *   modos({ L, v | T y mu, hasta })        frecuencias de los modos 1 a 'hasta'.
 *   tubo({ L, v, tipo: 'abierto' | 'cerrado', n })  tubo sonoro: abierto f = n·v/(2L); cerrado f = n·v/(4L) con n impar.
 *   sonidoAire({ Tc })                     rapidez del sonido en el aire: 331·√(1 + Tc/273) m/s (Tc en °C);
 *                                          academia: 331 + 0,6·Tc y 340 m/s a unos 15 °C.
 *   nivel({ I, I0 })                       β = 10·log(I/I0) en dB.
 *   intensidad({ beta, I0 })               I = I0·10^(β/10).
 *   sumarNiveles({ niveles })              fuentes que suenan a la vez: se suman las intensidades, no los dB.
 *   distancia({ beta, r1, r2 })            fuente puntual: I2 = I1·(r1/r2)², y su nivel.
 *   doppler({ f, v, vo, vs })              f' = f·(v + vo)/(v − vs); vo > 0 si el oyente se acerca a la fuente y
 *                                          vs > 0 si la fuente se acerca al oyente.
 *   longitudinal({ A, f, v })              sonido en un tubo de aire: cada capa se corre s(x, t) = A·sen(kx − ωt)
 *                                          a lo largo de x, de ida y vuelta; posicion(x0, t) = x0 + s.
 *   logAcademia(x)                         logaritmo decimal con log 2 = 0,3 y log 3 = 0,48 si x = 2^a·3^b·10^c.
 *
 * Cada resultado trae 'errores': los números que salen de las ideas erróneas del informe
 * (docs/investigacion/momento-gravitacion-ondas-ideas-erroneas.md, ON1 a ON10 y los errores de cálculo que suponemos).
 * Cómo se calculan los que no salen de una fórmula a la vista:
 *   onda y mano: la frecuencia pasa de fAntes (por defecto f/2) a f. errores.vConFrecuencia = v·f/fAntes (ON2: «v crece
 *     con f» como si λ se quedara) y errores.lambdaFija = v/fAntes (la λ de antes, que el error cree que no cambia).
 *   carrera: errores.manoRapida = errores.manoAlta = la mitad del tiempo de llegada de la base (ON1 y ON3: «agitar más
 *     rápido o más alto lo hace llegar antes»; la mitad es el número que suponemos para ese error).
 *   dosPulsos: errores.seAnulan = 0 (la cuerda queda plana para siempre); errores.salenMasChicos = la mitad de cada amplitud;
 *     errores.rebotan intercambia las amplitudes (cada pulso vuelve por donde vino).
 *   longitudinal: errores.subeYBaja = |A|, el mismo desplazamiento máximo pero de arriba abajo (perpendicular a la
 *     dirección del sonido); errores.seVa(x0, t) = x0 + v·t (la capa viajaría con la onda).
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorOndas = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const PI2 = 2 * Math.PI, I0 = 1e-12, EPS = 1e-12;
  const num = (x, que) => { const n = Number(x); if (x === null || x === '' || x === undefined || !Number.isFinite(n)) throw new Error(`${que} inválido: ${x}`); return n; };
  const pos = (x, que) => { const n = num(x, que); if (!(n > 0)) throw new Error(`${que} debe ser mayor que cero: ${x}`); return n; };
  const limpio = x => (Math.abs(x) < 1e-12 ? 0 : x);

  // Rapidez de la cuerda a partir de v, o de T y μ.
  function rapidez(o) {
    if (o.v !== undefined) return pos(o.v, 'v');
    if (o.T !== undefined || o.mu !== undefined) return Math.sqrt(pos(o.T, 'T') / pos(o.mu, 'μ'));
    throw new Error('falta la rapidez: da v, o T y μ');
  }

  function cuerda(o) {
    const T = pos(o.T, 'T'), mu = pos(o.mu, 'μ'), v = Math.sqrt(T / mu);
    return { T, mu, v,
      // Despejes mal hechos de v = √(T/μ).
      errores: { sinRaiz: T / mu, multiplica: Math.sqrt(T * mu), invertida: Math.sqrt(mu / T) } };
  }

  function onda(o) {
    const A = num(o.A === undefined ? 1 : o.A, 'A'), phi = num(o.phi || 0, 'φ');
    let f, lambda, v;
    if (o.f !== undefined && o.lambda !== undefined) { f = pos(o.f, 'f'); lambda = pos(o.lambda, 'λ'); v = f * lambda; }
    else if (o.f !== undefined) { f = pos(o.f, 'f'); v = rapidez(o); lambda = v / f; }
    else if (o.lambda !== undefined) { lambda = pos(o.lambda, 'λ'); v = rapidez(o); f = v / lambda; }
    else throw new Error('falta f o λ');
    const k = PI2 / lambda, w = PI2 * f;
    const fAntes = o.fAntes === undefined ? f / 2 : pos(o.fAntes, 'fAntes');
    return { A, f, lambda, v, k, w, phi, periodo: 1 / f, uMax: Math.abs(A) * w,
      y: (x, t) => A * Math.sin(k * x - w * t + phi),
      u: (x, t) => -A * w * Math.cos(k * x - w * t + phi),
      errores: {
        // ON2: v = f·λ leído con λ fija: al pasar de fAntes a f, «v crece con f» y λ se queda en la de antes.
        vConFrecuencia: v * f / fAntes, lambdaFija: v / fAntes,
        // λ = v·f (despejar mal).
        lambdaPorProducto: v * f,
        // Confundir la rapidez del punto que sube y baja con la de la onda.
        rapidezDelPunto: Math.abs(A) * w } };
  }

  function funcionOnda(o) {
    const A = num(o.A, 'A');
    const k = o.kPi !== undefined ? pos(o.kPi, 'kPi') * Math.PI : pos(o.k, 'k');
    const w = o.wPi !== undefined ? pos(o.wPi, 'wPi') * Math.PI : pos(o.w, 'ω');
    const signo = o.signo === '+' ? '+' : '-';
    const lambda = PI2 / k, f = w / PI2, v = w / k;
    return { A: Math.abs(A), lambda, f, v, k, w, periodo: 1 / f, sentido: signo === '-' ? '+x' : '-x',
      y: (x, t) => A * Math.sin(k * x + (signo === '-' ? -1 : 1) * w * t),
      errores: { lambdaEsK: k, lambdaSobreDosPi: k / PI2, fEsOmega: w, fSinDos: w / Math.PI, vInvertida: k / w, vProducto: k * w,
        sentidoPorSigno: signo === '-' ? '-x' : '+x' } };
  }

  function mano(o) {
    const A = num(o.A, 'A'), f = pos(o.f, 'f'), v = rapidez(o), w = PI2 * f, k = w / v;
    const h = t => (t < 0 ? 0 : -A * Math.sin(w * t));
    const fAntes = o.fAntes === undefined ? f / 2 : pos(o.fAntes, 'fAntes');
    return { A, f, v, lambda: v / f, k, w, periodo: 1 / f, uMax: Math.abs(A) * w,
      h,
      y: (x, t) => h(t - x / v),
      u: (x, t) => (t - x / v < 0 ? 0 : -A * w * Math.cos(w * (t - x / v))),
      frente: t => Math.max(0, v * t),
      llegada: d => pos(d, 'd') / v,
      errores: { vConFrecuencia: v * f / fAntes, lambdaFija: v / fAntes } };
  }

  function pulso(o) {
    const A = num(o.A, 'A'), ancho = pos(o.ancho, 'ancho'), v = rapidez(o), x0 = num(o.x0 || 0, 'x0');
    const forma = s => A * Math.exp(-(s / ancho) * (s / ancho));
    return { A, ancho, v, x0,
      y: (x, t) => forma(x - x0 - v * t),
      centro: t => x0 + v * t,
      llegada: d => (num(d, 'd') - x0) / v,
      errores: { seAchica: A / 2 } };
  }

  // Carrera de pulsos: cada carril cambia algo de la base (la mano o el medio). base = { A, ancho, T, mu }.
  function carrera(o) {
    const L = pos(o.L, 'L'), base = o.base;
    const carriles = [{ nombre: 'base', cambio: {} }].concat(o.cambios || []).map(c => {
      const p = Object.assign({}, base, c.cambio);
      const v = Math.sqrt(pos(p.T, 'T') / pos(p.mu, 'μ'));
      return { nombre: c.nombre, A: p.A, ancho: p.ancho, T: p.T, mu: p.mu, v, llegada: L / v };
    });
    const t0 = carriles[0].llegada;
    let primero = carriles[0];
    for (const c of carriles) if (c.llegada < primero.llegada - EPS) primero = c;
    return { L, carriles, primero: primero.nombre,
      llegada: Object.fromEntries(carriles.map(c => [c.nombre, c.llegada])),
      igualQueBase: carriles.filter(c => Math.abs(c.llegada - t0) < EPS).map(c => c.nombre),
      errores: { manoRapida: t0 / 2, manoAlta: t0 / 2 } };
  }

  // Factores de amplitud entre dos cuerdas con la misma tensión (impedancia ∝ 1/v).
  const coefs = (v1, v2) => ({ r: (v2 - v1) / (v1 + v2), t: 2 * v2 / (v1 + v2) });

  function cuerdaConMano(o) {
    const v1 = pos(o.v1, 'v1'), v2 = o.v2 === undefined ? v1 : pos(o.v2, 'v2');
    const d = o.d === undefined ? Infinity : pos(o.d, 'd'), h = o.h, kmax = o.kmax || 40;
    if (typeof h !== 'function') throw new Error('h debe ser una función del tiempo');
    const { r, t: tr } = coefs(v1, v2), q = -r;
    const H = s => (s < 0 ? 0 : h(s));
    function y(x, t) {
      if (!Number.isFinite(d)) return H(t - x / v1);
      if (x <= d) {
        let s = 0, p = 1;
        for (let n = 0; n <= kmax; n++) {
          const ida = t - (2 * n * d + x) / v1;
          if (ida < 0 && t - (2 * (n + 1) * d - x) / v1 < 0) break;
          s += p * H(ida) + p * r * H(t - (2 * (n + 1) * d - x) / v1);
          p *= q;
        }
        return s;
      }
      let s = 0, p = 1;
      for (let n = 0; n <= kmax; n++) {
        const tt = t - (2 * n + 1) * d / v1 - (x - d) / v2;
        if (tt < 0) break;
        s += p * tr * H(tt); p *= q;
      }
      return s;
    }
    return { v1, v2, d, r, t: tr, y, errores: { sinReflejo: 0, reflejoDerecho: Math.abs(r) } };
  }

  function cambioMedio(o) {
    const f = pos(o.f, 'f');
    let v1, v2;
    if (o.v1 !== undefined) { v1 = pos(o.v1, 'v1'); v2 = pos(o.v2, 'v2'); }
    else { const T = pos(o.T, 'T'); v1 = Math.sqrt(T / pos(o.mu1, 'μ1')); v2 = Math.sqrt(T / pos(o.mu2, 'μ2')); }
    const { r, t } = coefs(v1, v2);
    return { f, f1: f, f2: f, v1, v2, lambda1: v1 / f, lambda2: v2 / f, r, t, reflejoInvertido: r < 0,
      errores: {
        // «La frecuencia cambia y la longitud de onda se queda»: f2 = f·v2/v1 con λ igual.
        fCambia: f * v2 / v1, lambdaIgual: v1 / f,
        // «No cambia nada»: v y λ iguales.
        vIgual: v1,
        // ON4: cuerda más pesada, más rápida (la razón al revés).
        vAlReves: v1 * v1 / v2, lambdaAlReves: v1 * v1 / v2 / f } };
  }

  function dosPulsos(o) {
    const A1 = num(o.A1, 'A1'), A2 = num(o.A2, 'A2'), ancho = pos(o.ancho, 'ancho'), v = pos(o.v, 'v');
    const x1 = num(o.x1, 'x1'), x2 = num(o.x2, 'x2');
    if (!(x2 > x1)) throw new Error('el pulso 2 debe empezar a la derecha del pulso 1');
    const g = s => Math.exp(-(s / ancho) * (s / ancho));
    const y1 = (x, t) => A1 * g(x - x1 - v * t), y2 = (x, t) => A2 * g(x - x2 + v * t);
    const tCruce = (x2 - x1) / (2 * v), xCruce = (x1 + x2) / 2;
    return { A1, A2, ancho, v, x1, x2, tCruce, xCruce, y1, y2, y: (x, t) => y1(x, t) + y2(x, t),
      // En el cruce, el punto de en medio vale A1 + A2 (si son opuestos e iguales, la cuerda se ve plana).
      enCruce: A1 + A2,
      // Al salir, cada pulso conserva su forma: amplitudes A1 y A2.
      despues: { A1, A2 },
      errores: { seAnulan: 0, salenMasChicos: { A1: A1 / 2, A2: A2 / 2 }, rebotan: { A1: A2, A2: A1 } } };
  }

  function estacionaria(o) {
    const L = pos(o.L, 'L'), v = rapidez(o), n = o.n === undefined ? 1 : Math.round(pos(o.n, 'n'));
    const A = num(o.A === undefined ? 1 : o.A, 'A');
    const lambda = 2 * L / n, f = n * v / (2 * L), k = PI2 / lambda, w = PI2 * f;
    const nodos = [], vientres = [];
    for (let j = 0; j <= n; j++) nodos.push(limpio(j * L / n));
    for (let j = 0; j < n; j++) vientres.push((j + 0.5) * L / n);
    return { L, v, n, A, lambda, f, k, w, periodo: 1 / f, nodos, vientres, amplitudVientre: 2 * Math.abs(A),
      y: (x, t) => 2 * A * Math.sin(k * x) * Math.sin(w * t),
      amplitud: x => 2 * Math.abs(A) * Math.abs(Math.sin(k * x)),
      errores: {
        // f_n = n·v/L: olvidar el 2 (la cuerda tiene media longitud de onda por vientre).
        sinDos: n * v / L,
        // Como un tubo cerrado: v/(4L).
        cuatroL: n * v / (4 * L),
        // Multiplicar v por L.
        vPorL: v * L,
        // Contar nodos en vez de vientres: tomar n + 1.
        cuentaNodos: (n + 1) * v / (2 * L),
        // λ = L/n (un λ entero por vientre).
        lambdaSinDos: L / n } };
  }

  function modos(o) {
    const L = pos(o.L, 'L'), v = rapidez(o), hasta = Math.round(pos(o.hasta || 4, 'hasta'));
    const lista = [];
    for (let n = 1; n <= hasta; n++) lista.push({ n, f: n * v / (2 * L), lambda: 2 * L / n });
    return { L, v, lista, f1: v / (2 * L), errores: { sinDos: v / L } };
  }

  function tubo(o) {
    const L = pos(o.L, 'L'), v = pos(o.v === undefined ? 340 : o.v, 'v'), tipo = o.tipo === 'cerrado' ? 'cerrado' : 'abierto';
    const n = Math.round(pos(o.n === undefined ? 1 : o.n, 'n'));
    if (tipo === 'cerrado' && n % 2 === 0) throw new Error('en un tubo cerrado solo hay armónicos impares');
    const f = tipo === 'abierto' ? n * v / (2 * L) : n * v / (4 * L);
    return { L, v, tipo, n, f, lambda: v / f,
      errores: { comoAbierto: n * v / (2 * L), comoCerrado: n * v / (4 * L), sinDos: n * v / L } };
  }

  function sonidoAire(o) {
    const Tc = num(o && o.Tc !== undefined ? o.Tc : 15, 'Tc');
    if (Tc <= -273) throw new Error('temperatura bajo el cero absoluto');
    return { Tc, v: 331 * Math.sqrt(1 + Tc / 273), vAcademia: 331 + 0.6 * Tc,
      errores: { proporcionalAlaCelsius: 331 * (1 + Tc / 273) } };
  }

  // log decimal con los valores de examen, si x es 2^a·3^b·10^c con a y b chicos.
  function logAcademia(x) {
    const X = pos(x, 'x'), exacto = Math.log10(X);
    for (let a = -12; a <= 12; a++) for (let b = -6; b <= 6; b++) {
      const c = Math.round(exacto - a * Math.log10(2) - b * Math.log10(3));
      const rec = Math.pow(2, a) * Math.pow(3, b) * Math.pow(10, c);
      if (Math.abs(rec - X) <= 1e-9 * X) return 0.3 * a + 0.48 * b + c;
    }
    return exacto;
  }

  function nivel(o) {
    const I = pos(o.I, 'I'), i0 = o.I0 === undefined ? I0 : pos(o.I0, 'I0');
    const beta = 10 * Math.log10(I / i0), betaAcademia = 10 * logAcademia(I / i0);
    return { I, I0: i0, beta: limpio(beta), betaAcademia: limpio(betaAcademia),
      errores: { sinLog: I / i0, sinDiez: Math.log10(I / i0), lnEnVezDeLog: 10 * Math.log(I / i0) } };
  }

  function intensidad(o) {
    const beta = num(o.beta, 'β'), i0 = o.I0 === undefined ? I0 : pos(o.I0, 'I0');
    return { beta, I0: i0, I: i0 * Math.pow(10, beta / 10), errores: { lineal: i0 * beta } };
  }

  function sumarNiveles(o) {
    const lista = (o.niveles || []).map(b => num(b, 'β'));
    if (!lista.length) throw new Error('faltan niveles');
    const Is = lista.map(b => I0 * Math.pow(10, b / 10)), I = Is.reduce((s, x) => s + x, 0);
    const beta = 10 * Math.log10(I / I0), betaAcademia = 10 * logAcademia(I / I0);
    const max = Math.max(...lista);
    return { niveles: lista, I, beta, betaAcademia,
      errores: {
        // Sumar los decibeles: 80 + 80 = 160.
        sumaDirecta: lista.reduce((s, b) => s + b, 0),
        // «Son iguales: el nivel no cambia».
        igual: max,
        // Confundir el doble con diez veces: +10 dB.
        diezVeces: 10 * Math.log10(Is.reduce((s, x) => Math.max(s, x), 0) * 10 / I0),
        // Promediar.
        promedio: lista.reduce((s, b) => s + b, 0) / lista.length } };
  }

  function distancia(o) {
    const b1 = num(o.beta, 'β'), r1 = pos(o.r1, 'r1'), r2 = pos(o.r2, 'r2');
    const I1 = I0 * Math.pow(10, b1 / 10), I2 = I1 * (r1 / r2) * (r1 / r2);
    const beta2 = 10 * Math.log10(I2 / I0), beta2Academia = b1 + 20 * logAcademia(r1 / r2);
    return { beta1: b1, r1, r2, I1, I2, razonI: I2 / I1, beta2, beta2Academia,
      errores: {
        // Al doble de distancia, la mitad de intensidad (1/r en vez de 1/r²).
        unoSobreR: b1 + 10 * logAcademia(r1 / r2),
        // La mitad de decibeles.
        mitadDecibeles: b1 * r1 / r2,
        // El nivel no cambia con la distancia.
        igual: b1 } };
  }

  function doppler(o) {
    const f = pos(o.f, 'f'), v = pos(o.v === undefined ? 340 : o.v, 'v'), vo = num(o.vo || 0, 'vo'), vs = num(o.vs || 0, 'vs');
    if (vs >= v) throw new Error('la fuente no puede ir tan rápido como el sonido o más');
    const fp = f * (v + vo) / (v - vs);
    return { f, v, vo, vs, fp, sube: fp > f + EPS,
      errores: { signosAlReves: f * (v - vo) / (v + vs), sinCambio: f, soloNumerador: f * (v + vo + vs) / v } };
  }

  function longitudinal(o) {
    const A = num(o.A, 'A'), f = pos(o.f, 'f'), v = pos(o.v === undefined ? 340 : o.v, 'v');
    const w = PI2 * f, k = w / v;
    const s = (x, t) => A * Math.sin(k * x - w * t);
    return { A, f, v, lambda: v / f, k, w, periodo: 1 / f, s,
      posicion: (x0, t) => x0 + s(x0, t),
      // Compresión relativa del aire: −∂s/∂x (positiva donde las capas se juntan).
      compresion: (x, t) => -A * k * Math.cos(k * x - w * t),
      desplazamientoMaximo: Math.abs(A),
      errores: { seVa: (x0, t) => x0 + v * t, subeYBaja: Math.abs(A) } };
  }

  return { cuerda, onda, funcionOnda, mano, pulso, carrera, cuerdaConMano, cambioMedio, dosPulsos, estacionaria, modos,
    tubo, sonidoAire, logAcademia, nivel, intensidad, sumarNiveles, distancia, doppler, longitudinal };
});
