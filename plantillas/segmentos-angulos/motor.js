/*
 * Motor de «La escuadra y las paralelas»: segmentos, ángulos y rectas paralelas cortadas por una secante.
 *
 * Aquí vive toda la geometría de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en
 * el navegador (window.MotorSegmentosAngulos) y en Node (require('./motor.js')), donde lo prueban
 * casos.json y papel.json. Los ángulos van en grados; las longitudes, en las unidades del problema.
 *
 * Segmentos sobre una recta (cada punto es su coordenada en la recta):
 *   recta({ A: 0, B: 6, C: 14, D: 24 })   orden de los puntos y la longitud de cada segmento (AB, AC, …)
 *   moverEnRecta(puntos, nombre, x, o)    corre un punto sin que cambie el orden (separación mínima o.sep)
 *   solapados({ AC, BD, AD })             A, B, C, D consecutivos: BC = AC + BD − AD (la parte común)
 *   puntosMedios({ AC, BD } | { AD, BC }) M medio de AB y N medio de CD: MN = (AC + BD)/2 = (AD + BC)/2
 *   mediosEnRecta({ A, B, C, D })  lo mismo con coordenadas (cálculo independiente)
 *   medioYDiferencia({ AB, BC } | { diferencia })  A, B, C consecutivos y M medio de AC: BM = |AB − BC|/2
 *
 * Ángulos:
 *   angulo(a)                     clase (agudo, recto, obtuso, llano…), complemento y suplemento
 *                                 Convención: el complemento existe solo para 0° < a < 90° y el suplemento para
 *                                 0° < a < 180°; fuera de eso dan null (por eso el complemento de 90° y el
 *                                 suplemento de 180° son null: el ángulo nulo no se cuenta)
 *   cadena(ops, a)                «el suplemento del complemento de 30°» = cadena(['suplemento', 'complemento'], 30)
 *   lineal(ops)                   la cadena como a·x + b (el suplemento del complemento de x es 90 + x)
 *   resolverAngulo(izq, der)      ecuaciones con complementos y suplementos de x
 *   resolverLineal(a1, b1, a2, b2)  a1·x + b1 = a2·x + b2
 *   direccion(O, P)               dirección del rayo OP (0° a la derecha, antihorario)
 *   entreRayos(d1, d2)            ángulo convexo entre dos rayos dados por su dirección
 *   bisectrices(a, b)             ángulos consecutivos a y b: sus bisectrices forman (a + b)/2
 *
 * Paralelas y una secante:
 *   ochoAngulos(dirL1, dirL2, dirSecante)  los ocho ángulos medidos con vectores (1 a 4 en L1, 5 a 8 en L2)
 *   paralelas(phi)                los ocho con L1 ∥ L2 horizontales y la secante a phi grados: dos valores
 *   par(tipo)                     qué ángulos forman un par (alternos internos…) y si son iguales o suplementarios
 *   ecuacionPar(tipo, [a1, b1], [a2, b2])  ángulos a1·x + b1 y a2·x + b2 que forman ese par: x y los ángulos
 *   noParalelas(a1, a2, d)        alternos internos distintos: las rectas se cortan; dónde y con qué ángulo
 *   quiebre(alfa, beta)           el ángulo del quiebre entre paralelas es alfa + beta
 *   reglaSerrucho({ derecha, izquierda, incognita })  la regla del serrucho con números
 *   serrucho(puntos, o)           una quebrada entre dos paralelas horizontales: ángulos, hacia dónde abre
 *                                 cada uno y las dos sumas (la regla del serrucho)
 *                                 vueltas = (suma de los que abren a la derecha − suma de los que abren a la
 *                                 izquierda)/180: siempre es un entero. Es 0 (la regla se cumple) cuando cada
 *                                 quiebre es una punta, es decir, el camino va hacia un lado y regresa; si en un
 *                                 quiebre el camino dobla pero sigue hacia el mismo lado, sale ±1
 *   construirQuebrada(A, tramos, abajo), construirQuiebre(alfa, beta, o)  coordenadas para dibujar con ángulos dados
 *   cruce(d1, d2)                 dos rectas que se cortan: los cuatro ángulos (opuestos por el vértice y adyacentes)
 *
 * Cada resultado de predicción trae un campo 'errores' con lo que dan los errores típicos de
 * docs/investigacion/geometria-ideas-erroneas.md (GE17) y de las hipótesis de la plantilla.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorSegmentosAngulos = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const TOL = 1e-9;
  const RAD = Math.PI / 180;
  const num = (x, que) => {
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que} debe ser un número`);
    return x + 0;
  };
  const limpio = x => (Math.abs(x) < 1e-12 ? 0 : Math.abs(x - Math.round(x)) < 1e-9 ? Math.round(x) : x);
  const n360 = a => { const r = ((a % 360) + 360) % 360; return Math.abs(r - 360) < 1e-12 ? 0 : r; };

  // ================= Segmentos =================
  function recta(puntos) {
    if (!puntos || typeof puntos !== 'object') throw new Error('faltan los puntos de la recta');
    const nombres = Object.keys(puntos);
    if (nombres.length < 2) throw new Error('hacen falta al menos dos puntos');
    nombres.forEach(n => num(puntos[n], `la coordenada de ${n}`));
    const orden = nombres.slice().sort((p, q) => puntos[p] - puntos[q]);
    for (let i = 1; i < orden.length; i++)
      if (Math.abs(puntos[orden[i]] - puntos[orden[i - 1]]) <= TOL) throw new Error(`${orden[i - 1]} y ${orden[i]} coinciden`);
    const segmentos = {};
    for (let i = 0; i < orden.length; i++)
      for (let j = i + 1; j < orden.length; j++)
        segmentos[orden[i] + orden[j]] = limpio(puntos[orden[j]] - puntos[orden[i]]);
    const seg = (P, Q) => {
      if (!(P in puntos) || !(Q in puntos)) throw new Error(`no hay punto ${!(P in puntos) ? P : Q}`);
      return limpio(Math.abs(puntos[P] - puntos[Q]));
    };
    const medio = (P, Q) => { seg(P, Q); return limpio((puntos[P] + puntos[Q]) / 2); };
    return { orden, segmentos, seg, medio, consecutivos: orden.join('') };
  }

  // Corre el punto 'nombre' a x sin que pase a sus vecinos (quedan a o.sep como mínimo), dentro de [o.min, o.max].
  // Redondea a o.paso. Devuelve una copia de los puntos.
  function moverEnRecta(puntos, nombre, x, o) {
    o = Object.assign({ sep: 1, min: -Infinity, max: Infinity, paso: 0 }, o);
    const r = recta(puntos), i = r.orden.indexOf(nombre);
    if (i < 0) throw new Error(`no hay punto ${nombre}`);
    const izq = i > 0 ? puntos[r.orden[i - 1]] + o.sep : o.min, der = i < r.orden.length - 1 ? puntos[r.orden[i + 1]] - o.sep : o.max;
    let v = num(x, 'x');
    if (o.paso > 0) v = Math.round(v / o.paso) * o.paso;
    v = Math.max(izq, Math.min(der, v));
    return Object.assign({}, puntos, { [nombre]: limpio(v) });
  }

  // A, B, C, D consecutivos: AC y BD se pisan en BC. AC + BD cuenta BC dos veces: AC + BD = AD + BC.
  function solapados(o) {
    const AC = num(o.AC, 'AC'), BD = num(o.BD, 'BD'), AD = num(o.AD, 'AD');
    const BC = limpio(AC + BD - AD), AB = limpio(AD - BD), CD = limpio(AD - AC);
    if (!(AB > 0 && BC > 0 && CD > 0)) throw new Error('con esas medidas A, B, C y D no son consecutivos');
    return {
      BC, AB, CD, puntos: { A: 0, B: AB, C: AB + BC, D: AD },
      errores: {
        sumaSolapados: limpio(AC + BD),        // suma los dos segmentos como si no se pisaran
        promedio: limpio((AC + BD) / 2),       // promedia los datos
        restaConAD: CD                         // AD − AC, que es CD y no BC
      }
    };
  }

  // M medio de AB y N medio de CD (A, B, C, D consecutivos): MN = AB/2 + BC + CD/2 = (AC + BD)/2 = (AD + BC)/2.
  function puntosMedios(o) {
    let s;
    if (o.AC !== undefined || o.BD !== undefined) s = num(o.AC, 'AC') + num(o.BD, 'BD');
    else if (o.AD !== undefined || o.BC !== undefined) s = num(o.AD, 'AD') + num(o.BC, 'BC');
    else throw new Error('se necesita AC y BD, o AD y BC');
    if (!(s > 0)) throw new Error('las medidas deben ser positivas');
    return { MN: limpio(s / 2), suma: limpio(s), errores: { sinMitad: limpio(s), cuarto: limpio(s / 4) } };
  }
  // Lo mismo con coordenadas, como cálculo independiente: M y N, MN, AC, BD, AD, BC.
  function mediosEnRecta(puntos) {
    const r = recta(puntos);
    if (r.consecutivos !== 'ABCD') throw new Error('A, B, C y D deben ir en ese orden');
    const M = (puntos.A + puntos.B) / 2, N = (puntos.C + puntos.D) / 2;
    return { M: limpio(M), N: limpio(N), MN: limpio(N - M), AC: r.seg('A', 'C'), BD: r.seg('B', 'D'), AD: r.seg('A', 'D'), BC: r.seg('B', 'C'),
      AB: r.seg('A', 'B'), CD: r.seg('C', 'D') };
  }

  // A, B, C consecutivos y M medio de AC: BM = |AB − BC|/2 (M queda del lado del segmento más largo).
  function medioYDiferencia(o) {
    let dif;
    if (o.diferencia !== undefined) dif = Math.abs(num(o.diferencia, 'la diferencia'));
    else dif = Math.abs(num(o.AB, 'AB') - num(o.BC, 'BC'));
    const r = { BM: limpio(dif / 2), errores: { sinMitad: limpio(dif), cuarto: limpio(dif / 4) } };
    if (o.AB !== undefined && o.BC !== undefined) {
      const AC = o.AB + o.BC;
      Object.assign(r, { AC: limpio(AC), AM: limpio(AC / 2), mEnLado: o.AB > o.BC ? 'AB' : o.AB < o.BC ? 'BC' : 'coincide con B' });
    }
    return r;
  }

  // ================= Ángulos =================
  function clase(a) {
    if (Math.abs(a) <= TOL) return 'nulo';
    if (a < 0) return 'negativo';
    if (Math.abs(a - 90) <= TOL) return 'recto';
    if (a < 90) return 'agudo';
    if (Math.abs(a - 180) <= TOL) return 'llano';
    if (a < 180) return 'obtuso';
    if (Math.abs(a - 360) <= TOL) return 'de una vuelta';
    if (a < 360) return 'cóncavo';
    return 'mayor que una vuelta';
  }
  const complementoDe = a => (a > TOL && a < 90 - TOL ? limpio(90 - a) : null);
  const suplementoDe = a => (a > TOL && a < 180 - TOL ? limpio(180 - a) : null);
  function angulo(a0) {
    const a = num(a0, 'el ángulo');
    return {
      medida: limpio(a), clase: clase(a), complemento: complementoDe(a), suplemento: suplementoDe(a),
      sumaConComplemento: complementoDe(a) === null ? null : 90, sumaConSuplemento: suplementoDe(a) === null ? null : 180,
      errores: { complementoCon180: limpio(180 - a), suplementoCon90: limpio(90 - a) }
    };
  }

  // ops se lee como en castellano: ['suplemento', 'complemento'] es «el suplemento del complemento de…»;
  // se aplica de la última a la primera. Si un paso no existe (complemento de 120°), el valor es null.
  const OPS = { complemento: x => complementoDe(x), suplemento: x => suplementoDe(x) };
  const OPS_CAMBIADAS = { complemento: x => (x > TOL && x < 180 - TOL ? limpio(180 - x) : null), suplemento: x => (x > TOL && x < 90 - TOL ? limpio(90 - x) : null) };
  function aplicar(ops, a, tabla) {
    let x = a; const pasos = [];
    for (let i = ops.length - 1; i >= 0; i--) {
      const f = tabla[ops[i]];
      if (!f) throw new Error(`operación desconocida: ${ops[i]}`);
      const y = x === null ? null : f(x);
      pasos.push({ op: ops[i], de: x, da: y }); x = y;
    }
    return { valor: x, pasos };
  }
  function cadena(ops, a0) {
    if (!Array.isArray(ops) || !ops.length) throw new Error('faltan las operaciones');
    const a = num(a0, 'el ángulo');
    const r = aplicar(ops, a, OPS);
    const inv = aplicar(ops.slice().reverse(), a, OPS), solo = aplicar([ops[0]], a, OPS), camb = aplicar(ops, a, OPS_CAMBIADAS);
    const L = lineal(ops);
    return {
      valor: r.valor, existe: r.valor !== null, pasos: r.pasos, formula: L,
      errores: {
        ordenInvertido: inv.valor,          // aplica las operaciones en el orden en que se leen
        soloElPrimero: solo.valor,          // hace solo la primera palabra
        seCancelan: limpio(a),              // cree que «el suplemento del complemento» devuelve el mismo ángulo
        constantesCambiadas: camb.valor     // complemento con 180° y suplemento con 90°
      }
    };
  }
  // La cadena como función lineal de x: complemento → 90 − x, suplemento → 180 − x.
  function lineal(ops) {
    let a = 1, b = 0;
    for (let i = ops.length - 1; i >= 0; i--) {
      const k = ops[i] === 'complemento' ? 90 : ops[i] === 'suplemento' ? 180 : null;
      if (k === null) throw new Error(`operación desconocida: ${ops[i]}`);
      a = -a; b = k - b;
    }
    return { a, b };
  }
  function resolverLineal(a1, b1, a2, b2) {
    [a1, b1, a2, b2].forEach((v, i) => num(v, `el coeficiente ${i + 1}`));
    if (Math.abs(a1 - a2) <= TOL) throw new Error(Math.abs(b1 - b2) <= TOL ? 'la ecuación se cumple para todo x' : 'la ecuación no tiene solución');
    return limpio((b2 - b1) / (a1 - a2));
  }
  // izq y der: listas de términos { k, ops } (k veces la cadena ops aplicada a x; ops [] es x mismo) o { valor }.
  function resolverAngulo(izq, der) {
    const lado = terms => terms.reduce((s, t) => {
      if (t.valor !== undefined) return { a: s.a, b: s.b + num(t.valor, 'valor') };
      const L = lineal(t.ops || []), k = t.k === undefined ? 1 : num(t.k, 'k');
      if (!(t.ops || []).length) return { a: s.a + k, b: s.b };
      return { a: s.a + k * L.a, b: s.b + k * L.b };
    }, { a: 0, b: 0 });
    const I = lado(izq), D = lado(der), x = resolverLineal(I.a, I.b, D.a, D.b);
    const comprobar = terms => terms.reduce((s, t) => s + (t.valor !== undefined ? t.valor : (t.k === undefined ? 1 : t.k) * ((t.ops || []).length ? aplicar(t.ops, x, OPS).valor : x)), 0);
    const existe = [...izq, ...der].every(t => t.valor !== undefined || !(t.ops || []).length || aplicar(t.ops, x, OPS).valor !== null);
    return { x, existe, izquierda: existe ? limpio(comprobar(izq)) : null, derecha: existe ? limpio(comprobar(der)) : null };
  }

  // Dirección del rayo OP en grados (0° a la derecha, antihorario, en [0, 360)). Ejes matemáticos: y hacia arriba.
  function direccion(O, P) {
    const dx = num(P.x, 'P.x') - num(O.x, 'O.x'), dy = num(P.y, 'P.y') - num(O.y, 'O.y');
    if (Math.hypot(dx, dy) <= TOL) throw new Error('el rayo no tiene dirección: P coincide con O');
    return limpio(n360(Math.atan2(dy, dx) / RAD));
  }
  // Ángulo convexo (0 a 180) entre dos rayos que salen del mismo vértice.
  function entreRayos(d1, d2) {
    const u = { x: Math.cos(num(d1, 'd1') * RAD), y: Math.sin(d1 * RAD) }, v = { x: Math.cos(num(d2, 'd2') * RAD), y: Math.sin(d2 * RAD) };
    return limpio(Math.atan2(Math.abs(u.x * v.y - u.y * v.x), u.x * v.x + u.y * v.y) / RAD);
  }
  // Rayos OA (dirección 0), OB (a) y OC (a + b): las bisectrices de AOB y BOC forman (a + b)/2.
  function bisectrices(a0, b0) {
    const a = num(a0, 'el primer ángulo'), b = num(b0, 'el segundo ángulo');
    if (!(a > 0 && b > 0) || a + b > 360 + TOL) throw new Error('los ángulos deben ser positivos y sumar a lo más 360°');
    const dirA = 0, dirB = a, dirC = a + b, bis1 = a / 2, bis2 = a + b / 2;
    const entre = limpio(bis2 - bis1);
    return {
      entre, porRayos: entreRayos(bis1, bis2), total: limpio(a + b), rayos: { A: dirA, B: limpio(dirB), C: limpio(n360(dirC)), bisectriz1: limpio(bis1), bisectriz2: limpio(n360(bis2)) },
      mitades: [limpio(a / 2), limpio(b / 2)], recto: Math.abs(a + b - 180) <= TOL,
      errores: { sinMitad: limpio(a + b), semidiferencia: limpio(Math.abs(a - b) / 2), soloUnaMitad: limpio(a / 2) }
    };
  }

  // ================= Paralelas y una secante =================
  // En cada cruce, la recta (hacia la derecha: dirección dL) y la secante (hacia arriba: dS) forman cuatro ángulos:
  // 1 arriba a la izquierda, 2 arriba a la derecha, 3 abajo a la izquierda, 4 abajo a la derecha (5 a 8 en L2).
  // Se miden con vectores: «arriba a la derecha» es el ángulo entre el rayo derecho de la recta y el rayo de la secante que sube.
  function cuatro(dL, dS) {
    const der = dL, izq = dL + 180, sube = dS, baja = dS + 180;
    return [entreRayos(izq, sube), entreRayos(der, sube), entreRayos(izq, baja), entreRayos(der, baja)];
  }
  // Dos rectas que se cortan (una con dirección dL y la otra con dS): los cuatro ángulos 1 a 4, como en cada cruce.
  function cruce(dL, dS) { const o = ochoAngulos(dL, dL, dS); return { angulos: o.angulos.slice(0, 4), opuestos: [[1, 4], [2, 3]], adyacentes: [[1, 2], [1, 3], [2, 4], [3, 4]] }; }
  function ochoAngulos(dirL1, dirL2, dirS) {
    [dirL1, dirL2, dirS].forEach((d, i) => num(d, ['L1', 'L2', 'la secante'][i]));
    // la recta se toma hacia la derecha (dirección en (−90, 90]) y la secante hacia arriba (en (0, 180)) respecto de cada recta
    const norm = d => { let r = n360(d); if (r > 90 && r <= 270) r -= 180; if (r > 270) r -= 360; return r; };
    const subeRespecto = (dL, dS) => { let s = n360(dS - dL); if (s >= 180) s -= 180; if (s <= TOL || s >= 180 - TOL) throw new Error('la secante es paralela a una de las rectas'); return dL + s; };
    const d1 = norm(dirL1), d2 = norm(dirL2);
    const a = cuatro(d1, subeRespecto(d1, dirS)), b = cuatro(d2, subeRespecto(d2, dirS));
    const angulos = [...a, ...b].map(limpio);
    return { angulos, porNumero: Object.fromEntries(angulos.map((v, i) => [i + 1, v])), paralelas: Math.abs(entreRayos(d1, d2)) <= 1e-9 || Math.abs(entreRayos(d1, d2) - 180) <= 1e-9 };
  }
  const PARES = {
    'alternos internos': [[3, 6], [4, 5]],
    'alternos externos': [[1, 8], [2, 7]],
    'correspondientes': [[1, 5], [2, 6], [3, 7], [4, 8]],
    'conjugados internos': [[3, 5], [4, 6]],
    'conjugados externos': [[1, 7], [2, 8]],
    'opuestos por el vértice': [[1, 4], [2, 3], [5, 8], [6, 7]],
    'adyacentes': [[1, 2], [3, 4], [1, 3], [2, 4], [5, 6], [7, 8], [5, 7], [6, 8]]
  };
  const SUPLEMENTARIOS = new Set(['conjugados internos', 'conjugados externos', 'adyacentes']);
  function par(tipo) {
    if (!PARES[tipo]) throw new Error(`tipo de par desconocido: ${tipo}`);
    return { tipo, pares: PARES[tipo], relacion: SUPLEMENTARIOS.has(tipo) ? 'suplementarios' : 'iguales', necesitaParalelas: tipo !== 'opuestos por el vértice' && tipo !== 'adyacentes' };
  }
  // L1 ∥ L2 horizontales y la secante a phi grados: los ángulos 2, 3, 6 y 7 miden phi; 1, 4, 5 y 8, 180 − phi.
  function paralelas(phi0) {
    const phi = num(phi0, 'el ángulo de la secante');
    if (!(phi > TOL && phi < 180 - TOL)) throw new Error('la secante debe cortar a las rectas (0° < phi < 180°)');
    const o = ochoAngulos(0, 0, phi);
    const iguales = [2, 3, 6, 7], suplementos = [1, 4, 5, 8];
    return Object.assign(o, { theta: limpio(phi), suplemento: limpio(180 - phi), iguales, suplementos,
      clase: o.angulos.map((v, i) => (iguales.includes(i + 1) ? 'theta' : 'suplemento')) });
  }
  // Dos ángulos a1·x + b1 y a2·x + b2 que forman el par 'tipo'. Si son iguales, se igualan; si son suplementarios, suman 180.
  function ecuacionPar(tipo, e1, e2) {
    const p = par(tipo);
    const [a1, b1] = e1.map(v => num(v, 'coeficiente')), [a2, b2] = e2.map(v => num(v, 'coeficiente'));
    const resolver = rel => {
      const x = rel === 'iguales' ? resolverLineal(a1, b1, a2, b2) : rel === 'suplementarios' ? resolverLineal(a1 + a2, b1 + b2, 0, 180) : resolverLineal(a1 + a2, b1 + b2, 0, 90);
      return { x, angulos: [limpio(a1 * x + b1), limpio(a2 * x + b2)] };
    };
    const r = resolver(p.relacion), otra = resolver(p.relacion === 'iguales' ? 'suplementarios' : 'iguales'), comp = resolver('complementarios');
    if (!r.angulos.every(v => v > TOL && v < 180 - TOL)) throw new Error('con esas expresiones los ángulos no salen entre 0° y 180°');
    return {
      tipo, relacion: p.relacion, necesitaParalelas: p.necesitaParalelas, x: r.x, angulos: r.angulos,
      errores: {
        otraRelacion: otra,            // GE17: iguala suplementarios o suplementa iguales
        complementarios: comp,         // suma 90 en vez de 180 (o de igualar)
        // pasa un número al otro lado sin cambiarle el signo
        despejeSigno: p.relacion === 'iguales' ? limpio(Math.abs((b1 + b2) / (a1 - a2))) : limpio((180 + b1 + b2) / (a1 + a2)),
        xEsElAngulo: r.angulos[0]      // responde la medida del ángulo cuando se pide x
      }
    };
  }
  // Alternos internos a1 (en P, sobre L1) y a2 (en Q, sobre L2) con PQ = d sobre la secante. Si a1 ≠ a2, las rectas se cortan
  // en R: del lado donde los conjugados internos suman menos de 180°. El triángulo PQR tiene ángulos 180 − a1, a2 y |a1 − a2|
  // (o a1, 180 − a2 y |a1 − a2|), y PR sale por la ley de senos.
  function noParalelas(a10, a20, d0) {
    const a1 = num(a10, 'a1'), a2 = num(a20, 'a2'), d = d0 === undefined ? 1 : num(d0, 'd');
    if (!(a1 > 0 && a1 < 180 && a2 > 0 && a2 < 180 && d > 0)) throw new Error('ángulos entre 0° y 180° y distancia positiva');
    const entre = limpio(Math.abs(a1 - a2));
    const conj = [limpio(180 + a1 - a2), limpio(180 - a1 + a2)];   // conjugados internos de cada lado
    if (entre <= TOL) return { paralelas: true, entre: 0, conjugados: [180, 180], corte: null, errores: { asumeParalelas: true } };
    // a1 es el ángulo 3 (en P, abajo a la izquierda) y a2 el 6 (en Q, arriba a la derecha): a la izquierda de la secante
    // los interiores son a1 y 180 − a2; a la derecha, 180 − a1 y a2. Se cortan del lado donde suman menos de 180°.
    const lado = conj[0] < conj[1] ? 'izquierda' : 'derecha';
    const enP = lado === 'izquierda' ? a1 : limpio(180 - a1), enQ = lado === 'izquierda' ? limpio(180 - a2) : a2;
    const PR = d * Math.sin(enQ * RAD) / Math.sin(entre * RAD), QR = d * Math.sin(enP * RAD) / Math.sin(entre * RAD);
    // Coordenadas: P en el origen, L1 horizontal, la secante con dirección a1 (así el ángulo 3 mide a1) y Q a d de P hacia abajo;
    // L2 pasa por Q con dirección a1 − a2 (así el ángulo 6 mide a2). R es el corte de L1 y L2.
    const psi = a1 - a2, Q = { x: -d * Math.cos(a1 * RAD), y: -d * Math.sin(a1 * RAD) };
    const R = { x: limpio(Q.x - Q.y / Math.tan(psi * RAD)), y: 0 };
    return { paralelas: false, entre, conjugados: conj, lado, enP, enQ, PR: limpio(PR), QR: limpio(QR), sumaTriangulo: limpio(enP + enQ + entre),
      coordenadas: { P: { x: 0, y: 0 }, Q: { x: limpio(Q.x), y: limpio(Q.y) }, R, dirL1: 0, dirL2: limpio(psi), dirSecante: a1 },
      errores: { asumeParalelas: false } };
  }
  // El quiebre entre paralelas (la «flecha» o la «M»): el ángulo del quiebre es la suma de los dos de las paralelas.
  function quiebre(alfa0, beta0) {
    const alfa = num(alfa0, 'alfa'), beta = num(beta0, 'beta');
    if (!(alfa > 0 && beta > 0 && alfa + beta < 360)) throw new Error('ángulos positivos que sumen menos de 360°');
    return { angulo: limpio(alfa + beta), errores: { suplementa: limpio(180 - alfa - beta), resta: limpio(Math.abs(alfa - beta)), promedio: limpio((alfa + beta) / 2) } };
  }

  // La regla del serrucho con números: los que abren a la derecha suman lo que los que abren a la izquierda.
  // o = { derecha: [...], izquierda: [...], incognita: 'derecha' | 'izquierda', vecinos: [...] } (la incógnita no va en las listas).
  function reglaSerrucho(o) {
    const D = (o.derecha || []).map(v => num(v, 'ángulo')), I = (o.izquierda || []).map(v => num(v, 'ángulo'));
    const sD = D.reduce((s, v) => s + v, 0), sI = I.reduce((s, v) => s + v, 0);
    const x = limpio(o.incognita === 'derecha' ? sI - sD : sD - sI);
    if (!(x > 0 && x < 180)) throw new Error('con esos datos el ángulo no sale entre 0° y 180°');
    const errores = { suma180: limpio(180 - sD - sI), olvidaUno: limpio(o.incognita === 'derecha' ? sI : sD) };
    if (o.vecinos) errores.soloVecinos = limpio(o.vecinos.reduce((s, v) => s + num(v, 'vecino'), 0));
    return { x, sumaDerecha: limpio(sD + (o.incognita === 'derecha' ? x : 0)), sumaIzquierda: limpio(sI + (o.incognita === 'derecha' ? 0 : x)), errores };
  }

  // Quebrada A = P0, P1, …, Pk, B = Pk+1 entre L1 (y = o.arriba) y L2 (y = o.abajo), con A en L1 y B en L2; cada tramo baja.
  // En A, el ángulo se mide con el rayo de L1 que va hacia el lado de P1; en B, con el rayo de L2 hacia el lado de Pk.
  // En cada quiebre, el ángulo convexo Pi−1 Pi Pi+1. Cada ángulo «abre» hacia la derecha o la izquierda (su bisectriz).
  // Regla del serrucho: los que abren a la derecha suman lo mismo que los que abren a la izquierda (cumple, vueltas = 0).
  function serrucho(puntos, o) {
    if (!Array.isArray(puntos) || puntos.length < 3) throw new Error('hacen falta A, al menos un quiebre y B');
    const P = puntos.map((p, i) => ({ x: num(p.x, `x${i}`), y: num(p.y, `y${i}`) }));
    const arriba = o && o.arriba !== undefined ? num(o.arriba, 'arriba') : P[0].y, abajo = o && o.abajo !== undefined ? num(o.abajo, 'abajo') : P[P.length - 1].y;
    if (!(arriba > abajo)) throw new Error('L1 debe estar arriba de L2');
    if (Math.abs(P[0].y - arriba) > TOL || Math.abs(P[P.length - 1].y - abajo) > TOL) throw new Error('A debe estar en L1 y B en L2');
    for (let i = 1; i < P.length - 1; i++)
      if (!(P[i].y < arriba - TOL && P[i].y > abajo + TOL)) throw new Error(`el quiebre ${i} debe estar entre las paralelas`);
    for (let i = 1; i < P.length; i++) if (!(P[i].y < P[i - 1].y - TOL)) throw new Error('cada tramo debe bajar de L1 hacia L2');
    const dir = (Q, R) => Math.atan2(R.y - Q.y, R.x - Q.x) / RAD;
    const ang = (d1, d2) => entreRayos(d1, d2);
    const abre = (d1, d2) => { const bx = Math.cos(d1 * RAD) + Math.cos(d2 * RAD); return bx > 1e-9 ? 'derecha' : bx < -1e-9 ? 'izquierda' : 'ninguno'; };
    const lista = [];
    const n = P.length;
    { const d = dir(P[0], P[1]), ray = P[1].x >= P[0].x ? 0 : 180; lista.push({ vertice: 'A', medida: ang(ray, d), abre: abre(ray, d), rayo: ray, dirs: [ray, d] }); }
    for (let i = 1; i < n - 1; i++) {
      const d1 = dir(P[i], P[i - 1]), d2 = dir(P[i], P[i + 1]);
      lista.push({ vertice: `P${i}`, medida: ang(d1, d2), abre: abre(d1, d2), dirs: [d1, d2] });
    }
    { const d = dir(P[n - 1], P[n - 2]), ray = P[n - 2].x >= P[n - 1].x ? 0 : 180; lista.push({ vertice: 'B', medida: ang(ray, d), abre: abre(ray, d), rayo: ray, dirs: [ray, d] }); }
    const suma = lado => limpio(lista.filter(a => a.abre === lado).reduce((s, a) => s + a.medida, 0));
    const sumaDerecha = suma('derecha'), sumaIzquierda = suma('izquierda');
    const diferencia = limpio(sumaDerecha - sumaIzquierda);
    // La diferencia siempre es un múltiplo de 180° (vueltas); la regla del serrucho es el caso vueltas = 0, que es el de
    // los quiebres «hacia afuera» (como la M o la flecha). Si un quiebre apenas dobla hacia adentro, sale ±180°.
    return { angulos: lista.map(a => Object.assign(a, { medida: limpio(a.medida) })), sumaDerecha, sumaIzquierda, diferencia,
      vueltas: limpio(diferencia / 180), cumple: Math.abs(diferencia) <= 1e-7 };
  }

  // Arma una quebrada desde A con tramos { dir, largo } (dirección en grados); el último tramo solo lleva dir y
  // termina sobre la recta y = abajo. Sirve para dibujar un serrucho con los ángulos que pide un problema.
  function construirQuebrada(A, tramos, abajo) {
    const P = [{ x: num(A.x, 'A.x'), y: num(A.y, 'A.y') }];
    tramos.forEach((t, i) => {
      const d = num(t.dir, 'dir') * RAD, Q = P[P.length - 1];
      let L = t.largo;
      if (i === tramos.length - 1 && L === undefined) {
        if (Math.abs(Math.sin(d)) <= TOL) throw new Error('el último tramo no llega a L2');
        L = (num(abajo, 'abajo') - Q.y) / Math.sin(d);
        if (!(L > 0)) throw new Error('el último tramo no llega a L2');
      }
      num(L, 'largo');
      P.push({ x: limpio(Q.x + L * Math.cos(d)), y: limpio(Q.y + L * Math.sin(d)) });
    });
    return P;
  }
  // La «flecha»: A en L1 (y = alto), B en L2 (y = 0) y el quiebre P a la altura yP, con alfa en A y beta en B (rayos hacia la derecha).
  function construirQuiebre(alfa0, beta0, o) {
    const alfa = num(alfa0, 'alfa'), beta = num(beta0, 'beta');
    if (!(alfa > 0 && alfa < 90 && beta > 0 && beta < 90)) throw new Error('alfa y beta entre 0° y 90°');
    o = Object.assign({ alto: 10, xA: 0 }, o);
    const yP = o.yP === undefined ? o.alto * beta / (alfa + beta) : num(o.yP, 'yP');
    if (!(yP > 0 && yP < o.alto)) throw new Error('el quiebre debe estar entre las paralelas');
    const P = { x: limpio(o.xA + (o.alto - yP) / Math.tan(alfa * RAD)), y: limpio(yP) };
    const B = { x: limpio(P.x - yP / Math.tan(beta * RAD)), y: 0 };
    return { A: { x: o.xA, y: o.alto }, P, B };
  }

  function azar(sem) { let s = (sem >>> 0) || 1; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; }

  return { recta, moverEnRecta, solapados, puntosMedios, mediosEnRecta, medioYDiferencia,
    clase, angulo, cadena, lineal, resolverLineal, resolverAngulo, direccion, entreRayos, bisectrices,
    cruce, ochoAngulos, par, paralelas, ecuacionPar, noParalelas, quiebre, reglaSerrucho, serrucho, construirQuebrada, construirQuiebre, n360, azar };
});
