/*
 * Motor de tiro parabólico y movimiento circular.
 *
 * Aquí vive toda la física de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual
 * en el navegador (window.MotorTiro) y en Node (require('./motor.js')), donde lo prueban casos.json
 * y papel.json.
 *
 * Unidades SI, g = 10 m/s², sin aire. Ángulos en grados, con los valores de academia para los
 * triángulos notables (sen 37° = 3/5, cos 37° = 4/5; también 53°, 16° y 74°); 30°, 45° y 60° son
 * exactos de por sí. Con { exacto: true }, 37° y 53° usan el seno de verdad.
 *
 * Funciones:
 *   trig(angulo, exacto)                          → { sen, cos }
 *   proyectil({ v0, angulo, x0, y0, g })          lanzamiento desde (x0, y0) con rapidez v0 y ángulo sobre la
 *   proyectil({ vx, vy, x0, y0, g })              horizontal (o con las componentes). y positivo hacia arriba; el
 *                                                 suelo está en y = 0. Devuelve componentes, tiempos, altura
 *                                                 máxima, alcance, velocidad al llegar, estado(t), cuando(y) y puntos(n).
 *   alcanceMaximo(v0, g)                          alcance a 45° si se lanza y cae a la misma altura: v0²/g.
 *   transmision({ r1, r2, omega1, tipo })         'faja': misma v en los bordes; 'eje': misma ω.
 *   mcu({ r, periodo | frecuencia | rpm | omega | v })  movimiento circular uniforme: ω, v, T, f, aceleración centrípeta.
 *   mcuv({ r, omega0, alfa, t })                  movimiento circular con aceleración angular constante.
 *   soltarDelCirculo({ r, omega, theta, t })      el objeto se suelta en el ángulo theta (grados) de un círculo de
 *                                                 radio r centrado en el origen, girando con ω (rad/s, + antihorario),
 *                                                 sin gravedad (vista desde arriba): sigue en línea recta tangente.
 *
 * Cada resultado trae 'errores': los números que salen de las ideas erróneas del informe
 * (docs/investigacion/cinematica-ideas-erroneas.md y dinamica-ideas-erroneas.md).
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorTiro = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const G = 10;
  const EPS = 1e-9;
  const num = (x, que) => { const n = Number(x); if (!Number.isFinite(n)) throw new Error(`${que} inválido: ${x}`); return n; };
  const pos = (x, que) => { const n = num(x, que); if (!(n > 0)) throw new Error(`${que} debe ser mayor que cero: ${x}`); return n; };
  const noNeg = (x, que) => { const n = num(x === undefined ? 0 : x, que); if (n < 0) throw new Error(`${que} no puede ser negativo: ${x}`); return n; };
  const limpio = x => (Math.abs(x) < EPS ? 0 : x);

  const R3 = Math.sqrt(3), R2 = Math.SQRT2;
  const NOTABLES = { 0: [0, 1], 16: [7 / 25, 24 / 25], 30: [1 / 2, R3 / 2], 37: [3 / 5, 4 / 5], 45: [R2 / 2, R2 / 2],
    53: [4 / 5, 3 / 5], 60: [R3 / 2, 1 / 2], 74: [24 / 25, 7 / 25], 90: [1, 0] };
  function trig(angulo, exacto) {
    const a = num(angulo, 'ángulo'), k = Math.abs(a), s = Math.sign(a) || 1;
    if (Object.prototype.hasOwnProperty.call(NOTABLES, k) && !(exacto && (k === 37 || k === 53 || k === 16 || k === 74))) {
      const [sen, cos] = NOTABLES[k];
      return { sen: s * sen, cos };
    }
    const r = a * Math.PI / 180;
    return { sen: Math.sin(r), cos: Math.cos(r) };
  }

  function proyectil(o) {
    const g = o.g === undefined ? G : pos(o.g, 'g');
    const x0 = num(o.x0 || 0, 'x0'), y0 = noNeg(o.y0, 'altura inicial');
    let vx, vy, v0, angulo;
    if (o.vx !== undefined || o.vy !== undefined) {
      vx = noNeg(o.vx, 'vx'); vy = num(o.vy || 0, 'vy');
      v0 = Math.hypot(vx, vy); angulo = Math.atan2(vy, vx) * 180 / Math.PI;
    } else {
      v0 = noNeg(o.v0, 'rapidez'); angulo = num(o.angulo || 0, 'ángulo');
      if (angulo < -90 || angulo > 90) throw new Error('el ángulo va de −90° a 90°');
      const t = trig(angulo, o.exacto); vx = limpio(v0 * t.cos); vy = limpio(v0 * t.sen);
    }
    if (y0 === 0 && vy <= 0) throw new Error('desde el suelo hay que lanzar hacia arriba');
    // Tiempos: sube mientras vy > 0; llega al suelo cuando y = 0 (la raíz positiva).
    const tSubida = vy > 0 ? vy / g : 0;
    const H = y0 + (vy > 0 ? vy * vy / (2 * g) : 0);
    const tVuelo = (vy + Math.sqrt(vy * vy + 2 * g * y0)) / g;
    const alcance = vx * tVuelo;
    const vyFinal = vy - g * tVuelo;
    const estado = t => {
      const y = y0 + vy * t - g * t * t / 2, vyt = vy - g * t;
      return { t, x: x0 + vx * t, y, vx, vy: limpio(vyt), ax: 0, ay: -g, v: Math.hypot(vx, vyt) };
    };
    // Instantes en que el proyectil pasa por la altura h (0, 1 o 2), dentro del vuelo.
    function cuando(h) {
      const D = vy * vy - 2 * g * (num(h, 'altura') - y0);
      if (D < -EPS) return [];
      const r = Math.sqrt(Math.max(0, D)), ts = [(vy - r) / g, (vy + r) / g].filter(t => t >= -EPS && t <= tVuelo + EPS).map(t => Math.max(0, t));
      return ts.filter((t, k) => k === 0 || Math.abs(t - ts[0]) > 1e-9);
    }
    function puntos(n) { n = n || 120; const r = []; for (let k = 0; k <= n; k++) r.push(estado(tVuelo * k / n)); return r; }
    const sc = trig(angulo, o.exacto);
    return { g, x0, y0, v0, angulo, vx, vy, tSubida, H, tVuelo, alcance, vCima: vx,
      vFinal: { vx, vy: vyFinal, modulo: Math.hypot(vx, vyFinal), angulo: Math.atan2(vyFinal, vx) * 180 / Math.PI },
      estado, cuando, puntos,
      errores: {
        // Cambiar seno y coseno al descomponer
        vxConSeno: v0 * sc.sen, vyConCoseno: v0 * sc.cos,
        // (desde el suelo el alcance no cambia, porque sale 2·sen·cos igual; sí cambian el tiempo y la altura)
        tSubidaSenCos: v0 * sc.cos / g, HSenCos: y0 + (v0 * sc.cos) ** 2 / (2 * g),
        // Usar el tiempo de subida como tiempo de vuelo
        alcanceSoloSubida: vx * tSubida,
        // Multiplicar la rapidez total por el tiempo
        alcanceConV0: v0 * tVuelo,
        // Velocidad cero en la cima, o la rapidez inicial conservada
        vCimaCero: 0, vCimaIgualV0: v0,
        // Tiempo de caída de algo soltado desde la misma altura (el que se compara en P1 y P2)
        tSoltado: Math.sqrt(2 * y0 / g) } };
  }

  const alcanceMaximo = (v0, g) => { const gg = g === undefined ? G : pos(g, 'g'); const v = noNeg(v0, 'rapidez'); return v * v / gg; };

  function mcu(o) {
    const r = pos(o.r, 'radio');
    let omega;
    if (o.omega !== undefined) omega = num(o.omega, 'ω');
    else if (o.v !== undefined) omega = num(o.v, 'rapidez') / r;
    else if (o.periodo !== undefined) omega = 2 * Math.PI / pos(o.periodo, 'periodo');
    else if (o.frecuencia !== undefined) omega = 2 * Math.PI * pos(o.frecuencia, 'frecuencia');
    else if (o.rpm !== undefined) omega = 2 * Math.PI * pos(o.rpm, 'rpm') / 60;
    else throw new Error('falta ω, v, periodo, frecuencia o rpm');
    const w = Math.abs(omega), v = w * r;
    return { r, omega, v, periodo: w ? 2 * Math.PI / w : Infinity, frecuencia: w / (2 * Math.PI), rpm: w * 60 / (2 * Math.PI),
      ac: w * w * r, angulo: t => omega * t,
      errores: { acSinCuadrado: v / r, acPorRadio: v * v * r, acCero: 0 } };
  }

  function mcuv(o) {
    const r = pos(o.r, 'radio'), w0 = num(o.omega0 || 0, 'ω0'), al = num(o.alfa || 0, 'α'), t = noNeg(o.t, 'tiempo');
    const omega = w0 + al * t, theta = w0 * t + al * t * t / 2;
    const at = al * r, ac = omega * omega * r;
    // Si frena (α contra ω0), se detiene en tParada después de girar θparada = ω0²/(2|α|).
    const frena = al !== 0 && w0 !== 0 && Math.sign(al) !== Math.sign(w0);
    const tParada = frena ? -w0 / al : null, thetaParada = frena ? w0 * w0 / (2 * Math.abs(al)) * Math.sign(w0) : null;
    return { r, omega, theta, vueltas: theta / (2 * Math.PI), v: omega * r, at, ac, a: Math.hypot(at, ac),
      tParada, thetaParada, vueltasParada: frena ? thetaParada / (2 * Math.PI) : null,
      errores: { acConOmega0: w0 * w0 * r, aSoloTangencial: Math.abs(at) } };
  }

  // Transmisión entre dos ruedas: unidas por una faja (o engranadas), el borde de las dos va igual de rápido
  // (misma v); en el mismo eje (coaxiales), giran juntas (misma ω).
  function transmision(o) {
    const r1 = pos(o.r1, 'radio 1'), r2 = pos(o.r2, 'radio 2'), w1 = num(o.omega1, 'ω1');
    if (o.tipo !== 'faja' && o.tipo !== 'eje') throw new Error("tipo debe ser 'faja' o 'eje'");
    const v1 = w1 * r1;
    const omega2 = o.tipo === 'faja' ? v1 / r2 : w1;
    return { v1, omega2, v2: omega2 * r2, errores: { omegaIgualConFaja: w1, vIgualEnEje: v1 } };
  }

  // Vista desde arriba, sin gravedad: al soltarse, el objeto sigue con la velocidad que tenía (tangente).
  function soltarDelCirculo(o) {
    const r = pos(o.r, 'radio'), w = num(o.omega, 'ω'), t = noNeg(o.t, 'tiempo');
    const { sen, cos } = trig(o.theta || 0, o.exacto), th = Math.atan2(sen, cos); // ángulos notables como en academia
    const px = r * cos, py = r * sen;
    const vx = -w * r * sen, vy = w * r * cos;
    const x = px + vx * t, y = py + vy * t;
    return { suelta: { x: limpio(px), y: limpio(py) }, vx: limpio(vx), vy: limpio(vy), x: limpio(x), y: limpio(y), distanciaAlCentro: Math.hypot(x, y),
      // Lo que dirían las ideas erróneas: sigue en el círculo, o sale en línea recta hacia afuera.
      errores: { sigueCurvando: { x: r * Math.cos(th + w * t), y: r * Math.sin(th + w * t) },
        haciaAfuera: { x: px + cos * Math.abs(w) * r * t, y: py + sen * Math.abs(w) * r * t } } };
  }

  return { G, NOTABLES, trig, proyectil, alcanceMaximo, mcu, mcuv, transmision, soltarDelCirculo };
});
