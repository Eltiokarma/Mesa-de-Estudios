/*
 * Motor de gravitación universal: ley de Newton con la tercera ley, g con la altura y en otros planetas, órbitas
 * circulares (rapidez, período, Kepler III, satélite geoestacionario), energía y velocidad de escape, el cañón de
 * Newton (lanzamiento horizontal: cae, órbita o escapa), la balanza en un ascensor que cae y Kepler II (áreas iguales).
 *
 * Aquí vive toda la física de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el navegador
 * (window.MotorGravitacion) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Valores de academia (declarados aquí; los usa todo el motor):
 *   G = 6,67·10⁻¹¹ N·m²/kg²; g0 = 10 m/s² en la superficie de la Tierra; R = 6400 km = 6,4·10⁶ m.
 *   GM de la Tierra = g0·R² = 4,096·10¹⁴ m³/s² (así g0 sale exacto); masa de la Tierra M = g0·R²/G ≈ 6,14·10²⁴ kg.
 *   Un día = 24 h = 86 400 s (el geoestacionario usa este valor). π es el de verdad.
 * Otro planeta: kM y kR son su masa y su radio en múltiplos de los de la Tierra (por defecto 1 y 1):
 *   GM = kM·g0·R², radio Rp = kR·R y gravedad en su superficie gs = g0·kM/kR².
 * Unidades SI (kg, m, s, N, J). Las distancias r van de centro a centro; la altura h es sobre la superficie: r = Rp + h.
 * Toda órbita circular cumple v = √(GM/r), T = 2π·r/v = 2π·√(r³/GM) y su aceleración centrípeta es g a esa distancia.
 *
 * Funciones (cada una recibe un objeto y devuelve un objeto; 'errores' son los números de las ideas erróneas del
 * informe docs/investigacion/momento-gravitacion-ondas-ideas-erroneas.md, G1 a G8, y de su tabla «Lo que no tiene
 * respaldo»; la escena los usa para las opciones incorrectas):
 *   fuerza({ m1, m2, r, G })     F = G·m1·m2/r². sobre1 = sobre2 = F (tercera ley: la misma fuerza sobre los dos,
 *                                en sentidos opuestos); a1 = F/m1 y a2 = F/m2; masivo = 1 o 2 (el de más masa).
 *                                errores.inversoR = G·m1·m2/r (F ∝ 1/r, G3);
 *                                errores.segunPropiaMasa = F·mMenor/mMayor: lo que «tiraría» el cuerpo menos masivo si
 *                                cada uno atrajera en proporción a su propia masa (el más masivo atrae más);
 *                                errores.soloElMasivo = 0: el cuerpo menos masivo no atrae al otro (G5).
 *   comparar({ km1, km2, kr })   cuántas veces cambia F si m1 se multiplica por km1, m2 por km2 y r por kr
 *                                (por defecto 1): razon = km1·km2/kr². errores: lineal = km1·km2/kr (G3),
 *                                linealDoble = km1·km2/(2·kr) (la respuesta «ocho veces más débil» del NGCI con kr = 4),
 *                                raiz = km1·km2/√kr, sinMasas = 1/kr².
 *   gAltura({ h, kM, kR })       r = Rp + h; g = gs·(Rp/r)²; fraccion = g/gs; peso(m) = m·g.
 *                                errores: lineal = gs·Rp/r (g ∝ 1/r); desdeSuperficie = gs·(Rp/h)² (la distancia
 *                                medida desde el suelo; null si h = 0); sinCambio = gs (la misma que en el suelo);
 *                                cero = 0 (G1: «en el espacio no hay gravedad»).
 *   alturaParaG({ fraccion, kM, kR })   altura donde g es esa fracción de gs: h = Rp·(1/√fraccion − 1); r = Rp + h;
 *                                hEnR = h/Rp. errores (en metros): lineal = Rp·(1/fraccion − 1);
 *                                desdeSuperficie = Rp/√fraccion; desdeSuperficieLineal = Rp/fraccion.
 *   planeta({ kM, kR })          g = gs = g0·kM/kR²; razon = kM/kR² (cuántas veces el peso de la Tierra); Rp; GM;
 *                                vRasante = √(GM/Rp) (órbita a ras del suelo, sin aire); ve = √(2·GM/Rp).
 *                                errores: soloMasa = g0·kM (G4: se olvida el radio); radioLineal = g0·kM/kR;
 *                                masaPorRadio = g0·kM·kR (más grande atrae más).
 *   orbita({ r | h, m, kM, kR }) órbita circular: r, h, v, w = v/r, T, g (= aceleración centrípeta = GM/r²),
 *                                F = m·g (m por defecto 1), Ec = ½·m·v², Ep = −GM·m/r, E = Ec + Ep = −GM·m/(2r),
 *                                ve = √(2·GM/r) desde esa órbita; estado(t) = { theta, x, y, vx, vy }, con
 *                                theta = 90° + w·t (en grados; arranca arriba, en (0, r), y gira en sentido antihorario).
 *                                errores: vConH = √(GM/h) (h en lugar de r; null si h = 0); vConG0 = √(g0·kM/kR²·r)
 *                                (g del suelo a esa distancia); EpMgh = m·gs·h (Ep = m·g·h con g del suelo, positiva).
 *   kepler3({ r1, r2, T1, m1, m2 })  dos órbitas circulares alrededor del mismo cuerpo: kr = r2/r1, kT = kr^(3/2),
 *                                T2 = T1·kT (si se da T1), kv = v2/v1 = 1/√kr; km = m2/m1 (por defecto 1): la rapidez
 *                                no depende de la masa del satélite. errores: Tlineal = kr (T ∝ r), Tcuadrado = kr²,
 *                                Traiz = √kr (los tres como razones T2/T1); kvConMasa = kv·km (el más pesado necesita
 *                                más rapidez); kvConRaizMasa = kv·√km.
 *   geoestacionario({ T, kM, kR })  órbita circular con período T (por defecto 86 400 s): r = ∛(GM·T²/(4π²)),
 *                                h = r − Rp, rEnR = r/Rp, hEnR = h/Rp, v = 2π·r/T. errores.alturaEsR = r (dar r como
 *                                si fuera la altura).
 *   escape({ r | h, kM, kR })    desde la distancia r (o la altura h; por defecto la superficie): ve = √(2·GM/r),
 *                                vc = √(GM/r) (la orbital a esa distancia), razon = ve/vc = √2.
 *                                errores: orbital = vc; doble = 2·vc; infinita = Infinity («la gravedad nunca se acaba»).
 *   lanzamiento({ v0, h0, kM, kR })  cañón de Newton: lanzamiento horizontal con rapidez v0 desde la altura h0 (por
 *                                defecto 0), sin aire. r0 = Rp + h0; H = r0·v0 (por unidad de masa); p = H²/GM;
 *                                e = v0²·r0/GM − 1 (con signo: negativo si el punto de lanzamiento es el más lejano).
 *                                Trayectoria r(φ) = p/(1 + e·cos φ), con φ el ángulo recorrido desde el lanzamiento.
 *                                Posición: x = r·sen φ, y = r·cos φ (sale de (0, r0) hacia +x).
 *                                tipo: 'cae' (toca el suelo: r = Rp en φchoque), 'circular' (|e| < 1e-9), 'eliptica',
 *                                'escapa' (e ≥ 1). rMin, rMax (Infinity si escapa), a = p/(1 − e²) y T = 2π·√(a³/GM)
 *                                (con tipo 'cae', rMin y rMax son el perigeo y el apogeo de la cónica completa, aunque el
 *                                perigeo quede bajo el suelo)
 *                                si es cerrada; energia = ½·v0² − GM/r0 (por kg): negativa = atada, cero o más = escapa;
 *                                vc = √(GM/r0), ve = √(2·GM/r0) y vSinChoque = √(2·GM·Rp/(r0·(r0 + Rp))) (la menor
 *                                rapidez con que la bala no toca el suelo: su perigeo queda justo en Rp). recorrido(n, rTope) da n + 1 puntos { phi, r, x, y, t }
 *                                (t por la segunda ley de Kepler: dt = r²/H·dφ, integrado con Simpson) hasta el choque,
 *                                una vuelta o r = rTope (por defecto 6·Rp); en(t) da la posición en el instante t.
 *   balanza({ m, a, g })         una persona de masa m sobre una balanza dentro de un ascensor que acelera hacia abajo
 *                                con a (a = g: cable cortado, caída libre; g por defecto g0). lectura = m·(g − a), y 0
 *                                si a ≥ g; peso = m·g (la Tierra la sigue atrayendo); caida(t) = ½·a·t².
 *                                errores: sinCambio = m·g; aumenta = m·(g + a); mitad = m·g/2.
 *   kepler2({ e, a, T, n })      órbita elíptica con el Sol en un foco (el origen) y el perihelio sobre +x (por defecto
 *                                a = 1, T = 1, n = 8). rp = a·(1 − e), ra = a·(1 + e), b = a·√(1 − e²), GM = 4π²·a³/T²;
 *                                posicion(t) = { E, theta, r, x, y, v } resolviendo M = E − e·sen E (M = 2π·t/T),
 *                                con x = a·(cos E − e), y = b·sen E y v por la energía: v² = GM·(2/r − 1/a);
 *                                sectores = n + 1 posiciones en t = k·T/n (cada sector barre π·a·b/n);
 *                                areaSector = π·a·b/n; vp, va y razonV = vp/va = (1 + e)/(1 − e).
 *                                errores: rapidezConstante = 1 (G6, como razón vp/va); alReves = (1 − e)/(1 + e).
 * El motor no dibuja: la escena lee estos resultados, estado(t), recorrido() y posicion(t), y pinta lo que le dan.
 * Errores de entrada: números inválidos, masas, distancias o radios que no son positivos, r menor que el radio
 * del planeta, fracciones fuera de (0, 1], e fuera de [0, 1) y a > g en la balanza se rechazan con un mensaje.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorGravitacion = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const G = 6.67e-11, G0 = 10, R = 6.4e6, GM_T = G0 * R * R, M_T = GM_T / G, DIA = 86400;
  const EPS = 1e-9;
  const num = (x, que) => { const n = Number(x); if (x === null || x === '' || x === undefined || typeof x === 'boolean' || !Number.isFinite(n)) throw new Error(`${que} inválido: ${x}`); return n; };
  const pos = (x, que) => { const n = num(x, que); if (!(n > 0)) throw new Error(`${que} debe ser mayor que cero: ${x}`); return n; };
  const noNeg = (x, que) => { const n = num(x, que); if (n < 0) throw new Error(`${que} no puede ser negativo: ${x}`); return n; };
  const op = (x, def, f, que) => (x === undefined ? def : f(x, que));
  const obj = o => { if (!o || typeof o !== 'object') throw new Error('Faltan los datos'); return o; };

  // El cuerpo central: la Tierra o un planeta con kM masas y kR radios terrestres.
  function cuerpo(o) {
    const kM = op(o.kM, 1, pos, 'kM'), kR = op(o.kR, 1, pos, 'kR');
    const GM = kM * GM_T, Rp = kR * R;
    return { kM, kR, GM, Rp, gs: GM / (Rp * Rp) };
  }
  // r desde { r } o { h }; nunca dentro del planeta.
  function distancia(o, c, def) {
    let r;
    if (o.r !== undefined) r = pos(o.r, 'r');
    else if (o.h !== undefined) r = c.Rp + noNeg(o.h, 'h');
    else if (def !== undefined) r = def;
    else throw new Error('Falta r o h');
    if (r < c.Rp * (1 - EPS)) throw new Error(`r no puede ser menor que el radio del planeta (${c.Rp} m): ${r}`);
    return r;
  }

  function fuerza(o) {
    obj(o);
    const m1 = pos(o.m1, 'm1'), m2 = pos(o.m2, 'm2'), r = pos(o.r, 'r'), g = op(o.G, G, pos, 'G');
    const F = g * m1 * m2 / (r * r);
    const menor = Math.min(m1, m2), mayor = Math.max(m1, m2);
    return { F, sobre1: F, sobre2: F, a1: F / m1, a2: F / m2, masivo: m1 >= m2 ? 1 : 2,
      errores: { inversoR: g * m1 * m2 / r, segunPropiaMasa: F * menor / mayor, soloElMasivo: 0 } };
  }

  function comparar(o) {
    obj(o);
    const km1 = op(o.km1, 1, pos, 'km1'), km2 = op(o.km2, 1, pos, 'km2'), kr = op(o.kr, 1, pos, 'kr');
    const k = km1 * km2;
    return { razon: k / (kr * kr), errores: { lineal: k / kr, linealDoble: k / (2 * kr), raiz: k / Math.sqrt(kr), sinMasas: 1 / (kr * kr) } };
  }

  function gAltura(o) {
    obj(o);
    const c = cuerpo(o), h = noNeg(o.h, 'h'), r = c.Rp + h;
    const g = c.gs * (c.Rp / r) ** 2;
    return { r, h, g, gs: c.gs, fraccion: g / c.gs, peso: m => pos(m, 'm') * g,
      errores: { lineal: c.gs * c.Rp / r, desdeSuperficie: h > 0 ? c.gs * (c.Rp / h) ** 2 : null, sinCambio: c.gs, cero: 0 } };
  }

  function alturaParaG(o) {
    obj(o);
    const c = cuerpo(o), f = pos(o.fraccion, 'fraccion');
    if (f > 1 + EPS) throw new Error(`fraccion debe estar entre 0 y 1 (no hay más gravedad lejos del suelo): ${o.fraccion}`);
    const h = c.Rp * (1 / Math.sqrt(f) - 1);
    return { h, r: c.Rp + h, hEnR: h / c.Rp,
      errores: { lineal: c.Rp * (1 / f - 1), desdeSuperficie: c.Rp / Math.sqrt(f), desdeSuperficieLineal: c.Rp / f } };
  }

  function planeta(o) {
    obj(o);
    const c = cuerpo(o);
    return { g: c.gs, razon: c.kM / (c.kR * c.kR), Rp: c.Rp, GM: c.GM, vRasante: Math.sqrt(c.GM / c.Rp), ve: Math.sqrt(2 * c.GM / c.Rp),
      errores: { soloMasa: G0 * c.kM, radioLineal: G0 * c.kM / c.kR, masaPorRadio: G0 * c.kM * c.kR } };
  }

  function orbita(o) {
    obj(o);
    const c = cuerpo(o), r = distancia(o, c), m = op(o.m, 1, pos, 'm'), h = r - c.Rp;
    const v = Math.sqrt(c.GM / r), w = v / r, T = 2 * Math.PI / w, g = c.GM / (r * r);
    const Ec = m * v * v / 2, Ep = -c.GM * m / r;
    const estado = t => {
      const th = Math.PI / 2 + w * num(t, 't');
      return { theta: th * 180 / Math.PI, x: r * Math.cos(th), y: r * Math.sin(th), vx: -v * Math.sin(th), vy: v * Math.cos(th) };
    };
    return { r, h: Math.abs(h) < EPS * r ? 0 : h, v, w, T, g, F: m * g, Ec, Ep, E: Ec + Ep, ve: Math.sqrt(2 * c.GM / r), estado,
      errores: { vConH: h > EPS * r ? Math.sqrt(c.GM / h) : null, vConG0: Math.sqrt(c.gs * r), EpMgh: m * c.gs * h } };
  }

  function kepler3(o) {
    obj(o);
    const r1 = pos(o.r1, 'r1'), r2 = pos(o.r2, 'r2'), kr = r2 / r1, kT = kr ** 1.5, kv = 1 / Math.sqrt(kr);
    const km = op(o.m2, 1, pos, 'm2') / op(o.m1, 1, pos, 'm1');
    const T1 = o.T1 === undefined ? undefined : pos(o.T1, 'T1');
    return { kr, kT, kv, km, T1, T2: T1 === undefined ? undefined : T1 * kT,
      errores: { Tlineal: kr, Tcuadrado: kr * kr, Traiz: Math.sqrt(kr), kvConMasa: kv * km, kvConRaizMasa: kv * Math.sqrt(km) } };
  }

  function geoestacionario(o) {
    o = o || {};
    const c = cuerpo(o), T = op(o.T, DIA, pos, 'T');
    const r = Math.cbrt(c.GM * T * T / (4 * Math.PI * Math.PI));
    if (r < c.Rp) throw new Error('Con ese período la órbita quedaría dentro del planeta');
    return { T, r, h: r - c.Rp, rEnR: r / c.Rp, hEnR: (r - c.Rp) / c.Rp, v: 2 * Math.PI * r / T, errores: { alturaEsR: r } };
  }

  function escape(o) {
    o = o || {};
    const c = cuerpo(o), r = distancia(o, c, c.Rp);
    const vc = Math.sqrt(c.GM / r), ve = Math.sqrt(2 * c.GM / r);
    return { r, ve, vc, razon: ve / vc, errores: { orbital: vc, doble: 2 * vc, infinita: Infinity } };
  }

  // Simpson compuesto (n par).
  function simpson(f, a, b, n) {
    if (n % 2) n++;
    const h = (b - a) / n; let s = f(a) + f(b);
    for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
    return s * h / 3;
  }

  function lanzamiento(o) {
    obj(o);
    const c = cuerpo(o), h0 = op(o.h0, 0, noNeg, 'h0'), v0 = pos(o.v0, 'v0'), r0 = c.Rp + h0;
    const H = r0 * v0, p = H * H / c.GM, e = v0 * v0 * r0 / c.GM - 1;
    const rDe = phi => p / (1 + e * Math.cos(phi));
    const energia = v0 * v0 / 2 - c.GM / r0;
    let tipo, phiChoque = null, rMin, rMax, a = null, T = null;
    if (e >= 1 - EPS) { tipo = 'escapa'; rMin = r0; rMax = Infinity; }
    else {
      a = p / (1 - e * e); T = 2 * Math.PI * Math.sqrt(a ** 3 / c.GM);
      rMin = p / (1 + Math.abs(e)); rMax = p / (1 - Math.abs(e));
      if (Math.abs(e) < EPS) tipo = 'circular';
      else if (e < 0 && rMin < c.Rp * (1 - EPS)) {
        tipo = 'cae';
        // p/(1 + e·cos φ) = Rp → cos φ = (p/Rp − 1)/e, con φ en (0, π].
        phiChoque = Math.acos(Math.max(-1, Math.min(1, (p / c.Rp - 1) / e)));
      } else tipo = 'eliptica';
    }
    // Hasta dónde llega el recorrido: el choque, una vuelta o el radio tope (si escapa o se aleja demasiado).
    const phiFin = rTope => {
      if (tipo === 'cae') return phiChoque;
      if (tipo !== 'escapa' && rMax <= rTope) return 2 * Math.PI;
      // r(φ) = rTope → cos φ = (p/rTope − 1)/e (solo si e > 0 la trayectoria se aleja).
      const cs = (p / rTope - 1) / e;
      return Math.acos(Math.max(-1, Math.min(1, cs)));
    };
    const tDe = phi => simpson(f => rDe(f) ** 2 / H, 0, phi, 200);
    function recorrido(n, rTope) {
      n = Math.max(2, Math.round(op(n, 120, pos, 'n'))); rTope = op(rTope, 6 * c.Rp, pos, 'rTope');
      const fin = phiFin(rTope), pts = [];
      let t = 0, prev = 0;
      for (let i = 0; i <= n; i++) {
        const phi = fin * i / n, r = rDe(phi);
        if (i) t += simpson(f => rDe(f) ** 2 / H, prev, phi, 16);
        pts.push({ phi, r, x: r * Math.sin(phi), y: r * Math.cos(phi), t }); prev = phi;
      }
      return pts;
    }
    function en(t, rTope) {
      t = noNeg(t, 't');
      const pts = recorrido(400, rTope), ult = pts[pts.length - 1];
      if (tipo === 'circular' || tipo === 'eliptica') { if (ult.phi >= 2 * Math.PI - EPS) t = t % ult.t; }
      if (t >= ult.t) return Object.assign({ fin: true }, ult);
      let i = 1; while (pts[i].t < t) i++;
      const A = pts[i - 1], B = pts[i], f = (t - A.t) / (B.t - A.t), phi = A.phi + f * (B.phi - A.phi), r = rDe(phi);
      return { phi, r, x: r * Math.sin(phi), y: r * Math.cos(phi), t, fin: false };
    }
    return { v0, h0, r0, H, p, e, tipo, phiChoque, rMin, rMax, a, T, energia, vc: Math.sqrt(c.GM / r0), ve: Math.sqrt(2 * c.GM / r0),
      vSinChoque: Math.sqrt(2 * c.GM * c.Rp / (r0 * (r0 + c.Rp))), rDe, tDe, recorrido, en };
  }

  function balanza(o) {
    obj(o);
    const m = pos(o.m, 'm'), g = op(o.g, G0, pos, 'g'), a = op(o.a, 0, noNeg, 'a');
    if (a > g * (1 + EPS)) throw new Error(`a no puede pasar de g (${g}): ${o.a}`);
    return { lectura: Math.max(0, m * (g - a)), peso: m * g, a, caida: t => a * noNeg(t, 't') ** 2 / 2,
      errores: { sinCambio: m * g, aumenta: m * (g + a), mitad: m * g / 2 } };
  }

  function kepler2(o) {
    o = o || {};
    const e = num(o.e, 'e'); if (e < 0 || e >= 1) throw new Error(`e debe estar entre 0 y 1 (sin llegar a 1): ${o.e}`);
    const a = op(o.a, 1, pos, 'a'), T = op(o.T, 1, pos, 'T'), n = Math.round(op(o.n, 8, pos, 'n'));
    const b = a * Math.sqrt(1 - e * e), GM = 4 * Math.PI * Math.PI * a ** 3 / (T * T);
    function posicion(t) {
      const M = 2 * Math.PI * num(t, 't') / T;
      let E = e < 0.8 ? M : Math.PI;
      for (let i = 0; i < 60; i++) { const d = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E)); E -= d; if (Math.abs(d) < 1e-14) break; }
      const x = a * (Math.cos(E) - e), y = b * Math.sin(E), r = Math.hypot(x, y);
      return { E, theta: Math.atan2(y, x), r, x, y, v: Math.sqrt(GM * (2 / r - 1 / a)) };
    }
    const sectores = []; for (let k = 0; k <= n; k++) sectores.push(posicion(k * T / n));
    const rp = a * (1 - e), ra = a * (1 + e), vp = Math.sqrt(GM * (2 / rp - 1 / a)), va = Math.sqrt(GM * (2 / ra - 1 / a));
    return { e, a, b, T, GM, rp, ra, vp, va, razonV: vp / va, areaSector: Math.PI * a * b / n, n, posicion, sectores,
      errores: { rapidezConstante: 1, alReves: (1 - e) / (1 + e) } };
  }

  return { G, G0, R, GM_T, M_T, DIA, fuerza, comparar, gAltura, alturaParaG, planeta, orbita, kepler3, geoestacionario,
    escape, lanzamiento, balanza, kepler2 };
});
