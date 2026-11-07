/*
 * Motor de «La lámpara y la placa: fotones y efecto fotoeléctrico».
 *
 * Aquí vive toda la física de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el navegador
 * (window.MotorFisicaModerna) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Unidades: longitudes de onda λ en nm; frecuencias f en Hz; energías del fotón E, función trabajo φ y energía
 * cinética máxima Kmax en eV (y en J donde el nombre termina en J); voltajes V y potencial de frenado V₀ en V (V₀ es
 * la tensión de la pila al revés que deja la corriente en cero: V₀ = Kmax/e, el mismo número que Kmax en eV);
 * potencias P en W; corrientes I en A; fotones por segundo N en 1/s; temperaturas T en K; Δx en m y Δp en kg·m/s.
 *
 * Constantes de academia. Hay dos juegos y cada función recibe el que se use (por omisión, 'eV'):
 *   'eV' (el de la escena y de los problemas en eV): hc = 1240 eV·nm, c = 3 × 10⁸ m/s, e = 1,6 × 10⁻¹⁹ C.
 *        De ahí: h = hc/c = 4,1333… × 10⁻¹⁵ eV·s = 6,6133… × 10⁻³⁴ J·s.
 *   'SI' (problemas en joules): h = 6,6 × 10⁻³⁴ J·s, c = 3 × 10⁸ m/s, e = 1,6 × 10⁻¹⁹ C.
 *        De ahí: hc = 1237,5 eV·nm (por eso 300 nm dan 33/8 eV con este juego y 1240/300 eV con el otro).
 * Dentro de un juego todo es consistente: E en J = E en eV · e.
 * Otras: Wien λmax·T = 2,9 × 10⁻³ m·K; hidrógeno de Bohr En = −13,6/n² eV; incertidumbre Δx·Δp ≥ h/(4π).
 *
 *   constantes(juego)                 { h (J·s), hEv (eV·s), c (m/s), e (C), hc (eV·nm) }
 *   foton(lambda, juego)              fotón de λ nm: f (Hz), E (eV), EJ (J), region y nombre del color
 *   fotonDeFrecuencia(f, juego)       lo mismo desde f (Hz): λ (nm), E (eV), EJ (J)
 *   region(lambda)                    'ultravioleta' (λ < 380), 'visible' (380 a 750) o 'infrarrojo' (λ > 750) y el
 *                                     nombre del color visible: violeta < 450 ≤ azul < 495 ≤ verde < 570 ≤ amarillo
 *                                     < 590 ≤ naranja < 620 ≤ rojo ≤ 750
 *   fotoelectrico(lambda, phi, juego) E del fotón (eV y J), si emite (E > φ), Kmax (eV y J), V₀ (V), λ umbral
 *                                     λ₀ = hc/φ (nm) y frecuencia umbral f₀ = φ/h (Hz)
 *   fototubo(o)                       el tubo con su pila: o = { lambda (nm), phi (eV), P (W), V (V, + acelera hacia
 *                                     el colector, − frena), eta (electrones por fotón, 0,01 si se omite), juego }.
 *                                     Da E, emite, Kmax, V0, N = P/E (fotones/s), Isat = eta·e·N (A) y la corriente I
 *                                     (A) con el MODELO SIMPLE de la escena: cada electrón sale hacia el colector con
 *                                     una energía cinética repartida de modo uniforme entre 0 y Kmax. Entonces:
 *                                       sin emisión (E ≤ φ): I = 0 con cualquier P y cualquier V;
 *                                       V ≥ 0: llegan todos, I = Isat (saturación desde V = 0);
 *                                       −V₀ < V < 0: llegan los que salen con K > e·|V|, I = Isat·(1 − |V|/V₀);
 *                                       V ≤ −V₀: I = 0.
 *   curvaIV(o, Vmin, Vmax, n)         n + 1 puntos { V, I } del mismo modelo, para la gráfica
 *   cambioFototubo(o0, o1)            del tubo o0 al tubo o1: antes, despues (resultados de fototubo), razonIsat
 *                                     (Isat1/Isat0, null si Isat0 = 0), cambioV0 (V0 1 − V0 0) y los errores típicos
 *   emitir(E, phi, u)                 energía cinética (eV) de un electrón arrancado, u·(E − φ) con u entre 0 y 1;
 *                                     null si E ≤ φ. Para el dibujo (coincide con el modelo de fototubo)
 *   electron(K, V, t)                 un electrón que sale del cátodo con K (eV) entre placas a distancia 1 con la pila
 *                                     V (V): x(t) = √K·t + V·t²/4 (unidades del dibujo: x en fracciones de la
 *                                     distancia, t en unidades con ½m = 1, de modo que v² = K + V·x). Da x, v, llega
 *                                     (alcanza el colector), tLlega, xMax y tVuelve (si regresa al cátodo)
 *   avanzarElectron({ x, v }, V, dt)  un paso dt del mismo movimiento con la pila V de ese instante: x += v·dt + V·dt²/4,
 *                                     v += V·dt/2; llego (cruzó x = 1) y volvio (regresó a x = 0). Para el dibujo
 *   fotonesPorSegundo(P, lambda, juego)  N = P/(h·f) (1/s), con E (eV) y EJ (J)
 *   bohr(n)                           En = −13,6/n² (eV) del hidrógeno
 *   transicion(ni, nf, juego)         salto de ni a nf: ΔE = |En(nf) − En(ni)| (eV), λ = hc/ΔE (nm), f (Hz), si emite
 *                                     (ni > nf) o absorbe, la serie (Lyman nf = 1, Balmer nf = 2, Paschen nf = 3) y la
 *                                     región del espectro
 *   rayosX(V, juego)                  tubo de rayos X con V voltios: Emax = e·V (eV y J), λmin = hc/(eV) (nm), fmax (Hz)
 *   cambioRayosX(V0, V1, juego)       λmin antes y después de cambiar el voltaje del tubo
 *   espectroRayosX(V, lambda)         intensidad relativa del espectro continuo (modelo de Kramers por unidad de λ,
 *                                     (1/λmin − 1/λ)/λ², normalizado a 1 en su máximo; 0 bajo λmin). Solo para el
 *                                     dibujo: sin las líneas características del blanco
 *   cambioLambda(l0, l1, phi, juego)  Kmax con λ0 y con λ1 (eV), para «la mitad de la longitud de onda»
 *   rectaKf(f1, K1, f2, K2)           recta Kmax(f) por dos puntos: pendiente h (eV·s), φ (eV) = −corte en f = 0 y f₀ (Hz)
 *   wien(T)                           λmax = 2,9 × 10⁻³/T (m y nm)
 *   incertidumbre(dx, juego)          Δp mínimo = h/(4π·Δx) (kg·m/s)
 *   colorLuz(lambda)                  color aproximado de la luz visible { r, g, b } (0 a 255) o null fuera de 380 a
 *                                     750 nm. Solo para el dibujo: no es un color de variable
 *   azar(semilla)                     números al azar con semilla
 *
 * Cada resultado que alimenta una predicción trae un campo 'errores' con lo que da cada error típico (FM1 a FM4 de
 * docs/investigacion/electromagnetismo-moderna-ideas-erroneas.md; los demás son hipótesis nuestras):
 *   fotoelectrico.errores (en eV y V):
 *     sinRestarPhi  Kmax = E (olvidar la función trabajo): { Kmax: E, V0: E }.
 *     sumaPhi       Kmax = E + φ: { Kmax, V0 }.
 *     mezclaJeV     Kmax bien en eV, pero V₀ igual al número de Kmax en joules: { Kmax, V0: Kmax·e }.
 *   cambioFototubo.errores (cada uno es lo que espera quien comete el error, con los nombres de fototubo):
 *     intensidadEsEnergia  FM2: la energía de cada fotón crece con la intensidad, E' = E·P1/P0: { E, emite, V0, Isat }
 *                          con Isat la de antes (más energía, no más electrones; si antes no salía ninguno, la de un electrón por cada
 *                          eta fotones de antes); I es lo que daría con la pila V1 y hayCorriente si I > 0.
 *     intensidadSubeV0     FM2 (más intensidad, electrones más rápidos): V₀ crece con P, V0' = V0·P1/P0, y la
 *                          corriente de saturación crece como debe: { V0, Isat }.
 *     corrientePorRapidez  FM4: la corriente va con la rapidez de los electrones; como la rapidez no cambia, tampoco la
 *                          corriente: { V0: V0 de antes, Isat: Isat de antes }.
 *     pilaArranca          FM1: la pila hace pasar corriente aunque la luz no arranque electrones: { hayCorriente:
 *                          true } si V1 > 0.
 *     pilaVencePhi         FM1 (la pila «ayuda a vencer la función trabajo»): la pila pone los eV que le faltan a
 *                          cada fotón, así que hay corriente desde V1 ≥ (φ − E)/e: { hayCorriente, Vminimo: φ − E }.
 *     pilaFrena            la pila a favor frena a los electrones: { hayCorriente: false } (hipótesis).
 *     conPilaSiSube        FM1 en el paso 1: «cero, pero con más voltaje sí»: { hayCorriente: false, conMasVoltaje:
 *                          true }.
 *   fotonesPorSegundo.errores (1/s): porCargaE = P/e (cada fotón como si trajera 1 eV); enEv = P/E con E en eV (mezclar
 *     J y eV); multiplica = P·E con E en J.
 *   transicion.errores (cada uno { E (eV), lambda (nm), region, color }):
 *     unoSobreN     En = −13,6/n (1/n en vez de 1/n²).
 *     unNivel       la energía de un solo nivel, |En(ni)|, en vez de la diferencia.
 *     sumaNiveles   |En(ni)| + |En(nf)| (sumar en vez de restar).
 *   rayosX.errores (λ en nm): sinKilo = hc/V con V en kV como si fueran voltios (hc en eV·nm); sinE = h·c/V con h en
 *     J·s y sin la carga e (sale en nm); joulesConEv = hc (eV·nm) entre e·V en joules.
 *   cambioRayosX.errores (nm): proporcional = λmin0·V1/V0 (más voltaje, λ más larga); igual = λmin0 (el voltaje solo
 *     cambia cuántos rayos salen); cuadrado = λmin0·(V0/V1)².
 *   cambioLambda.errores (eV): doble = Kmax0·λ0/λ1 (Kmax proporcional a la frecuencia, sin la φ fija); alReves =
 *     E0·λ1/λ0 − φ (E proporcional a λ: λ y f al revés), 0 si sale negativo; sinPhi = E1.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorFisicaModerna = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const C = 3e8, E_CARGA = 1.6e-19, HC_EV_NM = 1240, H_SI = 6.6e-34, WIEN = 2.9e-3, RYD = 13.6, ETA = 0.01;

  function numero(x, que) {
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que} debe ser un número`);
    return x;
  }
  function positivo(x, que) {
    numero(x, que);
    if (!(x > 0)) throw new Error(`${que} debe ser mayor que cero`);
    return x;
  }
  function noNegativo(x, que) {
    numero(x, que);
    if (x < 0) throw new Error(`${que} no puede ser negativo`);
    return x;
  }
  function entero(n, que) {
    if (!Number.isInteger(n) || n < 1) throw new Error(`${que} debe ser un entero mayor o igual que 1`);
    return n;
  }
  // Redondea a 12 cifras significativas (4,000000000000001 → 4) para mostrar y comparar.
  const limpio = x => (x === 0 ? 0 : Number(x.toPrecision(12)) + 0);

  // ---------- Constantes ----------
  function constantes(juego) {
    const j = juego === undefined ? 'eV' : juego;
    if (j === 'eV') { const hEv = HC_EV_NM * 1e-9 / C; return { juego: j, h: hEv * E_CARGA, hEv, c: C, e: E_CARGA, hc: HC_EV_NM }; }
    if (j === 'SI') return { juego: j, h: H_SI, hEv: H_SI / E_CARGA, c: C, e: E_CARGA, hc: H_SI * C / E_CARGA * 1e9 };
    throw new Error("el juego de constantes debe ser 'eV' o 'SI'");
  }

  // ---------- Región del espectro ----------
  function region(lambda) {
    positivo(lambda, 'la longitud de onda λ');
    if (lambda < 380) return { region: 'ultravioleta', color: null, visible: false };
    if (lambda > 750) return { region: 'infrarrojo', color: null, visible: false };
    const color = lambda < 450 ? 'violeta' : lambda < 495 ? 'azul' : lambda < 570 ? 'verde' : lambda < 590 ? 'amarillo' : lambda < 620 ? 'naranja' : 'rojo';
    return { region: 'visible', color, visible: true };
  }

  // ---------- Fotón ----------
  function foton(lambda, juego) {
    positivo(lambda, 'la longitud de onda λ');
    const k = constantes(juego), E = k.hc / lambda;
    return Object.assign({ lambda: limpio(lambda), f: limpio(k.c / (lambda * 1e-9)), E: limpio(E), EJ: limpio(E * k.e) }, region(lambda));
  }
  function fotonDeFrecuencia(f, juego) {
    positivo(f, 'la frecuencia f');
    const k = constantes(juego);
    return foton(k.c / f * 1e9, juego);
  }

  // ---------- Efecto fotoeléctrico ----------
  function fotoelectrico(lambda, phi, juego) {
    positivo(lambda, 'la longitud de onda λ'); positivo(phi, 'la función trabajo φ');
    const k = constantes(juego), F = foton(lambda, juego), E = F.E, emite = E > phi;
    const K = emite ? E - phi : 0;
    return {
      E, EJ: F.EJ, f: F.f, emite, Kmax: limpio(K), KmaxJ: limpio(K * k.e), V0: limpio(K),
      lambda0: limpio(k.hc / phi), f0: limpio(phi / k.hEv), phi,
      errores: {
        sinRestarPhi: { Kmax: E, V0: E },
        sumaPhi: { Kmax: limpio(E + phi), V0: limpio(E + phi) },
        mezclaJeV: { Kmax: limpio(K), V0: limpio(K * k.e) },
      },
    };
  }

  // ---------- El fototubo con su pila (modelo simple de la escena) ----------
  function fraccionQueLlega(V, Kmax) {
    if (V >= 0) return 1;
    if (!(Kmax > 0)) return 0;
    return Math.max(0, 1 + V / Kmax);
  }
  function fototubo(o) {
    if (!o || typeof o !== 'object') throw new Error('falta el tubo { lambda, phi, P, V }');
    positivo(o.lambda, 'la longitud de onda λ'); positivo(o.phi, 'la función trabajo φ'); noNegativo(o.P, 'la potencia P');
    const V = o.V === undefined ? 0 : numero(o.V, 'el voltaje V');
    const eta = o.eta === undefined ? ETA : positivo(o.eta, 'la eficiencia');
    const k = constantes(o.juego), fe = fotoelectrico(o.lambda, o.phi, o.juego);
    const N = o.P / fe.EJ, Isat = fe.emite ? eta * k.e * N : 0, fr = fe.emite ? fraccionQueLlega(V, fe.Kmax) : 0;
    return { E: fe.E, emite: fe.emite, Kmax: fe.Kmax, V0: fe.V0, N: limpio(N), Isat: limpio(Isat), fraccion: limpio(fr), I: limpio(Isat * fr), V };
  }
  function curvaIV(o, Vmin, Vmax, n) {
    numero(Vmin, 'Vmin'); numero(Vmax, 'Vmax'); const m = n || 120, pts = [];
    for (let j = 0; j <= m; j++) { const V = Vmin + (Vmax - Vmin) * j / m; pts.push({ V: limpio(V), I: fototubo(Object.assign({}, o, { V })).I }); }
    return pts;
  }
  function cambioFototubo(o0, o1) {
    const a = fototubo(o0), b = fototubo(o1), kP = o0.P > 0 ? o1.P / o0.P : 1;
    const E2 = a.E * kP, emite2 = E2 > o1.phi, V02 = emite2 ? limpio(E2 - o1.phi) : 0;
    const V1 = b.V;
    const eta = o0.eta === undefined ? ETA : o0.eta, IsatE = emite2 ? (a.Isat > 0 ? a.Isat : limpio(eta * E_CARGA * a.N)) : 0;
    const Iener = IsatE * fraccionQueLlega(V1, V02);
    return {
      antes: a, despues: b, razonIsat: a.Isat > 0 ? limpio(b.Isat / a.Isat) : null, cambioV0: limpio(b.V0 - a.V0),
      errores: {
        intensidadEsEnergia: { E: limpio(E2), emite: emite2, V0: V02, Isat: IsatE, I: limpio(Iener), hayCorriente: Iener > 0 },
        intensidadSubeV0: { V0: limpio(a.V0 * kP), Isat: b.Isat },
        corrientePorRapidez: { V0: a.V0, Isat: a.Isat },
        pilaArranca: { hayCorriente: V1 > 0 },
        pilaVencePhi: { hayCorriente: V1 >= Math.max(0, o1.phi - b.E), Vminimo: limpio(Math.max(0, o1.phi - b.E)) },
        pilaFrena: { hayCorriente: false },
        conPilaSiSube: { hayCorriente: false, conMasVoltaje: true },
      },
    };
  }

  // ---------- Electrones entre las placas (para el dibujo) ----------
  function emitir(E, phi, u) {
    numero(E, 'la energía E'); positivo(phi, 'la función trabajo φ'); numero(u, 'u');
    if (u < 0 || u > 1) throw new Error('u debe estar entre 0 y 1');
    return E > phi ? limpio(u * (E - phi)) : null;
  }
  function electron(K, V, t) {
    noNegativo(K, 'la energía cinética K'); numero(V, 'el voltaje V'); noNegativo(t, 'el tiempo t');
    const s = Math.sqrt(K);
    let tLlega = null, xMax = null, tVuelve = null;
    if (K + V >= 0 && (K > 0 || V > 0)) tLlega = V === 0 ? 1 / s : (-s + Math.sqrt(K + V)) / (V / 2);
    if (V < 0 && K + V < 0) { xMax = K / -V; tVuelve = 4 * s / -V; }
    let x = s * t + V * t * t / 4;
    if (tLlega !== null && t >= tLlega) x = 1;
    if (tVuelve !== null && t >= tVuelve) x = 0;
    x = Math.max(0, x);
    const v = s + V * t / 2;
    return { x: limpio(x), v: limpio(v), llega: tLlega !== null, tLlega: tLlega === null ? null : limpio(tLlega),
      xMax: xMax === null ? null : limpio(xMax), tVuelve: tVuelve === null ? null : limpio(tVuelve) };
  }

  // Un paso del mismo movimiento con la pila V de ese momento (si el deslizador cambia V con el electrón en vuelo):
  // x += v·dt + V·dt²/4 y v += V·dt/2. 'llego' si cruza x = 1; 'volvio' si regresa a x = 0.
  function avanzarElectron(est, V, dt) {
    numero(est && est.x, 'la posición x'); numero(est.v, 'la rapidez v'); numero(V, 'el voltaje V'); noNegativo(dt, 'el paso dt');
    const x = est.x + est.v * dt + V * dt * dt / 4, v = est.v + V * dt / 2;
    return { x: Math.min(1, Math.max(0, x)), v, llego: x >= 1, volvio: x <= 0 && dt > 0 };
  }

  // ---------- Fotones por segundo ----------
  function fotonesPorSegundo(P, lambda, juego) {
    positivo(P, 'la potencia P');
    const k = constantes(juego), F = foton(lambda, juego);
    return { N: limpio(P / F.EJ), E: F.E, EJ: F.EJ,
      errores: { porCargaE: limpio(P / k.e), enEv: limpio(P / F.E), multiplica: limpio(P * F.EJ) } };
  }

  // ---------- Hidrógeno de Bohr ----------
  function bohr(n) { entero(n, 'el nivel n'); return limpio(-RYD / (n * n)); }
  function lectura(E, k) {
    const l = k.hc / E;
    return Object.assign({ E: limpio(E), lambda: limpio(l) }, region(l));
  }
  function transicion(ni, nf, juego) {
    entero(ni, 'el nivel inicial'); entero(nf, 'el nivel final');
    if (ni === nf) throw new Error('los niveles deben ser distintos');
    const k = constantes(juego), Ei = bohr(ni), Ef = bohr(nf), dE = Math.abs(Ef - Ei);
    const bajo = Math.min(ni, nf);
    const serie = bajo === 1 ? 'Lyman' : bajo === 2 ? 'Balmer' : bajo === 3 ? 'Paschen' : null;
    return Object.assign(lectura(dE, k), {
      Ei, Ef, f: limpio(dE / k.hEv), emite: ni > nf, serie,
      errores: {
        unoSobreN: lectura(Math.abs(RYD / nf - RYD / ni), k),
        unNivel: lectura(Math.abs(Ei), k),
        sumaNiveles: lectura(Math.abs(Ei) + Math.abs(Ef), k),
      },
    });
  }

  // ---------- Rayos X ----------
  function rayosX(V, juego) {
    positivo(V, 'el voltaje V');
    const k = constantes(juego), l = k.hc / V;
    return { Emax: limpio(V), EmaxJ: limpio(V * k.e), lambdaMin: limpio(l), fMax: limpio(V / k.hEv),
      errores: { sinKilo: limpio(k.hc / (V / 1000)), sinE: limpio(k.h * k.c / V * 1e9), joulesConEv: limpio(k.hc / (V * k.e)) } };
  }
  function cambioRayosX(V0, V1, juego) {
    const a = rayosX(V0, juego), b = rayosX(V1, juego);
    return { lambdaMin0: a.lambdaMin, lambdaMin1: b.lambdaMin, razon: limpio(b.lambdaMin / a.lambdaMin),
      errores: { proporcional: limpio(a.lambdaMin * V1 / V0), igual: a.lambdaMin, cuadrado: limpio(a.lambdaMin * (V0 / V1) ** 2) } };
  }
  function espectroRayosX(V, lambda) {
    const lm = rayosX(V).lambdaMin; positivo(lambda, 'la longitud de onda λ');
    if (lambda <= lm) return 0;
    const g = l => (1 / lm - 1 / l) / (l * l);
    return limpio(g(lambda) / g(1.5 * lm));   // el máximo de (1/a − 1/l)/l² está en l = 1,5·a
  }

  // ---------- Otras ----------
  function cambioLambda(l0, l1, phi, juego) {
    const a = fotoelectrico(l0, phi, juego), b = fotoelectrico(l1, phi, juego);
    return { Kmax0: a.Kmax, Kmax1: b.Kmax, E0: a.E, E1: b.E, emite0: a.emite, emite1: b.emite,
      errores: { doble: limpio(a.Kmax * l0 / l1), alReves: limpio(Math.max(0, a.E * l1 / l0 - phi)), sinPhi: b.E } };
  }
  function rectaKf(f1, K1, f2, K2) {
    positivo(f1, 'f1'); positivo(f2, 'f2'); numero(K1, 'K1'); numero(K2, 'K2');
    if (f1 === f2) throw new Error('las dos frecuencias deben ser distintas');
    const h = (K2 - K1) / (f2 - f1), phi = h * f1 - K1;
    return { h: limpio(h), phi: limpio(phi), f0: limpio(phi / h), corteK: limpio(-phi) };
  }
  function wien(T) { positivo(T, 'la temperatura T'); const l = WIEN / T; return { lambdaMax: limpio(l), lambdaMaxNm: limpio(l * 1e9) }; }
  function incertidumbre(dx, juego) {
    positivo(dx, 'la incertidumbre Δx'); const k = constantes(juego);
    return { dpMin: limpio(k.h / (4 * Math.PI * dx)) };
  }
  // Color aproximado de la luz visible (aproximación por tramos conocida; solo para pintar el haz).
  function colorLuz(lambda) {
    numero(lambda, 'la longitud de onda λ');
    if (lambda < 380 || lambda > 750) return null;
    let r = 0, g = 0, b = 0;
    if (lambda < 440) { r = (440 - lambda) / 60; b = 1; }
    else if (lambda < 490) { g = (lambda - 440) / 50; b = 1; }
    else if (lambda < 510) { g = 1; b = (510 - lambda) / 20; }
    else if (lambda < 580) { r = (lambda - 510) / 70; g = 1; }
    else if (lambda < 645) { r = 1; g = (645 - lambda) / 65; }
    else r = 1;
    const f = lambda < 420 ? 0.3 + 0.7 * (lambda - 380) / 40 : lambda > 700 ? 0.3 + 0.7 * (750 - lambda) / 50 : 1;
    const q = x => Math.round(255 * Math.pow(x * f, 0.8));
    return { r: q(r), g: q(g), b: q(b) };
  }

  function azar(sem) { let s = (sem >>> 0) || 1; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; }

  return {
    C, E_CARGA, HC_EV_NM, H_SI, WIEN, RYD, ETA,
    constantes, region, foton, fotonDeFrecuencia, fotoelectrico, fototubo, curvaIV, cambioFototubo, emitir, electron, avanzarElectron,
    fotonesPorSegundo, bohr, transicion, rayosX, cambioRayosX, espectroRayosX, cambioLambda, rectaKf, wien,
    incertidumbre, colorLuz, azar,
  };
});
