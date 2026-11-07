/*
 * Motor de choques: impulso, cantidad de movimiento, choques, centro de masa, explosiones y péndulo balístico.
 *
 * Aquí vive toda la física de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorChoques) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Unidades SI (kg, m/s, N, s, J, N·s = kg·m/s) y g = 10 m/s². Ángulos en grados con los valores de academia:
 * sen 37° = 3/5 y cos 37° = 4/5 (también 53°, 16° y 74°); 30°, 45° y 60° exactos; cualquier otro, el seno real.
 * En una recta, las velocidades llevan signo: positivo hacia la derecha. El cuerpo 1 empieza a la izquierda del 2.
 *
 * Funciones:
 *   trig(angulo)                          → { sen, cos }
 *   choque({ m1, v1, m2, v2, e })          choque en una recta con coeficiente de restitución e (1 elástico,
 *                                          0 plástico: quedan juntos). Si 1 no alcanza a 2 (v1 ≤ v2), no chocan.
 *                                          Da las velocidades finales v1f y v2f, p y Ec de cada cuerpo antes y después,
 *                                          la Ec perdida, el impulso que recibe cada uno (J1 = −J2) y la velocidad
 *                                          del centro de masa (vcm), que el choque no cambia.
 *   escenario({ m1, v1, m2, v2, e, x1, x2, d })  el mismo choque en el tiempo: los centros parten de x1 y x2 y se
 *                                          tocan cuando están a la distancia d. estado(t) → { x1, x2, v1, v2, xcm }.
 *   choque2D({ m1, v1, ang1, m2, v2, ang2, w1, angw1 })  choque en un plano, por componentes (ángulos desde +x).
 *                                          Sin w1: quedan juntos (plástico). Con w1 y angw1 (la velocidad final
 *                                          del 1): la del 2 sale de conservar p en x y en y.
 *   pared({ m, v, e, dt })                 pelota que llega a v (positiva hacia la pared) y rebota con e·v.
 *                                          Fpared: fuerza media de la pelota sobre la pared (positiva hacia la pared).
 *   rebotePiso({ h1, h2 })                 pelota soltada desde h1 que rebota hasta h2: e = √(h2/h1) y las rapideces.
 *   impulso({ m, v1, v2, dt })             cambio de cantidad de movimiento Δp = m(v2 − v1) y fuerza media Δp/Δt.
 *   pulso({ J, dt, forma, t0 })            gráfica F-t de un golpe de impulso J en dt segundos ('triangulo',
 *                                          'rectangulo' o 'seno'): Fmedia = J/dt, Fmax, F(t) y puntos(n).
 *   areaFt(puntos)                         área bajo una gráfica F-t de tramos rectos [[t, F], …] (el impulso).
 *   centroMasa(cuerpos)                    cuerpos [{ m, x, y }] → { x, y, M } y el error de no pesar por la masa.
 *   explosion({ m1, m2, v2, V })           un cuerpo de masa m1 + m2 que va a V (0: en reposo) se parte; el trozo 2
 *                                          sale a v2. Da v1, la Ec que aparece y estado(t, x1, x2) con el
 *                                          centro de masa, que sigue a V.
 *   pendulo({ mb, v, M, L })               péndulo balístico: la bala mb a v se incrusta en el bloque M colgado.
 *                                          Choque (conserva p) y subida (conserva energía): V, h, Ec perdida y,
 *                                          si se da el largo L del hilo, el ángulo θ con cos θ = 1 − h/L.
 *   penduloInverso({ mb, M, h })           al revés: de la altura h a la rapidez v de la bala.
 *
 * Cada resultado que es la respuesta de una predicción trae 'errores': los números que salen de las ideas
 * erróneas de docs/investigacion/momento-gravitacion-ondas-ideas-erroneas.md (M1 a M7 y las hipótesis de
 * cálculo de ese informe). La escena los usa para las opciones incorrectas.
 * Signos: positivo a la derecha; en pared() e impulso(), v1 y v2 con signo; Fpared y Fmedia en N; J en N·s.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorChoques = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const G = 10;
  const EPS = 1e-9;
  const num = (x, que) => { const n = Number(x); if (x === undefined || x === null || x === '' || !Number.isFinite(n)) throw new Error(`${que} inválido: ${x}`); return n; };
  const pos = (x, que) => { const n = num(x, que); if (!(n > 0)) throw new Error(`${que} debe ser mayor que cero: ${x}`); return n; };
  const limpio = x => (Math.abs(x) < EPS ? 0 : Math.abs(x - Math.round(x)) < 1e-9 * Math.max(1, Math.abs(x)) ? Math.round(x) : x);
  const ec = (m, v) => m * v * v / 2;

  // Triángulos notables de academia: [sen, cos].
  const R3 = Math.sqrt(3), R2 = Math.SQRT2;
  const NOTABLES = { 0: [0, 1], 16: [7 / 25, 24 / 25], 30: [1 / 2, R3 / 2], 37: [3 / 5, 4 / 5], 45: [R2 / 2, R2 / 2],
    53: [4 / 5, 3 / 5], 60: [R3 / 2, 1 / 2], 74: [24 / 25, 7 / 25], 90: [1, 0] };
  // Cualquier ángulo: se lleva a 0°–360° y se usa el notable del cuadrante (127° = 180° − 53°, etc.).
  function trig(angulo) {
    const a = num(angulo, 'ángulo'), r = ((a % 360) + 360) % 360;
    // ref: ángulo de referencia; sx, sy: signos de cos y sen.
    let ref, sx, sy;
    if (r <= 90) { ref = r; sx = 1; sy = 1; } else if (r <= 180) { ref = 180 - r; sx = -1; sy = 1; }
    else if (r <= 270) { ref = r - 180; sx = -1; sy = -1; } else { ref = 360 - r; sx = 1; sy = -1; }
    const k = Math.round(ref * 1e9) / 1e9;
    if (Object.prototype.hasOwnProperty.call(NOTABLES, k)) {
      const [s, c] = NOTABLES[k];
      return { sen: limpio(sy * s), cos: limpio(sx * c) };
    }
    const rad = a * Math.PI / 180;
    return { sen: Math.sin(rad), cos: Math.cos(rad) };
  }
  const restitucion = e => { const n = e === undefined ? 1 : num(e, 'coeficiente de restitución'); if (n < 0 || n > 1) throw new Error(`el coeficiente de restitución va de 0 a 1: ${e}`); return n; };

  // ---------- Choque en una recta ----------
  function choque(o) {
    const m1 = pos(o.m1, 'masa 1'), m2 = pos(o.m2, 'masa 2');
    const v1 = num(o.v1, 'velocidad 1'), v2 = num(o.v2 === undefined ? 0 : o.v2, 'velocidad 2');
    const e = restitucion(o.e);
    const M = m1 + m2, P = m1 * v1 + m2 * v2, vcm = P / M;
    const chocan = v1 - v2 > EPS;
    // Conservación de p y e = (v2f − v1f)/(v1 − v2).
    const v1f = chocan ? limpio((P - m2 * e * (v1 - v2)) / M) : v1;
    const v2f = chocan ? limpio((P + m1 * e * (v1 - v2)) / M) : v2;
    const EcAntes = ec(m1, v1) + ec(m2, v2), EcDespues = ec(m1, v1f) + ec(m2, v2f);
    const perdida = limpio(EcAntes - EcDespues);
    const J2 = limpio(m2 * (v2f - v2));
    const tipo = !chocan ? 'no chocan' : e === 1 ? 'elástico' : e === 0 ? 'plástico' : 'inelástico';
    const vEc = Math.sign(P || 1) * Math.sqrt(2 * EcAntes / M);
    return {
      chocan, tipo, e, M, vcm: limpio(vcm), v1f, v2f, juntos: chocan && e === 0,
      p1: limpio(m1 * v1), p2: limpio(m2 * v2), pAntes: limpio(P), p1f: limpio(m1 * v1f), p2f: limpio(m2 * v2f), pDespues: limpio(m1 * v1f + m2 * v2f),
      Ec1: limpio(ec(m1, v1)), Ec2: limpio(ec(m2, v2)), EcAntes: limpio(EcAntes), Ec1f: limpio(ec(m1, v1f)), Ec2f: limpio(ec(m2, v2f)), EcDespues: limpio(EcDespues),
      EcPerdida: perdida, fraccionPerdida: EcAntes > EPS ? limpio(perdida / EcAntes) : 0,
      J1: limpio(-J2), J2, acercamiento: limpio(v1 - v2), alejamiento: limpio(v2f - v1f),
      errores: {
        // M1: cada cuerpo conserva lo suyo (el 1 sigue como venía).
        sigueIgual: v1,
        // Promediar las velocidades sin pesar por las masas.
        promedioSinMasas: limpio((v1 + v2) / 2),
        // Choque plástico resuelto conservando la energía cinética (hipótesis que sale de M5).
        conservaEc: limpio(vEc), pSiConservaEc: limpio(M * vEc), EcSiSeConservara: limpio(EcAntes),
        // Elástico con masas distintas: "intercambian velocidades" (solo vale con masas iguales).
        intercambian1: v2, intercambian2: v1,
        // Elástico resuelto como si quedaran juntos.
        comoPlastico: limpio(vcm),
        // El 1 rebota como contra una pared y el 2 no se mueve.
        rebotaComoPared1: limpio(-e * (v1 - v2) + v2), rebotaComoPared2: v2,
        // La Ec de un solo cuerpo después del choque, o la perdida leída como la que queda.
        EcSoloDe1: limpio(ec(m1, v1f)), perdidaComoFinal: perdida,
      },
    };
  }

  function escenario(o) {
    const c = choque(o);
    const x1 = num(o.x1 === undefined ? 0 : o.x1, 'posición 1'), x2 = num(o.x2 === undefined ? 1 : o.x2, 'posición 2');
    const d = num(o.d === undefined ? 0 : o.d, 'distancia de contacto');
    if (x2 - x1 < d - EPS) throw new Error('los cuerpos empiezan encimados');
    const v1 = num(o.v1, 'velocidad 1'), v2 = num(o.v2 === undefined ? 0 : o.v2, 'velocidad 2');
    const m1 = Number(o.m1), m2 = Number(o.m2);
    const tChoque = c.chocan ? limpio((x2 - x1 - d) / (v1 - v2)) : null;
    function estado(t) {
      const antes = tChoque === null || t <= tChoque;
      const s = antes ? t : t - tChoque, a1 = antes ? x1 : x1 + v1 * tChoque, a2 = antes ? x2 : x2 + v2 * tChoque;
      const u1 = antes ? v1 : c.v1f, u2 = antes ? v2 : c.v2f;
      const X1 = a1 + u1 * s, X2 = a2 + u2 * s;
      return { x1: X1, x2: X2, v1: u1, v2: u2, xcm: (m1 * X1 + m2 * X2) / (m1 + m2), choco: !antes };
    }
    return Object.assign({}, c, { tChoque, estado, xcm0: (m1 * x1 + m2 * x2) / (m1 + m2) });
  }

  // ---------- Choque en un plano ----------
  function vector(v, ang, que) {
    const r = num(v, que), t = trig(ang === undefined ? 0 : ang);
    return { x: limpio(r * t.cos), y: limpio(r * t.sen) };
  }
  const angulo = (x, y) => (Math.hypot(x, y) < EPS ? 0 : limpio(((Math.atan2(y, x) * 180 / Math.PI) + 360) % 360));
  function choque2D(o) {
    const m1 = pos(o.m1, 'masa 1'), m2 = pos(o.m2, 'masa 2'), M = m1 + m2;
    const u1 = vector(o.v1, o.ang1, 'velocidad 1'), u2 = vector(o.v2 === undefined ? 0 : o.v2, o.ang2, 'velocidad 2');
    const px = limpio(m1 * u1.x + m2 * u2.x), py = limpio(m1 * u1.y + m2 * u2.y);
    const EcAntes = limpio(ec(m1, Math.hypot(u1.x, u1.y)) + ec(m2, Math.hypot(u2.x, u2.y)));
    const r = { px, py, p: limpio(Math.hypot(px, py)), pAngulo: angulo(px, py), EcAntes,
      p1: limpio(m1 * Math.hypot(u1.x, u1.y)), p2: limpio(m2 * Math.hypot(u2.x, u2.y)) };
    if (o.w1 === undefined) {
      const vx = limpio(px / M), vy = limpio(py / M), v = limpio(Math.hypot(vx, vy));
      const EcDespues = limpio(ec(M, v));
      return Object.assign(r, { juntos: true, vx, vy, v, ang: angulo(vx, vy), EcDespues, EcPerdida: limpio(EcAntes - EcDespues),
        errores: {
          // p como escalar: se suman los módulos sin mirar la dirección (M2).
          sumaModulos: limpio((r.p1 + r.p2) / M),
          // Se suman las rapideces y se promedian, sin masas ni direcciones.
          promedioRapideces: limpio((Math.hypot(u1.x, u1.y) + Math.hypot(u2.x, u2.y)) / 2),
        } });
    }
    const w1 = vector(o.w1, o.angw1, 'velocidad final 1');
    const wx = limpio((px - m1 * w1.x) / m2), wy = limpio((py - m1 * w1.y) / m2), w = limpio(Math.hypot(wx, wy));
    const EcDespues = limpio(ec(m1, Math.hypot(w1.x, w1.y)) + ec(m2, w));
    return Object.assign(r, { juntos: false, w1x: w1.x, w1y: w1.y, w2x: wx, w2y: wy, w2: w, angw2: angulo(wx, wy), EcDespues,
      EcPerdida: limpio(EcAntes - EcDespues), elastico: Math.abs(EcAntes - EcDespues) < 1e-9 * Math.max(1, EcAntes),
      errores: { restaModulos: limpio((r.p1 + r.p2 - m1 * Math.hypot(w1.x, w1.y)) / m2) } });
  }

  // ---------- Impulso ----------
  function pared(o) {
    const m = pos(o.m, 'masa'), v = pos(o.v, 'rapidez de llegada'), dt = pos(o.dt, 'tiempo de contacto');
    const e = restitucion(o.e);
    const vRebote = limpio(-e * v);
    const dp = limpio(m * (vRebote - v)); // sobre la pelota, positivo hacia la pared
    return { vRebote, dp, J: dp, Jpared: -dp, Fpelota: limpio(dp / dt), Fpared: limpio(-dp / dt),
      errores: {
        // M3: "empujan igual" porque llegan igual: se toma solo el frenado, como si se pegara.
        comoSiSePegara: limpio(m * v / dt),
        // M2: restar las rapideces sin signo.
        restaRapideces: limpio(m * Math.abs(v - e * v) / dt),
      } };
  }
  function rebotePiso(o) {
    const h1 = pos(o.h1, 'altura inicial'), h2 = num(o.h2, 'altura del rebote');
    const g = o.g === undefined ? G : pos(o.g, 'g');
    if (h2 < 0 || h2 > h1 + EPS) throw new Error('el rebote va de 0 a la altura inicial');
    return { e: limpio(Math.sqrt(h2 / h1)), vLlega: limpio(Math.sqrt(2 * g * h1)), vSale: limpio(Math.sqrt(2 * g * h2)),
      errores: { sinRaiz: limpio(h2 / h1) } };
  }
  function impulso(o) {
    const m = pos(o.m, 'masa'), v1 = num(o.v1, 'velocidad inicial'), v2 = num(o.v2, 'velocidad final'), dt = pos(o.dt, 'tiempo');
    const dp = limpio(m * (v2 - v1));
    return { p1: limpio(m * v1), p2: limpio(m * v2), dp, J: dp, Fmedia: limpio(dp / dt), FmediaModulo: limpio(Math.abs(dp / dt)),
      errores: {
        // M2: se restan las rapideces, sin el sentido.
        dpRestaRapideces: limpio(m * Math.abs(Math.abs(v1) - Math.abs(v2))), FRestaRapideces: limpio(m * Math.abs(Math.abs(v1) - Math.abs(v2)) / dt),
        // Solo lo que cuesta frenarla, sin lanzarla de vuelta.
        FSoloFrenado: limpio(m * Math.abs(v1) / dt),
        // Δp tomado como si fuera la fuerza (sin dividir entre Δt).
        FSinDividir: Math.abs(dp),
      } };
  }
  function pulso(o) {
    const J = num(o.J, 'impulso'), dt = pos(o.dt, 'duración'), t0 = num(o.t0 === undefined ? 0 : o.t0, 'inicio');
    const forma = o.forma || 'triangulo';
    const Fmedia = limpio(J / dt);
    let Fmax, F;
    if (forma === 'rectangulo') { Fmax = Fmedia; F = t => (t >= t0 && t <= t0 + dt ? Fmax : 0); }
    else if (forma === 'triangulo') { Fmax = limpio(2 * J / dt); F = t => (t < t0 || t > t0 + dt ? 0 : Fmax * (1 - Math.abs(2 * (t - t0) / dt - 1))); }
    else if (forma === 'seno') { Fmax = Math.PI * J / (2 * dt); F = t => (t < t0 || t > t0 + dt ? 0 : Fmax * Math.sin(Math.PI * (t - t0) / dt)); }
    else throw new Error(`forma desconocida: ${forma}`);
    function puntos(n) {
      n = Math.max(2, n || 60);
      if (forma === 'rectangulo') return [[t0, 0], [t0, Fmax], [t0 + dt, Fmax], [t0 + dt, 0]];
      if (forma === 'triangulo') return [[t0, 0], [t0 + dt / 2, Fmax], [t0 + dt, 0]];
      return Array.from({ length: n + 1 }, (_, k) => [t0 + dt * k / n, F(t0 + dt * k / n)]);
    }
    return { J, dt, forma, Fmedia, Fmax, F, puntos,
      errores: { FmaxPorDt: limpio(Fmax * dt), sinDividir: J } };
  }
  function areaFt(puntos) {
    if (!Array.isArray(puntos) || puntos.length < 2) throw new Error('hacen falta al menos dos puntos');
    let a = 0;
    for (let k = 1; k < puntos.length; k++) {
      const [t1, F1] = puntos[k - 1].map(Number), [t2, F2] = puntos[k].map(Number);
      if (t2 < t1 - EPS) throw new Error('los tiempos deben ir en orden');
      a += (F1 + F2) / 2 * (t2 - t1);
    }
    return limpio(a);
  }

  // ---------- Centro de masa ----------
  function centroMasa(cuerpos) {
    if (!Array.isArray(cuerpos) || !cuerpos.length) throw new Error('hace falta al menos un cuerpo');
    let M = 0, sx = 0, sy = 0, px = 0, py = 0;
    for (const c of cuerpos) { const m = pos(c.m, 'masa'); M += m; sx += m * num(c.x || 0, 'x'); sy += m * num(c.y || 0, 'y'); px += Number(c.x || 0); py += Number(c.y || 0); }
    return { M: limpio(M), x: limpio(sx / M), y: limpio(sy / M),
      errores: { sinPesarX: limpio(px / cuerpos.length), sinPesarY: limpio(py / cuerpos.length) } };
  }

  // ---------- Explosión y retroceso ----------
  function explosion(o) {
    const m1 = pos(o.m1, 'masa 1'), m2 = pos(o.m2, 'masa 2'), v2 = num(o.v2, 'velocidad 2');
    const V = num(o.V === undefined ? 0 : o.V, 'velocidad inicial'), M = m1 + m2;
    const v1 = limpio((M * V - m2 * v2) / m1);
    const EcAntes = limpio(ec(M, V)), EcDespues = limpio(ec(m1, v1) + ec(m2, v2));
    function estado(t, x1, x2) {
      const X1 = x1 + v1 * t, X2 = x2 + v2 * t;
      return { x1: X1, x2: X2, xcm: (m1 * X1 + m2 * X2) / M, medio: (X1 + X2) / 2 };
    }
    return { v1, v2, V, pAntes: limpio(M * V), p1: limpio(m1 * v1), p2: limpio(m2 * v2), pDespues: limpio(m1 * v1 + m2 * v2),
      EcAntes, Ec1: limpio(ec(m1, v1)), Ec2: limpio(ec(m2, v2)), EcDespues, EcLiberada: limpio(EcDespues - EcAntes), vcm: V, vPuntoMedio: limpio((v1 + v2) / 2), estado,
      errores: {
        // La misma rapidez para los dos trozos, en sentidos opuestos.
        mismaRapidez: limpio(V === 0 ? -v2 : 2 * V - v2),
        // Las masas al revés: v1 = −m1·v2/m2.
        masasAlReves: limpio((M * V - m1 * v2) / m2),
        // El centro de masa "sigue al punto medio" entre los trozos, o a uno de ellos.
        vcmPuntoMedio: limpio((v1 + v2) / 2), vcmSigue1: v1, vcmSigue2: v2,
      } };
  }

  // ---------- Péndulo balístico ----------
  function pendulo(o) {
    const mb = pos(o.mb, 'masa de la bala'), v = pos(o.v, 'rapidez de la bala'), M = pos(o.M, 'masa del bloque');
    const g = o.g === undefined ? G : pos(o.g, 'g');
    const V = limpio(mb * v / (mb + M)), h = limpio(V * V / (2 * g));
    const EcBala = limpio(ec(mb, v)), EcJuntos = limpio(ec(mb + M, V));
    const r = { V, h, EcBala, EcJuntos, Ep: limpio((mb + M) * g * h), EcPerdida: limpio(EcBala - EcJuntos),
      fraccionPerdida: limpio(M / (mb + M)), p: limpio(mb * v),
      // La subida como fracción del cuarto de vaivén (f de 0 a 1): el ángulo sigue θmax·sen(f·90°).
      subida: null, theta: null,
      errores: {
        // M6, solo energía: toda la Ec de la bala sube al bloque con la bala.
        hSoloEnergia: limpio(EcBala / ((mb + M) * g)),
        // Sin el 2 de ½·v²: h = V²/g.
        hSinMedio: limpio(V * V / g),
        // La rapidez V leída como la altura (en metros).
        hIgualV: V,
        // Solo cantidad de movimiento, sin pesar el bloque: el bloque sale a la rapidez de la bala.
        VSinBloque: v,
      } };
    if (o.L !== undefined) {
      const L = pos(o.L, 'largo del hilo');
      if (h > 2 * L + EPS) throw new Error('con esa rapidez el bloque da la vuelta completa');
      const c = 1 - h / L;
      r.cosTheta = limpio(c);
      r.theta = limpio(Math.acos(Math.max(-1, Math.min(1, c))) * 180 / Math.PI);
      r.subida = f => r.theta * Math.sin(Math.max(0, Math.min(1, f)) * Math.PI / 2);
    }
    return r;
  }
  function penduloInverso(o) {
    const mb = pos(o.mb, 'masa de la bala'), M = pos(o.M, 'masa del bloque'), h = pos(o.h, 'altura');
    const g = o.g === undefined ? G : pos(o.g, 'g');
    const V = limpio(Math.sqrt(2 * g * h)), v = limpio((mb + M) / mb * V);
    return { V, v, errores: {
      // M6, solo energía: ½·mb·v² = (mb + M)·g·h.
      vSoloEnergia: limpio(Math.sqrt(2 * g * h * (mb + M) / mb)),
      // Se olvida que la bala y el bloque suben juntos: v = V.
      vIgualV: V,
    } };
  }

  return { G, NOTABLES, trig, choque, escenario, choque2D, pared, rebotePiso, impulso, pulso, areaFt, centroMasa, explosion, pendulo, penduloInverso };
});
