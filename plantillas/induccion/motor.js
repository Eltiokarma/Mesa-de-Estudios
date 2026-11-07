/*
 * Motor de «El imán, la espira y el foquito: inducción electromagnética».
 *
 * Aquí vive toda la física de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorInduccion) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Unidades (todo en SI): campo magnético B en T, áreas A en m², largos L y distancias d en m, flujo Φ en Wb
 * (1 Wb = 1 T·m²), tiempos t y Δt en s, fem ε y voltajes V en V, corrientes I en A, resistencias R en Ω, fuerzas F
 * en N, potencias P en W, velocidades v en m/s, ω en rad/s, frecuencia f en Hz, ángulos en grados.
 * N es el número de vueltas (espiras) de una bobina, sin unidad.
 * Ángulo del flujo: θ es el ángulo entre B y la NORMAL a la espira (no el ángulo con el plano de la espira).
 * Cosenos y senos de academia exactos: cos 60° = 1/2, cos 37° = 4/5, cos 53° = 3/5, sen 30° = 1/2 (senGrados, cosGrados).
 *
 * Convención de la espira frente al imán: el imán está a un lado de la espira, sobre su eje. La normal de la espira
 * apunta desde el lado del imán hacia el otro lado (alejándose del imán). Φ > 0 si el campo cruza la espira
 * alejándose del imán (el polo N mira a la espira); Φ < 0 si cruza hacia el imán (el polo S mira a la espira).
 * Los sentidos de giro de la corriente se dan VISTOS DESDE EL IMÁN (mirando la espira desde el lado del imán).
 * Regla usada: un campo que apunta hacia quien mira lo crea una corriente que, vista por esa persona, gira en sentido
 * antihorario.
 *
 *   senGrados(t), cosGrados(t)         seno y coseno con los valores de academia exactos
 *   flujo(B, A, theta)                 Φ = B·A·cos θ (Wb), θ entre B y la normal (grados; 0 si se omite)
 *   flujoPlano(B, A, alfa)             Φ = B·A·sen α (Wb), con α el ángulo entre B y el PLANO de la espira
 *   faraday(N, Phi0, Phi1, dt, R)      ley de Faraday con el flujo por espira antes (Phi0) y después (Phi1), en Wb:
 *                                      ΔΦ por espira (Wb), NΔΦ (Wb), ε = −N·ΔΦ/Δt (V, con signo), |ε| (V) y, con R
 *                                      (Ω), I = |ε|/R (A). R = 'abierta' (o Infinity): espira cortada, I = 0
 *                                      y entre los extremos queda el voltaje |ε| (voltajeExtremos, V)
 *   faradayCampo(N, A, B0, B1, dt, R, theta)  lo mismo cuando cambia B de B0 a B1 (T) con el área y el ángulo fijos
 *   faradayArea(N, B, A0, A1, dt, R, theta)   lo mismo cuando cambia el área de A0 a A1 (m²) con B fijo
 *   faradayAngulo(N, B, A, t0, t1, dt, R)     lo mismo cuando la espira gira de θ0 = t0 a θ1 = t1 (grados)
 *   lenz(Phi0, Phi1)                   sentido de la corriente inducida (visto desde el imán: 'horario', 'antihorario'
 *                                      o 'ninguno'), del campo inducido en el centro ('hacia el imán', 'alejándose
 *                                      del imán' o 'ninguno'), si refuerza o se opone al campo del imán, qué cara de
 *                                      la espira mira al imán ('N' o 'S') y si la espira lo repele o lo atrae
 *   femMovimiento(B, L, v, R, o)       barra que se desliza sobre dos rieles: ε = B·L·v (V), I = ε/R (A), la fuerza
 *                                      magnética sobre la barra F = B·I·L (N, siempre contra v: la frena), la potencia
 *                                      mecánica P = F·v (W) y la eléctrica ε·I (W), iguales. Con o = { campo:
 *                                      'entra'|'sale', haciaDerecha }, el sentido de la corriente visto de frente
 *   barraEntre(B, L, x0, x1, dt, R)    la misma barra que pasa de x0 a x1 (m, distancia al extremo cerrado) en dt
 *                                      (s): Φ = B·L·x y ε = −ΔΦ/Δt (V); da v (m/s), I (A) y F (N). Para el arrastre
 *   flujoIman(d, o)                    flujo por espira (Wb) de un imán sobre el eje, con su polo a d metros del plano
 *                                      de la espira: modelo suave Φ = ±Φmax·(1 + (d/a)²)^(−3/2), o = { Phimax (Wb),
 *                                      a (m), polo: 'N'|'S' }. Solo para el dibujo y las gráficas: los números de las
 *                                      predicciones salen de los datos del enunciado
 *   dFlujoIman(d, o)                   dΦ/dd (Wb/m) del mismo modelo
 *   femIman(d, vd, o, N, R)            ε = −N·(dΦ/dd)·vd (V) con vd = dd/dt (m/s; negativa si el imán se acerca);
 *                                      con R, I (A)
 *   femEntre(d0, d1, dt, o, N, R)      ε = −N·(Φ(d1) − Φ(d0))/Δt (V) entre dos posiciones del imán: para el arrastre
 *   movimientoIman(t, mov)             posición d (m) y velocidad vd (m/s) del imán en el instante t (s): va de mov.d0
 *                                      a mov.d1 (m) entre mov.t0 y mov.t0 + mov.T (s), arrancando y frenando suave, y
 *                                      después se queda quieto
 *   serieIman(mov, o, N, R, tFin, n)   n + 1 puntos { t, d, Phi, fem, I } de 0 a tFin (s) para las gráficas Φ(t) y
 *                                      ε(t), con el instante tMax (s) en que |ε| es mayor, femMax (V) e IMax (A)
 *   cambioRapidez(mov, o, N, f)        el mismo recorrido f veces más rápido: el pico de |ε| se multiplica por f y
 *                                      el cambio de flujo ΔΦ es el mismo
 *   generador(N, B, A, omega)          espira que gira con ω (rad/s) en B uniforme: εmax = N·B·A·ω (V), valor eficaz
 *                                      εmax/√2 (V), f (Hz), periodo T (s); Φmax por espira = B·A (Wb)
 *   femGenerador(N, B, A, omega, t)    en el instante t (s): θ = ωt (grados), Φ = B·A·cos ωt por espira (Wb) y
 *                                      ε = N·B·A·ω·sen ωt (V)
 *   transformador(Np, Ns, Vp, Ip, o)   transformador ideal: Vs = Vp·Ns/Np (V), Is = Ip·Np/Ns (A), potencias (W)
 *                                      iguales. Con o = { continua: true } (una pila) el flujo del núcleo no cambia:
 *                                      Vs = 0 e Is = 0 (salvo el instante en que se conecta o se desconecta)
 *   campoIman(im, P), lineasIman(im, n, caja)  campo (sin unidades: solo su dirección) y líneas de un imán de barra
 *                                      en el plano del dibujo (modelo de dos polos; im = { x, y, largo, ang }, en m y
 *                                      grados, el norte hacia 'ang'). Solo para dibujar
 *   azar(semilla)                      números al azar con semilla, para las pruebas
 *
 * Cada resultado que alimenta una predicción trae un campo 'errores' con lo que da cada error típico (códigos de
 * docs/investigacion/electromagnetismo-moderna-ideas-erroneas.md: MG7 a MG10; los demás son hipótesis nuestras):
 *   flujo.errores: conSeno = B·A·sen θ (Wb): tomar θ como si fuera el ángulo con el plano.
 *   flujoPlano.errores: conCoseno = B·A·cos α en Wb: usar cos con el ángulo medido desde el plano.
 *   faraday.errores (todos en V salvo los que dicen A):
 *     sinN            olvidar las N vueltas: |ΔΦ|/Δt.
 *     conFlujoInicial MG10: poner el flujo en vez de su cambio: N·|Φ0|/Δt.
 *     conFlujoFinal   MG10: lo mismo con el flujo final: N·|Φ1|/Δt.
 *     sumaFlujos      restar mal (sumar los flujos): N·(|Φ0| + |Φ1|)/Δt.
 *     sinDt           no dividir entre Δt: N·|ΔΦ| (sale en Wb, no en V).
 *     IsinN           la corriente con la fem sin N: |ΔΦ|/(Δt·R), en A (si hay R).
 *     IporR           multiplicar en vez de dividir: |ε|·R, en A (si hay R).
 *     campoNoCambia   MG10: «el campo B no cambia, así que no hay fem» (0 V) cuando lo que cambia es el área o el
 *                     ángulo; vale 0 siempre: es la respuesta de quien solo mira B.
 *     corrienteIgual  con la espira cortada (R = 'abierta'): verdadero, marca el error «circula la misma corriente
 *                     que si estuviera cerrada».
 *   faradayAngulo.errores: además, anguloConPlano = el resultado tomando los ángulos como medidos desde el plano
 *     (con sen en vez de cos), en V.
 *   lenz.errores (cada uno es un objeto { sentido, campoInducido, cara, fuerza }):
 *     contraElCampo   MG9: el campo inducido siempre contra el campo del imán (y no contra el CAMBIO del flujo).
 *     alReves         MG8: el sentido contrario de la corriente (y con él, todo al revés).
 *     soloMovimiento  MG8: decidir solo por si el imán se acerca o se aleja, como si siempre mirara el polo N.
 *     soloPolo        MG8: decidir solo por el polo, como si el imán siempre se acercara.
 *     sinCorriente    «no circula corriente» (sentido 'ninguno').
 *   femMovimiento.errores: sinL = B·v (V, olvidar el largo); campoConstante = 0 (V; MG10: «B no cambia, así que no
 *     hay fem», sin ver que cambia el área); fuerzaAyuda = 'empuja' («la corriente inducida empuja la barra hacia
 *     adelante»); con R, FconV = B·v·L (N, usar v en lugar de I en F = B·I·L).
 *   generador.errores: eficazMitad = εmax/2 (V, dividir entre 2 en vez de √2); eficazPorRaiz = εmax·√2 (V,
 *     multiplicar en vez de dividir); sinN = B·A·ω (V); sinNEficaz = B·A·ω/√2 (V).
 *   transformador.errores: razonInvertida = { Vs: Vp·Np/Ns, Is: Ip·Ns/Np }; corrienteComoVoltaje = { Vs, Is:
 *     Ip·Ns/Np } (la corriente cambia en la misma razón que el voltaje); sinCambio = { Vs: Vp, Is: Ip };
 *     continuaPasa = { Vs: Vp·Ns/Np, Is: Ip·Np/Ns } (creer que con una pila funciona igual: sale de MG7).
 *   cambioRapidez.errores: picoIgual = femMax0 (V, «el mismo pico, solo dura menos»); picoCuadrado = femMax0·f²
 *     (V); dPhiCambia = ΔΦ·f (Wb, «también cambia más el flujo»).
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorInduccion = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const GRADOS = 180 / Math.PI;
  const RAIZ2 = Math.SQRT2;
  // Imán de la escena (modelo del dibujo): Φmax = 2 × 10⁻⁴ Wb por espira con el polo pegado a la espira, a = 3 cm.
  // Con una bobina de 2 cm de radio (A ≈ 1,3 × 10⁻³ m²) equivale a unos 0,15 T en el centro: un imán de cerámica.
  const IMAN = { Phimax: 2e-4, a: 0.03, polo: 'N' };

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
  // Redondea a 12 cifras significativas (4,000000000000001 → 4) para mostrar y comparar.
  const limpio = x => (x === 0 ? 0 : Number(x.toPrecision(12)) + 0);
  const signo = x => (x > 0 ? 1 : x < 0 ? -1 : 0);

  // Senos de academia exactos (37° y 53° como 3/5 y 4/5); los demás ángulos, con Math.sin.
  const NOTABLES = { 0: 0, 30: 0.5, 37: 0.6, 53: 0.8, 60: Math.sqrt(3) / 2, 45: Math.SQRT1_2, 90: 1 };
  function senGrados(t) {
    numero(t, 'el ángulo');
    let a = ((t % 360) + 360) % 360, s = 1;
    if (a > 180) { a -= 180; s = -1; }
    if (a > 90) a = 180 - a;
    const n = NOTABLES[Math.round(a * 1e9) / 1e9];
    return n === undefined ? s * Math.sin(a / GRADOS) : s * n;
  }
  const cosGrados = t => senGrados(90 - t);

  // ---------- Flujo ----------
  function flujo(B, A, theta) {
    numero(B, 'el campo B'); noNegativo(A, 'el área A');
    const t = theta === undefined ? 0 : numero(theta, 'el ángulo θ');
    const c = cosGrados(t);
    return { Phi: limpio(B * A * c), cos: limpio(c), theta: t, errores: { conSeno: limpio(B * A * senGrados(t)) } };
  }
  function flujoPlano(B, A, alfa) {
    numero(B, 'el campo B'); noNegativo(A, 'el área A'); numero(alfa, 'el ángulo α');
    return { Phi: limpio(B * A * senGrados(alfa)), theta: limpio(90 - alfa), errores: { conCoseno: limpio(B * A * cosGrados(alfa)) } };
  }

  // ---------- Faraday ----------
  function faraday(N, Phi0, Phi1, dt, R) {
    positivo(N, 'el número de vueltas N'); numero(Phi0, 'el flujo inicial'); numero(Phi1, 'el flujo final'); positivo(dt, 'el tiempo Δt');
    const abierta = R === Infinity || R === 'abierta';
    if (R !== undefined && !abierta) positivo(R, 'la resistencia R');
    const dPhi = Phi1 - Phi0, fem = -N * dPhi / dt, m = Math.abs(fem);
    const r = {
      dPhi: limpio(dPhi), dPhiTotal: limpio(N * dPhi), fem: limpio(fem), femModulo: limpio(m), rapidez: limpio(dPhi / dt),
      cambio: dPhi > 0 ? 'aumenta' : dPhi < 0 ? 'disminuye' : 'no cambia', abierta,
      errores: {
        sinN: limpio(Math.abs(dPhi) / dt), conFlujoInicial: limpio(N * Math.abs(Phi0) / dt), conFlujoFinal: limpio(N * Math.abs(Phi1) / dt),
        sumaFlujos: limpio(N * (Math.abs(Phi0) + Math.abs(Phi1)) / dt), sinDt: limpio(N * Math.abs(dPhi)), campoNoCambia: 0,
      },
    };
    if (R !== undefined) {
      r.I = abierta ? 0 : limpio(m / R);
      if (abierta) r.voltajeExtremos = r.femModulo;
      if (abierta) r.errores.corrienteIgual = true;
      else { r.errores.IsinN = limpio(Math.abs(dPhi) / dt / R); r.errores.IporR = limpio(m * R); }
    }
    return r;
  }
  function faradayCampo(N, A, B0, B1, dt, R, theta) {
    const f0 = flujo(B0, A, theta), f1 = flujo(B1, A, theta), r = faraday(N, f0.Phi, f1.Phi, dt, R);
    return Object.assign(r, { Phi0: f0.Phi, Phi1: f1.Phi });
  }
  function faradayArea(N, B, A0, A1, dt, R, theta) {
    const f0 = flujo(B, A0, theta), f1 = flujo(B, A1, theta), r = faraday(N, f0.Phi, f1.Phi, dt, R);
    return Object.assign(r, { Phi0: f0.Phi, Phi1: f1.Phi });
  }
  function faradayAngulo(N, B, A, t0, t1, dt, R) {
    const f0 = flujo(B, A, t0), f1 = flujo(B, A, t1), r = faraday(N, f0.Phi, f1.Phi, dt, R);
    r.errores.anguloConPlano = limpio(N * Math.abs(f1.errores.conSeno - f0.errores.conSeno) / dt);
    return Object.assign(r, { Phi0: f0.Phi, Phi1: f1.Phi });
  }

  // ---------- Lenz ----------
  // Del campo inducido (+1: alejándose del imán, −1: hacia el imán) a lo que se ve desde el imán.
  function lectura(bi, poloIman) {
    if (!bi) return { sentido: 'ninguno', campoInducido: 'ninguno', cara: null, fuerza: 'ninguna' };
    const cara = bi < 0 ? 'N' : 'S';   // el campo sale por la cara que mira al imán: esa cara es un polo norte
    return {
      sentido: bi < 0 ? 'antihorario' : 'horario',   // hacia quien mira (el imán) ⇒ antihorario
      campoInducido: bi < 0 ? 'hacia el imán' : 'alejándose del imán',
      cara, fuerza: cara === poloIman ? 'repele' : 'atrae',
    };
  }
  function lenz(Phi0, Phi1) {
    numero(Phi0, 'el flujo inicial'); numero(Phi1, 'el flujo final');
    const ref = Phi1 !== 0 ? Phi1 : Phi0;
    if (ref === 0) throw new Error('hace falta un flujo distinto de cero para saber hacia dónde apunta el campo del imán');
    const sB = signo(ref), polo = sB > 0 ? 'N' : 'S', dPhi = Phi1 - Phi0, bi = -signo(dPhi);
    const r = lectura(bi, polo);
    const acerca = Math.abs(Phi1) > Math.abs(Phi0);
    return Object.assign(r, {
      dPhi: limpio(dPhi), cambio: dPhi > 0 ? 'aumenta' : dPhi < 0 ? 'disminuye' : 'no cambia',
      campoIman: sB > 0 ? 'alejándose del imán' : 'hacia el imán', polo, Binducido: bi,
      refuerza: bi !== 0 && bi === sB, seOpone: bi !== 0 && bi === -sB,
      errores: {
        contraElCampo: lectura(-sB, polo),
        alReves: lectura(-bi, polo),
        soloMovimiento: lectura(acerca ? -1 : 1, 'N'),
        soloPolo: lectura(-sB, polo),
        sinCorriente: lectura(0, polo),
      },
    });
  }

  // ---------- Barra que se desliza ----------
  function femMovimiento(B, L, v, R, o) {
    positivo(B, 'el campo B'); positivo(L, 'el largo L'); noNegativo(v, 'la rapidez v');
    if (R !== undefined) positivo(R, 'la resistencia R');
    const e = B * L * v, r = { fem: limpio(e), errores: { sinL: limpio(B * v), campoConstante: 0, fuerzaAyuda: 'empuja' } };
    if (R !== undefined) {
      const I = e / R, F = B * I * L;
      Object.assign(r, { I: limpio(I), F: limpio(F), P: limpio(F * v), Pelectrica: limpio(e * I), fuerza: v > 0 ? 'frena' : 'ninguna' });
      r.errores.FconV = limpio(B * v * L);
    }
    if (o) {
      // Rieles horizontales, el extremo cerrado a la izquierda, la barra vertical a la derecha. Si la barra va a la
      // derecha, el área crece y el flujo aumenta: el campo inducido va contra B.
      const sale = o.campo === 'sale', crece = o.haciaDerecha !== false;
      const inducidoSale = crece ? !sale : sale;   // ⊙ adentro del circuito ⇒ antihorario visto de frente
      r.sentido = v === 0 ? 'ninguno' : (inducidoSale ? 'antihorario' : 'horario');
      r.enLaBarra = v === 0 ? 'ninguno' : (inducidoSale ? 'sube' : 'baja');
      r.campoInducido = v === 0 ? 'ninguno' : (inducidoSale ? 'sale' : 'entra');
    }
    return r;
  }
  function barraEntre(B, L, x0, x1, dt, R) {
    positivo(B, 'el campo B'); positivo(L, 'el largo L'); numero(x0, 'la posición x0'); numero(x1, 'la posición x1'); positivo(dt, 'el tiempo Δt');
    const f = faraday(1, B * L * x0, B * L * x1, dt, R);
    const v = (x1 - x0) / dt;
    const r = { v: limpio(v), fem: f.fem, femModulo: f.femModulo, dPhi: f.dPhi };
    if (R !== undefined) { r.I = f.I; r.F = limpio(B * f.I * L); }
    return r;
  }

  // ---------- Imán sobre el eje (modelo del dibujo) ----------
  function opIman(o) {
    const q = Object.assign({}, IMAN, o);
    positivo(q.Phimax, 'Φmax'); positivo(q.a, 'el largo a');
    if (q.polo !== 'N' && q.polo !== 'S') throw new Error("el polo debe ser 'N' o 'S'");
    return q;
  }
  function flujoIman(d, o) {
    noNegativo(d, 'la distancia d'); const q = opIman(o), u = d / q.a;
    return limpio((q.polo === 'N' ? 1 : -1) * q.Phimax * Math.pow(1 + u * u, -1.5));
  }
  function dFlujoIman(d, o) {
    noNegativo(d, 'la distancia d'); const q = opIman(o), u = d / q.a;
    return limpio((q.polo === 'N' ? 1 : -1) * q.Phimax * -3 * u / q.a * Math.pow(1 + u * u, -2.5));
  }
  function femIman(d, vd, o, N, R) {
    numero(vd, 'la velocidad del imán'); const n = N === undefined ? 1 : positivo(N, 'el número de vueltas N');
    const e = -n * dFlujoIman(d, o) * vd, r = { fem: limpio(e), femModulo: limpio(Math.abs(e)), Phi: flujoIman(d, o) };
    if (R !== undefined) r.I = limpio(e / positivo(R, 'la resistencia R'));
    return r;
  }
  function femEntre(d0, d1, dt, o, N, R) {
    positivo(dt, 'el tiempo Δt'); const n = N === undefined ? 1 : positivo(N, 'el número de vueltas N');
    const P0 = flujoIman(d0, o), P1 = flujoIman(d1, o), e = -n * (P1 - P0) / dt;
    const r = { fem: limpio(e), femModulo: limpio(Math.abs(e)), Phi: P1, dPhi: limpio(P1 - P0) };
    if (R !== undefined) r.I = limpio(e / positivo(R, 'la resistencia R'));
    return r;
  }
  function movimientoIman(t, mov) {
    numero(t, 'el tiempo t');
    if (!mov || typeof mov !== 'object') throw new Error('falta el movimiento { d0, d1, t0, T }');
    const d0 = noNegativo(mov.d0, 'd0'), d1 = noNegativo(mov.d1, 'd1'), t0 = mov.t0 || 0, T = positivo(mov.T, 'la duración T');
    const f = Math.max(0, Math.min(1, (t - t0) / T));
    const s = f * f * (3 - 2 * f), ds = (t < t0 || t > t0 + T) ? 0 : 6 * f * (1 - f) / T;
    return { d: limpio(d0 + (d1 - d0) * s), vd: limpio((d1 - d0) * ds), quieto: ds === 0 };
  }
  function serieIman(mov, o, N, R, tFin, n) {
    positivo(tFin, 'el tiempo final'); const k = n || 200, pts = [];
    let tMax = 0, eMax = 0;
    for (let j = 0; j <= k; j++) {
      const t = tFin * j / k, m = movimientoIman(t, mov), e = femIman(m.d, m.vd, o, N, R);
      pts.push({ t: limpio(t), d: m.d, Phi: e.Phi, fem: e.fem, I: e.I === undefined ? null : e.I });
      if (e.femModulo > eMax) { eMax = e.femModulo; tMax = t; }
    }
    // afinar el instante del pico con una búsqueda por tercios alrededor del mejor punto de la grilla
    let a = Math.max(0, tMax - tFin / k), b = Math.min(tFin, tMax + tFin / k);
    const g = t => { const m = movimientoIman(t, mov); return femIman(m.d, m.vd, o, N).femModulo; };
    for (let j = 0; j < 80; j++) { const m1 = a + (b - a) / 3, m2 = b - (b - a) / 3; if (g(m1) < g(m2)) a = m1; else b = m2; }
    tMax = (a + b) / 2; const mm = movimientoIman(tMax, mov), em = femIman(mm.d, mm.vd, o, N, R);
    return { puntos: pts, tMax: limpio(tMax), femMax: em.femModulo, IMax: R === undefined ? null : limpio(Math.abs(em.I)), dMax: mm.d,
      Phi0: flujoIman(mov.d0, o), Phi1: flujoIman(mov.d1, o), dPhi: limpio(flujoIman(mov.d1, o) - flujoIman(mov.d0, o)) };
  }
  function cambioRapidez(mov, o, N, f) {
    positivo(f, 'el factor');
    const tFin = (mov.t0 || 0) + mov.T;
    const s0 = serieIman(mov, o, N, undefined, tFin, 400);
    const m1 = Object.assign({}, mov, { T: mov.T / f });
    const s1 = serieIman(m1, o, N, undefined, (mov.t0 || 0) + m1.T, 400);
    return { femMax0: s0.femMax, femMax1: s1.femMax, razon: limpio(s1.femMax / s0.femMax), dPhi0: s0.dPhi, dPhi1: s1.dPhi,
      T0: limpio(mov.T), T1: limpio(m1.T),
      errores: { picoIgual: s0.femMax, picoCuadrado: limpio(s0.femMax * f * f), dPhiCambia: limpio(s0.dPhi * f) } };
  }

  // ---------- Generador ----------
  function generador(N, B, A, omega) {
    positivo(N, 'el número de vueltas N'); positivo(B, 'el campo B'); positivo(A, 'el área A'); positivo(omega, 'la rapidez angular ω');
    const em = N * B * A * omega;
    return { femMax: limpio(em), eficaz: limpio(em / RAIZ2), PhiMax: limpio(B * A), f: limpio(omega / (2 * Math.PI)), T: limpio(2 * Math.PI / omega),
      errores: { eficazMitad: limpio(em / 2), eficazPorRaiz: limpio(em * RAIZ2), sinN: limpio(B * A * omega), sinNEficaz: limpio(B * A * omega / RAIZ2) } };
  }
  function femGenerador(N, B, A, omega, t) {
    const g = generador(N, B, A, omega); numero(t, 'el tiempo t');
    const th = omega * t * GRADOS, c = Math.cos(omega * t), s = Math.sin(omega * t);
    return { theta: limpio(((th % 360) + 360) % 360), Phi: limpio(B * A * c), PhiTotal: limpio(N * B * A * c), fem: limpio(g.femMax * s) };
  }

  // ---------- Transformador ideal ----------
  function transformador(Np, Ns, Vp, Ip, o) {
    positivo(Np, 'Np'); positivo(Ns, 'Ns'); noNegativo(Vp, 'Vp');
    const I = Ip === undefined ? null : noNegativo(Ip, 'Ip');
    const k = Ns / Np, cont = !!(o && o.continua);
    const Vs = cont ? 0 : Vp * k, Is = I === null ? null : (cont ? 0 : I / k);
    const r = {
      Vs: limpio(Vs), Is: Is === null ? null : limpio(Is), razon: limpio(k), continua: cont,
      tipo: k < 1 ? 'reductor' : k > 1 ? 'elevador' : 'igual',
      errores: {
        razonInvertida: { Vs: limpio(Vp / k), Is: I === null ? null : limpio(I * k) },
        corrienteComoVoltaje: { Vs: limpio(Vp * k), Is: I === null ? null : limpio(I * k) },
        sinCambio: { Vs: limpio(Vp), Is: I },
        continuaPasa: { Vs: limpio(Vp * k), Is: I === null ? null : limpio(I / k) },
      },
    };
    if (I !== null) { r.Pp = cont ? 0 : limpio(Vp * I); r.Ps = cont ? 0 : limpio(Vs * Is); }
    return r;
  }

  // ---------- Líneas del imán (solo para el dibujo) ----------
  // Modelo de dos polos en el plano (el del dibujo de magnetismo): im = { x, y, largo, ang } en m y grados; el norte
  // está en la punta hacia 'ang'. Las líneas salen del norte y entran al sur.
  function polos(im) {
    const L = im.largo || 0.1, t = (im.ang || 0) / GRADOS, ux = Math.cos(t), uy = Math.sin(t);
    return { N: { x: im.x + ux * L / 2, y: im.y + uy * L / 2 }, S: { x: im.x - ux * L / 2, y: im.y - uy * L / 2 }, ux, uy, L };
  }
  function campoCrudo(pl, P) {
    let x = 0, y = 0;
    for (const [Q, s] of [[pl.N, 1], [pl.S, -1]]) {
      const dx = P.x - Q.x, dy = P.y - Q.y, r = Math.hypot(dx, dy);
      if (r < 1e-9) return null;
      x += s * dx / (r * r * r); y += s * dy / (r * r * r);
    }
    return { x, y };
  }
  function campoIman(im, P) {
    if (!im || typeof im !== 'object') throw new Error('falta el imán { x, y, largo, ang }');
    numero(im.x, 'el imán (x)'); numero(im.y, 'el imán (y)'); numero(P && P.x, 'el punto (x)'); numero(P.y, 'el punto (y)');
    const c = campoCrudo(polos(im), P);
    if (!c) throw new Error('el punto no puede estar sobre un polo');
    return { x: c.x, y: c.y, modulo: Math.hypot(c.x, c.y) };
  }
  function lineasIman(im, n, caja) {
    const pl = polos(im), N = n || 10, lineas = [];
    const r0 = Math.max(0.003, pl.L * 0.04), h = pl.L * 0.015;
    const dentro = P => !caja || (P.x > caja.x0 && P.x < caja.x1 && P.y > caja.y0 && P.y < caja.y1);
    const f = c => { const b = campoCrudo(pl, c); if (!b) return null; const m = Math.hypot(b.x, b.y); return { x: b.x / m, y: b.y / m }; };
    for (let k = 0; k < N; k++) {
      const a = Math.atan2(pl.uy, pl.ux) + (k + 0.5) / N * 2 * Math.PI;
      let P = { x: pl.N.x + r0 * Math.cos(a), y: pl.N.y + r0 * Math.sin(a) };
      if ((P.x - pl.N.x) * pl.ux + (P.y - pl.N.y) * pl.uy < -r0 * 0.7) continue;
      const pts = [P];
      for (let j = 0; j < 1200; j++) {
        const d1 = f(P); if (!d1) break;
        const M = { x: P.x + d1.x * h / 2, y: P.y + d1.y * h / 2 }, d2 = f(M); if (!d2) break;
        P = { x: P.x + d2.x * h, y: P.y + d2.y * h };
        pts.push(P);
        if (Math.hypot(P.x - pl.S.x, P.y - pl.S.y) < r0) break;
        if (!dentro(P)) break;
      }
      lineas.push(pts);
    }
    return lineas;
  }

  function azar(sem) { let s = (sem >>> 0) || 1; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; }

  return {
    IMAN, senGrados, cosGrados, flujo, flujoPlano, faraday, faradayCampo, faradayArea, faradayAngulo, lenz,
    femMovimiento, barraEntre, flujoIman, dFlujoIman, femIman, femEntre, movimientoIman, serieIman, cambioRapidez,
    generador, femGenerador, transformador, campoIman, lineasIman, azar,
  };
});
