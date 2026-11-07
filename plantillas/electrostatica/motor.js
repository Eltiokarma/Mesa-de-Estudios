/*
 * Motor de «Cargas que se empujan: Coulomb, campo y potencial».
 *
 * Aquí vive toda la física de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorElectrostatica) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Unidades: cargas en µC (microcoulomb), distancias y posiciones en metros, masas en kg, campo en N/C, potencial
 * en V, fuerza en N, trabajo y energía en J. Condensadores: capacidades en µF, cargas en µC y energías en µJ
 * (porque µF · V² = µJ). k = 9 × 10⁹ N·m²/C², ε₀ = 8,85 × 10⁻¹² C²/(N·m²) y g = 10 m/s², como en las academias.
 * Una carga en el plano es { q, x, y } (q en µC con su signo; x e y en m). Ángulos en grados desde el eje x, antihorario.
 *
 *   coulomb(q1, q2, r)                 fuerza entre dos cargas: la MISMA sobre cada una (tercera ley), y el campo de
 *                                      cada una en el lugar de la otra (distintos aunque las fuerzas sean iguales)
 *   cambioDistancia(q1, q2, r, f)      la fuerza cuando la distancia se multiplica por f: baja con f², no con f
 *   fuerzaSobre(cargas, i)             fuerza neta sobre la carga i por superposición (suma de flechas, por componentes)
 *   campo(cargas, punto)               campo E (vector) en un punto: existe haya o no carga de prueba
 *   potencial(cargas, punto)           potencial V (escalar) en un punto: se suma con signo, sin dirección
 *   campoYPotencial(cargas, punto)     los dos juntos: pueden anularse por separado (E = 0 no obliga a V = 0)
 *   prueba(cargas, punto, q0)          carga de prueba q0 en el punto: F = q0·E; con q0 < 0, F va contra E y E no cambia
 *   trabajo(cargas, A, B, q)           trabajo del campo al llevar q de A a B, W = q(V_A − V_B); el del agente externo
 *                                      que la lleva despacio es el opuesto; ΔU = q(V_B − V_A)
 *   esferas(q1, q2, r, m1, m2, g)      dos esferas colgadas separadas r: tan θ = F/(m·g); con masas iguales, mismo ángulo
 *   esferasColgadas(q1, q2, m1, m2, L, g)  lo mismo con hilos de largo L desde un mismo punto: busca r (bisección)
 *   campoUniforme(o)                   carga que entra entre dos placas: F = qE, a = qE/m, tiempo, desvío y hacia qué placa
 *   capacidad(o)                       condensador plano: C = k·ε₀·A/d; no depende de la carga Q (con Q = 0 sigue igual)
 *   cambioPlacas(A, d, fA, fD)         la capacidad cuando el área se multiplica por fA y la distancia por fD
 *   serie(Cs, V), paralelo(Cs, V)      condensadores: capacidad equivalente, carga, voltaje y energía de cada uno
 *   energiaCondensador(C, V)           U = C·V²/2 = Q·V/2 = Q²/(2C)
 *   contacto(Q1, R1, Q2, R2)           dos esferas conductoras que se tocan: la carga se reparte hasta igualar el
 *                                      potencial (proporcional al radio), no en partes iguales
 *   mapaCampo(cargas, caja, n)         flechitas del campo en una cuadrícula, con su dirección y su intensidad relativa
 *   curvaNivel(cargas, V0, caja, n)    tramos de la equipotencial V = V0 (cuadrados que marchan), para dibujarla
 *
 * Cada resultado que alimenta una predicción trae un campo 'errores' con lo que dan los errores típicos.
 * Los errores con dato están en docs/investigacion/electromagnetismo-moderna-ideas-erroneas.md (EL1 a EL9).
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorElectrostatica = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const K = 9e9;            // N·m²/C²
  const EPS0 = 8.85e-12;    // C²/(N·m²)
  const MICRO = 1e-6;
  const G = 10;             // m/s²
  const TOL = 1e-9;
  const GRADOS = 180 / Math.PI;

  function numero(x, que) {
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que} debe ser un número`);
    return x;
  }
  function positivo(x, que) {
    numero(x, que);
    if (!(x > 0)) throw new Error(`${que} debe ser mayor que cero`);
    return x;
  }
  // Redondea a 12 cifras significativas para que 1,2000000000000002 salga 1,2 (solo para lo que se muestra o compara).
  const limpio = x => (x === 0 ? 0 : Number(x.toPrecision(12)) + 0);
  const angulo = (x, y) => { const a = Math.atan2(y, x) * GRADOS; return limpio(a < 0 ? a + 360 : a); };

  function carga(c, k) {
    if (!c || typeof c !== 'object') throw new Error(`la carga ${k + 1} debe ser { q, x, y }`);
    numero(c.q, `la carga ${k + 1} (q)`); numero(c.x, `la carga ${k + 1} (x)`); numero(c.y, `la carga ${k + 1} (y)`);
    return { q: c.q, x: c.x, y: c.y };
  }
  function lista(cargas) {
    if (!Array.isArray(cargas) || cargas.length === 0) throw new Error('hace falta una lista de cargas');
    return cargas.map(carga);
  }
  function punto(p, que) {
    let x, y;
    if (Array.isArray(p)) { x = p[0]; y = p[1]; } else if (p && typeof p === 'object') { x = p.x; y = p.y; }
    numero(x, `${que || 'el punto'} (x)`); numero(y, `${que || 'el punto'} (y)`);
    return { x, y };
  }

  // ---------- Coulomb entre dos cargas ----------
  // Fuerza de Coulomb (módulo) entre q1 y q2 (µC) a r metros.
  const fCoulomb = (q1, q2, r) => K * Math.abs(q1 * MICRO) * Math.abs(q2 * MICRO) / (r * r);

  function coulomb(q1, q2, r) {
    numero(q1, 'q1'); numero(q2, 'q2'); positivo(r, 'la distancia r');
    if (q1 === 0 || q2 === 0) throw new Error('las dos cargas deben ser distintas de cero');
    const F = limpio(fCoulomb(q1, q2, r));
    const mayor = Math.max(Math.abs(q1), Math.abs(q2)), menor = Math.min(Math.abs(q1), Math.abs(q2));
    return {
      F,
      sobre1: F, sobre2: F,               // tercera ley: iguales y opuestas, sin importar cuál carga es mayor
      razon: 1,                           // F sobre la menor / F sobre la mayor
      tipo: q1 * q2 > 0 ? 'repulsion' : 'atraccion',
      // Campo de cada una en el lugar de la otra: distintos (E = k|q|/r²), y por eso F = q·E sale igual en las dos.
      E2en1: limpio(K * Math.abs(q2 * MICRO) / (r * r)),
      E1en2: limpio(K * Math.abs(q1 * MICRO) / (r * r)),
      errores: {
        // EL1: «la carga mayor ejerce más fuerza»; la razón F(sobre la menor)/F(sobre la mayor) que predice
        mayorEmpujaMas: limpio(mayor / menor),
        // EL2: «sobre la carga mayor actúa más fuerza»
        mayorRecibeMas: limpio(menor / mayor),
        // hipótesis: 1/r en vez de 1/r²
        unoSobreR: limpio(F * r),
        // hipótesis: no pasar µC a C (usar 2 en vez de 2 × 10⁻⁶)
        sinMicro: limpio(F / (MICRO * MICRO)),
      },
    };
  }

  function cambioDistancia(q1, q2, r, f) {
    positivo(f, 'el factor');
    const a = coulomb(q1, q2, r), b = coulomb(q1, q2, r * f);
    return {
      F0: a.F, F1: b.F, r1: limpio(r * f), razon: limpio(1 / (f * f)),
      errores: {
        lineal: limpio(a.F / f),          // 1/r: al doble de distancia, la mitad
        sinCambio: a.F,                   // «las cargas son las mismas»
        alReves: limpio(a.F * f),         // más lejos, más fuerza
        alRevesCuadrado: limpio(a.F * f * f),
      },
    };
  }

  // ---------- Superposición en el plano ----------
  // Vector (componentes) de la fuerza que la carga j ejerce sobre la carga i.
  function fuerzaDe(ci, cj) {
    const dx = ci.x - cj.x, dy = ci.y - cj.y, r = Math.hypot(dx, dy);
    if (r < 1e-12) throw new Error('dos cargas no pueden estar en el mismo punto');
    // con signo: positiva si se repelen (apunta de j hacia i)
    const s = K * (ci.q * MICRO) * (cj.q * MICRO) / (r * r);
    return { x: s * dx / r, y: s * dy / r, modulo: Math.abs(s), r };
  }
  function sumar(partes) {
    let x = 0, y = 0;
    for (const p of partes) { x += p.x; y += p.y; }
    const m = Math.hypot(x, y), esc = Math.max(1e-300, ...partes.map(p => p.modulo));
    if (m <= TOL * esc) { x = 0; y = 0; }
    return { x: limpio(x), y: limpio(y), modulo: limpio(Math.hypot(x, y)) };
  }
  function erroresSuma(partes) {
    const ms = partes.map(p => p.modulo).sort((a, b) => b - a);
    const suma = ms.reduce((s, m) => s + m, 0);
    return {
      sumaModulos: limpio(suma),                                      // sumar las fuerzas como números
      restaModulos: limpio(Math.abs(ms[0] - ms.slice(1).reduce((s, m) => s + m, 0))),
      sinCuadrados: limpio(Math.sqrt(suma)),                          // «Pitágoras» sin elevar al cuadrado
    };
  }

  function fuerzaSobre(cargas, i) {
    const cs = lista(cargas);
    if (!Number.isInteger(i) || i < 0 || i >= cs.length) throw new Error('el índice de la carga no está en la lista');
    if (cs[i].q === 0) throw new Error('la carga elegida debe ser distinta de cero');
    const partes = [];
    cs.forEach((c, j) => { if (j !== i && c.q !== 0) { const f = fuerzaDe(cs[i], c); partes.push({ de: j, x: limpio(f.x), y: limpio(f.y), modulo: limpio(f.modulo), r: limpio(f.r), angulo: angulo(f.x, f.y) }); } });
    if (!partes.length) throw new Error('hace falta otra carga que ejerza fuerza');
    const R = sumar(partes);
    return { ...R, angulo: R.modulo ? angulo(R.x, R.y) : 0, partes, errores: erroresSuma(partes) };
  }

  // Campo de cada carga en el punto (N/C): apunta alejándose de las positivas y hacia las negativas.
  function partesCampo(cs, p) {
    return cs.filter(c => c.q !== 0).map(c => {
      const dx = p.x - c.x, dy = p.y - c.y, r = Math.hypot(dx, dy);
      if (r < 1e-12) throw new Error('el punto no puede estar sobre una carga');
      const s = K * c.q * MICRO / (r * r);
      return { x: s * dx / r, y: s * dy / r, modulo: Math.abs(s), r };
    });
  }
  function campo(cargas, p) {
    const cs = lista(cargas), P = punto(p);
    const pr = partesCampo(cs, P);
    const R = sumar(pr);
    return {
      ...R, angulo: R.modulo ? angulo(R.x, R.y) : 0,
      partes: pr.map(q => ({ x: limpio(q.x), y: limpio(q.y), modulo: limpio(q.modulo), r: limpio(q.r) })),
      errores: erroresSuma(pr),
    };
  }
  function potencial(cargas, p) {
    const cs = lista(cargas), P = punto(p);
    const partes = cs.filter(c => c.q !== 0).map(c => {
      const r = Math.hypot(P.x - c.x, P.y - c.y);
      if (r < 1e-12) throw new Error('el punto no puede estar sobre una carga');
      return { V: K * c.q * MICRO / r, r, q: c.q };
    });
    let V = partes.reduce((s, q) => s + q.V, 0);
    const esc = Math.max(1e-300, ...partes.map(q => Math.abs(q.V)));
    if (Math.abs(V) <= TOL * esc) V = 0;
    return {
      V: limpio(V),
      partes: partes.map(q => ({ V: limpio(q.V), r: limpio(q.r) })),
      errores: {
        sinSigno: limpio(partes.reduce((s, q) => s + Math.abs(q.V), 0)),               // sumar sin el signo de cada carga
        conCuadrado: limpio(partes.reduce((s, q) => s + K * q.q * MICRO / (q.r * q.r), 0)),  // 1/r² como el campo
      },
    };
  }
  function campoYPotencial(cargas, p) {
    const E = campo(cargas, p), V = potencial(cargas, p);
    return {
      E, V: V.V, Ecero: E.modulo === 0, Vcero: V.V === 0,
      errores: {
        // hipótesis: «si se anula uno, se anula el otro» (entre +q y −q, «todo se anula»)
        todoSeAnula: { Ecero: true, Vcero: true },
        // al revés: el campo sí y el potencial no
        cambiados: { Ecero: !(E.modulo === 0), Vcero: !(V.V === 0) },
        // nada se anula (sumar sin signo)
        nadaSeAnula: { Ecero: false, Vcero: false, V: V.errores.sinSigno, E: E.errores.sumaModulos },
      },
    };
  }

  function prueba(cargas, p, q0) {
    numero(q0, 'la carga de prueba q0');
    if (q0 === 0) throw new Error('la carga de prueba debe ser distinta de cero');
    const E = campo(cargas, p);
    const F = { x: limpio(q0 * MICRO * E.x), y: limpio(q0 * MICRO * E.y), modulo: limpio(Math.abs(q0) * MICRO * E.modulo) };
    const s = Math.sign(q0);
    return {
      E: { x: E.x, y: E.y, modulo: E.modulo, angulo: E.angulo },
      F: { ...F, angulo: F.modulo ? angulo(F.x, F.y) : 0 },
      mismoSentido: q0 > 0,               // F va con E si q0 > 0 y contra E si q0 < 0
      errores: {
        // EL4: el sentido del campo depende del signo de la carga de prueba
        campoSigueAlSigno: { E: { x: limpio(s * E.x), y: limpio(s * E.y) }, F: { x: limpio(Math.abs(q0) * MICRO * E.x), y: limpio(Math.abs(q0) * MICRO * E.y) } },
        // EL5 (parcial): la fuerza la decide el campo, sin importar la carga que lo siente
        fuerzaSoloDelCampo: { F: { x: limpio(Math.abs(q0) * MICRO * E.x), y: limpio(Math.abs(q0) * MICRO * E.y) } },
        // hipótesis: se invierte el campo y la fuerza no
        invierteCampo: { E: { x: limpio(-E.x), y: limpio(-E.y) }, F: { x: limpio(Math.abs(q0) * MICRO * E.x), y: limpio(Math.abs(q0) * MICRO * E.y) } },
      },
    };
  }

  // ---------- Trabajo y energía potencial ----------
  function trabajo(cargas, A, B, q) {
    numero(q, 'la carga q');
    const PA = punto(A, 'A'), PB = punto(B, 'B');
    const VA = potencial(cargas, PA).V, VB = potencial(cargas, PB).V;
    const Wc = limpio(q * MICRO * (VA - VB));
    const FA = q ? campo(cargas, PA).modulo * Math.abs(q) * MICRO : 0;
    return {
      VA, VB, diferencia: limpio(VA - VB),
      Wcampo: Wc,                         // el campo hace este trabajo al llevar q de A a B
      Wagente: limpio(-Wc),               // el agente externo que la lleva despacio (sin ganar rapidez)
      deltaU: limpio(-Wc),                // ΔU = U_B − U_A = q(V_B − V_A)
      UA: limpio(q * MICRO * VA), UB: limpio(q * MICRO * VB),
      errores: {
        signoCambiado: limpio(-Wc),                                  // W = q(V_B − V_A) para el campo
        sinCarga: limpio(VA - VB),                                   // olvidar multiplicar por q
        fuerzaPorDistancia: limpio(FA * Math.hypot(PB.x - PA.x, PB.y - PA.y)),   // F en A por la distancia, como si F no cambiara
      },
    };
  }

  // ---------- Esferas colgadas ----------
  function esferas(q1, q2, r, m1, m2, g) {
    const gg = g === undefined ? G : positivo(g, 'g');
    positivo(m1, 'm1'); positivo(m2 === undefined ? m1 : m2, 'm2');
    const M2 = m2 === undefined ? m1 : m2;
    const c = coulomb(q1, q2, r);
    const t1 = c.F / (m1 * gg), t2 = c.F / (M2 * gg);
    const th1 = Math.atan(t1) * GRADOS, th2 = Math.atan(t2) * GRADOS;
    const qmen = Math.min(Math.abs(q1), Math.abs(q2)), qmay = Math.max(Math.abs(q1), Math.abs(q2));
    return {
      F: c.F, tipo: c.tipo,
      tan1: limpio(t1), tan2: limpio(t2), theta1: limpio(th1), theta2: limpio(th2),
      T1: limpio(Math.hypot(c.F, m1 * gg)), T2: limpio(Math.hypot(c.F, M2 * gg)),
      peso1: limpio(m1 * gg), peso2: limpio(M2 * gg),
      mismoAngulo: Math.abs(th1 - th2) < 1e-9,
      // razón tan θ(de la menor carga) / tan θ(de la mayor): con masas iguales es 1
      razon: limpio(Math.abs(q1) <= Math.abs(q2) ? t1 / t2 : t2 / t1),
      errores: {
        menorSeAparta: limpio(qmay / qmen),    // EL3 (con EL1): «la mayor la empuja más»; la de menor carga se aparta más
        mayorSeAparta: limpio(qmen / qmay),    // EL3 (con EL2): se aparta más la de mayor carga
        mayorVertical: { thetaMayor: 0 },      // versión extrema de EL1: la de mayor carga queda vertical
      },
    };
  }
  // Hilos de largo L desde un mismo punto: L·sen θ1 + L·sen θ2 = r. El lado izquierdo baja al crecer r y el derecho
  // sube, así que hay una sola separación de equilibrio entre 0 y 2L.
  function esferasColgadas(q1, q2, m1, m2, L, g) {
    positivo(L, 'el largo del hilo L');
    const gg = g === undefined ? G : positivo(g, 'g');
    const M2 = m2 === undefined ? m1 : m2;
    positivo(m1, 'm1'); positivo(M2, 'm2');
    if (q1 * q2 <= 0) throw new Error('las esferas se separan solo si se repelen (cargas del mismo signo)');
    const exceso = r => { const F = fCoulomb(q1, q2, r); return L * Math.sin(Math.atan(F / (m1 * gg))) + L * Math.sin(Math.atan(F / (M2 * gg))) - r; };
    let a = 1e-9 * L, b = 2 * L;
    for (let k = 0; k < 200; k++) { const m = (a + b) / 2; if (exceso(m) > 0) a = m; else b = m; }
    const r = (a + b) / 2;
    return { ...esferas(q1, q2, r, m1, M2, gg), r: limpio(r), L };
  }

  // ---------- Carga en campo uniforme (entre placas) ----------
  // La placa positiva arriba y la negativa abajo: E apunta hacia abajo. La carga entra horizontal con v0 y recorre
  // el largo L de las placas. Sin gravedad (salvo que se pida con { gravedad: true }).
  function campoUniforme(o) {
    if (!o || typeof o !== 'object') throw new Error('faltan los datos: { E, q, m, v0, L }');
    positivo(o.E, 'el campo E'); numero(o.q, 'la carga q'); positivo(o.m, 'la masa m'); positivo(o.v0, 'la rapidez v0'); positivo(o.L, 'el largo L');
    const F = o.q * MICRO * o.E;                 // con signo: + hacia la placa negativa (abajo)
    const gg = o.gravedad ? (o.g === undefined ? G : o.g) : 0;
    const a = F / o.m + gg;                      // hacia abajo
    const t = o.L / o.v0;
    const y = a * t * t / 2;                     // desvío hacia abajo (negativo si va hacia arriba)
    const hacia = Math.abs(y) < 1e-15 ? 'ninguna' : y > 0 ? 'negativa' : 'positiva';
    const choca = o.d !== undefined && Math.abs(y) > o.d / 2;
    return {
      F: limpio(Math.abs(F)), a: limpio(Math.abs(a)), t: limpio(t), desvio: limpio(Math.abs(y)), hacia,
      vy: limpio(Math.abs(a * t)), angulo: limpio(Math.atan2(Math.abs(a * t), o.v0) * GRADOS),
      choca, abajo: limpio(y),
      errores: {
        mismoLado: { desvio: limpio(Math.abs(y)), hacia: 'negativa' },     // el campo decide el lado, no el signo de q
        sinMedio: limpio(Math.abs(a * t * t)),                             // y = a·t² sin el 1/2
        dobleCarga: limpio(Math.abs(2 * y)),
        sinDesvio: 0,
      },
    };
  }
  // Puntos de la trayectoria (para dibujarla): x de 0 a L.
  function trayectoriaUniforme(o, n) {
    const r = campoUniforme(o), N = n || 24, pts = [];
    const a = r.abajo * 2 / (r.t * r.t);
    for (let k = 0; k <= N; k++) { const t = r.t * k / N; pts.push({ x: limpio(o.v0 * t), y: limpio(-a * t * t / 2) }); }
    return pts;
  }

  // ---------- Condensadores ----------
  // C = k·ε₀·A/d en faradios (y en pF para mostrar). Q (C) es opcional: la capacidad no depende de ella.
  function capacidad(o) {
    if (!o || typeof o !== 'object') throw new Error('faltan los datos: { A, d }');
    positivo(o.A, 'el área A'); positivo(o.d, 'la distancia d');
    const k = o.k === undefined ? 1 : positivo(o.k, 'la constante dieléctrica k');
    const C = k * EPS0 * o.A / o.d;
    const r = { C: limpio(C), pF: limpio(C * 1e12) };
    if (o.Q !== undefined) {
      numero(o.Q, 'la carga Q');
      r.Q = o.Q; r.V = limpio(o.Q / C);
      r.U = limpio(o.Q * o.Q / (2 * C));
    }
    r.errores = {
      conLaCarga: o.Q === 0 ? 0 : r.C,            // EL7: «si Q = 0, entonces C = Q/V = 0»
      sinEpsilon: limpio(k * o.A / o.d),          // olvidar ε₀
    };
    return r;
  }
  function cambioPlacas(A, d, fA, fD) {
    positivo(fA, 'el factor del área'); positivo(fD, 'el factor de la distancia');
    const c0 = capacidad({ A, d }), c1 = capacidad({ A: A * fA, d: d * fD });
    return {
      C0: c0.C, C1: c1.C, pF0: c0.pF, pF1: c1.pF, razon: limpio(fA / fD),
      errores: {
        alReves: limpio(c0.pF * fD / fA),          // más separadas, más capacidad
        sinCambio: c0.pF,                          // la capacidad «es la del condensador» y no cambia
        cuadrado: limpio(c0.pF * fA / (fD * fD)),  // 1/d² como en Coulomb
      },
    };
  }
  function listaC(Cs) {
    if (!Array.isArray(Cs) || Cs.length === 0) throw new Error('hace falta una lista de capacidades');
    Cs.forEach((c, k) => positivo(c, `la capacidad ${k + 1}`));
    return Cs;
  }
  function serie(Cs, V) {
    listaC(Cs); numero(V, 'el voltaje V');
    const Ceq = 1 / Cs.reduce((s, c) => s + 1 / c, 0);
    const Q = Ceq * V;                               // la misma carga en cada uno
    const voltajes = Cs.map(c => limpio(Q / c));
    const suma = Cs.reduce((s, c) => s + c, 0);
    return {
      Ceq: limpio(Ceq), Q: limpio(Q), cargas: Cs.map(() => limpio(Q)), voltajes,
      energias: Cs.map(c => limpio(Q * Q / (2 * c))), U: limpio(Ceq * V * V / 2),
      errores: {
        sumaCapacidades: limpio(suma),               // sumar como resistencias en serie
        promedio: limpio(suma / Cs.length),
        menor: Math.min(...Cs),
        voltajesIguales: Cs.map(() => limpio(V / Cs.length)),   // repartir el voltaje en partes iguales
        cargasDistintas: Cs.map(c => limpio(c * V)),            // cada uno con todo el voltaje
        Uconsuma: limpio(suma * V * V / 2),
      },
    };
  }
  function paralelo(Cs, V) {
    listaC(Cs); numero(V, 'el voltaje V');
    const Ceq = Cs.reduce((s, c) => s + c, 0);
    return {
      Ceq: limpio(Ceq), Q: limpio(Ceq * V), cargas: Cs.map(c => limpio(c * V)), voltajes: Cs.map(() => V),
      energias: Cs.map(c => limpio(c * V * V / 2)), U: limpio(Ceq * V * V / 2),
      errores: {
        comoSerie: limpio(1 / Cs.reduce((s, c) => s + 1 / c, 0)),
        cargasIguales: Cs.map(() => limpio(Ceq * V / Cs.length)),
      },
    };
  }
  function energiaCondensador(C, V) {
    positivo(C, 'la capacidad C'); numero(V, 'el voltaje V');
    const Q = C * V;
    return { U: limpio(C * V * V / 2), Q: limpio(Q), QV2: limpio(Q * V / 2), Q2C: limpio(Q * Q / (2 * C)),
      errores: { sinMedio: limpio(C * V * V), lineal: limpio(C * V / 2) } };
  }

  // ---------- Conductores que se tocan ----------
  // Dos esferas conductoras (cargas en µC, radios en m) se tocan y se separan: la carga total se reparte hasta que
  // las dos tengan el mismo potencial, kQ1'/R1 = kQ2'/R2. La esfera más grande se queda con más carga.
  function contacto(Q1, R1, Q2, R2) {
    numero(Q1, 'Q1'); numero(Q2, 'Q2'); positivo(R1, 'R1'); positivo(R2, 'R2');
    const T = Q1 + Q2;
    const Q1f = T * R1 / (R1 + R2), Q2f = T * R2 / (R1 + R2);
    return {
      total: limpio(T), Q1f: limpio(Q1f), Q2f: limpio(Q2f),
      V: limpio(K * Q1f * MICRO / R1),                // el mismo en las dos (lejos una de la otra)
      V1antes: limpio(K * Q1 * MICRO / R1), V2antes: limpio(K * Q2 * MICRO / R2),
      pasa: limpio(Q1 - Q1f),                         // carga que pasa de la 1 a la 2
      errores: {
        mitades: limpio(T / 2),                       // EL8: «se reparte en partes iguales»
        alReves: { Q1f: limpio(T * R2 / (R1 + R2)), Q2f: limpio(T * R1 / (R1 + R2)) },   // la chica se queda con más
        todaPasa: { Q1f: 0, Q2f: limpio(T) },
      },
    };
  }

  // ---------- Para dibujar el campo y las equipotenciales ----------
  // caja = { x0, x1, y0, y1 } en metros; n = flechitas por fila. Se saltan los puntos muy cerca de una carga.
  // nivel: intensidad relativa de 0 a 1 en escala logarítmica (1 = el campo más fuerte de la cuadrícula).
  function mapaCampo(cargas, caja, n, o) {
    const cs = lista(cargas); o = o || {};
    if (!caja || !(caja.x1 > caja.x0) || !(caja.y1 > caja.y0)) throw new Error('la caja debe tener x0 < x1 e y0 < y1');
    const N = n === undefined ? 12 : n;
    if (!Number.isInteger(N) || N < 2) throw new Error('n debe ser un entero de 2 o más');
    const paso = (caja.x1 - caja.x0) / N, evitar = o.evitar === undefined ? paso * 0.6 : o.evitar;
    const pts = [];
    for (let y = caja.y0 + paso / 2; y < caja.y1; y += paso)
      for (let x = caja.x0 + paso / 2; x < caja.x1; x += paso) {
        if (cs.some(c => c.q !== 0 && Math.hypot(x - c.x, y - c.y) < evitar)) continue;
        const E = campo(cs, { x, y });
        pts.push({ x: limpio(x), y: limpio(y), Ex: E.x, Ey: E.y, modulo: E.modulo, ux: E.modulo ? E.x / E.modulo : 0, uy: E.modulo ? E.y / E.modulo : 0 });
      }
    const logs = pts.filter(p => p.modulo > 0).map(p => Math.log10(p.modulo));
    const hi = logs.length ? Math.max(...logs) : 0, lo = hi - (o.decadas || 2);
    for (const p of pts) p.nivel = p.modulo > 0 ? Math.max(0, Math.min(1, (Math.log10(p.modulo) - lo) / (hi - lo))) : 0;
    return { paso: limpio(paso), puntos: pts };
  }
  // Cuadrados que marchan: tramos [{x1,y1,x2,y2}] donde V = V0 (interpolación lineal en cada celda).
  function curvaNivel(cargas, V0, caja, n) {
    const cs = lista(cargas); numero(V0, 'V0');
    const N = n === undefined ? 60 : n;
    const dx = (caja.x1 - caja.x0) / N, ny = Math.max(2, Math.round((caja.y1 - caja.y0) / dx)), dy = (caja.y1 - caja.y0) / ny;
    const val = [];
    for (let j = 0; j <= ny; j++) {
      const fila = [];
      for (let i = 0; i <= N; i++) {
        const x = caja.x0 + i * dx, y = caja.y0 + j * dy;
        const cerca = cs.some(c => c.q !== 0 && Math.hypot(x - c.x, y - c.y) < 1e-9);
        fila.push(cerca ? NaN : potencial(cs, { x, y }).V - V0);
      }
      val.push(fila);
    }
    const tramos = [];
    const corte = (xa, ya, va, xb, yb, vb) => { const t = va / (va - vb); return { x: xa + (xb - xa) * t, y: ya + (yb - ya) * t }; };
    for (let j = 0; j < ny; j++) for (let i = 0; i < N; i++) {
      const x = caja.x0 + i * dx, y = caja.y0 + j * dy;
      const v = [val[j][i], val[j][i + 1], val[j + 1][i + 1], val[j + 1][i]];
      if (v.some(Number.isNaN)) continue;
      const P = [[x, y], [x + dx, y], [x + dx, y + dy], [x, y + dy]];
      const cortes = [];
      for (let k = 0; k < 4; k++) {
        const a = v[k], b = v[(k + 1) % 4];
        if ((a > 0) !== (b > 0) && a !== b) cortes.push(corte(P[k][0], P[k][1], a, P[(k + 1) % 4][0], P[(k + 1) % 4][1], b));
        else if (a === 0 && b !== 0) cortes.push({ x: P[k][0], y: P[k][1] });
      }
      // también un borde que cae justo en la curva (v = 0 en los dos extremos), como la mediatriz de +q y −q
      for (let k = 0; k < 4; k++) if (v[k] === 0 && v[(k + 1) % 4] === 0) tramos.push({ x1: P[k][0], y1: P[k][1], x2: P[(k + 1) % 4][0], y2: P[(k + 1) % 4][1] });
      for (let k = 0; k + 1 < cortes.length; k += 2) tramos.push({ x1: cortes[k].x, y1: cortes[k].y, x2: cortes[k + 1].x, y2: cortes[k + 1].y });
    }
    return tramos;
  }
  // Radio de la equipotencial V de una carga puntual sola (V = kq/r → r = kq/V).
  function radioEquipotencial(q, V) {
    numero(q, 'q'); numero(V, 'V');
    if (q === 0 || V === 0 || q * V < 0) throw new Error('la carga y el potencial deben ser distintos de cero y del mismo signo');
    return limpio(K * q * MICRO / V);
  }

  // Azar con semilla (pruebas).
  function azar(sem) { let s = (sem >>> 0) || 1; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; }

  return {
    K, EPS0, MICRO, G, TOL,
    coulomb, cambioDistancia, fuerzaSobre, campo, potencial, campoYPotencial, prueba, trabajo,
    esferas, esferasColgadas, campoUniforme, trayectoriaUniforme,
    capacidad, cambioPlacas, serie, paralelo, energiaCondensador, contacto,
    mapaCampo, curvaNivel, radioEquipotencial, azar,
  };
});
