/*
 * Motor de «El disco y sus flechas»: movimiento circular uniforme (MCU) y uniformemente variado (MCUV),
 * transmisión, encuentros, la bala que atraviesa y la forma vectorial.
 *
 * Aquí vive toda la física de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona en el navegador
 * (window.MotorCircular) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 * mcu, mcuv, mcuvDatos, transmision, tren y encuentroPista son copia de plantillas/tiro-parabolico/motor.js.
 *
 * Unidades SI: radios y distancias en m, tiempos en s, ω en rad/s, α en rad/s², v en m/s, aceleraciones en m/s².
 * Ángulos de entrada y salida en GRADOS cuando el nombre termina en «Grados» o es anguloAV, anguloAR, desfase,
 * lambda, theta0 o angulo; ángulos girados (theta) en RADIANES; vueltas = theta/2π. TAU = 2π.
 * Triángulos notables de academia: sen 37° = 3/5, cos 37° = 4/5 (y 53°, 16°, 74°); 30°, 45° y 60° exactos.
 * Velocidad angular dada de una de tres formas: omega (rad/s), f (vueltas por segundo) o rpm (vueltas por minuto).
 * Los campos que terminan en «Pi» son el mismo valor dividido entre π (para escribir «4π rad/s»).
 *
 * Funciones:
 *   trig(angulo, exacto)        → { sen, cos } del ángulo en grados (notables de academia salvo exacto: true).
 *   convertir({ rpm | f | omega | periodo, r | d })
 *                               una sola de rpm, f, omega (rad/s) o periodo (s); opcional el radio r o el diámetro
 *                               d (m) del disco. Devuelve omega, omegaPi, f, rpm, periodo, y con r o d: r, v, vPi y
 *                               acp = ω²·r. errores: omegaSin2pi (ω sin el 2π: rpm/60, f o 1/T), omegaSin60 (con rpm:
 *                               2π·rpm, sin dividir entre 60), vSin2pi, vSin60 (lo mismo multiplicado por r) y
 *                               vConDiametro (ω·d, el diámetro en lugar del radio; solo si se dio d).
 *   mcu({ r, periodo | frecuencia | rpm | omega | v })  → { r, omega, v, periodo, frecuencia, rpm, ac, angulo(t) };
 *                               errores: acSinCuadrado = v/r, acPorRadio = v²·r, acCero = 0.
 *   mcuv({ r, omega0, alfa, t, frena })  α constante (rad/s²) desde ω0 (rad/s) durante t (s). Con frena: true, si α
 *                               va contra ω0 la rueda se queda quieta al detenerse (tParada, thetaParada); sin frena,
 *                               la ecuación sigue y la rueda gira al revés. Devuelve omega, theta (rad, con signo),
 *                               vueltas, v, at = α·r, ac = ω²·r, a, tParada, thetaParada, vueltasParada, quieta.
 *                               errores: acConOmega0, aSoloTangencial, thetaSoloOmega0 = ω0·t, thetaConOmegaFinal = ω·t,
 *                               vueltasSinDosPi = θ, aSuma = |at| + ac, thetaSinDetenerse (con frena y ya quieta: lo que
 *                               daría la fórmula sin tope).
 *   mcuvDatos({ omega0 | f0 | rpm0, omega | f | rpm, alfa, t, theta | vueltas, r })  con exactamente tres de ω0, ω,
 *                               α, t (> 0) y θ, calcula los otros dos, como el MRUV. Devuelve omega0, omega, alfa,
 *                               alfaV (vueltas/s²), t, theta, f0, f, rpm0, rpm, vueltas; con r: at, ac0, ac. errores (en
 *                               vueltas): vueltasRectanguloInicial = f0·t, vueltasRectanguloFinal = f·t, vueltasEje = |f0|,
 *                               vueltasPendiente = |f − f0|/t, vueltasSinDosPi = θ.
 *   mcuvTramos({ omega0 | f0 | rpm0, tramos: [{ alfa, t }, ...] })  tramos seguidos (acelera, constante, frena), cada
 *                               uno con su α (rad/s²) y su duración t (s). Devuelve tramos: [{ t0, t1, omega0, omega1,
 *                               theta, vueltas }], omegaFinal, theta, vueltas, tTotal y estado(t) → { t, omega, theta,
 *                               vueltas, tramo }. errores: vueltasRectangulos (cada tramo con su ω inicial) y
 *                               vueltasSoloAcelera (solo el primer tramo).
 *   entre({ omega0 | f0 | rpm0, alfa, t1, t2 })  lo girado desde el reposo o desde ω0 entre los instantes t1 < t2 (s).
 *                               Devuelve omega1, omega2, f1, f2, theta, vueltas, dt. errores (en vueltas):
 *                               rectanguloInicial = f1·Δt, rectanguloFinal = f2·Δt, desdeCero = lo girado de 0 a t2
 *                               (Δt contra t), radianesComoVueltas = θ en rad leído como vueltas.
 *   aceleracionTotal({ r, omega | v | omega0 y t, alfa | at })   las dos componentes y la total de un punto a r (m) del
 *   aceleracionTotal({ r, v | omega, anguloAV })                 eje. Con ω0 y t: ω = ω0 + α·t. En la segunda forma se da
 *                               el ángulo entre a y v (grados) y salen at y a del triángulo. Devuelve omega, v, at (con
 *                               signo: negativo si frena), acp = ω²·r, a, tan = acp/|at|, anguloAV (grados, entre a y v),
 *                               anguloAR (grados, entre a y el radio que va al centro; suman 90°). errores: aSuma =
 *                               |at| + acp, aSoloCentripeta = acp, aSoloTangencial = |at|, anguloCambiado (anguloAR leído
 *                               como anguloAV), atAcCambiadas (con anguloAV dado: |a| = acp/cos, aT y acp intercambiadas en
 *                               la tangente, o el seno y el coseno cambiados), atCambiada (con anguloAV: at = acp·tan),
 *                               acConOmega0 (si se dio ω0: ω0²·r).
 *   desdeReposo({ r, alfa, razon | anguloAV })  parte del reposo con α (rad/s²) en un punto a r (m). Busca el ángulo
 *                               girado θ en que acp/aT = razon (o en que a forma anguloAV grados con v; razon = tan).
 *                               Como acp/aT = ω²r/(αr) = 2αθ/α = 2θ, θ = razon/2 rad, sin importar r ni α. Devuelve
 *                               razon, theta (rad), thetaGrados, vueltas, t = √(2θ/α), omega = √(2αθ), v, at, acp, a y
 *                               anguloAV. errores (en rad): thetaSinElDos = razon (ω² = αθ), theta45 = π/4 (el ángulo de
 *                               a con v leído como el girado), thetaConRadio = razon·r/2, unaVuelta = 2π.
 *   razonDesdeReposo(theta)     acp/aT al girar theta rad desde el reposo: 2θ.
 *   vectorial({ r, omega, theta0, t1, t2 })  MCU con centro en el origen, radio r (m), ω (rad/s, + antihorario) y
 *                               posición angular theta0 (grados) en t = 0. Entre t1 y t2 (s) devuelve p1, p2 (posiciones
 *                               {x, y}), v1, v2 (velocidades), a1, a2 (aceleraciones, hacia el centro), dv = v2 − v1,
 *                               dr = p2 − p1 (desplazamiento), dt, girado (grados), vMedia = dr/Δt, aMedia = dv/Δt, y los
 *                               módulos: rapidez v, acp, modDv, cuerda = |dr|, arco = r·|Δθ|, modVMedia, modAMedia,
 *                               difA = |a2 − a1|. errores: deltaVCero = 0, deltaVSuma = 2v, arcoPorCuerda = arco,
 *                               vMediaConArco = arco/Δt (la rapidez media), vMediaSinDividir = cuerda, aMediaSinDividir
 *                               = |Δv|, aMediaCero = 0.
 *   deltaV({ r, omega | v, angulo })  versión corta: |Δv| = 2v·sen(Δθ/2), cuerda = 2r·sen(Δθ/2), arco, t, vMedia,
 *                               aMedia para dos puntos separados angulo grados (mismos errores que vectorial).
 *   rigido({ omega | f | rpm, radios: [r, ...] })  puntos de un mismo disco: misma ω; devuelve puntos: [{ r, v, acp }] y
 *                               razon = v del último / v del primero. errores: vIgual (todos con la v del primero),
 *                               razonInversa, razonCuadrado.
 *   latitud({ R, lambda, periodo })  punto de la Tierra (o de una esfera) de radio R (m) a la latitud lambda (grados),
 *                               girando con periodo (s): r = R·cos λ, omega, v, acp. errores: vSinCoseno (con R), vConSeno.
 *   transmision({ r1, r2, omega1 | f1 | rpm1 | v1, tipo })  tipo 'faja', 'cruzada' o 'engranaje': misma v en los bordes;
 *                               'eje': misma ω. Devuelve v1, omega1, omega2, v2, f2, rpm2, sentido2. errores:
 *                               omegaIgualConFaja, vIgualEnEje, omegaDirecta, omegaCuadrado, vInversa, vCuadrado, sentidoIgual.
 *   tren({ omega1 | f1 | rpm1, ruedas: [{ r }, { r, union }, ...] })  → [{ r, omega, f, v, sentido }], rueda por rueda.
 *   poleaEscalonada({ r1, omega1 | f1 | rpm1 | v1, rEntra, rSale, union })  la rueda 1 (radio r1) mueve, por faja o
 *                               engranaje (union 'faja', 'cruzada' o 'engranaje'), la garganta de radio rEntra de una
 *                               polea escalonada; de su otra garganta, de radio rSale (en el mismo eje), cuelga un bloque
 *                               con una cuerda. Devuelve vEntra (borde de la rueda 1), omega2 (de la polea), vBloque =
 *                               ω2·rSale, sentido2. errores: bloqueRadioEquivocado (ω2·rEntra: el bloque con la otra
 *                               garganta, igual a la v de la faja), omegaIgualConFaja (ω1·rSale), omegaDirecta
 *                               (ω1·rEntra/r1·rSale con la proporción al revés).
 *   encuentroPista({ L | r, v1, v2, sentido, separacion, n })   dos móviles en una pista cerrada (lineal o angular,
 *   encuentroPista({ omega1, omega2, theta0, sentido, n })      sentido 'mismo' o 'contrario', n-ésimo encuentro).
 *                               Devuelve t, vRel, brecha, periodo, s1, s2, vueltas1, vueltas2, lugar, lugarGrados, nunca,
 *                               estado(t). errores: tConSuma, tConResta, tSinSeparacion, tEnesimo, tVueltaDelRapido.
 *   reencuentroSalida({ periodo1, periodo2, sentido })  dos móviles salen juntos del mismo punto con periodos T1 y T2
 *                               (s; racionales). Devuelve t (el primer instante > 0 en que los dos vuelven a la vez a la
 *                               salida: mínimo común múltiplo), vueltas1, vueltas2, tEncuentro (primer encuentro en
 *                               cualquier punto: T1·T2/|T2 − T1| en el mismo sentido, T1·T2/(T1 + T2) en el contrario)
 *                               y encuentros (cuántas veces se cruzan en (0, t], contando el de la salida).
 *                               errores: primerEncuentro, producto = T1·T2, conSuma (las ω sumadas en el mismo sentido)
 *                               o conResta (restadas en el contrario), periodoRapido.
 *   atraviesa({ L, v, modo, desfase, n })  una bala recorre L (m) a v (m/s) mientras un cuerpo gira. modo 'cascaron':
 *                               cruza el diámetro L de una esfera hueca que gira; deja un solo agujero si gira media vuelta
 *                               (más vueltas enteras: π(2n + 1)). modo 'discos': dos discos del mismo eje a L uno del otro;
 *                               el segundo agujero queda desfase grados atrás del primero (más 2πn). n = 0 da la ω mínima.
 *                               Devuelve t = L/v, angulo (rad), omega, omegaPi, f (vueltas/s). errores: vueltaEntera
 *                               (una vuelta más: cascarón con 2π, discos con desfase + 2π), omegaComoVueltas (las vueltas
 *                               por segundo leídas como rad/s), cuartoDeVuelta (cascarón con π/2), gradosSinRadianes (el ángulo en
 *                               grados dividido entre t, como si fueran rad/s), diametroPorRadio (L tomado como radio: la bala
 *                               recorre 2L), msSinConvertir (t en milisegundos usado como si fueran segundos).
 *   enesimoSegundo({ alfa | theta1, omega0 | f0 | rpm0, n })  lo girado en el segundo n (de n − 1 a n s) con α
 *                               (rad/s²; o theta1, lo girado en el primer segundo) desde ω0 (0 si no se da). Devuelve
 *                               thetaN, vueltasN, theta1, thetaHasta (de 0 a n s), vueltasHasta, segundos (lo de cada
 *                               segundo, 1 a n) y razon = thetaN/theta1 (2n − 1 desde el reposo). errores: razonN = n,
 *                               razonCuadrado = n², thetaHasta, razonHasta = thetaHasta/theta1, razonUno = 1.
 *   horaria({ theta0, omega0, alfa, t1, t2, t, r })   θ(t) = θ0 + ω0·t + ½·α·t² (rad, rad/s, rad/s²) o, con
 *   horaria({ coef: [a, b, c], ... })                 coef, θ = a + b·t + c·t² (α = 2c). Devuelve theta0, omega0, alfa,
 *                               tParada (ω = 0 con t > 0, o null), thetaParada, theta(t), omega(t); con t1 < t2: neto =
 *                               θ(t2) − θ(t1) y recorrido (sumando en valor absoluto antes y después de tParada); con t
 *                               (y r): thetaT, omegaT (y at, acp, a, v). errores: coeficienteComoAlfa (c, o α/2),
 *                               coeficienteSinSigno = −α, linealComoAlfa = ω0; con t1, t2: posicionPorGiro = θ(t2) (sin
 *                               restar θ(t1)) y netoPorRecorrido = |neto|.
 *   grafica({ puntos: [[t, ω], ...], t1, t2 })  gráfica ω-t de tramos rectos (s, rad/s). Entre t1 y t2 (por defecto, toda):
 *                               neto (área con signo, rad), recorrido (área sin signo), vueltasNetas, vueltasRecorridas,
 *                               ceros (cruces con el eje), pendientes (α de cada tramo) y omega(t). errores:
 *                               netoPorRecorrido = |neto|, pendiente = |α del primer tramo|, leeEje = |ω(t2)|, leeEjeInicial.
 *   dosMoviles({ omega01, alfa1, omega02, alfa2 })  dos móviles salen juntos del mismo punto y del mismo radio; tIgual es
 *                               el instante en que van con la misma ω (y la misma acp), omega esa ω, theta1 y theta2 lo
 *                               que giró cada uno y separacion = |θ1 − θ2| (el área entre las rectas ω-t). errores:
 *                               areaDeUno, areaDelOtro, sumaAreas, cero.
 *   poleaMovil({ v1, v2, r })   polea móvil colgada de dos cuerdas que suben a v1 y v2 (m/s, + hacia arriba): el bloque va a
 *                               vBloque = (v1 + v2)/2; con r, la polea gira con omega = (v1 − v2)/(2r). errores: unaCuerda1,
 *                               unaCuerda2, suma, diferencia.
 *   transmisionMCUV({ r1, r2, alfa1, tipo })  reducción en MCUV: con faja o engranaje se conserva aT (α2 = α1·r1/r2); en el eje,
 *                               α. Devuelve alfa1, alfa2, at1, at2. errores: alfaIgualConFaja = α1, alfaDirecta,
 *                               alfaCuadrado, atIgualEnEje.
 *   rodadura({ r, v, rApoyo, angulo })  rueda de radio r que rueda sin resbalar, con el centro a v (m/s) hacia +x, apoyada a
 *                               rApoyo del centro (r si no se da; menor en una bobina). ω = v/rApoyo, horario. Cada punto
 *                               del borde, a un ángulo en grados medido desde lo más alto hacia adelante, trae x, y
 *                               (respecto al centro), vx, vy, modulo y distanciaApoyo (modulo = ω·distanciaApoyo).
 *                               Devuelve omega, arriba, adelante, abajo, centro = v y, con angulo, punto. errores: todosAv =
 *                               v, triple = 3v, arribaCero = 0, comoLateral = v·√2 (lo más alto tomado como un punto lateral).
 *   gotaDeRueda({ r, g, vueltas })  rueda vertical de radio r (m) que gira en un eje fijo; una gota sale del borde a la
 *                               altura del eje con la velocidad del borde hacia arriba y vuelve a caer al mismo lugar. Para
 *                               que la reciba el mismo punto del borde, la rueda da vueltas (1 si no se da) en el vuelo:
 *                               ω = √(π·vueltas·g/r). Devuelve omega, v, t (vuelo), altura. g = 10 m/s² si no se da.
 *                               errores: mediaVuelta, soloSubida (vuelo de solo subida, t = v/g), conDiametro (r por 2r),
 *                               unRadian (cada vuelta tomada como 1 rad en vez de 2π: ω·t = vueltas).
 *   despegaDelDisco({ R, d, omega })  bolita sujeta por un hilo a d (m) del centro de un disco liso de radio R que gira con
 *                               ω; se corta el hilo y sigue en línea recta (tangente) con v = ω·d. Devuelve v, camino =
 *                               √(R² − d²), t, anguloSalida (grados entre el radio donde se soltó y el radio por donde
 *                               sale, adelante) y giroDisco (grados que gira el disco mientras tanto). errores: haciaAfuera
 *                               = 0 (sale por la prolongación del radio), aNoventa = 90, sigueCurvando = null (no sale).
 *
 * Cada resultado trae 'errores': los números que dan las ideas erróneas del mapa
 * (docs/clasificacion/compendio-movimiento-circunferencial.md) y de los informes de cinemática y dinámica.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorCircular = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const EPS = 1e-9;
  const TAU = 2 * Math.PI, PI = Math.PI;
  const num = (x, que) => { const n = Number(x); if (x === null || x === '' || !Number.isFinite(n)) throw new Error(`${que} inválido: ${x}`); return n; };
  const pos = (x, que) => { const n = num(x, que); if (!(n > 0)) throw new Error(`${que} debe ser mayor que cero: ${x}`); return n; };
  const noNeg = (x, que) => { const n = num(x === undefined ? 0 : x, que); if (n < 0) throw new Error(`${que} no puede ser negativo: ${x}`); return n; };
  const limpio = x => (Math.abs(x) < EPS ? 0 : x);
  const grados = x => x * 180 / PI, rad = x => x * PI / 180;

  const R3 = Math.sqrt(3), R2 = Math.SQRT2;
  const NOTABLES = { 0: [0, 1], 16: [7 / 25, 24 / 25], 30: [1 / 2, R3 / 2], 37: [3 / 5, 4 / 5], 45: [R2 / 2, R2 / 2],
    53: [4 / 5, 3 / 5], 60: [R3 / 2, 1 / 2], 74: [24 / 25, 7 / 25], 90: [1, 0] };
  function trig(angulo, exacto) {
    const a = num(angulo, 'ángulo'), k = Math.abs(a), s = Math.sign(a) || 1;
    if (Object.prototype.hasOwnProperty.call(NOTABLES, k) && !(exacto && (k === 37 || k === 53 || k === 16 || k === 74))) {
      const [sen, cos] = NOTABLES[k];
      return { sen: s * sen, cos };
    }
    const r = rad(a);
    return { sen: Math.sin(r), cos: Math.cos(r) };
  }

  // Velocidad angular dada de una de tres formas (rad/s, vueltas por segundo o rpm). Devuelve undefined si no hay ninguna.
  function angular(o, kw, kf, krpm, que) {
    const dados = [kw, kf, krpm].filter(k => o[k] !== undefined);
    if (dados.length > 1) throw new Error(`${que}: da ${kw}, ${kf} o ${krpm}, una sola (no las dos)`);
    if (o[kw] !== undefined) return num(o[kw], que);
    if (o[kf] !== undefined) return TAU * num(o[kf], que);
    if (o[krpm] !== undefined) return TAU * num(o[krpm], que) / 60;
    return undefined;
  }

  // ---------- Conversiones ----------
  function convertir(o) {
    const dados = ['rpm', 'f', 'omega', 'periodo'].filter(k => o[k] !== undefined);
    if (dados.length !== 1) throw new Error('da una sola de: rpm, f, omega, periodo');
    if (o.r !== undefined && o.d !== undefined) throw new Error('da el radio r o el diámetro d, no los dos');
    let omega, sin2pi, sin60 = null;
    if (o.rpm !== undefined) { const n = pos(o.rpm, 'rpm'); omega = TAU * n / 60; sin2pi = n / 60; sin60 = TAU * n; }
    else if (o.f !== undefined) { const n = pos(o.f, 'f'); omega = TAU * n; sin2pi = n; }
    else if (o.omega !== undefined) { omega = pos(o.omega, 'ω'); sin2pi = omega / TAU; }
    else { const T = pos(o.periodo, 'periodo'); omega = TAU / T; sin2pi = 1 / T; }
    const f = omega / TAU;
    const res = { omega, omegaPi: omega / PI, f, rpm: f * 60, periodo: 1 / f,
      errores: { omegaSin2pi: sin2pi, omegaSin60: sin60 } };
    const r = o.r !== undefined ? pos(o.r, 'radio') : o.d !== undefined ? pos(o.d, 'diámetro') / 2 : null;
    if (r !== null) {
      Object.assign(res, { r, v: omega * r, vPi: omega * r / PI, acp: omega * omega * r });
      Object.assign(res.errores, { vSin2pi: sin2pi * r, vSin60: sin60 === null ? null : sin60 * r,
        vConDiametro: o.d !== undefined ? omega * 2 * r : null });
    }
    return res;
  }

  // ---------- MCU y MCUV (copia de tiro-parabolico) ----------
  function mcu(o) {
    const r = pos(o.r, 'radio');
    let omega;
    if (o.omega !== undefined) omega = num(o.omega, 'ω');
    else if (o.v !== undefined) omega = num(o.v, 'rapidez') / r;
    else if (o.periodo !== undefined) omega = TAU / pos(o.periodo, 'periodo');
    else if (o.frecuencia !== undefined) omega = TAU * pos(o.frecuencia, 'frecuencia');
    else if (o.rpm !== undefined) omega = TAU * pos(o.rpm, 'rpm') / 60;
    else throw new Error('falta ω, v, periodo, frecuencia o rpm');
    const w = Math.abs(omega), v = w * r;
    return { r, omega, v, periodo: w ? TAU / w : Infinity, frecuencia: w / TAU, rpm: w * 60 / TAU,
      ac: w * w * r, angulo: t => omega * t,
      errores: { acSinCuadrado: v / r, acPorRadio: v * v * r, acCero: 0 } };
  }

  function mcuv(o) {
    const r = pos(o.r, 'radio'), w0 = num(o.omega0 || 0, 'ω0'), al = num(o.alfa || 0, 'α'), t = noNeg(o.t, 'tiempo');
    const frena = al !== 0 && w0 !== 0 && Math.sign(al) !== Math.sign(w0);
    const tParada = frena ? -w0 / al : null, thetaParada = frena ? w0 * w0 / (2 * Math.abs(al)) * Math.sign(w0) : null;
    const quieta = !!o.frena && frena && t > tParada;
    const omega = quieta ? 0 : w0 + al * t, theta = quieta ? thetaParada : w0 * t + al * t * t / 2;
    const at = quieta ? 0 : al * r, ac = omega * omega * r;
    return { r, omega, theta, vueltas: theta / TAU, v: omega * r, at, ac, a: Math.hypot(at, ac),
      tParada, thetaParada, vueltasParada: frena ? thetaParada / TAU : null, quieta,
      errores: { acConOmega0: w0 * w0 * r, aSoloTangencial: Math.abs(at),
        thetaSoloOmega0: w0 * t, thetaConOmegaFinal: omega * t,
        vueltasSinDosPi: theta,
        aSuma: Math.abs(at) + ac,
        thetaSinDetenerse: quieta ? w0 * t + al * t * t / 2 : null } };
  }

  function mcuvDatos(o) {
    const w0 = angular(o, 'omega0', 'f0', 'rpm0', 'ω0'), w = angular(o, 'omega', 'f', 'rpm', 'ω');
    if (o.theta !== undefined && o.vueltas !== undefined) throw new Error('θ: da theta o vueltas, no las dos');
    const th = o.theta !== undefined ? num(o.theta, 'θ') : o.vueltas !== undefined ? TAU * num(o.vueltas, 'vueltas') : undefined;
    const al = o.alfa !== undefined ? num(o.alfa, 'α') : undefined, t = o.t !== undefined ? pos(o.t, 'tiempo') : undefined;
    const dados = { w0: w0 !== undefined, w: w !== undefined, al: al !== undefined, t: t !== undefined, th: th !== undefined };
    if (Object.values(dados).filter(Boolean).length !== 3) throw new Error('hacen falta exactamente tres de: ω0, ω, α, t, θ');
    const clave = ['w0', 'w', 'al', 't', 'th'].filter(k => dados[k]).join(',');
    let W0 = w0, W = w, AL = al, T = t, TH = th;
    const conT = (a, b) => { if (!(b > EPS)) throw new Error('con esos datos el tiempo no sale positivo: no llega'); return b; };
    const raiz = (R, desde, haciaAdelante) => {
      if (R < -EPS) return null;
      const c = [Math.sqrt(Math.max(0, R)), -Math.sqrt(Math.max(0, R))];
      const ts = c.map(x => (haciaAdelante ? (x - desde) / AL : (desde - x) / AL));
      const ok = c.map((x, k) => [x, ts[k]]).filter(([, tt]) => tt > EPS).sort((a, b) => a[1] - b[1]);
      return ok.length ? ok[0] : null;
    };
    switch (clave) {
      case 'w0,w,t': AL = (W - W0) / T; TH = (W0 + W) * T / 2; break;
      case 'w0,al,t': W = W0 + AL * T; TH = W0 * T + AL * T * T / 2; break;
      case 'w,al,t': W0 = W - AL * T; TH = (W0 + W) * T / 2; break;
      case 'w0,w,al':
        if (AL === 0) throw new Error(W === W0 ? 'con α = 0, ω no cambia: falta t o θ' : 'con α = 0, ω no cambia: nunca llega a esa ω');
        T = (W - W0) / AL; if (!(T > EPS)) throw new Error('con esa α no llega a esa ω (o ω no cambia)');
        TH = (W * W - W0 * W0) / (2 * AL); break;
      case 'w0,w,th': T = conT(0, 2 * TH / (W0 + W)); AL = (W - W0) / T; break;
      case 'w0,al,th':
        if (AL === 0) { W = W0; T = conT(0, TH / W0); break; }
        { const R = W0 * W0 + 2 * AL * TH, s = raiz(R, W0, true);
          if (R < -EPS) throw new Error(`se detiene antes: solo gira ${+(W0 * W0 / (2 * Math.abs(AL)) / TAU).toFixed(6)} vueltas`);
          if (!s) throw new Error('con esos datos el tiempo no sale positivo: no llega');
          W = s[0]; T = s[1]; }
        break;
      case 'w,al,th':
        if (AL === 0) { W0 = W; T = conT(0, TH / W); break; }
        { const R = W * W - 2 * AL * TH;
          if (R < -EPS) throw new Error('no es posible: con esa α no se llega a esa ω después de girar θ');
          const s = raiz(R, W, false);
          if (!s) throw new Error('con esos datos el tiempo no sale positivo: no llega');
          W0 = s[0]; T = s[1]; }
        break;
      case 'w0,t,th': W = 2 * TH / T - W0; AL = (W - W0) / T; break;
      case 'w,t,th': W0 = 2 * TH / T - W; AL = (W - W0) / T; break;
      case 'al,t,th': W0 = TH / T - AL * T / 2; W = W0 + AL * T; break;
      default: throw new Error('hacen falta exactamente tres de: ω0, ω, α, t, θ');
    }
    W0 = limpio(W0); W = limpio(W); AL = limpio(AL); TH = limpio(TH);
    const f0 = W0 / TAU, f = W / TAU;
    const res = { omega0: W0, omega: W, alfa: AL, alfaV: AL / TAU, t: T, theta: TH, f0, f, rpm0: f0 * 60, rpm: f * 60, vueltas: TH / TAU,
      errores: {
        vueltasRectanguloInicial: f0 * T, vueltasRectanguloFinal: f * T,
        vueltasEje: Math.abs(f0), vueltasPendiente: Math.abs(f - f0) / T,
        vueltasSinDosPi: TH } };
    if (o.r !== undefined) { const r = pos(o.r, 'radio'); Object.assign(res, { r, at: AL * r, ac0: W0 * W0 * r, ac: W * W * r }); }
    return res;
  }

  // Tramos seguidos con α constante en cada uno.
  function mcuvTramos(o) {
    const w0 = angular(o, 'omega0', 'f0', 'rpm0', 'ω0');
    if (!Array.isArray(o.tramos) || !o.tramos.length) throw new Error('faltan los tramos');
    let w = w0 === undefined ? 0 : w0, t = 0, th = 0;
    const tramos = o.tramos.map((q, k) => {
      const al = num(q.alfa || 0, `α del tramo ${k + 1}`), d = pos(q.t, `tiempo del tramo ${k + 1}`);
      const theta = w * d + al * d * d / 2, w1 = w + al * d;
      const tr = { t0: t, t1: t + d, alfa: al, omega0: w, omega1: limpio(w1), theta: limpio(theta), vueltas: limpio(theta) / TAU };
      t += d; th += theta; w = w1; return tr;
    });
    const estado = tt => {
      const x = Math.max(0, Math.min(t, num(tt, 'tiempo')));
      let acum = 0;
      for (let k = 0; k < tramos.length; k++) {
        const q = tramos[k];
        if (x <= q.t1 + EPS || k === tramos.length - 1) {
          const s = Math.min(x, q.t1) - q.t0, theta = acum + q.omega0 * s + q.alfa * s * s / 2;
          return { t: x, omega: q.omega0 + q.alfa * s, theta, vueltas: theta / TAU, tramo: k };
        }
        acum += q.theta;
      }
      return null;
    };
    return { tramos, omegaFinal: limpio(w), theta: limpio(th), vueltas: limpio(th) / TAU, tTotal: t, estado,
      errores: { vueltasRectangulos: tramos.reduce((s, q) => s + q.omega0 * (q.t1 - q.t0), 0) / TAU,
        vueltasSoloAcelera: tramos[0].vueltas } };
  }

  // Lo girado entre dos instantes que no empiezan en cero.
  function entre(o) {
    const w0 = angular(o, 'omega0', 'f0', 'rpm0', 'ω0') || 0, al = num(o.alfa, 'α');
    const t1 = noNeg(o.t1, 't1'), t2 = pos(o.t2, 't2');
    if (!(t2 > t1)) throw new Error('t2 debe ser mayor que t1');
    const th = t => w0 * t + al * t * t / 2, dt = t2 - t1;
    const omega1 = w0 + al * t1, omega2 = w0 + al * t2, theta = th(t2) - th(t1);
    return { omega1, omega2, f1: omega1 / TAU, f2: omega2 / TAU, theta, vueltas: theta / TAU, dt,
      errores: { rectanguloInicial: omega1 / TAU * dt, rectanguloFinal: omega2 / TAU * dt, desdeCero: th(t2) / TAU,
        radianesComoVueltas: theta } };
  }

  // ---------- Aceleración tangencial, centrípeta y total ----------
  function aceleracionTotal(o) {
    const r = pos(o.r, 'radio');
    let omega, w0 = null;
    const conAngulo = o.anguloAV !== undefined;
    if (o.omega !== undefined) omega = num(o.omega, 'ω');
    else if (o.v !== undefined) omega = num(o.v, 'rapidez') / r;
    else if (o.omega0 !== undefined && o.t !== undefined && o.alfa !== undefined) {
      w0 = num(o.omega0, 'ω0'); omega = w0 + num(o.alfa, 'α') * noNeg(o.t, 'tiempo');
    } else throw new Error('falta ω, v, o ω0 con α y t');
    const acp = omega * omega * r;
    let at;
    const errores = {};
    if (conAngulo) {
      const ang = num(o.anguloAV, 'ángulo entre a y v');
      if (!(ang > 0 && ang < 90)) throw new Error('el ángulo entre a y v va entre 0° y 90° (sin incluirlos)');
      if (!(acp > 0)) throw new Error('sin rapidez no hay aceleración centrípeta');
      const { sen, cos } = trig(ang, o.exacto);
      at = acp * cos / sen;
      errores.atAcCambiadas = acp / cos; errores.atCambiada = acp * sen / cos;
    } else if (o.at !== undefined) at = num(o.at, 'aT');
    else if (o.alfa !== undefined) at = num(o.alfa, 'α') * r;
    else throw new Error('falta α, aT o el ángulo entre a y v');
    const a = Math.hypot(at, acp);
    const anguloAV = conAngulo ? num(o.anguloAV, 'ángulo') : grados(Math.atan2(acp, Math.abs(at)));
    Object.assign(errores, { aSuma: Math.abs(at) + acp, aSoloCentripeta: acp, aSoloTangencial: Math.abs(at), anguloCambiado: 90 - anguloAV });
    if (w0 !== null) errores.acConOmega0 = w0 * w0 * r;
    return { r, omega, v: omega * r, at: limpio(at), acp, a, tan: Math.abs(at) > EPS ? acp / Math.abs(at) : Infinity,
      anguloAV, anguloAR: 90 - anguloAV, errores };
  }

  const razonDesdeReposo = theta => 2 * noNeg(theta, 'θ');

  function desdeReposo(o) {
    const r = pos(o.r, 'radio'), al = pos(o.alfa, 'α');
    let razon;
    if (o.razon !== undefined && o.anguloAV !== undefined) throw new Error('da la razón o el ángulo, no los dos');
    if (o.razon !== undefined) razon = pos(o.razon, 'razón acp/aT');
    else if (o.anguloAV !== undefined) {
      const ang = num(o.anguloAV, 'ángulo entre a y v');
      if (!(ang > 0 && ang < 90)) throw new Error('el ángulo entre a y v va entre 0° y 90° (sin incluirlos)');
      const { sen, cos } = trig(ang, o.exacto); razon = sen / cos;
    } else throw new Error('falta la razón acp/aT o el ángulo entre a y v');
    const theta = razon / 2, omega = Math.sqrt(2 * al * theta), t = Math.sqrt(2 * theta / al);
    const at = al * r, acp = omega * omega * r;
    return { razon, theta, thetaGrados: grados(theta), vueltas: theta / TAU, t, omega, v: omega * r, at, acp, a: Math.hypot(at, acp),
      anguloAV: grados(Math.atan(razon)),
      errores: { thetaSinElDos: razon, theta45: PI / 4, thetaConRadio: razon * r / 2, unaVuelta: TAU } };
  }

  // ---------- Forma vectorial del MCU ----------
  const vec = (x, y) => ({ x: limpio(x), y: limpio(y) });
  function vectorial(o) {
    const r = pos(o.r, 'radio'), w = num(o.omega, 'ω');
    if (w === 0) throw new Error('con ω = 0 no gira');
    const th0 = rad(num(o.theta0 || 0, 'θ0')), t1 = noNeg(o.t1, 't1'), t2 = num(o.t2, 't2');
    if (!(t2 > t1)) throw new Error('t2 debe ser mayor que t1');
    const en = t => { const th = th0 + w * t, c = Math.cos(th), s = Math.sin(th);
      return { p: vec(r * c, r * s), v: vec(-w * r * s, w * r * c), a: vec(-w * w * r * c, -w * w * r * s) }; };
    const A = en(t1), B = en(t2), dt = t2 - t1;
    const dv = vec(B.v.x - A.v.x, B.v.y - A.v.y), dr = vec(B.p.x - A.p.x, B.p.y - A.p.y);
    const mod = u => Math.hypot(u.x, u.y);
    const v = Math.abs(w) * r, arco = r * Math.abs(w) * dt;
    return { r, omega: w, v, acp: w * w * r, dt, girado: grados(w * dt),
      p1: A.p, p2: B.p, v1: A.v, v2: B.v, a1: A.a, a2: B.a, dv, dr,
      vMedia: vec(dr.x / dt, dr.y / dt), aMedia: vec(dv.x / dt, dv.y / dt),
      modDv: mod(dv), cuerda: mod(dr), arco, modVMedia: mod(dr) / dt, modAMedia: mod(dv) / dt,
      difA: Math.hypot(B.a.x - A.a.x, B.a.y - A.a.y),
      errores: { deltaVCero: 0, deltaVSuma: 2 * v, arcoPorCuerda: arco, vMediaConArco: arco / dt,
        vMediaSinDividir: mod(dr), aMediaSinDividir: mod(dv), aMediaCero: 0 } };
  }
  function deltaV(o) {
    const r = pos(o.r, 'radio');
    const w = o.omega !== undefined ? pos(o.omega, 'ω') : pos(o.v, 'rapidez') / r;
    const ang = pos(o.angulo, 'ángulo entre las dos posiciones');
    const x = vectorial({ r, omega: w, theta0: 0, t1: 0, t2: rad(ang) / w });
    return { r, omega: w, v: x.v, angulo: ang, t: x.dt, modDv: x.modDv, cuerda: x.cuerda, arco: x.arco,
      vMedia: x.modVMedia, aMedia: x.modAMedia, errores: x.errores };
  }

  // ---------- Cuerpo rígido ----------
  function rigido(o) {
    const w = angular(o, 'omega', 'f', 'rpm', 'ω');
    if (w === undefined) throw new Error('falta ω, f o rpm');
    if (!Array.isArray(o.radios) || o.radios.length < 2) throw new Error('hacen falta al menos dos radios');
    const puntos = o.radios.map((r, k) => { const rr = noNeg(r, `radio ${k + 1}`); return { r: rr, v: Math.abs(w) * rr, acp: w * w * rr }; });
    const a = puntos[0], b = puntos[puntos.length - 1];
    if (!(a.r > 0)) throw new Error('el primer punto no puede estar en el eje');
    return { omega: w, puntos, razon: b.v / a.v,
      errores: { vIgual: puntos.map(() => a.v), razonInversa: a.r / b.r, razonCuadrado: (b.r / a.r) ** 2 } };
  }
  function latitud(o) {
    const R = pos(o.R, 'radio'), T = pos(o.periodo, 'periodo'), lam = num(o.lambda, 'latitud');
    if (lam < -90 || lam > 90) throw new Error('la latitud va de −90° a 90°');
    const { sen, cos } = trig(lam, o.exacto), w = TAU / T, r = R * cos;
    return { r: limpio(r), omega: w, v: limpio(w * r), acp: limpio(w * w * r),
      errores: { vSinCoseno: w * R, vConSeno: w * R * Math.abs(sen) } };
  }

  // ---------- Transmisión (copia de tiro-parabolico, más la polea escalonada) ----------
  const TIPOS = ['faja', 'cruzada', 'engranaje', 'eje'];
  function transmision(o) {
    const r1 = pos(o.r1, 'radio 1'), r2 = pos(o.r2, 'radio 2');
    if (!TIPOS.includes(o.tipo)) throw new Error("tipo debe ser 'faja', 'cruzada', 'engranaje' o 'eje'");
    let w1 = angular(o, 'omega1', 'f1', 'rpm1', 'ω1');
    if (w1 === undefined) {
      if (o.v1 === undefined) throw new Error('falta ω1, f1, rpm1 o v1');
      w1 = num(o.v1, 'v1') / r1;
    } else if (o.v1 !== undefined) throw new Error('da ω1 (o f1, rpm1) o v1, no las dos');
    const v1 = w1 * r1;
    const omega2 = o.tipo === 'eje' ? w1 : v1 / r2;
    const f2 = omega2 / TAU;
    return { v1, omega1: w1, omega2, v2: omega2 * r2, f2, rpm2: f2 * 60, sentido2: o.tipo === 'engranaje' || o.tipo === 'cruzada' ? -1 : 1,
      errores: { omegaIgualConFaja: w1, vIgualEnEje: v1,
        omegaDirecta: w1 * r2 / r1, omegaCuadrado: w1 * (r1 / r2) ** 2,
        vInversa: v1 * r1 / r2, vCuadrado: v1 * (r2 / r1) ** 2,
        sentidoIgual: 1 } };
  }
  function tren(o) {
    const w1 = angular(o, 'omega1', 'f1', 'rpm1', 'ω1');
    if (w1 === undefined) throw new Error('falta ω1, f1 o rpm1');
    if (!Array.isArray(o.ruedas) || !o.ruedas.length) throw new Error('faltan las ruedas');
    const out = [];
    o.ruedas.forEach((q, k) => {
      const r = pos(q.r, `radio ${k + 1}`);
      let omega = w1, sentido = 1;
      if (k) {
        const a = out[k - 1];
        if (!TIPOS.includes(q.union)) throw new Error("union debe ser 'faja', 'cruzada', 'engranaje' o 'eje'");
        omega = q.union === 'eje' ? a.omega : a.v / r;
        sentido = q.union === 'engranaje' || q.union === 'cruzada' ? -a.sentido : a.sentido;
      }
      out.push({ r, omega, f: omega / TAU, v: omega * r, sentido });
    });
    return out;
  }
  function poleaEscalonada(o) {
    const union = o.union || 'faja';
    if (!['faja', 'cruzada', 'engranaje'].includes(union)) throw new Error("union debe ser 'faja', 'cruzada' o 'engranaje'");
    const r1 = pos(o.r1, 'radio 1'), rE = pos(o.rEntra, 'radio de la garganta que entra'), rS = pos(o.rSale, 'radio de la garganta del bloque');
    let w1 = angular(o, 'omega1', 'f1', 'rpm1', 'ω1');
    if (w1 === undefined) { if (o.v1 === undefined) throw new Error('falta ω1, f1, rpm1 o v1'); w1 = num(o.v1, 'v1') / r1; }
    const vEntra = w1 * r1, omega2 = vEntra / rE;
    return { omega1: w1, vEntra, omega2, vBloque: omega2 * rS, sentido2: union === 'faja' ? 1 : -1,
      errores: { bloqueRadioEquivocado: omega2 * rE, omegaIgualConFaja: w1 * rS, omegaDirecta: w1 * rE / r1 * rS } };
  }

  // ---------- Encuentros ----------
  function encuentroPista(o) {
    const angularV = o.omega1 !== undefined || o.omega2 !== undefined;
    let L, v1, v2, s0;
    if (angularV) {
      L = TAU; v1 = noNeg(o.omega1, 'ω1'); v2 = noNeg(o.omega2, 'ω2'); s0 = num(o.theta0 || 0, 'θ0') * PI / 180;
    } else {
      L = o.L !== undefined ? pos(o.L, 'largo de la pista') : TAU * pos(o.r, 'radio');
      v1 = num(o.v1, 'v1'); v2 = num(o.v2, 'v2'); s0 = num(o.separacion || 0, 'separación');
    }
    if (v1 < 0 || v2 < 0) throw new Error('las rapideces no pueden ser negativas: el sentido va aparte');
    if (o.sentido !== 'mismo' && o.sentido !== 'contrario') throw new Error("sentido debe ser 'mismo' o 'contrario'");
    if (s0 < 0 || s0 >= L - EPS) throw new Error('la separación va de 0 a menos de una vuelta');
    const n = o.n === undefined ? 1 : num(o.n, 'n');
    if (!(Number.isInteger(n) && n >= 1)) throw new Error('n debe ser 1, 2, 3…');
    const mismo = o.sentido === 'mismo';
    const vRel = mismo ? Math.abs(v1 - v2) : v1 + v2;
    const brecha = mismo && v1 < v2 ? L - s0 : (s0 > EPS ? s0 : L);
    const mod = x => { const m = x % L; const y = m < 0 ? m + L : m; return Math.abs(y - L) < 1e-9 * L ? 0 : y; };
    const estado = t => {
      const a = mod(v1 * t), b = mod(s0 + (mismo ? 1 : -1) * v2 * t);
      return { t, a, b, separacion: mod(mismo ? s0 + (v2 - v1) * t : s0 - (v1 + v2) * t) };
    };
    const nunca = vRel < EPS;
    const t = nunca ? null : (brecha + (n - 1) * L) / vRel;
    const s1 = nunca ? null : v1 * t, s2 = nunca ? null : v2 * t, lugar = nunca ? null : mod(s1);
    const div = (a, b) => (b > EPS ? a / b : null);
    return { L, v1, v2, separacion: s0, sentido: o.sentido, n, vRel, brecha, nunca, t, periodo: nunca ? null : L / vRel,
      s1, s2, vueltas1: nunca ? null : s1 / L, vueltas2: nunca ? null : s2 / L, lugar, lugarGrados: nunca ? null : lugar / L * 360,
      estado,
      errores: {
        tConSuma: div(brecha, v1 + v2), tConResta: div(brecha, Math.abs(v1 - v2)),
        tSinSeparacion: div(n * L, vRel), tEnesimo: div(n * brecha, vRel),
        tVueltaDelRapido: div(L, Math.max(v1, v2)) } };
  }

  // Mínimo común múltiplo de dos periodos racionales: el menor t = n1·T1 = n2·T2 con n1, n2 enteros.
  function mcmPeriodos(T1, T2) {
    for (let n1 = 1; n1 <= 100000; n1++) {
      const n2 = n1 * T1 / T2, k = Math.round(n2);
      if (k >= 1 && Math.abs(n2 - k) < 1e-9 * Math.max(1, n2)) return { t: n1 * T1, n1, n2: k };
    }
    throw new Error('los periodos no tienen un múltiplo común razonable (¿son racionales?)');
  }
  function reencuentroSalida(o) {
    const T1 = pos(o.periodo1, 'periodo 1'), T2 = pos(o.periodo2, 'periodo 2'), sentido = o.sentido || 'mismo';
    if (sentido !== 'mismo' && sentido !== 'contrario') throw new Error("sentido debe ser 'mismo' o 'contrario'");
    const m = mcmPeriodos(T1, T2), mismo = sentido === 'mismo';
    const iguales = Math.abs(T1 - T2) < EPS;
    const tEncuentro = mismo ? (iguales ? null : T1 * T2 / Math.abs(T2 - T1)) : T1 * T2 / (T1 + T2);
    // Encuentros en (0, t]: la diferencia (o la suma) de vueltas, que es entera en t.
    const encuentros = iguales && mismo ? null : Math.round(mismo ? Math.abs(m.n1 - m.n2) : m.n1 + m.n2);
    const errores = { primerEncuentro: tEncuentro, producto: T1 * T2, periodoRapido: Math.min(T1, T2) };
    if (mismo) errores.conSuma = T1 * T2 / (T1 + T2); else errores.conResta = iguales ? null : T1 * T2 / Math.abs(T2 - T1);
    return { periodo1: T1, periodo2: T2, sentido, t: m.t, vueltas1: m.n1, vueltas2: m.n2, tEncuentro, encuentros,
      omega1: TAU / T1, omega2: TAU / T2, errores };
  }

  // ---------- La bala que atraviesa ----------
  function atraviesa(o) {
    const L = pos(o.L, 'distancia'), v = pos(o.v, 'rapidez de la bala'), modo = o.modo || 'cascaron';
    const n = o.n === undefined ? 0 : num(o.n, 'n');
    if (!(Number.isInteger(n) && n >= 0)) throw new Error('n debe ser 0, 1, 2…');
    const t = L / v;
    let angulo, entera;
    if (modo === 'cascaron') { angulo = PI * (2 * n + 1); entera = TAU * (n + 1); }
    else if (modo === 'discos') {
      const d = num(o.desfase, 'desfase');
      if (!(d > 0 && d <= 360)) throw new Error('el desfase va de más de 0° a 360°');
      angulo = rad(d) + TAU * n; entera = rad(d) + TAU * (n + 1);
    } else throw new Error("modo debe ser 'cascaron' o 'discos'");
    const omega = angulo / t;
    return { t, angulo, omega, omegaPi: omega / PI, f: omega / TAU,
      errores: { vueltaEntera: entera / t, omegaComoVueltas: omega / TAU, cuartoDeVuelta: modo === 'cascaron' ? PI / 2 / t : null,
        gradosSinRadianes: grados(angulo) / t, diametroPorRadio: angulo / (2 * t), msSinConvertir: angulo / (t * 1000) } };
  }

  // ---------- El n-ésimo segundo ----------
  function enesimoSegundo(o) {
    const n = num(o.n, 'n');
    if (!(Number.isInteger(n) && n >= 1)) throw new Error('n debe ser 1, 2, 3…');
    const w0 = angular(o, 'omega0', 'f0', 'rpm0', 'ω0') || 0;
    let al;
    if (o.alfa !== undefined && o.theta1 !== undefined) throw new Error('da α o lo girado en el primer segundo, no los dos');
    if (o.alfa !== undefined) al = num(o.alfa, 'α');
    else if (o.theta1 !== undefined) al = 2 * (num(o.theta1, 'θ del primer segundo') - w0);
    else throw new Error('falta α o lo girado en el primer segundo');
    const th = t => w0 * t + al * t * t / 2;
    const segundos = []; for (let k = 1; k <= n; k++) segundos.push(th(k) - th(k - 1));
    const thetaN = segundos[n - 1], theta1 = segundos[0], thetaHasta = th(n);
    return { alfa: al, omega0: w0, n, thetaN, vueltasN: thetaN / TAU, theta1, thetaHasta, vueltasHasta: thetaHasta / TAU, segundos,
      razon: theta1 ? thetaN / theta1 : null,
      errores: { razonN: n, razonCuadrado: n * n, thetaHasta, razonHasta: theta1 ? thetaHasta / theta1 : null, razonUno: 1 } };
  }

  // ---------- Ecuación horaria θ(t) = θ0 + ω0·t + ½·α·t² ----------
  function horaria(o) {
    let th0, w0, al, c = null;
    if (o.coef !== undefined) {
      if (!Array.isArray(o.coef) || o.coef.length !== 3) throw new Error('coef = [a, b, c] de θ = a + b·t + c·t²');
      [th0, w0, c] = o.coef.map((x, k) => num(x, `coeficiente ${k}`)); al = 2 * c;
    } else { th0 = num(o.theta0 || 0, 'θ0'); w0 = num(o.omega0 || 0, 'ω0'); al = num(o.alfa || 0, 'α'); }
    const theta = t => th0 + w0 * t + al * t * t / 2, omega = t => w0 + al * t;
    const tParada = al !== 0 && -w0 / al > EPS ? -w0 / al : null;
    const res = { theta0: th0, omega0: w0, alfa: al, tParada, thetaParada: tParada === null ? null : theta(tParada), theta, omega };
    const errores = { coeficienteComoAlfa: c === null ? al / 2 : c, coeficienteSinSigno: -al, linealComoAlfa: w0 };
    if (o.t1 !== undefined || o.t2 !== undefined) {
      const t1 = noNeg(o.t1, 't1'), t2 = num(o.t2, 't2');
      if (!(t2 > t1)) throw new Error('t2 debe ser mayor que t1');
      const neto = theta(t2) - theta(t1);
      const recorrido = tParada !== null && tParada > t1 && tParada < t2
        ? Math.abs(theta(tParada) - theta(t1)) + Math.abs(theta(t2) - theta(tParada)) : Math.abs(neto);
      Object.assign(res, { t1, t2, neto: limpio(neto), recorrido });
      Object.assign(errores, { posicionPorGiro: theta(t2), netoPorRecorrido: Math.abs(neto) });
    }
    if (o.t !== undefined) {
      const t = noNeg(o.t, 'tiempo');
      Object.assign(res, { t, thetaT: theta(t), omegaT: omega(t) });
      if (o.r !== undefined) { const r = pos(o.r, 'radio'), at = al * r, acp = omega(t) ** 2 * r; Object.assign(res, { r, at, acp, a: Math.hypot(at, acp), v: omega(t) * r }); }
    }
    res.errores = errores;
    return res;
  }

  // ---------- Gráfica ω-t de tramos rectos ----------
  function grafica(o) {
    const P = o.puntos;
    if (!Array.isArray(P) || P.length < 2) throw new Error('hacen falta al menos dos puntos [t, ω]');
    const pts = P.map(([t, w], k) => [num(t, `t del punto ${k + 1}`), num(w, `ω del punto ${k + 1}`)]);
    for (let k = 1; k < pts.length; k++) if (!(pts[k][0] > pts[k - 1][0])) throw new Error('los tiempos deben crecer');
    const t1 = o.t1 === undefined ? pts[0][0] : num(o.t1, 't1'), t2 = o.t2 === undefined ? pts[pts.length - 1][0] : num(o.t2, 't2');
    if (!(t2 > t1) || t1 < pts[0][0] - EPS || t2 > pts[pts.length - 1][0] + EPS) throw new Error('el intervalo debe estar dentro de la gráfica');
    const omega = t => { for (let k = 1; k < pts.length; k++) if (t <= pts[k][0] + EPS) { const [a, wa] = pts[k - 1], [b, wb] = pts[k]; return wa + (wb - wa) * (t - a) / (b - a); } return pts[pts.length - 1][1]; };
    // Cortes: los vértices dentro del intervalo y los cruces con el eje.
    const cortes = [t1];
    for (let k = 0; k < pts.length; k++) if (pts[k][0] > t1 + EPS && pts[k][0] < t2 - EPS) cortes.push(pts[k][0]);
    cortes.push(t2); cortes.sort((a, b) => a - b);
    const ceros = [];
    let neto = 0, recorrido = 0;
    for (let k = 1; k < cortes.length; k++) {
      const a = cortes[k - 1], b = cortes[k], wa = omega(a), wb = omega(b);
      if (wa * wb < 0) { const z = a + (b - a) * wa / (wa - wb); ceros.push(z); neto += wa * (z - a) / 2 + wb * (b - z) / 2; recorrido += Math.abs(wa) * (z - a) / 2 + Math.abs(wb) * (b - z) / 2; }
      else { const ar = (wa + wb) * (b - a) / 2; neto += ar; recorrido += Math.abs(ar); }
    }
    const pendientes = []; for (let k = 1; k < pts.length; k++) pendientes.push((pts[k][1] - pts[k - 1][1]) / (pts[k][0] - pts[k - 1][0]));
    return { t1, t2, neto: limpio(neto), recorrido, vueltasNetas: limpio(neto) / TAU, vueltasRecorridas: recorrido / TAU, ceros, pendientes, omega,
      errores: { netoPorRecorrido: Math.abs(neto), pendiente: Math.abs(pendientes[0]), leeEje: Math.abs(omega(t2)), leeEjeInicial: Math.abs(omega(t1)) } };
  }

  // Dos móviles que salen juntos del mismo punto, cada uno con su ω0 y su α: cuándo van igual de rápido y qué tan separados.
  function dosMoviles(o) {
    const a = { w: num(o.omega01 || 0, 'ω01'), al: num(o.alfa1 || 0, 'α1') }, b = { w: num(o.omega02 || 0, 'ω02'), al: num(o.alfa2 || 0, 'α2') };
    if (a.al === b.al) throw new Error(a.w === b.w ? 'van igual todo el tiempo' : 'con la misma α nunca van igual de rápido');
    const t = (b.w - a.w) / (a.al - b.al);
    if (!(t > EPS)) throw new Error('no llegan a ir igual de rápido después de salir');
    const th = (m, tt) => m.w * tt + m.al * tt * tt / 2;
    const theta1 = th(a, t), theta2 = th(b, t);
    return { tIgual: t, omega: a.w + a.al * t, theta1, theta2, separacion: Math.abs(theta1 - theta2),
      errores: { areaDeUno: Math.max(Math.abs(theta1), Math.abs(theta2)), areaDelOtro: Math.min(Math.abs(theta1), Math.abs(theta2)), sumaAreas: Math.abs(theta1) + Math.abs(theta2), cero: 0 } };
  }

  // ---------- Poleas y reducciones ----------
  function poleaMovil(o) {
    const v1 = num(o.v1, 'v1'), v2 = num(o.v2, 'v2');
    const res = { v1, v2, vBloque: (v1 + v2) / 2,
      errores: { unaCuerda1: v1, unaCuerda2: v2, suma: v1 + v2, diferencia: Math.abs(v1 - v2) } };
    if (o.r !== undefined) res.omega = (v1 - v2) / (2 * pos(o.r, 'radio de la polea'));
    return res;
  }
  function transmisionMCUV(o) {
    const r1 = pos(o.r1, 'radio 1'), r2 = pos(o.r2, 'radio 2'), al1 = num(o.alfa1, 'α1');
    if (!TIPOS.includes(o.tipo)) throw new Error("tipo debe ser 'faja', 'cruzada', 'engranaje' o 'eje'");
    const eje = o.tipo === 'eje', alfa2 = eje ? al1 : al1 * r1 / r2;
    return { alfa1: al1, alfa2, at1: al1 * r1, at2: alfa2 * r2,
      errores: { alfaIgualConFaja: al1, alfaDirecta: al1 * r2 / r1, alfaCuadrado: al1 * (r1 / r2) ** 2, atIgualEnEje: al1 * r1 / r2 } };
  }

  // ---------- Rodadura: centro instantáneo en el punto de apoyo ----------
  function rodadura(o) {
    const r = pos(o.r, 'radio'), v = pos(o.v, 'rapidez del centro');
    const rA = o.rApoyo === undefined ? r : pos(o.rApoyo, 'radio de apoyo');
    const w = v / rA;   // gira en sentido horario si avanza hacia +x
    // Punto del borde a ang grados medidos desde lo más alto, hacia adelante (+x). Posición respecto al centro: (sen, cos)·r.
    const punto = ang => { const { sen, cos } = trig(ang, o.exacto), x = limpio(r * sen), y = limpio(r * cos);
      const vx = v + w * y, vy = -w * x, d = Math.hypot(x, y + rA);
      return { x, y, vx: limpio(vx), vy: limpio(vy), modulo: limpio(Math.hypot(vx, vy)), distanciaApoyo: limpio(d) }; };
    const res = { r, rApoyo: rA, v, omega: w, arriba: punto(0), adelante: punto(90), abajo: punto(180), centro: v,
      errores: { todosAv: v, triple: 3 * v, arribaCero: 0, comoLateral: v * Math.SQRT2 } };
    if (o.angulo !== undefined) res.punto = punto(num(o.angulo, 'ángulo'));
    return res;
  }

  // ---------- Más giros con otro movimiento ----------
  // La gota sale del borde, a la altura del eje, con la velocidad del borde hacia arriba, y cae al mismo lugar.
  // Para que la reciba el mismo punto del borde, la rueda gira n vueltas mientras la gota vuela: ω·(2ωr/g) = 2πn.
  function gotaDeRueda(o) {
    const r = pos(o.r, 'radio'), g = o.g === undefined ? 10 : pos(o.g, 'g'), n = o.vueltas === undefined ? 1 : pos(o.vueltas, 'vueltas');
    const omega = Math.sqrt(PI * n * g / r), v = omega * r, t = 2 * v / g;
    return { r, g, vueltas: n, omega, v, t, altura: v * v / (2 * g),
      errores: { mediaVuelta: Math.sqrt(PI * n * g / (2 * r)), soloSubida: Math.sqrt(2 * PI * n * g / r), conDiametro: Math.sqrt(PI * n * g / (2 * r)),
        unRadian: Math.sqrt(n * g / (2 * r)) } };
  }
  // Una bolita gira con un disco liso a la distancia d del centro, sujeta por un hilo; se corta el hilo y sigue recta.
  function despegaDelDisco(o) {
    const R = pos(o.R, 'radio del disco'), d = pos(o.d, 'distancia al centro'), w = pos(o.omega, 'ω');
    if (!(d < R)) throw new Error('la bolita tiene que estar dentro del disco');
    const v = w * d, camino = Math.sqrt(R * R - d * d), t = camino / v;
    return { R, d, omega: w, v, camino, t, anguloSalida: grados(Math.acos(d / R)), giroDisco: grados(w * t),
      errores: { haciaAfuera: 0, aNoventa: 90, sigueCurvando: null } };
  }

  return { TAU, NOTABLES, trig, convertir, mcu, mcuv, mcuvDatos, mcuvTramos, entre, aceleracionTotal, desdeReposo, razonDesdeReposo,
    vectorial, deltaV, rigido, latitud, transmision, tren, poleaEscalonada, encuentroPista, reencuentroSalida, atraviesa,
    enesimoSegundo, horaria, grafica, dosMoviles, poleaMovil, transmisionMCUV, rodadura, gotaDeRueda, despegaDelDisco };
});
