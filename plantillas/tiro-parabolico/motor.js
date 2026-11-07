/*
 * Motor de tiro parabólico y movimiento circular.
 *
 * Aquí vive toda la física de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual
 * en el navegador (window.MotorTiro) y en Node (require('./motor.js')), donde lo prueban casos.json
 * y papel.json.
 *
 * Unidades SI, g = 10 m/s², sin aire. Ángulos en grados, con los valores de academia para los
 * triángulos notables (sen 37° = 3/5, cos 37° = 4/5; también 53°, 16° y 74°); 30°, 45° y 60° son
 * exactos de por sí. Con { exacto: true }, 37° y 53° usan el seno de verdad. TAU = 2π.
 * Velocidades angulares: omega (rad/s), f (vueltas por segundo) o rpm, cualquiera de las tres.
 *
 * Funciones:
 *   trig(angulo, exacto)                          → { sen, cos }
 *   proyectil({ v0, angulo, x0, y0, g })          lanzamiento desde (x0, y0) con rapidez v0 y ángulo sobre la
 *   proyectil({ vx, vy, x0, y0, g })              horizontal (o con las componentes). y positivo hacia arriba; el
 *                                                 suelo está en y = 0. Devuelve componentes, tiempos, altura
 *                                                 máxima, alcance, velocidad al llegar, estado(t), cuando(y) y puntos(n).
 *   impactoPared({ ...lo de proyectil, d, alto }) pared vertical a la distancia horizontal d (> 0) del punto de
 *                                                 lanzamiento, de altura alto (sin límite si no se da). Devuelve choca,
 *                                                 motivo ('cae-antes' o 'pasa-por-encima' si no choca), t, y, vx, vy, v
 *                                                 y angulo (grados, negativo hacia abajo) en el impacto, sube = vy·t y
 *                                                 cae = g·t²/2 (y = y0 + sube − cae), fase ('subiendo', 'cima' o 'bajando'),
 *                                                 xCima y alcance.
 *   alcanceMaximo(v0, g)                          alcance a 45° si se lanza y cae a la misma altura: v0²/g.
 *   transmision({ r1, r2, omega1 | f1 | rpm1 | v1, tipo })  tipo 'faja', 'cruzada' o 'engranaje': misma v en los
 *                                                 bordes; 'eje': misma ω. Devuelve v1, omega1, omega2, v2, f2, rpm2 y
 *                                                 sentido2 (−1 con engranaje o faja cruzada; +1 en los demás).
 *   tren({ omega1 | f1 | rpm1, ruedas: [{ r }, { r, union: 'faja' | 'cruzada' | 'engranaje' | 'eje' }, ...] })
 *                                                 → [{ r, omega, f, v, sentido }], rueda por rueda.
 *   mcu({ r, periodo | frecuencia | rpm | omega | v })  movimiento circular uniforme: ω, v, T, f, aceleración centrípeta.
 *   mcuv({ r, omega0, alfa, t, frena })           movimiento circular con aceleración angular constante (rad/s²). Con
 *                                                 frena: true, si α va contra ω0 la rueda se queda quieta al detenerse
 *                                                 (tParada); sin frena, la ecuación sigue y la rueda gira al revés.
 *   mcuvDatos({ omega0 | f0 | rpm0, omega | f | rpm, alfa, t, theta | vueltas, r })  con exactamente tres de ω0, ω,
 *                                                 α (rad/s²), t (> 0) y θ (rad; o vueltas), calcula los otros dos, como las
 *                                                 ecuaciones del MRUV. Devuelve omega0, omega, alfa, alfaV (α en vueltas/s²),
 *                                                 t, theta, f0, f, rpm0, rpm y vueltas; con r, también at = α·r, ac0 = ω0²·r
 *                                                 y ac = ω²·r.
 *   encuentroPista({ L | r, v1, v2, sentido, separacion, n })  dos corredores en una pista cerrada de largo L (o 2πr):
 *   encuentroPista({ omega1, omega2, theta0, sentido, n })     A a v1 y B a v2 (rapideces ≥ 0), sentido 'mismo' o
 *                                                 'contrario'; B sale separacion metros adelante de A, medidos en el
 *                                                 sentido de A (0 ≤ separacion < L); en la versión angular L = 2π y
 *                                                 theta0 va en grados. Devuelve el instante t del n-ésimo encuentro
 *                                                 (n = 1, 2, 3…; salir juntos no cuenta), vRel, brecha, periodo, s1, s2,
 *                                                 vueltas1, vueltas2, lugar (s1 mód L, desde la salida de A), lugarGrados,
 *                                                 nunca (si vRel = 0) y estado(t) → { a, b, separacion }.
 *   soltarDelCirculo({ r, omega, theta, t })      el objeto se suelta en el ángulo theta (grados) de un círculo de
 *                                                 radio r centrado en el origen, girando con ω (rad/s, + antihorario),
 *                                                 sin gravedad (vista desde arriba): sigue en línea recta tangente.
 *
 * Cada resultado trae 'errores': los números que salen de las ideas erróneas del informe
 * (docs/investigacion/cinematica-ideas-erroneas.md y dinamica-ideas-erroneas.md), también en el impacto contra
 * una pared, el MCUV con tres datos, la transmisión y los encuentros en una pista.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorTiro = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const G = 10;
  const EPS = 1e-9;
  const TAU = 2 * Math.PI;
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

  // Velocidad angular dada de una de tres formas (rad/s, vueltas por segundo o rpm). Devuelve undefined si no hay ninguna.
  function angular(o, kw, kf, krpm, que) {
    const dados = [kw, kf, krpm].filter(k => o[k] !== undefined);
    if (dados.length > 1) throw new Error(`${que}: da ${kw}, ${kf} o ${krpm}, una sola (no las dos)`);
    if (o[kw] !== undefined) return num(o[kw], que);
    if (o[kf] !== undefined) return TAU * num(o[kf], que);
    if (o[krpm] !== undefined) return TAU * num(o[krpm], que) / 60;
    return undefined;
  }

  function mcuv(o) {
    const r = pos(o.r, 'radio'), w0 = num(o.omega0 || 0, 'ω0'), al = num(o.alfa || 0, 'α'), t = noNeg(o.t, 'tiempo');
    // Si frena (α contra ω0), se detiene en tParada después de girar θparada = ω0²/(2|α|).
    const frena = al !== 0 && w0 !== 0 && Math.sign(al) !== Math.sign(w0);
    const tParada = frena ? -w0 / al : null, thetaParada = frena ? w0 * w0 / (2 * Math.abs(al)) * Math.sign(w0) : null;
    const quieta = !!o.frena && frena && t > tParada;
    const omega = quieta ? 0 : w0 + al * t, theta = quieta ? thetaParada : w0 * t + al * t * t / 2;
    const at = quieta ? 0 : al * r, ac = omega * omega * r;
    return { r, omega, theta, vueltas: theta / TAU, v: omega * r, at, ac, a: Math.hypot(at, ac),
      tParada, thetaParada, vueltasParada: frena ? thetaParada / TAU : null, quieta,
      errores: { acConOmega0: w0 * w0 * r, aSoloTangencial: Math.abs(at),
        // Como si no acelerara (el rectángulo bajo ω0), o con la ω final todo el tiempo
        thetaSoloOmega0: w0 * t, thetaConOmegaFinal: omega * t,
        // Lee los radianes como vueltas
        vueltasSinDosPi: theta,
        // Suma las dos aceleraciones sin Pitágoras
        aSuma: Math.abs(at) + ac,
        // Sigue la fórmula después de detenerse: la rueda «retrocede»
        thetaSinDetenerse: quieta ? w0 * t + al * t * t / 2 : null } };
  }

  // MCUV con tres datos de cinco (ω0, ω, α, t, θ), como las ecuaciones del MRUV.
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
    // Entre las dos raíces de ω² = ω0² + 2αθ, la que se alcanza primero (el menor t > 0).
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
        // Lo que se lee mal en la gráfica ω-t: el rectángulo, el eje o la pendiente en vez del área
        vueltasRectanguloInicial: f0 * T, vueltasRectanguloFinal: f * T,
        vueltasEje: Math.max(Math.abs(f0), Math.abs(f)), vueltasPendiente: Math.abs(f - f0) / T,
        vueltasSinDosPi: TH } };
    if (o.r !== undefined) { const r = pos(o.r, 'radio'); Object.assign(res, { r, at: AL * r, ac0: W0 * W0 * r, ac: W * W * r }); }
    return res;
  }

  // Transmisión entre dos ruedas: unidas por una faja o cadena (abierta o cruzada) o engranadas, el borde de las dos
  // va igual de rápido (misma v); en el mismo eje (coaxiales), giran juntas (misma ω).
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
        // Proporción directa («más grande, más vueltas») o con el radio al cuadrado
        omegaDirecta: w1 * r2 / r1, omegaCuadrado: w1 * (r1 / r2) ** 2,
        // En el eje, como si fuera faja (inversa), o con el radio al cuadrado
        vInversa: v1 * r1 / r2, vCuadrado: v1 * (r2 / r1) ** 2,
        // En el engranaje, creer que giran en el mismo sentido
        sentidoIgual: 1 } };
  }

  // Varias ruedas en cadena: cada una se une a la anterior por faja, faja cruzada, engranaje o eje.
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

  // Dos corredores en una pista cerrada. Posiciones en metros a lo largo de la pista, desde la salida de A y en su sentido.
  function encuentroPista(o) {
    const angularV = o.omega1 !== undefined || o.omega2 !== undefined;
    let L, v1, v2, s0;
    if (angularV) {
      L = TAU; v1 = noNeg(o.omega1, 'ω1'); v2 = noNeg(o.omega2, 'ω2'); s0 = num(o.theta0 || 0, 'θ0') * Math.PI / 180;
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
        // Suma en el alcance (mismo sentido) o resta en el cruce (contrario)
        tConSuma: div(brecha, v1 + v2), tConResta: div(brecha, Math.abs(v1 - v2)),
        // Como si salieran juntos, o la primera brecha multiplicada por n
        tSinSeparacion: div(n * L, vRel), tEnesimo: div(n * brecha, vRel),
        // Lo que tarda el más rápido en dar una vuelta
        tVueltaDelRapido: div(L, Math.max(v1, v2)) } };
  }

  // Pared vertical a la distancia horizontal d del punto de lanzamiento. Sale de proyectil(o): el HTML no calcula nada.
  function impactoPared(o) {
    const d = pos(o.d, 'distancia a la pared');
    const alto = o.alto === undefined || o.alto === null ? Infinity : pos(o.alto, 'altura de la pared');
    const p = proyectil(o), g = p.g;
    if (!(p.vx > 0)) throw new Error('sin velocidad horizontal no llega a la pared');
    const t = d / p.vx;
    const y = p.y0 + p.vy * t - g * t * t / 2;
    const motivo = t >= p.tVuelo - EPS ? 'cae-antes' : y > alto + EPS ? 'pasa-por-encima' : null;
    const choca = !motivo;
    const vyI = limpio(p.vy - g * t), v = Math.hypot(p.vx, vyI);
    const tv = d / p.v0, ysc = p.vy > 0 ? (() => { const tt = d / p.vy; return p.y0 + p.vx * tt - g * tt * tt / 2; })() : null;
    return { d, alto, choca, motivo, vx: p.vx, xCima: p.vx * p.tSubida, alcance: p.alcance, H: p.H, tVuelo: p.tVuelo,
      t: choca ? t : null, y: choca ? limpio(y) : null, vy: choca ? vyI : null, v: choca ? v : null,
      angulo: choca ? Math.atan2(vyI, p.vx) * 180 / Math.PI : null,
      // Lo que sube por su velocidad vertical y lo que cae por la gravedad hasta la pared (y = y0 + sube − cae)
      sube: choca ? p.vy * t : null, cae: choca ? g * t * t / 2 : null,
      fase: choca ? (vyI > EPS ? 'subiendo' : vyI < -EPS ? 'bajando' : 'cima') : null,
      errores: {
        // Llega a la pared en lo más alto; sin gravedad, sigue la línea de mira
        yEnLaCima: p.H, yRecta: p.y0 + d * p.vy / p.vx,
        // Divide la distancia entre la rapidez total
        tConV0: tv, yConTv0: p.y0 + p.vy * tv - g * tv * tv / 2,
        // Seno y coseno cambiados al descomponer (vx = v0·sen θ, vy = v0·cos θ)
        ySenCos: ysc,
        // La rapidez del golpe: suma de componentes, solo la vertical, la de salida o la de llegar al suelo
        vSumaComponentes: choca ? p.vx + Math.abs(vyI) : null, vSoloVertical: choca ? Math.abs(vyI) : null,
        vIgualV0: p.v0, vAlSuelo: p.vFinal.modulo } };
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

  return { G, TAU, NOTABLES, trig, proyectil, impactoPared, alcanceMaximo, mcu, mcuv, mcuvDatos, transmision, tren, encuentroPista, soltarDelCirculo };
});
