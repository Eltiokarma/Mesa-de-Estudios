/*
 * Motor de Trabajo, energía y potencia.
 *
 * Aquí vive toda la física de la plantilla (regla 1 de CLAUDE.md). No toca el
 * DOM: funciona igual en el navegador (window.MotorEnergia) y en Node
 * (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Unidades SI y g = 10 m/s² (como en el examen), salvo que se pase otra g.
 * Los ángulos de los planos se dan en grados o, para los "notables" del
 * examen, con su seno y coseno: notable(37) = { sen: 3/5, cos: 4/5 }.
 *
 * Piezas:
 *   perfil(forma, h, L)          rampa de altura h y largo horizontal L: 'recta', 'curva' o 'lomas'
 *   recorrido(perfil, n)         puntos de la rampa con rapidez y tiempo (sin roce, desde el reposo)
 *   rampaResorte({ m, h, k, mu, d })  bloque que baja sin roce y comprime un resorte (con un tramo de piso con roce opcional)
 *   movimiento({ m, h, k, mu, d, forma, L, piso })  lo mismo, instante a instante, para animarlo
 *   trabajos({ m, d, angulo|inclinacion, mu, sentido, F, v0 })  trabajo de cada fuerza en un piso o plano
 *   trabajoArea(puntos, x1, x2)  trabajo de una fuerza variable: área bajo la gráfica F–x
 *   trabajoResorte(k, x1, x2)    trabajo para llevar un resorte de la deformación x1 a x2
 *   potencia({ m, h, t, eficiencia })  motor que sube una carga a velocidad constante
 *   lanzamiento({ v0, angulo, h0 })   pelota lanzada desde una altura h0: trayectoria y rapidez al llegar al suelo
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorEnergia = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const G = 10;
  const EPS = 1e-12;
  const NOTABLES = { 0: [0, 1], 30: [1 / 2, Math.sqrt(3) / 2], 37: [3 / 5, 4 / 5], 45: [Math.SQRT1_2, Math.SQRT1_2], 53: [4 / 5, 3 / 5], 60: [Math.sqrt(3) / 2, 1 / 2], 90: [1, 0] };

  // Seno y coseno de un ángulo del examen (37° y 53° con los valores redondos 3/5 y 4/5).
  function notable(grados) {
    const v = NOTABLES[grados];
    if (v) return { sen: v[0], cos: v[1] };
    const r = grados * Math.PI / 180;
    return { sen: Math.sin(r), cos: Math.cos(r) };
  }
  function inclinacionDe(o) {
    if (o.inclinacion) return o.inclinacion;
    return notable(o.angulo || 0);
  }
  function positivo(x, que) { const n = Number(x); if (!(n >= 0) || !Number.isFinite(n)) throw new Error(`${que} inválido: ${x}`); return n; }

  // ---------- Rampas ----------
  // Altura y(x) de la rampa, con y(0) = h y y(L) = 0.
  //   recta: bajada uniforme.
  //   curva: empinada al inicio y suave al final, como un tobogán: y = h(1 − x/L)².
  //   lomas: baja, sube una loma y vuelve a bajar: y = h(1 − u) − 0,3h·sen(2πu), con u = x/L.
  //          La loma queda por debajo de la altura de partida, así que el bloque la pasa.
  function perfil(forma, h, L) {
    h = positivo(h, 'altura'); L = positivo(L, 'largo');
    if (!(L > 0)) throw new Error('el largo de la rampa debe ser mayor que cero');
    const f = {
      recta: x => h * (1 - x / L),
      curva: x => h * Math.pow(1 - x / L, 2),
      lomas: x => { const u = x / L; return h * (1 - u) - 0.3 * h * Math.sin(2 * Math.PI * u); },
    }[forma];
    if (!f) throw new Error(`forma de rampa desconocida: ${forma}`);
    return { forma, h, L, y: x => f(Math.max(0, Math.min(L, x))) };
  }

  // Rapidez a la altura y, desde h0 con rapidez v0, sin roce (conservación de la energía).
  // null si no llega a esa altura.
  function rapidez(h0, y, v0, g) {
    g = g || G;
    const v2 = (v0 || 0) * (v0 || 0) + 2 * g * (h0 - y);
    return v2 < -EPS ? null : Math.sqrt(Math.max(0, v2));
  }

  // Puntos de la rampa, desde el reposo y sin roce: [{ x, y, s, v, t }].
  // El tiempo se integra con dt = 2·ds / (v₁ + v₂), exacto cuando la aceleración del tramo es pareja.
  function recorrido(p, n, g) {
    g = g || G; n = n || 600;
    const pts = [{ x: 0, y: p.y(0), s: 0, v: 0, t: 0 }];
    for (let k = 1; k <= n; k++) {
      const x = p.L * k / n, y = p.y(x), a = pts[k - 1];
      const ds = Math.hypot(x - a.x, y - a.y), v = rapidez(p.h, y, 0, g);
      if (v === null || a.v + v < EPS) return { puntos: pts, llega: false };
      pts.push({ x, y, s: a.s + ds, v, t: a.t + 2 * ds / (a.v + v) });
    }
    return { puntos: pts, llega: true, tiempo: pts[n].t, vFinal: pts[n].v };
  }

  // Bloque de masa m que baja sin roce desde la altura h, recorre un piso horizontal con roce μ
  // en un tramo de largo d (opcional) y comprime un resorte de constante k.
  function rampaResorte(o) {
    const g = o.g || G, m = positivo(o.m, 'masa'), h = positivo(o.h, 'altura'), k = positivo(o.k, 'constante del resorte');
    const mu = positivo(o.mu || 0, 'coeficiente de roce'), d = positivo(o.d || 0, 'largo del tramo con roce');
    const E = m * g * h, v2 = 2 * g * h;
    const roce = mu * m * g, Wroce = -roce * d;
    const queda = E + Wroce;
    if (queda <= EPS && roce > 0) {
      return { E, v2, v: Math.sqrt(v2), roce, Wroce: -E, seDetiene: true, dDetiene: E / roce, Eresorte: 0, x2: 0, x: 0 };
    }
    const x2 = 2 * queda / k;
    return { E, v2, v: Math.sqrt(v2), roce, Wroce, seDetiene: false, Eresorte: queda, vResorte2: 2 * queda / m, x2, x: Math.sqrt(x2) };
  }

  // Energías del bloque en un instante (para las barras): potencial gravitatoria (sistema bloque-Tierra),
  // cinética y elástica (sistema bloque-resorte).
  function energias(o) {
    const g = o.g || G;
    return { Ep: o.m * g * (o.y || 0), Ec: 0.5 * o.m * (o.v || 0) * (o.v || 0), Ee: 0.5 * (o.k || 0) * (o.x || 0) * (o.x || 0) };
  }

  // ---------- Trabajo de cada fuerza ----------
  // Un bloque de masa m recorre d metros sobre un piso (angulo 0) o un plano inclinado, hacia
  // 'arriba' o 'abajo' del plano. F es una fuerza aplicada paralela al desplazamiento (en su mismo
  // sentido); con F: 'constante' se calcula la que lo mantiene a velocidad constante.
  // Devuelve las fuerzas, el trabajo de cada una (peso, normal, roce, F), el neto y la rapidez final
  // al cuadrado si se da v0. También el trabajo del roce si se usara N = m·g (el error típico).
  function trabajos(o) {
    const g = o.g || G, m = positivo(o.m, 'masa'), d = positivo(o.d, 'distancia'), mu = positivo(o.mu || 0, 'coeficiente de roce');
    const { sen, cos } = inclinacionDe(o);
    const sentido = o.sentido || 'arriba';
    if (sentido !== 'arriba' && sentido !== 'abajo') throw new Error(`sentido desconocido: ${sentido}`);
    const P = m * g, N = P * cos, roce = mu * N;
    const s = sentido === 'arriba' ? 1 : -1;         // el peso trabaja en contra al subir
    const Wpeso = -s * P * sen * d, Wroce = -roce * d, WN = 0;
    let F = 0;
    if (o.F === 'constante') F = s * P * sen + roce;  // la que anula la fuerza neta
    else if (o.F !== undefined) F = Number(o.F);
    const WF = F * d, Wneto = Wpeso + Wroce + WN + WF;
    const r = { P, N, roce, F, Wpeso, WN, Wroce, WF, Wneto, dEc: Wneto, h: sen * d,
      WroceConNmg: -mu * P * d };
    if (o.v0 !== undefined) { r.v2 = o.v0 * o.v0 + 2 * Wneto / m; r.v = r.v2 >= 0 ? Math.sqrt(r.v2) : null; }
    return r;
  }

  // Trabajo de una fuerza variable: área bajo la gráfica F–x, con la gráfica dada por puntos [x, F]
  // unidos con rectas. Entre x1 y x2 (por defecto, todo el tramo).
  function trabajoArea(puntos, x1, x2) {
    if (!Array.isArray(puntos) || puntos.length < 2) throw new Error('hacen falta al menos dos puntos');
    const a = x1 === undefined ? puntos[0][0] : x1, b = x2 === undefined ? puntos[puntos.length - 1][0] : x2;
    const F = x => {
      for (let k = 1; k < puntos.length; k++) {
        const [xa, fa] = puntos[k - 1], [xb, fb] = puntos[k];
        if (x <= xb + EPS) return xb === xa ? fb : fa + (fb - fa) * (x - xa) / (xb - xa);
      }
      return puntos[puntos.length - 1][1];
    };
    const xs = [a, ...puntos.map(p => p[0]).filter(x => x > a && x < b), b];
    let W = 0;
    for (let k = 1; k < xs.length; k++) W += (F(xs[k - 1]) + F(xs[k])) / 2 * (xs[k] - xs[k - 1]);
    return W;
  }
  // Trabajo que hace quien estira (o comprime) un resorte desde la deformación x1 hasta x2.
  function trabajoResorte(k, x1, x2) { return 0.5 * k * (x2 * x2 - x1 * x1); }

  // ---------- Potencia ----------
  // Un motor sube una carga m a la altura h en t segundos, a velocidad constante, con una eficiencia
  // (fracción de 0 a 1) dada.
  function potencia(o) {
    const g = o.g || G, m = positivo(o.m, 'masa'), h = positivo(o.h, 'altura'), t = positivo(o.t, 'tiempo');
    const ef = o.eficiencia === undefined ? 1 : Number(o.eficiencia);
    if (!(ef > 0 && ef <= 1)) throw new Error(`eficiencia inválida: ${o.eficiencia}`);
    if (!(t > 0)) throw new Error('el tiempo debe ser mayor que cero');
    const W = m * g * h, Putil = W / t, Pconsumida = Putil / ef;
    return { F: m * g, v: h / t, W, Putil, Pconsumida, perdidas: Pconsumida - Putil, Econsumida: Pconsumida * t, eficiencia: ef };
  }

  // ---------- Lanzamiento ----------
  // Pelota lanzada con rapidez v0 y ángulo (grados sobre la horizontal; negativo, hacia abajo) desde
  // la altura h0, hasta que llega al suelo (y = 0). Sin aire. La rapidez al llegar no depende del ángulo.
  function lanzamiento(o) {
    const g = o.g || G, v0 = positivo(o.v0, 'rapidez'), h0 = positivo(o.h0 || 0, 'altura');
    const r = (o.angulo || 0) * Math.PI / 180, vx = v0 * Math.cos(r), vy = v0 * Math.sin(r);
    // y(t) = h0 + vy·t − g t²/2 = 0
    const t = (vy + Math.sqrt(vy * vy + 2 * g * h0)) / g;
    const n = o.n || 60, puntos = [];
    for (let k = 0; k <= n; k++) { const tt = t * k / n; puntos.push([vx * tt, h0 + vy * tt - g * tt * tt / 2]); }
    puntos[n][1] = 0;
    const hmax = vy > 0 ? h0 + vy * vy / (2 * g) : h0;
    return { t, alcance: vx * t, hmax, puntos, vFinal: Math.sqrt(v0 * v0 + 2 * g * h0), vxFinal: vx, vyFinal: vy - g * t };
  }


  // ---------- Movimiento completo de la rampa con resorte ----------
  // Bloque que baja sin roce por la rampa (forma, altura h, largo horizontal L), sigue por un piso de
  // largo 'piso' cuyo primer tramo de largo d tiene roce μ, y comprime un resorte (constante k) cuyo
  // extremo libre está al final del piso. Termina en la compresión máxima (o donde el roce lo detiene).
  // Devuelve los tiempos de cada etapa y en(t): posición horizontal X (0 en la cima, el resorte libre en
  // X0 = L + piso), altura y, rapidez v, compresión, y las energías Ep, Ec, Ee y la que se lleva el roce.
  function movimiento(o) {
    const g = o.g || G, m = positivo(o.m, 'masa'), h = positivo(o.h, 'altura'), k = positivo(o.k, 'constante del resorte');
    const mu = positivo(o.mu || 0, 'coeficiente de roce'), d = positivo(o.d || 0, 'largo del tramo con roce');
    const L = o.L || 3, piso = o.piso === undefined ? Math.max(2, d + 0.5) : positivo(o.piso, 'largo del piso');
    if (d > piso + EPS) throw new Error('el tramo con roce no cabe en el piso');
    const p = perfil(o.forma || 'curva', h, L), rec = recorrido(p, o.n || 600, g);
    if (!rec.llega) throw new Error('el bloque no pasa la rampa');
    const pts = rec.puntos, E = m * g * h, a = mu * g, X0 = L + piso, w = Math.sqrt(k / m);
    const t1 = rec.tiempo, v1 = rec.vFinal;
    let t2, v2, para = false, sPara = d;
    if (a > 0 && v1 * v1 <= 2 * a * d + EPS) { para = true; sPara = v1 * v1 / (2 * a); t2 = v1 / a; v2 = 0; }
    else { v2 = Math.sqrt(Math.max(0, v1 * v1 - 2 * a * d)); t2 = d === 0 ? 0 : (a > 0 ? (v1 - v2) / a : d / v1); }
    const t3 = para ? 0 : (piso - d) / v2, t4 = para ? 0 : Math.PI / (2 * w);
    const xmax = para ? 0 : v2 / w;
    const T = [t1, t1 + t2, t1 + t2 + t3, t1 + t2 + t3 + t4];
    const estado = (X, y, v, comp, sRoce) => ({ X, y, v, comp, Ep: m * g * y, Ec: 0.5 * m * v * v, Ee: 0.5 * k * comp * comp, Eroce: a * m * sRoce });
    function en(t) {
      t = Math.max(0, Math.min(T[3], t));
      if (t <= t1) {
        let lo = 0, hi = pts.length - 1;
        while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (pts[mid].t <= t) lo = mid; else hi = mid; }
        const A = pts[lo], B = pts[hi], f = B.t > A.t ? (t - A.t) / (B.t - A.t) : 0;
        const X = A.x + (B.x - A.x) * f, y = p.y(X);
        return Object.assign(estado(X, y, rapidez(h, y, 0, g), 0, 0), { fase: 'rampa' });
      }
      if (t <= T[1]) {
        const s = t - t1, dist = v1 * s - a * s * s / 2;
        return Object.assign(estado(L + dist, 0, Math.max(0, v1 - a * s), 0, dist), { fase: para && t >= T[1] - EPS ? 'detenido' : 'roce' });
      }
      if (t <= T[2]) return Object.assign(estado(L + d + v2 * (t - T[1]), 0, v2, 0, d), { fase: 'piso' });
      const s = t - T[2], comp = xmax * Math.sin(w * s);
      return Object.assign(estado(X0 + comp, 0, v2 * Math.cos(w * s), comp, d), { fase: 'resorte' });
    }
    return { E, perfil: p, L, piso, X0, d: para ? sPara : d, para, xmax, vAbajo: v1, vResorte: v2, tiempos: T, duracion: T[3], en };
  }

  return { G, notable, perfil, rapidez, recorrido, rampaResorte, movimiento, energias, trabajos, trabajoArea, trabajoResorte, potencia, lanzamiento };
});
