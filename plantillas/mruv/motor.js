/*
 * Motor de MRUV y gráficas (movimiento rectilíneo y caída libre).
 *
 * Aquí vive toda la física de la plantilla (regla 1 de CLAUDE.md). No toca el
 * DOM: funciona igual en el navegador (window.MotorMRUV) y en Node
 * (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Unidades SI y g = 10 m/s². Un móvil se describe por tramos de aceleración
 * constante:
 *
 *   movil({ x0: 0, v0: 4, a: 2 })                       // un solo tramo, sin fin
 *   movil({ x0: 0, v0: 20, a: -4, frena: true })         // al llegar a v = 0 se queda quieto
 *   movil({ x0: 0, v0: 0, tramos: [{ dur: 3, a: 2 }, { dur: 4, a: 0 }, { a: -1 }] })
 *
 * Con frena: true, el móvil se detiene cuando su velocidad llega a cero y ya no
 * retrocede (un auto que frena no da marcha atrás). Sin frena, las ecuaciones
 * siguen valiendo después de v = 0: es lo que pasa con una piedra lanzada hacia
 * arriba, que sube, se detiene un instante y baja.
 *
 * Devuelve un objeto con x(t), v(t), a(t), los instantes donde empieza cada tramo,
 * tParada (si frena), desplazamiento(t1, t2), distancia(t1, t2) (lo recorrido, sin
 * restar idas y vueltas) y puntos(tmax, n) para las gráficas.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorMRUV = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const G = 10;
  const EPS = 1e-12;
  const num = (x, que) => { const n = Number(x); if (!Number.isFinite(n)) throw new Error(`${que} inválido: ${x}`); return n; };

  function movil(o) {
    const x0 = num(o.x0 || 0, 'x0'), v0 = num(o.v0 || 0, 'v0');
    let crudos = o.tramos ? o.tramos.map(t => ({ dur: t.dur === undefined ? Infinity : num(t.dur, 'duración'), a: num(t.a || 0, 'aceleración') }))
      : [{ dur: Infinity, a: num(o.a || 0, 'aceleración') }];
    if (!crudos.length) throw new Error('hace falta al menos un tramo');
    crudos.forEach((t, k) => {
      if (!(t.dur > 0)) throw new Error('cada tramo dura más de cero');
      if (t.dur === Infinity && k < crudos.length - 1) throw new Error('solo el último tramo puede no tener fin');
    });
    if (crudos[crudos.length - 1].dur !== Infinity) crudos.push({ dur: Infinity, a: 0 }); // después del último, sigue con v constante
    // Segmentos con su estado inicial. Con frena, un tramo que lleva v a cero se parte allí y el resto queda en reposo.
    const segs = [];
    let t = 0, x = x0, v = v0, parado = false, tParada = null;
    for (const tr of crudos) {
      let a = parado ? 0 : tr.a, dur = tr.dur;
      if (o.frena && !parado && Math.abs(v) > EPS && a !== 0 && Math.sign(a) !== Math.sign(v)) {
        const tc = -v / a;
        if (tc < dur - EPS) {
          segs.push({ t0: t, x0: x, v0: v, a, dur: tc });
          x += v * tc + a * tc * tc / 2; t += tc; v = 0; parado = true; tParada = t;
          dur -= tc; a = 0;
        }
      }
      if (o.frena && !parado && Math.abs(v) <= EPS && a !== 0 && t > 0) { parado = true; tParada = t; a = 0; }
      segs.push({ t0: t, x0: x, v0: v, a, dur });
      if (dur === Infinity) break;
      x += v * dur + a * dur * dur / 2; v += a * dur; t += dur;
      if (o.frena && Math.abs(v) <= 1e-9 && !parado) { v = 0; parado = true; tParada = t; }
      if (parado) v = 0;
    }
    const seg = tt => { let k = 0; while (k < segs.length - 1 && tt >= segs[k + 1].t0 - EPS) k++; return segs[k]; };
    const X = tt => { const s = seg(tt), d = tt - s.t0; return s.x0 + s.v0 * d + s.a * d * d / 2; };
    const Vf = tt => { const s = seg(tt); return s.v0 + s.a * (tt - s.t0); };
    const A = tt => seg(tt).a;
    // Instantes donde v cambia de signo dentro de [t1, t2] (para la distancia recorrida).
    function giros(t1, t2) {
      const r = [];
      for (const s of segs) {
        if (s.a === 0) continue;
        const tc = s.t0 - s.v0 / s.a;
        if (tc > Math.max(t1, s.t0) + EPS && tc < Math.min(t2, s.t0 + s.dur) - EPS) r.push(tc);
      }
      return r;
    }
    function distancia(t1, t2) {
      const cortes = [t1, ...giros(t1, t2), t2];
      let d = 0;
      for (let k = 1; k < cortes.length; k++) d += Math.abs(X(cortes[k]) - X(cortes[k - 1]));
      return d;
    }
    function puntos(tmax, n) {
      n = n || 200;
      const ts = new Set();
      for (let k = 0; k <= n; k++) ts.add(tmax * k / n);
      for (const s of segs) if (s.t0 > 0 && s.t0 < tmax) ts.add(s.t0);
      return [...ts].sort((a, b) => a - b).map(tt => ({ t: tt, x: X(tt), v: Vf(tt), a: A(tt) }));
    }
    return { x: X, v: Vf, a: A, segmentos: segs, tParada, frena: !!o.frena,
      desplazamiento: (t1, t2) => X(t2) - X(t1), distancia, puntos };
  }

  // Estado de un móvil en el instante t: { t, x, v, a }.
  function estado(o, t) { const m = movil(o); return { t, x: m.x(t), v: m.v(t), a: m.a(t) }; }

  // Lo que recorre un MRUV de un solo tramo durante el n-ésimo segundo (de t = n − 1 a t = n).
  function enesimoSegundo(v0, a, n) { return v0 + a * (n - 0.5); }

  // Instantes en [0, tmax] en que dos móviles están en el mismo lugar (cruces) o tienen la misma
  // velocidad. Se resuelve tramo a tramo: la diferencia es una parábola (o una recta) en cada tramo.
  function instantesIguales(o1, o2, tmax, que) {
    const m1 = movil(o1), m2 = movil(o2);
    const cortes = new Set([0, tmax]);
    for (const s of [...m1.segmentos, ...m2.segmentos]) if (s.t0 > 0 && s.t0 < tmax) cortes.add(s.t0);
    const ts = [...cortes].sort((a, b) => a - b), r = [];
    const f = que === 'v' ? (t => m1.v(t) - m2.v(t)) : (t => m1.x(t) - m2.x(t));
    for (let k = 1; k < ts.length; k++) {
      const a = ts[k - 1], b = ts[k];
      // Ajuste exacto de f en el tramo con tres puntos: f(t) = p·u² + q·u + c, con u = t − a.
      const h = b - a, f0 = f(a), fm = f(a + h / 2), f1 = f(b);
      const p = 2 * (f1 - 2 * fm + f0) / (h * h), q = (4 * fm - 3 * f0 - f1) / h, c0 = f0;
      let raices;
      if (Math.abs(p) < 1e-12) raices = Math.abs(q) < 1e-12 ? [] : [-c0 / q];
      else {
        const D = q * q - 4 * p * c0;
        raices = D < -1e-12 ? [] : [(-q - Math.sqrt(Math.max(0, D))) / (2 * p), (-q + Math.sqrt(Math.max(0, D))) / (2 * p)];
      }
      for (const u of raices) {
        const t = a + u;
        if (t >= a - 1e-9 && t <= b + 1e-9 && !r.some(x => Math.abs(x - t) < 1e-7)) r.push(Math.max(0, t));
      }
    }
    return r.sort((a, b) => a - b);
  }
  const cruces = (o1, o2, tmax) => instantesIguales(o1, o2, tmax, 'x');
  const igualVelocidad = (o1, o2, tmax) => instantesIguales(o1, o2, tmax, 'v');

  // Lanzamiento vertical desde la altura y0 con velocidad v0 (positiva hacia arriba). Sin aire.
  function lanzamientoVertical(o) {
    const g = o.g || G, y0 = num(o.y0 || 0, 'altura'), v0 = num(o.v0 || 0, 'velocidad');
    const tSubida = v0 > 0 ? v0 / g : 0, H = y0 + (v0 > 0 ? v0 * v0 / (2 * g) : 0);
    const tSuelo = (v0 + Math.sqrt(v0 * v0 + 2 * g * y0)) / g;
    return { movil: { x0: y0, v0, a: -g }, tSubida, H, tSuelo, vSuelo: v0 - g * tSuelo };
  }

  // Pendiente de la recta que une dos puntos (t1, y1) y (t2, y2) de una gráfica.
  function pendiente(t1, y1, t2, y2) { if (t2 === t1) throw new Error('los dos puntos tienen el mismo tiempo'); return (y2 - y1) / (t2 - t1); }

  return { G, movil, estado, enesimoSegundo, cruces, igualVelocidad, lanzamientoVertical, pendiente };
});
