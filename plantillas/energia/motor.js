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
 *   trabajoArea(puntos, x1, x2)  trabajo de una fuerza variable: área con signo bajo la gráfica F–x
 *   trabajoResorte(k, x1, x2)    trabajo para llevar un resorte de la deformación x1 a x2
 *   potencia({ m, h, t, eficiencia })  motor que sube una carga a velocidad constante
 *   lanzamiento({ v0, angulo, h0 })   pelota lanzada desde una altura h0: trayectoria y rapidez al llegar al suelo
 *   validarGrafica(puntos)       revisa una gráfica F–x: al menos dos puntos [x, F] finitos, con las x de menor a mayor
 *   fuerzaEn(puntos, x)          F en x (en un salto vertical, el valor de la derecha)
 *   areaPartes(puntos, x1, x2)   área partida donde F cruza el cero: { W, positiva, negativa, ceros, tramos }
 *   trabajoHasta(puntos, x)      trabajo desde el inicio de la gráfica hasta x
 *   fuerzaVariable({ puntos, m, v0, x1, x2 })  carrito empujado por F(x) en un riel sin roce: W, ΔEc, rapidez,
 *                                si se detiene, y lo que da cada error típico al leer la gráfica (campo errores)
 *   recorridoFuerza({ puntos, m, v0, n })  lo mismo, instante a instante, para animarlo
 *   resorteArea(k, x1, x2)       trabajo para llevar un resorte de x1 a x2 como resta de dos triángulos, con sus errores
 *
 * Gráficas F–x: puntos [x, F] unidos con rectas; un salto vertical se escribe con dos puntos de la misma x.
 * Cada tramo se integra con sus propios extremos (un trapecio es exacto en un tramo recto), así que un salto
 * no se promedia con el tramo vecino. Límites al revés (x1 > x2) dan el trabajo con el signo cambiado.
 * Decisión (7 nov 2026): un límite fuera de la gráfica se rechaza con un error («el tramo pedido sale de la
 * gráfica»), en vez de inventar cómo sigue la fuerza más allá de los puntos dados.
 * Fuerza variable: el trabajo es el área con signo bajo F–x, partida donde F cruza el cero; W neto = ΔEc
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

  // Trabajo de una fuerza variable: área con signo bajo la gráfica F–x, entre x1 y x2 (por defecto, toda la gráfica).
  function trabajoArea(puntos, x1, x2) { return areaPartes(puntos, x1, x2).W; }
  // Trabajo que hace quien estira (o comprime) un resorte desde la deformación x1 hasta x2.
  function trabajoResorte(k, x1, x2) { return 0.5 * k * (x2 * x2 - x1 * x1); }


  // ---------- Fuerza variable: gráfica F–x por puntos ----------
  const tolX = x => 1e-9 * Math.max(1, Math.abs(x));
  function validarGrafica(puntos) {
    if (!Array.isArray(puntos) || puntos.length < 2) throw new Error('hacen falta al menos dos puntos');
    puntos.forEach((p, k) => {
      if (!Array.isArray(p) || p.length < 2 || !Number.isFinite(p[0]) || !Number.isFinite(p[1])) throw new Error(`punto ${k + 1} inválido: ${JSON.stringify(p)}`);
      if (k && p[0] < puntos[k - 1][0]) throw new Error(`las x deben ir de menor a mayor (punto ${k + 1})`);
    });
    if (!(puntos[puntos.length - 1][0] > puntos[0][0])) throw new Error('la gráfica debe abarcar un tramo de x');
    return puntos;
  }
  // Límites pedidos, dentro de la gráfica (con una tolerancia de redondeo); fuera, un error.
  function limites(puntos, x1, x2) {
    const x0 = puntos[0][0], xn = puntos[puntos.length - 1][0];
    const a = x1 === undefined ? x0 : Number(x1), b = x2 === undefined ? xn : Number(x2);
    for (const x of [a, b]) {
      if (!Number.isFinite(x)) throw new Error(`límite inválido: ${x}`);
      if (x < x0 - tolX(x0) || x > xn + tolX(xn)) throw new Error(`el tramo pedido sale de la gráfica: x = ${x} no está entre ${x0} y ${xn}`);
    }
    const dentro = x => Math.max(x0, Math.min(xn, x));
    return [dentro(a), dentro(b)];
  }
  // F en x: a la derecha (izq = false) o a la izquierda de x, por si hay un salto vertical justo ahí.
  function fuerzaLado(puntos, x, izq) {
    for (let k = 1; k < puntos.length; k++) {
      const [xa, Fa] = puntos[k - 1], [xb, Fb] = puntos[k];
      if (!(xb > xa)) continue;
      if (izq ? (x > xa && x <= xb) : (x >= xa && x < xb)) return Fa + (Fb - Fa) * (x - xa) / (xb - xa);
    }
    return izq ? puntos[0][1] : puntos[puntos.length - 1][1];
  }
  function fuerzaEn(puntos, x) {
    validarGrafica(puntos);
    return fuerzaLado(puntos, limites(puntos, x, x)[0], false);
  }
  // Área partida en tramos de un solo signo. W = positiva + negativa; ceros: las x del tramo donde F vale 0.
  function areaPartes(puntos, x1, x2) {
    validarGrafica(puntos);
    const [a, b] = limites(puntos, x1, x2);
    if (a > b) {
      const r = areaPartes(puntos, b, a);
      return { W: 0 - r.W, positiva: 0 - r.negativa, negativa: 0 - r.positiva, ceros: r.ceros.slice().reverse(),
        tramos: r.tramos.slice().reverse().map(t => ({ xa: t.xb, xb: t.xa, Fa: t.Fb, Fb: t.Fa, W: 0 - t.W })) };
    }
    const tramos = [], ceros = [];
    const escala = Math.max(1, ...puntos.map(p => Math.abs(p[1])));
    const limpio = F => (Math.abs(F) <= 1e-12 * escala ? 0 : F);
    const cero = x => { if (!ceros.some(z => Math.abs(z - x) <= tolX(x))) ceros.push(x); };
    const tramo = (xa, xb, Fa, Fb) => { if (xb > xa) tramos.push({ xa, xb, Fa, Fb, W: (Fa + Fb) / 2 * (xb - xa) }); };
    for (let k = 1; k < puntos.length; k++) {
      const [xa, Fa] = puntos[k - 1], [xb, Fb] = puntos[k];
      if (!(xb > xa)) continue;                         // salto vertical: no tiene ancho
      const ia = Math.max(a, xa), ib = Math.min(b, xb);
      if (ib < ia) continue;
      const f = x => limpio(Fa + (Fb - Fa) * (x - xa) / (xb - xa));
      const Fi = f(ia), Fj = f(ib);
      if (Fi === 0) cero(ia);
      if (Fi * Fj < 0) {
        const xc = ia - Fi * (ib - ia) / (Fj - Fi);
        cero(xc); tramo(ia, xc, Fi, 0); tramo(xc, ib, 0, Fj);
      } else tramo(ia, ib, Fi, Fj);
      if (Fj === 0) cero(ib);
    }
    let W = 0, positiva = 0, negativa = 0;
    for (const t of tramos) { W += t.W; if (t.W > 0) positiva += t.W; else negativa += t.W; }
    ceros.sort((p, q) => p - q);
    return { W, positiva, negativa, ceros, tramos };
  }
  function trabajoHasta(puntos, x) { validarGrafica(puntos); return areaPartes(puntos, puntos[0][0], x).W; }

  // Carrito de masa m en un riel horizontal sin roce, que pasa por x1 con rapidez v0 (hacia +x) y sobre el que
  // actúa la fuerza F(x) de la gráfica (positiva hacia +x). El trabajo de F es el neto (el peso y la normal no
  // trabajan), así que Ec(x) = Ec0 + W(x). Si la energía cinética llega a cero antes de x2, el carrito se detiene
  // ahí (la fuerza, que en ese punto es ≤ 0, lo regresaría; eso ya no se calcula). Con v0 = 0 y F(x1) ≤ 0, no arranca.
  // W, positiva y negativa son las del recorrido real (hasta x2 o hasta donde se detiene). Fmedia y los errores
  // son los de leer toda la gráfica entre x1 y x2, que es lo que hace el alumno.
  function fuerzaVariable(o) {
    const puntos = validarGrafica(o.puntos);
    const m = Number(o.m);
    if (!(m > 0) || !Number.isFinite(m)) throw new Error(`masa inválida: ${o.m}`);
    const v0 = positivo(o.v0 || 0, 'rapidez inicial');
    const [a, b] = limites(puntos, o.x1, o.x2);
    if (!(b > a)) throw new Error('x2 debe ser mayor que x1');
    const d = b - a, P = areaPartes(puntos, a, b);
    const Fini = fuerzaLado(puntos, a, false), Ffin = fuerzaLado(puntos, b, true);
    const Ec0 = 0.5 * m * v0 * v0, arranca = !(v0 === 0 && Fini <= 0);
    const tolE = 1e-9 * Math.max(1, Ec0 + P.positiva);
    let E = Ec0, xDet = arranca ? null : a, Ecmin = Ec0, xEcmin = a;
    if (arranca) for (const t of P.tramos) {
      const E1 = E + t.W;
      if (t.Fa <= 0 && t.Fb <= 0 && E1 <= tolE) {
        // E(s) = E + Fa·s + (Fb − Fa)/(2L)·s² = 0 en el tramo; la raíz positiva más chica, en forma estable.
        const L = t.xb - t.xa, A = (t.Fb - t.Fa) / (2 * L), B = t.Fa, C = Math.max(0, E);
        const den = -B + Math.sqrt(Math.max(0, B * B - 4 * A * C));
        xDet = t.xa + (C === 0 ? 0 : den > 0 ? Math.min(L, 2 * C / den) : L);
        break;
      }
      E = E1;
      if (E < Ecmin - tolE) { Ecmin = E; xEcmin = t.xb; }
    }
    const seDetiene = xDet !== null;
    if (seDetiene) { Ecmin = 0; xEcmin = xDet; }
    const R = seDetiene ? (xDet > a ? areaPartes(puntos, a, xDet) : { W: 0, positiva: 0, negativa: 0 }) : P;
    const Ec = seDetiene ? 0 : Ec0 + P.W, v2 = seDetiene ? 0 : v0 * v0 + 2 * P.W / m;
    const suma = P.positiva - P.negativa;
    const raiz = x => (x >= -EPS ? Math.sqrt(Math.max(0, x)) : null);
    return {
      d, recorrido: (seDetiene ? xDet : b) - a, W: R.W, positiva: R.positiva, negativa: R.negativa,
      Wtramo: P.W, ceros: P.ceros, tramos: P.tramos, Fini, Ffin, Fmedia: P.W / d,
      Ec0, Ec, v2, v: seDetiene ? null : raiz(v2), arranca, seDetiene, llega: !seDetiene, xDetiene: seDetiene ? xDet : null,
      Ecmin, xEcmin, vmin: Math.sqrt(Math.max(0, 2 * Ecmin / m)),
      errores: {
        FfinalPorD: Ffin * d,                 // G4: F·d con la fuerza del final
        FinicialPorD: Fini * d,               // G4: F·d con la fuerza del inicio
        pendiente: (Ffin - Fini) / d,         // G4: la pendiente cuando se pide el área
        sumaSinSigno: suma,                   // suma las áreas como si todas fueran positivas
        soloPositiva: P.positiva,             // no cuenta lo que está bajo el eje
        promedioExtremos: (Fini + Ffin) / 2 * d, // promedio de los extremos (vale solo con una sola recta)
        vSinV0: raiz(2 * P.W / m),            // olvida que ya se movía
        vSinSigno: raiz(v0 * v0 + 2 * suma / m),
        vEcSinMedio: raiz(v0 * v0 + P.W / m), // usa Ec = m·v²
      },
    };
  }

  // Tiempo de un paso de largo L dentro de un tramo recto de la gráfica: ahí v² = q(s) = v1² + 2·a1·s + (a2 − a1)/L·s²
  // es exacta (a = F/m), y t = ∫ ds/√q(s) tiene forma cerrada (raíz, logaritmo o arcoseno según la curvatura de q).
  // Si la forma cerrada no sale finita (casos al borde), se usa 2L/(v1 + v2), exacta con aceleración pareja.
  function dtPaso(v1, v2, a1, a2, L) {
    const trapecio = 2 * L / (v1 + v2), al = v1 * v1, be = 2 * a1, ga = (a2 - a1) / L;
    let t;
    if (Math.abs(ga) * L * L <= 1e-12 * (al + Math.abs(be) * L + v2 * v2)) t = trapecio;
    else if (ga > 0) {
      const r = Math.sqrt(ga), num = 2 * r * v2 + 2 * ga * L + be, den = 2 * r * v1 + be;
      t = Math.log(num / den) / r;
    } else {
      const D = Math.sqrt(be * be - 4 * al * ga), r = Math.sqrt(-ga), as = x => Math.asin(Math.max(-1, Math.min(1, x)));
      t = (as(be / D) - as((2 * ga * L + be) / D)) / r;
    }
    return Number.isFinite(t) && t > 0 ? t : trapecio;
  }

  // Recorrido instante a instante: v(x) sale exacta del teorema (v² = v0² + 2W(x)/m) y el tiempo de cada paso,
  // con dtPaso (exacto en cada tramo recto de la gráfica). Los pasos incluyen los nodos y los ceros.
  // en(t) da { x, t, v, W, Ec } con aceleración pareja dentro de cada paso (para animar).
  function recorridoFuerza(o) {
    const r = fuerzaVariable(o), puntos = o.puntos, m = Number(o.m), v0 = o.v0 || 0, n = o.n || 400;
    const a = limites(puntos, o.x1, o.x2)[0], fin = a + r.recorrido;
    const estado = (x, t) => { const W = x > a ? areaPartes(puntos, a, x).W : 0, Ec = Math.max(0, 0.5 * m * v0 * v0 + W); return { x, t, v: Math.sqrt(2 * Ec / m), W, Ec }; };
    if (!r.arranca) {
      const p0 = estado(a, 0);
      return { puntos: [p0], arranca: false, llega: false, seDetiene: true, xDetiene: a, tiempo: 0, vFinal: 0, en: () => Object.assign({}, p0) };
    }
    let xs = [];
    for (let k = 0; k <= n; k++) xs.push(a + (fin - a) * k / n);
    for (const x of [...puntos.map(p => p[0]), ...r.ceros]) if (x > a && x < fin) xs.push(x);
    xs.sort((p, q) => p - q);
    xs = xs.filter((x, k) => k === 0 || x - xs[k - 1] > tolX(x));
    xs[xs.length - 1] = fin;
    const pts = [estado(a, 0)];
    for (let k = 1; k < xs.length; k++) {
      const e = estado(xs[k], 0);
      if (r.seDetiene && k === xs.length - 1) { e.v = 0; e.Ec = 0; }
      const p = pts[k - 1];
      if (!(p.v + e.v > EPS)) break;
      e.t = p.t + dtPaso(p.v, e.v, fuerzaLado(puntos, p.x, false) / m, fuerzaLado(puntos, e.x, true) / m, e.x - p.x);
      pts.push(e);
    }
    const ult = pts[pts.length - 1];
    function en(t) {
      t = Math.max(0, Math.min(ult.t, t));
      let lo = 0, hi = pts.length - 1;
      if (hi === 0) return Object.assign({}, pts[0]);
      while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (pts[mid].t <= t) lo = mid; else hi = mid; }
      const A = pts[lo], B = pts[hi], dt = B.t - A.t, tau = t - A.t;
      const x = dt > 0 ? A.x + A.v * tau + (B.v - A.v) / dt * tau * tau / 2 : A.x;
      return estado(Math.min(B.x, Math.max(A.x, x)), t);
    }
    return { puntos: pts, arranca: true, llega: r.llega, seDetiene: r.seDetiene, xDetiene: r.xDetiene, tiempo: ult.t, vFinal: r.seDetiene ? 0 : ult.v, en };
  }

  // Trabajo para llevar un resorte de la deformación x1 a x2 (negativa si está comprimido), como resta de dos
  // triángulos bajo F = kx: grande (de 0 a x2) menos chico (de 0 a x1). Con los errores típicos.
  function resorteArea(k, x1, x2) {
    k = Number(k); x1 = Number(x1); x2 = Number(x2);
    if (!(k > 0) || !Number.isFinite(k)) throw new Error(`constante del resorte inválida: ${k}`);
    if (!Number.isFinite(x1) || !Number.isFinite(x2)) throw new Error('deformaciones inválidas');
    const grande = 0.5 * k * x2 * x2, chico = 0.5 * k * x1 * x1;
    return { W: grande - chico, F1: k * x1, F2: k * x2, grande, chico,
      errores: {
        mitadDeltaCuadrado: 0.5 * k * (x2 - x1) * (x2 - x1), // ½k(x2 − x1)²
        FfinalPorDelta: k * x2 * (x2 - x1),                  // F final por lo que se estira: el rectángulo
        desdeCero: grande,                                   // no descuenta lo que ya estaba estirado
        FPorX: k * x2 * x2,                                  // F·x desde el largo natural, sin el ½
      } };
  }

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

  return { G, notable, perfil, rapidez, recorrido, rampaResorte, movimiento, energias, trabajos, trabajoArea, trabajoResorte, potencia, lanzamiento,
    validarGrafica, fuerzaEn, areaPartes, trabajoHasta, fuerzaVariable, recorridoFuerza, resorteArea };
});
