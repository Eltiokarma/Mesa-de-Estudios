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

  return { G, NOTABLES, trig, plano, piso, planoPolea, mesaPolea, atwood, ascensor, contacto, empujon, resultante, centripeta };
});
