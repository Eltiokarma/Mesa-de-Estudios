/*
 * Motor de dinámica: segunda ley de Newton con bloques, planos inclinados, poleas y ascensores.
 *
 * Aquí vive toda la física de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual
 * en el navegador (window.MotorDinamica) y en Node (require('./motor.js')), donde lo prueban
 * casos.json y papel.json.
 *
 * Unidades SI, g = 10 m/s² y ángulos en grados. Los ángulos de academia se toman con los valores
 * del triángulo notable, como en el examen: sen 37° = 3/5, cos 37° = 4/5 (y 53°, 16° y 74°);
 * 30°, 45° y 60° son exactos de por sí. Cualquier otro ángulo usa el seno de verdad.
 * Con { exacto: true } también 37° y 53° usan el seno de verdad (0,6018…).
 *
 * El roce sigue el modelo de clase: el estático se ajusta a lo que haga falta, hasta μs·N; si eso no
 * alcanza, el cuerpo desliza y el roce pasa a ser cinético, μk·N, contra el movimiento.
 * Si no se da μk, vale lo mismo que μs ("el coeficiente de rozamiento es μ").
 *
 * Funciones:
 *   trig(angulo, exacto)                     → { sen, cos }
 *   plano({ m, angulo, mus, muk, F, v0 })    bloque en un plano inclinado; F empuja hacia arriba del
 *                                            plano, paralela a él; v0 va a lo largo del plano, positiva
 *                                            hacia abajo. Signos de a y roce: positivos hacia abajo del plano.
 *   piso({ m, F, angulo, mus, muk, v0 })     bloque en el piso tirado por F con un ángulo sobre la horizontal
 *                                            (negativo: empuja hacia abajo). Positivo: hacia donde tira F.
 *   planoPolea({ m1, m2, angulo, mus, muk })  m1 en el plano (o la mesa, con angulo 0), unido por una cuerda
 *                                            a m2, que cuelga de una polea en lo alto. Positivo: m2 baja.
 *   mesaPolea(o)                             lo mismo con angulo 0.
 *   atwood({ m1, m2 })                       dos bloques colgando de una polea. Positivo: m1 baja.
 *   ascensor({ m, a, v })                    persona sobre una balanza en un ascensor; a positiva hacia arriba.
 *                                            v no cambia nada (está a propósito: la balanza no ve la velocidad).
 *   contacto({ m1, m2, F, muk })             F empuja a m1, que empuja a m2 (ya en movimiento).
 *   empujon({ m, F, dur, muk })              F empuja durante dur segundos desde el reposo y luego se suelta.
 *   resultante(fuerzas, m)                   suma de fuerzas [{ F, angulo }] y la aceleración que dan.
 *   centripeta({ m, v, r })                  fuerza neta hacia el centro en un movimiento circular uniforme.
 *   vertical({ m, v, r, theta })             cuerda o pista por dentro de un círculo vertical (columpio, balde, rizo).
 *                                            theta desde el punto más bajo (0 abajo, 90 a la altura del centro,
 *                                            180 arriba), de 0° a menos de 360°; v es la rapidez en ese punto.
 *                                            S (alias T y N) es lo que jala la cuerda o empuja la pista hacia el
 *                                            centro: S = m·v²/r + m·g·cos θ. Si saldría negativa, la cuerda está floja
 *                                            (floja = true) y S = 0.
 *   loma({ m, r, phi, v, desdeReposo })      por encima de una superficie convexa (loma, domo). phi desde la cima,
 *                                            de 0° a 90°. N = m·g·cos φ − m·v²/r; si saldría negativa, despega y N = 0.
 *                                            Con desdeReposo, v² = 2·g·r·(1 − cos φ) (sin roce, por energía).
 *                                            desdeCima(t): el auto sale de la cima con rapidez v constante (el motor
 *                                            del auto la mantiene) y sigue la pista hasta que N llega a 0; desde ahí,
 *                                            caída libre. Origen en la cima, x hacia adelante, y hacia arriba;
 *                                            giro: dirección de la velocidad, en grados bajo la horizontal.
 *   curva({ m, v, r, peralte, mus })         auto en una curva horizontal, plana o peraltada. El roce f es positivo
 *                                            hacia abajo de la pendiente (hacia el centro en la curva plana).
 *   tren({ masas, F, muk })                  carritos unidos por cuerdas; F jala masas[0] (el de adelante). La cuerda
 *                                            k (1 … n−1) une masas[k−1] con masas[k]; tensiones[k−1] es su tensión.
 *                                            Si F no vence el roce, quedan quietos y las tensiones no se determinan (null).
 *   apilados({ mA, mB, F, en, mus, muk, muPiso })  A encima de B; F horizontal en el de abajo (en: 'abajo') o en el
 *                                            de arriba ('arriba'). μs y μk entre A y B; μPiso bajo B (estático igual al
 *                                            cinético; 0 si no se da). roceA es el roce de B sobre A, positivo hacia
 *                                            donde apunta F; sobre B actúa roceB = −roceA (tercera ley).
 *   poleaMovil({ m1, m2 })                   m1 cuelga de una polea móvil; la cuerda está atada al techo, pasa por la
 *                                            polea móvil, sube a una polea fija y baja hasta m2. Positivo: m2 baja y
 *                                            m1 sube, con a1 = a2/2.
 *   tren, apilados y poleaMovil traen recorrido(t): lo que avanzó cada cuerpo desde el reposo a los t segundos.
 *
 * Campos de las funciones nuevas (ángulos de academia también en 143°, 180°, etc.: sen(180° − θ) = sen θ):
 *   vertical → S, T, N, ac = v²/r, at = g·|sen θ| (tangencial), P, floja, vMinArriba = √(g·r), neta (resultante hacia
 *     el centro, m·ac), masaAparente = S/g. Errores: igualPeso = m·g; sinPeso = m·v²/r; signoPeso = m·v²/r − m·g·cos θ;
 *     centripetaExtra = m·g·cos θ − m·v²/r (la «centrípeta» como una fuerza más, en equilibrio).
 *   loma → N, P, v2, v, ac = v²/r, at = g·sen φ, despega, vMaxCima = √(g·r), phiDespegue = arccos(2/3) en grados
 *     (desde el reposo). Errores: igualPeso = m·g; sumaCentripeta = m·g·cos φ + m·v²/r; soloCentripeta = m·v²/r;
 *     sinCos = m·g − m·v²/r.
 *   curva → N, f, fMax = μs·N, derrapa (|f| > fMax), ac, vIdeal = √(g·r·tan θ), vMax (sin derrapar; Infinity si
 *     cos θ − μs·sen θ ≤ 0). Errores: conCentrifuga = 0; roceMaximo = μs·N.
 *   tren → a, sentido ('avanza' o 'quieto'), tensiones, neta y roce (por carrito). Errores (por cuerda k): igualF = F;
 *     repartida = F/(n − 1); bloqueDelante = masas[k−1]·a; masaDelante = (suma de las masas delante de la cuerda)·a.
 *   apilados → juntos, quietos, a (si van juntos), aA, aB, roceA, roceB, fsMax = μs·mA·g, tipoRoce ('estatico',
 *     'cinetico' o 'ninguno'), rocePiso (positivo hacia F), Fmax (la mayor F con la que no resbalan). Errores:
 *     roceMaximo = μs·mA·g; roceConPesoTotal = μs·(mA + mB)·g; FcontraRoceMax = μs·mA·g; aSoloB = F/mB.
 *   poleaMovil → a1, a2, T, P1, P2, sostiene = 2T, equilibrio, sentido ('m2 baja', 'm2 sube' o 'quieto').
 *     Errores: mismaAceleracion = la aceleración común si a1 fuera igual a a2; dobleRapido = 2·a2 (a1 al doble de a2);
 *     tensionMitadPeso1 = m1·g/2; tensionPeso2 = m2·g; comoAtwood = (m2 − m1)·g/(m1 + m2).
 *
 * Cada resultado trae 'errores': los números que salen de las ideas erróneas del informe
 * (docs/investigacion/dinamica-ideas-erroneas.md). La escena los usa para las opciones incorrectas.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorDinamica = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const G = 10;
  const EPS = 1e-9;
  const num = (x, que) => { const n = Number(x); if (!Number.isFinite(n)) throw new Error(`${que} inválido: ${x}`); return n; };
  const pos = (x, que) => { const n = num(x, que); if (!(n > 0)) throw new Error(`${que} debe ser mayor que cero: ${x}`); return n; };
  const noNeg = (x, que) => { const n = num(x === undefined ? 0 : x, que); if (n < 0) throw new Error(`${que} no puede ser negativo: ${x}`); return n; };
  const limpio = x => (Math.abs(x) < EPS ? 0 : x);

  // Triángulos notables de academia: [sen, cos].
  const R3 = Math.sqrt(3), R2 = Math.SQRT2;
  const NOTABLES = { 0: [0, 1], 16: [7 / 25, 24 / 25], 30: [1 / 2, R3 / 2], 37: [3 / 5, 4 / 5], 45: [R2 / 2, R2 / 2],
    53: [4 / 5, 3 / 5], 60: [R3 / 2, 1 / 2], 74: [24 / 25, 7 / 25], 90: [1, 0] };
  function trig(angulo, exacto) {
    const a = num(angulo, 'ángulo');
    const k = Math.abs(a), s = Math.sign(a) || 1;
    if (Object.prototype.hasOwnProperty.call(NOTABLES, k) && !(exacto && (k === 37 || k === 53 || k === 16 || k === 74))) {
      const [sen, cos] = NOTABLES[k];
      return { sen: s * sen, cos };
    }
    const r = a * Math.PI / 180;
    return { sen: Math.sin(r), cos: Math.cos(r) };
  }
  function coeficientes(o) {
    const mus = noNeg(o.mus, 'μs');
    const muk = o.muk === undefined ? mus : noNeg(o.muk, 'μk');
    if (muk > mus + EPS) throw new Error('μk no puede ser mayor que μs');
    return { mus, muk };
  }

  // Lo común a un bloque que puede deslizar sobre una superficie: "empuje" D es la suma de las fuerzas
  // a lo largo de la superficie sin contar el roce (positiva en el sentido elegido), N la normal y
  // masa la masa que se acelera. v0 en el mismo eje.
  function deslizar(D, N, masa, mus, muk, v0) {
    const fsMax = mus * N, fk = muk * N;
    let roce, a, tipo, sentido;
    if (Math.abs(v0) > EPS) {
      const dir = Math.sign(v0);
      roce = -dir * fk; a = (D + roce) / masa; tipo = fk > EPS ? 'cinetico' : 'ninguno';
      sentido = dir > 0 ? 'positivo' : 'negativo';
    } else if (Math.abs(D) <= fsMax + EPS) {
      roce = -D; a = 0; tipo = Math.abs(D) > EPS ? 'estatico' : 'ninguno'; sentido = 'quieto';
    } else {
      const dir = Math.sign(D);
      roce = -dir * fk; a = (D + roce) / masa; tipo = fk > EPS ? 'cinetico' : 'ninguno';
      sentido = dir > 0 ? 'positivo' : 'negativo';
    }
    roce = limpio(roce); a = limpio(a);
    // Si ya se movía y el roce lo frena, se detiene en tParada; desde ahí vale el caso con v0 = 0.
    const tParada = Math.abs(v0) > EPS && a !== 0 && Math.sign(a) !== Math.sign(v0) ? -v0 / a : null;
    return { fsMax, fk, roce, roceModulo: Math.abs(roce), tipoRoce: tipo, a, aModulo: Math.abs(a), sentido, tParada,
      despues: tParada === null ? null : deslizar(D, N, masa, mus, muk, 0) };
  }

  function plano(o) {
    const m = pos(o.m, 'masa'), g = o.g === undefined ? G : pos(o.g, 'g');
    const ang = num(o.angulo, 'ángulo');
    if (ang < 0 || ang > 90) throw new Error('el ángulo del plano va de 0° a 90°');
    const { sen, cos } = trig(ang, o.exacto), { mus, muk } = coeficientes(o);
    const F = num(o.F || 0, 'fuerza'), v0 = num(o.v0 || 0, 'velocidad');
    const P = m * g, Ppar = P * sen, Pperp = P * cos, N = Pperp;
    const r = deslizar(Ppar - F, N, m, mus, muk, v0);
    const sentido = { positivo: 'baja', negativo: 'sube', quieto: 'quieto' }[r.sentido];
    const despues = r.despues && Object.assign({}, r.despues, { sentido: { positivo: 'baja', negativo: 'sube', quieto: 'quieto' }[r.despues.sentido] });
    return Object.assign({}, r, { P, Ppar, Pperp, N, sen, cos, sentido, despues, resultante: m * r.a,
      // Ángulo desde el que un bloque soltado empieza a deslizar: tan θ = μs.
      anguloLimite: Math.atan(mus) * 180 / Math.PI,
      errores: { normalIgualPeso: P, senCosCambiados: P * sen, normalCero: 0,
        roceConPeso: muk * P, roceEstaticoMaximo: mus * N, aSinRoce: g * sen, aConPeso: (Ppar - F - muk * P) / m } });
  }

  function piso(o) {
    const m = pos(o.m, 'masa'), g = o.g === undefined ? G : pos(o.g, 'g');
    const F = noNeg(o.F, 'fuerza'), ang = num(o.angulo || 0, 'ángulo');
    if (Math.abs(ang) > 90) throw new Error('el ángulo de la fuerza va de −90° a 90°');
    const { sen, cos } = trig(ang, o.exacto), { mus, muk } = coeficientes(o);
    const v0 = num(o.v0 || 0, 'velocidad');
    const P = m * g, Fx = F * cos, Fy = F * sen;
    const Nlibre = P - Fy, despega = Nlibre < -EPS, N = Math.max(0, limpio(Nlibre));
    const r = deslizar(Fx, N, m, mus, muk, v0);
    return Object.assign({}, r, { P, Fx: limpio(Fx), Fy: limpio(Fy), N, despega, ay: despega ? (Fy - P) / m : 0, resultante: m * r.a,
      errores: { normalIgualPeso: P, normalSumaFy: P + Fy, aSinDescomponer: (F - muk * P) / m, roceConPeso: muk * P } });
  }

  function planoPolea(o) {
    const m1 = pos(o.m1, 'masa 1'), m2 = pos(o.m2, 'masa 2'), g = o.g === undefined ? G : pos(o.g, 'g');
    const ang = num(o.angulo || 0, 'ángulo');
    if (ang < 0 || ang > 90) throw new Error('el ángulo del plano va de 0° a 90°');
    const { sen, cos } = trig(ang, o.exacto), { mus, muk } = coeficientes(o);
    const v0 = num(o.v0 || 0, 'velocidad');
    const N = m1 * g * cos, D = m2 * g - m1 * g * sen;
    const r = deslizar(D, N, m1 + m2, mus, muk, v0);
    // La tensión sale del bloque que cuelga: m2·g − T = m2·a.
    const T = limpio(m2 * (g - r.a));
    const sentido = { positivo: 'm2 baja', negativo: 'm2 sube', quieto: 'quieto' }[r.sentido];
    return Object.assign({}, r, { N, T, sentido, P1: m1 * g, P2: m2 * g, P1par: m1 * g * sen,
      errores: { tensionIgualPeso2: m2 * g, tensionIgualPeso1: m1 * g, aSinRoce: D / (m1 + m2), aSoloM1: (D + r.roce) / m1 } });
  }
  const mesaPolea = o => planoPolea(Object.assign({}, o, { angulo: 0 }));

  function atwood(o) {
    const m1 = pos(o.m1, 'masa 1'), m2 = pos(o.m2, 'masa 2'), g = o.g === undefined ? G : pos(o.g, 'g');
    const a = limpio((m1 - m2) * g / (m1 + m2)), T = 2 * m1 * m2 * g / (m1 + m2);
    return { a, aModulo: Math.abs(a), T, baja: a > 0 ? 'm1' : a < 0 ? 'm2' : null, P1: m1 * g, P2: m2 * g,
      errores: { tensionLiviano: Math.min(m1, m2) * g, tensionPesado: Math.max(m1, m2) * g, tensionSuma: (m1 + m2) * g,
        tensionDiferencia: Math.abs(m1 - m2) * g, aSinDividirTotal: Math.abs(m1 - m2) * g / Math.max(m1, m2) } };
  }

  function ascensor(o) {
    const m = pos(o.m, 'masa'), g = o.g === undefined ? G : pos(o.g, 'g');
    const a = num(o.a || 0, 'aceleración');
    num(o.v || 0, 'velocidad'); // se acepta y no se usa: la balanza no mide la velocidad
    const N = Math.max(0, limpio(m * (g + a)));
    return { N, P: m * g, lectura: N / g, ingravidez: N === 0,
      errores: { normalIgualPeso: m * g, normalConVelocidad: m * (g + Math.abs(o.v || 0)), signoCambiado: Math.max(0, m * (g - a)) } };
  }

  function contacto(o) {
    const m1 = pos(o.m1, 'masa 1'), m2 = pos(o.m2, 'masa 2'), g = o.g === undefined ? G : pos(o.g, 'g');
    const F = noNeg(o.F, 'fuerza'), muk = noNeg(o.muk, 'μk');
    const a = limpio((F - muk * (m1 + m2) * g) / (m1 + m2));
    const c = limpio(m2 * a + muk * m2 * g);
    return { a, contacto12: c, contacto21: c, neta1: m1 * a, neta2: m2 * a, roce1: muk * m1 * g, roce2: muk * m2 * g,
      errores: { contactoIgualF: F, contactoPorMasa1: F * m1 / (m1 + m2), anulan: 0 } };
  }

  function empujon(o) {
    const m = pos(o.m, 'masa'), g = o.g === undefined ? G : pos(o.g, 'g');
    const F = noNeg(o.F, 'fuerza'), dur = pos(o.dur, 'duración'), muk = noNeg(o.muk, 'μk');
    const mus = o.mus === undefined ? muk : noNeg(o.mus, 'μs');
    const fk = muk * m * g;
    // Primer tramo: desde el reposo con F. Si F no vence el roce estático, no se mueve.
    const a1 = F > mus * m * g + EPS ? (F - fk) / m : 0;
    const v1 = a1 * dur, x1 = a1 * dur * dur / 2;
    const a2 = v1 > EPS ? -fk / m : 0;
    const quieto = a1 === 0; // el empuje no venció al roce estático: nunca se movió
    const t2 = quieto ? 0 : a2 < 0 ? v1 / -a2 : Infinity; // lo que dura el frenado
    const tParada = quieto ? 0 : Number.isFinite(t2) ? dur + t2 : null;
    const xFinal = quieto ? 0 : Number.isFinite(t2) ? x1 + v1 * t2 / 2 : null;
    function v(t) { if (t <= dur) return a1 * t; const s = Math.min(t - dur, t2); return v1 + a2 * s; }
    function x(t) { if (t <= dur) return a1 * t * t / 2; const s = Math.min(t - dur, t2); return x1 + v1 * s + a2 * s * s / 2; }
    function a(t) { if (t < dur) return a1; return t - dur < t2 ? a2 : 0; }
    return { a1, a2, v1, x1, tParada, xFinal, v, x, a, estado: t => ({ x: x(t), v: v(t), a: a(t) }) };
  }

  function resultante(fuerzas, m) {
    let x = 0, y = 0;
    for (const f of fuerzas) { const F = noNeg(f.F, 'fuerza'), { sen, cos } = trig(f.angulo || 0, f.exacto); x += F * cos; y += F * sen; }
    x = limpio(x); y = limpio(y);
    const modulo = Math.hypot(x, y);
    return { x, y, modulo, angulo: modulo ? Math.atan2(y, x) * 180 / Math.PI : 0, a: m === undefined ? null : modulo / pos(m, 'masa'),
      errores: { sumaDeModulos: fuerzas.reduce((s, f) => s + Number(f.F), 0) } };
  }

  function centripeta(o) {
    const m = pos(o.m, 'masa'), v = num(o.v, 'rapidez'), r = pos(o.r, 'radio');
    const ac = v * v / r;
    return { ac, F: m * ac, errores: { sinCuadrado: m * Math.abs(v) / r, porRadio: m * v * v * r } };
  }

  // Ángulo de 0° a 360° con los valores de academia en cada cuadrante (143° = 180° − 37°, etc.).
  function trigVuelta(angulo) {
    const a = num(angulo, 'ángulo');
    if (a < 0 || a >= 360) throw new Error('el ángulo va de 0° a menos de 360°');
    if (a <= 90) return trig(a);
    if (a <= 180) { const t = trig(180 - a); return { sen: t.sen, cos: -t.cos }; }
    if (a <= 270) { const t = trig(a - 180); return { sen: -t.sen, cos: -t.cos }; }
    const t = trig(360 - a); return { sen: -t.sen, cos: t.cos };
  }

  function vertical(o) {
    const m = pos(o.m, 'masa'), v = num(o.v, 'rapidez'), r = pos(o.r, 'radio'), g = o.g === undefined ? G : pos(o.g, 'g');
    const { sen, cos } = trigVuelta(o.theta === undefined ? 0 : o.theta);
    const v2 = v * v, ac = v2 / r, P = m * g;
    const libre = m * ac + m * g * cos;          // lo que tendría que jalar la cuerda hacia el centro
    const floja = libre < -EPS, S = floja ? 0 : limpio(libre);
    // Rapidez en el punto más bajo (por energía) y hasta qué ángulo subiría como un péndulo; null si pasa de 90°.
    const vb2 = v2 + 2 * g * r * (1 - cos), q = 1 - vb2 / (2 * g * r);
    const anguloMax = q >= -EPS ? Math.acos(Math.min(1, Math.max(-1, q))) * 180 / Math.PI : null;
    const periodo = 2 * Math.PI * Math.sqrt(r / g);
    return { S, T: S, N: S, ac, at: limpio(g * Math.abs(sen)), P, floja, vMinArriba: Math.sqrt(g * r),
      // Resultante hacia el centro: m·v²/r mientras hay círculo; si la cuerda está floja, solo la parte del peso.
      neta: floja ? limpio(-m * g * cos) : m * ac, masaAparente: S / g, anguloMax, periodo,
      // Vaivén para animar (aproximación de péndulo con forma de seno, en grados).
      vaiven: t => (anguloMax === null ? null : anguloMax * Math.sin(2 * Math.PI * t / periodo)),
      errores: { igualPeso: P, sinPeso: m * ac, signoPeso: m * ac - m * g * cos, centripetaExtra: m * g * cos - m * ac } };
  }

  function loma(o) {
    const m = pos(o.m, 'masa'), r = pos(o.r, 'radio'), g = o.g === undefined ? G : pos(o.g, 'g');
    const phi = num(o.phi === undefined ? 0 : o.phi, 'ángulo');
    if (phi < 0 || phi > 90) throw new Error('el ángulo desde la cima va de 0° a 90°');
    const { sen, cos } = trig(phi), reposo = !!o.desdeReposo;
    const vIn = reposo ? 0 : num(o.v, 'rapidez');
    const v2 = reposo ? 2 * g * r * (1 - cos) : vIn * vIn, v = Math.sqrt(v2), ac = v2 / r, P = m * g;
    const libre = m * g * cos - m * ac, despega = libre < -EPS, N = despega ? 0 : limpio(libre);
    const neta = limpio(m * g * cos - N);
    // Para animar: sale de la cima con rapidez v constante; despega donde cos φ = v²/(g·r).
    const fd = v2 >= g * r ? 0 : Math.acos(v2 / (g * r)), td = v > EPS ? fd * r / v : Infinity;
    function desdeCima(t) {
      t = num(t, 'tiempo');
      if (v <= EPS) return { x: 0, y: 0, phi: 0, giro: 0, enPista: true };
      if (t <= td) { const f = v * t / r, d = f * 180 / Math.PI; return { x: r * Math.sin(f), y: -r * (1 - Math.cos(f)), phi: d, giro: d, enPista: true }; }
      const x0 = r * Math.sin(fd), y0 = -r * (1 - Math.cos(fd)), s = t - td, vx = v * Math.cos(fd), vy = -v * Math.sin(fd) - g * s;
      // giro: hacia dónde apunta la velocidad, en grados bajo la horizontal.
      return { x: x0 + vx * s, y: y0 - v * Math.sin(fd) * s - g * s * s / 2, phi: null, giro: Math.atan2(-vy, vx) * 180 / Math.PI, enPista: false };
    }
    return { N, P, v2, v, ac, at: limpio(g * sen), despega, vMaxCima: Math.sqrt(g * r),
      phiDespegue: Math.acos(2 / 3) * 180 / Math.PI, neta, aRadial: neta / m,
      despegaEn: reposo ? null : fd * 180 / Math.PI, desdeCima,
      errores: { igualPeso: P, sumaCentripeta: m * g * cos + m * ac, soloCentripeta: m * ac, sinCos: P - m * ac } };
  }

  function curva(o) {
    const m = pos(o.m, 'masa'), v = num(o.v, 'rapidez'), r = pos(o.r, 'radio'), g = o.g === undefined ? G : pos(o.g, 'g');
    const th = num(o.peralte || 0, 'peralte');
    if (th < 0 || th >= 90) throw new Error('el peralte va de 0° a menos de 90°');
    const { sen, cos } = trig(th), mus = noNeg(o.mus, 'μs');
    const ac = v * v / r;
    // Ejes: horizontal hacia el centro y vertical. N·sen θ + f·cos θ = m·ac y N·cos θ − f·sen θ = m·g.
    const N = limpio(m * g * cos + m * ac * sen), f = limpio(m * ac * cos - m * g * sen), fMax = mus * N;
    const den = cos - mus * sen, numMin = sen - mus * cos;
    return { N, f, fMax, derrapa: Math.abs(f) > fMax + EPS, ac,
      vIdeal: Math.sqrt(g * r * sen / cos),
      vMax: den <= EPS ? Infinity : Math.sqrt(g * r * (sen + mus * cos) / den),
      vMin: numMin <= EPS ? 0 : Math.sqrt(g * r * numMin / (cos + mus * sen)),
      errores: { conCentrifuga: 0, roceMaximo: fMax } };
  }

  function tren(o) {
    if (!Array.isArray(o.masas) || o.masas.length < 2) throw new Error('el tren necesita al menos 2 masas');
    const masas = o.masas.map((x, i) => pos(x, `masa ${i + 1}`)), n = masas.length;
    const g = o.g === undefined ? G : pos(o.g, 'g'), F = noNeg(o.F, 'fuerza'), muk = noNeg(o.muk, 'μk');
    const M = masas.reduce((s, x) => s + x, 0);
    const detras = k => masas.slice(k).reduce((s, x) => s + x, 0), delante = k => masas.slice(0, k).reduce((s, x) => s + x, 0);
    const quieto = F <= muk * M * g + EPS, a = quieto ? 0 : limpio((F - muk * M * g) / M);
    const cuerdas = Array.from({ length: n - 1 }, (_, i) => i + 1);
    return { a, sentido: quieto ? 'quieto' : 'avanza', M,
      tensiones: quieto ? null : cuerdas.map(k => detras(k) * (a + muk * g)),
      neta: masas.map(x => x * a), roce: masas.map(x => muk * x * g),
      recorrido: t => a * t * t / 2,
      errores: { igualF: F, repartida: F / (n - 1), bloqueDelante: cuerdas.map(k => masas[k - 1] * a), masaDelante: cuerdas.map(k => delante(k) * a) } };
  }

  function apilados(o) {
    const mA = pos(o.mA, 'masa de arriba'), mB = pos(o.mB, 'masa de abajo'), g = o.g === undefined ? G : pos(o.g, 'g');
    const F = noNeg(o.F, 'fuerza'), en = o.en === undefined ? 'abajo' : o.en;
    if (en !== 'abajo' && en !== 'arriba') throw new Error(`en debe ser 'abajo' o 'arriba': ${en}`);
    const { mus, muk } = coeficientes(o), muPiso = noNeg(o.muPiso, 'μ del piso');
    const M = mA + mB, fsA = mus * mA * g, fk = muk * mA * g, p = muPiso * M * g;
    let juntos, quietos = false, a = null, aA, aB, roceA, rocePiso, tipoRoce, Fmax;
    if (en === 'abajo') {
      Fmax = (mus + muPiso) * g * M;
      if (F <= p + EPS) { juntos = true; quietos = true; a = 0; roceA = 0; rocePiso = -F; }
      else {
        const aj = (F - p) / M;
        if (mA * aj <= fsA + EPS) { juntos = true; a = aj; roceA = mA * aj; rocePiso = -p; }
        else { juntos = false; aA = muk * g; aB = (F - fk - p) / mB; roceA = fk; rocePiso = -p; }
      }
    } else {
      // Con el piso que aguanta más que el roce entre los bloques, B no se mueve y A resbala desde F = fsA.
      Fmax = fsA > p ? (fsA * M - mA * p) / mB : fsA;
      const resbala = () => { juntos = false; aA = (F - fk) / mA; aB = Math.max(0, (fk - p) / mB); roceA = -fk; rocePiso = aB > 0 ? -p : -fk; };
      if (F <= p + EPS) {
        if (F <= fsA + EPS) { juntos = true; quietos = true; a = 0; roceA = -F; rocePiso = -F; } else resbala();
      } else {
        const aj = (F - p) / M, atras = F - mA * aj;
        if (atras <= fsA + EPS) { juntos = true; a = aj; roceA = -atras; rocePiso = -p; } else resbala();
      }
    }
    if (juntos) { aA = a; aB = a; }
    a = a === null ? null : limpio(a); aA = limpio(aA); aB = limpio(aB); roceA = limpio(roceA); rocePiso = limpio(rocePiso);
    tipoRoce = juntos ? (Math.abs(roceA) > EPS ? 'estatico' : 'ninguno') : (fk > EPS ? 'cinetico' : 'ninguno');
    return { juntos, quietos, a, aA, aB, roceA, roceB: limpio(-roceA), fsMax: fsA, fk, tipoRoce, NAB: mA * g, Npiso: M * g, rocePiso, Fmax,
      recorrido: t => ({ xA: aA * t * t / 2, xB: aB * t * t / 2 }),
      errores: { roceMaximo: fsA, roceConPesoTotal: mus * M * g, FcontraRoceMax: fsA, aSoloB: F / mB } };
  }

  function poleaMovil(o) {
    const m1 = pos(o.m1, 'masa 1'), m2 = pos(o.m2, 'masa 2'), g = o.g === undefined ? G : pos(o.g, 'g');
    // m2: m2·g − T = m2·a2. Polea móvil (ligera) con m1: 2T − m1·g = m1·a1. Ligadura: a1 = a2/2.
    const a2 = limpio(2 * g * (2 * m2 - m1) / (4 * m2 + m1)), a1 = a2 / 2, T = m2 * (g - a2);
    const equilibrio = Math.abs(2 * m2 - m1) < EPS;
    return { a1, a2, T, P1: m1 * g, P2: m2 * g, sostiene: 2 * T, equilibrio,
      sentido: a2 > 0 ? 'm2 baja' : a2 < 0 ? 'm2 sube' : 'quieto',
      recorrido: t => ({ y2: a2 * t * t / 2, y1: a1 * t * t / 2 }),
      errores: { mismaAceleracion: g * (2 * m2 - m1) / (2 * m2 + m1), dobleRapido: 2 * a2, tensionMitadPeso1: m1 * g / 2,
        tensionPeso2: m2 * g, comoAtwood: (m2 - m1) * g / (m1 + m2) } };
  }

  return { G, NOTABLES, trig, plano, piso, planoPolea, mesaPolea, atwood, ascensor, contacto, empujon, resultante, centripeta,
    vertical, loma, curva, tren, apilados, poleaMovil };
});
