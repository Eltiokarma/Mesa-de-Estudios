/*
 * Motor de «La cinta del radio»: radianes, arco y sector.
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM:
 * funciona igual en el navegador (window.MotorCinta) y en Node (require('./motor.js')),
 * donde lo prueban casos.json y papel.json.
 *
 * Notación (la de las academias peruanas): S, C y R son el mismo ángulo medido en grados
 * sexagesimales, centesimales y radianes, con S/180 = C/200 = R/π = k. El radio es r, el arco L,
 * el área del sector A y el número de vueltas n. Las unidades de longitud son las del problema.
 * Donde sale π, el motor devuelve además el coeficiente de π (campo ...Pi): L = 2π → Lpi = 2.
 *
 *   convertir({ S } | { C } | { R } | { Rpi })     el ángulo en los tres sistemas (Rpi: R = Rpi·π)
 *   sexagesimal(S), centesimal(C)                   grados, minutos y segundos (60 y 60; 100 y 100)
 *   desdeSexagesimal(g, m, s), desdeCentesimal(g, m, s)
 *   resolverSCR({ S, C, R, Rpi }, total)            a·S + b·C + c·R + d·(R/π) = total → k, S, C, R
 *   radianes(valor, unidad)                         unidad: 'rad', 'pi' (coeficiente de π), 'sex', 'cent', 'vueltas'
 *   sector({ r, theta, unidad, L, A })              con dos datos cualesquiera: θ, r, L = θr, A = θr²/2 = L·r/2
 *   escalarRadio({ r, theta, unidad }, k)           el mismo ángulo con el radio por k: L·k, A·k², cintas igual
 *   trapecio({ r1, r2, theta, unidad } | { L1, L2, h })   trapecio circular: A = (L1 + L2)/2 · h
 *   cintas(theta)                                   cuántas cintas del largo del radio caben en el arco
 *   cintaDoblada(r, f, desde)                       puntos de una cinta de largo r con la fracción f doblada sobre el arco
 *   vueltas({ d, r } | { n, r } | { d, n })         rueda que rueda sin resbalar: n = d/(2πr)
 *   rodar(r, d)                                     posición del centro, giro y marca de la llanta tras avanzar d
 *   alrededor({ fijo, r, lado, phi })               moneda de radio r que rueda por fuera o por dentro de un disco fijo
 *   transmision({ r1, r2, union, n1 | theta1 })     faja, cadena o engranaje (mismo arco) y mismo eje (mismo ángulo)
 *   bicicleta({ plato, pinon, rueda, vueltasPedal }) plato y piñón con cadena; piñón y rueda en el mismo eje
 *   tangentesExternas(c1, r1, c2, r2)               los dos tramos rectos de una faja abierta
 *   tangentesInternas(c1, r1, c2, r2)               los dos tramos de una faja cruzada
 *   fraccion(x, maxDen), textoPi(coef)              para escribir π/3, 2π, 5π/6
 *
 * Cada resultado que es la respuesta de una predicción trae un campo 'errores' con lo que dan los
 * errores típicos de docs/investigacion/trigonometria-ideas-erroneas.md (TR1 a TR6): son las
 * opciones incorrectas de la escena.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorCinta = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const PI = Math.PI, TOL = 1e-9;

  function numero(x, que, o) {
    o = o || {};
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que} debe ser un número`);
    if (o.positivo && !(x > 0)) throw new Error(`${que} debe ser mayor que cero`);
    return x;
  }
  // Redondea el ruido de coma flotante cerca de un entero (60,00000000001 → 60).
  const limpio = x => (Math.abs(x - Math.round(x)) <= TOL * Math.max(1, Math.abs(x)) ? Math.round(x) + 0 : x);

  // ---------- Fracciones y π ----------
  // La fracción más simple con denominador hasta maxDen que vale x (o null).
  function fraccion(x, maxDen) {
    numero(x, 'el número'); maxDen = maxDen || 360;
    for (let q = 1; q <= maxDen; q++) {
      const p = Math.round(x * q);
      if (Math.abs(p / q - x) <= TOL * Math.max(1, Math.abs(x))) return { num: p + 0, den: q };
    }
    return null;
  }
  // El coeficiente de π escrito como en el examen: 1 → 'π', 2 → '2π', 1/3 → 'π/3', 5/6 → '5π/6'. null si no es una fracción simple.
  function textoPi(c) {
    const f = fraccion(c, 360);
    if (!f) return null;
    if (f.num === 0) return '0';
    const s = f.num < 0 ? '−' : '', n = Math.abs(f.num);
    const arriba = n === 1 ? 'π' : `${n}π`;
    return s + (f.den === 1 ? arriba : `${arriba}/${f.den}`);
  }

  // ---------- Sistemas de medida ----------
  // Grados, minutos y segundos: base 60 en el sexagesimal, base 100 en el centesimal.
  function partes(x, base) {
    const signo = x < 0 ? -1 : 1, b2 = base * base;
    let tot = Math.abs(x) * b2;                                  // en segundos
    const cerca = Math.round(tot);
    if (Math.abs(tot - cerca) <= 1e-7) tot = cerca;   // 59,9999999 segundos → 60
    let g = Math.floor(tot / b2), m = Math.floor((tot - g * b2) / base), s = tot - g * b2 - m * base;
    if (s >= base) { s -= base; m += 1; }
    if (m >= base) { m -= base; g += 1; }
    return { signo, grados: g, minutos: m, segundos: s + 0 };
  }
  function sexagesimal(S) { numero(S, 'S'); return partes(S, 60); }
  function centesimal(C) { numero(C, 'C'); return partes(C, 100); }
  function validarPartes(g, m, s, base) {
    numero(g, 'los grados'); numero(m || 0, 'los minutos'); numero(s || 0, 'los segundos');
    if ((m || 0) < 0 || (s || 0) < 0) throw new Error('los minutos y segundos no pueden ser negativos');
    if ((m || 0) >= base || (s || 0) >= base) throw new Error(`los minutos y segundos deben ser menores que ${base}`);
  }
  function desdeSexagesimal(g, m, s) {
    validarPartes(g, m, s, 60); m = m || 0; s = s || 0;
    const S = g + m / 60 + s / 3600;
    // Error típico (hipótesis): leer 27°30' como 27,30°.
    return Object.assign(convertir({ S }), { errores: { comoDecimal: g + m / 100 + s / 10000, ...convertir({ S }).errores } });
  }
  function desdeCentesimal(g, m, s) {
    validarPartes(g, m, s, 100); m = m || 0; s = s || 0;
    const C = g + m / 100 + s / 10000;
    // Error típico (hipótesis): contar los minutos centesimales de 60 en 60.
    return Object.assign(convertir({ C }), { errores: { minutosDeSesenta: g + m / 60 + s / 3600, ...convertir({ C }).errores } });
  }

  // convertir: recibe exactamente una de S, C, R (número de radianes) o Rpi (R = Rpi·π).
  function convertir(o) {
    o = o || {};
    const dados = ['S', 'C', 'R', 'Rpi'].filter(k => o[k] !== undefined);
    if (dados.length !== 1) throw new Error('da exactamente una medida: S, C, R o Rpi');
    const q = dados[0], v = numero(o[q], q);
    const k = q === 'S' ? v / 180 : q === 'C' ? v / 200 : q === 'R' ? v / PI : v;
    const S = limpio(180 * k), C = limpio(200 * k), R = PI * k;
    let errores;
    if (q === 'S') errores = {
      radianesSinPi: v / 180,            // R = S/180: olvida el π (60° → 1/3 en vez de π/3)
      gradosComoRadianes: v,             // TR4: usa el número de grados como si fueran radianes
      factorInvertido: v * 180 / PI,     // multiplica por 180/π en vez de π/180
      centesimalIgual: v,                // cree que el número de grados centesimales es el mismo
    };
    else if (q === 'C') errores = {
      comoSexagesimal: v,                // lee 40ᵍ como 40°
      factorInvertido: v * 200 / 180,    // S = C·200/180 en vez de C·180/200
    };
    else if (q === 'R') errores = {
      leePiEnR: v * 180,                 // TR1: lee 2 rad como 2π rad → 360°
      radianComoGrado: v,                // 2 rad = 2°
      factorInvertido: v * PI / 180,     // multiplica por π/180 en vez de 180/π
    };
    else errores = {
      olvidaPi: v * 180 / PI,            // lee π/12 como 1/12 de radián
      radianComoGrado: v * PI,           // R rad = R°
    };
    return { k, S, C, R, Rpi: k, textoR: textoPi(k), sexagesimal: partes(180 * k, 60), centesimal: partes(200 * k, 100),
      vueltas: k / 2, errores };
  }

  // a·S + b·C + c·R + d·(R/π) = total, con S = 180k, C = 200k, R = πk.
  function resolverSCR(coef, total) {
    coef = coef || {};
    const a = coef.S || 0, b = coef.C || 0, c = coef.R || 0, d = coef.Rpi || 0;
    [a, b, c, d].forEach(x => numero(x, 'cada coeficiente'));
    numero(total, 'el total');
    const den = 180 * a + 200 * b + PI * c + d;
    if (Math.abs(den) < TOL) throw new Error('la ecuación no determina el ángulo');
    const k = total / den;
    const r = convertir({ Rpi: k });
    // Errores típicos (hipótesis): dar k como respuesta; tomar S = C (igualar los dos números).
    r.errores = { kComoRespuesta: k, ...(a + b !== 0 ? { sIgualC: total / (a + b) } : {}) };
    return r;
  }

  // ---------- Ángulo en radianes desde cualquier unidad ----------
  const UNIDADES = ['rad', 'pi', 'sex', 'cent', 'vueltas'];
  function radianes(valor, unidad) {
    numero(valor, 'el ángulo');
    const u = unidad || 'rad';
    if (u === 'rad') return valor;
    if (u === 'pi') return valor * PI;
    if (u === 'sex') return valor * PI / 180;
    if (u === 'cent') return valor * PI / 200;
    if (u === 'vueltas') return valor * 2 * PI;
    throw new Error(`unidad desconocida: ${u} (usa ${UNIDADES.join(', ')})`);
  }

  // ---------- Sector circular ----------
  // Con dos datos cualesquiera entre θ (con su unidad), r, L y A.
  function sector(o) {
    o = o || {};
    let th = o.theta !== undefined ? radianes(o.theta, o.unidad) : undefined;
    let r = o.r !== undefined ? numero(o.r, 'el radio', { positivo: true }) : undefined;
    const Ld = o.L !== undefined ? numero(o.L, 'el arco', { positivo: true }) : undefined;
    const Ad = o.A !== undefined ? numero(o.A, 'el área', { positivo: true }) : undefined;
    const n = [th, r, Ld, Ad].filter(x => x !== undefined).length;
    if (n !== 2) throw new Error('da exactamente dos datos: theta, r, L o A');
    if (th !== undefined && !(th > 0)) throw new Error('el ángulo debe ser mayor que cero');
    if (th === undefined) {
      if (r !== undefined && Ld !== undefined) th = Ld / r;
      else if (r !== undefined) th = 2 * Ad / (r * r);
      else { r = 2 * Ad / Ld; th = Ld / r; }
    } else if (r === undefined) r = Ld !== undefined ? Ld / th : Math.sqrt(2 * Ad / th);
    if (th > 2 * PI * (1 + TOL)) throw new Error('el ángulo de un sector no puede pasar de una vuelta (2π rad)');
    const L = th * r, A = th * r * r / 2, G = th * 180 / PI;
    return {
      theta: th, thetaPi: th / PI, thetaTexto: textoPi(th / PI), grados: limpio(G), centesimales: limpio(th * 200 / PI),
      r, L, Lpi: L / PI, A, Api: A / PI, ALr: L * r / 2, perimetro: 2 * r + L, cintas: th, fraccionCirculo: th / (2 * PI),
      errores: {
        arcoConGrados: G * r,                // TR4: L = 60·6 = 360
        arcoConDiametro: th * 2 * r,         // usa el diámetro en vez del radio
        arcoSinRadio: th,                    // da el ángulo en radianes y olvida multiplicar por r
        arcoIgualRadio: r,                   // TR2: cree que el arco es el radio (o que 60° es 1 rad)
        areaSinMitad: th * r * r,            // olvida el ½
        areaConGrados: G * r * r / 2,        // TR4 en el área: 60·36/2 = 1080
        areaConDiametro: th * 4 * r * r / 2, // usa el diámetro
        areaIgualArco: L,                    // confunde área y arco
      },
    };
  }

  // El mismo ángulo con el radio multiplicado por k (TR2, TR6: las cintas no cambian).
  function escalarRadio(o, k) {
    numero(k, 'k', { positivo: true });
    const a = sector(o), d = sector({ theta: a.theta, r: a.r * k });
    return {
      antes: a, despues: d, k, razonL: d.L / a.L, razonA: d.A / a.A, cintasAntes: a.cintas, cintasDespues: d.cintas,
      errores: {
        cintasProporcionales: a.cintas * k,  // TR6: el ángulo crece con el largo de los lados
        cintasInversas: a.cintas / k,        // el mismo ángulo "se reparte" en una circunferencia más grande
        areaLineal: a.A * k,                 // GE1 (informe de geometría): el área crece igual que el radio
        arcoIgual: a.L,                      // el arco no cambia porque el ángulo no cambia
      },
    };
  }

  // ---------- Trapecio circular ----------
  // { r1, r2, theta, unidad } (r1 < r2) o { L1, L2, h } (arcos menor y mayor, h = r2 − r1).
  function trapecio(o) {
    o = o || {};
    let r1, r2, th, L1, L2, h;
    if (o.L1 !== undefined || o.L2 !== undefined || o.h !== undefined) {
      L1 = numero(o.L1, 'el arco menor', { positivo: true }); L2 = numero(o.L2, 'el arco mayor', { positivo: true });
      h = numero(o.h, 'el ancho h', { positivo: true });
      if (!(L2 > L1)) throw new Error('el arco mayor debe ser mayor que el menor');
      th = (L2 - L1) / h; r1 = L1 / th; r2 = r1 + h;
    } else {
      r1 = numero(o.r1, 'el radio menor', { positivo: true }); r2 = numero(o.r2, 'el radio mayor', { positivo: true });
      if (!(r2 > r1)) throw new Error('el radio mayor debe ser mayor que el menor');
      th = radianes(o.theta, o.unidad);
      if (!(th > 0)) throw new Error('el ángulo debe ser mayor que cero');
      L1 = th * r1; L2 = th * r2; h = r2 - r1;
    }
    if (th > 2 * PI * (1 + TOL)) throw new Error('el ángulo no puede pasar de una vuelta');
    const A = (L1 + L2) / 2 * h;
    return {
      r1, r2, theta: th, thetaPi: th / PI, thetaTexto: textoPi(th / PI), L1, L2, h, A, Api: A / PI,
      Asectores: th * (r2 * r2 - r1 * r1) / 2,   // sector grande menos sector chico: lo mismo
      errores: {
        sinMitad: (L1 + L2) * h,                  // olvida dividir entre 2
        conCuadradoDeLaResta: th * h * h / 2,     // usa (r2 − r1)² en vez de r2² − r1²
        soloSectorGrande: th * r2 * r2 / 2,       // no resta el sector chico
      },
    };
  }

  // ---------- Cintas ----------
  // Cuántas cintas del largo del radio caben en un arco de θ radianes, y en qué tramos.
  function cintas(theta) {
    numero(theta, 'el ángulo');
    if (theta < 0) throw new Error('el ángulo no puede ser negativo');
    const t = limpio(theta), enteras = Math.floor(t + 1e-12), resto = t - enteras, tramos = [];
    for (let k = 0; k < enteras; k++) tramos.push({ k: k + 1, desde: k, hasta: k + 1, completa: true });
    if (resto > 1e-9) tramos.push({ k: enteras + 1, desde: enteras, hasta: t, completa: false });
    return { total: t, enteras, resto: resto > 1e-9 ? resto : 0, tramos };
  }
  // Una cinta de largo r que empieza en el punto de la circunferencia de ángulo 'desde' (rad, antihorario):
  // la fracción f (0 a 1) ya está doblada sobre el arco y el resto sigue recta, tangente. Puntos en coordenadas
  // con el centro en el origen.
  function cintaDoblada(r, f, desde, muestras) {
    numero(r, 'el radio', { positivo: true }); numero(f, 'f');
    f = Math.max(0, Math.min(1, f)); desde = desde || 0; muestras = muestras || 32;
    const pts = [], nArc = Math.max(1, Math.ceil(muestras * f));
    for (let j = 0; j <= nArc; j++) { const a = desde + f * j / nArc; pts.push({ x: r * Math.cos(a), y: r * Math.sin(a) }); }
    const a = desde + f, recto = (1 - f) * r;
    if (recto > 1e-12) pts.push({ x: r * Math.cos(a) - recto * Math.sin(a), y: r * Math.sin(a) + recto * Math.cos(a) });
    let largo = 0;
    for (let j = 1; j < pts.length; j++) largo += Math.hypot(pts[j].x - pts[j - 1].x, pts[j].y - pts[j - 1].y);
    return { puntos: pts, enArco: f * r, recto, largo };
  }

  // ---------- Ruedas ----------
  // Rueda de radio r que rueda sin resbalar: avanza d = 2πr por vuelta.
  function vueltas(o) {
    o = o || {};
    let d = o.d, r = o.r, n = o.n;
    const dados = [d, r, n].filter(x => x !== undefined).length;
    if (dados !== 2) throw new Error('da dos datos: d, r o n');
    if (d !== undefined) numero(d, 'la distancia', { positivo: true });
    if (r !== undefined) numero(r, 'el radio', { positivo: true });
    if (n !== undefined) numero(n, 'las vueltas', { positivo: true });
    if (n === undefined) n = d / (2 * PI * r);
    else if (d === undefined) d = 2 * PI * r * n;
    else r = d / (2 * PI * n);
    return {
      n: limpio(n), d, dPi: d / PI, r, giro: d / r, perimetro: 2 * PI * r,
      errores: {
        sinDosPi: d / r,               // d/r: da el ángulo girado en radianes, no las vueltas
        conPiR: d / (PI * r),          // toma el perímetro como πr
        conDiametro: d / (4 * PI * r), // pone el diámetro en 2πr
      },
    };
  }
  // Tras avanzar d hacia la derecha sobre un piso recto (y = 0): centro, giro (rad, horario) y la marca de la
  // llanta que empezó tocando el piso en x = 0 (una cicloide).
  function rodar(r, d) {
    numero(r, 'el radio', { positivo: true }); numero(d, 'la distancia');
    const g = d / r;
    return { centro: { x: d, y: r }, giro: g, vueltas: g / (2 * PI), marca: { x: d - r * Math.sin(g), y: r - r * Math.cos(g) },
      contacto: { x: d, y: 0 }, huella: d };
  }
  // Moneda de radio r que rueda sin resbalar alrededor de un disco fijo de radio 'fijo' (por fuera o por dentro).
  // phi es el ángulo (rad, antihorario) que recorrió el centro de la moneda alrededor del centro del disco.
  function alrededor(o) {
    o = o || {};
    const R = numero(o.fijo, 'el radio del disco', { positivo: true }), r = numero(o.r, 'el radio de la moneda', { positivo: true });
    const lado = o.lado || 'fuera';
    if (lado !== 'fuera' && lado !== 'dentro') throw new Error("lado debe ser 'fuera' o 'dentro'");
    if (lado === 'dentro' && !(R > r)) throw new Error('por dentro, el disco debe ser más grande que la moneda');
    const dc = lado === 'fuera' ? R + r : R - r, phi = o.phi === undefined ? 2 * PI : numero(o.phi, 'phi');
    // Giro de la moneda respecto de la mesa: por fuera, en el mismo sentido que el centro; por dentro, al revés.
    const giro = (lado === 'fuera' ? 1 : -1) * phi * dc / r;
    return {
      lado, vueltas: limpio(dc / r), recorridoCentro: 2 * PI * dc, recorridoCentroPi: 2 * dc, arcoContacto: 2 * PI * R,
      centro: { x: dc * Math.cos(phi), y: dc * Math.sin(phi) }, giro, vueltasHasta: Math.abs(giro) / (2 * PI),
      errores: {
        soloArco: R / r,                                       // cuenta solo el arco del disco que toca (hipótesis)
        conDiametros: 2 * R / r,                               // usa diámetros (hipótesis)
        ladoContrario: (lado === 'fuera' ? R - r : R + r) / r, // confunde por fuera con por dentro (hipótesis)
      },
    };
  }
  // Transmisión entre dos ruedas. union: 'faja' (abierta: mismo sentido), 'cruzada', 'engranaje' (sentido contrario)
  // — en las tres, los bordes recorren el mismo arco: θ1·r1 = θ2·r2 — y 'eje' (mismo ángulo: θ1 = θ2).
  function transmision(o) {
    o = o || {};
    const r1 = numero(o.r1, 'r1', { positivo: true }), r2 = numero(o.r2, 'r2', { positivo: true });
    const union = o.union || 'faja';
    if (!['faja', 'cruzada', 'engranaje', 'eje'].includes(union)) throw new Error('union: faja, cruzada, engranaje o eje');
    let th1;
    if (o.n1 !== undefined && o.theta1 !== undefined) throw new Error('da n1 o theta1, no los dos');
    if (o.n1 !== undefined) th1 = 2 * PI * numero(o.n1, 'n1');
    else if (o.theta1 !== undefined) th1 = radianes(o.theta1, o.unidad);
    else throw new Error('falta n1 o theta1');
    const mismoArco = union !== 'eje';
    const th2 = mismoArco ? th1 * r1 / r2 : th1;
    const n1 = th1 / (2 * PI);
    // Los errores van en la misma unidad que el dato: en vueltas si se dio n1 (comparar con n2) y en radianes si
    // se dio theta1 (comparar con theta2).
    const u = o.n1 !== undefined ? n1 : th1;
    return {
      union, r1, r2, theta1: th1, theta2: th2, n1: limpio(n1), n2: limpio(th2 / (2 * PI)),
      L1: th1 * r1, L2: th2 * r2, mismoSentido: union === 'faja' || union === 'eje',
      unidadErrores: o.n1 !== undefined ? 'vueltas' : 'rad',
      errores: mismoArco ? {
        mismoAngulo: u,                   // cree que las dos dan las mismas vueltas (o giran el mismo ángulo)
        proporcional: u * r2 / r1,        // cree que la grande da más vueltas
      } : {
        mismoArco: u * r1 / r2,           // aplica la regla de la faja a ruedas en el mismo eje
        proporcional: u * r2 / r1,
      },
    };
  }
  // Plato (con los pedales) y piñón unidos por la cadena; el piñón y la rueda trasera en el mismo eje.
  function bicicleta(o) {
    o = o || {};
    const plato = numero(o.plato, 'el radio del plato', { positivo: true }), pinon = numero(o.pinon, 'el radio del piñón', { positivo: true });
    const rueda = numero(o.rueda, 'el radio de la rueda', { positivo: true });
    const nP = o.vueltasPedal === undefined ? 1 : numero(o.vueltasPedal, 'las vueltas del pedal', { positivo: true });
    const nPin = nP * plato / pinon, avance = nPin * 2 * PI * rueda;
    return {
      vueltasPedal: nP, vueltasPinon: limpio(nPin), vueltasRueda: limpio(nPin), avance, avancePi: avance / PI,
      cadena: nP * 2 * PI * plato,
      errores: {
        mismasVueltas: nP,                 // la rueda da las mismas vueltas que el pedal
        invertido: nP * pinon / plato,     // divide al revés
        ejeComoFaja: nP * plato / rueda,   // trata la rueda como si la moviera la cadena
      },
    };
  }
  // Los dos tramos rectos de una faja abierta entre dos circunferencias (centros c1 y c2).
  function tangentesExternas(c1, r1, c2, r2) {
    const P = p => (Array.isArray(p) ? { x: p[0], y: p[1] } : { x: p.x, y: p.y });
    c1 = P(c1); c2 = P(c2); numero(r1, 'r1', { positivo: true }); numero(r2, 'r2', { positivo: true });
    const dx = c2.x - c1.x, dy = c2.y - c1.y, d = Math.hypot(dx, dy);
    if (!(d > Math.abs(r1 - r2))) throw new Error('una rueda está dentro de la otra: no hay faja abierta');
    const a = Math.atan2(dy, dx), b = Math.acos((r1 - r2) / d);
    return [a + b, a - b].map(t => ({
      p1: { x: c1.x + r1 * Math.cos(t), y: c1.y + r1 * Math.sin(t) },
      p2: { x: c2.x + r2 * Math.cos(t), y: c2.y + r2 * Math.sin(t) },
      angulo: t,
    }));
  }

  // Los dos tramos rectos de una faja cruzada (se cruzan entre las ruedas): en cada tramo, la normal en la rueda 2
  // apunta al revés que en la rueda 1, y cos(t − a) = (r1 + r2)/d.
  function tangentesInternas(c1, r1, c2, r2) {
    const P = p => (Array.isArray(p) ? { x: p[0], y: p[1] } : { x: p.x, y: p.y });
    c1 = P(c1); c2 = P(c2); numero(r1, 'r1', { positivo: true }); numero(r2, 'r2', { positivo: true });
    const dx = c2.x - c1.x, dy = c2.y - c1.y, d = Math.hypot(dx, dy);
    if (!(d > r1 + r2)) throw new Error('las ruedas se tocan o se enciman: no hay faja cruzada');
    const a = Math.atan2(dy, dx), b = Math.acos((r1 + r2) / d);
    return [a + b, a - b].map(t => ({
      p1: { x: c1.x + r1 * Math.cos(t), y: c1.y + r1 * Math.sin(t) },
      p2: { x: c2.x - r2 * Math.cos(t), y: c2.y - r2 * Math.sin(t) },
      angulo: t,
    }));
  }

  return { PI, UNIDADES, tangentesInternas, convertir, sexagesimal, centesimal, desdeSexagesimal, desdeCentesimal, resolverSCR, radianes,
    sector, escalarRadio, trapecio, cintas, cintaDoblada, vueltas, rodar, alrededor, transmision, bicicleta,
    tangentesExternas, fraccion, textoPi };
});
